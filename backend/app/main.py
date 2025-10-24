import importlib
import os
import sys

# Ensure repo root is importable (so that 'tools.catalog.*' modules resolve on APP servers)
try:
    _here = os.path.abspath(os.path.dirname(__file__))
    _repo_root = os.path.abspath(os.path.join(_here, "..", "..", ".."))
    if _repo_root not in sys.path:
        sys.path.insert(0, _repo_root)
except Exception:
    pass
import sys
import os

# Ensure repo root is on sys.path so 'tools.catalog.*' imports work under uvicorn
try:
    _repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    if _repo_root not in sys.path:
        sys.path.insert(0, _repo_root)
except Exception:
    pass
from fastapi import FastAPI
from fastapi import Body, HTTPException
from typing import Any, Dict, List, Optional
import json as _json
import urllib.request as _url
from fastapi.responses import PlainTextResponse

# Prefer relative imports within package to avoid PYTHONPATH issues on server
from .routers import cursor_agent_router  # type: ignore
try:
    from .lib.observability.metrics import get_metrics  # type: ignore
except Exception:  # pragma: no cover
    def get_metrics():  # type: ignore
        try:
            # Fallback: use tools monitoring collector if available
            from tools.catalog.active.monitoring.monitoring import metrics as _metrics  # type: ignore
            return _metrics.get_metrics()  # type: ignore[attr-defined]
        except Exception:
            return {}
try:
    from tools.catalog.active.monitoring.monitoring import format_metrics_for_prometheus  # type: ignore
except Exception:  # pragma: no cover
    def format_metrics_for_prometheus(data: dict) -> str:  # type: ignore
        lines = ["# HELP soulpulse_requests_total Total requests", "# TYPE soulpulse_requests_total counter"]
        try:
            total = int((data or {}).get("total_requests") or 0)
        except Exception:
            total = 0
        lines.append(f"soulpulse_requests_total {total}")
        return "\n".join(lines)

try:
    from tools.catalog.active.admin.fine_tune_admin import router as fine_tune_admin  # type: ignore
except Exception:
    fine_tune_admin = None  # type: ignore
    # Fallback: use backend router adapter if tools-based import fails
    if fine_tune_admin is None:
        try:
            from .routers.fine_tune_admin import router as fine_tune_admin  # type: ignore
        except Exception:
            fine_tune_admin = None  # type: ignore

# Optional Quant Admin router
try:
    from .routers.quant_admin import router as quant_admin  # type: ignore
except Exception:
    quant_admin = None  # type: ignore

# Optional admin routers (Hyperloop + Agent Exec + Secrets Admin)
try:
    from tools.catalog.active.admin.hyperloop_admin import router as hyperloop_admin  # type: ignore
except Exception:
    hyperloop_admin = None  # type: ignore
    # Fallback: try local backend router if available
    if hyperloop_admin is None:
        try:
            from .routers.hyperloop_admin import router as hyperloop_admin  # type: ignore
        except Exception:
            hyperloop_admin = None  # type: ignore

try:
    from tools.catalog.active.utils.agent_exec import router as agent_exec_admin  # type: ignore
except Exception:
    agent_exec_admin = None  # type: ignore
    # Fallback: try local backend router if available
    if agent_exec_admin is None:
        try:
            from .routers.agent_exec import router as agent_exec_admin  # type: ignore
        except Exception:
            agent_exec_admin = None  # type: ignore

# Optional secrets admin router (Key Master helpers)
try:
    from tools.catalog.active.admin.secrets_admin import router as secrets_admin  # type: ignore
except Exception:
    secrets_admin = None  # type: ignore
    # Fallback: try local backend router if available
    if secrets_admin is None:
        try:
            from .routers.secrets_admin import router as secrets_admin  # type: ignore
        except Exception:
            secrets_admin = None  # type: ignore

# Optional Two-Keys admin router
try:
    from tools.catalog.active.admin.two_keys_admin import router as two_keys_admin  # type: ignore
except Exception:
    two_keys_admin = None  # type: ignore

# Optional Soul Admin (settings utilities)
try:
    from tools.catalog.active.admin.soul_admin import router as soul_admin_router  # type: ignore
except Exception:
    soul_admin_router = None  # type: ignore


app = FastAPI(title="SoulPulse Backend")


@app.get("/")
async def root():
    return {"status": "ok", "service": "soulpulse-backend"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "soulpulse-backend", "version": "2.3"}


@app.get("/api/routes")
async def list_routes():
    try:
        paths = []
        for r in app.router.routes:  # type: ignore[attr-defined]
            try:
                p = getattr(r, "path", None)
                if p:
                    paths.append(p)
            except Exception:
                continue
        return {"count": len(paths), "paths": sorted(paths)}
    except Exception:
        return {"count": 0, "paths": []}


app.include_router(
    cursor_agent_router.router,
    prefix="/api/cursor-agent-router",
    tags=["cursor-router"],
)

# Include optional admin routers if available
if hyperloop_admin is not None:
    try:
        app.include_router(hyperloop_admin)
    except Exception:
        pass
if agent_exec_admin is not None:
    try:
        app.include_router(agent_exec_admin)
    except Exception:
        pass

# Include Secrets Admin if available
if secrets_admin is not None:
    try:
        app.include_router(secrets_admin)
    except Exception:
        pass

# Include Two-Keys Admin if available
if two_keys_admin is not None:
    try:
        app.include_router(two_keys_admin)
    except Exception:
        pass

# Include Soul Admin (settings) if available
if soul_admin_router is not None:
    try:
        app.include_router(soul_admin_router)
    except Exception:
        pass

if fine_tune_admin is not None:
    try:
        app.include_router(fine_tune_admin)
    except Exception:
        pass

if quant_admin is not None:
    try:
        app.include_router(quant_admin)
    except Exception:
        pass


# =============================
# Aux LLM proxy (Phi-4 / llama)
# =============================

def _aux_base_url() -> str:
    # Minimal stable default; advanced resolution via DB/ENV can be added if needed
    return "http://127.0.0.1:3002"


@app.get("/api/aux-llm/health")
async def aux_llm_health() -> Dict[str, Any]:
    try:
        req = _url.Request(f"{_aux_base_url()}/health", headers={"Content-Type": "application/json"}, method="GET")
        with _url.urlopen(req, timeout=1.6) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            body = _json.loads(raw or "{}")
            ok = bool(isinstance(body, dict) and body.get("status") == "ok")
            return {"ok": ok, "service": "aux-llm", "response": body}
    except Exception as e:
        return {"ok": False, "service": "aux-llm", "error": str(e)}


@app.post("/api/aux-llm/completion")
async def aux_llm_completion(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    # Accepts either llama.cpp completion format {prompt,n_predict,...}
    # or OpenAI-like {messages:[{role,content}],max_tokens,temperature}
    try:
        prompt: Optional[str] = None
        n_predict: int = int(payload.get("n_predict") or payload.get("max_tokens") or 128)
        temperature: float = float(payload.get("temperature") or 0.2)

        msgs: Optional[List[Dict[str, Any]]] = payload.get("messages")  # type: ignore[assignment]
        if isinstance(msgs, list) and msgs:
            # Simple extraction: use last user message content
            for m in reversed(msgs):
                if isinstance(m, dict) and (m.get("role") == "user"):
                    c = m.get("content")
                    if isinstance(c, str) and c.strip():
                        prompt = c.strip()
                        break
            if prompt is None and isinstance(msgs[-1], dict):
                c2 = msgs[-1].get("content")
                if isinstance(c2, str):
                    prompt = c2

        if prompt is None:
            p = payload.get("prompt")
            if isinstance(p, str):
                prompt = p

        if not prompt:
            raise HTTPException(status_code=400, detail="prompt/messages required")

        out_req = {
            "prompt": prompt,
            "n_predict": max(1, min(n_predict, 2048)),
            "temperature": max(0.0, float(temperature)),
        }
        req = _url.Request(
            f"{_aux_base_url()}/completion",
            data=_json.dumps(out_req).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with _url.urlopen(req, timeout=8.0) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            body = _json.loads(raw or "{}")
            content: Optional[str] = None
            if isinstance(body, dict):
                content = body.get("content") or body.get("response") or None  # tolerant
            return {"ok": True, "content": content, "raw": body}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"aux completion failed: {e}")


@app.post("/v1/chat/completions")
async def openai_chat_completions(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    # Thin OpenAI-compatible shim that reuses aux_llm_completion logic
    try:
        res = await aux_llm_completion(payload)
        content = (res or {}).get("content")
        if not isinstance(content, str):
            content = ""
        return {
            "id": f"chatcmpl-soul-{os.getpid()}",
            "object": "chat.completion",
            "created": int(__import__("time").time()),
            "model": str(payload.get("model") or "phi-4"),
            "choices": [{"index": 0, "message": {"role": "assistant", "content": content}, "finish_reason": "stop"}],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"chat completion failed: {e}")


@app.post("/api/admin/fine_tune/debug_include")
async def debug_include_router():
    # Try to (re)include fine_tune_admin router at runtime, with error details
    attempts: list[dict] = []
    for mod_name in (
        "app.routers.fine_tune_admin",
        "backend.app.routers.fine_tune_admin",
        "tools.catalog.active.admin.fine_tune_admin",
    ):
        rec: dict = {"module": mod_name, "ok": False}
        try:
            m = importlib.import_module(mod_name)
            r = getattr(m, "router", None)
            if r is not None:
                try:
                    app.include_router(r)
                except Exception as ie:
                    rec["include_error"] = repr(ie)
                else:
                    rec["ok"] = True
                    attempts.append(rec)
                    return {"ok": True, "attempts": attempts}
            else:
                rec["error"] = "no router attr"
        except Exception as e:
            rec["import_error"] = repr(e)
        attempts.append(rec)
    return {"ok": False, "attempts": attempts}


@app.get("/api/metrics")
async def metrics_json():
    try:
        return get_metrics()
    except Exception:
        return {"status": "unavailable"}


@app.get("/api/metrics/prometheus", response_class=PlainTextResponse)
async def metrics_prometheus():
    try:
        return format_metrics_for_prometheus(get_metrics())
    except Exception:
        return "# soulpulse metrics unavailable\n"
