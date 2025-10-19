CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.sync_related_edge(qa text, qb text, s double precision, ko double precision)
RETURNS void AS $$
BEGIN
  PERFORM cypher('soul_graph', format($f$
    MERGE (qa:Quant {quant_id: '%s'})
    MERGE (qb:Quant {quant_id: '%s'})
    MERGE (qa)-[r:RELATED {relation_type: 'semantic'}]->(qb)
    SET r.strength = %s,
        r.keyword_overlap = %s
  $f$, qa, qb, s::text, COALESCE(ko,0)::text));
END;
$$ LANGUAGE plpgsql;

-- Выполнить для всех связей
SELECT public.sync_related_edge(from_quant_id::text, to_quant_id::text,
  GREATEST(0.0, LEAST(1.0, connection_strength)), COALESCE(keyword_overlap,0))
FROM quant_connections;
