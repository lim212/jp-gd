import { defineNuxtPlugin } from '#app'
import { AppImage } from '#components'

export default defineNuxtPlugin((nuxtApp) => {
  // Provide a safe alias for legacy <LazyImage> usage without triggering Nuxt's reserved "Lazy" prefix warning.
  // The original LazyImage.vue file is ignored via components.dirs.ignore in nuxt.config.ts
  // so the warning is not emitted, while this alias ensures templates keep working.
  nuxtApp.vueApp.component('LazyImage', AppImage as any)
})
