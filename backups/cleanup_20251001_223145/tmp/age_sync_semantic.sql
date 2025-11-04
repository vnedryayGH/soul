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

\echo 'Ensure Quant vertices'
WITH ins AS (
  SELECT DISTINCT id::text AS qid FROM public.quants
)
SELECT format($q$
  SELECT * FROM cypher('soul_graph', $$
    OPTIONAL MATCH (q:Quant {quant_id: %1$L})
    WITH q
    WHERE q IS NULL
    CREATE (:Quant {quant_id: %1$L})
  $$) AS (v agtype);
$q$, qid)
FROM ins
\gexec

\echo 'Create RELATED edges with relation_type=semantic'
WITH edges AS (
  SELECT from_quant_id::text AS a,
         to_quant_id::text   AS b,
         COALESCE(keyword_overlap, 0.0) AS ko
  FROM public.quant_connections
)
SELECT format($q$
  SELECT * FROM cypher('soul_graph', $$
    MATCH (a:Quant {quant_id: %1$L}), (b:Quant {quant_id: %2$L})
    OPTIONAL MATCH (a)-[rel:RELATED {relation_type: 'semantic'}]->(b)
    WITH a,b,rel
    WHERE rel IS NULL
    CREATE (a)-[new_rel:RELATED {relation_type: 'semantic', keyword_overlap: %3$s}]->(b)
  $$) AS (v agtype);
$q$, a, b, ko::text)
FROM edges
\gexec

\echo 'AGE counts'
SELECT * FROM cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$) as (c agtype);
SELECT * FROM cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$) as (c agtype);


