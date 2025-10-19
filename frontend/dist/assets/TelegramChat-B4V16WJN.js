import { a as reactExports, j as jsxRuntimeExports, R as React } from "./react-DAIzMmXQ.js";
import { g as getTelegramUser, c as apiRequest } from "./index-B4P9h-k1.js";
const TelegramChat = () => {
  const [messages, setMessages] = reactExports.useState([]);
  const [newMessage, setNewMessage] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [sending, setSending] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (sending) {
      console.log("[SEND] 🔒 Поле заблокировано, запускаем таймер разблокировки...");
      const timeout = setTimeout(() => {
        console.log("[SEND] ⏰ Автоматическая разблокировка через 10 секунд");
        setSending(false);
      }, 1e4);
      return () => clearTimeout(timeout);
    }
  }, [sending]);
  const telegramUser = getTelegramUser();
  const telegramUserId = telegramUser == null ? void 0 : telegramUser.id;
  reactExports.useEffect(() => {
    console.log("[AUTO_UPDATE] 🚀 Запускаем автоматическое обновление сообщений");
    const interval = setInterval(async () => {
      if (!telegramUserId || sending) return;
      try {
        const recentResp = await apiRequest(`/messages/recent?limit=50&offset=0&_t=${Date.now()}`, "GET", null, {
          "X-Telegram-User-ID": String(telegramUserId)
        });
        if (recentResp.status === "success") {
          const newMessages = recentResp.messages || [];
          if (newMessages.length > messages.length) {
            console.log("[AUTO_UPDATE] 📥 Найдены новые сообщения:", newMessages.length - messages.length);
            const sorted = newMessages.reverse();
            setMessages(sorted);
            setOffset(50);
            setHasMoreMessages(newMessages.length === 50);
            const messagesContainer = messagesContainerRef.current;
            if (messagesContainer) {
              const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 100;
              if (isAtBottom) {
                setTimeout(() => scrollToBottom(), 100);
              }
            }
          }
        }
      } catch (error) {
        console.warn("[AUTO_UPDATE] Ошибка автоматического обновления:", error);
      }
    }, 5e3);
    return () => {
      console.log("[AUTO_UPDATE] 🛑 Останавливаем автоматическое обновление");
      clearInterval(interval);
    };
  }, [telegramUserId, messages.length, sending]);
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const [hasMoreMessages, setHasMoreMessages] = reactExports.useState(true);
  const [offset, setOffset] = reactExports.useState(0);
  const messagesEndRef = reactExports.useRef(null);
  const messagesContainerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    console.log("[INIT] 🚀 Инициализация TelegramChat");
    console.log("[INIT] 📊 Начальные состояния:", { sending, loading, loadingMore });
    loadInitialMessages().then(() => {
      console.log("[INIT] 📜 Скроллим к последнему сообщению при входе...");
      setTimeout(() => scrollToBottom(), 500);
    });
  }, []);
  reactExports.useEffect(() => {
    console.log("[STATE] 🔄 sending изменился на:", sending);
  }, [sending]);
  const scrollToBottom = () => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  const loadInitialMessages = reactExports.useCallback(async () => {
    var _a, _b, _c;
    if (!telegramUserId) {
      console.warn("[INIT] Нет Telegram ID — прекращаем загрузку");
      return;
    }
    setLoading(true);
    try {
      console.log("[LOAD] 📥 Загружаем последние сообщения...");
      console.log("[LOAD] 👤 Пользователь для загрузки:", telegramUser);
      console.log("[LOAD] 🆔 User ID для загрузки:", (_b = (_a = telegramUser == null ? void 0 : telegramUser.id) == null ? void 0 : _a.toString()) != null ? _b : "undefined");
      console.log("[LOAD] 💾 localStorage сообщения:", localStorage.getItem("messages"));
      console.log("[LOAD] 💾 sessionStorage сообщения:", sessionStorage.getItem("messages"));
      localStorage.removeItem("messages");
      sessionStorage.removeItem("messages");
      const timestamp = Date.now();
      const url = `/messages/recent?limit=50&offset=0&_t=${timestamp}`;
      console.log("[LOAD] 🌐 Запрос URL (последние 50):", url);
      const loadHeaders = {
        "X-Telegram-User-ID": String(telegramUserId)
      };
      console.log("[LOAD] 📋 Заголовки запроса:", loadHeaders);
      const response = await apiRequest(url, "GET", null, loadHeaders);
      console.log("[LOAD] ПОЛНЫЙ ответ сервера:", JSON.stringify(response, null, 2));
      console.log("[LOAD] 🔍 ДЕТАЛЬНЫЙ АНАЛИЗ:");
      console.log("[LOAD] 📊 Количество сообщений в ответе:", ((_c = response.messages) == null ? void 0 : _c.length) || 0);
      if (response.messages && response.messages.length > 0) {
        console.log("[LOAD] 📅 Первое сообщение (самое новое):", response.messages[0]);
        console.log("[LOAD] 📅 Последнее сообщение (самое старое):", response.messages[response.messages.length - 1]);
        console.log("[LOAD] 🔤 Тексты сообщений:");
        response.messages.forEach((msg, idx) => {
          console.log(`[LOAD]    ${idx + 1}. [${msg.sender_type}] ${msg.text.substring(0, 50)}... (${msg.created_at})`);
        });
      }
      if (response.status === "success") {
        const sortedMessages = (response.messages || []).reverse();
        console.log("[LOAD] ✅ Загружено сообщений:", sortedMessages.length);
        setMessages(sortedMessages);
        setOffset(50);
        setHasMoreMessages(response.messages.length === 50);
      } else {
        console.error("[LOAD] Ошибка в ответе:", response);
        setMessages([]);
      }
    } catch (error) {
      console.error("[LOAD] Ошибка загрузки сообщений:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [telegramUser]);
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMoreMessages || !telegramUserId) return;
    setLoadingMore(true);
    try {
      console.log("[LOAD MORE] Загружаем сообщения с offset:", offset);
      const response = await apiRequest(`/messages/recent?limit=30&offset=${offset}`, "GET", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        const newMessages = (response.messages || []).reverse();
        console.log("[LOAD MORE] Получено сообщений:", newMessages.length);
        if (newMessages.length > 0) {
          setMessages((prev) => [...newMessages, ...prev]);
          setOffset((prev) => prev + newMessages.length);
          setHasMoreMessages(response.messages.length === 30);
        } else {
          setHasMoreMessages(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки дополнительных сообщений:", error);
    } finally {
      setLoadingMore(false);
    }
  };
  const sendMessage = async () => {
    if (!telegramUserId) {
      alert("Не удаётся определить Telegram ID. Откройте мини‑приложение из Telegram.");
      return;
    }
    if (!newMessage.trim() || sending) {
      console.log("[SEND] Отменено: пустое сообщение или уже отправляется", { newMessage: newMessage.trim(), sending });
      return;
    }
    console.log("[SEND] Начинаем отправку...");
    setSending(true);
    const userMessage = newMessage;
    setNewMessage("");
    const tempUserMessage = {
      id: "temp-" + Date.now(),
      text: userMessage,
      sender_type: "user",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      thread_id: "main-chat"
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    try {
      console.log("[SEND] 📤 Отправляем сообщение:", userMessage);
      console.log("[SEND] 👤 Пользователь для отправки:", telegramUser == null ? void 0 : telegramUser.id);
      const response = await apiRequest("/chat/send", "POST", {
        message: userMessage,
        thread_id: null
        // Пусть создается автоматически
      }, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      console.log("[SEND] 📨 Полный ответ отправки:", JSON.stringify(response, null, 2));
      console.log("[SEND] Ответ сервера:", response);
      if (response.status === "success") {
        console.log("[SEND] ✅ Успешно отправлено! Обновляем тред...");
        try {
          console.log("[SEND] 🔄 Обновляем сообщения после отправки...");
          const recentResp = await apiRequest(`/messages/recent?limit=50&offset=0&_t=${Date.now()}`, "GET", null, {
            "X-Telegram-User-ID": String(telegramUserId)
          });
          if (recentResp.status === "success") {
            const newMessages = recentResp.messages || [];
            console.log("[SEND] 📥 Получено сообщений после отправки:", newMessages.length);
            if (newMessages.length > 0) {
              const sorted = newMessages.reverse();
              setMessages(sorted);
              setOffset(50);
              setHasMoreMessages(newMessages.length === 50);
              setTimeout(() => scrollToBottom(), 100);
              console.log("[SEND] ✅ Сообщения обновлены успешно");
            } else {
              console.warn("[SEND] ⚠️ Получен пустой список сообщений");
            }
          } else {
            console.error("[SEND] ❌ Ошибка при получении сообщений:", recentResp);
          }
        } catch (updateError) {
          console.error("[SEND] ❌ Ошибка обновления сообщений:", updateError);
          await loadInitialMessages();
        }
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
        console.error("[SEND] Ошибка в ответе:", response);
        alert(`Ошибка отправки: ${response.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      console.error("[SEND] Ошибка отправки сообщения:", error);
      alert(`Ошибка отправки сообщения: ${error}`);
    } finally {
      console.log("[SEND] Разблокируем интерфейс...");
      setSending(false);
      console.log("[SEND] Интерфейс разблокирован");
    }
  };
  const deleteMessage = async (messageId) => {
    if (!confirm("Удалить это сообщение?")) return;
    try {
      const response = await apiRequest(`/messages/${messageId}`, "DELETE", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      console.error("Ошибка удаления сообщения:", error);
      alert("Ошибка удаления сообщения");
    }
  };
  const clearAllMessages = async () => {
    if (!confirm("Очистить всю историю сообщений? Это действие необратимо!")) return;
    try {
      const response = await apiRequest("/messages/clear-all", "DELETE", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        setMessages([]);
        alert(`Удалено ${response.deleted_count} сообщений`);
      }
    } catch (error) {
      console.error("Ошибка очистки сообщений:", error);
      alert("Ошибка очистки сообщений");
    }
  };
  const syncWithTelegram = async () => {
    if (!confirm("Отправить всю историю в Telegram? Это может занять время при большом количестве сообщений.")) return;
    try {
      setLoading(true);
      const response = await apiRequest("/messages/sync-to-telegram", "POST", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        alert(`✅ Синхронизация завершена! Отправлено ${response.sent_count} сообщений в Telegram.`);
      } else {
        alert(`⚠️ Синхронизация завершена с предупреждениями: ${response.message}`);
      }
    } catch (error) {
      console.error("Ошибка синхронизации:", error);
      alert("Ошибка синхронизации с Telegram");
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = /* @__PURE__ */ new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const telegramStyles = {
    container: {
      backgroundColor: "#17212B",
      color: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      backgroundColor: "#242F3D",
      padding: "12px 16px",
      borderBottom: "1px solid #3E546A",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    headerTitle: {
      fontSize: "18px",
      fontWeight: "500",
      color: "#FFFFFF",
      margin: 0
    },
    headerSubtitle: {
      fontSize: "14px",
      color: "#8E8E93",
      margin: "2px 0 0 0"
    },
    messagesContainer: {
      flex: 1,
      padding: "8px",
      overflowY: "auto",
      backgroundColor: "#17212B"
    },
    messageWrapper: {
      display: "flex",
      marginBottom: "8px",
      alignItems: "flex-end"
    },
    messageUserWrapper: {
      justifyContent: "flex-end"
    },
    messageBubble: {
      maxWidth: "80%",
      padding: "8px 12px",
      borderRadius: "12px",
      position: "relative",
      wordWrap: "break-word"
    },
    messageBubbleUser: {
      backgroundColor: "#0088CC",
      color: "#FFFFFF",
      borderBottomRightRadius: "4px"
    },
    messageBubbleBot: {
      backgroundColor: "#232E3C",
      color: "#FFFFFF",
      borderBottomLeftRadius: "4px"
    },
    messageText: {
      fontSize: "16px",
      lineHeight: "1.4",
      margin: 0
    },
    messageTime: {
      fontSize: "12px",
      opacity: 0.7,
      marginTop: "2px",
      textAlign: "right"
    },
    messageDeleteBtn: {
      position: "absolute",
      top: "-8px",
      right: "-8px",
      backgroundColor: "#FF4757",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      fontSize: "12px",
      cursor: "pointer",
      opacity: 0,
      transition: "opacity 0.2s"
    },
    inputContainer: {
      backgroundColor: "#242F3D",
      padding: "12px 16px",
      borderTop: "1px solid #3E546A",
      display: "flex",
      gap: "8px",
      alignItems: "flex-end"
    },
    messageInput: {
      flex: 1,
      backgroundColor: "#17212B",
      border: "1px solid #3E546A",
      borderRadius: "20px",
      padding: "8px 16px",
      color: "#FFFFFF",
      fontSize: "16px",
      resize: "none",
      outline: "none",
      minHeight: "20px",
      maxHeight: "120px"
    },
    sendButton: {
      backgroundColor: "#0088CC",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    newChatButton: {
      backgroundColor: "transparent",
      color: "#0088CC",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
      padding: "4px 8px"
    },
    dateHeader: {
      textAlign: "center",
      margin: "16px 0 8px 0",
      fontSize: "13px",
      color: "#8E8E93",
      backgroundColor: "#242F3D",
      padding: "4px 12px",
      borderRadius: "12px",
      display: "inline-block",
      position: "relative",
      left: "50%",
      transform: "translateX(-50%)"
    },
    reactionsPanel: {
      display: "flex",
      gap: "4px",
      marginTop: "4px",
      opacity: 0.7,
      transition: "opacity 0.2s"
    },
    reactionBtn: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      padding: "2px 4px",
      borderRadius: "4px",
      transition: "background-color 0.2s"
    },
    loadMoreButton: {
      backgroundColor: "#242F3D",
      color: "#0088CC",
      border: "1px solid #3E546A",
      borderRadius: "20px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      ":hover": {
        backgroundColor: "#3E546A"
      },
      ":disabled": {
        opacity: 0.5,
        cursor: "not-allowed"
      }
    }
  };
  if (!telegramUserId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.container, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: telegramStyles.header, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: telegramStyles.headerTitle, children: "💬 Чат в приложении" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: telegramStyles.headerSubtitle, children: "Требуется вход через Telegram" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column", color: "#8E8E93" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 24, marginBottom: 12 }, children: "Приложение доступно после входа" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          try {
            window.location.hash = "#/webauth";
          } catch (e) {
            window.location.replace("/#/webauth");
          }
        }, style: { padding: "10px 16px", borderRadius: 12, border: "1px solid #3E546A", background: "#242F3D", color: "#fff", cursor: "pointer" }, children: "Войти через Telegram" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.container, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: telegramStyles.headerTitle, children: "💬 Чат в приложении" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: telegramStyles.headerSubtitle, children: [
          messages.length,
          " сообщений • 👤 User: ",
          telegramUser == null ? void 0 : telegramUser.id,
          " • v2.1-",
          Date.now().toString().slice(-6),
          sending && " • 🔒 БЛОКИРОВКА"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: syncWithTelegram,
            style: { ...telegramStyles.newChatButton, color: "#00C851" },
            disabled: loading,
            title: "Отправить историю в Telegram",
            children: "🔄 Синхронизация"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: clearAllMessages,
            style: telegramStyles.newChatButton,
            children: "🗑️ Очистить всё"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              console.log("[DEBUG] 🔄 ПРИНУДИТЕЛЬНАЯ ПЕРЕЗАГРУЗКА СООБЩЕНИЙ");
              setMessages([]);
              setLoading(true);
              setOffset(0);
              setHasMoreMessages(true);
              loadInitialMessages();
            },
            style: { ...telegramStyles.newChatButton, color: "#007AFF" },
            title: "Принудительно перезагрузить сообщения",
            children: "🔄"
          }
        ),
        sending && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              console.log("[DEBUG] 🔓 Экстренная разблокировка интерфейса");
              setSending(false);
              setLoading(false);
              setLoadingMore(false);
              console.log("[DEBUG] ✅ Все состояния сброшены");
            },
            style: { ...telegramStyles.newChatButton, color: "#FF3B30", fontWeight: "bold" },
            title: "Экстренная разблокировка поля ввода",
            children: "🚨 РАЗБЛОКИРОВАТЬ"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: messagesContainerRef, style: telegramStyles.messagesContainer, children: [
      !loading && hasMoreMessages && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: "12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: loadMoreMessages,
          disabled: loadingMore,
          style: telegramStyles.loadMoreButton,
          children: loadingMore ? "⏳ Загрузка..." : "⬆️ Загрузить старые сообщения"
        }
      ) }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", padding: "20px", color: "#8E8E93" }, children: "Загрузка сообщений..." }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px", color: "#8E8E93" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "48px", marginBottom: "16px" }, children: "💭" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Пока нет сообщений" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "14px" }, children: "Начните диалог, отправив первое сообщение" })
      ] }) : messages.map((message, index) => {
        var _a;
        const showDate = index === 0 || formatDate(message.created_at) !== formatDate((_a = messages[index - 1]) == null ? void 0 : _a.created_at);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          showDate && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: telegramStyles.dateHeader, children: formatDate(message.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                ...telegramStyles.messageWrapper,
                ...message.sender_type === "user" ? telegramStyles.messageUserWrapper : {}
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    ...telegramStyles.messageBubble,
                    ...message.sender_type === "user" ? telegramStyles.messageBubbleUser : telegramStyles.messageBubbleBot
                  },
                  onMouseEnter: (e) => {
                    const deleteBtn = e.currentTarget.querySelector(".delete-btn");
                    if (deleteBtn) deleteBtn.style.opacity = "1";
                  },
                  onMouseLeave: (e) => {
                    const deleteBtn = e.currentTarget.querySelector(".delete-btn");
                    if (deleteBtn) deleteBtn.style.opacity = "0";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "delete-btn",
                        onClick: () => deleteMessage(message.id),
                        style: telegramStyles.messageDeleteBtn,
                        title: "Удалить сообщение",
                        children: "×"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: telegramStyles.messageText, children: message.text }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.reactionsPanel, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: telegramStyles.reactionBtn, title: "Лайк", children: "👍" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: telegramStyles.reactionBtn, title: "Дизлайк", children: "👎" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: telegramStyles.reactionBtn, title: "Сердце", children: "❤️" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: telegramStyles.reactionBtn, title: "Смех", children: "😂" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: telegramStyles.reactionBtn, title: "Удивление", children: "😮" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: telegramStyles.reactionBtn, title: "Грусть", children: "😢" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: telegramStyles.messageTime, children: formatTime(message.created_at) })
                  ]
                }
              )
            }
          )
        ] }, message.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.inputContainer, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: newMessage,
          onChange: (e) => setNewMessage(e.target.value),
          onKeyPress: handleKeyPress,
          placeholder: sending ? "🔒 Поле заблокировано..." : "Введите сообщение...",
          style: {
            ...telegramStyles.messageInput,
            backgroundColor: sending ? "#2A1B1B" : "#17212B",
            borderColor: sending ? "#FF3B30" : "#3E546A"
          },
          disabled: sending,
          rows: 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: sendMessage,
          disabled: !newMessage.trim() || sending,
          style: {
            ...telegramStyles.sendButton,
            opacity: !newMessage.trim() || sending ? 0.5 : 1
          },
          children: sending ? "⏳" : "📤"
        }
      )
    ] })
  ] });
};
export {
  TelegramChat as default
};
//# sourceMappingURL=TelegramChat-B4V16WJN.js.map
