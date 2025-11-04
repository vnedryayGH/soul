#!/usr/bin/env python3
"""
Hyperloop DSL CLI (PowerShell-agnostic)

- Sends a single-line DSL command to Hyperloop API with safe JSON encoding
- Optional macros for frequent commands (claim/release/connect/ping branch)
- Heuristic syntax sanitation and logical fixes of common DSL mistakes
- Preflight channel stability checks (health, db check, pipeline trace)
- Optional HTTP GET helper with required header
- Prints RAW JSON response only (no extra logs) unless fatal error

Usage examples:
  python Soul/scripts/hyperloop_cli.py --claim-branch \
    --owner 468326902 --branch ops-prod-stabilization --topic prod_checks --session dev-001

  python Soul/scripts/hyperloop_cli.py --dsl "INSPECTOR.RUN key=planning.enforce"

  # Pass DSL without wrapping the whole command in quotes; --dsl should be last
  python Soul/scripts/hyperloop_cli.py --dsl CORE.PIPELINE.RUN input_text="health check" WITH TRACE

  python Soul/scripts/hyperloop_cli.py --preflight

  # HTTP POST helpers
  python Soul/scripts/hyperloop_cli.py --http-post https://mini.soulpulse.art/api/hyperloop/execute --post-json '{"commands":"INSPECTOR.RUN key=planning.enforce"}'
  python Soul/scripts/hyperloop_cli.py --http-post https://mini.soulpulse.art/api/hyperloop/execute --post-json-file body.json
  # Remainder JSON (place last):
  # PowerShell: лучше использовать файл или экранировать двойные кавычки
  python Soul/scripts/hyperloop_cli.py --http-post https://mini.soulpulse.art/api/hyperloop/execute --post-json-rem {"commands":"CORE.PIPELINE.RUN input_text=\"health check\" WITH TRACE"}

  python Soul/scripts/hyperloop_cli.py --connect --owner 468326902 --branch ops-prod-stabilization

Safe usage notes (quoting & URL params):
- DO NOT hand-craft URLs with '&' in PowerShell/SSH one-liners — '&' is the background operator.
- Prefer this CLI helpers/macros instead of raw curl. They build URLs with urlencode and add headers safely:
  - Set setting KV safely:  python Soul/scripts/hyperloop_cli.py --set-kv --kv-key emergency.mode.enabled --kv-value true
  - Get setting KV safely:  python Soul/scripts/hyperloop_cli.py --get-kv --kv-key processor.enabled
  - Processor once loop:    python Soul/scripts/hyperloop_cli.py --proc-once --count 20 --interval-s 1.7
- If you still need raw curl, wrap the entire URL in single quotes on remote bash and avoid '&' splitting; or split into separate commands.

Notes:
- Defaults to PROD API and required header X-Telegram-User-ID
- Use --dry-run to view the exact JSON body without sending
 - --dsl captures the remainder of the command line; place it last
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request
import urllib.error
from dataclasses import dataclass
import os
from typing import Optional, List, Dict, Any
import urllib.parse as _urlparse
import re
import base64
import time
import gzip
import hashlib


# Allow container-friendly overrides via environment
DEFAULT_API_URL = os.getenv("HL_API_URL", "https://mini.soulpulse.art/api")
DEFAULT_TELEGRAM_USER_ID = os.getenv("HL_USER_ID", "468326902")


def _print_raw_json(data: object) -> None:
    """Print JSON minified to stdout only (no extra logs)."""
    sys.stdout.write(json.dumps(data, ensure_ascii=False, separators=(",", ":")))


def _print_raw_text(text: str) -> None:
    sys.stdout.write(text)


def _read_file_text(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def _collapse_whitespace(s: str) -> str:
    return " ".join(s.split())


def _normalize_quotes(s: str) -> str:
    # Replace common curly quotes with straight quotes
    return (
        s.replace("\u201C", '"')
         .replace("\u201D", '"')
         .replace("\u2018", "'")
         .replace("\u2019", "'")
    )


@dataclass
class DslFixResult:
    original: str
    fixed: str


class DslFixer:
    """Heuristics to make DSL safer before sending.

    We avoid destructive changes; only normalize common pitfalls
    that break JSON-boundaries in shells.
    """

    KNOWN_KEYS_REQUIRE_QUOTES = {
        "owner",
        "branch",
        "topic",
        "session",
        "project_id",
        "plan_id",
        "id",
        "predecessor",
        "successor",
        "dep_type",
        "title",
        "from_quant",
        "quant_id",
        "to",
        "to_type",
        "external_id",
        "relation",
        "project",
        # P50 DSL ergonomics
        "source",
        "payload",
        "dedupe_key",
    }

    def fix(self, dsl: str) -> DslFixResult:
        original = dsl
        dsl = dsl.strip("\ufeff\n\r\t ")  # trim + strip BOM if any
        dsl = _normalize_quotes(dsl)
        dsl = _collapse_whitespace(dsl)
        # Critical bypass: do NOT touch commands carrying JSON specs/objects.
        # These tokens are extremely sensitive to quoting and any mutation breaks semantics.
        # - GRAPH.* with spec=...
        # - DB.UPSERT/DB.SEARCH/DB.INSERT with values_json=/values=/where=
        upper = dsl.upper()
        if upper.startswith("GRAPH.") or "SPEC=" in upper or "DB.UPSERT" in upper or "VALUES_JSON=" in upper or " WHERE=" in upper or "VALUES=" in upper:
            # Return as-is after whitespace normalization only
            return DslFixResult(original=original, fixed=dsl)
        # Ensure single-line
        dsl = dsl.replace("\n", " ").replace("\r", " ")
        dsl = self._logical_pairs_fix(dsl)
        # Avoid mutating payload/spec JSON blobs entirely. If users provided payload "...",
        # the server can accept it; mutating here risks corruption across shells.
        return DslFixResult(original=original, fixed=dsl)

    def _logical_pairs_fix(self, dsl: str) -> str:
        # Convert patterns like: owner 468326902 → owner="468326902"
        # And ensure quotes for known keys when value has non-word chars or key is in known set
        tokens: List[str] = dsl.split(" ")
        out: List[str] = []
        i = 0
        import re as _re
        STOP_WORDS = {"WITH", "DRY_RUN", "EXPECT"}
        while i < len(tokens):
            tok = tokens[i]
            if tok in self.KNOWN_KEYS_REQUIRE_QUOTES and i + 1 < len(tokens):
                nxt = tokens[i + 1]
                if "=" not in nxt and not tok.endswith("="):
                    # Special handling for payload: capture a span until next key=value or stop word
                    if tok == "payload":
                        j = i + 1
                        buf: List[str] = []
                        while j < len(tokens):
                            t = tokens[j]
                            if t.upper() in STOP_WORDS:
                                break
                            if t in self.KNOWN_KEYS_REQUIRE_QUOTES:
                                break
                            if _re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", t):
                                break
                            buf.append(t)
                            j += 1
                        val = " ".join(buf).strip()
                        out.append(f"payload=\"{val}\"")
                        i = j
                        continue
                    # Generic: single-token value
                    val = nxt.strip()
                    out.append(f"{tok}=\"{val}\"")
                    i += 2
                    continue
            if "=" in tok:
                key, _, val = tok.partition("=")
                if key in self.KNOWN_KEYS_REQUIRE_QUOTES and not (val.startswith('"') and val.endswith('"')):
                    # Quote value if not already quoted
                    tok = f"{key}=\"{val}\""
            out.append(tok)
            i += 1
        fixed = " ".join(out)
        # Normalize WITH TRACE capitalization
        fixed = fixed.replace(" with trace", " WITH TRACE").replace(" With Trace", " WITH TRACE")
        # PowerShell escape cleanup: strip stray backslashes before closing quotes for known string keys
        # Example seen: input_text=\"\" → ensure becomes input_text=""
        fixed = re.sub(r"(\binput_text=)\\\"\\\"", r"\\1\"\"", fixed)
        fixed = re.sub(r"(\btitle=)\\\"(.*?)\\\"", r"\\1\"\\2\"", fixed)
        # Handle pattern like input_text=" \" or input_text=\" \" → normalize to empty
        fixed = re.sub(r"(\binput_text=)\"\s*\\?\"", r"\\1\"\"", fixed)
        # Ensure balanced quotes for input_text when empty space sneaks in
        if re.search(r"\binput_text=\"\\$", fixed):
            fixed = re.sub(r"\binput_text=\"\\$", 'input_text=""', fixed)
        # New: normalize resolution/root_cause quoting safely
        for k in ("resolution", "root_cause"):
            try:
                pattern = rf"(\b{k}=)([^\s\"]\S*|\".*?\")"
                def _q(m: re.Match) -> str:
                    prefix, val = m.group(1), m.group(2)
                    if val.startswith('"') and val.endswith('"'):
                        return prefix + val
                    return prefix + '"' + val.replace('"', '\\"') + '"'
                fixed = re.sub(pattern, _q, fixed)
            except Exception:
                pass
        return fixed


def build_claim_branch_dsl(owner: str, branch: str, topic: Optional[str], session: str) -> str:
    parts = [
        "INSPECTOR.RUN",
        "key=plan.branch",
        "action=claim_branch",
        f"owner=\"{owner}\"",
        f"branch=\"{branch}\"",
        f"session=\"{session}\"",
    ]
    if topic:
        parts.insert(5, f"topic=\"{topic}\"")
    return " ".join(parts)


def build_release_branch_dsl(owner: str, branch: str, session: str) -> str:
    parts = [
        "INSPECTOR.RUN",
        "key=plan.branch",
        "action=release_branch",
        f"owner=\"{owner}\"",
        f"branch=\"{branch}\"",
        f"session=\"{session}\"",
    ]
    return " ".join(parts)


def build_dev_connect_dsl(owner: str, branch: str) -> str:
    return f'DEV.CONNECT owner="{owner}" branch="{branch}"'


def build_session_ping_dsl(owner: str, session: str) -> str:
    return f'SESSION.PING owner="{owner}" session="{session}"'


def send_hyperloop_request(
    api_url: str,
    telegram_user_id: str,
    dsl: str,
    timeout: float,
    options: Optional[Dict[str, Any]] = None,
    auth_token: Optional[str] = None,
    retries: int = 0,
    backoff_ms: int = 250,
) -> object:
    # Use base64 for Unicode/complex DSL to avoid shell/quoting issues
    body_obj: Dict[str, Any] = {}
    try:
        needs_b64 = any(ord(ch) > 127 for ch in dsl)
    except Exception:
        needs_b64 = True
    if needs_b64:
        body_obj["commands_b64"] = base64.b64encode(dsl.encode("utf-8")).decode("ascii")
    else:
        body_obj["commands"] = dsl
    if options is not None:
        body_obj["options"] = options
    # Delegate to resilient POST with retries on 502/504
    return http_post_with_retry(
        url=(api_url.rstrip("/") + "/hyperloop/execute"),
        telegram_user_id=telegram_user_id,
        timeout=timeout,
        json_body=body_obj,
        auth_token=auth_token,
        retries=max(0, int(retries)),
        backoff_ms=max(100, int(backoff_ms)),
    )


def http_get_with_header(url: str, telegram_user_id: str, timeout: float, auth_token: Optional[str] = None) -> object:
    headers = {"X-Telegram-User-ID": telegram_user_id}
    if auth_token:
        token = auth_token.strip()
        if not token.lower().startswith("bearer "):
            token = f"Bearer {token}"
        headers["Authorization"] = token
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            resp_bytes = resp.read()
            try:
                return json.loads(resp_bytes.decode("utf-8", errors="replace"))
            except json.JSONDecodeError:
                return {"raw": resp_bytes.decode("utf-8", errors="replace")}
    except urllib.error.HTTPError as e:
        payload = e.read().decode("utf-8", errors="replace")
        try:
            return json.loads(payload)
        except json.JSONDecodeError:
            return {"error": {"status": e.code, "body": payload}}
    except urllib.error.URLError as e:
        return {"error": {"reason": str(e.reason)}}


def http_post_with_header(url: str, telegram_user_id: str, timeout: float, json_body: Optional[Dict[str, Any]] = None, auth_token: Optional[str] = None) -> object:
    data = None
    headers = {"X-Telegram-User-ID": telegram_user_id, "Content-Type": "application/json"}
    if auth_token:
        token = auth_token.strip()
        if not token.lower().startswith("bearer "):
            token = f"Bearer {token}"
        headers["Authorization"] = token
    if json_body is not None:
        data = json.dumps(json_body, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            resp_bytes = resp.read()
            try:
                return json.loads(resp_bytes.decode("utf-8", errors="replace"))
            except json.JSONDecodeError:
                return {"raw": resp_bytes.decode("utf-8", errors="replace")}
    except urllib.error.HTTPError as e:
        payload = e.read().decode("utf-8", errors="replace")
        try:
            return json.loads(payload)
        except json.JSONDecodeError:
            return {"error": {"status": e.code, "body": payload}}
    except urllib.error.URLError as e:
        return {"error": {"reason": str(e.reason)}}


def http_post_with_retry(url: str, telegram_user_id: str, timeout: float, json_body: Optional[Dict[str, Any]] = None, auth_token: Optional[str] = None, retries: int = 0, backoff_ms: int = 250) -> object:
    attempt = 0
    wait = max(0, int(backoff_ms)) / 1000.0
    while True:
        res = http_post_with_header(url, telegram_user_id, timeout, json_body, auth_token)
        if isinstance(res, dict) and "error" in res:
            err = res["error"]
            status = 0
            if isinstance(err, dict):
                status = int(err.get("status", 0) or 0)
            if attempt < retries and status in (502, 504):
                time.sleep(wait)
                attempt += 1
                wait *= 2
                continue
        return res


def run_preflight(api_url: str, telegram_user_id: str, timeout: float, auth_token: Optional[str] = None) -> object:
    results = {}
    results["health"] = http_get_with_header("https://mini.soulpulse.art/api/health", telegram_user_id, timeout, auth_token)
    results["db_check"] = http_get_with_header("https://mini.soulpulse.art/api/admin/soul/db/check", telegram_user_id, timeout, auth_token)
    # Pipeline smoke
    fixer = DslFixer()
    dsl = fixer.fix('CORE.PIPELINE.RUN input_text="health check" WITH TRACE').fixed
    results["pipeline"] = send_hyperloop_request(api_url, telegram_user_id, dsl, timeout, auth_token=auth_token)
    return results


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(add_help=True)
    group_macro = parser.add_mutually_exclusive_group()
    group_macro.add_argument("--claim-branch", action="store_true", help="Macro: claim a plan branch")
    group_macro.add_argument("--release-branch", action="store_true", help="Macro: release a plan branch")
    group_macro.add_argument("--connect", action="store_true", help="Macro: DEV.CONNECT to a branch")
    group_macro.add_argument("--ping", action="store_true", help="Macro: SESSION.PING")
    group_macro.add_argument("--optimize", action="store_true", help="Macro: run advanced optimization (apply=false)")
    group_macro.add_argument("--optimize-apply", action="store_true", help="Macro: run advanced optimization (apply=true)")
    group_macro.add_argument("--harvest", action="store_true", help="Macro: run harvest endpoint (optionally debug)")
    # Admin safety macros (quote-free): settings KV and processor helpers
    group_macro.add_argument("--set-kv", action="store_true", help="Admin: set setting via /api/admin/soul/settings/set_kv (URL encoded)")
    group_macro.add_argument("--get-kv", action="store_true", help="Admin: get setting via /api/admin/soul/settings/get_kv (URL encoded)")
    group_macro.add_argument("--proc-once", action="store_true", help="Admin: call /api/admin/soul/processor/process_once in a safe loop")
    group_macro.add_argument("--proc-analyze", action="store_true", help="Admin: ANALYZE processor_events (diagnostics/analyze)")
    # GitHub Proxy helpers (safe, no shell quoting issues)
    group_macro.add_argument("--github-proxy", action="store_true", help="Call /api/admin/github/proxy_simple with method/path/DRY_RUN")
    group_macro.add_argument("--github-health", action="store_true", help="GET /api/admin/github/health")
    group_macro.add_argument("--proc-queue-indexes", action="store_true", help="Admin: List queue indexes (diagnostics/queue_indexes)")
    group_macro.add_argument("--proc-queue-explain", action="store_true", help="Admin: EXPLAIN read plan (diagnostics/queue_explain)")
    group_macro.add_argument("--proc-requeue", action="store_true", help="Admin: Requeue dispatched → pending (requeue/dispatched)")
    group_macro.add_argument("--secret-handle-issue", action="store_true", help="Admin: issue ephemeral secret handle (key, ttl_sec, scope)")
    group_macro.add_argument("--secret-handle-invalidate", action="store_true", help="Admin: invalidate ephemeral secret handle (handle)")
    # Embeddings helpers (avoid shell quoting issues by building JSON inside CLI)
    group_macro.add_argument("--emb-search", action="store_true", help="Macro: embeddings/search (builds JSON body internally)")
    group_macro.add_argument("--emb-upsert", action="store_true", help="Macro: embeddings/upsert (builds JSON body internally)")
    group_macro.add_argument("--emb-analyze", action="store_true", help="Macro: embeddings/analyze (ANALYZE table, optional lists param)")
    # P63: Secrets convenience (safe b64/json without shell quoting)
    group_macro.add_argument("--secrets-set-b64", action="store_true", help="Admin: POST /api/admin/soul/secrets/set_b64 {key,value_b64}")
    group_macro.add_argument("--secrets-set-json", action="store_true", help="Admin: POST /api/admin/soul/secrets/set with JSON file {key,value}")

    parser.add_argument("--owner", type=str, default=DEFAULT_TELEGRAM_USER_ID, help="Telegram user id for macros and header")
    parser.add_argument("--branch", type=str, help="Branch key for claim/release macros")
    parser.add_argument("--topic", type=str, default=None, help="Topic for claim macro")
    parser.add_argument("--session", type=str, default="dev-001", help="Session id for claim/release macros")
    # Admin macro args
    parser.add_argument("--kv-key", type=str, default=None, help="Key for --set-kv/--get-kv macros")
    parser.add_argument("--kv-value", type=str, default=None, help="Value for --set-kv macro")
    parser.add_argument("--count", type=int, default=1, help="Repeat count for --proc-once")
    parser.add_argument("--interval-s", type=float, default=1.7, help="Sleep interval seconds between calls for --proc-once")
    parser.add_argument("--proc-limit", type=int, default=50000, help="Limit for --proc-requeue (default 50000)")
    parser.add_argument("--proc-older-than-sec", type=int, default=60, help="Age filter for --proc-requeue (seconds)")
    parser.add_argument("--secret-key", type=str, default=None, help="Secret key for --secret-handle-issue")
    parser.add_argument("--ttl-sec", type=int, default=300, help="TTL seconds for --secret-handle-issue (default 300)")
    parser.add_argument("--scope", type=str, default=None, help="Optional scope for --secret-handle-issue (e.g., github)")
    parser.add_argument("--handle", type=str, default=None, help="Handle for --secret-handle-invalidate")
    parser.add_argument("--proc-plan-limit", type=int, default=50, help="Limit rows for --proc-queue-explain")
    # P63 secrets helpers
    parser.add_argument("--secret-b64", type=str, default=None, help="Base64 value for --secrets-set-b64")
    parser.add_argument("--secrets-json-file", type=str, default=None, help="Path to JSON file for --secrets-set-json (expects {key,value})")

    # --dsl captures the remainder of the command line to allow tokens like WITH TRACE
    # Place --dsl as the last option in the command invocation
    parser.add_argument("--dsl", nargs=argparse.REMAINDER, help="Raw DSL command to send (place last; captures remainder)")
    # Renamed to avoid conflicts on some environments where --file may be pre-registered
    parser.add_argument("--dsl-file", dest="dsl_file", type=str, help="Path to a file containing DSL command")
    parser.add_argument("--dsl-b64", type=str, help="Base64-encoded DSL string (safest against shell quoting)")
    # Strict JSON path (avoids shell quoting issues):
    parser.add_argument("--commands", type=str, help="Send 'commands' string as-is without sanitation")
    parser.add_argument("--commands-file", type=str, help="Read exact 'commands' string from a UTF-8 file")
    parser.add_argument("--options-json", type=str, help="JSON for 'options' to include into request body")
    parser.add_argument("--options-json-file", type=str, help="Path to JSON file for 'options'")

    parser.add_argument("--api-url", type=str, default=DEFAULT_API_URL, help="Base API URL, e.g., https://mini.soulpulse.art/api")
    parser.add_argument("--telegram-user-id", type=str, default=DEFAULT_TELEGRAM_USER_ID, help="Header X-Telegram-User-ID value")
    parser.add_argument("--timeout", type=float, default=30.0, help="HTTP timeout seconds")
    parser.add_argument("--auth-token", type=str, default=None, help="Authorization Bearer token (or raw token); can be set via SOUL_AUTH_TOKEN env var")
    # RS backpressure/429 auto-retry
    parser.add_argument("--rs-retry", type=int, default=0, help="Auto-retry count on RS backpressure (429)")
    parser.add_argument("--rs-backoff-ms", type=int, default=200, help="Initial backoff in ms for RS retries (exponential)")
    # Gateway 5xx retries
    parser.add_argument("--gw-retry", type=int, default=2, help="Auto-retry count on gateway 5xx (502/504)")
    parser.add_argument("--gw-backoff-ms", type=int, default=250, help="Initial backoff in ms for gateway retries (exponential)")

    parser.add_argument("--dry-run", action="store_true", help="Do not send; print the JSON body only")
    parser.add_argument("--no-fix", action="store_true", help="Disable heuristic DSL sanitation")
    parser.add_argument("--preflight", action="store_true", help="Run channel stability checks (health, db check, pipeline trace)")
    parser.add_argument("--find-quant", action="store_true", help="Resolve a valid quant id and print it (JSON)")
    parser.add_argument("--find-quant-limit", type=int, default=1, help="How many items to fetch from sanity endpoint")
    parser.add_argument("--http-get", type=str, help="Perform HTTP GET to the given URL with required header")
    parser.add_argument("--http-post", type=str, help="Perform HTTP POST to the given URL with required header")
    parser.add_argument("--post-json", type=str, help="Optional JSON body for --http-post (string)")
    parser.add_argument("--post-json-file", type=str, help="Path to JSON file for --http-post body (safer for shells)")
    # Remainder mode for POST JSON: everything after this flag is joined into a single string
    parser.add_argument("--post-json-rem", nargs=argparse.REMAINDER, help="JSON body from remainder; place last after --http-post")
    # Optimization/Harvest specific options
    parser.add_argument("--opt-domain", type=str, help="Optimization domain key (e.g., sleep, quant_selection, weight_balancing, all)")
    parser.add_argument("--opt-params", type=str, help="Additional JSON parameters for optimization body (stringified JSON)")
    parser.add_argument("--force", action="store_true", help="Force optimization for domain (force_optimization=true)")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode for certain macros (e.g., harvest)")

    # GitHub proxy args
    parser.add_argument("--gh-method", type=str, default=None, help="GitHub method for --github-proxy: GET|POST|PUT|PATCH|DELETE")
    parser.add_argument("--gh-path", type=str, default=None, help="GitHub API path starting with / e.g. /app/installations/<id>/access_tokens")
    parser.add_argument("--gh-dry", action="store_true", help="DRY_RUN for --github-proxy (no external call)")
    parser.add_argument("--gh-body", type=str, default=None, help="Optional JSON body string for --github-proxy")

    # Embeddings common options
    parser.add_argument("--emb-model", type=str, default="bge-large-v1.5", help="Embeddings model key (default: bge-large-v1.5)")
    parser.add_argument("--emb-top-k", type=int, default=3, help="Top-K for embeddings/search (default: 3)")
    parser.add_argument("--emb-quant-id", type=str, default=None, help="Quant UUID for embeddings/upsert")
    parser.add_argument("--emb-vec-file", type=str, default=None, help="Path to JSON file with embedding array (list[float])")
    parser.add_argument("--emb-dim", type=int, default=1024, help="Embedding dimension when synthesizing vectors (default: 1024)")
    parser.add_argument("--emb-vec-zeros", action="store_true", help="Use zero vector (fast route smoke); otherwise a tiny non-zero probe is generated")
    parser.add_argument("--emb-lists", type=int, default=None, help="Optional ivfflat lists setting for embeddings/analyze")

    # Signed-first options
    parser.add_argument("--signed", action="store_true", help="Use signed path /hyperloop/execute-signed")
    parser.add_argument("--key-id", type=str, default="api", help="Key id for v2 signed header (X-Sign-Key-Id)")
    parser.add_argument("--idempotency-key", type=str, default=None, help="Idempotency key for v2")
    parser.add_argument("--gzip", action="store_true", help="Compress body with gzip (v2)")
    parser.add_argument("--accept-v1", action="store_true", help="Force v1 signed body (fallback)")
    # New DX flags
    parser.add_argument("--v2-only", action="store_true", help="Send only v2 signed (no v1 fallback)")
    parser.add_argument("--print-trace-id", action="store_true", help="Print trace_id when present in response")
    parser.add_argument("--save-raw", type=str, default=None, help="Save raw response JSON to path")
    parser.add_argument("--dry-run-digest", action="store_true", help="Print v2 body digest and signature without sending")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)

    # HTTP GET helper & preflight & quant-find first as they don't need DSL
    # Resolve auth token from args or env
    auth_token: Optional[str] = args.auth_token or os.getenv("SOUL_AUTH_TOKEN")

    if args.http_get:
        res = http_get_with_header(args.http_get, args.telegram_user_id, args.timeout, auth_token)
        _print_raw_json(res)
        return 0

    if args.http_post:
        body = None
        if args.post_json_rem is not None:
            if len(args.post_json_rem) == 0:
                _print_raw_json({"detail": "Empty --post-json-rem; provide JSON after the flag"})
                return 2
            rem = " ".join(args.post_json_rem).strip()
            try:
                body = json.loads(rem)
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --post-json-rem JSON: {e}"})
                return 2
        elif args.post_json_file:
            try:
                raw = _read_file_text(args.post_json_file)
                # Remove UTF-8 BOM if present
                if raw and raw[0] == "\ufeff":
                    raw = raw.lstrip("\ufeff")
                body = json.loads(raw)
            except Exception:
                _print_raw_json({"detail": "Invalid --post-json-file, must be a valid JSON file"})
                return 2
        elif args.post_json:
            try:
                body = json.loads(args.post_json)
            except json.JSONDecodeError:
                _print_raw_json({"detail": "Invalid --post-json, must be JSON string"})
                return 2
        res = http_post_with_header(args.http_post, args.telegram_user_id, args.timeout, body, auth_token)
        _print_raw_json(res)
        return 0

    # GitHub helpers (safe)
    if getattr(args, "github_health", False):
        api = args.api_url.rstrip("/") + "/admin/github/health"
        res = http_get_with_header(api, args.telegram_user_id, args.timeout, auth_token)
        _print_raw_json(res)
        return 0
    if getattr(args, "github_proxy", False):
        if not args.gh_method or not args.gh_path:
            _print_raw_json({"detail": "Missing --gh-method or --gh-path for --github-proxy"})
            return 2
        api = args.api_url.rstrip("/") + "/admin/github/proxy_simple"
        body = {"q_method": str(args.gh_method).upper().strip(), "q_path": str(args.gh_path)}
        if args.gh_dry:
            body["q_dry"] = True
        if args.gh_body:
            try:
                body_json = json.loads(args.gh_body)
                body["body"] = body_json
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --gh-body JSON: {e}"})
                return 2
        res = http_post_with_retry(api, args.telegram_user_id, args.timeout, body, auth_token)
        _print_raw_json(res)
        return 0

    if args.preflight:
        res = run_preflight(api_url=args.api_url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, auth_token=auth_token)
        _print_raw_json(res)
        return 0

    if args.find_quant:
        base = args.api_url.rsplit('/api', 1)[0]
        try:
            res = http_get_with_header(f"{base}/api/admin/soul/qa/quants_sanity?limit={max(1,int(args.find_quant_limit))}", args.telegram_user_id, args.timeout, auth_token)
            items = (res.get("items") if isinstance(res, dict) else None) or []
            out = {"ok": bool(items), "items": items}
            _print_raw_json(out)
        except Exception as e:
            _print_raw_json({"ok": False, "error": str(e)})
        return 0

    # Build DSL / execute macros if requested
    dsl: Optional[str] = None
    raw_options: Optional[Dict[str, Any]] = None
    if args.claim_branch:
        if not args.branch:
            _print_raw_json({"detail": "Missing --branch for --claim-branch"})
            return 2
        dsl = build_claim_branch_dsl(owner=args.owner, branch=args.branch, topic=args.topic, session=args.session)
    elif args.release_branch:
        if not args.branch:
            _print_raw_json({"detail": "Missing --branch for --release-branch"})
            return 2
        dsl = build_release_branch_dsl(owner=args.owner, branch=args.branch, session=args.session)
    elif args.connect:
        if not args.branch:
            _print_raw_json({"detail": "Missing --branch for --connect"})
            return 2
        dsl = build_dev_connect_dsl(owner=args.owner, branch=args.branch)
    elif args.ping:
        dsl = build_session_ping_dsl(owner=args.owner, session=args.session)
    elif args.optimize or args.optimize_apply:
        # Build body: domain required; apply flag when optimize-apply; optional extras
        if not args.opt_domain:
            _print_raw_json({"detail": "Missing --opt-domain for --optimize/--optimize-apply"})
            return 2
        body = {"domain": args.opt_domain}
        if args.optimize_apply:
            body["apply"] = True
        if args.force:
            body["force_optimization"] = True
        if args.opt_params:
            try:
                extra = json.loads(args.opt_params)
                if isinstance(extra, dict):
                    body.update(extra)
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --opt-params JSON: {e}"})
                return 2
        res = http_post_with_header(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/soul/advanced-optimization/optimize",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body=body,
            auth_token=auth_token,
        )
        _print_raw_json(res)
        return 0
    elif args.harvest:
        qs = "?debug=true" if args.debug else ""
        res = http_post_with_header(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/soul/harvest{qs}",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body={},
            auth_token=auth_token,
        )
        _print_raw_json(res)
        return 0
    elif args.emb_search:
        # Build probe vector
        dim = max(1, int(args.emb_dim))
        vec = None
        if args.emb_vec_file:
            try:
                raw = _read_file_text(args.emb_vec_file)
                data = json.loads(raw)
                if isinstance(data, list):
                    vec = data
                else:
                    _print_raw_json({"detail": "--emb-vec-file must contain JSON array"})
                    return 2
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --emb-vec-file: {e}"})
                return 2
        else:
            if args.emb_vec_zeros:
                vec = [0.0] * dim
            else:
                # Tiny non-zero probe (first 10 elements 0.001..0.010) to avoid invalid_probe fast-path
                vec = [0.0] * dim
                for i in range(min(10, dim)):
                    vec[i] = (i + 1) / 1000.0
        body = {
            "model": str(args.emb_model or "bge-large-v1.5").strip(),
            "top_k": max(1, int(args.emb_top_k)),
            "embedding": vec,
        }
        res = http_post_with_retry(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/qlinks/embeddings/search",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body=body,
            auth_token=auth_token,
            retries=max(0, int(args.rs_retry or 0)),
            backoff_ms=max(100, int(args.rs_backoff_ms or 200)),
        )
        _print_raw_json(res)
        return 0
    elif args.emb_upsert:
        # Build upsert vector and payload
        if not args.emb_quant_id:
            _print_raw_json({"detail": "Missing --emb-quant-id for --emb-upsert"})
            return 2
        dim = max(1, int(args.emb_dim))
        vec = None
        if args.emb_vec_file:
            try:
                raw = _read_file_text(args.emb_vec_file)
                data = json.loads(raw)
                if isinstance(data, list):
                    vec = data
                else:
                    _print_raw_json({"detail": "--emb-vec-file must contain JSON array"})
                    return 2
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --emb-vec-file: {e}"})
                return 2
        else:
            if args.emb_vec_zeros:
                vec = [0.0] * dim
            else:
                vec = [0.0] * dim
                for i in range(min(10, dim)):
                    vec[i] = (i + 1) / 1000.0
        body = {
            "model": str(args.emb_model or "bge-large-v1.5").strip(),
            "items": [
                {"quant_id": str(args.emb_quant_id).strip(), "embedding": vec}
            ],
        }
        res = http_post_with_retry(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/qlinks/embeddings/upsert",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body=body,
            auth_token=auth_token,
            retries=max(0, int(args.rs_retry or 0)),
            backoff_ms=max(100, int(args.rs_backoff_ms or 200)),
        )
        _print_raw_json(res)
        return 0
    elif args.emb_analyze:
        body: Dict[str, Any] = {}
        if args.emb_lists is not None:
            try:
                body["lists"] = int(args.emb_lists)
            except Exception:
                _print_raw_json({"detail": "--emb-lists must be integer"})
                return 2
        res = http_post_with_retry(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/qlinks/embeddings/analyze",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body=body,
            auth_token=auth_token,
            retries=max(0, int(args.rs_retry or 0)),
            backoff_ms=max(100, int(args.rs_backoff_ms or 200)),
        )
        _print_raw_json(res)
        return 0
    elif args.set_kv or args.get_kv or args.proc_once or args.proc_analyze or args.proc_queue_indexes or args.proc_queue_explain or args.proc_requeue or args.secrets_set_b64 or args.secrets_set_json:
        base = args.api_url.rsplit('/api', 1)[0]
        if args.set_kv:
            if not args.kv_key:
                _print_raw_json({"detail": "Missing --kv-key for --set-kv"})
                return 2
            if args.kv_value is None:
                _print_raw_json({"detail": "Missing --kv-value for --set-kv"})
                return 2
            qs = _urlparse.urlencode({"key": str(args.kv_key), "value": str(args.kv_value)})
            url = f"{base}/api/admin/soul/settings/set_kv?{qs}"
            res = http_post_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, json_body={})
            _print_raw_json(res)
            return 0
        if args.secrets_set_b64:
            if not args.secret_key or not args.secret_b64:
                _print_raw_json({"detail": "Missing --secret-key or --secret-b64 for --secrets-set-b64"})
                return 2
            url = f"{base}/api/admin/soul/secrets/set_b64"
            body = {"key": str(args.secret_key), "value_b64": str(args.secret_b64)}
            res = http_post_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, json_body=body, auth_token=auth_token)
            _print_raw_json(res)
            return 0
        if args.secrets_set_json:
            if not args.secrets_json_file:
                _print_raw_json({"detail": "Missing --secrets-json-file for --secrets-set-json (JSON with {key,value})"})
                return 2
            try:
                raw = _read_file_text(args.secrets_json_file)
                import json as _json
                body = _json.loads(raw)
                if not isinstance(body, dict) or ("key" not in body) or ("value" not in body):
                    _print_raw_json({"detail": "--file must contain JSON object with {key,value}"})
                    return 2
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --file JSON: {e}"})
                return 2
            url = f"{base}/api/admin/soul/secrets/set"
            res = http_post_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, json_body=body, auth_token=auth_token)
            _print_raw_json(res)
            return 0
        if args.get_kv:
            if not args.kv_key:
                _print_raw_json({"detail": "Missing --kv-key for --get-kv"})
                return 2
            qs = _urlparse.urlencode({"key": str(args.kv_key)})
            url = f"{base}/api/admin/soul/settings/get_kv?{qs}"
            res = http_get_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout)
            _print_raw_json(res)
            return 0
        if args.proc_once:
            url = f"{base}/api/admin/soul/processor/process_once?dry_run=false"
            n = max(1, int(args.count or 1))
            interval = max(0.0, float(args.interval_s or 0.0))
            out: List[Any] = []
            for _ in range(n):
                res = http_post_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, json_body=None)
                out.append(res)
                if interval > 0:
                    time.sleep(interval)
            _print_raw_json({"ok": True, "count": n, "results": out})
            return 0
        if args.proc_analyze:
            url = f"{base}/api/admin/soul/processor/diagnostics/analyze"
            res = http_post_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, json_body={})
            _print_raw_json(res)
            return 0
        if args.proc_queue_indexes:
            url = f"{base}/api/admin/soul/processor/diagnostics/queue_indexes"
            res = http_get_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout)
            _print_raw_json(res)
            return 0
        if args.proc_queue_explain:
            plim = max(1, int(args.proc_plan_limit or 50))
            qs = _urlparse.urlencode({"limit": plim})
            url = f"{base}/api/admin/soul/processor/diagnostics/queue_explain?{qs}"
            res = http_get_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout)
            _print_raw_json(res)
            return 0
        if args.proc_requeue:
            lim = max(1, int(args.proc_limit or 50000))
            older = max(0, int(args.proc_older_than_sec or 0))
            qs = _urlparse.urlencode({"limit": lim, "older_than_sec": older})
            url = f"{base}/api/admin/soul/processor/requeue/dispatched?{qs}"
            res = http_post_with_header(url=url, telegram_user_id=args.telegram_user_id, timeout=args.timeout, json_body={})
            _print_raw_json(res)
            return 0

    # ---- Secret handle macros ----
    if args.secret_handle_issue:
        if not args.secret_key:
            _print_raw_json({"detail": "Missing --secret-key for --secret-handle-issue"})
            return 2
        body = {"key": args.secret_key, "ttl_sec": int(args.ttl_sec or 300)}
        if args.scope:
            body["scope"] = args.scope
        return http_post_with_header(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/soul/secrets/handle/issue",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body=body,
            auth_token=auth_token,
        )
    if args.secret_handle_invalidate:
        if not args.handle:
            _print_raw_json({"detail": "Missing --handle for --secret-handle-invalidate"})
            return 2
        body = {"handle": args.handle}
        return http_post_with_header(
            url=f"{args.api_url.rsplit('/api',1)[0]}/api/admin/soul/secrets/handle/invalidate",
            telegram_user_id=args.telegram_user_id,
            timeout=args.timeout,
            json_body=body,
            auth_token=auth_token,
        )

    if args.commands_file:
        try:
            dsl = _read_file_text(args.commands_file).strip()
        except Exception:
            _print_raw_json({"detail": "Invalid --commands-file; must be a UTF-8 text file"})
            return 2
        if args.options_json:
            try:
                raw_options = json.loads(args.options_json)
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --options-json: {e}"})
                return 2
        elif args.options_json_file:
            try:
                raw = _read_file_text(args.options_json_file)
                raw_options = json.loads(raw)
            except Exception:
                _print_raw_json({"detail": "Invalid --options-json-file, must be a valid JSON file"})
                return 2
    elif args.commands:
        dsl = args.commands.strip()
        if args.options_json:
            try:
                raw_options = json.loads(args.options_json)
            except Exception as e:
                _print_raw_json({"detail": f"Invalid --options-json: {e}"})
                return 2
        elif args.options_json_file:
            try:
                raw = _read_file_text(args.options_json_file)
                raw_options = json.loads(raw)
            except Exception:
                _print_raw_json({"detail": "Invalid --options-json-file, must be a valid JSON file"})
                return 2
    elif args.dsl_b64:
        try:
            dsl = base64.b64decode(args.dsl_b64.encode("utf-8")).decode("utf-8")
        except Exception as e:
            _print_raw_json({"detail": f"Invalid --dsl-b64: {e}"})
            return 2
    elif args.dsl is not None:
        # argparse.REMAINDER returns a list of tokens after --dsl
        if len(args.dsl) == 0:
            _print_raw_json({"detail": "Empty --dsl provided; pass a DSL command after --dsl"})
            return 2
        dsl = " ".join(args.dsl)
    elif args.dsl_file:
        dsl = _read_file_text(args.dsl_file)
    else:
        _print_raw_json({"detail": "Provide --dsl or --dsl-b64 or --file or --commands[(-file)] or a macro (--claim-branch/--release-branch)"})
        return 2

    # Sanitize/normalize DSL unless disabled
    if not args.no_fix and not args.commands:
        fixer = DslFixer()
        dsl = fixer.fix(dsl).fixed
    else:
        dsl = dsl.strip()

    # Dry-run: print the exact JSON body that would be sent
    if args.dry_run:
        _print_raw_json({"commands": dsl})
        return 0

    # First attempt
    # Signed-first route when requested
    if args.signed:
        from Soul.soul_hyperloop import SoulHyperloopClient  # lazy import
        base = args.api_url.rstrip("/")
        client = SoulHyperloopClient(base_api_url=base, telegram_user_id=args.telegram_user_id, timeout=args.timeout)
        if args.accept_v1 and not args.v2_only:
            result = client.execute_signed_v1(commands=dsl, options=raw_options)
        else:
            # Dry-run digest/signature for v2 (without sending)
            if args.dry_run_digest:
                body: Dict[str, Any] = {"commands_b64": base64.b64encode(dsl.encode("utf-8")).decode("ascii")}
                if raw_options is not None:
                    body["options"] = raw_options
                canon_str = json.dumps(body, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
                digest = hashlib.sha256(canon_str.encode("utf-8")).hexdigest()
                env_key = f"HYPERLOOP_KEY_{str(args.key_id or 'api').upper()}"
                key_secret = os.getenv(env_key) or os.getenv("HYPERLOOP_API_SECRET", "")
                try:
                    import hmac as _hmac
                    sig = _hmac.new((key_secret or "").encode("utf-8"), digest.encode("utf-8"), hashlib.sha256).hexdigest()
                except Exception:
                    sig = ""
                _print_raw_json({"body_digest": digest, "signature": sig, "alg": "HMAC-SHA256"})
                return 0
            result = client.execute_signed_v2(
                commands=dsl,
                options=raw_options,
                key_id=str(args.key_id or "api"),
                idempotency_key=(str(args.idempotency_key).strip() if args.idempotency_key else None),
                use_gzip=bool(args.gzip),
            )
    else:
        # Use base API URL; helper appends "/hyperloop/execute" internally
        result = send_hyperloop_request(
            api_url=args.api_url,
            telegram_user_id=args.telegram_user_id,
            dsl=dsl,
            timeout=args.timeout,
            options=raw_options,
            auth_token=auth_token,
            retries=max(0, int(getattr(args, "gw_retry", 0))),
            backoff_ms=max(100, int(getattr(args, "gw_backoff_ms", 250))),
        )
        # Fallback: if endpoint not found (404) or legacy gateway returns {"detail":"Not Found"}, try signed v2
        try:
            should_fallback = False
            if isinstance(result, dict):
                if result.get("detail") == "Not Found":
                    should_fallback = True
                err = result.get("error") if isinstance(result.get("error"), dict) else None
                if err and int(err.get("status") or 0) == 404:
                    should_fallback = True
            if should_fallback:
                from Soul.soul_hyperloop import SoulHyperloopClient  # lazy import
                base = args.api_url.rstrip("/")
                client = SoulHyperloopClient(base_api_url=base, telegram_user_id=args.telegram_user_id, timeout=args.timeout)
                result = client.execute_signed_v2(commands=dsl, options=raw_options, key_id=str(args.key_id or "api"), idempotency_key=(str(args.idempotency_key).strip() if args.idempotency_key else None), use_gzip=bool(args.gzip))
        except Exception:
            pass

    # Optional: print trace_id if requested
    try:
        if args.print_trace_id and isinstance(result, dict):
            tid = result.get("signature") or result.get("signature_saved_steps")
            _print_raw_json({"trace_id": result.get("trace_id"), "signature_saved_steps": tid})
    except Exception:
        pass

    # Save raw if requested
    try:
        if args.save_raw:
            with open(args.save_raw, "w", encoding="utf-8") as f:
                f.write(json.dumps(result, ensure_ascii=False))
    except Exception:
        pass

    # Check for RS backpressure/rate-limit (429) and optionally retry transparently
    try:
        retries = max(0, int(args.rs_retry))
        backoff_ms = max(50, int(args.rs_backoff_ms))
        attempt = 0
        def _is_backpressure(res: Any) -> bool:
            try:
                if isinstance(res, dict):
                    for r in (res.get("results") or []):
                        if isinstance(r, dict) and r.get("command") == "__rs_shadow__":
                            raw = r.get("rs_raw") or {}
                            err = (raw.get("meta") if isinstance(raw, dict) else {}) or {}
                            # Accept both class label and numeric code from RS meta
                            cls = str((err.get("class") or err.get("error") or "")).lower()
                            code = err.get("code")
                            if code == 429:
                                return True
                            if "backpressure" in cls or "security_limits.rate" in cls or "rate" == cls:
                                return True
                    # Also handle top-level HTTP-like structure {error:{status:429}} or similar
                    err_top = res.get("error") or {}
                    status = None
                    if isinstance(err_top, dict):
                        status = err_top.get("status") or err_top.get("code")
                    return status == 429
                return False
            except Exception:
                return False
        while _is_backpressure(result) and attempt < retries:
            import time as _t
            _t.sleep(backoff_ms / 1000.0)
            attempt += 1
            # Exponential backoff
            backoff_ms = min(5000, int(backoff_ms * 2))
            result = send_hyperloop_request(
                api_url=args.api_url,
                telegram_user_id=args.telegram_user_id,
                dsl=dsl,
                timeout=args.timeout,
                options=raw_options,
                auth_token=auth_token,
            )
    except Exception:
        pass
    _print_raw_json(result)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))


