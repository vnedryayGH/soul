-- Create service role for AGE wrappers (no login, superuser for LOAD privilege)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'svc_age') THEN
    CREATE ROLE svc_age SUPERUSER NOLOGIN;
  END IF;
END $$;

-- Wrapper: count Quant nodes
CREATE OR REPLACE FUNCTION public.f_age_vertices()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ag_catalog, public
AS $$
DECLARE
  v bigint;
BEGIN
  -- Ensure AGE library is loaded for this session
  EXECUTE 'LOAD ''age''';
  SELECT (c)::text::bigint INTO v
  FROM ag_catalog.cypher('soul_graph', $cy$ MATCH (q:Quant) RETURN count(q) $cy$) AS (c ag_catalog.agtype);
  RETURN v;
END;
$$;

-- Wrapper: count RELATED edges
CREATE OR REPLACE FUNCTION public.f_age_edges()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ag_catalog, public
AS $$
DECLARE
  v bigint;
BEGIN
  EXECUTE 'LOAD ''age''';
  SELECT (c)::text::bigint INTO v
  FROM ag_catalog.cypher('soul_graph', $cy$ MATCH ()-[r:RELATED]->() RETURN count(r) $cy$) AS (c ag_catalog.agtype);
  RETURN v;
END;
$$;

-- Ensure ownership by svc_age and restrict execution
ALTER FUNCTION public.f_age_vertices() OWNER TO svc_age;
ALTER FUNCTION public.f_age_edges() OWNER TO svc_age;
REVOKE ALL ON FUNCTION public.f_age_vertices() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.f_age_edges() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.f_age_vertices() TO miniapp_user;
GRANT EXECUTE ON FUNCTION public.f_age_edges() TO miniapp_user;


