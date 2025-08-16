<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white shadow rounded-lg p-8 text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <!-- Error Message -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Pago no procesado</h1>
        <p class="text-lg text-gray-600 mb-8">
          Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cargo.
        </p>
        
        <!-- Order Details -->
        <div v-if="orderDetails" class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles del pedido</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Número de orden:</span>
              <span class="font-medium">#{{ orderDetails.order_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total:</span>
              <span class="font-medium">${{ orderDetails.total?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Estado del pago:</span>
              <span class="font-medium text-red-600">{{ getPaymentStatusText(orderDetails.payment_status) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            @click="retryPayment"
            :disabled="!orderDetails"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            Intentar nuevamente
          </button>
          
          <router-link
            to="/cart"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Volver al carrito
          </router-link>
          
          <router-link
            to="/"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { paymentsApi } from '../config/api';
import { useToast } from 'vue-toastification';

const route = useRoute();
const toast = useToast();
const orderDetails = ref<any>(null);

const getPaymentStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'approved': 'Aprobado',
    'pending': 'Pendiente',
    'pending_payment': 'Pendiente de pago',
    'rejected': 'Rechazado',
    'cancelled': 'Cancelado'
  };
  return statusMap[status] || status;
};

const retryPayment = async () => {
  if (!orderDetails.value) return;
  
  try {
    const preference = await paymentsApi.createPreference(orderDetails.value.order_id);
    // Redirigir a MercadoPago
    window.location.href = preference.init_point;
  } catch (error) {
    console.error('Error creando nueva preferencia:', error);
    toast.error('Error al reintentar el pago');
  }
};

onMounted(async () => {
  // Obtener order_id de los query params
  const orderId = route.query.external_reference || route.query.order_id;
  
  if (orderId) {
    try {
      orderDetails.value = await paymentsApi.getPaymentStatus(Number(orderId));
    } catch (error) {
      console.error('Error obteniendo detalles del pago:', error);
      toast.error('Error obteniendo detalles del pedido');
    }
  }
});
</script>
