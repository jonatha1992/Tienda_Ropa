import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
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

const routes = [
  { path: '/', component: HomeView },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: ShoppingCart },
  { path: '/auth', component: AuthView },
  { path: '/contact', component: ContactView },
  { path: '/how-to-shop', component: HowToShopView },
  { path: '/shipping', component: ShippingView },
  {
    path: '/admin/products',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    component: AdminUserManagementView,
    meta: { requiresAuth: true }
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

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Ruta protegida, redirigiendo a login');
    next('/auth');
  } else if (to.path === '/auth' && authStore.isAuthenticated) {
    console.log('✅ Usuario ya autenticado, redirigiendo a admin');
    next('/admin/products');
  } else {
    next();
  }
});

export default router;
