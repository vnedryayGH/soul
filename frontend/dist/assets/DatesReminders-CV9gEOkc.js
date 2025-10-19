import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { g as getTelegramUser, aF as api } from "./index-B4P9h-k1.js";
const DatesReminders = () => {
  const [events, setEvents] = reactExports.useState([]);
  const [reminders, setReminders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newDate, setNewDate] = reactExports.useState("");
  const [newTime, setNewTime] = reactExports.useState("");
  const [repeat, setRepeat] = reactExports.useState("none");
  const [editing, setEditing] = reactExports.useState(null);
  const telegramUser = getTelegramUser();
  const requireTgId = () => {
    var _a;
    const id = (_a = telegramUser == null ? void 0 : telegramUser.id) == null ? void 0 : _a.toString();
    if (!id) throw new Error("Не найден Telegram ID");
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
      if (resp.status === "success") setEvents(resp.events || []);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка загрузки дат");
    } finally {
      setLoading(false);
    }
  };
  const loadReminders = async () => {
    try {
      const resp = await api("/miniapp/reminders", { method: "GET" });
      setReminders(resp || []);
    } catch (e) {
      console.error(e);
    }
  };
  const createReminder = async () => {
    if (!newTitle.trim() || !newDate) return;
    setLoading(true);
    try {
      const reminderDate = /* @__PURE__ */ new Date(`${newDate}T${newTime || "09:00"}`);
      const payload = {
        title: newTitle.trim(),
        description: newTitle.trim(),
        reminder_date: reminderDate.toISOString(),
        reminder_type: "custom",
        priority: "medium",
        is_recurring: repeat !== "none",
        recurrence_pattern: repeat !== "none" ? repeat : null,
        ai_prompt: `Напоминание: ${newTitle.trim()}`
      };
      const created = await api("/miniapp/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Telegram-User-ID": requireTgId() },
        body: JSON.stringify(payload)
      });
      if (created && created.id) {
        setNewTitle("");
        setNewDate("");
        setNewTime("");
        setRepeat("none");
        loadReminders();
        alert("✅ Напоминание создано");
      }
    } catch (e) {
      alert("❌ Ошибка создания напоминания");
    } finally {
      setLoading(false);
    }
  };
  const deleteReminder = async (id) => {
    if (!confirm("Удалить напоминание?")) return;
    try {
      await api(`/miniapp/reminders/${id}`, { method: "DELETE", headers: { "X-Telegram-User-ID": requireTgId() } });
      setReminders(reminders.filter((r) => r.id !== id));
    } catch (e) {
      alert("❌ Ошибка удаления");
    }
  };
  const startEdit = (r) => {
    setEditing(r);
    setNewTitle(r.title);
    const d = new Date(r.reminder_date);
    setNewDate(d.toISOString().slice(0, 10));
    setNewTime(d.toISOString().slice(11, 16));
    setRepeat(r.is_recurring ? r.recurrence_pattern || "daily" : "none");
  };
  const saveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const payload = {
        title: newTitle.trim(),
        reminder_date: (/* @__PURE__ */ new Date(`${newDate}T${newTime || "09:00"}`)).toISOString(),
        is_recurring: repeat !== "none",
        recurrence_pattern: repeat !== "none" ? repeat : null
      };
      const updated = await api(`/miniapp/reminders/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Telegram-User-ID": requireTgId() },
        body: JSON.stringify(payload)
      });
      setReminders(reminders.map((r) => r.id === editing.id ? updated : r));
      setEditing(null);
      setNewTitle("");
      setNewDate("");
      setNewTime("");
      setRepeat("none");
    } catch (e) {
      alert("❌ Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadEvents();
    loadReminders();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "📅 Даты и напоминания" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-1", children: "Нормализованные даты из сообщений и управление напоминаниями." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold text-gray-800 mb-3", children: [
        "⏰ ",
        editing ? "Редактирование" : "Создание",
        " напоминания"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "border rounded px-3 py-2 md:col-span-2", placeholder: "Заголовок", value: newTitle, onChange: (e) => setNewTitle(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "border rounded px-3 py-2", type: "date", value: newDate, onChange: (e) => setNewDate(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "border rounded px-3 py-2", type: "time", value: newTime, onChange: (e) => setNewTime(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "border rounded px-3 py-2", value: repeat, onChange: (e) => setRepeat(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", children: "Без повтора" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "daily", children: "Ежедневно" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "weekly", children: "Еженедельно" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "monthly", children: "Ежемесячно" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yearly", children: "Ежегодно" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: saveEdit, disabled: loading || !newTitle.trim() || !newDate, className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50", children: "Сохранить" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setEditing(null);
          setNewTitle("");
          setNewDate("");
          setNewTime("");
          setRepeat("none");
        }, className: "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300", children: "Отмена" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: createReminder, disabled: loading || !newTitle.trim() || !newDate, className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50", children: "Создать" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-3", children: "📋 Напоминания" }),
      reminders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Нет напоминаний" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: reminders.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-800 font-medium", children: r.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500", children: [
            new Date(r.reminder_date).toLocaleString("ru-RU"),
            " • ",
            r.reminder_type,
            " • ",
            r.priority
          ] }),
          r.is_recurring && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-indigo-600", children: [
            "Повтор: ",
            r.recurrence_pattern
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEdit(r), className: "px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600", children: "Редактировать" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteReminder(r.id), className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600", children: "Удалить" })
        ] })
      ] }) }, r.id)) })
    ] })
  ] }) });
};
export {
  DatesReminders as default
};
//# sourceMappingURL=DatesReminders-CV9gEOkc.js.map
