import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { d as dayjs } from "./dayjs.min-CsyiZdAh.js";
import { l as Space, p as Tag, I as Input, B as Button, F as ForwardTable, aC as Spin, T as Typography, j as buildAuthHeaders, s as staticMethods } from "./index-B4P9h-k1.js";
import { B as Badge } from "./index-DDcrJiGl.js";
import { D as DatePicker } from "./index-I1l_E206.js";
import { P as Popconfirm } from "./index-03A0ujFQ.js";
import { D as Drawer } from "./index-DhrjGyD_.js";
import { D as Descriptions } from "./index-CNlqt0PQ.js";
import { M as Modal } from "./index-DFQcmyfW.js";
import "./CalendarOutlined-B_ajlQ0Y.js";
import "./ClockCircleOutlined-B2hpDlMl.js";
import "./index-C3XsEteC.js";
import "./context-CGIstv1h.js";
import "./Skeleton-D3e3aC7P.js";
import "./index-BlJydARW.js";
const { Text } = Typography;
const { RangePicker } = DatePicker;
function SoulQuants() {
  var _a;
  const [items, setItems] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [totalAll, setTotalAll] = reactExports.useState(null);
  const [total24h, setTotal24h] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [source, setSource] = reactExports.useState();
  const [dateRange, setDateRange] = reactExports.useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = reactExports.useState([]);
  const [page, setPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(50);
  const [detailOpen, setDetailOpen] = reactExports.useState(false);
  const [detailItem, setDetailItem] = reactExports.useState(null);
  const [goals, setGoals] = reactExports.useState([]);
  const [goalsLoading, setGoalsLoading] = reactExports.useState(false);
  const [loadingIssues, setLoadingIssues] = reactExports.useState(false);
  const [neighbors, setNeighbors] = reactExports.useState([]);
  const [neighborsLoading, setNeighborsLoading] = reactExports.useState(false);
  const fetchCounters = async () => {
    try {
      const commonOpts = { headers: buildAuthHeaders() };
      const resAll = await fetch(`/api/admin/soul/quants/search?limit=1&offset=0`, commonOpts);
      const dataAll = await resAll.json();
      if (resAll.ok) setTotalAll(Number(dataAll.total || 0));
      const since = dayjs().subtract(24, "hour").format("YYYY-MM-DD HH:mm:ss");
      const res24 = await fetch(`/api/admin/soul/quants/search?limit=1&offset=0&date_from=${encodeURIComponent(since)}`, commonOpts);
      const data24 = await res24.json();
      if (res24.ok) setTotal24h(Number(data24.total || 0));
    } catch (e) {
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (source) params.append("source", source);
      if (dateRange && dateRange[0]) params.append("date_from", dateRange[0].format("YYYY-MM-DD HH:mm:ss"));
      if (dateRange && dateRange[1]) params.append("date_to", dateRange[1].format("YYYY-MM-DD HH:mm:ss"));
      params.append("limit", String(pageSize));
      params.append("offset", String((page - 1) * pageSize));
      params.append("sort_by", "created_at");
      params.append("sort_dir", "desc");
      const res = await fetch(`/api/admin/soul/quants/search?${params.toString()}`, { headers: buildAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "fetch failed");
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      staticMethods.error(`Ошибка загрузки: ${e.message || e}`);
    } finally {
      setLoading(false);
      fetchCounters();
    }
  };
  reactExports.useEffect(() => {
    fetchCounters();
  }, []);
  reactExports.useEffect(() => {
    fetchData();
  }, [q, source, dateRange, page, pageSize]);
  const onBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      setLoading(true);
      const res = await fetch("/api/admin/soul/quants/bulk_delete", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRowKeys })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "bulk delete failed");
      staticMethods.success(`Удалено: ${data.deleted}`);
      setSelectedRowKeys([]);
      fetchData();
    } catch (e) {
      staticMethods.error(`Ошибка удаления: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };
  const loadGoals = async (quantId) => {
    try {
      setGoalsLoading(true);
      const res = await fetch(`/api/admin/soul/goals/by-quant?quant_id=${encodeURIComponent(quantId)}`, {
        headers: buildAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "failed");
      setGoals(data.items || []);
    } catch (e) {
      staticMethods.error(`Ошибка загрузки целей: ${e.message || e}`);
      setGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  };
  const loadNeighbors = async (quantId) => {
    try {
      setNeighborsLoading(true);
      const resp = await fetch(`/api/admin/soul/graph/top_neighbors?quant_id=${encodeURIComponent(quantId)}&limit=50`, { headers: buildAuthHeaders() });
      const data = await resp.json();
      setNeighbors(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setNeighbors([]);
    } finally {
      setNeighborsLoading(false);
    }
  };
  const handleDeleteQuant = async (quantId) => {
    try {
      const ok = await new Promise((resolve) => {
        Modal.confirm({
          title: "Удалить квант?",
          content: "Квант будет удалён. Связанные цели и связи также будут безопасно удалены.",
          okText: "Удалить",
          cancelText: "Отмена",
          onOk: () => resolve(true),
          onCancel: () => resolve(false)
        });
      });
      if (!ok) return;
      const res = await fetch(`/api/admin/soul/quant/${encodeURIComponent(quantId)}`, {
        method: "DELETE",
        headers: buildAuthHeaders()
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "delete failed");
      staticMethods.success("Квант удалён");
      setDetailOpen(false);
      setDetailItem(null);
      fetchData();
    } catch (e) {
      staticMethods.error(`Ошибка удаления кванта: ${e.message || e}`);
    }
  };
  const handleDeleteGoal = async (goalId) => {
    try {
      const res = await fetch("/api/admin/soul/goals/actions/unlink", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ goal_id: goalId })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "unlink failed");
      staticMethods.success("Связь цели разорвана");
      if (detailItem) loadGoals(detailItem.id);
      fetchData();
    } catch (e) {
      staticMethods.error(`Ошибка разрыва связи: ${e.message || e}`);
    }
  };
  const handleReassignGoal = async (goalId, currentQuantId) => {
    try {
      const targetId = window.prompt("Введите ID базового кванта для переназначения цели:", currentQuantId);
      if (!targetId) return;
      const res = await fetch("/api/admin/soul/goals/reassign", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ goal_id: goalId, target_quant_id: targetId.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "reassign failed");
      staticMethods.success("Цель переназначена");
      if (detailItem) loadGoals(detailItem.id);
      fetchData();
    } catch (e) {
      staticMethods.error(`Ошибка переназначения цели: ${e.message || e}`);
    }
  };
  const unlinkEdge = async (fromId, toId) => {
    try {
      const reason = window.prompt("Причина разрыва связи:", "") || "";
      const res = await fetch("/api/admin/soul/graph/unlink_edge", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ from_quant_id: fromId, to_quant_id: toId, bidirectional: true, reason })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      staticMethods.success("Связь разорвана");
      if (detailItem) loadNeighbors(detailItem.id);
    } catch (e) {
      staticMethods.error("Не удалось разорвать связь");
    }
  };
  const loadEncodingIssues = async () => {
    var _a2;
    try {
      setLoading(true);
      setLoadingIssues(true);
      const res = await fetch("/api/admin/soul/encoding/issues?limit=50", { headers: buildAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "issues fetch failed");
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(1);
      setPageSize(50);
      staticMethods.success(`Найдено проблем: ${((_a2 = data.items) == null ? void 0 : _a2.length) || 0}`);
    } catch (e) {
      staticMethods.error(`Ошибка выборки проблем: ${e.message || e}`);
    } finally {
      setLoading(false);
      setLoadingIssues(false);
    }
  };
  const fixSelectedEncoding = async () => {
    if (selectedRowKeys.length === 0) {
      staticMethods.info("Не выбраны строки для фикса.");
      return;
    }
    try {
      const ok = await new Promise((resolve) => {
        Modal.confirm({ title: "Исправить кодировку?", content: `Будет исправлено записей: ${selectedRowKeys.length}`, okText: "Исправить", cancelText: "Отмена", onOk: () => resolve(true), onCancel: () => resolve(false) });
      });
      if (!ok) return;
      setLoading(true);
      const res = await fetch("/api/admin/soul/encoding/fix", {
        method: "POST",
        headers: { ...buildAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRowKeys })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data == null ? void 0 : data.detail) || "fix failed");
      staticMethods.success(`Исправлено: ${data.fixed}`);
      setSelectedRowKeys([]);
      fetchData();
    } catch (e) {
      staticMethods.error(`Ошибка фикса: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };
  const columns = reactExports.useMemo(() => [
    {
      title: "Время",
      dataIndex: "created_at",
      width: 170,
      sorter: false
    },
    {
      title: "Квант",
      dataIndex: "thought_form",
      ellipsis: true,
      render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: t, children: t })
    },
    {
      title: "Ew",
      dataIndex: "energy_weight",
      width: 80,
      render: (v) => v != null ? v.toFixed(2) : ""
    },
    {
      title: "Теги",
      dataIndex: "tags",
      width: 220,
      render: (v) => {
        const arr = Array.isArray(v) ? v : [];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { wrap: true, children: arr.slice(0, 6).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: t }, t)) });
      }
    },
    {
      title: "Цели",
      dataIndex: "goals_count",
      width: 90,
      render: (n) => n && n > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { count: n, style: { backgroundColor: "#722ed1" } }) : 0
    },
    {
      title: "Источник",
      dataIndex: "source",
      width: 140
    }
  ], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, style: { marginBottom: 12, width: "100%", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input.Search,
          {
            allowClear: true,
            placeholder: "Поиск по тексту/тегам/payload",
            onSearch: (v) => {
              setPage(1);
              setQ(v.trim());
            },
            style: { width: 360 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            allowClear: true,
            placeholder: "source = K0.md",
            value: source,
            onChange: (e) => {
              setPage(1);
              setSource(e.target.value || void 0);
            },
            style: { width: 220 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RangePicker,
          {
            showTime: true,
            value: dateRange,
            onChange: (v) => {
              setPage(1);
              setDateRange(v);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadEncodingIssues, loading: loadingIssues, children: "Найти проблемы кодировки (50)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: fixSelectedEncoding, disabled: selectedRowKeys.length === 0, children: "Исправить выбранные" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { wrap: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "var(--text-secondary)" }, children: [
          "Всего: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: totalAll != null ? totalAll : "—" }),
          " · За 24ч: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: total24h != null ? total24h : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Popconfirm,
          {
            title: "Удалить выбранные кванты?",
            okText: "Да",
            cancelText: "Нет",
            onConfirm: onBulkDelete,
            disabled: selectedRowKeys.length === 0,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, disabled: selectedRowKeys.length === 0, children: "Удалить выбранные" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          fetchData();
        }, children: "Обновить" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForwardTable,
      {
        rowKey: "id",
        loading,
        dataSource: items,
        columns,
        pagination: {
          current: page,
          pageSize,
          total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
          showSizeChanger: true,
          pageSizeOptions: [20, 50, 100, 200]
        },
        rowSelection: {
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          preserveSelectedRowKeys: true
        },
        onRow: (record) => ({
          onClick: () => {
            setDetailItem(record);
            setDetailOpen(true);
            loadGoals(record.id);
            loadNeighbors(record.id);
          }
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Drawer,
      {
        title: "Детали кванта",
        placement: "right",
        width: 640,
        destroyOnClose: true,
        onClose: () => setDetailOpen(false),
        open: detailOpen,
        children: detailItem && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Descriptions, { column: 1, size: "small", bordered: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "ID", children: detailItem.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Время", children: detailItem.created_at }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Ew", children: detailItem.energy_weight }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Источник", children: detailItem.source || "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Эмоция", children: detailItem.composite_emotion ? JSON.stringify(detailItem.composite_emotion) : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Теги", children: Array.isArray(detailItem.tags) ? detailItem.tags.join(", ") : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Descriptions.Item, { label: "Целей", children: (_a = detailItem.goals_count) != null ? _a : 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, marginBottom: 4 }, children: "Квант (thought_form)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { whiteSpace: "pre-wrap", background: "var(--bg-card)", padding: 8, borderRadius: 6 }, children: detailItem.thought_form })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 12, display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { danger: true, onClick: () => handleDeleteQuant(detailItem.id), children: "Удалить квант" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => loadGoals(detailItem.id), loading: goalsLoading, children: "Обновить цели" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, marginBottom: 8 }, children: "Цели, связанные с квантом" }),
            goalsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Загрузка целей…" }) : goals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Целей нет" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: goals.map((g) => {
              var _a2, _b;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid var(--border-color)", borderRadius: 6, padding: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: g.title || "(без названия)" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "var(--text-secondary)" }, children: [
                    "ID: ",
                    g.id,
                    " · приоритет: ",
                    ((_b = (_a2 = g.priority) == null ? void 0 : _a2.toFixed) == null ? void 0 : _b.call(_a2, 2)) || g.priority
                  ] }),
                  g.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, marginTop: 4 }, children: g.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", danger: true, onClick: () => handleDeleteGoal(g.id), children: "Разорвать связь" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", onClick: () => handleReassignGoal(g.id, detailItem.id), children: "Переназначить" })
                ] })
              ] }) }, g.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, marginBottom: 8 }, children: "Соседи по связям" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid var(--border-color)", borderRadius: 6, padding: 8, maxHeight: 220, overflow: "auto" }, children: neighborsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, {}) : neighbors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "secondary", children: "Соседи не найдены" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Space, { direction: "vertical", style: { width: "100%" }, size: 8, children: neighbors.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { strong: true, children: "ID:" }),
                  " ",
                  n.neighbor_id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "var(--text-secondary)" }, children: [
                  "strength: ",
                  (n.strength || 0).toFixed(3),
                  " · overlap: ",
                  (n.keyword_overlap || 0).toFixed(3)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "small", danger: true, onClick: () => unlinkEdge(detailItem.id, n.neighbor_id), children: "Разорвать" })
            ] }, n.neighbor_id)) }) })
          ] })
        ] })
      }
    )
  ] });
}
export {
  SoulQuants as default
};
//# sourceMappingURL=SoulQuants-BOIklTgv.js.map
