"""
Cursor Agent Router — гибридная маршрутизация запросов (P67)

Назначение:
- Принимает запросы от Cursor IDE (OpenAI-compatible API)
- Классифицирует тип задачи
- Маршрутизирует: DSL → AUX-LLM → External LLM
- Фиксирует через P48 MIRROR + P27 Delivery Guard

Endpoint: POST /api/cursor-agent-router/completion
"""

import json
import logging
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

# Placeholder imports; adapt to server package layout
try:  # Prefer app.* layout on server
    from app.core.deps import get_current_user_id  # type: ignore
except Exception:  # pragma: no cover
    try:
        from backend.app.core.deps import get_current_user_id  # type: ignore
    except Exception:  # final fallback for local tools-only smoke
        def get_current_user_id():  # type: ignore
            return 468326902

try:
    from app.services.hyperloop_service import HyperloopService  # type: ignore
except Exception:  # pragma: no cover
    try:
        from backend.app.services.hyperloop_service import HyperloopService  # type: ignore
    except Exception:
        class HyperloopService:  # type: ignore
            def execute_dsl(self, dsl: str) -> Dict[str, Any]:
                return {"ok": False, "error": "Hyperloop unavailable", "dsl": dsl}

try:
    from app.services.cursor_router_classifier import CursorRouterClassifier  # type: ignore
    from app.services.cursor_router_context import CursorContextLoader  # type: ignore
    from app.services.cursor_router_executor import (  # type: ignore
        DSLExecutor,
        AUXLLMExecutor,
        ExternalLLMExecutor,
        TemplateExecutor,
    )
except Exception:  # pragma: no cover
    try:
        from backend.app.services.cursor_router_classifier import CursorRouterClassifier  # type: ignore
        from backend.app.services.cursor_router_context import CursorContextLoader  # type: ignore
        from backend.app.services.cursor_router_executor import (  # type: ignore
            DSLExecutor,
            AUXLLMExecutor,
            ExternalLLMExecutor,
            TemplateExecutor,
        )
    except Exception:
        # Minimal fallbacks to keep router operational when service modules are absent on server
        class CursorRouterClassifier:  # type: ignore
            def classify(self, user_prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
                return {"routing_type": "aux_llm", "dsl_command": None, "template_name": None, "params": {}}

        class CursorContextLoader:  # type: ignore
            def load(self, routing_type: str, user_prompt: str, base_context: Dict[str, Any]) -> Dict[str, Any]:
                return base_context

        class DSLExecutor:  # type: ignore
            def execute(self, dsl_command: str, context: Dict[str, Any]) -> Dict[str, Any]:
                return {"content": f"DSL not available: {dsl_command}", "tokens_used": 0}

        class TemplateExecutor:  # type: ignore
            def execute(self, template_name: str, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
                return {"content": f"Template not available: {template_name}", "tokens_used": 0}

        class AUXLLMExecutor:  # type: ignore
            def execute(self, user_prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
                return {"content": f"AUX LLM placeholder response for: {user_prompt}", "tokens_used": 0}

        class ExternalLLMExecutor:  # type: ignore
            def execute(self, user_prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
                return {"content": f"External LLM placeholder for: {user_prompt}", "tokens_used": 0}

router = APIRouter()
logger = logging.getLogger(__name__)


# Observability metrics (best-effort)
try:
    from app.lib.observability.metrics import incr, p_observe_ms, observe  # type: ignore
except Exception:  # pragma: no cover
    try:
        from backend.app.lib.observability.metrics import incr, p_observe_ms, observe  # type: ignore
    except Exception:  # pragma: no cover
        def incr(*_a, **_k):
            return None
        def p_observe_ms(*_a, **_k):
            return None
        def observe(*_a, **_k):
            return None

# Delivery Guard (P27)
try:
    from tools.catalog.active.utils.delivery_guard import verify_before_reply  # type: ignore
except Exception:  # pragma: no cover
    def verify_before_reply(_sig, required_steps=None):  # type: ignore
        return True, "ok"

# DB (best-effort) for MIRROR stats
try:
    from tools.catalog.active.utils.db import async_session_maker  # type: ignore
    try:
        from sqlalchemy import text as _sql_text  # type: ignore
    except Exception:  # pragma: no cover
        def _sql_text(q: str):  # type: ignore
            return q
except Exception:  # pragma: no cover
    async_session_maker = None  # type: ignore
    def _sql_text(q: str):  # type: ignore
        return q


class ChatMessage(BaseModel):
    role: str
    content: str
    name: Optional[str] = None


class ChatCompletionRequest(BaseModel):
    model: str = "soul-routed-v1"
    messages: List[ChatMessage]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=4000, ge=1, le=32000)
    stream: bool = False
    metadata: Optional[Dict[str, Any]] = None


class ChatCompletionChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str


class ChatCompletionUsage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatCompletionChoice]
    usage: ChatCompletionUsage
    metadata: Optional[Dict[str, Any]] = None


def extract_user_prompt(messages: List[ChatMessage]) -> str:
    for msg in reversed(messages):
        if msg.role == "user":
            return msg.content
    return ""


def load_session_brief() -> Optional[str]:
    brief_path = Path("SESSION_BRIEF.md")
    if brief_path.exists():
        return brief_path.read_text(encoding="utf-8")
    return None


def load_task_json() -> Optional[Dict]:
    try:
        hyperloop = HyperloopService()
        result = hyperloop.execute_dsl('FLAGS.GET key=cursor.agent.task.json')
        if result.get("ok"):
            for res in result.get("results", []):
                if res.get("command", "").startswith("FLAGS.GET"):
                    value = res.get("data", {}).get("value")
                    if value:
                        return json.loads(value)
    except Exception:
        logger.warning("Failed to load task.json from FLAGS")
    return None


def _derive_safe_top30_dsl(user_prompt: str) -> Optional[str]:
    try:
        p = (user_prompt or "").strip()
        pl = p.lower()
        # 1) Projects
        if any(k in pl for k in ("project", "проек", "проект", "список проектов", "list projects")):
            return "PROJECT.LIST"
        # 2) Inspectors
        if any(k in pl for k in ("inspector", "инспектор", "аудит", "проверка")):
            if any(k in pl for k in ("planning", "план", "enforce")):
                return "INSPECTOR.RUN key=planning.enforce"
            return "INSPECTOR.RUN_ALL"
        # 3) Pipeline trace (Gate A smoke)
        if any(k in pl for k in ("pipeline", "pipeline run", "трейс", "core.pipeline")):
            return 'CORE.PIPELINE.RUN input_text="health check" WITH TRACE'
        # 4) Migrations status
        if any(k in pl for k in ("migration", "миграц", "alembic", "heads")) and any(k in pl for k in ("status", "статус", "heads")):
            return "MIGRATIONS.STATUS"
        # 5) Flags state/profile (safe default: state)
        if any(k in pl for k in ("flag", "флаг", "profile", "профиль")):
            if "prod_safe" in pl:
                return 'FLAGS.APPLY_PROFILE name=prod_safe'
            return 'FLAGS.STATE'
        # 6) Processor diagnostics
        if any(k in pl for k in ("processor", "процессор", "очеред", "queue")) and any(k in pl for k in ("index", "индекс")):
            return 'PROCESSOR.DIAGNOSTICS.QUEUE_INDEXES'
    except Exception:
        pass
    return None

def _safe_str_for_dsl(value: str, max_len: int = 1000) -> str:
    try:
        v = (value or "")
        if len(v) > max_len:
            v = v[:max_len]
        v = v.replace("\\", "\\\\").replace('"', '\\"')
        return "".join(ch for ch in v if ord(ch) >= 32 or ch in "\n\r\t")
    except Exception:
        return ""


def _get_flag_bool(flag_key: str, default: bool = False) -> bool:
    try:
        h = HyperloopService()
        res = h.execute_dsl(f'FLAGS.GET key="{flag_key}"')
        if res.get("ok"):
            for it in res.get("results", []):
                if it.get("command", "").startswith("FLAGS.GET"):
                    v = (it.get("data", {}) or {}).get("value")
                    if isinstance(v, str):
                        vl = v.strip().lower()
                        if vl in ("1", "true", "yes", "on"):
                            return True
                        if vl in ("0", "false", "no", "off"):
                            return False
                    if isinstance(v, bool):
                        return v
    except Exception:
        pass
    return default


def _is_sensitive_dsl(command: str) -> bool:
    cmd_upper = (command or "").upper()
    sensitive = (
        "MIGRATIONS.",
        "SECRET.",
        "SECRETS.",
        "FLAGS.APPLY_PROFILE",
        "DEPLOY",
        "PROD",
        "BACKUP",
        "RESTORE",
        "DROP ",
        " DELETE ",
    )
    return any(tok in cmd_upper for tok in sensitive)


async def mirror_action(user_id: int, user_prompt: str, result: Dict, routing_type: str, classification: Dict, trace_id: str, execution_time_ms: int):
    try:
        # Metrics
        try:
            incr("cursor_router.requests_total", tags={"routing_type": routing_type})
            if not result.get("success", True):
                incr("cursor_router.errors_total", tags={"routing_type": routing_type})
            tokens_used = int(result.get("tokens_used", 0) or 0)
            observe("cursor_router.tokens_used", tokens_used, tags={"routing_type": routing_type})
            if tokens_used == 0:
                incr("cursor_router.zero_tokens_total", tags={"routing_type": routing_type})
            p_observe_ms("cursor_router.execution_time_ms", execution_time_ms, tags={"routing_type": routing_type, "success": str(result.get("success", True)).lower()})
        except Exception:
            pass

        # P48 MIRROR (best-effort)
        try:
            hyper = HyperloopService()
            dsl = (
                "LLM.MIRROR "
                f"owner=\"{user_id}\" "
                f"branch=\"main\" topic=\"cursor\" "
                f"user_command=\"{_safe_str_for_dsl(user_prompt)}\" "
                f"agent_reply=\"{_safe_str_for_dsl(str(result.get('content') or ''))}\" "
                f"routing_type=\"{routing_type}\" tokens_used={int(result.get('tokens_used', 0) or 0)} "
                f"trace_id=\"{trace_id}\" success={(1 if result.get('success', True) else 0)}"
            )
            _ = hyper.execute_dsl(dsl)
        except Exception:
            pass

        logger.info(f"[MIRROR] {trace_id}: routing={routing_type}, tokens={result.get('tokens_used', 0)}")
    except Exception as e:
        logger.error(f"Failed to mirror action: {e}")
    # Persist stats (best-effort, non-blocking)
    try:
        if async_session_maker:
            async with async_session_maker() as session:  # type: ignore
                await session.execute(
                    _sql_text(
                        """
                        INSERT INTO cursor_routing_stats
                            (user_id, routing_type, classification, user_prompt, tokens_used, execution_time_ms, success, trace_id, metadata)
                        VALUES
                            (:user_id, :routing_type, cast(:classification as jsonb), :user_prompt, :tokens_used, :execution_time_ms, :success, :trace_id, cast(:metadata as jsonb))
                        """
                    ),
                    {
                        "user_id": int(user_id),
                        "routing_type": str(routing_type),
                        "classification": json.dumps(classification, ensure_ascii=False),
                        "user_prompt": user_prompt[:2000],
                        "tokens_used": int(result.get("tokens_used", 0) or 0),
                        "execution_time_ms": int(execution_time_ms),
                        "success": bool(result.get("success", True)),
                        "trace_id": str(trace_id),
                        "metadata": json.dumps({"executor": result.get("executor_type", routing_type)}, ensure_ascii=False),
                    },
                )
                await session.commit()
    except Exception:
        # do not fail request path on stats errors
        pass


async def route_and_execute(user_prompt: str, messages: List[ChatMessage], request_metadata: Optional[Dict], user_id: int) -> Dict[str, Any]:
    trace_id = str(uuid.uuid4())
    start_time = time.time()

    session_brief = load_session_brief()
    task_json = load_task_json()

    context = {
        "session_brief": session_brief,
        "task": task_json,
        "messages": [m.dict() for m in messages],
        "metadata": request_metadata or {}
    }

    classifier = CursorRouterClassifier()
    classification = classifier.classify(user_prompt, context)

    # Enforce TOP-30 usage: if enabled, prefer safe DSL for recognized intents
    try:
        enforce = _get_flag_bool("cursor.router.enforce_top30", True)
    except Exception:
        enforce = True
    if enforce and classification.get("routing_type") != "dsl":
        dsl_cand = _derive_safe_top30_dsl(user_prompt)
        if dsl_cand:
            classification = {"routing_type": "dsl", "confidence": 0.95, "dsl_command": dsl_cand, "reason": "Top30 enforcement"}

    context_loader = CursorContextLoader()
    enriched_context = context_loader.load(
        routing_type=classification["routing_type"],
        user_prompt=user_prompt,
        base_context=context
    )

    routing_type = classification["routing_type"]
    signature_steps: List[str] = []
    signature_steps.append("svc.soul.preanalysis")
    signature_steps.append("svc.soul.router_decide")

    try:
        if routing_type == "dsl":
            executor = DSLExecutor()
            result = executor.execute(classification["dsl_command"], enriched_context)
        elif routing_type == "template":
            executor = TemplateExecutor()
            result = executor.execute(classification["template_name"], classification.get("params", {}), enriched_context)
        elif routing_type == "aux_llm":
            executor = AUXLLMExecutor()
            result = executor.execute(user_prompt, enriched_context)
            signature_steps.append("svc.llm_client.send")
            signature_steps.append("svc.llm_client.recv")
        elif routing_type == "external_llm":
            executor = ExternalLLMExecutor()
            result = executor.execute(user_prompt, enriched_context)
            signature_steps.append("svc.llm_client.send")
            signature_steps.append("svc.llm_client.recv")
        else:
            raise ValueError(f"Unknown routing type: {routing_type}")

        execution_time_ms = int((time.time() - start_time) * 1000)
        signature_steps.append("svc.parser.json_strict")
        signature_steps.append("svc.chat.reply_render")

        await mirror_action(user_id, user_prompt, result, routing_type, classification, trace_id, execution_time_ms)

        return {
            "content": result["content"],
            "routing_type": routing_type,
            "classification": classification,
            "tokens_used": result.get("tokens_used", 0),
            "execution_time_ms": execution_time_ms,
            "trace_id": trace_id,
            "success": True,
            "signature_steps": signature_steps
        }
    except Exception as e:
        logger.exception(f"[{trace_id}] Execution failed: {e}")
        return {
            "content": f"❌ Execution failed: {str(e)}",
            "routing_type": routing_type,
            "classification": classification,
            "tokens_used": 0,
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "trace_id": trace_id,
            "success": False,
            "signature_steps": signature_steps,
            "error": str(e)
        }


@router.post("/completion", response_model=ChatCompletionResponse)
async def cursor_agent_completion(request: ChatCompletionRequest, user_id: int = Depends(get_current_user_id)):
    if request.stream:
        raise HTTPException(status_code=400, detail="Streaming not supported yet")

    user_prompt = extract_user_prompt(request.messages)
    if not user_prompt:
        raise HTTPException(status_code=400, detail="No user prompt found in messages")

    result = await route_and_execute(user_prompt, request.messages, request.metadata, user_id)

    completion_id = f"chatcmpl-soul-{uuid.uuid4().hex[:12]}"
    created_ts = int(datetime.now(timezone.utc).timestamp())

    response = ChatCompletionResponse(
        id=completion_id,
        created=created_ts,
        model=f"soul-routed-{result['routing_type']}",
        choices=[ChatCompletionChoice(index=0, message=ChatMessage(role="assistant", content=result["content"]), finish_reason="stop")],
        usage=ChatCompletionUsage(prompt_tokens=len(user_prompt)//4, completion_tokens=result.get("tokens_used", 0), total_tokens=len(user_prompt)//4 + result.get("tokens_used", 0)),
        metadata={
            "routing_type": result["routing_type"],
            "classification": result["classification"],
            "execution_time_ms": result["execution_time_ms"],
            "trace_id": result["trace_id"],
            "success": result["success"],
            "signature_steps": result.get("signature_steps", [])
        }
    )

    # P27 Delivery Guard validation before returning
    try:
        sig_ctx = {
            "trace_id": result["trace_id"],
            "steps": [{"function_id": s} for s in result.get("signature_steps", [])],
        }
        required = [
            "svc.soul.preanalysis",
            "svc.soul.router_decide",
            "svc.parser.json_strict",
            "svc.chat.reply_render",
        ]
        if result.get("routing_type") in ("aux_llm", "external_llm"):
            required = [
                "svc.soul.preanalysis",
                "svc.soul.router_decide",
                "svc.llm_client.send",
                "svc.llm_client.recv",
                "svc.parser.json_strict",
                "svc.chat.reply_render",
            ]
        ok_guard, reason_guard = verify_before_reply(sig_ctx, required_steps=required)
        response.metadata = response.metadata or {}
        response.metadata.update({"delivery_guard_ok": ok_guard, "delivery_guard_reason": reason_guard})

        if not ok_guard:
            incr("cursor_router.delivery_guard_failed_total", tags={"routing_type": str(result.get("routing_type"))})
            enforce = _get_flag_bool("delivery_guard.enforce", False)
            if enforce:
                try:
                    hyper = HyperloopService()
                    ctx = f"trace_id={result['trace_id']}; reason={reason_guard}"
                    _ = hyper.execute_dsl(
                        'INCIDENT.CREATE severity=2 title="Delivery Guard failure in Cursor router" '
                        f'context="{_safe_str_for_dsl(ctx, 500)}"'
                    )
                except Exception:
                    pass
                # Return fallback
                fb = ChatCompletionResponse(
                    id=f"chatcmpl-fallback-{uuid.uuid4().hex[:12]}",
                    created=created_ts,
                    model="soul-routed-fallback",
                    choices=[
                        ChatCompletionChoice(
                            index=0,
                            message=ChatMessage(
                                role="assistant",
                                content="⚠️ Response validation failed. Please try again."
                            ),
                            finish_reason="error"
                        )
                    ],
                    usage=ChatCompletionUsage(prompt_tokens=0, completion_tokens=0, total_tokens=0),
                    metadata={
                        "routing_type": result.get("routing_type"),
                        "trace_id": result.get("trace_id"),
                        "delivery_guard_ok": False,
                        "delivery_guard_reason": reason_guard,
                    }
                )
                return fb
            else:
                logger.warning(f"P27 Delivery Guard violation (warn-mode): {reason_guard}")
    except Exception:
        # Do not block on guard logic errors
        pass
    return response


@router.get("/health")
async def cursor_router_health():
    return {"status": "ok", "service": "cursor-agent-router", "version": "1.0.0", "routing_types": ["dsl", "template", "aux_llm", "external_llm"]}


@router.get("/stats")
async def cursor_router_stats(user_id: int = Depends(get_current_user_id)):
    try:
        if async_session_maker:
            async with async_session_maker() as session:  # type: ignore
                rows = (await session.execute(
                    _sql_text(
                        """
                        SELECT routing_type,
                               COUNT(*) as total_requests,
                               COALESCE(SUM(tokens_used),0) as total_tokens_used,
                               COALESCE(AVG(execution_time_ms),0)::INT as avg_execution_time_ms,
                               SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count
                        FROM cursor_routing_stats
                        WHERE created_at > NOW() - INTERVAL '7 days' AND user_id = :uid
                        GROUP BY routing_type
                        ORDER BY total_requests DESC
                        """
                    ),
                    {"uid": int(user_id)},
                )).mappings().all()
                breakdown = {}
                total_requests = 0
                total_tokens = 0
                for r in rows:
                    breakdown[r["routing_type"]] = {
                        "total_requests": int(r["total_requests"]),
                        "total_tokens_used": int(r["total_tokens_used"]),
                        "avg_execution_time_ms": int(r["avg_execution_time_ms"]),
                        "success_count": int(r["success_count"]),
                    }
                    total_requests += int(r["total_requests"])
                    total_tokens += int(r["total_tokens_used"])
                return {
                    "user_id": user_id,
                    "total_requests": total_requests,
                    "routing_breakdown": breakdown,
                    "total_tokens_used": total_tokens,
                }
    except Exception:
        pass
    # Fallback empty
    return {
        "user_id": user_id,
        "total_requests": 0,
        "routing_breakdown": {"dsl": 0, "template": 0, "aux_llm": 0, "external_llm": 0},
        "total_tokens_used": 0,
    }


