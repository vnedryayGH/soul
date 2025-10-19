#!/usr/bin/env bash
set -euo pipefail

PASS=$(cat /root/.age_admin_pwd)

readarray -t PARSED < <(python3 - <<'PY'
import re
from urllib.parse import urlparse
with open('/var/www/soulpulse/backend/.env.prod','rb') as f:
    s=f.read().decode('utf-8','ignore')
m=re.search(r'^DATABASE_URL=(.+)$', s, re.M)
url=(m.group(1).strip() if m else '')
p=urlparse(url.replace('+psycopg',''))
print(p.hostname or '')
db=(p.path or '/')[1:].split('?')[0]
print(db)
PY
)

HOST="${PARSED[0]}"
DB="${PARSED[1]}"

export ADMIN_HOST="$HOST" ADMIN_USER="postgres" ADMIN_DB="$DB" PGPASSWORD="$PASS"

chmod +x /root/run_age_grant_adm.sh
/root/run_age_grant_adm.sh

echo DONE_GRANTS

