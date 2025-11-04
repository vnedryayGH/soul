from __future__ import annotations

import json
import os
import re
import urllib.request
from dataclasses import asdict, dataclass
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_db_session
from ..middleware.rbac_middleware import require_permission
from ..services.hyperloop_engine import HyperloopEngine
from ..services.signature_sdk import SignatureContext, persist_signature_steps


router = APIRouter(prefix="/api/macros", tags=["macros"], dependencies=[Depends(require_permission("soul.admin"))])


# --------- Helpers ---------


def _strict_ok(items: list[dict[str, Any]]) -> bool:
    try:
        return all(str((i or {}).get("status", "")).lower() in {"passed", "ok", "success", "succeeded"} for i in items)
    except Exception:
        return False


async def _run_inspector(engine: HyperloopEngine, db: AsyncSession, key: str, ctx: dict[str, Any] | None = None) -> dict[str, Any]:
    try:
        return await engine._execute_inspector(db=db, key=key, scope=None, extra_context=(ctx or {}))  # type: ignore[attr-defined]
    except Exception as e:  # pragma: no cover
        return {"status": "failed", "detail": str(e)}


async def _aux_llm_completion(prompt: str, timeout: float = 8.0) -> str | None:
    try:
        url = "http://127.0.0.1:8000/api/aux-llm/completion"
        body = json.dumps({"prompt": prompt, "n_predict": 256, "temperature": 0.2}).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", "replace")
            data = json.loads(raw or "{}")
            if isinstance(data, dict):
                return (data.get("content") or "").strip() or None
    except Exception:
        return None
    return None


def _mk_envelope(type_key: str, title: str, text: str, source_key: str) -> dict[str, Any]:
    # Minimal envelope compatible with AttentionService.upsert_artifact
    return {
        "type": type_key,
        "title": title,
        "body": {"text": text},
        "tags": [type_key],
        "source": {"kind": "macro", "key": source_key},
    }


# --------- Schemas ---------


class ProjectBootstrapRequest(BaseModel):
    owner: int = Field(...)
    name: str = Field(..., min_length=3)
    branch: str = Field(..., min_length=2)
    topic: str | None = Field(None)
    methodology: dict[str, Any] | None = Field(None, description="{features:{type,risk_level,...}}")
    org_id: str | None = Field(None)
    agent_id: str | None = Field(None)


class KnowledgeWarmupRequest(BaseModel):
    project_id: str = Field(...)
    keywords: list[str] = Field(default_factory=list)
    org_id: str | None = None
    agent_id: str | None = None


class ReleaseGateRequest(BaseModel):
    project_id: str = Field(...)
    org_id: str | None = None
    agent_id: str | None = None


class AlignRequest(BaseModel):
    target: str = Field("core", regex="^(core|de|both)$")
    rev_hint: str | None = None
    two_keys_request_id: str = Field(..., min_length=8)
    project_id: str | None = None
    org_id: str | None = None
    agent_id: str | None = None


class FocusEnforceRequest(BaseModel):
    owner: int
    branch: str
    topic: str | None = None
    org_id: str
    agent_id: str
    work_item_id: str | None = None


class TrizRunRequest(BaseModel):
    goal: str
    mode: str | None = Field("compact", regex="^(compact|deep)$")
    org_id: str
    agent_id: str
    work_item_id: str | None = None


# --------- PROJECT.BOOTSTRAP ---------


@router.post("/project/bootstrap")
async def project_bootstrap(payload: ProjectBootstrapRequest, db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    sig = SignatureContext()
    eng = HyperloopEngine()

    # 1) SESSION.CLAIM (idempotent)
    claim_cmd = f'SESSION.CLAIM owner="{payload.owner}" branch="{payload.branch}"' + (f' topic="{payload.topic}"' if payload.topic else "")
    res_claim = await eng.execute(commands_text=claim_cmd, db=db, signature_ctx=sig, options={})

    # 2) PROJECT.CREATE
    create_cmd = f'PROJECT.CREATE name="{payload.name}" owner={payload.owner}'
    res_create = await eng.execute(commands_text=create_cmd, db=db, signature_ctx=sig, options={})
    pid: str | None = None
    try:
        for it in (res_create.get("results") or []):
            if isinstance(it, dict) and str(it.get("command", "")).startswith("PROJECT.CREATE"):
                pid = (it.get("data") or {}).get("project_id")
                break
    except Exception:
        pid = None
    if not pid:
        # Best-effort lookup (PROJECT.LIST owner)
        try:
            lst = await eng.execute(commands_text=f'PROJECT.LIST owner={payload.owner}', db=db, signature_ctx=sig, options={})
            items = ((lst or {}).get("results") or [])
            for r in items:
                d = (r or {}).get("data") or {}
                for it in (d.get("items") or []):
                    if str(it.get("name") or "").strip() == payload.name:
                        pid = str(it.get("id"))
                        break
                if pid:
                    break
        except Exception:
            pass
    if not pid:
        raise HTTPException(status_code=500, detail="project_id_not_resolved")

    # 3) PROJECT.LOG.SET + UPDATE_OP
    log_path = f'Plan/P40_Project_Log_Methodology/PROJECT_LOG_{pid}.md'
    await eng.execute(commands_text=f'PROJECT.LOG.SET id={pid} path="{log_path}"', db=db, signature_ctx=sig, options={})
    await eng.execute(commands_text=f'PROJECT.LOG.UPDATE_OP project_id={pid} step_title="project.init" step_result="ok"', db=db, signature_ctx=sig, options={})

    # 4) Focus artifacts (optional)
    if payload.org_id and payload.agent_id:
        goal_env = _mk_envelope("goal", f"Goal: {payload.name}", f"Branch: {payload.branch}; Topic: {payload.topic or ''}", "PROJECT.BOOTSTRAP")
        await eng.execute(
            commands_text=(
                f'FOCUS.UPSERT_ARTIFACT org_id={payload.org_id} agent_id={payload.agent_id} '
                f'envelope_json={json.dumps(goal_env, ensure_ascii=False)}'
            ),
            db=db,
            signature_ctx=sig,
            options={},
        )

    # 5) INSPECTOR.RUN_ALL (best-effort)
    res_all = await eng.execute(commands_text='INSPECTOR.RUN_ALL', db=db, signature_ctx=sig, options={})
    try:
        _ = await persist_signature_steps(db, sig)
        await db.commit()
    except Exception:
        pass

    return {
        "ok": True,
        "data": {
            "project_id": pid,
            "log_path": log_path,
            "session": {"claimed": True, "branch": payload.branch},
            "inspectors": {"run_all": {"ok": bool((res_all or {}).get("ok", True))}},
        },
    }


# --------- KNOWLEDGE.WARMUP ---------


@router.post("/knowledge/warmup")
async def knowledge_warmup(payload: KnowledgeWarmupRequest, db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    # Local scan of docs/Soul by keywords
    kws = [k.strip().lower() for k in (payload.keywords or []) if str(k).strip()]
    matches: list[dict[str, Any]] = []
    if kws:
        import glob

        for path in glob.glob("docs/**/*.md", recursive=True) + glob.glob("Soul/**/*.md", recursive=True):
            try:
                with open(path, "r", encoding="utf-8", errors="replace") as f:
                    txt = f.read()
                score = sum(txt.lower().count(k) for k in kws)
                if score > 0:
                    title = path
                    for ln in txt.splitlines()[:30]:
                        if ln.strip().startswith("#"):
                            title = ln.lstrip("# ").strip()
                            break
                    matches.append({"path": path, "score": int(score), "title": title})
            except Exception:
                continue
        matches.sort(key=lambda r: int(r.get("score", 0)), reverse=True)
        matches = matches[:10]

    # AUX‑LLM summarization (optional, best‑effort)
    plan_text = None
    if kws:
        prompt = (
            "Сформируй краткий план работ (маркированный список) по ключам: "
            + ", ".join(kws[:8])
            + ". Фокус на практических шагах и приёмке."
        )
        plan_text = await _aux_llm_completion(prompt)  # may be None
    if not plan_text:
        plan_text = "- Определить объём знаний\n- Подготовить артефакты Focus\n- Запустить инспекторы и смоки"

    # Focus artifact (optional)
    rev_id = None
    if payload.org_id and payload.agent_id:
        eng = HyperloopEngine()
        sig = SignatureContext()
        env = _mk_envelope("plan", "План работ", plan_text, "KNOWLEDGE.WARMUP")
        res = await eng.execute(
            commands_text=(
                f'FOCUS.UPSERT_ARTIFACT org_id={payload.org_id} agent_id={payload.agent_id} '
                f'envelope_json={json.dumps(env, ensure_ascii=False)}'
            ),
            db=db,
            signature_ctx=sig,
            options={},
        )
        try:
            for it in (res.get("results") or []):
                if isinstance(it, dict) and str(it.get("command", "")).startswith("FOCUS.UPSERT_ARTIFACT"):
                    rev_id = (it.get("data") or {}).get("artifact_rev_id")
                    break
        except Exception:
            rev_id = None

    return {"ok": True, "data": {"summaries": matches, "focus_artifact_id": rev_id}}


# --------- RELEASE.GREEN_GATE ---------


@router.post("/release/green-gate")
async def release_green_gate(payload: ReleaseGateRequest, db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    eng = HyperloopEngine()
    keys = [
        "inspectors.coherence",
        "pages.registry_guard",
        "delivery_guard.smoke",
        "guard.canonical.tree",
        "orphaned_scripts",
        "db.alembic.heads_enforcer",
    ]
    results: list[dict[str, Any]] = []
    for k in keys:
        results.append({"key": k, **(await _run_inspector(eng, db, k))})
    ok = _strict_ok(results)

    # Focus acceptance (optional)
    if ok and payload.org_id and payload.agent_id:
        sig = SignatureContext()
        env = _mk_envelope("acceptance", "Приёмка релиза", "Green Gate: все инспекторы passed", "RELEASE.GREEN_GATE")
        await eng.execute(
            commands_text=(
                f'FOCUS.UPSERT_ARTIFACT org_id={payload.org_id} agent_id={payload.agent_id} '
                f'envelope_json={json.dumps(env, ensure_ascii=False)}'
            ),
            db=db,
            signature_ctx=sig,
            options={},
        )

    return {"ok": ok, "data": {"results": results, "accepted": ok}}


# --------- SECRETS.HEALTH ---------


@router.get("/secrets/health")
async def secrets_health(db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    try:
        from tools.catalog.active.admin.secrets_admin import secrets_health as _secrets_health  # type: ignore

        res = await _secrets_health(db)  # type: ignore[misc]
        return {"ok": True, "data": res}
    except Exception:
        # Fallback: minimal inline check
        try:
            from sqlalchemy import text as _t  # type: ignore

            row_ext = (await db.execute(_t("select 1 from pg_extension where extname='pgcrypto'"))).first()
            row_tbl = (await db.execute(_t("select to_regclass('public.soul_secrets')"))).first()
            row_mk = (
                await db.execute(_t("select value from soul_settings where key = 'secrets.master_key' limit 1"))
            ).first()
            return {
                "ok": True,
                "data": {
                    "pgcrypto": bool(row_ext),
                    "table_exists": bool(row_tbl and row_tbl[0]),
                    "master_key_configured": bool(row_mk and row_mk[0]),
                },
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# --------- MIGRATIONS.ALIGN_ONE_STEP ---------


@router.post("/migrations/align")
async def migrations_align(payload: AlignRequest, db: AsyncSession = Depends(get_db_session), current_user: Any = Depends(require_permission("soul.admin"))) -> dict[str, Any]:
    from . import agent_exec as agent_exec_router  # local import to reuse ExecRequest and helpers

    sig = SignatureContext()
    eng = HyperloopEngine()

    # Preflight inspectors (best-effort)
    pre = ["migration.guard", "db.alembic.heads_enforcer", "db.health"]
    pre_res = [await _run_inspector(eng, db, k) for k in pre]
    if not _strict_ok(pre_res):
        return {"ok": False, "errors": [{"code": "inspector_failed", "message": "preflight inspectors failed", "details": {"results": pre_res}}]}

    # Resolve target revision
    rev = (payload.rev_hint or "").strip()
    if not rev:
        try:
            heads = agent_exec_router._compute_heads_py()  # type: ignore[attr-defined]
            if not heads:
                return {"ok": False, "errors": [{"code": "head_resolution_failed", "message": "no heads found"}]}
            if len(heads) > 1:
                return {"ok": False, "errors": [{"code": "head_resolution_failed", "message": f"multiple heads: {heads}"}]}
            rev = heads[0]
        except Exception as e:
            return {"ok": False, "errors": [{"code": "head_resolution_failed", "message": str(e)}]}

    rid = payload.two_keys_request_id.strip()
    if not rid:
        return {"ok": False, "errors": [{"code": "two_keys_denied", "message": "request_id required"}]}

    # Verify Two-Keys approval
    try:
        from tools.catalog.active.admin.two_keys_admin import verify_two_keys_approval  # type: ignore

        ok, reason, _i, _a = await verify_two_keys_approval(db, rid)
    except Exception:
        ok, reason = False, "two_keys_unavailable"
    if not ok:
        return {"ok": False, "errors": [{"code": "two_keys_denied", "message": reason}]}

    # Align per target
    def _exec_req(op: str, **kwargs: Any) -> agent_exec_router.ExecRequest:  # type: ignore[name-defined]
        req = agent_exec_router.ExecRequest(op=op)  # type: ignore[attr-defined]
        for k, v in kwargs.items():
            setattr(req, k, v)
        return req

    results: list[dict[str, Any]] = []
    # core: prefer force_set
    if payload.target in ("core", "both"):
        req = _exec_req("alembic.force_set", rev=rev, two_keys_request_id=rid)
        out = await agent_exec_router.agent_exec(req, db=db, current_user=current_user)  # type: ignore[misc]
        results.append({"target": "core", **out})
        if not bool(out.get("ok")):
            return {"ok": False, "errors": [{"code": "align_failed", "message": "force_set failed", "details": out}]}
    # de: use stamp_subproc base -> rev with DB_TARGET
    if payload.target in ("de", "both"):
        # base
        req_b = _exec_req("alembic.stamp_subproc", rev="base", two_keys_request_id=rid, options={"db_target": "de"})
        out_b = await agent_exec_router.agent_exec(req_b, db=db, current_user=current_user)  # type: ignore[misc]
        # rev
        req_r = _exec_req("alembic.stamp_subproc", rev=rev, two_keys_request_id=rid, options={"db_target": "de"})
        out_r = await agent_exec_router.agent_exec(req_r, db=db, current_user=current_user)  # type: ignore[misc]
        if not bool(out_b.get("ok")) or not bool(out_r.get("ok")):
            return {"ok": False, "errors": [{"code": "align_failed", "message": "stamp_subproc failed", "details": {"base": out_b, "rev": out_r}}]}
        results.append({"target": "de", "base": out_b, "rev": out_r})

    # Post-check current
    cur = await agent_exec_router.agent_exec(agent_exec_router.ExecRequest(op="alembic.current"), db=db, current_user=current_user)  # type: ignore[misc]
    current = (cur or {}).get("current") or []
    # Post inspectors
    post = [await _run_inspector(eng, db, "db.alembic.heads_enforcer"), await _run_inspector(eng, db, "db.health")]
    if not (isinstance(current, list) and (rev in current) and _strict_ok(post)):
        return {"ok": False, "errors": [{"code": "post_validation_failed", "message": "status mismatch", "details": {"current": current, "inspectors": post}}]}

    # Focus artifact (optional)
    if payload.org_id and payload.agent_id:
        env = _mk_envelope("migration_align", "ALIGN Alembic", f"target={payload.target}, rev={rev}", "MIGRATIONS.ALIGN_ONE_STEP")
        _ = await HyperloopEngine().execute(
            commands_text=(
                f'FOCUS.UPSERT_ARTIFACT org_id={payload.org_id} agent_id={payload.agent_id} '
                f'envelope_json={json.dumps(env, ensure_ascii=False)}'
            ),
            db=db,
            signature_ctx=SignatureContext(),
            options={},
        )

    return {"ok": True, "data": {"target": payload.target, "rev": rev, "current": current, "results": results}}


# --------- DEPLOY.RUN_TRIZ_PATH ---------


@router.post("/deploy/run-triz")
async def deploy_run_triz(payload: dict[str, Any] = Body(default_factory=dict), db: AsyncSession = Depends(get_db_session), current_user: Any = Depends(require_permission("soul.admin"))) -> dict[str, Any]:
    from . import agent_exec as agent_exec_router

    preflight_only = bool((payload or {}).get("preflight_only"))
    # transfer_guard (preflight)
    g_req = agent_exec_router.ExecRequest(op="deploy.transfer_guard", options={"preflight_only": True})  # type: ignore[attr-defined]
    g_out = await agent_exec_router.agent_exec(g_req, db=db, current_user=current_user)  # type: ignore[misc]
    if not bool(g_out.get("ok")):
        return {"ok": False, "errors": [{"code": "guard_failed", "message": "transfer_guard failed", "details": g_out}]}
    if preflight_only:
        return {"ok": True, "data": {"guard": g_out}}

    # orchestrator
    o_req = agent_exec_router.ExecRequest(op="deploy.transfer_orchestrator", options={})  # type: ignore[attr-defined]
    o_out = await agent_exec_router.agent_exec(o_req, db=db, current_user=current_user)  # type: ignore[misc]
    ok = bool(o_out.get("ok"))
    return {"ok": ok, "data": {"orchestrator": o_out}}


# --------- FOCUS.ENFORCE ---------


@router.post("/focus/enforce")
async def focus_enforce(payload: FocusEnforceRequest, db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    sig = SignatureContext()
    eng = HyperloopEngine()
    # SESSION.CLAIM
    claim_cmd = f'SESSION.CLAIM owner="{payload.owner}" branch="{payload.branch}"' + (f' topic="{payload.topic}"' if payload.topic else "")
    _ = await eng.execute(commands_text=claim_cmd, db=db, signature_ctx=sig, options={})
    # FOCUS.RESUME is handled by attention service via REST; here we upsert init artifact directly (idempotent)
    env = _mk_envelope("init", "Инициализация фокуса", f"branch={payload.branch}", "FOCUS.ENFORCE")
    res = await eng.execute(
        commands_text=(
            f'FOCUS.UPSERT_ARTIFACT org_id={payload.org_id} agent_id={payload.agent_id} '
            f'envelope_json={json.dumps(env, ensure_ascii=False)}'
        ),
        db=db,
        signature_ctx=sig,
        options={},
    )
    rev = None
    try:
        for it in (res.get("results") or []):
            if isinstance(it, dict) and str(it.get("command", "")).startswith("FOCUS.UPSERT_ARTIFACT"):
                rev = (it.get("data") or {}).get("artifact_rev_id")
                break
    except Exception:
        rev = None
    return {"ok": True, "data": {"session": {"claimed": True}, "focus": {"resumed": True, "artifact_rev_id": rev}}}


# --------- TRIZ.PIPELINE.RUN ---------


@router.post("/triz/run")
async def triz_pipeline_run(payload: TrizRunRequest, db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    # Use AUX‑LLM to draft a compact plan
    prompt = (
        "Ты — инженер ТРИЗ. Для цели: '"
        + payload.goal
        + "' сформируй краткий план (5–8 пунктов) и принципы."
    )
    plan = await _aux_llm_completion(prompt) or "- Сегментация задачи\n- Предварительное действие\n- Локальное качество\n- Динамичность"

    eng = HyperloopEngine()
    sig = SignatureContext()
    # goal artifact
    env_goal = _mk_envelope("goal", "TRIZ Goal", payload.goal, "TRIZ.PIPELINE.RUN")
    env_plan = _mk_envelope("plan", "TRIZ Plan", plan, "TRIZ.PIPELINE.RUN")
    env_acc = _mk_envelope("acceptance", "TRIZ Acceptance", "План сформирован и зафиксирован в Focus", "TRIZ.PIPELINE.RUN")
    for env in (env_goal, env_plan, env_acc):
        await eng.execute(
            commands_text=(
                f'FOCUS.UPSERT_ARTIFACT org_id={payload.org_id} agent_id={payload.agent_id} '
                f'envelope_json={json.dumps(env, ensure_ascii=False)}'
            ),
            db=db,
            signature_ctx=sig,
            options={},
        )
    # Sanity inspector
    _ = await _run_inspector(eng, db, "inspectors.triz_sanity")
    try:
        _ = await persist_signature_steps(db, sig)
        await db.commit()
    except Exception:
        pass
    return {"ok": True, "data": {"plan": {"text": plan}}}


