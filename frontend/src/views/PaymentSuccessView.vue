<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white shadow rounded-lg p-8 text-center">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <!-- Success Message -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">¡Pago exitoso!</h1>
        <p class="text-lg text-gray-600 mb-8">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
        </p>
        
        <!-- Order Details -->
        <div v-if="orderDetails" class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles de tu pedido</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Número de orden:</span>
              <span class="font-medium">#{{ orderDetails.order_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total pagado:</span>
              <span class="font-medium">${{ orderDetails.total?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Estado del pago:</span>
              <span class="font-medium text-green-600">{{ getPaymentStatusText(orderDetails.payment_status) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <router-link
            to="/"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </router-link>
          
          <router-link
            to="/shop"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Seguir comprando
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
