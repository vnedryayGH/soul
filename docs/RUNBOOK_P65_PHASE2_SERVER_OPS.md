# RUNBOOK — Phase 2: Fine‑Tune Admin публикация, Observability, Smoke

Дата: 2025‑10‑23

## 0) Предусловия
- Роль/заголовок: `X-Telegram-User-ID: 468326902` (роль `soul.architect`).
- Серверы APP: `46.173.24.4`, `217.12.38.238`.
- Ключи SSH (пример): `deploy/ssh_keys/app_server_key` или `Arh/spbd_ed25519`.

## 1) Перезапуск backend (zero‑downtime)

Вариант A (прямой systemd):
```bash
ssh -i deploy/ssh_keys/app_server_key -o StrictHostKeyChecking=accept-new root@46.173.24.4 \
  'systemctl restart soulpulse-backend.service && systemctl is-active soulpulse-backend.service'

ssh -i deploy/ssh_keys/app_server_key -o StrictHostKeyChecking=accept-new root@217.12.38.238 \
  'systemctl restart soulpulse-backend.service && systemctl is-active soulpulse-backend.service'
```

Вариант B (zero‑downtime скрипт PowerShell из репозитория):
```powershell
powershell -ExecutionPolicy Bypass -File "tools/catalog/active/utils/zero_downtime_release.ps1" `
  -ServiceName 'soulpulse-backend.service' -Host '217.12.38.238' -KeyPath '.\Arh\spbd_ed25519' -WaitSec 5
```

Проверка здоровья:
```bash
curl -sS -H 'X-Telegram-User-ID: 468326902' https://mini.soulpulse.art/api/health
```

## 2) Проверка маршрутов и OpenAPI
```bash
curl -sS https://mini.soulpulse.art/api/routes | jq .
curl -sS -H 'Accept: application/json' https://mini.soulpulse.art/openapi.json | jq 'keys'  # ожид. ключи путей
```

Ожидаемые пути Fine‑Tune:
- `/api/admin/fine_tune/runs`
- `/api/admin/fine_tune/run/create`
- `/api/admin/fine_tune/run/{run_id}/execute`
- `/api/admin/fine_tune/run/{run_id}/status`
- `/api/admin/fine_tune/checkpoint/{checkpoint_id}/rollout`
- `/api/admin/fine_tune/audit`

## 3) Smoke Fine‑Tune (RBAC/Two‑Keys)

Список ранов:
```bash
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-get https://mini.soulpulse.art/api/admin/fine_tune/runs \
  --telegram-user-id 468326902
```

Создать ран:
```bash
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/fine_tune/run/create \
  --telegram-user-id 468326902 \
  --post-json '{"model_base":"qwen2.5-7b-instruct","learning_rate":1e-5,"batch_size":8,"num_epochs":1,"rate_limit_rpm":60}'
```

Выполнить ран:
```bash
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/fine_tune/run/<run_id>/execute \
  --telegram-user-id 468326902
```

Статус рана:
```bash
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-get https://mini.soulpulse.art/api/admin/fine_tune/run/<run_id>/status \
  --telegram-user-id 468326902
```

Rollout чекпойнта (Two‑Keys):
```bash
# Two‑Keys
python tools/catalog/active/utils/hyperloop_cli.py --dsl "TWO_KEYS.REQUEST operation='fine_tune.rollout' scope='prod' reason='Rollout checkpoint'"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "TWO_KEYS.APPROVE id=<request_id>"

# Rollout
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/fine_tune/checkpoint/<checkpoint_id>/rollout \
  --telegram-user-id 468326902 \
  --post-json '{"two_keys_request_id":"<request_id>"}'
```

Аудит:
```bash
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-get https://mini.soulpulse.art/api/admin/fine_tune/audit \
  --telegram-user-id 468326902
```

## 4) Observability 2.3 — правила и дашборды

Prometheus (правила):
```bash
scp -i deploy/ssh_keys/app_server_key ops/prometheus/rules_quant_and_takt.yml \
  root@46.173.24.4:/etc/prometheus/rules/
ssh -i deploy/ssh_keys/app_server_key root@46.173.24.4 'promtool check rules /etc/prometheus/rules/rules_quant_and_takt.yml && systemctl reload prometheus'
```

Grafana (дашборды):
```bash
scp -i deploy/ssh_keys/app_server_key ops/grafana/quant_and_takt_dashboard.json \
  root@46.173.24.4:/etc/grafana/provisioning/dashboards/
# Примечание: на APP1 unit может называться иначе или отсутствовать
ssh -i deploy/ssh_keys/app_server_key root@46.173.24.4 '
  (systemctl reload grafana-server || systemctl restart grafana-server || \
   systemctl reload grafana || systemctl restart grafana || \
   systemctl reload grafana-enterprise || systemctl restart grafana-enterprise || \
   echo "Grafana unit not found; use central Grafana host to import ops/grafana/quant_and_takt_dashboard.json")
'
```

Проверка метрик бэкенда:
```bash
curl -sS https://mini.soulpulse.art/api/metrics | jq .
curl -sS https://mini.soulpulse.art/api/metrics/prometheus
```

Если `/api/metrics` отдаёт `{}` (пусто), используйте Prometheus-формат `/api/metrics/prometheus` для алертов. При следующем релизе backend будет включать агрегатор JSON-метрик.

## 5) Включение контура LLM→Кванты

Фичефлаг: `quant_generation.enabled=true`

Вариант A (API, если маршрут доступен):
```bash
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post "https://mini.soulpulse.art/api/admin/soul/settings/set_kv?key=quant_generation.enabled&value=true" \
  --telegram-user-id 468326902
```

Вариант B (прямой SQL, при наличии psql на APP):
```bash
psql -U miniapp_user -d soulpulse -c "INSERT INTO soul_settings(key, value) VALUES ('quant_generation.enabled', 'true') ON CONFLICT (key) DO UPDATE SET value='true'"
```

Запуск одного такта (если есть admin endpoint):
```bash
python tools/catalog/active/utils/hyperloop_cli.py --dsl "CORE.PIPELINE.RUN once=true collect_metrics=true"
```

Acceptance:
- Кванты вставляются без протечек (P29 инспекция), p95 ≤ 2.5s.

## 6) Quant Admin — fallback run_once

Когда TaktEngine недоступен, воспользуйтесь fallback-режимом прямой генерации/валидации/вставки через `QuantGenerationService`:

```bash
# new: generate → validate → persist
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/quant/run_once \
  --post-json '{"mode":"new","goal_text":"Smoke quant run","force_fallback":true}'

# validate: только валидация (если quant задан), иначе auto-generate+validate
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/quant/run_once \
  --post-json '{"mode":"validate","goal_text":"Smoke quant run","force_fallback":true}'

# refine: generate → validate → refine (возвращает refined quant без persist)
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/quant/run_once \
  --post-json '{"mode":"refine","goal_text":"Smoke quant run","force_fallback":true}'

# all: generate → validate → (links) → persist
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/quant/run_once \
  --post-json '{"mode":"all","goal_text":"Smoke quant run","force_fallback":true}'
```

Метрики:
- `quant_admin_run_once_latency_ms` — latency per mode/path
- `quant_admin_runs_total{path="fallback|engine",mode,status}` — counters

Если маршрут недоступен или код ещё не доставлен на APP, используйте серверные инспекторы доставки (безопасно):

```bash
# Валидация заявки (STRICT_JSON)
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/agent/exec \
  --post-json-file tmp/agent_inspector_validate_transfer.json

# Оркестратор (без apply): план действий и preflight
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/agent/exec \
  --post-json-file tmp/agent_inspector_orchestrate_transfer.json

# Two-Keys для apply (deploy.apply)
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/agent/exec \
  --post-json-file tmp/two_keys_request.json
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/agent/exec \
  --post-json-file tmp/two_keys_approve.json

# Оркестратор c apply=true и request_id
python tools/catalog/active/utils/hyperloop_cli.py \
  --http-post https://mini.soulpulse.art/api/admin/agent/exec \
  --post-json-file tmp/agent_inspector_orchestrate_apply.json
```

---

Примечания:
- Если `/openapi.json` отдаёт SPA, добавьте заголовок `Accept: application/json`.
- Для RBAC используйте `--telegram-user-id 468326902` в CLI.


