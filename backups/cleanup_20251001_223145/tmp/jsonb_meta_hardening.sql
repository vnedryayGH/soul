DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='soul_audit_log' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE soul_audit_log
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE soul_audit_log
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_soul_audit_log_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_soul_audit_log_meta_gin ON soul_audit_log USING gin (meta)';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='signature_steps' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE signature_steps
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE signature_steps
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_signature_steps_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_signature_steps_meta_gin ON signature_steps USING gin (meta)';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='frontman_issues' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE frontman_issues
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE frontman_issues
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_frontman_issues_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_frontman_issues_meta_gin ON frontman_issues USING gin (meta)';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='backman_issues' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE backman_issues
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE backman_issues
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_backman_issues_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_backman_issues_meta_gin ON backman_issues USING gin (meta)';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='skill_assets' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE skill_assets
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE skill_assets
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_skill_assets_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_skill_assets_meta_gin ON skill_assets USING gin (meta)';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='user_skills' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE user_skills
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE user_skills
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_user_skills_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_user_skills_meta_gin ON user_skills USING gin (meta)';
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='skill_practice' AND column_name='meta'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE skill_practice
                     ALTER COLUMN meta TYPE jsonb USING (
                        CASE
                            WHEN meta IS NULL THEN ''{}''::jsonb
                            WHEN pg_typeof(meta)::text = ''json'' THEN to_jsonb(meta)
                            WHEN pg_typeof(meta)::text = ''jsonb'' THEN meta
                            WHEN pg_typeof(meta)::text = ''text'' THEN COALESCE(NULLIF(meta::text, '''')::jsonb, ''{}''::jsonb)
                            ELSE to_jsonb(meta)
                        END
                     ),
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        EXCEPTION WHEN others THEN
            EXECUTE 'ALTER TABLE skill_practice
                     ALTER COLUMN meta TYPE jsonb USING ''{}''::jsonb,
                     ALTER COLUMN meta SET DEFAULT ''{}''::jsonb';
        END;
        IF NOT EXISTS (
            SELECT 1 FROM pg_indexes WHERE schemaname=current_schema() AND indexname = 'idx_skill_practice_meta_gin'
        ) THEN
            EXECUTE 'CREATE INDEX idx_skill_practice_meta_gin ON skill_practice USING gin (meta)';
        END IF;
    END IF;
END $$;
