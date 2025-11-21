// plugins/ui-titlebase-global.ts
// Purpose: Ensure <UiTitleBase> is globally available across all pages/components.
// This guards against cases where Nuxt components auto-import misses it in certain routes.

import { defineNuxtPlugin } from '#app'
import UiTitleBase from '../components/UiTitleBase.vue'

export default defineNuxtPlugin((nuxtApp) => {
  const app: any = nuxtApp.vueApp as any
  try {
    const existing = app.component && app.component('UiTitleBase')
    if (!existing) {
      app.component('UiTitleBase', UiTitleBase as any)
    }
  } catch {}
})
