#!/usr/bin/env bash
set -euo pipefail

H="X-Telegram-User-ID: 468326902"
BASE="http://127.0.0.1:8000"

echo LAST_TRACE_FROM_LOG
TRACE_ID=$(journalctl -u soulpulse-backend.service -n 400 --no-pager | grep -oE 'trace_id: [0-9a-f-]+' | awk '{print $2}' | tail -n 1 || true)
echo TRACE_ID: ${TRACE_ID:-}

if [ -n "${TRACE_ID:-}" ]; then
  echo SIGNATURE_STEPS_BY_TRACE
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/steps/by-trace?trace_id=${TRACE_ID}" || true
  echo
  echo INCIDENTS_RECENT
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/incidents" || true
  echo
  echo STATS
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/stats" || true
  echo
else
  echo NO_TRACE_ID
fi


