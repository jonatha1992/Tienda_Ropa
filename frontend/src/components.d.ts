/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

// Vue 3 components type declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Image modules
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Style modules
declare module '*.css'
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VITE_API_BASE_URL: string
    VITE_FIREBASE_API_KEY: string
    VITE_FIREBASE_AUTH_DOMAIN: string
    VITE_FIREBASE_PROJECT_ID: string
    VITE_FIREBASE_STORAGE_BUCKET: string
    VITE_FIREBASE_MESSAGING_SENDER_ID: string
    VITE_FIREBASE_APP_ID: string
    VITE_FIREBASE_MEASUREMENT_ID: string
  }
}

// Global type augmentations
declare global {
  interface Window {
    // Add any global window properties here
    ethereum?: any
  }
}

export {}
