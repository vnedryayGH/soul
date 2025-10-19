import { a as reactExports } from "./react-DAIzMmXQ.js";
import { r as _slicedToArray, aQ as canUseDom, ae as _typeof, w as _objectSpread2, ad as _objectWithoutProperties, K as _extends, f as classNames, aR as presetPrimaryColors, aB as Tooltip, Q as genStyleHooks, R as merge, V as resetComponent, U as unit, P as Keyframe, aS as FastColor, C as ConfigContext, o as omit, $ as RefIcon, Y as RefIcon$1, a1 as RefIcon$2, aT as RefIcon$3 } from "./index-B4P9h-k1.js";
var defaultProps = {
  percent: 0,
  prefixCls: "rc-progress",
  strokeColor: "#2db7f5",
  strokeLinecap: "round",
  strokeWidth: 1,
  trailColor: "#D9D9D9",
  trailWidth: 1,
  gapPosition: "bottom"
};
var useTransitionDuration = function useTransitionDuration2() {
  var pathsRef = reactExports.useRef([]);
  var prevTimeStamp = reactExports.useRef(null);
  reactExports.useEffect(function() {
    var now = Date.now();
    var updated = false;
    pathsRef.current.forEach(function(path) {
      if (!path) {
        return;
      }
      updated = true;
      var pathStyle = path.style;
      pathStyle.transitionDuration = ".3s, .3s, .3s, .06s";
      if (prevTimeStamp.current && now - prevTimeStamp.current < 100) {
        pathStyle.transitionDuration = "0s, 0s";
      }
    });
    if (updated) {
      prevTimeStamp.current = Date.now();
    }
  });
  return pathsRef.current;
};
var uuid = 0;
var isBrowserClient = canUseDom();
function getUUID() {
  var retId;
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = "TEST_OR_SSR";
  }
  return retId;
}
const useId = function(id) {
  var _React$useState = reactExports.useState(), _React$useState2 = _slicedToArray(_React$useState, 2), innerId = _React$useState2[0], setInnerId = _React$useState2[1];
  reactExports.useEffect(function() {
    setInnerId("rc_progress_".concat(getUUID()));
  }, []);
  return id || innerId;
};
var Block = function Block2(_ref) {
  var bg = _ref.bg, children = _ref.children;
  return /* @__PURE__ */ reactExports.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: bg
    }
  }, children);
};
function getPtgColors(color, scale) {
  return Object.keys(color).map(function(key) {
    var parsedKey = parseFloat(key);
    var ptgKey = "".concat(Math.floor(parsedKey * scale), "%");
    return "".concat(color[key], " ").concat(ptgKey);
  });
}
var PtgCircle = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, color = props.color, gradientId = props.gradientId, radius = props.radius, circleStyleForStack = props.style, ptg = props.ptg, strokeLinecap = props.strokeLinecap, strokeWidth = props.strokeWidth, size = props.size, gapDegree = props.gapDegree;
  var isGradient = color && _typeof(color) === "object";
  var stroke = isGradient ? "#FFF" : void 0;
  var halfSize = size / 2;
  var circleNode = /* @__PURE__ */ reactExports.createElement("circle", {
    className: "".concat(prefixCls, "-circle-path"),
    r: radius,
    cx: halfSize,
    cy: halfSize,
    stroke,
    strokeLinecap,
    strokeWidth,
    opacity: ptg === 0 ? 0 : 1,
    style: circleStyleForStack,
    ref
  });
  if (!isGradient) {
    return circleNode;
  }
  var maskId = "".concat(gradientId, "-conic");
  var fromDeg = gapDegree ? "".concat(180 + gapDegree / 2, "deg") : "0deg";
  var conicColors = getPtgColors(color, (360 - gapDegree) / 360);
  var linearColors = getPtgColors(color, 1);
  var conicColorBg = "conic-gradient(from ".concat(fromDeg, ", ").concat(conicColors.join(", "), ")");
  var linearColorBg = "linear-gradient(to ".concat(gapDegree ? "bottom" : "top", ", ").concat(linearColors.join(", "), ")");
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("mask", {
    id: maskId
  }, circleNode), /* @__PURE__ */ reactExports.createElement("foreignObject", {
    x: 0,
    y: 0,
    width: size,
    height: size,
    mask: "url(#".concat(maskId, ")")
  }, /* @__PURE__ */ reactExports.createElement(Block, {
    bg: linearColorBg
  }, /* @__PURE__ */ reactExports.createElement(Block, {
    bg: conicColorBg
  }))));
});
var VIEW_BOX_SIZE = 100;
var getCircleStyle = function getCircleStyle2(perimeter, perimeterWithoutGap, offset, percent, rotateDeg, gapDegree, gapPosition, strokeColor, strokeLinecap, strokeWidth) {
  var stepSpace = arguments.length > 10 && arguments[10] !== void 0 ? arguments[10] : 0;
  var offsetDeg = offset / 100 * 360 * ((360 - gapDegree) / 360);
  var positionDeg = gapDegree === 0 ? 0 : {
    bottom: 0,
    top: 180,
    left: 90,
    right: -90
  }[gapPosition];
  var strokeDashoffset = (100 - percent) / 100 * perimeterWithoutGap;
  if (strokeLinecap === "round" && percent !== 100) {
    strokeDashoffset += strokeWidth / 2;
    if (strokeDashoffset >= perimeterWithoutGap) {
      strokeDashoffset = perimeterWithoutGap - 0.01;
    }
  }
  var halfSize = VIEW_BOX_SIZE / 2;
  return {
    stroke: typeof strokeColor === "string" ? strokeColor : void 0,
    strokeDasharray: "".concat(perimeterWithoutGap, "px ").concat(perimeter),
    strokeDashoffset: strokeDashoffset + stepSpace,
    transform: "rotate(".concat(rotateDeg + offsetDeg + positionDeg, "deg)"),
    transformOrigin: "".concat(halfSize, "px ").concat(halfSize, "px"),
    transition: "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",
    fillOpacity: 0
  };
};
var _excluded = ["id", "prefixCls", "steps", "strokeWidth", "trailWidth", "gapDegree", "gapPosition", "trailColor", "strokeLinecap", "style", "className", "strokeColor", "percent"];
function toArray(value) {
  var mergedValue = value !== null && value !== void 0 ? value : [];
  return Array.isArray(mergedValue) ? mergedValue : [mergedValue];
}
var Circle$1 = function Circle2(props) {
  var _defaultProps$props = _objectSpread2(_objectSpread2({}, defaultProps), props), id = _defaultProps$props.id, prefixCls = _defaultProps$props.prefixCls, steps = _defaultProps$props.steps, strokeWidth = _defaultProps$props.strokeWidth, trailWidth = _defaultProps$props.trailWidth, _defaultProps$props$g = _defaultProps$props.gapDegree, gapDegree = _defaultProps$props$g === void 0 ? 0 : _defaultProps$props$g, gapPosition = _defaultProps$props.gapPosition, trailColor = _defaultProps$props.trailColor, strokeLinecap = _defaultProps$props.strokeLinecap, style = _defaultProps$props.style, className = _defaultProps$props.className, strokeColor = _defaultProps$props.strokeColor, percent = _defaultProps$props.percent, restProps = _objectWithoutProperties(_defaultProps$props, _excluded);
  var halfSize = VIEW_BOX_SIZE / 2;
  var mergedId = useId(id);
  var gradientId = "".concat(mergedId, "-gradient");
  var radius = halfSize - strokeWidth / 2;
  var perimeter = Math.PI * 2 * radius;
  var rotateDeg = gapDegree > 0 ? 90 + gapDegree / 2 : -90;
  var perimeterWithoutGap = perimeter * ((360 - gapDegree) / 360);
  var _ref = _typeof(steps) === "object" ? steps : {
    count: steps,
    gap: 2
  }, stepCount = _ref.count, stepGap = _ref.gap;
  var percentList = toArray(percent);
  var strokeColorList = toArray(strokeColor);
  var gradient = strokeColorList.find(function(color) {
    return color && _typeof(color) === "object";
  });
  var isConicGradient = gradient && _typeof(gradient) === "object";
  var mergedStrokeLinecap = isConicGradient ? "butt" : strokeLinecap;
  var circleStyle = getCircleStyle(perimeter, perimeterWithoutGap, 0, 100, rotateDeg, gapDegree, gapPosition, trailColor, mergedStrokeLinecap, strokeWidth);
  var paths = useTransitionDuration();
  var getStokeList = function getStokeList2() {
    var stackPtg = 0;
    return percentList.map(function(ptg, index) {
      var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
      var circleStyleForStack = getCircleStyle(perimeter, perimeterWithoutGap, stackPtg, ptg, rotateDeg, gapDegree, gapPosition, color, mergedStrokeLinecap, strokeWidth);
      stackPtg += ptg;
      return /* @__PURE__ */ reactExports.createElement(PtgCircle, {
        key: index,
        color,
        ptg,
        radius,
        prefixCls,
        gradientId,
        style: circleStyleForStack,
        strokeLinecap: mergedStrokeLinecap,
        strokeWidth,
        gapDegree,
        ref: function ref(elem) {
          paths[index] = elem;
        },
        size: VIEW_BOX_SIZE
      });
    }).reverse();
  };
  var getStepStokeList = function getStepStokeList2() {
    var current = Math.round(stepCount * (percentList[0] / 100));
    var stepPtg = 100 / stepCount;
    var stackPtg = 0;
    return new Array(stepCount).fill(null).map(function(_, index) {
      var color = index <= current - 1 ? strokeColorList[0] : trailColor;
      var stroke = color && _typeof(color) === "object" ? "url(#".concat(gradientId, ")") : void 0;
      var circleStyleForStack = getCircleStyle(perimeter, perimeterWithoutGap, stackPtg, stepPtg, rotateDeg, gapDegree, gapPosition, color, "butt", strokeWidth, stepGap);
      stackPtg += (perimeterWithoutGap - circleStyleForStack.strokeDashoffset + stepGap) * 100 / perimeterWithoutGap;
      return /* @__PURE__ */ reactExports.createElement("circle", {
        key: index,
        className: "".concat(prefixCls, "-circle-path"),
        r: radius,
        cx: halfSize,
        cy: halfSize,
        stroke,
        strokeWidth,
        opacity: 1,
        style: circleStyleForStack,
        ref: function ref(elem) {
          paths[index] = elem;
        }
      });
    });
  };
  return /* @__PURE__ */ reactExports.createElement("svg", _extends({
    className: classNames("".concat(prefixCls, "-circle"), className),
    viewBox: "0 0 ".concat(VIEW_BOX_SIZE, " ").concat(VIEW_BOX_SIZE),
    style,
    id,
    role: "presentation"
  }, restProps), !stepCount && /* @__PURE__ */ reactExports.createElement("circle", {
    className: "".concat(prefixCls, "-circle-trail"),
    r: radius,
    cx: halfSize,
    cy: halfSize,
    stroke: trailColor,
    strokeLinecap: mergedStrokeLinecap,
    strokeWidth: trailWidth || strokeWidth,
    style: circleStyle
  }), stepCount ? getStepStokeList() : getStokeList());
};
function validProgress(progress) {
  if (!progress || progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return progress;
}
function getSuccessPercent({
  success,
  successPercent
}) {
  let percent = successPercent;
  if (success && "progress" in success) {
    percent = success.progress;
  }
  if (success && "percent" in success) {
    percent = success.percent;
  }
  return percent;
}
const getPercentage = ({
  percent,
  success,
  successPercent
}) => {
  const realSuccessPercent = validProgress(getSuccessPercent({
    success,
    successPercent
  }));
  return [realSuccessPercent, validProgress(validProgress(percent) - realSuccessPercent)];
};
const getStrokeColor = ({
  success = {},
  strokeColor
}) => {
  const {
    strokeColor: successColor
  } = success;
  return [successColor || presetPrimaryColors.green, strokeColor || null];
};
const getSize = (size, type, extra) => {
  var _a, _b, _c, _d;
  let width = -1;
  let height = -1;
  if (type === "step") {
    const steps = extra.steps;
    const strokeWidth = extra.strokeWidth;
    if (typeof size === "string" || typeof size === "undefined") {
      width = size === "small" ? 2 : 14;
      height = strokeWidth !== null && strokeWidth !== void 0 ? strokeWidth : 8;
    } else if (typeof size === "number") {
      [width, height] = [size, size];
    } else {
      [width = 14, height = 8] = Array.isArray(size) ? size : [size.width, size.height];
    }
    width *= steps;
  } else if (type === "line") {
    const strokeWidth = extra === null || extra === void 0 ? void 0 : extra.strokeWidth;
    if (typeof size === "string" || typeof size === "undefined") {
      height = strokeWidth || (size === "small" ? 6 : 8);
    } else if (typeof size === "number") {
      [width, height] = [size, size];
    } else {
      [width = -1, height = 8] = Array.isArray(size) ? size : [size.width, size.height];
    }
  } else if (type === "circle" || type === "dashboard") {
    if (typeof size === "string" || typeof size === "undefined") {
      [width, height] = size === "small" ? [60, 60] : [120, 120];
    } else if (typeof size === "number") {
      [width, height] = [size, size];
    } else if (Array.isArray(size)) {
      width = (_b = (_a = size[0]) !== null && _a !== void 0 ? _a : size[1]) !== null && _b !== void 0 ? _b : 120;
      height = (_d = (_c = size[0]) !== null && _c !== void 0 ? _c : size[1]) !== null && _d !== void 0 ? _d : 120;
    }
  }
  return [width, height];
};
const CIRCLE_MIN_STROKE_WIDTH = 3;
const getMinPercent = (width) => CIRCLE_MIN_STROKE_WIDTH / width * 100;
const Circle = (props) => {
  const {
    prefixCls,
    trailColor = null,
    strokeLinecap = "round",
    gapPosition,
    gapDegree,
    width: originWidth = 120,
    type,
    children,
    success,
    size = originWidth,
    steps
  } = props;
  const [width, height] = getSize(size, "circle");
  let {
    strokeWidth
  } = props;
  if (strokeWidth === void 0) {
    strokeWidth = Math.max(getMinPercent(width), 6);
  }
  const circleStyle = {
    width,
    height,
    fontSize: width * 0.15 + 6
  };
  const realGapDegree = reactExports.useMemo(() => {
    if (gapDegree || gapDegree === 0) {
      return gapDegree;
    }
    if (type === "dashboard") {
      return 75;
    }
    return void 0;
  }, [gapDegree, type]);
  const percentArray = getPercentage(props);
  const gapPos = gapPosition || type === "dashboard" && "bottom" || void 0;
  const isGradient = Object.prototype.toString.call(props.strokeColor) === "[object Object]";
  const strokeColor = getStrokeColor({
    success,
    strokeColor: props.strokeColor
  });
  const wrapperClassName = classNames(`${prefixCls}-inner`, {
    [`${prefixCls}-circle-gradient`]: isGradient
  });
  const circleContent = /* @__PURE__ */ reactExports.createElement(Circle$1, {
    steps,
    percent: steps ? percentArray[1] : percentArray,
    strokeWidth,
    trailWidth: strokeWidth,
    strokeColor: steps ? strokeColor[1] : strokeColor,
    strokeLinecap,
    trailColor,
    prefixCls,
    gapDegree: realGapDegree,
    gapPosition: gapPos
  });
  const smallCircle = width <= 20;
  const node = /* @__PURE__ */ reactExports.createElement("div", {
    className: wrapperClassName,
    style: circleStyle
  }, circleContent, !smallCircle && children);
  if (smallCircle) {
    return /* @__PURE__ */ reactExports.createElement(Tooltip, {
      title: children
    }, node);
  }
  return node;
};
const LineStrokeColorVar = "--progress-line-stroke-color";
const Percent = "--progress-percent";
const genAntProgressActive = (isRtl) => {
  const direction = isRtl ? "100%" : "-100%";
  return new Keyframe(`antProgress${isRtl ? "RTL" : "LTR"}Active`, {
    "0%": {
      transform: `translateX(${direction}) scaleX(0)`,
      opacity: 0.1
    },
    "20%": {
      transform: `translateX(${direction}) scaleX(0)`,
      opacity: 0.5
    },
    to: {
      transform: "translateX(0) scaleX(1)",
      opacity: 0
    }
  });
};
const genBaseStyle = (token) => {
  const {
    componentCls: progressCls,
    iconCls: iconPrefixCls
  } = token;
  return {
    [progressCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      display: "inline-block",
      "&-rtl": {
        direction: "rtl"
      },
      "&-line": {
        position: "relative",
        width: "100%",
        fontSize: token.fontSize
      },
      [`${progressCls}-outer`]: {
        display: "inline-flex",
        alignItems: "center",
        width: "100%"
      },
      [`${progressCls}-inner`]: {
        position: "relative",
        display: "inline-block",
        width: "100%",
        flex: 1,
        overflow: "hidden",
        verticalAlign: "middle",
        backgroundColor: token.remainingColor,
        borderRadius: token.lineBorderRadius
      },
      [`${progressCls}-inner:not(${progressCls}-circle-gradient)`]: {
        [`${progressCls}-circle-path`]: {
          stroke: token.defaultColor
        }
      },
      [`${progressCls}-success-bg, ${progressCls}-bg`]: {
        position: "relative",
        background: token.defaultColor,
        borderRadius: token.lineBorderRadius,
        transition: `all ${token.motionDurationSlow} ${token.motionEaseInOutCirc}`
      },
      [`${progressCls}-layout-bottom`]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        [`${progressCls}-text`]: {
          width: "max-content",
          marginInlineStart: 0,
          marginTop: token.marginXXS
        }
      },
      [`${progressCls}-bg`]: {
        overflow: "hidden",
        "&::after": {
          content: '""',
          background: {
            _multi_value_: true,
            value: ["inherit", `var(${LineStrokeColorVar})`]
          },
          height: "100%",
          width: `calc(1 / var(${Percent}) * 100%)`,
          display: "block"
        },
        [`&${progressCls}-bg-inner`]: {
          minWidth: "max-content",
          "&::after": {
            content: "none"
          },
          [`${progressCls}-text-inner`]: {
            color: token.colorWhite,
            [`&${progressCls}-text-bright`]: {
              color: "rgba(0, 0, 0, 0.45)"
            }
          }
        }
      },
      [`${progressCls}-success-bg`]: {
        position: "absolute",
        insetBlockStart: 0,
        insetInlineStart: 0,
        backgroundColor: token.colorSuccess
      },
      [`${progressCls}-text`]: {
        display: "inline-block",
        marginInlineStart: token.marginXS,
        color: token.colorText,
        lineHeight: 1,
        width: "2em",
        whiteSpace: "nowrap",
        textAlign: "start",
        verticalAlign: "middle",
        wordBreak: "normal",
        [iconPrefixCls]: {
          fontSize: token.fontSize
        },
        [`&${progressCls}-text-outer`]: {
          width: "max-content"
        },
        [`&${progressCls}-text-outer${progressCls}-text-start`]: {
          width: "max-content",
          marginInlineStart: 0,
          marginInlineEnd: token.marginXS
        }
      },
      [`${progressCls}-text-inner`]: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        marginInlineStart: 0,
        padding: `0 ${unit(token.paddingXXS)}`,
        [`&${progressCls}-text-start`]: {
          justifyContent: "start"
        },
        [`&${progressCls}-text-end`]: {
          justifyContent: "end"
        }
      },
      [`&${progressCls}-status-active`]: {
        [`${progressCls}-bg::before`]: {
          position: "absolute",
          inset: 0,
          backgroundColor: token.colorBgContainer,
          borderRadius: token.lineBorderRadius,
          opacity: 0,
          animationName: genAntProgressActive(),
          animationDuration: token.progressActiveMotionDuration,
          animationTimingFunction: token.motionEaseOutQuint,
          animationIterationCount: "infinite",
          content: '""'
        }
      },
      [`&${progressCls}-rtl${progressCls}-status-active`]: {
        [`${progressCls}-bg::before`]: {
          animationName: genAntProgressActive(true)
        }
      },
      [`&${progressCls}-status-exception`]: {
        [`${progressCls}-bg`]: {
          backgroundColor: token.colorError
        },
        [`${progressCls}-text`]: {
          color: token.colorError
        }
      },
      [`&${progressCls}-status-exception ${progressCls}-inner:not(${progressCls}-circle-gradient)`]: {
        [`${progressCls}-circle-path`]: {
          stroke: token.colorError
        }
      },
      [`&${progressCls}-status-success`]: {
        [`${progressCls}-bg`]: {
          backgroundColor: token.colorSuccess
        },
        [`${progressCls}-text`]: {
          color: token.colorSuccess
        }
      },
      [`&${progressCls}-status-success ${progressCls}-inner:not(${progressCls}-circle-gradient)`]: {
        [`${progressCls}-circle-path`]: {
          stroke: token.colorSuccess
        }
      }
    })
  };
};
const genCircleStyle = (token) => {
  const {
    componentCls: progressCls,
    iconCls: iconPrefixCls
  } = token;
  return {
    [progressCls]: {
      [`${progressCls}-circle-trail`]: {
        stroke: token.remainingColor
      },
      [`&${progressCls}-circle ${progressCls}-inner`]: {
        position: "relative",
        lineHeight: 1,
        backgroundColor: "transparent"
      },
      [`&${progressCls}-circle ${progressCls}-text`]: {
        position: "absolute",
        insetBlockStart: "50%",
        insetInlineStart: 0,
        width: "100%",
        margin: 0,
        padding: 0,
        color: token.circleTextColor,
        fontSize: token.circleTextFontSize,
        lineHeight: 1,
        whiteSpace: "normal",
        textAlign: "center",
        transform: "translateY(-50%)",
        [iconPrefixCls]: {
          fontSize: token.circleIconFontSize
        }
      },
      [`${progressCls}-circle&-status-exception`]: {
        [`${progressCls}-text`]: {
          color: token.colorError
        }
      },
      [`${progressCls}-circle&-status-success`]: {
        [`${progressCls}-text`]: {
          color: token.colorSuccess
        }
      }
    },
    [`${progressCls}-inline-circle`]: {
      lineHeight: 1,
      [`${progressCls}-inner`]: {
        verticalAlign: "bottom"
      }
    }
  };
};
const genStepStyle = (token) => {
  const {
    componentCls: progressCls
  } = token;
  return {
    [progressCls]: {
      [`${progressCls}-steps`]: {
        display: "inline-block",
        "&-outer": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        },
        "&-item": {
          flexShrink: 0,
          minWidth: token.progressStepMinWidth,
          marginInlineEnd: token.progressStepMarginInlineEnd,
          backgroundColor: token.remainingColor,
          transition: `all ${token.motionDurationSlow}`,
          "&-active": {
            backgroundColor: token.defaultColor
          }
        }
      }
    }
  };
};
const genSmallLine = (token) => {
  const {
    componentCls: progressCls,
    iconCls: iconPrefixCls
  } = token;
  return {
    [progressCls]: {
      [`${progressCls}-small&-line, ${progressCls}-small&-line ${progressCls}-text ${iconPrefixCls}`]: {
        fontSize: token.fontSizeSM
      }
    }
  };
};
const prepareComponentToken = (token) => ({
  circleTextColor: token.colorText,
  defaultColor: token.colorInfo,
  remainingColor: token.colorFillSecondary,
  lineBorderRadius: 100,
  // magic for capsule shape, should be a very large number
  circleTextFontSize: "1em",
  circleIconFontSize: `${token.fontSize / token.fontSizeSM}em`
});
const useStyle = genStyleHooks("Progress", (token) => {
  const progressStepMarginInlineEnd = token.calc(token.marginXXS).div(2).equal();
  const progressToken = merge(token, {
    progressStepMarginInlineEnd,
    progressStepMinWidth: progressStepMarginInlineEnd,
    progressActiveMotionDuration: "2.4s"
  });
  return [genBaseStyle(progressToken), genCircleStyle(progressToken), genStepStyle(progressToken), genSmallLine(progressToken)];
}, prepareComponentToken);
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const sortGradient = (gradients) => {
  let tempArr = [];
  Object.keys(gradients).forEach((key) => {
    const formattedKey = parseFloat(key.replace(/%/g, ""));
    if (!Number.isNaN(formattedKey)) {
      tempArr.push({
        key: formattedKey,
        value: gradients[key]
      });
    }
  });
  tempArr = tempArr.sort((a, b) => a.key - b.key);
  return tempArr.map(({
    key,
    value
  }) => `${value} ${key}%`).join(", ");
};
const handleGradient = (strokeColor, directionConfig) => {
  const {
    from = presetPrimaryColors.blue,
    to = presetPrimaryColors.blue,
    direction = directionConfig === "rtl" ? "to left" : "to right"
  } = strokeColor, rest = __rest$1(strokeColor, ["from", "to", "direction"]);
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest);
    const background2 = `linear-gradient(${direction}, ${sortedGradients})`;
    return {
      background: background2,
      [LineStrokeColorVar]: background2
    };
  }
  const background = `linear-gradient(${direction}, ${from}, ${to})`;
  return {
    background,
    [LineStrokeColorVar]: background
  };
};
const Line = (props) => {
  const {
    prefixCls,
    direction: directionConfig,
    percent,
    size,
    strokeWidth,
    strokeColor,
    strokeLinecap = "round",
    children,
    trailColor = null,
    percentPosition,
    success
  } = props;
  const {
    align: infoAlign,
    type: infoPosition
  } = percentPosition;
  const backgroundProps = strokeColor && typeof strokeColor !== "string" ? handleGradient(strokeColor, directionConfig) : {
    [LineStrokeColorVar]: strokeColor,
    background: strokeColor
  };
  const borderRadius = strokeLinecap === "square" || strokeLinecap === "butt" ? 0 : void 0;
  const mergedSize = size !== null && size !== void 0 ? size : [-1, strokeWidth || (size === "small" ? 6 : 8)];
  const [width, height] = getSize(mergedSize, "line", {
    strokeWidth
  });
  const trailStyle = {
    backgroundColor: trailColor || void 0,
    borderRadius
  };
  const percentStyle = Object.assign(Object.assign({
    width: `${validProgress(percent)}%`,
    height,
    borderRadius
  }, backgroundProps), {
    [Percent]: validProgress(percent) / 100
  });
  const successPercent = getSuccessPercent(props);
  const successPercentStyle = {
    width: `${validProgress(successPercent)}%`,
    height,
    borderRadius,
    backgroundColor: success === null || success === void 0 ? void 0 : success.strokeColor
  };
  const outerStyle = {
    width: width < 0 ? "100%" : width
  };
  const lineInner = /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-inner`,
    style: trailStyle
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-bg`, `${prefixCls}-bg-${infoPosition}`),
    style: percentStyle
  }, infoPosition === "inner" && children), successPercent !== void 0 && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-success-bg`,
    style: successPercentStyle
  }));
  const isOuterStart = infoPosition === "outer" && infoAlign === "start";
  const isOuterEnd = infoPosition === "outer" && infoAlign === "end";
  return infoPosition === "outer" && infoAlign === "center" ? /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-layout-bottom`
  }, lineInner, children) : /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-outer`,
    style: outerStyle
  }, isOuterStart && children, lineInner, isOuterEnd && children);
};
const Steps = (props) => {
  const {
    size,
    steps,
    rounding: customRounding = Math.round,
    percent = 0,
    strokeWidth = 8,
    strokeColor,
    trailColor = null,
    prefixCls,
    children
  } = props;
  const current = customRounding(steps * (percent / 100));
  const stepWidth = size === "small" ? 2 : 14;
  const mergedSize = size !== null && size !== void 0 ? size : [stepWidth, strokeWidth];
  const [width, height] = getSize(mergedSize, "step", {
    steps,
    strokeWidth
  });
  const unitWidth = width / steps;
  const styledSteps = Array.from({
    length: steps
  });
  for (let i = 0; i < steps; i++) {
    const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;
    styledSteps[i] = /* @__PURE__ */ reactExports.createElement("div", {
      key: i,
      className: classNames(`${prefixCls}-steps-item`, {
        [`${prefixCls}-steps-item-active`]: i <= current - 1
      }),
      style: {
        backgroundColor: i <= current - 1 ? color : trailColor,
        width: unitWidth,
        height
      }
    });
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-steps-outer`
  }, styledSteps, children);
};
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ProgressStatuses = ["normal", "exception", "active", "success"];
const Progress = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    steps,
    strokeColor,
    percent = 0,
    size = "default",
    showInfo = true,
    type = "line",
    status,
    format,
    style,
    percentPosition = {}
  } = props, restProps = __rest(props, ["prefixCls", "className", "rootClassName", "steps", "strokeColor", "percent", "size", "showInfo", "type", "status", "format", "style", "percentPosition"]);
  const {
    align: infoAlign = "end",
    type: infoPosition = "outer"
  } = percentPosition;
  const strokeColorNotArray = Array.isArray(strokeColor) ? strokeColor[0] : strokeColor;
  const strokeColorNotGradient = typeof strokeColor === "string" || Array.isArray(strokeColor) ? strokeColor : void 0;
  const strokeColorIsBright = reactExports.useMemo(() => {
    if (strokeColorNotArray) {
      const color = typeof strokeColorNotArray === "string" ? strokeColorNotArray : Object.values(strokeColorNotArray)[0];
      return new FastColor(color).isLight();
    }
    return false;
  }, [strokeColor]);
  const percentNumber = reactExports.useMemo(() => {
    var _a, _b;
    const successPercent = getSuccessPercent(props);
    return parseInt(successPercent !== void 0 ? (_a = successPercent !== null && successPercent !== void 0 ? successPercent : 0) === null || _a === void 0 ? void 0 : _a.toString() : (_b = percent !== null && percent !== void 0 ? percent : 0) === null || _b === void 0 ? void 0 : _b.toString(), 10);
  }, [percent, props.success, props.successPercent]);
  const progressStatus = reactExports.useMemo(() => {
    if (!ProgressStatuses.includes(status) && percentNumber >= 100) {
      return "success";
    }
    return status || "normal";
  }, [status, percentNumber]);
  const {
    getPrefixCls,
    direction,
    progress: progressStyle
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("progress", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const isLineType = type === "line";
  const isPureLineType = isLineType && !steps;
  const progressInfo = reactExports.useMemo(() => {
    if (!showInfo) {
      return null;
    }
    const successPercent = getSuccessPercent(props);
    let text;
    const textFormatter = format || ((number) => `${number}%`);
    const isBrightInnerColor = isLineType && strokeColorIsBright && infoPosition === "inner";
    if (infoPosition === "inner" || format || progressStatus !== "exception" && progressStatus !== "success") {
      text = textFormatter(validProgress(percent), validProgress(successPercent));
    } else if (progressStatus === "exception") {
      text = isLineType ? /* @__PURE__ */ reactExports.createElement(RefIcon, null) : /* @__PURE__ */ reactExports.createElement(RefIcon$1, null);
    } else if (progressStatus === "success") {
      text = isLineType ? /* @__PURE__ */ reactExports.createElement(RefIcon$2, null) : /* @__PURE__ */ reactExports.createElement(RefIcon$3, null);
    }
    return /* @__PURE__ */ reactExports.createElement("span", {
      className: classNames(`${prefixCls}-text`, {
        [`${prefixCls}-text-bright`]: isBrightInnerColor,
        [`${prefixCls}-text-${infoAlign}`]: isPureLineType,
        [`${prefixCls}-text-${infoPosition}`]: isPureLineType
      }),
      title: typeof text === "string" ? text : void 0
    }, text);
  }, [showInfo, percent, percentNumber, progressStatus, type, prefixCls, format]);
  let progress;
  if (type === "line") {
    progress = steps ? /* @__PURE__ */ reactExports.createElement(Steps, Object.assign({}, props, {
      strokeColor: strokeColorNotGradient,
      prefixCls,
      steps: typeof steps === "object" ? steps.count : steps
    }), progressInfo) : /* @__PURE__ */ reactExports.createElement(Line, Object.assign({}, props, {
      strokeColor: strokeColorNotArray,
      prefixCls,
      direction,
      percentPosition: {
        align: infoAlign,
        type: infoPosition
      }
    }), progressInfo);
  } else if (type === "circle" || type === "dashboard") {
    progress = /* @__PURE__ */ reactExports.createElement(Circle, Object.assign({}, props, {
      strokeColor: strokeColorNotArray,
      prefixCls,
      progressStatus
    }), progressInfo);
  }
  const classString = classNames(prefixCls, `${prefixCls}-status-${progressStatus}`, {
    [`${prefixCls}-${type === "dashboard" && "circle" || type}`]: type !== "line",
    [`${prefixCls}-inline-circle`]: type === "circle" && getSize(size, "circle")[0] <= 20,
    [`${prefixCls}-line`]: isPureLineType,
    [`${prefixCls}-line-align-${infoAlign}`]: isPureLineType,
    [`${prefixCls}-line-position-${infoPosition}`]: isPureLineType,
    [`${prefixCls}-steps`]: steps,
    [`${prefixCls}-show-info`]: showInfo,
    [`${prefixCls}-${size}`]: typeof size === "string",
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, progressStyle === null || progressStyle === void 0 ? void 0 : progressStyle.className, className, rootClassName, hashId, cssVarCls);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", Object.assign({
    ref,
    style: Object.assign(Object.assign({}, progressStyle === null || progressStyle === void 0 ? void 0 : progressStyle.style), style),
    className: classString,
    role: "progressbar",
    "aria-valuenow": percentNumber,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, omit(restProps, ["trailColor", "strokeWidth", "width", "gapDegree", "gapPosition", "strokeLinecap", "success", "successPercent"])), progress));
});
export {
  Progress as P
};
//# sourceMappingURL=progress-CLbv5c2s.js.map
