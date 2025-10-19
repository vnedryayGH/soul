#!/usr/bin/env bash
set -euo pipefail
for f in /etc/soulpulse/miniapp_backend.env /var/www/soulpulse/backend/.env.prod; do
  [ -f "$f" ] || continue
  cp "$f" "$f.bak_switch_to_piper" || true
  if grep -q '^TTS_PROVIDER=' "$f"; then sed -i 's/^TTS_PROVIDER=.*/TTS_PROVIDER=piper/' "$f"; else echo 'TTS_PROVIDER=piper' >> "$f"; fi
  sed -i '/^SILERO_TTS_URL=/d' "$f" || true
  if grep -q '^PIPER_MODEL_DIR=' "$f"; then sed -i 's|^PIPER_MODEL_DIR=.*|PIPER_MODEL_DIR=/opt/piper/models|' "$f"; else echo 'PIPER_MODEL_DIR=/opt/piper/models' >> "$f"; fi
  if grep -q '^PIPER_BIN=' "$f"; then sed -i 's|^PIPER_BIN=.*|PIPER_BIN=/usr/local/bin/piper|' "$f"; else echo 'PIPER_BIN=/usr/local/bin/piper' >> "$f"; fi
done
systemctl restart soulpulse-backend.service
systemctl is-active soulpulse-backend.service