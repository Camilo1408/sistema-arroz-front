// src/components/shared/AlertBanner.jsx
// ============================================================
// Muestra una alerta con nivel, mensaje y acción sugerida.
// El color cambia según el nivel: verde, amarillo o rojo.
// ============================================================

import { AlertTriangle, AlertCircle, CheckCircle, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

/**
 * @param {object} props
 * @param {import('@/types/models').Alert} props.alert - Objeto de alerta
 * @param {boolean} [props.dismissible] - Si puede cerrarse
 */
export function AlertBanner({ alert, dismissible = true }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const config = {
    NORMAL: {
      container: "bg-green-50 border-green-300 text-green-800",
      icon: <CheckCircle size={18} className="text-green-600 flex-shrink-0" />,
    },
    ATENCION: {
      container: "bg-yellow-50 border-yellow-300 text-yellow-800",
      icon: <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />,
    },
    CRITICO: {
      container: "bg-red-50 border-red-300 text-red-800",
      icon: <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />,
    },
  };

  const { container, icon } = config[alert.level];

  // Formatea timestamp a hora legible
  const time = new Date(alert.timestamp).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={clsx(
        "border rounded-lg p-3 flex items-start gap-3",
        container,
      )}
    >
      {icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            {alert.level}
          </span>
          <span className="text-xs opacity-60">· {time}</span>
        </div>
        <p className="text-sm font-medium mt-0.5">{alert.message}</p>
        {alert.action && (
          <p className="text-xs mt-1 opacity-80">
            <span className="font-semibold">Acción: </span>
            {alert.action}
          </p>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label="Cerrar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
