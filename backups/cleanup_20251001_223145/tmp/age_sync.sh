#!/usr/bin/env bash
set -euo pipefail

DB=miniapp_db

psql_exec() {
  sudo -u postgres psql -d "$DB" -v ON_ERROR_STOP=1 -tA -F $'\t' -c "$1"
}

psql_sql() {
  sudo -u postgres psql -d "$DB" -v ON_ERROR_STOP=1 -q <<SQL
LOAD 'age';
SET search_path=ag_catalog,public;
$1
SQL
}

escape_sql() {
  sed "s/'/''/g" <<<"$1"
}

# Ensure graph exists
sudo -u postgres psql -d "$DB" -v ON_ERROR_STOP=1 -q <<'SQL'
LOAD 'age';
SET search_path=ag_catalog,public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;
SQL

# Create Quant vertices
while IFS=$'\t' read -r qid; do
  [[ -z "$qid" ]] && continue
  qid_esc=$(escape_sql "$qid")
  psql_sql "SELECT * FROM cypher('soul_graph', 'MERGE (q:Quant {quant_id: ''${qid_esc}''})') AS (v agtype);"
done < <(psql_exec "SELECT DISTINCT id::text FROM quants")

# Create RELATED edges (also ensures vertices)
while IFS=$'\t' read -r a b rt ko; do
  [[ -z "$a" || -z "$b" ]] && continue
  a_esc=$(escape_sql "$a")
  b_esc=$(escape_sql "$b")
  rt_esc=$(escape_sql "${rt:-RELATED}")
  ko_val=${ko:-0.0}
  psql_sql "SELECT * FROM cypher('soul_graph', 'MERGE (qa:Quant {quant_id: ''${a_esc}''}) MERGE (qb:Quant {quant_id: ''${b_esc}''}) MERGE (qa)-[r:RELATED {relation_type: ''${rt_esc}''}]->(qb) SET r.keyword_overlap = ${ko_val}') AS (r agtype);"
done < <(psql_exec "SELECT from_quant_id::text, to_quant_id::text, COALESCE(relation_type,'RELATED'), COALESCE(keyword_overlap,0.0) FROM quant_connections")

# Counts
psql_sql "SELECT * FROM cypher('soul_graph', 'MATCH (q:Quant) RETURN count(q)') AS (c agtype);"
psql_sql "SELECT * FROM cypher('soul_graph', 'MATCH ()-[r:RELATED]->() RETURN count(r)') AS (c agtype);"


