/**
 * Smart Cache Buster Plugin
 * Memastikan setiap klien selalu mendapat versi terbaru
 * Menambahkan unique identifier di setiap request
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Generate unique cache buster berdasarkan timestamp
  const generateCacheBuster = () => {
    const now = new Date()
    const timestamp = now.getTime()
    const dateStr = now.toISOString().split('T')[0]
    const hourMin = `${now.getHours()}${now.getMinutes()}`
    
    return {
      t: timestamp, // Timestamp penuh
      v: `${dateStr}-${hourMin}`, // Version berformat tanggal-jam
      r: Math.random().toString(36).substring(7) // Random string
    }
  }

  // Simpan cache buster di localStorage dengan TTL
  const getCacheBusterFromStorage = () => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem('app_cache_version')
      if (stored) {
        const data = JSON.parse(stored)
        const now = Date.now()
        // Refresh setiap 5 menit
        if (now - data.created < 300000) {
          return data.version
        }
      }
    } catch (e) {
      console.warn('Cache buster storage error:', e)
    }
    return null
  }

  const setCacheBusterToStorage = (version: string) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('app_cache_version', JSON.stringify({
        version,
        created: Date.now()
      }))
    } catch (e) {
      console.warn('Cache buster storage error:', e)
    }
  }

  // Get or create cache buster
  let cacheBuster = getCacheBusterFromStorage()
  if (!cacheBuster) {
    const cb = generateCacheBuster()
    cacheBuster = `${cb.v}-${cb.r}`
    setCacheBusterToStorage(cacheBuster)
  }

  // Add to global state
  if (typeof window !== 'undefined') {
    (window as any).__CACHE_VERSION__ = cacheBuster
  }

  // Inject ke Nuxt app
  nuxtApp.provide('cacheBuster', cacheBuster)

  // Force reload assets jika ada perubahan
  if (typeof window !== 'undefined') {
    const checkForUpdates = () => {
      // Check if there's a new version from server
      fetch('/_app_version.json', { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then(res => res.json())
        .then(data => {
          const serverVersion = data.version
          const currentVersion = localStorage.getItem('app_deployed_version')
          
          if (currentVersion && currentVersion !== serverVersion) {
            console.log('🔄 New version detected, reloading...')
            localStorage.setItem('app_deployed_version', serverVersion)
            
            // Clear cache dan reload
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => caches.delete(name))
              })
            }
            
            // Reload dengan timestamp untuk bypass cache
            window.location.href = window.location.pathname + '?_refresh=' + Date.now()
          } else if (!currentVersion) {
            localStorage.setItem('app_deployed_version', serverVersion)
          }
        })
        .catch(() => {
          // Ignore errors silently
        })
    }

    // Check on page load
    setTimeout(checkForUpdates, 2000)
    
    // Check setiap 5 menit
    setInterval(checkForUpdates, 300000)
  }

  // Intercept router navigation untuk add cache buster
  nuxtApp.hook('page:finish', () => {
    if (typeof window === 'undefined') return
    
    // Force reload CSS jika stuck
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    links.forEach((link: any) => {
      if (!link.href.includes('_cb=')) {
        const url = new URL(link.href)
        url.searchParams.set('_cb', cacheBuster as string)
        link.href = url.toString()
      }
    })
  })

  console.log('✅ Smart Cache Buster Active:', cacheBuster)
})

