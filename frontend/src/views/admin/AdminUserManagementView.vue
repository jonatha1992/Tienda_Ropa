<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
             <div class="flex items-center justify-between py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 font-heading">GestiÃ³n de Usuarios</h1>
            <p class="mt-1 text-sm font-body text-body-text">Administra usuarios, roles y permisos del sistema</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm font-body text-body-text">Bienvenido,</span>
            <span class="text-sm font-medium font-body text-body-text">{{ userEmail }}</span>
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
            class="px-1 py-4 text-sm font-medium border-b-2 font-body"
            active-class="text-blue-600 border-blue-500"
            inactive-class="text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          >
            <span class="font-body">Productos</span>
          </router-link>
          <router-link
            to="/admin/users"
            class="px-1 py-4 text-sm font-medium border-b-2 font-body"
            active-class="text-blue-600 border-blue-500"
            inactive-class="text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          >
            <span class="font-body">Usuarios</span>
          </router-link>
          <router-link
            to="/admin/orders"
            class="px-1 py-4 text-sm font-medium border-b-2 font-body"
            active-class="text-blue-600 border-blue-500"
            inactive-class="text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          >
            <span class="font-body"> Pedidos</span>
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
            <h2 class="text-xl font-semibold text-gray-900 font-heading">GestiÃ³n de Usuarios</h2>
          </div>
          <div class="p-6">
            <RoleManagement />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../store/auth'
import RoleManagement from '../../components/admin/RoleManagement.vue'

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

