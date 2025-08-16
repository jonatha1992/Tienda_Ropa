<template>
  <router-link :to="`/product/${product.id}`" class="block cursor-pointer">
    <div class="relative product-card group">
      <!-- Product Images Container -->
      <div class="relative w-full overflow-hidden bg-gray-100 aspect-square">
        <!-- Primary Image -->
        <img 
          :src="imageToShow" 
          :alt="product.name"
          loading="eager"
          class="object-cover w-full h-full transition-opacity duration-300 primary-image"
        />
        
        <!-- Secondary Image (hover effect) -->
        <img 
          v-if="product.images && product.images[1]" 
          :src="product.images[1].image_url" 
          :alt="product.name"
          loading="eager"
          class="object-cover w-full h-full secondary-image"
        />
        
        <!-- Product Labels -->
        <div v-if="product.is_new || product.is_sale || product.has_discount" class="absolute space-y-2 top-3 left-3">
          <span v-if="product.is_new" class="inline-block px-3 py-1 text-xs font-medium tracking-wide text-white uppercase bg-black">
            New
          </span>
          <span v-if="product.is_sale" class="inline-block px-3 py-1 text-xs font-medium tracking-wide text-white uppercase bg-red-600">
            Sale
          </span>
          <span v-if="product.has_discount && product.discount_percentage" class="inline-block px-3 py-1 text-xs font-medium tracking-wide text-white uppercase bg-orange-500">
            -{{ product.discount_percentage }}%
          </span>
        </div>
        
        <!-- Quick Add Button (appears on hover) -->
        <div class="absolute inset-x-0 px-4 transition-opacity duration-300 opacity-0 bottom-4 group-hover:opacity-100">
          <button @click.stop="quickAdd" class="w-full text-center btn-minimal btn-dark">
            Agregar
          </button>
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="mt-4 space-y-2">
        <h3 class="text-sm font-medium text-gray-900 transition-colors group-hover:text-gray-700">
          {{ product.name }}
        </h3>
        
        <!-- Product Price -->
        <div class="flex items-center space-x-2">
          <!-- Precio original si hay descuento -->
          <span v-if="product.has_discount && product.discounted_price" 
                class="text-sm text-gray-500 line-through">
            ${{ product.price.toFixed(2) }}
          </span>
          <!-- Precio con descuento si aplica, sino el precio normal -->
          <span :class="['text-sm font-medium', product.has_discount ? 'text-green-600' : 'text-gray-900']">
            ${{ product.has_discount && product.discounted_price ? product.discounted_price.toFixed(2) : product.price.toFixed(2) }}
          </span>
          <!-- Precio original legacy (mantenemos para compatibilidad) -->
          <span v-if="!product.has_discount && product.original_price && product.original_price > product.price" 
                class="text-sm text-gray-500 line-through">
            ${{ product.original_price }}
          </span>
        </div>
        
        <!-- Product Category -->
        <p v-if="product.categoria" class="text-xs tracking-wide text-gray-500 uppercase">
          {{ product.categoria }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">


import { defineProps, computed } from 'vue';
import type { Product } from '../types';

const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a';

const props = defineProps<{
  product: Product;
}>();

// Debug para ver qué está pasando con las imágenes
const imageToShow = computed(() => {
  console.log('🖼️ ProductCard Debug:', {
    productName: props.product.name,
    hasImages: !!props.product.images,
    imagesLength: props.product.images?.length || 0,
    firstImage: props.product.images?.[0],
    defaultImage: defaultImage,
    willUseDefault: !(props.product.images && props.product.images[0])
  });
  
  return props.product.images && props.product.images[0] ? props.product.images[0].image_url : defaultImage;
});

// Quick add function (placeholder)
const quickAdd = () => {
  console.log('Quick add clicked for:', props.product.name);
  // TODO: Implementar lógica de quick add
};
</script>