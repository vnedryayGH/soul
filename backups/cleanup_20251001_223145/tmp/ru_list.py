import json, urllib.request, sys
API = 'https://huggingface.co/api/models/rhasspy/piper-voices/tree/main?recursive=1&path=ru_RU'
with urllib.request.urlopen(API) as r:
    data = json.load(r)
paths = [x.get('path','') for x in data if isinstance(x, dict)]
bases = []
seen = set()
for p in paths:
    if p.endswith('.onnx.json') and '/medium/' in p:
        b = p[:-len('.onnx.json')]
        if (b + '.onnx.gz') in paths or (b + '.onnx') in paths:
            if b not in seen:
                bases.append(b); seen.add(b)
for b in bases[:5]:
    print(b)