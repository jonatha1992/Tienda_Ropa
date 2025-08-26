<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 text-green-600 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-light text-gray-900">¡Pedido Confirmado!</h1>
        <p class="mt-2 text-lg text-gray-600">
          Orden #{{ orderData?.order_id || 'Cargando...' }}
        </p>
      </div>

      <div v-if="deliveryInfo" class="space-y-6">
        <!-- Información de Entrega -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Entrega a Domicilio
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="border border-gray-200 rounded p-4">
                <h3 class="font-medium text-gray-900 mb-3">Zona de Entrega</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Zona:</span>
                    <span class="font-medium">{{ deliveryInfo.delivery_info.zone_name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tiempo estimado:</span>
                    <span class="font-medium">{{ deliveryInfo.estimated_delivery }}</span>
                  </div>
                  <p class="text-gray-600 text-xs mt-2">
                    {{ deliveryInfo.delivery_info.zone_description }}
                  </p>
                </div>
              </div>
              
              <div class="border border-gray-200 rounded p-4">
                <h3 class="font-medium text-gray-900 mb-3">Dirección de Entrega</h3>
                <div class="text-sm">
                  <p class="font-medium">{{ deliveryInfo.customer_address }}</p>
                  <div v-if="customerInfo.address_reference || customerInfo.delivery_notes" class="mt-2 space-y-1">
                    <p v-if="customerInfo.address_reference" class="text-gray-600">
                      <span class="font-medium">Ref:</span> {{ customerInfo.address_reference }}
                    </p>
                    <p v-if="customerInfo.delivery_notes" class="text-gray-600">
                      <span class="font-medium">Notas:</span> {{ customerInfo.delivery_notes }}
                    </p>
                    <p v-if="customerInfo.preferred_delivery_time && customerInfo.preferred_delivery_time !== 'cualquiera'" class="text-gray-600">
                      <span class="font-medium">Horario preferido:</span> {{ formatDeliveryTime(customerInfo.preferred_delivery_time) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="border border-gray-200 rounded p-4">
                <h3 class="font-medium text-gray-900 mb-3">Resumen de Costos</h3>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal productos:</span>
                    <span class="font-medium">${{ deliveryInfo.original_total.toLocaleString() }}</span>
                  </div>
                  
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Costo de envÃ­o:</span>
                    <span class="font-medium">
                      <span v-if="deliveryInfo.delivery_info.is_free" class="line-through text-gray-400">
                        ${{ deliveryInfo.delivery_info.original_cost.toLocaleString() }}
                      </span>
                      <span :class="deliveryInfo.delivery_info.is_free ? 'text-green-600 ml-2' : ''">
                        {{ deliveryInfo.delivery_info.is_free ? 'GRATIS' : `$${deliveryInfo.delivery_cost.toLocaleString()}` }}
                      </span>
                    </span>
                  </div>
                  
                  <div v-if="deliveryInfo.delivery_info.is_free" class="flex justify-between text-sm text-green-600">
                    <span>Ahorro en envÃ­o:</span>
                    <span class="font-medium">${{ deliveryInfo.delivery_info.savings.toLocaleString() }}</span>
                  </div>
                  
                  <div class="border-t border-gray-200 pt-2 mt-3">
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-900">Total a pagar:</span>
                      <span class="text-xl font-bold text-green-600">
                        ${{ deliveryInfo.final_total.toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="!deliveryInfo.delivery_info.is_free" class="border border-green-200 bg-green-50 rounded p-4">
                <h4 class="font-medium text-green-900 mb-2 flex items-center">
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Â¡EnvÃ­o Gratis!
                </h4>
                <p class="text-green-800 text-sm">
                  El envÃ­o es gratuito para compras superiores a 
                  <span class="font-medium">${{ deliveryInfo.delivery_info.free_threshold.toLocaleString() }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Instrucciones -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instrucciones para la Entrega
          </h2>
          
          <div class="space-y-3">
            <div v-for="(instruction, index) in deliveryInfo.instructions" :key="index" class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                {{ index + 1 }}
              </div>
              <p class="text-gray-700">{{ instruction }}</p>
            </div>
          </div>
        </div>

        <!-- Información del Cliente -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-4">Información de Contacto</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Datos del Comprador</h3>
              <div class="text-sm space-y-1">
                <p><span class="text-gray-600">Nombre:</span> {{ customerInfo.name }}</p>
                <p><span class="text-gray-600">Email:</span> {{ customerInfo.email }}</p>
                <p><span class="text-gray-600">Teléfono:</span> {{ customerInfo.phone }}</p>
              </div>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Método de Pago</h3>
              <div class="flex items-center text-sm">
                <svg class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="font-medium">Efectivo contra entrega</span>
              </div>
              <p class="text-xs text-gray-600 mt-1">
                Paga cuando recibas tu pedido
              </p>
            </div>
          </div>
        </div>

        <!-- Estado del Pedido -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-4">¿Qué sigue?</h2>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium mr-4">
                âœ“
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Pedido Confirmado</h3>
                <p class="text-sm text-gray-600">Tu pedido ha sido registrado exitosamente</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-4">
                2
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Coordinación de Entrega</h3>
                <p class="text-sm text-gray-600">Te contactaremos en las próximas 24 horas para coordinar la entrega</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-medium mr-4">
                3
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Entrega y Pago</h3>
                <p class="text-sm text-gray-600">Recibes tu pedido y pagas en efectivo</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="goHome"
              class="flex-1 bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Volver al Inicio
            </button>
            
            <button
              @click="goToShop"
              class="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
          
          <p class="mt-4 text-xs text-gray-500 text-center">
            Recibirás un email de confirmación con estos datos. Te contactaremos pronto para coordinar la entrega.
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando información de entrega...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { DeliveryInfo, Customer } from '../../types';

const router = useRouter();
const toast = useToast();

const orderData = ref<any>(null);
const deliveryInfo = ref<DeliveryInfo | null>(null);
const customerInfo = ref<Customer | any>({});

onMounted(() => {
  const storedData = localStorage.getItem('cash_order');
  if (storedData) {
    try {
      const data = JSON.parse(storedData);
      orderData.value = data;
      deliveryInfo.value = data.delivery_info;
      customerInfo.value = data.customer;
      
      // Clear stored data to prevent reuse
      localStorage.removeItem('cash_order');
    } catch (error) {
      console.error('Error parsing cash order data:', error);
      toast.error('Error cargando datos de entrega');
      router.push('/');
    }
  } else {
    toast.warning('No se encontraron datos de entrega');
    router.push('/');
  }
});

const formatDeliveryTime = (time: string) => {
  const timeMap: Record<string, string> = {
    'mañana': 'Mañana (9:00 - 13:00)',
    'tarde': 'Tarde (14:00 - 18:00)', 
    'noche': 'Noche (18:00 - 21:00)',
    'cualquiera': 'Cualquier horario'
  };
  return timeMap[time] || time;
};

const goHome = () => {
  router.push('/');
};

const goToShop = () => {
  router.push('/shop');
};
</script>
