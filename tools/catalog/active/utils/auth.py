from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import schemas
from ..auth import (
    create_jwt,
    generate_time_based_otp,
    verify_init_data,
    verify_widget_data,
)
from ..db import get_db_session
from ..dependencies import verify_telegram_auth
from ..models import User

router = APIRouter(prefix='/api/miniapp/auth', tags=['auth'])
web_router = APIRouter(prefix='/api/web-auth', tags=['web-auth'])


@router.get('/health')
async def miniapp_health(
    db: AsyncSession = Depends(get_db_session),
    x_telegram_user_id: str | None = Header(None, alias='X-Telegram-User-ID'),
):
    """Health для MiniApp: проверка БД и наличия Telegram заголовка."""
    try:
        await db.execute(select(User.id).limit(1))
        db_ok = True
    except Exception:
        db_ok = False
    return {
        'status': 'ok',
        'db': db_ok,
        'header_present': bool(x_telegram_user_id),
        'router': 'miniapp_auth',
    }

@router.post('/verify', response_model=schemas.AuthResponse)
async def verify(
    request: schemas.AuthVerifyRequest,
    db: AsyncSession = Depends(get_db_session),
):
    user_payload = verify_init_data(request.initData)
    if user_payload is None:
        raise HTTPException(status_code=401, detail='Invalid initData')

    tg_id = user_payload.get('id')
    first_name = user_payload.get('first_name')
    last_name = user_payload.get('last_name')
    username = user_payload.get('username')

    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(tg_id=tg_id, first_name=first_name, last_name=last_name, username=username)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_jwt({'user_id': user.id})
    return schemas.AuthResponse(token=token, user=user)  # type: ignore


@router.post('/verify-dev', response_model=schemas.AuthResponse)
async def verify_dev(
    request: schemas.AuthVerifyRequest,
    db: AsyncSession = Depends(get_db_session),
):
    """Dev endpoint без проверки hash для локального тестирования"""
    import json
    from urllib.parse import parse_qsl

    try:
        # Парсим initData как query string
        parsed_data = dict(parse_qsl(request.initData))

        # Извлекаем user данные
        user_json = parsed_data.get('user')
        if not user_json:
            raise HTTPException(status_code=400, detail='User data not found in initData')

        user_data = json.loads(user_json)
        tg_id = user_data.get('id')
        first_name = user_data.get('first_name', '')
        last_name = user_data.get('last_name', '')
        username = user_data.get('username', '')

        if not tg_id:
            raise HTTPException(status_code=400, detail='Telegram user ID not found')

        # Находим или создаем пользователя
        result = await db.execute(select(User).where(User.tg_id == tg_id))
        user = result.scalar_one_or_none()
        if user is None:
            user = User(tg_id=tg_id, first_name=first_name, last_name=last_name, username=username)
            db.add(user)
            await db.commit()
            await db.refresh(user)

        token = create_jwt({'user_id': user.id})
        return schemas.AuthResponse(token=token, user=user)  # type: ignore

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail='Invalid user data format')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Authentication error: {str(e)}')


@router.post('/verify-widget')
async def verify_widget(
    request: dict,
    db: AsyncSession = Depends(get_db_session),
):
    """Авторизация через Telegram Login Widget"""

    # Проверяем подпись виджета
    if not verify_widget_data(request):
        raise HTTPException(status_code=401, detail='Invalid widget data')

    tg_id = request.get('id')
    first_name = request.get('first_name', '')
    last_name = request.get('last_name', '')
    username = request.get('username', '')

    if not tg_id:
        raise HTTPException(status_code=400, detail='Telegram user ID not found')

    # Находим или создаем пользователя
    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(tg_id=tg_id, first_name=first_name, last_name=last_name, username=username)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_jwt({'user_id': user.id})
    return {'status': 'success', 'token': token, 'user': user}


@router.post('/verify-otp')
async def verify_otp_miniapp(
    request: dict,
    db: AsyncSession = Depends(get_db_session),
):
    """Проверка OTP для мини-приложения"""

    tg_id = request.get('tg_id')
    otp = request.get('otp')

    if not tg_id or not otp:
        raise HTTPException(status_code=400, detail='tg_id and otp are required')

    # Проверяем OTP токен
    expected = generate_time_based_otp(tg_id, 300)
    if otp != expected:
        raise HTTPException(status_code=401, detail='Invalid or expired OTP')

    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    token = create_jwt({'user_id': user.id, 'web': True})
    return {'status': 'success', 'token': token, 'tg_id': tg_id}


# Alias для выдачи одноразового токена под уже подключенным префиксом /api/miniapp/auth
@router.post('/issue-one-time-token')
async def issue_one_time_token_alias(
    tg_id: int = Depends(verify_telegram_auth),
    db: AsyncSession = Depends(get_db_session),
):
    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    otp = generate_time_based_otp(tg_id, 300)
    return {'status': 'success', 'otp': otp, 'tg_id': tg_id, 'expires_in': 300}


# === WEB AUTH ENDPOINTS ===


@web_router.post('/issue-one-time-token')
async def issue_one_time_token(
    tg_id: int = Depends(verify_telegram_auth),
    db: AsyncSession = Depends(get_db_session),
):
    """Выдача одноразового токена для веб авторизации"""

    # Проверяем, что пользователь существует
    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    # Генерируем OTP токен (действует 5 минут)
    otp = generate_time_based_otp(tg_id, 300)

    return {
        'status': 'success',
        'otp': otp,
        'tg_id': tg_id,
        'expires_in': 300,  # 5 минут в секундах
    }


@web_router.post('/verify-otp')
async def verify_otp(
    request: dict,
    db: AsyncSession = Depends(get_db_session),
):
    """Проверка OTP токена для веб авторизации"""

    tg_id = request.get('tg_id')
    otp = request.get('otp')

    if not tg_id or not otp:
        raise HTTPException(status_code=400, detail='tg_id and otp are required')

    # Проверяем OTP токен
    expected = generate_time_based_otp(tg_id, 300)
    if otp != expected:
        raise HTTPException(status_code=401, detail='Invalid or expired OTP')

    # Получаем пользователя из БД
    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    # Создаем JWT токен для веб версии
    token = create_jwt({'user_id': user.id, 'web': True})

    return {
        'status': 'success',
        'token': token,
        'tg_id': tg_id,
        'user': {
            'id': user.tg_id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
        },
    }


# Новый эндпоинт: выдача одноразового кода Архитектору
@router.post('/issue-architect-code')
async def issue_architect_code(
    tg_id: int = Depends(verify_telegram_auth),
    db: AsyncSession = Depends(get_db_session),
):
    """Выдать одноразовый код входа в чат Архитектора. Действует 10 минут."""
    # Проверяем пользователя
    result = await db.execute(select(User).where(User.tg_id == tg_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    # Проверяем роль (минимально: username == 'Architect' или позже через RBAC)
    # Здесь оставляем упрощенно, чтобы не зависеть от других модулей
    # Генерируем код
    import uuid as _uuid
    from datetime import datetime, timedelta

    from ..models import TelegramAuthCode

    code = _uuid.uuid4().hex[:8].upper()
    auth_code = TelegramAuthCode(
        user_id=user.id, code=code, expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(auth_code)
    await db.commit()

    return {'status': 'success', 'code': code, 'expires_in': 600}
