import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { c as apiRequest, s as staticMethods, l as Space, T as Typography, aB as Tooltip, I as Input, n as Select, B as Button, p as Tag } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { R as RefIcon } from "./ReloadOutlined-b-zgDpPK.js";
import { R as RefIcon$1 } from "./SettingOutlined-COiCZpX-.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { R as RefIcon$2 } from "./FileTextOutlined-lwBP-Cdj.js";
import { L as List } from "./index-CG-iaDjq.js";
import "./Skeleton-D3e3aC7P.js";
import "./AntdIcon-bc3Msg1y.js";
import "./index-BlJydARW.js";
const { Title, Text } = Typography;
const MONO_STYLE = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: 12,
  whiteSpace: "pre-wrap",
  background: "#0f172a",
  color: "#e2e8f0",
  padding: 12,
  borderRadius: 8,
  minHeight: 220,
  maxHeight: 360,
  overflowY: "auto",
  border: "1px solid rgba(148,163,184,.25)"
};
function SoulLogs() {
  const [enabled, setEnabled] = reactExports.useState(() => localStorage.getItem("soul_logs_enabled") === "1");
  const [filter, setFilter] = reactExports.useState(() => localStorage.getItem("soul_logs_filter") || "SOUL");
  const [lines, setLines] = reactExports.useState(() => {
    const v = Number(localStorage.getItem("soul_logs_lines") || 800);
    return isFinite(v) && v > 0 ? v : 800;
  });
  const [logsSoul, setLogsSoul] = reactExports.useState("");
  const [logsAll, setLogsAll] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [audit, setAudit] = reactExports.useState([]);
  const [auditLimit, setAuditLimit] = reactExports.useState(50);
  const [source, setSource] = reactExports.useState(() => localStorage.getItem("soul_logs_source") || "backend");
  const soulBoxRef = reactExports.useRef(null);
  const allBoxRef = reactExports.useRef(null);
  const fetchLogs = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      const dataSoul = source === "backend" ? await apiRequest(`/admin/soul/logs?filter=${encodeURIComponent(filter)}&lines=${lines}`, "GET") : await apiRequest(`/admin/soul/logs/nginx?kind=${source === "nginx_access" ? "access" : "error"}&lines=${lines}&filter=${encodeURIComponent(filter)}`, "GET");
      setLogsSoul((dataSoul == null ? void 0 : dataSoul.text) || "");
      const dataAll = await apiRequest(`/admin/soul/logs?filter=&lines=${lines}`, "GET");
      setLogsAll((dataAll == null ? void 0 : dataAll.text) || "");
      try {
        const dataAudit = await apiRequest(`/admin/soul/audit/recent?limit=${auditLimit}`, "GET");
        setAudit(Array.isArray(dataAudit == null ? void 0 : dataAudit.items) ? dataAudit.items : []);
      } catch (e) {
      }
      setTimeout(() => {
        var _a, _b;
        (_a = soulBoxRef.current) == null ? void 0 : _a.scrollTo({ top: soulBoxRef.current.scrollHeight });
        (_b = allBoxRef.current) == null ? void 0 : _b.scrollTo({ top: allBoxRef.current.scrollHeight });
      }, 0);
    } catch (e) {
      staticMethods.error("Ошибка загрузки логов");
    } finally {
      setLoading(false);
    }
  }, [filter, lines, auditLimit, source]);
  reactExports.useEffect(() => {
    if (!enabled) return;
    fetchLogs();
    const t = setInterval(fetchLogs, 5e3);
    return () => clearInterval(t);
  }, [enabled, fetchLogs]);
  const downloadUrlSoul = reactExports.useMemo(() => `/api/admin/soul/logs/download?filter=${encodeURIComponent(filter)}&lines=${lines}`, [filter, lines]);
  const downloadUrlAll = reactExports.useMemo(() => `/api/admin/soul/logs/download?filter=&lines=${lines}`, [lines]);
  const onToggle = (val) => {
    setEnabled(val);
    localStorage.setItem("soul_logs_enabled", val ? "1" : "0");
    if (val) fetchLogs();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 16, style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 2, style: { marginBottom: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/android-chrome-192x192.png", alt: "Soul", style: { width: 28, height: 28, borderRadius: 6 } }),
        "Соул · Логи"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Онлайн‑просмотр серверных логов (unit: soulpulse-backend.service) и событий аудита" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: enabled, onChange: onToggle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: "Включить логи — Кванты" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { type: "vertical" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Подстрока для фильтрации (например, SOUL, [SOUL-RES])", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          style: { width: 220 },
          placeholder: "Фильтр подстроки",
          value: filter,
          onChange: (e) => {
            setFilter(e.target.value);
            localStorage.setItem("soul_logs_filter", e.target.value);
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          value: source,
          onChange: (v) => {
            setSource(v);
            localStorage.setItem("soul_logs_source", String(v));
            setTimeout(fetchLogs, 0);
          },
          style: { width: 220 },
          options: [
            { value: "backend", label: "Backend (journalctl)" },
            { value: "nginx_access", label: "Nginx access.log" },
            { value: "nginx_error", label: "Nginx error.log" }
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Количество последних строк", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TypedInputNumber,
        {
          style: { width: 140 },
          min: 50,
          max: 5e3,
          step: 50,
          value: lines,
          onChange: (v) => {
            const n = Math.max(50, Math.min(5e3, Number(v) || 800));
            setLines(n);
            localStorage.setItem("soul_logs_lines", String(n));
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { size: 16 }), onClick: fetchLogs, loading, children: "Обновить" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { size: 16 }), onClick: () => window.open("/soul/dashboard", "_self"), children: "К дашборду" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        setLines(Math.min(5e3, lines + 500));
        setTimeout(fetchLogs, 0);
      }, children: "Показать ещё +500" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, lg: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: `Кванты / SOUL (фильтр: "${filter || "—"}")`, extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { size: 16 }), onClick: () => window.open(downloadUrlSoul, "_blank"), children: "Открыть в редакторе" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: soulBoxRef, style: MONO_STYLE, children: logsSoul || "—" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, lg: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Полный лог сервиса", extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { size: 16 }), onClick: () => window.open(downloadUrlAll, "_blank"), children: "Открыть в редакторе" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: allBoxRef, style: MONO_STYLE, children: logsAll || "—" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "События аудита (soul_audit_log)", extra: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "limit:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 10, max: 500, step: 10, value: auditLimit, onChange: (v) => {
        setAuditLimit(Number(v || 50));
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => fetchLogs(), loading, children: "Обновить" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      List,
      {
        dataSource: audit,
        renderItem: (it) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 2, style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: it.event_type || "event" }),
            it.quant_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "purple", children: [
              String(it.quant_id).slice(0, 8),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: it.ts ? new Date(it.ts).toLocaleString() : "" })
          ] }),
          it.description && /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: it.description }),
          it.meta && /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap" }, children: JSON.stringify(it.meta, null, 2) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", style: { cursor: "pointer" }, children: "meta ▸" }) })
        ] }) })
      }
    ) })
  ] }) });
}
export {
  SoulLogs as default
};
//# sourceMappingURL=SoulLogs-BbVoV9Wx.js.map
