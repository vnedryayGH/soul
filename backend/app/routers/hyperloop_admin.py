from __future__ import annotations

from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..db import get_db_session
from ..middleware.rbac_middleware import require_permission
from ..services.hyperloop_service import HyperloopService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/hyperloop", tags=["hyperloop-admin"])


class ExecutePayload(BaseModel):
    commands: str
    options: Optional[Dict[str, Any]] = None


@router.post("/execute")
async def execute_hyperloop(
    payload: ExecutePayload,
    db: AsyncSession = Depends(get_db_session),
    current_user: Any = Depends(require_permission("soul.admin")),
):
    try:
        svc = HyperloopService()
        out = svc.execute_dsl(payload.commands, options=payload.options)
        if isinstance(out, dict):
            return out
        return {"raw": out}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
