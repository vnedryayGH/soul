CREATE EXTENSION IF NOT EXISTS age;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM ag_catalog.create_graph('soul_graph');
  END IF;
END $$;
GRANT USAGE ON SCHEMA ag_catalog TO PUBLIC;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ag_catalog TO PUBLIC;
GRANT USAGE ON TYPE ag_catalog.agtype TO PUBLIC;


