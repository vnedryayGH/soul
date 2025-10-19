import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { j as buildAuthHeaders, c as apiRequest, s as staticMethods, l as Space, p as Tag, B as Button, I as Input, F as ForwardTable, T as Typography } from "./index-B4P9h-k1.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { P as Popconfirm } from "./index-03A0ujFQ.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import "./index-BlJydARW.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
import "./index-C3XsEteC.js";
const StatusTag = ({ ok, text }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: ok ? "green" : "red", children: text != null ? text : ok ? "OK" : "FAIL" });
const Trace = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const [health, setHealth] = reactExports.useState(null);
  const [db, setDb] = reactExports.useState(null);
  const [llm, setLlm] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [disableBatch, setDisableBatch] = reactExports.useState(null);
  const [useRefiner, setUseRefiner] = reactExports.useState(null);
  const [persistThreshold, setPersistThreshold] = reactExports.useState(0.6);
  const [disableReminders, setDisableReminders] = reactExports.useState(null);
  const [threadId, setThreadId] = reactExports.useState("");
  const [traceRows, setTraceRows] = reactExports.useState([]);
  const [auditRows, setAuditRows] = reactExports.useState([]);
  const [recentQuants, setRecentQuants] = reactExports.useState([]);
  const latestMeaningStats = reactExports.useMemo(() => {
    return [...auditRows].reverse().find((r) => r.event_type === "soul_meaning_filter_stats") || null;
  }, [auditRows]);
  const latestQuantStats = reactExports.useMemo(() => {
    return [...auditRows].reverse().find((r) => r.event_type === "soul_quant_filter_stats") || null;
  }, [auditRows]);
  const latestMetaReflect = reactExports.useMemo(() => {
    return [...auditRows].reverse().find((r) => r.event_type === "soul_meta_reflect") || null;
  }, [auditRows]);
  const latestRouterDecision = reactExports.useMemo(() => {
    return [...auditRows].reverse().find((r) => r.event_type === "soul_router_decision") || null;
  }, [auditRows]);
  const headers = reactExports.useMemo(() => {
    try {
      const h = buildAuthHeaders();
      if (Array.isArray(h)) {
        return Object.fromEntries(h);
      }
      return h || {};
    } catch (e) {
      return {};
    }
  }, []);
  const parseTraceIdFromText = (text) => {
    try {
      if (!text) return void 0;
      const metaIdx = text.indexOf("meta:");
      if (metaIdx >= 0) {
        const jsonPart = text.slice(metaIdx + 5).trim();
        const matchJson = jsonPart.match(/\{[\s\S]*\}$/);
        if (matchJson) {
          const obj = JSON.parse(matchJson[0]);
          return obj.trace_id || obj.thread_id || void 0;
        }
      }
      const m = text.match(/trace_id\"?:\s*\"([a-f0-9-]{6,})\"/i) || text.match(/thread_id\"?:\s*\"([a-f0-9-]{6,})\"/i);
      return m ? m[1] : void 0;
    } catch (e) {
      return void 0;
    }
  };
  const loadIndicators = reactExports.useCallback(async () => {
    var _a2, _b2, _c2;
    try {
      setLoading(true);
      const [h, d, l] = await Promise.all([
        apiRequest("/health", "GET", null, headers),
        apiRequest("/admin/soul/db/check", "GET", null, headers),
        apiRequest("/admin/soul/llm/test?provider=deepseek&prompt=ping", "GET", null, headers)
      ]);
      setHealth(h);
      setDb(d);
      if (Array.isArray(l)) {
        setLlm(l);
      } else if (l && typeof l === "object") {
        const row = {
          provider: (_a2 = l.provider) != null ? _a2 : "unknown",
          ok: Boolean(l.ok),
          len: Number((_b2 = l.len) != null ? _b2 : 0),
          head: String((_c2 = l.head) != null ? _c2 : "")
        };
        setLlm(row);
      } else {
        setLlm(null);
      }
    } catch (e) {
      staticMethods.error("Ошибка загрузки индикаторов");
    } finally {
      setLoading(false);
    }
  }, [headers]);
  const loadSettings = reactExports.useCallback(async () => {
    var _a2;
    try {
      const data = await apiRequest("/admin/soul/settings/all", "GET", null, headers);
      const items = Array.isArray(data) ? data : Array.isArray(data == null ? void 0 : data.items) ? data.items : [];
      const dict = items.reduce((acc, it) => {
        acc[it.key] = it.value;
        return acc;
      }, {});
      setUseRefiner(dict.use_quant_refiner !== void 0 ? dict.use_quant_refiner === "true" : true);
      const thrRaw = (_a2 = dict.persist_energy_threshold) != null ? _a2 : "0.6";
      const thr = parseFloat(thrRaw);
      setPersistThreshold(isFinite(thr) ? thr : 0.6);
      const ubp = dict.use_batch_planner;
      setDisableBatch(ubp !== void 0 ? ubp === "false" : null);
      setDisableReminders(dict.disable_reminders !== void 0 ? dict.disable_reminders === "true" : null);
    } catch (e) {
    }
  }, [headers]);
  const saveSettings = reactExports.useCallback(async (patch) => {
    try {
      await apiRequest("/admin/soul/settings", "PUT", patch, headers);
      staticMethods.success("Настройки сохранены");
      await loadSettings();
    } catch (e) {
      staticMethods.error("Не удалось сохранить настройки");
    }
  }, [headers, loadSettings]);
  const loadAudit = reactExports.useCallback(async () => {
    var _a2;
    try {
      const data = await apiRequest("/admin/soul/audit/recent?limit=100", "GET", null, headers);
      const items = Array.isArray(data) ? data : (_a2 = data == null ? void 0 : data.items) != null ? _a2 : [];
      const normalized = items.map((row) => ({
        ...row,
        ts: row.ts || row.timestamp,
        trace_id: row.trace_id || row.thread_id || parseTraceIdFromText(row.description) || row.meta && (row.meta.trace_id || row.meta.thread_id) || void 0
      }));
      setAuditRows(normalized);
    } catch (e) {
    }
  }, [headers]);
  const loadTraceByThread = reactExports.useCallback(async () => {
    var _a2;
    const id = (threadId || "").trim();
    if (!id) return;
    try {
      try {
        const data = await apiRequest(`/admin/soul/trace/by-trace?trace_id=${encodeURIComponent(id)}`, "GET", null, headers);
        const events = Array.isArray(data == null ? void 0 : data.events) ? data.events : [];
        if (events.length) {
          const rows = events.map((e) => ({
            ts: e.ts || e.timestamp,
            stage: e.stage || e.event_type || e.function_id || "-",
            status: e.status || e.state || "ok",
            details: e.details || e.description || ""
          }));
          setTraceRows(rows);
          return;
        }
      } catch (e) {
      }
      try {
        const data2 = await apiRequest(`/admin/soul/trace/signature/steps/by-trace?trace_id=${encodeURIComponent(id)}`, "GET", null, headers);
        const steps = Array.isArray(data2 == null ? void 0 : data2.steps) ? data2.steps : [];
        if (steps.length) {
          const rows2 = steps.map((s) => ({
            ts: s.ts,
            stage: (s.scope ? `${s.scope}:` : "") + (s.function_id || ""),
            status: s.status || "ok",
            details: `v=${s.function_version || "v1"} input=${s.input_hash || ""} output=${s.output_hash || ""}`.trim()
          }));
          setTraceRows(rows2);
          return;
        }
      } catch (e) {
      }
      try {
        const data3 = await apiRequest("/admin/soul/audit/recent?limit=500", "GET", null, headers);
        const items = Array.isArray(data3) ? data3 : (_a2 = data3 == null ? void 0 : data3.items) != null ? _a2 : [];
        const filtered = items.filter((r) => {
          var _a3, _b2;
          const tid = r.trace_id || r.thread_id || ((_a3 = r == null ? void 0 : r.meta) == null ? void 0 : _a3.trace_id) || ((_b2 = r == null ? void 0 : r.meta) == null ? void 0 : _b2.thread_id);
          return String(tid || "").toLowerCase() === id.toLowerCase();
        });
        const rows3 = filtered.map((r) => ({
          ts: r.ts || r.timestamp,
          stage: r.event_type || "-",
          status: r.status || "ok",
          details: r.description || ""
        }));
        setTraceRows(rows3);
        return;
      } catch (e) {
      }
    } catch (e) {
    }
  }, [headers, threadId]);
  const loadRecentQuants = reactExports.useCallback(async () => {
    try {
      const data = await apiRequest("/admin/soul/graph/recent_quants?limit=50", "GET", null, headers);
      const items = Array.isArray(data == null ? void 0 : data.items) ? data.items : [];
      const normalized = items.map((q) => {
        const tagsField = Array.isArray(q.tags) ? q.tags : typeof q.tags === "string" ? q.tags.split(/[\s,;]+/).filter(Boolean) : Array.isArray(q.tag_list) ? q.tag_list : [];
        return {
          ...q,
          tags: tagsField,
          trace_id: q.trace_id || q.thread_id || q.meta && (q.meta.trace_id || q.meta.thread_id) || void 0
        };
      });
      setRecentQuants(normalized);
      const toEnrich = normalized.slice(0, 20).filter((q) => !q.trace_id || (Array.isArray(q.tags) ? q.tags.length === 0 : !q.tags));
      toEnrich.forEach(async (q) => {
        try {
          const detail = await apiRequest(`/soul/quant/${encodeURIComponent(q.id)}`, "GET", null, headers);
          const extraTags = Array.isArray(detail == null ? void 0 : detail.tags) ? detail.tags : typeof (detail == null ? void 0 : detail.tags) === "string" ? String(detail.tags).split(/[\s,;]+/).filter(Boolean) : Array.isArray(detail == null ? void 0 : detail.tag_list) ? detail.tag_list : [];
          const extraTrace = (detail == null ? void 0 : detail.trace_id) || (detail == null ? void 0 : detail.thread_id) || (detail == null ? void 0 : detail.meta) && (detail.meta.trace_id || detail.meta.thread_id);
          setRecentQuants((prev) => prev.map((p) => p.id === q.id ? { ...p, tags: p.tags && p.tags.length ? p.tags : extraTags, trace_id: p.trace_id || extraTrace } : p));
        } catch (e) {
        }
      });
    } catch (e) {
    }
  }, [headers]);
  reactExports.useEffect(() => {
    loadIndicators();
    loadSettings();
    loadAudit();
    loadRecentQuants();
  }, [loadIndicators, loadSettings, loadAudit, loadRecentQuants]);
  reactExports.useEffect(() => {
    var _a2, _b2, _c2;
    if (!(auditRows == null ? void 0 : auditRows.length) || !(recentQuants == null ? void 0 : recentQuants.length)) return;
    try {
      const map = /* @__PURE__ */ new Map();
      for (const r of auditRows) {
        const qid = r.quant_id || ((_a2 = r.meta) == null ? void 0 : _a2.quant_id);
        const tid = r.trace_id || ((_b2 = r.meta) == null ? void 0 : _b2.trace_id) || r.thread_id || ((_c2 = r.meta) == null ? void 0 : _c2.thread_id);
        if (qid && tid && !map.has(String(qid))) map.set(String(qid), String(tid));
      }
      if (map.size) {
        setRecentQuants((prev) => prev.map((q) => !q.trace_id && map.get(String(q.id)) ? { ...q, trace_id: map.get(String(q.id)) } : q));
      }
    } catch (e) {
    }
  }, [auditRows]);
  const deleteSelectedQuants = async () => {
    const ids = selectedRowsQuants.map((r) => r.id);
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) => apiRequest(`/admin/soul/quant/${encodeURIComponent(id)}`, "DELETE", null, headers)));
      staticMethods.success(`Удалено: ${ids.length}`);
      setSelectedRowsQuants([]);
      await loadRecentQuants();
      await loadAudit();
    } catch (e) {
      staticMethods.error("Не удалось удалить выбранные");
    }
  };
  const [selectedRowsAudit, setSelectedRowsAudit] = reactExports.useState([]);
  const [selectedRowsQuants, setSelectedRowsQuants] = reactExports.useState([]);
  const [modalVisible, setModalVisible] = reactExports.useState(false);
  const [modalData, setModalData] = reactExports.useState(null);
  const colsAudit = [
    {
      title: "Время",
      dataIndex: "ts",
      key: "ts",
      render: (v) => dayjs(v || "").format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => dayjs(a.ts).valueOf() - dayjs(b.ts).valueOf(),
      filterSearch: true,
      onFilter: (val, rec) => String(rec.ts || "").includes(String(val)),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "YYYY-MM-DD", value: selectedKeys[0], onChange: (e) => setSelectedKeys(e.target.value ? [e.target.value] : []), onPressEnter: () => confirm(), style: { width: 188, marginBottom: 8, display: "block" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", onClick: () => confirm(), children: "Фильтр" }) })
      ] })
    },
    {
      title: "Событие",
      dataIndex: "event_type",
      key: "ev",
      sorter: (a, b) => String(a.event_type).localeCompare(String(b.event_type)),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "event", value: selectedKeys[0], onChange: (e) => setSelectedKeys(e.target.value ? [e.target.value] : []), onPressEnter: () => confirm(), style: { width: 188, marginBottom: 8, display: "block" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", onClick: () => confirm(), children: "Фильтр" }) })
      ] }),
      onFilter: (val, rec) => String(rec.event_type || "").toLowerCase().includes(String(val).toLowerCase())
    },
    { title: "Описание", dataIndex: "description", key: "d", ellipsis: true },
    { title: "Trace ID", dataIndex: "trace_id", key: "trace", render: (_, row) => {
      var _a2;
      return ((_a2 = row.meta) == null ? void 0 : _a2.trace_id) || row.trace_id || "-";
    }, width: 220 }
  ];
  const colsTrace = [
    { title: "Время", dataIndex: "ts", key: "ts", render: (v) => dayjs(v || "").format("HH:mm:ss.SSS") },
    { title: "Этап", dataIndex: "stage", key: "stage" },
    { title: "Статус", dataIndex: "status", key: "status" },
    { title: "Детали", dataIndex: "details", key: "details", ellipsis: true }
  ];
  const colsQuants = [
    { title: "Время", dataIndex: "created_at", key: "ts", render: (v) => dayjs(v || "").format("YYYY-MM-DD HH:mm:ss"), sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf() },
    {
      title: "Preview",
      dataIndex: "thought_form",
      key: "tf",
      ellipsis: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "text contains", value: selectedKeys[0], onChange: (e) => setSelectedKeys(e.target.value ? [e.target.value] : []), onPressEnter: () => confirm(), style: { width: 188, marginBottom: 8, display: "block" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", onClick: () => confirm(), children: "Фильтр" }) })
      ] }),
      onFilter: (val, rec) => String(rec.thought_form || "").toLowerCase().includes(String(val).toLowerCase())
    },
    { title: "EW", dataIndex: "energy_weight", key: "ew", sorter: (a, b) => Number(a.energy_weight || 0) - Number(b.energy_weight || 0) },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (v) => Array.isArray(v) ? v.slice(0, 4).join(", ") : typeof v === "string" ? v : "",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "tag", value: selectedKeys[0], onChange: (e) => setSelectedKeys(e.target.value ? [e.target.value] : []), onPressEnter: () => confirm(), style: { width: 188, marginBottom: 8, display: "block" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", onClick: () => confirm(), children: "Фильтр" }) })
      ] }),
      onFilter: (val, rec) => {
        const tags = Array.isArray(rec.tags) ? rec.tags : typeof rec.tags === "string" ? rec.tags.split(/[,\s]+/).filter(Boolean) : [];
        return tags.some((t) => t.toLowerCase().includes(String(val).toLowerCase()));
      }
    },
    { title: "Trace ID", dataIndex: "trace_id", key: "trace", render: (_, row) => {
      var _a2;
      return row.trace_id || ((_a2 = row.meta) == null ? void 0 : _a2.trace_id) || "-";
    }, width: 220 }
  ];
  const llmRows = Array.isArray(llm) ? llm : llm ? [llm] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%", boxSizing: "border-box", maxWidth: "100%" }, size: "large", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 12, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Health", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTag, { ok: Boolean(health && health.status === "ok"), text: `API ${(_a = health == null ? void 0 : health.version) != null ? _a : ""}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTag, { ok: Boolean(health && health.database === "healthy"), text: `DB ${(_b = health == null ? void 0 : health.database) != null ? _b : ""}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: health == null ? void 0 : health.uptime })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "DB / Quants", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTag, { ok: Boolean(db == null ? void 0 : db.ok), text: "DB check" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
          "quants: ",
          (_d = (_c = db == null ? void 0 : db.quants) == null ? void 0 : _c.count) != null ? _d : "-"
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "LLM", children: llmRows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTag, { ok: r.ok, text: `${r.provider}` }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
          "head: ",
          r.head
        ] })
      ] }, i)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Маркерный обзор (Sense/Quant/Meta/Router)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: "meaning.accepted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: (_f = (_e = latestMeaningStats == null ? void 0 : latestMeaningStats.meta) == null ? void 0 : _e.accepted) != null ? _f : "-" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "purple", children: "quant.drop_short_gist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: (_h = (_g = latestQuantStats == null ? void 0 : latestQuantStats.meta) == null ? void 0 : _g.drop_short_gist) != null ? _h : 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "purple", children: "quant.drop_low_energy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: (_j = (_i = latestQuantStats == null ? void 0 : latestQuantStats.meta) == null ? void 0 : _i.drop_low_energy) != null ? _j : 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "geekblue", children: "meta.reflect.avg≤threshold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: ((_k = latestMetaReflect == null ? void 0 : latestMetaReflect.meta) == null ? void 0 : _k.avg) ? `${Number(latestMetaReflect.meta.avg).toFixed(2)} / ${Number((_m = (_l = latestMetaReflect == null ? void 0 : latestMetaReflect.meta) == null ? void 0 : _l.threshold) != null ? _m : 0).toFixed(2)}` : "-" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "router.policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: (_p = (_o = (_n = latestRouterDecision == null ? void 0 : latestRouterDecision.meta) == null ? void 0 : _n.decision) == null ? void 0 : _o.context_load_policy) != null ? _p : "-" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "router.modules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: Array.isArray((_r = (_q = latestRouterDecision == null ? void 0 : latestRouterDecision.meta) == null ? void 0 : _q.decision) == null ? void 0 : _r.modules) ? latestRouterDecision.meta.decision.modules.length : "-" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Тумблеры и параметры (runtime)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: "large", wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Disable Batch: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: Boolean(disableBatch), onChange: (v) => saveSettings({ use_batch_planner: v ? false : true }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Use Refiner: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: Boolean(useRefiner), onChange: (v) => saveSettings({ use_quant_refiner: v }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Disable Reminders: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: Boolean(disableReminders), onChange: (v) => saveSettings({ disable_reminders: v }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Persist threshold: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 1, step: 0.05, value: persistThreshold, onChange: (val) => setPersistThreshold(Number(val || 0.6)) }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => saveSettings({ persist_energy_threshold: persistThreshold }), children: "Сохранить" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadIndicators, children: "Обновить индикаторы" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Trace по треду", extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => Modal.info({ title: "Трассировка (полный экран)", width: "90%", content: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { size: "small", rowKey: (r) => r.ts + r.stage, dataSource: traceRows, columns: colsTrace, pagination: { pageSize: 20 } }) }) }) }), children: "Открыть на весь экран" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "trace_id / thread_id", style: { width: 420 }, value: threadId, onChange: (e) => setThreadId(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadTraceByThread, children: "Загрузить" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { size: "small", rowKey: (r) => r.ts + r.stage + (r.status || ""), dataSource: traceRows, columns: colsTrace, pagination: { pageSize: 20 } })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 12, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Последние события (Audit)", extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => Modal.info({ title: "Последние события (полный экран)", width: "90%", content: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          size: "small",
          rowKey: (r) => (r.ts || "") + (r.event_type || ""),
          dataSource: auditRows,
          columns: colsAudit,
          pagination: { pageSize: 20 }
        }
      ) }), children: "Открыть на весь экран" }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { style: { marginBottom: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, disabled: !selectedRowsAudit.length, onClick: () => staticMethods.info(`Удаление ${selectedRowsAudit.length} записей TODO`), children: "Удалить выбранные" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            size: "small",
            rowSelection: { onChange: (_keys, rows) => setSelectedRowsAudit(rows) },
            rowKey: (r) => (r.ts || "") + (r.event_type || ""),
            dataSource: auditRows,
            columns: colsAudit,
            pagination: { pageSize: 20 },
            onRow: (row) => ({ onClick: () => {
              setModalData(row);
              setModalVisible(true);
            } })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Последние Кванты", extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => Modal.info({ title: "Последние Кванты (полный экран)", width: "90%", content: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          size: "small",
          rowKey: (r) => r.id,
          dataSource: recentQuants,
          columns: colsQuants,
          pagination: { pageSize: 20 }
        }
      ) }), children: "Открыть на весь экран" }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadRecentQuants, children: "Обновить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Popconfirm, { title: `Удалить ${selectedRowsQuants.length} выбранных?`, okText: "Удалить", cancelText: "Отмена", onConfirm: deleteSelectedQuants, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, disabled: !selectedRowsQuants.length, children: "Удалить выбранные" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            size: "small",
            rowSelection: { onChange: (_keys, rows) => setSelectedRowsQuants(rows) },
            rowKey: (r) => r.id,
            dataSource: recentQuants,
            columns: colsQuants,
            pagination: { pageSize: 20 },
            onRow: (row) => ({ onClick: () => {
              setModalData(row);
              setModalVisible(true);
            } })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: modalVisible, onCancel: () => setModalVisible(false), title: "Детали", footer: null, width: 720, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap" }, children: modalData ? JSON.stringify(modalData, null, 2) : "" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", children: "Страница обновляет данные по запросу. Для корректной работы требуется запуск мини‑аппа из Telegram (заголовок X‑Telegram‑User‑ID)." })
  ] });
};
export {
  Trace as default
};
//# sourceMappingURL=Trace-hN7LrezY.js.map
