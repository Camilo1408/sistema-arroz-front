// src/components/layout/Layout.jsx
// Contenedor principal que une Sidebar + Header + contenido de la página.
// Outlet es el componente de React Router que renderiza la ruta activa.

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header fijo en la parte superior */}
        <Header />

        {/* Área scrollable con el contenido de la página activa */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet renderiza: Dashboard, SubsistemaCorte, etc. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
