import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, B as Button, T as Typography, l as Space, F as ForwardTable, c as apiRequest, p as Tag } from "./index-B4P9h-k1.js";
import { R as RefIcon$1 } from "./ReloadOutlined-b-zgDpPK.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon$2 } from "./SafetyOutlined-BeV9iQ8R.js";
import { R as RefIcon$3 } from "./SettingOutlined-COiCZpX-.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import { R as RefIcon$4 } from "./WarningOutlined-D-UZyf1F.js";
import { R as RefIcon$5 } from "./ExclamationCircleOutlined-Ct9zijvs.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import "./index-BlJydARW.js";
import "./Skeleton-D3e3aC7P.js";
var FireOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M834.1 469.2A347.49 347.49 0 00751.2 354l-29.1-26.7a8.09 8.09 0 00-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 01-47.5 46.1 352.6 352.6 0 00-100.3 121.5A347.75 347.75 0 00160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0075.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 00760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0027.7-136c0-48.8-10-96.2-29.9-140.9zM713 808.5c-53.7 53.2-125 82.4-201 82.4s-147.3-29.2-201-82.4c-53.5-53.1-83-123.5-83-198.4 0-43.5 9.8-85.2 29.1-124 18.8-37.9 46.8-71.8 80.8-97.9a349.6 349.6 0 0058.6-56.8c25-30.5 44.6-64.5 58.2-101a240 240 0 0012.1-46.5c24.1 22.2 44.3 49 61.2 80.4 33.4 62.6 48.8 118.3 45.8 165.7a74.01 74.01 0 0024.4 59.8 73.36 73.36 0 0053.4 18.8c19.7-1 37.8-9.7 51-24.4 13.3-14.9 24.8-30.1 34.4-45.6 14 17.9 25.7 37.4 35 58.4 15.9 35.8 24 73.9 24 113.1 0 74.9-29.5 145.4-83 198.4z" } }] }, "name": "fire", "theme": "outlined" };
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
const FireOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: FireOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(FireOutlined);
const { Title, Text } = Typography;
const SecurityDashboard = () => {
  const [loading, setLoading] = reactExports.useState(true);
  const [dashboardData, setDashboardData] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const navigate = useNavigate();
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/api/security/dashboard", "GET");
      setDashboardData(response);
    } catch (err) {
      setError(err.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3e4);
    return () => clearInterval(interval);
  }, []);
  const getAlertLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "info":
        return "blue";
      case "warning":
        return "orange";
      case "critical":
        return "red";
      case "emergency":
        return "red";
      default:
        return "default";
    }
  };
  const eventColumns = [
    {
      title: "Время",
      dataIndex: "event_time",
      key: "event_time",
      render: (time) => new Date(time).toLocaleString("ru-RU"),
      width: 150
    },
    {
      title: "Событие",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Уровень",
      dataIndex: "alert_level",
      key: "alert_level",
      render: (level) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: getAlertLevelColor(level), children: level.toUpperCase() }),
      width: 100
    }
  ];
  if (loading && !dashboardData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", textAlign: "center", boxSizing: "border-box", maxWidth: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { spin: true, style: { fontSize: 24 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-sm)" }, children: "Загрузка данных безопасности..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Ошибка загрузки",
        description: error,
        type: "error",
        showIcon: true,
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: fetchDashboardData, children: "Повторить" })
      }
    ) });
  }
  if (!dashboardData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { message: "Нет данных", type: "info" }) });
  }
  const { system_status, event_statistics, ethics_statistics, active_events } = dashboardData;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-spacing-sm)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { marginRight: 8 } }),
        "Панель безопасности"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
            onClick: () => navigate("/security/settings"),
            children: "Настройки"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
            onClick: fetchDashboardData,
            loading,
            children: "Обновить"
          }
        )
      ] })
    ] }),
    system_status.is_emergency_stopped && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "СИСТЕМА В РЕЖИМЕ АВАРИЙНОЙ ОСТАНОВКИ",
        description: "Все операции Soul заблокированы. Требуется ручное восстановление.",
        type: "error",
        showIcon: true,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
        style: { marginBottom: "var(--sp-spacing-sm)" },
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, onClick: () => navigate("/security/emergency"), children: "Управление" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], style: { marginBottom: "var(--sp-spacing-sm)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Уровень безопасности",
          value: system_status.current_level,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {})
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Активные аномалии",
          value: system_status.active_anomalies,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {})
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Активные события",
          value: system_status.active_events,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {})
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Последняя проверка",
          value: new Date(system_status.last_check).toLocaleTimeString("ru-RU"),
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {})
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], style: { marginBottom: "var(--sp-spacing-sm)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, lg: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Статистика событий", size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 16, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Statistic,
          {
            title: "Всего событий",
            value: (event_statistics == null ? void 0 : event_statistics.total_events) || 0,
            size: "small"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Statistic,
          {
            title: "Критических",
            value: (event_statistics == null ? void 0 : event_statistics.critical_events) || 0,
            size: "small"
          }
        ) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, lg: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Этические проверки", size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 16, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Statistic,
          {
            title: "Всего проверок",
            value: (ethics_statistics == null ? void 0 : ethics_statistics.total_checks) || 0,
            size: "small"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Statistic,
          {
            title: "Нарушений",
            value: (ethics_statistics == null ? void 0 : ethics_statistics.violations) || 0,
            size: "small"
          }
        ) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Активные события безопасности",
        size: "small",
        extra: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "small",
            onClick: () => navigate("/security/events"),
            children: "Все события"
          }
        ),
        children: active_events.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            dataSource: active_events,
            columns: eventColumns,
            rowKey: "id",
            pagination: false,
            size: "small"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: "var(--sp-spacing-sm)" }, children: "Активных событий нет" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate("/security/anomalies"), children: "Аномалии" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate("/security/events"), children: "События" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate("/security/ethics"), children: "Этика" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate("/security/settings"), children: "Настройки" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-sm)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: [
      "Последнее обновление: ",
      new Date(dashboardData.last_updated).toLocaleString("ru-RU")
    ] }) })
  ] });
};
export {
  SecurityDashboard as default
};
//# sourceMappingURL=SecurityDashboard-DuXXPvQU.js.map
