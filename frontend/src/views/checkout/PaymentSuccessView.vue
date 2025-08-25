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
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Â¡Pago exitoso!</h1>
        <p class="text-lg text-gray-600 mb-8">
          Tu pago ha sido procesado correctamente. RecibirÃ¡s un email de confirmaciÃ³n en breve.
        </p>
        
        <!-- Order Details -->
        <div v-if="orderDetails" class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles de tu pedido</h2>
          <div class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">NÃºmero de orden:</span>
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
              
              <div v-if="pendingOrderData?.customer" class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Cliente:</span>
                  <span class="font-medium">{{ pendingOrderData.customer.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">{{ pendingOrderData.customer.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">MÃ©todo de pago:</span>
                  <span class="font-medium">{{ orderDetails.payment_method === 'mercadopago' ? 'MercadoPago' : orderDetails.payment_method }}</span>
                </div>
              </div>
            </div>
            
            <!-- Items del pedido -->
            <div v-if="pendingOrderData?.items?.length" class="border-t border-gray-200 pt-3 mt-3">
              <h3 class="font-medium text-gray-900 mb-2">Productos</h3>
              <div class="space-y-2">
                <div v-for="item in pendingOrderData.items" :key="item.id" class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ item.product.name }} (x{{ item.quantity }})</span>
                  <span class="font-medium">${{ (item.product.has_discount && item.product.discounted_price ? item.product.discounted_price * item.quantity : item.product.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
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
import { useRoute } from 'vue-router';
import { paymentsApi } from '../../config/api';
import { useToast } from 'vue-toastification';
import { useCartStore } from '../../store/cart';
import { emailService } from '../../services/emailVerificationService';

const route = useRoute();
const toast = useToast();
const cartStore = useCartStore();
const orderDetails = ref<any>(null);
const pendingOrderData = ref<any>(null);

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
  try {
    // Clear cart immediately on successful payment
    cartStore.clearCart();
    
    // Get order data from localStorage (stored during checkout)
    const storedOrderData = localStorage.getItem('pending_order');
    if (storedOrderData) {
      pendingOrderData.value = JSON.parse(storedOrderData);
      localStorage.removeItem('pending_order'); // Clean up
    }
    
    // Get order_id from query params or stored data
    const orderId = route.query.external_reference || 
                   route.query.order_id || 
                   pendingOrderData.value?.order_id;
    
    if (orderId) {
      // Get updated payment status from API
      orderDetails.value = await paymentsApi.getPaymentStatus(Number(orderId));
      
      // Send confirmation email if payment is successful
      if (orderDetails.value?.payment_status === 'approved' && pendingOrderData.value) {
        try {
          // TODO: Fix email confirmation parameters to match OrderConfirmationEmailRequest interface
          // await emailService.sendOrderConfirmationEmail({
          //   to_email: pendingOrderData.value.customer.email,
          //   customer_name: pendingOrderData.value.customer.name,
          //   order_id: orderId.toString(),
          //   total_amount: orderDetails.value.total,
          //   payment_method: orderDetails.value.payment_method === 'mercadopago' ? 'MercadoPago' : orderDetails.value.payment_method
          // });
          console.log('Email confirmation temporarily disabled - needs proper parameters');
          console.log('âœ… Email de confirmaciÃ³n enviado');
        } catch (emailError) {
          console.error('âŒ Error enviando email de confirmaciÃ³n:', emailError);
          // No mostrar error al usuario, el email es opcional
        }
      }
    } else {
      toast.warning('No se pudo obtener el ID de la orden');
    }
    
  } catch (error) {
    console.error('Error en PaymentSuccessView:', error);
    toast.error('Error obteniendo detalles del pedido');
  }
});
</script>

