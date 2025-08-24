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

            <!-- Shipping/Delivery Info -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <!-- Delivery Method -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Método de entrega:</span>
                </div>
                <span :class="getDeliveryMethodClass(order.delivery_method)" 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getDeliveryMethodText(order.delivery_method) }}
                </span>
              </div>

              <!-- Tracking Info (for shipping orders) -->
              <div v-if="isShippingOrder(order.delivery_method)" class="space-y-3">
                <!-- Tracking Number -->
                <div v-if="order.tracking_number" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">Número de seguimiento:</span>
                  </div>
                  <div class="text-right">
                    <div class="font-mono text-sm text-gray-900">{{ order.tracking_number }}</div>
                    <div v-if="order.shipping_provider" class="text-xs text-gray-500">{{ getShippingProviderName(order.shipping_provider) }}</div>
                  </div>
                </div>

                <!-- Track Shipment Button -->
                <div v-if="order.tracking_number" class="flex justify-end">
                  <button @click="trackShipment(order.tracking_number, order.shipping_provider)"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7l-4 4" />
                    </svg>
                    Seguir envío
                  </button>
                </div>

                <!-- No tracking yet -->
                <div v-else-if="order.status === 'approved'" class="text-center py-3 bg-blue-50 rounded-lg">
                  <svg class="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-blue-700">Preparando envío</p>
                  <p class="text-xs text-blue-600 mt-1">Te notificaremos cuando el pedido sea enviado</p>
                </div>
              </div>

              <!-- Local Pickup Info -->
              <div v-else-if="order.delivery_method === 'retiro_local'" class="bg-purple-50 rounded-lg p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-purple-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-purple-900 mb-2">Retiro en Local</h4>
                    
                    <div v-if="order.status === 'approved'" class="space-y-2">
                      <p class="text-sm text-purple-700">
                        Tu pedido está listo para retirar. Coordina tu horario de retiro:
                      </p>
                      <div class="bg-white rounded p-3 text-sm">
                        <div class="font-medium text-gray-900 mb-1">Información de contacto:</div>
                        <div class="text-gray-700">📱 WhatsApp: +54 9 11 1234-5678</div>
                        <div class="text-gray-700">📍 Dirección: Av. Ejemplo 123, CABA</div>
                        <div class="text-gray-700">🕐 Horarios: Lun-Vie 9-18hs, Sáb 9-13hs</div>
                      </div>
                      <button @click="contactForPickup(order)" 
                        class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Contactar por WhatsApp
                      </button>
                    </div>
                    
                    <div v-else class="text-sm text-purple-700">
                      Una vez que tu pago sea confirmado, podrás coordinar el retiro.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-red-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar pedidos</h3>
        <p class="text-gray-600 mb-6">Hubo un problema al cargar tus pedidos. Por favor, intenta nuevamente.</p>
        <button
          @click="loadOrders"
          :disabled="loading"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>Reintentar</span>
        </button>
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
        <div class="space-x-4">
          <router-link
            to="/shop"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Comenzar a comprar
          </router-link>
          <button
            @click="loadOrders"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
          >
            Actualizar
          </button>
        </div>
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
const hasError = ref(false);

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
    hasError.value = false; // Reset error state
    console.log('🔄 Cargando pedidos del usuario...');
    console.log('👤 Usuario autenticado:', authStore.isAuthenticated);
    console.log('📧 Email del usuario:', authStore.backendUser?.email);
    
    orders.value = await ordersApi.getMyOrders();
    console.log('✅ Pedidos cargados:', orders.value);
    console.log('📊 Cantidad de pedidos:', orders.value.length);
    
    // Si no hay pedidos pero no hubo error, mostrar info
    if (orders.value.length === 0) {
      console.log('ℹ️ No se encontraron pedidos para el usuario');
    }
    
  } catch (error: any) {
    console.error('❌ Error loading orders:', error);
    console.error('❌ Error response:', error?.response);
    console.error('❌ Error data:', error?.response?.data);
    console.error('❌ Error status:', error?.response?.status);
    
    // Manejo de errores específicos
    if (error?.response?.status === 401) {
      console.log('🔐 Error 401: Sesión expirada');
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      authStore.logout();
      router.push('/auth');
    } else if (error?.response?.status === 400) {
      console.log('⚠️ Error 400: Problema con la solicitud');
      toast.error('Error en la solicitud. Intenta cerrar sesión y volver a iniciar.');
    } else if (error?.response?.status === 404) {
      console.log('🔍 Error 404: Endpoint no encontrado');
      toast.error('Error del servidor. El servicio no está disponible.');
    } else if (error?.response?.status >= 500) {
      console.log('🔥 Error del servidor:', error?.response?.status);
      toast.error('Error del servidor. Por favor, intenta más tarde.');
    } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
      console.log('🌐 Error de red');
      toast.error('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } else {
      console.log('❓ Error desconocido:', error?.message);
      toast.error(`Error al cargar los pedidos: ${error?.response?.data?.detail || error?.message || 'Error desconocido'}`);
    }
    
    hasError.value = true; // Set error state
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

// Delivery method functions
const getDeliveryMethodClass = (deliveryMethod: string | undefined) => {
  switch (deliveryMethod) {
    case 'envio_andreani':
      return 'bg-blue-100 text-blue-800';
    case 'envio_correo':
      return 'bg-green-100 text-green-800';
    case 'retiro_local':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getDeliveryMethodText = (deliveryMethod: string | undefined) => {
  switch (deliveryMethod) {
    case 'envio_andreani':
      return 'Envío por Andreani';
    case 'envio_correo':
      return 'Envío por Correo Argentino';
    case 'retiro_local':
      return 'Retiro en Local';
    default:
      return 'No definido';
  }
};

const isShippingOrder = (deliveryMethod: string | undefined) => {
  return deliveryMethod === 'envio_andreani' || deliveryMethod === 'envio_correo';
};

const getShippingProviderName = (provider: string) => {
  switch (provider) {
    case 'andreani':
      return 'Andreani';
    case 'correo-argentino':
      return 'Correo Argentino';
    default:
      return provider || 'Proveedor';
  }
};

// Tracking functions
const trackShipment = (trackingNumber: string | undefined, provider: string | undefined) => {
  if (!trackingNumber || !provider) {
    toast.error('Información de tracking no disponible');
    return;
  }
  
  let trackingUrl = '';
  
  switch (provider) {
    case 'andreani':
      trackingUrl = `https://www.andreani.com/seguimiento?codigo=${trackingNumber}`;
      break;
    case 'correo-argentino':
      trackingUrl = `https://www.correoargentino.com.ar/formularios/e-commerce?codigo=${trackingNumber}`;
      break;
    default:
      toast.info('Número de tracking copiado al portapapeles');
      navigator.clipboard.writeText(trackingNumber);
      return;
  }
  
  window.open(trackingUrl, '_blank');
};

const contactForPickup = (order: any) => {
  const message = `Hola! Soy ${order.customer_name || 'un cliente'} y tengo el pedido #${order.id} listo para retirar.

📦 Total: $${order.total.toLocaleString()}

¿Cuándo puedo pasar a retirarlo?`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5491112345678?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};
</script>
