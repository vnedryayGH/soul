#!/usr/bin/env bash
set -euo pipefail

# Экспорт метрик AGE sync в node_exporter textfile collector

# 1) Прочитать DATABASE_URL из ENV или файла PROD
DATABASE_URL_FROM_FILE=""
if [ -f /var/www/soulpulse/backend/.env.prod ]; then
  DATABASE_URL_FROM_FILE=$(sed $'1s/^\xEF\xBB\xBF//' /var/www/soulpulse/backend/.env.prod \
    | tr -d '\r' \
    | grep -m1 '^DATABASE_URL=' \
    | cut -d= -f2- || true)
fi

URL="${DATABASE_URL:-${DATABASE_URL_FROM_FILE:-}}"
if [ -z "$URL" ]; then
  echo "ERR: DATABASE_URL not found" >&2
  exit 2
fi

# 2) Нормализовать драйвер для psql
URL="${URL/+psycopg/}"

# 3) Прочитать значения из soul_settings
sql_value() {
  local key="$1"
  psql --no-psqlrc --dbname="$URL" -At -c "SELECT COALESCE(value,'0') FROM soul_settings WHERE key='${key}' LIMIT 1" 2>/dev/null || echo 0
}

LAG=$(sql_value 'age.sync.lag_sec')
INS=$(sql_value 'age.sync.inserted_total')
UPD=$(sql_value 'age.sync.updated_total')
SKP=$(sql_value 'age.sync.skipped_total')
LTS=$(psql --no-psqlrc --dbname="$URL" -At -c "SELECT COALESCE(extract(epoch from value::timestamptz)::bigint,0) FROM soul_settings WHERE key='age.sync.last_ts' LIMIT 1" 2>/dev/null || echo 0)

# 4) Записать Prometheus textfile
OUT_PROM="/var/lib/node_exporter/textfile/age_sync.prom"
mkdir -p "$(dirname "$OUT_PROM")"
{
  echo "age_sync_lag_sec ${LAG:-0}"
  echo "age_sync_inserted_total ${INS:-0}"
  echo "age_sync_updated_total ${UPD:-0}"
  echo "age_sync_skipped_total ${SKP:-0}"
  echo "age_sync_last_ts_unixtime ${LTS:-0}"
} > "$OUT_PROM"

echo "OK: wrote $OUT_PROM" >&2


