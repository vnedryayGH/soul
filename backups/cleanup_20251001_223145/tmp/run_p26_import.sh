#!/usr/bin/env bash
set -euo pipefail

API_LOCAL="http://127.0.0.1:8000"
HDR1='X-Telegram-User-ID: 468326902'
HDR2='Content-Type: application/json'
BODY='{"dry_run": false}'

echo "== Import tasks =="
curl -sS -H "$HDR1" -H "$HDR2" -d "$BODY" -X POST "$API_LOCAL/api/admin/calendar-transport/import/tasks?limit=50"
echo

echo "== Import events =="
curl -sS -H "$HDR1" -H "$HDR2" -d "$BODY" -X POST "$API_LOCAL/api/admin/calendar-transport/import/events?limit=50"
echo

