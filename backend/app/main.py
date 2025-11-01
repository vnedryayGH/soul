import importlib
import os
import sys

# Ensure repo root is importable (so that 'tools.catalog.*' modules resolve on APP servers)
try:
    _here = os.path.abspath(os.path.dirname(__file__))
    _repo_root = os.path.abspath(os.path.join(_here, '..', '..', '..'))
    if _repo_root not in sys.path:
        sys.path.insert(0, _repo_root)
except Exception:
    pass
import os
import sys

# Ensure repo root is on sys.path so 'tools.catalog.*' imports work under uvicorn
try:
    _repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    if _repo_root not in sys.path:
        sys.path.insert(0, _repo_root)
except Exception:
    pass
import json as _json
import urllib.request as _url
from typing import Any

from fastapi import Body, Depends, FastAPI, HTTPException, Request
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

_DBG = str(os.getenv('DIAGNOSTIC_VISIBLE_REPLY', '')).strip().lower() in {'1', 'true', 'yes', 'on'}

# Prefer relative imports within package to avoid PYTHONPATH issues on server
# Robust import of cursor_agent_router without relying on package __all__
try:
    import importlib as _imp  # type: ignore

    _car_mod = None
    for _m in ('app.routers.cursor_agent_router', 'backend.app.routers.cursor_agent_router'):
        try:
            _car_mod = _imp.import_module(_m)
            break
        except Exception:
            _car_mod = None
    if _car_mod is None:
        raise ImportError('cursor_agent_router module not found')
    cursor_agent_router = _car_mod  # type: ignore
except Exception:  # pragma: no cover
    cursor_agent_router = None  # type: ignore
try:
    from .lib.observability.metrics import get_metrics  # type: ignore
except Exception:  # pragma: no cover

    def get_metrics():  # type: ignore
        try:
            # Fallback: use tools monitoring collector if available
            from tools.catalog.active.monitoring.monitoring import (
                metrics as _metrics,  # type: ignore
            )

            return _metrics.get_metrics()  # type: ignore[attr-defined]
        except Exception:
            return {}


try:
    from tools.catalog.active.monitoring.monitoring import (
        format_metrics_for_prometheus,  # type: ignore
    )
except Exception:  # pragma: no cover

    def format_metrics_for_prometheus(data: dict) -> str:  # type: ignore
        lines = [
            '# HELP soulpulse_requests_total Total requests',
            '# TYPE soulpulse_requests_total counter',
        ]
        try:
            total = int((data or {}).get('total_requests') or 0)
        except Exception:
            total = 0
        lines.append(f'soulpulse_requests_total {total}')
        return '\n'.join(lines)


# Optional RS metrics admin router (p95 reports, uds-check, soak)
try:
    from tools.catalog.active.admin.rs_metrics_admin import (
        router as rs_metrics_admin,  # type: ignore
    )
except Exception:
    rs_metrics_admin = None  # type: ignore

# Optional Dispatcher admin router (queue metrics)
try:
    from tools.catalog.active.admin.dispatcher_admin import (
        router as dispatcher_admin,  # type: ignore
    )
except Exception:
    dispatcher_admin = None  # type: ignore

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

from .routers.hyperloop_admin import router as hyperloop_admin  # type: ignore

try:
    from .routers.personas_admin import router as personas_admin  # type: ignore
except Exception:
    personas_admin = None  # type: ignore
try:
    from .routers.external_admin import router as external_admin  # type: ignore
except Exception:
    external_admin = None  # type: ignore
try:
    from .routers.hr_admin import router as hr_admin  # type: ignore
except Exception:
    hr_admin = None  # type: ignore
try:
    from .routers.routines_admin import router as routines_admin  # type: ignore
except Exception:
    routines_admin = None  # type: ignore
try:
    from .routers.operator_admin import router as operator_admin  # type: ignore
except Exception:
    operator_admin = None  # type: ignore
try:
    from .routers.visualization_ws import router as visualization_ws  # type: ignore
except Exception:
    visualization_ws = None  # type: ignore
try:
    from .routers.agent_exec import router as agent_exec_admin  # type: ignore
except Exception:
    agent_exec_admin = None  # type: ignore

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

# Optional Gendarme admin router
try:
    from tools.catalog.active.admin.gendarme_admin import router as gendarme_admin  # type: ignore
except Exception:
    gendarme_admin = None  # type: ignore

# Fallback local proxy for Gendarme admin router
try:
    from .routers.gendarme_admin_proxy import router as gendarme_admin_proxy  # type: ignore
except Exception:
    gendarme_admin_proxy = None  # type: ignore

# Optional Soul Admin (settings utilities)
try:
    from tools.catalog.active.admin.soul_admin import router as soul_admin_router  # type: ignore
except Exception:
    soul_admin_router = None  # type: ignore

# Web Auth router (for web authentication endpoints) — prefer local router, then tools cookie variant
try:
    from .routers.web_auth import router as web_auth_router  # type: ignore
except Exception:
    try:
        from tools.catalog.active.utils.web_auth import (  # type: ignore
            router as web_auth_router,
        )
    except Exception:
        try:
            from tools.catalog.active.utils.auth import (  # type: ignore
                web_router as web_auth_router,
            )
        except Exception:
            web_auth_router = None  # type: ignore

# If all imports failed, define a minimal inline fallback to guarantee route presence
if web_auth_router is None:  # pragma: no cover
    try:
        from fastapi import APIRouter, Depends, HTTPException, Response  # type: ignore
        from sqlalchemy import select  # type: ignore
        try:
            from .db import get_db_session as _get_db_session  # type: ignore
        except Exception:
            from backend.app.db import get_db_session as _get_db_session  # type: ignore
        try:
            from .models import User as _User  # type: ignore
        except Exception:
            from backend.app.models import User as _User  # type: ignore

        # Helper deps (from tools if available)
        try:
            from tools.catalog.active.utils.dependencies import (  # type: ignore
                verify_telegram_auth as _verify_tg,
            )
        except Exception as _e_dep:
            _verify_tg = None  # type: ignore
        from fastapi import Header as _Header  # type: ignore

        async def _verify_tg_local(x_telegram_user_id: str | None = _Header(default=None)) -> int:  # type: ignore
            if not x_telegram_user_id or not str(x_telegram_user_id).strip():
                raise HTTPException(status_code=401, detail='telegram_header_missing')
            try:
                return int(str(x_telegram_user_id).strip())
            except Exception:
                raise HTTPException(status_code=400, detail='invalid_telegram_id')

        try:
            from tools.catalog.active.utils.auth import (  # type: ignore
                create_jwt as _create_jwt,
                generate_time_based_otp as _gen_otp,
            )
        except Exception as _e_auth:
            _create_jwt = None  # type: ignore
            _gen_otp = None  # type: ignore

        _wr = APIRouter(prefix='/api/web-auth', tags=['web-auth'])

        @_wr.post('/issue-one-time-token')
        async def _issue_one_time_token(
            tg_id: int = Depends(_verify_tg if _verify_tg else _verify_tg_local),  # type: ignore
            db=Depends(_get_db_session),  # type: ignore
        ):
            if _gen_otp is None:
                raise HTTPException(status_code=500, detail='web_auth_helpers_missing')
            res = await db.execute(select(_User).where(_User.tg_id == tg_id))  # type: ignore
            user = res.scalar_one_or_none()
            if user is None:
                raise HTTPException(status_code=404, detail='User not found')
            otp = _gen_otp(tg_id, 300)
            return {'status': 'success', 'otp': otp, 'tg_id': tg_id, 'expires_in': 300}

        @_wr.post('/verify-otp')
        async def _verify_otp(payload: dict, db=Depends(_get_db_session)):  # type: ignore
            if _create_jwt is None or _gen_otp is None:
                raise HTTPException(status_code=500, detail='web_auth_helpers_missing')
            tg_id = payload.get('tg_id')
            otp = payload.get('otp')
            if not tg_id or not otp:
                raise HTTPException(status_code=400, detail='tg_id and otp are required')
            exp = _gen_otp(tg_id, 300)
            if otp != exp:
                raise HTTPException(status_code=401, detail='Invalid or expired OTP')
            res = await db.execute(select(_User).where(_User.tg_id == tg_id))  # type: ignore
            user = res.scalar_one_or_none()
            if user is None:
                raise HTTPException(status_code=404, detail='User not found')
            token = _create_jwt({'user_id': user.id, 'web': True, 'tg_id': user.tg_id, 'sub': user.tg_id})
            resp = Response(media_type='application/json')
            try:
                resp.set_cookie(
                    key='sp_token',
                    value=token,
                    max_age=60 * 60 * 12,
                    httponly=True,
                    secure=True,
                    samesite='none',
                    domain='.soulpulse.art',
                    path='/',
                )
            except Exception:
                pass
            resp.body = (
                '{'
                f'"status":"success","token":"{token}","tg_id":{int(tg_id)},'
                f'"user":{{"id":{user.tg_id or 0},"first_name":"{user.first_name or ''}","last_name":"{user.last_name or ''}","username":"{user.username or ''}"}}'
                '}'
            ).encode()
            return resp

        web_auth_router = _wr  # type: ignore
    except Exception:
        web_auth_router = None  # type: ignore


app = FastAPI(
    title='SoulPulse Backend',
    # Переносим схемы и UI под /api/*, чтобы они корректно проксировались через Nginx
    docs_url='/api/docs',
    redoc_url='/api/redoc',
    openapi_url='/api/openapi.json',
)

# === P62: Unified error format for financial/HR admin endpoints ===
_P62_ERR_PATHS = ('/api/admin/external', '/api/admin/hr')


def _is_p62_path(path: str) -> bool:
    try:
        return any(str(path or '').startswith(p) for p in _P62_ERR_PATHS)
    except Exception:
        return False


@app.exception_handler(RequestValidationError)
async def _p62_validation_handler(request: Request, exc: RequestValidationError):  # type: ignore
    if _is_p62_path(getattr(request, 'url', type('U', (), {'path': ''})) .path):
        # Map validation to 400 with unified payload
        return JSONResponse(
            status_code=400,
            content={'code': 'validation_error', 'message': 'Invalid request', 'details': exc.errors()},
        )
    # Fallback to default-like structure for other routes
    return JSONResponse(status_code=422, content={'detail': exc.errors()})


@app.exception_handler(StarletteHTTPException)
async def _p62_http_handler(request: Request, exc: StarletteHTTPException):  # type: ignore
    if _is_p62_path(getattr(request, 'url', type('U', (), {'path': ''})) .path):
        msg = exc.detail if isinstance(exc.detail, str) else 'HTTP error'
        body: dict[str, object] = {'code': f'http_{exc.status_code}', 'message': msg}
        if not isinstance(exc.detail, str):
            body['details'] = exc.detail
        return JSONResponse(status_code=exc.status_code, content=body)
    # Default-like response for other routes
    return JSONResponse(status_code=exc.status_code, content={'detail': exc.detail})

# === Start Gendarme scheduler on startup (nightly/interval-based) ===
try:
    # DB session
    try:
        from .db import async_session_maker  # type: ignore
    except Exception:
        from backend.app.db import async_session_maker  # type: ignore
    # Service
    from tools.catalog.active.utils.gendarme_service import GendarmeService  # type: ignore

    _gendarme = GendarmeService()

    @app.on_event('startup')
    async def _start_gendarme() -> None:  # pragma: no cover
        try:
            async with async_session_maker() as _db:  # type: ignore
                await _gendarme.start(_db)
        except Exception:
            pass

    @app.on_event('shutdown')
    async def _stop_gendarme() -> None:  # pragma: no cover
        try:
            _gendarme.stop()
        except Exception:
            pass
except Exception:
    # Safe fallback: backend работает без фонового планировщика
    pass


# === RBAC seed defaults on startup (idempotent) ===
try:
    from tools.catalog.active.utils.rbac_service import RBACService  # type: ignore
except Exception:  # pragma: no cover
    RBACService = None  # type: ignore

try:
    from .db import async_session_maker as _rbac_async_session_maker  # type: ignore
except Exception:  # pragma: no cover
    _rbac_async_session_maker = None  # type: ignore

if RBACService is not None and _rbac_async_session_maker is not None:

    @app.on_event('startup')
    async def _seed_rbac_defaults() -> None:  # pragma: no cover
        try:
            async with _rbac_async_session_maker() as _db:  # type: ignore
                svc = RBACService(_db)
                await svc.seed_defaults()
        except Exception:
            # Non-fatal: service remains available even if seed skipped
            pass


@app.get('/')
async def root():
    return {'status': 'ok', 'service': 'soulpulse-backend'}


@app.get('/api/health')
async def health():
    return {'status': 'ok', 'service': 'soulpulse-backend', 'version': '2.9'}


@app.get('/api/routes')
async def list_routes():
    try:
        paths = []
        for r in app.router.routes:  # type: ignore[attr-defined]
            try:
                p = getattr(r, 'path', None)
                if p:
                    paths.append(p)
            except Exception:
                continue
        return {'count': len(paths), 'paths': sorted(paths)}
    except Exception:
        return {'count': 0, 'paths': []}


if cursor_agent_router is not None:
    try:
        app.include_router(
            cursor_agent_router.router,  # type: ignore[attr-defined]
            prefix='/api/cursor-agent-router',
            tags=['cursor-router'],
        )
    except Exception:
        pass

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

# Include Gendarme Admin if available
if gendarme_admin is not None:
    try:
        app.include_router(gendarme_admin)
    except Exception:
        pass
elif 'gendarme_admin_proxy' in globals() and gendarme_admin_proxy is not None:
    try:
        app.include_router(gendarme_admin_proxy)
    except Exception:
        pass

# Include Soul Admin (settings) if available
if soul_admin_router is not None:
    try:
        app.include_router(soul_admin_router)
    except Exception:
        pass

# Include RS metrics admin if available
if 'rs_metrics_admin' in globals() and rs_metrics_admin is not None:
    try:
        app.include_router(rs_metrics_admin)
    except Exception:
        pass

if 'dispatcher_admin' in globals() and dispatcher_admin is not None:
    try:
        app.include_router(dispatcher_admin)
    except Exception:
        pass
else:
    try:
        from .routers.dispatcher_admin import router as dispatcher_admin_local  # type: ignore

        app.include_router(dispatcher_admin_local)
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
if personas_admin is not None:
    try:
        app.include_router(personas_admin)
    except Exception:
        pass
if external_admin is not None:
    try:
        app.include_router(external_admin)
    except Exception:
        pass
if hr_admin is not None:
    try:
        app.include_router(hr_admin)
    except Exception:
        pass
if routines_admin is not None:
    try:
        app.include_router(routines_admin)
    except Exception:
        pass
if operator_admin is not None:
    try:
        app.include_router(operator_admin)
    except Exception:
        pass
if visualization_ws is not None:
    try:
        app.include_router(visualization_ws)
    except Exception:
        pass

# Include visualization API (ui-metrics) if available
try:
    from .routers.visualization_api import router as visualization_api  # type: ignore
except Exception:
    visualization_api = None  # type: ignore
if visualization_api is not None:
    try:
        app.include_router(visualization_api)
    except Exception:
        pass

# Include UI admin flags
try:
    from .routers.ui_admin import router as ui_admin  # type: ignore
except Exception:
    ui_admin = None  # type: ignore
if ui_admin is not None:
    try:
        app.include_router(ui_admin)
    except Exception:
        pass

# Include Web Auth router (for web authentication endpoints)
if web_auth_router is not None:
    try:
        app.include_router(web_auth_router)
    except Exception:
        pass

# Public incidents metrics and processor dashboard (if available)
try:
    from tools.catalog.active.utils.incidents_public import router as incidents_public  # type: ignore
except Exception:
    incidents_public = None  # type: ignore
if incidents_public is not None:
    try:
        app.include_router(incidents_public)
    except Exception:
        pass
else:
    try:
        from .routers.incidents_public import router as incidents_public_local  # type: ignore

        app.include_router(incidents_public_local)
    except Exception:
        pass

try:
    from tools.catalog.active.utils.processor_dashboard_api import (
        router as processor_dashboard,  # type: ignore
    )
except Exception:
    processor_dashboard = None  # type: ignore
if processor_dashboard is not None:
    try:
        app.include_router(processor_dashboard)
    except Exception:
        pass
else:
    try:
        from .routers.processor_dashboard import router as processor_dashboard_local  # type: ignore

        app.include_router(processor_dashboard_local)
    except Exception:
        pass

# Always include local fallbacks to guarantee availability in this environment
try:
    from .routers.dispatcher_admin import router as __dispatcher_admin_local  # type: ignore

    app.include_router(__dispatcher_admin_local)
except Exception:
    pass
try:
    from .routers.incidents_public import router as __incidents_public_local  # type: ignore

    app.include_router(__incidents_public_local)
except Exception:
    pass
try:
    from .routers.processor_dashboard import router as __processor_dashboard_local  # type: ignore

    app.include_router(__processor_dashboard_local)
except Exception:
    pass

## removed fragile route-hacking for hyperloop endpoints

# Direct clean Hyperloop endpoint (barrier-free by RBAC) outside /api/hyperloop prefix
try:  # pragma: no cover
    try:
        from .db import get_db_session as _get_db  # type: ignore
    except Exception:
        from backend.app.db import get_db_session as _get_db  # type: ignore
    try:
        from .middleware.rbac_middleware import require_permission as _req_perm  # type: ignore
    except Exception:
        from backend.app.middleware.rbac_middleware import (  # type: ignore
            require_permission as _req_perm,
        )
    try:
        from .services.hyperloop_engine import HyperloopEngine as _HyperloopEngine  # type: ignore
    except Exception:
        from backend.app.services.hyperloop_engine import (  # type: ignore
            HyperloopEngine as _HyperloopEngine,
        )
    try:
        from sqlalchemy.ext.asyncio import AsyncSession as _AsyncSession  # type: ignore
    except Exception:
        _AsyncSession = object  # type: ignore

    @app.post('/api/hyperloop-exec')
    async def hyperloop_exec_open(
        payload: dict = Body(...),
        _perm: bool = Depends(_req_perm('api.hyperloop.execute')),  # type: ignore[name-defined]
    ) -> dict:
        cmds = str((payload or {}).get('commands') or '')
        opts = payload.get('options') if isinstance(payload.get('options'), dict) else None
        if not cmds:
            raise HTTPException(status_code=400, detail='commands required')
        eng = _HyperloopEngine()
        # Создаём явную сессию БД здесь, чтобы избежать артефактов DI и обеспечить корректный AsyncSession
        try:
            from .db import async_session_maker as __sm  # type: ignore
        except Exception:
            from backend.app.db import async_session_maker as __sm  # type: ignore
        async with __sm() as _db:
            out = await eng.execute(commands_text=cmds, db=_db, signature_ctx=None, options=opts)  # type: ignore
        return out if isinstance(out, dict) else {'ok': False, 'error': 'engine returned non-dict'}
except Exception:
    pass

# Hyperloop import diagnostics (temporary helper, gated by DIAGNOSTIC_VISIBLE_REPLY)
if _DBG:
    try:  # pragma: no cover

        @app.get('/api/debug/hyperloop/import_status', include_in_schema=False)
        async def _hyperloop_import_status() -> dict[str, object]:
            out: dict[str, object] = {'ok': False}
            try:
                from .services import hyperloop_engine as _hle  # type: ignore

                errs = getattr(_hle, '_IMPORT_ERRORS', [])
                out['import_errors'] = errs
                out['ok'] = not bool(errs)
                # sys.path head for context
                import sys as _sys

                out['sys_path_head'] = _sys.path[:8]
            except Exception as e:
                out['error'] = repr(e)
            return out
    except Exception:
        pass

if _DBG:
    try:  # pragma: no cover

        @app.get('/api/debug/hyperloop/services_status', include_in_schema=False)
        async def _hyperloop_services_status() -> dict[str, object]:
            try:
                import importlib

                m = importlib.import_module('tools.catalog.active.services.hyperloop_engine')
                cls = getattr(m, 'HyperloopEngine', None)
                origin = getattr(cls, '__module__', None)
                return {'module': getattr(m, '__file__', None), 'class_module': origin}
            except Exception as e:
                return {'error': repr(e)}
    except Exception:
        pass

if _DBG:
    try:  # pragma: no cover
        from fastapi.routing import APIRoute as _APIRoute  # type: ignore

        @app.get('/api/debug/route_params')
        async def _debug_route_params() -> dict[str, object]:
            out: dict[str, object] = {}
            try:
                for r in app.router.routes:  # type: ignore[attr-defined]
                    if isinstance(r, _APIRoute):
                        params: list[str] = []
                        try:
                            for qp in getattr(r.dependant, 'query_params', []) or []:  # type: ignore[attr-defined]
                                n = getattr(qp, 'name', None)
                                if n:
                                    params.append(str(n))
                            # also traverse dependency tree
                            stack = list(getattr(r.dependant, 'dependencies', []) or [])
                            while stack:
                                d = stack.pop()
                                for qp in getattr(d, 'query_params', []) or []:
                                    n = getattr(qp, 'name', None)
                                    if n and n not in params:
                                        params.append(str(n))
                                try:
                                    stack.extend(getattr(d, 'dependencies', []) or [])
                                except Exception:
                                    pass
                        except Exception:
                            pass
                        out[str(getattr(r, 'path', ''))] = params
                # App-level dependencies, if any
                try:
                    deps = getattr(app, 'dependencies', None)
                    names = []
                    count = 0
                    if deps:
                        for d in deps:
                            count += 1
                            try:
                                for qp in getattr(d, 'query_params', []) or []:
                                    n = getattr(qp, 'name', None)
                                    if n:
                                        names.append(str(n))
                            except Exception:
                                pass
                    out['__app_dependencies__'] = names
                    out['__app_dependencies_count__'] = count
                except Exception:
                    pass
                return out
            except Exception:
                return out
    except Exception:
        pass

if _DBG:
    try:  # pragma: no cover
        from fastapi.routing import APIRoute as _APIRoute2  # type: ignore

        @app.get('/api/debug/deps_for')
        async def _debug_deps_for(path: str) -> dict[str, object]:
            result: dict[str, object] = {'path': path, 'deps': []}
            try:
                for r in app.router.routes:  # type: ignore[attr-defined]
                    if isinstance(r, _APIRoute2) and getattr(r, 'path', None) == path:
                        dep = getattr(r, 'dependant', None)
                        if not dep:
                            break
                        stack = [dep]
                        seen = set()
                        out = []
                        while stack:
                            d = stack.pop()
                            if id(d) in seen:
                                continue
                            seen.add(id(d))
                            try:
                                call = getattr(d, 'call', None)
                                name = getattr(call, '__name__', None)
                                mod = getattr(
                                    getattr(call, '__module__', None), 'strip', lambda: ''
                                )()
                                qps = [
                                    getattr(q, 'name', None)
                                    for q in getattr(d, 'query_params', []) or []
                                ]
                                out.append(
                                    {
                                        'fn': name,
                                        'module': mod,
                                        'query_params': [n for n in qps if n],
                                    }
                                )
                            except Exception:
                                pass
                            try:
                                stack.extend(getattr(d, 'dependencies', []) or [])
                            except Exception:
                                pass
                        result['deps'] = out
                        break
            except Exception:
                pass
            return result
    except Exception:
        pass

## removed fragile admin-query purging on runtime

# Isolated sub-application to avoid any inherited admin query dependencies
try:  # pragma: no cover
    iso = FastAPI(title='Hyperloop Public Exec')

    @iso.post('/execute')
    async def iso_exec(
        payload: dict = Body(...),
        db: _AsyncSession = Depends(_get_db),  # type: ignore[name-defined]
        _perm: bool = Depends(_req_perm('api.hyperloop.execute')),  # type: ignore[name-defined]
    ) -> dict:
        cmds = str((payload or {}).get('commands') or '')
        opts = payload.get('options') if isinstance(payload.get('options'), dict) else None
        if not cmds:
            raise HTTPException(status_code=400, detail='commands required')
        eng = _HyperloopEngine()
        out = await eng.execute(commands_text=cmds, db=db, signature_ctx=None, options=opts)  # type: ignore
        return out if isinstance(out, dict) else {'ok': False, 'error': 'engine returned non-dict'}

    app.mount('/api/hlexec', iso)
except Exception:
    pass

# Local fallback RS admin router is deprecated in favor of inline endpoint


# =============================
# Aux LLM proxy (Phi-4 / llama)
# =============================


def _aux_base_url() -> str:
    # Minimal stable default; advanced resolution via DB/ENV can be added if needed
    return 'http://127.0.0.1:3002'


@app.get('/api/aux-llm/health')
async def aux_llm_health() -> dict[str, Any]:
    try:
        req = _url.Request(
            f'{_aux_base_url()}/health', headers={'Content-Type': 'application/json'}, method='GET'
        )
        with _url.urlopen(req, timeout=1.6) as resp:
            raw = resp.read().decode('utf-8', errors='replace')
            body = _json.loads(raw or '{}')
            ok = bool(isinstance(body, dict) and body.get('status') == 'ok')
            return {'ok': ok, 'service': 'aux-llm', 'response': body}
    except Exception as e:
        return {'ok': False, 'service': 'aux-llm', 'error': str(e)}


@app.post('/api/aux-llm/completion')
async def aux_llm_completion(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    # Accepts either llama.cpp completion format {prompt,n_predict,...}
    # or OpenAI-like {messages:[{role,content}],max_tokens,temperature}
    try:
        prompt: str | None = None
        n_predict: int = int(payload.get('n_predict') or payload.get('max_tokens') or 128)
        temperature: float = float(payload.get('temperature') or 0.2)

        msgs: list[dict[str, Any]] | None = payload.get('messages')  # type: ignore[assignment]
        if isinstance(msgs, list) and msgs:
            # Simple extraction: use last user message content
            for m in reversed(msgs):
                if isinstance(m, dict) and (m.get('role') == 'user'):
                    c = m.get('content')
                    if isinstance(c, str) and c.strip():
                        prompt = c.strip()
                        break
            if prompt is None and isinstance(msgs[-1], dict):
                c2 = msgs[-1].get('content')
                if isinstance(c2, str):
                    prompt = c2

        if prompt is None:
            p = payload.get('prompt')
            if isinstance(p, str):
                prompt = p

        if not prompt:
            raise HTTPException(status_code=400, detail='prompt/messages required')

        out_req = {
            'prompt': prompt,
            'n_predict': max(1, min(n_predict, 2048)),
            'temperature': max(0.0, float(temperature)),
        }
        req = _url.Request(
            f'{_aux_base_url()}/completion',
            data=_json.dumps(out_req).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST',
        )
        with _url.urlopen(req, timeout=8.0) as resp:
            raw = resp.read().decode('utf-8', errors='replace')
            body = _json.loads(raw or '{}')
            content: str | None = None
            if isinstance(body, dict):
                content = body.get('content') or body.get('response') or None  # tolerant
            return {'ok': True, 'content': content, 'raw': body}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'aux completion failed: {e}')


@app.post('/v1/chat/completions')
async def openai_chat_completions(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    # Thin OpenAI-compatible shim that reuses aux_llm_completion logic
    try:
        res = await aux_llm_completion(payload)
        content = (res or {}).get('content')
        if not isinstance(content, str):
            content = ''
        return {
            'id': f'chatcmpl-soul-{os.getpid()}',
            'object': 'chat.completion',
            'created': int(__import__('time').time()),
            'model': str(payload.get('model') or 'phi-4'),
            'choices': [
                {
                    'index': 0,
                    'message': {'role': 'assistant', 'content': content},
                    'finish_reason': 'stop',
                }
            ],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'chat completion failed: {e}')


@app.post('/api/admin/fine_tune/debug_include')
async def debug_include_router():
    # Try to (re)include fine_tune_admin router at runtime, with error details
    attempts: list[dict] = []
    for mod_name in (
        'app.routers.fine_tune_admin',
        'backend.app.routers.fine_tune_admin',
        'tools.catalog.active.admin.fine_tune_admin',
    ):
        rec: dict = {'module': mod_name, 'ok': False}
        try:
            m = importlib.import_module(mod_name)
            r = getattr(m, 'router', None)
            if r is not None:
                try:
                    app.include_router(r)
                except Exception as ie:
                    rec['include_error'] = repr(ie)
                else:
                    rec['ok'] = True
                    attempts.append(rec)
                    return {'ok': True, 'attempts': attempts}
            else:
                rec['error'] = 'no router attr'
        except Exception as e:
            rec['import_error'] = repr(e)
        attempts.append(rec)
    return {'ok': False, 'attempts': attempts}


@app.get('/api/metrics')
async def metrics_json():
    try:
        return get_metrics()
    except Exception:
        return {'status': 'unavailable'}


def _fetch_prom_via_uds() -> str | None:
    try:
        import json as _j
        import socket
        import struct

        sock_path = '/run/soul/rsbus.dev.sock'
        req = {'id': 'probe', 'op': 'metrics', 'payload': None}
        body = _j.dumps(req, ensure_ascii=False).encode('utf-8')
        hdr = struct.pack('>I', len(body))
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as s:
            s.settimeout(1.2)
            s.connect(sock_path)
            s.sendall(hdr + body)
            h = s.recv(4)
            if len(h) != 4:
                return None
            (n,) = struct.unpack('>I', h)
            data = bytearray()
            while len(data) < n:
                chunk = s.recv(n - len(data))
                if not chunk:
                    break
                data.extend(chunk)
        env = _j.loads(bytes(data).decode('utf-8', 'replace'))
        if isinstance(env, dict) and env.get('ok') and isinstance(env.get('result'), dict):
            prom = env['result'].get('prom')
            if isinstance(prom, str) and prom.strip():
                return prom
        return None
    except Exception:
        return None


@app.get('/api/metrics/prometheus', response_class=PlainTextResponse)
async def metrics_prometheus():
    # Preferred: RSBus native Prometheus export via UDS
    try:
        from tools.catalog.active.utils.rs_metrics_service import (
            fetch_rs_metrics_text,  # type: ignore
        )

        try:
            from .db import async_session_maker  # type: ignore
        except Exception:
            from backend.app.db import async_session_maker  # type: ignore
        try:
            async with async_session_maker() as _db:  # type: ignore
                ok, txt = await fetch_rs_metrics_text(_db)
                if ok and isinstance(txt, str) and txt.strip():
                    return txt
        except Exception:
            pass
    except Exception:
        pass
    # Fallback path A: try direct UDS without tools import
    prom = _fetch_prom_via_uds()
    if isinstance(prom, str) and prom.strip():
        return prom
    # Fallback path B: format in-process metrics snapshot if available
    try:
        return format_metrics_for_prometheus(get_metrics())
    except Exception:
        return '# soulpulse metrics unavailable\n'


# Minimal admin p95 report endpoint (fallback if rs_metrics_admin router is not active)
from fastapi import Header


@app.get('/api/admin/rs/report/p95')
async def admin_rs_report_p95(
    preview: bool = False,
    max_age_sec: int | None = None,
    x_telegram_user_id: str | None = Header(default=None),
):
    # Lightweight RBAC check aligned with internal admin header usage
    if not x_telegram_user_id or x_telegram_user_id.strip() != '468326902':
        raise HTTPException(status_code=403, detail='forbidden')
    # Try via tools service
    try:
        from tools.catalog.active.utils.rs_metrics_service import (
            build_p95_summary,
            fetch_rs_metrics_text,
        )  # type: ignore

        try:
            from .db import async_session_maker  # type: ignore
        except Exception:
            from backend.app.db import async_session_maker  # type: ignore
        async with async_session_maker() as _db:  # type: ignore
            ok, txt = await fetch_rs_metrics_text(_db)
            if ok and txt:
                summary = build_p95_summary(txt)
                return {'ok': True, 'summary': summary, 'cached': False}
    except Exception:
        pass
    # Fallback: direct UDS prom fetch + minimal parser
    prom = _fetch_prom_via_uds()
    if not isinstance(prom, str) or not prom.strip():
        # try HTTP internal path as last resort
        try:
            import urllib.request as _rq

            raw = (
                _rq.urlopen('http://127.0.0.1:8000/api/metrics/prometheus', timeout=1.5)
                .read()
                .decode('utf-8', 'replace')
            )
            prom = raw
        except Exception:
            raise HTTPException(status_code=502, detail='metrics unavailable')
    # Minimal local summary builder (quantiles + avg for two metrics)
    import re

    def _parse_hist_q(p: str, metric: str, label_key: str) -> dict[str, dict[str, float]]:
        buckets: dict[str, list[tuple[float, float]]] = {}
        counts: dict[str, float] = {}
        num = r'([0-9eE+\-.]+)'
        brx = re.compile(
            rf'^{metric}_bucket\\{{[^}}]*{label_key}=\"([^\"]+)\"[^}}]*le=\"([^\"]+)\"[^}}]*\\}}\\s+{num}'
        )
        crx = re.compile(rf'^{metric}_count\\{{[^}}]*{label_key}=\"([^\"]+)\"[^}}]*\\}}\\s+{num}')
        for ln in p.splitlines():
            s = ln.strip()
            m = brx.match(s)
            if m:
                lab = m.group(1)
                le_s = m.group(2)
                try:
                    val = float(m.group(3))
                    le = float('inf') if le_s == '+Inf' else float(le_s)
                except Exception:
                    continue
                buckets.setdefault(lab, []).append((le, val))
                continue
            m2 = crx.match(s)
            if m2:
                try:
                    counts[m2.group(1)] = float(m2.group(2))
                except Exception:
                    counts[m2.group(1)] = 0.0
        out: dict[str, dict[str, float]] = {}
        for lab, b in buckets.items():
            b = sorted(b, key=lambda x: x[0])
            total = counts.get(lab, b[-1][1] if b else 0.0)
            if total <= 0:
                out[lab] = {'p50': 0.0, 'p95': 0.0, 'p99': 0.0}
                continue

            def q(t: float) -> float:
                thr = float(total) * t
                for le, v in b:
                    if float(v) >= thr:
                        return float(le)
                return float(b[-1][0])

            out[lab] = {'p50': q(0.5), 'p95': q(0.95), 'p99': q(0.99)}
        return out

    def _parse_sum_count(p: str, metric: str, label_key: str) -> dict[str, dict[str, float]]:
        srx = re.compile(
            rf'^{metric}_sum\\{{[^}}]*{label_key}=\"([^\"]+)\"[^}}]*\\}}\\s+([0-9eE+\-.]+)'
        )
        crx = re.compile(rf'^{metric}_count\\{{[^}}]*{label_key}=\"([^\"]+)\"[^}}]*\\}}\\s+(\d+)')
        sums: dict[str, float] = {}
        cnts: dict[str, float] = {}
        for ln in prom.splitlines():
            s = ln.strip()
            m = srx.match(s)
            if m:
                try:
                    sums[m.group(1)] = float(m.group(2))
                except Exception:
                    pass
                continue
            m2 = crx.match(s)
            if m2:
                try:
                    cnts[m2.group(1)] = float(m2.group(2))
                except Exception:
                    cnts[m2.group(1)] = 0.0
        out: dict[str, dict[str, float]] = {}
        for lab, c in cnts.items():
            s = float(sums.get(lab, 0.0))
            avg = (s / c) if c > 0 else 0.0
            out[lab] = {'count': c, 'avg': avg}

        return out

    def _merge(
        q: dict[str, dict[str, float]], sc: dict[str, dict[str, float]]
    ) -> dict[str, dict[str, float]]:
        keys = set(q.keys()) | set(sc.keys())
        merged: dict[str, dict[str, float]] = {}
        for k in keys:
            item: dict[str, float] = {}
            if k in q:
                item.update(q[k])
            if k in sc:
                item.update({'count': sc[k].get('count', 0.0), 'avg': sc[k].get('avg', 0.0)})
            merged[k] = item
        return merged

    hl_q = _parse_hist_q(prom, 'hyperloop_rs_latency_ms', 'phase')
    bus_q = _parse_hist_q(prom, 'rsbus_latency_ms', 'op')
    hl_sc = _parse_sum_count(prom, 'hyperloop_rs_latency_ms', 'phase')
    bus_sc = _parse_sum_count(prom, 'rsbus_latency_ms', 'op')
    summary = {
        'hyperloop_rs_latency_ms': _merge(hl_q, hl_sc),
        'rsbus_latency_ms': _merge(bus_q, bus_sc),
    }
    return {'ok': True, 'summary': summary, 'cached': False}
