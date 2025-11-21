// plugins/ultimate-popup-killer.client.ts
// ULTIMATE popup killer untuk menghentikan popup "Website Telah Diperbarui!" secara definitif

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__ultimatePopupKillerInitialized) return
  ;(window as any).__ultimatePopupKillerInitialized = true

  class UltimatePopupKiller {
    private isKilling = true
    private killInterval: number | undefined

    constructor() {
      this.startUltimateKilling()
      this.setupGlobalMethods()
    }

    private startUltimateKilling() {
      console.log('💀 ULTIMATE POPUP KILLER: ACTIVATED')
      
      // Kill existing popups immediately
      this.killExistingPopups()
      
      // Block all popup functions
      this.blockAllPopupFunctions()
      
      // Start continuous monitoring
      this.startContinuousMonitoring()
      
      // Set permanent blocking flags
      this.setPermanentBlockingFlags()
    }

    private killExistingPopups() {
      // Remove all possible popup elements
      const popupSelectors = [
        '#jp-update-modal',
        '#jp-notification-container',
        '#jp-update-card',
        '.jp-notification',
        '[data-jp-update-style]',
        'style[data-jp-update-style="true"]'
      ]
      
      popupSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          element.remove()
          console.log(`💀 Killed popup element: ${selector}`)
        })
      })
    }

    private blockAllPopupFunctions() {
      // Block showUpdateModal
      window.showUpdateModal = () => {
        console.log('💀 showUpdateModal KILLED')
        return false
      }

      // Block check function
      window.check = () => {
        console.log('💀 check function KILLED')
        return false
      }

      // Block all notification functions
      if (window.jpNotify) {
        window.jpNotify.info = () => console.log('💀 jpNotify.info KILLED')
        window.jpNotify.warning = () => console.log('💀 jpNotify.warning KILLED')
        window.jpNotify.error = () => console.log('💀 jpNotify.error KILLED')
        window.jpNotify.success = () => console.log('💀 jpNotify.success KILLED')
        window.jpNotify.show = () => console.log('💀 jpNotify.show KILLED')
      }

      // Block reload functions
      if (window.jpSuperSmartReload) {
        window.jpSuperSmartReload.attemptReload = () => {
          console.log('💀 jpSuperSmartReload.attemptReload KILLED')
          return false
        }
      }

      if (window.jpSmartReload) {
        window.jpSmartReload.attemptReload = () => {
          console.log('💀 jpSmartReload.attemptReload KILLED')
          return false
        }
      }

      if (window.jpForceReload) {
        window.jpForceReload = () => {
          console.log('💀 jpForceReload KILLED')
          return false
        }
      }

      // Block cache lama detector
      if (window.jpCacheLamaDetector) {
        window.jpCacheLamaDetector.forceDetection = () => {
          console.log('💀 jpCacheLamaDetector.forceDetection KILLED')
          return false
        }
      }

      // Block smart cache manager
      if (window.jpSmartCache) {
        window.jpSmartCache.forceUpdate = () => {
          console.log('💀 jpSmartCache.forceUpdate KILLED')
          return false
        }
      }
    }

    private startContinuousMonitoring() {
      // Monitor DOM for new popups
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              
              // Check for any popup-related elements
              if (this.isPopupElement(element)) {
                console.log('💀 Detected popup element, KILLING...')
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

      // Periodic cleanup
      this.killInterval = window.setInterval(() => {
        this.killExistingPopups()
      }, 1000) // Check every second

      console.log('💀 Continuous monitoring started')
    }

    private isPopupElement(element: Element): boolean {
      const popupIds = ['jp-update-modal', 'jp-notification-container', 'jp-update-card']
      const popupClasses = ['jp-notification', 'jp-update-modal']
      
      // Check by ID
      if (popupIds.includes(element.id)) {
        return true
      }
      
      // Check by class
      if (popupClasses.some(cls => element.classList.contains(cls))) {
        return true
      }
      
      // Check for update modal styles
      if (element.tagName === 'STYLE' && element.getAttribute('data-jp-update-style') === 'true') {
        return true
      }
      
      // Check for popup content
      if (element.textContent && element.textContent.includes('Website Telah Diperbarui')) {
        return true
      }
      
      return false
    }

    private setPermanentBlockingFlags() {
      try {
        const currentVersion = window.__NUXT__?.config?.public?.buildId || 'current'
        
        // Set multiple blocking flags
        localStorage.setItem('jp-update-shown', currentVersion)
        localStorage.setItem('jp-popup-blocked', 'true')
        localStorage.setItem('jp-ultimate-popup-killer', 'active')
        localStorage.setItem('jp-cache-version', currentVersion)
        
        // Set aggressive blocker state
        localStorage.setItem('jp-aggressive-popup-blocker', JSON.stringify({
          isBlocking: true,
          lastBlockTime: Date.now()
        }))
        
        console.log('💀 Permanent blocking flags set')
      } catch (error) {
        console.warn('Failed to set permanent blocking flags:', error)
      }
    }

    private setupGlobalMethods() {
      // Make ultimate popup killer globally available
      ;(window as any).jpUltimatePopupKiller = {
        killAllPopups: () => this.killExistingPopups(),
        isKilling: () => this.isKilling,
        getStatus: () => this.getStatus()
      }
    }

    public getStatus() {
      return {
        isKilling: this.isKilling,
        killInterval: this.killInterval,
        blockingFlags: {
          updateShown: localStorage.getItem('jp-update-shown'),
          popupBlocked: localStorage.getItem('jp-popup-blocked'),
          ultimateKiller: localStorage.getItem('jp-ultimate-popup-killer')
        }
      }
    }

    public destroy() {
      if (this.killInterval) {
        clearInterval(this.killInterval)
        this.killInterval = undefined
      }
      this.isKilling = false
    }
  }

  // Initialize the ultimate popup killer
  const ultimatePopupKiller = new UltimatePopupKiller()

  // Make it globally available
  ;(window as any).jpUltimatePopupKiller = ultimatePopupKiller

  console.log('💀 ULTIMATE POPUP KILLER initialized - All popups will be KILLED!')
})
