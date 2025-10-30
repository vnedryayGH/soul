#!/usr/bin/env bash
set -euo pipefail
H=( -H "X-Telegram-User-ID: 468326902" )
BASE="http://localhost:8000"

echo "[P62] Health/openapi/routes"
curl -sS "${BASE}/api/health" "${H[@]}" | jq -c .
curl -sS "${BASE}/openapi.json" "${H[@]}" > /dev/null
curl -sS "${BASE}/api/routes" "${H[@]}" | jq -c .

echo "[P62] Personas/HR minimal"
curl -sS "${BASE}/api/admin/personas" "${H[@]}" | jq -c .
curl -sS -X POST "${BASE}/api/admin/hr/positions" -H 'Content-Type: application/json' "${H[@]}" \
  -d '{"name":"Accountant L2"}' | jq -c .
curl -sS -X POST "${BASE}/api/admin/timesheet/record" -H 'Content-Type: application/json' "${H[@]}" \
  -d '{"persona_id":"00000000-0000-0000-0000-000000000001","period":{"from":"2025-11-01T08:00:00Z","to":"2025-11-01T18:00:00Z"},"hours":8.0}' | jq -c .

echo "[P62] Finance reports"
curl -sS "${BASE}/api/admin/external/reports?contract_id=00000000-0000-0000-0000-000000000002&from=2025-11-01&to=2025-11-30" "${H[@]}" | jq -c .
curl -sS "${BASE}/api/admin/hr/payroll/report?from=2025-11-01&to=2025-11-30" "${H[@]}" | jq -c .

echo "[P62] Done"

