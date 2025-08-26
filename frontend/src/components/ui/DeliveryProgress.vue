<template>
  <div class="w-full max-w-md py-6 mx-auto">
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
      <div class="flex-1 h-0.5 mx-4 bg-gray-200 relative">
        <div 
          class="h-full transition-all duration-500 bg-gray-800"
          :style="{ width: currentStep > 1 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 2: Entrega -->
      <div class="flex flex-col items-center">
        <button 
          @click="$emit('go-to-step', 2)"
          class="flex items-center justify-center w-8 h-8 text-sm font-medium transition-all duration-300 rounded-full cursor-pointer hover:shadow-lg"
          :class="getStepClasses(2)"
        >
          <CheckIcon v-if="currentStep > 2" class="w-4 h-4" />
          <TruckIcon v-else-if="currentStep === 2" class="w-4 h-4" />
          <span class="font-body" v-else>2</span>
        </button>
        <span class="mt-2 text-xs font-body text-body-text">Entrega</span>
      </div>

      <!-- Progress Line 2 -->
      <div class="flex-1 h-0.5 mx-4 bg-gray-200 relative">
        <div 
          class="h-full transition-all duration-500 bg-gray-800"
          :style="{ width: currentStep > 2 ? '100%' : '0%' }"
        ></div>
      </div>

      <!-- Step 3: Pago -->
      <div class="flex flex-col items-center">
        <div 
          class="flex items-center justify-center w-8 h-8 text-sm font-medium transition-all duration-300 rounded-full"
          :class="getStepClasses(3)"
        >
          <CheckIcon v-if="currentStep > 3" class="w-4 h-4" />
          <CreditCardIcon v-else-if="currentStep === 3" class="w-4 h-4" />
          <span class="font-body" v-else>3</span>
        </div>
        <span class="mt-2 text-xs font-body text-body-text">Pago</span>
      </div>
    </div>

    <!-- Delivery Method Selection (only show when on step 2) -->
    <div v-if="currentStep === 2" class="p-6 mt-8 bg-white border border-gray-200 rounded-lg">
      <h3 class="mb-4 text-lg font-medium text-gray-900 font-heading">Seleccionar Metodo de Entrega</h3>
      
      <!-- Loading State -->
      <div v-if="isLoadingQuotes" class="py-4 text-center">
        <div class="inline-flex items-center">
          <svg class="w-5 h-5 mr-3 -ml-1 text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm text-gray-600">Cotizando envÃ­os...</span>
        </div>
      </div>

      <!-- Error/Warning Message -->
      <div v-if="quotesError && !isLoadingQuotes" class="p-3 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p class="ml-2 text-sm text-yellow-800">{{ quotesError }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <!-- EnvÃ­o por Andreani -->
        <div class="flex items-center justify-between p-4 transition-colors border rounded-lg cursor-pointer hover:border-gray-300"
             :class="selectedDeliveryMethod === 'envio_andreani' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('envio_andreani')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'envio_andreani'"
                   class="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500">
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">Envio por Andreani</div>
              <div class="text-sm text-gray-500">
                {{ getShippingOption('andreani')?.estimated_delivery_text || 'Entrega a domicilio en 3-5 dias habiles' }}
              </div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">
            ${{ deliveryCosts['envio_andreani']?.toLocaleString() || '500' }}
          </div>
        </div>

        <!-- EnvÃ­o por Correo Argentino -->
        <div class="flex items-center justify-between p-4 transition-colors border rounded-lg cursor-pointer hover:border-gray-300"
             :class="selectedDeliveryMethod === 'envio_correo' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('envio_correo')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'envio_correo'"
                   class="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500">
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">Envio por Correo Argentino</div>
              <div class="text-sm text-gray-500">
                {{ getShippingOption('correo_argentino')?.estimated_delivery_text || 'Entrega a domicilio en 5-8 dias habiles' }}
              </div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">
            ${{ deliveryCosts['envio_correo']?.toLocaleString() || '400' }}
          </div>
        </div>

        <!-- EnvÃ­o por OCA (mostrar solo si hay cotizaciÃ³n disponible) -->
        <div v-if="getShippingOption('oca') || shippingOptions.length === 0"
             class="flex items-center justify-between p-4 transition-colors border rounded-lg cursor-pointer hover:border-gray-300"
             :class="selectedDeliveryMethod === 'envio_oca' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('envio_oca')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'envio_oca'"
                   class="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500">
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">Envio por OCA</div>
              <div class="text-sm text-gray-500">
                {{ getShippingOption('oca')?.estimated_delivery_text || 'Entrega a domicilio en 4-6 dias habiles' }}
              </div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">
            ${{ deliveryCosts['envio_oca']?.toLocaleString() || '450' }}
          </div>
        </div>

        <!-- Retiro en Local -->
        <div class="flex items-center justify-between p-4 transition-colors border rounded-lg cursor-pointer hover:border-gray-300"
             :class="selectedDeliveryMethod === 'retiro_local' ? 'border-gray-800 bg-gray-50' : 'border-gray-200'"
             @click="selectDeliveryMethod('retiro_local')">
          <div class="flex items-center">
            <input type="radio" 
                   :checked="selectedDeliveryMethod === 'retiro_local'"
                   class="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-500">
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
           class="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-blue-900">Coordinar Retiro</h4>
            <p class="mt-1 text-sm text-blue-700">
              Despues de completar tu compra, te contactaremos por WhatsApp para coordinar el horario de retiro.
            </p>
            <div class="mt-2 text-sm text-blue-700">
              <strong>Contacto:</strong> +54 9 11 1234-5678<br>
              <strong>Direccion:</strong> Av. Ejemplo 123, CABA
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Cost Summary -->
      <div v-if="selectedDeliveryMethod" class="pt-4 mt-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900">Costo de envio:</span>
          <span class="text-sm font-medium text-gray-900">
            {{ getDeliveryCost() === 0 ? 'Gratis' : `$${getDeliveryCost()}` }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CheckIcon, ShoppingCartIcon, TruckIcon, CreditCardIcon } from '@heroicons/vue/24/solid'
import { shippingQuotesApi } from '../../config/api'

interface Props {
  currentStep: number
  initialDeliveryMethod?: string
  postalCode?: string
  city?: string
  province?: string
  totalWeightKg?: number
}

interface DeliveryData {
  method: string
  cost: number
}

interface ShippingOption {
  carrier: string
  name: string
  price: number
  currency: string
  estimated_days?: number
  estimated_delivery_text: string
  service_type?: string
  has_error: boolean
  error_message?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 1,
  initialDeliveryMethod: 'envio_andreani',
  totalWeightKg: 1.0
})

// Define emits for step navigation and delivery method changes
const emit = defineEmits<{
  'go-to-step': [step: number]
  'delivery-method-changed': [data: DeliveryData]
}>()

// State
const selectedDeliveryMethod = ref<string>(props.initialDeliveryMethod || 'envio_andreani')
const shippingOptions = ref<ShippingOption[]>([])
const isLoadingQuotes = ref(false)
const quotesError = ref<string | null>(null)

// Fallback delivery costs (used when API is not available)
const fallbackDeliveryCosts = {
  'envio_andreani': 500,
  'envio_correo': 400,
  'envio_oca': 450,
  'retiro_local': 0
}

// Computed property for current delivery costs
const deliveryCosts = computed(() => {
  if (shippingOptions.value.length > 0) {
    // Use dynamic prices from API
    const costs: Record<string, number> = { 'retiro_local': 0 }
    shippingOptions.value.forEach(option => {
      costs[`envio_${option.carrier}`] = option.price
    })
    return costs
  } else {
    // Use fallback prices
    return fallbackDeliveryCosts
  }
})

// Methods
const selectDeliveryMethod = (method: string) => {
  selectedDeliveryMethod.value = method
  const cost = deliveryCosts.value[method as keyof typeof deliveryCosts.value] || 0
  emit('delivery-method-changed', { method, cost })
}

const getDeliveryCost = () => {
  return deliveryCosts.value[selectedDeliveryMethod.value as keyof typeof deliveryCosts.value] || 0
}

// Function to load shipping quotes from API
const loadShippingQuotes = async () => {
  if (!props.postalCode) {
    console.log('No postal code provided, using fallback prices')
    return
  }

  isLoadingQuotes.value = true
  quotesError.value = null

  try {
    console.log(`Loading shipping quotes for CP: ${props.postalCode}, weight: ${props.totalWeightKg}kg`)

    const response = await shippingQuotesApi.getShippingQuotes({
      postal_code: props.postalCode,
      city: props.city,
      province: props.province,
      total_weight_kg: props.totalWeightKg || 1.0,
      include_fallback: true
    })

    if (response.success && response.options) {
      shippingOptions.value = response.options
      console.log('Shipping quotes loaded:', response.options)

      // If current method is not available in new quotes, select first available
      const currentMethodAvailable = response.options.some((opt: ShippingOption) => 
        selectedDeliveryMethod.value === `envio_${opt.carrier}`
      )

      if (!currentMethodAvailable && response.options.length > 0) {
        const newMethod = `envio_${response.options[0].carrier}`
        selectedDeliveryMethod.value = newMethod
        emit('delivery-method-changed', { 
          method: newMethod, 
          cost: response.options[0].price 
        })
      } else {
        // Update cost for current method
        const currentOption = response.options.find((opt: ShippingOption) => 
          selectedDeliveryMethod.value === `envio_${opt.carrier}`
        )
        if (currentOption) {
          emit('delivery-method-changed', { 
            method: selectedDeliveryMethod.value, 
            cost: currentOption.price 
          })
        }
      }

      if (!response.api_available) {
        quotesError.value = response.message || 'Usando precios estimados'
      }
    } else {
      throw new Error('Invalid response format')
    }

  } catch (error) {
    console.error('Error loading shipping quotes:', error)
    quotesError.value = 'Error al cargar cotizaciones, usando precios estimados'
    // Keep fallback prices
    shippingOptions.value = []
  } finally {
    isLoadingQuotes.value = false
  }
}

// Helper function to get shipping option for display
const getShippingOption = (carrier: string): ShippingOption | null => {
  return shippingOptions.value.find(opt => opt.carrier === carrier) || null
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

// Watch for postal code changes to trigger new quotes
watch(() => [props.postalCode, props.totalWeightKg], () => {
  if (props.postalCode) {
    loadShippingQuotes()
  }
}, { immediate: false })

// Watch for initial delivery method changes
watch(() => props.initialDeliveryMethod, (newMethod) => {
  if (newMethod) {
    selectedDeliveryMethod.value = newMethod
  }
}, { immediate: true })

// Load quotes on mount if postal code is available
watch(() => props.postalCode, (newPostalCode) => {
  if (newPostalCode) {
    loadShippingQuotes()
  }
}, { immediate: true })

// Emit initial delivery method on mount
const cost = deliveryCosts.value[selectedDeliveryMethod.value as keyof typeof deliveryCosts.value] || 0
emit('delivery-method-changed', { method: selectedDeliveryMethod.value, cost })
</script>

<style scoped>
/* Additional animations if needed */
.step-transition {
  transition: all 0.3s ease-in-out;
}
</style>

