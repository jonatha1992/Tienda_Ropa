<template>
  <div class="relative h-screen">
    <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay loop muted>
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
      <h1 class="text-4xl md:text-6xl font-bold">M-VINTAGE</h1>
      <p class="mt-4 text-lg">Estilo que perdura</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>