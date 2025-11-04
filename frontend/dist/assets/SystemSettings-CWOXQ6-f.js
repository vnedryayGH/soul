import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { aC as Spin, T as Typography, l as Space, B as Button, p as Tag, c as apiRequest, j as buildAuthHeaders, s as staticMethods, F as ForwardTable, I as Input } from "./index-B4P9h-k1.js";
import { C as Card, T as Tabs } from "./index-C8B9-ZwJ.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon } from "./SettingOutlined-COiCZpX-.js";
import { R as RefIcon$1 } from "./ReloadOutlined-b-zgDpPK.js";
import { R as RefIcon$2 } from "./ApiOutlined-Bc6k0MAE.js";
import { R as RefIcon$3 } from "./CheckCircleOutlined-sGJe5hoH.js";
import { R as RefIcon$4 } from "./ExclamationCircleOutlined-Ct9zijvs.js";
import { R as RefIcon$5 } from "./SaveOutlined-B8yyOf7O.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import "./Skeleton-D3e3aC7P.js";
import "./AntdIcon-bc3Msg1y.js";
const { Text, Title } = Typography;
const { TabPane } = Tabs;
const CATEGORY_TABS = [
  { key: "LLM", title: "LLM", matcher: (s) => s.category === "LLM" || s.key.startsWith("llm_") },
  { key: "Architect", title: "Architect Chat / UI", matcher: (s) => s.category === "Architect" || s.key.startsWith("architect_") || s.key.startsWith("architect_chat.") },
  { key: "Reminders", title: "Reminders", matcher: (s) => s.category === "Reminders" || s.key.startsWith("reminders.") || s.key.includes("notification") },
  { key: "Sleep", title: "Sleep", matcher: (s) => s.category === "Sleep" || s.key.startsWith("sleep.") },
  { key: "Router", title: "Router", matcher: (s) => s.category === "Router" || s.key.startsWith("router.") },
  { key: "SelfConsistency", title: "Self-Consistency", matcher: (s) => s.category === "self_consistency" || s.key.startsWith("sc.") },
  { key: "DesiredAction", title: "Desired Action", matcher: (s) => s.category === "desired_action" || s.key.startsWith("da.") },
  { key: "Provenance", title: "Provenance", matcher: (s) => s.category === "provenance" || s.key.startsWith("provenance.") },
  { key: "Experiments", title: "Experiments", matcher: (s) => s.category === "experiments" || s.key.startsWith("experiments.") },
  { key: "AB", title: "A/B", matcher: (s) => s.category === "ab" || s.key.startsWith("ab.") },
  { key: "Trace", title: "Trace Viewer", matcher: (s) => s.category === "trace_view" || s.key.startsWith("trace_view.") },
  { key: "Security", title: "Security/Privacy", matcher: (s) => s.category === "Security/Privacy" || s.key.startsWith("security.") || s.key.startsWith("privacy.") }
];
const EXPECTED_KEYS = {
  LLM: [
    { key: "llm_provider_default", defaultValue: "deepseek", data_type: "string", description: "Провайдер LLM по умолчанию" },
    { key: "llm_provider_service_default", defaultValue: "deepseek", data_type: "string", description: "Провайдер сервиса LLM по умолчанию" },
    { key: "llm_temperature_default", defaultValue: 0.7, data_type: "float", description: "Температура по умолчанию" },
    { key: "max_tokens_default", defaultValue: 2048, data_type: "integer", description: "Максимум токенов по умолчанию" }
  ],
  Architect: [
    { key: "architect_chat.stateless", defaultValue: false, data_type: "boolean", description: "Статлесс режим архитектор-диалога" },
    { key: "architect_show_raw_quant_json", defaultValue: false, data_type: "boolean", description: "Показывать сырой JSON кванта" }
  ],
  Reminders: [
    { key: "reminders.prefetch.enabled", defaultValue: true, data_type: "boolean", description: "Предзагрузка напоминаний" },
    { key: "reminders.prefetch.minutes_before", defaultValue: 10, data_type: "integer", description: "Минут до наступления события" },
    { key: "notification_max_per_day", defaultValue: 20, data_type: "integer", description: "Максимум уведомлений в сутки" }
  ],
  Sleep: [
    { key: "sleep.enable_v2", defaultValue: true, data_type: "boolean", description: "Включить Sleep v2" },
    { key: "sleep.safe_mode", defaultValue: true, data_type: "boolean", description: "Безопасный режим Sleep" },
    { key: "sleep.batch_size", defaultValue: 10, data_type: "integer", description: "Размер батча Sleep" },
    { key: "sleep.novelty", defaultValue: '{"b1":0.7,"b2":0.3}', data_type: "json", description: "Веса новизны" },
    { key: "sleep.time_msk", defaultValue: "02:30", data_type: "string", description: "Время ежедневного запуска (MSK)" },
    { key: "sleep.refresh_rank_minutes", defaultValue: 15, data_type: "integer", description: "Периодический рефреш MV, минут" }
  ],
  Router: [
    { key: "router.context.enabled", defaultValue: true, data_type: "boolean", description: "Включить заполнение ROUTER_CONTEXT" },
    { key: "router.hybrid_retrieval.enabled", defaultValue: true, data_type: "boolean", description: "Гибридный ретривал (BM25+вектор)" },
    { key: "router.recent_ratio.recent", defaultValue: 0.6, data_type: "float", description: "recent профиль: доля последних" },
    { key: "router.recent_ratio.deep", defaultValue: 0.2, data_type: "float", description: "deep профиль: доля последних" },
    { key: "router.recent_ratio.balanced", defaultValue: 0.3, data_type: "float", description: "balanced профиль: доля последних" }
  ],
  SelfConsistency: [
    { key: "sc.enabled", defaultValue: true, data_type: "boolean", description: "Включить Self-Consistency" },
    { key: "sc.model_profile", defaultValue: "self_consistency_fast", data_type: "string", description: "Профиль модели" },
    { key: "sc.max_tokens", defaultValue: 192, data_type: "integer", description: "Максимум токенов для оценки" },
    { key: "sc.timeout_ms", defaultValue: 1200, data_type: "integer", description: "Таймаут оценки (мс)" },
    { key: "sc.threshold", defaultValue: 0.6, data_type: "float", description: "Порог согласованности (0..1)" },
    { key: "sc.metrics_enabled", defaultValue: true, data_type: "boolean", description: "Писать метрики/аудит" }
  ],
  DesiredAction: [
    { key: "da.enabled", defaultValue: true, data_type: "boolean", description: "Включить обработку desired_action" },
    { key: "da.auto_apply", defaultValue: false, data_type: "boolean", description: "Автоматически применять действия" },
    { key: "da.safe_mode", defaultValue: true, data_type: "boolean", description: "Только безопасные действия" },
    { key: "da.allowed_types", defaultValue: '["clarify","research","reminder"]', data_type: "json", description: "Список разрешённых типов" },
    { key: "da.keep_in_stateless", defaultValue: true, data_type: "boolean", description: "Сохранять desired_action в stateless-ответах" }
  ],
  Provenance: [
    { key: "provenance.enabled", defaultValue: true, data_type: "boolean", description: "Включить запись провенанса" },
    { key: "provenance.store_inputs", defaultValue: true, data_type: "boolean", description: "Сохранять хеши входных текстов" },
    { key: "provenance.store_outputs", defaultValue: true, data_type: "boolean", description: "Сохранять хеши выходных текстов" },
    { key: "provenance.hash_salt_env", defaultValue: "PROVENANCE_HASH_SALT", data_type: "string", description: "Имя ENV с солью" }
  ],
  Experiments: [
    { key: "experiments.enabled", defaultValue: true, data_type: "boolean", description: "Включить ExperimentsService" },
    { key: "experiments.sandbox", defaultValue: true, data_type: "boolean", description: "Песочница (Two-Keys для публикации)" },
    { key: "experiments.max_cases_default", defaultValue: 1, data_type: "integer", description: "Дефолтный лимит n для AB.RUN" },
    { key: "experiments.reflect_default", defaultValue: false, data_type: "boolean", description: "Дефолт reflect для AB.RUN" },
    { key: "experiments.rps_limit", defaultValue: 3, data_type: "integer", description: "RPS на параллельные кейсы" },
    { key: "experiments.concurrency", defaultValue: 3, data_type: "integer", description: "Макс. конкурентность" },
    { key: "experiments.latency_p95_budget_ms", defaultValue: 2e4, data_type: "integer", description: "Бюджет p95 (мс)" },
    { key: "experiments.golden_subset_enabled", defaultValue: true, data_type: "boolean", description: "Кэш коротких кейсов" }
  ],
  AB: [
    { key: "ab.enabled", defaultValue: false, data_type: "boolean", description: "Включить A/B эксперименты" },
    { key: "ab.bucket_ratio", defaultValue: 0.5, data_type: "float", description: "Доля пользователей в варианте B (0..1)" },
    { key: "ab.policy.A", defaultValue: "balanced", data_type: "string", description: "Политика контекста для A" },
    { key: "ab.policy.B", defaultValue: "deep", data_type: "string", description: "Политика контекста для B" }
  ],
  Trace: [
    { key: "trace_view.enabled", defaultValue: true, data_type: "boolean", description: "Включить TraceViewer API/UI" },
    { key: "trace_view.lookup_limit", defaultValue: 200, data_type: "integer", description: "Макс. записей в lookup" },
    { key: "trace_view.max_events_per_trace", defaultValue: 500, data_type: "integer", description: "Макс. событий на трассу" },
    { key: "trace_view.sanitize_pii", defaultValue: true, data_type: "boolean", description: "Маскировать PII" }
  ],
  Security: [
    { key: "security.guard.enabled", defaultValue: true, data_type: "boolean", description: "Включить Guard-слои безопасности" },
    { key: "security.guard.level", defaultValue: "medium", data_type: "string", description: "Уровень: low|medium|high" },
    { key: "security.guard.use_mini_llm", defaultValue: false, data_type: "boolean", description: "Включить мини-LLM классификатор" },
    { key: "security.guard.max_reruns", defaultValue: 1, data_type: "integer", description: "Макс. перегенераций" },
    { key: "security.guard.block_persistent_on_high", defaultValue: true, data_type: "boolean", description: "Блокировать persistent при high риске" },
    { key: "security.negative.boost_on_risk", defaultValue: true, data_type: "boolean", description: "Усилять NEGATIVE при риске" },
    { key: "privacy.enabled", defaultValue: true, data_type: "boolean", description: "Включить приватность" },
    { key: "privacy.mask_logs", defaultValue: true, data_type: "boolean", description: "Маскировать логи" }
  ]
};
function inferDataType(item) {
  if (item.data_type) return item.data_type;
  const k = item.key;
  if (k.endsWith(".enabled") || typeof item.value === "boolean") return "boolean";
  if (/(minutes|seconds|max|limit|batch_size|tokens)/i.test(k)) return "integer";
  if (/temperature/i.test(k)) return "float";
  if (/json|schema|config/.test(k) || typeof item.value === "object") return "json";
  return "string";
}
const editorFor = (item, draft, setDraft) => {
  const type = inferDataType(item);
  const providerKeys = /* @__PURE__ */ new Set(["llm_provider_default", "llm_provider_service_default"]);
  if (providerKeys.has(item.key)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: String(draft != null ? draft : ""), onChange: (e) => setDraft(e.target.value), style: { minWidth: 180 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "deepseek", children: "deepseek" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gigachat", children: "gigachat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "openai", children: "openai" })
    ] });
  }
  if (type === "boolean") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: Boolean(draft), onChange: (v) => setDraft(v) });
  }
  if (type === "integer") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { style: { width: 140 }, value: Number(draft != null ? draft : 0), onChange: (v) => setDraft(typeof v === "number" ? Math.trunc(v) : 0) });
  }
  if (type === "float") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { style: { width: 140 }, step: 0.1, value: Number(draft != null ? draft : 0), onChange: (v) => setDraft(typeof v === "number" ? v : 0) });
  }
  if (type === "json") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input.TextArea,
      {
        value: typeof draft === "string" ? draft : JSON.stringify(draft != null ? draft : {}, null, 2),
        onChange: (e) => setDraft(e.target.value),
        autoSize: { minRows: 2, maxRows: 6 }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { minWidth: 180 }, value: String(draft != null ? draft : ""), onChange: (e) => setDraft(e.target.value) });
};
const normalizeOutgoingValue = (item, draft) => {
  const type = inferDataType(item);
  if (type === "json") {
    try {
      const parsed = typeof draft === "string" ? JSON.parse(draft) : draft;
      return JSON.stringify(parsed);
    } catch (e) {
      throw new Error("Неверный JSON");
    }
  }
  if (type === "boolean") return String(Boolean(draft));
  if (type === "integer") return String(parseInt(String(draft || "0"), 10));
  if (type === "float") return String(parseFloat(String(draft || "0")));
  return String(draft != null ? draft : "");
};
const CategoryTable = ({ list, savingKey, onSave }) => {
  const [drafts, setDrafts] = reactExports.useState({});
  const setDraft = (key, v) => setDrafts((prev) => ({ ...prev, [key]: v }));
  const columns = [
    { title: "Ключ", dataIndex: "key", key: "key", width: 280, render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { code: true, children: v }) },
    { title: "Описание", dataIndex: "description", key: "description", width: 360, render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: v || "-" }) },
    {
      title: "Значение",
      key: "value",
      width: 360,
      render: (rec) => editorFor(
        rec,
        drafts[rec.key] !== void 0 ? drafts[rec.key] : rec.value,
        (v) => setDraft(rec.key, v)
      )
    },
    {
      title: "Действие",
      key: "action",
      width: 140,
      render: (rec) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
          loading: savingKey === rec.key,
          onClick: () => onSave(rec, drafts[rec.key] !== void 0 ? drafts[rec.key] : rec.value),
          children: "Save"
        }
      )
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ForwardTable,
    {
      rowKey: "key",
      dataSource: list,
      columns,
      pagination: { pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] },
      size: "small",
      scroll: { x: true }
    }
  );
};
const SystemSettings = () => {
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [items, setItems] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("LLM");
  const [savingKey, setSavingKey] = reactExports.useState(null);
  const [llmTestLoading, setLlmTestLoading] = reactExports.useState(false);
  const [llmTestResult, setLlmTestResult] = reactExports.useState(null);
  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest("/api/admin/soul/settings/all", "GET");
      const list = (data == null ? void 0 : data.items) || [];
      setItems(list);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка загрузки настроек");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadAll();
  }, []);
  const groups = reactExports.useMemo(() => {
    const byTab = {};
    CATEGORY_TABS.forEach((t) => byTab[t.key] = []);
    items.forEach((it) => {
      const tab = CATEGORY_TABS.find((t) => t.matcher(it));
      if (tab) byTab[tab.key].push(it);
    });
    Object.entries(EXPECTED_KEYS).forEach(([tabKey, defs]) => {
      defs.forEach((def) => {
        const exists = (byTab[tabKey] || []).some((i) => i.key === def.key) || items.some((i) => i.key === def.key);
        if (!exists) {
          const fake = {
            key: def.key,
            value: def.defaultValue,
            description: def.description || "",
            category: tabKey,
            data_type: def.data_type
          };
          byTab[tabKey] = byTab[tabKey] || [];
          byTab[tabKey].push(fake);
        }
      });
    });
    Object.keys(byTab).forEach((k) => {
      byTab[k] = (byTab[k] || []).sort((a, b) => a.key.localeCompare(b.key));
    });
    return byTab;
  }, [items]);
  const saveItem = async (item, draft) => {
    try {
      setSavingKey(item.key);
      const out = normalizeOutgoingValue(item, draft);
      await fetch("/api/admin/soul/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...buildAuthHeaders() },
        body: JSON.stringify({ key: item.key, value: out })
      });
      staticMethods.success("Сохранено");
      await loadAll();
    } catch (e) {
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка сохранения");
    } finally {
      setSavingKey(null);
    }
  };
  const testLLM = async () => {
    try {
      setLlmTestLoading(true);
      setLlmTestResult(null);
      const res = await fetch("/api/admin/soul/llm/test?prompt=ping", { headers: buildAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLlmTestResult({ ok: true, provider: (data == null ? void 0 : data.provider) || (data == null ? void 0 : data.current_provider) });
        staticMethods.success("LLM OK");
      } else {
        const text = await res.text();
        setLlmTestResult({ ok: false, detail: text });
        staticMethods.error("LLM error");
      }
    } catch (e) {
      setLlmTestResult({ ok: false, detail: (e == null ? void 0 : e.message) || "Ошибка" });
      staticMethods.error("LLM error");
    } finally {
      setLlmTestLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: 40 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { size: "large" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 12 }, children: "Загрузка системных настроек…" })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { type: "error", showIcon: true, message: "Ошибка", description: error }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, style: { marginTop: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
      " Системные настройки"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Редактирование ключей в таблице soul_settings (без ребилда фронтенда)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { marginTop: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { activeKey: activeTab, onChange: setActiveTab, tabPosition: "top", children: CATEGORY_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TabPane,
      {
        tab: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.title }),
        children: [
          tab.key === "LLM" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), onClick: loadAll, children: "Перезагрузить" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), onClick: testLLM, loading: llmTestLoading, children: "Проверить LLM" }),
            llmTestResult && (llmTestResult.ok ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "green", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
              " OK ",
              llmTestResult.provider ? `• ${llmTestResult.provider}` : ""
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "red", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
              " Error"
            ] }))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryTable, { list: groups[tab.key] || [], savingKey, onSave: saveItem })
        ]
      },
      tab.key
    )) }) })
  ] });
};
export {
  SystemSettings as default
};
//# sourceMappingURL=SystemSettings-CWOXQ6-f.js.map
