<template>
  <div class="bg-secondary">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-extrabold tracking-tight text-primary">{{ title }}</h2>

      <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard v-for="product in displayProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from './ProductCard.vue';
import type { Product } from '../types';

import apiClient from '../api';

const route = useRoute();
const allProducts = ref<Product[]>([]);

// Filtrar productos basado en la categoría del query parameter
const filteredProducts = computed(() => {
  const category = route.query.category as string;
  if (!category) {
    return allProducts.value;
  }
  return allProducts.value.filter(product => 
    product.categoria?.toUpperCase() === category.toUpperCase()
  );
});

// Usar productos filtrados
const displayProducts = computed(() => filteredProducts.value);

// Título dinámico basado en la categoría
const title = computed(() => {
  const category = route.query.category as string;
  if (category) {
    return `Colección - ${category.toUpperCase()}`;
  }
  return 'Nuestra Colección';
});

// Cargar productos
const loadProducts = async () => {
  if (import.meta.env.VITEST) return;
  try {
    const response = await apiClient.get('/products/');
    allProducts.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Watchers
watch(() => route.query.category, (newCategory, oldCategory) => {
  if (newCategory !== oldCategory) {
    console.log(`Filtering by category: ${newCategory}`);
  }
});

onMounted(() => {
  loadProducts();
});
</script>
