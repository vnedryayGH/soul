import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { H as HyperloopDSLValidator } from "./HyperloopDSLValidator-6JhmY41x.js";
import { T as Typography, l as Space, I as Input, B as Button, F as ForwardTable, aL as Checkbox, n as Select, s as staticMethods, g as getTelegramUser } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import "./Skeleton-D3e3aC7P.js";
import "./context-CGIstv1h.js";
import "./index-BlJydARW.js";
const buildAuthHeaders = () => {
  var _a, _b;
  const headers = { "Content-Type": "application/json" };
  const tgId = sessionStorage.getItem("tg_id") || ((_b = (_a = getTelegramUser()) == null ? void 0 : _a.id) == null ? void 0 : _b.toString());
  if (tgId) headers["X-Telegram-User-ID"] = tgId;
  const token = sessionStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};
const AdminPanel = () => {
  const [promoLoading, setPromoLoading] = reactExports.useState(false);
  const [promoCodes, setPromoCodes] = reactExports.useState([]);
  const [redemptions, setRedemptions] = reactExports.useState([]);
  const [newPromoCode, setNewPromoCode] = reactExports.useState("");
  const [newPromoRole, setNewPromoRole] = reactExports.useState("basic");
  const [newPromoLimit, setNewPromoLimit] = reactExports.useState();
  const [requestsLoading, setRequestsLoading] = reactExports.useState(false);
  const [regRequests, setRegRequests] = reactExports.useState([]);
  const [docPrivacyUrl, setDocPrivacyUrl] = reactExports.useState("");
  const [docSecurityUrl, setDocSecurityUrl] = reactExports.useState("");
  const [dutyAdminTgId, setDutyAdminTgId] = reactExports.useState("");
  const [devBranch, setDevBranch] = reactExports.useState("p48r-dev");
  const [devSession, setDevSession] = reactExports.useState("dev-001");
  const [devConnectLoading, setDevConnectLoading] = reactExports.useState(false);
  const [locksLoading, setLocksLoading] = reactExports.useState(false);
  const [myBranches, setMyBranches] = reactExports.useState([]);
  const [activePersonality, setActivePersonality] = reactExports.useState(null);
  const [loadingPersonality, setLoadingPersonality] = reactExports.useState(false);
  const [defineModalOpen, setDefineModalOpen] = reactExports.useState(false);
  const [defineSex, setDefineSex] = reactExports.useState("male");
  const [defineVersion, setDefineVersion] = reactExports.useState("v1");
  const [defineAnima, setDefineAnima] = reactExports.useState(0.3);
  const [normKey, setNormKey] = reactExports.useState("");
  const [normTitle, setNormTitle] = reactExports.useState("");
  const [normSeverity, setNormSeverity] = reactExports.useState(0.8);
  const [normScope, setNormScope] = reactExports.useState("duty");
  const [traitKey, setTraitKey] = reactExports.useState("conscientiousness");
  const [traitFamily, setTraitFamily] = reactExports.useState("OCEAN");
  const [traitTendency, setTraitTendency] = reactExports.useState(0.7);
  const [traitStability, setTraitStability] = reactExports.useState(0.8);
  const [attachKey, setAttachKey] = reactExports.useState("family");
  const [attachWeight, setAttachWeight] = reactExports.useState(0.7);
  const [policyKey, setPolicyKey] = reactExports.useState("processor.multipliers");
  const [policyValue, setPolicyValue] = reactExports.useState(JSON.stringify({ appraise: 1.05, decide: 1.03, rank: 1.07, offsets: { appraise: 0.01, decide: 0, rank: 0.02 } }, null, 2));
  const [twoKeysReqId, setTwoKeysReqId] = reactExports.useState("");
  const [tkOperation, setTkOperation] = reactExports.useState("personality.activate");
  const [tkScope, setTkScope] = reactExports.useState("p51");
  const [tkReason, setTkReason] = reactExports.useState("switch active personality");
  const [tkTtl, setTkTtl] = reactExports.useState(60);
  const [norms, setNorms] = reactExports.useState([]);
  const [traits, setTraits] = reactExports.useState([]);
  const [attachments, setAttachments] = reactExports.useState([]);
  const [policies, setPolicies] = reactExports.useState([]);
  const [links, setLinks] = reactExports.useState([]);
  const [listsLoading, setListsLoading] = reactExports.useState(false);
  const [batchLoading, setBatchLoading] = reactExports.useState(false);
  const reloadPersonalityLists = async () => {
    const pid = activePersonality == null ? void 0 : activePersonality.id;
    if (!pid) return;
    try {
      setListsLoading(true);
      const [n, t, a, p, l] = await Promise.all([
        fetch(`/api/admin/personality/norms?personality_id=${encodeURIComponent(pid)}`, { headers: buildHeaders() }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }).catch(() => ({ items: [] })),
        fetch(`/api/admin/personality/traits?personality_id=${encodeURIComponent(pid)}`, { headers: buildHeaders() }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }).catch(() => ({ items: [] })),
        fetch(`/api/admin/personality/attachments?personality_id=${encodeURIComponent(pid)}`, { headers: buildHeaders() }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }).catch(() => ({ items: [] })),
        fetch(`/api/admin/personality/policies?personality_id=${encodeURIComponent(pid)}`, { headers: buildHeaders() }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }).catch(() => ({ items: [] })),
        fetch(`/api/admin/personality/links?personality_id=${encodeURIComponent(pid)}`, { headers: buildHeaders() }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }).catch(() => ({ items: [] }))
      ]);
      setNorms(n.items || []);
      setTraits(t.items || []);
      setAttachments(a.items || []);
      setPolicies(p.items || []);
      setLinks(l.items || []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки списков личности");
    } finally {
      setListsLoading(false);
    }
  };
  const loadPromo = async () => {
    try {
      setPromoLoading(true);
      const resp = await fetch("/api/admin/promo/codes", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setPromoCodes(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки промокодов");
    } finally {
      setPromoLoading(false);
    }
  };
  const loadRedemptions = async () => {
    try {
      const resp = await fetch("/api/admin/promo/redemptions", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setRedemptions(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
    }
  };
  const createPromo = async () => {
    const code = newPromoCode.trim();
    const role = newPromoRole.trim();
    if (!code || !role) {
      staticMethods.warning("Укажите код и роль");
      return;
    }
    try {
      setPromoLoading(true);
      const resp = await fetch("/api/admin/promo/codes", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ code, role_name: role, total_limit: newPromoLimit || null, is_active: true })
      });
      if (!resp.ok) throw new Error();
      setNewPromoCode("");
      setNewPromoRole("basic");
      setNewPromoLimit(void 0);
      await loadPromo();
      staticMethods.success("Промокод создан");
    } catch (e) {
      staticMethods.error("Не удалось создать промокод");
    } finally {
      setPromoLoading(false);
    }
  };
  const togglePromoActive = async (row, value) => {
    try {
      const resp = await fetch(`/api/admin/promo/codes/${row.id}`, { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify({ is_active: value }) });
      if (!resp.ok) throw new Error();
      await loadPromo();
    } catch (e) {
      staticMethods.error("Ошибка обновления промокода");
    }
  };
  const deletePromo = async (row) => {
    try {
      const resp = await fetch(`/api/admin/promo/codes/${row.id}`, { method: "DELETE", headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      await loadPromo();
    } catch (e) {
      staticMethods.error("Ошибка удаления");
    }
  };
  const loadRequests = async () => {
    try {
      setRequestsLoading(true);
      const resp = await fetch("/api/admin/registration/requests", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setRegRequests(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки заявок");
    } finally {
      setRequestsLoading(false);
    }
  };
  const approveRequest = async (id) => {
    try {
      const resp = await fetch(`/api/admin/registration/requests/${id}/approve`, { method: "POST", headers: buildAuthHeaders(), body: "{}" });
      if (!resp.ok) throw new Error();
      await loadRequests();
      staticMethods.success("Заявка подтверждена");
    } catch (e) {
      staticMethods.error("Не удалось подтвердить");
    }
  };
  const rejectRequest = async (id) => {
    try {
      const resp = await fetch(`/api/admin/registration/requests/${id}/reject`, { method: "POST", headers: buildAuthHeaders(), body: "{}" });
      if (!resp.ok) throw new Error();
      await loadRequests();
    } catch (e) {
      staticMethods.error("Не удалось отклонить");
    }
  };
  const loadDocLinks = async () => {
    var _a, _b, _c;
    try {
      const resp = await fetch("/api/admin/settings?keys=registration.privacy_url,registration.security_url,registration.duty_admin_tg_id", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setDocPrivacyUrl(((_a = data.items) == null ? void 0 : _a["registration.privacy_url"]) || "");
      setDocSecurityUrl(((_b = data.items) == null ? void 0 : _b["registration.security_url"]) || "");
      setDutyAdminTgId(((_c = data.items) == null ? void 0 : _c["registration.duty_admin_tg_id"]) || "");
    } catch (e) {
    }
  };
  const saveDocLink = async (key, value) => {
    try {
      const resp = await fetch("/api/admin/settings", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify({ key, value_text: value }) });
      if (!resp.ok) throw new Error();
      staticMethods.success("Ссылка сохранена");
    } catch (e) {
      staticMethods.error("Ошибка сохранения ссылки");
    }
  };
  const saveDutyAdmin = async () => {
    const value = dutyAdminTgId.trim();
    if (value && !/^\d+$/.test(value)) {
      staticMethods.warning("tg_id должен быть числом");
      return;
    }
    try {
      const resp = await fetch("/api/admin/settings", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify({ key: "registration.duty_admin_tg_id", value_text: value }) });
      if (!resp.ok) throw new Error();
      staticMethods.success("Дежурный админ сохранён");
    } catch (e) {
      staticMethods.error("Ошибка сохранения");
    }
  };
  const runDevConnect = async () => {
    var _a, _b;
    const owner = sessionStorage.getItem("tg_id") || ((_b = (_a = getTelegramUser()) == null ? void 0 : _a.id) == null ? void 0 : _b.toString());
    if (!owner) {
      staticMethods.warning("Не найден tg_id пользователя");
      return;
    }
    try {
      setDevConnectLoading(true);
      const resp = await fetch("/api/hyperloop/execute", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ commands: `DEV.CONNECT owner="${owner}" branch="${devBranch}" session="${devSession}"` })
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data && (data.ok === true || Array.isArray(data.results) && data.results.every((x) => x == null ? void 0 : x.ok))) {
        staticMethods.success("DEV.CONNECT ok");
      } else {
        staticMethods.warning(`DEV.CONNECT: ${resp.status}`);
      }
      console.debug("DEV.CONNECT resp", data);
    } catch (e) {
      staticMethods.error("Ошибка DEV.CONNECT");
    } finally {
      setDevConnectLoading(false);
    }
  };
  const loadMyLocks = async () => {
    var _a, _b, _c;
    const owner = sessionStorage.getItem("tg_id") || ((_b = (_a = getTelegramUser()) == null ? void 0 : _a.id) == null ? void 0 : _b.toString());
    try {
      setLocksLoading(true);
      const resp = await fetch("/api/hyperloop/execute", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ commands: "INSPECTOR.RUN key=plan.branch action=list" })
      });
      const data = await resp.json().catch(() => ({}));
      const items = [];
      const res = Array.isArray(data == null ? void 0 : data.results) ? data.results : [];
      const first = res[0] || {};
      const locks = ((_c = first == null ? void 0 : first.data) == null ? void 0 : _c.locks) || {};
      const branches = (locks == null ? void 0 : locks.branches) || {};
      Object.keys(branches).forEach((k) => {
        const v = branches[k];
        if (v && typeof v === "object" && v.owners && typeof v.owners === "object") {
          Object.keys(v.owners).forEach((ow) => {
            const om = v.owners[ow] || {};
            if (!owner || String(om == null ? void 0 : om.owner) === String(owner)) {
              items.push({ key: k, owner: om == null ? void 0 : om.owner, session: (om == null ? void 0 : om.session) || "", ts: (om == null ? void 0 : om.ts) || "" });
            }
          });
        } else {
          if (!owner || String(v == null ? void 0 : v.owner) === String(owner)) {
            items.push({ key: k, owner: v == null ? void 0 : v.owner, session: (v == null ? void 0 : v.session) || "", ts: (v == null ? void 0 : v.ts) || "" });
          }
        }
      });
      setMyBranches(items);
    } catch (e) {
    } finally {
      setLocksLoading(false);
    }
  };
  const buildHeaders = () => ({ ...buildAuthHeaders() });
  const loadActivePersonality = async () => {
    try {
      setLoadingPersonality(true);
      const resp = await fetch("/api/admin/personality/active", { headers: buildHeaders() });
      const data = await resp.json();
      setActivePersonality(data);
    } catch (e) {
      staticMethods.error("Не удалось загрузить активную личность");
    } finally {
      setLoadingPersonality(false);
    }
  };
  const reloadAll = async () => {
    try {
      setBatchLoading(true);
      await loadActivePersonality();
      await reloadPersonalityLists();
      await Promise.all([loadPromo(), loadRedemptions(), loadRequests(), loadDocLinks()]);
      staticMethods.success("Данные обновлены");
    } catch (e) {
      staticMethods.error("Ошибка комплексного обновления");
    } finally {
      setBatchLoading(false);
    }
  };
  const definePersonality = async () => {
    try {
      const resp = await fetch("/api/admin/personality/define", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ version: defineVersion, sex: defineSex, anima_animus: defineAnima })
      });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      staticMethods.success(`Создана личность: ${data.id}`);
      setDefineModalOpen(false);
      await loadActivePersonality();
    } catch (e) {
      staticMethods.error("Ошибка создания личности");
    }
  };
  const addNorm = async () => {
    const pid = activePersonality == null ? void 0 : activePersonality.id;
    if (!pid) {
      staticMethods.warning("Нет активной личности");
      return;
    }
    try {
      const resp = await fetch("/api/admin/personality/norm", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ personality_id: pid, key: normKey, title: normTitle, severity: normSeverity, scope: normScope, links: [] })
      });
      if (!resp.ok) throw new Error();
      staticMethods.success("Норма добавлена/обновлена");
    } catch (e) {
      staticMethods.error("Ошибка добавления нормы");
    }
  };
  const setTrait = async () => {
    const pid = activePersonality == null ? void 0 : activePersonality.id;
    if (!pid) {
      staticMethods.warning("Нет активной личности");
      return;
    }
    try {
      const resp = await fetch("/api/admin/personality/trait", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ personality_id: pid, key: traitKey, family: traitFamily, tendency: traitTendency, stability: traitStability, links: [] })
      });
      if (!resp.ok) throw new Error();
      staticMethods.success("Черта сохранена");
    } catch (e) {
      staticMethods.error("Ошибка сохранения черты");
    }
  };
  const setAttachment = async () => {
    const pid = activePersonality == null ? void 0 : activePersonality.id;
    if (!pid) {
      staticMethods.warning("Нет активной личности");
      return;
    }
    try {
      const resp = await fetch("/api/admin/personality/attachment", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ personality_id: pid, key: attachKey, baseline_weight: attachWeight, links: [] })
      });
      if (!resp.ok) throw new Error();
      staticMethods.success("Привязанность сохранена");
    } catch (e) {
      staticMethods.error("Ошибка сохранения привязанности");
    }
  };
  const setPolicy = async () => {
    const pid = activePersonality == null ? void 0 : activePersonality.id;
    if (!pid) {
      staticMethods.warning("Нет активной личности");
      return;
    }
    let parsed = null;
    try {
      parsed = JSON.parse(policyValue);
    } catch (e) {
      staticMethods.warning("Value должен быть корректным JSON");
      return;
    }
    try {
      const resp = await fetch("/api/admin/personality/policy", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ personality_id: pid, key: policyKey, value: parsed })
      });
      if (!resp.ok) throw new Error();
      staticMethods.success("Политика сохранена");
    } catch (e) {
      staticMethods.error("Ошибка сохранения политики");
    }
  };
  const activatePersonality = async () => {
    const pid = activePersonality == null ? void 0 : activePersonality.id;
    if (!pid) {
      staticMethods.warning("Нет активной личности");
      return;
    }
    if (!twoKeysReqId.trim()) {
      staticMethods.warning("Укажите request_id Two-Keys");
      return;
    }
    try {
      const resp = await fetch("/api/admin/personality/activate", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ id: pid, two_keys: { request_id: twoKeysReqId.trim() } })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || (data == null ? void 0 : data.ok) !== true) throw new Error();
      staticMethods.success("Личность активирована");
      await loadActivePersonality();
    } catch (e) {
      staticMethods.error("Ошибка активации (Two-Keys)");
    }
  };
  const createTwoKeysRequest = async () => {
    const body = { operation: tkOperation, scope: tkScope, reason: tkReason };
    if (typeof tkTtl === "number" && tkTtl > 0) body.ttl_minutes = tkTtl;
    try {
      const resp = await fetch("/api/admin/two-keys/requests", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body)
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(String((data == null ? void 0 : data.error) || resp.status));
      const rid = String((data == null ? void 0 : data.id) || (data == null ? void 0 : data.request_id) || (data == null ? void 0 : data.rid) || "").trim();
      if (rid) {
        setTwoKeysReqId(rid);
        staticMethods.success(`Создана Two-Keys заявка: ${rid}`);
      } else {
        staticMethods.success("Two-Keys заявка создана");
      }
    } catch (e) {
      const msg = String((e == null ? void 0 : e.message) || "Ошибка создания Two-Keys заявки");
      staticMethods.error(msg);
    }
  };
  const approveTwoKeysRequest = async () => {
    const rid = twoKeysReqId.trim();
    if (!rid) {
      staticMethods.warning("Укажите request_id");
      return;
    }
    try {
      const resp = await fetch("/api/admin/two-keys/approve", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ request_id: rid })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 403) {
          staticMethods.error("403: нет аппрува/прав для подтверждения");
          return;
        }
        throw new Error(String((data == null ? void 0 : data.error) || resp.status));
      }
      staticMethods.success("Two-Keys заявка подтверждена");
    } catch (e) {
      const msg = String((e == null ? void 0 : e.message) || "Ошибка подтверждения Two-Keys");
      staticMethods.error(msg);
    }
  };
  reactExports.useEffect(() => {
    void loadPromo();
    void loadRedemptions();
    void loadRequests();
    void loadDocLinks();
    void loadActivePersonality();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 3, style: { marginBottom: 16 }, children: "Панель Администратора" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "large", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Ссылки документов", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ссылка на политику персональных данных", value: docPrivacyUrl, onChange: (e) => setDocPrivacyUrl(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => saveDocLink("registration.privacy_url", docPrivacyUrl), type: "primary", children: "Сохранить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadDocLinks, children: "Обновить" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ссылка на политику безопасности", value: docSecurityUrl, onChange: (e) => setDocSecurityUrl(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => saveDocLink("registration.security_url", docSecurityUrl), type: "primary", children: "Сохранить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadDocLinks, children: "Обновить" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "tg_id дежурного администратора", value: dutyAdminTgId, onChange: (e) => setDutyAdminTgId(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveDutyAdmin, type: "primary", children: "Сохранить дежурного" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadDocLinks, children: "Обновить" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Быстрые действия DEV", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ветка (branch)", value: devBranch, onChange: (e) => setDevBranch(e.target.value), style: { width: 240 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Сессия (session)", value: devSession, onChange: (e) => setDevSession(e.target.value), style: { width: 180 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: runDevConnect, loading: devConnectLoading, children: "DEV.CONNECT" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Активные ветки (мои)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadMyLocks, loading: locksLoading, children: "Обновить" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.key,
            columns: [
              { title: "Ветка", dataIndex: "key" },
              { title: "Владелец (tg_id)", dataIndex: "owner", width: 160 },
              { title: "Сессия", dataIndex: "session", width: 160 },
              { title: "TS", dataIndex: "ts", width: 220 }
            ],
            dataSource: myBranches,
            pagination: false,
            size: "small",
            scroll: { x: true }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Two-Keys (заявка / аппрув)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "operation", value: tkOperation, onChange: (e) => setTkOperation(e.target.value), style: { width: 260 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "scope", value: tkScope, onChange: (e) => setTkScope(e.target.value), style: { width: 180 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "reason", value: tkReason, onChange: (e) => setTkReason(e.target.value), style: { width: 320 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "ttl_minutes", value: tkTtl, onChange: (v) => setTkTtl(typeof v === "number" ? v : void 0), min: 1, max: 24 * 60 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: createTwoKeysRequest, children: "Создать заявку" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "two_keys.request_id", value: twoKeysReqId, onChange: (e) => setTwoKeysReqId(e.target.value), style: { width: 360 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: approveTwoKeysRequest, children: "Подтвердить (APPROVE)" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Промокоды", loading: promoLoading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Код", value: newPromoCode, onChange: (e) => setNewPromoCode(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Роль (basic/premium/vip)", value: newPromoRole, onChange: (e) => setNewPromoRole(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "Лимит", value: newPromoLimit, onChange: setNewPromoLimit, min: 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: createPromo, children: "Создать" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadPromo, children: "Обновить" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.id,
            columns: [
              { title: "Код", dataIndex: "code" },
              { title: "Роль", dataIndex: "role_name", width: 140 },
              { title: "Лимит", dataIndex: "total_limit", width: 100 },
              { title: "Активировано", dataIndex: "redeemed_count", width: 130 },
              { title: "Активен", key: "is_active", width: 120, render: (_, r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: r.is_active, onChange: (e) => togglePromoActive(r, e.target.checked) }) },
              { title: "Действия", key: "actions", width: 140, render: (_, r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, size: "small", onClick: () => deletePromo(r), children: "Удалить" }) }
            ],
            dataSource: promoCodes,
            pagination: { pageSize: 10 },
            size: "small",
            scroll: { x: true }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Активации промокодов", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          rowKey: (r) => r.id,
          columns: [
            { title: "ID", dataIndex: "id", width: 80 },
            { title: "Код", dataIndex: "promo_code", width: 160 },
            { title: "Пользователь", key: "user", render: (_, r) => `${r.user_id} / tg=${r.tg_id}` },
            { title: "Когда", dataIndex: "redeemed_at", width: 200 },
            { title: "Заметка", dataIndex: "note" }
          ],
          dataSource: redemptions,
          pagination: { pageSize: 10 },
          size: "small",
          scroll: { x: true }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Заявки на регистрацию", loading: requestsLoading, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          rowKey: (r) => r.id,
          columns: [
            { title: "ID", dataIndex: "id", width: 80 },
            { title: "Статус", dataIndex: "status", width: 120 },
            { title: "Пользователь", key: "user", render: (_, r) => {
              var _a, _b;
              return `${(_a = r.user) == null ? void 0 : _a.id} / tg=${(_b = r.user) == null ? void 0 : _b.tg_id}`;
            } },
            { title: "Имя", key: "fn", render: (_, r) => {
              var _a, _b;
              return `${((_a = r.user) == null ? void 0 : _a.first_name) || ""} ${((_b = r.user) == null ? void 0 : _b.last_name) || ""}`;
            } },
            { title: "Желаемая роль", dataIndex: "desired_role", width: 140 },
            { title: "План", dataIndex: "desired_plan", width: 120 },
            { title: "Комментарий", dataIndex: "comment" },
            { title: "Действия", key: "actions", width: 220, render: (_, r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "small", onClick: () => approveRequest(r.id), disabled: r.status !== "pending", children: "Подтвердить" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, size: "small", onClick: () => rejectRequest(r.id), disabled: r.status !== "pending", children: "Отклонить" })
            ] }) }
          ],
          dataSource: regRequests,
          pagination: { pageSize: 10 },
          size: "small",
          scroll: { x: true }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HyperloopDSLValidator, { title: "Hyperloop DSL — валидатор/нормализация (общий)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Личность Соул (P51)", loading: loadingPersonality || listsLoading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadActivePersonality, children: "Обновить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: reloadAll, loading: batchLoading, type: "default", children: "Обновить всё" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => setDefineModalOpen(true), children: "Создать личность" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 0" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Активная личность:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: (activePersonality == null ? void 0 : activePersonality.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "ID: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: activePersonality.id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Версия: ",
              activePersonality.version
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Пол: ",
              activePersonality.sex
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Статус: ",
              activePersonality.is_active ? "активна" : "не активна"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Обновлена: ",
              String(activePersonality.updated_at || "")
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "Нет активной личности" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: reloadPersonalityLists, loading: listsLoading, children: "Загрузить списки/связи" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Нормы", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "key", value: normKey, onChange: (e) => setNormKey(e.target.value), style: { width: 160 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "title", value: normTitle, onChange: (e) => setNormTitle(e.target.value), style: { width: 200 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "scope (duty/honesty/...)", value: normScope, onChange: (e) => setNormScope(e.target.value), style: { width: 200 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "severity", value: normSeverity, onChange: (v) => setNormSeverity(Number(v || 0)), min: 0, max: 1, step: 0.05 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: addNorm, children: "Сохранить норму" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.id,
            columns: [{ title: "key", dataIndex: "key" }, { title: "title", dataIndex: "title" }, { title: "severity", dataIndex: "severity" }, { title: "scope", dataIndex: "scope" }],
            dataSource: norms,
            size: "small",
            pagination: { pageSize: 5 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Черты", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "key", value: traitKey, onChange: (e) => setTraitKey(e.target.value), style: { width: 200 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "family (OCEAN/Jung/...)", value: traitFamily, onChange: (e) => setTraitFamily(e.target.value), style: { width: 220 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "tendency", value: traitTendency, onChange: (v) => setTraitTendency(Number(v || 0)), min: -1, max: 1, step: 0.05 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "stability", value: traitStability, onChange: (v) => setTraitStability(Number(v || 0)), min: 0, max: 1, step: 0.05 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: setTrait, children: "Сохранить черту" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.id,
            columns: [{ title: "key", dataIndex: "key" }, { title: "family", dataIndex: "family" }, { title: "tendency", dataIndex: "tendency" }, { title: "stability", dataIndex: "stability" }],
            dataSource: traits,
            size: "small",
            pagination: { pageSize: 5 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Привязанности", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "key", value: attachKey, onChange: (e) => setAttachKey(e.target.value), style: { width: 200 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "baseline_weight", value: attachWeight, onChange: (v) => setAttachWeight(Number(v || 0)), min: 0, max: 1, step: 0.05 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: setAttachment, children: "Сохранить привязанность" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.id,
            columns: [{ title: "key", dataIndex: "key" }, { title: "baseline_weight", dataIndex: "baseline_weight" }, { title: "growth_policy", dataIndex: "growth_policy" }],
            dataSource: attachments,
            size: "small",
            pagination: { pageSize: 5 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Политики", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                style: { width: 280 },
                value: policyKey,
                onChange: (v) => setPolicyKey(v),
                options: [
                  { value: "processor.multipliers", label: "processor.multipliers" },
                  { value: "search.bias", label: "search.bias" },
                  { value: "router.hints", label: "router.hints" },
                  { value: "sleep.profile", label: "sleep.profile" }
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: setPolicy, children: "Сохранить политику" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 6, value: policyValue, onChange: (e) => setPolicyValue(e.target.value), placeholder: "JSON value" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.key,
            columns: [{ title: "key", dataIndex: "key" }, { title: "value", dataIndex: "value" }],
            dataSource: policies,
            size: "small",
            pagination: { pageSize: 5 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Активация (Two-Keys)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "two_keys.request_id", value: twoKeysReqId, onChange: (e) => setTwoKeysReqId(e.target.value), style: { width: 360 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: activatePersonality, children: "Активировать" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Связи (матрица)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => `${r.element_kind}:${r.element_id}:${r.core_quant_id}`,
            columns: [
              { title: "element_kind", dataIndex: "element_kind" },
              { title: "element_id", dataIndex: "element_id" },
              { title: "core_quant_id", dataIndex: "core_quant_id" },
              { title: "relation_weight", dataIndex: "relation_weight" }
            ],
            dataSource: links,
            size: "small",
            pagination: { pageSize: 10 }
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { open: defineModalOpen, onCancel: () => setDefineModalOpen(false), onOk: definePersonality, title: "Создать личность", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Пол:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { value: defineSex, onChange: (v) => setDefineSex(v), options: [{ value: "male", label: "male" }, { value: "female", label: "female" }], style: { width: 180 } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Версия:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: defineVersion, onChange: (e) => setDefineVersion(e.target.value), style: { width: 220 } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "anima/animus:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: defineAnima, onChange: (v) => setDefineAnima(Number(v || 0)), min: 0, max: 1, step: 0.05 })
      ] })
    ] }) })
  ] });
};
export {
  AdminPanel as default
};
//# sourceMappingURL=AdminPanel-CaA_vwWL.js.map
