import { d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { e as commonjsGlobal, g as getDefaultExportFromCjs, a as reactExports, R as React } from "./react-DAIzMmXQ.js";
import { c6 as Trigger, f as classNames, v as _defineProperty, _ as _toConsumableArray, w as _objectSpread2, r as _slicedToArray, ae as _typeof, x as useEvent, E as useMergedState, b9 as wrapperRaf, aV as warningOnce, ba as useLayoutUpdateEffect, aa as useLayoutEffect, K as _extends, bY as isVisible, be as RefResizeObserver, at as pickAttrs, ad as _objectWithoutProperties, b6 as _createClass, b7 as _classCallCheck, o as omit, c7 as ForwardOverflow, R as merge, c8 as genOverflowStyle, c9 as getMultipleSelectorUnit, U as unit, aS as FastColor, ca as initComponentToken, bE as getArrowToken, cb as genOutlinedStyle, cc as genUnderlinedStyle, cd as genFilledStyle, ce as genBorderlessStyle, Q as genStyleHooks, cf as initInputToken, au as genCompactItemStyle, bg as initSlideMotion, cg as initMoveMotion, V as resetComponent, ch as slideUpOut, ci as slideDownOut, cj as slideUpIn, ck as slideDownIn, ag as textEllipsis, cl as genRoundedArrow, cm as genPlaceholderStyle, b8 as Icon$1, cn as useIcons$1, B as Button, d as useComponentConfig, C as ConfigContext, ax as useCompactItemContext, aJ as useVariant, a5 as useCSSVarCls, ai as useSize, av as DisabledContext, aw as FormItemInputContext, as as useLocale$1, aI as locale, a_ as useZIndex, az as ContextIsolator, ay as getStatusClassNames, co as getMergedStatus, aA as genPurePanel } from "./index-B4P9h-k1.js";
import { C as CalendarOutlined$1 } from "./CalendarOutlined-B_ajlQ0Y.js";
import { C as ClockCircleOutlined$1 } from "./ClockCircleOutlined-B2hpDlMl.js";
var weekday$1 = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t) {
      t.prototype.weekday = function(e2) {
        var t2 = this.$locale().weekStart || 0, i = this.$W, n = (i < t2 ? i + 7 : i) - t2;
        return this.$utils().u(e2) ? n : this.subtract(n, "day").add(e2, "day");
      };
    };
  });
})(weekday$1);
var weekdayExports = weekday$1.exports;
const weekday = /* @__PURE__ */ getDefaultExportFromCjs(weekdayExports);
var localeData$1 = { exports: {} };
(function(module, exports) {
  !function(n, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    return function(n, e, t) {
      var r = e.prototype, o = function(n2) {
        return n2 && (n2.indexOf ? n2 : n2.s);
      }, u = function(n2, e2, t2, r2, u2) {
        var i2 = n2.name ? n2 : n2.$locale(), a2 = o(i2[e2]), s2 = o(i2[t2]), f = a2 || s2.map(function(n3) {
          return n3.slice(0, r2);
        });
        if (!u2) return f;
        var d = i2.weekStart;
        return f.map(function(n3, e3) {
          return f[(e3 + (d || 0)) % 7];
        });
      }, i = function() {
        return t.Ls[t.locale()];
      }, a = function(n2, e2) {
        return n2.formats[e2] || function(n3) {
          return n3.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(n4, e3, t2) {
            return e3 || t2.slice(1);
          });
        }(n2.formats[e2.toUpperCase()]);
      }, s = function() {
        var n2 = this;
        return { months: function(e2) {
          return e2 ? e2.format("MMMM") : u(n2, "months");
        }, monthsShort: function(e2) {
          return e2 ? e2.format("MMM") : u(n2, "monthsShort", "months", 3);
        }, firstDayOfWeek: function() {
          return n2.$locale().weekStart || 0;
        }, weekdays: function(e2) {
          return e2 ? e2.format("dddd") : u(n2, "weekdays");
        }, weekdaysMin: function(e2) {
          return e2 ? e2.format("dd") : u(n2, "weekdaysMin", "weekdays", 2);
        }, weekdaysShort: function(e2) {
          return e2 ? e2.format("ddd") : u(n2, "weekdaysShort", "weekdays", 3);
        }, longDateFormat: function(e2) {
          return a(n2.$locale(), e2);
        }, meridiem: this.$locale().meridiem, ordinal: this.$locale().ordinal };
      };
      r.localeData = function() {
        return s.bind(this)();
      }, t.localeData = function() {
        var n2 = i();
        return { firstDayOfWeek: function() {
          return n2.weekStart || 0;
        }, weekdays: function() {
          return t.weekdays();
        }, weekdaysShort: function() {
          return t.weekdaysShort();
        }, weekdaysMin: function() {
          return t.weekdaysMin();
        }, months: function() {
          return t.months();
        }, monthsShort: function() {
          return t.monthsShort();
        }, longDateFormat: function(e2) {
          return a(n2, e2);
        }, meridiem: n2.meridiem, ordinal: n2.ordinal };
      }, t.months = function() {
        return u(i(), "months");
      }, t.monthsShort = function() {
        return u(i(), "monthsShort", "months", 3);
      }, t.weekdays = function(n2) {
        return u(i(), "weekdays", null, null, n2);
      }, t.weekdaysShort = function(n2) {
        return u(i(), "weekdaysShort", "weekdays", 3, n2);
      }, t.weekdaysMin = function(n2) {
        return u(i(), "weekdaysMin", "weekdays", 2, n2);
      };
    };
  });
})(localeData$1);
var localeDataExports = localeData$1.exports;
const localeData = /* @__PURE__ */ getDefaultExportFromCjs(localeDataExports);
var weekOfYear$1 = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    var e = "week", t = "year";
    return function(i, n, r) {
      var f = n.prototype;
      f.week = function(i2) {
        if (void 0 === i2 && (i2 = null), null !== i2) return this.add(7 * (i2 - this.week()), "day");
        var n2 = this.$locale().yearStart || 1;
        if (11 === this.month() && this.date() > 25) {
          var f2 = r(this).startOf(t).add(1, t).date(n2), s = r(this).endOf(e);
          if (f2.isBefore(s)) return 1;
        }
        var a = r(this).startOf(t).date(n2).startOf(e).subtract(1, "millisecond"), o = this.diff(a, e, true);
        return o < 0 ? r(this).startOf("week").week() : Math.ceil(o);
      }, f.weeks = function(e2) {
        return void 0 === e2 && (e2 = null), this.week(e2);
      };
    };
  });
})(weekOfYear$1);
var weekOfYearExports = weekOfYear$1.exports;
const weekOfYear = /* @__PURE__ */ getDefaultExportFromCjs(weekOfYearExports);
var weekYear$1 = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t) {
      t.prototype.weekYear = function() {
        var e2 = this.month(), t2 = this.week(), n = this.year();
        return 1 === t2 && 11 === e2 ? n + 1 : 0 === e2 && t2 >= 52 ? n - 1 : n;
      };
    };
  });
})(weekYear$1);
var weekYearExports = weekYear$1.exports;
const weekYear = /* @__PURE__ */ getDefaultExportFromCjs(weekYearExports);
var advancedFormat$1 = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return function(e, t) {
      var r = t.prototype, n = r.format;
      r.format = function(e2) {
        var t2 = this, r2 = this.$locale();
        if (!this.isValid()) return n.bind(this)(e2);
        var s = this.$utils(), a = (e2 || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function(e3) {
          switch (e3) {
            case "Q":
              return Math.ceil((t2.$M + 1) / 3);
            case "Do":
              return r2.ordinal(t2.$D);
            case "gggg":
              return t2.weekYear();
            case "GGGG":
              return t2.isoWeekYear();
            case "wo":
              return r2.ordinal(t2.week(), "W");
            case "w":
            case "ww":
              return s.s(t2.week(), "w" === e3 ? 1 : 2, "0");
            case "W":
            case "WW":
              return s.s(t2.isoWeek(), "W" === e3 ? 1 : 2, "0");
            case "k":
            case "kk":
              return s.s(String(0 === t2.$H ? 24 : t2.$H), "k" === e3 ? 1 : 2, "0");
            case "X":
              return Math.floor(t2.$d.getTime() / 1e3);
            case "x":
              return t2.$d.getTime();
            case "z":
              return "[" + t2.offsetName() + "]";
            case "zzz":
              return "[" + t2.offsetName("long") + "]";
            default:
              return e3;
          }
        });
        return n.bind(this)(a);
      };
    };
  });
})(advancedFormat$1);
var advancedFormatExports = advancedFormat$1.exports;
const advancedFormat = /* @__PURE__ */ getDefaultExportFromCjs(advancedFormatExports);
var customParseFormat$1 = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s = {}, a = function(e2) {
      return (e2 = +e2) + (e2 > 68 ? 1900 : 2e3);
    };
    var f = function(e2) {
      return function(t2) {
        this[e2] = +t2;
      };
    }, h = [/[+-]\d\d:?(\d\d)?|Z/, function(e2) {
      (this.zone || (this.zone = {})).offset = function(e3) {
        if (!e3) return 0;
        if ("Z" === e3) return 0;
        var t2 = e3.match(/([+-]|\d\d)/g), n2 = 60 * t2[1] + (+t2[2] || 0);
        return 0 === n2 ? 0 : "+" === t2[0] ? -n2 : n2;
      }(e2);
    }], u = function(e2) {
      var t2 = s[e2];
      return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
    }, d = function(e2, t2) {
      var n2, r2 = s.meridiem;
      if (r2) {
        for (var i2 = 1; i2 <= 24; i2 += 1) if (e2.indexOf(r2(i2, 0, t2)) > -1) {
          n2 = i2 > 12;
          break;
        }
      } else n2 = e2 === (t2 ? "pm" : "PM");
      return n2;
    }, c = { A: [o, function(e2) {
      this.afternoon = d(e2, false);
    }], a: [o, function(e2) {
      this.afternoon = d(e2, true);
    }], Q: [n, function(e2) {
      this.month = 3 * (e2 - 1) + 1;
    }], S: [n, function(e2) {
      this.milliseconds = 100 * +e2;
    }], SS: [r, function(e2) {
      this.milliseconds = 10 * +e2;
    }], SSS: [/\d{3}/, function(e2) {
      this.milliseconds = +e2;
    }], s: [i, f("seconds")], ss: [i, f("seconds")], m: [i, f("minutes")], mm: [i, f("minutes")], H: [i, f("hours")], h: [i, f("hours")], HH: [i, f("hours")], hh: [i, f("hours")], D: [i, f("day")], DD: [r, f("day")], Do: [o, function(e2) {
      var t2 = s.ordinal, n2 = e2.match(/\d+/);
      if (this.day = n2[0], t2) for (var r2 = 1; r2 <= 31; r2 += 1) t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
    }], w: [i, f("week")], ww: [r, f("week")], M: [i, f("month")], MM: [r, f("month")], MMM: [o, function(e2) {
      var t2 = u("months"), n2 = (u("monthsShort") || t2.map(function(e3) {
        return e3.slice(0, 3);
      })).indexOf(e2) + 1;
      if (n2 < 1) throw new Error();
      this.month = n2 % 12 || n2;
    }], MMMM: [o, function(e2) {
      var t2 = u("months").indexOf(e2) + 1;
      if (t2 < 1) throw new Error();
      this.month = t2 % 12 || t2;
    }], Y: [/[+-]?\d+/, f("year")], YY: [r, function(e2) {
      this.year = a(e2);
    }], YYYY: [/\d{4}/, f("year")], Z: h, ZZ: h };
    function l(n2) {
      var r2, i2;
      r2 = n2, i2 = s && s.formats;
      for (var o2 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t2, n3, r3) {
        var o3 = r3 && r3.toUpperCase();
        return n3 || i2[r3] || e[r3] || i2[o3].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t3, n4) {
          return t3 || n4.slice(1);
        });
      })).match(t), a2 = o2.length, f2 = 0; f2 < a2; f2 += 1) {
        var h2 = o2[f2], u2 = c[h2], d2 = u2 && u2[0], l2 = u2 && u2[1];
        o2[f2] = l2 ? { regex: d2, parser: l2 } : h2.replace(/^\[|\]$/g, "");
      }
      return function(e2) {
        for (var t2 = {}, n3 = 0, r3 = 0; n3 < a2; n3 += 1) {
          var i3 = o2[n3];
          if ("string" == typeof i3) r3 += i3.length;
          else {
            var s2 = i3.regex, f3 = i3.parser, h3 = e2.slice(r3), u3 = s2.exec(h3)[0];
            f3.call(t2, u3), e2 = e2.replace(u3, "");
          }
        }
        return function(e3) {
          var t3 = e3.afternoon;
          if (void 0 !== t3) {
            var n4 = e3.hours;
            t3 ? n4 < 12 && (e3.hours += 12) : 12 === n4 && (e3.hours = 0), delete e3.afternoon;
          }
        }(t2), t2;
      };
    }
    return function(e2, t2, n2) {
      n2.p.customParseFormat = true, e2 && e2.parseTwoDigitYear && (a = e2.parseTwoDigitYear);
      var r2 = t2.prototype, i2 = r2.parse;
      r2.parse = function(e3) {
        var t3 = e3.date, r3 = e3.utc, o2 = e3.args;
        this.$u = r3;
        var a2 = o2[1];
        if ("string" == typeof a2) {
          var f2 = true === o2[2], h2 = true === o2[3], u2 = f2 || h2, d2 = o2[2];
          h2 && (d2 = o2[2]), s = this.$locale(), !f2 && d2 && (s = n2.Ls[d2]), this.$d = function(e4, t4, n3, r4) {
            try {
              if (["x", "X"].indexOf(t4) > -1) return new Date(("X" === t4 ? 1e3 : 1) * e4);
              var i3 = l(t4)(e4), o3 = i3.year, s2 = i3.month, a3 = i3.day, f3 = i3.hours, h3 = i3.minutes, u3 = i3.seconds, d3 = i3.milliseconds, c3 = i3.zone, m2 = i3.week, M2 = /* @__PURE__ */ new Date(), Y = a3 || (o3 || s2 ? 1 : M2.getDate()), p = o3 || M2.getFullYear(), v = 0;
              o3 && !s2 || (v = s2 > 0 ? s2 - 1 : M2.getMonth());
              var D, w = f3 || 0, g = h3 || 0, y = u3 || 0, L = d3 || 0;
              return c3 ? new Date(Date.UTC(p, v, Y, w, g, y, L + 60 * c3.offset * 1e3)) : n3 ? new Date(Date.UTC(p, v, Y, w, g, y, L)) : (D = new Date(p, v, Y, w, g, y, L), m2 && (D = r4(D).week(m2).toDate()), D);
            } catch (e5) {
              return /* @__PURE__ */ new Date("");
            }
          }(t3, a2, r3, n2), this.init(), d2 && true !== d2 && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = /* @__PURE__ */ new Date("")), s = {};
        } else if (a2 instanceof Array) for (var c2 = a2.length, m = 1; m <= c2; m += 1) {
          o2[1] = a2[m - 1];
          var M = n2.apply(this, o2);
          if (M.isValid()) {
            this.$d = M.$d, this.$L = M.$L, this.init();
            break;
          }
          m === c2 && (this.$d = /* @__PURE__ */ new Date(""));
        }
        else i2.call(this, e3);
      };
    };
  });
})(customParseFormat$1);
var customParseFormatExports = customParseFormat$1.exports;
const customParseFormat = /* @__PURE__ */ getDefaultExportFromCjs(customParseFormatExports);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(function(o, c) {
  var proto = c.prototype;
  var oldFormat = proto.format;
  proto.format = function f(formatStr) {
    var str = (formatStr || "").replace("Wo", "wo");
    return oldFormat.bind(this)(str);
  };
});
var localeMap = {
  // ar_EG:
  // az_AZ:
  // bg_BG:
  bn_BD: "bn-bd",
  by_BY: "be",
  // ca_ES:
  // cs_CZ:
  // da_DK:
  // de_DE:
  // el_GR:
  en_GB: "en-gb",
  en_US: "en",
  // es_ES:
  // et_EE:
  // fa_IR:
  // fi_FI:
  fr_BE: "fr",
  // todo: dayjs has no fr_BE locale, use fr at present
  fr_CA: "fr-ca",
  // fr_FR:
  // ga_IE:
  // gl_ES:
  // he_IL:
  // hi_IN:
  // hr_HR:
  // hu_HU:
  hy_AM: "hy-am",
  // id_ID:
  // is_IS:
  // it_IT:
  // ja_JP:
  // ka_GE:
  // kk_KZ:
  // km_KH:
  kmr_IQ: "ku",
  // kn_IN:
  // ko_KR:
  // ku_IQ: // previous ku in antd
  // lt_LT:
  // lv_LV:
  // mk_MK:
  // ml_IN:
  // mn_MN:
  // ms_MY:
  // nb_NO:
  // ne_NP:
  nl_BE: "nl-be",
  // nl_NL:
  // pl_PL:
  pt_BR: "pt-br",
  // pt_PT:
  // ro_RO:
  // ru_RU:
  // sk_SK:
  // sl_SI:
  // sr_RS:
  // sv_SE:
  // ta_IN:
  // th_TH:
  // tr_TR:
  // uk_UA:
  // ur_PK:
  // vi_VN:
  zh_CN: "zh-cn",
  zh_HK: "zh-hk",
  zh_TW: "zh-tw"
};
var parseLocale = function parseLocale2(locale2) {
  var mapLocale = localeMap[locale2];
  return mapLocale || locale2.split("_")[0];
};
var generateConfig = {
  // get
  getNow: function getNow() {
    var now = dayjs();
    if (typeof now.tz === "function") {
      return now.tz();
    }
    return now;
  },
  getFixedDate: function getFixedDate(string) {
    return dayjs(string, ["YYYY-M-DD", "YYYY-MM-DD"]);
  },
  getEndDate: function getEndDate(date) {
    return date.endOf("month");
  },
  getWeekDay: function getWeekDay(date) {
    var clone = date.locale("en");
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: function getYear(date) {
    return date.year();
  },
  getMonth: function getMonth(date) {
    return date.month();
  },
  getDate: function getDate(date) {
    return date.date();
  },
  getHour: function getHour(date) {
    return date.hour();
  },
  getMinute: function getMinute(date) {
    return date.minute();
  },
  getSecond: function getSecond(date) {
    return date.second();
  },
  getMillisecond: function getMillisecond(date) {
    return date.millisecond();
  },
  // set
  addYear: function addYear(date, diff) {
    return date.add(diff, "year");
  },
  addMonth: function addMonth(date, diff) {
    return date.add(diff, "month");
  },
  addDate: function addDate(date, diff) {
    return date.add(diff, "day");
  },
  setYear: function setYear(date, year) {
    return date.year(year);
  },
  setMonth: function setMonth(date, month) {
    return date.month(month);
  },
  setDate: function setDate(date, num) {
    return date.date(num);
  },
  setHour: function setHour(date, hour) {
    return date.hour(hour);
  },
  setMinute: function setMinute(date, minute) {
    return date.minute(minute);
  },
  setSecond: function setSecond(date, second) {
    return date.second(second);
  },
  setMillisecond: function setMillisecond(date, milliseconds) {
    return date.millisecond(milliseconds);
  },
  // Compare
  isAfter: function isAfter(date1, date2) {
    return date1.isAfter(date2);
  },
  isValidate: function isValidate(date) {
    return date.isValid();
  },
  locale: {
    getWeekFirstDay: function getWeekFirstDay(locale2) {
      return dayjs().locale(parseLocale(locale2)).localeData().firstDayOfWeek();
    },
    getWeekFirstDate: function getWeekFirstDate(locale2, date) {
      return date.locale(parseLocale(locale2)).weekday(0);
    },
    getWeek: function getWeek(locale2, date) {
      return date.locale(parseLocale(locale2)).week();
    },
    getShortWeekDays: function getShortWeekDays(locale2) {
      return dayjs().locale(parseLocale(locale2)).localeData().weekdaysMin();
    },
    getShortMonths: function getShortMonths(locale2) {
      return dayjs().locale(parseLocale(locale2)).localeData().monthsShort();
    },
    format: function format(locale2, date, _format) {
      return date.locale(parseLocale(locale2)).format(_format);
    },
    parse: function parse(locale2, text, formats) {
      var localeStr = parseLocale(locale2);
      for (var i = 0; i < formats.length; i += 1) {
        var format2 = formats[i];
        var formatText = text;
        if (format2.includes("wo") || format2.includes("Wo")) {
          var year = formatText.split("-")[0];
          var weekStr = formatText.split("-")[1];
          var firstWeek = dayjs(year, "YYYY").startOf("year").locale(localeStr);
          for (var j = 0; j <= 52; j += 1) {
            var nextWeek = firstWeek.add(j, "week");
            if (nextWeek.format("Wo") === weekStr) {
              return nextWeek;
            }
          }
          return null;
        }
        var date = dayjs(formatText, format2, true).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }
      return null;
    }
  }
};
function getRealPlacement(placement, rtl) {
  if (placement !== void 0) {
    return placement;
  }
  return rtl ? "bottomRight" : "bottomLeft";
}
var PickerContext = /* @__PURE__ */ reactExports.createContext(null);
var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ["tl", "bl"],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ["tr", "br"],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ["bl", "tl"],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ["br", "tr"],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};
function PickerTrigger(_ref) {
  var popupElement = _ref.popupElement, popupStyle = _ref.popupStyle, popupClassName = _ref.popupClassName, popupAlign = _ref.popupAlign, transitionName = _ref.transitionName, getPopupContainer = _ref.getPopupContainer, children = _ref.children, range = _ref.range, placement = _ref.placement, _ref$builtinPlacement = _ref.builtinPlacements, builtinPlacements = _ref$builtinPlacement === void 0 ? BUILT_IN_PLACEMENTS : _ref$builtinPlacement, direction = _ref.direction, visible = _ref.visible, onClose = _ref.onClose;
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls;
  var dropdownPrefixCls = "".concat(prefixCls, "-dropdown");
  var realPlacement = getRealPlacement(placement, direction === "rtl");
  return /* @__PURE__ */ reactExports.createElement(Trigger, {
    showAction: [],
    hideAction: ["click"],
    popupPlacement: realPlacement,
    builtinPlacements,
    prefixCls: dropdownPrefixCls,
    popupTransitionName: transitionName,
    popup: popupElement,
    popupAlign,
    popupVisible: visible,
    popupClassName: classNames(popupClassName, _defineProperty(_defineProperty({}, "".concat(dropdownPrefixCls, "-range"), range), "".concat(dropdownPrefixCls, "-rtl"), direction === "rtl")),
    popupStyle,
    stretch: "minWidth",
    getPopupContainer,
    onPopupVisibleChange: function onPopupVisibleChange(nextVisible) {
      if (!nextVisible) {
        onClose();
      }
    }
  }, children);
}
function leftPad(str, length) {
  var fill = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  var current = String(str);
  while (current.length < length) {
    current = "".concat(fill).concat(current);
  }
  return current;
}
function toArray(val) {
  if (val === null || val === void 0) {
    return [];
  }
  return Array.isArray(val) ? val : [val];
}
function fillIndex(ori, index, value) {
  var clone = _toConsumableArray(ori);
  clone[index] = value;
  return clone;
}
function pickProps(props, keys) {
  var clone = {};
  var mergedKeys = keys || Object.keys(props);
  mergedKeys.forEach(function(key) {
    if (props[key] !== void 0) {
      clone[key] = props[key];
    }
  });
  return clone;
}
function getRowFormat(picker, locale2, format2) {
  if (format2) {
    return format2;
  }
  switch (picker) {
    case "time":
      return locale2.fieldTimeFormat;
    case "datetime":
      return locale2.fieldDateTimeFormat;
    case "month":
      return locale2.fieldMonthFormat;
    case "year":
      return locale2.fieldYearFormat;
    case "quarter":
      return locale2.fieldQuarterFormat;
    case "week":
      return locale2.fieldWeekFormat;
    default:
      return locale2.fieldDateFormat;
  }
}
function getFromDate(calendarValues, activeIndexList, activeIndex) {
  var mergedActiveIndex = activeIndex !== void 0 ? activeIndex : activeIndexList[activeIndexList.length - 1];
  var firstValuedIndex = activeIndexList.find(function(index) {
    return calendarValues[index];
  });
  return mergedActiveIndex !== firstValuedIndex ? calendarValues[firstValuedIndex] : void 0;
}
function pickTriggerProps(props) {
  return pickProps(props, ["placement", "builtinPlacements", "popupAlign", "getPopupContainer", "transitionName", "direction"]);
}
function useCellRender(cellRender, dateRender, monthCellRender, range) {
  var mergedCellRender = reactExports.useMemo(function() {
    if (cellRender) {
      return cellRender;
    }
    return function(current, info) {
      var date = current;
      if (dateRender && info.type === "date") {
        return dateRender(date, info.today);
      }
      if (monthCellRender && info.type === "month") {
        return monthCellRender(date, info.locale);
      }
      return info.originNode;
    };
  }, [cellRender, monthCellRender, dateRender]);
  var onInternalCellRender = reactExports.useCallback(function(date, info) {
    return mergedCellRender(date, _objectSpread2(_objectSpread2({}, info), {}, {
      range
    }));
  }, [mergedCellRender, range]);
  return onInternalCellRender;
}
function useFieldsInvalidate(calendarValue, isInvalidateDate) {
  var allowEmpty = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
  var _React$useState = reactExports.useState([false, false]), _React$useState2 = _slicedToArray(_React$useState, 2), fieldsInvalidates = _React$useState2[0], setFieldsInvalidates = _React$useState2[1];
  var onSelectorInvalid = function onSelectorInvalid2(invalid, index) {
    setFieldsInvalidates(function(ori) {
      return fillIndex(ori, index, invalid);
    });
  };
  var submitInvalidates = reactExports.useMemo(function() {
    return fieldsInvalidates.map(function(invalid, index) {
      if (invalid) {
        return true;
      }
      var current = calendarValue[index];
      if (!current) {
        return false;
      }
      if (!allowEmpty[index] && !current) {
        return true;
      }
      if (current && isInvalidateDate(current, {
        activeIndex: index
      })) {
        return true;
      }
      return false;
    });
  }, [calendarValue, fieldsInvalidates, isInvalidateDate, allowEmpty]);
  return [submitInvalidates, onSelectorInvalid];
}
function fillTimeFormat(showHour, showMinute, showSecond, showMillisecond, showMeridiem) {
  var timeFormat = "";
  var cells = [];
  if (showHour) {
    cells.push(showMeridiem ? "hh" : "HH");
  }
  if (showMinute) {
    cells.push("mm");
  }
  if (showSecond) {
    cells.push("ss");
  }
  timeFormat = cells.join(":");
  if (showMillisecond) {
    timeFormat += ".SSS";
  }
  if (showMeridiem) {
    timeFormat += " A";
  }
  return timeFormat;
}
function fillLocale(locale2, showHour, showMinute, showSecond, showMillisecond, use12Hours) {
  var fieldDateTimeFormat = locale2.fieldDateTimeFormat, fieldDateFormat = locale2.fieldDateFormat, fieldTimeFormat = locale2.fieldTimeFormat, fieldMonthFormat = locale2.fieldMonthFormat, fieldYearFormat = locale2.fieldYearFormat, fieldWeekFormat = locale2.fieldWeekFormat, fieldQuarterFormat = locale2.fieldQuarterFormat, yearFormat = locale2.yearFormat, cellYearFormat = locale2.cellYearFormat, cellQuarterFormat = locale2.cellQuarterFormat, dayFormat = locale2.dayFormat, cellDateFormat = locale2.cellDateFormat;
  var timeFormat = fillTimeFormat(showHour, showMinute, showSecond, showMillisecond, use12Hours);
  return _objectSpread2(_objectSpread2({}, locale2), {}, {
    fieldDateTimeFormat: fieldDateTimeFormat || "YYYY-MM-DD ".concat(timeFormat),
    fieldDateFormat: fieldDateFormat || "YYYY-MM-DD",
    fieldTimeFormat: fieldTimeFormat || timeFormat,
    fieldMonthFormat: fieldMonthFormat || "YYYY-MM",
    fieldYearFormat: fieldYearFormat || "YYYY",
    fieldWeekFormat: fieldWeekFormat || "gggg-wo",
    fieldQuarterFormat: fieldQuarterFormat || "YYYY-[Q]Q",
    yearFormat: yearFormat || "YYYY",
    cellYearFormat: cellYearFormat || "YYYY",
    cellQuarterFormat: cellQuarterFormat || "[Q]Q",
    cellDateFormat: cellDateFormat || dayFormat || "D"
  });
}
function useLocale(locale2, showProps) {
  var showHour = showProps.showHour, showMinute = showProps.showMinute, showSecond = showProps.showSecond, showMillisecond = showProps.showMillisecond, use12Hours = showProps.use12Hours;
  return React.useMemo(function() {
    return fillLocale(locale2, showHour, showMinute, showSecond, showMillisecond, use12Hours);
  }, [locale2, showHour, showMinute, showSecond, showMillisecond, use12Hours]);
}
function checkShow(format2, keywords, show) {
  return show !== null && show !== void 0 ? show : keywords.some(function(keyword) {
    return format2.includes(keyword);
  });
}
var showTimeKeys = [
  // 'format',
  "showNow",
  "showHour",
  "showMinute",
  "showSecond",
  "showMillisecond",
  "use12Hours",
  "hourStep",
  "minuteStep",
  "secondStep",
  "millisecondStep",
  "hideDisabledOptions",
  "defaultValue",
  "disabledHours",
  "disabledMinutes",
  "disabledSeconds",
  "disabledMilliseconds",
  "disabledTime",
  "changeOnScroll",
  "defaultOpenValue"
];
function pickTimeProps(props) {
  var timeProps = pickProps(props, showTimeKeys);
  var format2 = props.format, picker = props.picker;
  var propFormat = null;
  if (format2) {
    propFormat = format2;
    if (Array.isArray(propFormat)) {
      propFormat = propFormat[0];
    }
    propFormat = _typeof(propFormat) === "object" ? propFormat.format : propFormat;
  }
  if (picker === "time") {
    timeProps.format = propFormat;
  }
  return [timeProps, propFormat];
}
function isStringFormat(format2) {
  return format2 && typeof format2 === "string";
}
function existShowConfig(showHour, showMinute, showSecond, showMillisecond) {
  return [showHour, showMinute, showSecond, showMillisecond].some(function(show) {
    return show !== void 0;
  });
}
function fillShowConfig(hasShowConfig, showHour, showMinute, showSecond, showMillisecond) {
  var parsedShowHour = showHour;
  var parsedShowMinute = showMinute;
  var parsedShowSecond = showSecond;
  if (!hasShowConfig && !parsedShowHour && !parsedShowMinute && !parsedShowSecond && !showMillisecond) {
    parsedShowHour = true;
    parsedShowMinute = true;
    parsedShowSecond = true;
  } else if (hasShowConfig) {
    var _parsedShowHour, _parsedShowMinute, _parsedShowSecond;
    var existFalse = [parsedShowHour, parsedShowMinute, parsedShowSecond].some(function(show) {
      return show === false;
    });
    var existTrue = [parsedShowHour, parsedShowMinute, parsedShowSecond].some(function(show) {
      return show === true;
    });
    var defaultShow = existFalse ? true : !existTrue;
    parsedShowHour = (_parsedShowHour = parsedShowHour) !== null && _parsedShowHour !== void 0 ? _parsedShowHour : defaultShow;
    parsedShowMinute = (_parsedShowMinute = parsedShowMinute) !== null && _parsedShowMinute !== void 0 ? _parsedShowMinute : defaultShow;
    parsedShowSecond = (_parsedShowSecond = parsedShowSecond) !== null && _parsedShowSecond !== void 0 ? _parsedShowSecond : defaultShow;
  }
  return [parsedShowHour, parsedShowMinute, parsedShowSecond, showMillisecond];
}
function getTimeProps(componentProps) {
  var showTime = componentProps.showTime;
  var _pickTimeProps = pickTimeProps(componentProps), _pickTimeProps2 = _slicedToArray(_pickTimeProps, 2), pickedProps = _pickTimeProps2[0], propFormat = _pickTimeProps2[1];
  var showTimeConfig = showTime && _typeof(showTime) === "object" ? showTime : {};
  var timeConfig = _objectSpread2(_objectSpread2({
    defaultOpenValue: showTimeConfig.defaultOpenValue || showTimeConfig.defaultValue
  }, pickedProps), showTimeConfig);
  var showMillisecond = timeConfig.showMillisecond;
  var showHour = timeConfig.showHour, showMinute = timeConfig.showMinute, showSecond = timeConfig.showSecond;
  var hasShowConfig = existShowConfig(showHour, showMinute, showSecond, showMillisecond);
  var _fillShowConfig = fillShowConfig(hasShowConfig, showHour, showMinute, showSecond, showMillisecond);
  var _fillShowConfig2 = _slicedToArray(_fillShowConfig, 3);
  showHour = _fillShowConfig2[0];
  showMinute = _fillShowConfig2[1];
  showSecond = _fillShowConfig2[2];
  return [timeConfig, _objectSpread2(_objectSpread2({}, timeConfig), {}, {
    showHour,
    showMinute,
    showSecond,
    showMillisecond
  }), timeConfig.format, propFormat];
}
function fillShowTimeConfig(picker, showTimeFormat, propFormat, timeConfig, locale2) {
  var isTimePicker = picker === "time";
  if (picker === "datetime" || isTimePicker) {
    var pickedProps = timeConfig;
    var defaultLocaleFormat = getRowFormat(picker, locale2, null);
    var baselineFormat = defaultLocaleFormat;
    var formatList = [showTimeFormat, propFormat];
    for (var i = 0; i < formatList.length; i += 1) {
      var format2 = toArray(formatList[i])[0];
      if (isStringFormat(format2)) {
        baselineFormat = format2;
        break;
      }
    }
    var showHour = pickedProps.showHour, showMinute = pickedProps.showMinute, showSecond = pickedProps.showSecond, showMillisecond = pickedProps.showMillisecond;
    var use12Hours = pickedProps.use12Hours;
    var showMeridiem = checkShow(baselineFormat, ["a", "A", "LT", "LLL", "LTS"], use12Hours);
    var hasShowConfig = existShowConfig(showHour, showMinute, showSecond, showMillisecond);
    if (!hasShowConfig) {
      showHour = checkShow(baselineFormat, ["H", "h", "k", "LT", "LLL"]);
      showMinute = checkShow(baselineFormat, ["m", "LT", "LLL"]);
      showSecond = checkShow(baselineFormat, ["s", "LTS"]);
      showMillisecond = checkShow(baselineFormat, ["SSS"]);
    }
    var _fillShowConfig3 = fillShowConfig(hasShowConfig, showHour, showMinute, showSecond, showMillisecond);
    var _fillShowConfig4 = _slicedToArray(_fillShowConfig3, 3);
    showHour = _fillShowConfig4[0];
    showMinute = _fillShowConfig4[1];
    showSecond = _fillShowConfig4[2];
    var timeFormat = showTimeFormat || fillTimeFormat(showHour, showMinute, showSecond, showMillisecond, showMeridiem);
    return _objectSpread2(_objectSpread2({}, pickedProps), {}, {
      // Format
      format: timeFormat,
      // Show Config
      showHour,
      showMinute,
      showSecond,
      showMillisecond,
      use12Hours: showMeridiem
    });
  }
  return null;
}
function fillClearIcon(prefixCls, allowClear, clearIcon) {
  if (allowClear === false) {
    return null;
  }
  var config = allowClear && _typeof(allowClear) === "object" ? allowClear : {};
  return config.clearIcon || clearIcon || /* @__PURE__ */ reactExports.createElement("span", {
    className: "".concat(prefixCls, "-clear-btn")
  });
}
var WEEK_DAY_COUNT = 7;
function nullableCompare(value1, value2, oriCompareFn) {
  if (!value1 && !value2 || value1 === value2) {
    return true;
  }
  if (!value1 || !value2) {
    return false;
  }
  return oriCompareFn();
}
function isSameDecade(generateConfig2, decade1, decade2) {
  return nullableCompare(decade1, decade2, function() {
    var num1 = Math.floor(generateConfig2.getYear(decade1) / 10);
    var num2 = Math.floor(generateConfig2.getYear(decade2) / 10);
    return num1 === num2;
  });
}
function isSameYear(generateConfig2, year1, year2) {
  return nullableCompare(year1, year2, function() {
    return generateConfig2.getYear(year1) === generateConfig2.getYear(year2);
  });
}
function getQuarter(generateConfig2, date) {
  var quota = Math.floor(generateConfig2.getMonth(date) / 3);
  return quota + 1;
}
function isSameQuarter(generateConfig2, quarter1, quarter2) {
  return nullableCompare(quarter1, quarter2, function() {
    return isSameYear(generateConfig2, quarter1, quarter2) && getQuarter(generateConfig2, quarter1) === getQuarter(generateConfig2, quarter2);
  });
}
function isSameMonth(generateConfig2, month1, month2) {
  return nullableCompare(month1, month2, function() {
    return isSameYear(generateConfig2, month1, month2) && generateConfig2.getMonth(month1) === generateConfig2.getMonth(month2);
  });
}
function isSameDate(generateConfig2, date1, date2) {
  return nullableCompare(date1, date2, function() {
    return isSameYear(generateConfig2, date1, date2) && isSameMonth(generateConfig2, date1, date2) && generateConfig2.getDate(date1) === generateConfig2.getDate(date2);
  });
}
function isSameTime(generateConfig2, time1, time2) {
  return nullableCompare(time1, time2, function() {
    return generateConfig2.getHour(time1) === generateConfig2.getHour(time2) && generateConfig2.getMinute(time1) === generateConfig2.getMinute(time2) && generateConfig2.getSecond(time1) === generateConfig2.getSecond(time2);
  });
}
function isSameTimestamp(generateConfig2, time1, time2) {
  return nullableCompare(time1, time2, function() {
    return isSameDate(generateConfig2, time1, time2) && isSameTime(generateConfig2, time1, time2) && generateConfig2.getMillisecond(time1) === generateConfig2.getMillisecond(time2);
  });
}
function isSameWeek(generateConfig2, locale2, date1, date2) {
  return nullableCompare(date1, date2, function() {
    var weekStartDate1 = generateConfig2.locale.getWeekFirstDate(locale2, date1);
    var weekStartDate2 = generateConfig2.locale.getWeekFirstDate(locale2, date2);
    return isSameYear(generateConfig2, weekStartDate1, weekStartDate2) && generateConfig2.locale.getWeek(locale2, date1) === generateConfig2.locale.getWeek(locale2, date2);
  });
}
function isSame(generateConfig2, locale2, source, target, type) {
  switch (type) {
    case "date":
      return isSameDate(generateConfig2, source, target);
    case "week":
      return isSameWeek(generateConfig2, locale2.locale, source, target);
    case "month":
      return isSameMonth(generateConfig2, source, target);
    case "quarter":
      return isSameQuarter(generateConfig2, source, target);
    case "year":
      return isSameYear(generateConfig2, source, target);
    case "decade":
      return isSameDecade(generateConfig2, source, target);
    case "time":
      return isSameTime(generateConfig2, source, target);
    default:
      return isSameTimestamp(generateConfig2, source, target);
  }
}
function isInRange(generateConfig2, startDate, endDate, current) {
  if (!startDate || !endDate || !current) {
    return false;
  }
  return generateConfig2.isAfter(current, startDate) && generateConfig2.isAfter(endDate, current);
}
function isSameOrAfter(generateConfig2, locale2, date1, date2, type) {
  if (isSame(generateConfig2, locale2, date1, date2, type)) {
    return true;
  }
  return generateConfig2.isAfter(date1, date2);
}
function getWeekStartDate(locale2, generateConfig2, value) {
  var weekFirstDay = generateConfig2.locale.getWeekFirstDay(locale2);
  var monthStartDate = generateConfig2.setDate(value, 1);
  var startDateWeekDay = generateConfig2.getWeekDay(monthStartDate);
  var alignStartDate = generateConfig2.addDate(monthStartDate, weekFirstDay - startDateWeekDay);
  if (generateConfig2.getMonth(alignStartDate) === generateConfig2.getMonth(value) && generateConfig2.getDate(alignStartDate) > 1) {
    alignStartDate = generateConfig2.addDate(alignStartDate, -7);
  }
  return alignStartDate;
}
function formatValue(value, _ref) {
  var generateConfig2 = _ref.generateConfig, locale2 = _ref.locale, format2 = _ref.format;
  if (!value) {
    return "";
  }
  return typeof format2 === "function" ? format2(value) : generateConfig2.locale.format(locale2.locale, value, format2);
}
function fillTime(generateConfig2, date, time) {
  var tmpDate = date;
  var getFn = ["getHour", "getMinute", "getSecond", "getMillisecond"];
  var setFn = ["setHour", "setMinute", "setSecond", "setMillisecond"];
  setFn.forEach(function(fn, index) {
    if (time) {
      tmpDate = generateConfig2[fn](tmpDate, generateConfig2[getFn[index]](time));
    } else {
      tmpDate = generateConfig2[fn](tmpDate, 0);
    }
  });
  return tmpDate;
}
function useDisabledBoundary(generateConfig2, locale2, disabledDate, minDate, maxDate) {
  var mergedDisabledDate = useEvent(function(date, info) {
    if (disabledDate && disabledDate(date, info)) {
      return true;
    }
    if (minDate && generateConfig2.isAfter(minDate, date) && !isSame(generateConfig2, locale2, minDate, date, info.type)) {
      return true;
    }
    if (maxDate && generateConfig2.isAfter(date, maxDate) && !isSame(generateConfig2, locale2, maxDate, date, info.type)) {
      return true;
    }
    return false;
  });
  return mergedDisabledDate;
}
function useFieldFormat(picker, locale2, format2) {
  return reactExports.useMemo(function() {
    var rawFormat = getRowFormat(picker, locale2, format2);
    var formatList = toArray(rawFormat);
    var firstFormat = formatList[0];
    var maskFormat = _typeof(firstFormat) === "object" && firstFormat.type === "mask" ? firstFormat.format : null;
    return [
      // Format list
      formatList.map(function(config) {
        return typeof config === "string" || typeof config === "function" ? config : config.format;
      }),
      // Mask Format
      maskFormat
    ];
  }, [picker, locale2, format2]);
}
function useInputReadOnly(formatList, inputReadOnly, multiple) {
  if (typeof formatList[0] === "function" || multiple) {
    return true;
  }
  return inputReadOnly;
}
function useInvalidate(generateConfig2, picker, disabledDate, showTime) {
  var isInvalidate = useEvent(function(date, info) {
    var outsideInfo = _objectSpread2({
      type: picker
    }, info);
    delete outsideInfo.activeIndex;
    if (
      // Date object is invalid
      !generateConfig2.isValidate(date) || // Date is disabled by `disabledDate`
      disabledDate && disabledDate(date, outsideInfo)
    ) {
      return true;
    }
    if ((picker === "date" || picker === "time") && showTime) {
      var _showTime$disabledTim;
      var range = info && info.activeIndex === 1 ? "end" : "start";
      var _ref = ((_showTime$disabledTim = showTime.disabledTime) === null || _showTime$disabledTim === void 0 ? void 0 : _showTime$disabledTim.call(showTime, date, range, {
        from: outsideInfo.from
      })) || {}, disabledHours = _ref.disabledHours, disabledMinutes = _ref.disabledMinutes, disabledSeconds = _ref.disabledSeconds, disabledMilliseconds = _ref.disabledMilliseconds;
      var legacyDisabledHours = showTime.disabledHours, legacyDisabledMinutes = showTime.disabledMinutes, legacyDisabledSeconds = showTime.disabledSeconds;
      var mergedDisabledHours = disabledHours || legacyDisabledHours;
      var mergedDisabledMinutes = disabledMinutes || legacyDisabledMinutes;
      var mergedDisabledSeconds = disabledSeconds || legacyDisabledSeconds;
      var hour = generateConfig2.getHour(date);
      var minute = generateConfig2.getMinute(date);
      var second = generateConfig2.getSecond(date);
      var millisecond = generateConfig2.getMillisecond(date);
      if (mergedDisabledHours && mergedDisabledHours().includes(hour)) {
        return true;
      }
      if (mergedDisabledMinutes && mergedDisabledMinutes(hour).includes(minute)) {
        return true;
      }
      if (mergedDisabledSeconds && mergedDisabledSeconds(hour, minute).includes(second)) {
        return true;
      }
      if (disabledMilliseconds && disabledMilliseconds(hour, minute, second).includes(millisecond)) {
        return true;
      }
    }
    return false;
  });
  return isInvalidate;
}
function useList(value) {
  var fillMode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  var values = reactExports.useMemo(function() {
    var list = value ? toArray(value) : value;
    if (fillMode && list) {
      list[1] = list[1] || list[0];
    }
    return list;
  }, [value, fillMode]);
  return values;
}
function useFilledProps(props, updater) {
  var generateConfig2 = props.generateConfig, locale2 = props.locale, _props$picker = props.picker, picker = _props$picker === void 0 ? "date" : _props$picker, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-picker" : _props$prefixCls, _props$styles = props.styles, styles = _props$styles === void 0 ? {} : _props$styles, _props$classNames = props.classNames, classNames2 = _props$classNames === void 0 ? {} : _props$classNames, _props$order = props.order, order = _props$order === void 0 ? true : _props$order, _props$components = props.components, components = _props$components === void 0 ? {} : _props$components, inputRender = props.inputRender, allowClear = props.allowClear, clearIcon = props.clearIcon, needConfirm = props.needConfirm, multiple = props.multiple, format2 = props.format, inputReadOnly = props.inputReadOnly, disabledDate = props.disabledDate, minDate = props.minDate, maxDate = props.maxDate, showTime = props.showTime, value = props.value, defaultValue = props.defaultValue, pickerValue = props.pickerValue, defaultPickerValue = props.defaultPickerValue;
  var values = useList(value);
  var defaultValues = useList(defaultValue);
  var pickerValues = useList(pickerValue);
  var defaultPickerValues = useList(defaultPickerValue);
  var internalPicker = picker === "date" && showTime ? "datetime" : picker;
  var multipleInteractivePicker = internalPicker === "time" || internalPicker === "datetime";
  var complexPicker = multipleInteractivePicker || multiple;
  var mergedNeedConfirm = needConfirm !== null && needConfirm !== void 0 ? needConfirm : multipleInteractivePicker;
  var _getTimeProps = getTimeProps(props), _getTimeProps2 = _slicedToArray(_getTimeProps, 4), timeProps = _getTimeProps2[0], localeTimeProps = _getTimeProps2[1], showTimeFormat = _getTimeProps2[2], propFormat = _getTimeProps2[3];
  var mergedLocale = useLocale(locale2, localeTimeProps);
  var mergedShowTime = reactExports.useMemo(function() {
    return fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale);
  }, [internalPicker, showTimeFormat, propFormat, timeProps, mergedLocale]);
  var filledProps = reactExports.useMemo(function() {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      prefixCls,
      locale: mergedLocale,
      picker,
      styles,
      classNames: classNames2,
      order,
      components: _objectSpread2({
        input: inputRender
      }, components),
      clearIcon: fillClearIcon(prefixCls, allowClear, clearIcon),
      showTime: mergedShowTime,
      value: values,
      defaultValue: defaultValues,
      pickerValue: pickerValues,
      defaultPickerValue: defaultPickerValues
    }, updater === null || updater === void 0 ? void 0 : updater());
  }, [props]);
  var _useFieldFormat = useFieldFormat(internalPicker, mergedLocale, format2), _useFieldFormat2 = _slicedToArray(_useFieldFormat, 2), formatList = _useFieldFormat2[0], maskFormat = _useFieldFormat2[1];
  var mergedInputReadOnly = useInputReadOnly(formatList, inputReadOnly, multiple);
  var disabledBoundaryDate = useDisabledBoundary(generateConfig2, locale2, disabledDate, minDate, maxDate);
  var isInvalidateDate = useInvalidate(generateConfig2, picker, disabledBoundaryDate, mergedShowTime);
  var mergedProps = reactExports.useMemo(function() {
    return _objectSpread2(_objectSpread2({}, filledProps), {}, {
      needConfirm: mergedNeedConfirm,
      inputReadOnly: mergedInputReadOnly,
      disabledDate: disabledBoundaryDate
    });
  }, [filledProps, mergedNeedConfirm, mergedInputReadOnly, disabledBoundaryDate]);
  return [mergedProps, internalPicker, complexPicker, formatList, maskFormat, isInvalidateDate];
}
function useDelayState(value, defaultValue, onChange) {
  var _useMergedState = useMergedState(defaultValue, {
    value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), state = _useMergedState2[0], setState = _useMergedState2[1];
  var nextValueRef = React.useRef(value);
  var rafRef = React.useRef();
  var cancelRaf = function cancelRaf2() {
    wrapperRaf.cancel(rafRef.current);
  };
  var doUpdate = useEvent(function() {
    setState(nextValueRef.current);
    if (onChange && state !== nextValueRef.current) {
      onChange(nextValueRef.current);
    }
  });
  var updateValue = useEvent(function(next, immediately) {
    cancelRaf();
    nextValueRef.current = next;
    if (next || immediately) {
      doUpdate();
    } else {
      rafRef.current = wrapperRaf(doUpdate);
    }
  });
  React.useEffect(function() {
    return cancelRaf;
  }, []);
  return [state, updateValue];
}
function useOpen(open, defaultOpen) {
  var disabledList = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
  var onOpenChange = arguments.length > 3 ? arguments[3] : void 0;
  var mergedOpen = disabledList.every(function(disabled) {
    return disabled;
  }) ? false : open;
  var _useDelayState = useDelayState(mergedOpen, defaultOpen || false, onOpenChange), _useDelayState2 = _slicedToArray(_useDelayState, 2), rafOpen = _useDelayState2[0], setRafOpen = _useDelayState2[1];
  function setOpen(next) {
    var config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!config.inherit || rafOpen) {
      setRafOpen(next, config.force);
    }
  }
  return [rafOpen, setOpen];
}
function usePickerRef(ref) {
  var selectorRef = reactExports.useRef();
  reactExports.useImperativeHandle(ref, function() {
    var _selectorRef$current;
    return {
      nativeElement: (_selectorRef$current = selectorRef.current) === null || _selectorRef$current === void 0 ? void 0 : _selectorRef$current.nativeElement,
      focus: function focus(options) {
        var _selectorRef$current2;
        (_selectorRef$current2 = selectorRef.current) === null || _selectorRef$current2 === void 0 || _selectorRef$current2.focus(options);
      },
      blur: function blur() {
        var _selectorRef$current3;
        (_selectorRef$current3 = selectorRef.current) === null || _selectorRef$current3 === void 0 || _selectorRef$current3.blur();
      }
    };
  });
  return selectorRef;
}
function usePresets(presets, legacyRanges) {
  return reactExports.useMemo(function() {
    if (presets) {
      return presets;
    }
    if (legacyRanges) {
      warningOnce(false, "`ranges` is deprecated. Please use `presets` instead.");
      return Object.entries(legacyRanges).map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), label = _ref2[0], value = _ref2[1];
        return {
          label,
          value
        };
      });
    }
    return [];
  }, [presets, legacyRanges]);
}
function useLockEffect(condition, callback) {
  var delayFrames = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  var callbackRef = reactExports.useRef(callback);
  callbackRef.current = callback;
  useLayoutUpdateEffect(function() {
    if (condition) {
      callbackRef.current(condition);
    } else {
      var id = wrapperRaf(function() {
        callbackRef.current(condition);
      }, delayFrames);
      return function() {
        wrapperRaf.cancel(id);
      };
    }
  }, [condition]);
}
function useRangeActive(disabled) {
  var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  var mergedOpen = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  var _React$useState = reactExports.useState(0), _React$useState2 = _slicedToArray(_React$useState, 2), activeIndex = _React$useState2[0], setActiveIndex = _React$useState2[1];
  var _React$useState3 = reactExports.useState(false), _React$useState4 = _slicedToArray(_React$useState3, 2), focused = _React$useState4[0], setFocused = _React$useState4[1];
  var activeListRef = reactExports.useRef([]);
  var submitIndexRef = reactExports.useRef(null);
  var lastOperationRef = reactExports.useRef(null);
  var updateSubmitIndex = function updateSubmitIndex2(index) {
    submitIndexRef.current = index;
  };
  var hasActiveSubmitValue = function hasActiveSubmitValue2(index) {
    return submitIndexRef.current === index;
  };
  var triggerFocus = function triggerFocus2(nextFocus) {
    setFocused(nextFocus);
  };
  var lastOperation = function lastOperation2(type) {
    if (type) {
      lastOperationRef.current = type;
    }
    return lastOperationRef.current;
  };
  var nextActiveIndex = function nextActiveIndex2(nextValue) {
    var list = activeListRef.current;
    var filledActiveSet = new Set(list.filter(function(index) {
      return nextValue[index] || empty[index];
    }));
    var nextIndex = list[list.length - 1] === 0 ? 1 : 0;
    if (filledActiveSet.size >= 2 || disabled[nextIndex]) {
      return null;
    }
    return nextIndex;
  };
  useLockEffect(focused || mergedOpen, function() {
    if (!focused) {
      activeListRef.current = [];
      updateSubmitIndex(null);
    }
  });
  reactExports.useEffect(function() {
    if (focused) {
      activeListRef.current.push(activeIndex);
    }
  }, [focused, activeIndex]);
  return [focused, triggerFocus, lastOperation, activeIndex, setActiveIndex, nextActiveIndex, activeListRef.current, updateSubmitIndex, hasActiveSubmitValue];
}
function useRangeDisabledDate(values, disabled, activeIndexList, generateConfig2, locale2, disabledDate) {
  var activeIndex = activeIndexList[activeIndexList.length - 1];
  var rangeDisabledDate = function rangeDisabledDate2(date, info) {
    var _values = _slicedToArray(values, 2), start = _values[0], end = _values[1];
    var mergedInfo = _objectSpread2(_objectSpread2({}, info), {}, {
      from: getFromDate(values, activeIndexList)
    });
    if (activeIndex === 1 && disabled[0] && start && // Same date isOK
    !isSame(generateConfig2, locale2, start, date, mergedInfo.type) && // Before start date
    generateConfig2.isAfter(start, date)) {
      return true;
    }
    if (activeIndex === 0 && disabled[1] && end && // Same date isOK
    !isSame(generateConfig2, locale2, end, date, mergedInfo.type) && // After end date
    generateConfig2.isAfter(date, end)) {
      return true;
    }
    return disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(date, mergedInfo);
  };
  return rangeDisabledDate;
}
function offsetPanelDate(generateConfig2, picker, date, offset) {
  switch (picker) {
    case "date":
    case "week":
      return generateConfig2.addMonth(date, offset);
    case "month":
    case "quarter":
      return generateConfig2.addYear(date, offset);
    case "year":
      return generateConfig2.addYear(date, offset * 10);
    case "decade":
      return generateConfig2.addYear(date, offset * 100);
    default:
      return date;
  }
}
var EMPTY_LIST = [];
function useRangePickerValue(generateConfig2, locale2, calendarValue, modes, open, activeIndex, pickerMode, multiplePanel) {
  var defaultPickerValue = arguments.length > 8 && arguments[8] !== void 0 ? arguments[8] : EMPTY_LIST;
  var pickerValue = arguments.length > 9 && arguments[9] !== void 0 ? arguments[9] : EMPTY_LIST;
  var timeDefaultValue = arguments.length > 10 && arguments[10] !== void 0 ? arguments[10] : EMPTY_LIST;
  var onPickerValueChange = arguments.length > 11 ? arguments[11] : void 0;
  var minDate = arguments.length > 12 ? arguments[12] : void 0;
  var maxDate = arguments.length > 13 ? arguments[13] : void 0;
  var isTimePicker = pickerMode === "time";
  var mergedActiveIndex = activeIndex || 0;
  var getDefaultPickerValue = function getDefaultPickerValue2(index) {
    var now = generateConfig2.getNow();
    if (isTimePicker) {
      now = fillTime(generateConfig2, now);
    }
    return defaultPickerValue[index] || calendarValue[index] || now;
  };
  var _pickerValue = _slicedToArray(pickerValue, 2), startPickerValue = _pickerValue[0], endPickerValue = _pickerValue[1];
  var _useMergedState = useMergedState(function() {
    return getDefaultPickerValue(0);
  }, {
    value: startPickerValue
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedStartPickerValue = _useMergedState2[0], setStartPickerValue = _useMergedState2[1];
  var _useMergedState3 = useMergedState(function() {
    return getDefaultPickerValue(1);
  }, {
    value: endPickerValue
  }), _useMergedState4 = _slicedToArray(_useMergedState3, 2), mergedEndPickerValue = _useMergedState4[0], setEndPickerValue = _useMergedState4[1];
  var currentPickerValue = reactExports.useMemo(function() {
    var current = [mergedStartPickerValue, mergedEndPickerValue][mergedActiveIndex];
    return isTimePicker ? current : fillTime(generateConfig2, current, timeDefaultValue[mergedActiveIndex]);
  }, [isTimePicker, mergedStartPickerValue, mergedEndPickerValue, mergedActiveIndex, generateConfig2, timeDefaultValue]);
  var setCurrentPickerValue = function setCurrentPickerValue2(nextPickerValue) {
    var source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "panel";
    var updater = [setStartPickerValue, setEndPickerValue][mergedActiveIndex];
    updater(nextPickerValue);
    var clone = [mergedStartPickerValue, mergedEndPickerValue];
    clone[mergedActiveIndex] = nextPickerValue;
    if (onPickerValueChange && (!isSame(generateConfig2, locale2, mergedStartPickerValue, clone[0], pickerMode) || !isSame(generateConfig2, locale2, mergedEndPickerValue, clone[1], pickerMode))) {
      onPickerValueChange(clone, {
        source,
        range: mergedActiveIndex === 1 ? "end" : "start",
        mode: modes
      });
    }
  };
  var getEndDatePickerValue = function getEndDatePickerValue2(startDate, endDate) {
    if (multiplePanel) {
      var SAME_CHECKER = {
        date: "month",
        week: "month",
        month: "year",
        quarter: "year"
      };
      var mode = SAME_CHECKER[pickerMode];
      if (mode && !isSame(generateConfig2, locale2, startDate, endDate, mode)) {
        return offsetPanelDate(generateConfig2, pickerMode, endDate, -1);
      }
      if (pickerMode === "year" && startDate) {
        var srcYear = Math.floor(generateConfig2.getYear(startDate) / 10);
        var tgtYear = Math.floor(generateConfig2.getYear(endDate) / 10);
        if (srcYear !== tgtYear) {
          return offsetPanelDate(generateConfig2, pickerMode, endDate, -1);
        }
      }
    }
    return endDate;
  };
  var prevActiveIndexRef = reactExports.useRef(null);
  useLayoutEffect(function() {
    if (open) {
      if (!defaultPickerValue[mergedActiveIndex]) {
        var nextPickerValue = isTimePicker ? null : generateConfig2.getNow();
        if (prevActiveIndexRef.current !== null && prevActiveIndexRef.current !== mergedActiveIndex) {
          nextPickerValue = [mergedStartPickerValue, mergedEndPickerValue][mergedActiveIndex ^ 1];
        } else if (calendarValue[mergedActiveIndex]) {
          nextPickerValue = mergedActiveIndex === 0 ? calendarValue[0] : getEndDatePickerValue(calendarValue[0], calendarValue[1]);
        } else if (calendarValue[mergedActiveIndex ^ 1]) {
          nextPickerValue = calendarValue[mergedActiveIndex ^ 1];
        }
        if (nextPickerValue) {
          if (minDate && generateConfig2.isAfter(minDate, nextPickerValue)) {
            nextPickerValue = minDate;
          }
          var offsetPickerValue = multiplePanel ? offsetPanelDate(generateConfig2, pickerMode, nextPickerValue, 1) : nextPickerValue;
          if (maxDate && generateConfig2.isAfter(offsetPickerValue, maxDate)) {
            nextPickerValue = multiplePanel ? offsetPanelDate(generateConfig2, pickerMode, maxDate, -1) : maxDate;
          }
          setCurrentPickerValue(nextPickerValue, "reset");
        }
      }
    }
  }, [open, mergedActiveIndex, calendarValue[mergedActiveIndex]]);
  reactExports.useEffect(function() {
    if (open) {
      prevActiveIndexRef.current = mergedActiveIndex;
    } else {
      prevActiveIndexRef.current = null;
    }
  }, [open, mergedActiveIndex]);
  useLayoutEffect(function() {
    if (open && defaultPickerValue) {
      if (defaultPickerValue[mergedActiveIndex]) {
        setCurrentPickerValue(defaultPickerValue[mergedActiveIndex], "reset");
      }
    }
  }, [open, mergedActiveIndex]);
  return [currentPickerValue, setCurrentPickerValue];
}
function useSyncState(defaultValue, controlledValue) {
  var valueRef = reactExports.useRef(defaultValue);
  var _React$useState = reactExports.useState({}), _React$useState2 = _slicedToArray(_React$useState, 2), forceUpdate = _React$useState2[1];
  var getter = function getter2(useControlledValueFirst) {
    return useControlledValueFirst && controlledValue !== void 0 ? controlledValue : valueRef.current;
  };
  var setter = function setter2(nextValue) {
    valueRef.current = nextValue;
    forceUpdate({});
  };
  return [getter, setter, getter(true)];
}
var EMPTY_VALUE = [];
function useUtil(generateConfig2, locale2, formatList) {
  var getDateTexts = function getDateTexts2(dates) {
    return dates.map(function(date) {
      return formatValue(date, {
        generateConfig: generateConfig2,
        locale: locale2,
        format: formatList[0]
      });
    });
  };
  var isSameDates = function isSameDates2(source, target) {
    var maxLen = Math.max(source.length, target.length);
    var diffIndex = -1;
    for (var i = 0; i < maxLen; i += 1) {
      var prev = source[i] || null;
      var next = target[i] || null;
      if (prev !== next && !isSameTimestamp(generateConfig2, prev, next)) {
        diffIndex = i;
        break;
      }
    }
    return [diffIndex < 0, diffIndex !== 0];
  };
  return [getDateTexts, isSameDates];
}
function orderDates(dates, generateConfig2) {
  return _toConsumableArray(dates).sort(function(a, b) {
    return generateConfig2.isAfter(a, b) ? 1 : -1;
  });
}
function useCalendarValue(mergedValue) {
  var _useSyncState = useSyncState(mergedValue), _useSyncState2 = _slicedToArray(_useSyncState, 2), calendarValue = _useSyncState2[0], setCalendarValue = _useSyncState2[1];
  var syncWithValue = useEvent(function() {
    setCalendarValue(mergedValue);
  });
  reactExports.useEffect(function() {
    syncWithValue();
  }, [mergedValue]);
  return [calendarValue, setCalendarValue];
}
function useInnerValue(generateConfig2, locale2, formatList, rangeValue, order, defaultValue, value, onCalendarChange, onOk) {
  var _useMergedState = useMergedState(defaultValue, {
    value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), innerValue = _useMergedState2[0], setInnerValue = _useMergedState2[1];
  var mergedValue = innerValue || EMPTY_VALUE;
  var _useCalendarValue = useCalendarValue(mergedValue), _useCalendarValue2 = _slicedToArray(_useCalendarValue, 2), calendarValue = _useCalendarValue2[0], setCalendarValue = _useCalendarValue2[1];
  var _useUtil = useUtil(generateConfig2, locale2, formatList), _useUtil2 = _slicedToArray(_useUtil, 2), getDateTexts = _useUtil2[0], isSameDates = _useUtil2[1];
  var triggerCalendarChange = useEvent(function(nextCalendarValues) {
    var clone = _toConsumableArray(nextCalendarValues);
    if (rangeValue) {
      for (var i = 0; i < 2; i += 1) {
        clone[i] = clone[i] || null;
      }
    } else if (order) {
      clone = orderDates(clone.filter(function(date) {
        return date;
      }), generateConfig2);
    }
    var _isSameDates = isSameDates(calendarValue(), clone), _isSameDates2 = _slicedToArray(_isSameDates, 2), isSameMergedDates = _isSameDates2[0], isSameStart = _isSameDates2[1];
    if (!isSameMergedDates) {
      setCalendarValue(clone);
      if (onCalendarChange) {
        var cellTexts = getDateTexts(clone);
        onCalendarChange(clone, cellTexts, {
          range: isSameStart ? "end" : "start"
        });
      }
    }
  });
  var triggerOk = function triggerOk2() {
    if (onOk) {
      onOk(calendarValue());
    }
  };
  return [mergedValue, setInnerValue, calendarValue, triggerCalendarChange, triggerOk];
}
function useRangeValue(info, mergedValue, setInnerValue, getCalendarValue, triggerCalendarChange, disabled, formatList, focused, open, isInvalidateDate) {
  var generateConfig2 = info.generateConfig, locale2 = info.locale, picker = info.picker, onChange = info.onChange, allowEmpty = info.allowEmpty, order = info.order;
  var orderOnChange = disabled.some(function(d) {
    return d;
  }) ? false : order;
  var _useUtil3 = useUtil(generateConfig2, locale2, formatList), _useUtil4 = _slicedToArray(_useUtil3, 2), getDateTexts = _useUtil4[0], isSameDates = _useUtil4[1];
  var _useSyncState3 = useSyncState(mergedValue), _useSyncState4 = _slicedToArray(_useSyncState3, 2), submitValue = _useSyncState4[0], setSubmitValue = _useSyncState4[1];
  var syncWithValue = useEvent(function() {
    setSubmitValue(mergedValue);
  });
  reactExports.useEffect(function() {
    syncWithValue();
  }, [mergedValue]);
  var triggerSubmit = useEvent(function(nextValue) {
    var isNullValue = nextValue === null;
    var clone = _toConsumableArray(nextValue || submitValue());
    if (isNullValue) {
      var maxLen = Math.max(disabled.length, clone.length);
      for (var i = 0; i < maxLen; i += 1) {
        if (!disabled[i]) {
          clone[i] = null;
        }
      }
    }
    if (orderOnChange && clone[0] && clone[1]) {
      clone = orderDates(clone, generateConfig2);
    }
    triggerCalendarChange(clone);
    var _clone = clone, _clone2 = _slicedToArray(_clone, 2), start = _clone2[0], end = _clone2[1];
    var startEmpty = !start;
    var endEmpty = !end;
    var validateEmptyDateRange = allowEmpty ? (
      // Validate empty start
      (!startEmpty || allowEmpty[0]) && // Validate empty end
      (!endEmpty || allowEmpty[1])
    ) : true;
    var validateOrder = !order || startEmpty || endEmpty || isSame(generateConfig2, locale2, start, end, picker) || generateConfig2.isAfter(end, start);
    var validateDates = (
      // Validate start
      (disabled[0] || !start || !isInvalidateDate(start, {
        activeIndex: 0
      })) && // Validate end
      (disabled[1] || !end || !isInvalidateDate(end, {
        from: start,
        activeIndex: 1
      }))
    );
    var allPassed = (
      // Null value is from clear button
      isNullValue || // Normal check
      validateEmptyDateRange && validateOrder && validateDates
    );
    if (allPassed) {
      setInnerValue(clone);
      var _isSameDates3 = isSameDates(clone, mergedValue), _isSameDates4 = _slicedToArray(_isSameDates3, 1), isSameMergedDates = _isSameDates4[0];
      if (onChange && !isSameMergedDates) {
        onChange(
          // Return null directly if all date are empty
          isNullValue && clone.every(function(val) {
            return !val;
          }) ? null : clone,
          getDateTexts(clone)
        );
      }
    }
    return allPassed;
  });
  var flushSubmit = useEvent(function(index, needTriggerChange) {
    var nextSubmitValue = fillIndex(submitValue(), index, getCalendarValue()[index]);
    setSubmitValue(nextSubmitValue);
    if (needTriggerChange) {
      triggerSubmit();
    }
  });
  var interactiveFinished = !focused && !open;
  useLockEffect(!interactiveFinished, function() {
    if (interactiveFinished) {
      triggerSubmit();
      triggerCalendarChange(mergedValue);
      syncWithValue();
    }
  }, 2);
  return [flushSubmit, triggerSubmit];
}
function useShowNow(picker, mode, showNow, showToday, rangePicker) {
  if (mode !== "date" && mode !== "time") {
    return false;
  }
  if (showNow !== void 0) {
    return showNow;
  }
  if (showToday !== void 0) {
    return showToday;
  }
  return !rangePicker && (picker === "date" || picker === "time");
}
function findValidateTime(date, getHourUnits, getMinuteUnits, getSecondUnits, getMillisecondUnits, generateConfig2) {
  var nextDate = date;
  function alignValidate(getUnitValue, setUnitValue, units) {
    var nextValue = generateConfig2[getUnitValue](nextDate);
    var nextUnit = units.find(function(unit2) {
      return unit2.value === nextValue;
    });
    if (!nextUnit || nextUnit.disabled) {
      var validateUnits = units.filter(function(unit2) {
        return !unit2.disabled;
      });
      var reverseEnabledUnits = _toConsumableArray(validateUnits).reverse();
      var validateUnit = reverseEnabledUnits.find(function(unit2) {
        return unit2.value <= nextValue;
      }) || validateUnits[0];
      if (validateUnit) {
        nextValue = validateUnit.value;
        nextDate = generateConfig2[setUnitValue](nextDate, nextValue);
      }
    }
    return nextValue;
  }
  var nextHour = alignValidate("getHour", "setHour", getHourUnits());
  var nextMinute = alignValidate("getMinute", "setMinute", getMinuteUnits(nextHour));
  var nextSecond = alignValidate("getSecond", "setSecond", getSecondUnits(nextHour, nextMinute));
  alignValidate("getMillisecond", "setMillisecond", getMillisecondUnits(nextHour, nextMinute, nextSecond));
  return nextDate;
}
function emptyDisabled() {
  return [];
}
function generateUnits(start, end) {
  var step = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  var hideDisabledOptions = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  var disabledUnits = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [];
  var pad = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 2;
  var units = [];
  var integerStep = step >= 1 ? step | 0 : 1;
  for (var i = start; i <= end; i += integerStep) {
    var disabled = disabledUnits.includes(i);
    if (!disabled || !hideDisabledOptions) {
      units.push({
        label: leftPad(i, pad),
        value: i,
        disabled
      });
    }
  }
  return units;
}
function useTimeInfo(generateConfig2) {
  var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var date = arguments.length > 2 ? arguments[2] : void 0;
  var _ref = props || {}, use12Hours = _ref.use12Hours, _ref$hourStep = _ref.hourStep, hourStep = _ref$hourStep === void 0 ? 1 : _ref$hourStep, _ref$minuteStep = _ref.minuteStep, minuteStep = _ref$minuteStep === void 0 ? 1 : _ref$minuteStep, _ref$secondStep = _ref.secondStep, secondStep = _ref$secondStep === void 0 ? 1 : _ref$secondStep, _ref$millisecondStep = _ref.millisecondStep, millisecondStep = _ref$millisecondStep === void 0 ? 100 : _ref$millisecondStep, hideDisabledOptions = _ref.hideDisabledOptions, disabledTime = _ref.disabledTime, disabledHours = _ref.disabledHours, disabledMinutes = _ref.disabledMinutes, disabledSeconds = _ref.disabledSeconds;
  var mergedDate = reactExports.useMemo(function() {
    return date || generateConfig2.getNow();
  }, [date, generateConfig2]);
  var getDisabledTimes = reactExports.useCallback(function(targetDate) {
    var disabledConfig = (disabledTime === null || disabledTime === void 0 ? void 0 : disabledTime(targetDate)) || {};
    return [disabledConfig.disabledHours || disabledHours || emptyDisabled, disabledConfig.disabledMinutes || disabledMinutes || emptyDisabled, disabledConfig.disabledSeconds || disabledSeconds || emptyDisabled, disabledConfig.disabledMilliseconds || emptyDisabled];
  }, [disabledTime, disabledHours, disabledMinutes, disabledSeconds]);
  var _React$useMemo = reactExports.useMemo(function() {
    return getDisabledTimes(mergedDate);
  }, [mergedDate, getDisabledTimes]), _React$useMemo2 = _slicedToArray(_React$useMemo, 4), mergedDisabledHours = _React$useMemo2[0], mergedDisabledMinutes = _React$useMemo2[1], mergedDisabledSeconds = _React$useMemo2[2], mergedDisabledMilliseconds = _React$useMemo2[3];
  var getAllUnits = reactExports.useCallback(function(getDisabledHours, getDisabledMinutes, getDisabledSeconds, getDisabledMilliseconds) {
    var hours = generateUnits(0, 23, hourStep, hideDisabledOptions, getDisabledHours());
    var rowHourUnits2 = use12Hours ? hours.map(function(unit2) {
      return _objectSpread2(_objectSpread2({}, unit2), {}, {
        label: leftPad(unit2.value % 12 || 12, 2)
      });
    }) : hours;
    var getMinuteUnits2 = function getMinuteUnits3(nextHour) {
      return generateUnits(0, 59, minuteStep, hideDisabledOptions, getDisabledMinutes(nextHour));
    };
    var getSecondUnits2 = function getSecondUnits3(nextHour, nextMinute) {
      return generateUnits(0, 59, secondStep, hideDisabledOptions, getDisabledSeconds(nextHour, nextMinute));
    };
    var getMillisecondUnits2 = function getMillisecondUnits3(nextHour, nextMinute, nextSecond) {
      return generateUnits(0, 999, millisecondStep, hideDisabledOptions, getDisabledMilliseconds(nextHour, nextMinute, nextSecond), 3);
    };
    return [rowHourUnits2, getMinuteUnits2, getSecondUnits2, getMillisecondUnits2];
  }, [hideDisabledOptions, hourStep, use12Hours, millisecondStep, minuteStep, secondStep]);
  var _React$useMemo3 = reactExports.useMemo(function() {
    return getAllUnits(mergedDisabledHours, mergedDisabledMinutes, mergedDisabledSeconds, mergedDisabledMilliseconds);
  }, [getAllUnits, mergedDisabledHours, mergedDisabledMinutes, mergedDisabledSeconds, mergedDisabledMilliseconds]), _React$useMemo4 = _slicedToArray(_React$useMemo3, 4), rowHourUnits = _React$useMemo4[0], getMinuteUnits = _React$useMemo4[1], getSecondUnits = _React$useMemo4[2], getMillisecondUnits = _React$useMemo4[3];
  var getValidTime = function getValidTime2(nextTime, certainDate) {
    var getCheckHourUnits = function getCheckHourUnits2() {
      return rowHourUnits;
    };
    var getCheckMinuteUnits = getMinuteUnits;
    var getCheckSecondUnits = getSecondUnits;
    var getCheckMillisecondUnits = getMillisecondUnits;
    if (certainDate) {
      var _getDisabledTimes = getDisabledTimes(certainDate), _getDisabledTimes2 = _slicedToArray(_getDisabledTimes, 4), targetDisabledHours = _getDisabledTimes2[0], targetDisabledMinutes = _getDisabledTimes2[1], targetDisabledSeconds = _getDisabledTimes2[2], targetDisabledMilliseconds = _getDisabledTimes2[3];
      var _getAllUnits = getAllUnits(targetDisabledHours, targetDisabledMinutes, targetDisabledSeconds, targetDisabledMilliseconds), _getAllUnits2 = _slicedToArray(_getAllUnits, 4), targetRowHourUnits = _getAllUnits2[0], targetGetMinuteUnits = _getAllUnits2[1], targetGetSecondUnits = _getAllUnits2[2], targetGetMillisecondUnits = _getAllUnits2[3];
      getCheckHourUnits = function getCheckHourUnits2() {
        return targetRowHourUnits;
      };
      getCheckMinuteUnits = targetGetMinuteUnits;
      getCheckSecondUnits = targetGetSecondUnits;
      getCheckMillisecondUnits = targetGetMillisecondUnits;
    }
    var validateDate = findValidateTime(nextTime, getCheckHourUnits, getCheckMinuteUnits, getCheckSecondUnits, getCheckMillisecondUnits, generateConfig2);
    return validateDate;
  };
  return [
    // getValidTime
    getValidTime,
    // Units
    rowHourUnits,
    getMinuteUnits,
    getSecondUnits,
    getMillisecondUnits
  ];
}
function Footer(props) {
  var mode = props.mode, internalMode = props.internalMode, renderExtraFooter = props.renderExtraFooter, showNow = props.showNow, showTime = props.showTime, onSubmit = props.onSubmit, onNow = props.onNow, invalid = props.invalid, needConfirm = props.needConfirm, generateConfig2 = props.generateConfig, disabledDate = props.disabledDate;
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls, locale2 = _React$useContext.locale, _React$useContext$but = _React$useContext.button, Button2 = _React$useContext$but === void 0 ? "button" : _React$useContext$but;
  var now = generateConfig2.getNow();
  var _useTimeInfo = useTimeInfo(generateConfig2, showTime, now), _useTimeInfo2 = _slicedToArray(_useTimeInfo, 1), getValidTime = _useTimeInfo2[0];
  var extraNode = renderExtraFooter === null || renderExtraFooter === void 0 ? void 0 : renderExtraFooter(mode);
  var nowDisabled = disabledDate(now, {
    type: mode
  });
  var onInternalNow = function onInternalNow2() {
    if (!nowDisabled) {
      var validateNow = getValidTime(now);
      onNow(validateNow);
    }
  };
  var nowPrefixCls = "".concat(prefixCls, "-now");
  var nowBtnPrefixCls = "".concat(nowPrefixCls, "-btn");
  var presetNode = showNow && /* @__PURE__ */ reactExports.createElement("li", {
    className: nowPrefixCls
  }, /* @__PURE__ */ reactExports.createElement("a", {
    className: classNames(nowBtnPrefixCls, nowDisabled && "".concat(nowBtnPrefixCls, "-disabled")),
    "aria-disabled": nowDisabled,
    onClick: onInternalNow
  }, internalMode === "date" ? locale2.today : locale2.now));
  var okNode = needConfirm && /* @__PURE__ */ reactExports.createElement("li", {
    className: "".concat(prefixCls, "-ok")
  }, /* @__PURE__ */ reactExports.createElement(Button2, {
    disabled: invalid,
    onClick: onSubmit
  }, locale2.ok));
  var rangeNode = (presetNode || okNode) && /* @__PURE__ */ reactExports.createElement("ul", {
    className: "".concat(prefixCls, "-ranges")
  }, presetNode, okNode);
  if (!extraNode && !rangeNode) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-footer")
  }, extraNode && /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-footer-extra")
  }, extraNode), rangeNode);
}
function useToggleDates(generateConfig2, locale2, panelMode) {
  function toggleDates(list, target) {
    var index = list.findIndex(function(date) {
      return isSame(generateConfig2, locale2, date, target, panelMode);
    });
    if (index === -1) {
      return [].concat(_toConsumableArray(list), [target]);
    }
    var sliceList = _toConsumableArray(list);
    sliceList.splice(index, 1);
    return sliceList;
  }
  return toggleDates;
}
var PanelContext = /* @__PURE__ */ reactExports.createContext(null);
function usePanelContext() {
  return reactExports.useContext(PanelContext);
}
function useInfo(props, panelType) {
  var prefixCls = props.prefixCls, generateConfig2 = props.generateConfig, locale2 = props.locale, disabledDate = props.disabledDate, minDate = props.minDate, maxDate = props.maxDate, cellRender = props.cellRender, hoverValue = props.hoverValue, hoverRangeValue = props.hoverRangeValue, onHover = props.onHover, values = props.values, pickerValue = props.pickerValue, onSelect = props.onSelect, prevIcon = props.prevIcon, nextIcon = props.nextIcon, superPrevIcon = props.superPrevIcon, superNextIcon = props.superNextIcon;
  var now = generateConfig2.getNow();
  var info = {
    now,
    values,
    pickerValue,
    prefixCls,
    disabledDate,
    minDate,
    maxDate,
    cellRender,
    hoverValue,
    hoverRangeValue,
    onHover,
    locale: locale2,
    generateConfig: generateConfig2,
    onSelect,
    panelType,
    // Icons
    prevIcon,
    nextIcon,
    superPrevIcon,
    superNextIcon
  };
  return [info, now];
}
var PickerHackContext = /* @__PURE__ */ reactExports.createContext({});
function PanelBody(props) {
  var rowNum = props.rowNum, colNum = props.colNum, baseDate = props.baseDate, getCellDate = props.getCellDate, prefixColumn = props.prefixColumn, rowClassName = props.rowClassName, titleFormat = props.titleFormat, getCellText = props.getCellText, getCellClassName = props.getCellClassName, headerCells = props.headerCells, _props$cellSelection = props.cellSelection, cellSelection = _props$cellSelection === void 0 ? true : _props$cellSelection, disabledDate = props.disabledDate;
  var _usePanelContext = usePanelContext(), prefixCls = _usePanelContext.prefixCls, type = _usePanelContext.panelType, now = _usePanelContext.now, contextDisabledDate = _usePanelContext.disabledDate, cellRender = _usePanelContext.cellRender, onHover = _usePanelContext.onHover, hoverValue = _usePanelContext.hoverValue, hoverRangeValue = _usePanelContext.hoverRangeValue, generateConfig2 = _usePanelContext.generateConfig, values = _usePanelContext.values, locale2 = _usePanelContext.locale, onSelect = _usePanelContext.onSelect;
  var mergedDisabledDate = disabledDate || contextDisabledDate;
  var cellPrefixCls = "".concat(prefixCls, "-cell");
  var _React$useContext = reactExports.useContext(PickerHackContext), onCellDblClick = _React$useContext.onCellDblClick;
  var matchValues = function matchValues2(date) {
    return values.some(function(singleValue) {
      return singleValue && isSame(generateConfig2, locale2, date, singleValue, type);
    });
  };
  var rows = [];
  for (var row = 0; row < rowNum; row += 1) {
    var rowNode = [];
    var rowStartDate = void 0;
    var _loop = function _loop2() {
      var offset = row * colNum + col;
      var currentDate = getCellDate(baseDate, offset);
      var disabled = mergedDisabledDate === null || mergedDisabledDate === void 0 ? void 0 : mergedDisabledDate(currentDate, {
        type
      });
      if (col === 0) {
        rowStartDate = currentDate;
        if (prefixColumn) {
          rowNode.push(prefixColumn(rowStartDate));
        }
      }
      var inRange = false;
      var rangeStart = false;
      var rangeEnd = false;
      if (cellSelection && hoverRangeValue) {
        var _hoverRangeValue = _slicedToArray(hoverRangeValue, 2), hoverStart = _hoverRangeValue[0], hoverEnd = _hoverRangeValue[1];
        inRange = isInRange(generateConfig2, hoverStart, hoverEnd, currentDate);
        rangeStart = isSame(generateConfig2, locale2, currentDate, hoverStart, type);
        rangeEnd = isSame(generateConfig2, locale2, currentDate, hoverEnd, type);
      }
      var title = titleFormat ? formatValue(currentDate, {
        locale: locale2,
        format: titleFormat,
        generateConfig: generateConfig2
      }) : void 0;
      var inner = /* @__PURE__ */ reactExports.createElement("div", {
        className: "".concat(cellPrefixCls, "-inner")
      }, getCellText(currentDate));
      rowNode.push(/* @__PURE__ */ reactExports.createElement("td", {
        key: col,
        title,
        className: classNames(cellPrefixCls, _objectSpread2(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(cellPrefixCls, "-disabled"), disabled), "".concat(cellPrefixCls, "-hover"), (hoverValue || []).some(function(date) {
          return isSame(generateConfig2, locale2, currentDate, date, type);
        })), "".concat(cellPrefixCls, "-in-range"), inRange && !rangeStart && !rangeEnd), "".concat(cellPrefixCls, "-range-start"), rangeStart), "".concat(cellPrefixCls, "-range-end"), rangeEnd), "".concat(prefixCls, "-cell-selected"), !hoverRangeValue && // WeekPicker use row instead
        type !== "week" && matchValues(currentDate)), getCellClassName(currentDate))),
        onClick: function onClick() {
          if (!disabled) {
            onSelect(currentDate);
          }
        },
        onDoubleClick: function onDoubleClick() {
          if (!disabled && onCellDblClick) {
            onCellDblClick();
          }
        },
        onMouseEnter: function onMouseEnter() {
          if (!disabled) {
            onHover === null || onHover === void 0 || onHover(currentDate);
          }
        },
        onMouseLeave: function onMouseLeave() {
          if (!disabled) {
            onHover === null || onHover === void 0 || onHover(null);
          }
        }
      }, cellRender ? cellRender(currentDate, {
        prefixCls,
        originNode: inner,
        today: now,
        type,
        locale: locale2
      }) : inner));
    };
    for (var col = 0; col < colNum; col += 1) {
      _loop();
    }
    rows.push(/* @__PURE__ */ reactExports.createElement("tr", {
      key: row,
      className: rowClassName === null || rowClassName === void 0 ? void 0 : rowClassName(rowStartDate)
    }, rowNode));
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-body")
  }, /* @__PURE__ */ reactExports.createElement("table", {
    className: "".concat(prefixCls, "-content")
  }, headerCells && /* @__PURE__ */ reactExports.createElement("thead", null, /* @__PURE__ */ reactExports.createElement("tr", null, headerCells)), /* @__PURE__ */ reactExports.createElement("tbody", null, rows)));
}
var HIDDEN_STYLE = {
  visibility: "hidden"
};
function PanelHeader(props) {
  var offset = props.offset, superOffset = props.superOffset, onChange = props.onChange, getStart = props.getStart, getEnd = props.getEnd, children = props.children;
  var _usePanelContext = usePanelContext(), prefixCls = _usePanelContext.prefixCls, _usePanelContext$prev = _usePanelContext.prevIcon, prevIcon = _usePanelContext$prev === void 0 ? "‹" : _usePanelContext$prev, _usePanelContext$next = _usePanelContext.nextIcon, nextIcon = _usePanelContext$next === void 0 ? "›" : _usePanelContext$next, _usePanelContext$supe = _usePanelContext.superPrevIcon, superPrevIcon = _usePanelContext$supe === void 0 ? "«" : _usePanelContext$supe, _usePanelContext$supe2 = _usePanelContext.superNextIcon, superNextIcon = _usePanelContext$supe2 === void 0 ? "»" : _usePanelContext$supe2, minDate = _usePanelContext.minDate, maxDate = _usePanelContext.maxDate, generateConfig2 = _usePanelContext.generateConfig, locale2 = _usePanelContext.locale, pickerValue = _usePanelContext.pickerValue, type = _usePanelContext.panelType;
  var headerPrefixCls = "".concat(prefixCls, "-header");
  var _React$useContext = reactExports.useContext(PickerHackContext), hidePrev = _React$useContext.hidePrev, hideNext = _React$useContext.hideNext, hideHeader = _React$useContext.hideHeader;
  var disabledOffsetPrev = reactExports.useMemo(function() {
    if (!minDate || !offset || !getEnd) {
      return false;
    }
    var prevPanelLimitDate = getEnd(offset(-1, pickerValue));
    return !isSameOrAfter(generateConfig2, locale2, prevPanelLimitDate, minDate, type);
  }, [minDate, offset, pickerValue, getEnd, generateConfig2, locale2, type]);
  var disabledSuperOffsetPrev = reactExports.useMemo(function() {
    if (!minDate || !superOffset || !getEnd) {
      return false;
    }
    var prevPanelLimitDate = getEnd(superOffset(-1, pickerValue));
    return !isSameOrAfter(generateConfig2, locale2, prevPanelLimitDate, minDate, type);
  }, [minDate, superOffset, pickerValue, getEnd, generateConfig2, locale2, type]);
  var disabledOffsetNext = reactExports.useMemo(function() {
    if (!maxDate || !offset || !getStart) {
      return false;
    }
    var nextPanelLimitDate = getStart(offset(1, pickerValue));
    return !isSameOrAfter(generateConfig2, locale2, maxDate, nextPanelLimitDate, type);
  }, [maxDate, offset, pickerValue, getStart, generateConfig2, locale2, type]);
  var disabledSuperOffsetNext = reactExports.useMemo(function() {
    if (!maxDate || !superOffset || !getStart) {
      return false;
    }
    var nextPanelLimitDate = getStart(superOffset(1, pickerValue));
    return !isSameOrAfter(generateConfig2, locale2, maxDate, nextPanelLimitDate, type);
  }, [maxDate, superOffset, pickerValue, getStart, generateConfig2, locale2, type]);
  var onOffset = function onOffset2(distance) {
    if (offset) {
      onChange(offset(distance, pickerValue));
    }
  };
  var onSuperOffset = function onSuperOffset2(distance) {
    if (superOffset) {
      onChange(superOffset(distance, pickerValue));
    }
  };
  if (hideHeader) {
    return null;
  }
  var prevBtnCls = "".concat(headerPrefixCls, "-prev-btn");
  var nextBtnCls = "".concat(headerPrefixCls, "-next-btn");
  var superPrevBtnCls = "".concat(headerPrefixCls, "-super-prev-btn");
  var superNextBtnCls = "".concat(headerPrefixCls, "-super-next-btn");
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: headerPrefixCls
  }, superOffset && /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    "aria-label": locale2.previousYear,
    onClick: function onClick() {
      return onSuperOffset(-1);
    },
    tabIndex: -1,
    className: classNames(superPrevBtnCls, disabledSuperOffsetPrev && "".concat(superPrevBtnCls, "-disabled")),
    disabled: disabledSuperOffsetPrev,
    style: hidePrev ? HIDDEN_STYLE : {}
  }, superPrevIcon), offset && /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    "aria-label": locale2.previousMonth,
    onClick: function onClick() {
      return onOffset(-1);
    },
    tabIndex: -1,
    className: classNames(prevBtnCls, disabledOffsetPrev && "".concat(prevBtnCls, "-disabled")),
    disabled: disabledOffsetPrev,
    style: hidePrev ? HIDDEN_STYLE : {}
  }, prevIcon), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(headerPrefixCls, "-view")
  }, children), offset && /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    "aria-label": locale2.nextMonth,
    onClick: function onClick() {
      return onOffset(1);
    },
    tabIndex: -1,
    className: classNames(nextBtnCls, disabledOffsetNext && "".concat(nextBtnCls, "-disabled")),
    disabled: disabledOffsetNext,
    style: hideNext ? HIDDEN_STYLE : {}
  }, nextIcon), superOffset && /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    "aria-label": locale2.nextYear,
    onClick: function onClick() {
      return onSuperOffset(1);
    },
    tabIndex: -1,
    className: classNames(superNextBtnCls, disabledSuperOffsetNext && "".concat(superNextBtnCls, "-disabled")),
    disabled: disabledSuperOffsetNext,
    style: hideNext ? HIDDEN_STYLE : {}
  }, superNextIcon));
}
function DatePanel(props) {
  var prefixCls = props.prefixCls, _props$panelName = props.panelName, panelName = _props$panelName === void 0 ? "date" : _props$panelName, locale2 = props.locale, generateConfig2 = props.generateConfig, pickerValue = props.pickerValue, onPickerValueChange = props.onPickerValueChange, onModeChange = props.onModeChange, _props$mode = props.mode, mode = _props$mode === void 0 ? "date" : _props$mode, disabledDate = props.disabledDate, onSelect = props.onSelect, onHover = props.onHover, showWeek = props.showWeek;
  var panelPrefixCls = "".concat(prefixCls, "-").concat(panelName, "-panel");
  var cellPrefixCls = "".concat(prefixCls, "-cell");
  var isWeek = mode === "week";
  var _useInfo = useInfo(props, mode), _useInfo2 = _slicedToArray(_useInfo, 2), info = _useInfo2[0], now = _useInfo2[1];
  var weekFirstDay = generateConfig2.locale.getWeekFirstDay(locale2.locale);
  var monthStartDate = generateConfig2.setDate(pickerValue, 1);
  var baseDate = getWeekStartDate(locale2.locale, generateConfig2, monthStartDate);
  var month = generateConfig2.getMonth(pickerValue);
  var showPrefixColumn = showWeek === void 0 ? isWeek : showWeek;
  var prefixColumn = showPrefixColumn ? function(date) {
    var disabled = disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(date, {
      type: "week"
    });
    return /* @__PURE__ */ reactExports.createElement("td", {
      key: "week",
      className: classNames(cellPrefixCls, "".concat(cellPrefixCls, "-week"), _defineProperty({}, "".concat(cellPrefixCls, "-disabled"), disabled)),
      onClick: function onClick() {
        if (!disabled) {
          onSelect(date);
        }
      },
      onMouseEnter: function onMouseEnter() {
        if (!disabled) {
          onHover === null || onHover === void 0 || onHover(date);
        }
      },
      onMouseLeave: function onMouseLeave() {
        if (!disabled) {
          onHover === null || onHover === void 0 || onHover(null);
        }
      }
    }, /* @__PURE__ */ reactExports.createElement("div", {
      className: "".concat(cellPrefixCls, "-inner")
    }, generateConfig2.locale.getWeek(locale2.locale, date)));
  } : null;
  var headerCells = [];
  var weekDaysLocale = locale2.shortWeekDays || (generateConfig2.locale.getShortWeekDays ? generateConfig2.locale.getShortWeekDays(locale2.locale) : []);
  if (prefixColumn) {
    headerCells.push(/* @__PURE__ */ reactExports.createElement("th", {
      key: "empty"
    }, /* @__PURE__ */ reactExports.createElement("span", {
      style: {
        width: 0,
        height: 0,
        position: "absolute",
        overflow: "hidden",
        opacity: 0
      }
    }, locale2.week)));
  }
  for (var i = 0; i < WEEK_DAY_COUNT; i += 1) {
    headerCells.push(/* @__PURE__ */ reactExports.createElement("th", {
      key: i
    }, weekDaysLocale[(i + weekFirstDay) % WEEK_DAY_COUNT]));
  }
  var getCellDate = function getCellDate2(date, offset) {
    return generateConfig2.addDate(date, offset);
  };
  var getCellText = function getCellText2(date) {
    return formatValue(date, {
      locale: locale2,
      format: locale2.cellDateFormat,
      generateConfig: generateConfig2
    });
  };
  var getCellClassName = function getCellClassName2(date) {
    var classObj = _defineProperty(_defineProperty({}, "".concat(prefixCls, "-cell-in-view"), isSameMonth(generateConfig2, date, pickerValue)), "".concat(prefixCls, "-cell-today"), isSameDate(generateConfig2, date, now));
    return classObj;
  };
  var monthsLocale = locale2.shortMonths || (generateConfig2.locale.getShortMonths ? generateConfig2.locale.getShortMonths(locale2.locale) : []);
  var yearNode = /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    "aria-label": locale2.yearSelect,
    key: "year",
    onClick: function onClick() {
      onModeChange("year", pickerValue);
    },
    tabIndex: -1,
    className: "".concat(prefixCls, "-year-btn")
  }, formatValue(pickerValue, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }));
  var monthNode = /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    "aria-label": locale2.monthSelect,
    key: "month",
    onClick: function onClick() {
      onModeChange("month", pickerValue);
    },
    tabIndex: -1,
    className: "".concat(prefixCls, "-month-btn")
  }, locale2.monthFormat ? formatValue(pickerValue, {
    locale: locale2,
    format: locale2.monthFormat,
    generateConfig: generateConfig2
  }) : monthsLocale[month]);
  var monthYearNodes = locale2.monthBeforeYear ? [monthNode, yearNode] : [yearNode, monthNode];
  return /* @__PURE__ */ reactExports.createElement(PanelContext.Provider, {
    value: info
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(panelPrefixCls, showWeek && "".concat(panelPrefixCls, "-show-week"))
  }, /* @__PURE__ */ reactExports.createElement(PanelHeader, {
    offset: function offset(distance) {
      return generateConfig2.addMonth(pickerValue, distance);
    },
    superOffset: function superOffset(distance) {
      return generateConfig2.addYear(pickerValue, distance);
    },
    onChange: onPickerValueChange,
    getStart: function getStart(date) {
      return generateConfig2.setDate(date, 1);
    },
    getEnd: function getEnd(date) {
      var clone = generateConfig2.setDate(date, 1);
      clone = generateConfig2.addMonth(clone, 1);
      return generateConfig2.addDate(clone, -1);
    }
  }, monthYearNodes), /* @__PURE__ */ reactExports.createElement(PanelBody, _extends({
    titleFormat: locale2.fieldDateFormat
  }, props, {
    colNum: WEEK_DAY_COUNT,
    rowNum: 6,
    baseDate,
    headerCells,
    getCellDate,
    getCellText,
    getCellClassName,
    prefixColumn,
    cellSelection: !isWeek
  }))));
}
var SPEED_PTG = 1 / 3;
function useScrollTo(ulRef, value) {
  var scrollingRef = reactExports.useRef(false);
  var scrollRafRef = reactExports.useRef(null);
  var scrollDistRef = reactExports.useRef(null);
  var isScrolling = function isScrolling2() {
    return scrollingRef.current;
  };
  var stopScroll = function stopScroll2() {
    wrapperRaf.cancel(scrollRafRef.current);
    scrollingRef.current = false;
  };
  var scrollRafTimesRef = reactExports.useRef();
  var startScroll = function startScroll2() {
    var ul = ulRef.current;
    scrollDistRef.current = null;
    scrollRafTimesRef.current = 0;
    if (ul) {
      var targetLi = ul.querySelector('[data-value="'.concat(value, '"]'));
      var firstLi = ul.querySelector("li");
      var doScroll = function doScroll2() {
        stopScroll();
        scrollingRef.current = true;
        scrollRafTimesRef.current += 1;
        var currentTop = ul.scrollTop;
        var firstLiTop = firstLi.offsetTop;
        var targetLiTop = targetLi.offsetTop;
        var targetTop = targetLiTop - firstLiTop;
        if (targetLiTop === 0 && targetLi !== firstLi || !isVisible(ul)) {
          if (scrollRafTimesRef.current <= 5) {
            scrollRafRef.current = wrapperRaf(doScroll2);
          }
          return;
        }
        var nextTop = currentTop + (targetTop - currentTop) * SPEED_PTG;
        var dist = Math.abs(targetTop - nextTop);
        if (scrollDistRef.current !== null && scrollDistRef.current < dist) {
          stopScroll();
          return;
        }
        scrollDistRef.current = dist;
        if (dist <= 1) {
          ul.scrollTop = targetTop;
          stopScroll();
          return;
        }
        ul.scrollTop = nextTop;
        scrollRafRef.current = wrapperRaf(doScroll2);
      };
      if (targetLi && firstLi) {
        doScroll();
      }
    }
  };
  var syncScroll = useEvent(startScroll);
  return [syncScroll, stopScroll, isScrolling];
}
var SCROLL_DELAY = 300;
function flattenUnits(units) {
  return units.map(function(_ref) {
    var value = _ref.value, label = _ref.label, disabled = _ref.disabled;
    return [value, label, disabled].join(",");
  }).join(";");
}
function TimeColumn(props) {
  var units = props.units, value = props.value, optionalValue = props.optionalValue, type = props.type, onChange = props.onChange, onHover = props.onHover, onDblClick = props.onDblClick, changeOnScroll = props.changeOnScroll;
  var _usePanelContext = usePanelContext(), prefixCls = _usePanelContext.prefixCls, cellRender = _usePanelContext.cellRender, now = _usePanelContext.now, locale2 = _usePanelContext.locale;
  var panelPrefixCls = "".concat(prefixCls, "-time-panel");
  var cellPrefixCls = "".concat(prefixCls, "-time-panel-cell");
  var ulRef = reactExports.useRef(null);
  var checkDelayRef = reactExports.useRef();
  var clearDelayCheck = function clearDelayCheck2() {
    clearTimeout(checkDelayRef.current);
  };
  var _useScrollTo = useScrollTo(ulRef, value !== null && value !== void 0 ? value : optionalValue), _useScrollTo2 = _slicedToArray(_useScrollTo, 3), syncScroll = _useScrollTo2[0], stopScroll = _useScrollTo2[1], isScrolling = _useScrollTo2[2];
  useLayoutEffect(function() {
    syncScroll();
    clearDelayCheck();
    return function() {
      stopScroll();
      clearDelayCheck();
    };
  }, [value, optionalValue, flattenUnits(units)]);
  var onInternalScroll = function onInternalScroll2(event) {
    clearDelayCheck();
    var target = event.target;
    if (!isScrolling() && changeOnScroll) {
      checkDelayRef.current = setTimeout(function() {
        var ul = ulRef.current;
        var firstLiTop = ul.querySelector("li").offsetTop;
        var liList = Array.from(ul.querySelectorAll("li"));
        var liTopList = liList.map(function(li) {
          return li.offsetTop - firstLiTop;
        });
        var liDistList = liTopList.map(function(top, index) {
          if (units[index].disabled) {
            return Number.MAX_SAFE_INTEGER;
          }
          return Math.abs(top - target.scrollTop);
        });
        var minDist = Math.min.apply(Math, _toConsumableArray(liDistList));
        var minDistIndex = liDistList.findIndex(function(dist) {
          return dist === minDist;
        });
        var targetUnit = units[minDistIndex];
        if (targetUnit && !targetUnit.disabled) {
          onChange(targetUnit.value);
        }
      }, SCROLL_DELAY);
    }
  };
  var columnPrefixCls = "".concat(panelPrefixCls, "-column");
  return /* @__PURE__ */ reactExports.createElement("ul", {
    className: columnPrefixCls,
    ref: ulRef,
    "data-type": type,
    onScroll: onInternalScroll
  }, units.map(function(_ref2) {
    var label = _ref2.label, unitValue = _ref2.value, disabled = _ref2.disabled;
    var inner = /* @__PURE__ */ reactExports.createElement("div", {
      className: "".concat(cellPrefixCls, "-inner")
    }, label);
    return /* @__PURE__ */ reactExports.createElement("li", {
      key: unitValue,
      className: classNames(cellPrefixCls, _defineProperty(_defineProperty({}, "".concat(cellPrefixCls, "-selected"), value === unitValue), "".concat(cellPrefixCls, "-disabled"), disabled)),
      onClick: function onClick() {
        if (!disabled) {
          onChange(unitValue);
        }
      },
      onDoubleClick: function onDoubleClick() {
        if (!disabled && onDblClick) {
          onDblClick();
        }
      },
      onMouseEnter: function onMouseEnter() {
        onHover(unitValue);
      },
      onMouseLeave: function onMouseLeave() {
        onHover(null);
      },
      "data-value": unitValue
    }, cellRender ? cellRender(unitValue, {
      prefixCls,
      originNode: inner,
      today: now,
      type: "time",
      subType: type,
      locale: locale2
    }) : inner);
  }));
}
function isAM(hour) {
  return hour < 12;
}
function TimePanelBody(props) {
  var showHour = props.showHour, showMinute = props.showMinute, showSecond = props.showSecond, showMillisecond = props.showMillisecond, showMeridiem = props.use12Hours, changeOnScroll = props.changeOnScroll;
  var _usePanelContext = usePanelContext(), prefixCls = _usePanelContext.prefixCls, values = _usePanelContext.values, generateConfig2 = _usePanelContext.generateConfig, locale2 = _usePanelContext.locale, onSelect = _usePanelContext.onSelect, _usePanelContext$onHo = _usePanelContext.onHover, onHover = _usePanelContext$onHo === void 0 ? function() {
  } : _usePanelContext$onHo, pickerValue = _usePanelContext.pickerValue;
  var value = (values === null || values === void 0 ? void 0 : values[0]) || null;
  var _React$useContext = reactExports.useContext(PickerHackContext), onCellDblClick = _React$useContext.onCellDblClick;
  var _useTimeInfo = useTimeInfo(generateConfig2, props, value), _useTimeInfo2 = _slicedToArray(_useTimeInfo, 5), getValidTime = _useTimeInfo2[0], rowHourUnits = _useTimeInfo2[1], getMinuteUnits = _useTimeInfo2[2], getSecondUnits = _useTimeInfo2[3], getMillisecondUnits = _useTimeInfo2[4];
  var getUnitValue = function getUnitValue2(func) {
    var valueUnitVal = value && generateConfig2[func](value);
    var pickerUnitValue = pickerValue && generateConfig2[func](pickerValue);
    return [valueUnitVal, pickerUnitValue];
  };
  var _getUnitValue = getUnitValue("getHour"), _getUnitValue2 = _slicedToArray(_getUnitValue, 2), hour = _getUnitValue2[0], pickerHour = _getUnitValue2[1];
  var _getUnitValue3 = getUnitValue("getMinute"), _getUnitValue4 = _slicedToArray(_getUnitValue3, 2), minute = _getUnitValue4[0], pickerMinute = _getUnitValue4[1];
  var _getUnitValue5 = getUnitValue("getSecond"), _getUnitValue6 = _slicedToArray(_getUnitValue5, 2), second = _getUnitValue6[0], pickerSecond = _getUnitValue6[1];
  var _getUnitValue7 = getUnitValue("getMillisecond"), _getUnitValue8 = _slicedToArray(_getUnitValue7, 2), millisecond = _getUnitValue8[0], pickerMillisecond = _getUnitValue8[1];
  var meridiem = hour === null ? null : isAM(hour) ? "am" : "pm";
  var hourUnits = reactExports.useMemo(function() {
    if (!showMeridiem) {
      return rowHourUnits;
    }
    return isAM(hour) ? rowHourUnits.filter(function(h) {
      return isAM(h.value);
    }) : rowHourUnits.filter(function(h) {
      return !isAM(h.value);
    });
  }, [hour, rowHourUnits, showMeridiem]);
  var getEnabled = function getEnabled2(units, val) {
    var _enabledUnits$;
    var enabledUnits = units.filter(function(unit2) {
      return !unit2.disabled;
    });
    return val !== null && val !== void 0 ? val : (
      // Fallback to enabled value
      enabledUnits === null || enabledUnits === void 0 || (_enabledUnits$ = enabledUnits[0]) === null || _enabledUnits$ === void 0 ? void 0 : _enabledUnits$.value
    );
  };
  var validHour = getEnabled(rowHourUnits, hour);
  var minuteUnits = reactExports.useMemo(function() {
    return getMinuteUnits(validHour);
  }, [getMinuteUnits, validHour]);
  var validMinute = getEnabled(minuteUnits, minute);
  var secondUnits = reactExports.useMemo(function() {
    return getSecondUnits(validHour, validMinute);
  }, [getSecondUnits, validHour, validMinute]);
  var validSecond = getEnabled(secondUnits, second);
  var millisecondUnits = reactExports.useMemo(function() {
    return getMillisecondUnits(validHour, validMinute, validSecond);
  }, [getMillisecondUnits, validHour, validMinute, validSecond]);
  var validMillisecond = getEnabled(millisecondUnits, millisecond);
  var meridiemUnits = reactExports.useMemo(function() {
    if (!showMeridiem) {
      return [];
    }
    var base = generateConfig2.getNow();
    var amDate = generateConfig2.setHour(base, 6);
    var pmDate = generateConfig2.setHour(base, 18);
    var formatMeridiem = function formatMeridiem2(date, defaultLabel) {
      var cellMeridiemFormat = locale2.cellMeridiemFormat;
      return cellMeridiemFormat ? formatValue(date, {
        generateConfig: generateConfig2,
        locale: locale2,
        format: cellMeridiemFormat
      }) : defaultLabel;
    };
    return [{
      label: formatMeridiem(amDate, "AM"),
      value: "am",
      disabled: rowHourUnits.every(function(h) {
        return h.disabled || !isAM(h.value);
      })
    }, {
      label: formatMeridiem(pmDate, "PM"),
      value: "pm",
      disabled: rowHourUnits.every(function(h) {
        return h.disabled || isAM(h.value);
      })
    }];
  }, [rowHourUnits, showMeridiem, generateConfig2, locale2]);
  var triggerChange = function triggerChange2(nextDate) {
    var validateDate = getValidTime(nextDate);
    onSelect(validateDate);
  };
  var triggerDateTmpl = reactExports.useMemo(function() {
    var tmpl = value || pickerValue || generateConfig2.getNow();
    var isNotNull = function isNotNull2(num) {
      return num !== null && num !== void 0;
    };
    if (isNotNull(hour)) {
      tmpl = generateConfig2.setHour(tmpl, hour);
      tmpl = generateConfig2.setMinute(tmpl, minute);
      tmpl = generateConfig2.setSecond(tmpl, second);
      tmpl = generateConfig2.setMillisecond(tmpl, millisecond);
    } else if (isNotNull(pickerHour)) {
      tmpl = generateConfig2.setHour(tmpl, pickerHour);
      tmpl = generateConfig2.setMinute(tmpl, pickerMinute);
      tmpl = generateConfig2.setSecond(tmpl, pickerSecond);
      tmpl = generateConfig2.setMillisecond(tmpl, pickerMillisecond);
    } else if (isNotNull(validHour)) {
      tmpl = generateConfig2.setHour(tmpl, validHour);
      tmpl = generateConfig2.setMinute(tmpl, validMinute);
      tmpl = generateConfig2.setSecond(tmpl, validSecond);
      tmpl = generateConfig2.setMillisecond(tmpl, validMillisecond);
    }
    return tmpl;
  }, [value, pickerValue, hour, minute, second, millisecond, validHour, validMinute, validSecond, validMillisecond, pickerHour, pickerMinute, pickerSecond, pickerMillisecond, generateConfig2]);
  var fillColumnValue = function fillColumnValue2(val, func) {
    if (val === null) {
      return null;
    }
    return generateConfig2[func](triggerDateTmpl, val);
  };
  var getNextHourTime = function getNextHourTime2(val) {
    return fillColumnValue(val, "setHour");
  };
  var getNextMinuteTime = function getNextMinuteTime2(val) {
    return fillColumnValue(val, "setMinute");
  };
  var getNextSecondTime = function getNextSecondTime2(val) {
    return fillColumnValue(val, "setSecond");
  };
  var getNextMillisecondTime = function getNextMillisecondTime2(val) {
    return fillColumnValue(val, "setMillisecond");
  };
  var getMeridiemTime = function getMeridiemTime2(val) {
    if (val === null) {
      return null;
    }
    if (val === "am" && !isAM(hour)) {
      return generateConfig2.setHour(triggerDateTmpl, hour - 12);
    } else if (val === "pm" && isAM(hour)) {
      return generateConfig2.setHour(triggerDateTmpl, hour + 12);
    }
    return triggerDateTmpl;
  };
  var onHourChange = function onHourChange2(val) {
    triggerChange(getNextHourTime(val));
  };
  var onMinuteChange = function onMinuteChange2(val) {
    triggerChange(getNextMinuteTime(val));
  };
  var onSecondChange = function onSecondChange2(val) {
    triggerChange(getNextSecondTime(val));
  };
  var onMillisecondChange = function onMillisecondChange2(val) {
    triggerChange(getNextMillisecondTime(val));
  };
  var onMeridiemChange = function onMeridiemChange2(val) {
    triggerChange(getMeridiemTime(val));
  };
  var onHourHover = function onHourHover2(val) {
    onHover(getNextHourTime(val));
  };
  var onMinuteHover = function onMinuteHover2(val) {
    onHover(getNextMinuteTime(val));
  };
  var onSecondHover = function onSecondHover2(val) {
    onHover(getNextSecondTime(val));
  };
  var onMillisecondHover = function onMillisecondHover2(val) {
    onHover(getNextMillisecondTime(val));
  };
  var onMeridiemHover = function onMeridiemHover2(val) {
    onHover(getMeridiemTime(val));
  };
  var sharedColumnProps = {
    onDblClick: onCellDblClick,
    changeOnScroll
  };
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-content")
  }, showHour && /* @__PURE__ */ reactExports.createElement(TimeColumn, _extends({
    units: hourUnits,
    value: hour,
    optionalValue: pickerHour,
    type: "hour",
    onChange: onHourChange,
    onHover: onHourHover
  }, sharedColumnProps)), showMinute && /* @__PURE__ */ reactExports.createElement(TimeColumn, _extends({
    units: minuteUnits,
    value: minute,
    optionalValue: pickerMinute,
    type: "minute",
    onChange: onMinuteChange,
    onHover: onMinuteHover
  }, sharedColumnProps)), showSecond && /* @__PURE__ */ reactExports.createElement(TimeColumn, _extends({
    units: secondUnits,
    value: second,
    optionalValue: pickerSecond,
    type: "second",
    onChange: onSecondChange,
    onHover: onSecondHover
  }, sharedColumnProps)), showMillisecond && /* @__PURE__ */ reactExports.createElement(TimeColumn, _extends({
    units: millisecondUnits,
    value: millisecond,
    optionalValue: pickerMillisecond,
    type: "millisecond",
    onChange: onMillisecondChange,
    onHover: onMillisecondHover
  }, sharedColumnProps)), showMeridiem && /* @__PURE__ */ reactExports.createElement(TimeColumn, _extends({
    units: meridiemUnits,
    value: meridiem,
    type: "meridiem",
    onChange: onMeridiemChange,
    onHover: onMeridiemHover
  }, sharedColumnProps)));
}
function TimePanel(props) {
  var prefixCls = props.prefixCls, value = props.value, locale2 = props.locale, generateConfig2 = props.generateConfig, showTime = props.showTime;
  var _ref = showTime || {}, format2 = _ref.format;
  var panelPrefixCls = "".concat(prefixCls, "-time-panel");
  var _useInfo = useInfo(props, "time"), _useInfo2 = _slicedToArray(_useInfo, 1), info = _useInfo2[0];
  return /* @__PURE__ */ reactExports.createElement(PanelContext.Provider, {
    value: info
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames(panelPrefixCls)
  }, /* @__PURE__ */ reactExports.createElement(PanelHeader, null, value ? formatValue(value, {
    locale: locale2,
    format: format2,
    generateConfig: generateConfig2
  }) : " "), /* @__PURE__ */ reactExports.createElement(TimePanelBody, showTime)));
}
function DateTimePanel(props) {
  var prefixCls = props.prefixCls, generateConfig2 = props.generateConfig, showTime = props.showTime, onSelect = props.onSelect, value = props.value, pickerValue = props.pickerValue, onHover = props.onHover;
  var panelPrefixCls = "".concat(prefixCls, "-datetime-panel");
  var _useTimeInfo = useTimeInfo(generateConfig2, showTime), _useTimeInfo2 = _slicedToArray(_useTimeInfo, 1), getValidTime = _useTimeInfo2[0];
  var mergeTime = function mergeTime2(date) {
    if (value) {
      return fillTime(generateConfig2, date, value);
    }
    return fillTime(generateConfig2, date, pickerValue);
  };
  var onDateHover = function onDateHover2(date) {
    onHover === null || onHover === void 0 || onHover(date ? mergeTime(date) : date);
  };
  var onDateSelect = function onDateSelect2(date) {
    var cloneDate = mergeTime(date);
    onSelect(getValidTime(cloneDate, cloneDate));
  };
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: panelPrefixCls
  }, /* @__PURE__ */ reactExports.createElement(DatePanel, _extends({}, props, {
    onSelect: onDateSelect,
    onHover: onDateHover
  })), /* @__PURE__ */ reactExports.createElement(TimePanel, props));
}
function DecadePanel(props) {
  var prefixCls = props.prefixCls, locale2 = props.locale, generateConfig2 = props.generateConfig, pickerValue = props.pickerValue, disabledDate = props.disabledDate, onPickerValueChange = props.onPickerValueChange;
  var panelPrefixCls = "".concat(prefixCls, "-decade-panel");
  var _useInfo = useInfo(props, "decade"), _useInfo2 = _slicedToArray(_useInfo, 1), info = _useInfo2[0];
  var getStartYear = function getStartYear2(date) {
    var startYear = Math.floor(generateConfig2.getYear(date) / 100) * 100;
    return generateConfig2.setYear(date, startYear);
  };
  var getEndYear = function getEndYear2(date) {
    var startYear = getStartYear(date);
    return generateConfig2.addYear(startYear, 99);
  };
  var startYearDate = getStartYear(pickerValue);
  var endYearDate = getEndYear(pickerValue);
  var baseDate = generateConfig2.addYear(startYearDate, -10);
  var getCellDate = function getCellDate2(date, offset) {
    return generateConfig2.addYear(date, offset * 10);
  };
  var getCellText = function getCellText2(date) {
    var cellYearFormat = locale2.cellYearFormat;
    var startYearStr = formatValue(date, {
      locale: locale2,
      format: cellYearFormat,
      generateConfig: generateConfig2
    });
    var endYearStr = formatValue(generateConfig2.addYear(date, 9), {
      locale: locale2,
      format: cellYearFormat,
      generateConfig: generateConfig2
    });
    return "".concat(startYearStr, "-").concat(endYearStr);
  };
  var getCellClassName = function getCellClassName2(date) {
    return _defineProperty({}, "".concat(prefixCls, "-cell-in-view"), isSameDecade(generateConfig2, date, startYearDate) || isSameDecade(generateConfig2, date, endYearDate) || isInRange(generateConfig2, startYearDate, endYearDate, date));
  };
  var mergedDisabledDate = disabledDate ? function(currentDate, disabledInfo) {
    var baseStartDate = generateConfig2.setDate(currentDate, 1);
    var baseStartMonth = generateConfig2.setMonth(baseStartDate, 0);
    var baseStartYear = generateConfig2.setYear(baseStartMonth, Math.floor(generateConfig2.getYear(baseStartMonth) / 10) * 10);
    var baseEndYear = generateConfig2.addYear(baseStartYear, 10);
    var baseEndDate = generateConfig2.addDate(baseEndYear, -1);
    return disabledDate(baseStartYear, disabledInfo) && disabledDate(baseEndDate, disabledInfo);
  } : null;
  var yearNode = "".concat(formatValue(startYearDate, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }), "-").concat(formatValue(endYearDate, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }));
  return /* @__PURE__ */ reactExports.createElement(PanelContext.Provider, {
    value: info
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: panelPrefixCls
  }, /* @__PURE__ */ reactExports.createElement(PanelHeader, {
    superOffset: function superOffset(distance) {
      return generateConfig2.addYear(pickerValue, distance * 100);
    },
    onChange: onPickerValueChange,
    getStart: getStartYear,
    getEnd: getEndYear
  }, yearNode), /* @__PURE__ */ reactExports.createElement(PanelBody, _extends({}, props, {
    disabledDate: mergedDisabledDate,
    colNum: 3,
    rowNum: 4,
    baseDate,
    getCellDate,
    getCellText,
    getCellClassName
  }))));
}
function MonthPanel(props) {
  var prefixCls = props.prefixCls, locale2 = props.locale, generateConfig2 = props.generateConfig, pickerValue = props.pickerValue, disabledDate = props.disabledDate, onPickerValueChange = props.onPickerValueChange, onModeChange = props.onModeChange;
  var panelPrefixCls = "".concat(prefixCls, "-month-panel");
  var _useInfo = useInfo(props, "month"), _useInfo2 = _slicedToArray(_useInfo, 1), info = _useInfo2[0];
  var baseDate = generateConfig2.setMonth(pickerValue, 0);
  var monthsLocale = locale2.shortMonths || (generateConfig2.locale.getShortMonths ? generateConfig2.locale.getShortMonths(locale2.locale) : []);
  var getCellDate = function getCellDate2(date, offset) {
    return generateConfig2.addMonth(date, offset);
  };
  var getCellText = function getCellText2(date) {
    var month = generateConfig2.getMonth(date);
    return locale2.monthFormat ? formatValue(date, {
      locale: locale2,
      format: locale2.monthFormat,
      generateConfig: generateConfig2
    }) : monthsLocale[month];
  };
  var getCellClassName = function getCellClassName2() {
    return _defineProperty({}, "".concat(prefixCls, "-cell-in-view"), true);
  };
  var mergedDisabledDate = disabledDate ? function(currentDate, disabledInfo) {
    var startDate = generateConfig2.setDate(currentDate, 1);
    var nextMonthStartDate = generateConfig2.setMonth(startDate, generateConfig2.getMonth(startDate) + 1);
    var endDate = generateConfig2.addDate(nextMonthStartDate, -1);
    return disabledDate(startDate, disabledInfo) && disabledDate(endDate, disabledInfo);
  } : null;
  var yearNode = /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    key: "year",
    "aria-label": locale2.yearSelect,
    onClick: function onClick() {
      onModeChange("year");
    },
    tabIndex: -1,
    className: "".concat(prefixCls, "-year-btn")
  }, formatValue(pickerValue, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }));
  return /* @__PURE__ */ reactExports.createElement(PanelContext.Provider, {
    value: info
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: panelPrefixCls
  }, /* @__PURE__ */ reactExports.createElement(PanelHeader, {
    superOffset: function superOffset(distance) {
      return generateConfig2.addYear(pickerValue, distance);
    },
    onChange: onPickerValueChange,
    getStart: function getStart(date) {
      return generateConfig2.setMonth(date, 0);
    },
    getEnd: function getEnd(date) {
      return generateConfig2.setMonth(date, 11);
    }
  }, yearNode), /* @__PURE__ */ reactExports.createElement(PanelBody, _extends({}, props, {
    disabledDate: mergedDisabledDate,
    titleFormat: locale2.fieldMonthFormat,
    colNum: 3,
    rowNum: 4,
    baseDate,
    getCellDate,
    getCellText,
    getCellClassName
  }))));
}
function QuarterPanel(props) {
  var prefixCls = props.prefixCls, locale2 = props.locale, generateConfig2 = props.generateConfig, pickerValue = props.pickerValue, onPickerValueChange = props.onPickerValueChange, onModeChange = props.onModeChange;
  var panelPrefixCls = "".concat(prefixCls, "-quarter-panel");
  var _useInfo = useInfo(props, "quarter"), _useInfo2 = _slicedToArray(_useInfo, 1), info = _useInfo2[0];
  var baseDate = generateConfig2.setMonth(pickerValue, 0);
  var getCellDate = function getCellDate2(date, offset) {
    return generateConfig2.addMonth(date, offset * 3);
  };
  var getCellText = function getCellText2(date) {
    return formatValue(date, {
      locale: locale2,
      format: locale2.cellQuarterFormat,
      generateConfig: generateConfig2
    });
  };
  var getCellClassName = function getCellClassName2() {
    return _defineProperty({}, "".concat(prefixCls, "-cell-in-view"), true);
  };
  var yearNode = /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    key: "year",
    "aria-label": locale2.yearSelect,
    onClick: function onClick() {
      onModeChange("year");
    },
    tabIndex: -1,
    className: "".concat(prefixCls, "-year-btn")
  }, formatValue(pickerValue, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }));
  return /* @__PURE__ */ reactExports.createElement(PanelContext.Provider, {
    value: info
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: panelPrefixCls
  }, /* @__PURE__ */ reactExports.createElement(PanelHeader, {
    superOffset: function superOffset(distance) {
      return generateConfig2.addYear(pickerValue, distance);
    },
    onChange: onPickerValueChange,
    getStart: function getStart(date) {
      return generateConfig2.setMonth(date, 0);
    },
    getEnd: function getEnd(date) {
      return generateConfig2.setMonth(date, 11);
    }
  }, yearNode), /* @__PURE__ */ reactExports.createElement(PanelBody, _extends({}, props, {
    titleFormat: locale2.fieldQuarterFormat,
    colNum: 4,
    rowNum: 1,
    baseDate,
    getCellDate,
    getCellText,
    getCellClassName
  }))));
}
function WeekPanel(props) {
  var prefixCls = props.prefixCls, generateConfig2 = props.generateConfig, locale2 = props.locale, value = props.value, hoverValue = props.hoverValue, hoverRangeValue = props.hoverRangeValue;
  var localeName = locale2.locale;
  var rowPrefixCls = "".concat(prefixCls, "-week-panel-row");
  var rowClassName = function rowClassName2(currentDate) {
    var rangeCls = {};
    if (hoverRangeValue) {
      var _hoverRangeValue = _slicedToArray(hoverRangeValue, 2), rangeStart = _hoverRangeValue[0], rangeEnd = _hoverRangeValue[1];
      var isRangeStart = isSameWeek(generateConfig2, localeName, rangeStart, currentDate);
      var isRangeEnd = isSameWeek(generateConfig2, localeName, rangeEnd, currentDate);
      rangeCls["".concat(rowPrefixCls, "-range-start")] = isRangeStart;
      rangeCls["".concat(rowPrefixCls, "-range-end")] = isRangeEnd;
      rangeCls["".concat(rowPrefixCls, "-range-hover")] = !isRangeStart && !isRangeEnd && isInRange(generateConfig2, rangeStart, rangeEnd, currentDate);
    }
    if (hoverValue) {
      rangeCls["".concat(rowPrefixCls, "-hover")] = hoverValue.some(function(date) {
        return isSameWeek(generateConfig2, localeName, currentDate, date);
      });
    }
    return classNames(
      rowPrefixCls,
      _defineProperty({}, "".concat(rowPrefixCls, "-selected"), !hoverRangeValue && isSameWeek(generateConfig2, localeName, value, currentDate)),
      // Patch for hover range
      rangeCls
    );
  };
  return /* @__PURE__ */ reactExports.createElement(DatePanel, _extends({}, props, {
    mode: "week",
    panelName: "week",
    rowClassName
  }));
}
function YearPanel(props) {
  var prefixCls = props.prefixCls, locale2 = props.locale, generateConfig2 = props.generateConfig, pickerValue = props.pickerValue, disabledDate = props.disabledDate, onPickerValueChange = props.onPickerValueChange, onModeChange = props.onModeChange;
  var panelPrefixCls = "".concat(prefixCls, "-year-panel");
  var _useInfo = useInfo(props, "year"), _useInfo2 = _slicedToArray(_useInfo, 1), info = _useInfo2[0];
  var getStartYear = function getStartYear2(date) {
    var startYear = Math.floor(generateConfig2.getYear(date) / 10) * 10;
    return generateConfig2.setYear(date, startYear);
  };
  var getEndYear = function getEndYear2(date) {
    var startYear = getStartYear(date);
    return generateConfig2.addYear(startYear, 9);
  };
  var startYearDate = getStartYear(pickerValue);
  var endYearDate = getEndYear(pickerValue);
  var baseDate = generateConfig2.addYear(startYearDate, -1);
  var getCellDate = function getCellDate2(date, offset) {
    return generateConfig2.addYear(date, offset);
  };
  var getCellText = function getCellText2(date) {
    return formatValue(date, {
      locale: locale2,
      format: locale2.cellYearFormat,
      generateConfig: generateConfig2
    });
  };
  var getCellClassName = function getCellClassName2(date) {
    return _defineProperty({}, "".concat(prefixCls, "-cell-in-view"), isSameYear(generateConfig2, date, startYearDate) || isSameYear(generateConfig2, date, endYearDate) || isInRange(generateConfig2, startYearDate, endYearDate, date));
  };
  var mergedDisabledDate = disabledDate ? function(currentDate, disabledInfo) {
    var startMonth = generateConfig2.setMonth(currentDate, 0);
    var startDate = generateConfig2.setDate(startMonth, 1);
    var endMonth = generateConfig2.addYear(startDate, 1);
    var endDate = generateConfig2.addDate(endMonth, -1);
    return disabledDate(startDate, disabledInfo) && disabledDate(endDate, disabledInfo);
  } : null;
  var yearNode = /* @__PURE__ */ reactExports.createElement("button", {
    type: "button",
    key: "decade",
    "aria-label": locale2.decadeSelect,
    onClick: function onClick() {
      onModeChange("decade");
    },
    tabIndex: -1,
    className: "".concat(prefixCls, "-decade-btn")
  }, formatValue(startYearDate, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }), "-", formatValue(endYearDate, {
    locale: locale2,
    format: locale2.yearFormat,
    generateConfig: generateConfig2
  }));
  return /* @__PURE__ */ reactExports.createElement(PanelContext.Provider, {
    value: info
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: panelPrefixCls
  }, /* @__PURE__ */ reactExports.createElement(PanelHeader, {
    superOffset: function superOffset(distance) {
      return generateConfig2.addYear(pickerValue, distance * 10);
    },
    onChange: onPickerValueChange,
    getStart: getStartYear,
    getEnd: getEndYear
  }, yearNode), /* @__PURE__ */ reactExports.createElement(PanelBody, _extends({}, props, {
    disabledDate: mergedDisabledDate,
    titleFormat: locale2.fieldYearFormat,
    colNum: 3,
    rowNum: 4,
    baseDate,
    getCellDate,
    getCellText,
    getCellClassName
  }))));
}
var DefaultComponents = {
  date: DatePanel,
  datetime: DateTimePanel,
  week: WeekPanel,
  month: MonthPanel,
  quarter: QuarterPanel,
  year: YearPanel,
  decade: DecadePanel,
  time: TimePanel
};
function PickerPanel(props, ref) {
  var _React$useContext;
  var locale2 = props.locale, generateConfig2 = props.generateConfig, direction = props.direction, prefixCls = props.prefixCls, _props$tabIndex = props.tabIndex, tabIndex = _props$tabIndex === void 0 ? 0 : _props$tabIndex, multiple = props.multiple, defaultValue = props.defaultValue, value = props.value, onChange = props.onChange, onSelect = props.onSelect, defaultPickerValue = props.defaultPickerValue, pickerValue = props.pickerValue, onPickerValueChange = props.onPickerValueChange, mode = props.mode, onPanelChange = props.onPanelChange, _props$picker = props.picker, picker = _props$picker === void 0 ? "date" : _props$picker, showTime = props.showTime, hoverValue = props.hoverValue, hoverRangeValue = props.hoverRangeValue, cellRender = props.cellRender, dateRender = props.dateRender, monthCellRender = props.monthCellRender, _props$components = props.components, components = _props$components === void 0 ? {} : _props$components, hideHeader = props.hideHeader;
  var mergedPrefixCls = ((_React$useContext = reactExports.useContext(PickerContext)) === null || _React$useContext === void 0 ? void 0 : _React$useContext.prefixCls) || prefixCls || "rc-picker";
  var rootRef = reactExports.useRef();
  reactExports.useImperativeHandle(ref, function() {
    return {
      nativeElement: rootRef.current
    };
  });
  var _getTimeProps = getTimeProps(props), _getTimeProps2 = _slicedToArray(_getTimeProps, 4), timeProps = _getTimeProps2[0], localeTimeProps = _getTimeProps2[1], showTimeFormat = _getTimeProps2[2], propFormat = _getTimeProps2[3];
  var filledLocale = useLocale(locale2, localeTimeProps);
  var internalPicker = picker === "date" && showTime ? "datetime" : picker;
  var mergedShowTime = reactExports.useMemo(function() {
    return fillShowTimeConfig(internalPicker, showTimeFormat, propFormat, timeProps, filledLocale);
  }, [internalPicker, showTimeFormat, propFormat, timeProps, filledLocale]);
  var now = generateConfig2.getNow();
  var _useMergedState = useMergedState(picker, {
    value: mode,
    postState: function postState(val) {
      return val || "date";
    }
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedMode = _useMergedState2[0], setMergedMode = _useMergedState2[1];
  var internalMode = mergedMode === "date" && mergedShowTime ? "datetime" : mergedMode;
  var toggleDates = useToggleDates(generateConfig2, locale2, internalPicker);
  var _useMergedState3 = useMergedState(defaultValue, {
    value
  }), _useMergedState4 = _slicedToArray(_useMergedState3, 2), innerValue = _useMergedState4[0], setMergedValue = _useMergedState4[1];
  var mergedValue = reactExports.useMemo(function() {
    var values = toArray(innerValue).filter(function(val) {
      return val;
    });
    return multiple ? values : values.slice(0, 1);
  }, [innerValue, multiple]);
  var triggerChange = useEvent(function(nextValue) {
    setMergedValue(nextValue);
    if (onChange && (nextValue === null || mergedValue.length !== nextValue.length || mergedValue.some(function(ori, index) {
      return !isSame(generateConfig2, locale2, ori, nextValue[index], internalPicker);
    }))) {
      onChange === null || onChange === void 0 || onChange(multiple ? nextValue : nextValue[0]);
    }
  });
  var onInternalSelect = useEvent(function(newDate) {
    onSelect === null || onSelect === void 0 || onSelect(newDate);
    if (mergedMode === picker) {
      var nextValues = multiple ? toggleDates(mergedValue, newDate) : [newDate];
      triggerChange(nextValues);
    }
  });
  var _useMergedState5 = useMergedState(defaultPickerValue || mergedValue[0] || now, {
    value: pickerValue
  }), _useMergedState6 = _slicedToArray(_useMergedState5, 2), mergedPickerValue = _useMergedState6[0], setInternalPickerValue = _useMergedState6[1];
  reactExports.useEffect(function() {
    if (mergedValue[0] && !pickerValue) {
      setInternalPickerValue(mergedValue[0]);
    }
  }, [mergedValue[0]]);
  var triggerPanelChange = function triggerPanelChange2(viewDate, nextMode) {
    onPanelChange === null || onPanelChange === void 0 || onPanelChange(viewDate || pickerValue, nextMode || mergedMode);
  };
  var setPickerValue = function setPickerValue2(nextPickerValue) {
    var triggerPanelEvent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    setInternalPickerValue(nextPickerValue);
    onPickerValueChange === null || onPickerValueChange === void 0 || onPickerValueChange(nextPickerValue);
    if (triggerPanelEvent) {
      triggerPanelChange(nextPickerValue);
    }
  };
  var triggerModeChange = function triggerModeChange2(nextMode, viewDate) {
    setMergedMode(nextMode);
    if (viewDate) {
      setPickerValue(viewDate);
    }
    triggerPanelChange(viewDate, nextMode);
  };
  var onPanelValueSelect = function onPanelValueSelect2(nextValue) {
    onInternalSelect(nextValue);
    setPickerValue(nextValue);
    if (mergedMode !== picker) {
      var decadeYearQueue = ["decade", "year"];
      var decadeYearMonthQueue = [].concat(decadeYearQueue, ["month"]);
      var pickerQueue = {
        quarter: [].concat(decadeYearQueue, ["quarter"]),
        week: [].concat(_toConsumableArray(decadeYearMonthQueue), ["week"]),
        date: [].concat(_toConsumableArray(decadeYearMonthQueue), ["date"])
      };
      var queue = pickerQueue[picker] || decadeYearMonthQueue;
      var index = queue.indexOf(mergedMode);
      var nextMode = queue[index + 1];
      if (nextMode) {
        triggerModeChange(nextMode, nextValue);
      }
    }
  };
  var hoverRangeDate = reactExports.useMemo(function() {
    var start;
    var end;
    if (Array.isArray(hoverRangeValue)) {
      var _hoverRangeValue = _slicedToArray(hoverRangeValue, 2);
      start = _hoverRangeValue[0];
      end = _hoverRangeValue[1];
    } else {
      start = hoverRangeValue;
    }
    if (!start && !end) {
      return null;
    }
    start = start || end;
    end = end || start;
    return generateConfig2.isAfter(start, end) ? [end, start] : [start, end];
  }, [hoverRangeValue, generateConfig2]);
  var onInternalCellRender = useCellRender(cellRender, dateRender, monthCellRender);
  var PanelComponent = components[internalMode] || DefaultComponents[internalMode] || DatePanel;
  var parentHackContext = reactExports.useContext(PickerHackContext);
  var pickerPanelContext = reactExports.useMemo(function() {
    return _objectSpread2(_objectSpread2({}, parentHackContext), {}, {
      hideHeader
    });
  }, [parentHackContext, hideHeader]);
  var panelCls = "".concat(mergedPrefixCls, "-panel");
  var panelProps = pickProps(props, [
    // Week
    "showWeek",
    // Icons
    "prevIcon",
    "nextIcon",
    "superPrevIcon",
    "superNextIcon",
    // Disabled
    "disabledDate",
    "minDate",
    "maxDate",
    // Hover
    "onHover"
  ]);
  return /* @__PURE__ */ reactExports.createElement(PickerHackContext.Provider, {
    value: pickerPanelContext
  }, /* @__PURE__ */ reactExports.createElement("div", {
    ref: rootRef,
    tabIndex,
    className: classNames(panelCls, _defineProperty({}, "".concat(panelCls, "-rtl"), direction === "rtl"))
  }, /* @__PURE__ */ reactExports.createElement(PanelComponent, _extends({}, panelProps, {
    // Time
    showTime: mergedShowTime,
    prefixCls: mergedPrefixCls,
    locale: filledLocale,
    generateConfig: generateConfig2,
    onModeChange: triggerModeChange,
    pickerValue: mergedPickerValue,
    onPickerValueChange: function onPickerValueChange2(nextPickerValue) {
      setPickerValue(nextPickerValue, true);
    },
    value: mergedValue[0],
    onSelect: onPanelValueSelect,
    values: mergedValue,
    cellRender: onInternalCellRender,
    hoverRangeValue: hoverRangeDate,
    hoverValue
  }))));
}
var RefPanelPicker = /* @__PURE__ */ reactExports.memo(/* @__PURE__ */ reactExports.forwardRef(PickerPanel));
function PopupPanel(props) {
  var picker = props.picker, multiplePanel = props.multiplePanel, pickerValue = props.pickerValue, onPickerValueChange = props.onPickerValueChange, needConfirm = props.needConfirm, onSubmit = props.onSubmit, range = props.range, hoverValue = props.hoverValue;
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls, generateConfig2 = _React$useContext.generateConfig;
  var internalOffsetDate = reactExports.useCallback(function(date, offset) {
    return offsetPanelDate(generateConfig2, picker, date, offset);
  }, [generateConfig2, picker]);
  var nextPickerValue = reactExports.useMemo(function() {
    return internalOffsetDate(pickerValue, 1);
  }, [pickerValue, internalOffsetDate]);
  var onSecondPickerValueChange = function onSecondPickerValueChange2(nextDate) {
    onPickerValueChange(internalOffsetDate(nextDate, -1));
  };
  var sharedContext = {
    onCellDblClick: function onCellDblClick() {
      if (needConfirm) {
        onSubmit();
      }
    }
  };
  var hideHeader = picker === "time";
  var pickerProps = _objectSpread2(_objectSpread2({}, props), {}, {
    hoverValue: null,
    hoverRangeValue: null,
    hideHeader
  });
  if (range) {
    pickerProps.hoverRangeValue = hoverValue;
  } else {
    pickerProps.hoverValue = hoverValue;
  }
  if (multiplePanel) {
    return /* @__PURE__ */ reactExports.createElement("div", {
      className: "".concat(prefixCls, "-panels")
    }, /* @__PURE__ */ reactExports.createElement(PickerHackContext.Provider, {
      value: _objectSpread2(_objectSpread2({}, sharedContext), {}, {
        hideNext: true
      })
    }, /* @__PURE__ */ reactExports.createElement(RefPanelPicker, pickerProps)), /* @__PURE__ */ reactExports.createElement(PickerHackContext.Provider, {
      value: _objectSpread2(_objectSpread2({}, sharedContext), {}, {
        hidePrev: true
      })
    }, /* @__PURE__ */ reactExports.createElement(RefPanelPicker, _extends({}, pickerProps, {
      pickerValue: nextPickerValue,
      onPickerValueChange: onSecondPickerValueChange
    }))));
  }
  return /* @__PURE__ */ reactExports.createElement(PickerHackContext.Provider, {
    value: _objectSpread2({}, sharedContext)
  }, /* @__PURE__ */ reactExports.createElement(RefPanelPicker, pickerProps));
}
function executeValue(value) {
  return typeof value === "function" ? value() : value;
}
function PresetPanel(props) {
  var prefixCls = props.prefixCls, presets = props.presets, _onClick = props.onClick, onHover = props.onHover;
  if (!presets.length) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-presets")
  }, /* @__PURE__ */ reactExports.createElement("ul", null, presets.map(function(_ref, index) {
    var label = _ref.label, value = _ref.value;
    return /* @__PURE__ */ reactExports.createElement("li", {
      key: index,
      onClick: function onClick() {
        _onClick(executeValue(value));
      },
      onMouseEnter: function onMouseEnter() {
        onHover(executeValue(value));
      },
      onMouseLeave: function onMouseLeave() {
        onHover(null);
      }
    }, label);
  })));
}
function Popup(props) {
  var panelRender = props.panelRender, internalMode = props.internalMode, picker = props.picker, showNow = props.showNow, range = props.range, multiple = props.multiple, _props$activeInfo = props.activeInfo, activeInfo = _props$activeInfo === void 0 ? [0, 0, 0] : _props$activeInfo, presets = props.presets, onPresetHover = props.onPresetHover, onPresetSubmit = props.onPresetSubmit, onFocus = props.onFocus, onBlur = props.onBlur, onPanelMouseDown = props.onPanelMouseDown, direction = props.direction, value = props.value, onSelect = props.onSelect, isInvalid = props.isInvalid, defaultOpenValue = props.defaultOpenValue, onOk = props.onOk, onSubmit = props.onSubmit;
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls;
  var panelPrefixCls = "".concat(prefixCls, "-panel");
  var rtl = direction === "rtl";
  var arrowRef = reactExports.useRef(null);
  var wrapperRef = reactExports.useRef(null);
  var _React$useState = reactExports.useState(0), _React$useState2 = _slicedToArray(_React$useState, 2), containerWidth = _React$useState2[0], setContainerWidth = _React$useState2[1];
  var _React$useState3 = reactExports.useState(0), _React$useState4 = _slicedToArray(_React$useState3, 2), containerOffset = _React$useState4[0], setContainerOffset = _React$useState4[1];
  var _React$useState5 = reactExports.useState(0), _React$useState6 = _slicedToArray(_React$useState5, 2), arrowOffset = _React$useState6[0], setArrowOffset = _React$useState6[1];
  var onResize = function onResize2(info) {
    if (info.width) {
      setContainerWidth(info.width);
    }
  };
  var _activeInfo = _slicedToArray(activeInfo, 3), activeInputLeft = _activeInfo[0], activeInputRight = _activeInfo[1], selectorWidth = _activeInfo[2];
  var _React$useState7 = reactExports.useState(0), _React$useState8 = _slicedToArray(_React$useState7, 2), retryTimes = _React$useState8[0], setRetryTimes = _React$useState8[1];
  reactExports.useEffect(function() {
    setRetryTimes(10);
  }, [activeInputLeft]);
  reactExports.useEffect(function() {
    if (range && wrapperRef.current) {
      var _arrowRef$current;
      var arrowWidth = ((_arrowRef$current = arrowRef.current) === null || _arrowRef$current === void 0 ? void 0 : _arrowRef$current.offsetWidth) || 0;
      var wrapperRect = wrapperRef.current.getBoundingClientRect();
      if (!wrapperRect.height || wrapperRect.right < 0) {
        setRetryTimes(function(times) {
          return Math.max(0, times - 1);
        });
        return;
      }
      var nextArrowOffset = (rtl ? activeInputRight - arrowWidth : activeInputLeft) - wrapperRect.left;
      setArrowOffset(nextArrowOffset);
      if (containerWidth && containerWidth < selectorWidth) {
        var offset = rtl ? wrapperRect.right - (activeInputRight - arrowWidth + containerWidth) : activeInputLeft + arrowWidth - wrapperRect.left - containerWidth;
        var safeOffset = Math.max(0, offset);
        setContainerOffset(safeOffset);
      } else {
        setContainerOffset(0);
      }
    }
  }, [retryTimes, rtl, containerWidth, activeInputLeft, activeInputRight, selectorWidth, range]);
  function filterEmpty(list) {
    return list.filter(function(item) {
      return item;
    });
  }
  var valueList = reactExports.useMemo(function() {
    return filterEmpty(toArray(value));
  }, [value]);
  var isTimePickerEmptyValue = picker === "time" && !valueList.length;
  var footerSubmitValue = reactExports.useMemo(function() {
    if (isTimePickerEmptyValue) {
      return filterEmpty([defaultOpenValue]);
    }
    return valueList;
  }, [isTimePickerEmptyValue, valueList, defaultOpenValue]);
  var popupPanelValue = isTimePickerEmptyValue ? defaultOpenValue : valueList;
  var disableSubmit = reactExports.useMemo(function() {
    if (!footerSubmitValue.length) {
      return true;
    }
    return footerSubmitValue.some(function(val) {
      return isInvalid(val);
    });
  }, [footerSubmitValue, isInvalid]);
  var onFooterSubmit = function onFooterSubmit2() {
    if (isTimePickerEmptyValue) {
      onSelect(defaultOpenValue);
    }
    onOk();
    onSubmit();
  };
  var mergedNodes = /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-panel-layout")
  }, /* @__PURE__ */ reactExports.createElement(PresetPanel, {
    prefixCls,
    presets,
    onClick: onPresetSubmit,
    onHover: onPresetHover
  }), /* @__PURE__ */ reactExports.createElement("div", null, /* @__PURE__ */ reactExports.createElement(PopupPanel, _extends({}, props, {
    value: popupPanelValue
  })), /* @__PURE__ */ reactExports.createElement(Footer, _extends({}, props, {
    showNow: multiple ? false : showNow,
    invalid: disableSubmit,
    onSubmit: onFooterSubmit
  }))));
  if (panelRender) {
    mergedNodes = panelRender(mergedNodes);
  }
  var containerPrefixCls = "".concat(panelPrefixCls, "-container");
  var marginLeft = "marginLeft";
  var marginRight = "marginRight";
  var renderNode = /* @__PURE__ */ reactExports.createElement("div", {
    onMouseDown: onPanelMouseDown,
    tabIndex: -1,
    className: classNames(
      containerPrefixCls,
      // Used for Today Button style, safe to remove if no need
      "".concat(prefixCls, "-").concat(internalMode, "-panel-container")
    ),
    style: _defineProperty(_defineProperty({}, rtl ? marginRight : marginLeft, containerOffset), rtl ? marginLeft : marginRight, "auto"),
    onFocus,
    onBlur
  }, mergedNodes);
  if (range) {
    renderNode = /* @__PURE__ */ reactExports.createElement("div", {
      onMouseDown: onPanelMouseDown,
      ref: wrapperRef,
      className: classNames("".concat(prefixCls, "-range-wrapper"), "".concat(prefixCls, "-").concat(picker, "-range-wrapper"))
    }, /* @__PURE__ */ reactExports.createElement("div", {
      ref: arrowRef,
      className: "".concat(prefixCls, "-range-arrow"),
      style: {
        left: arrowOffset
      }
    }), /* @__PURE__ */ reactExports.createElement(RefResizeObserver, {
      onResize
    }, renderNode));
  }
  return renderNode;
}
function useInputProps(props, postProps) {
  var format2 = props.format, maskFormat = props.maskFormat, generateConfig2 = props.generateConfig, locale2 = props.locale, preserveInvalidOnBlur = props.preserveInvalidOnBlur, inputReadOnly = props.inputReadOnly, required = props.required, ariaRequired = props["aria-required"], onSubmit = props.onSubmit, _onFocus = props.onFocus, _onBlur = props.onBlur, onInputChange = props.onInputChange, onInvalid = props.onInvalid, open = props.open, onOpenChange = props.onOpenChange, _onKeyDown = props.onKeyDown, _onChange = props.onChange, activeHelp = props.activeHelp, name = props.name, autoComplete = props.autoComplete, id = props.id, value = props.value, invalid = props.invalid, placeholder = props.placeholder, disabled = props.disabled, activeIndex = props.activeIndex, allHelp = props.allHelp, picker = props.picker;
  var parseDate = function parseDate2(str, formatStr) {
    var parsed = generateConfig2.locale.parse(locale2.locale, str, [formatStr]);
    return parsed && generateConfig2.isValidate(parsed) ? parsed : null;
  };
  var firstFormat = format2[0];
  var getText = reactExports.useCallback(function(date) {
    return formatValue(date, {
      locale: locale2,
      format: firstFormat,
      generateConfig: generateConfig2
    });
  }, [locale2, generateConfig2, firstFormat]);
  var valueTexts = reactExports.useMemo(function() {
    return value.map(getText);
  }, [value, getText]);
  var size = reactExports.useMemo(function() {
    var defaultSize = picker === "time" ? 8 : 10;
    var length = typeof firstFormat === "function" ? firstFormat(generateConfig2.getNow()).length : firstFormat.length;
    return Math.max(defaultSize, length) + 2;
  }, [firstFormat, picker, generateConfig2]);
  var _validateFormat = function validateFormat(text) {
    for (var i = 0; i < format2.length; i += 1) {
      var singleFormat = format2[i];
      if (typeof singleFormat === "string") {
        var parsed = parseDate(text, singleFormat);
        if (parsed) {
          return parsed;
        }
      }
    }
    return false;
  };
  var getInputProps = function getInputProps2(index) {
    function getProp(propValue) {
      return index !== void 0 ? propValue[index] : propValue;
    }
    var pickedAttrs = pickAttrs(props, {
      aria: true,
      data: true
    });
    var inputProps = _objectSpread2(_objectSpread2({}, pickedAttrs), {}, {
      // ============== Shared ==============
      format: maskFormat,
      validateFormat: function validateFormat(text) {
        return !!_validateFormat(text);
      },
      preserveInvalidOnBlur,
      readOnly: inputReadOnly,
      required,
      "aria-required": ariaRequired,
      name,
      autoComplete,
      size,
      // ============= By Index =============
      id: getProp(id),
      value: getProp(valueTexts) || "",
      invalid: getProp(invalid),
      placeholder: getProp(placeholder),
      active: activeIndex === index,
      helped: allHelp || activeHelp && activeIndex === index,
      disabled: getProp(disabled),
      onFocus: function onFocus(event) {
        _onFocus(event, index);
      },
      onBlur: function onBlur(event) {
        _onBlur(event, index);
      },
      onSubmit,
      // Get validate text value
      onChange: function onChange(text) {
        onInputChange();
        var parsed = _validateFormat(text);
        if (parsed) {
          onInvalid(false, index);
          _onChange(parsed, index);
          return;
        }
        onInvalid(!!text, index);
      },
      onHelp: function onHelp() {
        onOpenChange(true, {
          index
        });
      },
      onKeyDown: function onKeyDown(event) {
        var prevented = false;
        _onKeyDown === null || _onKeyDown === void 0 || _onKeyDown(event, function() {
          prevented = true;
        });
        if (!event.defaultPrevented && !prevented) {
          switch (event.key) {
            case "Escape":
              onOpenChange(false, {
                index
              });
              break;
            case "Enter":
              if (!open) {
                onOpenChange(true);
              }
              break;
          }
        }
      }
    }, postProps === null || postProps === void 0 ? void 0 : postProps({
      valueTexts
    }));
    Object.keys(inputProps).forEach(function(key) {
      if (inputProps[key] === void 0) {
        delete inputProps[key];
      }
    });
    return inputProps;
  };
  return [getInputProps, getText];
}
var propNames = ["onMouseEnter", "onMouseLeave"];
function useRootProps(props) {
  return reactExports.useMemo(function() {
    return pickProps(props, propNames);
  }, [props]);
}
var _excluded$3 = ["icon", "type"], _excluded2$1 = ["onClear"];
function Icon(props) {
  var icon = props.icon, type = props.type, restProps = _objectWithoutProperties(props, _excluded$3);
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls;
  return icon ? /* @__PURE__ */ reactExports.createElement("span", _extends({
    className: "".concat(prefixCls, "-").concat(type)
  }, restProps), icon) : null;
}
function ClearIcon(_ref) {
  var onClear = _ref.onClear, restProps = _objectWithoutProperties(_ref, _excluded2$1);
  return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, restProps, {
    type: "clear",
    role: "button",
    onMouseDown: function onMouseDown(e) {
      e.preventDefault();
    },
    onClick: function onClick(e) {
      e.stopPropagation();
      onClear();
    }
  }));
}
var FORMAT_KEYS = ["YYYY", "MM", "DD", "HH", "mm", "ss", "SSS"];
var REPLACE_KEY = "顧";
var MaskFormat = /* @__PURE__ */ function() {
  function MaskFormat2(format2) {
    _classCallCheck(this, MaskFormat2);
    _defineProperty(this, "format", void 0);
    _defineProperty(this, "maskFormat", void 0);
    _defineProperty(this, "cells", void 0);
    _defineProperty(this, "maskCells", void 0);
    this.format = format2;
    var replaceKeys = FORMAT_KEYS.map(function(key) {
      return "(".concat(key, ")");
    }).join("|");
    var replaceReg = new RegExp(replaceKeys, "g");
    this.maskFormat = format2.replace(
      replaceReg,
      // Use Chinese character to avoid user use it in format
      function(key) {
        return REPLACE_KEY.repeat(key.length);
      }
    );
    var cellReg = new RegExp("(".concat(FORMAT_KEYS.join("|"), ")"));
    var strCells = (format2.split(cellReg) || []).filter(function(str) {
      return str;
    });
    var offset = 0;
    this.cells = strCells.map(function(text) {
      var mask = FORMAT_KEYS.includes(text);
      var start = offset;
      var end = offset + text.length;
      offset = end;
      return {
        text,
        mask,
        start,
        end
      };
    });
    this.maskCells = this.cells.filter(function(cell) {
      return cell.mask;
    });
  }
  _createClass(MaskFormat2, [{
    key: "getSelection",
    value: function getSelection(maskCellIndex) {
      var _ref = this.maskCells[maskCellIndex] || {}, start = _ref.start, end = _ref.end;
      return [start || 0, end || 0];
    }
    /** Check given text match format */
  }, {
    key: "match",
    value: function match(text) {
      for (var i = 0; i < this.maskFormat.length; i += 1) {
        var maskChar = this.maskFormat[i];
        var textChar = text[i];
        if (!textChar || maskChar !== REPLACE_KEY && maskChar !== textChar) {
          return false;
        }
      }
      return true;
    }
    /** Get mask cell count */
  }, {
    key: "size",
    value: function size() {
      return this.maskCells.length;
    }
  }, {
    key: "getMaskCellIndex",
    value: function getMaskCellIndex(anchorIndex) {
      var closetDist = Number.MAX_SAFE_INTEGER;
      var closetIndex = 0;
      for (var i = 0; i < this.maskCells.length; i += 1) {
        var _this$maskCells$i = this.maskCells[i], start = _this$maskCells$i.start, end = _this$maskCells$i.end;
        if (anchorIndex >= start && anchorIndex <= end) {
          return i;
        }
        var dist = Math.min(Math.abs(anchorIndex - start), Math.abs(anchorIndex - end));
        if (dist < closetDist) {
          closetDist = dist;
          closetIndex = i;
        }
      }
      return closetIndex;
    }
  }]);
  return MaskFormat2;
}();
function getMaskRange(key) {
  var PresetRange = {
    YYYY: [0, 9999, (/* @__PURE__ */ new Date()).getFullYear()],
    MM: [1, 12],
    DD: [1, 31],
    HH: [0, 23],
    mm: [0, 59],
    ss: [0, 59],
    SSS: [0, 999]
  };
  return PresetRange[key];
}
var _excluded$2 = ["active", "showActiveCls", "suffixIcon", "format", "validateFormat", "onChange", "onInput", "helped", "onHelp", "onSubmit", "onKeyDown", "preserveInvalidOnBlur", "invalid", "clearIcon"];
var Input = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var active = props.active, _props$showActiveCls = props.showActiveCls, showActiveCls = _props$showActiveCls === void 0 ? true : _props$showActiveCls, suffixIcon = props.suffixIcon, format2 = props.format, validateFormat = props.validateFormat, onChange = props.onChange;
  props.onInput;
  var helped = props.helped, onHelp = props.onHelp, onSubmit = props.onSubmit, onKeyDown = props.onKeyDown, _props$preserveInvali = props.preserveInvalidOnBlur, preserveInvalidOnBlur = _props$preserveInvali === void 0 ? false : _props$preserveInvali, invalid = props.invalid, clearIcon = props.clearIcon, restProps = _objectWithoutProperties(props, _excluded$2);
  var value = props.value, onFocus = props.onFocus, onBlur = props.onBlur, onMouseUp = props.onMouseUp;
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls, _React$useContext$inp = _React$useContext.input, Component = _React$useContext$inp === void 0 ? "input" : _React$useContext$inp;
  var inputPrefixCls = "".concat(prefixCls, "-input");
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), focused = _React$useState2[0], setFocused = _React$useState2[1];
  var _React$useState3 = reactExports.useState(value), _React$useState4 = _slicedToArray(_React$useState3, 2), internalInputValue = _React$useState4[0], setInputValue = _React$useState4[1];
  var _React$useState5 = reactExports.useState(""), _React$useState6 = _slicedToArray(_React$useState5, 2), focusCellText = _React$useState6[0], setFocusCellText = _React$useState6[1];
  var _React$useState7 = reactExports.useState(null), _React$useState8 = _slicedToArray(_React$useState7, 2), focusCellIndex = _React$useState8[0], setFocusCellIndex = _React$useState8[1];
  var _React$useState9 = reactExports.useState(null), _React$useState10 = _slicedToArray(_React$useState9, 2), forceSelectionSyncMark = _React$useState10[0], forceSelectionSync = _React$useState10[1];
  var inputValue = internalInputValue || "";
  reactExports.useEffect(function() {
    setInputValue(value);
  }, [value]);
  var holderRef = reactExports.useRef();
  var inputRef = reactExports.useRef();
  reactExports.useImperativeHandle(ref, function() {
    return {
      nativeElement: holderRef.current,
      inputElement: inputRef.current,
      focus: function focus(options) {
        inputRef.current.focus(options);
      },
      blur: function blur() {
        inputRef.current.blur();
      }
    };
  });
  var maskFormat = reactExports.useMemo(function() {
    return new MaskFormat(format2 || "");
  }, [format2]);
  var _React$useMemo = reactExports.useMemo(function() {
    if (helped) {
      return [0, 0];
    }
    return maskFormat.getSelection(focusCellIndex);
  }, [maskFormat, focusCellIndex, helped]), _React$useMemo2 = _slicedToArray(_React$useMemo, 2), selectionStart = _React$useMemo2[0], selectionEnd = _React$useMemo2[1];
  var onModify = function onModify2(text) {
    if (text && text !== format2 && text !== value) {
      onHelp();
    }
  };
  var triggerInputChange = useEvent(function(text) {
    if (validateFormat(text)) {
      onChange(text);
    }
    setInputValue(text);
    onModify(text);
  });
  var onInternalChange = function onInternalChange2(event) {
    if (!format2) {
      var text = event.target.value;
      onModify(text);
      setInputValue(text);
      onChange(text);
    }
  };
  var onFormatPaste = function onFormatPaste2(event) {
    var pasteText = event.clipboardData.getData("text");
    if (validateFormat(pasteText)) {
      triggerInputChange(pasteText);
    }
  };
  var mouseDownRef = reactExports.useRef(false);
  var onFormatMouseDown = function onFormatMouseDown2() {
    mouseDownRef.current = true;
  };
  var onFormatMouseUp = function onFormatMouseUp2(event) {
    var _ref = event.target, start = _ref.selectionStart;
    var closeMaskIndex = maskFormat.getMaskCellIndex(start);
    setFocusCellIndex(closeMaskIndex);
    forceSelectionSync({});
    onMouseUp === null || onMouseUp === void 0 || onMouseUp(event);
    mouseDownRef.current = false;
  };
  var onFormatFocus = function onFormatFocus2(event) {
    setFocused(true);
    setFocusCellIndex(0);
    setFocusCellText("");
    onFocus(event);
  };
  var onSharedBlur = function onSharedBlur2(event) {
    onBlur(event);
  };
  var onFormatBlur = function onFormatBlur2(event) {
    setFocused(false);
    onSharedBlur(event);
  };
  useLockEffect(active, function() {
    if (!active && !preserveInvalidOnBlur) {
      setInputValue(value);
    }
  });
  var onSharedKeyDown = function onSharedKeyDown2(event) {
    if (event.key === "Enter" && validateFormat(inputValue)) {
      onSubmit();
    }
    onKeyDown === null || onKeyDown === void 0 || onKeyDown(event);
  };
  var onFormatKeyDown = function onFormatKeyDown2(event) {
    onSharedKeyDown(event);
    var key = event.key;
    var nextCellText = null;
    var nextFillText = null;
    var maskCellLen = selectionEnd - selectionStart;
    var cellFormat = format2.slice(selectionStart, selectionEnd);
    var offsetCellIndex = function offsetCellIndex2(offset) {
      setFocusCellIndex(function(idx) {
        var nextIndex = idx + offset;
        nextIndex = Math.max(nextIndex, 0);
        nextIndex = Math.min(nextIndex, maskFormat.size() - 1);
        return nextIndex;
      });
    };
    var offsetCellValue = function offsetCellValue2(offset) {
      var _getMaskRange = getMaskRange(cellFormat), _getMaskRange2 = _slicedToArray(_getMaskRange, 3), rangeStart = _getMaskRange2[0], rangeEnd = _getMaskRange2[1], rangeDefault = _getMaskRange2[2];
      var currentText = inputValue.slice(selectionStart, selectionEnd);
      var currentTextNum = Number(currentText);
      if (isNaN(currentTextNum)) {
        return String(rangeDefault ? rangeDefault : offset > 0 ? rangeStart : rangeEnd);
      }
      var num = currentTextNum + offset;
      var range = rangeEnd - rangeStart + 1;
      return String(rangeStart + (range + num - rangeStart) % range);
    };
    switch (key) {
      case "Backspace":
      case "Delete":
        nextCellText = "";
        nextFillText = cellFormat;
        break;
      case "ArrowLeft":
        nextCellText = "";
        offsetCellIndex(-1);
        break;
      case "ArrowRight":
        nextCellText = "";
        offsetCellIndex(1);
        break;
      case "ArrowUp":
        nextCellText = "";
        nextFillText = offsetCellValue(1);
        break;
      case "ArrowDown":
        nextCellText = "";
        nextFillText = offsetCellValue(-1);
        break;
      default:
        if (!isNaN(Number(key))) {
          nextCellText = focusCellText + key;
          nextFillText = nextCellText;
        }
        break;
    }
    if (nextCellText !== null) {
      setFocusCellText(nextCellText);
      if (nextCellText.length >= maskCellLen) {
        offsetCellIndex(1);
        setFocusCellText("");
      }
    }
    if (nextFillText !== null) {
      var nextFocusValue = (
        // before
        inputValue.slice(0, selectionStart) + // replace
        leftPad(nextFillText, maskCellLen) + // after
        inputValue.slice(selectionEnd)
      );
      triggerInputChange(nextFocusValue.slice(0, format2.length));
    }
    forceSelectionSync({});
  };
  var rafRef = reactExports.useRef();
  useLayoutEffect(function() {
    if (!focused || !format2 || mouseDownRef.current) {
      return;
    }
    if (!maskFormat.match(inputValue)) {
      triggerInputChange(format2);
      return;
    }
    inputRef.current.setSelectionRange(selectionStart, selectionEnd);
    rafRef.current = wrapperRaf(function() {
      inputRef.current.setSelectionRange(selectionStart, selectionEnd);
    });
    return function() {
      wrapperRaf.cancel(rafRef.current);
    };
  }, [maskFormat, format2, focused, inputValue, focusCellIndex, selectionStart, selectionEnd, forceSelectionSyncMark, triggerInputChange]);
  var inputProps = format2 ? {
    onFocus: onFormatFocus,
    onBlur: onFormatBlur,
    onKeyDown: onFormatKeyDown,
    onMouseDown: onFormatMouseDown,
    onMouseUp: onFormatMouseUp,
    onPaste: onFormatPaste
  } : {};
  return /* @__PURE__ */ reactExports.createElement("div", {
    ref: holderRef,
    className: classNames(inputPrefixCls, _defineProperty(_defineProperty({}, "".concat(inputPrefixCls, "-active"), active && showActiveCls), "".concat(inputPrefixCls, "-placeholder"), helped))
  }, /* @__PURE__ */ reactExports.createElement(Component, _extends({
    ref: inputRef,
    "aria-invalid": invalid,
    autoComplete: "off"
  }, restProps, {
    onKeyDown: onSharedKeyDown,
    onBlur: onSharedBlur
    // Replace with format
  }, inputProps, {
    // Value
    value: inputValue,
    onChange: onInternalChange
  })), /* @__PURE__ */ reactExports.createElement(Icon, {
    type: "suffix",
    icon: suffixIcon
  }), clearIcon);
});
var _excluded$1 = ["id", "prefix", "clearIcon", "suffixIcon", "separator", "activeIndex", "activeHelp", "allHelp", "focused", "onFocus", "onBlur", "onKeyDown", "locale", "generateConfig", "placeholder", "className", "style", "onClick", "onClear", "value", "onChange", "onSubmit", "onInputChange", "format", "maskFormat", "preserveInvalidOnBlur", "onInvalid", "disabled", "invalid", "inputReadOnly", "direction", "onOpenChange", "onActiveInfo", "placement", "onMouseDown", "required", "aria-required", "autoFocus", "tabIndex"], _excluded2 = ["index"];
function RangeSelector(props, ref) {
  var id = props.id, prefix = props.prefix, clearIcon = props.clearIcon, suffixIcon = props.suffixIcon, _props$separator = props.separator, separator = _props$separator === void 0 ? "~" : _props$separator, activeIndex = props.activeIndex;
  props.activeHelp;
  props.allHelp;
  var focused = props.focused;
  props.onFocus;
  props.onBlur;
  props.onKeyDown;
  props.locale;
  props.generateConfig;
  var placeholder = props.placeholder, className = props.className, style = props.style, onClick = props.onClick, onClear = props.onClear, value = props.value;
  props.onChange;
  props.onSubmit;
  props.onInputChange;
  props.format;
  props.maskFormat;
  props.preserveInvalidOnBlur;
  props.onInvalid;
  var disabled = props.disabled, invalid = props.invalid;
  props.inputReadOnly;
  var direction = props.direction;
  props.onOpenChange;
  var onActiveInfo = props.onActiveInfo;
  props.placement;
  var _onMouseDown = props.onMouseDown;
  props.required;
  props["aria-required"];
  var autoFocus = props.autoFocus, tabIndex = props.tabIndex, restProps = _objectWithoutProperties(props, _excluded$1);
  var rtl = direction === "rtl";
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls;
  var ids = reactExports.useMemo(function() {
    if (typeof id === "string") {
      return [id];
    }
    var mergedId = id || {};
    return [mergedId.start, mergedId.end];
  }, [id]);
  var rootRef = reactExports.useRef();
  var inputStartRef = reactExports.useRef();
  var inputEndRef = reactExports.useRef();
  var getInput = function getInput2(index) {
    var _index;
    return (_index = [inputStartRef, inputEndRef][index]) === null || _index === void 0 ? void 0 : _index.current;
  };
  reactExports.useImperativeHandle(ref, function() {
    return {
      nativeElement: rootRef.current,
      focus: function focus(options) {
        if (_typeof(options) === "object") {
          var _getInput;
          var _ref = options || {}, _ref$index = _ref.index, _index2 = _ref$index === void 0 ? 0 : _ref$index, rest = _objectWithoutProperties(_ref, _excluded2);
          (_getInput = getInput(_index2)) === null || _getInput === void 0 || _getInput.focus(rest);
        } else {
          var _getInput2;
          (_getInput2 = getInput(options !== null && options !== void 0 ? options : 0)) === null || _getInput2 === void 0 || _getInput2.focus();
        }
      },
      blur: function blur() {
        var _getInput3, _getInput4;
        (_getInput3 = getInput(0)) === null || _getInput3 === void 0 || _getInput3.blur();
        (_getInput4 = getInput(1)) === null || _getInput4 === void 0 || _getInput4.blur();
      }
    };
  });
  var rootProps = useRootProps(restProps);
  var mergedPlaceholder = reactExports.useMemo(function() {
    return Array.isArray(placeholder) ? placeholder : [placeholder, placeholder];
  }, [placeholder]);
  var _useInputProps = useInputProps(_objectSpread2(_objectSpread2({}, props), {}, {
    id: ids,
    placeholder: mergedPlaceholder
  })), _useInputProps2 = _slicedToArray(_useInputProps, 1), getInputProps = _useInputProps2[0];
  var _React$useState = reactExports.useState({
    position: "absolute",
    width: 0
  }), _React$useState2 = _slicedToArray(_React$useState, 2), activeBarStyle = _React$useState2[0], setActiveBarStyle = _React$useState2[1];
  var syncActiveOffset = useEvent(function() {
    var input = getInput(activeIndex);
    if (input) {
      var inputRect = input.nativeElement.getBoundingClientRect();
      var parentRect = rootRef.current.getBoundingClientRect();
      var rectOffset = inputRect.left - parentRect.left;
      setActiveBarStyle(function(ori) {
        return _objectSpread2(_objectSpread2({}, ori), {}, {
          width: inputRect.width,
          left: rectOffset
        });
      });
      onActiveInfo([inputRect.left, inputRect.right, parentRect.width]);
    }
  });
  reactExports.useEffect(function() {
    syncActiveOffset();
  }, [activeIndex]);
  var showClear = clearIcon && (value[0] && !disabled[0] || value[1] && !disabled[1]);
  var startAutoFocus = autoFocus && !disabled[0];
  var endAutoFocus = autoFocus && !startAutoFocus && !disabled[1];
  return /* @__PURE__ */ reactExports.createElement(RefResizeObserver, {
    onResize: syncActiveOffset
  }, /* @__PURE__ */ reactExports.createElement("div", _extends({}, rootProps, {
    className: classNames(prefixCls, "".concat(prefixCls, "-range"), _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(prefixCls, "-focused"), focused), "".concat(prefixCls, "-disabled"), disabled.every(function(i) {
      return i;
    })), "".concat(prefixCls, "-invalid"), invalid.some(function(i) {
      return i;
    })), "".concat(prefixCls, "-rtl"), rtl), className),
    style,
    ref: rootRef,
    onClick,
    onMouseDown: function onMouseDown(e) {
      var target = e.target;
      if (target !== inputStartRef.current.inputElement && target !== inputEndRef.current.inputElement) {
        e.preventDefault();
      }
      _onMouseDown === null || _onMouseDown === void 0 || _onMouseDown(e);
    }
  }), prefix && /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-prefix")
  }, prefix), /* @__PURE__ */ reactExports.createElement(Input, _extends({
    ref: inputStartRef
  }, getInputProps(0), {
    autoFocus: startAutoFocus,
    tabIndex,
    "date-range": "start"
  })), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-range-separator")
  }, separator), /* @__PURE__ */ reactExports.createElement(Input, _extends({
    ref: inputEndRef
  }, getInputProps(1), {
    autoFocus: endAutoFocus,
    tabIndex,
    "date-range": "end"
  })), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-active-bar"),
    style: activeBarStyle
  }), /* @__PURE__ */ reactExports.createElement(Icon, {
    type: "suffix",
    icon: suffixIcon
  }), showClear && /* @__PURE__ */ reactExports.createElement(ClearIcon, {
    icon: clearIcon,
    onClear
  })));
}
var RefRangeSelector = /* @__PURE__ */ reactExports.forwardRef(RangeSelector);
function separateConfig(config, defaultConfig) {
  var singleConfig = config !== null && config !== void 0 ? config : defaultConfig;
  if (Array.isArray(singleConfig)) {
    return singleConfig;
  }
  return [singleConfig, singleConfig];
}
function getActiveRange(activeIndex) {
  return activeIndex === 1 ? "end" : "start";
}
function RangePicker(props, ref) {
  var _useFilledProps = useFilledProps(props, function() {
    var disabled2 = props.disabled, allowEmpty2 = props.allowEmpty;
    var mergedDisabled = separateConfig(disabled2, false);
    var mergedAllowEmpty = separateConfig(allowEmpty2, false);
    return {
      disabled: mergedDisabled,
      allowEmpty: mergedAllowEmpty
    };
  }), _useFilledProps2 = _slicedToArray(_useFilledProps, 6), filledProps = _useFilledProps2[0], internalPicker = _useFilledProps2[1], complexPicker = _useFilledProps2[2], formatList = _useFilledProps2[3], maskFormat = _useFilledProps2[4], isInvalidateDate = _useFilledProps2[5];
  var prefixCls = filledProps.prefixCls, styles = filledProps.styles, classNames2 = filledProps.classNames, defaultValue = filledProps.defaultValue, value = filledProps.value, needConfirm = filledProps.needConfirm, onKeyDown = filledProps.onKeyDown, disabled = filledProps.disabled, allowEmpty = filledProps.allowEmpty, disabledDate = filledProps.disabledDate, minDate = filledProps.minDate, maxDate = filledProps.maxDate, defaultOpen = filledProps.defaultOpen, open = filledProps.open, onOpenChange = filledProps.onOpenChange, locale2 = filledProps.locale, generateConfig2 = filledProps.generateConfig, picker = filledProps.picker, showNow = filledProps.showNow, showToday = filledProps.showToday, showTime = filledProps.showTime, mode = filledProps.mode, onPanelChange = filledProps.onPanelChange, onCalendarChange = filledProps.onCalendarChange, onOk = filledProps.onOk, defaultPickerValue = filledProps.defaultPickerValue, pickerValue = filledProps.pickerValue, onPickerValueChange = filledProps.onPickerValueChange, inputReadOnly = filledProps.inputReadOnly, suffixIcon = filledProps.suffixIcon, onFocus = filledProps.onFocus, onBlur = filledProps.onBlur, presets = filledProps.presets, ranges = filledProps.ranges, components = filledProps.components, cellRender = filledProps.cellRender, dateRender = filledProps.dateRender, monthCellRender = filledProps.monthCellRender, onClick = filledProps.onClick;
  var selectorRef = usePickerRef(ref);
  var _useOpen = useOpen(open, defaultOpen, disabled, onOpenChange), _useOpen2 = _slicedToArray(_useOpen, 2), mergedOpen = _useOpen2[0], setMergeOpen = _useOpen2[1];
  var triggerOpen = function triggerOpen2(nextOpen, config) {
    if (disabled.some(function(fieldDisabled) {
      return !fieldDisabled;
    }) || !nextOpen) {
      setMergeOpen(nextOpen, config);
    }
  };
  var _useInnerValue = useInnerValue(generateConfig2, locale2, formatList, true, false, defaultValue, value, onCalendarChange, onOk), _useInnerValue2 = _slicedToArray(_useInnerValue, 5), mergedValue = _useInnerValue2[0], setInnerValue = _useInnerValue2[1], getCalendarValue = _useInnerValue2[2], triggerCalendarChange = _useInnerValue2[3], triggerOk = _useInnerValue2[4];
  var calendarValue = getCalendarValue();
  var _useRangeActive = useRangeActive(disabled, allowEmpty, mergedOpen), _useRangeActive2 = _slicedToArray(_useRangeActive, 9), focused = _useRangeActive2[0], triggerFocus = _useRangeActive2[1], lastOperation = _useRangeActive2[2], activeIndex = _useRangeActive2[3], setActiveIndex = _useRangeActive2[4], nextActiveIndex = _useRangeActive2[5], activeIndexList = _useRangeActive2[6], updateSubmitIndex = _useRangeActive2[7], hasActiveSubmitValue = _useRangeActive2[8];
  var onSharedFocus = function onSharedFocus2(event, index) {
    triggerFocus(true);
    onFocus === null || onFocus === void 0 || onFocus(event, {
      range: getActiveRange(index !== null && index !== void 0 ? index : activeIndex)
    });
  };
  var onSharedBlur = function onSharedBlur2(event, index) {
    triggerFocus(false);
    onBlur === null || onBlur === void 0 || onBlur(event, {
      range: getActiveRange(index !== null && index !== void 0 ? index : activeIndex)
    });
  };
  var mergedShowTime = reactExports.useMemo(function() {
    if (!showTime) {
      return null;
    }
    var disabledTime = showTime.disabledTime;
    var proxyDisabledTime = disabledTime ? function(date) {
      var range = getActiveRange(activeIndex);
      var fromDate = getFromDate(calendarValue, activeIndexList, activeIndex);
      return disabledTime(date, range, {
        from: fromDate
      });
    } : void 0;
    return _objectSpread2(_objectSpread2({}, showTime), {}, {
      disabledTime: proxyDisabledTime
    });
  }, [showTime, activeIndex, calendarValue, activeIndexList]);
  var _useMergedState = useMergedState([picker, picker], {
    value: mode
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), modes = _useMergedState2[0], setModes = _useMergedState2[1];
  var mergedMode = modes[activeIndex] || picker;
  var internalMode = mergedMode === "date" && mergedShowTime ? "datetime" : mergedMode;
  var multiplePanel = internalMode === picker && internalMode !== "time";
  var mergedShowNow = useShowNow(picker, mergedMode, showNow, showToday, true);
  var _useRangeValue = useRangeValue(filledProps, mergedValue, setInnerValue, getCalendarValue, triggerCalendarChange, disabled, formatList, focused, mergedOpen, isInvalidateDate), _useRangeValue2 = _slicedToArray(_useRangeValue, 2), flushSubmit = _useRangeValue2[0], triggerSubmitChange = _useRangeValue2[1];
  var mergedDisabledDate = useRangeDisabledDate(calendarValue, disabled, activeIndexList, generateConfig2, locale2, disabledDate);
  var _useFieldsInvalidate = useFieldsInvalidate(calendarValue, isInvalidateDate, allowEmpty), _useFieldsInvalidate2 = _slicedToArray(_useFieldsInvalidate, 2), submitInvalidates = _useFieldsInvalidate2[0], onSelectorInvalid = _useFieldsInvalidate2[1];
  var _useRangePickerValue = useRangePickerValue(generateConfig2, locale2, calendarValue, modes, mergedOpen, activeIndex, internalPicker, multiplePanel, defaultPickerValue, pickerValue, mergedShowTime === null || mergedShowTime === void 0 ? void 0 : mergedShowTime.defaultOpenValue, onPickerValueChange, minDate, maxDate), _useRangePickerValue2 = _slicedToArray(_useRangePickerValue, 2), currentPickerValue = _useRangePickerValue2[0], setCurrentPickerValue = _useRangePickerValue2[1];
  var triggerModeChange = useEvent(function(nextPickerValue, nextMode, triggerEvent) {
    var clone = fillIndex(modes, activeIndex, nextMode);
    if (clone[0] !== modes[0] || clone[1] !== modes[1]) {
      setModes(clone);
    }
    if (onPanelChange && triggerEvent !== false) {
      var clonePickerValue = _toConsumableArray(calendarValue);
      if (nextPickerValue) {
        clonePickerValue[activeIndex] = nextPickerValue;
      }
      onPanelChange(clonePickerValue, clone);
    }
  });
  var fillCalendarValue = function fillCalendarValue2(date, index) {
    return (
      // Trigger change only when date changed
      fillIndex(calendarValue, index, date)
    );
  };
  var triggerPartConfirm = function triggerPartConfirm2(date, skipFocus) {
    var nextValue = calendarValue;
    if (date) {
      nextValue = fillCalendarValue(date, activeIndex);
    }
    updateSubmitIndex(activeIndex);
    var nextIndex = nextActiveIndex(nextValue);
    triggerCalendarChange(nextValue);
    flushSubmit(activeIndex, nextIndex === null);
    if (nextIndex === null) {
      triggerOpen(false, {
        force: true
      });
    } else if (!skipFocus) {
      selectorRef.current.focus({
        index: nextIndex
      });
    }
  };
  var onSelectorClick = function onSelectorClick2(event) {
    var _activeElement;
    var rootNode = event.target.getRootNode();
    if (!selectorRef.current.nativeElement.contains((_activeElement = rootNode.activeElement) !== null && _activeElement !== void 0 ? _activeElement : document.activeElement)) {
      var enabledIndex = disabled.findIndex(function(d) {
        return !d;
      });
      if (enabledIndex >= 0) {
        selectorRef.current.focus({
          index: enabledIndex
        });
      }
    }
    triggerOpen(true);
    onClick === null || onClick === void 0 || onClick(event);
  };
  var onSelectorClear = function onSelectorClear2() {
    triggerSubmitChange(null);
    triggerOpen(false, {
      force: true
    });
  };
  var _React$useState = reactExports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), hoverSource = _React$useState2[0], setHoverSource = _React$useState2[1];
  var _React$useState3 = reactExports.useState(null), _React$useState4 = _slicedToArray(_React$useState3, 2), internalHoverValues = _React$useState4[0], setInternalHoverValues = _React$useState4[1];
  var hoverValues = reactExports.useMemo(function() {
    return internalHoverValues || calendarValue;
  }, [calendarValue, internalHoverValues]);
  reactExports.useEffect(function() {
    if (!mergedOpen) {
      setInternalHoverValues(null);
    }
  }, [mergedOpen]);
  var _React$useState5 = reactExports.useState([0, 0, 0]), _React$useState6 = _slicedToArray(_React$useState5, 2), activeInfo = _React$useState6[0], setActiveInfo = _React$useState6[1];
  var presetList = usePresets(presets, ranges);
  var onPresetHover = function onPresetHover2(nextValues) {
    setInternalHoverValues(nextValues);
    setHoverSource("preset");
  };
  var onPresetSubmit = function onPresetSubmit2(nextValues) {
    var passed = triggerSubmitChange(nextValues);
    if (passed) {
      triggerOpen(false, {
        force: true
      });
    }
  };
  var onNow = function onNow2(now) {
    triggerPartConfirm(now);
  };
  var onPanelHover = function onPanelHover2(date) {
    setInternalHoverValues(date ? fillCalendarValue(date, activeIndex) : null);
    setHoverSource("cell");
  };
  var onPanelFocus = function onPanelFocus2(event) {
    triggerOpen(true);
    onSharedFocus(event);
  };
  var onPanelMouseDown = function onPanelMouseDown2() {
    lastOperation("panel");
  };
  var onPanelSelect = function onPanelSelect2(date) {
    var clone = fillIndex(calendarValue, activeIndex, date);
    triggerCalendarChange(clone);
    if (!needConfirm && !complexPicker && internalPicker === internalMode) {
      triggerPartConfirm(date);
    }
  };
  var onPopupClose = function onPopupClose2() {
    triggerOpen(false);
  };
  var onInternalCellRender = useCellRender(cellRender, dateRender, monthCellRender, getActiveRange(activeIndex));
  var panelValue = calendarValue[activeIndex] || null;
  var isPopupInvalidateDate = useEvent(function(date) {
    return isInvalidateDate(date, {
      activeIndex
    });
  });
  var panelProps = reactExports.useMemo(function() {
    var domProps = pickAttrs(filledProps, false);
    var restProps = omit(filledProps, [].concat(_toConsumableArray(Object.keys(domProps)), ["onChange", "onCalendarChange", "style", "className", "onPanelChange", "disabledTime"]));
    return restProps;
  }, [filledProps]);
  var panel = /* @__PURE__ */ reactExports.createElement(Popup, _extends({}, panelProps, {
    showNow: mergedShowNow,
    showTime: mergedShowTime,
    range: true,
    multiplePanel,
    activeInfo,
    disabledDate: mergedDisabledDate,
    onFocus: onPanelFocus,
    onBlur: onSharedBlur,
    onPanelMouseDown,
    picker,
    mode: mergedMode,
    internalMode,
    onPanelChange: triggerModeChange,
    format: maskFormat,
    value: panelValue,
    isInvalid: isPopupInvalidateDate,
    onChange: null,
    onSelect: onPanelSelect,
    pickerValue: currentPickerValue,
    defaultOpenValue: toArray(showTime === null || showTime === void 0 ? void 0 : showTime.defaultOpenValue)[activeIndex],
    onPickerValueChange: setCurrentPickerValue,
    hoverValue: hoverValues,
    onHover: onPanelHover,
    needConfirm,
    onSubmit: triggerPartConfirm,
    onOk: triggerOk,
    presets: presetList,
    onPresetHover,
    onPresetSubmit,
    onNow,
    cellRender: onInternalCellRender
  }));
  var onSelectorChange = function onSelectorChange2(date, index) {
    var clone = fillCalendarValue(date, index);
    triggerCalendarChange(clone);
  };
  var onSelectorInputChange = function onSelectorInputChange2() {
    lastOperation("input");
  };
  var onSelectorFocus = function onSelectorFocus2(event, index) {
    var activeListLen = activeIndexList.length;
    var lastActiveIndex = activeIndexList[activeListLen - 1];
    if (activeListLen && lastActiveIndex !== index && needConfirm && // Not change index if is not filled
    !allowEmpty[lastActiveIndex] && !hasActiveSubmitValue(lastActiveIndex) && calendarValue[lastActiveIndex]) {
      selectorRef.current.focus({
        index: lastActiveIndex
      });
      return;
    }
    lastOperation("input");
    triggerOpen(true, {
      inherit: true
    });
    if (activeIndex !== index && mergedOpen && !needConfirm && complexPicker) {
      triggerPartConfirm(null, true);
    }
    setActiveIndex(index);
    onSharedFocus(event, index);
  };
  var onSelectorBlur = function onSelectorBlur2(event, index) {
    triggerOpen(false);
    if (!needConfirm && lastOperation() === "input") {
      var nextIndex = nextActiveIndex(calendarValue);
      flushSubmit(activeIndex, nextIndex === null);
    }
    onSharedBlur(event, index);
  };
  var onSelectorKeyDown = function onSelectorKeyDown2(event, preventDefault) {
    if (event.key === "Tab") {
      triggerPartConfirm(null, true);
    }
    onKeyDown === null || onKeyDown === void 0 || onKeyDown(event, preventDefault);
  };
  var context = reactExports.useMemo(function() {
    return {
      prefixCls,
      locale: locale2,
      generateConfig: generateConfig2,
      button: components.button,
      input: components.input
    };
  }, [prefixCls, locale2, generateConfig2, components.button, components.input]);
  useLayoutEffect(function() {
    if (mergedOpen && activeIndex !== void 0) {
      triggerModeChange(null, picker, false);
    }
  }, [mergedOpen, activeIndex, picker]);
  useLayoutEffect(function() {
    var lastOp = lastOperation();
    if (!mergedOpen && lastOp === "input") {
      triggerOpen(false);
      triggerPartConfirm(null, true);
    }
    if (!mergedOpen && complexPicker && !needConfirm && lastOp === "panel") {
      triggerOpen(true);
      triggerPartConfirm();
    }
  }, [mergedOpen]);
  return /* @__PURE__ */ reactExports.createElement(PickerContext.Provider, {
    value: context
  }, /* @__PURE__ */ reactExports.createElement(PickerTrigger, _extends({}, pickTriggerProps(filledProps), {
    popupElement: panel,
    popupStyle: styles.popup,
    popupClassName: classNames2.popup,
    visible: mergedOpen,
    onClose: onPopupClose,
    range: true
  }), /* @__PURE__ */ reactExports.createElement(
    RefRangeSelector,
    _extends({}, filledProps, {
      // Ref
      ref: selectorRef,
      suffixIcon,
      activeIndex: focused || mergedOpen ? activeIndex : null,
      activeHelp: !!internalHoverValues,
      allHelp: !!internalHoverValues && hoverSource === "preset",
      focused,
      onFocus: onSelectorFocus,
      onBlur: onSelectorBlur,
      onKeyDown: onSelectorKeyDown,
      onSubmit: triggerPartConfirm,
      value: hoverValues,
      maskFormat,
      onChange: onSelectorChange,
      onInputChange: onSelectorInputChange,
      format: formatList,
      inputReadOnly,
      disabled,
      open: mergedOpen,
      onOpenChange: triggerOpen,
      onClick: onSelectorClick,
      onClear: onSelectorClear,
      invalid: submitInvalidates,
      onInvalid: onSelectorInvalid,
      onActiveInfo: setActiveInfo
    })
  )));
}
var RefRangePicker = /* @__PURE__ */ reactExports.forwardRef(RangePicker);
function MultipleDates(props) {
  var prefixCls = props.prefixCls, value = props.value, onRemove = props.onRemove, _props$removeIcon = props.removeIcon, removeIcon = _props$removeIcon === void 0 ? "×" : _props$removeIcon, formatDate = props.formatDate, disabled = props.disabled, maxTagCount = props.maxTagCount, placeholder = props.placeholder;
  var selectorCls = "".concat(prefixCls, "-selector");
  var selectionCls = "".concat(prefixCls, "-selection");
  var overflowCls = "".concat(selectionCls, "-overflow");
  function renderSelector(content, onClose) {
    return /* @__PURE__ */ reactExports.createElement("span", {
      className: classNames("".concat(selectionCls, "-item")),
      title: typeof content === "string" ? content : null
    }, /* @__PURE__ */ reactExports.createElement("span", {
      className: "".concat(selectionCls, "-item-content")
    }, content), !disabled && onClose && /* @__PURE__ */ reactExports.createElement("span", {
      onMouseDown: function onMouseDown(e) {
        e.preventDefault();
      },
      onClick: onClose,
      className: "".concat(selectionCls, "-item-remove")
    }, removeIcon));
  }
  function renderItem(date) {
    var displayLabel = formatDate(date);
    var onClose = function onClose2(event) {
      if (event) event.stopPropagation();
      onRemove(date);
    };
    return renderSelector(displayLabel, onClose);
  }
  function renderRest(omittedValues) {
    var content = "+ ".concat(omittedValues.length, " ...");
    return renderSelector(content);
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: selectorCls
  }, /* @__PURE__ */ reactExports.createElement(ForwardOverflow, {
    prefixCls: overflowCls,
    data: value,
    renderItem,
    renderRest,
    itemKey: function itemKey(date) {
      return formatDate(date);
    },
    maxCount: maxTagCount
  }), !value.length && /* @__PURE__ */ reactExports.createElement("span", {
    className: "".concat(prefixCls, "-selection-placeholder")
  }, placeholder));
}
var _excluded = ["id", "open", "prefix", "clearIcon", "suffixIcon", "activeHelp", "allHelp", "focused", "onFocus", "onBlur", "onKeyDown", "locale", "generateConfig", "placeholder", "className", "style", "onClick", "onClear", "internalPicker", "value", "onChange", "onSubmit", "onInputChange", "multiple", "maxTagCount", "format", "maskFormat", "preserveInvalidOnBlur", "onInvalid", "disabled", "invalid", "inputReadOnly", "direction", "onOpenChange", "onMouseDown", "required", "aria-required", "autoFocus", "tabIndex", "removeIcon"];
function SingleSelector(props, ref) {
  props.id;
  var open = props.open, prefix = props.prefix, clearIcon = props.clearIcon, suffixIcon = props.suffixIcon;
  props.activeHelp;
  props.allHelp;
  var focused = props.focused;
  props.onFocus;
  props.onBlur;
  props.onKeyDown;
  var locale2 = props.locale, generateConfig2 = props.generateConfig, placeholder = props.placeholder, className = props.className, style = props.style, onClick = props.onClick, onClear = props.onClear, internalPicker = props.internalPicker, value = props.value, onChange = props.onChange, onSubmit = props.onSubmit;
  props.onInputChange;
  var multiple = props.multiple, maxTagCount = props.maxTagCount;
  props.format;
  props.maskFormat;
  props.preserveInvalidOnBlur;
  props.onInvalid;
  var disabled = props.disabled, invalid = props.invalid;
  props.inputReadOnly;
  var direction = props.direction;
  props.onOpenChange;
  var _onMouseDown = props.onMouseDown;
  props.required;
  props["aria-required"];
  var autoFocus = props.autoFocus, tabIndex = props.tabIndex, removeIcon = props.removeIcon, restProps = _objectWithoutProperties(props, _excluded);
  var rtl = direction === "rtl";
  var _React$useContext = reactExports.useContext(PickerContext), prefixCls = _React$useContext.prefixCls;
  var rootRef = reactExports.useRef();
  var inputRef = reactExports.useRef();
  reactExports.useImperativeHandle(ref, function() {
    return {
      nativeElement: rootRef.current,
      focus: function focus(options) {
        var _inputRef$current;
        (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 || _inputRef$current.focus(options);
      },
      blur: function blur() {
        var _inputRef$current2;
        (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 || _inputRef$current2.blur();
      }
    };
  });
  var rootProps = useRootProps(restProps);
  var onSingleChange = function onSingleChange2(date) {
    onChange([date]);
  };
  var onMultipleRemove = function onMultipleRemove2(date) {
    var nextValues = value.filter(function(oriDate) {
      return oriDate && !isSame(generateConfig2, locale2, oriDate, date, internalPicker);
    });
    onChange(nextValues);
    if (!open) {
      onSubmit();
    }
  };
  var _useInputProps = useInputProps(_objectSpread2(_objectSpread2({}, props), {}, {
    onChange: onSingleChange
  }), function(_ref) {
    var valueTexts = _ref.valueTexts;
    return {
      value: valueTexts[0] || "",
      active: focused
    };
  }), _useInputProps2 = _slicedToArray(_useInputProps, 2), getInputProps = _useInputProps2[0], getText = _useInputProps2[1];
  var showClear = !!(clearIcon && value.length && !disabled);
  var selectorNode = multiple ? /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(MultipleDates, {
    prefixCls,
    value,
    onRemove: onMultipleRemove,
    formatDate: getText,
    maxTagCount,
    disabled,
    removeIcon,
    placeholder
  }), /* @__PURE__ */ reactExports.createElement("input", {
    className: "".concat(prefixCls, "-multiple-input"),
    value: value.map(getText).join(","),
    ref: inputRef,
    readOnly: true,
    autoFocus,
    tabIndex
  }), /* @__PURE__ */ reactExports.createElement(Icon, {
    type: "suffix",
    icon: suffixIcon
  }), showClear && /* @__PURE__ */ reactExports.createElement(ClearIcon, {
    icon: clearIcon,
    onClear
  })) : /* @__PURE__ */ reactExports.createElement(Input, _extends({
    ref: inputRef
  }, getInputProps(), {
    autoFocus,
    tabIndex,
    suffixIcon,
    clearIcon: showClear && /* @__PURE__ */ reactExports.createElement(ClearIcon, {
      icon: clearIcon,
      onClear
    }),
    showActiveCls: false
  }));
  return /* @__PURE__ */ reactExports.createElement("div", _extends({}, rootProps, {
    className: classNames(prefixCls, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(prefixCls, "-multiple"), multiple), "".concat(prefixCls, "-focused"), focused), "".concat(prefixCls, "-disabled"), disabled), "".concat(prefixCls, "-invalid"), invalid), "".concat(prefixCls, "-rtl"), rtl), className),
    style,
    ref: rootRef,
    onClick,
    onMouseDown: function onMouseDown(e) {
      var _inputRef$current3;
      var target = e.target;
      if (target !== ((_inputRef$current3 = inputRef.current) === null || _inputRef$current3 === void 0 ? void 0 : _inputRef$current3.inputElement)) {
        e.preventDefault();
      }
      _onMouseDown === null || _onMouseDown === void 0 || _onMouseDown(e);
    }
  }), prefix && /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-prefix")
  }, prefix), selectorNode);
}
var RefSingleSelector = /* @__PURE__ */ reactExports.forwardRef(SingleSelector);
function Picker(props, ref) {
  var _useFilledProps = useFilledProps(props), _useFilledProps2 = _slicedToArray(_useFilledProps, 6), filledProps = _useFilledProps2[0], internalPicker = _useFilledProps2[1], complexPicker = _useFilledProps2[2], formatList = _useFilledProps2[3], maskFormat = _useFilledProps2[4], isInvalidateDate = _useFilledProps2[5];
  var _ref = filledProps, prefixCls = _ref.prefixCls, styles = _ref.styles, classNames2 = _ref.classNames, order = _ref.order, defaultValue = _ref.defaultValue, value = _ref.value, needConfirm = _ref.needConfirm, onChange = _ref.onChange, onKeyDown = _ref.onKeyDown, disabled = _ref.disabled, disabledDate = _ref.disabledDate, minDate = _ref.minDate, maxDate = _ref.maxDate, defaultOpen = _ref.defaultOpen, open = _ref.open, onOpenChange = _ref.onOpenChange, locale2 = _ref.locale, generateConfig2 = _ref.generateConfig, picker = _ref.picker, showNow = _ref.showNow, showToday = _ref.showToday, showTime = _ref.showTime, mode = _ref.mode, onPanelChange = _ref.onPanelChange, onCalendarChange = _ref.onCalendarChange, onOk = _ref.onOk, multiple = _ref.multiple, defaultPickerValue = _ref.defaultPickerValue, pickerValue = _ref.pickerValue, onPickerValueChange = _ref.onPickerValueChange, inputReadOnly = _ref.inputReadOnly, suffixIcon = _ref.suffixIcon, removeIcon = _ref.removeIcon, onFocus = _ref.onFocus, onBlur = _ref.onBlur, presets = _ref.presets, components = _ref.components, cellRender = _ref.cellRender, dateRender = _ref.dateRender, monthCellRender = _ref.monthCellRender, onClick = _ref.onClick;
  var selectorRef = usePickerRef(ref);
  function pickerParam(values) {
    if (values === null) {
      return null;
    }
    return multiple ? values : values[0];
  }
  var toggleDates = useToggleDates(generateConfig2, locale2, internalPicker);
  var _useOpen = useOpen(open, defaultOpen, [disabled], onOpenChange), _useOpen2 = _slicedToArray(_useOpen, 2), mergedOpen = _useOpen2[0], triggerOpen = _useOpen2[1];
  var onInternalCalendarChange = function onInternalCalendarChange2(dates, dateStrings, info) {
    if (onCalendarChange) {
      var filteredInfo = _objectSpread2({}, info);
      delete filteredInfo.range;
      onCalendarChange(pickerParam(dates), pickerParam(dateStrings), filteredInfo);
    }
  };
  var onInternalOk = function onInternalOk2(dates) {
    onOk === null || onOk === void 0 || onOk(pickerParam(dates));
  };
  var _useInnerValue = useInnerValue(generateConfig2, locale2, formatList, false, order, defaultValue, value, onInternalCalendarChange, onInternalOk), _useInnerValue2 = _slicedToArray(_useInnerValue, 5), mergedValue = _useInnerValue2[0], setInnerValue = _useInnerValue2[1], getCalendarValue = _useInnerValue2[2], triggerCalendarChange = _useInnerValue2[3], triggerOk = _useInnerValue2[4];
  var calendarValue = getCalendarValue();
  var _useRangeActive = useRangeActive([disabled]), _useRangeActive2 = _slicedToArray(_useRangeActive, 4), focused = _useRangeActive2[0], triggerFocus = _useRangeActive2[1], lastOperation = _useRangeActive2[2], activeIndex = _useRangeActive2[3];
  var onSharedFocus = function onSharedFocus2(event) {
    triggerFocus(true);
    onFocus === null || onFocus === void 0 || onFocus(event, {});
  };
  var onSharedBlur = function onSharedBlur2(event) {
    triggerFocus(false);
    onBlur === null || onBlur === void 0 || onBlur(event, {});
  };
  var _useMergedState = useMergedState(picker, {
    value: mode
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedMode = _useMergedState2[0], setMode = _useMergedState2[1];
  var internalMode = mergedMode === "date" && showTime ? "datetime" : mergedMode;
  var mergedShowNow = useShowNow(picker, mergedMode, showNow, showToday);
  var onInternalChange = onChange && function(dates, dateStrings) {
    onChange(pickerParam(dates), pickerParam(dateStrings));
  };
  var _useRangeValue = useRangeValue(
    _objectSpread2(_objectSpread2({}, filledProps), {}, {
      onChange: onInternalChange
    }),
    mergedValue,
    setInnerValue,
    getCalendarValue,
    triggerCalendarChange,
    [],
    //disabled,
    formatList,
    focused,
    mergedOpen,
    isInvalidateDate
  ), _useRangeValue2 = _slicedToArray(_useRangeValue, 2), triggerSubmitChange = _useRangeValue2[1];
  var _useFieldsInvalidate = useFieldsInvalidate(calendarValue, isInvalidateDate), _useFieldsInvalidate2 = _slicedToArray(_useFieldsInvalidate, 2), submitInvalidates = _useFieldsInvalidate2[0], onSelectorInvalid = _useFieldsInvalidate2[1];
  var submitInvalidate = reactExports.useMemo(function() {
    return submitInvalidates.some(function(invalidated) {
      return invalidated;
    });
  }, [submitInvalidates]);
  var onInternalPickerValueChange = function onInternalPickerValueChange2(dates, info) {
    if (onPickerValueChange) {
      var cleanInfo = _objectSpread2(_objectSpread2({}, info), {}, {
        mode: info.mode[0]
      });
      delete cleanInfo.range;
      onPickerValueChange(dates[0], cleanInfo);
    }
  };
  var _useRangePickerValue = useRangePickerValue(
    generateConfig2,
    locale2,
    calendarValue,
    [mergedMode],
    mergedOpen,
    activeIndex,
    internalPicker,
    false,
    // multiplePanel,
    defaultPickerValue,
    pickerValue,
    toArray(showTime === null || showTime === void 0 ? void 0 : showTime.defaultOpenValue),
    onInternalPickerValueChange,
    minDate,
    maxDate
  ), _useRangePickerValue2 = _slicedToArray(_useRangePickerValue, 2), currentPickerValue = _useRangePickerValue2[0], setCurrentPickerValue = _useRangePickerValue2[1];
  var triggerModeChange = useEvent(function(nextPickerValue, nextMode, triggerEvent) {
    setMode(nextMode);
    if (onPanelChange && triggerEvent !== false) {
      var lastPickerValue = nextPickerValue || calendarValue[calendarValue.length - 1];
      onPanelChange(lastPickerValue, nextMode);
    }
  });
  var triggerConfirm = function triggerConfirm2() {
    triggerSubmitChange(getCalendarValue());
    triggerOpen(false, {
      force: true
    });
  };
  var onSelectorClick = function onSelectorClick2(event) {
    if (!disabled && !selectorRef.current.nativeElement.contains(document.activeElement)) {
      selectorRef.current.focus();
    }
    triggerOpen(true);
    onClick === null || onClick === void 0 || onClick(event);
  };
  var onSelectorClear = function onSelectorClear2() {
    triggerSubmitChange(null);
    triggerOpen(false, {
      force: true
    });
  };
  var _React$useState = reactExports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), hoverSource = _React$useState2[0], setHoverSource = _React$useState2[1];
  var _React$useState3 = reactExports.useState(null), _React$useState4 = _slicedToArray(_React$useState3, 2), internalHoverValue = _React$useState4[0], setInternalHoverValue = _React$useState4[1];
  var hoverValues = reactExports.useMemo(function() {
    var values = [internalHoverValue].concat(_toConsumableArray(calendarValue)).filter(function(date) {
      return date;
    });
    return multiple ? values : values.slice(0, 1);
  }, [calendarValue, internalHoverValue, multiple]);
  var selectorValues = reactExports.useMemo(function() {
    if (!multiple && internalHoverValue) {
      return [internalHoverValue];
    }
    return calendarValue.filter(function(date) {
      return date;
    });
  }, [calendarValue, internalHoverValue, multiple]);
  reactExports.useEffect(function() {
    if (!mergedOpen) {
      setInternalHoverValue(null);
    }
  }, [mergedOpen]);
  var presetList = usePresets(presets);
  var onPresetHover = function onPresetHover2(nextValue) {
    setInternalHoverValue(nextValue);
    setHoverSource("preset");
  };
  var onPresetSubmit = function onPresetSubmit2(nextValue) {
    var nextCalendarValues = multiple ? toggleDates(getCalendarValue(), nextValue) : [nextValue];
    var passed = triggerSubmitChange(nextCalendarValues);
    if (passed && !multiple) {
      triggerOpen(false, {
        force: true
      });
    }
  };
  var onNow = function onNow2(now) {
    onPresetSubmit(now);
  };
  var onPanelHover = function onPanelHover2(date) {
    setInternalHoverValue(date);
    setHoverSource("cell");
  };
  var onPanelFocus = function onPanelFocus2(event) {
    triggerOpen(true);
    onSharedFocus(event);
  };
  var onPanelSelect = function onPanelSelect2(date) {
    lastOperation("panel");
    if (multiple && internalMode !== picker) {
      return;
    }
    var nextValues = multiple ? toggleDates(getCalendarValue(), date) : [date];
    triggerCalendarChange(nextValues);
    if (!needConfirm && !complexPicker && internalPicker === internalMode) {
      triggerConfirm();
    }
  };
  var onPopupClose = function onPopupClose2() {
    triggerOpen(false);
  };
  var onInternalCellRender = useCellRender(cellRender, dateRender, monthCellRender);
  var panelProps = reactExports.useMemo(function() {
    var domProps = pickAttrs(filledProps, false);
    var restProps = omit(filledProps, [].concat(_toConsumableArray(Object.keys(domProps)), ["onChange", "onCalendarChange", "style", "className", "onPanelChange"]));
    return _objectSpread2(_objectSpread2({}, restProps), {}, {
      multiple: filledProps.multiple
    });
  }, [filledProps]);
  var panel = /* @__PURE__ */ reactExports.createElement(Popup, _extends({}, panelProps, {
    showNow: mergedShowNow,
    showTime,
    disabledDate,
    onFocus: onPanelFocus,
    onBlur: onSharedBlur,
    picker,
    mode: mergedMode,
    internalMode,
    onPanelChange: triggerModeChange,
    format: maskFormat,
    value: calendarValue,
    isInvalid: isInvalidateDate,
    onChange: null,
    onSelect: onPanelSelect,
    pickerValue: currentPickerValue,
    defaultOpenValue: showTime === null || showTime === void 0 ? void 0 : showTime.defaultOpenValue,
    onPickerValueChange: setCurrentPickerValue,
    hoverValue: hoverValues,
    onHover: onPanelHover,
    needConfirm,
    onSubmit: triggerConfirm,
    onOk: triggerOk,
    presets: presetList,
    onPresetHover,
    onPresetSubmit,
    onNow,
    cellRender: onInternalCellRender
  }));
  var onSelectorChange = function onSelectorChange2(date) {
    triggerCalendarChange(date);
  };
  var onSelectorInputChange = function onSelectorInputChange2() {
    lastOperation("input");
  };
  var onSelectorFocus = function onSelectorFocus2(event) {
    lastOperation("input");
    triggerOpen(true, {
      inherit: true
    });
    onSharedFocus(event);
  };
  var onSelectorBlur = function onSelectorBlur2(event) {
    triggerOpen(false);
    onSharedBlur(event);
  };
  var onSelectorKeyDown = function onSelectorKeyDown2(event, preventDefault) {
    if (event.key === "Tab") {
      triggerConfirm();
    }
    onKeyDown === null || onKeyDown === void 0 || onKeyDown(event, preventDefault);
  };
  var context = reactExports.useMemo(function() {
    return {
      prefixCls,
      locale: locale2,
      generateConfig: generateConfig2,
      button: components.button,
      input: components.input
    };
  }, [prefixCls, locale2, generateConfig2, components.button, components.input]);
  useLayoutEffect(function() {
    if (mergedOpen && activeIndex !== void 0) {
      triggerModeChange(null, picker, false);
    }
  }, [mergedOpen, activeIndex, picker]);
  useLayoutEffect(function() {
    var lastOp = lastOperation();
    if (!mergedOpen && lastOp === "input") {
      triggerOpen(false);
      triggerConfirm();
    }
    if (!mergedOpen && complexPicker && !needConfirm && lastOp === "panel") {
      triggerConfirm();
    }
  }, [mergedOpen]);
  return /* @__PURE__ */ reactExports.createElement(PickerContext.Provider, {
    value: context
  }, /* @__PURE__ */ reactExports.createElement(PickerTrigger, _extends({}, pickTriggerProps(filledProps), {
    popupElement: panel,
    popupStyle: styles.popup,
    popupClassName: classNames2.popup,
    visible: mergedOpen,
    onClose: onPopupClose
  }), /* @__PURE__ */ reactExports.createElement(
    RefSingleSelector,
    _extends({}, filledProps, {
      // Ref
      ref: selectorRef,
      suffixIcon,
      removeIcon,
      activeHelp: !!internalHoverValue,
      allHelp: !!internalHoverValue && hoverSource === "preset",
      focused,
      onFocus: onSelectorFocus,
      onBlur: onSelectorBlur,
      onKeyDown: onSelectorKeyDown,
      onSubmit: triggerConfirm,
      value: selectorValues,
      maskFormat,
      onChange: onSelectorChange,
      onInputChange: onSelectorInputChange,
      internalPicker,
      format: formatList,
      inputReadOnly,
      disabled,
      open: mergedOpen,
      onOpenChange: triggerOpen,
      onClick: onSelectorClick,
      onClear: onSelectorClear,
      invalid: submitInvalidate,
      onInvalid: function onInvalid(invalid) {
        onSelectorInvalid(invalid, 0);
      }
    })
  )));
}
var RefPicker = /* @__PURE__ */ reactExports.forwardRef(Picker);
const genSize = (token, suffix) => {
  const {
    componentCls,
    controlHeight
  } = token;
  const suffixCls = suffix ? `${componentCls}-${suffix}` : "";
  const multipleSelectorUnit = getMultipleSelectorUnit(token);
  return [
    // genSelectionStyle(token, suffix),
    {
      [`${componentCls}-multiple${suffixCls}`]: {
        paddingBlock: multipleSelectorUnit.containerPadding,
        paddingInlineStart: multipleSelectorUnit.basePadding,
        minHeight: controlHeight,
        // ======================== Selections ========================
        [`${componentCls}-selection-item`]: {
          height: multipleSelectorUnit.itemHeight,
          lineHeight: unit(multipleSelectorUnit.itemLineHeight)
        }
      }
    }
  ];
};
const genPickerMultipleStyle = (token) => {
  const {
    componentCls,
    calc,
    lineWidth
  } = token;
  const smallToken = merge(token, {
    fontHeight: token.fontSize,
    selectHeight: token.controlHeightSM,
    multipleSelectItemHeight: token.multipleItemHeightSM,
    borderRadius: token.borderRadiusSM,
    borderRadiusSM: token.borderRadiusXS,
    controlHeight: token.controlHeightSM
  });
  const largeToken = merge(token, {
    fontHeight: calc(token.multipleItemHeightLG).sub(calc(lineWidth).mul(2).equal()).equal(),
    fontSize: token.fontSizeLG,
    selectHeight: token.controlHeightLG,
    multipleSelectItemHeight: token.multipleItemHeightLG,
    borderRadius: token.borderRadiusLG,
    borderRadiusSM: token.borderRadius,
    controlHeight: token.controlHeightLG
  });
  return [
    // ======================== Size ========================
    genSize(smallToken, "small"),
    genSize(token),
    genSize(largeToken, "large"),
    // ====================== Selection ======================
    {
      [`${componentCls}${componentCls}-multiple`]: Object.assign(Object.assign({
        width: "100%",
        cursor: "text",
        // ==================== Selector =====================
        [`${componentCls}-selector`]: {
          flex: "auto",
          padding: 0,
          position: "relative",
          "&:after": {
            margin: 0
          },
          // ================== placeholder ==================
          [`${componentCls}-selection-placeholder`]: {
            position: "absolute",
            top: "50%",
            insetInlineStart: token.inputPaddingHorizontalBase,
            insetInlineEnd: 0,
            transform: "translateY(-50%)",
            transition: `all ${token.motionDurationSlow}`,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            flex: 1,
            color: token.colorTextPlaceholder,
            pointerEvents: "none"
          }
        }
      }, genOverflowStyle(token)), {
        // ====================== Input ======================
        // Input is `readonly`, which is used for a11y only
        [`${componentCls}-multiple-input`]: {
          width: 0,
          height: 0,
          border: 0,
          visibility: "hidden",
          position: "absolute",
          zIndex: -1
        }
      })
    }
  ];
};
const genPickerCellInnerStyle = (token) => {
  const {
    pickerCellCls,
    pickerCellInnerCls,
    cellHeight,
    borderRadiusSM,
    motionDurationMid,
    cellHoverBg,
    lineWidth,
    lineType,
    colorPrimary,
    cellActiveWithRangeBg,
    colorTextLightSolid,
    colorTextDisabled,
    cellBgDisabled,
    colorFillSecondary
  } = token;
  return {
    "&::before": {
      position: "absolute",
      top: "50%",
      insetInlineStart: 0,
      insetInlineEnd: 0,
      zIndex: 1,
      height: cellHeight,
      transform: "translateY(-50%)",
      content: '""',
      pointerEvents: "none"
    },
    // >>> Default
    [pickerCellInnerCls]: {
      position: "relative",
      zIndex: 2,
      display: "inline-block",
      minWidth: cellHeight,
      height: cellHeight,
      lineHeight: unit(cellHeight),
      borderRadius: borderRadiusSM,
      transition: `background ${motionDurationMid}`
    },
    // >>> Hover
    [`&:hover:not(${pickerCellCls}-in-view):not(${pickerCellCls}-disabled),
    &:hover:not(${pickerCellCls}-selected):not(${pickerCellCls}-range-start):not(${pickerCellCls}-range-end):not(${pickerCellCls}-disabled)`]: {
      [pickerCellInnerCls]: {
        background: cellHoverBg
      }
    },
    // >>> Today
    [`&-in-view${pickerCellCls}-today ${pickerCellInnerCls}`]: {
      "&::before": {
        position: "absolute",
        top: 0,
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        zIndex: 1,
        border: `${unit(lineWidth)} ${lineType} ${colorPrimary}`,
        borderRadius: borderRadiusSM,
        content: '""'
      }
    },
    // >>> In Range
    [`&-in-view${pickerCellCls}-in-range,
      &-in-view${pickerCellCls}-range-start,
      &-in-view${pickerCellCls}-range-end`]: {
      position: "relative",
      [`&:not(${pickerCellCls}-disabled):before`]: {
        background: cellActiveWithRangeBg
      }
    },
    // >>> Selected
    [`&-in-view${pickerCellCls}-selected,
      &-in-view${pickerCellCls}-range-start,
      &-in-view${pickerCellCls}-range-end`]: {
      [`&:not(${pickerCellCls}-disabled) ${pickerCellInnerCls}`]: {
        color: colorTextLightSolid,
        background: colorPrimary
      },
      [`&${pickerCellCls}-disabled ${pickerCellInnerCls}`]: {
        background: colorFillSecondary
      }
    },
    [`&-in-view${pickerCellCls}-range-start:not(${pickerCellCls}-disabled):before`]: {
      insetInlineStart: "50%"
    },
    [`&-in-view${pickerCellCls}-range-end:not(${pickerCellCls}-disabled):before`]: {
      insetInlineEnd: "50%"
    },
    // range start border-radius
    [`&-in-view${pickerCellCls}-range-start:not(${pickerCellCls}-range-end) ${pickerCellInnerCls}`]: {
      borderStartStartRadius: borderRadiusSM,
      borderEndStartRadius: borderRadiusSM,
      borderStartEndRadius: 0,
      borderEndEndRadius: 0
    },
    // range end border-radius
    [`&-in-view${pickerCellCls}-range-end:not(${pickerCellCls}-range-start) ${pickerCellInnerCls}`]: {
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,
      borderStartEndRadius: borderRadiusSM,
      borderEndEndRadius: borderRadiusSM
    },
    // >>> Disabled
    "&-disabled": {
      color: colorTextDisabled,
      cursor: "not-allowed",
      [pickerCellInnerCls]: {
        background: "transparent"
      },
      "&::before": {
        background: cellBgDisabled
      }
    },
    [`&-disabled${pickerCellCls}-today ${pickerCellInnerCls}::before`]: {
      borderColor: colorTextDisabled
    }
  };
};
const genPanelStyle = (token) => {
  const {
    componentCls,
    pickerCellCls,
    pickerCellInnerCls,
    pickerYearMonthCellWidth,
    pickerControlIconSize,
    cellWidth,
    paddingSM,
    paddingXS,
    paddingXXS,
    colorBgContainer,
    lineWidth,
    lineType,
    borderRadiusLG,
    colorPrimary,
    colorTextHeading,
    colorSplit,
    pickerControlIconBorderWidth,
    colorIcon,
    textHeight,
    motionDurationMid,
    colorIconHover,
    fontWeightStrong,
    cellHeight,
    pickerCellPaddingVertical,
    colorTextDisabled,
    colorText,
    fontSize,
    motionDurationSlow,
    withoutTimeCellHeight,
    pickerQuarterPanelContentHeight,
    borderRadiusSM,
    colorTextLightSolid,
    cellHoverBg,
    timeColumnHeight,
    timeColumnWidth,
    timeCellHeight,
    controlItemBgActive,
    marginXXS,
    pickerDatePanelPaddingHorizontal,
    pickerControlIconMargin
  } = token;
  const pickerPanelWidth = token.calc(cellWidth).mul(7).add(token.calc(pickerDatePanelPaddingHorizontal).mul(2)).equal();
  return {
    [componentCls]: {
      "&-panel": {
        display: "inline-flex",
        flexDirection: "column",
        textAlign: "center",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        outline: "none",
        "&-focused": {
          borderColor: colorPrimary
        },
        "&-rtl": {
          [`${componentCls}-prev-icon,
              ${componentCls}-super-prev-icon`]: {
            transform: "rotate(45deg)"
          },
          [`${componentCls}-next-icon,
              ${componentCls}-super-next-icon`]: {
            transform: "rotate(-135deg)"
          },
          [`${componentCls}-time-panel`]: {
            [`${componentCls}-content`]: {
              direction: "ltr",
              "> *": {
                direction: "rtl"
              }
            }
          }
        }
      },
      // ========================================================
      // =                     Shared Panel                     =
      // ========================================================
      [`&-decade-panel,
        &-year-panel,
        &-quarter-panel,
        &-month-panel,
        &-week-panel,
        &-date-panel,
        &-time-panel`]: {
        display: "flex",
        flexDirection: "column",
        width: pickerPanelWidth
      },
      // ======================= Header =======================
      "&-header": {
        display: "flex",
        padding: `0 ${unit(paddingXS)}`,
        color: colorTextHeading,
        borderBottom: `${unit(lineWidth)} ${lineType} ${colorSplit}`,
        "> *": {
          flex: "none"
        },
        button: {
          padding: 0,
          color: colorIcon,
          lineHeight: unit(textHeight),
          background: "transparent",
          border: 0,
          cursor: "pointer",
          transition: `color ${motionDurationMid}`,
          fontSize: "inherit",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          "&:empty": {
            display: "none"
          }
        },
        "> button": {
          minWidth: "1.6em",
          fontSize,
          "&:hover": {
            color: colorIconHover
          },
          "&:disabled": {
            opacity: 0.25,
            pointerEvents: "none"
          }
        },
        "&-view": {
          flex: "auto",
          fontWeight: fontWeightStrong,
          lineHeight: unit(textHeight),
          "> button": {
            color: "inherit",
            fontWeight: "inherit",
            verticalAlign: "top",
            "&:not(:first-child)": {
              marginInlineStart: paddingXS
            },
            "&:hover": {
              color: colorPrimary
            }
          }
        }
      },
      // Arrow button
      [`&-prev-icon,
        &-next-icon,
        &-super-prev-icon,
        &-super-next-icon`]: {
        position: "relative",
        width: pickerControlIconSize,
        height: pickerControlIconSize,
        "&::before": {
          position: "absolute",
          top: 0,
          insetInlineStart: 0,
          width: pickerControlIconSize,
          height: pickerControlIconSize,
          border: `0 solid currentcolor`,
          borderBlockStartWidth: pickerControlIconBorderWidth,
          borderInlineStartWidth: pickerControlIconBorderWidth,
          content: '""'
        }
      },
      [`&-super-prev-icon,
        &-super-next-icon`]: {
        "&::after": {
          position: "absolute",
          top: pickerControlIconMargin,
          insetInlineStart: pickerControlIconMargin,
          display: "inline-block",
          width: pickerControlIconSize,
          height: pickerControlIconSize,
          border: "0 solid currentcolor",
          borderBlockStartWidth: pickerControlIconBorderWidth,
          borderInlineStartWidth: pickerControlIconBorderWidth,
          content: '""'
        }
      },
      "&-prev-icon, &-super-prev-icon": {
        transform: "rotate(-45deg)"
      },
      "&-next-icon, &-super-next-icon": {
        transform: "rotate(135deg)"
      },
      // ======================== Body ========================
      "&-content": {
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        "th, td": {
          position: "relative",
          minWidth: cellHeight,
          fontWeight: "normal"
        },
        th: {
          height: token.calc(cellHeight).add(token.calc(pickerCellPaddingVertical).mul(2)).equal(),
          color: colorText,
          verticalAlign: "middle"
        }
      },
      "&-cell": Object.assign({
        padding: `${unit(pickerCellPaddingVertical)} 0`,
        color: colorTextDisabled,
        cursor: "pointer",
        // In view
        "&-in-view": {
          color: colorText
        }
      }, genPickerCellInnerStyle(token)),
      [`&-decade-panel,
        &-year-panel,
        &-quarter-panel,
        &-month-panel`]: {
        [`${componentCls}-content`]: {
          height: token.calc(withoutTimeCellHeight).mul(4).equal()
        },
        [pickerCellInnerCls]: {
          padding: `0 ${unit(paddingXS)}`
        }
      },
      "&-quarter-panel": {
        [`${componentCls}-content`]: {
          height: pickerQuarterPanelContentHeight
        }
      },
      // ========================================================
      // =                       Special                        =
      // ========================================================
      // ===================== Decade Panel =====================
      "&-decade-panel": {
        [pickerCellInnerCls]: {
          padding: `0 ${unit(token.calc(paddingXS).div(2).equal())}`
        },
        [`${componentCls}-cell::before`]: {
          display: "none"
        }
      },
      // ============= Year & Quarter & Month Panel =============
      [`&-year-panel,
        &-quarter-panel,
        &-month-panel`]: {
        [`${componentCls}-body`]: {
          padding: `0 ${unit(paddingXS)}`
        },
        [pickerCellInnerCls]: {
          width: pickerYearMonthCellWidth
        }
      },
      // ====================== Date Panel ======================
      "&-date-panel": {
        [`${componentCls}-body`]: {
          padding: `${unit(paddingXS)} ${unit(pickerDatePanelPaddingHorizontal)}`
        },
        [`${componentCls}-content th`]: {
          boxSizing: "border-box",
          padding: 0
        }
      },
      // ====================== Week Panel ======================
      "&-week-panel-row": {
        td: {
          "&:before": {
            transition: `background ${motionDurationMid}`
          },
          "&:first-child:before": {
            borderStartStartRadius: borderRadiusSM,
            borderEndStartRadius: borderRadiusSM
          },
          "&:last-child:before": {
            borderStartEndRadius: borderRadiusSM,
            borderEndEndRadius: borderRadiusSM
          }
        },
        "&:hover td:before": {
          background: cellHoverBg
        },
        "&-range-start td, &-range-end td, &-selected td, &-hover td": {
          // Rise priority to override hover style
          [`&${pickerCellCls}`]: {
            "&:before": {
              background: colorPrimary
            },
            [`&${componentCls}-cell-week`]: {
              color: new FastColor(colorTextLightSolid).setA(0.5).toHexString()
            },
            [pickerCellInnerCls]: {
              color: colorTextLightSolid
            }
          }
        },
        "&-range-hover td:before": {
          background: controlItemBgActive
        }
      },
      // >>> ShowWeek
      "&-week-panel, &-date-panel-show-week": {
        [`${componentCls}-body`]: {
          padding: `${unit(paddingXS)} ${unit(paddingSM)}`
        },
        [`${componentCls}-content th`]: {
          width: "auto"
        }
      },
      // ==================== Datetime Panel ====================
      "&-datetime-panel": {
        display: "flex",
        [`${componentCls}-time-panel`]: {
          borderInlineStart: `${unit(lineWidth)} ${lineType} ${colorSplit}`
        },
        [`${componentCls}-date-panel,
          ${componentCls}-time-panel`]: {
          transition: `opacity ${motionDurationSlow}`
        },
        // Keyboard
        "&-active": {
          [`${componentCls}-date-panel,
            ${componentCls}-time-panel`]: {
            opacity: 0.3,
            "&-active": {
              opacity: 1
            }
          }
        }
      },
      // ====================== Time Panel ======================
      "&-time-panel": {
        width: "auto",
        minWidth: "auto",
        [`${componentCls}-content`]: {
          display: "flex",
          flex: "auto",
          height: timeColumnHeight
        },
        "&-column": {
          flex: "1 0 auto",
          width: timeColumnWidth,
          margin: `${unit(paddingXXS)} 0`,
          padding: 0,
          overflowY: "hidden",
          textAlign: "start",
          listStyle: "none",
          transition: `background ${motionDurationMid}`,
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: 8,
            backgroundColor: "transparent"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: token.colorTextTertiary,
            borderRadius: token.borderRadiusSM
          },
          // For Firefox
          "&": {
            scrollbarWidth: "thin",
            scrollbarColor: `${token.colorTextTertiary} transparent`
          },
          "&::after": {
            display: "block",
            height: `calc(100% - ${unit(timeCellHeight)})`,
            content: '""'
          },
          "&:not(:first-child)": {
            borderInlineStart: `${unit(lineWidth)} ${lineType} ${colorSplit}`
          },
          "&-active": {
            background: new FastColor(controlItemBgActive).setA(0.2).toHexString()
          },
          "&:hover": {
            overflowY: "auto"
          },
          "> li": {
            margin: 0,
            padding: 0,
            [`&${componentCls}-time-panel-cell`]: {
              marginInline: marginXXS,
              [`${componentCls}-time-panel-cell-inner`]: {
                display: "block",
                width: token.calc(timeColumnWidth).sub(token.calc(marginXXS).mul(2)).equal(),
                height: timeCellHeight,
                margin: 0,
                paddingBlock: 0,
                paddingInlineEnd: 0,
                paddingInlineStart: token.calc(timeColumnWidth).sub(timeCellHeight).div(2).equal(),
                color: colorText,
                lineHeight: unit(timeCellHeight),
                borderRadius: borderRadiusSM,
                cursor: "pointer",
                transition: `background ${motionDurationMid}`,
                "&:hover": {
                  background: cellHoverBg
                }
              },
              "&-selected": {
                [`${componentCls}-time-panel-cell-inner`]: {
                  background: controlItemBgActive
                }
              },
              "&-disabled": {
                [`${componentCls}-time-panel-cell-inner`]: {
                  color: colorTextDisabled,
                  background: "transparent",
                  cursor: "not-allowed"
                }
              }
            }
          }
        }
      }
    }
  };
};
const genPickerPanelStyle = (token) => {
  const {
    componentCls,
    textHeight,
    lineWidth,
    paddingSM,
    antCls,
    colorPrimary,
    cellActiveWithRangeBg,
    colorPrimaryBorder,
    lineType,
    colorSplit
  } = token;
  return {
    [`${componentCls}-dropdown`]: {
      // ======================== Footer ========================
      [`${componentCls}-footer`]: {
        borderTop: `${unit(lineWidth)} ${lineType} ${colorSplit}`,
        "&-extra": {
          padding: `0 ${unit(paddingSM)}`,
          lineHeight: unit(token.calc(textHeight).sub(token.calc(lineWidth).mul(2)).equal()),
          textAlign: "start",
          "&:not(:last-child)": {
            borderBottom: `${unit(lineWidth)} ${lineType} ${colorSplit}`
          }
        }
      },
      // ==================== Footer > Ranges ===================
      [`${componentCls}-panels + ${componentCls}-footer ${componentCls}-ranges`]: {
        justifyContent: "space-between"
      },
      [`${componentCls}-ranges`]: {
        marginBlock: 0,
        paddingInline: unit(paddingSM),
        overflow: "hidden",
        textAlign: "start",
        listStyle: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "> li": {
          lineHeight: unit(token.calc(textHeight).sub(token.calc(lineWidth).mul(2)).equal()),
          display: "inline-block"
        },
        [`${componentCls}-now-btn-disabled`]: {
          pointerEvents: "none",
          color: token.colorTextDisabled
        },
        // https://github.com/ant-design/ant-design/issues/23687
        [`${componentCls}-preset > ${antCls}-tag-blue`]: {
          color: colorPrimary,
          background: cellActiveWithRangeBg,
          borderColor: colorPrimaryBorder,
          cursor: "pointer"
        },
        [`${componentCls}-ok`]: {
          paddingBlock: token.calc(lineWidth).mul(2).equal(),
          marginInlineStart: "auto"
        }
      }
    }
  };
};
const initPickerPanelToken = (token) => {
  const {
    componentCls,
    controlHeightLG,
    paddingXXS,
    padding
  } = token;
  return {
    pickerCellCls: `${componentCls}-cell`,
    pickerCellInnerCls: `${componentCls}-cell-inner`,
    pickerYearMonthCellWidth: token.calc(controlHeightLG).mul(1.5).equal(),
    pickerQuarterPanelContentHeight: token.calc(controlHeightLG).mul(1.4).equal(),
    pickerCellPaddingVertical: token.calc(paddingXXS).add(token.calc(paddingXXS).div(2)).equal(),
    pickerCellBorderGap: 2,
    // Magic for gap between cells
    pickerControlIconSize: 7,
    pickerControlIconMargin: 4,
    pickerControlIconBorderWidth: 1.5,
    pickerDatePanelPaddingHorizontal: token.calc(padding).add(token.calc(paddingXXS).div(2)).equal()
    // 18 in normal
  };
};
const initPanelComponentToken = (token) => {
  const {
    colorBgContainerDisabled,
    controlHeight,
    controlHeightSM,
    controlHeightLG,
    paddingXXS,
    lineWidth
  } = token;
  const dblPaddingXXS = paddingXXS * 2;
  const dblLineWidth = lineWidth * 2;
  const multipleItemHeight = Math.min(controlHeight - dblPaddingXXS, controlHeight - dblLineWidth);
  const multipleItemHeightSM = Math.min(controlHeightSM - dblPaddingXXS, controlHeightSM - dblLineWidth);
  const multipleItemHeightLG = Math.min(controlHeightLG - dblPaddingXXS, controlHeightLG - dblLineWidth);
  const INTERNAL_FIXED_ITEM_MARGIN = Math.floor(paddingXXS / 2);
  const filledToken = {
    INTERNAL_FIXED_ITEM_MARGIN,
    cellHoverBg: token.controlItemBgHover,
    cellActiveWithRangeBg: token.controlItemBgActive,
    cellHoverWithRangeBg: new FastColor(token.colorPrimary).lighten(35).toHexString(),
    cellRangeBorderColor: new FastColor(token.colorPrimary).lighten(20).toHexString(),
    cellBgDisabled: colorBgContainerDisabled,
    timeColumnWidth: controlHeightLG * 1.4,
    timeColumnHeight: 28 * 8,
    timeCellHeight: 28,
    cellWidth: controlHeightSM * 1.5,
    cellHeight: controlHeightSM,
    textHeight: controlHeightLG,
    withoutTimeCellHeight: controlHeightLG * 1.65,
    multipleItemBg: token.colorFillSecondary,
    multipleItemBorderColor: "transparent",
    multipleItemHeight,
    multipleItemHeightSM,
    multipleItemHeightLG,
    multipleSelectorBgDisabled: colorBgContainerDisabled,
    multipleItemColorDisabled: token.colorTextDisabled,
    multipleItemBorderColorDisabled: "transparent"
  };
  return filledToken;
};
const prepareComponentToken = (token) => Object.assign(Object.assign(Object.assign(Object.assign({}, initComponentToken(token)), initPanelComponentToken(token)), getArrowToken(token)), {
  presetsWidth: 120,
  presetsMaxWidth: 200,
  zIndexPopup: token.zIndexPopupBase + 50
});
const genVariantsStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: [
      Object.assign(Object.assign(Object.assign(Object.assign({}, genOutlinedStyle(token)), genUnderlinedStyle(token)), genFilledStyle(token)), genBorderlessStyle(token)),
      // ========================= Multiple =========================
      {
        "&-outlined": {
          [`&${componentCls}-multiple ${componentCls}-selection-item`]: {
            background: token.multipleItemBg,
            border: `${unit(token.lineWidth)} ${token.lineType} ${token.multipleItemBorderColor}`
          }
        },
        "&-filled": {
          [`&${componentCls}-multiple ${componentCls}-selection-item`]: {
            background: token.colorBgContainer,
            border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`
          }
        },
        "&-borderless": {
          [`&${componentCls}-multiple ${componentCls}-selection-item`]: {
            background: token.multipleItemBg,
            border: `${unit(token.lineWidth)} ${token.lineType} ${token.multipleItemBorderColor}`
          }
        },
        "&-underlined": {
          [`&${componentCls}-multiple ${componentCls}-selection-item`]: {
            background: token.multipleItemBg,
            border: `${unit(token.lineWidth)} ${token.lineType} ${token.multipleItemBorderColor}`
          }
        }
      }
    ]
  };
};
const genPickerPadding = (paddingBlock, paddingInline) => {
  return {
    padding: `${unit(paddingBlock)} ${unit(paddingInline)}`
  };
};
const genPickerStatusStyle = (token) => {
  const {
    componentCls,
    colorError,
    colorWarning
  } = token;
  return {
    [`${componentCls}:not(${componentCls}-disabled):not([disabled])`]: {
      [`&${componentCls}-status-error`]: {
        [`${componentCls}-active-bar`]: {
          background: colorError
        }
      },
      [`&${componentCls}-status-warning`]: {
        [`${componentCls}-active-bar`]: {
          background: colorWarning
        }
      }
    }
  };
};
const genPickerStyle = (token) => {
  var _a;
  const {
    componentCls,
    antCls,
    paddingInline,
    lineWidth,
    lineType,
    colorBorder,
    borderRadius,
    motionDurationMid,
    colorTextDisabled,
    colorTextPlaceholder,
    fontSizeLG,
    inputFontSizeLG,
    fontSizeSM,
    inputFontSizeSM,
    controlHeightSM,
    paddingInlineSM,
    paddingXS,
    marginXS,
    colorIcon,
    lineWidthBold,
    colorPrimary,
    motionDurationSlow,
    zIndexPopup,
    paddingXXS,
    sizePopupArrow,
    colorBgElevated,
    borderRadiusLG,
    boxShadowSecondary,
    borderRadiusSM,
    colorSplit,
    cellHoverBg,
    presetsWidth,
    presetsMaxWidth,
    boxShadowPopoverArrow,
    fontHeight,
    lineHeightLG
  } = token;
  return [
    {
      [componentCls]: Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genPickerPadding(token.paddingBlock, token.paddingInline)), {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1,
        borderRadius,
        transition: `border ${motionDurationMid}, box-shadow ${motionDurationMid}, background ${motionDurationMid}`,
        [`${componentCls}-prefix`]: {
          flex: "0 0 auto",
          marginInlineEnd: token.inputAffixPadding
        },
        // ======================== Input =========================
        [`${componentCls}-input`]: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          width: "100%",
          "> input": Object.assign(Object.assign({
            position: "relative",
            display: "inline-block",
            width: "100%",
            color: "inherit",
            fontSize: (_a = token.inputFontSize) !== null && _a !== void 0 ? _a : token.fontSize,
            lineHeight: token.lineHeight,
            transition: `all ${motionDurationMid}`
          }, genPlaceholderStyle(colorTextPlaceholder)), {
            flex: "auto",
            // Fix Firefox flex not correct:
            // https://github.com/ant-design/ant-design/pull/20023#issuecomment-564389553
            minWidth: 1,
            height: "auto",
            padding: 0,
            background: "transparent",
            border: 0,
            fontFamily: "inherit",
            "&:focus": {
              boxShadow: "none",
              outline: 0
            },
            "&[disabled]": {
              background: "transparent",
              color: colorTextDisabled,
              cursor: "not-allowed"
            }
          }),
          "&-placeholder": {
            "> input": {
              color: colorTextPlaceholder
            }
          }
        },
        // Size
        "&-large": Object.assign(Object.assign({}, genPickerPadding(token.paddingBlockLG, token.paddingInlineLG)), {
          [`${componentCls}-input > input`]: {
            fontSize: inputFontSizeLG !== null && inputFontSizeLG !== void 0 ? inputFontSizeLG : fontSizeLG,
            lineHeight: lineHeightLG
          }
        }),
        "&-small": Object.assign(Object.assign({}, genPickerPadding(token.paddingBlockSM, token.paddingInlineSM)), {
          [`${componentCls}-input > input`]: {
            fontSize: inputFontSizeSM !== null && inputFontSizeSM !== void 0 ? inputFontSizeSM : fontSizeSM
          }
        }),
        [`${componentCls}-suffix`]: {
          display: "flex",
          flex: "none",
          alignSelf: "center",
          marginInlineStart: token.calc(paddingXS).div(2).equal(),
          color: colorTextDisabled,
          lineHeight: 1,
          pointerEvents: "none",
          transition: `opacity ${motionDurationMid}, color ${motionDurationMid}`,
          "> *": {
            verticalAlign: "top",
            "&:not(:last-child)": {
              marginInlineEnd: marginXS
            }
          }
        },
        [`${componentCls}-clear`]: {
          position: "absolute",
          top: "50%",
          insetInlineEnd: 0,
          color: colorTextDisabled,
          lineHeight: 1,
          transform: "translateY(-50%)",
          cursor: "pointer",
          opacity: 0,
          transition: `opacity ${motionDurationMid}, color ${motionDurationMid}`,
          "> *": {
            verticalAlign: "top"
          },
          "&:hover": {
            color: colorIcon
          }
        },
        "&:hover": {
          [`${componentCls}-clear`]: {
            opacity: 1
          },
          // Should use the following selector, but since `:has` has poor compatibility,
          // we use `:not(:last-child)` instead, which may cause some problems in some cases.
          // [`${componentCls}-suffix:has(+ ${componentCls}-clear)`]: {
          [`${componentCls}-suffix:not(:last-child)`]: {
            opacity: 0
          }
        },
        [`${componentCls}-separator`]: {
          position: "relative",
          display: "inline-block",
          width: "1em",
          height: fontSizeLG,
          color: colorTextDisabled,
          fontSize: fontSizeLG,
          verticalAlign: "top",
          cursor: "default",
          [`${componentCls}-focused &`]: {
            color: colorIcon
          },
          [`${componentCls}-range-separator &`]: {
            [`${componentCls}-disabled &`]: {
              cursor: "not-allowed"
            }
          }
        },
        // ======================== Range =========================
        "&-range": {
          position: "relative",
          display: "inline-flex",
          // Active bar
          [`${componentCls}-active-bar`]: {
            bottom: token.calc(lineWidth).mul(-1).equal(),
            height: lineWidthBold,
            background: colorPrimary,
            opacity: 0,
            transition: `all ${motionDurationSlow} ease-out`,
            pointerEvents: "none"
          },
          [`&${componentCls}-focused`]: {
            [`${componentCls}-active-bar`]: {
              opacity: 1
            }
          },
          [`${componentCls}-range-separator`]: {
            alignItems: "center",
            padding: `0 ${unit(paddingXS)}`,
            lineHeight: 1
          }
        },
        // ======================== Clear =========================
        "&-range, &-multiple": {
          // Clear
          [`${componentCls}-clear`]: {
            insetInlineEnd: paddingInline
          },
          [`&${componentCls}-small`]: {
            [`${componentCls}-clear`]: {
              insetInlineEnd: paddingInlineSM
            }
          }
        },
        // ======================= Dropdown =======================
        "&-dropdown": Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genPanelStyle(token)), {
          pointerEvents: "none",
          position: "absolute",
          // Fix incorrect position of picker popup
          // https://github.com/ant-design/ant-design/issues/35590
          top: -9999,
          left: {
            _skip_check_: true,
            value: -9999
          },
          zIndex: zIndexPopup,
          [`&${componentCls}-dropdown-hidden`]: {
            display: "none"
          },
          "&-rtl": {
            direction: "rtl"
          },
          [`&${componentCls}-dropdown-placement-bottomLeft,
            &${componentCls}-dropdown-placement-bottomRight`]: {
            [`${componentCls}-range-arrow`]: {
              top: 0,
              display: "block",
              transform: "translateY(-100%)"
            }
          },
          [`&${componentCls}-dropdown-placement-topLeft,
            &${componentCls}-dropdown-placement-topRight`]: {
            [`${componentCls}-range-arrow`]: {
              bottom: 0,
              display: "block",
              transform: "translateY(100%) rotate(180deg)"
            }
          },
          [`&${antCls}-slide-up-appear, &${antCls}-slide-up-enter`]: {
            [`${componentCls}-range-arrow${componentCls}-range-arrow`]: {
              transition: "none"
            }
          },
          [`&${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-dropdown-placement-topLeft,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-dropdown-placement-topRight,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-dropdown-placement-topLeft,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-dropdown-placement-topRight`]: {
            animationName: slideDownIn
          },
          [`&${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-dropdown-placement-bottomLeft,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active${componentCls}-dropdown-placement-bottomRight,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-dropdown-placement-bottomLeft,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active${componentCls}-dropdown-placement-bottomRight`]: {
            animationName: slideUpIn
          },
          // https://github.com/ant-design/ant-design/issues/48727
          [`&${antCls}-slide-up-leave ${componentCls}-panel-container`]: {
            pointerEvents: "none"
          },
          [`&${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-dropdown-placement-topLeft,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-dropdown-placement-topRight`]: {
            animationName: slideDownOut
          },
          [`&${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-dropdown-placement-bottomLeft,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active${componentCls}-dropdown-placement-bottomRight`]: {
            animationName: slideUpOut
          },
          // Time picker with additional style
          [`${componentCls}-panel > ${componentCls}-time-panel`]: {
            paddingTop: paddingXXS
          },
          // ======================== Ranges ========================
          [`${componentCls}-range-wrapper`]: {
            display: "flex",
            position: "relative"
          },
          [`${componentCls}-range-arrow`]: Object.assign(Object.assign({
            position: "absolute",
            zIndex: 1,
            display: "none",
            paddingInline: token.calc(paddingInline).mul(1.5).equal(),
            boxSizing: "content-box",
            transition: `all ${motionDurationSlow} ease-out`
          }, genRoundedArrow(token, colorBgElevated, boxShadowPopoverArrow)), {
            "&:before": {
              insetInlineStart: token.calc(paddingInline).mul(1.5).equal()
            }
          }),
          [`${componentCls}-panel-container`]: {
            overflow: "hidden",
            verticalAlign: "top",
            background: colorBgElevated,
            borderRadius: borderRadiusLG,
            boxShadow: boxShadowSecondary,
            transition: `margin ${motionDurationSlow}`,
            display: "inline-block",
            pointerEvents: "auto",
            // ======================== Layout ========================
            [`${componentCls}-panel-layout`]: {
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "stretch"
            },
            // ======================== Preset ========================
            [`${componentCls}-presets`]: {
              display: "flex",
              flexDirection: "column",
              minWidth: presetsWidth,
              maxWidth: presetsMaxWidth,
              ul: {
                height: 0,
                flex: "auto",
                listStyle: "none",
                overflow: "auto",
                margin: 0,
                padding: paddingXS,
                borderInlineEnd: `${unit(lineWidth)} ${lineType} ${colorSplit}`,
                li: Object.assign(Object.assign({}, textEllipsis), {
                  borderRadius: borderRadiusSM,
                  paddingInline: paddingXS,
                  paddingBlock: token.calc(controlHeightSM).sub(fontHeight).div(2).equal(),
                  cursor: "pointer",
                  transition: `all ${motionDurationSlow}`,
                  "+ li": {
                    marginTop: marginXS
                  },
                  "&:hover": {
                    background: cellHoverBg
                  }
                })
              }
            },
            // ======================== Panels ========================
            [`${componentCls}-panels`]: {
              display: "inline-flex",
              flexWrap: "nowrap",
              // [`${componentCls}-panel`]: {
              //   borderWidth: `0 0 ${unit(lineWidth)}`,
              // },
              "&:last-child": {
                [`${componentCls}-panel`]: {
                  borderWidth: 0
                }
              }
            },
            [`${componentCls}-panel`]: {
              verticalAlign: "top",
              background: "transparent",
              borderRadius: 0,
              borderWidth: 0,
              [`${componentCls}-content, table`]: {
                textAlign: "center"
              },
              "&-focused": {
                borderColor: colorBorder
              }
            }
          }
        }),
        "&-dropdown-range": {
          padding: `${unit(token.calc(sizePopupArrow).mul(2).div(3).equal())} 0`,
          "&-hidden": {
            display: "none"
          }
        },
        "&-rtl": {
          direction: "rtl",
          [`${componentCls}-separator`]: {
            transform: "scale(-1, 1)"
          },
          [`${componentCls}-footer`]: {
            "&-extra": {
              direction: "rtl"
            }
          }
        }
      })
    },
    // Follow code may reuse in other components
    initSlideMotion(token, "slide-up"),
    initSlideMotion(token, "slide-down"),
    initMoveMotion(token, "move-up"),
    initMoveMotion(token, "move-down")
  ];
};
const useStyle = genStyleHooks("DatePicker", (token) => {
  const pickerToken = merge(initInputToken(token), initPickerPanelToken(token), {
    inputPaddingHorizontalBase: token.calc(token.paddingSM).sub(1).equal(),
    multipleSelectItemHeight: token.multipleItemHeight,
    selectHeight: token.controlHeight
  });
  return [
    genPickerPanelStyle(pickerToken),
    genPickerStyle(pickerToken),
    genVariantsStyle(pickerToken),
    genPickerStatusStyle(pickerToken),
    genPickerMultipleStyle(pickerToken),
    // =====================================================
    // ==             Space Compact                       ==
    // =====================================================
    genCompactItemStyle(token, {
      focusElCls: `${token.componentCls}-focused`
    })
  ];
}, prepareComponentToken);
var CalendarOutlined = function CalendarOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon$1, _extends({}, props, {
    ref,
    icon: CalendarOutlined$1
  }));
};
var RefIcon$2 = /* @__PURE__ */ reactExports.forwardRef(CalendarOutlined);
var ClockCircleOutlined = function ClockCircleOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon$1, _extends({}, props, {
    ref,
    icon: ClockCircleOutlined$1
  }));
};
var RefIcon$1 = /* @__PURE__ */ reactExports.forwardRef(ClockCircleOutlined);
var SwapRightOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "0 0 1024 1024", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z" } }] }, "name": "swap-right", "theme": "outlined" };
var SwapRightOutlined = function SwapRightOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon$1, _extends({}, props, {
    ref,
    icon: SwapRightOutlined$1
  }));
};
var RefIcon = /* @__PURE__ */ reactExports.forwardRef(SwapRightOutlined);
function getPlaceholder(locale2, picker, customizePlaceholder) {
  if (customizePlaceholder !== void 0) {
    return customizePlaceholder;
  }
  if (picker === "year" && locale2.lang.yearPlaceholder) {
    return locale2.lang.yearPlaceholder;
  }
  if (picker === "quarter" && locale2.lang.quarterPlaceholder) {
    return locale2.lang.quarterPlaceholder;
  }
  if (picker === "month" && locale2.lang.monthPlaceholder) {
    return locale2.lang.monthPlaceholder;
  }
  if (picker === "week" && locale2.lang.weekPlaceholder) {
    return locale2.lang.weekPlaceholder;
  }
  if (picker === "time" && locale2.timePickerLocale.placeholder) {
    return locale2.timePickerLocale.placeholder;
  }
  return locale2.lang.placeholder;
}
function getRangePlaceholder(locale2, picker, customizePlaceholder) {
  if (customizePlaceholder !== void 0) {
    return customizePlaceholder;
  }
  if (picker === "year" && locale2.lang.yearPlaceholder) {
    return locale2.lang.rangeYearPlaceholder;
  }
  if (picker === "quarter" && locale2.lang.quarterPlaceholder) {
    return locale2.lang.rangeQuarterPlaceholder;
  }
  if (picker === "month" && locale2.lang.monthPlaceholder) {
    return locale2.lang.rangeMonthPlaceholder;
  }
  if (picker === "week" && locale2.lang.weekPlaceholder) {
    return locale2.lang.rangeWeekPlaceholder;
  }
  if (picker === "time" && locale2.timePickerLocale.placeholder) {
    return locale2.timePickerLocale.rangePlaceholder;
  }
  return locale2.lang.rangePlaceholder;
}
function useIcons(props, prefixCls) {
  const {
    allowClear = true
  } = props;
  const {
    clearIcon,
    removeIcon
  } = useIcons$1(Object.assign(Object.assign({}, props), {
    prefixCls,
    componentName: "DatePicker"
  }));
  const mergedAllowClear = reactExports.useMemo(() => {
    if (allowClear === false) {
      return false;
    }
    const allowClearConfig = allowClear === true ? {} : allowClear;
    return Object.assign({
      clearIcon
    }, allowClearConfig);
  }, [allowClear, clearIcon]);
  return [mergedAllowClear, removeIcon];
}
const [WEEK, WEEKPICKER] = ["week", "WeekPicker"];
const [MONTH, MONTHPICKER] = ["month", "MonthPicker"];
const [YEAR, YEARPICKER] = ["year", "YearPicker"];
const [QUARTER, QUARTERPICKER] = ["quarter", "QuarterPicker"];
const [TIME, TIMEPICKER] = ["time", "TimePicker"];
const PickerButton = (props) => /* @__PURE__ */ reactExports.createElement(Button, Object.assign({
  size: "small",
  type: "primary"
}, props));
function useComponents(components) {
  return reactExports.useMemo(() => Object.assign({
    button: PickerButton
  }, components), [components]);
}
function mergeClassNames(schema, ...classNames$1) {
  const mergedSchema = schema || {};
  return classNames$1.reduce((acc, cur) => {
    Object.keys(cur || {}).forEach((key) => {
      const keySchema = mergedSchema[key];
      const curVal = cur[key];
      if (keySchema && typeof keySchema === "object") {
        if (curVal && typeof curVal === "object") {
          acc[key] = mergeClassNames(keySchema, acc[key], curVal);
        } else {
          const {
            _default: defaultField
          } = keySchema;
          acc[key] = acc[key] || {};
          acc[key][defaultField] = classNames(acc[key][defaultField], curVal);
        }
      } else {
        acc[key] = classNames(acc[key], curVal);
      }
    });
    return acc;
  }, {});
}
function useSemanticClassNames(schema, ...classNames2) {
  return reactExports.useMemo(() => mergeClassNames.apply(void 0, [schema].concat(classNames2)), [classNames2]);
}
function useSemanticStyles(...styles) {
  return reactExports.useMemo(() => {
    return styles.reduce((acc, cur = {}) => {
      Object.keys(cur).forEach((key) => {
        acc[key] = Object.assign(Object.assign({}, acc[key]), cur[key]);
      });
      return acc;
    }, {});
  }, [styles]);
}
function fillObjectBySchema(obj, schema) {
  const newObj = Object.assign({}, obj);
  Object.keys(schema).forEach((key) => {
    if (key !== "_default") {
      const nestSchema = schema[key];
      const nextValue = newObj[key] || {};
      newObj[key] = nestSchema ? fillObjectBySchema(nextValue, nestSchema) : nextValue;
    }
  });
  return newObj;
}
function useMergeSemantic(classNamesList, stylesList, schema) {
  const mergedClassNames = useSemanticClassNames.apply(void 0, [schema].concat(_toConsumableArray(classNamesList)));
  const mergedStyles = useSemanticStyles.apply(void 0, _toConsumableArray(stylesList));
  return reactExports.useMemo(() => {
    return [fillObjectBySchema(mergedClassNames, schema), fillObjectBySchema(mergedStyles, schema)];
  }, [mergedClassNames, mergedStyles]);
}
const useMergedPickerSemantic = (pickerType, classNames$1, styles, popupClassName, popupStyle) => {
  const {
    classNames: contextClassNames,
    styles: contextStyles
  } = useComponentConfig(pickerType);
  const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, classNames$1], [contextStyles, styles], {
    popup: {
      _default: "root"
    }
  });
  return reactExports.useMemo(() => {
    var _a, _b;
    const filledClassNames = Object.assign(Object.assign({}, mergedClassNames), {
      popup: Object.assign(Object.assign({}, mergedClassNames.popup), {
        root: classNames((_a = mergedClassNames.popup) === null || _a === void 0 ? void 0 : _a.root, popupClassName)
      })
    });
    const filledStyles = Object.assign(Object.assign({}, mergedStyles), {
      popup: Object.assign(Object.assign({}, mergedStyles.popup), {
        root: Object.assign(Object.assign({}, (_b = mergedStyles.popup) === null || _b === void 0 ? void 0 : _b.root), popupStyle)
      })
    });
    return [filledClassNames, filledStyles];
  }, [mergedClassNames, mergedStyles, popupClassName, popupStyle]);
};
var __rest$1 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const generateRangePicker = (generateConfig2) => {
  const RangePicker2 = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
    var _a;
    const {
      prefixCls: customizePrefixCls,
      getPopupContainer: customGetPopupContainer,
      components,
      className,
      style,
      placement,
      size: customizeSize,
      disabled: customDisabled,
      bordered = true,
      placeholder,
      popupStyle,
      popupClassName,
      dropdownClassName,
      status: customStatus,
      rootClassName,
      variant: customVariant,
      picker,
      styles,
      classNames: classNames$1
    } = props, restProps = __rest$1(props, ["prefixCls", "getPopupContainer", "components", "className", "style", "placement", "size", "disabled", "bordered", "placeholder", "popupStyle", "popupClassName", "dropdownClassName", "status", "rootClassName", "variant", "picker", "styles", "classNames"]);
    const pickerType = picker === TIME ? "timePicker" : "datePicker";
    const innerRef = reactExports.useRef(null);
    const {
      getPrefixCls,
      direction,
      getPopupContainer,
      rangePicker
    } = reactExports.useContext(ConfigContext);
    const prefixCls = getPrefixCls("picker", customizePrefixCls);
    const {
      compactSize,
      compactItemClassnames
    } = useCompactItemContext(prefixCls, direction);
    const rootPrefixCls = getPrefixCls();
    const [variant, enableVariantCls] = useVariant("rangePicker", customVariant, bordered);
    const rootCls = useCSSVarCls(prefixCls);
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
    const [mergedClassNames, mergedStyles] = useMergedPickerSemantic(pickerType, classNames$1, styles, popupClassName || dropdownClassName, popupStyle);
    const [mergedAllowClear] = useIcons(props, prefixCls);
    const mergedComponents = useComponents(components);
    const mergedSize = useSize((ctx) => {
      var _a2;
      return (_a2 = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a2 !== void 0 ? _a2 : ctx;
    });
    const disabled = reactExports.useContext(DisabledContext);
    const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
    const formItemContext = reactExports.useContext(FormItemInputContext);
    const {
      hasFeedback,
      status: contextStatus,
      feedbackIcon
    } = formItemContext;
    const suffixNode = /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, picker === TIME ? /* @__PURE__ */ reactExports.createElement(RefIcon$1, null) : /* @__PURE__ */ reactExports.createElement(RefIcon$2, null), hasFeedback && feedbackIcon);
    reactExports.useImperativeHandle(ref, () => innerRef.current);
    const [contextLocale] = useLocale$1("Calendar", locale);
    const locale$1 = Object.assign(Object.assign({}, contextLocale), props.locale);
    const [zIndex] = useZIndex("DatePicker", (_a = mergedStyles.popup.root) === null || _a === void 0 ? void 0 : _a.zIndex);
    return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(ContextIsolator, {
      space: true
    }, /* @__PURE__ */ reactExports.createElement(RefRangePicker, Object.assign({
      separator: /* @__PURE__ */ reactExports.createElement("span", {
        "aria-label": "to",
        className: `${prefixCls}-separator`
      }, /* @__PURE__ */ reactExports.createElement(RefIcon, null)),
      disabled: mergedDisabled,
      ref: innerRef,
      placement,
      placeholder: getRangePlaceholder(locale$1, picker, placeholder),
      suffixIcon: suffixNode,
      prevIcon: /* @__PURE__ */ reactExports.createElement("span", {
        className: `${prefixCls}-prev-icon`
      }),
      nextIcon: /* @__PURE__ */ reactExports.createElement("span", {
        className: `${prefixCls}-next-icon`
      }),
      superPrevIcon: /* @__PURE__ */ reactExports.createElement("span", {
        className: `${prefixCls}-super-prev-icon`
      }),
      superNextIcon: /* @__PURE__ */ reactExports.createElement("span", {
        className: `${prefixCls}-super-next-icon`
      }),
      transitionName: `${rootPrefixCls}-slide-up`,
      picker
    }, restProps, {
      className: classNames({
        [`${prefixCls}-${mergedSize}`]: mergedSize,
        [`${prefixCls}-${variant}`]: enableVariantCls
      }, getStatusClassNames(prefixCls, getMergedStatus(contextStatus, customStatus), hasFeedback), hashId, compactItemClassnames, className, rangePicker === null || rangePicker === void 0 ? void 0 : rangePicker.className, cssVarCls, rootCls, rootClassName, mergedClassNames.root),
      style: Object.assign(Object.assign(Object.assign({}, rangePicker === null || rangePicker === void 0 ? void 0 : rangePicker.style), style), mergedStyles.root),
      locale: locale$1.lang,
      prefixCls,
      getPopupContainer: customGetPopupContainer || getPopupContainer,
      generateConfig: generateConfig2,
      components: mergedComponents,
      direction,
      classNames: {
        popup: classNames(hashId, cssVarCls, rootCls, rootClassName, mergedClassNames.popup.root)
      },
      styles: {
        popup: Object.assign(Object.assign({}, mergedStyles.popup.root), {
          zIndex
        })
      },
      allowClear: mergedAllowClear
    }))));
  });
  return RangePicker2;
};
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const generatePicker$1 = (generateConfig2) => {
  const getPicker = (picker, displayName) => {
    const consumerName = displayName === TIMEPICKER ? "timePicker" : "datePicker";
    const Picker2 = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
      var _a;
      const {
        prefixCls: customizePrefixCls,
        getPopupContainer: customizeGetPopupContainer,
        components,
        style,
        className,
        rootClassName,
        size: customizeSize,
        bordered,
        placement,
        placeholder,
        popupStyle,
        popupClassName,
        dropdownClassName,
        disabled: customDisabled,
        status: customStatus,
        variant: customVariant,
        onCalendarChange,
        styles,
        classNames: classNames$1
      } = props, restProps = __rest(props, ["prefixCls", "getPopupContainer", "components", "style", "className", "rootClassName", "size", "bordered", "placement", "placeholder", "popupStyle", "popupClassName", "dropdownClassName", "disabled", "status", "variant", "onCalendarChange", "styles", "classNames"]);
      const {
        getPrefixCls,
        direction,
        getPopupContainer,
        // Consume different styles according to different names
        [consumerName]: consumerStyle
      } = reactExports.useContext(ConfigContext);
      const prefixCls = getPrefixCls("picker", customizePrefixCls);
      const {
        compactSize,
        compactItemClassnames
      } = useCompactItemContext(prefixCls, direction);
      const innerRef = reactExports.useRef(null);
      const [variant, enableVariantCls] = useVariant("datePicker", customVariant, bordered);
      const rootCls = useCSSVarCls(prefixCls);
      const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
      reactExports.useImperativeHandle(ref, () => innerRef.current);
      const additionalProps = {
        showToday: true
      };
      const mergedPicker = picker || props.picker;
      const rootPrefixCls = getPrefixCls();
      const {
        onSelect,
        multiple
      } = restProps;
      const hasLegacyOnSelect = onSelect && picker === "time" && !multiple;
      const onInternalCalendarChange = (date, dateStr, info) => {
        onCalendarChange === null || onCalendarChange === void 0 ? void 0 : onCalendarChange(date, dateStr, info);
        if (hasLegacyOnSelect) {
          onSelect(date);
        }
      };
      const [mergedClassNames, mergedStyles] = useMergedPickerSemantic(consumerName, classNames$1, styles, popupClassName || dropdownClassName, popupStyle);
      const [mergedAllowClear, removeIcon] = useIcons(props, prefixCls);
      const mergedComponents = useComponents(components);
      const mergedSize = useSize((ctx) => {
        var _a2;
        return (_a2 = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a2 !== void 0 ? _a2 : ctx;
      });
      const disabled = reactExports.useContext(DisabledContext);
      const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
      const formItemContext = reactExports.useContext(FormItemInputContext);
      const {
        hasFeedback,
        status: contextStatus,
        feedbackIcon
      } = formItemContext;
      const suffixNode = /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, mergedPicker === "time" ? /* @__PURE__ */ reactExports.createElement(RefIcon$1, null) : /* @__PURE__ */ reactExports.createElement(RefIcon$2, null), hasFeedback && feedbackIcon);
      const [contextLocale] = useLocale$1("DatePicker", locale);
      const locale$1 = Object.assign(Object.assign({}, contextLocale), props.locale);
      const [zIndex] = useZIndex("DatePicker", (_a = mergedStyles.popup.root) === null || _a === void 0 ? void 0 : _a.zIndex);
      return wrapCSSVar(/* @__PURE__ */ reactExports.createElement(ContextIsolator, {
        space: true
      }, /* @__PURE__ */ reactExports.createElement(RefPicker, Object.assign({
        ref: innerRef,
        placeholder: getPlaceholder(locale$1, mergedPicker, placeholder),
        suffixIcon: suffixNode,
        placement,
        prevIcon: /* @__PURE__ */ reactExports.createElement("span", {
          className: `${prefixCls}-prev-icon`
        }),
        nextIcon: /* @__PURE__ */ reactExports.createElement("span", {
          className: `${prefixCls}-next-icon`
        }),
        superPrevIcon: /* @__PURE__ */ reactExports.createElement("span", {
          className: `${prefixCls}-super-prev-icon`
        }),
        superNextIcon: /* @__PURE__ */ reactExports.createElement("span", {
          className: `${prefixCls}-super-next-icon`
        }),
        transitionName: `${rootPrefixCls}-slide-up`,
        picker,
        onCalendarChange: onInternalCalendarChange
      }, additionalProps, restProps, {
        locale: locale$1.lang,
        className: classNames({
          [`${prefixCls}-${mergedSize}`]: mergedSize,
          [`${prefixCls}-${variant}`]: enableVariantCls
        }, getStatusClassNames(prefixCls, getMergedStatus(contextStatus, customStatus), hasFeedback), hashId, compactItemClassnames, consumerStyle === null || consumerStyle === void 0 ? void 0 : consumerStyle.className, className, cssVarCls, rootCls, rootClassName, mergedClassNames.root),
        style: Object.assign(Object.assign(Object.assign({}, consumerStyle === null || consumerStyle === void 0 ? void 0 : consumerStyle.style), style), mergedStyles.root),
        prefixCls,
        getPopupContainer: customizeGetPopupContainer || getPopupContainer,
        generateConfig: generateConfig2,
        components: mergedComponents,
        direction,
        disabled: mergedDisabled,
        classNames: {
          popup: classNames(hashId, cssVarCls, rootCls, rootClassName, mergedClassNames.popup.root)
        },
        styles: {
          popup: Object.assign(Object.assign({}, mergedStyles.popup.root), {
            zIndex
          })
        },
        allowClear: mergedAllowClear,
        removeIcon
      }))));
    });
    return Picker2;
  };
  const DatePicker2 = getPicker();
  const WeekPicker = getPicker(WEEK, WEEKPICKER);
  const MonthPicker = getPicker(MONTH, MONTHPICKER);
  const YearPicker = getPicker(YEAR, YEARPICKER);
  const QuarterPicker = getPicker(QUARTER, QUARTERPICKER);
  const TimePicker = getPicker(TIME, TIMEPICKER);
  return {
    DatePicker: DatePicker2,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker
  };
};
const generatePicker = (generateConfig2) => {
  const {
    DatePicker: DatePicker2,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker
  } = generatePicker$1(generateConfig2);
  const RangePicker2 = generateRangePicker(generateConfig2);
  const MergedDatePicker = DatePicker2;
  MergedDatePicker.WeekPicker = WeekPicker;
  MergedDatePicker.MonthPicker = MonthPicker;
  MergedDatePicker.YearPicker = YearPicker;
  MergedDatePicker.RangePicker = RangePicker2;
  MergedDatePicker.TimePicker = TimePicker;
  MergedDatePicker.QuarterPicker = QuarterPicker;
  return MergedDatePicker;
};
const DatePicker = generatePicker(generateConfig);
const PurePanel = genPurePanel(DatePicker, "popupAlign", void 0, "picker");
DatePicker._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
const PureRangePanel = genPurePanel(DatePicker.RangePicker, "popupAlign", void 0, "picker");
DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired = PureRangePanel;
DatePicker.generatePicker = generatePicker;
export {
  DatePicker as D,
  RefPanelPicker as R,
  initPanelComponentToken as a,
  generateConfig as b,
  genPanelStyle as g,
  initPickerPanelToken as i
};
//# sourceMappingURL=index-I1l_E206.js.map
