set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates git
mkdir -p /opt/piper /opt/piper/models
cd /root
# Install Piper binary+libs
curl -fL -o piper_linux_x86_64.tar.gz https://github.com/rhasspy/piper/releases/latest/download/piper_linux_x86_64.tar.gz
 tar -xzf piper_linux_x86_64.tar.gz -C /opt/piper
 cp -f /opt/piper/bin/piper /usr/local/bin/piper || true
 cp -f /opt/piper/lib/*.so* /usr/local/lib/ || true
 ldconfig || true
 /usr/local/bin/piper --help | head -n 2 || true
# Get voice paths from repo (no LFS needed for listing)
if [ -d /root/piper-voices ]; then
  cd /root/piper-voices && git pull --depth=1 || true
else
  git clone --depth=1 https://huggingface.co/rhasspy/piper-voices /root/piper-voices
fi
cd /root/piper-voices
VOICES=$(find ru_RU -maxdepth 3 -name 'ru_RU-*-medium.onnx.json' | head -n 5)
cd /root
for j in $VOICES; do
  base=${j%.onnx.json}
  name=$(basename "$base")
  echo "DL:$name"
  curl -fL -o "/opt/piper/models/$name.onnx.gz" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$base.onnx.gz"
  curl -fL -o "/opt/piper/models/$name.onnx.json" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$base.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,50p'
# Test synth with the first available model
TEST=$(ls -1 /opt/piper/models/ru_RU-*-medium.onnx.gz 2>/dev/null | head -n1 || true)
if [ -n "$TEST" ]; then
  TBASE=${TEST%.onnx.gz}
  echo '???????? ??????' | /usr/local/bin/piper -m "$TEST" -c "$TBASE.onnx.json" -f /tmp/piper_test.wav
  ls -l /tmp/piper_test.wav
else
  echo "NO_MODELS_DOWNLOADED" >&2
  exit 1
fi