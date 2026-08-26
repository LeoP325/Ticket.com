<script setup lang="ts">
  defineProps<{
    images: readonly { src: string, alt: string }[]
  }>()
</script>

<template>
  <v-carousel
    class="hero-carousel"
    cycle
    height="clamp(280px, 48vw, 560px)"
    hide-delimiter-background
    interval="5000"
    show-arrows="hover"
  >
    <v-carousel-item v-for="image in images" :key="image.src">
      <v-img :alt="image.alt" cover height="100%" :src="image.src" />
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
  .hero-carousel {
    background: #111827;
  }
</style>
