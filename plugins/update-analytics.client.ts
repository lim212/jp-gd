// plugins/update-analytics.client.ts
// Analytics system for tracking popup and update performance

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpUpdateAnalyticsInitialized) return
  ;(window as any).__jpUpdateAnalyticsInitialized = true

  class UpdateAnalyticsSystem {
    private analytics: any = {
      popupShown: 0,
      popupAccepted: 0,
      popupDismissed: 0,
      popupAutoTriggered: 0,
      updateSuccess: 0,
      updateFailed: 0,
      fallbackUsed: 0,
      browserSupport: {},
      connectionQuality: {},
      userAgent: navigator.userAgent,
      sessionStart: Date.now(),
      lastUpdate: null
    }

    constructor() {
      this.loadAnalytics()
      this.initializeTracking()
    }

    private loadAnalytics() {
      try {
        const stored = localStorage.getItem('jp-update-analytics')
        if (stored) {
          const parsed = JSON.parse(stored)
          this.analytics = { ...this.analytics, ...parsed }
        }
      } catch (error) {
        console.warn('Failed to load analytics:', error)
      }
    }

    private saveAnalytics() {
      try {
        localStorage.setItem('jp-update-analytics', JSON.stringify(this.analytics))
      } catch (error) {
        console.warn('Failed to save analytics:', error)
      }
    }

    private initializeTracking() {
      // Track browser info
      this.trackBrowserInfo()
      
      // Track connection quality
      this.trackConnectionQuality()
      
      // Save analytics periodically
      setInterval(() => {
        this.saveAnalytics()
      }, 30000) // Save every 30 seconds

      // Save on page unload
      window.addEventListener('beforeunload', () => {
        this.saveAnalytics()
      })
    }

    private trackBrowserInfo() {
      const browserInfo = (window as any).jpBrowserInfo || {}
      
      this.analytics.browserSupport = {
        isChrome: browserInfo.isChrome || false,
        isFirefox: browserInfo.isFirefox || false,
        isSafari: browserInfo.isSafari || false,
        isEdge: browserInfo.isEdge || false,
        isMobile: browserInfo.isMobile || false,
        supportsServiceWorker: browserInfo.supportsServiceWorker || false,
        supportsCacheAPI: browserInfo.supportsCacheAPI || false,
        supportsLocalStorage: browserInfo.supportsLocalStorage || false,
        isOldBrowser: browserInfo.isOldBrowser || false
      }
    }

    private trackConnectionQuality() {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      
      if (connection) {
        this.analytics.connectionQuality = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        }
      }
    }

    // Public tracking methods
    trackPopupShown(type: string = 'standard') {
      this.analytics.popupShown++
      this.analytics.lastUpdate = Date.now()
      
      console.log('📊 Analytics: Popup shown', {
        type,
        totalShown: this.analytics.popupShown
      })
      
      this.saveAnalytics()
    }

    trackPopupAccepted(type: string = 'manual') {
      this.analytics.popupAccepted++
      
      console.log('📊 Analytics: Popup accepted', {
        type,
        totalAccepted: this.analytics.popupAccepted,
        acceptanceRate: this.getAcceptanceRate()
      })
      
      this.saveAnalytics()
    }

    trackPopupDismissed(reason: string = 'timeout') {
      this.analytics.popupDismissed++
      
      console.log('📊 Analytics: Popup dismissed', {
        reason,
        totalDismissed: this.analytics.popupDismissed
      })
      
      this.saveAnalytics()
    }

    trackPopupAutoTriggered() {
      this.analytics.popupAutoTriggered++
      
      console.log('📊 Analytics: Popup auto-triggered', {
        totalAutoTriggered: this.analytics.popupAutoTriggered
      })
      
      this.saveAnalytics()
    }

    trackUpdateSuccess(method: string = 'reload') {
      this.analytics.updateSuccess++
      
      console.log('📊 Analytics: Update success', {
        method,
        totalSuccess: this.analytics.updateSuccess,
        successRate: this.getSuccessRate()
      })
      
      this.saveAnalytics()
    }

    trackUpdateFailed(error: string = 'unknown') {
      this.analytics.updateFailed++
      
      console.log('📊 Analytics: Update failed', {
        error,
        totalFailed: this.analytics.updateFailed
      })
      
      this.saveAnalytics()
    }

    trackFallbackUsed(fallbackType: string) {
      this.analytics.fallbackUsed++
      
      console.log('📊 Analytics: Fallback used', {
        fallbackType,
        totalFallbacks: this.analytics.fallbackUsed
      })
      
      this.saveAnalytics()
    }

    // Analytics getters
    getAcceptanceRate(): number {
      if (this.analytics.popupShown === 0) return 0
      return Math.round((this.analytics.popupAccepted / this.analytics.popupShown) * 100)
    }

    getSuccessRate(): number {
      const total = this.analytics.updateSuccess + this.analytics.updateFailed
      if (total === 0) return 0
      return Math.round((this.analytics.updateSuccess / total) * 100)
    }

    getFallbackRate(): number {
      if (this.analytics.popupShown === 0) return 0
      return Math.round((this.analytics.fallbackUsed / this.analytics.popupShown) * 100)
    }

    getSessionDuration(): number {
      return Date.now() - this.analytics.sessionStart
    }

    // Get full analytics report
    getAnalyticsReport() {
      return {
        ...this.analytics,
        acceptanceRate: this.getAcceptanceRate(),
        successRate: this.getSuccessRate(),
        fallbackRate: this.getFallbackRate(),
        sessionDuration: this.getSessionDuration()
      }
    }

    // Reset analytics
    resetAnalytics() {
      this.analytics = {
        popupShown: 0,
        popupAccepted: 0,
        popupDismissed: 0,
        popupAutoTriggered: 0,
        updateSuccess: 0,
        updateFailed: 0,
        fallbackUsed: 0,
        browserSupport: {},
        connectionQuality: {},
        userAgent: navigator.userAgent,
        sessionStart: Date.now(),
        lastUpdate: null
      }
      
      this.trackBrowserInfo()
      this.trackConnectionQuality()
      this.saveAnalytics()
      
      console.log('📊 Analytics reset')
    }

    // Export analytics data
    exportAnalytics() {
      const report = this.getAnalyticsReport()
      const dataStr = JSON.stringify(report, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `update-analytics-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      console.log('📊 Analytics exported')
    }
  }

  // Initialize analytics system
  const analyticsSystem = new UpdateAnalyticsSystem()
  ;(window as any).jpUpdateAnalytics = analyticsSystem

  // Integrate with existing systems
  if ((window as any).jpPopupController) {
    const originalCanShowPopup = (window as any).jpPopupController.canShowPopup.bind((window as any).jpPopupController)
    
    ;(window as any).jpPopupController.canShowPopup = function() {
      const canShow = originalCanShowPopup()
      
      if (canShow) {
        analyticsSystem.trackPopupShown('standard')
      } else {
        analyticsSystem.trackFallbackUsed('popup-blocked')
      }
      
      return canShow
    }
  }

  // Track popup interactions
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    
    if (target.id === 'jp-update-apply') {
      analyticsSystem.trackPopupAccepted('manual')
    }
  })

  // Track auto-triggered popups
  const originalSetTimeout = window.setTimeout
  window.setTimeout = function(callback: Function, delay: number, ...args: any[]) {
    if (delay === 25000) { // Auto-update timeout
      analyticsSystem.trackPopupAutoTriggered()
    }
    return originalSetTimeout(callback, delay, ...args)
  }

  // Track update success/failure
  window.addEventListener('beforeunload', () => {
    // This is a rough way to track if the page is reloading due to update
    if (sessionStorage.getItem('jp-updating') === 'true') {
      analyticsSystem.trackUpdateSuccess('reload')
    }
  })

  // Show analytics in console
  console.log('📊 Update Analytics System initialized:', analyticsSystem.getAnalyticsReport())

  // Add global methods for debugging
  ;(window as any).jpAnalytics = {
    getReport: () => analyticsSystem.getAnalyticsReport(),
    reset: () => analyticsSystem.resetAnalytics(),
    export: () => analyticsSystem.exportAnalytics(),
    trackPopupShown: (type: string) => analyticsSystem.trackPopupShown(type),
    trackPopupAccepted: (type: string) => analyticsSystem.trackPopupAccepted(type),
    trackPopupDismissed: (reason: string) => analyticsSystem.trackPopupDismissed(reason),
    trackUpdateSuccess: (method: string) => analyticsSystem.trackUpdateSuccess(method),
    trackUpdateFailed: (error: string) => analyticsSystem.trackUpdateFailed(error),
    trackFallbackUsed: (fallbackType: string) => analyticsSystem.trackFallbackUsed(fallbackType)
  }
})
