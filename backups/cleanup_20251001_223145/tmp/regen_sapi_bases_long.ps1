$ErrorActionPreference = "Stop"
# Resolve ffmpeg/ffprobe
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source; if (-not $ffmpeg) { $ffmpeg = 'C:\\ffmpeg\\bin\\ffmpeg.exe' }
$ffprobe = (Get-Command ffprobe -ErrorAction SilentlyContinue).Source; if (-not $ffprobe) { $ffprobe = 'C:\\ffmpeg\\bin\\ffprobe.exe' }
# Resolve SAPI voices
$sp = New-Object -ComObject SAPI.SpVoice
$voices = @($sp.GetVoices())
$male = ($voices | Where-Object { $_.GetDescription() -match 'Aleksandr|Александр' } | Select-Object -First 1); if (-not $male) { $male = $voices | Select-Object -First 1 }
$female = ($voices | Where-Object { $_.GetDescription() -match 'Irina|Ирина|Zira' } | Select-Object -First 1); if (-not $female) { $female = $voices | Select-Object -First 1 }
function New-LongText([string]$base,[int]$repeat){
  $sb = New-Object System.Text.StringBuilder
  for($i=0;$i -lt $repeat;$i++){ [void]$sb.Append($base).Append(' ') }
  return $sb.ToString()
}
function Write-SapiWave([object]$voice,[string]$text,[string]$outPath){
  $tmp = [IO.Path]::GetTempFileName().Replace('.tmp','.wav')
  $stream = New-Object -ComObject SAPI.SpFileStream
  $fmt = New-Object -ComObject SAPI.SpAudioFormat
  $fmt.Type = 22  # PCM 22050 mono
  $stream.Format = $fmt
  $stream.Open($tmp,3,$false)
  $sp.Voice = $voice
  $sp.AudioOutputStream = $stream
  [void]$sp.Speak($text)
  $stream.Close()
  & $ffmpeg -y -loglevel error -i $tmp -ar 48000 -ac 1 $outPath
  Remove-Item $tmp -Force
}
# texts base
$tSoul = 'Я  Соул. Низкий, глубокий голос. Спокойная уверенная интонация.'
$tVed  = 'Я  Вед. Мягкая глубина и размеренный ритм. Речь учителя.'
$tRan  = 'Я  Фаина Раневская. Низкий голос, лёгкая хрипотца и ирония.'
# make long (~1215s)
$txtSoul = New-LongText $tSoul 6
$txtVed  = New-LongText $tVed 7
$txtRan  = New-LongText $tRan 6
# Targets
$outSoul = 'Soul\\voices\\Soul_Core\\piper\\01_base_ruslan.wav'
$outVed  = 'Soul\\voices\\Ved_prompt_Masterpiece_v4_3\\piper\\01_base_dmitri.wav'
$outRan  = 'Soul\\voices\\FR_Ranevskaya_Persona_v1_4\\piper\\01_base_irina.wav'
New-Item -ItemType Directory -Force -Path (Split-Path $outSoul), (Split-Path $outVed), (Split-Path $outRan) | Out-Null
Write-SapiWave $male   $txtSoul $outSoul
Write-SapiWave $male   $txtVed  $outVed
Write-SapiWave $female $txtRan  $outRan
# Durations per file
& $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $outSoul
& $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $outVed
& $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $outRan