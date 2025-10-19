import { a as reactExports } from "./react-DAIzMmXQ.js";
import { Q as genStyleHooks, R as merge, V as resetComponent, U as unit, C as ConfigContext, f as classNames, _ as _toConsumableArray, aN as RefIcon, t as toArray, a5 as useCSSVarCls } from "./index-B4P9h-k1.js";
const genTimelineStyle = (token) => {
  const {
    componentCls,
    calc
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      margin: 0,
      padding: 0,
      listStyle: "none",
      [`${componentCls}-item`]: {
        position: "relative",
        margin: 0,
        paddingBottom: token.itemPaddingBottom,
        fontSize: token.fontSize,
        listStyle: "none",
        "&-tail": {
          position: "absolute",
          insetBlockStart: token.itemHeadSize,
          insetInlineStart: calc(calc(token.itemHeadSize).sub(token.tailWidth)).div(2).equal(),
          height: `calc(100% - ${unit(token.itemHeadSize)})`,
          borderInlineStart: `${unit(token.tailWidth)} ${token.lineType} ${token.tailColor}`
        },
        "&-pending": {
          [`${componentCls}-item-head`]: {
            fontSize: token.fontSizeSM,
            backgroundColor: "transparent"
          },
          [`${componentCls}-item-tail`]: {
            display: "none"
          }
        },
        "&-head": {
          position: "absolute",
          width: token.itemHeadSize,
          height: token.itemHeadSize,
          backgroundColor: token.dotBg,
          border: `${unit(token.dotBorderWidth)} ${token.lineType} transparent`,
          borderRadius: "50%",
          "&-blue": {
            color: token.colorPrimary,
            borderColor: token.colorPrimary
          },
          "&-red": {
            color: token.colorError,
            borderColor: token.colorError
          },
          "&-green": {
            color: token.colorSuccess,
            borderColor: token.colorSuccess
          },
          "&-gray": {
            color: token.colorTextDisabled,
            borderColor: token.colorTextDisabled
          }
        },
        "&-head-custom": {
          position: "absolute",
          insetBlockStart: calc(token.itemHeadSize).div(2).equal(),
          insetInlineStart: calc(token.itemHeadSize).div(2).equal(),
          width: "auto",
          height: "auto",
          marginBlockStart: 0,
          paddingBlock: token.customHeadPaddingVertical,
          lineHeight: 1,
          textAlign: "center",
          border: 0,
          borderRadius: 0,
          transform: "translate(-50%, -50%)"
        },
        "&-content": {
          position: "relative",
          insetBlockStart: calc(calc(token.fontSize).mul(token.lineHeight).sub(token.fontSize)).mul(-1).add(token.lineWidth).equal(),
          marginInlineStart: calc(token.margin).add(token.itemHeadSize).equal(),
          marginInlineEnd: 0,
          marginBlockStart: 0,
          marginBlockEnd: 0,
          wordBreak: "break-word"
        },
        "&-last": {
          [`> ${componentCls}-item-tail`]: {
            display: "none"
          },
          [`> ${componentCls}-item-content`]: {
            minHeight: calc(token.controlHeightLG).mul(1.2).equal()
          }
        }
      },
      [`&${componentCls}-alternate,
        &${componentCls}-right,
        &${componentCls}-label`]: {
        [`${componentCls}-item`]: {
          "&-tail, &-head, &-head-custom": {
            insetInlineStart: "50%"
          },
          "&-head": {
            marginInlineStart: calc(token.marginXXS).mul(-1).equal(),
            "&-custom": {
              marginInlineStart: calc(token.tailWidth).div(2).equal()
            }
          },
          "&-left": {
            [`${componentCls}-item-content`]: {
              insetInlineStart: `calc(50% - ${unit(token.marginXXS)})`,
              width: `calc(50% - ${unit(token.marginSM)})`,
              textAlign: "start"
            }
          },
          "&-right": {
            [`${componentCls}-item-content`]: {
              width: `calc(50% - ${unit(token.marginSM)})`,
              margin: 0,
              textAlign: "end"
            }
          }
        }
      },
      [`&${componentCls}-right`]: {
        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-tail,
            ${componentCls}-item-head,
            ${componentCls}-item-head-custom`]: {
            insetInlineStart: `calc(100% - ${unit(calc(calc(token.itemHeadSize).add(token.tailWidth)).div(2).equal())})`
          },
          [`${componentCls}-item-content`]: {
            width: `calc(100% - ${unit(calc(token.itemHeadSize).add(token.marginXS).equal())})`
          }
        }
      },
      [`&${componentCls}-pending
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: "block",
        height: `calc(100% - ${unit(token.margin)})`,
        borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`
      },
      [`&${componentCls}-reverse
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: "none"
      },
      [`&${componentCls}-reverse ${componentCls}-item-pending`]: {
        [`${componentCls}-item-tail`]: {
          insetBlockStart: token.margin,
          display: "block",
          height: `calc(100% - ${unit(token.margin)})`,
          borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`
        },
        [`${componentCls}-item-content`]: {
          minHeight: calc(token.controlHeightLG).mul(1.2).equal()
        }
      },
      [`&${componentCls}-label`]: {
        [`${componentCls}-item-label`]: {
          position: "absolute",
          insetBlockStart: calc(calc(token.fontSize).mul(token.lineHeight).sub(token.fontSize)).mul(-1).add(token.tailWidth).equal(),
          width: `calc(50% - ${unit(token.marginSM)})`,
          textAlign: "end"
        },
        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-label`]: {
            insetInlineStart: `calc(50% + ${unit(token.marginSM)})`,
            width: `calc(50% - ${unit(token.marginSM)})`,
            textAlign: "start"
          }
        }
      },
      // ====================== RTL =======================
      "&-rtl": {
        direction: "rtl",
        [`${componentCls}-item-head-custom`]: {
          transform: `translate(50%, -50%)`
        }
      }
    })
  };
};
const prepareComponentToken = (token) => ({
  tailColor: token.colorSplit,
  tailWidth: token.lineWidthBold,
  dotBorderWidth: token.wireframe ? token.lineWidthBold : token.lineWidth * 3,
  dotBg: token.colorBgContainer,
  itemPaddingBottom: token.padding * 1.25
});
const useStyle = genStyleHooks("Timeline", (token) => {
  const timeLineToken = merge(token, {
    itemHeadSize: 10,
    customHeadPaddingVertical: token.paddingXXS,
    paddingInlineEnd: 2
  });
  return genTimelineStyle(timeLineToken);
}, prepareComponentToken);
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const TimelineItem = (_a) => {
  var {
    prefixCls: customizePrefixCls,
    className,
    color = "blue",
    dot,
    pending = false,
    position,
    label,
    children
  } = _a, restProps = __rest$2(_a, ["prefixCls", "className", "color", "dot", "pending", "position", "label", "children"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("timeline", customizePrefixCls);
  const itemClassName = classNames(`${prefixCls}-item`, {
    [`${prefixCls}-item-pending`]: pending
  }, className);
  const customColor = /blue|red|green|gray/.test(color || "") ? void 0 : color;
  const dotClassName = classNames(`${prefixCls}-item-head`, {
    [`${prefixCls}-item-head-custom`]: !!dot,
    [`${prefixCls}-item-head-${color}`]: !customColor
  });
  return /* @__PURE__ */ reactExports.createElement("li", Object.assign({}, restProps, {
    className: itemClassName
  }), label && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-item-label`
  }, label), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-item-tail`
  }), /* @__PURE__ */ reactExports.createElement("div", {
    className: dotClassName,
    style: {
      borderColor: customColor,
      color: customColor
    }
  }, dot), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-item-content`
  }, children));
};
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const TimelineItemList = (_a) => {
  var {
    prefixCls,
    className,
    pending = false,
    children,
    items,
    rootClassName,
    reverse = false,
    direction,
    hashId,
    pendingDot,
    mode = ""
  } = _a, restProps = __rest$1(_a, ["prefixCls", "className", "pending", "children", "items", "rootClassName", "reverse", "direction", "hashId", "pendingDot", "mode"]);
  const getPositionCls = (position, idx) => {
    if (mode === "alternate") {
      if (position === "right") return `${prefixCls}-item-right`;
      if (position === "left") return `${prefixCls}-item-left`;
      return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
    }
    if (mode === "left") return `${prefixCls}-item-left`;
    if (mode === "right") return `${prefixCls}-item-right`;
    if (position === "right") return `${prefixCls}-item-right`;
    return "";
  };
  const mergedItems = _toConsumableArray(items || []);
  const pendingNode = typeof pending === "boolean" ? null : pending;
  if (pending) {
    mergedItems.push({
      pending: !!pending,
      dot: pendingDot || /* @__PURE__ */ reactExports.createElement(RefIcon, null),
      children: pendingNode
    });
  }
  if (reverse) {
    mergedItems.reverse();
  }
  const itemsCount = mergedItems.length;
  const lastCls = `${prefixCls}-item-last`;
  const itemsList = mergedItems.filter((item) => !!item).map((item, idx) => {
    var _a2;
    const pendingClass = idx === itemsCount - 2 ? lastCls : "";
    const readyClass = idx === itemsCount - 1 ? lastCls : "";
    const {
      className: itemClassName
    } = item, itemProps = __rest$1(item, ["className"]);
    return /* @__PURE__ */ reactExports.createElement(TimelineItem, Object.assign({}, itemProps, {
      className: classNames([itemClassName, !reverse && !!pending ? pendingClass : readyClass, getPositionCls((_a2 = item === null || item === void 0 ? void 0 : item.position) !== null && _a2 !== void 0 ? _a2 : "", idx)]),
      key: (item === null || item === void 0 ? void 0 : item.key) || idx
    }));
  });
  const hasLabelItem = mergedItems.some((item) => !!(item === null || item === void 0 ? void 0 : item.label));
  const classString = classNames(prefixCls, {
    [`${prefixCls}-pending`]: !!pending,
    [`${prefixCls}-reverse`]: !!reverse,
    [`${prefixCls}-${mode}`]: !!mode && !hasLabelItem,
    [`${prefixCls}-label`]: hasLabelItem,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, className, rootClassName, hashId);
  return /* @__PURE__ */ reactExports.createElement("ol", Object.assign({}, restProps, {
    className: classString
  }), itemsList);
};
function useItems(items, children) {
  if (items && Array.isArray(items)) {
    return items;
  }
  return toArray(children).map((ele) => {
    var _a, _b;
    return Object.assign({
      children: (_b = (_a = ele === null || ele === void 0 ? void 0 : ele.props) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : ""
    }, ele.props);
  });
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Timeline = (props) => {
  const {
    getPrefixCls,
    direction,
    timeline
  } = reactExports.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    children,
    items,
    className,
    style
  } = props, restProps = __rest(props, ["prefixCls", "children", "items", "className", "style"]);
  const prefixCls = getPrefixCls("timeline", customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const mergedItems = useItems(items, children);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(TimelineItemList, Object.assign({}, restProps, {
    className: classNames(timeline === null || timeline === void 0 ? void 0 : timeline.className, className, cssVarCls, rootCls),
    style: Object.assign(Object.assign({}, timeline === null || timeline === void 0 ? void 0 : timeline.style), style),
    prefixCls,
    direction,
    items: mergedItems,
    hashId
  })));
};
Timeline.Item = TimelineItem;
export {
  Timeline as T
};
//# sourceMappingURL=Timeline-Chs6_Ld2.js.map
