<template>
  <div>
    <Navbar />
    <router-view />
    <!-- Loading Spinner Global -->
    <LoadingSpinner 
      :show="isLoading" 
      :message="loadingMessage || 'Cargando...'" 
      :submessage="loadingSubmessage"
    />
    <!-- Chatbot Component -->
    <Chatbot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { useLoading } from './composables/useLoading'
import Navbar from './components/Navbar.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import Chatbot from './components/Chatbot.vue'

const authStore = useAuthStore()
const { isLoading, loadingMessage, loadingSubmessage } = useLoading()

onMounted(async () => {
  await authStore.initAuth()
})
</script>