<template>
  <router-link :to="`/product/${product.id}/${createSlug(product.name)}`" class="block h-full">
    <div class="h-full flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <!-- Imagen del producto -->
      <div class="relative aspect-square overflow-hidden bg-gray-50">
        <!-- Imagen principal -->
        <div class="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
          <OptimizedImage
            :src="imageToShow"
            :alt="product.name"
            loading="lazy"
            aspect-ratio="square"
            :show-spinner="true"
            :fallback-src="defaultImage"
            image-class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- Imagen secundaria (hover) -->
        <div v-if="product.images && product.images[1]" class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <OptimizedImage
            :src="product.images[1].image_url"
            :alt="product.name"
            loading="lazy"
            aspect-ratio="square"
            :show-spinner="true"
            :fallback-src="defaultImage"
            image-class="w-full h-full object-cover"
          />
        </div>

        <!-- Etiquetas de producto -->
        <div v-if="product.is_new || product.is_sale || product.has_discount" class="absolute top-2 left-2 space-y-1">
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

        <!-- Etiqueta de oferta o nuevo -->
        <div v-if="(product.is_sale || product.is_new) && (product.stock ?? 0) > 0" class="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span v-if="product.is_sale" class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            OFERTA
          </span>
          <span v-if="product.is_new" class="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
            NUEVO
          </span>
        </div>

        <!-- Etiqueta de SIN STOCK en esquina superior izquierda -->
        <div v-if="(product.stock ?? 0) <= 0" class="absolute top-0 left-0 z-10 mt-2 ml-4">
          <span class="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-lg">SIN STOCK</span>
        </div>
      </div>

      <!-- Información del producto -->
      <div class="p-3 flex-1 flex flex-col">
        <!-- Nombre del producto -->
        <h3 class="text-sm font-normal text-gray-800 mb-1 line-clamp-2 leading-tight">
          {{ product.name }}
        </h3>
        
        <!-- CategorÃ­a -->
        <p v-if="product.categoria" class="text-xs text-gray-500 uppercase tracking-wider mb-2">
          {{ product.categoria }}
        </p>
        
        <!-- Precios -->
        <div class="mt-auto pt-2">
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
  console.warn(`Failed to load image for product: ${props.product.name}`);
  imageError.value = true;
};

// Create URL-friendly slug from product name
const createSlug = (name: string) => {
  return name
    .trim()
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
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
    .trim();
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
