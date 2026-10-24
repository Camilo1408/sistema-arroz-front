// Maps a ratio [0,1] to a green→amber→red RGBA color with increasing opacity
function heatColor(ratio) {
  const r = Math.round(
    ratio < 0.5
      ? 34 + ratio * 2 * (251 - 34)
      : 251 + (ratio - 0.5) * 2 * (239 - 251)
  );
  const g = Math.round(
    ratio < 0.5
      ? 197 - ratio * 2 * (197 - 146)
      : 146 - (ratio - 0.5) * 2 * (146 - 68)
  );
  const b = Math.round(ratio < 0.5 ? 94 - ratio * 2 * 94 : 0);
  const a = 0.12 + ratio * 0.68;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function heatTextClass(ratio) {
  if (ratio < 0.25) return "text-green-800";
  if (ratio < 0.5)  return "text-amber-800";
  if (ratio < 0.75) return "text-orange-900";
  return "text-red-900 font-bold";
}

const LEGEND = [
  { label: "Sin det.", ratio: 0 },
  { label: "Baja",     ratio: 0.2 },
  { label: "Media",    ratio: 0.5 },
  { label: "Alta",     ratio: 0.8 },
  { label: "Máxima",   ratio: 1.0 },
];

export function DensityGrid({ grid, totalDetections }) {
  if (!grid || grid.length === 0) {
    return (
      <div className="text-stone-400 text-sm text-center py-6 bg-stone-50 rounded-xl border border-dashed border-stone-200">
        Sin datos de densidad espacial
      </div>
    );
  }

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const flat = grid.flat();
  const maxVal = Math.max(...flat, 1);
  const colLabels = Array.from({ length: cols }, (_, i) => `C${i + 1}`);
  const rowLabels = Array.from({ length: rows }, (_, i) => `F${i + 1}`);
  const colSums   = Array.from({ length: cols }, (_, ci) =>
    grid.reduce((s, row) => s + (row[ci] ?? 0), 0)
  );

  const gridCols = `1.5rem repeat(${cols}, 1fr)`;

  return (
    <div className="space-y-2">
      {/* Column header labels */}
      <div className="grid gap-1" style={{ gridTemplateColumns: gridCols }}>
        <div />
        {colLabels.map(c => (
          <div key={c} className="text-[10px] font-mono text-stone-400 text-center">{c}</div>
        ))}
      </div>

      {/* Heatmap rows */}
      {grid.map((row, ri) => (
        <div key={ri} className="grid gap-1 items-stretch" style={{ gridTemplateColumns: gridCols }}>
          <div className="text-[10px] font-mono text-stone-400 flex items-center justify-center">
            {rowLabels[ri]}
          </div>
          {row.map((count, ci) => {
            const ratio = count / maxVal;
            return (
              <div
                key={ci}
                className={`h-10 rounded-lg flex items-center justify-center text-xs font-mono border border-black/[0.06] transition-transform hover:scale-105 cursor-default select-none ${heatTextClass(ratio)}`}
                style={{ backgroundColor: heatColor(ratio) }}
                title={`Región (${rowLabels[ri]}, ${colLabels[ci]}): ${count} detección${count !== 1 ? "es" : ""}`}
              >
                {count}
              </div>
            );
          })}
        </div>
      ))}

      {/* Column totals */}
      <div className="grid gap-1" style={{ gridTemplateColumns: gridCols }}>
        <div className="text-[9px] font-mono text-stone-300 flex items-end justify-center pb-0.5">Σ</div>
        {colSums.map((s, i) => (
          <div
            key={i}
            className="text-[10px] font-mono text-stone-500 text-center font-semibold border-t border-stone-100 pt-1"
          >
            {s}
          </div>
        ))}
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-between pt-0.5 text-[11px] text-stone-500 border-t border-stone-100">
        <span>
          {totalDetections !== undefined
            ? <><span className="font-bold text-stone-700">{totalDetections}</span> detecciones en {rows}×{cols} zonas</>
            : <>{rows}×{cols} zonas</>
          }
        </span>
        <span className="font-mono text-[10px] text-stone-400">pico: {maxVal}/zona</span>
      </div>

      {/* Continuous color scale legend */}
      <div className="flex items-center gap-0.5 h-3 rounded-full overflow-hidden border border-stone-100">
        {Array.from({ length: 40 }, (_, i) => {
          const r = i / 39;
          return (
            <div
              key={i}
              className="flex-1 h-full"
              style={{ backgroundColor: heatColor(r) }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] font-mono text-stone-400 -mt-0.5">
        <span>0</span>
        {LEGEND.slice(1, -1).map(l => (
          <span key={l.label}>{l.label}</span>
        ))}
        <span>{maxVal}</span>
      </div>
    </div>
  );
}
