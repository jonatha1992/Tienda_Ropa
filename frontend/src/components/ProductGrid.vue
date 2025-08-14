<template>
<<<<<<< HEAD
  <div class="bg-secondary">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-extrabold tracking-tight text-primary">{{ title }}</h2>

      <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard v-for="product in displayProducts" :key="product.id" :product="product" />
      </div>
=======
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
          {{ title }}
        </h2>
        <div class="w-24 h-0.5 bg-gray-900 mx-auto"></div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in displayProducts" :key="product.id" :product="product" />
      </div>
      
      <!-- Load More Button -->
      <div v-if="hasMoreProducts" class="text-center mt-16">
        <button @click="loadMoreProducts" class="btn-minimal btn-light">
          Ver Más Productos
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-if="displayProducts.length === 0" class="text-center py-16">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
        <p class="text-gray-500">Revisa más tarde o explora otras categorías</p>
      </div>
>>>>>>> dev
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
<<<<<<< HEAD
=======
const productsPerPage = ref(12);
const currentPage = ref(1);
>>>>>>> dev

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

<<<<<<< HEAD
// Usar productos filtrados
const displayProducts = computed(() => filteredProducts.value);
=======
// Paginación de productos
const displayProducts = computed(() => {
  const endIndex = currentPage.value * productsPerPage.value;
  return filteredProducts.value.slice(0, endIndex);
});

// Verificar si hay más productos
const hasMoreProducts = computed(() => {
  return displayProducts.value.length < filteredProducts.value.length;
});
>>>>>>> dev

// Título dinámico basado en la categoría
const title = computed(() => {
  const category = route.query.category as string;
  if (category) {
<<<<<<< HEAD
    return `Colección - ${category.toUpperCase()}`;
=======
    return `Colección ${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}`;
>>>>>>> dev
  }
  return 'Nuestra Colección';
});

<<<<<<< HEAD
=======
// Cargar más productos
const loadMoreProducts = () => {
  currentPage.value++;
};

>>>>>>> dev
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
<<<<<<< HEAD
=======
    // Reset pagination when category changes
    currentPage.value = 1;
>>>>>>> dev
  }
});

onMounted(() => {
  loadProducts();
});
</script>
