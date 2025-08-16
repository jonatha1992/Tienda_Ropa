import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ShopView from './views/ShopView.vue'
import ProductView from './views/ProductView.vue'
import CartView from './views/CartView.vue'
import CheckoutView from './views/CheckoutView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import AdminView from './views/AdminView.vue'
import PaymentSuccessView from './views/PaymentSuccessView.vue'
import PaymentFailureView from './views/PaymentFailureView.vue'
import PaymentPendingView from './views/PaymentPendingView.vue'
import { useAuthStore } from './store/auth';
import { auth } from './config/index'; // Importar auth
import ContactView from './views/ContactView.vue';
import HowToShopView from './views/HowToShopView.vue';
import ShippingView from './views/ShippingView.vue';
import TermsView from './views/TermsView.vue';
import PrivacyView from './views/PrivacyView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: ShopView },
  { path: '/product/:id', component: ProductView },
  { path: '/cart', component: CartView },
  { path: '/checkout', component: CheckoutView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/contact', component: ContactView },
  { path: '/how-to-shop', component: HowToShopView },
  { path: '/shipping', component: ShippingView },
  { path: '/terms', component: TermsView },
  { path: '/privacy', component: PrivacyView },
  // Payment result routes
  { path: '/payment/success', component: PaymentSuccessView },
  { path: '/payment/failure', component: PaymentFailureView },
  { path: '/payment/pending', component: PaymentPendingView },
  {
    path: '/admin',
    component: AdminView,
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

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Ruta protegida, redirigiendo a login');
    next('/auth');
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
