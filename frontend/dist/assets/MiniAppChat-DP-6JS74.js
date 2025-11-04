import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { g as getTelegramUser, c as apiRequest, A as API_BASE } from "./index-B4P9h-k1.js";
const MiniAppChat = () => {
  var _a, _b;
  const [messages, setMessages] = reactExports.useState([]);
  const [threads, setThreads] = reactExports.useState([]);
  const [currentThread, setCurrentThread] = reactExports.useState(null);
  const [newMessage, setNewMessage] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [sending, setSending] = reactExports.useState(false);
  const [voices, setVoices] = reactExports.useState([]);
  const [selectedVoice, setSelectedVoice] = reactExports.useState("");
  const [recording, setRecording] = reactExports.useState(false);
  const [rtProgressBytes, setRtProgressBytes] = reactExports.useState(0);
  const wsRef = reactExports.useRef(null);
  const mediaRecorderRef = reactExports.useRef(null);
  const mediaStreamRef = reactExports.useRef(null);
  const audioRef = reactExports.useRef(null);
  const [lastAsrText, setLastAsrText] = reactExports.useState("");
  const [activePromptName, setActivePromptName] = reactExports.useState("");
  const messagesEndRef = reactExports.useRef(null);
  const telegramUser = getTelegramUser();
  const telegramUserId = telegramUser == null ? void 0 : telegramUser.id;
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  reactExports.useEffect(() => {
    try {
      document.body.style.setProperty("background-color", "var(--sp-bg-secondary)");
      document.documentElement.style.setProperty("background-color", "var(--sp-bg-secondary)");
    } catch (e) {
    }
  }, []);
  reactExports.useEffect(() => {
    console.log("[MINIAPP] 🚀 MiniAppChat инициализация");
    console.log("[MINIAPP] 👤 Telegram user:", telegramUser);
    console.log("[MINIAPP] 🆔 Telegram user ID:", telegramUserId);
    console.log("[MINIAPP] 🧵 Current thread:", currentThread);
    console.log("[MINIAPP] 💬 Messages count:", messages.length);
  }, [telegramUser, telegramUserId, currentThread, messages.length]);
  reactExports.useEffect(() => {
    console.log("[MINIAPP] 🎯 Дополнительная инициализация Telegram WebApp");
    const initTelegramWebApp = () => {
      var _a2, _b2, _c, _d;
      if (typeof window !== "undefined" && ((_a2 = window.Telegram) == null ? void 0 : _a2.WebApp)) {
        const webApp = window.Telegram.WebApp;
        console.log("[MINIAPP] 📱 Telegram WebApp найден, инициализируем...");
        try {
          webApp.expand();
          webApp.ready();
          webApp.setHeaderColor("#2C3E50");
          webApp.setBackgroundColor("#FFFFFF");
          console.log("[MINIAPP] ✅ Telegram WebApp инициализирован");
          console.log("[MINIAPP] 📊 initData:", webApp.initData);
          console.log("[MINIAPP] 👤 initDataUnsafe:", webApp.initDataUnsafe);
          console.log("[MINIAPP] 👤 User from WebApp:", (_b2 = webApp.initDataUnsafe) == null ? void 0 : _b2.user);
          const webAppUser = (_c = webApp.initDataUnsafe) == null ? void 0 : _c.user;
          if (webAppUser && webAppUser.id && !telegramUserId) {
            console.log("[MINIAPP] 🔄 Найден пользователь в WebApp, обновляем состояние");
            sessionStorage.setItem("tg_id", String(webAppUser.id));
            sessionStorage.setItem("telegram_user", JSON.stringify(webAppUser));
            console.log("[MINIAPP] ✅ Состояние обновлено без перезагрузки");
          }
        } catch (webAppError) {
          console.warn("[MINIAPP] ⚠️ Ошибка инициализации WebApp:", webAppError);
        }
      } else {
        console.log("[MINIAPP] ❌ Telegram WebApp не найден");
        console.log("[MINIAPP] 🌐 Window defined:", typeof window !== "undefined");
        console.log("[MINIAPP] 📱 Telegram exists:", !!window.Telegram);
        console.log("[MINIAPP] 🤖 WebApp exists:", !!((_d = window.Telegram) == null ? void 0 : _d.WebApp));
      }
    };
    setTimeout(initTelegramWebApp, 200);
  }, []);
  reactExports.useEffect(() => {
    if (!telegramUserId) return;
    loadThreads();
    (async () => {
      try {
        const resp = await apiRequest("/miniapp/prompts", "GET", null, {
          "X-Telegram-User-ID": String(telegramUserId)
        });
        const items = (resp == null ? void 0 : resp.items) || [];
        const active = items.find((p) => p.is_active) || items.find((p) => p.is_base);
        if (active && active.name) setActivePromptName(active.name);
        else setActivePromptName("SoulPulse");
      } catch (e) {
        console.warn("[MINIAPP] Не удалось загрузить активную личность:", e);
        setActivePromptName("SoulPulse");
      }
    })();
  }, [telegramUserId]);
  reactExports.useEffect(() => {
    if (currentThread) {
      loadMessages(currentThread);
    }
  }, [currentThread]);
  reactExports.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  reactExports.useEffect(() => {
    console.log("[MINIAPP] 🚀 Запускаем автоматическое обновление сообщений");
    const interval = setInterval(async () => {
      if (!telegramUserId || !currentThread || sending) return;
      try {
        const recentResp = await apiRequest(`/messages/recent?limit=50&offset=0&_t=${Date.now()}`, "GET", null, {
          "X-Telegram-User-ID": String(telegramUserId)
        });
        if (recentResp.status === "success") {
          const newMessages = recentResp.messages || [];
          if (newMessages.length > messages.length) {
            console.log("[MINIAPP] 📥 Найдены новые сообщения:", newMessages.length - messages.length);
            setMessages(newMessages.reverse());
            setTimeout(() => scrollToBottom(), 100);
          }
        }
      } catch (error) {
        console.warn("[MINIAPP] Автоматическое обновление ошибок:", error);
      }
    }, 5e3);
    return () => {
      console.log("[MINIAPP] 🛑 Останавливаем автоматическое обновление");
      clearInterval(interval);
    };
  }, [telegramUserId, currentThread, messages.length, sending]);
  const scrollToBottom = () => {
    var _a2;
    (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  };
  const loadThreads = async () => {
    setLoading(true);
    try {
      if (!telegramUserId) throw new Error("NO_TG_ID");
      const response = await apiRequest("/chat/threads", "GET", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        setThreads(response.threads || []);
        if (response.threads && response.threads.length > 0) {
          setCurrentThread(response.threads[0].id);
        } else {
          await createNewThread();
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки тредов:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadMessages = async (threadId) => {
    setLoading(true);
    try {
      if (!telegramUserId) throw new Error("NO_TG_ID");
      const response = await apiRequest(`/chat/threads/${threadId}/messages?limit=100`, "GET", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        setMessages(response.messages || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    (async () => {
      try {
        const headers = {};
        const tg = sessionStorage.getItem("tg_id") || (telegramUserId ? String(telegramUserId) : "");
        if (tg) headers["X-Telegram-User-ID"] = tg;
        const res = await fetch("/api/voice/voices", { headers });
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data == null ? void 0 : data.items) ? data.items : [];
        setVoices(items.map((v) => ({ id: String(v.id || ""), display_name: String(v.display_name || v.id || "") })));
      } catch (e) {
      }
    })();
  }, [telegramUserId]);
  const onVoiceSelect = async (voiceId) => {
    var _a2;
    setSelectedVoice(voiceId);
    try {
      const personaKey = ((_a2 = window.__SP_FLAGS__) == null ? void 0 : _a2.VOICE_PERSONA_KEY) || ((selectedPrompt == null ? void 0 : selectedPrompt.key) || "");
      const body = { persona_key: personaKey || null, voice_id: voiceId };
      const headers = { "Content-Type": "application/json" };
      const tg = sessionStorage.getItem("tg_id") || (telegramUserId ? String(telegramUserId) : "");
      if (tg) headers["X-Telegram-User-ID"] = tg;
      await fetch("/api/voice/set_voice", { method: "POST", headers, body: JSON.stringify(body) });
    } catch (e) {
    }
  };
  const getTgIdString = () => {
    try {
      const fromSession = sessionStorage.getItem("tg_id");
      if (fromSession) return String(fromSession);
    } catch (e) {
    }
    return telegramUserId ? String(telegramUserId) : "";
  };
  const buildWsUrl = () => {
    try {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      return `${proto}//${host}/api/voice/rt`;
    } catch (e) {
      try {
        const base = API_BASE || "";
        if (base.startsWith("http")) {
          const u = new URL(base);
          const wsProto = u.protocol === "https:" ? "wss:" : "ws:";
          return `${wsProto}//${u.host}/api/voice/rt`;
        }
      } catch (e2) {
      }
      return "/api/voice/rt";
    }
  };
  const startRecording = async () => {
    if (recording) return;
    try {
      const wsUrl = buildWsUrl();
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;
      setRtProgressBytes(0);
      setLastAsrText("");
      ws.onopen = async () => {
        const tgId = getTgIdString();
        const startPayload = { type: "start", lang: "ru-RU", format: "ogg", tg_id: tgId, mode: "soul" };
        try {
          ws.send(JSON.stringify(startPayload));
        } catch (e) {
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          const mime = MediaRecorder.isTypeSupported("audio/ogg;codecs=opus") ? "audio/ogg;codecs=opus" : MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
          const mr = new MediaRecorder(stream, { mimeType: mime });
          mediaRecorderRef.current = mr;
          mr.ondataavailable = async (e) => {
            try {
              if (!e.data) return;
              const buf = await e.data.arrayBuffer();
              ws.send(buf);
            } catch (e2) {
            }
          };
          mr.start(300);
          setRecording(true);
        } catch (e) {
          console.error("[Voice] getUserMedia error", e);
          try {
            ws.close();
          } catch (e2) {
          }
        }
      };
      ws.onmessage = async (ev) => {
        try {
          if (typeof ev.data === "string") {
            const msg = JSON.parse(ev.data);
            const t = String(msg.type || "");
            if (t === "progress") {
              const b = Number(msg.bytes || 0);
              if (!Number.isNaN(b)) setRtProgressBytes(b);
            } else if (t === "asr_partial") {
              if (msg.text) setLastAsrText(String(msg.text) + " (частично…)");
            } else if (t === "asr_final") {
              if (msg.text) setLastAsrText(String(msg.text));
            } else if (t === "soul_reply") {
            } else if (t === "error") {
              console.warn("[VoiceWS] error", msg);
            }
            return;
          }
          const arr = ev.data;
          const blob = new Blob([arr]);
          const url = URL.createObjectURL(blob);
          let el = audioRef.current;
          if (!el) {
            el = new Audio();
            el.autoplay = true;
            el.controls = false;
            audioRef.current = el;
          }
          try {
            el.src = url;
            await el.play();
          } catch (e) {
            console.warn("[Voice] autoplay blocked", e);
          }
        } catch (e) {
          console.warn("[VoiceWS] onmessage parse error", e);
        }
      };
      ws.onclose = () => {
        var _a2, _b2, _c, _d;
        setRecording(false);
        setRtProgressBytes(0);
        (_b2 = (_a2 = mediaRecorderRef.current) == null ? void 0 : _a2.stop) == null ? void 0 : _b2.call(_a2);
        try {
          (_d = (_c = mediaStreamRef.current) == null ? void 0 : _c.getTracks()) == null ? void 0 : _d.forEach((t) => t.stop());
        } catch (e) {
        }
        mediaRecorderRef.current = null;
        mediaStreamRef.current = null;
      };
      ws.onerror = () => {
        try {
          ws.close();
        } catch (e) {
        }
      };
    } catch (e) {
      console.error("[Voice] startRecording error", e);
      setRecording(false);
    }
  };
  const stopRecording = async () => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    try {
      (_b2 = (_a2 = mediaRecorderRef.current) == null ? void 0 : _a2.stop) == null ? void 0 : _b2.call(_a2);
    } catch (e) {
    }
    try {
      (_d = (_c = mediaStreamRef.current) == null ? void 0 : _c.getTracks()) == null ? void 0 : _d.forEach((t) => t.stop());
    } catch (e) {
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    setRecording(false);
    try {
      (_f = (_e = wsRef.current) == null ? void 0 : _e.send) == null ? void 0 : _f.call(_e, JSON.stringify({ type: "stop" }));
    } catch (e) {
    }
    try {
      (_h = (_g = wsRef.current) == null ? void 0 : _g.close) == null ? void 0 : _h.call(_g);
    } catch (e) {
    }
  };
  const sendMessage = async () => {
    console.log("[MINIAPP] 🔍 Проверка перед отправкой:");
    console.log("[MINIAPP] 📱 Telegram User:", telegramUser);
    console.log("[MINIAPP] 🆔 Telegram User ID:", telegramUserId);
    console.log("[MINIAPP] 💬 New Message:", newMessage.trim());
    console.log("[MINIAPP] 🧵 Current Thread:", currentThread);
    console.log("[MINIAPP] 📤 Sending state:", sending);
    if (!telegramUserId) {
      console.error("[MINIAPP] ❌ Нет telegramUserId!");
      alert("Не удаётся определить Telegram ID. Откройте мини‑приложение из Telegram.");
      return;
    }
    if (!newMessage.trim()) {
      console.warn("[MINIAPP] ⚠️ Пустое сообщение");
      return;
    }
    if (sending) {
      console.warn("[MINIAPP] ⚠️ Уже отправляется сообщение");
      return;
    }
    console.log("[MINIAPP] ✅ Все проверки пройдены, начинаем отправку");
    setSending(true);
    const userMessage = newMessage;
    setNewMessage("");
    const tempUserMessage = {
      id: "temp-" + Date.now(),
      text: userMessage,
      sender_type: "user",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      thread_id: currentThread || ""
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    try {
      const requestData = {
        message: userMessage,
        thread_id: currentThread
      };
      const requestHeaders = {
        "X-Telegram-User-ID": String(telegramUserId)
      };
      console.log("[MINIAPP] 📤 Request data:", requestData);
      console.log("[MINIAPP] 📤 Request headers:", requestHeaders);
      console.log("[MINIAPP] 🌐 Выполняем API запрос...");
      const response = await apiRequest("/chat/send", "POST", requestData, requestHeaders);
      console.log("[MINIAPP] 📨 Полный ответ сервера:", JSON.stringify(response, null, 2));
      console.log("[MINIAPP] 📊 Статус ответа:", response.status);
      console.log("[MINIAPP] 📝 Сообщение ответа:", response.message);
      if (response.status === "success") {
        console.log("[MINIAPP] ✅ Сообщение отправлено успешно");
        if (response.thread_id) {
          console.log("[MINIAPP] 🔄 Обновляем сообщения для треда:", response.thread_id);
          setCurrentThread(response.thread_id);
          await loadMessages(response.thread_id);
        } else {
          console.log("[MINIAPP] ⚠️ Нет thread_id в ответе сервера");
          if (currentThread) {
            console.log("[MINIAPP] 🔄 Обновляем текущий тред:", currentThread);
            await loadMessages(currentThread);
          }
        }
      } else {
        console.error("[MINIAPP] ❌ Ошибка отправки:", {
          status: response.status,
          message: response.message,
          fullResponse: response
        });
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
        alert("Ошибка отправки сообщения: " + (response.message || "Неизвестная ошибка"));
      }
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      console.error("[MINIAPP] 💥 Ошибка отправки сообщения:", error);
      alert("Ошибка отправки сообщения");
    } finally {
      setSending(false);
    }
  };
  const deleteMessage = async (messageId) => {
    const confirmed = window.confirm("Удалить это сообщение навсегда?");
    if (!confirmed) return;
    try {
      if (!telegramUserId) throw new Error("NO_TG_ID");
      const response = await apiRequest(`/messages/${messageId}`, "DELETE", null, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } else {
        alert("Ошибка удаления: " + (response.message || "Неизвестная ошибка"));
      }
    } catch (error) {
      console.error("Ошибка удаления сообщения:", error);
      alert("Ошибка удаления сообщения");
    }
  };
  const createNewThread = async () => {
    try {
      if (!telegramUserId) throw new Error("NO_TG_ID");
      const response = await apiRequest("/chat/threads", "POST", {}, {
        "X-Telegram-User-ID": String(telegramUserId)
      });
      if (response.status === "success") {
        setCurrentThread(response.thread_id);
        setMessages([]);
        await loadThreads();
      }
    } catch (error) {
      console.error("Ошибка создания треда:", error);
    }
  };
  reactExports.useEffect(() => {
    var _a2;
    console.log("[MINIAPP] 🎨 Проверяем стили и видимость");
    console.log("[MINIAPP] 📱 User agent:", navigator.userAgent);
    console.log("[MINIAPP] 🌐 Is Telegram WebApp:", !!((_a2 = window.Telegram) == null ? void 0 : _a2.WebApp));
    const body = document.body;
    const html = document.documentElement;
    console.log("[MINIAPP] 🎨 Body classes:", body.className);
    console.log("[MINIAPP] 🎨 Body styles:", getComputedStyle(body).backgroundColor);
    console.log("[MINIAPP] 🎨 HTML styles:", getComputedStyle(html).backgroundColor);
    body.style.setProperty("background-color", "var(--sp-bg-secondary)", "important");
    body.style.setProperty("color", "var(--sp-text-primary)", "important");
    html.style.setProperty("background-color", "var(--sp-bg-secondary)", "important");
    html.style.setProperty("color", "var(--sp-text-primary)", "important");
    body.classList.remove("dark", "black", "telegram-dark");
    html.classList.remove("dark", "black", "telegram-dark");
    body.classList.add("light-theme");
    console.log("[MINIAPP] 🔧 Принудительно установлена светлая тема");
  }, []);
  if (!telegramUserId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4", style: { backgroundColor: "#f9fafb", color: "#111827" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-center mb-4", children: "🔍 Диагностика проблемы" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Telegram User:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: telegramUser ? "text-green-600" : "text-red-600", children: telegramUser ? "✅ Найден" : "❌ Не найден" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Telegram User ID:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: telegramUserId ? "text-green-600" : "text-red-600", children: telegramUserId || "❌ undefined" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Telegram WebApp:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: ((_a = window.Telegram) == null ? void 0 : _a.WebApp) ? "text-green-600" : "text-red-600", children: ((_b = window.Telegram) == null ? void 0 : _b.WebApp) ? "✅ Доступен" : "❌ Недоступен" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SessionStorage tg_id:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: sessionStorage.getItem("tg_id") ? "text-green-600" : "text-red-600", children: sessionStorage.getItem("tg_id") || "❌ Пусто" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "API_BASE:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 text-xs break-all", children: API_BASE })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-3 bg-blue-50 rounded text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Возможные причины:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 space-y-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Мини-приложение не запущено из Telegram" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Данные пользователя не переданы" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Проблема с CORS или API_BASE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Ошибка инициализации Telegram WebApp" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: async () => {
              console.log("[TEST] 🧪 Тестируем API подключение...");
              try {
                const testResponse = await apiRequest("/health", "GET", null, {});
                console.log("[TEST] ✅ API подключение работает:", testResponse);
                alert("✅ API подключение работает!\nСмотрите консоль для деталей.");
              } catch (error) {
                console.error("[TEST] ❌ Ошибка API подключения:", error);
                alert("❌ Ошибка API подключения!\nСмотрите консоль для деталей.");
              }
            },
            className: "flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm",
            children: "🧪 Тест API"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm",
            children: "🔄 Перезагрузить"
          }
        )
      ] })
    ] }) });
  }
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
      fontSize: "var(--sp-font-size-lg)",
      fontWeight: "500",
      color: "#FFFFFF",
      margin: 0
    },
    headerSubtitle: {
      fontSize: "var(--sp-font-size-sm)",
      color: "#8E8E93",
      margin: "2px 0 0 0"
    },
    warningBanner: {
      backgroundColor: "#2B1D1F",
      border: "1px solid #8B4513",
      borderRadius: "8px",
      padding: "12px",
      margin: "8px 16px",
      fontSize: "var(--sp-font-size-sm)",
      color: "#F4A460"
    },
    threadsContainer: {
      backgroundColor: "#1E2833",
      borderTop: "1px solid #3E546A",
      padding: "12px 16px",
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      maxHeight: "120px",
      overflowY: "auto"
    },
    threadButton: {
      backgroundColor: "#2C3E50",
      border: "1px solid #34495E",
      borderRadius: "16px",
      padding: "6px 12px",
      fontSize: "var(--sp-font-size-xs)",
      color: "#BDC3C7",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    threadButtonActive: {
      backgroundColor: "#3498DB",
      borderColor: "#2980B9",
      color: "#FFFFFF"
    },
    newThreadButton: {
      backgroundColor: "#3498DB",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      fontSize: "var(--sp-font-size-sm)",
      fontWeight: "500",
      color: "#FFFFFF",
      cursor: "pointer",
      transition: "background-color 0.2s"
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
      fontSize: "var(--sp-font-size-sm)",
      lineHeight: "1.4",
      wordWrap: "break-word"
    },
    messageUser: {
      backgroundColor: "#2B5278",
      color: "#FFFFFF"
    },
    messageAssistant: {
      backgroundColor: "#242F3D",
      color: "#FFFFFF",
      border: "1px solid #3E546A"
    },
    inputContainer: {
      backgroundColor: "#242F3D",
      padding: "12px 16px",
      borderTop: "1px solid #3E546A",
      display: "flex",
      alignItems: "flex-end",
      gap: "8px"
    },
    messageInput: {
      flex: 1,
      backgroundColor: "#17212B",
      border: "1px solid #3E546A",
      borderRadius: "18px",
      padding: "8px 16px",
      fontSize: "var(--sp-font-size-sm)",
      color: "#FFFFFF",
      resize: "none",
      maxHeight: "100px",
      minHeight: "36px",
      outline: "none"
    },
    sendButton: {
      backgroundColor: "#3498DB",
      border: "none",
      borderRadius: "18px",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "var(--sp-font-size-base)",
      transition: "background-color 0.2s"
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      color: "#8E8E93"
    },
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      color: "#8E8E93",
      textAlign: "center",
      padding: "40px 20px"
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.container, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: telegramStyles.headerTitle, children: "💬 Чат" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: telegramStyles.headerSubtitle, children: !telegramUserId ? "Нет Telegram ID — откройте из Telegram" : currentThread ? `Диалог ${currentThread.slice(0, 8)}...` : "Выберите диалог" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        voices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: selectedVoice,
            onChange: (e) => onVoiceSelect(e.target.value),
            style: {
              backgroundColor: "#2C3E50",
              color: "#fff",
              border: "1px solid #34495E",
              borderRadius: 8,
              padding: "6px 8px",
              fontSize: 12
            },
            title: "Выбор голоса для TTS",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Голос по умолчанию" }),
              voices.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v.id, children: v.display_name || v.id }, v.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: createNewThread,
            style: {
              ...telegramStyles.newThreadButton,
              opacity: !telegramUserId ? 0.5 : 1
            },
            disabled: !telegramUserId,
            children: "➕ Новый диалог"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: recording ? stopRecording : startRecording,
            style: {
              ...telegramStyles.newThreadButton,
              backgroundColor: recording ? "#ef4444" : "#10b981"
            },
            disabled: !telegramUserId,
            title: recording ? "Остановить запись" : "Начать запись и говорить",
            children: recording ? "⏹️ Стоп" : "🎤 Микрофон"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: telegramStyles.warningBanner, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginRight: "8px" }, children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Для получения ответов в Telegram:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "4px 0 0 0" }, children: [
          "Запустите мини‑приложение из Telegram и нажмите ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "/start" }),
          " в чате бота"
        ] })
      ] })
    ] }) }),
    recording && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 16px", color: "#8E8E93", display: "flex", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🎙️ Запись..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "принято ~",
        Math.round(rtProgressBytes / 1024),
        " KB"
      ] }),
      lastAsrText ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.9 }, children: [
        "ASR: “",
        lastAsrText.slice(0, 64),
        lastAsrText.length > 64 ? "…" : "",
        "”"
      ] }) : null
    ] }),
    threads.length > 1 && threads.length <= 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.threadsContainer, children: [
      threads.slice(0, 5).map((thread) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setCurrentThread(thread.id),
          style: {
            ...telegramStyles.threadButton,
            ...currentThread === thread.id ? telegramStyles.threadButtonActive : {}
          },
          children: [
            "📝 ",
            thread.id.slice(0, 8),
            "... ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.7 }, children: [
              "(",
              thread.message_count,
              ")"
            ] })
          ]
        },
        thread.id
      )),
      threads.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "12px", color: "#8E8E93", padding: "6px 12px" }, children: [
        "+",
        threads.length - 5,
        " диалогов"
      ] })
    ] }),
    threads.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      backgroundColor: "#1E2833",
      borderTop: "1px solid #3E546A",
      padding: "12px",
      textAlign: "center"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "13px", color: "#8E8E93" }, children: [
      "📚 У вас ",
      threads.length,
      ' диалогов. Используйте "Новый диалог" для начала.'
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.messagesContainer, children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: telegramStyles.loadingContainer, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Загрузка сообщений..." }) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.emptyState, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "48px", marginBottom: "16px" }, children: "💬" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "18px", fontWeight: "500", marginBottom: "8px" }, children: "Начните общение" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "14px" }, children: "Напишите ваше первое сообщение" })
      ] }) : messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            ...telegramStyles.messageWrapper,
            ...message.sender_type === "user" ? telegramStyles.messageUserWrapper : {}
          },
          children: [
            message.sender_type !== "user" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              alignSelf: "stretch",
              display: "flex",
              alignItems: "flex-start",
              minWidth: 72,
              maxWidth: 120,
              marginRight: 8,
              color: "#8E8E93",
              fontSize: "12px",
              lineHeight: 1.2
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: activePromptName || "SoulPulse" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  ...telegramStyles.messageBubble,
                  ...message.sender_type === "user" ? telegramStyles.messageUser : telegramStyles.messageAssistant,
                  position: "relative"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "var(--sp-spacing-xs)",
                    fontSize: "var(--sp-font-size-xs)",
                    opacity: 0.7
                  }, children: [
                    message.sender_type === "user" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "👤 Вы" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "🤖 ",
                      activePromptName || "AI"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: "auto" }, children: formatTime(message.created_at) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { whiteSpace: "pre-wrap", lineHeight: "1.4" }, children: message.text }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => deleteMessage(message.id),
                      style: {
                        position: "absolute",
                        top: "var(--sp-spacing-xs)",
                        right: "var(--sp-spacing-xs)",
                        background: "none",
                        border: "none",
                        padding: "var(--sp-spacing-xs)",
                        borderRadius: "50%",
                        fontSize: "var(--sp-font-size-xs)",
                        cursor: "pointer",
                        opacity: 0.6,
                        transition: "var(--sp-transition-fast)"
                      },
                      title: "Удалить сообщение",
                      onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
                      onMouseLeave: (e) => e.currentTarget.style.opacity = "0.6",
                      children: "🗑️"
                    }
                  )
                ]
              }
            )
          ]
        },
        message.id
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: telegramStyles.inputContainer, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: newMessage,
          onChange: (e) => setNewMessage(e.target.value),
          onKeyPress: handleKeyPress,
          placeholder: sending ? "⏳ Отправка..." : "Введите сообщение...",
          style: {
            ...telegramStyles.messageInput,
            backgroundColor: sending ? "var(--sp-bg-error)" : "var(--sp-bg-secondary)",
            borderColor: sending ? "var(--sp-color-error)" : "var(--sp-border-primary)"
          },
          rows: 1,
          disabled: sending || !telegramUserId
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: sendMessage,
          disabled: !newMessage.trim() || sending || !telegramUserId,
          style: {
            ...telegramStyles.sendButton,
            opacity: !newMessage.trim() || sending || !telegramUserId ? 0.5 : 1
          },
          children: sending ? "⏳" : "📤"
        }
      )
    ] })
  ] });
};
export {
  MiniAppChat as default
};
//# sourceMappingURL=MiniAppChat-DP-6JS74.js.map
