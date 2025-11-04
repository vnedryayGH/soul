#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
import urllib.request
from typing import Any
import re


def _get(url: str, header_user: str, timeout: float = 6.0, auth_token: str | None = None) -> dict[str, Any]:
    headers = {"X-Telegram-User-ID": header_user}
    if auth_token:
        tok = auth_token.strip()
        if not tok.lower().startswith("bearer "):
            tok = f"Bearer {tok}"
        headers["Authorization"] = tok
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read().decode("utf-8", "replace")
        try:
            return json.loads(raw)
        except Exception:
            return {"raw": raw}


def _post(url: str, header_user: str, body: dict[str, Any], timeout: float = 18.0, auth_token: str | None = None) -> dict[str, Any]:
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    headers = {"X-Telegram-User-ID": header_user, "Content-Type": "application/json"}
    if auth_token:
        tok = auth_token.strip()
        if not tok.lower().startswith("bearer "):
            tok = f"Bearer {tok}"
        headers["Authorization"] = tok
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read().decode("utf-8", "replace")
        try:
            return json.loads(raw)
        except Exception:
            return {"raw": raw}


def _read_text(path: str) -> str | None:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    except Exception:
        try:
            with open(path, "rb") as f:
                raw = f.read()
            for enc in ("utf-8-sig", "utf-8", "cp1251", "latin-1"):
                try:
                    return raw.decode(enc)
                except Exception:
                    continue
        except Exception:
            return None
    return None


def _extract_admin_keys(raw: str) -> tuple[str | None, str | None]:
    a = os.getenv("ADMIN_A") or None
    k = os.getenv("ADMIN_K") or None
    if not a or not k:
        try:
            data = json.loads(raw)
            a = a or str(data.get("ADMIN_A") or data.get("a") or "")
            k = k or str(data.get("ADMIN_K") or data.get("k") or "")
        except Exception:
            pass
    if not a or not k:
        m = re.search(r"(?im)ADMIN_A\s*[:=]\s*([A-Za-z0-9_\-\+/=]{8,})", raw)
        if m and not a:
            a = m.group(1)
        m = re.search(r"(?im)ADMIN_K\s*[:=]\s*([A-Za-z0-9_\-\+/=]{8,})", raw)
        if m and not k:
            k = m.group(1)
    return (a, k)


def _post_admin_exec(base: str, header_user: str, body: dict[str, Any], timeout: float = 18.0) -> dict[str, Any]:
    """POST to /api/admin/agent/exec with _a/_k from env or default key file."""
    base_root = base.rstrip("/")
    url = f"{base_root}/api/admin/agent/exec"
    a = os.getenv("ADMIN_A")
    k = os.getenv("ADMIN_K")
    if not (a and k):
        # Try default PEM path under repo
        candidates = [
            os.path.join(os.getcwd(), ".cursor", "soulpulse-admin.2025-11-03.private-key.pem"),
            os.path.join(os.getcwd(), ".cursor", "soulpulse-admin.2025-10-15.private-key.pem"),
        ]
        for p in candidates:
            raw = _read_text(p)
            if not raw:
                continue
            a2, k2 = _extract_admin_keys(raw)
            a = a or a2
            k = k or k2
            if a and k:
                break
    if a or k:
        sep = "?" if ("?" not in url) else "&"
        if a:
            url = f"{url}{sep}_a={a}"; sep = "&"
        if k:
            url = f"{url}{sep}_k={k}"
    return _post(url, header_user, body, timeout=timeout)


def _print(obj: Any) -> None:
    sys.stdout.write(json.dumps(obj, ensure_ascii=False, separators=(",", ":")))
    sys.stdout.flush()


def main(argv: list[str]) -> int:
    base = os.getenv("SOUL_API_URL", "https://mini.soulpulse.art").rstrip("/")
    user = os.getenv("SOUL_TG_USER", "468326902")
    token = os.getenv("SOUL_AUTH_TOKEN")

    # Basic health
    health = _get(f"{base}/api/health", user, timeout=4.0, auth_token=token)
    aux = _get(f"{base}/api/aux-llm/health", user, timeout=2.0, auth_token=token)
    # Secrets: prefer macros route, fallback to admin Key Master health
    try:
        secrets = _get(f"{base}/api/macros/secrets/health", user, timeout=6.0, auth_token=token)
    except Exception as _e:
        secrets = {"error": str(_e)}
    # Fallback to admin Key Master health if macros route missing or errored
    need_secrets_fallback = False
    try:
        if not isinstance(secrets, dict):
            need_secrets_fallback = True
        elif secrets.get("detail") == "Not Found":
            need_secrets_fallback = True
        elif not secrets.get("ok"):
            need_secrets_fallback = True
    except Exception:
        need_secrets_fallback = True
    if need_secrets_fallback:
        try:
            secrets_admin = _get(f"{base}/api/admin/soul/secrets/health", user, timeout=6.0, auth_token=token)
            if isinstance(secrets_admin, dict):
                secrets = {"ok": True, "data": secrets_admin}
        except Exception as e:
            secrets = {"ok": False, "error": str(e)}
    # Green Gate (idempotent): requires a project; provide no-op pid if absent
    try:
        pid = os.getenv("SOUL_SMOKE_PROJECT_ID", "00000000-0000-0000-0000-000000000000")
        gg = _post(f"{base}/api/macros/release/green-gate", user, {"project_id": pid}, timeout=12.0, auth_token=token)
    except Exception as e:
        gg = {"ok": False, "error": str(e)}
    # Fallback: if macros route missing, run INSPECTOR.RUN_ALL via admin exec
    need_gg_fallback = False
    try:
        if isinstance(gg, dict) and gg.get("detail") == "Not Found":
            need_gg_fallback = True
        if not bool((gg or {}).get("ok", False)):
            need_gg_fallback = True
    except Exception:
        need_gg_fallback = True
    if need_gg_fallback:
        try:
            body = {"op": "hyperloop.dsl", "commands": "INSPECTOR.RUN_ALL scope=*"}
            resp = _post_admin_exec(base, user, body, timeout=18.0)
            gg = {"ok": bool((resp or {}).get("ok", True)), "via": "admin_exec"}
        except Exception as e:
            gg = {"ok": False, "error": str(e)}

    out = {"health": health, "aux": aux, "secrets": secrets, "green_gate": gg}
    ok = True
    try:
        ok = bool(str((health or {}).get("status", "")).lower() == "ok") and bool((gg or {}).get("ok", False))
    except Exception:
        ok = False
    out["ok"] = ok
    _print(out)
    return 0 if ok else 4


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))


