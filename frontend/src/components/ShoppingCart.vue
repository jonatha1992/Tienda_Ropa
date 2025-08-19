<template>
  <div :class="isModal ? 'bg-white h-full' : 'bg-white min-h-screen'">
    <div :class="isModal ? 'px-4 py-6' : 'max-w-4xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8'">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-heading font-light tracking-tight text-gray-900">Carrito de compras</h1>
        <p v-if="!cartStore.isEmpty" class="mt-2 text-sm font-body text-body-text">
          {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'producto' : 'productos' }} en tu carrito
        </p>
      </div>

      <!-- Cart Items -->
      <div v-if="!cartStore.isEmpty" class="space-y-6">
        <!-- Items List -->
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
          <ul class="divide-y divide-gray-200">
            <li v-for="item in cartStore.items" :key="item.id" class="p-6">
              <div class="flex items-start space-x-4">
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <div class="h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                    <img 
                      :src="item.product.images[0]?.image_url || '/placeholder-image.jpg'" 
                      :alt="item.product.name" 
                      class="h-full w-full object-cover object-center"
                    >
                  </div>
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-base font-heading font-medium text-gray-900">
                        <router-link 
                          :to="`/product/${item.product.id}`" 
                          class="hover:text-gray-700 font-body"
                        >
                          {{ item.product.name }}
                        </router-link>
                      </h3>
                      
                      <!-- Variant Info -->
                      <div v-if="item.variant" class="mt-1 text-sm font-body text-body-text">
                        <span class="font-body">{{ item.variant.color.name }}</span>
                        <span class="mx-1 font-body">•</span>
                        <span class="font-body">Talle {{ item.variant.size.name }}</span>
                      </div>
                      
                      <!-- Unique Product Info -->
                      <div v-else-if="item.selectedColor || item.selectedSize" class="mt-1 text-sm font-body text-body-text">
                        <span v-if="item.selectedColor" class="font-body">{{ item.selectedColor.name }}</span>
                        <span v-if="item.selectedColor && item.selectedSize" class="mx-1 font-body">•</span>
                        <span v-if="item.selectedSize" class="font-body">Talle {{ item.selectedSize.name }}</span>
                      </div>

                      <!-- Price -->
                      <div class="mt-2 flex items-center space-x-2">
                        <span class="text-lg font-body font-medium text-body-text">
                          ${{ cartStore.getItemPrice(item).toLocaleString() }}
                        </span>
                        <span v-if="item.product.has_discount" class="text-sm font-body text-body-text line-through">
                          ${{ item.product.price.toLocaleString() }}
                        </span>
                        <span v-if="item.product.has_discount" class="text-sm font-body text-red-600 font-medium">
                          -{{ item.product.discount_percentage }}%
                        </span>
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <button
                      @click="cartStore.removeFromCart(item.id)"
                      class="ml-4 text-gray-400 hover:text-gray-500"
                      title="Eliminar producto"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="mt-4 flex items-center justify-between">
                    <div class="flex items-center border border-gray-300 rounded-md">
                      <button
                        @click="updateQuantity(item, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="px-3 py-1 font-body text-body-text hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <input
                        :value="item.quantity"
                        @input="updateQuantity(item, parseInt(($event.target as HTMLInputElement).value))"
                        type="number"
                        min="1"
                        class="w-16 px-2 py-1 font-body text-center border-0 focus:ring-0"
                      >
                      <button
                        @click="updateQuantity(item, item.quantity + 1)"
                        class="px-3 py-1 font-body text-body-text hover:text-gray-800"
                      >
                        +
                      </button>
                    </div>

                    <!-- Item Total -->
                    <div class="text-right">
                      <p class="text-lg font-body font-medium text-body-text">
                        ${{ cartStore.getItemTotal(item).toLocaleString() }}
                      </p>
                      <p v-if="item.quantity > 1" class="text-sm font-body text-body-text">
                        ${{ cartStore.getItemPrice(item).toLocaleString() }} c/u
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Cart Summary -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-heading font-medium text-gray-900 mb-4">Resumen del pedido</h3>
          
          <div class="space-y-2">
            <!-- Subtotal -->
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 font-body">Subtotal ({{ cartStore.itemCount }} productos)</span>
              <span class="text-gray-900 font-body">
                ${{ (cartStore.totalSavings > 0 ? cartStore.totalOriginalPrice : cartStore.totalPrice).toLocaleString() }}
              </span>
            </div>

            <!-- Discount -->
            <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-sm">
              <span class="text-red-600 font-body">Descuentos</span>
              <span class="text-red-600 font-body">-${{ cartStore.totalSavings.toLocaleString() }}</span>
            </div>

            <!-- Shipping -->
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 font-body">Envío</span>
              <span class="text-gray-900 font-body">Calculado en checkout</span>
            </div>

            <!-- Total -->
            <div class="border-t border-gray-200 pt-2">
              <div class="flex justify-between">
                <span class="text-lg font-body font-medium text-gray-900">Total</span>
                <span class="text-lg font-body font-medium text-gray-900">
                  ${{ cartStore.totalPrice.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Auth Notice -->
          <div v-if="!authStore.isAuthenticated" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-body text-blue-700">
                  Necesitas <strong>iniciar sesión</strong> para proceder con la compra.
                </p>
              </div>
            </div>
          </div>

          <!-- Checkout Button -->
          <div class="mt-6">
            <button
              @click="proceedToCheckout"
              class="w-full bg-black text-white py-3 px-4 rounded-md font-body font-medium hover:bg-gray-800 transition-colors"
            >
              {{ authStore.isAuthenticated ? 'Proceder al checkout' : 'Iniciar sesión y continuar' }}
            </button>
          </div>

          <!-- Continue Shopping -->
          <div class="mt-4 text-center">
            <router-link
              to="/shop"
              class="text-sm font-body text-gray-600 hover:text-gray-800"
            >
              ← Continuar comprando
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-heading font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p class="text-gray-600 font-body mb-6">Agrega algunos productos para comenzar</p>
        <router-link
          to="/shop"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-body font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          Explorar productos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, withDefaults } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore, type CartItem } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { useToast } from 'vue-toastification';

// Props
interface Props {
  isModal?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isModal: false
})

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

onMounted(() => {
  // Load cart from localStorage when component mounts
  cartStore.loadFromStorage();
  // Validate stock availability
  cartStore.validateStock();
});

const updateQuantity = (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1) return;
  
  // Check stock availability
  let maxStock = 0;
  if (item.product.is_unique) {
    maxStock = item.product.stock || 0;
  } else if (item.variant) {
    maxStock = item.variant.variant.stock;
  }
  
  if (newQuantity > maxStock) {
    toast.warning(`Solo hay ${maxStock} unidades disponibles`);
    return;
  }
  
  cartStore.updateQuantity(item.id, newQuantity);
};

const proceedToCheckout = () => {
  // Validate stock before proceeding
  cartStore.validateStock();
  
  if (cartStore.isEmpty) {
    toast.error('Tu carrito está vacío');
    return;
  }
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    toast.warning('Debes iniciar sesión para continuar con la compra');
    router.push('/auth');
    return;
  }
  
  // Navigate to checkout page
  router.push('/checkout');
};
</script>
