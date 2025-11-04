import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { T as Typography, B as Button, aE as Collapse, p as Tag } from "./index-B4P9h-k1.js";
import { R as RefIcon } from "./BookOutlined-BSbjz8mi.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { R as RefIcon$1 } from "./ExclamationCircleOutlined-Ct9zijvs.js";
import { R as RefIcon$2 } from "./MessageOutlined-BU8XjoXo.js";
import { R as RefIcon$3 } from "./DeleteOutlined-CXvGRz1h.js";
import { R as RefIcon$4 } from "./RobotOutlined-B-2S_nNK.js";
import { R as RefIcon$5 } from "./SafetyOutlined-BeV9iQ8R.js";
import { R as RefIcon$6 } from "./ThunderboltOutlined-DKtcPo4_.js";
import { D as Divider } from "./index-B_ub_kOm.js";
import { R as RefIcon$7 } from "./BulbOutlined-DdwdCCj7.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { R as RefIcon$8 } from "./WarningOutlined-D-UZyf1F.js";
import "./AntdIcon-bc3Msg1y.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
import "./index-BlJydARW.js";
const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;
const Help = () => {
  const [isDeletionModalOpen, setIsDeletionModalOpen] = reactExports.useState(false);
  const handleShowDeletionWarning = () => {
    setIsDeletionModalOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "help-page", style: { padding: "20px", maxWidth: "800px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "30px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { marginRight: "10px" } }),
        "Инструкция по работе с SoulPulse"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Полное руководство по использованию интеллектуального ИИ-ассистента" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          style: {
            marginTop: "20px",
            marginBottom: "20px",
            background: "var(--sp-bg-secondary)",
            border: "1px solid var(--sp-border-primary)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "🤖 Что такое SoulPulse?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "SoulPulse" }),
              " — это продвинутый ИИ-ассистент с персонализированными личностями, работающий через Telegram бот и современное мини-приложение."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 5, children: "✨ Ключевые возможности:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { marginLeft: "20px", lineHeight: "1.8" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "🧠 10+ ИИ-личностей" }),
                " — от деловых помощников до творческих партнеров"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "💬 Двойной интерфейс" }),
                " — общение в Telegram + полный функционал в мини-апп"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "🗑️ Умное управление историей" }),
                " — реальное удаление только в мини-приложении"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "📊 Продвинутая аналитика" }),
                " — анализ эмоций, ключевые слова, напоминания"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "⚙️ Гибкие настройки" }),
                " — выбор LLM провайдера, персонализация"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "🎨 Современный UI" }),
                " — темная/светлая тема, адаптация под Telegram"
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Alert,
      {
        message: "🚨 ВАЖНО: Удаление сообщений работает ТОЛЬКО в мини-приложении!",
        description: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "❌ Удаление в Telegram НЕ работает с нашей системой!" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "✅ ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Для реального удаления используйте ТОЛЬКО мини-приложение!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            'В мини-апп есть кнопка "Очистить историю" — она работает правильно.'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "🔄 Удаление в Telegram боте остается только в интерфейсе, но сообщения сохраняются в базе данных." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "primary",
              danger: true,
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}),
              onClick: handleShowDeletionWarning,
              style: { marginTop: "10px" },
              children: "Подробнее об удалении"
            }
          )
        ] }),
        type: "warning",
        showIcon: true,
        style: { marginBottom: "30px" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Collapse,
      {
        defaultActiveKey: ["1"],
        size: "large",
        style: { marginBottom: "20px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { style: { marginRight: "8px" } }),
                "💬 Общение с ботом"
              ] }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Как общаться:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Просто напишите сообщение в чат с ботом - он ответит",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Поддерживаются разные личности AI",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Автоматический анализ эмоций и ключевых слов",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Система напоминаний и работа с памятью"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Настройки личностей:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    '• Перейдите в раздел "Личности" для выбора AI-помощника',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Можно выбрать базовую личность или дополнительную",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Каждая личность имеет свои особенности и стиль общения"
                  ] })
                ] })
              ]
            },
            "1"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ff4d4f" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { style: { marginRight: "8px" } }),
                "🗑️ Удаление сообщений (ТОЛЬКО в мини-апп!)"
              ] }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Alert,
                  {
                    message: "❌ Удаление в Telegram боте НЕ работает! ✅ Используйте мини-приложение!",
                    type: "warning",
                    style: { marginBottom: "15px" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "✅ Правильный способ - в мини-приложении:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "Рекомендуемый способ:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Откройте мини-приложение (кнопка "Меню")',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Перейдите в раздел "Чат в приложении"',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Используйте кнопку "🗑️ Очистить историю"',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• ✅ Это единственный способ реального удаления!"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "❌ Что НЕ работает:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "red", children: "Не используйте:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Удаление сообщений в Telegram боте",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Команды /delete_last, /clear_chat (устарели)",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Долгий тап → Delete в Telegram",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• ⚠️ Эти способы НЕ удаляют из базы данных!"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "🔄 Как это работает:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Telegram бот и мини-приложение используют разные механизмы",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Только мини-приложение может реально удалять из БД",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Удаление в Telegram остается только визуальным",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Для полной очистки всегда используйте мини-апп"
                  ] })
                ] })
              ]
            },
            "2"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, { style: { marginRight: "8px" } }),
                "📱 Команды бота"
              ] }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Основные команды:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/help" }),
                    " или ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/start" }),
                    " - полная справка",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/commands" }),
                    " - список всех команд"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Команды удаления:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/delete_last N" }),
                    " - удалить последние N сообщений",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/confirm_single_delete ID" }),
                    " - безопасное удаление одного",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/clear_chat" }),
                    " - очистить весь чат"
                  ] })
                ] })
              ]
            },
            "3"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, { style: { marginRight: "8px" } }),
                "🛡️ Безопасность"
              ] }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Защита данных:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Можно удалять только свои собственные сообщения",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Проверка авторизации для всех операций",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Каскадное удаление всех связанных данных",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Все операции логируются для безопасности"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Меры предосторожности:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Двойное подтверждение для массового удаления",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Четкие предупреждения о необратимости",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Лимиты на количество удаляемых сообщений",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Возможность отмены на любом этапе"
                  ] })
                ] })
              ]
            },
            "4"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, { style: { marginRight: "8px" } }),
                "⚙️ Настройки и персонализация"
              ] }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "LLM настройки:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Выбор провайдера LLM (DeepSeek, OpenAI, GigaChat)",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Настройка моделей для разных функций",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Управление токенами и стоимостью",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Персональные предпочтения"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Темы оформления:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Светлая и темная темы",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Автоматическое переключение",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Персонализация цветов",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Адаптация под Telegram"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Личности AI:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    "• Более 6 различных личностей",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Базовые и дополнительные режимы",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Специализация по задачам",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Эмоциональный анализ"
                  ] })
                ] })
              ]
            },
            "5"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, { style: { marginRight: "8px" } }),
                "📖 Детальные инструкции по использованию"
              ] }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "🚀 Быстрый старт:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "1. Выберите ИИ-личность:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Перейдите в раздел "Личности"',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Выберите подходящую личность (деловая, творческая, техническая)",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Активируйте её нажатием на карточку",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "2. Настройте LLM провайдера:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Откройте "Настройки ИИ"',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Выберите между DeepSeek, OpenAI или GigaChat",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Проверьте API ключи и лимиты",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "3. Начните общение:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Используйте "Чат в приложении" для полного функционала',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Или пишите прямо в Telegram боте",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• ИИ будет отвечать согласно выбранной личности"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "🎯 Продвинутые возможности:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "📊 Аналитика и статистика:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• Раздел "Ключевые слова" — анализ тем разговоров',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '• "Даты и напоминания" — управление календарем',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Эмоциональный анализ сообщений",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "⚙️ Персонализация:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Настройка параметров ИИ (температура, длина ответов)",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Выбор стиля общения для каждой личности",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Управление памятью и контекстом диалогов",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "🔒 Управление данными:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Просмотр истории всех диалогов",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Экспорт важных разговоров",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Настройки приватности и безопасности"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", style: { marginBottom: "15px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "💡 Советы по эффективному использованию:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "🧠 Выбор личности:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Деловая — для рабочих задач и планирования",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Творческая — для генерации идей и креатива",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Техническая — для программирования и анализа",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Эмоциональная — для поддержки и общения",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "💬 Качество диалогов:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Формулируйте четкие и конкретные вопросы",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Используйте контекст предыдущих сообщений",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Экспериментируйте с разными стилями общения",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Анализируйте ключевые слова для улучшения запросов",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "⚡ Оптимизация производительности:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Регулярно очищайте историю через мини-приложение",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Следите за лимитами токенов LLM",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Используйте напоминания для важных задач",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "• Настройте уведомления под свои потребности"
                  ] })
                ] })
              ]
            },
            "6"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Panel,
            {
              header: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$7, { style: { marginRight: "8px" } }),
                "📞 Поддержка"
              ] }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "Если что-то не работает:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                  "• Перезапустите mini-app",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "• Проверьте интернет-соединение",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "• Обратитесь к разработчику через поддержку",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "• Используйте команду ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/help" }),
                  " в боте для актуальной информации"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "💡 Полезные советы:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
                  "• Будьте осторожны с командами удаления",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "• Регулярно проверяйте настройки LLM",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "• Экспериментируйте с разными личностями",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "• Изучайте анализ эмоций для лучшего понимания общения"
                ] })
              ] })
            },
            "7"
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ff4d4f" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$8, { style: { marginRight: "8px" } }),
          "КРИТИЧЕСКИ ВАЖНО ОБ УДАЛЕНИИ!"
        ] }),
        open: isDeletionModalOpen,
        onCancel: () => setIsDeletionModalOpen(false),
        footer: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsDeletionModalOpen(false), children: "Понятно" }, "close")
        ],
        width: 600,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: "🚨 Важная информация об удалении!",
              description: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "❌ Удаление в Telegram боте:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "Удаляет сообщения только визуально, но они остаются в базе данных!"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "✅ Удаление в мини-приложении:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "Реально удаляет сообщения из базы данных навсегда!"
                ] })
              ] }),
              type: "warning",
              style: { marginBottom: "20px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "✅ Правильный способ удаления:", size: "small", style: { marginBottom: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: 'Откройте мини-приложение (кнопка "Меню")' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: 'Перейдите в "Чат в приложении"' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: 'Используйте кнопку "🗑️ Очистить историю"' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Подтвердите удаление в диалоге" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "❌ Что НЕ работает для реального удаления:", size: "small", style: { marginBottom: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Удаление сообщений в Telegram боте" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Команды /delete_last, /clear_chat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Долгий тап → Delete в Telegram" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Любые действия в интерфейсе Telegram" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: "💡 Рекомендация",
              description: "Для реального удаления сообщений всегда используйте мини-приложение! Только там удаление работает правильно.",
              type: "info"
            }
          )
        ]
      }
    )
  ] });
};
export {
  Help as default
};
//# sourceMappingURL=Help-CphzRvuN.js.map
