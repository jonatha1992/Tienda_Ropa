<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Información de Envíos</h1>
        
        <div class="space-y-8">
          <!-- Envíos Nacionales -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Envíos Nacionales (Argentina)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-800 mb-2">Envío Estándar</h3>
                <p class="text-gray-600 mb-2">3-5 días hábiles</p>
                <p class="text-sm text-gray-500">Correo Argentino y OCA</p>
                <p class="font-bold text-indigo-600">$2.500 - $4.000</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-800 mb-2">Envío Express</h3>
                <p class="text-gray-600 mb-2">1-2 días hábiles</p>
                <p class="text-sm text-gray-500">Andreani y MercadoEnvíos</p>
                <p class="font-bold text-indigo-600">$4.500 - $7.000</p>
              </div>
            </div>
          </div>

          <!-- CABA y GBA -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">CABA y Gran Buenos Aires</h2>
            <div class="bg-indigo-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-800 mb-2">Envío a Domicilio</h3>
              <p class="text-gray-600 mb-2">24-48 horas</p>
              <p class="text-sm text-gray-500">Mensajería propia y motomandados</p>
              <p class="font-bold text-indigo-600">$1.500 - $3.000</p>
            </div>
          </div>

          <!-- Envío Gratis -->
          <div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h3 class="text-lg font-semibold text-green-800">¡Envío Gratis!</h3>
            </div>
            <p class="text-green-700 mt-2">
              En compras superiores a $50.000 el envío es completamente gratis a todo el país.
            </p>
          </div>

          <!-- Política de Envíos -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Política de Envíos</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Preparación del Pedido</h3>
                <p class="text-gray-600">
                  Los pedidos se procesan en 24-48 horas hábiles. Recibirás una confirmación por email 
                  cuando tu pedido sea despachado junto con el número de seguimiento.
                </p>
              </div>
              
              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Seguimiento</h3>
                <p class="text-gray-600">
                  Una vez despachado tu pedido, recibirás un código de seguimiento para rastrear 
                  tu envío en tiempo real a través de la web del correo correspondiente.
                </p>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Días y Horarios de Entrega</h3>
                <p class="text-gray-600">
                  Las entregas se realizan de lunes a viernes de 9:00 a 18:00 hs. 
                  Los sábados solo se realizan entregas express en CABA con costo adicional.
                </p>
              </div>
            </div>
          </div>

          <!-- Problemas con el Envío -->
          <div class="bg-yellow-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">¿Problemas con tu Envío?</h3>
            <p class="text-yellow-700 mb-3">
              Si tu pedido no llega en el tiempo estimado o tienes algún problema con la entrega, 
              contáctanos inmediatamente.
            </p>
            <router-link to="/contact" 
              class="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-200">
              Contactar Soporte
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Información sobre envíos
</script>
