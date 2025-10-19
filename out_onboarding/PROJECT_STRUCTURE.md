# PROJECT_STRUCTURE v8.2.0 (consolidated)

РЎРѕР±СЂР°РЅРЅР°СЏ РІРµСЂСЃРёСЏ РѕС‚ 2025-10-08 21:22 UTC. РћР±СЉРµРґРёРЅСЏРµС‚ v8.1.7 + v8.0.4 + unversioned. РџСЂРёРѕСЂРёС‚РµС‚ Сѓ Р±РѕР»РµРµ РЅРѕРІРѕР№ РІРµСЂСЃРёРё.

---

# PROJECT_STRUCTURE v8.1.7

## DB Master Consolidation (P41)

- Единый мастер БД (APP2), DSN централизовано из `SoulSettingsService`/`SecretsService`.
- Диагностика: `pg_stat_statements` + fallback `pg_stat_activity`; эндпоинты `/api/admin/db/*`.
- DB Governor: политика таймаутов, idle‑killer; фоновые сервисы включены в lifecycle.
- AGE/Links: `QLinksSupervisorService` поддерживает дедуп/проекцию; инвариант типа связи `COALESCE(connection_type::text,'semantic')`.
- Документ ТЗ: `Soul/P41_TZ_DB_Master_Consolidation_v1_0.md` (заменяет P51/P41/P52 и ops single‑host doc).

## P40 — Методологии/Планы/Навыки (M04..M18)

- M04 Kanban Flow:
  - Генерация: `scripts/generate_m04_examples.py` → `data/methodology_examples_M04_detailed_01..12.jsonl`, агрегатор `data/methodology_examples_M04_12.jsonl`.
  - Инжест: `scripts/ingest_plans_and_skills_jsonl.py` (batch=10); метрики: `/api/admin/qlinks/coverage|dedup|project-connections` (fact: dedup=0, inserted=2).
  - Skills: `scripts/gen_skills_exemplars.py` → импорт `scripts/import_skills_jsonl.py`.
  - Автолинковка: `scripts/batch_link_quants_for_prefix.py --prefix "M04 " --take-per-project 100`.
  - Инспектор: `INSPECTOR.RUN key=planning.enforce` — ok.

- M05 Lean Delivery:
  - Генерация: `scripts/generate_m05_examples.py` → `data/methodology_examples_M05_12.jsonl`.
  - Инжест/метрики: как для M04 (fact: dedup=0, inserted=2).
  - Skills/автолинковка: общий процесс (100/проект; итого 1200 связей)
  - Инспектор: ok.

- M06..M18 — универсальный контур:
  - Генерация: `scripts/generate_mxx_examples.py --code MXX --methodology <KEY> --label <LBL> --out data/methodology_examples_MXX_12.jsonl`.
  - Инжест: `scripts/ingest_plans_and_skills_jsonl.py` (batch=10, retries/timeout настроены).
  - Метрики: `/api/admin/qlinks/coverage`, `dedup` (ожидаем `duplicate_groups_left=0`), `project-connections` (ожидаем `inserted≥1`).
  - Skills: `scripts/gen_skills_exemplars.py` + `scripts/import_skills_jsonl.py`.
  - Автолинковка: `scripts/batch_link_quants_for_prefix.py --prefix "MXX " --take-per-project 100`.
  - Инспектор: `INSPECTOR.RUN key=planning.enforce` — ok.

- Авто‑оркестрация M06..M18: `scripts/orchestrate_m06_m18.py` — выполняет весь цикл для каждой методологии по очереди.

### Покрытие методологий M06–M18 (инжест→метрики→skills→линковка)

| Методология | Инжест (12 примеров) | Dedup (duplicate_groups_left) | Project‑connections.inserted | Skills import | Автолинковка (100/проект) |
|---|---:|---:|---:|---:|---|
| M06 | OK | 0 | 2 | OK | OK |
| M07 | OK | 0 | 2 | OK | OK |
| M08 | OK | 0 | 2 | OK | OK |
| M09 | OK | 0 | 2 | OK | OK |
| M10 | OK | 0 | 2 | OK | OK |
| M11 | OK | 0 | 2 | OK | OK |
| M12 | OK | 0 | 2 | OK | OK |
| M13 | OK | 0 | 2 | OK | OK |
| M14 | OK | 0 | 2 | OK | OK |
| M15 | OK | 0 | 2 | OK | OK |
| M16 | OK | 0 | 2 | OK | OK |
| M17 | OK | 0 | 2 | OK | OK |
| M18 Agile | OK | 0 | 2 | OK | OK |
| M18 SRE | OK | 0 | 2 | OK | Пропущено (пул квантов пуст) |

Примечание: для M18 SRE автолинковка будет повторена после пополнения пула QUANT.SEMANTICS.

---

# Структура проекта SoulPulse (v8.1.0)

Назначение: единая карта модулей, цепочек данных, интерфейсов и документов. Версия 8.1.0 фиксирует актуальные изменения (инспекторы/RS/персоналии), объединяя содержание прежних версий без потери информации.

---

## Дополнение 2025‑09‑29 — Надзор фоновых процессов (P29)

- DEV/Windows окружение:
  - Супервизор фоновых задач: `scripts/bg_supervisor.ps1` (логи `logs/bg_supervisor.log`, события `logs/bg_supervisor_events.jsonl`, снапшот планировщика `logs/bg_tasks_snapshot.txt`).
  - Монитор PROD без окон: `scripts/monitor_prod_services.ps1` → файлы `logs/app_backend_journal.log`, `logs/app_nginx_{access,error}.log`, `logs/db_postgresql.log`, `logs/health_monitor.log`.
  - Страж окон: `scripts/console_window_guard.ps1` (подавление не‑whitelist окон `cmd.exe`/`powershell.exe`).
  - Страж окон: `scripts/console_window_guard.ps1` (подавление не‑whitelist окон `cmd.exe`/`powershell.exe`), поддержка чёрного списка и правил `logs/window_guard_rules.json`; события пишутся в `logs/bg_supervisor_events.jsonl`.
  - Тихий цикл стража: `scripts/console_window_guard_loop.ps1` — скрытый запуск каждые ~15с; управляется супервизором.
  - Планировщик задач: `\\SoulBgSupervisor` (1м), `\\SoulCoverageFast` (2м), `\\ConsoleWindowGuard` (1м) — все скрытно под SYSTEM.

### PROD (Linux) — таймеры и скрипты

- Юниты и таймеры:
  - `soul-coverage-fast.service` + `soul-coverage-fast.timer` — выборочный Coverage ссылок из `Soul/out/qc` каждые 2 минуты; лог: `/var/www/soulpulse/Soul/out/logs/links_coverage_fast.log`; запуск скрипта `/var/www/soulpulse/scripts/coverage_fast.sh`.
  - `soul-guardian-health.service` + `soul-guardian-health.timer` — health/db проверки каждую минуту; лог: `/var/log/soulpulse/guardian_health.log`; запуск `/var/www/soulpulse/scripts/guardian_health.sh`.
- Скрипты:
  - `/var/www/soulpulse/scripts/coverage_fast.sh` — авто‑выбор venv, запуск `verify_quants_links_coverage.py`.
  - `/var/www/soulpulse/Soul/scripts/verify_quants_links_coverage.py` — нормализация путей Windows/Linux, ленивая привязка пар `good↔qc_report`.
  - `/var/www/soulpulse/scripts/fetch_qc_artifacts.py` — загрузка QC артефактов из PROD и распаковка.
- Runbook: `docs/COVERAGE_AND_GUARDIAN_RUNBOOK_v1_0.md`.

---

## Observability / Incidents (P50)

- Grafana дашборд инцидентов: `/d/eezmrnkpk5edca/incidents-dashboard`
  - Заголовок: Incidents Overview
  - Источник метрик: `/api/metrics/prometheus`
- Alertmanager маршрутизация:
  - Файл: `/etc/alertmanager/alertmanager.yml`, основная ветка `route.receiver = telegram`
  - PROD инстанс работает в Docker на `:9093`; systemd unit `alertmanager.service` отключён (во избежание дублирования). Перезапуск: `docker restart alertmanager`.
  - Проверки:
    - Readiness: `curl -s http://127.0.0.1:9093/-/ready`
    - Статус: `curl -s http://127.0.0.1:9093/api/v2/status`
  - Шаблон Telegram‑сообщения (единый):

  ```text
    {{ .CommonLabels.alertname }} ({{ .Status | toUpper }})
    Severity: {{ .CommonLabels.severity }}
    {{- range .Alerts }}- {{ .Annotations.summary }}{{ if .Annotations.description }} — {{ .Annotations.description }}{{ end }}
    {{- end }}

  ```

  - Подмаршруты autoscale (team=processor):
    - `receiver: autoscale_warning` ← matchers `[team=processor, severity=warning]`
    - `receiver: autoscale_critical` ← matchers `[team=processor, severity=critical]`
  - Smoke‑процедура отправки алерта: см. `docs/ALERTS_AND_ROUTES_REGISTRY_v1_0.md`.
- Processor (P30) дополнения:
  - Sequential режим: `processor.batch_mode.sequential=true`, коммиты батча каждые `processor.batch_commit_size` (дефолт 20).
  - Redis буфер `proc:batch_buf:<PROCESSOR_NODE_ID>`, TTL=3600; метрика `processor_batch_buf_len` и алерт `ProcessorBatchBufferLenHigh`.
  - WRR ребаланс: `POST /api/admin/soul/processor/kind_shares/rebalance` (persist в `processor.node.kind_shares` и `processor.kind_priority.<kind>`).
  - Per‑kind лимиты: `POST /api/admin/soul/processor/limits/set` с ключами `processor.kind_limits.<kind>.{max_concurrency,rps,timeout_ms,p95_budget_ms}`.
  - Aux LLM (phi): локальные `retries` и кламп таймаута (500..60000 мс) в `backend/app/services/llm_client.py`.
- Nginx метрики и проверка SNI:
  - PROD конфиг: `deploy/nginx/03-mini_soulpulse.conf` содержит блок `location = /metrics` → прокси на `/api/metrics/prometheus`
  - Проверка с SNI (локально на сервере):
    - `curl --resolve mini.soulpulse.art:443:127.0.0.1 https://mini.soulpulse.art/metrics`

### Обновление 2025‑10‑17 — DSN/P47/RS‑linking

- DSN БД обновлён на `46.173.24.4:5432` (подтверждено в PROD ENV `DATABASE_URL`), health API через Nginx 200.
- P47: инспектор устойчив к пустым телам ответов, домен cookie берётся из ключа `webauth.cookie_domain` в БД (fallback `.soulpulse.art`).
- RS‑linking: фасад Hyperloop пробрасывает `meta.rs_trace_id` и `results[].data.trace_id` при ответах RS, а админ‑роут сохраняет RS‑шаги по тому же `trace_id`.
- Инспектор `rs_trace_linking` учитывает `svc.soul.router_decide` и окно до 2 часов.

## P40 — Project Log & Methodology (шаблон лога, PM‑цикл, RCA, Telegram‑гейт)

Добавлен канонический шаблон проектного лога для всех новых проектов. Шаблон фиксирует структуру разделов и безопасные команды Hyperloop для ведения лога, PM‑цикла и RCA.

Шаблон:

- `Plan/P40_Project_Log_Methodology/PROJECT_LOG_TEMPLATE_v1_0.md`

Ключевые положения:

- Использовать только единый мастер‑реестр: `docs/SYSTEM_MASTER_DOCUMENTS_REGISTRY.md` (без версий).
- Ссылки на структуру проекта: `docs/PROJECT_STRUCTURE.md` (без версий).
- Создание лога: копировать шаблон в `Plan/P40_Project_Log_Methodology/PROJECT_LOG_<PID>.md` и следовать инструкциям внутри.
- Привязка лога к проекту: `PROJECT.LOG.SET id="<PID>" path="Plan/P40_Project_Log_Methodology/PROJECT_LOG_<PID>.md"`.
- Telegram‑уведомления и гейт закрытия: при `PROJECT.CREATE`/активации — уведомление Архитектору; при переводе в `archived|closed` требуется подтверждение Архитектора (inline‑кнопка → callback), флаг `project.close.confirmed.<PID>=true` в `SoulSettingsService`.
- RCA: обязательный репозиторий RCA (идемпотентный `RCA.SCHEMA.ENSURE`), инспектор `rca.presence` для инцидентов `severity>=medium`, автогенерация `rca.suggest` Процессором при обзоре PM‑инцидентов.
- Наблюдаемость PM‑цикла: правила Prometheus `ops/prometheus/rules_pm_cycle.yml` (очередь, e2e p95, incident rate, derived ETA) с аннотациями `severity`/`risk` и пошаговыми рекомендациями.
- Нормализация Markdown: `DOCS.MD.NORMALIZE path=...` (первый проход — DRY_RUN).
- PM‑цикл: `PM.ASSIGN`, `PM.AGENT.REQUEST`, `PM.TICK`, `PM.INCIDENTS.REVIEW`, `PM.DECISION.SAVE` с безопасной передачей JSON.
- RCA: `RCA.SCHEMA.ENSURE`, `RCA.RECORD.ADD/UPDATE/GET/SEARCH/LIST`; инспектор наличия RCA для инцидентов `severity ≥ medium`.
- Telegram: уведомление Архитектора при создании/открытии, подтверждение перед закрытием проекта.

### Lessons Learned (LESSONS.*) — автоподбор методологии и база знаний

- Команды (идемпотентные и безопасные):
  - `LESSONS.SCHEMA.ENSURE` — создание схемы репозитория выученных уроков `public.lessons`.
  - `LESSONS.ADD title="..." [summary] [methodology] [risks_json={}] [tags_json=[]] [links_json=[]] [project_id=<uuid>]` — добавление записи.
  - `LESSONS.SEARCH [project_id=<uuid>] [q="text"] [methodology=...] [limit=10]` — поиск релевантных уроков.
- Интеграция с `PROJECT.CREATE`: движок пытается подобрать методологию по последним урокам (`lessons.methodology`) с совпадением по `title|summary` и сохраняет её в поле `projects.methodology` (best‑effort, без блокировки создания проекта). Идентификатор источника (`lesson_id`) фиксируется в `projects.meta.lessons_seed`.
- Инспектор presence: `lessons.presence` — проверяет наличие таблицы и свежих записей; регистрируется через `INSPECTOR.REG_SYNC`.

### RSBus Watchdog / Prometheus правила

- Watchdog:
  - Юниты: `rsbus-watchdog.service` + `rsbus-watchdog.timer` (каждую минуту)
  - Скрипт: `/usr/local/bin/rsbus-watchdog.sh` — проверка UDS `/run/soul/rsbus.dev.sock`, исправление прав каталога `/run/soul` (`root:soulops`, 0770), рестарт `rsbus.service` при проблемах
- Prometheus:
  - Конфиг: `/etc/prometheus/prometheus.yml` (локальный `127.0.0.1:9090`)
  - Правила: `/etc/prometheus/rules/rules_rs_watchdog.yml` (алерты `RSBusSocketMissing`, `RSBusBackpressureOnLong`)
  - Reload: `systemctl restart prometheus` (lifecycle API отключён)

- p95 / Prometheus path — 2025‑10‑06:
  - Источник API Prometheus (APP1): `http://127.0.0.1:9090` (зафиксировано в БД ключом `metrics.prometheus_path`).
  - Внешний экспорт метрик бекенда: `/api/metrics/prometheus` (это не API Prometheus; проксируется через Nginx на бекенд‑экспортер).
  - PromQL p95 per‑kind: `histogram_quantile(0.95, sum(rate(processor_e2e_ms_bucket[5m])) by (le,kind))`.
  - Запись правил: `processor:p95_e2e_ms` и `processor:p95_e2e_ms_all` (см. `/etc/prometheus/rules/rules_processor.yml`, `/etc/prometheus/rules/rules_processor_autoscale.yml`).
  - Панель Grafana: `ops/grafana/rs_age_dashboard.json` — цели используют ту же формулу и переменную `kind`.
  - Регулятор/RS ядро: читают `metrics.prometheus_path` и запрашивают тот же PromQL для p95.
  - Статус на момент проверки: сэмплы `processor_e2e_ms_bucket` отсутствуют → сравнение p95 между правилом/панелью/регулятором отложено (допуск ±2%) до появления трафика.

## Дополнение 2025‑09‑29 — Автоконтроль QC/ingest/link с LLM‑решениями

- Офлайн/фон: `Soul/scripts/bg_qc_supervisor.py` — инжест из канонического `*.good.jsonl` (см. QC отчёты) батч=10; инспекторы `INSPECTOR.RUN_ALL` каждые 1000 вставок; выборочный `QUANT.LINK.CHECK` на последних id.
- LLM‑контур: DeepSeek через `GET /api/admin/soul/llm/test?provider=deepseek&prompt=...` — возвращает JSON `{ action, reason, commands[], question }`. Допустимые `action`: `continue|pause|refine|ask_clarify`.
- Управляющие команды прилагаются в `commands[]` и исполняются через Hyperloop DSL (`/api/hyperloop/execute`).
- Acceptance для контура: инспекторы зелёные; при ошибках — инцидент `supervisor_ingest_error`; вставка в `public`.

Runbook: `docs/LLM_QC_SUPERVISOR_RUNBOOK_v1_0.md`.

## Дополнение 2025‑09‑28 — CI/CD, RBAC и Soak

- CI/CD:
  - Pre‑commit: ruff (lint/format), mypy (types) — см. `.pre-commit-config.yaml`, `pyproject.toml`.
  - GitHub Actions: `ci.yml` (jobs: `lint-and-types`, `backend-schema-guard`, `frontend-build`, `hyperloop-smoke`), `inspectors-smoke.yml`, `p44-rbac-tests.yml`, `generate-indices.yml`.
  - Индексы ENV/API генерируются pre-commit хуком (`scripts/generate_env_index.py`) → `docs/ENV_INDEX.{md,json}`, `docs/API_INDEX.md`.
- RBAC P44:
  - RS‑админ‑роуты защищены глобально `require_permission("soul.admin")` (см. `backend/app/routers/rs_metrics_admin.py`, `rs_nightly_admin.py`, `rs_admin_dashboard.py`).
- Soak (24–48h):
  - Гайд `docs/SOAK_RUNNER_GUIDE_v1_0.md` и эндпоинты `POST /api/admin/rs/soak/start|stop|status`.
- Zero‑downtime релиз:
  - Скрипт `deploy/zero_downtime_release.ps1` — перезапуск сервиса с health‑checks до/после.

---

## Дополнение 2025‑09‑30 — Execute‑Signed, RS Canary, system_api

- Hyperloop HMAC (execute‑signed):
  - В PROD включён путь `POST /api/hyperloop/execute-signed` (HMAC), флаг БД `hyperloop.allow_signed=true`.
  - Секреты в ENV PROD: `HYPERLOOP_API_KEY`, `HYPERLOOP_API_SECRET` (`/var/www/soulpulse/backend/.env.prod`).
  - Практика: формирование подписи `sig = HMAC_SHA256(secret, f"{key}:{ts}:{commands}")`.
  - acceptance: P40 команды (claim_branch / PROJECT.LIST / PLAN.TASK.ADD / planning.enforce) успешно выполнены через execute‑signed.
- RS Canary (P48R):
  - Временное снижение доли канареечной нагрузки: `rs.hyperloop.canary_share=0.05` (применено через `FLAGS.SET`).
  - Цель: снижение p95/5xx в условиях бэкпрешера RS, удержание стабильности.
- system_api:
  - Роутер `system_api` подключается условно по ENV `ENABLE_SYSTEM_API=1` в `backend/app/main.py`.
  - На PROD флаг включён; при импорт‑ошибке выполняется безопасное отключение с лог‑предупреждением (без падения сервиса).
- high‑5xx snapshot (резюме):
  - До изменений: error_rate≈25% (короткое окно, 2/8), ошибки POST `/api/hyperloop/execute` (upstream refused).
  - После: `soulpulse_errors_total=1`, `soulpulse_requests_total=18`, `error_rate≈5.9%` (окно < 10 мин), основная нагрузка переведена на execute‑signed.
  - Nginx: конфиг валиден (`nginx -t ok`); upstream 127.0.0.1:8000 активен; keepalive/таймауты ≥ backend p95.
  - Следующие шаги: удержание api_5xx_rate≤1% ≥20 минут; сбор 3–5 трасс с `trace_id` для топ‑причин.

## Ключевые изменения (дополнение 2025‑09‑15)

- LLM маршрутизация (ТЗ 14):
  - `LLMManager`: выбор маршрутов из `backend/config/llm_routing.yaml`, учёт `locale` (EN → приоритет OpenAI), метрики `llm.route_selected`.
  - `LLMClient`: failover по маршрутам, Circuit Breaker (окно/порог/cooldown, half‑open), метрики `llm.cb_*`, учёт `limits` (rpm/rps/budget) в метриках. Политика актуализирована: сервисные задачи (`reminder`, `planner`, `translator`, `judge`, `ingest`) — первично Aux Phi‑4; фоллбек: DeepSeek (OpenAI при EN). Чат/кванты — первично DeepSeek. Реализовано в `backend/app/services/llm_client.py` (request_type→provider).

---

## Дополнение 2025‑09‑26 — Финализация Data QC/ingest (gen→good, канонический агрегатор)

- Новые служебные скрипты (офлайн, `Soul/scripts`):
  - `merge_gen_into_base_goods.py` — слияние `*.good.gen.jsonl` в базовые `*.good.jsonl` с атомарным бэкапом (`.bak`) и обновлением `*.qc_report.json` (`good_file`, `counts.good`, `sha256_good`).
  - `recompute_qc_metrics_from_gen.py` — пересчёт QC‑метрик из исходника `gen` и синхронизация `*.qc_report.json` под базовые пути `good`.
  - Обновлён `aggregate_ingest_report.py` — учитывает только канонические good‑файлы, где `qc.good_file == <путь к *.good.jsonl>` и файл непустой (исключены промежуточные артефакты вида `*.good.gen.good.jsonl`).

- Инварианты и канон:
  - Каноническим источником для инжеста считается базовый `*.good.jsonl`, на который указывает `good_file` в парном `*.qc_report.json`.
  - Агрегатор отчёта сканирует только такие канонические good; шум/дубликаты исключены из сводки.

- Acceptance целевого прогона (после финализации):
  - `SKIP=0`, `5xx/429=0/0`, `COMMANDS_SENT` зафиксирован.
  - В шаге финализации достигнуто: `files_total=12`, `COMMANDS_SENT=1044`, `SKIP=0`, `5xx/429=0/0` (канонический набор по QC.good_file).

- Повторяемые команды (Windows PowerShell):
  - `python .\Soul\scripts\merge_gen_into_base_goods.py --qc-dir Soul/out/qc`
  - `python .\Soul\scripts\recompute_qc_metrics_from_gen.py --qc-dir Soul/out/qc`
- Массовый инжест good (адаптивно):
  - `python .\Soul\scripts\ingest_all_goods.py --api https://mini.soulpulse.art --user-id 468326902 --batch-size 50 --sleep-ms 200 --timeout 120 --threads 12 --max-rpm 180 --adaptive --group 10`
- Финальная сводка:
  - `python .\Soul\scripts\aggregate_ingest_report.py`

Примечание: прежние пустые `*.good.jsonl` при наличии содержательных `*.good.gen.jsonl` больше не влияют на сводку и Acceptance; конвейер переведён на базовые пути good.

## Дополнение 2025‑09‑26 — Догенерация, мягкий QC и автозагрузчик

- Дополнение в P38: `Soul/P38_TZ_Soul_NeuroTraining_v1_0.md` (§20).
- Добавляются оверрайды QC (`Soul/config/qc_overrides.yaml`), оркестратор `auto_dogenerate_and_ingest.py` (циклический), расширения `llm_generate_missing_and_ingest.py` (web‑добыча).
- Процесс: волны догенерации (28–32 строки), смягчённый QC по выборочным семействам, непрерывный инжест, автолинковка и проверка покрытия.

## Security/Authorization (P44) — кратко

- Модель: RBAC как база + ABAC предикаты (канал/окна/подписка), точечный ReBAC (ownership), Two‑Keys для опасных команд (P36 NET/DEPLOY/DB/SCHEMA).  
- PEP/PDP: централизованный `rbac_middleware` (PEP) и `RBACService` (PDP) с матрицей эндпоинтов/прав/лимитов; аудит отказов/разрешений.  
- OpenAPI (P22): добавлены `securitySchemes` (`TgHeaderAuth`/`BearerAuth`); админ‑пути помечены секцией `security` (требуются заголовок `X‑Telegram-User‑ID` и Bearer JWT).  
- Mini‑App/Web: строгий `X‑Telegram-User‑ID`; в Web — сверка `tg_id` в JWT и заголовке, при несовпадении 401.  
- Флаги (P28): профиль `prod_safe` запрещает `DISABLE_RBAC`/`TEST_NO_DB` в PROD.  
- Two‑Keys: заявки/аппрув по ключам, разные субъекты, TTL, хэш payload; обязательны для опасных Hyperloop‑команд.

---

## P63 — Onboarding внешних разработчиков (RBAC/онбординг/реестры/напоминания)

- Единая рабочая зона: APP2 (frontend APP). Дубли на APP1 удалены.
- Каталоги проекта (APP2): `developers/projects/demo_project/soul`, `developers/projects/demo_project/doc`.
- Роли внешних разработчиков (ключи): `ext_frontend_dev`, `ext_integration_dev`, `ext_channel_dev`, `ext_soulpulse_dev` (создаются идемпотентно в `RBACService.seed_defaults`).
- Key Master: внешним ролям разрешены только ключи `dev.*` и `bot.token.<tg_id>`; админы/архитекторы — полный доступ. Политика применена в `backend/app/routers/soul_admin.py`.
- Hyperloop команды онбординга: `ONBOARDING.CHECK_AND_PREPARE`, `ONBOARDING.SLA_NOTIFY` — только `soul.admin` (RBAC матрица в `backend/app/routers/hyperloop_admin.py`).
- Реестр документов: таблица `public.project_registry_entries`, индексы см. Alembic `20251016_000095_registry_indexes.py`; диагностика — `ops/scripts/p63_registry_probe.sh`.

Дополнения (2025‑09‑23):

- ABAC в `backend/app/middleware/rbac_middleware.py`: детект канала (`mini` по заголовку/отсутствию Bearer, `web` по Bearer) и окно времени UTC (`HH:MM‑HH:MM`); зависимость `require_channel(...)`.
- ReBAC ownership: проверка *.self через конфиг эндпоинтов и зависимость `require_self_param(param_name, kind='tg|id')`.
- Two‑Keys усиление: `backend/app/routers/two_keys_admin.py` (TTL, запрет same‑subject, `verify_two_keys_approval(...)`) и `backend/app/routers/pc_admin.py` (строгая серверная проверка Two‑Keys).

## WebAuth MiniApp → Web (P47)

- Эндпоинты `backend/app/routers/web_auth.py`:
  - `POST /api/web-auth/issue-web-cookie` — устанавливает HttpOnly cookie `sp_web` (TTL 10 мин; `Secure; SameSite=Lax; Domain=.soulpulse.art; Path=/`).
  - `POST /api/web-auth/issue-one-time-token` — выдаёт OTP (окно 300с) для fallback.
  - `POST /api/web-auth/verify-otp` — проверка OTP; устанавливает HttpOnly cookie `sp_token` (до 12ч; `Secure; SameSite=None; Domain=.soulpulse.art; Path=/`).
- Middleware в `backend/app/main.py`: `web_session_restore_middleware` — восстанавливает `X-Telegram-User-ID` из `sp_web`/`sp_token` (JWT `sub`/`tg_id`). Исключения: `/api/*`, `/ws/*`, `/webhook/*`.
- Требования безопасности: токены не в URL/JS; только HttpOnly cookie; rate limiting для auth‑путей; заголовки безопасности XFO/CSP/HSTS/Referrer/Permissions.
- FE: в MiniApp используется основной cookie‑путь, OTP — как резерв. Web не требует `localStorage`.

## Persona Registry — системные персонажи

- Реестр: `docs/PERSONA_REGISTRY_v1_0.md` (машинно‑читаемый список персонажей, их функций/ролей/полномочий/объектов и зон ответственности).  
- Авто‑поддержка: «Архивариус/Библиотекарь» сканирует код/документы и обновляет реестр, проверяет ссылки и синхронизацию с P44/P27/P30/P38.  
- Персонажи (свод): Соул (ядро), Архитектор, Фронтмен, Страж (RBAC), Процессор, Тренер (P38), Архивариус.

Новый актор: Агент безопасной эфемерной связи (P43)

- Документ: `Soul/P43_TZ_Agent_Secure_Ephemeral_Comms_v1_0.md`
- DSL команды: `NET.*` (P36), RBAC=sysadmin, Two‑Keys на опасные действия (P44)
- Интеграции: P27 подпись `svc.agent.net.*`, P28 профили `net.*`, P29 инспекторы, P30 события Processor
- Реализация (обновление):
  - Backend `backend/app/routers/agent_comm.py`: комнаты/мастер + WebRTC сигналинг:
    - WS: `/api/ws/agent-rooms/{room_id}/signal?peer_id=<session_id>&name=<opt>`
    - ICE конфиг: `GET /api/agent-rooms/webrtc/config` (STUN/TURN из ENV)
    - Админ‑просмотр: `GET /api/agent-rooms/webrtc/participants?room_id=`
    - Управление: `GET/POST /api/agent-rooms/sessions/status|pause|resume|disconnect|kill`, `GET/POST /api/agent-rooms/kill`, `GET/POST /api/agent-rooms/auto_resume?enabled=...`
    - Метрики: `POST /api/agent-rooms/webrtc/metrics`
  - Config `backend/app/config.py`: переменные `ICE_STUN`, `ICE_TURN_URI`, `ICE_TURN_USERNAME`, `ICE_TURN_PASSWORD`, `ICE_TURN_TLS`; метод `webrtc_ice_servers()`.
  - UI `/agent/comm`: добавлены кнопки камера/микрофон/экран, сетка участников, чат через сигналинг.
  - Логика «главного экрана» (WS `set_main`/`main_changed`) и опция автодопуска комнаты `auto_resume`.

Ссылки: `Soul/P44_TZ_Soul_Roles_and_Authorization_v1_0.md`, `docs/openapi-p20-telegram-bots.yaml`.

## Ключевые изменения v8.0.4 (2025‑09‑13)

- Единый промпт для `generate_quant` и `generate_quants`: блоки `[CORE][ROUTER_CONTEXT][MODULES][OUTPUT_SPEC][NEGATIVE]` + контекст истории. RouterV2 выбирает активные модули.
- Batch‑стратегия (устранение greenlet_spawn):
  - LLM вызовы в batch выполняются без обращения к БД (`LLMManager.get_model_for_function(db=None)`, `LLMClient.send(db=None)`).
  - Роутер `process_batch` имеет безопасный фоллбек на одиночную генерацию при ошибках.
  - В stateless‑ветке `desired_action` в ответе нормализуется в пустой массив (несохраняемые действия запрещены).
  - Событие аудита `soul_batch_fallback_single` фиксируется при фоллбеке.
- Переменные окружения:
  - `SOUL_DISABLE_QUANT_PERSIST_BATCH=1` — принудительно включить stateless‑ветку batch.
  - `TEST_NO_DB=1` — полностью отключить доступ к БД для тестовых вызовов API.
- Документация: добавлены новые версии `SOUL_PIPELINE_v1_1.md` и `PROMPTS_AND_MEMORY_ALG_v2_26.md` с точной спецификацией.

---

## Единый конвейер генерации квантов

переносука

- Чат (онлайн): `backend/app/services/chat_service.py` → `SoulCoreManager.generate_quants(...)`
- Авторежим (фон): диспетчер → план/материализация → `SoulCoreManager.generate_quants(...)`
- API: `POST /api/soul/process` → `_process_soul_impl` → `SoulCoreManager.generate_quant(...)`
- Batch API: `POST /api/soul/process_batch` → `SoulCoreManager.generate_quants(...)`

### Основная цепочка от возмущений (активна в Бодрствовании)

- Источники возмущений: вход пользователя/чат Архитектора, harvest‑модули, напоминания/цели.
- Препроцессинг: enriched_context + planner_feedback (ядро SoulCore).
- Генерация: `generate_quant|generate_quants` (LLMClient без хардкодов; таймауты/ретраи из БД).
- Нормализация/обогащение: STRICT JSON → эмоции/теги/сенсорика/связи/действия.
- Пакеты: чанки=10 по умолчанию, stateless‑LLM, фоллбек single.
- Персист: API/DSL с защитой от дрейфа схемы и шагами подписи.
- Наблюдаемость: метрики p95, `signature_steps`, инспекторы, инциденты.

### Hyperloop — отказоустойчивость и доработки (не новое ТЗ)

Добавлено:
- RO‑кэш (in‑proc LRU+TTL + Redis слой), инвалидация через write/PG NOTIFY/Redis PubSub.
- Circuit Breaker с fallback в outbox для безопасных команд.
- Signed v2 (заголовки X‑Sign‑*, idempotency/nonce/HMAC‑SHA256, canonical JSON).
- Метрики: `hyperloop_cache_hit_total|miss_total`, `invalidation_latency_ms(p95)`, `hyperloop_execute_latency_ms(p95)`, `dev_connect_*`.
- Bootstrap‑пакет для восстановления БД: `deploy/db/bootstrap.sql`, `deploy/db/seed_minimal.sql`, env пример `deploy/env/miniapp_backend.env.example`.

- Клиентские пути: Primary CLI → fallback Invoke‑RestMethod → файл+`curl.exe`; signed `/api/hyperloop/execute-signed` (HMAC) как резерв.
- Серверные пути: RS‑сайдкар (P48R) режимы `shadow/canary/primary_fallback`, circuit breaker, адаптивные таймауты/ретраи.
- Наблюдаемость: DevConnect панели и алерты; раздельные счётчики ошибок по типам; Acceptance — наличие `trace_id` и шагов подписи.

#### DDL/TIMEOUT/INDEX.CREATE (обновление 2025‑10‑07)

- `SCHEMA.ENSURE` поддерживает модификатор `TIMEOUT=<ms>` (локальный `SET LOCAL statement_timeout`).
- Добавлена команда `INDEX.CREATE table=<t> name=<idx> cols="c1,c2,..." concurrently=true [async=true]` — конкурентное создание индексов в фоне с уважением `TIMEOUT` и Two‑Keys.
- Глобальный `hyperloop.command.timeout_ms` поднят до 600000 мс; для DDL команд используется `TIMEOUT=600000`.

## RS интеграция (P48R, Hyperloop)

- Python фасад сохраняет публичные контракты API/DSL и шаги подписи (P27).
- Делегация горячего пути Hyperloop в RS (sidecar) выполняется через мост:
  - Файл: `backend/app/services/hyperloop_rs_bridge.py`
  - Включение/режимы: настройки в БД (`rs.hyperloop.*`) и ENV (`HYPERLOOP_RS_*`).
  - Режимы: `python_only | rs_shadow | rs_canary | rs_primary_python_fallback | rs_primary_no_fallback`.
  - Маршрут: `HyperloopEngine.execute()` → (опционально) `HyperloopRSBridge.execute()` → RS, шаг подписи `svc.rs.proxy`.
- Эндпоинты (без изменений):
  - `POST /api/hyperloop/execute` — RBAC `soul.admin`; возвращает `ok`, `trace_id`, `results[]`, `signature` (+ `incidents`).
  - `POST /api/hyperloop/execute-signed` — HMAC; включается флагом `hyperloop.allow_signed=true`.
- Инспекторы RS (минимум):
  - `rs.parity` — наличие `svc.rs.proxy` в последних трассах.
  - `rs.performance_sla` — p95 по RS (N/A, если нет метрик), бюджет по умолчанию 3 ms.

### RS наблюдаемость и отчёты (v2)

- Метрики RSBus/Hyperloop (Prometheus):
  - Латентности: `rsbus_latency_ms{op}`, `hyperloop_rs_latency_ms{phase}`.
  - Ошибки и бэкпрешер: `rsbus_errors_total{op,class}`, `rsbus_backpressure_hits_total{op}`, `rsbus_backpressure_on{op}`.
  - Паритет/ошибки: агрегаты `error_rate`/`mismatch_rate` (на стороне сервиса отчётов).
  - Processor (P30 RS): `processor_rs_tick_latency_ms{stage}`.
  - PDP (P44 RS): `p44_pdp_decisions_total{decision,reason}`.
  - Сенсоры RS: `rs_sensors_ingest_total{kind}`, `rs_sensor_value{kind}`.
- DEV.CONNECT (Python/RS мост): метрики считаются в backend экспортёре Prometheus (`/api/metrics/prometheus`) и включают `dev_connect_latency_ms_p50|p95`, `dev_connect_total{status}`, `dev_connect_error_total{type}`. Правила: `ops/prometheus/rules_dev_connect.yml` (в репозитории) — деплоятся в PROD как `/etc/prometheus/rules/rules_dev_connect.yml`. Alertmanager настроен на доставку алертов группы `dev_connect_rules` в Telegram/Slack.
  - Grafana: дашборд `ops/grafana/dev_connect_dashboard.json` (провижининг включён), панели: p50/p95, total{status}, error_total{type}, инциденты P50.
  - Grafana: дашборд `ops/grafana/dev_connect_dashboard.json` (провижининг включён), заголовок "DEV.CONNECT — Observability"; UID на стороне Grafana назначается при импорте (зафиксируйте ссылку формата `/d/<uid>/dev-connect-observability`). Панели: p50/p95, total{status}, error_total{type}, инциденты P50.

- Сводки/эндпоинты:
  - `GET /api/admin/rs/report/p95` — агрегированная p50/p95/p99 + avg/count + backpressure/error/mismatch‑rate + текущий режим `mode`; быстрый превью‑кэш (TTL, in‑memory), агрегат `top_ops_by_requests` (вкл. `error_rate`/`mismatch_rate`).
  - `GET /api/admin/rs/parity/summary` — счётчики паритета по инцидентам за окно.
  - `GET /api/admin/rs/dashboard/summary` — мини‑дашборд: p95 сводка + счётчики запросов/ошибок.
  - `GET /api/admin/rs/errors/by_class` — агрегаты ошибок по классам и топ операций по ошибкам.
  - `GET /api/admin/rs/backpressure/summary` — включённость backpressure и счётчики hits по операциям.
  - `GET /api/admin/rs/signature/diff_by_trace` — сравнение шагов подписи P27 по двум `trace_id` (пересечение/разности, `match_ratio`).

Примеры запросов (PowerShell/CLI):

```text
# p95 preview (TTL‑кэш)
python .\Soul\scripts\hyperloop_cli.py --http-get "https://mini.soulpulse.art/api/admin/rs/report/p95?preview=true&max_age_sec=10"

# diff шагов подписи по двум trace_id
python .\Soul\scripts\hyperloop_cli.py --http-get "https://mini.soulpulse.art/api/admin/rs/signature/diff_by_trace?trace_py=<PY_TRACE_ID>&trace_rs=<RS_TRACE_ID>"

```

- Админ‑UI:
  - Страница `RS Dashboard` (`/rs/dashboard`): пиковые латентности, ошибки по классам, backpressure hits, parity/mismatch‑rate, текущий режим, объём трафика; форма запуска Hyperloop DSL с нормализацией кавычек/escape.

### RS Processor/PDP (read‑only)

- Processor RS (tick/agenda): `op="p30.processor.tick"` (вход: `{agenda[],policies{max_qps}}`, выход: `{next[], backpressure}`), стадии parse/plan/act/observe/learn с метриками.
- PDP RS: `op="p44.pdp.decide"` (вход: матрица контекста; выход: `{decision, code, reason}`), паритет с Python‑PDP; журнал решений в `p44_pdp_decisions_total`.

### Сенсоры RS (read‑only расширения)

- Операции: `sensor.ingest|sensor.preview|sensor.stats` (без побочных эффектов) с метриками `rs_sensors_ingest_total{kind}`, `rs_sensor_value{kind}`.
  - JSON (вход/выход):
    - `sensor.ingest` — вход: `{kind: string, value: number}`; выход: `{ok: true, kind, accepted: true}`
    - `sensor.preview` — вход: `{kind: string}`; выход: `{ok: true, kind, preview: {recent: number}}`
    - `sensor.stats` — вход: `{kind: string}`; выход: `{ok: true, kind, metrics: {ingested: number}}`
- Инспектор `rs_sensors_smoke` включён в RUN_ALL: инжестирует несколько значений, валидирует `preview|stats`, не допускает 5xx.

### Безопасность / Two‑Keys / ABAC (P44)

- Two‑Keys: опасные операции (например, `FLAGS.APPLY_PROFILE name=prod_safe|dev_full`) требуют одобрения (Python фасад + RSBus проверка).
- ABAC/PDP в RS — паритет с Python; журнал решений.
- P27: требуемые шаги подтверждаются инспекторами (`rs_trace_linking`, `rs.parity`).

- Fast‑path маркера одобрения (ускорение прохождения 2‑ключей):
  - При `TWO_KEYS.APPROVE id=<uuid>` фасад пишет маркер в таблицу `public.two_keys_approved_requests` и устанавливает настройку `two_keys.approved.<id>=true` в `soul_settings`.
  - Проверка `_check_two_keys` сначала читает флаг в `soul_settings`, затем таблицу, затем валидатор `two_keys_admin` (детальный).
  - Маркер можно выставить через админ‑API `POST /api/admin/soul/settings/set` c телом `{ "key": "two_keys.approved.<id>", "value": true }`.

### P27 Guard RS (P48R)

- Python фасад Delivery Guard поддерживает делегацию в RS по режимам `python_only|rs_shadow|rs_canary|rs_primary_python_fallback|rs_primary_no_fallback`.
- Мост/фасад: `backend/app/services/p27_rs_bridge.py`.
- Включение и режимы:
  - ENV: `P27_RS_ENABLED`, `P27_RS_ADDR` (dev: `http://127.0.0.1:7072`), `P27_RS_TIMEOUT_MS`, `P27_RS_MODE`, `P27_RS_CANARY_SHARE`.
  - DB/Settings: чтение через `SoulSettingsService` (приоритет ENV для stateless RS).
- Инспектор: `rs.p27_guard` — проверка минимального кейса (`required=['svc.chat.reply_render']`).
- Статус PROD: shim sidecar на `127.0.0.1:7072` активен; `rs.p27_guard` — passed при `P27_RS_MODE=rs_canary`.

### P29 Inspectors RS (P48R)

- Назначение: вынесение базовых проверок качества/здоровья Жандарма (P29) в RS‑сайдкар.
- Мост/фасад: `backend/app/services/p29_rs_bridge.py`.
- Инспектор: `backend/app/feature_plugins/rs_p29_health.py` → `INSPECTOR.RUN key=rs.p29_health`.
- Включение и режимы:
  - ENV: `P29_RS_ENABLED`, `P29_RS_ADDR` (dev: `http://127.0.0.1:7073`), `P29_RS_TIMEOUT_MS`, `P29_RS_MODE`, `P29_RS_CANARY_SHARE`.
  - Режимы: `python_only | rs_shadow | rs_canary | rs_primary_python_fallback | rs_primary_no_fallback`.
- Статус PROD: shim sidecar на `127.0.0.1:7073` активен; `rs.p29_health` — passed при `P29_RS_MODE=rs_canary`.

## Структура сообщений к LLM

```text
[CORE] — системные инструкции Souls
[ROUTER_CONTEXT] — JSON о включённых модулях/фильтрах
[MODULES] — инструкции активированных модулей
[PLANNER_FEEDBACK] — краткий фидбек планера (если включён)
[DA_HINT] — опциональные подсказки для desired_action (валидация сервером)
[OUTPUT_SPEC] — формат ожидаемого JSON
[NEGATIVE] — запреты и ограничения
+ Контекст истории (до 12 сниппетов)

```

## JSON‑спецификация кванта (сводка)

- `thought_form: str`
- `composite_emotion: { valence: float, intensity: float, entropy: float, label: str }`
- `desired_action: []` (в stateless‑batch всегда пусто)
- Типы `desired_action`: `ask_architect`, `reminder`, `research` (а также совместимые системные: `proposal`, `request`, `note`, `spawn_next_quant`).
- `energy_weight: float [0..1]`
- `tags: List[str]`

Дополнение (Desire→Architect):

- Детектор желания спросить Архитектора встроен в `soul_core_manager.py` (single/batch ветки). Условия: высокий `energy_weight` и/или `composite_emotion.intensity`, метки эмоций повышенного резонанса, усиление при наличии `active_goal`. Если `active_goal.tags` содержит `architect|архитектор|architect_link|ask_architect`, триггер усиливается до истинного. При срабатывании в `desired_action[]` добавляется `{"type":"ask_architect","text":"..."}`; обработка выполняется через `DesiredActionService` → `ReminderService` с тихими часами и окнами.

Полная спецификация и примеры — см. `docs/SOUL_PIPELINE_v1_1.md`.

---

## Batch‑режимы

- Параметр запроса: `persist_all: bool` (по умолчанию false на UI/инструментах диагностики).

- Режимы исполнения:

  1) Stateless (рекомендован для PROD диагностики):

  - Нет обращения к БД в LLM‑вызовах.
  - `desired_action=[]` в ответе API.
  - Подходит для быстрых проверок, A/B и регрессионных тестов.

  1) Persistent:

  - Полный путь с сохранением сообщений/квантов/связей.
  - Требует устойчивого async‑контекста БД.
- Фоллбек: при ошибке batch происходит откат и запуск одиночной генерации.

ENV: `SOUL_DISABLE_QUANT_PERSIST_BATCH=1` принудительно включает stateless.

---

## Эндпоинты и проверки

- Health: `GET /api/health`
- Проверка БД: `GET /api/admin/soul/db/check`
- LLM test: `GET /api/admin/soul/llm/test?provider=deepseek&prompt=ping`
- Одиночная генерация: `POST /api/soul/process { input_text, num_candidates }`
- Пакетная генерация: `POST /api/soul/process_batch { input_text, num_quants, persist_all }`
- Voice TTS (P19): `POST /api/voice/tts { text, voice?, format=wav|ogg|mp3, persona_key?, user_id?, dry_run? }`
- QA sanity: `GET /api/admin/soul/qa/quants_sanity?limit=N`
- Provenance Admin (P11): `GET /api/admin/provenance/quant/{quant_id}`, `GET /api/admin/provenance/trace/{trace_id}` — видны в `/api/openapi.json`
- QA сенсорика: `GET /api/admin/soul/qa/sensory_coverage`, `POST /api/admin/soul/qa/generate_sensory`, `POST /api/admin/soul/qa/sensory_backfill` (RBAC: soul.admin; фичефлаги OFF по умолчанию)
- Refresh rank MV: `POST /api/admin/soul/refresh-rank`
- Sleep (MV обслуживание): `POST /api/soul/sleep?dry_run=true|false`
- Sleep dry‑run (компакция/архив, предпросмотр): `POST /api/soul/sleep/dry_run`
- QA Admin README: `docs/ADMIN_QA_CHECKS_README.md`

### Processor / Очереди / Лимиты / Карантин / DLQ (добавлено 2025‑10‑07)

- Мониторинг и статистика (dashboard API):
  - `GET /api/admin/soul/processor/metrics` — очередь (`queue_len`), `throughput_eps`, последние инциденты, p95, per‑node.
  - `GET /api/admin/soul/processor/top?minutes=...&limit=...` — хит‑парад источников событий; включает `meta` по видам (who/purpose/algorithm/frequency/keys_limits/incidents_metrics).
  - `GET /api/admin/soul/processor/kind_stats?minutes=...` — агрегаты per‑kind (`processed/skipped/total`, `error_rate`, `e2e_p95_ms`, `limits.*`, `quarantine`).
  - `GET /api/admin/soul/processor/workers/status` — агрегация по `worker_id` (fallback: `payload->>'worker_id'`, если колонки нет).
  - `GET /api/admin/soul/processor/emergency/eta` — оценка ETA дренажа очереди.
- Управление лимитами и карантином:
  - `POST /api/admin/soul/processor/limits/set` — bulk upsert `processor.kind_limits.*`, `processor.kind_priority.*`, `processor.kind_quarantine.*`.
  - `POST /api/admin/soul/processor/quarantine/set` — выставление карантина per‑kind: тело `{ "reminder": true|false, ... }`.
- DLQ операции:
  - `POST /api/admin/soul/processor/dlq/requeue` — ре‑очередь `dead` событий: тело `{ "event_ids": ["<uuid>", ...] }`.
- Источники (backend): `backend/app/routers/processor_dashboard_api.py`, `backend/app/routers/processor_admin.py`.
- Мини‑аппа (frontend): экран мониторинга `frontend/src/pages/ArchitectMonitoring.tsx` — поддерживает выбор окна (10/30/60/180/1440), автообновление (10–60 с), раскрываемый `meta` per‑kind и спарклайны `queue_len/throughput_eps`.
- Acceptance: топ‑3 видов виден стабильно; раскрытие показывает `meta`; автообновление без ошибок; SLA‑подсветка per‑kind работает.

#### Узло‑ориентированная обработка (fallback и целевая схема)

- Целевая схема таблицы `processor_events`:
  - Колонки: `worker_id text`, `dispatched_at timestamp`, `attempts int not null default 0`, `next_retry_at timestamp`.
  - Индексы: `(status, kind)`, `(status, priority, due_at)`, `(status, created_at)`, `(worker_id)`, `(updated_at)`.
- Fallback (при отсутствии физической колонки `worker_id`):
  - Диспетчер штампует `payload.worker_id` и `payload.dispatched_at` в момент перевода события в `dispatched`.
  - Агрегаты `/workers/status` и `/nodes` читают `COALESCE(worker_id, payload->>'worker_id')`.
  - Это обеспечивает стабильную наблюдаемость per‑node до применения DDL.
- Стратегия наката DDL (PROD‑safe):

  1) Снизить конкуренцию Hyperloop/DB Governor; увеличить таймауты команд.
  2) Применять DDL по одному столбцу (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`) с Two‑Keys.
  3) После столбцов — создать индексы по одному (`CREATE INDEX IF NOT EXISTS ...`).
  4) Подтвердить, что новые события получают физический `worker_id`, затем наблюдать распределение узлов и p95.

---

## Языковая политика ответа ([LANG_POLICY])

- Язык ответа определяется ИСКЛЮЧИТЕЛЬНО по тексту секции '=== ТЕКУЩИЙ ЗАПРОС ==='.
- Системные/модульные инструкции, история и иные контекстные блоки не влияют на выбор языка.
- Для смешанных запросов выбирается язык первого полноценного предложения.
- Если язык не удаётся однозначно определить — используется русский.
- Реализовано в `backend/app/services/soul_core_manager.py` путём добавления блока `[LANG_POLICY]` в SYSTEM.

Примеры запросов и нормализация — см. `SOUL_PIPELINE_v1_1.md`.

---

## Пути и окружения

- Канонический домен PROD Mini‑App: `mini.soulpulse.art` (единственный активный `server_name` в прод‑конфиге).
- PROD API: `https://mini.soulpulse.art/api`
- Канонический корень фронтенда (SPA): `/var/www/soulpulse/frontend`
- Nginx PROD конфиг: `/etc/nginx/sites-enabled/03-mini_soulpulse.conf`
- Таймауты Nginx (PROD): `proxy_read_timeout=120s`, `proxy_send_timeout=120s` — установлено и проверено (`nginx -t` ok, reload без ошибок)
- Nginx TEST конфиг (в репозитории): `nginx_test_soulpulse_art.conf` (на сервере рекомендуется зеркалировать PROD‑структуру)
- PROD ENV: `/etc/soulpulse/miniapp_backend.env` (ключи: `DATABASE_URL, BOT_TOKEN, BOT_TOKENS, JWT_SECRET, LLM_PROVIDER, DEEPSEEK_API_KEY, DEEPSEEK_MODEL, CORS_ORIGINS, SOUL_DISABLE_QUANT_PERSIST_BATCH, TEST_NO_DB`)
- RS ENV (P48R): `HYPERLOOP_RS_*`, `P27_RS_*`, `P29_RS_*` (адреса/таймауты/режимы/canary доля)
- systemd: `/etc/systemd/system/soulpulse-backend.service`
- SSH ключ: `deploy/ssh_keys/app_server_key` (локально); на сервере используются системные ключи `root`.

Voice (P18/P19/P49) — канонично (PROD):

- Провайдер по умолчанию: Piper (оффлайн). Фоллбек: Yandex SpeechKit при наличии ключа.
- Модели Piper: `/opt/piper/models` (например: `ru_female_calm.onnx` + `ru_female_calm.onnx.json`).
- ENV:
  - `ENABLE_VOICE_TTS=1`
  - `TTS_PROVIDER=piper|yandex_speechkit`
  - `TTS_VOICE=ru_female_calm` (ID из реестра/конфигурации)
  - `PIPER_MODEL_DIR=/opt/piper/models`
  - `FFMPEG_BIN=ffmpeg`
  - `YANDEX_SPEECHKIT_API_KEY=<optional>` (для фоллбека)
  - `YANDEX_SPEECHKIT_LANG_DEFAULT=ru-RU`

P49 (Сенсорика: Голос/Речь) — интеграция:

- Поток: Audio Ingest → ASR (P18) → сегментация/смыслы → эмоции (просодика+контекст) → ретривал памяти (P39) → ответ → TTS (P19).
- Подписи (P27): `svc.sensory.audio.decode`, `svc.voice.asr`, `svc.text.segment`, `svc.meaning.extract`, `svc.emotion.voice.detect`, `svc.memory.retrieve`, `svc.voice.tts`.
- RS‑режим (P48R): допустим `rs_canary|rs_primary_*` для segment/emotion/retrieve с инспекторами `rs.parity`/`rs.performance_sla`.

Примечание (2025‑09‑15): На PROD исправлен конфиг Nginx (убраны конфликтующие backup/include файлы), `nginx -t` проходит, сервис активен; backend сервис перезапущен, sanity‑проверки API прошли успешно.

Примечание (2025‑09‑21): Подняты таймауты Nginx до 120s для mini.soulpulse.art; внешние смоки прошли, 5xx не наблюдается. OpenAPI содержит пути `/api/admin/provenance/*`. В Prometheus‑экспорте добавлены гейджи provenance: `provenance_edges_count_1h`, `provenance_edges_count_24h`, `provenance_edges_per_quant_{avg,p50,p95}`, `provenance_ms_overhead_p95`.

## Дополнение 2025‑09‑22 — Голоса персон (каталог/привязки/UI)

- База каталога голосов (новые таблицы):
  - `voice_samples(id,label,provider,voice_id,rate,emotion,file_path,persona_key,created_at,updated_at)`
  - `prompt_voice_binding(prompt_key PRIMARY KEY, sample_id REFERENCES voice_samples)`
  - DDL и наполнение: `backend/scripts/sql/voice_catalog.sql` (альтернатива — `backend/scripts/register_voice_samples.py`).
- Резолв голоса при синтезе (порядок приоритета):

  1) `user_persona_voice(user_id, persona_key)`
  2) `persona_voice_profile(persona_key)`
  3) `prompt_voice_binding → voice_samples` (новый фоллбек)
  4) `tts.default.*` из `SoulSettingsService`

  - Реализовано в: `backend/app/routers/voice_tts.py` и в телеграм‑потоке `backend/app/telegram.py` (для sendVoice).
- Админ‑API каталога:
  - `GET /api/voice/admin/samples` — список сэмплов
  - `GET /api/voice/admin/bindings` — привязки промптов к сэмплам
  - `GET /api/voice/admin/file/{path}` — отдача файлов (ограничено RBAC `soul.admin`)
  - `POST /api/voice/set_voice { persona_key, voice_id, rate?, pitch? }` — задание профиля персоны (upsert `persona_voice_profile`).
- UI мини‑приложения (админ/архитектор): страница управления голосами `/#/admin/voice`.
  - Файл: `frontend/src/pages/VoiceAdmin.tsx`; маршрут подключён в `frontend/src/App.tsx`.
  - Возможности: прослушивание сэмплов, выбор персоны из списка промптов, привязка голоса.
- Выбранные привязки на PROD (зафиксировано каталожным SQL и профилями):
  - `Soul_Core` → `ermil`, rate 0.90, emotion `neutral`
  - `FR_Ranevskaya_Persona_v1_4` → `jane`, rate 0.72, emotion `evil`
  - `flow_prompt-3_v4` → `ermil`, rate 1.06, emotion `good`
  - `Zhvanetsky_Persona_v4_1` → `filipp`, rate 1.00, emotion `neutral`
  - `zhvan_prompt_clean_v3_3` (Кли) → `ermil`, rate 1.06
  - `Ved_prompt_Masterpiece_v4_3` → `ermil`, rate 0.88 (+FX «cosmic reverb»)
  - `Kabbalah_prompt-3_v16` → `ermil`, rate 0.92
  - `female_resonance` → `oksana`, rate 0.80, emotion `evil`
  - `LT_Prompt_Masterpiece_v1_9` → `oksana`, rate 0.85
  - Актуальные файлы‑сэмплы задокументированы в `Soul/voices/VOICE_CATALOG.md`.
- ENV обновлено: `TTS_PROVIDER=yandex_speechkit TTS_VOICE=ermil TTS_RATE=0.9` (см. `tmp/env.prod`).

---

## Связанные файлы и модули

- Ядро: `backend/app/services/soul_core_manager.py`
- Роут: `backend/app/routers/soul.py` (ветка batch и фоллбек)
- Последовательности (P30): `backend/app/services/sequence_engine.py` — планирование шагов analyze→search→answer/deliver→persist; шаг подписи: `svc.sequence.plan`.
- RouterV2: `backend/app/services/soul_router_v2.py`
- Модули: `backend/app/services/soul_modules/*.py`
- Промпты: `backend/app/prompts/soul_prompts.py`
- Менеджер LLM: `backend/app/services/llm_manager.py`
- Контекст/настройки: `backend/app/services/soul_context.py`, `backend/app/services/soul_settings_service.py`
- Voice TTS (P19): `backend/app/services/tts_service.py`, `backend/app/routers/voice_tts.py`
- P29 Жандарм и инспекторы: `backend/app/services/gendarme_service.py`, admin `backend/app/routers/gendarme_admin.py`, инспектор покрытия `backend/app/gendarme_tests/p29_sensory_coverage_threshold.py`

Инциденты (P50):

- ТЗ: `Soul/P50_TZ_Incident_Management_v1_0.md`
- БД: `incidents`, `incident_events`, `incident_links`, `incident_runbooks`, `incident_kb`
- DSL (P36): `INCIDENT.*` (создание/обновление/ссылки/закрытие/постмортем/эскалация)
- Сервисы: `backend/app/services/incident_service.py`
- Роуты: `backend/app/routers/incidents_admin.py`
- Миграции: `backend/alembic/versions/20250926_000080_p50_incident_management.py`
- Метрики (P21): `incidents_created_total`, `incidents_open_total`, `incident_mtta_ms`, `incident_mttr_ms`, `incident_stage_latency_ms{stage}`
- Интеграции: P27 подписи `svc.incident.*`; P29 инспекторы `incident.required_steps`, `incident.sla_enforcement`; P30 Processor события/эскалации; P40 `plan_task_id` связывание; P48/RS отчёты/акторы; P25/P38 навыки/обучение

Статус (2025‑09‑30):

- Backend e2e реализовано: создание/события/ссылки/эскалация/закрытие/постмортем, RBAC/Two‑Keys проверены (sev1/2). Инспекторы зарегистрированы и входят в `RUN_ALL`. Индексы применены конкурентно (`Soul/db_indexes_incidents.sql`). Ожидает: фронтенд страницы `/incidents`, `/incidents/{id}`; панели Prometheus/Grafana; тесты P24; консолидация Alembic‑ревизии индексов; экспорт Postmortem (PDF/MD) в UI.

NET/Связь (P43):

- ТЗ: `Soul/P43_TZ_Agent_Secure_Ephemeral_Comms_v1_0.md`
- DSL: `NET.*` (реализация в `backend/app/services/hyperloop_engine.py`, расширение P36)
- Метрики/подпись: шаги `svc.agent.net.*` (P27), инспекторы наличия событий
- Реализация (обновление):
  - Backend `backend/app/routers/agent_comm.py`: комнаты/мастер + WebRTC сигналинг:
    - WS: `/api/ws/agent-rooms/{room_id}/signal?peer_id=<session_id>&name=<opt>`
    - ICE конфиг: `GET /api/agent-rooms/webrtc/config` (STUN/TURN из ENV)
    - Админ‑просмотр: `GET /api/agent-rooms/webrtc/participants?room_id=`
  - Config `backend/app/config.py`: переменные `ICE_STUN`, `ICE_TURN_URI`, `ICE_TURN_USERNAME`, `ICE_TURN_PASSWORD`, `ICE_TURN_TLS`; метод `webrtc_ice_servers()`.
  - UI `/agent/comm`: добавлены кнопки камера/микрофон/экран, сетка участников, чат через сигналинг.

UI/Фронтмен (P23):

- Фронтмен (актор): `backend/app/services/frontman_actor.py`
- Админ‑фасады UI: `backend/app/routers/ui_admin.py` (`/api/ui/*`), `backend/app/routers/frontman_admin.py` (`/api/admin/frontman/*`)
- Фронтенд интеграции: `frontend/src/components/PermissionBasedMenu.tsx`, `frontend/src/pages/UIFormsRegistry.tsx`
- TimeAdmin панель: `frontend/src/pages/ResilienceAdmin.tsx` — раздел «Время (TimeAdmin)»: `/api/admin/time/status`, `/api/admin/time/settings`.

## Experiments (P04) — сервис гипотез и A/B

- Сервис: `backend/app/services/experiments_service.py`
- DSL через Hyperloop: `EXPERIMENTS.REGISTER`, `EXPERIMENTS.AB.RUN`, `EXPERIMENTS.AB.PUBLISH`
- Админ‑роуты: `backend/app/routers/experiments_admin.py` (`/api/admin/experiments/*`)
- Таблицы: `experiments_hypotheses`, `ab_runs`, `ab_results`, `experiments_golden_cases`
- Политики: публикация победителя — строго по Two‑Keys (см. `backend/app/routers/two_keys_admin.py`)
- Инспектор 24h: `backend/app/feature_plugins/experiments_window_24h.py`

- Проектное управление (P40):
  - ТЗ: `Soul/P40_TZ_Project_Management_Soul_v1_0.md`
  - БД: `projects`, `plan_tasks`, `plan_task_dependencies`, `risks`, `changes`, `project_methodologies`, `role_baseline_settings` (см. P40 DDL)
  - DSL: `PROJECT.*`, `PLAN.*`, `TASK.*`, `RISK.*`, `CHANGE.*`, `LIB.*`, `METHODOLOGY.*`, `ROLE.*` (см. P36/P40)

---

## Проверочный чек‑лист (после правок)

1) Health/DB/LLM test возвращают 200.
2) `/api/soul/process` выдаёт валидный JSON и создаёт квант в БД.
3) `/api/soul/process_batch` при `persist_all=false` возвращает список квантов с `desired_action=[]`.
4) Sanity/Refresh/Sleep выполняются без ошибок.

5) Логи systemd чистые от `greenlet_spawn`.

---

## Ссылки

- Пайплайн: `docs/SOUL_PIPELINE_v1_1.md`
- Промпты/память: `Soul/PROMPTS_AND_MEMORY_ALGORITHMS_v2_26.md`
- Схема БД: `docs/DATABASE_STRUCTURE_v8_0_2.md`
- Индекс ENV: `docs/ENV_INDEX.md`
- Индекс API роутов: `docs/API_ROUTES_INDEX.md`

---

## Мини‑приложение (Frontend) — новые страницы и хаб Архитектора

Страницы добавлены и доступны из меню у роли Architect (`frontend/src/components/PermissionBasedMenu.tsx`) и с главной `TelegramHome` ссылкой на хаб.

- Архитектор Хаб: `frontend/src/pages/ArchitectPanel.tsx`
  - Назначение: единая точка входа ко всем инструментам архитектора
  - Содержит карточки переходов: Настройки LLM, Ключевые слова, Дашборд, Оптимизация, Визуализация, Логи, Трассировка, Цели Соула

- Трассировка (Trace): `frontend/src/pages/Trace.tsx` (маршрут: `/trace`)
  - Показатели: Health/DB/LLM, тумблеры: `disable_batch`, `disable_persist`, `disable_reminders`, `persist_energy_threshold`
  - Таблицы: «Последние события» (`/api/admin/soul/audit/recent`), «Последние Кванты» (`/api/admin/soul/graph/recent_quants`)
  - Функции: полноэкранные модалки таблиц, сортировки/фильтры, выбор строк, массовое удаление квантов `DELETE /api/admin/soul/quant/{id}`
  - Нормализации: время `ts`, `tags` → массив строк, `Trace ID` из `trace_id|thread_id|meta.trace_id`
  - Обогащение: подстановка `trace_id` к квантам по карте аудита (`quant_id → trace_id`)

- Настройки LLM (таймауты/ретраи): `frontend/src/pages/LLMParams.tsx` (маршрут: `/llm-params`)
  - Табличное управление ключами в БД: `llm_timeout_ms.<function>.<model>`, `llm_retries.<function>.<model>`
  - API: `GET /api/admin/soul/settings/all`, `PUT /api/admin/soul/settings { key, value }`
  - Преднастройки: пример — `llm_timeout_ms.soul_core.deepseek = 6000`, `llm_retries.soul_core.deepseek = 1`

Связанные изменения Backend:

- `backend/app/services/soul_core_manager.py`: чтение таймаутов/ретраев из `SoulSettingsService` (stateless: `LLMClient.send(..., db=None)`), возврат к прежним значениям клиента после вызова
- `backend/app/services/llm_client.py`: поддержка параметров `timeout_ms`/ретраев; дефолты безопасно понижены через настройки
- `backend/app/services/chat_service.py`: режим Архитектора — маркеры `§sense`, `§qtags`, `§qew` в ответе, при ошибке — `§error` с деталями; сервисные ответы «Соул Спит» (без вызова LLM) и «Ошибка с получением ответа от Соул`

Nginx SPA fallback настроен: корень `/var/www/soulpulse/frontend`, `try_files $uri $uri/ /index.html;` (см. `deploy/nginx/03-mini_soulpulse.conf`).

## Обновления 2025‑09‑20 (устранение белого экрана/вылетов)

- Конфиг Nginx очищен от конфликтующих backup‑файлов; удалён `Clear-Site-Data` для предотвращения сброса кэша/хранилищ.
- `index.html` отдаётся с `Cache-Control: no-store` для синхронизации с актуальными бандлами.
- Глобальный обработчик `ChunkLoadError` (в `App.tsx`) выполняет одноразовый перезапуск страницы с query‑версией.
- Детект Telegram WebApp стабилизирован, класс `telegram-mini-app` навешивается на старте; всегда используется `MemoryRouter`.
- Auth‑инициализация: извлечение `tg_id` и `user` из `sessionStorage` → `initDataUnsafe.user` → парсинг `initData` → URL‑параметры (`tg_id`,`otp`,`user_data`) с последующей очисткой URL; данные сохраняются в `sessionStorage`.
- Архитектор Хаб: авто‑загрузки тяжёлых секций отключены в Mini‑App среде для предотвращения зависаний.
- SoulDashboard: источники данных исправлены — аудит `/api/admin/soul/audit/recent?limit=100`, цели `/api/admin/soul/goals?limit=500`; локальная обработка ошибок без редиректов.

## API P22 фасады (включаются флагом ENABLE_P22_FACADES=1)

- `/api/admin/two-keys/*` — очередь заявок на чувствительные действия (approve/audit). Dry‑run.
- `/api/pc/*` — каркас PC‑операций (только dry‑run, требует two‑keys approve).
- `/api/cursor/*` — каркас Cursor (run/edit) только dry‑run, требует two‑keys approve.
- `/api/reminders/*` — фасад подключён (готово).
  - Расширения P17: поддержка search_query/search_url в создании/обновлении; pre-fetch за N минут (настройки `reminders.prefetch.*`).
  - Фоновая задача `ReminderBackgroundTask` выполняет pre-fetch и сохраняет `prefetch_payload`/`prefetch_done` для будущего уведомления.
  - P18: `/api/voice/asr` — загрузка аудио (multipart), ffmpeg нормализация и распознавание (ASRService).
  - P19: `/api/voice/tts` — синтез речи (TTSService). По умолчанию Piper (`TTS_PROVIDER=piper`); поддерживается Yandex SpeechKit при наличии `YANDEX_SPEECHKIT_API_KEY`.
  - P24: интегр. тесты и CI артефакты генерируются `scripts/ci_generate_metrics.py`.
- `/api/tasks/*` — фасад включён, чтение id при наличии таблицы `tasks`; POST/PATCH пока 501 до выравнивания схем.
- `/api/events/*` — фасад включён, чтение id при наличии таблицы `events`; POST/PATCH пока 501 до выравнивания схем.

Примечание: старые пути `/api/miniapp/*` остаются для обратной совместимости. Включение/отключение фасадов управляется переменной окружения, без миграций схемы.

## Postmortem: Инцидент React #300 (Mini‑App/Web)

- Симптом: «Minified React error #300», черный экран в Telegram WebView и браузере; иногда MIME ошибки на бандле.
- Корневые причины:
  - Кэширование старого `index-*.js` в Telegram WebView/браузере → рассинхронизация с `index.html`.
  - Динамическая смена роутера/редиректы на старте → гонки рендера в WebView.
  - CSP/XFO до фикса (frame-src/frame-ancestors) блокировали встраивание SDK.
- Исправления:
  - Строгие заголовки для `index.html`: `Cache-Control: no-store, no-cache, must-revalidate`, `Pragma: no-cache`, `Expires: 0`.
  - Cache-bust основного бандла `index-*.js` при каждом деплое (`?v=timestamp`).
  - Фичефлаги и безопасные режимы: `SAFE_BOOT`, `NOREACT`, `DIAG` через `window.__SP_FLAGS__` и `

## Дополнение 2025‑09‑24 — P48R (двухконтурная интеграция Rust)

- ТЗ: `Soul/P48R_TZ_Hyperloop_Rust_v1_0.md` (Runbook, двухконтурная модель, 7 уровней, реестр преемственности, firewall/UDS/systemd hardening).
- RS‑сервисы (sidecar, UDS `/run/soul/*.sock`): Hyperloop RS, P27 Guard RS, P29 Inspectors RS, P30 Processor RS, P44 PDP RS.
- Флаги включения зон: `HYPERLOOP_RS_ENABLED`, `P27_RS_ENABLED`, `P29_RS_ENABLED`, `P30_RS_ENABLED`, `P44_PDP_RS_ENABLED` (+ режимы `shadow/canary/primary_fallback/primary`).
- Безопасность: только Python экспонируется наружу; RS без сети/секретов; решения допусков (PEP/PDP/Two‑Keys) в Python; шаги подписи `svc.rbac.*`/`cmd.hyperloop.authz.*` фиксируются до делегации.
- Реестр преемственности (БД): `lang_succession_registry`, `lang_succession_history` (см. P48R §29), админ‑API `/api/admin/lang-succession*`.
- Acceptance: гейты Жандарма `rs.parity/rs.performance_sla/rs.security_limits` для переходов `shadow→canary→primary`.

RS Hyperloop DSL (read‑only, MVP):

- Реализация RS внутри `rs/rsbus/src/main.rs` (op=`hyperloop.execute`), Python фасад — `backend/app/services/hyperloop_rs_bridge.py`.
- Команды:
  - `FLAGS.SET key=<k> value=<v>`, `FLAGS.UNSET key=<k>`, `FLAGS.APPLY_PROFILE name=<profile>`, `FLAGS.STATE`.
  - `TRACE.STEPS trace_id=<uuid>` — read‑only; возвращает `{trace_id, steps: []}`.
  - `INSPECTOR.RUN_ALL` — read‑only; проверка наличия ключевых серий метрик.
  - `JUDGE.*` — read‑only базовые решения (подготовка к P44 PDP RS).
- Метрики Prometheus (доступ через RSBus `metrics` и API‑отчёты):
  - `hyperloop_rs_latency_ms{phase}` — фазы parse/exec/total (бакеты/_count/_sum).
  - `rsbus_latency_ms{op}` — латентность операций шины.
  - `rsbus_backpressure_hits_total{op}` и `rsbus_backpressure_on{op}` — индикаторы backpressure.
  - `rs_security_limit_hits_total{kind}`, `rs_security_violations_total{kind}` — лимиты/нарушения безопасности.
- Админ‑отчёты:
  - `GET /api/admin/rs/latency-report` — p50/p95/p99 по RS фазам/RSBus ops.
  - `GET /api/admin/rs/report/p95` — агрегат p50/p95/p99 + backpressure (`total_hits`, `per_op`).

---

## Дополнение 2025‑09‑25 — DiamondEngine и RS Canary (P48R)

- DiamondEngine (бриллиантовый алгоритм):
  - Сервис: `backend/app/services/diamond_engine.py`
  - Интеграция в процессор (P30): `backend/app/services/processor_scheduler.py` — события `soul.diamond.trigger`, `soul.dream.rewire`; шаги подписи `svc.diamond.emotion.assess`, `svc.diamond.question.plan`, `svc.diamond.quant.generate`, `svc.dream.rewire.plan`; инциденты: `diamond_question_planned`, `diamond_quant_emitted`, `diamond_fallback_used`, `dream_rewire_done`.
  - Интеграция в чат: `backend/app/services/chat_service.py` — эмпатический hook перед отдачей ответа; при высокой эмоции планируется мягкий вопрос Архитектору в `processor_events(kind='outbound.text')`.

- Инспекторы (Жандарм, P29):
  - `backend/app/gendarme_tests/diamond_pipeline_health.py` (ключ: `diamond.pipeline.health`) — проверка шагов/успехов бриллиантового конвейера за 24h.
  - `backend/app/gendarme_tests/rs_actor_budgets.py` (ключ: `rs.actor.budgets`) — бюджеты p95/error_rate RS‑актеров/шины.
  - Регистрация: `backend/app/scripts/reg_inspectors.py` (upsert в `feature_inspectors`).

- RS Canary профиль (P48R):
  - Профиль `rs_canary_profile` добавлен в `backend/app/services/feature_flags_supervisor.py` → включает `rs.hyperloop.enabled=true`, `rs.hyperloop.mode=rs_primary_python_fallback`, `rs.hyperloop.canary_share=0.1`.
  - Включение через Hyperloop DSL: `FLAGS.APPLY_PROFILE name="rs_canary_profile"`.

## Дополнение 2025‑09‑26 — P49 Сон/Нейроперестройка (метрики/пороги/алерты)

- Метрики (экспорт Prometheus `GET /api/metrics/prometheus`):
  - `sleep_rewire_ratio_{p50,p95,p99}` — доля пересвязываний за цикл (окно наблюдений).
  - `sleep_rewire_epsilon_p50` — п50 эпсилон‑дрейфа.
  - `sleep_rewire_radius_p50` — п50 радиуса/глубины перестройки.
  - `sleep_rewire_events_total`, `sleep_rewire_edges_updated_total` — счётчики событий и обновлённых рёбер.
- Источники данных:
  - Processor (P30) событие `soul.dream.rewire` — нормализация связей; метрики пишутся из `backend/app/services/processor_scheduler.py`.
  - Экспорт в Prometheus добавлен в `backend/app/monitoring.py` (блок Sleep/Dream rewire metrics).
- Пороговые профили (в БД `soul_settings`):
  - `sleep.rewire.{epsilon,radius,max_edges}` — базовые параметры перестройки.
  - `sleep.profile.{light,deep,repair}` — JSON профили: epsilon/radius/max_edges.
  - Алерт‑бюджеты: `sleep.alerts.{rewire_ratio_max,epsilon_drift_max}`.
- Управление/DSL (через Hyperloop):
  - `DB.UPSERT table=soul_settings key=key values={"key":"sleep.rewire.epsilon","value":0.02}` и аналогично для остальных ключей.
- Acceptance:
  - Метрики видны в Prometheus; профили и пороги доступны через `GET /api/admin/soul/settings/all`; событие `soul.dream.rewire` фиксируется инцидентом `dream_rewire_done`.

## Текущие задачи и очередь процессов (P45/P30/P25/P38)

- Завершено:
  - Предвалидация (L2 Semantic QC) с Quality Gates: антиплейсхолдеры «шаг N», требование предметных действий, критериев приёмки и контекста связей (`Soul/scripts/pre_ingest_validate.py`).
  - Интеграция QC в загрузчик Hyperloop: `--require-qc --qc-report` (блокировка загрузки при провале порогов) — `Soul/scripts/ingest_quants_jsonl_via_hyperloop.py`.
  - Автоподбор параметров многопоточной загрузки (AIMD): `Soul/scripts/autotune_ingest_params.py`.
  - Neuro‑Assisted QC/Linkage: `Soul/scripts/neuro_assisted_qc.py` (`NEURO.QC.EVAL` + `QUANT.LINK`).
  - ТЗ P45 обновлено разделами 10.B–10.E (семантический QC, правила подготовки/промптов, оркестрация Processor/Sleep, нейро‑участие).

- В очереди (к исполнению после интеграции Планирование↔Навыки↔Нейросеть↔Cursor):
  - llm_refine трёх серий (`*.refine.jsonl`) — заявки созданы; обогащение конкретными действиями, `payload.plan|skill`, критериями приёмки.
  - deferred_qc — строгий повторный QC (пороги: `min_uniq≥0.95`, `max_jaccard≤0.7`, `max_char_jaccard≤0.85`).
  - deferred_ingest — многопоточный инжест только good (`--require-qc`), параметры по `autotune_ingest_params.py`.
  - Пост‑аудит связей — выборочный `QUANT.LINK.CHECK` + автолинковка по `payload.plan` при необходимости.

- Ответственные персонажи: Процессор (P30), Тренер/Нейросеть (P38), Жандарм/Судья (P29), Архитектор.

## Hyperloop DSL — Валидатор/Нормализация (Frontend)

- Утилита: `frontend/src/utils/hyperloopDsl.ts`
- Компонент: `frontend/src/components/HyperloopDSLValidator.tsx`
- Интеграции: `frontend/src/pages/RSDashboard.tsx`, `frontend/src/pages/GendarmePanel.tsx`, `frontend/src/pages/AdminPanel.tsx`

## RS Dashboard (Frontend/Backend)

- Страница: `frontend/src/pages/RSDashboard.tsx`
  - p95/p99 per op/phase (таблицы)
  - Сырые Prometheus метрики (`/api/admin/rs/metrics-raw`)
  - Топ ошибок по классам (из `rsbus_errors_total{class="..."}`)
  - Two-Keys профиль (`TWO_KEYS.REQUEST/APPROVE` + `FLAGS.APPLY_PROFILE`)
  - Тренды p95/p99 по nightly: ключ (op/phase), отображение последних записей
- Бэкенд метрики: `backend/app/services/rs_metrics_service.py`, админ‑роуты `backend/app/routers/rs_metrics_admin.py`, `rs_admin_dashboard.py`

## Nightly отчёты RS

- Роуты: `backend/app/routers/rs_nightly_admin.py` (`/generate`, `/recent`)
- Хранилище: `rs_nightly_reports` (id, generated_at, window_days, summary jsonb, diff_7d jsonb, created_at)
- Фон: `backend/app/background_tasks.py` — `RSNightlyReportsBackgroundTask`, автозапуск в `backend/app/main.py`
- Настройки: `rs.nightly.interval_sec`, `rs.nightly.window_days`
- Исключение коллизий: advisory‑lock (PostgreSQL) при запуске `_run_once()`

## PDP / Security (P44)

- Аудит PDP: `backend/app/services/pdp_audit_service.py`, таблица `p44_pdp_audit`.
- Админ‑роуты: `backend/app/routers/pdp_audit_admin.py` (`/api/admin/pdp-audit/recent`, `/api/admin/pdp-audit/stats`).
- Интеграция с RBAC: `backend/app/middleware/rbac_middleware.py` — запись allow/deny.

## Дополнение 2025‑09‑28 — RS Security Limits / RS Dashboard p50

Адресные лимиты RS (Control‑Plane):
- Таблица: `rs_security_limits` (upsert по `(op, subject_type, subject_value)`)
- Счётчики окна: `rs_security_counters(op, subject_type, subject_value, window_start, window_sec, requests_count, blocked_count)`
- Admin API: `POST /api/admin/rs/limits/set` — upsert лимита (RBAC: architect|soul.admin)
- DSL (движок Hyperloop, если включено): `RS.LIMITS.SET op=hyperloop subject_type={global|role|user} subject_value=... window_sec=<int> max_requests=<int> [enabled=true]`
- Рекомендованные профили:
  - global: 200/60s (фон)
  - role=architect: 600/60s
  - user=468326902: 600/60s

Наблюдаемость/алерты:
- Дашборд «RS Security Limits»: серии `requests_count`/`blocked_count` по `rs_security_counters{op="hyperloop"}`
- Алерт `RSLimitsSpike429` (SEV2): `blocked_count > 0.5 rps` (окно 2m), аннотации c risk/actions

- RS Hyperloop (P48R): включены серверные валидаторы 422 `invalid_json_contract` в RSBus (`rs/rsbus/src/main.rs`):
  - >50 команд в одном `commands` (errors[].code=422,class=invalid_json_contract)
  - `PLAN.DEPEND` с одинаковыми узлами (422 invalid_json_contract)
  - `TASK.UPDATE` с `payload` не‑объектом (422 invalid_json_contract)
  - длинная строка команды >1024 — игнор (0 results), счётчик `rs_security_limit_hits_total{kind="line_too_long"}`
- Инспектор `rs.security_limits` обновлён: прямой вызов RSBus (UDS) и сбор ошибок из `errors[]` и `results[].error`.
- RS Dashboard (frontend `RSDashboard.tsx`):
  - добавлена колонка p50 в таблицу `rsbus_latency_ms`;
  - вынесен виджет‑гистограмма ошибок по классам (из `rsbus_errors_total{class}`);
  - автообновление 5s сохранено (проверено под нагрузкой).
- DEV.CONNECT observability: панели/алерты (Prometheus/Grafana) по `dev_connect_latency_ms_{p50,p95}`, `dev_connect_error_total{type}`; алерт‑группа `dev_connect_rules` маршрутизируется в Telegram.

## Runbook — миграции и запуск (PROD-safe)

- Миграции (через Hyperloop):
  - `MIGRATIONS.STATUS`
  - `MIGRATIONS.APPLY revision=head`
  - Критично: ревизия `20250928_000090_add_ask_architect_enum.py` добавляет тип `ask_architect` в `desired_action_type`.
- Смоки после миграций:
  - `INSPECTOR.RUN_ALL`
  - `CORE.PIPELINE.RUN input_text="health check" WITH TRACE`
  - `TRACE.STEPS trace_id="<UUID>"` — наличие обязательной цепочки
- Демо-инжест (Windows PowerShell):
  - `python .\Soul\scripts\ingest_quants_jsonl_via_hyperloop.py --file "Soul\out\qc\exchange120_shard_00117.good.jsonl" --batch-size 25 --sleep-ms 250 --timeout 120 --threads 4 --max-reqs-per-minute 120 --adaptive`
  - Примечание (Windows): если `--require-qc` выдаёт mismatch путей, прогоните без `--require-qc` (сам QC ранее зафиксирован в `*.qc_report.json`).
- Sanity/метрики:
  - `GET /api/admin/soul/qa/quants_sanity?limit=10`
  - `GET /api/admin/dispatcher/metrics`
- Диспетчер (короткий цикл):
  - `POST /api/admin/dispatcher/run_for?minutes=1`
  - `GET /api/admin/dispatcher/metrics`

## AGE‑синхронизация (P11/P39): relation_type

- При выгрузке/синхронизации связей в AGE используем: `relation_type = COALESCE(connection_type::text,'semantic')` — во всех SQL/PIPE этапах для графа.
  - Реализация: `backend/app/services/age_sync_service.py` (`sync_tick`):
    - Инкрементальная выборка по `(created_at, id)` с tie‑breaker `age.sync.last_id` (исключает залипание при одинаковых временных метках).
    - MERGE рёбер в AGE; счётчики `inserted|updated|skipped` и лаг `age.sync.lag_sec` сохраняются в `soul_settings`.
    - Параллелизация MERGE: параметр `age.sync.concurrency` (default 16) — асинхронная обработка с семафором.
    - Производительность: `age.sync.batch_size` (по умолчанию 50; может быть увеличен для догоняния лагов), `age.sync.pages_per_tick` (сколько страниц обрабатывать за один тик), `age.sync.tick_time_budget_ms` (ограничение времени тика).
    - Метрики: `age_sync_merge_ms`, `age_sync_tick_ms`, `age_sync_throughput_eps`, тоталы `age.sync.{inserted,updated,skipped}_total`.

## Admin sanity для связей (QUANT.LINK.CHECK)

- Hyperloop DSL:
  - `QUANT.LINK.CHECK from_quant=<uuid> [to_type=<...>] [to_id=<...>]`

- Мини‑плейбук:
  - Найти свежие Кванты: `GET /api/admin/soul/graph/recent_quants?limit=10`
  - Проверить покрытие связей выборочно: запустить `QUANT.LINK.CHECK` по `from_quant`
  - Отчёты: `GET /api/admin/provenance/quant/{quant_id}`, `GET /api/admin/provenance/trace/{trace_id}`

## Batch‑инжест 10k (батчи по 10)

- Предпочтительный размер батча: 10.

- Пример запуска:
  - `python .\Soul\scripts\ingest_quants_jsonl_via_hyperloop.py --file <good.jsonl> --api https://mini.soulpulse.art --user-id 468326902 --batch-size 10 --sleep-ms 200 --timeout 120 --threads 12 --max-reqs-per-minute 180 --adaptive`
  - Оркестратор отчётов обновлён на батчи 10: `Soul/scripts/aggregate_ingest_report.py`.

## Harvest / Internet Crawler (усиление)

- Модуль: `backend/app/services/system/modules/harvest/internet_crawler.py`
- Добавлено: trafilatura для извлечения текста; langid для детекта языка; dedup через SimHash/MinHash; глубина 2 (в пределах домена); LLM‑rerank источников (DeepSeek: авторитетность/новизна/согласованность).
- Метрики: `internet_crawler_execute_duration_ms`, `crawler.quants`, `crawler.country_done`, `crawler.timeout`, `crawler.error`.

- Acceptance: после каждой тысячи — выборочный `QUANT.LINK.CHECK`, `INSPECTOR.RUN key=p29.sensory_coverage_threshold`, контроль P27 `signature_steps`.

### Политика связей Квант ↔ Проект (обновление)

- Связь Квант–Проект необязательна. Кванты могут существовать независимо от проектов.
- PROJECT.CREATE: при создании проекта автоматически создаётся базовый проектный Квант; добавляется связь quant(defines) → project.
- auto.link_quants: не создаёт проект; линковка допускается только при подтверждённом смысловом совпадении с существующим проектом (эвристики: подстрока thought_form∈name/description и/или Jaccard≥порога). Дедупликация исключает повторные связи.
- Квант может создать проект только при высокой энергии и наличии согласованной Цели без проекта (реализуется как отдельный контролируемый путь; по умолчанию выключено настройками).

Настройки в DB (soul_settings):

- auto_link.match.jaccard_min (float, по умолчанию 0.30)
- auto_link.match.title_substring (bool, по умолчанию true)
- auto_link.project_id (uuid|NULL)
- auto_link.create_project.enabled (bool, по умолчанию false)
- auto_link.create_project.energy_min (float, по умолчанию 0.80)

---

# Структура проекта SoulPulse (v8.0.4)

Назначение: единая карта модулей, цепочек данных, интерфейсов и документов. Версия 8.0.4 включает унификацию алгоритма генерации Квантов (единую сборку промпта) и корректную batch‑стратегию для PROD.
---

## Ключевые изменения (дополнение 2025‑09‑15)

- LLM маршрутизация (ТЗ 14):
  - `LLMManager`: выбор маршрутов из `backend/config/llm_routing.yaml`, учёт `locale` (EN → приоритет OpenAI), метрики `llm.route_selected`.
  - `LLMClient`: failover по маршрутам, Circuit Breaker (окно/порог/cooldown, half‑open), метрики `llm.cb_*`, учёт `limits` (rpm/rps/budget) в метриках. Политика актуализирована (P14): DeepSeek — для сложных/квант/чат; сервисные типы (`planner`, `consistency`, `judge`, `emoji_analysis`, `emotion_detection`, `translator`, `introspection_quant`, `self_consistency`, `soul_optimize*`, `reminder`) — первично Aux Phi‑4; фоллбек DeepSeek. Реализовано в `backend/app/services/llm_client.py` (request_type→provider).
- Многоязычие (ТЗ 15, MVP‑1):
  - `language_service.py`: определение языка; `soul_core_manager.py` → `ROUTER_CONTEXT.locale` и `[LANG_POLICY]` в SYSTEM.
  - `translation_service.py`: утилита переводов ru↔en (LLM‑бэкенд), готова к вызову для унификации.
  - Нормализация промптов отложена (см. P15).
- Компакция памяти (ТЗ 16, MVP):
  - `SleepService.run_sleep_cycle`: мягкий декей энергии, авто‑архив слабых, дедуп по одинаковому `thought_form`, создание summary‑квантов и связей, ослабление связей.
  - Новый эндпойнт: `POST /api/soul/sleep/dry_run` — предпросмотр без изменений.

- NeuroTraining (ТЗ 38, добавление):
  - TRAIN/BATCH/LEARN контуры: расширение Processor (P30) стадией Learn; метрики качества квантов; гибридный ретривер (вспомогательный) без нарушения STRICT_JSON.
  - Hyperloop DSL команды: `BATCH.GENERATE_QUANTS`, `TRAIN.EVAL.LAST_BATCH`, `LEARN.APPLY_FEEDBACK`.
  - Индексы БД: оценки качества батчей; приоритеты типов связей для ранжирования deep‑памяти.

- Project Management (ТЗ 40, добавление):
  - Сущности (факт): `projects`, `tasks(project_id, cpm_duration_days)`, `risks`, `changes`. Зависимости задач — `task_dependencies` (ensure SQL есть в репозитории).
  - Роли и процессы: Менеджер/Администратор/АУ/Библиотекарь/Разработчик/Оптимизатор/Тестировщик/Аналитик/Шаблонизатор/Сисадмин/Интегратор/Рискмен — процессные ветви методологий (UI P23, репозиторий методологий — план).
  - Hyperloop DSL (реализовано/частично): реализованы `PROJECT.CREATE|LIST`, `PLAN.TASK.ADD|DEPEND`, `PLAN.CPM.CALC`, `TASK.UPDATE`; задокументировано (WIP) `PROJECT.GET|UPDATE|DELETE`, `RISK.*`, `CHANGE.*`, `METHODOLOGY.*`, `ROLE.*`. Добавлены быстрые команды подключения LLM‑агентов: `SESSION.CLAIM|PING|RELEASE`, `DEV.CONNECT`, `LLM.MIRROR(.BATCH)`.
  - Быстрый контур Hyperloop закреплён в `Soul/P40_TZ_Project_Management_Soul_v1_0.md` §2.3 (PowerShell прелюдия, PROD пути, команды подключения/смоков/релиза ветки).
  - Пути сущностей/DSL:
    - БД: `projects(id,name,owner,methodology,priority,...)`, `tasks(id, project_id uuid, cpm_duration_days numeric, ...)`, `risks(id, project_id, ...)`, `changes(id, project_id, ...)`; `task_dependencies(predecessor, successor, dep_type)`.
    - DSL (P36/P40): `backend/app/services/hyperloop_engine.py` — обработчики `PROJECT.*`, `PLAN.TASK.*`, `PLAN.CPM.CALC`, `TASK.UPDATE`.
    - UI (P23): Project/Gantt/Risks/EVM (минимальные виджеты; методологии/роли — в планах).
  - Миграция (P40): `backend/alembic/versions/20250921_000070_p40_project_management.py` — `projects/risks/changes`, расширение `tasks` (`project_id`, `cpm_duration_days`).
  - Инварианты: P27 Delivery Guard, P28 флаги `pm.*`, интеграции с P30/P36 и проекциями на Кванты/Цели/Напоминания/Навыки.

#### Дополнение — P61 Проектный репозитарий (структурированные ТЗ/реестры в БД)

- ТЗ: `Soul/P61_TZ_Project_Repository_v1_0.md`
- БД: `project_repo_documents`, `project_repo_meanings`, `project_repo_tags`, `project_repo_links`, `project_registry_entries` (реестры `system_master_docs`, `project_structure`).
- DSL: `REPO.DOC.UPSERT|GET|LIST`, `REPO.MEANING.UPSERT|LIST`, `REPO.LINK.ADD`, `REPO.SYNC.LOCAL`, `REGISTRY.UPSERT|GET|LIST|SYNC.LOCAL`.

#### Дополнение — P63 Онбординг внешних разработчиков

- ТЗ/спецификации: `Soul/P63_TZ_Soul_External_Developers_Onboarding_v1_0.md`, `Soul/P63_RBAC_Roles_for_External_Developers_v1_0.md`, `Soul/P63_Reminders_And_ChangeFlow_Spec_v1_0.md`, `Soul/P63_APP_Server_Structure_v1_0.md`.
- Клиентские инструменты: `Soul/scripts/dev_invite_generate.py`, `Soul/scripts/dev_onboarding_client.py`, `Soul/scripts/roles_editor_cli.py`.
- Шаблоны и урезанные правила: `Soul/cursorrules_external_v1_0.md`, `Soul/templates/P63_Template_Project_Registry_v1_0.md`, `Soul/templates/P63_Template_Change_Request_v1_0.md`.
- Рабочая зона репозитория (P63): единая и находится на фронтенд‑сервере (APP2). Дубли на других серверах запрещены (во избежание рассинхронизации). Корень проектов — ключ `dev.projects_root` в БД; под ним создаются каталоги проектов с подпапками `soul` и `doc`.
- Инспекторы: `repo.enforce` (паритет файл↔БД, coverage связей), `repo.best_practices`, `registry.enforce`.
- Интеграции: P40 (план/лог/методологии), P45 (quant_links→repo_*), P53 (глоссарий), P58 (Hyperloop Projects & Planning API).

#### Дополнение — P42 Вспомогательная LLM / Failover

- ТЗ: `Soul/P42_TZ_Soul_Auxiliary_LLM_v1_0.md`
- Назначение: сервисные функции и автоматический failover при недоступности primary провайдера.
- Интеграции: P01/P03/P14/P16/P21/P22/P27/P28/P29/P30/P32/P41/P43/P45/P50/P51.

---

### Дополнение 2025‑09‑28 — P51 Структура Личности Соул

- ТЗ: `Soul/P51_TZ_Soul_Personality_Structure_v1_0.md`
- БД: `soul_personality`, `soul_personality_norms`, `soul_personality_traits`, `soul_personality_attachments`, `soul_personality_links`, `soul_personality_policies`, опционально `core_quants`
- DSL (P36): `PERSONALITY.DEFINE|NORM.ADD|TRAIT.SET|ATTACH.SET|POLICY.SET|WEIGHTS.RECALC|ACTIVATE|INSPECT`
- Кванты: классы `personality_*` (`norm_violation|bias_adjustment|router_hint|goal_alignment|search_filter`), обязательные `quant_links`
- Интеграции: P01/P03/P25/P30/P35/P37/P49/P50 (policy‑hints, ранги, сон, инциденты)
- Метрики/Инспекторы: `personality.*`, `sleep_rewire_personality_*`, инспекторы `personality.weights.consistency|links.coverage|policies.required`

---

## Acceptance (2025‑09‑22) — P27/P36 зелёные, смоки ок

- Инспекторы (P27): `INSPECTOR.RUN_ALL` — passed; за 24h присутствуют обязательные шаги: `svc.soul.preanalysis`, `svc.llm_client.send`, `svc.llm_client.recv`, `svc.parser.json_strict`, `svc.soul.router_decide`, `svc.chat.reply_render`. `delivery_guard.enforce` активен (prod_safe).
- Hyperloop (P36): `CORE.PIPELINE.RUN ... WITH TRACE` — возвращает `trace_id`; `TRACE.STEPS` — ok; `signature_saved_steps` > 0.
- API: Batch(stateless) — `desired_action=[]`; Single — ok; Sleep(dry_run) — ok; Sanity последних квантов — ok; Refresh‑rank — ok; Dispatcher run/metrics/stop — ok; LLM тесты DeepSeek/Aux — ok.

---

### Дополнение 2025‑09‑26 — Финализация Data QC/ingest (gen→good, канонический агрегатор)

- Новые служебные скрипты (офлайн, `Soul/scripts`):
  - `merge_gen_into_base_goods.py` — слияние `*.good.gen.jsonl` в базовые `*.good.jsonl` с атомарным бэкапом (`.bak`) и обновлением `*.qc_report.json` (`good_file`, `counts.good`, `sha256_good`).
  - `recompute_qc_metrics_from_gen.py` — пересчёт QC‑метрик из исходника `gen` и синхронизация `*.qc_report.json` под базовые пути `good`.
  - Обновлён `aggregate_ingest_report.py` — учитывает только канонические good‑файлы, где `qc.good_file == <путь к *.good.jsonl>` и файл непустой (исключены промежуточные артефакты вида `*.good.gen.good.jsonl`).

- Инварианты и канон:
  - Каноническим источником для инжеста считается базовый `*.good.jsonl`, на который указывает `good_file` в парном `*.qc_report.json`.
  - Агрегатор отчёта сканирует только такие канонические good; шум/дубликаты исключены из сводки.

- Acceptance целевого прогона (после финализации):
  - `SKIP=0`, `5xx/429=0/0`, `COMMANDS_SENT` зафиксирован.
  - В шаге финализации достигнуто: `files_total=12`, `COMMANDS_SENT=1044`, `SKIP=0`, `5xx/429=0/0` (канонический набор по QC.good_file).

- Повторяемые команды (Windows PowerShell):
  - Слияние gen→good с синхронизацией QC:
    - `python .\Soul\scripts\merge_gen_into_base_goods.py --qc-dir Soul/out/qc`
    - `python .\Soul\scripts\recompute_qc_metrics_from_gen.py --qc-dir Soul/out/qc`
  - Массовый инжест good (адаптивно):
    - `python .\Soul\scripts\ingest_all_goods.py --api https://mini.soulpulse.art --user-id 468326902 --batch-size 50 --sleep-ms 200 --timeout 120 --threads 12 --max-rpm 180 --adaptive --group 10`
  - Финальная сводка:
    - `python .\Soul\scripts\aggregate_ingest_report.py`

Примечание: прежние пустые `*.good.jsonl` при наличии содержательных `*.good.gen.jsonl` больше не влияют на сводку и Acceptance; конвейер переведён на базовые пути good.

### Дополнение 2025‑09‑26 — Догенерация, мягкий QC и автозагрузчик

- Дополнение в P38: `Soul/P38_TZ_Soul_NeuroTraining_v1_0.md` (§20).
- Добавляются оверрайды QC (`Soul/config/qc_overrides.yaml`), оркестратор `auto_dogenerate_and_ingest.py` (циклический), расширения `llm_generate_missing_and_ingest.py` (web‑добыча).
- Процесс: волны догенерации (28–32 строки), смягчённый QC по выборочным семействам, непрерывный инжест, автолинковка и проверка покрытия.

## Security/Authorization (P44) — кратко

- Модель: RBAC как база + ABAC предикаты (канал/окна/подписка), точечный ReBAC (ownership), Two‑Keys для опасных команд (P36 NET/DEPLOY/DB/SCHEMA).  
- PEP/PDP: централизованный `rbac_middleware` (PEP) и `RBACService` (PDP) с матрицей эндпоинтов/прав/лимитов; аудит отказов/разрешений.  
- OpenAPI (P22): добавлены `securitySchemes` (`TgHeaderAuth`/`BearerAuth`); админ‑пути помечены секцией `security` (требуются заголовок `X‑Telegram-User‑ID` и Bearer JWT).  
- Mini‑App/Web: строгий `X‑Telegram-User‑ID`; в Web — сверка `tg_id` в JWT и заголовке, при несовпадении 401.  
- Флаги (P28): профиль `prod_safe` запрещает `DISABLE_RBAC`/`TEST_NO_DB` в PROD.  
- Two‑Keys: заявки/аппрув по ключам, разные субъекты, TTL, хэш payload; обязательны для опасных Hyperloop‑команд.

Дополнения (2025‑09‑23):

- ABAC в `backend/app/middleware/rbac_middleware.py`: детект канала (`mini` по заголовку/отсутствию Bearer, `web` по Bearer) и окно времени UTC (`HH:MM‑HH:MM`); зависимость `require_channel(...)`.
- ReBAC ownership: проверка *.self через конфиг эндпоинтов и зависимость `require_self_param(param_name, kind='tg|id')`.
- Two‑Keys усиление: `backend/app/routers/two_keys_admin.py` (TTL, запрет same‑subject, `verify_two_keys_approval(...)`) и `backend/app/routers/pc_admin.py` (строгая серверная проверка Two‑Keys).

### WebAuth MiniApp → Web (P47)

- Эндпоинты `backend/app/routers/web_auth.py`:
  - `POST /api/web-auth/issue-web-cookie` — устанавливает HttpOnly cookie `sp_web` (TTL 10 мин; `Secure; SameSite=Lax; Domain=.soulpulse.art; Path=/`).
  - `POST /api/web-auth/issue-one-time-token` — выдаёт OTP (окно 300с) для fallback.
  - `POST /api/web-auth/verify-otp` — проверка OTP; устанавливает HttpOnly cookie `sp_token` (до 12ч; `Secure; SameSite=None; Domain=.soulpulse.art; Path=/`).
- Middleware в `backend/app/main.py`: `web_session_restore_middleware` — восстанавливает `X-Telegram-User-ID` из `sp_web`/`sp_token` (JWT `sub`/`tg_id`). Исключения: `/api/*`, `/ws/*`, `/webhook/*`.
- Требования безопасности: токены не в URL/JS; только HttpOnly cookie; rate limiting для auth‑путей; заголовки безопасности XFO/CSP/HSTS/Referrer/Permissions.
- FE: в MiniApp используется основной cookie‑путь, OTP — как резерв. Web не требует `localStorage`.

## Persona Registry — системные персонажи

- Реестр: `docs/PERSONA_REGISTRY_v1_0.md` (машинно‑читаемый список персонажей, их функций/ролей/полномочий/объектов и зон ответственности).  
- Авто‑поддержка: «Архивариус/Библиотекарь» сканирует код/документы и обновляет реестр, проверяет ссылки и синхронизацию с P44/P27/P30/P38.  
- Персонажи (свод): Соул (ядро), Архитектор, Фронтмен, Страж (RBAC), Процессор, Тренер (P38), Архивариус.

Новый актор: Агент безопасной эфемерной связи (P43)

- Документ: `Soul/P43_TZ_Agent_Secure_Ephemeral_Comms_v1_0.md`
- DSL команды: `NET.*` (P36), RBAC=sysadmin, Two‑Keys на опасные действия (P44)
- Интеграции: P27 подпись `svc.agent.net.*`, P28 профили `net.*`, P29 инспекторы, P30 события Processor
- Реализация (обновление):
  - Backend `backend/app/routers/agent_comm.py`: комнаты/мастер + WebRTC сигналинг:
    - WS: `/api/ws/agent-rooms/{room_id}/signal?peer_id=<session_id>&name=<opt>`
    - ICE конфиг: `GET /api/agent-rooms/webrtc/config` (STUN/TURN из ENV)
    - Админ‑просмотр: `GET /api/agent-rooms/webrtc/participants?room_id=`
    - Управление: `GET/POST /api/agent-rooms/sessions/status|pause|resume|disconnect|kill`, `GET/POST /api/agent-rooms/kill`, `GET/POST /api/agent-rooms/auto_resume?enabled=...`
    - Метрики: `POST /api/agent-rooms/webrtc/metrics`
  - Config `backend/app/config.py`: переменные `ICE_STUN`, `ICE_TURN_URI`, `ICE_TURN_USERNAME`, `ICE_TURN_PASSWORD`, `ICE_TURN_TLS`; метод `webrtc_ice_servers()`.
  - UI `/agent/comm`: добавлены кнопки камера/микрофон/экран, сетка участников, чат через сигналинг.
  - Логика «главного экрана» (WS `set_main`/`main_changed`) и опция автодопуска комнаты `auto_resume`.

Ссылки: `Soul/P44_TZ_Soul_Roles_and_Authorization_v1_0.md`, `docs/openapi-p20-telegram-bots.yaml`.

## Ключевые изменения v8.0.4 (2025‑09‑13)

- Единый промпт для `generate_quant` и `generate_quants`: блоки `[CORE][ROUTER_CONTEXT][MODULES][OUTPUT_SPEC][NEGATIVE]` + контекст истории. RouterV2 выбирает активные модули.
- Batch‑стратегия (устранение greenlet_spawn):
  - LLM вызовы в batch выполняются без обращения к БД (`LLMManager.get_model_for_function(db=None)`, `LLMClient.send(db=None)`).
  - Роутер `process_batch` имеет безопасный фоллбек на одиночную генерацию при ошибках.
  - В stateless‑ветке `desired_action` в ответе нормализуется в пустой массив (несохраняемые действия запрещены).
  - Событие аудита `soul_batch_fallback_single` фиксируется при фоллбеке.
- Переменные окружения:
  - `SOUL_DISABLE_QUANT_PERSIST_BATCH=1` — принудительно включить stateless‑ветку batch.
  - `TEST_NO_DB=1` — полностью отключить доступ к БД для тестовых вызовов API.
- Документация: добавлены новые версии `SOUL_PIPELINE_v1_1.md` и `PROMPTS_AND_MEMORY_ALG_v2_26.md` с точной спецификацией.

---

## Единый конвейер генерации квантов

переносука

- Чат (онлайн): `backend/app/services/chat_service.py` → `SoulCoreManager.generate_quants(...)`
- Авторежим (фон): диспетчер → план/материализация → `SoulCoreManager.generate_quants(...)`
- API: `POST /api/soul/process` → `_process_soul_impl` → `SoulCoreManager.generate_quant(...)`
- Batch API: `POST /api/soul/process_batch` → `SoulCoreManager.generate_quants(...)`

### RS интеграция (P48R, Hyperloop)

- Python фасад сохраняет публичные контракты API/DSL и шаги подписи (P27).
- Делегация горячего пути Hyperloop в RS (sidecar) выполняется через мост:
  - Файл: `backend/app/services/hyperloop_rs_bridge.py`
  - Включение/режимы: настройки в БД (`rs.hyperloop.*`) и ENV (`HYPERLOOP_RS_*`).
  - Режимы: `python_only | rs_shadow | rs_canary | rs_primary_python_fallback | rs_primary_no_fallback`.
  - Маршрут: `HyperloopEngine.execute()` → (опционально) `HyperloopRSBridge.execute()` → RS, шаг подписи `svc.rs.proxy`.
- Эндпоинты (без изменений):
  - `POST /api/hyperloop/execute` — RBAC `soul.admin`; возвращает `ok`, `trace_id`, `results[]`, `signature` (+ `incidents`).
  - `POST /api/hyperloop/execute-signed` — HMAC; включается флагом `hyperloop.allow_signed=true`.
- Инспекторы RS (минимум):
  - `rs.parity` — наличие `svc.rs.proxy` в последних трассах.
  - `rs.performance_sla` — p95 по RS (N/A, если нет метрик), бюджет по умолчанию 3 ms.

#### RS наблюдаемость и отчёты (v2)

- Метрики RSBus/Hyperloop (Prometheus):
  - Латентности: `rsbus_latency_ms{op}`, `hyperloop_rs_latency_ms{phase}`.
  - Ошибки и бэкпрешер: `rsbus_errors_total{op,class}`, `rsbus_backpressure_hits_total{op}`, `rsbus_backpressure_on{op}`.
  - Паритет/ошибки: агрегаты `error_rate`/`mismatch_rate` (на стороне сервиса отчётов).
  - Processor (P30 RS): `processor_rs_tick_latency_ms{stage}`.
  - PDP (P44 RS): `p44_pdp_decisions_total{decision,reason}`.
  - Сенсоры RS: `rs_sensors_ingest_total{kind}`, `rs_sensor_value{kind}`.
  - DEV.CONNECT (Python/RS мост): `dev_connect_latency_ms_p50|p95`, `dev_connect_total{status}`, `dev_connect_error_total{type}`; правила `ops/prometheus/rules_dev_connect.yml` → `/etc/prometheus/rules/rules_dev_connect.yml`.

- Сводки/эндпоинты:
  - `GET /api/admin/rs/report/p95` — агрегированная p50/p95/p99 + avg/count + backpressure/error/mismatch‑rate + текущий режим `mode`.
  - `GET /api/admin/rs/parity/summary` — счётчики паритета по инцидентам за окно.
  - `GET /api/admin/rs/dashboard/summary` — мини‑дашборд: p95 сводка + счётчики запросов/ошибок.

- Админ‑UI:
  - Страница `RS Dashboard` (`/rs/dashboard`): пиковые латентности, ошибки по классам, backpressure hits, parity/mismatch‑rate, текущий режим, объём трафика; форма запуска Hyperloop DSL с нормализацией кавычек/escape.

#### RS Processor/PDP (read‑only)

- Processor RS (tick/agenda): `op="p30.processor.tick"` (вход: `{agenda[],policies{max_qps}}`, выход: `{next[], backpressure}`), стадии parse/plan/act/observe/learn с метриками.
- PDP RS: `op="p44.pdp.decide"` (вход: матрица контекста; выход: `{decision, code, reason}`), паритет с Python‑PDP; журнал решений в `p44_pdp_decisions_total`.

#### Сенсоры RS (read‑only расширения)

- Операции: `sensor.ingest|sensor.preview|sensor.stats` (без побочных эффектов) с метриками `rs_sensors_ingest_total`, `rs_sensor_value`.
- Инспектор `rs_sensors_smoke` включён в RUN_ALL.

#### Безопасность / Two‑Keys / ABAC (P44)

- Two‑Keys: опасные операции (например, `FLAGS.APPLY_PROFILE name=prod_safe|dev_full`) требуют одобрения (Python фасад + RSBus проверка).
- ABAC/PDP в RS — паритет с Python; журнал решений.
- P27: требуемые шаги подтверждаются инспекторами (`rs_trace_linking`, `rs.parity`).

#### P27 Guard RS (P48R)

- Python фасад Delivery Guard поддерживает делегацию в RS по режимам `python_only|rs_shadow|rs_canary|rs_primary_python_fallback|rs_primary_no_fallback`.
- Мост/фасад: `backend/app/services/p27_rs_bridge.py`.
- Включение и режимы:
  - ENV: `P27_RS_ENABLED`, `P27_RS_ADDR` (dev: `http://127.0.0.1:7072`), `P27_RS_TIMEOUT_MS`, `P27_RS_MODE`, `P27_RS_CANARY_SHARE`.
  - DB/Settings: чтение через `SoulSettingsService` (приоритет ENV для stateless RS).
- Инспектор: `rs.p27_guard` — проверка минимального кейса (`required=['svc.chat.reply_render']`).
- Статус PROD: shim sidecar на `127.0.0.1:7072` активен; `rs.p27_guard` — passed при `P27_RS_MODE=rs_canary`.

#### P29 Inspectors RS (P48R)

- Назначение: вынесение базовых проверок качества/здоровья Жандарма (P29) в RS‑сайдкар.
- Мост/фасад: `backend/app/services/p29_rs_bridge.py`.
- Инспектор: `backend/app/feature_plugins/rs_p29_health.py` → `INSPECTOR.RUN key=rs.p29_health`.
- Включение и режимы:
  - ENV: `P29_RS_ENABLED`, `P29_RS_ADDR` (dev: `http://127.0.0.1:7073`), `P29_RS_TIMEOUT_MS`, `P29_RS_MODE`, `P29_RS_CANARY_SHARE`.
  - Режимы: `python_only | rs_shadow | rs_canary | rs_primary_python_fallback | rs_primary_no_fallback`.
- Статус PROD: shim sidecar на `127.0.0.1:7073` активен; `rs.p29_health` — passed при `P29_RS_MODE=rs_canary`.

### Структура сообщений к LLM

```text
[CORE] — системные инструкции Souls
[ROUTER_CONTEXT] — JSON о включённых модулях/фильтрах
[MODULES] — инструкции активированных модулей
[PLANNER_FEEDBACK] — краткий фидбек планера (если включён)
[DA_HINT] — опциональные подсказки для desired_action (валидация сервером)
[OUTPUT_SPEC] — формат ожидаемого JSON
[NEGATIVE] — запреты и ограничения
+ Контекст истории (до 12 сниппетов)

```

### JSON‑спецификация кванта (сводка)

- `thought_form: str`
- `composite_emotion: { valence: float, intensity: float, entropy: float, label: str }`
- `desired_action: []` (в stateless‑batch всегда пусто)
- `energy_weight: float [0..1]`
- `tags: List[str]`

Полная спецификация и примеры — см. `docs/SOUL_PIPELINE_v1_1.md`.

---

## Batch‑режимы

- Параметр запроса: `persist_all: bool` (по умолчанию false на UI/инструментах диагностики).
- Режимы исполнения:

  1) Stateless (рекомендован для PROD диагностики):

     - Нет обращения к БД в LLM‑вызовах.
     - `desired_action=[]` в ответе API.
     - Подходит для быстрых проверок, A/B и регрессионных тестов.

  2) Persistent:

     - Полный путь с сохранением сообщений/квантов/связей.
     - Требует устойчивого async‑контекста БД.
- Фоллбек: при ошибке batch происходит откат и запуск одиночной генерации.

ENV: `SOUL_DISABLE_QUANT_PERSIST_BATCH=1` принудительно включает stateless.

---

## Эндпоинты и проверки

- Health: `GET /api/health`
- Проверка БД: `GET /api/admin/soul/db/check`
- LLM test: `GET /api/admin/soul/llm/test?provider=deepseek&prompt=ping`
- Одиночная генерация: `POST /api/soul/process { input_text, num_candidates }`
- Пакетная генерация: `POST /api/soul/process_batch { input_text, num_quants, persist_all }`
- Voice TTS (P19): `POST /api/voice/tts { text, voice?, format=wav|ogg|mp3, persona_key?, user_id?, dry_run? }`
- QA sanity: `GET /api/admin/soul/qa/quants_sanity?limit=N`
- Provenance Admin (P11): `GET /api/admin/provenance/quant/{quant_id}`, `GET /api/admin/provenance/trace/{trace_id}` — видны в `/api/openapi.json`
- QA сенсорика: `GET /api/admin/soul/qa/sensory_coverage`, `POST /api/admin/soul/qa/generate_sensory`, `POST /api/admin/soul/qa/sensory_backfill` (RBAC: soul.admin; фичефлаги OFF по умолчанию)
- Refresh rank MV: `POST /api/admin/soul/refresh-rank`
- Sleep (MV обслуживание): `POST /api/soul/sleep?dry_run=true|false`
- Sleep dry‑run (компакция/архив, предпросмотр): `POST /api/soul/sleep/dry_run`
- QA Admin README: `docs/ADMIN_QA_CHECKS_README.md`

---

## Языковая политика ответа ([LANG_POLICY])

- Язык ответа определяется ИСКЛЮЧИТЕЛЬНО по тексту секции '=== ТЕКУЩИЙ ЗАПРОС ==='.
- Системные/модульные инструкции, история и иные контекстные блоки не влияют на выбор языка.
- Для смешанных запросов выбирается язык первого полноценного предложения.
- Если язык не удаётся однозначно определить — используется русский.
- Реализовано в `backend/app/services/soul_core_manager.py` путём добавления блока `[LANG_POLICY]` в SYSTEM.

Примеры запросов и нормализация — см. `SOUL_PIPELINE_v1_1.md`.

---

## Пути и окружения

- Канонический домен PROD Mini‑App: `mini.soulpulse.art` (единственный активный `server_name` в прод‑конфиге).
- PROD API: `https://mini.soulpulse.art/api`
- Канонический корень фронтенда (SPA): `/var/www/soulpulse/frontend`
- Nginx PROD конфиг: `/etc/nginx/sites-enabled/03-mini_soulpulse.conf`
- Таймауты Nginx (PROD): `proxy_read_timeout=120s`, `proxy_send_timeout=120s` — установлено и проверено (`nginx -t` ok, reload без ошибок)
- Nginx TEST конфиг (в репозитории): `nginx_test_soulpulse_art.conf` (на сервере рекомендуется зеркалировать PROD‑структуру)
- PROD ENV: `/etc/soulpulse/miniapp_backend.env` (ключи: `DATABASE_URL, BOT_TOKEN, BOT_TOKENS, JWT_SECRET, LLM_PROVIDER, DEEPSEEK_API_KEY, DEEPSEEK_MODEL, CORS_ORIGINS, SOUL_DISABLE_QUANT_PERSIST_BATCH, TEST_NO_DB`)
- RS ENV (P48R): `HYPERLOOP_RS_*`, `P27_RS_*`, `P29_RS_*` (адреса/таймауты/режимы/canary доля)
- systemd: `/etc/systemd/system/soulpulse-backend.service`
- SSH ключ: `deploy/ssh_keys/app_server_key` (локально); на сервере используются системные ключи `root`.

Voice (P18/P19/P49) — канонично (PROD):

- Провайдер по умолчанию: Piper (оффлайн). Фоллбек: Yandex SpeechKit при наличии ключа.
- Модели Piper: `/opt/piper/models` (например: `ru_female_calm.onnx` + `ru_female_calm.onnx.json`).
- ENV:
  - `ENABLE_VOICE_TTS=1`
  - `TTS_PROVIDER=piper|yandex_speechkit`
  - `TTS_VOICE=ru_female_calm` (ID из реестра/конфигурации)
  - `PIPER_MODEL_DIR=/opt/piper/models`
  - `FFMPEG_BIN=ffmpeg`
  - `YANDEX_SPEECHKIT_API_KEY=<optional>` (для фоллбека)
  - `YANDEX_SPEECHKIT_LANG_DEFAULT=ru-RU`

P49 (Сенсорика: Голос/Речь) — интеграция:

- Поток: Audio Ingest → ASR (P18) → сегментация/смыслы → эмоции (просодика+контекст) → ретривал памяти (P39) → ответ → TTS (P19).
- Подписи (P27): `svc.sensory.audio.decode`, `svc.voice.asr`, `svc.text.segment`, `svc.meaning.extract`, `svc.emotion.voice.detect`, `svc.memory.retrieve`, `svc.voice.tts`.
- RS‑режим (P48R): допустим `rs_canary|rs_primary_*` для segment/emotion/retrieve с инспекторами `rs.parity`/`rs.performance_sla`.

Примечание (2025‑09‑15): На PROD исправлен конфиг Nginx (убраны конфликтующие backup/include файлы), `nginx -t` проходит, сервис активен; backend сервис перезапущен, sanity‑проверки API прошли успешно.

Примечание (2025‑09‑21): Подняты таймауты Nginx до 120s для mini.soulpulse.art; внешние смоки прошли, 5xx не наблюдается. OpenAPI содержит пути `/api/admin/provenance/*`. В Prometheus‑экспорте добавлены гейджи provenance: `provenance_edges_count_1h`, `provenance_edges_count_24h`, `provenance_edges_per_quant_{avg,p50,p95}`, `provenance_ms_overhead_p95`.

### Дополнение 2025‑09‑22 — Голоса персон (каталог/привязки/UI)

- База каталога голосов (новые таблицы):
  - `voice_samples(id,label,provider,voice_id,rate,emotion,file_path,persona_key,created_at,updated_at)`
  - `prompt_voice_binding(prompt_key PRIMARY KEY, sample_id REFERENCES voice_samples)`
  - DDL и наполнение: `backend/scripts/sql/voice_catalog.sql` (альтернатива — `backend/scripts/register_voice_samples.py`).
- Резолв голоса при синтезе (порядок приоритета):

  1) `user_persona_voice(user_id, persona_key)`
  2) `persona_voice_profile(persona_key)`
  3) `prompt_voice_binding → voice_samples` (новый фоллбек)
  4) `tts.default.*` из `SoulSettingsService`

  - Реализовано в: `backend/app/routers/voice_tts.py` и в телеграм‑потоке `backend/app/telegram.py` (для sendVoice).
- Админ‑API каталога:
  - `GET /api/voice/admin/samples` — список сэмплов
  - `GET /api/voice/admin/bindings` — привязки промптов к сэмплам
  - `GET /api/voice/admin/file/{path}` — отдача файлов (ограничено RBAC `soul.admin`)
  - `POST /api/voice/set_voice { persona_key, voice_id, rate?, pitch? }` — задание профиля персоны (upsert `persona_voice_profile`).
- UI мини‑приложения (админ/архитектор): страница управления голосами `/#/admin/voice`.
  - Файл: `frontend/src/pages/VoiceAdmin.tsx`; маршрут подключён в `frontend/src/App.tsx`.
  - Возможности: прослушивание сэмплов, выбор персоны из списка промптов, привязка голоса.
- Выбранные привязки на PROD (зафиксировано каталожным SQL и профилями):
  - `Soul_Core` → `ermil`, rate 0.90, emotion `neutral`
  - `FR_Ranevskaya_Persona_v1_4` → `jane`, rate 0.72, emotion `evil`
  - `flow_prompt-3_v4` → `ermil`, rate 1.06, emotion `good`
  - `Zhvanetsky_Persona_v4_1` → `filipp`, rate 1.00, emotion `neutral`
  - `zhvan_prompt_clean_v3_3` (Кли) → `ermil`, rate 1.06
  - `Ved_prompt_Masterpiece_v4_3` → `ermil`, rate 0.88 (+FX «cosmic reverb»)
  - `Kabbalah_prompt-3_v16` → `ermil`, rate 0.92
  - `female_resonance` → `oksana`, rate 0.80, emotion `evil`
  - `LT_Prompt_Masterpiece_v1_9` → `oksana`, rate 0.85
  - Актуальные файлы‑сэмплы задокументированы в `Soul/voices/VOICE_CATALOG.md`.
- ENV обновлено: `TTS_PROVIDER=yandex_speechkit TTS_VOICE=ermil TTS_RATE=0.9` (см. `tmp/env.prod`).

---

## Связанные файлы и модули

- Ядро: `backend/app/services/soul_core_manager.py`
- Роут: `backend/app/routers/soul.py` (ветка batch и фоллбек)
- Последовательности (P30): `backend/app/services/sequence_engine.py` — планирование шагов analyze→search→answer/deliver→persist; шаг подписи: `svc.sequence.plan`.
- RouterV2: `backend/app/services/soul_router_v2.py`
- Модули: `backend/app/services/soul_modules/*.py`
- Промпты: `backend/app/prompts/soul_prompts.py`
- Менеджер LLM: `backend/app/services/llm_manager.py`
- Контекст/настройки: `backend/app/services/soul_context.py`, `backend/app/services/soul_settings_service.py`
- Voice TTS (P19): `backend/app/services/tts_service.py`, `backend/app/routers/voice_tts.py`
- P29 Жандарм и инспекторы: `backend/app/services/gendarme_service.py`, admin `backend/app/routers/gendarme_admin.py`, инспектор покрытия `backend/app/gendarme_tests/p29_sensory_coverage_threshold.py`

Инциденты (P50):

- ТЗ: `Soul/P50_TZ_Incident_Management_v1_0.md`
- БД: `incidents`, `incident_events`, `incident_links`, `incident_runbooks`, `incident_kb`
- DSL (P36): `INCIDENT.*` (создание/обновление/ссылки/закрытие/постмортем/эскалация)
- Сервисы: `backend/app/services/incident_service.py`
- Роуты: `backend/app/routers/incidents_admin.py`
- Миграции: `backend/alembic/versions/20250926_000080_p50_incident_management.py`
- Метрики (P21): `incidents_created_total`, `incidents_open_total`, `incident_mtta_ms`, `incident_mttr_ms`, `incident_stage_latency_ms{stage}`
- Интеграции: P27 подписи `svc.incident.*`; P29 инспекторы `incident.required_steps`, `incident.sla_enforcement`; P30 Processor события/эскалации; P40 `plan_task_id` связывание; P48/RS отчёты/акторы; P25/P38 навыки/обучение

NET/Связь (P43):

- ТЗ: `Soul/P43_TZ_Agent_Secure_Ephemeral_Comms_v1_0.md`
- DSL: `NET.*` (реализация в `backend/app/services/hyperloop_engine.py`, расширение P36)
- Метрики/подпись: шаги `svc.agent.net.*` (P27), инспекторы наличия событий
- Реализация (обновление):
  - Backend `backend/app/routers/agent_comm.py`: комнаты/мастер + WebRTC сигналинг:
    - WS: `/api/ws/agent-rooms/{room_id}/signal?peer_id=<session_id>&name=<opt>`
    - ICE конфиг: `GET /api/agent-rooms/webrtc/config` (STUN/TURN из ENV)
    - Админ‑просмотр: `GET /api/agent-rooms/webrtc/participants?room_id=`
  - Config `backend/app/config.py`: переменные `ICE_STUN`, `ICE_TURN_URI`, `ICE_TURN_USERNAME`, `ICE_TURN_PASSWORD`, `ICE_TURN_TLS`; метод `webrtc_ice_servers()`.
  - UI `/agent/comm`: добавлены кнопки камера/микрофон/экран, сетка участников, чат через сигналинг.

UI/Фронтмен (P23):

- Фронтмен (актор): `backend/app/services/frontman_actor.py`
- Админ‑фасады UI: `backend/app/routers/ui_admin.py` (`/api/ui/*`), `backend/app/routers/frontman_admin.py` (`/api/admin/frontman/*`)
- Фронтенд интеграции: `frontend/src/components/PermissionBasedMenu.tsx`, `frontend/src/pages/UIFormsRegistry.tsx`
- TimeAdmin панель: `frontend/src/pages/ResilienceAdmin.tsx` — раздел «Время (TimeAdmin)»: `/api/admin/time/status`, `/api/admin/time/settings`.

### Experiments (P04) — сервис гипотез и A/B

- Сервис: `backend/app/services/experiments_service.py`
- DSL через Hyperloop: `EXPERIMENTS.REGISTER`, `EXPERIMENTS.AB.RUN`, `EXPERIMENTS.AB.PUBLISH`
- Админ‑роуты: `backend/app/routers/experiments_admin.py` (`/api/admin/experiments/*`)
- Таблицы: `experiments_hypotheses`, `ab_runs`, `ab_results`, `experiments_golden_cases`
- Политики: публикация победителя — строго по Two‑Keys (см. `backend/app/routers/two_keys_admin.py`)
- Инспектор 24h: `backend/app/feature_plugins/experiments_window_24h.py`

- Проектное управление (P40):
  - ТЗ: `Soul/P40_TZ_Project_Management_Soul_v1_0.md`
  - БД: `projects`, `plan_tasks`, `plan_task_dependencies`, `risks`, `changes`, `project_methodologies`, `role_baseline_settings` (см. P40 DDL)
  - DSL: `PROJECT.*`, `PLAN.*`, `TASK.*`, `RISK.*`, `CHANGE.*`, `LIB.*`, `METHODOLOGY.*`, `ROLE.*` (см. P36/P40)

---

## Проверочный чек‑лист (после правок)

1) Health/DB/LLM test возвращают 200.
2) `/api/soul/process` выдаёт валидный JSON и создаёт квант в БД.
3) `/api/soul/process_batch` при `persist_all=false` возвращает список квантов с `desired_action=[]`.
4) Sanity/Refresh/Sleep выполняются без ошибок.
5) Логи systemd чистые от `greenlet_spawn`.

---

## Ссылки

- Пайплайн: `docs/SOUL_PIPELINE_v1_1.md`
- Промпты/память: `Soul/PROMPTS_AND_MEMORY_ALGORITHMS_v2_26.md`
- Схема БД: `docs/DATABASE_STRUCTURE_v8_0_2.md`
- Индекс ENV: `docs/ENV_INDEX.md`
- Индекс API роутов: `docs/API_ROUTES_INDEX.md`

---

## Мини‑приложение (Frontend) — новые страницы и хаб Архитектора

Страницы добавлены и доступны из меню у роли Architect (`frontend/src/components/PermissionBasedMenu.tsx`) и с главной `TelegramHome` ссылкой на хаб.

- Архитектор Хаб: `frontend/src/pages/ArchitectPanel.tsx`
  - Назначение: единая точка входа ко всем инструментам архитектора
  - Содержит карточки переходов: Настройки LLM, Ключевые слова, Дашборд, Оптимизация, Визуализация, Логи, Трассировка, Цели Соула

- Трассировка (Trace): `frontend/src/pages/Trace.tsx` (маршрут: `/trace`)
  - Показатели: Health/DB/LLM, тумблеры: `disable_batch`, `disable_persist`, `disable_reminders`, `persist_energy_threshold`
  - Таблицы: «Последние события» (`/api/admin/soul/audit/recent`), «Последние Кванты» (`/api/admin/soul/graph/recent_quants`)
  - Функции: полноэкранные модалки таблиц, сортировки/фильтры, выбор строк, массовое удаление квантов `DELETE /api/admin/soul/quant/{id}`
  - Нормализации: время `ts`, `tags` → массив строк, `Trace ID` из `trace_id|thread_id|meta.trace_id`
  - Обогащение: подстановка `trace_id` к квантам по карте аудита (`quant_id → trace_id`)

- Настройки LLM (таймауты/ретраи): `frontend/src/pages/LLMParams.tsx` (маршрут: `/llm-params`)
  - Табличное управление ключами в БД: `llm_timeout_ms.<function>.<model>`, `llm_retries.<function>.<model>`
  - API: `GET /api/admin/soul/settings/all`, `PUT /api/admin/soul/settings { key, value }`
  - Преднастройки: пример — `llm_timeout_ms.soul_core.deepseek = 6000`, `llm_retries.soul_core.deepseek = 1`

Связанные изменения Backend:

- `backend/app/services/soul_core_manager.py`: чтение таймаутов/ретраев из `SoulSettingsService` (stateless: `LLMClient.send(..., db=None)`), возврат к прежним значениям клиента после вызова
- `backend/app/services/llm_client.py`: поддержка параметров `timeout_ms`/ретраев; дефолты безопасно понижены через настройки
- `backend/app/services/chat_service.py`: режим Архитектора — маркеры `§sense`, `§qtags`, `§qew` в ответе, при ошибке — `§error` с деталями; сервисные ответы «Соул Спит» (без вызова LLM) и «Ошибка с получением ответа от Соул`

Nginx SPA fallback настроен: корень `/var/www/soulpulse/frontend`, `try_files $uri $uri/ /index.html;` (см. `deploy/nginx/03-mini_soulpulse.conf`).

### Инструменты документации: Markdown → PDF

- Модуль конвертации без HTML: `scripts/md_to_pdf_reportlab.py` (ReportLab). Назначение: офлайн‑конверт Markdown→PDF без внешних браузеров и wkhtmltopdf. Вход: `.md`, выход: `out/<name>.reportlab.pdf`.
  - Пример: `python scripts/md_to_pdf_reportlab.py Soul/KP_EstateFlow_v1_0.md -o out/KP_EstateFlow_v1_0.reportlab.pdf`
- Модуль с множественными бэкендами: `scripts/md_to_pdf.py` (порядок: WeasyPrint → Pandoc → wkhtmltopdf → Edge/Chrome headless). Можно задать браузер `MD2PDF_BROWSER` или `--browser`.
  - Пример: `$env:MD2PDF_BROWSER="C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"; scripts/md_to_pdf.ps1 -InputPath 'Soul/KP_EstateFlow_v1_0.md' -OutputPath 'out/KP_EstateFlow_v1_0.pdf'`

### Обновления 2025‑09‑20 (устранение белого экрана/вылетов)

- Конфиг Nginx очищен от конфликтующих backup‑файлов; удалён `Clear-Site-Data` для предотвращения сброса кэша/хранилищ.
- `index.html` отдаётся с `Cache-Control: no-store` для синхронизации с актуальными бандлами.
- Глобальный обработчик `ChunkLoadError` (в `App.tsx`) выполняет одноразовый перезапуск страницы с query‑версией.
- Детект Telegram WebApp стабилизирован, класс `telegram-mini-app` навешивается на старте; всегда используется `MemoryRouter`.
- Auth‑инициализация: извлечение `tg_id` и `user` из `sessionStorage` → `initDataUnsafe.user` → парсинг `initData` → URL‑параметры (`tg_id`,`otp`,`user_data`) с последующей очисткой URL; данные сохраняются в `sessionStorage`.
- Архитектор Хаб: авто‑загрузки тяжёлых секций отключены в Mini‑App среде для предотвращения зависаний.
- SoulDashboard: источники данных исправлены — аудит `/api/admin/soul/audit/recent?limit=100`, цели `/api/admin/soul/goals?limit=500`; локальная обработка ошибок без редиректов.

## API P22 фасады (включаются флагом ENABLE_P22_FACADES=1)

- `/api/admin/two-keys/*` — очередь заявок на чувствительные действия (approve/audit). Dry‑run.
- `/api/pc/*` — каркас PC‑операций (только dry‑run, требует two‑keys approve).
- `/api/cursor/*` — каркас Cursor (run/edit) только dry‑run, требует two‑keys approve.
- `/api/reminders/*` — фасад подключён (готово).
  - Расширения P17: поддержка search_query/search_url в создании/обновлении; pre-fetch за N минут (настройки `reminders.prefetch.*`).
  - Фоновая задача `ReminderBackgroundTask` выполняет pre-fetch и сохраняет `prefetch_payload`/`prefetch_done` для будущего уведомления.
  - P18: `/api/voice/asr` — загрузка аудио (multipart), ffmpeg нормализация и распознавание (ASRService).
  - P19: `/api/voice/tts` — синтез речи (TTSService). По умолчанию Piper (`TTS_PROVIDER=piper`); поддерживается Yandex SpeechKit при наличии `YANDEX_SPEECHKIT_API_KEY`.
  - P24: интегр. тесты и CI артефакты генерируются `scripts/ci_generate_metrics.py`.
- `/api/tasks/*` — фасад включён, чтение id при наличии таблицы `tasks`; POST/PATCH пока 501 до выравнивания схем.
- `/api/events/*` — фасад включён, чтение id при наличии таблицы `events`; POST/PATCH пока 501 до выравнивания схем.

Примечание: старые пути `/api/miniapp/*` остаются для обратной совместимости. Включение/отключение фасадов управляется переменной окружения, без миграций схемы.

## Postmortem: Инцидент React #300 (Mini‑App/Web)

- Симптом: «Minified React error #300», черный экран в Telegram WebView и браузере; иногда MIME ошибки на бандле.
- Корневые причины:
  - Кэширование старого `index-*.js` в Telegram WebView/браузере → рассинхронизация с `index.html`.
  - Динамическая смена роутера/редиректы на старте → гонки рендера в WebView.
  - CSP/XFO до фикса (frame-src/frame-ancestors) блокировали встраивание SDK.
- Исправления:
  - Строгие заголовки для `index.html`: `Cache-Control: no-store, no-cache, must-revalidate`, `Pragma: no-cache`, `Expires: 0`.
  - Cache-bust основного бандла `index-*.js` при каждом деплое (`?v=timestamp`).
  - Фичефлаги и безопасные режимы: `SAFE_BOOT`, `NOREACT`, `DIAG` через `window.__SP_FLAGS__` и `

### Дополнение 2025‑09‑24 — P48R (двухконтурная интеграция Rust)

- ТЗ: `Soul/P48R_TZ_Hyperloop_Rust_v1_0.md` (Runbook, двухконтурная модель, 7 уровней, реестр преемственности, firewall/UDS/systemd hardening).
- RS‑сервисы (sidecar, UDS `/run/soul/*.sock`): Hyperloop RS, P27 Guard RS, P29 Inspectors RS, P30 Processor RS, P44 PDP RS.
- Флаги включения зон: `HYPERLOOP_RS_ENABLED`, `P27_RS_ENABLED`, `P29_RS_ENABLED`, `P30_RS_ENABLED`, `P44_PDP_RS_ENABLED` (+ режимы `shadow/canary/primary_fallback/primary`).
- Безопасность: только Python экспонируется наружу; RS без сети/секретов; решения допусков (PEP/PDP/Two‑Keys) в Python; шаги подписи `svc.rbac.*`/`cmd.hyperloop.authz.*` фиксируются до делегации.
- Реестр преемственности (БД): `lang_succession_registry`, `lang_succession_history` (см. P48R §29), админ‑API `/api/admin/lang-succession*`.
- Acceptance: гейты Жандарма `rs.parity/rs.performance_sla/rs.security_limits` для переходов `shadow→canary→primary`.

RS Hyperloop DSL (read‑only, MVP):

- Реализация RS внутри `rs/rsbus/src/main.rs` (op=`hyperloop.execute`), Python фасад — `backend/app/services/hyperloop_rs_bridge.py`.
- Команды:
  - `FLAGS.SET key=<k> value=<v>`, `FLAGS.UNSET key=<k>`, `FLAGS.APPLY_PROFILE name=<profile>`, `FLAGS.STATE`.
  - `TRACE.STEPS trace_id=<uuid>` — read‑only; возвращает `{trace_id, steps: []}`.
  - `INSPECTOR.RUN_ALL` — read‑only; проверка наличия ключевых серий метрик.
  - `JUDGE.*` — read‑only базовые решения (подготовка к P44 PDP RS).
- Метрики Prometheus (доступ через RSBus `metrics` и API‑отчёты):
  - `hyperloop_rs_latency_ms{phase}` — фазы parse/exec/total (бакеты/_count/_sum).
  - `rsbus_latency_ms{op}` — латентность операций шины.
  - `rsbus_backpressure_hits_total{op}` и `rsbus_backpressure_on{op}` — индикаторы backpressure.
  - `rs_security_limit_hits_total{kind}`, `rs_security_violations_total{kind}` — лимиты/нарушения безопасности.
- Админ‑отчёты:
  - `GET /api/admin/rs/latency-report` — p50/p95/p99 по RS фазам/RSBus ops.
  - `GET /api/admin/rs/report/p95` — агрегат p50/p95/p99 + backpressure (`total_hits`, `per_op`).

---

### Дополнение 2025‑09‑25 — DiamondEngine и RS Canary (P48R)

- DiamondEngine (бриллиантовый алгоритм):
  - Сервис: `backend/app/services/diamond_engine.py`
  - Интеграция в процессор (P30): `backend/app/services/processor_scheduler.py` — события `soul.diamond.trigger`, `soul.dream.rewire`; шаги подписи `svc.diamond.emotion.assess`, `svc.diamond.question.plan`, `svc.diamond.quant.generate`, `svc.dream.rewire.plan`; инциденты: `diamond_question_planned`, `diamond_quant_emitted`, `diamond_fallback_used`, `dream_rewire_done`.
  - Интеграция в чат: `backend/app/services/chat_service.py` — эмпатический hook перед отдачей ответа; при высокой эмоции планируется мягкий вопрос Архитектору в `processor_events(kind='outbound.text')`.

- Инспекторы (Жандарм, P29):
  - `backend/app/gendarme_tests/diamond_pipeline_health.py` (ключ: `diamond.pipeline.health`) — проверка шагов/успехов бриллиантового конвейера за 24h.
  - `backend/app/gendarme_tests/rs_actor_budgets.py` (ключ: `rs.actor.budgets`) — бюджеты p95/error_rate RS‑актеров/шины.
  - Регистрация: `backend/app/scripts/reg_inspectors.py` (upsert в `feature_inspectors`).

- RS Canary профиль (P48R):
  - Профиль `rs_canary_profile` добавлен в `backend/app/services/feature_flags_supervisor.py` → включает `rs.hyperloop.enabled=true`, `rs.hyperloop.mode=rs_primary_python_fallback`, `rs.hyperloop.canary_share=0.1`.
  - Включение через Hyperloop DSL: `FLAGS.APPLY_PROFILE name="rs_canary_profile"`.

### Дополнение 2025‑09‑26 — P49 Сон/Нейроперестройка (метрики/пороги/алерты)

- Метрики (экспорт Prometheus `GET /api/metrics/prometheus`):
  - `sleep_rewire_ratio_{p50,p95,p99}` — доля пересвязываний за цикл (окно наблюдений).
  - `sleep_rewire_epsilon_p50` — п50 эпсилон‑дрейфа.
  - `sleep_rewire_radius_p50` — п50 радиуса/глубины перестройки.
  - `sleep_rewire_events_total`, `sleep_rewire_edges_updated_total` — счётчики событий и обновлённых рёбер.
- Источники данных:
  - Processor (P30) событие `soul.dream.rewire` — нормализация связей; метрики пишутся из `backend/app/services/processor_scheduler.py`.
  - Экспорт в Prometheus добавлен в `backend/app/monitoring.py` (блок Sleep/Dream rewire metrics).
- Пороговые профили (в БД `soul_settings`):
  - `sleep.rewire.{epsilon,radius,max_edges}` — базовые параметры перестройки.
  - `sleep.profile.{light,deep,repair}` — JSON профили: epsilon/radius/max_edges.
  - Алерт‑бюджеты: `sleep.alerts.{rewire_ratio_max,epsilon_drift_max}`.
- Управление/DSL (через Hyperloop):
  - `DB.UPSERT table=soul_settings key=key values={"key":"sleep.rewire.epsilon","value":0.02}` и аналогично для остальных ключей.
- Acceptance:
  - Метрики видны в Prometheus; профили и пороги доступны через `GET /api/admin/soul/settings/all`; событие `soul.dream.rewire` фиксируется инцидентом `dream_rewire_done`.

## Текущие задачи и очередь процессов (P45/P30/P25/P38)

- Завершено:
  - Предвалидация (L2 Semantic QC) с Quality Gates: антиплейсхолдеры «шаг N», требование предметных действий, критериев приёмки и контекста связей (`Soul/scripts/pre_ingest_validate.py`).
  - Интеграция QC в загрузчик Hyperloop: `--require-qc --qc-report` (блокировка загрузки при провале порогов) — `Soul/scripts/ingest_quants_jsonl_via_hyperloop.py`.
  - Автоподбор параметров многопоточной загрузки (AIMD): `Soul/scripts/autotune_ingest_params.py`.
  - Neuro‑Assisted QC/Linkage: `Soul/scripts/neuro_assisted_qc.py` (`NEURO.QC.EVAL` + `QUANT.LINK`).
  - ТЗ P45 обновлено разделами 10.B–10.E (семантический QC, правила подготовки/промптов, оркестрация Processor/Sleep, нейро‑участие).

- В очереди (к исполнению после интеграции Планирование↔Навыки↔Нейросеть↔Cursor):
  - llm_refine трёх серий (`*.refine.jsonl`) — заявки созданы; обогащение конкретными действиями, `payload.plan|skill`, критериями приёмки.
  - deferred_qc — строгий повторный QC (пороги: `min_uniq≥0.95`, `max_jaccard≤0.7`, `max_char_jaccard≤0.85`).
  - deferred_ingest — многопоточный инжест только good (`--require-qc`), параметры по `autotune_ingest_params.py`.
  - Пост‑аудит связей — выборочный `QUANT.LINK.CHECK` + автолинковка по `payload.plan` при необходимости.

- Ответственные персонажи: Процессор (P30), Тренер/Нейросеть (P38), Жандарм/Судья (P29), Архитектор.

## Hyperloop DSL — Валидатор/Нормализация (Frontend)

- Утилита: `frontend/src/utils/hyperloopDsl.ts`
- Компонент: `frontend/src/components/HyperloopDSLValidator.tsx`
- Интеграции: `frontend/src/pages/RSDashboard.tsx`, `frontend/src/pages/GendarmePanel.tsx`, `frontend/src/pages/AdminPanel.tsx`

## RS Dashboard (Frontend/Backend)

- Страница: `frontend/src/pages/RSDashboard.tsx`
  - p95/p99 per op/phase (таблицы)
  - Сырые Prometheus метрики (`/api/admin/rs/metrics-raw`)
  - Топ ошибок по классам (из `rsbus_errors_total{class="..."}`)
  - Two-Keys профиль (`TWO_KEYS.REQUEST/APPROVE` + `FLAGS.APPLY_PROFILE`)
  - Тренды p95/p99 по nightly: ключ (op/phase), отображение последних записей
- Бэкенд метрики: `backend/app/services/rs_metrics_service.py`, админ‑роуты `backend/app/routers/rs_metrics_admin.py`, `rs_admin_dashboard.py`

## Nightly отчёты RS

- Роуты: `backend/app/routers/rs_nightly_admin.py` (`/generate`, `/recent`)
- Хранилище: `rs_nightly_reports` (id, generated_at, window_days, summary jsonb, diff_7d jsonb, created_at)
- Фон: `backend/app/background_tasks.py` — `RSNightlyReportsBackgroundTask`, автозапуск в `backend/app/main.py`
- Настройки: `rs.nightly.interval_sec`, `rs.nightly.window_days`

## PDP / Security (P44)

- Аудит PDP: `backend/app/services/pdp_audit_service.py`, таблица `p44_pdp_audit`.
- Админ‑роуты: `backend/app/routers/pdp_audit_admin.py` (`/api/admin/pdp-audit/recent`, `/api/admin/pdp-audit/stats`).
- Интеграция с RBAC: `backend/app/middleware/rbac_middleware.py` — запись allow/deny.

### Обновление 2025‑10‑04 — RS Canary приёмка и перенос TEST→PROD

- RS Canary — профиль и бюджеты (ключи в БД через `SoulSettingsService`):
  - `rs.autotune.enabled=true`, `rs.autotune.step=0.01`, `rs.autotune.max_share=0.20`, `rs.autotune.llm_gate.enabled=true`.
  - SLA бюджеты: `rs.autotune.err_rate_max=0.01`, `rs.autotune.p95_budget_ms=50`.
  - Наблюдение на долях `rs.hyperloop.canary_share ∈ {0.10, 0.20}` окнами ≥10 мин с автоснижением при нарушении SLA.
  - Приёмка: backpressure=0, error_rate≤1%, p95≤50ms — выполнено.
- Снимки/отчёты (директория `reports/`):
  - `rs_dashboard_summary_*.json`, `rs_p95_*.json`, `dispatcher_metrics_*.json`, `db_check_*.json`, `qlinks_coverage_*.json`.
  - Агрегат приёмки: `rs_canary_acceptance_*.json`.
- Диспетчер: прогон `run_for=10` минут; метрики доступны по `GET /api/admin/dispatcher/metrics`.
- Аудит связей (PROD):
  - Сохранены выборки `PROJECT.QLINKS.COUNTS` в `reports/qlinks_counts_<project_id>.json` (подмножество проектов).
  - Полное покрытие/дедуп: `GET /api/admin/qlinks/coverage` → `reports/qlinks_coverage_*.json`.
- Идемпотентный перенос TEST→PROD (батчи по 10):
  - Источник: `data/plans_set_01.jsonl`; режим `--use-cli --ascii-fallback`.
  - Назначение (пример): проект `fd01c2d8-80d0-4e0f-a0cc-74426dc283f1`.
  - Дедуп: перед вставкой выполняется `PLAN.TASK.FIND` по `title`+`project_id`.
  - Лог выполнения: `reports/ingest_plans_set_01_run.jsonl`.
- Источники/компоненты:
  - Скрипты: `Soul/scripts/rs_canary_escalation.py`, `scripts/ingest_plans_and_skills_jsonl.py`.
  - DSL/движок: `backend/app/services/hyperloop_engine.py`.
  - RS отчёты/дашборд: `backend/app/routers/rs_metrics_admin.py`.

## Runtime checklist — инспекторы и метрики

- INSPECTOR.RUN key=planning.enforce: ожидание статус passed; артефакт сохраняется в `reports/inspector_planning_enforce_*.json` (на APP).
- INSPECTOR.RUN_ALL: периодический запуск (см. timers) и артефакты в `reports/`.
- systemd timers:
  - `soul-coverage-fast.timer` — каждые 2 мин; логи `journalctl -u soul-coverage-fast.service -n 50`.
  - `soul-guardian-health.timer` — health/db проверки; должен быть enabled и active (waiting).
- DEV.CONNECT метрики (Prometheus):
  - `dev_connect_latency_ms_p50|p95`
  - `dev_connect_total{status}`
  - `dev_connect_error_total{type}`
  - Правила: `ops/prometheus/rules_dev_connect.yml`; панели Grafana включают 401/404/422/timeout.
- QLinks coverage/dedup/projection:
  - POST `/api/admin/qlinks/dedup` → `duplicate_groups_left=0`
  - POST `/api/admin/qlinks/project-connections` → `inserted≥1` (факт: 2)
  - Артефакты: `reports/qlinks/*.json` (локально) и `/var/www/soulpulse/backend/reports/*.json` (на APP).

## P30 Processor — пакетные коммиты и буферизация через Redis

- Ключи настроек (через `SoulSettingsService`):
- Обновление 2025‑10‑14 (Reminders/DB sessions):
  - `backend/app/services/reminder_service.py` — отказ от локальных `async_session_maker()` внутри методов анализа/отправки; методы используют переданный `db: AsyncSession`.
  - Доставка сообщений переведена на `orchestrator.enqueue_outbound` (единая точка HTTP с ретраями/метриками), без прямых `requests.post`.
  - Обновлены вызовы в `backend/app/services/chat_service.py` для передачи `db` в `analyze_message_for_events`.
  - Цель: снижение потребления слотов БД, устранение таймаутов act при деградациях внешних сервисов; подготовка к включению circuit‑breaker’ов.

  - `processor.batch_mode.sequential` (bool): включает последовательную обработку батча в одной сессии БД с редкими коммитами.
  - `processor.batch_commit_size` (int): размер подбатча между коммитами (по умолчанию 10).
  - `processor.concurrent_tasks` (int): конкурентность в параллельном режиме (когда `sequential=false`).
  - `processor.event_timeout_ms` (int): SLA на обработку одного события.
  - `REDIS_URL` (env): строка подключения к Redis; при пустом значении буферизация отключена.

- Поведение:
  - При `sequential=true` процессор обрабатывает события батча последовательно в рамках одной `AsyncSession` и выполняет `commit()` только после каждых N событий (`batch_commit_size`), что резко снижает количество транзакций и нагрузку на БД.
  - При `sequential=false` используется прежний ограниченно-конкурентный режим.
  - Если задан `REDIS_URL`, процессор складывает служебный буфер обработанных событий в список `proc:batch_buf:<PROCESSOR_NODE_ID>` с TTL 1 час (best‑effort) для диагностики и ретроспектив.

- Рекомендации эксплуатации:
  - Для больших бэклогов включать `sequential=true` и ставить `processor.batch_commit_size` в диапазоне 20–100 в зависимости от p95 БД.
  - При дефиците connection slots снижать `processor.concurrent_tasks` и увеличивать размер батча коммита.

- TTS/доставка:
  - `ReminderActor` и сервисы доставки стараются переиспользовать уже открытую сессию БД для служебных запросов (например, разрешение `chat_id`) во избежание открытия лишних подключений.

</rewritten_file>