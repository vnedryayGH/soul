#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import argparse
import time
import hmac
import hashlib
import json


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", required=True)
    parser.add_argument("--secret", required=True)
    parser.add_argument("--commands-file", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--options-json", required=False, help="Optional JSON string for 'options' field")
    args = parser.parse_args()

    with open(args.commands_file, "r", encoding="utf-8-sig") as f:
        commands = f.read()
    # Удаляем возможный BOM и лишние пробелы/переводы строк
    try:
        commands = commands.replace("\ufeff", "").strip()
    except Exception:
        commands = commands.strip()

    ts = int(time.time())
    msg = f"{args.key}:{ts}:{commands}".encode("utf-8")
    sig = hmac.new(args.secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()

    payload = {
        "commands": commands,
        "key": args.key,
        "ts": ts,
        "sig": sig,
    }
    if args.options_json:
        try:
            opts = json.loads(args.options_json)
            if isinstance(opts, dict):
                payload["options"] = opts
        except Exception:
            pass
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(json.dumps(payload, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


