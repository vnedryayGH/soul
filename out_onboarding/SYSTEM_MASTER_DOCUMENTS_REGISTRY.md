# SYSTEM MASTER DOCUMENTS REGISTRY

Last update: 2025-10-17 (RS Security Limits: admin route enabled; alert RSLimitsSpike429 documented)

## P62 — Admin/Edge readiness and smoke results
- Edge OpenAPI available at `/api/openapi.json`; routes introspection at `/api/debug/routes`.
- Smoke results (PROD edge, header `X-Telegram-User-ID: 468326902`, file-based bodies only):
  - Personas: POST 200 (minimal `{ display_name, description }`), GET by id works via edge router; list may be filtered.
  - Teams/Contracts/Reports: POST team 200; POST contract 200 with `{ name, sla, schedule }`; GET `/api/admin/external/reports` 200.
  - HR: POST `/api/admin/hr/document` 200 with required fields `{ persona_id, title, kind, mime, storage_ref, hash, version }`.
  - Operator: `/api/admin/operator/action` — `action=escalate` requires Two-Keys; negative 403 without approval; positive 200 with approved `two_keys.request_id`.

## Inspectors (mandatory gates)
- `INSPECTOR.RUN key=migration.guard` — must be passed pre-deploy (heads=1; no blank/broken migrations; DB at head).
- `INSPECTOR.RUN key=guard.canonical.urls` — passed (no hardcoded URL/port patterns outside whitelisted docs/tests).

## CLI/Process policy (Edge)
- Use Hyperloop CLI (`Soul/scripts/hyperloop_cli.py`) for: claim/release branch, inspectors, MIRROR.
- PowerShell policy: no inline JSON in `-Body`; use file-based bodies and `curl.exe --data-binary @file` for REST fallbacks.
- Two-Keys: dangerous ops require approval via `TWO_KEYS.REQUEST` + `TWO_KEYS.APPROVE` or `FLAGS.SET key=two_keys.approved.<id> value=true`.

Links:
- `CURSOR_AGENT_SYSTEM_PROMPT_EN.md` / `CURSOR_AGENT_SYSTEM_PROMPT_EN-arh.md` — updated with P62 CLI/Edge policy and inspector gates.
- `Soul/P62_TZ_Soul_Visual_HR_Simulation_v1_0.md` — Acceptance & Operational requirements updated.
- `docs/PROJECT_STRUCTURE.md` — P62 admin endpoints reflected.
- `docs/ops_disk_cleanup_2025-10-17.md` — Отчёт и регламент по чистке диска, таймерам и ротации логов.

## P63 — Onboarding внешних разработчиков (RBAC/онбординг/реестры/напоминания)
- ТЗ: `Soul/P63_TZ_Soul_External_Developers_Onboarding_v1_0.md`
- Инструкция разработчика: `Soul/P63_Onboarding_Developer_Instructions_v1_0.md`
- Урезанные правила: `Soul/cursorrules_external_v1_0.md`
- Шаблоны: `Soul/templates/P63_Template_Project_Registry_v1_0.md`, `Soul/templates/P63_Template_Change_Request_v1_0.md`
- Скрипты: `Soul/scripts/dev_invite_generate.py`, `Soul/scripts/dev_onboarding_client.py`, `Soul/scripts/roles_editor_cli.py`
- Серверная структура: `Soul/P63_APP_Server_Structure_v1_0.md`
- Напоминания/CR флоу: `Soul/P63_Reminders_And_ChangeFlow_Spec_v1_0.md`
- Единая рабочая зона P63: фронтенд‑сервер (APP2). Все операции онбординга, реестра и SLA‑таймера выполняются только там; дублирование рабочих каталогов на других серверах запрещено.
- Роли (ключи): `ext_frontend_dev`, `ext_integration_dev`, `ext_channel_dev`, `ext_soulpulse_dev`; политика Key Master: только `dev.*` и `bot.token.<tg_id>` для внешних ролей.

