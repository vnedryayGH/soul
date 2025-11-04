-- Set priorities by perceived complexity for cascades: Security > World > Self
-- Base levels and slight boost for nearer deadlines inside each cascade

WITH upd AS (
  UPDATE public.quantum_goals g
     SET priority = LEAST(1.0,
       CASE
         WHEN g.title ILIKE 'Security:%' THEN 0.90
         WHEN g.title ILIKE 'World:%'    THEN 0.75
         WHEN g.title ILIKE 'Self:%'     THEN 0.65
         ELSE COALESCE(g.priority, 0.50)
       END
       + CASE
           WHEN g.deadline_at IS NOT NULL AND g.deadline_at <= NOW() + INTERVAL '24 hours' THEN 0.05
           WHEN g.deadline_at IS NOT NULL AND g.deadline_at <= NOW() + INTERVAL '4 hours'  THEN 0.10
           ELSE 0
         END
     ),
         updated_at = NOW()
   WHERE g.source = 'task' OR g.title ~* '^(Security|World|Self):'
   RETURNING 1
)
SELECT COUNT(*) AS updated FROM upd;

