$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$API = 'https://mini.soulpulse.art/api'
$H = @{ 'X-Telegram-User-ID' = '468326902' }

function Invoke-Hyperloop([string]$Commands) {
  $B = @{ commands = $Commands } | ConvertTo-Json -Compress
  return (Invoke-RestMethod -Uri "$API/hyperloop/execute" -Headers $H -Method Post -ContentType 'application/json' -Body $B)
}

# 1) Профиль + смок ядра с трассой
$cmds1 = @(
  'FLAGS.APPLY_PROFILE name=prod_safe'
  'CORE.PIPELINE.RUN input_text="health check" WITH TRACE'
) -join "`n"
$r1 = Invoke-Hyperloop -Commands $cmds1
$r1 | ConvertTo-Json -Depth 12 -Compress

# 2) Шаги трассы по trace_id
$trace = $r1.trace_id
if ($trace) {
  $cmds2 = ("TRACE.STEPS trace_id=\"$trace\"")
  $r2 = Invoke-Hyperloop -Commands $cmds2
  $r2 | ConvertTo-Json -Depth 12 -Compress
}

# 3) Инспекторы
$r3 = Invoke-Hyperloop -Commands 'INSPECTOR.RUN_ALL'
$r3 | ConvertTo-Json -Depth 12 -Compress

# 4) Статус миграций
$r4 = Invoke-Hyperloop -Commands 'MIGRATIONS.STATUS'
$r4 | ConvertTo-Json -Depth 12 -Compress

# 5) Проверка деплоя/таблиц
$r5 = Invoke-Hyperloop -Commands 'DEPLOY.CHECK'
$r5 | ConvertTo-Json -Depth 12 -Compress

# 6) Язык настроек / GPU / макросы
$r6 = Invoke-Hyperloop -Commands 'LANG.GET key=lang.ui.default'
$r6 | ConvertTo-Json -Depth 12 -Compress

$r7 = Invoke-Hyperloop -Commands 'GPU.STATUS'
$r7 | ConvertTo-Json -Depth 12 -Compress

$r8 = Invoke-Hyperloop -Commands 'MACRO.LIST'
$r8 | ConvertTo-Json -Depth 12 -Compress


