import { a as reactExports, R as React, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import ArchitectMonitoring from "./ArchitectMonitoring-Dm2DQylm.js";
import { u as useNavigate, s as staticMethods, T as Typography, l as Space, B as Button, aB as Tooltip, I as Input, F as ForwardTable, aL as Checkbox, n as Select, g as getTelegramUser } from "./index-B4P9h-k1.js";
import { T as Tabs, C as Card } from "./index-C8B9-ZwJ.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { A as Avatar } from "./index-B3Kptpnc.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { a as Slider } from "./index-BXtDgZ6P.js";
import { L as List } from "./index-CG-iaDjq.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import "./index-DVLFW87y.js";
import "./Skeleton-D3e3aC7P.js";
import "./index-BlJydARW.js";
import "./index-C3XsEteC.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./context-CGIstv1h.js";
const parseSettings = (raw) => {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
};
function ArchitectPanel() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
  const navigate = useNavigate();
  const go = (path) => {
    try {
      navigate(path);
    } catch (e) {
      try {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch (e2) {
        try {
          window.location.assign(path);
        } catch (e3) {
        }
      }
    }
  };
  const [loading, setLoading] = reactExports.useState(false);
  const [recentRatio, setRecentRatio] = reactExports.useState(0.3);
  const [useEmotionWeights, setUseEmotionWeights] = reactExports.useState(true);
  const [original, setOriginal] = reactExports.useState(null);
  const [rolesLoading, setRolesLoading] = reactExports.useState(false);
  const [permissionsLoading, setPermissionsLoading] = reactExports.useState(false);
  const [limitsLoading, setLimitsLoading] = reactExports.useState(false);
  const [roles, setRoles] = reactExports.useState([]);
  const [permissions, setPermissions] = reactExports.useState([]);
  const [llmModels, setLlmModels] = reactExports.useState([]);
  const [limits, setLimits] = reactExports.useState([]);
  const [newRoleName, setNewRoleName] = reactExports.useState("");
  const [newRoleDesc, setNewRoleDesc] = reactExports.useState("");
  const [newPermKey, setNewPermKey] = reactExports.useState("");
  const [newPermDesc, setNewPermDesc] = reactExports.useState("");
  const [selectedRoleForLimit, setSelectedRoleForLimit] = reactExports.useState();
  const [limitDailyReqs, setLimitDailyReqs] = reactExports.useState();
  const [limitMaxOutput, setLimitMaxOutput] = reactExports.useState();
  const [promoLoading, setPromoLoading] = reactExports.useState(false);
  const [promoCodes, setPromoCodes] = reactExports.useState([]);
  const [redemptions, setRedemptions] = reactExports.useState([]);
  const [newPromoCode, setNewPromoCode] = reactExports.useState("");
  const [newPromoRole, setNewPromoRole] = reactExports.useState("basic");
  const [newPromoLimit, setNewPromoLimit] = reactExports.useState();
  const [docPrivacyUrl, setDocPrivacyUrl] = reactExports.useState("");
  const [docSecurityUrl, setDocSecurityUrl] = reactExports.useState("");
  const [requestsLoading, setRequestsLoading] = reactExports.useState(false);
  const [regRequests, setRegRequests] = reactExports.useState([]);
  const [goals, setGoals] = reactExports.useState([]);
  const [goalsLoading, setGoalsLoading] = reactExports.useState(false);
  const [newGoalQuantId, setNewGoalQuantId] = reactExports.useState("");
  const [newGoalPriority, setNewGoalPriority] = reactExports.useState(0.7);
  const [quantsLoading, setQuantsLoading] = reactExports.useState(false);
  const [quants, setQuants] = reactExports.useState([]);
  const [quantDetail, setQuantDetail] = reactExports.useState(null);
  const [quantDetailOpen, setQuantDetailOpen] = reactExports.useState(false);
  const [wsEvents, setWsEvents] = reactExports.useState([]);
  const [audit, setAudit] = reactExports.useState([]);
  const [auditLoading, setAuditLoading] = reactExports.useState(false);
  const [centerId, setCenterId] = reactExports.useState("");
  const [depth, setDepth] = reactExports.useState(2);
  const [subgraph, setSubgraph] = reactExports.useState(null);
  const [vizCenterId, setVizCenterId] = reactExports.useState("");
  const [vizDepth, setVizDepth] = reactExports.useState(2);
  const [vizFilterTag, setVizFilterTag] = reactExports.useState("");
  const [vizMinEnergy, setVizMinEnergy] = reactExports.useState(0);
  const [visualGraph, setVisualGraph] = reactExports.useState(null);
  const [trendThreshold, setTrendThreshold] = reactExports.useState(0.02);
  React.useRef(null);
  const [autoRefreshGraph, setAutoRefreshGraph] = reactExports.useState(false);
  const [neighbors, setNeighbors] = reactExports.useState([]);
  const [neighborLoading, setNeighborLoading] = reactExports.useState(false);
  const [edges, setEdges] = reactExports.useState([]);
  const [hubs, setHubs] = reactExports.useState([]);
  const [tagsTrend, setTagsTrend] = reactExports.useState([]);
  const [metricsLoading, setMetricsLoading] = reactExports.useState(false);
  const [dispatcherSettings, setDispatcherSettings] = reactExports.useState(null);
  const [dispatcherSettingsLoading, setDispatcherSettingsLoading] = reactExports.useState(false);
  const [dispatcherSaving, setDispatcherSaving] = reactExports.useState(false);
  const [dispatcherQueue, setDispatcherQueue] = reactExports.useState([]);
  const [dispatcherQueueLoading, setDispatcherQueueLoading] = reactExports.useState(false);
  const [dispatcherQueueStatus, setDispatcherQueueStatus] = reactExports.useState(void 0);
  const [dispatcherAutoRefresh, setDispatcherAutoRefresh] = reactExports.useState(false);
  const [dispatcherAnalytics, setDispatcherAnalytics] = reactExports.useState([]);
  const [dispatcherAnalyticsLoading, setDispatcherAnalyticsLoading] = reactExports.useState(false);
  const [dispatcherPlanLoading, setDispatcherPlanLoading] = reactExports.useState(false);
  const [dispatcherMatLoading, setDispatcherMatLoading] = reactExports.useState(false);
  const [processorMetrics, setProcessorMetrics] = reactExports.useState(null);
  const [processorLoading, setProcessorLoading] = reactExports.useState(false);
  const [processorAutoRefresh, setProcessorAutoRefresh] = reactExports.useState(false);
  const busy = dispatcherSettingsLoading || dispatcherSaving;
  const [mvStatus, setMvStatus] = reactExports.useState(null);
  const [mvLoading, setMvLoading] = reactExports.useState(false);
  const [policyAnalytics, setPolicyAnalytics] = reactExports.useState([]);
  const [policyAnalyticsLoading, setPolicyAnalyticsLoading] = reactExports.useState(false);
  const [safetyEvents, setSafetyEvents] = reactExports.useState([]);
  const [safetyLoading, setSafetyLoading] = reactExports.useState(false);
  const [redBtnLoading, setRedBtnLoading] = reactExports.useState(false);
  const [optSettings, setOptSettings] = reactExports.useState(null);
  const [optRuns, setOptRuns] = reactExports.useState([]);
  const [optLoading, setOptLoading] = reactExports.useState(false);
  const [optAutoApply, setOptAutoApply] = reactExports.useState(false);
  const [lastOpt, setLastOpt] = reactExports.useState(null);
  const [batchPlanner, setBatchPlanner] = reactExports.useState(null);
  const [plannerParams, setPlannerParams] = reactExports.useState(null);
  const [sleepParams, setSleepParams] = reactExports.useState(null);
  const [autoPublishEnabled, setAutoPublishEnabled] = reactExports.useState(false);
  const [publishMinInterval, setPublishMinInterval] = reactExports.useState(15);
  const [refreshRankMinutes, setRefreshRankMinutes] = reactExports.useState(15);
  const [importLoading, setImportLoading] = reactExports.useState(false);
  const isMiniApp = (() => {
    var _a2;
    try {
      return !!((_a2 = window == null ? void 0 : window.Telegram) == null ? void 0 : _a2.WebApp);
    } catch (e) {
      return false;
    }
  })();
  const [activitiesLoading, setActivitiesLoading] = reactExports.useState(false);
  const [activities, setActivities] = reactExports.useState([]);
  const [newActivityName, setNewActivityName] = reactExports.useState("");
  const [newActivityPriority, setNewActivityPriority] = reactExports.useState(0);
  const [sensationsLoading, setSensationsLoading] = reactExports.useState(false);
  const [sensations, setSensations] = reactExports.useState([]);
  const [newSensationName, setNewSensationName] = reactExports.useState("");
  const [newSensationWeight, setNewSensationWeight] = reactExports.useState(0);
  const [secLoading, setSecLoading] = reactExports.useState(false);
  const [issuedCode, setIssuedCode] = reactExports.useState(null);
  const [energyLoading, setEnergyLoading] = reactExports.useState(false);
  const [energyItems, setEnergyItems] = reactExports.useState([]);
  const [selectedActivityId, setSelectedActivityId] = reactExports.useState(null);
  const [activityDetailLoading, setActivityDetailLoading] = reactExports.useState(false);
  const [activityPermsText, setActivityPermsText] = reactExports.useState("");
  const [activityGoalsJson, setActivityGoalsJson] = reactExports.useState("[]");
  const [activityCron, setActivityCron] = reactExports.useState("");
  const [activityWindowJson, setActivityWindowJson] = reactExports.useState("");
  const [familyUserTgId, setFamilyUserTgId] = reactExports.useState("");
  const [familyContacts, setFamilyContacts] = reactExports.useState([]);
  const [familyLoading, setFamilyLoading] = reactExports.useState(false);
  const [newContactTgId, setNewContactTgId] = reactExports.useState("");
  const [newContactRelation, setNewContactRelation] = reactExports.useState("");
  const [newAllowRead, setNewAllowRead] = reactExports.useState(false);
  const [newAllowSend, setNewAllowSend] = reactExports.useState(false);
  const [selectedContactTgId, setSelectedContactTgId] = reactExports.useState("");
  const [familyMsgText, setFamilyMsgText] = reactExports.useState("");
  const [soulSettings, setSoulSettings] = reactExports.useState([]);
  const [soulSettingsLoading, setSoulSettingsLoading] = reactExports.useState(false);
  const [editingSetting, setEditingSetting] = reactExports.useState(null);
  const [editingValue, setEditingValue] = reactExports.useState("");
  const [soulPrompts, setSoulPrompts] = reactExports.useState([]);
  const [soulPromptsLoading, setSoulPromptsLoading] = reactExports.useState(false);
  const [editingPrompt, setEditingPrompt] = reactExports.useState(null);
  const [editingPromptContent, setEditingPromptContent] = reactExports.useState("");
  const [eidosPassportUrl, setEidosPassportUrl] = reactExports.useState("/docs/ONBOARDING_EIDOS_PASSPORT.md");
  const rawJsonSetting = reactExports.useMemo(() => {
    try {
      return (soulSettings || []).find((it) => it && it.key === "architect_show_raw_quant_json");
    } catch (e) {
      return void 0;
    }
  }, [soulSettings]);
  const monitorAlertEnabled = reactExports.useMemo(() => {
    var _a2;
    try {
      const it = (soulSettings || []).find((x) => x && x.key === "monitor.alert_enabled");
      if (!it) return false;
      const v = String((_a2 = it.value) != null ? _a2 : "").toLowerCase();
      return v === "1" || v === "true";
    } catch (e) {
      return false;
    }
  }, [soulSettings]);
  const monitorExcludeLlmFromP95 = reactExports.useMemo(() => {
    var _a2;
    try {
      const it = (soulSettings || []).find((x) => x && x.key === "monitor.exclude_llm_from_p95");
      if (!it) return true;
      const v = String((_a2 = it.value) != null ? _a2 : "1").toLowerCase();
      return v === "1" || v === "true";
    } catch (e) {
      return true;
    }
  }, [soulSettings]);
  const monitorP95Threshold = reactExports.useMemo(() => {
    var _a2;
    try {
      const it = (soulSettings || []).find((x) => x && x.key === "monitor.p95_threshold");
      const num = parseFloat(String((_a2 = it == null ? void 0 : it.value) != null ? _a2 : "2.5"));
      return isNaN(num) ? 2.5 : num;
    } catch (e) {
      return 2.5;
    }
  }, [soulSettings]);
  const architectReplyModeSetting = reactExports.useMemo(() => {
    try {
      return (soulSettings || []).find((it) => it && it.key === "architect_reply_mode");
    } catch (e) {
      return void 0;
    }
  }, [soulSettings]);
  const [soulLimits, setSoulLimits] = reactExports.useState(null);
  const [soulLimitsLoading, setSoulLimitsLoading] = reactExports.useState(false);
  const buildAuthHeaders = () => {
    var _a2, _b2;
    const headers = { "Content-Type": "application/json" };
    const tgId = sessionStorage.getItem("tg_id") || ((_b2 = (_a2 = getTelegramUser()) == null ? void 0 : _a2.id) == null ? void 0 : _b2.toString());
    if (tgId) headers["X-Telegram-User-ID"] = tgId;
    const token = sessionStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };
  const changed = reactExports.useMemo(() => {
    if (!original) return false;
    return original.recentRatio !== recentRatio || original.useEmotionWeights !== useEmotionWeights;
  }, [original, recentRatio, useEmotionWeights]);
  const load = async () => {
    try {
      setLoading(true);
      const resp = await fetch("/api/llm/functions", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const chat = data.find((f) => f.function_name === "chat");
      const s = parseSettings(chat == null ? void 0 : chat.settings_json);
      const rr = typeof s.history_recent_ratio === "number" ? s.history_recent_ratio : 0.3;
      const em = typeof s.use_emotion_weights === "boolean" ? s.use_emotion_weights : true;
      setRecentRatio(Math.max(0, Math.min(1, rr)));
      setUseEmotionWeights(em);
      setOriginal({ recentRatio: Math.max(0, Math.min(1, rr)), useEmotionWeights: em });
    } catch (e) {
      staticMethods.error("Ошибка загрузки настроек функции chat");
    } finally {
      setLoading(false);
    }
  };
  const loadEidosPassportUrl = async () => {
    try {
      const resp = await fetch("/api/admin/soul/settings/get_kv?key=eidos.passport_url", { headers: buildAuthHeaders() });
      if (resp.ok) {
        const data = await resp.json();
        const v = data && (data.value || data.val || data.url);
        if (v && typeof v === "string" && v.trim()) setEidosPassportUrl(v.trim());
      }
    } catch (e) {
    }
  };
  const loadProcessorMetrics = async () => {
    try {
      setProcessorLoading(true);
      const resp = await fetch("/api/admin/soul/processor/metrics", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setProcessorMetrics(data);
    } catch (e) {
      staticMethods.error("Не удалось загрузить метрики Процессора");
    } finally {
      setProcessorLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (!processorAutoRefresh) return;
    const id = window.setInterval(() => {
      void loadProcessorMetrics();
    }, 5e3);
    return () => window.clearInterval(id);
  }, [processorAutoRefresh]);
  reactExports.useEffect(() => {
    void loadEidosPassportUrl();
  }, []);
  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const resp = await fetch("/api/admin/activities", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setActivities(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить Активности");
    } finally {
      setActivitiesLoading(false);
    }
  };
  const createActivity = async () => {
    if (!newActivityName.trim()) {
      staticMethods.warning("Укажите название Активности");
      return;
    }
    try {
      setActivitiesLoading(true);
      const body = { name: newActivityName.trim(), priority: Number(newActivityPriority || 0) };
      const resp = await fetch("/api/admin/activities", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify(body) });
      if (!resp.ok) throw new Error();
      setNewActivityName("");
      setNewActivityPriority(0);
      await loadActivities();
      staticMethods.success("Активность создана");
    } catch (e) {
      staticMethods.error("Не удалось создать Активность");
    } finally {
      setActivitiesLoading(false);
    }
  };
  const loadSensations = async () => {
    try {
      setSensationsLoading(true);
      const resp = await fetch("/api/admin/activities/sensations", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setSensations(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить Ощущения");
    } finally {
      setSensationsLoading(false);
    }
  };
  const createSensation = async () => {
    if (!newSensationName.trim()) {
      staticMethods.warning("Укажите название Ощущения");
      return;
    }
    try {
      setSensationsLoading(true);
      const body = { name: newSensationName.trim(), weight: Number(newSensationWeight || 0) };
      const resp = await fetch("/api/admin/activities/sensations", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify(body) });
      if (!resp.ok) throw new Error();
      setNewSensationName("");
      setNewSensationWeight(0);
      await loadSensations();
      staticMethods.success("Ощущение создано");
    } catch (e) {
      staticMethods.error("Не удалось создать Ощущение");
    } finally {
      setSensationsLoading(false);
    }
  };
  const updateSensation = async (row, patch) => {
    try {
      const resp = await fetch(`/api/admin/activities/sensations/${row.id}`, { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify(patch) });
      if (!resp.ok) throw new Error();
      await loadSensations();
      staticMethods.success("Сохранено");
    } catch (e) {
      staticMethods.error("Не удалось сохранить");
    }
  };
  const issueArchitectCode = async () => {
    try {
      setSecLoading(true);
      const resp = await fetch("/api/miniapp/auth/issue-architect-code", { method: "POST", headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setIssuedCode(data.code || null);
      staticMethods.success("Код выдан");
    } catch (e) {
      staticMethods.error("Не удалось выдать код");
    } finally {
      setSecLoading(false);
    }
  };
  const loadEnergy = async () => {
    try {
      setEnergyLoading(true);
      const resp = await fetch("/api/admin/energy/balance?hours=48", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setEnergyItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить энергобаланс");
    } finally {
      setEnergyLoading(false);
    }
  };
  const loadActivityDetail = async (id) => {
    try {
      setActivityDetailLoading(true);
      const resp = await fetch(`/api/admin/activities/${id}/detail`, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setSelectedActivityId(id);
      setActivityPermsText((data.permissions || []).join(", "));
      setActivityGoalsJson(JSON.stringify(data.goals || [], null, 2));
      const sched = data.schedule || {};
      setActivityCron(sched.cron || "");
      setActivityWindowJson(sched.window ? JSON.stringify(sched.window, null, 2) : "");
    } catch (e) {
      staticMethods.error("Не удалось загрузить детали Активности");
    } finally {
      setActivityDetailLoading(false);
    }
  };
  const saveActivityPermissions = async () => {
    if (!selectedActivityId) return;
    try {
      const list = activityPermsText.split(",").map((s) => s.trim()).filter(Boolean);
      const resp = await fetch(`/api/admin/activities/${selectedActivityId}/permissions`, { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify({ permissions: list }) });
      if (!resp.ok) throw new Error();
      staticMethods.success("Права сохранены");
    } catch (e) {
      staticMethods.error("Не удалось сохранить права");
    }
  };
  const saveActivityGoals = async () => {
    if (!selectedActivityId) return;
    try {
      let goals2 = [];
      if (activityGoalsJson.trim()) goals2 = JSON.parse(activityGoalsJson);
      const resp = await fetch(`/api/admin/activities/${selectedActivityId}/goals`, { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify({ goals: goals2 }) });
      if (!resp.ok) throw new Error();
      staticMethods.success("Цели сохранены");
    } catch (e) {
      staticMethods.error("Некорректный JSON целей или ошибка сохранения");
    }
  };
  const saveActivitySchedule = async () => {
    if (!selectedActivityId) return;
    try {
      let windowObj = null;
      if (activityWindowJson.trim()) windowObj = JSON.parse(activityWindowJson);
      const resp = await fetch(`/api/admin/activities/${selectedActivityId}/schedule`, { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify({ cron: activityCron || null, window: windowObj }) });
      if (!resp.ok) throw new Error();
      staticMethods.success("Расписание сохранено");
    } catch (e) {
      staticMethods.error("Некорректный JSON окна или ошибка сохранения");
    }
  };
  const refreshEnergy = async () => {
    try {
      setEnergyLoading(true);
      const resp = await fetch("/api/admin/energy/refresh", { method: "POST", headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      staticMethods.success("Энергобаланс обновлён");
      await loadEnergy();
    } catch (e) {
      staticMethods.error("Не удалось обновить энергобаланс");
    } finally {
      setEnergyLoading(false);
    }
  };
  const loadFamily = async () => {
    if (!familyUserTgId.trim()) {
      staticMethods.warning("Укажите TG ID пользователя");
      return;
    }
    try {
      setFamilyLoading(true);
      const resp = await fetch(`/api/admin/family/contacts?user_tg_id=${encodeURIComponent(familyUserTgId)}`, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setFamilyContacts(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить контакты");
    } finally {
      setFamilyLoading(false);
    }
  };
  const saveFamilyContact = async (contact) => {
    var _a2;
    if (!familyUserTgId.trim()) {
      staticMethods.warning("Укажите TG ID пользователя");
      return;
    }
    try {
      setFamilyLoading(true);
      const body = {
        user_tg_id: Number(familyUserTgId),
        contact_tg_id: Number(contact.contact_tg_id),
        relation: (_a2 = contact.relation) != null ? _a2 : "",
        allow_read: !!contact.allow_read,
        allow_send: !!contact.allow_send
      };
      const resp = await fetch("/api/admin/family/contacts", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify(body) });
      if (!resp.ok) throw new Error();
      await loadFamily();
      staticMethods.success("Контакт сохранён");
    } catch (e) {
      staticMethods.error("Не удалось сохранить контакт");
    } finally {
      setFamilyLoading(false);
    }
  };
  const deleteFamilyContact = async (contact_tg_id) => {
    if (!familyUserTgId.trim()) {
      staticMethods.warning("Укажите TG ID пользователя");
      return;
    }
    try {
      setFamilyLoading(true);
      const resp = await fetch(`/api/admin/family/contacts?user_tg_id=${encodeURIComponent(familyUserTgId)}&contact_tg_id=${encodeURIComponent(String(contact_tg_id))}`, { method: "DELETE", headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      await loadFamily();
      staticMethods.success("Контакт удалён");
    } catch (e) {
      staticMethods.error("Не удалось удалить контакт");
    } finally {
      setFamilyLoading(false);
    }
  };
  const sendFamilyMessage = async () => {
    if (!familyUserTgId.trim() || !selectedContactTgId.trim() || !familyMsgText.trim()) {
      staticMethods.warning("Укажите TG ID пользователя, контакт и текст");
      return;
    }
    try {
      setFamilyLoading(true);
      const body = { user_tg_id: Number(familyUserTgId), contact_tg_id: Number(selectedContactTgId), text: familyMsgText };
      const resp = await fetch("/api/admin/family/send", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify(body) });
      if (!resp.ok) throw new Error();
      staticMethods.success("Отправлено");
      setFamilyMsgText("");
    } catch (e) {
      staticMethods.error("Не удалось отправить сообщение");
    } finally {
      setFamilyLoading(false);
    }
  };
  const save = async () => {
    try {
      setLoading(true);
      const body = {
        settings_json: JSON.stringify({ history_recent_ratio: recentRatio, use_emotion_weights: useEmotionWeights })
      };
      const resp = await fetch("/api/llm/functions/chat", {
        method: "PUT",
        headers: buildAuthHeaders(),
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      staticMethods.success("Настройки сохранены");
      setOriginal({ recentRatio, useEmotionWeights });
    } catch (e) {
      staticMethods.error("Не удалось сохранить настройки");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (isMiniApp) {
      try {
        setLoading(false);
      } catch (e) {
      }
      return;
    }
    load();
    loadDispatcherSettings();
    loadProcessorMetrics();
    void loadRoles();
    void loadPermissions();
    void loadLlmModels();
    void loadLimits();
    void loadPromo();
    void loadRedemptions();
    void loadRequests();
    void loadDocLinks();
    void loadGoals();
    void loadRecentQuants();
    void loadSoulSettings();
    void loadSoulPrompts();
    void loadSoulLimits();
    try {
      const proto = window.location.protocol === "https:" ? "wss" : "ws";
      const wsUrl = `${proto}://${window.location.host}/ws/soul/updates`;
      const ws = new WebSocket(wsUrl);
      ws.onmessage = (ev) => {
        try {
          setWsEvents((prev) => [JSON.parse(ev.data), ...prev].slice(0, 50));
        } catch (e) {
        }
      };
      ws.onerror = () => {
      };
    } catch (e) {
    }
  }, []);
  const loadDispatcherSettings = async () => {
    try {
      setDispatcherSettingsLoading(true);
      const resp = await fetch("/api/admin/dispatcher/settings", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setDispatcherSettings(data || {});
    } catch (e) {
      staticMethods.error("Ошибка загрузки настроек диспетчера");
    } finally {
      setDispatcherSettingsLoading(false);
    }
  };
  const saveDispatcherSettings = async () => {
    if (!dispatcherSettings) return;
    try {
      const payload = { ...dispatcherSettings };
      if (typeof payload.schedule_budgets === "string" && payload.schedule_budgets.trim()) {
        try {
          payload.schedule_budgets = JSON.parse(payload.schedule_budgets);
        } catch (e) {
          staticMethods.error("Некорректный JSON в поле schedule_budgets");
          return;
        }
      }
      if (typeof payload.ab_test_policies === "string" && payload.ab_test_policies.trim()) {
        try {
          payload.ab_test_policies = JSON.parse(payload.ab_test_policies);
        } catch (e) {
          staticMethods.error("Некорректный JSON в поле ab_test_policies");
          return;
        }
      }
      setDispatcherSaving(true);
      const resp = await fetch("/api/admin/dispatcher/settings", {
        method: "PUT",
        headers: buildAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      staticMethods.success("Настройки диспетчера сохранены");
      await loadDispatcherSettings();
    } catch (e) {
      staticMethods.error("Не удалось сохранить настройки");
    } finally {
      setDispatcherSaving(false);
    }
  };
  const loadDispatcherQueue = async () => {
    try {
      setDispatcherQueueLoading(true);
      const q = dispatcherQueueStatus ? `?status=${encodeURIComponent(dispatcherQueueStatus)}` : "";
      const resp = await fetch(`/api/admin/dispatcher/queue${q}`, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setDispatcherQueue(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки очереди диспетчера");
    } finally {
      setDispatcherQueueLoading(false);
    }
  };
  const loadDispatcherAnalytics = async () => {
    try {
      setDispatcherAnalyticsLoading(true);
      const resp = await fetch("/api/admin/dispatcher/metrics", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setDispatcherAnalytics(Array.isArray(data.analytics) ? data.analytics : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки аналитики");
    } finally {
      setDispatcherAnalyticsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (!dispatcherAutoRefresh) return;
    const id = window.setInterval(() => {
      void loadDispatcherQueue();
      void loadDispatcherAnalytics();
    }, 1e4);
    return () => window.clearInterval(id);
  }, [dispatcherAutoRefresh, dispatcherQueueStatus]);
  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const resp = await fetch("/api/admin/rbac/roles", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки ролей (RBAC)");
    } finally {
      setRolesLoading(false);
    }
  };
  const loadSoulLimits = async () => {
    try {
      setSoulLimitsLoading(true);
      const resp = await fetch("/api/admin/soul/settings/limits", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setSoulLimits({
        quant_daily_time_free_minutes: Number(data.quant_daily_time_free_minutes || 0),
        quant_daily_time_paid_minutes: Number(data.quant_daily_time_paid_minutes || 0),
        quant_daily_token_limit: Number(data.quant_daily_token_limit || 0),
        quant_token_cost_per_1k: Number(data.quant_token_cost_per_1k || 0),
        service_free_daily_time_minutes: Number(data.service_free_daily_time_minutes || 0),
        service_uses_quant_limits: Boolean(data.service_uses_quant_limits)
      });
    } catch (e) {
      staticMethods.error("Ошибка загрузки лимитов Soul");
    } finally {
      setSoulLimitsLoading(false);
    }
  };
  const saveSoulLimits = async () => {
    if (!soulLimits) return;
    try {
      setSoulLimitsLoading(true);
      const resp = await fetch("/api/admin/soul/settings/limits", {
        method: "PUT",
        headers: buildAuthHeaders(),
        body: JSON.stringify(soulLimits)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      await loadSoulLimits();
      staticMethods.success("Лимиты сохранены");
    } catch (e) {
      staticMethods.error("Не удалось сохранить лимиты");
    } finally {
      setSoulLimitsLoading(false);
    }
  };
  const loadPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const resp = await fetch("/api/admin/rbac/permissions", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setPermissions(Array.isArray(data) ? data : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки прав");
    } finally {
      setPermissionsLoading(false);
    }
  };
  const loadLlmModels = async () => {
    try {
      const resp = await fetch("/api/llm/models", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setLlmModels(Array.isArray(data) ? data : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки LLM моделей");
    }
  };
  const loadLimits = async () => {
    try {
      setLimitsLoading(true);
      const resp = await fetch("/api/admin/rbac/llm-role-limits", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setLimits(Array.isArray(data) ? data : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки лимитов");
    } finally {
      setLimitsLoading(false);
    }
  };
  const createRole = async () => {
    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      staticMethods.warning("Введите имя роли");
      return;
    }
    if (trimmedName.length < 2) {
      staticMethods.warning("Имя роли должно содержать минимум 2 символа");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
      staticMethods.warning("Имя роли может содержать только буквы, цифры, _ и -");
      return;
    }
    if (roles.some((r) => r.name.toLowerCase() === trimmedName.toLowerCase())) {
      staticMethods.warning("Роль с таким именем уже существует");
      return;
    }
    try {
      setRolesLoading(true);
      const resp = await fetch("/api/admin/rbac/roles", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({
          name: trimmedName,
          description: newRoleDesc.trim() || void 0,
          is_system: false
        })
      });
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${resp.status}`);
      }
      setNewRoleName("");
      setNewRoleDesc("");
      await loadRoles();
      staticMethods.success(`Роль "${trimmedName}" успешно создана`);
    } catch (e) {
      console.error("Error creating role:", e);
      staticMethods.error(`Не удалось создать роль: ${e instanceof Error ? e.message : "Неизвестная ошибка"}`);
    } finally {
      setRolesLoading(false);
    }
  };
  const createPermission = async () => {
    const trimmedKey = newPermKey.trim();
    if (!trimmedKey) {
      staticMethods.warning("Введите ключ права");
      return;
    }
    if (trimmedKey.length < 3) {
      staticMethods.warning("Ключ права должен содержать минимум 3 символа");
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(trimmedKey)) {
      staticMethods.warning("Ключ права может содержать только буквы, цифры, точки, _ и -");
      return;
    }
    if (permissions.some((p) => p.key.toLowerCase() === trimmedKey.toLowerCase())) {
      staticMethods.warning("Право с таким ключом уже существует");
      return;
    }
    try {
      const resp = await fetch("/api/admin/rbac/permissions", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({
          key: trimmedKey,
          description: newPermDesc.trim() || void 0
        })
      });
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${resp.status}`);
      }
      setNewPermKey("");
      setNewPermDesc("");
      await loadPermissions();
      staticMethods.success(`Право "${trimmedKey}" успешно создано`);
    } catch (e) {
      console.error("Error creating permission:", e);
      staticMethods.error(`Не удалось создать право: ${e instanceof Error ? e.message : "Неизвестная ошибка"}`);
    }
  };
  const createLimit = async () => {
    if (!selectedRoleForLimit) {
      staticMethods.warning("Выберите роль");
      return;
    }
    if (!limitDailyReqs && !limitMaxOutput) {
      staticMethods.warning("Укажите хотя бы один лимит (дневные запросы или токены)");
      return;
    }
    if (limitDailyReqs && (limitDailyReqs < 1 || limitDailyReqs > 1e4)) {
      staticMethods.warning("Дневные запросы должны быть от 1 до 10000");
      return;
    }
    if (limitMaxOutput && (limitMaxOutput < 1 || limitMaxOutput > 1e5)) {
      staticMethods.warning("Максимум токенов должен быть от 1 до 100000");
      return;
    }
    const existingLimit = limits.find((l) => l.role_id === selectedRoleForLimit && l.function_name === "chat");
    if (existingLimit) {
      staticMethods.warning("Лимит для этой роли уже существует. Удалите существующий или измените роль.");
      return;
    }
    try {
      const resp = await fetch("/api/admin/rbac/llm-role-limits", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({
          role_id: selectedRoleForLimit,
          function_name: "chat",
          daily_requests: limitDailyReqs || null,
          max_output_tokens: limitMaxOutput || null,
          priority: 1
        })
      });
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${resp.status}`);
      }
      const selectedRole = roles.find((r) => r.id === selectedRoleForLimit);
      setSelectedRoleForLimit(void 0);
      setLimitDailyReqs(void 0);
      setLimitMaxOutput(void 0);
      await loadLimits();
      staticMethods.success(`Лимит для роли "${selectedRole == null ? void 0 : selectedRole.name}" успешно создан`);
    } catch (e) {
      console.error("Error creating limit:", e);
      staticMethods.error(`Не удалось создать лимит: ${e instanceof Error ? e.message : "Неизвестная ошибка"}`);
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
  const loadDocLinks = async () => {
    var _a2, _b2;
    try {
      const resp = await fetch("/api/admin/settings?keys=registration.privacy_url,registration.security_url", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      setDocPrivacyUrl(((_a2 = data.items) == null ? void 0 : _a2["registration.privacy_url"]) || "");
      setDocSecurityUrl(((_b2 = data.items) == null ? void 0 : _b2["registration.security_url"]) || "");
    } catch (e) {
    }
  };
  const loadGoals = async () => {
    try {
      setGoalsLoading(true);
      const resp = await fetch("/api/admin/soul/goals", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setGoals(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки целей");
    } finally {
      setGoalsLoading(false);
    }
  };
  const loadRecentQuants = async () => {
    try {
      setQuantsLoading(true);
      const resp = await fetch("/api/admin/soul/graph/recent_quants", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setQuants(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки квантов");
    } finally {
      setQuantsLoading(false);
    }
  };
  const loadVisualGraph = async () => {
    const cid = vizCenterId.trim();
    if (!cid) {
      staticMethods.warning("Укажите center_id");
      return;
    }
    try {
      const resp = await fetch(`/api/admin/soul/graph/visual_subgraph?center_id=${encodeURIComponent(cid)}&depth=${vizDepth}`, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      let nodes = Array.isArray(data.nodes) ? data.nodes : [];
      let edges2 = Array.isArray(data.edges) ? data.edges : [];
      if (vizFilterTag.trim()) {
        const tag = vizFilterTag.trim();
        const allowed = new Set(nodes.filter((n) => Array.isArray(n.tags) && n.tags.includes(tag)).map((n) => n.id));
        edges2 = edges2.filter((e) => allowed.has(e.source) || allowed.has(e.target));
        const keep = /* @__PURE__ */ new Set();
        edges2.forEach((e) => {
          keep.add(e.source);
          keep.add(e.target);
        });
        nodes = nodes.filter((n) => keep.has(n.id));
      }
      if (vizMinEnergy > 0) {
        nodes = nodes.filter((n) => (n.energy_weight || 0) >= vizMinEnergy);
        const keep = new Set(nodes.map((n) => n.id));
        edges2 = edges2.filter((e) => keep.has(e.source) && keep.has(e.target));
      }
      setVisualGraph({ nodes, edges: edges2 });
    } catch (e) {
      staticMethods.error("Ошибка загрузки визуального подграфа");
    }
  };
  const loadMetrics = async () => {
    try {
      setMetricsLoading(true);
      const [eResp, hResp, tResp] = await Promise.all([
        fetch(`/api/admin/soul/graph/strong_edges?min_strength=0.4&limit=100`, { headers: buildAuthHeaders() }),
        fetch(`/api/admin/soul/graph/hubs?min_strength=0.3&limit=50`, { headers: buildAuthHeaders() }),
        fetch(`/api/admin/soul/graph/trending_tags?since_hours=168&limit=50`, { headers: buildAuthHeaders() })
      ]);
      if (!eResp.ok || !hResp.ok || !tResp.ok) throw new Error("HTTP");
      const e = await eResp.json();
      const h = await hResp.json();
      const t = await tResp.json();
      setEdges(Array.isArray(e.items) ? e.items : []);
      setHubs(Array.isArray(h.items) ? h.items : []);
      setTagsTrend(Array.isArray(t.items) ? t.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки метрик");
    } finally {
      setMetricsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (!autoRefreshGraph) return;
    if (!vizCenterId) return;
    void loadVisualGraph();
  }, [wsEvents.length, autoRefreshGraph]);
  const loadSoulSettings = async () => {
    try {
      setSoulSettingsLoading(true);
      const resp = await fetch("/api/admin/soul/settings/all", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setSoulSettings(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки настроек Soul");
    } finally {
      setSoulSettingsLoading(false);
    }
  };
  const updateSoulSetting = async (key, value) => {
    try {
      const resp = await fetch("/api/admin/soul/settings", {
        method: "PUT",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ key, value })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      staticMethods.success(`Настройка "${key}" обновлена`);
      await loadSoulSettings();
    } catch (e) {
      staticMethods.error("Не удалось обновить настройку");
    }
  };
  const loadSoulPrompts = async () => {
    try {
      setSoulPromptsLoading(true);
      const resp = await fetch("/api/admin/soul/prompts/all", { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setSoulPrompts(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки промптов Soul");
    } finally {
      setSoulPromptsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%", overflowX: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 3, style: { marginBottom: 16 }, children: "Панель Архитектора" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { defaultActiveKey: "home", items: [
      {
        key: "home",
        label: "Главная",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                hoverable: true,
                onClick: () => go("/grafana?target=ml"),
                style: { borderRadius: "var(--sp-radius-lg)", background: "var(--sp-bg-card)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 4, style: { margin: 0 }, children: "ML Dashboard" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "Эмбеддинги / тренировка / ingest" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", children: "Открыть" })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                hoverable: true,
                onClick: () => go("/grafana?target=sys"),
                style: { borderRadius: "var(--sp-radius-lg)", background: "var(--sp-bg-card)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 4, style: { margin: 0 }, children: "System Metrics" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "CPU/Memory, ошибки, p95 (24h)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", children: "Открыть" })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                hoverable: true,
                onClick: () => go("/grafana?target=prom"),
                style: { borderRadius: "var(--sp-radius-lg)", background: "var(--sp-bg-card)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 4, style: { margin: 0 }, children: "Метрики (Prometheus)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "Трассы, p95, события" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", children: "Открыть" })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                hoverable: true,
                onClick: () => go("/grafana?target=aux"),
                style: { borderRadius: "var(--sp-radius-lg)", background: "var(--sp-bg-card)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 4, style: { margin: 0 }, children: "Aux LLM / LIMA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "LIMA health, latency, Aux LLM" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", children: "Открыть" })
                ] })
              }
            ) }),
            [
              { title: "LLM настройки", desc: "Провайдеры и параметры", route: "/llm-settings", emoji: "🧠" },
              { title: "Ключевые слова", desc: "Словарь и теги", route: "/keywords", emoji: "🏷️" },
              { title: "Дашборд", desc: "KPI и статус", route: "/soul/dashboard", emoji: "📊" },
              { title: "Monitoring", desc: "Снимки и метрики", route: "/architect/monitoring", emoji: "📈" },
              { title: "Цели Soul", desc: "Цели и приоритеты", route: "/soul/goals", emoji: "🎯" },
              { title: "Кванты", desc: "Поиск и массовые операции", route: "/soul/quants", emoji: "🧩" },
              { title: "Оптимизация", desc: "Планировщик и авто", route: "/soul/optimization", emoji: "⚙️" },
              { title: "Визуализация", desc: "Граф сознания", route: "/soul/visualization", emoji: "🌐" },
              { title: "Логи", desc: "Потоки событий", route: "/soul/logs", emoji: "📜" },
              { title: "Трасировка", desc: "Цепочка запроса", route: "/trace", emoji: "🧭" },
              { title: "Инциденты", desc: "Список и детали", route: "/incidents", emoji: "🚨" }
            ].map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 8, lg: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                hoverable: true,
                onClick: () => go(it.route),
                style: { borderRadius: "var(--sp-radius-lg)", background: "var(--sp-bg-card)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography.Title, { level: 4, style: { margin: 0 }, children: [
                    it.emoji,
                    " ",
                    it.title
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: it.desc }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", children: "Открыть" })
                ] })
              }
            ) }, it.title))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [8, 8], style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Паспорт Эйдоса", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => {
            try {
              window.open(eidosPassportUrl, "_blank");
            } catch (e) {
            }
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { size: 6, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { size: 16, src: "/assets/eidos_icon.svg" }),
            "Паспорт Эйдоса"
          ] }) }) }) }) })
        ] })
      },
      {
        key: "monitoring",
        label: "Мониторинг",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Системный мониторинг", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Отправлять алерты" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: monitorAlertEnabled,
                  onChange: async (checked) => {
                    try {
                      const resp = await fetch(`/api/admin/soul/settings`, {
                        method: "PUT",
                        headers: buildAuthHeaders(),
                        body: JSON.stringify({ key: "monitor.alert_enabled", value: checked ? "1" : "0" })
                      });
                      if (!resp.ok) throw new Error();
                      staticMethods.success("Настройка алертов сохранена");
                      await loadSoulSettings();
                    } catch (e) {
                      staticMethods.error("Не удалось сохранить настройку алертов");
                    }
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Исключить llmtest из p95" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: monitorExcludeLlmFromP95,
                  onChange: async (checked) => {
                    try {
                      const resp = await fetch(`/api/admin/soul/settings`, {
                        method: "PUT",
                        headers: buildAuthHeaders(),
                        body: JSON.stringify({ key: "monitor.exclude_llm_from_p95", value: checked ? "1" : "0" })
                      });
                      if (!resp.ok) throw new Error();
                      staticMethods.success("Настройка p95 сохранена");
                      await loadSoulSettings();
                    } catch (e) {
                      staticMethods.error("Не удалось сохранить настройку p95");
                    }
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Порог p95, сек" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TypedInputNumber,
                {
                  min: 0.5,
                  max: 30,
                  step: 0.1,
                  value: monitorP95Threshold,
                  onChange: async (val) => {
                    try {
                      const v = Number(val || 2.5);
                      const resp = await fetch(`/api/admin/soul/settings`, {
                        method: "PUT",
                        headers: buildAuthHeaders(),
                        body: JSON.stringify({ key: "monitor.p95_threshold", value: String(v) })
                      });
                      if (!resp.ok) throw new Error();
                      staticMethods.success("Порог p95 сохранён");
                      await loadSoulSettings();
                    } catch (e) {
                      staticMethods.error("Не удалось сохранить порог p95");
                    }
                  }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Процессор (P30)", loading: processorLoading, style: { marginTop: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => loadProcessorMetrics(), children: "Обновить" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: processorAutoRefresh, onChange: setProcessorAutoRefresh }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: "secondary", children: "Автообновление 5с" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
                try {
                  const resp = await fetch("/api/admin/soul/processor/process_once", { method: "POST", headers: buildAuthHeaders() });
                  if (!resp.ok) throw new Error();
                  staticMethods.success("Обработано");
                  await loadProcessorMetrics();
                } catch (e) {
                  staticMethods.error("Не удалось обработать");
                }
              }, children: "Process Once" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
                try {
                  const id = window.prompt("Введите UUID события для обработки");
                  if (!id) return;
                  const resp = await fetch(`/api/admin/soul/processor/process_event/${encodeURIComponent(id)}`, { method: "POST", headers: buildAuthHeaders() });
                  if (!resp.ok) throw new Error();
                  staticMethods.success("Событие обработано");
                  await loadProcessorMetrics();
                } catch (e) {
                  staticMethods.error("Не удалось обработать событие по ID");
                }
              }, children: "Process by ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
                try {
                  await fetch("/api/admin/soul/processor/start", { method: "POST", headers: buildAuthHeaders() });
                  staticMethods.success("Processor enabled");
                  await loadProcessorMetrics();
                } catch (e) {
                  staticMethods.error("Не удалось запустить");
                }
              }, children: "Start" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
                try {
                  await fetch("/api/admin/soul/processor/stop", { method: "POST", headers: buildAuthHeaders() });
                  staticMethods.success("Processor disabled");
                  await loadProcessorMetrics();
                } catch (e) {
                  staticMethods.error("Не удалось остановить");
                }
              }, children: "Stop" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [12, 12], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "16px", fontWeight: 700 }, children: (_b = (_a = processorMetrics == null ? void 0 : processorMetrics.queue) == null ? void 0 : _a.pending) != null ? _b : 0 })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Dispatched" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 700 }, children: (_d = (_c = processorMetrics == null ? void 0 : processorMetrics.queue) == null ? void 0 : _c.dispatched) != null ? _d : 0 })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Processed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 700 }, children: (_f = (_e = processorMetrics == null ? void 0 : processorMetrics.queue) == null ? void 0 : _e.processed) != null ? _f : 0 })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Skipped" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 700 }, children: (_h = (_g = processorMetrics == null ? void 0 : processorMetrics.queue) == null ? void 0 : _g.skipped) != null ? _h : 0 })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Queue Len" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 700 }, children: (_j = (_i = processorMetrics == null ? void 0 : processorMetrics.queue) == null ? void 0 : _i.queue_len) != null ? _j : 0 })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [12, 12], children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "p95 perceive, ms" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_l = (_k = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _k.perceive_ms) != null ? _l : "—" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "p95 decide, ms" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_n = (_m = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _m.decide_ms) != null ? _n : "—" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "p95 act, ms" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_p = (_o = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _o.act_ms) != null ? _p : "—" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "p95 observe, ms" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_r = (_q = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _q.observe_ms) != null ? _r : "—" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "p95 e2e, ms" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_t = (_s = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _s.e2e_ms) != null ? _t : "—" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Guard pass (p95)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_v = (_u = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _u.guard_pass) != null ? _v : "—" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Signature coverage (p95)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_x = (_w = processorMetrics == null ? void 0 : processorMetrics.p95) == null ? void 0 : _w.coverage) != null ? _x : "—" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [12, 12], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, sm: 12, md: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Incidents rate/min" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18 }, children: (_y = processorMetrics == null ? void 0 : processorMetrics.incidents_rate_per_min) != null ? _y : "—" })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Инциденты (последние 10)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { whiteSpace: "pre-wrap", margin: 0 }, children: JSON.stringify((_z = processorMetrics == null ? void 0 : processorMetrics.incidents) != null ? _z : [], null, 2) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Monitoring Dashboard (встроенный)", style: { marginTop: "var(--sp-spacing-sm)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArchitectMonitoring, {}) }) })
        ] })
      },
      {
        key: "history",
        label: "Настройки истории",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { loading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Доля последних сообщений (recent), 0.0 — 1.0 (по умолчанию 0.3)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", wrap: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                min: 0,
                max: 1,
                step: 0.05,
                style: { width: 240 },
                value: recentRatio,
                onChange: (v) => setRecentRatio(typeof v === "number" ? v : 0.3)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                min: 0,
                max: 1,
                step: 0.05,
                value: recentRatio,
                onChange: (v) => setRecentRatio(typeof v === "number" ? v : 0.3)
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Использовать веса эмоций (EmotionEntry) для приоритезации", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: useEmotionWeights, onChange: setUseEmotionWeights }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: save, disabled: !changed, children: "Сохранить" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: load, disabled: loading, children: "Обновить" })
          ] })
        ] }) })
      },
      {
        key: "v8_activities",
        label: "Активности (v8)",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Активности", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Название Активности", style: { width: 320 }, value: newActivityName, onChange: (e) => setNewActivityName(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "0", value: newActivityPriority, onChange: (v) => setNewActivityPriority(Number(v || 0)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: createActivity, loading: activitiesLoading, children: "Создать" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadActivities, loading: activitiesLoading, children: "Обновить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForwardTable,
            {
              size: "small",
              loading: activitiesLoading,
              rowKey: (r) => r.id,
              dataSource: activities,
              columns: [
                { title: "id", dataIndex: "id", width: 280 },
                { title: "name", dataIndex: "name", width: 220 },
                { title: "priority", dataIndex: "priority", width: 100 },
                { title: "detail", width: 120, render: (_, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => loadActivityDetail(row.id), children: "Открыть" }) }
              ],
              pagination: { pageSize: 8 }
            }
          ),
          selectedActivityId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: `Детали Активности: ${selectedActivityId}`, style: { marginTop: 12 }, loading: activityDetailLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 12, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Права (через запятую)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 4, value: activityPermsText, onChange: (e) => setActivityPermsText(e.target.value) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveActivityPermissions, children: "Сохранить права" }) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Цели (JSON массив объектов: goal_id, goal_type, metrics)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 8, value: activityGoalsJson, onChange: (e) => setActivityGoalsJson(e.target.value) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveActivityGoals, children: "Сохранить цели" }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 12, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { layout: "vertical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "CRON расписание (опц.)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "0 18 * * *", value: activityCron, onChange: (e) => setActivityCron(e.target.value) }) }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { layout: "vertical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: 'Окно (JSON, напр.: {"from":"18:00","to":"21:00"})', children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 2, value: activityWindowJson, onChange: (e) => setActivityWindowJson(e.target.value) }) }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveActivitySchedule, children: "Сохранить расписание" }) })
          ] })
        ] })
      },
      {
        key: "v8_sensations",
        label: "Ощущения (v8)",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Ощущения", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Название Ощущения", style: { width: 320 }, value: newSensationName, onChange: (e) => setNewSensationName(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { placeholder: "0.0", step: 0.1, value: newSensationWeight, onChange: (v) => setNewSensationWeight(Number(v || 0)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: createSensation, loading: sensationsLoading, children: "Создать" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadSensations, loading: sensationsLoading, children: "Обновить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForwardTable,
            {
              size: "small",
              loading: sensationsLoading,
              rowKey: (r) => r.id,
              dataSource: sensations,
              columns: [
                { title: "id", dataIndex: "id", width: 260 },
                { title: "name", dataIndex: "name", width: 200 },
                { title: "enabled", dataIndex: "enabled", width: 100, render: (v, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!v, onChange: (val) => updateSensation(row, { enabled: val }) }) },
                { title: "weight", dataIndex: "weight", width: 120, render: (v, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { value: Number(v || 0), step: 0.1, onChange: (nv) => updateSensation(row, { weight: Number(nv || 0) }) }) }
              ],
              pagination: { pageSize: 8 }
            }
          )
        ] })
      },
      {
        key: "v8_security",
        label: "Безопасность общения",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Инициирующий пароль Архитектора", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography.Paragraph, { children: [
            "Выдайте одноразовый код. В Telegram отправьте: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/login <КОД>" }),
            ". Доступ действует 24 часа."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: issueArchitectCode, loading: secLoading, children: "Выдать код" }),
            issuedCode && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { code: true, children: issuedCode })
          ] })
        ] })
      },
      {
        key: "v8_energy",
        label: "Энергобаланс (v8)",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Энергобаланс", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadEnergy, loading: energyLoading, children: "Загрузить" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: refreshEnergy, loading: energyLoading, children: "Обновить MV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              try {
                setEnergyLoading(true);
                const resp = await fetch("/api/admin/energy/rebuild", { method: "POST", headers: buildAuthHeaders() });
                if (!resp.ok) throw new Error();
                staticMethods.success("Перестроено");
                await loadEnergy();
              } catch (e) {
                staticMethods.error("Не удалось перестроить MV");
              } finally {
                setEnergyLoading(false);
              }
            }, children: "Перестроить MV" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForwardTable,
            {
              size: "small",
              loading: energyLoading,
              rowKey: (r) => r.ts_hour,
              dataSource: energyItems,
              columns: [
                { title: "ts_hour", dataIndex: "ts_hour", width: 180 },
                { title: "energy_in", dataIndex: "energy_in", width: 120 },
                { title: "energy_out", dataIndex: "energy_out", width: 120 },
                { title: "sensations_delta", dataIndex: "sensations_delta", width: 160 },
                { title: "value_per_cost_avg", dataIndex: "value_per_cost_avg", width: 180 }
              ],
              pagination: { pageSize: 12 }
            }
          )
        ] })
      },
      {
        key: "v8_family",
        label: "Семья (v8)",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Контакты семьи", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { width: 260 }, placeholder: "TG ID пользователя", value: familyUserTgId, onChange: (e) => setFamilyUserTgId(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadFamily, loading: familyLoading, children: "Загрузить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForwardTable,
            {
              size: "small",
              loading: familyLoading,
              rowKey: (r) => `${r.contact_tg_id}`,
              dataSource: familyContacts,
              columns: [
                { title: "contact_tg_id", dataIndex: "contact_tg_id", width: 180 },
                { title: "relation", dataIndex: "relation", width: 160, render: (v, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { defaultValue: v, onBlur: (e) => saveFamilyContact({ contact_tg_id: row.contact_tg_id, relation: e.target.value, allow_read: row.allow_read, allow_send: row.allow_send }) }) },
                { title: "allow_read", dataIndex: "allow_read", width: 120, render: (v, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!v, onChange: (nv) => saveFamilyContact({ contact_tg_id: row.contact_tg_id, relation: row.relation, allow_read: nv, allow_send: row.allow_send }) }) },
                { title: "allow_send", dataIndex: "allow_send", width: 120, render: (v, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!v, onChange: (nv) => saveFamilyContact({ contact_tg_id: row.contact_tg_id, relation: row.relation, allow_read: row.allow_read, allow_send: nv }) }) },
                { title: "actions", width: 120, render: (_, row) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, size: "small", onClick: () => deleteFamilyContact(row.contact_tg_id), children: "Удалить" }) }
              ],
              pagination: { pageSize: 8 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, children: "Добавить контакт" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { width: 220 }, placeholder: "Contact TG ID", value: newContactTgId, onChange: (e) => setNewContactTgId(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { style: { width: 180 }, placeholder: "Relation", value: newContactRelation, onChange: (e) => setNewContactRelation(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: newAllowRead, onChange: (e) => setNewAllowRead(e.target.checked), children: "allow_read" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: newAllowSend, onChange: (e) => setNewAllowSend(e.target.checked), children: "allow_send" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: () => saveFamilyContact({ contact_tg_id: Number(newContactTgId || 0), relation: newContactRelation, allow_read: newAllowRead, allow_send: newAllowSend }), loading: familyLoading, children: "Сохранить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, children: "Отправить сообщение" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                style: { width: 240 },
                placeholder: "Выберите контакт",
                value: selectedContactTgId || void 0,
                onChange: (v) => setSelectedContactTgId(String(v)),
                options: familyContacts.map((c) => ({ value: String(c.contact_tg_id), label: `${c.contact_tg_id} (${c.relation || ""})` }))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 2, style: { width: 420 }, placeholder: "Текст сообщения", value: familyMsgText, onChange: (e) => setFamilyMsgText(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: sendFamilyMessage, loading: familyLoading, children: "Отправить" })
          ] })
        ] })
      },
      {
        key: "rbac",
        label: "RBAC",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Роли", loading: rolesLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Имя новой роли", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Например: premium", value: newRoleName, onChange: (e) => setNewRoleName(e.target.value) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Описание новой роли (опционально)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Описание", value: newRoleDesc, onChange: (e) => setNewRoleDesc(e.target.value) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: createRole, disabled: rolesLoading, children: "Создать роль" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadRoles, disabled: rolesLoading, children: "Обновить список ролей" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 16 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Список ролей:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              List,
              {
                dataSource: roles,
                renderItem: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item.Meta, { title: `${r.name} (id=${r.id})`, description: r.description || "" }) }),
                locale: { emptyText: "Ролей нет" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Метрики по связям", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { style: { marginBottom: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadMetrics, children: "Загрузить метрики" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 12, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { span: 8, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { strong: true, children: "Strong edges" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ForwardTable,
                  {
                    size: "small",
                    loading: metricsLoading,
                    rowKey: (r) => `${r.source}-${r.target}`,
                    dataSource: edges,
                    columns: [{ title: "source", dataIndex: "source", width: 220 }, { title: "target", dataIndex: "target", width: 220 }, { title: "strength", dataIndex: "strength", width: 120 }, { title: "kw", dataIndex: "keyword_overlap", width: 100 }],
                    pagination: { pageSize: 8 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { span: 8, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { strong: true, children: "Hubs" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ForwardTable,
                  {
                    size: "small",
                    loading: metricsLoading,
                    rowKey: (r) => `${r.quant_id}`,
                    dataSource: hubs,
                    columns: [{ title: "quant", dataIndex: "quant_id", width: 260 }, { title: "degree", dataIndex: "degree", width: 100 }, { title: "w_degree", dataIndex: "weighted_degree", width: 120 }, { title: "energy", dataIndex: "energy_weight", width: 100 }],
                    pagination: { pageSize: 8 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { span: 8, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { strong: true, children: "Trending tags" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ForwardTable,
                  {
                    size: "small",
                    loading: metricsLoading,
                    rowKey: (r) => `${r.tag}`,
                    dataSource: tagsTrend,
                    columns: [{ title: "tag", dataIndex: "tag", width: 160 }, { title: "delta", dataIndex: "delta_sum", width: 120 }, { title: "count", dataIndex: "cnt", width: 100 }],
                    pagination: { pageSize: 8 }
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Права (Permissions)", loading: permissionsLoading, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Ключ права", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "api.test.read",
                  value: newPermKey,
                  onChange: (e) => setNewPermKey(e.target.value),
                  disabled: permissionsLoading
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Описание права (опционально)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Описание",
                  value: newPermDesc,
                  onChange: (e) => setNewPermDesc(e.target.value),
                  disabled: permissionsLoading
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "primary",
                    onClick: createPermission,
                    loading: permissionsLoading,
                    disabled: !newPermKey.trim(),
                    children: "Создать право"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: loadPermissions,
                    loading: permissionsLoading,
                    children: "Обновить список прав"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 16 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography.Text, { children: [
              "Список прав (",
              permissions.length,
              "):"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              List,
              {
                dataSource: permissions,
                renderItem: (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item.Meta, { title: `${p.key} (id=${p.id})`, description: p.description || "Без описания" }) }),
                locale: { emptyText: "Прав нет" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Лимиты LLM", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { layout: "vertical", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Роль", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Select,
                {
                  placeholder: "Выберите роль",
                  value: selectedRoleForLimit,
                  onChange: setSelectedRoleForLimit,
                  options: roles.map((r) => ({ label: r.name, value: r.id }))
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Дневные запросы", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TypedInputNumber,
                {
                  placeholder: "50",
                  value: limitDailyReqs,
                  onChange: (v) => setLimitDailyReqs(typeof v === "number" ? v : void 0),
                  min: 1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Максимум токенов вывода", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TypedInputNumber,
                {
                  placeholder: "1024",
                  value: limitMaxOutput,
                  onChange: (v) => setLimitMaxOutput(typeof v === "number" ? v : void 0),
                  min: 1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: createLimit, children: "Создать лимит" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadLimits, children: "Обновить лимиты" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 16 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Список лимитов:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              List,
              {
                dataSource: limits,
                renderItem: (l) => /* @__PURE__ */ jsxRuntimeExports.jsx(List.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  List.Item.Meta,
                  {
                    title: `Роль ${l.role_id}, функция ${l.function_name}`,
                    description: `Дневные: ${l.daily_requests || "∞"}, Токены: ${l.max_output_tokens || "∞"}`
                  }
                ) }),
                locale: { emptyText: "Лимитов нет" }
              }
            )
          ] })
        ] })
      },
      {
        key: "dispatcher",
        label: "Диспетчер",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Очередь и метрики диспетчера", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              var _a2, _b2, _c2, _d2, _e2, _f2;
              try {
                const resp = await fetch("/api/admin/dispatcher/metrics", { headers: buildAuthHeaders() });
                if (!resp.ok) throw new Error();
                const data = await resp.json();
                Modal.info({
                  title: "Метрики диспетчера (сводка)",
                  width: 640,
                  content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { bordered: true, column: 1, size: "small", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "В очереди", children: (_b2 = (_a2 = data == null ? void 0 : data.queue) == null ? void 0 : _a2.in_queue) != null ? _b2 : 0 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Отправлено (dispatched)", children: (_d2 = (_c2 = data == null ? void 0 : data.queue) == null ? void 0 : _c2.dispatched) != null ? _d2 : 0 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Пропущено (skipped)", children: (_f2 = (_e2 = data == null ? void 0 : data.queue) == null ? void 0 : _e2.skipped) != null ? _f2 : 0 })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Последние точки аналитики (часовые):" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ForwardTable,
                      {
                        size: "small",
                        rowKey: (r) => `${r.ts_hour}`,
                        dataSource: Array.isArray(data == null ? void 0 : data.analytics) ? data.analytics : [],
                        columns: [
                          { title: "ts_hour", dataIndex: "ts_hour", width: 180 },
                          { title: "cnt_goal", dataIndex: "cnt_goal", width: 100 },
                          { title: "cnt_explore", dataIndex: "cnt_explore", width: 110 },
                          { title: "avg_ml_conf", dataIndex: "avg_ml_confidence", width: 120 },
                          { title: "avg_value_per_cost", dataIndex: "avg_value_per_cost", width: 160 }
                        ],
                        pagination: { pageSize: 8 }
                      }
                    )
                  ] })
                });
              } catch (e) {
                staticMethods.error("Не удалось загрузить метрики диспетчера");
              }
            }, children: "Загрузить метрики" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: busy, onClick: async () => {
              try {
                const resp = await fetch("/api/admin/dispatcher/queue", { headers: buildAuthHeaders() });
                if (!resp.ok) throw new Error();
                const data = await resp.json();
                Modal.info({
                  title: "Текущая очередь диспетчера",
                  width: 900,
                  content: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ForwardTable,
                    {
                      size: "small",
                      rowKey: (r) => r.id,
                      dataSource: Array.isArray(data == null ? void 0 : data.items) ? data.items : [],
                      columns: [
                        { title: "created_at", dataIndex: "created_at", width: 180 },
                        { title: "planned_for", dataIndex: "planned_for", width: 180 },
                        { title: "goal_id", dataIndex: "goal_id", width: 260 },
                        { title: "policy", dataIndex: "policy", width: 140 },
                        { title: "energy", dataIndex: "expected_energy", width: 90 },
                        { title: "priority", dataIndex: "priority", width: 100 },
                        { title: "status", dataIndex: "status", width: 110 },
                        { title: "summary", dataIndex: "human_summary", width: 260 }
                      ],
                      pagination: { pageSize: 10 }
                    }
                  )
                });
              } catch (e) {
                staticMethods.error("Не удалось загрузить очередь");
              }
            }, children: "Показать очередь" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: busy || dispatcherPlanLoading, loading: dispatcherPlanLoading, onClick: async () => {
              var _a2;
              try {
                setDispatcherPlanLoading(true);
                const resp = await fetch("/api/admin/dispatcher/plan_once", { method: "POST", headers: buildAuthHeaders() });
                if (!resp.ok) throw new Error();
                const data = await resp.json();
                staticMethods.success(`Запланировано: ${(_a2 = data == null ? void 0 : data.planned) != null ? _a2 : 0}`);
              } catch (e) {
                staticMethods.error("Не удалось выполнить планирование");
              } finally {
                setDispatcherPlanLoading(false);
              }
            }, children: "Запустить планирование" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: busy || dispatcherMatLoading, loading: dispatcherMatLoading, onClick: async () => {
              var _a2;
              try {
                setDispatcherMatLoading(true);
                const resp = await fetch("/api/admin/dispatcher/materialize_once", { method: "POST", headers: buildAuthHeaders() });
                if (!resp.ok) throw new Error();
                const data = await resp.json();
                staticMethods.success(`Отдано в генерацию: ${(_a2 = data == null ? void 0 : data.dispatched) != null ? _a2 : 0}`);
              } catch (e) {
                staticMethods.error("Не удалось выполнить материализацию");
              } finally {
                setDispatcherMatLoading(false);
              }
            }, children: "Материализовать" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 5, children: "Настройки диспетчера" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadDispatcherSettings, loading: dispatcherSettingsLoading, children: "Загрузить" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveDispatcherSettings, loading: dispatcherSaving, disabled: !dispatcherSettings, children: "Сохранить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { layout: "vertical", style: { maxWidth: 900 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: 12, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Включён", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: !!(dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_enabled),
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_enabled: v }))
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Режим", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                value: (dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_mode) || "balanced",
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_mode: v })),
                options: [{ value: "balanced", label: "balanced" }, { value: "goal_driven", label: "goal_driven" }, { value: "exploration", label: "exploration" }]
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Состояние", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                value: (dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_state) || "normal",
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_state: v })),
                options: [{ value: "normal", label: "normal" }, { value: "goal_only", label: "goal_only" }, { value: "maintenance", label: "maintenance" }, { value: "paused", label: "paused" }]
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Энергобюджет", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                style: { width: "100%" },
                min: 0,
                step: 0.1,
                value: Number((dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_energy_budget) || 0),
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_energy_budget: Number(v || 0) }))
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Макс. очередь", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                style: { width: "100%" },
                min: 1,
                value: Number((dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_queue_max) || 1e3),
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_queue_max: Number(v || 1e3) }))
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Exploration temperature", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                style: { width: "100%" },
                min: 0,
                max: 2,
                step: 0.05,
                value: Number((dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_exploration_temperature) || 0),
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_exploration_temperature: Number(v || 0) }))
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Fallback policy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                value: (dispatcherSettings == null ? void 0 : dispatcherSettings.fallback_policy) || "exploration_min",
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, fallback_policy: v })),
                options: [{ value: "exploration_min", label: "exploration_min" }, { value: "goal_only", label: "goal_only" }]
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Fallback energy budget", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                style: { width: "100%" },
                min: 0,
                step: 0.1,
                value: Number((dispatcherSettings == null ? void 0 : dispatcherSettings.fallback_energy_budget) || 0),
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, fallback_energy_budget: Number(v || 0) }))
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Fallback temperature", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypedInputNumber,
              {
                style: { width: "100%" },
                min: 0,
                max: 2,
                step: 0.05,
                value: Number((dispatcherSettings == null ? void 0 : dispatcherSettings.fallback_temperature) || 0),
                onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, fallback_temperature: Number(v || 0) }))
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "Schedule budgets (JSON)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input.TextArea,
              {
                rows: 4,
                value: typeof (dispatcherSettings == null ? void 0 : dispatcherSettings.schedule_budgets) === "string" ? dispatcherSettings == null ? void 0 : dispatcherSettings.schedule_budgets : (dispatcherSettings == null ? void 0 : dispatcherSettings.schedule_budgets) ? JSON.stringify(dispatcherSettings == null ? void 0 : dispatcherSettings.schedule_budgets) : "",
                onChange: (e) => setDispatcherSettings((s) => ({ ...s || {}, schedule_budgets: e.target.value })),
                placeholder: '{"night":{"from":"01:00","to":"06:00","fallback_energy_budget":2.0}}'
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { label: "A/B policies (JSON)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input.TextArea,
              {
                rows: 4,
                value: typeof (dispatcherSettings == null ? void 0 : dispatcherSettings.ab_test_policies) === "string" ? dispatcherSettings == null ? void 0 : dispatcherSettings.ab_test_policies : (dispatcherSettings == null ? void 0 : dispatcherSettings.ab_test_policies) ? JSON.stringify(dispatcherSettings == null ? void 0 : dispatcherSettings.ab_test_policies) : "",
                onChange: (e) => setDispatcherSettings((s) => ({ ...s || {}, ab_test_policies: e.target.value })),
                placeholder: '{"goal_driven":0.9, "exploration":0.1}'
              }
            ) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginTop: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              try {
                const body = { dispatcher_state: "paused" };
                const resp = await fetch("/api/admin/dispatcher/settings", { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify(body) });
                if (!resp.ok) throw new Error();
                staticMethods.success("Диспетчер: пауза");
              } catch (e) {
                staticMethods.error("Не удалось поставить на паузу");
              }
            }, children: "Пауза" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              try {
                const body = {
                  dispatcher_state: "normal"
                };
                const resp = await fetch("/api/admin/dispatcher/settings", { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify(body) });
                if (!resp.ok) throw new Error();
                staticMethods.success("Диспетчер: нормальный режим");
              } catch (e) {
                staticMethods.error("Не удалось возобновить");
              }
            }, children: "Возобновить" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              try {
                const body = {
                  dispatcher_mode: "goal_driven"
                };
                const resp = await fetch("/api/admin/dispatcher/settings", { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify(body) });
                if (!resp.ok) throw new Error();
                staticMethods.success("Режим: goal_driven");
              } catch (e) {
                staticMethods.error("Не удалось применить режим");
              }
            }, children: "Режим goal_driven" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              try {
                const body = {
                  dispatcher_mode: "exploration"
                };
                const resp = await fetch("/api/admin/dispatcher/settings", { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify(body) });
                if (!resp.ok) throw new Error();
                staticMethods.success("Режим: exploration");
              } catch (e) {
                staticMethods.error("Не удалось применить режим");
              }
            }, children: "Режим exploration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
              try {
                const body = {
                  dispatcher_energy_budget: 5
                };
                const resp = await fetch("/api/admin/dispatcher/settings", { method: "PUT", headers: buildAuthHeaders(), body: JSON.stringify(body) });
                if (!resp.ok) throw new Error();
                staticMethods.success("Базовый энергобюджет = 5.0");
              } catch (e) {
                staticMethods.error("Не удалось обновить энергобюджет");
              }
            }, children: "Энергобюджет 5.0" })
          ] })
        ] })
      },
      {
        key: "soul",
        label: "Soul",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Автоматическая генерация (авторежим)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", style: { marginBottom: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Включить автоматический режим" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: !!(dispatcherSettings == null ? void 0 : dispatcherSettings.dispatcher_enabled),
                  onChange: (v) => setDispatcherSettings((s) => ({ ...s || {}, dispatcher_enabled: v }))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveDispatcherSettings, disabled: !dispatcherSettings || busy, loading: dispatcherSaving, children: "Сохранить" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadDispatcherSettings, disabled: dispatcherSettingsLoading, loading: dispatcherSettingsLoading, children: "Обновить" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", style: { marginBottom: 0 }, children: "Переключатель управляет фоновым диспетчером: при включении система будет самостоятельно планировать и материализовывать Кванты по актуальным целям и трендам." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Архитектор: показ сырого JSON квантов", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Показывать сырой JSON в ответах (ветка Соул)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: !!((_A = rawJsonSetting == null ? void 0 : rawJsonSetting.value) != null ? _A : true),
                onChange: async (checked) => {
                  try {
                    await updateSoulSetting("architect_show_raw_quant_json", String(checked));
                    staticMethods.success("Настройка сохранена");
                    await loadSoulSettings();
                  } catch (e) {
                    staticMethods.error("Не удалось сохранить настройку");
                  }
                }
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Архитектор: режим ответа (человек ↔ SoulCore)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Режим ответа архитектора" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Select,
                {
                  style: { width: 220 },
                  value: (architectReplyModeSetting == null ? void 0 : architectReplyModeSetting.value) || "chat",
                  options: [
                    { value: "chat", label: "chat (текст LLM-чата пользователю)" },
                    { value: "soul_core", label: "soul_core (ответ через ядро)" }
                  ],
                  onChange: async (v) => {
                    try {
                      await updateSoulSetting("architect_reply_mode", String(v));
                      staticMethods.success("Режим ответа обновлён");
                      await loadSoulSettings();
                    } catch (e) {
                      staticMethods.error("Не удалось обновить режим");
                    }
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", style: { marginTop: 8 }, children: "chat — пользователю показывается чистый ответ LLM‑чата; служебные маркеры (§sense/§qtags/§qew) формируются отдельно из stateless‑кванта. soul_core — ответ собирается через SoulCore и используется как пользовательский." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 12 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Лимиты Soul (время/токены)", loading: soulLimitsLoading, extra: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveSoulLimits, type: "primary", disabled: !soulLimits, children: "Сохранить лимиты" }), children: soulLimits && /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { gutter: [16, 16], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Доступное время (бесплатная), мин/сутки" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 1440, value: soulLimits.quant_daily_time_free_minutes, onChange: (v) => setSoulLimits((prev) => prev ? { ...prev, quant_daily_time_free_minutes: Number(v || 0) } : prev), style: { width: "100%" } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Доступное время (платная), мин/сутки" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 1440, value: soulLimits.quant_daily_time_paid_minutes, onChange: (v) => setSoulLimits((prev) => prev ? { ...prev, quant_daily_time_paid_minutes: Number(v || 0) } : prev), style: { width: "100%" } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Суточный лимит токенов (input+output)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, step: 1e3, value: soulLimits.quant_daily_token_limit, onChange: (v) => setSoulLimits((prev) => prev ? { ...prev, quant_daily_token_limit: Number(v || 0) } : prev), style: { width: "100%" } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Стоимость за 1000 токенов, ₽" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, step: 1e-3, value: soulLimits.quant_token_cost_per_1k, onChange: (v) => setSoulLimits((prev) => prev ? { ...prev, quant_token_cost_per_1k: Number(v || 0) } : prev), style: { width: "100%" } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Время на сервисные вопросы (free), мин/сутки" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 1440, value: soulLimits.service_free_daily_time_minutes, onChange: (v) => setSoulLimits((prev) => prev ? { ...prev, service_free_daily_time_minutes: Number(v || 0) } : prev), style: { width: "100%" } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { children: "Сервисные вопросы тратят лимит квантов" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: soulLimits.service_uses_quant_limits, onChange: (checked) => setSoulLimits((prev) => prev ? { ...prev, service_uses_quant_limits: checked } : prev) })
            ] }) })
          ] }) })
        ] })
      }
    ] })
  ] });
}
export {
  ArchitectPanel as default
};
//# sourceMappingURL=ArchitectPanel-v3fyGhvp.js.map
