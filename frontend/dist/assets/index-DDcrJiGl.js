import { a as reactExports } from "./react-DAIzMmXQ.js";
import { Q as genStyleHooks, R as merge, bA as genPresetColor, V as resetComponent, P as Keyframe, U as unit, C as ConfigContext, bB as isPresetColor, f as classNames, bz as cloneElement, ab as CSSMotion } from "./index-B4P9h-k1.js";
const antStatusProcessing = new Keyframe("antStatusProcessing", {
  "0%": {
    transform: "scale(0.8)",
    opacity: 0.5
  },
  "100%": {
    transform: "scale(2.4)",
    opacity: 0
  }
});
const antZoomBadgeIn = new Keyframe("antZoomBadgeIn", {
  "0%": {
    transform: "scale(0) translate(50%, -50%)",
    opacity: 0
  },
  "100%": {
    transform: "scale(1) translate(50%, -50%)"
  }
});
const antZoomBadgeOut = new Keyframe("antZoomBadgeOut", {
  "0%": {
    transform: "scale(1) translate(50%, -50%)"
  },
  "100%": {
    transform: "scale(0) translate(50%, -50%)",
    opacity: 0
  }
});
const antNoWrapperZoomBadgeIn = new Keyframe("antNoWrapperZoomBadgeIn", {
  "0%": {
    transform: "scale(0)",
    opacity: 0
  },
  "100%": {
    transform: "scale(1)"
  }
});
const antNoWrapperZoomBadgeOut = new Keyframe("antNoWrapperZoomBadgeOut", {
  "0%": {
    transform: "scale(1)"
  },
  "100%": {
    transform: "scale(0)",
    opacity: 0
  }
});
const antBadgeLoadingCircle = new Keyframe("antBadgeLoadingCircle", {
  "0%": {
    transformOrigin: "50%"
  },
  "100%": {
    transform: "translate(50%, -50%) rotate(360deg)",
    transformOrigin: "50%"
  }
});
const genSharedBadgeStyle = (token) => {
  const {
    componentCls,
    iconCls,
    antCls,
    badgeShadowSize,
    textFontSize,
    textFontSizeSM,
    statusSize,
    dotSize,
    textFontWeight,
    indicatorHeight,
    indicatorHeightSM,
    marginXS,
    calc
  } = token;
  const numberPrefixCls = `${antCls}-scroll-number`;
  const colorPreset = genPresetColor(token, (colorKey, {
    darkColor
  }) => ({
    [`&${componentCls} ${componentCls}-color-${colorKey}`]: {
      background: darkColor,
      [`&:not(${componentCls}-count)`]: {
        color: darkColor
      },
      "a:hover &": {
        background: darkColor
      }
    }
  }));
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      position: "relative",
      display: "inline-block",
      width: "fit-content",
      lineHeight: 1,
      [`${componentCls}-count`]: {
        display: "inline-flex",
        justifyContent: "center",
        zIndex: token.indicatorZIndex,
        minWidth: indicatorHeight,
        height: indicatorHeight,
        color: token.badgeTextColor,
        fontWeight: textFontWeight,
        fontSize: textFontSize,
        lineHeight: unit(indicatorHeight),
        whiteSpace: "nowrap",
        textAlign: "center",
        background: token.badgeColor,
        borderRadius: calc(indicatorHeight).div(2).equal(),
        boxShadow: `0 0 0 ${unit(badgeShadowSize)} ${token.badgeShadowColor}`,
        transition: `background ${token.motionDurationMid}`,
        a: {
          color: token.badgeTextColor
        },
        "a:hover": {
          color: token.badgeTextColor
        },
        "a:hover &": {
          background: token.badgeColorHover
        }
      },
      [`${componentCls}-count-sm`]: {
        minWidth: indicatorHeightSM,
        height: indicatorHeightSM,
        fontSize: textFontSizeSM,
        lineHeight: unit(indicatorHeightSM),
        borderRadius: calc(indicatorHeightSM).div(2).equal()
      },
      [`${componentCls}-multiple-words`]: {
        padding: `0 ${unit(token.paddingXS)}`,
        bdi: {
          unicodeBidi: "plaintext"
        }
      },
      [`${componentCls}-dot`]: {
        zIndex: token.indicatorZIndex,
        width: dotSize,
        minWidth: dotSize,
        height: dotSize,
        background: token.badgeColor,
        borderRadius: "100%",
        boxShadow: `0 0 0 ${unit(badgeShadowSize)} ${token.badgeShadowColor}`
      },
      [`${componentCls}-count, ${componentCls}-dot, ${numberPrefixCls}-custom-component`]: {
        position: "absolute",
        top: 0,
        insetInlineEnd: 0,
        transform: "translate(50%, -50%)",
        transformOrigin: "100% 0%",
        [`&${iconCls}-spin`]: {
          animationName: antBadgeLoadingCircle,
          animationDuration: "1s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear"
        }
      },
      [`&${componentCls}-status`]: {
        lineHeight: "inherit",
        verticalAlign: "baseline",
        [`${componentCls}-status-dot`]: {
          position: "relative",
          top: -1,
          // Magic number, but seems better experience
          display: "inline-block",
          width: statusSize,
          height: statusSize,
          verticalAlign: "middle",
          borderRadius: "50%"
        },
        [`${componentCls}-status-success`]: {
          backgroundColor: token.colorSuccess
        },
        [`${componentCls}-status-processing`]: {
          overflow: "visible",
          color: token.colorInfo,
          backgroundColor: token.colorInfo,
          borderColor: "currentcolor",
          "&::after": {
            position: "absolute",
            top: 0,
            insetInlineStart: 0,
            width: "100%",
            height: "100%",
            borderWidth: badgeShadowSize,
            borderStyle: "solid",
            borderColor: "inherit",
            borderRadius: "50%",
            animationName: antStatusProcessing,
            animationDuration: token.badgeProcessingDuration,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            content: '""'
          }
        },
        [`${componentCls}-status-default`]: {
          backgroundColor: token.colorTextPlaceholder
        },
        [`${componentCls}-status-error`]: {
          backgroundColor: token.colorError
        },
        [`${componentCls}-status-warning`]: {
          backgroundColor: token.colorWarning
        },
        [`${componentCls}-status-text`]: {
          marginInlineStart: marginXS,
          color: token.colorText,
          fontSize: token.fontSize
        }
      }
    }), colorPreset), {
      [`${componentCls}-zoom-appear, ${componentCls}-zoom-enter`]: {
        animationName: antZoomBadgeIn,
        animationDuration: token.motionDurationSlow,
        animationTimingFunction: token.motionEaseOutBack,
        animationFillMode: "both"
      },
      [`${componentCls}-zoom-leave`]: {
        animationName: antZoomBadgeOut,
        animationDuration: token.motionDurationSlow,
        animationTimingFunction: token.motionEaseOutBack,
        animationFillMode: "both"
      },
      [`&${componentCls}-not-a-wrapper`]: {
        [`${componentCls}-zoom-appear, ${componentCls}-zoom-enter`]: {
          animationName: antNoWrapperZoomBadgeIn,
          animationDuration: token.motionDurationSlow,
          animationTimingFunction: token.motionEaseOutBack
        },
        [`${componentCls}-zoom-leave`]: {
          animationName: antNoWrapperZoomBadgeOut,
          animationDuration: token.motionDurationSlow,
          animationTimingFunction: token.motionEaseOutBack
        },
        [`&:not(${componentCls}-status)`]: {
          verticalAlign: "middle"
        },
        [`${numberPrefixCls}-custom-component, ${componentCls}-count`]: {
          transform: "none"
        },
        [`${numberPrefixCls}-custom-component, ${numberPrefixCls}`]: {
          position: "relative",
          top: "auto",
          display: "block",
          transformOrigin: "50% 50%"
        }
      },
      [numberPrefixCls]: {
        overflow: "hidden",
        transition: `all ${token.motionDurationMid} ${token.motionEaseOutBack}`,
        [`${numberPrefixCls}-only`]: {
          position: "relative",
          display: "inline-block",
          height: indicatorHeight,
          transition: `all ${token.motionDurationSlow} ${token.motionEaseOutBack}`,
          WebkitTransformStyle: "preserve-3d",
          WebkitBackfaceVisibility: "hidden",
          [`> p${numberPrefixCls}-only-unit`]: {
            height: indicatorHeight,
            margin: 0,
            WebkitTransformStyle: "preserve-3d",
            WebkitBackfaceVisibility: "hidden"
          }
        },
        [`${numberPrefixCls}-symbol`]: {
          verticalAlign: "top"
        }
      },
      // ====================== RTL =======================
      "&-rtl": {
        direction: "rtl",
        [`${componentCls}-count, ${componentCls}-dot, ${numberPrefixCls}-custom-component`]: {
          transform: "translate(-50%, -50%)"
        }
      }
    })
  };
};
const prepareToken = (token) => {
  const {
    fontHeight,
    lineWidth,
    marginXS,
    colorBorderBg
  } = token;
  const badgeFontHeight = fontHeight;
  const badgeShadowSize = lineWidth;
  const badgeTextColor = token.colorTextLightSolid;
  const badgeColor = token.colorError;
  const badgeColorHover = token.colorErrorHover;
  const badgeToken = merge(token, {
    badgeFontHeight,
    badgeShadowSize,
    badgeTextColor,
    badgeColor,
    badgeColorHover,
    badgeShadowColor: colorBorderBg,
    badgeProcessingDuration: "1.2s",
    badgeRibbonOffset: marginXS,
    // Follow token just by Design. Not related with token
    badgeRibbonCornerTransform: "scaleY(0.75)",
    badgeRibbonCornerFilter: `brightness(75%)`
  });
  return badgeToken;
};
const prepareComponentToken = (token) => {
  const {
    fontSize,
    lineHeight,
    fontSizeSM,
    lineWidth
  } = token;
  return {
    indicatorZIndex: "auto",
    indicatorHeight: Math.round(fontSize * lineHeight) - 2 * lineWidth,
    indicatorHeightSM: fontSize,
    dotSize: fontSizeSM / 2,
    textFontSize: fontSizeSM,
    textFontSizeSM: fontSizeSM,
    textFontWeight: "normal",
    statusSize: fontSizeSM / 2
  };
};
const useStyle$1 = genStyleHooks("Badge", (token) => {
  const badgeToken = prepareToken(token);
  return genSharedBadgeStyle(badgeToken);
}, prepareComponentToken);
const genRibbonStyle = (token) => {
  const {
    antCls,
    badgeFontHeight,
    marginXS,
    badgeRibbonOffset,
    calc
  } = token;
  const ribbonPrefixCls = `${antCls}-ribbon`;
  const ribbonWrapperPrefixCls = `${antCls}-ribbon-wrapper`;
  const statusRibbonPreset = genPresetColor(token, (colorKey, {
    darkColor
  }) => ({
    [`&${ribbonPrefixCls}-color-${colorKey}`]: {
      background: darkColor,
      color: darkColor
    }
  }));
  return {
    [ribbonWrapperPrefixCls]: {
      position: "relative"
    },
    [ribbonPrefixCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      position: "absolute",
      top: marginXS,
      padding: `0 ${unit(token.paddingXS)}`,
      color: token.colorPrimary,
      lineHeight: unit(badgeFontHeight),
      whiteSpace: "nowrap",
      backgroundColor: token.colorPrimary,
      borderRadius: token.borderRadiusSM,
      [`${ribbonPrefixCls}-text`]: {
        color: token.badgeTextColor
      },
      [`${ribbonPrefixCls}-corner`]: {
        position: "absolute",
        top: "100%",
        width: badgeRibbonOffset,
        height: badgeRibbonOffset,
        color: "currentcolor",
        border: `${unit(calc(badgeRibbonOffset).div(2).equal())} solid`,
        transform: token.badgeRibbonCornerTransform,
        transformOrigin: "top",
        filter: token.badgeRibbonCornerFilter
      }
    }), statusRibbonPreset), {
      [`&${ribbonPrefixCls}-placement-end`]: {
        insetInlineEnd: calc(badgeRibbonOffset).mul(-1).equal(),
        borderEndEndRadius: 0,
        [`${ribbonPrefixCls}-corner`]: {
          insetInlineEnd: 0,
          borderInlineEndColor: "transparent",
          borderBlockEndColor: "transparent"
        }
      },
      [`&${ribbonPrefixCls}-placement-start`]: {
        insetInlineStart: calc(badgeRibbonOffset).mul(-1).equal(),
        borderEndStartRadius: 0,
        [`${ribbonPrefixCls}-corner`]: {
          insetInlineStart: 0,
          borderBlockEndColor: "transparent",
          borderInlineStartColor: "transparent"
        }
      },
      // ====================== RTL =======================
      "&-rtl": {
        direction: "rtl"
      }
    })
  };
};
const useStyle = genStyleHooks(["Badge", "Ribbon"], (token) => {
  const badgeToken = prepareToken(token);
  return genRibbonStyle(badgeToken);
}, prepareComponentToken);
const Ribbon = (props) => {
  const {
    className,
    prefixCls: customizePrefixCls,
    style,
    color,
    children,
    text,
    placement = "end",
    rootClassName
  } = props;
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("ribbon", customizePrefixCls);
  const wrapperCls = `${prefixCls}-wrapper`;
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, wrapperCls);
  const colorInPreset = isPresetColor(color, false);
  const ribbonCls = classNames(prefixCls, `${prefixCls}-placement-${placement}`, {
    [`${prefixCls}-rtl`]: direction === "rtl",
    [`${prefixCls}-color-${color}`]: colorInPreset
  }, className);
  const colorStyle = {};
  const cornerColorStyle = {};
  if (color && !colorInPreset) {
    colorStyle.background = color;
    cornerColorStyle.color = color;
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(wrapperCls, rootClassName, hashId, cssVarCls)
  }, children, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(ribbonCls, hashId),
    style: Object.assign(Object.assign({}, colorStyle), style)
  }, /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-text`
  }, text), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-corner`,
    style: cornerColorStyle
  }))));
};
const UnitNumber = (props) => {
  const {
    prefixCls,
    value,
    current,
    offset = 0
  } = props;
  let style;
  if (offset) {
    style = {
      position: "absolute",
      top: `${offset}00%`,
      left: 0
    };
  }
  return /* @__PURE__ */ reactExports.createElement("span", {
    style,
    className: classNames(`${prefixCls}-only-unit`, {
      current
    })
  }, value);
};
function getOffset(start, end, unit2) {
  let index = start;
  let offset = 0;
  while ((index + 10) % 10 !== end) {
    index += unit2;
    offset += unit2;
  }
  return offset;
}
const SingleNumber = (props) => {
  const {
    prefixCls,
    count: originCount,
    value: originValue
  } = props;
  const value = Number(originValue);
  const count = Math.abs(originCount);
  const [prevValue, setPrevValue] = reactExports.useState(value);
  const [prevCount, setPrevCount] = reactExports.useState(count);
  const onTransitionEnd = () => {
    setPrevValue(value);
    setPrevCount(count);
  };
  reactExports.useEffect(() => {
    const timer = setTimeout(onTransitionEnd, 1e3);
    return () => clearTimeout(timer);
  }, [value]);
  let unitNodes;
  let offsetStyle;
  if (prevValue === value || Number.isNaN(value) || Number.isNaN(prevValue)) {
    unitNodes = [/* @__PURE__ */ reactExports.createElement(UnitNumber, Object.assign({}, props, {
      key: value,
      current: true
    }))];
    offsetStyle = {
      transition: "none"
    };
  } else {
    unitNodes = [];
    const end = value + 10;
    const unitNumberList = [];
    for (let index = value; index <= end; index += 1) {
      unitNumberList.push(index);
    }
    const unit2 = prevCount < count ? 1 : -1;
    const prevIndex = unitNumberList.findIndex((n) => n % 10 === prevValue);
    const cutUnitNumberList = unit2 < 0 ? unitNumberList.slice(0, prevIndex + 1) : unitNumberList.slice(prevIndex);
    unitNodes = cutUnitNumberList.map((n, index) => {
      const singleUnit = n % 10;
      return /* @__PURE__ */ reactExports.createElement(UnitNumber, Object.assign({}, props, {
        key: n,
        value: singleUnit,
        offset: unit2 < 0 ? index - prevIndex : index,
        current: index === prevIndex
      }));
    });
    offsetStyle = {
      transform: `translateY(${-getOffset(prevValue, value, unit2)}00%)`
    };
  }
  return /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-only`,
    style: offsetStyle,
    onTransitionEnd
  }, unitNodes);
};
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ScrollNumber = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    count,
    className,
    motionClassName,
    style,
    title,
    show,
    component: Component = "sup",
    children
  } = props, restProps = __rest$1(props, ["prefixCls", "count", "className", "motionClassName", "style", "title", "show", "component", "children"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("scroll-number", customizePrefixCls);
  const newProps = Object.assign(Object.assign({}, restProps), {
    "data-show": show,
    style,
    className: classNames(prefixCls, className, motionClassName),
    title
  });
  let numberNodes = count;
  if (count && Number(count) % 1 === 0) {
    const numberList = String(count).split("");
    numberNodes = /* @__PURE__ */ reactExports.createElement("bdi", null, numberList.map((num, i) => /* @__PURE__ */ reactExports.createElement(SingleNumber, {
      prefixCls,
      count: Number(count),
      value: num,
      // eslint-disable-next-line react/no-array-index-key
      key: numberList.length - i
    })));
  }
  if (style === null || style === void 0 ? void 0 : style.borderColor) {
    newProps.style = Object.assign(Object.assign({}, style), {
      boxShadow: `0 0 0 1px ${style.borderColor} inset`
    });
  }
  if (children) {
    return cloneElement(children, (oriProps) => ({
      className: classNames(`${prefixCls}-custom-component`, oriProps === null || oriProps === void 0 ? void 0 : oriProps.className, motionClassName)
    }));
  }
  return /* @__PURE__ */ reactExports.createElement(Component, Object.assign({}, newProps, {
    ref
  }), numberNodes);
});
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const InternalBadge = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  var _a, _b, _c, _d, _e;
  const {
    prefixCls: customizePrefixCls,
    scrollNumberPrefixCls: customizeScrollNumberPrefixCls,
    children,
    status,
    text,
    color,
    count = null,
    overflowCount = 99,
    dot = false,
    size = "default",
    title,
    offset,
    style,
    className,
    rootClassName,
    classNames: classNames$1,
    styles,
    showZero = false
  } = props, restProps = __rest(props, ["prefixCls", "scrollNumberPrefixCls", "children", "status", "text", "color", "count", "overflowCount", "dot", "size", "title", "offset", "style", "className", "rootClassName", "classNames", "styles", "showZero"]);
  const {
    getPrefixCls,
    direction,
    badge
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("badge", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle$1(prefixCls);
  const numberedDisplayCount = count > overflowCount ? `${overflowCount}+` : count;
  const isZero = numberedDisplayCount === "0" || numberedDisplayCount === 0;
  const ignoreCount = count === null || isZero && !showZero;
  const hasStatus = (status !== null && status !== void 0 || color !== null && color !== void 0) && ignoreCount;
  const hasStatusValue = status !== null && status !== void 0 || !isZero;
  const showAsDot = dot && !isZero;
  const mergedCount = showAsDot ? "" : numberedDisplayCount;
  const isHidden = reactExports.useMemo(() => {
    const isEmpty = mergedCount === null || mergedCount === void 0 || mergedCount === "";
    return (isEmpty || isZero && !showZero) && !showAsDot;
  }, [mergedCount, isZero, showZero, showAsDot]);
  const countRef = reactExports.useRef(count);
  if (!isHidden) {
    countRef.current = count;
  }
  const livingCount = countRef.current;
  const displayCountRef = reactExports.useRef(mergedCount);
  if (!isHidden) {
    displayCountRef.current = mergedCount;
  }
  const displayCount = displayCountRef.current;
  const isDotRef = reactExports.useRef(showAsDot);
  if (!isHidden) {
    isDotRef.current = showAsDot;
  }
  const mergedStyle = reactExports.useMemo(() => {
    if (!offset) {
      return Object.assign(Object.assign({}, badge === null || badge === void 0 ? void 0 : badge.style), style);
    }
    const offsetStyle = {
      marginTop: offset[1]
    };
    if (direction === "rtl") {
      offsetStyle.left = parseInt(offset[0], 10);
    } else {
      offsetStyle.right = -parseInt(offset[0], 10);
    }
    return Object.assign(Object.assign(Object.assign({}, offsetStyle), badge === null || badge === void 0 ? void 0 : badge.style), style);
  }, [direction, offset, style, badge === null || badge === void 0 ? void 0 : badge.style]);
  const titleNode = title !== null && title !== void 0 ? title : typeof livingCount === "string" || typeof livingCount === "number" ? livingCount : void 0;
  const statusTextNode = isHidden || !text ? null : /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-status-text`
  }, text);
  const displayNode = !livingCount || typeof livingCount !== "object" ? void 0 : cloneElement(livingCount, (oriProps) => ({
    style: Object.assign(Object.assign({}, mergedStyle), oriProps.style)
  }));
  const isInternalColor = isPresetColor(color, false);
  const statusCls = classNames(classNames$1 === null || classNames$1 === void 0 ? void 0 : classNames$1.indicator, (_a = badge === null || badge === void 0 ? void 0 : badge.classNames) === null || _a === void 0 ? void 0 : _a.indicator, {
    [`${prefixCls}-status-dot`]: hasStatus,
    [`${prefixCls}-status-${status}`]: !!status,
    [`${prefixCls}-color-${color}`]: isInternalColor
  });
  const statusStyle = {};
  if (color && !isInternalColor) {
    statusStyle.color = color;
    statusStyle.background = color;
  }
  const badgeClassName = classNames(prefixCls, {
    [`${prefixCls}-status`]: hasStatus,
    [`${prefixCls}-not-a-wrapper`]: !children,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, className, rootClassName, badge === null || badge === void 0 ? void 0 : badge.className, (_b = badge === null || badge === void 0 ? void 0 : badge.classNames) === null || _b === void 0 ? void 0 : _b.root, classNames$1 === null || classNames$1 === void 0 ? void 0 : classNames$1.root, hashId, cssVarCls);
  if (!children && hasStatus && (text || hasStatusValue || !ignoreCount)) {
    const statusTextColor = mergedStyle.color;
    return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("span", Object.assign({}, restProps, {
      className: badgeClassName,
      style: Object.assign(Object.assign(Object.assign({}, styles === null || styles === void 0 ? void 0 : styles.root), (_c = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _c === void 0 ? void 0 : _c.root), mergedStyle)
    }), /* @__PURE__ */ reactExports.createElement("span", {
      className: statusCls,
      style: Object.assign(Object.assign(Object.assign({}, styles === null || styles === void 0 ? void 0 : styles.indicator), (_d = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _d === void 0 ? void 0 : _d.indicator), statusStyle)
    }), text && /* @__PURE__ */ reactExports.createElement("span", {
      style: {
        color: statusTextColor
      },
      className: `${prefixCls}-status-text`
    }, text)));
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("span", Object.assign({
    ref
  }, restProps, {
    className: badgeClassName,
    style: Object.assign(Object.assign({}, (_e = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _e === void 0 ? void 0 : _e.root), styles === null || styles === void 0 ? void 0 : styles.root)
  }), children, /* @__PURE__ */ reactExports.createElement(CSSMotion, {
    visible: !isHidden,
    motionName: `${prefixCls}-zoom`,
    motionAppear: false,
    motionDeadline: 1e3
  }, ({
    className: motionClassName
  }) => {
    var _a2, _b2;
    const scrollNumberPrefixCls = getPrefixCls("scroll-number", customizeScrollNumberPrefixCls);
    const isDot = isDotRef.current;
    const scrollNumberCls = classNames(classNames$1 === null || classNames$1 === void 0 ? void 0 : classNames$1.indicator, (_a2 = badge === null || badge === void 0 ? void 0 : badge.classNames) === null || _a2 === void 0 ? void 0 : _a2.indicator, {
      [`${prefixCls}-dot`]: isDot,
      [`${prefixCls}-count`]: !isDot,
      [`${prefixCls}-count-sm`]: size === "small",
      [`${prefixCls}-multiple-words`]: !isDot && displayCount && displayCount.toString().length > 1,
      [`${prefixCls}-status-${status}`]: !!status,
      [`${prefixCls}-color-${color}`]: isInternalColor
    });
    let scrollNumberStyle = Object.assign(Object.assign(Object.assign({}, styles === null || styles === void 0 ? void 0 : styles.indicator), (_b2 = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _b2 === void 0 ? void 0 : _b2.indicator), mergedStyle);
    if (color && !isInternalColor) {
      scrollNumberStyle = scrollNumberStyle || {};
      scrollNumberStyle.background = color;
    }
    return /* @__PURE__ */ reactExports.createElement(ScrollNumber, {
      prefixCls: scrollNumberPrefixCls,
      show: !isHidden,
      motionClassName,
      className: scrollNumberCls,
      count: displayCount,
      title: titleNode,
      style: scrollNumberStyle,
      key: "scrollNumber"
    }, displayNode);
  }), statusTextNode));
});
const Badge = InternalBadge;
Badge.Ribbon = Ribbon;
export {
  Badge as B
};
//# sourceMappingURL=index-DDcrJiGl.js.map
