import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.jsx";
import Gate from "@/pages/Gate.jsx";

// Landing pública en "/". Cualquier otra ruta pasa por Gate: solo la
// ruta privada abre la interfaz de inferencia; el resto ve el 404.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:gate/*" element={<Gate />} />
      </Routes>
    </BrowserRouter>
  );
}
