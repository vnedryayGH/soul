WITH qs AS (
  SELECT id::uuid AS id, COALESCE(tags::text[], ARRAY[]::text[]) AS tags
  FROM quants
),
valid AS (
  SELECT id, ARRAY(SELECT DISTINCT t FROM unnest(tags) t) AS tags
  FROM qs
),
pairs AS (
  SELECT a.id AS from_id, b.id AS to_id,
    (
      SELECT COUNT(*) FROM (
        SELECT DISTINCT x FROM unnest(a.tags) x
      ) ua INNER JOIN (
        SELECT DISTINCT y FROM unnest(b.tags) y
      ) ub ON ua.x = ub.y
    ) AS inter,
    (
      SELECT COUNT(*) FROM (
        SELECT DISTINCT x FROM unnest(a.tags) x
        UNION
        SELECT DISTINCT y FROM unnest(b.tags) y
      ) u
    ) AS uni
  FROM valid a
  JOIN valid b ON a.id <> b.id
)
INSERT INTO quant_connections (from_quant_id, to_quant_id, connection_type, connection_strength, keyword_overlap, last_used_at)
SELECT from_id, to_id, 'semantic', GREATEST(0.0, LEAST(1.0, inter::float/NULLIF(uni,0))), inter::float/NULLIF(uni,0), NOW()
FROM pairs
WHERE uni > 0 AND inter > 0 AND inter::float/uni >= 0.3
ON CONFLICT (from_quant_id, to_quant_id, connection_type)
DO UPDATE SET connection_strength = GREATEST(EXCLUDED.connection_strength, quant_connections.connection_strength),
              keyword_overlap = GREATEST(EXCLUDED.keyword_overlap, quant_connections.keyword_overlap),
              last_used_at = NOW();
