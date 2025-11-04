DO $$
BEGIN
  IF to_regclass('public.quant_connections') IS NULL THEN
    CREATE TABLE quant_connections (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      from_quant_id uuid NOT NULL,
      to_quant_id uuid NOT NULL,
      connection_type text NOT NULL DEFAULT 'semantic',
      connection_strength double precision NOT NULL DEFAULT 0,
      keyword_overlap double precision NULL,
      last_used_at timestamp without time zone NULL,
      created_at timestamp without time zone NOT NULL DEFAULT NOW()
    );
  END IF;

  BEGIN
    ALTER TABLE quant_connections ADD COLUMN IF NOT EXISTS connection_type text NOT NULL DEFAULT 'semantic';
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE quant_connections ADD COLUMN IF NOT EXISTS keyword_overlap double precision NULL;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE quant_connections ADD COLUMN IF NOT EXISTS last_used_at timestamp without time zone NULL;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE quant_connections ADD COLUMN IF NOT EXISTS connection_strength double precision NOT NULL DEFAULT 0;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE quant_connections ADD COLUMN IF NOT EXISTS created_at timestamp without time zone NOT NULL DEFAULT NOW();
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE quant_connections ALTER COLUMN from_quant_id TYPE uuid USING from_quant_id::uuid;
  EXCEPTION WHEN others THEN END;
  BEGIN
    ALTER TABLE quant_connections ALTER COLUMN to_quant_id TYPE uuid USING to_quant_id::uuid;
  EXCEPTION WHEN others THEN END;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='quant_connections_uq'
  ) THEN
    CREATE UNIQUE INDEX quant_connections_uq ON quant_connections (from_quant_id, to_quant_id, connection_type);
  END IF;
END $$;
