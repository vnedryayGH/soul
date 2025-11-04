#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

# E2E command pack
read -r -d '' CMDS <<'EOF'
JUDGE.CHARTER.UPSERT name=code_policy version=1.0 text="Ban secrets; enforce tests" category=policy enforced=true
JUDGE.CHECK code="diff: + PRIVATE KEY"
REQUEST.CREATE type=feature subject="Enable Guard" payload={"key":"delivery_guard.enforce","value":true}
CORE.PIPELINE.RUN input_text="P27: контрольный диалог архитектор→соул" WITH TRACE
EOF

payload=$(jq -Rn --arg s "$CMDS" '{commands: $s, options: {stop_on_error: true}}')

resp=$(curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/hyperloop/execute" -d "$payload")
trace=$(echo "$resp" | jq -r '.signature.trace_id // empty')
rid=$(echo "$resp" | jq -r '.results[] | select(.command|startswith("REQUEST.CREATE")) | .data.request_id // empty')

steps=$(curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/steps/by-trace?trace_id=$trace" 2>/dev/null | jq -r '.steps // []')
inc=$(curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/incidents" 2>/dev/null | jq -r '.items // []')

req=null
if [ -n "$rid" ]; then
  req=$(curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/hyperloop/execute" -d "{\"commands\":\"REQUEST.STATUS id=$rid\"}" 2>/dev/null | jq -r '.results[0].data // null')
fi

ok_all=$(echo "$resp" | jq -r '([.results[]|.ok]|all)')

printf '{"ok":%s,"trace_id":%s,"results":%s,"signature_steps":%s,"incidents":%s,"request":%s,"tests":[],"flags":{},"meta":{"version":"2.9"},"errors":[]}\n' \
  "$ok_all" \
  "$(echo "$resp" | jq -r '.signature.trace_id|@json')" \
  "$(echo "$resp" | jq -r '.results|@json')" \
  "$(echo "$steps" | jq -r '@json')" \
  "$(echo "$inc" | jq -r '@json')" \
  "$(echo "$req" | jq -r '@json')"


