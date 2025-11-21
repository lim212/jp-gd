// plugins/sw-fallback.client.ts
// Register a minimal Service Worker when Vite PWA module is not enabled
export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  if (!('serviceWorker' in navigator)) return

  // If @vite-pwa/nuxt virtual module is available, do nothing (pwa.client.ts handles registration)
  import('virtual:pwa-register')
    .then(() => {
      // PWA module present; skip fallback
    })
    .catch(() => {
      // No PWA module: register our lightweight fallback SW
      const register = () => {
        try {
          navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .catch(() => {})
        } catch {}
      }
      // Defer a bit to avoid competing with initial load
      if ((window as any).requestIdleCallback) (window as any).requestIdleCallback(register, { timeout: 2000 })
      else setTimeout(register, 800)
    })
})
