#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

import asyncio
import json
from typing import Any, Dict


async def main() -> None:
    # Импорты внутри функции, чтобы сработал PYTHONPATH/рабочая директория backend
    from app.services.hyperloop_engine import HyperloopEngine
    from app.services.signature_sdk import SignatureContext
    from app.db import async_session_maker
    from uuid import uuid4

    async with async_session_maker() as db:
        eng = HyperloopEngine()
        # Явно задаём trace_id, чтобы он присутствовал в ответе и в TRACE.STEPS
        sig = SignatureContext(trace_id=str(uuid4()))
        out_run: Dict[str, Any] = await eng.execute(
            commands_text='CORE.PIPELINE.RUN input_text="health check" WITH TRACE',
            db=db,
            signature_ctx=sig,
            options={'stop_on_error': True},
        )
        trace_id = getattr(sig, 'trace_id', None)
        try:
            # Пытаемся извлечь trace_id из результатов или подписи
            res0 = (out_run.get('results') or [{}])[0]
            trace_id = trace_id or (res0.get('data') or {}).get('trace_id') or (out_run.get('signature') or {}).get('trace_id')
        except Exception:
            trace_id = None

        result: Dict[str, Any] = {'core_run': out_run, 'trace_id': trace_id}

        if trace_id:
            sig2 = SignatureContext()
            out_steps: Dict[str, Any] = await eng.execute(
                commands_text=f'TRACE.STEPS trace_id="{trace_id}"',
                db=db,
                signature_ctx=sig2,
                options={'stop_on_error': True},
            )
            result['trace_steps'] = out_steps

        print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())


