SET search_path = ag_catalog, public;

-- age_vertices
SELECT public.f_age_vertices() AS age_vertices;

-- age_edges
SELECT public.f_age_edges() AS age_edges;

-- rel_edges
SELECT count(*)::bigint AS rel_edges
FROM public.quant_connections;

-- coverage = edges/rel_edges (fraction, rounded to 6 decimals)
WITH e AS (
  SELECT public.f_age_edges() AS n
), re AS (
  SELECT count(*)::numeric AS n FROM public.quant_connections
)
SELECT CASE WHEN re.n > 0
            THEN round((e.n::numeric / re.n), 6)
            ELSE NULL
       END AS coverage
FROM e, re;


