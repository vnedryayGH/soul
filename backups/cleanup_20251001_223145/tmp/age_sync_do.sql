\set ON_ERROR_STOP on
LOAD 'age';
SET search_path = ag_catalog, public;

-- Ensure graph exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;

-- Ensure Quant vertices
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT id::text AS qid FROM public.quants
  ) LOOP
    EXECUTE format($f$
      SELECT * FROM cypher('soul_graph', $$
        MERGE (q:Quant {quant_id: %1$L})
      $$) AS (v agtype);
    $f$, r.qid);
  END LOOP;
END $$;

-- Create RELATED edges from quant_connections
DO $$
DECLARE e record;
BEGIN
  FOR e IN (
    SELECT from_quant_id::text AS a,
           to_quant_id::text   AS b,
           COALESCE(relation_type,'RELATED') AS rt,
           COALESCE(keyword_overlap, 0.0)    AS ko
    FROM public.quant_connections
  ) LOOP
    EXECUTE format($f$
      SELECT * FROM cypher('soul_graph', $$
        MERGE (qa:Quant {quant_id: %1$L})
        MERGE (qb:Quant {quant_id: %2$L})
        MERGE (qa)-[r:RELATED {relation_type: %3$L}]->(qb)
        SET r.keyword_overlap = %4$s
      $$) AS (r agtype);
    $f$, e.a, e.b, e.rt, e.ko::text);
  END LOOP;
END $$;

-- Counts
SELECT * FROM cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$) AS (c agtype);
SELECT * FROM cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$) AS (c agtype);


