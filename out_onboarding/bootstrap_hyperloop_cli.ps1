Param(
    [Parameter(Mandatory=$false)][string]$Branch = "p63-onboarding",
    [Parameter(Mandatory=$false)][string]$Dest = ".\hyperloop_cli"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path $Dest | Out-Null
$zip = Join-Path $Dest "hyperloop_cli.zip"
# URL должен быть установлен в БД и читаться на стороне сервера; здесь — только клиентский архиватор
$repo = "https://example.com/soul/hyperloop/$Branch.zip"

try {
    Invoke-WebRequest -Uri $repo -OutFile $zip -UseBasicParsing
} catch {
    Write-Host "Download failed: $($_.Exception.Message)"; exit 2
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $Dest)
Remove-Item $zip -Force

$cli = Get-ChildItem -Recurse -Path $Dest -Filter "hyperloop_cli.py" | Select-Object -First 1
if (-not $cli) { Write-Host "hyperloop_cli.py not found"; exit 2 }

Write-Host "CLI ready at: $($cli.FullName)"
