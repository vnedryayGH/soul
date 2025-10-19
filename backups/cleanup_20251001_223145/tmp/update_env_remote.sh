#!/usr/bin/env bash
set -euo pipefail

FILE="/etc/soulpulse/miniapp_backend.env"
TOKEN="8236996666:AAFdY2uSqoNIxFibTXolnrLBYjTTK_DWF-E"

echo "Backing up $FILE ..."
cp -a "$FILE" "${FILE}.bak_$(date +%Y%m%d_%H%M%S)" || true

echo "Updating BOT_TOKEN/BOT_TOKENS and enabling mock LLM ..."
sed -i '/^BOT_TOKEN=/d' "$FILE" || true
sed -i '/^BOT_TOKENS=/d' "$FILE" || true
sed -i '/^DISABLE_EXTERNAL_LLM=/d' "$FILE" || true
echo "BOT_TOKEN=$TOKEN" >> "$FILE"
echo "BOT_TOKENS=$TOKEN" >> "$FILE"
echo "DISABLE_EXTERNAL_LLM=1" >> "$FILE"

echo "Restarting backend ..."
systemctl restart soulpulse-backend
sleep 1

echo "Checking getMe ..."
curl -s "https://api.telegram.org/bot${TOKEN}/getMe" | cat
echo

echo "Done."


