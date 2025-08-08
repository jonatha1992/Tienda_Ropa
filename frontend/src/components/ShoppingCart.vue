<template>
  <div class="bg-secondary text-primary">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-primary">Shopping Cart</h1>
      <div v-if="cartStore.items.length > 0" class="mt-12">
        <ul>
          <li v-for="item in cartStore.items" :key="item.id" class="flex py-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img :src="item.images[0]?.image_url" :alt="item.name" class="h-full w-full object-cover object-center">
            </div>
            <div class="ml-4 flex flex-1 flex-col">
              <div>
                <div class="flex justify-between text-base font-medium text-primary">
                  <h3>
                    <a :href="'/product/' + item.id">{{ item.name }}</a>
                  </h3>
                  <p class="ml-4">${{ item.price }}</p>
                </div>
              </div>
              <div class="flex flex-1 items-end justify-between text-sm">
                <p class="text-gray-500">Qty 1</p>
                <div class="flex">
                  <button @click="cartStore.removeFromCart(item.id)" type="button" class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
          <div class="flex justify-between text-base font-medium text-primary">
            <p>Subtotal</p>
            <p>${{ cartStore.totalPrice }}</p>
          </div>
          <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          <div class="mt-6">
            <a href="#" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
          </div>
        </div>
      </div>
      <div v-else class="mt-12">
        <p>Your cart is empty.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../store/cart';

const cartStore = useCartStore();
</script>
