import { a as reactExports } from "./react-DAIzMmXQ.js";
import { Q as genStyleHooks, Z as RefIcon, C as ConfigContext, as as useLocale, bu as localeValues, B as Button, bl as convertLegacyProps, f as classNames, d as useComponentConfig, E as useMergedState, o as omit } from "./index-B4P9h-k1.js";
import { g as getRenderPropValue, a as PurePanel$1, P as Popover } from "./index-C3XsEteC.js";
import { A as ActionButton } from "./index-DFQcmyfW.js";
const genBaseStyle = (token) => {
  const {
    componentCls,
    iconCls,
    antCls,
    zIndexPopup,
    colorText,
    colorWarning,
    marginXXS,
    marginXS,
    fontSize,
    fontWeightStrong,
    colorTextHeading
  } = token;
  return {
    [componentCls]: {
      zIndex: zIndexPopup,
      [`&${antCls}-popover`]: {
        fontSize
      },
      [`${componentCls}-message`]: {
        marginBottom: marginXS,
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "start",
        [`> ${componentCls}-message-icon ${iconCls}`]: {
          color: colorWarning,
          fontSize,
          lineHeight: 1,
          marginInlineEnd: marginXS
        },
        [`${componentCls}-title`]: {
          fontWeight: fontWeightStrong,
          color: colorTextHeading,
          "&:only-child": {
            fontWeight: "normal"
          }
        },
        [`${componentCls}-description`]: {
          marginTop: marginXXS,
          color: colorText
        }
      },
      [`${componentCls}-buttons`]: {
        textAlign: "end",
        whiteSpace: "nowrap",
        button: {
          marginInlineStart: marginXS
        }
      }
    }
  };
};
const prepareComponentToken = (token) => {
  const {
    zIndexPopupBase
  } = token;
  return {
    zIndexPopup: zIndexPopupBase + 60
  };
};
const useStyle = genStyleHooks("Popconfirm", (token) => genBaseStyle(token), prepareComponentToken, {
  resetStyle: false
});
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Overlay = (props) => {
  const {
    prefixCls,
    okButtonProps,
    cancelButtonProps,
    title,
    description,
    cancelText,
    okText,
    okType = "primary",
    icon = /* @__PURE__ */ reactExports.createElement(RefIcon, null),
    showCancel = true,
    close,
    onConfirm,
    onCancel,
    onPopupClick
  } = props;
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const [contextLocale] = useLocale("Popconfirm", localeValues.Popconfirm);
  const titleNode = getRenderPropValue(title);
  const descriptionNode = getRenderPropValue(description);
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-inner-content`,
    onClick: onPopupClick
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-message`
  }, icon && /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-message-icon`
  }, icon), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-message-text`
  }, titleNode && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-title`
  }, titleNode), descriptionNode && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-description`
  }, descriptionNode))), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-buttons`
  }, showCancel && /* @__PURE__ */ reactExports.createElement(Button, Object.assign({
    onClick: onCancel,
    size: "small"
  }, cancelButtonProps), cancelText || (contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.cancelText)), /* @__PURE__ */ reactExports.createElement(ActionButton, {
    buttonProps: Object.assign(Object.assign({
      size: "small"
    }, convertLegacyProps(okType)), okButtonProps),
    actionFn: onConfirm,
    close,
    prefixCls: getPrefixCls("btn"),
    quitOnNullishReturnValue: true,
    emitEvent: true
  }, okText || (contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.okText))));
};
const PurePanel = (props) => {
  const {
    prefixCls: customizePrefixCls,
    placement,
    className,
    style
  } = props, restProps = __rest$1(props, ["prefixCls", "placement", "className", "style"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("popconfirm", customizePrefixCls);
  const [wrapCSSVar] = useStyle(prefixCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(PurePanel$1, {
    placement,
    className: classNames(prefixCls, className),
    style,
    content: /* @__PURE__ */ reactExports.createElement(Overlay, Object.assign({
      prefixCls
    }, restProps))
  }));
};
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const InternalPopconfirm = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  var _a, _b;
  const {
    prefixCls: customizePrefixCls,
    placement = "top",
    trigger = "click",
    okType = "primary",
    icon = /* @__PURE__ */ reactExports.createElement(RefIcon, null),
    children,
    overlayClassName,
    onOpenChange,
    onVisibleChange,
    overlayStyle,
    styles,
    classNames: popconfirmClassNames
  } = props, restProps = __rest(props, ["prefixCls", "placement", "trigger", "okType", "icon", "children", "overlayClassName", "onOpenChange", "onVisibleChange", "overlayStyle", "styles", "classNames"]);
  const {
    getPrefixCls,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles
  } = useComponentConfig("popconfirm");
  const [open, setOpen] = useMergedState(false, {
    value: (_a = props.open) !== null && _a !== void 0 ? _a : props.visible,
    defaultValue: (_b = props.defaultOpen) !== null && _b !== void 0 ? _b : props.defaultVisible
  });
  const settingOpen = (value, e) => {
    setOpen(value, true);
    onVisibleChange === null || onVisibleChange === void 0 ? void 0 : onVisibleChange(value);
    onOpenChange === null || onOpenChange === void 0 ? void 0 : onOpenChange(value, e);
  };
  const close = (e) => {
    settingOpen(false, e);
  };
  const onConfirm = (e) => {
    var _a2;
    return (_a2 = props.onConfirm) === null || _a2 === void 0 ? void 0 : _a2.call(void 0, e);
  };
  const onCancel = (e) => {
    var _a2;
    settingOpen(false, e);
    (_a2 = props.onCancel) === null || _a2 === void 0 ? void 0 : _a2.call(void 0, e);
  };
  const onInternalOpenChange = (value, e) => {
    const {
      disabled = false
    } = props;
    if (disabled) {
      return;
    }
    settingOpen(value, e);
  };
  const prefixCls = getPrefixCls("popconfirm", customizePrefixCls);
  const rootClassNames = classNames(prefixCls, contextClassName, overlayClassName, contextClassNames.root, popconfirmClassNames === null || popconfirmClassNames === void 0 ? void 0 : popconfirmClassNames.root);
  const bodyClassNames = classNames(contextClassNames.body, popconfirmClassNames === null || popconfirmClassNames === void 0 ? void 0 : popconfirmClassNames.body);
  const [wrapCSSVar] = useStyle(prefixCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(Popover, Object.assign({}, omit(restProps, ["title"]), {
    trigger,
    placement,
    onOpenChange: onInternalOpenChange,
    open,
    ref,
    classNames: {
      root: rootClassNames,
      body: bodyClassNames
    },
    styles: {
      root: Object.assign(Object.assign(Object.assign(Object.assign({}, contextStyles.root), contextStyle), overlayStyle), styles === null || styles === void 0 ? void 0 : styles.root),
      body: Object.assign(Object.assign({}, contextStyles.body), styles === null || styles === void 0 ? void 0 : styles.body)
    },
    content: /* @__PURE__ */ reactExports.createElement(Overlay, Object.assign({
      okType,
      icon
    }, props, {
      prefixCls,
      close,
      onConfirm,
      onCancel
    })),
    "data-popover-inject": true
  }), children));
});
const Popconfirm = InternalPopconfirm;
Popconfirm._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
export {
  Popconfirm as P
};
//# sourceMappingURL=index-03A0ujFQ.js.map
