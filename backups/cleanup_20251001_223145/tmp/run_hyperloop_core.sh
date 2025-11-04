#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

read -r -d '' CMDS <<'EOF'
CORE.PIPELINE.RUN input_text="P27: контрольный диалог архитектор→соул" WITH TRACE
EOF

json=$(printf '{"commands": %s}' "$(jq -Rn --arg s "$CMDS" '$s')")

curl -sS -H "$H" -H "Content-Type: application/json" \
  -X POST "$BASE/api/hyperloop/execute" \
  -d "$json"
echo


