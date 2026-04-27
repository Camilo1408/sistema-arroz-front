// src/components/layout/Sidebar.jsx
// Barra lateral de navegación. Siempre visible en el lado izquierdo.

import { NavLink } from "react-router-dom";
import { LayoutDashboard, Scissors, Layers, Wind } from "lucide-react";
import clsx from "clsx";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard General",
    icon: <LayoutDashboard size={20} />,
    emoji: "📊",
  },
  {
    to: "/subsistema/corte",
    label: "S1 — Corte",
    sublabel: "Cabezal de corte",
    icon: <Scissors size={20} />,
    emoji: "✂️",
  },
  {
    to: "/subsistema/trilla",
    label: "S2 — Trilla",
    sublabel: "Zona de trilla",
    icon: <Layers size={20} />,
    emoji: "⚙️",
  },
  {
    to: "/subsistema/limpieza",
    label: "S3 — Limpieza",
    sublabel: "Sistema de limpieza",
    icon: <Wind size={20} />,
    emoji: "🌬️",
  },
];

export function Sidebar() {
  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <div>
            <h1 className="font-bold text-sm leading-tight">
              Sistema de Monitoreo
            </h1>
            <p className="text-xs text-slate-400">
              Cosecha Mecanizada de Arroz
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group",
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )
            }
          >
            {/* Ícono */}
            <span className="flex-shrink-0">{item.icon}</span>
            {/* Texto */}
            <div className="min-w-0">
              <p className="truncate">{item.label}</p>
              {item.sublabel && (
                <p className="text-xs opacity-60 truncate">{item.sublabel}</p>
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        <p>Universidad Surcolombiana</p>
        <p className="mt-0.5">Huila, Colombia · v1.0</p>
      </div>
    </aside>
  );
}
