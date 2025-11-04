LOAD 'age';
SET search_path = ag_catalog, public;
DO $$
DECLARE r RECORD;
        q TEXT;
BEGIN
  FOR r IN
    SELECT from_quant_id::text AS qa,
           to_quant_id::text   AS qb,
           GREATEST(0.0, LEAST(1.0, connection_strength))::text AS s,
           COALESCE(keyword_overlap, 0)::text AS ko
    FROM quant_connections
  LOOP
    q := format($f$
      MERGE (qa:Quant {quant_id: '%s'})
      MERGE (qb:Quant {quant_id: '%s'})
      MERGE (qa)-[r:RELATED {relation_type: 'semantic'}]->(qb)
      SET r.strength = %s,
          r.keyword_overlap = %s
    $f$, r.qa, r.qb, r.s, r.ko);
    PERFORM 1 FROM cypher('soul_graph'::cstring, q::cstring) AS (res agtype);
  END LOOP;
END $$;
