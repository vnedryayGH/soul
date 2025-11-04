from __future__ import annotations

from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class PersonaIn(BaseModel):
    display_name: str
    is_external: bool = False
    vendor_id: str | None = None
    contract_id: UUID | None = None
    role: str | None = None
    skills: list[str] | None = None
    grade: str | None = None
    kpi: dict[str, Any] | None = None
    rbac: list[str] | None = None
    scope: dict[str, Any] | None = None
    quotas: dict[str, Any] | None = None
    schedules: list[dict[str, Any]] | None = None


class PersonaOut(PersonaIn):
    id: UUID


class TeamIn(BaseModel):
    name: str
    description: str | None = None


class TeamOut(TeamIn):
    id: UUID


class ContractIn(BaseModel):
    team_id: UUID | None = None
    vendor: str | None = None
    sla: dict[str, Any]
    schedule: dict[str, Any]


class ContractOut(ContractIn):
    id: UUID


class HRDocumentIn(BaseModel):
    persona_id: UUID
    kind: str
    title: str
    mime: str
    storage_ref: str
    hash: str
    version: int = Field(ge=1)


class HRDocumentOut(HRDocumentIn):
    doc_id: UUID


class DossierUpdate(BaseModel):
    grade: str | None = None
    skills: list[dict[str, Any]] | None = None
    documents: dict[str, Any] | None = None
    history_append: list[dict[str, Any]] | None = None


class RoutineIn(BaseModel):
    name: str
    params: dict[str, Any] | None = None


class RoutineOut(RoutineIn):
    id: UUID


class OperatorActionIn(BaseModel):
    action: str
    payload: dict[str, Any] | None = None
    two_keys: dict[str, Any] | None = None
