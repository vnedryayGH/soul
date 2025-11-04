#!/usr/bin/env bash
set -euo pipefail
H='X-Telegram-User-ID: 468326902'

for i in 1 2 3 4 5; do
  printf '{"text":"TTS метрика #%d","format":"ogg"}' "$i" | \
    curl -sS -m 30 -H "$H" -H 'Content-Type: application/json' -d @- \
      -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/voice/tts || true
  sleep 1
done

curl -sS -m 10 -H "$H" http://127.0.0.1:8000/api/metrics/prometheus > /root/metrics.txt || true
echo '---svc_tts_lines---'
grep -E 'svc_tts_|svc_asr_|soulpulse_errors_total_by_kind' /root/metrics.txt || true

