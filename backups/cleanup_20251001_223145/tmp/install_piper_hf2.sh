set -euo pipefail
PIPER_DIR="/opt/piper/models"
mkdir -p "$PIPER_DIR"
cd "$PIPER_DIR"
voices=(
  ru_RU-kseniya-medium
  ru_RU-alla-medium
  ru_RU-ruslan-medium
  ru_RU-dmitri-medium
  ru_RU-gleb-medium
)
for v in "${voices[@]}"; do
  base="https://huggingface.co/rhasspy/piper-voices/resolve/main/ru_RU/${v}/${v}"
  if [ ! -s "${v}.onnx.gz" ]; then
    echo "DL:${v}.onnx.gz"
    curl -fL -o "${v}.onnx.gz" "${base}.onnx.gz"
  else
    echo "EXISTS:${v}.onnx.gz"
  fi
  if [ ! -s "${v}.onnx.json" ]; then
    echo "DL:${v}.onnx.json"
    curl -fL -o "${v}.onnx.json" "${base}.onnx.json"
  else
    echo "EXISTS:${v}.onnx.json"
  fi
done
ls -1 "$PIPER_DIR" | sort | sed -n '1,200p'