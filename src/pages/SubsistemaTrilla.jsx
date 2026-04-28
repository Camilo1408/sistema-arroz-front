// src/pages/SubsistemaTrilla.jsx
// ============================================================
// VISTA S2 — ZONA DE TRILLA
// ============================================================
// Muestra la composición del flujo de material (grano íntegro,
// grano roto, paja) mediante segmentación semántica.
// El indicador crítico es el % de grano roto (umbral: 0.5%).

import { useState, useEffect } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard.jsx";
import { AlertBanner } from "@/components/shared/AlertBanner.jsx";
import { CompositionBar } from "@/components/shared/CompositionBar.jsx";
import { TrendChart } from "@/components/shared/TrendChart.jsx";
import { FileUpload } from "@/components/shared/FileUpload.jsx";
import { StatusBadge } from "@/components/shared/StatusBadge.jsx";
import {
  analyzeImage,
  getHistoryFromDB,
  exportDiagnosticCSV,
} from "@/services/api.ts";

// Umbrales del proyecto (sección 5.8 del documento)
const BROKEN_WARNING = 0.3; // %
const BROKEN_CRITICAL = 0.5; // %

// Colores del mapa de segmentación
const SEGMENT_COLORS = {
  intact: "#22c55e", // verde — grano íntegro
  broken: "#ef4444", // rojo — grano roto
  straw: "#eab308", // amarillo — paja
};

export function SubsistemaTrilla() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Cargar historial desde BD al montar el componente
  useEffect(() => {
    getHistoryFromDB("trilla", 30)
      .then((response) => {
        // response puede ser array directo o { records: [...] }
        const records = Array.isArray(response)
          ? response
          : response?.records || [];
        setHistory(records);
      })
      .catch((err) => {
        console.error("Error cargando historial:", err);
        setHistory([]);
      });
  }, []);

  // Maneja la carga y análisis de la imagen
  async function handleFileSelected(file) {
    setIsLoading(true);
    setImageUrl(URL.createObjectURL(file));
    setShowSegmentation(false); // Reinicia a vista normal

    try {
      const data = await analyzeImage("trilla", file);
      setResult(data);

      // Actualiza el historial con el nuevo resultado
      setHistory((prev) => [
        ...prev.slice(-29),
        {
          id: Date.now(),
          subsystem: "trilla",
          timestamp: data.frame_id,
          latency_ms: data.latency_ms,
          s2_broken_pct: data.indicators.broken_grain_pct,
          s2_intact_pct: data.indicators.intact_grain_pct,
          s2_straw_pct: data.indicators.straw_pct,
          alert_count: data.alerts.length,
          status: data.alerts.some((a) => a.level === "CRITICO")
            ? "CRITICO"
            : data.alerts.some((a) => a.level === "ATENCION")
              ? "ATENCION"
              : "NORMAL",
        },
      ]);
    } catch (err) {
      console.error("Error análisis S2:", err);
      alert("Error al analizar la imagen: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const ind = result?.indicators;
  const alerts = result?.alerts || [];

  // Nivel de alerta para el grano roto
  const brokenLevel = !ind
    ? null
    : ind.broken_grain_pct >= BROKEN_CRITICAL
      ? "CRITICO"
      : ind.broken_grain_pct >= BROKEN_WARNING
        ? "ATENCION"
        : "NORMAL";

  const overallStatus = alerts.some((a) => a.level === "CRITICO")
    ? "CRITICO"
    : alerts.some((a) => a.level === "ATENCION")
      ? "ATENCION"
      : result
        ? "NORMAL"
        : null;

  // Segmentos para la barra de composición
  const compositionSegments = ind
    ? [
        {
          label: "Grano íntegro",
          value: ind.intact_grain_pct,
          color: SEGMENT_COLORS.intact,
        },
        {
          label: "Grano roto",
          value: ind.broken_grain_pct,
          color: SEGMENT_COLORS.broken,
        },
        { label: "Paja", value: ind.straw_pct, color: SEGMENT_COLORS.straw },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Alertas activas */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <AlertBanner key={a.id} alert={a} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Columna izquierda: Imagen / mapa segmentación */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Vista del Flujo de Trilla
              </h3>
              <div className="flex items-center gap-2">
                {overallStatus && <StatusBadge level={overallStatus} />}

                {/* Toggle entre imagen original y mapa de segmentación */}
                {result && ind?.segmentation_map_b64 && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowSegmentation(false)}
                      className={`text-xs font-medium rounded-lg px-3 py-1.5 transition-colors ${
                        !showSegmentation
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      ✓ Normal
                    </button>
                    <button
                      onClick={() => setShowSegmentation(true)}
                      className={`text-xs font-medium rounded-lg px-3 py-1.5 transition-colors ${
                        showSegmentation
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      🎨 Ver segmentación
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Imagen o mapa de segmentación */}
            <div className="bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-80">
              {imageUrl ? (
                showSegmentation && ind?.segmentation_map_b64 ? (
                  <img
                    src={ind.segmentation_map_b64}
                    alt="Mapa de segmentación semántica"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Frame de trilla"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                )
              ) : (
                <div className="text-center text-gray-500 py-16">
                  <p className="text-4xl mb-3">⚙️</p>
                  <p className="text-sm">
                    Carga una imagen del flujo de trilla
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    El modelo clasificará píxeles por clase de material
                  </p>
                </div>
              )}
            </div>

            {/* Leyenda del mapa de segmentación */}
            {result && (
              <div className="flex gap-4 mt-4">
                {[
                  { label: "Grano íntegro", color: SEGMENT_COLORS.intact },
                  { label: "Grano roto", color: SEGMENT_COLORS.broken },
                  { label: "Paja", color: SEGMENT_COLORS.straw },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 text-xs text-gray-600"
                  >
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Carga de archivo */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Cargar Frame de Trilla
            </h3>
            <FileUpload
              onFileSelected={handleFileSelected}
              accept="both"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Columna derecha: Indicadores */}
        <div className="lg:col-span-2 space-y-4">
          {/* Indicador crítico: % grano roto */}
          <div
            className={`rounded-xl border-2 p-5 ${
              brokenLevel === "CRITICO"
                ? "bg-red-50 border-red-300"
                : brokenLevel === "ATENCION"
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Grano Roto — Indicador Crítico
              </p>
              {brokenLevel && <StatusBadge level={brokenLevel} size="sm" />}
            </div>
            <p
              className={`text-4xl font-bold mt-1 ${
                brokenLevel === "CRITICO"
                  ? "text-red-700"
                  : brokenLevel === "ATENCION"
                    ? "text-yellow-700"
                    : "text-green-700"
              }`}
            >
              {ind ? `${ind.broken_grain_pct.toFixed(2)}%` : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Umbral crítico: {BROKEN_CRITICAL}% · Umbral atención:{" "}
              {BROKEN_WARNING}%
            </p>
            {brokenLevel === "CRITICO" && (
              <p className="text-xs text-red-700 font-medium mt-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                Reducir velocidad del cilindro de trilla
              </p>
            )}
          </div>

          {/* Métricas individuales */}
          <div className="space-y-3">
            <MetricCard
              title="Grano Íntegro"
              value={ind ? `${ind.intact_grain_pct.toFixed(1)}%` : "—"}
              color="green"
              subtitle="Objetivo: maximizar"
            />
            <MetricCard
              title="Paja en Flujo"
              value={ind ? `${ind.straw_pct.toFixed(1)}%` : "—"}
              color="gray"
              subtitle="Material no-grano separado"
            />
            <MetricCard
              title="Latencia de Inferencia"
              value={result ? `${result.latency_ms.toFixed(1)}` : "—"}
              unit="ms"
              color="blue"
            />
          </div>

          {/* Barra de composición proporcional */}
          {compositionSegments.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <CompositionBar
                title="Composición del Flujo de Trilla"
                segments={compositionSegments}
              />
            </div>
          )}

          {/* Indicador de sobrecarga */}
          {ind?.overload_detected && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                ⚠ Sobrecarga Detectada
              </p>
              <p className="text-sm text-red-800 mt-1">
                El flujo de trilla está saturado. Reducir velocidad de avance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gráficas de tendencia */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Tendencia — % Grano Roto (S2)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Evolución del indicador crítico
            </p>
          </div>
          <button
            onClick={() => exportDiagnosticCSV("trilla")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download size={16} /> Exportar CSV
          </button>
        </div>
        <TrendChart
          data={history}
          dataKey="s2_broken_pct"
          label="Grano roto"
          color="#ef4444"
          threshold={BROKEN_CRITICAL}
          unit="%"
          xKey="timestamp"
        />
      </div>
    </div>
  );
}
