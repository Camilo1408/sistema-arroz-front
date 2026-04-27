// src/components/shared/StatusBadge.jsx
// Badge compacto que muestra NORMAL / ATENCIÓN / CRÍTICO.
// Se usa en las tarjetas resumen del Dashboard General.

import clsx from "clsx";

/**
 * @param {object} props
 * @param {'NORMAL'|'ATENCION'|'CRITICO'} props.level
 * @param {'sm'|'md'} [props.size]
 */
export function StatusBadge({ level, size = "md" }) {
  const styles = {
    NORMAL: "bg-green-100 text-green-800 ring-1 ring-green-300",
    ATENCION: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300",
    CRITICO: "bg-red-100 text-red-800 ring-1 ring-red-300 animate-pulse",
  };

  const labels = {
    NORMAL: "✓ Normal",
    ATENCION: "⚠ Atención",
    CRITICO: "● Crítico",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={clsx(
        "rounded-full font-semibold inline-flex items-center",
        styles[level],
        sizeStyles[size],
      )}
    >
      {labels[level]}
    </span>
  );
}
