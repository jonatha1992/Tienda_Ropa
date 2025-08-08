<template>
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