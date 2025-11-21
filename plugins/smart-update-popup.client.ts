// plugins/smart-update-popup.client.ts
// Smart update popup system dengan anti-stuck dan smart caching

export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  if (typeof window === 'undefined') return

  class SmartUpdatePopupSystem {
    private isCheckingLoading = false
    private loadingCheckInterval: NodeJS.Timeout | null = null
    private readonly MAX_LOADING_WAIT = 10000 // Max 10 detik menunggu loading
    private readonly LOADING_CHECK_INTERVAL = 500 // Check setiap 500ms

    constructor() {
      this.setupSmartPopupControl()
      this.setupServiceWorkerCache()
      this.setupAntiStuckSystem()
    }

    /**
     * Setup smart popup control - prevent infinite popups
     */
    private setupSmartPopupControl() {
      // Expose global function untuk manual trigger (testing)
      if (typeof window !== 'undefined') {
        (window as any).triggerUpdatePopup = () => {
          console.log('🧪 Manual trigger: Update popup')
          const event = new CustomEvent('show-update-popup')
          window.dispatchEvent(event)
        }

        // Expose function untuk check popup status
        (window as any).checkPopupStatus = () => {
          const count = localStorage.getItem('jp_update_popup_count')
          const blocked = localStorage.getItem('jp_update_popup_blocked')
          const timestamp = localStorage.getItem('jp_update_popup_timestamp')
          
          console.log('📊 Popup Status:', {
            count: count || '0',
            blocked: blocked ? new Date(parseInt(blocked, 10)).toLocaleString() : 'No',
            timestamp: timestamp ? new Date(parseInt(timestamp, 10)).toLocaleString() : 'No'
          })
        }

        // Expose function untuk reset popup (testing)
        (window as any).resetPopupTracking = () => {
          localStorage.removeItem('jp_update_popup_count')
          localStorage.removeItem('jp_update_popup_timestamp')
          localStorage.removeItem('jp_update_popup_blocked')
          console.log('✅ Popup tracking reset')
        }
      }
    }

    /**
     * Setup service worker untuk smart caching across browsers
     */
    private setupServiceWorkerCache() {
      if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Worker not supported')
        return
      }

      // Register service worker untuk smart caching
      window.addEventListener('load', async () => {
        try {
          // Check if service worker already registered
          const registrations = await navigator.serviceWorker.getRegistrations()
          if (registrations.length > 0) {
            console.log('✅ Service Worker already registered')
            return
          }

          // Register service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('✅ Service Worker registered for smart caching:', registration.scope)

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New Service Worker available - update detected')
                  
                  // Trigger update popup event
                  const event = new CustomEvent('service-worker-update')
                  window.dispatchEvent(event)
                }
              })
            }
          })

          // Check for updates periodically
          setInterval(() => {
            registration.update().catch(err => {
              console.warn('Failed to check for service worker updates:', err)
            })
          }, 60000) // Check every minute

        } catch (error) {
          console.warn('⚠️ Service Worker registration failed:', error)
        }
      })
    }

    /**
     * Setup anti-stuck system - prevent popup stuck dengan loading screen
     */
    private setupAntiStuckSystem() {
      // Monitor loading screens
      this.monitorLoadingScreens()

      // Listen for update popup events
      window.addEventListener('show-update-popup', () => {
        this.ensurePopupNotStuck()
      })

      window.addEventListener('service-worker-update', () => {
        this.ensurePopupNotStuck()
      })
    }

    /**
     * Monitor loading screens dan pastikan tidak stuck
     */
    private monitorLoadingScreens() {
      if (this.isCheckingLoading) return
      this.isCheckingLoading = true

      const checkLoading = () => {
        const loadingSelectors = [
          '.loading-screen',
          '.super-loading-screen',
          '.background-loading-indicator',
          '.skeleton-screen'
        ]

        let hasLoading = false
        for (const selector of loadingSelectors) {
          const element = document.querySelector(selector)
          if (element && element.clientHeight > 0) {
            hasLoading = true
            break
          }
        }

        // Jika ada loading screen lebih dari MAX_LOADING_WAIT, force hide
        if (hasLoading) {
          const startTime = Date.now()
          
          this.loadingCheckInterval = setInterval(() => {
            const elapsed = Date.now() - startTime
            
            if (elapsed > this.MAX_LOADING_WAIT) {
              console.warn('⚠️ Loading screen stuck detected - forcing hide')
              
              // Force hide semua loading screens
              loadingSelectors.forEach(selector => {
                const el = document.querySelector(selector) as HTMLElement
                if (el) {
                  el.style.display = 'none'
                  el.style.opacity = '0'
                  el.style.visibility = 'hidden'
                }
              })

              // Restore scroll
              document.body.style.overflow = 'auto'
              document.documentElement.style.overflow = 'auto'

              // Clear interval
              if (this.loadingCheckInterval) {
                clearInterval(this.loadingCheckInterval)
                this.loadingCheckInterval = null
              }
            }
          }, this.LOADING_CHECK_INTERVAL)
        } else {
          // No loading screen, clear interval
          if (this.loadingCheckInterval) {
            clearInterval(this.loadingCheckInterval)
            this.loadingCheckInterval = null
          }
        }
      }

      // Check immediately
      checkLoading()

      // Check periodically
      setInterval(checkLoading, 2000)
    }

    /**
     * Ensure popup tidak stuck dengan loading screen
     */
    private ensurePopupNotStuck() {
      // Wait for loading screens to complete
      const waitForLoading = (maxWait: number = 5000) => {
        return new Promise<void>((resolve) => {
          const startTime = Date.now()
          
          const check = () => {
            const loadingSelectors = [
              '.loading-screen',
              '.super-loading-screen',
              '.background-loading-indicator',
              '.skeleton-screen'
            ]

            let hasLoading = false
            for (const selector of loadingSelectors) {
              const element = document.querySelector(selector)
              if (element && element.clientHeight > 0) {
                hasLoading = true
                break
              }
            }

            const elapsed = Date.now() - startTime

            if (!hasLoading || elapsed > maxWait) {
              // Force hide jika masih stuck
              if (hasLoading && elapsed > maxWait) {
                console.warn('⚠️ Loading screen still active after max wait - forcing hide')
                loadingSelectors.forEach(selector => {
                  const el = document.querySelector(selector) as HTMLElement
                  if (el) {
                    el.style.display = 'none'
                    el.style.opacity = '0'
                    el.style.visibility = 'hidden'
                  }
                })
              }

              // Restore scroll
              document.body.style.overflow = 'auto'
              document.documentElement.style.overflow = 'auto'

              resolve()
            } else {
              // Check again
              setTimeout(check, 500)
            }
          }

          check()
        })
      }

      // Wait for loading, then trigger popup
      waitForLoading().then(() => {
        console.log('✅ Loading complete - safe to show popup')
        // Popup akan di-trigger oleh sistem version check
      })
    }

    /**
     * Smart cache clearing untuk semua browser
     */
    public clearAllCaches(): Promise<void> {
      return new Promise(async (resolve) => {
        console.log('🧹 Clearing all caches for smart reload...')

        // 1. Clear Cache Storage
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys()
            await Promise.all(cacheNames.map(name => caches.delete(name)))
            console.log('✅ Cache Storage cleared')
          } catch (e) {
            console.warn('⚠️ Cache Storage clear failed:', e)
          }
        }

        // 2. Unregister Service Workers
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations()
            await Promise.all(registrations.map(reg => reg.unregister()))
            console.log('✅ Service Workers unregistered')
          } catch (e) {
            console.warn('⚠️ Service Worker unregister failed:', e)
          }
        }

        // 3. Clear IndexedDB
        if ('indexedDB' in window) {
          try {
            const databases = ['nuxt-cache', 'jp-cache', 'workbox-precache']
            for (const dbName of databases) {
              try {
                await new Promise<void>((resolve, reject) => {
                  const deleteReq = indexedDB.deleteDatabase(dbName)
                  deleteReq.onsuccess = () => resolve()
                  deleteReq.onerror = () => reject(deleteReq.error)
                  deleteReq.onblocked = () => resolve() // Continue even if blocked
                })
              } catch {}
            }
            console.log('✅ IndexedDB cleared')
          } catch (e) {
            console.warn('⚠️ IndexedDB clear failed:', e)
          }
        }

        resolve()
      })
    }
  }

  // Initialize system
  const smartUpdateSystem = new SmartUpdatePopupSystem()
  
  // Expose to window for global access
  if (typeof window !== 'undefined') {
    (window as any).jpSmartUpdateSystem = smartUpdateSystem
  }

  console.log('🚀 Smart Update Popup System initialized:', {
    serviceWorkerSupported: 'serviceWorker' in navigator,
    cacheSupported: 'caches' in window,
    indexedDBSupported: 'indexedDB' in window
  })
})

