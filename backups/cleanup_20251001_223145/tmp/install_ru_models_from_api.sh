set -euo pipefail
mkdir -p /opt/piper/models
python3 - << 'PY'
import json,urllib.request,sys
API='https://huggingface.co/api/models/rhasspy/piper-voices/tree/main?recursive=1&path=ru_RU'
with urllib.request.urlopen(API) as r:
    data=json.load(r)
paths=[x.get('path','') for x in data if isinstance(x,dict)]
bases=[]; seen=set()
for p in paths:
    if p.endswith('.onnx.json') and '/medium/' in p:
        b=p[:-len('.onnx.json')]
        if b+'.onnx.gz' in paths and b not in seen:
            bases.append(b); seen.add(b)
for b in bases[:5]:
    print(b)
PY
PY_EXIT=$?
if [ $PY_EXIT -ne 0 ]; then echo 'HF_API_LIST_FAILED' >&2; exit 1; fi
mapfile -t SEL < <(python3 - << 'PY'
import json,urllib.request
API='https://huggingface.co/api/models/rhasspy/piper-voices/tree/main?recursive=1&path=ru_RU'
with urllib.request.urlopen(API) as r:
    data=json.load(r)
paths=[x.get('path','') for x in data if isinstance(x,dict)]
bases=[]; seen=set()
for p in paths:
    if p.endswith('.onnx.json') and '/medium/' in p:
        b=p[:-len('.onnx.json')]
        if b+'.onnx.gz' in paths and b not in seen:
            bases.append(b); seen.add(b)
print('\n'.join(bases[:5]))
PY)
BASE=https://huggingface.co/rhasspy/piper-voices/resolve/main
for b in "${SEL[@]}"; do
  name=$(basename "$b")
  echo "DL:$name"
  curl -fL -o "/opt/piper/models/$name.onnx.gz" "$BASE/$b.onnx.gz"
  curl -fL -o "/opt/piper/models/$name.onnx.json" "$BASE/$b.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,200p'
TEST=$(ls -1 /opt/piper/models/ru_RU-*-medium.onnx.gz 2>/dev/null | head -n1 || true)
if [ -n "$TEST" ]; then
  TBASE=${TEST%.onnx.gz}
  echo '???????? ??????' | /usr/local/bin/piper -m "$TEST" -c "$TBASE.onnx.json" -f /tmp/piper_test.wav
  ls -l /tmp/piper_test.wav
else
  echo 'NO_MODELS_DOWNLOADED' >&2; exit 1
fi