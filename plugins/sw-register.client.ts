import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  if (!('serviceWorker' in navigator)) return

  const isLocalhost = () => ['localhost', '127.0.0.1'].includes(location.hostname)
  const isHttps = location.protocol === 'https:'
  if (!isHttps && !isLocalhost()) return

  // Avoid double registration if PWA module already controls the page
  const hasController = !!(navigator.serviceWorker && navigator.serviceWorker.controller)
  if (hasController) {
    try {
      const url = navigator.serviceWorker.controller?.scriptURL || ''
      if (url && /(?:^|\/)sw\.|workbox|vite-pwa/i.test(url)) {
        // PWA/Workbox is in control, skip our own SW
        return
      }
    } catch {}
  }

  // Delay to avoid competing with critical render
  window.addEventListener('load', async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations()
      if (regs && regs.some(r => /(?:^|\/)sw\.|workbox|vite-pwa/i.test(r.active?.scriptURL || r.installing?.scriptURL || ''))) {
        return
      }

      const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      // Listen for updates
      reg.addEventListener?.('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content is available; will be used on next reload.')
          }
        })
      })
    } catch (err) {
      console.warn('SW register failed', err)
    }
  })
})
