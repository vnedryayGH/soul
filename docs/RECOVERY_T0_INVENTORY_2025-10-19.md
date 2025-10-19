# P63 Recovery — T0 Инвентаризация (2025-10-19)

## Обзор
- Цель: зафиксировать текущее состояние исходников/артефактов и источники для восстановления.
- Контекст: ветка `p63r-recovery` активна; выполнен быстрый merge `soul#5` (squash) с последующим возвратом защиты `main`.

## Просмотренные источники
- Локальный репозиторий: `backend/app/**`, `docs/**`, `scripts/**`.
- Бэкапы/артефакты в рабочем каталоге:
  - `backup_prod_20250912_162634.dump`
  - `backend_deploy.tgz`, `backend_deploy_phi.zip`
  - `out_pr_bundle/0001-feat-fe-build-hygiene.patch`, `out_pr_bundle/fe-build-hygiene-files.zip`
  - каталоги восстановления: `backups/restore_*/**`, `Server-TMP/pull_prod/**`

## Приоритетные модули (наличие)
- Routers (`backend/app/routers/*`):
  - present: `github_proxy.py`, `dev_access_admin.py`, `soul_admin.py`
  - missing: —
- Services (`backend/app/services/*`): present —
  - `soul_settings_service.py`, `secrets_service.py`, `hyperloop_engine.py`, `signature_sdk.py`
- Entry point: present — `backend/app/main.py`
  - Регистрация роутеров подтверждена: `dev_access_admin`, `github_proxy` подключены в `backend/app/main.py` (обёрнуты в try/except с логированием).

Примечание: копии вышеуказанных файлов также присутствуют в:
- `backups/restore_20251019_133405/backend/app/...`
- `Server-TMP/pull_prod/backend/app/...`

## Несоответствия/отсутствующие файлы (DoD T0)
- Не выявлено критичных отсутствий в целевых модулях Dev Access/GitHub Proxy.

## Карта восстановления (источники → целевые пути)
- Router `dev_access_admin.py`:
  - Не требуется восстановление — файл присутствует в репозитории и зарегистрирован в `backend/app/main.py`.

## Документация/Эталон
- Эталон структуры: `docs/PROJECT_STRUCTURE.md` (в наличии)
- Индекс документации: `docs/DOCUMENTATION_INDEX_v4_2.md` (в наличии)

## Инспекторы (последний запуск)
- passed: `guard.canonical.urls`, `guard.delivery.enforceable`, `signature.required_steps.consistency`, `rs.actor.budgets` и др.
- failed/warn:
  - `channel.agent.smoke`: No module named `app.feature_plugins.channel_agent_smoke`
  - `diamond.pipeline.health`: pending=101560, processed=0
  - `p47_webauth_health`: JSON parse error
  - `rs_trace_linking`: linked_ratio=0.0

## Следующие шаги (T1/T2 кратко)
- T1: восстановить отсутствующие роутеры (приоритет: `dev_access_admin.py`), верифицировать импорты; при необходимости — пересобрать `.venv` и поставить зависимости.
- T2: проверить наличие/здоровье `systemd` и `nginx` на APP1/APP2; подготовить `.env.prod`.

# Дельты (P63, 2025-10-19)

- RBAC:
  - Приведено `admin_only` к требованию права `soul.admin` (наследование ролей сохранено).
  - Подключение GitHub Proxy не требует рестартов после деплоя.

- CI/Required checks:
  - Обновлены workflows: `branch_name.yml` (единая политика), `ci.yml` (lint/types/tests/coverage), `codeql.yml` (матричный Python/JS), `schema-guard.yml` (safe‑skip при отсутствии скрипта).
  - Список контекстов для защиты веток синхронизирован (см. RUNBOOK_GITHUB_PR_FLOW.md).

- GitHub Proxy/Webhook:
  - Роутеры подключены в бэкенде: `/api/admin/github/*`, `/webhook/github`.
  - PROD сейчас 404 — ожидается после выката на APP сервера (systemd reload). После выката — выполнить Redeliver вебхука.


