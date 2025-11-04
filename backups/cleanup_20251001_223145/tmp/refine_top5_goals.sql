-- Refine top-5 goals per cascade: deadlines and tags
WITH ranked AS (
  SELECT id,
         title,
         CASE
           WHEN title ILIKE 'Security:%' THEN 'security'
           WHEN title ILIKE 'World:%'    THEN 'world'
           WHEN title ILIKE 'Self:%'     THEN 'self'
           ELSE 'other'
         END AS grp,
         priority,
         ROW_NUMBER() OVER (
           PARTITION BY CASE
                          WHEN title ILIKE 'Security:%' THEN 'security'
                          WHEN title ILIKE 'World:%'    THEN 'world'
                          WHEN title ILIKE 'Self:%'     THEN 'self'
                          ELSE 'other'
                        END
           ORDER BY priority DESC, created_at DESC
         ) AS rn
  FROM public.quantum_goals
  WHERE source='task'
)
UPDATE public.quantum_goals g
   SET deadline_at = CASE r.grp
                       WHEN 'security' THEN NOW() + INTERVAL '2 days'
                       WHEN 'world'    THEN NOW() + INTERVAL '4 days'
                       WHEN 'self'     THEN NOW() + INTERVAL '6 days'
                       ELSE g.deadline_at
                     END,
       tags = COALESCE(g.tags, ARRAY[]::text[]) || CASE r.grp
                       WHEN 'security' THEN ARRAY['focus:security','phase:learn']
                       WHEN 'world'    THEN ARRAY['focus:world','phase:learn']
                       WHEN 'self'     THEN ARRAY['focus:self','phase:learn']
                       ELSE ARRAY[]::text[]
                     END,
       updated_at = NOW()
FROM ranked r
WHERE g.id = r.id AND r.rn <= 5;

-- Output quick check
SELECT grp, COUNT(*) FROM (
  SELECT CASE
           WHEN title ILIKE 'Security:%' THEN 'security'
           WHEN title ILIKE 'World:%'    THEN 'world'
           WHEN title ILIKE 'Self:%'     THEN 'self'
           ELSE 'other'
         END AS grp
  FROM public.quantum_goals
) s
GROUP BY grp
ORDER BY grp;

