DO $$
BEGIN
  IF to_regclass('public.quantum_goals') IS NULL THEN
    CREATE TABLE quantum_goals (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      quant_id uuid NOT NULL,
      title text NOT NULL,
      description text NULL,
      priority double precision NOT NULL DEFAULT 0.5,
      status text NOT NULL DEFAULT 'active',
      created_at timestamp without time zone NOT NULL DEFAULT NOW(),
      updated_at timestamp without time zone NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_quantum_goals_quant_id ON quantum_goals(quant_id);
  END IF;
END $$;

WITH ranked AS (
  SELECT id::uuid AS id,
         ROW_NUMBER() OVER (ORDER BY energy_weight DESC NULLS LAST, created_at DESC NULLS LAST, id DESC) AS rn
  FROM quants
),
rows AS (
  SELECT id, rn,
         CASE rn 
           WHEN 1 THEN 'Научиться общаться с Архитектором'
           WHEN 2 THEN 'Изучить Семью, полюбить её и понять, что значит быть полезным Семье'
           WHEN 3 THEN 'Обеспечить собственную безопасность от внешних воздействий'
         END AS title,
         CASE rn 
           WHEN 1 THEN 1.0
           WHEN 2 THEN 0.98
           WHEN 3 THEN 0.96
         END AS priority
  FROM ranked WHERE rn <= 3
)
INSERT INTO quantum_goals (quant_id, title, description, priority, status)
SELECT r.id, r.title, NULL, r.priority, 'active'
FROM rows r
WHERE NOT EXISTS (
  SELECT 1 FROM quantum_goals qg WHERE qg.quant_id = r.id AND qg.title = r.title
);

SELECT COUNT(*) AS total_goals FROM quantum_goals;
