from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select, text as _sqltext  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

try:
    from ..db import get_db_session  # type: ignore
except Exception:  # pragma: no cover
    from backend.app.db import get_db_session  # type: ignore

# OTP/JWT helpers (prefer tools, fallback locally)
try:
    from tools.catalog.active.utils.auth import (  # type: ignore
        create_jwt as _create_jwt,
        verify_init_data as _verify_init_data,
        generate_time_based_otp as _gen_otp,
    )
except Exception:
    _create_jwt = None  # type: ignore
    _verify_init_data = None  # type: ignore
    _gen_otp = None  # type: ignore


def _create_jwt_local(claims: dict) -> str:
    import datetime as _dt
    try:
        import jwt as _pyjwt  # type: ignore
    except Exception:
        # Minimal fallback
        import base64, json as _j
        b = base64.urlsafe_b64encode(_j.dumps(claims).encode()).decode().rstrip('=')
        return f'fallback.{b}.token'
    import os

    secret = os.getenv('JWT_SECRET') or 'change-me'
    payload = dict(claims)
    payload.setdefault('exp', _dt.datetime.utcnow() + _dt.timedelta(hours=12))
    return _pyjwt.encode(payload, secret, algorithm='HS256')  # type: ignore


router = APIRouter(prefix='/api/miniapp/auth', tags=['auth'])


@router.get('/health')
async def miniapp_health(db: AsyncSession = Depends(get_db_session)) -> dict:
    try:
        await db.execute(_sqltext('select 1'))
        db_ok = True
    except Exception:
        db_ok = False
    return {'status': 'ok', 'db': db_ok, 'router': 'miniapp_auth'}


@router.post('/verify')
async def verify(
    request: dict[str, Any],
    db: AsyncSession = Depends(get_db_session),
):
    init_data = request.get('initData') if isinstance(request, dict) else None
    if not isinstance(init_data, str) or not init_data:
        raise HTTPException(status_code=400, detail='initData is required')

    tg_id: int | None = None
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None

    # Prefer tools verifier
    if _verify_init_data is not None:
        user_payload = _verify_init_data(init_data)
        if user_payload is None:
            raise HTTPException(status_code=401, detail='Invalid initData')
        tg_id = int(user_payload.get('id')) if user_payload.get('id') else None
        first_name = user_payload.get('first_name')
        last_name = user_payload.get('last_name')
        username = user_payload.get('username')
    else:
        # Minimal parser fallback: extract user JSON from query-string field 'user='
        try:
            from urllib.parse import parse_qsl
            import json as _j

            parsed = dict(parse_qsl(init_data))
            user_json = parsed.get('user')
            if user_json:
                data = _j.loads(user_json)
                tg_id = int(data.get('id')) if data.get('id') else None
                first_name = data.get('first_name')
                last_name = data.get('last_name')
                username = data.get('username')
        except Exception:
            pass

    if not tg_id:
        raise HTTPException(status_code=400, detail='Telegram user ID not found')

    # Upsert user via raw SQL for resilience
    res = await db.execute(
        _sqltext('select id from users where tg_id = :tg limit 1'), {'tg': int(tg_id)}
    )
    row = res.mappings().first()
    user_id: int
    if row is None:
        ins = await db.execute(
            _sqltext(
                'insert into users (tg_id, first_name, last_name, username) values (:tg,:fn,:ln,:un) returning id'
            ),
            {'tg': int(tg_id), 'fn': first_name, 'ln': last_name, 'un': username},
        )
        user_id = int(ins.scalar())
        try:
            await db.commit()
        except Exception:
            pass
    else:
        user_id = int(row['id'])

    token = (_create_jwt or _create_jwt_local)({'user_id': user_id})  # type: ignore
    return {'token': token, 'user': {'id': user_id, 'tg_id': tg_id, 'first_name': first_name, 'last_name': last_name, 'username': username}}


