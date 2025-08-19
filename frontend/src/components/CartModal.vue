<template>
  <Teleport to="body">
    <!-- Modal Overlay -->
    <Transition name="modal">
      <div
        v-if="isCartModalOpen"
        class="fixed inset-0 z-50 overflow-hidden"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeCartModal"
        ></div>
        
        <!-- Modal Panel -->
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <!-- Close Button -->
          <button
            @click="closeCartModal"
            class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Cart Content -->
          <div class="h-full overflow-y-auto">
            <ShoppingCart :is-modal="true" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useCartModal } from '../composables/useCartModal'
import ShoppingCart from './ShoppingCart.vue'

const { isCartModalOpen, closeCartModal } = useCartModal()
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease-in-out;
}

.modal-enter-active .absolute.right-0 {
  transition: transform 0.3s ease-in-out;
}

.modal-leave-active .absolute.right-0 {
  transition: transform 0.3s ease-in-out;
}

.modal-enter-from .absolute.right-0 {
  transform: translateX(100%);
}

.modal-leave-to .absolute.right-0 {
  transform: translateX(100%);
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>