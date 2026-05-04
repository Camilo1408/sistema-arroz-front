import clsx from "clsx";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const CONFIG = {
  NORMAL:   { bg: "bg-green-50",  border: "border-green-200", text: "text-green-700", Icon: CheckCircle2, label: "Normal"   },
  ATENCION: { bg: "bg-amber-50",  border: "border-amber-200", text: "text-amber-700", Icon: AlertTriangle, label: "Atención" },
  CRITICO:  { bg: "bg-red-50",    border: "border-red-200",   text: "text-red-700",   Icon: XCircle,      label: "Crítico"  },
};

const SIZES = {
  sm: { badge: "px-2 py-0.5 text-[11px] gap-1", icon: 11 },
  md: { badge: "px-2.5 py-1 text-xs gap-1.5",   icon: 13 },
};

export function StatusBadge({ level, size = "md" }) {
  const cfg = CONFIG[level] ?? CONFIG.NORMAL;
  const sz  = SIZES[size];

  return (
    <span className={clsx(
      "inline-flex items-center font-semibold rounded-full border",
      cfg.bg, cfg.border, cfg.text, sz.badge,
      level === "CRITICO" && "animate-pulse"
    )}>
      <cfg.Icon size={sz.icon} />
      {cfg.label}
    </span>
  );
}
