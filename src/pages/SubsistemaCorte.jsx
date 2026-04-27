// src/pages/SubsistemaCorte.jsx
// ============================================================
// VISTA S1 — CABEZAL DE CORTE
// ============================================================
// Permite al usuario cargar una imagen o video del cabezal de
// corte y ver: bounding boxes, densidad de panículas,
// detección de cultivo acamado y mapa de densidad por zona.

import { useState, useEffect } from "react";
import { Download, Wheat, MapPin } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard.jsx";
import { AlertBanner } from "@/components/shared/AlertBanner.jsx";
import { ImageCanvas } from "@/components/shared/ImageCanvas.jsx";
import { DensityGrid } from "@/components/shared/DensityGrid.jsx";
import { TrendChart } from "@/components/shared/TrendChart.jsx";
import { FileUpload } from "@/components/shared/FileUpload.jsx";
import { StatusBadge } from "@/components/shared/StatusBadge.jsx";
import {
  analyzeImage,
  getHistory,
  exportDiagnosticCSV,
} from "@/services/api.ts";

export function SubsistemaCorte() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Carga el historial al montar la vista
  useEffect(() => {
    getHistory("corte").then(setHistory).catch(console.error);
  }, []);

  // Analiza una imagen seleccionada por el usuario
  async function handleFileSelected(file) {
    setIsLoading(true);
    // Crea URL local para mostrar la imagen en el canvas
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);

    try {
      const inferenceResult = await analyzeImage("corte", file);
      setResult(inferenceResult);
      // Actualiza el historial con el nuevo resultado
      setHistory((prev) => [
        ...prev.slice(-29),
        {
          id: prev.length + 1,
          subsystem: "corte",
          timestamp: inferenceResult.frame_id,
          latency_ms: inferenceResult.latency_ms,
          panicle_count: inferenceResult.indicators.panicle_count,
          lodging_detected: inferenceResult.indicators.lodging_detected,
          alert_count: inferenceResult.alerts.length,
        },
      ]);
    } catch (err) {
      console.error("Error en análisis S1:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Extrae indicadores del resultado actual
  const indicators = result?.indicators;
  const detections = result?.detections || [];
  const alerts = result?.alerts || [];

  // Determina el nivel de alerta general del subsistema
  const overallStatus = alerts.some((a) => a.level === "CRITICO")
    ? "CRITICO"
    : alerts.some((a) => a.level === "ATENCION")
      ? "ATENCION"
      : result
        ? "NORMAL"
        : null;

  return (
    <div className="space-y-6">
      {/* ── ALERTAS ACTIVAS ───────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <AlertBanner key={a.id} alert={a} />
          ))}
        </div>
      )}

      {/* ── FILA PRINCIPAL: IMAGEN + INDICADORES ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Columna izquierda (3/5): Imagen analizada + carga */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Imagen Analizada</h3>
              {overallStatus && <StatusBadge level={overallStatus} />}
            </div>
            {/* Canvas muestra la imagen con bounding boxes superpuestos */}
            <ImageCanvas
              imageUrl={imageUrl}
              detections={detections}
              imageWidth={640}
              imageHeight={640}
            />
          </div>

          {/* Componente de carga de archivos */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Cargar Imagen o Video
            </h3>
            <FileUpload
              onFileSelected={handleFileSelected}
              accept="both"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Columna derecha (2/5): Indicadores operativos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Indicadores numéricos */}
          <div className="grid grid-cols-1 gap-3">
            <MetricCard
              title="Panículas Detectadas"
              value={indicators?.panicle_count ?? "—"}
              icon={<Wheat size={20} />}
              color={
                indicators?.panicle_density === "MUY_ALTA" ||
                indicators?.panicle_density === "ALTA"
                  ? "yellow"
                  : "green"
              }
              subtitle={
                indicators
                  ? `Densidad: ${indicators.panicle_density}`
                  : "Carga un frame para analizar"
              }
            />
            <MetricCard
              title="Cultivo Acamado"
              value={
                indicators
                  ? indicators.lodging_detected
                    ? "⚠️ DETECTADO"
                    : "✓ No detectado"
                  : "—"
              }
              icon={<MapPin size={20} />}
              color={indicators?.lodging_detected ? "red" : "green"}
              subtitle={
                indicators?.lodging_zone
                  ? `Zona: ${indicators.lodging_zone}`
                  : undefined
              }
            />
            <MetricCard
              title="Latencia de Inferencia"
              value={result ? result.latency_ms.toFixed(1) : "—"}
              unit="ms"
              color="blue"
              subtitle="Tiempo de procesamiento del modelo IA"
            />
          </div>

          {/* Mapa de densidad 4x4 */}
          {indicators?.density_grid && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-1">
                Mapa de Densidad por Región
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Número de panículas detectadas por zona de la imagen
              </p>
              <DensityGrid grid={indicators.density_grid} />
            </div>
          )}

          {/* Recomendación operativa */}
          {indicators?.recommended_action && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Recomendación Operativa
              </p>
              <p className="text-sm text-blue-800">
                {indicators.recommended_action}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── GRÁFICAS DE TENDENCIA ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Tendencia Histórica — S1
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Últimos 30 frames analizados
            </p>
          </div>
          <button
            onClick={() => exportDiagnosticCSV("corte")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
        <TrendChart
          data={history}
          dataKey="panicle_count"
          label="Panículas detectadas"
          color="#3b82f6"
          unit=" pan."
          xKey="timestamp"
        />
      </div>

      {/* ── TABLA DE ÚLTIMAS DETECCIONES ─────────────────────── */}
      {detections.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">
            Detecciones del Frame Actual ({detections.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase">
                    Clase
                  </th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase">
                    Confianza
                  </th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase">
                    Bounding Box
                  </th>
                </tr>
              </thead>
              <tbody>
                {detections.map((det) => (
                  <tr
                    key={det.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          det.class === "cultivo_acamado"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {det.class}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono">
                      {(det.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-2 px-3 font-mono text-gray-500 text-xs">
                      [{det.bbox.join(", ")}]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
