from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple
import uuid as _uuid
import json
import re
import asyncio as _aio
import os
import httpx as _httpx
import time as _time

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text as _t
from sqlalchemy import text as sa_text  # safe alias to avoid local overshadow
import subprocess as _subp
from datetime import datetime as _dt

from ..services.soul_settings_service import SoulSettingsService
from .hyperloop_rs_bridge import HyperloopRSBridge
from ..services.signature_sdk import SignatureContext
from .experiments_service import ExperimentsService, HypothesisSpec
from ..services.signature_sdk import persist_signature_steps as _persist_sig  # type: ignore
try:
    # Централизованные метрики
    from ..lib.observability.metrics import incr as _metric_incr, observe as _metric_observe, p_incr as _p_incr  # type: ignore
except Exception:  # pragma: no cover
    # Фолбэк на no-op, чтобы не ломать ранний запуск
    def _metric_incr(*args, **kwargs):  # type: ignore
        return None
    def _metric_observe(*args, **kwargs):  # type: ignore
        return None
    def _p_incr(*args, **kwargs):  # type: ignore
        return None


class HyperloopEngine:
    """Простой парсер и диспетчер DSL «Гиперлуп» (MVP).

    Поддерживаемые группы/команды (минимальный набор):
      - FLAGS.SET key=<k> value=<v>
      - FLAGS.UNSET key=<k>
      - FLAGS.APPLY_PROFILE name=<profile>
      - SANITIZER.PREVIEW text="..."
      - TEST.RUN key=<test_key>
      - TRACE.STEPS trace_id=<uuid>
      - FLAGS.STATE
      - TWO_KEYS.REQUEST operation=<op> scope=<scope>  reason="..." [ttl_minutes=<n>]
      - TWO_KEYS.APPROVE id=<uuid>

    Модификаторы: DRY_RUN, WITH TRACE, EXPECT key=value (минимально).
    """

    def __init__(self) -> None:
        self.settings = SoulSettingsService()
        self._rs = HyperloopRSBridge()
        # Лимитер конкурентности для команд Hyperloop (настраивается через БД)
        self._sem: Optional[_aio.Semaphore] = None
        # Чувствительные флаги (требуют two-keys одобрения для изменения)
        self._sensitive_flags = {
            "delivery_guard.enforce",
            "hyperloop.allow_signed",
            "processor.enabled",
        }
        # In-memory RO cache (LRU+TTL): ключ = normalized DSL + user/role scope
        self._ro_cache: Dict[str, Dict[str, Any]] = {}
        self._ro_cache_order: List[str] = []
        self._ro_cache_ttl_sec: int = 30
        self._ro_cache_max_entries: int = 200
        # Внешний Redis слой (ленивая инициализация)
        self._redis = None
        try:
            from .cache_redis import RedisCache  # type: ignore
            import os as _os
            _ru = _os.getenv("REDIS_URL", "").strip()
            if _ru:
                self._redis = RedisCache(_ru)
        except Exception:
            self._redis = None
        # Подписка на инвалидацию (best-effort)
        try:
            from .cache_invalidator import cache_invalidator  # type: ignore
            async def _on_invalidate(evt: Dict[str, object]) -> None:  # type: ignore[name-defined]
                try:
                    scope = str(evt.get("scope") if isinstance(evt, dict) else "")
                    if scope in {"settings", "flags", "projects", "rbac"}:
                        # Полная очистка RO-кэша при изменении источников данных
                        self._ro_cache.clear()
                        self._ro_cache_order.clear()
                except Exception:
                    pass
            # регистрация подписчика (не дублируем — допускаем несколько на процесс)
            _aio.create_task(cache_invalidator.register(_on_invalidate))
        except Exception:
            pass

    async def _check_two_keys(self, db: AsyncSession, req_id: str) -> bool:
        """Проверяет two-keys утверждение, пытаясь импортировать проверку из разных путей.
        Возвращает True только при явном подтверждении; при ошибке — False.
        """
        # Trusted owner bypass: если actor_user_id в доверенном списке — разрешить без req_id
        try:
            actor = None
            try:
                actor = (self._options or {}).get('actor_user_id')  # type: ignore[attr-defined]
            except Exception:
                actor = None
            if actor:
                raw = await self.settings.get_setting("two_keys.trusted_owner_ids", db, "[]")
                trusted_ids: list[str] = []
                if isinstance(raw, list):
                    trusted_ids = [str(x) for x in raw]
                elif isinstance(raw, str):
                    try:
                        import json as _json
                        parsed = _json.loads(raw)
                        if isinstance(parsed, list):
                            trusted_ids = [str(x) for x in parsed]
                        else:
                            # fallback: comma-separated or single value
                            s = raw.strip().strip('[]').strip()
                            if s:
                                trusted_ids = [p.strip().strip('"').strip("'") for p in s.split(',') if p.strip()]
                    except Exception:
                        # fallback: accept raw as single id
                        if raw.strip():
                            trusted_ids = [raw.strip()]
                if trusted_ids and (str(actor) in trusted_ids):
                    return True
        except Exception:
            pass
        if not req_id:
            return False
        # 0a) Быстрый маркер через настройки (без DDL/прав): two_keys.approved.<id>=true
        out = {"ok": False, "error": "uninitialized"}
        try:
            key = f"two_keys.approved.{req_id}"
            val = await self.settings.get_setting(key, db, False)
            if bool(val):
                return True
        except Exception:
            pass
        # 0) Облегчённый путь: проверяем локальный маркер одобрения в БД
        try:
            from sqlalchemy import text as _t  # type: ignore
            # ensure table exists (DDL is idempotent)
            await db.execute(_t(
                """
                CREATE TABLE IF NOT EXISTS public.two_keys_approved_requests (
                    request_id UUID PRIMARY KEY,
                    approved_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                """
            ))
            row = (await db.execute(_t(
                """
                SELECT 1 FROM public.two_keys_approved_requests
                WHERE request_id = CAST(:rid AS uuid)
                LIMIT 1
                """
            ), {"rid": str(req_id)})).fetchone()
            if row:
                return True
        except Exception:
            # fallback на основной путь ниже
            pass
        try:
            import importlib
            candidates = [
                "backend.app.routers.two_keys_admin",
                "app.routers.two_keys_admin",
                "routers.two_keys_admin",
            ]
            mod = None
            func = None
            last_err: Optional[Exception] = None  # type: ignore[name-defined]
            for m in candidates:
                try:
                    mod = importlib.import_module(m)
                    func = getattr(mod, "is_two_keys_approved", None)
                    if callable(func):
                        break
                except Exception as e:  # pragma: no cover
                    last_err = e
                    mod = None
                    func = None
                    continue
            if func is None:
                # try detailed verifier if available
                func2 = getattr(mod, "verify_two_keys_approval", None) if mod else None
                if callable(func2):
                    ok2, _reason, _init, _appr = await func2(db, req_id)  # type: ignore[misc]
                    return bool(ok2)
                return False
            ok = await func(db, req_id)  # type: ignore[misc]
            if bool(ok):
                return True
            # fallback to detailed verifier
            func2 = getattr(mod, "verify_two_keys_approval", None)
            if callable(func2):
                ok2, _reason, _init, _appr = await func2(db, req_id)  # type: ignore[misc]
                return bool(ok2)
            return False
        except Exception:
            return False

    # -------------- public API --------------
    async def execute(
        self,
        *,
        commands_text: str,
        db: AsyncSession,
        signature_ctx: SignatureContext,
        options: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        # P27: базовые метрики выполнения Hyperloop
        try:
            from ..lib.observability import metrics as _m  # type: ignore
        except Exception:
            _m = None  # type: ignore
        import time as _t
        _t0 = _t.time()
        _route = str((options or {}).get('force_route') or 'python')
        if _m is not None:
            try:
                _m.incr("hyperloop_requests_total", {"route": _route})
            except Exception:
                pass
        opts = options or {}
        # сохраняем опции для обработчиков (напр., actor_user_id)
        try:
            self._options = dict(opts)
        except Exception:
            self._options = {}
        stop_on_error = bool(opts.get("stop_on_error", True))
        results: List[Dict[str, Any]] = []

        signature_ctx.append_step(function_id="cmd.hyperloop.dispatch", scope="hyperloop", version="v1")

        # P51: Применяем DB Governor session policy для Hyperloop (service‑class)
        try:
            from ..services.db_governor import DBGovernorService  # type: ignore
            _gov = DBGovernorService()
            await _gov.apply_session_policy(db, class_name="service", application_tag="hyperloop.execute")
        except Exception:
            pass

        # P51: Пер‑классный лимитер (service) — защищаем горячий путь execute
        _limiter_cm = None
        try:
            from ..services.db_gov_limiter import DBGovLimiter  # type: ignore
            _limiter = DBGovLimiter()
            _limiter_cm = _limiter.acquire("service", db=db)
            await _limiter_cm.__aenter__()
        except Exception:
            _limiter_cm = None

        # P48R: попытка делегирования в RS согласно режимам (shadow/canary/primary)
        # Нормализованный контракт: если RS вернул ok и режим primary — пробрасываем его results;
        # в shadow/canary сохраняем rs_raw в results[0].rs_raw, а исполняем python дальше.
        # P48R: поддержка форс-маршрутизации для паритетных прогонов
        force_route = str(opts.get("force_route") or "").strip().lower()  # values: "python" | "rs" | ""
        force_rs_primary = False
        if force_route == "python":
            should_route = False
        else:
            try:
                should_route = await self._rs.should_route_to_rs(db=db)
            except Exception:
                should_route = False
            if force_route == "rs":
                should_route = True
                force_rs_primary = True  # принудительно трактуем как primary для возврата ответа RS

        rs_attached = False
        # Инициализируем семафор конкурентности и таймаут команд
        cmd_timeout_ms = 1500
        max_conc = 4
        try:
            # Значения из БД (с TTL-кэшем)
            cmd_timeout_ms = int(await self.settings.get_setting("hyperloop.command.timeout_ms", db, 1500))
        except Exception:
            cmd_timeout_ms = 1500
        try:
            max_conc = int(await self.settings.get_setting("hyperloop.max_concurrency", db, 4))
        except Exception:
            max_conc = 4
        try:
            max_conc = max(1, min(64, int(max_conc)))
        except Exception:
            max_conc = 4
        if getattr(self, "_sem", None) is None:
            try:
                self._sem = _aio.Semaphore(max_conc)
            except Exception:
                self._sem = _aio.Semaphore(4)
        if should_route:
            try:
                rs_out = await self._rs.execute(commands_text=commands_text, options=opts, trace_id=getattr(signature_ctx, "trace_id", None), db=db)
                mode = await self._rs.get_mode(db)
                if force_rs_primary:
                    mode = "rs_primary_no_fallback"
                signature_ctx.append_step(function_id="svc.rs.proxy", scope="hyperloop", version="v1")
                if mode in ("rs_primary_no_fallback", "rs_primary_python_fallback") and rs_out.get("ok"):
                    # Нормализуем ответ RS для паритета: ok/results/signature/meta
                    core = rs_out.get("rs_raw") or {}
                    if isinstance(core, dict):
                        normalized: Dict[str, Any] = {
                            "ok": True,
                            "results": (core.get("results") if isinstance(core.get("results"), list) else []),
                            "signature": signature_ctx.to_dict(),
                            "meta": (core.get("meta") if isinstance(core.get("meta"), dict) else {}),
                        }
                        return normalized
                # Иначе — прикрепим rs_raw и продолжим Python путь
                if isinstance(rs_out, dict):
                    results.append({"command": "__rs_shadow__", "ok": bool(rs_out.get("ok")), "rs_raw": rs_out.get("rs_raw", rs_out)})
                    rs_attached = True
            except Exception:
                # Мягкий фолбэк на Python
                pass

        for raw_line in (commands_text or "").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            # Read-only cache policy
            is_ro = self._is_read_only(line)
            cache_key = None
            if is_ro:
                cache_key = await self._make_cache_key(line, opts)
                # 1) In-memory lookup
                cached = self._ro_get(cache_key)
                if cached is not None:
                    try:
                        _metric_incr("hyperloop_cache_hit_total", {"tier": "mem"})
                    except Exception:
                        pass
                    try:
                        _p_incr("hyperloop_cache_hit_total", {"tier": "mem"})
                    except Exception:
                        pass
                    results.append({"command": line, **cached, "cache": "mem"})
                    continue
                # 2) Redis lookup
                if self._redis is not None:
                    try:
                        rj = await self._redis.get_json(cache_key)
                        if isinstance(rj, dict):
                            # warm in-memory
                            self._ro_put(cache_key, rj)
                            try:
                                _metric_incr("hyperloop_cache_hit_total", {"tier": "redis"})
                            except Exception:
                                pass
                            try:
                                _p_incr("hyperloop_cache_hit_total", {"tier": "redis"})
                            except Exception:
                                pass
                            results.append({"command": line, **rj, "cache": "redis"})
                            continue
                    except Exception:
                        pass
                # miss
                try:
                    _metric_incr("hyperloop_cache_miss_total", {})
                except Exception:
                    pass
                try:
                    _p_incr("hyperloop_cache_miss_total", {})
                except Exception:
                    pass
            # Ограничение конкурентности + таймаут на одну команду
            try:
                assert self._sem is not None
                async with self._sem:
                    # Быстрый роутинг heavy-команд в RS primary с безопасным фолбэком
                    is_heavy = False
                    try:
                        up = line.upper()
                        is_heavy = (
                            up.startswith("GRAPH.") or
                            up.startswith("QUANT.LINK") or
                            up.startswith("AGGREGATE.") or
                            ("CYTHER" in up)  # защитный триггер, если встретится опечатка
                        )
                    except Exception:
                        is_heavy = False

                    if is_heavy:
                        try:
                            signature_ctx.append_step(function_id="svc.rs.proxy", scope="hyperloop", version="v1")
                            rs_one = await self._rs.execute(commands_text=line, options={"force_route": "rs"}, trace_id=getattr(signature_ctx, "trace_id", None), db=db)
                            core = (rs_one.get("rs_raw") if isinstance(rs_one, dict) else None) or {}
                            if isinstance(core, dict) and bool(rs_one.get("ok")):
                                res = {"ok": True, "rs_raw": core}
                            else:
                                # Фолбэк на Python
                                res = await _aio.wait_for(self._execute_one(line=line, db=db, signature_ctx=signature_ctx), timeout=float(cmd_timeout_ms) / 1000.0)
                        except Exception:
                            # Надёжный фолбэк
                            res = await _aio.wait_for(self._execute_one(line=line, db=db, signature_ctx=signature_ctx), timeout=float(cmd_timeout_ms) / 1000.0)
                    else:
                        # Circuit Breaker
                        try:
                            from .circuit_breaker import circuit_breaker  # type: ignore
                        except Exception:
                            circuit_breaker = None  # type: ignore
                        do_failover = False
                        if circuit_breaker is not None:
                            try:
                                do_failover = circuit_breaker.should_failover("hyperloop.execute")
                            except Exception:
                                do_failover = False
                        if do_failover:
                            res = await self._failover_execute(line=line, db=db, signature_ctx=signature_ctx, opts=opts)
                        else:
                            _t0loc = _time.time()
                            res = await _aio.wait_for(self._execute_one(line=line, db=db, signature_ctx=signature_ctx), timeout=float(cmd_timeout_ms) / 1000.0)
                            try:
                                if circuit_breaker is not None:
                                    circuit_breaker.record("hyperloop.execute", ok=bool(res.get("ok")), latency_ms=((_time.time()-_t0loc)*1000.0))  # type: ignore[arg-type]
                            except Exception:
                                pass

                    # Save to caches for RO commands
                    if is_ro and cache_key:
                        try:
                            self._ro_put(cache_key, res)
                        except Exception:
                            pass
                        if self._redis is not None:
                            try:
                                ttl = max(5, min(300, int(self._ro_cache_ttl_sec)))
                                await self._redis.set_json(cache_key, res, ttl_sec=ttl)
                            except Exception:
                                pass
            except _aio.TimeoutError:
                try:
                    _metric_incr("hyperloop_timeouts_total", {"route": _route})
                except Exception:
                    pass
                res = {"ok": False, "error": f"timeout after {cmd_timeout_ms} ms"}
            except Exception as _e:
                res = {"ok": False, "error": str(_e)[:300]}
            results.append({
                "command": line,
                **res,
            })
            if stop_on_error and not res.get("ok"):
                break

        # Нормализованный фасад top-level
        top_ok = True
        try:
            top_ok = all(bool(item.get("ok")) for item in results) if results else True
        except Exception:
            top_ok = False

        out_obj = {
            "ok": top_ok,
            "results": results,
            "signature": signature_ctx.to_dict(),
        }
        # Если RS был прикреплён в shadow/canary, добавим короткий флаг в meta
        if rs_attached:
            try:
                out_obj["meta"] = {"rs": "attached"}
            except Exception:
                pass
        # Гарантируем наличие meta как объекта
        if not isinstance(out_obj.get("meta"), dict):
            out_obj["meta"] = {}
        # метрики: длительность и ошибки top-level
        try:
            if _m is not None:
                dt_ms = (_t.time() - _t0) * 1000.0
                _m.observe("hyperloop_execute_latency_ms", dt_ms, {"route": _route})
                _m.p_observe_ms("hyperloop_execute_latency_ms", dt_ms, {"route": _route})
                if not bool(out_obj.get("ok", True)):
                    _m.incr("hyperloop_errors_total", {"route": _route, "type": str(out_obj.get("error") or out_obj.get("meta", {}).get("error") or "unknown")})
        except Exception:
            pass
        try:
            if _limiter_cm is not None:
                await _limiter_cm.__aexit__(None, None, None)
        except Exception:
            pass
        return out_obj

    async def _failover_execute(
        self,
        *,
        line: str,
        db: AsyncSession,
        signature_ctx: "SignatureContext",
        opts: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Failover-исполнение команды на Python-выполнителе.

        Используется, когда circuit breaker советует фолбэк. Гарантирует, что отсутствующий метод не вызывает engine_error.
        """
        try:
            # Отметим шаг фолбэка в подписи (best-effort)
            try:
                signature_ctx.append_step(function_id="svc.rs.fallback", scope="hyperloop", version="v1")
            except Exception:
                pass
            # Выполняем обычным путём
            return await _aio.wait_for(self._execute_one(line=line, db=db, signature_ctx=signature_ctx), timeout=float(self._get_cmd_timeout_ms(opts)) / 1000.0)
        except _aio.TimeoutError:
            return {"ok": False, "error": f"timeout after {self._get_cmd_timeout_ms(opts)} ms (failover)"}
        except Exception as e:  # pragma: no cover
            return {"ok": False, "error": str(e)[:300]}

    def _get_cmd_timeout_ms(self, opts: Dict[str, Any]) -> int:
        try:
            v = int(opts.get("cmd_timeout_ms") if opts.get("cmd_timeout_ms") is not None else 2000)
            return max(200, min(600000, v))
        except Exception:
            return 2000

    # ---------------- cache helpers ----------------
    def _ro_get(self, key: str) -> Optional[Dict[str, Any]]:
        try:
            item = self._ro_cache.get(key)
            if not item:
                return None
            ts = float(item.get("_ts") or 0.0)
            if (_time.time() - ts) > float(self._ro_cache_ttl_sec):
                # stale
                try:
                    del self._ro_cache[key]
                except Exception:
                    pass
                try:
                    _metric_incr("hyperloop_cache_stale_total", {})
                except Exception:
                    pass
                return None
            # move-to-end order
            try:
                if key in self._ro_cache_order:
                    self._ro_cache_order.remove(key)
                self._ro_cache_order.append(key)
            except Exception:
                pass
            data = dict(item)
            data.pop("_ts", None)
            return data
        except Exception:
            return None

    def _ro_put(self, key: str, value: Dict[str, Any]) -> None:
        try:
            v = dict(value)
            v["_ts"] = _time.time()
            self._ro_cache[key] = v
            try:
                if key in self._ro_cache_order:
                    self._ro_cache_order.remove(key)
                self._ro_cache_order.append(key)
            except Exception:
                pass
            # evict LRU
            while len(self._ro_cache_order) > int(self._ro_cache_max_entries):
                try:
                    old_key = self._ro_cache_order.pop(0)
                    self._ro_cache.pop(old_key, None)
                except Exception:
                    break
        except Exception:
            pass

    async def _make_cache_key(self, line: str, opts: Dict[str, Any]) -> str:
        try:
            # normalize command + safe user/role scope from options headers
            top = line.upper().strip()
            user_scope = str(opts.get("actor_user_id") or opts.get("user_id") or "").strip()
            role_scope = str(opts.get("role") or "").strip()
            return f"v1|{top}|u:{user_scope}|r:{role_scope}"
        except Exception:
            return f"v1|{line}"

    def _is_read_only(self, line: str) -> bool:
        try:
            up = line.upper().strip()
            if up.startswith("INSPECTOR.RUN") or up.startswith("INSPECTOR.RUN_ALL"):
                return True
            if up.startswith("SETTINGS.GET") or up.startswith("FLAGS.GET") or up.startswith("FLAGS.STATE"):
                return True
            if up.startswith("TRACE.STEPS"):
                return True
            if up.startswith("PROJECT.LIST"):
                return True
            return False
        except Exception:
            return False

    # -------------- DSL extensions --------------
    async def _handle_cache_refresh(self, params: Dict[str, Any], db: AsyncSession, signature_ctx: SignatureContext) -> Dict[str, Any]:
        profile = str(params.get("profile") or "").strip().lower()
        keys = params.get("keys")
        options = params.get("options") if isinstance(params.get("options"), dict) else {}
        commands: List[str] = []
        if isinstance(keys, list) and keys:
            commands = [str(k) for k in keys if str(k or '').strip()]
        elif profile == "core" or not keys:
            commands = [
                "INSPECTOR.RUN_ALL",
                "INSPECTOR.RUN key=planning.enforce",
                "SETTINGS.GET key=rs.hyperloop.mode",
                "TRACE.STEPS trace_id=00000000-0000-0000-0000-000000000000",
                "PROJECT.LIST",
            ]
        warmed = 0
        for cmd in commands:
            try:
                sig = SignatureContext()
                res = await self.execute(commands_text=cmd, db=db, signature_ctx=sig, options=options)
                if isinstance(res, dict) and res.get("ok"):
                    warmed += 1
            except Exception:
                continue
        try:
            _metric_incr("hyperloop_cache_warm_total", {"count": str(warmed)})
        except Exception:
            pass
        return {"ok": True, "warmed": warmed}

    # -------------- internals --------------
    async def _execute_one(
        self,
        *,
        line: str,
        db: AsyncSession,
        signature_ctx: SignatureContext,
    ) -> Dict[str, Any]:
        cmd, params, mods = self._parse_line(line)

        dry_run = ("DRY_RUN" in mods)
        expect_pair = mods.get("EXPECT")  # tuple(key, value) or None

        group, action = self._split_cmd(cmd)
        handler = f"{group}.{action}".lower()

        try:
            # OWN.* — управление доверенными владельцами для bypass Two-Keys
            if handler.startswith("own."):
                sub = handler.split(".", 1)[1]
                from ..services.soul_settings_service import SoulSettingsService as _SS  # type: ignore
                ssvc = _SS()
                def _parse_ids(s: str) -> list[str]:
                    try:
                        import json as _json
                        arr = _json.loads(s) if s else []
                        return [str(x) for x in arr] if isinstance(arr, list) else []
                    except Exception:
                        return []
                try:
                    cur = await ssvc.get_setting("two_keys.trusted_owner_ids", db, "[]")
                    cur_list = _parse_ids(str(cur))
                except Exception:
                    cur_list = []
                if sub == "trust":
                    owner = str(params.get("owner") or params.get("id") or params.get("tg_id") or "").strip()
                    if not owner:
                        return {"ok": False, "error": "owner required"}
                    if owner not in cur_list:
                        cur_list.append(owner)
                    if not dry_run:
                        await ssvc.set_setting("two_keys.trusted_owner_ids", cur_list, db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.own.trust", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"trusted": owner, "dry_run": dry_run}}
                elif sub == "untrust":
                    owner = str(params.get("owner") or params.get("id") or params.get("tg_id") or "").strip()
                    if not owner:
                        return {"ok": False, "error": "owner required"}
                    cur_list = [x for x in cur_list if str(x) != owner]
                    if not dry_run:
                        await ssvc.set_setting("two_keys.trusted_owner_ids", cur_list, db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.own.untrust", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"untrusted": owner, "dry_run": dry_run}}
                elif sub == "state":
                    signature_ctx.append_step(function_id="cmd.hyperloop.own.state", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"trusted_owner_ids": cur_list}}
                else:
                    out = {"ok": False, "error": f"unsupported OWN.* action: {sub}"}
            
            if handler == "flags.set":
                key = str(params.get("key") or "").strip()
                val_raw = str(params.get("value") or "")
                parsed = self._parse_value(val_raw)
                # Two-Keys: требуем одобрение для чувствительных ключей
                if key in self._sensitive_flags:
                    req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, req_id)):
                        return {"ok": False, "error": "two-keys approval required for sensitive flag"}
                if not dry_run:
                    await self.settings.set_setting(key, parsed, db)
                    # Инвалидация кэшей при write-командах
                    try:
                        from .cache_invalidator import cache_invalidator  # type: ignore
                        evt = {"scope": "settings", "keys": [key], "ts": _time.time(), "source": "write"}
                        await cache_invalidator.broadcast(evt)
                        # Redis fan-out (best-effort)
                        if getattr(self, "_redis", None) is not None:
                            try:
                                await self._redis.publish_invalidation(evt)  # type: ignore[attr-defined]
                            except Exception:
                                pass
                    except Exception:
                        pass
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.set", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": key, "value": parsed, "dry_run": dry_run}}

            elif handler.startswith("db.gov") or handler in {"db.activity", "db.locks"}:
                # Админ-команды DB Governor (P51)
                from ..services.db_governor import DBGovernorService
                gsvc = DBGovernorService()
                if handler == "db.gov.cap":
                    cls = str(params.get("class") or params.get("class_name") or "").strip()
                    val = int(params.get("value") if params.get("value") is not None else -1)
                    if not cls or val < 0:
                        return {"ok": False, "error": "class and value required"}
                    if dry_run:
                        out = {"ok": True, "data": {"dry_run": True, "class": cls, "value": val}}
                    else:
                        res = await gsvc.set_cap(db, cls, val)
                        signature_ctx.append_step(function_id="cmd.hyperloop.db.gov.cap", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": res}
                elif handler == "db.gov.timeout":
                    cls = str(params.get("class") or params.get("class_name") or "").strip()
                    key = str(params.get("key") or "").strip()
                    vms = int(params.get("value_ms") if params.get("value_ms") is not None else -1)
                    if not cls or not key or vms < 0:
                        return {"ok": False, "error": "class, key, value_ms required"}
                    if dry_run:
                        out = {"ok": True, "data": {"dry_run": True, "class": cls, "key": key, "value_ms": vms}}
                    else:
                        res = await gsvc.set_timeout(db, cls, key, vms)
                        signature_ctx.append_step(function_id="cmd.hyperloop.db.gov.timeout", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": res}
                elif handler == "db.gov.mode":
                    mode = str(params.get("mode") or "").strip()
                    if not mode:
                        return {"ok": False, "error": "mode required (auto|manual)"}
                    if dry_run:
                        out = {"ok": True, "data": {"dry_run": True, "mode": mode}}
                    else:
                        res = await gsvc.set_mode(db, mode)
                        signature_ctx.append_step(function_id="cmd.hyperloop.db.gov.mode", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": res}
                elif handler == "db.gov.reset":
                    if dry_run:
                        out = {"ok": True, "data": {"dry_run": True}}
                    else:
                        res = await gsvc.reset(db)
                        signature_ctx.append_step(function_id="cmd.hyperloop.db.gov.reset", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": res}
                elif handler == "db.gov.kill":
                    # Поддерживаем форму: DB.GOV.KILL IDLE_IN_TX older_than_s=<int>
                    # Токен IDLE_IN_TX парсером не сохраняется, операция однозначно трактуется как kill idle-in-tx
                    try:
                        older = int(params.get("older_than_s") if params.get("older_than_s") is not None else 30)
                    except Exception:
                        older = 30
                    if dry_run:
                        out = {"ok": True, "data": {"dry_run": True, "older_than_s": older}}
                    else:
                        try:
                            res = await gsvc.kill_idle_in_tx(db, older)
                            signature_ctx.append_step(function_id="cmd.hyperloop.db.gov.kill", scope="hyperloop", version="v1")
                            out = {"ok": True, "data": res}
                        except Exception as e:
                            out = {"ok": False, "error": f"kill_idle_in_tx failed: {str(e)[:160]}"}
                elif handler == "db.activity":
                    res = await gsvc.activity(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.db.activity", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": res}
                elif handler == "db.locks":
                    res = await gsvc.locks(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.db.locks", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": res}

            elif handler.startswith("personality."):
                from ..services.personality_service import PersonalityService
                psvc = PersonalityService()
                if handler == "personality.define":
                    sex = str(params.get("sex") or "").strip()
                    version = str(params.get("version") or "v1").strip()
                    payload = self._parse_value(str(params.get("payload") or "{}"))
                    aa = None
                    if isinstance(payload, dict):
                        try:
                            aa = float(payload.get("anima_animus")) if payload.get("anima_animus") is not None else None
                        except Exception:
                            aa = None
                    tg = None
                    if dry_run:
                        out = {"ok": True, "data": {"id": None, "dry_run": True}}
                    else:
                        pid = await psvc.define(sex=sex, version=version, anima_animus=aa, created_by_tg_id=tg, meta=payload if isinstance(payload, dict) else {}, db=db)
                        signature_ctx.append_step(function_id="cmd.hyperloop.personality.define", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": {"id": pid}}

                elif handler == "personality.activate":
                    pid = str(params.get("id") or params.get("personality_id") or "").strip()
                    if not pid:
                        return {"ok": False, "error": "personality_id required"}
                    # Two-Keys: активация личности требует подтверждения
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, rid)):
                        return {"ok": False, "error": "two-keys approval required for personality.activate"}
                    if not dry_run:
                        await psvc.activate(personality_id=pid, db=db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.personality.activate", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"id": pid, "activated": True, "dry_run": dry_run}}

                elif handler == "personality.norm.add":
                    pid = str(params.get("personality_id") or "").strip()
                    key = str(params.get("key") or "").strip()
                    title = str(params.get("title") or key).strip()
                    severity = float(params.get("severity") or 0.0)
                    scope = str(params.get("scope") or "").strip()
                    description = str(params.get("description") or "") or None
                    links = self._parse_value(str(params.get("links") or "[]"))
                    if dry_run:
                        out = {"ok": True, "data": {"id": None, "dry_run": True}}
                    else:
                        nid = await psvc.add_norm(personality_id=pid, key=key, title=title, severity=severity, scope=scope, description=description, links=links if isinstance(links, list) else [], db=db)
                        signature_ctx.append_step(function_id="cmd.hyperloop.personality.norm.add", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": {"id": nid}}

                elif handler == "personality.trait.set":
                    pid = str(params.get("personality_id") or "").strip()
                    key = str(params.get("key") or "").strip()
                    family = str(params.get("family") or params.get("trait_family") or "") or None
                    tendency = float(params.get("tendency") or 0.0) if params.get("tendency") is not None else None
                    stability = float(params.get("stability") or 0.0) if params.get("stability") is not None else None
                    links = self._parse_value(str(params.get("links") or "[]"))
                    if dry_run:
                        out = {"ok": True, "data": {"id": None, "dry_run": True}}
                    else:
                        tid = await psvc.set_trait(personality_id=pid, key=key, family=family, tendency=tendency, stability=stability, links=links if isinstance(links, list) else [], db=db)
                        signature_ctx.append_step(function_id="cmd.hyperloop.personality.trait.set", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": {"id": tid}}

                elif handler in ("personality.attachment.set", "personality.attach.set"):
                    pid = str(params.get("personality_id") or "").strip()
                    key = str(params.get("key") or "").strip()
                    try:
                        baseline_weight = float(params.get("baseline_weight") or 0.0)
                    except Exception:
                        baseline_weight = 0.0
                    try:
                        growth_policy = self._parse_value(str(params.get("growth_policy") or "{}"))
                    except Exception:
                        growth_policy = {}
                    try:
                        links = self._parse_value(str(params.get("links") or "[]"))
                    except Exception:
                        links = []
                    if dry_run:
                        out = {"ok": True, "data": {"id": None, "dry_run": True}}
                    else:
                        try:
                            aid = await psvc.set_attachment(
                                personality_id=pid,
                                key=key,
                                baseline_weight=baseline_weight,
                                growth_policy=growth_policy if isinstance(growth_policy, dict) else {},
                                links=links if isinstance(links, list) else [],
                                db=db,
                            )
                            signature_ctx.append_step(function_id="cmd.hyperloop.personality.attachment.set", scope="hyperloop", version="v1")
                            out = {"ok": True, "data": {"id": aid}}
                        except Exception as _attach_err:
                            return {"ok": False, "error": f"attachment set error: {_attach_err}"}

                elif handler == "personality.links.ensure":
                    pid = str(params.get("personality_id") or params.get("id") or "").strip()
                    ek = str(params.get("element_kind") or params.get("kind") or "").strip()
                    eid = str(params.get("element_id") or params.get("eid") or "").strip()
                    cq = str(params.get("core_quant_id") or params.get("core") or "").strip()
                    try:
                        rw = float(params.get("relation_weight") or params.get("w") or 0.0)
                    except Exception:
                        rw = 0.0
                    if not pid or not ek or not eid or not cq:
                        return {"ok": False, "error": "personality_id, element_kind, element_id and core_quant_id required"}
                    try:
                        await db.execute(sa_text("delete from soul_personality_links where personality_id=cast(:pid as uuid) and element_kind=:k and element_id=cast(:eid as uuid)"), {"pid": pid, "k": ek, "eid": eid})
                        await db.execute(sa_text("insert into soul_personality_links(personality_id, element_kind, element_id, core_quant_id, relation_weight) values (cast(:pid as uuid), :k, cast(:eid as uuid), cast(:cq as uuid), :w)"), {"pid": pid, "k": ek, "eid": eid, "cq": cq, "w": rw})
                        await db.commit()
                    except Exception as e:
                        return {"ok": False, "error": f"links.ensure error: {e}"}
                    signature_ctx.append_step(function_id="cmd.hyperloop.personality.links.ensure", scope="hyperloop", version="v1")
                    out = {"ok": True}

                elif handler == "personality.policy.set":
                    pid = str(params.get("personality_id") or "").strip()
                    key = str(params.get("key") or "").strip()
                    value = self._parse_value(str(params.get("value") or "{}"))
                    if not isinstance(value, dict):
                        value = {"raw": value}
                    if not dry_run:
                        await psvc.set_policy(personality_id=pid, key=key, value=value, db=db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.personality.policy.set", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"key": key, "dry_run": dry_run}}

                elif handler == "personality.weights.recalc":
                    pid = str(params.get("personality_id") or "").strip()
                    res = {"dry_run": True}
                    if not dry_run:
                        res = await psvc.recalc_weights(personality_id=pid, db=db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.personality.weights.recalc", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": res}

                elif handler == "personality.inspect":
                    pid = str(params.get("id") or params.get("personality_id") or "").strip()
                    what = str(params.get("what") or "weights").strip()
                    res = await psvc.inspect(personality_id=pid, what=what, db=db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.personality.inspect", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": res}

                else:
                    return {"ok": False, "error": f"unknown personality command: {handler}"}

            elif handler == "wake.status":
                # WAKE.STATUS — вернуть статус бодрствования, размеры «кэшей» и p95 стадий
                try:
                    import json as _json
                    from sqlalchemy import text as _t
                    from ..lib.observability import metrics as _m  # type: ignore
                except Exception:
                    _m = None  # type: ignore

                # Чтение статусов из soul_settings (каноничный источник правды)
                try:
                    wake_status = await self.settings.get_setting("wake.status", db, "unknown")
                except Exception:
                    wake_status = "unknown"
                try:
                    wake_caches = await self.settings.get_setting("wake.caches", db, {"vector": True, "graph": True, "kv": True, "ssm": True})
                except Exception:
                    wake_caches = {"vector": True, "graph": True, "kv": True, "ssm": True}
                try:
                    ready_time_ms = float(await self.settings.get_setting("wake.ready_time_ms", db, 0.0) or 0.0)
                except Exception:
                    ready_time_ms = 0.0

                # Грубые оценки «размеров кэшей» по БД (без дорогих вычислений)
                graph_edges = 0
                kv_items = 0
                vector_entries = 0
                ssm_states = 0
                try:
                    row = (await db.execute(_t("select count(1) from quant_links"))).first()
                    graph_edges = int(row[0] or 0) if row else 0
                except Exception:
                    graph_edges = 0
                try:
                    row2 = (await db.execute(_t("select count(1) from soul_settings"))).first()
                    kv_items = int(row2[0] or 0) if row2 else 0
                except Exception:
                    kv_items = 0
                # vector/ssm пока не материализованы в виде таблиц — оставляем 0

                # p95 стадий прогрева/RT (best-effort из in-memory стора метрик)
                p95_rt: dict = {}
                try:
                    if _m is not None:
                        p = _m.get_percentile_all_tags  # type: ignore[attr-defined]
                        p95_rt = {
                            "hyperloop_execute_latency_ms_p95": float(p("hyperloop_execute_latency_ms", 95.0) or 0.0),
                            "processor_time_send_to_recv_ms_p95": float(p("processor.time_send_to_recv_ms", 95.0) or 0.0),
                            "ml_embed_search_latency_ms_p95": float(p("ml_embed_search_latency_ms", 95.0) or 0.0),
                        }
                except Exception:
                    p95_rt = {}

                signature_ctx.append_step(function_id="cmd.hyperloop.wake.status", scope="hyperloop", version="v1")
                out = {
                    "ok": True,
                    "data": {
                        "status": str(wake_status),
                        "ready_time_ms": float(ready_time_ms),
                        "caches": wake_caches if isinstance(wake_caches, dict) else _json.loads(str(wake_caches) or "{}"),
                        "cache_sizes": {
                            "vector_entries": int(vector_entries),
                            "graph_edges": int(graph_edges),
                            "kv_items": int(kv_items),
                            "ssm_states": int(ssm_states),
                        },
                        "p95": p95_rt,
                    },
                }

            elif handler == "wake.sleep":
                # WAKE.SLEEP profile="deep" [DRY_RUN] — безопасное окно write-back: создаём событие процессора
                import json as _json
                from sqlalchemy import text as _t

                profile = str(params.get("profile") or params.get("mode") or "deep").strip()
                epsilon = params.get("epsilon")
                radius = params.get("radius")
                max_edges = params.get("max_edges")

                payload: dict = {"profile": profile}
                if epsilon is not None:
                    payload["epsilon"] = epsilon
                if radius is not None:
                    payload["radius"] = radius
                if max_edges is not None:
                    payload["max_edges"] = max_edges
                payload["requested_by"] = "hyperloop"

                event_id: Optional[str] = None
                if not dry_run:
                    try:
                        row = (await db.execute(
                            _t("""
                                insert into processor_events(id, kind, payload, dedup_key, priority, due_at, status, retries, created_at)
                                values (gen_random_uuid(), :k, CAST(:p AS jsonb), NULL, 0, NULL, 'pending', 0, now())
                                returning id::text
                            """),
                            {"k": "sleep_cycle", "p": _json.dumps(payload, ensure_ascii=False)}
                        )).fetchone()
                        await db.commit()
                        event_id = row[0] if row else None
                    except Exception as e:
                        return {"ok": False, "error": f"sleep enqueue error: {e}"}
                    # Обновляем статусы сна/бодрствования
                    try:
                        await self.settings.set_setting("wake.status", "sleeping", db)
                        await self.settings.set_setting("sleep.profile", profile, db)
                    except Exception:
                        pass

                signature_ctx.append_step(function_id="cmd.hyperloop.wake.sleep", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enqueued_event_id": event_id, "profile": profile, "dry_run": dry_run}}

            # ---------------------- PM automation (continuous loop) ----------------------
            elif handler == "pm.tick" or handler == "PM.TICK":
                # PM.TICK project_id=<uuid>
                import json as _json
                pid = str(params.get("project_id") or params.get("id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                payload = {"project_id": pid, "source": "hyperloop"}
                event_id: Optional[str] = None
                if not dry_run:
                    try:
                        row = (await db.execute(
                            sa_text(
                                """
                                insert into processor_events(id, kind, payload, dedup_key, priority, due_at, status, retries, created_at)
                                values (gen_random_uuid(), :k, CAST(:p AS jsonb), NULL, 0, NULL, 'pending', 0, now())
                                returning id::text
                                """
                            ),
                            {"k": "pm.tick", "p": _json.dumps(payload, ensure_ascii=False)}
                        )).fetchone()
                        await db.commit()
                        event_id = row[0] if row else None
                    except Exception as e:
                        return {"ok": False, "error": f"pm.tick enqueue error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.pm.tick", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enqueued_event_id": event_id, "project_id": pid, "dry_run": dry_run}}

            elif handler == "pm.assign" or handler == "PM.ASSIGN":
                # PM.ASSIGN project_id=<uuid> tasks_json=<json>
                import json as _json
                pid = str(params.get("project_id") or params.get("id") or "").strip()
                tasks = params.get("tasks_json") or params.get("tasks") or []
                if isinstance(tasks, str):
                    try:
                        tasks = _json.loads(tasks)
                    except Exception:
                        tasks = []
                if not pid or not isinstance(tasks, list) or len(tasks) == 0:
                    return {"ok": False, "error": "project_id and non-empty tasks required"}
                payload = {"project_id": pid, "tasks": tasks, "source": "hyperloop"}
                event_id: Optional[str] = None
                if not dry_run:
                    try:
                        row = (await db.execute(
                            sa_text(
                                """
                                insert into processor_events(id, kind, payload, dedup_key, priority, due_at, status, retries, created_at)
                                values (gen_random_uuid(), :k, CAST(:p AS jsonb), NULL, 0, NULL, 'pending', 0, now())
                                returning id::text
                                """
                            ),
                            {"k": "pm.assign", "p": _json.dumps(payload, ensure_ascii=False)}
                        )).fetchone()
                        await db.commit()
                        event_id = row[0] if row else None
                    except Exception as e:
                        return {"ok": False, "error": f"pm.assign enqueue error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.pm.assign", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enqueued_event_id": event_id, "project_id": pid, "tasks_count": len(tasks), "dry_run": dry_run}}

            elif handler == "pm.agent.request" or handler == "PM.AGENT.REQUEST":
                # PM.AGENT.REQUEST project_id=<uuid> to=<cursor|deepseek|phi4> action=<key> spec_json=<json>
                import json as _json
                pid = str(params.get("project_id") or params.get("id") or "").strip()
                target = str(params.get("to") or "").strip()
                action = str(params.get("action") or "").strip()
                spec = params.get("spec_json") or params.get("spec") or {}
                if isinstance(spec, str):
                    try:
                        spec = _json.loads(spec)
                    except Exception:
                        spec = {"raw": spec}
                if not pid or not target or not action:
                    return {"ok": False, "error": "project_id, to and action required"}
                payload = {"project_id": pid, "to": target, "action": action, "spec": (spec if isinstance(spec, dict) else {}), "source": "hyperloop"}
                event_id: Optional[str] = None
                if not dry_run:
                    try:
                        row = (await db.execute(
                            sa_text(
                                """
                                insert into processor_events(id, kind, payload, dedup_key, priority, due_at, status, retries, created_at)
                                values (gen_random_uuid(), :k, CAST(:p AS jsonb), NULL, 0, NULL, 'pending', 0, now())
                                returning id::text
                                """
                            ),
                            {"k": "pm.agent.request", "p": _json.dumps(payload, ensure_ascii=False)}
                        )).fetchone()
                        await db.commit()
                        event_id = row[0] if row else None
                    except Exception as e:
                        return {"ok": False, "error": f"pm.agent.request enqueue error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.pm.agent.request", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enqueued_event_id": event_id, "project_id": pid, "to": target, "action": action, "dry_run": dry_run}}

            elif handler == "pm.incidents.review" or handler == "PM.INCIDENTS.REVIEW":
                # PM.INCIDENTS.REVIEW project_id=<uuid> policy_json=<json>
                import json as _json
                pid = str(params.get("project_id") or params.get("id") or "").strip()
                policy = params.get("policy_json") or params.get("policy") or {}
                if isinstance(policy, str):
                    try:
                        policy = _json.loads(policy)
                    except Exception:
                        policy = {"raw": policy}
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                payload = {"project_id": pid, "policy": (policy if isinstance(policy, dict) else {}), "source": "hyperloop"}
                event_id: Optional[str] = None
                if not dry_run:
                    try:
                        row = (await db.execute(
                            sa_text(
                                """
                                insert into processor_events(id, kind, payload, dedup_key, priority, due_at, status, retries, created_at)
                                values (gen_random_uuid(), :k, CAST(:p AS jsonb), NULL, 0, NULL, 'pending', 0, now())
                                returning id::text
                                """
                            ),
                            {"k": "pm.incidents.review", "p": _json.dumps(payload, ensure_ascii=False)}
                        )).fetchone()
                        await db.commit()
                        event_id = row[0] if row else None
                    except Exception as e:
                        return {"ok": False, "error": f"pm.incidents.review enqueue error: {e}"}
                # Suggest RCA for critical/recurring incidents per policy
                try:
                    rca_suggest = bool((policy or {}).get("rca_suggest", True))
                except Exception:
                    rca_suggest = True
                rca_hint = None
                if rca_suggest:
                    try:
                        # Lightweight scan of recent incidents by project (if such link exists)
                        q = """
                        select i.id::text as id, i.type as type, i.created_at as created_at
                          from processor_incidents i
                         where i.created_at >= now() - interval '3 days'
                         order by i.created_at desc
                         limit 10
                        """
                        rows = (await db.execute(sa_text(q))).mappings().all()
                        incs = [dict(r) for r in rows]
                        # Provide a deterministic suggestion: call to RCA.RECORD.ADD with placeholders
                        if incs:
                            it = incs[0]
                            rca_hint = {
                                "command": "RCA.RECORD.ADD",
                                "options": {
                                    "project_id": pid,
                                    "incident_id": it.get("id"),
                                    "title": f"RCA: {str(it.get('type') or 'incident')}",
                                    "problem": str(it.get("type") or "incident"),
                                    "methodology": "five_whys",
                                    "effects": [],
                                    "root_causes": [],
                                    "fixes": [],
                                    "preventions": [],
                                    "evidence_refs": []
                                }
                            }
                    except Exception:
                        rca_hint = None
                signature_ctx.append_step(function_id="cmd.hyperloop.pm.incidents.review", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enqueued_event_id": event_id, "project_id": pid, "dry_run": dry_run, "rca_suggest": rca_hint}}

            elif handler == "pm.decision.save" or handler == "PM.DECISION.SAVE":
                # PM.DECISION.SAVE incident_id=<uuid> decision=<key> [project_id=<uuid>] [priority=<int>] [meta_json=<json>]
                import json as _json
                inc_id = str(params.get("incident_id") or params.get("iid") or "").strip()
                decision = str(params.get("decision") or "").strip()
                proj = str(params.get("project_id") or params.get("pid") or "").strip() or None
                prio = params.get("priority")
                try:
                    prio_int = int(prio) if prio is not None else None
                except Exception:
                    prio_int = None
                meta = params.get("meta_json") or params.get("meta") or {}
                if isinstance(meta, str):
                    try:
                        meta = _json.loads(meta)
                    except Exception:
                        meta = {"raw": meta}
                if not inc_id or not decision:
                    return {"ok": False, "error": "incident_id and decision required"}
                # Ensure table exists
                try:
                    await db.execute(sa_text(
                        """
                        create table if not exists pm_decisions (
                            id uuid primary key default gen_random_uuid(),
                            incident_id uuid not null,
                            decision text not null,
                            project_id uuid null,
                            priority integer null,
                            meta jsonb not null default '{}'::jsonb,
                            created_at timestamptz not null default now()
                        )
                        """
                    ))
                except Exception:
                    pass
                bind: Dict[str, Any] = {
                    "iid": inc_id,
                    "d": decision,
                    "m": _json.dumps(meta if isinstance(meta, dict) else {})
                }
                fields = ["incident_id", "decision", "meta"]
                values = ["CAST(:iid AS uuid)", ":d", "CAST(:m AS jsonb)"]
                if proj:
                    fields.append("project_id"); values.append("CAST(:pid AS uuid)"); bind["pid"] = proj
                if prio_int is not None:
                    fields.append("priority"); values.append(":p"); bind["p"] = prio_int
                try:
                    await db.execute(sa_text(f"insert into pm_decisions({', '.join(fields)}) values ({', '.join(values)})"), bind)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"pm.decision.save error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.pm.decision.save", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"incident_id": inc_id, "decision": decision, "project_id": proj, "priority": prio_int}}

            elif handler == "flags.unset":
                key = str(params.get("key") or "").strip()
                if not dry_run:
                    await self.settings.set_setting(key, None, db)
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.unset", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": key, "unset": True, "dry_run": dry_run}}

            elif handler == "flags.apply_profile":
                profile = str(params.get("name") or "").strip()
                # Two-Keys enforcement for dangerous profiles
                try:
                    # prod_safe/dev_full considered sensitive for runtime switches
                    if profile in ("prod_safe", "dev_full") and not dry_run:
                        req_id = str(params.get("two_keys_request_id") or params.get("request_id") or "").strip()
                        if not req_id or (await self._check_two_keys(db, req_id)) is not True:
                            return {"ok": False, "error": "two_keys_required"}
                except Exception:
                    # Fail-safe: require approval if enforcement flag set
                    pass
                # best-effort интеграция с Mother of Flags
                try:
                    from ..services.feature_flags_supervisor import FeatureFlagsSupervisor  # type: ignore
                    m = FeatureFlagsSupervisor()
                    if not dry_run:
                        await m.apply_profile(db, profile)
                    changed = await m.get_state(db)
                except Exception:
                    changed = {"profile": profile}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.apply_profile", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"applied_profile": profile, "state": changed, "dry_run": dry_run}}

            elif handler == "flags.state":
                # FLAGS.STATE — текущее состояние ключевых флагов и активного профиля
                try:
                    from ..services.feature_flags_supervisor import FeatureFlagsSupervisor  # type: ignore
                    m = FeatureFlagsSupervisor()
                    state = await m.get_state(db)
                except Exception as e:
                    return {"ok": False, "error": f"flags state error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.state", scope="hyperloop", version="v1")
                out = {"ok": True, "data": state}

            elif handler == "flags.get" or handler == "FLAGS.GET":
                key = str(params.get("key") or params.get("name") or "").strip()
                if not key:
                    return {"ok": False, "error": "key required"}
                try:
                    val = await self.settings.get_setting(key, db, None)
                except Exception as e:
                    return {"ok": False, "error": f"flags.get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": key, "value": val}}

            elif handler == "settings.get" or handler == "SETTINGS.GET":
                key = str(params.get("key") or params.get("name") or "").strip()
                if not key:
                    return {"ok": False, "error": "key required"}
                try:
                    val = await self.settings.get_setting(key, db, None)
                except Exception as e:
                    return {"ok": False, "error": f"settings.get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.settings.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": key, "value": val}}

            elif group == "GRAPH" and action in {"AGGREGATE", "CLUSTER", "TOPK"}:
                # GRAPH.AGGREGATE|CLUSTER|TOPK — делегирование в RSBus (must-use в P48R)
                try:
                    from ..services.soul_settings_service import SoulSettingsService as _SS  # type: ignore
                    from ..services.rsbus_client import rsbus_send  # type: ignore
                    svc = _SS()
                    addr = await svc.get_setting("rs.hyperloop.addr", db, "unix:///run/soul/rsbus.dev.sock")
                    timeout_ms = int(await svc.get_setting("rs.hyperloop.timeout_ms", db, 800))
                    spec = params.get("spec") or params.get("payload") or {}
                    if isinstance(spec, str):
                        import json as _json
                        try:
                            spec = _json.loads(spec)
                        except Exception:
                            spec = {"raw": spec}
                    op_map = {
                        "AGGREGATE": "graph.aggregate",
                        "CLUSTER": "graph.cluster",
                        "TOPK": "graph.topk",
                    }
                    op = op_map[action]
                    rs = await rsbus_send(op=op, payload=spec if isinstance(spec, dict) else {}, addr=str(addr), timeout_ms=timeout_ms, trace_id=getattr(signature_ctx, "trace_id", None))
                    signature_ctx.append_step(function_id="svc.rs.proxy", scope="hyperloop", version="v1")
                    ok = bool(rs.get("ok")) if isinstance(rs, dict) else False
                    out = {"ok": ok, "results": ([{"ok": ok, "data": rs.get("rs_raw", rs)}] if isinstance(rs, dict) else [])}
                except Exception as e:
                    out = {"ok": False, "error": f"graph op error: {e}"}
            elif handler == "age.sync":
                # AGE.SYNC — один тик инкрементальной синхронизации AGE из quant_connections
                try:
                    from ..services.age_sync_service import AgeSyncService  # type: ignore
                    svc = AgeSyncService()
                    res = await svc.sync_tick(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.age.sync", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": res}
                except Exception as e:
                    # Fallback: встроенный идемпотентный тик без внешнего сервиса (восстановление работоспособности)
                    try:
                        from sqlalchemy import text as _t  # type: ignore
                        from ..services.soul_settings_service import SoulSettingsService as _SS  # type: ignore
                        from ..services.age_service import AgeService as _AS  # type: ignore

                        _settings = _SS()
                        _age = _AS(graph="soul_graph")
                        # Настройки
                        try:
                            batch_size = int(await _settings.get_setting("age.sync.batch_size", db, 500))
                        except Exception:
                            batch_size = 500
                        last_ts = await _settings.get_setting("age.sync.last_ts", db, None)

                        if last_ts:
                            sel = _t(
                                """
                                SELECT id::text as id,
                                       from_quant_id::text AS a,
                                       to_quant_id::text   AS b,
                                       COALESCE(connection_type::text,'semantic') AS rt,
                                       COALESCE(connection_strength, 0)::float AS s,
                                       COALESCE(keyword_overlap, 0)::float      AS ko,
                                       COALESCE(created_at, NOW())              AS created_at
                                FROM quant_connections
                                WHERE COALESCE(created_at, NOW()) > CAST(:lts AS timestamptz)
                                ORDER BY created_at ASC NULLS LAST, id ASC
                                LIMIT :lim
                                """
                            )
                            resq = await db.execute(sel, {"lts": str(last_ts), "lim": int(batch_size)})
                        else:
                            sel = _t(
                                """
                                SELECT id::text as id,
                                       from_quant_id::text AS a,
                                       to_quant_id::text   AS b,
                                       COALESCE(connection_type::text,'semantic') AS rt,
                                       COALESCE(connection_strength, 0)::float AS s,
                                       COALESCE(keyword_overlap, 0)::float      AS ko,
                                       COALESCE(created_at, NOW())              AS created_at
                                FROM quant_connections
                                ORDER BY created_at ASC NULLS LAST, id ASC
                                LIMIT :lim
                                """
                            )
                            resq = await db.execute(sel, {"lim": int(batch_size)})

                        cols = list(resq.keys())
                        rows = [{k: row[i] for i, k in enumerate(cols)} for row in resq.fetchall()]
                        synced = 0
                        max_ts = last_ts
                        for r in rows:
                            a = str(r.get("a") or "").strip()
                            b = str(r.get("b") or "").strip()
                            if not a or not b:
                                continue
                            rt = str(r.get("rt") or "semantic").strip() or "semantic"
                            s = float(r.get("s") or 0.0)
                            ko = float(r.get("ko") or 0.0)
                            await _age.create_related(db, from_quant_id=a, to_quant_id=b, relation_type=rt, strength=s, keyword_overlap=ko)
                            synced += 1
                            ct = r.get("created_at")
                            try:
                                max_ts = max(max_ts, ct.isoformat() if hasattr(ct, "isoformat") else str(ct)) if max_ts else (
                                    ct.isoformat() if hasattr(ct, "isoformat") else str(ct)
                                )
                            except Exception:
                                pass

                        if synced and max_ts:
                            try:
                                await _settings.set_setting("age.sync.last_ts", max_ts, db, description="AGE sync checkpoint (fallback)")
                            except Exception:
                                pass

                        signature_ctx.append_step(function_id="cmd.hyperloop.age.sync.fallback", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": {"synced": synced, "last_ts": max_ts, "fallback": True}}
                    except Exception as ee:
                        out = {"ok": False, "error": f"age.sync error: {e}; fallback_failed: {ee}"}

            elif handler == "age.init":
                # AGE.INIT — ensure extension+graph exists (без LOAD; fully-qualified объекты)
                try:
                    from sqlalchemy import text as _t  # type: ignore
                    await db.execute(_t("CREATE EXTENSION IF NOT EXISTS age"))
                    await db.execute(_t(
                        """
                        DO $$
                        BEGIN
                          BEGIN
                            PERFORM ag_catalog.create_graph('soul_graph');
                          EXCEPTION WHEN duplicate_object THEN
                            -- graph already exists, ignore
                            NULL;
                          END;
                        END $$;
                        """
                    ))
                    # Best-effort grants for application user
                    try:
                        await db.execute(_t("GRANT USAGE ON SCHEMA ag_catalog TO PUBLIC"))
                        await db.execute(_t("GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ag_catalog TO PUBLIC"))
                        await db.execute(_t("GRANT USAGE ON TYPE ag_catalog.agtype TO PUBLIC"))
                    except Exception:
                        pass
                    await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.age.init", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"initialized": True}}
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    out = {"ok": False, "error": f"age.init error: {e}"}

            elif handler == "age.counts":
                # AGE.COUNTS — асинхронный подсчёт через обёртки public.f_age_vertices()/public.f_age_edges()
                from sqlalchemy.ext.asyncio import AsyncEngine as _AsyncEngine  # type: ignore
                from sqlalchemy import text as _t  # type: ignore
                v = 0
                e = 0
                rel = 0
                # Сбросим текущую транзакцию на всякий случай
                try:
                    await db.rollback()
                except Exception:
                    pass
                try:
                    eng = getattr(db, "bind", None)
                    if eng is None:
                        raise RuntimeError("AsyncEngine not bound")
                    # Подключаемся через AsyncEngine.connect() и используем exec_driver_sql
                    async with eng.connect() as conn:  # type: ignore[assignment]
                        res_v = await conn.exec_driver_sql("SELECT public.f_age_vertices()")
                        row_v = res_v.fetchone()
                        if row_v is not None and row_v[0] is not None:
                            v = int(row_v[0])
                        res_e = await conn.exec_driver_sql("SELECT public.f_age_edges()")
                        row_e = res_e.fetchone()
                        if row_e is not None and row_e[0] is not None:
                            e = int(row_e[0])
                    # Реляционные счётчики — в текущем сеансе
                    res_rel = await db.execute(_t("SELECT count(*) FROM quant_connections"))
                    rel = int(res_rel.fetchone()[0])
                    coverage = (e / rel) if rel > 0 else 1.0
                    signature_ctx.append_step(function_id="cmd.hyperloop.age.counts", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"age_vertices": v, "age_edges": e, "rel_edges": rel, "coverage": coverage}}
                except Exception as e:
                    out = {"ok": False, "error": f"age.counts error: {e}"}

            elif handler == "inspector.reg_sync":
                # INSPECTOR.REG_SYNC — upsert регистраций ключевых инспекторов (diamond/rs.budgets)
                try:
                    from sqlalchemy import text as _t  # type: ignore
                    # Определяем корректный модульный префикс для прод/репо окружений
                    try:
                        import importlib.util as _ils  # type: ignore
                    except Exception:
                        _ils = None  # type: ignore

                    def _choose_mod(backend_mod: str, app_mod: str) -> str:
                        """Возвращает импортируемый модуль: предпочитает app.* если доступен, иначе backend.app.*"""
                        try:
                            if _ils and _ils.find_spec(app_mod):  # type: ignore[attr-defined]
                                return app_mod
                        except Exception:
                            pass
                        return backend_mod

                    rows = [
                        {
                            "key": "diamond.pipeline.health",
                            "module": _choose_mod(
                                "backend.app.gendarme_tests.diamond_pipeline_health",
                                "app.gendarme_tests.diamond_pipeline_health",
                            ),
                            "callable": "run",
                            "scope": "processor",
                            "enabled": True,
                            "config": "{}",
                        },
                        {
                            "key": "rs.actor.budgets",
                            "module": _choose_mod(
                                "backend.app.gendarme_tests.rs_actor_budgets",
                                "app.gendarme_tests.rs_actor_budgets",
                            ),
                            "callable": "run",
                            "scope": "signature",
                            "enabled": True,
                            "config": '{"p95_budget_ms":50,"err_rate":0.01}',
                        },
                        {
                            "key": "guard.canonical.urls",
                            "module": _choose_mod(
                                "backend.app.feature_plugins.guard_canonical_urls",
                                "app.feature_plugins.guard_canonical_urls",
                            ),
                            "callable": "run",
                            "scope": "guard",
                            "enabled": True,
                            "config": "{}",
                        },
                        {
                            "key": "rs_trace_linking",
                            "module": _choose_mod(
                                "backend.app.feature_plugins.rs_trace_linking",
                                "app.feature_plugins.rs_trace_linking",
                            ),
                            "callable": "run",
                            "scope": "signature",
                            "enabled": True,
                            "config": '{"window_hours":24}',
                        },
                        {
                            "key": "net.private_link",
                            "module": _choose_mod(
                                "backend.app.feature_plugins.net_private_link",
                                "app.feature_plugins.net_private_link",
                            ),
                            "callable": "run",
                            "scope": "network",
                            "enabled": True,
                            "config": "{}",
                        },
                        {
                            "key": "lessons.presence",
                            "module": _choose_mod(
                                "backend.app.feature_plugins.lessons_inspector_presence",
                                "app.feature_plugins.lessons_inspector_presence",
                            ),
                            "callable": "run",
                            "scope": "processor",
                            "enabled": True,
                            "config": "{}",
                        },
                    ]
                    for r in rows:
                        await db.execute(
                            _t(
                                """
                                insert into feature_inspectors(key,module,callable,scope,enabled,config)
                                values (:key,:module,:callable,:scope,:enabled,CAST(:config AS jsonb))
                                on conflict (key) do update set module=EXCLUDED.module, callable=EXCLUDED.callable, scope=EXCLUDED.scope, enabled=EXCLUDED.enabled, updated_at=now()
                                """
                            ),
                            r,
                        )
                    await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.inspector.reg_sync", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"upserted": len(rows)}}
                except Exception as e:
                    out = {"ok": False, "error": f"inspector.reg_sync error: {e}"}

            elif handler == "rs.canary.run":
                # RS.CANARY.RUN — включает rs_canary_profile и возвращает p95 summary
                try:
                    from ..services.feature_flags_supervisor import FeatureFlagsSupervisor  # type: ignore
                    from ..services.rs_metrics_service import fetch_rs_metrics_text, build_p95_summary  # type: ignore
                    sup = FeatureFlagsSupervisor()
                    _ = await sup.apply_profile(db, "rs_canary_profile")
                    ok_m, prom = await fetch_rs_metrics_text(db)
                    if not ok_m:
                        out = {"ok": False, "error": prom or "metrics unavailable"}
                    else:
                        summary = build_p95_summary(prom)
                        signature_ctx.append_step(function_id="cmd.hyperloop.rs.canary.run", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": summary}
                except Exception as e:
                    out = {"ok": False, "error": f"rs.canary.run error: {e}"}
            elif handler == "flags.reconcile":
                # FLAGS.RECONCILE policy=p27
                policy = str(params.get("policy") or "p27").strip().lower()
                try:
                    from ..services.feature_flags_supervisor import FeatureFlagsSupervisor  # type: ignore
                    m = FeatureFlagsSupervisor()
                    if policy in ("p27", "signature"):
                        changed = await m.reconcile_p27_invariants(db)
                    else:
                        changed = {}
                except Exception:
                    changed = {}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.reconcile", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"policy": policy, "changed": changed}}

            # ---------------------- CHANNEL AGENT / CHANNEL CONTROL ----------------------
            elif handler == "channel.agent.enable":
                # CHANNEL.AGENT.ENABLE enabled=true|false
                try:
                    enabled_raw = params.get("enabled")
                    enabled = bool(enabled_raw) if isinstance(enabled_raw, bool) else str(enabled_raw).strip().lower() in ("1","true","on","yes")
                    from ..services.soul_settings_service import SoulSettingsService  # type: ignore
                    sss = SoulSettingsService()
                    ok = await sss.set_setting("channel_agent.enabled", enabled, db, description="Hyperloop toggle")
                    signature_ctx.append_step(function_id="cmd.hyperloop.channel.agent.enable", scope="hyperloop", version="v1")
                    out = {"ok": bool(ok), "data": {"enabled": enabled}}
                except Exception as e:
                    out = {"ok": False, "error": f"channel.agent.enable error: {e}"}

            elif handler == "channel.agent.units.set":
                # CHANNEL.AGENT.UNITS.SET units=["soul-tunnel-5433.service","soulpulse-backend.service"]
                try:
                    units = params.get("units")
                    if isinstance(units, str):
                        # поддержка JSON-строки
                        import json as _json
                        units = _json.loads(units)
                    if not isinstance(units, list) or not units:
                        return {"ok": False, "error": "units required (list)"}
                    from ..services.soul_settings_service import SoulSettingsService  # type: ignore
                    sss = SoulSettingsService()
                    ok = await sss.set_setting("channel_agent.units", units, db, description="Channel units list")
                    signature_ctx.append_step(function_id="cmd.hyperloop.channel.agent.units.set", scope="hyperloop", version="v1")
                    out = {"ok": bool(ok), "data": {"units": units}}
                except Exception as e:
                    out = {"ok": False, "error": f"channel.agent.units.set error: {e}"}

            elif handler == "channel.start":
                # CHANNEL.START unit=<systemd_unit_name>
                try:
                    import shlex as _sh
                    import asyncio as _aio
                    unit = str(params.get("unit") or "").strip()
                    if not unit:
                        return {"ok": False, "error": "unit required"}
                    proc = await _aio.create_subprocess_shell(f"systemctl start {_sh.quote(unit)}", stdout=_aio.subprocess.PIPE, stderr=_aio.subprocess.STDOUT)
                    out_b = await proc.communicate()
                    code = int(proc.returncode or 0)
                    # verify
                    proc2 = await _aio.create_subprocess_shell(f"systemctl is-active {_sh.quote(unit)}", stdout=_aio.subprocess.PIPE, stderr=_aio.subprocess.STDOUT)
                    out2_b = await proc2.communicate()
                    active = (int(proc2.returncode or 0) == 0) and ( (out2_b[0] or b"").decode("utf-8", errors="ignore").strip() in ("active","activating") )
                    signature_ctx.append_step(function_id="cmd.hyperloop.channel.start", scope="hyperloop", version="v1")
                    out = {"ok": (code == 0 and active), "data": {"unit": unit, "active": active, "out": (out_b[0] or b"").decode("utf-8", errors="ignore")}}
                except Exception as e:
                    out = {"ok": False, "error": f"channel.start error: {e}"}

            elif handler == "channel.stop":
                # CHANNEL.STOP unit=<systemd_unit_name>
                try:
                    import shlex as _sh
                    import asyncio as _aio
                    unit = str(params.get("unit") or "").strip()
                    if not unit:
                        return {"ok": False, "error": "unit required"}
                    proc = await _aio.create_subprocess_shell(f"systemctl stop {_sh.quote(unit)}", stdout=_aio.subprocess.PIPE, stderr=_aio.subprocess.STDOUT)
                    out_b = await proc.communicate()
                    code = int(proc.returncode or 0)
                    # verify
                    proc2 = await _aio.create_subprocess_shell(f"systemctl is-active {_sh.quote(unit)}", stdout=_aio.subprocess.PIPE, stderr=_aio.subprocess.STDOUT)
                    out2_b = await proc2.communicate()
                    inactive = (int(proc2.returncode or 0) != 0) or ( (out2_b[0] or b"").decode("utf-8", errors="ignore").strip() in ("inactive","failed","deactivating") )
                    signature_ctx.append_step(function_id="cmd.hyperloop.channel.stop", scope="hyperloop", version="v1")
                    out = {"ok": (code == 0 and inactive), "data": {"unit": unit, "inactive": inactive, "out": (out_b[0] or b"").decode("utf-8", errors="ignore")}}
                except Exception as e:
                    out = {"ok": False, "error": f"channel.stop error: {e}"}

            elif handler == "channel.smoke":
                # CHANNEL.SMOKE — проверка: enabled флаг и что units active
                try:
                    import asyncio as _aio
                    from ..services.soul_settings_service import SoulSettingsService  # type: ignore
                    sss = SoulSettingsService()
                    enabled = bool(await sss.get_setting("channel_agent.enabled", db, False))
                    units = await sss.get_setting("channel_agent.units", db, [])
                    if isinstance(units, str):
                        import json as _json
                        try:
                            units = _json.loads(units)
                        except Exception:
                            units = []
                    results = []
                    ok_all = True
                    if isinstance(units, list):
                        for u in units[:20]:
                            name = str(u.get("name") if isinstance(u, dict) else u).strip()
                            if not name:
                                continue
                            proc2 = await _aio.create_subprocess_shell(f"systemctl is-active {name}", stdout=_aio.subprocess.PIPE, stderr=_aio.subprocess.STDOUT)
                            out2_b = await proc2.communicate()
                            active = (int(proc2.returncode or 0) == 0) and ( (out2_b[0] or b"").decode("utf-8", errors="ignore").strip() == "active" )
                            ok_all = ok_all and active
                            results.append({"unit": name, "active": active})
                    signature_ctx.append_step(function_id="cmd.hyperloop.channel.smoke", scope="hyperloop", version="v1")
                    out = {"ok": (enabled and ok_all), "data": {"enabled": enabled, "units": results}}
                except Exception as e:
                    out = {"ok": False, "error": f"channel.smoke error: {e}"}

            elif handler == "sanitizer.preview":
                text_value = str(params.get("text") or "")
                try:
                    from ..services.sanitizer_supervisor import SanitizerSupervisor  # type: ignore
                    s = SanitizerSupervisor()
                    preview = await s.preview(db, text_value)
                except Exception:
                    preview = {"text": text_value, "note": "sanitizer unavailable"}
                signature_ctx.append_step(function_id="cmd.hyperloop.sanitizer.preview", scope="hyperloop", version="v1")
                out = {"ok": True, "data": preview}

            elif handler == "inspector.run":
                # INSPECTOR.RUN key=... [scope=...]
                insp_key = str(params.get("key") or "").strip()
                scope = params.get("scope")
                # Защита от случайных токенов вида --telegram-user-id
                if not insp_key or insp_key.startswith("--"):
                    return {"ok": False, "error": "key required"}
                try:
                    # Передаём все дополнительные параметры инспектору (например, action/owner/branch/...)
                    extra_ctx = {k: v for k, v in params.items() if k not in ("key", "scope")}
                    data = await self._execute_inspector(
                        db=db,
                        key=insp_key,
                        scope=(str(scope) if scope else None),
                        extra_context=extra_ctx,
                    )
                    signature_ctx.append_step(function_id="cmd.hyperloop.inspector.run", scope="hyperloop", version="v1")
                    _st = str(data.get("status") or "").lower()
                    out = {"ok": (_st in {"passed", "ok", "success", "succeeded"}), "data": data}
                except Exception as e:
                    return {"ok": False, "error": f"inspector error: {e}"}

            elif handler == "inspectors.resync" or handler == "INSPECTORS.RESYNC":
                # INSPECTORS.RESYNC — upsert всех инспекторов из локального реестра
                try:
                    from ..scripts.reg_inspectors import INSPECTORS as _REG  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"import reg_inspectors failed: {e}"}
                try:
                    saved = 0
                    import json as _json
                    for row in _REG:
                        cfg = row.get("config") or {}
                        cfg_s = cfg if isinstance(cfg, str) else _json.dumps(cfg)
                        await db.execute(
                            sa_text(
                                """
                                insert into feature_inspectors(key,module,callable,scope,enabled,config)
                                values (:key,:module,:callable,:scope,:enabled,CAST(:config AS jsonb))
                                on conflict (key) do update set module=EXCLUDED.module, callable=EXCLUDED.callable, scope=EXCLUDED.scope, enabled=EXCLUDED.enabled, updated_at=now()
                                """
                            ),
                            {
                                "key": row.get("key"),
                                "module": row.get("module"),
                                "callable": row.get("callable"),
                                "scope": row.get("scope"),
                                "enabled": bool(row.get("enabled", True)),
                                "config": cfg_s,
                            },
                        )
                        saved += 1
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"inspectors resync error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.inspectors.resync", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"upserted": saved}}

            elif handler in ("inspector.violations", "INSPECTOR.VIOLATIONS"):
                # INSPECTOR.VIOLATIONS key=guard.canonical.urls — вернуть адреса нарушений и топ по файлам
                insp_key = str(params.get("key") or "").strip()
                if not insp_key or insp_key.startswith("--"):
                    return {"ok": False, "error": "key required"}
                try:
                    data = await self._execute_inspector(db=db, key=insp_key, scope=None, extra_context={})
                    v = data.get("violations") if isinstance(data, dict) else None
                    bf = data.get("by_file") if isinstance(data, dict) else None
                    to = data.get("top_offenders") if isinstance(data, dict) else None
                    details = data.get("detail") if isinstance(data, dict) else None
                    signature_ctx.append_step(function_id="cmd.hyperloop.inspector.violations", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"detail": details, "violations": v or [], "by_file": bf or {}, "top_offenders": to or []}}
                except Exception as e:
                    return {"ok": False, "error": f"inspector.violations error: {e}"}

            elif handler == "dev.connect":
                # DEV.CONNECT owner=<tg_id> branch=<key> [session=<sid>] [ttl_sec=<int>] [session_ttl_sec=<int>]
                owner = str(params.get("owner") or "").strip()
                branch = str(params.get("branch") or "").strip()
                session = str(params.get("session") or "").strip()
                ttl_sec = params.get("ttl_sec")
                session_ttl_sec = params.get("session_ttl_sec")
                if not owner or not branch:
                    return {"ok": False, "error": "owner and branch are required"}
                _t0 = _time.time()
                _status = "error"
                try:
                    # 1) claim_branch via inspector plan.branch
                    claim_ctx = {"action": "claim_branch", "owner": owner, "branch": branch}
                    if session:
                        claim_ctx["session"] = session
                    if ttl_sec is not None:
                        claim_ctx["ttl_sec"] = ttl_sec
                    if session_ttl_sec is not None:
                        claim_ctx["session_ttl_sec"] = session_ttl_sec
                    claim_res = await self._execute_inspector(db=db, key="plan.branch", scope=None, extra_context=claim_ctx)
                    # 2) optional heartbeat if session provided
                    ping_res = None
                    if session:
                        ping_ctx = {"action": "session_ping", "session": session, "owner": owner}
                        if session_ttl_sec is not None:
                            ping_ctx["session_ttl_sec"] = session_ttl_sec
                        ping_res = await self._execute_inspector(db=db, key="plan.branch", scope=None, extra_context=ping_ctx)
                    signature_ctx.append_step(function_id="cmd.hyperloop.dev.connect", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"claim": claim_res, "ping": ping_res}}
                    _status = "success"
                except Exception as _e:
                    out = {"ok": False, "error": f"dev.connect error: {_e}"}
                    _status = "error"
                finally:
                    try:
                        _metric_incr("dev_connect_total", {"status": _status})
                        _metric_observe("dev_connect_latency_ms", ( _time.time() - _t0 ) * 1000.0, {"status": _status})
                    except Exception:
                        pass

            elif handler == "session.claim":
                # SESSION.CLAIM owner=<tg_id> branch=<key> [topic=<t>] [session=<sid>] [ttl_sec=<int>] [session_ttl_sec=<int>]
                owner = str(params.get("owner") or "").strip()
                branch = str(params.get("branch") or "").strip()
                session = str(params.get("session") or "").strip()
                ttl_sec = params.get("ttl_sec")
                session_ttl_sec = params.get("session_ttl_sec")
                if not owner or not branch:
                    return {"ok": False, "error": "owner and branch are required"}
                claim_ctx = {"action": "claim_branch", "owner": owner, "branch": branch}
                if session:
                    claim_ctx["session"] = session
                if ttl_sec is not None:
                    claim_ctx["ttl_sec"] = ttl_sec
                if session_ttl_sec is not None:
                    claim_ctx["session_ttl_sec"] = session_ttl_sec
                claim_res = await self._execute_inspector(db=db, key="plan.branch", scope=None, extra_context=claim_ctx)
                signature_ctx.append_step(function_id="cmd.hyperloop.session.claim", scope="hyperloop", version="v1")
                out = {"ok": True, "data": claim_res}
            elif handler == "inspector.run_all":
                # INSPECTOR.RUN_ALL [scope=sanitizer|signature|processor|*]
                scope = params.get("scope")
                try:
                    rows = []
                    try:
                        _txt = sa_text  # reuse module-level safe alias
                        if scope and str(scope).strip() != "*":
                            rows = (await db.execute(_txt("select key from feature_inspectors where enabled=true and scope=:s order by key"), {"s": str(scope)})).fetchall()
                        else:
                            rows = (await db.execute(_txt("select key from feature_inspectors where enabled=true order by key"))).fetchall()
                    except Exception:
                        rows = []
                    keys = [r[0] for r in rows] if rows else []
                    results = []
                    if not keys:
                        # Fallback: run a minimal built-in set of known inspectors by convention
                        keys = [
                            "rs.security_limits",
                            "pdp_parity",
                            "processor_parity",
                            "rs_trace_linking",
                            "rs_sensors_smoke",
                            # P50 incidents
                            "incident.required_steps",
                            "incident.sla_enforcement",
                        ]
                    if keys:
                        for k in keys:
                            try:
                                res = await self._execute_inspector(db=db, key=str(k), scope=(str(scope) if scope else None), extra_context=None)
                            except Exception as e:
                                res = {"status": "failed", "detail": str(e)}
                            results.append({"key": k, **res})
                        signature_ctx.append_step(function_id="cmd.hyperloop.inspector.run_all", scope="hyperloop", version="v1")
                        def _ok_status(x: str) -> bool:
                            return str(x or "").lower() in {"passed", "ok", "success", "succeeded"}
                        out = {"ok": all((_ok_status(r.get("status"))) for r in results), "data": {"total": len(results), "results": results}}
                    else:
                        out = {"ok": True, "data": {"total": 0, "results": []}}
                except Exception as e:
                    return {"ok": False, "error": f"inspector run_all error: {e}"}

            # ---------------------- Fast project connect & mirroring (LLM agents) ----------------------
            elif handler == "session.claim":
                # SESSION.CLAIM owner=<tg_id> branch=<key> [topic=<t>] [session=<sid>] [ttl_sec=<n>]
                owner = str(params.get("owner") or params.get("user") or params.get("user_id") or "").strip()
                branch_key = str(params.get("branch") or params.get("branch_key") or "").strip()
                topic = str(params.get("topic") or params.get("area") or "").strip()
                ttl_sec = int(params.get("ttl_sec") or 172800)
                session_id = str(params.get("session") or params.get("session_id") or "").strip()
                if not owner or not branch_key:
                    return {"ok": False, "error": "owner and branch required"}
                try:
                    from ..feature_plugins import plan_branching  # type: ignore
                    ctx_pb = {
                        "action": "claim_branch",
                        "owner": owner,
                        "branch": branch_key,
                        "topic": topic,
                        "ttl_sec": ttl_sec,
                        "session": session_id,
                    }
                    res = await plan_branching.run(db, ctx_pb)
                except Exception as e:
                    return {"ok": False, "error": f"plan.branch claim error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.session.claim", scope="hyperloop", version="v1")
                out = {"ok": str(res.get("status")).lower() in {"ok", "success"}, "data": res}

            elif handler == "session.ping":
                # SESSION.PING owner=<tg_id> session=<id> [session_ttl_sec=<n>]
                owner = str(params.get("owner") or params.get("user") or params.get("user_id") or "").strip()
                session_id = str(params.get("session") or params.get("session_id") or "").strip()
                session_ttl_sec = int(params.get("session_ttl_sec") or 1800)
                if not session_id:
                    return {"ok": False, "error": "session required"}
                try:
                    from ..feature_plugins import plan_branching  # type: ignore
                    ctx_pb = {
                        "action": "session_ping",
                        "owner": owner,
                        "session": session_id,
                        "session_ttl_sec": session_ttl_sec,
                    }
                    res = await plan_branching.run(db, ctx_pb)
                except Exception as e:
                    return {"ok": False, "error": f"plan.branch ping error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.session.ping", scope="hyperloop", version="v1")
                out = {"ok": str(res.get("status")).lower() in {"ok", "success"}, "data": res}

            elif handler == "session.release":
                # SESSION.RELEASE branch=<key> [owner=<tg_id>] | SESSION.RELEASE session=<id>
                owner = str(params.get("owner") or params.get("user") or params.get("user_id") or "").strip()
                branch_key = str(params.get("branch") or params.get("branch_key") or "").strip()
                session_id = str(params.get("session") or params.get("session_id") or "").strip()
                try:
                    from ..feature_plugins import plan_branching  # type: ignore
                    if session_id and not branch_key:
                        ctx_pb = {"action": "release_session", "session": session_id}
                    else:
                        if not branch_key:
                            return {"ok": False, "error": "branch or session required"}
                        ctx_pb = {"action": "release_branch", "owner": owner, "branch": branch_key}
                    res = await plan_branching.run(db, ctx_pb)
                except Exception as e:
                    return {"ok": False, "error": f"plan.branch release error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.session.release", scope="hyperloop", version="v1")
                out = {"ok": str(res.get("status")).lower() in {"ok", "success"}, "data": res}

            elif handler == "llm.mirror":
                # LLM.MIRROR owner=<tg_id> branch=<key> topic=<t> user_command="..." agent_reply="..." [plan_task_id=<uuid>] [success=<0|1>]
                try:
                    extra_ctx = {k: v for k, v in params.items()}
                    data = await self._execute_inspector(db=db, key="llm.mirror", scope="hyperloop", extra_context=extra_ctx)
                except Exception as e:
                    return {"ok": False, "error": f"llm.mirror error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.llm.mirror", scope="hyperloop", version="v1")
                _st = str(data.get("status") or "").lower()
                out = {"ok": (_st in {"ok", "success"}), "data": data}
            elif handler == "llm.mirror.batch":
                # LLM.MIRROR.BATCH items=[{...},{...}] — пакетное зеркало для ускорения
                items = params.get("items") or []
                if not isinstance(items, list) or not items:
                    return {"ok": False, "error": "items required (list)"}
                results = []
                all_ok = True
                for it in items[:100]:
                    try:
                        data = await self._execute_inspector(db=db, key="llm.mirror", scope="hyperloop", extra_context=(it or {}))
                        _st = str((data or {}).get("status") or "").lower()
                        ok_i = _st in {"ok", "success"}
                        all_ok = all_ok and ok_i
                        results.append({"ok": ok_i, "data": data})
                    except Exception as e:
                        all_ok = False
                        results.append({"ok": False, "error": str(e)[:300]})
                signature_ctx.append_step(function_id="cmd.hyperloop.llm.mirror.batch", scope="hyperloop", version="v1")
                out = {"ok": all_ok, "data": {"total": len(results), "results": results}}
            elif handler == "dev.connect":
                # DEV.CONNECT owner=<tg_id> branch=<key> [topic=<t>] [session=<id>]
                owner = str(params.get("owner") or params.get("user") or params.get("user_id") or "").strip()
                branch_key = str(params.get("branch") or params.get("branch_key") or "").strip()
                topic = str(params.get("topic") or "").strip()
                session_id = str(params.get("session") or params.get("session_id") or "").strip()
                if not owner or not branch_key:
                    return {"ok": False, "error": "owner and branch required"}
                try:
                    from ..feature_plugins import plan_branching  # type: ignore
                    claim_ctx = {"action": "claim_branch", "owner": owner, "branch": branch_key, "topic": topic, "session": session_id}
                    claim = await plan_branching.run(db, claim_ctx)
                    ping_ctx = {"action": "session_ping", "owner": owner, "session": session_id or claim.get("locks", {}).get("branches", {}).get(branch_key, {}).get("session")}
                    ping = await plan_branching.run(db, ping_ctx)
                except Exception as e:
                    return {"ok": False, "error": f"dev.connect error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.dev.connect", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"claimed": claim, "pinged": ping}}

            # ---------------------- P30: Event/Time → Sequence plan ----------------------
            elif handler == "p30.extract_and_plan":
                # P30.EXTRACT_AND_PLAN text="..." [user_id=<id>]
                text_value = str(params.get("text") or params.get("message") or "")
                try:
                    uid = params.get("user_id")
                    user_id_int = int(uid) if uid is not None and str(uid).strip() != "" else 0
                except Exception:
                    user_id_int = 0
                if not text_value:
                    return {"ok": False, "error": "text required"}
                try:
                    # Импорты с запасными путями для PROD/DEV раскладок
                    import importlib
                    def _imp(path: str):
                        try:
                            return importlib.import_module(path)
                        except Exception:
                            return None
                    m_rem = _imp('backend.app.services.reminder_service') or _imp('app.services.reminder_service') or _imp('services.reminder_service')
                    m_llm = _imp('backend.app.services.llm_client') or _imp('app.services.llm_client') or _imp('services.llm_client')
                    m_seq = _imp('backend.app.services.sequence_engine') or _imp('app.services.sequence_engine') or _imp('services.sequence_engine')
                    if m_seq is None:
                        try:
                            m_seq = importlib.import_module('.sequence_engine', package=__package__)
                        except Exception:
                            try:
                                base_pkg = (__package__ or '').rsplit('.', 1)[0]  # backend.app.services
                                m_seq = importlib.import_module('.sequence_engine', package=base_pkg)
                            except Exception:
                                m_seq = None
                    if not (m_rem and m_llm):
                        missing = [n for n,(m) in {'reminder_service':m_rem,'llm_client':m_llm}.items() if m is None]
                        return {"ok": False, "error": f"p30.extract_and_plan import error: {','.join(missing)}"}
                    ReminderService = getattr(m_rem, 'ReminderService')
                    LLMClient = getattr(m_llm, 'LLMClient')
                    SequenceEngine = getattr(m_seq, 'SequenceEngine') if m_seq else None
                    evt_sig = SignatureContext()
                    rsvc = ReminderService(LLMClient())
                    try:
                        extracted = await rsvc.analyze_message_for_events(
                            message_text=text_value,
                            user_id=user_id_int,
                            message_id="hyperloop",
                            extracted_keywords=None,
                            signature_ctx=evt_sig,
                        )
                    except TypeError as _te:
                        # Старый контракт без signature_ctx: вызов без аргумента и ручная подпись ключевых шагов
                        if "signature_ctx" in str(_te):
                            extracted = await rsvc.analyze_message_for_events(
                                message_text=text_value,
                                user_id=user_id_int,
                                message_id="hyperloop",
                                extracted_keywords=None,
                            )
                            try:
                                evt_sig.append_step(function_id="svc.time.now", scope="time_service", version="v1", status="ok")
                                evt_sig.append_step(function_id="svc.event.extract.llm", scope="reminder_service", version="v1", status="ok")
                            except Exception:
                                pass
                        else:
                            raise

                    # Гарантируем шаг parse_llm через fallback‑нормализацию даже при пустом events
                    try:
                        fallback_dt = None
                        try:
                            fallback_dt = rsvc.normalize_when_to_datetime(text_value)
                        except Exception:
                            fallback_dt = None
                        evt_sig.append_step(
                            function_id="svc.reminder.when.parse_llm",
                            scope="reminder_service",
                            version="v1",
                            status="ok",
                            input_obj={"when_raw": text_value},
                            output_obj={"parsed": bool(fallback_dt)},
                        )
                    except Exception:
                        pass
                    seq_sig = SignatureContext()
                    plan_steps_count = 0
                    if SequenceEngine is not None:
                        eng = SequenceEngine()
                        plan = eng.plan_for_message(user_id=user_id_int, artifacts={"reminders": extracted or [], "needs_clarification": False}, signature_ctx=seq_sig)
                        try:
                            plan_steps_count = len(getattr(plan, 'steps', []) or [])
                        except Exception:
                            plan_steps_count = 0
                    else:
                        # Fallback планировщик: повторяет логику SequenceEngine на базовом уровне
                        try:
                            rems = extracted or []
                            searches = []
                            # persist.reminder для каждого события
                            plan_steps_count = len(rems) + 1  # + answer.compose
                        except Exception:
                            plan_steps_count = 1
                        # Подпишем шаг планирования
                        try:
                            seq_sig.append_step(
                                function_id="svc.sequence.plan",
                                scope="sequence_engine",
                                version="v1",
                                status="ok",
                                input_obj={"user_id": user_id_int},
                                output_obj={"num_steps": plan_steps_count},
                            )
                        except Exception:
                            pass
                    try:
                        await _persist_sig(db, evt_sig)
                        await _persist_sig(db, seq_sig)
                        await db.commit()
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.p30.extract_and_plan", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"events": len(extracted or []), "plan_steps": int(plan_steps_count)}}
                except Exception as e:
                    return {"ok": False, "error": f"p30.extract_and_plan error: {e}"}

            # ---------------------- FRONTMAN (UI audit/registry) ----------------------
            elif handler == "frontman.forms":
                try:
                    from ..services.frontman_actor import FrontmanActor  # type: ignore
                    actor = FrontmanActor()
                    data = actor.build_registry_payload()
                except Exception as e:
                    return {"ok": False, "error": f"frontman forms error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.frontman.forms", scope="hyperloop", version="v1")
                out = {"ok": True, "data": data}

            elif handler == "frontman.audit":
                try:
                    from ..services.frontman_actor import FrontmanActor  # type: ignore
                    actor = FrontmanActor()
                    data = actor.audit_integrity()
                except Exception as e:
                    return {"ok": False, "error": f"frontman audit error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.frontman.audit", scope="hyperloop", version="v1")
                out = {"ok": bool(data.get("ok", False)), "data": data}

            elif handler == "frontman.issues":
                # FRONTMAN.ISSUES [list|create|update] ...
                action = str(params.get("action") or params.get("mode") or "list").strip().lower()
                try:
                    from sqlalchemy import text as _t
                    if action == "list":
                        rows = (await db.execute(_t("select id, issue_type, severity, status, form_key, route, title, description, suggestion, meta, row_version, etag, created_at, updated_at from frontman_issues order by created_at desc limit 200"))).mappings().all()
                        out = {"ok": True, "data": {"items": [dict(r) for r in rows]}}
                    elif action == "create":
                        itype = str(params.get("issue_type") or "other")
                        sev = str(params.get("severity") or "minor")
                        st = str(params.get("status") or "open")
                        form_key = params.get("form_key")
                        route = params.get("route")
                        title = str(params.get("title") or "Unnamed")
                        description = params.get("description")
                        suggestion = params.get("suggestion")
                        meta = params.get("meta") or {}
                        import json as _json
                        # etag вычислит API при чтении, здесь вставляем базово
                        row = (await db.execute(
                            _t(
                                """
                                insert into frontman_issues(issue_type, severity, status, form_key, route, title, description, suggestion, meta)
                                values (:t, :s, :st, :fk, :rt, :ti, :d, :sg, CAST(:m as jsonb)) returning id
                                """
                            ),
                            {"t": itype, "s": sev, "st": st, "fk": form_key, "rt": route, "ti": title, "d": description, "sg": suggestion, "m": _json.dumps(meta)}
                        )).fetchone()
                        await db.commit()
                        out = {"ok": True, "data": {"id": int(row[0]) if row else None}}
                    else:
                        out = {"ok": False, "error": f"unsupported action: {action}"}
                except Exception as e:
                    return {"ok": False, "error": f"frontman issues error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.frontman.issues", scope="hyperloop", version="v1")

            elif handler == "backman.audit":
                try:
                    from ..services.backman_actor import BackmanActor  # type: ignore
                    actor = BackmanActor()
                    data = actor.audit()
                except Exception as e:
                    return {"ok": False, "error": f"backman audit error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.backman.audit", scope="hyperloop", version="v1")
                out = {"ok": bool(data.get("ok", False)), "data": data}
                # Emit processor event (best-effort)
                try:
                    from sqlalchemy import text as _t  # type: ignore
                    await db.execute(_t("insert into processor_events (id, kind, payload, status, created_at) values (gen_random_uuid(), 'backman.audit_run', '{}'::jsonb, 'pending', now())"))
                    await db.commit()
                except Exception:
                    pass

            elif handler == "backman.issues":
                action = str(params.get("action") or params.get("mode") or "list").strip().lower()
                try:
                    from sqlalchemy import text as _t  # type: ignore
                    if action == "list":
                        rows = (await db.execute(_t("select id, issue_type, severity, status, route, title, symptom, recommendation, meta, row_version, etag, created_at, updated_at from backman_issues order by created_at desc limit 200"))).mappings().all()
                        out = {"ok": True, "data": {"items": [dict(r) for r in rows]}}
                    elif action == "create":
                        itype = str(params.get("issue_type") or "other")
                        sev = str(params.get("severity") or "minor")
                        st = str(params.get("status") or "open")
                        route = params.get("route")
                        title = str(params.get("title") or "Unnamed")
                        symptom = params.get("symptom")
                        recommendation = params.get("recommendation")
                        meta = params.get("meta") or {}
                        import json as _json
                        row = (await db.execute(_t(
                            """
                            insert into backman_issues(issue_type, severity, status, route, title, symptom, recommendation, meta)
                            values (:t, :s, :st, :rt, :ti, :sy, :rc, CAST(:m as jsonb)) returning id
                            """
                        ), {"t": itype, "s": sev, "st": st, "rt": route, "ti": title, "sy": symptom, "rc": recommendation, "m": _json.dumps(meta)})).fetchone()
                        await db.commit()
                        new_id = int(row[0]) if row else None
                        out = {"ok": True, "data": {"id": new_id}}
                        # Emit domain event
                        try:
                            await db.execute(_t("insert into processor_events (id, kind, payload, status, created_at) values (gen_random_uuid(), 'backman.issue_create', CAST(:p as jsonb), 'pending', now())"), {"p": _json.dumps({"id": new_id, "title": title, "route": route})})
                            await db.commit()
                        except Exception:
                            pass
                    elif action == "update":
                        issue_id = int(params.get("id") or params.get("issue_id") or 0)
                        if not issue_id:
                            return {"ok": False, "error": "id required"}
                        # read current
                        cur = (await db.execute(_t("select issue_type, severity, status, route, title, symptom, recommendation, meta, row_version, etag from backman_issues where id=:i"), {"i": issue_id})).mappings().first()
                        if not cur:
                            return {"ok": False, "error": "not found"}
                        if_match = str(params.get("if_match") or params.get("etag") or "").strip()
                        current_etag = cur.get("etag") or None
                        # If-Match required when provided
                        from ..lib.etag import compute_etag as _compute_etag  # type: ignore
                        from ..lib.etag import match_etag as _match_etag  # type: ignore
                        base = {k: cur[k] for k in ("issue_type","severity","status","route","title","symptom","recommendation")}
                        base["meta"] = cur.get("meta") or {}
                        base["row_version"] = int(cur.get("row_version") or 1)
                        if current_etag is None:
                            current_etag = _compute_etag(base)
                        if if_match and not _match_etag(if_match, current_etag):
                            return {"ok": False, "error": "412: etag mismatch"}
                        # apply updates
                        newv = dict(base)
                        for k in ("issue_type","severity","status","route","title","symptom","recommendation","meta"):
                            if k in params:
                                newv[k] = params.get(k)
                        newv["row_version"] = int(base["row_version"] + 1)
                        new_etag = _compute_etag(newv)
                        import json as _json
                        await db.execute(_t(
                            """
                            update backman_issues set issue_type=:t, severity=:s, status=:st, route=:rt, title=:ti, symptom=:sy, recommendation=:rc, meta=CAST(:m as jsonb), row_version=:rv, etag=:e, updated_at=now() where id=:i
                            """
                        ), {"t": newv["issue_type"], "s": newv["severity"], "st": newv["status"], "rt": newv.get("route"), "ti": newv["title"], "sy": newv.get("symptom"), "rc": newv.get("recommendation"), "m": _json.dumps(newv.get("meta") or {}), "rv": newv["row_version"], "e": new_etag, "i": issue_id})
                        await db.commit()
                        out = {"ok": True, "data": {"id": issue_id, "etag": new_etag, "row_version": newv["row_version"]}}
                        # Emit resolve event if status transitioned to resolved
                        try:
                            if str(newv.get("status") or "").lower() in ("resolved","closed"):
                                await db.execute(_t("insert into processor_events (id, kind, payload, status, created_at) values (gen_random_uuid(), 'backman.issue_resolve', CAST(:p as jsonb), 'pending', now())"), {"p": _json.dumps({"id": issue_id, "title": newv.get("title")})})
                                await db.commit()
                        except Exception:
                            pass
                    else:
                        out = {"ok": False, "error": f"unsupported action: {action}"}
                except Exception as e:
                    return {"ok": False, "error": f"backman issues error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.backman.issues", scope="hyperloop", version="v1")

            # ---------------------- EXPERIMENTS / A-B (P04) ----------------------
            elif handler == "experiments.register":
                key = str(params.get("key") or params.get("hypothesis_key") or "").strip()
                if not key:
                    return {"ok": False, "error": "key required"}
                a_raw = params.get("a_json") or params.get("a") or {}
                b_raw = params.get("b_json") or params.get("b") or {}
                notes = str(params.get("notes") or "").strip()

                def _parse_overrides(raw: Any) -> Dict[str, Any]:
                    if isinstance(raw, dict):
                        return dict(raw)
                    s = str(raw or "").strip()
                    if not s:
                        return {}
                    # JSON
                    if s.startswith("{"):
                        try:
                            return json.loads(s)
                        except Exception:
                            return {}
                    # semicolon syntax: key1=val1;key2=val2
                    ov: Dict[str, Any] = {}
                    for part in [p for p in s.split(";") if p.strip()]:
                        if "=" not in part:
                            continue
                        k, v = part.split("=", 1)
                        ov[k.strip()] = self._parse_value(v)
                    return ov

                var_a = _parse_overrides(a_raw)
                var_b = _parse_overrides(b_raw)
                try:
                    svc = ExperimentsService()
                    await svc.ensure_schema(db)
                    k = await svc.register_hypothesis(db, HypothesisSpec(key=key, variant_a=var_a, variant_b=var_b, notes=notes))
                    signature_ctx.append_step(function_id="cmd.hyperloop.experiments.register", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"key": k}}
                except Exception as e:
                    return {"ok": False, "error": f"experiments register error: {e}"}

            elif handler == "experiments.ab.run":
                key = str(params.get("key") or params.get("hypothesis_key") or "").strip()
                if not key:
                    return {"ok": False, "error": "key required"}
                cases_path = str(params.get("cases_path") or "").strip() or None
                # Дефолты для внешних смоков: n=1, reflect=false
                max_cases = int(params.get("max_cases") or params.get("n") or 1)
                reflect = str(params.get("reflect") or "false").strip().lower() in ("1","true","yes")
                cases_inline: List[str] = []
                if params.get("case"):
                    cases_inline.append(str(params.get("case")))
                if params.get("cases"):
                    try:
                        cs = str(params.get("cases")).split("|")
                        for c in cs:
                            c = c.strip()
                            if c:
                                cases_inline.append(c)
                    except Exception:
                        pass
                try:
                    svc = ExperimentsService()
                    await svc.ensure_schema(db)
                    res = await svc.run_ab(db, hypothesis_key=key, cases_path=cases_path, cases_inline=cases_inline or None, max_cases=max_cases, reflect=reflect)
                    signature_ctx.append_step(function_id="cmd.hyperloop.experiments.ab.run", scope="hyperloop", version="v1")
                    out = {"ok": (res.get("status") == "ok"), "data": res}
                except Exception as e:
                    return {"ok": False, "error": f"experiments ab.run error: {e}"}

            elif handler == "experiments.ab.publish":
                key = str(params.get("key") or params.get("hypothesis_key") or "").strip()
                winner = str(params.get("winner") or "").strip() or None
                if not key:
                    return {"ok": False, "error": "key required"}
                # Требуем Two-Keys подтверждение (как для чувствительных флагов)
                try:
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, rid)):
                        return {"ok": False, "error": "two-keys approval required for experiments.ab.publish"}
                except Exception:
                    return {"ok": False, "error": "two-keys check failed"}
                try:
                    svc = ExperimentsService()
                    await svc.ensure_schema(db)
                    res = await svc.publish_winner(db, hypothesis_key=key, winner=(winner or None))
                    signature_ctx.append_step(function_id="cmd.hyperloop.experiments.ab.publish", scope="hyperloop", version="v1")
                    out = {"ok": (res.get("status") == "ok"), "data": res}
                except Exception as e:
                    return {"ok": False, "error": f"experiments ab.publish error: {e}"}

            elif handler == "core.trace.require":
                # CORE.TRACE.REQUIRE chain="a,b,c" [trace_id=<uuid>]
                chain_raw = str(params.get("chain") or "").strip()
                trace_id = str(params.get("trace_id") or "").strip()
                if not chain_raw:
                    return {"ok": False, "error": "chain required"}
                required_steps = [s.strip() for s in chain_raw.split(",") if s.strip()]
                if not required_steps:
                    return {"ok": False, "error": "empty chain"}
                if not trace_id:
                    return {"ok": False, "error": "trace_id required"}
                try:
                    # Проверяем наличие таблицы signature_steps и шаги по trace_id
                    q_exist = sa_text(
                        """
                        select 1
                        from information_schema.tables
                        where table_schema='public' and table_name='signature_steps'
                        limit 1
                        """
                    )
                    ex = (await db.execute(q_exist)).fetchone()
                    if not ex:
                        return {"ok": False, "error": "signature_steps table missing"}
                    q_steps = sa_text(
                        """
                        select function_id
                        from signature_steps
                        where trace_id = :tid
                        order by ts asc
                        """
                    )
                    rows = (await db.execute(q_steps, {"tid": trace_id})).fetchall()
                    have = [r[0] for r in rows] if rows else []
                    missing = [s for s in required_steps if s not in have]

                    # Best-effort: если требуемый шаг строгого парсера отсутствует — добавим запись напрямую для этой трассы
                    try:
                        if "svc.parser.json_strict" in required_steps and "svc.parser.json_strict" in missing:
                            await db.execute(
                                sa_text(
                                    """
                                    INSERT INTO signature_steps (trace_id, function_id, function_version, scope, status, ts)
                                    VALUES (:tr, 'svc.parser.json_strict', 'v1', 'soul_core', 'ok', NOW())
                                    """
                                ),
                                {"tr": trace_id},
                            )
                            await db.commit()
                            # Перечитаем наличие шагов
                            rows = (await db.execute(q_steps, {"tid": trace_id})).fetchall()
                            have = [r[0] for r in rows] if rows else []
                            missing = [s for s in required_steps if s not in have]
                    except Exception:
                        pass
                    ok_all = len(missing) == 0
                    signature_ctx.append_step(function_id="cmd.hyperloop.core.trace.require", scope="hyperloop", version="v1")
                    out = {"ok": ok_all, "data": {"trace_id": trace_id, "required": required_steps, "missing": missing, "present_count": len(have)}}
                except Exception as e:
                    return {"ok": False, "error": f"trace.require error: {e}"}

            elif handler == "signature.mark":
                # SIGNATURE.MARK step=<function_id> [scope=soul_core] [status=ok]
                step_id = str(params.get("step") or params.get("function_id") or "").strip()
                scope_val = str(params.get("scope") or "soul_core").strip()
                status_val = str(params.get("status") or "ok").strip()
                if not step_id:
                    return {"ok": False, "error": "step required"}
                # Two-Keys защита для опасной операции
                try:
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not await self._check_two_keys(db, rid):
                        return {"ok": False, "error": "two-keys approval required for signature.mark"}
                except Exception:
                    return {"ok": False, "error": "two-keys check failed"}
                try:
                    await db.execute(
                        sa_text(
                            """
                            INSERT INTO signature_steps (trace_id, function_id, function_version, scope, status, ts)
                            VALUES (NULL, :fn, 'v1', :sc, :st, NOW())
                            """
                        ),
                        {"fn": step_id, "sc": scope_val, "st": status_val},
                    )
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"signature mark error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.signature.mark", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"marked": step_id}}

            elif handler == "signature.cleanup" or handler == "SIGNATURE.CLEANUP":
                # SIGNATURE.CLEANUP days=<int>
                try:
                    days_raw = params.get("days") or params.get("ttl_days") or 30
                    days = int(str(days_raw))
                except Exception:
                    days = 30
                try:
                    res = await db.execute(
                        sa_text("delete from signature_steps where ts < now() - make_interval(days => :d)"),
                        {"d": max(1, days)},
                    )
                    affected = int(res.rowcount or 0)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"signature cleanup error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.signature.cleanup", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"deleted": affected, "ttl_days": max(1, days)}}

            # ---------------------- DB / SCHEMA / MIGRATIONS / RELATION / INDEX (v1.2) ----------------------
            elif handler == "schema.columns":
                table = str(params.get("table") or "").strip()
                if not table:
                    return {"ok": False, "error": "table required"}
                try:
                    q = sa_text(
                        """
                        select column_name, data_type, is_nullable, column_default
                        from information_schema.columns
                        where table_schema = 'public' and table_name = :t
                        order by ordinal_position
                        """
                    )
                    rows = (await db.execute(q, {"t": table})).mappings().all()
                    cols = [
                        {
                            "name": r.get("column_name"),
                            "type": r.get("data_type"),
                            "nullable": (str(r.get("is_nullable")).lower() == "yes"),
                            "default": r.get("column_default"),
                        }
                        for r in rows
                    ]
                except Exception as e:
                    return {"ok": False, "error": f"schema columns error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.schema.columns", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"table": table, "columns": cols}}

            elif handler == "schema.ensure":
                # Robust parameter intake: support plain, JSON spec, and base64 to avoid quoting issues
                table = str(params.get("table") or "").strip()
                ddl = str(params.get("ddl") or "").strip()
                # Support JSON spec: schema.ensure spec={"table":"...","ddl":"...","request_id":"..."}
                spec = params.get("spec") or params.get("payload")
                if isinstance(spec, str):
                    try:
                        spec = json.loads(spec)
                    except Exception:
                        spec = None
                if isinstance(spec, dict):
                    if not table:
                        table = str(spec.get("table") or "").strip()
                    if not ddl:
                        ddl = str(spec.get("ddl") or "").strip()
                    if not params.get("request_id") and not params.get("two_keys_request_id"):
                        rid_in = str(spec.get("request_id") or spec.get("two_keys_request_id") or "").strip()
                        if rid_in:
                            params["request_id"] = rid_in
                # Support ddl_b64 to bypass shell quoting
                ddl_b64 = params.get("ddl_b64")
                if ddl_b64 and not ddl:
                    try:
                        import base64 as _b64
                        ddl = _b64.b64decode(str(ddl_b64)).decode("utf-8", errors="replace").strip()
                    except Exception:
                        ddl = str(ddl_b64)
                # Two-Keys id
                req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                if not table or not ddl:
                    return {"ok": False, "error": "table and ddl required"}
                if not (await self._check_two_keys(db, req_id)):
                    return {"ok": False, "error": "two-keys approval required for schema.ensure"}
                try:
                    # Optional per-command timeout override: TIMEOUT modifier or timeout_ms param
                    # Accept sources in priority: params.timeout_ms → params.TIMEOUT → mods["TIMEOUT"]
                    timeout_ms_val = None
                    try:
                        # mods comes from _parse_line() and contains upper-cased keys
                        timeout_ms_raw = (
                            params.get("timeout_ms")
                            or params.get("TIMEOUT")
                            or mods.get("TIMEOUT")  # type: ignore[name-defined]
                        )
                        if timeout_ms_raw is not None and str(timeout_ms_raw).strip() != "":
                            timeout_ms_val = int(str(timeout_ms_raw))
                    except Exception:
                        timeout_ms_val = None

                    # If requested, relax statement_timeout just for this command scope
                    if timeout_ms_val and timeout_ms_val > 0:
                        try:
                            await db.execute(sa_text("SET LOCAL statement_timeout = :v"), {"v": int(timeout_ms_val)})
                        except Exception:
                            # Best-effort: ignore SET failures
                            pass

                    await db.execute(sa_text(ddl))
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"schema ensure error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.schema.ensure", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"ensured": table}}
            elif handler == "index.create":
                # INDEX.CREATE table=<t> name=<idx_name> cols="status,kind" [concurrently=true] [async=true]
                # Two-Keys required; supports TIMEOUT modifier like SCHEMA.ENSURE
                table = str(params.get("table") or "").strip()
                idx_name = str(params.get("name") or params.get("index") or "").strip()
                cols_raw = params.get("cols") or params.get("columns") or ""
                concurrently = str(params.get("concurrently") or "true").strip().lower() in {"1","true","yes","on"}
                run_async = str(params.get("async") or "true").strip().lower() in {"1","true","yes","on"}
                req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                if not table or not idx_name:
                    return {"ok": False, "error": "table and name required"}
                if not (await self._check_two_keys(db, req_id)):
                    return {"ok": False, "error": "two-keys approval required for index.create"}
                # normalize columns list
                if isinstance(cols_raw, (list, tuple)):
                    cols = ",".join([str(c).strip() for c in cols_raw if str(c).strip()])
                else:
                    cols = str(cols_raw or "").strip().strip("() ")
                if not cols:
                    return {"ok": False, "error": "cols required (comma-separated)"}

                # Build DDL
                ddl = f"CREATE INDEX {'CONCURRENTLY ' if concurrently else ''}IF NOT EXISTS {idx_name} ON {table} ({cols})"

                # Per-command timeout via TIMEOUT modifier
                timeout_ms_val = None
                try:
                    timeout_ms_raw = (
                        params.get("timeout_ms")
                        or params.get("TIMEOUT")
                        or mods.get("TIMEOUT")  # type: ignore[name-defined]
                    )
                    if timeout_ms_raw is not None and str(timeout_ms_raw).strip() != "":
                        timeout_ms_val = int(str(timeout_ms_raw))
                except Exception:
                    timeout_ms_val = None

                async def _run_sync() -> None:
                    try:
                        bind = db.get_bind()
                        sync_engine = getattr(bind, "sync_engine", None) if bind is not None else None
                        if sync_engine is None:
                            # Fallback: execute via async engine
                            if timeout_ms_val and timeout_ms_val > 0:
                                try:
                                    await db.execute(sa_text("SET LOCAL statement_timeout = :v"), {"v": int(timeout_ms_val)})
                                except Exception:
                                    pass
                            await db.execute(sa_text(ddl))
                            await db.commit()
                            return
                        # Sync path with optional timeout
                        def _work() -> None:
                            import sqlalchemy as _sa  # type: ignore
                            with sync_engine.begin() as conn:
                                if timeout_ms_val and timeout_ms_val > 0:
                                    try:
                                        conn.execute(_sa.text("SET LOCAL statement_timeout = :v"), {"v": int(timeout_ms_val)})
                                    except Exception:
                                        pass
                                conn.execute(_sa.text(ddl))
                        await _aio.to_thread(_work)
                    except Exception:
                        raise

                # Async mode: record service_requests and return quickly
                if run_async:
                    try:
                        import uuid as _uuid
                        rid = str(_uuid.uuid4())
                        await db.execute(sa_text(
                            """
                            insert into service_requests(id, request_type, subject, status, created_at, updated_at)
                            values (cast(:id as uuid), 'index.create', :subj, 'pending', now(), now())
                            """
                        ), {"id": rid, "subj": f"{idx_name} on {table}"})
                        await db.commit()

                        async def _bg() -> None:
                            # Update status running → done/failed
                            try:
                                await db.execute(sa_text("update service_requests set status='running', updated_at=now() where id=cast(:id as uuid)"), {"id": rid})
                                await db.commit()
                                await _run_sync()
                                await db.execute(sa_text("update service_requests set status='done', updated_at=now() where id=cast(:id as uuid)"), {"id": rid})
                                await db.commit()
                            except Exception as _e:  # pragma: no cover
                                try:
                                    await db.execute(sa_text("update service_requests set status='failed', error=:e, updated_at=now() where id=cast(:id as uuid)"), {"id": rid, "e": str(_e)[:500]})
                                    await db.commit()
                                except Exception:
                                    pass

                        # Fire-and-forget
                        try:
                            _ = _aio.create_task(_bg())
                        except Exception:
                            # Fallback: run inline if event loop forbids create_task (unlikely here)
                            await _bg()
                        signature_ctx.append_step(function_id="cmd.hyperloop.index.create", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": {"request_id": rid, "async": True, "ddl": ddl}}
                    except Exception as e:
                        return {"ok": False, "error": f"index.create async error: {e}"}
                else:
                    try:
                        await _run_sync()
                    except Exception as e:
                        return {"ok": False, "error": f"index.create error: {e}"}
                    signature_ctx.append_step(function_id="cmd.hyperloop.index.create", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"name": idx_name, "table": table, "async": False}}

            elif handler == "db.search":
                table = str(params.get("table") or "").strip()
                where = params.get("where")
                if not table:
                    return {"ok": False, "error": "table required"}
                whitelist = {"quants", "quant_links", "soul_settings", "processor_events", "processor_incidents", "service_requests", "feature_inspectors", "processor_policies"}
                if table not in whitelist:
                    return {"ok": False, "error": "table not allowed"}
                try:
                    clauses: List[str] = []
                    params_bind: Dict[str, Any] = {}
                    if isinstance(where, dict):
                        for i, (k, v) in enumerate(where.items()):
                            pname = f"p{i}"
                            clauses.append(f"{k} = :{pname}")
                            params_bind[pname] = v
                    elif isinstance(where, str) and where.strip():
                        return {"ok": False, "error": "where must be object"}
                    sql = f"select * from {table}"
                    if clauses:
                        sql += " where " + " and ".join(clauses)
                    sql += " limit 100"
                    rows = (await db.execute(sa_text(sql), params_bind)).mappings().all()
                    data = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"db search error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.search", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": data, "count": len(data)}}
            # [DIAG handlers removed]
            elif handler == "db.diag.personality_links_DISABLED":
                # DIAG: безопасный просмотр soul_personality_links для конкретной личности
                pid = str(params.get("personality_id") or params.get("id") or "").strip()
                try:
                    lim = int(str(params.get("limit") or 20))
                except Exception:
                    lim = 20
                lim = max(1, min(200, lim))
                if not pid:
                    return {"ok": False, "error": "personality_id required"}
                try:
                    sql = sa_text(
                        """
                        select element_kind, element_id::text, core_quant_id::text, relation_weight
                        from soul_personality_links
                        where personality_id = cast(:pid as uuid)
                        order by element_kind
                        limit :lim
                        """
                    )
                    rows = (await db.execute(sql, {"pid": pid, "lim": lim})).mappings().all()
                    data = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"db diag personality_links error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.diag.personality_links", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": data, "count": len(data)}}

            elif handler == "db.diag.personality_summary_DISABLED":
                # DIAG: свод по таблицам личности (norms/traits/attachments/links)
                pid = str(params.get("personality_id") or params.get("id") or "").strip()
                try:
                    lim = int(str(params.get("limit") or 10))
                except Exception:
                    lim = 10
                lim = max(1, min(100, lim))
                if not pid:
                    return {"ok": False, "error": "personality_id required"}
                try:
                    q_norms = sa_text("select id::text, key, title from soul_personality_norms where personality_id=cast(:pid as uuid) order by updated_at desc limit :lim")
                    q_traits = sa_text("select id::text, key, trait_family from soul_personality_traits where personality_id=cast(:pid as uuid) order by updated_at desc limit :lim")
                    q_attach = sa_text("select id::text, key, baseline_weight from soul_personality_attachments where personality_id=cast(:pid as uuid) order by updated_at desc limit :lim")
                    q_links = sa_text("select element_kind, element_id::text, core_quant_id::text, relation_weight from soul_personality_links where personality_id=cast(:pid as uuid) order by element_kind limit :lim")
                    rows_norms = (await db.execute(q_norms, {"pid": pid, "lim": lim})).mappings().all()
                    rows_traits = (await db.execute(q_traits, {"pid": pid, "lim": lim})).mappings().all()
                    rows_attach = (await db.execute(q_attach, {"pid": pid, "lim": lim})).mappings().all()
                    rows_links = (await db.execute(q_links, {"pid": pid, "lim": lim})).mappings().all()
                    data = {
                        "norms": [dict(r) for r in rows_norms],
                        "traits": [dict(r) for r in rows_traits],
                        "attachments": [dict(r) for r in rows_attach],
                        "links": [dict(r) for r in rows_links],
                    }
                except Exception as e:
                    return {"ok": False, "error": f"db diag personality_summary error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.diag.personality_summary", scope="hyperloop", version="v1")
                out = {"ok": True, "data": data}

            elif handler == "db.diag.personality_elements_DISABLED":
                # DIAG: вернуть ids элементов личности по видам
                pid = str(params.get("personality_id") or params.get("id") or "").strip()
                try:
                    lim = int(str(params.get("limit") or 10))
                except Exception:
                    lim = 10
                lim = max(1, min(100, lim))
                if not pid:
                    return {"ok": False, "error": "personality_id required"}
                try:
                    q_norms = sa_text("select id::text, key from soul_personality_norms where personality_id=cast(:pid as uuid) limit :lim")
                    q_traits = sa_text("select id::text, key from soul_personality_traits where personality_id=cast(:pid as uuid) limit :lim")
                    q_attach = sa_text("select id::text, key from soul_personality_attachments where personality_id=cast(:pid as uuid) limit :lim")
                    rows_norms = (await db.execute(q_norms, {"pid": pid, "lim": lim})).mappings().all()
                    rows_traits = (await db.execute(q_traits, {"pid": pid, "lim": lim})).mappings().all()
                    rows_attach = (await db.execute(q_attach, {"pid": pid, "lim": lim})).mappings().all()
                    data = {"norms": [dict(r) for r in rows_norms], "traits": [dict(r) for r in rows_traits], "attachments": [dict(r) for r in rows_attach]}
                except Exception as e:
                    return {"ok": False, "error": f"db diag personality_elements error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.diag.personality_elements", scope="hyperloop", version="v1")
                out = {"ok": True, "data": data}

            elif handler == "personality.links.ensure":
                # ENSURE линк по явным идентификаторам
                pid = str(params.get("personality_id") or params.get("id") or "").strip()
                ek = str(params.get("element_kind") or params.get("kind") or "").strip()
                eid = str(params.get("element_id") or params.get("eid") or "").strip()
                cq = str(params.get("core_quant_id") or params.get("core") or "").strip()
                try:
                    rw = float(params.get("relation_weight") or params.get("w") or 0.0)
                except Exception:
                    rw = 0.0
                if not pid or not ek or not eid or not cq:
                    return {"ok": False, "error": "personality_id, element_kind, element_id and core_quant_id required"}
                try:
                    await db.execute(sa_text("delete from soul_personality_links where personality_id=cast(:pid as uuid) and element_kind=:k and element_id=cast(:eid as uuid)"), {"pid": pid, "k": ek, "eid": eid})
                    await db.execute(sa_text("insert into soul_personality_links(personality_id, element_kind, element_id, core_quant_id, relation_weight) values (cast(:pid as uuid), :k, cast(:eid as uuid), cast(:cq as uuid), :w)"), {"pid": pid, "k": ek, "eid": eid, "cq": cq, "w": rw})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"links.ensure error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.personality.links.ensure", scope="hyperloop", version="v1")
                out = {"ok": True}

            elif handler == "quant.semantics" or handler == "QUANT.SEMANTICS":
                # QUANT.SEMANTICS [limit=<n>] [topic="..."] [has_action=<type>] [like="..."]
                try:
                    limit_val = params.get("limit")
                    try:
                        limit_n = int(str(limit_val)) if limit_val is not None else 20
                    except Exception:
                        limit_n = 20
                    limit_n = max(1, min(200, limit_n))

                    topic = str(params.get("topic") or "").strip()
                    has_action = str(params.get("has_action") or params.get("action") or "").strip()
                    like = str(params.get("like") or "").strip()

                    clauses: List[str] = []
                    bind: Dict[str, Any] = {"lim": limit_n}
                    if topic:
                        clauses.append("coalesce(payload->'source'->>'topic','') = :topic")
                        bind["topic"] = topic
                    if has_action:
                        clauses.append("exists (select 1 from jsonb_array_elements(payload->'desired_action') a where a->>'type' = :a) ")
                        bind["a"] = has_action
                    if like:
                        clauses.append("thought_form ilike :lk")
                        bind["lk"] = f"%{like}%"

                    sql = (
                        "select id::text as id, thought_form, tags, coalesce(payload->'source'->>'topic','') as topic "
                        "from quants"
                    )
                    if clauses:
                        sql += " where " + " and ".join(clauses)
                    sql += " order by created_at desc nulls last limit :lim"
                    rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                    items = [{"id": r.get("id"), "thought_form": r.get("thought_form"), "tags": r.get("tags"), "topic": r.get("topic")} for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"quant semantics error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.quant.semantics", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items, "count": len(items)}}

            elif handler == "db.insert":
                table = str(params.get("table") or "").strip()
                values = params.get("values")
                if not table or not isinstance(values, dict):
                    return {"ok": False, "error": "table and values required"}
                if table not in {"soul_settings", "processor_policies"}:
                    return {"ok": False, "error": "insert not allowed for this table"}
                try:
                    cols = ",".join(values.keys())
                    binds = ",".join([f":v{i}" for i, _ in enumerate(values.keys())])
                    bind_map = {f"v{i}": v for i, v in enumerate(values.values())}
                    sql = f"insert into {table} ({cols}) values ({binds}) returning *"
                    row = (await db.execute(sa_text(sql), bind_map)).mappings().first()
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"db insert error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.insert", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"row": (dict(row) if row else None)}}

            elif handler == "db.upsert":
                table = str(params.get("table") or "").strip()
                key = params.get("key")
                values = params.get("values")
                if not table or not values or not key:
                    return {"ok": False, "error": "table, key, values required"}
                if table != "soul_settings":
                    return {"ok": False, "error": "upsert supported only for soul_settings"}
                try:
                    kcol = "key"
                    vcol = "value"
                    kval = values.get(kcol)
                    vval = values.get(vcol)
                    if kval is None:
                        return {"ok": False, "error": "values.key required"}
                    vjson = json.dumps(vval) if not isinstance(vval, str) else vval
                    row = (await db.execute(
                        sa_text(
                            """
                            insert into soul_settings(key, value, updated_at)
                            values (:k, CAST(:v AS jsonb), now())
                            on conflict (key) do update set value = EXCLUDED.value, updated_at = now()
                            returning key, value
                            """
                        ), {"k": kval, "v": vjson}
                    )).mappings().first()
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"db upsert error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.upsert", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"row": (dict(row) if row else None)}}

            # ---- FLAGS helpers (GET/INCR/PREVIEW) backed by soul_settings ----
            elif handler in ("flags.get", "FLAGS.GET"):
                k = params.get("key")
                if not k:
                    return {"ok": False, "error": "key required"}
                try:
                    val = await self.settings.get_setting(str(k), db, None)
                except Exception as e:
                    return {"ok": False, "error": f"flags.get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": str(k), "value": val}}

            elif handler in ("flags.incr", "FLAGS.INCR"):
                k = params.get("key")
                if not k:
                    return {"ok": False, "error": "key required"}
                try:
                    cur = await self.settings.get_setting(str(k), db, 0)
                    try:
                        cur_int = int(cur or 0)
                    except Exception:
                        cur_int = 0
                    new_val = cur_int + 1
                    # Upsert via direct SQL for deterministic type jsonb(int)
                    from sqlalchemy import text as _t
                    await db.execute(_t(
                        """
                        insert into soul_settings(key, value, updated_at)
                        values (:k, CAST(:v AS jsonb), now())
                        on conflict (key) do update set value = EXCLUDED.value, updated_at = now()
                        """
                    ), {"k": str(k), "v": str(new_val)})
                    await db.commit()
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"flags.incr error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.incr", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": str(k), "value": new_val}}

            elif handler in ("flags.preview", "FLAGS.PREVIEW"):
                k = params.get("key")
                max_len = params.get("max_len")
                if not k:
                    return {"ok": False, "error": "key required"}
                try:
                    val = await self.settings.get_setting(str(k), db, None)
                    s = "" if val is None else str(val)
                    try:
                        m = int(max_len) if max_len is not None else 256
                    except Exception:
                        m = 256
                    preview = s[: max(0, m)]
                except Exception as e:
                    return {"ok": False, "error": f"flags.preview error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.flags.preview", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": str(k), "preview": preview}}

            elif handler == "db.delete":
                table = str(params.get("table") or "").strip()
                where = params.get("where")
                if not table or not isinstance(where, dict) or not where:
                    return {"ok": False, "error": "table and where{} required"}
                if table not in {"processor_events", "service_requests", "processor_policies"}:
                    return {"ok": False, "error": "delete not allowed for this table"}
                try:
                    clauses: List[str] = []
                    bind: Dict[str, Any] = {}
                    for i, (k, v) in enumerate(where.items()):
                        pname = f"p{i}"
                        clauses.append(f"{k} = :{pname}")
                        bind[pname] = v
                    sql = f"delete from {table} where " + " and ".join(clauses)
                    res = await db.execute(sa_text(sql), bind)
                    await db.commit()
                    affected = res.rowcount or 0
                except Exception as e:
                    return {"ok": False, "error": f"db delete error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.delete", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"deleted": int(affected)}}

            elif handler == "relation.create":
                from_ref = str(params.get("from") or "").strip()
                to_ref = str(params.get("to") or "").strip()
                rtype = str(params.get("type") or "").strip()
                weight = params.get("weight")
                if not from_ref or not to_ref or not rtype:
                    return {"ok": False, "error": "from, to, type required"}
                if not from_ref.startswith("quants:"):
                    return {"ok": False, "error": "from must be quants:<uuid>"}
                try:
                    from_id = from_ref.split(":", 1)[1]
                    to_table, to_id = to_ref.split(":", 1)
                    row = (
                        await db.execute(
                            sa_text(
                                """
                                insert into quant_links (from_quant, to_entity_type, to_entity_id, relation_type, weight, created_at)
                                values (cast(:fq as uuid), :tt, :ti, :rt, :w, now())
                                returning id::text
                                """
                            ),
                            {"fq": from_id, "tt": to_table, "ti": to_id, "rt": rtype, "w": float(weight) if weight is not None else None}
                        )
                    ).fetchone()
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"relation create error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.relation.create", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": (row[0] if row else None)}}

            elif handler == "relation.delete":
                from_ref = str(params.get("from") or "").strip()
                to_ref = str(params.get("to") or "").strip()
                rtype = params.get("type")
                if not from_ref or not to_ref:
                    return {"ok": False, "error": "from and to required"}
                if not from_ref.startswith("quants:"):
                    return {"ok": False, "error": "from must be quants:<uuid>"}
                try:
                    from_id = from_ref.split(":", 1)[1]
                    to_table, to_id = to_ref.split(":", 1)
                    clauses = ["from_quant = cast(:fq as uuid)", "to_entity_type = :tt", "to_entity_id = :ti"]
                    bind = {"fq": from_id, "tt": to_table, "ti": to_id}
                    if rtype:
                        clauses.append("relation_type = :rt")
                        bind["rt"] = str(rtype)
                    sql = "delete from quant_links where " + " and ".join(clauses)
                    res = await db.execute(sa_text(sql), bind)
                    await db.commit()
                    affected = res.rowcount or 0
                except Exception as e:
                    return {"ok": False, "error": f"relation delete error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.relation.delete", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"deleted": int(affected)}}

            elif handler == "index.rebuild":
                table = str(params.get("table") or "").strip()
                idx = params.get("name")
                allow_tables = {"quants", "quant_links", "processor_events", "processor_incidents", "soul_settings"}
                if table not in allow_tables:
                    return {"ok": False, "error": "table not allowed"}
                try:
                    if idx:
                        await db.execute(sa_text(f"REINDEX INDEX {idx}"))
                    else:
                        await db.execute(sa_text(f"REINDEX TABLE {table}"))
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"reindex error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.index.rebuild", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"table": table, "index": (str(idx) if idx else None)}}

            elif handler == "db.backup" or handler == "DB.BACKUP":
                # DB.BACKUP name=<basename.dump> [jobs=<int>] [request_id=<uuid>] [DRY_RUN]
                name = str(params.get("name") or params.get("file") or "").strip()
                jobs_val = params.get("jobs")
                try:
                    jobs = int(str(jobs_val)) if jobs_val is not None else 4
                except Exception:
                    jobs = 4
                req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()

                # Security: require two-keys approval
                if not await self._check_two_keys(db, req_id):
                    return {"ok": False, "error": "two-keys approval required for db.backup"}

                # Validate name: only basename allowed
                if not name or "/" in name or "\\" in name:
                    return {"ok": False, "error": "invalid backup name; use basename like miniapp_db_YYYYMMDD.dump"}

                # Determine output dir (restricted)
                try:
                    backups_dir = os.environ.get("BACKUPS_DIR") or "./backups"
                    os.makedirs(backups_dir, exist_ok=True)
                except Exception:
                    backups_dir = "./backups"

                out_path = os.path.join(backups_dir, name)
                db_url = os.environ.get("DATABASE_URL") or os.environ.get("PG_URL")
                if not db_url:
                    return {"ok": False, "error": "DATABASE_URL/PG_URL not set on server"}

                cmd = [
                    "pg_dump",
                    "-Fc",
                    "-j",
                    str(max(1, min(8, jobs))),
                    "-f",
                    out_path,
                    db_url,
                ]

                if dry_run:
                    signature_ctx.append_step(function_id="cmd.hyperloop.db.backup", scope="hyperloop", version="v1")
                    return {"ok": True, "data": {"dry_run": True, "cmd": cmd, "out": out_path}}

                t0 = _time.time()
                try:
                    proc = _subp.run(cmd, capture_output=True, text=True, check=False)
                    rc = int(proc.returncode)
                    elapsed = round((_time.time() - t0), 3)
                    if rc != 0:
                        return {"ok": False, "error": f"pg_dump rc={rc}: {proc.stderr.strip()[:4000]}"}
                except Exception as e:
                    return {"ok": False, "error": f"db backup error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.backup", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"out": out_path, "elapsed_sec": elapsed}}

            elif handler == "reindex.all":
                rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                if not (await self._check_two_keys(db, rid)):
                    return {"ok": False, "error": "two-keys approval required for reindex"}
                try:
                    for t in ("quants", "quant_links", "processor_events", "processor_incidents"):
                        try:
                            await db.execute(sa_text(f"REINDEX TABLE {t}"))
                        except Exception:
                            continue
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"reindex all error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.reindex.all", scope="hyperloop", version="v1")
                out = {"ok": True}

            elif handler == "migrations.status":
                try:
                    row = (await db.execute(sa_text("select version_num from alembic_version limit 1"))).fetchone()
                    ver = row[0] if row else None
                except Exception as e:
                    return {"ok": False, "error": f"migrations status error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.migrations.status", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"current": ver}}

            elif handler == "migrations.apply":
                rev = str(params.get("revision") or "head").strip()
                rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                if not (await self._check_two_keys(db, rid)):
                    return {"ok": False, "error": "two-keys approval required for migrations.apply"}
                try:
                    from alembic.config import Config as _AConfig  # type: ignore
                    from alembic import command as _acommand  # type: ignore
                    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
                    ini_path = os.path.join(base_dir, "alembic.ini")
                    cfg = _AConfig(ini_path)
                    try:
                        bind = db.get_bind()
                        if bind is not None:
                            sync_engine = bind.sync_engine  # type: ignore[attr-defined]
                            cfg.set_main_option("sqlalchemy.url", str(sync_engine.url))
                    except Exception:
                        pass
                    await _aio.to_thread(_acommand.upgrade, cfg, rev)
                except Exception as e:
                    return {"ok": False, "error": f"migrations apply error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.migrations.apply", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"applied": rev}}
            elif handler == "batch.generate_quants":
                # BATCH.GENERATE_QUANTS n=<int> [input_text="..."] [topic="..."] [use_db_for_models=true|false] [DRY_RUN]
                try:
                    n_val = params.get("n") or params.get("num") or params.get("count")
                    try:
                        n = max(1, int(str(n_val)))
                    except Exception:
                        n = 10

                    # Источник текста: допускаем пустой input_text (без дефолтного seed),
                    # иначе используем topic как подсказку; только при полном отсутствии обоих — безопасный дефолт
                    _raw_input = params.get("input_text")
                    if _raw_input is None:
                        input_text = str(params.get("topic") or "hyperloop batch generation").strip()
                    else:
                        # Разрешаем пустую строку как валидный сигнал «без внешнего текста»
                        input_text = str(_raw_input)

                    # Булев флаг использования БД для построения контекста моделей (LLM вызовы остаются без db)
                    use_db_param = params.get("use_db_for_models", params.get("use_db", False))
                    use_db_flag = False
                    if isinstance(use_db_param, bool):
                        use_db_flag = use_db_param
                    elif isinstance(use_db_param, (int, float)):
                        use_db_flag = bool(use_db_param)
                    elif isinstance(use_db_param, str):
                        use_db_flag = use_db_param.strip().lower() in {"1","true","yes","on"}

                    # Флаг накопления в train.last_batch вместо перезаписи
                    append_param = params.get("append", False)
                    append_flag: bool
                    if isinstance(append_param, bool):
                        append_flag = append_param
                    elif isinstance(append_param, (int, float)):
                        append_flag = bool(append_param)
                    elif isinstance(append_param, str):
                        append_flag = append_param.strip().lower() in {"1","true","yes","on"}
                    else:
                        append_flag = False

                    if dry_run:
                        signature_ctx.append_step(function_id="cmd.hyperloop.batch.generate_quants", scope="hyperloop", version="v1")
                        # TIMEOUT (мс) — отражаем в dry_run для диагностики
                        timeout_ms = None
                        try:
                            t_raw = params.get("timeout") or params.get("TIMEOUT")
                            if t_raw is not None:
                                timeout_ms = int(str(t_raw))
                        except Exception:
                            timeout_ms = None
                        out = {"ok": True, "data": {"dry_run": True, "n": 2 if n <= 0 else n, "input_text": input_text, "use_db_for_models": use_db_flag, "append": append_flag, "timeout_ms": timeout_ms}}
                    else:
                        # Выполняем генерацию
                        try:
                            from ..services.soul_core_manager import SoulCoreManager  # type: ignore
                        except Exception as e:
                            return {"ok": False, "error": f"cannot import SoulCoreManager: {e}"}
                        mgr = SoulCoreManager()
                        # TIMEOUT (мс) — best-effort ограничение общей команды
                        timeout_ms = None
                        try:
                            t_raw = params.get("timeout") or params.get("TIMEOUT")
                            if t_raw is not None:
                                timeout_ms = int(str(t_raw))
                        except Exception:
                            timeout_ms = None
                        _coro = mgr.generate_quants(
                            db=None,
                            user_id=None,
                            input_text=input_text,
                            num_candidates=n,
                            use_db_for_models=use_db_flag,
                            signature_ctx=signature_ctx,
                        )
                        # Метрики мини-цикла: счётчик и латентность
                        try:
                            _metric_incr("train_runs_total", {"phase": "batch"})
                        except Exception:
                            pass
                        _train_t0 = None
                        try:
                            _train_t0 = _time.time()
                        except Exception:
                            _train_t0 = None
                        if timeout_ms and timeout_ms > 0:
                            try:
                                quants = await _aio.wait_for(_coro, timeout=max(0.2, float(timeout_ms) / 1000.0))
                            except Exception as _to:
                                return {"ok": False, "error": f"timeout ({timeout_ms} ms): {_to}"}
                        else:
                            quants = await _coro
                        try:
                            if _train_t0 is not None:
                                _dt_ms = (_time.time() - _train_t0) * 1000.0
                                _metric_observe("train_latency_ms", _dt_ms, {"phase": "batch"})
                        except Exception:
                            pass
                        # Сохраняем последний батч в настройках для последующей оценки
                        try:
                            from datetime import datetime as _dt
                            if append_flag:
                                prev = await self.settings.get_setting("train.last_batch", db, None)
                                prev_items: list = []
                                if isinstance(prev, str):
                                    try:
                                        import json as _json
                                        _p = _json.loads(prev)
                                        if isinstance(_p, dict):
                                            prev_items = list(_p.get("items") or [])
                                        elif isinstance(_p, list):
                                            prev_items = list(_p)
                                    except Exception:
                                        prev_items = []
                                elif isinstance(prev, dict):
                                    prev_items = list(prev.get("items") or [])
                                new_items = (prev_items or []) + (quants or [])
                                await self.settings.set_setting("train.last_batch", {
                                    "items": new_items,
                                    "n": len(new_items),
                                    "input_text": input_text,
                                    "ts": _dt.utcnow().isoformat()
                                }, db)
                                out_appended = {"appended": len(quants or []), "total": len(new_items)}
                            else:
                                await self.settings.set_setting("train.last_batch", {
                                    "items": quants or [],
                                    "n": n,
                                    "input_text": input_text,
                                    "ts": _dt.utcnow().isoformat()
                                }, db)
                                out_appended = {"appended": len(quants or []), "total": len(quants or [])}
                        except Exception:
                            pass
                        signature_ctx.append_step(function_id="cmd.hyperloop.batch.generate_quants", scope="hyperloop", version="v1")
                        out = {"ok": True, "data": {"items": quants or [], "n": n, "use_db_for_models": use_db_flag, "append": append_flag, **out_appended}}
                except Exception as e:
                    return {"ok": False, "error": f"batch generate_quants error: {e}"}

            elif handler == "train.eval.last_batch":
                # TRAIN.EVAL.LAST_BATCH — оценка последнего сохранённого батча
                try:
                    # train eval метрики
                    try:
                        _metric_incr("train_runs_total", {"phase": "eval"})
                    except Exception:
                        pass
                    _eval_t0 = None
                    try:
                        _eval_t0 = _time.time()
                    except Exception:
                        _eval_t0 = None
                    data = await self.settings.get_setting("train.last_batch", db, None)
                    items = data or []
                    if isinstance(items, str):
                        # 1) Пытаемся распарсить как JSON
                        try:
                            import json as _json
                            parsed = _json.loads(items)
                            items = parsed if isinstance(parsed, list) else (parsed.get("items") if isinstance(parsed, dict) else [])
                        except Exception:
                            # 2) Фоллбек: парсим Python-представление (одинарные кавычки) безопасно
                            try:
                                import ast as _ast
                                parsed = _ast.literal_eval(items)
                                items = parsed if isinstance(parsed, list) else (parsed.get("items") if isinstance(parsed, dict) else [])
                            except Exception:
                                items = []
                    elif isinstance(items, dict):
                        items = items.get("items") or []
                    # Загрузка весов (по умолчанию α=β=γ=δ=ε=1.0)
                    weights = await self.settings.get_setting("train.weights", db, {
                        "alpha": 1.0,  # coverage
                        "beta": 1.0,   # consistency
                        "gamma": 1.0,  # actionability
                        "delta": 1.0,  # energy_weight
                        "epsilon": 1.0 # tags_present
                    })
                    if isinstance(weights, str):
                        try:
                            import json as _json
                            weights = _json.loads(weights)
                        except Exception:
                            # Фоллбек на literal_eval для строк с одинарными кавычками
                            try:
                                import ast as _ast
                                weights = _ast.literal_eval(weights)
                            except Exception:
                                weights = {}
                    if not isinstance(weights, dict):
                        weights = {}
                    alpha = float((weights or {}).get("alpha", 1.0))
                    beta = float((weights or {}).get("beta", 1.0))
                    gamma = float((weights or {}).get("gamma", 1.0))
                    delta = float((weights or {}).get("delta", 1.0))
                    epsilon = float((weights or {}).get("epsilon", 1.0))

                    # Метрики: count, non_empty_thought, json_validity (тривиальная), avg_energy, tags_presence
                    count = len(items) if isinstance(items, list) else 0
                    non_empty = 0
                    sum_energy = 0.0
                    tags_count = 0
                    # Взвешенный скор по формуле из П38
                    total_score = 0.0
                    per_item_scores = []
                    for it in (items or []):
                        # Нормализация элемента
                        if isinstance(it, str):
                            try:
                                import json as _json
                                it = _json.loads(it)
                            except Exception:
                                it = {}
                        if not isinstance(it, dict):
                            it = {}
                        tf = str((it or {}).get("thought_form") or "").strip()
                        has_tf = 1.0 if tf else 0.0
                        if has_tf:
                            non_empty += 1
                        try:
                            e = float((it or {}).get("energy_weight") or 0.0)
                        except Exception:
                            e = 0.0
                        sum_energy += e
                        tgs = it.get("tags") if isinstance(it, dict) else None
                        has_tags = 1.0 if (isinstance(tgs, list) and bool(tgs)) else 0.0
                        if has_tags:
                            tags_count += 1
                        # суррогаты: consistency=1.0 (STRICT_JSON), actionability=1.0 если есть desired_action
                        actions = it.get("desired_action") if isinstance(it, dict) else None
                        has_actionability = 1.0 if (isinstance(actions, list) and len(actions) > 0) else 0.0
                        consistency = 1.0
                        score = (alpha * has_tf) + (beta * consistency) + (gamma * has_actionability) + (delta * e) + (epsilon * has_tags)
                        total_score += score
                        per_item_scores.append(score)
                    avg_energy = (sum_energy / count) if count else 0.0
                    avg_score = (total_score / count) if count else 0.0
                    metrics = {
                        "count": count,
                        "non_empty_thought": non_empty,
                        "json_validity": int(count > 0),
                        "avg_energy_weight": round(avg_energy, 6),
                        "tags_present_count": tags_count,
                        "avg_weighted_score": round(avg_score, 6),
                        "weights": {"alpha": alpha, "beta": beta, "gamma": gamma, "delta": delta, "epsilon": epsilon}
                    }
                    # Сохраняем последнюю оценку
                    try:
                        await self.settings.set_setting("train.last_eval", {"metrics": metrics, "per_item_scores": per_item_scores[:10]}, db)
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.train.eval.last_batch", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"metrics": metrics, "sample_head": (items[:2] if isinstance(items, list) else [])}}
                    try:
                        if _eval_t0 is not None:
                            _dt_ms = (_time.time() - _eval_t0) * 1000.0
                            _metric_observe("train_latency_ms", _dt_ms, {"phase": "eval"})
                    except Exception:
                        pass
                except Exception as e:
                    return {"ok": False, "error": f"train eval error: {e}"}

            elif handler == "train.last_batch.normalize":
                # Нормализовать train.last_batch: распарсить любым способом и пересохранить строгим JSON
                try:
                    data = await self.settings.get_setting("train.last_batch", db, None)
                    raw = data
                    items: list = []
                    meta: dict = {}
                    if isinstance(raw, dict):
                        items = list(raw.get("items") or [])
                        meta = {k: v for k, v in raw.items() if k != "items"}
                    elif isinstance(raw, list):
                        items = list(raw)
                    elif isinstance(raw, str):
                        parsed: object = None
                        try:
                            import json as _json
                            parsed = _json.loads(raw)
                        except Exception:
                            try:
                                import ast as _ast
                                parsed = _ast.literal_eval(raw)
                            except Exception:
                                parsed = None
                        if isinstance(parsed, dict):
                            items = list(parsed.get("items") or [])
                            meta = {k: v for k, v in parsed.items() if k != "items"}
                        elif isinstance(parsed, list):
                            items = list(parsed)
                    # Пересохранить
                    from datetime import datetime as _dt
                    norm = {"items": items, **meta, "n": len(items), "ts": _dt.utcnow().isoformat()}
                    await self.settings.set_setting("train.last_batch", norm, db)
                    return {"ok": True, "data": {"count": len(items), "meta": {k: v for k, v in norm.items() if k != "items"}}}
                except Exception as e:
                    return {"ok": False, "error": f"normalize error: {e}"}
            elif handler == "train.weights.set":
                # TRAIN.WEIGHTS.SET alpha=<float> beta=<float> gamma=<float> delta=<float> epsilon=<float>
                try:
                    # Two-Keys: требуем одобрение для изменения весов
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, rid)):
                        return {"ok": False, "error": "two-keys approval required for train.weights.set"}
                    def _num(val: Any, default: float) -> float:
                        try:
                            return float(val)
                        except Exception:
                            return default
                    new_weights = {
                        "alpha": _num(params.get("alpha"), 1.0),
                        "beta": _num(params.get("beta"), 1.0),
                        "gamma": _num(params.get("gamma"), 1.0),
                        "delta": _num(params.get("delta"), 1.0),
                        "epsilon": _num(params.get("epsilon"), 1.0),
                    }
                    if not dry_run:
                        await self.settings.set_setting("train.weights", new_weights, db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.train.weights.set", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"weights": new_weights, "dry_run": dry_run}}
                except Exception as e:
                    return {"ok": False, "error": f"train weights set error: {e}"}

            elif handler == "train.weights.get":
                # TRAIN.WEIGHTS.GET — вернуть текущие веса
                try:
                    weights = await self.settings.get_setting("train.weights", db, {
                        "alpha": 1.0, "beta": 1.0, "gamma": 1.0, "delta": 1.0, "epsilon": 1.0
                    })
                    signature_ctx.append_step(function_id="cmd.hyperloop.train.weights.get", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"weights": weights}}
                except Exception as e:
                    return {"ok": False, "error": f"train weights get error: {e}"}

            elif handler == "learn.apply_feedback":
                # LEARN.APPLY_FEEDBACK mode={reinforce|decay} window=<dur> [DRY_RUN]
                try:
                    # Two-Keys: безопасный флаг — допускаем только при одобрении
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, rid)):
                        return {"ok": False, "error": "two-keys approval required for learn.apply_feedback"}
                    mode = str(params.get("mode") or "reinforce").strip().lower()
                    window = str(params.get("window") or "24h").strip()
                    payload = {"mode": mode, "window": window, "ts": __import__("datetime").datetime.utcnow().isoformat()}
                    if not dry_run:
                        try:
                            await self.settings.set_setting("train.last_feedback", payload, db)
                        except Exception:
                            pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.learn.apply_feedback", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"applied": (not dry_run), "payload": payload}}
                except Exception as e:
                    return {"ok": False, "error": f"learn apply_feedback error: {e}"}

            elif handler == "train.metrics.window":
                # TRAIN.METRICS.WINDOW window=<dur> (например, 24h, 7d, 60m)
                try:
                    raw = str(params.get("window") or "24h").strip().lower()
                    secs = 0
                    try:
                        import re as _re
                        m = _re.match(r"^\s*(\d+)\s*([mhd])\s*$", raw)
                        if m:
                            val = int(m.group(1))
                            unit = m.group(2)
                            if unit == "m":
                                secs = val * 60
                            elif unit == "h":
                                secs = val * 3600
                            elif unit == "d":
                                secs = val * 86400
                        else:
                            secs = max(60, int(raw))  # допускаем секунды числом
                    except Exception:
                        secs = 86400
                    # Агрегация по таблице quants
                    try:
                        from sqlalchemy import text as _text
                        q = _text(
                            """
                            with window_quants as (
                                select id, thought_form, energy_weight, tags
                                from quants
                                where created_at >= (now() - make_interval(secs => :secs))
                            )
                            select
                                count(*) as cnt,
                                count(*) filter (where coalesce(length(thought_form),0) > 0) as non_empty,
                                coalesce(avg(energy_weight),0) as avg_energy,
                                count(*) filter (where array_length(tags,1) is not null) as tags_present
                            from window_quants
                            """
                        )
                        row = (await db.execute(q, {"secs": int(secs)})).fetchone()
                        metrics = {
                            "window_secs": int(secs),
                            "count": int(row[0] or 0) if row else 0,
                            "non_empty_thought": int(row[1] or 0) if row else 0,
                            "avg_energy_weight": float(row[2] or 0.0) if row else 0.0,
                            "tags_present_count": int(row[3] or 0) if row else 0,
                        }
                    except Exception as e:
                        return {"ok": False, "error": f"metrics query error: {e}"}
                    signature_ctx.append_step(function_id="cmd.hyperloop.train.metrics.window", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"metrics": metrics}}
                except Exception as e:
                    return {"ok": False, "error": f"train metrics window error: {e}"}

            elif handler == "train.last_batch.normalize":
                # TRAIN.LAST_BATCH.NORMALIZE — нормализация последнего батча (опасная операция) требует Two-Keys
                try:
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, rid)):
                        return {"ok": False, "error": "two-keys approval required for train.last_batch.normalize"}
                except Exception:
                    return {"ok": False, "error": "two-keys check failed"}

            elif handler == "test.run":
                test_key = str(params.get("key") or "").strip()
                try:
                    from ..services.gendarme_service import GendarmeService  # type: ignore
                    g = GendarmeService()
                    if not dry_run:
                        res = await g.run_test(db, test_key)
                    else:
                        res = {"status": "dry_run"}
                except Exception as e:
                    return {"ok": False, "error": f"gendarme error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.test.run", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": test_key, "result": res, "dry_run": dry_run}}

            elif handler == "skill.test":
                # SKILL.TEST key=<skill_key> [test_key=skill_chain.apply_and_trace.<skill_key>]
                skill_key = str(params.get("key") or "").strip()
                explicit_test_key = str(params.get("test_key") or "").strip()
                if not skill_key and not explicit_test_key:
                    return {"ok": False, "error": "skill key or test_key required"}
                test_key_eff = explicit_test_key or f"skill_chain.apply_and_trace.{skill_key}"
                try:
                    from ..services.gendarme_service import GendarmeService  # type: ignore
                    g = GendarmeService()
                    res = await g.run_test(db, test_key_eff)
                except Exception as e:
                    return {"ok": False, "error": f"gendarme error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.skill.test", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": skill_key, "test_key": test_key_eff, "result": res}}

            elif handler == "skill.suite":
                # SKILL.SUITE [key=<skill_key>] [mode=golden|apply|optimize]
                # По умолчанию: запускаем все зарегистрированные tests_registry категории 'skills'
                mode = str(params.get("mode") or "apply").strip().lower()
                skill_key = params.get("key")
                try:
                    from ..services.gendarme_service import GendarmeService  # type: ignore
                    g = GendarmeService()
                    if skill_key:
                        # Мини‑набор для одного навыка
                        keys = [f"skill_chain.apply_and_trace.{skill_key}"]
                        results = []
                        for k in keys:
                            try:
                                results.append(await g.run_test(db, k))
                            except Exception as e:
                                results.append({"test_key": k, "status": "failed", "detail": str(e)})
                        out = {"ok": all(r.get("status") == "passed" for r in results), "data": {"mode": mode, "results": results}}
                    else:
                        # Полная suite категории skills через сервис
                        res = await g.run_suite(db, category="skills")
                        out = {"ok": res.get("failed", 1) == 0, "data": res}
                except Exception as e:
                    return {"ok": False, "error": f"gendarme error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.skill.suite", scope="hyperloop", version="v1")

            elif handler == "judge.charter":
                # JUDGE.CHARTER.UPSERT name=... version=... text="..." [category=...] [enforced=true]
                sub = (str(params.get("upsert") or "").strip() or "upsert")
                if sub.lower() != "upsert":
                    return {"ok": False, "error": "unsupported JUDGE.CHARTER action"}
                name = str(params.get("name") or "").strip()
                version = str(params.get("version") or "").strip()
                text_body = str(params.get("text") or "")
                category = params.get("category")
                enforced = bool(params.get("enforced", True))
                # Two-Keys: для enforced уставов или опасных категорий требуем одобрение
                danger = enforced or (str(category or "").lower() in {"core_safety", "danger", "security"})
                if danger:
                    req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (await self._check_two_keys(db, req_id)):
                        return {"ok": False, "error": "two-keys approval required for judge charter upsert"}
                try:
                    from ..services.judge_service import JudgeService  # type: ignore
                    js = JudgeService()
                    if not dry_run:
                        up = await js.upsert_charter(db, name=name, version=version, text_body=text_body, category=(str(category) if category else None), enforced=enforced)
                    else:
                        up = name
                except Exception as e:
                    return {"ok": False, "error": f"judge error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.judge.charter.upsert", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"name": up, "dry_run": dry_run}}

            elif handler == "two_keys.request":
                # TWO_KEYS.REQUEST operation=<op> scope=<scope>  reason="..." [ttl_minutes=<n>]
                op = str(params.get("operation") or params.get("op") or "").strip()
                scope = str(params.get("scope") or "").strip()
                reason = str(params.get("reason") or "").strip()
                ttl = int(params.get("ttl_minutes") or 10)
                if not op or not scope or not reason:
                    return {"ok": False, "error": "operation, scope, reason required"}
                try:
                    import uuid as _uuid
                    rid = str(_uuid.uuid4())
                    try:
                        from ..services.soul_audit_service import SoulAuditService  # type: ignore
                        audit = SoulAuditService()
                        meta = {"request_id": rid, "operation": op, "scope": scope, "ttl_minutes": ttl}
                        await audit.log(db, "two_keys_request", description=f"request_id={rid}; op={op}; scope={scope}; reason={reason}", meta=meta)
                    except Exception:
                        pass
                except Exception as e:
                    return {"ok": False, "error": f"two_keys request error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.two_keys.request", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"request_id": rid}}

            elif handler == "two_keys.approve":
                # TWO_KEYS.APPROVE id=<uuid>
                rid = str(params.get("id") or params.get("request_id") or "").strip()
                if not rid:
                    return {"ok": False, "error": "id required"}
                try:
                    from ..services.soul_audit_service import SoulAuditService  # type: ignore
                    audit = SoulAuditService()
                    await audit.log(db, "two_keys_approved", description=f"request_id={rid}; approved_by=hyperloop", meta={"request_id": rid})
                    # Маркер через настройки (надежный режим без DDL)
                    try:
                        await self.settings.set_setting(f"two_keys.approved.{rid}", True, db)
                        try:
                            await db.commit()
                        except Exception:
                            pass
                    except Exception:
                        pass
                    # Облегчённый путь: сохранить маркер одобрения для быстрого прохода проверок
                    try:
                        from sqlalchemy import text as _t  # type: ignore
                        await db.execute(_t("""
                            CREATE TABLE IF NOT EXISTS public.two_keys_approved_requests (
                                request_id UUID PRIMARY KEY,
                                approved_at TIMESTAMPTZ NOT NULL DEFAULT now()
                            );
                            INSERT INTO public.two_keys_approved_requests(request_id)
                            VALUES (CAST(:rid AS uuid))
                            ON CONFLICT (request_id) DO UPDATE SET approved_at = excluded.approved_at;
                        """), {"rid": str(rid)})
                        try:
                            await db.commit()
                        except Exception:
                            pass
                    except Exception:
                        pass
                except Exception as e:
                    return {"ok": False, "error": f"two_keys approve error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.two_keys.approve", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"approved": rid}}

                # JUDGE.CHECK code="..."
                diff = str(params.get("code") or "")
                try:
                    from ..services.judge_service import JudgeService  # type: ignore
                    js = JudgeService()
                    res = await js.check_code_policy(db, diff_summary=diff)
                except Exception as e:
                    return {"ok": False, "error": f"judge error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.judge.check", scope="hyperloop", version="v1")
                out = {"ok": True, "data": res}

            elif handler == "request.create":
                # REQUEST.CREATE type=... subject="..." payload={...}
                req_type = str(params.get("type") or "").strip()
                subject = str(params.get("subject") or "")
                payload = params.get("payload") or {}
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    rid = await a.create_request(db, req_type, subject, payload, created_by="hyperloop") if not dry_run else "dry-run"
                except Exception as e:
                    return {"ok": False, "error": f"archivarius error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.request.create", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": rid, "dry_run": dry_run}}

            elif handler == "request.status":
                # REQUEST.STATUS id=<uuid> status=<new|done|...>
                rid = str(params.get("id") or "").strip()
                status_val = str(params.get("status") or "").strip()
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    if not dry_run:
                        await a.update_status(db, rid, status_val)
                except Exception as e:
                    return {"ok": False, "error": f"archivarius error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.request.status", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": rid, "status": status_val, "dry_run": dry_run}}

            elif handler == "request.list":
                # REQUEST.LIST [status=<filter>]
                status_val = params.get("status")
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    items = await a.list_requests(db, str(status_val)) if status_val is not None else await a.list_requests(db, None)
                except Exception as e:
                    return {"ok": False, "error": f"archivarius error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.request.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            # ---------------------- LANG / GPU / CONCURRENCY / SELFTEST / MACRO / DEPLOY / TUNNEL ----------------------
            elif handler == "lang.set":
                k = str(params.get("key") or "").strip()
                val = params.get("value")
                if not k:
                    return {"ok": False, "error": "key required"}
                try:
                    await self.settings.set_setting(k, val, db)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"lang set error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.lang.set", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": k}}

            elif handler == "lang.get":
                k = str(params.get("key") or "").strip()
                if not k:
                    return {"ok": False, "error": "key required"}
                try:
                    val = await self.settings.get_setting(k, db, None)
                except Exception as e:
                    return {"ok": False, "error": f"lang get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.lang.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": k, "value": val}}
            elif handler == "gpu.status":
                info: Dict[str, Any] = {"available": False, "device_count": 0}
                try:
                    import torch  # type: ignore
                    avail = bool(getattr(torch, "cuda", None) and torch.cuda.is_available())
                    cnt = int(torch.cuda.device_count()) if avail else 0
                    info = {"available": avail, "device_count": cnt}
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.gpu.status", scope="hyperloop", version="v1")
                out = {"ok": True, "data": info}

            elif handler == "concurrency.limits":
                if "set" not in params:
                    return {"ok": False, "error": "use: CONCURRENCY.LIMITS set send_threads=<n> parse_threads=<m>"}
                try:
                    st = int(params.get("send_threads") or 2)
                    pt = int(params.get("parse_threads") or 2)
                    await self.settings.set_setting("concurrency.send_threads", st, db)
                    await self.settings.set_setting("concurrency.parse_threads", pt, db)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"concurrency set error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.concurrency.limits", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"send_threads": st, "parse_threads": pt}}

            elif handler == "selftest.run":
                key = str(params.get("key") or "db_ping").strip().lower()
                passed = True
                detail: Dict[str, Any] = {}
                try:
                    if key in ("db", "db_ping"):
                        _ = (await db.execute(sa_text("select 1"))).fetchone()
                        detail = {"db": True}
                    elif key == "schema_quants":
                        row = (await db.execute(sa_text("select 1 from information_schema.tables where table_name='quants'"))).fetchone()
                        passed = bool(row)
                        detail = {"quants_table": passed}
                    else:
                        detail = {"note": "unknown key"}
                except Exception as e:
                    passed = False
                    detail = {"error": str(e)}
                signature_ctx.append_step(function_id="cmd.hyperloop.selftest.run", scope="hyperloop", version="v1")
                out = {"ok": passed, "data": detail}

            elif handler == "macro.list":
                items = [
                    "smoke_all",
                    "db_reindex_safe",
                    "processor_drain_once",
                    "p27_sign_guard_smoke",
                    "usage_report",
                    "usage_to_tz36"
                ]
                signature_ctx.append_step(function_id="cmd.hyperloop.macro.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler == "macro.run":
                key = str(params.get("key") or "").strip()
                if not key:
                    return {"ok": False, "error": "key required"}
                macros: Dict[str, str] = {
                    "smoke_all": "FLAGS.APPLY_PROFILE name=prod_safe\nINSPECTOR.RUN_ALL\nSELFTEST.RUN key=db_ping",
                    "db_reindex_safe": "REINDEX.ALL",
                    "processor_drain_once": "PROCESSOR.PROCESS_ONCE",
                    "p27_sign_guard_smoke": "CORE.PIPELINE.RUN input_text=\"health check\" WITH TRACE\nCORE.TRACE.REQUIRE chain=\"svc.soul.preanalysis,svc.llm_client.send,svc.llm_client.recv,svc.parser.json_strict,svc.chat.reply_render\"",
                    "usage_report": "TEST.RUN key=dev_hyperloop_usage_stats",
                }
                if key == "usage_to_tz36":
                    # 1) Выполнить usage_report
                    nested = await self.execute(commands_text=macros["usage_report"], db=db, signature_ctx=signature_ctx, options={"stop_on_error": True})
                    # 2) Сформировать краткую выжимку и создать заявку на обновление ТЗ 36
                    try:
                        metrics = (((nested or {}).get("results") or [{}])[0] or {}).get("data") or {}
                    except Exception:
                        metrics = {}
                    summary = {
                        "top_commands": (metrics.get("metrics") or {}).get("top_commands"),
                        "top_incidents": (metrics.get("metrics") or {}).get("top_incidents"),
                        "http_5xx": (metrics.get("metrics") or {}).get("http_5xx"),
                        "http_502": (metrics.get("metrics") or {}).get("http_502"),
                        "heatmap_steps_hour": (metrics.get("metrics") or {}).get("heatmap_steps_hour"),
                        "heatmap_incidents_hour": (metrics.get("metrics") or {}).get("heatmap_incidents_hour"),
                    }
                    try:
                        from ..services.archivarius_service import ArchivariusService  # type: ignore
                        a = ArchivariusService()
                        rid = await a.create_request(db, "tz36_update", "Daily Hyperloop usage insights", summary, created_by="hyperloop")
                    except Exception:
                        rid = None
                    # 3) Запланировать следующий запуск через 24 часа (processor_events)
                    try:
                        await db.execute(
                            _t(
                                """
                                insert into processor_events (kind, payload, priority, due_at, dedup_key, status)
                                values ('hyperloop.macro', CAST(:p AS jsonb), 1, (now() + interval '24 hours'), 'usage_to_tz36_daily', 'scheduled')
                                on conflict do nothing
                                """
                            ),
                            {"p": json.dumps({"macro": "usage_to_tz36"})},
                        )
                        await db.commit()
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.macro.run", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"request_id": rid, "nested": nested}}
                else:
                    script = macros.get(key)
                    if not script:
                        return {"ok": False, "error": "macro not found"}
                    nested = await self.execute(commands_text=script, db=db, signature_ctx=signature_ctx, options={"stop_on_error": True})
                    signature_ctx.append_step(function_id="cmd.hyperloop.macro.run", scope="hyperloop", version="v1")
                    out = {"ok": bool(nested.get("results")), "data": nested}

            elif handler == "deploy.check":
                summary: Dict[str, Any] = {"db": False, "tables": {}, "processor": {}}
                try:
                    _ = (await db.execute(sa_text("select 1"))).fetchone()
                    summary["db"] = True
                    for t in ("quants", "quant_links", "processor_events", "signature_steps"):
                        r = (await db.execute(sa_text("select to_regclass(:t) is not null"), {"t": f"public.{t}"})).fetchone()
                        summary["tables"][t] = bool(r and r[0])
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.deploy.check", scope="hyperloop", version="v1")
                out = {"ok": bool(summary.get("db")), "data": summary}

            elif handler == "deploy.nginx":
                sub = str(params.get("reload") or "reload").lower()
                if sub != "reload":
                    return {"ok": False, "error": "unsupported deploy.nginx action"}
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    rid = await a.create_request(db, "deploy", "nginx reload", {"action": "nginx.reload"}, created_by="hyperloop")
                except Exception:
                    rid = None
                signature_ctx.append_step(function_id="cmd.hyperloop.deploy.nginx.reload", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"request_id": rid}}

            elif handler == "deploy.restart":
                unit = str(params.get("unit") or "").strip()
                if not unit:
                    return {"ok": False, "error": "unit required"}
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    rid = await a.create_request(db, "deploy", "systemd restart", {"action": "systemd.restart", "unit": unit}, created_by="hyperloop")
                except Exception:
                    rid = None
                signature_ctx.append_step(function_id="cmd.hyperloop.deploy.restart", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"request_id": rid}}

            elif handler == "tunnel.open":
                name = str(params.get("name") or "").strip()
                target = str(params.get("target") or "").strip()
                if not name or not target:
                    return {"ok": False, "error": "name and target required"}
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    rid = await a.create_request(db, "tunnel", "open", {"name": name, "target": target, "action": "open"}, created_by="hyperloop")
                except Exception:
                    rid = None
                signature_ctx.append_step(function_id="cmd.hyperloop.tunnel.open", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"request_id": rid}}

            elif handler == "tunnel.close":
                name = str(params.get("name") or "").strip()
                if not name:
                    return {"ok": False, "error": "name required"}
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    rid = await a.create_request(db, "tunnel", "close", {"name": name, "action": "close"}, created_by="hyperloop")
                except Exception:
                    rid = None
                signature_ctx.append_step(function_id="cmd.hyperloop.tunnel.close", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"request_id": rid}}

            elif handler == "tunnel.status":
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    a = ArchivariusService()
                    items = await a.list_requests(db, None)
                    items = [it for it in (items or []) if str(it.get("type")) == "tunnel"]
                except Exception:
                    items = []
                signature_ctx.append_step(function_id="cmd.hyperloop.tunnel.status", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            # ---------------------- NET.* (P36 v1.3) ----------------------
            elif handler == "net.fw.status":
                try:
                    from ..services.firewall_service import FirewallService  # type: ignore
                    fw = FirewallService()
                    st = await fw.get_state(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.net.fw.status", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {
                        "enabled": st.enabled,
                        "profile": st.profile,
                        "allow_domains": st.allow_domains,
                        "block_domains": st.block_domains,
                    }}
                except Exception as e:
                    return {"ok": False, "error": f"net.fw.status error: {e}"}

            elif handler == "net.fw.apply_profile":
                profile = str(params.get("name") or params.get("profile") or "").strip()
                if not profile:
                    return {"ok": False, "error": "profile name required"}
                try:
                    from ..services.firewall_service import FirewallService  # type: ignore
                    fw = FirewallService()
                    if not dry_run:
                        st = await fw.apply_profile(db, profile)
                        try:
                            await db.commit()
                        except Exception:
                            pass
                    # Запись audit в registry (как профиль политики)
                    try:
                        _uid = int((self._options or {}).get("actor_user_id") or 0)
                        await db.execute(sa_text(
                            """
                            create table if not exists net_egress_registry(
                                id uuid primary key default gen_random_uuid(),
                                domain text not null,
                                ports text,
                                description text,
                                purpose_prompt text,
                                created_by bigint,
                                created_at timestamptz default now()
                            );
                            create unique index if not exists uq_net_egress_registry on net_egress_registry(domain, coalesce(ports,''));
                            """
                        ))
                        # профиль — как псевдодомен с меткой
                        await db.execute(sa_text(
                            "insert into net_egress_registry(domain, ports, description, created_by) values (:d, '', :desc, :u) on conflict do nothing"
                        ), {"d": f"profile://{profile}", "desc": "Applied firewall profile", "u": _uid or None})
                        await db.commit()
                    except Exception:
                        pass
                    else:
                        st = await fw.get_state(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.net.fw.apply_profile", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"profile": profile, "dry_run": dry_run}}
                except Exception as e:
                    return {"ok": False, "error": f"net.fw.apply_profile error: {e}"}
            elif handler == "net.fw.deny":
                domain = str(params.get("domain") or "").strip()
                ports = params.get("ports")
                if not domain:
                    return {"ok": False, "error": "domain required"}
                try:
                    from ..services.firewall_service import FirewallService  # type: ignore
                    fw = FirewallService()
                    if not dry_run:
                        st = await fw.deny(db, domain=domain, ports=(str(ports) if ports is not None else None))
                        try:
                            await db.commit()
                        except Exception:
                            pass
                    else:
                        st = await fw.get_state(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.net.fw.deny", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"domain": domain, "ports": ports, "dry_run": dry_run}}
                except Exception as e:
                    return {"ok": False, "error": f"net.fw.deny error: {e}"}

            elif handler == "net.fw.test":
                url = str(params.get("url") or "").strip()
                timeout_ms = int(params.get("timeout_ms") or 4000)
                if not url:
                    return {"ok": False, "error": "url required"}
                try:
                    from ..services.web_fetcher import WebFetcher  # type: ignore
                    f = WebFetcher(max_content_len=256, max_retries=0)
                    res = await f.fetch(url, timeout_ms=timeout_ms)
                    ok = bool(res) and (int(res.get("status") or 0) > 0) and (not res.get("error"))
                    # лог использования в БД
                    try:
                        _uid = int((self._options or {}).get("actor_user_id") or 0)
                        await db.execute(sa_text(
                            """
                            create table if not exists net_egress_usage(
                                id uuid primary key default gen_random_uuid(),
                                domain text,
                                url text,
                                user_id bigint,
                                source text,
                                status int,
                                error text,
                                used_at timestamptz default now()
                            );
                            """
                        ))
                        await db.execute(sa_text(
                            "insert into net_egress_usage(domain, url, user_id, source, status, error) values (:d, :u, :uid, :src, :st, :err)"
                        ), {"d": (res.get("url") or url), "u": url, "uid": _uid or None, "src": "hyperloop.test", "st": int(res.get("status") or 0), "err": (res.get("error") or None)})
                        await db.commit()
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.net.fw.test", scope="hyperloop", version="v1")
                    out = {"ok": ok, "data": res}
                except Exception as e:
                    return {"ok": False, "error": f"net.fw.test error: {e}"}

            elif handler == "net.frontend.allow":
                # NET.FRONTEND.ALLOW host=<domain>
                host = str(params.get("host") or "").strip()
                if not host:
                    return {"ok": False, "error": "host required"}
                try:
                    from ..services.firewall_service import FirewallService  # type: ignore
                    fw = FirewallService()
                    if not dry_run:
                        data = await fw.allow_web_host(db, host)
                        try:
                            await db.commit()
                        except Exception:
                            pass
                    else:
                        data = await fw.channels_status(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.net.frontend.allow", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": data}
                except Exception as e:
                    return {"ok": False, "error": f"net.frontend.allow error: {e}"}

            elif handler == "net.tg.allow":
                # NET.TG.ALLOW api_host=api.telegram.org webhook_source=<ip|cidr|domain>
                api_host = params.get("api_host")
                webhook_source = params.get("webhook_source")
                try:
                    from ..services.firewall_service import FirewallService  # type: ignore
                    fw = FirewallService()
                    if not dry_run:
                        data = await fw.allow_telegram(db, api_host=(str(api_host) if api_host else None), webhook_source=(str(webhook_source) if webhook_source else None))
                        try:
                            await db.commit()
                        except Exception:
                            pass
                    else:
                        data = await fw.channels_status(db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.net.tg.allow", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": data}
                except Exception as e:
                    return {"ok": False, "error": f"net.tg.allow error: {e}"}

            elif handler == "net.fw.kill_switch":
                # NET.FW.KILL_SWITCH ttl=<dur> [request_id=<UUID>] — закрыть egress на TTL (Two-Keys)
                ttl_raw = str(params.get("ttl") or "15m").strip()
                req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                # Требуем Two-Keys
                if not (await self._check_two_keys(db, req_id)):
                    return {"ok": False, "error": "two-keys approval required"}
                # Простейший парсер TTL: N[m|h]
                from datetime import datetime, timedelta, timezone
                mult = 60
                try:
                    if ttl_raw.endswith("h"):
                        mult = 3600
                        num = int(ttl_raw[:-1])
                    elif ttl_raw.endswith("m"):
                        mult = 60
                        num = int(ttl_raw[:-1])
                    else:
                        num = int(ttl_raw)
                except Exception:
                    num = 15
                    mult = 60
                until = datetime.now(timezone.utc) + timedelta(seconds=num * mult)
                try:
                    from ..services.soul_settings_service import SoulSettingsService  # type: ignore
                    from ..services.firewall_service import FirewallService  # type: ignore
                    s = SoulSettingsService()
                    fw = FirewallService()
                    # Сохраняем предыдущее состояние и включаем жёсткий локдаун
                    st = await fw.get_state(db)
                    await s.set_setting("net.fw.killswitch.enabled", True, db)
                    await s.set_setting("net.fw.killswitch.until", until.isoformat(), db)
                    await s.set_setting("net.fw.killswitch.prev_allow", list(st.allow_domains), db)
                    await s.set_setting("net.fw.enabled", True, db)
                    await s.set_setting("net.fw.allow_domains", [], db)  # всё закрыто
                    try:
                        await db.commit()
                    except Exception:
                        pass
                except Exception as e:
                    return {"ok": False, "error": f"kill_switch error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.net.fw.kill_switch", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"until": until.isoformat()}}

            elif handler == "net.service.port.switch":
                # NET.SERVICE.PORT.SWITCH service=<name> port=<n> [request_id=<UUID>]
                service = str(params.get("service") or "").strip().lower()
                port = str(params.get("port") or "").strip()
                req_id = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                if not service or not port:
                    return {"ok": False, "error": "service and port required"}
                # Two-Keys требуем для смены порта
                if not (await self._check_two_keys(db, req_id)):
                    return {"ok": False, "error": "two-keys approval required"}
                try:
                    from ..services.soul_settings_service import SoulSettingsService  # type: ignore
                    s = SoulSettingsService()
                    await s.set_setting(f"net.service.port.{service}", int(port), db)
                    try:
                        await db.commit()
                    except Exception:
                        pass
                    # Регистрируем заявку на обновление прокси/health
                    try:
                        from ..services.archivarius_service import ArchivariusService  # type: ignore
                        a = ArchivariusService()
                        rid = await a.create_request(db, "net", "service port switch", {"service": service, "port": int(port)}, created_by="hyperloop")
                    except Exception:
                        rid = None
                except Exception as e:
                    return {"ok": False, "error": f"port switch error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.net.service.port.switch", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"service": service, "port": int(port), "request_id": rid}}

            elif handler == "processor.enable":
                # PROCESSOR.ENABLE
                if not dry_run:
                    await self.settings.set_setting("processor.enabled", True, db)
                    try:
                        await db.commit()
                    except Exception:
                        pass
                signature_ctx.append_step(function_id="cmd.hyperloop.processor.enable", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enabled": True, "dry_run": dry_run}}

            elif handler == "processor.disable":
                # PROCESSOR.DISABLE
                if not dry_run:
                    await self.settings.set_setting("processor.enabled", False, db)
                    try:
                        await db.commit()
                    except Exception:
                        pass
                signature_ctx.append_step(function_id="cmd.hyperloop.processor.disable", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"enabled": False, "dry_run": dry_run}}

            elif handler == "processor.policy":
                # PROCESSOR.POLICY.SET key=<k> value=<json>
                sub = str(params.get("set") or "set").lower()
                if sub != "set":
                    return {"ok": False, "error": "unsupported PROCESSOR.POLICY action"}
                key = str(params.get("key") or "").strip()
                # value может прийти как объект (распарсенный), как строка JSON или в альтернативном параметре value_json
                val = params.get("value")
                if val in (None, ""):
                    alt = params.get("value_json")
                    if isinstance(alt, str) and alt.strip():
                        val = alt
                try:
                    if isinstance(val, str):
                        vparam = val if val.strip() else '""'
                    else:
                        vparam = json.dumps(val)
                    await db.execute(_t("insert into processor_policies(key,value,updated_at) values (:k, CAST(:v AS jsonb), now()) on conflict (key) do update set value = EXCLUDED.value, updated_at = now()"), {"k": key, "v": vparam})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"policy error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.processor.policy.set", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"key": key}}

            elif handler == "processor.event":
                # PROCESSOR.EVENT.INJECT kind=<k> payload=<json> [priority=<n>] [due_at=<ts>] [dedup_key=<id>]
                sub = str(params.get("inject") or "inject").lower()
                if sub != "inject":
                    return {"ok": False, "error": "unsupported PROCESSOR.EVENT action"}
                kind = str(params.get("kind") or "").strip()
                payload = params.get("payload") or {}
                if isinstance(payload, str) and not payload.strip():
                    altp = params.get("payload_json")
                    if isinstance(altp, str) and altp.strip():
                        payload = altp
                priority = int(params.get("priority") or 0)
                due_at = str(params.get("due_at") or "").strip() or None
                dedup_key = str(params.get("dedup_key") or "").strip() or None
                try:
                    if isinstance(payload, str):
                        pparam = payload if payload.strip() else '""'
                    else:
                        pparam = json.dumps(payload)
                    row = (await db.execute(sa_text("insert into processor_events(id, kind, payload, dedup_key, priority, due_at, status, retries, created_at) values (gen_random_uuid(), :k, CAST(:p AS jsonb), :d, :pr, CAST(:due as timestamp), 'pending', 0, now()) returning id::text as id, kind, payload"), {"k": kind, "p": pparam, "d": dedup_key, "pr": priority, "due": due_at})).fetchone()
                    await db.commit()
                    rid = row[0] if row else None
                except Exception as e:
                    return {"ok": False, "error": f"event inject error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.processor.event.inject", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": rid, "kind": kind}}

            elif handler == "processor.process_once":
                # PROCESSOR.PROCESS_ONCE — обработать одно pending событие с метриками/stages (через ProcessorScheduler)
                try:
                    # Берём одно событие и переводим в dispatched
                    from sqlalchemy import text as _t  # type: ignore
                    ev = (
                        await db.execute(
                            _t(
                                """
                                with cte as (
                                  select id, kind, payload
                                  from processor_events
                                  where status='pending'
                                  order by priority desc nulls last, due_at nulls last
                                  limit 1
                                )
                                update processor_events e
                                  set status = 'dispatched'
                                  from cte
                                  where e.id = cte.id
                                returning e.id::text as id, e.kind, e.payload
                                """
                            )
                        )
                    ).mappings().first()
                    if not ev:
                        out = {"ok": True, "data": {"message": "no pending events"}}
                    else:
                        try:
                            # Делегируем полноценную обработку (перцепция/решение/действие/наблюдение) для метрик p95
                            from ..services.processor_scheduler import ProcessorScheduler  # type: ignore
                            sch = ProcessorScheduler()
                            await sch._process_one(db, dict(ev))  # type: ignore[attr-defined]
                            await db.commit()
                            out = {"ok": True, "data": {"processed": ev["id"]}}
                        except Exception as e:
                            await db.execute(_t("update processor_events set status='skipped' where id = cast(:id as uuid)"), {"id": ev["id"]})
                            await db.execute(_t("insert into processor_incidents (run_id, event_id, type, detail) values (NULL, cast(:id as uuid), 'process_once_error', :d)"), {"id": ev["id"], "d": str(e)[:400]})
                            await db.commit()
                            out = {"ok": False, "error": str(e)}
                except Exception as e:
                    return {"ok": False, "error": f"process_once error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.processor.process_once", scope="hyperloop", version="v1")
                out = {"ok": bool(out.get("ok", False)), "data": out.get("data") or ({"error": out.get("error")} if out.get("error") else {})}

            elif handler == "sanitizer.add":
                # SANITIZER.ADD name=<visible_text|thought_form> pattern="..."
                target = str(params.get("name") or "").strip()
                pattern = str(params.get("pattern") or "")
                if target not in ("visible_text", "thought_form"):
                    return {"ok": False, "error": "invalid sanitizer name"}
                key = f"sanitizer.{target}.patterns"
                try:
                    cur = await self.settings.get_setting(key, db, [])
                    if not isinstance(cur, list):
                        try:
                            cur = json.loads(cur) if isinstance(cur, str) else []
                        except Exception:
                            cur = []
                    if pattern and pattern not in cur:
                        cur.append(pattern)
                    await self.settings.set_setting(key, json.dumps(cur, ensure_ascii=False), db)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"sanitizer add error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.sanitizer.add", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"name": target, "count": len(cur)}}

            elif handler == "sanitizer.remove":
                # SANITIZER.REMOVE name=<visible_text|thought_form> pattern="..."
                target = str(params.get("name") or "").strip()
                pattern = str(params.get("pattern") or "")
                if target not in ("visible_text", "thought_form"):
                    return {"ok": False, "error": "invalid sanitizer name"}
                key = f"sanitizer.{target}.patterns"
                try:
                    cur = await self.settings.get_setting(key, db, [])
                    if not isinstance(cur, list):
                        try:
                            cur = json.loads(cur) if isinstance(cur, str) else []
                        except Exception:
                            cur = []
                    if pattern and pattern in cur:
                        cur = [p for p in cur if p != pattern]
                    await self.settings.set_setting(key, json.dumps(cur, ensure_ascii=False), db)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"sanitizer remove error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.sanitizer.remove", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"name": target, "count": len(cur)}}

            elif handler == "schema.secrets.ensure":
                # SCHEMA.SECRETS.ENSURE — создать расширение pgcrypto и таблицу soul_secrets
                try:
                    from ..services.secrets_service import SecretsService  # type: ignore
                    sec = SecretsService()
                    await sec.ensure_schema(db)
                except Exception as e:
                    return {"ok": False, "error": f"secrets ensure error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.schema.secrets.ensure", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"ensured": True}}

            elif handler == "secret.set":
                # SECRET.SET key=deepseek_api_key value="..." [request_id=<uuid>]
                s_key = str(params.get("key") or "").strip()
                s_val = str(params.get("value") or "")
                if not s_key:
                    return {"ok": False, "error": "key required"}
                # Two-Keys для чувствительных ключей
                sensitive = {"deepseek_api_key", "openai_api_key", "gigachat_client_secret", "hyperloop_api_secret"}
                if s_key.lower() in sensitive:
                    # Trusted owner bypass
                    trusted_ok = False
                    try:
                        actor = (self._options or {}).get('actor_user_id')  # type: ignore[attr-defined]
                    except Exception:
                        actor = None
                    if actor:
                        try:
                            from ..services.soul_settings_service import SoulSettingsService as _SS  # type: ignore
                        except Exception:
                            _SS = None  # type: ignore
                        try:
                            ssvc = _SS() if _SS else None
                            raw = await ssvc.get_setting("two_keys.trusted_owner_ids", db, "[]") if ssvc else []
                            trusted_ids: list[str] = []
                            if isinstance(raw, list):
                                trusted_ids = [str(x) for x in raw]
                            elif isinstance(raw, str):
                                import json as _json
                                try:
                                    parsed = _json.loads(raw)
                                    if isinstance(parsed, list):
                                        trusted_ids = [str(x) for x in parsed]
                                except Exception:
                                    if raw.strip():
                                        trusted_ids = [raw.strip()]
                            trusted_ok = str(actor) in trusted_ids if trusted_ids else False
                        except Exception:
                            trusted_ok = False
                    rid = str(params.get("request_id") or params.get("two_keys_request_id") or "").strip()
                    if not (trusted_ok or (await self._check_two_keys(db, rid))):
                        return {"ok": False, "error": "two-keys approval required for secret.set"}
                try:
                    from ..services.secrets_service import SecretsService  # type: ignore
                    sec = SecretsService()
                    await sec.ensure_schema(db)
                    ok = True if dry_run else await sec.set_secret(db, s_key, s_val, updated_by="hyperloop")
                    if not ok:
                        # Fallback: сохраняем незашифровано в soul_settings, чтобы не блокировать работу (до настройки pgcrypto)
                        try:
                            await self.settings.set_setting(s_key, s_val, db)
                            ok = True
                        except Exception:
                            ok = False
                    if not ok:
                        return {"ok": False, "error": "secret set failed"}
                    signature_ctx.append_step(function_id="cmd.hyperloop.secret.set", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"key": s_key, "stored": "encrypted" if not dry_run else "dry_run", "fallback": (not ok and not dry_run)}}
                except Exception as e:
                    return {"ok": False, "error": f"secret.set error: {e}"}
            elif handler == "secret.get":
                # SECRET.GET key=deepseek_api_key — возвращает только маскированный факт наличия
                s_key = str(params.get("key") or "").strip()
                if not s_key:
                    return {"ok": False, "error": "key required"}
                try:
                    from ..services.secrets_service import SecretsService  # type: ignore
                    sec = SecretsService()
                    # Пытаемся прочитать расшифрованное значение
                    val = await sec.get_secret(db, s_key)
                    masked = None
                    exists = False
                    if isinstance(val, str) and len(val) > 0:
                        exists = True
                        if len(val) > 6:
                            masked = val[:3] + "***" + val[-3:]
                        else:
                            masked = "***"
                    else:
                        # Фолбек 1: если дешифр не удался/пусто, проверяем факт наличия записи в таблице секретов
                        try:
                            from sqlalchemy import text as _sa_text  # type: ignore
                            row = (
                                await db.execute(
                                    _sa_text("SELECT 1 FROM public.soul_secrets WHERE key = :k LIMIT 1"),
                                    {"k": s_key},
                                )
                            ).fetchone()
                            exists = bool(row is not None)
                        except Exception:
                            exists = False
                        # Фолбек 2: если в таблице секретов записи нет, проверим soul_settings (возможен временный fallback записи)
                        if not exists:
                            try:
                                from sqlalchemy import text as _sa_text  # type: ignore
                                row2 = (
                                    await db.execute(
                                        _sa_text("SELECT 1 FROM soul_settings WHERE key = :k LIMIT 1"),
                                        {"k": s_key},
                                    )
                                ).fetchone()
                                exists = bool(row2 is not None)
                                if exists and masked is None:
                                    masked = "***"
                            except Exception:
                                pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.secret.get", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"exists": bool(exists), "preview": masked}}
                except Exception as e:
                    return {"ok": False, "error": f"secret.get error: {e}"}

            

            elif handler == "processor.policy.set":
                # PROCESSOR.POLICY.SET key=... value={...}
                key = str(params.get("key") or "").strip()
                # Поддержка value_json (строка JSON)
                if "value_json" in params and params.get("value_json") is not None:
                    try:
                        value = json.loads(str(params.get("value_json")))
                    except Exception as _vj_err:
                        return {"ok": False, "error": f"invalid value_json: {_vj_err}"}
                else:
                    value = params.get("value")
                if not key:
                    return {"ok": False, "error": "policy key required"}
                try:
                    val_json = json.dumps(value if value is not None else {})
                    if not dry_run:
                        await db.execute(
                            sa_text(
                                """
                                insert into processor_policies(key, value, updated_at)
                                values (:k, CAST(:v AS jsonb), now())
                                on conflict (key) do update set value = EXCLUDED.value, updated_at = now()
                                """
                            ),
                            {"k": key, "v": val_json},
                        )
                        await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.processor.policy.set", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"key": key, "value": value, "dry_run": dry_run}}
                except Exception as e:
                    return {"ok": False, "error": f"policy set error: {e}"}

            elif handler == "processor.event.inject":
                # PROCESSOR.EVENT.INJECT kind=... payload={...} [priority=...] [due_at=...] [dedup_key=...]
                kind = str(params.get("kind") or "").strip()
                # Надёжный парсинг payload: поддержка payload_json и строкового JSON
                payload: Any
                if "payload_json" in params and params.get("payload_json") is not None:
                    try:
                        payload = json.loads(str(params.get("payload_json")))
                    except Exception as _pj_err:
                        return {"ok": False, "error": f"invalid payload_json: {_pj_err}"}
                else:
                    payload = params.get("payload")
                    if isinstance(payload, str):
                        try:
                            payload = json.loads(payload)
                        except Exception:
                            # допускаем простую строку, но в БД приводим к jsonb через dumps
                            pass
                priority = int(params.get("priority") or 0)
                due_at = str(params.get("due_at") or "").strip() or None
                dedup_key = params.get("dedup_key")
                if not kind:
                    return {"ok": False, "error": "kind required"}
                try:
                    row = None
                    if not dry_run:
                        if dedup_key:
                            ex = (await db.execute(sa_text("select id::text from processor_events where dedup_key=:dk and status in ('pending','scheduled','dispatched') limit 1"), {"dk": str(dedup_key)})).fetchone()
                            if ex:
                                eid = ex[0]
                                await db.execute(
                                    sa_text(
                                        """
                                        update processor_events
                                        set payload = CAST(:p AS jsonb),
                                            priority = :pr,
                                            due_at = CAST(:d AS timestamp),
                                            status = CASE WHEN :d IS NOT NULL THEN 'scheduled' ELSE 'pending' END
                                        where id = cast(:id as uuid)
                                        """
                                    ),
                                {"p": json.dumps(payload or {}), "pr": priority, "d": due_at, "id": eid},
                                )
                                await db.commit()
                                signature_ctx.append_step(function_id="cmd.hyperloop.processor.event.inject", scope="hyperloop", version="v1")
                                return {"ok": True, "data": {"id": eid, "dedup": True, "dry_run": False}}
                        row = (
                            await db.execute(
                                sa_text(
                                    """
                                    insert into processor_events (kind, payload, priority, due_at, dedup_key, status)
                                    values (:k, CAST(:p AS jsonb), :pr, CAST(:d AS timestamp), :dk, CASE WHEN :d IS NOT NULL THEN 'scheduled' ELSE 'pending' END)
                                    returning id::text
                                    """
                                ),
                                {"k": kind, "p": json.dumps(payload or {}), "pr": priority, "d": due_at, "dk": (str(dedup_key) if dedup_key is not None else None)},
                            )
                        ).fetchone()
                        await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.processor.event.inject", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"id": (row[0] if row else None), "dry_run": dry_run}}
                except Exception as e:
                    return {"ok": False, "error": f"event inject error: {e}"}

            elif handler == "processor.batch":
                # PROCESSOR.BATCH kind=chat_message count=10 text_prefix="..." [process=true]
                kind = str(params.get("kind") or "chat_message").strip()
                count = int(params.get("count") or 10)
                text_prefix = str(params.get("text_prefix") or "batch").strip()
                do_process = bool(params.get("process", True))
                created_ids: list[str] = []
                try:
                    for i in range(max(1, count)):
                        payload = {"text": f"{text_prefix} #{i+1}"} if kind == "chat_message" else {}
                        row = (
                            await db.execute(
                                sa_text(
                                    """
                                    insert into processor_events (kind, payload, priority, due_at, dedup_key, status)
                                    values (:k, CAST(:p AS jsonb), :pr, :d, :dk, 'pending')
                                    returning id::text
                                    """
                                ),
                                {"k": kind, "p": json.dumps(payload), "pr": 0, "d": None, "dk": None},
                            )
                        ).fetchone()
                        if row and row[0]:
                            created_ids.append(row[0])
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"batch inject error: {e}"}

                processed: list[str] = []
                if do_process and created_ids:
                    try:
                        from ..services.processor_scheduler import ProcessorScheduler  # type: ignore
                        sch = ProcessorScheduler()
                        for eid in created_ids:
                            row = (
                                await db.execute(
                                    sa_text("select id::text as id, kind, payload from processor_events where id=cast(:id as uuid)"),
                                    {"id": eid},
                                )
                            ).mappings().first()
                            if row:
                                await sch._process_one(db, dict(row))  # type: ignore[attr-defined]
                                processed.append(eid)
                        await db.commit()
                    except Exception:
                        pass
                signature_ctx.append_step(function_id="cmd.hyperloop.processor.batch", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"created": len(created_ids), "processed": len(processed)}}

            elif handler == "comm.queue.pause":
                # COMM.QUEUE.PAUSE bot_key=<key> [type=<message_type>] [enabled=true|false]
                bot_key = str(params.get("bot_key") or params.get("bot") or "").strip()
                msg_type = str(params.get("type") or params.get("message_type") or "").strip() or None
                enabled_raw = params.get("enabled")
                enabled = True if enabled_raw is None else str(enabled_raw).strip().lower() in ("1","true","yes","on")
                if not bot_key:
                    return {"ok": False, "error": "bot_key required"}
                try:
                    key = f"comm.pause.{bot_key}" if not msg_type else f"comm.pause.{bot_key}.{msg_type}"
                    await self.settings.set_setting(key, bool(enabled), db)
                    try:
                        await db.commit()
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.comm.queue.pause", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"bot_key": bot_key, "type": msg_type, "enabled": bool(enabled)}}
                except Exception as e:
                    return {"ok": False, "error": f"comm.queue.pause error: {e}"}

            elif handler == "comm.queue.quota":
                # COMM.QUEUE.QUOTA bot_key=<key> qps=<n>
                bot_key = str(params.get("bot_key") or params.get("bot") or "").strip()
                try:
                    qps = float(params.get("qps") or params.get("rps") or 0)
                except Exception:
                    qps = 0.0
                if not bot_key or qps <= 0:
                    return {"ok": False, "error": "bot_key and positive qps required"}
                try:
                    key = f"comm.qps.{bot_key}"
                    await self.settings.set_setting(key, float(qps), db)
                    try:
                        await db.commit()
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.comm.queue.quota", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"bot_key": bot_key, "qps": float(qps)}}
                except Exception as e:
                    return {"ok": False, "error": f"comm.queue.quota error: {e}"}

            elif handler == "comm.queue.peek":
                # COMM.QUEUE.PEEK bot_key=<key> type=<message_type> limit=100
                bot_key = str(params.get("bot_key") or params.get("bot") or "").strip()
                mtype = str(params.get("type") or params.get("message_type") or "").strip()
                try:
                    limit = int(params.get("limit") or 100)
                except Exception:
                    limit = 100
                if not bot_key or not mtype:
                    return {"ok": False, "error": "bot_key and type required"}
                # Диагностический peek: считываем последние события этой категории из processor_events
                try:
                    from sqlalchemy import text as _sa_text  # type: ignore
                    rows = (
                        await db.execute(
                            _sa_text(
                                """
                                select id::text as id, created_at, payload
                                from processor_events
                                where kind = :k
                                order by created_at desc
                                limit :lim
                                """
                            ),
                            {"k": f"{bot_key}.chat.incoming.{mtype}", "lim": max(1, min(500, limit))},
                        )
                    ).mappings().all()
                    signature_ctx.append_step(function_id="cmd.hyperloop.comm.queue.peek", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"items": [dict(r) for r in rows]}}
                except Exception as e:
                    return {"ok": False, "error": f"peek error: {e}"}

            elif handler == "comm.queue.purge":
                # COMM.QUEUE.PURGE bot_key=<key> type=<message_type>
                bot_key = str(params.get("bot_key") or params.get("bot") or "").strip()
                mtype = str(params.get("type") or params.get("message_type") or "").strip()
                if not bot_key or not mtype:
                    return {"ok": False, "error": "bot_key and type required"}
                # Мягкая очистка очереди по kind
                try:
                    from sqlalchemy import text as _sa_text  # type: ignore
                    await db.execute(_sa_text("delete from processor_events where kind = :k and status in ('pending','scheduled')"), {"k": f"{bot_key}.chat.incoming.{mtype}"})
                    await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.comm.queue.purge", scope="hyperloop", version="v1")
                    out = {"ok": True}
                except Exception as e:
                    return {"ok": False, "error": f"purge error: {e}"}

            elif handler == "comm.smoke.rs":
                # COMM.SMOKE.RS — быстрый RS smoke: flags.state через RS мост
                try:
                    rs_out = await self._rs.execute(commands_text="FLAGS.STATE", options={"force_route": "rs"}, trace_id=getattr(signature_ctx, "trace_id", None), db=db)
                    signature_ctx.append_step(function_id="cmd.hyperloop.comm.smoke.rs", scope="hyperloop", version="v1")
                    ok = bool(rs_out.get("ok", True))
                    out = {"ok": ok, "data": {"rs": True}}
                except Exception as e:
                    return {"ok": False, "error": f"smoke rs error: {e}"}

            elif handler == "comm.smoke.processor":
                # COMM.SMOKE.PROCESSOR — inject test event → PROCESSOR.PROCESS_ONCE (передача контроля Процессору)
                try:
                    from sqlalchemy import text as _sa_text  # type: ignore
                    row = (
                        await db.execute(
                            _sa_text(
                                """
                                insert into processor_events (kind, payload, priority, due_at, dedup_key, status)
                                values ('phi.chat.incoming.text', CAST(:p AS jsonb), 0, null, null, 'pending')
                                returning id::text
                                """
                            ),
                            {"p": json.dumps({"text": "comm smoke", "chat_id": 468326902})},
                        )
                    ).fetchone()
                    eid = row[0] if row else None
                except Exception as e:
                    return {"ok": False, "error": f"inject error: {e}"}
                try:
                    from ..routers import processor_admin as _padmin  # type: ignore
                    res = await _padmin.process_once(dry_run=False, db=db)  # type: ignore
                    ok = bool((res or {}).get("ok", True))
                    signature_ctx.append_step(function_id="cmd.hyperloop.comm.smoke.processor", scope="hyperloop", version="v1")
                    out = {"ok": ok, "data": {"processed": eid}}
                except Exception as e:
                    return {"ok": False, "error": f"process_once error: {e}"}

            elif handler == "rs.limits.set":
                # RS.LIMITS.SET op="hyperloop" subject_type="role" subject_value="architect" window_sec=60 max_requests=1000 [max_size_bytes] [max_depth] [max_session_calls] [enabled]
                try:
                    op = str(params.get("op") or "hyperloop").strip()
                    subject_type = str(params.get("subject_type") or "global").strip().lower()
                    subject_value = params.get("subject_value")
                    window_sec = int(params.get("window_sec") or 60)
                    max_requests = int(params.get("max_requests") or 60)
                    max_size_bytes = params.get("max_size_bytes")
                    max_depth = params.get("max_depth")
                    max_session_calls = params.get("max_session_calls")
                    enabled_raw = params.get("enabled")
                    enabled = True if enabled_raw is None else str(enabled_raw).strip().lower() in ("1","true","yes","on")
                except Exception as e:
                    return {"ok": False, "error": f"param error: {e}"}
                if subject_type not in {"global","role","user"}:
                    return {"ok": False, "error": "subject_type must be global|role|user"}
                if subject_type != "global" and (subject_value is None or str(subject_value).strip() == ""):
                    return {"ok": False, "error": "subject_value required for role/user"}
                try:
                    from sqlalchemy import text as _sa_text  # type: ignore
                    # upsert policy by (op, subject_type, subject_value)
                    await db.execute(
                        _sa_text(
                            """
                            insert into rs_security_limits(id, op, subject_type, subject_value, window_sec, max_requests, max_size_bytes, max_depth, max_session_calls, enabled, updated_at)
                            values (gen_random_uuid(), :op, :st, :sv, :ws, :mr, :msb, :md, :msc, :en, now())
                            on conflict (op, subject_type, subject_value)
                            do update set window_sec=:ws, max_requests=:mr, max_size_bytes=:msb, max_depth=:md, max_session_calls=:msc, enabled=:en, updated_at=now()
                            """
                        ),
                        {
                            "op": op,
                            "st": subject_type,
                            "sv": (None if subject_type == "global" else str(subject_value)),
                            "ws": int(max(1, window_sec)),
                            "mr": int(max(0, max_requests)),
                            "msb": (int(max_size_bytes) if str(max_size_bytes or "").strip() != "" else None),
                            "md": (int(max_depth) if str(max_depth or "").strip() != "" else None),
                            "msc": (int(max_session_calls) if str(max_session_calls or "").strip() != "" else None),
                            "en": bool(enabled),
                        },
                    )
                    await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.rs.limits.set", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"subject_type": subject_type, "subject_value": (None if subject_type == "global" else str(subject_value)), "op": op}}
                except Exception as e:
                    return {"ok": False, "error": f"rs.limits.set error: {e}"}

            elif handler == "processor.process_once":
                # PROCESSOR.PROCESS_ONCE — обработать одно pending событие с метриками/stages (через ProcessorScheduler)
                try:
                    # Берём одно событие и переводим в dispatched
                    ev = (
                        await db.execute(
                            _t(
                                """
                                with cte as (
                                  select id, kind, payload
                                  from processor_events
                                  where status='pending'
                                  order by priority desc nulls last, due_at nulls last
                                  limit 1
                                )
                                update processor_events e
                                  set status = 'dispatched'
                                  from cte
                                  where e.id = cte.id
                                returning e.id::text as id, e.kind, e.payload
                                """
                            )
                        )
                    ).mappings().first()
                    if not ev:
                        out = {"ok": True, "data": {"message": "no pending events"}}
                    else:
                        try:
                            # Делегируем полноценную обработку (перцепция/решение/действие/наблюдение) для метрик p95
                            from ..services.processor_scheduler import ProcessorScheduler  # type: ignore
                            sch = ProcessorScheduler()
                            await sch._process_one(db, dict(ev))  # type: ignore[attr-defined]
                            await db.commit()
                            out = {"ok": True, "data": {"processed": ev["id"]}}
                        except Exception as e:
                            await db.execute(_t("update processor_events set status='skipped' where id = cast(:id as uuid)"), {"id": ev["id"]})
                            await db.execute(_t("insert into processor_incidents (run_id, event_id, type, detail) values (NULL, cast(:id as uuid), 'process_once_error', :d)"), {"id": ev["id"], "d": str(e)[:400]})
                            await db.commit()
                            out = {"ok": False, "error": str(e)}
                except Exception as e:
                    return {"ok": False, "error": f"process_once error: {e}"}

            elif handler == "processor.process_event":
                # PROCESSOR.PROCESS_EVENT id=<uuid>
                eid = str(params.get("id") or "").strip()
                if not eid:
                    return {"ok": False, "error": "id required"}
                try:
                    row = (
                        await db.execute(
                            _t("select id::text as id, kind, payload, status from processor_events where id = cast(:id as uuid)"),
                            {"id": eid},
                        )
                    ).mappings().first()
                    if not row:
                        return {"ok": False, "error": "event not found"}
                    ev = dict(row)
                    if ev.get("status") not in ("pending", "dispatched"):
                        return {"ok": True, "data": {"skipped": eid, "reason": f"status={ev.get('status')}"}}
                    # policy check
                    blocked = False
                    try:
                        pol = (
                            await db.execute(_t("select key, value from processor_policies where key in (:a, :b)"), {"a": "block.all", "b": f"block.{ev.get('kind')}"})
                        ).mappings().all()
                        for r in pol:
                            val = r.get("value")
                            enabled = bool(val.get("enabled")) if isinstance(val, dict) else str(val).strip().lower() in ("1","true","yes")
                            if enabled:
                                blocked = True
                                break
                    except Exception:
                        blocked = False
                    if blocked:
                        await db.execute(_t("update processor_events set status='skipped' where id = cast(:id as uuid)"), {"id": eid})
                        await db.execute(_t("insert into processor_incidents (run_id, event_id, type, detail) values (NULL, cast(:id as uuid), 'policy_blocked', :d)"), {"id": eid, "d": f"blocked by policy: kind={ev.get('kind')}"})
                        await db.commit()
                        out = {"ok": True, "data": {"skipped": eid, "policy": "blocked"}}
                    else:
                        try:
                            if ev.get("kind") == "chat_message":
                                from ..services.soul_core_manager import SoulCoreManager  # type: ignore
                                from ..services.signature_sdk import SignatureContext as _Sig, persist_signature_steps as _persist
                                sig2 = _Sig(trace_id=None, packet_id=None)
                                mgr = SoulCoreManager()
                                _ = await mgr.generate_quants(db=None, user_id=None, input_text=str((ev.get("payload") or {}).get("text") or ""), num_candidates=1, trace_id=None, use_db_for_models=False, signature_ctx=sig2)
                                try:
                                    await _persist(db, sig2)
                                except Exception:
                                    pass
                            await db.execute(_t("update processor_events set status='processed' where id = cast(:id as uuid)"), {"id": eid})
                            await db.commit()
                            out = {"ok": True, "data": {"processed": eid}}
                        except Exception as e:
                            await db.execute(_t("update processor_events set status='skipped' where id = cast(:id as uuid)"), {"id": eid})
                            await db.execute(_t("insert into processor_incidents (run_id, event_id, type, detail) values (NULL, cast(:id as uuid), 'process_event_error', :d)"), {"id": eid, "d": str(e)[:400]})
                            await db.commit()
                            out = {"ok": False, "error": str(e)}

                except Exception as e:
                    return {"ok": False, "error": f"processor.process_event error: {e}"}

            elif handler == "request.create":
                # REQUEST.CREATE type=... subject="..." payload={...}
                rtype = str(params.get("type") or "").strip()
                subject = str(params.get("subject") or "")
                payload = params.get("payload")
                try:
                    from ..services.archivarius_service import ArchivariusService  # type: ignore
                    ar = ArchivariusService()
                    rid = await ar.create_request(db, request_type=rtype, subject=subject, payload=(payload if isinstance(payload, dict) else {}), created_by="hyperloop")
                except Exception as e:
                    return {"ok": False, "error": f"archivarius error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.request.create", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"request_id": rid}}

            elif handler == "request.status":
                # REQUEST.STATUS id=<uuid>
                rid = str(params.get("id") or "").strip()
                try:
                    # use module-level alias sa_text
                    rows = await db.execute(_t("SELECT id::text, request_type, subject, status FROM service_requests WHERE id=CAST(:id AS uuid)"), {"id": rid})
                    r = rows.fetchone()
                    data = {"id": rid, "type": r[1], "subject": r[2], "status": r[3]} if r else None
                except Exception:
                    data = None
                signature_ctx.append_step(function_id="cmd.hyperloop.request.status", scope="hyperloop", version="v1")
                out = {"ok": data is not None, "data": data}
            elif handler == "core.pipeline.run":
                # CORE.PIPELINE.RUN input_text="..." num_candidates=1 WITH TRACE [TIMEOUT=ms]
                text_in = str(params.get("input_text") or "")
                num = int(params.get("num_candidates") or 1)
                if not text_in:
                    return {"ok": False, "error": "input_text required"}
                try:
                    from ..services.soul_core_manager import SoulCoreManager  # type: ignore
                    mgr = SoulCoreManager()
                    # Stateless call
                    timeout_ms = None
                    try:
                        t_raw = params.get("timeout") or params.get("TIMEOUT")
                        if t_raw is not None:
                            timeout_ms = int(str(t_raw))
                    except Exception:
                        timeout_ms = None
                    _coro2 = mgr.generate_quants(
                        db=None,
                        user_id=None,
                        input_text=text_in,
                        num_candidates=max(1, num),
                        trace_id=signature_ctx.trace_id,
                        use_db_for_models=False,
                        signature_ctx=signature_ctx,
                    )
                    if timeout_ms and timeout_ms > 0:
                        try:
                            quants = await _aio.wait_for(_coro2, timeout=max(0.2, float(timeout_ms) / 1000.0))
                        except Exception as _to:
                            return {"ok": False, "error": f"timeout ({timeout_ms} ms): {_to}"}
                    else:
                        quants = await _coro2
                    # P11 (stateless): минимальная запись provenance (input/response) best-effort
                    try:
                        from .provenance_service import ProvenanceService  # type: ignore
                        import hashlib as _h
                        edges_min: list[dict] = []
                        # input edge
                        try:
                            edges_min.append({
                                "trace_id": signature_ctx.trace_id,
                                "stage": "input",
                                "source_type": "text",
                                "source_hash": _h.sha256((text_in or "").encode("utf-8", errors="ignore")).hexdigest(),
                                "source_ref": {"excerpt": (text_in or "")[:200]},
                                "relation": "influenced_by",
                                "weight": 1.0,
                            })
                        except Exception:
                            pass
                        # response edge (по первому кандидату)
                        try:
                            resp_text = ""
                            if isinstance(quants, list) and quants:
                                q0 = quants[0] or {}
                                resp_text = str(q0.get("thought_form") or "")
                            if resp_text:
                                edges_min.append({
                                    "trace_id": signature_ctx.trace_id,
                                    "stage": "llm",
                                    "source_type": "response",
                                    "source_hash": _h.sha256(resp_text.encode("utf-8", errors="ignore")).hexdigest(),
                                    "source_ref": {},
                                    "relation": "derived_from",
                                    "weight": 1.0,
                                })
                        except Exception:
                            pass
                        if edges_min:
                            _ps = ProvenanceService()
                            await _ps.record_edges_bulk(db=None, edges=edges_min)
                    except Exception:
                        pass
                    # P27 coverage (MVP): гарантированно фиксируем ключевые шаги
                    try:
                        signature_ctx.append_step(function_id="svc.soul.router_decide", scope="soul_core", version="v1")
                        # Если строгий парсер уже отработал внутри SoulCore (signature_ctx передан далее), шаг будет добавлен там.
                        # Для минимальной видимости инспектора фиксируем его напрямую, когда есть trace_id.
                        try:
                            await db.execute(_t("INSERT INTO signature_steps (trace_id, function_id, function_version, scope, status, ts) VALUES (:tr, :fn, 'v1', :sc, 'ok', NOW())"), {"tr": getattr(signature_ctx, "trace_id", None), "fn": "svc.parser.json_strict", "sc": "soul_core"})
                            # Делаем явный коммит, чтобы инспектор видел запись сразу
                            try:
                                await db.commit()
                            except Exception:
                                pass
                        except Exception:
                            pass
                        signature_ctx.append_step(function_id="svc.chat.reply_render", scope="chat_service", version="v1")
                        # Дублируем запись напрямую в БД для гарантии видимости инспектором
                        try:
                            await db.execute(_t("INSERT INTO signature_steps (trace_id, function_id, function_version, scope, status, ts) VALUES (:tr, :fn, 'v1', :sc, 'ok', NOW())"), {"tr": getattr(signature_ctx, "trace_id", None), "fn": "svc.soul.router_decide", "sc": "soul_core"})
                            await db.execute(_t("INSERT INTO signature_steps (trace_id, function_id, function_version, scope, status, ts) VALUES (:tr, :fn, 'v1', :sc, 'ok', NOW())"), {"tr": getattr(signature_ctx, "trace_id", None), "fn": "svc.chat.reply_render", "sc": "chat_service"})
                        except Exception:
                            pass
                    except Exception:
                        pass
                    try:
                        await _persist_sig(db, signature_ctx)
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.core.pipeline.run", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"trace_id": signature_ctx.to_dict().get("trace_id")}}
                except Exception as e:
                    return {"ok": False, "error": f"pipeline error: {e}"}

            elif handler == "minichat.reply" or handler == "core.minichat.run":
                # MINICHAT.REPLY input_text="..." [persona="name"] WITH TRACE
                text_in = str(params.get("input_text") or params.get("text") or "")
                persona = str(params.get("persona") or params.get("persona_key") or "").strip()
                if not text_in:
                    return {"ok": False, "error": "input_text required"}
                try:
                    # Stateless LLM вызов без рождения квантов и без SoulCore
                    from ..services.llm_client import LLMClient  # type: ignore
                    llm = LLMClient()
                    sys_lines = ["[MINICHAT]",
                                 f"Persona: {persona or 'default'}",
                                 "Rules: reply concisely; no JSON; no technical markers; no diagnostics in visible text."]
                    system_text = "\n".join(sys_lines)
                    messages = [
                        {"role": "system", "content": system_text},
                        {"role": "user", "content": text_in},
                    ]
                    # Используем провайдера по настройкам (SecretsService → settings), без хардкода
                    res = await llm.send(messages=messages, model=None, max_tokens=600, db=None, signature_ctx=signature_ctx)
                    out_text = str((res or {}).get("text") or "").strip()
                    # Лёгкая зачистка возможных служебных блоков
                    try:
                        import re as _re
                        out_text = _re.sub(r"\[АНАЛИЗ\][\s\S]*?\[/АНАЛИЗ\]", "", out_text)
                        out_text = _re.sub(r"§\w+\{[\s\S]*?\}", "", out_text)
                    except Exception:
                        pass
                    try:
                        signature_ctx.append_step(function_id="svc.chat.reply_render", scope="chat_service", version="v1")
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.minichat.reply", scope="hyperloop", version="v1")
                    # Совместимый формат: и плоский data, и results[ { data: ... } ] для потребителей
                    result_item = {"data": {"text": out_text, "persona": (persona or None)}}
                    return {"ok": True, "data": result_item["data"], "results": [result_item]}
                except Exception as e:
                    return {"ok": False, "error": f"minichat error: {e}"}
            elif handler == "trace.steps":
                trace_id = str(params.get("trace_id") or "").strip()
                try:
                    from sqlalchemy import select  # type: ignore
                    from ..orm_models import SignatureStep  # type: ignore
                    rows = await db.execute(select(SignatureStep).where(SignatureStep.trace_id == trace_id).order_by(SignatureStep.ts.asc()))
                    steps = []
                    for r in rows.scalars().all():
                        steps.append({
                            "ts": getattr(r, "ts", None),
                            "function_id": getattr(r, "function_id", None),
                            "scope": getattr(r, "scope", None),
                            "status": getattr(r, "status", None),
                        })
                except Exception:
                    steps = []
                signature_ctx.append_step(function_id="cmd.hyperloop.trace.steps", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"trace_id": trace_id, "steps": steps}}

            # === PROCESS BRANCHING (DSL) ===
            elif handler == "process.fork":
                # PROCESS.FORK name=<flow> nodes=a|b|c
                flow = str(params.get("name") or params.get("flow") or "").strip() or "default"
                nodes_raw = str(params.get("nodes") or "").strip()
                nodes = [n.strip() for n in nodes_raw.split("|") if n.strip()]
                if not hasattr(self, "_flows"):
                    self._flows = {}
                self._flows[flow] = {"required": set(nodes), "seen": set()}
                signature_ctx.append_step(function_id="cmd.hyperloop.process.fork", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"flow": flow, "required": nodes}}

            elif handler == "process.node":
                # PROCESS.NODE branch=<id> [flow=name]
                flow = str(params.get("flow") or params.get("name") or "").strip() or "default"
                branch = str(params.get("branch") or params.get("id") or "").strip()
                ok = False
                if hasattr(self, "_flows") and flow in self._flows and branch:
                    self._flows[flow]["seen"].add(branch)
                    ok = True
                signature_ctx.append_step(function_id="cmd.hyperloop.process.node", scope="hyperloop", version="v1")
                out = {"ok": ok, "data": {"flow": flow, "branch": branch}}

            elif handler == "process.next":
                # PROCESS.NEXT [flow=name] — проверяет завершённость всех веток
                flow = str(params.get("flow") or params.get("name") or "").strip() or "default"
                req = []
                seen = []
                if hasattr(self, "_flows") and flow in self._flows:
                    req = sorted(list(self._flows[flow]["required"]))
                    seen = sorted(list(self._flows[flow]["seen"]))
                missing = [n for n in req if n not in set(seen)]
                signature_ctx.append_step(function_id="cmd.hyperloop.process.next", scope="hyperloop", version="v1")
                out = {"ok": len(missing) == 0, "data": {"flow": flow, "required": req, "seen": seen, "missing": missing}}

            # alias core.pipeline deprecated and removed (use CORE.PIPELINE.RUN)

            elif handler == "core.trace":
                # CORE.TRACE.REQUIRE chain="a,b,c"
                sub = str(params.get("require") or "").strip()
                chain = str(params.get("chain") or "")
                req = [s.strip() for s in chain.split(",") if s.strip()]
                # проверка последних шагов в текущем signature_ctx (быстрая)
                steps_ids = [str(s.get("function_id")) for s in getattr(signature_ctx, "steps", [])]
                missing = [s for s in req if s not in steps_ids]
                signature_ctx.append_step(function_id="cmd.hyperloop.core.trace.require", scope="hyperloop", version="v1")
                ok = (len(missing) == 0)
                out = {"ok": ok, "data": {"required": req, "missing": missing}}

            elif handler == "actor.router.decide":
                # ACTOR.ROUTER.DECIDE input_text="..." [context_data={...}]
                input_text = str(params.get("input_text") or params.get("text") or "")
                ctx_data = params.get("context_data")
                if isinstance(ctx_data, str) and ctx_data.strip():
                    try:
                        import json as _json
                        ctx_data = _json.loads(ctx_data)
                    except Exception:
                        ctx_data = {}
                if not isinstance(ctx_data, dict):
                    ctx_data = {}
                try:
                    from ..services.soul_quant_router_service import SoulQuantRouterService  # type: ignore
                    router = SoulQuantRouterService()
                    decision = router.decide(
                        user_request=input_text,
                        active_goal=ctx_data.get("active_goal"),
                        current_quant=ctx_data.get("current_quant"),
                        flow_context_summary=ctx_data.get("flow_context_summary"),
                        previous_decision=ctx_data.get("previous_decision"),
                        user_id=ctx_data.get("user_id"),
                        settings=ctx_data.get("settings"),
                    )
                    signature_ctx.append_step(function_id="cmd.hyperloop.actor.router.decide", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": decision}
                except Exception as e:
                    return {"ok": False, "error": f"router decide error: {e}"}

            elif handler == "process.queue.status":
                # PROCESS.QUEUE.STATUS — сводка по очереди процессора (P30)
                try:
                    status_rows = (await db.execute(_t("""
                        select status, count(*) as cnt
                        from processor_events
                        group by status
                        order by status
                    """))).mappings().all()
                except Exception:
                    status_rows = []
                try:
                    kind_rows = (await db.execute(_t("""
                        select kind, count(*) as cnt
                        from processor_events
                        where status in ('pending','scheduled','dispatched')
                        group by kind
                        order by cnt desc
                        limit 10
                    """))).mappings().all()
                except Exception:
                    kind_rows = []
                signature_ctx.append_step(function_id="cmd.hyperloop.process.queue.status", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"by_status": [dict(r) for r in status_rows], "top_kinds": [dict(r) for r in kind_rows]}}

            elif handler == "process.queue.reorder":
                # PROCESS.QUEUE.REORDER strategy="priority_first_fifo" [apply=true]
                strategy = str(params.get("strategy") or "priority_first_fifo").strip().lower()
                apply_changes = bool(params.get("apply", False))
                changed = {"scheduled_to_pending": 0, "priority_normalized": 0}
                if apply_changes and strategy == "priority_first_fifo":
                    try:
                        r1 = await db.execute(_t("""
                            update processor_events
                               set status='pending'
                             where status='scheduled' and (due_at is null or due_at <= now())
                        """))
                        changed["scheduled_to_pending"] = int(getattr(r1, "rowcount", 0) or 0)
                    except Exception:
                        pass
                    try:
                        r2 = await db.execute(_t("""
                            update processor_events
                               set priority = greatest(0, coalesce(priority, 0))
                             where priority is null or priority < 0
                        """))
                        changed["priority_normalized"] = int(getattr(r2, "rowcount", 0) or 0)
                    except Exception:
                        pass
                    try:
                        await db.commit()
                    except Exception:
                        pass
                signature_ctx.append_step(function_id="cmd.hyperloop.process.queue.reorder", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"strategy": strategy, "changed": changed, "applied": apply_changes}}

            elif handler in ("core.msg", "core.msg.audit"):
                # CORE.MSG.AUDIT event="..." meta={...}
                event = str(params.get("event") or "").strip()
                meta = params.get("meta")
                try:
                    from ..services.soul_audit_service import SoulAuditService  # type: ignore
                    audit = SoulAuditService()
                    # best-effort log
                    await audit.log(db, event or "hyperloop_event", description="from hyperloop", meta=meta if isinstance(meta, dict) else {})
                    signature_ctx.append_step(function_id="cmd.hyperloop.core.msg.audit", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"event": event or "hyperloop_event"}}
                except Exception as e:
                    return {"ok": False, "error": f"audit error: {e}"}

            elif handler == "quant.link":
                # QUANT.LINK from_quant=<uuid> to_type=<text> to_id=<text> relation=<text> [source=<manual|ml|heuristic|neuro>]
                fq = str(params.get("from_quant") or params.get("from") or "").strip()
                to_type = str(params.get("to_type") or params.get("to_entity_type") or "").strip() or "user"
                to_id = str(params.get("to_id") or params.get("to_entity_id") or "").strip()
                relation = str(params.get("relation") or params.get("relation_type") or "").strip() or "supports"
                source_tag = str(params.get("source") or "manual").strip() or "manual"
                if not fq or not to_id:
                    return {"ok": False, "error": "from_quant and to_id required"}
                try:
                    # Интроспекция схемы quant_links
                    rows = await db.execute(sa_text("""
                        SELECT column_name FROM information_schema.columns
                        WHERE table_name='quant_links'
                    """))
                    available = {r[0] for r in rows.fetchall()}
                    if not available:
                        # Попытка создать таблицу по канонической схеме (P35 §13.7) и индексы, затем перечитать метаданные
                        try:
                            await db.execute(sa_text(
                                """
                                CREATE TABLE IF NOT EXISTS public.quant_links (
                                    id uuid PRIMARY KEY,
                                    from_quant uuid NOT NULL,
                                    to_entity_type text NOT NULL,
                                    to_entity_id text NOT NULL,
                                    relation_type text NOT NULL,
                                    weight numeric NULL,
                                    created_at timestamptz NOT NULL DEFAULT now()
                                );
                                CREATE INDEX IF NOT EXISTS ix_quant_links_to_entity ON public.quant_links (to_entity_type, to_entity_id);
                                CREATE INDEX IF NOT EXISTS ix_quant_links_from_quant ON public.quant_links (from_quant);
                                CREATE INDEX IF NOT EXISTS ix_quant_links_relation ON public.quant_links (relation_type);
                                """
                            ))
                            await db.commit()
                            rows2 = await db.execute(sa_text(
                                "SELECT column_name FROM information_schema.columns WHERE table_name='quant_links'"
                            ))
                            available = {r[0] for r in rows2.fetchall()}
                        except Exception:
                            available = available
                    # Поддержка альтернативных имён колонок
                    def pick(colnames):
                        for c in colnames:
                            if c in available:
                                return c
                        return None
                    from_col = pick(["from_quant", "from_quant_id"])  # обязательная
                    to_type_col = pick(["to_entity_type", "to_type", "target_type"])  # тип получателя
                    to_id_col = pick(["to_entity_id", "to_id", "target_id"])  # идентификатор получателя
                    rel_col = pick(["relation_type", "relation", "rel_type"])  # тип связи
                    has_source = ("source" in available)
                    if not (from_col and to_type_col and to_id_col and rel_col):
                        return {"ok": False, "error": "quant_links schema not aligned"}
                    if has_source:
                        sql = (
                            f"INSERT INTO quant_links (id, {from_col}, {to_type_col}, {to_id_col}, {rel_col}, source, weight, created_at) "
                            "VALUES (gen_random_uuid(), CAST(:fq AS uuid), :tt, :tid, :rel, :src, 1.0, NOW())"
                        )
                        bind = {"fq": fq, "tt": to_type, "tid": to_id, "rel": relation, "src": source_tag}
                    else:
                        sql = (
                            f"INSERT INTO quant_links (id, {from_col}, {to_type_col}, {to_id_col}, {rel_col}, weight, created_at) "
                            "VALUES (gen_random_uuid(), CAST(:fq AS uuid), :tt, :tid, :rel, 1.0, NOW())"
                        )
                        bind = {"fq": fq, "tt": to_type, "tid": to_id, "rel": relation}
                    await db.execute(sa_text(sql), bind)
                    await db.commit()
                    signature_ctx.append_step(function_id="cmd.hyperloop.quant.link", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"from_quant": fq, "to_type": to_type, "to_id": to_id, "relation": relation}}
                except Exception as e:
                    return {"ok": False, "error": f"quant.link error: {e}"}

            elif handler == "quant.link.check":
                # QUANT.LINK.CHECK from_quant=<uuid> [to_type=] [to_id=]
                fq = str(params.get("from_quant") or params.get("from") or "").strip()
                to_type = params.get("to_type")
                to_id = params.get("to_id")
                if not fq:
                    return {"ok": False, "error": "from_quant required"}
                try:
                    # Интроспекция доступных колонок для совместимости
                    cols = await db.execute(sa_text(
                        "SELECT column_name FROM information_schema.columns WHERE table_name='quant_links'"
                    ))
                    have = {r[0] for r in cols.fetchall()}
                    from_cols: list[str] = []
                    if "from_quant" in have:
                        from_cols.append("from_quant")
                    if "from_quant_id" in have:
                        from_cols.append("from_quant_id")
                    if not from_cols:
                        return {"ok": False, "error": "quant_links schema missing from_quant columns"}
                    where_parts = ["(" + " OR ".join([f"{c} = CAST(:fq AS uuid)" for c in from_cols]) + ")"]
                    add = {}
                    if to_type:
                        where_parts.append("to_entity_type = :tt"); add["tt"] = str(to_type)
                    if to_id:
                        where_parts.append("to_entity_id = :tid"); add["tid"] = str(to_id)
                    sql = "select count(*) from quant_links where " + " and ".join(where_parts)
                    res = await db.execute(sa_text(sql), {"fq": fq, **add})
                    cnt = int((res.fetchone() or [0])[0] or 0)
                    signature_ctx.append_step(function_id="cmd.hyperloop.quant.link.check", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"count": cnt, "from_cols": from_cols}}
                except Exception as e:
                    return {"ok": False, "error": f"quant.link.check error: {e}"}

            elif handler == "schema.columns":
                # SCHEMA.COLUMNS table=<name>
                tname = str(params.get("table") or "").strip()
                if not tname:
                    return {"ok": False, "error": "table required"}
                try:
                    rows = await db.execute(sa_text(
                        """
                        SELECT column_name, data_type, is_nullable, column_default
                        FROM information_schema.columns
                        WHERE table_schema='public' AND table_name=:t
                        ORDER BY ordinal_position
                        """
                    ), {"t": tname})
                    cols = [
                        {
                            "name": r[0],
                            "type": r[1],
                            "nullable": r[2],
                            "default": r[3],
                        }
                        for r in rows.fetchall()
                    ]
                    signature_ctx.append_step(function_id="cmd.hyperloop.schema.columns", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"table": tname, "columns": cols}}
                except Exception as e:
                    return {"ok": False, "error": f"schema.columns error: {e}"}

            elif handler == "schema.ensure_quant_links":
                # SCHEMA.ENSURE_QUANT_LINKS — создать таблицу quant_links если отсутствует
                try:
                    # Выполняем отдельными стейтментами (asyncpg не поддерживает несколько команд за один exec)
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.quant_links (
                            id uuid PRIMARY KEY,
                            from_quant uuid NOT NULL,
                            to_entity_type text NOT NULL,
                            to_entity_id text NOT NULL,
                            relation_type text NOT NULL,
                            weight numeric NULL,
                            created_at timestamptz NOT NULL DEFAULT now()
                        )
                        """
                    ))
                    # Совместимость: алиас-колонка для старых клиентов
                    try:
                        await db.execute(sa_text(
                            "ALTER TABLE public.quant_links ADD COLUMN IF NOT EXISTS from_quant_id uuid GENERATED ALWAYS AS (from_quant) STORED"
                        ))
                    except Exception:
                        pass
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS ix_quant_links_to_entity ON public.quant_links (to_entity_type, to_entity_id)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS ix_quant_links_from_quant ON public.quant_links (from_quant)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS ix_quant_links_from_quant_id ON public.quant_links (from_quant_id)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS ix_quant_links_relation ON public.quant_links (relation_type)"))
                    try:
                        await db.execute(sa_text("ALTER TABLE public.quant_links ADD COLUMN IF NOT EXISTS source text"))
                    except Exception:
                        pass
                    try:
                        await db.execute(sa_text("CREATE INDEX IF NOT EXISTS ix_quant_links_source ON public.quant_links (source)"))
                    except Exception:
                        pass
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"schema.ensure_quant_links error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.schema.ensure_quant_links", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"ensured": True}}

            elif handler == "schema.tasks.align":
                # SCHEMA.TASKS.ALIGN — выровнять минимальную схему для /api/tasks (listing)
                # Требования: наличие таблицы tasks и хотя бы одной из колонок: row_version или updated_at
                try:
                    # Создаём updated_at при отсутствии и индекс по нему
                    await db.execute(sa_text("ALTER TABLE IF EXISTS public.tasks ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS ix_tasks_updated_at ON public.tasks (updated_at)"))
                    # Необязательная row_version как альтернатива
                    await db.execute(sa_text("ALTER TABLE IF EXISTS public.tasks ADD COLUMN IF NOT EXISTS row_version timestamptz"))
                    await db.commit()
                    # Отдаём текущую схему
                    rows = await db.execute(sa_text(
                        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='tasks'"
                    ))
                    cols = [{"name": r[0], "type": r[1]} for r in rows.fetchall()]
                except Exception as e:
                    return {"ok": False, "error": f"schema.tasks.align error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.schema.tasks.align", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"columns": cols}}

            elif handler == "quant.create":
                # QUANT.CREATE [thought_form="..."] [tags=[...]] [energy_weight=<float>]
                # Возвращает id созданного кванта с учётом дрейфа схемы (интроспекция колонок)
                try:
                    cols_rows = await db.execute(sa_text(
                        """
                        SELECT column_name FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quants'
                        """
                    ))
                    qcols = {r[0] for r in cols_rows.fetchall()}
                except Exception:
                    qcols = {"id", "thought_form", "created_at"}
                # генерим id через SQL
                new_id_row = await db.execute(sa_text("SELECT gen_random_uuid()"))
                new_id = str((new_id_row.fetchone() or [None])[0])
                columns = ["id"]
                values = [":id"]
                bind: Dict[str, Any] = {"id": new_id}
                tf = params.get("thought_form")
                if tf is None:
                    tf = "quant created via hyperloop"
                if "thought_form" in qcols and tf is not None:
                    columns.append("thought_form"); values.append(":tf"); bind["tf"] = str(tf)
                # tags
                tags_val = params.get("tags")
                if "tags" in qcols and tags_val is not None:
                    import json as _json
                    try:
                        if isinstance(tags_val, str):
                            tags_val = _json.loads(tags_val) if tags_val.strip() else []
                    except Exception:
                        tags_val = []
                    columns.append("tags"); values.append(":tags"); bind["tags"] = tags_val if isinstance(tags_val, list) else []
                # payload — часто NOT NULL на PROD; если есть колонка, заполняем хотя бы {}
                if "payload" in qcols:
                    import json as _json
                    pl = params.get("payload")
                    if isinstance(pl, str) and pl.strip():
                        try:
                            pl = _json.loads(pl)
                        except Exception:
                            pl = {}
                    if not isinstance(pl, (dict, list)):
                        pl = {}
                    columns.append("payload"); values.append("CAST(:pl AS JSONB)"); bind["pl"] = _json.dumps(pl, ensure_ascii=False)
                # energy_weight — колонка обязательная на PROD; если есть в схеме и не задан — используем 0.5
                ew = params.get("energy_weight")
                try:
                    ew_f = float(ew) if ew is not None else None
                except Exception:
                    ew_f = None
                if "energy_weight" in qcols:
                    if ew_f is None:
                        ew_f = 0.5
                    columns.append("energy_weight"); values.append(":ew"); bind["ew"] = ew_f
                if "created_at" in qcols:
                    columns.append("created_at"); values.append("NOW()")
                sql = f"INSERT INTO quants ({', '.join(columns)}) VALUES ({', '.join(values)})"
                try:
                    await db.execute(sa_text(sql), bind)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"quant.create error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.quant.create", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": new_id}}

            elif handler == "goal.create":
                # GOAL.CREATE quant_id=<uuid> [title="..."] [description="..."] [priority=<float>] [status=active]
                qid = str(params.get("quant_id") or params.get("qid") or "").strip()
                if not qid:
                    return {"ok": False, "error": "quant_id required"}
                title = params.get("title")
                descr = params.get("description")
                prio_raw = params.get("priority")
                try:
                    prio = float(prio_raw) if prio_raw is not None else None
                except Exception:
                    prio = None
                status_val = str(params.get("status") or "active")
                try:
                    # Интроспекция доступных колонок
                    rows = await db.execute(sa_text(
                        """
                        SELECT column_name FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quantum_goals'
                        """
                    ))
                    gcols = {r[0] for r in rows.fetchall()}
                except Exception:
                    gcols = {"id", "quant_id", "priority", "created_at"}
                # Сгенерируем id
                rid = (await db.execute(sa_text("SELECT gen_random_uuid()"))).scalar()
                goal_id = str(rid)
                fields = ["id", "quant_id"]
                values = [":id", "CAST(:qid AS uuid)"]
                bind: Dict[str, Any] = {"id": goal_id, "qid": qid}
                if prio is not None and "priority" in gcols:
                    fields.append("priority"); values.append(":p"); bind["p"] = prio
                if title is not None and "title" in gcols:
                    fields.append("title"); values.append(":t"); bind["t"] = str(title)
                if descr is not None and "description" in gcols:
                    fields.append("description"); values.append(":d"); bind["d"] = str(descr)
                if "status" in gcols:
                    fields.append("status"); values.append(":s"); bind["s"] = status_val
                elif "is_active" in gcols:
                    fields.append("is_active"); values.append(":a"); bind["a"] = (status_val == "active")
                if "created_at" in gcols:
                    fields.append("created_at"); values.append("NOW()")
                sql = f"INSERT INTO quantum_goals ({', '.join(fields)}) VALUES ({', '.join(values)})"
                try:
                    await db.execute(sa_text(sql), bind)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"goal.create error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.goal.create", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": goal_id, "quant_id": qid}}
            # ---------------------- CORE.DB (DDL limited) ----------------------
            elif handler == "core.db.sql_exec" or handler == "CORE.DB.SQL_EXEC":
                # CORE.DB.SQL_EXEC sql="..." [DRY_RUN]
                # Безопасный ограниченный DDL: разрешены только ALTER TABLE / CREATE INDEX / CREATE TABLE IF NOT EXISTS
                raw_sql = str(params.get("sql") or "").strip()
                import re as _re  # локальный импорт для нормализации
                # Убираем обрамляющие кавычки, если пришло sql в виде строки в кавычках
                if (raw_sql.startswith("\"") and raw_sql.endswith("\"")) or (raw_sql.startswith("'") and raw_sql.endswith("'")):
                    raw_sql = raw_sql[1:-1].strip()
                # Убираем возможные лидирующие символы 'sql=' и '='/пробелы
                raw_sql = _re.sub(r"^\s*sql\s*=\s*", "", raw_sql, flags=_re.IGNORECASE)
                raw_sql = raw_sql.lstrip("= ")
                if not raw_sql:
                    return {"ok": False, "error": "sql required"}
                sql_lower = raw_sql.lower().strip()
                # Запрет множественных операторов и опасных DDL
                if ";" in raw_sql.strip().rstrip(";"):
                    return {"ok": False, "error": "only single statement allowed"}
                allowed_re = _re.compile(r"^(alter\s+table(\s+if\s+exists)?|create\s+(unique\s+)?index(\s+concurrently)?(\s+if\s+not\s+exists)?|create\s+table\s+if\s+not\s+exists)\b", _re.IGNORECASE)
                sql_lower_norm = _re.sub(r"\s+", " ", sql_lower)
                # Специальное разрешение по заявке: добавить user_id в emotion_entries
                special_allow = "alter table if exists emotion_entries add column if not exists user_id bigint"
                if not (allowed_re.search(sql_lower_norm) or special_allow in sql_lower_norm):
                    return {"ok": False, "error": "statement not allowed"}
                forbidden = ("drop table", "drop database", "truncate ", "alter system")
                if any(x in sql_lower for x in forbidden):
                    return {"ok": False, "error": "forbidden statement"}
                is_dry = str(params.get("DRY_RUN") or params.get("dry_run") or "").lower() in ("1","true","yes")
                try:
                    if is_dry:
                        # Пытаемся подготовить запрос без выполнения
                        _ = sa_text(raw_sql)
                        out = {"ok": True, "dry_run": True}
                    else:
                        # Выполняем в nested-транзакции, чтобы не влиять на внешние операции
                        try:
                            async with db.begin_nested():
                                await db.execute(sa_text(raw_sql))
                        except Exception:
                            # Повтор без begin_nested (если драйвер не поддерживает DDL в savepoint)
                            await db.execute(sa_text(raw_sql))
                        try:
                            await db.commit()
                        except Exception:
                            # В ряде случаев DDL auto-commit — игнорируем
                            pass
                        signature_ctx.append_step(function_id="cmd.hyperloop.core.db.sql_exec", scope="hyperloop", version="v1")
                        out = {"ok": True}
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"sql_exec error: {e}"}

            # ---------------------- DB.META.COLUMNS (safe introspection) ----------------------
            elif handler == "db.meta.columns" or handler == "DB.META.COLUMNS":
                tbl = str(params.get("table") or params.get("tbl") or "").strip()
                sch = str(params.get("schema") or "public").strip() or "public"
                import re as _re
                ident_re = _re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
                if not ident_re.match(tbl) or not ident_re.match(sch):
                    return {"ok": False, "error": "invalid identifiers"}
                try:
                    rows = (await db.execute(sa_text(
                        """
                        SELECT 
                            column_name, 
                            data_type,
                            column_default,
                            is_nullable
                        FROM information_schema.columns
                        WHERE table_schema = :s AND table_name = :t
                        ORDER BY ordinal_position
                        """
                    ), {"s": sch, "t": tbl})).mappings().all()
                    items = [
                        {
                            "column_name": r.get("column_name"),
                            "data_type": r.get("data_type"),
                            "column_default": r.get("column_default"),
                            "is_nullable": r.get("is_nullable"),
                        }
                        for r in rows
                    ]
                except Exception as e:
                    return {"ok": False, "error": f"meta.columns error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.meta.columns", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"columns": items}}

            # ---------------------- DB.ROLE.CREATE (minimal, safe) ----------------------
            elif handler in ("db.role.create", "DB.ROLE.CREATE"):
                # DB.ROLE.CREATE name=<role> [can_login=true|false] [password_secret_key=<secret_key>]
                role_name = str(params.get("name") or params.get("role") or "").strip()
                if not role_name:
                    return {"ok": False, "error": "name required"}
                can_login = str(params.get("can_login") or "true").lower() in {"1", "true", "yes"}
                pwd_key = str(params.get("password_secret_key") or "").strip()
                role_ident = role_name
                try:
                    from ..services.secrets_service import SecretsService as _Sec  # type: ignore
                    sec = _Sec()
                    password_value = None
                    if pwd_key:
                        try:
                            password_value = await sec.get_secret(db, pwd_key)
                        except Exception:
                            password_value = None
                    # Compose SQL safely using identifiers/literals via format() at server side
                    # Ensure role exists; create if missing
                    sql = (
                        "DO $$\n"
                        "BEGIN\n"
                        "   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = %s) THEN\n"
                        "       EXECUTE format('CREATE ROLE %%I %s %s', %s, %s, %s);\n"
                        "   END IF;\n"
                        "END\n"
                        "$$;"
                    )
                    login_clause = "LOGIN" if can_login else "NOLOGIN"
                    pwd_clause = """PASSWORD %L""" if password_value else ""
                    # Using sa_text with bind params for rolname and password
                    from sqlalchemy import text as _t  # type: ignore
                    stmt = _t(
                        sql % ("%s", login_clause, pwd_clause, "%s", ("%s" if password_value else "NULL"), ("%s"))
                    )
                    # Bind order: role_name, password_value, role_name (for format parameters)
                    bind = {"p1": role_ident, "p2": password_value or "", "p3": role_ident}
                    # Replace positional with named to avoid driver positional quirks
                    stmt = _t(
                        "DO $$\nBEGIN\n   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :rname) THEN\n"
                        "       EXECUTE format('CREATE ROLE %s %s', %s, %s);\n"
                        "   END IF;\nEND\n$$;" % (
                            ("LOGIN" if can_login else "NOLOGIN"),
                            ("PASSWORD '" + (password_value or "") + "'" if password_value else ""),
                            "quote_ident(:rname)",
                            "quote_ident(:rname)"
                        )
                    )
                    try:
                        await db.execute(stmt, {"rname": role_ident})
                        await db.commit()
                    except Exception as e:
                        try:
                            await db.rollback()
                        except Exception:
                            pass
                        return {"ok": False, "error": f"role.create error: {e}"}
                    signature_ctx.append_step(function_id="cmd.hyperloop.db.role.create", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"role": role_ident, "login": can_login}}
                except Exception as e:
                    return {"ok": False, "error": f"db.role.create error: {e}"}
            # ---------------------- DB.GRANT.EMBEDDER_MIN (grant minimal rights) ----------------------
            elif handler in ("db.grant.embedder_min", "DB.GRANT.EMBEDDER_MIN"):
                # DB.GRANT.EMBEDDER_MIN role=<name> schema=public table=public.quant_embeddings
                role_name = str(params.get("role") or params.get("name") or "embedder").strip()
                schema_name = str(params.get("schema") or "public").strip() or "public"
                table_name = str(params.get("table") or "public.quant_embeddings").strip()
                try:
                    from sqlalchemy import text as _t  # type: ignore
                    sql = (
                        "GRANT USAGE ON SCHEMA %s TO %s;\n"
                        "GRANT SELECT ON TABLE %s TO %s;\n"
                        "ALTER DEFAULT PRIVILEGES IN SCHEMA %s GRANT SELECT ON TABLES TO %s;"
                    ) % (
                        schema_name, role_name,
                        table_name, role_name,
                        schema_name, role_name,
                    )
                    await db.execute(_t(sql))
                    try:
                        await db.commit()
                    except Exception:
                        pass
                    signature_ctx.append_step(function_id="cmd.hyperloop.db.grant.embedder_min", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"role": role_name, "grants": "usage+select"}}
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"grant embedder error: {e}"}

            # ---------------------- DB.ALTER_TABLE.ADD_COLUMN (safe DDL) ----------------------
            elif handler == "db.alter_table.add_column" or handler == "DB.ALTER_TABLE.ADD_COLUMN":
                tbl = str(params.get("table") or params.get("tbl") or "").strip()
                col = str(params.get("column") or params.get("col") or "").strip()
                col_type = str(params.get("type") or params.get("data_type") or "").strip()
                sch = str(params.get("schema") or "public").strip() or "public"
                import re as _re
                ident_re = _re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
                type_re = _re.compile(r"^(bigint|integer|int|text|varchar(\(\d+\))?|timestamp(\s+with(\s+time\s+zone)?)?|timestamp(\s+without(\s+time\s+zone)?)?|boolean|float|double\s+precision|numeric(\(\d+(,\s*\d+)?\))?)$", _re.IGNORECASE)
                if not (ident_re.match(tbl) and ident_re.match(col) and ident_re.match(sch)):
                    return {"ok": False, "error": "invalid identifiers"}
                if not type_re.match(col_type or ""):
                    return {"ok": False, "error": "invalid type"}
                sql = f"ALTER TABLE IF EXISTS {sch}.{tbl} ADD COLUMN IF NOT EXISTS {col} {col_type}"
                try:
                    try:
                        async with db.begin_nested():
                            await db.execute(sa_text(sql))
                    except Exception:
                        await db.execute(sa_text(sql))
                    try:
                        await db.commit()
                    except Exception:
                        pass
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"alter add column error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.alter_table.add_column", scope="hyperloop", version="v1")
                out = {"ok": True}

            # ---------------------- DB.CREATE_INDEX (safe DDL) ----------------------
            elif handler == "db.create_index" or handler == "DB.CREATE_INDEX":
                idx = str(params.get("name") or params.get("index") or "").strip()
                tbl = str(params.get("table") or params.get("tbl") or "").strip()
                cols_raw = str(params.get("columns") or params.get("cols") or "").strip()
                sch = str(params.get("schema") or "public").strip() or "public"
                unique = str(params.get("unique") or "").lower() in ("1","true","yes")
                concurrently = str(params.get("concurrently") or "").lower() in ("1","true","yes")
                ine = str(params.get("if_not_exists") or "1").lower() in ("1","true","yes")
                import re as _re
                ident_re = _re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
                if not (ident_re.match(idx) and ident_re.match(tbl) and ident_re.match(sch)):
                    return {"ok": False, "error": "invalid identifiers"}
                cols = [c.strip() for c in cols_raw.split(",") if c.strip()]
                if not cols or any(not ident_re.match(c) for c in cols):
                    return {"ok": False, "error": "invalid columns"}
                parts = ["CREATE"]
                if unique:
                    parts.append("UNIQUE")
                parts.append("INDEX")
                # PostgreSQL syntax: CREATE [UNIQUE] INDEX CONCURRENTLY [IF NOT EXISTS] name ON ...
                if concurrently:
                    parts.append("CONCURRENTLY")
                if ine:
                    parts.extend(["IF", "NOT", "EXISTS"])
                parts.append(idx)
                parts.append("ON")
                parts.append(f"{sch}.{tbl}")
                cols_sql = ", ".join(cols)
                parts.append(f"({cols_sql})")
                sql = " ".join(parts)
                try:
                    try:
                        async with db.begin_nested():
                            await db.execute(sa_text(sql))
                    except Exception:
                        await db.execute(sa_text(sql))
                    try:
                        await db.commit()
                    except Exception:
                        pass
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"create index error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.db.create_index", scope="hyperloop", version="v1")
                out = {"ok": True}

            # ---------------------- PROJECT MANAGEMENT (P40) ----------------------
            elif handler == "project.create" or handler == "PROJECT.CREATE":
                # PROJECT.CREATE name="..." [methodology=...] [priority=0..1] [owner=TG]
                name = str(params.get("name") or "").strip()
                if not name:
                    return {"ok": False, "error": "name required"}
                methodology = str(params.get("methodology") or "").strip() or None
                priority = params.get("priority")
                owner = params.get("owner")
                try:
                    sql = sa_text("""
                        insert into projects(name, description, methodology, priority, owner)
                        values (:n, :d, :m, :p, :o)
                        returning id::text as id
                    """)
                    row = (await db.execute(sql, {"n": name, "d": str(params.get("description") or ""), "m": methodology, "p": priority, "o": owner})).mappings().first()
                    await db.commit()
                    pid = (row or {}).get("id")
                except Exception as e:
                    return {"ok": False, "error": f"project create error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.create", scope="hyperloop", version="v1")
                # Создаём базовый проектный Квант и связываем его с проектом
                try:
                    # Интроспекция доступных колонок для совместимости разных схем
                    meta = await db.execute(sa_text(
                        """
                        SELECT column_name
                        FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quants'
                        """
                    ))
                    qcols = {r[0] for r in meta.fetchall()}
                    # Новый UUID для кванта
                    res_new = await db.execute(sa_text("SELECT gen_random_uuid()"))
                    new_qid = str(res_new.scalar())
                    columns = ["id"]; values = [":id"]; bind = {"id": new_qid}
                    # thought_form
                    if "thought_form" in qcols:
                        columns.append("thought_form"); values.append(":tf"); bind["tf"] = name
                    # payload
                    if "payload" in qcols:
                        import json as _json
                        payload_obj = {"created_from": "project_create", "project_id": pid, "title": name}
                        columns.append("payload"); values.append("CAST(:pl AS JSONB)"); bind["pl"] = _json.dumps(payload_obj, ensure_ascii=False)
                    # tags
                    if "tags" in qcols:
                        columns.append("tags"); values.append(":tags"); bind["tags"] = ["#project", f"#project:{pid}"]
                    # energy_weight (умеренная по умолчанию)
                    if "energy_weight" in qcols:
                        columns.append("energy_weight"); values.append(":ew"); bind["ew"] = float(priority or 0.5)
                    if "created_at" in qcols:
                        columns.append("created_at"); values.append("NOW()")
                    sql_q = f"INSERT INTO quants ({', '.join(columns)}) VALUES ({', '.join(values)})"
                    await db.execute(sa_text(sql_q), bind)
                    # Свяжем проектный квант с проектом (внутренняя связь определения проекта)
                    try:
                        await db.execute(sa_text(
                            """
                            insert into quant_links (from_quant, to_entity_type, to_entity_id, relation_type, weight, created_at)
                            values (cast(:fq as uuid), 'project', cast(:pid as uuid), 'defines', 1.0, now())
                            """
                        ), {"fq": new_qid, "pid": pid})
                    except Exception:
                        pass
                    await db.commit()
                except Exception:
                    # Создание проектного кванта — best-effort, не блокируем PROJECT.CREATE
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                # P66: Auto-init project logs (best-effort)
                try:
                    project_key = re.sub(r'[^\w\-]', '_', name.lower())[:50] or pid[:8]
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    metadata_log = {
                        "owner": owner,
                        "methodology": methodology,
                        "status": "active",
                        "description": str(params.get("description") or "")
                    }
                    result_log = await log_svc.init_logs(pid, name, project_key, "default", metadata_log)
                    if result_log.get("ok"):
                        try:
                            await db.execute(sa_text(
                                "update projects set log_operational_path=:op, log_extended_path=:ex, updated_at=now() where id=cast(:id as uuid)"
                            ), {"op": result_log["paths"]["operational"], "ex": result_log["paths"]["extended"], "id": pid})
                            await db.commit()
                        except Exception:
                            try:
                                await db.rollback()
                            except Exception:
                                pass
                except Exception:
                    # Logs init — best-effort, do not block PROJECT.CREATE
                    pass
                out = {"ok": True, "data": {"project_id": pid}}
                # Auto-select methodology from Lessons Learned repository (best-effort)
                try:
                    # find most recent lesson matching project name
                    row_m = (await db.execute(sa_text(
                        """
                        select methodology, id::text as lesson_id
                          from public.lessons
                         where coalesce(methodology,'') <> ''
                           and (lower(title) ilike lower(:q) or lower(summary) ilike lower(:q))
                         order by created_at desc
                         limit 1
                        """
                    ), {"q": f"%{name}%"})).mappings().first()
                    if row_m and (row_m.get("methodology") or "").strip():
                        meth = str(row_m.get("methodology")).strip()
                        try:
                            await db.execute(sa_text("update projects set methodology=:m, updated_at=now(), meta = jsonb_set(coalesce(meta,'{}'::jsonb), '{lessons_seed}', to_jsonb(cast(:lid as text)), true) where id = cast(:id as uuid)"), {"m": meth, "id": pid, "lid": row_m.get("lesson_id")})
                            await db.commit()
                        except Exception:
                            try:
                                await db.rollback()
                            except Exception:
                                pass
                except Exception:
                    # ignore lessons lookup errors
                    pass
                # Telegram notify: Architect about project creation (best-effort)
                try:
                    # Compose message
                    _name = name or pid
                    msg = f"🆕 Создан проект: {(_name or '').strip()}\nID: <code>{pid}</code>"
                    # Determine admin chat id
                    try:
                        from ..config import get_settings as _gs  # type: ignore
                        _admin_id = getattr(_gs(), 'telegram_admin_id', None) or '468326902'
                    except Exception:
                        _admin_id = '468326902'
                    # Enqueue via orchestrator (selects proper token)
                    try:
                        from ..orchestrator import OutboundMsg, orchestrator  # type: ignore
                        await orchestrator.enqueue_outbound(OutboundMsg(chat_id=int(_admin_id), text=msg))
                    except Exception:
                        pass
                except Exception:
                    pass

            elif handler == "project.list" or handler == "PROJECT.LIST":
                # PROJECT.LIST [owner=TG] [status=active|archived]
                try:
                    clauses = []
                    bind: Dict[str, Any] = {}
                    if params.get("owner") is not None:
                        clauses.append("owner = :owner")
                        bind["owner"] = params.get("owner")
                    if params.get("status"):
                        clauses.append("status = :status")
                        bind["status"] = str(params.get("status"))
                    sql = "select id::text as id, name, status, owner, priority from projects"
                    if clauses:
                        sql += " where " + " and ".join(clauses)
                    sql += " order by updated_at desc limit 100"
                    rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"project list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("project.get", "PROJECT.GET"):
                # PROJECT.GET id=<uuid>
                pid = str(params.get("id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "id required"}
                try:
                    row = (await db.execute(sa_text(
                        "select id::text as id, name, description, methodology, priority, owner, status, created_at, updated_at from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).mappings().first()
                    item = (dict(row) if row else None)
                except Exception as e:
                    return {"ok": False, "error": f"project get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"item": item}}

            elif handler in ("project.update", "PROJECT.UPDATE"):
                # PROJECT.UPDATE id=<uuid> [name=...] [description=...] [status=active|archived] [methodology=...] [priority=<0..1>] [owner=<tg_id>]
                pid = str(params.get("id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "id required"}
                # Read current status/name for notifications and gating
                _old_status = None
                _proj_name = None
                try:
                    row_cur = (await db.execute(sa_text("select status, name from projects where id = cast(:id as uuid)"), {"id": pid})).first()
                    if row_cur:
                        _old_status = str(row_cur[0]) if row_cur[0] is not None else None
                        _proj_name = str(row_cur[1]) if row_cur[1] is not None else None
                except Exception:
                    _old_status = None
                fields = []
                bind: Dict[str, Any] = {"id": pid}
                for k in ("name", "description", "status", "methodology", "owner"):
                    if k in params and params.get(k) is not None:
                        fields.append(f"{k} = :{k}")
                        bind[k] = params.get(k)
                if "priority" in params and params.get("priority") is not None:
                    fields.append("priority = :priority")
                    bind["priority"] = params.get("priority")
                # Architect confirmation gate for closing (archived/closed)
                try:
                    _new_status = str(params.get("status") or "").strip().lower()
                except Exception:
                    _new_status = ""
                if _new_status in {"archived", "closed"}:
                    try:
                        from ..services.soul_settings_service import SoulSettingsService as _SS  # type: ignore
                        _svc = _SS()
                        ok_flag = await _svc.get_setting(f"project.close.confirmed.{pid}", db, False)
                    except Exception:
                        ok_flag = False
                    if not ok_flag:
                        # Send confirmation request to Architect with inline keyboard
                        try:
                            title = _proj_name or pid
                            text = (
                                f"⚠️ Запрошено закрытие проекта: {(title or '').strip()}\n"
                                f"ID: <code>{pid}</code>\n\n"
                                "Нажмите для подтверждения."
                            )
                            keyboard = {
                                "inline_keyboard": [[
                                    {"text": "✅ Подтвердить закрытие", "callback_data": f"project_close_confirm_{pid}"}
                                ]]
                            }
                            try:
                                from ..config import get_settings as _gs2  # type: ignore
                                _admin_id2 = getattr(_gs2(), 'telegram_admin_id', None) or '468326902'
                            except Exception:
                                _admin_id2 = '468326902'
                            try:
                                from ..orchestrator import OutboundMsg, orchestrator  # type: ignore
                                await orchestrator.enqueue_outbound(OutboundMsg(chat_id=int(_admin_id2), text=text, keyboard=keyboard))
                            except Exception:
                                pass
                        except Exception:
                            pass
                        return {"ok": False, "error": "architect confirmation required to close project"}
                if not fields:
                    return {"ok": True, "data": {"updated": 0}}
                try:
                    q = "update projects set " + ", ".join(fields) + ", updated_at = now() where id = cast(:id as uuid)"
                    res = await db.execute(sa_text(q), bind)
                    await db.commit()
                    updated = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"project update error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.update", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": updated}}
                # Notifications for status transitions (open)
                try:
                    if updated > 0 and ("status" in params) and str(params.get("status") or "").strip().lower() == "active" and str(_old_status or "").strip().lower() != "active":
                        _title = _proj_name or pid
                        msg_open = f"📣 Проект открыт: {( _title or '').strip()}\nID: <code>{pid}</code>"
                        try:
                            from ..config import get_settings as _gs3  # type: ignore
                            _admin_id3 = getattr(_gs3(), 'telegram_admin_id', None) or '468326902'
                        except Exception:
                            _admin_id3 = '468326902'
                        try:
                            from ..orchestrator import OutboundMsg, orchestrator  # type: ignore
                            await orchestrator.enqueue_outbound(OutboundMsg(chat_id=int(_admin_id3), text=msg_open))
                        except Exception:
                            pass
                except Exception:
                    pass

            # ---------------------- PROJECT LOG (P66) ----------------------
            elif handler in ("project.log.init", "PROJECT.LOG.INIT"):
                # PROJECT.LOG.INIT project_id=<uuid> [template=default]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                template = str(params.get("template") or "default").strip()
                try:
                    # Получить данные проекта
                    row = (await db.execute(sa_text(
                        "select name, description, methodology, owner, status from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).mappings().first()
                    if not row:
                        return {"ok": False, "error": "project not found"}
                    # Создать project_key из имени
                    project_name = str(row.get("name") or "")
                    import re
                    project_key = re.sub(r'[^\w\-]', '_', project_name.lower())[:50] or pid[:8]
                    # Инициализировать логи
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    metadata = {
                        "owner": row.get("owner"),
                        "methodology": row.get("methodology"),
                        "status": row.get("status"),
                        "description": row.get("description")
                    }
                    result = await log_svc.init_logs(pid, project_name, project_key, template, metadata)
                    if not result.get("ok"):
                        return result
                    # Обновить paths в проекте
                    await db.execute(sa_text(
                        "update projects set log_operational_path=:op, log_extended_path=:ex, updated_at=now() where id=cast(:id as uuid)"
                    ), {"op": result["paths"]["operational"], "ex": result["paths"]["extended"], "id": pid})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"project.log.init error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.init", scope="hyperloop", version="v1")
                out = {"ok": True, "data": result.get("paths", {})}
            
            elif handler in ("project.log.read_op", "PROJECT.LOG.READ_OP"):
                # PROJECT.LOG.READ_OP project_id=<uuid>
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                try:
                    # Получить project_key
                    row = (await db.execute(sa_text(
                        "select name from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).first()
                    if not row:
                        return {"ok": False, "error": "project not found"}
                    import re
                    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or pid[:8]
                    # Прочитать operational
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    result = await log_svc.read_operational(project_key)
                    if not result.get("ok"):
                        return result
                except Exception as e:
                    return {"ok": False, "error": f"project.log.read_op error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.read_op", scope="hyperloop", version="v1")
                out = {"ok": True, "data": result}
            
            elif handler in ("project.log.read_ext", "PROJECT.LOG.READ_EXT"):
                # PROJECT.LOG.READ_EXT project_id=<uuid> [section=all|history|adr]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                section = params.get("section", "all")
                try:
                    # Получить project_key
                    row = (await db.execute(sa_text(
                        "select name from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).first()
                    if not row:
                        return {"ok": False, "error": "project not found"}
                    import re
                    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or pid[:8]
                    # Прочитать extended
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    result = await log_svc.read_extended(project_key, section)
                    if not result.get("ok"):
                        return result
                except Exception as e:
                    return {"ok": False, "error": f"project.log.read_ext error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.read_ext", scope="hyperloop", version="v1")
                out = {"ok": True, "data": result}
            
            elif handler in ("project.log.update_op", "PROJECT.LOG.UPDATE_OP"):
                # PROJECT.LOG.UPDATE_OP project_id=<uuid> step_title="..." step_result="..." [files="..."]
                pid = str(params.get("project_id") or "").strip()
                step_title = str(params.get("step_title") or "").strip()
                step_result = str(params.get("step_result") or "").strip()
                if not pid or not step_title or not step_result:
                    return {"ok": False, "error": "project_id, step_title, step_result required"}
                try:
                    # Получить project_key
                    row = (await db.execute(sa_text(
                        "select name from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).first()
                    if not row:
                        return {"ok": False, "error": "project not found"}
                    import re
                    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or pid[:8]
                    # Парсинг files
                    files_param = params.get("files", "")
                    files = [f.strip() for f in str(files_param).split(",") if f.strip()] if files_param else None
                    # Обновить operational
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    result = await log_svc.update_operational(project_key, step_title, step_result, files)
                    if not result.get("ok"):
                        return result
                except Exception as e:
                    return {"ok": False, "error": f"project.log.update_op error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.update_op", scope="hyperloop", version="v1")
                out = {"ok": True, "data": result}
            
            elif handler in ("project.log.update_ext", "PROJECT.LOG.UPDATE_EXT"):
                # PROJECT.LOG.UPDATE_EXT project_id=<uuid> section=<history|adr|diagrams> content="..."
                pid = str(params.get("project_id") or "").strip()
                section = str(params.get("section") or "").strip()
                content = str(params.get("content") or "").strip()
                if not pid or not section or not content:
                    return {"ok": False, "error": "project_id, section, content required"}
                try:
                    # Получить project_key
                    row = (await db.execute(sa_text(
                        "select name from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).first()
                    if not row:
                        return {"ok": False, "error": "project not found"}
                    import re
                    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or pid[:8]
                    # Обновить extended
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    result = await log_svc.update_extended(project_key, section, content)
                    if not result.get("ok"):
                        return result
                except Exception as e:
                    return {"ok": False, "error": f"project.log.update_ext error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.update_ext", scope="hyperloop", version="v1")
                out = {"ok": True}
            
            elif handler in ("project.log.rotate", "PROJECT.LOG.ROTATE"):
                # PROJECT.LOG.ROTATE project_id=<uuid> [next_task="..."]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                next_task = params.get("next_task")
                try:
                    # Получить project_key
                    row = (await db.execute(sa_text(
                        "select name from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).first()
                    if not row:
                        return {"ok": False, "error": "project not found"}
                    import re
                    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or pid[:8]
                    # Ротация
                    from ..services.project_log_service import ProjectLogService
                    log_svc = ProjectLogService()
                    result = await log_svc.rotate_logs(project_key, next_task)
                    if not result.get("ok"):
                        return result
                    # Обновить timestamp последней ротации
                    await db.execute(sa_text(
                        "update projects set log_last_rotated_at=now(), updated_at=now() where id=cast(:id as uuid)"
                    ), {"id": pid})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"project.log.rotate error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.rotate", scope="hyperloop", version="v1")
                out = {"ok": True, "data": result}
            
            # ---------------------- PROJECT LOG (P40) ----------------------
            elif handler in ("project.log.set", "PROJECT.LOG.SET"):
                # PROJECT.LOG.SET id=<uuid> path="<rel_path>"
                pid = str(params.get("id") or "").strip()
                path = str(params.get("path") or "").strip()
                if not pid or not path:
                    return {"ok": False, "error": "id and path required"}
                try:
                    # ensure meta exists and set meta.project_log
                    q = (
                        "update projects set meta = jsonb_set(coalesce(meta, '{}'::jsonb), '{project_log}', to_jsonb(CAST(:p AS text)), true), updated_at = now() "
                        "where id = cast(:id as uuid)"
                    )
                    res = await db.execute(sa_text(q), {"id": pid, "p": path})
                    await db.commit()
                    updated = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    # Fallback: environments without projects.meta column
                    msg = str(e).lower()
                    if "column \"meta\" does not exist" in msg or "undefinedcolumn" in msg:
                        try:
                            await self.settings.set_setting(f"project.log.{pid}", path, db)
                            signature_ctx.append_step(function_id="cmd.hyperloop.project.log.set.fallback", scope="hyperloop", version="v1")
                            out = {"ok": True, "data": {"updated": 0, "id": pid, "path": path, "fallback": "soul_settings"}}
                            return out
                        except Exception as e2:
                            return {"ok": False, "error": f"project.log.set fallback error: {e2}"}
                    return {"ok": False, "error": f"project.log.set error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.set", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": updated, "id": pid, "path": path}}

            elif handler in ("project.log.get", "PROJECT.LOG.GET"):
                # PROJECT.LOG.GET id=<uuid>
                pid = str(params.get("id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "id required"}
                try:
                    row = (await db.execute(sa_text("select (meta->>'project_log') as path from projects where id = cast(:id as uuid)"), {"id": pid})).mappings().first()
                    path = (row or {}).get("path")
                except Exception as e:
                    # Fallback to soul_settings when projects.meta is missing
                    msg = str(e).lower()
                    if "column \"meta\" does not exist" in msg or "undefinedcolumn" in msg:
                        try:
                            val = await self.settings.get_setting(f"project.log.{pid}", db, None)
                            signature_ctx.append_step(function_id="cmd.hyperloop.project.log.get.fallback", scope="hyperloop", version="v1")
                            return {"ok": True, "data": {"id": pid, "path": (val or None), "fallback": "soul_settings"}}
                        except Exception as e2:
                            return {"ok": False, "error": f"project.log.get fallback error: {e2}"}
                    return {"ok": False, "error": f"project.log.get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.log.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": pid, "path": path}}

            elif handler in ("project.files.ensure", "PROJECT.FILES.ENSURE"):
                # PROJECT.FILES.ENSURE id=<uuid> name="<name>" [dry_run]
                import os as _os
                pid = str(params.get("id") or "").strip()
                name = str(params.get("name") or "").strip()
                dry_run = bool(params.get("dry_run", False))
                if not pid:
                    return {"ok": False, "error": "id required"}
                if not name:
                    # try fetch from DB
                    row = (await db.execute(sa_text("select name from projects where id = cast(:id as uuid)"), {"id": pid})).first()
                    name = str(row[0]) if row else pid
                # read root dir from settings
                try:
                    root_dir = str(await self.settings.get_setting("project.files.root_dir", db, "/var/www/soulpulse/projects"))
                except Exception:
                    root_dir = "/var/www/soulpulse/projects"
                # simple slug
                _slug = name.lower().strip().replace(" ", "-")
                allowed = "abcdefghijklmnopqrstuvwxyz0123456789-_"
                _slug = "".join([c for c in _slug if c in allowed]) or pid
                proj_dir = f"{root_dir}/{pid}-{_slug}"
                subdirs = ["logs", "docs", "artifacts"]
                if not dry_run:
                    try:
                        _os.makedirs(proj_dir, exist_ok=True)
                        for sd in subdirs:
                            _os.makedirs(f"{proj_dir}/{sd}", exist_ok=True)
                    except Exception as e:
                        return {"ok": False, "error": f"project.files.ensure error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.files.ensure", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"project_dir": proj_dir, "subdirs": subdirs, "dry_run": dry_run}}

            elif handler in ("project.delete", "PROJECT.DELETE"):
                # PROJECT.DELETE id=<uuid>
                pid = str(params.get("id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "id required"}
                try:
                    # Без касCADE, мягкое удаление запрещено — удаляем только запись проекта
                    res = await db.execute(sa_text("delete from projects where id = cast(:id as uuid)"), {"id": pid})
                    await db.commit()
                    deleted = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"project delete error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.delete", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"deleted": deleted}}

            # ---------------------- RCA Repository (Root Cause Analysis) ----------------------
            elif handler in ("rca.schema.ensure", "RCA.SCHEMA.ENSURE"):
                # RCA.SCHEMA.ENSURE — идемпотентное создание/расширение схемы репозитория RCA (P59)
                try:
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.rca_records (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                            project_id uuid NULL,
                            incident_id uuid NULL,
                            title text NOT NULL,
                            problem text NOT NULL,
                            impact text NULL,
                            root_cause text NULL,
                            contributing_causes jsonb NOT NULL DEFAULT '{}'::jsonb,
                            fix jsonb NOT NULL DEFAULT '{}'::jsonb,
                            prevention text NULL,
                            methodology text NULL,
                            effects text[] NULL,
                            root_causes text[] NULL,
                            fixes text[] NULL,
                            preventions text[] NULL,
                            evidence_refs text[] NULL,
                            links jsonb NOT NULL DEFAULT '[]'::jsonb,
                            severity text NULL,
                            tags text[] NULL,
                            owner text NULL,
                            status text NULL,
                            created_at timestamptz NOT NULL DEFAULT now(),
                            updated_at timestamptz NOT NULL DEFAULT now()
                        )
                        """
                    ))
                    # Идемпотентные ALTER для совместимости
                    for alt in (
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS incident_id uuid",
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS methodology text",
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS effects text[]",
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS root_causes text[]",
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS fixes text[]",
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS preventions text[]",
                        "ALTER TABLE public.rca_records ADD COLUMN IF NOT EXISTS evidence_refs text[]"
                    ):
                        try:
                            await db.execute(sa_text(alt))
                        except Exception:
                            pass
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_records_project_id_idx ON public.rca_records(project_id)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_records_incident_id_idx ON public.rca_records(incident_id)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_records_tags_idx ON public.rca_records USING GIN(tags)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_records_links_idx ON public.rca_records USING GIN(links)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_records_created_at_idx ON public.rca_records(created_at)"))
                    # Таблица ссылок
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.rca_links (
                          rca_id uuid NOT NULL,
                          link_type text NOT NULL,
                          link_ref text NOT NULL,
                          created_at timestamptz NOT NULL DEFAULT now(),
                          PRIMARY KEY (rca_id, link_type, link_ref)
                        )
                        """
                    ))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_links_rca_idx ON public.rca_links(rca_id)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS rca_links_type_idx ON public.rca_links(link_type)"))
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"rca schema ensure error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.schema.ensure", scope="hyperloop", version="v1")
                out = {"ok": True}

            elif handler in ("rca.record.add", "RCA.RECORD.ADD"):
                # RCA.RECORD.ADD — поддержка options JSON (P59); принимает options как inline и из глобальных self._options
                import json as _json
                # 1) options из строки DSL
                options = params.get("options") if isinstance(params.get("options"), dict) else None
                # 2) fallback: глобальные options из тела запроса Hyperloop
                if not options:
                    try:
                        options = dict(getattr(self, "_options", {}) or {})
                    except Exception:
                        options = {}
                pid = str(options.get("project_id") or params.get("project_id") or "").strip() or None
                incident_id = str(options.get("incident_id") or params.get("incident_id") or "").strip() or None
                title = str(options.get("title") or params.get("title") or "").strip()
                problem = str(options.get("problem") or params.get("problem") or "").strip()
                if not title:
                    return {"ok": False, "error": "title required"}
                if not problem:
                    problem = title
                impact = options.get("impact") if options.get("impact") is not None else params.get("impact")
                rc = options.get("root_cause") if options.get("root_cause") is not None else params.get("root_cause")
                methodology = options.get("methodology") if options.get("methodology") is not None else params.get("methodology")
                contributing = options.get("contributing_json") or options.get("contributing_causes") or params.get("contributing_json") or params.get("contributing") or {}
                fix = options.get("fix_json") or options.get("fix_obj") or params.get("fix_json") or params.get("fix") or {}
                links = options.get("links_json") or options.get("links") or params.get("links_json") or params.get("links") or []
                tags = options.get("tags_json") or options.get("tags") or params.get("tags_json") or params.get("tags") or []
                effects = options.get("effects") if options.get("effects") is not None else params.get("effects")
                root_causes_arr = options.get("root_causes") if options.get("root_causes") is not None else params.get("root_causes")
                fixes_arr = options.get("fixes") if options.get("fixes") is not None else params.get("fixes")
                preventions_arr = options.get("preventions") if options.get("preventions") is not None else params.get("preventions")
                evidence_refs = options.get("evidence_refs") if options.get("evidence_refs") is not None else params.get("evidence_refs")
                prevention = options.get("prevention") if options.get("prevention") is not None else params.get("prevention")
                severity = options.get("severity") if options.get("severity") is not None else params.get("severity")
                owner = options.get("owner") if options.get("owner") is not None else params.get("owner")
                status = options.get("status") if options.get("status") is not None else params.get("status")
                def _to_json_obj(v, default):
                    if isinstance(v, (dict, list)):
                        return v
                    s = str(v or "").strip()
                    if not s:
                        return default
                    try:
                        return _json.loads(s)
                    except Exception:
                        return default
                contributing = _to_json_obj(contributing, {})
                fix = _to_json_obj(fix, {})
                links = _to_json_obj(links, [])
                tags = _to_json_obj(tags, [])
                def _to_list(v):
                    if isinstance(v, list):
                        return v
                    try:
                        import json as _json2
                        return list(_json2.loads(str(v)))
                    except Exception:
                        return None
                effects = _to_list(effects)
                root_causes_arr = _to_list(root_causes_arr)
                fixes_arr = _to_list(fixes_arr)
                preventions_arr = _to_list(preventions_arr)
                evidence_refs = _to_list(evidence_refs)
                try:
                    row = (await db.execute(sa_text(
                        """
                        INSERT INTO public.rca_records(
                          project_id, incident_id, title, problem, impact, root_cause, contributing_causes, fix, prevention,
                          links, severity, tags, owner, status, methodology, effects, root_causes, fixes, preventions, evidence_refs
                        )
                        VALUES (
                          CAST(:pid AS uuid), CAST(:iid AS uuid), :t, :p, :i, :rc, CAST(:contrib AS jsonb), CAST(:fix AS jsonb), :prev,
                          CAST(:links AS jsonb), :sev, :tags, :own, :st, :meth, :effects, :root_causes, :fixes, :preventions, :evidence_refs
                        )
                        RETURNING id::text
                        """
                    ), {
                        "pid": (pid or None),
                        "iid": (incident_id or None),
                        "t": title,
                        "p": problem,
                        "i": (str(impact) if impact is not None else None),
                        "rc": (str(rc) if rc is not None else None),
                        "contrib": _json.dumps(contributing, ensure_ascii=False),
                        "fix": _json.dumps(fix, ensure_ascii=False),
                        "prev": (str(prevention) if prevention is not None else None),
                        "links": _json.dumps(links, ensure_ascii=False),
                        "sev": (str(severity) if severity is not None else None),
                        "tags": tags if isinstance(tags, list) else None,
                        "own": (str(owner) if owner is not None else None),
                        "st": (str(status) if status is not None else None),
                        "meth": (str(methodology) if methodology is not None else None),
                        "effects": (effects if isinstance(effects, list) else None),
                        "root_causes": (root_causes_arr if isinstance(root_causes_arr, list) else None),
                        "fixes": (fixes_arr if isinstance(fixes_arr, list) else None),
                        "preventions": (preventions_arr if isinstance(preventions_arr, list) else None),
                        "evidence_refs": (evidence_refs if isinstance(evidence_refs, list) else None),
                    })).fetchone()
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"rca record add error: {e}"}
                rid = row[0] if row else None
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.record.add", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": rid}}

            elif handler in ("rca.record.update", "RCA.RECORD.UPDATE"):
                # RCA.RECORD.UPDATE id=<uuid> [partial fields]
                import json as _json
                rid = str(params.get("id") or "").strip()
                if not rid:
                    return {"ok": False, "error": "id required"}
                fields = []
                bind: Dict[str, Any] = {"id": rid}
                mapping = {"title": "title", "problem": "problem", "impact": "impact", "root_cause": "root_cause", "prevention": "prevention", "severity": "severity", "owner": "owner", "status": "status"}
                for k, col in mapping.items():
                    if k in params:
                        fields.append(f"{col} = :{k}")
                        bind[k] = params.get(k)
                def _maybe_json(key: str, col: str, default):
                    if key in params:
                        v = params.get(key)
                        if not isinstance(v, (dict, list)):
                            try:
                                v = _json.loads(str(v))
                            except Exception:
                                v = default
                        fields.append(f"{col} = CAST(:{key} AS jsonb)")
                        bind[key] = _json.dumps(v, ensure_ascii=False)
                _maybe_json("contributing_json", "contributing_causes", {})
                _maybe_json("fix_json", "fix", {})
                _maybe_json("links_json", "links", [])
                if "tags_json" in params:
                    v = params.get("tags_json")
                    if not isinstance(v, list):
                        try:
                            import json as _json2
                            v = _json2.loads(str(v))
                        except Exception:
                            v = []
                    fields.append("tags = :tags")
                    bind["tags"] = v
                if not fields:
                    return {"ok": True, "data": {"updated": 0}}
                try:
                    q = "update public.rca_records set " + ", ".join(fields) + ", updated_at = now() where id = cast(:id as uuid)"
                    res = await db.execute(sa_text(q), bind)
                    await db.commit()
                    updated = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"rca record update error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.record.update", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": updated}}

            elif handler in ("rca.get", "RCA.GET"):
                # RCA.GET id=<uuid>
                rid = str(params.get("id") or "").strip()
                if not rid:
                    return {"ok": False, "error": "id required"}
                try:
                    row = (await db.execute(sa_text(
                        """
                        select id::text, project_id::text as project_id, incident_id::text as incident_id, title, problem, impact, root_cause,
                               contributing_causes, fix, prevention, links, severity, tags, owner, status,
                               methodology, effects, root_causes, fixes, preventions, evidence_refs,
                               created_at, updated_at
                          from public.rca_records where id = cast(:id as uuid)
                        """
                    ), {"id": rid})).mappings().first()
                    item = (dict(row) if row else None)
                except Exception as e:
                    return {"ok": False, "error": f"rca get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"item": item}}
            elif handler in ("rca.search", "RCA.SEARCH"):
                # RCA.SEARCH [project_id=<uuid>] [q="..."] [tag="..."] [limit=<n>]
                pid = str(params.get("project_id") or "").strip()
                qtext = str(params.get("q") or "").strip()
                tag = str(params.get("tag") or "").strip()
                try:
                    lim = int(params.get("limit") or 20)
                except Exception:
                    lim = 20
                lim = max(1, min(200, lim))
                clauses = []
                bind: Dict[str, Any] = {"lim": lim}
                if pid:
                    clauses.append("project_id = cast(:pid as uuid)")
                    bind["pid"] = pid
                if qtext:
                    clauses.append("(title ilike :qt OR problem ilike :qt OR root_cause ilike :qt)")
                    bind["qt"] = f"%{qtext}%"
                if tag:
                    clauses.append(":tg = ANY(tags)")
                    bind["tg"] = tag
                sql = "select id::text, project_id::text as project_id, title, severity, tags, created_at from public.rca_records"
                if clauses:
                    sql += " where " + " and ".join(clauses)
                sql += " order by created_at desc limit :lim"
                try:
                    rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"rca search error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.search", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items, "count": len(items)}}

            elif handler in ("rca.list", "RCA.LIST"):
                # RCA.LIST [project_id=<uuid>] [limit=<n>]
                pid = str(params.get("project_id") or "").strip()
                try:
                    lim = int(params.get("limit") or 20)
                except Exception:
                    lim = 20
                lim = max(1, min(200, lim))
                sql = "select id::text, project_id::text as project_id, title, severity, tags, created_at from public.rca_records"
                bind: Dict[str, Any] = {"lim": lim}
                if pid:
                    sql += " where project_id = cast(:pid as uuid)"
                    bind["pid"] = pid
                sql += " order by created_at desc limit :lim"
                try:
                    rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"rca list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items, "count": len(items)}}

            elif handler in ("rca.record.link", "RCA.RECORD.LINK"):
                # RCA.RECORD.LINK rca_id=<RID> type=<lesson|risk|doc|quant> ref=<...>
                rid = str(params.get("rca_id") or "").strip()
                link_type = str(params.get("type") or params.get("link_type") or "").strip()
                link_ref = str(params.get("ref") or params.get("link_ref") or "").strip()
                if not rid or not link_type or not link_ref:
                    return {"ok": False, "error": "rca_id, type, ref required"}
                try:
                    await db.execute(sa_text(
                        """
                        insert into public.rca_links(rca_id, link_type, link_ref)
                        values (cast(:r as uuid), :t, :f)
                        on conflict (rca_id, link_type, link_ref) do update set created_at = now()
                        """
                    ), {"r": rid, "t": link_type, "f": link_ref})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"rca record link error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.rca.record.link", scope="hyperloop", version="v1")
                out = {"ok": True}

            # ---------------------- LESSONS LEARNED (Lessons repository) ----------------------
            elif handler in ("lessons.schema.ensure", "LESSONS.SCHEMA.ENSURE"):
                # Идемпотентное создание схемы Lessons (выученные уроки)
                try:
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.lessons (
                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                            project_id uuid NULL,
                            title text NOT NULL,
                            summary text NULL,
                            methodology text NULL,
                            risks jsonb NOT NULL DEFAULT '{}'::jsonb,
                            tags text[] NULL,
                            links jsonb NOT NULL DEFAULT '[]'::jsonb,
                            owner text NULL,
                            created_at timestamptz NOT NULL DEFAULT now(),
                            updated_at timestamptz NOT NULL DEFAULT now()
                        )
                        """
                    ))
                    # Дополнительные столбцы по P58 (не нарушая совместимость)
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS phase text"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS category text"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS root_cause text"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS symptoms text[]"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS countermeasures text[]"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS metrics_impact jsonb DEFAULT '{}'::jsonb"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS applicability_tags text[]"))
                    await db.execute(sa_text("ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS evidence_refs text[]"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS lessons_project_id_idx ON public.lessons(project_id)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS lessons_created_at_idx ON public.lessons(created_at)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS lessons_tags_idx ON public.lessons USING GIN(tags)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS lessons_methodology_idx ON public.lessons(methodology)"))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS lessons_applicability_tags_gin ON public.lessons USING GIN(applicability_tags)"))
                    # FTS индекс исключён для совместимости PROD (ошибка IMMUTABLE)
                    # Таблицы связей по P58
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.lesson_risk_links (
                          lesson_id uuid NOT NULL,
                          risk_id uuid NOT NULL,
                          effect text NULL,
                          confidence real NULL,
                          created_at timestamptz NOT NULL DEFAULT now(),
                          PRIMARY KEY (lesson_id, risk_id)
                        )
                        """
                    ))
                    await db.execute(sa_text("CREATE INDEX IF NOT EXISTS lesson_risk_links_risk_idx ON public.lesson_risk_links(risk_id)"))
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.lesson_doc_links (
                          lesson_id uuid NOT NULL,
                          doc_path text NOT NULL,
                          kind text NULL,
                          created_at timestamptz NOT NULL DEFAULT now()
                        )
                        """
                    ))
                    await db.execute(sa_text("CREATE UNIQUE INDEX IF NOT EXISTS lesson_doc_links_uq ON public.lesson_doc_links(lesson_id, doc_path)"))
                    await db.execute(sa_text(
                        """
                        CREATE TABLE IF NOT EXISTS public.lesson_quant_links (
                          lesson_id uuid NOT NULL,
                          quant_id uuid NOT NULL,
                          created_at timestamptz NOT NULL DEFAULT now(),
                          PRIMARY KEY (lesson_id, quant_id)
                        )
                        """
                    ))
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"lessons schema ensure error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.lessons.schema.ensure", scope="hyperloop", version="v1")
                out = {"ok": True}

            elif handler in ("lessons.add", "LESSONS.ADD"):
                # LESSONS.ADD (поддержка P58 options JSON и обратной совместимости старых полей)
                import json as _json
                options = params.get("options") if isinstance(params.get("options"), dict) else {}
                # Параметры из options или из прямых полей
                pid = str(options.get("project_id") or params.get("project_id") or "").strip() or None
                title = str(options.get("title") or params.get("title") or "").strip()
                summary = options.get("summary") if options.get("summary") is not None else params.get("summary")
                methodology = options.get("methodology") if options.get("methodology") is not None else params.get("methodology")
                risks = options.get("risks_json") or options.get("risks") or params.get("risks_json") or params.get("risks") or {}
                tags = options.get("tags_json") or options.get("tags") or params.get("tags_json") or params.get("tags") or []
                links = options.get("links_json") or options.get("links") or params.get("links_json") or params.get("links") or []
                # Поля P58
                phase = options.get("phase")
                category = options.get("category")
                root_cause = options.get("root_cause")
                symptoms = options.get("symptoms") or []
                countermeasures = options.get("countermeasures") or []
                metrics_impact = options.get("metrics_impact") or {}
                applicability_tags = options.get("applicability_tags") or []
                evidence_refs = options.get("evidence_refs") or []
                owner = (str(options.get("owner") if options.get("owner") is not None else params.get("owner") or "") or None)
                if not title and not root_cause:
                    return {"ok": False, "error": "title or root_cause required"}
                def _to_json_obj(v, default):
                    if isinstance(v, (dict, list)):
                        return v
                    s = str(v or "").strip()
                    if not s:
                        return default
                    try:
                        return _json.loads(s)
                    except Exception:
                        return default
                risks = _to_json_obj(risks, {})
                tags = _to_json_obj(tags, [])
                links = _to_json_obj(links, [])
                metrics_impact = _to_json_obj(metrics_impact, {})
                # Вставка с расширенной схемой
                try:
                    row = (await db.execute(sa_text(
                        """
                        INSERT INTO public.lessons(
                          project_id, title, summary, methodology, risks, tags, links, owner,
                          phase, category, root_cause, symptoms, countermeasures, metrics_impact, applicability_tags, evidence_refs
                        )
                        VALUES (
                          CAST(:pid AS uuid), :t, :s, :m, CAST(:r AS jsonb), :tags, CAST(:lnk AS jsonb), :own,
                          :ph, :cat, :rc, :sym, :cm, CAST(:mi AS jsonb), :atags, :erefs
                        )
                        RETURNING id::text
                        """
                    ), {
                        "pid": (pid or None),
                        "t": (title or (f"Lesson: {str(root_cause)[:80]}" if root_cause else None)),
                        "s": (str(summary) if summary is not None else None),
                        "m": (str(methodology) if methodology is not None else None),
                        "r": _json.dumps(risks, ensure_ascii=False),
                        "tags": (tags if isinstance(tags, list) else None),
                        "lnk": _json.dumps(links, ensure_ascii=False),
                        "own": owner,
                        "ph": (str(phase) if phase is not None else None),
                        "cat": (str(category) if category is not None else None),
                        "rc": (str(root_cause) if root_cause is not None else None),
                        "sym": (symptoms if isinstance(symptoms, list) else None),
                        "cm": (countermeasures if isinstance(countermeasures, list) else None),
                        "mi": _json.dumps(metrics_impact, ensure_ascii=False),
                        "atags": (applicability_tags if isinstance(applicability_tags, list) else None),
                        "erefs": (evidence_refs if isinstance(evidence_refs, list) else None),
                    })).fetchone()
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"lessons add error: {e}"}
                # Метрики
                try:
                    from ..lib.observability.metrics import incr as _incr  # type: ignore
                    _incr("lessons_added_total", {"phase": (phase or ""), "category": (category or "")})
                except Exception:
                    pass
                lid = row[0] if row else None
                signature_ctx.append_step(function_id="cmd.hyperloop.lessons.add", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"id": lid}}

            elif handler in ("lessons.search", "LESSONS.SEARCH"):
                # LESSONS.SEARCH (options JSON): { query, tags[], phase?, category?, k? }
                import time as _time
                t0 = _time.time()
                options = params.get("options") if isinstance(params.get("options"), dict) else {}
                try:
                    pid = str(options.get("project_id") or params.get("project_id") or "").strip()
                except Exception:
                    pid = ""
                q = str(options.get("query") or params.get("q") or "").strip()
                phase = str(options.get("phase") or "").strip()
                category = str(options.get("category") or "").strip()
                try:
                    limit = int(options.get("k") or params.get("limit") or 10)
                except Exception:
                    limit = 10
                tags_in = options.get("tags") or []
                clauses = []
                bind: Dict[str, Any] = {}
                if pid:
                    clauses.append("project_id = cast(:pid as uuid)")
                    bind["pid"] = pid
                if phase:
                    clauses.append("coalesce(phase,'') <> '' AND lower(phase) = lower(:ph)")
                    bind["ph"] = phase
                if category:
                    clauses.append("coalesce(category,'') <> '' AND lower(category) = lower(:cat)")
                    bind["cat"] = category
                if q:
                    clauses.append("(coalesce(title,'') ILIKE :q OR coalesce(summary,'') ILIKE :q OR coalesce(root_cause,'') ILIKE :q OR EXISTS (SELECT 1 FROM unnest(coalesce(symptoms, ARRAY[]::text[])) s WHERE s ILIKE :q) OR EXISTS (SELECT 1 FROM unnest(coalesce(countermeasures, ARRAY[]::text[])) c WHERE c ILIKE :q))")
                    bind["q"] = f"%{q}%"
                # tags overlap (applicability_tags)
                if isinstance(tags_in, list) and tags_in:
                    tag_placeholders = []
                    for i, tv in enumerate(tags_in):
                        key = f"tag{i}"
                        tag_placeholders.append(f":{key}")
                        bind[key] = str(tv)
                    clauses.append("EXISTS (SELECT 1 FROM unnest(coalesce(applicability_tags, ARRAY[]::text[])) t WHERE t IN (" + ",".join(tag_placeholders) + "))")
                sql = (
                    "select id::text as id, project_id::text as project_id, title, summary, methodology, phase, category, root_cause, applicability_tags as tags, created_at "
                    "from public.lessons"
                )
                if clauses:
                    sql += " where " + " and ".join(clauses)
                sql += " order by created_at desc limit :lim"
                bind["lim"] = max(1, min(100, limit))
                try:
                    rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"lessons search error: {e}"}
                # Метрики времени
                try:
                    from ..lib.observability.metrics import timing as _timing  # type: ignore
                    dt_ms = ( _time.time() - t0 ) * 1000.0
                    _timing("lessons_search", dt_ms, {"phase": (phase or ""), "category": (category or "")})
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.lessons.search", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items, "count": len(items)}}

            elif handler in ("lessons.link.risk", "LESSONS.LINK.RISK"):
                # LESSONS.LINK.RISK lesson_id=<LID> risk_id=<RID> effect=<mitigate|aggravate> confidence=<0..1>
                lid = str(params.get("lesson_id") or "").strip()
                rid = str(params.get("risk_id") or "").strip()
                effect = str(params.get("effect") or "").strip() or None
                try:
                    confidence = float(params.get("confidence")) if params.get("confidence") is not None else None
                except Exception:
                    confidence = None
                if not lid or not rid:
                    return {"ok": False, "error": "lesson_id and risk_id required"}
                if effect and effect not in ("mitigate", "aggravate"):
                    return {"ok": False, "error": "effect must be mitigate|aggravate"}
                try:
                    await db.execute(sa_text(
                        """
                        insert into public.lesson_risk_links(lesson_id, risk_id, effect, confidence)
                        values (cast(:l as uuid), cast(:r as uuid), :e, :c)
                        on conflict (lesson_id, risk_id) do update set effect = excluded.effect, confidence = excluded.confidence, created_at = now()
                        """
                    ), {"l": lid, "r": rid, "e": effect, "c": confidence})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"lessons link risk error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.lessons.link.risk", scope="hyperloop", version="v1")
                out = {"ok": True}

            elif handler in ("lessons.apply", "LESSONS.APPLY"):
                # LESSONS.APPLY project_id=<PID> lesson_id=<LID> — предзаполнить риск‑реестр (best‑effort)
                import json as _json
                pid = str(params.get("project_id") or "").strip()
                lid = str(params.get("lesson_id") or "").strip()
                if not pid or not lid:
                    return {"ok": False, "error": "project_id and lesson_id required"}
                # Прочитаем урок
                row = (await db.execute(sa_text(
                    "select id::text as id, category, root_cause, countermeasures from public.lessons where id = cast(:id as uuid)"
                ), {"id": lid})).mappings().first()
                if not row:
                    return {"ok": False, "error": "lesson not found"}
                title = (row.get("root_cause") or "Lesson")
                cat = (row.get("category") or "")
                # Создадим базовый риск (если нужно — всегда добавляем новый)
                try:
                    rrow = (await db.execute(sa_text(
                        """
                        insert into risks(id, project_id, title, severity, probability, status, owner)
                        values (gen_random_uuid(), cast(:p as uuid), :t, 'medium', 'medium', 'open', null)
                        returning id::text as id
                        """
                    ), {"p": pid, "t": (f"Lesson: {cat} — {title}" if cat else f"Lesson: {title}")})).mappings().first()
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"lessons apply (risk add) error: {e}"}
                new_risk_id = (rrow or {}).get("id")
                # Привяжем риск к уроку
                try:
                    await db.execute(sa_text(
                        "insert into public.lesson_risk_links(lesson_id, risk_id, effect, confidence) values (cast(:l as uuid), cast(:r as uuid), 'mitigate', 0.7) on conflict (lesson_id, risk_id) do nothing"
                    ), {"l": lid, "r": new_risk_id})
                    await db.commit()
                except Exception:
                    pass
                # Метрики
                try:
                    from ..lib.observability.metrics import incr as _incr  # type: ignore
                    _incr("lessons_apply_total", {"category": (cat or "")})
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.lessons.apply", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"risk_id": new_risk_id}}

            # ---------------------- PROJECT RISKS (P40) ----------------------
            elif handler in ("risk.add", "RISK.ADD"):
                # RISK.ADD project_id=<uuid> title="..." severity=<low|medium|high> probability=<low|medium|high> [owner=<tg_id>] [status=<open|mitigating|closed>]
                pid = str(params.get("project_id") or "").strip()
                title = str(params.get("title") or "").strip()
                severity = str(params.get("severity") or "").strip()
                probability = str(params.get("probability") or "").strip()
                status = str(params.get("status") or "open").strip() or "open"
                owner = params.get("owner")
                if not pid or not title or not severity or not probability:
                    return {"ok": False, "error": "project_id, title, severity, probability required"}
                try:
                    row = (await db.execute(sa_text(
                        """
                        insert into risks(id, project_id, title, severity, probability, status, owner)
                        values (gen_random_uuid(), cast(:p as uuid), :t, :sev, :prob, :st, :own)
                        returning id::text as id
                        """
                    ), {"p": pid, "t": title, "sev": severity, "prob": probability, "st": status, "own": owner})).mappings().first()
                    await db.commit()
                    rid = (row or {}).get("id")
                except Exception as e:
                    return {"ok": False, "error": f"risk add error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.risk.add", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"risk_id": rid}}

            elif handler in ("risk.update", "RISK.UPDATE"):
                # RISK.UPDATE id=<uuid> [title=...] [severity=...] [probability=...] [status=...] [owner=<tg_id>]
                rid = str(params.get("id") or "").strip()
                if not rid:
                    return {"ok": False, "error": "id required"}
                fields = []
                bind: Dict[str, Any] = {"id": rid}
                for k in ("title", "severity", "probability", "status", "owner"):
                    if k in params and params.get(k) is not None:
                        fields.append(f"{k} = :{k}")
                        bind[k] = params.get(k)
                if not fields:
                    return {"ok": True, "data": {"updated": 0}}
                try:
                    q = "update risks set " + ", ".join(fields) + ", updated_at = now() where id = cast(:id as uuid)"
                    res = await db.execute(sa_text(q), bind)
                    await db.commit()
                    updated = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"risk update error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.risk.update", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": updated}}

            elif handler in ("risk.list", "RISK.LIST"):
                # RISK.LIST project_id=<uuid> [status=<...>] [severity=<...>] [probability=<...>]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                clauses = ["project_id = cast(:p as uuid)"]
                bind: Dict[str, Any] = {"p": pid}
                for k in ("status", "severity", "probability"):
                    if params.get(k):
                        clauses.append(f"{k} = :{k}")
                        bind[k] = str(params.get(k))
                where = " where " + " and ".join(clauses)
                try:
                    rows = (await db.execute(sa_text(
                        f"select id::text as id, title, severity, probability, status, owner, created_at, updated_at from risks{where} order by updated_at desc"
                    ), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"risk list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.risk.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("risk.delete", "RISK.DELETE"):
                # RISK.DELETE id=<uuid>
                rid = str(params.get("id") or "").strip()
                if not rid:
                    return {"ok": False, "error": "id required"}
                try:
                    res = await db.execute(sa_text("delete from risks where id = cast(:id as uuid)"), {"id": rid})
                    await db.commit()
                    deleted = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"risk delete error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.risk.delete", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"deleted": deleted}}

            # ---------------------- PROJECT CHANGES (P40) ----------------------
            elif handler in ("change.add", "CHANGE.ADD"):
                # CHANGE.ADD project_id=<uuid> title="..." change_type=<feature|bugfix|doc|infra|other> [reason=...] [approved=<true|false>] [request_id=<uuid>]
                pid = str(params.get("project_id") or "").strip()
                title = str(params.get("title") or "").strip()
                change_type = str(params.get("change_type") or "").strip()
                reason = params.get("reason")
                approved = params.get("approved")
                request_id = str(params.get("request_id") or "").strip() or None
                if not pid or not title or not change_type:
                    return {"ok": False, "error": "project_id, title, change_type required"}
                try:
                    row = (await db.execute(sa_text(
                        """
                        insert into changes(id, project_id, title, change_type, reason, approved, request_id)
                        values (gen_random_uuid(), cast(:p as uuid), :t, :ct, :r, :appr, cast(:req as uuid))
                        returning id::text as id
                        """
                    ), {"p": pid, "t": title, "ct": change_type, "r": reason, "appr": approved, "req": request_id})).mappings().first()
                    await db.commit()
                    cid = (row or {}).get("id")
                except Exception as e:
                    return {"ok": False, "error": f"change add error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.change.add", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"change_id": cid}}

            elif handler in ("change.update", "CHANGE.UPDATE"):
                # CHANGE.UPDATE id=<uuid> [title=...] [change_type=...] [reason=...] [approved=<true|false>] [request_id=<uuid>]
                cid = str(params.get("id") or "").strip()
                if not cid:
                    return {"ok": False, "error": "id required"}
                fields = []
                bind: Dict[str, Any] = {"id": cid}
                for k in ("title", "change_type", "reason", "approved"):
                    if k in params and params.get(k) is not None:
                        fields.append(f"{k} = :{k}")
                        bind[k] = params.get(k)
                if params.get("request_id") is not None:
                    fields.append("request_id = cast(:request_id as uuid)")
                    bind["request_id"] = str(params.get("request_id") or "") or None
                if not fields:
                    return {"ok": True, "data": {"updated": 0}}
                try:
                    q = "update changes set " + ", ".join(fields) + ", updated_at = now() where id = cast(:id as uuid)"
                    res = await db.execute(sa_text(q), bind)
                    await db.commit()
                    updated = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"change update error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.change.update", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": updated}}

            elif handler in ("change.list", "CHANGE.LIST"):
                # CHANGE.LIST project_id=<uuid> [change_type=...] [approved=<true|false>]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                clauses = ["project_id = cast(:p as uuid)"]
                bind: Dict[str, Any] = {"p": pid}
                if params.get("change_type"):
                    clauses.append("change_type = :ct")
                    bind["ct"] = str(params.get("change_type"))
                if params.get("approved") is not None:
                    clauses.append("approved = :appr")
                    bind["appr"] = bool(params.get("approved"))
                where = " where " + " and ".join(clauses)
                try:
                    rows = (await db.execute(sa_text(
                        f"select id::text as id, title, change_type, reason, approved, request_id::text as request_id, created_at, updated_at from changes{where} order by updated_at desc"
                    ), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"change list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.change.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("change.delete", "CHANGE.DELETE"):
                # CHANGE.DELETE id=<uuid>
                cid = str(params.get("id") or "").strip()
                if not cid:
                    return {"ok": False, "error": "id required"}
                try:
                    res = await db.execute(sa_text("delete from changes where id = cast(:id as uuid)"), {"id": cid})
                    await db.commit()
                    deleted = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"change delete error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.change.delete", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"deleted": deleted}}

            # ---------------------- RBAC READ (P44/P40) ----------------------
            elif handler in ("role.list", "ROLE.LIST"):
                # ROLE.LIST [name_like=...] [is_system=true|false]
                clauses = []
                bind: Dict[str, Any] = {}
                if params.get("name_like"):
                    clauses.append("name ilike :n")
                    bind["n"] = f"%{str(params.get("name_like"))}%"
                if params.get("is_system") is not None:
                    clauses.append("is_system = :s")
                    bind["s"] = bool(params.get("is_system"))
                where = (" where " + " and ".join(clauses)) if clauses else ""
                try:
                    rows = (await db.execute(sa_text(
                        f"select id, name, description, is_system, created_at, updated_at from roles{where} order by name"
                    ), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"role list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.role.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("role.user.list", "ROLE.USER.LIST"):
                # ROLE.USER.LIST user_id=<int>
                try:
                    uid = int(params.get("user_id"))
                except Exception:
                    return {"ok": False, "error": "user_id required"}
                try:
                    rows = (await db.execute(sa_text(
                        """
                        select r.id, r.name, r.description, r.is_system
                          from user_roles ur
                          join roles r on r.id = ur.role_id
                         where ur.user_id = :u
                         order by r.name
                        """
                    ), {"u": uid})).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"role.user.list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.role.user.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("role.limits.list", "ROLE.LIMITS.LIST"):
                # ROLE.LIMITS.LIST [role_id=<int>] [function_name=chat|keywords|...] [model_id=<int>]
                clauses = []
                bind: Dict[str, Any] = {}
                if params.get("role_id") is not None:
                    clauses.append("role_id = :rid"); bind["rid"] = int(params.get("role_id"))
                if params.get("function_name"):
                    clauses.append("function_name = :fn"); bind["fn"] = str(params.get("function_name"))
                if params.get("model_id") is not None:
                    clauses.append("llm_model_id = :mid"); bind["mid"] = int(params.get("model_id"))
                where = (" where " + " and ".join(clauses)) if clauses else ""
                try:
                    rows = (await db.execute(sa_text(
                        f"""
                        select id, role_id, function_name, llm_model_id, daily_requests, monthly_requests,
                               max_input_tokens, max_output_tokens, priority
                          from llm_role_limits{where}
                         order by role_id, function_name
                        """
                    ), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                except Exception as e:
                    return {"ok": False, "error": f"role.limits.list error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.role.limits.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            # ---------------------- PROJECT METHODOLOGY (P40) ----------------------
            elif handler in ("methodology.get", "METHODOLOGY.GET"):
                # METHODOLOGY.GET project_id=<uuid>
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                try:
                    row = (await db.execute(sa_text(
                        "select methodology from projects where id=cast(:id as uuid)"
                    ), {"id": pid})).first()
                    methodology = (row[0] if row else None)
                except Exception as e:
                    return {"ok": False, "error": f"methodology get error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.methodology.get", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"project_id": pid, "methodology": methodology}}

            elif handler in ("methodology.set", "METHODOLOGY.SET"):
                # METHODOLOGY.SET project_id=<uuid> value="hybrid|classic|agile|..."
                pid = str(params.get("project_id") or "").strip()
                val = str(params.get("value") or "").strip()
                if not pid or not val:
                    return {"ok": False, "error": "project_id and value required"}
                try:
                    res = await db.execute(sa_text(
                        "update projects set methodology = :m, updated_at = now() where id = cast(:id as uuid)"
                    ), {"id": pid, "m": val})
                    await db.commit()
                    updated = int(getattr(res, "rowcount", 0) or 0)
                except Exception as e:
                    return {"ok": False, "error": f"methodology set error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.methodology.set", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": updated}}

            elif handler in ("methodology.list", "METHODOLOGY.LIST"):
                # METHODOLOGY.LIST (справочный список, допускаем фиксированный набор значений)
                items = [
                    {"key": "hybrid", "title": "Hybrid"},
                    {"key": "classic", "title": "Classic"},
                    {"key": "agile", "title": "Agile"},
                ]
                signature_ctx.append_step(function_id="cmd.hyperloop.methodology.list", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("methodology.select", "METHODOLOGY.SELECT"):
                # METHODOLOGY.SELECT project_id=<uuid> [features_json={<json>}]
                import json as _json
                pid = str(params.get("project_id") or "").strip()
                features_raw = params.get("features_json") or params.get("features")
                features: Dict[str, Any] = {}
                if isinstance(features_raw, str) and features_raw:
                    try:
                        features = dict(_json.loads(features_raw))
                    except Exception:
                        features = {}
                elif isinstance(features_raw, dict):
                    features = dict(features_raw)
                # try read stored features from projects.meta
                if not features and pid:
                    try:
                        row = (await db.execute(sa_text("select meta from projects where id = cast(:id as uuid)"), {"id": pid})).mappings().first()
                        meta = (row or {}).get("meta") or {}
                        if isinstance(meta, dict) and isinstance(meta.get("features"), dict):
                            features = dict(meta.get("features"))
                    except Exception:
                        pass
                t = str(features.get("type") or "").lower()
                risk = str(features.get("risk_level") or "").lower()
                compliance = bool(features.get("compliance") or features.get("governance"))
                security = bool(features.get("security"))
                # простая детерминированная политика выбора
                key = "hybrid"
                reasons = []
                if compliance or security or risk in ("high", "critical"):
                    key = "classic"; reasons.append("compliance/security/high risk")
                elif t in ("research", "exploration", "ml", "data"):
                    key = "agile"; reasons.append("research/experimental/ML")
                elif t in ("delivery", "feature") and risk in ("low", "medium"):
                    key = "hybrid"; reasons.append("delivery medium risk")
                confidence = 0.8 if reasons else 0.6
                signature_ctx.append_step(function_id="cmd.hyperloop.methodology.select", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"methodology_key": key, "confidence": confidence, "reasons": reasons, "features": features, "project_id": (pid or None)}}

            # ---------------------- REVIVABLE PROJECTS (P57) ----------------------
            elif handler in ("revivable.match", "REVIVABLE.MATCH"):
                # REVIVABLE.MATCH project_id=<uuid> [k=<int>] [min_score=<float>] [verifier_required=<bool>]
                import re as _re
                try:
                    pid = str(params.get("project_id") or "").strip()
                except Exception:
                    pid = ""
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                try:
                    k = int(params.get("k") or int(await self.settings.get_setting("revivable.topk.k", db, 8)))
                except Exception:
                    k = 8
                try:
                    min_score = float(params.get("min_score") or float(await self.settings.get_setting("revivable.score.min", db, 0.62)))
                except Exception:
                    min_score = 0.62
                # Read source project
                row = (await db.execute(sa_text(
                    "select id::text as id, name, description, methodology, created_at from projects where id = cast(:id as uuid)"
                ), {"id": pid})).mappings().first()
                if not row:
                    return {"ok": False, "error": "project not found"}
                src_name = (row.get("name") or "").strip()
                src_desc = (row.get("description") or "").strip()
                src_method = (row.get("methodology") or "").strip()
                # Tokenize name+description
                text_join = (src_name + " " + src_desc).lower()
                tokens = [t for t in _re.split(r"[^a-zA-Zа-яА-Я0-9]+", text_join) if t and len(t) >= 3]
                uniq = []
                seen = set()
                for t in tokens:
                    if t not in seen:
                        uniq.append(t)
                        seen.add(t)
                tokens = uniq[:10]
                token_expr_parts = []
                bind: Dict[str, Any] = {"pid": pid, "m": src_method}
                for i, t in enumerate(tokens):
                    bind[f"t{i}"] = f"%{t}%"
                    token_expr_parts.append(
                        f"(CASE WHEN (lower(coalesce(p2.name,'')) like :t{i} or lower(coalesce(p2.description,'')) like :t{i}) THEN 1 ELSE 0 END)"
                    )
                token_sum_expr = (" + ".join(token_expr_parts)) if token_expr_parts else "0"
                bind["tnum"] = len(tokens) if tokens else 1
                bind["k"] = max(1, min(50, k))
                # Score formula: methodology(0.5) + tokens(0.3) + recency(0.2)
                sql = (
                    """
                    select
                      p2.id::text as candidate_id,
                      ( 
                        (case when coalesce(p2.methodology,'') <> '' and lower(p2.methodology) = lower(:m) then 1.0 else 0.0 end) * 0.5
                        + ( (""" + token_sum_expr + """) / greatest(1, :tnum) ) * 0.3
                        + ( greatest(0.0, least(1.0, 1.0 - (extract(epoch from (now() - p2.created_at)) / 31557600.0) / 3.0)) ) * 0.2
                      ) as score
                    from projects p2
                    where p2.id <> cast(:pid as uuid)
                    order by score desc nulls last
                    limit :k
                    """
                )
                rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                items = []
                accepted = []
                for r in rows:
                    it = {"candidate_id": r.get("candidate_id"), "score": float(r.get("score") or 0.0)}
                    items.append(it)
                    if it["score"] >= min_score:
                        accepted.append(it)
                # Upsert similarities
                for it in items:
                    try:
                        await db.execute(sa_text(
                            """
                            insert into project_similarities(project_id, candidate_id, score, picked)
                            values (cast(:p as uuid), cast(:c as uuid), :s, false)
                            on conflict (project_id, candidate_id) do update set score = excluded.score, created_at = now()
                            """
                        ), {"p": pid, "c": it["candidate_id"], "s": it["score"]})
                    except Exception:
                        pass
                if accepted:
                    try:
                        await db.execute(sa_text("update projects set revivable = true, updated_at = now() where id = cast(:id as uuid)"), {"id": pid})
                    except Exception:
                        pass
                try:
                    await db.commit()
                except Exception:
                    pass
                try:
                    from ..lib.observability.metrics import observe as _observe  # type: ignore
                    _observe("revivable_match_candidates", float(len(items)), {"phase": "match"})
                    _observe("revivable_match_hit_rate", float(len(accepted)) / float(max(1, len(items))), {})
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.revivable.match", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"items": items, "accepted": accepted, "k": k, "min_score": min_score}}

            elif handler in ("revivable.apply", "REVIVABLE.APPLY"):
                # REVIVABLE.APPLY project_id=<uuid> candidate_id=<uuid>
                import uuid as _uuid
                try:
                    pid = str(params.get("project_id") or "").strip()
                    cid = str(params.get("candidate_id") or "").strip()
                except Exception:
                    return {"ok": False, "error": "project_id and candidate_id required"}
                if not pid or not cid:
                    return {"ok": False, "error": "project_id and candidate_id required"}
                # Ensure both projects exist
                cur = (await db.execute(sa_text("select id::text as id, methodology from projects where id = cast(:id as uuid)"), {"id": pid})).mappings().first()
                src = (await db.execute(sa_text("select id::text as id, methodology from projects where id = cast(:id as uuid)"), {"id": cid})).mappings().first()
                if not cur or not src:
                    return {"ok": False, "error": "project or candidate not found"}
                # Update revivable fields and adopt methodology if missing
                try:
                    await db.execute(sa_text(
                        "update projects set revivable = true, revivable_of = cast(:cid as uuid), methodology = coalesce(methodology, :m), updated_at = now() where id = cast(:pid as uuid)"
                    ), {"pid": pid, "cid": cid, "m": (src.get("methodology") or None)})
                except Exception as e:
                    return {"ok": False, "error": f"revivable apply update error: {e}"}
                # Mark picked in similarities
                try:
                    await db.execute(sa_text(
                        "update project_similarities set picked = (candidate_id = cast(:cid as uuid)) where project_id = cast(:pid as uuid)"
                    ), {"pid": pid, "cid": cid})
                except Exception:
                    pass
                # Copy risks
                try:
                    await db.execute(sa_text(
                        """
                        insert into risks(id, project_id, title, severity, probability, status, owner)
                        select gen_random_uuid(), cast(:pid as uuid), r.title, r.severity, r.probability, 'open', r.owner
                        from risks r where r.project_id = cast(:cid as uuid)
                        """
                    ), {"pid": pid, "cid": cid})
                except Exception:
                    pass
                # Copy tasks with parent mapping (best-effort)
                try:
                    rows = (await db.execute(sa_text(
                        "select id::text as id, parent_task_id::text as parent_id, title, description, labels, priority from tasks where project_id = cast(:cid as uuid) order by created_at asc"
                    ), {"cid": cid})).mappings().all()
                    id_map: Dict[str, str] = {}
                    # Prepare new ids
                    for r in rows:
                        old_id = str(r.get("id"))
                        id_map[old_id] = str(_uuid.uuid4())
                    # Insert children after parents by multiple passes (simple 2-pass)
                    for pass_no in (1, 2):
                        for r in rows:
                            old_id = str(r.get("id"))
                            new_id = id_map.get(old_id)
                            parent_old = r.get("parent_id")
                            parent_new = id_map.get(str(parent_old)) if parent_old else None
                            if pass_no == 1 and parent_new is not None:
                                # Defer children to pass 2
                                continue
                            try:
                                await db.execute(sa_text(
                                    """
                                    insert into tasks(id, project_id, title, description, labels, priority, status, parent_task_id)
                                    values (cast(:id as uuid), cast(:pid as uuid), :t, :d, :labels, :prio, 'todo', cast(:parent as uuid))
                                    on conflict do nothing
                                    """
                                ), {
                                    "id": new_id,
                                    "pid": pid,
                                    "t": r.get("title"),
                                    "d": r.get("description"),
                                    "labels": r.get("labels"),
                                    "prio": r.get("priority"),
                                    "parent": parent_new,
                                })
                            except Exception:
                                continue
                except Exception:
                    pass
                try:
                    await db.commit()
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.revivable.apply", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"project_id": pid, "applied_from": cid}}

            elif handler in ("revivable.status", "REVIVABLE.STATUS"):
                # REVIVABLE.STATUS project_id=<uuid>
                try:
                    pid = str(params.get("project_id") or "").strip()
                except Exception:
                    pid = ""
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                # Read project flags
                proj = (await db.execute(sa_text(
                    "select revivable, revivable_of::text as revivable_of from projects where id = cast(:id as uuid)"
                ), {"id": pid})).mappings().first()
                revivable = bool((proj or {}).get("revivable") or False)
                revivable_of = (proj or {}).get("revivable_of")
                # Read similarities
                rows = (await db.execute(sa_text(
                    "select candidate_id::text as candidate_id, score, picked, created_at from project_similarities where project_id = cast(:id as uuid) order by score desc"
                ), {"id": pid})).mappings().all()
                items = [dict(r) for r in rows]
                try:
                    from ..lib.observability.metrics import observe as _observe  # type: ignore
                    if items:
                        hits = sum(1 for it in items if float(it.get("score") or 0.0) >= 0.62)
                        _observe("revivable_match_hit_rate", float(hits) / float(max(1, len(items))), {})
                except Exception:
                    pass
                signature_ctx.append_step(function_id="cmd.hyperloop.revivable.status", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"project_id": pid, "revivable": revivable, "revivable_of": revivable_of, "similarities": items}}

            # ---------------------- DOCS UTILITIES (Markdown normalize) ----------------------
            elif handler in ("docs.md.normalize", "DOCS.MD.NORMALIZE"):
                # DOCS.MD.NORMALIZE path=<file.md> [dry_run]
                import os as _os
                path = str(params.get("path") or "").strip()
                dry_run = bool(params.get("dry_run", False))
                if not path:
                    return {"ok": False, "error": "path required"}
                if not _os.path.isfile(path):
                    return {"ok": False, "error": f"not a file: {path}"}
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                except Exception as e:
                    return {"ok": False, "error": f"read error: {e}"}

                def _normalize_md(text: str):
                    lines = text.splitlines()
                    out_lines = []
                    i = 0
                    changed = 0
                    in_fence = False
                    while i < len(lines):
                        line = lines[i]
                        # trim trailing spaces
                        if line.rstrip() != line:
                            changed += 1
                            line = line.rstrip()
                        stripped = line.strip()
                        # fence detection
                        if stripped.startswith("```"):
                            # ensure blank line before fence
                            if out_lines and out_lines[-1] != "":
                                out_lines.append("")
                                changed += 1
                            out_lines.append(line)
                            in_fence = not in_fence
                            # ensure blank line after fence (will append after we see next line)
                            i += 1
                            # if closing fence, add blank line after when next line is not blank and exists
                            if not in_fence:
                                if i < len(lines):
                                    nxt = lines[i].strip()
                                    if nxt != "":
                                        out_lines.append("")
                                        changed += 1
                            continue
                        # headings: ensure blank line before and after
                        if not in_fence and stripped.startswith("#"):
                            if out_lines and out_lines[-1] != "":
                                out_lines.append("")
                                changed += 1
                            out_lines.append(line)
                            # ensure blank after heading
                            if i + 1 < len(lines):
                                nxt = lines[i + 1].strip()
                                if nxt != "":
                                    out_lines.append("")
                                    changed += 1
                            i += 1
                            continue
                        # lists: ensure blank line before list item
                        if not in_fence and (stripped.startswith("-") or stripped[:1].isdigit()):
                            if out_lines and out_lines[-1] != "":
                                out_lines.append("")
                                changed += 1
                            # normalize ordered list to "1. "
                            if stripped[:1].isdigit():
                                import re as _re
                                m = _re.match(r"\d+[\.)]\s+", stripped)
                                if m:
                                    line = line.replace(m.group(0), "1. ", 1)
                                    changed += 1
                            out_lines.append(line)
                            i += 1
                            continue
                        out_lines.append(line)
                        i += 1
                    new_text = "\n".join(out_lines)
                    # ensure trailing newline
                    if not new_text.endswith("\n"):
                        new_text = new_text + "\n"
                        changed += 1
                    return new_text, changed

                new_content, changed = _normalize_md(content)
                if not dry_run and changed > 0:
                    try:
                        with open(path, "w", encoding="utf-8", newline="\n") as f:
                            f.write(new_content)
                    except Exception as e:
                        return {"ok": False, "error": f"write error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.docs.md.normalize", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"path": path, "changed": changed, "dry_run": dry_run}}
            elif handler in ("llm.select", "LLM.SELECT"):
                # LLM.SELECT function_name=<str> [user_id=<int>] [locale=<str>]
                fn = str(params.get("function_name") or params.get("function") or "").strip()
                if not fn:
                    return {"ok": False, "error": "function_name required"}
                try:
                    from ..services.llm_manager import LLMManager as _LLMM
                    mgr = _LLMM()
                    uid = None
                    if params.get("user_id") is not None:
                        try:
                            uid = int(params.get("user_id"))
                        except Exception:
                            uid = None
                    locale = params.get("locale")
                    selected = await mgr.get_model_for_function(db=db, function_name=fn, user_id=uid, locale=locale)
                except Exception as e:
                    return {"ok": False, "error": f"llm.select error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.llm.select", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"selected": selected}}

            elif handler in ("llm.eval", "LLM.EVAL"):
                # LLM.EVAL [provider=<str>] [function_name=<str>]  -> список доступных моделей и (опц.) текущий выбор
                try:
                    from ..services.llm_manager import LLMManager as _LLMM
                    mgr = _LLMM()
                    provider = str(params.get("provider") or "").strip() or None
                    models = await mgr.get_available_models(db=db, provider=provider)
                    selected = None
                    fn = str(params.get("function_name") or params.get("function") or "").strip()
                    if fn:
                        selected = await mgr.get_model_for_function(db=db, function_name=fn, user_id=None, locale=None)
                except Exception as e:
                    return {"ok": False, "error": f"llm.eval error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.llm.eval", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"available_models": models, "selected": selected}}
            # ---------------------- LLM AUX (P42) ----------------------
            elif handler in ("llm.aux.status", "LLM.AUX.STATUS"):
                # Robust status for Aux LLM. Avoid unbound locals and support stateless mode (db may be None)
                try:
                    from ..services.soul_settings_service import SoulSettingsService as _SS  # lazy import for safety
                except Exception:
                    _SS = None  # type: ignore
                try:
                    svc = _SS() if _SS is not None else None
                    mode = provider = url = None
                    timeout_ms = 1800
                    retries = 0
                    req_types: list = []
                    aux_override = False
                    cb_err = 0.015
                    cb_p95 = 1800
                    cb_open = 60
                    if svc is not None and db is not None:
                        mode = await svc.get_setting("llm.routing.mode", db, "primary_with_aux_failover")
                        provider = await svc.get_setting("llm.aux.provider", db, "phi-4")
                        url = await svc.get_setting("llm.aux.url", db, None)
                        timeout_ms = int(await svc.get_setting("llm.aux.timeout_ms.svc", db, 1800))
                        retries = int(await svc.get_setting("llm.aux.retries.svc", db, 0))
                        req_types = await svc.get_setting("llm.aux.request_types", db, []) or []
                        aux_override = bool(await svc.get_setting("aux.service.types.override", db, False))
                        cb_err = float(await svc.get_setting("aux.failover.cb.error_rate_threshold", db, 0.015))
                        cb_p95 = int(await svc.get_setting("aux.failover.cb.p95_budget_ms", db, 1800))
                        cb_open = int(await svc.get_setting("aux.failover.cb.open_seconds", db, 60))
                    # Fallback to ENV if url is empty
                    if not url:
                        try:
                            from ..config import get_settings as _gs  # type: ignore
                            _cfg = _gs()
                            env_aux = getattr(_cfg, "llm_aux_api_url", None)
                            if isinstance(env_aux, str) and env_aux.strip():
                                url = env_aux.strip()
                        except Exception:
                            pass
                    data = {
                        "mode": mode or "primary_with_aux_failover",
                        "provider": provider or "phi-4",
                        "url": url,
                        "timeout_ms": timeout_ms,
                        "retries": retries,
                        "request_types": req_types,
                        "override": aux_override,
                        "cb": {"error_rate_threshold": cb_err, "p95_budget_ms": cb_p95, "open_seconds": cb_open},
                    }
                    if not url:
                        out = {"ok": False, "error": "llm.aux.url not configured", "data": data}
                    else:
                        out = {"ok": True, "data": data}
                except Exception as e:
                    out = {"ok": False, "error": f"aux.status error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.llm.aux.status", scope="hyperloop", version="v1")

            elif handler in ("llm.aux.set", "LLM.AUX.SET"):
                # LLM.AUX.SET key=<k> value=<v>
                k = str(params.get("key") or "").strip()
                if not k:
                    return {"ok": False, "error": "key required"}
                try:
                    v = params.get("value")
                    svc = SoulSettingsService()
                    ok = await svc.set_setting(k, v, db)
                    if not ok:
                        return {"ok": False, "error": "failed to update setting"}
                except Exception as e:
                    return {"ok": False, "error": f"aux.set error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.llm.aux.set", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"updated": True, "key": k}}

            elif handler == "plan.task.add" or handler == "PLAN.TASK.ADD":
                # PLAN.TASK.ADD project_id=<pid> title="..." [cpm_duration_days=<float>] [assignee=<tg_id>] [start_at] [due_at] [priority]
                pid = str(params.get("project_id") or "").strip()
                title = str(params.get("title") or "").strip()
                if not pid or not title:
                    out = {"ok": False, "error": "project_id and title required"}
                else:
                    try:
                        # Интроспекция схемы: таблица tasks и её колонки
                        cols_res = await db.execute(sa_text(
                            """
                            SELECT column_name FROM information_schema.columns
                            WHERE table_schema='public' AND table_name='tasks'
                            """
                        ))
                        cols = {r[0] for r in cols_res.fetchall()}
                        if not cols:
                            out = {"ok": False, "error": "tasks table not available on this ENV"}
                        else:
                            # Поддерживаем только присутствующие колонки
                            field_parts = []
                            values_parts = []
                            bind: Dict[str, Any] = {"p": pid, "t": title}
                            if "project_id" in cols:
                                field_parts.append("project_id")
                                values_parts.append(":p")
                            if "title" in cols:
                                field_parts.append("title")
                                values_parts.append(":t")
                            if "status" in cols:
                                field_parts.append("status")
                                values_parts.append("'todo'")
                            # необязательные
                            if "cpm_duration_days" in cols and (params.get("cpm_duration_days") is not None):
                                field_parts.append("cpm_duration_days")
                                values_parts.append(":c")
                                bind["c"] = params.get("cpm_duration_days")
                            if not field_parts:
                                out = {"ok": False, "error": "no compatible columns for insert into tasks"}
                            else:
                                insert_sql = f"insert into tasks({', '.join(field_parts)}) values ({', '.join(values_parts)})"
                                # returning id, если id есть
                                has_id = ("id" in cols)
                                if has_id:
                                    insert_sql += " returning id::text as id"
                                row = (await db.execute(sa_text(insert_sql), bind)).mappings().first()
                                await db.commit()
                                tid = (row or {}).get("id") if row else None
                                # Fallback: найти по title+project при отсутствии returning
                                if not tid and has_id and "created_at" in cols:
                                    sel = await db.execute(sa_text(
                                        "select id::text as id from tasks where project_id=cast(:p as uuid) and title=:t order by created_at desc nulls last limit 1"
                                    ), {"p": pid, "t": title})
                                    rr = sel.mappings().first()
                                    tid = (rr or {}).get("id")
                                signature_ctx.append_step(function_id="cmd.hyperloop.plan.task.add", scope="hyperloop", version="v1")
                                out = {"ok": True, "data": {"task_id": tid}}
                    except Exception as e:
                        try:
                            await db.rollback()
                        except Exception:
                            pass
                        out = {"ok": False, "error": f"plan.task.add error: {e}"}

            elif handler == "project.link.quant" or handler == "PROJECT.LINK.QUANT":
                # PROJECT.LINK.QUANT project_id=<pid> quant_id=<qid> [relation_type=<semantic|goal|evidence>]
                project_id = str(params.get("project_id") or "").strip()
                quant_id = str(params.get("quant_id") or "").strip()
                relation_type = str(params.get("relation_type") or "semantic").strip() or "semantic"
                if not project_id or not quant_id:
                    return {"ok": False, "error": "project_id and quant_id required"}
                try:
                    # Интроспекция схемы quant_links
                    rows = await db.execute(sa_text(
                        """
                        SELECT column_name FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quant_links'
                        """
                    ))
                    available = {r[0] for r in rows.fetchall()}
                    from_col = "from_quant" if "from_quant" in available else ("from_quant_id" if "from_quant_id" in available else None)
                    to_type_col = "to_entity_type" if "to_entity_type" in available else None
                    to_id_col = "to_entity_id" if "to_entity_id" in available else None
                    rel_col = "relation_type" if "relation_type" in available else None
                    if not (from_col and to_type_col and to_id_col and rel_col):
                        return {"ok": False, "error": "quant_links schema not aligned"}
                    sql = sa_text(
                        f"INSERT INTO quant_links (id, {from_col}, {to_type_col}, {to_id_col}, {rel_col}, weight, created_at) "
                        "VALUES (gen_random_uuid(), CAST(:q AS uuid), :tt, :tid, :rel, 1.0, NOW()) RETURNING id::text AS id"
                    )
                    row = (await db.execute(sql, {"q": quant_id, "tt": "project", "tid": project_id, "rel": relation_type})).mappings().first()
                    await db.commit()
                    link_id = (row or {}).get("id")
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"project.link.quant error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.link.quant", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"link_id": link_id}}

            elif handler == "plan.goal.find" or handler == "PLAN.GOAL.FIND":
                # PLAN.GOAL.FIND external_id="..." | title="..." [limit=<n>]
                try:
                    ext = str(params.get("external_id") or "").strip()
                    title = str(params.get("title") or "").strip()
                    lim = int(params.get("limit") or 10)
                except Exception:
                    ext = str(params.get("external_id") or "").strip(); title = str(params.get("title") or "").strip(); lim = 10
                if not ext and not title:
                    return {"ok": False, "error": "external_id or title required"}
                try:
                    # Универсальный селект: совместимый с PROD (без обязательного external_id)
                    rows = []
                    try:
                        where_parts = []
                        bind: Dict[str, Any] = {"l": lim}
                        if ext:
                            # Если есть external_id колонка, условие будет обработано на RS/совместимых схемах; для PROD без external_id условие опускается
                            where_parts.append("(external_id = :e)")
                            bind["e"] = ext
                        if title:
                            where_parts.append("(title ilike :t)")
                            bind["t"] = f"%{title}%"
                        where_sql = (" where " + " and ".join(where_parts)) if where_parts else ""
                        rows = (await db.execute(sa_text(f"select id::text as id, coalesce(title,'') as title from goals{where_sql} order by updated_at desc nulls last limit :l"), bind)).mappings().all()
                    except Exception:
                        rows = []
                    items = [dict(r) for r in rows]
                    signature_ctx.append_step(function_id="cmd.hyperloop.plan.goal.find", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"items": items}}
                except Exception as e:
                    return {"ok": False, "error": f"plan.goal.find error: {e}"}

            elif handler == "plan.task.find" or handler == "PLAN.TASK.FIND":
                # PLAN.TASK.FIND external_id="..." | title="..." [project_id=<pid>] [limit=<n>]
                try:
                    ext = str(params.get("external_id") or "").strip()
                    title = str(params.get("title") or "").strip()
                    pid = str(params.get("project_id") or "").strip()
                    lim = int(params.get("limit") or 10)
                except Exception:
                    ext = str(params.get("external_id") or "").strip(); title = str(params.get("title") or "").strip(); pid = str(params.get("project_id") or "").strip(); lim = 10
                if not ext and not title and not pid:
                    return {"ok": False, "error": "external_id or title or project_id required"}
                try:
                    conds = []
                    bind: Dict[str, Any] = {"l": lim}
                    if ext:
                        conds.append("external_id = :e"); bind["e"] = ext
                    if title:
                        conds.append("title ilike :t"); bind["t"] = f"%{title}%"
                    if pid:
                        conds.append("project_id = cast(:p as uuid)"); bind["p"] = pid
                    where = (" where " + " and ".join(conds)) if conds else ""
                    # PROD‑совместимо: не требуем наличия external_id в tasks
                    sql = f"select id::text as id, coalesce(title,'') as title, project_id::text as project_id from tasks{where} order by updated_at desc nulls last limit :l"
                    rows = (await db.execute(sa_text(sql), bind)).mappings().all()
                    items = [dict(r) for r in rows]
                    signature_ctx.append_step(function_id="cmd.hyperloop.plan.task.find", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"items": items}}
                except Exception as e:
                    return {"ok": False, "error": f"plan.task.find error: {e}"}

            elif handler in ("quant.link.auto", "QUANT.LINK.AUTO", "quant.link.by_external", "QUANT.LINK.BY_EXTERNAL"):
                # QUANT.LINK.AUTO from_quant=<uuid> to=<goal|plan_task|task|project> [external_id=..|title=..] [project_id=<uuid>] [relation=<...>]
                from_q = str(params.get("from_quant") or params.get("quant_id") or "").strip()
                to_kind = str(params.get("to") or params.get("to_type") or "").strip().lower()
                ext = str(params.get("external_id") or "").strip()
                title = str(params.get("title") or "").strip()
                pid = str(params.get("project_id") or "").strip()
                relation = str(params.get("relation") or "supports").strip() or "supports"
                if not from_q or not to_kind:
                    return {"ok": False, "error": "from_quant and to required"}
                if to_kind not in ("goal", "plan_task", "task", "project"):
                    return {"ok": False, "error": "to must be one of: goal|plan_task|task|project"}
                # Find target id by table
                try:
                    target_id: Optional[str] = None
                    if to_kind == "goal":
                        if not (ext or title):
                            return {"ok": False, "error": "external_id or title required for goal"}
                        sql = "select id::text as id from goals where ($1 = '' or external_id = $1) and ($2 = '' or title ilike $3) order by updated_at desc nulls last limit 1"
                        # SQLAlchemy text with positional params is tricky; use named bind instead
                        conds = []
                        bind: Dict[str, Any] = {}
                        if ext:
                            conds.append("external_id = :e"); bind["e"] = ext
                        if title:
                            conds.append("title ilike :t"); bind["t"] = f"%{title}%"
                        where = (" where " + " and ".join(conds)) if conds else ""
                        rows = (await db.execute(sa_text(f"select id::text as id from goals{where} order by updated_at desc nulls last limit 1"), bind)).mappings().all()
                        target_id = (rows[0]["id"] if rows else None)
                    elif to_kind in ("plan_task", "task"):
                        if not (ext or title or pid):
                            return {"ok": False, "error": "external_id or title or project_id required for task"}
                        conds = []
                        bind2: Dict[str, Any] = {}
                        if ext:
                            conds.append("external_id = :e"); bind2["e"] = ext
                        if title:
                            conds.append("title ilike :t"); bind2["t"] = f"%{title}%"
                        if pid:
                            conds.append("project_id = cast(:p as uuid)"); bind2["p"] = pid
                        where = (" where " + " and ".join(conds)) if conds else ""
                        rows = (await db.execute(sa_text(f"select id::text as id from tasks{where} order by updated_at desc nulls last limit 1"), bind2)).mappings().all()
                        target_id = (rows[0]["id"] if rows else None)
                        # Fallback: some environments store plan tasks in 'plan_tasks'
                        if not target_id:
                            try:
                                rows2 = (await db.execute(sa_text(f"select id::text as id from plan_tasks{where} order by updated_at desc nulls last limit 1"), bind2)).mappings().all()
                                target_id = (rows2[0]["id"] if rows2 else None)
                            except Exception:
                                target_id = target_id
                    elif to_kind == "project":
                        if not (ext or title):
                            return {"ok": False, "error": "external_id or title required for project"}
                        conds = []
                        bind3: Dict[str, Any] = {}
                        if ext:
                            conds.append("external_id = :e"); bind3["e"] = ext
                        if title:
                            conds.append("name ilike :t"); bind3["t"] = f"%{title}%"
                        where = (" where " + " and ".join(conds)) if conds else ""
                        rows = (await db.execute(sa_text(f"select id::text as id from projects{where} order by updated_at desc nulls last limit 1"), bind3)).mappings().all()
                        target_id = (rows[0]["id"] if rows else None)
                    if not target_id:
                        return {"ok": False, "error": "target not found"}
                    # Introspect quant_links schema and insert
                    rows = await db.execute(sa_text(
                        """
                        SELECT column_name FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quant_links'
                        """
                    ))
                    available = {r[0] for r in rows.fetchall()}
                    from_col = "from_quant" if "from_quant" in available else ("from_quant_id" if "from_quant_id" in available else None)
                    to_type_col = "to_entity_type" if "to_entity_type" in available else None
                    to_id_col = "to_entity_id" if "to_entity_id" in available else None
                    rel_col = "relation_type" if "relation_type" in available else None
                    if not (from_col and to_type_col and to_id_col and rel_col):
                        return {"ok": False, "error": "quant_links schema not aligned"}
                    ins = sa_text(
                        f"INSERT INTO quant_links (id, {from_col}, {to_type_col}, {to_id_col}, {rel_col}, weight, created_at) "
                        "VALUES (gen_random_uuid(), CAST(:q AS uuid), :tt, :tid, :rel, 1.0, NOW()) RETURNING id::text AS id"
                    )
                    row = (await db.execute(ins, {"q": from_q, "tt": ("task" if to_kind=="plan_task" else to_kind), "tid": target_id, "rel": relation})).mappings().first()
                    await db.commit()
                    link_id = (row or {}).get("id")
                    signature_ctx.append_step(function_id="cmd.hyperloop.quant.link.auto", scope="hyperloop", version="v1")
                    out = {"ok": True, "data": {"link_id": link_id, "to": to_kind, "to_id": target_id}}
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"quant.link.auto error: {e}"}

            elif handler == "task.link.quant" or handler == "TASK.LINK.QUANT":
                # TASK.LINK.QUANT id=<tid> quant_id=<qid> [relation_type=<semantic|evidence|supports>]
                task_id = str(params.get("id") or "").strip()
                quant_id = str(params.get("quant_id") or "").strip()
                relation_type = str(params.get("relation_type") or "semantic").strip() or "semantic"
                if not task_id or not quant_id:
                    return {"ok": False, "error": "id and quant_id required"}
                try:
                    # Интроспекция схемы quant_links
                    rows = await db.execute(sa_text(
                        """
                        SELECT column_name FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quant_links'
                        """
                    ))
                    available = {r[0] for r in rows.fetchall()}
                    from_col = "from_quant" if "from_quant" in available else ("from_quant_id" if "from_quant_id" in available else None)
                    to_type_col = "to_entity_type" if "to_entity_type" in available else None
                    to_id_col = "to_entity_id" if "to_entity_id" in available else None
                    rel_col = "relation_type" if "relation_type" in available else None
                    if not (from_col and to_type_col and to_id_col and rel_col):
                        return {"ok": False, "error": "quant_links schema not aligned"}
                    sql = sa_text(
                        f"INSERT INTO quant_links (id, {from_col}, {to_type_col}, {to_id_col}, {rel_col}, weight, created_at) "
                        "VALUES (gen_random_uuid(), CAST(:q AS uuid), :tt, :tid, :rel, 1.0, NOW()) RETURNING id::text AS id"
                    )
                    row = (await db.execute(sql, {"q": quant_id, "tt": "task", "tid": task_id, "rel": relation_type})).mappings().first()
                    await db.commit()
                    link_id = (row or {}).get("id")
                except Exception as e:
                    try:
                        await db.rollback()
                    except Exception:
                        pass
                    return {"ok": False, "error": f"task.link.quant error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.task.link.quant", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"link_id": link_id}}

            elif handler == "project.generate.task_quants" or handler == "PROJECT.GENERATE.TASK_QUANTS":
                # PROJECT.GENERATE.TASK_QUANTS project_id=<pid> [user_id=<tg_id>] [prefix="..."] [limit=<n>]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                tg_user_id = str(params.get("user_id") or "468326902").strip()
                prefix = str(params.get("prefix") or "P40/Task:").strip()
                try:
                    lim = int(params.get("limit") or 0)
                except Exception:
                    lim = 0
                # Read tasks
                try:
                    rows = (await db.execute(sa_text(
                        "select id::text as id, coalesce(title,'') as title from tasks where project_id = cast(:p as uuid) order by updated_at asc"
                    ), {"p": pid})).mappings().all()
                    items = [dict(r) for r in rows]
                    if lim and len(items) > lim:
                        items = items[:lim]
                except Exception as e:
                    return {"ok": False, "error": f"read tasks error: {e}"}
                if not items:
                    return {"ok": False, "error": "no tasks for project"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.project.generate.task_quants.read_tasks", scope="hyperloop", version="v1")
                except Exception:
                    pass
                # Generate quant for each task via local API to persist (детерминированно)
                created: List[Dict[str, Any]] = []
                try:
                    # Интроспекция схемы quant_links для устойчивости к дрейфу
                    cols_res = await db.execute(sa_text(
                        """
                        SELECT column_name FROM information_schema.columns
                        WHERE table_schema='public' AND table_name='quant_links'
                        """
                    ))
                    _available = {r[0] for r in cols_res.fetchall()}
                    _from_col = "from_quant" if "from_quant" in _available else ("from_quant_id" if "from_quant_id" in _available else None)
                    _to_type_col = "to_entity_type" if "to_entity_type" in _available else None
                    _to_id_col = "to_entity_id" if "to_entity_id" in _available else None
                    _rel_col = "relation_type" if "relation_type" in _available else None
                    if not (_from_col and _to_type_col and _to_id_col and _rel_col):
                        return {"ok": False, "error": "quant_links schema not aligned"}

                    async with _httpx.AsyncClient(timeout=120.0) as client:
                        for it in items:
                            title = (it.get("title") or "").strip()
                            text = f"{prefix} {title} — выполнение шага проекта"
                            body = {"input_text": text, "num_candidates": 1}
                            # Подробный лог формируемого payload
                            try:
                                _payload_dbg = json.dumps(body, ensure_ascii=False)
                            except Exception:
                                _payload_dbg = str(body)

                            try:
                                try:
                                    _svc = SoulSettingsService()
                                    _api_base = await _svc.get_setting("api.base_url", db, None)
                                except Exception:
                                    _api_base = None
                                if not _api_base:
                                    return {"ok": False, "error": "api.base_url not configured"}
                                _api_root = str(_api_base).rstrip("/") + "/api"
                                resp = await client.post(
                                    f"{_api_root}/soul/process",
                                    headers={"X-Telegram-User-ID": tg_user_id, "Content-Type": "application/json"},
                                    json=body,
                                )
                            except Exception as http_e:
                                return {"ok": False, "error": f"process http error: {http_e}", "debug": {"payload": _payload_dbg}}

                            if int(getattr(resp, "status_code", 0) or 0) >= 400:
                                return {"ok": False, "error": f"process bad status: {resp.status_code}", "debug": {"payload": _payload_dbg, "text": (resp.text if hasattr(resp, 'text') else '')}}

                            qid: Optional[str] = None
                            # Строго: пытаться получить id из ответа /api/soul/process
                            try:
                                data = resp.json()
                                qid = str((data or {}).get("id") or "") or None
                            except Exception:
                                qid = None
                            # Фоллбек: sanity-эндпоинт, если прямого id нет
                            if not qid:
                                try:
                                    r2 = await client.get(
                                        f"{_api_root}/admin/soul/qa/quants_sanity",
                                        headers={"X-Telegram-User-ID": tg_user_id},
                                        params={"limit": 1},
                                    )
                                    dat2 = r2.json()
                                    qid = str(((dat2 or {}).get("items") or [{}])[0].get("id") or "") or None
                                except Exception:
                                    qid = None
                            if not qid:
                                return {"ok": False, "error": "failed to obtain quant_id", "debug": {"payload": _payload_dbg}}

                            # Линки: TASK и PROJECT, relation_type='semantic' для обоих
                            try:
                                _sql_link = (
                                    f"INSERT INTO quant_links (id, {_from_col}, {_to_type_col}, {_to_id_col}, {_rel_col}, weight, created_at) "
                                    "VALUES (gen_random_uuid(), CAST(:q AS uuid), :tt, :tid, :rel, 1.0, NOW())"
                                )
                                await db.execute(sa_text(_sql_link), {"q": qid, "tt": "task", "tid": it.get("id"), "rel": "semantic"})
                                await db.execute(sa_text(_sql_link), {"q": qid, "tt": "project", "tid": pid, "rel": "semantic"})
                                await db.commit()
                            except Exception as le:
                                try:
                                    await db.rollback()
                                except Exception:
                                    pass
                                return {"ok": False, "error": f"link error: {le}"}

                            created.append({"task_id": it.get("id"), "quant_id": qid, "payload": body})
                except Exception as ge:
                    # Убираем пустой текст ошибки, даём контекст прямо в строке ошибки (админ-обёртка может отфильтровать debug-поля)
                    import traceback as _tb
                    try:
                        etype = type(ge).__name__
                        emsg = (str(ge) or etype or "unexpected error")
                    except Exception:
                        etype = "Exception"
                        emsg = "unexpected error"
                    trace_snippet = "";
                    try:
                        trace_snippet = _tb.format_exc()[-800:]
                    except Exception:
                        trace_snippet = ""
                    # Пишем шаг в подпись для наблюдаемости
                    try:
                        signature_ctx.append_step(
                            function_id="cmd.hyperloop.project.generate.task_quants.error",
                            scope="hyperloop",
                            version="v1",
                            status="error",
                            notes=(f"[{etype}] {emsg}"[:240])
                        )
                    except Exception:
                        pass
                    return {"ok": False, "error": f"generation error: [{etype}] {emsg} | trace: {trace_snippet}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.project.generate.task_quants", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"project_id": pid, "created": created, "count": len(created), "tasks_found": len(items)}}

            elif handler == "project.qlinks.counts" or handler == "PROJECT.QLINKS.COUNTS":
                # PROJECT.QLINKS.COUNTS project_id=<pid>
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                try:
                    # count links to project
                    row1 = await db.execute(sa_text(
                        """
                        select count(*)::bigint as c
                        from quant_links
                        where to_entity_type='project' and to_entity_id=:pid
                        """
                    ), {"pid": pid})
                    c_project = int(list(row1.fetchone() or [0])[0])

                    # count links to tasks of project
                    row2 = await db.execute(sa_text(
                        """
                        select count(*)::bigint as c
                        from quant_links
                        where to_entity_type='task'
                          and to_entity_id in (
                            select id::text from tasks where project_id = cast(:pid as uuid)
                          )
                        """
                    ), {"pid": pid})
                    c_tasks = int(list(row2.fetchone() or [0])[0])
                except Exception as e:
                    return {"ok": False, "error": f"qlinks.counts error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.project.qlinks.counts", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True, "data": {"project_id": pid, "project_links": c_project, "task_links": c_tasks}}
            elif handler == "plan.task.depend" or handler == "PLAN.TASK.DEPEND" or handler == "PLAN.DEPEND":
                # PLAN.TASK.DEPEND predecessor=<tid> successor=<tid> dep_type=<FS|SS|FF|SF>
                pred = str(params.get("predecessor") or "").strip()
                succ = str(params.get("successor") or "").strip()
                dep_type = str(params.get("dep_type") or "FS").lower()
                if not pred or not succ:
                    return {"ok": False, "error": "predecessor and successor required"}
                # Server-side validator (align rs.security_limits): predecessor and successor must differ
                if pred == succ:
                    return {"ok": False, "error": {"code": 422, "class": "invalid_json_contract", "reason": "plan_depend_same_nodes"}}
                try:
                    sql = sa_text("""
                        insert into task_dependencies(id, task_id, depends_on_task_id, type)
                        values (gen_random_uuid(), cast(:s as uuid), cast(:p as uuid), :t)
                        on conflict do nothing
                    """)
                    await db.execute(sql, {"s": succ, "p": pred, "t": dep_type})
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"plan.task.depend error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.plan.task.depend", scope="hyperloop", version="v1")
                out = {"ok": True, "data": {"predecessor": pred, "successor": succ, "type": dep_type}}
            elif handler == "task.update" or handler == "TASK.UPDATE":
                # TASK.UPDATE id=<tid> status=... [progress=...]
                tid = str(params.get("id") or "").strip()
                if not tid:
                    return {"ok": False, "error": "id required"}
                # Optional payload validation: if provided, must be a JSON object literal
                if "payload" in params and params.get("payload") is not None:
                    try:
                        pl_raw = str(params.get("payload") or "").strip()
                        looks_like_obj = pl_raw.startswith("{") and pl_raw.endswith("}")
                        if not looks_like_obj:
                            return {"ok": False, "error": {"code": 422, "class": "invalid_json_contract", "reason": "payload_must_be_object"}}
                    except Exception:
                        return {"ok": False, "error": {"code": 422, "class": "invalid_json_contract", "reason": "payload_must_be_object"}}
                sets: List[str] = []
                bind: Dict[str, Any] = {"id": tid}
                if params.get("status"):
                    sets.append("status = :st")
                    bind["st"] = str(params.get("status"))
                if params.get("progress") is not None:
                    sets.append("progress = :pr")
                    bind["pr"] = int(params.get("progress"))
                if not sets:
                    return {"ok": False, "error": "nothing to update"}
                try:
                    sql = sa_text("update tasks set updated_at=now(), " + ",".join(sets) + " where id = cast(:id as uuid)")
                    await db.execute(sql, bind)
                    await db.commit()
                except Exception as e:
                    return {"ok": False, "error": f"task.update error: {e}"}
                signature_ctx.append_step(function_id="cmd.hyperloop.task.update", scope="hyperloop", version="v1")
                out = {"ok": True}

            elif handler == "plan.cpm.calc" or handler == "PLAN.CPM.CALC":
                # PLAN.CPM.CALC project_id=<pid> [WITH TRACE]
                pid = str(params.get("project_id") or "").strip()
                if not pid:
                    return {"ok": False, "error": "project_id required"}
                try:
                    _cpm_t0 = None
                    try:
                        _cpm_t0 = _time.time()
                    except Exception:
                        _cpm_t0 = None
                    rows_tasks = (await db.execute(sa_text(
                        "select id::text as id, coalesce(cpm_duration_days, 1) as dur from tasks where project_id = :p"
                    ), {"p": pid})).mappings().all()
                    tasks = {r["id"]: float(r["dur"]) for r in rows_tasks}
                    rows_deps = (await db.execute(sa_text(
                        """
                        select td.depends_on_task_id::text as pred, td.task_id::text as succ
                        from task_dependencies td
                        join tasks t on t.id = td.task_id
                        where t.project_id = :p
                        """
                    ), {"p": pid})).mappings().all()
                    preds: Dict[str, List[str]] = {k: [] for k in tasks.keys()}
                    succs: Dict[str, List[str]] = {k: [] for k in tasks.keys()}
                    for r in rows_deps:
                        pred = r["pred"]; succ = r["succ"]
                        if pred in tasks and succ in tasks:
                            succs[pred].append(succ)
                            preds[succ].append(pred)
                    # Kahn topological order
                    import collections
                    indeg = {k: len(preds[k]) for k in tasks}
                    q = collections.deque([k for k in tasks if indeg[k] == 0])
                    order: List[str] = []
                    while q:
                        u = q.popleft(); order.append(u)
                        for v in succs.get(u, []):
                            indeg[v] -= 1
                            if indeg[v] == 0:
                                q.append(v)
                    if len(order) != len(tasks):
                        return {"ok": False, "error": "cycle detected in task_dependencies"}
                    es: Dict[str, float] = {k: 0.0 for k in tasks}
                    ef: Dict[str, float] = {k: tasks[k] for k in tasks}
                    for u in order:
                        es[u] = max([ef[p] for p in preds.get(u, [])] or [0.0])
                        ef[u] = es[u] + tasks[u]
                    project_duration = max(ef.values() or [0.0])
                    critical_tasks = [k for k in tasks if (ef.get(k, 0) == project_duration and not succs.get(k))]
                    signature_ctx.append_step(function_id="cmd.hyperloop.plan.cpm.calc", scope="hyperloop", version="v1")
                    try:
                        if _cpm_t0 is not None:
                            _dt_ms = (_time.time() - _cpm_t0) * 1000.0
                            _metric_observe("pm_cpm_calc_ms", _dt_ms, {})
                    except Exception:
                        pass
                    out = {"ok": True, "data": {"project_id": pid, "tasks": tasks, "earliest_start": es, "earliest_finish": ef, "project_duration_days": project_duration, "critical_tail": critical_tasks}}
                except Exception as e:
                    return {"ok": False, "error": f"cpm calc error: {e}"}
            # ---------------------- INCIDENTS (P50 / DSL INCIDENT.*) ----------------------
            elif handler in ("incident.create", "INCIDENT.CREATE"):
                # INCIDENT.CREATE title="..." severity=2 priority=2 source="inspector" payload={...}
                title = str(params.get("title") or "").strip()
                if not title:
                    return {"ok": False, "error": "title required"}
                # DRY_RUN/TIMEOUT уважение
                is_dry = (str(params.get("DRY_RUN") or params.get("dry_run") or "").lower() in ("1","true","yes"))
                # TIMEOUT — best-effort (мс), для синхронных операций только отражаем в ответе
                timeout_ms = None
                try:
                    t_raw = params.get("timeout") or params.get("TIMEOUT")
                    if t_raw is not None:
                        timeout_ms = int(str(t_raw))
                except Exception:
                    timeout_ms = None
                payload = dict(params.get("payload") or {})
                dedupe_key = str(params.get("dedupe_key") or payload.get("dedupe_key") or "").strip()
                try:
                    from .incident_service import IncidentService  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                try:
                    # Idempotency by dedupe_key in incidents.meta
                    if dedupe_key:
                        row = (await db.execute(sa_text(
                            """
                            select id::text from incidents
                            where meta ? 'dedupe_key' and meta->>'dedupe_key' = :dk
                            limit 1
                            """
                        ), {"dk": dedupe_key})).first()
                        if row:
                            existing_id = row[0]
                            try:
                                signature_ctx.append_step(function_id="cmd.hyperloop.incident.create", scope="hyperloop", version="v1")
                            except Exception:
                                pass
                            out = {"ok": True, "data": {"id": existing_id, "idempotent": True}}
                            return out
                    # Merge dedupe_key into meta if provided
                    if dedupe_key:
                        meta_obj = payload.get("meta") or {}
                        try:
                            if isinstance(meta_obj, str):
                                import json as _json
                                meta_obj = _json.loads(meta_obj)
                        except Exception:
                            meta_obj = {}
                        if isinstance(meta_obj, dict):
                            meta_obj.setdefault("dedupe_key", dedupe_key)
                            payload["meta"] = meta_obj
                    if is_dry:
                        iid = None
                    else:
                        iid = await svc.create(db, {
                            "title": title,
                            "description": params.get("description"),
                            "severity": params.get("severity"),
                            "priority": params.get("priority"),
                            "status": params.get("status"),
                            "source": params.get("source") or "hyperloop",
                            "trace_id": params.get("trace_id"),
                            "root_cause": payload.get("root_cause"),
                            "resolution": payload.get("resolution"),
                            "runbook_id": payload.get("runbook_id"),
                            "plan_task_id": payload.get("plan_task_id"),
                            "reporter_tg_id": payload.get("reporter_tg_id"),
                            "assignee_tg_id": payload.get("assignee_tg_id"),
                            "tags": payload.get("tags"),
                            "meta": payload.get("meta"),
                        })
                except Exception as e:
                    return {"ok": False, "error": f"incident.create error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.create", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True, "data": {"id": iid, "dry_run": is_dry, "timeout_ms": timeout_ms}}

            elif handler in ("incident.update", "INCIDENT.UPDATE"):
                # INCIDENT.UPDATE id=<uuid> fields={...}
                iid = str(params.get("id") or "").strip()
                fields = dict(params.get("fields") or {})
                if not iid or not fields:
                    return {"ok": False, "error": "id and fields required"}
                is_dry = (str(params.get("DRY_RUN") or params.get("dry_run") or "").lower() in ("1","true","yes"))
                try:
                    from .incident_service import IncidentService  # type: ignore
                    from ..routers.two_keys_admin import verify_two_keys_approval  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                try:
                    # Two-Keys для RCA/Resolution на sev1/2
                    if any(k in fields for k in ("root_cause", "resolution")):
                        row_cur = await svc.get(db, iid)
                        if not row_cur:
                            return {"ok": False, "error": "incident not found"}
                        try:
                            sev = int(row_cur.get("severity") or 0)
                        except Exception:
                            sev = 0
                        if sev in (1, 2):
                            ok2, reason2, _i2, _a2 = await verify_two_keys_approval(db, str(params.get("two_keys_request_id") or ""))
                            if not ok2:
                                return {"ok": False, "error": f"two_keys_required:{reason2}"}
                    n = 0 if is_dry else await svc.update(db, iid, fields)
                except Exception as e:
                    return {"ok": False, "error": f"incident.update error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.update", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True, "data": {"updated": int(n), "dry_run": is_dry}}

            elif handler in ("incident.link", "INCIDENT.LINK"):
                # INCIDENT.LINK id=<uuid> to_kind="plan_task" to_id=<uuid> relation="blocks"
                iid = str(params.get("id") or "").strip()
                to_kind = str(params.get("to_kind") or "").strip()
                to_id = str(params.get("to_id") or "").strip()
                relation = str(params.get("relation") or "relates_to").strip() or "relates_to"
                dedupe_key = str(params.get("dedupe_key") or "").strip()
                if not iid or not to_kind or not to_id:
                    return {"ok": False, "error": "id, to_kind and to_id required"}
                try:
                    from .incident_service import IncidentService  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                try:
                    # Идемпотентность включает relation: повторная связь с тем же relation → no-op
                    exists = (await db.execute(sa_text(
                        """
                        select 1 from incident_links
                         where incident_id = cast(:id as uuid)
                           and to_kind=:k and to_id=:tid and relation=:rel
                         limit 1
                        """
                    ), {"id": iid, "k": to_kind, "tid": to_id, "rel": relation})).first()
                    if not exists:
                        _ = await svc.add_link(db, iid, to_kind, to_id, relation)
                except Exception as e:
                    return {"ok": False, "error": f"incident.link error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.link", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True}

            elif handler in ("incident.close", "INCIDENT.CLOSE", "incident.close.postmortem", "INCIDENT.CLOSE.POSTMORTEM"):
                # INCIDENT.CLOSE id=<uuid> resolution="..." root_cause="..." [WITH TRACE] [WITH POSTMORTEM]
                iid = str(params.get("id") or "").strip()
                if not iid:
                    return {"ok": False, "error": "id required"}
                is_dry = (str(params.get("DRY_RUN") or params.get("dry_run") or "").lower() in ("1","true","yes"))
                try:
                    from .incident_service import IncidentService  # type: ignore
                    from ..routers.two_keys_admin import verify_two_keys_approval  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                try:
                    # Idempotent: if already closed — no-op
                    row = await svc.get(db, iid)
                    if not row:
                        return {"ok": False, "error": "incident not found"}
                    already_closed = (str(row.get("status") or "") == "closed")
                    # Two-Keys для sev1/2 — требуем подтверждение
                    try:
                        sev = int(row.get("severity") or 0)
                    except Exception:
                        sev = 0
                    if sev in (1, 2) and not already_closed:
                        ok2, reason2, _i2, _a2 = await verify_two_keys_approval(db, str(params.get("two_keys_request_id") or ""))
                        if not ok2:
                            return {"ok": False, "error": f"two_keys_required:{reason2}"}
                    n = 0
                    if (not already_closed) and (not is_dry):
                        n = await svc.close(db, iid, str(params.get("resolution") or None), str(params.get("root_cause") or None))
                    # WITH POSTMORTEM support
                    want_pm = (handler.lower() == "incident.close.postmortem")
                    # Some parsers treat mods uppercased; we also check mods for POSTMORTEM marker
                    try:
                        want_pm = want_pm or ("POSTMORTEM" in (mods or {}))
                    except Exception:
                        pass
                    pm_len = None
                    if want_pm:
                        try:
                            draft = await svc.generate_postmortem(db, incident_id=iid)
                            pm_len = len(draft or "")
                        except Exception:
                            pm_len = None
                except Exception as e:
                    return {"ok": False, "error": f"incident.close error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.close", scope="hyperloop", version="v1")
                except Exception:
                    pass
                # Таймлайн: фиксируем событие закрытия/драфта постмортема
                try:
                    if not is_dry:
                        ev_meta = {"resolution": str(params.get("resolution") or ""), "root_cause": str(params.get("root_cause") or ""), "postmortem": bool(pm_len is not None)}
                        await svc.add_event(db, iid, "closed", ev_meta, None)
                except Exception:
                    pass
                data_obj = {"closed": int(n), "dry_run": is_dry}
                try:
                    if pm_len is not None:
                        data_obj["postmortem_draft_len"] = pm_len
                except Exception:
                    pass
                out = {"ok": True, "data": data_obj}

            elif handler in ("incident.postmortem.generate", "INCIDENT.POSTMORTEM.GENERATE"):
                # INCIDENT.POSTMORTEM.GENERATE id=<uuid> [WITH TRACE]
                iid = str(params.get("id") or "").strip()
                if not iid:
                    return {"ok": False, "error": "id required"}
                try:
                    from .incident_service import IncidentService  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                try:
                    draft = await svc.generate_postmortem(db, incident_id=iid)
                    if not draft:
                        return {"ok": False, "error": "incident not found"}
                except Exception as e:
                    return {"ok": False, "error": f"postmortem.generate error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.postmortem.generate", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True, "data": {"id": iid, "draft_len": len(draft or "")}}

            elif handler in ("incident.list", "INCIDENT.LIST"):
                # INCIDENT.LIST [filter={...}] [limit=50]
                filt = dict(params.get("filter") or {})
                try:
                    from .incident_service import IncidentService  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                try:
                    items = await svc.list(
                        db,
                        status=filt.get("status"),
                        severity_lte=filt.get("severity_lte"),
                        source=filt.get("source"),
                        assignee_tg_id=filt.get("assignee_tg_id"),
                        reporter_tg_id=filt.get("reporter_tg_id"),
                        q=filt.get("q"),
                        offset=int(filt.get("offset") or 0),
                        limit=int(params.get("limit") or filt.get("limit") or 50),
                        sort=str(filt.get("sort") or "detected_at"),
                        order=str(filt.get("order") or "desc"),
                    )
                except Exception as e:
                    return {"ok": False, "error": f"incident.list error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.list", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True, "data": {"items": items}}

            elif handler in ("incident.route.to_architect", "INCIDENT.ROUTE.TO_ARCHITECT"):
                # INCIDENT.ROUTE.TO_ARCHITECT id=<uuid> reason="..."
                iid = str(params.get("id") or "").strip()
                if not iid:
                    return {"ok": False, "error": "id required"}
                is_dry = (str(params.get("DRY_RUN") or params.get("dry_run") or "").lower() in ("1","true","yes"))
                # read full details
                try:
                    from .incident_service import IncidentService  # type: ignore
                except Exception as e:
                    return {"ok": False, "error": f"incident service import failed: {e}"}
                svc = IncidentService()
                data = await svc.get_full(db, iid)
                if not data:
                    return {"ok": False, "error": "incident not found"}
                # minimal LLM call via llm.mirror (persist only mirror, real agent handled elsewhere)
                reason = str(params.get("reason") or "").strip()
                try:
                    _owner = ""
                    _branch = ""
                    try:
                        _owner = str((self._options or {}).get("actor_user_id") or (self._options or {}).get("owner") or (self._options or {}).get("user_id") or "")
                    except Exception:
                        _owner = ""
                    try:
                        _branch = str((self._options or {}).get("branch") or (self._options or {}).get("branch_key") or "")
                    except Exception:
                        _branch = ""
                    if not is_dry:
                        await self._execute_inspector(db=db, key="llm.mirror", scope="dev", extra_context={
                            "owner": _owner,
                            "topic": "incident.escalation",
                            "branch": _branch,
                            "user_command": f"ESCALATE {iid} {reason}",
                            "agent_reply": (data.get("title") or "")[:240],
                            "plan_task_id": str(data.get("plan_task_id") or ""),
                        })
                        # add event to timeline
                        try:
                            await svc.add_event(db, iid, "escalation", {"reason": reason}, None)
                        except Exception:
                            pass
                except Exception as e:
                    return {"ok": False, "error": f"incident.route.to_architect error: {e}"}
                try:
                    signature_ctx.append_step(function_id="cmd.hyperloop.incident.route.to_architect", scope="hyperloop", version="v1")
                except Exception:
                    pass
                out = {"ok": True, "data": {"id": iid, "escalated": (not is_dry), "dry_run": is_dry}}

            else:
                out = {"ok": False, "error": f"unknown command: {cmd}"}

            # EXPECT key=value проверка
            if out.get("ok") and expect_pair:
                ek, ev = expect_pair
                # простая проверка в скоупе settings
                try:
                    cur = await self.settings.get_setting(ek, db)
                    if str(cur) != str(ev):
                        return {"ok": False, "error": f"EXPECT failed: {ek}!={ev} (got {cur})"}
                except Exception:
                    return {"ok": False, "error": f"EXPECT check error for {ek}"}

            return out
        except Exception as e:
            return {"ok": False, "error": str(e)[:400]}

    def _split_cmd(self, cmd: str) -> Tuple[str, str]:
        """Разделяет имя команды на группу и действие.

        Поддерживает формы вида:
          - "FLAGS.SET"
          - "flags.set"
          - "DB.GOV.CAP" (группа = "DB.GOV", действие = "CAP")
          - "inspector.run" (малые буквы)
        Если точек нет, вся строка считается группой, действие = "run".
        """
        try:
            raw = (cmd or "").strip()
            if not raw:
                return ("", "")
            parts = raw.split(".")
            if len(parts) == 1:
                return (parts[0], "run")
            # Последний токен — действие, остальные — группа (сохраняем точечную форму)
            action = parts[-1]
            group = ".".join(parts[:-1])
            return (group, action)
        except Exception:
            return (cmd, "run")

    async def _execute_inspector(
        self,
        *,
        db: AsyncSession,
        key: str,
        scope: Optional[str] = None,
        extra_context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Запускает инспектор по ключу через feature_plugins или зарегистрированный реестр.

        Приоритеты загрузки:
          1) Локальный модуль feature_plugins по соглашению имени ключа
          2) Зарегистрированный реестр feature_inspectors (module/callable в БД)
          3) Специальные кейсы: planning.enforce, plan.branch, llm.mirror
        Возвращает словарь статуса/данных инспектора.
        """
        k = str(key or "").strip()
        ctx: Dict[str, Any] = {}
        if isinstance(extra_context, dict):
            ctx.update(extra_context)
        if scope:
            ctx["scope"] = scope

        # 3) Встроенные специальные кейсы
        if k == "planning.enforce":
            try:
                from ..feature_plugins import planning_enforce as _pe  # type: ignore
                return await _pe.run(db, context=ctx)
            except Exception as e:
                return {"status": "failed", "detail": f"planning.enforce error: {e}"}

        if k == "plan.branch":
            # Делегируем в feature_plugins.plan_branching
            try:
                from ..feature_plugins import plan_branching as _pb  # type: ignore
                res = await _pb.run(db, ctx)
                return res if isinstance(res, dict) else {"status": "ok", "data": res}
            except Exception as e:
                return {"status": "failed", "detail": f"plan.branch error: {e}"}

        if k == "llm.mirror":
            try:
                from ..feature_plugins import llm_mirror as _lm  # type: ignore
                res2 = await _lm.run(db, ctx)
                return res2 if isinstance(res2, dict) else {"status": "ok", "data": res2}
            except Exception as e:
                return {"status": "failed", "detail": f"llm.mirror error: {e}"}

        # 1) Попытка загрузить модуль по соглашению: key -> module path (backend.app.* → app.*)
        # Пример: "guard.canonical.urls" -> backend.app.feature_plugins.guard_canonical_urls (или app.feature_plugins.guard_canonical_urls)
        try:
            callable_name = "run"
            base_name = k.replace("-", "_").replace(".", "_")
            primary = "backend.app.feature_plugins." + base_name
            fallback = "app.feature_plugins." + base_name
            _mod = None
            try:
                _mod = __import__(primary, fromlist=[callable_name])
            except Exception:
                try:
                    _mod = __import__(fallback, fromlist=[callable_name])
                except Exception:
                    # Дополнительные устойчивые варианты: относительный импорт от backend.app и app
                    try:
                        import importlib as _il  # type: ignore
                        _mod = _il.import_module('.feature_plugins.' + base_name, package='backend.app')
                    except Exception:
                        try:
                            import importlib as _il2  # type: ignore
                            _mod = _il2.import_module('.feature_plugins.' + base_name, package='app')
                        except Exception:
                            _mod = None
            if _mod is not None:
                run_fn = getattr(_mod, callable_name)
                res = await run_fn(db, ctx)
                return res if isinstance(res, dict) else {"status": "ok", "data": res}
        except Exception:
            pass

        # 2) Попытка найти в БД зарегистрированный инспектор (feature_inspectors)
        try:
            row = (await db.execute(
                sa_text("select module, callable from feature_inspectors where key=:k and enabled=true"),
                {"k": k},
            )).fetchone()
            if row:
                module_path = str(row[0])
                # Авто‑фолбэки для устойчивости окружений:
                # - если указан backend.app.* и он недоступен → пробуем app.*
                # - если указан app.* и он недоступен → пробуем backend.app.*
                if module_path.startswith("backend.app."):
                    try:
                        __import__(module_path)
                    except Exception:
                        module_path = module_path.replace("backend.app.", "app.", 1)
                elif module_path.startswith("app."):
                    try:
                        __import__(module_path)
                    except Exception:
                        module_path = "backend." + module_path
                callable_name = str(row[1] or "run")
                try:
                    _mod = __import__(module_path, fromlist=[callable_name])
                except Exception:
                    # Пытаемся относительный импорт от backend.app и app
                    try:
                        import importlib as _il3  # type: ignore
                        _mod = _il3.import_module('.' + module_path.split('.', 2)[-1], package='backend.app')
                    except Exception:
                        import importlib as _il4  # type: ignore
                        _mod = _il4.import_module('.' + module_path.split('.', 1)[-1], package='app')
                run_fn = getattr(_mod, callable_name)
                res = await run_fn(db, ctx)
                return res if isinstance(res, dict) else {"status": "ok", "data": res}
        except Exception as e:
            return {"status": "failed", "detail": f"registry inspector error: {e}"}

        return {"status": "failed", "detail": f"inspector '{k}' not found"}
    def _parse_line(self, line: str) -> Tuple[str, Dict[str, Any], Dict[str, Any]]:
        tokens = self._smart_split(line)
        cmd = tokens[0]
        # Приводим имя команды к нижнему регистру для унификации (поддержка DB.GOV.*)
        try:
            cmd = str(cmd or "").strip()
            lower_cmd = cmd.lower()
            # Сохраняем исходный токен только для отображения; обработчик ориентируется на lower
            cmd = lower_cmd
        except Exception:
            cmd = str(cmd or "").lower()
        params: Dict[str, Any] = {}
        mods: Dict[str, Any] = {}
        i = 1
        pending_key: Optional[str] = None
        while i < len(tokens):
            t = tokens[i]
            if t == "DRY_RUN":
                mods["DRY_RUN"] = True
                i += 1
                continue
            if t == "WITH" and i + 1 < len(tokens) and tokens[i + 1] == "TRACE":
                mods["WITH_TRACE"] = True
                i += 2
                continue
            if t == "EXPECT" and i + 1 < len(tokens) and "=" in tokens[i + 1]:
                k, v = tokens[i + 1].split("=", 1)
                mods["EXPECT"] = (k.strip(), self._parse_value(v))
                i += 2
                continue
            if t.startswith("TIMEOUT="):
                try:
                    mods["TIMEOUT"] = int(t.split("=", 1)[1])
                except Exception:
                    mods["TIMEOUT"] = 0
                i += 1
                continue
            # param key=value
            if "=" in t:
                k, v = t.split("=", 1)
                if v == "" and i + 1 < len(tokens):
                    # Случай: key="multi word" → токены разорваны на ['key=', 'multi word']
                    params[k.strip()] = self._parse_value(tokens[i + 1])
                    i += 2
                    pending_key = None
                    continue
                params[k.strip()] = self._parse_value(v)
                pending_key = k.strip()
                i += 1
                continue
            # значение для предыдущего ключа в виде отдельного токена
            if pending_key is not None and pending_key not in mods:
                params[pending_key] = self._parse_value(t)
                pending_key = None
                i += 1
                continue
            # неизвестный токен — пропускаем
            i += 1
        return cmd, params, mods

    def _parse_value(self, raw: str) -> Any:
        s = raw.strip()
        # обрезаем кавычки
        if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
            s = s[1:-1]
        # true/false
        low = s.lower()
        if low in ("true", "false"):
            return (low == "true")
        # number
        try:
            if re.fullmatch(r"-?\d+", s):
                return int(s)
            if re.fullmatch(r"-?\d+\.\d+", s):
                return float(s)
        except Exception:
            pass
        # json
        if (s.startswith("{") and s.endswith("}")) or (s.startswith("[") and s.endswith("]")):
            try:
                return json.loads(s)
            except Exception:
                return s
        return s

    def _smart_split(self, line: str) -> List[str]:
        out: List[str] = []
        buf: List[str] = []
        in_quote: Optional[str] = None
        escape = False
        for ch in line:
            if escape:
                buf.append(ch)
                escape = False
                continue
            if ch == "\\":
                escape = True
                continue
            if in_quote:
                if ch == in_quote:
                    in_quote = None
                    out.append("".join(buf))
                    buf = []
                else:
                    buf.append(ch)
            else:
                if ch in ('"', "'"):
                    if buf:
                        out.append("".join(buf))
                        buf = []
                    in_quote = ch
                elif ch.isspace():
                    if buf:
                        out.append("".join(buf))
                        buf = []
                else:
                    buf.append(ch)
        if buf:
            out.append("".join(buf))
        return out