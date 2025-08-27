<template>
  <div class="w-full max-w-2xl py-6 mx-auto">
    <!-- Progress Steps -->
    <div class="flex items-center justify-between mb-8">
      <!-- Step 1: Carrito -->
      <div class="flex flex-col items-center">
        <button 
          @click="$emit('go-to-step', 1)"
          class="flex items-center justify-center w-8 h-8 text-sm font-medium transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg"
          :class="getStepClasses(1)"
        >
          <CheckIcon v-if="currentStep > 1" class="w-4 h-4" />
          <ShoppingCartIcon v-else-if="currentStep === 1" class="w-4 h-4" />
          <span class="font-body" v-else>1</span>
        </button>
        <span class="mt-2 text-xs font-body text-body-text">Carrito</span>
      </div>

      <!-- Progress Line 1 -->
      <div class="flex-1 h-0.5 mx-2 bg-gray-200 relative">
        <div 
          class="h-full transition-all duration-500 bg-gray-800"
          :style="{ width: currentStep > 1 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 2: Contacto -->
      <div class="flex flex-col items-center">
        <button 
          @click="$emit('go-to-step', 2)"
          class="flex items-center justify-center w-8 h-8 text-sm font-medium transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg"
          :class="getStepClasses(2)"
        >
          <CheckIcon v-if="currentStep > 2" class="w-4 h-4" />
          <UserIcon v-else-if="currentStep === 2" class="w-4 h-4" />
          <span class="font-body" v-else>2</span>
        </button>
        <span class="mt-2 text-xs font-body text-body-text">Contacto</span>
      </div>

      <!-- Progress Line 2 -->
      <div class="flex-1 h-0.5 mx-2 bg-gray-200 relative">
        <div 
          class="h-full transition-all duration-500 bg-gray-800"
          :style="{ width: currentStep > 2 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 3: Entrega -->
      <div class="flex flex-col items-center">
        <button 
          @click="$emit('go-to-step', 3)"
          class="flex items-center justify-center w-8 h-8 text-sm font-medium transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg"
          :class="getStepClasses(3)"
        >
          <CheckIcon v-if="currentStep > 3" class="w-4 h-4" />
          <TruckIcon v-else-if="currentStep === 3" class="w-4 h-4" />
          <span class="font-body" v-else>3</span>
        </button>
        <span class="mt-2 text-xs font-body text-body-text">Entrega</span>
      </div>

      <!-- Progress Line 3 -->
      <div class="flex-1 h-0.5 mx-2 bg-gray-200 relative">
        <div 
          class="h-full transition-all duration-500 bg-gray-800"
          :style="{ width: currentStep > 3 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 4: Pago -->
      <div class="flex flex-col items-center">
        <div 
          class="flex items-center justify-center w-8 h-8 text-sm font-medium transition-all duration-300 rounded-full"
          :class="getStepClasses(4)"
        >
          <CheckIcon v-if="currentStep > 4" class="w-4 h-4" />
          <CreditCardIcon v-else-if="currentStep === 4" class="w-4 h-4" />
          <span class="font-body" v-else>4</span>
        </div>
        <span class="mt-2 text-xs font-body text-body-text">Pago</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { CheckIcon, ShoppingCartIcon, TruckIcon, CreditCardIcon, UserIcon } from '@heroicons/vue/24/solid'

interface Props {
  currentStep: number
}

const props = defineProps<Props>()

// Define emits for step navigation
const emit = defineEmits<{
  'go-to-step': [step: number]
}>()

const getStepClasses = (step: number) => {
  if (props.currentStep > step) {
    // Completed step
    return 'bg-gray-800 text-white'
  } else if (props.currentStep === step) {
    // Current step
    return 'bg-gray-800 text-white ring-2 ring-gray-800 ring-offset-2'
  } else {
    // Future step
    return 'bg-gray-200 text-white'
  }
}
</script>

<style scoped>
/* Additional animations if needed */
.step-transition {
  transition: all 0.3s ease-in-out;
}
</style>

