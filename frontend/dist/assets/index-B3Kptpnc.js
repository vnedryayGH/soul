import { a as reactExports } from "./react-DAIzMmXQ.js";
import { Q as genStyleHooks, R as merge, V as resetComponent, U as unit, ac as composeRef, C as ConfigContext, ai as useSize, bx as useBreakpoint, by as responsiveArray, a5 as useCSSVarCls, f as classNames, be as RefResizeObserver, t as toArray, bz as cloneElement } from "./index-B4P9h-k1.js";
import { P as Popover } from "./index-C3XsEteC.js";
const AvatarContext = /* @__PURE__ */ reactExports.createContext({});
const genBaseStyle = (token) => {
  const {
    antCls,
    componentCls,
    iconCls,
    avatarBg,
    avatarColor,
    containerSize,
    containerSizeLG,
    containerSizeSM,
    textFontSize,
    textFontSizeLG,
    textFontSizeSM,
    iconFontSize,
    iconFontSizeLG,
    iconFontSizeSM,
    borderRadius,
    borderRadiusLG,
    borderRadiusSM,
    lineWidth,
    lineType
  } = token;
  const avatarSizeStyle = (size, fontSize, iconFontSize2, radius) => ({
    width: size,
    height: size,
    borderRadius: "50%",
    fontSize,
    [`&${componentCls}-square`]: {
      borderRadius: radius
    },
    [`&${componentCls}-icon`]: {
      fontSize: iconFontSize2,
      [`> ${iconCls}`]: {
        margin: 0
      }
    }
  });
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
      position: "relative",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      color: avatarColor,
      whiteSpace: "nowrap",
      textAlign: "center",
      verticalAlign: "middle",
      background: avatarBg,
      border: `${unit(lineWidth)} ${lineType} transparent`,
      "&-image": {
        background: "transparent"
      },
      [`${antCls}-image-img`]: {
        display: "block"
      }
    }), avatarSizeStyle(containerSize, textFontSize, iconFontSize, borderRadius)), {
      "&-lg": Object.assign({}, avatarSizeStyle(containerSizeLG, textFontSizeLG, iconFontSizeLG, borderRadiusLG)),
      "&-sm": Object.assign({}, avatarSizeStyle(containerSizeSM, textFontSizeSM, iconFontSizeSM, borderRadiusSM)),
      "> img": {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    })
  };
};
const genGroupStyle = (token) => {
  const {
    componentCls,
    groupBorderColor,
    groupOverlapping,
    groupSpace
  } = token;
  return {
    [`${componentCls}-group`]: {
      display: "inline-flex",
      [componentCls]: {
        borderColor: groupBorderColor
      },
      "> *:not(:first-child)": {
        marginInlineStart: groupOverlapping
      }
    },
    [`${componentCls}-group-popover`]: {
      [`${componentCls} + ${componentCls}`]: {
        marginInlineStart: groupSpace
      }
    }
  };
};
const prepareComponentToken = (token) => {
  const {
    controlHeight,
    controlHeightLG,
    controlHeightSM,
    fontSize,
    fontSizeLG,
    fontSizeXL,
    fontSizeHeading3,
    marginXS,
    marginXXS,
    colorBorderBg
  } = token;
  return {
    containerSize: controlHeight,
    containerSizeLG: controlHeightLG,
    containerSizeSM: controlHeightSM,
    textFontSize: fontSize,
    textFontSizeLG: fontSize,
    textFontSizeSM: fontSize,
    iconFontSize: Math.round((fontSizeLG + fontSizeXL) / 2),
    iconFontSizeLG: fontSizeHeading3,
    iconFontSizeSM: fontSize,
    groupSpace: marginXXS,
    groupOverlapping: -marginXS,
    groupBorderColor: colorBorderBg
  };
};
const useStyle = genStyleHooks("Avatar", (token) => {
  const {
    colorTextLightSolid,
    colorTextPlaceholder
  } = token;
  const avatarToken = merge(token, {
    avatarBg: colorTextPlaceholder,
    avatarColor: colorTextLightSolid
  });
  return [genBaseStyle(avatarToken), genGroupStyle(avatarToken)];
}, prepareComponentToken);
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Avatar$1 = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    shape,
    size: customSize,
    src,
    srcSet,
    icon,
    className,
    rootClassName,
    style,
    alt,
    draggable,
    children,
    crossOrigin,
    gap = 4,
    onError
  } = props, others = __rest(props, ["prefixCls", "shape", "size", "src", "srcSet", "icon", "className", "rootClassName", "style", "alt", "draggable", "children", "crossOrigin", "gap", "onError"]);
  const [scale, setScale] = reactExports.useState(1);
  const [mounted, setMounted] = reactExports.useState(false);
  const [isImgExist, setIsImgExist] = reactExports.useState(true);
  const avatarNodeRef = reactExports.useRef(null);
  const avatarChildrenRef = reactExports.useRef(null);
  const avatarNodeMergedRef = composeRef(ref, avatarNodeRef);
  const {
    getPrefixCls,
    avatar
  } = reactExports.useContext(ConfigContext);
  const avatarCtx = reactExports.useContext(AvatarContext);
  const setScaleParam = () => {
    if (!avatarChildrenRef.current || !avatarNodeRef.current) {
      return;
    }
    const childrenWidth = avatarChildrenRef.current.offsetWidth;
    const nodeWidth = avatarNodeRef.current.offsetWidth;
    if (childrenWidth !== 0 && nodeWidth !== 0) {
      if (gap * 2 < nodeWidth) {
        setScale(nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1);
      }
    }
  };
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  reactExports.useEffect(() => {
    setIsImgExist(true);
    setScale(1);
  }, [src]);
  reactExports.useEffect(setScaleParam, [gap]);
  const handleImgLoadError = () => {
    const errorFlag = onError === null || onError === void 0 ? void 0 : onError();
    if (errorFlag !== false) {
      setIsImgExist(false);
    }
  };
  const size = useSize((ctxSize) => {
    var _a, _b;
    return (_b = (_a = customSize !== null && customSize !== void 0 ? customSize : avatarCtx === null || avatarCtx === void 0 ? void 0 : avatarCtx.size) !== null && _a !== void 0 ? _a : ctxSize) !== null && _b !== void 0 ? _b : "default";
  });
  const needResponsive = Object.keys(typeof size === "object" ? size || {} : {}).some((key) => ["xs", "sm", "md", "lg", "xl", "xxl"].includes(key));
  const screens = useBreakpoint(needResponsive);
  const responsiveSizeStyle = reactExports.useMemo(() => {
    if (typeof size !== "object") {
      return {};
    }
    const currentBreakpoint = responsiveArray.find((screen) => screens[screen]);
    const currentSize = size[currentBreakpoint];
    return currentSize ? {
      width: currentSize,
      height: currentSize,
      fontSize: currentSize && (icon || children) ? currentSize / 2 : 18
    } : {};
  }, [screens, size]);
  const prefixCls = getPrefixCls("avatar", customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === "large",
    [`${prefixCls}-sm`]: size === "small"
  });
  const hasImageElement = /* @__PURE__ */ reactExports.isValidElement(src);
  const mergedShape = shape || (avatarCtx === null || avatarCtx === void 0 ? void 0 : avatarCtx.shape) || "circle";
  const classString = classNames(prefixCls, sizeCls, avatar === null || avatar === void 0 ? void 0 : avatar.className, `${prefixCls}-${mergedShape}`, {
    [`${prefixCls}-image`]: hasImageElement || src && isImgExist,
    [`${prefixCls}-icon`]: !!icon
  }, cssVarCls, rootCls, className, rootClassName, hashId);
  const sizeStyle = typeof size === "number" ? {
    width: size,
    height: size,
    fontSize: icon ? size / 2 : 18
  } : {};
  let childrenToRender;
  if (typeof src === "string" && isImgExist) {
    childrenToRender = /* @__PURE__ */ reactExports.createElement("img", {
      src,
      draggable,
      srcSet,
      onError: handleImgLoadError,
      alt,
      crossOrigin
    });
  } else if (hasImageElement) {
    childrenToRender = src;
  } else if (icon) {
    childrenToRender = icon;
  } else if (mounted || scale !== 1) {
    const transformString = `scale(${scale})`;
    const childrenStyle = {
      msTransform: transformString,
      WebkitTransform: transformString,
      transform: transformString
    };
    childrenToRender = /* @__PURE__ */ reactExports.createElement(RefResizeObserver, {
      onResize: setScaleParam
    }, /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-string`,
      ref: avatarChildrenRef,
      style: Object.assign({}, childrenStyle)
    }, children));
  } else {
    childrenToRender = /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-string`,
      style: {
        opacity: 0
      },
      ref: avatarChildrenRef
    }, children);
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("span", Object.assign({}, others, {
    style: Object.assign(Object.assign(Object.assign(Object.assign({}, sizeStyle), responsiveSizeStyle), avatar === null || avatar === void 0 ? void 0 : avatar.style), style),
    className: classString,
    ref: avatarNodeMergedRef
  }), childrenToRender));
});
const AvatarContextProvider = (props) => {
  const {
    size,
    shape
  } = reactExports.useContext(AvatarContext);
  const avatarContextValue = reactExports.useMemo(() => ({
    size: props.size || size,
    shape: props.shape || shape
  }), [props.size, props.shape, size, shape]);
  return /* @__PURE__ */ reactExports.createElement(AvatarContext.Provider, {
    value: avatarContextValue
  }, props.children);
};
const AvatarGroup = (props) => {
  var _a, _b, _c, _d;
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    maxCount,
    maxStyle,
    size,
    shape,
    maxPopoverPlacement,
    maxPopoverTrigger,
    children,
    max
  } = props;
  const prefixCls = getPrefixCls("avatar", customizePrefixCls);
  const groupPrefixCls = `${prefixCls}-group`;
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const cls = classNames(groupPrefixCls, {
    [`${groupPrefixCls}-rtl`]: direction === "rtl"
  }, cssVarCls, rootCls, className, rootClassName, hashId);
  const childrenWithProps = toArray(children).map((child, index) => cloneElement(child, {
    // eslint-disable-next-line react/no-array-index-key
    key: `avatar-key-${index}`
  }));
  const mergeCount = (max === null || max === void 0 ? void 0 : max.count) || maxCount;
  const numOfChildren = childrenWithProps.length;
  if (mergeCount && mergeCount < numOfChildren) {
    const childrenShow = childrenWithProps.slice(0, mergeCount);
    const childrenHidden = childrenWithProps.slice(mergeCount, numOfChildren);
    const mergeStyle = (max === null || max === void 0 ? void 0 : max.style) || maxStyle;
    const mergePopoverTrigger = ((_a = max === null || max === void 0 ? void 0 : max.popover) === null || _a === void 0 ? void 0 : _a.trigger) || maxPopoverTrigger || "hover";
    const mergePopoverPlacement = ((_b = max === null || max === void 0 ? void 0 : max.popover) === null || _b === void 0 ? void 0 : _b.placement) || maxPopoverPlacement || "top";
    const mergeProps = Object.assign(Object.assign({
      content: childrenHidden
    }, max === null || max === void 0 ? void 0 : max.popover), {
      classNames: {
        root: classNames(`${groupPrefixCls}-popover`, (_d = (_c = max === null || max === void 0 ? void 0 : max.popover) === null || _c === void 0 ? void 0 : _c.classNames) === null || _d === void 0 ? void 0 : _d.root)
      },
      placement: mergePopoverPlacement,
      trigger: mergePopoverTrigger
    });
    childrenShow.push(/* @__PURE__ */ reactExports.createElement(Popover, Object.assign({
      key: "avatar-popover-key",
      destroyOnHidden: true
    }, mergeProps), /* @__PURE__ */ reactExports.createElement(Avatar$1, {
      style: mergeStyle
    }, `+${numOfChildren - mergeCount}`)));
    return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(AvatarContextProvider, {
      shape,
      size
    }, /* @__PURE__ */ reactExports.createElement("div", {
      className: cls,
      style
    }, childrenShow)));
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(AvatarContextProvider, {
    shape,
    size
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: cls,
    style
  }, childrenWithProps)));
};
const Avatar = Avatar$1;
Avatar.Group = AvatarGroup;
export {
  Avatar as A
};
//# sourceMappingURL=index-B3Kptpnc.js.map
