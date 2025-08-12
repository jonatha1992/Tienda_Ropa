<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initAuth()
})
</script>