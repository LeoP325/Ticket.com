<script setup lang="ts">
  import { computed } from 'vue'
  import banner1 from '@/assets/banner-1.svg'
  import banner2 from '@/assets/banner-2.svg'
  import banner3 from '@/assets/banner-3.svg'
  import EventInfo from '@/components/home/EventInfo.vue'
  import HeroCarousel from '@/components/home/HeroCarousel.vue'
  import { event } from '@/data/event'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const bookingPath = computed(() => user.isLoggedIn ? '/ticket' : '/login?redirect=/ticket')
  const images = [
    { src: banner1, alt: '城市星光音樂祭主舞台' },
    { src: banner2, alt: '藍紫色演唱會燈光' },
    { src: banner3, alt: '夕陽城市音樂現場' },
  ]
</script>

<template>
  <main class="home-page">
    <HeroCarousel :images="images" />

    <v-container class="content-width">
      <EventInfo :booking-path="bookingPath" :event="event" />
    </v-container>
  </main>
</template>

<style scoped>
  .home-page {
    background: linear-gradient(180deg, #f4faff 0%, #fffaf0 100%);
    min-height: 100%;
  }
  .content-width { max-width: 1180px; }
</style>

<route lang="yaml">
meta:
  title: 城市星光音樂祭 2026
  admin: false
</route>
