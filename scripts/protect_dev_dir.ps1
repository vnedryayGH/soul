Param(
    [string]$Path = (Resolve-Path ".").Path
)

$ErrorActionPreference = 'Stop'

Write-Host "[protect] Target path: $Path"

if (!(Test-Path -LiteralPath $Path)) {
    Write-Error "Path not found: $Path"
    exit 1
}

if (!(Test-Path -LiteralPath "tmp")) {
    New-Item -ItemType Directory -Path "tmp" | Out-Null
}

# 1) Backup ACLs (recursive)
Write-Host "[protect] Backing up ACLs to tmp/acl_backup.txt"
icacls "$Path" /save "tmp/acl_backup.txt" /t /c | Out-Null

# 2) Apply Deny Delete + DeleteSubdirectoriesAndFiles for Users and Authenticated Users (recursive)
Write-Host "[protect] Applying Deny (Delete,DeleteChild) for Users and Authenticated Users (recursive)"
& icacls "$Path" /deny 'Users:(OI)(CI)(D,DC)' 'Authenticated Users:(OI)(CI)(D,DC)' /t /c | Out-Null

# 3) Whitelist .git to avoid breaking Git operations
$gitPath = Join-Path $Path ".git"
if (Test-Path -LiteralPath $gitPath) {
    Write-Host "[protect] Whitelisting .git folder (remove Deny; grant Modify)"
    & icacls "$gitPath" /inheritance:e /remove:d Users 'Authenticated Users' /t /c | Out-Null
    & icacls "$gitPath" /grant:r 'Users:(OI)(CI)M' 'Authenticated Users:(OI)(CI)M' /t /c | Out-Null
}

Write-Host "[protect] Done. Current top-level ACL summary:"
icacls "$Path" | Out-String | Write-Host

Write-Host "[protect] If needed, restore with: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/unprotect_dev_dir.ps1"

