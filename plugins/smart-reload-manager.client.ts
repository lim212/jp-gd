// plugins/smart-reload-manager.client.ts
// Smart reload manager with IP-based rate limiting to prevent infinite reload loops

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__smartReloadManagerInitialized) return
  ;(window as any).__smartReloadManagerInitialized = true

  class SmartReloadManager {
    private isChecking = false
    private isReloading = false
    private lastCheckTime = 0
    private checkCooldown = 10000 // 10 seconds cooldown between checks (diperpanjang)
    private maxRetries = 3
    private retryDelay = 3000 // 3 seconds between retries (diperpanjang)

    constructor() {
      this.setupGlobalMethods()
      this.enhanceExistingReloadFunctions()
    }

    private setupGlobalMethods() {
      // Make smart reload manager globally available
      ;(window as any).jpSmartReload = {
        checkReloadAllowed: () => this.checkReloadAllowed(),
        attemptReload: (options?: any) => this.attemptReload(options),
        forceReload: (options?: any) => this.forceReload(options),
        resetAttempts: () => this.resetAttempts(),
        getStatus: () => this.getStatus()
      }
    }

    private enhanceExistingReloadFunctions() {
      // Enhance the existing jpForceReload function
      const originalForceReload = (window as any).jpForceReload
      if (originalForceReload) {
        ;(window as any).jpForceReload = async (options: any = {}) => {
          // Check if reload is allowed before proceeding
          const canReload = await this.checkReloadAllowed()
          if (!canReload) {
            this.showBlockedNotification()
            return false
          }

          // Record the reload attempt
          await this.recordReloadAttempt()

          // Proceed with original reload function
          return originalForceReload(options)
        }
      }

      // Enhance version check plugin reload function
      const originalLocationReload = window.location.reload
      window.location.reload = function() {
        // This is a fallback - the smart reload should be called before this
        console.warn('⚠️ Direct location.reload() called - consider using jpSmartReload.attemptReload() instead')
        return originalLocationReload.call(this)
      }
    }

    private async checkReloadAllowed(): Promise<boolean> {
      if (this.isChecking) return false
      
      const now = Date.now()
      if (now - this.lastCheckTime < this.checkCooldown) {
        return true // Allow if within cooldown period
      }

      this.isChecking = true
      this.lastCheckTime = now

      try {
        const response = await $fetch('/api/smart-reload-tracker', {
          method: 'POST',
          body: {
            action: 'check',
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: now
          }
        })

        if (response.success) {
          return response.canReload
        }
        
        return false
      } catch (error) {
        console.warn('Failed to check reload status:', error)
        return true // Allow reload if check fails (fail-safe)
      } finally {
        this.isChecking = false
      }
    }

    private async recordReloadAttempt(): Promise<boolean> {
      try {
        const response = await $fetch('/api/smart-reload-tracker', {
          method: 'POST',
          body: {
            action: 'attempt',
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        })

        if (response.success && response.blocked) {
          this.showBlockedNotification(response.blockReason, response.remainingTime)
          return false
        }

        return true
      } catch (error) {
        console.warn('Failed to record reload attempt:', error)
        return true // Allow reload if recording fails (fail-safe)
      }
    }

    private showBlockedNotification(reason?: string, remainingTime?: number) {
      if ((window as any).jpNotify) {
        const message = reason || 'Terlalu banyak percobaan reload'
        const details = remainingTime 
          ? `Popup reload akan muncul lagi dalam ${Math.ceil(remainingTime / 60)} menit`
          : 'Silakan tunggu beberapa saat sebelum popup reload muncul lagi'
        
        ;(window as any).jpNotify.warning(
          '⚠️ Popup Reload Diblokir',
          `${message}. ${details}. Website tetap dapat diakses normal.`,
          8000
        )
      } else {
        // Fallback notification
        console.warn(`⚠️ Popup reload diblokir: ${reason || 'Terlalu banyak percobaan reload'}. Website tetap dapat diakses normal.`)
      }
    }

    private showReloadWarning(attemptsRemaining: number) {
      if ((window as any).jpNotify && attemptsRemaining <= 1) {
        ;(window as any).jpNotify.warning(
          '⚠️ Peringatan Popup Reload',
          `Anda memiliki ${attemptsRemaining} percobaan reload tersisa. Setelah itu, popup reload akan diblokir sementara. Website tetap dapat diakses normal.`,
          8000
        )
      }
    }

    public async attemptReload(options: any = {}): Promise<boolean> {
      if (this.isReloading) {
        console.warn('Reload already in progress')
        return false
      }

      // Check if reload is allowed
      const canReload = await this.checkReloadAllowed()
      if (!canReload) {
        this.showBlockedNotification()
        return false
      }

      // Record the attempt
      const attemptRecorded = await this.recordReloadAttempt()
      if (!attemptRecorded) {
        return false
      }

      this.isReloading = true

      try {
        // Show notification about reload
        if (options.showNotification !== false && (window as any).jpNotify) {
          ;(window as any).jpNotify.info(
            '🔄 Memperbarui Halaman',
            'Sedang memuat ulang dengan cache terbaru...',
            3000
          )
        }

        // Use enhanced reload function if available
        if ((window as any).jpForceReload) {
          await (window as any).jpForceReload({
            clearCache: options.clearCache !== false,
            showNotification: false, // We already showed notification
            delay: options.delay || 500
          })
        } else {
          // Fallback to simple reload
          setTimeout(() => {
            window.location.reload()
          }, options.delay || 1000)
        }

        return true
      } catch (error) {
        console.error('Reload failed:', error)
        this.isReloading = false
        return false
      }
    }

    public async forceReload(options: any = {}): Promise<boolean> {
      // Force reload bypasses the smart checking (use with caution)
      console.warn('⚠️ Force reload called - bypassing smart reload protection')
      
      this.isReloading = true
      
      try {
        if ((window as any).jpForceReload) {
          await (window as any).jpForceReload(options)
        } else {
          window.location.reload()
        }
        return true
      } catch (error) {
        console.error('Force reload failed:', error)
        this.isReloading = false
        return false
      }
    }

    public async resetAttempts(): Promise<boolean> {
      try {
        const response = await $fetch('/api/smart-reload-tracker', {
          method: 'POST',
          body: {
            action: 'reset',
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        })

        if (response.success && (window as any).jpNotify) {
          ;(window as any).jpNotify.success(
            '✅ Reset Berhasil',
            'Percobaan reload telah direset untuk IP ini',
            5000
          )
        }

        return response.success
      } catch (error) {
        console.error('Failed to reset attempts:', error)
        return false
      }
    }

    public async getStatus(): Promise<any> {
      try {
        const response = await $fetch('/api/smart-reload-tracker', {
          method: 'POST',
          body: {
            action: 'check',
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        })

        return response
      } catch (error) {
        console.error('Failed to get status:', error)
        return { success: false, error: error.message }
      }
    }
  }

  // Initialize the smart reload manager
  new SmartReloadManager()

  // Add global error handler for reload failures
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('reload')) {
      console.warn('Reload error detected:', event.message)
    }
  })

  // Add beforeunload handler to track page unloads
  window.addEventListener('beforeunload', () => {
    // This helps track when users are actually leaving vs reloading
    try {
      sessionStorage.setItem('jp-page-unloading', Date.now().toString())
    } catch (error) {
      // Ignore storage errors
    }
  })

  // Add load handler to clean up unloading flag
  window.addEventListener('load', () => {
    try {
      sessionStorage.removeItem('jp-page-unloading')
    } catch (error) {
      // Ignore storage errors
    }
  })
})
