import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";
import { useBackendHealth } from "@/lab/services/useBackendHealth.js";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const health = useBackendHealth();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-app, #f3f7f3)" }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile/tablet, inline on desktop */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-30",
          "lg:relative lg:inset-y-auto lg:z-auto",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} health={health} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        {health !== "ok" && (
          <div
            role="status"
            className={`px-4 py-2 text-xs sm:text-sm border-b ${
              health === "connecting"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {health === "connecting"
              ? "Conectando con el servidor de inferencia. Si estaba dormido puede tardar cerca de un minuto en responder."
              : "El servidor de inferencia no responde. Se reintenta cada 30 segundos."}
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
