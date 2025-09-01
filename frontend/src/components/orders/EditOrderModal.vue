<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="closeModal">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      
      <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Editar Pedido #{{ order.order_id }}
              </h3>
              
              <div class="grid grid-cols-1 mt-4 gap-y-4 gap-x-4 sm:grid-cols-6">
                <!-- Customer Info (Solo lectura) -->
                <div class="sm:col-span-3">
                  <label for="customerName" class="block text-sm font-medium text-gray-700">Cliente</label>
                  <div class="block w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50">
                    {{ editedOrder.customer_name }}
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label for="customerEmail" class="block text-sm font-medium text-gray-700">Email</label>
                  <div class="block w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50">
                    {{ editedOrder.customer_email }}
                  </div>
                </div>

                <!-- Shipping Address (Solo lectura) -->
                <div class="sm:col-span-6">
                  <label for="shippingAddress" class="block text-sm font-medium text-gray-700">Dirección de Envío</label>
                  <div class="block w-full p-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50">
                    {{ getCustomerAddress(editedOrder) || 'No especificada' }}
                  </div>
                </div>

                <!-- Payment Method (Solo lectura) -->
                <div class="sm:col-span-3">
                  <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Método de Pago</label>
                  <div class="block w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50">
                    {{ getPaymentMethodText(editedOrder.payment_method) }}
                  </div>
                </div>

                <!-- Delivery Method (Solo lectura) -->
                <div class="sm:col-span-3">
                  <label for="deliveryMethod" class="block text-sm font-medium text-gray-700">Método de Entrega</label>
                  <div class="block w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50">
                    {{ getDeliveryMethodText(editedOrder.delivery_method || undefined) }}
                  </div>
                </div>

                <!-- Tracking Info - Misma fila -->
                <div class="sm:col-span-2">
                  <label for="trackingNumber" class="block text-sm font-medium text-gray-700">Número de Seguimiento</label>
                  <input type="text" id="trackingNumber" v-model="editedOrder.tracking_number"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                <!-- Order Notes - Misma fila -->
                <div class="sm:col-span-4">
                  <label for="notes" class="block text-sm font-medium text-gray-700">Notas del Pedido</label>
                  <textarea id="notes" v-model="editedOrder.notes" rows="2"
                    class="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Notas adicionales sobre el pedido"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button"
            @click="saveChanges"
            :disabled="saving"
            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
            <span class="text-white" v-if="saving">
              <svg class="inline-block w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span class="text-white" v-else>Guardar Cambios</span>
          </button>
          <button type="button"
            @click="closeModal"
            class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Order } from '../../types/orders';

const props = defineProps<{
  isOpen: boolean;
  order: Order;
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


const getCustomerAddress = (order: any): string => {
  if (!order || !order.customer) {
    return '';
  }
  
  const customer = order.customer;
  const addressParts: string[] = [];
  
  if (customer.address) addressParts.push(customer.address);
  if (customer.city) addressParts.push(customer.city);
  if (customer.postal_code) addressParts.push(`CP ${customer.postal_code}`);
  if (customer.province) addressParts.push(customer.province);
  
  return addressParts.join(', ');
};

const getPaymentMethodText = (method: string | undefined): string => {
  if (!method) return 'No especificado';
  const methodTexts: Record<string, string> = {
    'transfer': 'Transferencia Bancaria',
    'mercadopago': 'MercadoPago',
    'cash': 'Efectivo Contra Entrega'
  };
  return methodTexts[method.toLowerCase()] || method;
};

const getDeliveryMethodText = (method: string | null | undefined): string => {
  if (!method) return 'No especificado';
  const methodTexts: Record<string, string> = {
    'envio_andreani': 'Envío Andreani',
    'envio_correo': 'Envío Correo Argentino',
    'retiro_local': 'Retiro en Local'
  };
  return methodTexts[method.toLowerCase()] || method;
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

