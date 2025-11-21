// plugins/router-api-interceptor.client.ts
// Router interceptor to prevent API calls from being handled by Vue Router

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__routerApiInterceptorInitialized) return
  ;(window as any).__routerApiInterceptorInitialized = true

  // Store original console.warn to intercept Vue Router warnings
  const originalWarn = console.warn
  console.warn = (...args) => {
    // Check if this is a Vue Router warning about API routes
    const message = args[0]
    if (typeof message === 'string' && 
        message.includes('Vue Router warn') && 
        message.includes('No match found for location with path "/api/')) {
      // Suppress Vue Router warnings for API routes
      console.debug('Vue Router API warning suppressed:', message)
      return
    }
    
    // Allow all other warnings to pass through
    originalWarn.apply(console, args)
  }

  // Also intercept router navigation attempts to API routes
  const router = useRouter()
  if (router) {
    const originalPush = router.push
    const originalReplace = router.replace
    
    // Override router.push to prevent API route navigation
    router.push = (to: any) => {
      if (typeof to === 'string' && to.startsWith('/api/')) {
        console.debug('Router push to API route blocked:', to)
        return Promise.resolve()
      }
      return originalPush.call(router, to)
    }
    
    // Override router.replace to prevent API route navigation
    router.replace = (to: any) => {
      if (typeof to === 'string' && to.startsWith('/api/')) {
        console.debug('Router replace to API route blocked:', to)
        return Promise.resolve()
      }
      return originalReplace.call(router, to)
    }
  }

  // Intercept fetch calls to prevent them from being treated as router navigation
  const originalFetch = window.fetch
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    
    // If this is an API call, ensure it's handled properly
    if (url.startsWith('/api/')) {
      // Add headers to prevent router interference
      const headers = new Headers(init?.headers)
      headers.set('X-API-Call', 'true')
      headers.set('Accept', 'application/json')
      
      return originalFetch(input, {
        ...init,
        headers,
        // Ensure this is treated as an API call, not navigation
        credentials: 'same-origin'
      })
    }
    
    return originalFetch(input, init)
  }

  // Add global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    if (reason && typeof reason === 'object' && reason.message) {
      const message = reason.message
      if (message.includes('Vue Router warn') && message.includes('/api/')) {
        console.debug('Unhandled Vue Router API warning suppressed:', message)
        event.preventDefault()
        return
      }
    }
  })

  console.log('✅ Router API Interceptor initialized - API route warnings suppressed')
})
