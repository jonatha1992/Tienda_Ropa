// Verificar configuración de Firebase
import { auth } from './src/firebase.js'

console.log('🔍 Verificando configuración de Firebase...')
console.log('✅ Auth object:', auth)
console.log('✅ Auth config:', auth.config)
console.log('✅ Project ID:', auth.app.options.projectId)

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('✅ Usuario autenticado:', user.email)
    } else {
        console.log('ℹ️ No hay usuario autenticado')
    }
})
