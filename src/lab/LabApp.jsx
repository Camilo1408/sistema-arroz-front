import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "@/lab/lab.css";
import { BaseContext } from "@/lab/base.js";
import { Layout } from "@/lab/components/layout/Layout.jsx";
import { Dashboard } from "@/lab/pages/Dashboard.jsx";
import { SubsistemaCorte } from "@/lab/pages/SubsistemaCorte.jsx";
import { SubsistemaTrilla } from "@/lab/pages/SubsistemaTrilla.jsx";
import { SubsistemaLimpieza } from "@/lab/pages/SubsistemaLimpieza.jsx";

export default function LabApp({ base }) {
  // Que ningún buscador indexe la ruta privada
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "RiceVi · Inferencia";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  return (
    <BaseContext.Provider value={base}>
      <div className="lab-root">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subsistema/corte" element={<SubsistemaCorte />} />
            <Route path="subsistema/trilla" element={<SubsistemaTrilla />} />
            <Route path="subsistema/limpieza" element={<SubsistemaLimpieza />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    </BaseContext.Provider>
  );
}
