import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

console.log('🔧 Inicializando Firebase...')
console.log('🔍 Variables de entorno:', {
  VITE_API_KEY: import.meta.env.VITE_API_KEY ? '✅ Definida' : '❌ No definida',
  VITE_AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN ? '✅ Definida' : '❌ No definida',
  VITE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID ? '✅ Definida' : '❌ No definida',
  VITE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET ? '✅ Definida' : '❌ No definida',
  VITE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID ? '✅ Definida' : '❌ No definida',
  VITE_APP_ID: import.meta.env.VITE_APP_ID ? '✅ Definida' : '❌ No definida'
})

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

console.log('🔧 Firebase config:', firebaseConfig)

let auth: any;
let storage: any;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);

  console.log('✅ Firebase inicializado correctamente')
  console.log('✅ Auth:', auth)
  console.log('✅ Project ID:', app.options.projectId)
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error)
  throw error;
}

export { auth, storage };
