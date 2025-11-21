/**
 * No Cache Headers Plugin
 * Memastikan browser selalu fetch versi terbaru dari server
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Add meta tags untuk prevent caching
  useHead({
    meta: [
      { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate, max-age=0' },
      { 'http-equiv': 'Pragma', content: 'no-cache' },
      { 'http-equiv': 'Expires', content: '0' },
    ],
  })

  // Add cache buster ke setiap route
  nuxtApp.hook('page:start', () => {
    if (typeof window !== 'undefined') {
      // Add timestamp ke current URL jika belum ada
      const url = new URL(window.location.href)
      if (!url.searchParams.has('_t')) {
        url.searchParams.set('_t', Date.now().toString())
        window.history.replaceState({}, '', url.toString())
      }
    }
  })
})

