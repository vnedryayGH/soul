from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text as _sql
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

try:
    from ..db import get_db_session  # type: ignore
except Exception:  # pragma: no cover
    from backend.app.db import get_db_session  # type: ignore


router = APIRouter(prefix='/api/llm', tags=['LLM'])


@router.get('/functions')
async def list_functions(db: AsyncSession = Depends(get_db_session)) -> list[dict[str, Any]]:
    q = _sql(
        'select f.id, f.function_name, f.display_name, f.description, f.is_enabled, f.settings_json, f.llm_model_id, m.provider as model_provider, m.model_name as model_name '
        'from llm_function_configs f left join llm_models m on m.id = f.llm_model_id order by f.function_name'
    )
    res = await db.execute(q)
    out: list[dict[str, Any]] = []
    for r in res.mappings().all():
        out.append(
            {
                'id': int(r['id']),
                'function_name': r['function_name'],
                'display_name': r.get('display_name'),
                'description': r.get('description'),
                'is_enabled': bool(r.get('is_enabled')),
                'settings_json': r.get('settings_json'),
                'llm_model': {
                    'id': int(r['llm_model_id']) if r.get('llm_model_id') is not None else None,
                    'provider': r.get('model_provider'),
                    'model_name': r.get('model_name'),
                }
                if r.get('llm_model_id') is not None
                else None,
            }
        )
    return out


@router.get('/functions/{function_name}')
async def get_function(function_name: str, db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    q = _sql(
        'select f.id, f.function_name, f.display_name, f.description, f.is_enabled, f.settings_json, f.llm_model_id, m.provider as model_provider, m.model_name as model_name '
        'from llm_function_configs f left join llm_models m on m.id = f.llm_model_id where f.function_name = :n limit 1'
    )
    res = await db.execute(q, {'n': function_name})
    r = res.mappings().first()
    if not r:
        raise HTTPException(status_code=404, detail='Function not found')
    return {
        'id': int(r['id']),
        'function_name': r['function_name'],
        'display_name': r.get('display_name'),
        'description': r.get('description'),
        'is_enabled': bool(r.get('is_enabled')),
        'settings_json': r.get('settings_json'),
        'llm_model': {
            'id': int(r['llm_model_id']) if r.get('llm_model_id') is not None else None,
            'provider': r.get('model_provider'),
            'model_name': r.get('model_name'),
        }
        if r.get('llm_model_id') is not None
        else None,
    }


