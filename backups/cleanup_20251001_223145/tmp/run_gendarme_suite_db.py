#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Выполнить набор Gendarme тестов напрямую через код приложения (обход HTTP),
сохранить JSON-результаты в файл на сервере и вывести их в stdout.
"""
import asyncio
import json
from pathlib import Path

async def main() -> None:
    # Ленивая загрузка приложения и зависимостей
    from backend.app.db import async_session_maker
    from backend.app.services.gendarme_service import GendarmeService

    test_keys = [
        "p29.pipeline_smoke",
        "p29.judge_charter",
        "p29.processor_cycle",
        "p29.hyperloop_policy_block",
    ]

    out = {"results": []}
    async with async_session_maker() as db:
        svc = GendarmeService()
        for k in test_keys:
            try:
                res = await svc.run_test(db, k)
            except Exception as e:
                res = {"test_key": k, "status": "failed", "detail": str(e)}
            out["results"].append(res)

    # Пишем артефакт
    out_path = Path("/var/www/soulpulse/scripts/gendarme_suite_result.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())


