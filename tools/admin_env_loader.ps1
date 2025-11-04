param(
  [string]$KeyFile = '',
  [switch]$Quiet
)

$ErrorActionPreference = 'Stop'

function Read-FileText([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  try {
    return Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  } catch {
    try { return Get-Content -LiteralPath $Path -Raw } catch { return $null }
  }
}

function Extract-AdminKeys([string]$Raw) {
  $a = $null; $k = $null
  if (-not $Raw) { return @($null,$null) }
  # Try JSON first
  try {
    $obj = $Raw | ConvertFrom-Json
    if ($obj) {
      if (-not $a -and $obj.ADMIN_A) { $a = [string]$obj.ADMIN_A }
      if (-not $a -and $obj.a) { $a = [string]$obj.a }
      if (-not $k -and $obj.ADMIN_K) { $k = [string]$obj.ADMIN_K }
      if (-not $k -and $obj.k) { $k = [string]$obj.k }
    }
  } catch {}
  # Fallback: regex for key=value patterns
  if (-not $a) {
    $m = [regex]::Match($Raw, '(?im)ADMIN_A\s*[:=]\s*([A-Za-z0-9_\-\+/=]{8,})')
    if ($m.Success) { $a = $m.Groups[1].Value }
  }
  if (-not $k) {
    $m = [regex]::Match($Raw, '(?im)ADMIN_K\s*[:=]\s*([A-Za-z0-9_\-\+/=]{8,})')
    if ($m.Success) { $k = $m.Groups[1].Value }
  }
  return @($a,$k)
}

function Mask([string]$s) {
  if (-not $s) { return '' }
  $n = $s.Length
  if ($n -le 6) { return ('*' * $n) }
  return ($s.Substring(0,3) + ('*' * [Math]::Max(0,$n-6)) + $s.Substring($n-3))
}

try {
  $candidates = @()
  if ($KeyFile) { $candidates += $KeyFile }
  $repoRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
  $defaultPem = Join-Path $repoRoot '.cursor/soulpulse-admin.2025-11-03.private-key.pem'
  if (-not $KeyFile) { $candidates += $defaultPem }

  $ADMIN_A = $env:ADMIN_A
  $ADMIN_K = $env:ADMIN_K

  foreach ($p in $candidates) {
    if ($ADMIN_A -and $ADMIN_K) { break }
    $raw = Read-FileText -Path $p
    if (-not $raw) { continue }
    $ak = Extract-AdminKeys -Raw $raw
    if (-not $ADMIN_A -and $ak[0]) { $ADMIN_A = [string]$ak[0] }
    if (-not $ADMIN_K -and $ak[1]) { $ADMIN_K = [string]$ak[1] }
  }

  if (-not $ADMIN_A -or -not $ADMIN_K) {
    if (-not $Quiet) { Write-Host 'ADMIN_A/ADMIN_K not resolved' -ForegroundColor Yellow }
    exit 2
  }

  # Export to current session (no echo of raw values)
  $env:ADMIN_A = $ADMIN_A
  $env:ADMIN_K = $ADMIN_K
  if (-not $Quiet) {
    Write-Host ('ADMIN_A=' + (Mask $ADMIN_A)) -ForegroundColor Green
    Write-Host ('ADMIN_K=' + (Mask $ADMIN_K)) -ForegroundColor Green
  }
  exit 0
} catch {
  if (-not $Quiet) { Write-Host ('admin_env_loader error: ' + $_.Exception.Message) -ForegroundColor Red }
  exit 1
}


