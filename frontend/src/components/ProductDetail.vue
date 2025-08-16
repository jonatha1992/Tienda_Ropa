<template>
  <div class="min-h-screen bg-white">
    <div v-if="product" class="mx-auto max-w-7xl">
      <!-- Desktop Layout -->
      <div class="hidden lg:flex lg:gap-x-12 lg:px-8 lg:py-8 lg:max-w-6xl lg:mx-auto">
        <!-- Left Side - Images (más compacto) -->
        <div class="flex gap-4 flex-shrink-0">
          <!-- Main Image (más grande) -->
          <div class="w-[26rem] h-[32rem] overflow-hidden bg-gray-100 rounded-lg flex-shrink-0 border-4 border-white shadow-lg ring-1 ring-gray-200">
            <img 
              :src="mainImage" 
              :alt="product.name" 
              loading="eager"
              class="object-cover object-center w-full h-full"
            />
          </div>
          
          <!-- Thumbnail Images (más grandes) -->
          <div class="flex flex-col gap-2 w-20">
            <div 
              v-for="(image, index) in product.images" 
              :key="index"
              @click="selectedImage = index"
              class="w-20 h-20 overflow-hidden transition-colors bg-gray-100 border-2 rounded-md cursor-pointer"
              :class="selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'"
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

        <!-- Right Side - Product Info (más cerca) -->
        <div class="flex-1 pl-6">
          <!-- Product Title -->
          <h1 class="mb-2 text-2xl font-light text-gray-900">{{ product.name }}</h1>
          
          <!-- Price -->
          <div class="mb-6">
            <span class="text-2xl font-light text-gray-900">${{ product.price.toLocaleString() }}</span>
          </div>

          <!-- Color Selection -->
          <div v-if="availableColors.length > 0" class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-900">Color</h3>
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
            <h3 class="mb-3 text-sm font-medium text-gray-900">Talle</h3>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="size in availableSizes"
                :key="size.id"
                @click="selectedSize = size"
                class="px-4 py-2 text-sm font-medium transition-colors border rounded-md"
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
            <p class="text-sm text-gray-600">
              Stock disponible: {{ selectedVariant.stock }}
            </p>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="mb-6">
            <!-- Quantity Selector -->
            <div class="mb-4">
              <h3 class="mb-2 text-sm font-medium text-gray-900">Cantidad</h3>
              <div class="flex items-center w-32 border border-gray-300 rounded-md">
                <button 
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input 
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity ?? undefined"
                  class="flex-1 px-2 py-2 text-center border-none focus:ring-0 focus:outline-none"
                />
                <button 
                  @click="incrementQuantity"
                  :disabled="quantity >= (maxQuantity ?? 1)"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button 
              @click="addToCart"
              :disabled="!canAddToCart"
              class="w-full px-6 py-3 text-sm font-medium transition-colors rounded-md"
              :class="canAddToCart 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
            >
              {{ buttonText }}
            </button>
          </div>

          <!-- Product Description -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-900">Descripción</h3>
            <div class="text-sm prose text-gray-600" v-html="product.description"></div>
          </div>

          <!-- Product Details -->
          <div class="mt-8 space-y-2">
            <div class="flex">
              <span class="w-24 text-sm font-medium text-gray-900">Categoría:</span>
              <span class="text-sm text-gray-600">{{ product.categoria }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm font-medium text-gray-900">Género:</span>
              <span class="text-sm text-gray-600">{{ product.genero }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm font-medium text-gray-900">Estado:</span>
              <span class="text-sm text-gray-600">{{ product.estado }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="lg:hidden">
        <!-- Mobile Images -->
        <div class="px-4 py-6">
          <div class="mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-square">
            <img 
              :src="mainImage" 
              :alt="product.name" 
              loading="eager"
              class="object-cover object-center w-full h-full"
            />
          </div>
          
          <!-- Mobile Thumbnail Scroll -->
          <div class="flex pb-4 space-x-3 overflow-x-auto">
            <div 
              v-for="(image, index) in product.images" 
              :key="index"
              @click="selectedImage = index"
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
          <h1 class="mb-2 text-xl font-light text-gray-900">{{ product.name }}</h1>
          <div class="mb-4">
            <span class="text-xl font-light text-gray-900">${{ product.price.toLocaleString() }}</span>
          </div>

          <!-- Mobile Color Selection -->
          <div v-if="availableColors.length > 0" class="mb-4">
            <h3 class="mb-2 text-sm font-medium text-gray-900">Color</h3>
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
            <h3 class="mb-2 text-sm font-medium text-gray-900">Talle</h3>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="size in availableSizes"
                :key="size.id"
                @click="selectedSize = size"
                class="px-2 py-1 text-xs font-medium transition-colors border rounded"
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
              <h3 class="mb-2 text-sm font-medium text-gray-900">Cantidad</h3>
              <div class="flex items-center border border-gray-300 rounded-md w-28">
                <button 
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input 
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity ?? undefined"
                  class="flex-1 px-1 py-1 text-sm text-center border-none focus:ring-0 focus:outline-none"
                />
                <button 
                  @click="incrementQuantity"
                  :disabled="quantity >= (maxQuantity ?? 1)"
                  class="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Mobile Add to Cart Button -->
            <button 
              @click="addToCart"
              :disabled="!canAddToCart"
              class="w-full px-6 py-3 text-sm font-medium transition-colors rounded-md"
              :class="canAddToCart 
                ? 'bg-black text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
            >
              {{ buttonText }}
            </button>
          </div>

          <!-- Mobile Description -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-900">Descripción</h3>
            <div class="text-sm text-gray-600" v-html="product.description"></div>
          </div>
        </div>
      </div>

      <!-- Productos Similares Section -->
      <div v-if="similarProducts.length > 0" class="px-8 py-12 bg-gray-50">
        <div class="max-w-6xl mx-auto">
          <h2 class="mb-8 text-2xl font-light text-gray-900 text-center">Productos Similares</h2>
          
          <!-- Desktop Grid -->
          <div class="hidden md:grid md:grid-cols-4 md:gap-6">
            <div 
              v-for="similarProduct in similarProducts.slice(0, 4)" 
              :key="similarProduct.id"
              class="group"
            >
              <router-link :to="`/product/${similarProduct.id}`" class="block">
                <div class="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <!-- Image -->
                  <div class="aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      :src="getSimilarProductImage(similarProduct)" 
                      :alt="similarProduct.name"
                      loading="eager"
                      class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <!-- Product Info -->
                  <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                      {{ similarProduct.name }}
                    </h3>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      ${{ similarProduct.price.toLocaleString() }}
                    </p>
                    <p v-if="similarProduct.categoria" class="mt-1 text-xs text-gray-500 uppercase tracking-wide">
                      {{ similarProduct.categoria }}
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Mobile Scroll -->
          <div class="md:hidden">
            <div class="flex space-x-4 overflow-x-auto pb-4">
              <div 
                v-for="similarProduct in similarProducts.slice(0, 6)" 
                :key="similarProduct.id"
                class="flex-shrink-0 w-48 group"
              >
                <router-link :to="`/product/${similarProduct.id}`" class="block">
                  <div class="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
                    <!-- Image -->
                    <div class="aspect-square bg-gray-100 overflow-hidden">
                      <img 
                        :src="getSimilarProductImage(similarProduct)" 
                        :alt="similarProduct.name"
                        class="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    <!-- Product Info -->
                    <div class="p-3">
                      <h3 class="text-sm font-medium text-gray-900 truncate">
                        {{ similarProduct.name }}
                      </h3>
                      <p class="mt-1 text-sm font-medium text-gray-900">
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
        <p class="text-gray-600">Cargando producto...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Product, Color, Size } from '../types';
import { useCartStore } from '../store/cart';
import { productsApi, masterDataApi } from '../config/index';
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
  const productId = route.params.id;
  try {
    // Load product data
    product.value = await productsApi.getProduct(Number(productId));
    
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
  if (!canAddToCart.value || !product.value) return;
  
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
      }
    }
    
    // Reset quantity to 1 after adding to cart
    quantity.value = 1;
    
    // Show success message
    toast.success(`¡${product.value.name} agregado al carrito!`);
    
  } catch (error) {
    console.error('Error agregando producto al carrito:', error);
    // Show error message
    toast.error('Error al agregar el producto al carrito');
  }
};
</script>
