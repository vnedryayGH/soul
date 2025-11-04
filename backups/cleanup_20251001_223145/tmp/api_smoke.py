#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import sys
from typing import Any, Dict, Optional

import requests


BASE = "http://127.0.0.1:8000/api"
H = {"X-Telegram-User-ID": "468326902", "Content-Type": "application/json"}


def post_json(path: str, payload: Dict[str, Any], timeout: float = 90.0) -> Dict[str, Any]:
    try:
        r = requests.post(f"{BASE}{path}", headers=H, data=json.dumps(payload, ensure_ascii=False).encode("utf-8"), timeout=timeout)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": f"{type(e).__name__}: {e}", "status_code": getattr(e, 'response', None).status_code if hasattr(e, 'response') and e.response is not None else None, "text": getattr(e, 'response', None).text if hasattr(e, 'response') and e.response is not None else None}


def main() -> None:
    out: Dict[str, Any] = {}

    # Batch stateless
    out["batch"] = post_json("/soul/process_batch", {"input_text": "batch stateless", "num_quants": 2, "persist_all": False})

    # Single
    out["single"] = post_json("/soul/process", {"input_text": "single test", "num_candidates": 1})

    # Single with desired_action sanity
    out["single_da"] = post_json(
        "/soul/process",
        {
            "input_text": "P07: desired_action: [{\"type\":\"reminder\",\"text\":\"Позвонить маме\",\"when\":\"2025-09-15T10:00:00Z\"}]",
            "num_candidates": 1,
        },
    )

    # Hyperloop CORE.PIPELINE.RUN WITH TRACE
    out["hyperloop_run"] = post_json("/hyperloop/execute", {"commands": "CORE.PIPELINE.RUN input_text=\"health check\" WITH TRACE"})

    # Extract trace_id
    trace_id: Optional[str] = None
    try:
        res0 = (out.get("hyperloop_run", {}).get("results") or [{}])[0]
        trace_id = (res0.get("data") or {}).get("trace_id") or (out.get("hyperloop_run", {}).get("signature") or {}).get("trace_id")
    except Exception:
        trace_id = None

    # TRACE.STEPS if we have trace_id
    if trace_id:
        out["trace_steps"] = post_json("/hyperloop/execute", {"commands": f"TRACE.STEPS trace_id=\"{trace_id}\""})
    else:
        out["trace_steps"] = {"note": "no trace_id returned"}

    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()


