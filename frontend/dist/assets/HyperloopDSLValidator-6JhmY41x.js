import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { l as Space, aB as Tooltip, B as Button, I as Input, s as staticMethods, T as Typography } from "./index-B4P9h-k1.js";
function normalizeHyperloopDSL(text) {
  const src = (text || "").replace(/\r/g, "").trim();
  if (!src) return "";
  let out = "";
  let inQuotes = false;
  let esc = false;
  for (const ch of src) {
    if (esc) {
      out += ch;
      esc = false;
      continue;
    }
    if (ch === "\\") {
      esc = true;
      out += ch;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      out += ch;
      continue;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      out += "; ";
      continue;
    }
    out += ch;
  }
  if (inQuotes) {
    const lastQuote = out.lastIndexOf('"');
    if (lastQuote >= 0) {
      const head = out.slice(0, lastQuote + 1);
      const tail = out.slice(lastQuote + 1);
      const fixedTail = tail.replace(/\"/g, '\\"').replace(/"/g, '\\"');
      out = head + fixedTail;
    }
  }
  out = out.replace(/\s*=\s*/g, "=");
  let buf = "";
  inQuotes = false;
  esc = false;
  for (const ch of out) {
    if (esc) {
      buf += ch;
      esc = false;
      continue;
    }
    if (ch === "\\") {
      esc = true;
      buf += ch;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      buf += ch;
      continue;
    }
    if (!inQuotes && ch === " ") {
      if (buf.endsWith(" ")) {
        continue;
      }
    }
    buf += ch;
  }
  return buf.trim();
}
function _selfTestNormalizeHyperloopDSL() {
  const cases = [
    { name: "multiline_to_semicolon", inp: 'FLAGS.STATE\nTRACE.STEPS trace_id="x"', expected: 'FLAGS.STATE; TRACE.STEPS trace_id="x"', check: (s) => s.includes("; ") && !s.includes("\n") },
    { name: "spaces_around_equal", inp: 'KEY = "V"', expected: 'KEY="V"', check: (s) => s.includes('KEY="V"') },
    { name: "escape_quotes_tail", inp: 'CMD key="V" value="unterminated', check: (s) => {
      var _a, _b;
      return s.startsWith("CMD ") && ((_b = (_a = s.match(/\"/g)) == null ? void 0 : _a.length) != null ? _b : 0) >= 1;
    } },
    { name: "collapse_spaces", inp: "A   B   C", expected: "A B C", check: (s) => s === "A B C" }
  ];
  const results = cases.map((c) => {
    const got = normalizeHyperloopDSL(c.inp);
    const ok = c.check(got) && (!c.expected || got === c.expected);
    return { name: c.name, ok, got, expected: c.expected };
  });
  const passed = results.every((r) => r.ok);
  return { passed, cases: results };
}
const { Text } = Typography;
const buildAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  try {
    const tgId = sessionStorage.getItem("tg_id");
    if (tgId) headers["X-Telegram-User-ID"] = String(tgId);
  } catch (e) {
  }
  return headers;
};
const presets = [
  { name: "FLAGS.STATE", dsl: "FLAGS.STATE" },
  { name: "INSPECTOR.RUN_ALL", dsl: "INSPECTOR.RUN_ALL scope=signature" },
  { name: "SESSION.CLAIM", dsl: 'SESSION.CLAIM owner="468326902" branch="p48r-dev" topic="planning" session="dev-001"', tip: 'PowerShell: экранируйте внутренние " как " если строка в двойных кавычках' },
  { name: "DEV.CONNECT", dsl: 'DEV.CONNECT owner="468326902" branch="p48r-dev" WITH TRACE' },
  { name: "PROCESSOR.EVENT.INJECT (payload_json)", dsl: 'PROCESSOR.EVENT.INJECT kind=chat_message payload_json="{"text":"ping"}" priority=5' },
  // Доп. пресеты PowerShell edge-cases
  { name: "INSPECTOR: claim_branch", dsl: 'INSPECTOR.RUN key=plan.branch action=claim_branch branch="admin-rs-nightly-dsl" owner=468326902 session="dev-001" ttl_sec=172800 session_ttl_sec=1800' },
  { name: "INSPECTOR: release_branch", dsl: 'INSPECTOR.RUN key=plan.branch action=release_branch branch="admin-rs-nightly-dsl" owner=468326902 session="dev-001"' },
  { name: "TWO_KEYS.REQUEST (reason with quotes)", dsl: 'TWO_KEYS.REQUEST operation=FLAGS.APPLY_PROFILE scope="rs.profile" reason="switch to "prod_safe" due to bp" ttl_minutes=5' },
  { name: "FLAGS.APPLY_PROFILE (with request)", dsl: 'FLAGS.APPLY_PROFILE name="prod_safe" two_keys_request_id="00000000-0000-0000-0000-000000000000"' },
  { name: "PROCESSOR.EVENT.INJECT JSON payload (special chars)", dsl: 'PROCESSOR.EVENT.INJECT kind=chat_message payload_json="{"text":"PS path C:\\\\Temp\\\\file.txt"}" priority=9' },
  { name: "CORE.PIPELINE.RUN (text with ; and quotes)", dsl: 'CORE.PIPELINE.RUN input_text="health; "check"" WITH TRACE' },
  { name: "MULTI-LINE → ; normalize", dsl: 'FLAGS.STATE\nTRACE.STEPS trace_id="demo"\nINSPECTOR.RUN_ALL scope=signature' },
  { name: "RISK.ADD sample", dsl: 'RISK.ADD project_id="<PID>" title="LLM таймаут" severity=high probability=likely' },
  { name: "PLAN.TASK.ADD sample", dsl: 'PLAN.TASK.ADD project_id="<PID>" title="CPM расчёт" cpm_duration_days=2.5' },
  // Настройки nightly через DB.UPSERT (надёжно через UI)
  { name: "SET rs.nightly.interval_sec=600", dsl: 'DB.UPSERT table=soul_settings values_json="{"key":"rs.nightly.interval_sec","value":600}"' },
  { name: "SET rs.nightly.window_days=1", dsl: 'DB.UPSERT table=soul_settings values_json="{"key":"rs.nightly.window_days","value":1}"' },
  { name: "RUN nightly.generate", dsl: "INSPECTOR.RUN key=signature.required_steps.consistency\n# затем выполните /api/admin/rs/nightly/generate из панели", tip: "Генерацию можно запустить кнопкой в RS Dashboard" }
];
const HyperloopDSLValidator = ({ title = "Hyperloop DSL (валидатор/нормализация)" }) => {
  const [dsl, setDsl] = reactExports.useState("INSPECTOR.RUN_ALL scope=*");
  const [dslResult, setDslResult] = reactExports.useState(null);
  const runDSL = async () => {
    var _a;
    try {
      const normalized2 = normalizeHyperloopDSL(dsl);
      const body = { commands: normalized2 };
      const resp = await fetch("/api/hyperloop/execute", { method: "POST", headers: buildAuthHeaders(), body: JSON.stringify(body) });
      if (!resp.ok) throw new Error("http");
      const data = await resp.json();
      setDslResult(data);
      staticMethods.success("DSL выполнен");
    } catch (e) {
      if (typeof dsl !== "string" || !dsl.trim()) {
        staticMethods.error("Поле commands должно быть строкой и не пустым");
      } else if (dsl.includes("successor=	") || dsl.includes("	")) {
        staticMethods.error("Обнаружены табы в DSL. Замените на пробелы или заключите значения в кавычки");
      } else if ((((_a = dsl.match(/"/g)) == null ? void 0 : _a.length) || 0) % 2 === 1) {
        staticMethods.error('Похоже, кавычки несбалансированы. Проверьте экранирование \\" внутри PowerShell');
      } else {
        staticMethods.error("Не удалось выполнить DSL (проверьте кавычки/escape в PowerShell)");
      }
    }
  };
  const normalized = normalizeHyperloopDSL(dsl);
  const copyNormalized = async () => {
    try {
      await navigator.clipboard.writeText(normalized);
      staticMethods.success("Нормализованная строка скопирована");
    } catch (e) {
      staticMethods.error("Не удалось скопировать");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { wrap: true, children: presets.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: p.tip || "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => setDsl(p.dsl), children: p.name }) }, p.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input.TextArea, { rows: 3, value: dsl, onChange: (e) => setDsl(e.target.value), placeholder: "Введите DSL (несколько команд разделять переводом строки или ';')" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: runDSL, children: "Выполнить" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: copyNormalized, children: "Копировать нормализованное" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        const res = _selfTestNormalizeHyperloopDSL();
        if (res.passed) {
          staticMethods.success("Тесты нормализации DSL пройдены");
        } else {
          const bad = res.cases.filter((c) => !c.ok).map((c) => `${c.name}: got="${c.got}"${c.expected ? `, expected="${c.expected}"` : ""}`).join("\n");
          staticMethods.error("Тесты нормализации провалены");
          console.warn("[DSL self-test failed]", bad);
        }
      }, children: "Проверить нормализацию" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "secondary", children: [
        "Нормализовано: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: normalized })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { type: "secondary", children: [
      'Подсказки: поле commands — строго строка; для сложного JSON используйте payload_json=\\"',
      "{",
      "...",
      "}",
      '\\"; в PowerShell экранируйте внутренние двойные кавычки как \\\\\\" внутри строк в двойных кавычках; обратные слэши удваивайте в путях (\\\\→\\\\\\\\).'
    ] }),
    dslResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: 280, overflow: "auto", border: "1px solid var(--sp-border-primary)", borderRadius: 8, padding: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { fontSize: 12 }, children: JSON.stringify(dslResult, null, 2) }) })
  ] }) });
};
export {
  HyperloopDSLValidator as H,
  normalizeHyperloopDSL as n
};
//# sourceMappingURL=HyperloopDSLValidator-6JhmY41x.js.map
