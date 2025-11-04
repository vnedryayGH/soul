import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { b as usePermissions, T as Typography, l as Space, aB as Tooltip, I as Input, B as Button, n as Select, F as ForwardTable, p as Tag, c as apiRequest, s as staticMethods } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { D as DatePicker } from "./index-I1l_E206.js";
import { B as Badge } from "./index-DDcrJiGl.js";
import "./Skeleton-D3e3aC7P.js";
import "./CalendarOutlined-B_ajlQ0Y.js";
import "./ClockCircleOutlined-B2hpDlMl.js";
const { Title, Text } = Typography;
const RemindersHistory = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const [items, setItems] = reactExports.useState([]);
  const [incidents, setIncidents] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [sentFilter, setSentFilter] = reactExports.useState("all");
  const [ackFilter, setAckFilter] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState(null);
  const [dateTo, setDateTo] = reactExports.useState(null);
  const { state: permState } = usePermissions();
  const isArchitect = (permState.roles || []).some((r) => r.name === "architect");
  const [overrideTgId, setOverrideTgId] = reactExports.useState("");
  const hdrs = reactExports.useMemo(() => overrideTgId && isArchitect ? { "X-Telegram-User-ID": overrideTgId } : {}, [overrideTgId, isArchitect]);
  const loadData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("include_sent", "true");
      if (dateFrom) params.set("date_from", dateFrom.format("YYYY-MM-DD"));
      if (dateTo) params.set("date_to", dateTo.format("YYYY-MM-DD"));
      if (query && query.trim()) params.set("q", query.trim());
      const rems = await apiRequest(`/miniapp/reminders?${params.toString()}`, "GET", null, hdrs);
      const inc = await apiRequest("/admin/soul/processor/incidents?limit=500", "GET", null, hdrs);
      setItems(Array.isArray(rems) ? rems : []);
      setIncidents(Array.isArray(inc == null ? void 0 : inc.items) ? inc.items : []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadData();
  }, []);
  const ackMap = reactExports.useMemo(() => {
    const map = {};
    for (const it of incidents) {
      if ((it == null ? void 0 : it.type) === "reminder_ack") {
        const m = /id=(\d+)/.exec(String(it.detail || ""));
        if (m) map[Number(m[1])] = true;
      }
    }
    return map;
  }, [incidents]);
  const filtered = reactExports.useMemo(() => {
    return (items || []).filter((r) => {
      if (sentFilter === "sent" && !r.is_sent) return false;
      if (sentFilter === "pending" && r.is_sent) return false;
      if (ackFilter === "ack" && !ackMap[r.id]) return false;
      if (ackFilter === "noack" && ackMap[r.id]) return false;
      if (dateFrom && dayjs(r.reminder_date).isBefore(dateFrom, "day")) return false;
      if (dateTo && dayjs(r.reminder_date).isAfter(dateTo, "day")) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${r.title || ""} ${r.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, sentFilter, ackFilter, dateFrom, dateTo, query, ackMap]);
  const actionResend = async (id) => {
    try {
      const body = { kind: "reminder", payload: { reminder_id: id } };
      await apiRequest("/admin/soul/processor/event", "POST", body, hdrs);
      staticMethods.success(`Повторная отправка поставлена в очередь (#${id})`);
    } catch (e) {
      staticMethods.error("Не удалось поставить повторную отправку");
    }
  };
  const actionSnooze = async (id, minutes) => {
    try {
      const now = dayjs.utc();
      const due = now.add(minutes, "minute").toISOString();
      await apiRequest(`/miniapp/reminders/${id}`, "PUT", { reminder_date: due }, hdrs);
      await apiRequest("/admin/soul/processor/event", "POST", { kind: "reminder", payload: { reminder_id: id } }, hdrs);
      staticMethods.success(`Отложено на ${minutes} мин`);
      void loadData();
    } catch (e) {
      staticMethods.error("Не удалось отложить");
    }
  };
  const actionCancel = async (id) => {
    try {
      await apiRequest(`/miniapp/reminders/${id}`, "PUT", {
        /* не меняем дату */
      }, hdrs);
      staticMethods.success("Отменено (логика отмены применяется в бэкенде через ack/cancel)");
      void loadData();
    } catch (e) {
      staticMethods.error("Не удалось отменить");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Напоминания — история и действия" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      isArchitect && /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Просмотр от лица пользователя (только архитектор)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "TG ID пользователя",
            value: overrideTgId,
            onChange: (e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              setOverrideTgId(v);
            },
            style: { width: 220 },
            maxLength: 12
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => void loadData(), children: "Применить" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Поиск (заголовок/описание)", value: query, onChange: (e) => setQuery(e.target.value), style: { width: 260 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: sentFilter,
            onChange: setSentFilter,
            style: { width: 160 },
            options: [{ value: "all", label: "Все" }, { value: "sent", label: "Только sent" }, { value: "pending", label: "Только pending" }]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: ackFilter,
            onChange: setAckFilter,
            style: { width: 160 },
            options: [{ value: "all", label: "ACK: все" }, { value: "ack", label: "Только ACK" }, { value: "noack", label: "Без ACK" }]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DatePicker, { placeholder: "С даты", value: dateFrom, onChange: setDateFrom }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DatePicker, { placeholder: "По дату", value: dateTo, onChange: setDateTo }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          setQuery("");
          setSentFilter("all");
          setAckFilter("all");
          setDateFrom(null);
          setDateTo(null);
        }, children: "Сбросить" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => void loadData(), loading, children: "Обновить" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { marginTop: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        rowKey: (r) => r.id,
        dataSource: filtered,
        loading,
        pagination: { pageSize: 10 },
        columns: [
          { title: "ID", dataIndex: "id", width: 80 },
          { title: "Заголовок", dataIndex: "title" },
          { title: "Когда", dataIndex: "reminder_date", width: 200 },
          { title: "Sent", dataIndex: "is_sent", width: 100, render: (v) => v ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "sent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "volcano", children: "pending" }) },
          { title: "ACK", key: "ack", width: 100, render: (_, r) => ackMap[r.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: "success", text: "ack" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: "default", text: "no" }) },
          { title: "Действия", key: "actions", width: 360, render: (_, r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => void actionResend(r.id), children: "Повторно" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => void actionSnooze(r.id, 5), children: "+5 мин" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => void actionSnooze(r.id, 30), children: "+30 мин" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", danger: true, onClick: () => void actionCancel(r.id), children: "Отменить" })
          ] }) }
        ]
      }
    ) })
  ] });
};
export {
  RemindersHistory as default
};
//# sourceMappingURL=RemindersHistory-DDBXjbXW.js.map
