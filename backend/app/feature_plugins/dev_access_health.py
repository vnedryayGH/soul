from __future__ import annotations

from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text as _t


async def run(db: AsyncSession, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    dev_access.health — инспектор доступности dev-access контура.

    Проверки (best-effort, без внешних HTTP вызовов):
      - Наличие зарегистрированного роутера dev_access_admin (по таблице маршрутов FastAPI — через reflect в контексте не доступно, поэтому проверяем импорт).
      - Базовые ключи для GitHub App в settings/secrets: app_id, installation_id, private_key.
      - Возвращает агрегаты и статус passed/failed.
    """
    result: Dict[str, Any] = {"status": "ok", "checks": {}, "notes": {}}

    # 1) Проверка наличия модуля роутера (импортируемость как индикатор регистрации на деплое)
    try:
        try:
            import importlib as _imp
            _imp.import_module("backend.app.routers.dev_access_admin")
            result["checks"]["router_import_ok"] = True
        except Exception as e:
            result["checks"]["router_import_ok"] = False
            result["notes"]["router_error"] = str(e)
    except Exception:
        result["checks"]["router_import_ok"] = False

    # 2) Проверка ключевых параметров Dev Access / GitHub App в настройках и секретах
    app_id_present = False
    installation_id_present = False
    private_key_present = False
    try:
        # settings: github.app.id, github.installation.id (числовые либо строковые)
        row = (await db.execute(_t("select value from soul_settings where key='github.app.id' limit 1"))).fetchone()
        app_id_present = (row is not None and (row[0] is not None) and str(row[0]).strip() != "")
    except Exception:
        app_id_present = False
    try:
        row = (await db.execute(_t("select value from soul_settings where key='github.installation.id' limit 1"))).fetchone()
        installation_id_present = (row is not None and (row[0] is not None) and str(row[0]).strip() != "")
    except Exception:
        installation_id_present = False
    try:
        # secrets: bot.token.* и github.app.private_key (ключ хранится только как факт наличия)
        row = (await db.execute(_t("select 1 from public.soul_secrets where key='github.app.private_key' limit 1"))).fetchone()
        private_key_present = bool(row is not None)
    except Exception:
        private_key_present = False

    result["checks"].update({
        "app_id_present": bool(app_id_present),
        "installation_id_present": bool(installation_id_present),
        "app_private_key_present": bool(private_key_present),
    })

    # 3) Сводный статус
    ok = all([
        result["checks"].get("router_import_ok"),
        result["checks"].get("app_id_present"),
        result["checks"].get("installation_id_present"),
        result["checks"].get("app_private_key_present"),
    ])
    result["status"] = "passed" if ok else "failed"
    return result


