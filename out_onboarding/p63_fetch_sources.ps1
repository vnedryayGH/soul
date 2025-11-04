Param(
    [Parameter(Mandatory=$true)][string]$Project = "demo_project",
    [Parameter(Mandatory=$false)][string]$Workdir = "."
)

$ErrorActionPreference = "Stop"

# Чтение ответа онбординга (registry/onboarding_response.json), сформированного dev_onboarding_client.py
$respPath = Join-Path -Path $Workdir -ChildPath "registry/onboarding_response.json"
if (-not (Test-Path -Path $respPath)) {
    Write-Host "onboarding_response.json not found. Run dev_onboarding_client.py first."
    exit 2
}

$json = Get-Content -Raw -Path $respPath | ConvertFrom-Json
$app2 = $json.app2
$paths = $json.app_paths
if (-not $app2 -or -not $paths) {
    Write-Host "invalid onboarding_response.json: missing app2/app_paths"
    exit 2
}

$host = "$($app2.host)"
$user = "$($app2.ssh_user)"
$projectsRoot = "$($paths.projects_root)"

$dest = Join-Path -Path $Workdir -ChildPath "external"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Безопасные папки: soul/doc проекта
$dirs = @(
    "$Project/soul",
    "$Project/doc"
)

foreach ($d in $dirs) {
    $remote = "$projectsRoot/$d"
    $cmd = "scp -r $user@$host:`"$remote`" `"$dest`""
    Write-Host $cmd
    # Выполняем копирование
    & powershell -NoProfile -Command $cmd
}

Write-Host "Done."


