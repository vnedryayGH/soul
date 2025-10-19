import { a as reactExports, r as reactDomExports, R as React } from "./react-DAIzMmXQ.js";
import { ad as _objectWithoutProperties, K as _extends, w as _objectSpread2, f as classNames, v as _defineProperty, aW as KeyCode, r as _slicedToArray, aa as useLayoutEffect, x as useEvent, _ as _toConsumableArray, ae as _typeof, E as useMergedState, cq as isEqual, aV as warningOnce, aB as Tooltip, ac as composeRef, b9 as wrapperRaf, Q as genStyleHooks, R as merge, V as resetComponent, U as unit, aS as FastColor, d as useComponentConfig, av as DisabledContext } from "./index-B4P9h-k1.js";
function getOffset(value, min, max) {
  return (value - min) / (max - min);
}
function getDirectionStyle(direction, value, min, max) {
  var offset = getOffset(value, min, max);
  var positionStyle = {};
  switch (direction) {
    case "rtl":
      positionStyle.right = "".concat(offset * 100, "%");
      positionStyle.transform = "translateX(50%)";
      break;
    case "btt":
      positionStyle.bottom = "".concat(offset * 100, "%");
      positionStyle.transform = "translateY(50%)";
      break;
    case "ttb":
      positionStyle.top = "".concat(offset * 100, "%");
      positionStyle.transform = "translateY(-50%)";
      break;
    default:
      positionStyle.left = "".concat(offset * 100, "%");
      positionStyle.transform = "translateX(-50%)";
      break;
  }
  return positionStyle;
}
function getIndex(value, index) {
  return Array.isArray(value) ? value[index] : value;
}
var SliderContext = /* @__PURE__ */ reactExports.createContext({
  min: 0,
  max: 0,
  direction: "ltr",
  step: 1,
  includedStart: 0,
  includedEnd: 0,
  tabIndex: 0,
  keyboard: true,
  styles: {},
  classNames: {}
});
var UnstableContext = /* @__PURE__ */ reactExports.createContext({});
var _excluded$1 = ["prefixCls", "value", "valueIndex", "onStartMove", "onDelete", "style", "render", "dragging", "draggingDelete", "onOffsetChange", "onChangeComplete", "onFocus", "onMouseEnter"];
var Handle = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, value = props.value, valueIndex = props.valueIndex, onStartMove = props.onStartMove, onDelete = props.onDelete, style = props.style, render = props.render, dragging = props.dragging, draggingDelete = props.draggingDelete, onOffsetChange = props.onOffsetChange, onChangeComplete = props.onChangeComplete, onFocus = props.onFocus, onMouseEnter = props.onMouseEnter, restProps = _objectWithoutProperties(props, _excluded$1);
  var _React$useContext = reactExports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, disabled = _React$useContext.disabled, keyboard = _React$useContext.keyboard, range = _React$useContext.range, tabIndex = _React$useContext.tabIndex, ariaLabelForHandle = _React$useContext.ariaLabelForHandle, ariaLabelledByForHandle = _React$useContext.ariaLabelledByForHandle, ariaRequired = _React$useContext.ariaRequired, ariaValueTextFormatterForHandle = _React$useContext.ariaValueTextFormatterForHandle, styles = _React$useContext.styles, classNames$1 = _React$useContext.classNames;
  var handlePrefixCls = "".concat(prefixCls, "-handle");
  var onInternalStartMove = function onInternalStartMove2(e) {
    if (!disabled) {
      onStartMove(e, valueIndex);
    }
  };
  var onInternalFocus = function onInternalFocus2(e) {
    onFocus === null || onFocus === void 0 || onFocus(e, valueIndex);
  };
  var onInternalMouseEnter = function onInternalMouseEnter2(e) {
    onMouseEnter(e, valueIndex);
  };
  var onKeyDown = function onKeyDown2(e) {
    if (!disabled && keyboard) {
      var offset = null;
      switch (e.which || e.keyCode) {
        case KeyCode.LEFT:
          offset = direction === "ltr" || direction === "btt" ? -1 : 1;
          break;
        case KeyCode.RIGHT:
          offset = direction === "ltr" || direction === "btt" ? 1 : -1;
          break;
        case KeyCode.UP:
          offset = direction !== "ttb" ? 1 : -1;
          break;
        case KeyCode.DOWN:
          offset = direction !== "ttb" ? -1 : 1;
          break;
        case KeyCode.HOME:
          offset = "min";
          break;
        case KeyCode.END:
          offset = "max";
          break;
        case KeyCode.PAGE_UP:
          offset = 2;
          break;
        case KeyCode.PAGE_DOWN:
          offset = -2;
          break;
        case KeyCode.BACKSPACE:
        case KeyCode.DELETE:
          onDelete(valueIndex);
          break;
      }
      if (offset !== null) {
        e.preventDefault();
        onOffsetChange(offset, valueIndex);
      }
    }
  };
  var handleKeyUp = function handleKeyUp2(e) {
    switch (e.which || e.keyCode) {
      case KeyCode.LEFT:
      case KeyCode.RIGHT:
      case KeyCode.UP:
      case KeyCode.DOWN:
      case KeyCode.HOME:
      case KeyCode.END:
      case KeyCode.PAGE_UP:
      case KeyCode.PAGE_DOWN:
        onChangeComplete === null || onChangeComplete === void 0 || onChangeComplete();
        break;
    }
  };
  var positionStyle = getDirectionStyle(direction, value, min, max);
  var divProps = {};
  if (valueIndex !== null) {
    var _getIndex;
    divProps = {
      tabIndex: disabled ? null : getIndex(tabIndex, valueIndex),
      role: "slider",
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": value,
      "aria-disabled": disabled,
      "aria-label": getIndex(ariaLabelForHandle, valueIndex),
      "aria-labelledby": getIndex(ariaLabelledByForHandle, valueIndex),
      "aria-required": getIndex(ariaRequired, valueIndex),
      "aria-valuetext": (_getIndex = getIndex(ariaValueTextFormatterForHandle, valueIndex)) === null || _getIndex === void 0 ? void 0 : _getIndex(value),
      "aria-orientation": direction === "ltr" || direction === "rtl" ? "horizontal" : "vertical",
      onMouseDown: onInternalStartMove,
      onTouchStart: onInternalStartMove,
      onFocus: onInternalFocus,
      onMouseEnter: onInternalMouseEnter,
      onKeyDown,
      onKeyUp: handleKeyUp
    };
  }
  var handleNode = /* @__PURE__ */ reactExports.createElement("div", _extends({
    ref,
    className: classNames(handlePrefixCls, _defineProperty(_defineProperty(_defineProperty({}, "".concat(handlePrefixCls, "-").concat(valueIndex + 1), valueIndex !== null && range), "".concat(handlePrefixCls, "-dragging"), dragging), "".concat(handlePrefixCls, "-dragging-delete"), draggingDelete), classNames$1.handle),
    style: _objectSpread2(_objectSpread2(_objectSpread2({}, positionStyle), style), styles.handle)
  }, divProps, restProps));
  if (render) {
    handleNode = render(handleNode, {
      index: valueIndex,
      prefixCls,
      value,
      dragging,
      draggingDelete
    });
  }
  return handleNode;
});
var _excluded = ["prefixCls", "style", "onStartMove", "onOffsetChange", "values", "handleRender", "activeHandleRender", "draggingIndex", "draggingDelete", "onFocus"];
var Handles = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, style = props.style, onStartMove = props.onStartMove, onOffsetChange = props.onOffsetChange, values = props.values, handleRender = props.handleRender, activeHandleRender = props.activeHandleRender, draggingIndex = props.draggingIndex, draggingDelete = props.draggingDelete, onFocus = props.onFocus, restProps = _objectWithoutProperties(props, _excluded);
  var handlesRef = reactExports.useRef({});
  var _React$useState = reactExports.useState(false), _React$useState2 = _slicedToArray(_React$useState, 2), activeVisible = _React$useState2[0], setActiveVisible = _React$useState2[1];
  var _React$useState3 = reactExports.useState(-1), _React$useState4 = _slicedToArray(_React$useState3, 2), activeIndex = _React$useState4[0], setActiveIndex = _React$useState4[1];
  var onActive = function onActive2(index) {
    setActiveIndex(index);
    setActiveVisible(true);
  };
  var onHandleFocus = function onHandleFocus2(e, index) {
    onActive(index);
    onFocus === null || onFocus === void 0 || onFocus(e);
  };
  var onHandleMouseEnter = function onHandleMouseEnter2(e, index) {
    onActive(index);
  };
  reactExports.useImperativeHandle(ref, function() {
    return {
      focus: function focus(index) {
        var _handlesRef$current$i;
        (_handlesRef$current$i = handlesRef.current[index]) === null || _handlesRef$current$i === void 0 || _handlesRef$current$i.focus();
      },
      hideHelp: function hideHelp() {
        reactDomExports.flushSync(function() {
          setActiveVisible(false);
        });
      }
    };
  });
  var handleProps = _objectSpread2({
    prefixCls,
    onStartMove,
    onOffsetChange,
    render: handleRender,
    onFocus: onHandleFocus,
    onMouseEnter: onHandleMouseEnter
  }, restProps);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, values.map(function(value, index) {
    var dragging = draggingIndex === index;
    return /* @__PURE__ */ reactExports.createElement(Handle, _extends({
      ref: function ref2(node) {
        if (!node) {
          delete handlesRef.current[index];
        } else {
          handlesRef.current[index] = node;
        }
      },
      dragging,
      draggingDelete: dragging && draggingDelete,
      style: getIndex(style, index),
      key: index,
      value,
      valueIndex: index
    }, handleProps));
  }), activeHandleRender && activeVisible && /* @__PURE__ */ reactExports.createElement(Handle, _extends({
    key: "a11y"
  }, handleProps, {
    value: values[activeIndex],
    valueIndex: null,
    dragging: draggingIndex !== -1,
    draggingDelete,
    render: activeHandleRender,
    style: {
      pointerEvents: "none"
    },
    tabIndex: null,
    "aria-hidden": true
  })));
});
var Mark = function Mark2(props) {
  var prefixCls = props.prefixCls, style = props.style, children = props.children, value = props.value, _onClick = props.onClick;
  var _React$useContext = reactExports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, includedStart = _React$useContext.includedStart, includedEnd = _React$useContext.includedEnd, included = _React$useContext.included;
  var textCls = "".concat(prefixCls, "-text");
  var positionStyle = getDirectionStyle(direction, value, min, max);
  return /* @__PURE__ */ reactExports.createElement("span", {
    className: classNames(textCls, _defineProperty({}, "".concat(textCls, "-active"), included && includedStart <= value && value <= includedEnd)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: function onMouseDown(e) {
      e.stopPropagation();
    },
    onClick: function onClick() {
      _onClick(value);
    }
  }, children);
};
var Marks = function Marks2(props) {
  var prefixCls = props.prefixCls, marks = props.marks, onClick = props.onClick;
  var markPrefixCls = "".concat(prefixCls, "-mark");
  if (!marks.length) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: markPrefixCls
  }, marks.map(function(_ref) {
    var value = _ref.value, style = _ref.style, label = _ref.label;
    return /* @__PURE__ */ reactExports.createElement(Mark, {
      key: value,
      prefixCls: markPrefixCls,
      style,
      value,
      onClick
    }, label);
  }));
};
var Dot = function Dot2(props) {
  var prefixCls = props.prefixCls, value = props.value, style = props.style, activeStyle = props.activeStyle;
  var _React$useContext = reactExports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, included = _React$useContext.included, includedStart = _React$useContext.includedStart, includedEnd = _React$useContext.includedEnd;
  var dotClassName = "".concat(prefixCls, "-dot");
  var active = included && includedStart <= value && value <= includedEnd;
  var mergedStyle = _objectSpread2(_objectSpread2({}, getDirectionStyle(direction, value, min, max)), typeof style === "function" ? style(value) : style);
  if (active) {
    mergedStyle = _objectSpread2(_objectSpread2({}, mergedStyle), typeof activeStyle === "function" ? activeStyle(value) : activeStyle);
  }
  return /* @__PURE__ */ reactExports.createElement("span", {
    className: classNames(dotClassName, _defineProperty({}, "".concat(dotClassName, "-active"), active)),
    style: mergedStyle
  });
};
var Steps = function Steps2(props) {
  var prefixCls = props.prefixCls, marks = props.marks, dots = props.dots, style = props.style, activeStyle = props.activeStyle;
  var _React$useContext = reactExports.useContext(SliderContext), min = _React$useContext.min, max = _React$useContext.max, step = _React$useContext.step;
  var stepDots = reactExports.useMemo(function() {
    var dotSet = /* @__PURE__ */ new Set();
    marks.forEach(function(mark) {
      dotSet.add(mark.value);
    });
    if (dots && step !== null) {
      var current = min;
      while (current <= max) {
        dotSet.add(current);
        current += step;
      }
    }
    return Array.from(dotSet);
  }, [min, max, step, dots, marks]);
  return /* @__PURE__ */ reactExports.createElement("div", {
    className: "".concat(prefixCls, "-step")
  }, stepDots.map(function(dotValue) {
    return /* @__PURE__ */ reactExports.createElement(Dot, {
      prefixCls,
      key: dotValue,
      value: dotValue,
      style,
      activeStyle
    });
  }));
};
var Track = function Track2(props) {
  var prefixCls = props.prefixCls, style = props.style, start = props.start, end = props.end, index = props.index, onStartMove = props.onStartMove, replaceCls = props.replaceCls;
  var _React$useContext = reactExports.useContext(SliderContext), direction = _React$useContext.direction, min = _React$useContext.min, max = _React$useContext.max, disabled = _React$useContext.disabled, range = _React$useContext.range, classNames$1 = _React$useContext.classNames;
  var trackPrefixCls = "".concat(prefixCls, "-track");
  var offsetStart = getOffset(start, min, max);
  var offsetEnd = getOffset(end, min, max);
  var onInternalStartMove = function onInternalStartMove2(e) {
    if (!disabled && onStartMove) {
      onStartMove(e, -1);
    }
  };
  var positionStyle = {};
  switch (direction) {
    case "rtl":
      positionStyle.right = "".concat(offsetStart * 100, "%");
      positionStyle.width = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    case "btt":
      positionStyle.bottom = "".concat(offsetStart * 100, "%");
      positionStyle.height = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    case "ttb":
      positionStyle.top = "".concat(offsetStart * 100, "%");
      positionStyle.height = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    default:
      positionStyle.left = "".concat(offsetStart * 100, "%");
      positionStyle.width = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
  }
  var className = replaceCls || classNames(trackPrefixCls, _defineProperty(_defineProperty({}, "".concat(trackPrefixCls, "-").concat(index + 1), index !== null && range), "".concat(prefixCls, "-track-draggable"), onStartMove), classNames$1.track);
  return /* @__PURE__ */ reactExports.createElement("div", {
    className,
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: onInternalStartMove,
    onTouchStart: onInternalStartMove
  });
};
var Tracks = function Tracks2(props) {
  var prefixCls = props.prefixCls, style = props.style, values = props.values, startPoint = props.startPoint, onStartMove = props.onStartMove;
  var _React$useContext = reactExports.useContext(SliderContext), included = _React$useContext.included, range = _React$useContext.range, min = _React$useContext.min, styles = _React$useContext.styles, classNames$1 = _React$useContext.classNames;
  var trackList = reactExports.useMemo(function() {
    if (!range) {
      if (values.length === 0) {
        return [];
      }
      var startValue = startPoint !== null && startPoint !== void 0 ? startPoint : min;
      var endValue = values[0];
      return [{
        start: Math.min(startValue, endValue),
        end: Math.max(startValue, endValue)
      }];
    }
    var list = [];
    for (var i = 0; i < values.length - 1; i += 1) {
      list.push({
        start: values[i],
        end: values[i + 1]
      });
    }
    return list;
  }, [values, range, startPoint, min]);
  if (!included) {
    return null;
  }
  var tracksNode = trackList !== null && trackList !== void 0 && trackList.length && (classNames$1.tracks || styles.tracks) ? /* @__PURE__ */ reactExports.createElement(Track, {
    index: null,
    prefixCls,
    start: trackList[0].start,
    end: trackList[trackList.length - 1].end,
    replaceCls: classNames(classNames$1.tracks, "".concat(prefixCls, "-tracks")),
    style: styles.tracks
  }) : null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, tracksNode, trackList.map(function(_ref, index) {
    var start = _ref.start, end = _ref.end;
    return /* @__PURE__ */ reactExports.createElement(Track, {
      index,
      prefixCls,
      style: _objectSpread2(_objectSpread2({}, getIndex(style, index)), styles.track),
      start,
      end,
      key: index,
      onStartMove
    });
  }));
};
var REMOVE_DIST = 130;
function getPosition(e) {
  var obj = "targetTouches" in e ? e.targetTouches[0] : e;
  return {
    pageX: obj.pageX,
    pageY: obj.pageY
  };
}
function useDrag(containerRef, direction, rawValues, min, max, formatValue, triggerChange, finishChange, offsetValues, editable, minCount) {
  var _React$useState = reactExports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), draggingValue = _React$useState2[0], setDraggingValue = _React$useState2[1];
  var _React$useState3 = reactExports.useState(-1), _React$useState4 = _slicedToArray(_React$useState3, 2), draggingIndex = _React$useState4[0], setDraggingIndex = _React$useState4[1];
  var _React$useState5 = reactExports.useState(false), _React$useState6 = _slicedToArray(_React$useState5, 2), draggingDelete = _React$useState6[0], setDraggingDelete = _React$useState6[1];
  var _React$useState7 = reactExports.useState(rawValues), _React$useState8 = _slicedToArray(_React$useState7, 2), cacheValues = _React$useState8[0], setCacheValues = _React$useState8[1];
  var _React$useState9 = reactExports.useState(rawValues), _React$useState10 = _slicedToArray(_React$useState9, 2), originValues = _React$useState10[0], setOriginValues = _React$useState10[1];
  var mouseMoveEventRef = reactExports.useRef(null);
  var mouseUpEventRef = reactExports.useRef(null);
  var touchEventTargetRef = reactExports.useRef(null);
  var _React$useContext = reactExports.useContext(UnstableContext), onDragStart = _React$useContext.onDragStart, onDragChange = _React$useContext.onDragChange;
  useLayoutEffect(function() {
    if (draggingIndex === -1) {
      setCacheValues(rawValues);
    }
  }, [rawValues, draggingIndex]);
  reactExports.useEffect(function() {
    return function() {
      document.removeEventListener("mousemove", mouseMoveEventRef.current);
      document.removeEventListener("mouseup", mouseUpEventRef.current);
      if (touchEventTargetRef.current) {
        touchEventTargetRef.current.removeEventListener("touchmove", mouseMoveEventRef.current);
        touchEventTargetRef.current.removeEventListener("touchend", mouseUpEventRef.current);
      }
    };
  }, []);
  var flushValues = function flushValues2(nextValues, nextValue, deleteMark) {
    if (nextValue !== void 0) {
      setDraggingValue(nextValue);
    }
    setCacheValues(nextValues);
    var changeValues = nextValues;
    if (deleteMark) {
      changeValues = nextValues.filter(function(_, i) {
        return i !== draggingIndex;
      });
    }
    triggerChange(changeValues);
    if (onDragChange) {
      onDragChange({
        rawValues: nextValues,
        deleteIndex: deleteMark ? draggingIndex : -1,
        draggingIndex,
        draggingValue: nextValue
      });
    }
  };
  var updateCacheValue = useEvent(function(valueIndex, offsetPercent, deleteMark) {
    if (valueIndex === -1) {
      var startValue = originValues[0];
      var endValue = originValues[originValues.length - 1];
      var maxStartOffset = min - startValue;
      var maxEndOffset = max - endValue;
      var offset = offsetPercent * (max - min);
      offset = Math.max(offset, maxStartOffset);
      offset = Math.min(offset, maxEndOffset);
      var formatStartValue = formatValue(startValue + offset);
      offset = formatStartValue - startValue;
      var cloneCacheValues = originValues.map(function(val) {
        return val + offset;
      });
      flushValues(cloneCacheValues);
    } else {
      var offsetDist = (max - min) * offsetPercent;
      var cloneValues = _toConsumableArray(cacheValues);
      cloneValues[valueIndex] = originValues[valueIndex];
      var next = offsetValues(cloneValues, offsetDist, valueIndex, "dist");
      flushValues(next.values, next.value, deleteMark);
    }
  });
  var onStartMove = function onStartMove2(e, valueIndex, startValues) {
    e.stopPropagation();
    var initialValues = startValues || rawValues;
    var originValue = initialValues[valueIndex];
    setDraggingIndex(valueIndex);
    setDraggingValue(originValue);
    setOriginValues(initialValues);
    setCacheValues(initialValues);
    setDraggingDelete(false);
    var _getPosition = getPosition(e), startX = _getPosition.pageX, startY = _getPosition.pageY;
    var deleteMark = false;
    if (onDragStart) {
      onDragStart({
        rawValues: initialValues,
        draggingIndex: valueIndex,
        draggingValue: originValue
      });
    }
    var onMouseMove = function onMouseMove2(event) {
      event.preventDefault();
      var _getPosition2 = getPosition(event), moveX = _getPosition2.pageX, moveY = _getPosition2.pageY;
      var offsetX = moveX - startX;
      var offsetY = moveY - startY;
      var _containerRef$current = containerRef.current.getBoundingClientRect(), width = _containerRef$current.width, height = _containerRef$current.height;
      var offSetPercent;
      var removeDist;
      switch (direction) {
        case "btt":
          offSetPercent = -offsetY / height;
          removeDist = offsetX;
          break;
        case "ttb":
          offSetPercent = offsetY / height;
          removeDist = offsetX;
          break;
        case "rtl":
          offSetPercent = -offsetX / width;
          removeDist = offsetY;
          break;
        default:
          offSetPercent = offsetX / width;
          removeDist = offsetY;
      }
      deleteMark = editable ? Math.abs(removeDist) > REMOVE_DIST && minCount < cacheValues.length : false;
      setDraggingDelete(deleteMark);
      updateCacheValue(valueIndex, offSetPercent, deleteMark);
    };
    var onMouseUp = function onMouseUp2(event) {
      event.preventDefault();
      document.removeEventListener("mouseup", onMouseUp2);
      document.removeEventListener("mousemove", onMouseMove);
      if (touchEventTargetRef.current) {
        touchEventTargetRef.current.removeEventListener("touchmove", mouseMoveEventRef.current);
        touchEventTargetRef.current.removeEventListener("touchend", mouseUpEventRef.current);
      }
      mouseMoveEventRef.current = null;
      mouseUpEventRef.current = null;
      touchEventTargetRef.current = null;
      finishChange(deleteMark);
      setDraggingIndex(-1);
      setDraggingDelete(false);
    };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    e.currentTarget.addEventListener("touchend", onMouseUp);
    e.currentTarget.addEventListener("touchmove", onMouseMove);
    mouseMoveEventRef.current = onMouseMove;
    mouseUpEventRef.current = onMouseUp;
    touchEventTargetRef.current = e.currentTarget;
  };
  var returnValues = reactExports.useMemo(function() {
    var sourceValues = _toConsumableArray(rawValues).sort(function(a, b) {
      return a - b;
    });
    var targetValues = _toConsumableArray(cacheValues).sort(function(a, b) {
      return a - b;
    });
    var counts = {};
    targetValues.forEach(function(val) {
      counts[val] = (counts[val] || 0) + 1;
    });
    sourceValues.forEach(function(val) {
      counts[val] = (counts[val] || 0) - 1;
    });
    var maxDiffCount = editable ? 1 : 0;
    var diffCount = Object.values(counts).reduce(function(prev, next) {
      return prev + Math.abs(next);
    }, 0);
    return diffCount <= maxDiffCount ? cacheValues : rawValues;
  }, [rawValues, cacheValues, editable]);
  return [draggingIndex, draggingValue, draggingDelete, returnValues, onStartMove];
}
function useOffset(min, max, step, markList, allowCross, pushable) {
  var formatRangeValue = reactExports.useCallback(function(val) {
    return Math.max(min, Math.min(max, val));
  }, [min, max]);
  var formatStepValue = reactExports.useCallback(function(val) {
    if (step !== null) {
      var stepValue = min + Math.round((formatRangeValue(val) - min) / step) * step;
      var getDecimal = function getDecimal2(num) {
        return (String(num).split(".")[1] || "").length;
      };
      var maxDecimal = Math.max(getDecimal(step), getDecimal(max), getDecimal(min));
      var fixedValue = Number(stepValue.toFixed(maxDecimal));
      return min <= fixedValue && fixedValue <= max ? fixedValue : null;
    }
    return null;
  }, [step, min, max, formatRangeValue]);
  var formatValue = reactExports.useCallback(function(val) {
    var formatNextValue = formatRangeValue(val);
    var alignValues = markList.map(function(mark) {
      return mark.value;
    });
    if (step !== null) {
      alignValues.push(formatStepValue(val));
    }
    alignValues.push(min, max);
    var closeValue = alignValues[0];
    var closeDist = max - min;
    alignValues.forEach(function(alignValue) {
      var dist = Math.abs(formatNextValue - alignValue);
      if (dist <= closeDist) {
        closeValue = alignValue;
        closeDist = dist;
      }
    });
    return closeValue;
  }, [min, max, markList, step, formatRangeValue, formatStepValue]);
  var offsetValue = function offsetValue2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    if (typeof offset === "number") {
      var nextValue;
      var originValue = values[valueIndex];
      var targetDistValue = originValue + offset;
      var potentialValues = [];
      markList.forEach(function(mark) {
        potentialValues.push(mark.value);
      });
      potentialValues.push(min, max);
      potentialValues.push(formatStepValue(originValue));
      var sign = offset > 0 ? 1 : -1;
      if (mode === "unit") {
        potentialValues.push(formatStepValue(originValue + sign * step));
      } else {
        potentialValues.push(formatStepValue(targetDistValue));
      }
      potentialValues = potentialValues.filter(function(val) {
        return val !== null;
      }).filter(function(val) {
        return offset < 0 ? val <= originValue : val >= originValue;
      });
      if (mode === "unit") {
        potentialValues = potentialValues.filter(function(val) {
          return val !== originValue;
        });
      }
      var compareValue = mode === "unit" ? originValue : targetDistValue;
      nextValue = potentialValues[0];
      var valueDist = Math.abs(nextValue - compareValue);
      potentialValues.forEach(function(potentialValue) {
        var dist = Math.abs(potentialValue - compareValue);
        if (dist < valueDist) {
          nextValue = potentialValue;
          valueDist = dist;
        }
      });
      if (nextValue === void 0) {
        return offset < 0 ? min : max;
      }
      if (mode === "dist") {
        return nextValue;
      }
      if (Math.abs(offset) > 1) {
        var cloneValues = _toConsumableArray(values);
        cloneValues[valueIndex] = nextValue;
        return offsetValue2(cloneValues, offset - sign, valueIndex, mode);
      }
      return nextValue;
    } else if (offset === "min") {
      return min;
    } else if (offset === "max") {
      return max;
    }
  };
  var offsetChangedValue = function offsetChangedValue2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    var originValue = values[valueIndex];
    var nextValue = offsetValue(values, offset, valueIndex, mode);
    return {
      value: nextValue,
      changed: nextValue !== originValue
    };
  };
  var needPush = function needPush2(dist) {
    return pushable === null && dist === 0 || typeof pushable === "number" && dist < pushable;
  };
  var offsetValues = function offsetValues2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    var nextValues = values.map(formatValue);
    var originValue = nextValues[valueIndex];
    var nextValue = offsetValue(nextValues, offset, valueIndex, mode);
    nextValues[valueIndex] = nextValue;
    if (allowCross === false) {
      var pushNum = pushable || 0;
      if (valueIndex > 0 && nextValues[valueIndex - 1] !== originValue) {
        nextValues[valueIndex] = Math.max(nextValues[valueIndex], nextValues[valueIndex - 1] + pushNum);
      }
      if (valueIndex < nextValues.length - 1 && nextValues[valueIndex + 1] !== originValue) {
        nextValues[valueIndex] = Math.min(nextValues[valueIndex], nextValues[valueIndex + 1] - pushNum);
      }
    } else if (typeof pushable === "number" || pushable === null) {
      for (var i = valueIndex + 1; i < nextValues.length; i += 1) {
        var changed = true;
        while (needPush(nextValues[i] - nextValues[i - 1]) && changed) {
          var _offsetChangedValue = offsetChangedValue(nextValues, 1, i);
          nextValues[i] = _offsetChangedValue.value;
          changed = _offsetChangedValue.changed;
        }
      }
      for (var _i = valueIndex; _i > 0; _i -= 1) {
        var _changed = true;
        while (needPush(nextValues[_i] - nextValues[_i - 1]) && _changed) {
          var _offsetChangedValue2 = offsetChangedValue(nextValues, -1, _i - 1);
          nextValues[_i - 1] = _offsetChangedValue2.value;
          _changed = _offsetChangedValue2.changed;
        }
      }
      for (var _i2 = nextValues.length - 1; _i2 > 0; _i2 -= 1) {
        var _changed2 = true;
        while (needPush(nextValues[_i2] - nextValues[_i2 - 1]) && _changed2) {
          var _offsetChangedValue3 = offsetChangedValue(nextValues, -1, _i2 - 1);
          nextValues[_i2 - 1] = _offsetChangedValue3.value;
          _changed2 = _offsetChangedValue3.changed;
        }
      }
      for (var _i3 = 0; _i3 < nextValues.length - 1; _i3 += 1) {
        var _changed3 = true;
        while (needPush(nextValues[_i3 + 1] - nextValues[_i3]) && _changed3) {
          var _offsetChangedValue4 = offsetChangedValue(nextValues, 1, _i3 + 1);
          nextValues[_i3 + 1] = _offsetChangedValue4.value;
          _changed3 = _offsetChangedValue4.changed;
        }
      }
    }
    return {
      value: nextValues[valueIndex],
      values: nextValues
    };
  };
  return [formatValue, offsetValues];
}
function useRange(range) {
  return reactExports.useMemo(function() {
    if (range === true || !range) {
      return [!!range, false, false, 0];
    }
    var editable = range.editable, draggableTrack = range.draggableTrack, minCount = range.minCount, maxCount = range.maxCount;
    return [true, editable, !editable && draggableTrack, minCount || 0, maxCount];
  }, [range]);
}
var Slider$1 = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-slider" : _props$prefixCls, className = props.className, style = props.style, classNames$1 = props.classNames, styles = props.styles, id = props.id, _props$disabled = props.disabled, disabled = _props$disabled === void 0 ? false : _props$disabled, _props$keyboard = props.keyboard, keyboard = _props$keyboard === void 0 ? true : _props$keyboard, autoFocus = props.autoFocus, onFocus = props.onFocus, onBlur = props.onBlur, _props$min = props.min, min = _props$min === void 0 ? 0 : _props$min, _props$max = props.max, max = _props$max === void 0 ? 100 : _props$max, _props$step = props.step, step = _props$step === void 0 ? 1 : _props$step, value = props.value, defaultValue = props.defaultValue, range = props.range, count = props.count, onChange = props.onChange, onBeforeChange = props.onBeforeChange, onAfterChange = props.onAfterChange, onChangeComplete = props.onChangeComplete, _props$allowCross = props.allowCross, allowCross = _props$allowCross === void 0 ? true : _props$allowCross, _props$pushable = props.pushable, pushable = _props$pushable === void 0 ? false : _props$pushable, reverse = props.reverse, vertical = props.vertical, _props$included = props.included, included = _props$included === void 0 ? true : _props$included, startPoint = props.startPoint, trackStyle = props.trackStyle, handleStyle = props.handleStyle, railStyle = props.railStyle, dotStyle = props.dotStyle, activeDotStyle = props.activeDotStyle, marks = props.marks, dots = props.dots, handleRender = props.handleRender, activeHandleRender = props.activeHandleRender, track = props.track, _props$tabIndex = props.tabIndex, tabIndex = _props$tabIndex === void 0 ? 0 : _props$tabIndex, ariaLabelForHandle = props.ariaLabelForHandle, ariaLabelledByForHandle = props.ariaLabelledByForHandle, ariaRequired = props.ariaRequired, ariaValueTextFormatterForHandle = props.ariaValueTextFormatterForHandle;
  var handlesRef = reactExports.useRef(null);
  var containerRef = reactExports.useRef(null);
  var direction = reactExports.useMemo(function() {
    if (vertical) {
      return reverse ? "ttb" : "btt";
    }
    return reverse ? "rtl" : "ltr";
  }, [reverse, vertical]);
  var _useRange = useRange(range), _useRange2 = _slicedToArray(_useRange, 5), rangeEnabled = _useRange2[0], rangeEditable = _useRange2[1], rangeDraggableTrack = _useRange2[2], minCount = _useRange2[3], maxCount = _useRange2[4];
  var mergedMin = reactExports.useMemo(function() {
    return isFinite(min) ? min : 0;
  }, [min]);
  var mergedMax = reactExports.useMemo(function() {
    return isFinite(max) ? max : 100;
  }, [max]);
  var mergedStep = reactExports.useMemo(function() {
    return step !== null && step <= 0 ? 1 : step;
  }, [step]);
  var mergedPush = reactExports.useMemo(function() {
    if (typeof pushable === "boolean") {
      return pushable ? mergedStep : false;
    }
    return pushable >= 0 ? pushable : false;
  }, [pushable, mergedStep]);
  var markList = reactExports.useMemo(function() {
    return Object.keys(marks || {}).map(function(key) {
      var mark = marks[key];
      var markObj = {
        value: Number(key)
      };
      if (mark && _typeof(mark) === "object" && !/* @__PURE__ */ reactExports.isValidElement(mark) && ("label" in mark || "style" in mark)) {
        markObj.style = mark.style;
        markObj.label = mark.label;
      } else {
        markObj.label = mark;
      }
      return markObj;
    }).filter(function(_ref) {
      var label = _ref.label;
      return label || typeof label === "number";
    }).sort(function(a, b) {
      return a.value - b.value;
    });
  }, [marks]);
  var _useOffset = useOffset(mergedMin, mergedMax, mergedStep, markList, allowCross, mergedPush), _useOffset2 = _slicedToArray(_useOffset, 2), formatValue = _useOffset2[0], offsetValues = _useOffset2[1];
  var _useMergedState = useMergedState(defaultValue, {
    value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedValue = _useMergedState2[0], setValue = _useMergedState2[1];
  var rawValues = reactExports.useMemo(function() {
    var valueList = mergedValue === null || mergedValue === void 0 ? [] : Array.isArray(mergedValue) ? mergedValue : [mergedValue];
    var _valueList = _slicedToArray(valueList, 1), _valueList$ = _valueList[0], val0 = _valueList$ === void 0 ? mergedMin : _valueList$;
    var returnValues = mergedValue === null ? [] : [val0];
    if (rangeEnabled) {
      returnValues = _toConsumableArray(valueList);
      if (count || mergedValue === void 0) {
        var pointCount = count >= 0 ? count + 1 : 2;
        returnValues = returnValues.slice(0, pointCount);
        while (returnValues.length < pointCount) {
          var _returnValues;
          returnValues.push((_returnValues = returnValues[returnValues.length - 1]) !== null && _returnValues !== void 0 ? _returnValues : mergedMin);
        }
      }
      returnValues.sort(function(a, b) {
        return a - b;
      });
    }
    returnValues.forEach(function(val, index) {
      returnValues[index] = formatValue(val);
    });
    return returnValues;
  }, [mergedValue, rangeEnabled, mergedMin, count, formatValue]);
  var getTriggerValue = function getTriggerValue2(triggerValues) {
    return rangeEnabled ? triggerValues : triggerValues[0];
  };
  var triggerChange = useEvent(function(nextValues) {
    var cloneNextValues = _toConsumableArray(nextValues).sort(function(a, b) {
      return a - b;
    });
    if (onChange && !isEqual(cloneNextValues, rawValues, true)) {
      onChange(getTriggerValue(cloneNextValues));
    }
    setValue(cloneNextValues);
  });
  var finishChange = useEvent(function(draggingDelete2) {
    if (draggingDelete2) {
      handlesRef.current.hideHelp();
    }
    var finishValue = getTriggerValue(rawValues);
    onAfterChange === null || onAfterChange === void 0 || onAfterChange(finishValue);
    warningOnce(!onAfterChange, "[rc-slider] `onAfterChange` is deprecated. Please use `onChangeComplete` instead.");
    onChangeComplete === null || onChangeComplete === void 0 || onChangeComplete(finishValue);
  });
  var onDelete = function onDelete2(index) {
    if (disabled || !rangeEditable || rawValues.length <= minCount) {
      return;
    }
    var cloneNextValues = _toConsumableArray(rawValues);
    cloneNextValues.splice(index, 1);
    onBeforeChange === null || onBeforeChange === void 0 || onBeforeChange(getTriggerValue(cloneNextValues));
    triggerChange(cloneNextValues);
    var nextFocusIndex = Math.max(0, index - 1);
    handlesRef.current.hideHelp();
    handlesRef.current.focus(nextFocusIndex);
  };
  var _useDrag = useDrag(containerRef, direction, rawValues, mergedMin, mergedMax, formatValue, triggerChange, finishChange, offsetValues, rangeEditable, minCount), _useDrag2 = _slicedToArray(_useDrag, 5), draggingIndex = _useDrag2[0], draggingValue = _useDrag2[1], draggingDelete = _useDrag2[2], cacheValues = _useDrag2[3], onStartDrag = _useDrag2[4];
  var changeToCloseValue = function changeToCloseValue2(newValue, e) {
    if (!disabled) {
      var cloneNextValues = _toConsumableArray(rawValues);
      var valueIndex = 0;
      var valueBeforeIndex = 0;
      var valueDist = mergedMax - mergedMin;
      rawValues.forEach(function(val, index) {
        var dist = Math.abs(newValue - val);
        if (dist <= valueDist) {
          valueDist = dist;
          valueIndex = index;
        }
        if (val < newValue) {
          valueBeforeIndex = index;
        }
      });
      var focusIndex = valueIndex;
      if (rangeEditable && valueDist !== 0 && (!maxCount || rawValues.length < maxCount)) {
        cloneNextValues.splice(valueBeforeIndex + 1, 0, newValue);
        focusIndex = valueBeforeIndex + 1;
      } else {
        cloneNextValues[valueIndex] = newValue;
      }
      if (rangeEnabled && !rawValues.length && count === void 0) {
        cloneNextValues.push(newValue);
      }
      var nextValue = getTriggerValue(cloneNextValues);
      onBeforeChange === null || onBeforeChange === void 0 || onBeforeChange(nextValue);
      triggerChange(cloneNextValues);
      if (e) {
        var _document$activeEleme, _document$activeEleme2;
        (_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 || (_document$activeEleme2 = _document$activeEleme.blur) === null || _document$activeEleme2 === void 0 || _document$activeEleme2.call(_document$activeEleme);
        handlesRef.current.focus(focusIndex);
        onStartDrag(e, focusIndex, cloneNextValues);
      } else {
        onAfterChange === null || onAfterChange === void 0 || onAfterChange(nextValue);
        warningOnce(!onAfterChange, "[rc-slider] `onAfterChange` is deprecated. Please use `onChangeComplete` instead.");
        onChangeComplete === null || onChangeComplete === void 0 || onChangeComplete(nextValue);
      }
    }
  };
  var onSliderMouseDown = function onSliderMouseDown2(e) {
    e.preventDefault();
    var _containerRef$current = containerRef.current.getBoundingClientRect(), width = _containerRef$current.width, height = _containerRef$current.height, left = _containerRef$current.left, top = _containerRef$current.top, bottom = _containerRef$current.bottom, right = _containerRef$current.right;
    var clientX = e.clientX, clientY = e.clientY;
    var percent;
    switch (direction) {
      case "btt":
        percent = (bottom - clientY) / height;
        break;
      case "ttb":
        percent = (clientY - top) / height;
        break;
      case "rtl":
        percent = (right - clientX) / width;
        break;
      default:
        percent = (clientX - left) / width;
    }
    var nextValue = mergedMin + percent * (mergedMax - mergedMin);
    changeToCloseValue(formatValue(nextValue), e);
  };
  var _React$useState = reactExports.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), keyboardValue = _React$useState2[0], setKeyboardValue = _React$useState2[1];
  var onHandleOffsetChange = function onHandleOffsetChange2(offset, valueIndex) {
    if (!disabled) {
      var next = offsetValues(rawValues, offset, valueIndex);
      onBeforeChange === null || onBeforeChange === void 0 || onBeforeChange(getTriggerValue(rawValues));
      triggerChange(next.values);
      setKeyboardValue(next.value);
    }
  };
  reactExports.useEffect(function() {
    if (keyboardValue !== null) {
      var valueIndex = rawValues.indexOf(keyboardValue);
      if (valueIndex >= 0) {
        handlesRef.current.focus(valueIndex);
      }
    }
    setKeyboardValue(null);
  }, [keyboardValue]);
  var mergedDraggableTrack = reactExports.useMemo(function() {
    if (rangeDraggableTrack && mergedStep === null) {
      return false;
    }
    return rangeDraggableTrack;
  }, [rangeDraggableTrack, mergedStep]);
  var onStartMove = useEvent(function(e, valueIndex) {
    onStartDrag(e, valueIndex);
    onBeforeChange === null || onBeforeChange === void 0 || onBeforeChange(getTriggerValue(rawValues));
  });
  var dragging = draggingIndex !== -1;
  reactExports.useEffect(function() {
    if (!dragging) {
      var valueIndex = rawValues.lastIndexOf(draggingValue);
      handlesRef.current.focus(valueIndex);
    }
  }, [dragging]);
  var sortedCacheValues = reactExports.useMemo(function() {
    return _toConsumableArray(cacheValues).sort(function(a, b) {
      return a - b;
    });
  }, [cacheValues]);
  var _React$useMemo = reactExports.useMemo(function() {
    if (!rangeEnabled) {
      return [mergedMin, sortedCacheValues[0]];
    }
    return [sortedCacheValues[0], sortedCacheValues[sortedCacheValues.length - 1]];
  }, [sortedCacheValues, rangeEnabled, mergedMin]), _React$useMemo2 = _slicedToArray(_React$useMemo, 2), includedStart = _React$useMemo2[0], includedEnd = _React$useMemo2[1];
  reactExports.useImperativeHandle(ref, function() {
    return {
      focus: function focus() {
        handlesRef.current.focus(0);
      },
      blur: function blur() {
        var _containerRef$current2;
        var _document = document, activeElement = _document.activeElement;
        if ((_containerRef$current2 = containerRef.current) !== null && _containerRef$current2 !== void 0 && _containerRef$current2.contains(activeElement)) {
          activeElement === null || activeElement === void 0 || activeElement.blur();
        }
      }
    };
  });
  reactExports.useEffect(function() {
    if (autoFocus) {
      handlesRef.current.focus(0);
    }
  }, []);
  var context = reactExports.useMemo(function() {
    return {
      min: mergedMin,
      max: mergedMax,
      direction,
      disabled,
      keyboard,
      step: mergedStep,
      included,
      includedStart,
      includedEnd,
      range: rangeEnabled,
      tabIndex,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaRequired,
      ariaValueTextFormatterForHandle,
      styles: styles || {},
      classNames: classNames$1 || {}
    };
  }, [mergedMin, mergedMax, direction, disabled, keyboard, mergedStep, included, includedStart, includedEnd, rangeEnabled, tabIndex, ariaLabelForHandle, ariaLabelledByForHandle, ariaRequired, ariaValueTextFormatterForHandle, styles, classNames$1]);
  return /* @__PURE__ */ reactExports.createElement(SliderContext.Provider, {
    value: context
  }, /* @__PURE__ */ reactExports.createElement("div", {
    ref: containerRef,
    className: classNames(prefixCls, className, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(prefixCls, "-disabled"), disabled), "".concat(prefixCls, "-vertical"), vertical), "".concat(prefixCls, "-horizontal"), !vertical), "".concat(prefixCls, "-with-marks"), markList.length)),
    style,
    onMouseDown: onSliderMouseDown,
    id
  }, /* @__PURE__ */ reactExports.createElement("div", {
    className: classNames("".concat(prefixCls, "-rail"), classNames$1 === null || classNames$1 === void 0 ? void 0 : classNames$1.rail),
    style: _objectSpread2(_objectSpread2({}, railStyle), styles === null || styles === void 0 ? void 0 : styles.rail)
  }), track !== false && /* @__PURE__ */ reactExports.createElement(Tracks, {
    prefixCls,
    style: trackStyle,
    values: rawValues,
    startPoint,
    onStartMove: mergedDraggableTrack ? onStartMove : void 0
  }), /* @__PURE__ */ reactExports.createElement(Steps, {
    prefixCls,
    marks: markList,
    dots,
    style: dotStyle,
    activeStyle: activeDotStyle
  }), /* @__PURE__ */ reactExports.createElement(Handles, {
    ref: handlesRef,
    prefixCls,
    style: handleStyle,
    values: cacheValues,
    draggingIndex,
    draggingDelete,
    onStartMove,
    onOffsetChange: onHandleOffsetChange,
    onFocus,
    onBlur,
    handleRender,
    activeHandleRender,
    onChangeComplete: finishChange,
    onDelete: rangeEditable ? onDelete : void 0
  }), /* @__PURE__ */ reactExports.createElement(Marks, {
    prefixCls,
    marks: markList,
    onClick: changeToCloseValue
  })));
});
const SliderInternalContext = /* @__PURE__ */ reactExports.createContext({});
const SliderTooltip = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const {
    open,
    draggingDelete,
    value
  } = props;
  const innerRef = reactExports.useRef(null);
  const mergedOpen = open && !draggingDelete;
  const rafRef = reactExports.useRef(null);
  function cancelKeepAlign() {
    wrapperRaf.cancel(rafRef.current);
    rafRef.current = null;
  }
  function keepAlign() {
    rafRef.current = wrapperRaf(() => {
      var _a;
      (_a = innerRef.current) === null || _a === void 0 ? void 0 : _a.forceAlign();
      rafRef.current = null;
    });
  }
  reactExports.useEffect(() => {
    if (mergedOpen) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }
    return cancelKeepAlign;
  }, [mergedOpen, props.title, value]);
  return /* @__PURE__ */ reactExports.createElement(Tooltip, Object.assign({
    ref: composeRef(innerRef, ref)
  }, props, {
    open: mergedOpen
  }));
});
const genBaseStyle = (token) => {
  const {
    componentCls,
    antCls,
    controlSize,
    dotSize,
    marginFull,
    marginPart,
    colorFillContentHover,
    handleColorDisabled,
    calc,
    handleSize,
    handleSizeHover,
    handleActiveColor,
    handleActiveOutlineColor,
    handleLineWidth,
    handleLineWidthHover,
    motionDurationMid
  } = token;
  return {
    [componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
      position: "relative",
      height: controlSize,
      margin: `${unit(marginPart)} ${unit(marginFull)}`,
      padding: 0,
      cursor: "pointer",
      touchAction: "none",
      "&-vertical": {
        margin: `${unit(marginFull)} ${unit(marginPart)}`
      },
      [`${componentCls}-rail`]: {
        position: "absolute",
        backgroundColor: token.railBg,
        borderRadius: token.borderRadiusXS,
        transition: `background-color ${motionDurationMid}`
      },
      [`${componentCls}-track,${componentCls}-tracks`]: {
        position: "absolute",
        transition: `background-color ${motionDurationMid}`
      },
      [`${componentCls}-track`]: {
        backgroundColor: token.trackBg,
        borderRadius: token.borderRadiusXS
      },
      [`${componentCls}-track-draggable`]: {
        boxSizing: "content-box",
        backgroundClip: "content-box",
        border: "solid rgba(0,0,0,0)"
      },
      "&:hover": {
        [`${componentCls}-rail`]: {
          backgroundColor: token.railHoverBg
        },
        [`${componentCls}-track`]: {
          backgroundColor: token.trackHoverBg
        },
        [`${componentCls}-dot`]: {
          borderColor: colorFillContentHover
        },
        [`${componentCls}-handle::after`]: {
          boxShadow: `0 0 0 ${unit(handleLineWidth)} ${token.colorPrimaryBorderHover}`
        },
        [`${componentCls}-dot-active`]: {
          borderColor: token.dotActiveBorderColor
        }
      },
      [`${componentCls}-handle`]: {
        position: "absolute",
        width: handleSize,
        height: handleSize,
        outline: "none",
        userSelect: "none",
        // Dragging status
        "&-dragging-delete": {
          opacity: 0
        },
        // 扩大选区
        "&::before": {
          content: '""',
          position: "absolute",
          insetInlineStart: calc(handleLineWidth).mul(-1).equal(),
          insetBlockStart: calc(handleLineWidth).mul(-1).equal(),
          width: calc(handleSize).add(calc(handleLineWidth).mul(2)).equal(),
          height: calc(handleSize).add(calc(handleLineWidth).mul(2)).equal(),
          backgroundColor: "transparent"
        },
        "&::after": {
          content: '""',
          position: "absolute",
          insetBlockStart: 0,
          insetInlineStart: 0,
          width: handleSize,
          height: handleSize,
          backgroundColor: token.colorBgElevated,
          boxShadow: `0 0 0 ${unit(handleLineWidth)} ${token.handleColor}`,
          outline: `0px solid transparent`,
          borderRadius: "50%",
          cursor: "pointer",
          transition: `
            inset-inline-start ${motionDurationMid},
            inset-block-start ${motionDurationMid},
            width ${motionDurationMid},
            height ${motionDurationMid},
            box-shadow ${motionDurationMid},
            outline ${motionDurationMid}
          `
        },
        "&:hover, &:active, &:focus": {
          "&::before": {
            insetInlineStart: calc(handleSizeHover).sub(handleSize).div(2).add(handleLineWidthHover).mul(-1).equal(),
            insetBlockStart: calc(handleSizeHover).sub(handleSize).div(2).add(handleLineWidthHover).mul(-1).equal(),
            width: calc(handleSizeHover).add(calc(handleLineWidthHover).mul(2)).equal(),
            height: calc(handleSizeHover).add(calc(handleLineWidthHover).mul(2)).equal()
          },
          "&::after": {
            boxShadow: `0 0 0 ${unit(handleLineWidthHover)} ${handleActiveColor}`,
            outline: `6px solid ${handleActiveOutlineColor}`,
            width: handleSizeHover,
            height: handleSizeHover,
            insetInlineStart: token.calc(handleSize).sub(handleSizeHover).div(2).equal(),
            insetBlockStart: token.calc(handleSize).sub(handleSizeHover).div(2).equal()
          }
        }
      },
      [`&-lock ${componentCls}-handle`]: {
        "&::before, &::after": {
          transition: "none"
        }
      },
      [`${componentCls}-mark`]: {
        position: "absolute",
        fontSize: token.fontSize
      },
      [`${componentCls}-mark-text`]: {
        position: "absolute",
        display: "inline-block",
        color: token.colorTextDescription,
        textAlign: "center",
        wordBreak: "keep-all",
        cursor: "pointer",
        userSelect: "none",
        "&-active": {
          color: token.colorText
        }
      },
      [`${componentCls}-step`]: {
        position: "absolute",
        background: "transparent",
        pointerEvents: "none"
      },
      [`${componentCls}-dot`]: {
        position: "absolute",
        width: dotSize,
        height: dotSize,
        backgroundColor: token.colorBgElevated,
        border: `${unit(handleLineWidth)} solid ${token.dotBorderColor}`,
        borderRadius: "50%",
        cursor: "pointer",
        transition: `border-color ${token.motionDurationSlow}`,
        pointerEvents: "auto",
        "&-active": {
          borderColor: token.dotActiveBorderColor
        }
      },
      [`&${componentCls}-disabled`]: {
        cursor: "not-allowed",
        [`${componentCls}-rail`]: {
          backgroundColor: `${token.railBg} !important`
        },
        [`${componentCls}-track`]: {
          backgroundColor: `${token.trackBgDisabled} !important`
        },
        [`
          ${componentCls}-dot
        `]: {
          backgroundColor: token.colorBgElevated,
          borderColor: token.trackBgDisabled,
          boxShadow: "none",
          cursor: "not-allowed"
        },
        [`${componentCls}-handle::after`]: {
          backgroundColor: token.colorBgElevated,
          cursor: "not-allowed",
          width: handleSize,
          height: handleSize,
          boxShadow: `0 0 0 ${unit(handleLineWidth)} ${handleColorDisabled}`,
          insetInlineStart: 0,
          insetBlockStart: 0
        },
        [`
          ${componentCls}-mark-text,
          ${componentCls}-dot
        `]: {
          cursor: `not-allowed !important`
        }
      },
      [`&-tooltip ${antCls}-tooltip-inner`]: {
        minWidth: "unset"
      }
    })
  };
};
const genDirectionStyle = (token, horizontal) => {
  const {
    componentCls,
    railSize,
    handleSize,
    dotSize,
    marginFull,
    calc
  } = token;
  const railPadding = horizontal ? "paddingBlock" : "paddingInline";
  const full = horizontal ? "width" : "height";
  const part = horizontal ? "height" : "width";
  const handlePos = horizontal ? "insetBlockStart" : "insetInlineStart";
  const markInset = horizontal ? "top" : "insetInlineStart";
  const handlePosSize = calc(railSize).mul(3).sub(handleSize).div(2).equal();
  const draggableBorderSize = calc(handleSize).sub(railSize).div(2).equal();
  const draggableBorder = horizontal ? {
    borderWidth: `${unit(draggableBorderSize)} 0`,
    transform: `translateY(${unit(calc(draggableBorderSize).mul(-1).equal())})`
  } : {
    borderWidth: `0 ${unit(draggableBorderSize)}`,
    transform: `translateX(${unit(token.calc(draggableBorderSize).mul(-1).equal())})`
  };
  return {
    [railPadding]: railSize,
    [part]: calc(railSize).mul(3).equal(),
    [`${componentCls}-rail`]: {
      [full]: "100%",
      [part]: railSize
    },
    [`${componentCls}-track,${componentCls}-tracks`]: {
      [part]: railSize
    },
    [`${componentCls}-track-draggable`]: Object.assign({}, draggableBorder),
    [`${componentCls}-handle`]: {
      [handlePos]: handlePosSize
    },
    [`${componentCls}-mark`]: {
      // Reset all
      insetInlineStart: 0,
      top: 0,
      // https://github.com/ant-design/ant-design/issues/43731
      [markInset]: calc(railSize).mul(3).add(horizontal ? 0 : marginFull).equal(),
      [full]: "100%"
    },
    [`${componentCls}-step`]: {
      // Reset all
      insetInlineStart: 0,
      top: 0,
      [markInset]: railSize,
      [full]: "100%",
      [part]: railSize
    },
    [`${componentCls}-dot`]: {
      position: "absolute",
      [handlePos]: calc(railSize).sub(dotSize).div(2).equal()
    }
  };
};
const genHorizontalStyle = (token) => {
  const {
    componentCls,
    marginPartWithMark
  } = token;
  return {
    [`${componentCls}-horizontal`]: Object.assign(Object.assign({}, genDirectionStyle(token, true)), {
      [`&${componentCls}-with-marks`]: {
        marginBottom: marginPartWithMark
      }
    })
  };
};
const genVerticalStyle = (token) => {
  const {
    componentCls
  } = token;
  return {
    [`${componentCls}-vertical`]: Object.assign(Object.assign({}, genDirectionStyle(token, false)), {
      height: "100%"
    })
  };
};
const prepareComponentToken = (token) => {
  const increaseHandleWidth = 1;
  const controlSize = token.controlHeightLG / 4;
  const controlSizeHover = token.controlHeightSM / 2;
  const handleLineWidth = token.lineWidth + increaseHandleWidth;
  const handleLineWidthHover = token.lineWidth + increaseHandleWidth * 1.5;
  const handleActiveColor = token.colorPrimary;
  const handleActiveOutlineColor = new FastColor(handleActiveColor).setA(0.2).toRgbString();
  return {
    controlSize,
    railSize: 4,
    handleSize: controlSize,
    handleSizeHover: controlSizeHover,
    dotSize: 8,
    handleLineWidth,
    handleLineWidthHover,
    railBg: token.colorFillTertiary,
    railHoverBg: token.colorFillSecondary,
    trackBg: token.colorPrimaryBorder,
    trackHoverBg: token.colorPrimaryBorderHover,
    handleColor: token.colorPrimaryBorder,
    handleActiveColor,
    handleActiveOutlineColor,
    handleColorDisabled: new FastColor(token.colorTextDisabled).onBackground(token.colorBgContainer).toHexString(),
    dotBorderColor: token.colorBorderSecondary,
    dotActiveBorderColor: token.colorPrimaryBorder,
    trackBgDisabled: token.colorBgContainerDisabled
  };
};
const useStyle = genStyleHooks("Slider", (token) => {
  const sliderToken = merge(token, {
    marginPart: token.calc(token.controlHeight).sub(token.controlSize).div(2).equal(),
    marginFull: token.calc(token.controlSize).div(2).equal(),
    marginPartWithMark: token.calc(token.controlHeightLG).sub(token.controlSize).equal()
  });
  return [genBaseStyle(sliderToken), genHorizontalStyle(sliderToken), genVerticalStyle(sliderToken)];
}, prepareComponentToken);
function useRafLock() {
  const [state, setState] = reactExports.useState(false);
  const rafRef = reactExports.useRef(null);
  const cleanup = () => {
    wrapperRaf.cancel(rafRef.current);
  };
  const setDelayState = (nextState) => {
    cleanup();
    if (nextState) {
      setState(nextState);
    } else {
      rafRef.current = wrapperRaf(() => {
        setState(nextState);
      });
    }
  };
  reactExports.useEffect(() => cleanup, []);
  return [state, setDelayState];
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function getTipFormatter(tipFormatter, legacyTipFormatter) {
  if (tipFormatter || tipFormatter === null) {
    return tipFormatter;
  }
  if (legacyTipFormatter || legacyTipFormatter === null) {
    return legacyTipFormatter;
  }
  return (val) => typeof val === "number" ? val.toString() : "";
}
const Slider = /* @__PURE__ */ React.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    range,
    className,
    rootClassName,
    style,
    disabled,
    // Deprecated Props
    tooltipPrefixCls: legacyTooltipPrefixCls,
    tipFormatter: legacyTipFormatter,
    tooltipVisible: legacyTooltipVisible,
    getTooltipPopupContainer: legacyGetTooltipPopupContainer,
    tooltipPlacement: legacyTooltipPlacement,
    tooltip = {},
    onChangeComplete,
    classNames: sliderClassNames,
    styles
  } = props, restProps = __rest(props, ["prefixCls", "range", "className", "rootClassName", "style", "disabled", "tooltipPrefixCls", "tipFormatter", "tooltipVisible", "getTooltipPopupContainer", "tooltipPlacement", "tooltip", "onChangeComplete", "classNames", "styles"]);
  const {
    vertical
  } = props;
  const {
    getPrefixCls,
    direction: contextDirection,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles,
    getPopupContainer
  } = useComponentConfig("slider");
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = disabled !== null && disabled !== void 0 ? disabled : contextDisabled;
  const {
    handleRender: contextHandleRender,
    direction: internalContextDirection
  } = React.useContext(SliderInternalContext);
  const mergedDirection = internalContextDirection || contextDirection;
  const isRTL = mergedDirection === "rtl";
  const [hoverOpen, setHoverOpen] = useRafLock();
  const [focusOpen, setFocusOpen] = useRafLock();
  const tooltipProps = Object.assign({}, tooltip);
  const {
    open: tooltipOpen,
    placement: tooltipPlacement,
    getPopupContainer: getTooltipPopupContainer,
    prefixCls: customizeTooltipPrefixCls,
    formatter: tipFormatter
  } = tooltipProps;
  const lockOpen = tooltipOpen !== null && tooltipOpen !== void 0 ? tooltipOpen : legacyTooltipVisible;
  const activeOpen = (hoverOpen || focusOpen) && lockOpen !== false;
  const mergedTipFormatter = getTipFormatter(tipFormatter, legacyTipFormatter);
  const [dragging, setDragging] = useRafLock();
  const onInternalChangeComplete = (nextValues) => {
    onChangeComplete === null || onChangeComplete === void 0 ? void 0 : onChangeComplete(nextValues);
    setDragging(false);
  };
  const getTooltipPlacement = (placement, vert) => {
    if (placement) {
      return placement;
    }
    if (!vert) {
      return "top";
    }
    return isRTL ? "left" : "right";
  };
  const prefixCls = getPrefixCls("slider", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const rootClassNames = classNames(className, contextClassName, contextClassNames.root, sliderClassNames === null || sliderClassNames === void 0 ? void 0 : sliderClassNames.root, rootClassName, {
    [`${prefixCls}-rtl`]: isRTL,
    [`${prefixCls}-lock`]: dragging
  }, hashId, cssVarCls);
  if (isRTL && !restProps.vertical) {
    restProps.reverse = !restProps.reverse;
  }
  React.useEffect(() => {
    const onMouseUp = () => {
      wrapperRaf(() => {
        setFocusOpen(false);
      }, 1);
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  const useActiveTooltipHandle = range && !lockOpen;
  const handleRender = contextHandleRender || ((node, info) => {
    const {
      index
    } = info;
    const nodeProps = node.props;
    function proxyEvent(eventName, event, triggerRestPropsEvent) {
      var _a, _b, _c, _d;
      if (triggerRestPropsEvent) {
        (_b = (_a = restProps)[eventName]) === null || _b === void 0 ? void 0 : _b.call(_a, event);
      }
      (_d = (_c = nodeProps)[eventName]) === null || _d === void 0 ? void 0 : _d.call(_c, event);
    }
    const passedProps = Object.assign(Object.assign({}, nodeProps), {
      onMouseEnter: (e) => {
        setHoverOpen(true);
        proxyEvent("onMouseEnter", e);
      },
      onMouseLeave: (e) => {
        setHoverOpen(false);
        proxyEvent("onMouseLeave", e);
      },
      onMouseDown: (e) => {
        setFocusOpen(true);
        setDragging(true);
        proxyEvent("onMouseDown", e);
      },
      onFocus: (e) => {
        var _a;
        setFocusOpen(true);
        (_a = restProps.onFocus) === null || _a === void 0 ? void 0 : _a.call(restProps, e);
        proxyEvent("onFocus", e, true);
      },
      onBlur: (e) => {
        var _a;
        setFocusOpen(false);
        (_a = restProps.onBlur) === null || _a === void 0 ? void 0 : _a.call(restProps, e);
        proxyEvent("onBlur", e, true);
      }
    });
    const cloneNode = /* @__PURE__ */ React.cloneElement(node, passedProps);
    const open = (!!lockOpen || activeOpen) && mergedTipFormatter !== null;
    if (!useActiveTooltipHandle) {
      return /* @__PURE__ */ React.createElement(SliderTooltip, Object.assign({}, tooltipProps, {
        prefixCls: getPrefixCls("tooltip", customizeTooltipPrefixCls !== null && customizeTooltipPrefixCls !== void 0 ? customizeTooltipPrefixCls : legacyTooltipPrefixCls),
        title: mergedTipFormatter ? mergedTipFormatter(info.value) : "",
        value: info.value,
        open,
        placement: getTooltipPlacement(tooltipPlacement !== null && tooltipPlacement !== void 0 ? tooltipPlacement : legacyTooltipPlacement, vertical),
        key: index,
        classNames: {
          root: `${prefixCls}-tooltip`
        },
        getPopupContainer: getTooltipPopupContainer || legacyGetTooltipPopupContainer || getPopupContainer
      }), cloneNode);
    }
    return cloneNode;
  });
  const activeHandleRender = useActiveTooltipHandle ? (handle, info) => {
    const cloneNode = /* @__PURE__ */ React.cloneElement(handle, {
      style: Object.assign(Object.assign({}, handle.props.style), {
        visibility: "hidden"
      })
    });
    return /* @__PURE__ */ React.createElement(SliderTooltip, Object.assign({}, tooltipProps, {
      prefixCls: getPrefixCls("tooltip", customizeTooltipPrefixCls !== null && customizeTooltipPrefixCls !== void 0 ? customizeTooltipPrefixCls : legacyTooltipPrefixCls),
      title: mergedTipFormatter ? mergedTipFormatter(info.value) : "",
      open: mergedTipFormatter !== null && activeOpen,
      placement: getTooltipPlacement(tooltipPlacement !== null && tooltipPlacement !== void 0 ? tooltipPlacement : legacyTooltipPlacement, vertical),
      key: "tooltip",
      classNames: {
        root: `${prefixCls}-tooltip`
      },
      getPopupContainer: getTooltipPopupContainer || legacyGetTooltipPopupContainer || getPopupContainer,
      draggingDelete: info.draggingDelete
    }), cloneNode);
  } : void 0;
  const rootStyle = Object.assign(Object.assign(Object.assign(Object.assign({}, contextStyles.root), contextStyle), styles === null || styles === void 0 ? void 0 : styles.root), style);
  const mergedTracks = Object.assign(Object.assign({}, contextStyles.tracks), styles === null || styles === void 0 ? void 0 : styles.tracks);
  const mergedTracksClassNames = classNames(contextClassNames.tracks, sliderClassNames === null || sliderClassNames === void 0 ? void 0 : sliderClassNames.tracks);
  return wrapCSSVar(
    // @ts-ignore
    /* @__PURE__ */ React.createElement(Slider$1, Object.assign({}, restProps, {
      classNames: Object.assign({
        handle: classNames(contextClassNames.handle, sliderClassNames === null || sliderClassNames === void 0 ? void 0 : sliderClassNames.handle),
        rail: classNames(contextClassNames.rail, sliderClassNames === null || sliderClassNames === void 0 ? void 0 : sliderClassNames.rail),
        track: classNames(contextClassNames.track, sliderClassNames === null || sliderClassNames === void 0 ? void 0 : sliderClassNames.track)
      }, mergedTracksClassNames ? {
        tracks: mergedTracksClassNames
      } : {}),
      styles: Object.assign({
        handle: Object.assign(Object.assign({}, contextStyles.handle), styles === null || styles === void 0 ? void 0 : styles.handle),
        rail: Object.assign(Object.assign({}, contextStyles.rail), styles === null || styles === void 0 ? void 0 : styles.rail),
        track: Object.assign(Object.assign({}, contextStyles.track), styles === null || styles === void 0 ? void 0 : styles.track)
      }, Object.keys(mergedTracks).length ? {
        tracks: mergedTracks
      } : {}),
      step: restProps.step,
      range,
      className: rootClassNames,
      style: rootStyle,
      disabled: mergedDisabled,
      ref,
      prefixCls,
      handleRender,
      activeHandleRender,
      onChangeComplete: onInternalChangeComplete
    }))
  );
});
export {
  SliderInternalContext as S,
  UnstableContext as U,
  Slider as a
};
//# sourceMappingURL=index-BXtDgZ6P.js.map
