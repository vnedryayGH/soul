import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, a as usePlatform, b as usePermissions } from "./index-B4P9h-k1.js";
function getBaseFeatures() {
  return [
    { id: "mini-chat", icon: "💬", title: "Чат в приложении", description: "Полноценный чат с удалением сообщений", color: "var(--sp-color-primary)", route: "/chat" },
    { id: "realtime-voice", icon: "🎙️", title: "Реал‑тайм голос", description: "Отдельное окно для WS общения", color: "var(--sp-color-primary)", route: "/realtime-voice" },
    { id: "telegram-chat", icon: "✉️", title: "Телеграм-чат", description: "Альтернативный интерфейс чата", color: "var(--sp-color-secondary)", route: "/telegram-chat" },
    { id: "chat-management", icon: "🗂️", title: "Управление чатом", description: "Массовое удаление, статистика, синхронизация", color: "var(--sp-color-secondary)", route: "/chat-management" },
    { id: "prompts", icon: "/android-chrome-192x192.png", title: "Личности", description: "Выбор AI личности для общения", color: "var(--sp-color-accent)", route: "/prompts" },
    { id: "permission-demo", icon: "🔐", title: "Демо доступа", description: "Проверка ролей и прав (RBAC)", color: "var(--sp-color-accent)", route: "/permission-demo" },
    { id: "settings", icon: "⚙️", title: "Настройки", description: "Конфигурация приложения", color: "var(--sp-color-success)", route: "/settings" },
    { id: "llm-settings", icon: "🧠", title: "LLM настройки", description: "Провайдеры и параметры моделей", color: "var(--sp-color-primary)", route: "/llm-settings" },
    { id: "keywords", icon: "🏷️", title: "Ключевые слова", description: "Управление ключевыми словами", color: "var(--sp-color-accent)", route: "/keywords" },
    { id: "dates-reminders", icon: "📅", title: "Даты и напоминания", description: "Календарь событий и напоминаний", color: "var(--sp-color-success)", route: "/dates-reminders" },
    { id: "payments", icon: "💳", title: "Платежи", description: "Оплата и подписки", color: "var(--sp-color-secondary)", route: "/payments" },
    { id: "help", icon: "❓", title: "Помощь", description: "Справка и поддержка", color: "var(--sp-color-secondary)", route: "/help" },
    { id: "all-pages", icon: "🧭", title: "Все страницы", description: "Диагностический список всех роутов", color: "var(--sp-color-secondary)", route: "/all-pages" }
  ];
}
function getAdminFeatures() {
  return [
    { id: "soul-logs", icon: "📜", title: "Soul Логи", description: "Потоки логов, фильтр и скачивание", color: "var(--sp-color-primary)", route: "/soul/logs" },
    { id: "resilience-admin", icon: "🛡️", title: "Resilience", description: "Администрирование устойчивости/гвардии", color: "var(--sp-color-secondary)", route: "/admin/resilience" }
  ];
}
function getArchitectFeatures() {
  return [
    { id: "admin", icon: "🛡️", title: "Администрирование", description: "Промокоды и заявки", color: "var(--sp-color-accent)", route: "/admin" },
    { id: "architect", icon: "🧩", title: "Панель Архитектора", description: "Модели, лимиты, настройки", color: "var(--sp-color-secondary)", route: "/architect" },
    { id: "trace", icon: "🧭", title: "Trace", description: "Цепочка от webhook до ответа", color: "var(--sp-color-primary)", route: "/trace" },
    { id: "rbac-admin", icon: "🧷", title: "RBAC Admin", description: "Роли и права системы", color: "var(--sp-color-secondary)", route: "/rbac-admin" },
    { id: "soul-dashboard", icon: "🧠", title: "Soul Dashboard", description: "Мониторинг системы Soul", color: "var(--sp-color-primary)", route: "/soul/dashboard" },
    { id: "soul-optimization", icon: "⚡", title: "Soul Оптимизация", description: "Управление оптимизацией Soul", color: "var(--sp-color-accent)", route: "/soul/optimization" },
    { id: "soul-visualization", icon: "🌐", title: "Soul Визуализация", description: "Граф квантов сознания", color: "var(--sp-color-success)", route: "/soul/visualization" },
    { id: "soul-logs", icon: "📜", title: "Soul Логи", description: "Потоки логов, фильтр и скачивание", color: "var(--sp-color-primary)", route: "/soul/logs" },
    { id: "resilience-admin", icon: "🛡️", title: "Resilience", description: "Администрирование устойчивости/гвардии", color: "var(--sp-color-secondary)", route: "/admin/resilience" }
  ];
}
function getHomeFeatures(isAdmin, isArchitect) {
  const base = getBaseFeatures();
  const extra = [];
  if (isArchitect) {
    extra.push(...getArchitectFeatures());
  }
  if (isAdmin && !extra.some((f) => f.id === "soul-logs")) {
    extra.push(...getAdminFeatures());
  }
  const uniq = /* @__PURE__ */ new Map();
  [...base, ...extra].forEach((f) => {
    if (!uniq.has(f.id)) uniq.set(f.id, f);
  });
  return Array.from(uniq.values());
}
const TelegramHome = () => {
  var _a, _b;
  const navigate = useNavigate();
  const navigateTo = (path) => {
    try {
      navigate(path);
    } catch (e) {
    }
  };
  usePlatform();
  const { state } = usePermissions();
  const [authStep, setAuthStep] = reactExports.useState(0);
  const [authError, setAuthError] = reactExports.useState(null);
  const stepItems = reactExports.useMemo(() => [
    { title: "MiniApp", description: "tg_id найден" },
    { title: "OTP", description: "выдача кода" },
    { title: "Готово", description: "код выдан" }
  ], []);
  const isArchitect = (_a = state.roles) == null ? void 0 : _a.some((r) => r.name === "architect");
  const isAdmin = (_b = state.roles) == null ? void 0 : _b.some((r) => r.name === "admin");
  const features = getHomeFeatures(!!isAdmin, !!isArchitect);
  const requestWebAccess = async () => {
    var _a2, _b2, _c;
    try {
      const telegramUser = (_c = (_b2 = (_a2 = window.Telegram) == null ? void 0 : _a2.WebApp) == null ? void 0 : _b2.initDataUnsafe) == null ? void 0 : _c.user;
      const tgId = telegramUser == null ? void 0 : telegramUser.id;
      if (!telegramUser || !tgId) {
        setAuthError("400: отсутствует tg_id (MiniApp контекст)");
        return;
      }
      console.log("[WEB_ACCESS] 🚀 Создаем веб доступ для пользователя:", telegramUser);
      const headers = {};
      if (tgId) headers["X-Telegram-User-ID"] = String(tgId);
      setAuthError(null);
      setAuthStep(0);
      setAuthStep(1);
      try {
        const respCookie = await fetch("/api/web-auth/issue-web-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          credentials: "include"
        });
        if (respCookie.ok) {
          setAuthStep(2);
          let otp2 = null;
          try {
            const r = await fetch("/api/web-auth/issue-one-time-token", {
              method: "POST",
              headers: { "Content-Type": "application/json", ...headers },
              credentials: "include"
            });
            if (r.ok) {
              const j = await r.json();
              otp2 = (j == null ? void 0 : j.otp) || null;
            }
          } catch (e) {
          }
          const origin2 = window.location && window.location.origin || "https://mini.soulpulse.art";
          const userDataForUrl2 = {
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            language_code: telegramUser.language_code,
            photo_url: telegramUser.photo_url
          };
          const userDataEncoded2 = encodeURIComponent(JSON.stringify(userDataForUrl2));
          const url2 = otp2 ? `${origin2}/webauth?tg_id=${encodeURIComponent(String(tgId))}&otp=${encodeURIComponent(otp2)}&user_data=${userDataEncoded2}` : `${origin2}/webauth?tg_id=${encodeURIComponent(String(tgId))}&user_data=${userDataEncoded2}`;
          const container2 = document.createElement("div");
          container2.style.lineHeight = "1.6";
          container2.style.fontSize = "14px";
          const title2 = document.createElement("div");
          title2.innerHTML = "✅ Сессия выдана";
          title2.style.fontSize = "16px";
          title2.style.fontWeight = "bold";
          title2.style.marginBottom = "16px";
          title2.style.color = "var(--sp-color-success)";
          const info2 = document.createElement("div");
          info2.style.marginBottom = "16px";
          info2.innerHTML = `
            <div style="margin-bottom: 8px;">Нажмите кнопку ниже, чтобы открыть WebAuth.</div>
            ${otp2 ? `<div style="margin-bottom: 8px;"><strong>OTP:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${otp2}</code></div>` : ""}
          `;
          const linkSection2 = document.createElement("div");
          linkSection2.innerHTML = `
            <button id="sp_open_webauth_btn_cookie" style="
              display: inline-block;
              background: #3B82F6;
              color: white;
              text-decoration: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 13px;
              margin-bottom: 8px;
              cursor: pointer;
            ">🔗 Открыть WebAuth</button>
            <div style="font-size: 12px; color: var(--sp-text-secondary); word-break: break-all;">${url2}</div>
          `;
          container2.appendChild(title2);
          container2.appendChild(info2);
          container2.appendChild(linkSection2);
          const wrap2 = document.createElement("div");
          wrap2.style.position = "fixed";
          wrap2.style.inset = "0";
          wrap2.style.background = "rgba(0,0,0,0.5)";
          wrap2.style.display = "flex";
          wrap2.style.alignItems = "center";
          wrap2.style.justifyContent = "center";
          const modal2 = document.createElement("div");
          modal2.style.background = "#fff";
          modal2.style.padding = "16px";
          modal2.style.borderRadius = "8px";
          modal2.style.maxWidth = "480px";
          modal2.style.fontSize = "14px";
          modal2.appendChild(container2);
          const ok2 = document.createElement("button");
          ok2.textContent = "OK";
          ok2.style.marginTop = "12px";
          ok2.onclick = () => document.body.removeChild(wrap2);
          modal2.appendChild(ok2);
          wrap2.appendChild(modal2);
          document.body.appendChild(wrap2);
          try {
            const btn = document.getElementById("sp_open_webauth_btn_cookie");
            if (btn) {
              btn.addEventListener("click", () => {
                try {
                  open(url2);
                } catch (e) {
                  open(url2);
                }
              });
            }
          } catch (e) {
          }
          return;
        }
      } catch (e) {
      }
      let respOtp = await fetch("/api/web-auth/issue-one-time-token", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        credentials: "include"
      });
      if (!respOtp.ok && respOtp.status === 404) {
        try {
          respOtp = await fetch("/api/miniapp/auth/issue-one-time-token", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            credentials: "include"
          });
        } catch (e) {
        }
      }
      if (!respOtp.ok) {
        const t = await respOtp.text().catch(() => "");
        const code = respOtp.status;
        const msg = code === 401 ? "401: нет cookie/Bearer" : code === 404 ? "404: маршрут не найден" : code >= 500 ? `5xx: сервер/сеть (${code})` : `HTTP ${code}`;
        setAuthError(`${msg}${t ? " - " + t : ""}`);
        return;
      }
      const data = await respOtp.json();
      const otp = data.otp;
      const issuedTgId = data.tg_id || tgId;
      setAuthStep(2);
      const userDataForUrl = {
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        language_code: telegramUser.language_code,
        photo_url: telegramUser.photo_url
      };
      const origin = window.location && window.location.origin || "https://mini.soulpulse.art";
      const userDataEncoded = encodeURIComponent(JSON.stringify(userDataForUrl));
      const url = `${origin}/webauth?tg_id=${encodeURIComponent(issuedTgId)}&otp=${encodeURIComponent(otp)}&user_data=${userDataEncoded}`;
      console.log("[WEB_ACCESS] 🔗 Создана ссылка:", url);
      const container = document.createElement("div");
      container.style.lineHeight = "1.6";
      container.style.fontSize = "14px";
      const title = document.createElement("div");
      title.innerHTML = "✅ Веб-доступ выдан на 5 минут";
      title.style.fontSize = "16px";
      title.style.fontWeight = "bold";
      title.style.marginBottom = "16px";
      title.style.color = "var(--sp-color-success)";
      const info = document.createElement("div");
      info.style.marginBottom = "16px";
      info.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>OTP:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${otp}</code></div>
        <div style="margin-bottom: 8px;"><strong>Telegram ID:</strong> ${issuedTgId}</div>
        <div><strong>Пользователь:</strong> ${telegramUser.first_name} ${telegramUser.last_name || ""}</div>
      `;
      const linkSection = document.createElement("div");
      linkSection.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: bold;">Откройте WebAuth для входа:</div>
        <button id="sp_open_webauth_btn" style="
          display: inline-block;
          background: #3B82F6;
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 8px;
          cursor: pointer;
        ">🔗 Открыть WebAuth</button>
        <div style="font-size: 12px; color: var(--sp-text-secondary); word-break: break-all;">${url}</div>
      `;
      container.appendChild(title);
      container.appendChild(info);
      container.appendChild(linkSection);
      const wrap = document.createElement("div");
      wrap.style.position = "fixed";
      wrap.style.inset = "0";
      wrap.style.background = "rgba(0,0,0,0.5)";
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.justifyContent = "center";
      const modal = document.createElement("div");
      modal.style.background = "#fff";
      modal.style.padding = "16px";
      modal.style.borderRadius = "8px";
      modal.style.maxWidth = "480px";
      modal.style.fontSize = "14px";
      modal.appendChild(container);
      const ok = document.createElement("button");
      ok.textContent = "OK";
      ok.style.marginTop = "12px";
      ok.onclick = () => document.body.removeChild(wrap);
      modal.appendChild(ok);
      wrap.appendChild(modal);
      document.body.appendChild(wrap);
      try {
        const btn = document.getElementById("sp_open_webauth_btn");
        if (btn) {
          btn.addEventListener("click", () => {
            try {
              open(url);
            } catch (e) {
              open(url);
            }
          });
        }
      } catch (e) {
      }
    } catch (e) {
      console.error(e);
      setAuthError("5xx: сбой при выдаче OTP");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "telegram-home sp-edge-highlight", style: {
    background: "var(--sp-gradient-background)",
    minHeight: "100%",
    color: "var(--sp-text-primary)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    overflowX: "hidden"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sp-card-elevated sp-edge-highlight", style: { padding: "14px 16px", margin: "12px 12px 10px", boxSizing: "border-box", width: "100%", maxWidth: "100%", overflowX: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }, children: stepItems.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", opacity: idx <= authStep ? 1 : 0.4, fontSize: 12, color: "var(--sp-text-secondary)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          width: 18,
          height: 18,
          borderRadius: 9,
          background: idx <= authStep ? "var(--sp-color-primary)" : "rgba(0,0,0,0.12)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 6
        }, children: idx + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: s.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 6 }, children: s.description })
        ] }),
        idx < stepItems.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 14, height: 1, background: "rgba(0,0,0,0.15)", margin: "0 8px" } })
      ] }, s.title)) }),
      !!authError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, background: "#ffebee", color: "#b71c1c", border: "1px solid #ffcdd2", padding: "8px 10px", borderRadius: 6, fontSize: 12 }, children: authError })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
        fontSize: "16px",
        fontWeight: "500",
        color: "var(--sp-text-primary)",
        margin: "0 0 16px 0"
      }, children: "Быстрые действия" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gap: "10px", gridTemplateColumns: "1fr", width: "100%", boxSizing: "border-box" }, children: features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => navigateTo(feature.route),
          role: "button",
          tabIndex: 0,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") navigateTo(feature.route);
          },
          className: "telegram-home-feature-card sp-edge-highlight",
          style: { display: "flex", alignItems: "center", gap: "12px", width: "100%", boxSizing: "border-box" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: "24px",
              minWidth: "32px",
              textAlign: "center"
            }, children: feature.icon.startsWith("/") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: feature.icon,
                alt: feature.title,
                style: {
                  width: "24px",
                  height: "24px",
                  objectFit: "contain",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.12)"
                }
              }
            ) : feature.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
                margin: 0,
                fontSize: "16px",
                fontWeight: "500",
                color: "var(--sp-text-primary)",
                marginBottom: "2px"
              }, children: feature.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
                margin: 0,
                fontSize: "14px",
                color: "var(--sp-text-secondary)",
                lineHeight: "1.3"
              }, children: feature.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: "18px",
              color: "var(--sp-text-secondary)"
            }, children: "→" })
          ]
        },
        feature.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "telegram-home-recommendation-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: requestWebAccess,
        className: "telegram-home-button success",
        children: "🔓 Открыть web‑доступ (5 мин)"
      }
    ) })
  ] }) });
};
export {
  TelegramHome as default
};
//# sourceMappingURL=TelegramHome-CJ4a6mDa.js.map
