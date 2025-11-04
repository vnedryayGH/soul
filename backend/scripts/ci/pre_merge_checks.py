#!/usr/bin/env python3
"""
Pre-merge checks for SoulPulse:
 - Apply safe flags profile
 - Run INSPECTOR.RUN_ALL (Green Gate)
 - Run Delivery Guard smoke

Exits with non-zero code on failure.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str]) -> tuple[int, str, str]:
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = proc.communicate()
    return proc.returncode, out.strip(), err.strip()


def main() -> int:
    # Resolve repo root by searching upwards for hyperloop_cli.py
    py = sys.executable or "python"
    cli = None
    for parent in Path(__file__).resolve().parents:
        candidate = parent / "tools" / "catalog" / "active" / "utils" / "hyperloop_cli.py"
        if candidate.exists():
            cli = candidate
            break
    if cli is None:
        print("hyperloop_cli.py not found via upward search from this script", file=sys.stderr)
        return 2

    steps = [
        [py, str(cli), "--dsl", "FLAGS.APPLY_PROFILE name=prod_safe"],
        [py, str(cli), "--dsl", "INSPECTOR.RUN_ALL"],
        [py, str(cli), "--dsl", "INSPECTOR.RUN key=delivery_guard.smoke"],
    ]

    for cmd in steps:
        code, out, err = run(cmd)
        # Try to parse JSON to surface status if available
        status = None
        try:
            payload = json.loads(out)
            status = payload.get("status") or payload.get("ok")
            # Treat API errors like {"detail":"Not Found"} as failure
            if isinstance(payload, dict) and payload.get("detail"):
                return 2
        except Exception:
            # Also treat plain-text 'Not Found' as failure
            if out.strip().lower().find("not found") != -1:
                return 2
        print(f"$ {' '.join(cmd)}")
        if out:
            print(out)
        if err:
            print(err, file=sys.stderr)
        if code != 0:
            return code
        if status in (False, "failed", "error"):
            return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())


