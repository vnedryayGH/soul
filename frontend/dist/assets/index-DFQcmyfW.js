import { _ as _toConsumableArray, bj as initMotion, P as Keyframe, bk as useSafeState, B as Button, bl as convertLegacyProps, aU as useComposeRef, w as _objectSpread2, f as classNames, ae as _typeof, at as pickAttrs, K as _extends, r as _slicedToArray, ab as CSSMotion, ah as useId, bm as contains, aW as KeyCode, aX as Portal, aQ as canUseDom, as as useLocale, bn as DisabledContextProvider, Y as RefIcon, bo as getConfirmLocale, Q as genStyleHooks, bp as initZoomMotion, U as unit, R as merge, V as resetComponent, X as genFocusStyle, C as ConfigContext, a5 as useCSSVarCls, aY as useClosable, aZ as pickClosable, ac as composeRef, a_ as useZIndex, az as ContextIsolator, a$ as zIndexContext, b0 as getTransitionName, bq as genSubStyleComponent, bi as clearFix, br as ConfigProvider, a3 as useToken, W as CONTAINER_MAX_OFFSET, Z as RefIcon$1, $ as RefIcon$2, a1 as RefIcon$3, a0 as RefIcon$4, bs as globalConfig, bt as unstableSetRender, bu as localeValues, bv as withPureRenderTheme } from "./index-B4P9h-k1.js";
import { a as reactExports, R as React } from "./react-DAIzMmXQ.js";
import { S as Skeleton } from "./Skeleton-D3e3aC7P.js";
import { u as usePanelRef } from "./context-CGIstv1h.js";
import { g as getMediaSize } from "./index-BlJydARW.js";
function usePatchElement() {
  const [elements, setElements] = reactExports.useState([]);
  const patchElement = reactExports.useCallback((element) => {
    setElements((originElements) => [].concat(_toConsumableArray(originElements), [element]));
    return () => {
      setElements((originElements) => originElements.filter((ele) => ele !== element));
    };
  }, []);
  return [elements, patchElement];
}
const fadeIn = new Keyframe("antFadeIn", {
  "0%": {
    opacity: 0
  },
  "100%": {
    opacity: 1
  }
});
const fadeOut = new Keyframe("antFadeOut", {
  "0%": {
    opacity: 1
  },
  "100%": {
    opacity: 0
  }
});
const initFadeMotion = (token, sameLevel = false) => {
  const {
    antCls
  } = token;
  const motionCls = `${antCls}-fade`;
  const sameLevelPrefix = sameLevel ? "&" : "";
  return [initMotion(motionCls, fadeIn, fadeOut, token.motionDurationMid, sameLevel), {
    [`
        ${sameLevelPrefix}${motionCls}-enter,
        ${sameLevelPrefix}${motionCls}-appear
      `]: {
      opacity: 0,
      animationTimingFunction: "linear"
    },
    [`${sameLevelPrefix}${motionCls}-leave`]: {
      animationTimingFunction: "linear"
    }
  }];
};
function isThenable(thing) {
  return !!(thing === null || thing === void 0 ? void 0 : thing.then);
}
const ActionButton = (props) => {
  const {
    type,
    children,
    prefixCls,
    buttonProps,
    close,
    autoFocus,
    emitEvent,
    isSilent,
    quitOnNullishReturnValue,
    actionFn
  } = props;
  const clickedRef = reactExports.useRef(false);
  const buttonRef = reactExports.useRef(null);
  const [loading, setLoading] = useSafeState(false);
  const onInternalClose = (...args) => {
    close === null || close === void 0 ? void 0 : close.apply(void 0, args);
  };
  reactExports.useEffect(() => {
    let timeoutId = null;
    if (autoFocus) {
      timeoutId = setTimeout(() => {
        var _a;
        (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.focus({
          preventScroll: true
        });
      });
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
  const handlePromiseOnOk = (returnValueOfOnOk) => {
    if (!isThenable(returnValueOfOnOk)) {
      return;
    }
    setLoading(true);
    returnValueOfOnOk.then((...args) => {
      setLoading(false, true);
      onInternalClose.apply(void 0, args);
      clickedRef.current = false;
    }, (e) => {
      setLoading(false, true);
      clickedRef.current = false;
      if (isSilent === null || isSilent === void 0 ? void 0 : isSilent()) {
        return;
      }
      return Promise.reject(e);
    });
  };
  const onClick = (e) => {
    if (clickedRef.current) {
      return;
    }
    clickedRef.current = true;
    if (!actionFn) {
      onInternalClose();
      return;
    }
    let returnValueOfOnOk;
    if (emitEvent) {
      returnValueOfOnOk = actionFn(e);
      if (quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
        clickedRef.current = false;
        onInternalClose(e);
        return;
      }
    } else if (actionFn.length) {
      returnValueOfOnOk = actionFn(close);
      clickedRef.current = false;
    } else {
      returnValueOfOnOk = actionFn();
      if (!isThenable(returnValueOfOnOk)) {
        onInternalClose();
        return;
      }
    }
    handlePromiseOnOk(returnValueOfOnOk);
  };
  return /* @__PURE__ */ reactExports.createElement(Button, Object.assign({}, convertLegacyProps(type), {
    onClick,
    loading,
    prefixCls
  }, buttonProps, {
    ref: buttonRef
  }), children);
};
const ModalContext = /* @__PURE__ */ React.createContext({});
const {
  Provider: ModalContextProvider
} = ModalContext;
const ConfirmCancelBtn = () => {
  const {
    autoFocusButton,
    cancelButtonProps,
    cancelTextLocale,
    isSilent,
    mergedOkCancel,
    rootPrefixCls,
    close,
    onCancel,
    onConfirm
  } = reactExports.useContext(ModalContext);
  return mergedOkCancel ? /* @__PURE__ */ React.createElement(ActionButton, {
    isSilent,
    actionFn: onCancel,
    close: (...args) => {
      close === null || close === void 0 ? void 0 : close.apply(void 0, args);
      onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(false);
    },
    autoFocus: autoFocusButton === "cancel",
    buttonProps: cancelButtonProps,
    prefixCls: `${rootPrefixCls}-btn`
  }, cancelTextLocale) : null;
};
const ConfirmOkBtn = () => {
  const {
    autoFocusButton,
    close,
    isSilent,
    okButtonProps,
    rootPrefixCls,
    okTextLocale,
    okType,
    onConfirm,
    onOk
  } = reactExports.useContext(ModalContext);
  return /* @__PURE__ */ React.createElement(ActionButton, {
    isSilent,
    type: okType || "primary",
    actionFn: onOk,
    close: (...args) => {
      close === null || close === void 0 ? void 0 : close.apply(void 0, args);
      onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(true);
    },
    autoFocus: autoFocusButton === "ok",
    buttonProps: okButtonProps,
    prefixCls: `${rootPrefixCls}-btn`
  }, okTextLocale);
};
var RefContext = /* @__PURE__ */ reactExports.createContext({});
function getMotionName(prefixCls, transitionName, animationName) {
  var motionName = transitionName;
  if (!motionName && animationName) {
    motionName = "".concat(prefixCls, "-").concat(animationName);
  }
  return motionName;
}
function getScroll(w, top) {
  var ret = w["page".concat(top ? "Y" : "X", "Offset")];
  var method = "scroll".concat(top ? "Top" : "Left");
  if (typeof ret !== "number") {
    var d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== "number") {
      ret = d.body[method];
    }
  }
  return ret;
}
function offset(el) {
  var rect = el.getBoundingClientRect();
  var pos = {
    left: rect.left,
    top: rect.top
  };
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
}
const MemoChildren = /* @__PURE__ */ reactExports.memo(function(_ref) {
  var children = _ref.children;
  return children;
}, function(_, _ref2) {
  var shouldUpdate = _ref2.shouldUpdate;
  return !shouldUpdate;
});
var sentinelStyle = {
  width: 0,
  height: 0,
  overflow: "hidden",
  outline: "none"
};
var entityStyle = {
  outline: "none"
};
var Panel = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, className = props.className, style = props.style, title = props.title, ariaId = props.ariaId, footer = props.footer, closable = props.closable, closeIcon = props.closeIcon, onClose = props.onClose, children = props.children, bodyStyle = props.bodyStyle, bodyProps = props.bodyProps, modalRender = props.modalRender, onMouseDown = props.onMouseDown, onMouseUp = props.onMouseUp, holderRef = props.holderRef, visible = props.visible, forceRender = props.forceRender, width = props.width, height = props.height, modalClassNames = props.classNames, modalStyles = props.styles;
  var _React$useContext = React.useContext(RefContext), panelRef = _React$useContext.panel;
  var mergedRef = useComposeRef(holderRef, panelRef);
  var sentinelStartRef = reactExports.useRef();
  var sentinelEndRef = reactExports.useRef();
  React.useImperativeHandle(ref, function() {
    return {
      focus: function focus() {
        var _sentinelStartRef$cur;
        (_sentinelStartRef$cur = sentinelStartRef.current) === null || _sentinelStartRef$cur === void 0 || _sentinelStartRef$cur.focus({
          preventScroll: true
        });
      },
      changeActive: function changeActive(next) {
        var _document = document, activeElement = _document.activeElement;
        if (next && activeElement === sentinelEndRef.current) {
          sentinelStartRef.current.focus({
            preventScroll: true
          });
        } else if (!next && activeElement === sentinelStartRef.current) {
          sentinelEndRef.current.focus({
            preventScroll: true
          });
        }
      }
    };
  });
  var contentStyle = {};
  if (width !== void 0) {
    contentStyle.width = width;
  }
  if (height !== void 0) {
    contentStyle.height = height;
  }
  var footerNode = footer ? /* @__PURE__ */ React.createElement("div", {
    className: classNames("".concat(prefixCls, "-footer"), modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.footer),
    style: _objectSpread2({}, modalStyles === null || modalStyles === void 0 ? void 0 : modalStyles.footer)
  }, footer) : null;
  var headerNode = title ? /* @__PURE__ */ React.createElement("div", {
    className: classNames("".concat(prefixCls, "-header"), modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.header),
    style: _objectSpread2({}, modalStyles === null || modalStyles === void 0 ? void 0 : modalStyles.header)
  }, /* @__PURE__ */ React.createElement("div", {
    className: "".concat(prefixCls, "-title"),
    id: ariaId
  }, title)) : null;
  var closableObj = reactExports.useMemo(function() {
    if (_typeof(closable) === "object" && closable !== null) {
      return closable;
    }
    if (closable) {
      return {
        closeIcon: closeIcon !== null && closeIcon !== void 0 ? closeIcon : /* @__PURE__ */ React.createElement("span", {
          className: "".concat(prefixCls, "-close-x")
        })
      };
    }
    return {};
  }, [closable, closeIcon, prefixCls]);
  var ariaProps = pickAttrs(closableObj, true);
  var closeBtnIsDisabled = _typeof(closable) === "object" && closable.disabled;
  var closerNode = closable ? /* @__PURE__ */ React.createElement("button", _extends({
    type: "button",
    onClick: onClose,
    "aria-label": "Close"
  }, ariaProps, {
    className: "".concat(prefixCls, "-close"),
    disabled: closeBtnIsDisabled
  }), closableObj.closeIcon) : null;
  var content = /* @__PURE__ */ React.createElement("div", {
    className: classNames("".concat(prefixCls, "-content"), modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.content),
    style: modalStyles === null || modalStyles === void 0 ? void 0 : modalStyles.content
  }, closerNode, headerNode, /* @__PURE__ */ React.createElement("div", _extends({
    className: classNames("".concat(prefixCls, "-body"), modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.body),
    style: _objectSpread2(_objectSpread2({}, bodyStyle), modalStyles === null || modalStyles === void 0 ? void 0 : modalStyles.body)
  }, bodyProps), children), footerNode);
  return /* @__PURE__ */ React.createElement("div", {
    key: "dialog-element",
    role: "dialog",
    "aria-labelledby": title ? ariaId : null,
    "aria-modal": "true",
    ref: mergedRef,
    style: _objectSpread2(_objectSpread2({}, style), contentStyle),
    className: classNames(prefixCls, className),
    onMouseDown,
    onMouseUp
  }, /* @__PURE__ */ React.createElement("div", {
    ref: sentinelStartRef,
    tabIndex: 0,
    style: entityStyle
  }, /* @__PURE__ */ React.createElement(MemoChildren, {
    shouldUpdate: visible || forceRender
  }, modalRender ? modalRender(content) : content)), /* @__PURE__ */ React.createElement("div", {
    tabIndex: 0,
    ref: sentinelEndRef,
    style: sentinelStyle
  }));
});
var Content = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, title = props.title, style = props.style, className = props.className, visible = props.visible, forceRender = props.forceRender, destroyOnClose = props.destroyOnClose, motionName = props.motionName, ariaId = props.ariaId, onVisibleChanged = props.onVisibleChanged, mousePosition2 = props.mousePosition;
  var dialogRef = reactExports.useRef();
  var _React$useState = reactExports.useState(), _React$useState2 = _slicedToArray(_React$useState, 2), transformOrigin = _React$useState2[0], setTransformOrigin = _React$useState2[1];
  var contentStyle = {};
  if (transformOrigin) {
    contentStyle.transformOrigin = transformOrigin;
  }
  function onPrepare() {
    var elementOffset = offset(dialogRef.current);
    setTransformOrigin(mousePosition2 && (mousePosition2.x || mousePosition2.y) ? "".concat(mousePosition2.x - elementOffset.left, "px ").concat(mousePosition2.y - elementOffset.top, "px") : "");
  }
  return /* @__PURE__ */ reactExports.createElement(CSSMotion, {
    visible,
    onVisibleChanged,
    onAppearPrepare: onPrepare,
    onEnterPrepare: onPrepare,
    forceRender,
    motionName,
    removeOnLeave: destroyOnClose,
    ref: dialogRef
  }, function(_ref, motionRef) {
    var motionClassName = _ref.className, motionStyle = _ref.style;
    return /* @__PURE__ */ reactExports.createElement(Panel, _extends({}, props, {
      ref,
      title,
      ariaId,
      prefixCls,
      holderRef: motionRef,
      style: _objectSpread2(_objectSpread2(_objectSpread2({}, motionStyle), style), contentStyle),
      className: classNames(className, motionClassName)
    }));
  });
});
Content.displayName = "Content";
var Mask = function Mask2(props) {
  var prefixCls = props.prefixCls, style = props.style, visible = props.visible, maskProps = props.maskProps, motionName = props.motionName, className = props.className;
  return /* @__PURE__ */ reactExports.createElement(CSSMotion, {
    key: "mask",
    visible,
    motionName,
    leavedClassName: "".concat(prefixCls, "-mask-hidden")
  }, function(_ref, ref) {
    var motionClassName = _ref.className, motionStyle = _ref.style;
    return /* @__PURE__ */ reactExports.createElement("div", _extends({
      ref,
      style: _objectSpread2(_objectSpread2({}, motionStyle), style),
      className: classNames("".concat(prefixCls, "-mask"), motionClassName, className)
    }, maskProps));
  });
};
var Dialog = function Dialog2(props) {
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-dialog" : _props$prefixCls, zIndex = props.zIndex, _props$visible = props.visible, visible = _props$visible === void 0 ? false : _props$visible, _props$keyboard = props.keyboard, keyboard = _props$keyboard === void 0 ? true : _props$keyboard, _props$focusTriggerAf = props.focusTriggerAfterClose, focusTriggerAfterClose = _props$focusTriggerAf === void 0 ? true : _props$focusTriggerAf, wrapStyle = props.wrapStyle, wrapClassName = props.wrapClassName, wrapProps = props.wrapProps, onClose = props.onClose, afterOpenChange = props.afterOpenChange, afterClose = props.afterClose, transitionName = props.transitionName, animation = props.animation, _props$closable = props.closable, closable = _props$closable === void 0 ? true : _props$closable, _props$mask = props.mask, mask = _props$mask === void 0 ? true : _props$mask, maskTransitionName = props.maskTransitionName, maskAnimation = props.maskAnimation, _props$maskClosable = props.maskClosable, maskClosable = _props$maskClosable === void 0 ? true : _props$maskClosable, maskStyle = props.maskStyle, maskProps = props.maskProps, rootClassName = props.rootClassName, modalClassNames = props.classNames, modalStyles = props.styles;
  var lastOutSideActiveElementRef = reactExports.useRef();
  var wrapperRef = reactExports.useRef();
  var contentRef = reactExports.useRef();
  var _React$useState = reactExports.useState(visible), _React$useState2 = _slicedToArray(_React$useState, 2), animatedVisible = _React$useState2[0], setAnimatedVisible = _React$useState2[1];
  var ariaId = useId();
  function saveLastOutSideActiveElementRef() {
    if (!contains(wrapperRef.current, document.activeElement)) {
      lastOutSideActiveElementRef.current = document.activeElement;
    }
  }
  function focusDialogContent() {
    if (!contains(wrapperRef.current, document.activeElement)) {
      var _contentRef$current;
      (_contentRef$current = contentRef.current) === null || _contentRef$current === void 0 || _contentRef$current.focus();
    }
  }
  function onDialogVisibleChanged(newVisible) {
    if (newVisible) {
      focusDialogContent();
    } else {
      setAnimatedVisible(false);
      if (mask && lastOutSideActiveElementRef.current && focusTriggerAfterClose) {
        try {
          lastOutSideActiveElementRef.current.focus({
            preventScroll: true
          });
        } catch (e) {
        }
        lastOutSideActiveElementRef.current = null;
      }
      if (animatedVisible) {
        afterClose === null || afterClose === void 0 || afterClose();
      }
    }
    afterOpenChange === null || afterOpenChange === void 0 || afterOpenChange(newVisible);
  }
  function onInternalClose(e) {
    onClose === null || onClose === void 0 || onClose(e);
  }
  var contentClickRef = reactExports.useRef(false);
  var contentTimeoutRef = reactExports.useRef();
  var onContentMouseDown = function onContentMouseDown2() {
    clearTimeout(contentTimeoutRef.current);
    contentClickRef.current = true;
  };
  var onContentMouseUp = function onContentMouseUp2() {
    contentTimeoutRef.current = setTimeout(function() {
      contentClickRef.current = false;
    });
  };
  var onWrapperClick = null;
  if (maskClosable) {
    onWrapperClick = function onWrapperClick2(e) {
      if (contentClickRef.current) {
        contentClickRef.current = false;
      } else if (wrapperRef.current === e.target) {
        onInternalClose(e);
      }
    };
  }
  function onWrapperKeyDown(e) {
    if (keyboard && e.keyCode === KeyCode.ESC) {
      e.stopPropagation();
      onInternalClose(e);
      return;
    }
    if (visible && e.keyCode === KeyCode.TAB) {
      contentRef.current.changeActive(!e.shiftKey);
    }
  }
  reactExports.useEffect(function() {
    if (visible) {
      setAnimatedVisible(true);
      saveLastOutSideActiveElementRef();
    }
  }, [visible]);
  reactExports.useEffect(function() {
    return function() {
      clearTimeout(contentTimeoutRef.current);
    };
  }, []);
  var mergedStyle = _objectSpread2(_objectSpread2(_objectSpread2({
    zIndex
  }, wrapStyle), modalStyles === null || modalStyles === void 0 ? void 0 : modalStyles.wrapper), {}, {
    display: !animatedVisible ? "none" : null
  });
  return /* @__PURE__ */ reactExports.createElement("div", _extends({
    className: classNames("".concat(prefixCls, "-root"), rootClassName)
  }, pickAttrs(props, {
    data: true
  })), /* @__PURE__ */ reactExports.createElement(Mask, {
    prefixCls,
    visible: mask && visible,
    motionName: getMotionName(prefixCls, maskTransitionName, maskAnimation),
    style: _objectSpread2(_objectSpread2({
      zIndex
    }, maskStyle), modalStyles === null || modalStyles === void 0 ? void 0 : modalStyles.mask),
    maskProps,
    className: modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.mask
  }), /* @__PURE__ */ reactExports.createElement("div", _extends({
    tabIndex: -1,
    onKeyDown: onWrapperKeyDown,
    className: classNames("".concat(prefixCls, "-wrap"), wrapClassName, modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.wrapper),
    ref: wrapperRef,
    onClick: onWrapperClick,
    style: mergedStyle
  }, wrapProps), /* @__PURE__ */ reactExports.createElement(Content, _extends({}, props, {
    onMouseDown: onContentMouseDown,
    onMouseUp: onContentMouseUp,
    ref: contentRef,
    closable,
    ariaId,
    prefixCls,
    visible: visible && animatedVisible,
    onClose: onInternalClose,
    onVisibleChanged: onDialogVisibleChanged,
    motionName: getMotionName(prefixCls, transitionName, animation)
  }))));
};
var DialogWrap = function DialogWrap2(props) {
  var visible = props.visible, getContainer = props.getContainer, forceRender = props.forceRender, _props$destroyOnClose = props.destroyOnClose, destroyOnClose = _props$destroyOnClose === void 0 ? false : _props$destroyOnClose, _afterClose = props.afterClose, panelRef = props.panelRef;
  var _React$useState = reactExports.useState(visible), _React$useState2 = _slicedToArray(_React$useState, 2), animatedVisible = _React$useState2[0], setAnimatedVisible = _React$useState2[1];
  var refContext = reactExports.useMemo(function() {
    return {
      panel: panelRef
    };
  }, [panelRef]);
  reactExports.useEffect(function() {
    if (visible) {
      setAnimatedVisible(true);
    }
  }, [visible]);
  if (!forceRender && destroyOnClose && !animatedVisible) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(RefContext.Provider, {
    value: refContext
  }, /* @__PURE__ */ reactExports.createElement(Portal, {
    open: visible || forceRender || animatedVisible,
    autoDestroy: false,
    getContainer,
    autoLock: visible || animatedVisible
  }, /* @__PURE__ */ reactExports.createElement(Dialog, _extends({}, props, {
    destroyOnClose,
    afterClose: function afterClose() {
      _afterClose === null || _afterClose === void 0 || _afterClose();
      setAnimatedVisible(false);
    }
  }))));
};
DialogWrap.displayName = "Dialog";
const canUseDocElement = () => canUseDom() && window.document.documentElement;
const NormalCancelBtn = () => {
  const {
    cancelButtonProps,
    cancelTextLocale,
    onCancel
  } = reactExports.useContext(ModalContext);
  return /* @__PURE__ */ React.createElement(Button, Object.assign({
    onClick: onCancel
  }, cancelButtonProps), cancelTextLocale);
};
const NormalOkBtn = () => {
  const {
    confirmLoading,
    okButtonProps,
    okType,
    okTextLocale,
    onOk
  } = reactExports.useContext(ModalContext);
  return /* @__PURE__ */ React.createElement(Button, Object.assign({}, convertLegacyProps(okType), {
    loading: confirmLoading,
    onClick: onOk
  }, okButtonProps), okTextLocale);
};
function renderCloseIcon(prefixCls, closeIcon) {
  return /* @__PURE__ */ React.createElement("span", {
    className: `${prefixCls}-close-x`
  }, closeIcon || /* @__PURE__ */ React.createElement(RefIcon, {
    className: `${prefixCls}-close-icon`
  }));
}
const Footer = (props) => {
  const {
    okText,
    okType = "primary",
    cancelText,
    confirmLoading,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    footer
  } = props;
  const [locale] = useLocale("Modal", getConfirmLocale());
  const okTextLocale = okText || (locale === null || locale === void 0 ? void 0 : locale.okText);
  const cancelTextLocale = cancelText || (locale === null || locale === void 0 ? void 0 : locale.cancelText);
  const btnCtxValue = {
    confirmLoading,
    okButtonProps,
    cancelButtonProps,
    okTextLocale,
    cancelTextLocale,
    okType,
    onOk,
    onCancel
  };
  const btnCtxValueMemo = React.useMemo(() => btnCtxValue, _toConsumableArray(Object.values(btnCtxValue)));
  let footerNode;
  if (typeof footer === "function" || typeof footer === "undefined") {
    footerNode = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NormalCancelBtn, null), /* @__PURE__ */ React.createElement(NormalOkBtn, null));
    if (typeof footer === "function") {
      footerNode = footer(footerNode, {
        OkBtn: NormalOkBtn,
        CancelBtn: NormalCancelBtn
      });
    }
    footerNode = /* @__PURE__ */ React.createElement(ModalContextProvider, {
      value: btnCtxValueMemo
    }, footerNode);
  } else {
    footerNode = footer;
  }
  return /* @__PURE__ */ React.createElement(DisabledContextProvider, {
    disabled: false
  }, footerNode);
};
function box(position) {
  return {
    position,
    inset: 0
  };
}
const genModalMaskStyle = (token) => {
  const {
    componentCls,
    antCls
  } = token;
  return [{
    [`${componentCls}-root`]: {
      [`${componentCls}${antCls}-zoom-enter, ${componentCls}${antCls}-zoom-appear`]: {
        // reset scale avoid mousePosition bug
        transform: "none",
        opacity: 0,
        animationDuration: token.motionDurationSlow,
        // https://github.com/ant-design/ant-design/issues/11777
        userSelect: "none"
      },
      // https://github.com/ant-design/ant-design/issues/37329
      // https://github.com/ant-design/ant-design/issues/40272
      [`${componentCls}${antCls}-zoom-leave ${componentCls}-content`]: {
        pointerEvents: "none"
      },
      [`${componentCls}-mask`]: Object.assign(Object.assign({}, box("fixed")), {
        zIndex: token.zIndexPopupBase,
        height: "100%",
        backgroundColor: token.colorBgMask,
        pointerEvents: "none",
        [`${componentCls}-hidden`]: {
          display: "none"
        }
      }),
      [`${componentCls}-wrap`]: Object.assign(Object.assign({}, box("fixed")), {
        zIndex: token.zIndexPopupBase,
        overflow: "auto",
        outline: 0,
        WebkitOverflowScrolling: "touch"
      })
    }
  }, {
    [`${componentCls}-root`]: initFadeMotion(token)
  }];
};
const genModalStyle = (token) => {
  const {
    componentCls
  } = token;
  return [
    // ======================== Root =========================
    {
      [`${componentCls}-root`]: {
        [`${componentCls}-wrap-rtl`]: {
          direction: "rtl"
        },
        [`${componentCls}-centered`]: {
          textAlign: "center",
          "&::before": {
            display: "inline-block",
            width: 0,
            height: "100%",
            verticalAlign: "middle",
            content: '""'
          },
          [componentCls]: {
            top: 0,
            display: "inline-block",
            paddingBottom: 0,
            textAlign: "start",
            verticalAlign: "middle"
          }
        },
        [`@media (max-width: ${token.screenSMMax}px)`]: {
          [componentCls]: {
            maxWidth: "calc(100vw - 16px)",
            margin: `${unit(token.marginXS)} auto`
          },
          [`${componentCls}-centered`]: {
            [componentCls]: {
              flex: 1
            }
          }
        }
      }
    },
    // ======================== Modal ========================
    {
      [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
        pointerEvents: "none",
        position: "relative",
        top: 100,
        width: "auto",
        maxWidth: `calc(100vw - ${unit(token.calc(token.margin).mul(2).equal())})`,
        margin: "0 auto",
        paddingBottom: token.paddingLG,
        [`${componentCls}-title`]: {
          margin: 0,
          color: token.titleColor,
          fontWeight: token.fontWeightStrong,
          fontSize: token.titleFontSize,
          lineHeight: token.titleLineHeight,
          wordWrap: "break-word"
        },
        [`${componentCls}-content`]: {
          position: "relative",
          backgroundColor: token.contentBg,
          backgroundClip: "padding-box",
          border: 0,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow,
          pointerEvents: "auto",
          padding: token.contentPadding
        },
        [`${componentCls}-close`]: Object.assign({
          position: "absolute",
          top: token.calc(token.modalHeaderHeight).sub(token.modalCloseBtnSize).div(2).equal(),
          insetInlineEnd: token.calc(token.modalHeaderHeight).sub(token.modalCloseBtnSize).div(2).equal(),
          zIndex: token.calc(token.zIndexPopupBase).add(10).equal(),
          padding: 0,
          color: token.modalCloseIconColor,
          fontWeight: token.fontWeightStrong,
          lineHeight: 1,
          textDecoration: "none",
          background: "transparent",
          borderRadius: token.borderRadiusSM,
          width: token.modalCloseBtnSize,
          height: token.modalCloseBtnSize,
          border: 0,
          outline: 0,
          cursor: "pointer",
          transition: `color ${token.motionDurationMid}, background-color ${token.motionDurationMid}`,
          "&-x": {
            display: "flex",
            fontSize: token.fontSizeLG,
            fontStyle: "normal",
            lineHeight: unit(token.modalCloseBtnSize),
            justifyContent: "center",
            textTransform: "none",
            textRendering: "auto"
          },
          "&:disabled": {
            pointerEvents: "none"
          },
          "&:hover": {
            color: token.modalCloseIconHoverColor,
            backgroundColor: token.colorBgTextHover,
            textDecoration: "none"
          },
          "&:active": {
            backgroundColor: token.colorBgTextActive
          }
        }, genFocusStyle(token)),
        [`${componentCls}-header`]: {
          color: token.colorText,
          background: token.headerBg,
          borderRadius: `${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} 0 0`,
          marginBottom: token.headerMarginBottom,
          padding: token.headerPadding,
          borderBottom: token.headerBorderBottom
        },
        [`${componentCls}-body`]: {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          wordWrap: "break-word",
          padding: token.bodyPadding,
          [`${componentCls}-body-skeleton`]: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: `${unit(token.margin)} auto`
          }
        },
        [`${componentCls}-footer`]: {
          textAlign: "end",
          background: token.footerBg,
          marginTop: token.footerMarginTop,
          padding: token.footerPadding,
          borderTop: token.footerBorderTop,
          borderRadius: token.footerBorderRadius,
          [`> ${token.antCls}-btn + ${token.antCls}-btn`]: {
            marginInlineStart: token.marginXS
          }
        },
        [`${componentCls}-open`]: {
          overflow: "hidden"
        }
      })
    },
    // ======================== Pure =========================
    {
      [`${componentCls}-pure-panel`]: {
        top: "auto",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        [`${componentCls}-content,
          ${componentCls}-body,
          ${componentCls}-confirm-body-wrapper`]: {
          display: "flex",
          flexDirection: "column",
          flex: "auto"
        },
        [`${componentCls}-confirm-body`]: {
          marginBottom: "auto"
        }
      }
    }
  ];
};
const genRTLStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    [`${componentCls}-root`]: {
      [`${componentCls}-wrap-rtl`]: {
        direction: "rtl",
        [`${componentCls}-confirm-body`]: {
          direction: "rtl"
        }
      }
    }
  };
};
const genResponsiveWidthStyle = (token) => {
  const {
    componentCls
  } = token;
  const oriGridMediaSizesMap = getMediaSize(token);
  const gridMediaSizesMap = Object.assign({}, oriGridMediaSizesMap);
  delete gridMediaSizesMap.xs;
  const cssVarPrefix = `--${componentCls.replace(".", "")}-`;
  const responsiveStyles = Object.keys(gridMediaSizesMap).map((key) => ({
    [`@media (min-width: ${unit(gridMediaSizesMap[key])})`]: {
      width: `var(${cssVarPrefix}${key}-width)`
    }
  }));
  return {
    [`${componentCls}-root`]: {
      [componentCls]: [].concat(_toConsumableArray(Object.keys(oriGridMediaSizesMap).map((currentKey, index) => {
        const previousKey = Object.keys(oriGridMediaSizesMap)[index - 1];
        return previousKey ? {
          [`${cssVarPrefix}${currentKey}-width`]: `var(${cssVarPrefix}${previousKey}-width)`
        } : null;
      })), [{
        width: `var(${cssVarPrefix}xs-width)`
      }], _toConsumableArray(responsiveStyles))
    }
  };
};
const prepareToken = (token) => {
  const headerPaddingVertical = token.padding;
  const headerFontSize = token.fontSizeHeading5;
  const headerLineHeight = token.lineHeightHeading5;
  const modalToken = merge(token, {
    modalHeaderHeight: token.calc(token.calc(headerLineHeight).mul(headerFontSize).equal()).add(token.calc(headerPaddingVertical).mul(2).equal()).equal(),
    modalFooterBorderColorSplit: token.colorSplit,
    modalFooterBorderStyle: token.lineType,
    modalFooterBorderWidth: token.lineWidth,
    modalCloseIconColor: token.colorIcon,
    modalCloseIconHoverColor: token.colorIconHover,
    modalCloseBtnSize: token.controlHeight,
    modalConfirmIconSize: token.fontHeight,
    modalTitleHeight: token.calc(token.titleFontSize).mul(token.titleLineHeight).equal()
  });
  return modalToken;
};
const prepareComponentToken = (token) => ({
  footerBg: "transparent",
  headerBg: token.colorBgElevated,
  titleLineHeight: token.lineHeightHeading5,
  titleFontSize: token.fontSizeHeading5,
  contentBg: token.colorBgElevated,
  titleColor: token.colorTextHeading,
  // internal
  contentPadding: token.wireframe ? 0 : `${unit(token.paddingMD)} ${unit(token.paddingContentHorizontalLG)}`,
  headerPadding: token.wireframe ? `${unit(token.padding)} ${unit(token.paddingLG)}` : 0,
  headerBorderBottom: token.wireframe ? `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}` : "none",
  headerMarginBottom: token.wireframe ? 0 : token.marginXS,
  bodyPadding: token.wireframe ? token.paddingLG : 0,
  footerPadding: token.wireframe ? `${unit(token.paddingXS)} ${unit(token.padding)}` : 0,
  footerBorderTop: token.wireframe ? `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}` : "none",
  footerBorderRadius: token.wireframe ? `0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)}` : 0,
  footerMarginTop: token.wireframe ? 0 : token.marginSM,
  confirmBodyPadding: token.wireframe ? `${unit(token.padding * 2)} ${unit(token.padding * 2)} ${unit(token.paddingLG)}` : 0,
  confirmIconMarginInlineEnd: token.wireframe ? token.margin : token.marginSM,
  confirmBtnsMarginTop: token.wireframe ? token.marginLG : token.marginSM
});
const useStyle = genStyleHooks("Modal", (token) => {
  const modalToken = prepareToken(token);
  return [genModalStyle(modalToken), genRTLStyle(modalToken), genModalMaskStyle(modalToken), initZoomMotion(modalToken, "zoom"), genResponsiveWidthStyle(modalToken)];
}, prepareComponentToken, {
  unitless: {
    titleLineHeight: true
  }
});
var __rest$3 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
let mousePosition;
const getClickPosition = (e) => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY
  };
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};
if (canUseDocElement()) {
  document.documentElement.addEventListener("click", getClickPosition, true);
}
const Modal$1 = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    open,
    wrapClassName,
    centered,
    getContainer,
    focusTriggerAfterClose = true,
    style,
    // Deprecated
    visible,
    width = 520,
    footer,
    classNames: modalClassNames,
    styles: modalStyles,
    children,
    loading,
    confirmLoading,
    zIndex: customizeZIndex,
    mousePosition: customizeMousePosition,
    onOk,
    onCancel,
    destroyOnHidden,
    destroyOnClose,
    panelRef = null
  } = props, restProps = __rest$3(props, ["prefixCls", "className", "rootClassName", "open", "wrapClassName", "centered", "getContainer", "focusTriggerAfterClose", "style", "visible", "width", "footer", "classNames", "styles", "children", "loading", "confirmLoading", "zIndex", "mousePosition", "onOk", "onCancel", "destroyOnHidden", "destroyOnClose", "panelRef"]);
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    direction,
    modal: modalContext
  } = reactExports.useContext(ConfigContext);
  const handleCancel = (e) => {
    if (confirmLoading) {
      return;
    }
    onCancel === null || onCancel === void 0 ? void 0 : onCancel(e);
  };
  const handleOk = (e) => {
    onOk === null || onOk === void 0 ? void 0 : onOk(e);
  };
  const prefixCls = getPrefixCls("modal", customizePrefixCls);
  const rootPrefixCls = getPrefixCls();
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const wrapClassNameExtended = classNames(wrapClassName, {
    [`${prefixCls}-centered`]: centered !== null && centered !== void 0 ? centered : modalContext === null || modalContext === void 0 ? void 0 : modalContext.centered,
    [`${prefixCls}-wrap-rtl`]: direction === "rtl"
  });
  const dialogFooter = footer !== null && !loading ? /* @__PURE__ */ reactExports.createElement(Footer, Object.assign({}, props, {
    onOk: handleOk,
    onCancel: handleCancel
  })) : null;
  const [mergedClosable, mergedCloseIcon, closeBtnIsDisabled, ariaProps] = useClosable(pickClosable(props), pickClosable(modalContext), {
    closable: true,
    closeIcon: /* @__PURE__ */ reactExports.createElement(RefIcon, {
      className: `${prefixCls}-close-icon`
    }),
    closeIconRender: (icon) => renderCloseIcon(prefixCls, icon)
  });
  const innerPanelRef = usePanelRef(`.${prefixCls}-content`);
  const mergedPanelRef = composeRef(panelRef, innerPanelRef);
  const [zIndex, contextZIndex] = useZIndex("Modal", customizeZIndex);
  const [numWidth, responsiveWidth] = reactExports.useMemo(() => {
    if (width && typeof width === "object") {
      return [void 0, width];
    }
    return [width, void 0];
  }, [width]);
  const responsiveWidthVars = reactExports.useMemo(() => {
    const vars = {};
    if (responsiveWidth) {
      Object.keys(responsiveWidth).forEach((breakpoint) => {
        const breakpointWidth = responsiveWidth[breakpoint];
        if (breakpointWidth !== void 0) {
          vars[`--${prefixCls}-${breakpoint}-width`] = typeof breakpointWidth === "number" ? `${breakpointWidth}px` : breakpointWidth;
        }
      });
    }
    return vars;
  }, [responsiveWidth]);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(ContextIsolator, {
    form: true,
    space: true
  }, /* @__PURE__ */ reactExports.createElement(zIndexContext.Provider, {
    value: contextZIndex
  }, /* @__PURE__ */ reactExports.createElement(DialogWrap, Object.assign({
    width: numWidth
  }, restProps, {
    zIndex,
    getContainer: getContainer === void 0 ? getContextPopupContainer : getContainer,
    prefixCls,
    rootClassName: classNames(hashId, rootClassName, cssVarCls, rootCls),
    footer: dialogFooter,
    visible: open !== null && open !== void 0 ? open : visible,
    mousePosition: customizeMousePosition !== null && customizeMousePosition !== void 0 ? customizeMousePosition : mousePosition,
    onClose: handleCancel,
    closable: mergedClosable ? Object.assign({
      disabled: closeBtnIsDisabled,
      closeIcon: mergedCloseIcon
    }, ariaProps) : mergedClosable,
    closeIcon: mergedCloseIcon,
    focusTriggerAfterClose,
    transitionName: getTransitionName(rootPrefixCls, "zoom", props.transitionName),
    maskTransitionName: getTransitionName(rootPrefixCls, "fade", props.maskTransitionName),
    className: classNames(hashId, className, modalContext === null || modalContext === void 0 ? void 0 : modalContext.className),
    style: Object.assign(Object.assign(Object.assign({}, modalContext === null || modalContext === void 0 ? void 0 : modalContext.style), style), responsiveWidthVars),
    classNames: Object.assign(Object.assign(Object.assign({}, modalContext === null || modalContext === void 0 ? void 0 : modalContext.classNames), modalClassNames), {
      wrapper: classNames(wrapClassNameExtended, modalClassNames === null || modalClassNames === void 0 ? void 0 : modalClassNames.wrapper)
    }),
    styles: Object.assign(Object.assign({}, modalContext === null || modalContext === void 0 ? void 0 : modalContext.styles), modalStyles),
    panelRef: mergedPanelRef,
    // TODO: In the future, destroyOnClose in rc-dialog needs to be upgrade to destroyOnHidden
    destroyOnClose: destroyOnHidden !== null && destroyOnHidden !== void 0 ? destroyOnHidden : destroyOnClose
  }), loading ? /* @__PURE__ */ reactExports.createElement(Skeleton, {
    active: true,
    title: false,
    paragraph: {
      rows: 4
    },
    className: `${prefixCls}-body-skeleton`
  }) : children))));
};
const genModalConfirmStyle = (token) => {
  const {
    componentCls,
    titleFontSize,
    titleLineHeight,
    modalConfirmIconSize,
    fontSize,
    lineHeight,
    modalTitleHeight,
    fontHeight,
    confirmBodyPadding
  } = token;
  const confirmComponentCls = `${componentCls}-confirm`;
  return {
    [confirmComponentCls]: {
      "&-rtl": {
        direction: "rtl"
      },
      [`${token.antCls}-modal-header`]: {
        display: "none"
      },
      [`${confirmComponentCls}-body-wrapper`]: Object.assign({}, clearFix()),
      [`&${componentCls} ${componentCls}-body`]: {
        padding: confirmBodyPadding
      },
      // ====================== Body ======================
      [`${confirmComponentCls}-body`]: {
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "start",
        [`> ${token.iconCls}`]: {
          flex: "none",
          fontSize: modalConfirmIconSize,
          marginInlineEnd: token.confirmIconMarginInlineEnd,
          marginTop: token.calc(token.calc(fontHeight).sub(modalConfirmIconSize).equal()).div(2).equal()
        },
        [`&-has-title > ${token.iconCls}`]: {
          marginTop: token.calc(token.calc(modalTitleHeight).sub(modalConfirmIconSize).equal()).div(2).equal()
        }
      },
      [`${confirmComponentCls}-paragraph`]: {
        display: "flex",
        flexDirection: "column",
        flex: "auto",
        rowGap: token.marginXS,
        // https://github.com/ant-design/ant-design/issues/51912
        maxWidth: `calc(100% - ${unit(token.marginSM)})`
      },
      // https://github.com/ant-design/ant-design/issues/48159
      [`${token.iconCls} + ${confirmComponentCls}-paragraph`]: {
        maxWidth: `calc(100% - ${unit(token.calc(token.modalConfirmIconSize).add(token.marginSM).equal())})`
      },
      [`${confirmComponentCls}-title`]: {
        color: token.colorTextHeading,
        fontWeight: token.fontWeightStrong,
        fontSize: titleFontSize,
        lineHeight: titleLineHeight
      },
      [`${confirmComponentCls}-content`]: {
        color: token.colorText,
        fontSize,
        lineHeight
      },
      // ===================== Footer =====================
      [`${confirmComponentCls}-btns`]: {
        textAlign: "end",
        marginTop: token.confirmBtnsMarginTop,
        [`${token.antCls}-btn + ${token.antCls}-btn`]: {
          marginBottom: 0,
          marginInlineStart: token.marginXS
        }
      }
    },
    [`${confirmComponentCls}-error ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorError
    },
    [`${confirmComponentCls}-warning ${confirmComponentCls}-body > ${token.iconCls},
        ${confirmComponentCls}-confirm ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorWarning
    },
    [`${confirmComponentCls}-info ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorInfo
    },
    [`${confirmComponentCls}-success ${confirmComponentCls}-body > ${token.iconCls}`]: {
      color: token.colorSuccess
    }
  };
};
const Confirm = genSubStyleComponent(["Modal", "confirm"], (token) => {
  const modalToken = prepareToken(token);
  return genModalConfirmStyle(modalToken);
}, prepareComponentToken, {
  // confirm is weak than modal since no conflict here
  order: -1e3
});
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function ConfirmContent(props) {
  const {
    prefixCls,
    icon,
    okText,
    cancelText,
    confirmPrefixCls,
    type,
    okCancel,
    footer,
    // Legacy for static function usage
    locale: staticLocale
  } = props, resetProps = __rest$2(props, ["prefixCls", "icon", "okText", "cancelText", "confirmPrefixCls", "type", "okCancel", "footer", "locale"]);
  let mergedIcon = icon;
  if (!icon && icon !== null) {
    switch (type) {
      case "info":
        mergedIcon = /* @__PURE__ */ reactExports.createElement(RefIcon$4, null);
        break;
      case "success":
        mergedIcon = /* @__PURE__ */ reactExports.createElement(RefIcon$3, null);
        break;
      case "error":
        mergedIcon = /* @__PURE__ */ reactExports.createElement(RefIcon$2, null);
        break;
      default:
        mergedIcon = /* @__PURE__ */ reactExports.createElement(RefIcon$1, null);
    }
  }
  const mergedOkCancel = okCancel !== null && okCancel !== void 0 ? okCancel : type === "confirm";
  const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || "ok";
  const [locale] = useLocale("Modal");
  const mergedLocale = staticLocale || locale;
  const okTextLocale = okText || (mergedOkCancel ? mergedLocale === null || mergedLocale === void 0 ? void 0 : mergedLocale.okText : mergedLocale === null || mergedLocale === void 0 ? void 0 : mergedLocale.justOkText);
  const cancelTextLocale = cancelText || (mergedLocale === null || mergedLocale === void 0 ? void 0 : mergedLocale.cancelText);
  const btnCtxValue = Object.assign({
    autoFocusButton,
    cancelTextLocale,
    okTextLocale,
    mergedOkCancel
  }, resetProps);
  const btnCtxValueMemo = reactExports.useMemo(() => btnCtxValue, _toConsumableArray(Object.values(btnCtxValue)));
  const footerOriginNode = /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(ConfirmCancelBtn, null), /* @__PURE__ */ reactExports.createElement(ConfirmOkBtn, null));
  const hasTitle = props.title !== void 0 && props.title !== null;
  const bodyCls = `${confirmPrefixCls}-body`;
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: `${confirmPrefixCls}-body-wrapper`
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(bodyCls, {
      [`${bodyCls}-has-title`]: hasTitle
    })
  }, mergedIcon, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${confirmPrefixCls}-paragraph`
  }, hasTitle && /* @__PURE__ */ reactExports.createElement("span", {
    className: `${confirmPrefixCls}-title`
  }, props.title), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${confirmPrefixCls}-content`
  }, props.content))), footer === void 0 || typeof footer === "function" ? /* @__PURE__ */ reactExports.createElement(ModalContextProvider, {
    value: btnCtxValueMemo
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${confirmPrefixCls}-btns`
  }, typeof footer === "function" ? footer(footerOriginNode, {
    OkBtn: ConfirmOkBtn,
    CancelBtn: ConfirmCancelBtn
  }) : footerOriginNode)) : footer, /* @__PURE__ */ reactExports.createElement(Confirm, {
    prefixCls
  }));
}
const ConfirmDialog = (props) => {
  const {
    close,
    zIndex,
    maskStyle,
    direction,
    prefixCls,
    wrapClassName,
    rootPrefixCls,
    bodyStyle,
    closable = false,
    onConfirm,
    styles
  } = props;
  const confirmPrefixCls = `${prefixCls}-confirm`;
  const width = props.width || 416;
  const style = props.style || {};
  const mask = props.mask === void 0 ? true : props.mask;
  const maskClosable = props.maskClosable === void 0 ? false : props.maskClosable;
  const classString = classNames(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`, {
    [`${confirmPrefixCls}-rtl`]: direction === "rtl"
  }, props.className);
  const [, token] = useToken();
  const mergedZIndex = reactExports.useMemo(() => {
    if (zIndex !== void 0) {
      return zIndex;
    }
    return token.zIndexPopupBase + CONTAINER_MAX_OFFSET;
  }, [zIndex, token]);
  return /* @__PURE__ */ reactExports.createElement(Modal$1, Object.assign({}, props, {
    className: classString,
    wrapClassName: classNames({
      [`${confirmPrefixCls}-centered`]: !!props.centered
    }, wrapClassName),
    onCancel: () => {
      close === null || close === void 0 ? void 0 : close({
        triggerCancel: true
      });
      onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(false);
    },
    title: "",
    footer: null,
    transitionName: getTransitionName(rootPrefixCls || "", "zoom", props.transitionName),
    maskTransitionName: getTransitionName(rootPrefixCls || "", "fade", props.maskTransitionName),
    mask,
    maskClosable,
    style,
    styles: Object.assign({
      body: bodyStyle,
      mask: maskStyle
    }, styles),
    width,
    zIndex: mergedZIndex,
    closable
  }), /* @__PURE__ */ reactExports.createElement(ConfirmContent, Object.assign({}, props, {
    confirmPrefixCls
  })));
};
const ConfirmDialogWrapper$1 = (props) => {
  const {
    rootPrefixCls,
    iconPrefixCls,
    direction,
    theme
  } = props;
  return /* @__PURE__ */ reactExports.createElement(ConfigProvider, {
    prefixCls: rootPrefixCls,
    iconPrefixCls,
    direction,
    theme
  }, /* @__PURE__ */ reactExports.createElement(ConfirmDialog, Object.assign({}, props)));
};
const destroyFns = [];
let defaultRootPrefixCls = "";
function getRootPrefixCls() {
  return defaultRootPrefixCls;
}
const ConfirmDialogWrapper = (props) => {
  var _a, _b;
  const {
    prefixCls: customizePrefixCls,
    getContainer,
    direction
  } = props;
  const runtimeLocale = getConfirmLocale();
  const config = reactExports.useContext(ConfigContext);
  const rootPrefixCls = getRootPrefixCls() || config.getPrefixCls();
  const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`;
  let mergedGetContainer = getContainer;
  if (mergedGetContainer === false) {
    mergedGetContainer = void 0;
  }
  return /* @__PURE__ */ React.createElement(ConfirmDialogWrapper$1, Object.assign({}, props, {
    rootPrefixCls,
    prefixCls,
    iconPrefixCls: config.iconPrefixCls,
    theme: config.theme,
    direction: direction !== null && direction !== void 0 ? direction : config.direction,
    locale: (_b = (_a = config.locale) === null || _a === void 0 ? void 0 : _a.Modal) !== null && _b !== void 0 ? _b : runtimeLocale,
    getContainer: mergedGetContainer
  }));
};
function confirm(config) {
  const global = globalConfig();
  const container = document.createDocumentFragment();
  let currentConfig = Object.assign(Object.assign({}, config), {
    close,
    open: true
  });
  let timeoutId;
  let reactUnmount;
  function destroy(...args) {
    var _a;
    const triggerCancel = args.some((param) => param === null || param === void 0 ? void 0 : param.triggerCancel);
    if (triggerCancel) {
      var _a2;
      (_a = config.onCancel) === null || _a === void 0 ? void 0 : (_a2 = _a).call.apply(_a2, [config, () => {
      }].concat(_toConsumableArray(args.slice(1))));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
    reactUnmount();
  }
  function render(props) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const rootPrefixCls = global.getPrefixCls(void 0, getRootPrefixCls());
      const iconPrefixCls = global.getIconPrefixCls();
      const theme = global.getTheme();
      const dom = /* @__PURE__ */ React.createElement(ConfirmDialogWrapper, Object.assign({}, props));
      const reactRender = unstableSetRender();
      reactUnmount = reactRender(/* @__PURE__ */ React.createElement(ConfigProvider, {
        prefixCls: rootPrefixCls,
        iconPrefixCls,
        theme
      }, global.holderRender ? global.holderRender(dom) : dom), container);
    });
  }
  function close(...args) {
    currentConfig = Object.assign(Object.assign({}, currentConfig), {
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === "function") {
          config.afterClose();
        }
        destroy.apply(this, args);
      }
    });
    if (currentConfig.visible) {
      delete currentConfig.visible;
    }
    render(currentConfig);
  }
  function update(configUpdate) {
    if (typeof configUpdate === "function") {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = Object.assign(Object.assign({}, currentConfig), configUpdate);
    }
    render(currentConfig);
  }
  render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update
  };
}
function withWarn(props) {
  return Object.assign(Object.assign({}, props), {
    type: "warning"
  });
}
function withInfo(props) {
  return Object.assign(Object.assign({}, props), {
    type: "info"
  });
}
function withSuccess(props) {
  return Object.assign(Object.assign({}, props), {
    type: "success"
  });
}
function withError(props) {
  return Object.assign(Object.assign({}, props), {
    type: "error"
  });
}
function withConfirm(props) {
  return Object.assign(Object.assign({}, props), {
    type: "confirm"
  });
}
function modalGlobalConfig({
  rootPrefixCls
}) {
  defaultRootPrefixCls = rootPrefixCls;
}
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const HookModal = (_a, ref) => {
  var _b;
  var {
    afterClose: hookAfterClose,
    config
  } = _a, restProps = __rest$1(_a, ["afterClose", "config"]);
  const [open, setOpen] = reactExports.useState(true);
  const [innerConfig, setInnerConfig] = reactExports.useState(config);
  const {
    direction,
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("modal");
  const rootPrefixCls = getPrefixCls();
  const afterClose = () => {
    var _a2;
    hookAfterClose();
    (_a2 = innerConfig.afterClose) === null || _a2 === void 0 ? void 0 : _a2.call(innerConfig);
  };
  const close = (...args) => {
    var _a2;
    setOpen(false);
    const triggerCancel = args.some((param) => param === null || param === void 0 ? void 0 : param.triggerCancel);
    if (triggerCancel) {
      var _a22;
      (_a2 = innerConfig.onCancel) === null || _a2 === void 0 ? void 0 : (_a22 = _a2).call.apply(_a22, [innerConfig, () => {
      }].concat(_toConsumableArray(args.slice(1))));
    }
  };
  reactExports.useImperativeHandle(ref, () => ({
    destroy: close,
    update: (newConfig) => {
      setInnerConfig((originConfig) => {
        const nextConfig = typeof newConfig === "function" ? newConfig(originConfig) : newConfig;
        return Object.assign(Object.assign({}, originConfig), nextConfig);
      });
    }
  }));
  const mergedOkCancel = (_b = innerConfig.okCancel) !== null && _b !== void 0 ? _b : innerConfig.type === "confirm";
  const [contextLocale] = useLocale("Modal", localeValues.Modal);
  return /* @__PURE__ */ reactExports.createElement(ConfirmDialogWrapper$1, Object.assign({
    prefixCls,
    rootPrefixCls
  }, innerConfig, {
    close,
    open,
    afterClose,
    okText: innerConfig.okText || (mergedOkCancel ? contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.okText : contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.justOkText),
    direction: innerConfig.direction || direction,
    cancelText: innerConfig.cancelText || (contextLocale === null || contextLocale === void 0 ? void 0 : contextLocale.cancelText)
  }, restProps));
};
const HookModal$1 = /* @__PURE__ */ reactExports.forwardRef(HookModal);
let uuid = 0;
const ElementsHolder = /* @__PURE__ */ reactExports.memo(/* @__PURE__ */ reactExports.forwardRef((_props, ref) => {
  const [elements, patchElement] = usePatchElement();
  reactExports.useImperativeHandle(ref, () => ({
    patchElement
  }), []);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, elements);
}));
function useModal() {
  const holderRef = reactExports.useRef(null);
  const [actionQueue, setActionQueue] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (actionQueue.length) {
      const cloneQueue = _toConsumableArray(actionQueue);
      cloneQueue.forEach((action) => {
        action();
      });
      setActionQueue([]);
    }
  }, [actionQueue]);
  const getConfirmFunc = reactExports.useCallback((withFunc) => function hookConfirm(config) {
    var _a;
    uuid += 1;
    const modalRef = /* @__PURE__ */ reactExports.createRef();
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    let silent = false;
    let closeFunc;
    const modal = /* @__PURE__ */ reactExports.createElement(HookModal$1, {
      key: `modal-${uuid}`,
      config: withFunc(config),
      ref: modalRef,
      afterClose: () => {
        closeFunc === null || closeFunc === void 0 ? void 0 : closeFunc();
      },
      isSilent: () => silent,
      onConfirm: (confirmed) => {
        resolvePromise(confirmed);
      }
    });
    closeFunc = (_a = holderRef.current) === null || _a === void 0 ? void 0 : _a.patchElement(modal);
    if (closeFunc) {
      destroyFns.push(closeFunc);
    }
    const instance = {
      destroy: () => {
        function destroyAction() {
          var _a2;
          (_a2 = modalRef.current) === null || _a2 === void 0 ? void 0 : _a2.destroy();
        }
        if (modalRef.current) {
          destroyAction();
        } else {
          setActionQueue((prev) => [].concat(_toConsumableArray(prev), [destroyAction]));
        }
      },
      update: (newConfig) => {
        function updateAction() {
          var _a2;
          (_a2 = modalRef.current) === null || _a2 === void 0 ? void 0 : _a2.update(newConfig);
        }
        if (modalRef.current) {
          updateAction();
        } else {
          setActionQueue((prev) => [].concat(_toConsumableArray(prev), [updateAction]));
        }
      },
      then: (resolve) => {
        silent = true;
        return promise.then(resolve);
      }
    };
    return instance;
  }, []);
  const fns = reactExports.useMemo(() => ({
    info: getConfirmFunc(withInfo),
    success: getConfirmFunc(withSuccess),
    error: getConfirmFunc(withError),
    warning: getConfirmFunc(withWarn),
    confirm: getConfirmFunc(withConfirm)
  }), []);
  return [fns, /* @__PURE__ */ reactExports.createElement(ElementsHolder, {
    key: "modal-holder",
    ref: holderRef
  })];
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const PurePanel = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    closeIcon,
    closable,
    type,
    title,
    children,
    footer
  } = props, restProps = __rest(props, ["prefixCls", "className", "closeIcon", "closable", "type", "title", "children", "footer"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const prefixCls = customizePrefixCls || getPrefixCls("modal");
  const rootCls = useCSSVarCls(rootPrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const confirmPrefixCls = `${prefixCls}-confirm`;
  let additionalProps = {};
  if (type) {
    additionalProps = {
      closable: closable !== null && closable !== void 0 ? closable : false,
      title: "",
      footer: "",
      children: /* @__PURE__ */ reactExports.createElement(ConfirmContent, Object.assign({}, props, {
        prefixCls,
        confirmPrefixCls,
        rootPrefixCls,
        content: children
      }))
    };
  } else {
    additionalProps = {
      closable: closable !== null && closable !== void 0 ? closable : true,
      title,
      footer: footer !== null && /* @__PURE__ */ reactExports.createElement(Footer, Object.assign({}, props)),
      children
    };
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(Panel, Object.assign({
    prefixCls,
    className: classNames(hashId, `${prefixCls}-pure-panel`, type && confirmPrefixCls, type && `${confirmPrefixCls}-${type}`, className, cssVarCls, rootCls)
  }, restProps, {
    closeIcon: renderCloseIcon(prefixCls, closeIcon),
    closable
  }, additionalProps)));
};
const PurePanel$1 = withPureRenderTheme(PurePanel);
function modalWarn(props) {
  return confirm(withWarn(props));
}
const Modal = Modal$1;
Modal.useModal = useModal;
Modal.info = function infoFn(props) {
  return confirm(withInfo(props));
};
Modal.success = function successFn(props) {
  return confirm(withSuccess(props));
};
Modal.error = function errorFn(props) {
  return confirm(withError(props));
};
Modal.warning = modalWarn;
Modal.warn = modalWarn;
Modal.confirm = function confirmFn(props) {
  return confirm(withConfirm(props));
};
Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};
Modal.config = modalGlobalConfig;
Modal._InternalPanelDoNotUseOrYouWillBeFired = PurePanel$1;
export {
  ActionButton as A,
  Modal as M,
  useModal as u
};
//# sourceMappingURL=index-DFQcmyfW.js.map
