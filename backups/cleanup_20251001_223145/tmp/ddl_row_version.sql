-- Add missing row_version columns if absent
ALTER TABLE IF EXISTS public.activities ADD COLUMN IF NOT EXISTS row_version bigint;
ALTER TABLE IF EXISTS public.sensation_settings ADD COLUMN IF NOT EXISTS row_version bigint;

