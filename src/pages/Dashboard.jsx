import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Activity,
  Scissors,
  Settings2,
  Wind,
  RefreshCw,
  CheckCircle2,
  Zap,
  BarChart2,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard.jsx";
import { SubsystemCard } from "@/components/shared/SubsystemCard.jsx";
import { AlertBanner } from "@/components/shared/AlertBanner.jsx";
import { getSystemStatus } from "@/services/api.ts";

/* ── Skeleton loader ─────────────────────────────────────────────── */
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-xl bg-stone-200 ${className}`} />
  );
}

/* ── Section header ──────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-green-700" />
        </div>
        <h3 className="font-display font-semibold text-stone-700 text-sm">
          {title}
        </h3>
      </div>
      {action}
    </div>
  );
}

/* ── System health bar ───────────────────────────────────────────── */
function HealthBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">{label}</span>
        <span className="text-xs font-mono font-bold text-stone-700">
          {value}%
        </span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function Dashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadStatus();
    const id = setInterval(loadStatus, 30_000);
    return () => clearInterval(id);
  }, []);

  async function loadStatus() {
    try {
      const data = await getSystemStatus();
      setStatus(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Error cargando estado del sistema:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-stone-400">
        <AlertTriangle className="w-8 h-8" />
        <p className="font-medium">Error al cargar el estado del sistema</p>
        <button
          onClick={loadStatus}
          className="text-sm text-green-600 hover:text-green-700 font-semibold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const sessionMinutes = Math.floor(
    (Date.now() - new Date(status.session_start).getTime()) / 60_000,
  );
  const criticalCount = status.recent_alerts.filter(
    (a) => a.level === "CRITICO",
  ).length;
  const atencionCount = status.recent_alerts.filter(
    (a) => a.level === "ATENCION",
  ).length;
  const allNormal = criticalCount === 0 && atencionCount === 0;
  const refreshTime = lastRefresh.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto w-full">
      {/* ── Page title + refresh ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-stone-800 text-xl">
            Vista General del Sistema
          </h2>
          <p className="text-stone-400 text-sm mt-0.5">
            Monitoreo en tiempo real de los tres subsistemas activos
          </p>
        </div>
        <button
          onClick={loadStatus}
          className="flex items-center gap-2 text-xs text-stone-500 hover:text-green-600 bg-white border border-stone-200 hover:border-green-300 px-3 py-2 rounded-xl transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Actualizado {refreshTime}</span>
        </button>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Alertas Críticas"
          value={criticalCount}
          icon={<AlertTriangle size={18} />}
          color={criticalCount > 0 ? "red" : "green"}
          subtitle={
            criticalCount > 0 ? "Requieren atención" : "Sin alertas activas"
          }
        />
        <MetricCard
          title="Alertas en Revisión"
          value={atencionCount}
          icon={<Zap size={18} />}
          color={atencionCount > 0 ? "yellow" : "green"}
          subtitle={
            atencionCount > 0 ? "Monitorear de cerca" : "Dentro de parámetros"
          }
        />
        <MetricCard
          title="Duración Sesión"
          value={sessionMinutes}
          unit="min"
          icon={<Clock size={18} />}
          color="blue"
          subtitle="Desde inicio de cosecha"
        />
        <MetricCard
          title="Subsistemas Activos"
          value="3 / 3"
          icon={<Activity size={18} />}
          color="green"
          subtitle="S1 · S2 · S3 en línea"
        />
      </div>

      {/* ── System overview banner ───────────────────────────── */}
      {allNormal ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <CheckCircle2 className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <p className="font-semibold text-green-800 text-sm">
              Sistema operando dentro de parámetros normales
            </p>
            <p className="text-green-600 text-xs">
              Todos los subsistemas funcionan correctamente · Última
              verificación: {refreshTime}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5">
          <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
            <AlertTriangle className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <p className="font-semibold text-red-800 text-sm">
              {criticalCount} alerta{criticalCount !== 1 ? "s" : ""} crítica
              {criticalCount !== 1 ? "s" : ""} activa
              {criticalCount !== 1 ? "s" : ""}
            </p>
            <p className="text-red-600 text-xs">
              Revisa los subsistemas afectados para acción inmediata
            </p>
          </div>
        </div>
      )}

      {/* ── Subsystem Cards ──────────────────────────────────── */}
      <div>
        <SectionHeader icon={BarChart2} title="Estado por Subsistema" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SubsystemCard
            name="Cabezal de Corte"
            description="Panículas, acame y densidad espacial"
            status={status.s1.status}
            badge="S1"
            badgeColor="bg-green-500"
            icon={<Scissors className="w-6 h-6 text-green-600" />}
            linkTo="/subsistema/corte"
            metrics={[
              { label: "Panículas", value: `${status.s1.last_panicle_count}` },
              {
                label: "Acamado",
                value: status.s1.lodging_detected
                  ? "Detectado"
                  : "No detectado",
              },
              {
                label: "Latencia IA",
                value: `${status.s1.last_latency_ms.toFixed(1)} ms`,
              },
              { label: "Estado", value: status.s1.status },
            ]}
          />
          <SubsystemCard
            name="Zona de Trilla"
            description="Composición del flujo trillador"
            status={status.s2.status}
            badge="S2"
            badgeColor="bg-amber-500"
            icon={<Settings2 className="w-6 h-6 text-amber-600" />}
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
            name="Sistema de Limpieza"
            description="Flujo de salida y pérdida de grano"
            status={status.s3.status}
            badge="S3"
            badgeColor="bg-blue-500"
            icon={<Wind className="w-6 h-6 text-blue-600" />}
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

      {/* ── Grain quality overview ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* S2 quality bars */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-md font-mono">
              S2
            </span>
            <span className="text-sm font-semibold text-stone-700">
              Calidad en Trilla
            </span>
          </div>
          <div className="space-y-3">
            <HealthBar
              label="Grano Íntegro"
              value={status.s2.intact_grain_pct}
              max={100}
              color="#22c55e"
            />
            <HealthBar
              label="Grano Roto"
              value={status.s2.broken_grain_pct * 100}
              max={1}
              color="#f59e0b"
            />
            <HealthBar
              label="Paja Residual"
              value={
                100 -
                status.s2.intact_grain_pct -
                status.s2.broken_grain_pct * 100
              }
              max={20}
              color="#a8a29e"
            />
          </div>
        </div>

        {/* S3 quality bars */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-md font-mono">
              S3
            </span>
            <span className="text-sm font-semibold text-stone-700">
              Calidad en Limpieza
            </span>
          </div>
          <div className="space-y-3">
            <HealthBar
              label="Grano Íntegro"
              value={status.s3.intact_grain_pct}
              max={100}
              color="#22c55e"
            />
            <HealthBar
              label="Grano Roto"
              value={status.s3.broken_grain_pct}
              max={5}
              color="#f59e0b"
            />
            <HealthBar
              label="Material No-Grano"
              value={status.s3.non_grain_pct}
              max={5}
              color="#ef4444"
            />
          </div>
        </div>
      </div>

      {/* ── Recent alerts ────────────────────────────────────── */}
      <div>
        <SectionHeader
          icon={AlertTriangle}
          title="Alertas Recientes"
          action={
            <span className="text-[11px] text-stone-400 font-mono">
              {status.recent_alerts.length} evento
              {status.recent_alerts.length !== 1 ? "s" : ""}
            </span>
          }
        />
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {status.recent_alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-stone-400">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              <p className="text-sm font-medium text-stone-500">
                Sin alertas recientes
              </p>
              <p className="text-xs">
                El sistema opera dentro de parámetros normales
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2.5">
              {status.recent_alerts.slice(0, 8).map((alert) => (
                <AlertBanner key={alert.id} alert={alert} dismissible={false} />
              ))}
              {status.recent_alerts.length > 8 && (
                <p className="text-center text-xs text-stone-400 pt-1">
                  + {status.recent_alerts.length - 8} alertas adicionales en el
                  registro
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
