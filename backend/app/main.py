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
