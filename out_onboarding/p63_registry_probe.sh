#!/usr/bin/env bash
# P63 Registry Probe: detector + EXPLAIN + last10
# Usage: PSQL="psql 'host=... dbname=... user=... sslmode=require'" ./ops/scripts/p63_registry_probe.sh

set -euo pipefail

echo "[P63] registry: count by registry_key"
${PSQL:-psql} -X -A -q -c "select registry_key, count(*) from public.project_registry_entries group by 1 order by 2 desc limit 20" || true

echo "[P63] last 10 entries"
${PSQL:-psql} -X -A -q -c "select to_char(updated_at,'YYYY-MM-DD HH24:MI:SS') as ts, registry_key, left(entry_key,120) as entry, left(title,120) as title from public.project_registry_entries order by updated_at desc limit 10" || true

echo "[P63] EXPLAIN (FORMAT JSON) last10"
${PSQL:-psql} -X -A -q -c "EXPLAIN (FORMAT JSON) select * from public.project_registry_entries order by updated_at desc limit 10" || true
set -euo pipefail

# Usage: ./p63_registry_probe.sh [db_name]
DB_NAME="${1:-miniapp_db}"

run_psql() {
  sudo -u postgres psql -d "$DB_NAME" -At -v ON_ERROR_STOP=1 -c "$1"
}

echo "[probe] scanning candidate registry tables in $DB_NAME"
# Find candidate table by characteristic columns
SQL_FIND_CAND="\
WITH t AS (
  SELECT table_schema, table_name
  FROM information_schema.columns
  WHERE column_name IN ('registry_key','entry_key','path_repo','checksum','content_md','updated_at','title')
  GROUP BY table_schema, table_name
  HAVING COUNT(*) >= 4
)
SELECT table_schema||'.'||table_name FROM t ORDER BY 1 LIMIT 1;"

CAND=$(run_psql "$SQL_FIND_CAND" | head -n1 || true)
if [[ -z "${CAND:-}" ]]; then
  echo "[probe] no candidates found by columns; trying by name pattern"
  SQL_FIND_BYNAME="SELECT table_schema||'.'||table_name FROM information_schema.tables\
    WHERE table_type='BASE TABLE' AND (table_name ILIKE '%registry%' OR table_name ILIKE '%project_regis%' OR table_name ILIKE '%repo%')\
    ORDER BY 1 LIMIT 1;"
  CAND=$(run_psql "$SQL_FIND_BYNAME" | head -n1 || true)
fi

if [[ -z "${CAND:-}" ]]; then
  echo "[probe] ERROR: registry table not found" >&2
  exit 2
fi

echo "[probe] candidate table: $CAND"

echo "[probe] EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) — latest 50"
run_psql "EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT entry_key, updated_at FROM ${CAND} WHERE registry_key='project:demo_project:docs' ORDER BY updated_at DESC LIMIT 50;" | head -n 1

echo "[probe] last 10 rows (entry_key|title|checksum|len(content_md))"
run_psql "SELECT entry_key||'|'||COALESCE(title,'')||'|'||COALESCE(checksum,'')||'|'||COALESCE(length(content_md),0) FROM ${CAND} WHERE registry_key='project:demo_project:docs' ORDER BY updated_at DESC LIMIT 10;"

echo "[probe] done"


