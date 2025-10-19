import json
import os
import sys
import uuid
import datetime as dt
from typing import Any, Dict, Tuple

import psycopg

TEST_DSN = os.environ.get("TEST_DSN", "postgresql://miniapp_user:miniapp_pwd@127.0.0.1:5432/miniapp_db")
PROD_DSN = os.environ.get("PROD_DSN", "postgresql://miniapp_user:miniapp_pwd@46.173.24.4:5432/miniapp_db")


def fetch_llm_prompts(conn: psycopg.Connection) -> list[dict]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT key, title, content, category, is_system
            FROM llm_prompts
            ORDER BY category, key
            """
        )
        rows = cur.fetchall()
    return [
        {
            "key": r[0],
            "title": r[1],
            "content": r[2],
            "category": r[3],
            "is_system": bool(r[4]),
        }
        for r in rows
    ]


def upsert_llm_prompts(conn: psycopg.Connection, items: list[dict]) -> Tuple[int, int]:
    inserted = 0
    updated = 0
    with conn.cursor() as cur:
        for it in items:
            cur.execute(
                """
                INSERT INTO llm_prompts (key, title, content, category, is_system, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
                ON CONFLICT (key)
                DO UPDATE SET
                  title = EXCLUDED.title,
                  content = EXCLUDED.content,
                  category = EXCLUDED.category,
                  is_system = EXCLUDED.is_system,
                  updated_at = NOW()
                RETURNING (xmax = 0) AS inserted
                """,
                (it["key"], it["title"], it["content"], it["category"], it["is_system"]),
            )
            (is_inserted,) = cur.fetchone()
            if is_inserted:
                inserted += 1
            else:
                updated += 1
    return inserted, updated


def fetch_soul_settings(conn: psycopg.Connection) -> list[dict]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT key, value, description, category, data_type, is_configurable
            FROM soul_settings
            ORDER BY category, key
            """
        )
        rows = cur.fetchall()
    return [
        {
            "key": r[0],
            "value": r[1],
            "description": r[2],
            "category": r[3],
            "data_type": r[4],
            "is_configurable": bool(r[5]) if r[5] is not None else True,
        }
        for r in rows
    ]


def upsert_soul_settings(conn: psycopg.Connection, items: list[dict]) -> Tuple[int, int]:
    inserted = 0
    updated = 0
    with conn.cursor() as cur:
        for it in items:
            cur.execute(
                """
                INSERT INTO soul_settings (key, value, description, category, data_type, is_configurable, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
                ON CONFLICT (key)
                DO UPDATE SET
                  value = EXCLUDED.value,
                  description = EXCLUDED.description,
                  category = EXCLUDED.category,
                  data_type = EXCLUDED.data_type,
                  is_configurable = EXCLUDED.is_configurable,
                  updated_at = NOW()
                RETURNING (xmax = 0) AS inserted
                """,
                (
                    it["key"],
                    it.get("value"),
                    it.get("description"),
                    it.get("category"),
                    it.get("data_type", "string"),
                    it.get("is_configurable", True),
                ),
            )
            (is_inserted,) = cur.fetchone()
            if is_inserted:
                inserted += 1
            else:
                updated += 1
    return inserted, updated


def main() -> int:
    print("CONNECT_TEST", TEST_DSN)
    print("CONNECT_PROD", PROD_DSN)
    with psycopg.connect(TEST_DSN) as test_conn, psycopg.connect(PROD_DSN) as prod_conn:
        test_conn.autocommit = True
        prod_conn.autocommit = True

        prompts = fetch_llm_prompts(test_conn)
        settings = fetch_soul_settings(test_conn)

        p_ins, p_upd = upsert_llm_prompts(prod_conn, prompts)
        s_ins, s_upd = upsert_soul_settings(prod_conn, settings)

        print(json.dumps({
            "llm_prompts": {"inserted": p_ins, "updated": p_upd, "total": len(prompts)},
            "soul_settings": {"inserted": s_ins, "updated": s_upd, "total": len(settings)}
        }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
