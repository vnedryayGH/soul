#!/usr/bin/env bash
set -euo pipefail

BASE="http://127.0.0.1:8000"
H="X-Telegram-User-ID: 468326902"

echo APPLY_PROFILE
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/feature-flags/apply-profile" \
  -d '{"profile":"prod_safe"}'
echo

echo REGISTER_TESTS
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/gendarme/tests/register" \
  -d '{"test_key":"p27_guard_chain","title":"P27 Guard Chain","description":"Required steps and guard blocking","owner":"soul","category":"p27","severity":"high","role_context":"soul","schedule_minutes":60,"expected_outcome":{"ok":true}}'
echo
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/gendarme/tests/register" \
  -d '{"test_key":"sanitizer_clean_visible","title":"Sanitizer Visible","description":"Tech blocks are removed","owner":"soul","category":"sanitizer","severity":"medium","role_context":"soul","schedule_minutes":120,"expected_outcome":{"ok":true}}'
echo
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/gendarme/tests/register" \
  -d '{"test_key":"feature_flags_profiles","title":"Flags Profile","description":"Apply prod_safe and verify states","owner":"soul","category":"flags","severity":"medium","role_context":"soul","schedule_minutes":180,"expected_outcome":{"ok":true}}'
echo
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/gendarme/tests/register" \
  -d '{"test_key":"judge_code_policy","title":"Judge Code Policy","description":"Detect unsafe diffs","owner":"soul","category":"judge","severity":"high","role_context":"soul","schedule_minutes":240,"expected_outcome":{"ok":true}}'
echo
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/gendarme/tests/register" \
  -d '{"test_key":"seeker_recent_scan","title":"Seeker Recent","description":"No grey traces","owner":"soul","category":"p27","severity":"high","role_context":"soul","schedule_minutes":60,"expected_outcome":{"ok":true}}'
echo

echo RUN_TESTS
for k in p27_guard_chain sanitizer_clean_visible feature_flags_profiles judge_code_policy seeker_recent_scan; do
  curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/admin/gendarme/tests/run" \
    -d "{\"test_key\":\"$k\"}"
  echo
done

echo RUN_SEEKER
curl -sS -H "$H" -X POST "$BASE/api/admin/soul/trace/signature/seeker/run?minutes=10&limit=200"
echo

echo ARCH_SOUL_CONTROL
curl -sS -H "$H" -H "Content-Type: application/json" -X POST "$BASE/api/soul/process" \
  -d '{"input_text":"P27: контрольный диалог архитектор→соул"}'
echo


