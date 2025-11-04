import { a as reactExports } from "./react-DAIzMmXQ.js";
import { C as ConfigContext, f as classNames, by as responsiveArray, bx as useBreakpoint } from "./index-B4P9h-k1.js";
import { u as useColStyle, a as useRowStyle } from "./index-BlJydARW.js";
const RowContext = /* @__PURE__ */ reactExports.createContext({});
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function parseFlex(flex) {
  if (typeof flex === "number") {
    return `${flex} ${flex} auto`;
  }
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }
  return flex;
}
const sizes = ["xs", "sm", "md", "lg", "xl", "xxl"];
const Col = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const {
    gutter,
    wrap
  } = reactExports.useContext(RowContext);
  const {
    prefixCls: customizePrefixCls,
    span,
    order,
    offset,
    push,
    pull,
    className,
    children,
    flex,
    style
  } = props, others = __rest$1(props, ["prefixCls", "span", "order", "offset", "push", "pull", "className", "children", "flex", "style"]);
  const prefixCls = getPrefixCls("col", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useColStyle(prefixCls);
  const sizeStyle = {};
  let sizeClassObj = {};
  sizes.forEach((size) => {
    let sizeProps = {};
    const propSize = props[size];
    if (typeof propSize === "number") {
      sizeProps.span = propSize;
    } else if (typeof propSize === "object") {
      sizeProps = propSize || {};
    }
    delete others[size];
    sizeClassObj = Object.assign(Object.assign({}, sizeClassObj), {
      [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== void 0,
      [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
      [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
      [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
      [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
      [`${prefixCls}-rtl`]: direction === "rtl"
    });
    if (sizeProps.flex) {
      sizeClassObj[`${prefixCls}-${size}-flex`] = true;
      sizeStyle[`--${prefixCls}-${size}-flex`] = parseFlex(sizeProps.flex);
    }
  });
  const classes = classNames(prefixCls, {
    [`${prefixCls}-${span}`]: span !== void 0,
    [`${prefixCls}-order-${order}`]: order,
    [`${prefixCls}-offset-${offset}`]: offset,
    [`${prefixCls}-push-${push}`]: push,
    [`${prefixCls}-pull-${pull}`]: pull
  }, className, sizeClassObj, hashId, cssVarCls);
  const mergedStyle = {};
  if (gutter && gutter[0] > 0) {
    const horizontalGutter = gutter[0] / 2;
    mergedStyle.paddingLeft = horizontalGutter;
    mergedStyle.paddingRight = horizontalGutter;
  }
  if (flex) {
    mergedStyle.flex = parseFlex(flex);
    if (wrap === false && !mergedStyle.minWidth) {
      mergedStyle.minWidth = 0;
    }
  }
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", Object.assign({}, others, {
    style: Object.assign(Object.assign(Object.assign({}, mergedStyle), style), sizeStyle),
    className: classes,
    ref
  }), children));
});
function useGutter(gutter, screens) {
  const results = [void 0, void 0];
  const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, void 0];
  const mergedScreens = screens || {
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true
  };
  normalizedGutter.forEach((g, index) => {
    if (typeof g === "object" && g !== null) {
      for (let i = 0; i < responsiveArray.length; i++) {
        const breakpoint = responsiveArray[i];
        if (mergedScreens[breakpoint] && g[breakpoint] !== void 0) {
          results[index] = g[breakpoint];
          break;
        }
      }
    } else {
      results[index] = g;
    }
  });
  return results;
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function useMergedPropByScreen(oriProp, screen) {
  const [prop, setProp] = reactExports.useState(typeof oriProp === "string" ? oriProp : "");
  const calcMergedAlignOrJustify = () => {
    if (typeof oriProp === "string") {
      setProp(oriProp);
    }
    if (typeof oriProp !== "object") {
      return;
    }
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint = responsiveArray[i];
      if (!screen || !screen[breakpoint]) {
        continue;
      }
      const curVal = oriProp[breakpoint];
      if (curVal !== void 0) {
        setProp(curVal);
        return;
      }
    }
  };
  reactExports.useEffect(() => {
    calcMergedAlignOrJustify();
  }, [JSON.stringify(oriProp), screen]);
  return prop;
}
const Row = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    justify,
    align,
    className,
    style,
    children,
    gutter = 0,
    wrap
  } = props, others = __rest(props, ["prefixCls", "justify", "align", "className", "style", "children", "gutter", "wrap"]);
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const screens = useBreakpoint(true, null);
  const mergedAlign = useMergedPropByScreen(align, screens);
  const mergedJustify = useMergedPropByScreen(justify, screens);
  const prefixCls = getPrefixCls("row", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useRowStyle(prefixCls);
  const gutters = useGutter(gutter, screens);
  const classes = classNames(prefixCls, {
    [`${prefixCls}-no-wrap`]: wrap === false,
    [`${prefixCls}-${mergedJustify}`]: mergedJustify,
    [`${prefixCls}-${mergedAlign}`]: mergedAlign,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, className, hashId, cssVarCls);
  const rowStyle = {};
  const horizontalGutter = gutters[0] != null && gutters[0] > 0 ? gutters[0] / -2 : void 0;
  if (horizontalGutter) {
    rowStyle.marginLeft = horizontalGutter;
    rowStyle.marginRight = horizontalGutter;
  }
  const [gutterH, gutterV] = gutters;
  rowStyle.rowGap = gutterV;
  const rowContext = reactExports.useMemo(() => ({
    gutter: [gutterH, gutterV],
    wrap
  }), [gutterH, gutterV, wrap]);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(RowContext.Provider, {
    value: rowContext
  }, /* @__PURE__ */ reactExports.createElement("div", Object.assign({}, others, {
    className: classes,
    style: Object.assign(Object.assign({}, rowStyle), style),
    ref
  }), children)));
});
export {
  Col as C,
  Row as R
};
//# sourceMappingURL=row-BcQp44VL.js.map
