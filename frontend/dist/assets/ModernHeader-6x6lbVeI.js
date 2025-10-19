import { a as reactExports, R as React, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, i as useLocation, B as Button, T as Typography, l as Space } from "./index-B4P9h-k1.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import { R as RefIcon$3 } from "./RobotOutlined-B-2S_nNK.js";
import { D as Drawer } from "./index-DhrjGyD_.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import { R as RefIcon$4 } from "./CrownOutlined-D9QrRtN8.js";
import { R as RefIcon$5 } from "./SettingOutlined-COiCZpX-.js";
import { R as RefIcon$6 } from "./QuestionCircleOutlined-NaBnemTa.js";
import { R as RefIcon$7 } from "./FileTextOutlined-lwBP-Cdj.js";
import { R as RefIcon$8 } from "./MessageOutlined-BU8XjoXo.js";
import { R as RefIcon$9 } from "./UserOutlined-DifgQx5K.js";
var CreditCardOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-792 72h752v120H136V232zm752 560H136V440h752v352zm-237-64h165c4.4 0 8-3.6 8-8v-72c0-4.4-3.6-8-8-8H651c-4.4 0-8 3.6-8 8v72c0 4.4 3.6 8 8 8z" } }] }, "name": "credit-card", "theme": "outlined" };
var HomeOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" } }] }, "name": "home", "theme": "outlined" };
var MenuOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" } }] }, "name": "menu", "theme": "outlined" };
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends$2.apply(this, arguments);
}
const CreditCardOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$2({}, props, {
  ref,
  icon: CreditCardOutlined$1
}));
const RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(CreditCardOutlined);
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends$1.apply(this, arguments);
}
const HomeOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$1({}, props, {
  ref,
  icon: HomeOutlined$1
}));
const RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(HomeOutlined);
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
const MenuOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: MenuOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(MenuOutlined);
const UI_VERSION = "2.13.1";
const BUILD_VERSION = "2.13.1";
const API_VERSION = "2.9";
const APP_VERSION_LABEL = `SoulPulse v${UI_VERSION}`;
const FOOTER_VERSION_LINE = `build ${BUILD_VERSION} · api ${API_VERSION} · ui ${UI_VERSION}`;
const { Title, Text } = Typography;
const ModernHeader = ({ activePersonality, embedded = false }) => {
  var _a;
  const [drawerVisible, setDrawerVisible] = reactExports.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isTelegramMiniApp = typeof window !== "undefined" && (!!((_a = window.Telegram) == null ? void 0 : _a.WebApp) || !!window.location.hostname.includes("t.me") || !!window.location.hostname.includes("telegram.org") || !!window.location.hostname.endsWith("soulpulse.art") || !!document.body.classList.contains("telegram-mini-app"));
  React.useEffect(() => {
    var _a2;
    console.log("🔍 ModernHeader Telegram detection:");
    console.log("- hostname:", window.location.hostname);
    console.log("- isTelegramMiniApp:", isTelegramMiniApp);
    console.log("- body classes:", document.body.className);
    console.log("- Telegram WebApp:", !!((_a2 = window.Telegram) == null ? void 0 : _a2.WebApp));
    console.log("- Title color will be:", isTelegramMiniApp ? "var(--sp-text-primary)" : "var(--text-primary)");
    console.log("- Navigation text color will be:", isTelegramMiniApp ? "var(--sp-text-secondary)" : "var(--text-secondary)");
  }, [isTelegramMiniApp]);
  const showDrawer = () => {
    setDrawerVisible(true);
  };
  const onClose = () => {
    setDrawerVisible(false);
  };
  const getActivePageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "Главная";
      case "/prompts":
        return "Личности";
      case "/settings":
        return "Настройки";
      case "/chat":
        return "Чат в приложении";
      case "/llm-settings":
        return "Настройки ИИ";
      case "/architect":
        return "Панель Архитектора";
      case "/soul/goals":
        return "Цели Соул";
      case "/soul/logs":
        return "Соул · Логи";
      case "/soul/activities-goals":
        return "Интеграция Активностей";
      case "/payments":
        return "Платежи";
      case "/help":
        return "Справка";
      case "/chat-management":
        return "Управление чатом";
      default:
        return "SoulPulse";
    }
  };
  const getActivePageIcon = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {});
      case "/prompts":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {});
      case "/settings":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {});
      case "/chat":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, {});
      case "/llm-settings":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {});
      case "/architect":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {});
      case "/soul/goals":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {});
      case "/soul/logs":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {});
      case "/payments":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {});
      case "/help":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {});
      case "/chat-management":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {});
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {});
    }
  };
  const navigationItems = [
    { path: "/", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), label: "Главная" },
    { path: "/webauth", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$9, {}), label: "WebAuth" },
    { path: "/prompts", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}), label: "Личности" },
    { path: "/settings", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), label: "Настройки" },
    { path: "/chat", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, {}), label: "Чат в приложении" },
    { path: "/llm-settings", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}), label: "Настройки ИИ" },
    { path: "/architect", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), label: "Панель Архитектора" },
    { path: "/architect/monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), label: "Monitoring" },
    { path: "/soul/goals", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}), label: "Цели Соул" },
    { path: "/soul/logs", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}), label: "Логи" },
    { path: "/soul/activities-goals", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}), label: "Интеграция Активностей" },
    { path: "/admin/ui/forms", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), label: "Реестр форм" },
    { path: "/all-pages", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}), label: "Все страницы" },
    { path: "/payments", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), label: "Платежи" },
    { path: "/help", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}), label: "Справка" },
    { path: "/chat-management", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), label: "Управление чатом" },
    { path: "/keywords", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}), label: "Ключевые слова" },
    { path: "/dates-reminders", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}), label: "Даты и напоминания" }
  ];
  const handleLogout = () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("telegram_user");
      sessionStorage.removeItem("tg_id");
      localStorage.removeItem("token");
      try {
        navigate("/webauth", { replace: true });
      } catch (e) {
        try {
          window.location.hash = "#/webauth";
        } catch (e2) {
          window.location.replace("/#/webauth");
        }
      }
    } catch (e) {
      try {
        navigate("/webauth", { replace: true });
      } catch (e2) {
        try {
          window.location.hash = "#/webauth";
        } catch (e3) {
          window.location.replace("/#/webauth");
        }
      }
    }
  };
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
  const isActivePage = (path) => {
    return location.pathname === path;
  };
  const routeToStartParam = (path) => {
    switch (path) {
      case "/":
        return "home";
      case "/chat":
        return "chat";
      case "/prompts":
        return "prompts";
      case "/realtime-voice":
        return "realtime";
      case "/all-pages":
        return "all";
      case "/settings":
        return "settings";
      case "/help":
        return "help";
      case "/payments":
        return "payments";
      case "/keywords":
        return "keywords";
      case "/dates-reminders":
        return "reminders";
      default:
        return "home";
    }
  };
  const openInTelegram = () => {
    try {
      const sp = routeToStartParam(location.pathname);
      const tgLink = "tg://resolve?domain=soulpulse_mini_bot&startapp=" + encodeURIComponent(sp);
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
      }, 120);
    } catch (e) {
    }
  };
  const HeaderInner = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "text",
        shape: "circle",
        size: "large",
        "aria-label": "Открыть меню",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { fontSize: 20, color: "var(--sp-color-primary)" } }),
        onClick: showDrawer,
        style: {
          color: "var(--sp-color-primary)",
          flexShrink: 0,
          padding: 6,
          background: "var(--sp-bg-secondary)",
          border: "1px solid var(--sp-border-primary)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          zIndex: 1100
        },
        className: "menu-toggle-btn"
      }
    ),
    (() => {
      try {
        console.log("[ModernHeader] menu button rendered:", !!document.querySelector(".menu-toggle-btn"));
      } catch (e) {
      }
      return null;
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-section", style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-spacing-sm)",
      flex: 1,
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { style: {
        fontSize: "var(--sp-font-size-lg)",
        color: "var(--sp-color-primary)",
        filter: "drop-shadow(0 2px 6px rgba(107,123,209,0.35))",
        flexShrink: 0
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: {
        color: "var(--sp-text-primary)",
        fontSize: "var(--sp-font-size-base)",
        fontWeight: "600",
        display: "block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }, children: "Интеллектуальный чат-бот" }) })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    embedded ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: "var(--sp-spacing-md)" }, children: HeaderInner }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "app-topbar sp-edge-highlight", style: {
      background: "var(--sp-bg-card)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      padding: "var(--sp-spacing-xs) var(--sp-spacing-md)",
      borderBottom: "1px solid var(--sp-border-primary)",
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-spacing-md)",
      position: "sticky",
      top: 0,
      zIndex: 1e3
    }, children: HeaderInner }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Drawer,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: {
            margin: 0,
            color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "var(--sp-text-primary)" : "var(--text-primary)",
            fontWeight: "600"
          }, children: "SoulPulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: {
            color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "rgba(255, 255, 255, 0.9)" : "var(--text-secondary)",
            fontSize: "14px"
          }, children: "Навигация" })
        ] }),
        placement: "right",
        onClose,
        open: drawerVisible,
        styles: {
          body: { padding: "16px", background: "var(--bg-secondary)" },
          header: { background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "menu-content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "current-page", style: {
            background: "var(--bg-card)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
            border: "1px solid var(--border-color)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            getActivePageIcon(),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, style: {
                color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "var(--sp-text-primary)" : "var(--text-primary)",
                fontWeight: "600"
              }, children: getActivePageTitle() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: {
                fontSize: "12px",
                color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "rgba(255, 255, 255, 0.8)" : "var(--text-secondary)",
                opacity: 1
              }, children: "Текущая страница" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navigation-items", children: navigationItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `nav-item ${isActivePage(item.path) ? "active" : ""}`,
              onClick: () => handleNavigation(item.path),
              style: {
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: isActivePage(item.path) ? "var(--primary-color)" : isTelegramMiniApp ? "rgba(0, 0, 0, 0.3)" : "transparent",
                color: isActivePage(item.path) ? "var(--sp-text-primary)" : isTelegramMiniApp ? "var(--sp-text-primary)" : "var(--text-primary)",
                border: isActivePage(item.path) ? "none" : "1px solid var(--border-color)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-icon", style: { marginRight: "12px", fontSize: "18px" }, children: item.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-text", children: item.label })
              ]
            },
            item.path
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { style: { borderColor: "var(--border-color)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", block: true, onClick: openInTelegram, children: "Открыть в Telegram" }) }),
          activePersonality && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "active-personality", style: {
            background: "var(--bg-card)",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, { style: {
              color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "var(--sp-color-warning)" : "var(--accent-color)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, style: {
                color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "var(--sp-text-primary)" : "var(--text-primary)",
                fontWeight: "600"
              }, children: "Активная личность" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: {
                color: isTelegramMiniApp || window.location.hostname.endsWith("soulpulse.art") ? "var(--sp-text-secondary)" : "var(--text-secondary)",
                opacity: 1
              }, children: activePersonality })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-footer", style: {
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-color)",
            textAlign: "center"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleLogout, danger: true, block: true, children: "Выйти" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", style: { fontSize: "12px" }, children: APP_VERSION_LABEL }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", style: { fontSize: "10px", opacity: 0.8 }, children: FOOTER_VERSION_LINE })
          ] }) })
        ] })
      }
    )
  ] });
};
const ModernHeader$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ModernHeader
}, Symbol.toStringTag, { value: "Module" }));
export {
  ModernHeader as M,
  RefIcon$1 as R,
  RefIcon$2 as a,
  ModernHeader$1 as b
};
//# sourceMappingURL=ModernHeader-6x6lbVeI.js.map
