<script setup lang="ts">
  defineProps<{
    items: readonly { src: string, alt: string, title: string, subtitle: string, to: string }[]
  }>()
</script>

<template>
  <v-carousel
    class="hero-carousel"
    cycle
    height="clamp(320px, 48vw, 600px)"
    hide-delimiter-background
    interval="5000"
    show-arrows="hover"
  >
    <v-carousel-item v-for="item in items" :key="item.to">
      <router-link class="hero-link" :to="item.to">
        <v-img
          :alt="item.alt"
          class="hero-image"
          cover
          height="100%"
          :src="item.src"
        />

        <div class="hero-overlay">
          <p class="hero-kicker">FEATURED EVENT</p>
          <h2 class="hero-title">{{ item.title }}</h2>
          <p class="hero-subtitle">{{ item.subtitle }}</p>
          <span class="hero-action">查看活動 <v-icon icon="mdi-arrow-right" size="small" /></span>
        </div>
      </router-link>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
  .hero-carousel { background: #111827; }
  .hero-link { color: white; display: block; height: 100%; position: relative; text-decoration: none; }
  .hero-image::after { background: linear-gradient(90deg, rgb(0 0 0 / 72%), rgb(0 0 0 / 8%) 72%); content: ''; inset: 0; position: absolute; }
  .hero-overlay { bottom: clamp(42px, 8vw, 96px); left: max(24px, calc((100% - 1120px) / 2)); max-width: 620px; position: absolute; right: 24px; z-index: 1; }
  .hero-kicker { font-size: .78rem; font-weight: 800; letter-spacing: .18em; }
  .hero-title { font-size: clamp(2rem, 5vw, 4rem); line-height: 1.15; margin-top: 8px; }
  .hero-subtitle { font-size: clamp(1rem, 2vw, 1.25rem); margin-top: 12px; }
  .hero-action { align-items: center; display: inline-flex; font-weight: 700; gap: 6px; margin-top: 24px; }
</style>
