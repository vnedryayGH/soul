import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { T as Typography, p as Tag, F as ForwardTable, aC as Spin, j as buildAuthHeaders, c as apiRequest, s as staticMethods } from "./index-B4P9h-k1.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import "./Skeleton-D3e3aC7P.js";
const categoryLabel = {
  U: "Пользовательская",
  A: "Аналитика",
  F: "Функциональная",
  S: "Настройки",
  H: "Вспомогательная"
};
const UIFormsRegistry = () => {
  const [forms, setForms] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const allRoles = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    forms.forEach((f) => (f.roles || []).forEach((r) => set.add(r)));
    ["architect", "admin"].forEach((r) => set.add(r));
    return Array.from(set).sort();
  }, [forms]);
  const fetchForms = async () => {
    setLoading(true);
    try {
      const cfgHeaders = buildAuthHeaders();
      let data = null;
      try {
        data = await apiRequest("/api/ui/forms", "GET", null, cfgHeaders);
      } catch (e) {
        data = await apiRequest("/api/admin/ui/forms", "GET", null, cfgHeaders);
      }
      const items = Array.isArray(data == null ? void 0 : data.items) ? data.items : Array.isArray(data) ? data : [];
      setForms(items);
    } catch (e) {
      staticMethods.error("Не удалось загрузить реестр форм");
      console.error("[UIFormsRegistry] load error", e);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchForms();
  }, []);
  const toggleVisibility = async (formKey, role, visible) => {
    try {
      const body = { role, visible };
      const headers = { ...buildAuthHeaders() };
      const current = forms.find((f) => f.key === formKey);
      const ifMatch = (current == null ? void 0 : current.etag) || (current == null ? void 0 : current.row_version) ? String((current == null ? void 0 : current.etag) || (current == null ? void 0 : current.row_version)) : "";
      if (ifMatch) headers["If-Match"] = ifMatch;
      const res = await fetch(`/api/ui/forms/${encodeURIComponent(formKey)}/visibility`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`${res.status} ${res.statusText} ${t}`);
      }
      staticMethods.success("Сохранено");
      await fetchForms();
    } catch (e) {
      staticMethods.error("Ошибка сохранения");
      console.error("[UIFormsRegistry] save error", e);
    }
  };
  const columns = [
    {
      title: "Ключ",
      dataIndex: "key",
      key: "key",
      width: 180,
      render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: v })
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (v, r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600 }, children: v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, opacity: 0.75 }, children: r.desc })
      ] })
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: categoryLabel[c] || c })
    },
    {
      title: "Маршрут",
      dataIndex: "route",
      key: "route",
      width: 220,
      render: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: p })
    },
    ...allRoles.map((role) => ({
      title: role,
      key: `role_${role}`,
      width: 110,
      align: "center",
      render: (_, record) => {
        const visible = (record.roles || []).includes(role);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: visible,
            size: "small",
            onChange: (v) => toggleVisibility(record.key, role, v)
          }
        );
      }
    })),
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: s === "ready" ? "green" : "orange", children: s || "draft" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--sp-spacing-lg)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Реестр форм (Роли × Формы)", extra: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { size: "small" }) : null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ForwardTable,
    {
      rowKey: (r) => String(r.key),
      columns,
      dataSource: forms,
      pagination: { pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] },
      scroll: { x: true },
      size: "middle"
    }
  ) }) });
};
export {
  UIFormsRegistry as default
};
//# sourceMappingURL=UIFormsRegistry-DNdkkV6a.js.map
