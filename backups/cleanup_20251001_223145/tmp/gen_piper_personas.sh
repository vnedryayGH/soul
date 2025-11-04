set -euo pipefail
OUT="/opt/piper_personas"
mkdir -p "$OUT"
export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data
PIPER=/usr/local/bin/piper
# Texts (<=20s)
TXT_SOUL="?  ????. ??????, ???????? ?????. ????????? ????????? ?????????."
TXT_VED="?  ???. ???????. ?????? ??????? ? ?????? ???????????? ????????????."
TXT_RAN="?  ????? ?????????. ????? ??????, ?? ???????, ? ?????? ?????????."
# Models
M_RUS=/opt/piper/models/ru_RU-ruslan-medium.onnx; C_RUS=/opt/piper/models/ru_RU-ruslan-medium.onnx.json
M_DMI=/opt/piper/models/ru_RU-dmitri-medium.onnx; C_DMI=/opt/piper/models/ru_RU-dmitri-medium.onnx.json
M_DEN=/opt/piper/models/ru_RU-denis-medium.onnx;  C_DEN=/opt/piper/models/ru_RU-denis-medium.onnx.json
M_IRI=/opt/piper/models/ru_RU-irina-medium.onnx;  C_IRI=/opt/piper/models/ru_RU-irina-medium.onnx.json
synth(){ echo "$1" | "$PIPER" --espeak_data "$ESPEAK_DATA_PATH" -m "$2" -c "$3" -f "$4"; }
fx(){ in="$1"; shift; out="$1"; shift; ffmpeg -y -loglevel error -i "$in" -af "$*" -ar 48000 -ac 1 "$out"; }
# SOUL (??????, ????????)
SD=$OUT/Soul; mkdir -p "$SD"
synth "$TXT_SOUL" "$M_RUS" "$C_RUS" "$SD/01_base_ruslan.wav"
fx "$SD/01_base_ruslan.wav" "$SD/02_low_pitch6.wav"  "asetrate=48000*0.94,aresample=48000,atempo=1.064, bass=g=5, acompressor=makeup=3:threshold=-18dB:ratio=2"
fx "$SD/01_base_ruslan.wav" "$SD/03_low_pitch9.wav"  "asetrate=48000*0.91,aresample=48000,atempo=1.098, bass=g=6, equalizer=f=220:t=q:w=1.0:g=3"
fx "$SD/01_base_ruslan.wav" "$SD/04_warm_compress.wav" "bass=g=5, equalizer=f=1800:t=q:w=1.0:g=-2, acompressor=makeup=2:threshold=-20dB:ratio=2"
fx "$SD/01_base_ruslan.wav" "$SD/05_cavern_low.wav"   "asetrate=48000*0.94,aresample=48000,atempo=1.064, aecho=0.8:0.6:60:0.25, bass=g=4"
# VED (? ????????)
VD=$OUT/Ved; mkdir -p "$VD"
synth "$TXT_VED" "$M_DMI" "$C_DMI" "$VD/01_base_dmitri.wav"
fx "$VD/01_base_dmitri.wav" "$VD/02_hall_light.wav"  "aecho=0.6:0.5:30:0.2, treble=g=2"
fx "$VD/01_base_dmitri.wav" "$VD/03_hall_medium.wav" "aecho=0.7:0.6:60:0.25, equalizer=f=500:t=q:w=1.0:g=1"
fx "$VD/01_base_dmitri.wav" "$VD/04_hall_long.wav"   "aecho=0.8:0.7:90:0.3, acompressor=makeup=2:threshold=-22dB:ratio=2"
fx "$VD/01_base_dmitri.wav" "$VD/05_airy_reverb.wav" "aecho=0.6:0.4:50:0.2, treble=g=4, equalizer=f=250:t=q:w=1.0:g=-1"
# RANEVSKAYA (??????, ? ?????????)
FR=$OUT/FR_Ranevskaya; mkdir -p "$FR"
synth "$TXT_RAN" "$M_IRI" "$C_IRI" "$FR/01_base_irina.wav"
fx "$FR/01_base_irina.wav" "$FR/02_low_husky.wav"  "asetrate=48000*0.94,aresample=48000,atempo=1.064, bass=g=4, acompressor=makeup=2:threshold=-20dB:ratio=2"
fx "$FR/01_base_irina.wav" "$FR/03_smoky.wav"      "asetrate=48000*0.92,aresample=48000,atempo=1.087, equalizer=f=2500:t=q:w=1.0:g=-3, treble=g=-1"
fx "$FR/01_base_irina.wav" "$FR/04_aged_timbre.wav" "asetrate=48000*0.95,aresample=48000,atempo=1.053, aphaser=type=t:speed=0.5:decay=0.6, acompressor=makeup=2"
fx "$FR/01_base_irina.wav" "$FR/05_stage_reverb.wav" "aecho=0.7:0.5:70:0.25, asetrate=48000*0.97,aresample=48000,atempo=1.031"
# Pack
cd "$OUT"; tar -czf piper_personas_samples.tar.gz Soul Ved FR_Ranevskaya
ls -lR "$OUT" | sed -n '1,200p'