#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Helper script to send signed Hyperloop DSL commands with proper UTF-8 payloads.

Usage:
  python tmp/send_signed_utf8_tests.py --key <KEY> --secret <SECRET> [--url https://mini.soulpulse.art/api/hyperloop/execute-signed]

This script posts two commands:
  1) SANITIZER.PREVIEW with Cyrillic and emoji characters
  2) LLM.MIRROR with Cyrillic content to verify end-to-end UTF-8 path
"""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import sys
import time
import urllib.request


def sign_command(key: str, secret: str, commands: str) -> dict:
    """Create signed payload for execute-signed."""
    timestamp = int(time.time())
    message = f"{key}:{timestamp}:{commands}".encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()
    return {"commands": commands, "key": key, "ts": timestamp, "sig": signature}


def post_signed(url: str, payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "X-Telegram-User-ID": "468326902",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", required=True)
    parser.add_argument("--secret", required=True)
    parser.add_argument(
        "--url",
        default="https://mini.soulpulse.art/api/hyperloop/execute-signed",
        help="execute-signed endpoint",
    )
    args = parser.parse_args()

    # 1) SANITIZER.PREVIEW with Cyrillic and emoji
    cmd_preview = 'SANITIZER.PREVIEW text="Привет, проверка UTF-8 — ёлки-палки, 😀"'
    payload1 = sign_command(args.key, args.secret, cmd_preview)
    out1 = post_signed(args.url, payload1)
    try:
        sys.stdout.buffer.write((out1 + "\n").encode("utf-8"))
    except Exception:
        print(out1.encode("utf-8", errors="replace"))

    # 2) LLM.MIRROR with Cyrillic
    cmd_mirror = (
        'LLM.MIRROR owner="468326902" branch="p50-fixes" topic="dev" '
        'user_command="UTF8-тест: ё Ё 😂" agent_reply="Ответ: всё ок — 😀"'
    )
    payload2 = sign_command(args.key, args.secret, cmd_mirror)
    out2 = post_signed(args.url, payload2)
    try:
        sys.stdout.buffer.write((out2 + "\n").encode("utf-8"))
    except Exception:
        print(out2.encode("utf-8", errors="replace"))

    return 0


if __name__ == "__main__":
    sys.exit(main())


