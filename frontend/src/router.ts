import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import ProductDetail from './components/ProductDetail.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ProductAdmin from './components/ProductAdmin.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: ShoppingCart },
  { path: '/admin/products', component: ProductAdmin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
