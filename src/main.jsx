// src/main.jsx
// Punto de entrada de la aplicación React.
// Este archivo es el primero en ejecutarse y monta toda la app en el DOM.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Importa los estilos globales (incluyendo Tailwind)

// ReactDOM.createRoot busca el elemento con id="root" en index.html
// y lo convierte en el contenedor de toda la aplicación React.
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode detecta problemas potenciales durante el desarrollo.
  // No afecta la versión de producción.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
