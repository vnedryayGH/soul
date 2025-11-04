import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { l as Space, T as Typography, p as Tag, I as Input, B as Button, F as ForwardTable, s as staticMethods } from "./index-B4P9h-k1.js";
import { R as RefIcon$1 } from "./SettingOutlined-COiCZpX-.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { R as RefIcon$2 } from "./SaveOutlined-B8yyOf7O.js";
import { R as RefIcon$3 } from "./RobotOutlined-B-2S_nNK.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import "./Skeleton-D3e3aC7P.js";
import "./row-BcQp44VL.js";
import "./index-BlJydARW.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
var HistoryOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M536.1 273H488c-4.4 0-8 3.6-8 8v275.3c0 2.6 1.2 5 3.3 6.5l165.3 120.7c3.6 2.6 8.6 1.9 11.2-1.7l28.6-39c2.7-3.7 1.9-8.7-1.7-11.2L544.1 528.5V281c0-4.4-3.6-8-8-8zm219.8 75.2l156.8 38.3c5 1.2 9.9-2.6 9.9-7.7l.8-161.5c0-6.7-7.7-10.5-12.9-6.3L752.9 334.1a8 8 0 003 14.1zm167.7 301.1l-56.7-19.5a8 8 0 00-10.1 4.8c-1.9 5.1-3.9 10.1-6 15.1-17.8 42.1-43.3 80-75.9 112.5a353 353 0 01-112.5 75.9 352.18 352.18 0 01-137.7 27.8c-47.8 0-94.1-9.3-137.7-27.8a353 353 0 01-112.5-75.9c-32.5-32.5-58-70.4-75.9-112.5A353.44 353.44 0 01171 512c0-47.8 9.3-94.2 27.8-137.8 17.8-42.1 43.3-80 75.9-112.5a353 353 0 01112.5-75.9C430.6 167.3 477 158 524.8 158s94.1 9.3 137.7 27.8A353 353 0 01775 261.7c10.2 10.3 19.8 21 28.6 32.3l59.8-46.8C784.7 146.6 662.2 81.9 524.6 82 285 82.1 92.6 276.7 95 516.4 97.4 751.9 288.9 942 524.8 942c185.5 0 343.5-117.6 403.7-282.3 1.5-4.2-.7-8.9-4.9-10.4z" } }] }, "name": "history", "theme": "outlined" };
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
const HistoryOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: HistoryOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(HistoryOutlined);
const { Title, Text } = Typography;
const PhiSettings = () => {
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [provider, setProvider] = reactExports.useState("phi-4");
  const [url, setUrl] = reactExports.useState("");
  const [timeoutMs, setTimeoutMs] = reactExports.useState(5e3);
  const [maxOut, setMaxOut] = reactExports.useState(256);
  const [retries, setRetries] = reactExports.useState(0);
  const [temperature, setTemperature] = reactExports.useState(0.8);
  const [topP, setTopP] = reactExports.useState(0.95);
  const [systemPrompt, setSystemPrompt] = reactExports.useState("");
  const [routingMode, setRoutingMode] = reactExports.useState("primary_with_aux_failover");
  const [history, setHistory] = reactExports.useState([]);
  const load = async () => {
    try {
      setLoading(true);
      const resp = await fetch("/api/phi/settings");
      if (resp.ok) {
        const data = await resp.json();
        if (data.provider) setProvider(String(data.provider));
        if (data.url) setUrl(String(data.url));
        if (data.timeout_ms != null) setTimeoutMs(Number(data.timeout_ms));
        if (data.max_output_tokens != null) setMaxOut(Number(data.max_output_tokens));
        if (data.retries != null) setRetries(Number(data.retries));
        if (data.temperature != null) setTemperature(Number(data.temperature));
        if (data.top_p != null) setTopP(Number(data.top_p));
        if (data.system_prompt != null) setSystemPrompt(String(data.system_prompt));
        if (data.routing_mode) setRoutingMode(String(data.routing_mode));
      }
      try {
        const r2 = await fetch("/api/admin/soul/metrics/recent?metric_key=phi_settings_changed&limit=50");
        if (r2.ok) {
          const j2 = await r2.json();
          const items = Array.isArray(j2 == null ? void 0 : j2.items) ? j2.items : [];
          setHistory(items);
        }
      } catch (e) {
      }
    } catch (e) {
      staticMethods.error("Не удалось загрузить настройки Phi");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const save = async () => {
    try {
      setSaving(true);
      const body = {
        provider,
        url,
        timeout_ms: timeoutMs,
        max_output_tokens: maxOut,
        retries,
        temperature,
        top_p: topP,
        system_prompt: systemPrompt,
        routing_mode: routingMode
      };
      const resp = await fetch("/api/phi/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error((j == null ? void 0 : j.detail) || `HTTP ${resp.status}`);
      }
      staticMethods.success("Настройки Phi‑4 сохранены");
      await load();
    } catch (e) {
      staticMethods.error(`Ошибка сохранения: ${(e == null ? void 0 : e.message) || e}`);
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: 16, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { marginRight: 8 } }),
        " Настройки Phi‑4"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Параметры Aux LLM (локальная ветка Phi‑4) с историей изменений" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { loading, title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Текущие параметры" })
    ] }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: 1, size: "small", bordered: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions.Item, { label: "Провайдер", children: [
          provider,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: "Aux" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Endpoint URL", children: url || "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Провайдер", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: provider, onChange: (e) => setProvider(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Endpoint URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: url, onChange: (e) => setUrl(e.target.value), placeholder: "http://127.0.0.1:8085/completion" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Timeout, ms", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: timeoutMs, onChange: (v) => setTimeoutMs(Number(v || 0)), min: 500, step: 100, style: { width: 160 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Max output tokens", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: maxOut, onChange: (v) => setMaxOut(Number(v || 0)), min: 1, max: 8192, style: { width: 160 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Retries", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: retries, onChange: (v) => setRetries(Number(v || 0)), min: 0, max: 5, style: { width: 160 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Temperature", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: temperature, onChange: (v) => setTemperature(Number(v || 0)), min: 0, max: 2, step: 0.05, style: { width: 160 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Top‑p", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: topP, onChange: (v) => setTopP(Number(v || 0)), min: 0, max: 1, step: 0.01, style: { width: 160 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "System prompt", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { value: systemPrompt, onChange: (e) => setSystemPrompt(e.target.value), rows: 3 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Routing mode (llm.routing.mode)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: routingMode, onChange: (e) => setRoutingMode(e.target.value), placeholder: "primary_only | primary_with_aux_failover | aux_primary_python_fallback" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), loading: saving, onClick: save, children: "Сохранить" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "История изменений" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        dataSource: history,
        rowKey: (r) => `${r.ts}-${r.metric_key}`,
        size: "small",
        pagination: { pageSize: 10 },
        columns: [
          { title: "Время", dataIndex: "ts", key: "ts", width: 180 },
          { title: "Ключ", dataIndex: "metric_key", key: "metric_key", width: 180 },
          { title: "Meta", key: "meta", render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap" }, children: JSON.stringify(r.meta || {}, null, 2) }) }
        ]
      }
    ) })
  ] }) });
};
export {
  PhiSettings as default
};
//# sourceMappingURL=PhiSettings-BvMOkK2e.js.map
