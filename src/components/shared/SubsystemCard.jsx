// src/components/shared/SubsystemCard.jsx
// Muestra el estado resumido de un subsistema en el Dashboard General.

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge.jsx";
import clsx from "clsx";

/**
 * @param {object} props
 * @param {string} props.name - Nombre del subsistema
 * @param {string} props.description - Descripción corta
 * @param {'NORMAL'|'ATENCION'|'CRITICO'} props.status
 * @param {Array<{label: string, value: string|number}>} props.metrics - Métricas a mostrar
 * @param {string} props.linkTo - Ruta de la vista detallada
 * @param {React.ReactNode} props.icon - Ícono principal
 */
export function SubsystemCard({
  name,
  description,
  status,
  metrics,
  linkTo,
  icon,
}) {
  const borderColor = {
    NORMAL: "border-green-200 hover:border-green-300",
    ATENCION: "border-yellow-300 hover:border-yellow-400",
    CRITICO: "border-red-300 hover:border-red-400",
  }[status];

  return (
    <div
      className={clsx(
        "bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md flex flex-col gap-4",
        borderColor,
      )}
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <StatusBadge level={status} size="sm" />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Link a vista detallada */}
      <Link
        to={linkTo}
        className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 hover:border-blue-300 rounded-lg py-2"
      >
        Ver análisis detallado <ArrowRight size={16} />
      </Link>
    </div>
  );
}
