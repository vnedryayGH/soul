CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.rs_nightly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    window_days INTEGER NOT NULL DEFAULT 1,
    summary JSONB,
    diff_7d JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_rs_nightly_reports_generated_at ON public.rs_nightly_reports (generated_at DESC);

CREATE TABLE IF NOT EXISTS public.p44_pdp_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    decision TEXT NOT NULL,
    subject JSONB,
    scope JSONB,
    reason TEXT,
    headers JSONB
);
CREATE INDEX IF NOT EXISTS ix_p44_pdp_audit_decided_at ON public.p44_pdp_audit (decided_at DESC);
