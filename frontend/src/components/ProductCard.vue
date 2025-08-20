<template>
  <router-link :to="`/product/${createSlug(product.name)}`" class="block cursor-pointer">
    <div class="relative product-card group">
      <!-- Stock Indicator Above Image -->
      <div v-if="isOutOfStock" class="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20 bg-red-600 text-white px-3 py-1 text-xs font-body font-bold rounded-full shadow-lg">
        SIN STOCK
      </div>
      
      <!-- Product Images Container -->
      <div class="relative w-full overflow-hidden bg-gray-100 aspect-square">
        <!-- Primary Image -->
        <div class="primary-image-container">
          <OptimizedImage
            :src="imageToShow"
            :alt="product.name"
            loading="lazy"
            aspect-ratio="square"
            :show-spinner="true"
            :fallback-src="defaultImage"
            image-class="object-cover w-full h-full"
            @error="handleImageError"
          />
        </div>
      
        <!-- Secondary Image (hover effect) -->
        <div v-if="product.images && product.images[1]" class="secondary-image-container">
          <OptimizedImage
            :src="product.images[1].image_url"
            :alt="product.name"
            loading="lazy"
            aspect-ratio="square"
            :show-spinner="true"
            :fallback-src="defaultImage"
            image-class="object-cover w-full h-full"
          />
        </div>
      </div>
      
      <!-- Product Labels -->
      <div v-if="product.is_new || product.is_sale || product.has_discount" class="absolute space-y-2 top-3 left-3">
        <span v-if="product.is_new" class="inline-block px-3 py-1 text-xs font-body font-medium tracking-wide text-white uppercase bg-black">
          New
        </span>
        <span v-if="product.is_sale" class="inline-block px-3 py-1 text-xs font-body font-medium tracking-wide text-white uppercase bg-red-600">
          Sale
        </span>
        <span v-if="product.has_discount && product.discount_percentage" class="inline-block px-3 py-1 text-xs font-body font-medium tracking-wide text-white uppercase bg-orange-500">
          -{{ product.discount_percentage }}%
        </span>
      </div>
      
      <!-- Sin Stock Overlay -->
      <div v-if="isOutOfStock" class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div class="bg-white bg-opacity-90 px-4 py-2 rounded-lg">
          <span class="text-lg font-heading font-semibold text-gray-800">Sin Stock</span>
        </div>
      </div>
      
      <!-- Quick Add Button (appears on hover) -->
      <div v-if="!isOutOfStock" class="absolute inset-x-0 px-4 transition-opacity duration-300 opacity-0 bottom-4 group-hover:opacity-100">
        <button @click.stop="quickAdd" class="w-full text-center btn-minimal btn-dark font-body">
          Agregar
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-4 pt-3 flex-grow flex flex-col">
      <h3 class="text-xs font-body font-normal text-gray-800 leading-tight tracking-wide mb-1 line-clamp-2 h-8">
        {{ product.name }}
      </h3>
      
      <!-- Product Category -->
      <p v-if="product.categoria" class="text-[10px] font-body font-light tracking-wider text-gray-400 uppercase mb-2">
        {{ product.categoria }}
      </p>
      
      <!-- Product Price -->
      <div class="mt-auto">
        <!-- Precio con descuento -->
        <div v-if="product.has_discount && product.discounted_price" class="space-y-0.5">
          <span class="block text-sm font-bold text-gray-900">
            ${{ product.discounted_price.toFixed(2) }}
          </span>
          <span class="text-xs text-gray-400 line-through">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
        
        <!-- Precio normal -->
        <div v-else>
          <span class="text-sm font-bold text-gray-900">
            ${{ product.price.toFixed(2) }}
          </span>
          <!-- Mostrar precio tachado si hay un precio original mayor -->
          <span v-if="product.original_price && product.original_price > product.price" 
                class="ml-1.5 text-xs text-gray-400 line-through">
            ${{ product.original_price.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import type { Product } from '../types';
import OptimizedImage from './OptimizedImage.vue';

const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a';

const props = defineProps<{
  product: Product;
}>();

const imageError = ref(false);

// Create URL-friendly slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[áàâã]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íìî]/g, 'i')
    .replace(/[óòôõ]/g, 'o')
    .replace(/[úùû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Improved image handling with error fallback
const imageToShow = computed(() => {
  if (imageError.value) {
    return defaultImage;
  }
  
  // Check if product has images and first image exists
  if (props.product.images && props.product.images[0] && props.product.images[0].image_url) {
    return props.product.images[0].image_url;
  }
  
  return defaultImage;
});

// Handle image load errors
const handleImageError = () => {
  console.warn(`Failed to load image for product: ${props.product.name}`);
  imageError.value = true;
};

// Determinar si el producto está sin stock
const isOutOfStock = computed(() => {
  // Para productos únicos (is_unique = true), verificar el stock directo
  if (props.product.is_unique) {
    return props.product.stock === 0 || props.product.stock === null;
  }
  
  // Para productos con variantes, verificar si todas las variantes tienen stock 0
  if (props.product.variants && props.product.variants.length > 0) {
    return props.product.variants.every((variant: any) => variant.stock === 0);
  }
  
  // Si no hay variantes y no es único, asumir que está disponible
  return false;
});

// Quick add function (placeholder)
const quickAdd = () => {
  console.log('Quick add clicked for:', props.product.name);
  // TODO: Implementar lógica de quick add
};
</script>

<style scoped>
.product-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  border-color: #d1d5db;
}

/* Image container styling */
.product-card .aspect-square {
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  position: relative;
  background: #f9fafb;
}

/* Primary image container styling */
.primary-image-container {
  position: relative;
  z-index: 1;
  transition: opacity 0.4s ease;
  width: 100%;
  height: 100%;
  opacity: 1;
}

/* Secondary image styling */
.secondary-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.product-card:hover .primary-image-container {
  opacity: 0;
}

.product-card:hover .secondary-image-container {
  opacity: 1;
}

/* Quick add button */
.btn-minimal {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-minimal.btn-dark {
  background-color: #111;
  color: white;
  border: 1px solid #111;
}

.btn-minimal.btn-dark:hover {
  background-color: #333;
  border-color: #333;
}

/* Stock indicator */
.bg-red-600 {
  background-color: #dc2626;
}

/* Labels */
.bg-black, .bg-red-600, .bg-orange-500 {
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  border-radius: 2px;
}

/* Price styling */
.line-through {
  text-decoration-color: #9ca3af;
}

/* Image hover effect */
.product-card .aspect-square {
  overflow: hidden;
}

.product-card img {
  transition: transform 0.4s ease;
}

.product-card:hover img {
  transform: scale(1.03);
}

/* Quick Add Button Enhancement */
.product-card .btn-minimal {
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.product-card .btn-minimal:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-1px);
}
</style>