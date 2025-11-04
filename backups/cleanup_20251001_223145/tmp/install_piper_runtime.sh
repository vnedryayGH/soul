set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates tar
# Install Piper binary and libs
cd /root
if [ ! -s /root/piper_linux_x86_64.tar.gz ]; then
  curl -fL -o /root/piper_linux_x86_64.tar.gz https://github.com/rhasspy/piper/releases/latest/download/piper_linux_x86_64.tar.gz
fi
rm -rf /opt/piper_dist
mkdir -p /opt/piper_dist
 tar -xzf /root/piper_linux_x86_64.tar.gz -C /opt/piper_dist
cp -f /opt/piper_dist/piper/piper /usr/local/bin/piper
cp -f /opt/piper_dist/piper/libpiper_phonemize.so* /usr/local/lib/
cp -f /opt/piper_dist/piper/libespeak-ng.so* /usr/local/lib/
mkdir -p /usr/local/share/espeak-ng-data
cp -rf /opt/piper_dist/piper/espeak-ng-data/* /usr/local/share/espeak-ng-data/
# Install ONNX Runtime 1.14.1
cd /root
curl -fL -o onnxruntime-linux-x64-1.14.1.tgz https://github.com/microsoft/onnxruntime/releases/download/v1.14.1/onnxruntime-linux-x64-1.14.1.tgz
rm -rf /opt/onnxruntime-1.14.1
mkdir -p /opt/onnxruntime-1.14.1
 tar -xzf onnxruntime-linux-x64-1.14.1.tgz -C /opt/onnxruntime-1.14.1 --strip-components=1
cp -f /opt/onnxruntime-1.14.1/lib/libonnxruntime.so.1.14.1 /usr/local/lib/
ln -sf /usr/local/lib/libonnxruntime.so.1.14.1 /usr/local/lib/libonnxruntime.so.1
ln -sf /usr/local/lib/libonnxruntime.so.1.14.1 /usr/local/lib/libonnxruntime.so
# refresh linker cache
ldconfig || true
# env for espeak data
if [ ! -f /etc/profile.d/piper.sh ]; then echo 'export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data' > /etc/profile.d/piper.sh; fi
export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data
/usr/local/bin/piper --help | head -n 3 || true
# Download ru_RU models
mkdir -p /opt/piper/models
base=https://huggingface.co/rhasspy/piper-voices/resolve/main
for name in ruslan dmitri gleb kseniya Alla; do
  fbase="ru_RU/$name/medium/ru_RU-$name-medium"
  echo "DL:$fbase"
  curl -fL -o "/opt/piper/models/ru_RU-$name-medium.onnx.gz" "$base/$fbase.onnx.gz"
  curl -fL -o "/opt/piper/models/ru_RU-$name-medium.onnx.json" "$base/$fbase.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,50p'
# Test synth
TEST=/opt/piper/models/ru_RU-ruslan-medium.onnx.gz
if [ -s "$TEST" ]; then
  echo '???????? ??????' | /usr/local/bin/piper -m "$TEST" -c /opt/piper/models/ru_RU-ruslan-medium.onnx.json -f /tmp/piper_test.wav
  ls -l /tmp/piper_test.wav
else
  echo 'MODEL_MISSING: ru_RU-ruslan-medium' >&2; exit 1
fi