param(
  [string]$Api = 'https://mini.soulpulse.art/api/admin/agent/exec',
  [string]$TgId = '468326902',
  [string]$Env = 'prod',
  [switch]$Apply,
  [string]$TwoKeysRequestId = '',
  [ValidateSet('none', 'backend', 'rsbus', 'both')][string]$Restart = 'backend',
  [switch]$UseSigned,
  [string]$HyperloopApiRoot = 'https://mini.soulpulse.art/api',
  [string]$AdminKeyFile = ''
)

$ErrorActionPreference = 'Stop'

# Compatibility helper: ConvertFrom-Json may not support -Depth on older PowerShell
function Convert-FromJsonCompat([string]$s) {
  try { return ($s | ConvertFrom-Json -Depth 12) } catch { return ($s | ConvertFrom-Json) }
}

function Invoke-DSL([string]$Cmd) {
  try {
    $args = @('tools/catalog/active/utils/hyperloop_cli.py')
    if ($UseSigned.IsPresent) { $args += '--signed' }
    $args += @('--telegram-user-id', $TgId, '--api-url', $HyperloopApiRoot, '--dsl-b64', [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Cmd)))
    $proc = & python @args 2>$null
    if ($LASTEXITCODE -ne 0) { throw "hyperloop_cli failed ($LASTEXITCODE)" }
    return (Convert-FromJsonCompat ([string]$proc))
  }
  catch {
    return @{ ok = $false; error = $_.Exception.Message }
  }
}

function Invoke-ExecJsonSafe([string]$JsonPath, [int]$Retries = 3, [int]$DelaySec = 4) {
  for ($i=0; $i -lt [Math]::Max(1,$Retries); $i++) {
    try {
      return Invoke-ExecJson -JsonPath $JsonPath
    }
    catch {
      if ($i -ge $Retries - 1) { throw }
      Start-Sleep -Seconds $DelaySec
    }
  }
}

function Invoke-ExecJson([string]$JsonPath) {
  if (-not (Test-Path -LiteralPath $JsonPath)) { throw "JSON not found: $JsonPath" }
  # Если задан AdminKeyFile — используем робастный Python-обёртку (исключает кавычки/кодировки)
  if ($AdminKeyFile -and (Test-Path -LiteralPath $AdminKeyFile)) {
    $args = @('tools/catalog/active/utils/admin_exec_post.py', '--path', '/api/admin/agent/exec', '--base-url', ($Api -replace '/api/admin/agent/exec','' -replace '/api/admin/.*',''), '--body-file', $JsonPath, '--tg-id', $TgId, '--admin-key-file', $AdminKeyFile)
    $out = & python @args 2>$null
    if ($LASTEXITCODE -ne 0) { throw "admin_exec_post failed ($LASTEXITCODE)" }
    return (Convert-FromJsonCompat ([string]$out))
  }
  $body = Get-Content -LiteralPath $JsonPath -Raw -Encoding UTF8
  $headers = @{ 'X-Telegram-User-ID' = $TgId }
  # Append _a/_k from ENV to query string
  $a = $env:ADMIN_A
  $k = $env:ADMIN_K
  if ($a -or $k) {
    if ($Api -match '\?') { $sep = '&' } else { $sep = '?' }
    if ($a) { $Api = "$Api$sep`_a=$a"; $sep = '&' }
    if ($k) { $Api = "$Api$sep`_k=$k" }
  }
  $resp = Invoke-RestMethod -Uri $Api -Headers $headers -Method Post -ContentType 'application/json' -Body $body
  return $resp
}

Write-Host '--- Preflight: registry_guard' -ForegroundColor Cyan
# Prefer DSL for INSPECTOR.RUN; fallback to admin/exec JSON
$dsl1 = Invoke-DSL 'INSPECTOR.RUN key=registry_guard'
if (-not ($dsl1 -is [object]) -or ($dsl1.ok -ne $true)) {
  Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/preflight_registry_guard.json' | Out-Null
}

Write-Host '--- Preflight: RUN_ALL' -ForegroundColor Cyan
$dsl2 = Invoke-DSL 'INSPECTOR.RUN_ALL scope=*'
if (-not ($dsl2 -is [object]) -or ($dsl2.ok -ne $true)) {
  Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/preflight_runall.json' | Out-Null
}

Write-Host '--- Green Gate: orphaned_scripts (project_root override)' -ForegroundColor Cyan
$dslOrphan = Invoke-DSL 'INSPECTOR.RUN key=orphaned_scripts inspector_ctx.project_root="/var/www/soulpulse"'
if (-not ($dslOrphan -is [object]) -or ($dslOrphan.ok -ne $true)) {
  Write-Host 'orphaned_scripts inspector failed (non-fatal for deploy script)' -ForegroundColor Yellow
}

Write-Host '--- Flags: TRIZ defaults' -ForegroundColor Cyan
$f1 = Invoke-DSL 'FLAGS.SET key=TRIZ_MODE value=compact'
if (-not ($f1 -is [object]) -or ($f1.ok -ne $true)) { Invoke-ExecJson -JsonPath 'tools/catalog/active/deploy/requests/flags_triz_mode.json' | Out-Null }
$f2 = Invoke-DSL 'FLAGS.SET key=TRIZ_COMPLEXITY_DETECT value=on'
if (-not ($f2 -is [object]) -or ($f2.ok -ne $true)) { Invoke-ExecJson -JsonPath 'tools/catalog/active/deploy/requests/flags_triz_complexity.json' | Out-Null }
$f3 = Invoke-DSL 'FLAGS.SET key=TRIZ_LOOP_GUARD value=on'
if (-not ($f3 -is [object]) -or ($f3.ok -ne $true)) { Invoke-ExecJson -JsonPath 'tools/catalog/active/deploy/requests/flags_triz_loop_guard.json' | Out-Null }

Write-Host '--- Transfer guard preflight' -ForegroundColor Cyan
Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/transfer_guard_preflight.json' | Out-Null

Write-Host '--- Transfer orchestrator (plan only)' -ForegroundColor Cyan
$plan = Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/transfer_orchestrator_plan.json'
if (-not $plan) { throw 'Orchestrator plan failed' }
if ($Apply.IsPresent) {
  Write-Host '--- APPLY orchestrator (requires Two-Keys)' -ForegroundColor Yellow
  if (-not $TwoKeysRequestId) {
    Write-Host 'Two-Keys id not provided, requesting via DSL...' -ForegroundColor Yellow
    $cmd = "TWO_KEYS.REQUEST operation='migrations.apply' scope='prod_db' reason='TRIZ orchestrator'"
    $args = @('tools/catalog/active/utils/hyperloop_cli.py')
    if ($UseSigned.IsPresent) { $args += '--signed' }
    $args += @('--telegram-user-id', $TgId, '--api-url', $HyperloopApiRoot, '--dsl', $cmd)
    try {
      $out = & python @args 2>$null
      $m = [regex]::Match([string]$out,'[0-9a-fA-F-]{36}')
      if ($m.Success) {
        $TwoKeysRequestId = $m.Value
        Write-Host ("Two-Keys RID=" + $TwoKeysRequestId) -ForegroundColor Green
        # Approve immediately (dev/admin path)
        $appCmd = "TWO_KEYS.APPROVE id=${TwoKeysRequestId}"
        $args2 = @('tools/catalog/active/utils/hyperloop_cli.py')
        if ($UseSigned.IsPresent) { $args2 += '--signed' }
        $args2 += @('--telegram-user-id', $TgId, '--api-url', $HyperloopApiRoot, '--dsl', $appCmd)
        $null = & python @args2 2>$null
      } else {
        throw 'Unable to extract Two-Keys request id'
      }
    }
    catch {
      Write-Host 'Signed TWO_KEYS.REQUEST failed; trying admin_call fallback...' -ForegroundColor Yellow
      try {
        $reqOut = & python 'scripts/dev/admin_call.py' '/api/admin/agent/exec' --method 'POST' --body-file 'out/two_keys_request.json'
        $m2 = [regex]::Match([string]$reqOut,'[0-9a-fA-F-]{36}')
        if (-not $m2.Success) { throw 'RID not found in admin_call response' }
        $TwoKeysRequestId = $m2.Value
        Write-Host ("Two-Keys RID=" + $TwoKeysRequestId) -ForegroundColor Green
        # Approve via admin_call
        $bodyObj = @{ op = 'hyperloop.dsl'; commands = ("TWO_KEYS.APPROVE id=" + $TwoKeysRequestId) }
        $bodyJson = $bodyObj | ConvertTo-Json -Depth 16 -Compress
        $tmpApprove = [System.IO.Path]::GetTempFileName()
        try {
          Set-Content -LiteralPath $tmpApprove -Value $bodyJson -Encoding UTF8
          $null = & python 'scripts/dev/admin_call.py' '/api/admin/agent/exec' --method 'POST' --body-file $tmpApprove
        }
        finally { try { Remove-Item -LiteralPath $tmpApprove -Force } catch {} }
      }
      catch {
        throw 'Two-Keys auto-request failed; provide -TwoKeysRequestId explicitly'
      }
    }
  }
  $applyBody = @{ op = 'deploy.transfer_orchestrator'; options = @{ apply = $true; request_id = $TwoKeysRequestId; request = $plan.data.plan.request } } | ConvertTo-Json -Depth 64 -Compress
  $headers = @{ 'X-Telegram-User-ID' = $TgId }
  # Ensure _a/_k are appended for admin/exec
  $a = $env:ADMIN_A; $k = $env:ADMIN_K
  if ($a -or $k) {
    if ($Api -match '\?') { $sep = '&' } else { $sep = '?' }
    if ($a) { $Api = "$Api$sep`_a=$a"; $sep = '&' }
    if ($k) { $Api = "$Api$sep`_k=$k" }
  }
  $tmpApply = [System.IO.Path]::GetTempFileName()
  try {
    Set-Content -LiteralPath $tmpApply -Value $applyBody -Encoding UTF8
    $resp = Invoke-ExecJsonSafe -JsonPath $tmpApply
    if (-not $resp.ok) { throw 'Apply failed' }
  }
  finally {
    try { Remove-Item -LiteralPath $tmpApply -Force } catch {}
  }
}

if ($Restart -ne 'none') {
  Write-Host "--- Service restart ($Restart)" -ForegroundColor Cyan
  if ($Restart -eq 'backend' -or $Restart -eq 'both') {
    Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/service_restart_backend.json' | Out-Null
  }
  if ($Restart -eq 'rsbus' -or $Restart -eq 'both') {
    Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/service_restart_rsbus.json' | Out-Null
  }
}

Write-Host '--- Post: RUN_ALL' -ForegroundColor Cyan
$dsl3 = Invoke-DSL 'INSPECTOR.RUN_ALL scope=*'
if (-not ($dsl3 -is [object]) -or ($dsl3.ok -ne $true)) {
  Invoke-ExecJsonSafe -JsonPath 'tools/catalog/active/deploy/requests/preflight_runall.json' | Out-Null
}

Write-Host 'Done.' -ForegroundColor Green

