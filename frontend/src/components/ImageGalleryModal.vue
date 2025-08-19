<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
    <!-- Contenedor principal -->
    <div class="relative w-full h-full flex flex-col max-w-6xl mx-auto p-4">
      
      <!-- Header con botón cerrar -->
      <div class="absolute top-4 right-4 z-10">
        <button 
          @click="closeModal" 
          class="text-white hover:text-gray-300 text-3xl w-12 h-12 flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
        >
          ×
        </button>
      </div>
      
      <!-- Imagen principal -->
      <div class="flex-1 flex items-center justify-center relative min-h-0">
        <img 
          :src="currentImage" 
          :alt="alt" 
          class="max-h-full max-w-full object-contain"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <!-- Loading spinner -->
        <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        
        <!-- Botones navegación -->
        <button 
          v-if="images.length > 1"
          @click="previousImage" 
          :disabled="currentIndex === 0"
          class="absolute left-4 text-white text-4xl hover:text-gray-300 w-12 h-12 flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        
        <button 
          v-if="images.length > 1"
          @click="nextImage" 
          :disabled="currentIndex === images.length - 1"
          class="absolute right-4 text-white text-4xl hover:text-gray-300 w-12 h-12 flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
      
      <!-- Thumbnails y contador -->
      <div v-if="images.length > 1" class="flex flex-col items-center mt-4 space-y-4">
        <!-- Thumbnails -->
        <div class="flex justify-center space-x-2 overflow-x-auto max-w-full pb-2">
          <div 
            v-for="(image, index) in images" 
            :key="index" 
            @click="selectImage(index)"
            class="flex-shrink-0 w-16 h-16 cursor-pointer border-2 rounded transition-colors"
            :class="currentIndex === index ? 'border-white' : 'border-transparent hover:border-gray-400'"
          >
            <img 
              :src="image.image_url" 
              :alt="`Thumbnail ${index + 1}`"
              class="w-full h-full object-cover rounded"
              loading="lazy"
            />
          </div>
        </div>
        
        <!-- Contador de imágenes -->
        <div class="text-center text-white text-sm font-body">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { ProductImage } from '../types';

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
  console.warn('Error cargando imagen en galería');
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