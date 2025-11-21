// composables/useAccessibility.ts
// Accessibility improvements for better UX

import { onMounted, onBeforeUnmount, ref } from 'vue'

export const useAccessibility = () => {
  const isKeyboardUser = ref(false)

  // Detect keyboard navigation
  const detectKeyboardUser = () => {
    if (typeof window === 'undefined') return

    const handleFirstTab = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        isKeyboardUser.value = true
        document.body.classList.add('keyboard-user')
        window.removeEventListener('keydown', handleFirstTab)
      }
    }

    const handleMouseDown = () => {
      isKeyboardUser.value = false
      document.body.classList.remove('keyboard-user')
    }

    window.addEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleFirstTab)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }

  // Skip to main content
  const addSkipToContent = () => {
    if (typeof window === 'undefined') return

    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.className = 'skip-to-content'
    skipLink.textContent = 'Skip to main content'
    skipLink.setAttribute('aria-label', 'Skip to main content')
    
    const style = document.createElement('style')
    style.textContent = `
      .skip-to-content {
        position: absolute;
        top: -100px;
        left: 0;
        padding: 1rem 1.5rem;
        background: #3b82f6;
        color: white;
        text-decoration: none;
        font-weight: 600;
        z-index: 10000;
        border-radius: 0 0 0.5rem 0;
      }
      .skip-to-content:focus {
        top: 0;
        outline: 3px solid #fbbf24;
        outline-offset: 2px;
      }
    `
    
    document.head.appendChild(style)
    document.body.insertBefore(skipLink, document.body.firstChild)
  }

  // Improve focus visibility
  const improveFocusVisibility = () => {
    if (typeof window === 'undefined') return

    const style = document.createElement('style')
    style.textContent = `
      /* Keyboard user focus styles */
      .keyboard-user *:focus {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
      }

      /* Button focus */
      .keyboard-user button:focus {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }

      /* Link focus */
      .keyboard-user a:focus {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px !important;
        text-decoration: underline !important;
      }

      /* Input focus */
      .keyboard-user input:focus,
      .keyboard-user textarea:focus,
      .keyboard-user select:focus {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px !important;
        border-color: #3b82f6 !important;
      }

      /* Dark mode focus */
      .dark.keyboard-user *:focus {
        outline-color: #60a5fa !important;
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.3) !important;
      }
    `
    
    document.head.appendChild(style)
  }

  // Add ARIA live regions
  const addAriaLiveRegion = (id: string = 'aria-live-region') => {
    if (typeof window === 'undefined') return

    const existingRegion = document.getElementById(id)
    if (existingRegion) return

    const liveRegion = document.createElement('div')
    liveRegion.id = id
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    
    const style = document.createElement('style')
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(liveRegion)
  }

  // Announce message to screen readers
  const announceMessage = (message: string, id: string = 'aria-live-region') => {
    if (typeof window === 'undefined') return

    const liveRegion = document.getElementById(id)
    if (liveRegion) {
      liveRegion.textContent = message
      
      // Clear after 5 seconds
      setTimeout(() => {
        liveRegion.textContent = ''
      }, 5000)
    }
  }

  // Add keyboard navigation
  const enableKeyboardNavigation = (selector: string) => {
    if (typeof window === 'undefined') return

    const elements = document.querySelectorAll(selector)
    
    elements.forEach((element, index) => {
      const el = element as HTMLElement
      
      // Make focusable if not already
      if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
        el.setAttribute('tabindex', '0')
      }

      // Add keyboard event listeners
      el.addEventListener('keydown', (event: KeyboardEvent) => {
        // Enter or Space to activate
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          el.click()
        }

        // Arrow key navigation
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault()
          const nextElement = elements[index + 1] as HTMLElement
          if (nextElement) nextElement.focus()
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault()
          const prevElement = elements[index - 1] as HTMLElement
          if (prevElement) prevElement.focus()
        }

        // Home/End keys
        if (event.key === 'Home') {
          event.preventDefault()
          const firstElement = elements[0] as HTMLElement
          if (firstElement) firstElement.focus()
        }

        if (event.key === 'End') {
          event.preventDefault()
          const lastElement = elements[elements.length - 1] as HTMLElement
          if (lastElement) lastElement.focus()
        }
      })
    })
  }

  // Ensure proper heading hierarchy
  const checkHeadingHierarchy = () => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1))
      
      if (previousLevel > 0 && level > previousLevel + 1) {
        console.warn(`Heading hierarchy skip detected: ${heading.tagName} follows h${previousLevel}`, heading)
      }
      
      previousLevel = level
    })
  }

  // Generate unique IDs for elements
  const generateId = (prefix: string = 'element') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Add alt text suggestions
  const checkImageAltText = () => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

    const images = document.querySelectorAll('img')
    
    images.forEach(img => {
      if (!img.alt || img.alt.trim() === '') {
        console.warn('Image missing alt text:', img)
      }
    })
  }

  onMounted(() => {
    detectKeyboardUser()
    addSkipToContent()
    improveFocusVisibility()
    addAriaLiveRegion()
    
    // Development checks
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        checkHeadingHierarchy()
        checkImageAltText()
      }, 1000)
    }
  })

  return {
    isKeyboardUser,
    detectKeyboardUser,
    addSkipToContent,
    improveFocusVisibility,
    addAriaLiveRegion,
    announceMessage,
    enableKeyboardNavigation,
    checkHeadingHierarchy,
    generateId,
    checkImageAltText
  }
}

