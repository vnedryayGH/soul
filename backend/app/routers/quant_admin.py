from __future__ import annotations

from typing import Any, Dict, Optional
import time

from fastapi import APIRouter, Depends, HTTPException, Body

try:
    from ..services.takt_engine import get_takt_engine  # type: ignore
except Exception:  # pragma: no cover
    get_takt_engine = None  # type: ignore

try:
    from ..services.quant_generation_service import get_quant_generation_service  # type: ignore
except Exception:  # pragma: no cover
    get_quant_generation_service = None  # type: ignore

try:
    from ..db import get_db_session as get_db  # type: ignore
except Exception:  # pragma: no cover
    async def get_db():  # type: ignore
        raise RuntimeError("DB unavailable")

try:
    from ..middleware.rbac_middleware import require_permission  # type: ignore
except Exception:  # pragma: no cover
    def require_permission(_: str):  # type: ignore
        async def ok():
            return True
        return ok


router = APIRouter(prefix="/api/admin/quant", tags=["Quant Admin"], dependencies=[Depends(require_permission("soul.architect"))])


@router.post("/run_once")
async def run_once(
    body: Dict[str, Any] = Body(default_factory=dict),
    db=Depends(get_db),
):
    goal_text = str(body.get("goal_text") or "Smoke quant generation")
    mode = str(body.get("mode") or "new").lower()
    force_fallback = bool(body.get("force_fallback") is True)

    # Попытка основного пути через TaktEngine
    if (not force_fallback) and (get_takt_engine is not None):
        try:
            t0 = time.perf_counter()
            engine = get_takt_engine()
            result = await engine.tick(db=db, goal_text=goal_text)
            latency_ms = (time.perf_counter() - t0) * 1000.0
            try:
                from ..lib.observability.metrics import observe, incr  # type: ignore
                observe("takt_cycle_latency_ms", latency_ms, {"path": "engine", "mode": mode})
                incr("quant_admin_runs_total", {"path": "engine", "mode": mode, "status": "ok"})
            except Exception:
                pass
            return {
                "ok": True,
                "path": "engine",
                "mode": mode,
                "goal_text": goal_text,
                "trace_id": result.get("trace_id"),
                "summary": result.get("summary"),
                "steps": result.get("steps"),
            }
        except Exception:
            # Падение движка — используем fallback
            pass

    # Fallback: прямой запуск через QuantGenerationService
    if get_quant_generation_service is None:
        raise HTTPException(status_code=500, detail="fallback unavailable: quant generation service not found")

    qsvc = get_quant_generation_service()
    topic = str(body.get("topic") or "General")
    context = str(body.get("context") or "Auto smoke context")
    add = body.get("additional_constraints")
    provided_quant = body.get("quant")

    t0 = time.perf_counter()
    try:
        # Режимы: new, validate, refine, all
        if mode == "validate":
            quant = provided_quant
            if not isinstance(quant, dict):
                quant = await qsvc.generate_quant(topic=topic, context=context, goal=goal_text, additional_constraints=add, db=db)
            validation = await qsvc.validate_quant(quant=quant)
            latency_ms = (time.perf_counter() - t0) * 1000.0
            try:
                from ..lib.observability.metrics import observe, incr  # type: ignore
                observe("quant_admin_run_once_latency_ms", latency_ms, {"path": "fallback", "mode": mode})
                incr("quant_admin_runs_total", {"path": "fallback", "mode": mode, "status": "ok"})
            except Exception:
                pass
            return {"ok": True, "path": "fallback", "mode": mode, "goal_text": goal_text, "validation": validation}

        # generate → validate (доп. refine/link в режимах ниже)
        quant = await qsvc.generate_quant(topic=topic, context=context, goal=goal_text, additional_constraints=add, db=db)
        validation = await qsvc.validate_quant(quant=quant)
        if not bool(validation.get("valid")):
            # Попробуем один быстрый refine и повторную локальную валидацию
            try:
                refined = await qsvc.refine_quant(quant=quant, project_context=context, goal_context=goal_text, skill_context="")
                quant = refined
                validation = await qsvc.validate_quant(quant=quant)
            except Exception:
                pass
        if mode == "refine":
            latency_ms = (time.perf_counter() - t0) * 1000.0
            try:
                from ..lib.observability.metrics import observe, incr  # type: ignore
                observe("quant_admin_run_once_latency_ms", latency_ms, {"path": "fallback", "mode": mode})
                incr("quant_admin_runs_total", {"path": "fallback", "mode": mode, "status": "ok"})
            except Exception:
                pass
            return {"ok": True, "path": "fallback", "mode": mode, "goal_text": goal_text, "validation": validation, "quant": quant}

        # Для режимов new/all — продолжаем до persist
        if not bool(validation.get("valid")):
            raise HTTPException(status_code=400, detail=f"quant validation failed: {validation.get('errors')}")

        if mode == "all":
            try:
                # Сгенерировать связи (мок) — не критично для сохранения
                _links = await qsvc.generate_links(quant=quant, entities_context=context)
            except Exception:
                _links = []

        quant_id = await qsvc.create_quant_in_db(db=db, quant=quant)
        latency_ms = (time.perf_counter() - t0) * 1000.0
        try:
            from ..lib.observability.metrics import observe, incr  # type: ignore
            observe("quant_admin_run_once_latency_ms", latency_ms, {"path": "fallback", "mode": mode})
            incr("quant_admin_runs_total", {"path": "fallback", "mode": mode, "status": "ok"})
        except Exception:
            pass
        return {
            "ok": True,
            "path": "fallback",
            "mode": mode,
            "goal_text": goal_text,
            "quant_id": str(quant_id),
            "validation": validation,
        }
    except HTTPException:
        # Уже корректно сформированный ответ
        raise
    except Exception as e:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        try:
            from ..lib.observability.metrics import observe, incr  # type: ignore
            observe("quant_admin_run_once_latency_ms", latency_ms, {"path": "fallback", "mode": mode})
            incr("quant_admin_runs_total", {"path": "fallback", "mode": mode, "status": "error"})
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"fallback failed: {e}")


