CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph'
  ) THEN
    PERFORM create_graph('soul_graph');
  END IF;
END $$;


