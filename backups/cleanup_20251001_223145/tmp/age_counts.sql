LOAD 'age';
SET search_path=ag_catalog,public;
SELECT * FROM ag_catalog.cypher('soul_graph', $$ MATCH (q:Quant) RETURN count(q) $$) AS (c ag_catalog.agtype);
SELECT * FROM ag_catalog.cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN count(r) $$) AS (c ag_catalog.agtype);
SELECT count(*) FROM quant_connections;

CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;
SELECT create_graph('soul_graph');
SELECT count(*) AS quant_nodes FROM cypher('soul_graph', $$ MATCH (q:Quant) RETURN q $$) AS (q agtype);
SELECT count(*) AS related_edges FROM cypher('soul_graph', $$ MATCH ()-[r:RELATED]->() RETURN r $$) AS (r agtype);
