import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { u as useNavigate, c as apiRequest, s as staticMethods, B as Button, l as Space, T as Typography, n as Select, I as Input, F as ForwardTable, p as Tag } from "./index-B4P9h-k1.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { D as DatePicker } from "./index-I1l_E206.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./Skeleton-D3e3aC7P.js";
import "./CalendarOutlined-B_ajlQ0Y.js";
import "./ClockCircleOutlined-B2hpDlMl.js";
import "./index-BlJydARW.js";
const severityTag = (sev) => {
  const n = typeof sev === "string" ? parseInt(sev, 10) : sev != null ? sev : 0;
  const map = {
    1: { color: "red", text: "SEV1" },
    2: { color: "volcano", text: "SEV2" },
    3: { color: "orange", text: "SEV3" },
    4: { color: "gold", text: "SEV4" },
    5: { color: "green", text: "SEV5" }
  };
  const cfg = map[n] || { color: "default", text: String(sev != null ? sev : "-") };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: cfg.color, children: cfg.text });
};
const statusTag = (status) => {
  const s = String(status || "").toLowerCase();
  const color = s === "open" ? "red" : s === "in_progress" ? "gold" : s === "resolved" ? "green" : s === "closed" ? "default" : "blue";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color, children: status || "-" });
};
const { RangePicker } = DatePicker;
const DEFAULT_PAGE_SIZE = 20;
const IncidentsList = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = reactExports.useState("detected_at");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [metrics, setMetrics] = reactExports.useState({});
  const [metricsLoading, setMetricsLoading] = reactExports.useState(false);
  const fetchMetrics = reactExports.useCallback(async () => {
    try {
      setMetricsLoading(true);
      const resp = await apiRequest("/api/admin/incidents/metrics", "GET");
      setMetrics(resp || {});
    } catch (e) {
      console.warn("Не удалось загрузить метрики инцидентов", (e == null ? void 0 : e.message) || e);
    } finally {
      setMetricsLoading(false);
    }
  }, []);
  const fetchData = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const params = new URLSearchParams();
      if (values.status) params.set("status", values.status);
      if (values.severity) params.set("severity", String(values.severity));
      if (values.source) params.set("source", values.source);
      if (values.severity_lte) params.set("severity_lte", String(values.severity_lte));
      if (values.trace_id) params.set("trace_id", values.trace_id.trim());
      if (Array.isArray(values.date_range) && values.date_range.length === 2) {
        const [from, to] = values.date_range;
        if (from) params.set("date_from", dayjs(from).toISOString());
        if (to) params.set("date_to", dayjs(to).toISOString());
      }
      params.set("page", String(page));
      params.set("page_size", String(pageSize));
      params.set("sort_by", sortBy);
      params.set("sort_dir", sortDir);
      const resp = await apiRequest(`/api/admin/incidents?${params.toString()}`, "GET");
      setData((resp == null ? void 0 : resp.items) || []);
      setTotal((resp == null ? void 0 : resp.total) || 0);
    } catch (e) {
      const msg = (e == null ? void 0 : e.message) || "Ошибка загрузки инцидентов";
      staticMethods.error(msg);
    } finally {
      setLoading(false);
    }
  }, [form, page, pageSize, sortBy, sortDir]);
  reactExports.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);
  reactExports.useEffect(() => {
    fetchData();
  }, [fetchData]);
  const onTableChange = (pagination, _filters, sorter) => {
    setPage(pagination.current || 1);
    setPageSize(pagination.pageSize || DEFAULT_PAGE_SIZE);
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s && s.field) {
      setSortBy(String(s.field));
      setSortDir(s.order === "ascend" ? "asc" : "desc");
    }
  };
  const columns = reactExports.useMemo(() => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 110,
      render: (id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "link", onClick: () => nav(`/incidents/${id}`), children: id })
    },
    {
      title: "Заголовок",
      dataIndex: "title",
      key: "title",
      ellipsis: true
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (v) => statusTag(v),
      sorter: true
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      width: 110,
      render: (v) => severityTag(v),
      sorter: true
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 140,
      sorter: true
    },
    {
      title: "Trace",
      dataIndex: "trace_id",
      key: "trace_id",
      width: 220,
      ellipsis: true
    },
    {
      title: "Detected",
      dataIndex: "detected_at",
      key: "detected_at",
      width: 180,
      sorter: true,
      render: (v) => v ? dayjs(v).format("YYYY-MM-DD HH:mm:ss") : "-"
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 180,
      sorter: true,
      render: (v) => v ? dayjs(v).format("YYYY-MM-DD HH:mm:ss") : "-"
    }
  ], [nav]);
  const onReset = () => {
    form.resetFields();
    setPage(1);
    setSortBy("detected_at");
    setSortDir("desc");
  };
  const statusCounters = (metrics == null ? void 0 : metrics.status_counters) || {};
  const severityCounters = (metrics == null ? void 0 : metrics.severity_counters) || {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 16, style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 3, style: { margin: 0 }, children: "Инциденты" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "inline", onFinish: () => {
      setPage(1);
      fetchData();
    }, style: { rowGap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "status", label: "Статус", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { allowClear: true, style: { width: 160 }, options: [
        { value: "open", label: "open" },
        { value: "in_progress", label: "in_progress" },
        { value: "resolved", label: "resolved" },
        { value: "closed", label: "closed" }
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "severity", label: "Severity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { allowClear: true, style: { width: 140 }, options: [1, 2, 3, 4, 5].map((v) => ({ value: v, label: `SEV${v}` })) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "severity_lte", label: "Severity ≤", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { allowClear: true, style: { width: 140 }, options: [1, 2, 3, 4, 5].map((v) => ({ value: v, label: `SEV${v}` })) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "source", label: "Source", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { allowClear: true, placeholder: "source", style: { width: 160 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "date_range", label: "Дата", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RangePicker, { showTime: true, style: { width: 340 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "trace_id", label: "Trace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { allowClear: true, placeholder: "trace id", style: { width: 220 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", htmlType: "submit", children: "Применить" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onReset, children: "Сброс" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { loading: metricsLoading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 16, children: [
      Object.keys(statusCounters).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 6, lg: 4, xl: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: `Status: ${k}`, value: statusCounters[k] }) }, `status-${k}`)),
      Object.keys(severityCounters).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 12, sm: 8, md: 6, lg: 4, xl: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { title: `SEV${k}`, value: severityCounters[k] }) }, `sev-${k}`))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        rowKey: (r) => String(r.id),
        loading,
        dataSource: data,
        columns,
        pagination: { current: page, pageSize, total, showSizeChanger: true },
        onChange: onTableChange,
        size: "middle"
      }
    ) })
  ] });
};
export {
  IncidentsList as default
};
//# sourceMappingURL=IncidentsList-BsL3gEIZ.js.map
