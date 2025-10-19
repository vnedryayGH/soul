$ErrorActionPreference = "Stop"
# Tools
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source; if (-not $ffmpeg) { $ffmpeg = 'C:\\ffmpeg\\bin\\ffmpeg.exe' }
$ffprobe = (Get-Command ffprobe -ErrorAction SilentlyContinue).Source; if (-not $ffprobe) { $ffprobe = 'C:\\ffmpeg\\bin\\ffprobe.exe' }
# 0) Remove zero-length wavs under Soul/voices
Get-ChildItem -Recurse -File 'Soul\voices\*.wav' | Where-Object { $_.Length -lt 2048 } | Remove-Item -Force -ErrorAction SilentlyContinue
# 1) Resolve SAPI voices
$sp = New-Object -ComObject SAPI.SpVoice
$voices = @($sp.GetVoices())
$male = ($voices | Where-Object { $_.GetDescription() -match 'Aleksandr|Александр' } | Select-Object -First 1); if (-not $male) { $male = $voices | Select-Object -First 1 }
$female = ($voices | Where-Object { $_.GetDescription() -match 'Irina|Ирина|Zira' } | Select-Object -First 1); if (-not $female) { $female = $voices | Select-Object -First 1 }
function New-LongText([string]$base,[int]$repeat){ $sb = New-Object System.Text.StringBuilder; for($i=0;$i -lt $repeat;$i++){ [void]$sb.Append($base).Append(' ') } $sb.ToString() }
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
# 2) Personas and texts (~1218s)
$items = @(
  @{ name='Soul_Core'; voice=$male; text=(New-LongText 'Я  Соул. Низкий, глубокий голос. Спокойная уверенная интонация.' 6) },
  @{ name='Ved_prompt_Masterpiece_v4_3'; voice=$male; text=(New-LongText 'Я  Вед. Мягкая глубина и размеренный ритм. Спокойная речь учителя.' 7) },
  @{ name='FR_Ranevskaya_Persona_v1_4'; voice=$female; text=(New-LongText 'Я  Фаина Раневская. Низкий голос, лёгкая хрипотца и ирония.' 6) }
)
$added=@()
foreach($it in $items){
  $dir = Join-Path 'Soul\voices' $it.name
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $base = Join-Path $dir 'voice_01_base.wav'
  Write-SapiWave $it.voice $it.text $base
  # FX variants
  & $ffmpeg -y -loglevel error -i $base -af "asetrate=48000*0.94,aresample=48000,atempo=1.064, volume=0.9" (Join-Path $dir 'voice_02_low.wav')
  & $ffmpeg -y -loglevel error -i $base -af "asetrate=48000*1.06,aresample=48000,atempo=0.943, volume=0.9" (Join-Path $dir 'voice_03_high.wav')
  & $ffmpeg -y -loglevel error -i $base -af "bass=g=4, treble=g=-1, acompressor=makeup=2:threshold=-20dB:ratio=2" (Join-Path $dir 'voice_04_warm_bass.wav')
  & $ffmpeg -y -loglevel error -i $base -af "aecho=0.6:0.5:50:0.25, treble=g=2, volume=0.9" (Join-Path $dir 'voice_05_airy_reverb.wav')
  $added += Get-ChildItem -File (Join-Path $dir 'voice_0*.wav')
}
# 3) Output durations
foreach($f in $added){
  $dur = & $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $f.FullName
  '{0}  {1:N1}s' -f $f.FullName, [double]$dur
}