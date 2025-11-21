// plugins/smart-browser-support.client.ts
// Smart browser support detection and fallback system for popup reload

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpSmartBrowserSupportInitialized) return
  ;(window as any).__jpSmartBrowserSupportInitialized = true

  // Enhanced browser detection
  const browserInfo = {
    isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isFirefox: /Firefox/.test(navigator.userAgent),
    isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    isEdge: /Edg/.test(navigator.userAgent),
    isOpera: /OPR/.test(navigator.userAgent),
    isMobile: /Mobi|Android/i.test(navigator.userAgent),
    isOldBrowser: (() => {
      const ua = navigator.userAgent
      // Detect old browsers that might not support modern features
      return /MSIE|Trident|Edge\/[0-9]/.test(ua) || 
             /Firefox\/[0-5]/.test(ua) || 
             /Chrome\/[0-6]/.test(ua) ||
             /Safari\/[0-5]/.test(ua)
    })(),
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsCacheAPI: 'caches' in window,
    supportsLocalStorage: (() => {
      try {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
        return true
      } catch {
        return false
      }
    })(),
    supportsNotifications: 'Notification' in window,
    supportsPushManager: 'PushManager' in window,
    supportsWebGL: (() => {
      try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      } catch {
        return false
      }
    })(),
    connectionType: (() => {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      return connection ? connection.effectiveType : 'unknown'
    })(),
    isSlowConnection: (() => {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        return connection.effectiveType === 'slow-2g' || 
               connection.effectiveType === '2g' || 
               connection.effectiveType === '3g' ||
               connection.downlink < 1
      }
      return false
    })()
  }

  // Store browser info globally
  ;(window as any).jpBrowserInfo = browserInfo

  // Smart popup controller
  class SmartPopupController {
    private popupCount = 0
    private maxPopups = 3
    private cooldownTime = 30000 // 30 seconds
    private lastPopupTime = 0
    private isBlocked = false

    constructor() {
      this.loadState()
    }

    private loadState() {
      try {
        const stored = localStorage.getItem('jp-smart-popup-state')
        if (stored) {
          const state = JSON.parse(stored)
          this.popupCount = state.popupCount || 0
          this.lastPopupTime = state.lastPopupTime || 0
          this.isBlocked = state.isBlocked || false
        }
      } catch (error) {
        console.warn('Failed to load popup state:', error)
      }
    }

    private saveState() {
      try {
        const state = {
          popupCount: this.popupCount,
          lastPopupTime: this.lastPopupTime,
          isBlocked: this.isBlocked,
          timestamp: Date.now()
        }
        localStorage.setItem('jp-smart-popup-state', JSON.stringify(state))
      } catch (error) {
        console.warn('Failed to save popup state:', error)
      }
    }

    canShowPopup(): boolean {
      const now = Date.now()
      
      // Check if we're in cooldown period
      if (now - this.lastPopupTime < this.cooldownTime) {
        return false
      }

      // Check if we've exceeded max popups
      if (this.popupCount >= this.maxPopups) {
        this.isBlocked = true
        this.saveState()
        return false
      }

      // Check if browser supports popups
      if (!this.isBrowserSupported()) {
        return false
      }

      return !this.isBlocked
    }

    private isBrowserSupported(): boolean {
      // Check if browser supports basic popup features
      if (browserInfo.isOldBrowser) {
        return false
      }

      // Check if browser has necessary APIs
      if (!browserInfo.supportsLocalStorage) {
        return false
      }

      // Check connection quality
      if (browserInfo.isSlowConnection && browserInfo.isMobile) {
        return false
      }

      return true
    }

    markPopupShown() {
      this.popupCount++
      this.lastPopupTime = Date.now()
      this.saveState()
    }

    reset() {
      this.popupCount = 0
      this.lastPopupTime = 0
      this.isBlocked = false
      this.saveState()
    }

    getStatus() {
      return {
        popupCount: this.popupCount,
        maxPopups: this.maxPopups,
        isBlocked: this.isBlocked,
        canShow: this.canShowPopup(),
        lastPopupTime: this.lastPopupTime,
        cooldownTime: this.cooldownTime,
        browserSupported: this.isBrowserSupported()
      }
    }
  }

  // Initialize smart popup controller
  const popupController = new SmartPopupController()
  ;(window as any).jpPopupController = popupController

  // Smart fallback system
  class SmartFallbackSystem {
    private fallbackMethods: string[] = []
    private currentMethod = 0

    constructor() {
      this.initializeFallbackMethods()
    }

    private initializeFallbackMethods() {
      // Method 1: Standard popup (best experience)
      if (browserInfo.supportsServiceWorker && browserInfo.supportsCacheAPI) {
        this.fallbackMethods.push('standard-popup')
      }

      // Method 2: Simple notification (good experience)
      if (browserInfo.supportsLocalStorage && !browserInfo.isOldBrowser) {
        this.fallbackMethods.push('simple-notification')
      }

      // Method 3: Page refresh indicator (basic experience)
      this.fallbackMethods.push('page-refresh-indicator')

      // Method 4: Console message (fallback)
      this.fallbackMethods.push('console-message')
    }

    showUpdateNotification(message: string) {
      const method = this.fallbackMethods[this.currentMethod] || 'console-message'
      
      switch (method) {
        case 'standard-popup':
          this.showStandardPopup(message)
          break
        case 'simple-notification':
          this.showSimpleNotification(message)
          break
        case 'page-refresh-indicator':
          this.showPageRefreshIndicator(message)
          break
        case 'console-message':
        default:
          this.showConsoleMessage(message)
          break
      }
    }

    private showStandardPopup(message: string) {
      // This will be handled by the main popup system
      console.log('🚀 Standard popup should be shown:', message)
    }

    private showSimpleNotification(message: string) {
      // Create a simple notification banner
      const banner = document.createElement('div')
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #22c55e, #06b6d4);
        color: white;
        padding: 12px 20px;
        text-align: center;
        font-weight: 600;
        z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease-out;
      `

      banner.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
          <span>🔄</span>
          <span>${message}</span>
          <button onclick="window.location.reload()" style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
          ">Reload</button>
        </div>
      `

      // Add CSS animation
      if (!document.querySelector('#jp-fallback-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-fallback-styles'
        style.textContent = `
          @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(banner)

      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner)
        }
      }, 10000)
    }

    private showPageRefreshIndicator(message: string) {
      // Add a subtle indicator to the page
      const indicator = document.createElement('div')
      indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(34, 197, 94, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 2147483647;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: pulse 2s infinite;
      `

      indicator.innerHTML = `🔄 ${message}`
      indicator.onclick = () => window.location.reload()

      // Add CSS animation
      if (!document.querySelector('#jp-fallback-styles')) {
        const style = document.createElement('style')
        style.id = 'jp-fallback-styles'
        style.textContent = `
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `
        document.head.appendChild(style)
      }

      document.body.appendChild(indicator)

      // Auto-remove after 15 seconds
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator)
        }
      }, 15000)
    }

    private showConsoleMessage(message: string) {
      console.log('🔄 Update Available:', message)
      console.log('Please refresh the page to get the latest version.')
    }

    nextMethod() {
      this.currentMethod = (this.currentMethod + 1) % this.fallbackMethods.length
    }
  }

  // Initialize smart fallback system
  const fallbackSystem = new SmartFallbackSystem()
  ;(window as any).jpFallbackSystem = fallbackSystem

  // Browser compatibility notification
  if (browserInfo.isOldBrowser || !browserInfo.supportsServiceWorker) {
    setTimeout(() => {
      if ((window as any).jpNotify) {
        ;(window as any).jpNotify.warning(
          'Browser Compatibility',
          'Browser Anda mungkin tidak mendukung semua fitur. Pertimbangkan untuk menggunakan browser yang lebih modern untuk pengalaman terbaik.',
          8000
        )
      } else {
        fallbackSystem.showUpdateNotification('Browser Anda mungkin tidak mendukung semua fitur. Pertimbangkan untuk menggunakan browser yang lebih modern.')
      }
    }, 5000)
  }

  // Export browser info and systems
  console.log('🌐 Smart Browser Support initialized:', {
    browser: browserInfo,
    popupController: popupController.getStatus(),
    fallbackMethods: fallbackSystem['fallbackMethods']
  })
})
