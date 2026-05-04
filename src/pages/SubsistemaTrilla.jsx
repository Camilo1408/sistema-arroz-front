import { useState, useEffect } from "react";
import { Download, AlertTriangle, Activity, TrendingUp, Cpu, Layers, XCircle } from "lucide-react";
import { MetricCard }    from "@/components/shared/MetricCard.jsx";
import { AlertBanner }   from "@/components/shared/AlertBanner.jsx";
import { CompositionBar } from "@/components/shared/CompositionBar.jsx";
import { TrendChart }    from "@/components/shared/TrendChart.jsx";
import { FileUpload }    from "@/components/shared/FileUpload.jsx";
import { StatusBadge }   from "@/components/shared/StatusBadge.jsx";
import { analyzeImage, getHistoryFromDB, exportDiagnosticCSV } from "@/services/api.ts";
import clsx from "clsx";

const BROKEN_WARNING  = 0.3;
const BROKEN_CRITICAL = 0.5;

const SEG_COLORS = {
  intact: "#22c55e",
  broken: "#ef4444",
  straw:  "#f59e0b",
};

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

function CriticalGauge({ value, level, warning, critical }) {
  const STYLES = {
    NORMAL:   { wrap: "bg-green-50 border-green-200",  val: "text-green-700",  bar: "bg-green-500", fill: "bg-green-500"  },
    ATENCION: { wrap: "bg-amber-50 border-amber-200",  val: "text-amber-700",  bar: "bg-amber-500", fill: "bg-amber-500"  },
    CRITICO:  { wrap: "bg-red-50 border-red-200",      val: "text-red-700",    bar: "bg-red-500",   fill: "bg-red-500"    },
  };
  const s = STYLES[level ?? "NORMAL"];
  const pct = value !== null ? Math.min((value / (critical * 2)) * 100, 100) : 0;

  return (
    <div className={clsx("rounded-2xl border-2 p-5 relative overflow-hidden", s.wrap)}>
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1", s.bar)} />
      <div className="pl-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Grano Roto — Indicador Crítico
          </p>
          {level && <StatusBadge level={level} size="sm" />}
        </div>

        <p className={clsx("text-5xl font-bold font-mono leading-none mt-2", s.val)}>
          {value !== null ? `${value.toFixed(2)}%` : "—"}
        </p>

        {/* Progress bar */}
        <div className="mt-4 space-y-1">
          <div className="h-2.5 bg-stone-200/60 rounded-full overflow-hidden">
            <div
              className={clsx("h-full rounded-full transition-all duration-700", s.fill)}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Threshold markers */}
          <div className="relative h-3">
            <div className="absolute h-3 w-px bg-amber-400" style={{ left: `${(warning / (critical * 2)) * 100}%` }}>
              <span className="absolute top-3 left-1 text-[9px] text-amber-600 whitespace-nowrap">{warning}%</span>
            </div>
            <div className="absolute h-3 w-px bg-red-400" style={{ left: `${(critical / (critical * 2)) * 100}%` }}>
              <span className="absolute top-3 left-1 text-[9px] text-red-600 whitespace-nowrap">{critical}%</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-400 mt-6">
          Atención: {warning}% · Crítico: {critical}% · Reducir velocidad de cilindro si supera umbral
        </p>
      </div>
    </div>
  );
}

export function SubsistemaTrilla() {
  const [result,          setResult]          = useState(null);
  const [history,         setHistory]         = useState([]);
  const [isLoading,       setIsLoading]       = useState(false);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [imageUrl,        setImageUrl]        = useState(null);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    getHistoryFromDB("trilla", 30)
      .then(res => setHistory(Array.isArray(res) ? res : res?.records || []))
      .catch(() => setHistory([]));
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
    setImageUrl(URL.createObjectURL(file));
    setShowSegmentation(false);
    try {
      const data = await analyzeImage("trilla", file);
      setResult(data);
      setHistory(prev => [...prev.slice(-29), {
        id: Date.now(),
        subsystem: "trilla",
        timestamp: data.frame_id,
        latency_ms: data.latency_ms,
        s2_broken_pct: data.indicators.broken_grain_pct,
        s2_intact_pct: data.indicators.intact_grain_pct,
        s2_straw_pct:  data.indicators.straw_pct,
        alert_count: data.alerts.length,
      }]);
    } catch (err) {
      console.error("Error análisis S2:", err);
      setError(err instanceof Error ? err.message : "Error desconocido al analizar la imagen");
    } finally {
      setIsLoading(false);
    }
  }

  const ind    = result?.indicators;
  const alerts = result?.alerts || [];

  const brokenLevel = !ind ? null
    : ind.broken_grain_pct >= BROKEN_CRITICAL ? "CRITICO"
    : ind.broken_grain_pct >= BROKEN_WARNING  ? "ATENCION"
    : "NORMAL";

  const overallStatus = alerts.some(a => a.level === "CRITICO") ? "CRITICO"
    : alerts.some(a => a.level === "ATENCION") ? "ATENCION"
    : result ? "NORMAL" : null;

  const compositionSegments = ind ? [
    { label: "Grano Íntegro", value: ind.intact_grain_pct,    color: SEG_COLORS.intact },
    { label: "Grano Roto",    value: ind.broken_grain_pct,    color: SEG_COLORS.broken },
    { label: "Paja",          value: ind.straw_pct,           color: SEG_COLORS.straw  },
  ] : [];

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto w-full">

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-800 text-sm">Error en el análisis S2</p>
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

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(a => <AlertBanner key={a.id} alert={a} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Left: image viewer */}
        <div className="lg:col-span-3 space-y-4">
          <Panel
            title="Vista del Flujo de Trilla"
            badge="S2" badgeColor="bg-amber-500"
            icon={Layers}
            action={
              <div className="flex items-center gap-2">
                {overallStatus && <StatusBadge level={overallStatus} />}
                {result && ind?.segmentation_map_b64 && (
                  <div className="flex rounded-lg overflow-hidden border border-stone-200 text-xs font-medium">
                    <button
                      onClick={() => setShowSegmentation(false)}
                      className={clsx(
                        "px-3 py-1.5 transition-colors",
                        !showSegmentation ? "bg-green-100 text-green-700" : "bg-white text-stone-500 hover:bg-stone-50"
                      )}>
                      Original
                    </button>
                    <button
                      onClick={() => setShowSegmentation(true)}
                      className={clsx(
                        "px-3 py-1.5 transition-colors",
                        showSegmentation ? "bg-amber-100 text-amber-700" : "bg-white text-stone-500 hover:bg-stone-50"
                      )}>
                      Segmentación
                    </button>
                  </div>
                )}
              </div>
            }
          >
            <div className="bg-stone-900 rounded-xl overflow-hidden flex items-center justify-center min-h-72">
              {imageUrl ? (
                showSegmentation && ind?.segmentation_map_b64 ? (
                  <img src={ind.segmentation_map_b64} alt="Segmentación semántica" className="w-full h-auto max-h-96 object-contain" />
                ) : (
                  <img src={imageUrl} alt="Frame de trilla" className="w-full h-auto max-h-96 object-contain" />
                )
              ) : (
                <div className="text-center text-stone-500 py-12 px-6">
                  <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6 text-stone-500" />
                  </div>
                  <p className="text-sm font-medium text-stone-400">Carga un frame de la zona de trilla</p>
                  <p className="text-xs text-stone-600 mt-1">El modelo clasificará píxeles por clase de material</p>
                </div>
              )}
            </div>

            {/* Segmentation legend */}
            {result && (
              <div className="flex gap-4 mt-3 pt-3 border-t border-stone-100">
                {[
                  { label: "Grano Íntegro", color: SEG_COLORS.intact },
                  { label: "Grano Roto",    color: SEG_COLORS.broken },
                  { label: "Paja",          color: SEG_COLORS.straw  },
                ].map(i => (
                  <div key={i.label} className="flex items-center gap-1.5 text-xs text-stone-500">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: i.color }} />
                    {i.label}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Cargar Frame de Trilla" icon={Cpu}>
            <FileUpload onFileSelected={handleFileSelected} isLoading={isLoading} />
          </Panel>
        </div>

        {/* Right: indicators */}
        <div className="lg:col-span-2 space-y-4">

          <CriticalGauge
            value={ind?.broken_grain_pct ?? null}
            level={brokenLevel}
            warning={BROKEN_WARNING}
            critical={BROKEN_CRITICAL}
          />

          <div className="grid grid-cols-1 gap-3">
            <MetricCard
              title="Grano Íntegro"
              value={ind ? `${ind.intact_grain_pct.toFixed(1)}%` : "—"}
              color="green"
              subtitle="Objetivo: maximizar ↑"
            />
            <MetricCard
              title="Paja en Flujo"
              value={ind ? `${ind.straw_pct.toFixed(1)}%` : "—"}
              color="gray"
              subtitle="Material residual separado"
            />
            <MetricCard
              title="Latencia de Inferencia"
              value={result ? result.latency_ms.toFixed(1) : "—"}
              unit="ms"
              icon={<Cpu size={16} />}
              color="blue"
            />
          </div>

          {compositionSegments.length > 0 && (
            <Panel title="Composición del Flujo" icon={Layers}>
              <CompositionBar segments={compositionSegments} />
            </Panel>
          )}

          {ind?.overload_detected && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Sobrecarga Detectada</p>
              </div>
              <p className="text-sm text-red-800 leading-relaxed">
                El flujo de trilla está saturado. Reducir velocidad de avance de la cosechadora.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trend chart */}
      <Panel
        title="Tendencia — % Grano Roto (S2)"
        badge="S2" badgeColor="bg-amber-500"
        icon={TrendingUp}
        action={
          <button
            onClick={() => exportDiagnosticCSV("trilla")}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-green-600 border border-stone-200 hover:border-green-300 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Exportar CSV
          </button>
        }
      >
        <TrendChart
          data={history}
          dataKey="s2_broken_pct"
          label="Grano roto"
          color="#ef4444"
          threshold={BROKEN_CRITICAL}
          unit="%"
          xKey="timestamp"
          filled
        />
      </Panel>
    </div>
  );
}
