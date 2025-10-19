import { R as React, a as reactExports } from "./react-DAIzMmXQ.js";
import { t as toArray, cp as matchScreen, f as classNames, Q as genStyleHooks, R as merge, V as resetComponent, U as unit, ag as textEllipsis, d as useComponentConfig, bx as useBreakpoint, ai as useSize } from "./index-B4P9h-k1.js";
const DEFAULT_COLUMN_MAP = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
const DescriptionsContext = /* @__PURE__ */ React.createContext({});
var __rest$2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const transChildren2Items = (childNodes) => toArray(childNodes).map((node) => Object.assign(Object.assign({}, node === null || node === void 0 ? void 0 : node.props), {
  key: node.key
}));
function useItems(screens, items, children) {
  const mergedItems = reactExports.useMemo(() => (
    // Take `items` first or convert `children` into items
    items || transChildren2Items(children)
  ), [items, children]);
  const responsiveItems = reactExports.useMemo(() => mergedItems.map((_a) => {
    var {
      span
    } = _a, restItem = __rest$2(_a, ["span"]);
    if (span === "filled") {
      return Object.assign(Object.assign({}, restItem), {
        filled: true
      });
    }
    return Object.assign(Object.assign({}, restItem), {
      span: typeof span === "number" ? span : matchScreen(screens, span)
    });
  }), [mergedItems, screens]);
  return responsiveItems;
}
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function getCalcRows(rowItems, mergedColumn) {
  let rows = [];
  let tmpRow = [];
  let exceed = false;
  let count = 0;
  rowItems.filter((n) => n).forEach((rowItem) => {
    const {
      filled
    } = rowItem, restItem = __rest$1(rowItem, ["filled"]);
    if (filled) {
      tmpRow.push(restItem);
      rows.push(tmpRow);
      tmpRow = [];
      count = 0;
      return;
    }
    const restSpan = mergedColumn - count;
    count += rowItem.span || 1;
    if (count >= mergedColumn) {
      if (count > mergedColumn) {
        exceed = true;
        tmpRow.push(Object.assign(Object.assign({}, restItem), {
          span: restSpan
        }));
      } else {
        tmpRow.push(restItem);
      }
      rows.push(tmpRow);
      tmpRow = [];
      count = 0;
    } else {
      tmpRow.push(restItem);
    }
  });
  if (tmpRow.length > 0) {
    rows.push(tmpRow);
  }
  rows = rows.map((rows2) => {
    const count2 = rows2.reduce((acc, item) => acc + (item.span || 1), 0);
    if (count2 < mergedColumn) {
      const last = rows2[rows2.length - 1];
      last.span = mergedColumn - (count2 - (last.span || 1));
      return rows2;
    }
    return rows2;
  });
  return [rows, exceed];
}
const useRow = (mergedColumn, items) => {
  const [rows, exceed] = reactExports.useMemo(() => getCalcRows(items, mergedColumn), [items, mergedColumn]);
  return rows;
};
const DescriptionsItem = ({
  children
}) => children;
function notEmpty(val) {
  return val !== void 0 && val !== null;
}
const Cell = (props) => {
  const {
    itemPrefixCls,
    component,
    span,
    className,
    style,
    labelStyle,
    contentStyle,
    bordered,
    label,
    content,
    colon,
    type,
    styles
  } = props;
  const Component = component;
  const descContext = reactExports.useContext(DescriptionsContext);
  const {
    classNames: descriptionsClassNames
  } = descContext;
  if (bordered) {
    return /* @__PURE__ */ reactExports.createElement(Component, {
      className: classNames({
        [`${itemPrefixCls}-item-label`]: type === "label",
        [`${itemPrefixCls}-item-content`]: type === "content",
        [`${descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.label}`]: type === "label",
        [`${descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.content}`]: type === "content"
      }, className),
      style,
      colSpan: span
    }, notEmpty(label) && /* @__PURE__ */ reactExports.createElement("span", {
      style: Object.assign(Object.assign({}, labelStyle), styles === null || styles === void 0 ? void 0 : styles.label)
    }, label), notEmpty(content) && /* @__PURE__ */ reactExports.createElement("span", {
      style: Object.assign(Object.assign({}, labelStyle), styles === null || styles === void 0 ? void 0 : styles.content)
    }, content));
  }
  return /* @__PURE__ */ reactExports.createElement(Component, {
    className: classNames(`${itemPrefixCls}-item`, className),
    style,
    colSpan: span
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: `${itemPrefixCls}-item-container`
  }, (label || label === 0) && /* @__PURE__ */ reactExports.createElement("span", {
    className: classNames(`${itemPrefixCls}-item-label`, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.label, {
      [`${itemPrefixCls}-item-no-colon`]: !colon
    }),
    style: Object.assign(Object.assign({}, labelStyle), styles === null || styles === void 0 ? void 0 : styles.label)
  }, label), (content || content === 0) && /* @__PURE__ */ reactExports.createElement("span", {
    className: classNames(`${itemPrefixCls}-item-content`, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.content),
    style: Object.assign(Object.assign({}, contentStyle), styles === null || styles === void 0 ? void 0 : styles.content)
  }, content)));
};
function renderCells(items, {
  colon,
  prefixCls,
  bordered
}, {
  component,
  type,
  showLabel,
  showContent,
  labelStyle: rootLabelStyle,
  contentStyle: rootContentStyle,
  styles: rootStyles
}) {
  return items.map(({
    label,
    children,
    prefixCls: itemPrefixCls = prefixCls,
    className,
    style,
    labelStyle,
    contentStyle,
    span = 1,
    key,
    styles
  }, index) => {
    if (typeof component === "string") {
      return /* @__PURE__ */ reactExports.createElement(Cell, {
        key: `${type}-${key || index}`,
        className,
        style,
        styles: {
          label: Object.assign(Object.assign(Object.assign(Object.assign({}, rootLabelStyle), rootStyles === null || rootStyles === void 0 ? void 0 : rootStyles.label), labelStyle), styles === null || styles === void 0 ? void 0 : styles.label),
          content: Object.assign(Object.assign(Object.assign(Object.assign({}, rootContentStyle), rootStyles === null || rootStyles === void 0 ? void 0 : rootStyles.content), contentStyle), styles === null || styles === void 0 ? void 0 : styles.content)
        },
        span,
        colon,
        component,
        itemPrefixCls,
        bordered,
        label: showLabel ? label : null,
        content: showContent ? children : null,
        type
      });
    }
    return [/* @__PURE__ */ reactExports.createElement(Cell, {
      key: `label-${key || index}`,
      className,
      style: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, rootLabelStyle), rootStyles === null || rootStyles === void 0 ? void 0 : rootStyles.label), style), labelStyle), styles === null || styles === void 0 ? void 0 : styles.label),
      span: 1,
      colon,
      component: component[0],
      itemPrefixCls,
      bordered,
      label,
      type: "label"
    }), /* @__PURE__ */ reactExports.createElement(Cell, {
      key: `content-${key || index}`,
      className,
      style: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, rootContentStyle), rootStyles === null || rootStyles === void 0 ? void 0 : rootStyles.content), style), contentStyle), styles === null || styles === void 0 ? void 0 : styles.content),
      span: span * 2 - 1,
      component: component[1],
      itemPrefixCls,
      bordered,
      content: children,
      type: "content"
    })];
  });
}
const Row = (props) => {
  const descContext = reactExports.useContext(DescriptionsContext);
  const {
    prefixCls,
    vertical,
    row,
    index,
    bordered
  } = props;
  if (vertical) {
    return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("tr", {
      key: `label-${index}`,
      className: `${prefixCls}-row`
    }, renderCells(row, props, Object.assign({
      component: "th",
      type: "label",
      showLabel: true
    }, descContext))), /* @__PURE__ */ reactExports.createElement("tr", {
      key: `content-${index}`,
      className: `${prefixCls}-row`
    }, renderCells(row, props, Object.assign({
      component: "td",
      type: "content",
      showContent: true
    }, descContext))));
  }
  return /* @__PURE__ */ reactExports.createElement("tr", {
    key: index,
    className: `${prefixCls}-row`
  }, renderCells(row, props, Object.assign({
    component: bordered ? ["th", "td"] : "td",
    type: "item",
    showLabel: true,
    showContent: true
  }, descContext)));
};
const genBorderedStyle = (token) => {
  const {
    componentCls,
    labelBg
  } = token;
  return {
    [`&${componentCls}-bordered`]: {
      [`> ${componentCls}-view`]: {
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        "> table": {
          tableLayout: "auto"
        },
        [`${componentCls}-row`]: {
          borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
          "&:first-child": {
            "> th:first-child, > td:first-child": {
              borderStartStartRadius: token.borderRadiusLG
            }
          },
          "&:last-child": {
            borderBottom: "none",
            "> th:first-child, > td:first-child": {
              borderEndStartRadius: token.borderRadiusLG
            }
          },
          [`> ${componentCls}-item-label, > ${componentCls}-item-content`]: {
            padding: `${unit(token.padding)} ${unit(token.paddingLG)}`,
            borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
            "&:last-child": {
              borderInlineEnd: "none"
            }
          },
          [`> ${componentCls}-item-label`]: {
            color: token.colorTextSecondary,
            backgroundColor: labelBg,
            "&::after": {
              display: "none"
            }
          }
        }
      },
      [`&${componentCls}-middle`]: {
        [`${componentCls}-row`]: {
          [`> ${componentCls}-item-label, > ${componentCls}-item-content`]: {
            padding: `${unit(token.paddingSM)} ${unit(token.paddingLG)}`
          }
        }
      },
      [`&${componentCls}-small`]: {
        [`${componentCls}-row`]: {
          [`> ${componentCls}-item-label, > ${componentCls}-item-content`]: {
            padding: `${unit(token.paddingXS)} ${unit(token.padding)}`
          }
        }
      }
    }
  };
};
const genDescriptionStyles = (token) => {
  const {
    componentCls,
    extraColor,
    itemPaddingBottom,
    itemPaddingEnd,
    colonMarginRight,
    colonMarginLeft,
    titleMarginBottom
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genBorderedStyle(token)), {
      "&-rtl": {
        direction: "rtl"
      },
      [`${componentCls}-header`]: {
        display: "flex",
        alignItems: "center",
        marginBottom: titleMarginBottom
      },
      [`${componentCls}-title`]: Object.assign(Object.assign({}, textEllipsis), {
        flex: "auto",
        color: token.titleColor,
        fontWeight: token.fontWeightStrong,
        fontSize: token.fontSizeLG,
        lineHeight: token.lineHeightLG
      }),
      [`${componentCls}-extra`]: {
        marginInlineStart: "auto",
        color: extraColor,
        fontSize: token.fontSize
      },
      [`${componentCls}-view`]: {
        width: "100%",
        borderRadius: token.borderRadiusLG,
        table: {
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse"
        }
      },
      [`${componentCls}-row`]: {
        "> th, > td": {
          paddingBottom: itemPaddingBottom,
          paddingInlineEnd: itemPaddingEnd
        },
        "> th:last-child, > td:last-child": {
          paddingInlineEnd: 0
        },
        "&:last-child": {
          borderBottom: "none",
          "> th, > td": {
            paddingBottom: 0
          }
        }
      },
      [`${componentCls}-item-label`]: {
        color: token.labelColor,
        fontWeight: "normal",
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        textAlign: "start",
        "&::after": {
          content: '":"',
          position: "relative",
          top: -0.5,
          // magic for position
          marginInline: `${unit(colonMarginLeft)} ${unit(colonMarginRight)}`
        },
        [`&${componentCls}-item-no-colon::after`]: {
          content: '""'
        }
      },
      [`${componentCls}-item-no-label`]: {
        "&::after": {
          margin: 0,
          content: '""'
        }
      },
      [`${componentCls}-item-content`]: {
        display: "table-cell",
        flex: 1,
        color: token.contentColor,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        wordBreak: "break-word",
        overflowWrap: "break-word"
      },
      [`${componentCls}-item`]: {
        paddingBottom: 0,
        verticalAlign: "top",
        "&-container": {
          display: "flex",
          [`${componentCls}-item-label`]: {
            display: "inline-flex",
            alignItems: "baseline"
          },
          [`${componentCls}-item-content`]: {
            display: "inline-flex",
            alignItems: "baseline",
            minWidth: "1em"
          }
        }
      },
      "&-middle": {
        [`${componentCls}-row`]: {
          "> th, > td": {
            paddingBottom: token.paddingSM
          }
        }
      },
      "&-small": {
        [`${componentCls}-row`]: {
          "> th, > td": {
            paddingBottom: token.paddingXS
          }
        }
      }
    })
  };
};
const prepareComponentToken = (token) => ({
  labelBg: token.colorFillAlter,
  labelColor: token.colorTextTertiary,
  titleColor: token.colorText,
  titleMarginBottom: token.fontSizeSM * token.lineHeightSM,
  itemPaddingBottom: token.padding,
  itemPaddingEnd: token.padding,
  colonMarginRight: token.marginXS,
  colonMarginLeft: token.marginXXS / 2,
  contentColor: token.colorText,
  extraColor: token.colorText
});
const useStyle = genStyleHooks("Descriptions", (token) => {
  const descriptionToken = merge(token, {});
  return genDescriptionStyles(descriptionToken);
}, prepareComponentToken);
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Descriptions = (props) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    extra,
    column,
    colon = true,
    bordered,
    layout,
    children,
    className,
    rootClassName,
    style,
    size: customizeSize,
    labelStyle,
    contentStyle,
    styles,
    items,
    classNames: descriptionsClassNames
  } = props, restProps = __rest(props, ["prefixCls", "title", "extra", "column", "colon", "bordered", "layout", "children", "className", "rootClassName", "style", "size", "labelStyle", "contentStyle", "styles", "items", "classNames"]);
  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles
  } = useComponentConfig("descriptions");
  const prefixCls = getPrefixCls("descriptions", customizePrefixCls);
  const screens = useBreakpoint();
  const mergedColumn = reactExports.useMemo(() => {
    var _a;
    if (typeof column === "number") {
      return column;
    }
    return (_a = matchScreen(screens, Object.assign(Object.assign({}, DEFAULT_COLUMN_MAP), column))) !== null && _a !== void 0 ? _a : 3;
  }, [screens, column]);
  const mergedItems = useItems(screens, items, children);
  const mergedSize = useSize(customizeSize);
  const rows = useRow(mergedColumn, mergedItems);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const contextValue = reactExports.useMemo(() => ({
    labelStyle,
    contentStyle,
    styles: {
      content: Object.assign(Object.assign({}, contextStyles.content), styles === null || styles === void 0 ? void 0 : styles.content),
      label: Object.assign(Object.assign({}, contextStyles.label), styles === null || styles === void 0 ? void 0 : styles.label)
    },
    classNames: {
      label: classNames(contextClassNames.label, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.label),
      content: classNames(contextClassNames.content, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.content)
    }
  }), [labelStyle, contentStyle, styles, descriptionsClassNames, contextClassNames, contextStyles]);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(DescriptionsContext.Provider, {
    value: contextValue
  }, /* @__PURE__ */ reactExports.createElement("div", Object.assign({
    className: classNames(prefixCls, contextClassName, contextClassNames.root, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.root, {
      [`${prefixCls}-${mergedSize}`]: mergedSize && mergedSize !== "default",
      [`${prefixCls}-bordered`]: !!bordered,
      [`${prefixCls}-rtl`]: direction === "rtl"
    }, className, rootClassName, hashId, cssVarCls),
    style: Object.assign(Object.assign(Object.assign(Object.assign({}, contextStyle), contextStyles.root), styles === null || styles === void 0 ? void 0 : styles.root), style)
  }, restProps), (title || extra) && /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-header`, contextClassNames.header, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.header),
    style: Object.assign(Object.assign({}, contextStyles.header), styles === null || styles === void 0 ? void 0 : styles.header)
  }, title && /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-title`, contextClassNames.title, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.title),
    style: Object.assign(Object.assign({}, contextStyles.title), styles === null || styles === void 0 ? void 0 : styles.title)
  }, title), extra && /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-extra`, contextClassNames.extra, descriptionsClassNames === null || descriptionsClassNames === void 0 ? void 0 : descriptionsClassNames.extra),
    style: Object.assign(Object.assign({}, contextStyles.extra), styles === null || styles === void 0 ? void 0 : styles.extra)
  }, extra)), /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-view`
  }, /* @__PURE__ */ reactExports.createElement("table", null, /* @__PURE__ */ reactExports.createElement("tbody", null, rows.map((row, index) => /* @__PURE__ */ reactExports.createElement(Row, {
    key: index,
    index,
    colon,
    prefixCls,
    vertical: layout === "vertical",
    bordered,
    row
  }))))))));
};
Descriptions.Item = DescriptionsItem;
export {
  Descriptions as D
};
//# sourceMappingURL=index-CNlqt0PQ.js.map
