$ErrorActionPreference = "Stop"
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpeg) { $ffmpeg = 'C:\\ffmpeg\\bin\\ffmpeg.exe' }
$sp = New-Object -ComObject SAPI.SpVoice
$voices = @($sp.GetVoices())
$male = ($voices | Where-Object { $_.GetDescription() -match 'Aleksandr|Александр' } | Select-Object -First 1)
if (-not $male) { $male = $voices | Select-Object -First 1 }
$female = ($voices | Where-Object { $_.GetDescription() -match 'Irina|Ирина|Zira' } | Select-Object -First 1)
if (-not $female) { $female = $voices | Select-Object -First 1 }
$dirs = Get-ChildItem -Directory 'Soul\\voices' | Where-Object { $_.Name -ne 'voice_variants' -and $_.Name -ne 'Архив' }
$text = 'Всем привет. Это тест озвучивания. Мы выбираем лучший голос для персонажа.'
foreach ($d in $dirs) {
  $isMale = ($d.Name -match 'Architect|SoulPulse|Soul_Core|Zhvan')
  $voice = if ($isMale) { $male } else { $female }
  $outDir = $d.FullName
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  $tmp = [IO.Path]::GetTempFileName().Replace('.tmp','.wav')
  $stream = New-Object -ComObject SAPI.SpFileStream
  $fmt = New-Object -ComObject SAPI.SpAudioFormat
  $fmt.Type = 22
  $stream.Format = $fmt
  $stream.Open($tmp,3,$false)
  $sp.Voice = $voice
  $sp.AudioOutputStream = $stream
  [void]$sp.Speak($text)
  $stream.Close()
  Copy-Item $tmp (Join-Path $outDir '01_base_sapi.wav') -Force
  & $ffmpeg -y -i $tmp -af "asetrate=48000*0.94,aresample=48000,atempo=1.064" (Join-Path $outDir '02_low_pitch.wav') | Out-Null
  & $ffmpeg -y -i $tmp -af "asetrate=48000*1.06,aresample=48000,atempo=0.943" (Join-Path $outDir '03_high_pitch.wav') | Out-Null
  & $ffmpeg -y -i $tmp -af "bass=g=6,treble=g=-2" (Join-Path $outDir '04_warm_bass.wav') | Out-Null
  & $ffmpeg -y -i $tmp -af "treble=g=6,bass=g=-2" (Join-Path $outDir '05_airy_top.wav') | Out-Null
  Remove-Item $tmp -Force
  Write-Output $d.Name
}