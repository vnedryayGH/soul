import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { n as Select, I as Input, l as Space, B as Button, c as apiRequest, s as staticMethods, q as useParams, u as useNavigate, T as Typography, p as Tag, A as API_BASE } from "./index-B4P9h-k1.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import { T as Timeline } from "./Timeline-Chs6_Ld2.js";
import "./row-BcQp44VL.js";
import "./index-BlJydARW.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
const TwoKeysModal = ({ open, onClose, onApproved }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = reactExports.useState(false);
  const [requestId, setRequestId] = reactExports.useState("");
  const createRequest = async () => {
    try {
      const v = await form.validateFields();
      setLoading(true);
      const resp = await apiRequest("/api/admin/two-keys/requests", "POST", v);
      const rid = String((resp == null ? void 0 : resp.id) || (resp == null ? void 0 : resp.request_id) || "");
      setRequestId(rid);
      staticMethods.success(rid ? `Создана заявка: ${rid}` : "Заявка создана");
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("403: нет прав");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка создания заявки");
    } finally {
      setLoading(false);
    }
  };
  const approve = async () => {
    try {
      const rid = requestId.trim();
      if (!rid) {
        staticMethods.warning("Нет request_id");
        return;
      }
      setLoading(true);
      await apiRequest("/api/admin/two-keys/approve", "POST", { request_id: rid });
      staticMethods.success("Подтверждено");
      onApproved == null ? void 0 : onApproved(rid);
      onClose();
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("403: нет прав/аппрува");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка подтверждения");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open, onCancel: onClose, title: "Two-Keys", footer: null, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form, layout: "vertical", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "operation", label: "Операция", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { options: [
      { value: "incident.close", label: "incident.close" },
      { value: "incident.rca_edit", label: "incident.rca_edit" }
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "scope", label: "Скоуп", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "incident:{id}" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "reason", label: "Причина", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 3 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { display: "flex", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: createRequest, loading, type: "primary", children: "Создать заявку" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "request_id", value: requestId, onChange: (e) => setRequestId(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: approve, loading, type: "primary", children: "Подтвердить" })
      ] })
    ] })
  ] }) });
};
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
const IncidentDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  const [item, setItem] = reactExports.useState(null);
  const [events, setEvents] = reactExports.useState([]);
  const [links, setLinks] = reactExports.useState([]);
  const [assignOpen, setAssignOpen] = reactExports.useState(false);
  const [assignForm] = Form.useForm();
  const [eventOpen, setEventOpen] = reactExports.useState(false);
  const [eventForm] = Form.useForm();
  const [linkOpen, setLinkOpen] = reactExports.useState(false);
  const [linkForm] = Form.useForm();
  const [tkOpen, setTkOpen] = reactExports.useState(false);
  const [tkAction, setTkAction] = reactExports.useState("close");
  const [pendingEvent, setPendingEvent] = reactExports.useState(null);
  const [pmStatus, setPmStatus] = reactExports.useState(null);
  const [pmCompareOpen, setPmCompareOpen] = reactExports.useState(false);
  const [pmDraftMD, setPmDraftMD] = reactExports.useState("");
  const [pmFinalMD, setPmFinalMD] = reactExports.useState("");
  const load = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      const resp = await apiRequest(`/api/admin/incidents/${id}`, "GET");
      setItem((resp == null ? void 0 : resp.incident) || resp || null);
      setEvents((resp == null ? void 0 : resp.incident_events) || (resp == null ? void 0 : resp.events) || []);
      setLinks((resp == null ? void 0 : resp.incident_links) || (resp == null ? void 0 : resp.links) || []);
    } catch (e) {
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка загрузки инцидента");
    } finally {
      setLoading(false);
    }
  }, [id]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const s = await apiRequest(`/api/admin/incidents/${id}/postmortem/status`, "GET");
        setPmStatus(s || null);
      } catch (e) {
      }
    })();
  }, [id]);
  const addEvent = async () => {
    try {
      const v = await eventForm.validateFields();
      const sev = typeof (item == null ? void 0 : item.severity) === "string" ? parseInt(item == null ? void 0 : item.severity, 10) : item == null ? void 0 : item.severity;
      if (String(v == null ? void 0 : v.type) === "rca_edit" && (sev === 1 || sev === 2)) {
        setPendingEvent(v);
        setTkAction("rca_edit_event");
        setTkOpen(true);
        return;
      }
      await apiRequest(`/api/admin/incidents/${id}/events`, "POST", v);
      setEventOpen(false);
      eventForm.resetFields();
      await load();
      staticMethods.success("Событие добавлено");
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("Недостаточно прав (403)");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка добавления события");
    }
  };
  const addLink = async () => {
    try {
      const v = await linkForm.validateFields();
      await apiRequest(`/api/admin/incidents/${id}/links`, "POST", v);
      setLinkOpen(false);
      linkForm.resetFields();
      await load();
      staticMethods.success("Связь добавлена");
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("Недостаточно прав (403)");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка добавления связи");
    }
  };
  const routeArchitect = async () => {
    try {
      await apiRequest(`/api/admin/incidents/${id}/route/architect`, "POST", {});
      staticMethods.success("Эскалация отправлена архитектору");
      await load();
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("Недостаточно прав (403)");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка эскалации");
    }
  };
  const closeIncident = async () => {
    try {
      await apiRequest(`/api/admin/incidents/${id}/close`, "POST", {});
      staticMethods.success("Инцидент закрыт");
      await load();
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("Недостаточно прав (403)");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка закрытия");
    }
  };
  const closeWithPostmortem = async () => {
    try {
      await apiRequest(`/api/admin/incidents/${id}/close_with_postmortem`, "POST", {});
      staticMethods.success("Инцидент закрыт с Postmortem");
      await load();
    } catch (e) {
      if ((e == null ? void 0 : e.status) === 403) {
        staticMethods.error("Недостаточно прав (403)");
        return;
      }
      staticMethods.error((e == null ? void 0 : e.message) || "Ошибка закрытия с Postmortem");
    }
  };
  const header = reactExports.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography.Title, { level: 4, style: { margin: 0 }, children: [
      "Инцидент #",
      item == null ? void 0 : item.id
    ] }),
    statusTag(item == null ? void 0 : item.status),
    severityTag(item == null ? void 0 : item.severity),
    (item == null ? void 0 : item.trace_id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "cyan", children: item == null ? void 0 : item.trace_id }) : null
  ] }), [item]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 16, style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", style: { display: "flex", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: header }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => nav("/incidents"), children: "К списку" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: routeArchitect, children: "Escalate to Architect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: async () => {
              const sev = typeof (item == null ? void 0 : item.severity) === "string" ? parseInt(item == null ? void 0 : item.severity, 10) : item == null ? void 0 : item.severity;
              if (sev === 1 || sev === 2) {
                setTkAction("postmortem_finalize");
                setTkOpen(true);
                return;
              }
              try {
                await apiRequest(`/api/admin/incidents/${id}/postmortem/finalize`, "POST", {});
                staticMethods.success("Postmortem финализирован");
                const s = await apiRequest(`/api/admin/incidents/${id}/postmortem/status`, "GET");
                setPmStatus(s || null);
              } catch (e) {
                staticMethods.error((e == null ? void 0 : e.message) || "Ошибка финализации");
              }
            },
            children: "Finalize Postmortem"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "primary",
            danger: true,
            onClick: async () => {
              const sev = typeof (item == null ? void 0 : item.severity) === "string" ? parseInt(item == null ? void 0 : item.severity, 10) : item == null ? void 0 : item.severity;
              if (sev === 1 || sev === 2) {
                setTkAction("close");
                setTkOpen(true);
                return;
              }
              await closeIncident();
            },
            children: "Close"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "primary",
            onClick: async () => {
              const sev = typeof (item == null ? void 0 : item.severity) === "string" ? parseInt(item == null ? void 0 : item.severity, 10) : item == null ? void 0 : item.severity;
              if (sev === 1 || sev === 2) {
                setTkAction("close_with_postmortem");
                setTkOpen(true);
                return;
              }
              await closeWithPostmortem();
            },
            children: "Close with Postmortem"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { loading, title: "Карточка", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: 1, size: "small", bordered: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Title", children: (item == null ? void 0 : item.title) || "-" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Status", children: statusTag(item == null ? void 0 : item.status) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Severity", children: severityTag(item == null ? void 0 : item.severity) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Source", children: (item == null ? void 0 : item.source) || "-" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Trace", children: (item == null ? void 0 : item.trace_id) || "-" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Detected", children: (item == null ? void 0 : item.detected_at) ? dayjs(item.detected_at).format("YYYY-MM-DD HH:mm:ss") : "-" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Resolved", children: (item == null ? void 0 : item.resolved_at) ? dayjs(item.resolved_at).format("YYYY-MM-DD HH:mm:ss") : "-" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Closed", children: (item == null ? void 0 : item.closed_at) ? dayjs(item.closed_at).format("YYYY-MM-DD HH:mm:ss") : "-" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "SLA", children: (item == null ? void 0 : item.sla) ? JSON.stringify(item.sla) : "-" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Действия", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setAssignOpen(true), children: "Assign" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setEventOpen(true), children: "Add Event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setLinkOpen(true), children: "Add Link" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Таймлайн", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timeline, { children: events.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Timeline.Item, { color: "blue", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600 }, children: ev.type || "event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, opacity: 0.8 }, children: [
        ev.created_at ? dayjs(ev.created_at).format("YYYY-MM-DD HH:mm:ss") : "",
        " • ",
        ev.actor || ""
      ] }),
      ev.message ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4 }, children: ev.message }) : null,
      ev.payload ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap" }, children: JSON.stringify(ev.payload, null, 2) }) : null
    ] }, String(ev.id))) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Связи", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      links.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "Нет связей" }) : null,
      links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: l.to_kind }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: String(l.to_id) }),
        " ",
        l.relation ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: l.relation }) : null
      ] }, String(l.id)))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Postmortem", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          window.open(`${API_BASE}/api/admin/incidents/${id}/postmortem/export?format=md&_cache_bust=${Date.now()}`, "_blank");
        }, children: "Export MD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          window.open(`${API_BASE}/api/admin/incidents/${id}/postmortem/export?format=pdf&_cache_bust=${Date.now()}`, "_blank");
        }, children: "Export PDF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            disabled: !(pmStatus == null ? void 0 : pmStatus.has_draft) && !(pmStatus == null ? void 0 : pmStatus.has_final),
            onClick: async () => {
              try {
                if (pmStatus == null ? void 0 : pmStatus.has_draft) {
                  const resp = await fetch(`${API_BASE}/api/admin/incidents/${id}/postmortem/export?format=md&status=draft&_cb=${Date.now()}`);
                  setPmDraftMD(await resp.text());
                } else {
                  setPmDraftMD("");
                }
                if (pmStatus == null ? void 0 : pmStatus.has_final) {
                  const resp2 = await fetch(`${API_BASE}/api/admin/incidents/${id}/postmortem/export?format=md&status=final&_cb=${Date.now()}`);
                  setPmFinalMD(await resp2.text());
                } else {
                  setPmFinalMD("");
                }
                setPmCompareOpen(true);
              } catch (e) {
                staticMethods.error((e == null ? void 0 : e.message) || "Ошибка загрузки версий");
              }
            },
            children: "Compare draft vs final"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { size: "small", column: 1, bordered: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Final", children: (pmStatus == null ? void 0 : pmStatus.has_final) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "final" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: "none" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Draft", children: (pmStatus == null ? void 0 : pmStatus.has_draft) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: "draft" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: "none" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: assignOpen, onCancel: () => setAssignOpen(false), onOk: () => {
      assignForm.submit();
    }, title: "Назначить исполнителя", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form: assignForm, layout: "vertical", onFinish: async (v) => {
      try {
        await apiRequest(`/api/admin/incidents/${id}/events`, "POST", { type: "assign", ...v });
        setAssignOpen(false);
        assignForm.resetFields();
        await load();
        staticMethods.success("Назначено");
      } catch (e) {
        if ((e == null ? void 0 : e.status) === 403) {
          staticMethods.error("Недостаточно прав (403)");
          return;
        }
        staticMethods.error((e == null ? void 0 : e.message) || "Ошибка назначения");
      }
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "assignee_tg_id", label: "Telegram ID", rules: [{ required: true, message: "Укажите tg_id" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "468326902" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "comment", label: "Комментарий", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 3 }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: eventOpen, onCancel: () => setEventOpen(false), onOk: addEvent, title: "Добавить событие", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form: eventForm, layout: "vertical", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "type", label: "Тип", rules: [{ required: true, message: "Укажите тип" }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { options: [
        { value: "comment", label: "comment" },
        { value: "update", label: "update" },
        { value: "rca_edit", label: "rca_edit" }
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "message", label: "Сообщение", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 4 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "payload", label: "Payload (JSON)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 4, placeholder: '{"key":"value"}' }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: linkOpen, onCancel: () => setLinkOpen(false), onOk: addLink, title: "Добавить связь", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form: linkForm, layout: "vertical", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "to_kind", label: "К чему", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { options: [
        { value: "incident", label: "incident" },
        { value: "runbook", label: "runbook" },
        { value: "kb", label: "kb" },
        { value: "trace", label: "trace" }
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "to_id", label: "ID", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "relation", label: "Связь", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "relates_to | caused_by | fixes" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TwoKeysModal,
      {
        open: tkOpen,
        onClose: () => setTkOpen(false),
        onApproved: async (rid) => {
          try {
            if (tkAction === "postmortem_finalize") {
              await apiRequest(`/api/admin/incidents/${id}/postmortem/finalize`, "POST", { two_keys_request_id: rid });
              staticMethods.success("Postmortem финализирован");
              const s = await apiRequest(`/api/admin/incidents/${id}/postmortem/status`, "GET");
              setPmStatus(s || null);
            } else if (tkAction === "close_with_postmortem") {
              await closeWithPostmortem();
            } else if (tkAction === "rca_edit_event" && pendingEvent) {
              await apiRequest(`/api/admin/incidents/${id}/events`, "POST", pendingEvent);
              setPendingEvent(null);
              setEventOpen(false);
              eventForm.resetFields();
              await load();
              staticMethods.success("RCA обновлена");
            } else {
              await closeIncident();
            }
          } catch (e) {
          }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: pmCompareOpen,
        onCancel: () => setPmCompareOpen(false),
        title: "Postmortem: Draft vs Final",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setPmCompareOpen(false), children: "Close" }),
        width: 1e3,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, children: "Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap", padding: 8, background: "#fafafa", border: "1px solid #eee", borderRadius: 4, maxHeight: 480, overflow: "auto" }, children: pmDraftMD || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, children: "Final" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap", padding: 8, background: "#fafafa", border: "1px solid #eee", borderRadius: 4, maxHeight: 480, overflow: "auto" }, children: pmFinalMD || "—" })
          ] })
        ] })
      }
    )
  ] });
};
export {
  IncidentDetails as default
};
//# sourceMappingURL=IncidentDetails-B5xKmxJb.js.map
