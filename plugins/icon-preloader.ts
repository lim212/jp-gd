// Icon Preloader Plugin
// This plugin ensures that commonly used icons are preloaded to prevent timeout warnings

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (import.meta.server) return

  // Function to preload specific icons
  const preloadIcons = async () => {
    try {
      // Respect low-end and smart-mode: skip heavy preloading
      const d = document.documentElement
      const isLowEnd = d.classList.contains('low-end') || d.getAttribute('data-low-end') === '1'
      const isSmart = d.classList.contains('smart-mode') || d.getAttribute('data-smart-mode') === '1'

      // Icons to preload by collection (reduced set for low-end/smart)
      const iconsToPreload = {
        lucide: isLowEnd || isSmart ? [
          'chevron-down','chevron-up','menu','clock','phone-call'
        ] : [
          'trending-up',
          'chevron-down',
          'arrow-up-right',
          'languages',
          'menu',
          'chevron-up',
          'hash',
          'clock',
          'file-text',
          'map-pin',
          'phone-call',
          'minus',
          'calendar',
          'globe',
          'credit-card',
          'shopping-cart',
          'sun',
          'moon',
          'home',
          'arrow-left',
          'arrow-left-circle',
          'arrow-right-circle'
        ],
        'fa-solid': (isLowEnd || isSmart) ? ['user','calendar','clock'] : ['user', 'calendar', 'clock', 'book-open', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right', 'comments-dollar', 'clipboard-check'],
        'simple-icons': ['whatsapp'],
        'heroicons': (isLowEnd || isSmart) ? ['information-circle'] : ['information-circle', 'sun-20-solid', 'moon-20-solid'],
        'mdi': ['whatsapp', 'paypal', 'credit-card', 'information-outline', 'certificate-outline', 'file-document-outline'],
        'circle-flags': ['id', 'us']
      }

      // Helper function to create a hidden container for an icon
      const createIconContainer = (collection, iconName) => {
        const iconContainer = document.createElement('div')
        iconContainer.style.position = 'absolute'
        iconContainer.style.width = '0'
        iconContainer.style.height = '0'
        iconContainer.style.overflow = 'hidden'
        iconContainer.style.visibility = 'hidden'

        // Add the icon element with the proper format
        iconContainer.innerHTML = `<span class="i-${collection}-${iconName}"></span>`

        // Append to body to trigger loading
        document.body.appendChild(iconContainer)

        // Fire and forget: also cache SVG locally via our API (best effort)
        // Use 'force-cache' to prioritize using cached version when available
        try {
          fetch(`/api/icon?name=${collection}:${iconName}`, {
            method: 'GET',
            cache: 'force-cache',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Cache-Control': 'max-age=31536000'
            }
          }).catch(() => {})
        } catch {}

        // Remove after a short delay
        setTimeout(() => {
          if (iconContainer.parentElement) {
            iconContainer.parentElement.removeChild(iconContainer)
          }
        }, 1500)
      }

      // Preload icons for each collection
      for (const [collection, icons] of Object.entries(iconsToPreload)) {
        for (const iconName of icons) {
          createIconContainer(collection, iconName)
        }
      }

      if (!(isLowEnd || isSmart)) {
        console.log('✅ Icons preloaded and cached locally (best effort)')
      }
    } catch (error) {
      console.error('❌ Failed to preload icons:', error)
    }
  }

  // Run on initial page load, but defer to idle time
  nuxtApp.hook('app:mounted', () => {
    const idle = (cb) => {
      try {
        if ((window as any).requestIdleCallback) {
          (window as any).requestIdleCallback(cb, { timeout: 2000 })
        } else {
          setTimeout(cb, 400)
        }
      } catch {
        setTimeout(cb, 400)
      }
    }
    idle(() => {
      // On very low-end, delay a bit more to not compete with interaction
      const d = document.documentElement
      const isLowEnd = d.classList.contains('low-end') || d.getAttribute('data-low-end') === '1'
      setTimeout(preloadIcons, isLowEnd ? 1200 : 200)
    })
  })

  // Provide a method to manually trigger preloading
  return {
    provide: {
      preloadIcons
    }
  }
})
