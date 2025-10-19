#!/usr/bin/env bash
set -euo pipefail
PIPER_DIR="/opt/piper/models"
mkdir -p "$PIPER_DIR"
cd "$PIPER_DIR"
base="https://huggingface.co/rhasspy/piper-voices/resolve/main/ru_RU"
models=(
  "dmitri"
  "gleb"
  "kseniya"
  "ruslan"
  "alla"
)
for name in "${models[@]}"; do
  filebase="ru_RU-${name}-medium"
  url_onnx="${base}/${name}/medium/${filebase}.onnx.gz"
  url_json="${base}/${name}/medium/${filebase}.onnx.json"
  ok=1
  if [ ! -s "${filebase}.onnx.gz" ]; then
    echo "DL:${filebase}.onnx.gz"
    if ! curl -fL -o "${filebase}.onnx.gz" "$url_onnx"; then ok=0; fi
  else
    echo "EXISTS:${filebase}.onnx.gz"
  fi
  if [ ! -s "${filebase}.onnx.json" ]; then
    echo "DL:${filebase}.onnx.json"
    if ! curl -fL -o "${filebase}.onnx.json" "$url_json"; then ok=0; fi
  else
    echo "EXISTS:${filebase}.onnx.json"
  fi
  if [ "$ok" = "0" ]; then
    echo "FAILED:${filebase}" >&2
  else
    echo "OK:${filebase}"
  fi
done
ls -1 "$PIPER_DIR" | sort | sed -n '1,200p'