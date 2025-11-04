#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="/var/www/soulpulse/backend/.env.prod"
if [ -f "$ENV_FILE" ]; then
  DB=$(sed -n 's/^PG_URL=\(.*\)$/\1/p' "$ENV_FILE" | head -n1)
  if [ -z "$DB" ]; then
    DB=$(sed -n 's/^DATABASE_URL=\(.*\)$/\1/p' "$ENV_FILE" | head -n1)
  fi
else
  DB="${PG_URL:-${DATABASE_URL:-}}"
fi

if [ -z "${DB:-}" ]; then
  echo "DBURL missing" >&2
  exit 1
fi

psql "$DB" -v ON_ERROR_STOP=1 -f /var/www/soulpulse/backend/tmp/age_setup.sql
echo "AGE setup completed"


