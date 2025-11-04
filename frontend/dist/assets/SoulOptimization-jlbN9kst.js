import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { T as Typography, B as Button, l as Space, F as ForwardTable, p as Tag, c as apiRequest, s as staticMethods } from "./index-B4P9h-k1.js";
import { a as RefIcon, R as RefIcon$4 } from "./ShareAltOutlined-CzSqXZex.js";
import { T as Tabs, C as Card } from "./index-C8B9-ZwJ.js";
import { R as Row, C as Col } from "./row-BcQp44VL.js";
import { R as RefIcon$1 } from "./PlayCircleOutlined-cDrp-gaP.js";
import { R as RefIcon$2 } from "./WarningOutlined-D-UZyf1F.js";
import { S as Statistic } from "./index-8wmSld-G.js";
import { P as Progress } from "./progress-CLbv5c2s.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import { A as Alert } from "./index-DVLFW87y.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import { R as RefIcon$3 } from "./SettingOutlined-COiCZpX-.js";
import { R as RefIcon$5 } from "./ApiOutlined-Bc6k0MAE.js";
import { R as RefIcon$6 } from "./ThunderboltOutlined-DKtcPo4_.js";
import "./AntdIcon-bc3Msg1y.js";
import "./Skeleton-D3e3aC7P.js";
import "./index-BlJydARW.js";
import "./context-CGIstv1h.js";
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
function SoulOptimization() {
  const [loading, setLoading] = reactExports.useState(false);
  const [domains, setDomains] = reactExports.useState([]);
  const [results, setResults] = reactExports.useState([]);
  const [metrics, setMetrics] = reactExports.useState(null);
  const [selectedDomain, setSelectedDomain] = reactExports.useState("");
  const [optimizationInProgress, setOptimizationInProgress] = reactExports.useState("");
  const [showApplyModal, setShowApplyModal] = reactExports.useState(false);
  const [selectedResult, setSelectedResult] = reactExports.useState(null);
  const loadData = async () => {
    try {
      setLoading(true);
      try {
        const domainsData = await apiRequest("/admin/soul/advanced-optimization/domains", "GET");
        setDomains(domainsData.domains || []);
      } catch (error) {
        console.error("Ошибка загрузки доменов:", error);
      }
      try {
        const resultsData = await apiRequest("/admin/soul/advanced-optimization/results?limit=50", "GET");
        setResults(resultsData.results || []);
      } catch (error) {
        console.error("Ошибка загрузки результатов:", error);
      }
      try {
        const metricsData = await apiRequest("/admin/soul/advanced-optimization/metrics", "GET");
        setMetrics(metricsData);
      } catch (error) {
        console.error("Ошибка загрузки метрик:", error);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных оптимизации:", error);
      staticMethods.error("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadData();
  }, []);
  const runOptimization = async (domain, force = false) => {
    try {
      setOptimizationInProgress(domain);
      const result = await apiRequest("/admin/soul/advanced-optimization/optimize", "POST", {
        domain,
        force_optimization: force
      });
      staticMethods.success(`Оптимизация домена ${domain} завершена`);
      await loadData();
    } catch (error) {
      console.error("Ошибка запуска оптимизации:", error);
      staticMethods.error("Ошибка запуска оптимизации");
    } finally {
      setOptimizationInProgress("");
    }
  };
  const applyOptimization = async (resultId, partial = false) => {
    try {
      const response = await fetch("/api/admin/soul/advanced-optimization/apply", {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({
          result_id: resultId,
          apply_partial: partial
        })
      });
      if (response.ok) {
        const result = await response.json();
        staticMethods.success(`Применено параметров: ${result.total_parameters}`);
        setShowApplyModal(false);
        setSelectedResult(null);
        await loadData();
      } else {
        const error = await response.json();
        staticMethods.error(`Ошибка применения: ${error.detail}`);
      }
    } catch (error) {
      console.error("Ошибка применения оптимизации:", error);
      staticMethods.error("Ошибка применения оптимизации");
    }
  };
  const getDomainIcon = (domain) => {
    switch (domain) {
      case "sleep":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$6, { size: 16 });
      case "quant_selection":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$5, { size: 16 });
      case "weight_balancing":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$4, { size: 16 });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$3, { size: 16 });
    }
  };
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "green";
    if (confidence >= 0.6) return "orange";
    return "red";
  };
  const getPriorityColor = (priority) => {
    if (priority >= 8) return "red";
    if (priority >= 6) return "orange";
    return "blue";
  };
  const getRiskLevel = (risks) => {
    const highRisks = Object.values(risks).filter((risk) => risk === "high").length;
    if (highRisks > 0) return { level: "high", color: "red" };
    const mediumRisks = Object.values(risks).filter((risk) => risk === "medium").length;
    if (mediumRisks > 0) return { level: "medium", color: "orange" };
    return { level: "low", color: "green" };
  };
  const resultsColumns = [
    {
      title: "Домен",
      dataIndex: "domain",
      key: "domain",
      render: (domain) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
        getDomainIcon(domain),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: domain.replace("_", " ") })
      ] })
    },
    {
      title: "Уверенность",
      dataIndex: "confidence_score",
      key: "confidence_score",
      render: (confidence) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: getConfidenceColor(confidence), children: [
        (confidence * 100).toFixed(1),
        "%"
      ] })
    },
    {
      title: "Приоритет",
      dataIndex: "implementation_priority",
      key: "implementation_priority",
      render: (priority) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: getPriorityColor(priority), children: [
        priority,
        "/10"
      ] })
    },
    {
      title: "Риски",
      dataIndex: "risk_assessment",
      key: "risk_assessment",
      render: (risks) => {
        const riskLevel = getRiskLevel(risks);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: riskLevel.color, children: riskLevel.level });
      }
    },
    {
      title: "Статус",
      dataIndex: "applied",
      key: "applied",
      render: (applied) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { color: applied ? "green" : "default", children: applied ? "Применено" : "Ожидает" })
    },
    {
      title: "Создано",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "small",
          onClick: () => {
            setSelectedResult(record);
            setShowApplyModal(true);
          },
          disabled: record.applied,
          children: "Применить"
        }
      ) })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 24 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Title, { level: 2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon, { style: { marginRight: 8, verticalAlign: "middle" } }),
        "Оптимизация Soul"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Продвинутая система оптимизации параметров Soul с использованием LLM и математических алгоритмов" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultActiveKey: "optimization", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "Запуск Оптимизации", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 16], children: domains.map((domain) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, lg: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          title: /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
            getDomainIcon(domain.key),
            domain.name
          ] }),
          actions: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$1, { size: 16 }),
                loading: optimizationInProgress === domain.key,
                onClick: () => runOptimization(domain.key),
                children: "Оптимизировать"
              },
              "optimize"
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefIcon$2, { size: 16 }),
                loading: optimizationInProgress === domain.key,
                onClick: () => runOptimization(domain.key, true),
                children: "Принудительно"
              },
              "force"
            )
          ],
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { ellipsis: { rows: 3 }, children: domain.description })
        }
      ) }, domain.key)) }) }, "optimization"),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "Результаты", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ForwardTable,
        {
          columns: resultsColumns,
          dataSource: results,
          rowKey: "id",
          loading,
          pagination: { pageSize: 10 }
        }
      ) }) }, "results"),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabPane, { tab: "Метрики", children: metrics && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 16], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { span: 24, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Статистика по доменам", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { gutter: [16, 16], children: metrics.domain_stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { xs: 24, md: 12, lg: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Statistic,
          {
            title: stat.domain.replace("_", " "),
            value: stat.total_optimizations,
            suffix: "оптимизаций"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Применено: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { strong: true, children: [
            (stat.application_rate * 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            percent: stat.application_rate * 100,
            size: "small",
            showInfo: false,
            style: { marginTop: 4 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Средняя уверенность: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { strong: true, children: [
            (stat.avg_confidence * 100).toFixed(1),
            "%"
          ] })
        ] })
      ] }) }, stat.domain)) }) }) }) }) }, "metrics")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "Применить Оптимизацию",
        open: showApplyModal,
        onCancel: () => {
          setShowApplyModal(false);
          setSelectedResult(null);
        },
        footer: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowApplyModal(false), children: "Отмена" }, "cancel"),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => selectedResult && applyOptimization(selectedResult.id, true),
              children: "Частично"
            },
            "partial"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "primary",
              onClick: () => selectedResult && applyOptimization(selectedResult.id, false),
              children: "Полностью"
            },
            "full"
          )
        ],
        width: 800,
        children: selectedResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Alert,
            {
              message: `Уверенность: ${(selectedResult.confidence_score * 100).toFixed(1)}%`,
              type: selectedResult.confidence_score >= 0.7 ? "success" : "warning",
              style: { marginBottom: 16 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { title: "Детали оптимизации", bordered: true, size: "small", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Домен", span: 3, children: selectedResult.domain.replace("_", " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Приоритет", span: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { color: getPriorityColor(selectedResult.implementation_priority), children: [
              selectedResult.implementation_priority,
              "/10"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Предлагаемые параметры", size: "small", style: { marginTop: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { fontSize: 12, maxHeight: 200, overflow: "auto" }, children: JSON.stringify(selectedResult.suggested_parameters, null, 2) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Ожидаемое влияние", size: "small", style: { marginTop: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { fontSize: 12, maxHeight: 200, overflow: "auto" }, children: JSON.stringify(selectedResult.expected_impact, null, 2) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Обоснование LLM", size: "small", style: { marginTop: 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { children: selectedResult.llm_reasoning }) })
        ] })
      }
    )
  ] });
}
export {
  SoulOptimization as default
};
//# sourceMappingURL=SoulOptimization-jlbN9kst.js.map
