import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { T as Typography, p as Tag, B as Button, l as Space, aB as Tooltip } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { R as RefIcon } from "./FileTextOutlined-lwBP-Cdj.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import { R as RefIcon$1 } from "./StarOutlined-Cal6gFaE.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { A as Avatar } from "./index-B3Kptpnc.js";
import { B as Badge } from "./index-DDcrJiGl.js";
import { R as RefIcon$2 } from "./InfoCircleOutlined-BDFvYUED.js";
import "./Skeleton-D3e3aC7P.js";
import "./AntdIcon-bc3Msg1y.js";
import "./context-CGIstv1h.js";
import "./index-BlJydARW.js";
import "./index-C3XsEteC.js";
const { Title, Text, Paragraph } = Typography;
const Prompts = ({
  prompts: initialPrompts,
  selectedPrompt,
  onPromptSelect,
  onPromptStatusChange,
  onSetActivePersonality,
  disableBasePersonality,
  onDisableBasePersonalityChange
}) => {
  var _a, _b;
  const [modalPrompt, setModalPrompt] = reactExports.useState(null);
  const [isModalVisible, setIsModalVisible] = reactExports.useState(false);
  const [pipeline, setPipeline] = reactExports.useState(null);
  const [pipelineError, setPipelineError] = reactExports.useState(null);
  const [hasTgId, setHasTgId] = reactExports.useState(false);
  const isTelegramMiniApp = (() => {
    var _a2;
    try {
      return !!((_a2 = window.Telegram) == null ? void 0 : _a2.WebApp);
    } catch (e) {
      return false;
    }
  })();
  const getModalContainerStyles = () => ({
    padding: "var(--sp-spacing-md)",
    background: "var(--sp-bg-card)",
    borderRadius: "var(--sp-border-radius)",
    border: "1px solid var(--sp-border-primary)"
  });
  reactExports.useEffect(() => {
    if (selectedPrompt && selectedPrompt.key) {
      console.log(`🔄 Загружаем состояние отключения базовой личности для ${selectedPrompt.name}`);
    }
  }, [selectedPrompt]);
  reactExports.useEffect(() => {
    var _a2, _b2, _c, _d;
    const loadPipeline = async () => {
      try {
        setPipelineError(null);
        const resp = await fetch("/api/llm/functions", { headers: { "Content-Type": "application/json" } });
        if (!resp.ok) throw new Error(String(resp.status));
        const data = await resp.json();
        const chatFn = Array.isArray(data) ? data.find((f) => f.function_name === "chat") : null;
        if (chatFn && chatFn.settings_json) {
          try {
            const parsed = JSON.parse(chatFn.settings_json);
            setPipeline(parsed);
          } catch (e) {
            setPipeline({ raw: chatFn.settings_json });
          }
        } else {
          setPipeline(null);
        }
      } catch (e) {
        setPipelineError("Не удалось загрузить конфигурацию пайплайна чата");
      }
    };
    try {
      const sid = sessionStorage.getItem("tg_id");
      const wa = (_d = (_c = (_b2 = (_a2 = window.Telegram) == null ? void 0 : _a2.WebApp) == null ? void 0 : _b2.initDataUnsafe) == null ? void 0 : _c.user) == null ? void 0 : _d.id;
      setHasTgId(!!(sid || wa));
    } catch (e) {
      setHasTgId(false);
    }
    loadPipeline();
  }, []);
  const showPromptDetails = (prompt) => {
    setModalPrompt(prompt);
    setIsModalVisible(true);
  };
  const handlePromptSelect = (prompt) => {
    onPromptSelect(prompt);
    setIsModalVisible(false);
  };
  const handleToggleActive = async (prompt, checked) => {
    try {
      console.log(`🔄 Переключаем промпт ${prompt.name}: ${checked}`);
      console.log(`📋 Детали промпта:`, {
        id: prompt.id,
        key: prompt.key,
        name: prompt.name,
        current_is_active: prompt.is_active,
        new_state: checked
      });
      if (checked && prompt.key) {
        console.log(`🚀 Активируем промпт "${prompt.name}" с ключом "${prompt.key}"`);
        await onSetActivePersonality(prompt.key);
        console.log(`✅ Промпт "${prompt.name}" активирован`);
      } else {
        console.log(`🔄 Деактивируем промпт "${prompt.name}", переключаем на базовый`);
        await onSetActivePersonality("prompt-4");
        console.log(`✅ Активирован базовый промпт "SoulPulse"`);
      }
    } catch (error) {
      console.error("❌ Ошибка при переключении промпта:", error);
    }
  };
  const renderPromptCard = (prompt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: `prompt-card ${prompt.is_active ? "active" : ""} ${prompt.is_base ? "premium" : ""}`,
      styles: { body: { padding: 0 } },
      style: {
        // Прокидываем акцент из цвета промпта в CSS переменную
        ["--card-accent"]: prompt.icon_color || "#6d5efc"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompt-content", style: { padding: "8px 12px", boxSizing: "border-box", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              size: 34,
              className: "prompt-avatar",
              style: {
                backgroundColor: prompt.icon_color || "#6366f1"
              },
              children: prompt.key === "digital_employee:eidos" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/eidos_icon.svg", alt: "Eidos", style: { width: 22, height: 22 } }) : prompt.icon_emoji ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--sp-font-size-lg)" }, children: prompt.icon_emoji }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { fontSize: "var(--sp-font-size-lg)" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-title-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, className: "prompt-title", style: { marginBottom: 0, fontSize: 16 }, children: prompt.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-tags", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: prompt.is_active ? "green" : "default", style: { margin: 0, fontSize: 10, padding: "0 6px", height: 18 }, children: prompt.is_active ? "Активен" : "Неактивен" }),
              prompt.is_base && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tag,
                {
                  color: "blue",
                  style: { margin: 0, fontSize: 10, padding: "0 6px", height: 18 },
                  children: "Базовый"
                }
              ),
              prompt.can_work_alone && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "orange", style: { margin: 0, fontSize: 10, padding: "0 6px", height: 18 }, children: "Самостоятельный" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tag,
                {
                  color: "purple",
                  style: { margin: 0, fontSize: 10, padding: "0 6px", height: 18 },
                  children: prompt.category
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Paragraph,
          {
            style: {
              margin: "2px 0 4px 0",
              color: "var(--sp-text-secondary)",
              fontSize: "12px",
              lineHeight: "1.2",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            },
            children: prompt.description
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: "small", children: [
            prompt.usage_count && /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Количество использований", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                count: prompt.usage_count,
                size: "small",
                style: {
                  backgroundColor: "var(--sp-text-secondary)",
                  color: "var(--sp-bg-card)"
                }
              }
            ) }),
            prompt.rating && /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Рейтинг", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: "small", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { color: "var(--sp-color-warning)", fontSize: 12 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: 11, color: "var(--sp-text-secondary)" }, children: prompt.rating })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: prompt.is_active || false,
                onChange: (checked) => {
                  console.log(`🔄 Switch clicked for ${prompt.name}: checked=${checked}, current is_active=${prompt.is_active}`);
                  handleToggleActive(prompt, checked);
                },
                size: "small",
                onClick: (e) => {
                  console.log(`🖱️ Switch clicked for ${prompt.name}`);
                  if (e && e.stopPropagation) {
                    e.stopPropagation();
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "text",
                size: "small",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { fontSize: "var(--sp-font-size-base)", color: "var(--sp-color-info)" } }),
                onClick: (e) => {
                  e.stopPropagation();
                  showPromptDetails(prompt);
                },
                style: {
                  padding: "4px 8px",
                  minWidth: "28px",
                  minHeight: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }
              }
            )
          ] })
        ] })
      ] }) })
    },
    prompt.id
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container prompts-page", style: { overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", height: "100%", boxSizing: "border-box", maxWidth: "100%" }, children: [
    isTelegramMiniApp && !hasTgId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { type: "warning", message: "Данные Telegram пользователя не получены", description: "Откройте мини‑приложение через кнопку бота, затем вернитесь на эту страницу.", showIcon: true }) }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "soulpulse-header", style: { padding: "6px 12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { className: "soulpulse-title", style: { margin: 0, fontSize: 16, display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/android-chrome-192x192.png?v=2", alt: "SoulPulse", style: { width: 18, height: 18, borderRadius: 4, marginRight: 8 } }),
        "Личности"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { className: "soulpulse-subtitle", style: { fontSize: 12 }, children: "Выберите AI-личность для общения" }),
      selectedPrompt && /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { style: { display: "block", fontSize: 12, color: "var(--sp-text-secondary)", marginTop: 4 }, children: [
        "Активная: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "var(--sp-text-primary)" }, children: selectedPrompt.name })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "var(--sp-spacing-xs)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        type: "info",
        message: "Пояснение",
        description: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Активная личность определяет стиль и память." }),
        showIcon: true,
        style: { marginBottom: 8, padding: "8px 10px" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: initialPrompts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prompts-grid", children: initialPrompts.map((prompt) => renderPromptCard(prompt)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { textAlign: "center", padding: "40px 20px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { fontSize: "48px", marginBottom: "16px", color: "var(--sp-text-tertiary)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "16px", color: "var(--sp-text-secondary)" }, children: "Нет доступных промптов" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "14px", color: "var(--sp-text-tertiary)" }, children: "Личности загружаются из базы данных" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              size: 32,
              style: {
                backgroundColor: (modalPrompt == null ? void 0 : modalPrompt.icon_color) || "#6366f1"
              },
              children: (modalPrompt == null ? void 0 : modalPrompt.key) === "digital_employee:eidos" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/eidos_icon.svg", alt: "Eidos", style: { width: 20, height: 20 } }) : (modalPrompt == null ? void 0 : modalPrompt.icon_emoji) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "20px" }, children: modalPrompt.icon_emoji }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: isTelegramMiniApp ? "var(--sp-text-primary)" : "var(--text-primary)"
          }, children: modalPrompt == null ? void 0 : modalPrompt.name })
        ] }),
        open: isModalVisible,
        onCancel: () => setIsModalVisible(false),
        footer: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsModalVisible(false), children: "Закрыть" }, "cancel"),
          modalPrompt && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "primary",
              onClick: () => handlePromptSelect(modalPrompt),
              disabled: modalPrompt.is_active,
              children: modalPrompt.is_active ? "Уже активен" : "Использовать промпт"
            },
            "select"
          )
        ],
        width: 700,
        style: {
          top: 20
        },
        className: isTelegramMiniApp ? "telegram-mini-app-modal" : "web-modal",
        children: modalPrompt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 0" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "20px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "purple", style: { margin: 0 }, children: modalPrompt.category }),
              modalPrompt.is_base && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", style: { margin: 0 }, children: "Базовый" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: modalPrompt.is_active ? "success" : "default", style: { margin: 0 }, children: modalPrompt.is_active ? "Активен" : "Неактивен" }),
              modalPrompt.kind && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "orange", style: { margin: 0 }, children: modalPrompt.kind })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { fontSize: "16px", lineHeight: "1.6", marginBottom: "16px" }, children: modalPrompt.description }),
            (modalPrompt == null ? void 0 : modalPrompt.key) === "digital_employee:eidos" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: (e) => {
              e.stopPropagation();
              try {
                window.open("/docs/ONBOARDING_EIDOS_PASSPORT.md", "_blank");
              } catch (e2) {
              }
            }, children: "Паспорт Эйдоса" }) }),
            modalPrompt.features && modalPrompt.features.trim() !== "" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, style: { fontSize: "14px", color: "var(--text-primary)" }, children: "Функции:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "8px" }, children: (() => {
                try {
                  const features = JSON.parse(modalPrompt.features);
                  if (Array.isArray(features) && features.length > 0) {
                    return features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", style: { margin: "4px", fontSize: "12px" }, children: feature }, index));
                  }
                } catch (e) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "13px", color: "var(--sp-text-secondary)" }, children: modalPrompt.features });
                }
                return null;
              })() })
            ] }),
            modalPrompt.target_audience && modalPrompt.target_audience.trim() !== "" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, style: { fontSize: "14px", color: "var(--text-primary)" }, children: "Целевая аудитория:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "13px", color: "var(--sp-text-secondary)", display: "block", marginTop: "8px" }, children: modalPrompt.target_audience })
            ] }),
            modalPrompt.activation_triggers && modalPrompt.activation_triggers.trim() !== "" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, style: { fontSize: "14px", color: "var(--text-primary)" }, children: "Активация:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "8px" }, children: (() => {
                try {
                  const triggers = JSON.parse(modalPrompt.activation_triggers);
                  if (Array.isArray(triggers) && triggers.length > 0) {
                    return triggers.map((trigger, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", style: { margin: "4px", fontSize: "12px" }, children: trigger }, index));
                  }
                } catch (e) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "13px", color: "var(--sp-text-secondary)" }, children: modalPrompt.activation_triggers });
                }
                return null;
              })() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { style: { margin: "16px 0" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
              modalPrompt.key && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Ключ:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "12px", fontFamily: "monospace" }, children: modalPrompt.key })
              ] }),
              modalPrompt.kind && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Тип:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: modalPrompt.kind })
              ] }),
              modalPrompt.locale && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Локаль:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: modalPrompt.locale })
              ] }),
              modalPrompt.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Категория:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: modalPrompt.category })
              ] }),
              modalPrompt.usage_count && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Использований:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: modalPrompt.usage_count })
              ] }),
              modalPrompt.rating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Рейтинг:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { color: "var(--sp-color-warning)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: modalPrompt.rating })
                ] })
              ] }),
              modalPrompt.created_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Создан:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: new Date(modalPrompt.created_at).toLocaleDateString("ru-RU") })
              ] }),
              modalPrompt.updated_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Обновлен:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: new Date(modalPrompt.updated_at).toLocaleDateString("ru-RU") })
              ] }),
              modalPrompt.memory_algorithm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1 / -1" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Алгоритм памяти:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "12px", fontFamily: "monospace" }, children: modalPrompt.memory_algorithm })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: getModalContainerStyles(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: ((_a = initialPrompts.find((p) => p.key === modalPrompt.key)) == null ? void 0 : _a.is_active) || false,
                  onChange: async (checked) => {
                    try {
                      if (checked && modalPrompt.key) {
                        await onSetActivePersonality(modalPrompt.key);
                        console.log(`✅ Промпт "${modalPrompt.name}" активирован`);
                      } else {
                        await onSetActivePersonality("prompt-4");
                        console.log(`✅ Активирован базовый промпт "SoulPulse"`);
                      }
                    } catch (error) {
                      console.error("Ошибка при изменении статуса промпта:", error);
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Активировать промпт" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "14px", color: "var(--sp-text-secondary)" }, children: "Активированный промпт будет использоваться при общении с AI" })
          ] }),
          modalPrompt.key !== "prompt-4" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            ...getModalContainerStyles(),
            marginTop: "16px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: disableBasePersonality,
                  onChange: async (checked) => {
                    onDisableBasePersonalityChange(checked);
                    console.log(`🔄 Отключение базовой личности: ${checked}`);
                    if (selectedPrompt && selectedPrompt.key) {
                      try {
                        console.log(`💾 Синхронизируем отключение базовой личности с БД...`);
                        await onSetActivePersonality(selectedPrompt.key, checked);
                        console.log(`✅ Отключение базовой личности синхронизировано с БД`);
                      } catch (error) {
                        console.error("❌ Ошибка синхронизации с БД:", error);
                        onDisableBasePersonalityChange(!checked);
                      }
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Отключить базовую личность" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "14px", color: "var(--sp-text-secondary)" }, children: modalPrompt.can_work_alone ? 'Этот промпт может работать самостоятельно. При отключении базовой личности будет использоваться только выбранная личность без "SoulPulse".' : "Этот промпт предназначен для работы с базовой личностью. Принудительное отключение может снизить качество ответов." })
          ] }),
          modalPrompt.key && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            ...getModalContainerStyles(),
            marginTop: "16px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: ((_b = initialPrompts.find((p) => p.key === modalPrompt.key)) == null ? void 0 : _b.deep_memory_only) || false,
                  onChange: async (checked) => {
                    try {
                      const tgId = sessionStorage.getItem("tg_id");
                      if (!tgId) throw new Error("Unauthorized");
                      const formData = new FormData();
                      formData.append("deep_memory_only", String(checked));
                      const resp = await fetch("/api/miniapp/prompts/update-settings", {
                        method: "POST",
                        body: formData,
                        headers: { "X-Telegram-User-ID": String(tgId) }
                      });
                      if (!resp.ok) throw new Error(String(resp.status));
                      console.log("✅ deep_memory_only сохранён");
                    } catch (e) {
                      console.error("❌ Ошибка сохранения deep_memory_only", e);
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Только глубинная память" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { fontSize: "14px", color: "var(--sp-text-secondary)" }, children: "Недавняя история учитывается только после активации текущей личности; остальной контекст подбирается по ключевым словам/эмоциям/датам." })
          ] })
        ] })
      }
    )
  ] });
};
export {
  Prompts as default
};
//# sourceMappingURL=Prompts-D8a28S7c.js.map
