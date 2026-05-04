import clsx from "clsx";

const COLOR_MAP = {
  green: {
    border:   "border-green-200",
    iconBg:   "bg-green-100",
    iconText: "text-green-700",
    value:    "text-green-700",
    dot:      "bg-green-500",
    pulse:    "bg-green-500/20",
  },
  yellow: {
    border:   "border-amber-200",
    iconBg:   "bg-amber-100",
    iconText: "text-amber-700",
    value:    "text-amber-700",
    dot:      "bg-amber-500",
    pulse:    "bg-amber-500/20",
  },
  red: {
    border:   "border-red-200",
    iconBg:   "bg-red-100",
    iconText: "text-red-700",
    value:    "text-red-700",
    dot:      "bg-red-500",
    pulse:    "bg-red-500/20",
  },
  blue: {
    border:   "border-blue-200",
    iconBg:   "bg-blue-100",
    iconText: "text-blue-700",
    value:    "text-blue-700",
    dot:      "bg-blue-500",
    pulse:    "bg-blue-500/20",
  },
  gray: {
    border:   "border-stone-200",
    iconBg:   "bg-stone-100",
    iconText: "text-stone-600",
    value:    "text-stone-700",
    dot:      "bg-stone-400",
    pulse:    "bg-stone-400/20",
  },
};

export function MetricCard({ title, value, unit = "", icon, color = "blue", subtitle, trend }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className={clsx(
      "bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3",
      c.border
    )}>
      {/* Top row */}
      <div className="flex items-center justify-between">
        {icon && (
          <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm", c.iconBg, c.iconText)}>
            {icon}
          </div>
        )}
        <div className={clsx("relative flex items-center justify-center w-5 h-5 ml-auto")}>
          <div className={clsx("w-2 h-2 rounded-full", c.dot)} />
          <div className={clsx("absolute w-4 h-4 rounded-full animate-ping opacity-60", c.pulse)} />
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">{title}</p>
        <p className={clsx("text-3xl font-bold font-mono metric-value leading-none", c.value)}>
          {value}
          {unit && <span className="text-base font-normal text-stone-400 ml-1">{unit}</span>}
        </p>
        {subtitle && <p className="text-xs text-stone-400 mt-1.5">{subtitle}</p>}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="pt-2 border-t border-stone-100">
          <span className={clsx(
            "text-xs font-medium",
            trend > 0 ? "text-red-500" : trend < 0 ? "text-green-600" : "text-stone-400"
          )}>
            {trend > 0 ? `↑ +${trend}` : trend < 0 ? `↓ ${trend}` : "→ Sin cambio"} vs. sesión anterior
          </span>
        </div>
      )}
    </div>
  );
}
