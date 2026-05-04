import clsx from "clsx";

const CELL_LEVELS = [
  { label: "Baja",   bg: "bg-green-100",  text: "text-green-800",  border: "border-green-200" },
  { label: "Media",  bg: "bg-amber-100",  text: "text-amber-800",  border: "border-amber-200" },
  { label: "Alta",   bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  { label: "Máxima", bg: "bg-red-100",    text: "text-red-800",    border: "border-red-200", bold: true },
];

function getLevel(value, max) {
  const ratio = max > 0 ? value / max : 0;
  if (ratio < 0.25) return 0;
  if (ratio < 0.50) return 1;
  if (ratio < 0.75) return 2;
  return 3;
}

export function DensityGrid({ grid }) {
  if (!grid || grid.length === 0) {
    return (
      <div className="text-stone-400 text-sm text-center py-6 bg-stone-50 rounded-xl border border-dashed border-stone-200">
        Sin datos de densidad espacial
      </div>
    );
  }

  const maxVal = Math.max(...grid.flat(), 1);

  return (
    <div className="space-y-3">
      {/* Labels: columns */}
      <div className="grid grid-cols-4 gap-1 ml-6">
        {["C1", "C2", "C3", "C4"].map(c => (
          <div key={c} className="text-[10px] font-mono text-stone-400 text-center">{c}</div>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Row labels */}
        <div className="flex flex-col gap-1 justify-around">
          {["F1", "F2", "F3", "F4"].map(r => (
            <div key={r} className="text-[10px] font-mono text-stone-400 w-5 text-center leading-none" style={{ height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {r}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-1 flex-1">
          {grid.map((row, ri) =>
            row.map((count, ci) => {
              const lvl = CELL_LEVELS[getLevel(count, maxVal)];
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={clsx(
                    "h-10 rounded-lg flex items-center justify-center text-xs font-mono border transition-all hover:scale-105 cursor-default",
                    lvl.bg, lvl.text, lvl.border,
                    lvl.bold && "font-bold"
                  )}
                  title={`Región (F${ri+1}, C${ci+1}): ${count} panículas`}
                >
                  {count}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 pt-1">
        {CELL_LEVELS.map(l => (
          <div key={l.label} className={clsx("flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg border", l.bg, l.text, l.border)}>
            <span className={clsx("w-2 h-2 rounded-sm", l.bg.replace("100", "400") )} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
