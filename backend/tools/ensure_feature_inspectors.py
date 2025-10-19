#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ensure-скрипт для создания реестра инспекторов (feature_inspectors).

Запуск: PYTHONPATH=. venv/bin/python backend/tools/ensure_feature_inspectors.py
"""
from __future__ import annotations

import asyncio
from typing import Any
import json
from sqlalchemy import text as _t

try:
    # Репозиторий layout (локально)
    from backend.app.db import async_session_maker  # type: ignore
except Exception:
    # PROD layout (/var/www/soulpulse/backend)
    from app.db import async_session_maker  # type: ignore


DDL_TABLE = """
create table if not exists feature_inspectors (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  module text,
  callable text,
  scope text,
  enabled boolean default true,
  config jsonb,
  updated_at timestamp with time zone default now()
);
"""

DDL_INDEX = """
create index if not exists idx_feature_inspectors_scope on feature_inspectors (scope);
"""

SEED: list[dict[str, Any]] = [
    {
        "key": "sanitizer.patterns_consistency",
        "module": None,
        "callable": None,
        "scope": "sanitizer",
        "enabled": True,
        "config": {},
    },
    {
        "key": "signature.required_steps.consistency",
        "module": None,
        "callable": None,
        "scope": "signature",
        "enabled": True,
        "config": {},
    },
    {
        "key": "guard.delivery.enforceable",
        "module": None,
        "callable": None,
        "scope": "guard",
        "enabled": True,
        "config": {},
    },
    {
        "key": "guard.visible_reply.safety",
        "module": None,
        "callable": None,
        "scope": "guard",
        "enabled": True,
        "config": {"limit": 200},
    },
    {
        "key": "processor.policy_block",
        "module": None,
        "callable": None,
        "scope": "processor",
        "enabled": True,
        "config": {},
    },
    {
        "key": "processor.feedback_invariant",
        "module": None,
        "callable": None,
        "scope": "processor",
        "enabled": True,
        "config": {"hours": 24},
    },
    {
        "key": "empathy.gate_presence",
        "module": "backend.app.gendarme_tests.empathy_gate_presence",
        "callable": "run",
        "scope": "signature",
        "enabled": True,
        "config": {"window_hours": 24},
    },
    {
        "key": "processor.followup_loop_presence",
        "module": "backend.app.gendarme_tests.followup_loop_presence",
        "callable": "run",
        "scope": "processor",
        "enabled": True,
        "config": {"window_hours": 24},
    },
    {
        "key": "p47_webauth_health",
        "module": None,
        "callable": None,
        "scope": "security",
        "enabled": True,
        "config": {},
    },
    {
        "key": "dev_access.health",
        "module": "backend.app.feature_plugins.dev_access_health",
        "callable": "run",
        "scope": "dev_access",
        "enabled": True,
        "config": {},
    },
]


async def main() -> None:
    async with async_session_maker() as db:
        await db.execute(_t(DDL_TABLE))
        await db.execute(_t(DDL_INDEX))
        for row in SEED:
            params = dict(row)
            cfg = params.get("config")
            if isinstance(cfg, (dict, list)):
                params["config"] = json.dumps(cfg)
            elif cfg is None:
                params["config"] = None
            await db.execute(
                _t(
                    """
                    insert into feature_inspectors(key,module,callable,scope,enabled,config)
                    values (:key,:module,:callable,:scope,:enabled,CAST(:config AS jsonb))
                    on conflict (key) do update set scope=EXCLUDED.scope, enabled=EXCLUDED.enabled, updated_at=now()
                    """
                ),
                params,
            )
        await db.commit()
        print("[ensure] feature_inspectors ready")


if __name__ == "__main__":
    asyncio.run(main())


