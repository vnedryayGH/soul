import { C as ConfigContext, f as classNames, bz as cloneElement, Q as genStyleHooks, R as merge, U as unit, V as resetComponent, d as useComponentConfig, ai as useSize, cz as mergeProps, cA as Pagination, _ as _toConsumableArray, bx as useBreakpoint, by as responsiveArray, cB as DefaultRenderEmpty, aC as Spin } from "./index-B4P9h-k1.js";
import { R as React, a as reactExports } from "./react-DAIzMmXQ.js";
import { C as Col, R as Row } from "./row-BcQp44VL.js";
const ListContext = /* @__PURE__ */ React.createContext({});
ListContext.Consumer;
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const Meta = (_a) => {
  var {
    prefixCls: customizePrefixCls,
    className,
    avatar,
    title,
    description
  } = _a, others = __rest$1(_a, ["prefixCls", "className", "avatar", "title", "description"]);
  const {
    getPrefixCls
  } = reactExports.useContext(ConfigContext);
  const prefixCls = getPrefixCls("list", customizePrefixCls);
  const classString = classNames(`${prefixCls}-item-meta`, className);
  const content = /* @__PURE__ */ React.createElement("div", {
    className: `${prefixCls}-item-meta-content`
  }, title && /* @__PURE__ */ React.createElement("h4", {
    className: `${prefixCls}-item-meta-title`
  }, title), description && /* @__PURE__ */ React.createElement("div", {
    className: `${prefixCls}-item-meta-description`
  }, description));
  return /* @__PURE__ */ React.createElement("div", Object.assign({}, others, {
    className: classString
  }), avatar && /* @__PURE__ */ React.createElement("div", {
    className: `${prefixCls}-item-meta-avatar`
  }, avatar), (title || description) && content);
};
const InternalItem = /* @__PURE__ */ React.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    children,
    actions,
    extra,
    styles,
    className,
    classNames: customizeClassNames,
    colStyle
  } = props, others = __rest$1(props, ["prefixCls", "children", "actions", "extra", "styles", "className", "classNames", "colStyle"]);
  const {
    grid,
    itemLayout
  } = reactExports.useContext(ListContext);
  const {
    getPrefixCls,
    list
  } = reactExports.useContext(ConfigContext);
  const moduleClass = (moduleName) => {
    var _a, _b;
    return classNames((_b = (_a = list === null || list === void 0 ? void 0 : list.item) === null || _a === void 0 ? void 0 : _a.classNames) === null || _b === void 0 ? void 0 : _b[moduleName], customizeClassNames === null || customizeClassNames === void 0 ? void 0 : customizeClassNames[moduleName]);
  };
  const moduleStyle = (moduleName) => {
    var _a, _b;
    return Object.assign(Object.assign({}, (_b = (_a = list === null || list === void 0 ? void 0 : list.item) === null || _a === void 0 ? void 0 : _a.styles) === null || _b === void 0 ? void 0 : _b[moduleName]), styles === null || styles === void 0 ? void 0 : styles[moduleName]);
  };
  const isItemContainsTextNodeAndNotSingular = () => {
    let result = false;
    reactExports.Children.forEach(children, (element) => {
      if (typeof element === "string") {
        result = true;
      }
    });
    return result && reactExports.Children.count(children) > 1;
  };
  const isFlexMode = () => {
    if (itemLayout === "vertical") {
      return !!extra;
    }
    return !isItemContainsTextNodeAndNotSingular();
  };
  const prefixCls = getPrefixCls("list", customizePrefixCls);
  const actionsContent = actions && actions.length > 0 && /* @__PURE__ */ React.createElement("ul", {
    className: classNames(`${prefixCls}-item-action`, moduleClass("actions")),
    key: "actions",
    style: moduleStyle("actions")
  }, actions.map((action, i) => (
    // eslint-disable-next-line react/no-array-index-key
    /* @__PURE__ */ React.createElement("li", {
      key: `${prefixCls}-item-action-${i}`
    }, action, i !== actions.length - 1 && /* @__PURE__ */ React.createElement("em", {
      className: `${prefixCls}-item-action-split`
    }))
  )));
  const Element = grid ? "div" : "li";
  const itemChildren = /* @__PURE__ */ React.createElement(Element, Object.assign({}, others, !grid ? {
    ref
  } : {}, {
    className: classNames(`${prefixCls}-item`, {
      [`${prefixCls}-item-no-flex`]: !isFlexMode()
    }, className)
  }), itemLayout === "vertical" && extra ? [/* @__PURE__ */ React.createElement("div", {
    className: `${prefixCls}-item-main`,
    key: "content"
  }, children, actionsContent), /* @__PURE__ */ React.createElement("div", {
    className: classNames(`${prefixCls}-item-extra`, moduleClass("extra")),
    key: "extra",
    style: moduleStyle("extra")
  }, extra)] : [children, actionsContent, cloneElement(extra, {
    key: "extra"
  })]);
  return grid ? /* @__PURE__ */ React.createElement(Col, {
    ref,
    flex: 1,
    style: colStyle
  }, itemChildren) : itemChildren;
});
const Item = InternalItem;
Item.Meta = Meta;
const genBorderedStyle = (token) => {
  const {
    listBorderedCls,
    componentCls,
    paddingLG,
    margin,
    itemPaddingSM,
    itemPaddingLG,
    marginLG,
    borderRadiusLG
  } = token;
  return {
    [listBorderedCls]: {
      border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
      borderRadius: borderRadiusLG,
      [`${componentCls}-header,${componentCls}-footer,${componentCls}-item`]: {
        paddingInline: paddingLG
      },
      [`${componentCls}-pagination`]: {
        margin: `${unit(margin)} ${unit(marginLG)}`
      }
    },
    [`${listBorderedCls}${componentCls}-sm`]: {
      [`${componentCls}-item,${componentCls}-header,${componentCls}-footer`]: {
        padding: itemPaddingSM
      }
    },
    [`${listBorderedCls}${componentCls}-lg`]: {
      [`${componentCls}-item,${componentCls}-header,${componentCls}-footer`]: {
        padding: itemPaddingLG
      }
    }
  };
};
const genResponsiveStyle = (token) => {
  const {
    componentCls,
    screenSM,
    screenMD,
    marginLG,
    marginSM,
    margin
  } = token;
  return {
    [`@media screen and (max-width:${screenMD}px)`]: {
      [componentCls]: {
        [`${componentCls}-item`]: {
          [`${componentCls}-item-action`]: {
            marginInlineStart: marginLG
          }
        }
      },
      [`${componentCls}-vertical`]: {
        [`${componentCls}-item`]: {
          [`${componentCls}-item-extra`]: {
            marginInlineStart: marginLG
          }
        }
      }
    },
    [`@media screen and (max-width: ${screenSM}px)`]: {
      [componentCls]: {
        [`${componentCls}-item`]: {
          flexWrap: "wrap",
          [`${componentCls}-action`]: {
            marginInlineStart: marginSM
          }
        }
      },
      [`${componentCls}-vertical`]: {
        [`${componentCls}-item`]: {
          flexWrap: "wrap-reverse",
          [`${componentCls}-item-main`]: {
            minWidth: token.contentWidth
          },
          [`${componentCls}-item-extra`]: {
            margin: `auto auto ${unit(margin)}`
          }
        }
      }
    }
  };
};
const genBaseStyle = (token) => {
  const {
    componentCls,
    antCls,
    controlHeight,
    minHeight,
    paddingSM,
    marginLG,
    padding,
    itemPadding,
    colorPrimary,
    itemPaddingSM,
    itemPaddingLG,
    paddingXS,
    margin,
    colorText,
    colorTextDescription,
    motionDurationSlow,
    lineWidth,
    headerBg,
    footerBg,
    emptyTextPadding,
    metaMarginBottom,
    avatarMarginRight,
    titleMarginBottom,
    descriptionFontSize
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      position: "relative",
      // fix https://github.com/ant-design/ant-design/issues/46177
      ["--rc-virtual-list-scrollbar-bg"]: token.colorSplit,
      "*": {
        outline: "none"
      },
      [`${componentCls}-header`]: {
        background: headerBg
      },
      [`${componentCls}-footer`]: {
        background: footerBg
      },
      [`${componentCls}-header, ${componentCls}-footer`]: {
        paddingBlock: paddingSM
      },
      [`${componentCls}-pagination`]: {
        marginBlockStart: marginLG,
        // https://github.com/ant-design/ant-design/issues/20037
        [`${antCls}-pagination-options`]: {
          textAlign: "start"
        }
      },
      [`${componentCls}-spin`]: {
        minHeight,
        textAlign: "center"
      },
      [`${componentCls}-items`]: {
        margin: 0,
        padding: 0,
        listStyle: "none"
      },
      [`${componentCls}-item`]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: itemPadding,
        color: colorText,
        [`${componentCls}-item-meta`]: {
          display: "flex",
          flex: 1,
          alignItems: "flex-start",
          maxWidth: "100%",
          [`${componentCls}-item-meta-avatar`]: {
            marginInlineEnd: avatarMarginRight
          },
          [`${componentCls}-item-meta-content`]: {
            flex: "1 0",
            width: 0,
            color: colorText
          },
          [`${componentCls}-item-meta-title`]: {
            margin: `0 0 ${unit(token.marginXXS)} 0`,
            color: colorText,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
            "> a": {
              color: colorText,
              transition: `all ${motionDurationSlow}`,
              "&:hover": {
                color: colorPrimary
              }
            }
          },
          [`${componentCls}-item-meta-description`]: {
            color: colorTextDescription,
            fontSize: descriptionFontSize,
            lineHeight: token.lineHeight
          }
        },
        [`${componentCls}-item-action`]: {
          flex: "0 0 auto",
          marginInlineStart: token.marginXXL,
          padding: 0,
          fontSize: 0,
          listStyle: "none",
          "& > li": {
            position: "relative",
            display: "inline-block",
            padding: `0 ${unit(paddingXS)}`,
            color: colorTextDescription,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
            textAlign: "center",
            "&:first-child": {
              paddingInlineStart: 0
            }
          },
          [`${componentCls}-item-action-split`]: {
            position: "absolute",
            insetBlockStart: "50%",
            insetInlineEnd: 0,
            width: lineWidth,
            height: token.calc(token.fontHeight).sub(token.calc(token.marginXXS).mul(2)).equal(),
            transform: "translateY(-50%)",
            backgroundColor: token.colorSplit
          }
        }
      },
      [`${componentCls}-empty`]: {
        padding: `${unit(padding)} 0`,
        color: colorTextDescription,
        fontSize: token.fontSizeSM,
        textAlign: "center"
      },
      [`${componentCls}-empty-text`]: {
        padding: emptyTextPadding,
        color: token.colorTextDisabled,
        fontSize: token.fontSize,
        textAlign: "center"
      },
      // ============================ without flex ============================
      [`${componentCls}-item-no-flex`]: {
        display: "block"
      }
    }),
    [`${componentCls}-grid ${antCls}-col > ${componentCls}-item`]: {
      display: "block",
      maxWidth: "100%",
      marginBlockEnd: margin,
      paddingBlock: 0,
      borderBlockEnd: "none"
    },
    [`${componentCls}-vertical ${componentCls}-item`]: {
      alignItems: "initial",
      [`${componentCls}-item-main`]: {
        display: "block",
        flex: 1
      },
      [`${componentCls}-item-extra`]: {
        marginInlineStart: marginLG
      },
      [`${componentCls}-item-meta`]: {
        marginBlockEnd: metaMarginBottom,
        [`${componentCls}-item-meta-title`]: {
          marginBlockStart: 0,
          marginBlockEnd: titleMarginBottom,
          color: colorText,
          fontSize: token.fontSizeLG,
          lineHeight: token.lineHeightLG
        }
      },
      [`${componentCls}-item-action`]: {
        marginBlockStart: padding,
        marginInlineStart: "auto",
        "> li": {
          padding: `0 ${unit(padding)}`,
          "&:first-child": {
            paddingInlineStart: 0
          }
        }
      }
    },
    [`${componentCls}-split ${componentCls}-item`]: {
      borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      "&:last-child": {
        borderBlockEnd: "none"
      }
    },
    [`${componentCls}-split ${componentCls}-header`]: {
      borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`
    },
    [`${componentCls}-split${componentCls}-empty ${componentCls}-footer`]: {
      borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`
    },
    [`${componentCls}-loading ${componentCls}-spin-nested-loading`]: {
      minHeight: controlHeight
    },
    [`${componentCls}-split${componentCls}-something-after-last-item ${antCls}-spin-container > ${componentCls}-items > ${componentCls}-item:last-child`]: {
      borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`
    },
    [`${componentCls}-lg ${componentCls}-item`]: {
      padding: itemPaddingLG
    },
    [`${componentCls}-sm ${componentCls}-item`]: {
      padding: itemPaddingSM
    },
    // Horizontal
    [`${componentCls}:not(${componentCls}-vertical)`]: {
      [`${componentCls}-item-no-flex`]: {
        [`${componentCls}-item-action`]: {
          float: "right"
        }
      }
    }
  };
};
const prepareComponentToken = (token) => ({
  contentWidth: 220,
  itemPadding: `${unit(token.paddingContentVertical)} 0`,
  itemPaddingSM: `${unit(token.paddingContentVerticalSM)} ${unit(token.paddingContentHorizontal)}`,
  itemPaddingLG: `${unit(token.paddingContentVerticalLG)} ${unit(token.paddingContentHorizontalLG)}`,
  headerBg: "transparent",
  footerBg: "transparent",
  emptyTextPadding: token.padding,
  metaMarginBottom: token.padding,
  avatarMarginRight: token.padding,
  titleMarginBottom: token.paddingSM,
  descriptionFontSize: token.fontSize
});
const useStyle = genStyleHooks("List", (token) => {
  const listToken = merge(token, {
    listBorderedCls: `${token.componentCls}-bordered`,
    minHeight: token.controlHeightLG
  });
  return [genBaseStyle(listToken), genBorderedStyle(listToken), genResponsiveStyle(listToken)];
}, prepareComponentToken);
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function InternalList(props, ref) {
  const {
    pagination = false,
    prefixCls: customizePrefixCls,
    bordered = false,
    split = true,
    className,
    rootClassName,
    style,
    children,
    itemLayout,
    loadMore,
    grid,
    dataSource = [],
    size: customizeSize,
    header,
    footer,
    loading = false,
    rowKey,
    renderItem,
    locale
  } = props, rest = __rest(props, ["pagination", "prefixCls", "bordered", "split", "className", "rootClassName", "style", "children", "itemLayout", "loadMore", "grid", "dataSource", "size", "header", "footer", "loading", "rowKey", "renderItem", "locale"]);
  const paginationObj = pagination && typeof pagination === "object" ? pagination : {};
  const [paginationCurrent, setPaginationCurrent] = reactExports.useState(paginationObj.defaultCurrent || 1);
  const [paginationSize, setPaginationSize] = reactExports.useState(paginationObj.defaultPageSize || 10);
  const {
    getPrefixCls,
    direction,
    className: contextClassName,
    style: contextStyle
  } = useComponentConfig("list");
  const {
    renderEmpty
  } = reactExports.useContext(ConfigContext);
  const defaultPaginationProps = {
    current: 1,
    total: 0,
    position: "bottom"
  };
  const triggerPaginationEvent = (eventName) => (page, pageSize) => {
    var _a;
    setPaginationCurrent(page);
    setPaginationSize(pageSize);
    if (pagination) {
      (_a = pagination === null || pagination === void 0 ? void 0 : pagination[eventName]) === null || _a === void 0 ? void 0 : _a.call(pagination, page, pageSize);
    }
  };
  const onPaginationChange = triggerPaginationEvent("onChange");
  const onPaginationShowSizeChange = triggerPaginationEvent("onShowSizeChange");
  const renderInternalItem = (item, index) => {
    if (!renderItem) {
      return null;
    }
    let key;
    if (typeof rowKey === "function") {
      key = rowKey(item);
    } else if (rowKey) {
      key = item[rowKey];
    } else {
      key = item.key;
    }
    if (!key) {
      key = `list-item-${index}`;
    }
    return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, {
      key
    }, renderItem(item, index));
  };
  const isSomethingAfterLastItem = !!(loadMore || pagination || footer);
  const prefixCls = getPrefixCls("list", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  let loadingProp = loading;
  if (typeof loadingProp === "boolean") {
    loadingProp = {
      spinning: loadingProp
    };
  }
  const isLoading = !!(loadingProp === null || loadingProp === void 0 ? void 0 : loadingProp.spinning);
  const mergedSize = useSize(customizeSize);
  let sizeCls = "";
  switch (mergedSize) {
    case "large":
      sizeCls = "lg";
      break;
    case "small":
      sizeCls = "sm";
      break;
  }
  const classString = classNames(prefixCls, {
    [`${prefixCls}-vertical`]: itemLayout === "vertical",
    [`${prefixCls}-${sizeCls}`]: sizeCls,
    [`${prefixCls}-split`]: split,
    [`${prefixCls}-bordered`]: bordered,
    [`${prefixCls}-loading`]: isLoading,
    [`${prefixCls}-grid`]: !!grid,
    [`${prefixCls}-something-after-last-item`]: isSomethingAfterLastItem,
    [`${prefixCls}-rtl`]: direction === "rtl"
  }, contextClassName, className, rootClassName, hashId, cssVarCls);
  const paginationProps = mergeProps(defaultPaginationProps, {
    total: dataSource.length,
    current: paginationCurrent,
    pageSize: paginationSize
  }, pagination || {});
  const largestPage = Math.ceil(paginationProps.total / paginationProps.pageSize);
  paginationProps.current = Math.min(paginationProps.current, largestPage);
  const paginationContent = pagination && /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(`${prefixCls}-pagination`)
  }, /* @__PURE__ */ reactExports.createElement(Pagination, Object.assign({
    align: "end"
  }, paginationProps, {
    onChange: onPaginationChange,
    onShowSizeChange: onPaginationShowSizeChange
  })));
  let splitDataSource = _toConsumableArray(dataSource);
  if (pagination) {
    if (dataSource.length > (paginationProps.current - 1) * paginationProps.pageSize) {
      splitDataSource = _toConsumableArray(dataSource).splice((paginationProps.current - 1) * paginationProps.pageSize, paginationProps.pageSize);
    }
  }
  const needResponsive = Object.keys(grid || {}).some((key) => ["xs", "sm", "md", "lg", "xl", "xxl"].includes(key));
  const screens = useBreakpoint(needResponsive);
  const currentBreakpoint = reactExports.useMemo(() => {
    for (let i = 0; i < responsiveArray.length; i += 1) {
      const breakpoint = responsiveArray[i];
      if (screens[breakpoint]) {
        return breakpoint;
      }
    }
    return void 0;
  }, [screens]);
  const colStyle = reactExports.useMemo(() => {
    if (!grid) {
      return void 0;
    }
    const columnCount = currentBreakpoint && grid[currentBreakpoint] ? grid[currentBreakpoint] : grid.column;
    if (columnCount) {
      return {
        width: `${100 / columnCount}%`,
        maxWidth: `${100 / columnCount}%`
      };
    }
  }, [JSON.stringify(grid), currentBreakpoint]);
  let childrenContent = isLoading && /* @__PURE__ */ reactExports.createElement("div", {
    style: {
      minHeight: 53
    }
  });
  if (splitDataSource.length > 0) {
    const items = splitDataSource.map(renderInternalItem);
    childrenContent = grid ? /* @__PURE__ */ reactExports.createElement(Row, {
      gutter: grid.gutter
    }, reactExports.Children.map(items, (child) => /* @__PURE__ */ reactExports.createElement("div", {
      key: child === null || child === void 0 ? void 0 : child.key,
      style: colStyle
    }, child))) : /* @__PURE__ */ reactExports.createElement("ul", {
      className: `${prefixCls}-items`
    }, items);
  } else if (!children && !isLoading) {
    childrenContent = /* @__PURE__ */ reactExports.createElement("div", {
      className: `${prefixCls}-empty-text`
    }, (locale === null || locale === void 0 ? void 0 : locale.emptyText) || (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty("List")) || /* @__PURE__ */ reactExports.createElement(DefaultRenderEmpty, {
      componentName: "List"
    }));
  }
  const paginationPosition = paginationProps.position;
  const contextValue = reactExports.useMemo(() => ({
    grid,
    itemLayout
  }), [JSON.stringify(grid), itemLayout]);
  return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(ListContext.Provider, {
    value: contextValue
  }, /* @__PURE__ */ reactExports.createElement("div", Object.assign({
    ref,
    style: Object.assign(Object.assign({}, contextStyle), style),
    className: classString
  }, rest), (paginationPosition === "top" || paginationPosition === "both") && paginationContent, header && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-header`
  }, header), /* @__PURE__ */ reactExports.createElement(Spin, Object.assign({}, loadingProp), childrenContent, children), footer && /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-footer`
  }, footer), loadMore || (paginationPosition === "bottom" || paginationPosition === "both") && paginationContent)));
}
const ListWithForwardRef = /* @__PURE__ */ reactExports.forwardRef(InternalList);
const List = ListWithForwardRef;
List.Item = Item;
export {
  List as L
};
//# sourceMappingURL=index-CG-iaDjq.js.map
