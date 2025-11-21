// plugins/analytics-tracker.client.ts
// Analytics and error tracking tanpa mengubah design atau fungsi

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  class AnalyticsTracker {
    private sessionId = ''
    private startTime = Date.now()
    private pageViews: string[] = []
    private userInteractions: any[] = []
    private errors: any[] = []
    private performanceMetrics: any = {}

    constructor() {
      this.init()
    }

    private init() {
      // Generate session ID
      this.sessionId = this.generateSessionId()
      
      // Track page view
      this.trackPageView()
      
      // Setup error tracking
      this.setupErrorTracking()
      
      // Setup user interaction tracking
      this.setupUserInteractionTracking()
      
      // Setup performance tracking
      this.setupPerformanceTracking()
      
      // Setup session tracking
      this.setupSessionTracking()
      
      // Make globally available
      this.setupGlobalAPI()
    }

    private generateSessionId(): string {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }

    private trackPageView() {
      const pageView = {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
      
      this.pageViews.push(pageView)
      console.log('📊 Page View:', pageView)
    }

    private setupErrorTracking() {
      // Track JavaScript errors
      window.addEventListener('error', (event) => {
        const error = {
          type: 'javascript',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
        
        this.errors.push(error)
        console.error('📊 Error Tracked:', error)
      })

      // Track unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        const error = {
          type: 'promise',
          message: event.reason?.message || 'Unhandled Promise Rejection',
          stack: event.reason?.stack,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
        
        this.errors.push(error)
        console.error('📊 Promise Rejection Tracked:', error)
      })

      // Track fetch errors
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch.apply(this, args)
          if (!response.ok) {
            const error = {
              type: 'fetch',
              url: args[0]?.toString(),
              status: response.status,
              statusText: response.statusText,
              timestamp: Date.now()
            }
            this.errors.push(error)
            console.error('📊 Fetch Error Tracked:', error)
          }
          return response
        } catch (error) {
          const fetchError = {
            type: 'fetch',
            url: args[0]?.toString(),
            message: error instanceof Error ? error.message : 'Unknown fetch error',
            timestamp: Date.now()
          }
          this.errors.push(fetchError)
          console.error('📊 Fetch Error Tracked:', fetchError)
          throw error
        }
      }
    }

    private setupUserInteractionTracking() {
      // Track clicks
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        const interaction = {
          type: 'click',
          element: {
            tagName: target.tagName,
            className: target.className,
            id: target.id,
            text: target.textContent?.substring(0, 100)
          },
          position: {
            x: (event as MouseEvent).clientX,
            y: (event as MouseEvent).clientY
          },
          timestamp: Date.now(),
          url: window.location.href
        }
        
        this.userInteractions.push(interaction)
        console.log('📊 Click Tracked:', interaction)
      })

      // Track form submissions
      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement
        const interaction = {
          type: 'form_submit',
          form: {
            id: form.id,
            className: form.className,
            action: form.action,
            method: form.method
          },
          timestamp: Date.now(),
          url: window.location.href
        }
        
        this.userInteractions.push(interaction)
        console.log('📊 Form Submit Tracked:', interaction)
      })

      // Track scroll depth
      let maxScrollDepth = 0
      window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth
          const interaction = {
            type: 'scroll',
            depth: maxScrollDepth,
            timestamp: Date.now(),
            url: window.location.href
          }
          
          this.userInteractions.push(interaction)
          console.log('📊 Scroll Tracked:', interaction)
        }
      }, { passive: true })
    }

    private setupPerformanceTracking() {
      // Track Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lastEntry = entries[entries.length - 1] as PerformanceEntry
            this.performanceMetrics.lcp = lastEntry.startTime
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (error) {
          console.warn('LCP tracking failed:', error)
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry: any) => {
              this.performanceMetrics.fid = entry.processingStart - entry.startTime
            })
          })
          fidObserver.observe({ entryTypes: ['first-input'] })
        } catch (error) {
          console.warn('FID tracking failed:', error)
        }

        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0
          const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            })
            this.performanceMetrics.cls = clsValue
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })
        } catch (error) {
          console.warn('CLS tracking failed:', error)
        }
      }

      // Track page load performance
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          this.performanceMetrics = {
            ...this.performanceMetrics,
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstByte: navigation.responseStart - navigation.requestStart,
            domInteractive: navigation.domInteractive - navigation.navigationStart,
            domComplete: navigation.domComplete - navigation.navigationStart
          }
          
          console.log('📊 Performance Metrics:', this.performanceMetrics)
        }
      })
    }

    private setupSessionTracking() {
      // Track session duration
      window.addEventListener('beforeunload', () => {
        const sessionDuration = Date.now() - this.startTime
        const sessionData = {
          sessionId: this.sessionId,
          duration: sessionDuration,
          pageViews: this.pageViews.length,
          interactions: this.userInteractions.length,
          errors: this.errors.length,
          performance: this.performanceMetrics,
          timestamp: Date.now()
        }
        
        console.log('📊 Session Data:', sessionData)
        
        // Store session data
        try {
          localStorage.setItem('analytics_session', JSON.stringify(sessionData))
        } catch (error) {
          console.warn('Failed to store session data:', error)
        }
      })

      // Track time on page
      let timeOnPage = 0
      setInterval(() => {
        timeOnPage += 1000
        if (timeOnPage % 30000 === 0) { // Every 30 seconds
          console.log('📊 Time on Page:', timeOnPage / 1000, 'seconds')
        }
      }, 1000)
    }

    private setupGlobalAPI() {
      // Make analytics tracker globally available
      ;(window as any).analyticsTracker = {
        getSessionId: () => this.sessionId,
        getPageViews: () => this.pageViews,
        getUserInteractions: () => this.userInteractions,
        getErrors: () => this.errors,
        getPerformanceMetrics: () => this.performanceMetrics,
        trackEvent: (event: any) => this.trackCustomEvent(event),
        getSessionData: () => this.getSessionData()
      }
    }

    private trackCustomEvent(event: any) {
      const customEvent = {
        ...event,
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      }
      
      this.userInteractions.push(customEvent)
      console.log('📊 Custom Event Tracked:', customEvent)
    }

    private getSessionData() {
      return {
        sessionId: this.sessionId,
        startTime: this.startTime,
        duration: Date.now() - this.startTime,
        pageViews: this.pageViews,
        interactions: this.userInteractions,
        errors: this.errors,
        performance: this.performanceMetrics
      }
    }
  }

  // Initialize analytics tracker
  new AnalyticsTracker()
})
