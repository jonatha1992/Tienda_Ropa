<template>
  <div class="min-h-screen py-8 bg-gray-50">
    <div class="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
      <div class="p-6 bg-white rounded-lg shadow">
        <h1 class="font-heading mb-6 text-3xl font-bold text-gray-900">Contacto</h1>
        
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Información de contacto -->
          <div>
            <h2 class="font-heading mb-4 text-xl font-semibold text-gray-800">Información de Contacto</h2>
            <div class="space-y-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:mvintageapp@gmail.com" class="font-body text-gray-600 transition-colors hover:text-gray-900">mvintageapp@gmail.com</a>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <a href="tel:+5491139471826" class="font-body text-gray-600 transition-colors hover:text-gray-900">+54 9 11 3947-1826</a>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="font-body text-gray-600">Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          <!-- Formulario de contacto -->
          <div>
            <h2 class="font-heading mb-4 text-xl font-semibold text-gray-800">Envíanos un mensaje</h2>
            <form class="space-y-4">
              <div>
                <label for="name" class="font-body block mb-1 text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" id="name" name="name" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tu nombre">
              </div>
              <div>
                <label for="email" class="font-body block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="tu@email.com">
              </div>
              <div>
                <label for="message" class="font-body block mb-1 text-sm font-medium text-gray-700">Mensaje</label>
                <textarea id="message" name="message" rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tu mensaje..."></textarea>
              </div>
              <button type="submit"
                class="w-full px-4 py-2 text-white transition duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700">
                <span class="font-body">Enviar Mensaje</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Funcionalidad básica de contacto
</script>
