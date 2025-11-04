$ErrorActionPreference = "Stop"
$tmp = "Soul\voices\_piper_tmp"
if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
& tar -xzf "Soul\voices\piper_personas_samples.tar.gz" -C $tmp
New-Item -ItemType Directory -Force -Path "Soul\voices\Soul_Core\piper","Soul\voices\Ved_prompt_Masterpiece_v4_3\piper","Soul\voices\FR_Ranevskaya_Persona_v1_4\piper" | Out-Null
Copy-Item -Force -Path "$tmp\Soul\*" -Destination "Soul\voices\Soul_Core\piper"
Copy-Item -Force -Path "$tmp\Ved\*" -Destination "Soul\voices\Ved_prompt_Masterpiece_v4_3\piper"
Copy-Item -Force -Path "$tmp\FR_Ranevskaya\*" -Destination "Soul\voices\FR_Ranevskaya_Persona_v1_4\piper"
Get-ChildItem -File "Soul\voices\Soul_Core\piper\*.wav","Soul\voices\Ved_prompt_Masterpiece_v4_3\piper\*.wav","Soul\voices\FR_Ranevskaya_Persona_v1_4\piper\*.wav" | Select-Object -ExpandProperty FullName