<template>
  <div class="bg-gray-100 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Explora Nuestra Colección</h2>
        <p class="mt-4 text-lg text-gray-600">Encuentra exactamente lo que buscas</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Categorías -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l-7 7-7-7m14 0H5"></path>
            </svg>
            Categorías
          </h3>
          <div class="space-y-2">
            <div v-if="loading.categories" class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
            <div v-else-if="categories.length === 0" class="text-gray-500 text-sm">
              No hay categorías disponibles
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <router-link 
                v-for="category in categories" 
                :key="category.id"
                :to="`/?category=${category.name.toUpperCase()}`"
                class="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-accent transition-colors duration-200"
              >
                {{ category.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Colores -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a4 4 0 01-4 4z"></path>
            </svg>
            Colores Disponibles
          </h3>
          <div class="space-y-2">
            <div v-if="loading.colors" class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
            <div v-else-if="colors.length === 0" class="text-gray-500 text-sm">
              No hay colores disponibles
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span 
                v-for="color in colors" 
                :key="color.id"
                class="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                <span 
                  class="w-3 h-3 rounded-full mr-2 border border-gray-300" 
                  :style="{ backgroundColor: color.hex_code || '#cccccc' }"
                ></span>
                {{ color.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Talles -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Talles Disponibles
          </h3>
          <div class="space-y-2">
            <div v-if="loading.sizes" class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
            <div v-else-if="sizes.length === 0" class="text-gray-500 text-sm">
              No hay talles disponibles
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span 
                v-for="size in sizes" 
                :key="size.id"
                class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ size.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { masterDataApi } from '../config/index';
import type { Category, Color, Size } from '../types';

const categories = ref<Category[]>([]);
const colors = ref<Color[]>([]);
const sizes = ref<Size[]>([]);

const loading = ref({
  categories: true,
  colors: true,
  sizes: true
});

const loadMasterData = async () => {
  // Cargar categorías (todas, no solo las con stock para mostrar variedad)
  try {
    categories.value = await masterDataApi.getCategories();
  } catch (error) {
    console.error('❌ Error cargando categorías:', error);
  } finally {
    loading.value.categories = false;
  }

  // Cargar colores
  try {
    colors.value = await masterDataApi.getColors();
  } catch (error) {
    console.error('❌ Error cargando colores:', error);
  } finally {
    loading.value.colors = false;
  }

  // Cargar talles
  try {
    sizes.value = await masterDataApi.getSizes();
  } catch (error) {
    console.error('❌ Error cargando talles:', error);
  } finally {
    loading.value.sizes = false;
  }
};

onMounted(() => {
  loadMasterData();
});
</script>