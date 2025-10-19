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

-- Ensure Quant vertices without MERGE
DO $$
DECLARE r RECORD;
DECLARE cnt BIGINT;
BEGIN
  FOR r IN (
    SELECT id::text AS qid FROM public.quants
  ) LOOP
    SELECT c FROM cypher('soul_graph', $$ MATCH (q:Quant {quant_id: $qid}) RETURN count(q) $$)
      AS (c BIGINT)
      INTO cnt
      USING r.qid;
    IF COALESCE(cnt, 0) = 0 THEN
      PERFORM * FROM cypher('soul_graph', $$ CREATE (q:Quant {quant_id: $qid}) $$)
        AS (v agtype)
        USING r.qid;
    END IF;
  END LOOP;
END $$;

-- Create RELATED edges from quant_connections without MERGE
DO $$
DECLARE e RECORD;
DECLARE cnt BIGINT;
BEGIN
  FOR e IN (
    SELECT from_quant_id::text AS a,
           to_quant_id::text   AS b,
           COALESCE(relation_type,'RELATED') AS rt,
           COALESCE(keyword_overlap, 0.0)    AS ko
    FROM public.quant_connections
  ) LOOP
    -- ensure endpoints exist
    SELECT c FROM cypher('soul_graph', $$ MATCH (q:Quant {quant_id: $id}) RETURN count(q) $$)
      AS (c BIGINT) INTO cnt USING e.a;
    IF COALESCE(cnt,0) = 0 THEN
      PERFORM * FROM cypher('soul_graph', $$ CREATE (q:Quant {quant_id: $id}) $$) AS (v agtype) USING e.a;
    END IF;
    SELECT c FROM cypher('soul_graph', $$ MATCH (q:Quant {quant_id: $id}) RETURN count(q) $$)
      AS (c BIGINT) INTO cnt USING e.b;
    IF COALESCE(cnt,0) = 0 THEN
      PERFORM * FROM cypher('soul_graph', $$ CREATE (q:Quant {quant_id: $id}) $$) AS (v agtype) USING e.b;
    END IF;

    -- check edge exists
    SELECT c FROM cypher('soul_graph', $$
      MATCH (a:Quant {quant_id: $qa})-[r:RELATED {relation_type: $rt}]->(b:Quant {quant_id: $qb})
      RETURN count(r)
    $$) AS (c BIGINT) INTO cnt USING e.a, e.rt, e.b;

    IF COALESCE(cnt,0) = 0 THEN
      PERFORM * FROM cypher('soul_graph', $$
        MATCH (a:Quant {quant_id: $qa}), (b:Quant {quant_id: $qb})
        CREATE (a)-[r:RELATED {relation_type: $rt, keyword_overlap: $ko}]->(b)
      $$) AS (r agtype) USING e.a, e.b, e.rt, e.ko;
    END IF;
  END LOOP;
END $$;

-- Counts
SELECT * FROM cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$) AS (c BIGINT);
SELECT * FROM cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$) AS (c BIGINT);


