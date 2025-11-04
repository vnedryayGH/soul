-- P26 source tables for calendar transport (idempotent)

-- Tasks source
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text,
  due_at timestamptz,
  labels jsonb DEFAULT '{}'::jsonb,
  status text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_tasks_created_at ON public.tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS ix_tasks_priority ON public.tasks(priority);

-- Events source
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  labels jsonb DEFAULT '{}'::jsonb,
  status text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_events_start_at ON public.events(start_at DESC);

