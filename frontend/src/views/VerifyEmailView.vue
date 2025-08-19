<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-light text-gray-900">Verifica tu Email</h2>
        <p class="mt-2 text-sm text-gray-600">
          Te hemos enviado un código de verificación a tu email
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <!-- Success State -->
        <div v-if="verificationStatus === 'success'" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">¡Email Verificado!</h3>
          <p class="text-sm text-gray-600 mb-4">Tu email ha sido verificado exitosamente.</p>
          <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900">
            Continuar a la Tienda
          </router-link>
        </div>

        <!-- Error State -->
        <div v-else-if="verificationStatus === 'error'" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error de Verificación</h3>
          <p class="text-sm text-gray-600 mb-4">{{ errorMessage }}</p>
          <button 
            @click="showManualForm = true; verificationStatus = 'pending'"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
          >
            Intentar Nuevamente
          </button>
        </div>

        <!-- Loading State -->
        <div v-else-if="verificationStatus === 'loading'" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
          <p class="text-sm text-gray-600">Verificando tu email...</p>
        </div>

        <!-- Manual Verification Form -->
        <form v-else @submit.prevent="verifyWithCode" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="verificationForm.email"
              type="email"
              id="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black"
              placeholder="tu@email.com"
            >
          </div>

          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">Código de Verificación</label>
            <input
              v-model="verificationForm.code"
              type="text"
              id="code"
              required
              maxlength="6"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-black focus:ring-black text-center text-lg font-mono tracking-widest"
              placeholder="123456"
              @input="formatCode"
            >
            <p class="mt-1 text-xs text-gray-500">Ingresa el código de 6 dígitos que recibiste por email</p>
          </div>

          <button
            type="submit"
            :disabled="processing"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400"
          >
            <span v-if="processing" class="flex items-center">
              <div class="animate-spin -ml-1 mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
              Verificando...
            </span>
            <span v-else>Verificar Email</span>
          </button>

          <div class="text-center">
            <button
              type="button"
              @click="resendVerificationEmail"
              :disabled="resending || resendCooldown > 0"
              class="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400"
            >
              <span v-if="resending">Reenviando...</span>
              <span v-else-if="resendCooldown > 0">Reenviar en {{ resendCooldown }}s</span>
              <span v-else>¿No recibiste el código? Reenviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useToast } from 'vue-toastification';
import { emailVerificationService, type VerifyEmailRequest } from '../services/emailVerificationService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// State
const verificationStatus = ref<'pending' | 'loading' | 'success' | 'error'>('pending');
const processing = ref(false);
const resending = ref(false);
const resendCooldown = ref(0);
const errorMessage = ref('');
const showManualForm = ref(false);

// Form
const verificationForm = ref({
  email: '',
  code: ''
});

// Auto-verify if token in URL
onMounted(async () => {
  const token = route.query.token as string;
  
  if (authStore.isAuthenticated && authStore.backendUser) {
    verificationForm.value.email = authStore.backendUser.email;
  }
  
  if (token && verificationForm.value.email) {
    await verifyWithToken(token);
  } else {
    showManualForm.value = true;
  }
});

// Methods
const verifyWithToken = async (token: string) => {
  verificationStatus.value = 'loading';
  
  try {
    const request: VerifyEmailRequest = {
      token: token,
      email: verificationForm.value.email
    };
    
    const response = await emailVerificationService.verifyEmail(request);
    
    if (response.success) {
      verificationStatus.value = 'success';
      toast.success('Email verificado exitosamente');
      
      // Update auth store if needed
      if (authStore.backendUser) {
        authStore.backendUser.email_verified = true;
      }
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      verificationStatus.value = 'error';
      errorMessage.value = response.message;
    }
  } catch (error) {
    verificationStatus.value = 'error';
    errorMessage.value = 'Error al verificar el email. Por favor intenta nuevamente.';
    console.error('Verification error:', error);
  }
};

const verifyWithCode = async () => {
  if (!verificationForm.value.code || !verificationForm.value.email) {
    toast.error('Por favor completa todos los campos');
    return;
  }
  
  processing.value = true;
  
  try {
    const request: VerifyEmailRequest = {
      code: verificationForm.value.code,
      email: verificationForm.value.email
    };
    
    const response = await emailVerificationService.verifyEmail(request);
    
    if (response.success) {
      verificationStatus.value = 'success';
      toast.success('Email verificado exitosamente');
      
      // Update auth store if needed
      if (authStore.backendUser) {
        authStore.backendUser.email_verified = true;
      }
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error('Error al verificar el email. Por favor intenta nuevamente.');
    console.error('Verification error:', error);
  } finally {
    processing.value = false;
  }
};

const formatCode = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Only allow numbers
  input.value = input.value.replace(/[^0-9]/g, '');
  verificationForm.value.code = input.value;
};

const resendVerificationEmail = async () => {
  if (!verificationForm.value.email) {
    toast.error('Por favor ingresa tu email');
    return;
  }
  
  resending.value = true;
  
  try {
    await emailVerificationService.resendVerificationEmail({
      email: verificationForm.value.email
    });
    
    toast.success('Código de verificación reenviado');
    
    // Start cooldown
    resendCooldown.value = 60;
    const interval = setInterval(() => {
      resendCooldown.value--;
      if (resendCooldown.value <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
  } catch (error) {
    toast.error('Error al reenviar el código');
    console.error('Resend error:', error);
  } finally {
    resending.value = false;
  }
};
</script>