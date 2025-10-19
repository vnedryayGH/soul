"""
API для управления настройками Soul через админскую панель
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from pydantic import BaseModel

from ..db import get_db, get_db_session
from ..services.rbac_service import RBACService
from ..middleware.rbac_middleware import require_permission
from ..services.soul_settings_service import SoulSettingsService
from ..services.secrets_service import SecretsService
from ..prompts.soul_prompts import SoulPromptsService
from ..models import User

router = APIRouter(prefix="/api/admin/soul", tags=["soul-admin"])

# Pydantic models
class SettingUpdate(BaseModel):
    key: str
    value: str

class PromptUpdate(BaseModel):
    key: str
    content: str


class PersonaVoiceSeed(BaseModel):
    mapping: Dict[str, Dict[str, Any]] | None = None


class SoulLimits(BaseModel):
    quant_daily_time_free_minutes: int
    quant_daily_time_paid_minutes: int
    quant_daily_token_limit: int
    quant_token_cost_per_1k: float
    service_free_daily_time_minutes: int
    service_uses_quant_limits: bool

# Services
settings_service = SoulSettingsService()
prompts_service = SoulPromptsService()
secrets_service = SecretsService()

@router.get("/settings/all")
async def get_all_soul_settings(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Получить все настройки Soul"""
    try:
        # Получаем все настройки из таблицы soul_settings
        result = await db.execute(
            select(text("key, value, description, category, data_type, is_configurable, created_at, updated_at"))
            .select_from(text("soul_settings"))
            .order_by(text("category, key"))
        )
        
        settings = []
        for row in result.fetchall():
            settings.append({
                "key": row[0],
                "value": row[1],
                "description": row[2],
                "category": row[3],
                "data_type": row[4],
                "is_configurable": row[5],
                "created_at": row[6],
                "updated_at": row[7]
            })
        
        return {"items": settings, "total": len(settings)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения настроек: {str(e)}")

@router.put("/settings")
async def update_soul_setting(
    setting: SettingUpdate,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Обновить настройку Soul"""
    try:
        # Попытка привести строковое значение к нужному типу
        raw = setting.value
        parsed: Any
        try:
            # Пробуем JSON (dict/list/true/false/null/числа)
            import json
            parsed = json.loads(raw)
        except Exception:
            low = raw.strip().lower()
            if low in ("true", "false"):
                parsed = (low == "true")
            else:
                # Пробуем int
                try:
                    parsed = int(raw)
                except Exception:
                    # Пробуем float
                    try:
                        parsed = float(raw)
                    except Exception:
                        parsed = raw  # Оставляем строкой
        
        await settings_service.set_setting(setting.key, parsed, db)
        return {"message": f"Настройка '{setting.key}' обновлена", "key": setting.key, "value": parsed}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обновления настройки: {str(e)}")


def _table_exists_sql(name: str) -> str:
    return f"SELECT to_regclass('public.{name}') IS NOT NULL"


@router.post("/tts/persona/init")
async def init_persona_voice_profiles(
    payload: PersonaVoiceSeed | None = None,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """
    Создаёт таблицы persona_voice_profile и user_persona_voice (если отсутствуют)
    и заполняет дефолтные соответствия persona_key -> голос по активным промптам.

    mapping (опционально): {
      "<pattern>": {"voice": "id", "rate": 1.0, "pitch": 0.0}
    }
    Где <pattern> матчится по prompts.name ILIKE '%pattern%' или key ILIKE '%pattern%'.
    """
    try:
        # 1) ensure tables
        res = await db.execute(text(_table_exists_sql("persona_voice_profile")))
        has_pvp = bool((res.fetchone() or [False])[0])
        if not has_pvp:
            await db.execute(text(
                """
                CREATE TABLE IF NOT EXISTS persona_voice_profile (
                  persona_key TEXT PRIMARY KEY,
                  tts_voice_id TEXT NOT NULL,
                  tts_rate NUMERIC(5,2) DEFAULT 1.00,
                  tts_pitch NUMERIC(5,2) DEFAULT 0.00,
                  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                )
                """
            ))
        # ensure tts_lang column exists
        try:
            await db.execute(text("ALTER TABLE persona_voice_profile ADD COLUMN IF NOT EXISTS tts_lang TEXT"))
        except Exception:
            pass
        res2 = await db.execute(text(_table_exists_sql("user_persona_voice")))
        has_upv = bool((res2.fetchone() or [False])[0])
        if not has_upv:
            await db.execute(text(
                """
                CREATE TABLE IF NOT EXISTS user_persona_voice (
                  user_id BIGINT NOT NULL,
                  persona_key TEXT NOT NULL,
                  tts_voice_id TEXT NOT NULL,
                  tts_rate NUMERIC(5,2),
                  tts_pitch NUMERIC(5,2),
                  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                  PRIMARY KEY (user_id, persona_key)
                )
                """
            ))

        # 2) build default mapping if none provided
        default_map = {
            # pattern: voice config
            "Кли": {"voice": "ru_female_calm", "rate": 1.00, "pitch": 0.00},
            "kli": {"voice": "ru_female_calm", "rate": 1.00, "pitch": 0.00},
            "Тихий": {"voice": "ru_male_calm_low", "rate": 0.95, "pitch": -0.15},
            "Чехов": {"voice": "ru_male_calm_low", "rate": 0.95, "pitch": -0.15},
            "soul": {"voice": "ru_male_calm_low", "rate": 0.95, "pitch": -0.15},
            "Фаина": {"voice": "ru_female_deep_warm", "rate": 0.92, "pitch": -0.10},
            "Раневск": {"voice": "ru_female_deep_warm", "rate": 0.92, "pitch": -0.10},
            "Жванец": {"voice": "ru_male_witty_bright", "rate": 1.08, "pitch": 0.05},
            "Дядя": {"voice": "ru_male_warm", "rate": 0.95, "pitch": -0.05},
            "Миша": {"voice": "ru_male_warm", "rate": 0.95, "pitch": -0.05},
            "Вед": {"voice": "ru_male_wise_low", "rate": 0.90, "pitch": -0.20},
            "Поток": {"voice": "ru_female_energetic", "rate": 1.10, "pitch": 0.10},
        }
        mapping = (payload.mapping if payload else None) or default_map  # type: ignore[attr-defined]

        # 3) seed by matching patterns against prompts
        total_upserts = 0
        for patt, cfg in mapping.items():
            voice = str(cfg.get("voice"))
            rate = float(cfg.get("rate", 1.0))
            pitch = float(cfg.get("pitch", 0.0))
            sql = text(
                """
                INSERT INTO persona_voice_profile (persona_key, tts_voice_id, tts_rate, tts_pitch)
                SELECT key, :v, :r, :p
                  FROM prompts
                 WHERE is_active = TRUE AND (name ILIKE :pn OR key ILIKE :pk)
                ON CONFLICT (persona_key) DO UPDATE SET
                    tts_voice_id = EXCLUDED.tts_voice_id,
                    tts_rate = EXCLUDED.tts_rate,
                    tts_pitch = EXCLUDED.tts_pitch,
                    updated_at = NOW()
                """
            )
            res = await db.execute(sql, {"v": voice, "r": rate, "p": pitch, "pn": f"%{patt}%", "pk": f"%{patt}%"})
            try:
                total_upserts += res.rowcount or 0
            except Exception:
                pass

        await db.commit()

        # 4) return current mapping joined with prompts
        rows = []
        try:
            q = text(
                """
                SELECT p.key, p.name, v.tts_voice_id, COALESCE(v.tts_rate,1.0), COALESCE(v.tts_pitch,0.0), COALESCE(v.tts_lang,'ru-RU')
                  FROM persona_voice_profile v
                  JOIN prompts p ON p.key = v.persona_key
                 WHERE p.is_active = TRUE
                 ORDER BY p.sort_order, p.id
                """
            )
            cur = await db.execute(q)
            rows = [
                {"persona_key": r[0], "name": r[1], "tts_voice_id": r[2], "rate": float(r[3]), "pitch": float(r[4]), "lang": str(r[5])}
                for r in (cur.fetchall() or [])
            ]
        except Exception:
            rows = []

        return {"status": "ok", "upserts": total_upserts, "items": rows}
    except HTTPException:
        raise
    except Exception as e:
        try:
            await db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"init_persona_voice_profiles failed: {str(e)}")


@router.get("/tts/persona/list")
async def list_persona_voice_profiles(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    try:
        res = await db.execute(text(_table_exists_sql("persona_voice_profile")))
        if not bool((res.fetchone() or [False])[0]):
            return {"items": []}
        q = text(
            """
            SELECT p.key, p.name, v.tts_voice_id, COALESCE(v.tts_rate,1.0), COALESCE(v.tts_pitch,0.0)
              FROM persona_voice_profile v
              JOIN prompts p ON p.key = v.persona_key
             WHERE p.is_active = TRUE
             ORDER BY p.sort_order, p.id
            """
        )
        cur = await db.execute(q)
        items = [
            {"persona_key": r[0], "name": r[1], "tts_voice_id": r[2], "rate": float(r[3]), "pitch": float(r[4])}
            for r in (cur.fetchall() or [])
        ]
        return {"items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"list_persona_voice_profiles failed: {str(e)}")


class PersonaSetIn(BaseModel):
    persona_key: str
    tts_voice_id: str
    rate: float | None = 1.0
    pitch: float | None = 0.0
    lang: str | None = None


@router.post("/tts/persona/set")
async def set_persona_voice_profile(
    payload: PersonaSetIn,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Явно установить голосовые параметры для конкретной персоны (по ключу промпта)."""
    try:
        # ensure table exists
        res = await db.execute(text(_table_exists_sql("persona_voice_profile")))
        if not bool((res.fetchone() or [False])[0]):
            await db.execute(text(
                """
                CREATE TABLE IF NOT EXISTS persona_voice_profile (
                  persona_key TEXT PRIMARY KEY,
                  tts_voice_id TEXT NOT NULL,
                  tts_rate NUMERIC(5,2) DEFAULT 1.00,
                  tts_pitch NUMERIC(5,2) DEFAULT 0.00,
                  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                )
                """
            ))
        # ensure column exists before upsert
        try:
            await db.execute(text("ALTER TABLE persona_voice_profile ADD COLUMN IF NOT EXISTS tts_lang TEXT"))
        except Exception:
            pass
        sql = text(
            """
            INSERT INTO persona_voice_profile (persona_key, tts_voice_id, tts_rate, tts_pitch, tts_lang)
            VALUES (:k, :v, :r, :p, COALESCE(:l,'ru-RU'))
            ON CONFLICT (persona_key) DO UPDATE SET
                tts_voice_id = EXCLUDED.tts_voice_id,
                tts_rate = EXCLUDED.tts_rate,
                tts_pitch = EXCLUDED.tts_pitch,
                tts_lang = EXCLUDED.tts_lang,
                updated_at = NOW()
            """
        )
        await db.execute(sql, {"k": payload.persona_key, "v": payload.tts_voice_id, "r": payload.rate or 1.0, "p": payload.pitch or 0.0, "l": (payload.lang or None)})
        await db.commit()
        return {"status": "ok", "persona_key": payload.persona_key}
    except Exception as e:
        try:
            await db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"set_persona_voice_profile failed: {str(e)}")


class UserVoiceOverrideIn(BaseModel):
    user_tg_id: int
    persona_key: str
    voice_id: str
    rate: float | None = None
    pitch: float | None = None


@router.post("/tts/user/set")
async def set_user_persona_voice_override(
    payload: UserVoiceOverrideIn,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Установить переопределение голоса для пользователя в разрезе персоны (UPSERT в user_persona_voice)."""
    try:
        # resolve user_id by tg_id
        from sqlalchemy import select as _select
        from ..models import User as _User
        row = await db.execute(_select(_User).where(_User.tg_id == int(payload.user_tg_id)))
        u = row.scalar_one_or_none()
        if not u:
            raise HTTPException(status_code=404, detail="user not found")
        # ensure table
        res = await db.execute(text(_table_exists_sql("user_persona_voice")))
        if not bool((res.fetchone() or [False])[0]):
            await db.execute(text(
                """
                CREATE TABLE IF NOT EXISTS user_persona_voice (
                  user_id BIGINT NOT NULL,
                  persona_key TEXT NOT NULL,
                  tts_voice_id TEXT NOT NULL,
                  tts_rate NUMERIC(5,2),
                  tts_pitch NUMERIC(5,2),
                  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                  PRIMARY KEY (user_id, persona_key)
                )
                """
            ))
        # upsert
        await db.execute(text(
            """
            INSERT INTO user_persona_voice (user_id, persona_key, tts_voice_id, tts_rate, tts_pitch, updated_at)
            VALUES (:uid, :pk, :v, :r, :p, NOW())
            ON CONFLICT (user_id, persona_key)
            DO UPDATE SET tts_voice_id = EXCLUDED.tts_voice_id,
                          tts_rate = EXCLUDED.tts_rate,
                          tts_pitch = EXCLUDED.tts_pitch,
                          updated_at = NOW()
            """
        ), {"uid": int(u.id), "pk": payload.persona_key, "v": payload.voice_id, "r": payload.rate, "p": payload.pitch})
        await db.commit()
        return {"status": "ok", "user_id": int(u.id), "persona_key": payload.persona_key, "voice": payload.voice_id}
    except HTTPException:
        raise
    except Exception as e:
        try:
            await db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"set_user_persona_voice_override failed: {str(e)}")

@router.post("/settings/set_kv")
async def set_setting_kv(
    key: str,
    value: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Простой переключатель настроек через query-параметры (без JSON тела).

    Парсит строковый value в bool/int/float/JSON при возможности, иначе сохраняет как строку.
    """
    try:
        # Попытка привести строковое значение к нужному типу
        raw = value
        parsed: Any
        try:
            import json
            parsed = json.loads(raw)
        except Exception:
            low = raw.strip().lower()
            if low in ("true", "false"):
                parsed = (low == "true")
            else:
                try:
                    parsed = int(raw)
                except Exception:
                    try:
                        parsed = float(raw)
                    except Exception:
                        parsed = raw

        await settings_service.set_setting(key, parsed, db)
        return {"message": f"Настройка '{key}' обновлена", "key": key, "value": parsed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обновления настройки: {str(e)}")


class SecretSetB64(BaseModel):
    key: str
    value_b64: str


@router.post("/secrets/set_b64")
async def secrets_set_b64(
    payload: SecretSetB64,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin")),
):
    """Запись секрета в `public.soul_secrets` из base64-значения.

    Значение декодируется как UTF-8 после base64. Сама строка секрета не логируется.
    """
    try:
        import base64
        raw = base64.b64decode((payload.value_b64 or "").encode("ascii"), validate=True)
        value = raw.decode("utf-8", errors="strict")
    except Exception:
        raise HTTPException(status_code=400, detail="invalid base64")
    ok = await secrets_service.set_secret(db, payload.key, value, updated_by="api.admin")
    if not ok:
        raise HTTPException(status_code=500, detail="failed to set secret")
    return {"status": "ok", "key": payload.key}

@router.get("/prompts/all")
async def get_all_soul_prompts(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Получить все промпты Soul"""
    try:
        # Пытаемся прочитать llm_prompts
        result = await db.execute(
            select(text("key, title, content, category, is_system, created_at, updated_at"))
            .select_from(text("llm_prompts"))
            .order_by(text("category, key"))
        )
        rows = result.fetchall()
        if not rows:
            # если пусто, пробуем soul_prompts
            result = await db.execute(
                select(text("key, COALESCE(name,title) as title, content, category, TRUE as is_system, created_at, updated_at"))
                .select_from(text("soul_prompts"))
                .order_by(text("category, key"))
            )
            rows = result.fetchall()

        prompts = []
        for row in rows:
            prompts.append({
                "key": row[0],
                "title": row[1],
                "content": row[2],
                "category": row[3],
                "is_system": row[4],
                "created_at": row[5],
                "updated_at": row[6]
            })
        return {"items": prompts, "total": len(prompts)}
    except Exception as e:
        # Финальный безопасный ответ
        return {"items": [], "total": 0, "warning": f"prompts unavailable: {str(e)}"}

@router.put("/prompts")
async def update_soul_prompt(
    prompt: PromptUpdate,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Обновить промпт Soul"""
    try:
        await prompts_service.set_prompt(prompt.key, prompt.content, db)
        return {"message": f"Промпт '{prompt.key}' обновлен", "key": prompt.key}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обновления промпта: {str(e)}")

@router.get("/settings/categories")
async def get_settings_categories(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Получить список категорий настроек"""
    try:
        result = await db.execute(
            select(text("DISTINCT category"))
            .select_from(text("soul_settings"))
            .where(text("category IS NOT NULL"))
            .order_by(text("category"))
        )
        
        categories = [row[0] for row in result.fetchall()]
        return {"categories": categories}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения категорий: {str(e)}")

@router.get("/prompts/categories")
async def get_prompts_categories(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    """Получить список категорий промптов"""
    try:
        result = await db.execute(
            select(text("DISTINCT category"))
            .select_from(text("llm_prompts"))
            .where(text("category IS NOT NULL"))
            .order_by(text("category"))
        )
        
        categories = [row[0] for row in result.fetchall()]
        return {"categories": categories}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения категорий промптов: {str(e)}")

@router.get("/settings/limits")
async def get_soul_limits(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    svc = SoulSettingsService()
    keys = [
        "quant_daily_time_free_minutes",
        "quant_daily_time_paid_minutes",
        "quant_daily_token_limit",
        "quant_token_cost_per_1k",
        "service_free_daily_time_minutes",
        "service_uses_quant_limits",
    ]
    values = {}
    for k in keys:
        values[k] = await svc.get_setting(k, db)
    return values

@router.put("/settings/limits")
async def update_soul_limits(
    payload: SoulLimits,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_permission("soul.admin"))
):
    svc = SoulSettingsService()
    for k, v in payload.model_dump().items():
        await svc.set_setting(k, v, db)
    return await get_soul_limits(db, current_user)
