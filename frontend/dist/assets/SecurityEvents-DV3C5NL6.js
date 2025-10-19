import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, T as Typography, l as Space, B as Button, n as Select, F as ForwardTable, p as Tag, I as Input, c as apiRequest, s as staticMethods } from "./index-B4P9h-k1.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { R as RefIcon } from "./ExclamationCircleOutlined-Ct9zijvs.js";
import { R as RefIcon$1 } from "./ReloadOutlined-b-zgDpPK.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import { R as RefIcon$2 } from "./CheckCircleOutlined-sGJe5hoH.js";
import { A as Alert } from "./index-DVLFW87y.js";
import "./row-BcQp44VL.js";
import "./index-BlJydARW.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./AntdIcon-bc3Msg1y.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const SecurityEvents = () => {
  const [loading, setLoading] = reactExports.useState(true);
  const [events, setEvents] = reactExports.useState([]);
  const [selectedEvent, setSelectedEvent] = reactExports.useState(null);
  const [resolveModalVisible, setResolveModalVisible] = reactExports.useState(false);
  const [filters, setFilters] = reactExports.useState({
    alert_level: void 0,
    resolved: void 0
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.alert_level) params.append("alert_level", filters.alert_level);
      if (filters.resolved !== void 0) params.append("resolved", filters.resolved.toString());
      const response = await apiRequest(`/api/security/events?${params.toString()}`, "GET");
      setEvents(response.events || []);
    } catch (err) {
      staticMethods.error("Ошибка загрузки событий: " + (err.message || "Неизвестная ошибка"));
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchEvents();
  }, [filters]);
  const handleResolveEvent = async (values) => {
    if (!selectedEvent) return;
    try {
      await apiRequest(`/api/security/events/${selectedEvent.id}/resolve`, "POST", {
        resolution_notes: values.resolution_notes
      });
      staticMethods.success("Событие успешно разрешено");
      setResolveModalVisible(false);
      setSelectedEvent(null);
      form.resetFields();
      fetchEvents();
    } catch (err) {
      staticMethods.error("Ошибка разрешения события: " + (err.message || "Неизвестная ошибка"));
    }
  };
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
  const columns = [
    {
      title: "Время",
      dataIndex: "event_time",
      key: "event_time",
      render: (time) => new Date(time).toLocaleString("ru-RU"),
      width: 150,
      sorter: (a, b) => new Date(a.event_time).getTime() - new Date(b.event_time).getTime()
    },
    {
      title: "Тип",
      dataIndex: "event_type",
      key: "event_type",
      width: 120
    },
    {
      title: "Уровень",
      dataIndex: "alert_level",
      key: "alert_level",
      render: (level) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: getAlertLevelColor(level), children: level.toUpperCase() }),
      width: 100,
      filters: [
        { text: "INFO", value: "INFO" },
        { text: "WARNING", value: "WARNING" },
        { text: "CRITICAL", value: "CRITICAL" },
        { text: "EMERGENCY", value: "EMERGENCY" }
      ],
      onFilter: (value, record) => record.alert_level === value
    },
    {
      title: "Событие",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Статус",
      dataIndex: "resolved",
      key: "resolved",
      render: (resolved, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        resolved ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), children: "Разрешено" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "red", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), children: "Активно" }),
        resolved && record.resolved_at && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12 }, children: new Date(record.resolved_at).toLocaleString("ru-RU") })
      ] }),
      width: 150,
      filters: [
        { text: "Активные", value: false },
        { text: "Разрешенные", value: true }
      ],
      onFilter: (value, record) => record.resolved === value
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "small",
            onClick: () => setSelectedEvent(record),
            children: "Детали"
          }
        ),
        !record.resolved && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "small",
            type: "primary",
            onClick: () => {
              setSelectedEvent(record);
              setResolveModalVisible(true);
            },
            children: "Разрешить"
          }
        )
      ] }),
      width: 120
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-spacing-sm)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { marginRight: 8 } }),
        "События безопасности"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate("/security"),
            children: "Назад к панели"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
            onClick: fetchEvents,
            loading,
            children: "Обновить"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", style: { marginBottom: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          placeholder: "Уровень оповещения",
          allowClear: true,
          style: { width: 150 },
          value: filters.alert_level,
          onChange: (value) => setFilters((prev) => ({ ...prev, alert_level: value })),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "INFO", children: "INFO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "WARNING", children: "WARNING" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "CRITICAL", children: "CRITICAL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: "EMERGENCY", children: "EMERGENCY" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          placeholder: "Статус",
          allowClear: true,
          style: { width: 120 },
          value: filters.resolved,
          onChange: (value) => setFilters((prev) => ({ ...prev, resolved: value })),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: false, children: "Активные" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Option, { value: true, children: "Разрешенные" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        dataSource: events,
        columns,
        rowKey: "id",
        loading,
        pagination: {
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Всего событий: ${total}`
        },
        scroll: { x: 800 }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "Детали события",
        open: !!selectedEvent && !resolveModalVisible,
        onCancel: () => setSelectedEvent(null),
        footer: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setSelectedEvent(null), children: "Закрыть" }, "close"),
          !(selectedEvent == null ? void 0 : selectedEvent.resolved) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "primary",
              onClick: () => setResolveModalVisible(true),
              children: "Разрешить событие"
            },
            "resolve"
          )
        ].filter(Boolean),
        width: 600,
        children: selectedEvent && /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: 1, bordered: true, size: "small", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "ID", children: selectedEvent.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Время", children: new Date(selectedEvent.event_time).toLocaleString("ru-RU") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Тип", children: selectedEvent.event_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Уровень", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: getAlertLevelColor(selectedEvent.alert_level), children: selectedEvent.alert_level }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Заголовок", children: selectedEvent.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Описание", children: selectedEvent.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Статус", children: selectedEvent.resolved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, {}), children: [
            "Разрешено ",
            selectedEvent.resolved_at && `(${new Date(selectedEvent.resolved_at).toLocaleString("ru-RU")})`
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "red", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), children: "Активно" }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: "Разрешить событие безопасности",
        open: resolveModalVisible,
        onCancel: () => {
          setResolveModalVisible(false);
          form.resetFields();
        },
        onOk: () => form.submit(),
        okText: "Разрешить",
        cancelText: "Отмена",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: "Внимание",
              description: "Разрешение события означает, что проблема устранена и не требует дальнейшего внимания.",
              type: "warning",
              showIcon: true,
              style: { marginBottom: "var(--sp-spacing-sm)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Form,
            {
              form,
              layout: "vertical",
              onFinish: handleResolveEvent,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Form.Item,
                {
                  label: "Комментарий к разрешению",
                  name: "resolution_notes",
                  rules: [
                    { required: true, message: "Пожалуйста, укажите причину разрешения" },
                    { min: 10, message: "Комментарий должен содержать минимум 10 символов" }
                  ],
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TextArea,
                    {
                      rows: 4,
                      placeholder: "Опишите, как была решена проблема или почему событие больше не актуально..."
                    }
                  )
                }
              )
            }
          )
        ]
      }
    )
  ] });
};
export {
  SecurityEvents as default
};
//# sourceMappingURL=SecurityEvents-DV3C5NL6.js.map
