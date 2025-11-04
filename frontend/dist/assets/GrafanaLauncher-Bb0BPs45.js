import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
import { j as buildAuthHeaders, T as Typography, l as Space, B as Button } from "./index-B4P9h-k1.js";
const GrafanaLauncher = () => {
  const [url, setUrl] = reactExports.useState("");
  const [baseUrl, setBaseUrl] = reactExports.useState("");
  const [sysUrl] = reactExports.useState("");
  const [promUrl, setPromUrl] = reactExports.useState("");
  const [auxUrl, setAuxUrl] = reactExports.useState("");
  const [sysDashUrl, setSysDashUrl] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/miniapp/grafana/ml", { headers: buildAuthHeaders() });
        if (resp.ok) {
          const data = await resp.json();
          const raw = String((data == null ? void 0 : data.url) || "");
          if (raw.startsWith("http")) {
            try {
              const u = new URL(raw);
              u.searchParams.delete("kiosk");
              setUrl(u.toString());
              const idx = u.pathname.indexOf("/d/");
              if (idx > 0) {
                setBaseUrl(u.origin + u.pathname.slice(0, idx + 1));
              } else {
                setBaseUrl(u.origin + "/");
              }
            } catch (e) {
              setUrl(raw);
            }
          }
          try {
            const r2 = await fetch("/api/admin/soul/settings/all", { headers: buildAuthHeaders() });
            if (r2.ok) {
              const j2 = await r2.json();
              const items = Array.isArray(j2 == null ? void 0 : j2.items) ? j2.items : Array.isArray(j2) ? j2 : [];
              const get = (k) => {
                try {
                  return String((items.find((it) => String((it == null ? void 0 : it.key) || "") === k) || {}).value || "");
                } catch (e) {
                  return "";
                }
              };
              const baseFromSettings = get("grafana.base_url");
              const base = (baseFromSettings || baseUrl || url).toString();
              let promPath = get("grafana.prometheus_dashboard.path") || get("grafana.prom_dashboard.path") || get("grafana.prom.path");
              if (promPath) {
                const ensure = (p) => p.startsWith("/") ? p : "/" + p;
                const origin = (() => {
                  try {
                    const u2 = new URL(base);
                    return u2.origin;
                  } catch (e) {
                    return String(base).replace(/\/$/, "");
                  }
                })();
                setPromUrl(`${origin}${ensure(promPath)}?refresh=30s&kiosk`);
              }
              const auxPath = get("grafana.aux_llm_lima_dashboard.path");
              if (auxPath) {
                const ensure2 = (p) => p.startsWith("/") ? p : "/" + p;
                const origin2 = (() => {
                  try {
                    const u3 = new URL(base);
                    return u3.origin;
                  } catch (e) {
                    return String(base).replace(/\/$/, "");
                  }
                })();
                setAuxUrl(`${origin2}${ensure2(auxPath)}?refresh=30s&kiosk`);
              }
              const sysPath = get("grafana.system_dashboard.path");
              if (sysPath) {
                try {
                  const ensure3 = (p) => p.startsWith("/") ? p : "/" + p;
                  const origin3 = (() => {
                    try {
                      const u4 = new URL(base);
                      return u4.origin;
                    } catch (e) {
                      return String(base).replace(/\/$/, "");
                    }
                  })();
                  const sys = `${origin3}${ensure3(sysPath)}?refresh=30s&kiosk`;
                  setBaseUrl((prev) => prev || origin3 + "/grafana/");
                  window.__SYS_DASH_URL__ = sys;
                } catch (e) {
                }
              }
            }
          } catch (e) {
          }
          try {
            const rp = await fetch("/api/miniapp/grafana/paths", { headers: buildAuthHeaders() });
            if (rp.ok) {
              const jp = await rp.json();
              if (jp == null ? void 0 : jp.prom_url) setPromUrl(String(jp.prom_url));
              if (jp == null ? void 0 : jp.aux_url) setAuxUrl(String(jp.aux_url));
              if (jp == null ? void 0 : jp.sys_url) setSysDashUrl(String(jp.sys_url));
            }
          } catch (e) {
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const openExternalUrl = (u) => {
    var _a;
    try {
      const tg = (_a = window.Telegram) == null ? void 0 : _a.WebApp;
      if (tg && tg.openLink) tg.openLink(u, { try_instant_view: false });
      else window.open(u, "_blank", "noopener");
    } catch (e) {
      window.open(u, "_blank", "noopener");
    }
  };
  const getTarget = () => {
    try {
      const raw = (window.location.hash || "") + (window.location.search || "");
      const m = raw.match(/[?&]target=([^&]+)/);
      if (m) return decodeURIComponent(m[1]);
    } catch (e) {
    }
    return "";
  };
  const didLaunchRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (loading || didLaunchRef.current) return;
    const target = getTarget();
    const launchAndReturn = (u) => {
      didLaunchRef.current = true;
      openExternalUrl(u);
      setTimeout(() => {
        try {
          window.history.back();
        } catch (e) {
          try {
            window.location.hash = "#/architect";
          } catch (e2) {
          }
        }
      }, 50);
    };
    if (target === "ml" && url) {
      launchAndReturn(url);
    } else if (target === "sys") {
      const sys = window.__SYS_DASH_URL__;
      const defaultSys = (() => {
        try {
          const origin = (() => {
            try {
              const u = new URL(baseUrl || url || "/");
              return u.origin;
            } catch (e) {
              return "";
            }
          })();
          return origin ? origin + "/grafana/d/system_metrics/system-metrics" : "/grafana/d/system_metrics/system-metrics";
        } catch (e) {
          return "/grafana/d/system_metrics/system-metrics";
        }
      })();
      const defaultList = (() => {
        try {
          const origin = (() => {
            try {
              const u = new URL(baseUrl || url || "/");
              return u.origin;
            } catch (e) {
              return "";
            }
          })();
          return origin ? origin + "/grafana/dashboards" : "/grafana/dashboards";
        } catch (e) {
          return "/grafana/dashboards";
        }
      })();
      launchAndReturn(sysDashUrl || sys || defaultSys || defaultList || sysUrl || baseUrl);
    } else if (target === "prom") {
      const u = promUrl || baseUrl;
      launchAndReturn(u);
    } else if (target === "aux") {
      const u = auxUrl || baseUrl;
      launchAndReturn(u);
    }
  }, [loading, url, sysUrl, baseUrl]);
  const hasTarget = (() => {
    try {
      return !!getTarget();
    } catch (e) {
      return false;
    }
  })();
  if (hasTarget) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 520, width: "100%", textAlign: "center", background: "var(--sp-bg-card)", border: "1px solid var(--sp-border-primary)", borderRadius: 12, padding: 24 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Title, { level: 3, style: { marginTop: 0, marginBottom: 12 }, children: "ML Grafana" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography.Paragraph, { type: "secondary", style: { marginBottom: 16 }, children: "Авто‑открытие внешних отчётов Grafana в зависимости от цели." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Space, { direction: "vertical", size: 12, style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "primary", size: "large", loading, onClick: () => openExternalUrl(url || baseUrl), children: "Открыть ML Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "middle", onClick: () => openExternalUrl(sysDashUrl || sysUrl || "/grafana/d/system_metrics/system-metrics"), children: "System Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "middle", onClick: () => openExternalUrl(promUrl || baseUrl), children: "Метрики (Prometheus)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "middle", onClick: () => openExternalUrl(auxUrl || baseUrl), children: "Aux LLM / LIMA" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "middle", onClick: () => openExternalUrl(baseUrl), children: "Открыть список дашбордов" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "var(--sp-text-secondary)" }, children: "Ссылки открываются во внешнем окне Grafana." })
    ] })
  ] }) });
};
export {
  GrafanaLauncher as default
};
//# sourceMappingURL=GrafanaLauncher-Bb0BPs45.js.map
