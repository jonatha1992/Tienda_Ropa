<template>
    <div class="min-h-screen bg-gray-50">
        <Navbar />
        <HeroBanner />
        <ProductGrid />
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
import HeroBanner from './HeroBanner.vue';
import ProductGrid from './ProductGrid.vue';
import Footer from './Footer.vue';
</script>
