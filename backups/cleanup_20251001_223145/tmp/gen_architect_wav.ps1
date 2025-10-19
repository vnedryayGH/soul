$ErrorActionPreference = 'Stop'
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpeg) { $ffmpeg = 'C:\ffmpeg\bin\ffmpeg.exe' }
$voicesOut = New-Object System.Text.StringBuilder
$sp = New-Object -ComObject SAPI.SpVoice
$all = @($sp.GetVoices())
$all | ForEach-Object { [void]$voicesOut.AppendLine($_.GetDescription()) }
$descList = $voicesOut.ToString()
$target = $null
$patterns = @('Aleksandr','Александр','RHVoice.*Aleksandr','Pavel','Павел','Dmitry','Дмитрий')
foreach ($p in $patterns) { $m = $all | Where-Object { $_.GetDescription() -match $p } | Select-Object -First 1; if ($m) { $target = $m; break } }
if (-not $target) { $target = $all | Select-Object -First 1 }
$personaDir = Join-Path (Get-Location) 'Soul/voices/Architect_Soul'
New-Item -ItemType Directory -Force -Path $personaDir | Out-Null
$tmp = [IO.Path]::GetTempFileName().Replace('.tmp','.wav')
# synth base
$stream = New-Object -ComObject SAPI.SpFileStream
$fmt = New-Object -ComObject SAPI.SpAudioFormat
$fmt.Type = 22
$stream.Format = $fmt
$stream.Open($tmp, 3, $false)
$sp.Voice = $target
$sp.AudioOutputStream = $stream
$text = 'Всем привет. Это тест озвучивания. Мы выбираем лучший голос для персонажа.'
[void]$sp.Speak($text)
$stream.Close()
Copy-Item $tmp (Join-Path $personaDir '01_base_sapi.wav') -Force
# FX
& $ffmpeg -y -i $tmp -af "asetrate=48000*0.94,aresample=48000,atempo=1.064" (Join-Path $personaDir '02_low_pitch.wav') | Out-Null
& $ffmpeg -y -i $tmp -af "asetrate=48000*1.06,aresample=48000,atempo=0.943" (Join-Path $personaDir '03_high_pitch.wav') | Out-Null
& $ffmpeg -y -i $tmp -af "bass=g=6,treble=g=-2" (Join-Path $personaDir '04_warm_bass.wav') | Out-Null
& $ffmpeg -y -i $tmp -af "treble=g=6,bass=g=-2" (Join-Path $personaDir '05_airy_top.wav') | Out-Null
Remove-Item $tmp -Force
Get-ChildItem -Name $personaDir
"--- INSTALLED VOICES ---"
$descList