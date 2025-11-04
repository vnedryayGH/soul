#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, sys, time, json, hmac, hashlib
from urllib import request

ENV_PATH = "/var/www/soulpulse/backend/.env.prod"
API_URL = "http://127.0.0.1:8000/api/hyperloop/execute-signed"

def load_env(path: str) -> dict:
    env = {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                env[k] = v
    except Exception:
        pass
    return env

def main():
    env = load_env(ENV_PATH)
    key = env.get("HYPERLOOP_API_KEY", "")
    secret = env.get("HYPERLOOP_API_SECRET", "")
    if not key or not secret:
        print(json.dumps({"error": "missing hyperloop credentials"}, ensure_ascii=False))
        sys.exit(1)

    commands = "\n".join([
        "TEST.RUN key=p29.pipeline_smoke",
        "TEST.RUN key=p29.judge_charter",
        "TEST.RUN key=p29.processor_cycle",
        "TEST.RUN key=p29.hyperloop_policy_block",
    ])
    ts = int(time.time())
    msg = f"{key}:{ts}:{commands}"
    sig = hmac.new(secret.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).hexdigest()

    payload = {
        "commands": commands,
        "options": {"stop_on_error": True},
        "key": key,
        "ts": ts,
        "sig": sig,
    }

    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = request.Request(API_URL, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            print(body)
    except Exception as e:
        print(json.dumps({"error": str(e)}, ensure_ascii=False))
        sys.exit(2)

if __name__ == "__main__":
    main()


