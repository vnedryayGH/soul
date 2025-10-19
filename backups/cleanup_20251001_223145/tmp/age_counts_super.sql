CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, public;

-- age_vertices
SELECT (c)::text::bigint AS age_vertices
FROM ag_catalog.cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$)
AS (c ag_catalog.agtype);

-- age_edges
SELECT (c)::text::bigint AS age_edges
FROM ag_catalog.cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$)
AS (c ag_catalog.agtype);

-- rel_edges
SELECT count(*)::bigint AS rel_edges
FROM public.quant_connections;

-- coverage
WITH e AS (
  SELECT (c)::text::bigint AS n
  FROM ag_catalog.cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$)
  AS (c ag_catalog.agtype)
), re AS (
  SELECT count(*)::numeric AS n FROM public.quant_connections
)
SELECT CASE WHEN re.n > 0 THEN round((e.n::numeric / re.n), 6) ELSE NULL END AS coverage
FROM e, re;


