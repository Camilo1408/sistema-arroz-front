// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ apunta a la carpeta src/
      // Permite escribir: import { MetricCard } from '@/components/shared/MetricCard'
      // En lugar de: import { MetricCard } from '../../components/shared/MetricCard'
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,  // Puerto por defecto de Vite
    open: true,  // Abre el navegador automáticamente al correr npm run dev
  },
})