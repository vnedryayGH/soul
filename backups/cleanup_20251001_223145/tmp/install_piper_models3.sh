set -euo pipefail
# Ensure piper binary/libs/espeak data already installed earlier
export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data
mkdir -p /opt/piper/models
cd /root
BASE_HTML="https://huggingface.co/rhasspy/piper-voices/tree/main/ru_RU"
html=$(curl -sS "$BASE_HTML")
# extract model base names ru_RU-*-medium.onnx.gz
list=$(printf "%s" "$html" | grep -oE 'ru_RU/[^" ]+/medium/ru_RU-[^" ]+-medium\.onnx\.gz' | sed 's/.onnx.gz$//' | head -n 5 | sort -u)
if [ -z "$list" ]; then echo "HF_HTML_PARSE_FAILED" >&2; exit 1; fi
for b in $list; do
  name=$(basename "$b")
  echo "DL:$name"
  curl -fL -o "/opt/piper/models/$name.onnx.gz" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$b.onnx.gz"
  curl -fL -o "/opt/piper/models/$name.onnx.json" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$b.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,200p'
# test synth with first model
TEST=$(ls -1 /opt/piper/models/ru_RU-*-medium.onnx.gz 2>/dev/null | head -n1)
if [ -n "$TEST" ]; then
  TBASE=${TEST%.onnx.gz}
  echo '???????? ??????' | /usr/local/bin/piper --espeak_data /usr/local/share/espeak-ng-data -m "$TEST" -c "$TBASE.onnx.json" -f /tmp/piper_test.wav
  ls -l /tmp/piper_test.wav
else
  echo "NO_MODELS" >&2; exit 1
fi