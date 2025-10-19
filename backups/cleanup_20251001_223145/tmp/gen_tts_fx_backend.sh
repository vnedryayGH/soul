set -euo pipefail
OUT_DIR="/opt/voices_samples"
mkdir -p "$OUT_DIR"
TEXT_SHORT="???? ??????. ??? ???? ???????????. ?? ???????? ?????? ????? ??? ?????????."
PERSONAS_FILE="/root/personas.txt"
API="http://127.0.0.1:8000/api/voice/tts"
HDR="X-Telegram-User-ID: 468326902"
# FX chains
fx1="asetrate=48000*0.94,aresample=48000,atempo=1.064"
fx2="asetrate=48000*1.06,aresample=48000,atempo=0.943"
fx3="bass=g=6,treble=g=-2"
fx4="treble=g=6,bass=g=-2"
# read personas
while IFS= read -r persona; do
  [ -z "$persona" ] && continue
  pdir="$OUT_DIR/$persona"
  mkdir -p "$pdir"
  voice="oksana"
  case "$persona" in
    *Architect*|*SoulPulse*|*Soul_Core*|*Zhvan*) voice="ermil";;
  esac
  echo "Persona:$persona voice:$voice"
  tmpwav=$(mktemp /tmp/base_XXXX.wav)
  body=$(printf '{"text":"%s","voice":"%s","format":"wav"}' "$TEXT_SHORT" "$voice")
  curl -sS -f -H "$HDR" -H 'Content-Type: application/json' -X POST --data "$body" "$API" -o "$tmpwav"
  cp "$tmpwav" "$pdir/01_base_${voice}.wav"
  ffmpeg -y -i "$tmpwav" -af "$fx1" "$pdir/02_low_pitch.wav" >/dev/null 2>&1
  ffmpeg -y -i "$tmpwav" -af "$fx2" "$pdir/03_high_pitch.wav" >/dev/null 2>&1
  ffmpeg -y -i "$tmpwav" -af "$fx3" "$pdir/04_warm_bass.wav" >/dev/null 2>&1
  ffmpeg -y -i "$tmpwav" -af "$fx4" "$pdir/05_airy_top.wav"  >/dev/null 2>&1
  rm -f "$tmpwav"
done < "$PERSONAS_FILE"
cd "$OUT_DIR" && tar -czf voices_samples.tar.gz *
ls -l "$OUT_DIR" | sed -n '1,200p'