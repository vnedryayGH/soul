CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;

-- Синхронизация RELATED из quant_connections в AGE (через format)
SELECT cypher(
  'soul_graph',
  format(
    $$
      MERGE (qa:Quant {quant_id: %L})
      MERGE (qb:Quant {quant_id: %L})
      MERGE (qa)-[r:RELATED {relation_type: 'semantic'}]->(qb)
      SET r.strength = %s,
          r.keyword_overlap = %s
    $$,
    from_quant_id::text,
    to_quant_id::text,
    (GREATEST(0.0, LEAST(1.0, connection_strength)))::text,
    COALESCE(keyword_overlap, 0)::text
  )
)
FROM quant_connections;
