export default defineNuxtPlugin(() => {
  // Make useImagePopup available globally
  return {
    provide: {
      useImagePopup: () => import('~/composables/useImagePopup').then(m => m.useImagePopup())
    }
  }
})

