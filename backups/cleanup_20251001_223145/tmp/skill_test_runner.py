#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

import asyncio
import json
from typing import Any, Dict


async def main() -> None:
    from app.db import async_session_maker
    from app.services.gendarme_service import GendarmeService
    from app.services.hyperloop_engine import HyperloopEngine
    from app.services.signature_sdk import SignatureContext

    skill_key = "demo.skill"

    async with async_session_maker() as db:
        g = GendarmeService()
        exp = {
            "module": "backend.app.gendarme_tests.skill_chain_apply_and_trace",
            "callable": "run",
            "skill_key": skill_key,
            "user_id": 468326902,
            "max_latency_ms": 60000,
        }
        spec: Dict[str, Any] = {
            "test_key": f"skill_chain.apply_and_trace.{skill_key}",
            "title": f"Skill chain smoke ({skill_key})",
            "category": "skills",
            "severity": "medium",
            # Серверная версия может ожидать строку JSON — сериализуем явно
            "expected_outcome": json.dumps(exp, ensure_ascii=False),
        }
        try:
            tid = await g.register_test(db, spec)
            print(json.dumps({"registered": tid}, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"register_error": str(e)}, ensure_ascii=False))

        try:
            res = await g.run_test(db, spec["test_key"])
            print(json.dumps({"run": res}, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"run_error": str(e)}, ensure_ascii=False))

        # Hyperloop SKILL.TEST (прямой вызов движка)
        eng = HyperloopEngine()
        sig = SignatureContext()
        out = await eng.execute(
            commands_text=f'SKILL.TEST key="{skill_key}"',
            db=db,
            signature_ctx=sig,
            options={}
        )
        print(json.dumps({"hyperloop": out}, ensure_ascii=False))

        # Прямой вызов плагина (без реестра) для немедленной проверки
        try:
            from app.gendarme_tests import skill_chain_apply_and_trace as plug
            direct = await plug.run(db=db, context={"skill_key": skill_key, "user_id": 468326902, "max_latency_ms": 60000})
            print(json.dumps({"direct_plugin": direct}, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"direct_plugin_error": str(e)}, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())


