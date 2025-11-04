-- Ensure audit table schema matches backend expectations
CREATE TABLE IF NOT EXISTS public.soul_audit_log (
    id bigserial PRIMARY KEY,
    "timestamp" timestamptz NOT NULL DEFAULT now(),
    event_type text,
    description text,
    meta jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE IF EXISTS public.soul_audit_log
    ADD COLUMN IF NOT EXISTS "timestamp" timestamptz NOT NULL DEFAULT now();
ALTER TABLE IF EXISTS public.soul_audit_log
    ADD COLUMN IF NOT EXISTS event_type text;
ALTER TABLE IF EXISTS public.soul_audit_log
    ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE IF EXISTS public.soul_audit_log
    ADD COLUMN IF NOT EXISTS meta jsonb DEFAULT '{}'::jsonb;

