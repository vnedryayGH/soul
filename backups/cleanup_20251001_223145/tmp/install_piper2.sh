set -euo pipefail
# 1) Install Piper binary/libs from tar already downloaded
cd /root
if [ ! -s /root/piper_linux_x86_64.tar.gz ]; then
  curl -fL -o /root/piper_linux_x86_64.tar.gz https://github.com/rhasspy/piper/releases/latest/download/piper_linux_x86_64.tar.gz
fi
rm -rf /opt/piper_dist
mkdir -p /opt/piper_dist
 tar -xzf /root/piper_linux_x86_64.tar.gz -C /opt/piper_dist
# Archive root folder is 'piper/'
mkdir -p /opt/piper
cp -f /opt/piper_dist/piper/piper /usr/local/bin/piper
cp -f /opt/piper_dist/piper/libpiper_phonemize.so* /usr/local/lib/
cp -f /opt/piper_dist/piper/libespeak-ng.so* /usr/local/lib/
# espeak data
mkdir -p /usr/local/share/espeak-ng-data
cp -rf /opt/piper_dist/piper/espeak-ng-data/* /usr/local/share/espeak-ng-data/
# ensure runtime can find data
if [ ! -f /etc/profile.d/piper.sh ]; then echo 'export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data' > /etc/profile.d/piper.sh; fi
export ESPEAK_DATA_PATH=/usr/local/share/espeak-ng-data
ldconfig || true
/usr/local/bin/piper --help | head -n 3 || true
# 2) Download ru_RU models via HuggingFace API
mkdir -p /opt/piper/models
python3 - << 'PY'
import json,urllib.request,os,sys
base_api='https://huggingface.co/api/models/rhasspy/piper-voices/tree/main?recursive=1'
with urllib.request.urlopen(base_api) as r:
    data=json.load(r)
ru=[x for x in data if isinstance(x,dict) and str(x.get('path','')).startswith('ru_RU/')]
# collect bases for medium with both .onnx.gz and .onnx.json
candidates={}
for x in ru:
    p=x.get('path','')
    if not p.endswith('.onnx.json'): continue
    if '/medium/' not in p: continue
    base=p[:-len('.onnx.json')]
    onnx_gz=base+'.onnx.gz'
    if any(y.get('path','')==onnx_gz for y in ru):
        name=os.path.basename(base)
        candidates[base]=name
sel=list(candidates.keys())[:5]
print('\n'.join(sel))
PY
PY_EXIT=$?
if [ $PY_EXIT -ne 0 ]; then echo 'HF_API_LIST_FAILED' >&2; exit 1; fi
# read selection into array
mapfile -t SEL < <(python3 - << 'PY'
import json,urllib.request,os
base_api='https://huggingface.co/api/models/rhasspy/piper-voices/tree/main?recursive=1'
with urllib.request.urlopen(base_api) as r:
    data=json.load(r)
ru=[x for x in data if isinstance(x,dict) and str(x.get('path','')).startswith('ru_RU/')]
res=[]
seen=set()
for x in ru:
    p=x.get('path','')
    if p.endswith('.onnx.json') and '/medium/' in p:
        b=p[:-len('.onnx.json')]
        if any(y.get('path','')==b+'.onnx.gz' for y in ru) and b not in seen:
            res.append(b)
            seen.add(b)
    if len(res)>=5: break
print('\n'.join(res))
PY)
for b in "${SEL[@]}"; do
  name=$(basename "$b")
  echo "DL:$name"
  curl -fL -o "/opt/piper/models/$name.onnx.gz" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$b.onnx.gz"
  curl -fL -o "/opt/piper/models/$name.onnx.json" "https://huggingface.co/rhasspy/piper-voices/resolve/main/$b.onnx.json"
done
ls -1 /opt/piper/models | sed -n '1,50p'
# 3) Test synth with first model
TEST=$(ls -1 /opt/piper/models/ru_RU-*-medium.onnx.gz 2>/dev/null | head -n1 || true)
if [ -n "$TEST" ]; then
  TBASE=${TEST%.onnx.gz}
  echo '???????? ??????' | /usr/local/bin/piper -m "$TEST" -c "$TBASE.onnx.json" -f /tmp/piper_test.wav
  ls -l /tmp/piper_test.wav
else
  echo 'NO_MODELS_DOWNLOADED' >&2; exit 1
fi