<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
        v-if="isNotificationVisible"
        class="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm w-80"
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
            <p class="font-body text-sm text-gray-600">
              {{ productData.quantity }} x ${{ productData.price.toLocaleString() }}
            </p>
            <!-- Variant info if available -->
            <p v-if="productData.variant" class="font-body text-xs text-gray-500">
              {{ productData.variant.color }} • Talle {{ productData.variant.size }}
            </p>
          </div>
        </div>
        
        <!-- Success Message -->
        <p class="font-body text-green-600 font-medium mb-3 text-sm">¡Agregado al carrito!</p>
        
        <!-- Cart Summary -->
        <div class="flex justify-between items-center mb-3 font-body text-sm">
          <span class="text-gray-600">Total ({{ cartStore.itemCount }} productos):</span>
          <span class="font-medium text-gray-900">${{ cartStore.totalPrice.toLocaleString() }}</span>
        </div>
        
        <!-- Ver Carrito Button -->
        <button 
          @click="handleViewCart"
          class="w-full bg-gray-600 text-white py-2 rounded-md font-body font-medium hover:bg-gray-700 transition-colors text-sm"
        >
          Ver carrito
        </button>
      </div>
    </Transition>
  </Teleport>
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
  transition: all 0.3s ease-in-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>