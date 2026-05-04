import { NavLink, Link } from "react-router-dom";
import {
  Wheat, LayoutDashboard, Scissors, Settings2, Wind, ChevronRight, CircleDot
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    sub: "Vista general",
    end: true,
  },
  {
    to: "/subsistema/corte",
    icon: Scissors,
    label: "S1 · Corte",
    sub: "Cabezal de corte",
    badge: "S1",
    badgeColor: "bg-green-500",
  },
  {
    to: "/subsistema/trilla",
    icon: Settings2,
    label: "S2 · Trilla",
    sub: "Cilindro trillador",
    badge: "S2",
    badgeColor: "bg-amber-500",
  },
  {
    to: "/subsistema/limpieza",
    icon: Wind,
    label: "S3 · Limpieza",
    sub: "Zarandas",
    badge: "S3",
    badgeColor: "bg-blue-500",
  },
];

export function Sidebar() {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        width: "var(--sidebar-width)",
        background: "linear-gradient(180deg, #0f2418 0%, #14532d 45%, #166534 100%)",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 px-5 py-4 border-b border-green-800/40 hover:bg-green-900/30 transition-colors"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-950/60 flex-shrink-0">
          <Wheat className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-white font-display font-bold text-sm leading-tight">RiceVision</div>
          <div className="text-green-400 text-[11px] leading-tight">Monitoreo de Cosecha</div>
        </div>
      </Link>

      {/* Live status */}
      <div className="mx-3 mt-3 flex items-center gap-2 bg-green-900/40 border border-green-700/40 rounded-xl px-3 py-2.5">
        <div className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <div className="absolute inset-0 w-4 h-4 bg-green-400/25 rounded-full animate-ping" />
        </div>
        <div className="min-w-0">
          <div className="text-green-200 text-[11px] font-semibold leading-tight">Sistema Activo</div>
          <div className="text-green-500 text-[10px] font-mono leading-tight">Sensor feed online</div>
        </div>
        <CircleDot className="w-3 h-3 text-green-600 ml-auto flex-shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-green-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2.5">
          Módulos
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-green-300/80 hover:bg-green-800/40 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-400 rounded-r-full" />
                )}
                <div className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                  isActive
                    ? "bg-green-500 shadow-md shadow-green-900/60"
                    : "bg-green-900/50 group-hover:bg-green-800/60"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm leading-tight">{item.label}</div>
                  <div className={clsx("text-[11px] leading-tight", isActive ? "text-green-300" : "text-green-600")}>
                    {item.sub}
                  </div>
                </div>
                {item.badge ? (
                  <span className={clsx("text-[10px] font-bold font-mono text-white px-1.5 py-0.5 rounded-md flex-shrink-0", item.badgeColor)}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={clsx(
                    "w-3.5 h-3.5 flex-shrink-0 transition-transform",
                    isActive ? "text-green-400" : "text-green-700 group-hover:translate-x-0.5"
                  )} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-green-800/40 space-y-2.5">
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: "S1", color: "bg-green-500" },
            { id: "S2", color: "bg-green-500" },
            { id: "S3", color: "bg-green-500" },
          ].map(s => (
            <div key={s.id} className="flex flex-col items-center bg-green-900/40 rounded-lg py-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${s.color} mb-1`} />
              <span className="text-[10px] font-mono text-green-400 font-bold">{s.id}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-green-700 font-mono">USCO · v2.0</p>
      </div>
    </aside>
  );
}
