// plugins/cross-browser-notification.client.ts
// Enhanced cross-browser notification system with better popup management

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__jpNotificationSystemInitialized) return
  ;(window as any).__jpNotificationSystemInitialized = true

  // Enhanced notification system
  class CrossBrowserNotificationSystem {
    private notifications: Map<string, HTMLElement> = new Map()
    private maxNotifications = 3
    private notificationCounter = 0

    constructor() {
      this.injectStyles()
      this.setupGlobalMethods()
    }

    private injectStyles() {
      if (document.querySelector('#jp-notification-styles')) return

      const style = document.createElement('style')
      style.id = 'jp-notification-styles'
      style.textContent = `
        .jp-notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2147483647;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }
        
        .jp-notification {
          pointer-events: auto;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95));
          backdrop-filter: blur(12px) saturate(120%);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06);
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          min-height: 60px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .jp-notification.show {
          transform: translateX(0);
          opacity: 1;
        }
        
        .jp-notification.hide {
          transform: translateX(100%);
          opacity: 0;
        }
        
        .jp-notification::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #22c55e, #06b6d4, #8b5cf6);
          background-size: 200% 100%;
          animation: jp-notification-shimmer 3s ease-in-out infinite;
        }
        
        .jp-notification-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: linear-gradient(135deg, #22c55e, #06b6d4);
          color: white;
          box-shadow: 0 8px 20px rgba(34,197,94,0.3);
        }
        
        .jp-notification-content {
          flex: 1;
          min-width: 0;
        }
        
        .jp-notification-title {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }
        
        .jp-notification-message {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }
        
        .jp-notification-close {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: rgba(148,163,184,0.1);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s ease;
        }
        
        .jp-notification-close:hover {
          background: rgba(148,163,184,0.2);
          color: #475569;
        }
        
        .jp-notification-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #22c55e, #06b6d4);
          transition: width 0.1s linear;
          border-radius: 0 0 16px 16px;
        }
        
        /* Dark mode support - Enhanced Visibility with Better Contrast */
        .dark .jp-notification,
        @media (prefers-color-scheme: dark) {
          .jp-notification {
            background: linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98)) padding-box,
                        linear-gradient(135deg, rgba(99,102,241,0.6), rgba(168,85,247,0.5), rgba(34,197,94,0.4)) border-box;
            border: 2px solid transparent;
            box-shadow: 0 25px 50px rgba(0,0,0,0.6), 
                        0 8px 16px rgba(0,0,0,0.3),
                        inset 0 2px 0 rgba(255,255,255,0.15);
            backdrop-filter: blur(20px) saturate(180%);
          }
          
          .jp-notification::before {
            background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399, #22d3ee);
            background-size: 300% 100%;
            animation: jp-notification-shimmer 4s ease-in-out infinite;
            box-shadow: 0 0 25px rgba(96,165,250,0.7);
            height: 4px;
          }
          
          .jp-notification-title {
            color: #ffffff !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3);
            font-weight: 700;
            font-size: 15px;
          }
          
          .jp-notification-message {
            color: #f1f5f9 !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2);
            font-weight: 500;
          }
          
          .jp-notification-icon {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6, #22c55e);
            box-shadow: 0 12px 24px rgba(59,130,246,0.6), 
                        inset 0 2px 0 rgba(255,255,255,0.3),
                        0 0 20px rgba(139,92,246,0.5);
          }
          
          .jp-notification-close {
            background: linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.4));
            color: #ffffff !important;
            border: 1px solid rgba(139,92,246,0.5);
            backdrop-filter: blur(8px);
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          }
          
          .jp-notification-close:hover {
            background: linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.6));
            color: #ffffff !important;
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
          }
          
          .jp-notification-progress {
            background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399);
            box-shadow: 0 0 12px rgba(96,165,250,0.8), 0 0 20px rgba(168,123,250,0.5);
            height: 3px;
          }
        }
        
        /* Mobile responsive */
        @media (max-width: 640px) {
          .jp-notification-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
          
          .jp-notification {
            padding: 14px 16px;
          }
          
          .jp-notification-icon {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
          
          .jp-notification-title {
            font-size: 13px;
          }
          
          .jp-notification-message {
            font-size: 12px;
          }
        }
        
        @keyframes jp-notification-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .jp-notification {
            transition: opacity 0.2s ease;
            animation: none;
          }
          
          .jp-notification::before {
            animation: none;
          }
        }
      `
      document.head.appendChild(style)
    }

    private getContainer(): HTMLElement {
      let container = document.getElementById('jp-notification-container')
      if (!container) {
        container = document.createElement('div')
        container.id = 'jp-notification-container'
        container.className = 'jp-notification-container'
        document.body.appendChild(container)
      }
      return container
    }

    show(options: {
      title: string
      message: string
      icon?: string
      duration?: number
      type?: 'success' | 'error' | 'warning' | 'info'
      persistent?: boolean
    }) {
      const id = `notification-${++this.notificationCounter}`
      const container = this.getContainer()

      // Remove oldest notification if we have too many
      if (this.notifications.size >= this.maxNotifications) {
        const oldestId = this.notifications.keys().next().value
        this.hide(oldestId)
      }

      const notification = document.createElement('div')
      notification.className = 'jp-notification'
      notification.id = id

      const iconMap = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }

      const icon = options.icon || iconMap[options.type || 'info'] || '🔔'
      const duration = options.duration || 5000

      notification.innerHTML = `
        <div class="jp-notification-icon">${icon}</div>
        <div class="jp-notification-content">
          <div class="jp-notification-title">${options.title}</div>
          <div class="jp-notification-message">${options.message}</div>
        </div>
        <button class="jp-notification-close" aria-label="Tutup notifikasi">×</button>
        ${!options.persistent ? '<div class="jp-notification-progress" style="width: 100%"></div>' : ''}
      `

      container.appendChild(notification)
      this.notifications.set(id, notification)

      // Show animation
      requestAnimationFrame(() => {
        notification.classList.add('show')
      })

      // Close button functionality
      const closeBtn = notification.querySelector('.jp-notification-close')
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide(id))
      }

      // Auto-hide with progress bar
      if (!options.persistent && duration > 0) {
        const progressBar = notification.querySelector('.jp-notification-progress') as HTMLElement
        if (progressBar) {
          let progress = 100
          const interval = setInterval(() => {
            progress -= (100 / (duration / 100))
            if (progress <= 0) {
              clearInterval(interval)
              this.hide(id)
            } else {
              progressBar.style.width = progress + '%'
            }
          }, 100)
        }

        setTimeout(() => this.hide(id), duration)
      }

      return id
    }

    hide(id: string) {
      const notification = this.notifications.get(id)
      if (!notification) return

      notification.classList.add('hide')
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
        this.notifications.delete(id)
      }, 300)
    }

    clear() {
      for (const id of this.notifications.keys()) {
        this.hide(id)
      }
    }

    private setupGlobalMethods() {
      // Make notification system globally available
      ;(window as any).jpNotify = {
        show: (options: any) => this.show(options),
        hide: (id: string) => this.hide(id),
        clear: () => this.clear(),
        success: (title: string, message: string, duration?: number) => 
          this.show({ title, message, type: 'success', duration }),
        error: (title: string, message: string, duration?: number) => 
          this.show({ title, message, type: 'error', duration }),
        warning: (title: string, message: string, duration?: number) => 
          this.show({ title, message, type: 'warning', duration }),
        info: (title: string, message: string, duration?: number) => 
          this.show({ title, message, type: 'info', duration })
      }
    }
  }

  // Initialize the notification system
  new CrossBrowserNotificationSystem()

  // Enhanced browser detection and compatibility
  const browserInfo = {
    isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isFirefox: /Firefox/.test(navigator.userAgent),
    isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    isEdge: /Edg/.test(navigator.userAgent),
    isOpera: /OPR/.test(navigator.userAgent),
    isMobile: /Mobi|Android/i.test(navigator.userAgent),
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
    })()
  }

  // Store browser info globally for other plugins to use
  ;(window as any).jpBrowserInfo = browserInfo

  // Enhanced reload function with better cross-browser support
  ;(window as any).jpForceReload = async (options: {
    clearCache?: boolean
    showNotification?: boolean
    delay?: number
  } = {}) => {
    const { clearCache = true, showNotification = true, delay = 0 } = options

    // Check if SUPER SMART reload manager is available and use it (prioritas utama)
    if ((window as any).jpSuperSmartReload) {
      try {
        const success = await (window as any).jpSuperSmartReload.attemptReload({
          clearCache,
          showNotification,
          delay
        })
        if (success) {
          return
        } else {
          // Super smart reload was blocked, don't proceed with manual reload
          return
        }
      } catch (error) {
        console.warn('Super smart reload failed, falling back to smart reload:', error)
        // Continue with smart reload below
      }
    }

    // Fallback to smart reload manager if available
    if ((window as any).jpSmartReload) {
      try {
        const success = await (window as any).jpSmartReload.attemptReload({
          clearCache,
          showNotification,
          delay
        })
        if (success) {
          return
        } else {
          // Smart reload was blocked, don't proceed with manual reload
          return
        }
      } catch (error) {
        console.warn('Smart reload failed, falling back to manual method:', error)
        // Continue with manual method below
      }
    }

    if (showNotification) {
      ;(window as any).jpNotify?.info(
        'Memperbarui Halaman',
        'Sedang memuat ulang dengan cache terbaru...',
        3000
      )
    }

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    try {
      if (clearCache) {
        console.log('🧹 Starting SUPER AGRESIF cache clearing in cross-browser notification...')
        
        // SUPER AGRESIF cache clearing based on browser support
        if (browserInfo.supportsCacheAPI) {
          const cacheNames = await caches.keys()
          await Promise.all(cacheNames.map(name => {
            console.log(`🗑️ Deleting cache: ${name}`)
            return caches.delete(name)
          }))
        }

        if (browserInfo.supportsServiceWorker) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map(reg => {
            console.log(`🗑️ Unregistering service worker: ${reg.scope}`)
            return reg.unregister()
          }))
        }

        if (browserInfo.supportsLocalStorage) {
          // SUPER AGRESIF localStorage clearing
          const keysToRemove = Object.keys(localStorage).filter(key => 
            key.includes('cache') || 
            key.includes('version') || 
            key.includes('build') ||
            key.includes('nuxt') ||
            key.includes('jp-') ||
            key.includes('_nuxt') ||
            key.includes('sw-')
          )
          keysToRemove.forEach(key => {
            try { 
              console.log(`🗑️ Removing localStorage: ${key}`)
              localStorage.removeItem(key) 
            } catch {}
          })
        }

        // Clear sessionStorage juga
        if (browserInfo.supportsLocalStorage) {
          const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
            key.includes('cache') || 
            key.includes('version') || 
            key.includes('build') ||
            key.includes('nuxt') ||
            key.includes('jp-') ||
            key.includes('_nuxt') ||
            key.includes('sw-')
          )
          sessionKeysToRemove.forEach(key => {
            try { 
              console.log(`🗑️ Removing sessionStorage: ${key}`)
              sessionStorage.removeItem(key) 
            } catch {}
          })
        }

        // Clear IndexedDB jika ada
        if ('indexedDB' in window) {
          try {
            indexedDB.deleteDatabase('nuxt-cache')
            indexedDB.deleteDatabase('jp-cache')
            indexedDB.deleteDatabase('workbox-precache')
            console.log('🗑️ Cleared IndexedDB caches')
          } catch (error) {
            console.warn('IndexedDB clearing failed:', error)
          }
        }

        console.log('🧹 SUPER AGRESIF cache clearing completed!')
      }

      // Add cache-busting parameter
      const url = new URL(window.location.href)
      url.searchParams.set('_cb', Date.now().toString())
      
      // Try different reload methods based on browser
      if (browserInfo.isFirefox) {
        // Firefox sometimes needs a different approach
        window.location.href = url.toString()
      } else {
        window.location.replace(url.toString())
      }
      
      // Fallback
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.warn('Cache clearing failed, performing simple reload:', error)
      window.location.reload()
    }
  }

  // Show browser compatibility notification if needed
  if (!browserInfo.supportsServiceWorker || !browserInfo.supportsCacheAPI) {
    setTimeout(() => {
      ;(window as any).jpNotify?.warning(
        'Browser Compatibility',
        'Beberapa fitur mungkin terbatas di browser Anda. Pertimbangkan untuk menggunakan browser yang lebih modern.',
        8000
      )
    }, 3000)
  }
})
