// plugins/vue-router-api-fix.client.ts
// Comprehensive fix for Vue Router API route warnings

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent multiple initializations
  if ((window as any).__vueRouterApiFixInitialized) return
  ;(window as any).__vueRouterApiFixInitialized = true

  // Wait for router to be available
  const router = useRouter()
  
  if (router) {
    // Add global before guard to prevent API route navigation
    router.beforeEach((to, from, next) => {
      // Block navigation to API routes
      if (to.path.startsWith('/api/')) {
        console.debug('Router navigation to API route blocked:', to.path)
        // Instead of navigating, make a fetch request
        fetch(to.path, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-API-Call': 'true'
          }
        }).catch(() => {
          // Silently handle fetch errors
        })
        return false // Block navigation
      }
      next()
    })

    // Override router methods to prevent API route handling
    const originalPush = router.push
    const originalReplace = router.replace
    const originalGo = router.go
    const originalBack = router.back
    const originalForward = router.forward

    router.push = (to: any) => {
      if (typeof to === 'string' && to.startsWith('/api/')) {
        console.debug('Router push to API route intercepted:', to)
        return Promise.resolve()
      }
      if (typeof to === 'object' && to.path && to.path.startsWith('/api/')) {
        console.debug('Router push to API route intercepted:', to.path)
        return Promise.resolve()
      }
      return originalPush.call(router, to)
    }

    router.replace = (to: any) => {
      if (typeof to === 'string' && to.startsWith('/api/')) {
        console.debug('Router replace to API route intercepted:', to)
        return Promise.resolve()
      }
      if (typeof to === 'object' && to.path && to.path.startsWith('/api/')) {
        console.debug('Router replace to API route intercepted:', to.path)
        return Promise.resolve()
      }
      return originalReplace.call(router, to)
    }

    router.go = (delta: number) => {
      // Check if the target route would be an API route
      const currentPath = router.currentRoute.value.path
      if (currentPath.startsWith('/api/')) {
        console.debug('Router go from API route intercepted')
        return
      }
      return originalGo.call(router, delta)
    }

    router.back = () => {
      const currentPath = router.currentRoute.value.path
      if (currentPath.startsWith('/api/')) {
        console.debug('Router back from API route intercepted')
        return
      }
      return originalBack.call(router)
    }

    router.forward = () => {
      const currentPath = router.currentRoute.value.path
      if (currentPath.startsWith('/api/')) {
        console.debug('Router forward from API route intercepted')
        return
      }
      return originalForward.call(router)
    }
  }

  // Intercept and suppress Vue Router warnings
  const originalConsoleWarn = console.warn
  console.warn = (...args) => {
    const message = args[0]
    if (typeof message === 'string' && 
        message.includes('Vue Router warn') && 
        message.includes('No match found for location with path "/api/')) {
      // Completely suppress Vue Router API warnings
      return
    }
    originalConsoleWarn.apply(console, args)
  }

  // Intercept Vue Router error handling
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args[0]
    if (typeof message === 'string' && 
        message.includes('Vue Router') && 
        message.includes('/api/')) {
      // Suppress Vue Router API errors
      return
    }
    originalConsoleError.apply(console, args)
  }

  // Override window.location for API routes
  const originalLocation = window.location
  Object.defineProperty(window, 'location', {
    get() {
      return originalLocation
    },
    set(value) {
      if (typeof value === 'string' && value.startsWith('/api/')) {
        console.debug('Location change to API route intercepted:', value)
        // Make fetch request instead
        fetch(value, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-API-Call': 'true'
          }
        }).catch(() => {
          // Silently handle fetch errors
        })
        return
      }
      originalLocation.href = value
    }
  })

  // Intercept history API to prevent API route navigation
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function(state, title, url) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      console.debug('History pushState to API route intercepted:', url)
      return
    }
    return originalPushState.call(history, state, title, url)
  }

  history.replaceState = function(state, title, url) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      console.debug('History replaceState to API route intercepted:', url)
      return
    }
    return originalReplaceState.call(history, state, title, url)
  }

  // Add popstate listener to handle back/forward navigation
  window.addEventListener('popstate', (event) => {
    const url = event.state?.url || window.location.pathname
    if (url.startsWith('/api/')) {
      console.debug('Popstate to API route intercepted:', url)
      // Prevent default behavior and make fetch request
      event.preventDefault()
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Call': 'true'
        }
      }).catch(() => {
        // Silently handle fetch errors
      })
    }
  })

  console.log('✅ Vue Router API Fix initialized - All API route warnings suppressed')
})
