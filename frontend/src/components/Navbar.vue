<template>
  <nav class="bg-secondary shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex-shrink-0">
          <a href="/" class="text-2xl font-bold text-primary">M-VINTAGE</a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <div class="relative">
              <button @click="toggleShopMenu" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">SHOP</button>
              <div v-if="isShopMenuOpen" class="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-secondary ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">JACKET</a>
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">BLAZER</a>
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">DRESS</a>
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">JEAN</a>
                </div>
              </div>
            </div>
            <a href="#" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">CONTACT</a>
            <a href="#" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">HOW TO SHOP</a>
            <a href="#" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">ENVÍOS</a>
            <router-link to="/admin/products" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">Admin</router-link>
          </div>
        </div>
        <div class="flex items-center">
          <router-link to="/cart" class="p-1 rounded-full text-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span class="sr-only">Carrito</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isShopMenuOpen = ref(false);

const toggleShopMenu = () => {
  isShopMenuOpen.value = !isShopMenuOpen.value;
};
</script>
