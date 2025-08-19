<template>
  <div class="min-h-screen py-8 bg-gray-50">
    <div class="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
      <div class="p-6 bg-white rounded-lg shadow">
        <h1 class="mb-6 text-3xl font-bold text-gray-900 font-heading">Cómo Comprar</h1>
        
        <div class="space-y-8">
          <!-- Paso 1 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-500 rounded-full">
                <span class="text-white" >1</span>
              </div>
            </div>
            <div> 
              <h2 class="mb-2 text-xl font-semibold text-gray-800 font-heading">Navega nuestra colección</h2>
              <p class="font-body text-body-text">
                Explora nuestras categorías: JACKET, BLAZER, DRESS, JEAN y muchas más. 
                Usa los filtros para encontrar exactamente lo que buscas.
              </p>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-500 rounded-full">
                <span class="text-white" >2</span>
              </div>
            </div>
            <div>
              <h2 class="mb-2 text-xl font-semibold text-gray-800 font-heading">Selecciona tu talla y color</h2>
              <p class="font-body text-body-text">
                Revisa nuestras guías de tallas para encontrar el ajuste perfecto. 
                Elige entre nuestra variedad de colores disponibles.
              </p>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-500 rounded-full">
                <span class="text-white">3</span>
              </div>
            </div>
            <div>
              <h2 class="mb-2 text-xl font-semibold text-gray-800 font-heading">Agrega al carrito</h2>
              <p class="font-body text-body-text">
                Una vez que hayas seleccionado tus productos, agrégalos al carrito de compras. 
                Puedes seguir comprando o proceder al checkout.
              </p>
            </div>
          </div>

          <!-- Paso 4 -->
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-500 rounded-full">
                <span class="text-white" >4</span>
              </div>
            </div>
            <div>
              <h2 class="mb-2 text-xl font-semibold text-gray-800 font-heading">Completa tu compra</h2>
              <p class="font-body text-body-text">
                Proporciona tu información de envío y elige tu método de pago preferido. 
                Aceptamos tarjetas de crédito, débito y transferencias bancarias.
              </p>
            </div>
          </div>

          <!-- Métodos de pago -->
          <div class="p-6 mt-8 rounded-lg bg-gray-50">
            <h3 class="mb-4 text-lg font-semibold text-gray-800 font-heading">Métodos de Pago Aceptados</h3>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="text-center">
                <div class="p-3 bg-white rounded shadow">
                  <span class="text-sm font-body text-body-text">Visa</span>
                </div>
              </div>
              <div class="text-center">
                <div class="p-3 bg-white rounded shadow">
                  <span class="text-sm font-body text-body-text">Mastercard</span>
                </div>
              </div>
              <div class="text-center">
                <div class="p-3 bg-white rounded shadow">
                  <span class="text-sm font-body text-body-text">American Express</span>
                </div>
              </div>
              <div class="text-center">
                <div class="p-3 bg-white rounded shadow">
                  <span class="text-sm font-body text-body-text">Transferencia</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contacto -->
          <div class="p-6 rounded-lg bg-indigo-50">
            <h3 class="mb-2 text-lg font-semibold text-gray-800 font-heading">¿Necesitas ayuda?</h3>
            <p class="mb-3 font-body text-body-text">
              Si tienes alguna pregunta sobre el proceso de compra, no dudes en contactarnos.
            </p>
            <router-link to="/contact" 
              class="inline-flex items-center px-4 py-2 text-white transition duration-200 bg-gray-300 rounded-md gray-600 hover:bg-gray-700">
              <span >Contactar</span>
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
