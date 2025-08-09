// src/config.ts
export const config = {
    // URL del backend según el entorno
    backendUrl: import.meta.env.VITE_BACKEND_URL ||
        (import.meta.env.DEV
            ? 'http://localhost:8000/api/v1'  // Desarrollo
            : 'https://backendtest-test.up.railway.app/api/v1'), // Producción

    // Firebase config
    firebase: {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
    }
}
