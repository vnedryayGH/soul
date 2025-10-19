\set ON_ERROR_STOP on
\timing on

\echo 'Importing llm_prompts (if present)'
\copy llm_prompts(key, title, content, category, is_system) FROM '/root/llm_prompts.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\echo 'Upserting llm_prompts'
INSERT INTO llm_prompts (key, title, content, category, is_system, created_at, updated_at)
SELECT key, title, content, category, (is_system IN ('t','true','1')), NOW(), NOW()
FROM (
  SELECT * FROM llm_prompts
) s
ON CONFLICT (key)
DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  is_system = EXCLUDED.is_system,
  updated_at = NOW();

\echo 'Importing prompts (if present)'
\copy prompts(key, locale, group_key, name, description, category, content_json) FROM '/root/prompts.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\echo 'Upserting prompts'
INSERT INTO prompts (key, locale, group_key, name, description, category, content_json)
SELECT key, locale, NULLIF(group_key,''), NULLIF(name,''), NULLIF(description,''), NULLIF(category,''), content_json::jsonb FROM prompts
ON CONFLICT (key, locale)
DO UPDATE SET
  group_key = EXCLUDED.group_key,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  content_json = EXCLUDED.content_json;

\echo 'Importing soul_settings'
\copy soul_settings(key, value, description, category, data_type, is_configurable) FROM '/root/soul_settings.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
\echo 'Upserting soul_settings'
INSERT INTO soul_settings (key, value, description, category, data_type, is_configurable, created_at, updated_at)
SELECT key, value, description, category, data_type, (is_configurable IN ('t','true','1')), NOW(), NOW() FROM soul_settings
ON CONFLICT (key)
DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  data_type = EXCLUDED.data_type,
  is_configurable = EXCLUDED.is_configurable,
  updated_at = NOW();
