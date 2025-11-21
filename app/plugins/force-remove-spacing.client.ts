/**
 * Force Remove Spacing Plugin
 * Menghilangkan space antara header dan banner secara programmatic
 * Runs on client-side only
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on mobile
  if (typeof window === 'undefined') return

  const removeSpacing = () => {
    // Check if mobile
    if (window.innerWidth > 768) return

    try {
      const header = document.querySelector('header')
      const main = document.querySelector('main')
      const banner = document.querySelector('[data-net-mode]')
      const bannerContainer = document.querySelector('.banner-container-zero')

      // Force remove spacing on header - EXTREME MODE
      if (header) {
        header.style.marginBottom = '-8px'
        header.style.paddingBottom = '0'
      }

      // Force remove spacing on main - EXTREME PULL UP
      if (main) {
        main.style.marginTop = '-10px'
        main.style.paddingTop = '0'
        main.style.transform = 'translateY(-6px)'
        
        // Also first child
        const firstChild = main.firstElementChild
        if (firstChild) {
          (firstChild as HTMLElement).style.marginTop = '-8px'
          (firstChild as HTMLElement).style.paddingTop = '0'
          (firstChild as HTMLElement).style.transform = 'translateY(-5px)'
        }
      }

      // Force remove spacing on banner - EXTREME PULL UP
      if (banner) {
        banner.style.marginTop = '-10px'
        banner.style.paddingTop = '0'
        banner.style.transform = 'translateY(-6px)'
      }

      if (bannerContainer) {
        bannerContainer.style.marginTop = '-10px'
        bannerContainer.style.paddingTop = '0'
        bannerContainer.style.transform = 'translateY(-6px)'
      }

      // Remove all Tailwind spacing classes that might cause issues
      const elements = document.querySelectorAll('[class*="pt-"], [class*="mt-"], [class*="sm:pt"], [class*="sm:mt"]')
      elements.forEach(el => {
        if (el instanceof HTMLElement && el.closest('main')) {
          el.style.paddingTop = '0'
          el.style.marginTop = '0'
        }
      })
    } catch (error) {
      console.error('Force remove spacing error:', error)
    }
  }

  // Run on mount
  nuxtApp.hook('app:mounted', () => {
    removeSpacing()
    
    // Run again after short delay to catch dynamic content
    setTimeout(removeSpacing, 100)
    setTimeout(removeSpacing, 300)
    setTimeout(removeSpacing, 500)
  })

  // Run on page transition
  nuxtApp.hook('page:finish', () => {
    setTimeout(removeSpacing, 50)
  })

  // Run on window resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        removeSpacing()
      }
    })
  }
})

