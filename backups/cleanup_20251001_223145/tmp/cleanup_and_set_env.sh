#!/usr/bin/env bash
set -euo pipefail
# 1) ??????? ?????????? ? /var/www/soulpulse/backend
cd /var/www/soulpulse/backend
mkdir -p env_backups
shopt -s nullglob || true
for f in .env.prod.* .env.prod.bak*; do
  if [ -f "$f" ]; then mv -v "$f" env_backups/ || true; fi
done
# 2) ?????????? /var/www/soulpulse/backend/.env.prod
F1=.env.prod
if [ -f "$F1" ]; then cp "$F1" "$F1.bak_all" || true; fi
if [ -f "$F1" ]; then
  (grep -q '^TTS_PROVIDER=' "$F1" && sed -i 's/^TTS_PROVIDER=.*/TTS_PROVIDER=silero_http/' "$F1") || echo 'TTS_PROVIDER=silero_http' >> "$F1"
  (grep -q '^SILERO_TTS_URL=' "$F1" && sed -i 's|^SILERO_TTS_URL=.*|SILERO_TTS_URL=http://127.0.0.1:8088/api/tts|' "$F1") || echo 'SILERO_TTS_URL=http://127.0.0.1:8088/api/tts' >> "$F1"
fi
# 3) ?????????? /etc/soulpulse/miniapp_backend.env
F2=/etc/soulpulse/miniapp_backend.env
if [ -f "$F2" ]; then cp "$F2" "$F2.bak_all" || true; fi
if [ -f "$F2" ]; then
  (grep -q '^TTS_PROVIDER=' "$F2" && sed -i 's/^TTS_PROVIDER=.*/TTS_PROVIDER=silero_http/' "$F2") || echo 'TTS_PROVIDER=silero_http' >> "$F2"
  (grep -q '^SILERO_TTS_URL=' "$F2" && sed -i 's|^SILERO_TTS_URL=.*|SILERO_TTS_URL=http://127.0.0.1:8088/api/tts|' "$F2") || echo 'SILERO_TTS_URL=http://127.0.0.1:8088/api/tts' >> "$F2"
fi
# 4) ?????????? backend
systemctl restart soulpulse-backend.service
systemctl is-active soulpulse-backend.service
# 5) ????????? ???? OGG ????? backend
curl -sS -H 'X-Telegram-User-ID: 468326902' -H 'Content-Type: application/json' \
  -d '{"text":"???? OGG","persona_key":"FR_Ranevskaya_Persona_v1_4","format":"ogg"}' \
  http://127.0.0.1:8000/api/voice/tts -o /tmp/tts_test.ogg || true
if [ -f /tmp/tts_test.ogg ]; then stat -c '%n %s' /tmp/tts_test.ogg || ls -l /tmp/tts_test.ogg; else echo 'OGG_NOT_CREATED'; fi