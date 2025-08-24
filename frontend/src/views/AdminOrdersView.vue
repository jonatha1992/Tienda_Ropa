<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 font-heading">Gestión de Envíos</h1>
        <p class="mt-2 text-sm font-body text-gray-600">
          Administra pedidos, asigna números de seguimiento y controla el estado de los envíos
        </p>
      </div>

      <!-- Admin Navigation Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-8">
          <router-link 
            to="/admin/products" 
            class="px-1 py-4 text-sm font-medium text-gray-500 transition-colors border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap"
          >
            <span class="font-body">Productos</span>
          </router-link>
          <router-link 
            to="/admin/users" 
            class="px-1 py-4 text-sm font-medium text-gray-500 transition-colors border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap"
          >
            <span class="font-body">Usuarios</span>
          </router-link>
          <router-link 
            to="/admin/orders" 
            class="px-1 py-4 text-sm font-medium text-gray-900 border-b-2 border-black whitespace-nowrap"
          >
            <span class="font-body">Pedidos</span>
          </router-link>
        </nav>
      </div>

      <!-- Statistics Cards -->
      <div v-if="statistics" class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium truncate font-body text-gray-600">Pendientes de Envío</dt>
                  <dd class="text-lg font-medium font-body text-gray-900">{{ statistics.pending_shipment }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium truncate font-body text-gray-600">Enviados</dt>
                  <dd class="text-lg font-medium font-body text-gray-900">{{ statistics.shipped_orders }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium truncate font-body text-gray-600">Tasa de Envío</dt>
                  <dd class="text-lg font-medium font-body text-gray-900">{{ statistics.shipping_rate_percent }}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden bg-white rounded-lg shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1 w-0 ml-5">
                <dl>
                  <dt class="text-sm font-medium truncate font-body text-gray-600">Tiempo Promedio</dt>
                  <dd class="text-lg font-medium font-body text-gray-900">{{ statistics.avg_processing_hours }}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter and Action Bar -->
      <div class="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label for="statusFilter" class="text-sm font-medium text-gray-700">Filtrar por estado:</label>
            <select v-model="statusFilter" @change="loadOrders" 
              class="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos</option>
              <option value="pending_shipment">Pendientes de Envío</option>
              <option value="with_tracking">Con Tracking</option>
              <option value="shipped">Enviados</option>
            </select>
          </div>
          
          <button @click="loadOrders" 
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedOrders.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ selectedOrders.length }} seleccionados</span>
          <button @click="bulkMarkShipped" :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Marcar como Enviados
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && orders.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Cargando pedidos...</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input type="checkbox" 
                    :checked="selectedOrders.length === orders.length && orders.length > 0"
                    @change="toggleSelectAll"
                    class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6">
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Entrega
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado de Envío
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seguimiento
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.order_id" class="hover:bg-gray-50">
                <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input v-if="order.can_add_tracking || order.can_mark_shipped" 
                    type="checkbox" 
                    :value="order.order_id"
                    v-model="selectedOrders"
                    class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div class="text-sm font-medium text-gray-900">#{{ order.order_id }}</div>
                      <div class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.customer_name }}</div>
                  <div class="text-sm text-gray-500">{{ order.customer_email }}</div>
                  <div v-if="order.customer_phone" class="text-sm text-gray-500">{{ order.customer_phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ order.total.toLocaleString() }}</div>
                  <div class="text-sm text-gray-500">
                    <span :class="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span :class="getDeliveryMethodClass(order.delivery_method)" 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getDeliveryMethodText(order.delivery_method) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getShippingStatusClass(order.shipping_status)" 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getShippingStatusText(order.shipping_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="order.tracking_number" class="text-sm">
                    <div class="font-mono text-gray-900">{{ order.tracking_number }}</div>
                    <div v-if="order.provider_name" class="text-gray-500">{{ order.provider_name }}</div>
                  </div>
                  <div v-else class="text-sm text-gray-400">Sin asignar</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div v-if="order.shipped_at">
                    <div>Enviado: {{ formatDate(order.shipped_at) }}</div>
                    <div v-if="order.estimated_delivery" class="text-xs">
                      Estimado: {{ formatDate(order.estimated_delivery) }}
                    </div>
                  </div>
                  <div v-else>
                    {{ formatDate(order.created_at) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <!-- Change Payment Status Button -->
                    <button v-if="order.status === 'pending'" @click="openStatusModal(order)"
                      class="text-yellow-600 hover:text-yellow-900 p-1 rounded" title="Cambiar estado de pago">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span class="sr-only">Cambiar estado</span>
                    </button>

                    <!-- Add Tracking Button (for shipping orders) -->
                    <button v-if="order.can_add_tracking" @click="openTrackingModal(order)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded" title="Agregar tracking">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span class="sr-only">Agregar tracking</span>
                    </button>
                    
                    <!-- Coordinate Pickup Button (for local pickup orders) -->
                    <button v-if="order.can_coordinate_pickup" @click="coordinatePickup(order)"
                      class="text-purple-600 hover:text-purple-900 p-1 rounded" title="Coordinar retiro por WhatsApp">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span class="sr-only">Coordinar retiro</span>
                    </button>
                    
                    <!-- Mark as Shipped Button -->
                    <button v-if="order.can_mark_shipped" @click="markAsShipped(order.order_id)"
                      class="text-green-600 hover:text-green-900 p-1 rounded">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span class="sr-only">Marcar como enviado</span>
                    </button>
                    
                    <!-- View Details Button -->
                    <button @click="viewOrderDetails(order.order_id)"
                      class="text-gray-600 hover:text-gray-900 p-1 rounded">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span class="sr-only">Ver detalles</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && orders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
          <p class="mt-1 text-sm text-gray-500">No se encontraron pedidos con los filtros seleccionados.</p>
        </div>
      </div>

      <!-- Add/Edit Tracking Modal -->
      <div v-if="showTrackingModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeTrackingModal"></div>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveTrackingInfo">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Asignar Información de Envío
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Proveedor de Envío</label>
                        <select v-model="trackingForm.shipping_provider" required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Seleccionar proveedor</option>
                          <option v-for="provider in shippingProviders" :key="provider.code" :value="provider.code">
                            {{ provider.name }}
                          </option>
                        </select>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Número de Seguimiento</label>
                        <input type="text" v-model="trackingForm.tracking_number" required
                          :placeholder="getTrackingPlaceholder(trackingForm.shipping_provider)"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <p v-if="trackingForm.shipping_provider" class="mt-1 text-xs text-gray-500">
                          {{ getTrackingHint(trackingForm.shipping_provider) }}
                        </p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
                        <input type="date" v-model="trackingForm.estimated_delivery"
                          :min="new Date().toISOString().split('T')[0]"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Notas del Envío (opcional)</label>
                        <textarea v-model="trackingForm.delivery_notes" rows="3"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" :disabled="trackingLoading"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm">
                  <span v-if="trackingLoading">Guardando...</span>
                  <span v-else>Guardar</span>
                </button>
                <button type="button" @click="closeTrackingModal"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Order Status Modal -->
      <OrderStatusModal
        :is-open="showStatusModal"
        :order="selectedOrder"
        @close="closeStatusModal"
        @update-status="updateOrderStatus"
      />

      <!-- Shipping Modal -->
      <ShippingModal
        :is-open="showShippingModal"
        :order="selectedOrder"
        @close="closeShippingModal"
        @update-shipping="updateOrderShipping"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { ordersApi } from '../config/api';
import OrderStatusModal from '../components/OrderStatusModal.vue';
import ShippingModal from '../components/ShippingModal.vue';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

// State
const loading = ref(false);
const trackingLoading = ref(false);
const orders = ref<any[]>([]);
const statistics = ref<any>(null);
const statusFilter = ref('');
const selectedOrders = ref<number[]>([]);
const showTrackingModal = ref(false);
const showStatusModal = ref(false);
const showShippingModal = ref(false);
const selectedOrder = ref<any>(null);
const shippingProviders = ref<any[]>([]);

// Tracking form
const trackingForm = ref({
  tracking_number: '',
  shipping_provider: '',
  estimated_delivery: '',
  delivery_notes: ''
});

// Auth header
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${authStore.token}`,
  'Content-Type': 'application/json'
});

// Load data
const loadOrders = async () => {
  loading.value = true;
  try {
    console.log('🔄 Loading all orders with customer info from ordersApi');
    const allOrders = await ordersApi.getOrdersWithCustomerInfo();
    console.log('✅ Orders loaded:', allOrders);
    
    // Transform orders to include customer info and status flags
    orders.value = allOrders.map((order: any) => ({
      order_id: order.id,
      customer_name: order.customer?.name || 'Cliente desconocido',
      customer_email: order.customer?.email || '',
      customer_phone: order.customer?.phone || null,
      total: order.total,
      status: order.payment_status || order.status || 'pending', // Use payment_status first
      payment_method: order.payment_method,
      delivery_method: order.delivery_method || 'envio_andreani',
      created_at: order.created_at,
      tracking_number: order.tracking_number,
      shipping_provider: order.shipping_provider,
      shipped_at: order.shipped_at,
      estimated_delivery: order.estimated_delivery,
      
      // Status flags for admin actions - differentiate based on delivery method
      can_add_tracking: !order.tracking_number && 
                       (order.payment_status === 'approved' || order.payment_method === 'cash') &&
                       (order.delivery_method === 'envio_andreani' || order.delivery_method === 'envio_correo'),
      can_mark_shipped: !!order.tracking_number && !order.shipped_at,
      can_coordinate_pickup: (order.delivery_method === 'retiro_local') && 
                            (order.payment_status === 'approved' || order.payment_method === 'cash'),
      shipping_status: order.shipped_at ? 'shipped' : (order.tracking_number ? 'ready_to_ship' : 'pending')
    }));
    
    // Apply status filter
    if (statusFilter.value) {
      orders.value = orders.value.filter((order: any) => {
        switch (statusFilter.value) {
          case 'pending_shipment':
            return !order.tracking_number && (order.status === 'approved' || order.payment_method === 'cash');
          case 'with_tracking':
            return !!order.tracking_number && !order.shipped_at;
          case 'shipped':
            return !!order.shipped_at;
          default:
            return true;
        }
      });
    }
    
    console.log(`📊 Showing ${orders.value.length} orders after filtering`);
  } catch (error) {
    console.error('❌ Error loading orders:', error);
    toast.error('Error al cargar pedidos');
  } finally {
    loading.value = false;
  }
};

const loadStatistics = async () => {
  try {
    console.log('📊 Loading shipping statistics...');
    const response = await fetch(`${config.backendUrl}/admin/shipping/statistics`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    statistics.value = await response.json();
    console.log('✅ Statistics loaded:', statistics.value);
  } catch (error) {
    console.error('❌ Error loading statistics:', error);
  }
};

const loadShippingProviders = async () => {
  try {
    console.log('🚛 Loading shipping providers...');
    const response = await fetch(`${config.backendUrl}/admin/shipping/providers`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const data = await response.json();
    shippingProviders.value = data.providers;
    console.log('✅ Providers loaded:', shippingProviders.value);
  } catch (error) {
    console.error('❌ Error loading providers:', error);
  }
};

// Modal functions
const openTrackingModal = (order: any) => {
  selectedOrder.value = order;
  trackingForm.value = {
    tracking_number: order.tracking_number || '',
    shipping_provider: order.shipping_provider || '',
    estimated_delivery: order.estimated_delivery ? new Date(order.estimated_delivery).toISOString().split('T')[0] : '',
    delivery_notes: order.delivery_notes || ''
  };
  showTrackingModal.value = true;
};

const closeTrackingModal = () => {
  showTrackingModal.value = false;
  selectedOrder.value = null;
  trackingForm.value = {
    tracking_number: '',
    shipping_provider: '',
    estimated_delivery: '',
    delivery_notes: ''
  };
};

const saveTrackingInfo = async () => {
  if (!selectedOrder.value) return;
  
  trackingLoading.value = true;
  try {
    const payload = {
      tracking_number: trackingForm.value.tracking_number.trim(),
      shipping_provider: trackingForm.value.shipping_provider,
      estimated_delivery: trackingForm.value.estimated_delivery || null,
      delivery_notes: trackingForm.value.delivery_notes.trim() || null
    };
    
    console.log('💾 Saving tracking info:', payload);
    
    const response = await fetch(
      `${config.backendUrl}/admin/shipping/orders/${selectedOrder.value.order_id}/shipping-info`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const result = await response.json();
    console.log('✅ Tracking info saved:', result);
    
    toast.success('Información de envío actualizada exitosamente');
    closeTrackingModal();
    await loadOrders();
    await loadStatistics();
  } catch (error) {
    console.error('❌ Error saving tracking info:', error);
    toast.error('Error al guardar la información de envío');
  } finally {
    trackingLoading.value = false;
  }
};

// Actions
const markAsShipped = async (orderId: number) => {
  try {
    console.log('🚢 Marking order as shipped:', orderId);
    
    const response = await fetch(
      `${config.backendUrl}/admin/shipping/orders/${orderId}/mark-shipped`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ send_notification: true })
      }
    );
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const result = await response.json();
    console.log('✅ Order marked as shipped:', result);
    
    toast.success(`Pedido #${orderId} marcado como enviado`);
    await loadOrders();
    await loadStatistics();
  } catch (error) {
    console.error('❌ Error marking as shipped:', error);
    toast.error('Error al marcar pedido como enviado');
  }
};

const bulkMarkShipped = async () => {
  if (selectedOrders.value.length === 0) return;
  
  loading.value = true;
  try {
    console.log('🚢 Bulk marking orders as shipped:', selectedOrders.value);
    
    const response = await fetch(
      `${config.backendUrl}/admin/shipping/bulk-actions/mark-shipped`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(selectedOrders.value)
      }
    );
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const result = await response.json();
    console.log('✅ Bulk mark shipped result:', result);
    
    toast.success(`${result.processed} pedidos marcados como enviados`);
    if (result.errors > 0) {
      toast.warning(`${result.errors} pedidos tuvieron errores`);
    }
    
    selectedOrders.value = [];
    await loadOrders();
    await loadStatistics();
  } catch (error) {
    console.error('❌ Error in bulk mark shipped:', error);
    toast.error('Error en operación masiva');
  } finally {
    loading.value = false;
  }
};

const viewOrderDetails = (orderId: number) => {
  router.push(`/orders/${orderId}`);
};

// Selection
const toggleSelectAll = () => {
  if (selectedOrders.value.length === orders.value.length) {
    selectedOrders.value = [];
  } else {
    selectedOrders.value = orders.value
      .filter(order => order.can_add_tracking || order.can_mark_shipped)
      .map(order => order.order_id);
  }
};

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'approved': return 'Aprobado';
    case 'shipped': return 'Enviado';
    case 'delivered': return 'Entregado';
    default: return status;
  }
};

const getShippingStatusClass = (shippingStatus: string) => {
  switch (shippingStatus) {
    case 'pending_shipment': return 'bg-orange-100 text-orange-800';
    case 'ready_to_ship': return 'bg-blue-100 text-blue-800';
    case 'shipped': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getShippingStatusText = (shippingStatus: string) => {
  switch (shippingStatus) {
    case 'pending_shipment': return 'Pendiente de Envío';
    case 'ready_to_ship': return 'Listo para Envío';
    case 'shipped': return 'Enviado';
    default: return 'Sin Estado';
  }
};

const getTrackingPlaceholder = (provider: string) => {
  const hints = {
    'correo-argentino': 'CP123456789AR',
    'oca': '1234567890123',
    'andreani': 'ABC12345678'
  };
  return hints[provider as keyof typeof hints] || 'Número de seguimiento';
};

const getTrackingHint = (provider: string) => {
  const hints = {
    'correo-argentino': 'Formato: 2 letras + 9 números + 2 letras',
    'oca': 'Formato: 10-13 números',
    'andreani': 'Formato: 8-15 caracteres alfanuméricos'
  };
  return hints[provider as keyof typeof hints] || '';
};

const getDeliveryMethodClass = (deliveryMethod: string) => {
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

const getDeliveryMethodText = (deliveryMethod: string) => {
  switch (deliveryMethod) {
    case 'envio_andreani':
      return 'Andreani';
    case 'envio_correo':
      return 'Correo Argentino';
    case 'retiro_local':
      return 'Retiro en Local';
    default:
      return 'No definido';
  }
};

const coordinatePickup = (order: any) => {
  const message = `Hola ${order.customer_name}, tu pedido #${order.order_id} está listo para retirar. 

📦 Total: $${order.total.toLocaleString()}

📍 Dirección: Av. Ejemplo 123, CABA
🕐 Horarios: Lun-Vie 9-18hs, Sáb 9-13hs

¿Cuándo te conviene pasar a retirarlo?`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5491112345678?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

// Modal functions
const openStatusModal = (order: any) => {
  selectedOrder.value = order;
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedOrder.value = null;
};

const openShippingModal = (order: any) => {
  selectedOrder.value = order;
  showShippingModal.value = true;
};

const closeShippingModal = () => {
  showShippingModal.value = false;
  selectedOrder.value = null;
};

// Update order status
const updateOrderStatus = async (orderId: number, status: string, notes: string) => {
  try {
    console.log('🔄 Updating order status:', { orderId, status, notes });
    await ordersApi.updateOrderStatus(orderId, { status, adminNotes: notes });
    
    toast.success('Estado del pedido actualizado exitosamente');
    closeStatusModal();
    await loadOrders();
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    toast.error('Error al actualizar el estado del pedido');
  }
};

// Update order shipping
const updateOrderShipping = async (orderId: number, shippingData: any) => {
  try {
    console.log('🔄 Updating order shipping:', { orderId, shippingData });
    await ordersApi.updateOrderShipping(orderId, shippingData);
    
    toast.success('Información de envío actualizada exitosamente');
    closeShippingModal();
    await loadOrders();
  } catch (error) {
    console.error('❌ Error updating order shipping:', error);
    toast.error('Error al actualizar la información de envío');
  }
};

// Initialize
onMounted(async () => {
  console.log('🚀 Admin Orders View mounted');
  
  // Check admin access
  if (!authStore.hasAdminAccess) {
    toast.error('No tienes permisos para acceder a esta página');
    router.push('/');
    return;
  }
  
  await Promise.all([
    loadOrders(),
    loadStatistics(),
    loadShippingProviders()
  ]);
});
</script>