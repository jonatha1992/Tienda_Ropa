<template>
  <div class="min-h-screen bg-white">
    <!-- Breadcrumb Navigation -->
    <nav class="px-4 py-4 mx-auto max-w-7xl lg:px-8" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2 text-sm font-body">
        <li>
          <router-link to="/" class="text-gray-500 hover:text-gray-700 transition-colors">
            Home
          </router-link>
        </li>
        <li class="text-gray-400">/</li>
        <li>
          <router-link to="/shop" class="text-gray-500 hover:text-gray-700 transition-colors">
            Shop
          </router-link>
        </li>
        <li v-if="product" class="text-gray-400">/</li>
        <li v-if="product" class="text-gray-900 font-medium truncate max-w-xs">
          {{ product.name }}
        </li>
      </ol>
    </nav>
    
    <div v-if="product" class="mx-auto max-w-7xl">
      <!-- Desktop Layout -->
      <div class="hidden lg:flex lg:gap-x-12 lg:px-8 lg:py-8 lg:max-w-6xl lg:mx-auto">
        <!-- Left Side - Images (mÃ¡s compacto) -->
        <div class="flex flex-shrink-0 gap-4">
          <!-- Main Image (mÃ¡s grande) -->
          <div class="w-[26rem] h-[32rem] overflow-hidden bg-gray-100 rounded-lg flex-shrink-0 border-4 border-white shadow-lg ring-1 ring-gray-200 relative cursor-pointer" @click="openImageGallery(selectedImage)">
            <OptimizedImage
              :src="mainImage"
              :alt="product.name"
              loading="eager"
              :show-spinner="true"
              :fallback-src="'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a'"
              image-class="object-cover object-center w-full h-full"
            />
            <!-- Sin Stock Overlay Desktop -->
            <div v-if="isOutOfStock" class="absolute top-0 left-0 z-10 mt-2 ml-4">
              <span class="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-lg">SIN STOCK</span>
            </div>
            
            <!-- Discount Badge Desktop -->
            <div v-else-if="product.has_discount && product.discount_amount" class="absolute top-0 right-0 z-10 mt-2 mr-4">
              <div class="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                -{{ discountPercentage }}% OFF
              </div>
            </div>
          </div>
          
          <!-- Thumbnail Images (mÃ¡s grandes) -->
          <div class="flex flex-col w-20 gap-2">
            <div 
              v-for="(image, index) in product.images" 
              :key="index"
              @click="selectedImage = index; openImageGallery(index)"
              class="w-20 h-20 overflow-hidden transition-colors bg-gray-100 border-2 rounded-md cursor-pointer"
              :class="selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'"
            >
              <OptimizedImage
                :src="image.image_url"
                :alt="`${product.name} - imagen ${index + 1}`"
                loading="lazy"
                aspect-ratio="square"
                :show-spinner="true"
                image-class="object-cover object-center w-full h-full"
              />
            </div>
          </div>
        </div>

        <!-- Right Side - Product Info (mÃ¡s cerca) -->
        <div class="flex-1 pl-6">
          <!-- Product Title -->
          <h1 class="mb-2 text-2xl font-light text-gray-900 font-heading">{{ product.name }}</h1>
          
          <!-- Price -->
          <div class="mb-6">
            <div v-if="product.has_discount && product.discounted_price" class="flex items-center space-x-3">
              <span class="text-2xl font-light text-red-600 font-body">${{ product.discounted_price.toLocaleString() }}</span>
              <span class="text-lg font-light text-gray-500 line-through font-body">${{ product.price.toLocaleString() }}</span>
              <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {{ discountPercentage }}% OFF
              </span>
            </div>
            <div v-else>
              <span class="text-2xl font-light text-gray-900 font-body">${{ product.price.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Color Selection -->
          <div v-if="availableColors.length > 0" class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-900 font-heading">Color</h3>
            <div class="flex space-x-3">
              <button
                v-for="color in availableColors"
                :key="color.id"
                @click="selectedColor = color"
                class="w-8 h-8 transition-colors border-2 rounded-full"
                :class="selectedColor?.id === color.id ? 'border-black' : 'border-gray-300'"
                :style="{ backgroundColor: color.hex_code }"
                :title="color.name"
              ></button>
            </div>
          </div>

          <!-- Size Selection -->
          <div v-if="availableSizes.length > 0" class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-900 font-heading">Talle</h3>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="size in availableSizes"
                :key="size.id"
                @click="selectedSize = size"
                class="px-4 py-2 text-sm font-medium transition-colors border rounded-md font-body"
                :class="selectedSize?.id === size.id 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'"
              >
                {{ size.name }}
              </button>
            </div>
          </div>

          <!-- Stock Info -->
          <div v-if="selectedVariant" class="mb-6">
            <p class="text-sm text-gray-600 font-body">
              Stock disponible: {{ selectedVariant.stock }}
            </p>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="mb-6">
            <!-- Quantity Selector -->
            <div class="mb-4">
              <h3 class="mb-2 text-sm font-medium text-gray-900 font-heading">Cantidad</h3>
              <div class="flex items-center w-32 border border-gray-300 rounded-md">
                <button 
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 font-body hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input 
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity ?? undefined"
                  class="flex-1 px-2 py-2 text-center border-none font-body focus:ring-0 focus:outline-none"
                />
                <button 
                  @click="incrementQuantity"
                  :disabled="quantity >= (maxQuantity ?? 1)"
                  class="px-3 py-2 text-gray-600 font-body hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button 
              @click="addToCart"
              :disabled="!canAddToCart"
              class="w-full px-6 py-3 text-sm font-medium transition-colors rounded-md "
              :class="canAddToCart 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-700 text-white cursor-not-allowed'"
            >
              {{ buttonText }}
            </button>
          </div>

          <!-- Product Description -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-900 font-body">DescripciÃ³n:</h3>
            <div class="text-sm font-normal text-gray-800 leading-tight" v-html="product.description"></div>
          </div>

          <!-- Product Details -->
          <div class="mt-8 space-y-2">
            <div class="flex">
              <span class="w-24 text-sm font-medium text-gray-900 font-body">CategorÃ­a:</span>
              <span class="text-sm text-gray-600 font-body">{{ product.categoria }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm font-medium text-gray-900 font-body">GÃ©nero:</span>
              <span class="text-sm text-gray-600 font-body">{{ product.genero }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm font-medium text-gray-900 font-body">Estado:</span>
              <span class="text-sm text-gray-600 font-body">{{ product.estado }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="lg:hidden">
        <!-- Mobile Images -->
        <div class="px-4 py-6">
          <div class="relative mb-4 overflow-hidden bg-gray-100 rounded-lg cursor-pointer" style="aspect-ratio: 26/32;" @click="openImageGallery(selectedImage)">
            <img 
              :src="mainImage" 
              :alt="product.name" 
              loading="eager"
              class="object-cover object-center w-full h-full"
            />
            <!-- Sin Stock Overlay Mobile -->
            <div v-if="isOutOfStock" class="absolute inset-0 flex items-center justify-center bg-black rounded-lg bg-opacity-40">
              <div class="px-4 py-2 bg-white rounded-lg bg-opacity-90">
                <span class="text-lg font-semibold text-gray-800 font-heading">Sin Stock</span>
              </div>
            </div>
            
            <!-- Discount Badge Mobile -->
            <div v-else-if="product.has_discount && product.discount_amount" class="absolute top-2 right-2 z-10">
              <div class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -{{ discountPercentage }}%
              </div>
            </div>
          </div>
          
          <!-- Mobile Thumbnail Scroll -->
          <div class="flex pb-4 space-x-3 overflow-x-auto">
            <div 
              v-for="(image, index) in product.images" 
              :key="index"
              @click="selectedImage = index; openImageGallery(index)"
              class="flex-shrink-0 w-16 h-16 overflow-hidden transition-colors bg-gray-100 border-2 rounded-md cursor-pointer"
              :class="selectedImage === index ? 'border-black' : 'border-transparent'"
            >
              <img 
                :src="image.image_url" 
                :alt="`${product.name} - imagen ${index + 1}`" 
                loading="eager"
                class="object-cover object-center w-full h-full"
              />
            </div>
          </div>
        </div>

        <!-- Mobile Product Info -->
        <div class="px-4 pb-8">
          <h1 class="mb-2 text-xl font-light text-gray-900 font-heading">{{ product.name }}</h1>
          <div class="mb-4">
            <div v-if="product.has_discount && product.discounted_price" class="flex items-center space-x-2">
              <span class="text-xl font-light text-red-600 font-body">${{ product.discounted_price.toLocaleString() }}</span>
              <span class="text-sm font-light text-gray-500 line-through font-body">${{ product.price.toLocaleString() }}</span>
              <span class="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {{ discountPercentage }}% OFF
              </span>
            </div>
            <div v-else>
              <span class="text-xl font-light text-gray-900 font-body">${{ product.price.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Mobile Color Selection -->
          <div v-if="availableColors.length > 0" class="mb-4">
            <h3 class="mb-2 text-sm font-medium text-gray-900 font-heading">Color</h3>
            <div class="flex space-x-2">
              <button
                v-for="color in availableColors"
                :key="color.id"
                @click="selectedColor = color"
                class="w-6 h-6 transition-colors border-2 rounded-full"
                :class="selectedColor?.id === color.id ? 'border-black' : 'border-gray-300'"
                :style="{ backgroundColor: color.hex_code }"
              ></button>
            </div>
          </div>

          <!-- Mobile Size Selection -->
          <div v-if="availableSizes.length > 0" class="mb-4">
            <h3 class="mb-2 text-sm font-medium text-gray-900 font-heading">Talle</h3>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="size in availableSizes"
                :key="size.id"
                @click="selectedSize = size"
                class="px-2 py-1 text-xs font-medium transition-colors border rounded font-body"
                :class="selectedSize?.id === size.id 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 bg-white text-gray-900'"
              >
                {{ size.name }}
              </button>
            </div>
          </div>

          <!-- Mobile Quantity and Add to Cart -->
          <div class="mb-4">
            <!-- Mobile Quantity Selector -->
            <div class="mb-3">
              <h3 class="mb-2 text-sm font-medium text-gray-900 font-heading">Cantidad</h3>
              <div class="flex items-center border border-gray-300 rounded-md w-28">
                <button 
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="px-2 py-1 text-sm text-gray-600 font-body hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input 
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity ?? undefined"
                  class="flex-1 px-1 py-1 text-sm text-center border-none font-body focus:ring-0 focus:outline-none"
                />
                <button 
                  @click="incrementQuantity"
                  :disabled="quantity >= (maxQuantity ?? 1)"
                  class="px-2 py-1 text-sm text-gray-600 font-body hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Mobile Add to Cart Button -->
            <button 
              @click="addToCart"
              :disabled="!canAddToCart"
              class="w-full px-6 py-3 text-sm font-medium transition-colors rounded-md "
              :class="canAddToCart 
                   ? 'bg-black text-white hover:bg-gray-700' 
                : 'bg-gray-700 text-white cursor-not-allowed'"
            >
              {{ buttonText }}
            </button>
          </div>

          <!-- Mobile Description -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-900 font-heading">DescripciÃ³n</h3>
            <div class="text-sm text-gray-600 font-body" v-html="product.description"></div>
          </div>
        </div>
      </div>

      <!-- Productos Similares Section -->
      <div v-if="similarProducts.length > 0" class="px-8 py-12 bg-gray-50">
        <div class="max-w-6xl mx-auto">
          <h2 class="mb-8 text-2xl font-light text-center text-gray-900 font-heading">Productos Similares</h2>
          
          <!-- Desktop Grid -->
          <div class="hidden md:grid md:grid-cols-4 md:gap-6">
            <div 
              v-for="similarProduct in similarProducts.slice(0, 4)" 
              :key="similarProduct.id"
              class="group"
            >
              <router-link :to="`/product/${createSlug(similarProduct.name)}`" class="block">
                <div class="relative overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                  <!-- Image -->
                  <div class="overflow-hidden bg-gray-100 aspect-square">
                    <img 
                      :src="getSimilarProductImage(similarProduct)" 
                      :alt="similarProduct.name"
                      loading="eager"
                      class="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <!-- Product Info -->
                  <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-900 transition-colors font-heading group-hover:text-gray-700">
                      {{ similarProduct.name }}
                    </h3>
                    <p class="mt-1 text-sm font-medium text-gray-900 font-body">
                      ${{ similarProduct.price.toLocaleString() }}
                    </p>
                    <p v-if="similarProduct.categoria" class="mt-1 text-xs tracking-wide text-gray-500 uppercase font-body">
                      {{ similarProduct.categoria }}
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Mobile Scroll -->
          <div class="md:hidden">
            <div class="flex pb-4 space-x-4 overflow-x-auto">
              <div 
                v-for="similarProduct in similarProducts.slice(0, 6)" 
                :key="similarProduct.id"
                class="flex-shrink-0 w-48 group"
              >
                <router-link :to="`/product/${createSlug(similarProduct.name)}`" class="block">
                  <div class="relative overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                    <!-- Image -->
                    <div class="overflow-hidden bg-gray-100 aspect-square">
                      <img 
                        :src="getSimilarProductImage(similarProduct)" 
                        :alt="similarProduct.name"
                        class="object-cover object-center w-full h-full"
                      />
                    </div>
                    
                    <!-- Product Info -->
                    <div class="p-3">
                      <h3 class="text-sm font-medium text-gray-900 truncate font-heading">
                        {{ similarProduct.name }}
                      </h3>
                      <p class="mt-1 text-sm font-medium text-gray-900 font-body">
                        ${{ similarProduct.price.toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-8 h-8 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <p class="text-gray-600 font-body">Cargando producto...</p>
      </div>
    </div>

    <!-- Image Gallery Modal -->
    <ImageGalleryModal
      :is-open="showImageGallery"
      :images="product?.images || []"
      :initial-index="galleryInitialIndex"
      :alt="product?.name || ''"
      @close="closeImageGallery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import OptimizedImage from './OptimizedImage.vue';
import ImageGalleryModal from '../ui/ImageGalleryModal.vue';
import { useRoute } from 'vue-router';
import type { Product } from '../../types/products/product.types';
import type { Color } from '../../types/products/color.types';
import type { Size } from '../../types/products/size.types';
import { useCartStore } from '../../store/cart';
import { productsApi, masterDataApi } from '../../config/index';
import { useToast } from 'vue-toastification';

const route = useRoute();
const product = ref<Product | null>(null);
const selectedImage = ref(0);
const selectedColor = ref<Color | null>(null);
const selectedSize = ref<Size | null>(null);
const quantity = ref(1);
const allColors = ref<Color[]>([]);
const allSizes = ref<Size[]>([]);
const similarProducts = ref<Product[]>([]);
const cartStore = useCartStore();
const toast = useToast();

// Image Gallery Modal states
const showImageGallery = ref(false);
const galleryInitialIndex = ref(0);

// Computed properties
const mainImage = computed(() => {
  const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a';
  
  if (product.value?.images && product.value.images[selectedImage.value]) {
    return product.value.images[selectedImage.value].image_url;
  }
  return defaultImage;
});

// Available colors from product variants
const availableColors = computed(() => {
  if (!product.value?.variants || product.value.is_unique) return [];
  
  const colorIds = [...new Set(product.value.variants.map(v => v.color_id))];
  return allColors.value.filter(color => colorIds.includes(color.id));
});

// Available sizes from product variants
const availableSizes = computed(() => {
  if (!product.value?.variants || product.value.is_unique) return [];
  
  const sizeIds = [...new Set(product.value.variants.map(v => v.size_id))];
  return allSizes.value.filter(size => sizeIds.includes(size.id));
});

// Selected variant based on color and size selection
const selectedVariant = computed(() => {
  if (!product.value?.variants || product.value.is_unique) return null;
  if (!selectedColor.value || !selectedSize.value) return null;
  
  return product.value.variants.find(v => 
    v.color_id === selectedColor.value?.id && v.size_id === selectedSize.value?.id
  );
});

// Check if can add to cart
const canAddToCart = computed(() => {
  if (!product.value) return false;
  
  // For unique products (no variants)
  if (product.value.is_unique) {
    return (product.value.stock ?? 0) > 0;
  }
  
  // For products with variants
  if (selectedVariant.value) {
    return selectedVariant.value.stock > 0;
  }
  
  return false;
});

// Maximum quantity available
const maxQuantity = computed(() => {
  if (!product.value) return 1;
  
  if (product.value.is_unique) {
    return product.value.stock ?? 0;
  }
  
  if (selectedVariant.value) {
    return selectedVariant.value.stock;
  }
  
  return 1;
});

// Button text based on state
const buttonText = computed(() => {
  if (!product.value) return 'Cargando...';
  
  if (product.value.is_unique) {
    return (product.value.stock ?? 0) > 0 ? 'Agregar al carrito' : 'Sin stock';
  }
  
  if (!selectedColor.value || !selectedSize.value) {
    return 'Selecciona color y talle';
  }
  
  if (selectedVariant.value) {
    return selectedVariant.value.stock > 0 ? 'Agregar al carrito' : 'Sin stock';
  }
  
  return 'No disponible';
});

// Determinar si el producto estÃ¡ sin stock
const isOutOfStock = computed(() => {
  if (!product.value) return false;
  
  // Para productos Ãºnicos (is_unique = true), verificar el stock directo
  if (product.value.is_unique) {
    return (product.value.stock ?? 0) === 0;
  }
  
  // Para productos con variantes, verificar si todas las variantes tienen stock 0
  if (product.value.variants && product.value.variants.length > 0) {
    return product.value.variants.every(variant => variant.stock === 0);
  }
  
  // Si no hay variantes y no es Ãºnico, asumir que estÃ¡ disponible
  return false;
});

// Calculate discount percentage
const discountPercentage = computed(() => {
  if (!product.value || !product.value.has_discount || !product.value.discount_amount) {
    return 0;
  }
  
  return Math.round((product.value.discount_amount / product.value.price) * 100);
});

// Quantity functions
const incrementQuantity = () => {
  if (quantity.value < (maxQuantity.value ?? 1)) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Create URL-friendly slug from product name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[Ã¡Ã Ã¢Ã£]/g, 'a')
    .replace(/[Ã©Ã¨Ãª]/g, 'e')
    .replace(/[Ã­Ã¬Ã®]/g, 'i')
    .replace(/[Ã³Ã²Ã´Ãµ]/g, 'o')
    .replace(/[ÃºÃ¹Ã»]/g, 'u')
    .replace(/[Ã±]/g, 'n')
    .replace(/[Ã§]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Function to get similar product image
const getSimilarProductImage = (product: Product) => {
  const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a';
  
  if (product.images && product.images[0]) {
    return product.images[0].image_url;
  }
  return defaultImage;
};

// Function to load similar products
const loadSimilarProducts = async (categoria: string, currentProductId: number) => {
  try {
    const allProducts = await productsApi.getProducts();
    
    // Filter products by same category, excluding current product
    const filtered = allProducts.filter((p: Product) => 
      p.categoria === categoria && 
      p.id !== currentProductId &&
      p.estado === 'activo' // Only show active products
    );
    
    // Shuffle and take first 6 products
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    similarProducts.value = shuffled.slice(0, 6);
  } catch (error) {
    console.error('Error loading similar products:', error);
    similarProducts.value = [];
  }
};

onMounted(async () => {
  const productName = route.params.name as string;
  try {
    // Load all products and find by name slug
    const allProducts = await productsApi.getProducts();
    const foundProduct = allProducts.find((p: Product) => createSlug(p.name) === productName);
    
    if (!foundProduct) {
      console.error('Product not found:', productName);
      return;
    }
    
    product.value = foundProduct;
    
    // Load colors and sizes for variants
    if (product.value && !product.value.is_unique && product.value.variants) {
      const [colorsResponse, sizesResponse] = await Promise.all([
        masterDataApi.getColors(),
        masterDataApi.getSizes()
      ]);
      allColors.value = colorsResponse;
      allSizes.value = sizesResponse;
      
      // Auto-select first available color and size if available
      if (availableColors.value.length > 0) {
        selectedColor.value = availableColors.value[0];
      }
      if (availableSizes.value.length > 0) {
        selectedSize.value = availableSizes.value[0];
      }
    }

    // Load similar products by category
    if (product.value && product.value.categoria) {
      await loadSimilarProducts(product.value.categoria, product.value.id);
    }
  } catch (error) {
    console.error('Error loading product:', error);
  }
});

const addToCart = () => {
  if (!product.value) {
    return;
  }
  
  if (!canAddToCart.value) {
    // Check why we can't add to cart and show appropriate message
    if (product.value.is_unique) {
      if ((product.value.stock ?? 0) <= 0) {
        toast.warning('Este producto no tiene stock disponible');
      }
    } else {
      if (!selectedColor.value || !selectedSize.value) {
        toast.warning('Por favor selecciona color y talle');
      } else if (!selectedVariant.value || selectedVariant.value.stock <= 0) {
        toast.warning('La combinaciÃ³n seleccionada no tiene stock disponible');
      }
    }
    return;
  }
  
  try {
    // For unique products
    if (product.value.is_unique) {
      cartStore.addToCart(
        product.value,
        quantity.value,
        undefined,
        {
          color: selectedColor.value || undefined,
          size: selectedSize.value || undefined
        }
      );
    } else {
      // For products with variants
      if (selectedVariant.value && selectedColor.value && selectedSize.value) {
        cartStore.addToCart(
          product.value,
          quantity.value,
          {
            variant: selectedVariant.value,
            color: selectedColor.value,
            size: selectedSize.value
          }
        );
      } else {
        toast.warning('Por favor selecciona color y talle');
        return;
      }
    }
    
    // Reset quantity to 1 after adding to cart
    quantity.value = 1;
    
  } catch (error) {
    console.error('Error agregando producto al carrito:', error);
    toast.error('Error al agregar el producto al carrito');
  }
};

// Image Gallery Modal functions
const openImageGallery = (index: number) => {
  galleryInitialIndex.value = index;
  showImageGallery.value = true;
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
};

const closeImageGallery = () => {
  showImageGallery.value = false;
  // Restore body scroll
  document.body.style.overflow = 'auto';
};
</script>

