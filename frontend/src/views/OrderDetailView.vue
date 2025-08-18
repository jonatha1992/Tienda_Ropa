<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <router-link to="/orders" class="text-gray-400 hover:text-gray-500 flex items-center">
              <svg class="flex-shrink-0 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-1">Mis Pedidos</span>
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-4 text-sm font-medium text-gray-500">Pedido #{{ orderId }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Cargando detalles del pedido...</p>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="space-y-6">
        <!-- Order Header -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-light text-gray-900">Pedido #{{ order.id }}</h1>
              <p class="text-sm text-gray-500">
                Realizado el {{ formatDate(order.created_at) }}
              </p>
            </div>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Productos</h2>
          <ul class="divide-y divide-gray-200">
            <li v-for="item in order.items" :key="item.id" class="py-4 flex">
              <img 
                :src="item.product.images[0]?.image_url || '/placeholder-image.jpg'"
                :alt="item.product.name"
                class="w-16 h-16 rounded-md object-cover object-center"
              >
              <div class="ml-4 flex-1">
                <div class="flex justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ item.product.name }}</h3>
                    <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">
                    ${{ (item.price * item.quantity).toLocaleString() }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Order Summary -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h2>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Subtotal</dt>
              <dd class="text-sm font-medium text-gray-900">${{ order.subtotal?.toLocaleString() }}</dd>
            </div>
            <div v-if="order.discount && order.discount > 0" class="flex justify-between">
              <dt class="text-sm text-gray-600">Descuento</dt>
              <dd class="text-sm font-medium text-green-600">-${{ order.discount.toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-600">Envío</dt>
              <dd class="text-sm font-medium text-gray-900">${{ order.shipping_cost?.toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between border-t pt-3">
              <dt class="text-base font-medium text-gray-900">Total</dt>
              <dd class="text-base font-medium text-gray-900">${{ order.total.toLocaleString() }}</dd>
            </div>
          </dl>
        </div>

        <!-- Shipping Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Información de Envío</h2>
          <div class="text-sm text-gray-600">
            <p class="font-medium text-gray-900">{{ order.customer_name }}</p>
            <p>{{ order.shipping_address }}</p>
            <p>{{ order.shipping_city }}, {{ order.shipping_postal_code }}</p>
            <p v-if="order.delivery_notes" class="mt-2">
              <span class="font-medium">Notas:</span> {{ order.delivery_notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Pedido no encontrado</h3>
        <p class="text-gray-600 mb-6">No se pudo cargar la información del pedido</p>
        <router-link
          to="/orders"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          Volver a mis pedidos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useToast } from 'vue-toastification';
import { ordersApi } from '../config/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(true);
const order = ref<any>(null);

const orderId = computed(() => route.params.id as string);

onMounted(async () => {
  // Check authentication
  if (!authStore.isAuthenticated) {
    toast.warning('Debes iniciar sesión para ver tus pedidos');
    router.push('/auth');
    return;
  }

  await loadOrderDetails();
});

const loadOrderDetails = async () => {
  try {
    loading.value = true;
    console.log('🔄 Cargando detalles del pedido:', orderId.value);
    order.value = await ordersApi.getOrder(parseInt(orderId.value));
    console.log('✅ Detalles del pedido cargados:', order.value);
  } catch (error) {
    console.error('❌ Error loading order details:', error);
    toast.error('Error al cargar los detalles del pedido');
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending_payment':
      return 'bg-orange-100 text-orange-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'pending_payment':
      return 'Esperando Pago';
    case 'approved':
      return 'Aprobado';
    case 'rejected':
      return 'Rechazado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};
</script>
