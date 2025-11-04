-- Run on DB host as postgres
CREATE EXTENSION IF NOT EXISTS age;
SET search_path = ag_catalog, public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM ag_catalog.create_graph('soul_graph');
  END IF;
END $$;

-- Allow calling AGE functions
GRANT USAGE ON SCHEMA ag_catalog TO PUBLIC;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ag_catalog TO PUBLIC;
GRANT USAGE ON TYPE ag_catalog.agtype TO PUBLIC;

-- Grant app role access to soul_graph schema
GRANT USAGE ON SCHEMA "soul_graph" TO "miniapp_user";
GRANT SELECT ON ALL TABLES IN SCHEMA "soul_graph" TO "miniapp_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA "soul_graph" GRANT SELECT ON TABLES TO "miniapp_user";

