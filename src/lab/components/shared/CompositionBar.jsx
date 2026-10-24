export function CompositionBar({ segments, title }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  return (
    <div className="space-y-3">
      {title && (
        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">{title}</p>
      )}

      {/* Proportional bar */}
      <div className="flex h-5 rounded-full overflow-hidden gap-px bg-stone-100">
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{ width: `${(seg.value / total) * 100}%`, backgroundColor: seg.color }}
            className="transition-all duration-700 first:rounded-l-full last:rounded-r-full"
            title={`${seg.label}: ${seg.value.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend with values */}
      <div className="grid grid-cols-1 gap-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-xs text-stone-600">{seg.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(seg.value / total) * 100}%`, backgroundColor: seg.color }}
                />
              </div>
              <span className="text-xs font-bold font-mono text-stone-700 w-12 text-right">
                {seg.value.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
