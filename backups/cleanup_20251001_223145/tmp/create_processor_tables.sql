DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='processor_events'
    ) THEN
        CREATE TABLE processor_events (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            kind text NOT NULL,
            payload jsonb NOT NULL,
            dedup_key text,
            priority int DEFAULT 0,
            due_at timestamp without time zone,
            status text DEFAULT 'pending',
            retries int DEFAULT 0,
            created_at timestamp without time zone NOT NULL DEFAULT now()
        );
        CREATE INDEX ix_processor_events_status ON processor_events(status);
        CREATE INDEX ix_processor_events_due ON processor_events(due_at);
        CREATE INDEX ix_processor_events_kind ON processor_events(kind);
        CREATE INDEX ix_processor_events_payload ON processor_events USING gin(payload);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='processor_runs'
    ) THEN
        CREATE TABLE processor_runs (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            started_at timestamp without time zone NOT NULL DEFAULT now(),
            finished_at timestamp without time zone,
            status text,
            agenda_snapshot jsonb,
            metrics jsonb,
            created_by text
        );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='processor_incidents'
    ) THEN
        CREATE TABLE processor_incidents (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            run_id uuid REFERENCES processor_runs(id) ON DELETE SET NULL,
            event_id uuid REFERENCES processor_events(id) ON DELETE SET NULL,
            type text NOT NULL,
            detail text,
            created_at timestamp without time zone NOT NULL DEFAULT now()
        );
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='processor_policies'
    ) THEN
        CREATE TABLE processor_policies (
            id SERIAL PRIMARY KEY,
            key varchar(190) UNIQUE NOT NULL,
            value jsonb,
            updated_at timestamp without time zone NOT NULL DEFAULT now()
        );
    END IF;
END$$;
