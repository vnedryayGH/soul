import { j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
const WebLanding = () => {
  const goToAuth = () => {
    try {
      const ret = encodeURIComponent(window.location.pathname + (window.location.search || ""));
      const u = new URL(window.location.href);
      u.hash = "#/webauth?return=" + ret;
      window.location.replace(u.toString());
    } catch (e) {
      try {
        window.location.hash = "#/webauth";
      } catch (e2) {
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-spacing-md, 24px)", background: "var(--sp-bg-secondary, #f6f7fb)", color: "var(--sp-text-primary, #111)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "var(--sp-surface, #fff)", border: "1px solid var(--sp-border-color, #e5e7eb)", borderRadius: 12, padding: "var(--sp-spacing-md, 24px)", maxWidth: 520, width: "100%", textAlign: "center", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, marginBottom: "var(--sp-spacing-xs, 8px)" }, children: "SoulPulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: "var(--sp-text-secondary, #6b7280)", marginBottom: "var(--sp-spacing-sm, 16px)" }, children: "Для доступа к веб‑интерфейсу выполните вход." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goToAuth, style: { background: "var(--sp-primary, #6366f1)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }, children: "Перейти к входу" })
  ] }) });
};
export {
  WebLanding as default
};
//# sourceMappingURL=WebLanding-DKrLju_c.js.map
