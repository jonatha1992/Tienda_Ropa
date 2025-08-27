<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-heading text-lg font-medium text-gray-900">Información de contacto</h3>
      
      <!-- Loading indicator -->
      <div v-if="loadingUserData" class="flex items-center text-sm text-gray-500">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Cargando datos...
      </div>
      
      <!-- Previous data indicator -->
      <div v-else-if="usingPreviousData" class="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Datos de compra anterior
      </div>
    </div>
    
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="firstName" class="font-body block text-sm font-medium text-body-text">Nombre</label>
        <input
          :value="firstName"
          @input="$emit('update:firstName', ($event.target as HTMLInputElement).value)"
          type="text"
          id="firstName"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
        >
      </div>
      
      <div>
        <label for="lastName" class="font-body block text-sm font-medium text-body-text">Apellido</label>
        <input
          :value="lastName"
          @input="$emit('update:lastName', ($event.target as HTMLInputElement).value)"
          type="text"
          id="lastName"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
        >
      </div>
    </div>
    
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="email" class="font-body block text-sm font-medium text-body-text">Email</label>
        <input
          :value="email"
          @input="$emit('update:email', ($event.target as HTMLInputElement).value)"
          type="email"
          id="email"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
        >
      </div>
      
      <div>
        <CountryPhoneSelector
          :model-value="phone"
          :country-code="phoneCountryCode"
          @update:model-value="$emit('update:phone', $event)"
          @update:country-code="$emit('update:phoneCountryCode', $event)"
          input-id="phone"
          required
        />
      </div>
    </div>

    <!-- Continue Button -->
    <div v-if="isContactInfoComplete" class="mt-6 pt-4 border-t border-gray-200">
      <div class="text-center">
        <div class="mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h4 class="font-heading text-lg font-medium text-gray-900 mb-2">Información de contacto completa</h4>
          <p class="font-body text-sm text-gray-600 mb-4">Ahora selecciona el método de entrega</p>
        </div>
        <button
          type="button"
          @click="$emit('continue')"
          class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
        >
          <span class="text-white">Continuar a entrega</span>
          <svg class="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CountryPhoneSelector from '../forms/CountryPhoneSelector.vue'

interface Props {
  firstName: string
  lastName: string
  email: string
  phone: string
  phoneCountryCode: string
  loadingUserData?: boolean
  usingPreviousData?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
  'update:email': [value: string]
  'update:phone': [value: string]
  'update:phoneCountryCode': [value: string]
  'continue': []
}>()

const isContactInfoComplete = computed(() => {
  return props.firstName.trim() && 
         props.lastName.trim() && 
         props.email.trim() && 
         props.phone.trim()
})
</script>