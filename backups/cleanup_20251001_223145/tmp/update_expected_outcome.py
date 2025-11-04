#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

import asyncio
import json
from typing import Any


async def main() -> None:
    from app.db import async_session_maker
    from sqlalchemy import text as T  # type: ignore

    async with async_session_maker() as db:
        pairs: list[tuple[str, dict[str, Any]]] = [
            (
                "skill_chain.golden_eval.demo.skill",
                {"module": "backend.app.gendarme_tests.skill_chain_golden_eval_demo_skill", "callable": "run"},
            ),
            (
                "skill_chain.sleep_optimize_then_apply.demo.skill",
                {"module": "backend.app.gendarme_tests.skill_chain_sleep_optimize_then_apply_demo_skill", "callable": "run"},
            ),
        ]
        for key, exp in pairs:
            exp_json = json.dumps(exp, ensure_ascii=False)
            await db.execute(
                T(
                    "update tests_registry set expected_outcome=CAST(:exp as jsonb), updated_at=now() where test_key=:k"
                ),
                {"k": key, "exp": exp_json},
            )
        await db.commit()
        rows = (
            await db.execute(
                T(
                    "select test_key, expected_outcome::text from tests_registry where test_key like 'skill_chain.%demo.skill' order by test_key"
                )
            )
        ).fetchall()
        print(json.dumps({"updated": [{"k": r[0], "exp": r[1]} for r in rows]}, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())


