import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Activity, Home, ChevronRight } from "lucide-react";

const ROUTE_META = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Estado general de todos los subsistemas",
    crumb: "Dashboard",
    accent: "green",
  },
  "/subsistema/corte": {
    title: "Subsistema S1 — Corte",
    subtitle: "Detección de panículas y acame en cabezal",
    crumb: "S1 · Corte",
    accent: "green",
    badge: "S1",
    badgeColor: "bg-green-500",
  },
  "/subsistema/trilla": {
    title: "Subsistema S2 — Trilla",
    subtitle: "Segmentación semántica del flujo trillador",
    crumb: "S2 · Trilla",
    accent: "amber",
    badge: "S2",
    badgeColor: "bg-amber-500",
  },
  "/subsistema/limpieza": {
    title: "Subsistema S3 — Limpieza",
    subtitle: "Detección de pérdida en zarandas de salida",
    crumb: "S3 · Limpieza",
    accent: "blue",
    badge: "S3",
    badgeColor: "bg-blue-500",
  },
};

export function Header() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] || ROUTE_META["/dashboard"];
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const dateStr = time.toLocaleDateString("es-CO", {
    weekday: "short", day: "numeric", month: "short",
  });

  return (
    <header
      className="flex items-center justify-between px-6 border-b border-stone-200 bg-white/90 backdrop-blur-sm"
      style={{ height: "var(--header-height)", minHeight: "var(--header-height)" }}
    >
      {/* Left: breadcrumb + title */}
      <div className="min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <Link to="/dashboard" className="text-stone-400 hover:text-green-600 transition-colors">
            <Home className="w-3 h-3" />
          </Link>
          {pathname !== "/dashboard" && (
            <>
              <ChevronRight className="w-3 h-3 text-stone-300" />
              <span className="text-stone-400 text-xs">Dashboard</span>
              <ChevronRight className="w-3 h-3 text-stone-300" />
              <span className="text-xs text-green-600 font-medium">{meta.crumb}</span>
            </>
          )}
        </div>

        {/* Title row */}
        <div className="flex items-center gap-2.5">
          {meta.badge && (
            <span className={`text-[11px] font-bold text-white px-2 py-0.5 rounded-md font-mono ${meta.badgeColor}`}>
              {meta.badge}
            </span>
          )}
          <h1 className="font-display font-bold text-stone-800 text-base leading-tight truncate">
            {meta.title}
          </h1>
        </div>

        <p className="text-stone-400 text-xs leading-tight hidden sm:block">{meta.subtitle}</p>
      </div>

      {/* Right: status + time + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Date/time */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-stone-800 text-sm font-mono font-semibold tabular-nums">{timeStr}</span>
          <span className="text-stone-400 text-[11px] capitalize">{dateStr}</span>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-stone-200" />

        {/* Live badge */}
        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-1.5 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">En Vivo</span>
        </div>
      </div>
    </header>
  );
}
