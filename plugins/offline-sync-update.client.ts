// plugins/offline-sync-update.client.ts
// Offline detection and sync system for updates

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpOfflineSyncInitialized) return
  ;(window as any).__jpOfflineSyncInitialized = true

  class OfflineSyncUpdateSystem {
    private isOnline = navigator.onLine
    private lastOnlineTime = Date.now()
    private pendingUpdates: any[] = []
    private syncInterval: number | null = null
    private retryCount = 0
    private maxRetries = 2
    private lastCheckTime = 0
    private minCheckInterval = 120000 // 2 minutes minimum between checks

    constructor() {
      this.initializeOfflineDetection()
      this.initializeSyncSystem()
    }

    private initializeOfflineDetection() {
      // Listen for online/offline events
      window.addEventListener('online', () => {
        this.handleOnline()
      })

      window.addEventListener('offline', () => {
        this.handleOffline()
      })

      // Check connection status periodically
      setInterval(() => {
        this.checkConnectionStatus()
      }, 30000) // Check every 30 seconds
    }

    private initializeSyncSystem() {
      // Start sync interval when online
      if (this.isOnline) {
        this.startSyncInterval()
      }
    }

    private handleOnline() {
      console.log('📡 Connection restored - starting sync process')
      this.isOnline = true
      this.lastOnlineTime = Date.now()
      this.retryCount = 0

      // Show online notification
      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.success(
          'Koneksi Pulih',
          'Sedang memeriksa pembaruan terbaru...',
          3000
        )
      }

      // Start sync process
      this.startSyncInterval()
      this.processPendingUpdates()
      this.checkForUpdates()
    }

    private handleOffline() {
      console.log('📡 Connection lost - entering offline mode')
      this.isOnline = false
      this.stopSyncInterval()

      // Show offline notification
      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.warning(
          'Mode Offline',
          'Koneksi terputus. Pembaruan akan diperiksa saat online kembali.',
          5000
        )
      }
    }

    private checkConnectionStatus() {
      // Use fetch to check actual connectivity
      fetch('/api/version?' + Date.now(), {
        method: 'HEAD',
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
      })
      .then(() => {
        if (!this.isOnline) {
          this.handleOnline()
        }
      })
      .catch(() => {
        if (this.isOnline) {
          this.handleOffline()
        }
      })
    }

    private startSyncInterval() {
      if (this.syncInterval) {
        clearInterval(this.syncInterval)
      }

      // Check for updates every 5 minutes when online
      this.syncInterval = window.setInterval(() => {
        this.checkForUpdates()
      }, 300000)
    }

    private stopSyncInterval() {
      if (this.syncInterval) {
        clearInterval(this.syncInterval)
        this.syncInterval = null
      }
    }

    private async checkForUpdates() {
      if (!this.isOnline) {
        return
      }

      // Rate limiting - don't check too frequently
      const now = Date.now()
      if (now - this.lastCheckTime < this.minCheckInterval) {
        return
      }
      this.lastCheckTime = now

      try {
        const response = await fetch('/api/version?t=' + Date.now(), {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000),
          headers: {
            'cache-control': 'no-cache, no-store, must-revalidate, max-age=0'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const currentVersion = localStorage.getItem('jp-current-version') || 'unknown'
          
          if (data.buildId !== currentVersion) {
            console.log('📡 Update detected after coming online:', data.buildId)
            
            // Store new version
            localStorage.setItem('jp-current-version', data.buildId)
            
            // Show update notification
            this.showOfflineUpdateNotification(data)
          }
        }
      } catch (error) {
        // Suppress Vue Router warnings for API calls
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = String(error.message)
          if (errorMessage.includes('No match found for location with path "/api/version"')) {
            console.debug('Vue Router warning suppressed for /api/version')
            return
          }
        }
        
        // Don't log network errors in production
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to check for updates:', error)
        }
        
        // Don't retry on abort or network errors
        if (error instanceof Error && (
          error.name === 'AbortError' ||
          error.message.includes('fetch') ||
          error.message.includes('network')
        )) {
          return
        }
        
        this.retryCount++
        
        if (this.retryCount < this.maxRetries) {
          // Retry after exponential backoff
          setTimeout(() => {
            this.checkForUpdates()
          }, Math.pow(2, this.retryCount) * 1000)
        }
      }
    }

    private showOfflineUpdateNotification(updateData: any) {
      // Create offline update notification
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #22c55e, #06b6d4);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 2147483647;
        max-width: 400px;
        text-align: center;
        animation: slideDown 0.3s ease-out;
      `

      notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 20px;">📡</span>
          <span style="font-weight: 600; font-size: 16px;">Update Tersedia</span>
        </div>
        <div style="font-size: 14px; margin-bottom: 12px; opacity: 0.9;">
          Website telah diperbarui saat Anda offline. Klik untuk memuat versi terbaru.
        </div>
        <button onclick="this.parentElement.remove(); window.location.reload();" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          🔄 Perbarui Sekarang
        </button>
      `

      // Add CSS animation
      if (!document.querySelector('#jp-offline-sync-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-offline-sync-styles'
        style.textContent = `
          @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(notification)

      // Auto-remove after 15 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 15000)
    }

    private processPendingUpdates() {
      // Process any updates that were queued while offline
      if (this.pendingUpdates.length > 0) {
        console.log(`📡 Processing ${this.pendingUpdates.length} pending updates`)
        
        this.pendingUpdates.forEach(update => {
          // Process each pending update
          console.log('Processing pending update:', update)
        })
        
        this.pendingUpdates = []
      }
    }

    // Public methods
    isCurrentlyOnline(): boolean {
      return this.isOnline
    }

    getLastOnlineTime(): number {
      return this.lastOnlineTime
    }

    getPendingUpdatesCount(): number {
      return this.pendingUpdates.length
    }

    // Force check for updates
    async forceUpdateCheck(): Promise<void> {
      await this.checkForUpdates()
    }

    // Add update to pending queue (for offline mode)
    addPendingUpdate(update: any): void {
      this.pendingUpdates.push(update)
    }
  }

  // Initialize offline sync system
  const offlineSyncSystem = new OfflineSyncUpdateSystem()
  ;(window as any).jpOfflineSync = offlineSyncSystem

  // Integrate with existing systems
  if ((window as any).jpPopupController) {
    const originalCanShowPopup = (window as any).jpPopupController.canShowPopup.bind((window as any).jpPopupController)
    
    ;(window as any).jpPopupController.canShowPopup = function() {
      const canShow = originalCanShowPopup()
      
      // If offline, don't show popup but queue the update
      if (!offlineSyncSystem.isCurrentlyOnline()) {
        console.log('📡 Offline mode - queuing update for later')
        offlineSyncSystem.addPendingUpdate({
          timestamp: Date.now(),
          type: 'popup-update'
        })
        return false
      }
      
      return canShow
    }
  }

  // Show connection status in console
  console.log('📡 Offline Sync Update System initialized:', {
    online: offlineSyncSystem.isCurrentlyOnline(),
    lastOnline: new Date(offlineSyncSystem.getLastOnlineTime()).toLocaleString(),
    pendingUpdates: offlineSyncSystem.getPendingUpdatesCount()
  })
})
