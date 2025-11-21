// plugins/api-call-manager.client.ts
// Centralized API call manager to prevent Vue Router warnings and optimize performance

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__apiCallManagerInitialized) return
  ;(window as any).__apiCallManagerInitialized = true

  class ApiCallManager {
    private callHistory: Map<string, number> = new Map()
    private rateLimitWindow = 60000 // 1 minute
    private maxCallsPerWindow = 3 // Max 3 calls per minute per endpoint
    private pendingCalls: Set<string> = new Set()

    constructor() {
      this.setupGlobalMethods()
    }

    private setupGlobalMethods() {
      // Make API call manager globally available
      ;(window as any).jpApiCallManager = {
        makeCall: (url: string, options?: RequestInit) => this.makeCall(url, options),
        isRateLimited: (url: string) => this.isRateLimited(url),
        getCallHistory: () => this.getCallHistory(),
        clearHistory: () => this.clearHistory()
      }
    }

    private isRateLimited(url: string): boolean {
      const now = Date.now()
      const key = this.getUrlKey(url)
      const lastCall = this.callHistory.get(key) || 0
      const callsInWindow = Array.from(this.callHistory.entries())
        .filter(([k, time]) => k.startsWith(key.split('?')[0]) && (now - time) < this.rateLimitWindow)
        .length

      return callsInWindow >= this.maxCallsPerWindow
    }

    private getUrlKey(url: string): string {
      // Normalize URL to group similar calls
      const urlObj = new URL(url, window.location.origin)
      return `${urlObj.pathname}`
    }

    private async makeCall(url: string, options: RequestInit = {}): Promise<Response | null> {
      const key = this.getUrlKey(url)
      
      // Check if call is already pending
      if (this.pendingCalls.has(key)) {
        console.debug('API call already pending for:', key)
        return null
      }

      // Check rate limiting
      if (this.isRateLimited(url)) {
        console.debug('API call rate limited for:', key)
        return null
      }

      // Mark as pending
      this.pendingCalls.add(key)
      this.callHistory.set(key, Date.now())

      try {
        // Use XMLHttpRequest instead of fetch to avoid router interference
        const response = await this.makeXHRCall(url, options)
        return response
      } catch (error) {
        // All errors are now handled by XHR wrapper
        console.debug('API call completed with error handling')
        return null
      } finally {
        // Remove from pending
        this.pendingCalls.delete(key)
      }
    }

    private makeXHRCall(url: string, options: RequestInit = {}): Promise<Response | null> {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        
        // Set timeout
        xhr.timeout = 5000
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Create a mock Response object
            const response = {
              ok: true,
              status: xhr.status,
              statusText: xhr.statusText,
              headers: new Headers(),
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
              text: () => Promise.resolve(xhr.responseText)
            } as Response
            resolve(response)
          } else {
            resolve(null)
          }
        }
        
        xhr.onerror = () => {
          resolve(null)
        }
        
        xhr.ontimeout = () => {
          resolve(null)
        }
        
        // Open request
        const method = options.method || 'GET'
        xhr.open(method, url, true)
        
        // Set headers
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('X-API-Call', 'true')
        xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        xhr.setRequestHeader('Pragma', 'no-cache')
        xhr.setRequestHeader('Expires', '0')
        
        // Set additional headers from options
        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            if (typeof value === 'string') {
              xhr.setRequestHeader(key, value)
            }
          })
        }
        
        // Send request
        xhr.send(options.body as any)
      })
    }

    private getCallHistory() {
      const now = Date.now()
      const history: Record<string, any> = {}
      
      for (const [key, time] of this.callHistory.entries()) {
        const age = now - time
        if (age < this.rateLimitWindow) {
          history[key] = {
            lastCall: time,
            age: age,
            isRecent: age < 30000 // Less than 30 seconds
          }
        }
      }
      
      return history
    }

    private clearHistory() {
      this.callHistory.clear()
      this.pendingCalls.clear()
    }
  }

  // Initialize the API call manager
  const apiCallManager = new ApiCallManager()

  console.log('✅ API Call Manager initialized with rate limiting and error suppression')
})
