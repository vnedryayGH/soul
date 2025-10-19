from __future__ import annotations

from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_db_session
from ..middleware.rbac_middleware import require_permission


router = APIRouter(prefix="/api/admin/access", tags=["dev-access"])


@router.get("/health")
async def dev_access_health(
    db: AsyncSession = Depends(get_db_session),
    current_user = Depends(require_permission("soul.admin")),
) -> Dict[str, Any]:
    try:
        from ..feature_plugins import dev_access_health as _dev
        res = await _dev.run(db, context={"source": "api"})
        return {"ok": (res.get("status") == "passed"), **res}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


