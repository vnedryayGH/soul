import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { s as staticMethods, aC as Spin, B as Button, F as ForwardTable, n as Select, I as Input, l as Space, p as Tag } from "./index-B4P9h-k1.js";
import { R as RefIcon$1 } from "./RocketOutlined-BJpi1OW_.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { C as Card, T as Tabs } from "./index-C8B9-ZwJ.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import { I as Icon } from "./AntdIcon-bc3Msg1y.js";
import { R as RefIcon$2 } from "./TrophyOutlined-DgPxsEl-.js";
import { R as RefIcon$3 } from "./CheckCircleOutlined-sGJe5hoH.js";
import { R as RefIcon$4 } from "./SyncOutlined-0cRsLd2H.js";
import { P as Progress } from "./progress-CLbv5c2s.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon$5 } from "./PlayCircleOutlined-cDrp-gaP.js";
import { R as RefIcon$6 } from "./ReloadOutlined-b-zgDpPK.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { R as RefIcon$7 } from "./BarChartOutlined-CGK-AIOx.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./index-BlJydARW.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
var AimOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "defs", "attrs": {}, "children": [{ "tag": "style", "attrs": {} }] }, { "tag": "path", "attrs": { "d": "M952 474H829.8C812.5 327.6 696.4 211.5 550 194.2V72c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v122.2C327.6 211.5 211.5 327.6 194.2 474H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h122.2C211.5 696.4 327.6 812.5 474 829.8V952c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V829.8C696.4 812.5 812.5 696.4 829.8 550H952c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM512 756c-134.8 0-244-109.2-244-244s109.2-244 244-244 244 109.2 244 244-109.2 244-244 244z" } }, { "tag": "path", "attrs": { "d": "M512 392c-32.1 0-62.1 12.4-84.8 35.2-22.7 22.7-35.2 52.7-35.2 84.8s12.5 62.1 35.2 84.8C449.9 619.4 480 632 512 632s62.1-12.5 84.8-35.2C619.4 574.1 632 544 632 512s-12.5-62.1-35.2-84.8A118.57 118.57 0 00512 392z" } }] }, "name": "aim", "theme": "outlined" };
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
const AimOutlined = (props, ref) => /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
  ref,
  icon: AimOutlined$1
}));
const RefIcon = /* @__PURE__ */ reactExports.forwardRef(AimOutlined);
const { TabPane } = Tabs;
const { TextArea } = Input;
const ActivityGoalsIntegration = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const [dashboardData, setDashboardData] = reactExports.useState(null);
  const [selectedActivity, setSelectedActivity] = reactExports.useState(null);
  const [activitySummary, setActivitySummary] = reactExports.useState(null);
  const [progressModalVisible, setProgressModalVisible] = reactExports.useState(false);
  const [syncModalVisible, setSyncModalVisible] = reactExports.useState(false);
  const [form] = Form.useForm();
  reactExports.useEffect(() => {
    loadDashboard();
  }, []);
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/activities/goals/dashboard");
      const result = await response.json();
      if (result.status === "success") {
        setDashboardData(result.data);
      } else {
        staticMethods.error("Ошибка загрузки дашборда");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      staticMethods.error("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };
  const syncAllActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/activities/goals/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      if (result.status === "success") {
        staticMethods.success(`Синхронизировано активностей: ${result.details.synced_activities}`);
        loadDashboard();
      } else {
        staticMethods.error("Ошибка синхронизации");
      }
    } catch (error) {
      console.error("Error syncing activities:", error);
      staticMethods.error("Ошибка синхронизации");
    } finally {
      setLoading(false);
    }
  };
  const syncActivity = async (activityId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/goals/sync/${activityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      if (result.status === "success") {
        staticMethods.success("Активность синхронизирована");
        loadDashboard();
        if (selectedActivity === activityId) {
          loadActivitySummary(activityId);
        }
      } else {
        staticMethods.error("Ошибка синхронизации активности");
      }
    } catch (error) {
      console.error("Error syncing activity:", error);
      staticMethods.error("Ошибка синхронизации активности");
    } finally {
      setLoading(false);
    }
  };
  const loadActivitySummary = async (activityId) => {
    try {
      const response = await fetch(`/api/activities/goals/summary/${activityId}`);
      const result = await response.json();
      if (result.status === "success") {
        setActivitySummary(result.data);
      } else {
        staticMethods.error("Ошибка загрузки сводки активности");
      }
    } catch (error) {
      console.error("Error loading activity summary:", error);
      staticMethods.error("Ошибка загрузки сводки активности");
    }
  };
  const updateProgress = async (values) => {
    if (!selectedActivity) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/goals/progress/${selectedActivity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = await response.json();
      if (result.status === "success") {
        staticMethods.success("Прогресс обновлен");
        setProgressModalVisible(false);
        form.resetFields();
        loadDashboard();
        loadActivitySummary(selectedActivity);
      } else {
        staticMethods.error("Ошибка обновления прогресса");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      staticMethods.error("Ошибка обновления прогресса");
    } finally {
      setLoading(false);
    }
  };
  const testIntegration = async () => {
    setLoading(true);
    try {
      const testData = {
        create_test_activity: true,
        title: "Тестовая активность интеграции",
        description: "Проверка работы интеграции целей и активностей",
        priority: 0.8,
        goals: [
          { goal_type: "regular", priority: 0.9, description: "Тестовая обычная цель" },
          { goal_type: "absolute", priority: 0.7, description: "Тестовая критическая цель" }
        ]
      };
      const response = await fetch("/api/activities/goals/test-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      });
      const result = await response.json();
      if (result.status === "success") {
        staticMethods.success(`Тест завершен! ID активности: ${result.test_activity_id}`);
        loadDashboard();
      } else {
        staticMethods.error("Ошибка тестирования");
      }
    } catch (error) {
      console.error("Error testing integration:", error);
      staticMethods.error("Ошибка тестирования");
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (rate) => {
    if (rate >= 80) return "#52c41a";
    if (rate >= 50) return "#faad14";
    return "#f5222d";
  };
  const getStatusTag = (rate) => {
    if (rate >= 80) return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "success", children: "Отлично" });
    if (rate >= 50) return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "warning", children: "Хорошо" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "error", children: "Требует внимания" });
  };
  const activityColumns = [
    {
      title: "Активность",
      dataIndex: "title",
      key: "title",
      render: (text, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "blue", children: [
          "Приоритет: ",
          record.priority.toFixed(2)
        ] })
      ] })
    },
    {
      title: "Квантовые цели",
      dataIndex: "quantum_goals_count",
      key: "quantum_goals_count",
      render: (count, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Statistic,
          {
            value: count,
            suffix: `/ ${record.completed_goals} завершено`,
            valueStyle: { fontSize: "14px" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            percent: record.completion_rate,
            size: "small",
            strokeColor: getStatusColor(record.completion_rate)
          }
        )
      ] })
    },
    {
      title: "Средний прогресс",
      dataIndex: "average_progress",
      key: "average_progress",
      render: (progress) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Progress,
        {
          percent: progress,
          strokeColor: getStatusColor(progress),
          format: (percent) => `${percent == null ? void 0 : percent.toFixed(1)}%`
        }
      )
    },
    {
      title: "Статус",
      key: "status",
      render: (record) => getStatusTag(record.completion_rate)
    },
    {
      title: "Действия",
      key: "actions",
      render: (record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "small",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, {}),
            onClick: () => {
              setSelectedActivity(record.id);
              loadActivitySummary(record.id);
            },
            children: "Детали"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "small",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
            onClick: () => syncActivity(record.id),
            children: "Синхронизировать"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "small",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}),
            onClick: () => {
              setSelectedActivity(record.id);
              setProgressModalVisible(true);
            },
            children: "Прогресс"
          }
        )
      ] })
    }
  ];
  if (loading && !dashboardData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "50px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { size: "large" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Загрузка дашборда интеграции..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "24px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { marginRight: "8px", color: "#1890ff" } }),
        "Интеграция Активностей и Целей"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Управление связями между активностями и квантовыми целями системы" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Всего активностей",
          value: (dashboardData == null ? void 0 : dashboardData.overview.total_activities) || 0,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
          valueStyle: { color: "#1890ff" }
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Квантовые цели",
          value: (dashboardData == null ? void 0 : dashboardData.overview.total_quantum_goals) || 0,
          suffix: `/ ${(dashboardData == null ? void 0 : dashboardData.overview.total_activity_goals) || 0}`,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}),
          valueStyle: { color: "#52c41a" }
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Завершено целей",
          value: (dashboardData == null ? void 0 : dashboardData.overview.completed_quantum_goals) || 0,
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {}),
          valueStyle: { color: "#722ed1" }
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Statistic,
        {
          title: "Покрытие интеграции",
          value: (dashboardData == null ? void 0 : dashboardData.overview.integration_coverage) || 0,
          suffix: "%",
          prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}),
          valueStyle: { color: "#fa8c16" }
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Прогресс целей", size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            type: "circle",
            percent: (dashboardData == null ? void 0 : dashboardData.overview.goals_completion_rate) || 0,
            strokeColor: getStatusColor((dashboardData == null ? void 0 : dashboardData.overview.goals_completion_rate) || 0),
            format: (percent) => `${percent == null ? void 0 : percent.toFixed(1)}%`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { textAlign: "center", marginTop: "8px" }, children: "Завершение целей" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Прогресс этапов", size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            type: "circle",
            percent: (dashboardData == null ? void 0 : dashboardData.overview.milestones_completion_rate) || 0,
            strokeColor: getStatusColor((dashboardData == null ? void 0 : dashboardData.overview.milestones_completion_rate) || 0),
            format: (percent) => `${percent == null ? void 0 : percent.toFixed(1)}%`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { textAlign: "center", marginTop: "8px" }, children: "Завершение этапов" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Средний прогресс", size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            type: "circle",
            percent: (dashboardData == null ? void 0 : dashboardData.overview.average_milestone_progress) || 0,
            strokeColor: getStatusColor((dashboardData == null ? void 0 : dashboardData.overview.average_milestone_progress) || 0),
            format: (percent) => `${percent == null ? void 0 : percent.toFixed(1)}%`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { textAlign: "center", marginTop: "8px" }, children: "По всем этапам" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Управление интеграцией",
        style: { marginBottom: "24px" },
        extra: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end", maxWidth: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", type: "primary", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, {}), onClick: syncAllActivities, loading, children: "Синхронизировать все" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, {}), onClick: testIntegration, loading, children: "Тест интеграции" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}), onClick: loadDashboard, loading, children: "Обновить" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Alert,
          {
            message: "Система интеграции активностей и целей",
            description: "Автоматически синхронизирует activity_goals с quantum_goals, отслеживает прогресс выполнения и управляет этапами достижения целей.",
            type: "info",
            showIcon: true,
            style: { marginBottom: "16px" }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultActiveKey: "activities", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "Активности", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          columns: activityColumns,
          dataSource: (dashboardData == null ? void 0 : dashboardData.top_activities) || [],
          rowKey: "id",
          loading,
          pagination: { pageSize: 10 }
        }
      ) }, "activities"),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "Детали активности", disabled: !selectedActivity, children: activitySummary && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: `Активность: ${activitySummary.activity_title}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "Цели активности",
              value: activitySummary.total_activity_goals,
              prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {})
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "Квантовые цели",
              value: activitySummary.total_quantum_goals,
              prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {})
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Statistic,
            {
              title: "Завершено целей",
              value: activitySummary.completed_goals,
              prefix: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], style: { marginTop: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Прогресс целей", size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              percent: activitySummary.goals_completion_rate,
              strokeColor: getStatusColor(activitySummary.goals_completion_rate)
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Прогресс этапов", size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              percent: activitySummary.milestones_completion_rate,
              strokeColor: getStatusColor(activitySummary.milestones_completion_rate)
            }
          ) }) })
        ] })
      ] }) }, "details")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "Обновить прогресс активности",
        open: progressModalVisible,
        onCancel: () => setProgressModalVisible(false),
        onOk: () => form.submit(),
        confirmLoading: loading,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Form,
          {
            form,
            layout: "vertical",
            onFinish: updateProgress,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  name: "completion_percentage",
                  label: "Процент завершения",
                  rules: [{ required: true, message: "Укажите процент завершения" }],
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TypedInputNumber,
                    {
                      min: 0,
                      max: 100,
                      step: 0.1,
                      style: { width: "100%" },
                      formatter: (value) => `${value}%`,
                      parser: (value) => value.replace("%", "")
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  name: "status",
                  label: "Статус",
                  rules: [{ required: true, message: "Выберите статус" }],
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "pending", children: "Ожидание" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "in_progress", children: "В процессе" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "completed", children: "Завершено" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Select.Option, { value: "paused", children: "Приостановлено" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  name: "notes",
                  label: "Заметки",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextArea, { rows: 3, placeholder: "Дополнительная информация о прогрессе..." })
                }
              )
            ]
          }
        )
      }
    )
  ] });
};
export {
  ActivityGoalsIntegration as default
};
//# sourceMappingURL=ActivityGoalsIntegration-Ck5eeg0u.js.map
