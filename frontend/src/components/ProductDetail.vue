<template>
  <div class="bg-secondary text-primary">
    <div v-if="product" class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        <!-- Image gallery -->
        <div class="flex flex-col-reverse">
          <!-- Image selector -->
          <div class="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
            <div class="grid grid-cols-4 gap-6" aria-orientation="horizontal">
              <button v-for="(image, index) in product.images" :key="index" @click="selectedImage = index" class="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50">
                <span class="sr-only">{{ product.name }}</span>
                <span class="absolute inset-0 rounded-md overflow-hidden">
                  <img :src="image.image_url" alt="" class="w-full h-full object-center object-cover">
                </span>
                <span :class="{ 'ring-indigo-500': selectedImage === index, 'ring-transparent': selectedImage !== index }" class="absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none" aria-hidden="true"></span>
              </button>
            </div>
          </div>

          <div class="w-full aspect-w-1 aspect-h-1">
            <img :src="product.images[selectedImage]?.image_url" :alt="product.name" class="w-full h-full object-center object-cover sm:rounded-lg">
          </div>
        </div>

        <!-- Product info -->
        <div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 class="text-3xl font-extrabold tracking-tight text-primary">{{ product.name }}</h1>

          <div class="mt-3">
            <h2 class="sr-only">Product information</h2>
            <p class="text-3xl text-primary">${{ product.price }}</p>
          </div>

          <div class="mt-6">
            <h3 class="sr-only">Description</h3>
            <div class="text-base text-primary space-y-6" v-html="product.description"></div>
          </div>

          <form class="mt-6">
            <!-- Colors -->
            <div>
              <h3 class="text-sm text-primary font-medium">Color</h3>
              <!-- Implement color selection logic here -->
            </div>

            <!-- Sizes -->
            <div class="mt-10">
              <div class="flex items-center justify-between">
                <h3 class="text-sm text-primary font-medium">Size</h3>
                <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</a>
              </div>
              <!-- Implement size selection logic here -->
            </div>

            <div class="mt-10 flex sm:flex-col1">
              <button @click="addToCart" type="button" class="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full">Add to bag</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Product } from '../types';
import { useCartStore } from '../store/cart';

const route = useRoute();
const product = ref<Product | null>(null);
const selectedImage = ref(0);
const cartStore = useCartStore();

onMounted(async () => {
  const productId = route.params.id;
  try {
    const response = await fetch(`http://localhost:8000/api/v1/products/${productId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    product.value = await response.json();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
});

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value);
  }
};
</script>
