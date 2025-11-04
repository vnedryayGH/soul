#!/usr/bin/env bash
set -euo pipefail

: "${ADMIN_HOST:?missing}"
: "${ADMIN_USER:?missing}"
: "${ADMIN_DB:?missing}"
: "${PGPASSWORD:?missing}"

# Parse app role from backend .env.prod
APP_URL=$(sed $'1s/^\xEF\xBB\xBF//' /var/www/soulpulse/backend/.env.prod | tr -d '\r' | grep -m1 '^DATABASE_URL=' | cut -d= -f2-)
APP_ROLE=$(printf '%s' "$APP_URL" | sed -E 's|^[a-zA-Z0-9+.-]+://([^:@/]+).*|\1|')
if [ -z "$APP_ROLE" ]; then
  echo "ERR: Cannot parse app role" >&2
  exit 2
fi

psql -h "$ADMIN_HOST" -U "$ADMIN_USER" -d "$ADMIN_DB" -v ON_ERROR_STOP=1 <<'SQL'
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
SQL

# Grants to app role on graph schema
psql -h "$ADMIN_HOST" -U "$ADMIN_USER" -d "$ADMIN_DB" -v ON_ERROR_STOP=1 <<SQL
GRANT USAGE ON SCHEMA "soul_graph" TO "${APP_ROLE}";
GRANT SELECT ON ALL TABLES IN SCHEMA "soul_graph" TO "${APP_ROLE}";
ALTER DEFAULT PRIVILEGES IN SCHEMA "soul_graph" GRANT SELECT ON TABLES TO "${APP_ROLE}";
SQL

echo DONE_GRANTS


