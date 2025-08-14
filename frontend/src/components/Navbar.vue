<template>
  <nav class="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2 text-2xl font-light tracking-wider text-gray-900 hover:text-gray-700">
            <img src="/imagen-portada.svg" alt="M-VINTAGE Logo" class="w-10 h-10" />
            <span>M-VINTAGE</span>
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="items-center hidden space-x-4 md:flex">
          <div class="flex items-baseline space-x-4">
            <div class="relative">
              <button @click.stop="toggleShopMenu"
                class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">
                SHOP ▼
              </button>
              <div v-if="isShopMenuOpen" @click.stop
                class="absolute z-10 w-48 mt-2 bg-white border border-gray-100 shadow-lg">
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <div v-if="categories.length === 0" class="px-4 py-2 text-sm italic text-gray-500">
                    No hay stock con categorías
                  </div>
                  <router-link v-else v-for="category in categories" :key="category.id"
                    :to="`/shop?category=${category.name.toLowerCase()}`" @click="closeMenus"
                    class="block px-4 py-2 text-sm tracking-wide text-gray-900 uppercase transition-colors hover:bg-gray-50" role="menuitem">{{
                    category.name }}</router-link>
                </div>
              </div>
            </div>
            <!-- Admin Menu - Solo visible para administradores -->
            <div v-if="authStore.hasAdminAccess" class="relative">
              <button @click.stop="toggleAdminMenu"
                class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">ADMIN ▼</button>
              <div v-if="isAdminMenuOpen" @click.stop
                class="absolute z-50 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                style="top: 100%; left: 0; min-width: 200px;">
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <router-link to="/admin/products" @click="closeMenus"
                    class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">
                    Gestionar Productos
                  </router-link>
                  <router-link to="/admin/users" @click="closeMenus"
                    class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">
                    Gestionar Usuarios
                  </router-link>
                </div>
              </div>
            </div>
            
            <router-link to="/contact" class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">CONTACT</router-link>
            <router-link to="/how-to-shop" class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">HOW TO SHOP</router-link>
            <router-link to="/shipping" class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">ENVÍOS</router-link>
          </div>

          <!-- Desktop Auth & Cart -->
          <div class="flex items-center space-x-4">
            <router-link to="/cart" class="p-2 text-gray-900 transition-colors hover:text-gray-600 focus:outline-none">
              <span class="sr-only">Carrito</span>
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </router-link>
            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2">
              <button @click="handleLogout" class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">Cerrar Sesión</button>
            </div>
            <router-link v-else to="/auth" class="px-3 py-2 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">Iniciar Sesión</router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center md:hidden">
          <router-link to="/cart" class="p-2 mr-4 text-gray-900 transition-colors hover:text-gray-600 focus:outline-none"><span class="sr-only">Carrito</span><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></router-link>
          <button @click.stop="toggleMobileMenu" class="inline-flex items-center justify-center p-2 text-gray-900 transition-colors hover:text-gray-600 focus:outline-none">
            <span class="sr-only">Open main menu</span>
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="bg-white border-t border-gray-100 md:hidden">
      <div class="px-4 pt-4 pb-6 space-y-2">
        <button @click.stop="toggleMobileShopMenu" class="block w-full px-3 py-3 text-sm font-medium tracking-wide text-left text-gray-900 uppercase transition-colors hover:text-gray-600">SHOP</button>
        <div v-if="isMobileShopMenuOpen" class="pl-4 space-y-1">
          <div v-if="categories.length === 0" class="px-3 py-2 text-sm italic text-gray-500">
            - No hay stock con categorías
          </div>
          <router-link v-else v-for="category in categories" :key="category.id" :to="`/shop?category=${category.name.toLowerCase()}`" @click="closeMenus" class="block px-3 py-2 text-sm tracking-wide text-gray-700 uppercase transition-colors hover:text-gray-900">- {{ category.name }}</router-link>
        </div>
        <!-- Admin Menu Mobile - Solo visible para administradores -->
        <div v-if="authStore.hasAdminAccess">
          <button @click.stop="toggleMobileAdminMenu" class="block w-full px-3 py-3 text-sm font-medium tracking-wide text-left text-gray-900 uppercase transition-colors hover:text-gray-600">ADMIN</button>
          <div v-if="isMobileAdminMenuOpen" class="pl-4 space-y-1">
            <router-link to="/admin/products" @click="closeMenus" class="block px-3 py-2 text-sm text-gray-700 transition-colors hover:text-gray-900">- Gestionar Productos</router-link>
            <router-link to="/admin/users" @click="closeMenus" class="block px-3 py-2 text-sm text-gray-700 transition-colors hover:text-gray-900">- Gestionar Usuarios</router-link>
          </div>
        </div>
        
        <router-link to="/contact" @click="closeMenus" class="block px-3 py-3 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">CONTACT</router-link>
        <router-link to="/how-to-shop" @click="closeMenus" class="block px-3 py-3 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">HOW TO SHOP</router-link>
        <router-link to="/shipping" @click="closeMenus" class="block px-3 py-3 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">ENVÍOS</router-link>
        
        <div class="pt-4 mt-4 border-t border-gray-200">
          <div v-if="authStore.isAuthenticated" class="flex items-center px-3 mb-3">
            <div>
              <div class="text-sm font-medium text-gray-900">{{ authStore.firebaseUser?.displayName }}</div>
              <div class="text-xs text-gray-500">{{ authStore.firebaseUser?.email }}</div>
            </div>
          </div>
          <div class="space-y-1">
            <button v-if="authStore.isAuthenticated" @click="handleLogout" class="block w-full px-3 py-3 text-sm font-medium tracking-wide text-left text-gray-900 uppercase transition-colors hover:text-gray-600">Cerrar Sesión</button>
            <router-link v-else to="/auth" @click="closeMenus" class="block px-3 py-3 text-sm font-medium tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">Iniciar Sesión</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref,  onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { masterDataApi } from '../api';
import type { Category } from '../types';

const isShopMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isMobileShopMenuOpen = ref(false);
const isAdminMenuOpen = ref(false);
const isMobileAdminMenuOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const categories = ref<Category[]>([]);

const toggleShopMenu = () => {
  isShopMenuOpen.value = !isShopMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleMobileShopMenu = () => {
  isMobileShopMenuOpen.value = !isMobileShopMenuOpen.value;
}

const toggleAdminMenu = () => {
  console.log('🔧 toggleAdminMenu clicked, current state:', isAdminMenuOpen.value);
  isAdminMenuOpen.value = !isAdminMenuOpen.value;
  console.log('🔧 toggleAdminMenu new state:', isAdminMenuOpen.value);
};

const toggleMobileAdminMenu = () => {
  isMobileAdminMenuOpen.value = !isMobileAdminMenuOpen.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    closeMenus();
    router.push('/');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const loadCategories = async () => {
  try {
    // Usar endpoint que solo devuelve categorías con stock
    categories.value = await masterDataApi.getCategoriesWithStock();
  } catch (error) {
    console.error('❌ Error cargando categorías:', error);
    // Fallback a todas las categorías si falla
    try {
      categories.value = await masterDataApi.getCategories();
    } catch (fallbackError) {
      console.error('❌ Error cargando categorías (fallback):', fallbackError);
    }
  }
};

const closeMenus = () => {
  isShopMenuOpen.value = false;
  isMobileMenuOpen.value = false;
  isMobileShopMenuOpen.value = false;
  isAdminMenuOpen.value = false;
  isMobileAdminMenuOpen.value = false;
};

onMounted(() => {
  loadCategories();
  document.addEventListener('click', closeMenus);
  
  // Debug: verificar estado de admin cada segundo
  setInterval(() => {
    console.log('🔍 Debug Navbar - hasAdminAccess:', authStore.hasAdminAccess, 'userRoles:', authStore.userRoles);
  }, 5000);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenus);
});
</script>
