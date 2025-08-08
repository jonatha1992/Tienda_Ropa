<template>
  <div>
    <Navbar v-if="!isAuthPage" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const authStore = useAuthStore()

// No mostrar navbar en la página de autenticación
const isAuthPage = computed(() => route.path === '/auth')

onMounted(async () => {
  await authStore.initAuth()
})
</script>