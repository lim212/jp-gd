// plugins/aggressive-popup-blocker.client.ts
// AGGRESIF popup blocker untuk menghentikan popup yang muncul terus-menerus

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__aggressivePopupBlockerInitialized) return
  ;(window as any).__aggressivePopupBlockerInitialized = true

  class AggressivePopupBlocker {
    private isBlocking = true
    private blockDuration = 24 * 60 * 60 * 1000 // 24 jam block
    private lastBlockTime = 0

    constructor() {
      this.loadBlockState()
      this.setupGlobalMethods()
      this.startAggressiveBlocking()
    }

    private loadBlockState() {
      try {
        const stored = localStorage.getItem('jp-aggressive-popup-blocker')
        if (stored) {
          const state = JSON.parse(stored)
          this.isBlocking = state.isBlocking !== false
          this.lastBlockTime = state.lastBlockTime || 0
          
          // Check if block period has expired
          const now = Date.now()
          if (now - this.lastBlockTime > this.blockDuration) {
            this.isBlocking = false
            this.saveBlockState()
          }
        }
      } catch (error) {
        console.warn('Failed to load popup blocker state:', error)
      }
    }

    private saveBlockState() {
      try {
        const state = {
          isBlocking: this.isBlocking,
          lastBlockTime: this.lastBlockTime
        }
        localStorage.setItem('jp-aggressive-popup-blocker', JSON.stringify(state))
      } catch (error) {
        console.warn('Failed to save popup blocker state:', error)
      }
    }

    private setupGlobalMethods() {
      // Make aggressive popup blocker globally available
      ;(window as any).jpAggressivePopupBlocker = {
        enableBlocking: () => this.enableBlocking(),
        disableBlocking: () => this.disableBlocking(),
        isBlocking: () => this.isBlocking,
        getStatus: () => this.getStatus()
      }
    }

    private startAggressiveBlocking() {
      if (!this.isBlocking) return

      console.log('🚫 AGGRESIF Popup Blocker: ACTIVE')

      // Block showUpdateModal function
      const originalShowUpdateModal = (window as any).showUpdateModal
      if (originalShowUpdateModal) {
        ;(window as any).showUpdateModal = () => {
          console.log('🚫 Popup blocked by aggressive blocker')
          return false
        }
      }

      // Block version check popup
      const originalCheck = (window as any).check
      if (originalCheck) {
        ;(window as any).check = async () => {
          console.log('🚫 Version check blocked by aggressive blocker')
          return false
        }
      }

      // Block cache lama detector popup
      if ((window as any).jpCacheLamaDetector) {
        const originalHandleCacheLamaDetected = (window as any).jpCacheLamaDetector.handleCacheLamaDetected
        if (originalHandleCacheLamaDetected) {
          ;(window as any).jpCacheLamaDetector.handleCacheLamaDetected = () => {
            console.log('🚫 Cache lama detection popup blocked by aggressive blocker')
            return false
          }
        }
      }

      // Block smart cache manager popup
      if ((window as any).jpSmartCache) {
        const originalHandleUpdateAvailable = (window as any).jpSmartCache.handleUpdateAvailable
        if (originalHandleUpdateAvailable) {
          ;(window as any).jpSmartCache.handleUpdateAvailable = () => {
            console.log('🚫 Smart cache update popup blocked by aggressive blocker')
            return false
          }
        }
      }

      // Block all notification popups
      if ((window as any).jpNotify) {
        const originalNotify = (window as any).jpNotify
        ;(window as any).jpNotify = {
          ...originalNotify,
          info: () => console.log('🚫 Info notification blocked'),
          warning: () => console.log('🚫 Warning notification blocked'),
          error: () => console.log('🚫 Error notification blocked'),
          success: () => console.log('🚫 Success notification blocked'),
          show: () => console.log('🚫 Show notification blocked')
        }
      }

      // Remove existing popup modals
      this.removeExistingPopups()

      // Monitor for new popups
      this.startPopupMonitoring()
    }

    private removeExistingPopups() {
      // Remove update modal
      const updateModal = document.getElementById('jp-update-modal')
      if (updateModal) {
        updateModal.remove()
        console.log('✅ Removed existing update modal')
      }

      // Remove notification container
      const notificationContainer = document.getElementById('jp-notification-container')
      if (notificationContainer) {
        notificationContainer.remove()
        console.log('✅ Removed notification container')
      }

      // Remove update modal styles
      const updateStyles = document.querySelector('style[data-jp-update-style="true"]')
      if (updateStyles) {
        updateStyles.remove()
        console.log('✅ Removed update modal styles')
      }
    }

    private startPopupMonitoring() {
      // Monitor DOM for new popups
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              
              // Check for update modal
              if (element.id === 'jp-update-modal' || element.querySelector('#jp-update-modal')) {
                console.log('🚫 Detected update modal, removing...')
                element.remove()
              }
              
              // Check for notification container
              if (element.id === 'jp-notification-container' || element.querySelector('#jp-notification-container')) {
                console.log('🚫 Detected notification container, removing...')
                element.remove()
              }
              
              // Check for update modal styles
              if (element.tagName === 'STYLE' && element.getAttribute('data-jp-update-style') === 'true') {
                console.log('🚫 Detected update modal styles, removing...')
                element.remove()
              }
            }
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      console.log('👁️ Started popup monitoring')
    }

    public enableBlocking() {
      this.isBlocking = true
      this.lastBlockTime = Date.now()
      this.saveBlockState()
      this.startAggressiveBlocking()
      console.log('🚫 Aggressive popup blocking ENABLED')
    }

    public disableBlocking() {
      this.isBlocking = false
      this.saveBlockState()
      console.log('✅ Aggressive popup blocking DISABLED')
    }

    public getStatus() {
      const now = Date.now()
      const timeSinceLastBlock = now - this.lastBlockTime
      const timeRemaining = Math.max(0, this.blockDuration - timeSinceLastBlock)
      const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000))
      
      return {
        isBlocking: this.isBlocking,
        lastBlockTime: this.lastBlockTime,
        timeRemaining: timeRemaining,
        hoursRemaining: hoursRemaining,
        blockDuration: this.blockDuration
      }
    }
  }

  // Initialize the aggressive popup blocker
  const aggressivePopupBlocker = new AggressivePopupBlocker()

  // Make it globally available
  ;(window as any).jpAggressivePopupBlocker = aggressivePopupBlocker

  console.log('🚫 AGGRESIF Popup Blocker initialized!')
})
