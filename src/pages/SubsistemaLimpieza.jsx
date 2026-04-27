// src/pages/SubsistemaLimpieza.jsx
// ============================================================
// VISTA S3 — SISTEMA DE LIMPIEZA
// ============================================================
// Muestra la composición del flujo de salida: grano íntegro,
// grano roto y material no-grano. El indicador crítico es el
// % de material no-grano (umbral: 2.0%).

import { useState, useEffect } from "react";
import { Download, Wind } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard.jsx";
import { AlertBanner } from "@/components/shared/AlertBanner.jsx";
import { ImageCanvas } from "@/components/shared/ImageCanvas.jsx";
import { CompositionBar } from "@/components/shared/CompositionBar.jsx";
import { TrendChart } from "@/components/shared/TrendChart.jsx";
import { FileUpload } from "@/components/shared/FileUpload.jsx";
import { StatusBadge } from "@/components/shared/StatusBadge.jsx";
import {
  analyzeImage,
  getHistoryFromDB,
  exportDiagnosticCSV,
} from "@/services/api.ts";

const NON_GRAIN_WARNING = 1.5;
const NON_GRAIN_CRITICAL = 2.0;

export function SubsistemaLimpieza() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    getHistoryFromDB("limpieza", 30)
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

  async function handleFileSelected(file) {
    setIsLoading(true);
    setImageUrl(URL.createObjectURL(file));
    try {
      const data = await analyzeImage("limpieza", file);
      setResult(data);
      setHistory((prev) => [
        ...prev.slice(-29),
        {
          id: prev.length + 1,
          subsystem: "limpieza",
          timestamp: data.frame_id,
          latency_ms: data.latency_ms,
          non_grain_pct: data.indicators.non_grain_pct,
          broken_grain_pct: data.indicators.broken_grain_pct,
          alert_count: data.alerts.length,
        },
      ]);
    } catch (err) {
      console.error("Error análisis S3:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const ind = result?.indicators;
  const alerts = result?.alerts || [];
  const detections = result?.detections || [];

  const nonGrainLevel = !ind
    ? null
    : ind.non_grain_pct >= NON_GRAIN_CRITICAL
      ? "CRITICO"
      : ind.non_grain_pct >= NON_GRAIN_WARNING
        ? "ATENCION"
        : "NORMAL";

  const overallStatus = alerts.some((a) => a.level === "CRITICO")
    ? "CRITICO"
    : alerts.some((a) => a.level === "ATENCION")
      ? "ATENCION"
      : result
        ? "NORMAL"
        : null;

  const compositionSegments = ind
    ? [
        {
          label: "Grano íntegro",
          value: ind.intact_grain_pct,
          color: "#22c55e",
        },
        { label: "Grano roto", value: ind.broken_grain_pct, color: "#f97316" },
        {
          label: "Material no-grano",
          value: ind.non_grain_pct,
          color: "#ef4444",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <AlertBanner key={a.id} alert={a} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Imagen con bounding boxes */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Flujo de Salida — Limpieza
              </h3>
              {overallStatus && <StatusBadge level={overallStatus} />}
            </div>
            <ImageCanvas
              imageUrl={imageUrl}
              detections={detections}
              imageWidth={640}
              imageHeight={640}
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Cargar Frame del Sistema de Limpieza
            </h3>
            <FileUpload
              onFileSelected={handleFileSelected}
              accept="both"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Indicadores */}
        <div className="lg:col-span-2 space-y-4">
          {/* Indicador crítico: material no-grano */}
          <div
            className={`rounded-xl border-2 p-5 ${
              nonGrainLevel === "CRITICO"
                ? "bg-red-50 border-red-300"
                : nonGrainLevel === "ATENCION"
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Material No-Grano — Indicador Crítico
              </p>
              {nonGrainLevel && <StatusBadge level={nonGrainLevel} size="sm" />}
            </div>
            <p
              className={`text-4xl font-bold mt-1 ${
                nonGrainLevel === "CRITICO"
                  ? "text-red-700"
                  : nonGrainLevel === "ATENCION"
                    ? "text-yellow-700"
                    : "text-green-700"
              }`}
            >
              {ind ? `${ind.non_grain_pct.toFixed(1)}%` : "—"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Umbral crítico: {NON_GRAIN_CRITICAL}% · Por área de bounding box
              ponderada
            </p>
            {ind?.recommended_action && (
              <p className="text-xs text-red-700 font-medium mt-2 flex items-center gap-1">
                <Wind size={12} /> {ind.recommended_action}
              </p>
            )}
          </div>

          {/* Métricas individuales */}
          <div className="space-y-3">
            <MetricCard
              title="Grano Íntegro"
              value={ind ? `${ind.intact_grain_pct.toFixed(1)}%` : "—"}
              color="green"
              subtitle="Debe maximizarse"
            />
            <MetricCard
              title="Grano Roto"
              value={ind ? `${ind.broken_grain_pct.toFixed(1)}%` : "—"}
              color={ind?.broken_grain_pct > 3 ? "yellow" : "gray"}
              subtitle="Indica calidad degradada del producto"
            />
            <MetricCard
              title="Partículas Detectadas"
              value={ind?.total_detections ?? "—"}
              color="blue"
              subtitle="Total de objetos en el frame"
            />
            <MetricCard
              title="Latencia de Inferencia"
              value={result ? `${result.latency_ms.toFixed(1)}` : "—"}
              unit="ms"
              color="blue"
            />
          </div>

          {/* Barra de composición */}
          {compositionSegments.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <CompositionBar
                title="Composición del Flujo de Salida"
                segments={compositionSegments}
              />
            </div>
          )}
        </div>
      </div>

      {/* Gráficas + exportar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Tendencia — Material No-Grano
              </h3>
              <p className="text-xs text-gray-500">
                Indicador crítico del sistema de limpieza
              </p>
            </div>
            <button
              onClick={() => exportDiagnosticCSV("limpieza")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Download size={16} /> CSV
            </button>
          </div>
          <TrendChart
            data={history}
            dataKey="non_grain_pct"
            label="Material no-grano"
            color="#ef4444"
            threshold={NON_GRAIN_CRITICAL}
            unit="%"
            xKey="timestamp"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">
            Tendencia — Grano Roto
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Calidad del producto en flujo de salida
          </p>
          <TrendChart
            data={history}
            dataKey="broken_grain_pct"
            label="Grano roto"
            color="#f97316"
            unit="%"
            xKey="timestamp"
          />
        </div>
      </div>
    </div>
  );
}
