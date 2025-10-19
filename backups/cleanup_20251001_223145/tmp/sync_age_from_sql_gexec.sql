\set ON_ERROR_STOP on
LOAD 'age';
SET search_path = ag_catalog, public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;

\echo 'Ensuring Quant vertices'
WITH ins AS (
  SELECT DISTINCT q.id::text AS qid
  FROM quants q
)
SELECT format($q$
  SELECT * FROM cypher('soul_graph', $$
    MERGE (q:Quant {quant_id: %1$s})
  $$) as (v agtype);
$q$, quote_literal(qid))
FROM ins
\gexec

\echo 'Ensuring RELATED edges from quant_connections (MERGE also creates vertices)'
WITH edges AS (
  SELECT from_quant_id::text AS a,
         to_quant_id::text   AS b,
         COALESCE(relation_type,'RELATED') AS rt,
         COALESCE(keyword_overlap, 0.0)    AS ko
  FROM quant_connections
)
SELECT format($fmt$
  SELECT * FROM cypher('soul_graph', $$
    MERGE (a:Quant {quant_id: %1$s})
    MERGE (b:Quant {quant_id: %2$s})
    MERGE (a)-[r:RELATED {relation_type: %3$s}]->(b)
    SET r.keyword_overlap = %4$s
  $$) as (r agtype);
$fmt$, quote_literal(a), quote_literal(b), quote_literal(rt), ko::text)
FROM edges
\gexec

\echo 'AGE counts'
SELECT * FROM cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$) as (c agtype);
SELECT * FROM cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$) as (c agtype);


