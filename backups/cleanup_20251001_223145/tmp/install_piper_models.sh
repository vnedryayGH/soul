#!/usr/bin/env bash
set -euo pipefail
PIPER_DIR="/opt/piper/models"
mkdir -p "$PIPER_DIR"
cd "$PIPER_DIR"
base="https://github.com/rhasspy/piper/releases/download/v1.0.0"
models=(
  "ru_RU-ruslan-medium"
  "ru_RU-dmitri-medium"
  "ru_RU-gleb-medium"
  "ru_RU-kseniya-medium"
  "ru_RU-alla-medium"
)
for m in "${models[@]}"; do
  if [ -f "$m.onnx" ] || [ -f "$m.onnx.gz" ]; then
    echo "EXISTS:$m"
    continue
  fi
  echo "DOWNLOADING:$m"
  curl -fL -o "$m.onnx.gz" "$base/$m.onnx.gz"
  curl -fL -o "$m.onnx.json" "$base/$m.onnx.json" || curl -fL -o "$m.onnx.json" "$base/${m%.*}.onnx.json"
  if [ ! -s "$m.onnx.json" ]; then
    echo "MISSING_JSON:$m" >&2
    exit 1
  fi
  echo "OK:$m"
done
ls -1 "$PIPER_DIR" | sort