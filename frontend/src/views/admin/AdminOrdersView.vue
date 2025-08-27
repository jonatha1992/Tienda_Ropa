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
              class="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos</option>
              <option value="pending_shipment">Pendientes de Envío</option>
              <option value="with_tracking">Con Tracking</option>
              <option value="shipped">Enviados</option>
            </select>
          </div>
          
          <button @click="loadOrders" 
            class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedOrders.length > 0 || selectedOrdersForDeletion.length > 0" class="flex items-center space-x-2">
          <span v-if="selectedOrders.length > 0" class="text-sm text-gray-500">{{ selectedOrders.length }} para envío</span>
          <span v-if="selectedOrdersForDeletion.length > 0" class="text-sm text-red-500">{{ selectedOrdersForDeletion.length }} para eliminar</span>
          <button v-if="selectedOrders.length > 0" @click="bulkMarkShipped" :disabled="loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Marcar como Enviados
          </button>
          <button v-if="selectedOrdersForDeletion.length > 0" @click="bulkDeleteOrders" :disabled="loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar Seleccionados
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && orders.length === 0" class="py-12 text-center">
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
                        :checked="selectedOrders.length === orders.filter(order => order.can_add_tracking || order.can_mark_shipped).length && orders.filter(order => order.can_add_tracking || order.can_mark_shipped).length > 0"
                        @change="toggleSelectAll"
                        class="sr-only peer">
                      <div class="relative w-5 h-5 bg-white border-2 border-blue-500 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:bg-blue-50 transition-colors duration-200">
                        <svg class="absolute inset-0 w-4 h-4 m-auto text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="sr-only">Seleccionar todo para envío</span>
                    </label>
                  </div>
                  <div class="absolute inset-0" title="Seleccionar todo para envío" data-tooltip-placement="bottom"></div>
                </th>
                <th scope="col" class="relative w-10 px-2 sm:px-3">
                  <div class="flex items-center justify-center">
                    <label class="inline-flex items-center cursor-pointer group">
                      <input type="checkbox" 
                        :checked="selectedOrdersForDeletion.length === orders.length && orders.length > 0"
                        @change="toggleSelectAllForDeletion"
                        class="sr-only peer">
                      <div class="relative w-5 h-5 bg-white border-2 border-red-500 rounded-md peer-checked:bg-red-500 peer-checked:border-red-500 peer-hover:bg-red-50 transition-colors duration-200">
                        <svg class="absolute inset-0 w-4 h-4 m-auto text-white opacity-0 transition-colors duration-200 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span class="sr-only">Seleccionar todo para eliminar</span>
                    </label>
                  </div>
                  <div class="absolute inset-0" title="Seleccionar todo para eliminar" data-tooltip-placement="bottom"></div>
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
                <th scope="col" class="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.order_id" class="hover:bg-gray-50">
                <td class="relative w-10 px-2 sm:px-3">
                  <div class="flex items-center justify-center">
                    <label v-if="order.can_add_tracking || order.can_mark_shipped" class="inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        :value="order.order_id"
                        v-model="selectedOrders"
                        class="sr-only peer"
                        :title="order.can_mark_shipped ? 'Marcar como enviado' : 'Agregar seguimiento'">
                      <div class="relative w-5 h-5 bg-white border-2 border-blue-500 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-hover:bg-blue-50 transition-colors duration-200">
                        <svg class="absolute inset-0 w-4 h-4 m-auto text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="sr-only">{{ order.can_mark_shipped ? 'Marcar como enviado' : 'Agregar seguimiento' }}</span>
                    </label>
                  </div>
                </td>
                <td class="relative w-10 px-2 sm:px-3">
                  <div class="flex items-center justify-center">
                    <label class="inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        :value="order.order_id"
                        v-model="selectedOrdersForDeletion"
                        class="sr-only peer">
                      <div class="relative w-5 h-5 bg-white border-2 border-red-500 rounded-md peer-checked:bg-red-500 peer-checked:border-red-500 peer-hover:bg-red-50 transition-colors duration-200">
                        <svg class="absolute inset-0 w-4 h-4 m-auto text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span class="sr-only">Eliminar pedido</span>
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
                    <button @click="openEditModal(order)"
                      class="btn-blue btn-icon" title="Editar pedido">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <!-- Change Payment Status Button -->
                    <button v-if="order.status === 'pending'" @click="openStatusModal(order)"
                      class="btn-yellow btn-icon" title="Cambiar estado de pago">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span class="sr-only">Cambiar estado</span>
                    </button>

                    <!-- Add Tracking Button (for shipping orders) -->
                    <button v-if="order.can_add_tracking" @click="openTrackingModal(order)"
                      class="btn-blue btn-icon" title="Agregar tracking">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span class="sr-only">Agregar tracking</span>
                    </button>
                    
                    <!-- Coordinate Pickup Button (for local pickup orders) -->
                    <button v-if="order.can_coordinate_pickup" @click="coordinatePickup(order)"
                      class="btn-purple btn-icon" title="Coordinar retiro por WhatsApp">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span class="sr-only">Coordinar retiro</span>
                    </button>
                    
                    <!-- Mark as Shipped Button -->
                    <button v-if="order.can_mark_shipped" @click="markAsShipped(order.order_id)"
                      class="btn-green btn-icon">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span class="sr-only">Marcar como enviado</span>
                    </button>
                    
                    <!-- View Details Button -->
                    <button @click="viewOrderDetails(order.order_id)"
                      class="btn-primary btn-icon">
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
        <div v-if="!loading && orders.length === 0" class="py-12 text-center">
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
                    <div class="mt-4 space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Proveedor de Envío</label>
                        <select v-model="trackingForm.shipping_provider" required
                          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
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
                          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <p v-if="trackingForm.shipping_provider" class="mt-1 text-xs text-gray-500">
                          {{ getTrackingHint(trackingForm.shipping_provider) }}
                        </p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
                        <input type="date" v-model="trackingForm.estimated_delivery"
                          :min="new Date().toISOString().split('T')[0]"
                          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Notas del Envío (opcional)</label>
                        <textarea v-model="trackingForm.delivery_notes" rows="3"
                          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </textarea>
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
        v-if="editingOrder && editingOrder.order_id"
        :is-open="showEditModal"
        :order="editingOrder as Order"
        :shipping-providers="shippingProviders"
        @close="closeEditModal"
        @save="handleSaveOrder"
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
const orders = ref<Order[]>([]);
const statistics = ref<OrderStatistics | null>(null);
const shippingProviders = ref<ShippingProvider[]>([]);
const showTrackingModal = ref(false);
const showStatusModal = ref(false);
const showEditModal = ref(false);
const showShippingModal = ref(false);
const showOrderDetailsModal = ref(false);

// Use Partial<Order> to allow for incomplete order objects
const selectedOrder = ref<Partial<Order> | null>(null);
const editingOrder = ref<Partial<Order> | null>(null);

const selectedProvider = ref('');
const trackingNumber = ref('');
const selectedOrders = ref<number[]>([]);
const selectedOrdersForDeletion = ref<number[]>([]);
const selectAll = ref(false);
const statusFilter = ref('all');
const dateFilter = ref('');
const searchQuery = ref('');

const trackingForm = ref({
  tracking_number: '',
  shipping_provider: '',
  estimated_delivery: '',
  delivery_notes: ''
});

// Edit Order Modal functions
const openEditModal = (order: Order) => {
  if (!order) return;
  editingOrder.value = createCompleteOrder(order);
  showEditModal.value = true;
};

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

const closeEditModal = () => {
  showEditModal.value = false;
  editingOrder.value = null;
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
  selectedOrder.value = orderWithDefaults;
  trackingNumber.value = order.tracking_number || '';
  selectedProvider.value = order.shipping_provider || '';
  showTrackingModal.value = true;
};

const closeTrackingModal = () => {
  showTrackingModal.value = false;
  trackingNumber.value = '';
  selectedProvider.value = '';
  selectedOrder.value = null;
};

// Order actions
const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedOrders.value = orders.value
      .filter(order => order.can_add_tracking || order.can_mark_shipped)
      .map(order => order.order_id);
  } else {
    selectedOrders.value = [];
  }
};

const toggleSelectAllForDeletion = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedOrdersForDeletion.value = orders.value.map(order => order.order_id);
  } else {
    selectedOrdersForDeletion.value = [];
  }
};

const bulkMarkShipped = async () => {
  if (selectedOrders.value.length === 0) return;
  
  try {
    await ordersApi.bulkMarkAsShipped(selectedOrders.value);
    await loadOrders();
    selectedOrders.value = [];
    toast.success('Pedidos marcados como enviados correctamente');
  } catch (error) {
    console.error('Error al marcar los pedidos como enviados:', error);
    toast.error('Error al actualizar los pedidos');
  }
};

const bulkDeleteOrders = async () => {
  if (selectedOrdersForDeletion.value.length === 0) return;
  
  const confirmed = confirm(`¿Está seguro de que desea eliminar ${selectedOrdersForDeletion.value.length} pedidos? Esta acción no se puede deshacer.`);
  if (!confirmed) return;
  
  try {
    // Delete orders one by one since there's no bulk delete API
    for (const orderId of selectedOrdersForDeletion.value) {
      await ordersApi.deleteOrder(orderId);
    }
    
    await loadOrders();
    selectedOrdersForDeletion.value = [];
    toast.success('Pedidos eliminados correctamente');
  } catch (error) {
    console.error('Error al eliminar los pedidos:', error);
    toast.error('Error al eliminar los pedidos');
  }
};

const markAsShipped = async (order: Order | number) => {
  // Obtener el ID del pedido
  const orderId = typeof order === 'number' ? order : order?.order_id;
  if (!orderId) return;
  
  // Obtener el objeto de pedido completo si solo se proporcionó el ID
  let orderData: Order;
  if (typeof order === 'number') {
    const foundOrder = orders.value.find(o => o.order_id === order);
    if (!foundOrder) return;
    orderData = foundOrder;
  } else {
    orderData = order;
  }
  
  // Asegurarse de que el pedido tenga los campos requeridos
  const orderToUpdate: Order = {
    order_id: orderData.order_id,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone || '',
    shipping_address: orderData.shipping_address,
    status: orderData.status,
    shipping_status: orderData.shipping_status,
    tracking_number: orderData.tracking_number || '',
    shipping_provider: orderData.shipping_provider || '',
    provider_name: orderData.provider_name || '',
    notes: orderData.notes || '',
    can_add_tracking: orderData.can_add_tracking || false,
    can_mark_shipped: orderData.can_mark_shipped || false,
    can_coordinate_pickup: orderData.can_coordinate_pickup || false,
    created_at: orderData.created_at || new Date().toISOString(),
    shipped_at: orderData.shipped_at,
    estimated_delivery: orderData.estimated_delivery || '',
    delivery_method: orderData.delivery_method || 'standard',
    total: orderData.total || 0,
    payment_method: orderData.payment_method || 'unknown'
  };
  try {
    await ordersApi.markOrderAsShipped(orderId);
    await loadOrders();
    toast.success('Pedido marcado como enviado');
  } catch (error) {
    console.error('Error al marcar el pedido como enviado:', error);
    toast.error('Error al actualizar el pedido');
  }
};

const coordinatePickup = (order: Order | number) => {
  // Obtener el ID del pedido
  const orderId = typeof order === 'number' ? order : order?.order_id;
  if (!orderId) return;
  
  // Obtener el objeto de pedido completo si solo se proporcionó el ID
  let orderData: Order;
  if (typeof order === 'number') {
    const foundOrder = orders.value.find(o => o.order_id === order);
    if (!foundOrder) return;
    orderData = foundOrder;
  } else {
    orderData = order;
  }
  
  // Asegurarse de que el pedido tenga los campos requeridos
  const orderToProcess: Order = {
    order_id: orderData.order_id,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone || '',
    shipping_address: orderData.shipping_address,
    status: orderData.status,
    shipping_status: orderData.shipping_status,
    tracking_number: orderData.tracking_number || '',
    shipping_provider: orderData.shipping_provider || '',
    provider_name: orderData.provider_name || '',
    notes: orderData.notes || '',
    can_add_tracking: orderData.can_add_tracking || false,
    can_mark_shipped: orderData.can_mark_shipped || false,
    can_coordinate_pickup: orderData.can_coordinate_pickup || false,
    created_at: orderData.created_at || new Date().toISOString(),
    shipped_at: orderData.shipped_at,
    estimated_delivery: orderData.estimated_delivery || '',
    delivery_method: orderData.delivery_method || 'standard',
    total: orderData.total || 0,
    payment_method: orderData.payment_method || 'unknown'
  };
  // Implementar lógica de coordinación de recogida
  console.log('Coordinando recogida para el pedido:', orderId);
  toast.info('Funcionalidad de coordinación de recogida en desarrollo');
};

const viewOrderDetails = (order: Order | number) => {
  // Obtener el objeto de pedido completo
  let orderData: Order;
  if (typeof order === 'number') {
    const foundOrder = orders.value.find(o => o.order_id === order);
    if (!foundOrder) return;
    orderData = foundOrder;
  } else {
    orderData = order;
  }
  
  selectedOrder.value = createCompleteOrder(orderData);
  showOrderDetailsModal.value = true;
};

const closeOrderDetailsModal = () => {
  showOrderDetailsModal.value = false;
  selectedOrder.value = null;
};

const saveTrackingInfo = async () => {
  if (!selectedOrder.value?.order_id) return;
  
  try {
    trackingLoading.value = true;
    await ordersApi.updateOrderShipping(selectedOrder.value.order_id, {
      trackingNumber: trackingNumber.value,
      shippingProvider: selectedProvider.value
    });

    await loadOrders();
    closeTrackingModal();
    toast.success('Información de seguimiento actualizada');
  } catch (error) {
    console.error('Error al guardar la información de seguimiento:', error);
    toast.error('Error al actualizar el seguimiento');
  } finally {
    trackingLoading.value = false;
  }
};

// Cargar pedidos
const loadOrders = async () => {
  try {
    loading.value = true;
    const ordersData = await ordersApi.getOrdersWithCustomerInfo();
    
    // Transform the data to match the Order interface using our utility functions
    orders.value = ordersData.map((order: any): Order => {

      // Create the order object with proper typing using our utility functions
      const orderData: Order = {
        // Required fields with defaults
        order_id: Number(order.order_id || order.id) || 0,
        status: order.status || 'pending',
        shipping_status: order.shipping_status || 'pending',
        customer_name: order.customer?.name || order.customer_name || 'Cliente no encontrado',
        customer_email: order.customer?.email || order.customer_email || '',
        shipping_address: order.shipping_address || '',
        total: Number(order.total) || 0,
        payment_method: order.payment_method || 'credit_card',
        created_at: order.created_at || new Date().toISOString(),
        
        // Optional fields with proper null handling using utility functions
        customer_phone: toStringOrNull(order.customer?.phone || order.customer_phone),
        tracking_number: toStringOrNull(order.tracking_number),
        shipping_provider: toStringOrNull(order.shipping_provider),
        provider_name: toStringOrNull(order.provider_name),
        notes: toStringOrNull(order.notes),
        shipped_at: order.shipped_at ? order.shipped_at : undefined,
        estimated_delivery: order.estimated_delivery ? order.estimated_delivery : undefined,
        delivery_method: order.delivery_method ? order.delivery_method : undefined,
        
        // Computed properties based on order status
        can_add_tracking: Boolean(order.can_add_tracking) || (order.shipping_status === 'preparing' || order.shipping_status === 'ready_to_ship'),
        can_mark_shipped: Boolean(order.can_mark_shipped) || (order.shipping_status === 'ready_to_ship' || order.tracking_number),
        can_coordinate_pickup: Boolean(order.can_coordinate_pickup) || (order.delivery_method === 'local_pickup' && order.status === 'approved')
      };
      
      return orderData;
    });
  } catch (error: any) {
    console.error('âŒ Error fetching orders:', error);
    
    if (error.isHtmlResponse) {
      toast.error('No se pudo conectar con el servidor. Por favor verifica que el backend estÃ© en ejecución.');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        toast.error('No tienes permisos para ver los pedidos. Por favor inicia sesión nuevamente.');
      } else if (error.response.status === 401) {
        toast.error('SesiÃ³n expirada. Por favor inicia sesión nuevamente.');
        // Redirect to login
        router.push('/login');
      } else {
        toast.error(`Error al cargar los pedidos: ${error.response.data?.message || error.message}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.');
    } else {
      // Something happened in setting up the request
      toast.error(`Error: ${error.message}`);
    }
    console.error('Error al cargar los pedidos:', error);
    toast.error('Error al cargar los pedidos');
  } finally {
    loading.value = false;
  }
};

// Cargar estadísticas
const loadStatistics = async () => {
  try {
    statistics.value = await ordersApi.getAdminStats();
  } catch (error) {
    console.error('Error al cargar las estadísticas:', error);
    toast.error('Error al cargar las estadísticas');
  }
};

// Cargar transportistas
const loadShippingProviders = async () => {
  try {
    shippingProviders.value = await ordersApi.getShippingProviders();
  } catch (error) {
    console.error('Error al cargar los transportistas:', error);
    toast.error('Error al cargar los transportistas');
  }
};

const handleSaveOrder = async (updatedOrder: Partial<Order>) => {
  if (!updatedOrder.order_id) {
    console.error('Error: order_id is required');
    return;
  }
  
  // Asegurarse de que el pedido tenga los campos requeridos
  const orderToSave: Order = {
    // Required fields with defaults
    order_id: updatedOrder.order_id,
    customer_name: updatedOrder.customer_name || '',
    customer_email: updatedOrder.customer_email || '',
    shipping_address: updatedOrder.shipping_address || '',
    status: updatedOrder.status || 'pending',
    shipping_status: updatedOrder.shipping_status || 'pending',
    total: updatedOrder.total || 0,
    payment_method: updatedOrder.payment_method || 'credit_card',
    created_at: updatedOrder.created_at || new Date().toISOString(),
    
    // Optional fields with proper null handling
    ...(updatedOrder.shipping_method !== undefined && { shipping_method: updatedOrder.shipping_method }),
    ...(updatedOrder.tracking_number !== undefined && { tracking_number: updatedOrder.tracking_number }),
    ...(updatedOrder.shipping_provider !== undefined && { shipping_provider: updatedOrder.shipping_provider }),
    ...(updatedOrder.estimated_delivery !== undefined && { estimated_delivery: updatedOrder.estimated_delivery }),
    ...(updatedOrder.customer_phone !== undefined && { customer_phone: updatedOrder.customer_phone }),
    ...(updatedOrder.notes !== undefined && { notes: updatedOrder.notes }),
    ...(updatedOrder.updated_at !== undefined && { updated_at: updatedOrder.updated_at }),
    ...(updatedOrder.shipped_at !== undefined && { shipped_at: updatedOrder.shipped_at }),
    ...(updatedOrder.delivery_method !== undefined && { delivery_method: updatedOrder.delivery_method }),
    ...(updatedOrder.provider_name !== undefined && { provider_name: updatedOrder.provider_name }),
    
    // Computed properties with defaults
    can_add_tracking: updatedOrder.can_add_tracking || false,
    can_mark_shipped: updatedOrder.can_mark_shipped || false,
    can_coordinate_pickup: updatedOrder.can_coordinate_pickup || false
  };
  if (!updatedOrder?.order_id) return;
  try {
    await ordersApi.updateOrder(orderToSave.order_id, orderToSave);

    // Actualizar la lista de pedidos
    await loadOrders();
    closeEditModal();
    toast.success('Pedido actualizado correctamente');
  } catch (error) {
    console.error('Error al guardar los cambios:', error);
    toast.error('Error al actualizar el pedido');
  }
};

const closeShippingModal = () => {
  showShippingModal.value = false;
  selectedOrder.value = null;
};

// Update order status
const updateOrderStatus = async (orderId: number, status: string, notes: string) => {
  try {
    console.log('Updating order status:', { orderId, status, notes });
    await ordersApi.updateOrderStatus(orderId, { status, adminNotes: notes });
    
    toast.success('Estado del pedido actualizado exitosamente');
    closeStatusModal();
    await loadOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Error al actualizar el estado del pedido');
  }
};

// Update order shipping
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
    console.error('Error initializing AdminOrdersView:', error);
    toast.error('Error al cargar los datos de la vista de administración');
  }
});
</script>
