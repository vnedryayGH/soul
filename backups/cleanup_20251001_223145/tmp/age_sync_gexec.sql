LOAD 'age';
SET search_path=ag_catalog,public;
-- Сгенерировать по строке-оператору cypher для каждого ребра и выполнить через \gexec
SELECT format($F$
  SELECT * FROM ag_catalog.cypher('soul_graph', $$
    MERGE (qa:Quant {quant_id: '%s'})
    MERGE (qb:Quant {quant_id: '%s'})
    MERGE (qa)-[r:RELATED {relation_type: '%s'}]->(qb)
    SET r.keyword_overlap = %s
  $$) AS (r agtype);
$F$,
  from_quant_id::text,
  to_quant_id::text,
  COALESCE(connection_type::text,'semantic'),
  COALESCE(keyword_overlap,0.0)
) FROM quant_connections;
\gexec


