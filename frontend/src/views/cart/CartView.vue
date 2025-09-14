<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-400 hover:text-gray-500 flex items-center">
              <svg class="flex-shrink-0 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span class="font-body ml-1 text-sm">Inicio</span>
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="font-body ml-2 text-sm font-medium text-body-text">Carrito</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Cart Component -->
      <ShoppingCart />
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoppingCart from '../../components/cart/ShoppingCart.vue';
</script>
