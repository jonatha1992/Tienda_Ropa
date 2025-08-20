<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
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
              <UserIcon class="mr-3 h-5 w-5 text-gray-500" />
              Mi Perfil
            </router-link>
            <router-link to="/orders" class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              <ShoppingBagIcon class="mr-3 h-5 w-5 text-gray-400" />
              Mis Pedidos
            </router-link>
            <button class="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
              <ArrowLeftOnRectangleIcon class="mr-3 h-5 w-5 text-red-500" />
              Cerrar Sesión
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-9">
          <div class="bg-white shadow overflow-hidden rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900 font-heading">
                Información del Perfil
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <form class="space-y-6">
                <div class="flex items-center space-x-6 mb-6">
                  <div class="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    <img
                      class="h-full w-full text-gray-300"
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
                      class="mt-1 focus:ring-black focus:border-black block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value="María"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 font-body">Apellido</label>
                    <input
                      type="text"
                      class="mt-1 focus:ring-black focus:border-black block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value="González"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-4">
                    <label class="block text-sm font-medium text-gray-700 font-body">Correo electrónico</label>
                    <input
                      type="email"
                      class="mt-1 focus:ring-black focus:border-black block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value="maria.gonzalez@example.com"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 font-body">Teléfono</label>
                    <input
                      type="tel"
                      class="mt-1 focus:ring-black focus:border-black block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div class="flex justify-end space-x-3 mt-8">
                  <button type="button" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
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
