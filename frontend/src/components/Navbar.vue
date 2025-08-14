<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            M-Vintage
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-gray-900 font-semibold': $route.path === '/' }"
            >
              Inicio
            </router-link>
            
            <!-- Shop Dropdown -->
            <div class="relative" @mouseleave="closeDropdown">
              <button 
                @mouseenter="openDropdown"
                @click="toggleDropdown"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                :class="{ 'text-gray-900 font-semibold': isShopActive }"
              >
                Tienda
                <svg class="ml-1 h-4 w-4 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div 
                v-show="isDropdownOpen"
                @mouseenter="keepDropdownOpen"
                class="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div class="py-1" role="menu">
                  <router-link 
                    to="/collection/hombre" 
                    @click="closeDropdown"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    role="menuitem"
                  >
                    Hombre
                  </router-link>
                  <router-link 
                    to="/collection/mujer" 
                    @click="closeDropdown"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    role="menuitem"
                  >
                    Mujer
                  </router-link>
                  <router-link 
                    to="/collection/accesorios" 
                    @click="closeDropdown"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    role="menuitem"
                  >
                    Accesorios
                  </router-link>
                  <router-link 
                    to="/collection/ofertas" 
                    @click="closeDropdown"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    role="menuitem"
                  >
                    Ofertas
                  </router-link>
                </div>
              </div>
            </div>
            
            <router-link 
              to="/contact" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-gray-900 font-semibold': $route.path === '/contact' }"
            >
              Contacto
            </router-link>

            <!-- Auth/Admin Section -->
            <div v-if="isAuthenticated" class="flex items-center space-x-4">
              <!-- Admin Panel Link (only for admin/manager roles) -->
              <router-link 
                v-if="hasAdminAccess"
                to="/admin" 
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-gray-900 font-semibold': $route.path?.startsWith('/admin') }"
              >
                Panel Admin
              </router-link>

              <!-- User Menu Dropdown -->
              <div class="relative" @mouseleave="closeUserDropdown">
                <button 
                  @mouseenter="openUserDropdown"
                  @click="toggleUserDropdown"
                  class="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <img 
                    v-if="user?.photoURL" 
                    :src="user.photoURL" 
                    :alt="user.displayName || 'Usuario'"
                    class="w-6 h-6 rounded-full mr-2"
                  >
                  <div v-else class="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  {{ user?.displayName || user?.email || 'Usuario' }}
                  <svg class="ml-1 h-4 w-4 transition-transform" :class="{ 'rotate-180': isUserDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div 
                  v-show="isUserDropdownOpen"
                  @mouseenter="keepUserDropdownOpen"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                  <div class="py-1" role="menu">
                    <router-link 
                      to="/profile" 
                      @click="closeUserDropdown"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      role="menuitem"
                    >
                      Mi Perfil
                    </router-link>
                    <router-link 
                      to="/orders" 
                      @click="closeUserDropdown"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      role="menuitem"
                    >
                      Mis Pedidos
                    </router-link>
                    <button 
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      role="menuitem"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Login button for non-authenticated users -->
            <router-link 
              v-else
              to="/auth" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-gray-900 font-semibold': $route.path === '/auth' }"
            >
              Iniciar Sesión
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-gray-900 p-2 rounded-md transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          <router-link 
            to="/" 
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-gray-900 font-semibold bg-gray-50': $route.path === '/' }"
          >
            Inicio
          </router-link>
          
          <!-- Mobile Shop Section -->
          <div>
            <button 
              @click="toggleMobileShopMenu"
              class="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-between"
              :class="{ 'text-gray-900 font-semibold bg-gray-50': isShopActive }"
            >
              Tienda
              <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isMobileShopMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-show="isMobileShopMenuOpen" class="pl-6 space-y-1">
              <router-link 
                to="/collection/hombre" 
                @click="closeMobileMenu"
                class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Hombre
              </router-link>
              <router-link 
                to="/collection/mujer" 
                @click="closeMobileMenu"
                class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Mujer
              </router-link>
              <router-link 
                to="/collection/accesorios" 
                @click="closeMobileMenu"
                class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accesorios
              </router-link>
              <router-link 
                to="/collection/ofertas" 
                @click="closeMobileMenu"
                class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Ofertas
              </router-link>
            </div>
          </div>
          
          <router-link 
            to="/contact" 
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-gray-900 font-semibold bg-gray-50': $route.path === '/contact' }"
          >
            Contacto
          </router-link>

          <!-- Mobile Auth Section -->
          <div v-if="isAuthenticated" class="border-t border-gray-200 pt-3">
            <router-link 
              v-if="hasAdminAccess"
              to="/admin" 
              @click="closeMobileMenu"
              class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              :class="{ 'text-gray-900 font-semibold bg-gray-50': $route.path?.startsWith('/admin') }"
            >
              Panel Admin
            </router-link>
            
            <router-link 
              to="/profile" 
              @click="closeMobileMenu"
              class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Mi Perfil
            </router-link>
            
            <router-link 
              to="/orders" 
              @click="closeMobileMenu"
              class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Mis Pedidos
            </router-link>
            
            <button 
              @click="handleLogout"
              class="w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          <router-link 
            v-else
            to="/auth" 
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-gray-900 font-semibold bg-gray-50': $route.path === '/auth' }"
          >
            Iniciar Sesión
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Dropdown states
const isDropdownOpen = ref(false)
const isUserDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileShopMenuOpen = ref(false)

// Timeout references for hover behavior
let dropdownTimeout: number | null = null
let userDropdownTimeout: number | null = null

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const hasAdminAccess = computed(() => authStore.hasAdminAccess)

const isShopActive = computed(() => {
  return route.path.startsWith('/collection/')
})

// Shop dropdown methods
const openDropdown = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
  isDropdownOpen.value = true
}

const closeDropdown = () => {
  dropdownTimeout = window.setTimeout(() => {
    isDropdownOpen.value = false
  }, 150)
}

const keepDropdownOpen = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// User dropdown methods
const openUserDropdown = () => {
  if (userDropdownTimeout) {
    clearTimeout(userDropdownTimeout)
    userDropdownTimeout = null
  }
  isUserDropdownOpen.value = true
}

const closeUserDropdown = () => {
  userDropdownTimeout = window.setTimeout(() => {
    isUserDropdownOpen.value = false
  }, 150)
}

const keepUserDropdownOpen = () => {
  if (userDropdownTimeout) {
    clearTimeout(userDropdownTimeout)
    userDropdownTimeout = null
  }
}

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

// Mobile menu methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Close shop submenu when closing mobile menu
  if (!isMobileMenuOpen.value) {
    isMobileShopMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isMobileShopMenuOpen.value = false
}

const toggleMobileShopMenu = () => {
  isMobileShopMenuOpen.value = !isMobileShopMenuOpen.value
}

// Auth methods
const handleLogout = async () => {
  try {
    await authStore.logout()
    // Close all dropdowns
    isUserDropdownOpen.value = false
    isMobileMenuOpen.value = false
    // Redirect to home
    router.push('/')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isDropdownOpen.value = false
    isUserDropdownOpen.value = false
  }
}

// Close mobile menu on route change
const closeMenusOnRouteChange = () => {
  isMobileMenuOpen.value = false
  isMobileShopMenuOpen.value = false
  isDropdownOpen.value = false
  isUserDropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Watch for route changes to close menus
  router.afterEach(closeMenusOnRouteChange)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Clean up timeouts
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
  }
  if (userDropdownTimeout) {
    clearTimeout(userDropdownTimeout)
  }
})
</script>