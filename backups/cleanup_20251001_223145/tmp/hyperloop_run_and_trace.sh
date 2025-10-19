#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

read -r -d '' CMDS <<'EOF'
FLAGS.SET key=delivery_guard.enforce value=true
FLAGS.SET key=diagnostic.visible_reply value=false
TEST.RUN key=p27_guard_chain WITH TRACE
CORE.PIPELINE.RUN input_text="P27: контрольный диалог архитектор→соул" WITH TRACE
EOF

payload=$(jq -Rn --arg s "$CMDS" '{commands: $s, options: {stop_on_error: true}}')

echo EXECUTE_HYPERLOOP
resp=$(curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/hyperloop/execute" -d "$payload")
echo "$resp" | jq -cM .

trace=$(echo "$resp" | jq -r '.signature.trace_id // empty')
echo TRACE_ID: ${trace}
if [ -n "$trace" ]; then
  echo SIGNATURE_STEPS
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/steps/by-trace?trace_id=${trace}" | jq -cM .
  echo INCIDENTS
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/incidents" | jq -cM .
fi


