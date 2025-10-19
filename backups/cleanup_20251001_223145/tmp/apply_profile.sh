#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

echo APPLY_PROFILE prod_safe
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/feature-flags/apply-profile" \
  -d '{"profile":"prod_safe"}'
echo

echo SHOW_FLAGS_STATE
curl -sS -H "$H" "$BASE/api/admin/feature-flags/state"
echo


