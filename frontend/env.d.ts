/// <reference types="vite/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

// reference 的意思:
// https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-

interface ImportMetaEnv {
  VITE_API_URL: string
}

declare module '@splidejs/vue-splide' {
  import type { DefineComponent } from 'vue'

  export type { Options } from '@splidejs/splide'
  export const Splide: DefineComponent
  export const SplideSlide: DefineComponent
}
