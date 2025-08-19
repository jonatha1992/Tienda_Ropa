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
    <!-- Cart Modal Component -->
    <CartModal />
    <!-- Cart Added Notification -->
    <CartAddedNotification />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { useLoading } from './composables/useLoading'
import Navbar from './components/Navbar.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import Chatbot from './components/Chatbot.vue'
import CartModal from './components/CartModal.vue'
import CartAddedNotification from './components/CartAddedNotification.vue'

const authStore = useAuthStore()
const { isLoading, loadingMessage, loadingSubmessage } = useLoading()

onMounted(async () => {
  await authStore.initAuth()
})
</script>