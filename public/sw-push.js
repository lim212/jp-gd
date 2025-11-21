// public/sw-push.js
// Service worker for push notifications and update management

const CACHE_NAME = 'jp-push-sw-v1'
const UPDATE_CACHE_NAME = 'jp-update-sw-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('🔔 Push Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🔔 Push Service Worker cache opened')
      return cache.addAll([
        '/',
        '/favicon.ico',
        '/manifest.json'
      ])
    })
  )
  
  // Skip waiting to activate immediately
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🔔 Push Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== UPDATE_CACHE_NAME) {
            console.log('🔔 Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Take control of all clients immediately
  self.clients.claim()
})

// Push event
self.addEventListener('push', (event) => {
  console.log('🔔 Push event received:', event)
  
  let notificationData = {
    title: '🚀 Website Diperbarui!',
    body: 'Klik untuk memuat versi terbaru dengan fitur dan perbaikan baru.',
    icon: '/favicon-32x32.png',
    badge: '/favicon-16x16.png',
    tag: 'website-update',
    requireInteraction: true,
    actions: [
      {
        action: 'update',
        title: '🔄 Perbarui Sekarang',
        icon: '/favicon-16x16.png'
      },
      {
        action: 'later',
        title: '⏰ Nanti Saja',
        icon: '/favicon-16x16.png'
      }
    ]
  }
  
  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (error) {
      console.warn('Failed to parse push data:', error)
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'update') {
    // Handle update action
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Focus existing window or open new one
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      }).then(() => {
        // Send message to client to trigger reload
        return clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'FORCE_RELOAD',
              data: { clearCache: true }
            })
          })
        })
      })
    )
  } else if (event.action === 'later') {
    // Handle later action - schedule reminder
    event.waitUntil(
      self.registration.showNotification('⏰ Peringatan Update', {
        body: 'Website masih menunggu untuk diperbarui. Klik untuk memuat versi terbaru.',
        icon: '/favicon-32x32.png',
        tag: 'update-reminder',
        requireInteraction: false
      })
    )
  } else {
    // Default click action
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
    )
  }
})

// Message event from client
self.addEventListener('message', (event) => {
  console.log('🔔 Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Check for updates and notify if available
    event.waitUntil(
      fetch('/api/version?' + Date.now(), {
        cache: 'no-store',
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate, max-age=0'
        }
      }).then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to check version')
      }).then((data) => {
        // Store current version in cache
        return caches.open(UPDATE_CACHE_NAME).then((cache) => {
          return cache.put('/api/version', new Response(JSON.stringify(data)))
        })
      }).catch((error) => {
        console.warn('Failed to check for updates:', error)
      })
    )
  }
})

// Background sync for offline updates
self.addEventListener('sync', (event) => {
  console.log('🔔 Background sync event:', event.tag)
  
  if (event.tag === 'background-update-check') {
    event.waitUntil(
      fetch('/api/version?' + Date.now(), {
        cache: 'no-store',
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate, max-age=0'
        }
      }).then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to check version')
      }).then((data) => {
        // Check if there's an update
        return caches.open(UPDATE_CACHE_NAME).then((cache) => {
          return cache.match('/api/version').then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse.json().then((cachedData) => {
                if (data.buildId !== cachedData.buildId) {
                  // Update available, show notification
                  return self.registration.showNotification('🚀 Update Tersedia!', {
                    body: 'Website telah diperbarui. Klik untuk memuat versi terbaru.',
                    icon: '/favicon-32x32.png',
                    tag: 'background-update',
                    requireInteraction: true
                  })
                }
              })
            }
            
            // Store new version
            return cache.put('/api/version', new Response(JSON.stringify(data)))
          })
        })
      }).catch((error) => {
        console.warn('Background update check failed:', error)
      })
    )
  }
})

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    console.log('🔔 Periodic sync event:', event.tag)
    
    if (event.tag === 'update-check') {
      event.waitUntil(
        fetch('/api/version?' + Date.now(), {
          cache: 'no-store',
          headers: {
            'cache-control': 'no-cache, no-store, must-revalidate, max-age=0'
          }
        }).then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Failed to check version')
        }).then((data) => {
          // Store version for comparison
          return caches.open(UPDATE_CACHE_NAME).then((cache) => {
            return cache.put('/api/version', new Response(JSON.stringify(data)))
          })
        }).catch((error) => {
          console.warn('Periodic update check failed:', error)
        })
      )
    }
  })
}

console.log('🔔 Push Service Worker loaded successfully')
