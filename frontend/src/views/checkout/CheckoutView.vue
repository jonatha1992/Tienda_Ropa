<template>
  <div class="min-h-screen bg-gray-50">
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link to="/cart" class="text-gray-400 hover:text-gray-500">
                <svg class="flex-shrink-0 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-1 font-body">Carrito</span>
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 w-5 h-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium font-body text-body-text">Checkout</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-4 text-3xl font-light text-gray-900 font-heading">Finalizar compra</h1>
        
        <!-- Delivery Progress -->
        <div class="mt-6">
          <DeliveryProgress 
            :current-step="currentStep" 
            @go-to-step="handleGoToStep"
          />
        </div>
      </div>

      <!-- Content -->
      <div v-if="!cartStore.isEmpty" class="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        <!-- Order Summary -->
        <div class="order-2 lg:order-1">
          <div class="p-6 bg-white rounded-lg shadow">
            <h2 class="mb-4 text-lg font-medium text-gray-900 font-heading">Resumen del pedido</h2>
            
            <!-- Items -->
            <ul class="mb-6 divide-y divide-gray-200">
              <li v-for="item in cartStore.items" :key="item.id" class="flex py-4">
                <!-- Image -->
                <div class="flex-shrink-0">
                  <img 
                    :src="item.product.images[0]?.image_url || '/placeholder-image.jpg'"
                    :alt="item.product.name"
                    class="object-cover object-center w-16 h-16 rounded-md"
                  >
                </div>
                
                <!-- Details -->
                <div class="flex-1 ml-4">
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 font-heading">{{ item.product.name }}</h3>
                      
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
                      
                      <p class="mt-1 text-sm font-body text-body-text">Cantidad: {{ item.quantity }}</p>
                    </div>
                    
                    <div class="text-right">
                      <p class="text-sm font-medium font-body text-body-text">
                        ${{ cartStore.getItemTotal(item).toLocaleString() }}
                      </p>
                      <p v-if="item.product.has_discount" class="text-xs line-through font-body text-body-text">
                        ${{ (item.product.price * item.quantity).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Totals -->
            <div class="pt-4 space-y-2 border-t border-gray-200">
              <div class="flex justify-between text-sm">
                <span class="font-body text-body-text">Subtotal</span>
                <span class="font-body text-body-text">
                  ${{ (cartStore.totalSavings > 0 ? cartStore.totalOriginalPrice : cartStore.totalPrice).toLocaleString() }}
                </span>
              </div>
              
              <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-sm">
                <span class="text-red-600 font-body">Descuentos</span>
                <span class="text-red-600 font-body">-${{ cartStore.totalSavings.toLocaleString() }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="font-body text-body-text">Envío</span>
                <span class="font-body text-body-text">
                  {{ deliveryCost === 0 ? 'Gratis' : `$${deliveryCost.toLocaleString()}` }}
                </span>
              </div>
              
              <div class="pt-2 border-t border-gray-200">
                <div class="flex justify-between">
                  <span class="text-base font-medium font-body text-body-text">Total</span>
                  <span class="text-base font-medium font-body text-body-text">
                    ${{ (cartStore.totalPrice + deliveryCost).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Summary (Step 4) - Only in left column -->
          <div v-if="currentStep === 4" class="mt-6">
            <div class="p-6 bg-white rounded-lg shadow">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900 font-heading">Información de entrega</h3>
                <button 
                  @click="currentStep = 3"
                  class="text-sm text-blue-600 hover:text-blue-800 font-body"
                >
                  Editar
                </button>
              </div>
              
              <div class="p-4 space-y-2 text-sm rounded-lg bg-gray-50">
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
                <div v-if="deliveryMethod !== 'retiro_local'" class="flex justify-between">
                  <span class="font-medium text-gray-700 font-body">Dirección:</span>
                  <span class="text-gray-900 font-body">{{ checkoutForm.address }}, {{ checkoutForm.city }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700 font-body">Método de entrega:</span>
                  <span class="text-gray-900 font-body">
                    {{ deliveryMethod === 'retiro_local' ? 'Retiro en local' : 
                       deliveryMethod === 'envio_andreani' ? 'Envío por Andreani' :
                       deliveryMethod === 'envio_correo' ? 'Envío por Correo Argentino' :
                       deliveryMethod === 'envio_oca' ? 'Envío por OCA' : 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="order-1 lg:order-2">
          <form @submit.prevent="processOrder" class="space-y-6">
            <!-- Step 2: Contact Info -->
            <div v-if="currentStep === 2">
              <ContactInfoStep
                :first-name="checkoutForm.firstName"
                :last-name="checkoutForm.lastName"
                :email="checkoutForm.email"
                :phone="checkoutForm.phone"
                :phone-country-code="checkoutForm.phoneCountryCode"
                :loading-user-data="loadingUserData"
                :using-previous-data="usingPreviousData"
                @update:first-name="checkoutForm.firstName = $event"
                @update:last-name="checkoutForm.lastName = $event"
                @update:email="checkoutForm.email = $event"
                @update:phone="checkoutForm.phone = $event"
                @update:phone-country-code="checkoutForm.phoneCountryCode = $event"
                @continue="goToDeliveryStep"
              />
            </div>

            <!-- Step 3: Delivery Info -->
            <div v-if="currentStep === 3">
              <DeliveryStep
                :selected-delivery-method="deliveryMethod"
                :address="checkoutForm.address"
                :city="checkoutForm.city"
                :postal-code="checkoutForm.postalCode"
                :province="checkoutForm.province"
                :country="checkoutForm.country"
                :address-reference="checkoutForm.addressReference"
                :delivery-notes="checkoutForm.deliveryNotes"
                :preferred-delivery-time="checkoutForm.preferredDeliveryTime"
                :total-weight-kg="cartStore.totalWeight"
                @update:selected-delivery-method="deliveryMethod = $event"
                @update:address="checkoutForm.address = $event"
                @update:city="checkoutForm.city = $event"
                @update:postal-code="checkoutForm.postalCode = $event"
                @update:province="checkoutForm.province = $event"
                @update:country="checkoutForm.country = $event"
                @update:address-reference="checkoutForm.addressReference = $event"
                @update:delivery-notes="checkoutForm.deliveryNotes = $event"
                @update:preferred-delivery-time="checkoutForm.preferredDeliveryTime = $event"
                @delivery-method-changed="handleDeliveryMethodChanged"
                @continue="goToPaymentStep"
              />
            </div>

            <!-- Step 4: Payment Method -->
            <div v-if="currentStep === 4" class="p-6 bg-white rounded-lg shadow" data-payment-section ref="paymentSection">
              <h3 class="mb-4 text-lg font-medium text-gray-900 font-heading">Método de pago</h3>
              
              <div class="space-y-3">
                <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="transfer"
                    class="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  >
                  <BanknotesIcon class="w-5 h-5 ml-3 text-blue-600" />
                  <span class="ml-2 text-sm font-body">Transferencia bancaria</span>
                </label>
                
                <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="mercadopago"
                    class="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  >
                  <CreditCardIcon class="w-5 h-5 ml-3 text-purple-600" />
                  <span class="ml-2 text-sm font-body">MercadoPago</span>
                </label>
                
                <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    v-model="checkoutForm.paymentMethod"
                    type="radio"
                    value="cash"
                    class="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  >
                  <CurrencyDollarIcon class="w-5 h-5 ml-3 text-green-600" />
                  <span class="ml-2 text-sm font-body">Efectivo contra entrega</span>
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <div v-if="currentStep === 4" class="p-6 bg-white rounded-lg shadow">
              <button
                type="submit"
                :disabled="processing"
                class="w-full px-4 py-3 font-medium text-white transition-colors bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                <span class="text-white" v-if="processing">Procesando...</span>
                <span class="text-white" v-else>Confirmar pedido</span>
              </button>
              
              <p class="mt-3 text-xs text-center font-body text-body-text">
                Al confirmar tu pedido, aceptas nuestros términos y condiciones
              </p>
            </div>

          </form>
        </div>
      </div>

      <!-- Empty Cart Message -->
      <div v-else class="py-12 text-center">
        <div class="w-24 h-24 mx-auto mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-medium text-gray-900 font-heading">Tu carrito está vacío</h3>
        <p class="mb-6 font-body text-body-text">Agrega algunos productos antes de proceder al checkout</p>
        <router-link
          to="/shop"
          class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800"
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
import ContactInfoStep from '../../components/checkout/ContactInfoStep.vue';
import DeliveryStep from '../../components/checkout/DeliveryStep.vue';
import type { ParsedAddress } from '../../composables/useAddressAutocomplete';
import { BanknotesIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { loadCustomerData, getCheckoutFormData, hasCustomerData } = useUserData();

// Ref para la sección de método de pago
const paymentSection = ref<HTMLElement | null>(null);

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


// Delivery method and cost
const deliveryMethod = ref('envio_andreani');
const deliveryCost = ref(500);

// New 4-step flow state management
const currentStep = ref(2); // Start at step 2 (Contact Info)

// Check if each step is complete
const isContactInfoComplete = computed(() => {
  return checkoutForm.value.firstName.trim() && 
         checkoutForm.value.lastName.trim() && 
         checkoutForm.value.email.trim() && 
         checkoutForm.value.phone.trim();
});

const isDeliveryInfoComplete = computed(() => {
  // Always need delivery method selected
  if (!deliveryMethod.value) return false;
  
  // If local pickup, no address needed
  if (deliveryMethod.value === 'retiro_local') return true;
  
  // For delivery methods, need address info
  return checkoutForm.value.address.trim() && 
         checkoutForm.value.city.trim() && 
         checkoutForm.value.postalCode.trim();
});

// Navigation functions for 4-step flow
const goToContactStep = () => {
  currentStep.value = 2;
};

const goToDeliveryStep = () => {
  if (isContactInfoComplete.value) {
    currentStep.value = 3;
  }
};


const goToPaymentStep = () => {
  if (isDeliveryInfoComplete.value) {
    currentStep.value = 4;
    setTimeout(() => {
      if (paymentSection.value) {
        paymentSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }
};


// Function to handle step navigation
const handleGoToStep = (step: number) => {
  if (step === 1) {
    // Navigate back to cart
    router.push('/cart');
  } else if (step === 2) {
    goToContactStep();
  } else if (step === 3 && isContactInfoComplete.value) {
    goToDeliveryStep();
  } else if (step === 4 && isDeliveryInfoComplete.value) {
    goToPaymentStep();
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
    toast.warning('Debes iniciar sesión para acceder al checkout');
    router.push('/auth');
    return;
  }
  
  // Load cart from localStorage
  cartStore.loadFromStorage();
  
  // Redirect if cart is empty
  if (cartStore.isEmpty) {
    toast.warning('Tu carrito está vacío');
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


const processOrder = async () => {
  // Ensure we're on the payment step
  if (currentStep.value !== 4) {
    toast.error('Debes completar todos los pasos antes de confirmar el pedido');
    return;
  }

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
    console.log('Validating real-time stock with backend...');
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
        toast.error('La dirección y la ciudad son obligatorias.');
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
      console.log(`FINAL stock check for product ${item.product.id} before order item creation...`);
      
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
          console.error(`FINAL STOCK CHECK FAILED: Product ${item.product.id} now has ${itemResult.available_stock} stock but ${item.quantity} requested`);
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
      console.log('STOCK INFORMATION:');
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
        console.error('ERROR CREATING ORDER ITEM:');
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
      
      toast.success('Pedido confirmado! Te mostraremos los datos de transferencia.');
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
