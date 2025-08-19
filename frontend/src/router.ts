import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CollectionView from './views/CollectionView.vue'
import ProductDetailView from './views/ProductDetailView.vue'
import CheckoutView from './views/CheckoutView.vue'
import CartView from './views/CartView.vue'
import AuthView from './views/AuthView.vue'
import AdminView from './views/AdminView.vue'
import AdminUserManagementView from './views/AdminUserManagementView.vue'
import AdminPaymentsView from './views/AdminPaymentsView.vue'
import PaymentSuccessView from './views/PaymentSuccessView.vue'
import PaymentFailureView from './views/PaymentFailureView.vue'
import PaymentPendingView from './views/PaymentPendingView.vue'
import TransferInstructionsView from './views/TransferInstructionsView.vue'
import CashConfirmationView from './views/CashConfirmationView.vue'
import { useAuthStore } from './store/auth';
import { auth } from './config/index'; // Importar auth
import { authCache } from './utils/cache';
import { useLoading } from './composables/useLoading';
import { globalProgressBar } from './composables/useProgressBar';
import ContactView from './views/ContactView.vue';
import HowToShopView from './views/HowToShopView.vue';
import ShippingView from './views/ShippingView.vue';
import TermsView from './views/TermsView.vue';
import PrivacyView from './views/PrivacyView.vue';
import OrdersView from './views/OrdersView.vue';
import OrderDetailView from './views/OrderDetailView.vue';
import VerifyEmailView from './views/VerifyEmailView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: CollectionView },
  { path: '/product/:id', component: ProductDetailView },
  { path: '/cart', component: CartView },
  { path: '/checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/auth', component: AuthView },
  { path: '/verify-email', component: VerifyEmailView },
  { path: '/contact', component: ContactView },
  { path: '/how-to-shop', component: HowToShopView },
  { path: '/shipping', component: ShippingView },
  { path: '/terms', component: TermsView },
  { path: '/privacy', component: PrivacyView },
  // Orders routes
  { path: '/orders', component: OrdersView, meta: { requiresAuth: true } },
  { path: '/orders/:id', component: OrderDetailView, meta: { requiresAuth: true } },
  // Payment result routes
  { path: '/payment/success', component: PaymentSuccessView },
  { path: '/payment/failure', component: PaymentFailureView },
  { path: '/payment/pending', component: PaymentPendingView },
  { path: '/payment/transfer-instructions', component: TransferInstructionsView },
  { path: '/payment/cash-confirmation', component: CashConfirmationView },
  {
    path: '/admin',
    redirect: '/admin/products'
  },
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
  {
    path: '/admin/payments',
    component: AdminPaymentsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    component: AdminPaymentsView, // Reutilizamos AdminPaymentsView que ya tiene la gestión de pedidos
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para rutas protegidas
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { showLoading } = useLoading();
  // Mostrar progress bar al cambiar de ruta
  if (to.path !== from.path) {
    globalProgressBar.start();
  }

  // Esperar a que se inicialice la autenticación si aún no se ha hecho
  if (authStore.loading) {
    // Verificar si ya hay datos en caché para acelerar
    const cachedRoles = authCache.get('userRoles')
    if (cachedRoles) {
      authStore.userRoles.value = cachedRoles
    }
    
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
    // Early return si ya tiene acceso admin y roles cargados
    if (authStore.hasAdminAccess && authStore.userRoles.length > 0) {
      return next();
    }

    // Si no hay roles cargados, intentar cargarlos (con caché)
    if (authStore.userRoles.length === 0) {
      try {
        await authStore.fetchUserRoles(false); // false = usar caché si está disponible
      } catch (error) {
        console.error('❌ Error cargando roles:', error);
      }
    }

    // Verificación final sin logs innecesarios
    if (!authStore.hasAdminAccess) {
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

// Completar progress bar después de navegar
router.afterEach(() => {
  globalProgressBar.complete();
});

export default router;
