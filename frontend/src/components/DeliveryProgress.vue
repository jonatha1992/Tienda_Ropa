<template>
  <div class="w-full max-w-md mx-auto py-6">
    <!-- Progress Steps -->
    <div class="flex items-center justify-between mb-8">
      <!-- Step 1: Carrito -->
      <div class="flex flex-col items-center">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
          :class="getStepClasses(1)"
        >
          <CheckIcon v-if="currentStep > 1" class="w-4 h-4" />
          <span v-else>1</span>
        </div>
        <span class="text-xs mt-2 text-gray-600">Carrito</span>
      </div>

      <!-- Progress Line 1 -->
      <div class="flex-1 h-0.5 mx-4 bg-gray-200 relative">
        <div 
          class="h-full bg-gray-800 transition-all duration-500"
          :style="{ width: currentStep > 1 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 2: Entrega -->
      <div class="flex flex-col items-center">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
          :class="getStepClasses(2)"
        >
          <CheckIcon v-if="currentStep > 2" class="w-4 h-4" />
          <span v-else>2</span>
        </div>
        <span class="text-xs mt-2 text-gray-600">Entrega</span>
      </div>

      <!-- Progress Line 2 -->
      <div class="flex-1 h-0.5 mx-4 bg-gray-200 relative">
        <div 
          class="h-full bg-gray-800 transition-all duration-500"
          :style="{ width: currentStep > 2 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 3: Pago -->
      <div class="flex flex-col items-center">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
          :class="getStepClasses(3)"
        >
          <CheckIcon v-if="currentStep > 3" class="w-4 h-4" />
          <span v-else>3</span>
        </div>
        <span class="text-xs mt-2 text-gray-600">Pago</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

interface Props {
  currentStep: number
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 1
})

const getStepClasses = (step: number) => {
  if (props.currentStep > step) {
    // Completed step
    return 'bg-gray-800 text-white'
  } else if (props.currentStep === step) {
    // Current step
    return 'bg-gray-800 text-white ring-2 ring-gray-800 ring-offset-2'
  } else {
    // Future step
    return 'bg-gray-200 text-gray-500'
  }
}
</script>

<style scoped>
/* Additional animations if needed */
.step-transition {
  transition: all 0.3s ease-in-out;
}
</style>
