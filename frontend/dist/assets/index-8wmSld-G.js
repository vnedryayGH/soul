import { a as reactExports } from "./react-DAIzMmXQ.js";
import { Q as genStyleHooks, R as merge, V as resetComponent, d as useComponentConfig, f as classNames, at as pickAttrs, x as useEvent, b9 as wrapperRaf, bz as cloneElement } from "./index-B4P9h-k1.js";
import { S as Skeleton } from "./Skeleton-D3e3aC7P.js";
const StatisticNumber = (props) => {
  const {
    value,
    formatter,
    precision,
    decimalSeparator,
    groupSeparator = "",
    prefixCls
  } = props;
  let valueNode;
  if (typeof formatter === "function") {
    valueNode = formatter(value);
  } else {
    const val = String(value);
    const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);
    if (!cells || val === "-") {
      valueNode = val;
    } else {
      const negative = cells[1];
      let int = cells[2] || "0";
      let decimal = cells[4] || "";
      int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
      if (typeof precision === "number") {
        decimal = decimal.padEnd(precision, "0").slice(0, precision > 0 ? precision : 0);
      }
      if (decimal) {
        decimal = `${decimalSeparator}${decimal}`;
      }
      valueNode = [/* @__PURE__ */ reactExports.createElement("span", {
        key: "int",
        className: `${prefixCls}-content-value-int`
      }, negative, int), decimal && /* @__PURE__ */ reactExports.createElement("span", {
        key: "decimal",
        className: `${prefixCls}-content-value-decimal`
      }, decimal)];
    }
  }
  return /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-content-value`
  }, valueNode);
};
const genStatisticStyle = (token) => {
  const {
    componentCls,
    marginXXS,
    padding,
    colorTextDescription,
    titleFontSize,
    colorTextHeading,
    contentFontSize,
    fontFamily
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      [`${componentCls}-title`]: {
        marginBottom: marginXXS,
        color: colorTextDescription,
        fontSize: titleFontSize
      },
      [`${componentCls}-skeleton`]: {
        paddingTop: padding
      },
      [`${componentCls}-content`]: {
        color: colorTextHeading,
        fontSize: contentFontSize,
        fontFamily,
        [`${componentCls}-content-value`]: {
          display: "inline-block",
          direction: "ltr"
        },
        [`${componentCls}-content-prefix, ${componentCls}-content-suffix`]: {
          display: "inline-block"
        },
        [`${componentCls}-content-prefix`]: {
          marginInlineEnd: marginXXS
        },
        [`${componentCls}-content-suffix`]: {
          marginInlineStart: marginXXS
        }
      }
    })
  };
};
const prepareComponentToken = (token) => {
  const {
    fontSizeHeading3,
    fontSize
  } = token;
  return {
    titleFontSize: fontSize,
    contentFontSize: fontSizeHeading3
  };
};
const useStyle = genStyleHooks("Statistic", (token) => {
  const statisticToken = merge(token, {});
  return genStatisticStyle(statisticToken);
}, prepareComponentToken);
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Statistic = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    valueStyle,
    value = 0,
    title,
    valueRender,
    prefix,
    suffix,
    loading = false,
    /* --- FormatConfig starts --- */
    formatter,
    precision,
    decimalSeparator = ".",
    groupSeparator = ",",
    /* --- FormatConfig starts --- */
    onMouseEnter,
    onMouseLeave
  } = props, rest = __rest$1(props, ["prefixCls", "className", "rootClassName", "style", "valueStyle", "value", "title", "valueRender", "prefix", "suffix", "loading", "formatter", "precision", "decimalSeparator", "groupSeparator", "onMouseEnter", "onMouseLeave"]);
  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle
  } = useComponentConfig("statistic");
  const prefixCls = getPrefixCls("statistic", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const valueNode = /* @__PURE__ */ reactExports.createElement(StatisticNumber, {
    decimalSeparator,
    groupSeparator,
    prefixCls,
    formatter,
    precision,
    value
  });
  const cls = classNames(prefixCls, {
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, contextClassName, className, rootClassName, hashId, cssVarCls);
  const internalRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    nativeElement: internalRef.current
  }));
  const restProps = pickAttrs(rest, {
    aria: true,
    data: true
  });
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", Object.assign({}, restProps, {
    ref: internalRef,
    className: cls,
    style: Object.assign(Object.assign({}, contextStyle), style),
    onMouseEnter,
    onMouseLeave
  }), title && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-title`
  }, title), /* @__PURE__ */ reactExports.createElement(Skeleton, {
    paragraph: false,
    loading,
    className: `${prefixCls}-skeleton`
  }, /* @__PURE__ */ reactExports.createElement("div", {
    style: valueStyle,
    className: `${prefixCls}-content`
  }, prefix && /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-content-prefix`
  }, prefix), valueRender ? valueRender(valueNode) : valueNode, suffix && /* @__PURE__ */ reactExports.createElement("span", {
    className: `${prefixCls}-content-suffix`
  }, suffix)))));
});
const timeUnits = [
  ["Y", 1e3 * 60 * 60 * 24 * 365],
  // years
  ["M", 1e3 * 60 * 60 * 24 * 30],
  // months
  ["D", 1e3 * 60 * 60 * 24],
  // days
  ["H", 1e3 * 60 * 60],
  // hours
  ["m", 1e3 * 60],
  // minutes
  ["s", 1e3],
  // seconds
  ["S", 1]
  // million seconds
];
function formatTimeStr(duration, format) {
  let leftDuration = duration;
  const escapeRegex = /\[[^\]]*]/g;
  const keepList = (format.match(escapeRegex) || []).map((str) => str.slice(1, -1));
  const templateText = format.replace(escapeRegex, "[]");
  const replacedText = timeUnits.reduce((current, [name, unit]) => {
    if (current.includes(name)) {
      const value = Math.floor(leftDuration / unit);
      leftDuration -= value * unit;
      return current.replace(new RegExp(`${name}+`, "g"), (match) => {
        const len = match.length;
        return value.toString().padStart(len, "0");
      });
    }
    return current;
  }, templateText);
  let index = 0;
  return replacedText.replace(escapeRegex, () => {
    const match = keepList[index];
    index += 1;
    return match;
  });
}
function formatCounter(value, config, down) {
  const {
    format = ""
  } = config;
  const target = new Date(value).getTime();
  const current = Date.now();
  const diff = down ? Math.max(target - current, 0) : Math.max(current - target, 0);
  return formatTimeStr(diff, format);
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function getTime(value) {
  return new Date(value).getTime();
}
const StatisticTimer = (props) => {
  const {
    value,
    format = "HH:mm:ss",
    onChange,
    onFinish,
    type
  } = props, rest = __rest(props, ["value", "format", "onChange", "onFinish", "type"]);
  const down = type === "countdown";
  const [showTime, setShowTime] = reactExports.useState(null);
  const update = useEvent(() => {
    const now = Date.now();
    const timestamp = getTime(value);
    setShowTime({});
    const timeDiff = !down ? now - timestamp : timestamp - now;
    onChange === null || onChange === void 0 ? void 0 : onChange(timeDiff);
    if (down && timestamp < now) {
      onFinish === null || onFinish === void 0 ? void 0 : onFinish();
      return false;
    }
    return true;
  });
  reactExports.useEffect(() => {
    let rafId;
    const clear = () => wrapperRaf.cancel(rafId);
    const rafUpdate = () => {
      rafId = wrapperRaf(() => {
        if (update()) {
          rafUpdate();
        }
      });
    };
    rafUpdate();
    return clear;
  }, [value, down]);
  reactExports.useEffect(() => {
    setShowTime({});
  }, []);
  const formatter = (formatValue, config) => showTime ? formatCounter(formatValue, Object.assign(Object.assign({}, config), {
    format
  }), down) : "-";
  const valueRender = (node) => cloneElement(node, {
    title: void 0
  });
  return /* @__PURE__ */ reactExports.createElement(Statistic, Object.assign({}, rest, {
    value,
    valueRender,
    formatter
  }));
};
const Countdown = (props) => {
  return /* @__PURE__ */ reactExports.createElement(StatisticTimer, Object.assign({}, props, {
    type: "countdown"
  }));
};
const Countdown$1 = /* @__PURE__ */ reactExports.memo(Countdown);
Statistic.Timer = StatisticTimer;
Statistic.Countdown = Countdown$1;
export {
  Statistic as S
};
//# sourceMappingURL=index-8wmSld-G.js.map
