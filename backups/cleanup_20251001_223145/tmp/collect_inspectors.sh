#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

echo '---INSPECTOR.NET---'
printf '{"commands":"INSPECTOR.RUN key=net.channels.status"}' \
 | curl -sS -m 25 -H "$H" -H 'Content-Type: application/json' -d @- \
    http://127.0.0.1:8000/api/hyperloop/execute || true
echo

echo '---INSPECTOR.REMINDER---'
printf '{"commands":"INSPECTOR.RUN key=reminder.actor.coverage"}' \
 | curl -sS -m 25 -H "$H" -H 'Content-Type: application/json' -d @- \
    http://127.0.0.1:8000/api/hyperloop/execute || true
echo


