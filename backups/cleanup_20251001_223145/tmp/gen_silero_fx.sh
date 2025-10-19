#!/usr/bin/env bash
set -euo pipefail
# Требуется: ffmpeg, curl, silero HTTP TTS (SILERO_TTS_URL)
OUT_DIR="/opt/voices_samples"
mkdir -p "$OUT_DIR"
TEXT_SHORT="Всем привет. Это тест озвучивания. Мы выбираем лучший голос для персонажа."
# Персоны загружаем из файла, если есть
PERSONAS_FILE="/root/personas.txt"
if [ ! -s "$PERSONAS_FILE" ]; then
  echo "Architect_Soul\nfemale_resonance\nflow_prompt-3_v4\nFR_Ranevskaya_Persona_v1_4\nKabbalah_prompt-3_v16\nLT_Prompt_Masterpiece_v1_9\nSoulPulse\nSoul_Core\nVed_prompt_Masterpiece_v4_3\nZhvanetsky_Persona_v4_1\nzhvan_prompt_clean_v3_3" > "$PERSONAS_FILE"
fi
SILERO_URL=${SILERO_TTS_URL:-"http://127.0.0.1:8089/tts"}
echo "Using SILERO_URL=$SILERO_URL"
# Мэппинг пола по ключевым словам
male_keys=(Architect SoulPulse Soul_Core Zhvan)
female_keys=(Ranevskaya female)
base_male="eugene"
base_female="xenia"
# Варианты FX
fx1="asetrate=48000*0.94,aresample=48000,atempo=1.064"
fx2="asetrate=48000*1.06,aresample=48000,atempo=0.943"
fx3="bass=g=6,treble=g=-2"
fx4="treble=g=6,bass=g=-2"
# Генерация
while IFS= read -r persona; do
  [ -z "$persona" ] && continue
  pdir="$OUT_DIR/$persona"
  mkdir -p "$pdir"
  voice="$base_female"
  for k in "${male_keys[@]}"; do
    if echo "$persona" | grep -qi "$k"; then voice="$base_male"; fi
  done
  for k in "${female_keys[@]}"; do
    if echo "$persona" | grep -qi "$k"; then voice="$base_female"; fi
  done
  echo "Persona:$persona voice:$voice"
  # Базовый WAV через Silero HTTP (возвращает ogg/wav). Сохраним как wav.
  tmpogg=$(mktemp /tmp/silero_XXXX.ogg)
  tmpwav=$(mktemp /tmp/base_XXXX.wav)
  curl -sS -f -X POST -H 'Content-Type: application/json' -d "{\"text\":\"$TEXT_SHORT\",\"voice\":\"$voice\",\"format\":\"ogg\"}" "$SILERO_URL" -o "$tmpogg"
  ffmpeg -y -i "$tmpogg" -ar 48000 -ac 1 "$tmpwav" >/dev/null 2>&1
  cp "$tmpwav" "$pdir/01_base_${voice}.wav"
  # FX варианты
  ffmpeg -y -i "$tmpwav" -af "$fx1" "$pdir/02_low_pitch.wav" >/dev/null 2>&1
  ffmpeg -y -i "$tmpwav" -af "$fx2" "$pdir/03_high_pitch.wav" >/dev/null 2>&1
  ffmpeg -y -i "$tmpwav" -af "$fx3" "$pdir/04_warm_bass.wav" >/dev/null 2>&1
  ffmpeg -y -i "$tmpwav" -af "$fx4" "$pdir/05_airy_top.wav"  >/dev/null 2>&1
  rm -f "$tmpogg" "$tmpwav"
done < "$PERSONAS_FILE"
# Архив
cd "$OUT_DIR" && tar -czf voices_samples.tar.gz *
ls -l "$OUT_DIR" | sed -n '1,200p'