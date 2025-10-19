#!/usr/bin/env bash
set -euo pipefail
# Load AGE and set search path
sudo -u postgres psql -d miniapp_db -v ON_ERROR_STOP=1 \
  -c "LOAD 'age';" \
  -c "SET search_path = ag_catalog, public;"
# Generate cypher statements and execute them
sudo -u postgres psql -d miniapp_db -Atc \
  "SELECT format($$SELECT cypher(''soul_graph'', $$ MERGE (qa:Quant {quant_id: ''%s''}) MERGE (qb:Quant {quant_id: ''%s''}) MERGE (qa)-[r:RELATED {relation_type: ''semantic''}]->(qb) SET r.strength = %s, r.keyword_overlap = %s $$ );$$, from_quant_id::text, to_quant_id::text, GREATEST(0.0, LEAST(1.0, connection_strength)), COALESCE(keyword_overlap,0)) FROM quant_connections" \
  | sudo -u postgres psql -d miniapp_db -v ON_ERROR_STOP=1 -f -
# Counts
/root/run_age_counts.sh
