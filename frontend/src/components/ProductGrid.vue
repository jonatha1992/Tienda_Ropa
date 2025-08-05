<template>
  <div class="bg-secondary">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-extrabold tracking-tight text-primary">Nuestra Colección</h2>

      <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductCard from './ProductCard.vue';
import type { Product } from '../types';

import apiClient from '../api';

const products = ref<Product[]>([]);

onMounted(async () => {
  if (import.meta.env.VITEST) return;
  try {
    const response = await apiClient.get('/products/');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});
</script>
