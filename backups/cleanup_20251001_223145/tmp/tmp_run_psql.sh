#!/usr/bin/env bash
set -euo pipefail
DBURL=$(awk -F= '/^DATABASE_URL=/{print $2}' /etc/soulpulse/miniapp_backend.env)
psql "$DBURL" -v ON_ERROR_STOP=1 -f /root/tmp_rs_pdp.sql
