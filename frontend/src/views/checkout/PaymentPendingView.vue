<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white shadow rounded-lg p-8 text-center">
        <!-- Pending Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
          <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <!-- Pending Message -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Pago pendiente</h1>
        <p class="text-lg text-gray-600 mb-8">
          Tu pago estÃ¡ siendo procesado. Te notificaremos cuando se complete la transacciÃ³n.
        </p>
        
        <!-- Order Details -->
        <div v-if="orderDetails" class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles de tu pedido</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">NÃºmero de orden:</span>
              <span class="font-medium">#{{ orderDetails.order_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total:</span>
              <span class="font-medium">${{ orderDetails.total?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Estado del pago:</span>
              <span class="font-medium text-yellow-600">{{ getPaymentStatusText(orderDetails.payment_status) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Status Check -->
        <div class="mb-8">
          <button
            @click="checkPaymentStatus"
            :disabled="checking"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
          >
            <svg v-if="checking" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ checking ? 'Verificando...' : 'Verificar estado del pago' }}
          </button>
        </div>
        
        <!-- Actions -->
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <router-link
            to="/"
            class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 transition-colors"
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
import { useRoute, useRouter } from 'vue-router';
import { paymentsApi } from '../../config/api';
import { useToast } from 'vue-toastification';
import { useCartStore } from '../../store/cart';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();
const orderDetails = ref<any>(null);
const checking = ref(false);

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

const checkPaymentStatus = async () => {
  if (!orderDetails.value) return;
  
  checking.value = true;
  try {
    const updatedDetails = await paymentsApi.getPaymentStatus(orderDetails.value.order_id);
    orderDetails.value = updatedDetails;
    
    // Redirigir segÃºn el nuevo estado
    if (updatedDetails.payment_status === 'approved') {
      toast.success('Â¡Pago aprobado!');
      router.push(`/payment/success?order_id=${updatedDetails.order_id}`);
    } else if (updatedDetails.payment_status === 'rejected') {
      toast.error('Pago rechazado');
      router.push(`/payment/failure?order_id=${updatedDetails.order_id}`);
    } else {
      toast.info('El pago sigue pendiente');
    }
  } catch (error) {
    console.error('Error verificando estado del pago:', error);
    toast.error('Error al verificar el estado del pago');
  } finally {
    checking.value = false;
  }
};

onMounted(async () => {
  // Clear cart since order was created successfully (even if payment is pending)
  cartStore.clearCart();
  
  // Clean up any stored order data
  localStorage.removeItem('pending_order');
  
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

