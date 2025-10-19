#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

for i in $(seq 1 20); do
  printf '{"text":"Нагрузка TTS #%d","format":"ogg"}' "$i" | \
    curl -sS -m 20 -H "$H" -H 'Content-Type: application/json' -d @- \
      -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/voice/tts || true
  sleep 0.3
done

echo '---metrics_tts_asr---'
curl -sS -m 10 -H "$H" http://127.0.0.1:8000/api/metrics/prometheus | \
  grep -E 'svc_tts_synthesize_p[0-9]+_ms|svc_asr_transcribe_p[0-9]+_ms|svc_tts_audio_bytes_p95|svc_asr_audio_bytes_in_p95|svc_asr_text_len_out_p95|soulpulse_errors_total_by_kind' || true


