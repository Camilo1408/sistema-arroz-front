// src/components/shared/CompositionBar.jsx
// Muestra una barra horizontal dividida por proporciones de clases.
// Usada en S2 y S3 para visualizar la composición del flujo.

/**
 * @param {object} props
 * @param {Array<{label: string, value: number, color: string}>} props.segments
 * @param {string} [props.title]
 */
export function CompositionBar({ segments, title }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
      )}

      {/* Barra proporcional */}
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: seg.color,
            }}
            className="transition-all duration-500"
            title={`${seg.label}: ${seg.value.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs text-gray-600">
              {seg.label}:{" "}
              <span className="font-semibold">{seg.value.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
