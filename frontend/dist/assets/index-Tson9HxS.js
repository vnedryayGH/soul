import { a as reactExports } from "./react-DAIzMmXQ.js";
import { b8 as Icon, K as _extends, b6 as _createClass, b7 as _classCallCheck, v as _defineProperty, aV as warningOnce, r as _slicedToArray, aa as useLayoutEffect, bf as isMobile, b9 as wrapperRaf, f as classNames, ad as _objectWithoutProperties, cr as BaseInput, cs as triggerFocus, ae as _typeof, ba as useLayoutUpdateEffect, ac as composeRef, ca as initComponentToken, aS as FastColor, Q as genStyleHooks, R as merge, cf as initInputToken, au as genCompactItemStyle, V as resetComponent, ct as genBasicInputStyle, cb as genOutlinedStyle, cd as genFilledStyle, cc as genUnderlinedStyle, ce as genBorderlessStyle, U as unit, cm as genPlaceholderStyle, cu as genInputGroupStyle, cv as genOutlinedGroupStyle, cw as genFilledGroupStyle, cx as resetIcon, C as ConfigContext, a5 as useCSSVarCls, ax as useCompactItemContext, aw as FormItemInputContext, ai as useSize, av as DisabledContext, aJ as useVariant, ay as getStatusClassNames, az as ContextIsolator, cy as RefIcon$1, co as getMergedStatus, br as ConfigProvider } from "./index-B4P9h-k1.js";
var UpOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z" } }] }, "name": "up", "theme": "outlined" };
var UpOutlined = function UpOutlined2(props, ref) {
  return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
    ref,
    icon: UpOutlined$1
  }));
};
var RefIcon = /* @__PURE__ */ reactExports.forwardRef(UpOutlined);
function supportBigInt() {
  return typeof BigInt === "function";
}
function isEmpty(value) {
  return !value && value !== 0 && !Number.isNaN(value) || !String(value).trim();
}
function trimNumber(numStr) {
  var str = numStr.trim();
  var negative = str.startsWith("-");
  if (negative) {
    str = str.slice(1);
  }
  str = str.replace(/(\.\d*[^0])0*$/, "$1").replace(/\.0*$/, "").replace(/^0+/, "");
  if (str.startsWith(".")) {
    str = "0".concat(str);
  }
  var trimStr = str || "0";
  var splitNumber = trimStr.split(".");
  var integerStr = splitNumber[0] || "0";
  var decimalStr = splitNumber[1] || "0";
  if (integerStr === "0" && decimalStr === "0") {
    negative = false;
  }
  var negativeStr = negative ? "-" : "";
  return {
    negative,
    negativeStr,
    trimStr,
    integerStr,
    decimalStr,
    fullStr: "".concat(negativeStr).concat(trimStr)
  };
}
function isE(number) {
  var str = String(number);
  return !Number.isNaN(Number(str)) && str.includes("e");
}
function getNumberPrecision(number) {
  var numStr = String(number);
  if (isE(number)) {
    var precision = Number(numStr.slice(numStr.indexOf("e-") + 2));
    var decimalMatch = numStr.match(/\.(\d+)/);
    if (decimalMatch !== null && decimalMatch !== void 0 && decimalMatch[1]) {
      precision += decimalMatch[1].length;
    }
    return precision;
  }
  return numStr.includes(".") && validateNumber(numStr) ? numStr.length - numStr.indexOf(".") - 1 : 0;
}
function num2str(number) {
  var numStr = String(number);
  if (isE(number)) {
    if (number > Number.MAX_SAFE_INTEGER) {
      return String(supportBigInt() ? BigInt(number).toString() : Number.MAX_SAFE_INTEGER);
    }
    if (number < Number.MIN_SAFE_INTEGER) {
      return String(supportBigInt() ? BigInt(number).toString() : Number.MIN_SAFE_INTEGER);
    }
    numStr = number.toFixed(getNumberPrecision(numStr));
  }
  return trimNumber(numStr).fullStr;
}
function validateNumber(num) {
  if (typeof num === "number") {
    return !Number.isNaN(num);
  }
  if (!num) {
    return false;
  }
  return (
    // Normal type: 11.28
    /^\s*-?\d+(\.\d+)?\s*$/.test(num) || // Pre-number: 1.
    /^\s*-?\d+\.\s*$/.test(num) || // Post-number: .1
    /^\s*-?\.\d+\s*$/.test(num)
  );
}
var BigIntDecimal = /* @__PURE__ */ function() {
  function BigIntDecimal2(value) {
    _classCallCheck(this, BigIntDecimal2);
    _defineProperty(this, "origin", "");
    _defineProperty(this, "negative", void 0);
    _defineProperty(this, "integer", void 0);
    _defineProperty(this, "decimal", void 0);
    _defineProperty(this, "decimalLen", void 0);
    _defineProperty(this, "empty", void 0);
    _defineProperty(this, "nan", void 0);
    if (isEmpty(value)) {
      this.empty = true;
      return;
    }
    this.origin = String(value);
    if (value === "-" || Number.isNaN(value)) {
      this.nan = true;
      return;
    }
    var mergedValue = value;
    if (isE(mergedValue)) {
      mergedValue = Number(mergedValue);
    }
    mergedValue = typeof mergedValue === "string" ? mergedValue : num2str(mergedValue);
    if (validateNumber(mergedValue)) {
      var trimRet = trimNumber(mergedValue);
      this.negative = trimRet.negative;
      var numbers = trimRet.trimStr.split(".");
      this.integer = BigInt(numbers[0]);
      var decimalStr = numbers[1] || "0";
      this.decimal = BigInt(decimalStr);
      this.decimalLen = decimalStr.length;
    } else {
      this.nan = true;
    }
  }
  _createClass(BigIntDecimal2, [{
    key: "getMark",
    value: function getMark() {
      return this.negative ? "-" : "";
    }
  }, {
    key: "getIntegerStr",
    value: function getIntegerStr() {
      return this.integer.toString();
    }
    /**
     * @private get decimal string
     */
  }, {
    key: "getDecimalStr",
    value: function getDecimalStr() {
      return this.decimal.toString().padStart(this.decimalLen, "0");
    }
    /**
     * @private Align BigIntDecimal with same decimal length. e.g. 12.3 + 5 = 1230000
     * This is used for add function only.
     */
  }, {
    key: "alignDecimal",
    value: function alignDecimal(decimalLength) {
      var str = "".concat(this.getMark()).concat(this.getIntegerStr()).concat(this.getDecimalStr().padEnd(decimalLength, "0"));
      return BigInt(str);
    }
  }, {
    key: "negate",
    value: function negate() {
      var clone = new BigIntDecimal2(this.toString());
      clone.negative = !clone.negative;
      return clone;
    }
  }, {
    key: "cal",
    value: function cal(offset, calculator, calDecimalLen) {
      var maxDecimalLength = Math.max(this.getDecimalStr().length, offset.getDecimalStr().length);
      var myAlignedDecimal = this.alignDecimal(maxDecimalLength);
      var offsetAlignedDecimal = offset.alignDecimal(maxDecimalLength);
      var valueStr = calculator(myAlignedDecimal, offsetAlignedDecimal).toString();
      var nextDecimalLength = calDecimalLen(maxDecimalLength);
      var _trimNumber = trimNumber(valueStr), negativeStr = _trimNumber.negativeStr, trimStr = _trimNumber.trimStr;
      var hydrateValueStr = "".concat(negativeStr).concat(trimStr.padStart(nextDecimalLength + 1, "0"));
      return new BigIntDecimal2("".concat(hydrateValueStr.slice(0, -nextDecimalLength), ".").concat(hydrateValueStr.slice(-nextDecimalLength)));
    }
  }, {
    key: "add",
    value: function add(value) {
      if (this.isInvalidate()) {
        return new BigIntDecimal2(value);
      }
      var offset = new BigIntDecimal2(value);
      if (offset.isInvalidate()) {
        return this;
      }
      return this.cal(offset, function(num1, num2) {
        return num1 + num2;
      }, function(len) {
        return len;
      });
    }
  }, {
    key: "multi",
    value: function multi(value) {
      var target = new BigIntDecimal2(value);
      if (this.isInvalidate() || target.isInvalidate()) {
        return new BigIntDecimal2(NaN);
      }
      return this.cal(target, function(num1, num2) {
        return num1 * num2;
      }, function(len) {
        return len * 2;
      });
    }
  }, {
    key: "isEmpty",
    value: function isEmpty2() {
      return this.empty;
    }
  }, {
    key: "isNaN",
    value: function isNaN() {
      return this.nan;
    }
  }, {
    key: "isInvalidate",
    value: function isInvalidate() {
      return this.isEmpty() || this.isNaN();
    }
  }, {
    key: "equals",
    value: function equals(target) {
      return this.toString() === (target === null || target === void 0 ? void 0 : target.toString());
    }
  }, {
    key: "lessEquals",
    value: function lessEquals(target) {
      return this.add(target.negate().toString()).toNumber() <= 0;
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      if (this.isNaN()) {
        return NaN;
      }
      return Number(this.toString());
    }
  }, {
    key: "toString",
    value: function toString() {
      var safe = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      if (!safe) {
        return this.origin;
      }
      if (this.isInvalidate()) {
        return "";
      }
      return trimNumber("".concat(this.getMark()).concat(this.getIntegerStr(), ".").concat(this.getDecimalStr())).fullStr;
    }
  }]);
  return BigIntDecimal2;
}();
var NumberDecimal = /* @__PURE__ */ function() {
  function NumberDecimal2(value) {
    _classCallCheck(this, NumberDecimal2);
    _defineProperty(this, "origin", "");
    _defineProperty(this, "number", void 0);
    _defineProperty(this, "empty", void 0);
    if (isEmpty(value)) {
      this.empty = true;
      return;
    }
    this.origin = String(value);
    this.number = Number(value);
  }
  _createClass(NumberDecimal2, [{
    key: "negate",
    value: function negate() {
      return new NumberDecimal2(-this.toNumber());
    }
  }, {
    key: "add",
    value: function add(value) {
      if (this.isInvalidate()) {
        return new NumberDecimal2(value);
      }
      var target = Number(value);
      if (Number.isNaN(target)) {
        return this;
      }
      var number = this.number + target;
      if (number > Number.MAX_SAFE_INTEGER) {
        return new NumberDecimal2(Number.MAX_SAFE_INTEGER);
      }
      if (number < Number.MIN_SAFE_INTEGER) {
        return new NumberDecimal2(Number.MIN_SAFE_INTEGER);
      }
      var maxPrecision = Math.max(getNumberPrecision(this.number), getNumberPrecision(target));
      return new NumberDecimal2(number.toFixed(maxPrecision));
    }
  }, {
    key: "multi",
    value: function multi(value) {
      var target = Number(value);
      if (this.isInvalidate() || Number.isNaN(target)) {
        return new NumberDecimal2(NaN);
      }
      var number = this.number * target;
      if (number > Number.MAX_SAFE_INTEGER) {
        return new NumberDecimal2(Number.MAX_SAFE_INTEGER);
      }
      if (number < Number.MIN_SAFE_INTEGER) {
        return new NumberDecimal2(Number.MIN_SAFE_INTEGER);
      }
      var maxPrecision = Math.max(getNumberPrecision(this.number), getNumberPrecision(target));
      return new NumberDecimal2(number.toFixed(maxPrecision));
    }
  }, {
    key: "isEmpty",
    value: function isEmpty2() {
      return this.empty;
    }
  }, {
    key: "isNaN",
    value: function isNaN() {
      return Number.isNaN(this.number);
    }
  }, {
    key: "isInvalidate",
    value: function isInvalidate() {
      return this.isEmpty() || this.isNaN();
    }
  }, {
    key: "equals",
    value: function equals(target) {
      return this.toNumber() === (target === null || target === void 0 ? void 0 : target.toNumber());
    }
  }, {
    key: "lessEquals",
    value: function lessEquals(target) {
      return this.add(target.negate().toString()).toNumber() <= 0;
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      return this.number;
    }
  }, {
    key: "toString",
    value: function toString() {
      var safe = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      if (!safe) {
        return this.origin;
      }
      if (this.isInvalidate()) {
        return "";
      }
      return num2str(this.number);
    }
  }]);
  return NumberDecimal2;
}();
function getMiniDecimal(value) {
  if (supportBigInt()) {
    return new BigIntDecimal(value);
  }
  return new NumberDecimal(value);
}
function toFixed(numStr, separatorStr, precision) {
  var cutOnly = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  if (numStr === "") {
    return "";
  }
  var _trimNumber = trimNumber(numStr), negativeStr = _trimNumber.negativeStr, integerStr = _trimNumber.integerStr, decimalStr = _trimNumber.decimalStr;
  var precisionDecimalStr = "".concat(separatorStr).concat(decimalStr);
  var numberWithoutDecimal = "".concat(negativeStr).concat(integerStr);
  if (precision >= 0) {
    var advancedNum = Number(decimalStr[precision]);
    if (advancedNum >= 5 && !cutOnly) {
      var advancedDecimal = getMiniDecimal(numStr).add("".concat(negativeStr, "0.").concat("0".repeat(precision)).concat(10 - advancedNum));
      return toFixed(advancedDecimal.toString(), separatorStr, precision, cutOnly);
    }
    if (precision === 0) {
      return numberWithoutDecimal;
    }
    return "".concat(numberWithoutDecimal).concat(separatorStr).concat(decimalStr.padEnd(precision, "0").slice(0, precision));
  }
  if (precisionDecimalStr === ".0") {
    return numberWithoutDecimal;
  }
  return "".concat(numberWithoutDecimal).concat(precisionDecimalStr);
}
function proxyObject(obj, extendProps) {
  if (typeof Proxy !== "undefined" && obj) {
    return new Proxy(obj, {
      get: function get(target, prop) {
        if (extendProps[prop]) {
          return extendProps[prop];
        }
        var originProp = target[prop];
        return typeof originProp === "function" ? originProp.bind(target) : originProp;
      }
    });
  }
  return obj;
}
function useCursor(input, focused) {
  var selectionRef = reactExports.useRef(null);
  function recordCursor() {
    try {
      var start = input.selectionStart, end = input.selectionEnd, value = input.value;
      var beforeTxt = value.substring(0, start);
      var afterTxt = value.substring(end);
      selectionRef.current = {
        start,
        end,
        value,
        beforeTxt,
        afterTxt
      };
    } catch (e) {
    }
  }
  function restoreCursor() {
    if (input && selectionRef.current && focused) {
      try {
        var value = input.value;
        var _selectionRef$current = selectionRef.current, beforeTxt = _selectionRef$current.beforeTxt, afterTxt = _selectionRef$current.afterTxt, start = _selectionRef$current.start;
        var startPos = value.length;
        if (value.startsWith(beforeTxt)) {
          startPos = beforeTxt.length;
        } else if (value.endsWith(afterTxt)) {
          startPos = value.length - selectionRef.current.afterTxt.length;
        } else {
          var beforeLastChar = beforeTxt[start - 1];
          var newIndex = value.indexOf(beforeLastChar, start - 1);
          if (newIndex !== -1) {
            startPos = newIndex + 1;
          }
        }
        input.setSelectionRange(startPos, startPos);
      } catch (e) {
        warningOnce(false, "Something warning of cursor restore. Please fire issue about this: ".concat(e.message));
      }
    }
  }
  return [recordCursor, restoreCursor];
}
var useMobile = function useMobile2() {
  var _useState = reactExports.useState(false), _useState2 = _slicedToArray(_useState, 2), mobile = _useState2[0], setMobile = _useState2[1];
  useLayoutEffect(function() {
    setMobile(isMobile());
  }, []);
  return mobile;
};
var STEP_INTERVAL = 200;
var STEP_DELAY = 600;
function StepHandler(_ref) {
  var prefixCls = _ref.prefixCls, upNode = _ref.upNode, downNode = _ref.downNode, upDisabled = _ref.upDisabled, downDisabled = _ref.downDisabled, onStep = _ref.onStep;
  var stepTimeoutRef = reactExports.useRef();
  var frameIds = reactExports.useRef([]);
  var onStepRef = reactExports.useRef();
  onStepRef.current = onStep;
  var onStopStep = function onStopStep2() {
    clearTimeout(stepTimeoutRef.current);
  };
  var onStepMouseDown = function onStepMouseDown2(e, up) {
    e.preventDefault();
    onStopStep();
    onStepRef.current(up);
    function loopStep() {
      onStepRef.current(up);
      stepTimeoutRef.current = setTimeout(loopStep, STEP_INTERVAL);
    }
    stepTimeoutRef.current = setTimeout(loopStep, STEP_DELAY);
  };
  reactExports.useEffect(function() {
    return function() {
      onStopStep();
      frameIds.current.forEach(function(id) {
        return wrapperRaf.cancel(id);
      });
    };
  }, []);
  var isMobile2 = useMobile();
  if (isMobile2) {
    return null;
  }
  var handlerClassName = "".concat(prefixCls, "-handler");
  var upClassName = classNames(handlerClassName, "".concat(handlerClassName, "-up"), _defineProperty({}, "".concat(handlerClassName, "-up-disabled"), upDisabled));
  var downClassName = classNames(handlerClassName, "".concat(handlerClassName, "-down"), _defineProperty({}, "".concat(handlerClassName, "-down-disabled"), downDisabled));
  var safeOnStopStep = function safeOnStopStep2() {
    return frameIds.current.push(wrapperRaf(onStopStep));
  };
  var sharedHandlerProps = {
    unselectable: "on",
    role: "button",
    onMouseUp: safeOnStopStep,
    onMouseLeave: safeOnStopStep
  };
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(handlerClassName, "-wrap")
  }, /* @__PURE__ */ reactExports.createElement("span", _extends({}, sharedHandlerProps, {
    onMouseDown: function onMouseDown(e) {
      onStepMouseDown(e, true);
    },
    "aria-label": "Increase Value",
    "aria-disabled": upDisabled,
    className: upClassName
  }), upNode || /* @__PURE__ */ reactExports.createElement("span", {
    unselectable: "on",
    className: "".concat(prefixCls, "-handler-up-inner")
  })), /* @__PURE__ */ reactExports.createElement("span", _extends({}, sharedHandlerProps, {
    onMouseDown: function onMouseDown(e) {
      onStepMouseDown(e, false);
    },
    "aria-label": "Decrease Value",
    "aria-disabled": downDisabled,
    className: downClassName
  }), downNode || /* @__PURE__ */ reactExports.createElement("span", {
    unselectable: "on",
    className: "".concat(prefixCls, "-handler-down-inner")
  })));
}
function getDecupleSteps(step) {
  var stepStr = typeof step === "number" ? num2str(step) : trimNumber(step).fullStr;
  var hasPoint = stepStr.includes(".");
  if (!hasPoint) {
    return step + "0";
  }
  return trimNumber(stepStr.replace(/(\d)\.(\d)/g, "$1$2.")).fullStr;
}
const useFrame = function() {
  var idRef = reactExports.useRef(0);
  var cleanUp = function cleanUp2() {
    wrapperRaf.cancel(idRef.current);
  };
  reactExports.useEffect(function() {
    return cleanUp;
  }, []);
  return function(callback) {
    cleanUp();
    idRef.current = wrapperRaf(function() {
      callback();
    });
  };
};
var _excluded = ["prefixCls", "className", "style", "min", "max", "step", "defaultValue", "value", "disabled", "readOnly", "upHandler", "downHandler", "keyboard", "changeOnWheel", "controls", "classNames", "stringMode", "parser", "formatter", "precision", "decimalSeparator", "onChange", "onInput", "onPressEnter", "onStep", "changeOnBlur", "domRef"], _excluded2 = ["disabled", "style", "prefixCls", "value", "prefix", "suffix", "addonBefore", "addonAfter", "className", "classNames"];
var getDecimalValue = function getDecimalValue2(stringMode, decimalValue) {
  if (stringMode || decimalValue.isEmpty()) {
    return decimalValue.toString();
  }
  return decimalValue.toNumber();
};
var getDecimalIfValidate = function getDecimalIfValidate2(value) {
  var decimal = getMiniDecimal(value);
  return decimal.isInvalidate() ? null : decimal;
};
var InternalInputNumber = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, className = props.className, style = props.style, min = props.min, max = props.max, _props$step = props.step, step = _props$step === void 0 ? 1 : _props$step, defaultValue = props.defaultValue, value = props.value, disabled = props.disabled, readOnly = props.readOnly, upHandler = props.upHandler, downHandler = props.downHandler, keyboard = props.keyboard, _props$changeOnWheel = props.changeOnWheel, changeOnWheel = _props$changeOnWheel === void 0 ? false : _props$changeOnWheel, _props$controls = props.controls, controls = _props$controls === void 0 ? true : _props$controls;
  props.classNames;
  var stringMode = props.stringMode, parser = props.parser, formatter = props.formatter, precision = props.precision, decimalSeparator = props.decimalSeparator, onChange = props.onChange, onInput = props.onInput, onPressEnter = props.onPressEnter, onStep = props.onStep, _props$changeOnBlur = props.changeOnBlur, changeOnBlur = _props$changeOnBlur === void 0 ? true : _props$changeOnBlur, domRef = props.domRef, inputProps = _objectWithoutProperties(props, _excluded);
  var inputClassName = "".concat(prefixCls, "-input");
  var inputRef = reactExports.useRef(null);
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), focus = _React$useState2[0], setFocus = _React$useState2[1];
  var userTypingRef = reactExports.useRef(false);
  var compositionRef = reactExports.useRef(false);
  var shiftKeyRef = reactExports.useRef(false);
  var _React$useState3 = reactExports.useState(function() {
    return getMiniDecimal(value !== null && value !== void 0 ? value : defaultValue);
  }), _React$useState4 = _slicedToArray(_React$useState3, 2), decimalValue = _React$useState4[0], setDecimalValue = _React$useState4[1];
  function setUncontrolledDecimalValue(newDecimal) {
    if (value === void 0) {
      setDecimalValue(newDecimal);
    }
  }
  var getPrecision = reactExports.useCallback(function(numStr, userTyping) {
    if (userTyping) {
      return void 0;
    }
    if (precision >= 0) {
      return precision;
    }
    return Math.max(getNumberPrecision(numStr), getNumberPrecision(step));
  }, [precision, step]);
  var mergedParser = reactExports.useCallback(function(num) {
    var numStr = String(num);
    if (parser) {
      return parser(numStr);
    }
    var parsedStr = numStr;
    if (decimalSeparator) {
      parsedStr = parsedStr.replace(decimalSeparator, ".");
    }
    return parsedStr.replace(/[^\w.-]+/g, "");
  }, [parser, decimalSeparator]);
  var inputValueRef = reactExports.useRef("");
  var mergedFormatter = reactExports.useCallback(function(number, userTyping) {
    if (formatter) {
      return formatter(number, {
        userTyping,
        input: String(inputValueRef.current)
      });
    }
    var str = typeof number === "number" ? num2str(number) : number;
    if (!userTyping) {
      var mergedPrecision = getPrecision(str, userTyping);
      if (validateNumber(str) && (decimalSeparator || mergedPrecision >= 0)) {
        var separatorStr = decimalSeparator || ".";
        str = toFixed(str, separatorStr, mergedPrecision);
      }
    }
    return str;
  }, [formatter, getPrecision, decimalSeparator]);
  var _React$useState5 = reactExports.useState(function() {
    var initValue = defaultValue !== null && defaultValue !== void 0 ? defaultValue : value;
    if (decimalValue.isInvalidate() && ["string", "number"].includes(_typeof(initValue))) {
      return Number.isNaN(initValue) ? "" : initValue;
    }
    return mergedFormatter(decimalValue.toString(), false);
  }), _React$useState6 = _slicedToArray(_React$useState5, 2), inputValue = _React$useState6[0], setInternalInputValue = _React$useState6[1];
  inputValueRef.current = inputValue;
  function setInputValue(newValue, userTyping) {
    setInternalInputValue(mergedFormatter(
      // Invalidate number is sometime passed by external control, we should let it go
      // Otherwise is controlled by internal interactive logic which check by userTyping
      // You can ref 'show limited value when input is not focused' test for more info.
      newValue.isInvalidate() ? newValue.toString(false) : newValue.toString(!userTyping),
      userTyping
    ));
  }
  var maxDecimal = reactExports.useMemo(function() {
    return getDecimalIfValidate(max);
  }, [max, precision]);
  var minDecimal = reactExports.useMemo(function() {
    return getDecimalIfValidate(min);
  }, [min, precision]);
  var upDisabled = reactExports.useMemo(function() {
    if (!maxDecimal || !decimalValue || decimalValue.isInvalidate()) {
      return false;
    }
    return maxDecimal.lessEquals(decimalValue);
  }, [maxDecimal, decimalValue]);
  var downDisabled = reactExports.useMemo(function() {
    if (!minDecimal || !decimalValue || decimalValue.isInvalidate()) {
      return false;
    }
    return decimalValue.lessEquals(minDecimal);
  }, [minDecimal, decimalValue]);
  var _useCursor = useCursor(inputRef.current, focus), _useCursor2 = _slicedToArray(_useCursor, 2), recordCursor = _useCursor2[0], restoreCursor = _useCursor2[1];
  var getRangeValue = function getRangeValue2(target) {
    if (maxDecimal && !target.lessEquals(maxDecimal)) {
      return maxDecimal;
    }
    if (minDecimal && !minDecimal.lessEquals(target)) {
      return minDecimal;
    }
    return null;
  };
  var isInRange = function isInRange2(target) {
    return !getRangeValue(target);
  };
  var triggerValueUpdate = function triggerValueUpdate2(newValue, userTyping) {
    var updateValue = newValue;
    var isRangeValidate = isInRange(updateValue) || updateValue.isEmpty();
    if (!updateValue.isEmpty() && !userTyping) {
      updateValue = getRangeValue(updateValue) || updateValue;
      isRangeValidate = true;
    }
    if (!readOnly && !disabled && isRangeValidate) {
      var numStr = updateValue.toString();
      var mergedPrecision = getPrecision(numStr, userTyping);
      if (mergedPrecision >= 0) {
        updateValue = getMiniDecimal(toFixed(numStr, ".", mergedPrecision));
        if (!isInRange(updateValue)) {
          updateValue = getMiniDecimal(toFixed(numStr, ".", mergedPrecision, true));
        }
      }
      if (!updateValue.equals(decimalValue)) {
        setUncontrolledDecimalValue(updateValue);
        onChange === null || onChange === void 0 || onChange(updateValue.isEmpty() ? null : getDecimalValue(stringMode, updateValue));
        if (value === void 0) {
          setInputValue(updateValue, userTyping);
        }
      }
      return updateValue;
    }
    return decimalValue;
  };
  var onNextPromise = useFrame();
  var collectInputValue = function collectInputValue2(inputStr) {
    recordCursor();
    inputValueRef.current = inputStr;
    setInternalInputValue(inputStr);
    if (!compositionRef.current) {
      var finalValue = mergedParser(inputStr);
      var finalDecimal = getMiniDecimal(finalValue);
      if (!finalDecimal.isNaN()) {
        triggerValueUpdate(finalDecimal, true);
      }
    }
    onInput === null || onInput === void 0 || onInput(inputStr);
    onNextPromise(function() {
      var nextInputStr = inputStr;
      if (!parser) {
        nextInputStr = inputStr.replace(/。/g, ".");
      }
      if (nextInputStr !== inputStr) {
        collectInputValue2(nextInputStr);
      }
    });
  };
  var onCompositionStart = function onCompositionStart2() {
    compositionRef.current = true;
  };
  var onCompositionEnd = function onCompositionEnd2() {
    compositionRef.current = false;
    collectInputValue(inputRef.current.value);
  };
  var onInternalInput = function onInternalInput2(e) {
    collectInputValue(e.target.value);
  };
  var onInternalStep = function onInternalStep2(up) {
    var _inputRef$current;
    if (up && upDisabled || !up && downDisabled) {
      return;
    }
    userTypingRef.current = false;
    var stepDecimal = getMiniDecimal(shiftKeyRef.current ? getDecupleSteps(step) : step);
    if (!up) {
      stepDecimal = stepDecimal.negate();
    }
    var target = (decimalValue || getMiniDecimal(0)).add(stepDecimal.toString());
    var updatedValue = triggerValueUpdate(target, false);
    onStep === null || onStep === void 0 || onStep(getDecimalValue(stringMode, updatedValue), {
      offset: shiftKeyRef.current ? getDecupleSteps(step) : step,
      type: up ? "up" : "down"
    });
    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 || _inputRef$current.focus();
  };
  var flushInputValue = function flushInputValue2(userTyping) {
    var parsedValue = getMiniDecimal(mergedParser(inputValue));
    var formatValue;
    if (!parsedValue.isNaN()) {
      formatValue = triggerValueUpdate(parsedValue, userTyping);
    } else {
      formatValue = triggerValueUpdate(decimalValue, userTyping);
    }
    if (value !== void 0) {
      setInputValue(decimalValue, false);
    } else if (!formatValue.isNaN()) {
      setInputValue(formatValue, false);
    }
  };
  var onBeforeInput = function onBeforeInput2() {
    userTypingRef.current = true;
  };
  var onKeyDown = function onKeyDown2(event) {
    var key = event.key, shiftKey = event.shiftKey;
    userTypingRef.current = true;
    shiftKeyRef.current = shiftKey;
    if (key === "Enter") {
      if (!compositionRef.current) {
        userTypingRef.current = false;
      }
      flushInputValue(false);
      onPressEnter === null || onPressEnter === void 0 || onPressEnter(event);
    }
    if (keyboard === false) {
      return;
    }
    if (!compositionRef.current && ["Up", "ArrowUp", "Down", "ArrowDown"].includes(key)) {
      onInternalStep(key === "Up" || key === "ArrowUp");
      event.preventDefault();
    }
  };
  var onKeyUp = function onKeyUp2() {
    userTypingRef.current = false;
    shiftKeyRef.current = false;
  };
  reactExports.useEffect(function() {
    if (changeOnWheel && focus) {
      var onWheel = function onWheel2(event) {
        onInternalStep(event.deltaY < 0);
        event.preventDefault();
      };
      var input = inputRef.current;
      if (input) {
        input.addEventListener("wheel", onWheel, {
          passive: false
        });
        return function() {
          return input.removeEventListener("wheel", onWheel);
        };
      }
    }
  });
  var onBlur = function onBlur2() {
    if (changeOnBlur) {
      flushInputValue(false);
    }
    setFocus(false);
    userTypingRef.current = false;
  };
  useLayoutUpdateEffect(function() {
    if (!decimalValue.isInvalidate()) {
      setInputValue(decimalValue, false);
    }
  }, [precision, formatter]);
  useLayoutUpdateEffect(function() {
    var newValue = getMiniDecimal(value);
    setDecimalValue(newValue);
    var currentParsedValue = getMiniDecimal(mergedParser(inputValue));
    if (!newValue.equals(currentParsedValue) || !userTypingRef.current || formatter) {
      setInputValue(newValue, userTypingRef.current);
    }
  }, [value]);
  useLayoutUpdateEffect(function() {
    if (formatter) {
      restoreCursor();
    }
  }, [inputValue]);
  return /* @__PURE__ */ reactExports.createElement("div", {
    ref: domRef,
    className: classNames(prefixCls, className, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(prefixCls, "-focused"), focus), "".concat(prefixCls, "-disabled"), disabled), "".concat(prefixCls, "-readonly"), readOnly), "".concat(prefixCls, "-not-a-number"), decimalValue.isNaN()), "".concat(prefixCls, "-out-of-range"), !decimalValue.isInvalidate() && !isInRange(decimalValue))),
    style,
    onFocus: function onFocus() {
      setFocus(true);
    },
    onBlur,
    onKeyDown,
    onKeyUp,
    onCompositionStart,
    onCompositionEnd,
    onBeforeInput
  }, controls && /* @__PURE__ */ reactExports.createElement(StepHandler, {
    prefixCls,
    upNode: upHandler,
    downNode: downHandler,
    upDisabled,
    downDisabled,
    onStep: onInternalStep
  }), /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(inputClassName, "-wrap")
  }, /* @__PURE__ */ reactExports.createElement("input", _extends({
    autoComplete: "off",
    role: "spinbutton",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": decimalValue.isInvalidate() ? null : decimalValue.toString(),
    step
  }, inputProps, {
    ref: composeRef(inputRef, ref),
    className: inputClassName,
    value: inputValue,
    onChange: onInternalInput,
    disabled,
    readOnly
  }))));
});
var InputNumber$1 = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var disabled = props.disabled, style = props.style, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-input-number" : _props$prefixCls, value = props.value, prefix = props.prefix, suffix = props.suffix, addonBefore = props.addonBefore, addonAfter = props.addonAfter, className = props.className, classNames2 = props.classNames, rest = _objectWithoutProperties(props, _excluded2);
  var holderRef = reactExports.useRef(null);
  var inputNumberDomRef = reactExports.useRef(null);
  var inputFocusRef = reactExports.useRef(null);
  var focus = function focus2(option) {
    if (inputFocusRef.current) {
      triggerFocus(inputFocusRef.current, option);
    }
  };
  reactExports.useImperativeHandle(ref, function() {
    return proxyObject(inputFocusRef.current, {
      focus,
      nativeElement: holderRef.current.nativeElement || inputNumberDomRef.current
    });
  });
  return /* @__PURE__ */ reactExports.createElement(BaseInput, {
    className,
    triggerFocus: focus,
    prefixCls,
    value,
    disabled,
    style,
    prefix,
    suffix,
    addonAfter,
    addonBefore,
    classNames: classNames2,
    components: {
      affixWrapper: "div",
      groupWrapper: "div",
      wrapper: "div",
      groupAddon: "div"
    },
    ref: holderRef
  }, /* @__PURE__ */ reactExports.createElement(InternalInputNumber, _extends({
    prefixCls,
    disabled,
    ref: inputFocusRef,
    domRef: inputNumberDomRef,
    className: classNames2 === null || classNames2 === void 0 ? void 0 : classNames2.input
  }, rest)));
});
const prepareComponentToken = (token) => {
  var _a;
  const handleVisible = (_a = token.handleVisible) !== null && _a !== void 0 ? _a : "auto";
  const handleWidth = token.controlHeightSM - token.lineWidth * 2;
  return Object.assign(Object.assign({}, initComponentToken(token)), {
    controlWidth: 90,
    handleWidth,
    handleFontSize: token.fontSize / 2,
    handleVisible,
    handleActiveBg: token.colorFillAlter,
    handleBg: token.colorBgContainer,
    filledHandleBg: new FastColor(token.colorFillSecondary).onBackground(token.colorBgContainer).toHexString(),
    handleHoverColor: token.colorPrimary,
    handleBorderColor: token.colorBorder,
    handleOpacity: handleVisible === true ? 1 : 0,
    handleVisibleWidth: handleVisible === true ? handleWidth : 0
  });
};
const genRadiusStyle = ({
  componentCls,
  borderRadiusSM,
  borderRadiusLG
}, size) => {
  const borderRadius = size === "lg" ? borderRadiusLG : borderRadiusSM;
  return {
    [`&-${size}`]: {
      [`${componentCls}-handler-wrap`]: {
        borderStartEndRadius: borderRadius,
        borderEndEndRadius: borderRadius
      },
      [`${componentCls}-handler-up`]: {
        borderStartEndRadius: borderRadius
      },
      [`${componentCls}-handler-down`]: {
        borderEndEndRadius: borderRadius
      }
    }
  };
};
const genInputNumberStyles = (token) => {
  const {
    componentCls,
    lineWidth,
    lineType,
    borderRadius,
    inputFontSizeSM,
    inputFontSizeLG,
    controlHeightLG,
    controlHeightSM,
    colorError,
    paddingInlineSM,
    paddingBlockSM,
    paddingBlockLG,
    paddingInlineLG,
    colorIcon,
    motionDurationMid,
    handleHoverColor,
    handleOpacity,
    paddingInline,
    paddingBlock,
    handleBg,
    handleActiveBg,
    colorTextDisabled,
    borderRadiusSM,
    borderRadiusLG,
    controlWidth,
    handleBorderColor,
    filledHandleBg,
    lineHeightLG,
    calc
  } = token;
  return [
    {
      [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genBasicInputStyle(token)), {
        display: "inline-block",
        width: controlWidth,
        margin: 0,
        padding: 0,
        borderRadius
      }), genOutlinedStyle(token, {
        [`${componentCls}-handler-wrap`]: {
          background: handleBg,
          [`${componentCls}-handler-down`]: {
            borderBlockStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`
          }
        }
      })), genFilledStyle(token, {
        [`${componentCls}-handler-wrap`]: {
          background: filledHandleBg,
          [`${componentCls}-handler-down`]: {
            borderBlockStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`
          }
        },
        "&:focus-within": {
          [`${componentCls}-handler-wrap`]: {
            background: handleBg
          }
        }
      })), genUnderlinedStyle(token, {
        [`${componentCls}-handler-wrap`]: {
          background: handleBg,
          [`${componentCls}-handler-down`]: {
            borderBlockStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`
          }
        }
      })), genBorderlessStyle(token)), {
        "&-rtl": {
          direction: "rtl",
          [`${componentCls}-input`]: {
            direction: "rtl"
          }
        },
        "&-lg": {
          padding: 0,
          fontSize: inputFontSizeLG,
          lineHeight: lineHeightLG,
          borderRadius: borderRadiusLG,
          [`input${componentCls}-input`]: {
            height: calc(controlHeightLG).sub(calc(lineWidth).mul(2)).equal(),
            padding: `${unit(paddingBlockLG)} ${unit(paddingInlineLG)}`
          }
        },
        "&-sm": {
          padding: 0,
          fontSize: inputFontSizeSM,
          borderRadius: borderRadiusSM,
          [`input${componentCls}-input`]: {
            height: calc(controlHeightSM).sub(calc(lineWidth).mul(2)).equal(),
            padding: `${unit(paddingBlockSM)} ${unit(paddingInlineSM)}`
          }
        },
        // ===================== Out Of Range =====================
        "&-out-of-range": {
          [`${componentCls}-input-wrap`]: {
            input: {
              color: colorError
            }
          }
        },
        // Style for input-group: input with label, with button or dropdown...
        "&-group": Object.assign(Object.assign(Object.assign({}, resetComponent(token)), genInputGroupStyle(token)), {
          "&-wrapper": Object.assign(Object.assign(Object.assign({
            display: "inline-block",
            textAlign: "start",
            verticalAlign: "top",
            [`${componentCls}-affix-wrapper`]: {
              width: "100%"
            },
            // Size
            "&-lg": {
              [`${componentCls}-group-addon`]: {
                borderRadius: borderRadiusLG,
                fontSize: token.fontSizeLG
              }
            },
            "&-sm": {
              [`${componentCls}-group-addon`]: {
                borderRadius: borderRadiusSM
              }
            }
          }, genOutlinedGroupStyle(token)), genFilledGroupStyle(token)), {
            // Fix the issue of using icons in Space Compact mode
            // https://github.com/ant-design/ant-design/issues/45764
            [`&:not(${componentCls}-compact-first-item):not(${componentCls}-compact-last-item)${componentCls}-compact-item`]: {
              [`${componentCls}, ${componentCls}-group-addon`]: {
                borderRadius: 0
              }
            },
            [`&:not(${componentCls}-compact-last-item)${componentCls}-compact-first-item`]: {
              [`${componentCls}, ${componentCls}-group-addon`]: {
                borderStartEndRadius: 0,
                borderEndEndRadius: 0
              }
            },
            [`&:not(${componentCls}-compact-first-item)${componentCls}-compact-last-item`]: {
              [`${componentCls}, ${componentCls}-group-addon`]: {
                borderStartStartRadius: 0,
                borderEndStartRadius: 0
              }
            }
          })
        }),
        [`&-disabled ${componentCls}-input`]: {
          cursor: "not-allowed"
        },
        [componentCls]: {
          "&-input": Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
            width: "100%",
            padding: `${unit(paddingBlock)} ${unit(paddingInline)}`,
            textAlign: "start",
            backgroundColor: "transparent",
            border: 0,
            borderRadius,
            outline: 0,
            transition: `all ${motionDurationMid} linear`,
            appearance: "textfield",
            fontSize: "inherit"
          }), genPlaceholderStyle(token.colorTextPlaceholder)), {
            '&[type="number"]::-webkit-inner-spin-button, &[type="number"]::-webkit-outer-spin-button': {
              margin: 0,
              appearance: "none"
            }
          })
        },
        [`&:hover ${componentCls}-handler-wrap, &-focused ${componentCls}-handler-wrap`]: {
          width: token.handleWidth,
          opacity: 1
        }
      })
    },
    // Handler
    {
      [componentCls]: Object.assign(Object.assign(Object.assign({
        [`${componentCls}-handler-wrap`]: {
          position: "absolute",
          insetBlockStart: 0,
          insetInlineEnd: 0,
          width: token.handleVisibleWidth,
          opacity: handleOpacity,
          height: "100%",
          borderStartStartRadius: 0,
          borderStartEndRadius: borderRadius,
          borderEndEndRadius: borderRadius,
          borderEndStartRadius: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          transition: `all ${motionDurationMid}`,
          overflow: "hidden",
          // Fix input number inside Menu makes icon too large
          // We arise the selector priority by nest selector here
          // https://github.com/ant-design/ant-design/issues/14367
          [`${componentCls}-handler`]: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "auto",
            height: "40%",
            [`
              ${componentCls}-handler-up-inner,
              ${componentCls}-handler-down-inner
            `]: {
              marginInlineEnd: 0,
              fontSize: token.handleFontSize
            }
          }
        },
        [`${componentCls}-handler`]: {
          height: "50%",
          overflow: "hidden",
          color: colorIcon,
          fontWeight: "bold",
          lineHeight: 0,
          textAlign: "center",
          cursor: "pointer",
          borderInlineStart: `${unit(lineWidth)} ${lineType} ${handleBorderColor}`,
          transition: `all ${motionDurationMid} linear`,
          "&:active": {
            background: handleActiveBg
          },
          // Hover
          "&:hover": {
            height: `60%`,
            [`
              ${componentCls}-handler-up-inner,
              ${componentCls}-handler-down-inner
            `]: {
              color: handleHoverColor
            }
          },
          "&-up-inner, &-down-inner": Object.assign(Object.assign({}, resetIcon()), {
            color: colorIcon,
            transition: `all ${motionDurationMid} linear`,
            userSelect: "none"
          })
        },
        [`${componentCls}-handler-up`]: {
          borderStartEndRadius: borderRadius
        },
        [`${componentCls}-handler-down`]: {
          borderEndEndRadius: borderRadius
        }
      }, genRadiusStyle(token, "lg")), genRadiusStyle(token, "sm")), {
        // Disabled
        "&-disabled, &-readonly": {
          [`${componentCls}-handler-wrap`]: {
            display: "none"
          },
          [`${componentCls}-input`]: {
            color: "inherit"
          }
        },
        [`
          ${componentCls}-handler-up-disabled,
          ${componentCls}-handler-down-disabled
        `]: {
          cursor: "not-allowed"
        },
        [`
          ${componentCls}-handler-up-disabled:hover &-handler-up-inner,
          ${componentCls}-handler-down-disabled:hover &-handler-down-inner
        `]: {
          color: colorTextDisabled
        }
      })
    }
  ];
};
const genAffixWrapperStyles = (token) => {
  const {
    componentCls,
    paddingBlock,
    paddingInline,
    inputAffixPadding,
    controlWidth,
    borderRadiusLG,
    borderRadiusSM,
    paddingInlineLG,
    paddingInlineSM,
    paddingBlockLG,
    paddingBlockSM,
    motionDurationMid
  } = token;
  return {
    [`${componentCls}-affix-wrapper`]: Object.assign(Object.assign({
      [`input${componentCls}-input`]: {
        padding: `${unit(paddingBlock)} 0`
      }
    }, genBasicInputStyle(token)), {
      // or number handler will cover form status
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      width: controlWidth,
      padding: 0,
      paddingInlineStart: paddingInline,
      "&-lg": {
        borderRadius: borderRadiusLG,
        paddingInlineStart: paddingInlineLG,
        [`input${componentCls}-input`]: {
          padding: `${unit(paddingBlockLG)} 0`
        }
      },
      "&-sm": {
        borderRadius: borderRadiusSM,
        paddingInlineStart: paddingInlineSM,
        [`input${componentCls}-input`]: {
          padding: `${unit(paddingBlockSM)} 0`
        }
      },
      [`&:not(${componentCls}-disabled):hover`]: {
        zIndex: 1
      },
      "&-focused, &:focus": {
        zIndex: 1
      },
      [`&-disabled > ${componentCls}-disabled`]: {
        background: "transparent"
      },
      [`> div${componentCls}`]: {
        width: "100%",
        border: "none",
        outline: "none",
        [`&${componentCls}-focused`]: {
          boxShadow: "none !important"
        }
      },
      "&::before": {
        display: "inline-block",
        width: 0,
        visibility: "hidden",
        content: '"\\a0"'
      },
      [`${componentCls}-handler-wrap`]: {
        zIndex: 2
      },
      [componentCls]: {
        position: "static",
        color: "inherit",
        "&-prefix, &-suffix": {
          display: "flex",
          flex: "none",
          alignItems: "center",
          pointerEvents: "none"
        },
        "&-prefix": {
          marginInlineEnd: inputAffixPadding
        },
        "&-suffix": {
          insetBlockStart: 0,
          insetInlineEnd: 0,
          height: "100%",
          marginInlineEnd: paddingInline,
          marginInlineStart: inputAffixPadding,
          transition: `margin ${motionDurationMid}`
        }
      },
      [`&:hover ${componentCls}-handler-wrap, &-focused ${componentCls}-handler-wrap`]: {
        width: token.handleWidth,
        opacity: 1
      },
      [`&:not(${componentCls}-affix-wrapper-without-controls):hover ${componentCls}-suffix`]: {
        marginInlineEnd: token.calc(token.handleWidth).add(paddingInline).equal()
      }
    }),
    // 覆盖 affix-wrapper borderRadius！
    [`${componentCls}-underlined`]: {
      borderRadius: 0
    }
  };
};
const useStyle = genStyleHooks("InputNumber", (token) => {
  const inputNumberToken = merge(token, initInputToken(token));
  return [
    genInputNumberStyles(inputNumberToken),
    genAffixWrapperStyles(inputNumberToken),
    // =====================================================
    // ==             Space Compact                       ==
    // =====================================================
    genCompactItemStyle(inputNumberToken)
  ];
}, prepareComponentToken, {
  unitless: {
    handleOpacity: true
  },
  resetFont: false
});
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const InputNumber = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    getPrefixCls,
    direction
  } = reactExports.useContext(ConfigContext);
  const inputRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => inputRef.current);
  const {
    className,
    rootClassName,
    size: customizeSize,
    disabled: customDisabled,
    prefixCls: customizePrefixCls,
    addonBefore,
    addonAfter,
    prefix,
    suffix,
    bordered,
    readOnly,
    status: customStatus,
    controls,
    variant: customVariant
  } = props, others = __rest(props, ["className", "rootClassName", "size", "disabled", "prefixCls", "addonBefore", "addonAfter", "prefix", "suffix", "bordered", "readOnly", "status", "controls", "variant"]);
  const prefixCls = getPrefixCls("input-number", customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);
  const {
    compactSize,
    compactItemClassnames
  } = useCompactItemContext(prefixCls, direction);
  let upIcon = /* @__PURE__ */ reactExports.createElement(RefIcon, {
    className: `${prefixCls}-handler-up-inner`
  });
  let downIcon = /* @__PURE__ */ reactExports.createElement(RefIcon$1, {
    className: `${prefixCls}-handler-down-inner`
  });
  const controlsTemp = typeof controls === "boolean" ? controls : void 0;
  if (typeof controls === "object") {
    upIcon = typeof controls.upIcon === "undefined" ? upIcon : /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-handler-up-inner`
    }, controls.upIcon);
    downIcon = typeof controls.downIcon === "undefined" ? downIcon : /* @__PURE__ */ reactExports.createElement("span", {
      className: `${prefixCls}-handler-down-inner`
    }, controls.downIcon);
  }
  const {
    hasFeedback,
    status: contextStatus,
    isFormItemInput,
    feedbackIcon
  } = reactExports.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);
  const mergedSize = useSize((ctx) => {
    var _a;
    return (_a = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a !== void 0 ? _a : ctx;
  });
  const disabled = reactExports.useContext(DisabledContext);
  const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  const [variant, enableVariantCls] = useVariant("inputNumber", customVariant, bordered);
  const suffixNode = hasFeedback && /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, feedbackIcon);
  const inputNumberClass = classNames({
    [`${prefixCls}-lg`]: mergedSize === "large",
    [`${prefixCls}-sm`]: mergedSize === "small",
    [`${prefixCls}-rtl`]: direction === "rtl",
    [`${prefixCls}-in-form-item`]: isFormItemInput
  }, hashId);
  const wrapperClassName = `${prefixCls}-group`;
  const element = /* @__PURE__ */ reactExports.createElement(InputNumber$1, Object.assign({
    ref: inputRef,
    disabled: mergedDisabled,
    className: classNames(cssVarCls, rootCls, className, rootClassName, compactItemClassnames),
    upHandler: upIcon,
    downHandler: downIcon,
    prefixCls,
    readOnly,
    controls: controlsTemp,
    prefix,
    suffix: suffixNode || suffix,
    addonBefore: addonBefore && /* @__PURE__ */ reactExports.createElement(ContextIsolator, {
      form: true,
      space: true
    }, addonBefore),
    addonAfter: addonAfter && /* @__PURE__ */ reactExports.createElement(ContextIsolator, {
      form: true,
      space: true
    }, addonAfter),
    classNames: {
      input: inputNumberClass,
      variant: classNames({
        [`${prefixCls}-${variant}`]: enableVariantCls
      }, getStatusClassNames(prefixCls, mergedStatus, hasFeedback)),
      affixWrapper: classNames({
        [`${prefixCls}-affix-wrapper-sm`]: mergedSize === "small",
        [`${prefixCls}-affix-wrapper-lg`]: mergedSize === "large",
        [`${prefixCls}-affix-wrapper-rtl`]: direction === "rtl",
        [`${prefixCls}-affix-wrapper-without-controls`]: controls === false || mergedDisabled || readOnly
      }, hashId),
      wrapper: classNames({
        [`${wrapperClassName}-rtl`]: direction === "rtl"
      }, hashId),
      groupWrapper: classNames({
        [`${prefixCls}-group-wrapper-sm`]: mergedSize === "small",
        [`${prefixCls}-group-wrapper-lg`]: mergedSize === "large",
        [`${prefixCls}-group-wrapper-rtl`]: direction === "rtl",
        [`${prefixCls}-group-wrapper-${variant}`]: enableVariantCls
      }, getStatusClassNames(`${prefixCls}-group-wrapper`, mergedStatus, hasFeedback), hashId)
    }
  }, others));
  return wrapCSSVar(element);
});
const TypedInputNumber = InputNumber;
const PureInputNumber = (props) => /* @__PURE__ */ reactExports.createElement(ConfigProvider, {
  theme: {
    components: {
      InputNumber: {
        handleVisible: true
      }
    }
  }
}, /* @__PURE__ */ reactExports.createElement(InputNumber, Object.assign({}, props)));
TypedInputNumber._InternalPanelDoNotUseOrYouWillBeFired = PureInputNumber;
export {
  TypedInputNumber as T
};
//# sourceMappingURL=index-Tson9HxS.js.map
