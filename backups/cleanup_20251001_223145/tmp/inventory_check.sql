-- Inventory checks: tables, matviews, and columns
-- Tables (public)
SELECT format('%s.%s', table_schema, table_name)
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'quantum_goals','skills','skill_steps','skill_links','skill_assets',
    'activity_schedules','activities','sensation_settings'
  )
ORDER BY 1;

-- Matviews
SELECT format('%s.%s', schemaname, matviewname)
FROM pg_matviews
WHERE matviewname IN ('energy_balance_mv','activity_effectiveness_mv')
ORDER BY 1;

-- Columns of quantum_goals
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'quantum_goals'
ORDER BY 1;

-- Columns of activity_schedules
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'activity_schedules'
ORDER BY 1;

-- Columns of activities
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'activities'
ORDER BY 1;

-- Columns of sensation_settings
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sensation_settings'
ORDER BY 1;

