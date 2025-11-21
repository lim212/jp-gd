// plugins/super-aggressive-cache-buster.client.ts
// SUPER AGRESIF cache busting system untuk memastikan browser tidak menggunakan cache lama

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__superAggressiveCacheBusterInitialized) return
  ;(window as any).__superAggressiveCacheBusterInitialized = true

  class SuperAggressiveCacheBuster {
    private cacheBustInterval: number | undefined
    private isActive = false
    private lastCacheBust = 0
    private cacheBustCooldown = 5 * 1000 // 5 detik cooldown

    constructor() {
      this.setupGlobalMethods()
      this.startPeriodicCacheBusting()
      this.setupEventListeners()
    }

    private setupGlobalMethods() {
      // Make cache buster globally available
      ;(window as any).jpSuperCacheBuster = {
        forceCacheBust: () => this.forceCacheBust(),
        startPeriodicBusting: () => this.startPeriodicCacheBusting(),
        stopPeriodicBusting: () => this.stopPeriodicCacheBusting(),
        isActive: () => this.isActive,
        getStatus: () => this.getStatus()
      }
    }

    private startPeriodicCacheBusting() {
      if (this.cacheBustInterval) return

      this.isActive = true
      console.log('🚀 Starting SUPER AGRESIF periodic cache busting...')

      // Cache bust setiap 30 detik untuk memastikan tidak ada cache lama
      this.cacheBustInterval = window.setInterval(() => {
        this.performCacheBust()
      }, 30 * 1000)

      // Initial cache bust
      setTimeout(() => this.performCacheBust(), 1000)
    }

    private stopPeriodicCacheBusting() {
      if (this.cacheBustInterval) {
        clearInterval(this.cacheBustInterval)
        this.cacheBustInterval = undefined
        this.isActive = false
        console.log('🛑 Stopped SUPER AGRESIF periodic cache busting')
      }
    }

    private performCacheBust() {
      const now = Date.now()
      
      // Cek cooldown
      if (now - this.lastCacheBust < this.cacheBustCooldown) {
        return
      }

      this.lastCacheBust = now

      try {
        // SUPER AGRESIF cache busting dengan multiple parameters
        const cacheBuster = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`
        
        // Update URL dengan cache busting parameters
        const url = new URL(window.location.href)
        url.searchParams.set('_cb', cacheBuster)
        url.searchParams.set('_t', Date.now().toString())
        url.searchParams.set('_r', Math.random().toString(36).substr(2, 9))
        
        // Replace URL tanpa reload untuk cache busting
        window.history.replaceState({}, '', url.toString())
        
        console.log('🔄 Cache busted:', cacheBuster)
      } catch (error) {
        console.warn('Cache busting failed:', error)
      }
    }

    public forceCacheBust() {
      console.log('💥 FORCE cache bust triggered!')
      
      // Clear semua cache yang mungkin
      this.clearAllPossibleCaches()
      
      // Perform aggressive cache bust
      this.performCacheBust()
      
      // Add multiple cache busting parameters
      const url = new URL(window.location.href)
      url.searchParams.set('_force_bust', Date.now().toString())
      url.searchParams.set('_super_bust', Math.random().toString(36).substr(2, 9))
      url.searchParams.set('_aggressive', 'true')
      
      window.history.replaceState({}, '', url.toString())
    }

    private clearAllPossibleCaches() {
      try {
        console.log('🧹 Clearing ALL possible caches...')

        // Clear localStorage cache
        const localStorageKeys = Object.keys(localStorage)
        localStorageKeys.forEach(key => {
          if (key.includes('cache') || 
              key.includes('version') || 
              key.includes('build') ||
              key.includes('nuxt') ||
              key.includes('jp-') ||
              key.includes('_nuxt') ||
              key.includes('sw-') ||
              key.includes('workbox')) {
            try {
              localStorage.removeItem(key)
              console.log(`🗑️ Removed localStorage: ${key}`)
            } catch {}
          }
        })

        // Clear sessionStorage cache
        const sessionStorageKeys = Object.keys(sessionStorage)
        sessionStorageKeys.forEach(key => {
          if (key.includes('cache') || 
              key.includes('version') || 
              key.includes('build') ||
              key.includes('nuxt') ||
              key.includes('jp-') ||
              key.includes('_nuxt') ||
              key.includes('sw-') ||
              key.includes('workbox')) {
            try {
              sessionStorage.removeItem(key)
              console.log(`🗑️ Removed sessionStorage: ${key}`)
            } catch {}
          }
        })

        // Clear browser cache
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName).then(() => {
                console.log(`🗑️ Deleted cache: ${cacheName}`)
              })
            })
          }).catch(() => {})
        }

        // Clear service workers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister().then(() => {
                console.log(`🗑️ Unregistered service worker: ${registration.scope}`)
              })
            })
          }).catch(() => {})
        }

        // Clear IndexedDB
        if ('indexedDB' in window) {
          const dbNames = ['nuxt-cache', 'jp-cache', 'workbox-precache', 'workbox-runtime']
          dbNames.forEach(dbName => {
            try {
              indexedDB.deleteDatabase(dbName)
              console.log(`🗑️ Deleted IndexedDB: ${dbName}`)
            } catch {}
          })
        }

        console.log('🧹 ALL caches cleared!')
      } catch (error) {
        console.warn('Cache clearing failed:', error)
      }
    }

    private setupEventListeners() {
      // Cache bust saat page focus
      window.addEventListener('focus', () => {
        setTimeout(() => this.performCacheBust(), 500)
      })

      // Cache bust saat visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          setTimeout(() => this.performCacheBust(), 500)
        }
      })

      // Cache bust saat online
      window.addEventListener('online', () => {
        setTimeout(() => this.performCacheBust(), 1000)
      })

      // Cache bust saat storage change (dari tab lain)
      window.addEventListener('storage', (event) => {
        if (event.key && (event.key.includes('cache') || event.key.includes('version'))) {
          setTimeout(() => this.performCacheBust(), 500)
        }
      })
    }

    public getStatus() {
      return {
        isActive: this.isActive,
        lastCacheBust: this.lastCacheBust,
        nextCacheBust: this.lastCacheBust + this.cacheBustCooldown
      }
    }

    public destroy() {
      this.stopPeriodicCacheBusting()
    }
  }

  // Initialize the super aggressive cache buster
  const cacheBuster = new SuperAggressiveCacheBuster()

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cacheBuster.destroy()
  })

  // Auto-start cache busting
  console.log('🚀 SUPER AGRESIF Cache Buster initialized!')
})
