<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="font-heading text-3xl font-bold text-gray-900 mb-6">Cómo Comprar</h1>
        
        <div class="space-y-8">
          <!-- Paso 1 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                <span class="font-body">1</span>
              </div>
            </div>
            <div>
              <h2 class="font-heading text-xl font-semibold text-gray-800 mb-2">Navega nuestra colección</h2>
              <p class="font-body text-gray-600">
                Explora nuestras categorías: JACKET, BLAZER, DRESS, JEAN y muchas más. 
                Usa los filtros para encontrar exactamente lo que buscas.
              </p>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                <span class="font-body">2</span>
              </div>
            </div>
            <div>
              <h2 class="font-heading text-xl font-semibold text-gray-800 mb-2">Selecciona tu talla y color</h2>
              <p class="font-body text-gray-600">
                Revisa nuestras guías de tallas para encontrar el ajuste perfecto. 
                Elige entre nuestra variedad de colores disponibles.
              </p>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                <span class="font-body">3</span>
              </div>
            </div>
            <div>
              <h2 class="font-heading text-xl font-semibold text-gray-800 mb-2">Agrega al carrito</h2>
              <p class="font-body text-gray-600">
                Una vez que hayas seleccionado tus productos, agrégalos al carrito de compras. 
                Puedes seguir comprando o proceder al checkout.
              </p>
            </div>
          </div>

          <!-- Paso 4 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                <span class="font-body">4</span>
              </div>
            </div>
            <div>
              <h2 class="font-heading text-xl font-semibold text-gray-800 mb-2">Completa tu compra</h2>
              <p class="font-body text-gray-600">
                Proporciona tu información de envío y elige tu método de pago preferido. 
                Aceptamos tarjetas de crédito, débito y transferencias bancarias.
              </p>
            </div>
          </div>

          <!-- Métodos de pago -->
          <div class="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 class="font-heading text-lg font-semibold text-gray-800 mb-4">Métodos de Pago Aceptados</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="bg-white p-3 rounded shadow">
                  <span class="font-body text-sm text-gray-600">Visa</span>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-white p-3 rounded shadow">
                  <span class="font-body text-sm text-gray-600">Mastercard</span>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-white p-3 rounded shadow">
                  <span class="font-body text-sm text-gray-600">American Express</span>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-white p-3 rounded shadow">
                  <span class="font-body text-sm text-gray-600">Transferencia</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contacto -->
          <div class="bg-indigo-50 p-6 rounded-lg">
            <h3 class="font-heading text-lg font-semibold text-gray-800 mb-2">¿Necesitas ayuda?</h3>
            <p class="font-body text-gray-600 mb-3">
              Si tienes alguna pregunta sobre el proceso de compra, no dudes en contactarnos.
            </p>
            <router-link to="/contact" 
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">
              <span class="font-body">Contactar</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Información sobre cómo comprar
</script>
