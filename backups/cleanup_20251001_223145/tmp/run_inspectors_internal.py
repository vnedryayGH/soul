#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations
import asyncio, json
from typing import Any, Dict

from backend.app.db import async_session_maker
from backend.app.services.hyperloop_engine import HyperloopEngine
from backend.app.services.signature_sdk import SignatureContext


async def main() -> None:
    async with async_session_maker() as db:
        eng = HyperloopEngine()
        sig = SignatureContext()
        out: Dict[str, Any] = await eng.execute(
            commands_text="INSPECTOR.RUN_ALL scope=*",
            db=db,
            signature_ctx=sig,
            options={"stop_on_error": False},
        )
        try:
            with open("/var/www/soulpulse/scripts/gendarme_inspectors_result.json", "w", encoding="utf-8") as f:
                json.dump(out, f, ensure_ascii=False)
        except Exception:
            pass
        print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())


