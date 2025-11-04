from __future__ import annotations

import os
import re


def read_db_url(env_path: str) -> str:
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith("DATABASE_URL="):
                    v = line.split("=", 1)[1].strip()
                    if (v.startswith("\"") and v.endswith("\"")) or (v.startswith("'") and v.endswith("'")):
                        v = v[1:-1]
                    return v
    except Exception:
        pass
    return ""


def normalize_to_psycopg(url: str) -> str:
    # Convert async driver URL to sync for psycopg
    # postgresql+asyncpg:// → postgresql://
    return re.sub(r"\+asyncpg", "", url)


def main() -> None:
    env_path = "/var/www/soulpulse/backend/.env.prod"
    url = read_db_url(env_path)
    if not url:
        raise SystemExit("DATABASE_URL not found")
    url_psyc = normalize_to_psycopg(url)
    try:
        import psycopg  # type: ignore
    except Exception as e:
        raise SystemExit(f"psycopg not available: {e}")
    with psycopg.connect(url_psyc) as conn:
        with conn.cursor() as cur:
            cur.execute("ALTER TABLE alembic_version ALTER COLUMN version_num TYPE VARCHAR(255)")
        conn.commit()
    print("ok")


if __name__ == "__main__":
    main()


