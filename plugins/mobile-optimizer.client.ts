// plugins/mobile-optimizer.client.ts
// Mobile and touch optimization tanpa mengubah design atau fungsi

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  class MobileOptimizer {
    private isMobile = false
    private isTouch = false
    private viewportHeight = 0
    private keyboardHeight = 0

    constructor() {
      this.init()
    }

    private init() {
      // Detect mobile and touch capabilities
      this.detectMobileAndTouch()
      
      // Setup mobile-specific optimizations
      this.setupMobileOptimizations()
      
      // Setup touch optimizations
      this.setupTouchOptimizations()
      
      // Setup viewport handling
      this.setupViewportHandling()
      
      // Make globally available
      this.setupGlobalAPI()
    }

    private detectMobileAndTouch() {
      // Detect mobile device
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.innerWidth <= 768 ||
                     'ontouchstart' in window

      // Detect touch capability
      this.isTouch = 'ontouchstart' in window || 
                    navigator.maxTouchPoints > 0 ||
                    (navigator as any).msMaxTouchPoints > 0

      console.log('📱 Mobile:', this.isMobile)
      console.log('👆 Touch:', this.isTouch)
    }

    private setupMobileOptimizations() {
      if (!this.isMobile) return

      // Add mobile class to body
      document.body.classList.add('mobile-device')

      // Optimize images for mobile
      this.optimizeImagesForMobile()
      
      // Optimize fonts for mobile
      this.optimizeFontsForMobile()
      
      // Setup mobile-specific event handling
      this.setupMobileEventHandling()
      
      // Optimize scrolling for mobile
      this.optimizeScrollingForMobile()
    }

    private optimizeImagesForMobile() {
      // Lazy load images with mobile-optimized settings
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadMobileOptimizedImage(img)
            imageObserver.unobserve(img)
          }
        })
      }, {
        rootMargin: '100px 0px', // Larger margin for mobile
        threshold: 0.1
      })

      images.forEach(img => imageObserver.observe(img))
    }

    private loadMobileOptimizedImage(img: HTMLImageElement) {
      const src = img.dataset.src
      if (!src) return

      // Add loading class
      img.classList.add('loading')
      
      // Create new image element for preloading
      const newImg = new Image()
      newImg.onload = () => {
        img.src = src
        img.classList.remove('loading')
        img.classList.add('loaded')
      }
      newImg.onerror = () => {
        img.classList.remove('loading')
        img.classList.add('error')
      }
      newImg.src = src
    }

    private optimizeFontsForMobile() {
      // Add mobile-optimized font loading
      const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]')
      fontLinks.forEach(link => {
        link.setAttribute('media', 'print')
        link.setAttribute('onload', "this.media='all'")
      })
    }

    private setupMobileEventHandling() {
      // Optimize click events for mobile
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        
        // Add haptic feedback for buttons
        if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
          this.triggerHapticFeedback()
        }
        
        // Optimize link clicks
        if (target.tagName === 'A') {
          this.optimizeLinkClick(target as HTMLAnchorElement)
        }
      }, { passive: true })

      // Optimize form interactions
      const forms = document.querySelectorAll('form')
      forms.forEach(form => {
        form.addEventListener('submit', (event) => {
          this.optimizeFormSubmission(form)
        })
      })
    }

    private triggerHapticFeedback() {
      if ('vibrate' in navigator) {
        navigator.vibrate(10) // Short vibration
      }
    }

    private optimizeLinkClick(link: HTMLAnchorElement) {
      // Add loading state for navigation
      if (link.href && !link.href.startsWith('#') && !link.href.startsWith('javascript:')) {
        link.classList.add('navigating')
        
        // Remove loading state after a delay
        setTimeout(() => {
          link.classList.remove('navigating')
        }, 1000)
      }
    }

    private optimizeFormSubmission(form: HTMLFormElement) {
      // Add loading state to form
      form.classList.add('submitting')
      
      // Disable submit button
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'Mengirim...'
      }
    }

    private optimizeScrollingForMobile() {
      // Add smooth scrolling for mobile
      document.documentElement.style.scrollBehavior = 'smooth'
      
      // Optimize scroll performance
      let scrollTimeout: number | undefined
      window.addEventListener('scroll', () => {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }
        
        scrollTimeout = window.setTimeout(() => {
          // Add scroll-based optimizations here
          this.handleScrollOptimization()
        }, 100)
      }, { passive: true })
    }

    private handleScrollOptimization() {
      // Hide/show elements based on scroll position
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Add scroll-based classes
      if (scrollY > 100) {
        document.body.classList.add('scrolled')
      } else {
        document.body.classList.remove('scrolled')
      }
      
      // Optimize images in viewport
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        const rect = img.getBoundingClientRect()
        if (rect.top < windowHeight && rect.bottom > 0) {
          // Image is in viewport, load it
          this.loadMobileOptimizedImage(img as HTMLImageElement)
        }
      })
    }

    private setupTouchOptimizations() {
      if (!this.isTouch) return

      // Add touch class to body
      document.body.classList.add('touch-device')

      // Setup touch event handling
      this.setupTouchEventHandling()
      
      // Optimize touch targets
      this.optimizeTouchTargets()
      
      // Setup gesture handling
      this.setupGestureHandling()
    }

    private setupTouchEventHandling() {
      // Add touch feedback
      document.addEventListener('touchstart', (event) => {
        const target = event.target as HTMLElement
        
        // Add touch feedback class
        if (target.tagName === 'BUTTON' || target.classList.contains('btn') || target.tagName === 'A') {
          target.classList.add('touch-active')
        }
      }, { passive: true })

      document.addEventListener('touchend', (event) => {
        const target = event.target as HTMLElement
        
        // Remove touch feedback class
        target.classList.remove('touch-active')
      }, { passive: true })
    }

    private optimizeTouchTargets() {
      // Ensure touch targets are at least 44px
      const touchTargets = document.querySelectorAll('button, a, input, select, textarea, [role="button"]')
      touchTargets.forEach(target => {
        const element = target as HTMLElement
        const rect = element.getBoundingClientRect()
        
        if (rect.width < 44 || rect.height < 44) {
          element.style.minWidth = '44px'
          element.style.minHeight = '44px'
        }
      })
    }

    private setupGestureHandling() {
      // Setup swipe gestures
      let startX = 0
      let startY = 0
      
      document.addEventListener('touchstart', (event) => {
        const touch = event.touches[0]
        startX = touch.clientX
        startY = touch.clientY
      }, { passive: true })

      document.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0]
        const endX = touch.clientX
        const endY = touch.clientY
        
        const diffX = startX - endX
        const diffY = startY - endY
        
        // Detect swipe gestures
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
              this.handleSwipeLeft()
            } else {
              this.handleSwipeRight()
            }
          }
        } else {
          if (Math.abs(diffY) > 50) {
            if (diffY > 0) {
              this.handleSwipeUp()
            } else {
              this.handleSwipeDown()
            }
          }
        }
      }, { passive: true })
    }

    private handleSwipeLeft() {
      console.log('👆 Swipe left detected')
      // Add swipe left functionality
    }

    private handleSwipeRight() {
      console.log('👆 Swipe right detected')
      // Add swipe right functionality
    }

    private handleSwipeUp() {
      console.log('👆 Swipe up detected')
      // Add swipe up functionality
    }

    private handleSwipeDown() {
      console.log('👆 Swipe down detected')
      // Add swipe down functionality
    }

    private setupViewportHandling() {
      // Handle viewport changes
      this.viewportHeight = window.innerHeight
      
      window.addEventListener('resize', () => {
        const newHeight = window.innerHeight
        const heightDiff = this.viewportHeight - newHeight
        
        // Detect keyboard appearance
        if (heightDiff > 150) {
          this.keyboardHeight = heightDiff
          document.body.classList.add('keyboard-open')
        } else {
          this.keyboardHeight = 0
          document.body.classList.remove('keyboard-open')
        }
        
        this.viewportHeight = newHeight
      })

      // Handle orientation changes
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.viewportHeight = window.innerHeight
          document.body.classList.add('orientation-changing')
          
          setTimeout(() => {
            document.body.classList.remove('orientation-changing')
          }, 500)
        }, 100)
      })
    }

    private setupGlobalAPI() {
      // Make mobile optimizer globally available
      ;(window as any).mobileOptimizer = {
        isMobile: () => this.isMobile,
        isTouch: () => this.isTouch,
        getViewportHeight: () => this.viewportHeight,
        getKeyboardHeight: () => this.keyboardHeight,
        triggerHapticFeedback: () => this.triggerHapticFeedback()
      }
    }
  }

  // Initialize mobile optimizer
  new MobileOptimizer()
})
