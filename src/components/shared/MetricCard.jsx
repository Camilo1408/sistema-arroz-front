// src/components/shared/MetricCard.jsx
// ============================================================
// Muestra una métrica individual con título, valor e ícono.
// Se usa en todos los dashboards para mostrar KPIs.
// ============================================================

import clsx from "clsx";

/**
 * @param {object} props
 * @param {string} props.title - Nombre de la métrica
 * @param {string|number} props.value - Valor a mostrar
 * @param {string} [props.unit] - Unidad (%, ms, etc.)
 * @param {React.ReactNode} [props.icon] - Ícono de Lucide React
 * @param {'green'|'yellow'|'red'|'blue'|'gray'} [props.color] - Color del card
 * @param {string} [props.subtitle] - Texto secundario opcional
 */
export function MetricCard({
  title,
  value,
  unit = "",
  icon,
  color = "blue",
  subtitle,
}) {
  const colorStyles = {
    green: {
      card: "bg-green-50 border-green-200",
      icon: "bg-green-100 text-green-700",
      value: "text-green-700",
    },
    yellow: {
      card: "bg-yellow-50 border-yellow-200",
      icon: "bg-yellow-100 text-yellow-700",
      value: "text-yellow-700",
    },
    red: {
      card: "bg-red-50 border-red-200",
      icon: "bg-red-100 text-red-700",
      value: "text-red-700",
    },
    blue: {
      card: "bg-blue-50 border-blue-200",
      icon: "bg-blue-100 text-blue-700",
      value: "text-blue-700",
    },
    gray: {
      card: "bg-gray-50 border-gray-200",
      icon: "bg-gray-100 text-gray-600",
      value: "text-gray-700",
    },
  };

  const styles = colorStyles[color];

  return (
    <div
      className={clsx(
        "rounded-xl border p-4 flex items-start gap-4",
        styles.card,
      )}
    >
      {/* Ícono en círculo de color */}
      {icon && (
        <div className={clsx("rounded-lg p-2.5 flex-shrink-0", styles.icon)}>
          {icon}
        </div>
      )}
      {/* Contenido */}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
          {title}
        </p>
        <p
          className={clsx(
            "text-2xl font-bold mt-0.5 metric-value",
            styles.value,
          )}
        >
          {value}
          {unit && (
            <span className="text-sm font-normal ml-1 text-gray-500">
              {unit}
            </span>
          )}
        </p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
