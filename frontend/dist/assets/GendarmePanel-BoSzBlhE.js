import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { H as HyperloopDSLValidator } from "./HyperloopDSLValidator-6JhmY41x.js";
import { F as Form } from "./index-CnRhO1qh.js";
import { C as Card } from "./index-C8B9-ZwJ.js";
import { l as Space, n as Select, B as Button, s as staticMethods, I as Input, p as Tag, F as ForwardTable, T as Typography } from "./index-B4P9h-k1.js";
import { T as TypedInputNumber } from "./index-Tson9HxS.js";
import "./row-BcQp44VL.js";
import "./index-BlJydARW.js";
import "./QuestionCircleOutlined-C7_Q005Z.js";
import "./Skeleton-D3e3aC7P.js";
const buildAuthHeaders = () => {
  let tgId = null;
  try {
    tgId = sessionStorage.getItem("tg_id");
  } catch (e) {
  }
  return tgId ? { "X-Telegram-User-ID": String(tgId) } : {};
};
const GendarmePanel = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const [tests, setTests] = reactExports.useState([]);
  const [results, setResults] = reactExports.useState([]);
  const [filterCategory, setFilterCategory] = reactExports.useState("P30");
  const [registerForm] = Form.useForm();
  const [schedulerInterval, setSchedulerInterval] = reactExports.useState(60);
  const [expMinutes, setExpMinutes] = reactExports.useState(120);
  const [inspMinutes, setInspMinutes] = reactExports.useState(60);
  const [trendKey, setTrendKey] = reactExports.useState("skill_chain.apply_and_trace.demo.skill");
  const [trendLimit, setTrendLimit] = reactExports.useState(30);
  const [trendAgg, setTrendAgg] = reactExports.useState(null);
  const loadTests = async () => {
    try {
      setLoading(true);
      const url = filterCategory ? `/api/admin/gendarme/tests?category=${encodeURIComponent(filterCategory)}` : "/api/admin/gendarme/tests";
      const resp = await fetch(url, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error("load tests");
      const data = await resp.json();
      setTests(data.items || []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить тесты");
    } finally {
      setLoading(false);
    }
  };
  const loadResults = async (testKey) => {
    try {
      setLoading(true);
      const url = testKey ? `/api/admin/gendarme/tests/results?limit=50&test_key=${encodeURIComponent(testKey)}` : "/api/admin/gendarme/tests/results?limit=50";
      const resp = await fetch(url, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error("load results");
      const data = await resp.json();
      setResults(data.items || []);
    } catch (e) {
      staticMethods.error("Не удалось загрузить результаты");
    } finally {
      setLoading(false);
    }
  };
  const loadTrend = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/gendarme/tests/results?limit=${trendLimit}&test_key=${encodeURIComponent(trendKey)}`;
      const resp = await fetch(url, { headers: buildAuthHeaders() });
      if (!resp.ok) throw new Error("load trend");
      const data = await resp.json();
      setResults(data.items || []);
      const aresp = await fetch(`/api/admin/gendarme/tests/trend-agg?test_key=${encodeURIComponent(trendKey)}&limit=${trendLimit}`, { headers: buildAuthHeaders() });
      if (aresp.ok) {
        const agg = await aresp.json();
        if (agg && agg.ok) setTrendAgg({ avg_ms: agg.avg_ms || 0, p95_ms: agg.p95_ms || 0, pass_rate: agg.pass_rate || 0, count: agg.count || 0 });
        else setTrendAgg(null);
      } else {
        setTrendAgg(null);
      }
    } catch (e) {
      staticMethods.error("Не удалось загрузить тренд");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadTests();
    loadResults();
  }, [filterCategory]);
  const runTest = async (key) => {
    try {
      const resp = await fetch("/api/admin/gendarme/tests/run", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ test_key: key })
      });
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      staticMethods.success(`Тест выполнен: ${data.status}`);
      await loadResults(key);
    } catch (e) {
      staticMethods.error("Не удалось выполнить тест");
    }
  };
  const registerTest = async () => {
    try {
      const v = await registerForm.validateFields();
      const resp = await fetch("/api/admin/gendarme/tests/register", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(v)
      });
      if (!resp.ok) throw new Error();
      staticMethods.success("Тест зарегистрирован");
      registerForm.resetFields();
      await loadTests();
    } catch (e) {
      staticMethods.error("Не удалось зарегистрировать тест");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Gendarme — Тесты и Регрессия", loading, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", style: { width: "100%", boxSizing: "border-box", maxWidth: "100%" }, size: 12, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Select,
        {
          placeholder: "Категория",
          value: filterCategory,
          onChange: setFilterCategory,
          allowClear: true,
          options: [
            { label: "P30", value: "P30" },
            { label: "P29", value: "P29" },
            { label: "skill_chain", value: "skill_chain" },
            { label: "ALL", value: void 0 }
          ],
          style: { minWidth: 160 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        loadTests();
        loadResults();
      }, children: "Обновить" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: async () => {
        try {
          const resp = await fetch("/api/admin/gendarme/tests/run-suite", {
            method: "POST",
            headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify(filterCategory ? { category: filterCategory } : {})
          });
          if (!resp.ok) throw new Error();
          const data = await resp.json();
          staticMethods.success(`Suite: passed ${data.passed}/${data.total}`);
          await loadResults();
        } catch (e) {
          staticMethods.error("Не удалось выполнить Suite");
        }
      }, children: "Run Suite" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
        const key = prompt("Введите skill_key (например, demo.skill)");
        if (!key) return;
        try {
          const resp = await fetch("/api/admin/gendarme/tests/run", {
            method: "POST",
            headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ test_key: `skill_chain.apply_and_trace.${key}` })
          });
          if (!resp.ok) throw new Error();
          const data = await resp.json();
          staticMethods.success(`SKILL.TEST: ${data.status}`);
          await loadResults(`skill_chain.apply_and_trace.${key}`);
        } catch (e) {
          staticMethods.error("Не удалось выполнить SKILL.TEST");
        }
      }, children: "SKILL.TEST (apply_and_trace)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Профили и SKILL.SUITE под профилем", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
        try {
          const resp = await fetch("/api/admin/gendarme/flags/apply-profile", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ profile: "prod_safe" }) });
          if (!resp.ok) throw new Error();
          staticMethods.success("Профиль prod_safe применён");
        } catch (e) {
          staticMethods.error("Не удалось применить prod_safe");
        }
      }, children: "Apply prod_safe" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
        try {
          const resp = await fetch("/api/admin/gendarme/flags/apply-profile", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ profile: "dev_full" }) });
          if (!resp.ok) throw new Error();
          staticMethods.success("Профиль dev_full применён");
        } catch (e) {
          staticMethods.error("Не удалось применить dev_full");
        }
      }, children: "Apply dev_full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: async () => {
        try {
          const resp = await fetch("/api/admin/gendarme/skill/run-suite-profiled", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ profile: "prod_safe", category: "skill_chain" }) });
          if (!resp.ok) throw new Error();
          const data = await resp.json();
          staticMethods.success(`Suite@prod_safe: passed ${data.passed}/${data.total}`);
          await loadResults();
        } catch (e) {
          staticMethods.error("Не удалось выполнить Suite@prod_safe");
        }
      }, children: "Run SKILL.SUITE (prod_safe)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "default", onClick: async () => {
        try {
          const resp = await fetch("/api/admin/gendarme/skill/run-suite-profiled", { method: "POST", headers: { ...buildAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ profile: "dev_full", category: "skill_chain" }) });
          if (!resp.ok) throw new Error();
          const data = await resp.json();
          staticMethods.success(`Suite@dev_full: passed ${data.passed}/${data.total}`);
          await loadResults();
        } catch (e) {
          staticMethods.error("Не удалось выполнить Suite@dev_full");
        }
      }, children: "Run SKILL.SUITE (dev_full)" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", title: "Тренд по test_key (duration_ms)", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { align: "center", wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "test_key", value: trendKey, onChange: (e) => setTrendKey(e.target.value), style: { width: 360 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TypedInputNumber, { min: 5, max: 200, value: trendLimit, onChange: (v) => setTrendLimit(Number(v || 30)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadTrend, children: "Загрузить тренд" }),
        trendAgg && /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "blue", children: [
            "avg ",
            trendAgg.avg_ms,
            " ms"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "purple", children: [
            "p95 ",
            trendAgg.p95_ms,
            " ms"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: "green", children: [
            "pass ",
            Math.round(trendAgg.pass_rate * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
            "n=",
            trendAgg.count
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, height: 160, marginTop: 12, border: "1px dashed var(--sp-border-color, #eee)", padding: 8, boxSizing: "border-box", maxWidth: "100%", overflowX: "hidden" }, children: results.map((r, idx) => {
        const v = Math.max(0, Number((r.metrics || {}).duration_ms || 0));
        const max = Math.max(1, ...results.map((x) => Number((x.metrics || {}).duration_ms || 0)));
        const h = Math.max(4, Math.round(140 * v / max));
        const color = r.status === "passed" ? "#52c41a" : "#ff4d4f";
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: `${r.created_at || ""} ${v}ms`, style: { width: 10, height: h, background: color } }, r.id || idx);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Зарегистрированные тесты", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        rowKey: (r) => r.test_key,
        size: "small",
        pagination: { pageSize: 8 },
        dataSource: tests,
        columns: [
          { title: "test_key", dataIndex: "test_key", width: 220 },
          { title: "title", dataIndex: "title" },
          { title: "category", dataIndex: "category", width: 100 },
          { title: "severity", dataIndex: "severity", width: 100 },
          { title: "schedule (min)", dataIndex: "schedule_minutes", width: 130 },
          { title: "Действия", width: 140, render: (_, row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => runTest(row.test_key), children: "Run" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => loadResults(row.test_key), children: "Results" })
          ] }) }
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Регистрация теста", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { form: registerForm, layout: "inline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "test_key", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "test_key", style: { width: 220 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "title", rules: [{ required: true }], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "title", style: { width: 220 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "category", initialValue: "P29", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "category", style: { width: 120 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "severity", initialValue: "medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "severity", style: { width: 120 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { name: "schedule_minutes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "schedule (min)", style: { width: 140 } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", onClick: registerTest, children: "Register" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { size: "small", title: "Последние результаты", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        rowKey: (r) => r.id,
        size: "small",
        pagination: { pageSize: 8 },
        dataSource: results,
        columns: [
          { title: "created_at", dataIndex: "created_at", width: 180 },
          { title: "test_key", dataIndex: "test_key", width: 220 },
          { title: "status", dataIndex: "status", width: 100, render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Text, { type: v === "passed" ? "success" : "danger", children: v }) },
          { title: "metrics", dataIndex: "metrics", render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: { fontSize: 12 }, children: JSON.stringify(v) }) },
          { title: "detail", dataIndex: "detail", render: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: String(v || "") }) }
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HyperloopDSLValidator, { title: "Hyperloop DSL — валидатор/нормализация (общий)" })
  ] }) });
};
export {
  GendarmePanel as default
};
//# sourceMappingURL=GendarmePanel-BoSzBlhE.js.map
