import { defineStore } from 'pinia';
import type { Product } from '../types';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Product[],
  }),
  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price, 0);
    },
  },
  actions: {
    addToCart(product: Product) {
      this.items.push(product);
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter((item) => item.id !== productId);
    },
  },
});
