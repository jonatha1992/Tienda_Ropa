import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth'
import apiClient from '../api'
import type { User } from '../types' // Asegúrate de que este tipo coincida con el modelo UserRead del backend

export const useAuthStore = defineStore('auth', () => {
    const firebaseUser = ref<FirebaseUser | null>(null)
    const backendUser = ref<User | null>(null)
    const token = ref<string | null>(null)
    const loading = ref(true)

    const isAuthenticated = computed(() => !!backendUser.value)

    const fetchBackendUser = async () => {
        try {
            const response = await apiClient.get('/users/me')
            backendUser.value = response.data
            console.log('✅ Usuario del backend obtenido:', backendUser.value)
        } catch (error) {
            console.error('❌ Error fetching backend user:', error)
            // Si falla, probablemente el token no es válido, desloguear
            await logout()
        }
    }

    const initAuth = () => {
        return new Promise<void>((resolve) => {
            onAuthStateChanged(auth, async (fbUser) => {
                console.log('🔐 Auth state changed:', fbUser?.email)

                if (fbUser) {
                    firebaseUser.value = fbUser
                    token.value = await fbUser.getIdToken()
                    console.log('✅ Token de Firebase obtenido')
                    
                    // Sincronizar con el backend
                    await fetchBackendUser()

                } else {
                    firebaseUser.value = null
                    backendUser.value = null
                    token.value = null
                }

                loading.value = false
                resolve()
            })
        })
    }

    const logout = async () => {
        try {
            await signOut(auth)
            console.log('✅ Logout de Firebase exitoso')
        } catch (error) {
            console.error('❌ Error en logout de Firebase:', error)
        } finally {
            firebaseUser.value = null
            backendUser.value = null
            token.value = null
        }
    }

    return {
        firebaseUser,
        backendUser,
        token,
        loading,
        isAuthenticated,
        initAuth,
        logout,
        fetchBackendUser
    }
})