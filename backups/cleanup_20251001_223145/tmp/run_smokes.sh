#!/usr/bin/env bash
set -euo pipefail

cat > /tmp/en.json <<'JSON'
{"input_text":"Smoke EN test","num_candidates":1}
JSON

cat > /tmp/ru.json <<'JSON'
{"input_text":"Проверка RU smoke","num_candidates":1}
JSON

curl -sS -H 'Content-Type: application/json' -H 'X-Telegram-User-ID: 7945329926' --data-binary @/tmp/en.json -o /tmp/en_soul.json -w 'EN:%{http_code}\n' http://127.0.0.1:8000/api/soul/process
printf 'EN_HEAD:\n'; head -c 400 /tmp/en_soul.json; printf '\n\n'

curl -sS -H 'Content-Type: application/json' -H 'X-Telegram-User-ID: 7945329926' --data-binary @/tmp/ru.json -o /tmp/ru_soul.json -w 'RU:%{http_code}\n' http://127.0.0.1:8000/api/soul/process
printf 'RU_HEAD:\n'; head -c 400 /tmp/ru_soul.json; printf '\n'
