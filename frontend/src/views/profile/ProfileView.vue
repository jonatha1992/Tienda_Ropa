<template>
  <div class="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-light text-gray-900 font-heading">Mi Perfil</h2>
          <p class="mt-1 text-sm text-gray-500 font-body">
            Gestiona tu información personal y preferencias
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Sidebar -->
        <div class="lg:col-span-3">
          <nav class="space-y-1">
            <router-link to="/profile" class="flex items-center px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
              <UserIcon class="w-5 h-5 mr-3 text-gray-500" />
              Mi Perfil
            </router-link>
            <router-link to="/orders" class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
              <ShoppingBagIcon class="w-5 h-5 mr-3 text-gray-400" />
              Mis Pedidos
            </router-link>
            <button class="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
              <ArrowLeftOnRectangleIcon class="w-5 h-5 mr-3 text-red-500" />
              Cerrar Sesión
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-9">
          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900 font-heading">
                Información del Perfil
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <form class="space-y-6">
                <div class="flex items-center mb-6 space-x-6">
                  <div class="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full">
                    <img
                      class="w-full h-full text-gray-300"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div>
                    <div class="text-lg font-medium text-gray-900 font-heading">María González</div>
                    <div class="text-sm text-gray-500 font-body">Cliente desde Mayo 2023</div>
                  </div>
                </div>

                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 font-body">Nombre</label>
                    <input
                      type="text"
                      class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      value="María"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 font-body">Apellido</label>
                    <input
                      type="text"
                      class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      value="GonzÃ¡lez"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-4">
                    <label class="block text-sm font-medium text-gray-700 font-body">Correo electrónico</label>
                    <input
                      type="email"
                      class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      value="maria.gonzalez@example.com"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 font-body">Telefono</label>
                    <input
                      type="tel"
                      class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      value="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div class="flex justify-end mt-8 space-x-3">
                  <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, ShoppingBagIcon, ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/outline'
</script>

