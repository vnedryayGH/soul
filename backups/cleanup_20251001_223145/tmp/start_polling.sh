#!/usr/bin/env bash
set -euo pipefail

cd /var/www/soulpulse/backend
mkdir -p /var/log/soulpulse

# Load environment
set -a
[ -f ./.env ] && . ./.env || true
set +a

TOKEN="${BOT_TOKENS:-${BOT_TOKEN:-}}"
if [ -z "$TOKEN" ]; then
  echo "NO_TOKEN"
  exit 1
fi

# Delete webhook to enable polling
curl -sS -H 'Content-Type: application/json' -d '{"drop_pending_updates":true}' -X POST "https://api.telegram.org/bot${TOKEN}/deleteWebhook" || true

# Export token(s) for the bot process
export BOT_TOKENS="$TOKEN"

# Start polling bot in background
nohup /var/www/soulpulse/backend/venv/bin/python test_polling_bot.py >> /var/log/soulpulse/polling.log 2>&1 &
PID=$!
echo "STARTED_PID=${PID}"
sleep 1
echo "=== TAIL /var/log/soulpulse/polling.log ==="
tail -n 60 /var/log/soulpulse/polling.log || true

