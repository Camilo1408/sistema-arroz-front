import { useState, useEffect } from "react";
import { Download, Wind, Activity, TrendingUp, Cpu, AlertTriangle } from "lucide-react";
import { MetricCard }    from "@/components/shared/MetricCard.jsx";
import { AlertBanner }   from "@/components/shared/AlertBanner.jsx";
import { ImageCanvas }   from "@/components/shared/ImageCanvas.jsx";
import { CompositionBar } from "@/components/shared/CompositionBar.jsx";
import { TrendChart }    from "@/components/shared/TrendChart.jsx";
import { FileUpload }    from "@/components/shared/FileUpload.jsx";
import { StatusBadge }   from "@/components/shared/StatusBadge.jsx";
import { analyzeImage, getHistoryFromDB, exportDiagnosticCSV } from "@/services/api.ts";
import clsx from "clsx";

const NON_GRAIN_WARNING  = 1.5;
const NON_GRAIN_CRITICAL = 2.0;

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

function CriticalGauge({ value, level, warning, critical, label, note }) {
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
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
          {level && <StatusBadge level={level} size="sm" />}
        </div>

        <p className={clsx("text-5xl font-bold font-mono leading-none mt-2", s.val)}>
          {value !== null ? `${value.toFixed(1)}%` : "—"}
        </p>

        <div className="mt-4 space-y-1">
          <div className="h-2.5 bg-stone-200/60 rounded-full overflow-hidden">
            <div className={clsx("h-full rounded-full transition-all duration-700", s.fill)} style={{ width: `${pct}%` }} />
          </div>
          <div className="relative h-3">
            <div className="absolute h-3 w-px bg-amber-400" style={{ left: `${(warning / (critical * 2)) * 100}%` }}>
              <span className="absolute top-3 left-1 text-[9px] text-amber-600 whitespace-nowrap">{warning}%</span>
            </div>
            <div className="absolute h-3 w-px bg-red-400" style={{ left: `${(critical / (critical * 2)) * 100}%` }}>
              <span className="absolute top-3 left-1 text-[9px] text-red-600 whitespace-nowrap">{critical}%</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-400 mt-6">{note}</p>
      </div>
    </div>
  );
}

export function SubsistemaLimpieza() {
  const [result,    setResult]    = useState(null);
  const [history,   setHistory]   = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl,  setImageUrl]  = useState(null);

  useEffect(() => {
    getHistoryFromDB("limpieza", 30)
      .then(res => setHistory(Array.isArray(res) ? res : res?.records || []))
      .catch(() => setHistory([]));
  }, []);

  async function handleFileSelected(file) {
    setIsLoading(true);
    setImageUrl(URL.createObjectURL(file));
    try {
      const data = await analyzeImage("limpieza", file);
      setResult(data);
      setHistory(prev => [...prev.slice(-29), {
        id: Date.now(),
        subsystem: "limpieza",
        timestamp: data.frame_id,
        latency_ms: data.latency_ms,
        non_grain_pct:   data.indicators.non_grain_pct,
        broken_grain_pct: data.indicators.broken_grain_pct,
        alert_count: data.alerts.length,
      }]);
    } catch (err) {
      console.error("Error análisis S3:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const ind        = result?.indicators;
  const alerts     = result?.alerts || [];
  const detections = result?.detections || [];

  const nonGrainLevel = !ind ? null
    : ind.non_grain_pct >= NON_GRAIN_CRITICAL ? "CRITICO"
    : ind.non_grain_pct >= NON_GRAIN_WARNING  ? "ATENCION"
    : "NORMAL";

  const overallStatus = alerts.some(a => a.level === "CRITICO") ? "CRITICO"
    : alerts.some(a => a.level === "ATENCION") ? "ATENCION"
    : result ? "NORMAL" : null;

  const compositionSegments = ind ? [
    { label: "Grano Íntegro",     value: ind.intact_grain_pct,    color: "#22c55e" },
    { label: "Grano Roto",        value: ind.broken_grain_pct,    color: "#f97316" },
    { label: "Material No-Grano", value: ind.non_grain_pct,       color: "#ef4444" },
  ] : [];

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto w-full">

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(a => <AlertBanner key={a.id} alert={a} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Left: image + upload */}
        <div className="lg:col-span-3 space-y-4">
          <Panel
            title="Flujo de Salida — Sistema de Limpieza"
            badge="S3" badgeColor="bg-blue-500"
            icon={Activity}
            action={overallStatus && <StatusBadge level={overallStatus} />}
          >
            <ImageCanvas imageUrl={imageUrl} detections={detections} imageWidth={640} imageHeight={640} />
          </Panel>

          <Panel title="Cargar Frame del Sistema de Limpieza" icon={Cpu}>
            <FileUpload onFileSelected={handleFileSelected} accept="both" isLoading={isLoading} />
            <p className="text-xs text-stone-400 mt-3 text-center">
              El modelo detectará grano íntegro, roto y material no-grano en la salida
            </p>
          </Panel>
        </div>

        {/* Right: indicators */}
        <div className="lg:col-span-2 space-y-4">

          <CriticalGauge
            label="Material No-Grano — Indicador Crítico"
            value={ind?.non_grain_pct ?? null}
            level={nonGrainLevel}
            warning={NON_GRAIN_WARNING}
            critical={NON_GRAIN_CRITICAL}
            note={`Atención: ${NON_GRAIN_WARNING}% · Crítico: ${NON_GRAIN_CRITICAL}% · Calculado por área de bbox ponderada`}
          />

          {ind?.recommended_action && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Wind className="w-4 h-4 text-red-600" />
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Acción Recomendada</p>
              </div>
              <p className="text-sm text-red-800">{ind.recommended_action}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <MetricCard
              title="Grano Íntegro"
              value={ind ? `${ind.intact_grain_pct.toFixed(1)}%` : "—"}
              color="green"
              subtitle="Objetivo: maximizar ↑"
            />
            <MetricCard
              title="Grano Roto"
              value={ind ? `${ind.broken_grain_pct.toFixed(1)}%` : "—"}
              color={ind?.broken_grain_pct > 3 ? "yellow" : "gray"}
              subtitle="Calidad degradada del producto"
            />
            <MetricCard
              title="Partículas Detectadas"
              value={ind?.total_detections ?? "—"}
              icon={<AlertTriangle size={16} />}
              color="blue"
              subtitle="Total de objetos en el frame"
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
            <Panel title="Composición del Flujo de Salida" icon={Wind}>
              <CompositionBar segments={compositionSegments} />
            </Panel>
          )}
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel
          title="Tendencia — Material No-Grano"
          badge="S3" badgeColor="bg-blue-500"
          icon={TrendingUp}
          action={
            <button
              onClick={() => exportDiagnosticCSV("limpieza")}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-green-600 border border-stone-200 hover:border-green-300 px-2.5 py-1.5 rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          }
        >
          <TrendChart
            data={history}
            dataKey="non_grain_pct"
            label="Material no-grano"
            color="#ef4444"
            threshold={NON_GRAIN_CRITICAL}
            unit="%"
            xKey="timestamp"
            filled
          />
        </Panel>

        <Panel
          title="Tendencia — Grano Roto"
          badge="S3" badgeColor="bg-blue-500"
          icon={TrendingUp}
        >
          <TrendChart
            data={history}
            dataKey="broken_grain_pct"
            label="Grano roto"
            color="#f97316"
            unit="%"
            xKey="timestamp"
            filled
          />
        </Panel>
      </div>
    </div>
  );
}
