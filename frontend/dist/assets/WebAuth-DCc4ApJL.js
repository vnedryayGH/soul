import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, b as usePermissions, i as useLocation, T as Typography, I as Input, l as Space, B as Button, s as staticMethods, c as apiRequest, g as getTelegramUser, m as hasValidAuthToken } from "./index-B4P9h-k1.js";
const WebAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [manualCode, setManualCode] = reactExports.useState("");
  const [manualTgId, setManualTgId] = reactExports.useState(() => {
    try {
      return sessionStorage.getItem("tg_id") || localStorage.getItem("tg_id") || "";
    } catch (e) {
      return "";
    }
  });
  const [verifying, setVerifying] = reactExports.useState(false);
  const { refreshPermissions } = usePermissions();
  const [step, setStep] = reactExports.useState(0);
  const location = useLocation();
  const stepItems = reactExports.useMemo(() => [
    { title: "MiniApp", description: "tg_id найден" },
    { title: "OTP", description: "проверка кода" },
    { title: "Сессия", description: "токен/куки" },
    { title: "Роли", description: "полномочия загружены" }
  ], []);
  const mapHttpError = (status, text) => {
    if (status === 401) return "401: нет cookie/Bearer или неверный OTP";
    if (status === 400) return "400: отсутствует tg_id или тело запроса";
    if (status === 404) return "404: маршрут не найден (проверьте alias /api/web-auth)";
    if (status >= 500) return `5xx: сервер/сеть недоступны (${status})`;
    return `Ошибка ${status}: ${text || "неизвестная ошибка"}`;
  };
  reactExports.useEffect(() => {
    console.log("[WEBAUTH] 🚀 Проверяем авторизацию через Telegram WebApp...");
    const checkTelegramAuth = async () => {
      var _a, _b, _c, _d;
      const ensureSimpleReturn = (target) => {
        try {
          let t = target && decodeURIComponent(target) || "/";
          const url = new URL(t, window.location.origin);
          if (!url.searchParams.get("simple")) {
            url.searchParams.set("simple", "1");
          }
          return url.pathname + (url.search || "");
        } catch (e) {
          return "/?simple=1";
        }
      };
      const urlParams = new URLSearchParams(location.search || window.location.search || "");
      const tgIdParam = urlParams.get("tg_id");
      const userDataParam = urlParams.get("user_data");
      const otpParam = urlParams.get("otp") || urlParams.get("token") || urlParams.get("code");
      const returnTo = urlParams.get("return");
      console.log("[WEBAUTH] 🔍 URL параметры:", { tgIdParam, userDataParam, otp: otpParam ? "найден" : "не найден" });
      if (tgIdParam) {
        try {
          let userData = null;
          if (userDataParam) {
            userData = JSON.parse(userDataParam);
            console.log("[WEBAUTH] ✅ Найдены данные пользователя в URL:", userData);
          } else {
            console.log("[WEBAUTH] ⚠️ user_data отсутствует в URL, продолжаем по tg_id/otp");
          }
          setStep(0);
          if (otpParam) {
            console.log("[WEBAUTH] 🔐 Проверяем OTP токен...");
            setStep(1);
            try {
              const data = await apiRequest("/web-auth/verify-otp", "POST", { tg_id: parseInt(tgIdParam), otp: otpParam });
              console.log("[WEBAUTH] ✅ OTP токен валидный, авторизация успешна");
              if (data.token) {
                try {
                  sessionStorage.setItem("token", data.token);
                } catch (e) {
                }
                try {
                  localStorage.setItem("token", data.token);
                } catch (e) {
                }
                try {
                  window.dispatchEvent(new Event("sp:auth"));
                } catch (e) {
                }
                try {
                  const parts = String(data.token).split(".");
                  if (parts.length >= 2) {
                    const pad = (s) => s + "=".repeat((4 - s.length % 4) % 4);
                    const b64 = pad(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
                    const json = typeof atob === "function" ? decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")) : "";
                    if (json) {
                      const payload = JSON.parse(json);
                      const claimTg = String(payload.tg_id || payload.sub || "");
                      if (claimTg) {
                        try {
                          sessionStorage.setItem("tg_id", claimTg);
                        } catch (e) {
                        }
                      }
                    }
                  }
                } catch (e) {
                }
                setStep(2);
                try {
                  await refreshPermissions();
                  setStep(3);
                } catch (e) {
                }
              }
            } catch (e) {
              const status = e && e.status || 0;
              const raw = e && e.raw || "";
              setError(mapHttpError(status, raw || String((e == null ? void 0 : e.message) || "")));
            }
          }
          try {
            sessionStorage.setItem("tg_id", tgIdParam);
            localStorage.setItem("tg_id", tgIdParam);
          } catch (e) {
          }
          if (userData) {
            try {
              sessionStorage.setItem("telegram_user", JSON.stringify(userData));
              localStorage.setItem("telegram_user", JSON.stringify(userData));
            } catch (e) {
            }
          }
          try {
            window.dispatchEvent(new Event("sp:auth"));
          } catch (e) {
          }
          setLoading(false);
          const cleanUrl = (() => {
            try {
              const u = new URL(window.location.href);
              u.search = "";
              return u.toString();
            } catch (e) {
              return window.location.origin + window.location.pathname;
            }
          })();
          window.history.replaceState({}, document.title, cleanUrl);
          const target = ensureSimpleReturn(returnTo);
          navigate(target.startsWith("/") ? target : "/?simple=1", { replace: true });
          return;
        } catch (e) {
          console.error("[WEBAUTH] ❌ Ошибка парсинга данных из URL:", e);
        }
      }
      const isTelegram = typeof window !== "undefined" && !!((_a = window.Telegram) == null ? void 0 : _a.WebApp);
      if (isTelegram) {
        try {
          (_d = (_c = (_b = window.Telegram) == null ? void 0 : _b.WebApp) == null ? void 0 : _c.ready) == null ? void 0 : _d.call(_c);
        } catch (e) {
        }
        const telegramUser = getTelegramUser();
        if (telegramUser && telegramUser.id) {
          console.log("[WEBAUTH] ✅ Пользователь авторизован через Telegram WebApp:", telegramUser.id);
          sessionStorage.setItem("tg_id", String(telegramUser.id));
          localStorage.setItem("tg_id", String(telegramUser.id));
          sessionStorage.setItem("telegram_user", JSON.stringify(telegramUser));
          localStorage.setItem("telegram_user", JSON.stringify(telegramUser));
          try {
            window.dispatchEvent(new Event("sp:auth"));
          } catch (e) {
          }
        } else {
          console.log("[WEBAUTH] ⚠️ Telegram WebApp без initDataUnsafe.user; отображаем форму без редиректа");
        }
        setLoading(false);
        return;
      }
      const existingTgId = sessionStorage.getItem("tg_id");
      const existingUser = sessionStorage.getItem("telegram_user");
      const tokenOk = hasValidAuthToken();
      if (existingTgId && existingUser && tokenOk) {
        console.log("[WEBAUTH] ✅ Найдены tg_id/user + валидный токен:", existingTgId);
        setLoading(false);
        const usp = new URLSearchParams(location.search || window.location.search || "");
        const target = usp.get("return");
        const path = ensureSimpleReturn(target);
        navigate(path, { replace: true });
        return;
      }
      console.log("[WEBAUTH] ❌ Авторизация не найдена");
      setLoading(false);
      setError("Приложение должно быть запущено из Telegram мини-приложения");
    };
    setTimeout(checkTelegramAuth, 200);
  }, [refreshPermissions]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      backgroundColor: "#f5f5f5"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "18px", color: "#666" }, children: "Проверяем авторизацию..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        ` })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 24,
    padding: "20px",
    backgroundColor: "#f5f5f5",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: "64px",
      height: "64px",
      backgroundColor: "#e3f2fd",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
      fontSize: "32px"
    }, children: "⚠️" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#333",
      margin: "0 0 16px 0"
    }, children: "Требуется авторизация" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      fontSize: "16px",
      color: "#666",
      margin: "0 0 24px 0",
      lineHeight: "1.5"
    }, children: "Это веб-приложение работает только в рамках Telegram мини-приложения. Пожалуйста, откройте приложение через Telegram бота." }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "24px",
      border: "1px solid #ffcdd2"
    }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, justifyContent: "center", fontSize: 12, color: "#555" }, children: stepItems.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity: idx <= step ? 1 : 0.4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 600 }, children: [
        idx + 1,
        "."
      ] }),
      " ",
      it.title
    ] }, it.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "left"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#333",
        margin: "0 0 12px 0"
      }, children: "📱 Как открыть приложение:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { style: {
        margin: 0,
        paddingLeft: "20px",
        color: "#555",
        lineHeight: "1.6"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Откройте Telegram" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Откройте мини‑приложение из Telegram (кнопка бота)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Запустите мини-приложение" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Приложение откроется автоматически" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 24, textAlign: "left" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, style: { marginTop: 0 }, children: "Вход по одноразовому коду" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", style: { marginBottom: 8 }, children: "Если у вас есть одноразовый код (token/code/otp), введите его ниже. Мы сверим код на сервере и выполним вход." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: 8, marginBottom: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ваш Telegram ID (число)", value: manualTgId, onChange: (e) => setManualTgId(e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Введите одноразовый код", value: manualCode, onChange: (e) => setManualCode(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", loading: verifying, onClick: async () => {
          if (!manualCode.trim()) {
            staticMethods.warning("Введите код");
            return;
          }
          const tgIdRaw = (manualTgId || "").trim() || sessionStorage.getItem("tg_id") || localStorage.getItem("tg_id") || "";
          if (!tgIdRaw) {
            staticMethods.warning("Укажите ваш Telegram ID");
            return;
          }
          const tgIdNum = Number.parseInt(tgIdRaw, 10);
          if (!Number.isFinite(tgIdNum)) {
            staticMethods.warning("Telegram ID должен быть числом");
            return;
          }
          try {
            setVerifying(true);
            setStep(1);
            const resp = await apiRequest("/web-auth/verify-otp", "POST", { tg_id: tgIdNum, otp: manualCode.trim() });
            if (resp == null ? void 0 : resp.token) {
              try {
                sessionStorage.setItem("token", resp.token);
              } catch (e) {
              }
              ;
              try {
                localStorage.setItem("token", resp.token);
              } catch (e) {
              }
              ;
            }
            try {
              sessionStorage.setItem("tg_id", String(tgIdNum));
              localStorage.setItem("tg_id", String(tgIdNum));
            } catch (e) {
            }
            setStep(2);
            try {
              await refreshPermissions();
              setStep(3);
            } catch (e) {
            }
            staticMethods.success("Авторизация успешна");
            const usp = new URLSearchParams(window.location.search);
            const target = usp.get("return");
            const ensure = (t) => {
              try {
                let path = t && decodeURIComponent(t) || "/";
                const u = new URL(path, window.location.origin);
                if (!u.searchParams.get("simple")) u.searchParams.set("simple", "1");
                return u.pathname + (u.search || "");
              } catch (e) {
                return "/?simple=1";
              }
            };
            window.location.replace(ensure(target));
          } catch (e) {
            const status = e && e.status || 0;
            const raw = e && e.raw || "";
            setError(mapHttpError(status, raw || String((e == null ? void 0 : e.message) || "")));
            staticMethods.error("Код не принят");
          } finally {
            setVerifying(false);
          }
        }, children: "Войти" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 16, textAlign: "left" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, style: { marginTop: 0 }, children: "Ввести JWT токен вручную" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", style: { marginBottom: 8 }, children: "Для диагностики/аварийного входа вставьте JWT. Токен будет сохранён в sessionStorage и применён к запросам (Authorization Bearer + cookie-сессия)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input.Password, { placeholder: "Пастните JWT здесь", id: "sp_manual_jwt_input" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
          var _a;
          try {
            const el = document.getElementById("sp_manual_jwt_input");
            const tok = ((_a = el == null ? void 0 : el.value) == null ? void 0 : _a.trim()) || "";
            if (!tok) {
              staticMethods.warning("Вставьте JWT");
              return;
            }
            try {
              sessionStorage.setItem("token", tok);
            } catch (e) {
            }
            try {
              localStorage.setItem("token", tok);
            } catch (e) {
            }
            try {
              const parts = tok.split(".");
              if (parts.length >= 2) {
                const pad = (s) => s + "=".repeat((4 - s.length % 4) % 4);
                const b64 = pad(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
                const json = typeof atob === "function" ? decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")) : "";
                if (json) {
                  const payload = JSON.parse(json);
                  const claimTg = String(payload.tg_id || payload.sub || "");
                  if (claimTg) {
                    try {
                      sessionStorage.setItem("tg_id", claimTg);
                      localStorage.setItem("tg_id", claimTg);
                    } catch (e) {
                    }
                  }
                }
              }
            } catch (e) {
            }
            await refreshPermissions();
            staticMethods.success("JWT применён, роли обновлены");
          } catch (e) {
            staticMethods.error("Не удалось применить токен");
          }
        }, children: "Применить" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "24px",
      padding: "12px",
      backgroundColor: "#e8f5e8",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#2e7d32"
    }, children: [
      "💡 ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Безопасность:" }),
      " Приложение получает доступ только к вашим данным в Telegram и сохраняет их только на время сессии."
    ] })
  ] }) });
};
export {
  WebAuth as default
};
//# sourceMappingURL=WebAuth-DCc4ApJL.js.map
