/// <reference types="vite/client" />

// Vue SFC modules
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global type augmentations
declare global {
  // Add global types here if needed
}

export {}
