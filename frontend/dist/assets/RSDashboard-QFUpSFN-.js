import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { H as HyperloopDSLValidator, n as normalizeHyperloopDSL } from "./HyperloopDSLValidator-6JhmY41x.js";
import { l as Space, T as Typography, I as Input, B as Button, p as Tag, F as ForwardTable, s as staticMethods, n as Select } from "./index-B4P9h-k1.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import "./index-BlJydARW.js";
import "./Skeleton-D3e3aC7P.js";
const { Title, Text } = Typography;
const buildAuthHeaders = () => {
  let tgId = null;
  try {
    tgId = sessionStorage.getItem("tg_id");
  } catch (e) {
  }
  return tgId ? { "X-Telegram-User-ID": String(tgId) } : {};
};
const RSDashboard = () => {
  var _a;
  const [loading, setLoading] = reactExports.useState(false);
  const [summary, setSummary] = reactExports.useState(null);
  const [parity, setParity] = reactExports.useState(null);
  const [rawCounters, setRawCounters] = reactExports.useState({});
  const [nightly, setNightly] = reactExports.useState([]);
  const [rawProm, setRawProm] = reactExports.useState("");
  const [errorTop, setErrorTop] = reactExports.useState([]);
  const [profile, setProfile] = reactExports.useState("prod_safe");
  const [reason, setReason] = reactExports.useState("profile switch");
  const [twoKeysId, setTwoKeysId] = reactExports.useState("");
  const [trendSource, setTrendSource] = reactExports.useState("rsbus");
  const [trendKey, setTrendKey] = reactExports.useState("");
  const [autoRefresh, setAutoRefresh] = reactExports.useState(true);
  const [refreshSec, setRefreshSec] = reactExports.useState(5);
  const loadData = async () => {
    var _a2, _b;
    try {
      setLoading(true);
      const h = buildAuthHeaders();
      const dash = await fetch("/api/admin/rs/dashboard/summary", { headers: h });
      if (dash.ok) {
        const d = await dash.json();
        setSummary((d == null ? void 0 : d.p95) || {});
        setRawCounters({ requests: ((_a2 = d == null ? void 0 : d.counters) == null ? void 0 : _a2.rsbus_requests_total) || 0, errors: ((_b = d == null ? void 0 : d.counters) == null ? void 0 : _b.rsbus_errors_total) || 0 });
      }
      const p = await fetch("/api/admin/rs/parity/summary", { headers: h });
      if (p.ok) setParity(await p.json());
      const n = await fetch("/api/admin/rs/nightly/recent?limit=7", { headers: h });
      if (n.ok) {
        const nj = await n.json();
        setNightly((nj == null ? void 0 : nj.items) || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadData();
  }, []);
  reactExports.useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      void loadData();
    }, Math.max(2e3, refreshSec * 1e3));
    return () => clearInterval(t);
  }, [autoRefresh, refreshSec]);
  const loadRawProm = async () => {
    try {
      const resp = await fetch("/api/admin/rs/metrics-raw", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error("raw");
      const data = await resp.json();
      const prom = String(data && (data.prom || data.rs_raw && data.rs_raw.result && data.rs_raw.result.prom) || "");
      setRawProm(prom);
      const map = {};
      for (const line of prom.split("\n")) {
        const m = line.match(/^rsbus_errors_total\{[^}]*class=\"([^\"]+)\"[^}]*\}\s+(\d+)/);
        if (m) {
          const cls = m[1];
          const val = Number(m[2] || 0);
          map[cls] = (map[cls] || 0) + (isFinite(val) ? val : 0);
        }
      }
      const arr = Object.entries(map).map(([cls, count]) => ({ cls, count })).sort((a, b) => b.count - a.count).slice(0, 10);
      setErrorTop(arr);
    } catch (e) {
      staticMethods.error("Не удалось загрузить сырые метрики");
    }
  };
  const runTwoKeysRequest = async () => {
    var _a2;
    try {
      const cmd = `TWO_KEYS.REQUEST operation=FLAGS.APPLY_PROFILE scope="rs.profile" reason="${reason.replace(/\"/g, '\\"')}" ttl_minutes=5`;
      const body = { commands: normalizeHyperloopDSL(cmd) };
      const resp = await fetch("/api/hyperloop/execute", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error("request");
      const data = await resp.json();
      const rid = data && (data.results && data.results[0] && data.results[0].data && data.results[0].data.request_id) || ((_a2 = data == null ? void 0 : data.data) == null ? void 0 : _a2.request_id) || (data == null ? void 0 : data.request_id) || "";
      if (!rid) throw new Error("no id");
      setTwoKeysId(rid);
      staticMethods.success("Заявка создана");
    } catch (e) {
      staticMethods.error("Не удалось создать заявку Two-Keys");
    }
  };
  const runTwoKeysApprove = async () => {
    try {
      if (!twoKeysId) {
        staticMethods.warning("Нет request_id");
        return;
      }
      const cmd = `TWO_KEYS.APPROVE id="${twoKeysId}"`;
      const body = { commands: normalizeHyperloopDSL(cmd) };
      const resp = await fetch("/api/hyperloop/execute", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error("approve");
      staticMethods.success("Заявка одобрена");
    } catch (e) {
      staticMethods.error("Не удалось одобрить заявку");
    }
  };
  const applyProfileWithTwoKeys = async () => {
    try {
      if (!twoKeysId) {
        staticMethods.warning("Нет request_id");
        return;
      }
      const cmd = `FLAGS.APPLY_PROFILE name="${profile}" two_keys_request_id="${twoKeysId}"`;
      const body = { commands: normalizeHyperloopDSL(cmd) };
      const resp = await fetch("/api/hyperloop/execute", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error("apply");
      staticMethods.success(`Профиль ${profile} применён`);
      await loadData();
    } catch (e) {
      staticMethods.error("Не удалось применить профиль");
    }
  };
  const bpTotal = ((_a = summary == null ? void 0 : summary.backpressure) == null ? void 0 : _a.total_hits) || 0;
  const mode = (summary == null ? void 0 : summary.mode) || null;
  const canaryShare = typeof (summary == null ? void 0 : summary.canary_share) === "number" ? summary == null ? void 0 : summary.canary_share : null;
  const rsbusCols = [
    { title: "op", dataIndex: "op" },
    { title: "p50", dataIndex: "p50" },
    { title: "p95", dataIndex: "p95" },
    { title: "p99", dataIndex: "p99" },
    { title: "avg", dataIndex: "avg" },
    { title: "count", dataIndex: "count" },
    { title: "error_rate", dataIndex: "er" },
    { title: "mismatch_rate", dataIndex: "mr" },
    { title: "bp_hits", dataIndex: "bp" }
  ];
  const rsbusData = Object.entries((summary == null ? void 0 : summary.rsbus_latency_ms) || {}).map(([op, vals]) => {
    var _a2, _b, _c, _d, _e, _f, _g;
    return {
      key: op,
      op,
      p50: ((vals == null ? void 0 : vals.p50) || 0).toFixed(2),
      p95: ((vals == null ? void 0 : vals.p95) || 0).toFixed(2),
      p99: ((vals == null ? void 0 : vals.p99) || 0).toFixed(2),
      avg: ((vals == null ? void 0 : vals.avg) || 0).toFixed(2),
      count: Math.round((vals == null ? void 0 : vals.count) || 0),
      er: ((_b = (_a2 = summary == null ? void 0 : summary.error_rate) == null ? void 0 : _a2[op]) != null ? _b : 0).toFixed(3),
      mr: ((_d = (_c = summary == null ? void 0 : summary.mismatch_rate) == null ? void 0 : _c[op]) != null ? _d : 0).toFixed(3),
      bp: Math.round(((_g = (_f = (_e = summary == null ? void 0 : summary.backpressure) == null ? void 0 : _e.per_op) == null ? void 0 : _f[op]) == null ? void 0 : _g.count) || 0)
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 12, style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { margin: 0 }, children: "RS Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: autoRefresh, onChange: setAutoRefresh }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "auto-refresh" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { width: 80 }, value: String(refreshSec), onChange: (e) => {
          const v = Number(e.target.value || 5);
          if (isFinite(v)) setRefreshSec(Math.max(2, Math.min(60, v)));
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadData, loading, children: "Обновить" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [12, 12], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: "Requests total", value: rawCounters.requests || 0 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: "Errors total", value: rawCounters.errors || 0 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: "Backpressure hits", value: bpTotal }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: "Exec mode", valueRender: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: mode || "n/a" }), value: 0 }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [12, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: "Canary share", value: typeof canaryShare === "number" ? (canaryShare * 100).toFixed(0) : "n/a", suffix: "%" }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "rsbus_latency_ms (per op)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { rowKey: (r) => r.key, dataSource: rsbusData, columns: rsbusCols, size: "small", pagination: { pageSize: 8 } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Parity summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap", fontSize: 12 }, children: JSON.stringify(parity || {}, null, 2) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", title: "Nightly RS Reports (last 7)", children: [
      nightly.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { size: "small", rowKey: (r) => r.id, pagination: { pageSize: 5 }, dataSource: nightly, columns: [
        { title: "generated_at", dataIndex: "generated_at", width: 180 },
        { title: "window_days", dataIndex: "window_days", width: 100 },
        { title: "summary keys", key: "sumk", render: (_, r) => Object.keys((r == null ? void 0 : r.summary) || {}).slice(0, 4).join(", ") }
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Нет ночных отчётов" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: async () => {
        try {
          const resp = await fetch("/api/admin/rs/nightly/generate", { method: "POST", headers: buildAuthHeaders() });
          if (!resp.ok) throw new Error();
          staticMethods.success("Nightly report generated");
          await loadData();
        } catch (e) {
          staticMethods.error("Не удалось сгенерировать");
        }
      }, children: "Сгенерировать сейчас" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HyperloopDSLValidator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Профили выполнения (Two-Keys)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            style: { minWidth: 200 },
            value: profile,
            onChange: setProfile,
            options: [
              { label: "prod_safe", value: "prod_safe" },
              { label: "dev_full", value: "dev_full" },
              { label: "rs_canary_profile", value: "rs_canary_profile" }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { minWidth: 260 }, placeholder: "Причина", value: reason, onChange: (e) => setReason(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { minWidth: 320 }, placeholder: "Two-Keys request_id", value: twoKeysId, onChange: (e) => setTwoKeysId(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: runTwoKeysRequest, children: "Создать заявку" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: runTwoKeysApprove, type: "default", children: "Одобрить заявку" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: applyProfileWithTwoKeys, type: "primary", children: "Применить профиль" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Сырые Prometheus метрики", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadRawProm, children: "Загрузить" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Показываем последние собранные RS метрики" })
      ] }),
      rawProm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: 240, overflow: "auto", border: "1px solid var(--sp-border-primary)", borderRadius: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { margin: 0, padding: 8, fontSize: 12 }, children: rawProm }) })
    ] }) }),
    errorTop.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [12, 12], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 14, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Гистограмма ошибок по классам (rsbus_errors_total)", children: (() => {
        const maxCount = Math.max(1, ...errorTop.map((x) => x.count || 0));
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 180, padding: 8, border: "1px dashed var(--sp-border-color, #eee)", borderRadius: 8, overflowX: "auto" }, children: errorTop.map((it, idx) => {
          const h = Math.max(6, Math.round(140 * (it.count || 0) / maxCount));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: `${it.cls}: ${it.count}`, style: { width: 18, height: h, background: "#ff7875", borderRadius: 3 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { maxWidth: 80 }, ellipsis: { tooltip: it.cls }, children: it.cls })
          ] }, it.cls + idx);
        }) });
      })() }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 10, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Топ ошибок по классам (таблица)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          size: "small",
          rowKey: (r) => r.cls,
          dataSource: errorTop,
          pagination: { pageSize: 8 },
          columns: [{ title: "class", dataIndex: "cls" }, { title: "count", dataIndex: "count" }]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Тренды p95/p99 по nightly (за 7 записей)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            style: { minWidth: 180 },
            value: trendSource,
            onChange: setTrendSource,
            options: [
              { label: "rsbus (op)", value: "rsbus" },
              { label: "hyperloop (phase)", value: "hyperloop" }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { minWidth: 280 }, placeholder: trendSource === "rsbus" ? "op (пример: hyperloop.execute)" : "phase (пример: parse|execute)", value: trendKey, onChange: (e) => setTrendKey(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadData, children: "Обновить" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: (() => {
        const items = nightly || [];
        const points95 = [];
        const points99 = [];
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          const sum = (it == null ? void 0 : it.summary) || {};
          let entry = void 0;
          if (trendSource === "rsbus") entry = (sum.rsbus_latency_ms || {})[trendKey];
          else entry = (sum.hyperloop_rs_latency_ms || {})[trendKey];
          const p95 = Number((entry == null ? void 0 : entry.p95) || 0);
          const p99 = Number((entry == null ? void 0 : entry.p99) || 0);
          points95.push(isFinite(p95) ? p95 : 0);
          points99.push(isFinite(p99) ? p99 : 0);
        }
        const maxVal = Math.max(1, ...points95, ...points99);
        const BarRow = ({ data, color, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, height: 120, border: "1px dashed var(--sp-border-color, #eee)", padding: 6, borderRadius: 8 }, children: data.map((v, idx) => {
            const h = Math.max(4, Math.round(100 * v / maxVal));
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: `${v.toFixed(2)} ms`, style: { width: 10, height: h, background: color, borderRadius: 2 } }, idx);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: label })
        ] });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarRow, { data: points95, color: "#52c41a", label: "p95 (ms)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BarRow, { data: points99, color: "#722ed1", label: "p99 (ms)" })
        ] });
      })() })
    ] }) })
  ] }) });
};
export {
  RSDashboard as default
};
//# sourceMappingURL=RSDashboard-QFUpSFN-.js.map
