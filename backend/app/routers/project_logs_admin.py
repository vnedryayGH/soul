"""
P66 — Project Logs Admin API
API endpoints для управления проектными логами
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from pydantic import BaseModel

from ..config import get_settings
from ..services.rbac_service import require_permission
from ..services.project_log_service import ProjectLogService
from ..db import get_async_db


router = APIRouter(
    prefix="/api/admin/projects",
    tags=["projects", "logs", "p66"]
)


# Request/Response models
class LogInitRequest(BaseModel):
    template: str = "default"


class LogUpdateOpRequest(BaseModel):
    step_title: str
    step_result: str
    files: Optional[list[str]] = None
    step_status: str = "✅"


class LogUpdateExtRequest(BaseModel):
    section: str  # history/adr/diagrams/incidents
    content: str


class LogRotateRequest(BaseModel):
    next_task: Optional[str] = None


# Endpoints

@router.post("/{project_id}/logs/init")
async def init_project_logs(
    project_id: str,
    request: LogInitRequest,
    db: AsyncSession = Depends(get_async_db),
    x_telegram_user_id: Optional[str] = Header(None)
):
    """
    POST /api/admin/projects/:project_id/logs/init
    
    Инициализировать проектные логи (operational + extended)
    Requires: soul.admin permission
    """
    # RBAC check
    if x_telegram_user_id:
        await require_permission("soul.admin", x_telegram_user_id, db)
    
    # Получить данные проекта
    from sqlalchemy import text as sa_text
    row = (await db.execute(sa_text(
        "select name, description, methodology, owner, status from projects where id=cast(:id as uuid)"
    ), {"id": project_id})).mappings().first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Создать project_key
    import re
    project_name = str(row.get("name") or "")
    project_key = re.sub(r'[^\w\-]', '_', project_name.lower())[:50] or project_id[:8]
    
    # Инициализировать логи
    log_svc = ProjectLogService()
    metadata = {
        "owner": row.get("owner"),
        "methodology": row.get("methodology"),
        "status": row.get("status"),
        "description": row.get("description")
    }
    
    result = await log_svc.init_logs(
        project_id,
        project_name,
        project_key,
        request.template,
        metadata
    )
    
    if not result.get("ok"):
        raise HTTPException(status_code=500, detail=result.get("error", "Init failed"))
    
    # Обновить paths в БД
    await db.execute(sa_text(
        "update projects set log_operational_path=:op, log_extended_path=:ex, updated_at=now() where id=cast(:id as uuid)"
    ), {"op": result["paths"]["operational"], "ex": result["paths"]["extended"], "id": project_id})
    await db.commit()
    
    return {"ok": True, "paths": result["paths"]}


@router.get("/{project_id}/logs/operational")
async def read_operational_log(
    project_id: str,
    db: AsyncSession = Depends(get_async_db),
    x_telegram_user_id: Optional[str] = Header(None)
):
    """
    GET /api/admin/projects/:project_id/logs/operational
    
    Прочитать operational log (Level 1 context)
    """
    # RBAC check
    if x_telegram_user_id:
        await require_permission("soul.admin", x_telegram_user_id, db)
    
    # Получить project_key
    from sqlalchemy import text as sa_text
    row = (await db.execute(sa_text(
        "select name from projects where id=cast(:id as uuid)"
    ), {"id": project_id})).first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    import re
    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or project_id[:8]
    
    # Прочитать operational
    log_svc = ProjectLogService()
    result = await log_svc.read_operational(project_key)
    
    if not result.get("ok"):
        raise HTTPException(status_code=404, detail=result.get("error", "Not found"))
    
    return result


@router.get("/{project_id}/logs/extended")
async def read_extended_log(
    project_id: str,
    section: Optional[str] = None,
    db: AsyncSession = Depends(get_async_db),
    x_telegram_user_id: Optional[str] = Header(None)
):
    """
    GET /api/admin/projects/:project_id/logs/extended?section=<section>
    
    Прочитать extended log (Level 2 context)
    section: all (default), history, adr, diagrams, incidents
    """
    # RBAC check
    if x_telegram_user_id:
        await require_permission("soul.admin", x_telegram_user_id, db)
    
    # Получить project_key
    from sqlalchemy import text as sa_text
    row = (await db.execute(sa_text(
        "select name from projects where id=cast(:id as uuid)"
    ), {"id": project_id})).first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    import re
    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or project_id[:8]
    
    # Прочитать extended
    log_svc = ProjectLogService()
    result = await log_svc.read_extended(project_key, section)
    
    if not result.get("ok"):
        raise HTTPException(status_code=404, detail=result.get("error", "Not found"))
    
    return result


@router.post("/{project_id}/logs/operational/update")
async def update_operational_log(
    project_id: str,
    request: LogUpdateOpRequest,
    db: AsyncSession = Depends(get_async_db),
    x_telegram_user_id: Optional[str] = Header(None)
):
    """
    POST /api/admin/projects/:project_id/logs/operational/update
    
    Добавить шаг в operational log (с auto-trim до 5)
    """
    # RBAC check
    if x_telegram_user_id:
        await require_permission("soul.admin", x_telegram_user_id, db)
    
    # Получить project_key
    from sqlalchemy import text as sa_text
    row = (await db.execute(sa_text(
        "select name from projects where id=cast(:id as uuid)"
    ), {"id": project_id})).first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    import re
    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or project_id[:8]
    
    # Обновить operational
    log_svc = ProjectLogService()
    result = await log_svc.update_operational(
        project_key,
        request.step_title,
        request.step_result,
        request.files,
        request.step_status
    )
    
    if not result.get("ok"):
        raise HTTPException(status_code=500, detail=result.get("error", "Update failed"))
    
    return result


@router.post("/{project_id}/logs/extended/update")
async def update_extended_log(
    project_id: str,
    request: LogUpdateExtRequest,
    db: AsyncSession = Depends(get_async_db),
    x_telegram_user_id: Optional[str] = Header(None)
):
    """
    POST /api/admin/projects/:project_id/logs/extended/update
    
    Добавить контент в extended log (section: history/adr/diagrams/incidents)
    """
    # RBAC check
    if x_telegram_user_id:
        await require_permission("soul.admin", x_telegram_user_id, db)
    
    # Получить project_key
    from sqlalchemy import text as sa_text
    row = (await db.execute(sa_text(
        "select name from projects where id=cast(:id as uuid)"
    ), {"id": project_id})).first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    import re
    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or project_id[:8]
    
    # Обновить extended
    log_svc = ProjectLogService()
    result = await log_svc.update_extended(
        project_key,
        request.section,
        request.content
    )
    
    if not result.get("ok"):
        raise HTTPException(status_code=500, detail=result.get("error", "Update failed"))
    
    return {"ok": True}


@router.post("/{project_id}/logs/rotate")
async def rotate_project_logs(
    project_id: str,
    request: LogRotateRequest,
    db: AsyncSession = Depends(get_async_db),
    x_telegram_user_id: Optional[str] = Header(None)
):
    """
    POST /api/admin/projects/:project_id/logs/rotate
    
    Ротация: перенести шаги из operational в extended, очистить operational
    """
    # RBAC check
    if x_telegram_user_id:
        await require_permission("soul.admin", x_telegram_user_id, db)
    
    # Получить project_key
    from sqlalchemy import text as sa_text
    row = (await db.execute(sa_text(
        "select name from projects where id=cast(:id as uuid)"
    ), {"id": project_id})).first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    
    import re
    project_key = re.sub(r'[^\w\-]', '_', str(row[0] or "").lower())[:50] or project_id[:8]
    
    # Ротация
    log_svc = ProjectLogService()
    result = await log_svc.rotate_logs(project_key, request.next_task)
    
    if not result.get("ok"):
        raise HTTPException(status_code=500, detail=result.get("error", "Rotation failed"))
    
    # Обновить timestamp в БД
    await db.execute(sa_text(
        "update projects set log_last_rotated_at=now(), updated_at=now() where id=cast(:id as uuid)"
    ), {"id": project_id})
    await db.commit()
    
    return result

