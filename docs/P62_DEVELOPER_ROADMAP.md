# P62 — Дорожная карта разработчика (Developer Roadmap)

Версия: v1.0
Назначение: обеспечить детерминированную реализацию P62 с чётким фокусом, чекпойнтами возобновления и смок‑автотестами. Стиль — enterprise (строгий, высокое data‑density), без «игровых» элементов.

## 0) Scope и принципы

- Scope v1: HR (позиции/орг‑единицы/назначения/смены/табель/отпуска/командировки/KPI/оценки), External Workforce (контракты/команды/расписания/репорты), UI «Город Soul» (enterprise), WS feed, Observability.
- Не в scope v1: сложные финмодели payroll/налоги, сложные SCIM/SSO (только read‑only интеграция, если требуется), ML‑оценки персон.
- Принципы: P27 подписи, P44 Two‑Keys, P28 флаги, RBAC, конфиги/секреты только через `SoulSettingsService`/`SecretsService`.

## 1) Архитектурные зависимости (реюз)

- Processor Dashboard API: `/api/admin/soul/processor/*` — есть; реюз для наблюдаемости.
- Cursor Router (P67) — готов; использовать для «digital_agent.*» персон (в дальнейшем).
- Инспекторы/DSL: реестр INSPECTOR.RUN, FLAGS.*, MIGRATIONS.* — использовать для смоков/гейтов.

## 2) Фазы реализации (чёткие границы)

- Фаза -1 — Merge/Recovery
  - Следовать docs/P62_BRANCH_MERGE_PLAN.md; создать тег `p62-merge-baseline`.
  - Запустить смоки и pytest; установить `FLAGS.SET state.p62.phase=-1`.

- Фаза 0 — Preflight/Стабилизация
  - Уточнить версии Python/Node и окружение. Проверка `/api/health`, `/openapi.json`, `/api/routes`.
  - Принять OpenAPI фрагменты (docs/P62_OPENAPI_SPEC_v1.yaml) как контракт v1.
  - Чекпойнт: `state.p62.phase=0-ok`.

- Фаза 1 — БД и миграции (External)
  - Применить Alembic `p62_external_*_v1` (contracts/personas/teams/team_members/billing_events).
  - Инспекторы: `db.alembic.heads_enforcer`, `MIGRATIONS.STATUS`.
  - Чекпойнт: `state.p62.db.external=head`

- Фаза 2 — REST (External/Personas/HR base)
  - Довести стабы `/api/admin/personas`, `/api/admin/external/*`, `/api/admin/hr/document` до контрактов OpenAPI (минимальные CRUD/валидации, RBAC, ошибки формата `{code,message,details?}`).
  - Добавить HR базовые: `/api/admin/hr/positions|org_units|assignments|shifts|leave|trips|kpi|performance` (минимум read/write, где указано).
  - Чекпойнт: `state.p62.rest.core=v1`

- Фаза 3 — WS feed
  - Реализовать фильтры `topics`, дросселирование, метрики `ws_events_sent_total/ws_events_dropped_total/ws_latency_ms_p95`.
  - Подключить события processor/inspector/incident + hr.* (см. §6.B P62 ТЗ). 
  - Чекпойнт: `state.p62.ws=v1`

- Фаза 4 — Finance/Billing отчёты
  - `/api/admin/external/reports` (already stub) и `/api/admin/hr/payroll/report` (агрегаты за период, маскирование PII).
  - Чекпойнт: `state.p62.finance=v1`

- Фаза 5 — UI «Город Soul» (enterprise)
  - Вкладка `/soul/city`: районы, список, карточки сущностей (персона/команда/контракт/подразделение) с вкладками (Summary/KPI/RBAC/Документы/Расписание/Инциденты/История).
  - SLA подсветка, мини‑карта, пресеты камер (2D→3D по готовности, Babylon.js — отдельный флаг).
  - Чекпойнт: `state.p62.ui.city=v1`

- Фаза 6 — Наблюдаемость и инспекторы
  - Инспекторы из docs/P62_ACCEPTANCE_AND_INSPECTORS.md — зелёные.
  - Dashboard метрики и алерты, негативные смоки.
  - Чекпойнт: `state.p62.observability=v1`

- Фаза 7 — Документация/Приёмка
  - Обновить P62 ТЗ (разделы 5.A/5.B/6.A/6.B/7.B/8.*), OpenAPI, тест‑план. 
  - Финальные смоки и freeze.
  - Чекпойнт: `state.p62.done=true`

## 3) Чекпойнты возобновления

- Файл состояния (лог/kv): хранить ключи `state.p62.*` через FLAGS (например, `FLAGS.SET key=state.p62.phase value=3`).
- Каждый шаг фиксировать в operational log (§0.C в P62) командой DSL `PROJECT.LOG.UPDATE_OP`.
- Возобновление: агент читает `FLAGS.STATE`, сравнивает с чекпойнтами и продолжает с ближайшего незавершённого.

## 4) Контракты и валидация

- Источник правды: docs/P62_OPENAPI_SPEC_v1.yaml + P62 ТЗ раздел §6.
- Валидация на dev: `curl /openapi.json` + linters (openapi‑lint/stoplight, при наличии).
- Ошибки: единый формат `{ code, message, details? }`, коды 400/401/403/404/409/429/500/503.

## 5) Автотесты и смоки

- Смоки скрипты: `scripts/p62_smoke.ps1`, `scripts/p62_smoke.sh` (HTTP/WS), инспекторы DSL (docs/P62_ACCEPTANCE_AND_INSPECTORS.md).
- Юнит/контракт‑тесты (при добавлении): pytest для REST (jsonschema по OpenAPI), aiohttp/ws для WS feed.
- Репорты: сохранять JSON ответов в `out/p62_smoke_*`.

## 6) Политики/Безопасность

- RBAC: маршруты `/api/admin/*` — роль `soul.admin`.
- Two‑Keys: `operator.action` (evacuate/escalate) и критичные шаги процессов.
- PII: маскирование в выгрузках; экспорт CSV/PDF под фильтрами и лимитами.

## 7) Риски и откат

- Миграции: только Alembic, idempotent, IF NOT EXISTS, последовательные ревизии.
- Откат: для схем v1 — без drop в downgrade (PROD‑safe), только forward‑fix.
- WS: защита от перегрузки (rate limit, backpressure), отключаем по флагу.

## 8) Интеграция с существующими модулями

- Реестр инспекторов и Hyperloop CLI — основной путь смоков.
- Processor метрики — источники для WS и UI KPI.
- Cursor Router — учесть роль digital_agent.* в будущих расширениях (без блокировки v1).

## 9) DoD по фазам (Definition of Done)

- Фаза 1: ревизии применены; INSPECTOR.RUN heads_enforcer — ok.
- Фаза 2: REST виден в OpenAPI; позитивные/негативные смоки → 200/4xx; формат ошибок соблюдён.
- Фаза 3: WS подключается, фильтры работают, метрики публикуются; p95 в бюджете.
- Фаза 4: отчёты отдают агрегаты и проходят маскировку PII.
- Фаза 5: UI доступен, карточки отражают поля, фильтры/поиск работают.
- Фаза 6: все инспекторы зелёные; алерты настроены; негативные смоки ожидаемо 4xx/429.
- Фаза 7: доки обновлены, Roadmap и Test Plan в актуальном состоянии, state.p62.done=true.
