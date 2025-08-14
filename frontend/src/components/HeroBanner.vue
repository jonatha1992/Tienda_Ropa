<template>
<<<<<<< HEAD
  <div class="relative h-screen">
    <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay loop muted>
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
      <h1 class="text-4xl md:text-6xl font-bold">M-VINTAGE</h1>
      <p class="mt-4 text-lg">Estilo que perdura</p>
=======
  <div class="hero-section relative h-screen bg-gray-50">
    <!-- Hero Video -->
    <div class="absolute inset-0">
      <video 
        class="w-full h-full object-cover" 
        autoplay 
        loop 
        muted 
        playsinline
      >
        <source src="/Video.mp4" type="video/mp4">
        <!-- Fallback image if video fails to load -->
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" 
          alt="M-VINTAGE Collection" 
          class="w-full h-full object-cover"
        />
      </video>
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
    </div>
    
    <!-- Hero Content -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <div class="max-w-2xl">
        <div class="flex items-center justify-center space-x-3 mb-6">
          <img src="/imagen-portada.svg" alt="M-VINTAGE Logo" class="h-12 w-12 md:h-16 md:w-16" />
          <h1 class="text-5xl md:text-7xl font-light text-white tracking-wide">
            M-VINTAGE
          </h1>
        </div>
        <p class="text-xl md:text-2xl text-white font-light mb-8 tracking-wide">
          Estilo que perdura en el tiempo
        </p>
        <div class="space-y-4">
          <button class="btn-minimal btn-light mr-4">
            Ver Colección
          </button>
          <button class="btn-minimal btn-dark">
            Nuevos Arrivals
          </button>
        </div>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40%, 43% {
    transform: translateY(-10px) translateX(-50%);
  }
  70% {
    transform: translateY(-5px) translateX(-50%);
  }
  90% {
    transform: translateY(-2px) translateX(-50%);
  }
}
</style>
