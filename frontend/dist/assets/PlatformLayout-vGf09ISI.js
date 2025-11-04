import { a as reactExports, R as React, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { t as toArray, S as Sider$1, C as ConfigContext, o as omit, d as useComponentConfig, e as useStyle, f as classNames, _ as _toConsumableArray, L as LayoutContext, h as SiderContext, u as useNavigate, i as useLocation, b as usePermissions, a as usePlatform, M as Menu, j as buildAuthHeaders, s as staticMethods, k as useTheme, B as Button, D as Dropdown, l as Space, T as Typography, A as API_BASE } from "./index-B4P9h-k1.js";
import { R as RefIcon$3 } from "./SafetyOutlined-BeV9iQ8R.js";
import { R as RefIcon$4 } from "./QuestionCircleOutlined-NaBnemTa.js";
import { R as RefIcon$5, a as RefIcon$6, M as ModernHeader } from "./ModernHeader-6x6lbVeI.js";
import { R as RefIcon$7 } from "./ToolOutlined-CvOl4XRE.js";
import { R as RefIcon$8 } from "./CalendarOutlined-CrDxWlMe.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import { R as RefIcon$9 } from "./BulbOutlined-DdwdCCj7.js";
import { R as RefIcon$a } from "./SettingOutlined-COiCZpX-.js";
import { R as RefIcon$b } from "./MessageOutlined-BU8XjoXo.js";
import { R as RefIcon$c } from "./CheckOutlined-B3SxkmQa.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./RobotOutlined-B-2S_nNK.js";
import "./index-DhrjGyD_.js";
import "./context-CGIstv1h.js";
import "./Skeleton-D3e3aC7P.js";
import "./index-B_ub_kOm.js";
import "./CrownOutlined-D9QrRtN8.js";
import "./FileTextOutlined-lwBP-Cdj.js";
import "./UserOutlined-DifgQx5K.js";
import "./CalendarOutlined-B_ajlQ0Y.js";
function useHasSider(siders, children, hasSider) {
  if (typeof hasSider === "boolean") {
    return hasSider;
  }
  if (siders.length) {
    return true;
  }
  const childNodes = toArray(children);
  return childNodes.some((node) => node.type === Sider$1);
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function generator({
  suffixCls,
  tagName,
  displayName
}) {
  return (BasicComponent) => {
    const Adapter = /* @__PURE__ */ reactExports.forwardRef((props, ref) => /* @__PURE__ */ reactExports.createElement(BasicComponent, Object.assign({
      ref,
      suffixCls,
      tagName
    }, props)));
    return Adapter;
  };
}
const Basic = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    suffixCls,
    className,
    tagName: TagName
  } = props, others = __rest(props, ["prefixCls", "suffixCls", "className", "tagName"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("layout", customizePrefixCls);
  const [wrapSSR, hashId, cssVarCls] = useStyle(prefixCls);
  const prefixWithSuffixCls = suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
  return wrapSSR(/* @__PURE__ */ reactExports.createElement(TagName, Object.assign({
    className: classNames(customizePrefixCls || prefixWithSuffixCls, className, hashId, cssVarCls),
    ref
  }, others)));
});
const BasicLayout = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    direction
  } = reactExports.useContext(ConfigContext);
  const [siders, setSiders] = reactExports.useState([]);
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    children,
    hasSider,
    tagName: Tag,
    style
  } = props, others = __rest(props, ["prefixCls", "className", "rootClassName", "children", "hasSider", "tagName", "style"]);
  const passedProps = omit(others, ["suffixCls"]);
  const {
    getPrefixCls,
    className: contextClassName,
    style: contextStyle
  } = useComponentConfig("layout");
  const prefixCls = getPrefixCls("layout", customizePrefixCls);
  const mergedHasSider = useHasSider(siders, children, hasSider);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const classString = classNames(prefixCls, {
    [`${prefixCls}-has-sider`]: mergedHasSider,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, contextClassName, className, rootClassName, hashId, cssVarCls);
  const contextValue = reactExports.useMemo(() => ({
    siderHook: {
      addSider: (id) => {
        setSiders((prev) => [].concat(_toConsumableArray(prev), [id]));
      },
      removeSider: (id) => {
        setSiders((prev) => prev.filter((currentId) => currentId !== id));
      }
    }
  }), []);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(LayoutContext.Provider, {
    value: contextValue
  }, /* @__PURE__ */ reactExports.createElement(Tag, Object.assign({
    ref,
    className: classString,
    style: Object.assign(Object.assign({}, contextStyle), style)
  }, passedProps), children)));
});
const Layout$1 = generator({
  tagName: "div",
  displayName: "Layout"
})(BasicLayout);
const Header$1 = generator({
  suffixCls: "header",
  tagName: "header",
  displayName: "Header"
})(Basic);
const Footer = generator({
  suffixCls: "footer",
  tagName: "footer",
  displayName: "Footer"
})(Basic);
const Content$1 = generator({
  suffixCls: "content",
  tagName: "main",
  displayName: "Content"
})(Basic);
const Layout = Layout$1;
Layout.Header = Header$1;
Layout.Footer = Footer;
Layout.Content = Content$1;
Layout.Sider = Sider$1;
Layout._InternalSiderContext = SiderContext;
var MoonOutlined$1 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M489.5 111.66c30.65-1.8 45.98 36.44 22.58 56.33A243.35 243.35 0 00426 354c0 134.76 109.24 244 244 244 72.58 0 139.9-31.83 186.01-86.08 19.87-23.38 58.07-8.1 56.34 22.53C900.4 745.82 725.15 912 512.5 912 291.31 912 112 732.69 112 511.5c0-211.39 164.29-386.02 374.2-399.65l.2-.01zm-81.15 79.75l-4.11 1.36C271.1 237.94 176 364.09 176 511.5 176 697.34 326.66 848 512.5 848c148.28 0 274.94-96.2 319.45-230.41l.63-1.93-.11.07a307.06 307.06 0 01-159.73 46.26L670 662c-170.1 0-308-137.9-308-308 0-58.6 16.48-114.54 46.27-162.47z" } }] }, "name": "moon", "theme": "outlined" };
var SunOutlined$1 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M548 818v126a16 16 0 01-16 16h-40a16 16 0 01-16-16V818c15.85 1.64 27.84 2.46 36 2.46 8.15 0 20.16-.82 36-2.46m205.25-115.66l89.1 89.1a16 16 0 010 22.62l-28.29 28.29a16 16 0 01-22.62 0l-89.1-89.1c12.37-10.04 21.43-17.95 27.2-23.71 5.76-5.77 13.67-14.84 23.71-27.2m-482.5 0c10.04 12.36 17.95 21.43 23.71 27.2 5.77 5.76 14.84 13.67 27.2 23.71l-89.1 89.1a16 16 0 01-22.62 0l-28.29-28.29a16 16 0 010-22.63zM512 278c129.24 0 234 104.77 234 234S641.24 746 512 746 278 641.24 278 512s104.77-234 234-234m0 72c-89.47 0-162 72.53-162 162s72.53 162 162 162 162-72.53 162-162-72.53-162-162-162M206 476c-1.64 15.85-2.46 27.84-2.46 36 0 8.15.82 20.16 2.46 36H80a16 16 0 01-16-16v-40a16 16 0 0116-16zm738 0a16 16 0 0116 16v40a16 16 0 01-16 16H818c1.64-15.85 2.46-27.84 2.46-36 0-8.15-.82-20.16-2.46-36zM814.06 180.65l28.29 28.29a16 16 0 010 22.63l-89.1 89.09c-10.04-12.37-17.95-21.43-23.71-27.2-5.77-5.76-14.84-13.67-27.2-23.71l89.1-89.1a16 16 0 0122.62 0m-581.5 0l89.1 89.1c-12.37 10.04-21.43 17.95-27.2 23.71-5.76 5.77-13.67 14.84-23.71 27.2l-89.1-89.1a16 16 0 010-22.62l28.29-28.29a16 16 0 0122.62 0M532 64a16 16 0 0116 16v126c-15.85-1.64-27.84-2.46-36-2.46-8.15 0-20.16.82-36 2.46V80a16 16 0 0116-16z" } }] }, "name": "sun", "theme": "outlined" };
var TagsOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M483.2 790.3L861.4 412c1.7-1.7 2.5-4 2.3-6.3l-25.5-301.4c-.7-7.8-6.8-13.9-14.6-14.6L522.2 64.3c-2.3-.2-4.7.6-6.3 2.3L137.7 444.8a8.03 8.03 0 000 11.3l334.2 334.2c3.1 3.2 8.2 3.2 11.3 0zm62.6-651.7l224.6 19 19 224.6L477.5 694 233.9 450.5l311.9-311.9zm60.16 186.23a48 48 0 1067.88-67.89 48 48 0 10-67.88 67.89zM889.7 539.8l-39.6-39.5a8.03 8.03 0 00-11.3 0l-362 361.3-237.6-237a8.03 8.03 0 00-11.3 0l-39.6 39.5a8.03 8.03 0 000 11.3l243.2 242.8 39.6 39.5c3.1 3.1 8.2 3.1 11.3 0l407.3-406.6c3.1-3.1 3.1-8.2 0-11.3z" } }] }, "name": "tags", "theme": "outlined" };
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
const MoonOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$2({}, props, {
  ref,
  icon: MoonOutlined$1
}));
const RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(MoonOutlined);
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
const SunOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$1({}, props, {
  ref,
  icon: SunOutlined$1
}));
const RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(SunOutlined);
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
const TagsOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: TagsOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(TagsOutlined);
function inferGroupByPath(path) {
  if (path.startsWith("/chat") || path.startsWith("/telegram-chat") || path.startsWith("/chat-management")) return "chat";
  if (path.startsWith("/soul/")) return "soul";
  if (path === "/admin" || path.startsWith("/admin/") || path.startsWith("/rbac")) return "admin";
  if (path === "/settings" || path === "/llm-settings" || path === "/payments" || path === "/help" || path === "/keywords") return "settings";
  return "core";
}
const iconMap = {
  MessageOutlined: RefIcon$b,
  SettingOutlined: RefIcon$a,
  BulbOutlined: RefIcon$9,
  TagsOutlined: RefIcon,
  CalendarOutlined: RefIcon$8,
  ToolOutlined: RefIcon$7,
  CreditCardOutlined: RefIcon$6,
  HomeOutlined: RefIcon$5,
  QuestionCircleOutlined: RefIcon$4,
  SafetyOutlined: RefIcon$3
};
const PermissionBasedMenu = ({ inlineCollapsed = false, modeOverride }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: permissionsState } = usePermissions();
  const { isMiniApp } = usePlatform();
  const [uiConfig, setUiConfig] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [fadeIn, setFadeIn] = reactExports.useState(false);
  const abortRef = React.useRef(null);
  const seqRef = React.useRef(0);
  reactExports.useEffect(() => {
    const fetchUIConfig = async () => {
      try {
        setLoading(true);
        try {
          const raw = sessionStorage.getItem("sp_ui_config");
          const atRaw = sessionStorage.getItem("sp_ui_config_at");
          const fresh = atRaw ? Date.now() - Number(atRaw) < 5 * 60 * 1e3 : false;
          if (raw && fresh && !uiConfig) {
            setUiConfig(JSON.parse(raw));
          }
        } catch (e) {
        }
        const tgIdQuick = (() => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          try {
            const wa = typeof window !== "undefined" ? (_a = window.Telegram) == null ? void 0 : _a.WebApp : void 0;
            const waId = (_d = (_c = (_b = wa == null ? void 0 : wa.initDataUnsafe) == null ? void 0 : _b.user) == null ? void 0 : _c.id) == null ? void 0 : _d.toString();
            if (waId) return waId;
          } catch (e) {
          }
          try {
            const sid = (_e = window.sessionStorage) == null ? void 0 : _e.getItem("tg_id");
            if (sid) return sid;
          } catch (e) {
          }
          try {
            const tok = typeof window !== "undefined" ? ((_f = window.sessionStorage) == null ? void 0 : _f.getItem("token")) || ((_g = window.localStorage) == null ? void 0 : _g.getItem("token")) : null;
            if (tok) {
              const parts = tok.split(".");
              if (parts.length >= 2) {
                const pad = (s) => s + "=".repeat((4 - s.length % 4) % 4);
                const b64 = pad(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
                const json = typeof atob === "function" ? decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")) : "";
                if (json) {
                  const payload = JSON.parse(json);
                  const claim = String(payload.tg_id || payload.sub || "");
                  if (claim) {
                    try {
                      (_h = window.sessionStorage) == null ? void 0 : _h.setItem("tg_id", claim);
                    } catch (e) {
                    }
                    return claim;
                  }
                }
              }
            }
          } catch (e) {
          }
          return "";
        })();
        if (!tgIdQuick) {
          setUiConfig(null);
          try {
            console.log("[Menu] No tg_id. UI menu disabled until auth.");
          } catch (e) {
          }
          return;
        }
        if (abortRef.current) {
          try {
            abortRef.current.abort();
          } catch (e) {
          }
        }
        abortRef.current = new AbortController();
        const mySeq = ++seqRef.current;
        let response = await fetch("/api/ui/config", { headers: buildAuthHeaders(), signal: abortRef.current.signal });
        if (!response.ok) {
          response = await fetch("/api/user/ui-config", { headers: buildAuthHeaders(), signal: abortRef.current.signal });
        }
        if (response.status === 401) {
          setUiConfig(null);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const config = await response.json();
        const roles = Array.isArray(config.roles) ? config.roles : [];
        const items = Array.isArray(config.menu_items) ? config.menu_items : [];
        if (mySeq !== seqRef.current) return;
        const nextConfig = { ...config, roles, menu_items: items };
        const prevJson = uiConfig ? JSON.stringify(uiConfig) : "";
        const nextJson = JSON.stringify(nextConfig);
        if (prevJson !== nextJson) {
          setUiConfig(nextConfig);
          try {
            sessionStorage.setItem("sp_ui_config", nextJson);
            sessionStorage.setItem("sp_ui_config_at", String(Date.now()));
          } catch (e) {
          }
        }
        try {
          console.log("[Menu] Loaded from API, items:", items.length, "mode:", getMenuMode());
        } catch (e) {
        }
      } catch (error) {
        console.error("Ошибка загрузки конфигурации UI:", error);
        staticMethods.error("Не удалось загрузить конфигурацию меню");
        if (!uiConfig) setUiConfig(null);
        try {
          console.log("[Menu] Error loading. UI menu disabled.");
        } catch (e) {
        }
      } finally {
        setLoading(false);
      }
    };
    if (!permissionsState.loading) {
      fetchUIConfig().then(() => {
        try {
          setTimeout(() => setFadeIn(true), 50);
        } catch (e) {
        }
      });
    }
  }, [permissionsState.loading]);
  const handleMenuClick = (item) => {
    if (item.key === "all-pages") {
      navigate("/all-pages");
      return;
    }
    const menuItem = uiConfig == null ? void 0 : uiConfig.menu_items.find((mi) => mi.key === item.key);
    if (menuItem) navigate(menuItem.path);
  };
  const selectedKeys = reactExports.useMemo(() => {
    if (!uiConfig) return [];
    const currentPath = location.pathname;
    const activeItem = uiConfig.menu_items.find((item) => item.path === currentPath);
    return activeItem ? [activeItem.key] : [];
  }, [uiConfig, location.pathname]);
  reactExports.useMemo(() => {
    const groups = { core: [], chat: [], soul: [], admin: [], settings: [] };
    ((uiConfig == null ? void 0 : uiConfig.menu_items) || []).forEach((mi) => {
      const g = mi.group || inferGroupByPath(mi.path);
      groups[g] = groups[g] || [];
      groups[g].push(mi);
    });
    return groups;
  }, [uiConfig]);
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {});
  };
  const getMenuMode = () => {
    return modeOverride ? modeOverride : isMiniApp ? "horizontal" : "inline";
  };
  if (loading || permissionsState.loading) {
    const mode = getMenuMode();
    if (mode === "horizontal") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 12, padding: "8px 12px" }, children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 80, height: 18, borderRadius: 9, background: "linear-gradient(90deg, rgba(200,200,200,0.25), rgba(160,160,160,0.35), rgba(200,200,200,0.25))", animation: "sp-skeleton 1.2s ease-in-out infinite", opacity: 0.8 } }, i)) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 12 }, children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 6px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 18, height: 18, borderRadius: 4, background: "linear-gradient(90deg, rgba(200,200,200,0.25), rgba(160,160,160,0.35), rgba(200,200,200,0.25))", animation: "sp-skeleton 1.2s ease-in-out infinite" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: "0 0 160px", height: 14, borderRadius: 7, background: "linear-gradient(90deg, rgba(200,200,200,0.25), rgba(160,160,160,0.35), rgba(200,200,200,0.25))", animation: "sp-skeleton 1.2s ease-in-out infinite" } })
    ] }, i)) });
  }
  if (!uiConfig) {
    const fallbackItems = [
      { key: "home", label: "Главная", icon: "HomeOutlined", path: "/" },
      { key: "chat", label: "Чат", icon: "MessageOutlined", path: "/chat" },
      { key: "reminders", label: "Напоминания", icon: "CalendarOutlined", path: "/reminders" }
    ];
    if (getMenuMode() === "horizontal") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Menu,
        {
          mode: "horizontal",
          onClick: handleMenuClick,
          style: { borderBottom: "none", backgroundColor: "transparent", transition: "opacity 180ms ease", opacity: fadeIn ? 1 : 1e-3 },
          items: [...fallbackItems.map((it) => ({ key: it.key, icon: renderIcon(it.icon), label: it.label }))]
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Menu,
      {
        mode: "inline",
        onClick: handleMenuClick,
        style: { transition: "opacity 180ms ease", opacity: fadeIn ? 1 : 1e-3 },
        items: [...fallbackItems.map((it) => ({ key: it.key, icon: renderIcon(it.icon), label: it.label }))]
      }
    );
  }
  if (getMenuMode() === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Menu,
      {
        mode: "horizontal",
        selectedKeys,
        onClick: handleMenuClick,
        style: {
          borderBottom: "none",
          backgroundColor: "transparent",
          justifyContent: "center",
          minWidth: 0,
          flexWrap: "nowrap",
          overflowX: "auto",
          transition: "opacity 180ms ease",
          opacity: fadeIn ? 1 : 1e-3
        },
        items: [
          ...uiConfig.menu_items.map((item) => ({
            key: item.key,
            icon: renderIcon(item.icon),
            label: item.label
          })),
          { key: "reminders", label: "Напоминания", icon: renderIcon("CalendarOutlined") },
          { key: "all-pages", label: "Все страницы", icon: renderIcon("QuestionCircleOutlined") }
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Menu,
    {
      mode: "inline",
      selectedKeys,
      onClick: handleMenuClick,
      style: { height: "100%", borderRight: 0, transition: "opacity 180ms ease", opacity: fadeIn ? 1 : 1e-3 },
      inlineCollapsed,
      items: [
        ...uiConfig.menu_items.map((item) => ({
          key: item.key,
          icon: renderIcon(item.icon),
          label: item.label
        })),
        { key: "reminders", icon: renderIcon("CalendarOutlined"), label: "Напоминания" },
        { key: "all-pages", icon: renderIcon("QuestionCircleOutlined"), label: "Все страницы" }
      ]
    }
  );
};
const { Text } = Typography;
const ThemeToggle = ({
  size = "middle",
  variant = "icon",
  showText = false,
  style,
  className
}) => {
  const {
    currentTheme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isAuto,
    availableThemes
  } = useTheme();
  const getThemeIcon = (theme) => {
    switch (theme) {
      case "light":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {});
      case "dark":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {});
      case "auto":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$a, {});
      case "resolved":
        return resolvedTheme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {});
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$a, {});
    }
  };
  const getThemeName = (theme) => {
    switch (theme) {
      case "light":
        return "Светлая";
      case "dark":
        return "Темная";
      case "auto":
        return "Авто";
      default:
        return "Неизвестная";
    }
  };
  const getThemeDescription = (theme) => {
    switch (theme) {
      case "light":
        return "Светлая тема для дневного использования";
      case "dark":
        return "Темная тема для комфортного просмотра";
      case "auto":
        return "Автоматически следует системным настройкам";
      default:
        return "";
    }
  };
  if (variant === "icon") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "text",
        size,
        icon: getThemeIcon("resolved"),
        onClick: toggleTheme,
        style: {
          color: "var(--sp-text-primary)",
          ...style
        },
        className,
        title: `Текущая тема: ${getThemeName(currentTheme)}${isAuto ? ` (${resolvedTheme})` : ""}`
      }
    );
  }
  if (variant === "button") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "default",
        size,
        icon: getThemeIcon("resolved"),
        onClick: toggleTheme,
        style,
        className,
        children: showText && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          getThemeName(currentTheme),
          isAuto && ` (${resolvedTheme})`
        ] })
      }
    );
  }
  if (variant === "dropdown") {
    const menuItems = availableThemes.map((theme) => ({
      key: theme,
      label: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        getThemeIcon(theme),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: currentTheme === theme ? 600 : 400 }, children: [
            getThemeName(theme),
            currentTheme === theme && /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$c, { style: { marginLeft: 8, color: "var(--sp-color-success)" } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", style: { fontSize: "12px" }, children: getThemeDescription(theme) })
        ] })
      ] }),
      onClick: () => setTheme(theme)
    }));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dropdown,
      {
        menu: { items: menuItems },
        placement: "bottomRight",
        trigger: ["click"],
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "text",
            size,
            style: {
              color: "var(--sp-text-primary)",
              ...style
            },
            className,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
              getThemeIcon("resolved"),
              showText && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                getThemeName(currentTheme),
                isAuto && ` (${resolvedTheme})`
              ] })
            ] })
          }
        )
      }
    );
  }
  return null;
};
const BuildBadge = () => {
  const buildId = (() => {
    try {
      return String(window.__SP_BUILD__ || "");
    } catch (e) {
      return "";
    }
  })();
  if (!buildId) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "var(--sp-text-secondary)", opacity: 0.8 }, title: "Build ID", children: [
    "build: ",
    buildId
  ] });
};
const getFlags = () => {
  try {
    return window.__SP_FLAGS__ || {};
  } catch (e) {
    return {};
  }
};
const getBuildId = () => {
  try {
    return String(window.__SP_BUILD__ || "unknown");
  } catch (e) {
    return "unknown";
  }
};
const getRouterKind = () => {
  return "MemoryRouter";
};
const getUa = () => {
  try {
    return navigator.userAgent;
  } catch (e) {
    return "";
  }
};
const isDiagEnabled = () => {
  try {
    const usp = new URLSearchParams(window.location.search);
    if (usp.get("diag") === "1") return true;
    const flags = getFlags();
    return flags.DIAG === true;
  } catch (e) {
    return false;
  }
};
const Section = ({ title, children, ...rest }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 8 }, ...rest, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#9CA3AF", marginBottom: 4 }, children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }, children })
] });
const DiagPanel = () => {
  if (!isDiagEnabled()) return null;
  const flags = getFlags();
  const buildId = getBuildId();
  const href = (() => {
    try {
      return window.location.href;
    } catch (e) {
      return "";
    }
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "fixed",
        right: 8,
        bottom: 8,
        zIndex: 2147483647,
        background: "rgba(2,6,23,0.92)",
        color: "#E5E7EB",
        border: "1px solid rgba(51,65,85,0.7)",
        borderRadius: 8,
        padding: 10,
        maxWidth: 380,
        boxShadow: "0 6px 24px rgba(0,0,0,0.35)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, marginBottom: 8 }, children: "DIAG" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Build", children: buildId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "API_BASE", children: API_BASE }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Router", children: getRouterKind() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Flags", children: (() => {
          try {
            return JSON.stringify(flags, null, 2);
          } catch (e) {
            return "{}";
          }
        })() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Location", children: href }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "User-Agent", children: getUa() })
      ]
    }
  );
};
const { Header, Content, Sider } = Layout;
const PlatformLayout = ({
  children,
  activePersonality,
  headerOnly = false
}) => {
  const { isMiniApp } = usePlatform();
  useTheme();
  const getMiniAppStyles = () => ({
    height: "100dvh",
    overflow: "hidden",
    background: "var(--sp-gradient-background)",
    boxSizing: "border-box"
  });
  const getWebStyles = () => ({
    minHeight: "100vh",
    background: "var(--sp-gradient-background)"
  });
  if (isMiniApp) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { style: getMiniAppStyles(), className: "sp-platform-container sp-platform-telegram telegram-mini-app", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sp-greeting", style: { padding: "4px 8px", fontWeight: 600 }, children: "Привет!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Header,
        {
          className: "sp-header",
          style: {
            padding: "0 var(--sp-spacing-md)",
            height: "var(--sp-platform-header-height)",
            background: "var(--sp-bg-card)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid var(--sp-border-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBoundary, { label: "ModernHeader", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModernHeader, { activePersonality }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBoundary, { label: "ThemeToggle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, { variant: "icon", size: "small" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Content,
        {
          className: "sp-content",
          style: {
            padding: "var(--sp-spacing-sm)",
            overflowX: "hidden",
            overflowY: "auto",
            height: headerOnly ? "calc(100vh - var(--sp-platform-header-height))" : "calc(100vh - var(--sp-platform-header-height) - 60px)"
          },
          children
        }
      ),
      !headerOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "sp-bottom-menu",
          style: {
            height: "60px",
            background: "var(--sp-bg-card)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid var(--sp-border-primary)",
            display: "flex",
            alignItems: "center",
            padding: "0 var(--sp-spacing-sm)",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionBasedMenu, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto", paddingLeft: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BuildBadge, {}) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DiagPanel, {})
    ] });
  }
  const [collapsed, setCollapsed] = React.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { style: getWebStyles(), className: "sp-platform-container sp-platform-web", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sp-greeting", style: { padding: "4px 8px", fontWeight: 600 }, children: "Привет!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Header,
      {
        className: "sp-header",
        style: {
          padding: "0 var(--sp-spacing-lg)",
          height: "var(--sp-platform-header-height)",
          background: "var(--sp-bg-card)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--sp-border-primary)",
          position: "sticky",
          top: 0,
          zIndex: 2e3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBoundary, { label: "ModernHeader", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModernHeader, { activePersonality }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBoundary, { label: "ThemeToggle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, { variant: "dropdown", showText: true }) })
        ]
      }
    ),
    headerOnly ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        className: "sp-content",
        style: {
          padding: "var(--sp-spacing-lg)",
          minHeight: "calc(100vh - var(--sp-platform-header-height))",
          overflow: "auto"
        },
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BuildBadge, {}) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { className: "sp-layout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Sider,
        {
          className: "sp-sidebar",
          width: 250,
          breakpoint: "lg",
          collapsible: true,
          collapsed,
          onCollapse: (val) => setCollapsed(val),
          onBreakpoint: (broken) => setCollapsed(broken),
          collapsedWidth: 64,
          style: {
            background: "var(--sp-bg-secondary)",
            backdropFilter: "blur(10px)",
            borderRight: "1px solid var(--sp-border-primary)",
            height: "calc(100vh - var(--sp-platform-header-height))",
            position: "sticky",
            top: "var(--sp-platform-header-height)",
            overflow: "auto"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--sp-spacing-md) 0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBoundary, { label: "PermissionBasedMenu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionBasedMenu, { inlineCollapsed: collapsed }) }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Content,
        {
          className: "sp-content",
          style: {
            padding: "var(--sp-spacing-lg)",
            minHeight: "calc(100vh - var(--sp-platform-header-height))",
            overflow: "auto"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBoundary, { label: "PageContent", children }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BuildBadge, {}) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DiagPanel, {})
  ] });
};
class SectionBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, err: error };
  }
  componentDidCatch(error, info) {
    try {
      console.error("[SectionBoundary]", this.props.label, error, info);
    } catch (e) {
    }
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 6, border: "1px dashed #ef4444", borderRadius: 6, color: "#ef4444", background: "rgba(239,68,68,0.06)" }, children: [
        this.props.label,
        " ошибка"
      ] });
    }
    return this.props.children;
  }
}
export {
  PlatformLayout as default
};
//# sourceMappingURL=PlatformLayout-vGf09ISI.js.map
