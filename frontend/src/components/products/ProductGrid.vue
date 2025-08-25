<template>
  <div class="bg-[#dedede]">
    <div class="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-16 text-center">
        <h2 class="mb-4 text-3xl font-heading font-light tracking-wide text-gray-900 md:text-4xl">
          {{ title }}
        </h2>
        <div class="w-24 h-0.5 bg-gray-900 mx-auto"></div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in displayProducts" :key="product.id" :product="product" />
      </div>
      
      <!-- Load More Button -->
      <div v-if="hasMoreProducts" class="mt-16 text-center">
        <button @click="loadMoreProducts" class="btn-minimal btn-light font-body">
          Ver MÃ¡s Productos
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-if="displayProducts.length === 0" class="py-16 text-center">
        <div class="mb-4 text-gray-400">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-heading font-medium text-gray-900">No hay productos disponibles</h3>
        <p class="text-gray-500 font-body">Revisa mÃ¡s tarde o explora otras categorÃ­as</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from './ProductCard.vue';
import type { Product } from '../../types/products/product.types';
import { apiClient } from '../../config/index';

const route = useRoute();
const allProducts = ref<Product[]>([]);
const productsPerPage = ref(12);
const currentPage = ref(1);

// Filtrar productos basado en la categorÃ­a del query parameter
const filteredProducts = computed(() => {
  const category = route.query.category as string;
  if (!category) {
    return allProducts.value;
  }
  return allProducts.value.filter(product => 
    product.categoria?.toUpperCase() === category.toUpperCase()
  );
});

// PaginaciÃ³n de productos
const displayProducts = computed(() => {
  const endIndex = currentPage.value * productsPerPage.value;
  return filteredProducts.value.slice(0, endIndex);
});

// Verificar si hay mÃ¡s productos
const hasMoreProducts = computed(() => {
  return displayProducts.value.length < filteredProducts.value.length;
});

// TÃ­tulo dinÃ¡mico basado en la categorÃ­a
const title = computed(() => {
  const category = route.query.category as string;
  if (category) {
    return `ColecciÃ³n ${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}`;
  }
  return 'Nuestra ColecciÃ³n';
});

// Cargar mÃ¡s productos
const loadMoreProducts = () => {
  currentPage.value++;
};

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
    // Reset pagination when category changes
    currentPage.value = 1;
  }
});

onMounted(() => {
  loadProducts();
});
</script>

