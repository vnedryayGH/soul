# P62 — Acceptance & Inspectors (v1)

## 1) Acceptance (Dev environment)

- OpenAPI: новые маршруты видны в `/openapi.json` и `/api/routes`.
- RBAC: админские маршруты требуют `X-Telegram-User-ID` (allowlist) и роль `soul.admin`.
- WS feed: `/api/visualization/feed` — подключение, фильтр `topics` работает, heartbeat стабилен.
- Personas/External/HR: CRUD базовых сущностей, отсутствие 500/5xx при стандартных сценариях.
- Finance: `/api/admin/external/reports`, `/api/admin/hr/payroll/report` возвращают агрегаты (read‑only v1).
- Observability: метрики p95/drops для WS видны; Processor dashboard API доступен.
- Security: отсутствие секретов/URL вне `SecretsService`/`SoulSettingsService`; PII маскирование в экспортных отчётах.

## 2) Smoke‑набор (HTTP)

- Health/openapi:
  - GET /api/health → 200
  - GET /openapi.json → 200
  - GET /api/routes → содержит новые пути `/api/admin/hr/*`, `/api/admin/external/*`, `/api/admin/personas/*`
- Personas/HR:
  - GET /api/admin/personas → 200, items[]
  - POST /api/admin/hr/positions { name } → 200
  - GET /api/admin/hr/positions → содержит созданную позицию
  - POST /api/admin/hr/org_units { name } → 200
  - POST /api/admin/hr/assignments { persona_id, starts_at } → 200
  - POST /api/admin/timesheet/record { persona_id, period, hours } → 200
- Finance:
  - GET /api/admin/external/reports?contract_id={uuid}&from=YYYY-MM-DD&to=YYYY-MM-DD → 200, items[]
  - GET /api/admin/hr/payroll/report?from=YYYY-MM-DD&to=YYYY-MM-DD → 200, totals
- WS:
  - WS /api/visualization/feed?topics=actor.state,processor.step,hr.timesheet.submitted → принимает соединение; в течение 60s нет ошибок.

## 3) Inspectors DSL (Hyperloop)

- INSPECTOR.RUN key=registry_guard → новые роуты в реестре
- INSPECTOR.RUN key=delivery_guard.smoke → подпись цепочки на ключевых путях
- INSPECTOR.RUN key=db.alembic.heads_enforcer → один head, расхождений нет
- INSPECTOR.RUN key=db.health → ok
- INSPECTOR.RUN key=migration.lint → предупреждения по стилю миграций (tuple parents, batch_ops, unique/index)
- INSPECTOR.RUN key=schema.drift → отсутствие дрейфа ORM↔DB (таблицы/колонки)
- INSPECTOR.RUN key=dq.core → базовые DQ‑тесты (unique/orphans)
- INSPECTOR.RUN key=data.duplicates → отчёт по дублям (по конфигу ключей)
- INSPECTOR.RUN_ALL scope=db → сводный запуск DB Steward инспекторов
- INSPECTOR.RUN key=diamond.pipeline.health → ok
- INSPECTOR.RUN key=guard.canonical.urls → ok

Алиасы (короткие DB.* команды для агентов):

- DB.HEALTH.SUMMARY → эквивалент INSPECTOR.RUN key=db.health
- MIGRATIONS.PREFLIGHT → сводка migration.lint + db.alembic.heads_enforcer
- SCHEMA.DRIFT → эквивалент INSPECTOR.RUN key=schema.drift
- DATA.DQ.RUN → эквивалент INSPECTOR.RUN key=dq.core
- DATA.DUPLICATES.SCAN → эквивалент INSPECTOR.RUN key=data.duplicates
- MIGRATIONS.APPLY revision=head two_keys_request_id="<UUID>" → локальный Alembic apply после Two‑Keys
- DATA.DEDUPE.FIX.DRY_RUN / DATA.DEDUPE.FIX.APPLY (с Two‑Keys) → план/применение дедупликации

## 4) Наблюдаемость (P27/P29)

- Метрики WS:
  - ws_events_sent_total, ws_events_dropped_total, ws_latency_ms_p95
- Processor dashboard:
  - /api/admin/soul/processor/metrics доступно; e2e_p95, incidents_rate

## 5) Негативные проверки

- RBAC: без заголовка `X-Telegram-User-ID` ожидается 401/403
- Limits: при превышении квоты — 429 (если включены политики limits)
- Operator action без Two‑Keys для `evacuate|escalate` → 403
