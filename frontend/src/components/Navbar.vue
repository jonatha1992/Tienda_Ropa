<template>
  <nav class="shadow-md bg-secondary">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-primary">M-VINTAGE</router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="items-center hidden space-x-4 md:flex">
          <div class="flex items-baseline space-x-4">
            <div class="relative">
              <button @click.stop="toggleShopMenu"
                class="px-3 py-2 text-sm font-medium rounded-md text-primary hover:text-accent">SHOP</button>
              <div v-if="isShopMenuOpen" @click.stop
                class="absolute z-10 w-48 mt-2 rounded-md shadow-lg bg-secondary ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <div v-if="categories.length === 0" class="px-4 py-2 text-sm italic text-gray-500">
                    No hay stock con categorías
                  </div>
                  <router-link v-else v-for="category in categories" :key="category.id"
                    :to="`/?category=${category.name.toUpperCase()}`" @click="closeMenus"
                    class="block px-4 py-2 text-sm text-primary hover:bg-gray-100" role="menuitem">{{
                    category.name }}</router-link>
                </div>
              </div>
            </div>
            <router-link to="/contact" class="px-3 py-2 text-sm font-medium rounded-md text-primary hover:text-accent">CONTACT</router-link>
            <router-link to="/how-to-shop" class="px-3 py-2 text-sm font-medium rounded-md text-primary hover:text-accent">HOW TO SHOP</router-link>
            <router-link to="/shipping" class="px-3 py-2 text-sm font-medium rounded-md text-primary hover:text-accent">ENVÍOS</router-link>
          </div>

          <!-- Desktop Auth & Cart -->
          <div class="flex items-center space-x-4">
            <router-link to="/cart" class="p-1 rounded-full text-accent hover:text-primary focus:outline-none">
              <span class="sr-only">Carrito</span>
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </router-link>
            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2">
              <button @click="handleLogout" class="px-3 py-2 text-sm font-medium rounded-md text-primary hover:text-accent">Cerrar Sesión</button>
            </div>
            <router-link v-else to="/auth" class="px-3 py-2 text-sm font-medium rounded-md text-primary hover:text-accent">Iniciar Sesión</router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center md:hidden">
          <router-link to="/cart" class="p-1 mr-4 rounded-full text-accent hover:text-primary focus:outline-none"><span class="sr-only">Carrito</span><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></router-link>
          <button @click.stop="toggleMobileMenu" class="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-accent focus:outline-none">
            <span class="sr-only">Open main menu</span>
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <button @click.stop="toggleMobileShopMenu" class="block w-full px-3 py-2 text-base font-medium text-left rounded-md text-primary hover:text-accent hover:bg-gray-600">SHOP</button>
        <div v-if="isMobileShopMenuOpen" class="pl-4">
          <div v-if="categories.length === 0" class="px-3 py-2 text-base italic font-medium text-gray-400">
            - No hay stock con categorías
          </div>
          <router-link v-else v-for="category in categories" :key="category.id" :to="`/?category=${category.name.toUpperCase()}`" @click="closeMenus" class="block px-3 py-2 text-base font-medium rounded-md text-primary hover:text-accent hover:bg-gray-600">- {{ category.name }}</router-link>
        </div>
        <router-link to="/contact" @click="closeMenus" class="block px-3 py-2 text-base font-medium rounded-md text-primary hover:text-accent hover:bg-gray-600">CONTACT</router-link>
        <router-link to="/how-to-shop" @click="closeMenus" class="block px-3 py-2 text-base font-medium rounded-md text-primary hover:text-accent hover:bg-gray-600">HOW TO SHOP</router-link>
        <router-link to="/shipping" @click="closeMenus" class="block px-3 py-2 text-base font-medium rounded-md text-primary hover:text-accent hover:bg-gray-600">ENVÍOS</router-link>
        
        <div class="pt-4 mt-4 border-t border-gray-700">
          <div v-if="authStore.isAuthenticated" class="flex items-center px-3">
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-primary">{{ authStore.firebaseUser?.displayName }}</div>
              <div class="text-sm font-medium leading-none text-gray-400">{{ authStore.firebaseUser?.email }}</div>
            </div>
          </div>
          <div class="px-2 mt-3 space-y-1">
            <button v-if="authStore.isAuthenticated" @click="handleLogout" class="block w-full px-3 py-2 text-base font-medium text-left rounded-md text-primary hover:text-accent hover:bg-gray-600">Cerrar Sesión</button>
            <router-link v-else to="/auth" @click="closeMenus" class="block px-3 py-2 text-base font-medium rounded-md text-primary hover:text-accent hover:bg-gray-600">Iniciar Sesión</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { masterDataApi } from '../api';
import type { Category } from '../types';

const isShopMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isMobileShopMenuOpen = ref(false);
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
};

onMounted(() => {
  loadCategories();
  document.addEventListener('click', closeMenus);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenus);
});
</script>
