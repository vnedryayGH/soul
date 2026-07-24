# SoulPulse — repository notes

This repository ships the **SoulPulse / SoulPulse Mini** product: a Telegram Mini App
(AI companion / emotional-wellbeing chat) built on a Python **FastAPI** backend
(`app.main:app`) backed by **PostgreSQL** (async SQLAlchemy + Alembic), a React/Vite
frontend delivered as a compiled bundle, an optional Telegram polling bot, and optional
Rust sidecars.

> Important: the `main` branch has been intentionally stripped of application code
> (see the many `Delete ...` commits). The runnable backend is shipped as
> `backend_deploy.tgz` inside the git tag **`v2025.11.04-macros-core`**. Everything
> below explains how to materialize and run it.

## Cursor Cloud specific instructions

### Where the code lives / one-command setup
- `main` contains no app source. The backend source is inside
  `v2025.11.04-macros-core:backend_deploy.tgz` (the frontend exists only as a compiled
  `dist/`, so it is not developable from source).
- Run `bash scripts/dev_setup.sh` to bring the backend up locally. It is idempotent and:
  restores `backend/` from the tag archive, creates a Python venv, installs
  `backend/requirements.txt`, starts PostgreSQL, writes `backend/.env.local`, and builds
  the dev schema. The restored `backend/` and `.venv/` are gitignored — do not commit them.

### Runtime gotchas (non-obvious)
- **Python 3.12 is required**, not 3.11. The source uses backslashes inside f-string
  expressions (valid only on 3.12+), so 3.11 cannot even import `app.main` despite CI
  pinning 3.11. The base VM's system `python3.12` is used.
- **Alembic is broken**: the migration graph in the archive has revision-id/filename
  mismatches, so `alembic upgrade head` raises `KeyError`. `dev_setup.sh` builds the
  schema directly from SQLAlchemy models (`Base.metadata`) instead. About 4 tables
  (`security_settings`, `security_events`, `anomaly_detections`, `quant_connections`)
  have pre-existing FK/enum-type defects and are skipped; the rest (incl. `users`) are
  created and are enough for core flows.
- **env files must be BOM-free.** `python-dotenv` mangles the first key if the file has
  a UTF-8 BOM (the config then silently falls back to the default `DATABASE_URL` on port
  5433). `dev_setup.sh` writes `backend/.env.local` correctly.
- **PostgreSQL is not auto-started.** After a fresh VM boot, run
  `sudo pg_ctlcluster 16 main start` (or just re-run `scripts/dev_setup.sh`). The
  `miniapp_user` role and `miniapp_db` database live on the default cluster (port 5432);
  `backend/.env.local` points `DATABASE_URL` there (converted to `asyncpg` at runtime).
- **Local dev auth shortcut:** endpoints that use `verify_telegram_auth` accept a plain
  `X-Telegram-User-ID: <tg_id>` header instead of a signed Telegram `initData`. This is
  the easiest way to exercise authenticated endpoints locally without a bot token.

### Running the backend (dev)
```
cd backend && ../.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Boot with `DISABLE_BACKGROUND_TASKS=1` and `DISABLE_BOT_ORCHESTRATOR=1` (set in
`.env.local`) so the API starts against Postgres only, without the scheduler/bot fleet.
Health check: `GET http://localhost:8000/api/health` → `{"status":"ok",...,"database":"healthy"}`.

### Lint / tests
- Lint (matches CI): `.venv/bin/ruff check backend` — note the archived code already has
  ~1700 lint findings; this is pre-existing debt, not a regression.
- Tests: from `backend/`, `../.venv/bin/python -m pytest -o asyncio_mode=auto` (the suite
  uses `pytest.mark.asyncio`, so `pytest-asyncio` + `asyncio_mode=auto` are needed). Many
  tests require a populated DB / external services; simple unit tests
  (e.g. `tests/test_web_auth_simple.py`, `tests/test_html_escaping.py`) pass out of the box.

### Services
- **PostgreSQL** — required (core datastore).
- **Backend API (uvicorn)** — the product itself.
- Optional / need external secrets, not required for a core boot: an **LLM provider**
  (GigaChat / OpenAI / DeepSeek via `LLM_PROVIDER` + keys), the **Telegram bot**
  (`BOT_TOKEN`, run via `start_everything.py`), **Redis** (`REDIS_URL`), voice ASR/TTS,
  and the Rust **rsbus** sidecars (all `*_RS_ENABLED=0` by default).
