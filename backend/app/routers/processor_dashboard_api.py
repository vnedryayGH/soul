from __future__ import annotations

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import logging
from collections import defaultdict
from datetime import datetime, timedelta

from ..db import get_db_session
from ..middleware.rbac_middleware import require_permission
from ..models import User, ProcessorIncident
from ..services.soul_settings_service import SoulSettingsService
from ..lib.observability.metrics import get_percentile, get_percentile_by_tag

router = APIRouter(prefix="/api/admin/soul/processor", tags=["processor-dashboard"])
# Алиас‑роутер под фиксированный префикс diagnostics для внешнего контура/совместимости
alias_router = APIRouter(prefix="/api/admin/soul/processor/diagnostics", tags=["processor-diagnostics-alias"])
_log = logging.getLogger(__name__)

# In-memory storage for p95 calculations (for simplicity, in a real app use Prometheus/Grafana)
_stage_latencies: Dict[str, List[float]] = defaultdict(list)
_latency_retention_minutes = 10 # Keep last 10 minutes of data

# NOTE: metrics now use centralized helpers; keep local structures minimal

def _calculate_avg_guard_pass(db_vals: List[float]) -> Optional[float]:
    if not db_vals:
        return None
    try:
        return sum(db_vals) / len(db_vals)
    except Exception:
        return None

@router.get("/metrics")
async def get_processor_metrics(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        # Queue status and gauge
        queue_counts = {}
        queue_len = 0
        try:
            res = (await db.execute(text("select status, count(*) from processor_events group by status"))).fetchall()
            queue_counts = {row[0]: row[1] for row in res}
            qrow = (await db.execute(text("select count(*) from processor_events where status in ('pending','scheduled')"))).fetchone()
            queue_len = int(qrow[0] if qrow and qrow[0] is not None else 0)
        except Exception:
            pass

        # Incidents (recent) + incidents_rate per minute (last 10 min)
        incidents = []
        incidents_rate = 0.0
        try:
            res = (await db.execute(text("select id::text, type, detail, created_at from processor_incidents order by created_at desc limit 10"))).mappings().all()
            incidents = [dict(r) for r in res]
            since = datetime.utcnow() - timedelta(minutes=10)
            cnt = (await db.execute(text("select count(*) from processor_incidents where created_at >= :ts"), {"ts": since})).fetchone()
            n = int(cnt[0] if cnt and cnt[0] is not None else 0)
            incidents_rate = n / 10.0
        except Exception:
            pass
        
        # Settings
        settings_service = SoulSettingsService()
        processor_enabled = await settings_service.get_setting("processor.enabled", db, False)
        poll_interval_sec = await settings_service.get_setting("processor.poll_interval_sec", db, 5)
        batch_max_events = await settings_service.get_setting("processor.batch_max_events", db, 5)
        processor_profile = await settings_service.get_setting("processor.profile", db, "prod_safe")
        delivery_guard_enforce = await settings_service.get_setting("delivery_guard.enforce", db, False)

        # Throughput (events/sec) over a sliding window (DB-based)
        throughput_eps = None
        processed_delta_5m = None
        try:
            window_sec = int(await settings_service.get_setting("processor.throughput.window_sec", db, 60))
        except Exception:
            window_sec = 60
        try:
            thr_row = (
                await db.execute(
                    text(
                        """
                        select count(*)
                          from processor_events
                         where created_at >= now() - make_interval(secs := :sec)
                           and status in ('processed','skipped')
                        """
                    ),
                    {"sec": max(5, min(int(window_sec or 60), 600))},
                )
            ).fetchone()
            thr_cnt = int(thr_row[0] if thr_row and thr_row[0] is not None else 0)
            throughput_eps = float(thr_cnt) / float(max(1, int(window_sec or 60)))
            # processed delta (5m)
            row5 = (await db.execute(text("select count(*) from processor_events where created_at >= now() - make_interval(mins := 5) and status='processed'"))).fetchone()
            processed_delta_5m = int(row5[0] if row5 and row5[0] is not None else 0)
        except Exception:
            throughput_eps = None
            processed_delta_5m = None

        # Percentiles from centralized metrics store (P21)
        p95_latencies = {
            "perceive_ms": get_percentile_by_tag("processor.stage_ms", "stage", "perceive", 95.0),
            "decide_ms": get_percentile_by_tag("processor.stage_ms", "stage", "decide", 95.0),
            "act_ms": get_percentile_by_tag("processor.stage_ms", "stage", "act", 95.0),
            "observe_ms": get_percentile_by_tag("processor.stage_ms", "stage", "observe", 95.0),
        }
        e2e_p95 = get_percentile("processor.time_send_to_recv_ms", None, 95.0)
        guard_pass_p95 = get_percentile("processor.guard_chain_pass_rate", None, 95.0)
        coverage_p95 = get_percentile("processor.coverage_signature_percent", None, 95.0)

        # Per-kind limits/quarantine snapshot (fast path for top kinds)
        kinds_limits: Dict[str, Dict[str, Optional[float]]] = {}
        try:
            kinds_to_show = [
                "reminder",
                "chat_message",
                "auto.link_quants",
            ]
            for k in kinds_to_show:
                try:
                    kinds_limits[k] = {
                        "rps": await settings_service.get_setting(f"processor.kind_limits.{k}.rps", db, None),
                        "max_concurrency": await settings_service.get_setting(f"processor.kind_limits.{k}.max_concurrency", db, None),
                        "timeout_ms": await settings_service.get_setting(f"processor.kind_limits.{k}.timeout_ms", db, None),
                        "quarantine": await settings_service.get_setting(f"processor.kind_quarantine.{k}", db, None),
                    }
                except Exception:
                    kinds_limits[k] = {"rps": None, "max_concurrency": None, "timeout_ms": None, "quarantine": None}
        except Exception:
            kinds_limits = {}

        # Seeker (P27): проверка обязательных svc.processor.* в окне 24h
        seeker_report = {}
        try:
            need = ["svc.processor.perceive","svc.processor.decide","svc.processor.act","svc.processor.observe"]
            placeholders = ",".join([f":s{i}" for i in range(len(need))])
            params = {f"s{i}": s for i, s in enumerate(need)}
            params["hours"] = 24
            q = text(f"""
                select function_id, count(*) as cnt
                from signature_steps
                where ts >= now() - make_interval(hours => :hours)
                  and function_id in ({placeholders})
                group by function_id
            """)
            rows = (await db.execute(q, params)).fetchall()
            present = {str(r[0]): int(r[1]) for r in rows}
            missing = [s for s in need if s not in present]
            seeker_report = {"present": present, "missing": missing, "window_hours": 24}
        except Exception:
            seeker_report = {"error": "seeker_failed"}

        # Alerts
        alerts: List[str] = []
        try:
            q_thr = await settings_service.get_setting("processor.alert.queue_len_threshold", db, 50)
            g_min = await settings_service.get_setting("processor.alert.guard_pass_min", db, 0.95)
            ir_max = await settings_service.get_setting("processor.alert.incidents_rate_max", db, 5.0)
            e2e_max = await settings_service.get_setting("processor.alert.e2e_p95_ms_max", db, 2000)
            cov_min = await settings_service.get_setting("processor.alert.coverage_min", db, 80.0)
            if queue_len > int(q_thr):
                alerts.append(f"Queue len high: {queue_len}>{q_thr}")
            if (guard_pass_p95 or 0) < float(g_min):
                alerts.append(f"Guard pass low: {guard_pass_p95}<{g_min}")
            if incidents_rate > float(ir_max):
                alerts.append(f"Incidents rate high: {incidents_rate}>{ir_max}")
            if (e2e_p95 or 0) > int(e2e_max):
                alerts.append(f"E2E p95 high: {e2e_p95}>{e2e_max}")
            if (coverage_p95 or 0) < float(cov_min):
                alerts.append(f"Coverage low: {coverage_p95}<{cov_min}")
        except Exception:
            pass

        # Per-node contribution (best-effort)
        per_node = []
        try:
            col = await db.execute(text("""
                SELECT COUNT(1) FROM information_schema.columns
                 WHERE table_schema='public' AND table_name='processor_events' AND column_name='worker_id'
            """))
            if (col.scalar() or 0) > 0:
                rows = (
                    await db.execute(text(
                        """
                        select coalesce(worker_id,'') as worker_id,
                               sum(case when status='processed' then 1 else 0 end) as processed,
                               sum(case when status='skipped' then 1 else 0 end) as skipped,
                               count(*) as total
                          from processor_events
                         where created_at >= now() - make_interval(mins := 60)
                         group by coalesce(worker_id,'')
                         order by total desc
                        """
                    ))
                ).mappings().all()
                per_node = [dict(r) for r in rows]
        except Exception:
            per_node = []

        return {
            "queue": {
                "pending": queue_counts.get("pending", 0),
                "dispatched": queue_counts.get("dispatched", 0),
                "processed": queue_counts.get("processed", 0),
                "skipped": queue_counts.get("skipped", 0),
                "queue_len": queue_len,
            },
            "throughput_eps": throughput_eps,
            "processed_delta_5m": processed_delta_5m,
            "incidents": incidents,
            "incidents_rate_per_min": incidents_rate,
            "alerts": alerts,
            "settings": {
                "processor.enabled": processor_enabled,
                "processor.poll_interval_sec": poll_interval_sec,
                "processor.batch_max_events": batch_max_events,
                "processor.profile": processor_profile,
                "delivery_guard.enforce": delivery_guard_enforce,
            },
            "kinds_limits": kinds_limits,
            "p95": { **p95_latencies, "e2e_ms": e2e_p95, "guard_pass": guard_pass_p95, "coverage": coverage_p95 },
            "seeker": seeker_report,
            "per_node": per_node,
        }
    except Exception as e:
        _log.error(f"Error fetching processor metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/diagnostics/queue_indexes")
async def get_queue_indexes(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Возвращает список индексов таблицы processor_events (имя+DDL)."""
    try:
        rows = (
            await db.execute(
                text(
                    """
                    select indexname, indexdef
                      from pg_indexes
                     where schemaname='public' and tablename='processor_events'
                     order by indexname
                    """
                )
            )
        ).fetchall()
        out = [
            {"indexname": str(r[0]), "indexdef": str(r[1])}
            for r in (rows or [])
        ]
        return {"items": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/diagnostics/queue_explain")
async def get_queue_explain(
    limit: int = 50,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """EXPLAIN (FORMAT JSON) выборки очереди (без UPDATE), для проверки использования индексов.

    Запрос соответствует read-части планировщика: pending или scheduled (due_at <= now()),
    сортировка по priority desc, due_at.
    """
    try:
        limit = max(1, min(int(limit or 50), 500))
        plan_row = (
            await db.execute(
                text(
                    """
                    EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
                    SELECT id, kind, payload, priority, due_at
                      FROM processor_events
                     WHERE (status = 'pending'
                            OR (status = 'scheduled' AND due_at <= now()))
                     ORDER BY priority DESC NULLS LAST, due_at NULLS LAST
                     LIMIT :lim
                    """
                ),
                {"lim": limit},
            )
        ).fetchone()
        plan_json = plan_row[0] if plan_row else None
        plan = plan_json[0] if isinstance(plan_json, list) and plan_json else plan_json
        plan_str = str(plan)
        uses_composite = ("idx_processor_events_dispatcher_composite" in plan_str)
        uses_status_created = ("idx_processor_events_status_created_at" in plan_str)
        uses_kind_status = ("idx_processor_events_kind_status" in plan_str)
        uses_dedup = ("idx_processor_events_dedup_key" in plan_str)
        return {
            "uses": {
                "dispatcher_composite": uses_composite,
                "status_created_at": uses_status_created,
                "kind_status": uses_kind_status,
                "dedup_key": uses_dedup,
            },
            "plan": plan,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/diagnostics/analyze")
async def analyze_processor_events(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """ANALYZE таблицы processor_events (актуализация статистики планировщика)."""
    try:
        await db.execute(text("ANALYZE public.processor_events"))
        await db.commit()
        return {"ok": True}
    except Exception as e:
        try:
            await db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/diagnostics/slices")
async def get_diagnostics_slices(
    limit: int = 50,
    min_attempts: int = 3,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Диагностические срезы очереди и петель обработчика.

    Возвращает:
    - counts по (status, kind)
    - распределение due_at (min/median/max) по видам в pending/scheduled
    - top-N событий по attempts с последней ошибкой/инцидентом
    """
    try:
        # 1) Коробка по статусам/видам
        cnt_rows = (
            await db.execute(
                text(
                    """
                    select status, kind, count(*) as cnt
                      from processor_events
                     group by status, kind
                     order by status, cnt desc
                    """
                )
            )
        ).mappings().all()
        counts = [dict(r) for r in cnt_rows]

        # 2) due_at срезы: min/median/max для pending/scheduled
        due_rows = (
            await db.execute(
                text(
                    """
                    with base as (
                        select kind, due_at
                          from processor_events
                         where status in ('pending','scheduled') and due_at is not null
                    )
                    select kind,
                           min(due_at) as due_min,
                           percentile_disc(0.5) within group (order by due_at) as due_median,
                           max(due_at) as due_max
                      from base
                     group by kind
                     order by due_median nulls last
                    """
                )
            )
        ).mappings().all()
        due_stats = [
            {
                "kind": r["kind"],
                "due_min": r["due_min"],
                "due_median": r["due_median"],
                "due_max": r["due_max"],
            }
            for r in due_rows
        ]

        # 3) top-N попыток с последней ошибкой/инцидентом
        limit = max(1, min(int(limit or 50), 200))
        min_attempts = max(0, int(min_attempts or 0))
        attempts_rows = (
            await db.execute(
                text(
                    """
                    with last_inc as (
                        select p.event_id as eid,
                               max(p.created_at) as last_at
                          from processor_incidents p
                         group by p.event_id
                    ),
                    inc as (
                        select p.event_id as eid,
                               p.type,
                               p.detail,
                               p.created_at
                          from processor_incidents p
                          join last_inc li on li.eid = p.event_id and li.last_at = p.created_at
                    )
                    select e.id::text as id,
                           e.kind,
                           e.status,
                           e.attempts,
                           e.due_at,
                           coalesce(i.type,'') as last_incident_type,
                           coalesce(i.detail,'') as last_incident_detail,
                           i.created_at as last_incident_at
                      from processor_events e
                      left join inc i on i.eid = e.id
                     where e.attempts >= :min_attempts
                     order by e.attempts desc, e.updated_at desc
                     limit :lim
                    """
                ),
                {"lim": limit, "min_attempts": min_attempts},
            )
        ).mappings().all()
        top_attempts = [dict(r) for r in attempts_rows]

        return {
            "counts": counts,
            "due_at": due_stats,
            "top_attempts": top_attempts,
        }
    except Exception as e:
        _log.error(f"diagnostics slices error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# === Diagnostics alias endpoints under /api/admin/soul/processor/diagnostics ===

@alias_router.get("/queue_indexes")
async def alias_queue_indexes(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        rows = (
            await db.execute(
                text(
                    """
                    select indexname, indexdef
                      from pg_indexes
                     where schemaname='public' and tablename='processor_events'
                     order by indexname
                    """
                )
            )
        ).fetchall()
        out = [
            {"indexname": str(r[0]), "indexdef": str(r[1])}
            for r in (rows or [])
        ]
        return {"items": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@alias_router.get("/queue_explain")
async def alias_queue_explain(
    limit: int = 50,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        limit = max(1, min(int(limit or 50), 500))
        plan_row = (
            await db.execute(
                text(
                    """
                    EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
                    SELECT id, kind, payload, priority, due_at
                      FROM processor_events
                     WHERE (status = 'pending'
                            OR (status = 'scheduled' AND due_at <= now()))
                     ORDER BY priority DESC NULLS LAST, due_at NULLS LAST
                     LIMIT :lim
                    """
                ),
                {"lim": limit},
            )
        ).fetchone()
        plan_json = plan_row[0] if plan_row else None
        plan = plan_json[0] if isinstance(plan_json, list) and plan_json else plan_json
        plan_str = str(plan)
        uses_composite = ("idx_processor_events_dispatcher_composite" in plan_str)
        uses_status_created = ("idx_processor_events_status_created_at" in plan_str)
        uses_kind_status = ("idx_processor_events_kind_status" in plan_str)
        uses_dedup = ("idx_processor_events_dedup_key" in plan_str)
        return {
            "uses": {
                "dispatcher_composite": uses_composite,
                "status_created_at": uses_status_created,
                "kind_status": uses_kind_status,
                "dedup_key": uses_dedup,
            },
            "plan": plan,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@alias_router.post("/analyze")
async def alias_analyze(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        await db.execute(text("ANALYZE public.processor_events"))
        await db.commit()
        return {"ok": True}
    except Exception as e:
        try:
            await db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))


@alias_router.get("/slices")
async def alias_slices(
    limit: int = 50,
    min_attempts: int = 3,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        # counts by (status, kind)
        cnt_rows = (
            await db.execute(
                text(
                    """
                    select status, kind, count(*) as cnt
                      from processor_events
                     group by status, kind
                     order by status, cnt desc
                    """
                )
            )
        ).mappings().all()
        counts = [dict(r) for r in cnt_rows]

        # due_at slices for pending/scheduled
        due_rows = (
            await db.execute(
                text(
                    """
                    with base as (
                        select kind, due_at
                          from processor_events
                         where status in ('pending','scheduled') and due_at is not null
                    )
                    select kind,
                           min(due_at) as due_min,
                           percentile_disc(0.5) within group (order by due_at) as due_median,
                           max(due_at) as due_max
                      from base
                     group by kind
                     order by due_median nulls last
                    """
                )
            )
        ).mappings().all()
        due_stats = [
            {
                "kind": r["kind"],
                "due_min": r["due_min"],
                "due_median": r["due_median"],
                "due_max": r["due_max"],
            }
            for r in due_rows
        ]

        # top attempts with last incident
        limit = max(1, min(int(limit or 50), 200))
        min_attempts = max(0, int(min_attempts or 0))
        attempts_rows = (
            await db.execute(
                text(
                    """
                    with last_inc as (
                        select p.event_id as eid,
                               max(p.created_at) as last_at
                          from processor_incidents p
                         group by p.event_id
                    ),
                    inc as (
                        select p.event_id as eid,
                               p.type,
                               p.detail,
                               p.created_at
                          from processor_incidents p
                          join last_inc li on li.eid = p.event_id and li.last_at = p.created_at
                    )
                    select e.id::text as id,
                           e.kind,
                           e.status,
                           e.attempts,
                           e.due_at,
                           coalesce(i.type,'') as last_incident_type,
                           coalesce(i.detail,'') as last_incident_detail,
                           i.created_at as last_incident_at
                      from processor_events e
                      left join inc i on i.eid = e.id
                     where e.attempts >= :min_attempts
                     order by e.attempts desc, e.updated_at desc
                     limit :lim
                    """
                ),
                {"lim": limit, "min_attempts": min_attempts},
            )
        ).mappings().all()
        top_attempts = [dict(r) for r in attempts_rows]

        return {
            "counts": counts,
            "due_at": due_stats,
            "top_attempts": top_attempts,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Fallback ETA endpoint (in case primary admin endpoint is unavailable)
@router.get("/emergency/eta")
async def emergency_eta_fallback(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        ssvc = SoulSettingsService()
        row = (await db.execute(text("select count(*) from processor_events where status in ('pending','scheduled')"))).fetchone()
        queue = int(row[0] if row and row[0] is not None else 0)
        maxc = int(await ssvc.get_setting("emergency.queue_drain.max_concurrency", db, 24))
        tmo_ms = int(await ssvc.get_setting("emergency.queue_drain.timeout_ms", db, 6000))
        eff_c = max(1, maxc)
        per_event_sec = max(0.001, tmo_ms / 1000.0)
        import math
        eta_sec = int(math.ceil(queue / float(eff_c)) * per_event_sec)
        return {
            "ok": True,
            "queue": queue,
            "effective_concurrency": eff_c,
            "per_event_sec": per_event_sec,
            "eta_sec": eta_sec,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Workers status (best-effort; DB snapshot)
@router.get("/workers/status")
async def get_workers_status(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        # Проверка наличия колонки worker_id (накатывается миграциями, но поддержим fallback)
        col_exists = False
        try:
            q_col = text(
                """
                select 1
                  from information_schema.columns
                 where table_schema='public' and table_name='processor_events' and column_name='worker_id'
                limit 1
                """
            )
            col_exists = (await db.execute(q_col)).first() is not None
        except Exception:
            col_exists = False

        if col_exists:
            q = text(
                """
                select coalesce(worker_id,'') as worker_id,
                       count(*) filter (where status in ('pending','scheduled')) as queued,
                       count(*) filter (where status='dispatched') as in_flight,
                       count(*) filter (where status='processed') as done,
                       count(*) filter (where status='dead') as dead
                  from processor_events
                 group by worker_id
                 order by worker_id
                """
            )
        else:
            # Fallback: агрегируем общие счётчики, worker_id пустой
            q = text(
                """
                select '' as worker_id,
                       count(*) filter (where status in ('pending','scheduled')) as queued,
                       count(*) filter (where status='dispatched') as in_flight,
                       count(*) filter (where status='processed') as done,
                       count(*) filter (where status='dead') as dead
                  from processor_events
                """
            )

        rows = (await db.execute(q)).mappings().all()
        return {"items": [dict(r) for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Bulk upsert limits (processor.kind_limits.* and related)
@router.post("/limits/set")
async def bulk_set_limits(
    payload: Dict[str, Any] = Body(..., description="key→value map for processor.kind_limits.*, processor.kind_priority.*, processor.kind_quarantine.*"),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        svc = SoulSettingsService()
        updated: Dict[str, Any] = {}
        for k, v in (payload or {}).items():
            if not isinstance(k, str):
                continue
            if not (k.startswith("processor.kind_limits.") or k.startswith("processor.kind_priority.") or k.startswith("processor.kind_quarantine.")):
                continue
            ok = await svc.set_setting(k, v, db)
            if ok:
                updated[k] = v
        return {"updated": updated, "count": len(updated)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Quarantine control per-kind
@router.post("/quarantine/set")
async def set_quarantine(
    payload: Dict[str, Any] = Body(..., description="{ kind: bool | {kind: bool, ...} }"),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        svc = SoulSettingsService()
        updated: Dict[str, Any] = {}
        if not isinstance(payload, dict):
            raise HTTPException(status_code=400, detail="body must be an object")
        for k, v in payload.items():
            key = f"processor.kind_quarantine.{k}"
            ok = await svc.set_setting(key, bool(v), db)
            if ok:
                updated[key] = bool(v)
        return {"updated": updated, "count": len(updated)}
    except HTTPException:
        raise
    except Exception as e:
        _log.error(f"Error setting quarantine: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Dead-letter queue (DLQ) operations
@router.post("/dlq/requeue")
async def dlq_requeue(
    event_ids: List[str] = Body(..., embed=True, description="List of processor_events.id (uuid) to requeue"),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        if not event_ids:
            return {"updated": 0}
        q = text(
            """
            update processor_events
               set status='scheduled', next_retry_at=now(), attempts=0
             where id = ANY(:ids::uuid[])
               and status='dead'
            """
        )
        res = await db.execute(q, {"ids": event_ids})
        return {"updated": res.rowcount or 0}
    except Exception as e:
        _log.error(f"Error requeuing DLQ: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dlq/move")
async def dlq_move(
    event_ids: List[str] = Body(..., embed=True, description="List of processor_events.id (uuid) to mark as dead"),
    reason: Optional[str] = Body(None, embed=True),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Пометить события как dead (DLQ)."""
    try:
        if not event_ids:
            return {"updated": 0}
        q = text(
            """
            update processor_events
               set status='dead', next_retry_at=null
             where id = ANY(:ids::uuid[])
               and status in ('pending','scheduled','dispatched')
            """
        )
        res = await db.execute(q, {"ids": event_ids})
        # optional incident log
        try:
            if res.rowcount:
                await db.execute(text("insert into processor_incidents(run_id, event_id, type, detail) select NULL, cast(:eid as uuid), 'moved_to_dead', :d"), {"eid": event_ids[0], "d": (reason or "")[:400]})
        except Exception:
            pass
        return {"updated": res.rowcount or 0}
    except Exception as e:
        _log.error(f"Error moving to DLQ: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dlq/list")
async def dlq_list(
    limit: int = 100,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        limit = max(1, min(int(limit or 100), 1000))
        rows = (
            await db.execute(
                text(
                    """
                    select id::text, kind, coalesce(due_at, created_at) as ts
                      from processor_events
                     where status='dead'
                     order by coalesce(due_at, created_at) desc
                     limit :lim
                    """
                ),
                {"lim": limit},
            )
        ).mappings().all()
        return {"items": [dict(r) for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Top emitters (who generates the most events) within a time window
@router.get("/top")
async def get_top_emitters(
    minutes: int = 60,
    limit: int = 10,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        minutes = max(1, min(int(minutes or 60), 24 * 60))
        limit = max(1, min(int(limit or 10), 100))
        top_kinds: List[Dict[str, Any]] = []
        top_bot_keys: List[Dict[str, Any]] = []
        top_message_types: List[Dict[str, Any]] = []
        # Kind meta (static descriptors; can be moved to DB keys later if needed)
        KIND_META: Dict[str, Dict[str, Any]] = {
            "reminder": {
                "who": "Планировщик/сервис напоминаний",
                "purpose": "Отправка due‑напоминания пользователю",
                "algorithm": "Читает reminder_id → проверяет в БД → актор отправки → mark sent",
                "frequency": "По due_at, волнами при накоплении",
                "keys_limits": [
                    "processor.kind_quarantine.reminder",
                    "processor.kind_limits.reminder.{rps,max_concurrency,timeout_ms,p95_budget_ms,err_rate_max}",
                ],
                "incidents_metrics": ["reminder_missing", "reminder_sent", "reminder_error"],
            },
            "chat_message": {
                "who": "Вебхук/мини‑апп (входящее сообщение)",
                "purpose": "Провести текст через ядро и сгенерировать кванты/ответ",
                "algorithm": "Берёт payload.text → SoulCoreManager.generate_quants → P27 сигнатуры",
                "frequency": "По пользовательскому трафику",
                "keys_limits": ["processor.kind_limits.chat_message.*"],
                "incidents_metrics": ["processor.errors{where=act|dispatch}"]
            },
            "auto.link_quants": {
                "who": "Планировщик/смоки",
                "purpose": "Связать свежий квант с проектом без создания проектов",
                "algorithm": "qid через QA → pid из настройки/последний → подстрока/Жаккар → dedup → QUANT.LINK.AUTO",
                "frequency": "Каждые processor.auto_link.period_sec или вручную",
                "keys_limits": [
                    "processor.auto_link_enabled",
                    "processor.auto_link.period_sec",
                    "auto_link.match.jaccard_min",
                    "auto_link.match.title_substring",
                    "auto_link.project_id",
                    "processor.kind_quarantine.auto.link_quants",
                    "processor.kind_limits.auto.link_quants.*",
                ],
                "incidents_metrics": [
                    "auto_link_no_project",
                    "auto_link_semantic_skip",
                    "auto_link_dedup_skipped",
                    "auto_link_decisions_total{reason=*}"
                ],
            },
            "lima.sync": {
                "who": "Планировщик",
                "purpose": "Health/синхронизация LLM/ретривера",
                "algorithm": "Плановый тик → health → записи метрик/рестарт aux при сбое",
                "frequency": "lima.sync.period_sec",
                "keys_limits": ["processor.kind_limits.lima.sync.*"],
                "incidents_metrics": ["phi_health_failed", "phi_remediation_restart", "llm_aux_err_total"],
            },
            "neuro_integrity.run": {
                "who": "Планировщик/вручную",
                "purpose": "Проверка нейроцелостности графа",
                "algorithm": "Запуск плагина → агрегат в инцидент",
                "frequency": "По расписанию",
                "keys_limits": ["processor.kind_limits.neuro_integrity.run.*"],
                "incidents_metrics": ["neuro_integrity_result"],
            },
            "soul.dream.rewire": {
                "who": "Ночной процесс",
                "purpose": "Нормализация весов связей (ε‑дрейф)",
                "algorithm": "Выбор последних рёбер → ±ε к весу с ограничениями",
                "frequency": "Ночные окна",
                "keys_limits": ["sleep.rewire.epsilon", "sleep.rewire.radius", "sleep.rewire.max_edges"],
                "incidents_metrics": ["sleep_rewire_ratio", "dream_rewire_done"],
            },
            "soul.diamond.trigger": {
                "who": "Бизнес‑сценарий/вручную",
                "purpose": "Резонанс → вопрос → опц. бриллиантовый квант",
                "algorithm": "Assess → plan → отправка/квант",
                "frequency": "По сценарию",
                "keys_limits": ["processor.kind_limits.soul.diamond.trigger.*"],
                "incidents_metrics": ["diamond_question_planned", "diamond_quant_emitted|diamond_fallback_used"],
            },
            "auto.dogenerate": {
                "who": "Внешний оркестратор",
                "purpose": "Координация автогенерации",
                "algorithm": "Отметка и re‑enqueue follow‑up",
                "frequency": "По политике оркестратора",
                "keys_limits": ["processor.kind_limits.auto.dogenerate.*"],
                "incidents_metrics": ["auto_dogenerate_trigger"],
            },
            "neurotrain.report": {
                "who": "Планировщик/админ",
                "purpose": "Суточный отчёт обучения",
                "algorithm": "Сбор метрик → отправка → план verify",
                "frequency": "Суточно или вручную",
                "keys_limits": ["processor.kind_limits.neurotrain.report.*"],
                "incidents_metrics": ["neurotrain_report_send_errors_total"],
            },
            "outbound.text": {
                "who": "Сервис доставки",
                "purpose": "Отложенная отправка текста",
                "algorithm": "Формирование payload и канал доставки",
                "frequency": "По бизнес‑потоку",
                "keys_limits": ["processor.kind_limits.outbound.text.*"],
                "incidents_metrics": [],
            },
        }

        try:
            # Top by kind
            rows = (
                await db.execute(
                    text(
                        """
                        select kind, count(*) as cnt
                        from processor_events
                        where created_at >= now() - make_interval(mins := :m)
                        group by kind
                        order by cnt desc
                        limit :l
                        """
                    ),
                    {"m": minutes, "l": limit},
                )
            ).fetchall()
            top_kinds = []
            for r in rows:
                k = str(r[0])
                item = {"kind": k, "count": int(r[1])}
                try:
                    meta = KIND_META.get(k) or {}
                except Exception:
                    meta = {}
                item["meta"] = meta
                top_kinds.append(item)
        except Exception:
            top_kinds = []
        try:
            # Top by bot_key (when present)
            rows = (
                await db.execute(
                    text(
                        """
                        select payload->>'bot_key' as bot_key, count(*) as cnt
                        from processor_events
                        where created_at >= now() - make_interval(mins := :m)
                          and payload ? 'bot_key'
                        group by bot_key
                        order by cnt desc
                        limit :l
                        """
                    ),
                    {"m": minutes, "l": limit},
                )
            ).fetchall()
            top_bot_keys = [
                {"bot_key": (r[0] or ""), "count": int(r[1])}
                for r in rows if (r[0] is not None)
            ]
        except Exception:
            top_bot_keys = []
        try:
            # Top by message_type (when present)
            rows = (
                await db.execute(
                    text(
                        """
                        select payload->>'message_type' as message_type, count(*) as cnt
                        from processor_events
                        where created_at >= now() - make_interval(mins := :m)
                          and payload ? 'message_type'
                        group by message_type
                        order by cnt desc
                        limit :l
                        """
                    ),
                    {"m": minutes, "l": limit},
                )
            ).fetchall()
            top_message_types = [
                {"message_type": (r[0] or ""), "count": int(r[1])}
                for r in rows if (r[0] is not None)
            ]
        except Exception:
            top_message_types = []
        return {
            "window_minutes": minutes,
            "top_kinds": top_kinds,
            "top_bot_keys": top_bot_keys,
            "top_message_types": top_message_types,
        }
    except Exception as e:
        _log.error(f"Error fetching top emitters: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Per-kind stats (counts, error_rate, p95) for tuning processor.kind_limits.*
@router.get("/kind_stats")
async def get_kind_stats(
    minutes: int = 60,
    limit: int = 20,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        minutes = max(1, min(int(minutes or 60), 24 * 60))
        limit = max(1, min(int(limit or 20), 200))
        # Aggregate counts by kind in the window
        rows = (
            await db.execute(
                text(
                    """
                    select kind,
                           sum(case when status='processed' then 1 else 0 end) as processed,
                           sum(case when status='skipped' then 1 else 0 end)    as skipped,
                           count(*) as total
                    from processor_events
                    where created_at >= now() - make_interval(mins := :m)
                    group by kind
                    order by total desc
                    limit :l
                    """
                ),
                {"m": minutes, "l": limit},
            )
        ).fetchall()
        settings_service = SoulSettingsService()
        out: List[Dict[str, Any]] = []
        for r in rows:
            kind = str(r[0])
            processed = int(r[1] or 0)
            skipped = int(r[2] or 0)
            total = int(r[3] or 0)
            denom = max(1, processed + skipped)
            error_rate = float(skipped) / float(denom)
            # p95 from metrics store by tag kind
            try:
                e2e_p95 = get_percentile_by_tag("processor.e2e_ms", "kind", kind, 95.0)
            except Exception:
                e2e_p95 = None
            # Current limits (if present)
            limits = {
                "rps": await settings_service.get_setting(f"processor.kind_limits.{kind}.rps", db, None),
                "max_concurrency": await settings_service.get_setting(f"processor.kind_limits.{kind}.max_concurrency", db, None),
                "timeout_ms": await settings_service.get_setting(f"processor.kind_limits.{kind}.timeout_ms", db, None),
                "p95_budget_ms": await settings_service.get_setting(f"processor.kind_limits.{kind}.p95_budget_ms", db, None),
                "err_rate_max": await settings_service.get_setting(f"processor.kind_limits.{kind}.err_rate_max", db, None),
            }
            quarantine = await settings_service.get_setting(f"processor.kind_quarantine.{kind}", db, None)
            out.append({
                "kind": kind,
                "processed": processed,
                "skipped": skipped,
                "total": total,
                "error_rate": error_rate,
                "e2e_p95_ms": e2e_p95,
                "limits": limits,
                "quarantine": bool(quarantine) if quarantine is not None else None,
            })
        return {"window_minutes": minutes, "items": out}
    except Exception as e:
        _log.error(f"Error fetching kind stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/diag/backlog")
async def get_backlog_diagnostics(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Глобальная диагностика бэклога без ограничений по окну.

    Возвращает:
    - counts_by_status: количество событий по статусам
    - kinds_total: топ видов по общему количеству
    - oldest_by_status: самая старая дата создания по каждому статусу
    - dup_by_dedup_key: примеры ключей с дубликатами
    """
    try:
        # 1) Counts by status
        rows = (await db.execute(text("select status, count(*) from processor_events group by status"))).fetchall()
        counts_by_status = {str(r[0]): int(r[1]) for r in rows}

        # 2) Kinds total (top 50)
        rows = (
            await db.execute(
                text(
                    """
                    select coalesce(kind,'') as kind, count(*) as cnt
                      from processor_events
                     group by coalesce(kind,'')
                     order by cnt desc
                     limit 50
                    """
                )
            )
        ).fetchall()
        kinds_total = [{"kind": str(r[0]), "count": int(r[1])} for r in rows]

        # 3) Oldest created_at per status
        rows = (
            await db.execute(
                text(
                    """
                    select status, min(created_at) as oldest
                      from processor_events
                     group by status
                    """
                )
            )
        ).fetchall()
        oldest_by_status = {str(r[0]): (r[1].isoformat() if r[1] else None) for r in rows}

        # 4) Duplicate dedup_key samples
        rows = (
            await db.execute(
                text(
                    """
                    select dedup_key, count(*) as cnt
                      from processor_events
                     where dedup_key is not null and length(trim(dedup_key))>0
                     group by dedup_key
                    having count(*) > 1
                     order by cnt desc
                     limit 25
                    """
                )
            )
        ).fetchall()
        dup_by_dedup_key = [{"dedup_key": str(r[0]), "count": int(r[1])} for r in rows]

        return {
            "counts_by_status": counts_by_status,
            "kinds_total": kinds_total,
            "oldest_by_status": oldest_by_status,
            "dup_by_dedup_key": dup_by_dedup_key,
        }
    except Exception as e:
        _log.error(f"Error in backlog diagnostics: {e}")
        raise HTTPException(status_code=500, detail=str(e))