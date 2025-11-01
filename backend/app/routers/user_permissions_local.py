from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

try:
    from ..db import get_db_session  # type: ignore
except Exception:  # pragma: no cover
    from backend.app.db import get_db_session  # type: ignore

try:
    from tools.catalog.active.utils.dependencies import (  # type: ignore
        get_authenticated_user,
    )
except Exception:  # pragma: no cover
    from fastapi import Header, HTTPException
    from sqlalchemy import text as _sql

    async def get_authenticated_user(  # type: ignore
        x_telegram_user_id: str | None = Header(None, alias='X-Telegram-User-ID'),
        db: AsyncSession = Depends(get_db_session),
    ) -> Any:
        if not x_telegram_user_id:
            raise HTTPException(status_code=401, detail='Missing X-Telegram-User-ID header')
        res = await db.execute(_sql('select id from users where tg_id=:tg'), {'tg': int(x_telegram_user_id)})
        row = res.mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail='User not found')
        return type('U', (), {'id': int(row['id'])})

try:
    from tools.catalog.active.utils.services.rbac_service import RBACService  # type: ignore
except Exception:
    RBACService = None  # type: ignore


router = APIRouter(prefix='/api/user-management', tags=['user-permissions'])


@router.get('/my-permissions')
async def my_permissions(user: Any = Depends(get_authenticated_user), db: AsyncSession = Depends(get_db_session)) -> dict:
    if RBACService is not None:
        svc = RBACService(db)  # type: ignore
        roles = await svc.get_user_roles(user.id)
        perms = await svc.get_user_permissions(user.id)
        return {
            'user_id': int(user.id),
            'roles': [
                {
                    'id': r.id,
                    'name': r.name,
                    'description': r.description,
                    'hierarchy_level': await svc.get_role_hierarchy_level(r.name),
                }
                for r in roles
            ],
            'permissions': list(perms),
            'can_manage_users': await svc.user_has_any_role(user.id, ['admin', 'architect']),
            'can_manage_roles': await svc.user_has_role(user.id, 'architect'),
        }
    # Fallback: basic only
    return {
        'user_id': int(user.id),
        'roles': [{'id': 0, 'name': 'basic', 'description': 'Basic user', 'hierarchy_level': 0}],
        'permissions': [],
        'can_manage_users': False,
        'can_manage_roles': False,
    }


