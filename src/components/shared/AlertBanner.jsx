import { useState } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, X, Zap } from "lucide-react";
import clsx from "clsx";

const LEVEL_CONFIG = {
  NORMAL: {
    wrap:   "bg-green-50 border-green-200 text-green-800",
    bar:    "bg-green-500",
    icon:   <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />,
    label:  "Normal",
  },
  ATENCION: {
    wrap:   "bg-amber-50 border-amber-200 text-amber-800",
    bar:    "bg-amber-500",
    icon:   <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />,
    label:  "Atención",
  },
  CRITICO: {
    wrap:   "bg-red-50 border-red-200 text-red-800",
    bar:    "bg-red-500",
    icon:   <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />,
    label:  "Crítico",
  },
};

export function AlertBanner({ alert, dismissible = true }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cfg = LEVEL_CONFIG[alert.level] ?? LEVEL_CONFIG.NORMAL;
  const time = new Date(alert.timestamp).toLocaleTimeString("es-CO", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className={clsx(
      "relative border rounded-xl overflow-hidden flex items-start gap-3 p-3.5 pr-4",
      cfg.wrap,
      alert.level === "CRITICO" && "shadow-sm shadow-red-200"
    )}>
      {/* Left accent bar */}
      <div className={clsx("absolute left-0 top-0 bottom-0 w-[3px]", cfg.bar)} />

      {/* Icon */}
      <div className="ml-1 mt-0.5">{cfg.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">{cfg.label}</span>
          {alert.subsystem && (
            <span className="text-[10px] font-mono bg-black/10 px-1.5 py-0.5 rounded-full">
              {alert.subsystem.toUpperCase()}
            </span>
          )}
          <span className="text-[11px] opacity-50 ml-auto font-mono">{time}</span>
        </div>
        <p className="text-sm font-semibold leading-snug">{alert.message}</p>
        {alert.action && (
          <div className="flex items-start gap-1 mt-1.5">
            <Zap size={11} className="mt-0.5 opacity-60 flex-shrink-0" />
            <p className="text-xs opacity-75 leading-tight">{alert.action}</p>
          </div>
        )}
      </div>

      {/* Dismiss */}
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="opacity-40 hover:opacity-80 transition-opacity flex-shrink-0 mt-0.5"
          aria-label="Cerrar alerta"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
