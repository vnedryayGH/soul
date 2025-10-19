import { R as React, a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { f as classNames, Q as genStyleHooks, R as merge, C as ConfigContext, cE as isPresetSize, o as omit, b as usePermissions, c as apiRequest, s as staticMethods, T as Typography, l as Space, B as Button, p as Tag } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import "./Skeleton-D3e3aC7P.js";
const flexWrapValues = ["wrap", "nowrap", "wrap-reverse"];
const justifyContentValues = ["flex-start", "flex-end", "start", "end", "center", "space-between", "space-around", "space-evenly", "stretch", "normal", "left", "right"];
const alignItemsValues = ["center", "start", "end", "flex-start", "flex-end", "self-start", "self-end", "baseline", "normal", "stretch"];
const genClsWrap = (prefixCls, props) => {
  const wrap = props.wrap === true ? "wrap" : props.wrap;
  return {
    [`${prefixCls}-wrap-${wrap}`]: wrap && flexWrapValues.includes(wrap)
  };
};
const genClsAlign = (prefixCls, props) => {
  const alignCls = {};
  alignItemsValues.forEach((cssKey) => {
    alignCls[`${prefixCls}-align-${cssKey}`] = props.align === cssKey;
  });
  alignCls[`${prefixCls}-align-stretch`] = !props.align && !!props.vertical;
  return alignCls;
};
const genClsJustify = (prefixCls, props) => {
  const justifyCls = {};
  justifyContentValues.forEach((cssKey) => {
    justifyCls[`${prefixCls}-justify-${cssKey}`] = props.justify === cssKey;
  });
  return justifyCls;
};
function createFlexClassNames(prefixCls, props) {
  return classNames(Object.assign(Object.assign(Object.assign({}, genClsWrap(prefixCls, props)), genClsAlign(prefixCls, props)), genClsJustify(prefixCls, props)));
}
const genFlexStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      display: "flex",
      margin: 0,
      padding: 0,
      "&-vertical": {
        flexDirection: "column"
      },
      "&-rtl": {
        direction: "rtl"
      },
      "&:empty": {
        display: "none"
      }
    }
  };
};
const genFlexGapStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      "&-gap-small": {
        gap: token.flexGapSM
      },
      "&-gap-middle": {
        gap: token.flexGap
      },
      "&-gap-large": {
        gap: token.flexGapLG
      }
    }
  };
};
const genFlexWrapStyle = (token) => {
  const {
    componentCls
  } = token;
  const wrapStyle = {};
  flexWrapValues.forEach((value) => {
    wrapStyle[`${componentCls}-wrap-${value}`] = {
      flexWrap: value
    };
  });
  return wrapStyle;
};
const genAlignItemsStyle = (token) => {
  const {
    componentCls
  } = token;
  const alignStyle = {};
  alignItemsValues.forEach((value) => {
    alignStyle[`${componentCls}-align-${value}`] = {
      alignItems: value
    };
  });
  return alignStyle;
};
const genJustifyContentStyle = (token) => {
  const {
    componentCls
  } = token;
  const justifyStyle = {};
  justifyContentValues.forEach((value) => {
    justifyStyle[`${componentCls}-justify-${value}`] = {
      justifyContent: value
    };
  });
  return justifyStyle;
};
const prepareComponentToken = () => ({});
const useStyle = genStyleHooks("Flex", (token) => {
  const {
    paddingXS,
    padding,
    paddingLG
  } = token;
  const flexToken = merge(token, {
    flexGapSM: paddingXS,
    flexGap: padding,
    flexGapLG: paddingLG
  });
  return [genFlexStyle(flexToken), genFlexGapStyle(flexToken), genFlexWrapStyle(flexToken), genAlignItemsStyle(flexToken), genJustifyContentStyle(flexToken)];
}, prepareComponentToken, {
  // Flex component don't apply extra font style
  // https://github.com/ant-design/ant-design/issues/46403
  resetStyle: false
});
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Flex = /* @__PURE__ */ React.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    flex,
    gap,
    vertical = false,
    component: Component = "div"
  } = props, othersProps = __rest(props, ["prefixCls", "rootClassName", "className", "style", "flex", "gap", "vertical", "component"]);
  const {
    flex: ctxFlex,
    direction: ctxDirection,
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls("flex", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedVertical = vertical !== null && vertical !== void 0 ? vertical : ctxFlex === null || ctxFlex === void 0 ? void 0 : ctxFlex.vertical;
  const mergedCls = classNames(className, rootClassName, ctxFlex === null || ctxFlex === void 0 ? void 0 : ctxFlex.className, prefixCls, hashId, cssVarCls, createFlexClassNames(prefixCls, props), {
    [`${prefixCls}-rtl`]: ctxDirection === "rtl",
    [`${prefixCls}-gap-${gap}`]: isPresetSize(gap),
    [`${prefixCls}-vertical`]: mergedVertical
  });
  const mergedStyle = Object.assign(Object.assign({}, ctxFlex === null || ctxFlex === void 0 ? void 0 : ctxFlex.style), style);
  if (flex) {
    mergedStyle.flex = flex;
  }
  if (gap && !isPresetSize(gap)) {
    mergedStyle.gap = gap;
  }
  return wrapCSSVar(/* @__PURE__ */ React.createElement(Component, Object.assign({
    ref,
    className: mergedCls,
    style: mergedStyle
  }, omit(othersProps, ["justify", "wrap", "align"]))));
});
const { Title, Text } = Typography;
const STATUS_ENDPOINT = "/admin/bot/status";
const START_ENDPOINT = "/admin/bot/start";
const STOP_ENDPOINT = "/admin/bot/stop";
const StatusTag = ({ active }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: active ? "green" : "red", children: active ? "active" : "inactive" });
const BotControl = () => {
  var _a, _b;
  const { state } = usePermissions();
  const isArchitect = reactExports.useMemo(() => state.roles.some((r) => r.name === "architect"), [state.roles]);
  const [status, setStatus] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [starting, setStarting] = reactExports.useState(false);
  const [stopping, setStopping] = reactExports.useState(false);
  const loadStatus = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest(STATUS_ENDPOINT, "GET");
      setStatus({ active: !!(data == null ? void 0 : data.active), pid: data == null ? void 0 : data.pid, updated_at: data == null ? void 0 : data.updated_at });
    } catch (e) {
      console.error("Failed to load bot status", e);
      staticMethods.error("Не удалось получить статус бота");
    } finally {
      setLoading(false);
    }
  }, []);
  const handleStart = reactExports.useCallback(async () => {
    try {
      setStarting(true);
      await apiRequest(START_ENDPOINT, "POST");
      staticMethods.success("Бот запускается");
      setTimeout(loadStatus, 800);
    } catch (e) {
      console.error("Failed to start bot", e);
      staticMethods.error("Не удалось запустить бота");
    } finally {
      setStarting(false);
    }
  }, [loadStatus]);
  const handleStop = reactExports.useCallback(async () => {
    try {
      setStopping(true);
      await apiRequest(STOP_ENDPOINT, "POST");
      staticMethods.success("Бот останавливается");
      setTimeout(loadStatus, 800);
    } catch (e) {
      console.error("Failed to stop bot", e);
      staticMethods.error("Не удалось остановить бота");
    } finally {
      setStopping(false);
    }
  }, [loadStatus]);
  reactExports.useEffect(() => {
    loadStatus();
  }, [loadStatus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Flex, { vertical: true, gap: 16, style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { margin: 0 }, children: "Управление ботом" }),
    !isArchitect && /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "danger", children: "Недостаточно прав. Доступно только для роли architect." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { loading, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Flex, { align: "center", justify: "space-between", wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: "middle", align: "center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Статус:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTag, { active: !!(status == null ? void 0 : status.active) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadStatus, children: "Обновить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: handleStart, disabled: !isArchitect || !!(status == null ? void 0 : status.active), loading: starting, children: "Запустить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, onClick: handleStop, disabled: !isArchitect || !(status == null ? void 0 : status.active), loading: stopping, children: "Остановить" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { size: "small", column: 1, style: { marginTop: "var(--sp-spacing-sm)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "PID", children: (_a = status == null ? void 0 : status.pid) != null ? _a : "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Обновлено", children: (_b = status == null ? void 0 : status.updated_at) != null ? _b : "-" })
      ] })
    ] })
  ] });
};
export {
  BotControl as default
};
//# sourceMappingURL=BotControl-DDS2EdjI.js.map
