<template>
  <div
    v-if="isNotificationVisible"
    class="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm w-80"
    style="z-index: 9999;"
  >
        <!-- Close Button -->
        <button
          @click="hideNotification"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Product Info -->
        <div v-if="productData" class="flex items-center space-x-3 mb-3">
          <div class="flex-shrink-0">
            <img 
              :src="productData.image" 
              :alt="productData.name"
              class="w-12 h-12 rounded object-cover border border-gray-200" 
            />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-body font-medium text-gray-900 text-sm truncate">
              {{ productData.name }}
            </h4>
            <!-- Price info with discount indication -->
            <div class="font-body text-sm text-gray-600">
              <span class="font-medium">{{ productData.quantity }} x ${{ productData.price.toLocaleString() }}</span>
              <span v-if="productData.hasDiscount" class="ml-2 text-xs text-green-600 font-medium">
                ¡Con descuento!
              </span>
            </div>
            <!-- Variant info if available -->
            <p v-if="productData.variant" class="font-body text-xs text-gray-500 mt-1">
              {{ productData.variant.color }} • Talle {{ productData.variant.size }}
            </p>
            <!-- Category info if available -->
            <p v-if="productData.category" class="font-body text-xs text-gray-400 mt-0.5 uppercase tracking-wide">
              {{ productData.category }}
            </p>
          </div>
        </div>
        
        <!-- Success Message with icon -->
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <p class="font-body text-green-600 font-medium text-sm">¡Agregado al carrito!</p>
        </div>
        
        <!-- Cart Summary with improved styling -->
        <div class="bg-gray-50 rounded-lg p-3 mb-3">
          <div class="flex justify-between items-center font-body text-sm">
            <span class="text-gray-600">Total ({{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'producto' : 'productos' }}):</span>
            <span class="font-semibold text-gray-900">${{ cartStore.totalPrice.toLocaleString() }}</span>
          </div>
          <div v-if="cartStore.totalSavings > 0" class="flex justify-between items-center font-body text-xs mt-1">
            <span class="text-green-600">Ahorros:</span>
            <span class="font-medium text-green-600">-${{ cartStore.totalSavings.toLocaleString() }}</span>
          </div>
        </div>
        
        <!-- Ver Carrito Button -->
        <button 
          @click="handleViewCart"
          class="w-full bg-black text-white py-2.5 rounded-md  font-medium hover:bg-gray-800 transition-colors text-sm flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"></path>
          </svg>
          <span class="text-white">Ver carrito</span>
        </button>
  </div>
</template>

<script setup lang="ts">
import { useCartNotification } from '../composables/useCartNotification'
import { useCartModal } from '../composables/useCartModal'
import { useCartStore } from '../store/cart'

const { isNotificationVisible, productData, hideNotification } = useCartNotification()
const { openCartModal } = useCartModal()
const cartStore = useCartStore()

const handleViewCart = () => {
  hideNotification()
  openCartModal()
}
</script>

<style scoped>
.notification-enter-active, .notification-leave-active {
  transition: all 0.2s ease-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}

/* Ensure notification is always visible when active */
.notification-enter-active,
.notification-leave-active {
  pointer-events: auto;
}
</style>