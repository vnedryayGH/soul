$ErrorActionPreference = "Stop"
# Resolve ffmpeg/ffprobe
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source; if (-not $ffmpeg) { $ffmpeg = 'C:\\ffmpeg\\bin\\ffmpeg.exe' }
$ffprobe = (Get-Command ffprobe -ErrorAction SilentlyContinue).Source; if (-not $ffprobe) { $ffprobe = 'C:\\ffmpeg\\bin\\ffprobe.exe' }
# Resolve SAPI voices
$sp = New-Object -ComObject SAPI.SpVoice
$voices = @($sp.GetVoices())
$male = ($voices | Where-Object { $_.GetDescription() -match 'Aleksandr|Александр' } | Select-Object -First 1); if (-not $male) { $male = $voices | Select-Object -First 1 }
$female = ($voices | Where-Object { $_.GetDescription() -match 'Irina|Ирина' } | Select-Object -First 1); if (-not $female) { $female = $voices | Select-Object -First 1 }
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
  # Convert to 48kHz mono
  & $ffmpeg -y -loglevel error -i $tmp -ar 48000 -ac 1 $outPath
  Remove-Item $tmp -Force
}
# Texts (~12-15 sec)
$textSoul = 'Я  Соул. Низкий, глубокий голос. Спокойная уверенная интонация. Говорю выдержанно, с паузами, без спешки, внятно и чётко.'
$textVed  = 'Я  Вед. Мягкая глубина и размеренный ритм. Спокойная речь учителя, как в большом зале. Каждая фраза звучит ровно и ясно.'
$textRan  = 'Я  Фаина Раневская. Голос низкий и не молодой, с лёгкой хрипотцой и иронией. Говорю неторопливо, но выразительно.'
# Targets
$outSoul = 'Soul\\voices\\Soul_Core\\piper\\01_base_ruslan.wav'
$outVed  = 'Soul\\voices\\Ved_prompt_Masterpiece_v4_3\\piper\\01_base_dmitri.wav'
$outRan  = 'Soul\\voices\\FR_Ranevskaya_Persona_v1_4\\piper\\01_base_irina.wav'
# Ensure folders
New-Item -ItemType Directory -Force -Path (Split-Path $outSoul), (Split-Path $outVed), (Split-Path $outRan) | Out-Null
# Generate
Write-SapiWave $male   $textSoul $outSoul
Write-SapiWave $male   $textVed  $outVed
Write-SapiWave $female $textRan  $outRan
# Durations
& $ffprobe -v error -show_entries format=filename,duration -of default=noprint_wrappers=1:nokey=0 $outSoul $outVed $outRan