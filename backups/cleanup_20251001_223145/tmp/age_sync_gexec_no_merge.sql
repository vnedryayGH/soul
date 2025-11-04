\set ON_ERROR_STOP on
LOAD 'age';
SET search_path = ag_catalog, public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;

\echo 'Ensuring Quant vertices without MERGE'
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

\echo 'Creating RELATED edges without MERGE'
WITH edges AS (
  SELECT from_quant_id::text AS a,
         to_quant_id::text   AS b,
         COALESCE(connection_type::text,'semantic') AS ct,
         COALESCE(keyword_overlap, 0.0)      AS ko
  FROM public.quant_connections
)
SELECT format($q$
  SELECT * FROM cypher('soul_graph', $$
    OPTIONAL MATCH (a:Quant {quant_id: %1$L})
    OPTIONAL MATCH (b:Quant {quant_id: %2$L})
    WITH a,b
    OPTIONAL MATCH (a)-[r:RELATED {relation_type: %3$L}]->(b)
    WITH a,b,r
    WHERE r IS NULL AND a IS NOT NULL AND b IS NOT NULL
    CREATE (a)-[r:RELATED {relation_type: %3$L, keyword_overlap: %4$s}]->(b)
  $$) AS (r agtype);
$q$, a, b, ct, ko::text)
FROM edges
\gexec

\echo 'AGE counts'
SELECT * FROM cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$) as (c agtype);
SELECT * FROM cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$) as (c agtype);


