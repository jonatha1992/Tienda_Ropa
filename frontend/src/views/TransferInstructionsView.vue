<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 text-green-600 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-light text-gray-900">¡Pedido Confirmado!</h1>
        <p class="mt-2 text-lg text-gray-600">
          Orden #{{ orderData?.order_id || 'Cargando...' }}
        </p>
      </div>

      <div v-if="transferInfo" class="space-y-6">
        <!-- Datos de Transferencia -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Datos para Transferencia
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="border border-gray-200 rounded p-4">
                <h3 class="font-medium text-gray-900 mb-3">Información Bancaria</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Banco:</span>
                    <span class="font-medium">{{ transferInfo.bank_info.bank_name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tipo de cuenta:</span>
                    <span class="font-medium">{{ transferInfo.bank_info.account_type }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Número de cuenta:</span>
                    <span class="font-medium font-mono">{{ transferInfo.bank_info.account_number }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">CBU:</span>
                    <span class="font-medium font-mono">{{ transferInfo.bank_info.cbu }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Alias:</span>
                    <span class="font-medium">{{ transferInfo.bank_info.alias }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Titular:</span>
                    <span class="font-medium">{{ transferInfo.bank_info.holder_name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">CUIT:</span>
                    <span class="font-medium">{{ transferInfo.bank_info.cuit }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="border border-gray-200 rounded p-4">
                <h3 class="font-medium text-gray-900 mb-3">Monto a Transferir</h3>
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600">
                    ${{ transferInfo.total_amount.toLocaleString() }}
                  </div>
                  <p class="text-sm text-gray-600 mt-1">Monto exacto</p>
                </div>
              </div>
              
              <div class="border border-gray-200 rounded p-4">
                <h3 class="font-medium text-gray-900 mb-3">Referencia</h3>
                <div class="text-center">
                  <div class="font-mono text-lg font-medium bg-gray-100 p-2 rounded">
                    {{ transferInfo.reference }}
                  </div>
                  <p class="text-xs text-gray-600 mt-1">Incluir en el detalle de transferencia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Instrucciones -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instrucciones Importantes
          </h2>
          
          <div class="space-y-3">
            <div v-for="(instruction, index) in transferInfo.instructions" :key="index" class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                {{ index + 1 }}
              </div>
              <p class="text-gray-700">{{ instruction }}</p>
            </div>
          </div>
        </div>

        <!-- Información del Cliente -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-medium text-gray-900 mb-4">Información de Envío</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Datos de Contacto</h3>
              <div class="text-sm space-y-1">
                <p><span class="text-gray-600">Nombre:</span> {{ customerInfo.name }}</p>
                <p><span class="text-gray-600">Email:</span> {{ customerInfo.email }}</p>
                <p><span class="text-gray-600">Teléfono:</span> {{ customerInfo.phone }}</p>
              </div>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Dirección de Envío</h3>
              <div class="text-sm">
                <p>{{ formatAddress(customerInfo) }}</p>
                <p v-if="customerInfo.address_reference" class="text-gray-600 mt-1">
                  Ref: {{ customerInfo.address_reference }}
                </p>
                <p v-if="customerInfo.delivery_notes" class="text-gray-600 mt-1">
                  Notas: {{ customerInfo.delivery_notes }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="copyTransferData"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar Datos
            </button>
            
            <button
              @click="goHome"
              class="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
          
          <p class="mt-4 text-xs text-gray-500 text-center">
            Recibirás un email de confirmación con estos datos. Tu pedido será procesado una vez que verifiquemos la transferencia.
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando información de transferencia...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import type { TransferInfo, Customer } from '../types';

const router = useRouter();
const toast = useToast();

const orderData = ref<any>(null);
const transferInfo = ref<TransferInfo | null>(null);
const customerInfo = ref<Customer | any>({});

onMounted(() => {
  const storedData = localStorage.getItem('transfer_order');
  if (storedData) {
    try {
      const data = JSON.parse(storedData);
      orderData.value = data;
      transferInfo.value = data.transfer_info;
      customerInfo.value = data.customer;
      
      // Clear stored data to prevent reuse
      localStorage.removeItem('transfer_order');
    } catch (error) {
      console.error('Error parsing transfer order data:', error);
      toast.error('Error cargando datos de transferencia');
      router.push('/');
    }
  } else {
    toast.warning('No se encontraron datos de transferencia');
    router.push('/');
  }
});

const formatAddress = (customer: any) => {
  const parts = [];
  if (customer.address) parts.push(customer.address);
  if (customer.city) parts.push(customer.city);
  if (customer.postal_code) parts.push(`CP ${customer.postal_code}`);
  if (customer.province) parts.push(customer.province);
  return parts.join(', ');
};

const copyTransferData = () => {
  if (!transferInfo.value) return;
  
  const data = `
Datos de Transferencia - Orden #${orderData.value.order_id}

Banco: ${transferInfo.value.bank_info.bank_name}
CBU: ${transferInfo.value.bank_info.cbu}
Alias: ${transferInfo.value.bank_info.alias}
Titular: ${transferInfo.value.bank_info.holder_name}
Monto: $${transferInfo.value.total_amount.toLocaleString()}
Referencia: ${transferInfo.value.reference}
  `.trim();
  
  navigator.clipboard.writeText(data).then(() => {
    toast.success('Datos copiados al portapapeles');
  }).catch(() => {
    toast.error('Error copiando los datos');
  });
};

const goHome = () => {
  router.push('/');
};
</script>