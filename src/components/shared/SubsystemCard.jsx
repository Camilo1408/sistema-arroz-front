import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge.jsx";
import clsx from "clsx";

const STATUS_STYLES = {
  NORMAL:   { border: "border-green-200",  topBar: "bg-green-500",  metricBg: "bg-green-50/60"  },
  ATENCION: { border: "border-amber-300",  topBar: "bg-amber-500",  metricBg: "bg-amber-50/60"  },
  CRITICO:  { border: "border-red-300",    topBar: "bg-red-500",    metricBg: "bg-red-50/60"    },
};

export function SubsystemCard({ name, description, status, metrics, linkTo, icon, badge, badgeColor }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.NORMAL;

  return (
    <div className={clsx(
      "bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col",
      s.border
    )}>
      {/* Top accent bar */}
      <div className={clsx("h-1", s.topBar)} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-2xl leading-none flex-shrink-0">{icon}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {badge && (
                  <span className={clsx("text-[10px] font-bold font-mono text-white px-1.5 py-0.5 rounded-md flex-shrink-0", badgeColor)}>
                    {badge}
                  </span>
                )}
                <h3 className="font-display font-bold text-stone-800 leading-tight truncate">{name}</h3>
              </div>
              <p className="text-xs text-stone-400 leading-tight">{description}</p>
            </div>
          </div>
          <StatusBadge level={status} size="sm" />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {metrics.slice(0, 4).map((m) => (
            <div key={m.label} className={clsx("rounded-xl p-2.5 border border-transparent", s.metricBg)}>
              <p className="text-[10px] text-stone-400 font-medium truncate">{m.label}</p>
              <p className="text-sm font-bold text-stone-700 mt-0.5 font-mono">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Link */}
        <Link
          to={linkTo}
          className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors border border-green-200 hover:border-green-400 bg-green-50/50 hover:bg-green-50 rounded-xl py-2.5 group"
        >
          <TrendingUp className="w-4 h-4" />
          Ver análisis detallado
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
