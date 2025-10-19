import { a as reactExports, j as jsxRuntimeExports } from "./react-DAIzMmXQ.js";
const RealtimeVoiceChat = () => {
  const [recording, setRecording] = reactExports.useState(false);
  const [wsStatus, setWsStatus] = reactExports.useState("idle");
  const [lastError, setLastError] = reactExports.useState("");
  const [progressBytes, setProgressBytes] = reactExports.useState(0);
  const [lastAsrText, setLastAsrText] = reactExports.useState("");
  const wsRef = reactExports.useRef(null);
  const mediaRecorderRef = reactExports.useRef(null);
  const mediaStreamRef = reactExports.useRef(null);
  const audioRef = reactExports.useRef(null);
  const getTgIdString = () => {
    var _a, _b, _c;
    try {
      const fromSession = sessionStorage.getItem("tg_id");
      if (fromSession) return String(fromSession);
    } catch (e) {
    }
    try {
      const wa = (_c = (_b = (_a = window.Telegram) == null ? void 0 : _a.WebApp) == null ? void 0 : _b.initDataUnsafe) == null ? void 0 : _c.user;
      const id = wa == null ? void 0 : wa.id;
      return id ? String(id) : "";
    } catch (e) {
    }
    return "";
  };
  const buildWsUrl = () => {
    try {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      return `${proto}//${host}/api/voice/rt`;
    } catch (e) {
      return "/api/voice/rt";
    }
  };
  const start = async () => {
    if (recording) return;
    try {
      setLastError("");
      const wsUrl = buildWsUrl();
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;
      setProgressBytes(0);
      setLastAsrText("");
      setWsStatus("connecting");
      ws.onopen = async () => {
        var _a, _b, _c;
        setWsStatus("open");
        const tgId = getTgIdString();
        const startPayload = { type: "start", lang: "ru-RU", format: "ogg", tg_id: tgId, mode: "soul" };
        try {
          ws.send(JSON.stringify(startPayload));
        } catch (e) {
        }
        try {
          if (!((_a = navigator == null ? void 0 : navigator.mediaDevices) == null ? void 0 : _a.getUserMedia)) {
            throw new Error("mediaDevices.getUserMedia недоступен в этом окружении");
          }
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          const mime = ((_b = MediaRecorder.isTypeSupported) == null ? void 0 : _b.call(MediaRecorder, "audio/ogg;codecs=opus")) ? "audio/ogg;codecs=opus" : ((_c = MediaRecorder.isTypeSupported) == null ? void 0 : _c.call(MediaRecorder, "audio/webm;codecs=opus")) ? "audio/webm;codecs=opus" : "audio/webm";
          const mr = new MediaRecorder(stream, { mimeType: mime });
          mediaRecorderRef.current = mr;
          mr.ondataavailable = async (e) => {
            try {
              if (!e.data) return;
              const buf = await e.data.arrayBuffer();
              ws.send(buf);
            } catch (e2) {
            }
          };
          mr.start(300);
          setRecording(true);
        } catch (e) {
          console.error("[RealtimeVoice] getUserMedia error", e);
          setLastError("Доступ к микрофону отклонён или недоступен. Проверьте разрешения.");
          try {
            ws.close();
          } catch (e2) {
          }
        }
      };
      ws.onmessage = async (ev) => {
        try {
          if (typeof ev.data === "string") {
            const msg = JSON.parse(ev.data);
            const t = String(msg.type || "");
            if (t === "progress") {
              const b = Number(msg.bytes || 0);
              if (!Number.isNaN(b)) setProgressBytes(b);
            } else if (t === "asr_partial") {
              if (msg.text) setLastAsrText(String(msg.text) + " (частично…)");
            } else if (t === "asr_final") {
              if (msg.text) setLastAsrText(String(msg.text));
            } else if (t === "error") {
              console.warn("[RealtimeVoiceWS] error", msg);
            }
            return;
          }
          const arr = ev.data;
          const blob = new Blob([arr]);
          const url = URL.createObjectURL(blob);
          let el = audioRef.current;
          if (!el) {
            el = new Audio();
            el.autoplay = true;
            el.controls = false;
            audioRef.current = el;
          }
          try {
            el.src = url;
            await el.play();
          } catch (e) {
            console.warn("[RealtimeVoice] autoplay blocked", e);
          }
        } catch (e) {
          console.warn("[RealtimeVoiceWS] onmessage parse error", e);
        }
      };
      ws.onclose = () => {
        var _a, _b, _c, _d;
        setWsStatus("closed");
        setRecording(false);
        setProgressBytes(0);
        try {
          (_b = (_a = mediaRecorderRef.current) == null ? void 0 : _a.stop) == null ? void 0 : _b.call(_a);
        } catch (e) {
        }
        try {
          (_d = (_c = mediaStreamRef.current) == null ? void 0 : _c.getTracks()) == null ? void 0 : _d.forEach((t) => t.stop());
        } catch (e) {
        }
        mediaRecorderRef.current = null;
        mediaStreamRef.current = null;
      };
      ws.onerror = (ev) => {
        setWsStatus("error");
        setLastError("Ошибка соединения WebSocket. Попробуйте ещё раз.");
        try {
          ws.close();
        } catch (e) {
        }
      };
    } catch (e) {
      console.error("[RealtimeVoice] start error", e);
      setLastError("Сбой запуска речи. Попробуйте ещё раз.");
      setRecording(false);
    }
  };
  const stop = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
      (_b = (_a = mediaRecorderRef.current) == null ? void 0 : _a.stop) == null ? void 0 : _b.call(_a);
    } catch (e) {
    }
    try {
      (_d = (_c = mediaStreamRef.current) == null ? void 0 : _c.getTracks()) == null ? void 0 : _d.forEach((t) => t.stop());
    } catch (e) {
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    setRecording(false);
    try {
      (_f = (_e = wsRef.current) == null ? void 0 : _e.send) == null ? void 0 : _f.call(_e, JSON.stringify({ type: "stop" }));
    } catch (e) {
    }
    try {
      (_h = (_g = wsRef.current) == null ? void 0 : _g.close) == null ? void 0 : _h.call(_g);
    } catch (e) {
    }
  };
  reactExports.useEffect(() => {
    return () => {
      var _a, _b;
      try {
        (_b = (_a = wsRef.current) == null ? void 0 : _a.close) == null ? void 0 : _b.call(_a);
      } catch (e) {
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "0 0 12px 0" }, children: "Реал‑тайм голос" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: start, disabled: recording, style: { padding: "8px 12px" }, children: "▶️ Старт" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: stop, disabled: !recording, style: { padding: "8px 12px" }, children: "⏹️ Стоп" }),
      recording ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#8E8E93" }, children: [
        "принято ~",
        Math.round(progressBytes / 1024),
        " KB"
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#8E8E93" }, children: wsStatus === "connecting" ? "соединение..." : wsStatus === "open" ? "онлайн" : wsStatus === "error" ? "ошибка" : "" })
    ] }),
    lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 12, color: "#b91c1c", background: "#fee2e2", border: "1px solid #fecaca", padding: "8px 10px", borderRadius: 6, fontSize: 12 }, children: lastError }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minHeight: 24, color: "#8E8E93" }, children: lastAsrText ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "ASR: “",
      lastAsrText.slice(0, 128),
      lastAsrText.length > 128 ? "…" : "",
      "”"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Нет распознанного текста" }) })
  ] });
};
export {
  RealtimeVoiceChat as default
};
//# sourceMappingURL=RealtimeVoiceChat-DrMB4bTC.js.map
