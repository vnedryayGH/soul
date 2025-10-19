#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

echo SET delivery_guard.enforce=true (PUT JSON)
curl -sS -H "$H" -H "Content-Type: application/json" -X PUT \
  "$BASE/api/admin/soul/settings" \
  -d '{"key":"delivery_guard.enforce","value":"true"}'
echo

echo SET diagnostic.visible_reply=false (PUT JSON)
curl -sS -H "$H" -H "Content-Type: application/json" -X PUT \
  "$BASE/api/admin/soul/settings" \
  -d '{"key":"diagnostic.visible_reply","value":"false"}'
echo

echo GET settings snapshot
curl -sS -H "$H" "$BASE/api/admin/soul/settings/all" | head -c 1000
echo


