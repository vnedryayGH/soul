from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text as _t

from ..db import get_db_session
from ..middleware.rbac_middleware import require_permission
from ..models import User


router = APIRouter(prefix="/api/admin/provenance", tags=["provenance"], dependencies=[Depends(require_permission("soul.admin"))])


@router.get("/quant/{quant_id}")
async def get_edges_for_quant(
    quant_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        q = _t(
            """
            SELECT id::text, created_at, trace_id, quant_id::text, stage, source_type, source_id::text, source_hash, source_ref, relation, weight, confidence, notes
            FROM provenance_edges
            WHERE quant_id = CAST(:qid AS uuid)
            ORDER BY created_at DESC
            LIMIT 500
            """
        )
        rows = (await db.execute(q, {"qid": quant_id})).fetchall()
        items = []
        for r in rows:
            items.append({
                "id": r[0],
                "created_at": r[1].isoformat() if r[1] else None,
                "trace_id": r[2],
                "quant_id": r[3],
                "stage": r[4],
                "source_type": r[5],
                "source_id": r[6],
                "source_hash": r[7],
                "source_ref": r[8],
                "relation": r[9],
                "weight": float(r[10]) if r[10] is not None else None,
                "confidence": float(r[11]) if r[11] is not None else None,
                "notes": r[12],
            })
        return {"edges": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"lookup failed: {e}")


@router.get("/trace/{trace_id}")
async def get_edges_for_trace(
    trace_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        q = _t(
            """
            SELECT id::text, created_at, trace_id, quant_id::text, stage, source_type, source_id::text, source_hash, source_ref, relation, weight, confidence, notes
            FROM provenance_edges
            WHERE trace_id = :tid
            ORDER BY created_at DESC
            LIMIT 500
            """
        )
        rows = (await db.execute(q, {"tid": trace_id})).fetchall()
        items = []
        for r in rows:
            items.append({
                "id": r[0],
                "created_at": r[1].isoformat() if r[1] else None,
                "trace_id": r[2],
                "quant_id": r[3],
                "stage": r[4],
                "source_type": r[5],
                "source_id": r[6],
                "source_hash": r[7],
                "source_ref": r[8],
                "relation": r[9],
                "weight": float(r[10]) if r[10] is not None else None,
                "confidence": float(r[11]) if r[11] is not None else None,
                "notes": r[12],
            })
        return {"edges": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"lookup failed: {e}")


@router.get("/export/openlineage/{trace_id}")
async def export_openlineage(
    trace_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        q = _t(
            """
            SELECT stage, source_type, source_id::text, source_hash, source_ref, relation, quant_id::text
            FROM provenance_edges
            WHERE trace_id = :tid
            ORDER BY created_at ASC
            """
        )
        rows = (await db.execute(q, {"tid": trace_id})).fetchall()
        events = []
        for r in rows:
            events.append({
                "eventType": "COMPLETE",
                "job": {"namespace": "soul", "name": f"{r[0]}:{r[1]}"},
                "inputs": [{"namespace": "soul", "name": r[3]}],
                "outputs": [{"namespace": "soul", "name": r[6] or "quant"}],
                "inputsFacets": {"sourceRef": r[4] or {}},
                "run": {"runId": trace_id},
            })
        return {"runId": trace_id, "events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"export failed: {e}")


