insert into feature_inspectors(key,module,callable,scope,enabled,config)
values ('dev_access.health','backend.app.feature_plugins.dev_access_health','run','dev_access', true, '{}'::jsonb)
on conflict (key) do update
  set module=EXCLUDED.module,
      callable=EXCLUDED.callable,
      scope=EXCLUDED.scope,
      enabled=true;


