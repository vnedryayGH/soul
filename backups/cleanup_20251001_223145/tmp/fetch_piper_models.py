import os, sys, json, urllib.request
MODELS_DIR = "/opt/piper/models"
RELEASE_API = "https://api.github.com/repos/rhasspy/piper-voices/releases/tags/v1.0.0"
TARGET_KEYS = ["dmitri","gleb","kseniya","alla","ruslan","ruslana","irina","sergey"]
os.makedirs(MODELS_DIR, exist_ok=True)
with urllib.request.urlopen(RELEASE_API) as r:
    data = json.load(r)
assets = data.get("assets", [])
ru_assets = [a for a in assets if a.get("name","" ).startswith("ru_RU-") and (a["name"].endswith(".onnx.gz") or a["name"].endswith(".onnx.json"))]
# group by base name without extension
base_to_files = {}
for a in ru_assets:
    name = a["name"]
    if name.endswith(".onnx.gz"):
        base = name[:-len(".onnx.gz")]
    elif name.endswith(".onnx.json"):
        base = name[:-len(".onnx.json")]
    else:
        continue
    base_to_files.setdefault(base, []).append(a)
# prefer target keys
def score(base):
    b = base.lower()
    return min((b.find(k) if b.find(k) >= 0 else 999 for k in TARGET_KEYS))
ordered = sorted(base_to_files.keys(), key=lambda b: score(b))
selected = []
for b in ordered:
    if len(selected) >= 5:
        break
    selected.append(b)
print("SELECTED:", ", ".join(selected))
for base in selected:
    files = base_to_files[base]
    for f in files:
        url = f.get("browser_download_url")
        fname = f.get("name")
        if not url or not fname:
            continue
        out_path = os.path.join(MODELS_DIR, fname)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
            print("EXISTS:", fname)
            continue
        print("DOWNLOADING:", fname)
        try:
            urllib.request.urlretrieve(url, out_path)
        except Exception as e:
            print("ERROR:", fname, e)
            sys.exit(1)
# sanity list
for fn in sorted(os.listdir(MODELS_DIR)):
    print(fn)