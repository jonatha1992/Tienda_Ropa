import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import ProductDetail from './components/ProductDetail.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ProductAdmin from './components/ProductAdmin.vue';
import Auth from './components/Auth.vue';
import { useAuthStore } from './store/auth';
import { auth } from './firebase'; // Importar auth

const routes = [
  { path: '/', component: Home },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: ShoppingCart },
  { path: '/auth', component: Auth },
  {
    path: '/admin/products',
    component: ProductAdmin,
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
      const unsubscribe = auth.onAuthStateChanged(user => {
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
