DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'desired_action_type'
      AND e.enumlabel = 'goal_link'
  ) THEN
    ALTER TYPE desired_action_type ADD VALUE 'goal_link';
  END IF;
END $$;


