#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

json() { jq -c . 2>/dev/null || cat; }

echo '---ACCEPTANCE.START---'

echo '---HEALTH---'
curl -sS -m 12 -H "$H" http://127.0.0.1:8000/api/health | json

echo '---DB.CHECK---'
curl -sS -m 12 -H "$H" http://127.0.0.1:8000/api/admin/soul/db/check | json || true

echo '---LLM.TEST (deepseek)---'
curl -sS -m 20 -H "$H" 'http://127.0.0.1:8000/api/admin/soul/llm/test?provider=deepseek&prompt=ping' | json || true

echo '---DISPATCHER.RUN_FOR 1m---'
curl -sS -m 6 -H "$H" -X POST 'http://127.0.0.1:8000/api/admin/dispatcher/run_for?minutes=1' | json || true
sleep 2

echo '---DISPATCHER.METRICS---'
curl -sS -m 6 -H "$H" 'http://127.0.0.1:8000/api/admin/dispatcher/metrics' | json || true

echo '---DISPATCHER.STOP---'
curl -sS -m 6 -H "$H" -X POST 'http://127.0.0.1:8000/api/admin/dispatcher/stop' | json || true

echo '---INSPECTOR.RUN_ALL---'
printf '{"commands":"INSPECTOR.RUN_ALL"}' | curl -sS -m 40 -H "$H" -H 'Content-Type: application/json' -d @- \
  http://127.0.0.1:8000/api/hyperloop/execute | json || true

echo '---METRICS.PROMETHEUS (HEAD)---'
curl -sS -m 10 -H "$H" http://127.0.0.1:8000/api/metrics/prometheus | sed -n '1,100p'

echo '---ACCEPTANCE.END---'


