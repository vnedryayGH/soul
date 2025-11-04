#!/usr/bin/env bash
set -euo pipefail

DB=miniapp_db

has_table() {
  sudo -u postgres psql -d "$DB" -tAc "SELECT to_regclass('public.$1') IS NOT NULL" | grep -qx t
}

# Import llm_prompts
if has_table llm_prompts && [ -f /tmp/llm_prompts.csv ]; then
  sudo -u postgres psql -d "$DB" -v ON_ERROR_STOP=1 <<'SQL'
CREATE TEMP TABLE IF NOT EXISTS __llm_prompts_staging (
  key text, title text, content text, category text, is_system text
);
TRUNCATE __llm_prompts_staging;
\copy __llm_prompts_staging(key, title, content, category, is_system) FROM '/tmp/llm_prompts.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
INSERT INTO llm_prompts (key, title, content, category, is_system, created_at, updated_at)
SELECT key, title, content, category,
       CASE WHEN lower(coalesce(is_system,'')) IN ('t','true','1') THEN true ELSE false END,
       NOW(), NOW()
FROM __llm_prompts_staging s
ON CONFLICT (key)
DO UPDATE SET title=EXCLUDED.title,
              content=EXCLUDED.content,
              category=EXCLUDED.category,
              is_system=EXCLUDED.is_system,
              updated_at=NOW();
SQL
fi

# Import prompts (disabled to avoid NOT NULL constraint on file_path). Use reset_prompts_cli.py if needed.
:

# Import soul_settings
if has_table soul_settings && [ -f /tmp/soul_settings.csv ]; then
  sudo -u postgres psql -d "$DB" -v ON_ERROR_STOP=1 <<'SQL'
CREATE TEMP TABLE IF NOT EXISTS __soul_settings_staging (
  key text, value text, description text, category text, data_type text, is_configurable text
);
TRUNCATE __soul_settings_staging;
\copy __soul_settings_staging(key, value, description, category, data_type, is_configurable) FROM '/tmp/soul_settings.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
INSERT INTO soul_settings (key, value, description, category, data_type, is_configurable, created_at, updated_at)
SELECT key,
       value,
       description,
       category,
       COALESCE(NULLIF(data_type,''),'string'),
       CASE WHEN lower(coalesce(is_configurable,'')) IN ('t','true','1') THEN true ELSE false END,
       NOW(), NOW()
FROM __soul_settings_staging s
ON CONFLICT (key)
DO UPDATE SET value=EXCLUDED.value,
              description=EXCLUDED.description,
              category=EXCLUDED.category,
              data_type=EXCLUDED.data_type,
              is_configurable=EXCLUDED.is_configurable,
              updated_at=NOW();
SQL
fi

# Counts
sudo -u postgres psql -d "$DB" -tAc "SELECT 'llm_prompts', count(*) FROM llm_prompts" 2>/dev/null || true
sudo -u postgres psql -d "$DB" -tAc "SELECT 'prompts', count(*) FROM prompts" 2>/dev/null || true
sudo -u postgres psql -d "$DB" -tAc "SELECT 'soul_settings', count(*) FROM soul_settings" 2>/dev/null || true
