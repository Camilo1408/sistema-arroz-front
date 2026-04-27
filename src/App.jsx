// src/App.jsx
// ============================================================
// COMPONENTE RAÍZ — ENRUTAMIENTO PRINCIPAL
// ============================================================
// Define las 4 rutas de la aplicación y las envuelve en el
// Layout compartido (Sidebar + Header).

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout.jsx";
import { Dashboard } from "@/pages/Dashboard.jsx";
import { SubsistemaCorte } from "@/pages/SubsistemaCorte.jsx";
import { SubsistemaTrilla } from "@/pages/SubsistemaTrilla.jsx";
import { SubsistemaLimpieza } from "@/pages/SubsistemaLimpieza.jsx";

/**
 * BrowserRouter: Habilita el enrutamiento basado en la URL del navegador.
 * Routes: Contenedor de todas las rutas.
 * Route: Define qué componente renderizar para cada URL.
 * Navigate: Redirige automáticamente de / a /dashboard.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout envuelve todas las rutas — siempre visible */}
        <Route path="/" element={<Layout />}>
          {/* Redirige / → /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Vista 0: Dashboard General */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Vista 1: Subsistema S1 - Corte */}
          <Route path="subsistema/corte" element={<SubsistemaCorte />} />

          {/* Vista 2: Subsistema S2 - Trilla */}
          <Route path="subsistema/trilla" element={<SubsistemaTrilla />} />

          {/* Vista 3: Subsistema S3 - Limpieza */}
          <Route path="subsistema/limpieza" element={<SubsistemaLimpieza />} />

          {/* Ruta 404: Cualquier URL no reconocida va al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
