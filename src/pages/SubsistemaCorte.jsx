import { useState, useEffect } from "react";
import { Download, Wheat, MapPin, Cpu, Activity, TrendingUp, Grid3x3, XCircle, ImageIcon, Film } from "lucide-react";
import { MetricCard }   from "@/components/shared/MetricCard.jsx";
import { AlertBanner }  from "@/components/shared/AlertBanner.jsx";
import { ImageCanvas }  from "@/components/shared/ImageCanvas.jsx";
import { DensityGrid }  from "@/components/shared/DensityGrid.jsx";
import { TrendChart }   from "@/components/shared/TrendChart.jsx";
import { FileUpload }   from "@/components/shared/FileUpload.jsx";
import { VideoUpload }  from "@/components/shared/VideoUpload.jsx";
import { StatusBadge }  from "@/components/shared/StatusBadge.jsx";
import { analyzeImage, getHistory, exportDiagnosticCSV } from "@/services/api.ts";
import clsx from "clsx";

/* ── Density grid computation ────────────────────────────────────── */
function computeDensityGrid(detections, rows = 4, cols = 4, imgW = 640, imgH = 640) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (const det of detections) {
    const [x1, y1, x2, y2] = det.bbox;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const col = Math.min(Math.floor((cx / imgW) * cols), cols - 1);
    const row = Math.min(Math.floor((cy / imgH) * rows), rows - 1);
    if (row >= 0 && col >= 0) grid[row][col]++;
  }
  return grid;
}

/* ── Shared panel wrapper ────────────────────────────────────────── */
function Panel({ title, icon: Icon, badge, badgeColor, action, children, className }) {
  return (
    <div className={clsx("bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          {badge && (
            <span className={clsx("text-[11px] font-bold font-mono text-white px-1.5 py-0.5 rounded-md", badgeColor)}>
              {badge}
            </span>
          )}
          {Icon && <Icon className="w-4 h-4 text-stone-400" />}
          <h3 className="font-display font-semibold text-stone-700 text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Critical metric highlight ───────────────────────────────────── */
function CriticalMetric({ label, value, level, note, action }) {
  const STYLES = {
    NORMAL:   { wrap: "bg-green-50 border-green-200",  val: "text-green-700",  bar: "bg-green-500" },
    ATENCION: { wrap: "bg-amber-50 border-amber-200",  val: "text-amber-700",  bar: "bg-amber-500" },
    CRITICO:  { wrap: "bg-red-50 border-red-200",      val: "text-red-700",    bar: "bg-red-500"   },
  };
  const s = STYLES[level ?? "NORMAL"];

  return (
    <div className={clsx("rounded-2xl border-2 p-5 space-y-3 relative overflow-hidden", s.wrap)}>
      {/* Accent bar */}
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1", s.bar)} />
      <div className="pl-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
          {level && <StatusBadge level={level} size="sm" />}
        </div>
        <p className={clsx("text-5xl font-bold font-mono leading-none", s.val)}>{value}</p>
        <p className="text-xs text-stone-400 mt-2">{note}</p>
        {action && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <Activity className="w-3 h-3" /> {action}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Detection pill ──────────────────────────────────────────────── */
function DetectionRow({ det }) {
  const isLodging = det.class === "cultivo_acamado";
  return (
    <tr className="border-b border-stone-50 hover:bg-stone-50/60 transition-colors">
      <td className="py-2.5 px-4">
        <span className={clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
          isLodging ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        )}>
          {isLodging ? "🌾 Acamado" : "🌿 Panícula"}
        </span>
      </td>
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden max-w-20">
            <div
              className={clsx("h-full rounded-full", isLodging ? "bg-red-400" : "bg-green-500")}
              style={{ width: `${det.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-stone-600">{(det.confidence * 100).toFixed(1)}%</span>
        </div>
      </td>
      <td className="py-2.5 px-4 font-mono text-xs text-stone-400">
        [{det.bbox.map(v => Math.round(v)).join(", ")}]
      </td>
    </tr>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function SubsistemaCorte() {
  const [result,    setResult]    = useState(null);
  const [history,   setHistory]   = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl,  setImageUrl]  = useState(null);
  const [error,     setError]     = useState(null);
  const [imgDims,   setImgDims]   = useState({ w: 640, h: 640 });
  const [inputMode, setInputMode] = useState("imagen"); // "imagen" | "video"

  useEffect(() => {
    getHistory("corte").then(setHistory).catch(console.error);
  }, []);

  async function handleFileSelected(file) {
    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen válida.");
      return;
    }
    if (file.size === 0) {
      setError("El archivo de imagen está vacío.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    // Read image natural dimensions so the density grid coordinates are correct
    const imgEl = new window.Image();
    imgEl.onload = () => setImgDims({ w: imgEl.naturalWidth, h: imgEl.naturalHeight });
    imgEl.src = objectUrl;
    try {
      const data = await analyzeImage("corte", file);
      setResult(data);
      setHistory(prev => [...prev.slice(-29), {
        id: Date.now(),
        subsystem: "corte",
        timestamp: data.frame_id,
        latency_ms: data.latency_ms,
        panicle_count: data.indicators.panicle_count,
        lodging_detected: data.indicators.lodging_detected,
        alert_count: data.alerts.length,
      }]);
    } catch (err) {
      console.error("Error análisis S1:", err);
      setError(err instanceof Error ? err.message : "Error desconocido al analizar la imagen");
    } finally {
      setIsLoading(false);
    }
  }

  const ind        = result?.indicators;
  const detections = result?.detections || [];
  const alerts     = result?.alerts || [];
  const densityGrid = detections.length > 0
    ? computeDensityGrid(detections, 4, 4, imgDims.w, imgDims.h)
    : null;

  const overallStatus = alerts.some(a => a.level === "CRITICO")
    ? "CRITICO"
    : alerts.some(a => a.level === "ATENCION")
    ? "ATENCION"
    : result ? "NORMAL" : null;

  const lodgingLevel = !ind ? null : ind.lodging_detected ? "CRITICO" : "NORMAL";

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto w-full">

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-800 text-sm">Error en el análisis S1</p>
            <p className="text-red-700 text-xs mt-0.5 font-mono break-all">{error}</p>
            <p className="text-red-500 text-xs mt-1">
              Verifica que la imagen sea válida y que el servicio de inferencia esté disponible.
            </p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0" aria-label="Cerrar">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Alert strip ─────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(a => <AlertBanner key={a.id} alert={a} />)}
        </div>
      )}

      {/* ── Main two-column layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Left col (3/5): image + upload */}
        <div className="lg:col-span-3 space-y-4">
          <Panel
            title="Frame Analizado — Cabezal de Corte"
            badge="S1" badgeColor="bg-green-600"
            icon={Activity}
            action={overallStatus && <StatusBadge level={overallStatus} />}
          >
            <ImageCanvas imageUrl={imageUrl} detections={detections} imageWidth={640} imageHeight={640} />
          </Panel>

          <Panel
            title={inputMode === "imagen" ? "Cargar Imagen — Cabezal de Corte" : "Analizar Video — Cabezal de Corte"}
            icon={Cpu}
            action={
              <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setInputMode("imagen")}
                  className={clsx(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
                    inputMode === "imagen"
                      ? "bg-white text-stone-700 shadow-sm"
                      : "text-stone-400 hover:text-stone-600"
                  )}
                >
                  <ImageIcon className="w-3 h-3" /> Imagen
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("video")}
                  className={clsx(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
                    inputMode === "video"
                      ? "bg-white text-stone-700 shadow-sm"
                      : "text-stone-400 hover:text-stone-600"
                  )}
                >
                  <Film className="w-3 h-3" /> Video
                </button>
              </div>
            }
          >
            {inputMode === "imagen" ? (
              <>
                <FileUpload onFileSelected={handleFileSelected} isLoading={isLoading} />
                <p className="text-xs text-stone-400 mt-3 text-center">
                  JPG, PNG · El modelo detectará panículas y zonas de acame
                </p>
              </>
            ) : (
              <>
                <VideoUpload onFrameReady={handleFileSelected} isProcessing={isLoading} />
                <p className="text-xs text-stone-400 mt-3 text-center">
                  MP4, WebM, AVI · Cada frame se analiza con el modelo S1
                </p>
              </>
            )}
          </Panel>
        </div>

        {/* Right col (2/5): indicators */}
        <div className="lg:col-span-2 space-y-4">

          {/* Critical: lodging */}
          <CriticalMetric
            label="Cultivo Acamado"
            value={!ind ? "—" : ind.lodging_detected ? "DETECTADO" : "No detectado"}
            level={lodgingLevel}
            note="Cualquier detección de acame es estado CRÍTICO"
            action={ind?.lodging_detected ? "Ajustar altura del reel inmediatamente" : undefined}
          />

          {/* Metric cards */}
          <div className="grid grid-cols-1 gap-3">
            <MetricCard
              title="Panículas Detectadas"
              value={ind?.panicle_count ?? "—"}
              icon={<Wheat size={16} />}
              color={ind?.density_level === "alto" ? "yellow" : "green"}
              subtitle={ind ? `Densidad: ${ind.density_level}` : "Carga un frame para analizar"}
            />
            <MetricCard
              title="Latencia de Inferencia"
              value={result ? result.latency_ms.toFixed(1) : "—"}
              unit="ms"
              icon={<Cpu size={16} />}
              color="blue"
              subtitle="Procesamiento del modelo IA"
            />
            <MetricCard
              title="Detecciones en Frame"
              value={detections.length || "—"}
              icon={<MapPin size={16} />}
              color="gray"
              subtitle={`${detections.filter(d => d.class === "cultivo_acamado").length} zonas de acame`}
            />
          </div>

          {/* Recommended action */}
          {ind?.recommended_action && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Recomendación Operativa</p>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">{ind.recommended_action}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Density grid + Trend ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Mapa de Densidad Espacial" badge="S1" badgeColor="bg-green-600" icon={Grid3x3}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-stone-400">
              <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
              <p className="text-sm">Calculando distribución espacial…</p>
            </div>
          ) : densityGrid ? (
            <DensityGrid grid={densityGrid} totalDetections={detections.length} />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-stone-400 gap-2">
              <Grid3x3 className="w-8 h-8 opacity-30" />
              <p className="text-sm">
                {result ? "Sin detecciones en este frame" : "Carga un frame para ver la distribución espacial"}
              </p>
            </div>
          )}
        </Panel>

        <Panel
          title="Tendencia — Panículas Detectadas"
          icon={TrendingUp}
          action={
            <button
              onClick={() => exportDiagnosticCSV("corte")}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-green-600 border border-stone-200 hover:border-green-300 px-2.5 py-1.5 rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          }
        >
          <TrendChart
            data={history}
            dataKey="panicle_count"
            label="Panículas detectadas"
            color="#16a34a"
            unit=" pan."
            xKey="timestamp"
            filled
          />
        </Panel>
      </div>

      {/* ── Detections table ────────────────────────────────── */}
      {detections.length > 0 && (
        <Panel title={`Detecciones del Frame Actual (${detections.length})`} icon={MapPin}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {["Clase", "Confianza", "Bounding Box"].map(h => (
                    <th key={h} className="text-left py-2 px-4 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detections.map(det => <DetectionRow key={det.id} det={det} />)}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
