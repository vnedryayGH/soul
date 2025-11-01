from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

# Local DB session
try:
    from ..db import get_db_session  # type: ignore
except Exception:  # pragma: no cover
    from backend.app.db import get_db_session  # type: ignore

# Models
try:
    from ..models import User  # type: ignore
except Exception:  # pragma: no cover
    from backend.app.models import User  # type: ignore

# OTP/JWT helpers from tools package (single source of truth)
try:
    from tools.catalog.active.utils.auth import (  # type: ignore
        create_jwt,
        generate_time_based_otp,
    )
except Exception as _e:  # pragma: no cover
    raise ImportError(f'web_auth requires tools.auth helpers: {repr(_e)}')

# Telegram header verifier
try:
    from tools.catalog.active.utils.dependencies import (  # type: ignore
        verify_telegram_auth,
    )
except Exception as _e:  # pragma: no cover
    raise ImportError(f'web_auth requires tools.dependencies.verify_telegram_auth: {repr(_e)}')


router = APIRouter(prefix='/api/web-auth', tags=['web-auth'])


@router.get('/health')
async def web_auth_health(db: AsyncSession = Depends(get_db_session)) -> dict:
    """Простой health для диагностики web-auth: проверка соединения с БД."""
    try:
        await db.execute(select(User.id).limit(1))
        db_ok = True
    except Exception:
        db_ok = False
    return {'status': 'ok', 'db': db_ok, 'router': 'web_auth'}


@router.post('/issue-one-time-token')
async def issue_one_time_token(
    tg_id: int = Depends(verify_telegram_auth),
    db: AsyncSession = Depends(get_db_session),
) -> dict[str, Any]:
    """Выдача одноразового токена (OTP) для веб-авторизации.
    Требует заголовок X-Telegram-User-ID.
    """
    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    otp = generate_time_based_otp(tg_id, 300)
    return {'status': 'success', 'otp': otp, 'tg_id': tg_id, 'expires_in': 300}


@router.post('/verify-otp')
async def verify_otp(request: dict, db: AsyncSession = Depends(get_db_session)) -> Response:
    """Проверка OTP и выдача JWT токена + HttpOnly cookie для веб-клиента."""
    tg_id = request.get('tg_id')
    otp = request.get('otp')
    if not tg_id or not otp:
        raise HTTPException(status_code=400, detail='tg_id and otp are required')

    expected = generate_time_based_otp(tg_id, 300)
    if otp != expected:
        raise HTTPException(status_code=401, detail='Invalid or expired OTP')

    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    # Включаем tg_id и sub для стабильной фронтовой привязки
    token = create_jwt({'user_id': user.id, 'web': True, 'tg_id': user.tg_id, 'sub': user.tg_id})

    resp = Response(media_type='application/json')
    try:
        resp.set_cookie(
            key='sp_token',
            value=token,
            max_age=60 * 60 * 12,
            httponly=True,
            secure=True,
            samesite='none',
            domain='.soulpulse.art',
            path='/',
        )
    except Exception:
        # Cookie установка — best-effort; фронт использует Bearer при необходимости
        pass

    # Ручная сборка лёгкого JSON, чтобы не тащить схемы
    body = (
        '{'
        f'"status":"success","token":"{token}","tg_id":{int(tg_id)},'
        f'"user":{{"id":{user.tg_id or 0},"first_name":"{user.first_name or ''}","last_name":"{user.last_name or ''}","username":"{user.username or ''}"}}'
        '}'
    ).encode()
    resp.body = body
    return resp


