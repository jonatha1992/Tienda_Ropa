<template>
<<<<<<< HEAD
  <div class="relative group">
    <div
      class="w-full overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:h-80 lg:aspect-none">
      <img :src="product.images[0]?.image_url" :alt="product.name"
        class="object-cover object-center w-full h-full lg:w-full lg:h-full" />
    </div>
    <div class="flex justify-between mt-4">
      <div>
        <h3 class="text-sm text-gray-700">
          <a :href="'/product/' + product.id"> <!-- Debería enlazar a la página del producto -->
            <span aria-hidden="true" class="absolute inset-0"></span>
            {{ product.name }}
          </a>
        </h3>
      </div>
      <p class="text-sm font-medium text-gray-900">${{ product.price }}</p>
=======
  <div class="product-card relative group">
    <!-- Product Images Container -->
    <div class="relative w-full overflow-hidden bg-gray-100 aspect-square">
      <!-- Primary Image -->
      <img 
        v-if="product.images && product.images[0]" 
        :src="product.images[0].image_url" 
        :alt="product.name"
        class="primary-image w-full h-full object-cover transition-opacity duration-300"
      />
      
      <!-- Secondary Image (hover effect) -->
      <img 
        v-if="product.images && product.images[1]" 
        :src="product.images[1].image_url" 
        :alt="product.name"
        class="secondary-image w-full h-full object-cover"
      />
      
      <!-- Product Labels -->
      <div v-if="product.is_new || product.is_sale" class="absolute top-3 left-3 space-y-2">
        <span v-if="product.is_new" class="inline-block px-3 py-1 text-xs font-medium tracking-wide text-white bg-black uppercase">
          New
        </span>
        <span v-if="product.is_sale" class="inline-block px-3 py-1 text-xs font-medium tracking-wide text-white bg-red-600 uppercase">
          Sale
        </span>
      </div>
      
      <!-- Quick Add Button (appears on hover) -->
      <div class="absolute inset-x-0 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button class="w-full mx-4 btn-minimal btn-dark">
          Quick Add
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="mt-4 space-y-2">
      <h3 class="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
        <router-link :to="`/product/${product.id}`">
          {{ product.name }}
        </router-link>
      </h3>
      
      <!-- Product Price -->
      <div class="flex items-center space-x-2">
        <span v-if="product.original_price && product.original_price > product.price" 
              class="text-sm text-gray-500 line-through">
          ${{ product.original_price }}
        </span>
        <span class="text-sm font-medium text-gray-900">
          ${{ product.price }}
        </span>
      </div>
      
      <!-- Product Category -->
      <p v-if="product.categoria" class="text-xs text-gray-500 uppercase tracking-wide">
        {{ product.categoria }}
      </p>
>>>>>>> dev
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Product } from '../types';

defineProps<{
  product: Product;
}>();
</script>