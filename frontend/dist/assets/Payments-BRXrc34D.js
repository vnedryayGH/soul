import { j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { T as Typography, B as Button, l as Space, p as Tag } from "./index-B4P9h-k1.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { L as List } from "./index-CG-iaDjq.js";
import { R as RefIcon } from "./CheckOutlined-B3SxkmQa.js";
import { R as RefIcon$1 } from "./StarOutlined-Cal6gFaE.js";
import "./index-BlJydARW.js";
import "./Skeleton-D3e3aC7P.js";
import "./AntdIcon-bc3Msg1y.js";
const { Title, Paragraph } = Typography;
const Payments = () => {
  const plans = [
    {
      name: "Базовый",
      price: "Бесплатно",
      features: [
        "Базовые промпты",
        "Ограниченное количество сообщений",
        "Базовая поддержка"
      ],
      current: false,
      popular: false
    },
    {
      name: "Premium",
      price: "299₽/месяц",
      features: [
        "Все базовые промпты",
        "Premium промпты",
        "Неограниченные сообщения",
        "Приоритетная поддержка",
        "Расширенные настройки LLM"
      ],
      current: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: "999₽/месяц",
      features: [
        "Все функции Premium",
        "Индивидуальные промпты",
        "API доступ",
        "Персональный менеджер",
        "Белый лейбл"
      ],
      current: false,
      popular: false
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 2, children: "💎 Подписка" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { children: "Выберите план, который подходит именно вам" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [24, 24], children: plans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { margin: 0 }, children: plan.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 2, style: { margin: 0 }, children: plan.price }),
          plan.popular && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "gold", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, {}), children: "Популярный" }),
          plan.current && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, {}), children: "Текущий план" })
        ] }),
        style: { border: plan.popular ? "2px solid var(--sp-accent, #faad14)" : "1px solid var(--sp-border-color, #d9d9d9)", position: "relative" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            List,
            {
              dataSource: plan.features,
              renderItem: (feature) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                List.Item.Meta,
                {
                  avatar: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { color: "#52c41a" } }),
                  title: feature
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "var(--sp-spacing-sm)" }, children: plan.current ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", block: true, disabled: true, children: "Текущий план" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", block: true, children: plan.name === "Базовый" ? "Активировать" : "Выбрать план" }) })
        ]
      }
    ) }, plan.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { marginTop: "var(--sp-spacing-md, 32px)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, children: "🎁 Специальные предложения" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", title: "🎯 Годовая подписка", hoverable: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Скидка 20%" }),
            " при оплате за год"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", children: "Подробнее" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", title: "👥 Командная подписка", hoverable: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Paragraph, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Скидка до 40%" }),
            " для команд от 5 человек"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", children: "Подробнее" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { marginTop: "var(--sp-spacing-sm)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 4, children: "❓ Часто задаваемые вопросы" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        List,
        {
          size: "large",
          dataSource: [
            {
              question: "Можно ли отменить подписку?",
              answer: "Да, вы можете отменить подписку в любое время в настройках профиля."
            },
            {
              question: "Что происходит при отмене?",
              answer: "Вы сохраняете доступ до конца оплаченного периода, затем переходите на базовый план."
            },
            {
              question: "Есть ли пробный период?",
              answer: "Да, Premium план доступен бесплатно первые 7 дней."
            }
          ],
          renderItem: (item) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            List.Item.Meta,
            {
              title: item.question,
              description: item.answer
            }
          ) })
        }
      )
    ] })
  ] });
};
export {
  Payments as default
};
//# sourceMappingURL=Payments-BRXrc34D.js.map
