import os
import csv
import json
import psycopg
from pathlib import Path

TEST_DSN = os.environ.get("TEST_DSN", "postgresql://miniapp_user:miniapp_pwd@127.0.0.1:5432/miniapp_db")
OUT_DIR = Path("tmp/out")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def table_exists(cur, table_name: str) -> bool:
    cur.execute(
        """
        SELECT 1 FROM information_schema.tables
        WHERE table_schema='public' AND table_name=%s
        """,
        (table_name,),
    )
    return cur.fetchone() is not None

with psycopg.connect(TEST_DSN) as conn:
    with conn.cursor() as cur:
        # Export llm_prompts if exists
        if table_exists(cur, "llm_prompts"):
            cur.execute(
                """
                SELECT key, title, content, category, COALESCE(is_system,false)
                FROM llm_prompts
                ORDER BY category, key
                """
            )
            rows = cur.fetchall()
            with open(OUT_DIR / "llm_prompts.csv", "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["key","title","content","category","is_system"])  # header
                for r in rows:
                    w.writerow([r[0], r[1], r[2], r[3], 't' if r[4] else 'f'])

        # Export prompts if exists
        if table_exists(cur, "prompts"):
            cur.execute(
                """
                SELECT key, locale, group_key, name, description, category, content_json
                FROM prompts
                ORDER BY category, key
                """
            )
            rows = cur.fetchall()
            with open(OUT_DIR / "prompts.csv", "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["key","locale","group_key","name","description","category","content_json"])  # header
                for r in rows:
                    w.writerow([r[0], r[1] or 'ru', r[2] or '', r[3] or '', r[4] or '', r[5] or '', json.dumps(r[6] or {}, ensure_ascii=False)])

        # soul_settings (new structured table)
        if table_exists(cur, "soul_settings"):
            cur.execute(
                """
                SELECT key, value, description, category, COALESCE(data_type,'string'), COALESCE(is_configurable,true)
                FROM soul_settings
                ORDER BY category, key
                """
            )
            rows = cur.fetchall()
            with open(OUT_DIR / "soul_settings.csv", "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["key","value","description","category","data_type","is_configurable"])  # header
                for r in rows:
                    w.writerow([r[0], r[1], r[2], r[3], r[4], 't' if r[5] else 'f'])

print("EXPORTED", OUT_DIR.as_posix())
