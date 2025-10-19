import os, base64
from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
cid = os.getenv('GIGACHAT_CLIENT_ID')
cs  = os.getenv('GIGACHAT_CLIENT_SECRET')
scope = os.getenv('GIGACHAT_SCOPE','GIGACHAT_API_PERS')
assert cid and cs, 'missing creds'
b64 = base64.b64encode(f'{cid}:{cs}'.encode()).decode()
with GigaChat(credentials=b64, scope=scope, verify_ssl_certs=False) as g:
    resp = g.chat(Chat(messages=[Messages(role=MessagesRole.USER, content='ping')], model='GigaChat', temperature=0.1, max_tokens=16))
    print('OK:', resp.choices[0].message.content[:160])
