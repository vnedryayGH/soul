import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { j as buildAuthHeaders, aC as Spin, l as Space, T as Typography, p as Tag, F as ForwardTable, n as Select, c as apiRequest } from "./index-B4P9h-k1.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { A as Alert } from "./index-DVLFW87y.js";
import "./index-BlJydARW.js";
import "./Skeleton-D3e3aC7P.js";
const ArchitectMonitoring = () => {
  const [minutes, setMinutes] = reactExports.useState(60);
  const [loading, setLoading] = reactExports.useState(false);
  const [top, setTop] = reactExports.useState({ top_kinds: [], top_bot_keys: [], top_message_types: [] });
  const [kindStats, setKindStats] = reactExports.useState({ items: [] });
  const headers = reactExports.useMemo(() => buildAuthHeaders(), []);
  const loadData = async (m) => {
    setLoading(true);
    try {
      const t = await apiRequest(`/api/admin/soul/processor/top?minutes=${encodeURIComponent(String(m))}&limit=10`, "GET", null, headers);
      const ks = await apiRequest(`/api/admin/soul/processor/kind_stats?minutes=${encodeURIComponent(String(m))}`, "GET", null, headers);
      setTop(t || { top_kinds: [], top_bot_keys: [], top_message_types: [] });
      setKindStats(ks || { items: [] });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadData(minutes);
  }, []);
  const top3Kinds = (Array.isArray(top == null ? void 0 : top.top_kinds) ? top.top_kinds : []).slice(0, 3);
  const kindColumns = [
    { title: "Kind", dataIndex: "kind", key: "kind", render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: v }) },
    { title: "Processed", dataIndex: "processed", key: "processed", width: 120 },
    { title: "Skipped", dataIndex: "skipped", key: "skipped", width: 120 },
    { title: "Total", dataIndex: "total", key: "total", width: 120 },
    { title: "Error rate", dataIndex: "error_rate", key: "error_rate", render: (x) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: x > 0.2 ? "red" : x > 0.05 ? "orange" : "green", children: [
      (x * 100).toFixed(1),
      "%"
    ] }) },
    { title: "p95 (ms)", dataIndex: "e2e_p95_ms", key: "e2e_p95_ms", width: 120 },
    { title: "Limits", key: "limits", render: (_, r) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: "small", wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
          "rps=",
          (_b = (_a = r == null ? void 0 : r.limits) == null ? void 0 : _a.rps) != null ? _b : "-"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
          "conc=",
          (_d = (_c = r == null ? void 0 : r.limits) == null ? void 0 : _c.max_concurrency) != null ? _d : "-"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
          "p95≤",
          (_f = (_e = r == null ? void 0 : r.limits) == null ? void 0 : _e.p95_budget_ms) != null ? _f : "-"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
          "err≤",
          (_h = (_g = r == null ? void 0 : r.limits) == null ? void 0 : _g.err_rate_max) != null ? _h : "-"
        ] })
      ] });
    } }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--sp-spacing-lg)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 16], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 24, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Processor Monitor", extra: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: "small", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "Window:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { size: "small", value: minutes, style: { width: 120 }, onChange: (v) => {
      setMinutes(v);
      loadData(v);
    }, options: [
      { value: 10, label: "10 min" },
      { value: 30, label: "30 min" },
      { value: 60, label: "60 min" },
      { value: 180, label: "3 h" },
      { value: 1440, label: "24 h" }
    ] })
  ] }), children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Top 3 event kinds", children: ((top3Kinds == null ? void 0 : top3Kinds.length) || 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { type: "info", message: "Нет данных", showIcon: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, children: top3Kinds.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { justify: "space-between", align: "middle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: it.kind }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: it.count }) })
    ] }, String(it.kind))) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Per-kind stats", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        rowKey: (r) => String(r.kind),
        columns: kindColumns,
        dataSource: Array.isArray(kindStats == null ? void 0 : kindStats.items) ? kindStats.items : [],
        size: "small",
        pagination: { pageSize: 10 }
      }
    ) }) })
  ] }) }) }) }) });
};
export {
  ArchitectMonitoring as default
};
//# sourceMappingURL=ArchitectMonitoring-Dm2DQylm.js.map
