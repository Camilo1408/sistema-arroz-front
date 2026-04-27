// src/components/shared/DensityGrid.jsx
// Cuadrícula 4x4 que muestra la densidad de panículas por región.
// Específica del Subsistema 1 (Cabezal de Corte).

import clsx from "clsx";

/**
 * @param {object} props
 * @param {number[][]} props.grid - Matriz 4x4 con conteos por celda
 */
export function DensityGrid({ grid }) {
  if (!grid || grid.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        Sin datos de densidad
      </div>
    );
  }

  // Encontrar valor máximo para normalizar colores
  const maxVal = Math.max(...grid.flat());

  // Color de celda según densidad relativa
  const getCellColor = (value) => {
    const ratio = value / maxVal;
    if (ratio < 0.33) return "bg-green-100 text-green-800";
    if (ratio < 0.66) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800 font-bold";
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-1">
        {grid.map((row, rowIdx) =>
          row.map((count, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={clsx(
                "rounded p-2 text-center text-xs transition-colors",
                getCellColor(count),
              )}
              title={`Región (${rowIdx + 1}, ${colIdx + 1}): ${count} panículas`}
            >
              {count}
            </div>
          )),
        )}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-200 inline-block" /> Baja
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-200 inline-block" /> Media
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-200 inline-block" /> Alta
        </span>
      </div>
    </div>
  );
}
