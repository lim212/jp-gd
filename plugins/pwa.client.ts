import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return
  
  // Skip PWA registration in development mode
  if (process.env.NODE_ENV === 'development') return

  // Use dynamic import so this file is safe even if Vite PWA is not active in some envs
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      try {
        registerSW({
          immediate: true,
          onNeedRefresh() {
            // Auto-refresh to get the latest content
            try { window.location.reload() } catch {}
          },
          onOfflineReady() {
            // Optional: could show a toast here
            // console.log('App ready to work offline')
          }
        })
      } catch {}
    })
    .catch(() => {
      // no-op if the virtual module isn't available
    })
})
