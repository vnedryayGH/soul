import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { g as getTelegramUser, c as apiRequest } from "./index-B4P9h-k1.js";
const ChatManagement = () => {
  const [messages, setMessages] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [selectedMessages, setSelectedMessages] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showInstructions, setShowInstructions] = reactExports.useState(false);
  const telegramUser = getTelegramUser();
  const requireTgId = () => {
    var _a;
    const id = (_a = telegramUser == null ? void 0 : telegramUser.id) == null ? void 0 : _a.toString();
    if (!id) throw new Error("Не найден Telegram ID");
    return id;
  };
  reactExports.useEffect(() => {
    loadChatStats();
    loadRecentMessages();
  }, []);
  const loadChatStats = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/messages/stats", "GET", null, {
        "X-Telegram-User-ID": requireTgId()
      });
      if (response.status === "success") {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadRecentMessages = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/messages/recent?limit=20", "GET", null, {
        "X-Telegram-User-ID": requireTgId()
      });
      if (response.status === "success") {
        setMessages(response.messages || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    } finally {
      setLoading(false);
    }
  };
  const toggleMessageSelection = (messageId) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };
  const selectAll = () => {
    setSelectedMessages(new Set(messages.map((m) => m.id)));
  };
  const clearSelection = () => {
    setSelectedMessages(/* @__PURE__ */ new Set());
  };
  const deleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;
    const confirmed = window.confirm(
      `Вы действительно хотите удалить ${selectedMessages.size} сообщений? 
      
ЭТО ДЕЙСТВИЕ НЕОБРАТИМО!`
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      const messageIds = Array.from(selectedMessages);
      const queryParams = messageIds.map((id) => `message_ids=${id}`).join("&");
      const response = await apiRequest(`/messages/bulk?${queryParams}`, "DELETE", null, {
        "X-Telegram-User-ID": requireTgId()
      });
      if (response.status === "success") {
        alert(`✅ Успешно удалено ${response.deleted_count} сообщений!`);
        setSelectedMessages(/* @__PURE__ */ new Set());
        loadRecentMessages();
        loadChatStats();
      } else {
        alert(`❌ Ошибка удаления: ${response.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка удаления сообщений:", error);
      alert("❌ Ошибка удаления сообщений");
    } finally {
      setLoading(false);
    }
  };
  const clearAllMessages = async () => {
    const confirmed = window.confirm(
      `⚠️ ВНИМАНИЕ! КРИТИЧЕСКИ ОПАСНАЯ ОПЕРАЦИЯ!
      
Вы хотите удалить ВСЮ историю чата НАВСЕГДА!

• Все сообщения исчезнут навсегда
• Все анализы и метаданные будут уничтожены  
• Восстановление невозможно

Введите "УДАЛИТЬ ВСЁ" для подтверждения:`
    );
    if (!confirmed) return;
    const confirmation = prompt('Введите "УДАЛИТЬ ВСЁ" для подтверждения:');
    if (confirmation !== "УДАЛИТЬ ВСЁ") {
      alert("Операция отменена - неправильное подтверждение");
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest("/messages/clear-all", "DELETE", null, {
        "X-Telegram-User-ID": requireTgId()
      });
      if (response.status === "success") {
        alert(`✅ Успешно удалено ${response.deleted_count} сообщений!`);
        setMessages([]);
        setSelectedMessages(/* @__PURE__ */ new Set());
        loadChatStats();
      } else {
        alert(`❌ Ошибка очистки: ${response.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка очистки чата:", error);
      alert("❌ Ошибка очистки чата");
    } finally {
      setLoading(false);
    }
  };
  const syncWithTelegram = async () => {
    var _a, _b, _c;
    const confirmed = window.confirm(
      `Запустить синхронизацию с Telegram?
      
Это найдет сообщения, удаленные в Telegram UI, и удалит их из базы данных.
Операция может занять некоторое время.`
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      const response = await apiRequest("/messages/sync-telegram", "POST", null, {
        "X-Telegram-User-ID": requireTgId()
      });
      if (response.status === "success") {
        alert(`✅ Синхронизация завершена!
        
📊 Результаты:
• Проверено: ${((_a = response.stats) == null ? void 0 : _a.checked) || 0} сообщений
• Удалено: ${((_b = response.stats) == null ? void 0 : _b.deleted_from_db) || 0} сообщений  
• Ошибок: ${((_c = response.stats) == null ? void 0 : _c.errors) || 0}`);
        loadRecentMessages();
        loadChatStats();
      } else {
        alert(`❌ Ошибка синхронизации: ${response.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка синхронизации:", error);
      alert("❌ Ошибка синхронизации с Telegram");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "🗂️ Управление чатом" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Управление сообщениями, очистка базы данных и синхронизация с Telegram" })
    ] }),
    stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: "📊 Статистика чата" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.total_messages }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Всего сообщений" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.user_messages }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Ваши сообщения" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-600", children: stats.assistant_messages }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Ответы бота" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-orange-600", children: stats.threads_count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Диалогов" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-pink-600", children: stats.keywords_count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Ключевых слов" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "📖 Инструкции по удалению" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowInstructions(!showInstructions),
            className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
            children: showInstructions ? "Скрыть" : "Показать"
          }
        )
      ] }),
      showInstructions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-4 border-green-500 pl-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-green-700", children: "✅ Рекомендуемые способы удаления:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside text-sm text-gray-700 mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/select_delete" }),
              " - выбор из списка последних сообщений"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/delete_last 5" }),
              " - удаление последних N сообщений"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Этот интерфейс - для массового управления" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-4 border-red-500 pl-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-red-700", children: "❌ НЕ рекомендуется:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside text-sm text-gray-700 mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Удаление через интерфейс Telegram (долгий тап → Delete)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Telegram не уведомляет бота об удалении" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Сообщения остаются в базе данных!" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-4 border-yellow-500 pl-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-yellow-700", children: "⚠️ Если удалили через Telegram UI:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 mt-2", children: 'Используйте кнопку "Синхронизация с Telegram" ниже для очистки БД' })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: "⚡ Быстрые действия" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: syncWithTelegram, disabled: loading, className: "w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50", children: "🔄 Синхронизация с Telegram" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => loadRecentMessages(), disabled: loading, className: "w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50", children: "🔄 Обновить список" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearAllMessages, disabled: loading, className: "w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50", children: "🗑️ ОЧИСТИТЬ ВСЁ" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "📝 Последние сообщения" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: selectAll, className: "px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors", children: "Выбрать все" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearSelection, className: "px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors", children: "Снять выбор" }),
          selectedMessages.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: deleteSelectedMessages, disabled: loading, className: "px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50", children: [
            "Удалить выбранные (",
            selectedMessages.size,
            ")"
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-gray-600", children: "Загрузка..." })
      ] }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500", children: "📭 Нет сообщений для отображения" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `border rounded-lg p-4 cursor-pointer transition-colors ${selectedMessages.has(message.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`, onClick: () => toggleMessageSelection(message.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: message.sender_type === "user" ? "👤" : "🤖" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: new Date(message.created_at).toLocaleString("ru-RU") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
              "ID: ",
              message.id.slice(0, 8),
              "..."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800", children: message.text_preview || message.text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedMessages.has(message.id), onChange: () => toggleMessageSelection(message.id), className: "w-5 h-5 text-blue-600" }) })
      ] }) }, message.id)) })
    ] })
  ] }) });
};
export {
  ChatManagement as default
};
//# sourceMappingURL=ChatManagement-DivnbX5N.js.map
