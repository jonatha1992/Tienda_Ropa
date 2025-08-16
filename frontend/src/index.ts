/**
 * CONTEXTO GENERAL DEL PROYECTO FRONTEND
 * 
 * Este archivo actúa como un "mapa" central del proyecto.
 * Proporciona re-exports organizados de todos los módulos principales.
 * 
 * ESTRUCTURA DEL PROYECTO:
 * ========================
 * 
 * /src
 * ├── config/          # Configuración (API, Firebase, App settings)
 * ├── types.ts         # Tipos e interfaces centralizados
 * ├── store/           # Stores de Pinia (auth, cart)
 * ├── composables/     # Composables Vue reutilizables
 * ├── components/      # Componentes Vue reutilizables
 * ├── views/           # Páginas/vistas de la aplicación
 * └── router.ts        # Configuración de rutas
 */

// ===== CONFIGURACIÓN =====
// Configuración de la aplicación, Firebase y APIs
export * from './config'

// ===== TIPOS =====
// Todos los tipos e interfaces del proyecto
export * from './types'

// ===== STORES (PINIA) =====
// Estado global de la aplicación
export { useAuthStore } from './store/auth'
export { useCartStore } from './store/cart'

// ===== COMPOSABLES =====
// Lógica reutilizable de Vue
export * from './composables/useLoading'

// ===== ROUTER =====
// Configuración de rutas
export { default as router } from './router'

/**
 * GUÍA DE IMPORTS RECOMENDADOS:
 * =============================
 * 
 * // Para APIs:
 * import { rolesApi, usersApi, masterDataApi, productsApi } from '@/config'
 * 
 * // Para tipos:
 * import type { Product, User, Role } from '@/types'
 * 
 * // Para stores:
 * import { useAuthStore, useCartStore } from '@/store/auth'
 * 
 * // Para configuración:
 * import { config, auth, storage } from '@/config'
 * 
 * // Para composables:
 * import { useLoading } from '@/composables/useLoading'
 */

export default {
  // Metadatos del proyecto
  name: 'Tienda Ropa Frontend',
  version: '1.0.0',
  description: 'E-commerce frontend con Vue 3, TypeScript, Pinia y Tailwind CSS'
}