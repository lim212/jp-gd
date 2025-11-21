import { defineNuxtPlugin } from '#app'
import LazySection from '../components/LazySection.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register LazySection globally since we excluded Lazy*.vue from auto-registration to avoid Nuxt warnings.
  // This keeps existing templates (<LazySection ...>) working without auto-import.
  nuxtApp.vueApp.component('LazySection', LazySection)
})
