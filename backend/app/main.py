from __future__ import annotations

from fastapi import FastAPI, Depends, HTTPException, Request
from typing import Optional
import aiohttp
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse, FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import json
import time
from collections import defaultdict
from datetime import datetime, timedelta

from .config import get_settings
# Импорт модуля Telegram для обработки апдейтов в webhook
try:
    from . import telegram  # noqa: F401
except Exception as _tg_err:  # pragma: no cover
    telegram = None  # type: ignore
    logging.getLogger(__name__).warning(f"telegram module disabled: {_tg_err}")
from .routers import auth, prompts, chat
from .routers import soul as soul_router
from .routers import soul_ws as soul_ws_router
from .routers import soul_import as soul_import_router
from .routers import soul_settings_admin as soul_settings_admin_router
try:
    from .routers import soul_advanced_optimization as soul_advanced_optimization_router  # type: ignore
    _ADV_OPT_ENABLED = True
except Exception as _adv_err:
    _ADV_OPT_ENABLED = False
    logging.getLogger(__name__).warning(f"Advanced optimization router disabled: {_adv_err}")
from .routers import soul_dashboard_api as soul_dashboard_api_router
from .routers import health_monitoring as health_monitoring_router
try:
    from .routers import dev_access_admin as dev_access_admin_router  # type: ignore
except Exception as _dev_acc_err:
    dev_access_admin_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"dev_access_admin disabled: {_dev_acc_err}")
from .routers import rs_metrics_admin as rs_metrics_admin_router
from .routers import soul_search_api as soul_search_api_router
from .routers import i18n as i18n_router
from .routers import payments
from .routers import prompts_integration
from .routers import profile, themes, reminders
# P22 фасады импортируем лениво внутри флага ENABLE_P22_FACADES
from .routers.reminders_facade import router as reminders_facade_router  # type: ignore
from .routers import llm_management, message_management
from .routers import rbac_admin
from .services.background_monitor import start_background_monitors  # type: ignore
try:
    from .background_sleep import SleepSchedulerTask  # type: ignore
    _SLEEP_SCHED_AVAILABLE = True
except Exception as _sl_err:  # pragma: no cover
    SleepSchedulerTask = None  # type: ignore
    _SLEEP_SCHED_AVAILABLE = False
    logging.getLogger(__name__).warning(f"sleep scheduler disabled: {_sl_err}")
try:
    from .services.resilience_guardian import start_resilience_guardians  # type: ignore
except Exception as _rg_err:  # pragma: no cover
    async def start_resilience_guardians(*args, **kwargs):  # type: ignore
        return None
    logging.getLogger(__name__).warning(f"resilience_guardian disabled: {_rg_err}")
from .routers import registration as registration_router
from .routers import promo_admin as promo_admin_router
from .routers import registration_admin as registration_admin_router
from .routers import admin_settings as admin_settings_router
try:
    # Импортируем модуль напрямую (не через пакетный __init__), чтобы избежать требований к реэкспорту
    import importlib as _imp_res
    _res_mod = _imp_res.import_module("app.routers.resilience_admin")
    resilience_admin_router = _res_mod  # type: ignore
except Exception as _res_err:
    resilience_admin_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"resilience_admin disabled: {_res_err}")
reminders_audit_router = None  # type: ignore
try:
    from .routers.pc_admin import router as pc_admin_router  # type: ignore
except Exception as _pc_admin_err:
    pc_admin_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"pc_admin router disabled: {_pc_admin_err}")
from .routers import keywords as keywords_router
from .routers import keywords_alt as keywords_alt_router
from .routers import keywords_admin as keywords_admin_router
from .routers import cache_management
from .routers import account_management
from .routers import user_profile_update
from .routers import force_test_data
from .routers import user_permissions
from .routers import user_role_management
from .routers import performance
from .routers import advanced_monitoring
from .routers import security_api
from .routers import consistency_admin as consistency_admin_router
from .routers import security_red_team as security_red_team_router
from .routers import dispatcher_admin
from .routers import energy_admin
from .routers import processor_dashboard_api as processor_dashboard
try:
    from .routers import harvest_admin as _harvest_admin
except Exception as _harvest_err:  # pragma: no cover
    _harvest_admin = None  # type: ignore
    logging.getLogger(__name__).warning(f"harvest_admin disabled: {_harvest_err}")
import os as _os_voice
try:
    from .routers.voice_asr import router as voice_asr_router  # type: ignore
except Exception as _asr_err:  # pragma: no cover
    voice_asr_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"voice_asr router disabled: {_asr_err}")
try:
    from .routers.voice_tts import router as voice_tts_router  # type: ignore
except Exception as _tts_err:  # pragma: no cover
    voice_tts_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"voice_tts router disabled: {_tts_err}")
try:
    from .routers.voice_rt import router as voice_rt_router  # type: ignore
except Exception as _rt_err:  # pragma: no cover
    voice_rt_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"voice_rt router disabled: {_rt_err}")
try:
    from .routers.voice_video import router as video_router  # type: ignore
except Exception as _v_err:
    video_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"video router disabled: {_v_err}")
# Feature flags to avoid unintended enablement
try:
    _VOICE_ASR_ENABLED = _os_voice.getenv("ENABLE_VOICE_ASR", "0").strip() in ("1","true","True")
except Exception:
    _VOICE_ASR_ENABLED = False
try:
    _VOICE_TTS_ENABLED = _os_voice.getenv("ENABLE_VOICE_TTS", "0").strip() in ("1","true","True")
except Exception:
    _VOICE_TTS_ENABLED = False
try:
    _VOICE_RT_ENABLED = _os_voice.getenv("ENABLE_VOICE_RT", "0").strip() in ("1","true","True")
except Exception:
    _VOICE_RT_ENABLED = False
logging.getLogger(__name__).info(f"VOICE FLAGS: ASR={_VOICE_ASR_ENABLED} TTS={_VOICE_TTS_ENABLED}")
# P22: two-keys + pc/cursor (dry-run)
# two_keys_admin router временно отключён (файл отсутствует на сервере)
try:
    from .routers.pc_ops import router as pc_ops_router  # type: ignore
except Exception as _pc_ops_err:
    pc_ops_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"pc_ops router disabled: {_pc_ops_err}")
try:
    from .routers.cursor_ops import router as cursor_ops_router  # type: ignore
except Exception as _cursor_ops_err:
    cursor_ops_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"cursor_ops router disabled: {_cursor_ops_err}")
import os as _os_guard
_SYSTEM_API_ENABLED = _os_guard.getenv("ENABLE_SYSTEM_API", "0").strip() in ("1", "true", "True")
try:
    if _SYSTEM_API_ENABLED:
        from .routers import system_api  # type: ignore
    else:
        system_api = None  # type: ignore
except Exception as _sys_err:
    system_api = None  # type: ignore
    logging.getLogger(__name__).warning(f"system_api disabled by error: {_sys_err}")
from .routers import soul_goals_api
from .routers import trace_admin as trace_admin_router
from .routers import provenance_admin as provenance_admin_router
from .routers import personality_admin as personality_admin_router
try:
    from .routers import personality_public as personality_public_router
except Exception as _p51_pub_err:
    personality_public_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"personality_public disabled: {_p51_pub_err}")
try:
    from .routers import media_public as media_public_router
except Exception as _media_pub_err:
    media_public_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"media_public disabled: {_media_pub_err}")
try:
    from .routers import monitoring_public as monitoring_public_router
except Exception as _mon_pub_err:
    monitoring_public_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"monitoring_public disabled: {_mon_pub_err}")
try:
    from .routers import incidents_public as incidents_public_router
except Exception as _inc_pub_err:
    incidents_public_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"incidents_public disabled: {_inc_pub_err}")
try:
    from .routers import subscriptions_public as subscriptions_public_router
except Exception as _sub_pub_err:
    subscriptions_public_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"subscriptions_public disabled: {_sub_pub_err}")
try:
    from .routers import process_public as process_public_router
except Exception as _proc_pub_err:
    process_public_router = None  # type: ignore
    logging.getLogger(__name__).warning(f"process_public disabled: {_proc_pub_err}")
import os as _os_feature
try:
    _ACT_GOALS_DISABLED = _os_feature.getenv("DISABLE_ACTIVITY_GOALS_INTEGRATION", "0").strip() in ("1", "true", "True")
except Exception:
    _ACT_GOALS_DISABLED = False
try:
    if not _ACT_GOALS_DISABLED:
        from .routers import activity_goals_integration_api as activity_goals_integration_router  # type: ignore
        _ACT_GOALS_ENABLED = True
    else:
        _ACT_GOALS_ENABLED = False
except Exception as _agi_err:
    _ACT_GOALS_ENABLED = False
    logging.getLogger(__name__).warning(f"Activity goals integration router disabled: {_agi_err}")
from .routers import family_admin
from .routers import activities_admin
from .routers import skills_admin
from .routers import calendar_transport_admin
from .routers import bot_admin
from .api import llm_settings
try:
    from . import telegram
except Exception as _tg2_err:  # pragma: no cover
    telegram = None  # type: ignore
    logging.getLogger(__name__).warning(f"telegram module disabled (late): {_tg2_err}")
# Background tasks (robust import for PROD compatibility)
try:
    from .background_tasks import (
        start_reminder_task,
        stop_reminder_task,
        start_promo_task,
        stop_promo_task,
        start_calendar_sync_task,
        stop_calendar_sync_task,
    )
    try:
        from .background_tasks import (
            start_signature_retention_task,
            stop_signature_retention_task,
        )
    except Exception:
        def start_signature_retention_task(*args, **kwargs):  # type: ignore
            return None

        def stop_signature_retention_task(*args, **kwargs):  # type: ignore
            return None
except Exception:
    # Define no-op fallbacks to avoid startup failures if background_tasks module layout differs on PROD
    def start_reminder_task(*args, **kwargs):  # type: ignore
        return None

    def stop_reminder_task(*args, **kwargs):  # type: ignore
        return None

    def start_promo_task(*args, **kwargs):  # type: ignore
        return None

    def stop_promo_task(*args, **kwargs):  # type: ignore
        return None

    def start_calendar_sync_task(*args, **kwargs):  # type: ignore
        return None

    def stop_calendar_sync_task(*args, **kwargs):  # type: ignore
        return None

    def start_signature_retention_task(*args, **kwargs):  # type: ignore
        return None

    def stop_signature_retention_task(*args, **kwargs):  # type: ignore
        return None
from .background_dispatcher import DispatcherScheduler
from .services.processor_scheduler import ProcessorScheduler
from .services.feature_flags_supervisor import FeatureFlagsSupervisor
from .monitoring import (
    log_request_middleware, 
    metrics, 
    logger, 
    check_database_health,
    format_metrics_for_prometheus
)
from .services.advanced_monitoring import record_request_metrics, record_webhook_5xx_event
from .services.pg_listener import PgNotifyListener
from .api_diagnostics import get_diagnostics, get_prometheus_metrics
try:
    # Гистограммы/метрики для Aux LLM
    from .lib.observability.metrics import get_percentile as _m_get_percentile, get_counter_total as _m_get_counter_total  # type: ignore
except Exception:
    def _m_get_percentile(*args, **kwargs):  # type: ignore
        return 0.0
    def _m_get_counter_total(*args, **kwargs):  # type: ignore
        return 0
from .db import get_db_session
from . import schemas
from .auth import create_jwt, verify_init_data, decode_jwt
from .models import User
from sqlalchemy import select
from .services.rbac_service import RBACService
from .utils.security import sanitize_response_data
from .services.privacy_sanitizer import mask_pii_in_obj
from .services.gendarme_service import GendarmeService
from .routers import daily_admin as daily_admin_router

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
_ENABLE_PG_LISTENER = False
try:
    import os as __os_pl
    _ENABLE_PG_LISTENER = __os_pl.getenv("ENABLE_PG_LISTENER", "0").strip() in ("1", "true", "True")
except Exception:
    _ENABLE_PG_LISTENER = False

app = FastAPI(
    title="SoulPulse Mini App API",
    version="2.9",
    description="API для SoulPulse Mini App с поддержкой множественных LLM провайдеров"
)

# P21/P50: короткий кэш для инцидент‑метрик JSON (≤30s)
_INC_JSON_CACHE: dict = {"ts": 0.0, "data": {}}

# Совместимость: отдать OpenAPI под префиксом /api/ (через Nginx location /api/)
@app.get("/api/openapi.json", include_in_schema=False)
async def get_openapi_schema():
    try:
        return app.openapi()  # type: ignore[attr-defined]
    except Exception:
        # fallback пустой объект
        return {"openapi": "3.0.0", "paths": {}}

# Optional LLM warm-up to reduce cold-start latency
async def _llm_warmup() -> None:
    try:
        from .services.llm_manager import LLMManager as _LLMM
        from .services.llm_client import LLMClient as _LLMC
        mgr = _LLMM()
        cli = _LLMC(settings_service=None)
        messages = [
            {"role": "system", "content": "You are a fast health-check model. Return 'ok'."},
            {"role": "user", "content": "ping"},
        ]
        try:
            model_cfg = await mgr.get_model_for_function(db=None, function_name="soul_core")
        except Exception:
            model_cfg = None
        try:
            await cli.send(
                messages=messages,
                model_config=model_cfg,
                request_type="warmup",
                max_tokens=8,
                temperature=0.0,
                use_cache=False,
                db=None,
            )
        except Exception:
            pass
    except Exception:
        pass

# Rate Limiting - улучшенная реализация в памяти
rate_limit_storage = defaultdict(list)
import os as _os_rl
_HYPER_REQ = 400
_HYPER_WIN = 60
try:
    _HYPER_REQ = int((_os_rl.getenv('RATE_LIMIT_HYPERLOOP_REQUESTS', '400') or '400').strip())
    _HYPER_WIN = int((_os_rl.getenv('RATE_LIMIT_HYPERLOOP_WINDOW', '60') or '60').strip())
except Exception:
    _HYPER_REQ = 400
    _HYPER_WIN = 60

rate_limit_config = {
    # Базовые лимиты для разных типов запросов
    'default': {'requests': 200, 'window': 60},      # 200 запросов в минуту (по умолчанию)
    'chat': {'requests': 30, 'window': 60},          # 30 сообщений в минуту
    'llm': {'requests': 20, 'window': 60},           # 20 LLM запросов в минуту
    'auth': {'requests': 10, 'window': 300},         # 10 попыток авторизации в 5 минут
    'admin': {'requests': 1000, 'window': 60},       # 1000 запросов для админов
    'hyperloop': {'requests': _HYPER_REQ, 'window': _HYPER_WIN},  # повышенный лимит для ingest/DSL
}

# Adaptive limiter state (AIMD) for hyperloop
_hl_state = {
    'requests': rate_limit_config['hyperloop']['requests'],
    'window': rate_limit_config['hyperloop']['window'],
    'last_adjust_ts': 0.0,
}

async def _adjust_hyperloop_limits() -> None:
    """AIMD: увеличить лимит при норме метрик, уменьшить при деградации.
    Источники: Prometheus через rs_metrics_service (rsbus/hyperloop), /api/metrics (5xx rate, p95 proxy).
    """
    try:
        import time as _t
        now = _t.time()
        # не чаще раза в 30 секунд
        if now - float(_hl_state.get('last_adjust_ts', 0.0)) < 30.0:
            return
        _hl_state['last_adjust_ts'] = now
        # Быстрая оценка здоровья API
        api_ok = True
        p95_ok = True
        try:
            from .services.rs_metrics_service import fetch_rs_metrics_text, build_p95_summary  # type: ignore
            async with get_db_session() as _db:  # type: ignore
                ok, txt = await fetch_rs_metrics_text(_db)
                if ok:
                    summary = build_p95_summary(txt)
                    # p95 rsbus/hyperloop.execute (<=0.2 ms как локальный бенчмарк для шины; общий API пулы оцениваем отдельно)
                    rs_p95 = (summary.get('rsbus_latency_ms') or {}).get('hyperloop.execute', {}).get('p95', 0.2)
                    p95_ok = float(rs_p95 or 0.2) <= 0.3
        except Exception:
            pass
        try:
            # JSON metrics exporter contains error_rate and p95 proxies when available
            data = await get_metrics()  # reuse route function to assemble JSON
            err_rate = float(data.get('error_rate', 0.0) or 0.0)
            api_ok = err_rate < 0.01
        except Exception:
            api_ok = True
        # Адаптация
        cur = int(_hl_state['requests'])
        win = int(_hl_state['window'])
        max_cap = max(200, int((_os_rl.getenv('RATE_LIMIT_HYPERLOOP_MAX', '800') or '800').strip()))
        min_cap = max(100, int((_os_rl.getenv('RATE_LIMIT_HYPERLOOP_MIN', '200') or '200').strip()))
        if api_ok and p95_ok:
            # Additive increase (+50) до капа
            new_val = min(max_cap, cur + 50)
        else:
            # Multiplicative decrease (50%) до минимума
            new_val = max(min_cap, max(min_cap, int(cur * 0.5)))
        if new_val != cur:
            rate_limit_config['hyperloop']['requests'] = new_val
            _hl_state['requests'] = new_val
    except Exception:
        pass

def get_rate_limit_key(request: Request) -> tuple:
    """Определяет ключ и лимиты для rate limiting"""
    client_ip = request.client.host if request.client else "unknown"
    path = request.url.path
    
    # Определяем тип запроса по пути
    if '/api/chat/' in path:
        limit_type = 'chat'
    elif '/api/llm/' in path:
        limit_type = 'llm'  
    elif '/api/auth/' in path or '/webauth' in path:
        limit_type = 'auth'
    elif '/api/admin/' in path or '/api/rbac/' in path:
        limit_type = 'admin'
    elif '/api/hyperloop/' in path:
        limit_type = 'hyperloop'
    else:
        limit_type = 'default'
    
    return f"{client_ip}:{limit_type}", rate_limit_config[limit_type]

@app.middleware("http")
async def rate_limiting_middleware(request: Request, call_next):
    """
    Интеллектуальное rate limiting с разными лимитами для разных типов запросов
    """
    rate_key, limits = get_rate_limit_key(request)
    current_time = time.time()
    window = limits['window']
    max_requests = limits['requests']
    
    # Очищаем старые записи
    rate_limit_storage[rate_key] = [
        timestamp for timestamp in rate_limit_storage[rate_key]
        if current_time - timestamp < window
    ]
    
    # Периодическая адаптация лимита hyperloop (AIMD)
    try:
        path = request.url.path or ""
        if '/api/hyperloop/' in path:
            await _adjust_hyperloop_limits()
    except Exception:
        pass
    # Проверяем лимит
    current_requests = len(rate_limit_storage[rate_key])
    if current_requests >= max_requests:
        return JSONResponse(
            status_code=429,
            content={
                "detail": f"Rate limit exceeded. Maximum {max_requests} requests per {window} seconds.",
                "retry_after": window,
                "current_requests": current_requests,
                "limit": max_requests
            }
        )
    
    # Добавляем текущий запрос
    rate_limit_storage[rate_key].append(current_time)
    
    # Измеряем время ответа для мониторинга
    start_time = time.time()
    response = await call_next(request)
    response_time = time.time() - start_time
    
    # Записываем метрики в расширенный мониторинг
    # Считаем ошибками только 5xx, чтобы 4xx (клиентские) не засоряли алерты
    success = response.status_code < 500
    record_request_metrics(response_time, success)
    
    # Добавляем заголовки с информацией о лимитах
    response.headers["X-RateLimit-Limit"] = str(max_requests)
    response.headers["X-RateLimit-Remaining"] = str(max_requests - current_requests - 1)
    response.headers["X-RateLimit-Reset"] = str(int(current_time + window))
    
    return response

# XSS Protection Middleware
@app.middleware("http")
async def xss_protection_middleware(request: Request, call_next):
    """
    Middleware для защиты от XSS - экранирует выходные данные
    """
    response = await call_next(request)
    
    # Применяем только к JSON ответам
    if (response.headers.get("content-type", "").startswith("application/json") and 
        hasattr(response, 'body')):
        try:
            import json
            # Получаем тело ответа
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            
            # Парсим JSON
            data = json.loads(body.decode())
            
            # Сначала маскируем PII, затем экранируем данные
            masked = mask_pii_in_obj(data)
            sanitized_data = sanitize_response_data(masked)
            
            # Создаем новый ответ с экранированными данными
            new_body = json.dumps(sanitized_data, ensure_ascii=False).encode()
            
            return JSONResponse(
                content=sanitized_data,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
        except Exception:
            # Если не удалось обработать, возвращаем оригинальный ответ
            pass
    
    return response

# Мониторинг middleware
app.middleware("http")(log_request_middleware())

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Добавляет заголовки безопасности ко всем ответам (с поддержкой Swagger UI)."""
    response = await call_next(request)

    # Основные заголовки безопасности
    response.headers["X-Content-Type-Options"] = "nosniff"
    # Разрешаем встраивание в WebView Telegram (iframe/miniapp). SAMEORIGIN безопаснее DENY для кейса WebView
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"

    # Базовый CSP
    is_docs = request.url.path.startswith("/docs") or request.url.path.startswith("/redoc")
    if is_docs:
        # Разрешаем CDN Swagger UI и шрифты для /docs
        csp_policies = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://telegram.org",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
            "img-src 'self' data: https:",
            "connect-src 'self' wss: https://cdn.jsdelivr.net https://api.deepseek.com https://gigachat.devices.sberbank.ru https://ngw.devices.sberbank.ru https://mini.soulpulse.art",
            "font-src 'self' https://fonts.gstatic.com",
            "object-src 'none'",
            "media-src 'self'",
            "frame-src 'self' https://t.me https://*.telegram.org",
            "frame-ancestors 'self' https://t.me https://*.telegram.org https://web.telegram.org"
        ]
    else:
        csp_policies = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "connect-src 'self' wss: https://api.deepseek.com https://gigachat.devices.sberbank.ru https://ngw.devices.sberbank.ru https://mini.soulpulse.art",
            "font-src 'self'",
            "object-src 'none'",
            "media-src 'self'",
            "frame-src 'self' https://t.me https://*.telegram.org",
            "frame-ancestors 'self' https://t.me https://*.telegram.org https://web.telegram.org"
        ]
    response.headers["Content-Security-Policy"] = "; ".join(csp_policies)

    # HSTS только для HTTPS (в продакшене)
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

    # Дополнительные заголовки
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    # Allow mic/camera for same-origin to enable realtime voice
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(self), camera=(self), autoplay=(self)"

    return response

# Ensure UTF-8 charset for JSON responses (avoids mojibake in some clients)
@app.middleware("http")
async def enforce_utf8_json_charset(request: Request, call_next):
    response = await call_next(request)
    try:
        ct = response.headers.get("content-type", "")
        if isinstance(ct, str) and ct.lower().startswith("application/json") and "charset=" not in ct.lower():
            response.headers["content-type"] = "application/json; charset=utf-8"
    except Exception:
        pass
    return response

# CORS - БЕЗОПАСНАЯ конфигурация (НЕ используем "*")
origins = []
if settings.cors_origins:
    origins = [o.strip() for o in settings.cors_origins.split(",")]

# Для локальной разработки добавляем ТОЛЬКО известные безопасные домены
development_origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://test.soulpulse.art",
    "https://soulpulse.art",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

# Объединяем с конфигурационными origins (БЕЗ "*")
origins.extend(development_origins)

# Убираем "*" если он есть для безопасности
if "*" in origins:
    origins.remove("*")
    logger.warning("Removed wildcard '*' from CORS origins for security")

# Если список пустой, добавляем только localhost для разработки
if not origins:
    origins = development_origins
    logger.info(f"Using default safe CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "Accept", 
        "Origin", 
        "X-Requested-With",
        "X-Content-Type-Options",
        "X-Frame-Options", 
        "X-XSS-Protection",
        "X-Telegram-User-ID"
    ],
    expose_headers=[
        "X-Content-Type-Options",
        "X-Frame-Options", 
        "X-XSS-Protection",
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "Referrer-Policy",
        "Permissions-Policy"
    ]
)

# Routers
app.include_router(auth.router)
try:
    app.include_router(auth.web_router)
except Exception:
    pass
try:
    from .routers import web_auth as _web_auth
    app.include_router(_web_auth.router)
except Exception as _wa_err:
    logging.getLogger(__name__).warning(f"web_auth router include failed: {_wa_err}")
app.include_router(prompts.router)
app.include_router(chat.router)
app.include_router(soul_router.router)
app.include_router(soul_ws_router.router)
# Дублируем WebSocket‑роутер под префиксом /api для совместимости с Nginx
try:
    app.include_router(soul_ws_router.router, prefix="/api")
except Exception:
    pass
app.include_router(soul_import_router.router)
app.include_router(soul_settings_admin_router.router)
if _ADV_OPT_ENABLED:
    app.include_router(soul_advanced_optimization_router.router)
app.include_router(soul_dashboard_api_router.router)
app.include_router(soul_dashboard_api_router.alias_router)
app.include_router(health_monitoring_router.router)
if dev_access_admin_router is not None:
    try:
        app.include_router(dev_access_admin_router.router)
    except Exception as _dev_inc_err:
        logging.getLogger(__name__).warning(f"dev_access_admin include failed: {_dev_inc_err}")
app.include_router(soul_goals_api.router)
if _ACT_GOALS_ENABLED:
    app.include_router(activity_goals_integration_router.router)
app.include_router(soul_search_api_router.router)
app.include_router(payments.router)
app.include_router(i18n_router.router)
app.include_router(prompts_integration.router)
app.include_router(profile.router)
app.include_router(themes.router)
app.include_router(reminders.router)
app.include_router(reminders_facade_router)
import os as __p22
_P22_ENABLED = __p22.getenv("ENABLE_P22_FACADES", "0").strip() in ("1","true","True")
# Календари: подключаем фасад всегда (read-доступ и SSE доступны независимо от флага; write внутри фасада под флагом)
try:
    from .routers import calendar_facade as _calendar_facade  # type: ignore
    app.include_router(_calendar_facade.router)
    _CALENDAR_FACADE_INCLUDED = True  # type: ignore
except Exception as _p22_cal_err:
    logging.getLogger(__name__).warning(f"calendar_facade disabled: {_p22_cal_err}")

if _P22_ENABLED:
    # Подключаем остальные фасады независимо, чтобы ошибка одного не блокировала остальные
    try:
        from .routers.tasks_facade import router as tasks_facade_router  # type: ignore
        app.include_router(tasks_facade_router)
    except Exception as _p22_tasks_err:
        logging.getLogger(__name__).warning(f"tasks_facade disabled: {_p22_tasks_err}")
    try:
        from .routers.events_facade import router as events_facade_router  # type: ignore
        app.include_router(events_facade_router)
    except Exception as _p22_events_err:
        logging.getLogger(__name__).warning(f"events_facade disabled: {_p22_events_err}")
    try:
        from .routers.gantt_facade import router as gantt_facade_router  # type: ignore
        app.include_router(gantt_facade_router)
    except Exception as _p22_gantt_err:
        logging.getLogger(__name__).warning(f"gantt_facade disabled: {_p22_gantt_err}")
app.include_router(llm_management.router)
app.include_router(message_management.router)
app.include_router(keywords_router.router)
app.include_router(keywords_alt_router.router)
app.include_router(keywords_admin_router.router)
app.include_router(cache_management.router)
app.include_router(account_management.router)
app.include_router(user_profile_update.router)
# Подключаем тестовый роутер только если включен флаг
import os as _os
if _os.getenv("ENABLE_FORCE_TEST", "0").strip() in ("1", "true", "True"):  # безопасно по умолчанию
    app.include_router(force_test_data.router)
app.include_router(user_permissions.router)
app.include_router(user_role_management.router)
app.include_router(performance.router)
app.include_router(advanced_monitoring.router)
from fastapi import APIRouter
orchestrator_admin = APIRouter(prefix="/api/bot/orchestrator", tags=["Bot Orchestrator"])

@orchestrator_admin.get("/health")
async def orch_health():
    from .orchestrator import orchestrator as _orch
    try:
        snap = _orch.health_snapshot()
    except Exception as e:
        return {"ok": False, "error": str(e)}
    return {"ok": True, "snapshot": snap}

@orchestrator_admin.get("/queues")
async def orch_queues():
    from .orchestrator import orchestrator as _orch
    try:
        return {"ok": True, "queues": _orch.queues_overview()}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@orchestrator_admin.post("/pause")
async def orch_pause(queue: str):
    from .orchestrator import orchestrator as _orch
    try:
        _orch.pause(queue)
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@orchestrator_admin.post("/resume")
async def orch_resume(queue: str):
    from .orchestrator import orchestrator as _orch
    try:
        _orch.resume(queue)
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@orchestrator_admin.post("/clear")
async def orch_clear(queue: str):
    from .orchestrator import orchestrator as _orch
    try:
        _orch.clear(queue)
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

app.include_router(orchestrator_admin)
try:
    from .routers import qlinks_admin as _qlinks_admin
    app.include_router(_qlinks_admin.router)
except Exception as _ql_err:
    logging.getLogger(__name__).warning(f"qlinks_admin disabled: {_ql_err}")
app.include_router(rs_metrics_admin_router.router)
try:
    from .routers import rs_admin_dashboard as _rs_dash
    app.include_router(_rs_dash.router)
except Exception as _rs_dash_err:
    logging.getLogger(__name__).warning(f"rs_admin_dashboard disabled: {_rs_dash_err}")
try:
    from .routers import rs_nightly_admin as _rs_nightly
    app.include_router(_rs_nightly.router)
    # Public proxy for selected admin endpoints (still requires soul.admin RBAC)
    try:
        from .routers import public_admin_proxy as _pub_admin
        app.include_router(_pub_admin.router)
    except Exception as _pub_err:
        logging.getLogger(__name__).warning(f"public_admin_proxy disabled: {_pub_err}")
    # PDP audit admin
    try:
        from .routers import pdp_audit_admin as _pdp_audit
        app.include_router(_pdp_audit.router)
    except Exception as _pdp_audit_err:
        logging.getLogger(__name__).warning(f"pdp_audit_admin disabled: {_pdp_audit_err}")
except Exception as _rs_nightly_err:
    logging.getLogger(__name__).warning(f"rs_nightly_admin disabled: {_rs_nightly_err}")
app.include_router(security_api.router)
app.include_router(consistency_admin_router.router)
app.include_router(security_red_team_router.router)
app.include_router(dispatcher_admin.router)
app.include_router(energy_admin.router)
app.include_router(processor_dashboard.router)
if _harvest_admin is not None:
    try:
        app.include_router(_harvest_admin.router)
    except Exception as _harvest_inc_err:
        logging.getLogger(__name__).warning(f"harvest_admin include failed: {_harvest_inc_err}")
if voice_asr_router is not None and _VOICE_ASR_ENABLED:
    app.include_router(voice_asr_router)
if voice_tts_router is not None and _VOICE_TTS_ENABLED:
    app.include_router(voice_tts_router)
if 'voice_rt_router' in globals() and (voice_rt_router is not None) and (globals().get('_VOICE_RT_ENABLED', False)):
    app.include_router(voice_rt_router)
# Runtime safeguard: include voice_rt router if env was loaded later than module import
try:
    import os as __rt_os
    if voice_rt_router is not None and (__rt_os.getenv("ENABLE_VOICE_RT", "0").strip() in ("1", "true", "True")):
        try:
            _has_rt = any(getattr(r, 'path', None) == '/api/voice/rt' for r in app.router.routes)  # type: ignore[attr-defined]
        except Exception:
            _has_rt = False
        if not _has_rt:
            app.include_router(voice_rt_router)
except Exception:
    pass
if video_router is not None:
    app.include_router(video_router)
if pc_admin_router is not None:
    app.include_router(pc_admin_router)
if pc_ops_router is not None:
    app.include_router(pc_ops_router)
if cursor_ops_router is not None:
    app.include_router(cursor_ops_router)
if system_api is not None:
    app.include_router(system_api.router)  # Системные модули v2.0: sleep/optimize/harvest
app.include_router(family_admin.router)
app.include_router(activities_admin.router)
app.include_router(skills_admin.router)
app.include_router(calendar_transport_admin.router)
app.include_router(bot_admin.router)
try:
    app.include_router(activities_admin.sensations_router)
except Exception as _sens_err:
    logging.getLogger(__name__).warning(f"Sensations alias router disabled: {_sens_err}")
app.include_router(registration_router.router)
app.include_router(promo_admin_router.router)
app.include_router(registration_admin_router.router)
app.include_router(trace_admin_router.router)
app.include_router(provenance_admin_router.router)
app.include_router(personality_admin_router.router)
if personality_public_router is not None:
    app.include_router(personality_public_router.router)
if media_public_router is not None:
    app.include_router(media_public_router.router)
if monitoring_public_router is not None:
    app.include_router(monitoring_public_router.router)
if incidents_public_router is not None:
    app.include_router(incidents_public_router.router)
if subscriptions_public_router is not None:
    app.include_router(subscriptions_public_router.router)
if process_public_router is not None:
    app.include_router(process_public_router.router)
try:
    from .routers import incidents_admin as _incidents_admin
    app.include_router(_incidents_admin.router)
except Exception as _inc_err:
    logging.getLogger(__name__).warning(f"incidents_admin disabled: {_inc_err}")
try:
    from .routers import feature_flags_admin as _ff_admin
    app.include_router(_ff_admin.router)
except Exception as _ff_err:
    logging.getLogger(__name__).warning(f"feature_flags_admin disabled: {_ff_err}")
try:
    from .routers import sanitizer_admin as _san_admin
    app.include_router(_san_admin.router)
except Exception as _san_err:
    logging.getLogger(__name__).warning(f"sanitizer_admin disabled: {_san_err}")
try:
    from .routers import gendarme_admin as _gend_admin
    app.include_router(_gend_admin.router)
except Exception as _gend_err:
    logging.getLogger(__name__).warning(f"gendarme_admin disabled: {_gend_err}")
try:
    from .routers import experiments_admin as _exp_admin
    app.include_router(_exp_admin.router)
except Exception as _exp_err:
    logging.getLogger(__name__).warning(f"experiments_admin disabled: {_exp_err}")
try:
    from .routers import judge_admin as _judge_admin
    app.include_router(_judge_admin.router)
except Exception as _judge_err:
    logging.getLogger(__name__).warning(f"judge_admin disabled: {_judge_err}")
try:
    from .routers import archivarius_admin as _arch_admin
    app.include_router(_arch_admin.router)
except Exception as _arch_err:
    logging.getLogger(__name__).warning(f"archivarius_admin disabled: {_arch_err}")
from .routers import hyperloop_admin as _hyperloop_admin
app.include_router(_hyperloop_admin.router)
try:
    from .routers import agent_comm as _agent_comm
    app.include_router(_agent_comm.router)
    # Дублируем маршруты без префикса для ws-пути /ws/* (совместимость с Nginx location /ws/)
    try:
        app.include_router(_agent_comm.router, prefix="")
    except Exception:
        pass
except Exception as _ac_err:
    logging.getLogger(__name__).warning(f"agent_comm router disabled: {_ac_err}")
try:
    import importlib as _imp
    _ui_admin = _imp.import_module("app.routers.ui_admin")
    app.include_router(_ui_admin.router)
except Exception as _ui_err:
    logging.getLogger(__name__).warning(f"ui_admin disabled: {_ui_err}")
try:
    import importlib as _imp2
    _frontman_admin = _imp2.import_module("app.routers.frontman_admin")
    app.include_router(_frontman_admin.router)
except Exception as _fm_err:
    logging.getLogger(__name__).warning(f"frontman_admin disabled: {_fm_err}")
try:
    import importlib as _imp3
    _backman_admin = _imp3.import_module("app.routers.backman_admin")
    app.include_router(_backman_admin.router)
except Exception as _bm_err:
    logging.getLogger(__name__).warning(f"backman_admin disabled: {_bm_err}")
try:
    from .routers import two_keys_admin as _twok_admin
    app.include_router(_twok_admin.router)
except Exception as _twok_err:
    logging.getLogger(__name__).warning(f"two_keys_admin disabled: {_twok_err}")
try:
    from .routers import code_changes_admin as _code_admin
    app.include_router(_code_admin.router)
except Exception as _code_err:
    logging.getLogger(__name__).warning(f"code_changes_admin disabled: {_code_err}")
try:
    from .routers import processor_admin as _processor_admin
    app.include_router(_processor_admin.router)
except Exception as _p30_err:
    logging.getLogger(__name__).warning(f"processor_admin disabled: {_p30_err}")
app.include_router(admin_settings_router.router)
if resilience_admin_router is not None:
    try:
        app.include_router(resilience_admin_router.router)
    except Exception as _res_inc_err:
        logging.getLogger(__name__).warning(f"resilience_admin include failed: {_res_inc_err}")
try:
    from .routers import time_admin as _time_admin
    app.include_router(_time_admin.router)
except Exception as _tm_err:
    logging.getLogger(__name__).warning(f"time_admin disabled: {_tm_err}")
try:
    from .routers import reminders_audit as _rem_audit
    app.include_router(_rem_audit.router)
except Exception as _ra_err:
    logging.getLogger(__name__).warning(f"reminders_audit disabled: {_ra_err}")
app.include_router(daily_admin_router.router)
try:
    # Fallback: если флаг не сработал, попытаться подключить календарный фасад отдельно
    if not globals().get("_CALENDAR_FACADE_INCLUDED", False):  # type: ignore
        from .routers import calendar_facade as _calendar_facade2  # type: ignore
        app.include_router(_calendar_facade2.router)
        logging.getLogger(__name__).info("calendar_facade included via fallback")
except Exception as _cal_err:
    logging.getLogger(__name__).warning(f"calendar_facade fallback disabled: {_cal_err}")

# SPA fallback for Soul Logs page
@app.get("/soul/logs", include_in_schema=False)
async def spa_soul_logs():
    """Отдаёт собранный frontend index.html для маршрута /soul/logs."""
    try:
        path = "/opt/soulpulse/app/Telegram_Bot/frontend/dist/index.html"
        import os as __os_path
        if __os_path.path.isfile(path):
            return FileResponse(path)
    except Exception:
        pass
    return JSONResponse(status_code=404, content={"detail": "Frontend index not found"})

# Web session middleware: восстанавливает пользователя по HttpOnly cookie sp_web
@app.middleware("http")
async def web_session_restore_middleware(request: Request, call_next):
    try:
        # Только для веб‑браузера (исключаем MiniApp webhook/WS/health/static)
        path = request.url.path
        if path.startswith("/api/") or path.startswith("/ws/") or path.startswith("/webhook/"):
            return await call_next(request)
        cookies = request.cookies or {}
        token = cookies.get("sp_web") or cookies.get("sp_token")
        if token:
            payload = decode_jwt(token) or {}
            tg_id = payload.get("tg_id") or payload.get("sub")
            if tg_id and isinstance(tg_id, (str, int)):
                # Проставим заголовок X‑Telegram‑User‑ID для нижележащих зависимостей/роутов
                try:
                    request.headers.__dict__["_list"].append((b"x-telegram-user-id", str(tg_id).encode()))  # type: ignore
                except Exception:
                    pass
        return await call_next(request)
    except Exception:
        return await call_next(request)

# Добавляем middleware для заголовков безопасности
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Заголовки безопасности
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    # Allow mic/camera for same-origin to enable realtime voice
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(self), camera=(self), autoplay=(self)"
    
    return response
app.include_router(llm_settings.router)
app.include_router(rbac_admin.router)
from .routers import soul_admin as _soul_admin_router
app.include_router(_soul_admin_router.router)
from .routers import soul_graph_admin as _soul_graph_admin_router
app.include_router(_soul_graph_admin_router.router)
try:
    from .routers import voice_admin as _voice_admin_router
    app.include_router(_voice_admin_router.router)
except Exception as _va_err:
    logging.getLogger(__name__).warning(f"voice_admin disabled: {_va_err}")


# Aux LLM proxy (server-side, prefers llm.aux.url from DB, fallback lima.base_url)
@app.get("/api/aux-llm/health")
async def aux_llm_health():
    try:
        _t0 = time.time()
        base_url: Optional[str] = None
        timeout_ms: int = 1500
        try:
            from .services.soul_settings_service import SoulSettingsService as _SS
            async with get_db_session() as db:  # type: ignore
                svc = _SS()
                bu = await svc.get_setting("llm.aux.url", db)
                to = await svc.get_setting("lima.timeout_ms", db)
                if isinstance(bu, str) and bu:
                    base_url = bu
                if not base_url:
                    # fallback: lima.base_url
                    try:
                        bu2 = await svc.get_setting("lima.base_url", db)
                        if isinstance(bu2, str) and bu2:
                            base_url = bu2
                    except Exception:
                        pass
                try:
                    timeout_ms = int(to) if to is not None else timeout_ms
                except Exception:
                    timeout_ms = timeout_ms
        except Exception:
            pass
        if not base_url:
            raise HTTPException(status_code=404, detail="llm.aux.url not configured")
        url = base_url.rstrip("/") + "/health"
        timeout = aiohttp.ClientTimeout(total=max(0.5, timeout_ms / 1000.0))
        async with aiohttp.ClientSession(timeout=timeout) as sess:
            async with sess.get(url) as resp:
                txt = await resp.text()
                # metrics: llm_aux request/latency
                try:
                    from .lib.observability import metrics as _m  # type: ignore
                    _m.incr("llm_aux_req_total", {"route": "health"})
                    _m.observe("llm_aux_latency_ms", (time.time() - _t0) * 1000.0, {"route": "health"})
                    if int(resp.status) >= 400:
                        _m.incr("llm_aux_err_total", {"route": "health", "status": int(resp.status)})
                except Exception:
                    pass
                return {"status": resp.status, "body": txt[:1024]}
    except HTTPException:
        raise
    except Exception as e:
        try:
            from .lib.observability import metrics as _m  # type: ignore
            _m.incr("llm_aux_err_total", {"route": "health", "exc": type(e).__name__})
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/aux-llm/completion")
async def aux_llm_completion(request: Request):
    try:
        _t0 = time.time()
        body = await request.body()
        if not body:
            raise HTTPException(status_code=400, detail="empty body")
        base_url: Optional[str] = None
        timeout_ms: int = 5000
        try:
            from .services.soul_settings_service import SoulSettingsService as _SS
            async with get_db_session() as db:  # type: ignore
                svc = _SS()
                # Приоритет: bot.phi.api_url → llm.phi.url → llm.aux.url → lima.base_url
                bu = await svc.get_setting("bot.phi.api_url", db)
                if not (isinstance(bu, str) and bu):
                    bu = await svc.get_setting("llm.phi.url", db)
                if not (isinstance(bu, str) and bu):
                    bu = await svc.get_setting("llm.aux.url", db)
                to = await svc.get_setting("lima.timeout_ms", db)
                if isinstance(bu, str) and bu:
                    base_url = bu
                if not base_url:
                    try:
                        bu2 = await svc.get_setting("lima.base_url", db)
                        if isinstance(bu2, str) and bu2:
                            base_url = bu2
                    except Exception:
                        pass
                try:
                    timeout_ms = int(to) if to is not None else timeout_ms
                except Exception:
                    timeout_ms = timeout_ms
        except Exception:
            pass
        # Доп. fallback: ENV переменная llm_aux_api_url из конфигурации
        if not base_url:
            try:
                from .config import get_settings as _gs  # type: ignore
                _cfg = _gs()
                env_aux = getattr(_cfg, "llm_aux_api_url", None)
                if isinstance(env_aux, str) and env_aux.strip():
                    base_url = env_aux.strip()
            except Exception:
                pass
        if not base_url:
            raise HTTPException(status_code=404, detail="llm.aux.url not configured")
        # Phi/Aux сервер: если base_url уже указывает на конкретный endpoint, используем его как есть
        base_clean = base_url.rstrip("/")
        lower = base_clean.lower()
        if lower.endswith("/completion") or lower.endswith("/v1/completions") or lower.endswith("/v1/chat/completions"):
            targets = [base_clean]
        else:
            # иначе пробуем совместимые пути в порядке предпочтения
            targets = [
                f"{base_clean}/v1/completions",
                f"{base_clean}/completion",
                f"{base_clean}/v1/chat/completions",
            ]
        timeout = aiohttp.ClientTimeout(total=max(1.0, timeout_ms / 1000.0))
        headers = {"Content-Type": request.headers.get("content-type", "application/json")}
        # Гарантируем корректный JSON при проксировании: пробуем распарсить и отправить как JSON,
        # при неудаче — отправляем как бинарные данные (совместимость)
        json_payload = None
        try:
            json_payload = json.loads(body.decode("utf-8"))
        except Exception:
            json_payload = None
        async with aiohttp.ClientSession(timeout=timeout) as sess:
            last_err_txt = None
            for target in targets:
                try:
                    if json_payload is not None:
                        # Ничего не преобразуем: проксируем как есть
                        async with sess.post(target, json=json_payload, headers={"Content-Type": "application/json"}) as resp:
                            txt = await resp.text()
                            try:
                                from .lib.observability import metrics as _m  # type: ignore
                                _m.incr("llm_aux_req_total", {"route": "completion"})
                                _m.observe("llm_aux_latency_ms", (time.time() - _t0) * 1000.0, {"route": "completion"})
                                if int(resp.status) >= 400:
                                    _m.incr("llm_aux_err_total", {"route": "completion", "status": int(resp.status)})
                            except Exception:
                                pass
                            return JSONResponse(content={"status": resp.status, "body": txt[:8000]})
                    async with sess.post(target, data=body, headers=headers) as resp:
                        txt = await resp.text()
                        try:
                            from .lib.observability import metrics as _m  # type: ignore
                            _m.incr("llm_aux_req_total", {"route": "completion"})
                            _m.observe("llm_aux_latency_ms", (time.time() - _t0) * 1000.0, {"route": "completion"})
                            if int(resp.status) >= 400:
                                _m.incr("llm_aux_err_total", {"route": "completion", "status": int(resp.status)})
                        except Exception:
                            pass
                        return JSONResponse(content={"status": resp.status, "body": txt[:8000]})
                except Exception as _e_try:
                    last_err_txt = str(_e_try)
                    continue
            raise HTTPException(status_code=502, detail=f"aux completion failed: {last_err_txt}")
    except HTTPException:
        raise
    except Exception as e:
        try:
            from .lib.observability import metrics as _m  # type: ignore
            _m.incr("llm_aux_err_total", {"route": "completion", "exc": type(e).__name__})
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))


# --- Minimal web-auth endpoints (compat) ---
try:
    from .dependencies import verify_telegram_auth as _verify_telegram_auth
    from .auth import generate_time_based_otp as _gen_otp, create_jwt as _create_jwt
    from .models import User as _UserModel
    from sqlalchemy import select as _sa_select
    @app.post("/api/web-auth/issue-one-time-token")
    async def _issue_web_token(tg_id: int = Depends(_verify_telegram_auth), db: AsyncSession = Depends(get_db_session)):
        result = await db.execute(_sa_select(_UserModel).where(_UserModel.tg_id == tg_id))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        otp = _gen_otp(tg_id, 300)
        return {"status": "success", "otp": otp, "tg_id": tg_id, "expires_in": 300}

    @app.post("/api/web-auth/verify-otp")
    async def _verify_web_otp(request: dict, db: AsyncSession = Depends(get_db_session)):
        tg_id = request.get("tg_id")
        otp = request.get("otp")
        if not tg_id or not otp:
            raise HTTPException(status_code=400, detail="tg_id and otp are required")
        expected = _gen_otp(tg_id, 300)
        if otp != expected:
            raise HTTPException(status_code=401, detail="Invalid or expired OTP")
        result = await db.execute(_sa_select(_UserModel).where(_UserModel.tg_id == tg_id))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        token = _create_jwt({"user_id": user.id, "web": True})
        return {"status": "success", "token": token, "tg_id": tg_id, "user": {"id": user.tg_id, "first_name": user.first_name, "last_name": user.last_name, "username": user.username}}
except Exception as _webauth_err:
    logging.getLogger(__name__).warning(f"compat web-auth endpoints disabled: {_webauth_err}")


@app.on_event("startup")
async def startup_event():
    """Запуск приложения"""
    logger.info("Starting SoulPulse Mini App API")
    # Запуск Оркестратора: теперь автозапуск по умолчанию c возможностью опт-аута через DISABLE_BOT_ORCHESTRATOR
    try:
        import os as __os_orch
        if __os_orch.getenv("DISABLE_BOT_ORCHESTRATOR", "0").strip() not in ("1", "true", "True"):
            from .orchestrator import orchestrator as _orch
            await _orch.start()
            logger.info("Bot Orchestrator started (auto)")
        else:
            logger.info("Bot Orchestrator disabled by DISABLE_BOT_ORCHESTRATOR")
    except Exception as _orch_err:
        logger.warning(f"Bot Orchestrator start failed: {_orch_err}")
    # Запуск PG LISTEN/NOTIFY (лог-режим, безопасно по умолчанию выключен)
    try:
        if _ENABLE_PG_LISTENER and settings.database_url:
            app.state.pg_listener = PgNotifyListener(settings.database_url, channel="soul_events")  # type: ignore[attr-defined]
            await app.state.pg_listener.start()  # type: ignore[attr-defined]
            logger.info("PG listener started")
    except Exception as _pl_err:
        logger.warning(f"PG listener start error: {_pl_err}")
    # Запускаем фоновую задачу напоминаний
    import os as __os
    if __os.getenv("DISABLE_BACKGROUND_TASKS", "0").strip() not in ("1", "true", "True"):
        await start_reminder_task()
        logger.info("Reminder background task started")
        await start_promo_task()
        logger.info("Promo monitor background task started")
        try:
            if __os.getenv("ENABLE_CALENDAR_SYNC", "0").strip() in ("1","true","True"):
                await start_calendar_sync_task()
                logger.info("Calendar sync background task started")
        except Exception as e:
            logger.warning(f"Calendar sync start error: {e}")
        # Dispatcher loop (v7) — остаётся
        try:
            app.state.dispatcher = DispatcherScheduler(interval_seconds=10)
            await app.state.dispatcher.start()
            logger.info("Dispatcher loop started")
        except Exception as e:
            logger.warning(f"Dispatcher start error: {e}")
        # ProcessorScheduler (P30) — оставляем
        try:
            app.state.processor = ProcessorScheduler()  # type: ignore[attr-defined]
            await app.state.processor.start()  # type: ignore[attr-defined]
            logger.info("P30 ProcessorScheduler started")
        except Exception as e:
            logger.warning(f"ProcessorScheduler start error: {e}")
        # Mother of Flags (P28): periodic_health — оставляем
        try:
            import asyncio as __aio
            from .db import async_session_maker as __sm
            app.state.flags_supervisor_task = __aio.create_task(  # type: ignore[attr-defined]
                FeatureFlagsSupervisor().periodic_health(__sm),  # type: ignore[arg-type]
                name="MotherOfFlags",
            )
            logger.info("FeatureFlagsSupervisor periodic_health started")
        except Exception as e:
            logger.warning(f"FeatureFlagsSupervisor start error: {e}")
        # RS Nightly reports task
        try:
            from .background_tasks import start_nightly_task  # type: ignore
            await start_nightly_task()
            logger.info("RS Nightly background task started")
        except Exception as e:
            logger.warning(f"RS Nightly start error: {e}")
        # Gendarme scheduler (P29)
        try:
            app.state.gendarme = GendarmeService()
            # use a short-lived session to pass into start
            from .db import async_session_maker as __sm
            async with __sm() as __db:
                await app.state.gendarme.start(__db)  # type: ignore[attr-defined]
            logger.info("Gendarme scheduler started")
        except Exception as e:
            logger.warning(f"Gendarme start error: {e}")
        # Background monitors (triplicated agents)
        try:
            import asyncio as __aio3
            app.state.bg_monitors_task = __aio3.create_task(start_background_monitors(), name="BackgroundMonitors")  # type: ignore[attr-defined]
            logger.info("Background monitors started")
        except Exception as e:
            logger.warning(f"Background monitors start error: {e}")
        # Resilience guardians (triplicated)
        try:
            import asyncio as __aio4
            app.state.resilience_task = __aio4.create_task(start_resilience_guardians(), name="ResilienceGuardians")  # type: ignore[attr-defined]
            logger.info("Resilience guardians started")
        except Exception as e:
            logger.warning(f"Resilience guardians start error: {e}")
        # SleepSchedulerTask (P49) — ночной запуск сна и периодический refresh MV
        try:
            if _SLEEP_SCHED_AVAILABLE and SleepSchedulerTask is not None:
                app.state.sleep_scheduler = SleepSchedulerTask()  # type: ignore[attr-defined]
                await app.state.sleep_scheduler.start()  # type: ignore[attr-defined]
                logger.info("SleepSchedulerTask started")
        except Exception as e:
            logger.warning(f"SleepSchedulerTask start error: {e}")
        # Signature retention cleanup task
        try:
            await start_signature_retention_task()
        except Exception as e:
            logger.warning(f"SignatureRetentionTask start error: {e}")
    # Seed RBAC defaults
    try:
        import os as __os2
        if (
            __os2.getenv("DISABLE_BACKGROUND_TASKS", "0").strip() not in ("1", "true", "True")
            and __os2.getenv("DISABLE_RBAC_SEED", "0").strip() not in ("1", "true", "True")
            and __os2.getenv("DISABLE_RBAC", "0").strip() not in ("1", "true", "True")
        ):
            from .db import async_session_maker as __async_session_maker
            async with __async_session_maker() as db:
                rbac = RBACService(db)
                await rbac.seed_defaults()
                # Назначим роли по умолчанию и дадим Роману роль Архитектора без лимитов
                try:
                    from sqlalchemy import select as _select
                    from .models import User as _User
                    # Роман — Архитектор
                    res_roman = await db.execute(_select(_User).where(_User.tg_id == 468326902))
                    roman_user = res_roman.scalar_one_or_none()
                    if roman_user:
                        await rbac.assign_role_to_user(roman_user.id, "architect")
                    # Pavel — базовая роль
                    res_pavel = await db.execute(_select(_User).where(_User.tg_id == 7945329926))
                    pavel_user = res_pavel.scalar_one_or_none()
                    if pavel_user:
                        await rbac.ensure_user_has_basic(pavel_user.id)
                except Exception as seed_exc:
                    logger.warning(f"RBAC defaults seed (role assignment) failed: {seed_exc}")
            logger.info("RBAC defaults seeded")
    except Exception as e:
        logger.error(f"RBAC seed error: {e}")


@app.on_event("shutdown") 
async def shutdown_event():
    """Остановка приложения"""
    logger.info("Shutting down SoulPulse Mini App API")
    # Останавливаем фоновые задачи
    stop_reminder_task()
    stop_promo_task()
    # Остановить PG LISTENER
    try:
        listener = getattr(app.state, "pg_listener", None)
        if listener is not None:
            await listener.stop()
            logger.info("PG listener stopped")
    except Exception as _pl_stop_err:
        logger.warning(f"PG listener stop error: {_pl_stop_err}")
    try:
        if getattr(app.state, "dispatcher", None):
            app.state.dispatcher.stop()
    except Exception as stop_exc:
        logger.warning(f"Dispatcher stop on shutdown failed: {stop_exc}")
    try:
        proc = getattr(app.state, "processor", None)
        if proc is not None:
            proc.stop()
    except Exception as stop_exc:
        logger.warning(f"ProcessorScheduler stop on shutdown failed: {stop_exc}")
    try:
        gen = getattr(app.state, "gendarme", None)
        if gen is not None:
            gen.stop()
    except Exception as stop_exc:
        logger.warning(f"Gendarme stop on shutdown failed: {stop_exc}")
    try:
        task = getattr(app.state, "bg_monitors_task", None)
        if task is not None:
            task.cancel()
    except Exception as _bm_stop_err:
        logger.warning(f"Background monitors stop error: {_bm_stop_err}")
    try:
        task2 = getattr(app.state, "resilience_task", None)
        if task2 is not None:
            task2.cancel()
    except Exception as _rg_stop_err:
        logger.warning(f"Resilience guardians stop error: {_rg_stop_err}")
    try:
        stop_signature_retention_task()
    except Exception:
        pass
    try:
        import asyncio as __aio2
        task = getattr(app.state, "flags_supervisor_task", None)
        if task is not None:
            task.cancel()
            try:
                await task
            except __aio2.CancelledError:
                pass
    except Exception as _ff_stop_err:
        logger.warning(f"FeatureFlagsSupervisor stop error: {_ff_stop_err}")


@app.get("/api/debug/routes")
async def list_routes():
    """Отладочный эндпоинт: список всех маршрутов FastAPI."""
    try:
        routes_info = []
        for r in app.router.routes:  # type: ignore[attr-defined]
            try:
                routes_info.append({
                    "path": getattr(r, 'path', None),
                    "name": getattr(r, 'name', None),
                    "methods": list(getattr(r, 'methods', []) or [])
                })
            except Exception as route_exc:
                logger.debug(f"list_routes route iteration error: {route_exc}")
        # Полезная выборка для /api/messages*
        messages_routes = [ri for ri in routes_info if isinstance(ri.get('path'), str) and ri['path'].startswith('/api/messages')]
        return {"count": len(routes_info), "messages": messages_routes, "all": routes_info[:200]}
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/health")
async def health(db: AsyncSession = Depends(get_db_session)):
    """Базовая проверка здоровья системы (без раскрытия чувствительной информации)"""
    # Быстрая и не блокирующая проверка БД: ограничим ожидание
    import asyncio
    db_status = "unhealthy"
    try:
        async def _ping_db() -> None:
            await db.execute(select(1))

        await asyncio.wait_for(_ping_db(), timeout=2.0)
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"
    
    return {
        "status": "ok",
        "version": "2.9",
        "database": db_status,
        "uptime": metrics.get_metrics()["uptime_human"]
        # Убрали: детали БД, LLM провайдеры, концепцию - информация для злоумышленников
    }


@app.api_route("/webhook/telegram", methods=["POST", "GET", "HEAD"], include_in_schema=False)
async def telegram_webhook(request: Request):
    """Telegram webhook для получения сообщений от бота (оптимизирован для скорости)"""
    try:
        # Базовый лог входа (до парсинга JSON)
        try:
            raw = await request.body()
        except Exception:
            raw = b""
        try:
            ct = request.headers.get("content-type", "")
            logger.info(f"[WEBHOOK] ← {request.method} {request.url.path} len={len(raw)} ct={ct}")
        except Exception:
            pass

        # Мягкая обработка GET/HEAD (проверки доступности от Telegram)
        if request.method in ("GET", "HEAD"):
            return {"status": "ok"}

        # Безопасный парсинг JSON из сырого тела
        body = {}
        if raw:
            try:
                body = json.loads(raw.decode("utf-8"))
            except Exception as _e_json:
                logger.warning(f"[WEBHOOK] JSON parse failed: {_e_json}")
                return {"status": "ok"}

        # Быстрая проверка формата: допускаем message ИЛИ callback_query
        if not isinstance(body, dict) or (("message" not in body) and ("callback_query" not in body)):
            logger.info("[WEBHOOK] Non-message/callback update or invalid payload — ack ok")
            return {"status": "ok"}

        # Запускаем обработку в фоне, чтобы мгновенно ответить Telegram и избежать таймаутов
        try:
            upd_id = body.get("update_id")
            logger.info(f"[WEBHOOK] update received: update_id={upd_id} keys={list(body.keys())}")
        except Exception:
            pass
        import asyncio
        asyncio.create_task(telegram.process_telegram_update(body))

        # Немедленно возвращаем OK, не дожидаясь завершения обработки
        return {"status": "ok"}

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        try:
            from .lib.observability.metrics import incr  # type: ignore
            incr("webhook_telegram_5xx", None)
        except Exception:
            pass
        try:
            record_webhook_5xx_event()
        except Exception:
            pass
        return {"status": "ok"}  # Всегда возвращаем OK для Telegram

@app.get("/api/metrics")
async def get_metrics():
    """Получить метрики мониторинга (без 5xx)."""
    try:
        data = metrics.get_metrics()
        # P50: инцидент-метрики (JSON)
        try:
            from sqlalchemy import text as _t
            async with get_db_session() as db:  # type: ignore
                import time as _tsec
                now = _tsec.time()
                cached = None
                try:
                    if (now - float(_INC_JSON_CACHE.get("ts", 0.0))) <= 20.0:
                        cached = _INC_JSON_CACHE.get("data")
                except Exception:
                    cached = None
                if isinstance(cached, dict) and cached:
                    data.update(cached)
                else:
                    # Установим локальный таймаут БД ≤500ms
                    try:
                        await db.execute(_t("set local statement_timeout = 500"))
                    except Exception:
                        pass
                    # Базовые агрегаты
                    row_inc = (await db.execute(_t(
                        """
                        select
                          (select count(*) from incidents) as total,
                          (select count(*) from incidents where status='open') as open_total,
                          (select coalesce(avg(extract(epoch from (acknowledged_at - detected_at))*1000),0) from incidents where acknowledged_at is not null) as mtta_ms,
                          (select coalesce(avg(extract(epoch from (closed_at - detected_at))*1000),0) from incidents where closed_at is not null) as mttr_ms
                        """
                    ))).first()
                    if row_inc:
                        data["incidents_created_total"] = int(row_inc[0] or 0)
                        data["incidents_open_total"] = int(row_inc[1] or 0)
                        data["incident_mtta_ms"] = float(row_inc[2] or 0.0)
                        data["incident_mttr_ms"] = float(row_inc[3] or 0.0)
                    # Разрез по severity
                    rows_sev = (await db.execute(_t(
                        """
                        select severity, count(*) as cnt
                          from incidents
                         group by severity
                        """
                    ))).fetchall()
                    by_sev = {str(int(r[0])): int(r[1]) for r in (rows_sev or []) if r and r[0] is not None}
                    data["incidents_created_total_by_severity"] = by_sev
                    # Разрез по source
                    rows_src = (await db.execute(_t(
                        """
                        select source, count(*) as cnt
                          from incidents
                         group by source
                        """
                    ))).fetchall()
                    by_src = {str(r[0]): int(r[1]) for r in (rows_src or []) if r and r[0] is not None}
                    data["incidents_created_total_by_source"] = by_src
                    # P95 стадийные задержки (detect→ack, ack→resolve, resolve→close)
                    row_lat = (await db.execute(_t(
                        """
                        select
                          percentile_disc(0.95) within group (order by extract(epoch from (acknowledged_at - detected_at))*1000)
                            filter (where acknowledged_at is not null) as detect_to_ack_p95_ms,
                          percentile_disc(0.95) within group (order by extract(epoch from (resolved_at - acknowledged_at))*1000)
                            filter (where resolved_at is not null and acknowledged_at is not null) as ack_to_resolve_p95_ms,
                          percentile_disc(0.95) within group (order by extract(epoch from (closed_at - resolved_at))*1000)
                            filter (where closed_at is not null and resolved_at is not null) as resolve_to_close_p95_ms
                        from incidents
                        """
                    ))).first()
                    stage = {
                        "detect_to_ack_p95_ms": float(row_lat[0] or 0.0) if row_lat else 0.0,
                        "ack_to_resolve_p95_ms": float(row_lat[1] or 0.0) if row_lat else 0.0,
                        "resolve_to_close_p95_ms": float(row_lat[2] or 0.0) if row_lat else 0.0,
                    }
                    data["incident_stage_latency_ms"] = stage
                    # Сохраним кэш (≤30s)
                    _INC_JSON_CACHE["ts"] = now
                    _INC_JSON_CACHE["data"] = {
                        "incidents_created_total": data.get("incidents_created_total", 0),
                        "incidents_open_total": data.get("incidents_open_total", 0),
                        "incident_mtta_ms": data.get("incident_mtta_ms", 0.0),
                        "incident_mttr_ms": data.get("incident_mttr_ms", 0.0),
                        "incidents_created_total_by_severity": by_sev,
                        "incidents_created_total_by_source": by_src,
                        "incident_stage_latency_ms": stage,
                    }
        except Exception:
            pass
        # provenance metrics (best-effort)
        try:
            from sqlalchemy import text as _t
            async with get_db_session() as db:  # type: ignore
                # P40: PM metrics
                try:
                    row_p = (await db.execute(_t("select count(*) from projects"))).fetchone()
                    data["pm_projects_total"] = int(row_p[0] if row_p and row_p[0] is not None else 0)
                except Exception:
                    data["pm_projects_total"] = 0
                try:
                    row_t = (await db.execute(_t("select count(*) from tasks where cpm_duration_days is not null"))).fetchone()
                    data["pm_tasks_with_cpm_total"] = int(row_t[0] if row_t and row_t[0] is not None else 0)
                except Exception:
                    data["pm_tasks_with_cpm_total"] = 0
                # edges_count windows
                one_h = (await db.execute(_t("select count(*) from provenance_edges where created_at >= now() - interval '1 hour'"))).fetchone()  # type: ignore
                day_1 = (await db.execute(_t("select count(*) from provenance_edges where created_at >= now() - interval '24 hours'"))).fetchone()  # type: ignore
                data["provenance_edges_count_1h"] = int(one_h[0] if one_h and one_h[0] is not None else 0)
                data["provenance_edges_count_24h"] = int(day_1[0] if day_1 and day_1[0] is not None else 0)
                # edges per quant (avg/p95 over last 24h)
                agg_rows = (await db.execute(_t(
                    """
                    with recent as (
                      select quant_id, count(*) as n
                      from provenance_edges
                      where created_at >= now() - interval '24 hours'
                      group by quant_id
                    )
                    select coalesce(avg(n),0) as avg_n,
                           percentile_disc(0.5) within group (order by n) as p50_n,
                           percentile_disc(0.95) within group (order by n) as p95_n
                    from recent
                    """
                ))).fetchone()
                if agg_rows:
                    data["provenance_edges_per_quant_avg"] = float(agg_rows[0] or 0.0)
                    data["provenance_edges_per_quant_p50"] = float(agg_rows[1] or 0.0)
                    data["provenance_edges_per_quant_p95"] = float(agg_rows[2] or 0.0)
                # ms_overhead from Timer histogram
                try:
                    from .lib.observability.metrics import get_percentile  # type: ignore
                    data["provenance_ms_overhead_p95"] = get_percentile("provenance_insert_ms", None, 95.0)
                except Exception:
                    pass
        except Exception:
            pass
        # Inject processor gauges best-effort
        try:
            from sqlalchemy import text as _t
            async with get_db_session() as db:  # type: ignore
                qrow = (await db.execute(_t("select count(*) from processor_events where status in ('pending','scheduled')"))).fetchone()  # type: ignore
                data["processor_queue_len"] = int(qrow[0] if qrow and qrow[0] is not None else 0)
                since = datetime.utcnow() - timedelta(minutes=10)
                cnt = (await db.execute(_t("select count(*) from processor_incidents where created_at >= :ts"), {"ts": since})).fetchone()  # type: ignore
                n = int(cnt[0] if cnt and cnt[0] is not None else 0)
                data["processor_incidents_rate_per_min"] = n / 10.0
            # Aux LLM gauges (best-effort)
            try:
                data["llm_aux_latency_ms_p95"] = _m_get_percentile("llm_aux_latency_ms", {"route": "completion"}, 95.0) or 0.0
            except Exception:
                try:
                    data["llm_aux_latency_ms_p95"] = _m_get_percentile("llm_aux_latency_ms", None, 95.0) or 0.0
                except Exception:
                    data["llm_aux_latency_ms_p95"] = 0.0
            try:
                data["llm_aux_req_total"] = _m_get_counter_total("llm_aux_req_total")
                data["llm_aux_err_total"] = _m_get_counter_total("llm_aux_err_total")
            except Exception:
                pass
                # p95 latency/guard/coverage (P21)
                try:
                    from .lib.observability.metrics import get_percentile, get_percentile_by_tag  # type: ignore
                    p95_latencies = {
                        "perceive_ms": get_percentile_by_tag("processor.stage_ms", "stage", "perceive", 95.0),
                        "decide_ms": get_percentile_by_tag("processor.stage_ms", "stage", "decide", 95.0),
                        "act_ms": get_percentile_by_tag("processor.stage_ms", "stage", "act", 95.0),
                        "observe_ms": get_percentile_by_tag("processor.stage_ms", "stage", "observe", 95.0),
                    }
                    e2e_p95 = get_percentile("processor.time_send_to_recv_ms", None, 95.0)
                    guard_pass_p95 = get_percentile("processor.guard_chain_pass_rate", None, 95.0)
                    coverage_p95 = get_percentile("processor.coverage_signature_percent", None, 95.0)
                    # P21: latency AttributeEnrichment
                    attr_enrich_p95 = get_percentile("attribute_enrich_ms", None, 95.0)
                    data["processor_p95"] = { **p95_latencies, "e2e_ms": e2e_p95, "guard_pass": guard_pass_p95, "coverage": coverage_p95 }
                    data["p95_attribute_enrich_ms"] = attr_enrich_p95
                except Exception:
                    pass

                # P27/P30 additional: processor_runs per hour and feedback_score histogram (24h)
                try:
                    runs1h = (await db.execute(_t("""
                        select count(*)
                        from processor_runs
                        where status = 'processed'
                          and finished_at >= now() - interval '1 hour'
                    """))).fetchone()
                    data["processor_runs_last_hour"] = int(runs1h[0] if runs1h and runs1h[0] is not None else 0)

                    rows = (await db.execute(_t("""
                        select (metrics->>'feedback_score')::float as fs
                        from processor_runs
                        where status = 'processed'
                          and finished_at >= now() - interval '24 hours'
                          and metrics ? 'feedback_score'
                    """))).all()
                    buckets = {"0.2": 0, "0.4": 0, "0.6": 0, "0.8": 0, "1.0": 0}
                    fs_sum = 0.0
                    fs_count = 0
                    for (fs,) in rows:
                        if fs is None:
                            continue
                        try:
                            val = float(fs)
                        except Exception:
                            continue
                        fs_sum += val
                        fs_count += 1
                        if val <= 0.2:
                            buckets["0.2"] += 1
                        elif val <= 0.4:
                            buckets["0.4"] += 1
                        elif val <= 0.6:
                            buckets["0.6"] += 1
                        elif val <= 0.8:
                            buckets["0.8"] += 1
                        else:
                            buckets["1.0"] += 1
                    data["processor_feedback_score_histogram"] = {
                        "buckets": buckets,
                        "sum": fs_sum,
                        "count": fs_count,
                    }
                except Exception:
                    pass
        except Exception:
            pass
        # P38/P21: expose training/CPM numeric gauges into JSON
        try:
            from .lib.observability.metrics import get_counter_total, get_percentile_all_tags  # type: ignore
            data["train_runs_total"] = int(get_counter_total("train_runs_total"))
            # simple gauges from histograms (p50/p95) for quick glance
            p50_train = get_percentile_all_tags("train_latency_ms", 50.0) or 0.0
            p95_train = get_percentile_all_tags("train_latency_ms", 95.0) or 0.0
            data["train_latency_ms_p50"] = p50_train
            data["train_latency_ms_p95"] = p95_train
            p50_cpm = get_percentile_all_tags("pm_cpm_calc_ms", 50.0) or 0.0
            p95_cpm = get_percentile_all_tags("pm_cpm_calc_ms", 95.0) or 0.0
            data["pm_cpm_calc_ms_p50"] = p50_cpm
            data["pm_cpm_calc_ms_p95"] = p95_cpm
            # P49 voice & sensory p95
            try:
                from .lib.observability.metrics import get_percentile  # type: ignore
                data["voice_asr_latency_ms_p95"] = get_percentile("voice_asr_latency_ms", None, 95.0) or 0.0
                data["voice_tts_latency_ms_p95"] = get_percentile("voice_tts_latency_ms", None, 95.0) or 0.0
                data["sensory_segment_latency_ms_p95"] = get_percentile("sensory_segment_latency_ms", None, 95.0) or 0.0
                data["sensory_emotion_latency_ms_p95"] = get_percentile("sensory_emotion_latency_ms", None, 95.0) or 0.0
                data["sensory_retrieve_latency_ms_p95"] = get_percentile("sensory_retrieve_latency_ms", None, 95.0) or 0.0
            except Exception:
                pass
        except Exception:
            pass
        # Calendar aggregates
        try:
            from .lib.observability.metrics import get_counter_total as _get_cnt, get_percentile_all_tags as _p
            data["calendar_read_total"] = int(_get_cnt("calendar_read_total"))
            data["calendar_create_total"] = int(_get_cnt("calendar_create_total"))
            data["calendar_update_total"] = int(_get_cnt("calendar_update_total"))
            data["calendar_delete_total"] = int(_get_cnt("calendar_delete_total"))
            data["calendar_latency_ms_p50"] = _p("calendar_latency_ms", 50.0) or 0.0
            data["calendar_latency_ms_p95"] = _p("calendar_latency_ms", 95.0) or 0.0
        except Exception:
            pass
        # Backman metrics (best-effort; dynamic import)
        try:
            from .services.backman_actor import BackmanActor  # type: ignore
            try:
                bm = BackmanActor().metrics_summary()
                if isinstance(bm, dict):
                    data.update(bm)
            except Exception:
                pass
        except Exception:
            pass
        # Locks/Queue gauges (code-admin)
        try:
            from sqlalchemy import text as _t  # type: ignore
            async with get_db_session() as db:  # type: ignore
                try:
                    row_l = (await db.execute(_t("select count(*) from code_change_locks where (expires_at is null or expires_at>now())"))).fetchone()
                    data["code_change_locks_active"] = int(row_l[0] if row_l and row_l[0] is not None else 0)
                except Exception:
                    data["code_change_locks_active"] = 0
                try:
                    row_q = (await db.execute(_t("select count(*) from code_change_queue where status in ('queued','in_progress')"))).fetchone()
                    data["code_change_queue_len"] = int(row_q[0] if row_q and row_q[0] is not None else 0)
                except Exception:
                    data["code_change_queue_len"] = 0
        except Exception:
            pass
        return data
    except Exception as e:
        logger.warning(f"metrics endpoint error: {e}")
        return {
            "uptime_seconds": 0,
            "uptime_human": "n/a",
            "total_requests": 0,
            "total_errors": 0,
            "error_rate": 0.0,
        }


@app.get("/api/bot/orchestrator/health")
async def bot_orchestrator_health():
    """Состояние Бот‑Оркестратора: очереди/ретраи/ошибки."""
    try:
        from .orchestrator import orchestrator as _orch
        snap = _orch.health_snapshot()
        # Дополнительно: проверить webhookInfo и polling‑детектор (best‑effort)
        extra = {}
        try:
            import os as __os
            token = __os.getenv("TELEGRAM_BOT_TOKEN", "")
            if not token:
                try:
                    from .config import get_settings as __gs
                    token = (__gs().all_bot_tokens or [""])[0] or ""
                except Exception:
                    token = ""
            if token:
                # Читаем базовый URL Telegram API без хардкода (ENV → DB)
                api_base = ""
                try:
                    from .config import get_settings as __gs
                    api_base = (getattr(__gs(), "telegram_api_base", "") or "").strip().rstrip("/")
                except Exception:
                    api_base = ""
                if not api_base:
                    try:
                        from .db import async_session_maker as __sm  # type: ignore
                        from .services.soul_settings_service import SoulSettingsService as __SSS  # type: ignore
                        async with __sm() as __db:
                            v = await __SSS().get_setting("telegram.api_base", __db, None)  # type: ignore[arg-type]
                            api_base = (str(v or "").strip()).rstrip("/")
                    except Exception:
                        api_base = ""
                if api_base:
                    import requests as __rq
                    r = __rq.get(f"{api_base}/bot{token}/getWebhookInfo", timeout=5)
                    extra["webhook_info_ok"] = (r.status_code == 200)
        except Exception:
            pass
        # enrich with periodic external checks if available
        try:
            ext = getattr(_orch, "_ext_health", None)
            if isinstance(ext, dict):
                extra["external"] = ext
        except Exception:
            pass
        return {"status": "ok", "orchestrator": snap, **extra}
    except Exception as e:
        return {"status": "error", "error": str(e)}


from fastapi import Depends  # ensure Depends available
from .models import User  # type: ignore
from .middleware.rbac_middleware import require_permission  # type: ignore


@app.get("/api/bot/orchestrator/queues")
async def bot_orchestrator_queues():
    """Обзор шардов оркестратора: paused/drop_on_pause/размеры очередей."""
    try:
        from .orchestrator import orchestrator as _orch
        overview = _orch.queues_overview()
        return {"status": "ok", "queues": overview}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/api/bot/orchestrator/pause")
async def bot_orchestrator_pause(queue: str):
    """Поставить указанный `queue` на паузу."""
    try:
        from .orchestrator import orchestrator as _orch
        _orch.pause(queue)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/api/bot/orchestrator/resume")
async def bot_orchestrator_resume(queue: str):
    """Снять паузу с указанного `queue`."""
    try:
        from .orchestrator import orchestrator as _orch
        _orch.resume(queue)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/api/bot/orchestrator/clear")
async def bot_orchestrator_clear(queue: str):
    """Очистить очереди и action‑очередь у шарда `queue` (операционно деструктивно)."""
    try:
        from .orchestrator import orchestrator as _orch
        _orch.clear(queue)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/api/bot/orchestrator/set_drop_on_pause")
async def bot_orchestrator_set_drop_on_pause(queue: str, value: bool):
    """Установить политику `drop_on_pause` для шарда `queue`."""
    try:
        from .orchestrator import orchestrator as _orch
        _orch.set_drop_on_pause(queue, value)
        return {"status": "ok", "queue": queue, "drop_on_pause": bool(value)}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/api/bot/orchestrator/start")
async def bot_orchestrator_start(current_user: User = Depends(require_permission("soul.admin"))):
    try:
        from .orchestrator import orchestrator as _orch
        await _orch.start()
        return {"status": "started", "queue_size": _orch.health_snapshot().get("queue_size")}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/api/metrics/prometheus", response_class=PlainTextResponse)
async def get_prometheus_metrics():
    """Метрики в формате Prometheus (интегрированные)."""
    try:
        metrics_data = metrics.get_metrics()
        return format_metrics_for_prometheus(metrics_data)
    except Exception as e:
        logger.warning(f"prometheus endpoint error: {e}")
        return "# HELP soulpulse_placeholder 1 if metrics unavailable\n# TYPE soulpulse_placeholder gauge\nsoulpulse_placeholder 1\n"


@app.get("/api/diagnostics")
async def run_diagnostics(db: AsyncSession = Depends(get_db_session)):
    """Запуск полной диагностики API сервера"""
    return await get_diagnostics(db)


@app.get("/api/diagnostics/prometheus", response_class=PlainTextResponse)
async def get_prometheus_diagnostics():
    """Метрики диагностики в формате Prometheus"""
    return get_prometheus_metrics()


@app.get("/api/prompts")
async def compat_empty_prompts():
    """Совместимость для ранних инструкций: возвращает пустой список промптов без авторизации.

    Для текущей архитектуры используйте `/api/miniapp/prompts` или `/api/miniapp/prompts/dev`.
    """
    return []


@app.post("/api/auth/verify", response_model=schemas.AuthResponse)
async def compat_auth_verify(
    request: schemas.AuthVerifyRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """Совместимость с ранними инструкциями: POST /api/auth/verify.

    Основной актуальный маршрут: /api/miniapp/auth/verify
    """
    user_payload = verify_init_data(request.initData)
    if user_payload is None:
        raise HTTPException(status_code=401, detail="Invalid initData")

    tg_id = user_payload.get("id")
    first_name = user_payload.get("first_name")
    last_name = user_payload.get("last_name")
    username = user_payload.get("username")

    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(tg_id=tg_id, first_name=first_name, last_name=last_name, username=username)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_jwt({"user_id": user.id})
    return schemas.AuthResponse(token=token, user=user)  # type: ignore


@app.get("/")
async def root():
    return {
        "service": "SoulPulse Mini App API",
        "version": "2.0.0",
        "concept": "Разделение функций: Mini App для настроек, Telegram Bot для общения",
        "health": "/api/health",
        "metrics": "/api/metrics",
        "docs": "/docs"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Глобальный обработчик исключений"""
    logger.error(f"Global exception handler: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
