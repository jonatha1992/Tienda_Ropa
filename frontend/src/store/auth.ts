import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '../config/index'
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth'
import { apiClient, rolesApi } from '../config/index'
import type { User, Role } from '../types' // Asegúrate de que este tipo coincida con el modelo UserRead del backend

export const useAuthStore = defineStore('auth', () => {
    const firebaseUser = ref<FirebaseUser | null>(null)
    const backendUser = ref<User | null>(null)
    const userRoles = ref<Role[]>([])
    const token = ref<string | null>(null)
    const loading = ref(true)

    const isAuthenticated = computed(() => !!backendUser.value)

    const isAdmin = computed(() => {
        console.log('🔍 Checking admin access. User roles:', userRoles.value);
        return userRoles.value.some(role => ['admin', 'manager'].includes(role.name.toLowerCase()))
    })

    const hasAdminAccess = computed(() => isAdmin.value)

    const fetchBackendUser = async () => {
        try {
            const response = await apiClient.get('/users/me')
            backendUser.value = response.data
            // También obtener los roles del usuario
            await fetchUserRoles()
        } catch (error) {
            console.error('❌ Error fetching backend user:', error)
            // Si falla, probablemente el token no es válido, desloguear
            await logout()
        }
    }

    const fetchUserRoles = async () => {
        try {
            const roles = await rolesApi.getMyRoles()
            userRoles.value = roles
        } catch (error) {
            console.error('❌ Error fetching user roles:', error)
            userRoles.value = []
        }
    }

    const initAuth = () => {
        return new Promise<void>((resolve) => {
            let resolved = false

            // @ts-ignore - unsubscribe is intentionally not used in this context
            const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
                if (fbUser) {
                    firebaseUser.value = fbUser
                    try {
                        token.value = await fbUser.getIdToken()
                        // Sincronizar con el backend
                        await fetchBackendUser()
                    } catch (error) {
                        console.error('❌ Error obteniendo token de Firebase:', error)
                        await logout()
                    }

                } else {
                    firebaseUser.value = null
                    backendUser.value = null
                    token.value = null
                }

                loading.value = false

                // Solo resolvemos la primera vez
                if (!resolved) {
                    resolved = true
                    resolve()
                }
            })
        })
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error('❌ Error en logout de Firebase:', error)
        } finally {
            firebaseUser.value = null
            backendUser.value = null
            userRoles.value = []
            token.value = null
        }
    }

    return {
        firebaseUser,
        backendUser,
        userRoles,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        hasAdminAccess,
        initAuth,
        logout,
        fetchBackendUser,
        fetchUserRoles
    }
})