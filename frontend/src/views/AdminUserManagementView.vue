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
          <router-link
            to="/admin/products"
            class="py-4 px-1 border-b-2 font-medium text-sm"
            active-class="border-blue-500 text-blue-600"
            inactive-class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Gestión de Productos
          </router-link>
          <router-link
            to="/admin/users"
            class="py-4 px-1 border-b-2 font-medium text-sm"
            active-class="border-blue-500 text-blue-600"
            inactive-class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Gestión de Usuarios
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Users Management -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
          </div>
          <div class="p-6">
            <UserManagement />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import UserManagement from '../components/UserManagement.vue'

const authStore = useAuthStore()
const userEmail = ref('')

const loadUserInfo = () => {
  if (authStore.isAuthenticated && authStore.firebaseUser?.email) {
    userEmail.value = authStore.firebaseUser.email
  } else {
    userEmail.value = 'Usuario'
  }
}

// Lifecycle
onMounted(() => {
  loadUserInfo()
})
</script>
