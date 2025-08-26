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
                <span class="ml-1 font-body">Carrito</span>
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-body font-medium text-body-text">Checkout</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-4 text-3xl font-heading font-light text-gray-900">Finalizar compra</h1>
        
        <!-- Delivery Progress -->
        <div class="mt-6">
          <DeliveryProgress 
            :current-step="currentStep" 
            :initial-delivery-method="deliveryMethod"
            :postal-code="checkoutForm.postalCode"
            :city="checkoutForm.city"
            :province="checkoutForm.province"
            :total-weight-kg="cartStore.totalWeight"
            @go-to-step="handleGoToStep"
            @delivery-method-changed="handleDeliveryMethodChanged"
          />
        </div>
      </div>

      <!-- Content -->
      <div v-if="!cartStore.isEmpty" class="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        <!-- Order Summary -->
        <div class="order-2 lg:order-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-lg font-heading font-medium text-gray-900 mb-4">Resumen del pedido</h2>
            
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
                      <h3 class="text-sm font-heading font-medium text-gray-900">{{ item.product.name }}</h3>
                      
                      <!-- Variant Info -->
                      <div v-if="item.variant" class="mt-1 text-sm font-body text-body-text">
                        {{ item.variant.color.name }} â€¢ Talle {{ item.variant.size.name }}
                      </div>
                      
                      <!-- Unique Product Info -->
                      <div v-else-if="item.selectedColor || item.selectedSize" class="mt-1 text-sm font-body text-body-text">
                        <span v-if="item.selectedColor" class="font-body">{{ item.selectedColor.name }}</span>
                        <span v-if="item.selectedColor && item.selectedSize" class="font-body"> â€¢ </span>
                        <span v-if="item.selectedSize" class="font-body">Talle {{ item.selectedSize.name }}</span>
                      </div>
                      
                      <p class="font-body mt-1 text-sm text-body-text">Cantidad: {{ item.quantity }}</p>
                    </div>
                    
                    <div class="text-right">
                      <p class="font-body text-sm font-medium text-body-text">
                        ${{ cartStore.getItemTotal(item).toLocaleString() }}
                      </p>
                      <p v-if="item.product.has_discount" class="font-body text-xs text-body-text line-through">
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
                <span class="font-body text-body-text">Subtotal</span>
                <span class="font-body text-body-text">
                  ${{ (cartStore.totalSavings > 0 ? cartStore.totalOriginalPrice : cartStore.totalPrice).toLocaleString() }}
                </span>
              </div>
              
              <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-sm">
                <span class="font-body text-red-600">Descuentos</span>
                <span class="font-body text-red-600">-${{ cartStore.totalSavings.toLocaleString() }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="font-body text-body-text">EnvÃ­o</span>
                <span class="font-body text-body-text">
                  {{ deliveryCost === 0 ? 'Gratis' : `$${deliveryCost.toLocaleString()}` }}
                </span>
              </div>
              
              <div class="border-t border-gray-200 pt-2">
                <div class="flex justify-between">
                  <span class="font-body text-base font-medium text-body-text">Total</span>
                  <span class="font-body text-base font-medium text-body-text">
                    ${{ (cartStore.totalPrice + deliveryCost).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Summary (Step 3) - Only in left column -->
          <div v-if="currentStep === 3" class="mt-6">
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-heading text-lg font-medium text-gray-900">Información de entrega</h3>
                <button 
                  @click="showPaymentStep = false"
                  class="text-sm text-blue-600 hover:text-blue-800 font-body"
                >
                  Editar
                </button>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700 font-body">Nombre:</span>
                  <span class="text-gray-900 font-body">{{ checkoutForm.firstName }} {{ checkoutForm.lastName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700 font-body">Email:</span>
                  <span class="text-gray-900 font-body">{{ checkoutForm.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700 font-body">Teléfono:</span>
                  <span class="text-gray-900 font-body">{{ checkoutForm.phone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700 font-body">Dirección:</span>
                  <span class="text-gray-900 font-body">{{ checkoutForm.address }}, {{ checkoutForm.city }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="order-1 lg:order-2">
          <form @submit.prevent="processOrder" class="space-y-6">
            <!-- Customer Information -->
            <div v-if="currentStep === 2" class="bg-white shadow rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-heading text-lg font-medium text-gray-900">Información de contacto</h3>
                
                <!-- Loading indicator -->
                <div v-if="loadingUserData" class="flex items-center text-sm text-gray-500">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando datos...
                </div>
                
                <!-- Previous data indicator -->
                <div v-else-if="usingPreviousData" class="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Datos de compra anterior
                </div>
              </div>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="firstName" class="font-body block text-sm font-medium text-body-text">Nombre</label>
                  <input
                    v-model="checkoutForm.firstName"
                    type="text"
                    id="firstName"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                </div>
                
                <div>
                  <label for="lastName" class="font-body block text-sm font-medium text-body-text">Apellido</label>
                  <input
                    v-model="checkoutForm.lastName"
                    type="text"
                    id="lastName"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                </div>
              </div>
              
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="email" class="font-body block text-sm font-medium text-body-text">Email</label>
                  <input
                    v-model="checkoutForm.email"
                    type="email"
                    id="email"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                </div>
                
                <div>
                  <CountryPhoneSelector
                    v-model="checkoutForm.phone"
                    v-model:country-code="checkoutForm.phoneCountryCode"
                    input-id="phone"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Shipping Information -->
            <div v-if="currentStep === 2" class="bg-white shadow rounded-lg p-6">
              <h3 class="font-heading text-lg font-medium text-gray-900 mb-4">Dirección de envío</h3>
              
              <div class="space-y-4">
                <div>
                  <AddressAutocomplete
                    v-model="checkoutForm.address"
                    input-id="address"
                    :country-code="checkoutForm.country"
                    required
                    @address-selected="onAddressSelected"
                  />
                </div>
                
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label for="city" class="font-body block text-sm font-medium text-body-text">Ciudad</label>
                    <input
                      v-model="checkoutForm.city"
                      type="text"
                      id="city"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    >
                  </div>
                  
                  <div>
                    <label for="postalCode" class="font-body block text-sm font-medium text-body-text">Código Postal</label>
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
                    <label for="province" class="font-body block text-sm font-medium text-body-text">Provincia</label>
                    <input
                      v-model="checkoutForm.province"
                      type="text"
                      id="province"
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                      placeholder="Buenos Aires"
                    >
                  </div>
                  
                  <div>
                    <label for="country" class="font-body block text-sm font-medium text-body-text">País</label>
                    <select
                      v-model="checkoutForm.country"
                      id="country"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    >
                      <option class="font-body" value="AR">Argentina</option>
                      <option class="font-body" value="UY">Uruguay</option>
                      <option class="font-body" value="CL">Chile</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label for="addressReference" class="font-body block text-sm font-medium text-body-text">Referencias de dirección (opcional)</label>
                  <input
                    v-model="checkoutForm.addressReference"
                    type="text"
                    id="addressReference"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    placeholder="Entre calles, piso, depto, etc."
                  >
                </div>
                
                <div>
                  <label for="deliveryNotes" class="font-body block text-sm font-medium text-body-text">Notas para la entrega (opcional)</label>
                  <textarea
                    v-model="checkoutForm.deliveryNotes"
                    id="deliveryNotes"
                    rows="2"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                    placeholder="Horarios de entrega, portero eléctrico, etc."
                  ></textarea>
                </div>
                
                <div>
                  <label for="preferredDeliveryTime" class="font-body block text-sm font-medium text-body-text">Horario preferido de entrega</label>
                  <select
                    v-model="checkoutForm.preferredDeliveryTime"
                    id="preferredDeliveryTime"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
                  >
                    <option class="font-body" value="cualquiera">Cualquier horario</option>
                    <option class="font-body" value="mañana">Mañana (9:00 - 13:00)</option>
                    <option class="font-body" value="tarde">Tarde (14:00 - 18:00)</option>
                    <option class="font-body" value="noche">Noche (18:00 - 21:00)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Continue to Payment Button -->
            <div v-if="currentStep === 2 && deliveryInfoCompleted && !showPaymentStep" class="bg-white shadow rounded-lg p-6">
              <div class="text-center">
                <div class="mb-4">
                  <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 class="font-heading text-lg font-medium text-gray-900 mb-2">Información de entrega completa</h3>
                  <p class="font-body text-sm text-gray-600 mb-4">Ya puedes continuar con el método de pago</p>
                </div>
                <button
                  type="button"
                  @click="goToPaymentStep"
                  class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
                >
                  <span class="text-white">Continuar al pago</span>
                  <svg class="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Payment Method - Back to right column -->
            <div v-if="currentStep === 3" class="bg-white shadow rounded-lg p-6" data-payment-section>
              <h3 class="font-heading text-lg font-medium text-gray-900 mb-4">Método de pago</h3>
              
              <div class="space-y-3">
                <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="transfer"
                    class="focus:ring-black h-4 w-4 text-black border-gray-300"
                  >
                  <BanknotesIcon class="ml-3 h-5 w-5 text-blue-600" />
                  <span class="font-body ml-2 text-sm">Transferencia bancaria</span>
                </label>
                
                <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="mercadopago"
                    class="focus:ring-black h-4 w-4 text-black border-gray-300"
                  >
                  <CreditCardIcon class="ml-3 h-5 w-5 text-purple-600" />
                  <span class="font-body ml-2 text-sm">MercadoPago</span>
                </label>
                
                <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="cash"
                    class="focus:ring-black h-4 w-4 text-black border-gray-300"
                  >
                  <CurrencyDollarIcon class="ml-3 h-5 w-5 text-green-600" />
                  <span class="font-body ml-2 text-sm">Efectivo contra entrega</span>
                </label>
              </div>
            </div>

            <!-- Submit Button - Back to right column -->
            <div v-if="currentStep === 3" class="bg-white shadow rounded-lg p-6">
              <button
                type="submit"
                :disabled="processing"
                class="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                <span class="font-body" v-if="processing">Procesando...</span>
                <span class="font-body" v-else>Confirmar pedido</span>
              </button>
              
              <p class="font-body mt-3 text-xs text-body-text text-center">
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
        <h3 class="font-heading text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p class="font-body text-body-text mb-6">Agrega algunos productos antes de proceder al checkout</p>
        <router-link
          to="/shop"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          <span class="font-body">Continuar comprando</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../store/cart';
import { useAuthStore } from '../../store/auth';
import { useToast } from 'vue-toastification';
import { ordersApi, customersApi, orderItemsApi, productsApi } from '../../config/api';
import { stockService } from '../../services/stockService';
import { isValidPhone, formatE164, isValidPostalCode, validationMessages } from '../../composables/useValidators';
import { useUserData } from '../../composables/useUserData';
import type { PaymentMethod, Order, CustomerCreate, OrderItem } from '../../types';
import DeliveryProgress from '../../components/ui/DeliveryProgress.vue';
import CountryPhoneSelector from '../../components/forms/CountryPhoneSelector.vue';
import AddressAutocomplete from '../../components/forms/AddressAutocomplete.vue';
import type { ParsedAddress } from '../../composables/useAddressAutocomplete';
import { BanknotesIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { loadCustomerData, getCheckoutFormData, hasCustomerData } = useUserData();

const processing = ref(false);
const loadingUserData = ref(false);
const usingPreviousData = ref(false);

const checkoutForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneCountryCode: 'AR',
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

// Track if delivery info was just completed
const deliveryInfoCompleted = ref(false);
// Track if user wants to proceed to payment
const showPaymentStep = ref(false);

// Delivery method and cost
const deliveryMethod = ref('envio_andreani');
const deliveryCost = ref(500);

// Determine current step based on form completion
const currentStep = computed(() => {
  // Step 1: Carrito (already completed when we're in checkout)
  // Step 2: Entrega (delivery info being filled)
  const hasDeliveryInfo = checkoutForm.value.firstName && 
                         checkoutForm.value.lastName && 
                         checkoutForm.value.email && 
                         checkoutForm.value.phone && 
                         checkoutForm.value.address && 
                         checkoutForm.value.city && 
                         checkoutForm.value.postalCode;
  
  // Track delivery info completion
  if (hasDeliveryInfo && !deliveryInfoCompleted.value) {
    deliveryInfoCompleted.value = true;
  } else if (!hasDeliveryInfo && deliveryInfoCompleted.value) {
    deliveryInfoCompleted.value = false;
    showPaymentStep.value = false; // Reset payment step if delivery info becomes incomplete
  }
  
  // Step 3: Pago (when user explicitly wants to proceed or processing)
  if (processing.value) {
    return 3;
  } else if (hasDeliveryInfo && showPaymentStep.value) {
    return 3; // Show payment step when user clicked continue
  } else {
    return 2; // Step 2 - filling delivery info (or showing continue button when complete)
  }
});

// Function to proceed to payment step
const goToPaymentStep = () => {
  showPaymentStep.value = true;
  // Scroll to top for better UX since payment section is now in left column
  setTimeout(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, 100);
};

// Function to handle step navigation
const handleGoToStep = (step: number) => {
  if (step === 1) {
    // Navigate back to cart
    router.push('/cart');
  }
};

const handleDeliveryMethodChanged = (data: { method: string; cost: number }) => {
  deliveryMethod.value = data.method;
  deliveryCost.value = data.cost;
  console.log('ðŸšš Delivery method changed:', data);
};

onMounted(async () => {
  // Check authentication first
  if (!authStore.isAuthenticated) {
    toast.warning('Debes iniciar sesiÃ³n para acceder al checkout');
    router.push('/auth');
    return;
  }
  
  // Load cart from localStorage
  cartStore.loadFromStorage();
  
  // Redirect if cart is empty
  if (cartStore.isEmpty) {
    toast.warning('Tu carrito estÃ¡ vacÃ­o');
    router.push('/cart');
    return;
  }
  
  // Load customer data automatically if user is authenticated
  loadingUserData.value = true;
  try {
    const customerData = await loadCustomerData();
    
    if (customerData) {
      // User has previous purchase data - auto-populate form
      const formData = getCheckoutFormData();
      Object.assign(checkoutForm.value, formData);
      usingPreviousData.value = true;
      
      console.log('âœ… Form auto-populated with previous customer data');
      toast.success('Datos cargados desde compra anterior', { timeout: 2000 });
    } else {
      // First-time buyer - only pre-fill basic info from auth
      if (authStore.backendUser) {
        checkoutForm.value.email = authStore.backendUser.email;
        if (authStore.backendUser.name) {
          const nameParts = authStore.backendUser.name.split(' ');
          checkoutForm.value.firstName = nameParts[0] || '';
          checkoutForm.value.lastName = nameParts.slice(1).join(' ') || '';
        }
      }
      console.log('â„¹ï¸ First-time buyer - basic info pre-filled');
    }
  } catch (error) {
    console.error('âŒ Error loading user data:', error);
    // Fallback to basic auth info
    if (authStore.backendUser) {
      checkoutForm.value.email = authStore.backendUser.email;
      if (authStore.backendUser.name) {
        const nameParts = authStore.backendUser.name.split(' ');
        checkoutForm.value.firstName = nameParts[0] || '';
        checkoutForm.value.lastName = nameParts.slice(1).join(' ') || '';
      }
    }
  } finally {
    loadingUserData.value = false;
  }
  
  // Validate stock
  cartStore.validateStock();
});

const onAddressSelected = (parsedAddress: ParsedAddress) => {
  // Auto-fill address fields when user selects from suggestions
  checkoutForm.value.address = parsedAddress.street
  checkoutForm.value.city = parsedAddress.city
  checkoutForm.value.postalCode = parsedAddress.postalCode
  checkoutForm.value.province = parsedAddress.province
  checkoutForm.value.country = parsedAddress.country
}

const processOrder = async () => {
  // Double-check authentication
  if (!authStore.isAuthenticated) {
    toast.error('Debes iniciar sesiÃ³n para completar la compra');
    router.push('/auth');
    return;
  }
  
  if (cartStore.isEmpty) {
    toast.error('Tu carrito estÃ¡ vacÃ­o');
    return;
  }
  
  try {
    // Validate stock with backend using the new stock service
    console.log('ðŸ” Validating real-time stock with backend...');
    processing.value = true;
    
    // Prepare items for stock check
    const stockCheckItems = cartStore.items.map(item => ({
      product_id: item.product.id,
      variant_id: item.variant?.variant.id,
      quantity: item.quantity
    }));

    // Check stock with backend
    const stockResponse = await cartStore.validateStock();
    
    if (stockResponse.hasStockIssues) {
      // The cart store already handles showing notifications and updating quantities
      // Just redirect to cart to show the changes
      router.push('/cart');
      return;
    }
    
    if (cartStore.isEmpty) {
      toast.error('Algunos productos ya no estÃ¡n disponibles');
      router.push('/cart');
      return;
    }
    
    // Validate form (phone, postal code, required fields)
    const validateForm = () => {
      // phone
      if (!isValidPhone(checkoutForm.value.phone, checkoutForm.value.phoneCountryCode)) {
        toast.error(validationMessages.phone);
        return false;
      }
      // postal code
      if (!isValidPostalCode(checkoutForm.value.postalCode, checkoutForm.value.country)) {
        toast.error(validationMessages.postal);
        return false;
      }
      // address and city required
      if (!checkoutForm.value.address || !checkoutForm.value.city) {
        toast.error('La direcciÃ³n y la ciudad son obligatorias.');
        return false;
      }
      return true;
    };

    if (!validateForm()) {
      processing.value = false;
      return;
    }

    // Step 1: Create customer
    const normalizedPhone = formatE164(checkoutForm.value.phone, checkoutForm.value.phoneCountryCode);
    const customerData: CustomerCreate = {
      name: `${checkoutForm.value.firstName} ${checkoutForm.value.lastName}`,
      first_name: checkoutForm.value.firstName,
      last_name: checkoutForm.value.lastName,
      email: checkoutForm.value.email,
      phone: normalizedPhone,
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
      total: cartStore.totalPrice + deliveryCost.value,
      payment_method: checkoutForm.value.paymentMethod as PaymentMethod,
      delivery_method: deliveryMethod.value,
    };
    
    const response = await ordersApi.createOrder(orderData);
    console.log('Order created:', response);
    
    // Step 3: Create order items
    for (const item of cartStore.items) {
      // FINAL stock check right before creating order item
      console.log(`ðŸ”„ FINAL stock check for product ${item.product.id} before order item creation...`);
      
      try {
        // Use the stock service for final verification
        const finalStockCheck = await stockService.checkStock([{
          product_id: item.product.id,
          variant_id: item.variant?.variant.id,
          quantity: item.quantity
        }]);
        
        const itemResult = finalStockCheck.items[0];
        
        console.log(`Final stock check result:`, {
          product_id: item.product.id,
          product_name: item.product.name,
          final_available_stock: itemResult.available_stock,
          requested_quantity: item.quantity,
          has_enough_stock: itemResult.has_enough_stock
        });
        
        if (!itemResult.has_enough_stock) {
          console.error(`âŒ FINAL STOCK CHECK FAILED: Product ${item.product.id} now has ${itemResult.available_stock} stock but ${item.quantity} requested`);
          throw new Error(`Stock insuficiente para "${item.product.name}". Stock disponible: ${itemResult.available_stock}, solicitado: ${item.quantity}`);
        }
        
        // Update local stock information
        if (item.product.is_unique) {
          item.product.stock = itemResult.available_stock;
        } else if (item.variant) {
          item.variant.variant.stock = itemResult.available_stock;
        }
        
      } catch (error: any) {
        console.error(`Error in final stock check for product ${item.product.id}:`, error);
        if (error.message?.includes('Stock insuficiente')) {
          throw error;
        }
        // If it's an API error, log it but continue
        console.warn('Could not verify final stock, proceeding with order item creation');
      }
      
      const itemPrice = item.product.has_discount && item.product.discounted_price 
        ? item.product.discounted_price 
        : item.product.price;
      
      // Base order item data
      const orderItemData: Partial<Omit<OrderItem, 'id' | 'product'>> & {
        order_id: number;
        product_id: number;
        quantity: number;
        price: number;
      } = {
        order_id: response.order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: itemPrice
      };
      
      // Add variant information based on product type
      if (item.product.is_unique) {
        // For unique products, add color and size IDs if available
        if (item.selectedColor) {
          orderItemData.color_id = item.selectedColor.id;
        }
        if (item.selectedSize) {
          orderItemData.size_id = item.selectedSize.id;
        }
      } else {
        // For variant products, add variant_id
        if (item.variant && item.variant.variant.id) {
          orderItemData.variant_id = item.variant.variant.id;
        }
      }
      
      console.log('Creating order item:', JSON.stringify(orderItemData, null, 2));
      console.log('Cart item variant info:', item.variant);
      console.log('Cart item selectedColor:', item.selectedColor);
      console.log('Cart item selectedSize:', item.selectedSize);
      console.log('Product is_unique:', item.product.is_unique);
      console.log('ðŸ” STOCK INFORMATION:');
      console.log('Frontend shows stock:', item.product.stock);
      console.log('Product variants with stock:', item.product.variants?.map(v => ({
        variant_id: v.id,
        stock: v.stock,
        color: v.color_id,
        size: v.size_id
      })));
      console.log('Product price details:', {
        original_price: item.product.price,
        has_discount: item.product.has_discount,
        discounted_price: item.product.discounted_price,
        calculated_price: itemPrice
      });
      
      try {
        await orderItemsApi.createOrderItem(orderItemData);
        console.log('Order item created successfully for product:', item.product.id);
      } catch (error: any) {
        console.error('âŒ ERROR CREATING ORDER ITEM:');
        console.error('Backend error message:', JSON.stringify(error.response?.data, null, 2));
        console.error('Error status:', error.response?.status);
        console.error('Data we sent:', JSON.stringify(orderItemData, null, 2));
        console.error('Full cart item:', JSON.stringify({
          id: item.id,
          product_id: item.product.id,
          product_name: item.product.name,
          is_unique: item.product.is_unique,
          quantity: item.quantity,
          variant: item.variant,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        }, null, 2));
        throw error; // Re-throw to be caught by outer try-catch
      }
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
      
      toast.success('Â¡Pedido confirmado! Te mostraremos los datos de transferencia.');
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
      
      toast.success('Â¡Pedido confirmado! Te mostraremos los detalles de entrega.');
      router.push('/payment/cash-confirmation');
    } else {
      // Fallback for unknown payment methods
      cartStore.clearCart();
      toast.success('Â¡Pedido confirmado! RecibirÃ¡s informaciÃ³n por email.');
      router.push('/');
    }
    
  } catch (error: any) {
    console.error('Error processing order:', error);
    
    // Handle specific stock error
    if (error.response?.data?.detail?.includes('Stock insuficiente')) {
      toast.error('No hay suficiente stock para algunos productos. Revisa tu carrito.');
      // Refresh cart to update stock
      cartStore.validateStock();
      if (!cartStore.isEmpty) {
        router.push('/cart');
      }
    } else {
      toast.error('Error al procesar el pedido. Por favor intenta nuevamente.');
    }
  } finally {
    processing.value = false;
  }
};
</script>
