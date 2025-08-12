import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// Configuración base Vite; las variables que empiecen por VITE_ se exponen automáticamente
export default defineConfig({
  plugins: [vue()]
})
