import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { T as Typography, l as Space, aL as Checkbox, I as Input, n as Select, B as Button, aF as api, s as staticMethods } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { S as Skeleton } from "./Skeleton-D3e3aC7P.js";
import { A as Alert } from "./index-DVLFW87y.js";
const Register = () => {
  const [loading, setLoading] = reactExports.useState(true);
  const [pending, setPending] = reactExports.useState(false);
  const [privacyUrl, setPrivacyUrl] = reactExports.useState(null);
  const [securityUrl, setSecurityUrl] = reactExports.useState(null);
  const [consentPersonal, setConsentPersonal] = reactExports.useState(false);
  const [consentSecurity, setConsentSecurity] = reactExports.useState(false);
  const [comment, setComment] = reactExports.useState("");
  const [promoCode, setPromoCode] = reactExports.useState("");
  const [desiredRole, setDesiredRole] = reactExports.useState(void 0);
  const [desiredPlan, setDesiredPlan] = reactExports.useState(void 0);
  const [error, setError] = reactExports.useState(null);
  const loadStatus = async () => {
    var _a, _b;
    try {
      if (!loading) setLoading(true);
      setError(null);
      const resp = await api("/registration/status");
      if ((resp == null ? void 0 : resp.status) === "success") {
        setPending(Boolean(resp.pending));
        setPrivacyUrl(((_a = resp.documents) == null ? void 0 : _a.privacy_url) || null);
        setSecurityUrl(((_b = resp.documents) == null ? void 0 : _b.security_url) || null);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка загрузки статуса");
    } finally {
      requestAnimationFrame(() => setLoading(false));
    }
  };
  reactExports.useEffect(() => {
    loadStatus();
  }, []);
  const canSubmit = consentPersonal && consentSecurity;
  const handleRedeemPromo = async () => {
    if (!canSubmit) {
      staticMethods.warning("Подтвердите согласия перед продолжением");
      return;
    }
    if (!promoCode.trim()) {
      staticMethods.warning("Введите промокод");
      return;
    }
    try {
      setError(null);
      const resp = await api("/registration/promo-redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), comment, consent_personal: consentPersonal, consent_security: consentSecurity })
      });
      if ((resp == null ? void 0 : resp.status) === "success") {
        staticMethods.success("Промокод активирован");
        await loadStatus();
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка активации промокода");
    }
  };
  const handleSendRequest = async () => {
    if (!canSubmit) {
      staticMethods.warning("Подтвердите согласия перед продолжением");
      return;
    }
    try {
      setError(null);
      const resp = await api("/registration/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, desired_role: desiredRole, desired_plan: desiredPlan, consent_personal: consentPersonal, consent_security: consentSecurity })
      });
      if ((resp == null ? void 0 : resp.status) === "success") {
        staticMethods.success("Заявка отправлена. Мы уведомим вас после подтверждения.");
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Ошибка отправки заявки");
    }
  };
  const calmContainerStyle = reactExports.useMemo(() => ({
    padding: 16,
    background: "var(--sp-gradient-background)",
    minHeight: "calc(100dvh - var(--sp-platform-header-height, 0px))"
  }), []);
  const cardStyle = reactExports.useMemo(() => ({
    borderRadius: 12,
    background: "var(--sp-bg-card)",
    border: "1px solid var(--sp-border-primary)"
  }), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: calmContainerStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: 720, margin: "0 auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { bordered: true, style: cardStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 3, style: { marginTop: 0, marginBottom: 8 }, children: "Регистрация" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { style: { marginTop: 0, opacity: 0.9 }, children: "Добро пожаловать в SoulPulse. Перед началом работы подтвердите согласия и выберите способ регистрации." }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { active: true, paragraph: { rows: 2 }, style: { marginBottom: 12 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { active: true, title: false, paragraph: { rows: 4 }, style: { marginBottom: 12 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton.Button, { active: true, size: "large", style: { width: 260 } })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { type: "error", showIcon: true, style: { marginBottom: 12 }, message: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Checkbox, { checked: consentPersonal, onChange: (e) => setConsentPersonal(e.target.checked), children: [
          "Согласен на обработку персональных данных ",
          privacyUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: privacyUrl, target: "_blank", rel: "noreferrer", children: "(прочитать)" }) : null
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Checkbox, { checked: consentSecurity, onChange: (e) => setConsentSecurity(e.target.checked), children: [
          "Согласен с политикой безопасности приложения ",
          securityUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: securityUrl, target: "_blank", rel: "noreferrer", children: "(прочитать)" }) : null
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 3, placeholder: "О себе (необязательно)", value: comment, onChange: (e) => setComment(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              style: { minWidth: 160 },
              placeholder: "Желаемая роль",
              value: desiredRole,
              onChange: setDesiredRole,
              allowClear: true,
              options: [
                { label: "Basic", value: "basic" },
                { label: "Premium", value: "premium" },
                { label: "VIP", value: "vip" }
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              style: { minWidth: 160 },
              placeholder: "Тарифный план",
              value: desiredPlan,
              onChange: setDesiredPlan,
              allowClear: true,
              options: [
                { label: "Basic", value: "basic" },
                { label: "Premium", value: "premium" },
                { label: "VIP", value: "vip" }
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space.Compact, { style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Промокод (необязательно)", value: promoCode, onChange: (e) => setPromoCode(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: handleRedeemPromo, disabled: !canSubmit, children: "Активировать" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSendRequest, disabled: !canSubmit, children: "Отправить заявку на регистрацию" }) })
      ] }),
      !pending && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { style: { marginTop: 12 }, type: "success", showIcon: true, message: "Регистрация завершена. Вы можете пользоваться приложением." })
    ] })
  ] }) }) });
};
export {
  Register as default
};
//# sourceMappingURL=Register-BUCCakoT.js.map
