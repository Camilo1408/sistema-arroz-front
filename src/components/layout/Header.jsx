// src/components/layout/Header.jsx
// Cabecera superior. Muestra el título de la vista actual y el estado del sistema.

import { useLocation } from "react-router-dom";
import { Activity } from "lucide-react";

const routeTitles = {
  "/dashboard": {
    title: "Dashboard General",
    subtitle: "Estado de todos los subsistemas",
  },
  "/subsistema/corte": {
    title: "Subsistema S1 — Corte",
    subtitle: "Análisis del cabezal de corte",
  },
  "/subsistema/trilla": {
    title: "Subsistema S2 — Trilla",
    subtitle: "Análisis de la zona de trilla",
  },
  "/subsistema/limpieza": {
    title: "Subsistema S3 — Limpieza",
    subtitle: "Análisis del sistema de limpieza",
  },
};

export function Header() {
  const { pathname } = useLocation();
  const { title, subtitle } =
    routeTitles[pathname] || routeTitles["/dashboard"];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Título de la página actual */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Indicador de sistema activo */}
      <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1.5 text-sm font-medium">
        <Activity size={16} className="animate-pulse" />
        <span>Sistema Activo</span>
      </div>
    </header>
  );
}
