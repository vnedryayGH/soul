Param(
    [string]$Path = (Resolve-Path ".").Path
)

$ErrorActionPreference = 'Stop'

Write-Host "[unprotect] Target path: $Path"

if (!(Test-Path -LiteralPath $Path)) {
    Write-Error "Path not found: $Path"
    exit 1
}

$backup = "tmp/acl_backup.txt"
if (!(Test-Path -LiteralPath $backup)) {
    Write-Error "ACL backup not found: $backup"
    exit 1
}

Write-Host "[unprotect] Restoring ACLs from $backup"
icacls "$Path" /restore "$backup" /t /c | Out-Null

Write-Host "[unprotect] Done. Current top-level ACL summary:"
icacls "$Path" | Out-String | Write-Host

