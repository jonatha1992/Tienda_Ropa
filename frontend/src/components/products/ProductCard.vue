<template>
  <router-link :to="`/product/${product.id}/${product.name}`" class="block h-full">
    <div class="flex flex-col h-full overflow-hidden transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300">
      <!-- Imagen del producto -->
      <div class="relative overflow-hidden aspect-square bg-gray-50">
        <!-- Imagen principal -->
        <div class="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
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

        <!-- Imagen secundaria (hover) -->
        <div v-if="product.images && product.images[1]" class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
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

        <!-- Etiquetas de producto -->
        <div v-if="product.is_new || product.is_sale || product.has_discount" class="absolute space-y-1 top-2 left-2">
          <span v-if="product.is_new" class="inline-block px-2 py-0.5 text-[10px] font-medium text-white bg-black uppercase">
            New
          </span>
          <span v-if="product.is_sale" class="inline-block px-2 py-0.5 text-[10px] font-medium text-white bg-red-600 uppercase">
            Sale
          </span>
          <span v-if="product.has_discount && product.discount_percentage" class="inline-block px-2 py-0.5 text-[10px] font-medium text-white bg-orange-500 uppercase">
            -{{ product.discount_percentage }}%
          </span>
        </div>


        <!-- Etiqueta de SIN STOCK en esquina superior izquierda -->
        <div v-if="(product.stock ?? 0) <= 0" class="absolute top-0 left-0 z-10 mt-2 ml-4">
          <span class="px-3 py-1 text-xs font-bold text-white bg-gray-600 rounded-lg">SIN STOCK</span>
        </div>
      </div>

      <!-- Información del producto -->
      <div class="flex flex-col flex-1 p-3">
        <!-- Nombre del producto -->
        <h3 class="mb-1 text-sm font-normal leading-tight text-gray-800 line-clamp-2">
          {{ product.name }}
        </h3>

        <!-- Categoría -->
        <p v-if="product.categoria" class="mb-2 text-xs tracking-wider text-gray-500 uppercase">
          {{ product.categoria }}
        </p>
        
        <!-- Precios -->
        <div class="pt-2 mt-auto">
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
            <span v-if="product.original_price && product.original_price > product.price" 
                  class="ml-1.5 text-xs text-gray-400 line-through">
              ${{ product.original_price.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
  </router-link>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import type { Product } from '../../types/products/product.types';
import OptimizedImage from './OptimizedImage.vue';

const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a';

const props = defineProps<{
  product: Product;
}>();

const imageError = ref(false);

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
  // TODO: Implementar lógica de quick add
};
</script>

<style scoped>
/* Estilos para el contenedor de la tarjeta */
.router-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* Estilos para la imagen */
.aspect-square {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Mantener relaci  ón de aspecto 1:1 */
  overflow: hidden;
  background-color: #f9fafb;
}

/* Contenedor de imágenes */
.aspect-square > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Efecto hover en la imagen */
img {
  transition: transform 0.3s ease;
}

.router-link:hover img {
  transform: scale(1.03);
}

/* Estilos para las etiquetas de producto */
.bg-black, .bg-red-600, .bg-orange-500 {
  border-radius: 2px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  line-height: 1;
  padding: 0.25rem 0.4rem;
}

/* Estilos para el texto tachado */
.line-through {
  text-decoration-color: #9ca3af;
}

/* Efecto de hover en toda la tarjeta */
.router-link {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.router-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Mejoras de accesibilidad */
.router-link:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  transform: translateY(-1px);
}
</style>
