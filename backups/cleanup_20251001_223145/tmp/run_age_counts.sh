#!/usr/bin/env bash
set -euo pipefail

# Clean runner: prefer DATABASE_URL from .env.prod

# 1) Try /var/www env file (strip BOM/CRLF)
DATABASE_URL_FROM_FILE=""
if [ -f /var/www/soulpulse/backend/.env.prod ]; then
  DATABASE_URL_FROM_FILE=$(sed $'1s/^\xEF\xBB\xBF//' /var/www/soulpulse/backend/.env.prod \
    | tr -d '\r' \
    | grep -m1 '^DATABASE_URL=' \
    | cut -d= -f2- || true)
fi

# 2) Prefer explicit env if present, else value from file
URL="${DATABASE_URL:-${DATABASE_URL_FROM_FILE:-}}"
if [ -z "$URL" ]; then
  echo "ERR: DATABASE_URL not found" >&2
  exit 2
fi

# 3) Normalize driver suffix for psql
URL="${URL/+psycopg/}"

OUT_JSON="/var/www/soulpulse/backend/reports/age_counts.json"
OUT_PROM="/var/lib/node_exporter/textfile/age_coverage.prom"
mkdir -p "$(dirname "$OUT_JSON")" "$(dirname "$OUT_PROM")"

# 4) Direct queries (no noisy SET output)
AV=$(psql --no-psqlrc --dbname="$URL" -At -c "SELECT public.f_age_vertices()")
AE=$(psql --no-psqlrc --dbname="$URL" -At -c "SELECT public.f_age_edges()")
RE=$(psql --no-psqlrc --dbname="$URL" -At -c "SELECT count(*)::bigint FROM public.quant_connections")
CV=$(psql --no-psqlrc --dbname="$URL" -At -c "WITH e AS (SELECT public.f_age_edges() AS n), re AS (SELECT count(*)::numeric AS n FROM public.quant_connections) SELECT CASE WHEN re.n>0 THEN round((e.n::numeric/re.n),6) ELSE NULL END FROM e, re")

# 5) Write artifacts
printf '{"age_vertices":%s,"age_edges":%s,"rel_edges":%s,"coverage":%s,"ts":"%s"}\n' \
  "${AV:-0}" "${AE:-0}" "${RE:-0}" "${CV:-null}" "$(date -u +%FT%TZ)" > "$OUT_JSON"
printf 'age_coverage_fraction %s\n' "${CV:-0}" > "$OUT_PROM"
echo "OK: wrote $OUT_JSON and $OUT_PROM" >&2
