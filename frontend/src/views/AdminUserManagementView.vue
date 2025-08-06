<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
             <div class="flex items-center justify-between py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p class="mt-1 text-sm text-gray-500">Gestiona usuarios, roles y permisos del sistema</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Bienvenido,</span>
            <span class="text-sm font-medium text-gray-900">{{ userEmail }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav class="flex -mb-px space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
          </div>
          <div class="p-6">
            <UserManagement />
          </div>
        </div>
      </div>

      <!-- Roles Tab -->
      <div v-if="activeTab === 'roles'" class="space-y-6">
        <RoleManagement />
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Inicializar Roles por Defecto</h3>
                  <p class="text-sm text-gray-500">Crea los roles básicos del sistema si no existen</p>
                </div>
                <button
                  @click="initializeRoles"
                  :disabled="loading"
                  class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {{ loading ? 'Cargando...' : 'Inicializar' }}
                </button>
              </div>
              
              <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Estado del Sistema</h3>
                  <p class="text-sm text-gray-500">Verificar conexión con el backend</p>
                </div>
                <button
                  @click="checkSystemHealth"
                  class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Verificar Estado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../store/auth'
import { rolesApi, usersApi } from '../api'
import apiClient from '../api'
import RoleManagement from '../components/RoleManagement.vue'
import UserManagement from '../components/UserManagement.vue'

const toast = useToast()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('users')
const loading = ref(false)
const userEmail = ref('')

const tabs = [
  { id: 'users', name: 'Usuarios' },
  { id: 'roles', name: 'Roles' },
  { id: 'settings', name: 'Configuración' }
]

// Methods
const initializeRoles = async () => {
  try {
    loading.value = true
    await rolesApi.initializeRoles()
    toast.success('✅ Roles inicializados correctamente')
  } catch (error) {
    console.error('Error initializing roles:', error)
    toast.error('❌ Error al inicializar los roles')
  } finally {
    loading.value = false
  }
}

const checkSystemHealth = async () => {
  try {
    loading.value = true
    const response = await apiClient.get('/health')
    
    if (response.status === 200) {
      toast.success('✅ Sistema funcionando correctamente')
    } else {
      toast.warning('⚠️ Problema con la conexión al backend')
    }
  } catch (error: any) {
    console.error('Error checking system health:', error)
    const errorMessage = error.response?.data?.detail || 'Error de conexión con el backend'
    toast.error(`❌ ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

const loadUserInfo = async () => {
  try {
    if (authStore.isAuthenticated) {
      // Obtener información del usuario actual
      const currentUser = await usersApi.getCurrentUser()
      userEmail.value = currentUser.email
      toast.success(`👋 Bienvenido, ${currentUser.email}`)
    }
  } catch (error: any) {
    console.error('Error loading user info:', error)
    const fallbackEmail = authStore.firebaseUser?.email || 'Usuario'
    userEmail.value = fallbackEmail
    toast.warning('⚠️ No se pudo cargar la información completa del usuario')
  }
}

// Lifecycle
onMounted(() => {
  loadUserInfo()
})
</script>
