// Service Worker for Advanced Caching Strategy
// Version 1.0.0

const CACHE_VERSION = 'jasapembayaran-v1.0.0'
const CACHE_PREFIX = 'jasapembayaran-'

// Cache names
const CACHES = {
  static: `${CACHE_PREFIX}static-${CACHE_VERSION}`,
  dynamic: `${CACHE_PREFIX}dynamic-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}images-${CACHE_VERSION}`,
  fonts: `${CACHE_PREFIX}fonts-${CACHE_VERSION}`
}

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico'
]

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network (for static assets)
  CACHE_FIRST: 'cache-first',
  // Network first, then cache (for dynamic content)  
  NETWORK_FIRST: 'network-first',
  // Network only (for API calls)
  NETWORK_ONLY: 'network-only',
  // Cache only
  CACHE_ONLY: 'cache-only',
  // Stale while revalidate (best for images)
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Determine strategy based on request
function getStrategy(request) {
  const url = new URL(request.url)
  
  // Fonts - cache first
  if (/\.(woff|woff2|ttf|eot|otf)$/i.test(url.pathname)) {
    return CACHE_STRATEGIES.CACHE_FIRST
  }
  
  // Images - stale while revalidate
  if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname)) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
  }
  
  // CSS/JS - network first (to get updates)
  if (/\.(css|js)$/i.test(url.pathname)) {
    return CACHE_STRATEGIES.NETWORK_FIRST
  }
  
  // API calls - network only
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.NETWORK_ONLY
  }
  
  // HTML pages - network first
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    return CACHE_STRATEGIES.NETWORK_FIRST
  }
  
  // Default: network first
  return CACHE_STRATEGIES.NETWORK_FIRST
}

// Get appropriate cache name based on request
function getCacheName(request) {
  const url = new URL(request.url)
  
  if (/\.(woff|woff2|ttf|eot|otf)$/i.test(url.pathname)) {
    return CACHES.fonts
  }
  
  if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname)) {
    return CACHES.images
  }
  
  if (/\.(css|js)$/i.test(url.pathname)) {
    return CACHES.static
  }
  
  return CACHES.dynamic
}

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHES.static)
      .then((cache) => {
        console.log('📦 Caching critical assets')
        return cache.addAll(CRITICAL_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker installed')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old caches
              return cacheName.startsWith(CACHE_PREFIX) && 
                     !Object.values(CACHES).includes(cacheName)
            })
            .map((cacheName) => {
              console.log(`🗑️ Deleting old cache: ${cacheName}`)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request
  const strategy = getStrategy(request)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return
  }
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(cacheFirst(request))
      break
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirst(request))
      break
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(staleWhileRevalidate(request))
      break
      
    case CACHE_STRATEGIES.CACHE_ONLY:
      event.respondWith(cacheOnly(request))
      break
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
    default:
      // Just fetch from network
      return
  }
})

// Cache First Strategy
async function cacheFirst(request) {
  const cacheName = getCacheName(request)
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached) {
    console.log(`💾 Cache hit: ${request.url}`)
    return cached
  }
  
  try {
    console.log(`🌐 Fetching: ${request.url}`)
    const response = await fetch(request)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.error(`❌ Fetch failed: ${request.url}`, error)
    
    // Return offline page if available
    const offlinePage = await cache.match('/offline.html')
    return offlinePage || new Response('Offline', { status: 503 })
  }
}

// Network First Strategy
async function networkFirst(request) {
  const cacheName = getCacheName(request)
  const cache = await caches.open(cacheName)
  
  try {
    console.log(`🌐 Fetching: ${request.url}`)
    const response = await fetch(request)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.error(`❌ Network failed, trying cache: ${request.url}`)
    const cached = await cache.match(request)
    
    if (cached) {
      console.log(`💾 Cache fallback: ${request.url}`)
      return cached
    }
    
    // Return offline page
    const offlinePage = await cache.match('/offline.html')
    return offlinePage || new Response('Offline', { status: 503 })
  }
}

// Stale While Revalidate Strategy (best for images)
async function staleWhileRevalidate(request) {
  const cacheName = getCacheName(request)
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  // Fetch in background and update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached) // Fallback to cache on error
  
  // Return cached immediately if available
  if (cached) {
    console.log(`💾 Serving stale: ${request.url}`)
    return cached
  }
  
  // Otherwise wait for network
  console.log(`🌐 No cache, waiting for network: ${request.url}`)
  return fetchPromise
}

// Cache Only Strategy
async function cacheOnly(request) {
  const cacheName = getCacheName(request)
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  return new Response('Not found in cache', { status: 404 })
}

// Message handler (for manual cache updates and version checks)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Skipping waiting - activating new service worker')
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith(CACHE_PREFIX)) {
              console.log(`🗑️ Clearing cache: ${cacheName}`)
              return caches.delete(cacheName)
            }
          })
        )
      })
    )
  }
  
  // Smart cache clear for update
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        console.log('🧹 Clearing all caches for update...')
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log(`🗑️ Deleting cache: ${cacheName}`)
            return caches.delete(cacheName)
          })
        )
      }).then(() => {
        console.log('✅ All caches cleared')
        // Notify clients
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'CACHE_CLEARED',
              timestamp: Date.now()
            })
          })
        })
      })
    )
  }
  
  // Check for version updates
  if (event.data && event.data.type === 'CHECK_VERSION') {
    event.waitUntil(
      fetch('/api/version?' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Failed to fetch version')
        })
        .then((data) => {
          // Store version in cache
          return caches.open(CACHES.dynamic).then((cache) => {
            return cache.put(
              new Request('/api/version'),
              new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
              })
            )
          })
        })
        .then(() => {
          // Notify clients
          return self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'VERSION_CHECKED',
                timestamp: Date.now()
              })
            })
          })
        })
        .catch((error) => {
          console.warn('⚠️ Version check failed:', error)
        })
    )
  }
})

console.log('🎉 Service Worker script loaded')

