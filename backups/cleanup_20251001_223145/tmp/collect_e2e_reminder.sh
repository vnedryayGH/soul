#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

now_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo '---E2E.REMINDER.INJECT---'
cmd_inject=$(cat <<JSON
{"commands":"PROCESSOR.EVENT.INJECT kind=reminder payload={\\\"text\\\":\\\"Позвонить маме\\\",\\\"when\\\":\\\"$now_utc\\\",\\\"persona\\\":\\\"basic\\\"}"}
JSON
)
printf '%s' "$cmd_inject" | curl -sS -m 25 -H "$H" -H 'Content-Type: application/json' -d @- \
  http://127.0.0.1:8000/api/hyperloop/execute || true
echo

sleep 1

echo '---E2E.REMINDER.PROCESS_ONCE---'
printf '{"commands":"PROCESSOR.PROCESS_ONCE"}' | curl -sS -m 25 -H "$H" -H 'Content-Type: application/json' -d @- \
  http://127.0.0.1:8000/api/hyperloop/execute || true
echo


