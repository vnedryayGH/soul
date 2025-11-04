set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates tar coreutils
mkdir -p /opt/piper
cd /root
dl_ok=0
for v in v1.2.0 v1.1.0 v1.0.0; do
  url="https://github.com/rhasspy/piper/releases/download/$v/piper_linux_x86_64.tar.gz"
  echo "TRY:$url"
  if curl -fL -o piper_linux_x86_64.tar.gz "$url"; then dl_ok=1; break; fi
done
if [ "$dl_ok" -ne 1 ]; then echo "PIPER_BIN_DOWNLOAD_FAILED" >&2; exit 1; fi
tar -xzf piper_linux_x86_64.tar.gz -C /opt/piper
cp -f /opt/piper/bin/piper /usr/local/bin/piper || true
cp -f /opt/piper/lib/libpiper_phonemize.so* /usr/local/lib/ || true
cp -f /opt/piper/lib/libespeak-ng.so* /usr/local/lib/ || true
ldconfig
/usr/local/bin/piper --help | head -n 2 || true
mkdir -p /opt/piper/models
base="https://huggingface.co/rhasspy/piper-voices/resolve/main"
for name in dmitri gleb kseniya ruslan alla; do
  fbase="ru_RU/$name/medium/ru_RU-$name-medium"
  echo "DL:$fbase"
  curl -fL -o "/opt/piper/models/ru_RU-$name-medium.onnx.gz" "$base/$fbase.onnx.gz"
  curl -fL -o "/opt/piper/models/ru_RU-$name-medium.onnx.json" "$base/$fbase.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,200p'
echo '???????? ??????' | /usr/local/bin/piper -m /opt/piper/models/ru_RU-ruslan-medium.onnx.gz -c /opt/piper/models/ru_RU-ruslan-medium.onnx.json -f /tmp/piper_test.wav
ls -l /tmp/piper_test.wav