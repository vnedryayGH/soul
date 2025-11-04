set -e
mkdir -p /opt/piper/models
BASE="https://huggingface.co/rhasspy/piper-voices/resolve/main"
for name in ruslan dmitri gleb kseniya alla; do
  FB="ru_RU/$name/medium/ru_RU-$name-medium"
  echo DL:$FB
  curl -fL -o "/opt/piper/models/ru_RU-$name-medium.onnx.gz" "$BASE/$FB.onnx.gz"
  curl -fL -o "/opt/piper/models/ru_RU-$name-medium.onnx.json" "$BASE/$FB.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,50p'
export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data
echo '???????? ??????' | /usr/local/bin/piper --espeak_data /usr/local/share/espeak-ng-data -m /opt/piper/models/ru_RU-ruslan-medium.onnx.gz -c /opt/piper/models/ru_RU-ruslan-medium.onnx.json -f /tmp/piper_test.wav
ls -l /tmp/piper_test.wav