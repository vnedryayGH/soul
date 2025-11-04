#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

read -r -d '' CMDS <<'EOF'
FLAGS.SET key=delivery_guard.enforce value=true
FLAGS.SET key=diagnostic.visible_reply value=false
TEST.RUN key=p27_guard_chain WITH TRACE
EOF

json=$(printf '{"commands": %s, "options": {"stop_on_error": true}}' \
  "$(jq -Rn --arg s "$CMDS" '$s')")

curl -sS -H "$H" -H "Content-Type: application/json" \
  -X POST "$BASE/api/hyperloop/execute" \
  -d "$json"
echo


