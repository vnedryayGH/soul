#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

echo CONTROL_CALL
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/soul/process" \
  -d '{"input_text":"P27: контрольный диалог архитектор→соул"}' | tee /tmp/soul_control.json
echo

TRACE_ID=$(jq -r '(.message.meta.signature.trace_id // .meta.signature.trace_id // .signature.trace_id // empty)' /tmp/soul_control.json || true)
echo TRACE_ID: ${TRACE_ID:-}

if [ -n "${TRACE_ID:-}" ]; then
  echo SIGNATURE_STEPS_BY_TRACE
  curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/steps/by-trace?trace_id=${TRACE_ID}"
  echo
else
  echo NO_TRACE_ID
fi

echo INCIDENTS_RECENT
curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/incidents"
echo

echo STATS
curl -sS -H "$H" "$BASE/api/admin/soul/trace/signature/stats"
echo


