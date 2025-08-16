// Configuración centralizada - Re-exports
// Este archivo actúa como punto de entrada único para toda la configuración

// Configuración de la aplicación
export { config, type AppConfig } from './app'

// Firebase configuration y servicios
export { auth, storage } from './firebase'

// API client y funciones
export { default as apiClient } from './api'
export { rolesApi, usersApi, masterDataApi, productsApi } from './api'