import type { App } from 'vue'
import { PiniaColada } from '@pinia/colada'
/**
 * plugins/index.ts
*
* Automatically included in `./src/main.ts`
*/
import { createPinia } from 'pinia'
import router from '../router'
import vuetify from './vuetify'

export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(createPinia())
  app.use(PiniaColada)
  app.use(router)
}
