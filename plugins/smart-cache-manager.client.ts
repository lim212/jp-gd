// plugins/smart-cache-manager.client.ts
// Smart cache management system untuk memastikan website selalu fresh dan terbaru

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpSmartCacheInitialized) return
  ;(window as any).__jpSmartCacheInitialized = true
  
  // Add cleanup flag
  let isDestroyed = false

  class SmartCacheManager {
    private cacheVersion = 'v1.0.0'
    private cachePrefix = 'jp-cache-'
    private maxCacheAge = 24 * 60 * 60 * 1000 // 24 hours
    private checkInterval = 10 * 60 * 1000 // 10 minutes - further reduced frequency to prevent warnings
    private intervalId: number | undefined
    private forceReloadAttempts = 0
    private maxForceReloadAttempts = 3 // Limit 3x seperti yang diminta
    private lastForceReloadTime = 0
    private forceReloadCooldown = 30 * 1000 // 30 detik cooldown antar force reload

    constructor() {
      this.initializeCache()
      this.startPeriodicCheck()
      this.setupEventListeners()
    }

    private initializeCache() {
      try {
        // Clear old cache entries
        this.cleanOldCache()
        
        // Set current cache version
        localStorage.setItem(`${this.cachePrefix}version`, this.cacheVersion)
        localStorage.setItem(`${this.cachePrefix}lastUpdate`, Date.now().toString())
        
        console.log('🚀 Smart Cache Manager initialized')
      } catch (error) {
        console.warn('Cache initialization failed:', error)
      }
    }

    private cleanOldCache() {
      try {
        const keys = Object.keys(localStorage)
        const now = Date.now()
        
        keys.forEach(key => {
          if (key.startsWith(this.cachePrefix)) {
            try {
              const item = localStorage.getItem(key)
              if (item) {
                const data = JSON.parse(item)
                if (data.timestamp && (now - data.timestamp) > this.maxCacheAge) {
                  localStorage.removeItem(key)
                }
              }
            } catch {
              // Remove corrupted cache entries
              localStorage.removeItem(key)
            }
          }
        })
      } catch (error) {
        console.warn('Cache cleanup failed:', error)
      }
    }

    private startPeriodicCheck() {
      // Check for updates every 5 minutes
      this.intervalId = window.setInterval(() => {
        this.checkForUpdates()
      }, this.checkInterval)
    }

    private async checkForUpdates() {
      try {
        // Use centralized API call manager for better error handling
        const response = await (window as any).jpApiCallManager?.makeCall(`/api/version?t=${Date.now()}`)
        
        if (!response) {
          return // API call was rate limited or failed
        }

        if (response.ok) {
          const data = await response.json()
          const currentVersion = localStorage.getItem(`${this.cachePrefix}version`)
          
          if (data.buildId && data.buildId !== currentVersion) {
            console.log('🔄 Update detected:', { current: currentVersion, new: data.buildId })
            this.handleUpdateAvailable(data.buildId)
          }
        }
      } catch (error) {
        // Error handling is now managed by the API call manager
        console.debug('Update check completed with error handling')
      }
    }

    private handleUpdateAvailable(newVersion: string) {
      try {
        // Store the new version
        localStorage.setItem(`${this.cachePrefix}version`, newVersion)
        localStorage.setItem(`${this.cachePrefix}lastUpdate`, Date.now().toString())
        
        // Clear all cache to ensure fresh content
        this.clearAllCache()
        
        // Notify other systems about the update
        window.dispatchEvent(new CustomEvent('jp-cache-update-available', {
          detail: { newVersion }
        }))
        
        console.log('🔄 Cache update available:', newVersion)
        
        // Trigger reload using super smart reload system
        if ((window as any).jpSuperSmartReload) {
          setTimeout(() => {
            ;(window as any).jpSuperSmartReload.attemptReload({
              clearCache: true,
              showNotification: true,
              delay: 1000
            })
          }, 2000)
        }
      } catch (error) {
        console.warn('Failed to handle cache update:', error)
      }
    }

    private clearAllCache() {
      try {
        // SUPER AGRESIF cache clearing - hapus SEMUA cache yang mungkin
        console.log('🧹 Starting SUPER AGRESIF cache clearing...')
        
        // Clear localStorage cache - lebih agresif
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith(this.cachePrefix) || 
              key.includes('cache') || 
              key.includes('version') || 
              key.includes('build') ||
              key.includes('nuxt') ||
              key.includes('jp-')) {
            localStorage.removeItem(key)
          }
        })

        // Clear sessionStorage cache - lebih agresif
        const sessionKeys = Object.keys(sessionStorage)
        sessionKeys.forEach(key => {
          if (key.startsWith(this.cachePrefix) || 
              key.includes('cache') || 
              key.includes('version') || 
              key.includes('build') ||
              key.includes('nuxt') ||
              key.includes('jp-')) {
            sessionStorage.removeItem(key)
          }
        })

        // Clear browser cache if possible - SUPER AGRESIF
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              // Hapus SEMUA cache, tidak hanya yang spesifik
              caches.delete(cacheName)
            })
          }).catch(() => {
            // Ignore cache clearing errors
          })
        }

        // Clear service worker cache - SUPER AGRESIF
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister()
            })
          }).catch(() => {
            // Ignore service worker errors
          })
        }

        // Clear IndexedDB jika ada
        if ('indexedDB' in window) {
          try {
            // Hapus database yang terkait dengan cache
            indexedDB.deleteDatabase('nuxt-cache')
            indexedDB.deleteDatabase('jp-cache')
          } catch (error) {
            // Ignore IndexedDB errors
          }
        }

        console.log('🧹 SUPER AGRESIF cache clearing completed!')
      } catch (error) {
        console.warn('Cache clearing failed:', error)
      }
    }

    private setupEventListeners() {
      // Listen for page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          // Check for updates when page becomes visible
          setTimeout(() => this.checkForUpdates(), 1000)
        }
      })

      // Listen for window focus
      window.addEventListener('focus', () => {
        setTimeout(() => this.checkForUpdates(), 1000)
      })

      // Listen for online/offline events
      window.addEventListener('online', () => {
        setTimeout(() => this.checkForUpdates(), 2000)
      })

      // Listen for custom cache update events
      window.addEventListener('jp-cache-update-available', (event: any) => {
        console.log('📢 Cache update notification received:', event.detail)
      })
    }

    // Public methods - SUPER PINTAR dengan limit 3x
    public forceUpdate() {
      const now = Date.now()
      
      // Cek apakah masih dalam cooldown period
      if (now - this.lastForceReloadTime < this.forceReloadCooldown) {
        console.warn('⚠️ Force reload masih dalam cooldown period')
        return false
      }
      
      // Cek apakah sudah mencapai limit 3x
      if (this.forceReloadAttempts >= this.maxForceReloadAttempts) {
        console.warn('🚫 Force reload sudah mencapai limit 3x. Berhenti untuk mencegah infinite loop.')
        if ((window as any).jpNotify) {
          ;(window as any).jpNotify.warning(
            '🚫 Limit Reload Tercapai',
            'Sudah mencapai limit 3x reload. Sistem berhenti untuk mencegah infinite loop. Website tetap dapat diakses normal.',
            8000
          )
        }
        return false
      }
      
      // Increment counter dan update waktu terakhir
      this.forceReloadAttempts++
      this.lastForceReloadTime = now
      
      console.log(`🔄 Force reload attempt ${this.forceReloadAttempts}/${this.maxForceReloadAttempts}`)
      
      // Clear cache dengan SUPER AGRESIF
      this.clearAllCache()
      
      // Reset counter setelah 1 jam (seperti sistem smart reload)
      setTimeout(() => {
        this.forceReloadAttempts = 0
        console.log('🔄 Force reload counter reset setelah 1 jam')
      }, 60 * 60 * 1000)
      
      // Reload dengan cache busting
      const url = new URL(window.location.href)
      url.searchParams.set('_force_reload', Date.now().toString())
      url.searchParams.set('_cache_bust', Math.random().toString(36).substr(2, 9))
      
      window.location.replace(url.toString())
      return true
    }

    public getCacheInfo() {
      return {
        version: localStorage.getItem(`${this.cachePrefix}version`),
        lastUpdate: localStorage.getItem(`${this.cachePrefix}lastUpdate`),
        cacheSize: this.getCacheSize()
      }
    }

    private getCacheSize() {
      let size = 0
      try {
        for (const key in localStorage) {
          if (localStorage.hasOwnProperty(key) && key.startsWith(this.cachePrefix)) {
            size += localStorage[key].length
          }
        }
      } catch {
        // Ignore errors
      }
      return size
    }

    public destroy() {
      if (isDestroyed) return
      isDestroyed = true
      
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = undefined
      }
    }
  }

  // Initialize the smart cache manager
  const cacheManager = new SmartCacheManager()

  // Make it globally available
  ;(window as any).jpSmartCache = {
    forceUpdate: () => cacheManager.forceUpdate(),
    getInfo: () => cacheManager.getCacheInfo(),
    destroy: () => cacheManager.destroy()
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cacheManager.destroy()
  })
})
