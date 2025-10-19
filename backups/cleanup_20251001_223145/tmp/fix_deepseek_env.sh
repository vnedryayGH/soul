#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="/var/www/soulpulse/backend/.env"
TMP_FILE="$(mktemp)"

touch "$ENV_FILE"
# Нормализуем CRLF → LF
tr -d '\r' < "$ENV_FILE" > "$TMP_FILE" || true
mv -f "$TMP_FILE" "$ENV_FILE"

# Удаляем старые строки ключей
grep -v -E '^(DEEPSEEK_API_KEY|LLM_PROVIDER|DEEPSEEK_MODEL)=' "$ENV_FILE" > "$TMP_FILE" || true

# Добавляем актуальные значения
{
  echo "DEEPSEEK_API_KEY=sk-32a76a58a2384977b8d05fb9bee194bb"
  echo "LLM_PROVIDER=deepseek"
  echo "DEEPSEEK_MODEL=deepseek-chat"
} >> "$TMP_FILE"

mv -f "$TMP_FILE" "$ENV_FILE"
echo "ENV_UPDATED"

