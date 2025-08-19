<template>
  <div class="min-h-screen py-8 bg-gray-50">
    <div class="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
      <div class="p-6 bg-white rounded-lg shadow">
        <h1 class="mb-6 text-3xl font-bold text-gray-900">Información de Envíos</h1>
        
        <div class="space-y-8">
          <!-- Envíos Nacionales -->
          <div>
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">Envíos Nacionales (Argentina)</h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="p-4 rounded-lg bg-gray-50">
                <h3 class="mb-2 font-semibold text-gray-800">Envío Estándar</h3>
                <p class="mb-2 text-gray-600">3-5 días hábiles</p>
                <p class="text-sm text-gray-500">Correo Argentino y OCA</p>
              </div>
              <div class="p-4 rounded-lg bg-gray-50">
                <h3 class="mb-2 font-semibold text-gray-800">Envío Express</h3>
                <p class="mb-2 text-gray-600">1-2 días hábiles</p>
                <p class="text-sm text-gray-500">Andreani y MercadoEnvíos</p>
              </div>
            </div>
          </div>

          <!-- CABA y GBA -->
          <div>
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">CABA y Gran Buenos Aires</h2>
            <div class="p-4 rounded-lg bg-indigo-50">
              <h3 class="mb-2 font-semibold text-gray-800">Envío a Domicilio</h3>
              <p class="mb-2 text-gray-600">24-48 horas</p>
              <p class="text-sm text-gray-500">Mensajería propia y motomandados</p>
            </div>
          </div>

          <!-- Envío Gratis -->
          <div class="p-6 border-l-4 border-green-400 rounded-lg bg-green-50">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h3 class="text-lg font-semibold text-green-800">¡Envío Gratis!</h3>
            </div>
            <p class="mt-2 text-green-700">
              En compras superiores a $50.000 el envío es completamente gratis a todo el país.
            </p>
          </div>

          <!-- Política de Envíos -->
          <div>
            <h2 class="mb-4 text-2xl font-semibold text-gray-800">Política de Envíos</h2>
            <div class="space-y-4">
              <div>
                <h3 class="mb-2 font-semibold text-gray-800">Preparación del Pedido</h3>
                <p class="text-gray-600">
                  Los pedidos se procesan en 24-48 horas hábiles. Recibirás una confirmación por email 
                  cuando tu pedido sea despachado junto con el número de seguimiento.
                </p>
              </div>
              
              <div>
                <h3 class="mb-2 font-semibold text-gray-800">Seguimiento</h3>
                <p class="text-gray-600">
                  Una vez despachado tu pedido, recibirás un código de seguimiento para rastrear 
                  tu envío en tiempo real a través de la web del correo correspondiente.
                </p>
              </div>

              <div>
                <h3 class="mb-2 font-semibold text-gray-800">Días y Horarios de Entrega</h3>
                <p class="text-gray-600">
                  Las entregas se realizan de lunes a viernes de 9:00 a 18:00 hs. 
                  Los sábados solo se realizan entregas express en CABA con costo adicional.
                </p>
              </div>
            </div>
          </div>

          <!-- Problemas con el Envío -->
          <div class="p-6 rounded-lg bg-yellow-50">
            <h3 class="mb-2 text-lg font-semibold text-yellow-800">¿Problemas con tu Envío?</h3>
            <p class="mb-3 text-yellow-700">
              Si tu pedido no llega en el tiempo estimado o tienes algún problema con la entrega, 
              contáctanos inmediatamente.
            </p>
            <router-link to="/contact" 
              class="inline-flex items-center px-4 py-2 text-white transition duration-200 bg-yellow-600 rounded-md hover:bg-yellow-700">
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
