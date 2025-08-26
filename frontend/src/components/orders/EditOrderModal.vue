<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="closeModal">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Editar Pedido #{{ order.order_id }}
              </h3>
              
              <div class="mt-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <!-- Customer Info -->
                <div class="sm:col-span-3">
                  <label for="customerName" class="block text-sm font-medium text-gray-700">Cliente</label>
                  <input type="text" id="customerName" v-model="editedOrder.customer_name" 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                <div class="sm:col-span-3">
                  <label for="customerEmail" class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="customerEmail" v-model="editedOrder.customer_email"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                <!-- Shipping Address -->
                <div class="sm:col-span-6">
                  <label for="shippingAddress" class="block text-sm font-medium text-gray-700">Dirección de Envío</label>
                  <textarea id="shippingAddress" v-model="editedOrder.shipping_address" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>

                <!-- Order Status -->
                <div class="sm:col-span-3">
                  <label for="status" class="block text-sm font-medium text-gray-700">Estado del Pedido</label>
                  <select id="status" v-model="editedOrder.status"
                    class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="pending">Pendiente</option>
                    <option value="processing">En Proceso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <!-- Shipping Status -->
                <div class="sm:col-span-3">
                  <label for="shippingStatus" class="block text-sm font-medium text-gray-700">Estado de Envío</label>
                  <select id="shippingStatus" v-model="editedOrder.shipping_status"
                    class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="pending">Pendiente</option>
                    <option value="processing">En Proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <!-- Tracking Info -->
                <div class="sm:col-span-4">
                  <label for="trackingNumber" class="block text-sm font-medium text-gray-700">Número de Seguimiento</label>
                  <input type="text" id="trackingNumber" v-model="editedOrder.tracking_number"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                <div class="sm:col-span-2">
                  <label for="shippingProvider" class="block text-sm font-medium text-gray-700">Transportista</label>
                  <select id="shippingProvider" v-model="editedOrder.shipping_provider"
                    class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Seleccionar</option>
                    <option v-for="provider in shippingProviders" :key="provider.id" :value="provider.code">
                      {{ provider.name }}
                    </option>
                  </select>
                </div>

                <!-- Order Notes -->
                <div class="sm:col-span-6">
                  <label for="notes" class="block text-sm font-medium text-gray-700">Notas del Pedido</label>
                  <textarea id="notes" v-model="editedOrder.notes" rows="2"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Notas adicionales sobre el pedido"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button"
            @click="saveChanges"
            :disabled="saving"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
            <span v-if="saving">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>Guardar Cambios</span>
          </button>
          <button type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Order, ShippingProvider } from '../../types/orders';

const props = defineProps<{
  isOpen: boolean;
  order: Order;
  shippingProviders: ShippingProvider[];
}>()

const emit = defineEmits(['close', 'save']);

const editedOrder = ref({ ...props.order });
const saving = ref(false);

// Watch for changes in the order prop
watch(() => props.order, (newOrder) => {
  editedOrder.value = { ...newOrder };
}, { deep: true, immediate: true });

const closeModal = () => {
  emit('close');
};

const getTrackingPlaceholder = (providerCode: string) => {
  const provider = props.shippingProviders.find(p => p.code === providerCode);
  return provider ? `Ej: ${provider.code.toUpperCase()}1234567890` : 'NÃºmero de seguimiento';
};

const getTrackingHint = (providerCode: string) => {
  const provider = props.shippingProviders.find(p => p.code === providerCode);
  return provider ? `Formato: ${provider.code.toUpperCase()} + 10 dígitos` : 'Ingrese el número de seguimiento';
};

const saveChanges = async () => {
  try {
    saving.value = true;
    // Emit the save event with the updated order data
    emit('save', editedOrder.value);
  } catch (error) {
    console.error('Error saving order:', error);
  } finally {
    saving.value = false;
  }
};
</script>

