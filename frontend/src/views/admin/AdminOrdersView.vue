<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 font-heading">Gestión de Envíos</h1>
        <p class="mt-2 text-sm text-gray-600 font-body">
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
                  <dt class="text-sm font-medium text-gray-600 truncate font-body">Pendientes de Envío</dt>
                  <dd class="text-lg font-medium text-gray-900 font-body">{{ statistics.pending_shipment }}</dd>
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
                  <dt class="text-sm font-medium text-gray-600 truncate font-body">Enviados</dt>
                  <dd class="text-lg font-medium text-gray-900 font-body">{{ statistics.shipped_orders }}</dd>
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
                  <dt class="text-sm font-medium text-gray-600 truncate font-body">Tasa de Envío</dt>
                  <dd class="text-lg font-medium text-gray-900 font-body">{{ statistics.shipping_rate_percent }}%</dd>
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
                  <dt class="text-sm font-medium text-gray-600 truncate font-body">Tiempo Promedio</dt>
                  <dd class="text-lg font-medium text-gray-900 font-body">{{ statistics.avg_processing_hours }}h</dd>
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
              class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm w-full max-w-xs bg-white">
              <option value="">Todos</option>
              <option value="pending_shipment">Pendientes de Envío</option>
              <option value="with_tracking">Con Tracking</option>
              <option value="shipped">Enviados</option>
            </select>
          </div>
          
          <button @click="loadOrders" 
            class="btn-outline">
            <svg class="w-4 h-4 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedOrders.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ selectedOrders.length }} seleccionados</span>
          
          <button @click="deleteSelectedOrders" :disabled="loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && allOrders.length === 0" class="py-12 text-center">
        <div class="inline-block w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <p class="mt-2 text-gray-600">Cargando pedidos...</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="overflow-hidden bg-white rounded-lg shadow">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="relative w-10 px-2 sm:px-3">
                  <div class="flex items-center justify-center">
                    <label class="inline-flex items-center cursor-pointer group">
                      <input type="checkbox" 
                        :checked="selectAll"
                        :indeterminate="selectedOrders.length > 0 && !selectAll"
                        @change="toggleSelectAll"
                        :disabled="filteredOrders.length === 0"
                        class="sr-only peer">
                      <div class="relative w-5 h-5 transition-colors duration-200 bg-white border-2 border-blue-500 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:bg-blue-50">
                        <svg class="absolute inset-0 w-4 h-4 m-auto text-white transition-opacity duration-200 opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="sr-only">Seleccionar pedidos</span>
                    </label>
                  </div>
                  <div class="absolute inset-0" title="Seleccionar todos los pedidos" data-tooltip-placement="bottom"></div>
                </th>
                <th scope="col" class="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Pedido
                </th>
                <th scope="col" class="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Cliente
                </th>
                <th scope="col" class="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Total
                </th>
                <th scope="col" class="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Entrega
                </th>
                <th scope="col" class="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Estado
                </th>
                <th scope="col" class="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Seguimiento
                </th>
                <th scope="col" class="px-3 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in filteredOrders" :key="order.order_id" class="hover:bg-gray-50">
                <td class="relative w-10 px-2 sm:px-3">
                  <div class="flex items-center justify-center">
                    <label class="inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        :value="order.order_id"
                        :checked="selectedOrders.includes(order.order_id)"
                        @change="(e) => toggleRowSelection(order.order_id, (e.target as HTMLInputElement).checked)"
                        class="sr-only peer"
                        :title="order.can_mark_shipped ? 'Marcar como enviado' : 'Agregar seguimiento'">
                      <div class="relative w-5 h-5 transition-colors duration-200 bg-white border-2 border-blue-500 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:bg-blue-50">
                        <svg class="absolute inset-0 w-4 h-4 m-auto text-white transition-opacity duration-200 opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="sr-only">{{ order.can_mark_shipped ? 'Marcar como enviado' : 'Agregar seguimiento' }}</span>
                    </label>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div class="text-sm font-medium text-gray-900">#{{ order.order_id }}</div>
                      <div class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3">
                  <div class="text-sm text-gray-900 truncate max-w-32">{{ order.customer_name }}</div>
                  <div class="text-xs text-gray-500 truncate max-w-32">{{ order.customer_email }}</div>
                  <div v-if="order.customer_phone" class="text-xs text-gray-500 truncate">{{ order.customer_phone }}</div>
                </td>
                <td class="px-2 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ order.total.toLocaleString() }}</div>
                  <div class="text-xs">
                    <span :class="getStatusClass(order.status)" class="inline-flex px-1 py-0.5 text-xs font-medium rounded">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                </td>
                <td class="px-2 py-3 whitespace-nowrap">
                  <span :class="getDeliveryMethodClass(order.delivery_method)" 
                    class="inline-flex px-1 py-0.5 text-xs font-medium rounded">
                    {{ getDeliveryMethodText(order.delivery_method) }}
                  </span>
                </td>
                <td class="px-2 py-3 whitespace-nowrap">
                  <span :class="getShippingStatusClass(order.shipping_status)" 
                    class="inline-flex px-1 py-0.5 text-xs font-medium rounded">
                    {{ getShippingStatusText(order.shipping_status) }}
                  </span>
                </td>
                <td class="px-2 py-3 whitespace-nowrap">
                  <div v-if="order.tracking_number" class="text-xs">
                    <div class="font-mono text-gray-900 truncate max-w-24">{{ order.tracking_number }}</div>
                    <div v-if="order.provider_name" class="text-gray-500 truncate">{{ order.provider_name }}</div>
                  </div>
                  <div v-else class="text-xs text-gray-400">Sin asignar</div>
                </td>
                <td class="px-3 py-3 text-sm font-medium text-right whitespace-nowrap">
                  <div class="flex items-center justify-end space-x-2">
                    <!-- Edit Order Button -->
                    <button @click="openEditModal(order)" class="p-1 text-blue-600 hover:text-blue-800" title="Editar pedido">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <!-- Delete Order Button -->
                    <button @click="deleteIndividualOrder(order.order_id)" class="p-1 text-red-600 hover:text-red-800" title="Eliminar pedido">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    <!-- View Details Button -->
                    <button @click="viewOrderDetails(order)" class="p-1 text-gray-600 hover:text-gray-800" title="Ver detalles">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredOrders.length === 0" class="py-12 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
          <p class="mt-1 text-sm text-gray-500">No se encontraron pedidos con los filtros seleccionados.</p>
        </div>
      </div>

      <!-- Add/Edit Tracking Modal -->
      <div v-if="showTrackingModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeTrackingModal"></div>
          
          <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveTrackingInfo">
              <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                      Asignar Información de Envío
                    </h3>
                    <div class="grid grid-cols-1 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Transportista
                        </label>
                        <select 
                          v-model="trackingForm.shippingProvider" 
                          class="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                        >
                          <option value="">Seleccionar transportista</option>
                          <option 
                            v-for="provider in shippingProviders" 
                            :key="provider.id"
                            :value="provider.id"
                          >
                            {{ provider.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Número de seguimiento
                        </label>
                        <input 
                          v-model="trackingForm.trackingNumber"
                          type="text" 
                          class="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                          :placeholder="getTrackingPlaceholder(trackingForm.shippingProvider)"
                        >
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Fecha estimada de entrega
                        </label>
                        <input 
                          v-model="trackingForm.estimatedDelivery"
                          type="date" 
                          class="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                        >
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Notas adicionales
                        </label>
                        <textarea 
                          v-model="trackingForm.shippingNotes"
                          rows="3"
                          class="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                          placeholder="Notas sobre el envío..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" :disabled="trackingLoading"
                  class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm">
                  <span v-if="trackingLoading">Guardando...</span>
                  <span v-else>Guardar</span>
                </button>
                <button type="button" @click="closeTrackingModal"
                  class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Order Status Modal -->
      <OrderStatusModal
        v-if="selectedOrder && selectedOrder.order_id"
        :is-open="showStatusModal"
        :order="selectedOrder as Order"
        @close="closeStatusModal"
        @update-status="updateOrderStatus"
      />

      <!-- Edit Order Modal -->
      <EditOrderModal 
        v-if="editingOrder"
        :is-open="!!editingOrder"
        :order="editingOrder"
        :shipping-providers="shippingProviders"
        @save="handleSaveOrder"
        @close="editingOrder = null"
      />

      <!-- Shipping Modal -->
      <ShippingModal
        v-if="selectedOrder && selectedOrder.order_id"
        :is-open="showShippingModal"
        :order="selectedOrder as Order"
        @close="closeShippingModal"
        @update-shipping="updateOrderShipping"
      />

      <!-- Order Details Modal -->
      <div v-if="showOrderDetailsModal && selectedOrder" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeOrderDetailsModal"></div>
          
          <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
            <div class="px-4 pt-5 pb-4 bg-white sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Detalles del Pedido #{{ selectedOrder.order_id }}
                </h3>
                <button @click="closeOrderDetailsModal" class="text-gray-400 hover:text-gray-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Customer Information -->
                <div class="p-4 rounded-lg bg-gray-50">
                  <h4 class="mb-3 text-sm font-semibold text-gray-900">Información del Cliente</h4>
                  <div class="space-y-2">
                    <div>
                      <span class="text-xs text-gray-500">Nombre:</span>
                      <p class="text-sm text-gray-900">{{ selectedOrder.customer_name }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Email:</span>
                      <p class="text-sm text-gray-900">{{ selectedOrder.customer_email }}</p>
                    </div>
                    <div v-if="selectedOrder.customer_phone">
                      <span class="text-xs text-gray-500">Teléfono:</span>
                      <p class="text-sm text-gray-900">{{ selectedOrder.customer_phone }}</p>
                    </div>
                  </div>
                </div>

                <!-- Order Information -->
                <div class="p-4 rounded-lg bg-gray-50">
                  <h4 class="mb-3 text-sm font-semibold text-gray-900">Información del Pedido</h4>
                  <div class="space-y-2">
                    <div>
                      <span class="text-xs text-gray-500">Estado:</span>
                      <span :class="getStatusClass(selectedOrder.status)" 
                        class="inline-flex px-2 py-1 ml-1 text-xs font-semibold rounded-full">
                        {{ getStatusText(selectedOrder.status) }}
                      </span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Total:</span>
                      <p class="text-sm font-semibold text-gray-900">${{ selectedOrder.total?.toLocaleString() }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Fecha:</span>
                      <p class="text-sm text-gray-900">{{ formatDate(selectedOrder.created_at) }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Método de Pago:</span>
                      <p class="text-sm text-gray-900">{{ selectedOrder.payment_method }}</p>
                    </div>
                  </div>
                </div>

                <!-- Shipping Information -->
                <div class="p-4 rounded-lg bg-gray-50 md:col-span-2">
                  <h4 class="mb-3 text-sm font-semibold text-gray-900">Información de Envío</h4>
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <span class="text-xs text-gray-500">Dirección de Envío:</span>
                      <p class="text-sm text-gray-900">{{ selectedOrder.shipping_address || 'No especificada' }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Método de Entrega:</span>
                      <span :class="getDeliveryMethodClass(selectedOrder.delivery_method)" 
                        class="inline-flex px-2 py-1 ml-1 text-xs font-semibold rounded-full">
                        {{ getDeliveryMethodText(selectedOrder.delivery_method) }}
                      </span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500">Estado de Envío:</span>
                      <span :class="getShippingStatusClass(selectedOrder.shipping_status)" 
                        class="inline-flex px-2 py-1 ml-1 text-xs font-semibold rounded-full">
                        {{ getShippingStatusText(selectedOrder.shipping_status) }}
                      </span>
                    </div>
                    <div v-if="selectedOrder.tracking_number">
                      <span class="text-xs text-gray-500">Número de Seguimiento:</span>
                      <p class="font-mono text-sm text-gray-900">{{ selectedOrder.tracking_number }}</p>
                      <p v-if="selectedOrder.provider_name" class="text-xs text-gray-500">{{ selectedOrder.provider_name }}</p>
                    </div>
                  </div>
                  <div v-if="selectedOrder.shipped_at" class="mt-4">
                    <span class="text-xs text-gray-500">Fecha de Envío:</span>
                    <p class="text-sm text-gray-900">{{ formatDate(selectedOrder.shipped_at) }}</p>
                    <div v-if="selectedOrder.estimated_delivery" class="mt-1">
                      <span class="text-xs text-gray-500">Fecha Estimada de Entrega:</span>
                      <p class="text-sm text-gray-900">{{ formatDate(selectedOrder.estimated_delivery) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div v-if="selectedOrder.notes" class="p-4 rounded-lg bg-gray-50 md:col-span-2">
                  <h4 class="mb-2 text-sm font-semibold text-gray-900">Notas</h4>
                  <p class="text-sm text-gray-700">{{ selectedOrder.notes }}</p>
                </div>
              </div>
            </div>
            
            <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="closeOrderDetailsModal"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../store/auth';
import type { Order, AdminStats, OrderStatistics } from '../../types/orders/order.types';
import type { ShippingProvider } from '../../types/orders/shipping.types';
import { 
  createCompleteOrder, 
  formatDate, 
  safeString, 
  toStringOrNull 
} from '../../utils/orderUtils';
import EditOrderModal from '../../components/orders/EditOrderModal.vue';
import OrderStatusModal from '../../components/orders/OrderStatusModal.vue';
import ShippingModal from '../../components/checkout/ShippingModal.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { ordersApi } from '../../config/api';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const getStatusClass = (status: string | undefined): string => {
  if (!status) return 'bg-gray-100 text-gray-800';
  const statusClasses: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-green-100 text-green-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  };
  return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string | undefined): string => {
  if (!status) return 'Desconocido';
  const statusText: Record<string, string> = {
    'pending': 'Pendiente',
    'processing': 'En proceso',
    'shipped': 'Enviado',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado',
    'refunded': 'Reembolsado'
  };
  return statusText[status.toLowerCase()] || status;
};

const getShippingStatusClass = (status: string | undefined): string => {
  if (!status) return 'bg-gray-100 text-gray-800';
  const statusClasses: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_transit': 'bg-blue-100 text-blue-800',
    'out_for_delivery': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  };
  return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

const getShippingStatusText = (status: string | undefined): string => {
  if (!status) return 'Desconocido';
  const statusText: Record<string, string> = {
    'pending': 'Pendiente',
    'in_transit': 'En tránsito',
    'out_for_delivery': 'En reparto',
    'delivered': 'Entregado',
    'failed': 'Error en entrega'
  };
  return statusText[status.toLowerCase()] || status;
};

const getDeliveryMethodClass = (method: string | null | undefined): string => {
  if (!method) return 'bg-gray-100 text-gray-800';
  const methodClasses: Record<string, string> = {
    'standard': 'bg-blue-100 text-blue-800',
    'express': 'bg-purple-100 text-purple-800',
    'pickup': 'bg-green-100 text-green-800'
  };
  return methodClasses[method.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

const getDeliveryMethodText = (method: string | null | undefined): string => {
  if (!method) return 'No especificado';
  const methodText: Record<string, string> = {
    'standard': 'Estándar',
    'express': 'Express',
    'pickup': 'Recogida en tienda'
  };
  return methodText[method.toLowerCase()] || method;
};

const getTrackingPlaceholder = (providerCode: string | undefined): string => {
  return providerCode ? `Ej: ${providerCode.toUpperCase()}1234567890` : 'Número de seguimiento';
};

const getTrackingHint = (providerCode: string | undefined): string => {
  return providerCode ? `Formato: ${providerCode.toUpperCase()} + 10 dígitos` : 'Ingrese el número de seguimiento';
};

// State
const loading = ref(true);
const trackingLoading = ref(false);
const allOrders = ref<Order[]>([]); // Almacena todos los pedidos

// Form and modal state
const trackingForm = ref({
  trackingNumber: '',
  shippingProvider: '',
  estimatedDelivery: '',
  shippingNotes: ''
});

// Modal visibility states
const showTrackingModal = ref(false);
const showOrderDetailsModal = ref(false);
const showShippingModal = ref(false);
const showStatusModal = ref(false);

// Selection and data
const selectedOrders = ref<number[]>([]);
const selectAll = ref(false);
const statistics = ref<any>(null);
const shippingProviders = ref<any[]>([]);
const statusFilter = ref('');
const selectedOrder = ref<Order | null>(null);
const editingOrder = ref<Order | null>(null);
const trackingNumber = ref('');
const selectedProvider = ref('');

// Propiedad computada para los pedidos filtrados
const filteredOrders = computed(() => {
  if (!statusFilter.value) return allOrders.value;
  
  return allOrders.value.filter(order => {
    switch(statusFilter.value) {
      case 'pending_shipment':
        return (order.shipping_status === 'pending' || order.shipping_status === 'preparing') && 
               !order.tracking_number;
      case 'with_tracking':
        return order.tracking_number && 
               order.shipping_status !== 'delivered' &&
               order.shipping_status !== 'shipped';
      case 'shipped':
        return order.shipping_status === 'shipped' || 
               order.shipping_status === 'delivered' ||
               order.shipping_status === 'in_transit';
      default:
        return true;
    }
  });
});

// Modal handlers
const openStatusModal = (order: Order) => {
  if (!order?.order_id) return;
  selectedOrder.value = createCompleteOrder(order);
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedOrder.value = null;
};

const openTrackingModal = (order: Order) => {
  if (!order) return;
  // Crear un objeto Order completo con valores por defecto
  const orderWithDefaults: Order = {
    order_id: order.order_id,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone || '',
    shipping_address: order.shipping_address,
    status: order.status,
    shipping_status: order.shipping_status,
    tracking_number: order.tracking_number || '',
    shipping_provider: order.shipping_provider || '',
    provider_name: order.provider_name || '',
    notes: order.notes || '',
    can_add_tracking: order.can_add_tracking || false,
    can_mark_shipped: order.can_mark_shipped || false,
    can_coordinate_pickup: order.can_coordinate_pickup || false,
    created_at: order.created_at || new Date().toISOString(),
    shipped_at: order.shipped_at,
    estimated_delivery: order.estimated_delivery || '',
    delivery_method: order.delivery_method || 'standard',
    total: order.total || 0,
    payment_method: order.payment_method || 'unknown'
  };
  
  // Initialize tracking form with order data
  trackingForm.value = {
    trackingNumber: order.tracking_number || '',
    shippingProvider: order.shipping_provider || '',
    estimatedDelivery: order.estimated_delivery || '',
    shippingNotes: order.notes || ''
  };
  
  selectedOrder.value = orderWithDefaults;
  showTrackingModal.value = true;
};

const closeTrackingModal = () => {
  showTrackingModal.value = false;
  trackingForm.value = {
    trackingNumber: '',
    shippingProvider: '',
    estimatedDelivery: '',
    shippingNotes: ''
  };
  selectedOrder.value = null;
};

const closeShippingModal = () => {
  showShippingModal.value = false;
  selectedOrder.value = null;
};

const closeOrderDetailsModal = () => {
  showOrderDetailsModal.value = false;
  selectedOrder.value = null;
};

const openEditModal = (order: Order) => {
  editingOrder.value = { ...order };
};

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = { ...order };
  showOrderDetailsModal.value = true;
};

// Handle save order
const handleSaveOrder = async (updatedOrder: Order) => {
  try {
    loading.value = true;
    await ordersApi.updateOrder(updatedOrder.order_id, updatedOrder);
    await loadOrders();
    toast.success('Pedido actualizado correctamente');
    editingOrder.value = null;
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    toast.error('Error al actualizar el pedido');
  } finally {
    loading.value = false;
  }
};

// Save tracking information
const saveTrackingInfo = async () => {
  if (!selectedOrder.value) return;
  
  try {
    trackingLoading.value = true;
    const shippingData = {
      trackingNumber: trackingForm.value.trackingNumber,
      shippingProvider: trackingForm.value.shippingProvider,
      estimatedDelivery: trackingForm.value.estimatedDelivery,
      shippingNotes: trackingForm.value.shippingNotes
    };
    
    await ordersApi.updateOrderShipping(selectedOrder.value.order_id, shippingData);
    
    await loadOrders();
    showTrackingModal.value = false;
    toast.success('Información de envío actualizada');
    
    // Reset form
    trackingForm.value = {
      trackingNumber: '',
      shippingProvider: '',
      estimatedDelivery: '',
      shippingNotes: ''
    };
  } catch (error) {
    console.error('Error al guardar la información de envío:', error);
    toast.error('Error al guardar la información de envío');
  } finally {
    trackingLoading.value = false;
  }
};

// Coordinate pickup for an order
const coordinatePickup = async (order: Order) => {
  try {
    loading.value = true;
    await ordersApi.updateOrderStatus(order.order_id, {
      status: 'ready_for_pickup',
      adminNotes: 'El cliente será notificado para coordinar la recogida'
    });
    await loadOrders();
    toast.success('Pedido listo para recogida. Se notificará al cliente.');
  } catch (error) {
    console.error('Error al coordinar la recogida:', error);
    toast.error('Error al coordinar la recogida');
  } finally {
    loading.value = false;
  }
};

const markAsShipped = async (order: Order | number) => {
  const orderId = typeof order === 'number' ? order : order.order_id;
  
  try {
    loading.value = true;
    await ordersApi.updateOrderStatus(orderId, { status: 'shipped' });
    await loadOrders();
    toast.success('Pedido marcado como enviado');
  } catch (error) {
    console.error('Error al marcar el pedido como enviado:', error);
    toast.error('Error al marcar el pedido como enviado');
  } finally {
    loading.value = false;
  }
};

const updateOrderStatus = async (orderId: number, status: string, notes: string = '') => {
  try {
    loading.value = true;
    await ordersApi.updateOrderStatus(orderId, { status, adminNotes: notes });
    await loadOrders();
    toast.success('Estado del pedido actualizado');
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    toast.error('Error al actualizar el estado del pedido');
  } finally {
    loading.value = false;
  }
};

// Order actions
const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    // Seleccionar todos los pedidos visibles
    const newSelected = new Set(selectedOrders.value);
    filteredOrders.value.forEach((order: Order) => newSelected.add(order.order_id));
    selectedOrders.value = Array.from(newSelected);
  } else {
    // Deseleccionar solo los pedidos visibles
    const visibleOrderIds = new Set(filteredOrders.value.map((o: Order) => o.order_id));
    selectedOrders.value = selectedOrders.value.filter(id => !visibleOrderIds.has(id));
  }
  updateSelectAllState();
};

// Actualizar el estado del checkbox de selección múltiple
const updateSelectAllState = () => {
  if (filteredOrders.value.length === 0) {
    selectAll.value = false;
    return;
  }
  
  // Verificar si todos los pedidos visibles están seleccionados
  const allSelected = filteredOrders.value.every((order: Order) => 
    selectedOrders.value.includes(order.order_id)
  );
  
  selectAll.value = allSelected;
};

// Alternar selección de una fila individual
const toggleRowSelection = (orderId: number, isChecked: boolean) => {
  if (isChecked) {
    if (!selectedOrders.value.includes(orderId)) {
      selectedOrders.value = [...selectedOrders.value, orderId];
    }
  } else {
    selectedOrders.value = selectedOrders.value.filter(id => id !== orderId);
  }
  updateSelectAllState();
};

const bulkMarkShipped = async () => {
  if (selectedOrders.value.length === 0) return;
  
  try {
    loading.value = true;
    await ordersApi.bulkMarkAsShipped(selectedOrders.value);
    await loadOrders();
    selectedOrders.value = [];
    selectAll.value = false;
    toast.success('Pedidos marcados como enviados correctamente');
  } catch (error) {
    console.error('Error al marcar los pedidos como enviados:', error);
    toast.error('Error al actualizar los pedidos');
  } finally {
    loading.value = false;
  }
};

const loadOrders = async () => {
  try {
    loading.value = true;
    const response = await ordersApi.getOrdersWithCustomerInfo();
    
    // Guardar todos los pedidos
    allOrders.value = response.map((order: any): Order => {
      // Transformación de datos original
      return {
        order_id: Number(order.order_id || order.id) || 0,
        status: order.status || 'pending',
        shipping_status: order.shipping_status || 'pending',
        customer_name: order.customer?.name || order.customer_name || 'Cliente no encontrado',
        customer_email: order.customer?.email || order.customer_email || '',
        shipping_address: order.shipping_address || '',
        total: Number(order.total) || 0,
        payment_method: order.payment_method || 'credit_card',
        created_at: order.created_at || new Date().toISOString(),
        customer_phone: toStringOrNull(order.customer?.phone || order.customer_phone),
        tracking_number: toStringOrNull(order.tracking_number),
        shipping_provider: toStringOrNull(order.shipping_provider),
        provider_name: toStringOrNull(order.provider_name),
        notes: toStringOrNull(order.notes),
        shipped_at: order.shipped_at || undefined,
        estimated_delivery: order.estimated_delivery || undefined,
        delivery_method: order.delivery_method || undefined,
        can_add_tracking: Boolean(order.can_add_tracking) || (order.shipping_status === 'preparing' || order.shipping_status === 'ready_to_ship'),
        can_mark_shipped: Boolean(order.can_mark_shipped) || (order.shipping_status === 'ready_to_ship' || order.tracking_number),
        can_coordinate_pickup: Boolean(order.can_coordinate_pickup) || (order.delivery_method === 'local_pickup' && order.status === 'approved')
      };
    });
    
    // ...
  } catch (error: any) {
    // ...
  } finally {
    loading.value = false;
  }
};

const updateOrderShipping = async (orderId: number, shippingData: any) => {
  try {
    console.log('Updating order shipping:', { orderId, shippingData });
    await ordersApi.updateOrderShipping(orderId, shippingData);
    
    toast.success('Información de envío actualizada exitosamente');
    closeShippingModal();
    await loadOrders();
  } catch (error) {
    console.error('Error updating order shipping:', error);
    toast.error('Error al actualizar la información de envío');
  }
};

// Load statistics
const loadStatistics = async () => {
  try {
    // Fallback to default stats if API call fails
    statistics.value = {
      pending_shipment: 0,
      shipped: 0,
      delivered: 0,
      total: 0
    };
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
};

// Load shipping providers
const loadShippingProviders = async () => {
  try {
    const providers = await ordersApi.getShippingProviders();
    shippingProviders.value = providers;
  } catch (error) {
    console.error('Error loading shipping providers:', error);
  }
};

// Delete selected orders
const deleteSelectedOrders = async () => {
  if (selectedOrders.value.length === 0) {
    toast.warning('Por favor selecciona al menos un pedido para eliminar');
    return;
  }

  if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedOrders.value.length} pedido(s)?`)) {
    return;
  }

  try {
    loading.value = true;
    await Promise.all(selectedOrders.value.map(id => ordersApi.deleteOrder(id)));
    toast.success('Pedidos eliminados exitosamente');
    selectedOrders.value = [];
    selectAll.value = false;
    await loadOrders();
  } catch (error) {
    console.error('Error al eliminar pedidos:', error);
    toast.error('Error al eliminar pedidos');
  } finally {
    loading.value = false;
  }
};

// Delete individual order
const deleteIndividualOrder = async (orderId: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
    return;
  }

  try {
    loading.value = true;
    await ordersApi.deleteOrder(orderId);
    toast.success('Pedido eliminado exitosamente');
    await loadOrders();
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    toast.error('Error al eliminar pedido');
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(async () => {
  console.log('Admin Orders View mounted');
  
  // Check admin access
  if (!authStore.hasAdminAccess) {
    toast.error('No tienes permisos para acceder a esta página');
    router.push('/');
    return;
  }
  
  try {
    await Promise.all([
      loadOrders(),
      loadStatistics(),
      loadShippingProviders()
    ]);
  } catch (error) {
    console.error('Error initializing component:', error);
  } finally {
    loading.value = false;
  }
});
</script>
