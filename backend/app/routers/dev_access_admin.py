from __future__ import annotations

from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_db_session
from ..middleware.rbac_middleware import require_permission
from ..api_diagnostics import DEV_ACCESS_HEALTH_STATUS, DEV_ACCESS_HEALTH_DURATION_MS


router = APIRouter(prefix="/api/admin/access", tags=["dev-access"])


@router.get("/health")
async def dev_access_health(
    db: AsyncSession = Depends(get_db_session),
    current_user = Depends(require_permission("soul.admin")),
) -> Dict[str, Any]:
    try:
        import time as _t
        _start = _t.time()
        from ..feature_plugins import dev_access_health as _dev
        res = await _dev.run(db, context={"source": "api"})
        _ok = 1.0 if (res.get("status") == "passed") else 0.0
        DEV_ACCESS_HEALTH_STATUS.set(_ok)
        DEV_ACCESS_HEALTH_DURATION_MS.observe((_t.time() - _start) * 1000.0)
        return {"ok": bool(_ok == 1.0), **res}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


