from __future__ import annotations

from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import os

from ..services.soul_settings_service import SoulSettingsService


async def run(db: AsyncSession, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Инспектор: missing_critical_files
    - Читает список критичных путей из настройки `guard.critical_files` (array of strings)
    - Проверяет наличие каждого файла/каталога в рабочем дереве
    - Возвращает статус failed, если есть отсутствующие элементы
    """
    settings = SoulSettingsService()
    critical_files: List[str] = await settings.get_array(db, key="guard.critical_files") or []

    checks: Dict[str, Any] = {"total": len(critical_files), "missing": [], "present": []}
    for path in critical_files:
        if os.path.exists(path):
            checks["present"].append(path)
        else:
            checks["missing"].append(path)

    status = "passed" if not checks["missing"] else "failed"
    return {"status": status, "checks": checks}


