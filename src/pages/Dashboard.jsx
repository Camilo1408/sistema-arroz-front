// src/pages/Dashboard.jsx
// ============================================================
// DASHBOARD GENERAL — Vista 0
// ============================================================
// Muestra un resumen del estado de los tres subsistemas y
// el historial de alertas recientes.
// El operario puede ver de un vistazo si hay algún problema.

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Activity } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard.jsx";
import { SubsystemCard } from "@/components/shared/SubsystemCard.jsx";
import { AlertBanner } from "@/components/shared/AlertBanner.jsx";
import { getSystemStatus } from "@/services/api.ts";

export function Dashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga el estado del sistema al montar el componente
  useEffect(() => {
    loadStatus();
    // Recarga cada 30 segundos para mantener el dashboard actualizado
    const interval = setInterval(loadStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    try {
      const data = await getSystemStatus();
      setStatus(data);
    } catch (err) {
      console.error("Error cargando estado del sistema:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Error al cargar el estado del sistema.</p>
      </div>
    );
  }

  // Duración de la sesión
  const sessionMinutes = Math.floor(
    (Date.now() - new Date(status.session_start).getTime()) / 60_000,
  );

  // Conteo de alertas críticas activas
  const criticalCount = status.recent_alerts.filter(
    (a) => a.level === "CRITICO",
  ).length;

  return (
    <div className="space-y-6">
      {/* ── MÉTRICAS GLOBALES ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Alertas Críticas Activas"
          value={criticalCount}
          icon={<AlertTriangle size={20} />}
          color={criticalCount > 0 ? "red" : "green"}
          subtitle={
            criticalCount > 0
              ? "Requieren atención inmediata"
              : "Todo dentro de parámetros"
          }
        />
        <MetricCard
          title="Duración de Sesión"
          value={sessionMinutes}
          unit="min"
          icon={<Clock size={20} />}
          color="blue"
          subtitle="Desde el inicio de la cosecha"
        />
        <MetricCard
          title="Subsistemas Activos"
          value="3 / 3"
          icon={<Activity size={20} />}
          color="green"
          subtitle="S1, S2 y S3 en línea"
        />
      </div>

      {/* ── TARJETAS DE SUBSISTEMAS ───────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Estado por Subsistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SubsystemCard
            name="S1 — Cabezal de Corte"
            description="Detección de panículas y cultivo acamado"
            status={status.s1.status}
            icon="✂️"
            linkTo="/subsistema/corte"
            metrics={[
              {
                label: "Panículas detectadas",
                value: status.s1.last_panicle_count,
              },
              {
                label: "Cultivo acamado",
                value: status.s1.lodging_detected
                  ? "🔴 Detectado"
                  : "✓ No detectado",
              },
              {
                label: "Latencia IA",
                value: `${status.s1.last_latency_ms.toFixed(1)} ms`,
              },
              { label: "Estado", value: status.s1.status },
            ]}
          />
          <SubsystemCard
            name="S2 — Zona de Trilla"
            description="Segmentación del flujo de material"
            status={status.s2.status}
            icon="⚙️"
            linkTo="/subsistema/trilla"
            metrics={[
              {
                label: "Grano íntegro",
                value: `${status.s2.intact_grain_pct.toFixed(1)}%`,
              },
              {
                label: "Grano roto",
                value: `${status.s2.broken_grain_pct.toFixed(2)}%`,
              },
              { label: "Umbral crítico", value: "0.5%" },
              {
                label: "Latencia IA",
                value: `${status.s2.last_latency_ms.toFixed(1)} ms`,
              },
            ]}
          />
          <SubsystemCard
            name="S3 — Sistema de Limpieza"
            description="Composición del flujo de salida"
            status={status.s3.status}
            icon="🌬️"
            linkTo="/subsistema/limpieza"
            metrics={[
              {
                label: "Grano íntegro",
                value: `${status.s3.intact_grain_pct.toFixed(1)}%`,
              },
              {
                label: "Material no-grano",
                value: `${status.s3.non_grain_pct.toFixed(1)}%`,
              },
              { label: "Umbral crítico", value: "2.0%" },
              {
                label: "Latencia IA",
                value: `${status.s3.last_latency_ms.toFixed(1)} ms`,
              },
            ]}
          />
        </div>
      </div>

      {/* ── HISTORIAL DE ALERTAS ──────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Alertas Recientes
        </h3>
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {status.recent_alerts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              Sin alertas recientes — sistema operando normalmente ✓
            </p>
          ) : (
            status.recent_alerts.map((alert) => (
              <AlertBanner key={alert.id} alert={alert} dismissible={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
