-- Make quantum_goals.quant_id nullable and add index for P26
ALTER TABLE IF EXISTS public.quantum_goals ALTER COLUMN quant_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS ux_qg_source_ext ON public.quantum_goals(source, external_id);
