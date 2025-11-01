from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import text as _sql
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
    # Minimal local auth fallback: reject if header missing
    from fastapi import Header

    async def get_authenticated_user(  # type: ignore
        x_telegram_user_id: str | None = Header(None, alias='X-Telegram-User-ID'),
        db: AsyncSession = Depends(get_db_session),
    ) -> Any:
        if not x_telegram_user_id:
            raise HTTPException(status_code=401, detail='Missing X-Telegram-User-ID header')
        # Resolve user by tg_id
        res = await db.execute(_sql('select id, tg_id from users where tg_id=:tg limit 1'), {'tg': int(x_telegram_user_id)})
        row = res.mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail='User not found')
        return type('U', (), {'id': int(row['id'])})


router = APIRouter(prefix='/api/miniapp/prompts', tags=['prompts'])


@router.get('/')
async def list_prompts(user: Any = Depends(get_authenticated_user), db: AsyncSession = Depends(get_db_session)) -> dict:
    # Ensure user_settings default
    await db.execute(
        _sql('insert into user_settings (user_id, active_prompt_key) select :uid, :key where not exists (select 1 from user_settings where user_id=:uid)'),
        {'uid': int(user.id), 'key': 'prompt-4'},
    )
    await db.commit()
    # Fetch prompts
    res = await db.execute(_sql('select id, key, name, description, locale, icon_emoji, icon_color, category, is_base, coalesce(can_work_alone,false) as can_work_alone, coalesce(is_active,true) as is_active, coalesce(sort_order,9999) as sort_order, features, target_audience, activation_triggers, memory_algorithm from prompts where coalesce(is_active,true)=true'))
    prompts = list(res.mappings().all())
    # User settings and per-prompt settings
    us = await db.execute(_sql('select active_prompt_key from user_settings where user_id=:uid'), {'uid': int(user.id)})
    active_key = (us.scalar() or 'prompt-4')
    ups_rows = await db.execute(_sql('select prompt_key, coalesce(disable_base_personality,false) as disable_base_personality, coalesce(deep_memory_only,false) as deep_memory_only from user_prompt_settings where user_id=:uid'), {'uid': int(user.id)})
    ups_map = {r['prompt_key']: (bool(r['disable_base_personality']), bool(r['deep_memory_only'])) for r in ups_rows.mappings().all()}

    items: list[dict] = []
    seen: set[str] = set()
    for p in prompts:
        key = p.get('key') or f"id:{p['id']}"
        dedup = f"{key}|{p.get('locale') or 'ru'}"
        if dedup in seen:
            continue
        seen.add(dedup)
        disable_base, deep_memory_only = ups_map.get(key, (bool(p.get('can_work_alone') or False), False))
        items.append(
            {
                'id': int(p['id']),
                'key': p.get('key'),
                'name': p.get('name'),
                'description': p.get('description'),
                'locale': p.get('locale'),
                'icon_emoji': p.get('icon_emoji'),
                'icon_color': p.get('icon_color'),
                'category': p.get('category'),
                'is_base': bool(p.get('is_base')),
                'can_work_alone': bool(p.get('can_work_alone')),
                'is_active': key == active_key,
                'kind': p.get('kind'),
                'features': p.get('features'),
                'target_audience': p.get('target_audience'),
                'activation_triggers': p.get('activation_triggers'),
                'memory_algorithm': p.get('memory_algorithm'),
                'sort_order': int(p.get('sort_order') or 9999),
                'disable_base_personality': bool(disable_base),
                'deep_memory_only': bool(deep_memory_only),
            }
        )
    items.sort(key=lambda x: (x.get('sort_order') if x.get('sort_order') is not None else 9999, (x.get('name') or '')))
    return {'items': items}


@router.post('/set-active')
async def set_active(request: Request, user: Any = Depends(get_authenticated_user), db: AsyncSession = Depends(get_db_session)) -> dict:
    form = await request.form()
    prompt_key = form.get('prompt_key')
    if not prompt_key:
        raise HTTPException(status_code=422, detail='prompt_key is required')
    # Check prompt exists
    pr = await db.execute(_sql('select id, name, coalesce(can_work_alone,false) as can_work_alone from prompts where key=:k'), {'k': prompt_key})
    row = pr.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail=f"Prompt with key '{prompt_key}' not found")
    disable_base = bool(row['can_work_alone'])
    # Upsert user_settings
    await db.execute(_sql('insert into user_settings (user_id, active_prompt_key, updated_at) values (:uid,:k,:ts) on conflict (user_id) do update set active_prompt_key=excluded.active_prompt_key, updated_at=excluded.updated_at'), {'uid': int(user.id), 'k': prompt_key, 'ts': datetime.utcnow()})
    # Upsert user_prompt_settings
    await db.execute(_sql('insert into user_prompt_settings (user_id, prompt_key, disable_base_personality, deep_memory_only) values (:uid,:k,:db,:dm) on conflict (user_id, prompt_key) do update set disable_base_personality=excluded.disable_base_personality, deep_memory_only=excluded.deep_memory_only'), {'uid': int(user.id), 'k': prompt_key, 'db': disable_base, 'dm': False})
    await db.commit()
    return {
        'ok': True,
        'active_prompt': {
            'key': prompt_key,
            'name': row.get('name'),
            'description': None,
            'is_active': True,
            'can_work_alone': disable_base,
        },
        'disable_base_personality': disable_base,
        'deep_memory_only': False,
    }


@router.post('/update-settings')
async def update_settings(request: Request, user: Any = Depends(get_authenticated_user), db: AsyncSession = Depends(get_db_session)) -> dict:
    form = await request.form()
    has_disable = 'disable_base' in form
    has_deep = 'deep_memory_only' in form
    disable_base_in = (form.get('disable_base', '').lower() == 'true') if has_disable else None
    deep_memory_in = (form.get('deep_memory_only', '').lower() == 'true') if has_deep else None
    # Get active prompt key
    us = await db.execute(_sql('select active_prompt_key from user_settings where user_id=:uid'), {'uid': int(user.id)})
    active_key = us.scalar()
    if not active_key:
        raise HTTPException(status_code=404, detail='Active prompt not set')
    # Read current
    cur = await db.execute(_sql('select disable_base_personality, coalesce(deep_memory_only,false) as deep_memory_only from user_prompt_settings where user_id=:uid and prompt_key=:k'), {'uid': int(user.id), 'k': active_key})
    row = cur.mappings().first()
    new_disable = bool(row['disable_base_personality']) if row else False
    new_deep = bool(row['deep_memory_only']) if row else False
    if has_disable:
        new_disable = bool(disable_base_in)
    if has_deep:
        new_deep = bool(deep_memory_in)
    await db.execute(_sql('insert into user_prompt_settings (user_id, prompt_key, disable_base_personality, deep_memory_only) values (:uid,:k,:db,:dm) on conflict (user_id, prompt_key) do update set disable_base_personality=excluded.disable_base_personality, deep_memory_only=excluded.deep_memory_only, updated_at=:ts'), {'uid': int(user.id), 'k': active_key, 'db': new_disable, 'dm': new_deep, 'ts': datetime.utcnow()})
    await db.commit()
    return {'ok': True, 'disable_base_personality': new_disable, 'deep_memory_only': new_deep, 'active_prompt_key': active_key}


