// plugins/popup-controller.client.ts
// Controller untuk mencegah popup "Website Telah Diperbarui!" muncul terus-menerus

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__popupControllerInitialized) return
  ;(window as any).__popupControllerInitialized = true

  class PopupController {
    private popupShown = false
    private lastPopupTime = 0
    private popupCooldown = 5 * 60 * 1000 // 5 menit cooldown
    private maxPopupsPerHour = 2 // Max 2 popup per jam
    private popupHistory: number[] = []
    private isMobile = /Mobi|Android/i.test(navigator.userAgent)
    private mobilePopupCooldown = 30 * 60 * 1000 // 30 menit cooldown untuk mobile
    private mobileMaxPopupsPerHour = 1 // Max 1 popup per jam untuk mobile

    constructor() {
      this.loadPopupState()
      this.setupGlobalMethods()
      this.setupPopupInterception()
    }

    private loadPopupState() {
      try {
        const stored = localStorage.getItem('jp-popup-controller-state')
        if (stored) {
          const state = JSON.parse(stored)
          this.popupShown = state.popupShown || false
          this.lastPopupTime = state.lastPopupTime || 0
          this.popupHistory = state.popupHistory || []
          
          // Clean old history (older than 1 hour)
          const oneHourAgo = Date.now() - (60 * 60 * 1000)
          this.popupHistory = this.popupHistory.filter(time => time > oneHourAgo)
        }
      } catch (error) {
        console.warn('Failed to load popup controller state:', error)
      }
    }

    private savePopupState() {
      try {
        const state = {
          popupShown: this.popupShown,
          lastPopupTime: this.lastPopupTime,
          popupHistory: this.popupHistory.slice(-10) // Keep last 10
        }
        localStorage.setItem('jp-popup-controller-state', JSON.stringify(state))
      } catch (error) {
        console.warn('Failed to save popup controller state:', error)
      }
    }

    private setupGlobalMethods() {
      // Make popup controller globally available
      ;(window as any).jpPopupController = {
        canShowPopup: () => this.canShowPopup(),
        markPopupShown: () => this.markPopupShown(),
        resetPopupState: () => this.resetPopupState(),
        getStatus: () => this.getStatus()
      }
    }

    private setupPopupInterception() {
      // Intercept showUpdateModal function
      const originalShowUpdateModal = (window as any).showUpdateModal
      if (originalShowUpdateModal) {
        ;(window as any).showUpdateModal = (nextId: string) => {
          if (this.canShowPopup()) {
            this.markPopupShown()
            return originalShowUpdateModal(nextId)
          } else {
            console.log('🚫 Popup blocked by popup controller')
            return false
          }
        }
      }

      // Intercept version check popup
      const originalCheck = (window as any).check
      if (originalCheck) {
        ;(window as any).check = async () => {
          const result = await originalCheck()
          // Additional popup control logic here
          return result
        }
      }
    }

    public canShowPopup(): boolean {
      const now = Date.now()
      
      // Check cooldown
      if (now - this.lastPopupTime < this.popupCooldown) {
        console.log('🚫 Popup blocked: still in cooldown period')
        return false
      }
      
      // Check max popups per hour
      const oneHourAgo = now - (60 * 60 * 1000)
      const recentPopups = this.popupHistory.filter(time => time > oneHourAgo)
      
      if (recentPopups.length >= this.maxPopupsPerHour) {
        console.log('🚫 Popup blocked: max popups per hour reached')
        return false
      }
      
      // Check if popup already shown for current session
      if (this.popupShown) {
        console.log('🚫 Popup blocked: already shown in current session')
        return false
      }
      
      return true
    }

    public markPopupShown() {
      const now = Date.now()
      this.popupShown = true
      this.lastPopupTime = now
      this.popupHistory.push(now)
      
      // Keep only last 10 popup times
      if (this.popupHistory.length > 10) {
        this.popupHistory = this.popupHistory.slice(-10)
      }
      
      this.savePopupState()
      console.log('✅ Popup marked as shown')
    }

    public resetPopupState() {
      this.popupShown = false
      this.lastPopupTime = 0
      this.popupHistory = []
      this.savePopupState()
      console.log('🔄 Popup state reset')
    }

    public getStatus() {
      const now = Date.now()
      const timeSinceLastPopup = now - this.lastPopupTime
      const cooldownRemaining = Math.max(0, this.popupCooldown - timeSinceLastPopup)
      const oneHourAgo = now - (60 * 60 * 1000)
      const recentPopups = this.popupHistory.filter(time => time > oneHourAgo)
      
      return {
        popupShown: this.popupShown,
        lastPopupTime: this.lastPopupTime,
        cooldownRemaining: cooldownRemaining,
        recentPopups: recentPopups.length,
        maxPopupsPerHour: this.maxPopupsPerHour,
        canShowPopup: this.canShowPopup()
      }
    }
  }

  // Initialize the popup controller
  const popupController = new PopupController()

  // Make it globally available
  ;(window as any).jpPopupController = popupController

  console.log('🚀 Popup Controller initialized to prevent spam popups!')
})
