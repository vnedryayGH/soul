$H = @{ 'X-Telegram-User-ID' = '468326902' }
Write-Host "[P62] Health/openapi/routes" -ForegroundColor Cyan
Invoke-RestMethod -Uri 'http://localhost:8000/api/health' -Headers $H -Method Get | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://localhost:8000/openapi.json' -Headers $H -Method Get | Out-Null
Invoke-RestMethod -Uri 'http://localhost:8000/api/routes' -Headers $H -Method Get | ConvertTo-Json -Compress

Write-Host "[P62] Personas/HR minimal" -ForegroundColor Cyan
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/personas' -Headers $H -Method Get | ConvertTo-Json -Compress
$posBody = @{ name = 'Accountant L2' } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/hr/positions' -Headers $H -Method Post -ContentType 'application/json' -Body $posBody | ConvertTo-Json -Compress
$tsBody = @{ persona_id = '00000000-0000-0000-0000-000000000001'; period = @{ from = '2025-11-01T08:00:00Z'; to = '2025-11-01T18:00:00Z' }; hours = 8.0 } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/timesheet/record' -Headers $H -Method Post -ContentType 'application/json' -Body $tsBody | ConvertTo-Json -Compress

Write-Host "[P62] Finance reports" -ForegroundColor Cyan
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/external/reports?contract_id=00000000-0000-0000-0000-000000000002&from=2025-11-01&to=2025-11-30' -Headers $H -Method Get | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/hr/payroll/report?from=2025-11-01&to=2025-11-30' -Headers $H -Method Get | ConvertTo-Json -Compress

Write-Host "[P62] Done" -ForegroundColor Green

