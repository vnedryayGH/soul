# SYSTEM_MASTER_DOCUMENTS_REGISTRY v8.7

- Новые и восстановленные документы:
  - `Soul/P57_TZ_Soul_Development_Rules_and_System_Prompt_Governance_v1_0.md`
  - `Soul/P58_TZ_Hyperloop_Projects_And_Planning_API_v1_0.md`
  - `Soul/P59_TZ_Documentation_Parity_and_Recovery_Workflow_v1_0.md`
  - `Soul/P60_TZ_Data_Migration_Policies_and_Procedures_v1_0.md`
  - `docs/PROJECTS_AUDIT_20251013.md`
  - `docs/MIGRATIONS_AUDIT_20251013.md`
  - Merge-модель Alembic: `backend/alembic/versions/20251013_999999_merge_heads_all.py` (консолидация heads)

- Текущие версии ключевых реестров:
  - PROJECT_STRUCTURE: v8.1.4
  - SYSTEM_MASTER_DOCUMENTS_REGISTRY: v8.7

- Ссылки на код/конфигурацию (для паритета):
  - Alembic миграции: `backend/alembic/versions/`
  - Hyperloop CLI: `Soul/scripts/hyperloop_cli.py`

- Новые инспекторы и маршруты (P63 Dev Access):
  - Инспектор: `dev_access.health` (`backend/app/feature_plugins/dev_access_health.py`)
  - Эндпоинт: `GET /api/admin/access/health` (`backend/app/routers/dev_access_admin.py`)
  - Метрики:
    - `dev_access_health_status` (Gauge: 1 — passed, 0 — failed)
    - `dev_access_health_ms` (Histogram, ms)
  - Алерты Prometheus: `ops/prometheus/rules_dev_access.yml`
  - Запуск инспектора (CLI):
    - `python Soul/scripts/hyperloop_cli.py --dsl INSPECTOR.RUN key=dev_access.health`

- Примечание: Документы v8.7 отражают актуальное состояние PROD и восстановленные артефакты после сбоя 2025‑10‑13.
