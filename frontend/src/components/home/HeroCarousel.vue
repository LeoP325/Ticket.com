<script setup lang="ts">
  import type { Options } from '@splidejs/vue-splide'
  import { Splide, SplideSlide } from '@splidejs/vue-splide'
  import '@splidejs/vue-splide/css'

  interface CarouselItem {
    src: string
    alt: string
    title: string
    subtitle: string
    to: string
  }

  defineProps<{
    items: readonly CarouselItem[]
  }>()

  const options: Options = {
    type: 'loop',
    height: '500px',
    fixedWidth: '800px',
    gap: 0,
    cover: true,
    autoplay: true,
    arrows: true,
    interval: 7000,
    focus: 'center',
    keyboard: 'focused',
    speed: 400,
    easing: 'cubic-bezier(.42, .65, .27, .99)',
    breakpoints: {
      800: { height: '375px', fixedWidth: '600px' },
      600: { height: '214px', fixedWidth: '343px', arrows: false },
    },
    i18n: {
      prev: '上一張活動',
      next: '下一張活動',
      first: '前往第一張活動',
      last: '前往最後一張活動',
      slideX: '前往第 %s 張活動',
      pageX: '前往第 %s 頁',
      play: '開始自動播放',
      pause: '暫停自動播放',
      select: '選擇要顯示的活動',
      slideLabel: '第 %s 張，共 %s 張',
    },
  }
</script>

<template>
  <section class="hero-carousel">
    <Splide v-if="items.length > 0" aria-label="精選活動" :options="options" tag="section">
      <SplideSlide v-for="item in items" :key="item.to">
        <div class="image-block">
          <router-link :aria-label="`查看活動：${item.title}`" class="hero-link" :to="item.to">
            <img :alt="item.alt" class="hero-image" draggable="false" :src="item.src">
          </router-link>
        </div>
      </SplideSlide>
    </Splide>
  </section>
</template>

<style scoped>
  .hero-carousel {
    background: #eef1f3;
    overflow: hidden;
    padding-block: 20px;
  }

  .image-block,
  .hero-link,
  .hero-image {
    display: block;
    height: 100%;
    width: 100%;
  }

  .image-block {
    border-radius: 8px;
    overflow: hidden;
    transform-origin: center;
    transition: opacity 200ms ease, transform 200ms ease;
  }

  .hero-image {
    object-fit: cover;
  }

  .hero-link:focus-visible {
    outline: 4px solid #ffd23f;
    outline-offset: -4px;
  }

  :deep(.splide__slide) {
    border-radius: 8px;
  }

  :deep(.splide__slide:not(.is-active) > .image-block) {
    opacity: 0.65;
    transform: scale(0.92);
  }

  :deep(.splide__slide:not(.is-active) .hero-link) {
    pointer-events: none;
  }

  :deep(.splide__pagination) {
    padding: 0;
  }

  @media (min-width: 960px) {
    :deep(.splide__arrow) {
      height: 4rem;
      width: 4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .image-block {
      transition: none;
    }
  }
</style>
