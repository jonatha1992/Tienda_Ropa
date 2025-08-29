<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
    <!-- Contenedor principal -->
    <div class="relative flex flex-col w-full h-full max-w-6xl p-4 mx-auto">
      
      <!-- Header con boton cerrar -->
      <div class="absolute z-10 top-4 right-4">
        <button 
          @click="closeModal" 
          class="flex items-center justify-center w-12 h-12 text-3xl text-white transition-colors bg-black bg-opacity-50 rounded-full hover:text-gray-300 hover:bg-opacity-70"
        >
          ×
        </button>
      </div>
      
      <!-- Imagen principal -->
      <div class="relative flex items-center justify-center flex-1 min-h-0">
        <img 
          :src="currentImage" 
          :alt="alt" 
          class="object-contain max-w-full max-h-full"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <!-- Loading spinner -->
        <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
        </div>
        
        <!-- Botones navegaciÃ³n -->
        <button 
          v-if="images.length > 1"
          @click="previousImage" 
          :disabled="currentIndex === 0"
          class="absolute flex items-center justify-center w-12 h-12 text-4xl text-white transition-colors bg-black bg-opacity-50 rounded-full left-4 hover:text-gray-300 hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <
        </button>
        
        <button 
          v-if="images.length > 1"
          @click="nextImage" 
          :disabled="currentIndex === images.length - 1"
          class="absolute flex items-center justify-center w-12 h-12 text-4xl text-white transition-colors bg-black bg-opacity-50 rounded-full right-4 hover:text-gray-300 hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          >
        </button>
      </div>
      
      <!-- Thumbnails y contador -->
      <div v-if="images.length > 1" class="flex flex-col items-center mt-4 space-y-4">
        <!-- Thumbnails -->
        <div class="flex justify-center max-w-full pb-2 space-x-2 overflow-x-auto">
          <div 
            v-for="(image, index) in images" 
            :key="index" 
            @click="selectImage(index)"
            class="flex-shrink-0 w-16 h-16 transition-colors border-2 rounded cursor-pointer"
            :class="currentIndex === index ? 'border-white' : 'border-transparent hover:border-gray-400'"
          >
            <img 
              :src="image.image_url" 
              :alt="`Thumbnail ${index + 1}`"
              class="object-cover w-full h-full rounded"
              loading="lazy"
            />
          </div>
        </div>
        
        <!-- Contador de imÃ¡genes -->
        <div class="text-sm text-center text-white font-body">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { ProductImage } from '../../types/products/product.types';

interface Props {
  isOpen: boolean;
  images: ProductImage[];
  initialIndex?: number;
  alt?: string;
}

interface Emits {
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
  alt: 'Imagen del producto'
});

const emit = defineEmits<Emits>();

const currentIndex = ref(0);
const imageLoading = ref(false);

const currentImage = computed(() => {
  if (props.images && props.images[currentIndex.value]) {
    return props.images[currentIndex.value].image_url;
  }
  return '';
});

const closeModal = () => {
  emit('close');
};

const selectImage = (index: number) => {
  if (index !== currentIndex.value) {
    imageLoading.value = true;
    currentIndex.value = index;
  }
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    selectImage(currentIndex.value + 1);
  }
};

const previousImage = () => {
  if (currentIndex.value > 0) {
    selectImage(currentIndex.value - 1);
  }
};

const handleImageLoad = () => {
  imageLoading.value = false;
};

const handleImageError = () => {
  imageLoading.value = false;
  console.warn('Error cargando imagen en galerÃ­a');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;
  
  switch (event.key) {
    case 'Escape':
      closeModal();
      break;
    case 'ArrowLeft':
      previousImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
  }
};

// Touch gestures
const startX = ref(0);
const startY = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX;
  startY.value = e.touches[0].clientY;
};

const handleTouchEnd = (e: TouchEvent) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const deltaX = endX - startX.value;
  const deltaY = endY - startY.value;
  
  // Verificar que sea un swipe horizontal (no vertical) y con suficiente distancia
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      previousImage();
    } else {
      nextImage();
    }
  }
};

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    currentIndex.value = props.initialIndex;
    imageLoading.value = true;
  }
});

watch(() => props.initialIndex, (newValue) => {
  if (props.isOpen) {
    currentIndex.value = newValue;
    imageLoading.value = true;
  }
});

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchend', handleTouchEnd);
});
</script>
