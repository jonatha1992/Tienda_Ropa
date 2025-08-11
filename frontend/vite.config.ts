import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
<<<<<<< HEAD
export default defineConfig({
  plugins: [vue()],
  // No necesitas define aquí, las variables VITE_ se leen automáticamente
=======
// Configuración base Vite; las variables que empiecen por VITE_ se exponen automáticamente
export default defineConfig({
  plugins: [vue()]
>>>>>>> dev
})
