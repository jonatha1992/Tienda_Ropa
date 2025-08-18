<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-light tracking-tight text-gray-900">Mis Pedidos</h1>
        <p class="mt-2 text-sm text-gray-600">
          Aquí puedes ver el historial de todos tus pedidos
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Cargando pedidos...</p>
      </div>

      <!-- Orders List -->
      <div v-else-if="orders.length > 0" class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <!-- Order Header -->
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  Pedido #{{ order.id }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ order.created_at ? formatDate(order.created_at) : 'Fecha no disponible' }}
                </p>
              </div>
              <div class="text-right">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(order.status || '')"
                >
                  {{ getStatusText(order.status || '') }}
                </span>
                <p class="text-lg font-medium text-gray-900 mt-1">
                  ${{ order.total.toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Order Items Preview -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center space-x-4">
                <div 
                  v-for="item in order.items?.slice(0, 3)" 
                  :key="item.id"
                  class="flex-shrink-0"
                >
                  <img 
                    :src="item.product?.images?.[0]?.image_url || '/placeholder-image.jpg'"
                    :alt="item.product?.name || 'Producto'"
                    class="h-16 w-16 rounded-md object-cover object-center"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">
                    {{ order.items?.length || 0 }} {{ (order.items?.length || 0) === 1 ? 'producto' : 'productos' }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ order.items?.map((item: OrderItem) => item.product?.name).filter(Boolean).join(', ') || 'Sin productos' }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <router-link
                    :to="`/orders/${order.id}`"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Ver detalles
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
        <p class="text-gray-600 mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
        <router-link
          to="/shop"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          Comenzar a comprar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useToast } from 'vue-toastification';
import { ordersApi } from '../config/api';
import type { Order, OrderItem } from '../types';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const orders = ref<Order[]>([]);
const loading = ref(true);

onMounted(async () => {
  // Check authentication
  if (!authStore.isAuthenticated) {
    toast.warning('Debes iniciar sesión para ver tus pedidos');
    router.push('/auth');
    return;
  }

  await loadOrders();
});

const loadOrders = async () => {
  try {
    loading.value = true;
    console.log('🔄 Cargando pedidos del usuario...');
    orders.value = await ordersApi.getMyOrders();
    console.log('✅ Pedidos cargados:', orders.value);
  } catch (error) {
    console.error('❌ Error loading orders:', error);
    toast.error('Error al cargar los pedidos');
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Fecha no disponible';
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
