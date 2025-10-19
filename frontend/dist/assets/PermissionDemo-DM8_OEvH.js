import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { b as usePermissions, B as Button, aB as Tooltip, a as usePlatform, T as Typography, l as Space, p as Tag, aM as PermissionGate, cD as PlatformGate } from "./index-B4P9h-k1.js";
import { R as RefIcon$3 } from "./LockOutlined-C1Rl7fRm.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import { R as RefIcon$4 } from "./CrownOutlined-D9QrRtN8.js";
import { R as RefIcon$5 } from "./UserOutlined-DifgQx5K.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon$6 } from "./ToolOutlined-CvOl4XRE.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import "./Skeleton-D3e3aC7P.js";
var DesktopOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M928 140H96c-17.7 0-32 14.3-32 32v496c0 17.7 14.3 32 32 32h380v112H304c-8.8 0-16 7.2-16 16v48c0 4.4 3.6 8 8 8h432c4.4 0 8-3.6 8-8v-48c0-8.8-7.2-16-16-16H548V700h380c17.7 0 32-14.3 32-32V172c0-17.7-14.3-32-32-32zm-40 488H136V212h752v416z" } }] }, "name": "desktop", "theme": "outlined" };
var MobileOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64zm-8 824H288V134h448v752zM472 784a40 40 0 1080 0 40 40 0 10-80 0z" } }] }, "name": "mobile", "theme": "outlined" };
var UnlockOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M832 464H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v68c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-68c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zm-40 376H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z" } }] }, "name": "unlock", "theme": "outlined" };
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
const DesktopOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$2({}, props, {
  ref,
  icon: DesktopOutlined$1
}));
const RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(DesktopOutlined);
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
const MobileOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$1({}, props, {
  ref,
  icon: MobileOutlined$1
}));
const RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(MobileOutlined);
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
const UnlockOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: UnlockOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(UnlockOutlined);
const PermissionButton = ({
  permission,
  role,
  requireAll = false,
  fallbackText = "Недостаточно прав",
  showTooltip = true,
  children,
  disabled,
  ...buttonProps
}) => {
  const { hasPermission, hasRole } = usePermissions();
  const checkAccess = () => {
    const conditions = [];
    if (permission) {
      conditions.push(hasPermission(permission));
    }
    if (role) {
      conditions.push(hasRole(role));
    }
    if (conditions.length === 0) {
      return true;
    }
    return requireAll ? conditions.every(Boolean) : conditions.some(Boolean);
  };
  const hasAccess = checkAccess();
  const isDisabled = disabled || !hasAccess;
  const getTooltipText = () => {
    if (disabled && hasAccess) {
      return "Кнопка отключена";
    }
    if (!hasAccess) {
      const missingItems = [];
      if (permission && !hasPermission(permission)) {
        missingItems.push(`право "${permission}"`);
      }
      if (role && !hasRole(role)) {
        missingItems.push(`роль "${role}"`);
      }
      return `Требуется: ${missingItems.join(", ")}`;
    }
    return "";
  };
  const tooltipText = getTooltipText();
  const button = /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ...buttonProps,
      disabled: isDisabled,
      icon: !hasAccess ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}) : buttonProps.icon,
      children: !hasAccess ? fallbackText : children
    }
  );
  if (showTooltip && tooltipText) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: tooltipText, placement: "top", children: button });
  }
  return button;
};
const { Title, Text, Paragraph } = Typography;
const PermissionDemo = () => {
  const { state, hasPermission, hasRole } = usePermissions();
  const { platform, isMiniApp } = usePlatform();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 2, children: "Демонстрация системы полномочий и платформ" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { children: "Эта страница демонстрирует работу системы полномочий (RBAC) и адаптацию интерфейса для разных платформ (веб/мини-апп)." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
          "Информация о пользователе"
        ] }),
        style: { marginBottom: "var(--sp-spacing-sm)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Платформа: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tag,
              {
                icon: isMiniApp ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}),
                color: isMiniApp ? "blue" : "green",
                children: isMiniApp ? "Telegram Mini App" : "Веб-версия"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Роли: " }),
            state.roles.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { wrap: true, children: state.roles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tag,
              {
                color: role.name === "architect" ? "gold" : "blue",
                icon: role.name === "architect" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
                children: role.name
              },
              role.id
            )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Роли не загружены" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Права: " }),
            state.permissions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
              state.permissions.slice(0, 5).map((permission) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: permission }, permission)),
              state.permissions.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
                "+",
                state.permissions.length - 5,
                " еще"
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Права не загружены" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          "Условный рендеринг по ролям"
        ] }),
        style: { marginBottom: "var(--sp-spacing-sm)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PermissionGate,
            {
              role: "basic",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Нет базовой роли", type: "warning" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Alert,
                {
                  message: "Базовый пользователь",
                  description: "Этот блок видят все пользователи с ролью 'basic' или выше",
                  type: "success"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PermissionGate,
            {
              role: "premium",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Требуется Premium подписка", type: "info" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Alert,
                {
                  message: "Premium функции",
                  description: "Этот блок доступен только Premium пользователям",
                  type: "success"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PermissionGate,
            {
              role: "architect",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Только для архитекторов", type: "error" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Alert,
                {
                  message: "Панель архитектора",
                  description: "Этот блок видят только архитекторы системы",
                  type: "success",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {})
                }
              )
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
          "Условный рендеринг по правам"
        ] }),
        style: { marginBottom: "var(--sp-spacing-sm)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PermissionGate,
            {
              permission: "api.keywords.read",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Нет доступа к ключевым словам", type: "warning" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Alert,
                {
                  message: "Доступ к ключевым словам",
                  description: "У вас есть право 'api.keywords.read'",
                  type: "success"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PermissionGate,
            {
              permission: "api.reminders.write",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Нет права создавать напоминания", type: "warning" }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Alert,
                {
                  message: "Создание напоминаний",
                  description: "У вас есть право 'api.reminders.write'",
                  type: "success"
                }
              )
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}),
          "Кнопки с проверкой прав"
        ] }),
        style: { marginBottom: "var(--sp-spacing-sm)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionButton, { permission: "api.keywords.read", type: "primary", children: "Читать ключевые слова" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionButton, { permission: "api.reminders.write", type: "default", children: "Создать напоминание" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionButton, { role: "premium", type: "primary", children: "Premium функция" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionButton, { role: "architect", type: "primary", danger: true, children: "Панель архитектора" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PermissionButton,
            {
              permission: "nonexistent.permission",
              fallbackText: "Нет доступа",
              children: "Недоступная функция"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          isMiniApp ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}),
          "Адаптация под платформу"
        ] }),
        style: { marginBottom: "var(--sp-spacing-sm)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformGate, { platform: "miniapp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: "Telegram Mini App",
              description: "Этот блок показывается только в мини-приложении Telegram",
              type: "info",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {})
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformGate, { platform: "web", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: "Веб-версия",
              description: "Этот блок показывается только в веб-версии",
              type: "success",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {})
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Текущая платформа: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: isMiniApp ? "blue" : "green", children: platform })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Особенности интерфейса:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: isMiniApp ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Компактное горизонтальное меню внизу" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Адаптированные размеры для мобильных устройств" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Темная тема по умолчанию" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Интеграция с Telegram WebApp API" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Полноценное боковое меню" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Расширенные возможности интерфейса" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Поддержка различных тем" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Веб-аутентификация" })
            ] }) })
          ] })
        ] })
      }
    ),
    state.limits && Object.keys(state.limits).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Лимиты пользователя",
        style: { marginBottom: "var(--sp-spacing-sm)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          state.limits.daily_requests && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Дневные запросы: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: state.limits.daily_requests })
          ] }),
          state.limits.max_output_tokens && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Максимум токенов: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: state.limits.max_output_tokens })
          ] })
        ] })
      }
    ),
    state.loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Загрузка полномочий...",
        type: "info",
        style: { marginBottom: "var(--sp-spacing-sm)" }
      }
    ),
    state.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Ошибка загрузки полномочий",
        description: state.error,
        type: "error",
        style: { marginBottom: "var(--sp-spacing-sm)" }
      }
    )
  ] });
};
export {
  PermissionDemo as default
};
//# sourceMappingURL=PermissionDemo-DM8_OEvH.js.map
