<template>
    <div class="min-h-screen bg-gray-50">
        <HeroBanner />
        <ProductGrid />
        <Footer />
    </div>
</template>

<script setup lang="ts">
import HeroBanner from '../components/HeroBanner.vue';
import ProductGrid from '../components/ProductGrid.vue';
import Footer from '../components/Footer.vue';
</script>