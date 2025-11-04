#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

read -r -d '' CMDS1 <<'EOF'
JUDGE.CHARTER.UPSERT name=code_policy version=1.0 text="Ban secrets; enforce tests" category=policy enforced=true
JUDGE.CHECK code="diff: + PRIVATE KEY"
REQUEST.CREATE type=feature subject="Enable Guard" payload={"key":"delivery_guard.enforce","value":true}
CORE.PIPELINE.RUN input_text="P27: контрольный диалог архитектор→соул" WITH TRACE
EOF

payload1=$(jq -Rn --arg s "$CMDS1" '{commands: $s, options: {stop_on_error: true}}')

echo EXECUTE_SCENARIO_PART1
resp1=$(curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/hyperloop/execute" -d "$payload1")
echo "$resp1" | jq -cM .

trace=$(echo "$resp1" | jq -r '.signature.trace_id // empty')
rid=$(echo "$resp1" | jq -r '.results[] | select(.command|startswith("REQUEST.CREATE")) | .data.request_id // empty')
echo TRACE_ID: ${trace}
echo REQUEST_ID: ${rid}

if [ -n "$trace" ]; then
  echo SIGNATURE_STEPS
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/steps/by-trace?trace_id=${trace}" | jq -cM .
  echo INCIDENTS
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/incidents" | jq -cM .
fi

if [ -n "$rid" ]; then
  read -r -d '' CMDS2 <<EOF
REQUEST.STATUS id=${rid}
EOF
  payload2=$(jq -Rn --arg s "$CMDS2" '{commands: $s}')
  echo EXECUTE_REQUEST_STATUS
  curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/hyperloop/execute" -d "$payload2" | jq -cM .
fi


