# P65 — Текущий статус и следующие шаги

## Готово
- Восстановлен Takt Engine (фичефлаг `quant_generation.enabled`, таймауты, трассы)
- Интегрирован Quant Generation Service (строгий JSON, ретраи)
- Инспектор P29 перед вставкой квантов
- Метрики и экспорт Prometheus; правила и дашборды добавлены (Observability 2.3 уточнена; см. runbook §4)
- Fine‑Tune Admin подключён (роутер)
- Реализован fallback Quant Admin `/api/admin/quant/run_once` (direct generate→validate→persist при недоступности TaktEngine)
- Обновлены payload для смоков (tmp/quant_run_*.json) и серверные инспекторы доставки (tmp/agent_inspector_*.json)

## Следующие шаги
1) Миграции (P60)
   - Инспекторы: `migration.guard`, `db.alembic.heads_enforcer`
   - Two‑Keys: REQUEST → APPROVE → APPLY(head)
   - Ревизия: `backend/alembic/versions/20251023_000001_p65_fine_tune_tables.py`
2) RBAC/Two‑Keys Fine‑Tune Admin (P44)
   - Smoke с ролью `soul.architect`
   - Rollout — мок Two‑Keys, аудит в `fine_tune_audit`
3) Дашборды/алерты (Observability 2.3)
  - Вынести панели на стенд; включить алерты p95/error‑rate
  - Если `grafana-server` unit отсутствует на APP1 — использовать центральный Grafana‑хост (см. runbook §4, команды для импорта)

4) Доставка кода на APP2 (для активации fallback Quant Admin)
  - Выполнен план и preflight оркестратора; применён бэкенд шаг `deploy_release_dir_switch` (сервер‑сайд)
  - Для обновления кода требуется артефакт/HEAD с изменениями. Варианты:
    - (предпочт.) Push ветки `p65-h2ogpt-app2/aux-routing-and-hybrid` и выполнить orchestrator с `artifacts.backend.ref='HEAD'`
    - (альтернатива) Передать пакет `artifacts.backend.package` (локальный путь на APP) и повторить orchestrator `apply=true`

## Команды (сервер)
- Инспекторы:
  - `python Soul/scripts/hyperloop_cli.py --dsl "INSPECTOR.RUN key=migration.guard"`
  - `python Soul/scripts/hyperloop_cli.py --dsl "INSPECTOR.RUN key=db.alembic.heads_enforcer"`
- Two‑Keys и миграция:
## Примечания по Quant Admin

- Маршрут доступен: `/api/admin/quant/run_once` (требуется роль `soul.architect`)
- Режимы: `new`, `validate`, `refine`, `all`
- Принудительный fallback (без TaktEngine): `{"force_fallback": true}`

  - `python Soul/scripts/hyperloop_cli.py --dsl "TWO_KEYS.REQUEST operation='migrations.apply' scope='prod_db' reason='Apply P65 fine_tune'"`
  - `python Soul/scripts/hyperloop_cli.py --dsl "TWO_KEYS.APPROVE id=<request_id>"`
  - `python Soul/scripts/hyperloop_cli.py --dsl "MIGRATIONS.APPLY revision=head request_id=<request_id>"`
  - `python Soul/scripts/hyperloop_cli.py --dsl "MIGRATIONS.STATUS"`

