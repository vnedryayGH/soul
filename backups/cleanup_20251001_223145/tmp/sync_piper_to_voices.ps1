$ErrorActionPreference = "Stop"
# 1) Скачать архив с сервера
$dst = "Soul\voices\piper_personas_samples.tar.gz"
if (Test-Path $dst) { Remove-Item -Force $dst }
scp -i .\Arh\spbd_ed25519 -o StrictHostKeyChecking=accept-new root@217.12.38.238:/opt/piper_personas/piper_personas_samples.tar.gz $dst
# 2) Распаковать во временную папку
$tmp = "Soul\voices\_piper_sync"
if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
& tar -xzf $dst -C $tmp
# 3) Карта исходных  целевых персон
$map = @{
  'Soul' = 'Soul_Core'
  'Ved'  = 'Ved_prompt_Masterpiece_v4_3'
  'FR_Ranevskaya' = 'FR_Ranevskaya_Persona_v1_4'
}
$added = @()
foreach ($k in $map.Keys) {
  $srcDir = Join-Path $tmp $k
  if (-not (Test-Path $srcDir)) { continue }
  $destDir = Join-Path 'Soul\voices' $map[$k]
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  Get-ChildItem -File (Join-Path $srcDir '*.wav') | ForEach-Object {
    $name = 'piper_' + $_.Name
    $target = Join-Path $destDir $name
    Copy-Item -Force $_.FullName $target
    $added += $target
  }
}
$added | ForEach-Object { $_ }