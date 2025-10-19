import json,urllib.request,sys
u='https://api.github.com/repos/rhasspy/piper/releases'
with urllib.request.urlopen(u) as r:
    data=json.load(r)
for rel in data:
    for a in rel.get('assets',[]):
        url=a.get('browser_download_url','')
        name=a.get('name','')
        if 'linux' in url.lower() and 'x86_64' in url.lower() and url.lower().endswith('.tar.gz'):
            print(url)
            sys.exit(0)
print('NONE')