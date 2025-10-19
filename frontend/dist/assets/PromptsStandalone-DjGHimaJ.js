import { R as React, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import Prompts from "./Prompts-D8a28S7c.js";
import { c as apiRequest } from "./index-B4P9h-k1.js";
import "./index-DVLFW87y.js";
import "./index-C8B9-ZwJ.js";
import "./Skeleton-D3e3aC7P.js";
import "./FileTextOutlined-lwBP-Cdj.js";
import "./AntdIcon-bc3Msg1y.js";
import "./index-DFQcmyfW.js";
import "./context-CGIstv1h.js";
import "./index-BlJydARW.js";
import "./index-B_ub_kOm.js";
import "./StarOutlined-Cal6gFaE.js";
import "./index-C97PeQQx.js";
import "./index-B3Kptpnc.js";
import "./index-C3XsEteC.js";
import "./index-DDcrJiGl.js";
import "./InfoCircleOutlined-BDFvYUED.js";
const PromptsStandalone = () => {
  const [prompts, setPrompts] = React.useState([]);
  const [selectedPrompt, setSelectedPrompt] = React.useState(null);
  const [disableBasePersonality, setDisableBasePersonality] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const load = React.useCallback(async () => {
    try {
      const tgId = (() => {
        try {
          return sessionStorage.getItem("tg_id");
        } catch (e) {
          return null;
        }
      })();
      if (!tgId) {
        setLoading(false);
        return;
      }
      const res = await apiRequest("/miniapp/prompts", "GET", null, { "X-Telegram-User-ID": String(tgId) });
      const items = res.items || [];
      setPrompts(items);
      const active = items.find((p) => p.is_active) || items.find((p) => p.key === "prompt-4") || null;
      if (active) {
        setSelectedPrompt(active);
        setDisableBasePersonality(!!active.disable_base_personality);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const onPromptSelect = (p) => setSelectedPrompt(p);
  const onSetActivePersonality = async (promptKey, disableBase) => {
    try {
      const tgId = sessionStorage.getItem("tg_id");
      if (!tgId) throw new Error("Unauthorized");
      const form = new FormData();
      form.append("prompt_key", promptKey);
      if (typeof disableBase === "boolean") form.append("disable_base", String(disableBase));
      const resp = await fetch("/api/miniapp/prompts/set-active", { method: "POST", body: form, headers: { "X-Telegram-User-ID": String(tgId) } });
      if (resp.ok) {
        const data = await resp.json();
        setDisableBasePersonality(!!data.disable_base_personality);
        await load();
      }
    } catch (e) {
    }
  };
  const onPromptStatusChange = async (promptId, newStatus) => {
    const p = prompts.find((px) => px.id === promptId);
    if (!p || !p.key) return;
    await onSetActivePersonality(newStatus ? p.key : "prompt-4");
  };
  const onDisableBasePersonalityChange = async (checked) => {
    try {
      const tgId = sessionStorage.getItem("tg_id");
      if (!tgId) throw new Error("Unauthorized");
      const form = new FormData();
      form.append("disable_base", String(checked));
      const resp = await fetch("/api/miniapp/prompts/update-settings", { method: "POST", body: form, headers: { "X-Telegram-User-ID": String(tgId) } });
      if (resp.ok) setDisableBasePersonality(checked);
    } catch (e) {
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "screen loading", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spinner" }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Prompts,
    {
      prompts,
      selectedPrompt,
      onPromptSelect,
      onPromptStatusChange,
      onSetActivePersonality,
      disableBasePersonality,
      onDisableBasePersonalityChange
    }
  );
};
export {
  PromptsStandalone as default
};
//# sourceMappingURL=PromptsStandalone-DjGHimaJ.js.map
