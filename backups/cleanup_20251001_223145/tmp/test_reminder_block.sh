#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

run_cmd() {
  local dsl="$1"
  printf '{"commands":"%s"}' "$dsl" | curl -sS -m 25 -H "$H" -H 'Content-Type: application/json' -d @- http://127.0.0.1:8000/api/hyperloop/execute
}

now_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo '---SET BLOCK ON---'
run_cmd 'PROCESSOR.POLICY.SET key=processor.block.reminder value={"enabled":true}' || true
echo

echo '---INJECT REMINDER (blocked)---'
run_cmd "PROCESSOR.EVENT.INJECT kind=reminder payload={\\\"text\\\":\\\"Тест блокировки\\\",\\\"when\\\":\\\"$now_utc\\\"} priority=5" || true
echo
sleep 1

echo '---PROCESS_ONCE (blocked)---'
run_cmd 'PROCESSOR.PROCESS_ONCE' || true
echo

echo '---INCIDENTS AFTER BLOCK---'
run_cmd 'DB.SEARCH table=processor_incidents limit=5' || true
echo

echo '---SET BLOCK OFF---'
run_cmd 'PROCESSOR.POLICY.SET key=processor.block.reminder value={"enabled":false}' || true
echo

echo '---INJECT REMINDER (unblocked)---'
run_cmd "PROCESSOR.EVENT.INJECT kind=reminder payload={\\\"text\\\":\\\"Тест доставки\\\",\\\"when\\\":\\\"$now_utc\\\"} priority=5" || true
echo
sleep 1

echo '---PROCESS_ONCE (unblocked)---'
run_cmd 'PROCESSOR.PROCESS_ONCE' || true
echo

echo '---INCIDENTS AFTER UNBLOCK---'
run_cmd 'DB.SEARCH table=processor_incidents limit=5' || true
echo


