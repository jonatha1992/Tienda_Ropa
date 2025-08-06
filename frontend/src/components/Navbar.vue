<template>
  <nav class="bg-secondary shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex-shrink-0">
          <a href="/" class="text-2xl font-bold text-primary">M-VINTAGE</a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <div class="relative">
              <button @click.stop="toggleShopMenu"
                class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">SHOP</button>
              <div v-if="isShopMenuOpen" @click.stop
                class="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-secondary ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">JACKET</a>
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">BLAZER</a>
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">DRESS</a>
                  <a href="#" class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">JEAN</a>
                </div>
              </div>
            </div>
            <a href="#" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">CONTACT</a>
            <a href="#" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">HOW TO SHOP</a>
            <a href="#" class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">ENVÍOS</a>
            
            <!-- Admin Menu -->
            <div v-if="authStore.isAuthenticated && hasAdminAccess" class="relative">
              <button @click.stop="toggleAdminMenu"
                class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium flex items-center">
                ADMIN
                <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="isAdminMenuOpen" @click.stop
                class="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <router-link to="/admin/products" @click="closeMenus"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    Gestión de Productos
                  </router-link>
                  <router-link v-if="hasUserManagementAccess" to="/admin/users" @click="closeMenus"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
                    </svg>
                    Gestión de Usuarios
                  </router-link>
                  <div class="border-t border-gray-100 my-1"></div>
                  <div class="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                    Roles: {{ userRolesText }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <router-link to="/cart"
            class="p-1 rounded-full text-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span class="sr-only">Carrito</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </router-link>

          <!-- Auth Section -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <img v-if="authStore.firebaseUser?.photoURL" :src="authStore.firebaseUser.photoURL"
                :alt="authStore.firebaseUser.displayName || 'User'" class="w-8 h-8 rounded-full" />
              <div v-else class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ (authStore.firebaseUser?.displayName || authStore.firebaseUser?.email)?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-sm text-primary">
                {{ authStore.firebaseUser?.displayName || authStore.firebaseUser?.email }}
              </span>
            </div>
            <button @click="handleLogout"
              class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
              Cerrar Sesión
            </button>
          </div>

          <router-link v-else to="/auth"
            class="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
            Iniciar Sesión
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { rolesApi } from '../api';
import type { Role } from '../types';

const isShopMenuOpen = ref(false);
const isAdminMenuOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const userRoles = ref<Role[]>([]);

const toggleShopMenu = () => {
  isShopMenuOpen.value = !isShopMenuOpen.value;
  // Cerrar otros menús
  isAdminMenuOpen.value = false;
};

const toggleAdminMenu = () => {
  isAdminMenuOpen.value = !isAdminMenuOpen.value;
  // Cerrar otros menús
  isShopMenuOpen.value = false;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    userRoles.value = [];
    router.push('/');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

// Computed properties para verificar roles
const hasAdminAccess = computed(() => {
  return userRoles.value.some(role => 
    role.name === 'admin' || role.name === 'manager'
  );
});

const hasUserManagementAccess = computed(() => {
  return userRoles.value.some(role => role.name === 'admin');
});

const userRolesText = computed(() => {
  if (userRoles.value.length === 0) return 'Cargando...';
  return userRoles.value.map(role => role.name.toUpperCase()).join(', ');
});

// Cargar roles del usuario cuando se autentica
const loadUserRoles = async () => {
  if (!authStore.isAuthenticated) {
    userRoles.value = [];
    return;
  }

  try {
    userRoles.value = await rolesApi.getMyRoles();
    console.log('✅ Roles del usuario cargados:', userRoles.value);
  } catch (error) {
    console.error('❌ Error cargando roles del usuario:', error);
    userRoles.value = [];
  }
};

// Cerrar menús al hacer clic fuera
const closeMenus = () => {
  isShopMenuOpen.value = false;
  isAdminMenuOpen.value = false;
};

// Lifecycle
onMounted(() => {
  // Cargar roles si ya está autenticado
  if (authStore.isAuthenticated) {
    loadUserRoles();
  }

  // Escuchar cambios en la autenticación
  const checkAuth = setInterval(() => {
    if (authStore.isAuthenticated && userRoles.value.length === 0) {
      loadUserRoles();
      clearInterval(checkAuth);
    }
  }, 1000);

  // Limpiar interval después de 10 segundos para evitar loops infinitos
  setTimeout(() => clearInterval(checkAuth), 10000);

  // Agregar event listener para cerrar menús al hacer clic fuera
  document.addEventListener('click', closeMenus);
});

// Cleanup
import { onUnmounted } from 'vue';
onUnmounted(() => {
  document.removeEventListener('click', closeMenus);
});
</script>
