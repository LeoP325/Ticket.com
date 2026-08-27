<script setup lang="ts">
  import EventInfo from '@/components/home/EventInfo.vue'
  import HeroCarousel from '@/components/home/HeroCarousel.vue'
  import { events } from '@/data/event'

  const carouselItems = events.map(item => ({ src: item.image, alt: `${item.title} 活動主視覺`, title: item.title, subtitle: item.subtitle, to: `/events/${item.slug}` }))
</script>

<template>
  <main class="home-page">
    <HeroCarousel :items="carouselItems" />
    <v-container class="content-width"><EventInfo :events="events" /></v-container>
  </main>
</template>

<style scoped>
  .home-page { background: linear-gradient(180deg, #f4faff 0%, #fff 60%); min-height: 100%; }
  .content-width { max-width: 1180px; }
</style>

<route lang="yaml">
meta:
  title: TIXLIGHT 活動購票
  admin: false
</route>
