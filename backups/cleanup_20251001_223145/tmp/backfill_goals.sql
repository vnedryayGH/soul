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
    CREATE INDEX IF NOT EXISTS idx_quantum_goals_priority ON quantum_goals(priority);
    CREATE INDEX IF NOT EXISTS idx_quantum_goals_status ON quantum_goals(status);
  END IF;
END $$;

INSERT INTO quantum_goals (quant_id, title, description, priority, status)
SELECT
  qda.quant_id::uuid,
  COALESCE(qda.payload->>'subject', 'Goal'),
  qda.payload->>'body',
  COALESCE(NULLIF(qda.payload->>'priority','')::float, 0.5),
  'active'
FROM quant_desired_actions qda
WHERE qda.type = 'goal_link'
ON CONFLICT DO NOTHING;

SELECT COUNT(*) FROM quantum_goals;
