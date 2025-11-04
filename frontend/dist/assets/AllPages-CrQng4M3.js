import { j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, l as Space, T as Typography, p as Tag, B as Button } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { L as List } from "./index-CG-iaDjq.js";
import "./Skeleton-D3e3aC7P.js";
import "./row-BcQp44VL.js";
import "./index-BlJydARW.js";
const { Title, Text } = Typography;
const ROUTES = [
  { path: "/", label: "Главная", group: "core" },
  { path: "/webauth", label: "WebAuth", group: "core" },
  { path: "/register", label: "Регистрация", group: "core" },
  { path: "/chat", label: "Чат (MiniApp)", group: "chat" },
  { path: "/telegram-chat", label: "Телеграм-чат", group: "chat" },
  { path: "/prompts", label: "Личности", group: "core" },
  { path: "/settings", label: "Настройки", group: "settings" },
  { path: "/llm-settings", label: "LLM Settings", group: "settings" },
  { path: "/llm-params", label: "LLM Params", group: "settings" },
  { path: "/payments", label: "Платежи", group: "settings" },
  { path: "/help", label: "Справка", group: "core" },
  { path: "/permission-demo", label: "Permission Demo", group: "core" },
  { path: "/chat-management", label: "Управление чатом", group: "admin" },
  { path: "/keywords", label: "Ключевые слова", group: "core" },
  { path: "/dates-reminders", label: "Календарь/Напоминания", group: "core" },
  { path: "/soul/dashboard", label: "Soul Dashboard", group: "soul" },
  { path: "/soul/goals", label: "Soul Goals", group: "soul" },
  { path: "/soul/optimization", label: "Soul Optimization", group: "soul" },
  { path: "/soul/visualization", label: "Soul Visualization", group: "soul" },
  { path: "/soul/logs", label: "Soul Logs", group: "soul" },
  { path: "/soul/quants", label: "Soul Quants", group: "soul" },
  { path: "/security", label: "Панель безопасности", group: "admin" },
  { path: "/security/events", label: "События безопасности", group: "admin" },
  { path: "/security/red-team", label: "Security Red-Team", group: "admin" },
  { path: "/rs/dashboard", label: "RS Dashboard", group: "admin" },
  { path: "/architect", label: "Панель Архитектора", group: "admin" },
  { path: "/architect/monitoring", label: "Monitoring Dashboard", group: "admin" },
  { path: "/admin", label: "Админ-панель", group: "admin" },
  { path: "/admin/settings", label: "Системные настройки", group: "admin" },
  { path: "/admin/gendarme", label: "Gendarme", group: "admin" },
  { path: "/rbac-admin", label: "RBAC Admin", group: "admin" },
  { path: "/admin/ui/forms", label: "UI Forms Registry", group: "admin" },
  { path: "/admin/bot-control", label: "Bot Control", group: "admin" },
  { path: "/admin/resilience", label: "Resilience Admin", group: "admin" },
  { path: "/trace", label: "Trace", group: "dev" },
  { path: "/original-home", label: "Original Home", group: "dev" }
  // Удалено: ML Grafana (внешний переход). Используем встроенные маршруты.
];
const BUTTON_STYLE = {
  background: "linear-gradient(180deg, rgba(99,102,241,0.18), rgba(99,102,241,0.08))",
  border: "1px solid rgba(99,102,241,0.55)",
  boxShadow: "0 6px 16px rgba(99,102,241,0.22)",
  color: "var(--sp-text-primary)"
};
const INDEX_TAG_COLOR = "geekblue";
const prettyIndex = (i) => String(i + 1).padStart(2, "0");
const groupColor = (g) => {
  switch (g) {
    case "admin":
      return "red";
    case "soul":
      return "blue";
    case "chat":
      return "purple";
    case "settings":
      return "gold";
    case "core":
      return "green";
    default:
      return "default";
  }
};
const AllPages = () => {
  const navigate = useNavigate();
  const open = (p) => {
    try {
      if (p === "/telegram-chat") {
        const tgLink = "tg://resolve?domain=soulpulse_mini_bot";
        const webLink = "https://t.me/soulpulse_mini_bot";
        try {
          window.location.href = tgLink;
        } catch (e) {
        }
        setTimeout(() => {
          try {
            window.open(webLink, "_blank");
          } catch (e) {
          }
        }, 100);
        return;
      }
      navigate(p);
    } catch (e) {
      try {
        window.location.assign(p);
      } catch (e2) {
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 16, style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 2, style: { margin: 0 }, children: "Все страницы проекта" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Диагностический список для быстрого перехода и проверки открытия форм" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "sp-card-elevated sp-edge-highlight", style: { background: "var(--sp-bg-card)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      List,
      {
        dataSource: ROUTES,
        renderItem: (it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          List.Item,
          {
            actions: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => open(it.path),
                  style: { ...BUTTON_STYLE, padding: "4px 10px", height: 28 },
                  children: "Открыть"
                },
                "open"
              )
            ],
            style: { borderBottom: "1px solid var(--sp-border-primary)", paddingTop: 10, paddingBottom: 10 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: 12, wrap: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: groupColor(it.group), children: it.group }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: INDEX_TAG_COLOR, children: prettyIndex(idx) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, style: { minWidth: 180, textAlign: "left" }, children: it.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { code: true, children: it.path })
            ] })
          }
        )
      }
    ) })
  ] }) });
};
export {
  AllPages as default
};
//# sourceMappingURL=AllPages-CrQng4M3.js.map
