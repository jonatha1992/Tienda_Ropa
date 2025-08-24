<template>
  <div class="w-full max-w-md mx-auto py-6">
    <!-- Progress Steps -->
    <div class="flex items-center justify-between mb-8">
      <!-- Step 1: Carrito -->
      <div class="flex flex-col items-center">
        <button 
          @click="$emit('go-to-step', 1)"
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 cursor-pointer hover:shadow-lg"
          :class="getStepClasses(1)"
        >
          <CheckIcon v-if="currentStep > 1" class="w-4 h-4" />
          <ShoppingCartIcon v-else-if="currentStep === 1" class="w-4 h-4" />
          <span class="font-body" v-else>1</span>
        </button>
        <span class="font-body text-xs mt-2 text-body-text">Carrito</span>
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
        <button 
          @click="$emit('go-to-step', 2)"
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 cursor-pointer hover:shadow-lg"
          :class="getStepClasses(2)"
        >
          <CheckIcon v-if="currentStep > 2" class="w-4 h-4" />
          <TruckIcon v-else-if="currentStep === 2" class="w-4 h-4" />
          <span class="font-body" v-else>2</span>
        </button>
        <span class="font-body text-xs mt-2 text-body-text">Entrega</span>
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
          <CreditCardIcon v-else-if="currentStep === 3" class="w-4 h-4" />
          <span class="font-body" v-else>3</span>
        </div>
        <span class="font-body text-xs mt-2 text-body-text">Pago</span>
      </div>
    </div>

    <!-- Delivery Method Selection (only show when on step 2) -->
    <div v-if="currentStep === 2" class="mt-8 bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4 font-heading">Seleccionar Método de Entrega</h3>
      
      <div class="space-y-4">
        <!-- Envío por Andreani -->
        <div class="flex items-center justify-between p-4 border rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
             :class="selectedDeliveryMethod === 'envio_andreani' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('envio_andreani')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'envio_andreani'"
                   class="h-4 w-4 text-gray-800 border-gray-300 focus:ring-gray-500">
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">Envío por Andreani</div>
              <div class="text-sm text-gray-500">Entrega a domicilio en 3-5 días hábiles</div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">$500</div>
        </div>

        <!-- Envío por Correo Argentino -->
        <div class="flex items-center justify-between p-4 border rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
             :class="selectedDeliveryMethod === 'envio_correo' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('envio_correo')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'envio_correo'"
                   class="h-4 w-4 text-gray-800 border-gray-300 focus:ring-gray-500">
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">Envío por Correo Argentino</div>
              <div class="text-sm text-gray-500">Entrega a domicilio en 5-8 días hábiles</div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">$400</div>
        </div>

        <!-- Retiro en Local -->
        <div class="flex items-center justify-between p-4 border rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
             :class="selectedDeliveryMethod === 'retiro_local' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('retiro_local')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'retiro_local'"
                   class="h-4 w-4 text-gray-800 border-gray-300 focus:ring-gray-500">
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">Retiro en Local</div>
              <div class="text-sm text-gray-500">Coordinar horario de retiro con el vendedor</div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">Gratis</div>
        </div>
      </div>

      <!-- Contact Info for Local Pickup -->
      <div v-if="selectedDeliveryMethod === 'retiro_local'" 
           class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-blue-900">Coordinar Retiro</h4>
            <p class="text-sm text-blue-700 mt-1">
              Después de completar tu compra, te contactaremos por WhatsApp para coordinar el horario de retiro.
            </p>
            <div class="mt-2 text-sm text-blue-700">
              <strong>Contacto:</strong> +54 9 11 1234-5678<br>
              <strong>Dirección:</strong> Av. Ejemplo 123, CABA
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Cost Summary -->
      <div v-if="selectedDeliveryMethod" class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-900">Costo de envío:</span>
          <span class="text-sm font-medium text-gray-900">
            {{ getDeliveryCost() === 0 ? 'Gratis' : `$${getDeliveryCost()}` }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CheckIcon, ShoppingCartIcon, TruckIcon, CreditCardIcon } from '@heroicons/vue/24/solid'

interface Props {
  currentStep: number
  initialDeliveryMethod?: string
}

interface DeliveryData {
  method: string
  cost: number
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 1,
  initialDeliveryMethod: 'envio_andreani'
})

// Define emits for step navigation and delivery method changes
const emit = defineEmits<{
  'go-to-step': [step: number]
  'delivery-method-changed': [data: DeliveryData]
}>()

// State
const selectedDeliveryMethod = ref<string>(props.initialDeliveryMethod || 'envio_andreani')

// Delivery costs mapping
const deliveryCosts = {
  'envio_andreani': 500,
  'envio_correo': 400,
  'retiro_local': 0
}

// Methods
const selectDeliveryMethod = (method: string) => {
  selectedDeliveryMethod.value = method
  const cost = deliveryCosts[method as keyof typeof deliveryCosts] || 0
  emit('delivery-method-changed', { method, cost })
}

const getDeliveryCost = () => {
  return deliveryCosts[selectedDeliveryMethod.value as keyof typeof deliveryCosts] || 0
}

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

// Watch for initial delivery method changes
watch(() => props.initialDeliveryMethod, (newMethod) => {
  if (newMethod) {
    selectedDeliveryMethod.value = newMethod
  }
}, { immediate: true })

// Emit initial delivery method on mount
const cost = deliveryCosts[selectedDeliveryMethod.value as keyof typeof deliveryCosts] || 0
emit('delivery-method-changed', { method: selectedDeliveryMethod.value, cost })
</script>

<style scoped>
/* Additional animations if needed */
.step-transition {
  transition: all 0.3s ease-in-out;
}
</style>
