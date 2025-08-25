// Type definitions for Vue components

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
  }
}

// Extend the Window interface to include any global variables
declare interface Window {
  // Add any global window properties here
  ethereum?: any
}

// Global type for $toast
import { Plugin } from 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: any // You might want to import and use the correct type from your toast library
  }
}
