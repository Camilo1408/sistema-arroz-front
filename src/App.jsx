import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout.jsx";
import LandingPage from "@/pages/LandingPage.jsx";
import { Dashboard } from "@/pages/Dashboard.jsx";
import { SubsistemaCorte } from "@/pages/SubsistemaCorte.jsx";
import { SubsistemaTrilla } from "@/pages/SubsistemaTrilla.jsx";
import { SubsistemaLimpieza } from "@/pages/SubsistemaLimpieza.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — no layout wrapper */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell — sidebar + header */}
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subsistema/corte" element={<SubsistemaCorte />} />
          <Route path="subsistema/trilla" element={<SubsistemaTrilla />} />
          <Route path="subsistema/limpieza" element={<SubsistemaLimpieza />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
