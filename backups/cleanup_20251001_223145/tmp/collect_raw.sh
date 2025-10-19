#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

sep(){ echo; echo "---$1---"; }

sep health
curl -sS -m 12 -H "$H" http://127.0.0.1:8000/api/health || true

sep db
curl -sS -m 12 -H "$H" http://127.0.0.1:8000/api/admin/soul/db/check || true

sep llm
curl -sS -m 20 -H "$H" -G -d 'provider=deepseek' -d 'prompt=ping' http://127.0.0.1:8000/api/admin/soul/llm/test || true

sep proc_once
printf '{"commands":"PROCESSOR.PROCESS_ONCE"}' | curl -sS -m 30 -H "$H" -H 'Content-Type: application/json' -d @- http://127.0.0.1:8000/api/hyperloop/execute || true

sep incidents
curl -sS -m 12 -H "$H" 'http://127.0.0.1:8000/api/admin/processor/incidents?limit=20' || true

sep reminders
curl -sS -m 12 -H "$H" http://127.0.0.1:8000/api/miniapp/reminders || true

sep orch
curl -sS -m 12 -H "$H" http://127.0.0.1:8000/api/bot/orchestrator/health || true

sep metrics
curl -sS -m 10 -H "$H" http://127.0.0.1:8000/api/metrics/prometheus | sed -n '1,80p' || true

sep tts_call
printf '{"text":"Проверка синтеза речи для метрик","format":"ogg"}' | curl -sS -m 30 -H "$H" -H 'Content-Type: application/json' -d @- -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/voice/tts || true

sep metrics_filtered
curl -sS -m 10 -H "$H" http://127.0.0.1:8000/api/metrics/prometheus > /root/metrics_export.txt || true
grep -E 'soulpulse_errors_total_by_kind|svc_tts_synthesize_p[0-9]+_ms|svc_asr_transcribe_p[0-9]+_ms|svc_tts_audio_bytes_p95|svc_asr_audio_bytes_in_p95|svc_asr_text_len_out_p95' /root/metrics_export.txt || true


