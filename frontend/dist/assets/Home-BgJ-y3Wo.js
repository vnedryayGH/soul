import { j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, B as Button, T as Typography, l as Space } from "./index-B4P9h-k1.js";
import { R as RefIcon } from "./QuestionCircleOutlined-NaBnemTa.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { R as RefIcon$1 } from "./RobotOutlined-B-2S_nNK.js";
import { R as RefIcon$2 } from "./FileTextOutlined-lwBP-Cdj.js";
import { R as RefIcon$3 } from "./MessageOutlined-BU8XjoXo.js";
import { R as RefIcon$4 } from "./SettingOutlined-COiCZpX-.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon$5 } from "./BulbOutlined-DdwdCCj7.js";
import { R as RefIcon$6 } from "./RocketOutlined-BJpi1OW_.js";
import { R as RefIcon$7 } from "./CrownOutlined-D9QrRtN8.js";
import { R as RefIcon$8 } from "./HeartOutlined-BTgLj15z.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./AntdIcon-bc3Msg1y.js";
import "./Skeleton-D3e3aC7P.js";
import "./index-BlJydARW.js";
const { Title, Paragraph, Text } = Typography;
const Home = ({ onPromptSelect, selectedPrompt }) => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container home-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      marginBottom: "var(--sp-spacing-sm)",
      textAlign: "center",
      padding: "var(--sp-spacing-xs)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "default",
        size: "middle",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}),
        onClick: () => navigate("/help"),
        style: {
          background: "var(--sp-bg-secondary)",
          border: "1px solid var(--sp-border-primary)",
          borderRadius: "var(--sp-border-radius-sm)",
          color: "var(--sp-text-primary)"
        },
        children: "📚 Инструкция"
      }
    ) }),
    selectedPrompt && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        style: {
          marginBottom: "var(--sp-spacing-lg)",
          background: "var(--sp-bg-card)",
          border: "1px solid var(--sp-border-primary)",
          borderRadius: "var(--sp-border-radius-md)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: selectedPrompt.icon_color || "var(--primary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px"
          }, children: "🤖" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 4, style: { margin: "0 0 var(--sp-spacing-xs) 0", color: "var(--sp-text-primary)" }, children: [
              "Активный промпт: ",
              selectedPrompt.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { style: { color: "var(--sp-text-secondary)" }, children: selectedPrompt.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "primary",
              onClick: () => navigate("/prompts"),
              style: {
                background: "linear-gradient(135deg, var(--sp-color-primary), var(--sp-color-primary-hover))",
                border: "none",
                borderRadius: "var(--sp-border-radius-md)"
              },
              children: "Изменить"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { style: { color: "var(--sp-color-primary)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LLM настройки" })
          ] }),
          hoverable: true,
          onClick: () => navigate("/llm-settings"),
          style: {
            cursor: "pointer",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          className: "feature-card unified-card",
          "data-category": "llm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)", fontSize: "var(--sp-font-size-base)", lineHeight: "1.6" }, children: "Выберите и настройте провайдера искусственного интеллекта для вашего Telegram бота." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                block: true,
                style: {
                  background: "linear-gradient(135deg, var(--sp-color-primary), var(--sp-color-primary-hover))",
                  border: "none",
                  borderRadius: "var(--sp-border-radius-md)"
                },
                children: "Настроить LLM"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { color: "var(--sp-color-secondary)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Личности" })
          ] }),
          hoverable: true,
          onClick: () => navigate("/prompts"),
          style: {
            cursor: "pointer",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          className: "feature-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)", fontSize: "var(--sp-font-size-base)", lineHeight: "1.6" }, children: "Выберите личности и стили общения для настройки вашего AI-компаньона." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                block: true,
                style: {
                  background: "linear-gradient(135deg, var(--sp-color-secondary), var(--sp-color-secondary-hover))",
                  border: "none",
                  borderRadius: "var(--sp-border-radius-md)"
                },
                children: "Выбрать промпты"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { style: { color: "var(--sp-color-accent)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Чат" })
          ] }),
          hoverable: true,
          onClick: () => navigate("/chat"),
          style: {
            cursor: "pointer",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          className: "feature-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)", fontSize: "var(--sp-font-size-base)", lineHeight: "1.6" }, children: "Тестируйте общение с AI прямо в Mini App перед использованием в Telegram." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                block: true,
                style: {
                  background: "linear-gradient(135deg, var(--sp-color-accent), var(--sp-color-accent-hover))",
                  border: "none",
                  borderRadius: "var(--sp-border-radius-md)"
                },
                children: "Открыть чат"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { style: { color: "var(--primary-color)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💬 Чат в приложении" })
          ] }),
          hoverable: true,
          onClick: () => navigate("/mini-chat"),
          style: {
            cursor: "pointer",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          className: "feature-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)", fontSize: "var(--sp-font-size-base)", lineHeight: "1.6" }, children: "Полноценный чат с возможностью удаления сообщений прямо в мини-приложении. Обходит ограничения Telegram!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                block: true,
                style: {
                  background: "linear-gradient(135deg, var(--sp-color-primary), var(--sp-color-accent))",
                  border: "none",
                  borderRadius: "var(--sp-border-radius-md)"
                },
                children: "🚀 Открыть чат в приложении"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, { style: { color: "var(--sp-color-success)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Настройки" })
          ] }),
          hoverable: true,
          onClick: () => navigate("/settings"),
          style: {
            cursor: "pointer",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          className: "feature-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)", fontSize: "var(--sp-font-size-base)", lineHeight: "1.6" }, children: "Управляйте профилем, подпиской и общими настройками приложения." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                block: true,
                style: {
                  background: "linear-gradient(135deg, var(--sp-color-success), var(--sp-color-success-hover))",
                  border: "none",
                  borderRadius: "var(--sp-border-radius-md)"
                },
                children: "Настройки"
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "Как это работает",
        description: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "1rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { style: { margin: 0, paddingLeft: "1.5rem", lineHeight: "1.8" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Настройте LLM провайдера" }),
            " - выберите между GigaChat, OpenAI или DeepSeek"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Выберите промпты" }),
            " - настройте стиль общения и личности"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Общайтесь в Telegram" }),
            " - ваш бот будет использовать выбранные настройки"
          ] })
        ] }) }),
        type: "info",
        showIcon: true,
        style: {
          marginTop: "1.5rem",
          borderRadius: "var(--sp-border-radius-md)",
          border: "1px solid var(--sp-border-secondary)"
        },
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, { style: { color: "var(--sp-color-accent)" } })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginTop: "1.5rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "primary",
        size: "large",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, {}),
        onClick: () => navigate("/llm-settings"),
        style: {
          background: "linear-gradient(135deg, var(--sp-color-primary), var(--sp-color-secondary))",
          border: "none",
          borderRadius: "var(--sp-border-radius-md)",
          padding: "var(--sp-spacing-md) var(--sp-spacing-xl)",
          fontSize: "var(--sp-font-size-lg)",
          height: "auto"
        },
        children: "Начать настройку"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], style: { marginTop: "2rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          style: {
            textAlign: "center",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, { style: {
              fontSize: "var(--sp-font-size-2xl)",
              color: "var(--sp-color-accent)",
              marginBottom: "var(--sp-spacing-md)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { color: "var(--sp-text-primary)" }, children: "Премиум функции" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)" }, children: "Расширенные возможности для профессионального использования" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          style: {
            textAlign: "center",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, { style: {
              fontSize: "var(--sp-font-size-2xl)",
              color: "var(--sp-color-success)",
              marginBottom: "var(--sp-spacing-md)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { color: "var(--sp-text-primary)" }, children: "Персональный подход" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)" }, children: "Настройка под ваши индивидуальные потребности и стиль" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          style: {
            textAlign: "center",
            borderRadius: "var(--sp-border-radius-md)",
            border: "1px solid var(--sp-border-secondary)",
            background: "var(--sp-bg-card)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, { style: {
              fontSize: "var(--sp-font-size-2xl)",
              color: "var(--sp-color-primary)",
              marginBottom: "var(--sp-spacing-md)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, style: { color: "var(--sp-text-primary)" }, children: "Умные решения" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { style: { color: "var(--sp-text-secondary)" }, children: "ИИ-помощник для решения сложных задач и творческих проектов" })
          ]
        }
      ) })
    ] })
  ] });
};
export {
  Home as default
};
//# sourceMappingURL=Home-BgJ-y3Wo.js.map
