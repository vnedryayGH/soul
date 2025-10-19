import { a as reactExports, R as React, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { r as _slicedToArray, f as classNames, v as _defineProperty, w as _objectSpread2, x as useEvent, y as calculateColor, z as calcOffset, E as useMergedState, G as generateColor, H as Color, J as ColorPickerPrefixCls, K as _extends$7, N as ColorBlock, O as defaultColor, P as Keyframe, Q as genStyleHooks, R as merge, U as unit, V as resetComponent, W as CONTAINER_MAX_OFFSET, X as genFocusStyle, Y as RefIcon$7, Z as RefIcon$8, $ as RefIcon$9, a0 as RefIcon$a, a1 as RefIcon$b, a2 as devUseWarning, C as ConfigContext, a3 as useToken, a4 as useNotification$1, a5 as useCSSVarCls, a6 as NotificationProvider, a7 as AppConfigContext, a8 as useMessage, a9 as AppContext, aa as useLayoutEffect, ab as CSSMotion, ac as composeRef, ad as _objectWithoutProperties, o as omit, ae as _typeof, af as genFocusOutline, ag as textEllipsis, ah as useId, d as useComponentConfig, ai as useSize, aj as generateColor$1, ak as getColorAlpha, al as toHexFormat, am as Input, an as getRoundNumber, n as Select, ao as getGradientPercentColor, _ as _toConsumableArray, ap as AggregationColor, aq as genAlphaColor, ar as ColorPresets, as as useLocale, at as pickAttrs, au as genCompactItemStyle, av as DisabledContext, aw as FormItemInputContext, ax as useCompactItemContext, ay as getStatusClassNames, az as ContextIsolator, aA as genPurePanel, b as usePermissions, T as Typography, l as Space, p as Tag, I as Input$1, aB as Tooltip, B as Button, c as apiRequest, s as staticMethods } from "./index-B4P9h-k1.js";
import { C as Card, T as Tabs } from "./index-C8B9-ZwJ.js";
import { R as RefIcon$c } from "./UserOutlined-DifgQx5K.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { A as Avatar } from "./index-B3Kptpnc.js";
import { R as RefIcon$d } from "./LockOutlined-C1Rl7fRm.js";
import { D as DatePicker } from "./index-I1l_E206.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import { R as RefIcon$e } from "./ReloadOutlined-b-zgDpPK.js";
import { R as RefIcon$f } from "./SyncOutlined-0cRsLd2H.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import { R as RefIcon$g } from "./MessageOutlined-BU8XjoXo.js";
import { R as RefIcon$h } from "./RobotOutlined-B-2S_nNK.js";
import { R as RefIcon$i } from "./CalendarOutlined-CrDxWlMe.js";
import { R as RefIcon$j } from "./CrownOutlined-D9QrRtN8.js";
import { P as Progress } from "./progress-CLbv5c2s.js";
import { R as RefIcon$k } from "./HeartOutlined-BTgLj15z.js";
import { R as RefIcon$l } from "./SettingOutlined-COiCZpX-.js";
import { R as RefIcon$m } from "./TrophyOutlined-DgPxsEl-.js";
import { R as RefIcon$n } from "./FileTextOutlined-lwBP-Cdj.js";
import { R as RefIcon$o } from "./DeleteOutlined-CXvGRz1h.js";
import { u as useModal, M as Modal } from "./index-DFQcmyfW.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { R as RefIcon$p } from "./PlusOutlined-uyGxXb0G.js";
import { R as RefIcon$q } from "./EyeOutlined-N_Qv3Ysz.js";
import { P as Popover } from "./index-C3XsEteC.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { S as SliderInternalContext, U as UnstableContext, a as Slider$1 } from "./index-BXtDgZ6P.js";
import { R as RefIcon$r } from "./SaveOutlined-B8yyOf7O.js";
import { R as RefIcon$s } from "./BellOutlined-BFXf9PSt.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { A as Alert } from "./index-DVLFW87y.js";
import "./Skeleton-D3e3aC7P.js";
import "./index-BlJydARW.js";
import "./dayjs.min-CsyiZdAh.js";
import "./CalendarOutlined-B_ajlQ0Y.js";
import "./ClockCircleOutlined-B2hpDlMl.js";
import "./context-CGIstv1h.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
function getPosition(e) {
  var obj = "touches" in e ? e.touches[0] : e;
  var scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
  var scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
  return {
    pageX: obj.pageX - scrollXOffset,
    pageY: obj.pageY - scrollYOffset
  };
}
function useColorDrag(props) {
  var targetRef = props.targetRef, containerRef = props.containerRef, direction = props.direction, onDragChange = props.onDragChange, onDragChangeComplete = props.onDragChangeComplete, calculate = props.calculate, color = props.color, disabledDrag = props.disabledDrag;
  var _useState = reactExports.useState({
    x: 0,
    y: 0
  }), _useState2 = _slicedToArray(_useState, 2), offsetValue = _useState2[0], setOffsetValue = _useState2[1];
  var mouseMoveRef = reactExports.useRef(null);
  var mouseUpRef = reactExports.useRef(null);
  reactExports.useEffect(function() {
    setOffsetValue(calculate());
  }, [color]);
  reactExports.useEffect(function() {
    return function() {
      document.removeEventListener("mousemove", mouseMoveRef.current);
      document.removeEventListener("mouseup", mouseUpRef.current);
      document.removeEventListener("touchmove", mouseMoveRef.current);
      document.removeEventListener("touchend", mouseUpRef.current);
      mouseMoveRef.current = null;
      mouseUpRef.current = null;
    };
  }, []);
  var updateOffset = function updateOffset2(e) {
    var _getPosition = getPosition(e), pageX = _getPosition.pageX, pageY = _getPosition.pageY;
    var _containerRef$current = containerRef.current.getBoundingClientRect(), rectX = _containerRef$current.x, rectY = _containerRef$current.y, width = _containerRef$current.width, height = _containerRef$current.height;
    var _targetRef$current$ge = targetRef.current.getBoundingClientRect(), targetWidth = _targetRef$current$ge.width, targetHeight = _targetRef$current$ge.height;
    var centerOffsetX = targetWidth / 2;
    var centerOffsetY = targetHeight / 2;
    var offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    var offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;
    var calcOffset2 = {
      x: offsetX,
      y: direction === "x" ? offsetValue.y : offsetY
    };
    if (targetWidth === 0 && targetHeight === 0 || targetWidth !== targetHeight) {
      return false;
    }
    onDragChange === null || onDragChange === void 0 || onDragChange(calcOffset2);
  };
  var onDragMove = function onDragMove2(e) {
    e.preventDefault();
    updateOffset(e);
  };
  var onDragStop = function onDragStop2(e) {
    e.preventDefault();
    document.removeEventListener("mousemove", mouseMoveRef.current);
    document.removeEventListener("mouseup", mouseUpRef.current);
    document.removeEventListener("touchmove", mouseMoveRef.current);
    document.removeEventListener("touchend", mouseUpRef.current);
    mouseMoveRef.current = null;
    mouseUpRef.current = null;
    onDragChangeComplete === null || onDragChangeComplete === void 0 || onDragChangeComplete();
  };
  var onDragStart = function onDragStart2(e) {
    document.removeEventListener("mousemove", mouseMoveRef.current);
    document.removeEventListener("mouseup", mouseUpRef.current);
    if (disabledDrag) {
      return;
    }
    updateOffset(e);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragStop);
    document.addEventListener("touchmove", onDragMove);
    document.addEventListener("touchend", onDragStop);
    mouseMoveRef.current = onDragMove;
    mouseUpRef.current = onDragStop;
  };
  return [offsetValue, onDragStart];
}
var Handler = function Handler2(_ref) {
  var _ref$size = _ref.size, size = _ref$size === void 0 ? "default" : _ref$size, color = _ref.color, prefixCls = _ref.prefixCls;
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames("".concat(prefixCls, "-handler"), _defineProperty({}, "".concat(prefixCls, "-handler-sm"), size === "small")),
    style: {
      backgroundColor: color
    }
  });
};
var Palette = function Palette2(_ref) {
  var children = _ref.children, style = _ref.style, prefixCls = _ref.prefixCls;
  return /* @__PURE__ */ React.createElement("div", {
    className: "".concat(prefixCls, "-palette"),
    style: _objectSpread2({
      position: "relative"
    }, style)
  }, children);
};
var Transform = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var children = props.children, x = props.x, y = props.y;
  return /* @__PURE__ */ React.createElement("div", {
    ref,
    style: {
      position: "absolute",
      left: "".concat(x, "%"),
      top: "".concat(y, "%"),
      zIndex: 1,
      transform: "translate(-50%, -50%)"
    }
  }, children);
});
var Picker = function Picker2(_ref) {
  var color = _ref.color, onChange = _ref.onChange, prefixCls = _ref.prefixCls, onChangeComplete = _ref.onChangeComplete, disabled = _ref.disabled;
  var pickerRef = reactExports.useRef();
  var transformRef = reactExports.useRef();
  var colorRef = reactExports.useRef(color);
  var onDragChange = useEvent(function(offsetValue) {
    var calcColor = calculateColor({
      offset: offsetValue,
      targetRef: transformRef,
      containerRef: pickerRef,
      color
    });
    colorRef.current = calcColor;
    onChange(calcColor);
  });
  var _useColorDrag = useColorDrag({
    color,
    containerRef: pickerRef,
    targetRef: transformRef,
    calculate: function calculate() {
      return calcOffset(color);
    },
    onDragChange,
    onDragChangeComplete: function onDragChangeComplete() {
      return onChangeComplete === null || onChangeComplete === void 0 ? void 0 : onChangeComplete(colorRef.current);
    },
    disabledDrag: disabled
  }), _useColorDrag2 = _slicedToArray(_useColorDrag, 2), offset = _useColorDrag2[0], dragStartHandle = _useColorDrag2[1];
  return /* @__PURE__ */ React.createElement("div", {
    ref: pickerRef,
    className: "".concat(prefixCls, "-select"),
    onMouseDown: dragStartHandle,
    onTouchStart: dragStartHandle
  }, /* @__PURE__ */ React.createElement(Palette, {
    prefixCls
  }, /* @__PURE__ */ React.createElement(Transform, {
    x: offset.x,
    y: offset.y,
    ref: transformRef
  }, /* @__PURE__ */ React.createElement(Handler, {
    color: color.toRgbString(),
    prefixCls
  })), /* @__PURE__ */ React.createElement("div", {
    className: "".concat(prefixCls, "-saturation"),
    style: {
      backgroundColor: "hsl(".concat(color.toHsb().h, ",100%, 50%)"),
      backgroundImage: "linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))"
    }
  })));
};
var useColorState = function useColorState2(defaultValue, value) {
  var _useMergedState = useMergedState(defaultValue, {
    value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedValue = _useMergedState2[0], setValue = _useMergedState2[1];
  var color = reactExports.useMemo(function() {
    return generateColor(mergedValue);
  }, [mergedValue]);
  return [color, setValue];
};
var Gradient = function Gradient2(_ref) {
  var colors = _ref.colors, children = _ref.children, _ref$direction = _ref.direction, direction = _ref$direction === void 0 ? "to right" : _ref$direction, type = _ref.type, prefixCls = _ref.prefixCls;
  var gradientColors = reactExports.useMemo(function() {
    return colors.map(function(color, idx) {
      var result = generateColor(color);
      if (type === "alpha" && idx === colors.length - 1) {
        result = new Color(result.setA(1));
      }
      return result.toRgbString();
    }).join(",");
  }, [colors, type]);
  return /* @__PURE__ */ React.createElement("div", {
    className: "".concat(prefixCls, "-gradient"),
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(".concat(direction, ", ").concat(gradientColors, ")")
    }
  }, children);
};
var Slider = function Slider2(props) {
  var prefixCls = props.prefixCls, colors = props.colors, disabled = props.disabled, onChange = props.onChange, onChangeComplete = props.onChangeComplete, color = props.color, type = props.type;
  var sliderRef = reactExports.useRef();
  var transformRef = reactExports.useRef();
  var colorRef = reactExports.useRef(color);
  var getValue = function getValue2(c) {
    return type === "hue" ? c.getHue() : c.a * 100;
  };
  var onDragChange = useEvent(function(offsetValue) {
    var calcColor = calculateColor({
      offset: offsetValue,
      targetRef: transformRef,
      containerRef: sliderRef,
      color,
      type
    });
    colorRef.current = calcColor;
    onChange(getValue(calcColor));
  });
  var _useColorDrag = useColorDrag({
    color,
    targetRef: transformRef,
    containerRef: sliderRef,
    calculate: function calculate() {
      return calcOffset(color, type);
    },
    onDragChange,
    onDragChangeComplete: function onDragChangeComplete() {
      onChangeComplete(getValue(colorRef.current));
    },
    direction: "x",
    disabledDrag: disabled
  }), _useColorDrag2 = _slicedToArray(_useColorDrag, 2), offset = _useColorDrag2[0], dragStartHandle = _useColorDrag2[1];
  var handleColor = React.useMemo(function() {
    if (type === "hue") {
      var hsb = color.toHsb();
      hsb.s = 1;
      hsb.b = 1;
      hsb.a = 1;
      var lightColor = new Color(hsb);
      return lightColor;
    }
    return color;
  }, [color, type]);
  var gradientList = React.useMemo(function() {
    return colors.map(function(info) {
      return "".concat(info.color, " ").concat(info.percent, "%");
    });
  }, [colors]);
  return /* @__PURE__ */ React.createElement("div", {
    ref: sliderRef,
    className: classNames("".concat(prefixCls, "-slider"), "".concat(prefixCls, "-slider-").concat(type)),
    onMouseDown: dragStartHandle,
    onTouchStart: dragStartHandle
  }, /* @__PURE__ */ React.createElement(Palette, {
    prefixCls
  }, /* @__PURE__ */ React.createElement(Transform, {
    x: offset.x,
    y: offset.y,
    ref: transformRef
  }, /* @__PURE__ */ React.createElement(Handler, {
    size: "small",
    color: handleColor.toHexString(),
    prefixCls
  })), /* @__PURE__ */ React.createElement(Gradient, {
    colors: gradientList,
    type,
    prefixCls
  })));
};
function useComponent(components2) {
  return reactExports.useMemo(function() {
    var _ref = components2 || {}, slider = _ref.slider;
    return [slider || Slider];
  }, [components2]);
}
var HUE_COLORS = [{
  color: "rgb(255, 0, 0)",
  percent: 0
}, {
  color: "rgb(255, 255, 0)",
  percent: 17
}, {
  color: "rgb(0, 255, 0)",
  percent: 33
}, {
  color: "rgb(0, 255, 255)",
  percent: 50
}, {
  color: "rgb(0, 0, 255)",
  percent: 67
}, {
  color: "rgb(255, 0, 255)",
  percent: 83
}, {
  color: "rgb(255, 0, 0)",
  percent: 100
}];
var ColorPicker$1 = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var value = props.value, defaultValue = props.defaultValue, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? ColorPickerPrefixCls : _props$prefixCls, onChange = props.onChange, onChangeComplete = props.onChangeComplete, className = props.className, style = props.style, panelRender = props.panelRender, _props$disabledAlpha = props.disabledAlpha, disabledAlpha = _props$disabledAlpha === void 0 ? false : _props$disabledAlpha, _props$disabled = props.disabled, disabled = _props$disabled === void 0 ? false : _props$disabled, components2 = props.components;
  var _useComponent = useComponent(components2), _useComponent2 = _slicedToArray(_useComponent, 1), Slider3 = _useComponent2[0];
  var _useColorState = useColorState(defaultValue || defaultColor, value), _useColorState2 = _slicedToArray(_useColorState, 2), colorValue = _useColorState2[0], setColorValue = _useColorState2[1];
  var alphaColor = reactExports.useMemo(function() {
    return colorValue.setA(1).toRgbString();
  }, [colorValue]);
  var handleChange = function handleChange2(data, type) {
    if (!value) {
      setColorValue(data);
    }
    onChange === null || onChange === void 0 || onChange(data, type);
  };
  var getHueColor = function getHueColor2(hue) {
    return new Color(colorValue.setHue(hue));
  };
  var getAlphaColor = function getAlphaColor2(alpha) {
    return new Color(colorValue.setA(alpha / 100));
  };
  var onHueChange = function onHueChange2(hue) {
    handleChange(getHueColor(hue), {
      type: "hue",
      value: hue
    });
  };
  var onAlphaChange = function onAlphaChange2(alpha) {
    handleChange(getAlphaColor(alpha), {
      type: "alpha",
      value: alpha
    });
  };
  var onHueChangeComplete = function onHueChangeComplete2(hue) {
    if (onChangeComplete) {
      onChangeComplete(getHueColor(hue));
    }
  };
  var onAlphaChangeComplete = function onAlphaChangeComplete2(alpha) {
    if (onChangeComplete) {
      onChangeComplete(getAlphaColor(alpha));
    }
  };
  var mergeCls = classNames("".concat(prefixCls, "-panel"), className, _defineProperty({}, "".concat(prefixCls, "-panel-disabled"), disabled));
  var sharedSliderProps = {
    prefixCls,
    disabled,
    color: colorValue
  };
  var defaultPanel = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Picker, _extends$7({
    onChange: handleChange
  }, sharedSliderProps, {
    onChangeComplete
  })), /* @__PURE__ */ React.createElement("div", {
    className: "".concat(prefixCls, "-slider-container")
  }, /* @__PURE__ */ React.createElement("div", {
    className: classNames("".concat(prefixCls, "-slider-group"), _defineProperty({}, "".concat(prefixCls, "-slider-group-disabled-alpha"), disabledAlpha))
  }, /* @__PURE__ */ React.createElement(Slider3, _extends$7({}, sharedSliderProps, {
    type: "hue",
    colors: HUE_COLORS,
    min: 0,
    max: 359,
    value: colorValue.getHue(),
    onChange: onHueChange,
    onChangeComplete: onHueChangeComplete
  })), !disabledAlpha && /* @__PURE__ */ React.createElement(Slider3, _extends$7({}, sharedSliderProps, {
    type: "alpha",
    colors: [{
      percent: 0,
      color: "rgba(255, 0, 4, 0)"
    }, {
      percent: 100,
      color: alphaColor
    }],
    min: 0,
    max: 100,
    value: colorValue.a * 100,
    onChange: onAlphaChange,
    onChangeComplete: onAlphaChangeComplete
  }))), /* @__PURE__ */ React.createElement(ColorBlock, {
    color: colorValue.toRgbString(),
    prefixCls
  })));
  return /* @__PURE__ */ React.createElement("div", {
    className: mergeCls,
    style,
    ref
  }, typeof panelRender === "function" ? panelRender(defaultPanel) : defaultPanel);
});
const genNotificationPlacementStyle = (token) => {
  const {
    componentCls,
    notificationMarginEdge,
    animationMaxHeight
  } = token;
  const noticeCls = `${componentCls}-notice`;
  const rightFadeIn = new Keyframe("antNotificationFadeIn", {
    "0%": {
      transform: `translate3d(100%, 0, 0)`,
      opacity: 0
    },
    "100%": {
      transform: `translate3d(0, 0, 0)`,
      opacity: 1
    }
  });
  const topFadeIn = new Keyframe("antNotificationTopFadeIn", {
    "0%": {
      top: -animationMaxHeight,
      opacity: 0
    },
    "100%": {
      top: 0,
      opacity: 1
    }
  });
  const bottomFadeIn = new Keyframe("antNotificationBottomFadeIn", {
    "0%": {
      bottom: token.calc(animationMaxHeight).mul(-1).equal(),
      opacity: 0
    },
    "100%": {
      bottom: 0,
      opacity: 1
    }
  });
  const leftFadeIn = new Keyframe("antNotificationLeftFadeIn", {
    "0%": {
      transform: `translate3d(-100%, 0, 0)`,
      opacity: 0
    },
    "100%": {
      transform: `translate3d(0, 0, 0)`,
      opacity: 1
    }
  });
  return {
    [componentCls]: {
      [`&${componentCls}-top, &${componentCls}-bottom`]: {
        marginInline: 0,
        [noticeCls]: {
          marginInline: "auto auto"
        }
      },
      [`&${componentCls}-top`]: {
        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
          animationName: topFadeIn
        }
      },
      [`&${componentCls}-bottom`]: {
        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
          animationName: bottomFadeIn
        }
      },
      [`&${componentCls}-topRight, &${componentCls}-bottomRight`]: {
        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
          animationName: rightFadeIn
        }
      },
      [`&${componentCls}-topLeft, &${componentCls}-bottomLeft`]: {
        marginRight: {
          value: 0,
          _skip_check_: true
        },
        marginLeft: {
          value: notificationMarginEdge,
          _skip_check_: true
        },
        [noticeCls]: {
          marginInlineEnd: "auto",
          marginInlineStart: 0
        },
        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
          animationName: leftFadeIn
        }
      }
    }
  };
};
const NotificationPlacements = ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight"];
const placementAlignProperty = {
  topLeft: "left",
  topRight: "right",
  bottomLeft: "left",
  bottomRight: "right",
  top: "left",
  bottom: "left"
};
const genPlacementStackStyle = (token, placement) => {
  const {
    componentCls
  } = token;
  return {
    [`${componentCls}-${placement}`]: {
      [`&${componentCls}-stack > ${componentCls}-notice-wrapper`]: {
        [placement.startsWith("top") ? "top" : "bottom"]: 0,
        [placementAlignProperty[placement]]: {
          value: 0,
          _skip_check_: true
        }
      }
    }
  };
};
const genStackChildrenStyle = (token) => {
  const childrenStyle = {};
  for (let i = 1; i < token.notificationStackLayer; i++) {
    childrenStyle[`&:nth-last-child(${i + 1})`] = {
      overflow: "hidden",
      [`& > ${token.componentCls}-notice`]: {
        opacity: 0,
        transition: `opacity ${token.motionDurationMid}`
      }
    };
  }
  return Object.assign({
    [`&:not(:nth-last-child(-n+${token.notificationStackLayer}))`]: {
      opacity: 0,
      overflow: "hidden",
      color: "transparent",
      pointerEvents: "none"
    }
  }, childrenStyle);
};
const genStackedNoticeStyle = (token) => {
  const childrenStyle = {};
  for (let i = 1; i < token.notificationStackLayer; i++) {
    childrenStyle[`&:nth-last-child(${i + 1})`] = {
      background: token.colorBgBlur,
      backdropFilter: "blur(10px)",
      "-webkit-backdrop-filter": "blur(10px)"
    };
  }
  return Object.assign({}, childrenStyle);
};
const genStackStyle = (token) => {
  const {
    componentCls
  } = token;
  return Object.assign({
    [`${componentCls}-stack`]: {
      [`& > ${componentCls}-notice-wrapper`]: Object.assign({
        transition: `transform ${token.motionDurationSlow}, backdrop-filter 0s`,
        willChange: "transform, opacity",
        position: "absolute"
      }, genStackChildrenStyle(token))
    },
    [`${componentCls}-stack:not(${componentCls}-stack-expanded)`]: {
      [`& > ${componentCls}-notice-wrapper`]: Object.assign({}, genStackedNoticeStyle(token))
    },
    [`${componentCls}-stack${componentCls}-stack-expanded`]: {
      [`& > ${componentCls}-notice-wrapper`]: {
        "&:not(:nth-last-child(-n + 1))": {
          opacity: 1,
          overflow: "unset",
          color: "inherit",
          pointerEvents: "auto",
          [`& > ${token.componentCls}-notice`]: {
            opacity: 1
          }
        },
        "&:after": {
          content: '""',
          position: "absolute",
          height: token.margin,
          width: "100%",
          insetInline: 0,
          bottom: token.calc(token.margin).mul(-1).equal(),
          background: "transparent",
          pointerEvents: "auto"
        }
      }
    }
  }, NotificationPlacements.map((placement) => genPlacementStackStyle(token, placement)).reduce((acc, cur) => Object.assign(Object.assign({}, acc), cur), {}));
};
const genNoticeStyle = (token) => {
  const {
    iconCls,
    componentCls,
    // .ant-notification
    boxShadow,
    fontSizeLG,
    notificationMarginBottom,
    borderRadiusLG,
    colorSuccess,
    colorInfo,
    colorWarning,
    colorError,
    colorTextHeading,
    notificationBg,
    notificationPadding,
    notificationMarginEdge,
    notificationProgressBg,
    notificationProgressHeight,
    fontSize,
    lineHeight,
    width,
    notificationIconSize,
    colorText
  } = token;
  const noticeCls = `${componentCls}-notice`;
  return {
    position: "relative",
    marginBottom: notificationMarginBottom,
    marginInlineStart: "auto",
    background: notificationBg,
    borderRadius: borderRadiusLG,
    boxShadow,
    [noticeCls]: {
      padding: notificationPadding,
      width,
      maxWidth: `calc(100vw - ${unit(token.calc(notificationMarginEdge).mul(2).equal())})`,
      overflow: "hidden",
      lineHeight,
      wordWrap: "break-word"
    },
    [`${noticeCls}-message`]: {
      color: colorTextHeading,
      fontSize: fontSizeLG,
      lineHeight: token.lineHeightLG
    },
    [`${noticeCls}-description`]: {
      fontSize,
      color: colorText,
      marginTop: token.marginXS
    },
    [`${noticeCls}-closable ${noticeCls}-message`]: {
      paddingInlineEnd: token.paddingLG
    },
    [`${noticeCls}-with-icon ${noticeCls}-message`]: {
      marginInlineStart: token.calc(token.marginSM).add(notificationIconSize).equal(),
      fontSize: fontSizeLG
    },
    [`${noticeCls}-with-icon ${noticeCls}-description`]: {
      marginInlineStart: token.calc(token.marginSM).add(notificationIconSize).equal(),
      fontSize
    },
    // Icon & color style in different selector level
    // https://github.com/ant-design/ant-design/issues/16503
    // https://github.com/ant-design/ant-design/issues/15512
    [`${noticeCls}-icon`]: {
      position: "absolute",
      fontSize: notificationIconSize,
      lineHeight: 1,
      // icon-font
      [`&-success${iconCls}`]: {
        color: colorSuccess
      },
      [`&-info${iconCls}`]: {
        color: colorInfo
      },
      [`&-warning${iconCls}`]: {
        color: colorWarning
      },
      [`&-error${iconCls}`]: {
        color: colorError
      }
    },
    [`${noticeCls}-close`]: Object.assign({
      position: "absolute",
      top: token.notificationPaddingVertical,
      insetInlineEnd: token.notificationPaddingHorizontal,
      color: token.colorIcon,
      outline: "none",
      width: token.notificationCloseButtonSize,
      height: token.notificationCloseButtonSize,
      borderRadius: token.borderRadiusSM,
      transition: `background-color ${token.motionDurationMid}, color ${token.motionDurationMid}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      "&:hover": {
        color: token.colorIconHover,
        backgroundColor: token.colorBgTextHover
      },
      "&:active": {
        backgroundColor: token.colorBgTextActive
      }
    }, genFocusStyle(token)),
    [`${noticeCls}-progress`]: {
      position: "absolute",
      display: "block",
      appearance: "none",
      inlineSize: `calc(100% - ${unit(borderRadiusLG)} * 2)`,
      left: {
        _skip_check_: true,
        value: borderRadiusLG
      },
      right: {
        _skip_check_: true,
        value: borderRadiusLG
      },
      bottom: 0,
      blockSize: notificationProgressHeight,
      border: 0,
      "&, &::-webkit-progress-bar": {
        borderRadius: borderRadiusLG,
        backgroundColor: `rgba(0, 0, 0, 0.04)`
      },
      "&::-moz-progress-bar": {
        background: notificationProgressBg
      },
      "&::-webkit-progress-value": {
        borderRadius: borderRadiusLG,
        background: notificationProgressBg
      }
    },
    [`${noticeCls}-actions`]: {
      float: "right",
      marginTop: token.marginSM
    }
  };
};
const genNotificationStyle = (token) => {
  const {
    componentCls,
    // .ant-notification
    notificationMarginBottom,
    notificationMarginEdge,
    motionDurationMid,
    motionEaseInOut
  } = token;
  const noticeCls = `${componentCls}-notice`;
  const fadeOut = new Keyframe("antNotificationFadeOut", {
    "0%": {
      maxHeight: token.animationMaxHeight,
      marginBottom: notificationMarginBottom
    },
    "100%": {
      maxHeight: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0
    }
  });
  return [
    // ============================ Holder ============================
    {
      [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
        position: "fixed",
        zIndex: token.zIndexPopup,
        marginRight: {
          value: notificationMarginEdge,
          _skip_check_: true
        },
        [`${componentCls}-hook-holder`]: {
          position: "relative"
        },
        //  animation
        [`${componentCls}-fade-appear-prepare`]: {
          opacity: "0 !important"
        },
        [`${componentCls}-fade-enter, ${componentCls}-fade-appear`]: {
          animationDuration: token.motionDurationMid,
          animationTimingFunction: motionEaseInOut,
          animationFillMode: "both",
          opacity: 0,
          animationPlayState: "paused"
        },
        [`${componentCls}-fade-leave`]: {
          animationTimingFunction: motionEaseInOut,
          animationFillMode: "both",
          animationDuration: motionDurationMid,
          animationPlayState: "paused"
        },
        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
          animationPlayState: "running"
        },
        [`${componentCls}-fade-leave${componentCls}-fade-leave-active`]: {
          animationName: fadeOut,
          animationPlayState: "running"
        },
        // RTL
        "&-rtl": {
          direction: "rtl",
          [`${noticeCls}-actions`]: {
            float: "left"
          }
        }
      })
    },
    // ============================ Notice ============================
    {
      [componentCls]: {
        [`${noticeCls}-wrapper`]: Object.assign({}, genNoticeStyle(token))
      }
    }
  ];
};
const prepareComponentToken$2 = (token) => ({
  zIndexPopup: token.zIndexPopupBase + CONTAINER_MAX_OFFSET + 50,
  width: 384
});
const prepareNotificationToken = (token) => {
  const notificationPaddingVertical = token.paddingMD;
  const notificationPaddingHorizontal = token.paddingLG;
  const notificationToken = merge(token, {
    notificationBg: token.colorBgElevated,
    notificationPaddingVertical,
    notificationPaddingHorizontal,
    notificationIconSize: token.calc(token.fontSizeLG).mul(token.lineHeightLG).equal(),
    notificationCloseButtonSize: token.calc(token.controlHeightLG).mul(0.55).equal(),
    notificationMarginBottom: token.margin,
    notificationPadding: `${unit(token.paddingMD)} ${unit(token.paddingContentHorizontalLG)}`,
    notificationMarginEdge: token.marginLG,
    animationMaxHeight: 150,
    notificationStackLayer: 3,
    notificationProgressHeight: 2,
    notificationProgressBg: `linear-gradient(90deg, ${token.colorPrimaryBorderHover}, ${token.colorPrimary})`
  });
  return notificationToken;
};
const useStyle$3 = genStyleHooks("Notification", (token) => {
  const notificationToken = prepareNotificationToken(token);
  return [genNotificationStyle(notificationToken), genNotificationPlacementStyle(notificationToken), genStackStyle(notificationToken)];
}, prepareComponentToken$2);
function getCloseIcon(prefixCls, closeIcon) {
  if (closeIcon === null || closeIcon === false) {
    return null;
  }
  return closeIcon || /* @__PURE__ */ reactExports.createElement(RefIcon$7, {
    className: `${prefixCls}-close-icon`
  });
}
const typeToIcon = {
  success: RefIcon$b,
  info: RefIcon$a,
  error: RefIcon$9,
  warning: RefIcon$8
};
const PureContent = (props) => {
  const {
    prefixCls,
    icon,
    type,
    message,
    description,
    actions,
    role = "alert"
  } = props;
  let iconNode = null;
  if (icon) {
    iconNode = /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-icon`
    }, icon);
  } else if (type) {
    iconNode = /* @__PURE__ */ reactExports.createElement(typeToIcon[type] || null, {
      className: classNames(`${prefixCls}-icon`, `${prefixCls}-icon-${type}`)
    });
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames({
      [`${prefixCls}-with-icon`]: iconNode
    }),
    role
  }, iconNode, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-message`
  }, message), description && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-description`
  }, description), actions && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-actions`
  }, actions));
};
function getPlacementStyle(placement, top, bottom) {
  let style;
  switch (placement) {
    case "top":
      style = {
        left: "50%",
        transform: "translateX(-50%)",
        right: "auto",
        top,
        bottom: "auto"
      };
      break;
    case "topLeft":
      style = {
        left: 0,
        top,
        bottom: "auto"
      };
      break;
    case "topRight":
      style = {
        right: 0,
        top,
        bottom: "auto"
      };
      break;
    case "bottom":
      style = {
        left: "50%",
        transform: "translateX(-50%)",
        right: "auto",
        top: "auto",
        bottom
      };
      break;
    case "bottomLeft":
      style = {
        left: 0,
        top: "auto",
        bottom
      };
      break;
    default:
      style = {
        right: 0,
        top: "auto",
        bottom
      };
      break;
  }
  return style;
}
function getMotion(prefixCls) {
  return {
    motionName: `${prefixCls}-fade`
  };
}
function getCloseIconConfig(closeIcon, notificationConfig, notification) {
  if (typeof closeIcon !== "undefined") {
    return closeIcon;
  }
  if (typeof (notificationConfig === null || notificationConfig === void 0 ? void 0 : notificationConfig.closeIcon) !== "undefined") {
    return notificationConfig.closeIcon;
  }
  return notification === null || notification === void 0 ? void 0 : notification.closeIcon;
}
var __rest$5 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;
const DEFAULT_PLACEMENT = "topRight";
const Wrapper = ({
  children,
  prefixCls
}) => {
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$3(prefixCls, rootCls);
  return wrapCSSVar(/* @__PURE__ */ React.createElement(NotificationProvider, {
    classNames: {
      list: classNames(hashId, cssVarCls, rootCls)
    }
  }, children));
};
const renderNotifications = (node, {
  prefixCls,
  key
}) => /* @__PURE__ */ React.createElement(Wrapper, {
  prefixCls,
  key
}, node);
const Holder = /* @__PURE__ */ React.forwardRef((props, ref) => {
  const {
    top,
    bottom,
    prefixCls: staticPrefixCls,
    getContainer: staticGetContainer,
    maxCount,
    rtl,
    onAllRemoved,
    stack,
    duration,
    pauseOnHover = true,
    showProgress
  } = props;
  const {
    getPrefixCls,
    getPopupContainer,
    notification,
    direction
  } = reactExports.useContext(ConfigContext);
  const [, token] = useToken();
  const prefixCls = staticPrefixCls || getPrefixCls("notification");
  const getStyle = (placement) => getPlacementStyle(placement, top !== null && top !== void 0 ? top : DEFAULT_OFFSET, bottom !== null && bottom !== void 0 ? bottom : DEFAULT_OFFSET);
  const getClassName = () => classNames({
    [`${prefixCls}-rtl`]: rtl !== null && rtl !== void 0 ? rtl : direction === "rtl"
  });
  const getNotificationMotion = () => getMotion(prefixCls);
  const [api, holder] = useNotification$1({
    prefixCls,
    style: getStyle,
    className: getClassName,
    motion: getNotificationMotion,
    closable: true,
    closeIcon: getCloseIcon(prefixCls),
    duration: duration !== null && duration !== void 0 ? duration : DEFAULT_DURATION,
    getContainer: () => (staticGetContainer === null || staticGetContainer === void 0 ? void 0 : staticGetContainer()) || (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer()) || document.body,
    maxCount,
    pauseOnHover,
    showProgress,
    onAllRemoved,
    renderNotifications,
    stack: stack === false ? false : {
      threshold: typeof stack === "object" ? stack === null || stack === void 0 ? void 0 : stack.threshold : void 0,
      offset: 8,
      gap: token.margin
    }
  });
  React.useImperativeHandle(ref, () => Object.assign(Object.assign({}, api), {
    prefixCls,
    notification
  }));
  return holder;
});
function useInternalNotification(notificationConfig) {
  const holderRef = React.useRef(null);
  devUseWarning();
  const wrapAPI = React.useMemo(() => {
    const open = (config) => {
      var _a;
      if (!holderRef.current) {
        return;
      }
      const {
        open: originOpen,
        prefixCls,
        notification
      } = holderRef.current;
      const noticePrefixCls = `${prefixCls}-notice`;
      const {
        message,
        description,
        icon,
        type,
        btn,
        actions,
        className,
        style,
        role = "alert",
        closeIcon,
        closable
      } = config, restConfig = __rest$5(config, ["message", "description", "icon", "type", "btn", "actions", "className", "style", "role", "closeIcon", "closable"]);
      const mergedActions = actions !== null && actions !== void 0 ? actions : btn;
      const realCloseIcon = getCloseIcon(noticePrefixCls, getCloseIconConfig(closeIcon, notificationConfig, notification));
      return originOpen(Object.assign(Object.assign({
        // use placement from props instead of hard-coding "topRight"
        placement: (_a = notificationConfig === null || notificationConfig === void 0 ? void 0 : notificationConfig.placement) !== null && _a !== void 0 ? _a : DEFAULT_PLACEMENT
      }, restConfig), {
        content: /* @__PURE__ */ React.createElement(PureContent, {
          prefixCls: noticePrefixCls,
          icon,
          type,
          message,
          description,
          actions: mergedActions,
          role
        }),
        className: classNames(type && `${noticePrefixCls}-${type}`, className, notification === null || notification === void 0 ? void 0 : notification.className),
        style: Object.assign(Object.assign({}, notification === null || notification === void 0 ? void 0 : notification.style), style),
        closeIcon: realCloseIcon,
        closable: closable !== null && closable !== void 0 ? closable : !!realCloseIcon
      }));
    };
    const destroy = (key) => {
      var _a, _b;
      if (key !== void 0) {
        (_a = holderRef.current) === null || _a === void 0 ? void 0 : _a.close(key);
      } else {
        (_b = holderRef.current) === null || _b === void 0 ? void 0 : _b.destroy();
      }
    };
    const clone = {
      open,
      destroy
    };
    const keys = ["success", "info", "warning", "error"];
    keys.forEach((type) => {
      clone[type] = (config) => open(Object.assign(Object.assign({}, config), {
        type
      }));
    });
    return clone;
  }, []);
  return [wrapAPI, /* @__PURE__ */ React.createElement(Holder, Object.assign({
    key: "notification-holder"
  }, notificationConfig, {
    ref: holderRef
  }))];
}
function useNotification(notificationConfig) {
  return useInternalNotification(notificationConfig);
}
const genBaseStyle = (token) => {
  const {
    componentCls,
    colorText,
    fontSize,
    lineHeight,
    fontFamily
  } = token;
  return {
    [componentCls]: {
      color: colorText,
      fontSize,
      lineHeight,
      fontFamily,
      [`&${componentCls}-rtl`]: {
        direction: "rtl"
      }
    }
  };
};
const prepareComponentToken$1 = () => ({});
const useStyle$2 = genStyleHooks("App", genBaseStyle, prepareComponentToken$1);
const App$1 = (props) => {
  const {
    prefixCls: customizePrefixCls,
    children,
    className,
    rootClassName,
    message,
    notification,
    style,
    component = "div"
  } = props;
  const {
    direction,
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("app", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$2(prefixCls);
  const customClassName = classNames(hashId, prefixCls, className, rootClassName, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === "rtl"
  });
  const appConfig = reactExports.useContext(AppConfigContext);
  const mergedAppConfig = React.useMemo(() => ({
    message: Object.assign(Object.assign({}, appConfig.message), message),
    notification: Object.assign(Object.assign({}, appConfig.notification), notification)
  }), [message, notification, appConfig.message, appConfig.notification]);
  const [messageApi, messageContextHolder] = useMessage(mergedAppConfig.message);
  const [notificationApi, notificationContextHolder] = useNotification(mergedAppConfig.notification);
  const [ModalApi, ModalContextHolder] = useModal();
  const memoizedContextValue = React.useMemo(() => ({
    message: messageApi,
    notification: notificationApi,
    modal: ModalApi
  }), [messageApi, notificationApi, ModalApi]);
  devUseWarning()(!(cssVarCls && component === false), "usage", "When using cssVar, ensure `component` is assigned a valid React component string.");
  const Component = component === false ? React.Fragment : component;
  const rootProps = {
    className: customClassName,
    style
  };
  return wrapCSSVar(/* @__PURE__ */ React.createElement(AppContext.Provider, {
    value: memoizedContextValue
  }, /* @__PURE__ */ React.createElement(AppConfigContext.Provider, {
    value: mergedAppConfig
  }, /* @__PURE__ */ React.createElement(Component, Object.assign({}, component === false ? void 0 : rootProps), ModalContextHolder, messageContextHolder, notificationContextHolder, children))));
};
const useApp = () => React.useContext(AppContext);
const App = App$1;
App.useApp = useApp;
var calcThumbStyle = function calcThumbStyle2(targetElement, vertical) {
  if (!targetElement) return null;
  var style = {
    left: targetElement.offsetLeft,
    right: targetElement.parentElement.clientWidth - targetElement.clientWidth - targetElement.offsetLeft,
    width: targetElement.clientWidth,
    top: targetElement.offsetTop,
    bottom: targetElement.parentElement.clientHeight - targetElement.clientHeight - targetElement.offsetTop,
    height: targetElement.clientHeight
  };
  if (vertical) {
    return {
      left: 0,
      right: 0,
      width: 0,
      top: style.top,
      bottom: style.bottom,
      height: style.height
    };
  }
  return {
    left: style.left,
    right: style.right,
    width: style.width,
    top: 0,
    bottom: 0,
    height: 0
  };
};
var toPX = function toPX2(value) {
  return value !== void 0 ? "".concat(value, "px") : void 0;
};
function MotionThumb(props) {
  var prefixCls = props.prefixCls, containerRef = props.containerRef, value = props.value, getValueIndex = props.getValueIndex, motionName = props.motionName, onMotionStart = props.onMotionStart, onMotionEnd = props.onMotionEnd, direction = props.direction, _props$vertical = props.vertical, vertical = _props$vertical === void 0 ? false : _props$vertical;
  var thumbRef = reactExports.useRef(null);
  var _React$useState = reactExports.useState(value), _React$useState2 = _slicedToArray(_React$useState, 2), prevValue = _React$useState2[0], setPrevValue = _React$useState2[1];
  var findValueElement = function findValueElement2(val) {
    var _containerRef$current;
    var index = getValueIndex(val);
    var ele = (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.querySelectorAll(".".concat(prefixCls, "-item"))[index];
    return (ele === null || ele === void 0 ? void 0 : ele.offsetParent) && ele;
  };
  var _React$useState3 = reactExports.useState(null), _React$useState4 = _slicedToArray(_React$useState3, 2), prevStyle = _React$useState4[0], setPrevStyle = _React$useState4[1];
  var _React$useState5 = reactExports.useState(null), _React$useState6 = _slicedToArray(_React$useState5, 2), nextStyle = _React$useState6[0], setNextStyle = _React$useState6[1];
  useLayoutEffect(function() {
    if (prevValue !== value) {
      var prev = findValueElement(prevValue);
      var next = findValueElement(value);
      var calcPrevStyle = calcThumbStyle(prev, vertical);
      var calcNextStyle = calcThumbStyle(next, vertical);
      setPrevValue(value);
      setPrevStyle(calcPrevStyle);
      setNextStyle(calcNextStyle);
      if (prev && next) {
        onMotionStart();
      } else {
        onMotionEnd();
      }
    }
  }, [value]);
  var thumbStart = reactExports.useMemo(function() {
    if (vertical) {
      var _prevStyle$top;
      return toPX((_prevStyle$top = prevStyle === null || prevStyle === void 0 ? void 0 : prevStyle.top) !== null && _prevStyle$top !== void 0 ? _prevStyle$top : 0);
    }
    if (direction === "rtl") {
      return toPX(-(prevStyle === null || prevStyle === void 0 ? void 0 : prevStyle.right));
    }
    return toPX(prevStyle === null || prevStyle === void 0 ? void 0 : prevStyle.left);
  }, [vertical, direction, prevStyle]);
  var thumbActive = reactExports.useMemo(function() {
    if (vertical) {
      var _nextStyle$top;
      return toPX((_nextStyle$top = nextStyle === null || nextStyle === void 0 ? void 0 : nextStyle.top) !== null && _nextStyle$top !== void 0 ? _nextStyle$top : 0);
    }
    if (direction === "rtl") {
      return toPX(-(nextStyle === null || nextStyle === void 0 ? void 0 : nextStyle.right));
    }
    return toPX(nextStyle === null || nextStyle === void 0 ? void 0 : nextStyle.left);
  }, [vertical, direction, nextStyle]);
  var onAppearStart = function onAppearStart2() {
    if (vertical) {
      return {
        transform: "translateY(var(--thumb-start-top))",
        height: "var(--thumb-start-height)"
      };
    }
    return {
      transform: "translateX(var(--thumb-start-left))",
      width: "var(--thumb-start-width)"
    };
  };
  var onAppearActive = function onAppearActive2() {
    if (vertical) {
      return {
        transform: "translateY(var(--thumb-active-top))",
        height: "var(--thumb-active-height)"
      };
    }
    return {
      transform: "translateX(var(--thumb-active-left))",
      width: "var(--thumb-active-width)"
    };
  };
  var onVisibleChanged = function onVisibleChanged2() {
    setPrevStyle(null);
    setNextStyle(null);
    onMotionEnd();
  };
  if (!prevStyle || !nextStyle) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(CSSMotion, {
    visible: true,
    motionName,
    motionAppear: true,
    onAppearStart,
    onAppearActive,
    onVisibleChanged
  }, function(_ref, ref) {
    var motionClassName = _ref.className, motionStyle = _ref.style;
    var mergedStyle = _objectSpread2(_objectSpread2({}, motionStyle), {}, {
      "--thumb-start-left": thumbStart,
      "--thumb-start-width": toPX(prevStyle === null || prevStyle === void 0 ? void 0 : prevStyle.width),
      "--thumb-active-left": thumbActive,
      "--thumb-active-width": toPX(nextStyle === null || nextStyle === void 0 ? void 0 : nextStyle.width),
      "--thumb-start-top": thumbStart,
      "--thumb-start-height": toPX(prevStyle === null || prevStyle === void 0 ? void 0 : prevStyle.height),
      "--thumb-active-top": thumbActive,
      "--thumb-active-height": toPX(nextStyle === null || nextStyle === void 0 ? void 0 : nextStyle.height)
    });
    var motionProps = {
      ref: composeRef(thumbRef, ref),
      style: mergedStyle,
      className: classNames("".concat(prefixCls, "-thumb"), motionClassName)
    };
    return /* @__PURE__ */ reactExports.createElement("div", motionProps);
  });
}
var _excluded = ["prefixCls", "direction", "vertical", "options", "disabled", "defaultValue", "value", "name", "onChange", "className", "motionName"];
function getValidTitle(option) {
  if (typeof option.title !== "undefined") {
    return option.title;
  }
  if (_typeof(option.label) !== "object") {
    var _option$label;
    return (_option$label = option.label) === null || _option$label === void 0 ? void 0 : _option$label.toString();
  }
}
function normalizeOptions(options) {
  return options.map(function(option) {
    if (_typeof(option) === "object" && option !== null) {
      var validTitle = getValidTitle(option);
      return _objectSpread2(_objectSpread2({}, option), {}, {
        title: validTitle
      });
    }
    return {
      label: option === null || option === void 0 ? void 0 : option.toString(),
      title: option === null || option === void 0 ? void 0 : option.toString(),
      value: option
    };
  });
}
var InternalSegmentedOption = function InternalSegmentedOption2(_ref) {
  var prefixCls = _ref.prefixCls, className = _ref.className, disabled = _ref.disabled, checked = _ref.checked, label = _ref.label, title = _ref.title, value = _ref.value, name = _ref.name, onChange = _ref.onChange, onFocus = _ref.onFocus, onBlur = _ref.onBlur, onKeyDown = _ref.onKeyDown, onKeyUp = _ref.onKeyUp, onMouseDown = _ref.onMouseDown;
  var handleChange = function handleChange2(event) {
    if (disabled) {
      return;
    }
    onChange(event, value);
  };
  return /* @__PURE__ */ reactExports.createElement("label", {
    className: classNames(className, _defineProperty({}, "".concat(prefixCls, "-item-disabled"), disabled)),
    onMouseDown
  }, /* @__PURE__ */ reactExports.createElement("input", {
    name,
    className: "".concat(prefixCls, "-item-input"),
    type: "radio",
    disabled,
    checked,
    onChange: handleChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp
  }), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-item-label"),
    title,
    "aria-selected": checked
  }, label));
};
var Segmented$1 = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var _segmentedOptions$, _classNames2;
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-segmented" : _props$prefixCls, direction = props.direction, vertical = props.vertical, _props$options = props.options, options = _props$options === void 0 ? [] : _props$options, disabled = props.disabled, defaultValue = props.defaultValue, value = props.value, name = props.name, onChange = props.onChange, _props$className = props.className, className = _props$className === void 0 ? "" : _props$className, _props$motionName = props.motionName, motionName = _props$motionName === void 0 ? "thumb-motion" : _props$motionName, restProps = _objectWithoutProperties(props, _excluded);
  var containerRef = reactExports.useRef(null);
  var mergedRef = reactExports.useMemo(function() {
    return composeRef(containerRef, ref);
  }, [containerRef, ref]);
  var segmentedOptions = reactExports.useMemo(function() {
    return normalizeOptions(options);
  }, [options]);
  var _useMergedState = useMergedState((_segmentedOptions$ = segmentedOptions[0]) === null || _segmentedOptions$ === void 0 ? void 0 : _segmentedOptions$.value, {
    value,
    defaultValue
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), rawValue = _useMergedState2[0], setRawValue = _useMergedState2[1];
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), thumbShow = _React$useState2[0], setThumbShow = _React$useState2[1];
  var handleChange = function handleChange2(event, val) {
    setRawValue(val);
    onChange === null || onChange === void 0 || onChange(val);
  };
  var divProps = omit(restProps, ["children"]);
  var _React$useState3 = reactExports.useState(false), _React$useState4 = _slicedToArray(_React$useState3, 2), isKeyboard = _React$useState4[0], setIsKeyboard = _React$useState4[1];
  var _React$useState5 = reactExports.useState(false), _React$useState6 = _slicedToArray(_React$useState5, 2), isFocused = _React$useState6[0], setIsFocused = _React$useState6[1];
  var handleFocus = function handleFocus2() {
    setIsFocused(true);
  };
  var handleBlur = function handleBlur2() {
    setIsFocused(false);
  };
  var handleMouseDown = function handleMouseDown2() {
    setIsKeyboard(false);
  };
  var handleKeyUp = function handleKeyUp2(event) {
    if (event.key === "Tab") {
      setIsKeyboard(true);
    }
  };
  var onOffset = function onOffset2(offset) {
    var currentIndex = segmentedOptions.findIndex(function(option) {
      return option.value === rawValue;
    });
    var total = segmentedOptions.length;
    var nextIndex = (currentIndex + offset + total) % total;
    var nextOption = segmentedOptions[nextIndex];
    if (nextOption) {
      setRawValue(nextOption.value);
      onChange === null || onChange === void 0 || onChange(nextOption.value);
    }
  };
  var handleKeyDown = function handleKeyDown2(event) {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        onOffset(-1);
        break;
      case "ArrowRight":
      case "ArrowDown":
        onOffset(1);
        break;
    }
  };
  return /* @__PURE__ */ reactExports.createElement("div", _extends$7({
    role: "radiogroup",
    "aria-label": "segmented control",
    tabIndex: disabled ? void 0 : 0
  }, divProps, {
    className: classNames(prefixCls, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-rtl"), direction === "rtl"), _defineProperty(_classNames2, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames2, "".concat(prefixCls, "-vertical"), vertical), _classNames2), className),
    ref: mergedRef
  }), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-group")
  }, /* @__PURE__ */ reactExports.createElement(MotionThumb, {
    vertical,
    prefixCls,
    value: rawValue,
    containerRef,
    motionName: "".concat(prefixCls, "-").concat(motionName),
    direction,
    getValueIndex: function getValueIndex(val) {
      return segmentedOptions.findIndex(function(n) {
        return n.value === val;
      });
    },
    onMotionStart: function onMotionStart() {
      setThumbShow(true);
    },
    onMotionEnd: function onMotionEnd() {
      setThumbShow(false);
    }
  }), segmentedOptions.map(function(segmentedOption) {
    var _classNames3;
    return /* @__PURE__ */ reactExports.createElement(InternalSegmentedOption, _extends$7({}, segmentedOption, {
      name,
      key: segmentedOption.value,
      prefixCls,
      className: classNames(segmentedOption.className, "".concat(prefixCls, "-item"), (_classNames3 = {}, _defineProperty(_classNames3, "".concat(prefixCls, "-item-selected"), segmentedOption.value === rawValue && !thumbShow), _defineProperty(_classNames3, "".concat(prefixCls, "-item-focused"), isFocused && isKeyboard && segmentedOption.value === rawValue), _classNames3)),
      checked: segmentedOption.value === rawValue,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onMouseDown: handleMouseDown,
      disabled: !!disabled || !!segmentedOption.disabled
    }));
  })));
});
var TypedSegmented = Segmented$1;
function getItemDisabledStyle(cls, token) {
  return {
    [`${cls}, ${cls}:hover, ${cls}:focus`]: {
      color: token.colorTextDisabled,
      cursor: "not-allowed"
    }
  };
}
function getItemSelectedStyle(token) {
  return {
    backgroundColor: token.itemSelectedBg,
    boxShadow: token.boxShadowTertiary
  };
}
const segmentedTextEllipsisCss = Object.assign({
  overflow: "hidden"
}, textEllipsis);
const genSegmentedStyle = (token) => {
  const {
    componentCls
  } = token;
  const labelHeight = token.calc(token.controlHeight).sub(token.calc(token.trackPadding).mul(2)).equal();
  const labelHeightLG = token.calc(token.controlHeightLG).sub(token.calc(token.trackPadding).mul(2)).equal();
  const labelHeightSM = token.calc(token.controlHeightSM).sub(token.calc(token.trackPadding).mul(2)).equal();
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      display: "inline-block",
      padding: token.trackPadding,
      color: token.itemColor,
      background: token.trackBg,
      borderRadius: token.borderRadius,
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`
    }), genFocusStyle(token)), {
      [`${componentCls}-group`]: {
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        justifyItems: "flex-start",
        flexDirection: "row",
        width: "100%"
      },
      // RTL styles
      [`&${componentCls}-rtl`]: {
        direction: "rtl"
      },
      [`&${componentCls}-vertical`]: {
        [`${componentCls}-group`]: {
          flexDirection: "column"
        },
        [`${componentCls}-thumb`]: {
          width: "100%",
          height: 0,
          padding: `0 ${unit(token.paddingXXS)}`
        }
      },
      // block styles
      [`&${componentCls}-block`]: {
        display: "flex"
      },
      [`&${componentCls}-block ${componentCls}-item`]: {
        flex: 1,
        minWidth: 0
      },
      // item styles
      [`${componentCls}-item`]: {
        position: "relative",
        textAlign: "center",
        cursor: "pointer",
        transition: `color ${token.motionDurationMid} ${token.motionEaseInOut}`,
        borderRadius: token.borderRadiusSM,
        // Fix Safari render bug
        // https://github.com/ant-design/ant-design/issues/45250
        transform: "translateZ(0)",
        "&-selected": Object.assign(Object.assign({}, getItemSelectedStyle(token)), {
          color: token.itemSelectedColor
        }),
        "&-focused": genFocusOutline(token),
        "&::after": {
          content: '""',
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: "100%",
          top: 0,
          insetInlineStart: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: `opacity ${token.motionDurationMid}`,
          // This is mandatory to make it not clickable or hoverable
          // Ref: https://github.com/ant-design/ant-design/issues/40888
          pointerEvents: "none"
        },
        [`&:hover:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.itemHoverColor,
          "&::after": {
            opacity: 1,
            backgroundColor: token.itemHoverBg
          }
        },
        [`&:active:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)`]: {
          color: token.itemHoverColor,
          "&::after": {
            opacity: 1,
            backgroundColor: token.itemActiveBg
          }
        },
        "&-label": Object.assign({
          minHeight: labelHeight,
          lineHeight: unit(labelHeight),
          padding: `0 ${unit(token.segmentedPaddingHorizontal)}`
        }, segmentedTextEllipsisCss),
        // syntactic sugar to add `icon` for Segmented Item
        "&-icon + *": {
          marginInlineStart: token.calc(token.marginSM).div(2).equal()
        },
        "&-input": {
          position: "absolute",
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none"
        }
      },
      // thumb styles
      [`${componentCls}-thumb`]: Object.assign(Object.assign({}, getItemSelectedStyle(token)), {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: 0,
        height: "100%",
        padding: `${unit(token.paddingXXS)} 0`,
        borderRadius: token.borderRadiusSM,
        transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOut}, height ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        [`& ~ ${componentCls}-item:not(${componentCls}-item-selected):not(${componentCls}-item-disabled)::after`]: {
          backgroundColor: "transparent"
        }
      }),
      // size styles
      [`&${componentCls}-lg`]: {
        borderRadius: token.borderRadiusLG,
        [`${componentCls}-item-label`]: {
          minHeight: labelHeightLG,
          lineHeight: unit(labelHeightLG),
          padding: `0 ${unit(token.segmentedPaddingHorizontal)}`,
          fontSize: token.fontSizeLG
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadius
        }
      },
      [`&${componentCls}-sm`]: {
        borderRadius: token.borderRadiusSM,
        [`${componentCls}-item-label`]: {
          minHeight: labelHeightSM,
          lineHeight: unit(labelHeightSM),
          padding: `0 ${unit(token.segmentedPaddingHorizontalSM)}`
        },
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: token.borderRadiusXS
        }
      }
    }), getItemDisabledStyle(`&-disabled ${componentCls}-item`, token)), getItemDisabledStyle(`${componentCls}-item-disabled`, token)), {
      // transition effect when `appear-active`
      [`${componentCls}-thumb-motion-appear-active`]: {
        transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOut}, width ${token.motionDurationSlow} ${token.motionEaseInOut}`,
        willChange: "transform, width"
      },
      [`&${componentCls}-shape-round`]: {
        borderRadius: 9999,
        [`${componentCls}-item, ${componentCls}-thumb`]: {
          borderRadius: 9999
        }
      }
    })
  };
};
const prepareComponentToken = (token) => {
  const {
    colorTextLabel,
    colorText,
    colorFillSecondary,
    colorBgElevated,
    colorFill,
    lineWidthBold,
    colorBgLayout
  } = token;
  return {
    trackPadding: lineWidthBold,
    trackBg: colorBgLayout,
    itemColor: colorTextLabel,
    itemHoverColor: colorText,
    itemHoverBg: colorFillSecondary,
    itemSelectedBg: colorBgElevated,
    itemActiveBg: colorFill,
    itemSelectedColor: colorText
  };
};
const useStyle$1 = genStyleHooks("Segmented", (token) => {
  const {
    lineWidth,
    calc
  } = token;
  const segmentedToken = merge(token, {
    segmentedPaddingHorizontal: calc(token.controlPaddingHorizontal).sub(lineWidth).equal(),
    segmentedPaddingHorizontalSM: calc(token.controlPaddingHorizontalSM).sub(lineWidth).equal()
  });
  return genSegmentedStyle(segmentedToken);
}, prepareComponentToken);
var __rest$4 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function isSegmentedLabeledOptionWithIcon(option) {
  return typeof option === "object" && !!(option === null || option === void 0 ? void 0 : option.icon);
}
const InternalSegmented = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const defaultName = useId();
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    block,
    options = [],
    size: customSize = "middle",
    style,
    vertical,
    shape = "default",
    name = defaultName
  } = props, restProps = __rest$4(props, ["prefixCls", "className", "rootClassName", "block", "options", "size", "style", "vertical", "shape", "name"]);
  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle
  } = useComponentConfig("segmented");
  const prefixCls = getPrefixCls("segmented", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$1(prefixCls);
  const mergedSize = useSize(customSize);
  const extendedOptions = reactExports.useMemo(() => options.map((option) => {
    if (isSegmentedLabeledOptionWithIcon(option)) {
      const {
        icon,
        label
      } = option, restOption = __rest$4(option, ["icon", "label"]);
      return Object.assign(Object.assign({}, restOption), {
        label: /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("span", {
          className: `${prefixCls}-item-icon`
        }, icon), label && /* @__PURE__ */ reactExports.createElement("span", null, label))
      });
    }
    return option;
  }), [options, prefixCls]);
  const cls = classNames(className, rootClassName, contextClassName, {
    [`${prefixCls}-block`]: block,
    [`${prefixCls}-sm`]: mergedSize === "small",
    [`${prefixCls}-lg`]: mergedSize === "large",
    [`${prefixCls}-vertical`]: vertical,
    [`${prefixCls}-shape-${shape}`]: shape === "round"
  }, hashId, cssVarCls);
  const mergedStyle = Object.assign(Object.assign({}, contextStyle), style);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(TypedSegmented, Object.assign({}, restProps, {
    name,
    className: cls,
    style: mergedStyle,
    options: extendedOptions,
    ref,
    prefixCls,
    direction,
    vertical
  })));
});
const Segmented = InternalSegmented;
const PanelPickerContext = /* @__PURE__ */ React.createContext({});
const PanelPresetsContext = /* @__PURE__ */ React.createContext({});
const ColorClear = ({
  prefixCls,
  value,
  onChange
}) => {
  const handleClick = () => {
    if (onChange && value && !value.cleared) {
      const hsba = value.toHsb();
      hsba.a = 0;
      const genColor = generateColor$1(hsba);
      genColor.cleared = true;
      onChange(genColor);
    }
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: `${prefixCls}-clear`,
    onClick: handleClick
  });
};
const FORMAT_HEX = "hex";
const FORMAT_RGB = "rgb";
const FORMAT_HSB = "hsb";
const ColorSteppers = ({
  prefixCls,
  min = 0,
  max = 100,
  value,
  onChange,
  className,
  formatter
}) => {
  const colorSteppersPrefixCls = `${prefixCls}-steppers`;
  const [internalValue, setInternalValue] = reactExports.useState(0);
  const stepValue = !Number.isNaN(value) ? value : internalValue;
  return /* @__PURE__ */ React.createElement(TypedInputNumber, {
    className: classNames(colorSteppersPrefixCls, className),
    min,
    max,
    value: stepValue,
    formatter,
    size: "small",
    onChange: (step) => {
      setInternalValue(step || 0);
      onChange === null || onChange === void 0 ? void 0 : onChange(step);
    }
  });
};
const ColorAlphaInput = ({
  prefixCls,
  value,
  onChange
}) => {
  const colorAlphaInputPrefixCls = `${prefixCls}-alpha-input`;
  const [internalValue, setInternalValue] = reactExports.useState(() => generateColor$1(value || "#000"));
  const alphaValue = value || internalValue;
  const handleAlphaChange = (step) => {
    const hsba = alphaValue.toHsb();
    hsba.a = (step || 0) / 100;
    const genColor = generateColor$1(hsba);
    setInternalValue(genColor);
    onChange === null || onChange === void 0 ? void 0 : onChange(genColor);
  };
  return /* @__PURE__ */ React.createElement(ColorSteppers, {
    value: getColorAlpha(alphaValue),
    prefixCls,
    formatter: (step) => `${step}%`,
    className: colorAlphaInputPrefixCls,
    onChange: handleAlphaChange
  });
};
const hexReg = /(^#[\da-f]{6}$)|(^#[\da-f]{8}$)/i;
const isHexString = (hex) => hexReg.test(`#${hex}`);
const ColorHexInput = ({
  prefixCls,
  value,
  onChange
}) => {
  const colorHexInputPrefixCls = `${prefixCls}-hex-input`;
  const [hexValue, setHexValue] = reactExports.useState(() => value ? toHexFormat(value.toHexString()) : void 0);
  reactExports.useEffect(() => {
    if (value) {
      setHexValue(toHexFormat(value.toHexString()));
    }
  }, [value]);
  const handleHexChange = (e) => {
    const originValue = e.target.value;
    setHexValue(toHexFormat(originValue));
    if (isHexString(toHexFormat(originValue, true))) {
      onChange === null || onChange === void 0 ? void 0 : onChange(generateColor$1(originValue));
    }
  };
  return /* @__PURE__ */ React.createElement(Input, {
    className: colorHexInputPrefixCls,
    value: hexValue,
    prefix: "#",
    onChange: handleHexChange,
    size: "small"
  });
};
const ColorHsbInput = ({
  prefixCls,
  value,
  onChange
}) => {
  const colorHsbInputPrefixCls = `${prefixCls}-hsb-input`;
  const [internalValue, setInternalValue] = reactExports.useState(() => generateColor$1(value || "#000"));
  const hsbValue = value || internalValue;
  const handleHsbChange = (step, type) => {
    const hsb = hsbValue.toHsb();
    hsb[type] = type === "h" ? step : (step || 0) / 100;
    const genColor = generateColor$1(hsb);
    setInternalValue(genColor);
    onChange === null || onChange === void 0 ? void 0 : onChange(genColor);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: colorHsbInputPrefixCls
  }, /* @__PURE__ */ React.createElement(ColorSteppers, {
    max: 360,
    min: 0,
    value: Number(hsbValue.toHsb().h),
    prefixCls,
    className: colorHsbInputPrefixCls,
    formatter: (step) => getRoundNumber(step || 0).toString(),
    onChange: (step) => handleHsbChange(Number(step), "h")
  }), /* @__PURE__ */ React.createElement(ColorSteppers, {
    max: 100,
    min: 0,
    value: Number(hsbValue.toHsb().s) * 100,
    prefixCls,
    className: colorHsbInputPrefixCls,
    formatter: (step) => `${getRoundNumber(step || 0)}%`,
    onChange: (step) => handleHsbChange(Number(step), "s")
  }), /* @__PURE__ */ React.createElement(ColorSteppers, {
    max: 100,
    min: 0,
    value: Number(hsbValue.toHsb().b) * 100,
    prefixCls,
    className: colorHsbInputPrefixCls,
    formatter: (step) => `${getRoundNumber(step || 0)}%`,
    onChange: (step) => handleHsbChange(Number(step), "b")
  }));
};
const ColorRgbInput = ({
  prefixCls,
  value,
  onChange
}) => {
  const colorRgbInputPrefixCls = `${prefixCls}-rgb-input`;
  const [internalValue, setInternalValue] = reactExports.useState(() => generateColor$1(value || "#000"));
  const rgbValue = value || internalValue;
  const handleRgbChange = (step, type) => {
    const rgb = rgbValue.toRgb();
    rgb[type] = step || 0;
    const genColor = generateColor$1(rgb);
    setInternalValue(genColor);
    onChange === null || onChange === void 0 ? void 0 : onChange(genColor);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: colorRgbInputPrefixCls
  }, /* @__PURE__ */ React.createElement(ColorSteppers, {
    max: 255,
    min: 0,
    value: Number(rgbValue.toRgb().r),
    prefixCls,
    className: colorRgbInputPrefixCls,
    onChange: (step) => handleRgbChange(Number(step), "r")
  }), /* @__PURE__ */ React.createElement(ColorSteppers, {
    max: 255,
    min: 0,
    value: Number(rgbValue.toRgb().g),
    prefixCls,
    className: colorRgbInputPrefixCls,
    onChange: (step) => handleRgbChange(Number(step), "g")
  }), /* @__PURE__ */ React.createElement(ColorSteppers, {
    max: 255,
    min: 0,
    value: Number(rgbValue.toRgb().b),
    prefixCls,
    className: colorRgbInputPrefixCls,
    onChange: (step) => handleRgbChange(Number(step), "b")
  }));
};
const selectOptions = [FORMAT_HEX, FORMAT_HSB, FORMAT_RGB].map((format) => ({
  value: format,
  label: format.toUpperCase()
}));
const ColorInput = (props) => {
  const {
    prefixCls,
    format,
    value,
    disabledAlpha,
    onFormatChange,
    onChange,
    disabledFormat
  } = props;
  const [colorFormat, setColorFormat] = useMergedState(FORMAT_HEX, {
    value: format,
    onChange: onFormatChange
  });
  const colorInputPrefixCls = `${prefixCls}-input`;
  const handleFormatChange = (newFormat) => {
    setColorFormat(newFormat);
  };
  const steppersNode = reactExports.useMemo(() => {
    const inputProps = {
      value,
      prefixCls,
      onChange
    };
    switch (colorFormat) {
      case FORMAT_HSB:
        return /* @__PURE__ */ React.createElement(ColorHsbInput, Object.assign({}, inputProps));
      case FORMAT_RGB:
        return /* @__PURE__ */ React.createElement(ColorRgbInput, Object.assign({}, inputProps));
      default:
        return /* @__PURE__ */ React.createElement(ColorHexInput, Object.assign({}, inputProps));
    }
  }, [colorFormat, prefixCls, value, onChange]);
  return /* @__PURE__ */ React.createElement("div", {
    className: `${colorInputPrefixCls}-container`
  }, !disabledFormat && /* @__PURE__ */ React.createElement(Select, {
    value: colorFormat,
    variant: "borderless",
    getPopupContainer: (current) => current,
    popupMatchSelectWidth: 68,
    placement: "bottomRight",
    onChange: handleFormatChange,
    className: `${prefixCls}-format-select`,
    size: "small",
    options: selectOptions
  }), /* @__PURE__ */ React.createElement("div", {
    className: colorInputPrefixCls
  }, steppersNode), !disabledAlpha && /* @__PURE__ */ React.createElement(ColorAlphaInput, {
    prefixCls,
    value,
    onChange
  }));
};
var __rest$3 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const GradientColorSlider = (props) => {
  const {
    prefixCls,
    colors,
    type,
    color,
    range = false,
    className,
    activeIndex,
    onActive,
    onDragStart,
    onDragChange,
    onKeyDelete
  } = props, restProps = __rest$3(props, ["prefixCls", "colors", "type", "color", "range", "className", "activeIndex", "onActive", "onDragStart", "onDragChange", "onKeyDelete"]);
  const sliderProps = Object.assign(Object.assign({}, restProps), {
    track: false
  });
  const linearCss = reactExports.useMemo(() => {
    const colorsStr = colors.map((c) => `${c.color} ${c.percent}%`).join(", ");
    return `linear-gradient(90deg, ${colorsStr})`;
  }, [colors]);
  const pointColor = reactExports.useMemo(() => {
    if (!color || !type) {
      return null;
    }
    if (type === "alpha") {
      return color.toRgbString();
    }
    return `hsl(${color.toHsb().h}, 100%, 50%)`;
  }, [color, type]);
  const onInternalDragStart = useEvent(onDragStart);
  const onInternalDragChange = useEvent(onDragChange);
  const unstableContext = reactExports.useMemo(() => ({
    onDragStart: onInternalDragStart,
    onDragChange: onInternalDragChange
  }), []);
  const handleRender = useEvent((ori, info) => {
    const {
      onFocus,
      style,
      className: handleCls,
      onKeyDown
    } = ori.props;
    const mergedStyle = Object.assign({}, style);
    if (type === "gradient") {
      mergedStyle.background = getGradientPercentColor(colors, info.value);
    }
    return /* @__PURE__ */ reactExports.cloneElement(ori, {
      onFocus: (e) => {
        onActive === null || onActive === void 0 ? void 0 : onActive(info.index);
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
      },
      style: mergedStyle,
      className: classNames(handleCls, {
        [`${prefixCls}-slider-handle-active`]: activeIndex === info.index
      }),
      onKeyDown: (e) => {
        if ((e.key === "Delete" || e.key === "Backspace") && onKeyDelete) {
          onKeyDelete(info.index);
        }
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
      }
    });
  });
  const sliderContext = reactExports.useMemo(() => ({
    direction: "ltr",
    handleRender
  }), []);
  return /* @__PURE__ */ reactExports.createElement(SliderInternalContext.Provider, {
    value: sliderContext
  }, /* @__PURE__ */ reactExports.createElement(UnstableContext.Provider, {
    value: unstableContext
  }, /* @__PURE__ */ reactExports.createElement(Slider$1, Object.assign({}, sliderProps, {
    className: classNames(className, `${prefixCls}-slider`),
    tooltip: {
      open: false
    },
    range: {
      editable: range,
      minCount: 2
    },
    styles: {
      rail: {
        background: linearCss
      },
      handle: pointColor ? {
        background: pointColor
      } : {}
    },
    classNames: {
      rail: `${prefixCls}-slider-rail`,
      handle: `${prefixCls}-slider-handle`
    }
  }))));
};
const SingleColorSlider = (props) => {
  const {
    value,
    onChange,
    onChangeComplete
  } = props;
  const singleOnChange = (v) => onChange(v[0]);
  const singleOnChangeComplete = (v) => onChangeComplete(v[0]);
  return /* @__PURE__ */ reactExports.createElement(GradientColorSlider, Object.assign({}, props, {
    value: [value],
    onChange: singleOnChange,
    onChangeComplete: singleOnChangeComplete
  }));
};
function sortColors(colors) {
  return _toConsumableArray(colors).sort((a, b) => a.percent - b.percent);
}
const GradientColorBar = (props) => {
  const {
    prefixCls,
    mode,
    onChange,
    onChangeComplete,
    onActive,
    activeIndex,
    onGradientDragging,
    colors
  } = props;
  const isGradient = mode === "gradient";
  const colorList = reactExports.useMemo(() => colors.map((info) => ({
    percent: info.percent,
    color: info.color.toRgbString()
  })), [colors]);
  const values = reactExports.useMemo(() => colorList.map((info) => info.percent), [colorList]);
  const colorsRef = reactExports.useRef(colorList);
  const onDragStart = ({
    rawValues,
    draggingIndex,
    draggingValue
  }) => {
    if (rawValues.length > colorList.length) {
      const newPointColor = getGradientPercentColor(colorList, draggingValue);
      const nextColors = _toConsumableArray(colorList);
      nextColors.splice(draggingIndex, 0, {
        percent: draggingValue,
        color: newPointColor
      });
      colorsRef.current = nextColors;
    } else {
      colorsRef.current = colorList;
    }
    onGradientDragging(true);
    onChange(new AggregationColor(sortColors(colorsRef.current)), true);
  };
  const onDragChange = ({
    deleteIndex,
    draggingIndex,
    draggingValue
  }) => {
    let nextColors = _toConsumableArray(colorsRef.current);
    if (deleteIndex !== -1) {
      nextColors.splice(deleteIndex, 1);
    } else {
      nextColors[draggingIndex] = Object.assign(Object.assign({}, nextColors[draggingIndex]), {
        percent: draggingValue
      });
      nextColors = sortColors(nextColors);
    }
    onChange(new AggregationColor(nextColors), true);
  };
  const onKeyDelete = (index) => {
    const nextColors = _toConsumableArray(colorList);
    nextColors.splice(index, 1);
    const nextColor = new AggregationColor(nextColors);
    onChange(nextColor);
    onChangeComplete(nextColor);
  };
  const onInternalChangeComplete = (nextValues) => {
    onChangeComplete(new AggregationColor(colorList));
    if (activeIndex >= nextValues.length) {
      onActive(nextValues.length - 1);
    }
    onGradientDragging(false);
  };
  if (!isGradient) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(GradientColorSlider, {
    min: 0,
    max: 100,
    prefixCls,
    className: `${prefixCls}-gradient-slider`,
    colors: colorList,
    color: null,
    value: values,
    range: true,
    onChangeComplete: onInternalChangeComplete,
    disabled: false,
    type: "gradient",
    // Active
    activeIndex,
    onActive,
    // Drag
    onDragStart,
    onDragChange,
    onKeyDelete
  });
};
const GradientColorBar$1 = /* @__PURE__ */ reactExports.memo(GradientColorBar);
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const components = {
  slider: SingleColorSlider
};
const PanelPicker = () => {
  const panelPickerContext = reactExports.useContext(PanelPickerContext);
  const {
    mode,
    onModeChange,
    modeOptions,
    prefixCls,
    allowClear,
    value,
    disabledAlpha,
    onChange,
    onClear,
    onChangeComplete,
    activeIndex,
    gradientDragging
  } = panelPickerContext, injectProps = __rest$2(panelPickerContext, ["mode", "onModeChange", "modeOptions", "prefixCls", "allowClear", "value", "disabledAlpha", "onChange", "onClear", "onChangeComplete", "activeIndex", "gradientDragging"]);
  const colors = React.useMemo(() => {
    if (!value.cleared) {
      return value.getColors();
    }
    return [{
      percent: 0,
      color: new AggregationColor("")
    }, {
      percent: 100,
      color: new AggregationColor("")
    }];
  }, [value]);
  const isSingle = !value.isGradient();
  const [lockedColor, setLockedColor] = React.useState(value);
  useLayoutEffect(() => {
    var _a;
    if (!isSingle) {
      setLockedColor((_a = colors[activeIndex]) === null || _a === void 0 ? void 0 : _a.color);
    }
  }, [gradientDragging, activeIndex]);
  const activeColor = React.useMemo(() => {
    var _a;
    if (isSingle) {
      return value;
    }
    if (gradientDragging) {
      return lockedColor;
    }
    return (_a = colors[activeIndex]) === null || _a === void 0 ? void 0 : _a.color;
  }, [value, activeIndex, isSingle, lockedColor, gradientDragging]);
  const [pickerColor, setPickerColor] = React.useState(activeColor);
  const [forceSync, setForceSync] = React.useState(0);
  const mergedPickerColor = (pickerColor === null || pickerColor === void 0 ? void 0 : pickerColor.equals(activeColor)) ? activeColor : pickerColor;
  useLayoutEffect(() => {
    setPickerColor(activeColor);
  }, [forceSync, activeColor === null || activeColor === void 0 ? void 0 : activeColor.toHexString()]);
  const fillColor = (nextColor, info) => {
    let submitColor = generateColor$1(nextColor);
    if (value.cleared) {
      const rgb = submitColor.toRgb();
      if (!rgb.r && !rgb.g && !rgb.b && info) {
        const {
          type: infoType,
          value: infoValue = 0
        } = info;
        submitColor = new AggregationColor({
          h: infoType === "hue" ? infoValue : 0,
          s: 1,
          b: 1,
          a: infoType === "alpha" ? infoValue / 100 : 1
        });
      } else {
        submitColor = genAlphaColor(submitColor);
      }
    }
    if (mode === "single") {
      return submitColor;
    }
    const nextColors = _toConsumableArray(colors);
    nextColors[activeIndex] = Object.assign(Object.assign({}, nextColors[activeIndex]), {
      color: submitColor
    });
    return new AggregationColor(nextColors);
  };
  const onPickerChange = (colorValue, fromPicker, info) => {
    const nextColor = fillColor(colorValue, info);
    setPickerColor(nextColor.isGradient() ? nextColor.getColors()[activeIndex].color : nextColor);
    onChange(nextColor, fromPicker);
  };
  const onInternalChangeComplete = (nextColor, info) => {
    onChangeComplete(fillColor(nextColor, info));
    setForceSync((ori) => ori + 1);
  };
  const onInputChange = (colorValue) => {
    onChange(fillColor(colorValue));
  };
  let operationNode = null;
  const showMode = modeOptions.length > 1;
  if (allowClear || showMode) {
    operationNode = /* @__PURE__ */ React.createElement("div", {
      className: `${prefixCls}-operation`
    }, showMode && /* @__PURE__ */ React.createElement(Segmented, {
      size: "small",
      options: modeOptions,
      value: mode,
      onChange: onModeChange
    }), /* @__PURE__ */ React.createElement(ColorClear, Object.assign({
      prefixCls,
      value,
      onChange: (clearColor) => {
        onChange(clearColor);
        onClear === null || onClear === void 0 ? void 0 : onClear();
      }
    }, injectProps)));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, operationNode, /* @__PURE__ */ React.createElement(GradientColorBar$1, Object.assign({}, panelPickerContext, {
    colors
  })), /* @__PURE__ */ React.createElement(ColorPicker$1, {
    prefixCls,
    value: mergedPickerColor === null || mergedPickerColor === void 0 ? void 0 : mergedPickerColor.toHsb(),
    disabledAlpha,
    onChange: (colorValue, info) => {
      onPickerChange(colorValue, true, info);
    },
    onChangeComplete: (colorValue, info) => {
      onInternalChangeComplete(colorValue, info);
    },
    components
  }), /* @__PURE__ */ React.createElement(ColorInput, Object.assign({
    value: activeColor,
    onChange: onInputChange,
    prefixCls,
    disabledAlpha
  }, injectProps)));
};
const PanelPresets = () => {
  const {
    prefixCls,
    value,
    presets,
    onChange
  } = reactExports.useContext(PanelPresetsContext);
  return Array.isArray(presets) ? /* @__PURE__ */ React.createElement(ColorPresets, {
    value,
    presets,
    prefixCls,
    onChange
  }) : null;
};
const ColorPickerPanel = (props) => {
  const {
    prefixCls,
    presets,
    panelRender,
    value,
    onChange,
    onClear,
    allowClear,
    disabledAlpha,
    mode,
    onModeChange,
    modeOptions,
    onChangeComplete,
    activeIndex,
    onActive,
    format,
    onFormatChange,
    gradientDragging,
    onGradientDragging,
    disabledFormat
  } = props;
  const colorPickerPanelPrefixCls = `${prefixCls}-inner`;
  const panelContext = React.useMemo(() => ({
    prefixCls,
    value,
    onChange,
    onClear,
    allowClear,
    disabledAlpha,
    mode,
    onModeChange,
    modeOptions,
    onChangeComplete,
    activeIndex,
    onActive,
    format,
    onFormatChange,
    gradientDragging,
    onGradientDragging,
    disabledFormat
  }), [prefixCls, value, onChange, onClear, allowClear, disabledAlpha, mode, onModeChange, modeOptions, onChangeComplete, activeIndex, onActive, format, onFormatChange, gradientDragging, onGradientDragging, disabledFormat]);
  const presetContext = React.useMemo(() => ({
    prefixCls,
    value,
    presets,
    onChange
  }), [prefixCls, value, presets, onChange]);
  const innerPanel = /* @__PURE__ */ React.createElement("div", {
    className: `${colorPickerPanelPrefixCls}-content`
  }, /* @__PURE__ */ React.createElement(PanelPicker, null), Array.isArray(presets) && /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(PanelPresets, null));
  return /* @__PURE__ */ React.createElement(PanelPickerContext.Provider, {
    value: panelContext
  }, /* @__PURE__ */ React.createElement(PanelPresetsContext.Provider, {
    value: presetContext
  }, /* @__PURE__ */ React.createElement("div", {
    className: colorPickerPanelPrefixCls
  }, typeof panelRender === "function" ? panelRender(innerPanel, {
    components: {
      Picker: PanelPicker,
      Presets: PanelPresets
    }
  }) : innerPanel)));
};
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ColorTrigger = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    color,
    prefixCls,
    open,
    disabled,
    format,
    className,
    showText,
    activeIndex
  } = props, rest = __rest$1(props, ["color", "prefixCls", "open", "disabled", "format", "className", "showText", "activeIndex"]);
  const colorTriggerPrefixCls = `${prefixCls}-trigger`;
  const colorTextPrefixCls = `${colorTriggerPrefixCls}-text`;
  const colorTextCellPrefixCls = `${colorTextPrefixCls}-cell`;
  const [locale] = useLocale("ColorPicker");
  const desc = React.useMemo(() => {
    if (!showText) {
      return "";
    }
    if (typeof showText === "function") {
      return showText(color);
    }
    if (color.cleared) {
      return locale.transparent;
    }
    if (color.isGradient()) {
      return color.getColors().map((c, index) => {
        const inactive = activeIndex !== -1 && activeIndex !== index;
        return /* @__PURE__ */ React.createElement("span", {
          key: index,
          className: classNames(colorTextCellPrefixCls, inactive && `${colorTextCellPrefixCls}-inactive`)
        }, c.color.toRgbString(), " ", c.percent, "%");
      });
    }
    const hexString = color.toHexString().toUpperCase();
    const alpha = getColorAlpha(color);
    switch (format) {
      case "rgb":
        return color.toRgbString();
      case "hsb":
        return color.toHsbString();
      default:
        return alpha < 100 ? `${hexString.slice(0, 7)},${alpha}%` : hexString;
    }
  }, [color, format, showText, activeIndex]);
  const containerNode = reactExports.useMemo(() => color.cleared ? /* @__PURE__ */ React.createElement(ColorClear, {
    prefixCls
  }) : /* @__PURE__ */ React.createElement(ColorBlock, {
    prefixCls,
    color: color.toCssString()
  }), [color, prefixCls]);
  return /* @__PURE__ */ React.createElement("div", Object.assign({
    ref,
    className: classNames(colorTriggerPrefixCls, className, {
      [`${colorTriggerPrefixCls}-active`]: open,
      [`${colorTriggerPrefixCls}-disabled`]: disabled
    })
  }, pickAttrs(rest)), containerNode, showText && /* @__PURE__ */ React.createElement("div", {
    className: colorTextPrefixCls
  }, desc));
});
function useModeColor(defaultValue, value, mode) {
  const [locale] = useLocale("ColorPicker");
  const [mergedColor, setMergedColor] = useMergedState(defaultValue, {
    value
  });
  const [modeState, setModeState] = reactExports.useState("single");
  const [modeOptionList, modeSet] = reactExports.useMemo(() => {
    const list = (Array.isArray(mode) ? mode : [mode]).filter((m) => m);
    if (!list.length) {
      list.push("single");
    }
    const modes = new Set(list);
    const optionList = [];
    const pushOption = (modeType, localeTxt) => {
      if (modes.has(modeType)) {
        optionList.push({
          label: localeTxt,
          value: modeType
        });
      }
    };
    pushOption("single", locale.singleColor);
    pushOption("gradient", locale.gradientColor);
    return [optionList, modes];
  }, [mode]);
  const [cacheColor, setCacheColor] = reactExports.useState(null);
  const setColor = useEvent((nextColor) => {
    setCacheColor(nextColor);
    setMergedColor(nextColor);
  });
  const postColor = reactExports.useMemo(() => {
    const colorObj = generateColor$1(mergedColor || "");
    return colorObj.equals(cacheColor) ? cacheColor : colorObj;
  }, [mergedColor, cacheColor]);
  const postMode = reactExports.useMemo(() => {
    var _a;
    if (modeSet.has(modeState)) {
      return modeState;
    }
    return (_a = modeOptionList[0]) === null || _a === void 0 ? void 0 : _a.value;
  }, [modeSet, modeState, modeOptionList]);
  reactExports.useEffect(() => {
    setModeState(postColor.isGradient() ? "gradient" : "single");
  }, [postColor]);
  return [postColor, setColor, postMode, setModeState, modeOptionList];
}
const getTransBg = (size, colorFill) => ({
  backgroundImage: `conic-gradient(${colorFill} 25%, transparent 25% 50%, ${colorFill} 50% 75%, transparent 75% 100%)`,
  backgroundSize: `${size} ${size}`
});
const genColorBlockStyle = (token, size) => {
  const {
    componentCls,
    borderRadiusSM,
    colorPickerInsetShadow,
    lineWidth,
    colorFillSecondary
  } = token;
  return {
    [`${componentCls}-color-block`]: Object.assign(Object.assign({
      position: "relative",
      borderRadius: borderRadiusSM,
      width: size,
      height: size,
      boxShadow: colorPickerInsetShadow,
      flex: "none"
    }, getTransBg("50%", token.colorFillSecondary)), {
      [`${componentCls}-color-block-inner`]: {
        width: "100%",
        height: "100%",
        boxShadow: `inset 0 0 0 ${unit(lineWidth)} ${colorFillSecondary}`,
        borderRadius: "inherit"
      }
    })
  };
};
const genInputStyle = (token) => {
  const {
    componentCls,
    antCls,
    fontSizeSM,
    lineHeightSM,
    colorPickerAlphaInputWidth,
    marginXXS,
    paddingXXS,
    controlHeightSM,
    marginXS,
    fontSizeIcon,
    paddingXS,
    colorTextPlaceholder,
    colorPickerInputNumberHandleWidth,
    lineWidth
  } = token;
  return {
    [`${componentCls}-input-container`]: {
      display: "flex",
      [`${componentCls}-steppers${antCls}-input-number`]: {
        fontSize: fontSizeSM,
        lineHeight: lineHeightSM,
        [`${antCls}-input-number-input`]: {
          paddingInlineStart: paddingXXS,
          paddingInlineEnd: 0
        },
        [`${antCls}-input-number-handler-wrap`]: {
          width: colorPickerInputNumberHandleWidth
        }
      },
      [`${componentCls}-steppers${componentCls}-alpha-input`]: {
        flex: `0 0 ${unit(colorPickerAlphaInputWidth)}`,
        marginInlineStart: marginXXS
      },
      [`${componentCls}-format-select${antCls}-select`]: {
        marginInlineEnd: marginXS,
        width: "auto",
        "&-single": {
          [`${antCls}-select-selector`]: {
            padding: 0,
            border: 0
          },
          [`${antCls}-select-arrow`]: {
            insetInlineEnd: 0
          },
          [`${antCls}-select-selection-item`]: {
            paddingInlineEnd: token.calc(fontSizeIcon).add(marginXXS).equal(),
            fontSize: fontSizeSM,
            lineHeight: unit(controlHeightSM)
          },
          [`${antCls}-select-item-option-content`]: {
            fontSize: fontSizeSM,
            lineHeight: lineHeightSM
          },
          [`${antCls}-select-dropdown`]: {
            [`${antCls}-select-item`]: {
              minHeight: "auto"
            }
          }
        }
      },
      [`${componentCls}-input`]: {
        gap: marginXXS,
        alignItems: "center",
        flex: 1,
        width: 0,
        [`${componentCls}-hsb-input,${componentCls}-rgb-input`]: {
          display: "flex",
          gap: marginXXS,
          alignItems: "center"
        },
        [`${componentCls}-steppers`]: {
          flex: 1
        },
        [`${componentCls}-hex-input${antCls}-input-affix-wrapper`]: {
          flex: 1,
          padding: `0 ${unit(paddingXS)}`,
          [`${antCls}-input`]: {
            fontSize: fontSizeSM,
            textTransform: "uppercase",
            lineHeight: unit(token.calc(controlHeightSM).sub(token.calc(lineWidth).mul(2)).equal())
          },
          [`${antCls}-input-prefix`]: {
            color: colorTextPlaceholder
          }
        }
      }
    }
  };
};
const genPickerStyle = (token) => {
  const {
    componentCls,
    controlHeightLG,
    borderRadiusSM,
    colorPickerInsetShadow,
    marginSM,
    colorBgElevated,
    colorFillSecondary,
    lineWidthBold,
    colorPickerHandlerSize
  } = token;
  return {
    userSelect: "none",
    [`${componentCls}-select`]: {
      [`${componentCls}-palette`]: {
        minHeight: token.calc(controlHeightLG).mul(4).equal(),
        overflow: "hidden",
        borderRadius: borderRadiusSM
      },
      [`${componentCls}-saturation`]: {
        position: "absolute",
        borderRadius: "inherit",
        boxShadow: colorPickerInsetShadow,
        inset: 0
      },
      marginBottom: marginSM
    },
    // ======================== Panel =========================
    [`${componentCls}-handler`]: {
      width: colorPickerHandlerSize,
      height: colorPickerHandlerSize,
      border: `${unit(lineWidthBold)} solid ${colorBgElevated}`,
      position: "relative",
      borderRadius: "50%",
      cursor: "pointer",
      boxShadow: `${colorPickerInsetShadow}, 0 0 0 1px ${colorFillSecondary}`
    }
  };
};
const genPresetsStyle = (token) => {
  const {
    componentCls,
    antCls,
    colorTextQuaternary,
    paddingXXS,
    colorPickerPresetColorSize,
    fontSizeSM,
    colorText,
    lineHeightSM,
    lineWidth,
    borderRadius,
    colorFill,
    colorWhite,
    marginXXS,
    paddingXS,
    fontHeightSM
  } = token;
  return {
    [`${componentCls}-presets`]: {
      [`${antCls}-collapse-item > ${antCls}-collapse-header`]: {
        padding: 0,
        [`${antCls}-collapse-expand-icon`]: {
          height: fontHeightSM,
          color: colorTextQuaternary,
          paddingInlineEnd: paddingXXS
        }
      },
      [`${antCls}-collapse`]: {
        display: "flex",
        flexDirection: "column",
        gap: marginXXS
      },
      [`${antCls}-collapse-item > ${antCls}-collapse-content > ${antCls}-collapse-content-box`]: {
        padding: `${unit(paddingXS)} 0`
      },
      "&-label": {
        fontSize: fontSizeSM,
        color: colorText,
        lineHeight: lineHeightSM
      },
      "&-items": {
        display: "flex",
        flexWrap: "wrap",
        gap: token.calc(marginXXS).mul(1.5).equal(),
        [`${componentCls}-presets-color`]: {
          position: "relative",
          cursor: "pointer",
          width: colorPickerPresetColorSize,
          height: colorPickerPresetColorSize,
          "&::before": {
            content: '""',
            pointerEvents: "none",
            width: token.calc(colorPickerPresetColorSize).add(token.calc(lineWidth).mul(4)).equal(),
            height: token.calc(colorPickerPresetColorSize).add(token.calc(lineWidth).mul(4)).equal(),
            position: "absolute",
            top: token.calc(lineWidth).mul(-2).equal(),
            insetInlineStart: token.calc(lineWidth).mul(-2).equal(),
            borderRadius,
            border: `${unit(lineWidth)} solid transparent`,
            transition: `border-color ${token.motionDurationMid} ${token.motionEaseInBack}`
          },
          "&:hover::before": {
            borderColor: colorFill
          },
          "&::after": {
            boxSizing: "border-box",
            position: "absolute",
            top: "50%",
            insetInlineStart: "21.5%",
            display: "table",
            width: token.calc(colorPickerPresetColorSize).div(13).mul(5).equal(),
            height: token.calc(colorPickerPresetColorSize).div(13).mul(8).equal(),
            border: `${unit(token.lineWidthBold)} solid ${token.colorWhite}`,
            borderTop: 0,
            borderInlineStart: 0,
            transform: "rotate(45deg) scale(0) translate(-50%,-50%)",
            opacity: 0,
            content: '""',
            transition: `all ${token.motionDurationFast} ${token.motionEaseInBack}, opacity ${token.motionDurationFast}`
          },
          [`&${componentCls}-presets-color-checked`]: {
            "&::after": {
              opacity: 1,
              borderColor: colorWhite,
              transform: "rotate(45deg) scale(1) translate(-50%,-50%)",
              transition: `transform ${token.motionDurationMid} ${token.motionEaseOutBack} ${token.motionDurationFast}`
            },
            [`&${componentCls}-presets-color-bright`]: {
              "&::after": {
                borderColor: "rgba(0, 0, 0, 0.45)"
              }
            }
          }
        }
      },
      "&-empty": {
        fontSize: fontSizeSM,
        color: colorTextQuaternary
      }
    }
  };
};
const genSliderStyle = (token) => {
  const {
    componentCls,
    colorPickerInsetShadow,
    colorBgElevated,
    colorFillSecondary,
    lineWidthBold,
    colorPickerHandlerSizeSM,
    colorPickerSliderHeight,
    marginSM,
    marginXS
  } = token;
  const handleInnerSize = token.calc(colorPickerHandlerSizeSM).sub(token.calc(lineWidthBold).mul(2).equal()).equal();
  const handleHoverSize = token.calc(colorPickerHandlerSizeSM).add(token.calc(lineWidthBold).mul(2).equal()).equal();
  const activeHandleStyle = {
    "&:after": {
      transform: "scale(1)",
      boxShadow: `${colorPickerInsetShadow}, 0 0 0 1px ${token.colorPrimaryActive}`
    }
  };
  return {
    // ======================== Slider ========================
    [`${componentCls}-slider`]: [getTransBg(unit(colorPickerSliderHeight), token.colorFillSecondary), {
      margin: 0,
      padding: 0,
      height: colorPickerSliderHeight,
      borderRadius: token.calc(colorPickerSliderHeight).div(2).equal(),
      "&-rail": {
        height: colorPickerSliderHeight,
        borderRadius: token.calc(colorPickerSliderHeight).div(2).equal(),
        boxShadow: colorPickerInsetShadow
      },
      [`& ${componentCls}-slider-handle`]: {
        width: handleInnerSize,
        height: handleInnerSize,
        top: 0,
        borderRadius: "100%",
        "&:before": {
          display: "block",
          position: "absolute",
          background: "transparent",
          left: {
            _skip_check_: true,
            value: "50%"
          },
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: handleHoverSize,
          height: handleHoverSize,
          borderRadius: "100%"
        },
        "&:after": {
          width: colorPickerHandlerSizeSM,
          height: colorPickerHandlerSizeSM,
          border: `${unit(lineWidthBold)} solid ${colorBgElevated}`,
          boxShadow: `${colorPickerInsetShadow}, 0 0 0 1px ${colorFillSecondary}`,
          outline: "none",
          insetInlineStart: token.calc(lineWidthBold).mul(-1).equal(),
          top: token.calc(lineWidthBold).mul(-1).equal(),
          background: "transparent",
          transition: "none"
        },
        "&:focus": activeHandleStyle
      }
    }],
    // ======================== Layout ========================
    [`${componentCls}-slider-container`]: {
      display: "flex",
      gap: marginSM,
      marginBottom: marginSM,
      // Group
      [`${componentCls}-slider-group`]: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        display: "flex",
        "&-disabled-alpha": {
          justifyContent: "center"
        }
      }
    },
    [`${componentCls}-gradient-slider`]: {
      marginBottom: marginXS,
      [`& ${componentCls}-slider-handle`]: {
        "&:after": {
          transform: "scale(0.8)"
        },
        "&-active, &:focus": activeHandleStyle
      }
    }
  };
};
const genActiveStyle = (token, borderColor, outlineColor) => ({
  borderInlineEndWidth: token.lineWidth,
  borderColor,
  boxShadow: `0 0 0 ${unit(token.controlOutlineWidth)} ${outlineColor}`,
  outline: 0
});
const genRtlStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    "&-rtl": {
      [`${componentCls}-presets-color`]: {
        "&::after": {
          direction: "ltr"
        }
      },
      [`${componentCls}-clear`]: {
        "&::after": {
          direction: "ltr"
        }
      }
    }
  };
};
const genClearStyle = (token, size, extraStyle) => {
  const {
    componentCls,
    borderRadiusSM,
    lineWidth,
    colorSplit,
    colorBorder,
    red6
  } = token;
  return {
    [`${componentCls}-clear`]: Object.assign(Object.assign({
      width: size,
      height: size,
      borderRadius: borderRadiusSM,
      border: `${unit(lineWidth)} solid ${colorSplit}`,
      position: "relative",
      overflow: "hidden",
      cursor: "inherit",
      transition: `all ${token.motionDurationFast}`
    }, extraStyle), {
      "&::after": {
        content: '""',
        position: "absolute",
        insetInlineEnd: token.calc(lineWidth).mul(-1).equal(),
        top: token.calc(lineWidth).mul(-1).equal(),
        display: "block",
        width: 40,
        // maximum
        height: 2,
        // fixed
        transformOrigin: `calc(100% - 1px) 1px`,
        transform: "rotate(-45deg)",
        backgroundColor: red6
      },
      "&:hover": {
        borderColor: colorBorder
      }
    })
  };
};
const genStatusStyle = (token) => {
  const {
    componentCls,
    colorError,
    colorWarning,
    colorErrorHover,
    colorWarningHover,
    colorErrorOutline,
    colorWarningOutline
  } = token;
  return {
    [`&${componentCls}-status-error`]: {
      borderColor: colorError,
      "&:hover": {
        borderColor: colorErrorHover
      },
      [`&${componentCls}-trigger-active`]: Object.assign({}, genActiveStyle(token, colorError, colorErrorOutline))
    },
    [`&${componentCls}-status-warning`]: {
      borderColor: colorWarning,
      "&:hover": {
        borderColor: colorWarningHover
      },
      [`&${componentCls}-trigger-active`]: Object.assign({}, genActiveStyle(token, colorWarning, colorWarningOutline))
    }
  };
};
const genSizeStyle = (token) => {
  const {
    componentCls,
    controlHeightLG,
    controlHeightSM,
    controlHeight,
    controlHeightXS,
    borderRadius,
    borderRadiusSM,
    borderRadiusXS,
    borderRadiusLG,
    fontSizeLG
  } = token;
  return {
    [`&${componentCls}-lg`]: {
      minWidth: controlHeightLG,
      minHeight: controlHeightLG,
      borderRadius: borderRadiusLG,
      [`${componentCls}-color-block, ${componentCls}-clear`]: {
        width: controlHeight,
        height: controlHeight,
        borderRadius
      },
      [`${componentCls}-trigger-text`]: {
        fontSize: fontSizeLG
      }
    },
    [`&${componentCls}-sm`]: {
      minWidth: controlHeightSM,
      minHeight: controlHeightSM,
      borderRadius: borderRadiusSM,
      [`${componentCls}-color-block, ${componentCls}-clear`]: {
        width: controlHeightXS,
        height: controlHeightXS,
        borderRadius: borderRadiusXS
      },
      [`${componentCls}-trigger-text`]: {
        lineHeight: unit(controlHeightXS)
      }
    }
  };
};
const genColorPickerStyle = (token) => {
  const {
    antCls,
    componentCls,
    colorPickerWidth,
    colorPrimary,
    motionDurationMid,
    colorBgElevated,
    colorTextDisabled,
    colorText,
    colorBgContainerDisabled,
    borderRadius,
    marginXS,
    marginSM,
    controlHeight,
    controlHeightSM,
    colorBgTextActive,
    colorPickerPresetColorSize,
    colorPickerPreviewSize,
    lineWidth,
    colorBorder,
    paddingXXS,
    fontSize,
    colorPrimaryHover,
    controlOutline
  } = token;
  return [{
    [componentCls]: Object.assign({
      [`${componentCls}-inner`]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
        "&-content": {
          display: "flex",
          flexDirection: "column",
          width: colorPickerWidth,
          [`& > ${antCls}-divider`]: {
            margin: `${unit(marginSM)} 0 ${unit(marginXS)}`
          }
        },
        [`${componentCls}-panel`]: Object.assign({}, genPickerStyle(token))
      }, genSliderStyle(token)), genColorBlockStyle(token, colorPickerPreviewSize)), genInputStyle(token)), genPresetsStyle(token)), genClearStyle(token, colorPickerPresetColorSize, {
        marginInlineStart: "auto"
      })), {
        // Operation bar
        [`${componentCls}-operation`]: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: marginXS
        }
      }),
      "&-trigger": Object.assign(Object.assign(Object.assign(Object.assign({
        minWidth: controlHeight,
        minHeight: controlHeight,
        borderRadius,
        border: `${unit(lineWidth)} solid ${colorBorder}`,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "flex-start",
        justifyContent: "center",
        transition: `all ${motionDurationMid}`,
        background: colorBgElevated,
        padding: token.calc(paddingXXS).sub(lineWidth).equal(),
        [`${componentCls}-trigger-text`]: {
          marginInlineStart: marginXS,
          marginInlineEnd: token.calc(marginXS).sub(token.calc(paddingXXS).sub(lineWidth)).equal(),
          fontSize,
          color: colorText,
          alignSelf: "center",
          "&-cell": {
            "&:not(:last-child):after": {
              content: '", "'
            },
            "&-inactive": {
              color: colorTextDisabled
            }
          }
        },
        "&:hover": {
          borderColor: colorPrimaryHover
        },
        [`&${componentCls}-trigger-active`]: Object.assign({}, genActiveStyle(token, colorPrimary, controlOutline)),
        "&-disabled": {
          color: colorTextDisabled,
          background: colorBgContainerDisabled,
          cursor: "not-allowed",
          "&:hover": {
            borderColor: colorBgTextActive
          },
          [`${componentCls}-trigger-text`]: {
            color: colorTextDisabled
          }
        }
      }, genClearStyle(token, controlHeightSM)), genColorBlockStyle(token, controlHeightSM)), genStatusStyle(token)), genSizeStyle(token))
    }, genRtlStyle(token))
  }, genCompactItemStyle(token, {
    focusElCls: `${componentCls}-trigger-active`
  })];
};
const useStyle = genStyleHooks("ColorPicker", (token) => {
  const {
    colorTextQuaternary,
    marginSM
  } = token;
  const colorPickerSliderHeight = 8;
  const colorPickerToken = merge(token, {
    colorPickerWidth: 234,
    colorPickerHandlerSize: 16,
    colorPickerHandlerSizeSM: 12,
    colorPickerAlphaInputWidth: 44,
    colorPickerInputNumberHandleWidth: 16,
    colorPickerPresetColorSize: 24,
    colorPickerInsetShadow: `inset 0 0 1px 0 ${colorTextQuaternary}`,
    colorPickerSliderHeight,
    colorPickerPreviewSize: token.calc(colorPickerSliderHeight).mul(2).add(marginSM).equal()
  });
  return genColorPickerStyle(colorPickerToken);
});
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ColorPicker = (props) => {
  const {
    mode,
    value,
    defaultValue,
    format,
    defaultFormat,
    allowClear = false,
    presets,
    children,
    trigger = "click",
    open,
    disabled,
    placement = "bottomLeft",
    arrow = true,
    panelRender,
    showText,
    style,
    className,
    size: customizeSize,
    rootClassName,
    prefixCls: customizePrefixCls,
    styles,
    disabledAlpha = false,
    onFormatChange,
    onChange,
    onClear,
    onOpenChange,
    onChangeComplete,
    getPopupContainer,
    autoAdjustOverflow = true,
    destroyTooltipOnHide,
    destroyOnHidden,
    disabledFormat
  } = props, rest = __rest(props, ["mode", "value", "defaultValue", "format", "defaultFormat", "allowClear", "presets", "children", "trigger", "open", "disabled", "placement", "arrow", "panelRender", "showText", "style", "className", "size", "rootClassName", "prefixCls", "styles", "disabledAlpha", "onFormatChange", "onChange", "onClear", "onOpenChange", "onChangeComplete", "getPopupContainer", "autoAdjustOverflow", "destroyTooltipOnHide", "destroyOnHidden", "disabledFormat"]);
  const {
    getPrefixCls,
    direction,
    colorPicker
  } = reactExports.useContext(ConfigContext);
  const contextDisabled = reactExports.useContext(DisabledContext);
  const mergedDisabled = disabled !== null && disabled !== void 0 ? disabled : contextDisabled;
  const [popupOpen, setPopupOpen] = useMergedState(false, {
    value: open,
    postState: (openData) => !mergedDisabled && openData,
    onChange: onOpenChange
  });
  const [formatValue, setFormatValue] = useMergedState(format, {
    value: format,
    defaultValue: defaultFormat,
    onChange: onFormatChange
  });
  const prefixCls = getPrefixCls("color-picker", customizePrefixCls);
  const [mergedColor, setColor, modeState, setModeState, modeOptions] = useModeColor(defaultValue, value, mode);
  const isAlphaColor = reactExports.useMemo(() => getColorAlpha(mergedColor) < 100, [mergedColor]);
  const [cachedGradientColor, setCachedGradientColor] = React.useState(null);
  const onInternalChangeComplete = (color) => {
    if (onChangeComplete) {
      let changeColor = generateColor$1(color);
      if (disabledAlpha && isAlphaColor) {
        changeColor = genAlphaColor(color);
      }
      onChangeComplete(changeColor);
    }
  };
  const onInternalChange = (data, changeFromPickerDrag) => {
    let color = generateColor$1(data);
    if (disabledAlpha && isAlphaColor) {
      color = genAlphaColor(color);
    }
    setColor(color);
    setCachedGradientColor(null);
    if (onChange) {
      onChange(color, color.toCssString());
    }
    if (!changeFromPickerDrag) {
      onInternalChangeComplete(color);
    }
  };
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [gradientDragging, setGradientDragging] = React.useState(false);
  const onInternalModeChange = (newMode) => {
    setModeState(newMode);
    if (newMode === "single" && mergedColor.isGradient()) {
      setActiveIndex(0);
      onInternalChange(new AggregationColor(mergedColor.getColors()[0].color));
      setCachedGradientColor(mergedColor);
    } else if (newMode === "gradient" && !mergedColor.isGradient()) {
      const baseColor = isAlphaColor ? genAlphaColor(mergedColor) : mergedColor;
      onInternalChange(new AggregationColor(cachedGradientColor || [{
        percent: 0,
        color: baseColor
      }, {
        percent: 100,
        color: baseColor
      }]));
    }
  };
  const {
    status: contextStatus
  } = React.useContext(FormItemInputContext);
  const {
    compactSize,
    compactItemClassnames
  } = useCompactItemContext(prefixCls, direction);
  const mergedSize = useSize((ctx) => {
    var _a;
    return (_a = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a !== void 0 ? _a : ctx;
  });
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const rtlCls = {
    [`${prefixCls}-rtl`]: direction
  };
  const mergedRootCls = classNames(rootClassName, cssVarCls, rootCls, rtlCls);
  const mergedCls = classNames(getStatusClassNames(prefixCls, contextStatus), {
    [`${prefixCls}-sm`]: mergedSize === "small",
    [`${prefixCls}-lg`]: mergedSize === "large"
  }, compactItemClassnames, colorPicker === null || colorPicker === void 0 ? void 0 : colorPicker.className, mergedRootCls, className, hashId);
  const mergedPopupCls = classNames(prefixCls, mergedRootCls);
  const popoverProps = {
    open: popupOpen,
    trigger,
    placement,
    arrow,
    rootClassName,
    getPopupContainer,
    autoAdjustOverflow,
    destroyOnHidden: destroyOnHidden !== null && destroyOnHidden !== void 0 ? destroyOnHidden : !!destroyTooltipOnHide
  };
  const mergedStyle = Object.assign(Object.assign({}, colorPicker === null || colorPicker === void 0 ? void 0 : colorPicker.style), style);
  return wrapCSSVar(/* @__PURE__ */ React.createElement(Popover, Object.assign({
    style: styles === null || styles === void 0 ? void 0 : styles.popup,
    styles: {
      body: styles === null || styles === void 0 ? void 0 : styles.popupOverlayInner
    },
    onOpenChange: (visible) => {
      if (!visible || !mergedDisabled) {
        setPopupOpen(visible);
      }
    },
    content: /* @__PURE__ */ React.createElement(ContextIsolator, {
      form: true
    }, /* @__PURE__ */ React.createElement(ColorPickerPanel, {
      mode: modeState,
      onModeChange: onInternalModeChange,
      modeOptions,
      prefixCls,
      value: mergedColor,
      allowClear,
      disabled: mergedDisabled,
      disabledAlpha,
      presets,
      panelRender,
      format: formatValue,
      onFormatChange: setFormatValue,
      onChange: onInternalChange,
      onChangeComplete: onInternalChangeComplete,
      onClear,
      activeIndex,
      onActive: setActiveIndex,
      gradientDragging,
      onGradientDragging: setGradientDragging,
      disabledFormat
    })),
    classNames: {
      root: mergedPopupCls
    }
  }, popoverProps), children || /* @__PURE__ */ React.createElement(ColorTrigger, Object.assign({
    activeIndex: popupOpen ? activeIndex : -1,
    open: popupOpen,
    className: mergedCls,
    style: mergedStyle,
    prefixCls,
    disabled: mergedDisabled,
    showText,
    format: formatValue
  }, rest, {
    color: mergedColor
  }))));
};
const PurePanel = genPurePanel(
  ColorPicker,
  void 0,
  (props) => Object.assign(Object.assign({}, props), {
    placement: "bottom",
    autoAdjustOverflow: false
  }),
  "color-picker",
  /* istanbul ignore next */
  (prefixCls) => prefixCls
);
ColorPicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
var BgColorsOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" } }] }, "name": "bg-colors", "theme": "outlined" };
var ClearOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "defs", "attrs": {}, "children": [{ "tag": "style", "attrs": {} }] }, { "tag": "path", "attrs": { "d": "M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6a25.95 25.95 0 0025.6 30.4h723c1.5 0 3-.1 4.4-.4a25.88 25.88 0 0021.2-30zM204 390h272V182h72v208h272v104H204V390zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z" } }] }, "name": "clear", "theme": "outlined" };
var ContactsOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M594.3 601.5a111.8 111.8 0 0029.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 00-74.6 126.1 8 8 0 008 8.4H407c4.2 0 7.6-3.3 7.9-7.5 3.8-50.6 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H661a8 8 0 008-8.4c-2.8-53.3-32-99.7-74.7-126.1zM512 578c-28.5 0-51.7-23.3-51.7-52s23.2-52 51.7-52 51.7 23.3 51.7 52-23.2 52-51.7 52zm416-354H768v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H548v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H328v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56H96c-17.7 0-32 14.3-32 32v576c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V256c0-17.7-14.3-32-32-32zm-40 568H136V296h120v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h148v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h148v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56h120v496z" } }] }, "name": "contacts", "theme": "outlined" };
var EnvironmentOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M854.6 289.1a362.49 362.49 0 00-79.9-115.7 370.83 370.83 0 00-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 00169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0022.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z" } }] }, "name": "environment", "theme": "outlined" };
var MailOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z" } }] }, "name": "mail", "theme": "outlined" };
var PhoneOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7a405.46 405.46 0 01-86.4 127.3c-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3a68.2 68.2 0 00-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4zm-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 .9.9 21.6-8a481.29 481.29 0 00285.7-285.8l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z" } }] }, "name": "phone", "theme": "outlined" };
var SecurityScanOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6zM402.9 528.8l-77.5 77.5a8.03 8.03 0 000 11.3l34 34c3.1 3.1 8.2 3.1 11.3 0l77.5-77.5c55.7 35.1 130.1 28.4 178.6-20.1 56.3-56.3 56.3-147.5 0-203.8-56.3-56.3-147.5-56.3-203.8 0-48.5 48.5-55.2 123-20.1 178.6zm65.4-133.3c31.3-31.3 82-31.3 113.2 0 31.3 31.3 31.3 82 0 113.2-31.3 31.3-82 31.3-113.2 0s-31.3-81.9 0-113.2z" } }] }, "name": "security-scan", "theme": "outlined" };
function _extends$6() {
  _extends$6 = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends$6.apply(this, arguments);
}
const BgColorsOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$6({}, props, {
  ref,
  icon: BgColorsOutlined$1
}));
const RefIcon$6 = /* @__PURE__ */ reactExports.forwardRef(BgColorsOutlined);
function _extends$5() {
  _extends$5 = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends$5.apply(this, arguments);
}
const ClearOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$5({}, props, {
  ref,
  icon: ClearOutlined$1
}));
const RefIcon$5 = /* @__PURE__ */ reactExports.forwardRef(ClearOutlined);
function _extends$4() {
  _extends$4 = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends$4.apply(this, arguments);
}
const ContactsOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$4({}, props, {
  ref,
  icon: ContactsOutlined$1
}));
const RefIcon$4 = /* @__PURE__ */ reactExports.forwardRef(ContactsOutlined);
function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function(target) {
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
  return _extends$3.apply(this, arguments);
}
const EnvironmentOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$3({}, props, {
  ref,
  icon: EnvironmentOutlined$1
}));
const RefIcon$3 = /* @__PURE__ */ reactExports.forwardRef(EnvironmentOutlined);
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
const MailOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$2({}, props, {
  ref,
  icon: MailOutlined$1
}));
const RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(MailOutlined);
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
const PhoneOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends$1({}, props, {
  ref,
  icon: PhoneOutlined$1
}));
const RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(PhoneOutlined);
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
const SecurityScanOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: SecurityScanOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(SecurityScanOutlined);
var dist = {};
var sdk = {};
(function() {
  var eventHandlers = {};
  var locationHash = "";
  try {
    locationHash = location.hash.toString();
  } catch (e) {
  }
  var initParams = urlParseHashParams(locationHash);
  var storedParams = sessionStorageGet("initParams");
  if (storedParams) {
    for (var key in storedParams) {
      if (typeof initParams[key] === "undefined") {
        initParams[key] = storedParams[key];
      }
    }
  }
  sessionStorageSet("initParams", initParams);
  var isIframe = false, iFrameStyle;
  try {
    isIframe = window.parent != null && window != window.parent;
    if (isIframe) {
      window.addEventListener("message", function(event) {
        if (event.source !== window.parent)
          return;
        try {
          var dataParsed = JSON.parse(event.data);
        } catch (e) {
          return;
        }
        if (!dataParsed || !dataParsed.eventType) {
          return;
        }
        if (dataParsed.eventType == "set_custom_style") {
          if (event.origin === "https://web.telegram.org") {
            iFrameStyle.innerHTML = dataParsed.eventData;
          }
        } else if (dataParsed.eventType == "reload_iframe") {
          try {
            window.parent.postMessage(JSON.stringify({ eventType: "iframe_will_reload" }), "*");
          } catch (e) {
          }
          location.reload();
        } else {
          receiveEvent(dataParsed.eventType, dataParsed.eventData);
        }
      });
      iFrameStyle = document.createElement("style");
      document.head.appendChild(iFrameStyle);
      try {
        window.parent.postMessage(JSON.stringify({ eventType: "iframe_ready", eventData: { reload_supported: true } }), "*");
      } catch (e) {
      }
    }
  } catch (e) {
  }
  function urlSafeDecode(urlencoded) {
    try {
      urlencoded = urlencoded.replace(/\+/g, "%20");
      return decodeURIComponent(urlencoded);
    } catch (e) {
      return urlencoded;
    }
  }
  function urlParseHashParams(locationHash2) {
    locationHash2 = locationHash2.replace(/^#/, "");
    var params = {};
    if (!locationHash2.length) {
      return params;
    }
    if (locationHash2.indexOf("=") < 0 && locationHash2.indexOf("?") < 0) {
      params._path = urlSafeDecode(locationHash2);
      return params;
    }
    var qIndex = locationHash2.indexOf("?");
    if (qIndex >= 0) {
      var pathParam = locationHash2.substr(0, qIndex);
      params._path = urlSafeDecode(pathParam);
      locationHash2 = locationHash2.substr(qIndex + 1);
    }
    var query_params = urlParseQueryString(locationHash2);
    for (var k in query_params) {
      params[k] = query_params[k];
    }
    return params;
  }
  function urlParseQueryString(queryString) {
    var params = {};
    if (!queryString.length) {
      return params;
    }
    var queryStringParams = queryString.split("&");
    var i, param, paramName, paramValue;
    for (i = 0; i < queryStringParams.length; i++) {
      param = queryStringParams[i].split("=");
      paramName = urlSafeDecode(param[0]);
      paramValue = param[1] == null ? null : urlSafeDecode(param[1]);
      params[paramName] = paramValue;
    }
    return params;
  }
  function urlAppendHashParams(url2, addHash) {
    var ind = url2.indexOf("#");
    if (ind < 0) {
      return url2 + "#" + addHash;
    }
    var curHash = url2.substr(ind + 1);
    if (curHash.indexOf("=") >= 0 || curHash.indexOf("?") >= 0) {
      return url2 + "&" + addHash;
    }
    if (curHash.length > 0) {
      return url2 + "?" + addHash;
    }
    return url2 + addHash;
  }
  function postEvent(eventType, callback, eventData) {
    if (!callback) {
      callback = function() {
      };
    }
    if (eventData === void 0) {
      eventData = "";
    }
    console.log("[Telegram.WebView] > postEvent", eventType, eventData);
    if (window.TelegramWebviewProxy !== void 0) {
      TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
      callback();
    } else if (window.external && "notify" in window.external) {
      window.external.notify(JSON.stringify({ eventType, eventData }));
      callback();
    } else if (isIframe) {
      try {
        var trustedTarget = "https://web.telegram.org";
        trustedTarget = "*";
        window.parent.postMessage(JSON.stringify({ eventType, eventData }), trustedTarget);
        callback();
      } catch (e) {
        callback(e);
      }
    } else {
      callback({ notAvailable: true });
    }
  }
  function receiveEvent(eventType, eventData) {
    console.log("[Telegram.WebView] < receiveEvent", eventType, eventData);
    callEventCallbacks(eventType, function(callback) {
      callback(eventType, eventData);
    });
  }
  function callEventCallbacks(eventType, func) {
    var curEventHandlers = eventHandlers[eventType];
    if (curEventHandlers === void 0 || !curEventHandlers.length) {
      return;
    }
    for (var i = 0; i < curEventHandlers.length; i++) {
      try {
        func(curEventHandlers[i]);
      } catch (e) {
      }
    }
  }
  function onEvent(eventType, callback) {
    if (eventHandlers[eventType] === void 0) {
      eventHandlers[eventType] = [];
    }
    var index = eventHandlers[eventType].indexOf(callback);
    if (index === -1) {
      eventHandlers[eventType].push(callback);
    }
  }
  function offEvent(eventType, callback) {
    if (eventHandlers[eventType] === void 0) {
      return;
    }
    var index = eventHandlers[eventType].indexOf(callback);
    if (index === -1) {
      return;
    }
    eventHandlers[eventType].splice(index, 1);
  }
  function sessionStorageSet(key2, value) {
    try {
      window.sessionStorage.setItem("__telegram__" + key2, JSON.stringify(value));
      return true;
    } catch (e) {
    }
    return false;
  }
  function sessionStorageGet(key2) {
    try {
      return JSON.parse(window.sessionStorage.getItem("__telegram__" + key2));
    } catch (e) {
    }
    return null;
  }
  if (!window.Telegram) {
    window.Telegram = {};
  }
  window.Telegram.WebView = {
    initParams,
    isIframe,
    onEvent,
    offEvent,
    postEvent,
    receiveEvent,
    callEventCallbacks
  };
  window.Telegram.Utils = {
    urlSafeDecode,
    urlParseQueryString,
    urlParseHashParams,
    urlAppendHashParams,
    sessionStorageSet,
    sessionStorageGet
  };
  window.TelegramGameProxy_receiveEvent = receiveEvent;
  window.TelegramGameProxy = {
    receiveEvent
  };
})();
(function() {
  var Utils = window.Telegram.Utils;
  var WebView = window.Telegram.WebView;
  var initParams = WebView.initParams;
  var isIframe = WebView.isIframe;
  var WebApp = {};
  var webAppInitData = "", webAppInitDataUnsafe = {};
  var themeParams = {}, colorScheme = "light";
  var webAppVersion = "6.0";
  var webAppPlatform = "unknown";
  if (initParams.tgWebAppData && initParams.tgWebAppData.length) {
    webAppInitData = initParams.tgWebAppData;
    webAppInitDataUnsafe = Utils.urlParseQueryString(webAppInitData);
    for (var key in webAppInitDataUnsafe) {
      var val = webAppInitDataUnsafe[key];
      try {
        if (val.substr(0, 1) == "{" && val.substr(-1) == "}" || val.substr(0, 1) == "[" && val.substr(-1) == "]") {
          webAppInitDataUnsafe[key] = JSON.parse(val);
        }
      } catch (e) {
      }
    }
  }
  if (initParams.tgWebAppThemeParams && initParams.tgWebAppThemeParams.length) {
    var themeParamsRaw = initParams.tgWebAppThemeParams;
    try {
      var theme_params = JSON.parse(themeParamsRaw);
      if (theme_params) {
        setThemeParams(theme_params);
      }
    } catch (e) {
    }
  }
  var theme_params = Utils.sessionStorageGet("themeParams");
  if (theme_params) {
    setThemeParams(theme_params);
  }
  if (initParams.tgWebAppVersion) {
    webAppVersion = initParams.tgWebAppVersion;
  }
  if (initParams.tgWebAppPlatform) {
    webAppPlatform = initParams.tgWebAppPlatform;
  }
  function onThemeChanged(eventType, eventData) {
    if (eventData.theme_params) {
      setThemeParams(eventData.theme_params);
      window.Telegram.WebApp.MainButton.setParams({});
      window.Telegram.WebApp.SecondaryButton.setParams({});
      updateHeaderColor();
      updateBackgroundColor();
      updateBottomBarColor();
      receiveWebViewEvent("themeChanged");
    }
  }
  var lastWindowHeight = window.innerHeight;
  function onViewportChanged(eventType, eventData) {
    if (eventData.height) {
      window.removeEventListener("resize", onWindowResize);
      setViewportHeight(eventData);
    }
  }
  function onWindowResize(e) {
    if (lastWindowHeight != window.innerHeight) {
      lastWindowHeight = window.innerHeight;
      receiveWebViewEvent("viewportChanged", {
        isStateStable: true
      });
    }
  }
  function linkHandler(e) {
    if (e.metaKey || e.ctrlKey)
      return;
    var el = e.target;
    while (el.tagName != "A" && el.parentNode) {
      el = el.parentNode;
    }
    if (el.tagName == "A" && el.target != "_blank" && (el.protocol == "http:" || el.protocol == "https:") && el.hostname == "t.me") {
      WebApp.openTgLink(el.href);
      e.preventDefault();
    }
  }
  function strTrim(str) {
    return str.toString().replace(/^\s+|\s+$/g, "");
  }
  function receiveWebViewEvent(eventType) {
    var args = Array.prototype.slice.call(arguments);
    eventType = args.shift();
    WebView.callEventCallbacks("webview:" + eventType, function(callback) {
      callback.apply(WebApp, args);
    });
  }
  function onWebViewEvent(eventType, callback) {
    WebView.onEvent("webview:" + eventType, callback);
  }
  function offWebViewEvent(eventType, callback) {
    WebView.offEvent("webview:" + eventType, callback);
  }
  function setCssProperty(name, value) {
    var root = document.documentElement;
    if (root && root.style && root.style.setProperty) {
      root.style.setProperty("--tg-" + name, value);
    }
  }
  function setThemeParams(theme_params2) {
    if (theme_params2.bg_color == "#1c1c1d" && theme_params2.bg_color == theme_params2.secondary_bg_color) {
      theme_params2.secondary_bg_color = "#2c2c2e";
    }
    var color;
    for (var key2 in theme_params2) {
      if (color = parseColorToHex(theme_params2[key2])) {
        themeParams[key2] = color;
        if (key2 == "bg_color") {
          colorScheme = isColorDark(color) ? "dark" : "light";
          setCssProperty("color-scheme", colorScheme);
        }
        key2 = "theme-" + key2.split("_").join("-");
        setCssProperty(key2, color);
      }
    }
    Utils.sessionStorageSet("themeParams", themeParams);
  }
  var webAppCallbacks = {};
  function generateCallbackId(len) {
    var tries = 100;
    while (--tries) {
      var id = "", chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", chars_len = chars.length;
      for (var i = 0; i < len; i++) {
        id += chars[Math.floor(Math.random() * chars_len)];
      }
      if (!webAppCallbacks[id]) {
        webAppCallbacks[id] = {};
        return id;
      }
    }
    throw Error("WebAppCallbackIdGenerateFailed");
  }
  var viewportHeight = false, viewportStableHeight = false, isExpanded = true;
  function setViewportHeight(data) {
    if (typeof data !== "undefined") {
      isExpanded = !!data.is_expanded;
      viewportHeight = data.height;
      if (data.is_state_stable) {
        viewportStableHeight = data.height;
      }
      receiveWebViewEvent("viewportChanged", {
        isStateStable: !!data.is_state_stable
      });
    }
    var height, stable_height;
    if (viewportHeight !== false) {
      height = viewportHeight - bottomBarHeight + "px";
    } else {
      height = bottomBarHeight ? "calc(100vh - " + bottomBarHeight + "px)" : "100vh";
    }
    if (viewportStableHeight !== false) {
      stable_height = viewportStableHeight - bottomBarHeight + "px";
    } else {
      stable_height = bottomBarHeight ? "calc(100vh - " + bottomBarHeight + "px)" : "100vh";
    }
    setCssProperty("viewport-height", height);
    setCssProperty("viewport-stable-height", stable_height);
  }
  var isClosingConfirmationEnabled = false;
  function setClosingConfirmation(need_confirmation) {
    if (!versionAtLeast("6.2")) {
      console.warn("[Telegram.WebApp] Closing confirmation is not supported in version " + webAppVersion);
      return;
    }
    isClosingConfirmationEnabled = !!need_confirmation;
    WebView.postEvent("web_app_setup_closing_behavior", false, { need_confirmation: isClosingConfirmationEnabled });
  }
  var isVerticalSwipesEnabled = true;
  function toggleVerticalSwipes(enable_swipes) {
    if (!versionAtLeast("7.7")) {
      console.warn("[Telegram.WebApp] Changing swipes behavior is not supported in version " + webAppVersion);
      return;
    }
    isVerticalSwipesEnabled = !!enable_swipes;
    WebView.postEvent("web_app_setup_swipe_behavior", false, { allow_vertical_swipe: isVerticalSwipesEnabled });
  }
  var headerColorKey = "bg_color", headerColor = null;
  function getHeaderColor() {
    if (headerColorKey == "secondary_bg_color") {
      return themeParams.secondary_bg_color;
    } else if (headerColorKey == "bg_color") {
      return themeParams.bg_color;
    }
    return headerColor;
  }
  function setHeaderColor(color) {
    if (!versionAtLeast("6.1")) {
      console.warn("[Telegram.WebApp] Header color is not supported in version " + webAppVersion);
      return;
    }
    if (!versionAtLeast("6.9")) {
      if (themeParams.bg_color && themeParams.bg_color == color) {
        color = "bg_color";
      } else if (themeParams.secondary_bg_color && themeParams.secondary_bg_color == color) {
        color = "secondary_bg_color";
      }
    }
    var head_color = null, color_key = null;
    if (color == "bg_color" || color == "secondary_bg_color") {
      color_key = color;
    } else if (versionAtLeast("6.9")) {
      head_color = parseColorToHex(color);
      if (!head_color) {
        console.error("[Telegram.WebApp] Header color format is invalid", color);
        throw Error("WebAppHeaderColorInvalid");
      }
    }
    if (!versionAtLeast("6.9") && color_key != "bg_color" && color_key != "secondary_bg_color") {
      console.error("[Telegram.WebApp] Header color key should be one of Telegram.WebApp.themeParams.bg_color, Telegram.WebApp.themeParams.secondary_bg_color, 'bg_color', 'secondary_bg_color'", color);
      throw Error("WebAppHeaderColorKeyInvalid");
    }
    headerColorKey = color_key;
    headerColor = head_color;
    updateHeaderColor();
  }
  var appHeaderColorKey = null, appHeaderColor = null;
  function updateHeaderColor() {
    if (appHeaderColorKey != headerColorKey || appHeaderColor != headerColor) {
      appHeaderColorKey = headerColorKey;
      appHeaderColor = headerColor;
      if (appHeaderColor) {
        WebView.postEvent("web_app_set_header_color", false, { color: headerColor });
      } else {
        WebView.postEvent("web_app_set_header_color", false, { color_key: headerColorKey });
      }
    }
  }
  var backgroundColor = "bg_color";
  function getBackgroundColor() {
    if (backgroundColor == "secondary_bg_color") {
      return themeParams.secondary_bg_color;
    } else if (backgroundColor == "bg_color") {
      return themeParams.bg_color;
    }
    return backgroundColor;
  }
  function setBackgroundColor(color) {
    if (!versionAtLeast("6.1")) {
      console.warn("[Telegram.WebApp] Background color is not supported in version " + webAppVersion);
      return;
    }
    var bg_color;
    if (color == "bg_color" || color == "secondary_bg_color") {
      bg_color = color;
    } else {
      bg_color = parseColorToHex(color);
      if (!bg_color) {
        console.error("[Telegram.WebApp] Background color format is invalid", color);
        throw Error("WebAppBackgroundColorInvalid");
      }
    }
    backgroundColor = bg_color;
    updateBackgroundColor();
  }
  var appBackgroundColor = null;
  function updateBackgroundColor() {
    var color = getBackgroundColor();
    if (appBackgroundColor != color) {
      appBackgroundColor = color;
      WebView.postEvent("web_app_set_background_color", false, { color });
    }
  }
  var bottomBarColor = "bottom_bar_bg_color";
  function getBottomBarColor() {
    if (bottomBarColor == "bottom_bar_bg_color") {
      return themeParams.bottom_bar_bg_color || themeParams.secondary_bg_color || "#ffffff";
    } else if (bottomBarColor == "secondary_bg_color") {
      return themeParams.secondary_bg_color;
    } else if (bottomBarColor == "bg_color") {
      return themeParams.bg_color;
    }
    return bottomBarColor;
  }
  function setBottomBarColor(color) {
    if (!versionAtLeast("7.10")) {
      console.warn("[Telegram.WebApp] Bottom bar color is not supported in version " + webAppVersion);
      return;
    }
    var bg_color;
    if (color == "bg_color" || color == "secondary_bg_color" || color == "bottom_bar_bg_color") {
      bg_color = color;
    } else {
      bg_color = parseColorToHex(color);
      if (!bg_color) {
        console.error("[Telegram.WebApp] Bottom bar color format is invalid", color);
        throw Error("WebAppBottomBarColorInvalid");
      }
    }
    bottomBarColor = bg_color;
    updateBottomBarColor();
    window.Telegram.WebApp.SecondaryButton.setParams({});
  }
  var appBottomBarColor = null;
  function updateBottomBarColor() {
    var color = getBottomBarColor();
    if (appBottomBarColor != color) {
      appBottomBarColor = color;
      WebView.postEvent("web_app_set_bottom_bar_color", false, { color });
    }
    if (initParams.tgWebAppDebug) {
      updateDebugBottomBar();
    }
  }
  function parseColorToHex(color) {
    color += "";
    var match;
    if (match = /^\s*#([0-9a-f]{6})\s*$/i.exec(color)) {
      return "#" + match[1].toLowerCase();
    } else if (match = /^\s*#([0-9a-f])([0-9a-f])([0-9a-f])\s*$/i.exec(color)) {
      return ("#" + match[1] + match[1] + match[2] + match[2] + match[3] + match[3]).toLowerCase();
    } else if (match = /^\s*rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)\s*$/.exec(color)) {
      var r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
      r = (r < 16 ? "0" : "") + r.toString(16);
      g = (g < 16 ? "0" : "") + g.toString(16);
      b = (b < 16 ? "0" : "") + b.toString(16);
      return "#" + r + g + b;
    }
    return false;
  }
  function isColorDark(rgb) {
    rgb = rgb.replace(/[\s#]/g, "");
    if (rgb.length == 3) {
      rgb = rgb[0] + rgb[0] + rgb[1] + rgb[1] + rgb[2] + rgb[2];
    }
    var r = parseInt(rgb.substr(0, 2), 16);
    var g = parseInt(rgb.substr(2, 2), 16);
    var b = parseInt(rgb.substr(4, 2), 16);
    var hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp < 120;
  }
  function versionCompare(v1, v2) {
    if (typeof v1 !== "string")
      v1 = "";
    if (typeof v2 !== "string")
      v2 = "";
    v1 = v1.replace(/^\s+|\s+$/g, "").split(".");
    v2 = v2.replace(/^\s+|\s+$/g, "").split(".");
    var a = Math.max(v1.length, v2.length), i, p1, p2;
    for (i = 0; i < a; i++) {
      p1 = parseInt(v1[i]) || 0;
      p2 = parseInt(v2[i]) || 0;
      if (p1 == p2)
        continue;
      if (p1 > p2)
        return 1;
      return -1;
    }
    return 0;
  }
  function versionAtLeast(ver) {
    return versionCompare(webAppVersion, ver) >= 0;
  }
  function byteLength(str) {
    if (window.Blob) {
      try {
        return new Blob([str]).size;
      } catch (e) {
      }
    }
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);
      if (code > 127 && code <= 2047)
        s++;
      else if (code > 2047 && code <= 65535)
        s += 2;
      if (code >= 56320 && code <= 57343)
        i--;
    }
    return s;
  }
  var BackButton = function() {
    var isVisible = false;
    var backButton = {};
    Object.defineProperty(backButton, "isVisible", {
      set: function(val2) {
        setParams({ is_visible: val2 });
      },
      get: function() {
        return isVisible;
      },
      enumerable: true
    });
    var curButtonState = null;
    WebView.onEvent("back_button_pressed", onBackButtonPressed);
    function onBackButtonPressed() {
      receiveWebViewEvent("backButtonClicked");
    }
    function buttonParams() {
      return { is_visible: isVisible };
    }
    function buttonState(btn_params) {
      if (typeof btn_params === "undefined") {
        btn_params = buttonParams();
      }
      return JSON.stringify(btn_params);
    }
    function buttonCheckVersion() {
      if (!versionAtLeast("6.1")) {
        console.warn("[Telegram.WebApp] BackButton is not supported in version " + webAppVersion);
        return false;
      }
      return true;
    }
    function updateButton() {
      var btn_params = buttonParams();
      var btn_state = buttonState(btn_params);
      if (curButtonState === btn_state) {
        return;
      }
      curButtonState = btn_state;
      WebView.postEvent("web_app_setup_back_button", false, btn_params);
    }
    function setParams(params) {
      if (!buttonCheckVersion()) {
        return backButton;
      }
      if (typeof params.is_visible !== "undefined") {
        isVisible = !!params.is_visible;
      }
      updateButton();
      return backButton;
    }
    backButton.onClick = function(callback) {
      if (buttonCheckVersion()) {
        onWebViewEvent("backButtonClicked", callback);
      }
      return backButton;
    };
    backButton.offClick = function(callback) {
      if (buttonCheckVersion()) {
        offWebViewEvent("backButtonClicked", callback);
      }
      return backButton;
    };
    backButton.show = function() {
      return setParams({ is_visible: true });
    };
    backButton.hide = function() {
      return setParams({ is_visible: false });
    };
    return backButton;
  }();
  var debugBottomBar = null, debugBottomBarBtns = {}, bottomBarHeight = 0;
  if (initParams.tgWebAppDebug) {
    debugBottomBar = document.createElement("tg-bottom-bar");
    var debugBottomBarStyle = {
      display: "flex",
      gap: "7px",
      font: "600 14px/18px sans-serif",
      width: "100%",
      background: getBottomBarColor(),
      position: "fixed",
      left: "0",
      right: "0",
      bottom: "0",
      margin: "0",
      padding: "7px",
      textAlign: "center",
      boxSizing: "border-box",
      zIndex: "10000"
    };
    for (var k in debugBottomBarStyle) {
      debugBottomBar.style[k] = debugBottomBarStyle[k];
    }
    document.addEventListener("DOMContentLoaded", function onDomLoaded(event) {
      document.removeEventListener("DOMContentLoaded", onDomLoaded);
      document.body.appendChild(debugBottomBar);
    });
    var animStyle = document.createElement("style");
    animStyle.innerHTML = 'tg-bottom-button.shine { position: relative; overflow: hidden; } tg-bottom-button.shine:before { content:""; position: absolute; top: 0; width: 100%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255, 255, 255, .2), transparent); animation: tg-bottom-button-shine 5s ease-in-out infinite; } @-webkit-keyframes tg-bottom-button-shine { 0% {left: -100%;} 12%,100% {left: 100%}} @keyframes tg-bottom-button-shine { 0% {left: -100%;} 12%,100% {left: 100%}}';
    debugBottomBar.appendChild(animStyle);
  }
  function updateDebugBottomBar() {
    var mainBtn = debugBottomBarBtns.main._bottomButton;
    var secondaryBtn = debugBottomBarBtns.secondary._bottomButton;
    if (mainBtn.isVisible || secondaryBtn.isVisible) {
      debugBottomBar.style.display = "flex";
      bottomBarHeight = 58;
      if (mainBtn.isVisible && secondaryBtn.isVisible) {
        if (secondaryBtn.position == "top") {
          debugBottomBar.style.flexDirection = "column-reverse";
          bottomBarHeight += 51;
        } else if (secondaryBtn.position == "bottom") {
          debugBottomBar.style.flexDirection = "column";
          bottomBarHeight += 51;
        } else if (secondaryBtn.position == "left") {
          debugBottomBar.style.flexDirection = "row-reverse";
        } else if (secondaryBtn.position == "right") {
          debugBottomBar.style.flexDirection = "row";
        }
      }
    } else {
      debugBottomBar.style.display = "none";
      bottomBarHeight = 0;
    }
    debugBottomBar.style.background = getBottomBarColor();
    if (document.documentElement) {
      document.documentElement.style.boxSizing = "border-box";
      document.documentElement.style.paddingBottom = bottomBarHeight + "px";
    }
    setViewportHeight();
  }
  var BottomButtonConstructor = function(type) {
    var isMainButton = type == "main";
    if (isMainButton) {
      var setupFnName = "web_app_setup_main_button";
      var tgEventName = "main_button_pressed";
      var webViewEventName = "mainButtonClicked";
      var buttonTextDefault = "Continue";
      var buttonColorDefault = function() {
        return themeParams.button_color || "#2481cc";
      };
      var buttonTextColorDefault = function() {
        return themeParams.button_text_color || "#ffffff";
      };
    } else {
      var setupFnName = "web_app_setup_secondary_button";
      var tgEventName = "secondary_button_pressed";
      var webViewEventName = "secondaryButtonClicked";
      var buttonTextDefault = "Cancel";
      var buttonColorDefault = function() {
        return getBottomBarColor();
      };
      var buttonTextColorDefault = function() {
        return themeParams.button_color || "#2481cc";
      };
    }
    var isVisible = false;
    var isActive = true;
    var hasShineEffect = false;
    var isProgressVisible = false;
    var buttonType = type;
    var buttonText = buttonTextDefault;
    var buttonColor = false;
    var buttonTextColor = false;
    var buttonPosition = "left";
    var bottomButton = {};
    Object.defineProperty(bottomButton, "type", {
      get: function() {
        return buttonType;
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "text", {
      set: function(val2) {
        bottomButton.setParams({ text: val2 });
      },
      get: function() {
        return buttonText;
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "color", {
      set: function(val2) {
        bottomButton.setParams({ color: val2 });
      },
      get: function() {
        return buttonColor || buttonColorDefault();
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "textColor", {
      set: function(val2) {
        bottomButton.setParams({ text_color: val2 });
      },
      get: function() {
        return buttonTextColor || buttonTextColorDefault();
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "isVisible", {
      set: function(val2) {
        bottomButton.setParams({ is_visible: val2 });
      },
      get: function() {
        return isVisible;
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "isProgressVisible", {
      get: function() {
        return isProgressVisible;
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "isActive", {
      set: function(val2) {
        bottomButton.setParams({ is_active: val2 });
      },
      get: function() {
        return isActive;
      },
      enumerable: true
    });
    Object.defineProperty(bottomButton, "hasShineEffect", {
      set: function(val2) {
        bottomButton.setParams({ has_shine_effect: val2 });
      },
      get: function() {
        return hasShineEffect;
      },
      enumerable: true
    });
    if (!isMainButton) {
      Object.defineProperty(bottomButton, "position", {
        set: function(val2) {
          bottomButton.setParams({ position: val2 });
        },
        get: function() {
          return buttonPosition;
        },
        enumerable: true
      });
    }
    var curButtonState = null;
    WebView.onEvent(tgEventName, onBottomButtonPressed);
    var debugBtn = null;
    if (initParams.tgWebAppDebug) {
      debugBtn = document.createElement("tg-bottom-button");
      var debugBtnStyle = {
        display: "none",
        width: "100%",
        height: "44px",
        borderRadius: "0",
        background: "no-repeat right center",
        padding: "13px 15px",
        textAlign: "center",
        boxSizing: "border-box"
      };
      for (var k2 in debugBtnStyle) {
        debugBtn.style[k2] = debugBtnStyle[k2];
      }
      debugBottomBar.appendChild(debugBtn);
      debugBtn.addEventListener("click", onBottomButtonPressed, false);
      debugBtn._bottomButton = bottomButton;
      debugBottomBarBtns[type] = debugBtn;
    }
    function onBottomButtonPressed() {
      if (isActive) {
        receiveWebViewEvent(webViewEventName);
      }
    }
    function buttonParams() {
      var color = bottomButton.color;
      var text_color = bottomButton.textColor;
      if (isVisible) {
        var params = {
          is_visible: true,
          is_active: isActive,
          is_progress_visible: isProgressVisible,
          text: buttonText,
          color,
          text_color,
          has_shine_effect: hasShineEffect && isActive && !isProgressVisible
        };
        if (!isMainButton) {
          params.position = buttonPosition;
        }
      } else {
        var params = {
          is_visible: false
        };
      }
      return params;
    }
    function buttonState(btn_params) {
      if (typeof btn_params === "undefined") {
        btn_params = buttonParams();
      }
      return JSON.stringify(btn_params);
    }
    function updateButton() {
      var btn_params = buttonParams();
      var btn_state = buttonState(btn_params);
      if (curButtonState === btn_state) {
        return;
      }
      curButtonState = btn_state;
      WebView.postEvent(setupFnName, false, btn_params);
      if (initParams.tgWebAppDebug) {
        updateDebugButton(btn_params);
      }
    }
    function updateDebugButton(btn_params) {
      if (btn_params.is_visible) {
        debugBtn.style.display = "block";
        debugBtn.style.opacity = btn_params.is_active ? "1" : "0.8";
        debugBtn.style.cursor = btn_params.is_active ? "pointer" : "auto";
        debugBtn.disabled = !btn_params.is_active;
        debugBtn.innerText = btn_params.text;
        debugBtn.className = btn_params.has_shine_effect ? "shine" : "";
        debugBtn.style.backgroundImage = btn_params.is_progress_visible ? "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewport="0 0 48 48" width="48px" height="48px"><circle cx="50%" cy="50%" stroke="' + btn_params.text_color + '" stroke-width="2.25" stroke-linecap="round" fill="none" stroke-dashoffset="106" r="9" stroke-dasharray="56.52" rotate="-90"><animate attributeName="stroke-dashoffset" attributeType="XML" dur="360s" from="0" to="12500" repeatCount="indefinite"></animate><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="-90 24 24" to="630 24 24" repeatCount="indefinite"></animateTransform></circle></svg>') + "')" : "none";
        debugBtn.style.backgroundColor = btn_params.color;
        debugBtn.style.color = btn_params.text_color;
      } else {
        debugBtn.style.display = "none";
      }
      updateDebugBottomBar();
    }
    function setParams(params) {
      if (typeof params.text !== "undefined") {
        var text = strTrim(params.text);
        if (!text.length) {
          console.error("[Telegram.WebApp] Bottom button text is required", params.text);
          throw Error("WebAppBottomButtonParamInvalid");
        }
        if (text.length > 64) {
          console.error("[Telegram.WebApp] Bottom button text is too long", text);
          throw Error("WebAppBottomButtonParamInvalid");
        }
        buttonText = text;
      }
      if (typeof params.color !== "undefined") {
        if (params.color === false || params.color === null) {
          buttonColor = false;
        } else {
          var color = parseColorToHex(params.color);
          if (!color) {
            console.error("[Telegram.WebApp] Bottom button color format is invalid", params.color);
            throw Error("WebAppBottomButtonParamInvalid");
          }
          buttonColor = color;
        }
      }
      if (typeof params.text_color !== "undefined") {
        if (params.text_color === false || params.text_color === null) {
          buttonTextColor = false;
        } else {
          var text_color = parseColorToHex(params.text_color);
          if (!text_color) {
            console.error("[Telegram.WebApp] Bottom button text color format is invalid", params.text_color);
            throw Error("WebAppBottomButtonParamInvalid");
          }
          buttonTextColor = text_color;
        }
      }
      if (typeof params.is_visible !== "undefined") {
        if (params.is_visible && !bottomButton.text.length) {
          console.error("[Telegram.WebApp] Bottom button text is required");
          throw Error("WebAppBottomButtonParamInvalid");
        }
        isVisible = !!params.is_visible;
      }
      if (typeof params.has_shine_effect !== "undefined") {
        hasShineEffect = !!params.has_shine_effect;
      }
      if (!isMainButton && typeof params.position !== "undefined") {
        if (params.position != "left" && params.position != "right" && params.position != "top" && params.position != "bottom") {
          console.error("[Telegram.WebApp] Bottom button posiition is invalid", params.position);
          throw Error("WebAppBottomButtonParamInvalid");
        }
        buttonPosition = params.position;
      }
      if (typeof params.is_active !== "undefined") {
        isActive = !!params.is_active;
      }
      updateButton();
      return bottomButton;
    }
    bottomButton.setText = function(text) {
      return bottomButton.setParams({ text });
    };
    bottomButton.onClick = function(callback) {
      onWebViewEvent(webViewEventName, callback);
      return bottomButton;
    };
    bottomButton.offClick = function(callback) {
      offWebViewEvent(webViewEventName, callback);
      return bottomButton;
    };
    bottomButton.show = function() {
      return bottomButton.setParams({ is_visible: true });
    };
    bottomButton.hide = function() {
      return bottomButton.setParams({ is_visible: false });
    };
    bottomButton.enable = function() {
      return bottomButton.setParams({ is_active: true });
    };
    bottomButton.disable = function() {
      return bottomButton.setParams({ is_active: false });
    };
    bottomButton.showProgress = function(leaveActive) {
      isActive = !!leaveActive;
      isProgressVisible = true;
      updateButton();
      return bottomButton;
    };
    bottomButton.hideProgress = function() {
      if (!bottomButton.isActive) {
        isActive = true;
      }
      isProgressVisible = false;
      updateButton();
      return bottomButton;
    };
    bottomButton.setParams = setParams;
    return bottomButton;
  };
  var MainButton = BottomButtonConstructor("main");
  var SecondaryButton = BottomButtonConstructor("secondary");
  var SettingsButton = function() {
    var isVisible = false;
    var settingsButton = {};
    Object.defineProperty(settingsButton, "isVisible", {
      set: function(val2) {
        setParams({ is_visible: val2 });
      },
      get: function() {
        return isVisible;
      },
      enumerable: true
    });
    var curButtonState = null;
    WebView.onEvent("settings_button_pressed", onSettingsButtonPressed);
    function onSettingsButtonPressed() {
      receiveWebViewEvent("settingsButtonClicked");
    }
    function buttonParams() {
      return { is_visible: isVisible };
    }
    function buttonState(btn_params) {
      if (typeof btn_params === "undefined") {
        btn_params = buttonParams();
      }
      return JSON.stringify(btn_params);
    }
    function buttonCheckVersion() {
      if (!versionAtLeast("6.10")) {
        console.warn("[Telegram.WebApp] SettingsButton is not supported in version " + webAppVersion);
        return false;
      }
      return true;
    }
    function updateButton() {
      var btn_params = buttonParams();
      var btn_state = buttonState(btn_params);
      if (curButtonState === btn_state) {
        return;
      }
      curButtonState = btn_state;
      WebView.postEvent("web_app_setup_settings_button", false, btn_params);
    }
    function setParams(params) {
      if (!buttonCheckVersion()) {
        return settingsButton;
      }
      if (typeof params.is_visible !== "undefined") {
        isVisible = !!params.is_visible;
      }
      updateButton();
      return settingsButton;
    }
    settingsButton.onClick = function(callback) {
      if (buttonCheckVersion()) {
        onWebViewEvent("settingsButtonClicked", callback);
      }
      return settingsButton;
    };
    settingsButton.offClick = function(callback) {
      if (buttonCheckVersion()) {
        offWebViewEvent("settingsButtonClicked", callback);
      }
      return settingsButton;
    };
    settingsButton.show = function() {
      return setParams({ is_visible: true });
    };
    settingsButton.hide = function() {
      return setParams({ is_visible: false });
    };
    return settingsButton;
  }();
  var HapticFeedback = function() {
    var hapticFeedback = {};
    function triggerFeedback(params) {
      if (!versionAtLeast("6.1")) {
        console.warn("[Telegram.WebApp] HapticFeedback is not supported in version " + webAppVersion);
        return hapticFeedback;
      }
      if (params.type == "impact") {
        if (params.impact_style != "light" && params.impact_style != "medium" && params.impact_style != "heavy" && params.impact_style != "rigid" && params.impact_style != "soft") {
          console.error("[Telegram.WebApp] Haptic impact style is invalid", params.impact_style);
          throw Error("WebAppHapticImpactStyleInvalid");
        }
      } else if (params.type == "notification") {
        if (params.notification_type != "error" && params.notification_type != "success" && params.notification_type != "warning") {
          console.error("[Telegram.WebApp] Haptic notification type is invalid", params.notification_type);
          throw Error("WebAppHapticNotificationTypeInvalid");
        }
      } else if (params.type == "selection_change") ;
      else {
        console.error("[Telegram.WebApp] Haptic feedback type is invalid", params.type);
        throw Error("WebAppHapticFeedbackTypeInvalid");
      }
      WebView.postEvent("web_app_trigger_haptic_feedback", false, params);
      return hapticFeedback;
    }
    hapticFeedback.impactOccurred = function(style) {
      return triggerFeedback({ type: "impact", impact_style: style });
    };
    hapticFeedback.notificationOccurred = function(type) {
      return triggerFeedback({ type: "notification", notification_type: type });
    };
    hapticFeedback.selectionChanged = function() {
      return triggerFeedback({ type: "selection_change" });
    };
    return hapticFeedback;
  }();
  var CloudStorage = function() {
    var cloudStorage = {};
    function invokeStorageMethod(method, params, callback) {
      if (!versionAtLeast("6.9")) {
        console.error("[Telegram.WebApp] CloudStorage is not supported in version " + webAppVersion);
        throw Error("WebAppMethodUnsupported");
      }
      invokeCustomMethod(method, params, callback);
      return cloudStorage;
    }
    cloudStorage.setItem = function(key2, value, callback) {
      return invokeStorageMethod("saveStorageValue", { key: key2, value }, callback);
    };
    cloudStorage.getItem = function(key2, callback) {
      return cloudStorage.getItems([key2], callback ? function(err, res) {
        if (err)
          callback(err);
        else
          callback(null, res[key2]);
      } : null);
    };
    cloudStorage.getItems = function(keys, callback) {
      return invokeStorageMethod("getStorageValues", { keys }, callback);
    };
    cloudStorage.removeItem = function(key2, callback) {
      return cloudStorage.removeItems([key2], callback);
    };
    cloudStorage.removeItems = function(keys, callback) {
      return invokeStorageMethod("deleteStorageValues", { keys }, callback);
    };
    cloudStorage.getKeys = function(callback) {
      return invokeStorageMethod("getStorageKeys", {}, callback);
    };
    return cloudStorage;
  }();
  var BiometricManager = function() {
    var isInited = false;
    var isBiometricAvailable = false;
    var biometricType = "unknown";
    var isAccessRequested = false;
    var isAccessGranted = false;
    var isBiometricTokenSaved = false;
    var deviceId = "";
    var biometricManager = {};
    Object.defineProperty(biometricManager, "isInited", {
      get: function() {
        return isInited;
      },
      enumerable: true
    });
    Object.defineProperty(biometricManager, "isBiometricAvailable", {
      get: function() {
        return isInited && isBiometricAvailable;
      },
      enumerable: true
    });
    Object.defineProperty(biometricManager, "biometricType", {
      get: function() {
        return biometricType || "unknown";
      },
      enumerable: true
    });
    Object.defineProperty(biometricManager, "isAccessRequested", {
      get: function() {
        return isAccessRequested;
      },
      enumerable: true
    });
    Object.defineProperty(biometricManager, "isAccessGranted", {
      get: function() {
        return isAccessRequested && isAccessGranted;
      },
      enumerable: true
    });
    Object.defineProperty(biometricManager, "isBiometricTokenSaved", {
      get: function() {
        return isBiometricTokenSaved;
      },
      enumerable: true
    });
    Object.defineProperty(biometricManager, "deviceId", {
      get: function() {
        return deviceId || "";
      },
      enumerable: true
    });
    var initRequestState = { callbacks: [] };
    var accessRequestState = false;
    var authRequestState = false;
    var tokenRequestState = false;
    WebView.onEvent("biometry_info_received", onBiometryInfoReceived);
    WebView.onEvent("biometry_auth_requested", onBiometryAuthRequested);
    WebView.onEvent("biometry_token_updated", onBiometryTokenUpdated);
    function onBiometryInfoReceived(eventType, eventData) {
      isInited = true;
      if (eventData.available) {
        isBiometricAvailable = true;
        biometricType = eventData.type || "unknown";
        if (eventData.access_requested) {
          isAccessRequested = true;
          isAccessGranted = !!eventData.access_granted;
          isBiometricTokenSaved = !!eventData.token_saved;
        } else {
          isAccessRequested = false;
          isAccessGranted = false;
          isBiometricTokenSaved = false;
        }
      } else {
        isBiometricAvailable = false;
        biometricType = "unknown";
        isAccessRequested = false;
        isAccessGranted = false;
        isBiometricTokenSaved = false;
      }
      deviceId = eventData.device_id || "";
      if (initRequestState.callbacks.length > 0) {
        for (var i = 0; i < initRequestState.callbacks.length; i++) {
          var callback = initRequestState.callbacks[i];
          callback();
        }
      }
      if (accessRequestState) {
        var state = accessRequestState;
        accessRequestState = false;
        if (state.callback) {
          state.callback(isAccessGranted);
        }
      }
      receiveWebViewEvent("biometricManagerUpdated");
    }
    function onBiometryAuthRequested(eventType, eventData) {
      var isAuthenticated = eventData.status == "authorized", biometricToken = eventData.token || "";
      if (authRequestState) {
        var state = authRequestState;
        authRequestState = false;
        if (state.callback) {
          state.callback(isAuthenticated, isAuthenticated ? biometricToken : null);
        }
      }
      receiveWebViewEvent("biometricAuthRequested", isAuthenticated ? {
        isAuthenticated: true,
        biometricToken
      } : {
        isAuthenticated: false
      });
    }
    function onBiometryTokenUpdated(eventType, eventData) {
      var applied = false;
      if (isBiometricAvailable && isAccessRequested) {
        if (eventData.status == "updated") {
          isBiometricTokenSaved = true;
          applied = true;
        } else if (eventData.status == "removed") {
          isBiometricTokenSaved = false;
          applied = true;
        }
      }
      if (tokenRequestState) {
        var state = tokenRequestState;
        tokenRequestState = false;
        if (state.callback) {
          state.callback(applied);
        }
      }
      receiveWebViewEvent("biometricTokenUpdated", {
        isUpdated: applied
      });
    }
    function checkVersion() {
      if (!versionAtLeast("7.2")) {
        console.warn("[Telegram.WebApp] BiometricManager is not supported in version " + webAppVersion);
        return false;
      }
      return true;
    }
    function checkInit() {
      if (!isInited) {
        console.error("[Telegram.WebApp] BiometricManager should be inited before using.");
        throw Error("WebAppBiometricManagerNotInited");
      }
      return true;
    }
    biometricManager.init = function(callback) {
      if (!checkVersion()) {
        return biometricManager;
      }
      if (isInited) {
        return biometricManager;
      }
      if (callback) {
        initRequestState.callbacks.push(callback);
      }
      WebView.postEvent("web_app_biometry_get_info", false);
      return biometricManager;
    };
    biometricManager.requestAccess = function(params, callback) {
      if (!checkVersion()) {
        return biometricManager;
      }
      checkInit();
      if (!isBiometricAvailable) {
        console.error("[Telegram.WebApp] Biometrics is not available on this device.");
        throw Error("WebAppBiometricManagerBiometricsNotAvailable");
      }
      if (accessRequestState) {
        console.error("[Telegram.WebApp] Access is already requested");
        throw Error("WebAppBiometricManagerAccessRequested");
      }
      var popup_params = {};
      if (typeof params.reason !== "undefined") {
        var reason = strTrim(params.reason);
        if (reason.length > 128) {
          console.error("[Telegram.WebApp] Biometric reason is too long", reason);
          throw Error("WebAppBiometricRequestAccessParamInvalid");
        }
        if (reason.length > 0) {
          popup_params.reason = reason;
        }
      }
      accessRequestState = {
        callback
      };
      WebView.postEvent("web_app_biometry_request_access", false, popup_params);
      return biometricManager;
    };
    biometricManager.authenticate = function(params, callback) {
      if (!checkVersion()) {
        return biometricManager;
      }
      checkInit();
      if (!isBiometricAvailable) {
        console.error("[Telegram.WebApp] Biometrics is not available on this device.");
        throw Error("WebAppBiometricManagerBiometricsNotAvailable");
      }
      if (!isAccessGranted) {
        console.error("[Telegram.WebApp] Biometric access was not granted by the user.");
        throw Error("WebAppBiometricManagerBiometricAccessNotGranted");
      }
      if (authRequestState) {
        console.error("[Telegram.WebApp] Authentication request is already in progress.");
        throw Error("WebAppBiometricManagerAuthenticationRequested");
      }
      var popup_params = {};
      if (typeof params.reason !== "undefined") {
        var reason = strTrim(params.reason);
        if (reason.length > 128) {
          console.error("[Telegram.WebApp] Biometric reason is too long", reason);
          throw Error("WebAppBiometricRequestAccessParamInvalid");
        }
        if (reason.length > 0) {
          popup_params.reason = reason;
        }
      }
      authRequestState = {
        callback
      };
      WebView.postEvent("web_app_biometry_request_auth", false, popup_params);
      return biometricManager;
    };
    biometricManager.updateBiometricToken = function(token, callback) {
      if (!checkVersion()) {
        return biometricManager;
      }
      token = token || "";
      if (token.length > 1024) {
        console.error("[Telegram.WebApp] Token is too long", token);
        throw Error("WebAppBiometricManagerTokenInvalid");
      }
      checkInit();
      if (!isBiometricAvailable) {
        console.error("[Telegram.WebApp] Biometrics is not available on this device.");
        throw Error("WebAppBiometricManagerBiometricsNotAvailable");
      }
      if (!isAccessGranted) {
        console.error("[Telegram.WebApp] Biometric access was not granted by the user.");
        throw Error("WebAppBiometricManagerBiometricAccessNotGranted");
      }
      if (tokenRequestState) {
        console.error("[Telegram.WebApp] Token request is already in progress.");
        throw Error("WebAppBiometricManagerTokenUpdateRequested");
      }
      tokenRequestState = {
        callback
      };
      WebView.postEvent("web_app_biometry_update_token", false, { token });
      return biometricManager;
    };
    biometricManager.openSettings = function() {
      if (!checkVersion()) {
        return biometricManager;
      }
      checkInit();
      if (!isBiometricAvailable) {
        console.error("[Telegram.WebApp] Biometrics is not available on this device.");
        throw Error("WebAppBiometricManagerBiometricsNotAvailable");
      }
      if (!isAccessRequested) {
        console.error("[Telegram.WebApp] Biometric access was not requested yet.");
        throw Error("WebAppBiometricManagerBiometricsAccessNotRequested");
      }
      if (isAccessGranted) {
        console.warn("[Telegram.WebApp] Biometric access was granted by the user, no need to go to settings.");
        return biometricManager;
      }
      WebView.postEvent("web_app_biometry_open_settings", false);
      return biometricManager;
    };
    return biometricManager;
  }();
  var webAppInvoices = {};
  function onInvoiceClosed(eventType, eventData) {
    if (eventData.slug && webAppInvoices[eventData.slug]) {
      var invoiceData = webAppInvoices[eventData.slug];
      delete webAppInvoices[eventData.slug];
      if (invoiceData.callback) {
        invoiceData.callback(eventData.status);
      }
      receiveWebViewEvent("invoiceClosed", {
        url: invoiceData.url,
        status: eventData.status
      });
    }
  }
  var webAppPopupOpened = false;
  function onPopupClosed(eventType, eventData) {
    if (webAppPopupOpened) {
      var popupData = webAppPopupOpened;
      webAppPopupOpened = false;
      var button_id = null;
      if (typeof eventData.button_id !== "undefined") {
        button_id = eventData.button_id;
      }
      if (popupData.callback) {
        popupData.callback(button_id);
      }
      receiveWebViewEvent("popupClosed", {
        button_id
      });
    }
  }
  var webAppScanQrPopupOpened = false;
  function onQrTextReceived(eventType, eventData) {
    if (webAppScanQrPopupOpened) {
      var popupData = webAppScanQrPopupOpened;
      var data = null;
      if (typeof eventData.data !== "undefined") {
        data = eventData.data;
      }
      if (popupData.callback) {
        if (popupData.callback(data)) {
          webAppScanQrPopupOpened = false;
          WebView.postEvent("web_app_close_scan_qr_popup", false);
        }
      }
      receiveWebViewEvent("qrTextReceived", {
        data
      });
    }
  }
  function onScanQrPopupClosed(eventType, eventData) {
    webAppScanQrPopupOpened = false;
    receiveWebViewEvent("scanQrPopupClosed");
  }
  function onClipboardTextReceived(eventType, eventData) {
    if (eventData.req_id && webAppCallbacks[eventData.req_id]) {
      var requestData = webAppCallbacks[eventData.req_id];
      delete webAppCallbacks[eventData.req_id];
      var data = null;
      if (typeof eventData.data !== "undefined") {
        data = eventData.data;
      }
      if (requestData.callback) {
        requestData.callback(data);
      }
      receiveWebViewEvent("clipboardTextReceived", {
        data
      });
    }
  }
  var WebAppWriteAccessRequested = false;
  function onWriteAccessRequested(eventType, eventData) {
    if (WebAppWriteAccessRequested) {
      var requestData = WebAppWriteAccessRequested;
      WebAppWriteAccessRequested = false;
      if (requestData.callback) {
        requestData.callback(eventData.status == "allowed");
      }
      receiveWebViewEvent("writeAccessRequested", {
        status: eventData.status
      });
    }
  }
  function getRequestedContact(callback, timeout) {
    var reqTo, fallbackTo, reqDelay = 0;
    var reqInvoke = function() {
      invokeCustomMethod("getRequestedContact", {}, function(err, res) {
        if (res && res.length) {
          clearTimeout(fallbackTo);
          callback(res);
        } else {
          reqDelay += 50;
          reqTo = setTimeout(reqInvoke, reqDelay);
        }
      });
    };
    var fallbackInvoke = function() {
      clearTimeout(reqTo);
      callback("");
    };
    fallbackTo = setTimeout(fallbackInvoke, timeout);
    reqInvoke();
  }
  var WebAppContactRequested = false;
  function onPhoneRequested(eventType, eventData) {
    if (WebAppContactRequested) {
      var requestData = WebAppContactRequested;
      WebAppContactRequested = false;
      var requestSent = eventData.status == "sent";
      var webViewEvent = {
        status: eventData.status
      };
      if (requestSent) {
        getRequestedContact(function(res) {
          if (res && res.length) {
            webViewEvent.response = res;
            webViewEvent.responseUnsafe = Utils.urlParseQueryString(res);
            for (var key2 in webViewEvent.responseUnsafe) {
              var val2 = webViewEvent.responseUnsafe[key2];
              try {
                if (val2.substr(0, 1) == "{" && val2.substr(-1) == "}" || val2.substr(0, 1) == "[" && val2.substr(-1) == "]") {
                  webViewEvent.responseUnsafe[key2] = JSON.parse(val2);
                }
              } catch (e) {
              }
            }
          }
          if (requestData.callback) {
            requestData.callback(requestSent, webViewEvent);
          }
          receiveWebViewEvent("contactRequested", webViewEvent);
        }, 3e3);
      } else {
        if (requestData.callback) {
          requestData.callback(requestSent, webViewEvent);
        }
        receiveWebViewEvent("contactRequested", webViewEvent);
      }
    }
  }
  function onCustomMethodInvoked(eventType, eventData) {
    if (eventData.req_id && webAppCallbacks[eventData.req_id]) {
      var requestData = webAppCallbacks[eventData.req_id];
      delete webAppCallbacks[eventData.req_id];
      var res = null, err = null;
      if (typeof eventData.result !== "undefined") {
        res = eventData.result;
      }
      if (typeof eventData.error !== "undefined") {
        err = eventData.error;
      }
      if (requestData.callback) {
        requestData.callback(err, res);
      }
    }
  }
  function invokeCustomMethod(method, params, callback) {
    if (!versionAtLeast("6.9")) {
      console.error("[Telegram.WebApp] Method invokeCustomMethod is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    var req_id = generateCallbackId(16);
    var req_params = { req_id, method, params: params || {} };
    webAppCallbacks[req_id] = {
      callback
    };
    WebView.postEvent("web_app_invoke_custom_method", false, req_params);
  }
  if (!window.Telegram) {
    window.Telegram = {};
  }
  Object.defineProperty(WebApp, "initData", {
    get: function() {
      return webAppInitData;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "initDataUnsafe", {
    get: function() {
      return webAppInitDataUnsafe;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "version", {
    get: function() {
      return webAppVersion;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "platform", {
    get: function() {
      return webAppPlatform;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "colorScheme", {
    get: function() {
      return colorScheme;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "themeParams", {
    get: function() {
      return themeParams;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "isExpanded", {
    get: function() {
      return isExpanded;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "viewportHeight", {
    get: function() {
      return (viewportHeight === false ? window.innerHeight : viewportHeight) - bottomBarHeight;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "viewportStableHeight", {
    get: function() {
      return (viewportStableHeight === false ? window.innerHeight : viewportStableHeight) - bottomBarHeight;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "isClosingConfirmationEnabled", {
    set: function(val2) {
      setClosingConfirmation(val2);
    },
    get: function() {
      return isClosingConfirmationEnabled;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "isVerticalSwipesEnabled", {
    set: function(val2) {
      toggleVerticalSwipes(val2);
    },
    get: function() {
      return isVerticalSwipesEnabled;
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "headerColor", {
    set: function(val2) {
      setHeaderColor(val2);
    },
    get: function() {
      return getHeaderColor();
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "backgroundColor", {
    set: function(val2) {
      setBackgroundColor(val2);
    },
    get: function() {
      return getBackgroundColor();
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "bottomBarColor", {
    set: function(val2) {
      setBottomBarColor(val2);
    },
    get: function() {
      return getBottomBarColor();
    },
    enumerable: true
  });
  Object.defineProperty(WebApp, "BackButton", {
    value: BackButton,
    enumerable: true
  });
  Object.defineProperty(WebApp, "MainButton", {
    value: MainButton,
    enumerable: true
  });
  Object.defineProperty(WebApp, "SecondaryButton", {
    value: SecondaryButton,
    enumerable: true
  });
  Object.defineProperty(WebApp, "SettingsButton", {
    value: SettingsButton,
    enumerable: true
  });
  Object.defineProperty(WebApp, "HapticFeedback", {
    value: HapticFeedback,
    enumerable: true
  });
  Object.defineProperty(WebApp, "CloudStorage", {
    value: CloudStorage,
    enumerable: true
  });
  Object.defineProperty(WebApp, "BiometricManager", {
    value: BiometricManager,
    enumerable: true
  });
  WebApp.setHeaderColor = function(color_key) {
    WebApp.headerColor = color_key;
  };
  WebApp.setBackgroundColor = function(color) {
    WebApp.backgroundColor = color;
  };
  WebApp.setBottomBarColor = function(color) {
    WebApp.bottomBarColor = color;
  };
  WebApp.enableClosingConfirmation = function() {
    WebApp.isClosingConfirmationEnabled = true;
  };
  WebApp.disableClosingConfirmation = function() {
    WebApp.isClosingConfirmationEnabled = false;
  };
  WebApp.enableVerticalSwipes = function() {
    WebApp.isVerticalSwipesEnabled = true;
  };
  WebApp.disableVerticalSwipes = function() {
    WebApp.isVerticalSwipesEnabled = false;
  };
  WebApp.isVersionAtLeast = function(ver) {
    return versionAtLeast(ver);
  };
  WebApp.onEvent = function(eventType, callback) {
    onWebViewEvent(eventType, callback);
  };
  WebApp.offEvent = function(eventType, callback) {
    offWebViewEvent(eventType, callback);
  };
  WebApp.sendData = function(data) {
    if (!data || !data.length) {
      console.error("[Telegram.WebApp] Data is required", data);
      throw Error("WebAppDataInvalid");
    }
    if (byteLength(data) > 4096) {
      console.error("[Telegram.WebApp] Data is too long", data);
      throw Error("WebAppDataInvalid");
    }
    WebView.postEvent("web_app_data_send", false, { data });
  };
  WebApp.switchInlineQuery = function(query, choose_chat_types) {
    if (!versionAtLeast("6.6")) {
      console.error("[Telegram.WebApp] Method switchInlineQuery is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    if (!initParams.tgWebAppBotInline) {
      console.error("[Telegram.WebApp] Inline mode is disabled for this bot. Read more about inline mode: https://core.telegram.org/bots/inline");
      throw Error("WebAppInlineModeDisabled");
    }
    query = query || "";
    if (query.length > 256) {
      console.error("[Telegram.WebApp] Inline query is too long", query);
      throw Error("WebAppInlineQueryInvalid");
    }
    var chat_types = [];
    if (choose_chat_types) {
      if (!Array.isArray(choose_chat_types)) {
        console.error("[Telegram.WebApp] Choose chat types should be an array", choose_chat_types);
        throw Error("WebAppInlineChooseChatTypesInvalid");
      }
      var good_types = { users: 1, bots: 1, groups: 1, channels: 1 };
      for (var i = 0; i < choose_chat_types.length; i++) {
        var chat_type = choose_chat_types[i];
        if (!good_types[chat_type]) {
          console.error("[Telegram.WebApp] Choose chat type is invalid", chat_type);
          throw Error("WebAppInlineChooseChatTypeInvalid");
        }
        if (good_types[chat_type] != 2) {
          good_types[chat_type] = 2;
          chat_types.push(chat_type);
        }
      }
    }
    WebView.postEvent("web_app_switch_inline_query", false, { query, chat_types });
  };
  WebApp.openLink = function(url2, options) {
    var a = document.createElement("A");
    a.href = url2;
    if (a.protocol != "http:" && a.protocol != "https:") {
      console.error("[Telegram.WebApp] Url protocol is not supported", url2);
      throw Error("WebAppTgUrlInvalid");
    }
    var url2 = a.href;
    options = options || {};
    if (versionAtLeast("6.1")) {
      var req_params = { url: url2 };
      if (versionAtLeast("6.4") && options.try_instant_view) {
        req_params.try_instant_view = true;
      }
      if (versionAtLeast("7.6") && options.try_browser) {
        req_params.try_browser = options.try_browser;
      }
      WebView.postEvent("web_app_open_link", false, req_params);
    } else {
      window.open(url2, "_blank");
    }
  };
  WebApp.openTelegramLink = function(url2) {
    var a = document.createElement("A");
    a.href = url2;
    if (a.protocol != "http:" && a.protocol != "https:") {
      console.error("[Telegram.WebApp] Url protocol is not supported", url2);
      throw Error("WebAppTgUrlInvalid");
    }
    if (a.hostname != "t.me") {
      console.error("[Telegram.WebApp] Url host is not supported", url2);
      throw Error("WebAppTgUrlInvalid");
    }
    var path_full = a.pathname + a.search;
    if (isIframe || versionAtLeast("6.1")) {
      WebView.postEvent("web_app_open_tg_link", false, { path_full });
    } else {
      location.href = "https://t.me" + path_full;
    }
  };
  WebApp.openInvoice = function(url2, callback) {
    var a = document.createElement("A"), match, slug;
    a.href = url2;
    if (a.protocol != "http:" && a.protocol != "https:" || a.hostname != "t.me" || !(match = a.pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/)) || !(slug = match[2])) {
      console.error("[Telegram.WebApp] Invoice url is invalid", url2);
      throw Error("WebAppInvoiceUrlInvalid");
    }
    if (!versionAtLeast("6.1")) {
      console.error("[Telegram.WebApp] Method openInvoice is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    if (webAppInvoices[slug]) {
      console.error("[Telegram.WebApp] Invoice is already opened");
      throw Error("WebAppInvoiceOpened");
    }
    webAppInvoices[slug] = {
      url: url2,
      callback
    };
    WebView.postEvent("web_app_open_invoice", false, { slug });
  };
  WebApp.showPopup = function(params, callback) {
    if (!versionAtLeast("6.2")) {
      console.error("[Telegram.WebApp] Method showPopup is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    if (webAppPopupOpened) {
      console.error("[Telegram.WebApp] Popup is already opened");
      throw Error("WebAppPopupOpened");
    }
    var title = "";
    var message = "";
    var buttons = [];
    var popup_params = {};
    if (typeof params.title !== "undefined") {
      title = strTrim(params.title);
      if (title.length > 64) {
        console.error("[Telegram.WebApp] Popup title is too long", title);
        throw Error("WebAppPopupParamInvalid");
      }
      if (title.length > 0) {
        popup_params.title = title;
      }
    }
    if (typeof params.message !== "undefined") {
      message = strTrim(params.message);
    }
    if (!message.length) {
      console.error("[Telegram.WebApp] Popup message is required", params.message);
      throw Error("WebAppPopupParamInvalid");
    }
    if (message.length > 256) {
      console.error("[Telegram.WebApp] Popup message is too long", message);
      throw Error("WebAppPopupParamInvalid");
    }
    popup_params.message = message;
    if (typeof params.buttons !== "undefined") {
      if (!Array.isArray(params.buttons)) {
        console.error("[Telegram.WebApp] Popup buttons should be an array", params.buttons);
        throw Error("WebAppPopupParamInvalid");
      }
      for (var i = 0; i < params.buttons.length; i++) {
        var button = params.buttons[i];
        var btn = {};
        var id = "";
        if (typeof button.id !== "undefined") {
          id = button.id.toString();
          if (id.length > 64) {
            console.error("[Telegram.WebApp] Popup button id is too long", id);
            throw Error("WebAppPopupParamInvalid");
          }
        }
        btn.id = id;
        var button_type = button.type;
        if (typeof button_type === "undefined") {
          button_type = "default";
        }
        btn.type = button_type;
        if (button_type == "ok" || button_type == "close" || button_type == "cancel") ;
        else if (button_type == "default" || button_type == "destructive") {
          var text = "";
          if (typeof button.text !== "undefined") {
            text = strTrim(button.text);
          }
          if (!text.length) {
            console.error("[Telegram.WebApp] Popup button text is required for type " + button_type, button.text);
            throw Error("WebAppPopupParamInvalid");
          }
          if (text.length > 64) {
            console.error("[Telegram.WebApp] Popup button text is too long", text);
            throw Error("WebAppPopupParamInvalid");
          }
          btn.text = text;
        } else {
          console.error("[Telegram.WebApp] Popup button type is invalid", button_type);
          throw Error("WebAppPopupParamInvalid");
        }
        buttons.push(btn);
      }
    } else {
      buttons.push({ id: "", type: "close" });
    }
    if (buttons.length < 1) {
      console.error("[Telegram.WebApp] Popup should have at least one button");
      throw Error("WebAppPopupParamInvalid");
    }
    if (buttons.length > 3) {
      console.error("[Telegram.WebApp] Popup should not have more than 3 buttons");
      throw Error("WebAppPopupParamInvalid");
    }
    popup_params.buttons = buttons;
    webAppPopupOpened = {
      callback
    };
    WebView.postEvent("web_app_open_popup", false, popup_params);
  };
  WebApp.showAlert = function(message, callback) {
    WebApp.showPopup({
      message
    }, callback ? function() {
      callback();
    } : null);
  };
  WebApp.showConfirm = function(message, callback) {
    WebApp.showPopup({
      message,
      buttons: [
        { type: "ok", id: "ok" },
        { type: "cancel" }
      ]
    }, callback ? function(button_id) {
      callback(button_id == "ok");
    } : null);
  };
  WebApp.showScanQrPopup = function(params, callback) {
    if (!versionAtLeast("6.4")) {
      console.error("[Telegram.WebApp] Method showScanQrPopup is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    if (webAppScanQrPopupOpened) {
      console.error("[Telegram.WebApp] Popup is already opened");
      throw Error("WebAppScanQrPopupOpened");
    }
    var text = "";
    var popup_params = {};
    if (typeof params.text !== "undefined") {
      text = strTrim(params.text);
      if (text.length > 64) {
        console.error("[Telegram.WebApp] Scan QR popup text is too long", text);
        throw Error("WebAppScanQrPopupParamInvalid");
      }
      if (text.length > 0) {
        popup_params.text = text;
      }
    }
    webAppScanQrPopupOpened = {
      callback
    };
    WebView.postEvent("web_app_open_scan_qr_popup", false, popup_params);
  };
  WebApp.closeScanQrPopup = function() {
    if (!versionAtLeast("6.4")) {
      console.error("[Telegram.WebApp] Method closeScanQrPopup is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    webAppScanQrPopupOpened = false;
    WebView.postEvent("web_app_close_scan_qr_popup", false);
  };
  WebApp.readTextFromClipboard = function(callback) {
    if (!versionAtLeast("6.4")) {
      console.error("[Telegram.WebApp] Method readTextFromClipboard is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    var req_id = generateCallbackId(16);
    var req_params = { req_id };
    webAppCallbacks[req_id] = {
      callback
    };
    WebView.postEvent("web_app_read_text_from_clipboard", false, req_params);
  };
  WebApp.requestWriteAccess = function(callback) {
    if (!versionAtLeast("6.9")) {
      console.error("[Telegram.WebApp] Method requestWriteAccess is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    if (WebAppWriteAccessRequested) {
      console.error("[Telegram.WebApp] Write access is already requested");
      throw Error("WebAppWriteAccessRequested");
    }
    WebAppWriteAccessRequested = {
      callback
    };
    WebView.postEvent("web_app_request_write_access");
  };
  WebApp.requestContact = function(callback) {
    if (!versionAtLeast("6.9")) {
      console.error("[Telegram.WebApp] Method requestContact is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    if (WebAppContactRequested) {
      console.error("[Telegram.WebApp] Contact is already requested");
      throw Error("WebAppContactRequested");
    }
    WebAppContactRequested = {
      callback
    };
    WebView.postEvent("web_app_request_phone");
  };
  WebApp.shareToStory = function(media_url, params) {
    params = params || {};
    if (!versionAtLeast("7.8")) {
      console.error("[Telegram.WebApp] Method shareToStory is not supported in version " + webAppVersion);
      throw Error("WebAppMethodUnsupported");
    }
    var a = document.createElement("A");
    a.href = media_url;
    if (a.protocol != "http:" && a.protocol != "https:") {
      console.error("[Telegram.WebApp] Media url protocol is not supported", url);
      throw Error("WebAppMediaUrlInvalid");
    }
    var share_params = {};
    share_params.media_url = a.href;
    if (typeof params.text !== "undefined") {
      var text = strTrim(params.text);
      if (text.length > 2048) {
        console.error("[Telegram.WebApp] Text is too long", text);
        throw Error("WebAppShareToStoryParamInvalid");
      }
      if (text.length > 0) {
        share_params.text = text;
      }
    }
    if (typeof params.widget_link !== "undefined") {
      params.widget_link = params.widget_link || {};
      a.href = params.widget_link.url;
      if (a.protocol != "http:" && a.protocol != "https:") {
        console.error("[Telegram.WebApp] Link protocol is not supported", url);
        throw Error("WebAppShareToStoryParamInvalid");
      }
      var widget_link = {
        url: a.href
      };
      if (typeof params.widget_link.name !== "undefined") {
        var link_name = strTrim(params.widget_link.name);
        if (link_name.length > 48) {
          console.error("[Telegram.WebApp] Link name is too long", link_name);
          throw Error("WebAppShareToStoryParamInvalid");
        }
        if (link_name.length > 0) {
          widget_link.name = link_name;
        }
      }
      share_params.widget_link = widget_link;
    }
    WebView.postEvent("web_app_share_to_story", false, share_params);
  };
  WebApp.invokeCustomMethod = function(method, params, callback) {
    invokeCustomMethod(method, params, callback);
  };
  WebApp.ready = function() {
    WebView.postEvent("web_app_ready");
  };
  WebApp.expand = function() {
    WebView.postEvent("web_app_expand");
  };
  WebApp.close = function(options) {
    options = options || {};
    var req_params = {};
    if (versionAtLeast("7.6") && options.return_back) {
      req_params.return_back = true;
    }
    WebView.postEvent("web_app_close", false, req_params);
  };
  window.Telegram.WebApp = WebApp;
  updateHeaderColor();
  updateBackgroundColor();
  updateBottomBarColor();
  setViewportHeight();
  if (initParams.tgWebAppShowSettings) {
    SettingsButton.show();
  }
  window.addEventListener("resize", onWindowResize);
  if (isIframe) {
    document.addEventListener("click", linkHandler);
  }
  WebView.onEvent("theme_changed", onThemeChanged);
  WebView.onEvent("viewport_changed", onViewportChanged);
  WebView.onEvent("invoice_closed", onInvoiceClosed);
  WebView.onEvent("popup_closed", onPopupClosed);
  WebView.onEvent("qr_text_received", onQrTextReceived);
  WebView.onEvent("scan_qr_popup_closed", onScanQrPopupClosed);
  WebView.onEvent("clipboard_text_received", onClipboardTextReceived);
  WebView.onEvent("write_access_requested", onWriteAccessRequested);
  WebView.onEvent("phone_requested", onPhoneRequested);
  WebView.onEvent("custom_method_invoked", onCustomMethodInvoked);
  WebView.postEvent("web_app_request_theme");
  WebView.postEvent("web_app_request_viewport");
})();
Object.defineProperty(sdk, "__esModule", { value: true });
sdk.WebApp = void 0;
var telegramWindow = window;
sdk.WebApp = telegramWindow.Telegram.WebApp;
Object.defineProperty(dist, "__esModule", { value: true });
var sdk_1 = sdk;
var _default = dist.default = sdk_1.WebApp;
const { Title: Title$2, Text: Text$2, Paragraph: Paragraph$1 } = Typography;
const { TextArea } = Input$1;
const UserProfile = ({ prompts }) => {
  var _a;
  const [profileData, setProfileData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [editing, setEditing] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const [actionLoading, setActionLoading] = reactExports.useState(null);
  const { state: permState } = usePermissions();
  const [availableVoices, setAvailableVoices] = reactExports.useState([]);
  const [voicePersonaKey, setVoicePersonaKey] = reactExports.useState("FR_Ranevskaya_Persona_v1_4");
  const [voiceId, setVoiceId] = reactExports.useState("");
  const [voiceLoading, setVoiceLoading] = reactExports.useState(false);
  const userData = (() => {
    var _a2;
    const tg = (_a2 = _default.initDataUnsafe) == null ? void 0 : _a2.user;
    if (tg && tg.id) return tg;
    try {
      const stored = sessionStorage.getItem("telegram_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
    }
    return { id: 0, first_name: "", last_name: "", username: "", language_code: "", is_premium: false, photo_url: void 0 };
  })();
  reactExports.useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        console.log("🔧 Данные пользователя для аватара:", userData);
        const baseProfile = {
          telegram_id: userData.id,
          telegram_first_name: userData.first_name || "",
          telegram_last_name: userData.last_name || "",
          telegram_username: userData.username || "",
          telegram_language: (userData.language_code || "").toUpperCase(),
          telegram_is_premium: userData.is_premium || false,
          telegram_photo_url: userData.photo_url,
          display_name: userData.first_name || userData.username || "",
          bio: userData.username ? `@${userData.username}` : "",
          birth_date: "",
          gender: void 0,
          location: "",
          timezone: "Europe/Moscow",
          phone_number: "",
          email: "",
          favorite_topics: [],
          registration_date: (/* @__PURE__ */ new Date()).toISOString(),
          last_seen: (/* @__PURE__ */ new Date()).toISOString(),
          total_messages: 0,
          ai_interactions: 0,
          prompt_usage: {},
          subscription_level: "basic"
        };
        try {
          const data = await apiRequest("/miniapp/profile", "GET");
          console.log("Профиль загружен из БД:", data);
          if (data.profile) {
            const mergedProfile = {
              // Сначала Telegram, затем БД — Telegram имеет приоритет
              ...data.profile,
              ...baseProfile,
              telegram_id: baseProfile.telegram_id,
              telegram_first_name: baseProfile.telegram_first_name || data.profile.telegram_first_name,
              telegram_last_name: baseProfile.telegram_last_name || data.profile.telegram_last_name,
              telegram_username: baseProfile.telegram_username || data.profile.telegram_username,
              telegram_language: baseProfile.telegram_language || data.profile.telegram_language,
              telegram_is_premium: typeof baseProfile.telegram_is_premium === "boolean" ? baseProfile.telegram_is_premium : data.profile.telegram_is_premium,
              telegram_photo_url: baseProfile.telegram_photo_url || data.profile.telegram_photo_url,
              display_name: baseProfile.display_name || data.profile.display_name,
              bio: baseProfile.bio || data.profile.bio
            };
            console.log("👤 Итоговый профиль:", mergedProfile);
            console.log("🖼️ Фото URL:", mergedProfile.telegram_photo_url);
            console.log("📛 Имя для аватара:", mergedProfile.telegram_first_name, mergedProfile.telegram_last_name);
            setProfileData(mergedProfile);
            setEditForm(mergedProfile);
          } else {
            console.log("👤 Используем базовый профиль:", baseProfile);
            setProfileData(baseProfile);
            setEditForm(baseProfile);
          }
        } catch (apiError) {
          console.warn("Ошибка API, используем базовый профиль:", apiError);
          setProfileData(baseProfile);
          setEditForm(baseProfile);
        }
      } catch (error) {
        console.error("Критическая ошибка при создании профиля:", error);
        const minimalProfile = {
          telegram_id: userData.id || 0,
          telegram_first_name: userData.first_name || "",
          telegram_last_name: userData.last_name || "",
          telegram_username: userData.username || "",
          telegram_language: (userData.language_code || "").toUpperCase(),
          telegram_is_premium: !!userData.is_premium,
          telegram_photo_url: userData.photo_url,
          display_name: userData.first_name || userData.username || "",
          bio: userData.username ? `@${userData.username}` : "",
          birth_date: "",
          gender: void 0,
          location: "",
          timezone: "Europe/Moscow",
          phone_number: "",
          email: "",
          favorite_topics: [],
          registration_date: (/* @__PURE__ */ new Date()).toISOString(),
          last_seen: (/* @__PURE__ */ new Date()).toISOString(),
          total_messages: 0,
          ai_interactions: 0,
          prompt_usage: {},
          subscription_level: "basic"
        };
        setProfileData(minimalProfile);
        setEditForm(minimalProfile);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userData.id, userData.username, userData.first_name, userData.last_name]);
  reactExports.useEffect(() => {
    const loadVoices = async () => {
      try {
        setVoiceLoading(true);
        const res = await apiRequest("/voice/voices", "GET");
        const items = Array.isArray(res == null ? void 0 : res.items) ? res.items : Array.isArray(res) ? res : [];
        const mapped = items.map((it) => {
          var _a2, _b, _c, _d, _e;
          return {
            id: String((_c = (_b = (_a2 = it.id) != null ? _a2 : it.model) != null ? _b : it.display_name) != null ? _c : ""),
            provider: String((_d = it.provider) != null ? _d : ""),
            model: it.model,
            display_name: (_e = it.display_name) != null ? _e : it.id
          };
        }).filter((v) => !!v.id);
        setAvailableVoices(mapped);
        if (!voiceId && mapped.length > 0) setVoiceId(mapped[0].id);
      } catch (e) {
      } finally {
        setVoiceLoading(false);
      }
    };
    void loadVoices();
  }, []);
  const doApplyVoice = async () => {
    if (!voicePersonaKey || !voiceId) {
      staticMethods.warning("Выберите персону и голос");
      return;
    }
    try {
      setVoiceLoading(true);
      const body = { persona_key: voicePersonaKey, voice_id: voiceId };
      await apiRequest("/voice/set_voice", "POST", body);
      staticMethods.success("Голос применён");
    } catch (e) {
      staticMethods.error("Не удалось применить голос");
    } finally {
      setVoiceLoading(false);
    }
  };
  const handleUpdateProfile = async () => {
    var _a2;
    try {
      setActionLoading("update");
      const tgId = sessionStorage.getItem("tg_id");
      if (!tgId) {
        staticMethods.error("Ошибка: не найден Telegram ID");
        return;
      }
      const telegramUser = (_a2 = _default.initDataUnsafe) == null ? void 0 : _a2.user;
      if (!telegramUser) {
        staticMethods.error("Ошибка: не удалось получить данные из Telegram WebApp");
        return;
      }
      console.log("📊 Отправляем данные Telegram:", telegramUser);
      const requestData = {
        telegram_user_data: {
          id: telegramUser.id,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          username: telegramUser.username || null,
          language_code: telegramUser.language_code || null,
          is_premium: telegramUser.is_premium || false,
          allows_write_to_pm: telegramUser.allows_write_to_pm || false,
          photo_url: telegramUser.photo_url || null,
          phone_number: null
          // Пока не поддерживается, нужна отдельная реализация
        }
      };
      const response = await fetch("/api/profile/auto-fill-from-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId
        },
        body: JSON.stringify(requestData)
      });
      if (response.ok) {
        const result = await response.json();
        const updatedFields = result.updated_fields || [];
        if (updatedFields.length > 0) {
          staticMethods.success(`Профиль обновлен! Обновлено полей: ${updatedFields.join(", ")}`);
        } else {
          staticMethods.info("Профиль уже содержит актуальные данные из Telegram");
        }
        console.log("✅ Результат обновления:", result);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        staticMethods.error(`Ошибка обновления профиля: ${errorData.detail || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      staticMethods.error("Ошибка при обновлении профиля");
    } finally {
      setActionLoading(null);
    }
  };
  const handleClearCache = async () => {
    try {
      setActionLoading("cache");
      const tgId = sessionStorage.getItem("tg_id");
      if (!tgId) {
        staticMethods.error("Ошибка: не найден Telegram ID");
        return;
      }
      const response = await fetch("/api/cache/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId
        }
      });
      if (response.ok) {
        try {
          const tg = sessionStorage.getItem("tg_id");
          const rolesCache = sessionStorage.getItem("sp_roles_cache");
          const sticky = sessionStorage.getItem("sp_roles_sticky");
          sessionStorage.clear();
          if (tg) sessionStorage.setItem("tg_id", tg);
          if (rolesCache) sessionStorage.setItem("sp_roles_cache", rolesCache);
          if (sticky) sessionStorage.setItem("sp_roles_sticky", sticky);
        } catch (e) {
        }
        try {
          localStorage.removeItem("token");
        } catch (e) {
        }
        staticMethods.success("Кеш успешно очищен! Страница будет перезагружена.");
        setTimeout(() => {
          window.location.reload();
        }, 1e3);
      } else {
        const errorData = await response.json();
        staticMethods.error(`Ошибка очистки кеша: ${errorData.detail || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка при очистке кеша:", error);
      staticMethods.error("Ошибка при очистке кеша");
    } finally {
      setActionLoading(null);
    }
  };
  const handleRequestPhoneNumber = async () => {
    try {
      setActionLoading("phone");
      const confirmed = window.confirm(
        'Для получения номера телефона:\n\n1. Откройте чат с ботом @SoulPulsePhoneBot\n2. Нажмите кнопку "📱 Поделиться номером телефона"\n3. Вернитесь в мини-приложение и нажмите "Обновить профиль"\n\nХотите открыть чат с ботом?'
      );
      if (confirmed) {
        const botUsername = "soulpulse_mini_bot";
        const botUrl = `https://t.me/${botUsername}`;
        if (_default.openTelegramLink) {
          _default.openTelegramLink(botUrl);
        } else {
          window.open(botUrl, "_blank");
        }
        staticMethods.info("Откройте чат с ботом и поделитесь номером телефона");
      }
    } catch (error) {
      console.error("Ошибка при запросе номера телефона:", error);
      staticMethods.error("Ошибка при запросе номера телефона");
    } finally {
      setActionLoading(null);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      setActionLoading("delete");
      const tgId = sessionStorage.getItem("tg_id");
      if (!tgId) {
        staticMethods.error("Ошибка: не найден Telegram ID");
        return;
      }
      const confirmed = window.confirm(
        "Вы уверены, что хотите удалить свой аккаунт?\n\nЭто действие необратимо и удалит:\n• Все ваши сообщения и чаты\n• Настройки и предпочтения\n• Профиль и персональные данные\n\nНажмите OK для подтверждения удаления."
      );
      if (!confirmed) {
        setActionLoading(null);
        return;
      }
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-User-ID": tgId
        }
      });
      if (response.ok) {
        try {
          const tg = sessionStorage.getItem("tg_id");
          const rolesCache = sessionStorage.getItem("sp_roles_cache");
          const sticky = sessionStorage.getItem("sp_roles_sticky");
          sessionStorage.clear();
          if (tg) sessionStorage.setItem("tg_id", tg);
          if (rolesCache) sessionStorage.setItem("sp_roles_cache", rolesCache);
          if (sticky) sessionStorage.setItem("sp_roles_sticky", sticky);
        } catch (e) {
        }
        try {
          localStorage.removeItem("token");
        } catch (e) {
        }
        staticMethods.success("Аккаунт успешно удален. До свидания!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2e3);
      } else {
        const errorData = await response.json();
        staticMethods.error(`Ошибка удаления аккаунта: ${errorData.detail || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      staticMethods.error("Ошибка при удалении аккаунта");
    } finally {
      setActionLoading(null);
    }
  };
  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const today = /* @__PURE__ */ new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
      age--;
    }
    return age;
  };
  const getGenderIcon = (gender) => {
    switch (gender) {
      case "male":
        return "👨";
      case "female":
        return "👩";
      default:
        return "👤";
    }
  };
  const getGenderLabel = (gender) => {
    switch (gender) {
      case "male":
        return "Мужской";
      case "female":
        return "Женский";
      default:
        return "Другой";
    }
  };
  const getSubscriptionColor = (level) => {
    switch (level) {
      case "basic":
        return "blue";
      case "premium":
        return "purple";
      case "corporate":
        return "gold";
      default:
        return "default";
    }
  };
  const getSubscriptionIcon = (level) => {
    switch (level) {
      case "basic":
        return "🔵";
      case "premium":
        return "🟣";
      case "corporate":
        return "🟡";
      default:
        return "⚪";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-md)" }, children: "Загрузка профиля..." })
    ] });
  }
  if (!profileData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", style: { padding: "var(--sp-spacing-2xl) 0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$c, { style: { fontSize: "var(--sp-font-size-3xl)", color: "var(--sp-text-tertiary)", marginBottom: "var(--sp-spacing-md)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { type: "secondary", children: "Не удалось загрузить профиль пользователя" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container profile-page", style: { width: "100%", maxWidth: "100%", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "soulpulse-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title$2, { className: "soulpulse-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$c, { style: { marginRight: "var(--sp-spacing-md)" } }),
        "Профиль пользователя"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { className: "soulpulse-subtitle", children: "Управление персональными данными и настройками" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [24, 24], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { xs: 24, lg: 16, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            title: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Основная информация" }) }),
            className: "mb-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [24, 16], children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Avatar,
                    {
                      size: 80,
                      src: profileData.telegram_photo_url || "/android-chrome-192x192.png",
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$c, {}),
                      style: { marginBottom: "var(--sp-spacing-lg)" },
                      onError: () => {
                        return true;
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Title$2, { level: 5, style: { margin: "var(--sp-spacing-sm) 0" }, children: profileData.display_name || profileData.telegram_first_name }),
                    profileData.telegram_username && /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { type: "secondary", children: [
                      "@",
                      profileData.telegram_username
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 16, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "large", style: { width: "100%" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { strong: true, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, { style: { marginRight: "var(--sp-spacing-sm)", color: "var(--sp-text-tertiary)" } }),
                      "ID пользователя:"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.telegram_id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), children: "Telegram" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { strong: true, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, { style: { marginRight: "var(--sp-spacing-sm)", color: "var(--sp-text-tertiary)" } }),
                      "Имя:"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.telegram_first_name }),
                    profileData.telegram_last_name && /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.telegram_last_name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), children: "Telegram" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Отображаемое имя:" }),
                    editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        value: editForm.display_name || "",
                        onChange: (e) => setEditForm({ ...editForm, display_name: e.target.value }),
                        placeholder: "Введите отображаемое имя",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.display_name || profileData.telegram_first_name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "О себе:" }),
                    editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TextArea,
                      {
                        value: editForm.bio || "",
                        onChange: (e) => setEditForm({ ...editForm, bio: e.target.value }),
                        placeholder: "Расскажите о себе",
                        rows: 3,
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "100%" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.bio || "Не указано" })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Дата рождения:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      DatePicker,
                      {
                        value: editForm.birth_date ? new Date(editForm.birth_date) : null,
                        onChange: (date) => setEditForm({
                          ...editForm,
                          birth_date: date ? date.toISOString() : void 0
                        }),
                        style: { marginLeft: "var(--sp-spacing-sm)" }
                      }
                    )
                  ] }) : profileData.birth_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Дата рождения:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: [
                      new Date(profileData.birth_date).toLocaleDateString("ru-RU"),
                      "(",
                      getAge(profileData.birth_date),
                      " лет)"
                    ] })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Пол:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: editForm.gender,
                        onChange: (value) => setEditForm({ ...editForm, gender: value }),
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "150px" },
                        placeholder: "Выберите пол",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "male", children: "👨 Мужской" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "female", children: "👩 Женский" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "other", children: "👤 Другой" })
                        ]
                      }
                    )
                  ] }) : profileData.gender && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Пол:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: [
                      getGenderIcon(profileData.gender),
                      " ",
                      getGenderLabel(profileData.gender)
                    ] })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Местоположение:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        value: editForm.location || "",
                        onChange: (e) => setEditForm({ ...editForm, location: e.target.value }),
                        placeholder: "Введите местоположение",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" }
                      }
                    )
                  ] }) : profileData.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Местоположение:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { style: { marginRight: "var(--sp-spacing-xs)" } }),
                      profileData.location
                    ] })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Телефон:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        value: editForm.phone_number || "",
                        onChange: (e) => setEditForm({ ...editForm, phone_number: e.target.value }),
                        placeholder: "Введите номер телефона",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" }
                      }
                    )
                  ] }) : profileData.phone_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Телефон:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { marginRight: "var(--sp-spacing-xs)" } }),
                      profileData.phone_number
                    ] })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Email:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        value: editForm.email || "",
                        onChange: (e) => setEditForm({ ...editForm, email: e.target.value }),
                        placeholder: "Введите email",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" }
                      }
                    )
                  ] }) : profileData.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Email:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { marginRight: "var(--sp-spacing-xs)" } }),
                      profileData.email
                    ] })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Прозвище/Как обращаться:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        value: editForm.nickname || "",
                        onChange: (e) => setEditForm({ ...editForm, nickname: e.target.value }),
                        placeholder: "Как к вам обращаться?",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" }
                      }
                    )
                  ] }) : profileData.nickname && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Прозвище:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.nickname })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Возраст:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        type: "number",
                        value: editForm.age || "",
                        onChange: (e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || void 0 }),
                        placeholder: "Введите возраст",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "100px" }
                      }
                    )
                  ] }) : profileData.age && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Возраст:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: [
                      profileData.age,
                      " лет"
                    ] })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Профессия:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input$1,
                      {
                        value: editForm.profession || "",
                        onChange: (e) => setEditForm({ ...editForm, profession: e.target.value }),
                        placeholder: "Ваша профессия",
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" }
                      }
                    )
                  ] }) : profileData.profession && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Профессия:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.profession })
                  ] }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Семейное положение:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: editForm.relationship_status,
                        onChange: (value) => setEditForm({ ...editForm, relationship_status: value }),
                        style: { marginLeft: "var(--sp-spacing-sm)", width: "200px" },
                        placeholder: "Выберите статус",
                        allowClear: true,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "single", children: "Холост/Не замужем" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "married", children: "Женат/Замужем" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "divorced", children: "Разведен(а)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "widowed", children: "Вдовец/Вдова" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "relationship", children: "В отношениях" })
                        ]
                      }
                    )
                  ] }) : profileData.relationship_status && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Семейное положение:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { style: { marginLeft: "var(--sp-spacing-sm)" }, children: profileData.relationship_status === "single" ? "Холост/Не замужем" : profileData.relationship_status === "married" ? "Женат/Замужем" : profileData.relationship_status === "divorced" ? "Разведен(а)" : profileData.relationship_status === "widowed" ? "Вдовец/Вдова" : profileData.relationship_status === "relationship" ? "В отношениях" : profileData.relationship_status })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Язык:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), children: ((_a = profileData.telegram_language) == null ? void 0 : _a.toUpperCase()) || "RU" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), children: "Telegram" })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { style: { margin: "12px 0" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Обновить из Telegram", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    shape: "circle",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$e, {}),
                    loading: actionLoading === "update",
                    onClick: handleUpdateProfile,
                    size: "small",
                    type: "primary"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Синхронизация", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    shape: "circle",
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$f, {}),
                    onClick: () => {
                      try {
                        window.dispatchEvent(new Event("sp:auth"));
                      } catch (e) {
                      }
                      try {
                        window.location.hash = "#/webauth";
                      } catch (e) {
                        window.location.replace("/#/webauth");
                      }
                    },
                    size: "small"
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Статистика активности", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "Всего сообщений",
              value: profileData.total_messages,
              prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$g, {}),
              valueStyle: { color: "var(--primary-color)" }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "AI взаимодействий",
              value: profileData.ai_interactions,
              prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$h, {}),
              valueStyle: { color: "var(--secondary-color)" }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "Дней в системе",
              value: Math.floor(((/* @__PURE__ */ new Date()).getTime() - new Date(profileData.registration_date).getTime()) / (1e3 * 60 * 60 * 24)),
              prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$i, {}),
              valueStyle: { color: "var(--accent-color)" }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "Премиум статус",
              value: profileData.telegram_is_premium ? "Да" : "Нет",
              prefix: profileData.telegram_is_premium ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$j, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$c, {}),
              valueStyle: { color: profileData.telegram_is_premium ? "var(--warning-color)" : "var(--text-muted)" }
            }
          ) })
        ] }) }),
        Object.keys(profileData.prompt_usage).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Использование промптов", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, children: Object.entries(profileData.prompt_usage).map(([prompt, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { children: prompt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Progress,
              {
                percent: Math.round(count / profileData.ai_interactions * 100),
                size: "small",
                style: { width: "100px" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { type: "secondary", children: count })
          ] })
        ] }, prompt)) }) }),
        profileData.favorite_topics && profileData.favorite_topics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Любимые темы", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: profileData.favorite_topics.map((topic) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "purple", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$k, {}), children: topic }, topic)) }) }),
        profileData.interests && profileData.interests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Интересы", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: profileData.interests.map((interest) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: interest }, interest)) }) }),
        profileData.personality_traits && profileData.personality_traits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Черты характера", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: profileData.personality_traits.map((trait) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: trait }, trait)) }) }),
        profileData.goals && profileData.goals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Цели", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" }, children: profileData.goals.map((goal) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "orange", children: goal }, goal)) }) }),
        profileData.important_dates && Object.keys(profileData.important_dates).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Важные даты", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, children: Object.entries(profileData.important_dates).map(([event, date]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { strong: true, children: [
            event,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { children: date })
        ] }, event)) }) }),
        profileData.family_info && Object.keys(profileData.family_info).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Семья", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, children: Object.entries(profileData.family_info).map(([relation, name]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { strong: true, children: [
            relation,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { children: name })
        ] }, relation)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { xs: 24, lg: 8, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Голос ассистента", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: 8, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Персона" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                value: voicePersonaKey,
                onChange: (v) => setVoicePersonaKey(v),
                style: { width: "100%", marginTop: 6 },
                options: [
                  { value: "FR_Ranevskaya_Persona_v1_4", label: "Раневская" },
                  { value: "Soul_Core", label: "Soul Core" },
                  { value: "Ved_prompt_Masterpiece_v4_3", label: "Вед" }
                ],
                showSearch: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Голос" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                loading: voiceLoading,
                value: voiceId || void 0,
                onChange: (v) => setVoiceId(v),
                style: { width: "100%", marginTop: 6 },
                options: availableVoices.map((v) => ({ value: v.id, label: v.display_name || v.id })),
                showSearch: true,
                placeholder: voiceLoading ? "Загрузка…" : "Выберите голос"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", block: true, loading: voiceLoading, onClick: doApplyVoice, children: "Применить голос" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Подписка", className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--sp-font-size-2xl)", marginBottom: "var(--sp-spacing-md)" }, children: getSubscriptionIcon(profileData.subscription_level) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title$2, { level: 4, style: { margin: "var(--sp-spacing-sm) 0" }, children: profileData.subscription_level === "basic" ? "Базовый" : profileData.subscription_level === "premium" ? "Премиум" : profileData.subscription_level === "corporate" ? "Корпоративный" : "Неизвестно" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: getSubscriptionColor(profileData.subscription_level), children: [
              getSubscriptionIcon(profileData.subscription_level),
              profileData.subscription_level === "basic" ? "Базовый" : profileData.subscription_level === "premium" ? "Премиум" : "Корпоративный"
            ] }),
            (permState == null ? void 0 : permState.roles) && permState.roles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "12px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { type: "secondary", children: "Роли:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }, children: permState.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: r.name === "architect" ? "gold" : r.name === "admin" ? "red" : "blue", children: r.name }, r.name)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", block: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$l, {}), children: "Управление подпиской" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { block: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$m, {}), children: "Преимущества" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Последняя активность", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Последний вход:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { type: "secondary", children: new Date(profileData.last_seen).toLocaleString("ru-RU") }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { strong: true, children: "Регистрация:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text$2, { type: "secondary", children: new Date(profileData.registration_date).toLocaleDateString("ru-RU") }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Быстрые действия", style: { boxSizing: "border-box", width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: 8, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { block: true, size: "middle", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$g, {}), children: "Начать чат" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { block: true, size: "middle", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$n, {}), children: "Мои промпты" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { block: true, size: "middle", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$l, {}), children: "Настройки" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              block: true,
              size: "middle",
              type: "primary",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$e, {}),
              loading: actionLoading === "update",
              onClick: handleUpdateProfile,
              children: "Обновить из Telegram"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Управление профилем", style: { marginTop: "16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Обновить данные профиля из Telegram", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              block: true,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$e, {}),
              loading: actionLoading === "update",
              onClick: handleUpdateProfile,
              type: "primary",
              children: "Обновить профиль"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Очистить кеш приложения и перезагрузить", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              block: true,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
              loading: actionLoading === "cache",
              onClick: handleClearCache,
              children: "Очистить кеш"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Запросить номер телефона через Telegram бота", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              block: true,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
              loading: actionLoading === "phone",
              onClick: handleRequestPhoneNumber,
              style: { marginTop: "8px" },
              children: "Добавить телефон"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Удалить аккаунт и все связанные данные", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              block: true,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$o, {}),
              loading: actionLoading === "delete",
              onClick: handleDeleteAccount,
              danger: true,
              style: { marginTop: "8px" },
              children: "Удалить аккаунт"
            }
          ) })
        ] }) })
      ] })
    ] })
  ] });
};
const { Title: Title$1, Text: Text$1 } = Typography;
const { Option: Option$1 } = Select;
const ThemeEditor = () => {
  const { message } = App.useApp();
  const [themes, setThemes] = reactExports.useState([]);
  const [currentTheme, setCurrentTheme] = reactExports.useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = reactExports.useState(false);
  const [previewMode, setPreviewMode] = reactExports.useState(false);
  const defaultColors = {
    bg_primary: "#0f0f0f",
    bg_secondary: "#1a1a1a",
    bg_card: "#2a2a2a",
    bg_hover: "#3a3a3a",
    bg_topbar: "rgba(15,15,15,0.85)",
    text_primary: "#ffffff",
    text_secondary: "#a0a0a0",
    text_hint: "#666666",
    primary_color: "#6366f1",
    primary_hover: "#5048e5",
    secondary_color: "#8b5cf6",
    accent_color: "#f59e0b",
    success_color: "#10b981",
    danger_color: "#ef4444",
    warning_color: "#f59e0b",
    border_color: "#404040",
    border_light: "#303030",
    grad_start: "#1a1a3a",
    grad_end: "#0f0f0f"
  };
  const loadThemes = async () => {
    try {
      const response = await fetch("/api/miniapp/themes");
      if (response.ok) {
        const data = await response.json();
        setThemes(data.themes || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки тем:", error);
    }
  };
  const saveTheme = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/miniapp/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: currentTheme == null ? void 0 : currentTheme.id,
          name: values.name,
          colors: values.colors
        })
      });
      if (response.ok) {
        message.success("Тема сохранена!");
        loadThemes();
      } else {
        message.error("Ошибка сохранения темы");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      message.error("Ошибка сохранения темы");
    }
    setLoading(false);
  };
  const activateTheme = async (themeId) => {
    var _a;
    try {
      const response = await fetch(`/api/miniapp/themes/${themeId}/activate`, {
        method: "POST"
      });
      if (response.ok) {
        message.success("Тема активирована!");
        loadThemes();
        applyThemeToPreview(((_a = themes.find((t) => t.id === themeId)) == null ? void 0 : _a.colors) || defaultColors);
      } else {
        message.error("Ошибка активации темы");
      }
    } catch (error) {
      console.error("Ошибка активации:", error);
      message.error("Ошибка активации темы");
    }
  };
  const deleteTheme = async (themeId) => {
    Modal.confirm({
      title: "Удалить тему?",
      content: "Это действие нельзя отменить.",
      okText: "Удалить",
      cancelText: "Отмена",
      okType: "danger",
      onOk: async () => {
        try {
          const response = await fetch(`/api/miniapp/themes/${themeId}`, {
            method: "DELETE"
          });
          if (response.ok) {
            message.success("Тема удалена!");
            loadThemes();
          } else {
            message.error("Ошибка удаления темы");
          }
        } catch (error) {
          console.error("Ошибка удаления:", error);
          message.error("Ошибка удаления темы");
        }
      }
    });
  };
  const applyThemeToPreview = (colors) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/_/g, "-")}`, value);
    });
  };
  const createNewTheme = () => {
    const newTheme = {
      name: "Новая тема",
      is_active: false,
      is_custom: true,
      colors: { ...defaultColors }
    };
    setCurrentTheme(newTheme);
    form.resetFields();
    setTimeout(() => {
      form.setFieldsValue({
        name: newTheme.name,
        colors: newTheme.colors
      });
    }, 0);
  };
  const editTheme = (theme) => {
    setCurrentTheme(theme);
    form.setFieldsValue({
      name: theme.name,
      colors: theme.colors
    });
  };
  reactExports.useEffect(() => {
    loadThemes();
  }, []);
  const colorGroups = [
    {
      title: "Фоны",
      icon: "🎨",
      colors: [
        { key: "bg_primary", label: "Основной фон", description: "Фон всего приложения" },
        { key: "bg_secondary", label: "Вторичный фон", description: "Фон для меню и боковых панелей" },
        { key: "bg_card", label: "Фон карточек", description: "Фон карточек и модальных окон" },
        { key: "bg_hover", label: "Фон при наведении", description: "Цвет при наведении мыши" },
        { key: "bg_topbar", label: "Фон заголовка", description: "Фон верхней панели" }
      ]
    },
    {
      title: "Тексты",
      icon: "📝",
      colors: [
        { key: "text_primary", label: "Основной текст", description: "Цвет основного текста" },
        { key: "text_secondary", label: "Вторичный текст", description: "Цвет подписей и описаний" },
        { key: "text_hint", label: "Подсказки", description: "Цвет подсказок и плейсхолдеров" }
      ]
    },
    {
      title: "Акценты",
      icon: "🌟",
      colors: [
        { key: "primary_color", label: "Основной акцент", description: "Главный цвет интерфейса" },
        { key: "primary_hover", label: "Акцент при наведении", description: "Цвет кнопок при наведении" },
        { key: "secondary_color", label: "Вторичный акцент", description: "Дополнительный акцентный цвет" },
        { key: "accent_color", label: "Выделение", description: "Цвет для выделения элементов" }
      ]
    },
    {
      title: "Статусы",
      icon: "🚦",
      colors: [
        { key: "success_color", label: "Успех", description: "Цвет успешных операций" },
        { key: "danger_color", label: "Ошибка", description: "Цвет ошибок и предупреждений" },
        { key: "warning_color", label: "Предупреждение", description: "Цвет предупреждений" }
      ]
    },
    {
      title: "Границы и градиенты",
      icon: "🔲",
      colors: [
        { key: "border_color", label: "Границы", description: "Цвет границ элементов" },
        { key: "border_light", label: "Светлые границы", description: "Цвет тонких границ" },
        { key: "grad_start", label: "Начало градиента", description: "Начальный цвет фонового градиента" },
        { key: "grad_end", label: "Конец градиента", description: "Конечный цвет фонового градиента" }
      ]
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "theme-editor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Title$1, { level: 3, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$l, {}),
      " Редактор тем"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { type: "secondary", children: "Создавайте и настраивайте свои уникальные темы оформления" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        defaultActiveKey: "list",
        items: [
          {
            key: "list",
            label: "Мои темы",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 24, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "primary",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$p, {}),
                  onClick: createNewTheme,
                  style: { marginBottom: 16 },
                  children: "Создать новую тему"
                }
              ) }),
              themes.map((theme) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Card,
                {
                  size: "small",
                  actions: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "text",
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$q, {}),
                        onClick: () => editTheme(theme),
                        children: "Изменить"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "text",
                        onClick: () => theme.id && activateTheme(theme.id),
                        disabled: theme.is_active,
                        children: theme.is_active ? "Активна" : "Применить"
                      }
                    ),
                    theme.is_custom && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "text",
                        danger: true,
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$o, {}),
                        onClick: () => theme.id && deleteTheme(theme.id)
                      }
                    )
                  ].filter(Boolean),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Title$1, { level: 5, children: theme.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: 4, margin: "8px 0" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: 20,
                            height: 20,
                            backgroundColor: theme.colors.primary_color,
                            borderRadius: 4
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: 20,
                            height: 20,
                            backgroundColor: theme.colors.bg_card,
                            border: "1px solid #ccc",
                            borderRadius: 4
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            width: 20,
                            height: 20,
                            backgroundColor: theme.colors.text_primary,
                            borderRadius: 4
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                      theme.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "Активна" }),
                      theme.is_custom ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: "Пользовательская" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: "Системная" })
                    ] })
                  ] })
                }
              ) }, theme.id))
            ] })
          },
          {
            key: "editor",
            label: "Редактор",
            disabled: !currentTheme,
            children: currentTheme && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Form,
              {
                form,
                layout: "vertical",
                onFinish: saveTheme,
                initialValues: {
                  name: currentTheme.name,
                  colors: currentTheme.colors
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [24, 16], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 24, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Form.Item,
                    {
                      label: "Название темы",
                      name: "name",
                      rules: [{ required: true, message: "Введите название темы" }],
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1, { placeholder: "Моя уникальная тема" })
                    }
                  ) }) }),
                  colorGroups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Title$1, { level: 4, children: [
                      group.icon,
                      " ",
                      group.title
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 16], style: { marginBottom: 24 }, children: group.colors.map((colorConfig) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Form.Item,
                      {
                        label: colorConfig.label,
                        name: ["colors", colorConfig.key],
                        tooltip: colorConfig.description,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ColorPicker,
                          {
                            showText: true,
                            size: "large",
                            onChange: (color) => {
                              const hex = color.toHexString();
                              const newColors = { ...form.getFieldValue("colors") };
                              newColors[colorConfig.key] = hex;
                              form.setFieldValue("colors", newColors);
                              if (previewMode) {
                                const root = document.documentElement;
                                root.style.setProperty(`--${colorConfig.key.replace(/_/g, "-")}`, hex);
                              }
                            }
                          }
                        )
                      }
                    ) }, colorConfig.key)) })
                  ] }, group.title)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "primary",
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$r, {}),
                        htmlType: "submit",
                        loading,
                        children: "Сохранить тему"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$q, {}),
                        onClick: () => {
                          setPreviewMode(!previewMode);
                          if (!previewMode) {
                            const colors = form.getFieldValue("colors");
                            applyThemeToPreview(colors);
                          }
                        },
                        children: previewMode ? "Отключить превью" : "Превью"
                      }
                    ) })
                  ] })
                ]
              }
            )
          }
        ]
      }
    )
  ] }) });
};
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const Settings = ({ prompts = [] }) => {
  const [activeTab, setActiveTab] = reactExports.useState("profile");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  const openDebugTool = () => {
    const debugUrl = "/debug-auth.html";
    window.open(debugUrl, "_blank", "width=1000,height=800,scrollbars=yes,resizable=yes");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container settings-page", style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%", overflowX: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "soulpulse-header", style: { marginBottom: "var(--sp-spacing-sm)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { className: "soulpulse-title", style: { margin: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$l, { style: { marginRight: "var(--sp-spacing-sm)" } }),
        "Настройки приложения"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { className: "soulpulse-subtitle", style: { opacity: 0.8 }, children: "Управление профилем, безопасностью и предпочтениями" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        activeKey: activeTab,
        onChange: handleTabChange,
        size: "large",
        style: {},
        items: [
          {
            key: "profile",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$c, {}),
              "Профиль"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserProfile, { prompts })
          },
          {
            key: "preferences",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$l, {}),
              "Предпочтения"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PreferencesTab, {})
          },
          {
            key: "security",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
              "Безопасность"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityTab, {})
          },
          {
            key: "notifications",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$s, {}),
              "Уведомления"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsTab, {})
          },
          {
            key: "ai-settings",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$h, {}),
              "AI настройки"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(AISettingsTab, {})
          },
          {
            key: "themes",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}),
              "Темы"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeEditor, {}) })
          },
          {
            key: "debug",
            label: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
              "Debug"
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(DebugTab, { openDebugTool })
          }
        ]
      }
    )
  ] });
};
const PreferencesTab = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Предпочтения сохранены:", values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-xs)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { marginTop: 0 }, children: "Настройки интерфейса" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Form,
      {
        form,
        layout: "vertical",
        onFinish,
        initialValues: {
          language: "ru",
          theme: "auto",
          compactMode: false,
          showAnimations: true
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Язык интерфейса", name: "language", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "ru", children: "Русский" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "en", children: "English" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "de", children: "Deutsch" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "fr", children: "Français" })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Тема оформления", name: "theme", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                popupMatchSelectWidth: true,
                onChange: (value) => {
                  if (value === "auto") {
                    localStorage.removeItem("sp_theme");
                  } else {
                    localStorage.setItem("sp_theme", value);
                  }
                  window.dispatchEvent(new CustomEvent("theme-changed", { detail: value }));
                  const bodyEl = document.body;
                  if (bodyEl) {
                    bodyEl.classList.remove("theme-dark-indigo", "theme-dark-slate", "theme-light-indigo");
                    if (value !== "auto") bodyEl.classList.add(value);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "auto", children: "Автоматически" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "theme-dark-indigo", children: "Тёмная (Индиго)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "theme-dark-slate", children: "Тёмная (Слейт)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "theme-light-indigo", children: "Светлая (Индиго)" })
                ]
              }
            ) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Компактный режим", name: "compactMode", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Анимации", name: "showAnimations", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Настройки чата" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Размер шрифта", name: "fontSize", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "small", children: "Маленький" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "medium", children: "Средний" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "large", children: "Большой" })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Автосохранение", name: "autoSave", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", size: "middle", children: "Сохранить настройки" }) })
        ]
      }
    )
  ] });
};
const SecurityTab = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const onFinish = (values) => {
    console.log("Настройки безопасности сохранены:", values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-xs)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { marginTop: 0 }, children: "Безопасность аккаунта" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Рекомендации по безопасности",
        description: "Используйте сложные пароли, включите двухфакторную аутентификацию и регулярно проверяйте активность аккаунта.",
        type: "info",
        showIcon: true,
        style: { marginBottom: "var(--sp-spacing-sm)" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "vertical", onFinish, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Смена пароля" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Текущий пароль", name: "currentPassword", rules: [{ required: true, message: "Введите текущий пароль" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1.Password, { prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), placeholder: "Введите текущий пароль" }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Новый пароль", name: "newPassword", rules: [{ required: true, message: "Введите новый пароль" }, { min: 8, message: "Пароль должен содержать минимум 8 символов" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1.Password, { prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), placeholder: "Введите новый пароль" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Подтверждение пароля", name: "confirmPassword", rules: [({ getFieldValue }) => ({ validator(_, value) {
          if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
          return Promise.reject(new Error("Пароли не совпадают"));
        } })], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1.Password, { prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$d, {}), placeholder: "Подтвердите новый пароль" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Дополнительная безопасность" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Двухфакторная аутентификация", name: "twoFactorAuth", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Уведомления о входе", name: "loginNotifications", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Автоматический выход", name: "autoLogout", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "never", children: "Никогда" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "1h", children: "Через 1 час" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "4h", children: "Через 4 часа" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "24h", children: "Через 24 часа" })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", size: "middle", danger: true, children: "Сохранить настройки безопасности" }) })
    ] })
  ] });
};
const NotificationsTab = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Настройки уведомлений сохранены:", values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-xs)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { marginTop: 0 }, children: "Настройки уведомлений" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "vertical", onFinish, initialValues: { pushNotifications: true, emailNotifications: false, telegramNotifications: true, newMessages: true, systemUpdates: true, marketing: false }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Каналы уведомлений" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Push уведомления", name: "pushNotifications", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Email уведомления", name: "emailNotifications", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Telegram уведомления", name: "telegramNotifications", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Типы уведомлений" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Новые сообщения", name: "newMessages", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Системные обновления", name: "systemUpdates", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Маркетинговые уведомления", name: "marketing", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", size: "middle", children: "Сохранить настройки уведомлений" }) })
    ] })
  ] });
};
const AISettingsTab = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("AI настройки сохранены:", values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-xs)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { marginTop: 0 }, children: "Настройки искусственного интеллекта" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Персонализация AI", description: "Настройте параметры AI для более персонализированного общения и лучших результатов.", type: "info", showIcon: true, style: { marginBottom: "var(--sp-spacing-sm)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "vertical", onFinish, initialValues: { aiPersonality: "balanced", responseLength: "medium", creativityLevel: "medium", contextMemory: true, learningMode: true }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Личность AI" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Стиль общения", name: "aiPersonality", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "formal", children: "Формальный" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "friendly", children: "Дружелюбный" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "professional", children: "Профессиональный" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "creative", children: "Креативный" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "balanced", children: "Сбалансированный" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Длина ответов", name: "responseLength", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "short", children: "Краткие" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "medium", children: "Средние" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "long", children: "Подробные" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Уровень креативности", name: "creativityLevel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "low", children: "Низкий" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "medium", children: "Средний" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "high", children: "Высокий" })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Продвинутые настройки" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 12], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Запоминание контекста", name: "contextMemory", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Режим обучения", name: "learningMode", valuePropName: "checked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {}) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", size: "middle", children: "Сохранить AI настройки" }) })
    ] })
  ] });
};
const DebugTab = ({ openDebugTool }) => {
  const [apiStatus, setApiStatus] = reactExports.useState("Не проверено");
  const [apiStatusType, setApiStatusType] = reactExports.useState("info");
  const testAPI = async () => {
    try {
      setApiStatus("Проверка...");
      setApiStatusType("info");
      const hdrs = {};
      try {
        const id = sessionStorage.getItem("tg_id");
        if (id) hdrs["X-Telegram-User-ID"] = String(id);
      } catch (e) {
      }
      const response = await fetch("/api/health", { headers: hdrs });
      if (response.ok) {
        const data = await response.json();
        setApiStatus(`✅ API работает: ${data.status} v${data.version}`);
        setApiStatusType("success");
      } else {
        setApiStatus(`❌ Ошибка API: ${response.status}`);
        setApiStatusType("error");
      }
    } catch (error) {
      setApiStatus(`💥 Ошибка соединения: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
      setApiStatusType("error");
    }
  };
  const checkTelegramWebApp = () => {
    var _a, _b, _c, _d, _e, _f;
    const checks = [
      { name: "Window defined", value: typeof window !== "undefined" },
      { name: "Telegram exists", value: !!window.Telegram },
      { name: "WebApp exists", value: !!((_a = window.Telegram) == null ? void 0 : _a.WebApp) },
      { name: "initDataUnsafe exists", value: !!((_c = (_b = window.Telegram) == null ? void 0 : _b.WebApp) == null ? void 0 : _c.initDataUnsafe) },
      { name: "User exists", value: !!((_f = (_e = (_d = window.Telegram) == null ? void 0 : _d.WebApp) == null ? void 0 : _e.initDataUnsafe) == null ? void 0 : _f.user) }
    ];
    return checks;
  };
  const telegramChecks = checkTelegramWebApp();
  const telegramOK = telegramChecks.every((check) => check.value);
  const sessionData = {
    tg_id: sessionStorage.getItem("tg_id"),
    telegram_user: sessionStorage.getItem("telegram_user")
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { marginTop: 0 }, children: "🔧 Debug инструменты" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { children: "Инструменты для диагностики проблем с авторизацией и API подключением" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "🚀 Быстрая диагностика", className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 16, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "API подключение:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: apiStatus,
              type: apiStatusType,
              style: { marginTop: "var(--sp-spacing-sm)", marginBottom: "var(--sp-spacing-sm)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: testAPI, size: "small", children: "Проверить API" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Telegram WebApp:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "var(--sp-spacing-sm)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: telegramOK ? "✅ Все проверки пройдены" : "❌ Есть проблемы",
              type: telegramOK ? "success" : "warning",
              style: { marginBottom: "var(--sp-spacing-sm)" }
            }
          ),
          telegramChecks.map((check, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Tag,
            {
              color: check.value ? "green" : "red",
              style: { marginBottom: 4 },
              children: [
                check.value ? "✅" : "❌",
                " ",
                check.name
              ]
            },
            index
          ))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "💾 SessionStorage", className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 16, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "tg_id:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-xs)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: sessionData.tg_id ? "green" : "red", children: sessionData.tg_id || "Не найден" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "telegram_user:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-xs)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: sessionData.telegram_user ? "green" : "red", children: sessionData.telegram_user ? "Найден" : "Не найден" }) })
        ] }) })
      ] }),
      sessionData.telegram_user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "var(--sp-spacing-md)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Данные пользователя:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1.TextArea,
          {
            value: sessionData.telegram_user,
            readOnly: true,
            rows: 3,
            style: { marginTop: "var(--sp-spacing-sm)" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "🛠️ Инструменты диагностики", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
          onClick: openDebugTool,
          size: "large",
          children: "Открыть полный Debug инструмент"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            try {
              const tg = sessionStorage.getItem("tg_id");
              const rolesCache = sessionStorage.getItem("sp_roles_cache");
              const sticky = sessionStorage.getItem("sp_roles_sticky");
              sessionStorage.clear();
              if (tg) sessionStorage.setItem("tg_id", tg);
              if (rolesCache) sessionStorage.setItem("sp_roles_cache", rolesCache);
              if (sticky) sessionStorage.setItem("sp_roles_sticky", sticky);
            } catch (e) {
            }
            window.location.reload();
          },
          danger: true,
          children: "Очистить SessionStorage и перезагрузить"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            const diagnostics = {
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href,
              apiStatus,
              telegramOK,
              telegramChecks,
              sessionData,
              systemInfo: {
                platform: navigator.platform,
                language: navigator.language,
                screenSize: `${screen.width}x${screen.height}`,
                windowSize: `${window.innerWidth}x${window.innerHeight}`
              }
            };
            const blob = new Blob([JSON.stringify(diagnostics, null, 2)], {
              type: "application/json"
            });
            const url2 = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url2;
            a.download = `soulpulse-diagnostics-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url2);
          },
          type: "default",
          children: "📥 Экспорт полной диагностики"
        }
      )
    ] }) })
  ] });
};
export {
  Settings as default
};
//# sourceMappingURL=Settings-V0xYXPG3.js.map
