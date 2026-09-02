<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'

  interface CarouselItem {
    src: string
    alt: string
    title: string
    subtitle: string
    to: string
  }

  const props = defineProps<{
    items: readonly CarouselItem[]
  }>()

  const activeIndex = shallowRef(0)
  const pointerStartX = shallowRef(0)
  const pointerIsDown = shallowRef(false)
  const suppressClick = shallowRef(false)
  const reducedMotion = shallowRef(false)
  let timer: ReturnType<typeof setInterval> | undefined

  const activePosition = computed(() => `${activeIndex.value + 1} / ${props.items.length}`)

  function relativePosition (index: number) {
    const length = props.items.length
    let position = index - activeIndex.value

    if (position > length / 2) position -= length
    if (position < -length / 2) position += length
    return position
  }

  function slideStyle (index: number) {
    const position = relativePosition(index)
    const zIndex = position === 0 ? 2 : Number(Math.abs(position) === 1)
    return {
      transform: `translateX(calc(-50% + ${position * 100}%)) scale(${position === 0 ? 1 : 0.92})`,
      zIndex,
    }
  }

  function stopTimer () {
    if (timer) window.clearInterval(timer)
    timer = undefined
  }

  function startTimer () {
    stopTimer()
    if (props.items.length > 1 && !reducedMotion.value) {
      timer = window.setInterval(() => selectSlide(activeIndex.value + 1, false), 7000)
    }
  }

  function selectSlide (index: number, restart = true) {
    const length = props.items.length
    if (!length) return
    activeIndex.value = (index + length) % length
    if (restart) startTimer()
  }

  function handleFocusOut (event: FocusEvent) {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) startTimer()
  }

  function handlePointerDown (event: PointerEvent) {
    pointerStartX.value = event.clientX
    pointerIsDown.value = true
    suppressClick.value = false
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }

  function handlePointerMove (event: PointerEvent) {
    if (pointerIsDown.value && Math.abs(event.clientX - pointerStartX.value) > 10) suppressClick.value = true
  }

  function handlePointerUp (event: PointerEvent) {
    if (!pointerIsDown.value) return
    const distance = event.clientX - pointerStartX.value
    pointerIsDown.value = false

    if (Math.abs(distance) >= 45) selectSlide(activeIndex.value + (distance < 0 ? 1 : -1))
    window.setTimeout(() => {
      suppressClick.value = false
    })
  }

  function handleLinkClick (event: MouseEvent) {
    if (suppressClick.value) event.preventDefault()
  }

  function handleVisibilityChange () {
    document.hidden ? stopTimer() : startTimer()
  }

  onMounted(() => {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    startTimer()
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onBeforeUnmount(() => {
    stopTimer()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
</script>

<template>
  <section
    aria-label="精選活動"
    aria-roledescription="carousel"
    class="hero-carousel"
    tabindex="0"
    @focusin="stopTimer"
    @focusout="handleFocusOut"
    @keydown.left.prevent="selectSlide(activeIndex - 1)"
    @keydown.right.prevent="selectSlide(activeIndex + 1)"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <div
      class="hero-track"
      @pointercancel="pointerIsDown = false"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
      <article
        v-for="(item, index) in items"
        :key="item.to"
        :aria-hidden="index !== activeIndex"
        :aria-label="`${index + 1} / ${items.length}：${item.title}`"
        aria-roledescription="slide"
        class="hero-slide"
        :class="{ 'is-active': index === activeIndex, 'is-nearby': Math.abs(relativePosition(index)) <= 1 }"
        :style="slideStyle(index)"
      >
        <router-link
          :aria-label="`查看活動：${item.title}`"
          class="hero-link"
          :tabindex="index === activeIndex ? 0 : -1"
          :to="item.to"
          @click="handleLinkClick"
        >
          <img :alt="item.alt" class="hero-image" :src="item.src">
        </router-link>
      </article>
    </div>

    <template v-if="items.length > 1">
      <button
        aria-label="上一張活動"
        class="hero-arrow hero-arrow--prev"
        type="button"
        @click="selectSlide(activeIndex - 1)"
      >
        <v-icon icon="mdi-chevron-left" />
      </button>

      <button
        aria-label="下一張活動"
        class="hero-arrow hero-arrow--next"
        type="button"
        @click="selectSlide(activeIndex + 1)"
      >
        <v-icon icon="mdi-chevron-right" />
      </button>

      <div aria-label="選擇輪播圖片" class="hero-pagination">
        <button
          v-for="(item, index) in items"
          :key="`dot-${item.to}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          :aria-label="`前往第 ${index + 1} 張：${item.title}`"
          class="hero-dot"
          :class="{ 'is-active': index === activeIndex }"
          type="button"
          @click="selectSlide(index)"
        />
      </div>
    </template>

    <span aria-live="polite" class="sr-only">{{ activePosition }}</span>
  </section>
</template>

<style scoped>
  .hero-carousel {
    --slide-height: 500px;
    --slide-width: 800px;
    background: #eef1f3;
    outline: none;
    overflow: hidden;
    padding-block: 20px;
    position: relative;
    touch-action: pan-y;
  }

  .hero-carousel:focus-visible {
    box-shadow: inset 0 0 0 3px #1465a8;
  }

  .hero-track {
    height: var(--slide-height);
    position: relative;
  }

  .hero-slide {
    border-radius: 8px;
    height: var(--slide-height);
    left: 50%;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    top: 0;
    transform-origin: center;
    transition: opacity 200ms ease, transform 200ms ease;
    visibility: hidden;
    width: var(--slide-width);
  }

  .hero-slide.is-nearby {
    opacity: 0.65;
    visibility: visible;
  }

  .hero-slide.is-active {
    opacity: 1;
    pointer-events: auto;
  }

  .hero-link,
  .hero-image {
    display: block;
    height: 100%;
    width: 100%;
  }

  .hero-link:focus-visible {
    outline: 4px solid #ffd23f;
    outline-offset: -4px;
  }

  .hero-image {
    object-fit: cover;
  }

  .hero-arrow {
    align-items: center;
    background: rgb(204 204 204 / 78%);
    border: 0;
    border-radius: 50%;
    color: #263238;
    cursor: pointer;
    display: flex;
    height: 64px;
    justify-content: center;
    padding: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: background-color 150ms ease, opacity 150ms ease;
    width: 64px;
    z-index: 3;
  }

  .hero-arrow:hover {
    background: rgb(255 255 255 / 92%);
  }

  .hero-arrow:focus-visible,
  .hero-dot:focus-visible {
    outline: 3px solid #1465a8;
    outline-offset: 3px;
  }

  .hero-arrow--prev {
    left: 16px;
  }

  .hero-arrow--next {
    right: 16px;
  }

  .hero-pagination {
    align-items: center;
    bottom: 28px;
    display: flex;
    gap: 6px;
    justify-content: center;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    z-index: 3;
  }

  .hero-dot {
    background: #ccc;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    height: 8px;
    opacity: 0.75;
    padding: 0;
    transition: background-color 200ms linear, transform 200ms linear;
    width: 8px;
  }

  .hero-dot.is-active {
    background: #fff;
    transform: scale(1.4);
  }

  .sr-only {
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  @media (min-width: 601px) and (max-width: 800px) {
    .hero-carousel {
      --slide-height: 375px;
      --slide-width: 600px;
    }
  }

  @media (max-width: 600px) {
    .hero-carousel {
      --slide-height: min(214px, calc((100vw - 32px) * 0.625));
      --slide-width: min(343px, calc(100vw - 32px));
      padding-block: 16px;
    }

    .hero-arrow {
      display: none;
    }

    .hero-pagination {
      bottom: 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-slide,
    .hero-dot {
      transition: none;
    }
  }
</style>
