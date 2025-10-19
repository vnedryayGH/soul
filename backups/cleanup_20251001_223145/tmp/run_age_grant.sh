#!/usr/bin/env bash
set -euo pipefail

# Discover ADMIN URL (DB_ADMIN_URL) and APP URL (DATABASE_URL)
ADMIN_URL=""
APP_URL=""

read_env_var() {
  local file="$1" key="$2" val
  [ -f "$file" ] || return 1
  val=$(sed $'1s/^\xEF\xBB\xBF//' "$file" | tr -d '\r' | grep -m1 "^${key}=" | cut -d= -f2- || true)
  [ -n "${val}" ] || return 1
  printf '%s' "$val"
}

# Try /etc first, then app .env.prod
ADMIN_URL=$(read_env_var /etc/soulpulse/miniapp_backend.env DB_ADMIN_URL || true)
if [ -z "$ADMIN_URL" ]; then
  ADMIN_URL=$(read_env_var /var/www/soulpulse/backend/.env.prod DB_ADMIN_URL || true)
fi

APP_URL=$(read_env_var /var/www/soulpulse/backend/.env.prod DATABASE_URL || true)
if [ -z "$APP_URL" ]; then
  echo "ERR: DATABASE_URL not found in backend/.env.prod" >&2
  exit 2
fi

if [ -z "$ADMIN_URL" ]; then
  echo "ERR: DB_ADMIN_URL not found in env; cannot apply grants safely" >&2
  exit 3
fi

# Normalize +psycopg suffix for psql
ADMIN_URL="${ADMIN_URL/+psycopg/}"
APP_URL="${APP_URL/+psycopg/}"

# Extract app role from URL: scheme://user:pass@host:port/db
APP_ROLE=$(printf '%s' "$APP_URL" | sed -E 's|^[a-zA-Z0-9+.-]+://([^:@/]+).*|\1|')
if [ -z "$APP_ROLE" ]; then
  echo "ERR: Cannot parse app role from DATABASE_URL" >&2
  exit 4
fi

SQL_FILE="/root/age_grant_exec.sql"
cat >"$SQL_FILE" <<SQL
CREATE EXTENSION IF NOT EXISTS age;
SET search_path = ag_catalog, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM ag_catalog.create_graph('soul_graph');
  END IF;
END $$;

GRANT USAGE ON SCHEMA ag_catalog TO PUBLIC;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ag_catalog TO PUBLIC;
GRANT USAGE ON TYPE ag_catalog.agtype TO PUBLIC;

GRANT USAGE ON SCHEMA "soul_graph" TO "${APP_ROLE}";
GRANT SELECT ON ALL TABLES IN SCHEMA "soul_graph" TO "${APP_ROLE}";
ALTER DEFAULT PRIVILEGES IN SCHEMA "soul_graph" GRANT SELECT ON TABLES TO "${APP_ROLE}";
SQL

exec psql --no-psqlrc --dbname="$ADMIN_URL" -v ON_ERROR_STOP=1 -f "$SQL_FILE"


