from __future__ import annotations

from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text as _t


async def run(*, db: AsyncSession, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Inspector: incident.sla_enforcement (presence + SLA windows)

    - presence: incidents.severity, incidents.detected_at
    - SLA: MTTA <= 2h for sev1-2; MTTR <= 24h for sev1, <= 72h for sev2
    """
    metrics: Dict[str, Any] = {}
    try:
        # Presence checks
        q = await db.execute(
            _t(
                """
                select
                  (select 1 from information_schema.columns where table_name='incidents' and column_name='severity') is not null as has_severity,
                  (select 1 from information_schema.columns where table_name='incidents' and column_name='detected_at') is not null as has_detected_at
                """
            )
        )
        row = q.fetchone()
        metrics["incidents.severity_present"] = bool(row and row[0])
        metrics["incidents.detected_at_present"] = bool(row and row[1])

        # MTTA breaches (> 2 hours)
        mtta_bad = int((await db.execute(_t(
            """
            select count(*) from incidents
            where severity in (1,2)
              and acknowledged_at is not null
              and extract(epoch from (acknowledged_at - detected_at)) > 2*3600
            """
        ))).scalar() or 0)
        metrics["mtta_bad"] = mtta_bad

        # MTTR breaches sev=1 (> 24h)
        mttr1_bad = int((await db.execute(_t(
            """
            select count(*) from incidents
            where severity = 1 and status = 'closed'
              and extract(epoch from (closed_at - detected_at)) > 24*3600
            """
        ))).scalar() or 0)
        metrics["mttr1_bad"] = mttr1_bad

        # MTTR breaches sev=2 (> 72h)
        mttr2_bad = int((await db.execute(_t(
            """
            select count(*) from incidents
            where severity = 2 and status = 'closed'
              and extract(epoch from (closed_at - detected_at)) > 72*3600
            """
        ))).scalar() or 0)
        metrics["mttr2_bad"] = mttr2_bad

        passed_presence = metrics["incidents.severity_present"] and metrics["incidents.detected_at_present"]
        passed_sla = (mtta_bad == 0) and (mttr1_bad == 0) and (mttr2_bad == 0)
        status = "passed" if (passed_presence and passed_sla) else "failed"
        return {"status": status, "detail": "incident SLA summary", "metrics": metrics}
    except Exception as e:
        return {"status": "failed", "detail": f"db_error: {e}", "metrics": metrics}


