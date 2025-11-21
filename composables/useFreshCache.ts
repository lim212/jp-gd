/**
 * Use Fresh Cache Composable
 * Utility untuk memastikan selalu mendapat versi terbaru
 */

export const useFreshCache = () => {
  const getCacheVersion = () => {
    if (typeof window === 'undefined') return Date.now().toString()
    
    // Generate version berdasarkan timestamp
    const now = new Date()
    const version = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
    
    return version
  }

  const addCacheBuster = (url: string) => {
    if (!url) return url
    
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}_v=${getCacheVersion()}`
  }

  const forceReloadPage = () => {
    if (typeof window === 'undefined') return
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }

    // Clear localStorage cache markers
    try {
      localStorage.removeItem('app_cache_version')
      localStorage.removeItem('nuxt_cache')
    } catch (e) {
      console.warn('Failed to clear cache:', e)
    }

    // Reload dengan cache busting
    const url = new URL(window.location.href)
    url.searchParams.set('_nocache', Date.now().toString())
    window.location.href = url.toString()
  }

  const reloadCSS = () => {
    if (typeof window === 'undefined') return
    
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    links.forEach((link: any) => {
      const href = link.href.split('?')[0]
      link.href = addCacheBuster(href)
    })
  }

  const checkForUpdates = async () => {
    if (typeof window === 'undefined') return false
    
    try {
      const response = await fetch('/_app_version.json', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      const data = await response.json()
      const currentVersion = localStorage.getItem('app_deployed_version')
      
      if (currentVersion && currentVersion !== data.version) {
        console.log('🔄 New version available:', data.version)
        return true
      }
      
      if (!currentVersion) {
        localStorage.setItem('app_deployed_version', data.version)
      }
      
      return false
    } catch (error) {
      console.warn('Failed to check for updates:', error)
      return false
    }
  }

  return {
    getCacheVersion,
    addCacheBuster,
    forceReloadPage,
    reloadCSS,
    checkForUpdates
  }
}

