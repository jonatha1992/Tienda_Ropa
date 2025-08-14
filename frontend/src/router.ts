import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
<<<<<<< HEAD
=======
import CollectionView from './views/CollectionView.vue';
>>>>>>> dev
import ProductDetail from './components/ProductDetail.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import AdminUserManagementView from './views/AdminUserManagementView.vue';
import AuthView from './views/AuthView.vue';
import { useAuthStore } from './store/auth';
import { auth } from './firebase'; // Importar auth
import AdminView from './views/AdminView.vue';
import ContactView from './views/ContactView.vue';
import HowToShopView from './views/HowToShopView.vue';
import ShippingView from './views/ShippingView.vue';
<<<<<<< HEAD

const routes = [
  { path: '/', component: HomeView },
=======
import TermsView from './views/TermsView.vue';
import PrivacyView from './views/PrivacyView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: CollectionView },
  { path: '/collection', component: CollectionView },
>>>>>>> dev
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: ShoppingCart },
  { path: '/auth', component: AuthView },
  { path: '/contact', component: ContactView },
  { path: '/how-to-shop', component: HowToShopView },
  { path: '/shipping', component: ShippingView },
<<<<<<< HEAD
=======
  { path: '/terms', component: TermsView },
  { path: '/privacy', component: PrivacyView },
>>>>>>> dev
  {
    path: '/admin/products',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    component: AdminUserManagementView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para rutas protegidas
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Esperar a que se inicialice la autenticación si aún no se ha hecho
  if (authStore.loading) {
    await new Promise(resolve => {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        unsubscribe();
        resolve(user);
      });
    });
    await authStore.initAuth();
  }

<<<<<<< HEAD
=======
  // Para rutas de admin, asegurar que los roles estén cargados
  if (to.meta.requiresAdmin && authStore.isAuthenticated) {
    console.log('🔍 Verificando permisos de admin...');
    
    // Si no hay roles cargados, intentar cargarlos
    if (authStore.userRoles.length === 0) {
      console.log('📋 Cargando roles del usuario...');
      try {
        await authStore.fetchUserRoles();
      } catch (error) {
        console.error('❌ Error cargando roles:', error);
      }
    }
    
    console.log('🔐 Roles del usuario:', authStore.userRoles);
    console.log('🔐 Tiene acceso admin:', authStore.hasAdminAccess);
    
    if (!authStore.hasAdminAccess) {
      console.log('🔒 Usuario sin permisos de admin, redirigiendo a home');
      next('/');
      return;
    }
  }

>>>>>>> dev
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Ruta protegida, redirigiendo a login');
    next('/auth');
<<<<<<< HEAD
  } else if (to.meta.requiresAdmin && !authStore.hasAdminAccess) {
    console.log('🔒 Ruta de admin, usuario sin permisos, redirigiendo a home');
    next('/');
=======
>>>>>>> dev
  } else if (to.path === '/auth' && authStore.isAuthenticated) {
    // Si el usuario ya está autenticado, redirigir según sus roles
    if (authStore.hasAdminAccess) {
      console.log('✅ Admin autenticado, redirigiendo a admin');
      next('/admin/products');
    } else {
      console.log('✅ Usuario regular autenticado, redirigiendo a home');
      next('/');
    }
  } else {
    next();
  }
});

export default router;
