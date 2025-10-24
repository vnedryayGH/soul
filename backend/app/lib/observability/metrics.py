from __future__ import annotations

from typing import Any, Dict, Tuple
import threading

_lock = threading.RLock()

# Simple in-memory metrics store (counters + histograms) for backend-level observability
_counters: Dict[Tuple[str, Tuple[Tuple[str, str], ...]], int] = {}
_histograms: Dict[str, Dict[str, Any]] = {}

_DEFAULT_BUCKETS_MS = [50.0, 100.0, 200.0, 400.0, 800.0, 1500.0, 2500.0, 5000.0]


def _norm_tags(tags: Dict[str, Any] | None) -> Tuple[Tuple[str, str], ...]:
    if not tags:
        return tuple()
    items = []
    for k, v in tags.items():
        try:
            items.append((str(k), str(v)))
        except Exception:
            items.append((str(k), "unknown"))
    items.sort(key=lambda x: x[0])
    return tuple(items)


def incr(name: str, tags: Dict[str, Any] | None = None) -> None:
    key = (str(name), _norm_tags(tags))
    with _lock:
        _counters[key] = _counters.get(key, 0) + 1


def observe(name: str, value: float, tags: Dict[str, Any] | None = None) -> None:
    metric = str(name)
    with _lock:
        h = _histograms.get(metric)
        if h is None:
            # one histogram per metric (labels ignored for simplicity)
            h = {
                "buckets": {b: 0 for b in _DEFAULT_BUCKETS_MS},
                "inf": 0,
                "sum": 0.0,
                "count": 0,
            }
            _histograms[metric] = h
        # update buckets
        x = float(value)
        placed = False
        for b in _DEFAULT_BUCKETS_MS:
            if x <= b:
                h["buckets"][b] = int(h["buckets"].get(b, 0)) + 1
                placed = True
                break
        if not placed:
            h["inf"] = int(h.get("inf", 0)) + 1
        h["sum"] = float(h.get("sum", 0.0)) + x
        h["count"] = int(h.get("count", 0)) + 1


def timing(name: str, value_ms: float, tags: Dict[str, Any] | None = None) -> None:
    observe(name, value_ms, tags)


def p_incr(*_a, **_k):
    return None


def p_observe_ms(*_a, **_k):
    return None


def get_metrics() -> dict:
    # Export a light snapshot for /api/metrics (JSON)
    with _lock:
        counters = [
            {"name": n, "tags": dict(t), "value": v}
            for (n, t), v in _counters.items()
        ]
        hists = {}
        for n, h in _histograms.items():
            hists[n] = {
                "buckets": {str(k): int(v) for k, v in h["buckets"].items()},
                "inf": int(h.get("inf", 0)),
                "sum": float(h.get("sum", 0.0)),
                "count": int(h.get("count", 0)),
            }
        return {"counters": counters, "histograms": hists}


def format_metrics_for_prometheus(_data: dict) -> str:
    lines: list[str] = []
    # Export counters
    with _lock:
        for (name, tags), val in _counters.items():
            label = ""
            if tags:
                label = "{" + ",".join(f"{k}={repr(v)}" for k, v in tags) + "}"
            lines.append(f"# HELP {name} Counter {name}")
            lines.append(f"# TYPE {name} counter")
            lines.append(f"{name}{label} {int(val)}")
        # Export histograms (without additional labels)
        for name, h in _histograms.items():
            lines.append(f"# HELP {name} Histogram of {name}")
            lines.append(f"# TYPE {name} histogram")
            acc = 0
            for b in sorted(h["buckets"].keys()):
                acc += int(h["buckets"][b])
                lines.append(f"{name}_bucket{{le=\"{b}\"}} {acc}")
            lines.append(f"{name}_bucket{{le=\"+Inf\"}} {acc + int(h.get('inf', 0))}")
            lines.append(f"{name}_sum {float(h.get('sum', 0.0))}")
            lines.append(f"{name}_count {int(h.get('count', 0))}")
    return "\n".join(lines) or "# no metrics yet\n"


def get_percentile(*_a, **_k):  # type: ignore
    return 0.0


def get_percentile_by_tag(*_a, **_k):  # type: ignore
    return 0.0


def get_counter_total(name: str) -> int:  # type: ignore
    with _lock:
        total = 0
        for (n, _t), v in _counters.items():
            if n == name:
                total += int(v)
        return total


def get_percentile_all_tags(*_a, **_k):  # type: ignore
    return {}


__all__ = [
    "incr", "observe", "timing", "p_incr", "p_observe_ms",
    "get_metrics", "format_metrics_for_prometheus",
    "get_percentile", "get_percentile_by_tag", "get_counter_total", "get_percentile_all_tags",
]


