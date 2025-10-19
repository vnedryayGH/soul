import { a as reactExports, e as commonjsGlobal, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { r as requireDayjs_min, d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { aw as FormItemInputContext, n as Select, aG as Group, aH as Button, Q as genStyleHooks, R as merge, U as unit, V as resetComponent, d as useComponentConfig, E as useMergedState, f as classNames, as as useLocale, aI as locale, aJ as useVariant, aA as genPurePanel, b as usePermissions, B as Button$1, I as Input, l as Space, p as Tag, aB as Tooltip, s as staticMethods, g as getTelegramUser, T as Typography, aC as Spin, aK as Empty, aF as api } from "./index-B4P9h-k1.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { R as RefIcon } from "./PlusOutlined-uyGxXb0G.js";
import { i as initPickerPanelToken, g as genPanelStyle, a as initPanelComponentToken, R as RefPanelPicker, b as generateConfig, D as DatePicker } from "./index-I1l_E206.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { L as List } from "./index-CG-iaDjq.js";
import { R as RefIcon$1 } from "./ClockCircleOutlined-C8ZUJDxJ.js";
import { R as RefIcon$2 } from "./ReloadOutlined-b-zgDpPK.js";
import { R as RefIcon$3 } from "./EditOutlined-znmCCzRl.js";
import { R as RefIcon$4 } from "./DeleteOutlined-CXvGRz1h.js";
import { B as Badge } from "./index-DDcrJiGl.js";
import { R as RefIcon$5 } from "./ExclamationCircleOutlined-Ct9zijvs.js";
import { C as Card, T as Tabs } from "./index-C8B9-ZwJ.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon$6 } from "./CalendarOutlined-CrDxWlMe.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import { R as RefIcon$7 } from "./CheckCircleOutlined-sGJe5hoH.js";
import { R as RefIcon$8 } from "./BellOutlined-BFXf9PSt.js";
import { R as RefIcon$9 } from "./BarChartOutlined-CGK-AIOx.js";
import { R as RefIcon$a } from "./InfoCircleOutlined-BDFvYUED.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./AntdIcon-bc3Msg1y.js";
import "./CalendarOutlined-B_ajlQ0Y.js";
import "./ClockCircleOutlined-B2hpDlMl.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
import "./index-BlJydARW.js";
const YEAR_SELECT_OFFSET = 10;
const YEAR_SELECT_TOTAL = 20;
function YearSelect(props) {
  const {
    fullscreen,
    validRange,
    generateConfig: generateConfig2,
    locale: locale2,
    prefixCls,
    value,
    onChange,
    divRef
  } = props;
  const year = generateConfig2.getYear(value || generateConfig2.getNow());
  let start = year - YEAR_SELECT_OFFSET;
  let end = start + YEAR_SELECT_TOTAL;
  if (validRange) {
    start = generateConfig2.getYear(validRange[0]);
    end = generateConfig2.getYear(validRange[1]) + 1;
  }
  const suffix = locale2 && locale2.year === "年" ? "年" : "";
  const options = [];
  for (let index = start; index < end; index++) {
    options.push({
      label: `${index}${suffix}`,
      value: index
    });
  }
  return /* @__PURE__ */ reactExports.createElement(Select, {
    size: fullscreen ? void 0 : "small",
    options,
    value: year,
    className: `${prefixCls}-year-select`,
    onChange: (numYear) => {
      let newDate = generateConfig2.setYear(value, numYear);
      if (validRange) {
        const [startDate, endDate] = validRange;
        const newYear = generateConfig2.getYear(newDate);
        const newMonth = generateConfig2.getMonth(newDate);
        if (newYear === generateConfig2.getYear(endDate) && newMonth > generateConfig2.getMonth(endDate)) {
          newDate = generateConfig2.setMonth(newDate, generateConfig2.getMonth(endDate));
        }
        if (newYear === generateConfig2.getYear(startDate) && newMonth < generateConfig2.getMonth(startDate)) {
          newDate = generateConfig2.setMonth(newDate, generateConfig2.getMonth(startDate));
        }
      }
      onChange(newDate);
    },
    getPopupContainer: () => divRef.current
  });
}
function MonthSelect(props) {
  const {
    prefixCls,
    fullscreen,
    validRange,
    value,
    generateConfig: generateConfig2,
    locale: locale2,
    onChange,
    divRef
  } = props;
  const month = generateConfig2.getMonth(value || generateConfig2.getNow());
  let start = 0;
  let end = 11;
  if (validRange) {
    const [rangeStart, rangeEnd] = validRange;
    const currentYear = generateConfig2.getYear(value);
    if (generateConfig2.getYear(rangeEnd) === currentYear) {
      end = generateConfig2.getMonth(rangeEnd);
    }
    if (generateConfig2.getYear(rangeStart) === currentYear) {
      start = generateConfig2.getMonth(rangeStart);
    }
  }
  const months = locale2.shortMonths || generateConfig2.locale.getShortMonths(locale2.locale);
  const options = [];
  for (let index = start; index <= end; index += 1) {
    options.push({
      label: months[index],
      value: index
    });
  }
  return /* @__PURE__ */ reactExports.createElement(Select, {
    size: fullscreen ? void 0 : "small",
    className: `${prefixCls}-month-select`,
    value: month,
    options,
    onChange: (newMonth) => {
      onChange(generateConfig2.setMonth(value, newMonth));
    },
    getPopupContainer: () => divRef.current
  });
}
function ModeSwitch(props) {
  const {
    prefixCls,
    locale: locale2,
    mode,
    fullscreen,
    onModeChange
  } = props;
  return /* @__PURE__ */ reactExports.createElement(Group, {
    onChange: ({
      target: {
        value
      }
    }) => {
      onModeChange(value);
    },
    value: mode,
    size: fullscreen ? void 0 : "small",
    className: `${prefixCls}-mode-switch`
  }, /* @__PURE__ */ reactExports.createElement(Button, {
    value: "month"
  }, locale2.month), /* @__PURE__ */ reactExports.createElement(Button, {
    value: "year"
  }, locale2.year));
}
function CalendarHeader(props) {
  const {
    prefixCls,
    fullscreen,
    mode,
    onChange,
    onModeChange
  } = props;
  const divRef = reactExports.useRef(null);
  const formItemInputContext = reactExports.useContext(FormItemInputContext);
  const mergedFormItemInputContext = reactExports.useMemo(() => Object.assign(Object.assign({}, formItemInputContext), {
    isFormItemInput: false
  }), [formItemInputContext]);
  const sharedProps = Object.assign(Object.assign({}, props), {
    fullscreen,
    divRef
  });
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: `${prefixCls}-header`,
    ref: divRef
  }, /* @__PURE__ */ reactExports.createElement(FormItemInputContext.Provider, {
    value: mergedFormItemInputContext
  }, /* @__PURE__ */ reactExports.createElement(YearSelect, Object.assign({}, sharedProps, {
    onChange: (v) => {
      onChange(v, "year");
    }
  })), mode === "month" && /* @__PURE__ */ reactExports.createElement(MonthSelect, Object.assign({}, sharedProps, {
    onChange: (v) => {
      onChange(v, "month");
    }
  }))), /* @__PURE__ */ reactExports.createElement(ModeSwitch, Object.assign({}, sharedProps, {
    onModeChange
  })));
}
const genCalendarStyles = (token) => {
  const {
    calendarCls,
    componentCls,
    fullBg,
    fullPanelBg,
    itemActiveBg
  } = token;
  return {
    [calendarCls]: Object.assign(Object.assign(Object.assign({}, genPanelStyle(token)), resetComponent(token)), {
      background: fullBg,
      "&-rtl": {
        direction: "rtl"
      },
      [`${calendarCls}-header`]: {
        display: "flex",
        justifyContent: "flex-end",
        padding: `${unit(token.paddingSM)} 0`,
        [`${calendarCls}-year-select`]: {
          minWidth: token.yearControlWidth
        },
        [`${calendarCls}-month-select`]: {
          minWidth: token.monthControlWidth,
          marginInlineStart: token.marginXS
        },
        [`${calendarCls}-mode-switch`]: {
          marginInlineStart: token.marginXS
        }
      }
    }),
    [`${calendarCls} ${componentCls}-panel`]: {
      background: fullPanelBg,
      border: 0,
      borderTop: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      borderRadius: 0,
      [`${componentCls}-month-panel, ${componentCls}-date-panel`]: {
        width: "auto"
      },
      [`${componentCls}-body`]: {
        padding: `${unit(token.paddingXS)} 0`
      },
      [`${componentCls}-content`]: {
        width: "100%"
      }
    },
    [`${calendarCls}-mini`]: {
      borderRadius: token.borderRadiusLG,
      [`${calendarCls}-header`]: {
        paddingInlineEnd: token.paddingXS,
        paddingInlineStart: token.paddingXS
      },
      [`${componentCls}-panel`]: {
        borderRadius: `0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)}`
      },
      [`${componentCls}-content`]: {
        height: token.miniContentHeight,
        th: {
          height: "auto",
          padding: 0,
          lineHeight: unit(token.weekHeight)
        }
      },
      [`${componentCls}-cell::before`]: {
        pointerEvents: "none"
      }
    },
    [`${calendarCls}${calendarCls}-full`]: {
      [`${componentCls}-panel`]: {
        display: "block",
        width: "100%",
        textAlign: "end",
        background: fullBg,
        border: 0,
        [`${componentCls}-body`]: {
          "th, td": {
            padding: 0
          },
          th: {
            height: "auto",
            paddingInlineEnd: token.paddingSM,
            paddingBottom: token.paddingXXS,
            lineHeight: unit(token.weekHeight)
          }
        }
      },
      [`${componentCls}-cell-week ${componentCls}-cell-inner`]: {
        display: "block",
        borderRadius: 0,
        borderTop: `${unit(token.lineWidthBold)} ${token.lineType} ${token.colorSplit}`,
        width: "100%",
        height: token.calc(token.dateValueHeight).add(token.dateContentHeight).add(token.calc(token.paddingXS).div(2)).add(token.lineWidthBold).equal()
      },
      [`${componentCls}-cell`]: {
        "&::before": {
          display: "none"
        },
        "&:hover": {
          [`${calendarCls}-date`]: {
            background: token.controlItemBgHover
          }
        },
        [`${calendarCls}-date-today::before`]: {
          display: "none"
        },
        // >>> Selected
        [`&-in-view${componentCls}-cell-selected`]: {
          [`${calendarCls}-date, ${calendarCls}-date-today`]: {
            background: itemActiveBg
          }
        },
        "&-selected, &-selected:hover": {
          [`${calendarCls}-date, ${calendarCls}-date-today`]: {
            [`${calendarCls}-date-value`]: {
              color: token.colorPrimary
            }
          }
        }
      },
      [`${calendarCls}-date`]: {
        display: "block",
        width: "auto",
        height: "auto",
        margin: `0 ${unit(token.calc(token.marginXS).div(2).equal())}`,
        padding: `${unit(token.calc(token.paddingXS).div(2).equal())} ${unit(token.paddingXS)} 0`,
        border: 0,
        borderTop: `${unit(token.lineWidthBold)} ${token.lineType} ${token.colorSplit}`,
        borderRadius: 0,
        transition: `background ${token.motionDurationSlow}`,
        "&-value": {
          lineHeight: unit(token.dateValueHeight),
          transition: `color ${token.motionDurationSlow}`
        },
        "&-content": {
          position: "static",
          width: "auto",
          height: token.dateContentHeight,
          overflowY: "auto",
          color: token.colorText,
          lineHeight: token.lineHeight,
          textAlign: "start"
        },
        "&-today": {
          borderColor: token.colorPrimary,
          [`${calendarCls}-date-value`]: {
            color: token.colorText
          }
        }
      }
    },
    [`@media only screen and (max-width: ${unit(token.screenXS)}) `]: {
      [calendarCls]: {
        [`${calendarCls}-header`]: {
          display: "block",
          [`${calendarCls}-year-select`]: {
            width: "50%"
          },
          [`${calendarCls}-month-select`]: {
            width: `calc(50% - ${unit(token.paddingXS)})`
          },
          [`${calendarCls}-mode-switch`]: {
            width: "100%",
            marginTop: token.marginXS,
            marginInlineStart: 0,
            "> label": {
              width: "50%",
              textAlign: "center"
            }
          }
        }
      }
    }
  };
};
const prepareComponentToken = (token) => Object.assign({
  fullBg: token.colorBgContainer,
  fullPanelBg: token.colorBgContainer,
  itemActiveBg: token.controlItemBgActive,
  yearControlWidth: 80,
  monthControlWidth: 70,
  miniContentHeight: 256
}, initPanelComponentToken(token));
const useStyle = genStyleHooks("Calendar", (token) => {
  const calendarCls = `${token.componentCls}-calendar`;
  const calendarToken = merge(token, initPickerPanelToken(token), {
    calendarCls,
    pickerCellInnerCls: `${token.componentCls}-cell-inner`,
    dateValueHeight: token.controlHeightSM,
    weekHeight: token.calc(token.controlHeightSM).mul(0.75).equal(),
    dateContentHeight: token.calc(token.calc(token.fontHeightSM).add(token.marginXS)).mul(3).add(token.calc(token.lineWidth).mul(2)).equal()
  });
  return genCalendarStyles(calendarToken);
}, prepareComponentToken);
const isSameYear = (date1, date2, config) => {
  const {
    getYear
  } = config;
  return date1 && date2 && getYear(date1) === getYear(date2);
};
const isSameMonth = (date1, date2, config) => {
  const {
    getMonth
  } = config;
  return isSameYear(date1, date2, config) && getMonth(date1) === getMonth(date2);
};
const isSameDate = (date1, date2, config) => {
  const {
    getDate
  } = config;
  return isSameMonth(date1, date2, config) && getDate(date1) === getDate(date2);
};
const generateCalendar = (generateConfig2) => {
  const Calendar2 = (props) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      style,
      dateFullCellRender,
      dateCellRender,
      monthFullCellRender,
      monthCellRender,
      cellRender,
      fullCellRender,
      headerRender,
      value,
      defaultValue,
      disabledDate,
      mode,
      validRange,
      fullscreen = true,
      showWeek,
      onChange,
      onPanelChange,
      onSelect
    } = props;
    const {
      getPrefixCls,
      direction,
      className: contextClassName,
      style: contextStyle
    } = useComponentConfig("calendar");
    const prefixCls = getPrefixCls("picker", customizePrefixCls);
    const calendarPrefixCls = `${prefixCls}-calendar`;
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, calendarPrefixCls);
    const today = generateConfig2.getNow();
    const [mergedValue, setMergedValue] = useMergedState(() => value || generateConfig2.getNow(), {
      defaultValue,
      value
    });
    const [mergedMode, setMergedMode] = useMergedState("month", {
      value: mode
    });
    const panelMode = reactExports.useMemo(() => mergedMode === "year" ? "month" : "date", [mergedMode]);
    const mergedDisabledDate = reactExports.useCallback((date) => {
      const notInRange = validRange ? generateConfig2.isAfter(validRange[0], date) || generateConfig2.isAfter(date, validRange[1]) : false;
      return notInRange || !!(disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(date));
    }, [disabledDate, validRange]);
    const triggerPanelChange = (date, newMode) => {
      onPanelChange === null || onPanelChange === void 0 ? void 0 : onPanelChange(date, newMode);
    };
    const triggerChange = (date) => {
      setMergedValue(date);
      if (!isSameDate(date, mergedValue, generateConfig2)) {
        if (panelMode === "date" && !isSameMonth(date, mergedValue, generateConfig2) || panelMode === "month" && !isSameYear(date, mergedValue, generateConfig2)) {
          triggerPanelChange(date, mergedMode);
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(date);
      }
    };
    const triggerModeChange = (newMode) => {
      setMergedMode(newMode);
      triggerPanelChange(mergedValue, newMode);
    };
    const onInternalSelect = (date, source) => {
      triggerChange(date);
      onSelect === null || onSelect === void 0 ? void 0 : onSelect(date, {
        source
      });
    };
    const dateRender = reactExports.useCallback((date, info) => {
      if (fullCellRender) {
        return fullCellRender(date, info);
      }
      if (dateFullCellRender) {
        return dateFullCellRender(date);
      }
      return /* @__PURE__ */ reactExports.createElement("div", {
        className: classNames(`${prefixCls}-cell-inner`, `${calendarPrefixCls}-date`, {
          [`${calendarPrefixCls}-date-today`]: isSameDate(today, date, generateConfig2)
        })
      }, /* @__PURE__ */ reactExports.createElement("div", {
        className: `${calendarPrefixCls}-date-value`
      }, String(generateConfig2.getDate(date)).padStart(2, "0")), /* @__PURE__ */ reactExports.createElement("div", {
        className: `${calendarPrefixCls}-date-content`
      }, cellRender ? cellRender(date, info) : dateCellRender === null || dateCellRender === void 0 ? void 0 : dateCellRender(date)));
    }, [dateFullCellRender, dateCellRender, cellRender, fullCellRender]);
    const monthRender = reactExports.useCallback((date, info) => {
      if (fullCellRender) {
        return fullCellRender(date, info);
      }
      if (monthFullCellRender) {
        return monthFullCellRender(date);
      }
      const months = info.locale.shortMonths || generateConfig2.locale.getShortMonths(info.locale.locale);
      return /* @__PURE__ */ reactExports.createElement("div", {
        className: classNames(`${prefixCls}-cell-inner`, `${calendarPrefixCls}-date`, {
          [`${calendarPrefixCls}-date-today`]: isSameMonth(today, date, generateConfig2)
        })
      }, /* @__PURE__ */ reactExports.createElement("div", {
        className: `${calendarPrefixCls}-date-value`
      }, months[generateConfig2.getMonth(date)]), /* @__PURE__ */ reactExports.createElement("div", {
        className: `${calendarPrefixCls}-date-content`
      }, cellRender ? cellRender(date, info) : monthCellRender === null || monthCellRender === void 0 ? void 0 : monthCellRender(date)));
    }, [monthFullCellRender, monthCellRender, cellRender, fullCellRender]);
    const [contextLocale] = useLocale("Calendar", locale);
    const locale$1 = Object.assign(Object.assign({}, contextLocale), props.locale);
    const mergedCellRender = (current, info) => {
      if (info.type === "date") {
        return dateRender(current, info);
      }
      if (info.type === "month") {
        return monthRender(current, Object.assign(Object.assign({}, info), {
          locale: locale$1 === null || locale$1 === void 0 ? void 0 : locale$1.lang
        }));
      }
    };
    return wrapCSSVar(/* @__PURE__ */ reactExports.createElement("div", {
      className: classNames(calendarPrefixCls, {
        [`${calendarPrefixCls}-full`]: fullscreen,
        [`${calendarPrefixCls}-mini`]: !fullscreen,
        [`${calendarPrefixCls}-rtl`]: direction === "rtl"
      }, contextClassName, className, rootClassName, hashId, cssVarCls),
      style: Object.assign(Object.assign({}, contextStyle), style)
    }, headerRender ? headerRender({
      value: mergedValue,
      type: mergedMode,
      onChange: (nextDate) => {
        onInternalSelect(nextDate, "customize");
      },
      onTypeChange: triggerModeChange
    }) : /* @__PURE__ */ reactExports.createElement(CalendarHeader, {
      prefixCls: calendarPrefixCls,
      value: mergedValue,
      generateConfig: generateConfig2,
      mode: mergedMode,
      fullscreen,
      locale: locale$1 === null || locale$1 === void 0 ? void 0 : locale$1.lang,
      validRange,
      onChange: onInternalSelect,
      onModeChange: triggerModeChange
    }), /* @__PURE__ */ reactExports.createElement(RefPanelPicker, {
      value: mergedValue,
      prefixCls,
      locale: locale$1 === null || locale$1 === void 0 ? void 0 : locale$1.lang,
      generateConfig: generateConfig2,
      cellRender: mergedCellRender,
      onSelect: (nextDate) => {
        onInternalSelect(nextDate, panelMode);
      },
      mode: panelMode,
      picker: panelMode,
      disabledDate: mergedDisabledDate,
      hideHeader: true,
      showWeek
    })));
  };
  return Calendar2;
};
const Calendar = generateCalendar(generateConfig);
Calendar.generateCalendar = generateCalendar;
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const {
  TimePicker: InternalTimePicker,
  RangePicker: InternalRangePicker
} = DatePicker;
const RangePicker = /* @__PURE__ */ reactExports.forwardRef((props, ref) => /* @__PURE__ */ reactExports.createElement(InternalRangePicker, Object.assign({}, props, {
  picker: "time",
  mode: void 0,
  ref
})));
const TimePicker = /* @__PURE__ */ reactExports.forwardRef((_a, ref) => {
  var {
    addon,
    renderExtraFooter,
    variant,
    bordered
  } = _a, restProps = __rest(_a, ["addon", "renderExtraFooter", "variant", "bordered"]);
  const [mergedVariant] = useVariant("timePicker", variant, bordered);
  const internalRenderExtraFooter = reactExports.useMemo(() => {
    if (renderExtraFooter) {
      return renderExtraFooter;
    }
    if (addon) {
      return addon;
    }
    return void 0;
  }, [addon, renderExtraFooter]);
  return /* @__PURE__ */ reactExports.createElement(InternalTimePicker, Object.assign({}, restProps, {
    mode: void 0,
    ref,
    renderExtraFooter: internalRenderExtraFooter,
    variant: mergedVariant
  }));
});
const PurePanel = genPurePanel(TimePicker, "popupAlign", void 0, "picker");
TimePicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
TimePicker.RangePicker = RangePicker;
TimePicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
var ru = { exports: {} };
(function(module, exports) {
  !function(_, t) {
    module.exports = t(requireDayjs_min());
  }(commonjsGlobal, function(_) {
    function t(_2) {
      return _2 && "object" == typeof _2 && "default" in _2 ? _2 : { default: _2 };
    }
    var e = t(_), n = "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"), s = "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"), r = "янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"), o = "янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_"), i = /D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;
    function d(_2, t2, e2) {
      var n2, s2;
      return "m" === e2 ? t2 ? "минута" : "минуту" : _2 + " " + (n2 = +_2, s2 = { mm: t2 ? "минута_минуты_минут" : "минуту_минуты_минут", hh: "час_часа_часов", dd: "день_дня_дней", MM: "месяц_месяца_месяцев", yy: "год_года_лет" }[e2].split("_"), n2 % 10 == 1 && n2 % 100 != 11 ? s2[0] : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? s2[1] : s2[2]);
    }
    var u = function(_2, t2) {
      return i.test(t2) ? n[_2.month()] : s[_2.month()];
    };
    u.s = s, u.f = n;
    var a = function(_2, t2) {
      return i.test(t2) ? r[_2.month()] : o[_2.month()];
    };
    a.s = o, a.f = r;
    var m = { name: "ru", weekdays: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"), weekdaysShort: "вск_пнд_втр_срд_чтв_птн_сбт".split("_"), weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"), months: u, monthsShort: a, weekStart: 1, yearStart: 4, formats: { LT: "H:mm", LTS: "H:mm:ss", L: "DD.MM.YYYY", LL: "D MMMM YYYY г.", LLL: "D MMMM YYYY г., H:mm", LLLL: "dddd, D MMMM YYYY г., H:mm" }, relativeTime: { future: "через %s", past: "%s назад", s: "несколько секунд", m: d, mm: d, h: "час", hh: d, d: "день", dd: d, M: "месяц", MM: d, y: "год", yy: d }, ordinal: function(_2) {
      return _2;
    }, meridiem: function(_2) {
      return _2 < 4 ? "ночи" : _2 < 12 ? "утра" : _2 < 17 ? "дня" : "вечера";
    } };
    return e.default.locale(m, null, true), m;
  });
})(ru);
dayjs.locale("ru");
const { TextArea } = Input;
const priorityColors = {
  low: "#52c41a",
  // зеленый
  medium: "#1890ff",
  // синий
  high: "#fa8c16",
  // оранжевый
  urgent: "#f5222d"
  // красный
};
const typeColors = {
  birthday: "#eb2f96",
  // розовый
  meeting: "#1890ff",
  // синий
  deadline: "#f5222d",
  // красный
  holiday: "#52c41a",
  // зеленый
  custom: "#722ed1",
  // фиолетовый
  reminder: "#13c2c2"
  // циан
};
const CalendarGrid = ({
  reminders,
  onReminderCreate,
  onReminderUpdate,
  onReminderDelete,
  loading = false
}) => {
  const [selectedDate, setSelectedDate] = reactExports.useState(dayjs());
  const [modalVisible, setModalVisible] = reactExports.useState(false);
  const [editingReminder, setEditingReminder] = reactExports.useState(null);
  const [form] = Form.useForm();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission("api.reminders.write");
  const canEdit = hasPermission("api.reminders.write");
  const canDelete = hasPermission("api.reminders.delete");
  const getRemindersForDate = (date) => {
    return reminders.filter(
      (reminder) => dayjs(reminder.reminder_date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };
  const dateCellRender = (date) => {
    const dayReminders = getRemindersForDate(date);
    if (dayReminders.length === 0) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "calendar-events", children: [
      dayReminders.slice(0, 3).map((reminder, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          status: "processing",
          color: priorityColors[reminder.priority],
          text: /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: `${reminder.title} (${reminder.priority})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "calendar-event-text", children: reminder.title.length > 10 ? `${reminder.title.slice(0, 10)}...` : reminder.title }) }),
          style: {
            display: "block",
            fontSize: "11px",
            marginBottom: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }
        },
        reminder.id
      )),
      dayReminders.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "secondary", style: { fontSize: "10px" }, children: [
        "+",
        dayReminders.length - 3,
        " еще"
      ] })
    ] });
  };
  const onDateSelect = (date) => {
    setSelectedDate(date);
    const dayReminders = getRemindersForDate(date);
    if (dayReminders.length > 0) {
      Modal.info({
        title: `Напоминания на ${date.format("DD MMMM YYYY")}`,
        width: 600,
        content: /* @__PURE__ */ jsxRuntimeExports.jsx(
          List,
          {
            dataSource: dayReminders,
            renderItem: (reminder) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              List.Item,
              {
                actions: [
                  canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button$1,
                    {
                      type: "text",
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
                      onClick: () => handleEdit(reminder)
                    }
                  ),
                  canDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button$1,
                    {
                      type: "text",
                      danger: true,
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
                      onClick: () => handleDelete(reminder.id)
                    }
                  )
                ].filter(Boolean),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  List.Item.Meta,
                  {
                    title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: reminder.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: typeColors[reminder.reminder_type], children: reminder.reminder_type }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: priorityColors[reminder.priority], children: reminder.priority }),
                      reminder.is_recurring && /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {})
                    ] }),
                    description: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: reminder.description }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "secondary", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
                        " ",
                        dayjs(reminder.reminder_date).format("HH:mm")
                      ] })
                    ] })
                  }
                )
              }
            )
          }
        )
      });
    }
  };
  const handleCreate = (date) => {
    setEditingReminder(null);
    form.resetFields();
    const now = dayjs();
    const baseDate = date || selectedDate || now;
    const defaultTime = baseDate.isSame(now, "day") ? now.add(15, "minute") : baseDate.hour(9).minute(0);
    form.setFieldsValue({
      reminder_date: baseDate,
      reminder_time: defaultTime
    });
    setModalVisible(true);
  };
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    const reminderDate = dayjs(reminder.reminder_date);
    form.setFieldsValue({
      title: reminder.title,
      description: reminder.description,
      reminder_date: reminderDate,
      reminder_time: reminderDate,
      reminder_type: reminder.reminder_type,
      priority: reminder.priority,
      is_recurring: reminder.is_recurring,
      recurrence_pattern: reminder.recurrence_pattern
    });
    setModalVisible(true);
  };
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Удалить напоминание?",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
      content: "Это действие нельзя отменить.",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          await onReminderDelete(id);
          staticMethods.success("Напоминание удалено");
        } catch (error) {
          staticMethods.error("Ошибка удаления напоминания");
        }
      }
    });
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const reminderDateTime = values.reminder_date.hour(values.reminder_time.hour()).minute(values.reminder_time.minute());
      const minFuture = dayjs().add(1, "minute");
      const finalDt = reminderDateTime.isBefore(minFuture) ? minFuture : reminderDateTime;
      const reminderData = {
        title: values.title,
        description: values.description || values.title,
        reminder_date: finalDt.toISOString(),
        reminder_type: values.reminder_type,
        priority: values.priority,
        is_recurring: values.is_recurring || false,
        recurrence_pattern: values.is_recurring ? values.recurrence_pattern : null
      };
      if (editingReminder) {
        await onReminderUpdate(editingReminder.id, reminderData);
        staticMethods.success("Напоминание обновлено");
      } else {
        await onReminderCreate(reminderData);
        staticMethods.success("Напоминание создано");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      const msg = String((error == null ? void 0 : error.message) || "Ошибка сохранения напоминания");
      staticMethods.error(msg);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "calendar-grid-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendar-header", style: { marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }, children: canCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button$1,
      {
        type: "primary",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
        onClick: () => handleCreate(selectedDate),
        loading,
        children: "Создать напоминание"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Calendar,
      {
        dateCellRender,
        onSelect: onDateSelect,
        value: selectedDate,
        onChange: setSelectedDate
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: editingReminder ? "Редактировать напоминание" : "Создать напоминание",
        open: modalVisible,
        onOk: handleSave,
        onCancel: () => {
          setModalVisible(false);
          form.resetFields();
        },
        okText: "Сохранить",
        cancelText: "Отмена",
        confirmLoading: loading,
        width: 600,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Form,
          {
            form,
            layout: "vertical",
            initialValues: {
              reminder_type: "custom",
              priority: "medium",
              is_recurring: false
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  name: "title",
                  label: "Название",
                  rules: [{ required: true, message: "Введите название напоминания" }],
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Название напоминания" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  name: "description",
                  label: "Описание",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TextArea,
                    {
                      placeholder: "Подробное описание (необязательно)",
                      rows: 3
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    name: "reminder_date",
                    label: "Дата",
                    rules: [{ required: true, message: "Выберите дату" }],
                    style: { flex: 1, marginRight: 8 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      DatePicker,
                      {
                        style: { width: "100%" },
                        format: "DD.MM.YYYY",
                        placeholder: "Выберите дату"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    name: "reminder_time",
                    label: "Время",
                    rules: [{ required: true, message: "Выберите время" }],
                    style: { flex: 1 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TimePicker,
                      {
                        style: { width: "100%" },
                        format: "HH:mm",
                        placeholder: "Выберите время"
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    name: "reminder_type",
                    label: "Тип",
                    style: { flex: 1, marginRight: 8 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "custom", children: "Обычное" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "meeting", children: "Встреча" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "deadline", children: "Дедлайн" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "birthday", children: "День рождения" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "holiday", children: "Праздник" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "reminder", children: "Напоминание" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Form.Item,
                  {
                    name: "priority",
                    label: "Приоритет",
                    style: { flex: 1 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "low", children: "Низкий" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "medium", children: "Средний" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "high", children: "Высокий" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "urgent", children: "Срочный" })
                    ] })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  name: "is_recurring",
                  valuePropName: "checked",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Повторяющееся напоминание" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  noStyle: true,
                  shouldUpdate: (prevValues, currentValues) => prevValues.is_recurring !== currentValues.is_recurring,
                  children: ({ getFieldValue }) => getFieldValue("is_recurring") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Form.Item,
                    {
                      name: "recurrence_pattern",
                      label: "Повтор",
                      rules: [{ required: true, message: "Выберите частоту повтора" }],
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { placeholder: "Выберите частоту", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "daily", children: "Ежедневно" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "weekly", children: "Еженедельно" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "monthly", children: "Ежемесячно" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "yearly", children: "Ежегодно" })
                      ] })
                    }
                  ) : null
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { jsx: true, children: `
        .calendar-grid-container { width: 100%; }
        .calendar-events {
          max-height: 60px;
          overflow: hidden;
        }
        
        .calendar-event-text {
          font-size: 11px;
          line-height: 1.2;
        }
        
        .ant-picker-calendar-date-content {
          height: 60px !important;
          overflow: hidden;
        }
        
        .ant-badge-status-text {
          font-size: 11px !important;
        }
      ` })
  ] });
};
dayjs.locale("ru");
const { Title, Text: Text$1 } = Typography;
const { TabPane } = Tabs;
const getTypeClass = (type) => `sp-tag sp-tag--type-${type}`;
const getPrioClass = (p) => `sp-tag sp-tag--prio-${p}`;
const DatesRemindersV2 = () => {
  const [events, setEvents] = reactExports.useState([]);
  const [reminders, setReminders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("calendar");
  const telegramUser = getTelegramUser();
  const { hasPermission, hasRole, state: permsState, refreshPermissions } = usePermissions();
  const isArchitect = hasRole("architect");
  const [overrideTgId, setOverrideTgId] = reactExports.useState("");
  const requireTgId = () => {
    var _a;
    const id = isArchitect && overrideTgId ? overrideTgId : (_a = telegramUser == null ? void 0 : telegramUser.id) == null ? void 0 : _a.toString();
    if (!id) {
      throw new Error("Не найден Telegram ID. Откройте приложение из Telegram.");
    }
    return id;
  };
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api("/messages/dates", {
        method: "GET",
        headers: {
          "X-Telegram-User-ID": requireTgId()
        }
      });
      if (resp.status === "success") {
        setEvents(resp.events || []);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка загрузки дат");
    } finally {
      setLoading(false);
    }
  };
  const loadReminders = async () => {
    setLoading(true);
    try {
      const resp = await api("/reminders?include_sent=true&limit=200", {
        method: "GET",
        headers: {
          "X-Telegram-User-ID": requireTgId()
        }
      });
      const arr = Array.isArray(resp) ? resp : [];
      arr.sort((a, b) => new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime());
      setReminders(arr);
    } catch (e) {
      console.error("Ошибка загрузки напоминаний:", e);
      setError((e == null ? void 0 : e.message) || "Ошибка загрузки напоминаний");
    } finally {
      setLoading(false);
    }
  };
  const handleReminderCreate = async (reminderData) => {
    const payload = {
      ...reminderData,
      ai_prompt: `Напоминание: ${reminderData.title}`
    };
    const created = await api("/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-User-ID": requireTgId()
      },
      body: JSON.stringify(payload)
    });
    if (created && created.id) {
      try {
        setReminders((prev) => [created, ...prev]);
      } catch (e) {
      }
      try {
        setTimeout(() => {
          void loadReminders();
        }, 600);
      } catch (e) {
      }
    }
  };
  const handleReminderUpdate = async (id, reminderData) => {
    const updated = await api(`/reminders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-User-ID": requireTgId()
      },
      body: JSON.stringify(reminderData)
    });
    if (updated) {
      setReminders(reminders.map((r) => r.id === id ? { ...r, ...updated } : r));
    }
  };
  const handleReminderDelete = async (id) => {
    await api(`/reminders/${id}`, {
      method: "DELETE",
      headers: {
        "X-Telegram-User-ID": requireTgId()
      }
    });
    setReminders(reminders.filter((r) => r.id !== id));
  };
  const getStatistics = () => {
    const total = reminders.length;
    const pending = reminders.filter((r) => !r.is_sent && dayjs(r.reminder_date).isAfter(dayjs())).length;
    const overdue = reminders.filter((r) => !r.is_sent && dayjs(r.reminder_date).isBefore(dayjs())).length;
    const completed = reminders.filter((r) => r.is_sent).length;
    const recurring = reminders.filter((r) => r.is_recurring).length;
    return { total, pending, overdue, completed, recurring };
  };
  const stats = getStatistics();
  const getGroupedReminders = () => {
    const now = dayjs();
    return {
      overdue: reminders.filter((r) => !r.is_sent && dayjs(r.reminder_date).isBefore(now)),
      today: reminders.filter((r) => !r.is_sent && dayjs(r.reminder_date).format("YYYY-MM-DD") === now.format("YYYY-MM-DD")),
      upcoming: reminders.filter((r) => !r.is_sent && dayjs(r.reminder_date).isAfter(now) && !dayjs(r.reminder_date).isSame(now, "day")),
      completed: reminders.filter((r) => r.is_sent)
    };
  };
  const groupedReminders = getGroupedReminders();
  reactExports.useEffect(() => {
    loadEvents();
    loadReminders();
  }, []);
  if (!hasPermission("api.reminders.read") && !hasRole("architect")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Доступ ограничен",
        description: "У вас нет прав для просмотра календаря и напоминаний.",
        type: "warning",
        showIcon: true
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen p-4", style: { background: "var(--sp-gradient-background)", overflowX: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "sp-edge-highlight sp-card-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, style: { margin: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}),
            " Календарь и напоминания"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { type: "secondary", children: "Управление напоминаниями и просмотр важных дат из сообщений" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button$1, { onClick: () => {
          try {
            refreshPermissions();
          } catch (e) {
          }
        }, children: "Обновить роли" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$1, { type: "secondary", children: [
        "Текущие роли: ",
        (permsState.roles || []).map((r) => r.name).join(", ") || "—"
      ] }) }),
      isArchitect && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { type: "secondary", children: "TG ID пользователя:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: overrideTgId,
            onChange: (e) => setOverrideTgId(e.target.value.replace(/[^0-9]/g, "")),
            placeholder: "468326902",
            style: { padding: "6px 8px", border: "1px solid var(--sp-border-primary)", borderRadius: "var(--sp-radius-sm)", maxWidth: "160px" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button$1, { onClick: () => {
          try {
            loadEvents();
            loadReminders();
          } catch (e) {
          }
        }, children: "Применить" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "sp-edge-highlight sp-card-elevated", title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$9, {}),
      " Статистика"
    ] }), bodyStyle: { padding: "12px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 16, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Всего",
          value: stats.total,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {})
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Ожидают",
          value: stats.pending,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
          valueStyle: { color: "var(--sp-color-primary)" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Просрочено",
          value: stats.overdue,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
          valueStyle: { color: "var(--sp-color-danger)" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Выполнено",
          value: stats.completed,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}),
          valueStyle: { color: "var(--sp-color-success)" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Повторяющиеся",
          value: stats.recurring,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, {}),
          valueStyle: { color: "var(--sp-color-info)" }
        }
      ) })
    ] }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Ошибка",
        description: error,
        type: "error",
        closable: true,
        onClose: () => setError(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "sp-edge-highlight sp-card-elevated", bodyStyle: { padding: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { activeKey: activeTab, onChange: setActiveTab, items: void 0, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabPane,
        {
          tab: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}),
            " Календарь"
          ] }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { spinning: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CalendarGrid,
            {
              reminders,
              onReminderCreate: handleReminderCreate,
              onReminderUpdate: handleReminderUpdate,
              onReminderDelete: handleReminderDelete,
              loading
            }
          ) })
        },
        "calendar"
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabPane,
        {
          tab: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, {}),
            " Напоминания"
          ] }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { spinning: loading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            groupedReminders.overdue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                size: "small",
                title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, { style: { color: "#f5222d" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Просроченные (",
                    groupedReminders.overdue.length,
                    ")"
                  ] })
                ] }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  List,
                  {
                    dataSource: groupedReminders.overdue,
                    renderItem: (reminder) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      List.Item.Meta,
                      {
                        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { strong: true, children: reminder.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: getTypeClass(reminder.reminder_type), children: reminder.reminder_type }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: getPrioClass(reminder.priority), children: reminder.priority })
                        ] }),
                        description: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { children: reminder.description }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$1, { type: "danger", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
                            " ",
                            dayjs(reminder.reminder_date).format("DD.MM.YYYY HH:mm")
                          ] })
                        ] })
                      }
                    ) })
                  }
                )
              }
            ),
            groupedReminders.today.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                size: "small",
                title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, { style: { color: "#1890ff" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Сегодня (",
                    groupedReminders.today.length,
                    ")"
                  ] })
                ] }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  List,
                  {
                    dataSource: groupedReminders.today,
                    renderItem: (reminder) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      List.Item.Meta,
                      {
                        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { strong: true, children: reminder.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: getTypeClass(reminder.reminder_type), children: reminder.reminder_type }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: getPrioClass(reminder.priority), children: reminder.priority })
                        ] }),
                        description: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { children: reminder.description }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$1, { type: "secondary", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
                            " ",
                            dayjs(reminder.reminder_date).format("HH:mm")
                          ] })
                        ] })
                      }
                    ) })
                  }
                )
              }
            ),
            groupedReminders.upcoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                size: "small",
                title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { color: "#52c41a" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Предстоящие (",
                    groupedReminders.upcoming.length,
                    ")"
                  ] })
                ] }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  List,
                  {
                    dataSource: groupedReminders.upcoming.slice(0, 10),
                    renderItem: (reminder) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      List.Item.Meta,
                      {
                        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { strong: true, children: reminder.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: getTypeClass(reminder.reminder_type), children: reminder.reminder_type }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: getPrioClass(reminder.priority), children: reminder.priority })
                        ] }),
                        description: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { children: reminder.description }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$1, { type: "secondary", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
                            " ",
                            dayjs(reminder.reminder_date).format("DD.MM.YYYY HH:mm")
                          ] })
                        ] })
                      }
                    ) })
                  }
                )
              }
            ),
            reminders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Empty,
              {
                description: "Нет напоминаний",
                image: Empty.PRESENTED_IMAGE_SIMPLE
              }
            )
          ] }) })
        },
        "reminders"
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabPane,
        {
          tab: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$a, {}),
            " События из сообщений"
          ] }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { spinning: loading, children: events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Empty,
            {
              description: "Нет событий из сообщений",
              image: Empty.PRESENTED_IMAGE_SIMPLE
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            List,
            {
              dataSource: events,
              renderItem: (event) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                List.Item.Meta,
                {
                  title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: "processing" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { strong: true, children: event.keyword })
                  ] }),
                  description: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { children: event.text_preview }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$1, { type: "secondary", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}),
                        " ",
                        event.normalized_date ? dayjs(event.normalized_date).format("DD.MM.YYYY") : "Дата не определена"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$1, { type: "secondary", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
                        " ",
                        dayjs(event.created_at).format("DD.MM.YYYY HH:mm")
                      ] })
                    ] })
                  ] })
                }
              ) })
            }
          ) })
        },
        "events"
      )
    ] }) })
  ] }) });
};
export {
  DatesRemindersV2 as default
};
//# sourceMappingURL=DatesRemindersV2-CxJpOA4c.js.map
