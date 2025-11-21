// plugins/popup-killer.client.ts
// Plugin untuk mematikan popup auto reload secara definitif

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__popupKillerInitialized) return
  ;(window as any).__popupKillerInitialized = true

  class PopupKiller {
    private isKilling = false
    private killInterval: number | undefined
    private observer: MutationObserver | undefined

    constructor() {
      this.init()
    }

    private init() {
      console.log('💀 Popup Killer initialized - killing all popups')
      
      // Kill existing popups immediately
      this.killExistingPopups()
      
      // Start continuous monitoring
      this.startContinuousKilling()
      
      // Setup global API
      this.setupGlobalAPI()
      
      // Disable all popup systems
      this.disablePopupSystems()
    }

    private killExistingPopups() {
      // Remove all popup elements
      const popupSelectors = [
        '#jp-update-modal',
        '#jp-notification-container', 
        '#jp-update-card',
        '.jp-notification',
        '[data-jp-update-style="true"]'
      ]

      popupSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          element.remove()
          console.log('💀 Killed popup element:', selector)
        })
      })

      // Remove popup styles
      const popupStyles = document.querySelectorAll('style[data-jp-update-style="true"]')
      popupStyles.forEach(style => {
        style.remove()
        console.log('💀 Killed popup style')
      })
    }

    private startContinuousKilling() {
      // MutationObserver untuk detect popup baru
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              
              // Check for popup elements
              if (this.isPopupElement(element)) {
                console.log('💀 Detected new popup, KILLING...')
                element.remove()
              }
            }
          })
        })
      })

      // Start observing
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      // Periodic cleanup
      this.killInterval = window.setInterval(() => {
        this.killExistingPopups()
      }, 1000) // Check every second

      console.log('💀 Continuous popup killing started')
    }

    private isPopupElement(element: Element): boolean {
      // Check by ID
      const popupIds = [
        'jp-update-modal',
        'jp-notification-container',
        'jp-update-card'
      ]
      
      if (popupIds.includes(element.id)) {
        return true
      }

      // Check by class
      const popupClasses = [
        'jp-notification',
        'jp-update-modal',
        'jp-notification-container'
      ]
      
      for (const className of popupClasses) {
        if (element.classList.contains(className)) {
          return true
        }
      }

      // Check by attribute
      if (element.getAttribute('data-jp-update-style') === 'true') {
        return true
      }

      // Check by content
      if (element.textContent && this.containsPopupText(element.textContent)) {
        return true
      }

      return false
    }

    private containsPopupText(text: string): boolean {
      const popupTexts = [
        'Website Telah Diperbarui',
        'Pembaruan Tersedia',
        'Reload Sekarang',
        'Auto-reload dalam',
        'Memperbarui Halaman'
      ]
      
      return popupTexts.some(popupText => text.includes(popupText))
    }

    private disablePopupSystems() {
      // Disable version checking
      if ((window as any).__jpUpdateCheckerInitialized) {
        console.log('💀 Disabling version checker')
        // Clear any existing timers
        const timers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        timers.forEach(i => {
          clearTimeout(i)
          clearInterval(i)
        })
      }

      // Disable popup controller
      if ((window as any).jpPopupController) {
        console.log('💀 Disabling popup controller')
        ;(window as any).jpPopupController = null
      }

      // Disable smart reload systems
      if ((window as any).jpSuperSmartReload) {
        console.log('💀 Disabling super smart reload')
        ;(window as any).jpSuperSmartReload = null
      }

      if ((window as any).jpSmartReload) {
        console.log('💀 Disabling smart reload')
        ;(window as any).jpSmartReload = null
      }

      // Disable force reload
      if ((window as any).jpForceReload) {
        console.log('💀 Disabling force reload')
        ;(window as any).jpForceReload = null
      }

      // Set blocking flags
      try {
        localStorage.setItem('jp-popup-blocked', 'true')
        localStorage.setItem('jp-update-shown', 'current-version')
        sessionStorage.setItem('jp-updating', 'false')
        console.log('💀 Set blocking flags')
      } catch (error) {
        console.warn('Failed to set blocking flags:', error)
      }
    }

    private setupGlobalAPI() {
      // Make popup killer globally available
      ;(window as any).popupKiller = {
        killAll: () => this.killExistingPopups(),
        startKilling: () => this.startContinuousKilling(),
        stopKilling: () => this.stopKilling(),
        isKilling: () => this.isKilling,
        getStatus: () => this.getStatus()
      }
    }

    public stopKilling() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = undefined
      }
      
      if (this.killInterval) {
        clearInterval(this.killInterval)
        this.killInterval = undefined
      }
      
      this.isKilling = false
      console.log('💀 Popup killing stopped')
    }

    public getStatus() {
      return {
        isKilling: this.isKilling,
        observerActive: !!this.observer,
        intervalActive: !!this.killInterval,
        blockingFlags: {
          popupBlocked: localStorage.getItem('jp-popup-blocked') === 'true',
          updateShown: localStorage.getItem('jp-update-shown'),
          updating: sessionStorage.getItem('jp-updating')
        }
      }
    }
  }

  // Initialize popup killer
  const popupKiller = new PopupKiller()

  // Make it globally available
  ;(window as any).popupKiller = popupKiller

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    popupKiller.stopKilling()
  })

  console.log('💀 Popup Killer plugin loaded successfully')
})
