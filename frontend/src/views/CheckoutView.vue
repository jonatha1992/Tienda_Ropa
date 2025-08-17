<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link to="/cart" class="text-gray-400 hover:text-gray-500">
                <svg class="flex-shrink-0 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-1">Carrito</span>
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">Checkout</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-4 text-3xl font-light text-gray-900">Finalizar compra</h1>
        
        <!-- Delivery Progress -->
        <div class="mt-6">
          <DeliveryProgress :current-step="currentStep" />
        </div>
      </div>

      <!-- Content -->
      <div v-if="!cartStore.isEmpty" class="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        <!-- Order Summary -->
        <div class="order-2 lg:order-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h2>
            
            <!-- Items -->
            <ul class="divide-y divide-gray-200 mb-6">
              <li v-for="item in cartStore.items" :key="item.id" class="py-4 flex">
                <!-- Image -->
                <div class="flex-shrink-0">
                  <img 
                    :src="item.product.images[0]?.image_url || '/placeholder-image.jpg'"
                    :alt="item.product.name"
                    class="w-16 h-16 rounded-md object-cover object-center"
                  >
                </div>
                
                <!-- Details -->
                <div class="ml-4 flex-1">
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">{{ item.product.name }}</h3>
                      
                      <!-- Variant Info -->
                      <div v-if="item.variant" class="mt-1 text-sm text-gray-500">
                        {{ item.variant.color.name }} • Talle {{ item.variant.size.name }}
                      </div>
                      
                      <!-- Unique Product Info -->
                      <div v-else-if="item.selectedColor || item.selectedSize" class="mt-1 text-sm text-gray-500">
                        <span v-if="item.selectedColor">{{ item.selectedColor.name }}</span>
                        <span v-if="item.selectedColor && item.selectedSize"> • </span>
                        <span v-if="item.selectedSize">Talle {{ item.selectedSize.name }}</span>
                      </div>
                      
                      <p class="mt-1 text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                    </div>
                    
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900">
                        ${{ cartStore.getItemTotal(item).toLocaleString() }}
                      </p>
                      <p v-if="item.product.has_discount" class="text-xs text-gray-500 line-through">
                        ${{ (item.product.price * item.quantity).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Totals -->
            <div class="border-t border-gray-200 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="text-gray-900">
                  ${{ (cartStore.totalSavings > 0 ? cartStore.totalOriginalPrice : cartStore.totalPrice).toLocaleString() }}
                </span>
              </div>
              
              <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-sm">
                <span class="text-red-600">Descuentos</span>
                <span class="text-red-600">-${{ cartStore.totalSavings.toLocaleString() }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío</span>
                <span class="text-gray-900">Gratis</span>
              </div>
              
              <div class="border-t border-gray-200 pt-2">
                <div class="flex justify-between">
                  <span class="text-base font-medium text-gray-900">Total</span>
                  <span class="text-base font-medium text-gray-900">
                    ${{ cartStore.totalPrice.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="order-1 lg:order-2">
          <form @submit.prevent="processOrder" class="space-y-6">
            <!-- Customer Information -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información de contacto</h3>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    v-model="checkoutForm.firstName"
                    type="text"
                    id="firstName"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                </div>
                
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Apellido</label>
                  <input
                    v-model="checkoutForm.lastName"
                    type="text"
                    id="lastName"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                </div>
              </div>
              
              <div class="mt-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="checkoutForm.email"
                  type="email"
                  id="email"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                >
              </div>
              
              <div class="mt-4">
                <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  v-model="checkoutForm.phone"
                  type="tel"
                  id="phone"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                >
              </div>
            </div>

            <!-- Shipping Information -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Dirección de envío</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    v-model="checkoutForm.address"
                    type="text"
                    id="address"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                </div>
                
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="city" class="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input
                      v-model="checkoutForm.city"
                      type="text"
                      id="city"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    >
                  </div>
                  
                  <div>
                    <label for="postalCode" class="block text-sm font-medium text-gray-700">Código Postal</label>
                    <input
                      v-model="checkoutForm.postalCode"
                      type="text"
                      id="postalCode"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="province" class="block text-sm font-medium text-gray-700">Provincia</label>
                    <input
                      v-model="checkoutForm.province"
                      type="text"
                      id="province"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                      placeholder="Buenos Aires"
                    >
                  </div>
                  
                  <div>
                    <label for="country" class="block text-sm font-medium text-gray-700">País</label>
                    <select
                      v-model="checkoutForm.country"
                      id="country"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    >
                      <option value="AR">Argentina</option>
                      <option value="UY">Uruguay</option>
                      <option value="CL">Chile</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label for="addressReference" class="block text-sm font-medium text-gray-700">Referencias de dirección (opcional)</label>
                  <input
                    v-model="checkoutForm.addressReference"
                    type="text"
                    id="addressReference"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    placeholder="Entre calles, piso, depto, etc."
                  >
                </div>
                
                <div>
                  <label for="deliveryNotes" class="block text-sm font-medium text-gray-700">Notas para la entrega (opcional)</label>
                  <textarea
                    v-model="checkoutForm.deliveryNotes"
                    id="deliveryNotes"
                    rows="2"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    placeholder="Horarios de entrega, portero eléctrico, etc."
                  ></textarea>
                </div>
                
                <div>
                  <label for="preferredDeliveryTime" class="block text-sm font-medium text-gray-700">Horario preferido de entrega</label>
                  <select
                    v-model="checkoutForm.preferredDeliveryTime"
                    id="preferredDeliveryTime"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                    <option value="cualquiera">Cualquier horario</option>
                    <option value="mañana">Mañana (9:00 - 13:00)</option>
                    <option value="tarde">Tarde (14:00 - 18:00)</option>
                    <option value="noche">Noche (18:00 - 21:00)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Método de pago</h3>
              
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="transfer"
                    class="focus:ring-black h-4 w-4 text-black border-gray-300"
                  >
                  <span class="ml-3 text-sm">Transferencia bancaria</span>
                </label>
                
                <label class="flex items-center">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="mercadopago"
                    class="focus:ring-black h-4 w-4 text-black border-gray-300"
                  >
                  <span class="ml-3 text-sm">MercadoPago</span>
                </label>
                
                <label class="flex items-center">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="cash"
                    class="focus:ring-black h-4 w-4 text-black border-gray-300"
                  >
                  <span class="ml-3 text-sm">Efectivo contra entrega</span>
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="bg-white shadow rounded-lg p-6">
              <button
                type="submit"
                :disabled="processing"
                class="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                <span v-if="processing">Procesando...</span>
                <span v-else>Confirmar pedido</span>
              </button>
              
              <p class="mt-3 text-xs text-gray-500 text-center">
                Al confirmar tu pedido, aceptas nuestros términos y condiciones
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Empty Cart Message -->
      <div v-else class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p class="text-gray-600 mb-6">Agrega algunos productos antes de proceder al checkout</p>
        <router-link
          to="/shop"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          Continuar comprando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { useToast } from 'vue-toastification';
import { ordersApi, customersApi, orderItemsApi } from '../config/api';
import type { PaymentMethod, Order, CustomerCreate, OrderItem } from '../types';
import DeliveryProgress from '../components/DeliveryProgress.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const processing = ref(false);

const checkoutForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  province: '',
  country: 'AR',
  addressReference: '',
  deliveryNotes: '',
  preferredDeliveryTime: 'cualquiera',
  paymentMethod: 'transfer'
});

// Determine current step based on form completion
const currentStep = computed(() => {
  // Step 1: Carrito (always completed if we're in checkout)
  // Step 2: Entrega (delivery info completed)
  const hasDeliveryInfo = checkoutForm.value.firstName && 
                         checkoutForm.value.lastName && 
                         checkoutForm.value.email && 
                         checkoutForm.value.phone && 
                         checkoutForm.value.address && 
                         checkoutForm.value.city && 
                         checkoutForm.value.postalCode;
  
  // Step 3: Pago (payment method selected and processing)
  if (processing.value) {
    return 3;
  } else if (hasDeliveryInfo) {
    return 2;
  } else {
    return 2; // We're in the delivery step by default in checkout
  }
});

onMounted(() => {
  // Check authentication first
  if (!authStore.isAuthenticated) {
    toast.warning('Debes iniciar sesión para acceder al checkout');
    router.push('/auth');
    return;
  }
  
  // Load cart from localStorage
  cartStore.loadFromStorage();
  
  // Pre-fill email if user is authenticated
  if (authStore.isAuthenticated && authStore.backendUser) {
    checkoutForm.value.email = authStore.backendUser.email;
    if (authStore.backendUser.name) {
      const nameParts = authStore.backendUser.name.split(' ');
      checkoutForm.value.firstName = nameParts[0] || '';
      checkoutForm.value.lastName = nameParts.slice(1).join(' ') || '';
    }
  }
  
  // Validate stock
  cartStore.validateStock();
  
  // Redirect if cart is empty
  if (cartStore.isEmpty) {
    toast.warning('Tu carrito está vacío');
    router.push('/cart');
  }
});

const processOrder = async () => {
  // Double-check authentication
  if (!authStore.isAuthenticated) {
    toast.error('Debes iniciar sesión para completar la compra');
    router.push('/auth');
    return;
  }
  
  if (cartStore.isEmpty) {
    toast.error('Tu carrito está vacío');
    return;
  }
  
  processing.value = true;
  
  try {
    // Validate stock one more time
    cartStore.validateStock();
    
    if (cartStore.isEmpty) {
      toast.error('Algunos productos ya no están disponibles');
      router.push('/cart');
      return;
    }
    
    // Step 1: Create customer
    const customerData: CustomerCreate = {
      name: `${checkoutForm.value.firstName} ${checkoutForm.value.lastName}`,
      first_name: checkoutForm.value.firstName,
      last_name: checkoutForm.value.lastName,
      email: checkoutForm.value.email,
      phone: checkoutForm.value.phone,
      address: checkoutForm.value.address,
      city: checkoutForm.value.city,
      postal_code: checkoutForm.value.postalCode,
      province: checkoutForm.value.province,
      country: checkoutForm.value.country,
      address_reference: checkoutForm.value.addressReference,
      delivery_notes: checkoutForm.value.deliveryNotes,
      preferred_delivery_time: checkoutForm.value.preferredDeliveryTime
    };
    
    const customer = await customersApi.createCustomer(customerData);
    console.log('Customer created:', customer);
    
    // Step 2: Create order with real customer_id
    const orderData: Partial<Order> = {
      customer_id: customer.id,
      total: cartStore.totalPrice,
      payment_method: checkoutForm.value.paymentMethod as PaymentMethod,
    };
    
    const response = await ordersApi.createOrder(orderData);
    console.log('Order created:', response);
    
    // Step 3: Create order items
    for (const item of cartStore.items) {
      const orderItemData: Omit<OrderItem, 'id'> = {
        order_id: response.order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.has_discount && item.product.discounted_price 
          ? item.product.discounted_price 
          : item.product.price
      };
      
      await orderItemsApi.createOrderItem(orderItemData);
    }
    
    console.log('Order items created for order:', response.order.id);
    
    // Step 4: Handle different payment methods
    if (checkoutForm.value.paymentMethod === 'mercadopago' && response.payment_preference) {
      // Store order info for success page
      localStorage.setItem('pending_order', JSON.stringify({
        order_id: response.order.id,
        customer: customer,
        total: cartStore.totalPrice,
        items: cartStore.items
      }));
      
      // Redirect to MercadoPago
      window.location.href = response.payment_preference.init_point;
    } else if (checkoutForm.value.paymentMethod === 'transfer') {
      // Clear cart and redirect to transfer instructions
      cartStore.clearCart();
      
      // Store transfer info for instruction page
      localStorage.setItem('transfer_order', JSON.stringify({
        order_id: response.order.id,
        customer: customer,
        transfer_info: response.transfer_info
      }));
      
      toast.success('¡Pedido confirmado! Te mostraremos los datos de transferencia.');
      router.push('/payment/transfer-instructions');
    } else if (checkoutForm.value.paymentMethod === 'cash') {
      // Clear cart and redirect to cash confirmation
      cartStore.clearCart();
      
      // Store delivery info for confirmation page
      localStorage.setItem('cash_order', JSON.stringify({
        order_id: response.order.id,
        customer: customer,
        delivery_info: response.delivery_info
      }));
      
      toast.success('¡Pedido confirmado! Te mostraremos los detalles de entrega.');
      router.push('/payment/cash-confirmation');
    } else {
      // Fallback for unknown payment methods
      cartStore.clearCart();
      toast.success('¡Pedido confirmado! Recibirás información por email.');
      router.push('/');
    }
    
  } catch (error) {
    console.error('Error processing order:', error);
    toast.error('Error al procesar el pedido. Por favor intenta nuevamente.');
  } finally {
    processing.value = false;
  }
};
</script>