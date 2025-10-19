ALTER TABLE events ADD COLUMN IF NOT EXISTS row_version timestamptz;
UPDATE events SET row_version = COALESCE(row_version, now());
