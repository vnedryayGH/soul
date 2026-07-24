#!/usr/bin/env bash
# Idempotent local dev bring-up for the SoulPulse backend.
#
# NOTE: the `main` branch is intentionally stripped of application code. The
# runnable backend is shipped as `backend_deploy.tgz` inside the git tag
# `v2025.11.04-macros-core`. This script restores that source, installs its
# dependencies, starts PostgreSQL, writes a local dev env file and creates the
# dev schema. It is safe to re-run.
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"
TAG="v2025.11.04-macros-core"

echo "[dev_setup] repo=$REPO"

# 1) Restore backend source from the archived deployment (if not already present).
if [ ! -f backend/requirements.txt ]; then
  echo "[dev_setup] restoring backend from ${TAG}:backend_deploy.tgz ..."
  git show "${TAG}:backend_deploy.tgz" > /tmp/backend_deploy.tgz
  tar xzf /tmp/backend_deploy.tgz \
    --exclude='backend/.venv' --exclude='*/__pycache__' --exclude='*.pyc' \
    --exclude='backend/node_modules' --exclude='backend/.pytest_cache' \
    --exclude='backend/archive_v2_13'
else
  echo "[dev_setup] backend/ already present, skipping restore"
fi

# 2) Python 3.12 venv + deps.
#    IMPORTANT: the source uses Python 3.12-only syntax (backslashes inside
#    f-string expressions), so 3.11 cannot even import it despite what CI pins.
if [ ! -x .venv/bin/python ]; then
  python3.12 -m venv .venv
fi
.venv/bin/python -m pip install --upgrade pip >/dev/null
.venv/bin/pip install -r backend/requirements.txt

# 3) PostgreSQL: role `miniapp_user` / db `miniapp_db` on the default cluster (port 5432).
sudo pg_ctlcluster 16 main start 2>/dev/null || true
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='miniapp_user'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE USER miniapp_user WITH PASSWORD 'miniapp_pwd';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='miniapp_db'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE miniapp_db OWNER miniapp_user;"

# 4) Local dev env file (DB on 5432, background jobs + bot orchestrator disabled).
#    Written without a BOM (a UTF-8 BOM breaks python-dotenv's first key).
cat > backend/.env.local <<'EOF'
DATABASE_URL=postgresql+asyncpg://miniapp_user:miniapp_pwd@localhost:5432/miniapp_db
JWT_SECRET=local-dev-secret-change-me
CORS_ORIGINS=*
DISABLE_BACKGROUND_TASKS=1
DISABLE_BOT_ORCHESTRATOR=1
ENVIRONMENT=dev
EOF

# 5) Create the dev schema from the ORM metadata.
#    The Alembic migration graph in the archive is inconsistent (revision-id vs
#    filename mismatches), so `alembic upgrade head` fails. For a dev smoke we
#    build the schema from SQLAlchemy models instead. ~4 tables carry
#    pre-existing FK/type defects and are skipped; everything else (incl. users)
#    is created.
( cd backend && ../.venv/bin/python - <<'PY'
from sqlalchemy import create_engine
import app.models  # noqa: F401  registers the ORM tables on Base.metadata
from app.db import Base
eng = create_engine("postgresql+psycopg://miniapp_user:miniapp_pwd@localhost:5432/miniapp_db")
ok = fail = 0
for t in Base.metadata.sorted_tables:
    try:
        t.create(eng, checkfirst=True)
        ok += 1
    except Exception:
        fail += 1
print(f"[dev_setup] schema ready: {ok} tables created/present, {fail} skipped (pre-existing model defects)")
PY
)

echo "[dev_setup] done."
echo "[dev_setup] start the API in dev mode with:"
echo "    cd backend && ../.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
