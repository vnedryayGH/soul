LOAD 'age';
SET search_path=ag_catalog,public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ag_catalog.ag_graph WHERE name='soul_graph') THEN
    PERFORM ag_catalog.create_graph('soul_graph');
  END IF;
END $$;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT 
      from_quant_id::text AS a,
      to_quant_id::text   AS b,
      COALESCE(connection_type::text,'semantic') AS rt,
      COALESCE(keyword_overlap,0.0) AS ko
    FROM quant_connections
  LOOP
    -- Строим текст Cypher-запроса и исполняем его как литерал через EXECUTE,
    -- чтобы второй аргумент cypher был string literal (cstring)
    EXECUTE (
      'SELECT ag_catalog.cypher(''soul_graph'', '
      || quote_literal(
        format(
          $$MERGE (qa:Quant {quant_id: '%s'}) MERGE (qb:Quant {quant_id: '%s'}) MERGE (qa)-[r:RELATED {relation_type: '%s'}]->(qb) SET r.keyword_overlap = %s$$,
          rec.a, rec.b, rec.rt, rec.ko
        )
      )
      || '::ag_catalog.cypher)'
    );
  END LOOP;
END $$;


