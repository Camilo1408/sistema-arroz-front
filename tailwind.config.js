// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tailwind escanea TODOS los archivos en src/
  ],
  theme: {
    extend: {
      // Colores personalizados para el sistema
      colors: {
        // Verde: estado normal, grano íntegro
        "arroz-green": {
          100: "#dcfce7",
          500: "#22c55e",
          700: "#15803d",
        },
        // Amarillo: estado de atención
        "arroz-yellow": {
          100: "#fef9c3",
          500: "#eab308",
          700: "#a16207",
        },
        // Rojo: estado crítico, alertas
        "arroz-red": {
          100: "#fee2e2",
          500: "#ef4444",
          700: "#b91c1c",
        },
        // Azul: color principal de la app, navegación
        "arroz-blue": {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        // Gris oscuro: fondo de la aplicación
        "arroz-dark": {
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      // Animación para el indicador de "activo"
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
