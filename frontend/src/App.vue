<template>
  <div>
    <Navbar />
    <router-view />
    <Footer v-if="!$route.path.includes('/checkout')" />
    <!-- Progress Bar Global para navegación -->
    <ProgressBar 
      :progress="progress" 
      :is-visible="isVisible"
    />

    <!-- Loading Spinner para operaciones específicas solamente -->
    <LoadingSpinner 
      :show="isLoading && !isVisible" 
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
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import LoadingSpinner from './components/ui/LoadingSpinner.vue'
import ProgressBar from './components/ui/ProgressBar.vue'
import Chatbot from './components/ui/Chatbot.vue'
import CartModal from './components/cart/CartModal.vue'
import CartAddedNotification from './components/cart/CartAddedNotification.vue'
import { globalProgressBar } from './composables/useProgressBar'

const authStore = useAuthStore()
const { isLoading, loadingMessage, loadingSubmessage, showSmartLoading } = useLoading()
const { progress, isVisible } = globalProgressBar

onMounted(async () => {
  // Inicialización optimizada con loading inteligente
  try {
    // Solo mostrar loading si la inicialización tarda más de 200ms
    await showSmartLoading(
      authStore.initAuth(), 
      'Inicializando aplicación...', 
      200
    )
  } catch (error) {
    console.error('Error en inicialización de auth:', error)
    // La aplicación puede funcionar sin auth, no es crítico
  }
})
</script>