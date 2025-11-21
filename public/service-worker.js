/* Enhanced cache management for JasaPembayaran.com */
const VERSION = 'v2.0.0';
const STATIC_CACHE = `jp-static-${VERSION}`;
const IMAGE_CACHE = `jp-images-${VERSION}`;
const DYNAMIC_CACHE = `jp-dynamic-${VERSION}`;
const API_CACHE = `jp-api-${VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  static: 'cache-first',
  images: 'cache-first',
  api: 'network-first',
  pages: 'network-first'
};

self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName.startsWith('jp-') && !cacheName.includes(VERSION)) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated successfully');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('❌ Service Worker activation failed:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.startsWith('/_nuxt/') || url.pathname.match(/\.(js|css|woff|woff2)$/)) {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// API requests - Network first with cache fallback
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful API responses
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a generic error response
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Image requests - Cache first with network fallback
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a placeholder image or error
    return new Response('', { status: 404 });
  }
}

// Static assets - Cache first with network fallback
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('', { status: 404 });
  }
}

// Page requests - Network first with cache fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful page responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error
    return new Response('', { status: 503 });
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName.startsWith('jp-')) {
          console.log('🗑️ Clearing cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
    console.log('✅ All caches cleared');
  } catch (error) {
    console.error('❌ Failed to clear caches:', error);
  }
}

// Service worker is now complete

/**
 * Helpers to decide strategy
 */
function isSameOrigin(req) {
  try { return new URL(req.url).origin === self.location.origin } catch { return false }
}
function isNavigation(req) { return req.mode === 'navigate' }
function isImage(req) {
  return req.destination === 'image' || /\.(?:png|jpg|jpeg|webp|avif|gif|svg)$/i.test(req.url)
}
function isStaticAsset(req) {
  if (!isSameOrigin(req)) return false
  return /\.(?:css|js|mjs|woff2?|ttf|otf|json)$/i.test(req.url)
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Bypass non-GET
  if (req.method !== 'GET') return;

  // Images: Cache First
  if (isImage(req)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req, { mode: 'no-cors' in Request.prototype ? undefined : undefined });
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        } catch (e) {
          return cached || fetch(req);
        }
      })
    );
    return;
  }

  // Static assets: Cache First
  if (isStaticAsset(req)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // Navigations and dynamic requests: Network First with fallback
  if (isNavigation(req) || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then(async (res) => {
        const cache = await caches.open(DYNAMIC_CACHE);
        try { cache.put(req, res.clone()) } catch {}
        return res;
      }).catch(async () => {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cached = await cache.match(req);
        return cached || caches.match('/') || new Response('Offline', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // Default: try cache, fall back to network
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
