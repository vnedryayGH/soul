# P62 — Hyperloop Smokes (CLI)

Быстрые проверки окружения, миграций, маршрутов и гейтов. Предполагается заголовок `X-Telegram-User-ID: 468326902` (CLI проставляет автоматически при обращении к mini.soulpulse.art).

## 1) Health / Routes / OpenAPI
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --http-get https://mini.soulpulse.art/api/health
python tools/catalog/active/utils/hyperloop_cli.py --http-get https://mini.soulpulse.art/api/routes
python tools/catalog/active/utils/hyperloop_cli.py --http-get https://mini.soulpulse.art/openapi.json
```

## 2) Inspectors (гейт‑смоки)
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=registry_guard"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=delivery_guard.smoke"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=db.alembic.heads_enforcer"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=db.health"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=diamond.pipeline.health"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "INSPECTOR.RUN key=guard.canonical.urls"
```

## 3) FLAGS (чекпойнты Roadmap)
```powershell
# Прочитать текущую фазу
python tools/catalog/active/utils/hyperloop_cli.py --dsl "FLAGS.GET key=state.p62.phase"

# Установить фазу (пример: переход к фазе 2)
python tools/catalog/active/utils/hyperloop_cli.py --dsl "FLAGS.SET key=state.p62.phase value=2"
```

## 4) REST smokes (локально, dev)
```powershell
$H=@{ 'X-Telegram-User-ID'='468326902' }
# Personas
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/personas' -Headers $H -Method Get | ConvertTo-Json -Compress
# HR: позиции (create)
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/hr/positions' -Headers $H -Method Post -ContentType 'application/json' -Body '{"name":"Accountant L2"}' | ConvertTo-Json -Compress
# HR: табель (record)
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/timesheet/record' -Headers $H -Method Post -ContentType 'application/json' -Body '{"persona_id":"00000000-0000-0000-0000-000000000001","period":{"from":"2025-11-01T08:00:00Z","to":"2025-11-01T18:00:00Z"},"hours":8.0}' | ConvertTo-Json -Compress
# Finance: отчёты
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/external/reports?contract_id=00000000-0000-0000-0000-000000000002&from=2025-11-01&to=2025-11-30' -Headers $H -Method Get | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/hr/payroll/report?from=2025-11-01&to=2025-11-30' -Headers $H -Method Get | ConvertTo-Json -Compress
```

## 5) WS feed (в браузерной консоли)
```javascript
const url = (location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/api/visualization/feed?topics=actor.state,processor.step,hr.timesheet.submitted';
const ws = new WebSocket(url);
ws.onmessage = (e)=> console.log('WS', e.data);
ws.onopen = ()=> console.log('WS open');
ws.onerror = (e)=> console.warn('WS err', e);
```

## 6) Acceptance завершение
```powershell
python tools/catalog/active/utils/hyperloop_cli.py --dsl "PROJECT.LOG.UPDATE_OP project_id=<PID> step_title='p62.acceptance' step_result='ok'"
python tools/catalog/active/utils/hyperloop_cli.py --dsl "FLAGS.SET key=state.p62.done value=true"
```
