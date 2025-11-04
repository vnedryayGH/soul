#!/usr/bin/env bash
set -euo pipefail

echo "=== SYSTEMCTL STATUS (short) ==="
systemctl is-active soulpulse-backend.service || true
systemctl status soulpulse-backend.service --no-pager -n 30 || true

echo "=== LISTEN PORTS 8000 ==="
ss -ltnp | grep ":8000" || true

echo "=== ENV (.env.prod) first lines ==="
if [ -f /var/www/soulpulse/backend/.env.prod ]; then
  head -n 40 /var/www/soulpulse/backend/.env.prod || true
fi

echo "=== NGINX UPSTREAM (03-mini_soulpulse.conf) grep 8000 ==="
grep -n "8000" /etc/nginx/sites-enabled/03-mini_soulpulse.conf || true

echo "=== HEALTH (localhost) ==="
curl -sS http://127.0.0.1:8000/health || true
echo

echo "=== JOURNAL TAIL ==="
journalctl -u soulpulse-backend.service -n 120 --no-pager || true


