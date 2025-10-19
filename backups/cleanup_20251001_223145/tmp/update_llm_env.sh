#!/usr/bin/env bash
set -euo pipefail

ENV_DIR="/var/www/soulpulse/backend"
ENV_FILE="$ENV_DIR/.env"
ENV_PROD="$ENV_DIR/.env.prod"

normalize() {
  local file="$1"
  [ -f "$file" ] || touch "$file"
  local tmp
  tmp="$(mktemp)"
  tr -d '\r' < "$file" > "$tmp" || true
  mv -f "$tmp" "$file"
}

ensure_keys() {
  local file="$1"
  local tmp
  tmp="$(mktemp)"
  grep -v -E '^(DEEPSEEK_API_KEY|LLM_PROVIDER|DEEPSEEK_MODEL)=' "$file" > "$tmp" || true
  {
    echo "DEEPSEEK_API_KEY=sk-32a76a58a2384977b8d05fb9bee194bb"
    echo "LLM_PROVIDER=deepseek"
    echo "DEEPSEEK_MODEL=deepseek-chat"
  } >> "$tmp"
  mv -f "$tmp" "$file"
}

normalize "$ENV_FILE"
normalize "$ENV_PROD"
ensure_keys "$ENV_FILE"
ensure_keys "$ENV_PROD"
echo "UPDATED: $ENV_FILE and $ENV_PROD"

