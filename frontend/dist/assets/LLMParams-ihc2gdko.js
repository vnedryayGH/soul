import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { j as buildAuthHeaders, c as apiRequest, s as staticMethods, T as Typography, l as Space, n as Select, I as Input, B as Button, F as ForwardTable, p as Tag } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import "./Skeleton-D3e3aC7P.js";
const LLMParams = () => {
  const headers = reactExports.useMemo(() => buildAuthHeaders(), []);
  const [loading, setLoading] = reactExports.useState(false);
  const [rows, setRows] = reactExports.useState([]);
  const load = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/soul/settings/all", "GET", null, headers);
      const items = Array.isArray(data == null ? void 0 : data.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter((it) => it.key.startsWith("llm_timeout_ms.") || it.key.startsWith("llm_retries.")).map((it) => ({ key: it.key, value: it.value, type: it.data_type, category: it.category }));
      setRows(filtered);
    } catch (e) {
      staticMethods.error("Не удалось загрузить настройки LLM");
    } finally {
      setLoading(false);
    }
  }, [headers]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const [editKey, setEditKey] = reactExports.useState("");
  const [editValue, setEditValue] = reactExports.useState("");
  const saveOne = async (key, value) => {
    try {
      await apiRequest("/admin/soul/settings", "PUT", { key, value }, headers);
      staticMethods.success("Сохранено");
      await load();
    } catch (e) {
      staticMethods.error("Ошибка сохранения");
    }
  };
  const [newType, setNewType] = reactExports.useState("timeout");
  const [newFunction, setNewFunction] = reactExports.useState("soul_core");
  const [newTarget, setNewTarget] = reactExports.useState("deepseek");
  const [newValue, setNewValue] = reactExports.useState("6000");
  const addRow = async () => {
    const prefix = newType === "timeout" ? "llm_timeout_ms" : "llm_retries";
    const key = `${prefix}.${newFunction}.${newTarget}`;
    await saveOne(key, newValue);
    setNewValue("");
  };
  const columns = [
    { title: "Ключ", dataIndex: "key", key: "k", render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: v }) },
    { title: "Значение", dataIndex: "value", key: "v", render: (_, row) => editKey === row.key ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { size: "small", value: editValue, onChange: (e) => setEditValue(e.target.value), style: { width: 160 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", type: "primary", onClick: () => {
        saveOne(row.key, editValue);
        setEditKey("");
      }, children: "Сохранить" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => setEditKey(""), children: "Отмена" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: String(row.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => {
        var _a;
        setEditKey(row.key);
        setEditValue(String((_a = row.value) != null ? _a : ""));
      }, children: "Изменить" })
    ] }) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Настройки LLM: таймауты и ретраи (таблица)", extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: load, children: "Обновить" }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography.Paragraph, { type: "secondary", children: [
      "Формат ключей: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: "llm_timeout_ms.<function>.<model|provider|default>" }),
      " и ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: "llm_retries.<function>.<model|provider|default>" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 12 }, wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          size: "small",
          value: newType,
          onChange: (v) => setNewType(v),
          options: [{ value: "timeout", label: "timeout_ms" }, { value: "retries", label: "retries" }]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { size: "small", placeholder: "function (например soul_core)", value: newFunction, onChange: (e) => setNewFunction(e.target.value), style: { width: 220 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { size: "small", placeholder: "model/provider (например deepseek)", value: newTarget, onChange: (e) => setNewTarget(e.target.value), style: { width: 220 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { size: "small", placeholder: "value", value: newValue, onChange: (e) => setNewValue(e.target.value), style: { width: 160 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", type: "primary", onClick: addRow, children: "Добавить/Обновить" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForwardTable, { size: "small", loading, rowKey: (r) => r.key, dataSource: rows, columns, pagination: { pageSize: 10 } })
  ] });
};
export {
  LLMParams as default
};
//# sourceMappingURL=LLMParams-ihc2gdko.js.map
