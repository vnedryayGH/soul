import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { g as getTelegramUser, T as Typography, F as ForwardTable, l as Space, I as Input, B as Button, aF as api, p as Tag, s as staticMethods } from "./index-B4P9h-k1.js";
import { T as Tabs, C as Card } from "./index-C8B9-ZwJ.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import "./Skeleton-D3e3aC7P.js";
var PlusCircleOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" } }, { "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" } }] }, "name": "plus-circle", "theme": "outlined" };
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
const PlusCircleOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: PlusCircleOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(PlusCircleOutlined);
const Keywords = () => {
  const [topKeywords, setTopKeywords] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [excluded, setExcluded] = reactExports.useState([]);
  const [newExWord, setNewExWord] = reactExports.useState("");
  const [promptText, setPromptText] = reactExports.useState("");
  const [savingPrompt, setSavingPrompt] = reactExports.useState(false);
  const [adminError, setAdminError] = reactExports.useState(null);
  const [testText, setTestText] = reactExports.useState("");
  const [testKeywords, setTestKeywords] = reactExports.useState(null);
  const [testing, setTesting] = reactExports.useState(false);
  const telegramUser = getTelegramUser();
  const requireTgId = () => {
    var _a;
    const id = (_a = telegramUser == null ? void 0 : telegramUser.id) == null ? void 0 : _a.toString();
    if (!id) throw new Error("Не найден Telegram ID");
    return id;
  };
  const loadTop = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api("/messages/keywords/top?limit=50", {
        method: "GET",
        headers: {
          "X-Telegram-User-ID": requireTgId()
        }
      });
      if (resp.status === "success") {
        setTopKeywords(resp.keywords || []);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка загрузки топа ключевых слов");
    } finally {
      setLoading(false);
    }
  };
  const addExclusionWord = async (word) => {
    const w = (word || "").trim().toLowerCase();
    if (!w) return;
    try {
      const tgId = requireTgId();
      const resp = await api("/admin/keywords/exclusions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId,
          ...sessionStorage.getItem("token") ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {}
        },
        body: JSON.stringify({ word: w })
      });
      if ((resp == null ? void 0 : resp.status) === "success") {
        await loadAdminData();
        await loadTop();
        staticMethods.success(`Добавлено в исключения: ${w}`);
      }
    } catch (e) {
    }
  };
  const runSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await api(`/messages/keywords/search?keyword=${encodeURIComponent(query.trim())}`, {
        method: "GET",
        headers: {
          "X-Telegram-User-ID": requireTgId()
        }
      });
      if (resp.status === "success") {
        setResults(resp.messages || []);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка поиска по ключевому слову");
    } finally {
      setLoading(false);
    }
  };
  const loadAdminData = async () => {
    try {
      setAdminError(null);
      const tgId = requireTgId();
      const auth = sessionStorage.getItem("token") ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {};
      const [ex, pr] = await Promise.all([
        api("/admin/keywords/exclusions", {
          method: "GET",
          headers: {
            "X-Telegram-User-ID": tgId,
            ...auth
          }
        }),
        api("/admin/keywords/prompt", {
          method: "GET",
          headers: {
            "X-Telegram-User-ID": tgId,
            ...auth
          }
        })
      ]);
      if ((ex == null ? void 0 : ex.status) === "success") setExcluded(ex.items || []);
      if ((pr == null ? void 0 : pr.status) === "success") setPromptText(pr.prompt || "");
    } catch (e) {
      setAdminError((e == null ? void 0 : e.message) || "Ошибка загрузки админ-данных (нужна роль Архитектора)");
    }
  };
  const addExclusion = async () => {
    const w = newExWord.trim().toLowerCase();
    if (!w) return;
    try {
      setAdminError(null);
      const tgId = requireTgId();
      const resp = await api("/admin/keywords/exclusions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId,
          ...sessionStorage.getItem("token") ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {}
        },
        body: JSON.stringify({ word: w })
      });
      if ((resp == null ? void 0 : resp.status) === "success") {
        setNewExWord("");
        await loadAdminData();
        await loadTop();
        staticMethods.success(`Добавлено в исключения: ${w}`);
      }
    } catch (e) {
      setAdminError((e == null ? void 0 : e.message) || "Ошибка добавления исключения");
    }
  };
  const removeExclusion = async (id) => {
    try {
      setAdminError(null);
      const tgId = requireTgId();
      await api(`/admin/keywords/exclusions/${id}`, {
        method: "DELETE",
        headers: {
          "X-Telegram-User-ID": tgId,
          ...sessionStorage.getItem("token") ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {}
        }
      });
      await loadAdminData();
      await loadTop();
    } catch (e) {
      setAdminError((e == null ? void 0 : e.message) || "Ошибка удаления исключения");
    }
  };
  const savePrompt = async () => {
    try {
      setSavingPrompt(true);
      setAdminError(null);
      const tgId = requireTgId();
      if (!promptText.trim()) {
        const ok = window.confirm("Сохранить пустой промпт? Будет использован дефолтный.");
        if (!ok) {
          setSavingPrompt(false);
          return;
        }
      }
      await api("/admin/keywords/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId,
          ...sessionStorage.getItem("token") ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {}
        },
        body: JSON.stringify({ prompt: promptText })
      });
      staticMethods.success("Промпт сохранён");
    } catch (e) {
      setAdminError((e == null ? void 0 : e.message) || "Ошибка сохранения промпта");
    } finally {
      setSavingPrompt(false);
    }
  };
  const testExtraction = async () => {
    if (!testText.trim()) return;
    try {
      setTesting(true);
      const tgId = requireTgId();
      const resp = await api("/messages/keywords/extract-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId,
          ...sessionStorage.getItem("token") ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {}
        },
        body: JSON.stringify({ text: testText })
      });
      if ((resp == null ? void 0 : resp.status) === "success") setTestKeywords(resp.keywords || []);
    } catch (e) {
      setAdminError((e == null ? void 0 : e.message) || "Ошибка тестирования извлечения");
    } finally {
      setTesting(false);
    }
  };
  reactExports.useEffect(() => {
    try {
      loadTop();
      loadAdminData();
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка инициализации (нет Telegram ID)");
    }
  }, []);
  const topColumns = [
    { title: "Ключевое слово", dataIndex: "keyword", key: "keyword" },
    { title: "Тип", dataIndex: "type", key: "type", render: (t) => t ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: t }) : "-" },
    { title: "Кол-во", dataIndex: "count", key: "count", width: 120 },
    { title: "Rel", dataIndex: "avg_relevance", key: "avg_relevance", width: 120, render: (v) => (v != null ? v : 0).toFixed(2) },
    { title: "Действия", key: "actions", width: 120, render: (_, r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        size: "small",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
        onClick: () => addExclusionWord(r.keyword),
        disabled: excluded.some((e) => {
          var _a, _b;
          return ((_a = e.word) == null ? void 0 : _a.toLowerCase()) === ((_b = r.keyword) == null ? void 0 : _b.toLowerCase());
        }),
        children: "В исключения"
      }
    ) }
  ];
  const searchColumns = [
    { title: "Дата", dataIndex: "created_at", key: "created_at", width: 200, render: (v) => new Date(v).toLocaleString("ru-RU") },
    { title: "Отправитель", dataIndex: "sender_type", key: "sender_type", width: 130, render: (s) => s === "user" ? "Пользователь" : "Бот" },
    { title: "Текст", dataIndex: "text_preview", key: "text_preview", render: (_, r) => r.text_preview || r.text },
    { title: "ID", dataIndex: "id", key: "id", width: 180 }
  ];
  const exclColumns = [
    { title: "Слово", dataIndex: "word", key: "word" },
    { title: "Срабатываний", dataIndex: "hit_count", key: "hit_count", width: 160 },
    { title: "Действия", key: "actions", width: 140, render: (_, r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, size: "small", onClick: () => removeExclusion(r.id), children: "Удалить" }) }
  ];
  const testColumns = [
    { title: "Слово", dataIndex: "word", key: "word" },
    { title: "Тип", dataIndex: "type", key: "type", width: 140 },
    { title: "Rel", dataIndex: "relevance", key: "relevance", width: 120, render: (v) => (v != null ? v : 0).toFixed(2) }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 3, style: { marginBottom: "var(--sp-spacing-sm)" }, children: "Ключевые слова" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        defaultActiveKey: "top",
        items: [
          {
            key: "top",
            label: "Топ",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "danger", children: error }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ForwardTable,
                {
                  rowKey: (r) => r.keyword,
                  loading,
                  columns: topColumns,
                  dataSource: topKeywords.filter((k) => !excluded.some((e) => {
                    var _a, _b;
                    return ((_a = e.word) == null ? void 0 : _a.toLowerCase()) === ((_b = k.keyword) == null ? void 0 : _b.toLowerCase());
                  })),
                  pagination: { pageSize: 20 },
                  size: "small",
                  scroll: { x: true }
                }
              )
            ] })
          },
          {
            key: "search",
            label: "Поиск",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Введите ключевое слово…", value: query, onChange: (e) => setQuery(e.target.value), onPressEnter: runSearch }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: runSearch, disabled: loading || !query.trim(), children: "Искать" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ForwardTable,
                {
                  rowKey: (r) => r.id,
                  loading,
                  columns: searchColumns,
                  dataSource: results,
                  pagination: { pageSize: 20 },
                  size: "small",
                  scroll: { x: true }
                }
              )
            ] }) })
          },
          {
            key: "exclusions",
            label: "Исключения",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              adminError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "danger", children: adminError }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%", marginBottom: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Добавить слово в исключения…", value: newExWord, onChange: (e) => setNewExWord(e.target.value) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addExclusion, type: "primary", children: "Добавить" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ForwardTable,
                {
                  rowKey: (r) => r.id,
                  columns: exclColumns,
                  dataSource: excluded,
                  pagination: { pageSize: 20 },
                  size: "small",
                  scroll: { x: true }
                }
              )
            ] })
          },
          {
            key: "prompt",
            label: "Промпт",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", children: "Системный промпт извлечения ключевых слов. Изменения применяются немедленно. Оставьте пустым, чтобы использовать дефолт." }),
              !promptText.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { style: { marginBottom: 8 }, showIcon: true, type: "warning", message: "Пустой промпт: будет использован дефолтный текст извлечения." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 8, value: promptText, onChange: (e) => setPromptText(e.target.value), style: { width: "100%" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginTop: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: savePrompt, loading: savingPrompt, children: "Сохранить промпт" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadAdminData, children: "Обновить данные" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setPromptText(""), children: "Сбросить на дефолт" })
              ] })
            ] })
          },
          {
            key: "test",
            label: "Тест",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 4, value: testText, onChange: (e) => setTestText(e.target.value), placeholder: "Введите текст для тестового извлечения ключевых слов…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: testExtraction, loading: testing, disabled: !testText.trim(), children: "Тестировать" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ForwardTable,
                {
                  style: { marginTop: 8 },
                  rowKey: (_, idx) => String(idx),
                  columns: testColumns,
                  dataSource: testKeywords || [],
                  pagination: { pageSize: 20 },
                  size: "small",
                  scroll: { x: true }
                }
              )
            ] })
          }
        ]
      }
    )
  ] });
};
export {
  Keywords as default
};
//# sourceMappingURL=Keywords-DItFO3BR.js.map
