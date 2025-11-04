import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { u as useNavigate, l as Space, T as Typography, B as Button, I as Input, p as Tag, s as staticMethods, F as ForwardTable, A as API_BASE } from "./index-B4P9h-k1.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { S as Switch } from "./index-C97PeQQx.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import { B as Badge } from "./index-DDcrJiGl.js";
import "./Skeleton-D3e3aC7P.js";
const { Title, Text } = Typography;
const buildAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const tgId = sessionStorage.getItem("tg_id");
  if (tgId) headers["X-Telegram-User-ID"] = tgId;
  const token = sessionStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};
const ResilienceAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  const [backupEnabled, setBackupEnabled] = reactExports.useState(true);
  const [backupEncrypt, setBackupEncrypt] = reactExports.useState(true);
  const [destInput, setDestInput] = reactExports.useState("");
  const [destinations, setDestinations] = reactExports.useState(["/var/backups/soulpulse"]);
  const [protocolsJson, setProtocolsJson] = reactExports.useState("[]");
  const [actorName, setActorName] = reactExports.useState("ResilienceGuardian");
  const [processKey, setProcessKey] = reactExports.useState("auto_recovery");
  const [seedHost, setSeedHost] = reactExports.useState("api.telegram.org:443");
  const [fwEnabled, setFwEnabled] = reactExports.useState(true);
  const [fwAuto, setFwAuto] = reactExports.useState(false);
  const [fwSuffix, setFwSuffix] = reactExports.useState("api.deepseek.com");
  const [fwSuffixes, setFwSuffixes] = reactExports.useState(["api.telegram.org", "yandex.ru", "google.com", "api.deepseek.com", "gigachat.devices.sberbank.ai"]);
  const [syncEnabled, setSyncEnabled] = reactExports.useState(false);
  const [syncHour, setSyncHour] = reactExports.useState(4);
  const [syncMinute, setSyncMinute] = reactExports.useState(0);
  const [syncWarn, setSyncWarn] = reactExports.useState(15);
  const [syncNotify, setSyncNotify] = reactExports.useState(468326902);
  const [syncEnvJson, setSyncEnvJson] = reactExports.useState(JSON.stringify({ PROD_SSH: "root@217.12.38.238", PROD_PG_URL: "postgresql://soulpulse:pass@127.0.0.1:5432/soulpulse", DEV_PG_URL: "postgresql://soulpulse:pass@127.0.0.1:5432/soulpulse_dev" }, null, 2));
  const [incidents, setIncidents] = reactExports.useState([]);
  const [reminders, setReminders] = reactExports.useState([]);
  const [ackMap, setAckMap] = reactExports.useState({});
  const [autoRefresh, setAutoRefresh] = reactExports.useState(true);
  const [timeSystemTz, setTimeSystemTz] = reactExports.useState("");
  const [timeNowUtc, setTimeNowUtc] = reactExports.useState("");
  const [timeNowSystem, setTimeNowSystem] = reactExports.useState("");
  const [timeNtp, setTimeNtp] = reactExports.useState(null);
  const [timeTzInput, setTimeTzInput] = reactExports.useState("");
  const apiFetch = async (path, method = "GET", body) => {
    const opts = { method, headers: buildAuthHeaders() };
    if (body !== void 0) opts.body = typeof body === "string" ? body : JSON.stringify(body);
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json().catch(() => ({}));
  };
  const loadBackupPolicy = async () => {
    try {
      const data = await apiFetch("/admin/resilience/backup/policy");
      setBackupEnabled(!!data.enabled);
      setBackupEncrypt(!!data.encrypt);
      setDestinations(Array.isArray(data.destinations) ? data.destinations : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки политики бэкапа");
    }
  };
  const saveBackupPolicy = async () => {
    try {
      await apiFetch("/admin/resilience/backup/policy", "PUT", {
        enabled: backupEnabled,
        encrypt: backupEncrypt,
        destinations
      });
      staticMethods.success("Политика бэкапа сохранена");
    } catch (e) {
      staticMethods.error("Не удалось сохранить политику");
    }
  };
  const addDestination = () => {
    const v = destInput.trim();
    if (!v) return;
    if (!destinations.includes(v)) setDestinations([...destinations, v]);
    setDestInput("");
  };
  const removeDestination = (d) => {
    setDestinations(destinations.filter((x) => x !== d));
  };
  const loadProtocols = async () => {
    try {
      const data = await apiFetch("/admin/resilience/knowledge/protocols");
      const items = Array.isArray(data.items) ? data.items : [];
      setProtocolsJson(JSON.stringify(items, null, 2));
    } catch (e) {
      staticMethods.error("Ошибка загрузки протоколов знаний");
    }
  };
  const loadFwPolicy = async () => {
    try {
      const data = await apiFetch("/admin/resilience/net/fw/learning_policy");
      setFwEnabled(!!data.enabled);
      setFwAuto(!!data.auto);
      setFwSuffixes(Array.isArray(data.suffixes) ? data.suffixes : []);
    } catch (e) {
      staticMethods.error("Ошибка загрузки FW политики");
    }
  };
  const saveFwPolicy = async () => {
    try {
      await apiFetch("/admin/resilience/net/fw/learning_policy", "PUT", { enabled: fwEnabled, auto: fwAuto, suffixes: fwSuffixes });
      staticMethods.success("FW политика сохранена");
    } catch (e) {
      staticMethods.error("Не удалось сохранить FW политику");
    }
  };
  const addFwSuffix = () => {
    const v = fwSuffix.trim();
    if (!v) return;
    if (!fwSuffixes.includes(v)) setFwSuffixes([...fwSuffixes, v]);
    setFwSuffix("");
  };
  const removeFwSuffix = (s) => setFwSuffixes(fwSuffixes.filter((x) => x !== s));
  const saveProtocols = async () => {
    try {
      let items = [];
      try {
        items = JSON.parse(protocolsJson);
      } catch (e) {
        staticMethods.warning("Некорректный JSON");
        return;
      }
      await apiFetch("/admin/resilience/knowledge/protocols", "PUT", { items });
      staticMethods.success("Протоколы сохранены");
    } catch (e) {
      staticMethods.error("Не удалось сохранить протоколы");
    }
  };
  const registerActor = async () => {
    try {
      await apiFetch("/admin/resilience/knowledge/register_actor", "POST", { name: actorName.trim() });
      staticMethods.success("Актор зарегистрирован");
    } catch (e) {
      staticMethods.error("Не удалось зарегистрировать актора");
    }
  };
  const registerProcess = async () => {
    try {
      await apiFetch("/admin/resilience/knowledge/register_process", "POST", { key: processKey.trim() });
      staticMethods.success("Процесс зарегистрирован");
    } catch (e) {
      staticMethods.error("Не удалось зарегистрировать процесс");
    }
  };
  const verifyKnowledge = async () => {
    var _a;
    try {
      const data = await apiFetch("/admin/resilience/knowledge/verify", "POST");
      staticMethods.success(`Проверка выполнена, инцидентов: ${(_a = data.incidents) != null ? _a : 0}`);
    } catch (e) {
      staticMethods.error("Не удалось выполнить проверку знаний");
    }
  };
  const seedFwSource = async () => {
    try {
      await apiFetch("/admin/resilience/knowledge/seed_source_quant", "POST", { host: seedHost.trim() });
      staticMethods.success("Источник добавлен и квант создан");
    } catch (e) {
      staticMethods.error("Не удалось добавить источник");
    }
  };
  const seedAutoInstallerPlan = async () => {
    try {
      await apiFetch("/admin/resilience/knowledge/seed_auto_installer_plan", "POST", { title: "Авто‑инсталлятор: чистое восстановление PROD" });
      staticMethods.success("Квант плана авто‑инсталлятора создан");
    } catch (e) {
      staticMethods.error("Не удалось создать квант плана");
    }
  };
  const loadSyncPolicy = async () => {
    var _a, _b, _c, _d;
    try {
      const data = await apiFetch("/admin/resilience/sync/prod_to_dev");
      setSyncEnabled(!!data.enabled);
      setSyncHour(Number((_a = data.hour) != null ? _a : 4));
      setSyncMinute(Number((_b = data.minute) != null ? _b : 0));
      setSyncWarn(Number((_c = data.warn_minutes) != null ? _c : 15));
      setSyncNotify(Number((_d = data.notify_tg_id) != null ? _d : 0));
      try {
        setSyncEnvJson(JSON.stringify(data.env || {}, null, 2));
      } catch (e) {
      }
    } catch (e) {
      staticMethods.error("Ошибка загрузки политики синхронизации");
    }
  };
  const saveSyncPolicy = async () => {
    try {
      let envObj = {};
      try {
        envObj = JSON.parse(syncEnvJson);
      } catch (e) {
        staticMethods.warning("Некорректный JSON в ENV");
        return;
      }
      await apiFetch("/admin/resilience/sync/prod_to_dev", "PUT", {
        enabled: syncEnabled,
        hour: syncHour,
        minute: syncMinute,
        warn_minutes: syncWarn,
        notify_tg_id: syncNotify,
        env: envObj
      });
      staticMethods.success("Политика синхронизации сохранена");
    } catch (e) {
      staticMethods.error("Не удалось сохранить политику синхронизации");
    }
  };
  const runSyncNow = async () => {
    try {
      const res = await apiFetch("/admin/resilience/sync/prod_to_dev/run", "POST");
      if (res == null ? void 0 : res.ok) staticMethods.success("Задача синхронизации поставлена в очередь");
      else staticMethods.info("Ответ принят");
    } catch (e) {
      staticMethods.error("Не удалось поставить задачу синхронизации");
    }
  };
  const loadIncidents = async () => {
    try {
      const data = await apiFetch("/admin/soul/processor/incidents?limit=50");
      setIncidents(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
    }
  };
  const loadReminders = async () => {
    try {
      const data = await apiFetch("/miniapp/reminders?include_sent=true");
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
    }
  };
  const loadAckIncidents = async () => {
    try {
      const data = await apiFetch("/admin/soul/processor/incidents?limit=200");
      const items = Array.isArray(data.items) ? data.items : [];
      const map = {};
      for (const it of items) {
        if ((it == null ? void 0 : it.type) === "reminder_ack") {
          const m = /id=(\d+)/.exec(String(it.detail || ""));
          if (m) map[Number(m[1])] = true;
        }
      }
      setAckMap(map);
    } catch (e) {
    }
  };
  const loadTimeStatus = async () => {
    var _a;
    try {
      const data = await apiFetch("/admin/time/status");
      setTimeSystemTz(String(data.system_tz || ""));
      setTimeNowUtc(String((data.now || {}).utc || ""));
      setTimeNowSystem(String((data.now || {}).system || ""));
      setTimeNtp((_a = data.ntp) != null ? _a : null);
    } catch (e) {
      staticMethods.error("Ошибка загрузки статуса времени");
    }
  };
  const loadTimeSettings = async () => {
    try {
      const data = await apiFetch("/admin/time/settings");
      setTimeTzInput(String(data.system_tz || ""));
    } catch (e) {
      staticMethods.error("Ошибка загрузки настроек времени");
    }
  };
  const saveTimeSettings = async () => {
    try {
      await apiFetch("/admin/time/settings", "PUT", { system_tz: (timeTzInput || "").trim() });
      staticMethods.success("Системная TZ обновлена");
      await loadTimeStatus();
      await loadTimeSettings();
    } catch (e) {
      staticMethods.error("Не удалось сохранить системную TZ");
    }
  };
  reactExports.useEffect(() => {
    void loadBackupPolicy();
    void loadProtocols();
    void loadFwPolicy();
    void loadSyncPolicy();
    void loadIncidents();
    void loadReminders();
    void loadAckIncidents();
    void loadTimeStatus();
    void loadTimeSettings();
  }, []);
  reactExports.useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      void loadIncidents();
      void loadReminders();
      void loadAckIncidents();
    }, 1e4);
    return () => clearInterval(t);
  }, [autoRefresh]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--sp-spacing-sm)", boxSizing: "border-box", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", style: { width: "100%", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { level: 3, style: { marginBottom: "var(--sp-spacing-sm)" }, children: "Resilience Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "default", onClick: () => navigate("/reminders"), children: "📋 Напоминания" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "large", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Политика бэкапов", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Включено:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: backupEnabled, onChange: setBackupEnabled }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Шифрование:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: backupEncrypt, onChange: setBackupEncrypt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveBackupPolicy, children: "Сохранить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadBackupPolicy, children: "Обновить" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Назначения хранения" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "/var/backups/soulpulse", value: destInput, onChange: (e) => setDestInput(e.target.value), style: { width: 360 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addDestination, children: "Добавить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { wrap: true, children: destinations.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { closable: true, onClose: () => removeDestination(d), color: "geekblue", children: d }, d)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Протоколы знаний и покрытие", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Список протоколов (JSON)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { value: protocolsJson, onChange: (e) => setProtocolsJson(e.target.value), rows: 10, style: { fontFamily: "monospace" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveProtocols, children: "Сохранить протоколы" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadProtocols, children: "Обновить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: verifyKnowledge, children: "Проверить покрытие" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Имя актора", value: actorName, onChange: (e) => setActorName(e.target.value), style: { width: 240 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: registerActor, children: "Зарегистрировать актора" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ключ процесса", value: processKey, onChange: (e) => setProcessKey(e.target.value), style: { width: 240 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: registerProcess, children: "Зарегистрировать процесс" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "FW Allowlist / Посев источников и плана восстановления", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "host[:port]", value: seedHost, onChange: (e) => setSeedHost(e.target.value), style: { width: 280 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: seedFwSource, children: "Добавить источник + Квант" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: seedAutoInstallerPlan, children: "Создать Квант плана авто‑инсталлятора" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "FW Learning политика", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Обучение включено:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: fwEnabled, onChange: setFwEnabled }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Авто‑добавление:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: fwAuto, onChange: setFwAuto }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveFwPolicy, children: "Сохранить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadFwPolicy, children: "Обновить" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Доверенные суффиксы" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "example.com", value: fwSuffix, onChange: (e) => setFwSuffix(e.target.value), style: { width: 260 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addFwSuffix, children: "Добавить" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { wrap: true, children: fwSuffixes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { closable: true, onClose: () => removeFwSuffix(s), color: "purple", children: s }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
            var _a;
            try {
              const res = await apiFetch("/admin/resilience/net/fw/learn", "POST");
              staticMethods.success(`Обновлено: ${(_a = res.updated) != null ? _a : 0}`);
            } catch (e) {
              staticMethods.error("Не удалось выполнить обучение");
            }
          }, children: "Запустить обучение сейчас" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Время (TimeAdmin) — системная TZ и статус", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Системная TZ (текущая):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "blue", children: timeSystemTz || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Now UTC:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: timeNowUtc || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Now System:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: timeNowSystem || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "NTP:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: timeNtp && timeNtp.synced ? "green" : "default", children: timeNtp && (timeNtp.synced ? "synced" : "unsynced") || "n/a" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadTimeStatus, children: "Обновить статус" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Установить системную TZ:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Europe/Moscow", value: timeTzInput, onChange: (e) => setTimeTzInput(e.target.value), style: { width: 240 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveTimeSettings, children: "Сохранить TZ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadTimeSettings, children: "Загрузить настройки" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "PROD→DEV синхронизация (плановая/ручная)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, size: "middle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Включено:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: syncEnabled, onChange: setSyncEnabled }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Час (UTC):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 23, value: syncHour, onChange: (v) => setSyncHour(Number(v || 0)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Минута:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 59, value: syncMinute, onChange: (v) => setSyncMinute(Number(v || 0)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Warn (мин):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, max: 120, value: syncWarn, onChange: (v) => setSyncWarn(Number(v || 0)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "Notify TG:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 0, value: syncNotify, onChange: (v) => setSyncNotify(Number(v || 0)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: saveSyncPolicy, children: "Сохранить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadSyncPolicy, children: "Обновить" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: runSyncNow, children: "Запустить сейчас" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "ENV (JSON)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 6, style: { fontFamily: "monospace" }, value: syncEnvJson, onChange: (e) => setSyncEnvJson(e.target.value) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Последние инциденты процессора (50)", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.id || `${r.type}-${r.created_at}`,
            dataSource: incidents,
            pagination: { pageSize: 10 },
            size: "small",
            columns: [
              { title: "Тип", dataIndex: "type", width: 180 },
              { title: "Детали", dataIndex: "detail" },
              { title: "Когда", dataIndex: "created_at", width: 200 }
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadIncidents, style: { marginTop: 8 }, children: "Обновить" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Статусы напоминаний (sent/ack)", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: autoRefresh, onChange: setAutoRefresh }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: "Автообновление" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
            void loadReminders();
            void loadAckIncidents();
          }, children: "Обновить" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ForwardTable,
          {
            rowKey: (r) => r.id,
            dataSource: reminders,
            pagination: { pageSize: 10 },
            size: "small",
            columns: [
              { title: "ID", dataIndex: "id", width: 80 },
              { title: "Заголовок", dataIndex: "title" },
              { title: "Дата", dataIndex: "reminder_date", width: 200 },
              { title: "Sent", dataIndex: "is_sent", width: 100, render: (v) => v ? /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "green", children: "sent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: "volcano", children: "pending" }) },
              { title: "ACK", key: "ack", width: 100, render: (_, r) => ackMap[r.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: "success", text: "ack" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { status: "default", text: "no" }) }
            ]
          }
        )
      ] })
    ] })
  ] });
};
export {
  ResilienceAdmin as default
};
//# sourceMappingURL=ResilienceAdmin-B220L1lw.js.map
