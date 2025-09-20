<template>
  <div class="app-container" :class="{ 'app-loaded': appLoaded }">
    <Navbar />
    <router-view />
    <Footer v-if="!$route.path.includes('/checkout')" class="footer-transition" :class="{ 'footer-visible': showFooter }" />
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
import { onMounted, onUnmounted, ref } from 'vue'
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

// Estado para controlar la animación de carga
const appLoaded = ref(false)
// Estado para controlar la visibilidad del footer
const showFooter = ref(false)

// Función para manejar el scroll
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  const clientHeight = window.innerHeight

  // Mostrar footer cuando esté cerca del final de la página (80% del contenido)
  const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
  showFooter.value = scrollPercentage > 0.8
}

onMounted(async () => {
  // Inicialización con transición suave
  try {
    await authStore.initAuth()
  } catch (error) {
    // La aplicación puede funcionar sin auth, no es crítico
  } finally {
    // Pequeño delay para suavizar la transición
    setTimeout(() => {
      appLoaded.value = true
    }, 100)
  }

  // Agregar listener de scroll
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  // Limpiar listener de scroll
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-container {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.app-container.app-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* Animación del footer con scroll */
.footer-transition {
  transform: translateY(30px);
  opacity: 0.7;
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.footer-transition.footer-visible {
  transform: translateY(0);
  opacity: 1;
}
</style>