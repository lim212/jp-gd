<template>
  <div class="modern-banner-container">
    <div class="banner-hero-shell">
      <div class="banner-aurora">
        <span class="aurora-layer layer-1"></span>
        <span class="aurora-layer layer-2"></span>
        <span class="aurora-layer layer-3"></span>
        <span class="orbit-ring ring-1"></span>
        <span class="orbit-ring ring-2"></span>
        <span class="floating-orb orb-1"></span>
        <span class="floating-orb orb-2"></span>
      </div>
      <div class="modern-banner-frame">
    <!-- Loading State - Modern Professional -->
    <div v-show="isLoading && smartLoadingMode" class="modern-banner-loading">
      <div class="loading-backdrop">
        <img src="/images/slider/JP-banner-slide-1.png" alt="Loading Banner" class="loading-bg-image" />
        <div class="loading-overlay"></div>
      </div>
      
      <!-- Modern Loading Content -->
      <div class="loading-content-center">
        <!-- Premium Spinner -->
        <div class="premium-spinner">
          <div class="spinner-circle spinner-1"></div>
          <div class="spinner-circle spinner-2"></div>
          <div class="spinner-circle spinner-3"></div>
          <div class="spinner-dot"></div>
        </div>
        
        <!-- Modern Progress Bar -->
        <div class="modern-progress-wrapper">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: loadingProgress + '%' }">
              <div class="progress-shine"></div>
            </div>
          </div>
          <div class="progress-info">
            <span class="progress-percent">{{ Math.round(loadingProgress) }}%</span>
            <span class="progress-time">{{ Math.round(loadingSeconds) }}s</span>
          </div>
        </div>
        
        <!-- Loading Message -->
        <p class="loading-message">Memuat Banner Premium...</p>
      </div>
      
      <!-- Navigation Placeholders -->
      <button class="nav-button nav-prev loading-state" disabled>
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button class="nav-button nav-next loading-state" disabled>
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Slide Counter -->
      <div class="slide-counter">
        <span class="counter-current">{{ currentSlideIndex + 1 }}</span>
        <span class="counter-divider">/</span>
        <span class="counter-total">{{ bannerImages.length }}</span>
      </div>
    </div>
    
    <!-- Modern Banner Slider -->
    <div v-show="!isLoading || !smartLoadingMode" class="modern-banner-slider">
      <div class="banner-stage" ref="bannerContainer">
        <!-- Main Banner Image -->
        <img
          :src="currentImage.src"
          :alt="currentImage.alt"
          class="banner-image"
          :class="{ 'image-blur': currentImageBlur && smartLoadingMode }"
          @load="onImageLoad"
          @error="onImageError"
          :style="{ display: imageLoaded ? 'block' : 'block' }"
        />
        
        <!-- Fallback Image -->
        <img
          v-if="!imageLoaded"
          src="/images/slider/JP-banner-slide-1.png"
          alt="Banner Fallback"
          class="banner-image banner-fallback"
        />
        
        <!-- Modern Navigation Buttons -->
        <button
          class="nav-button nav-prev"
          @click="prevSlide"
          @mouseenter="hoveredNav = 'prev'"
          @mouseleave="hoveredNav = null"
          aria-label="Slide sebelumnya"
        >
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="nav-ripple"></span>
        </button>
        
        <button
          class="nav-button nav-next"
          @click="nextSlide"
          @mouseenter="hoveredNav = 'next'"
          @mouseleave="hoveredNav = null"
          aria-label="Slide berikutnya"
        >
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span class="nav-ripple"></span>
        </button>
        
        <!-- Modern Slide Indicator -->
        <div class="slide-counter">
          <span class="counter-current">{{ currentSlideIndex + 1 }}</span>
          <span class="counter-divider">/</span>
          <span class="counter-total">{{ bannerImages.length }}</span>
        </div>
        
        <!-- Dot Indicators -->
        <div class="dot-indicators">
          <button
            v-for="(image, index) in bannerImages"
            :key="index"
            class="dot-indicator"
            :class="{ active: index === currentSlideIndex }"
            @click="goToSlide(index)"
            :aria-label="`Ke slide ${index + 1}`"
          >
            <span class="dot-inner"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'

interface BannerImage {
  src: string
  alt: string
  loaded: boolean
  aspect?: number
}

const bannerImages: BannerImage[] = [
  { src: '/images/slider/JP-banner-slide-1.png', alt: 'Banner 1', loaded: false },
  { src: '/images/slider/JP-banner-slide-3.png', alt: 'Banner 2', loaded: false },
  { src: '/images/slider/JP-banner-slide-4.png', alt: 'Banner 3', loaded: false },
  { src: '/images/slider/1-1723594725.jpg', alt: 'Banner 4', loaded: false },
  { src: '/images/slider/2-1723594715.jpg', alt: 'Banner 5', loaded: false },
  { src: '/images/slider/3-1723594702.jpg', alt: 'Banner 6', loaded: false },
  { src: '/images/slider/4-1723594641.jpg', alt: 'Banner 7', loaded: false }
]

const currentSlideIndex = ref(0)
const bannerContainer = ref<HTMLElement | null>(null)
const autoplayInterval = ref<NodeJS.Timeout | null>(null)
const isLoading = ref(false) // Start with false to show slider immediately
const imageLoaded = ref(true) // Start with true to show image immediately
const imageError = ref(false)
const loadingProgress = ref(0)
const loadingSeconds = ref(3)
const loadingInterval = ref<NodeJS.Timeout | null>(null)
const smartLoadingMode = ref(true)
const preloadedImages = ref<string[]>([])
const currentImageBlur = ref(false) // Start with false - no blur, show image immediately
const hoveredNav = ref<'prev' | 'next' | null>(null)

const currentImage = computed(() => {
  return bannerImages[currentSlideIndex.value] || bannerImages[0]
})

const nextSlide = () => {
  const nextIndex = (currentSlideIndex.value + 1) % bannerImages.length
  currentSlideIndex.value = nextIndex
  
  if (smartLoadingMode.value) {
    // Check if image is preloaded
    if (bannerImages[nextIndex]?.loaded) {
      currentImageBlur.value = false
    } else {
      currentImageBlur.value = true
      // Load image on demand
      preloadImage(bannerImages[nextIndex]?.src || '').then(() => {
        if (bannerImages[nextIndex]) {
          bannerImages[nextIndex].loaded = true
        }
        currentImageBlur.value = false
      }).catch(error => {
        console.error('Failed to load image:', error)
      })
    }
  } else {
    resetImageState()
  }
}

const prevSlide = () => {
  const prevIndex = currentSlideIndex.value === 0 ? bannerImages.length - 1 : currentSlideIndex.value - 1
  currentSlideIndex.value = prevIndex
  
  if (smartLoadingMode.value) {
    // Check if image is preloaded
    if (bannerImages[prevIndex]?.loaded) {
      currentImageBlur.value = false
    } else {
      currentImageBlur.value = true
      // Load image on demand
      preloadImage(bannerImages[prevIndex]?.src || '').then(() => {
        if (bannerImages[prevIndex]) {
          bannerImages[prevIndex].loaded = true
        }
        currentImageBlur.value = false
      }).catch(error => {
        console.error('Failed to load image:', error)
      })
    }
  } else {
    resetImageState()
  }
}

const resetImageState = () => {
  imageLoaded.value = false
  imageError.value = false
  isLoading.value = true
  loadingProgress.value = 0
  loadingSeconds.value = 3
}

const startLoadingProgress = () => {
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
  }
  
  loadingProgress.value = 0
  loadingSeconds.value = 3
  
  loadingInterval.value = setInterval(() => {
    loadingProgress.value += 3
    loadingSeconds.value = Math.max(0, loadingSeconds.value - 0.15)
    
    if (loadingProgress.value >= 100) {
      clearInterval(loadingInterval.value!)
      loadingInterval.value = null
      // Force show image after loading
      setTimeout(() => {
        if (!imageLoaded.value) {
          imageLoaded.value = true
          isLoading.value = false
        }
      }, 500)
    }
  }, 50)
}

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      preloadedImages.value.push(src)
      const banner = bannerImages.find(image => image.src === src)
      if (banner && img.naturalWidth && img.naturalHeight) {
        banner.aspect = img.naturalWidth / img.naturalHeight
      }
      resolve()
    }
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

const startSmartLoading = async () => {
  console.log('Starting smart loading mode...')
  
  // FORCE MODERN VIEW IMMEDIATELY - no delay, no waiting
  isLoading.value = false
  imageLoaded.value = true
  currentImageBlur.value = false
  
  // Set timeout to ensure slider always shows even if images fail to load
  const maxLoadTime = 100 // 0.1 seconds max - instant!
  const loadTimeout = setTimeout(() => {
    if (isLoading.value) {
      console.warn('⚠️ Banner loading timeout, showing slider anyway')
      isLoading.value = false
      imageLoaded.value = true
      currentImageBlur.value = false
    }
  }, maxLoadTime)
  
  // Load first image immediately (non-blocking)
  try {
    if (bannerImages[0]) {
      preloadImage(bannerImages[0].src).then(() => {
        bannerImages[0].loaded = true
        currentImageBlur.value = false
        console.log('First image loaded successfully')
        clearTimeout(loadTimeout)
      }).catch(error => {
        console.error('Failed to load first image:', error)
        clearTimeout(loadTimeout)
      })
    } else {
      // No images, show slider immediately
      clearTimeout(loadTimeout)
    }
  } catch (error) {
    console.error('Failed to start loading:', error)
    clearTimeout(loadTimeout)
  }
  
  // Preload other images in background (non-blocking)
  Promise.all(
    bannerImages.slice(1).map(async (img, index) => {
      try {
        if (img) {
          await preloadImage(img.src)
          const actualIndex = index + 1
          if (bannerImages[actualIndex]) {
            bannerImages[actualIndex].loaded = true
          }
          console.log(`Image ${actualIndex + 1} preloaded successfully`)
        }
      } catch (error) {
        console.error(`Failed to preload image ${index + 2}:`, error)
      }
    })
  ).catch(() => {
    // Ignore background preload errors
  })
}

const startAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  autoplayInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const goToSlide = (index: number) => {
  currentSlideIndex.value = index
  
  if (smartLoadingMode.value) {
    if (bannerImages[index]?.loaded) {
      currentImageBlur.value = false
    } else {
      currentImageBlur.value = true
      preloadImage(bannerImages[index]?.src || '').then(() => {
        if (bannerImages[index]) {
          bannerImages[index].loaded = true
        }
        currentImageBlur.value = false
      }).catch(error => {
        console.error('Failed to load image:', error)
      })
    }
  } else {
    resetImageState()
  }
}

const applyBannerAspect = (aspect?: number) => {
  if (!bannerContainer.value) return
  const ratio = aspect && Number.isFinite(aspect) && aspect > 0 ? aspect : 16 / 9
  bannerContainer.value.style.setProperty('--banner-mobile-aspect', `${ratio}`)
}

const onImageLoad = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (target?.naturalWidth && target.naturalHeight) {
    const aspect = target.naturalWidth / target.naturalHeight
    const current = bannerImages[currentSlideIndex.value]
    if (current) {
      current.aspect = aspect
    }
    applyBannerAspect(aspect)
  } else if (bannerImages[currentSlideIndex.value]?.aspect) {
    applyBannerAspect(bannerImages[currentSlideIndex.value]?.aspect)
  }
  console.log('Image loaded successfully:', currentImage.value?.src)
  imageLoaded.value = true
  imageError.value = false
  isLoading.value = false
  loadingProgress.value = 100
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
    loadingInterval.value = null
  }
}

const onImageError = () => {
  console.log('Image failed to load:', currentImage.value?.src)
  imageError.value = true
  isLoading.value = false
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
    loadingInterval.value = null
  }
  // Try next image after a short delay
  setTimeout(() => {
    nextSlide()
  }, 1000)
}

onMounted(() => {
  // FORCE MODERN VIEW IMMEDIATELY - no delay
  isLoading.value = false
  imageLoaded.value = true
  currentImageBlur.value = false
  
  // Ensure slider always shows - fallback timeout (backup only)
  const fallbackTimeout = setTimeout(() => {
    if (isLoading.value) {
      console.warn('⚠️ Banner slider fallback: forcing display')
      isLoading.value = false
      imageLoaded.value = true
      currentImageBlur.value = false
    }
  }, 500) // 0.5 seconds max - very fast fallback
  
  if (smartLoadingMode.value) {
    // Start smart loading mode
    startSmartLoading().finally(() => {
      clearTimeout(fallbackTimeout)
    })
    
    // Start autoplay after first image loads
    setTimeout(() => {
      startAutoplay()
    }, 500)
  } else {
    // Start loading progress
    startLoadingProgress()
    
    // Force load first image
    console.log('Loading first image:', currentImage.value?.src)
    
    // Initial loading with timeout
    const loadingTimeout = setTimeout(() => {
      if (isLoading.value) {
        isLoading.value = false
        imageLoaded.value = true
      }
    }, 3000)
    
    // Initial loading
    setTimeout(() => {
      clearTimeout(loadingTimeout)
      startAutoplay()
    }, 1000)
  }
  
  watch(currentSlideIndex, () => {
    nextTick(() => {
      const aspect = bannerImages[currentSlideIndex.value]?.aspect
      if (aspect) {
        applyBannerAspect(aspect)
      }
    })
  }, { immediate: true })
})

onBeforeUnmount(() => {
  stopAutoplay()
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value)
    loadingInterval.value = null
  }
})
</script>

<style scoped>
/* ===================================
   MODERN PROFESSIONAL BANNER SLIDER
   Super Responsive & Keren
   =================================== */

/* Main Container */
.modern-banner-container {
  width: 100%;
  max-width: 100%;
  position: relative;
  margin: 0 !important;
  padding: clamp(0.75rem, 2vw, 1.75rem) clamp(0.5rem, 2.5vw, 2rem);
  box-sizing: border-box;
  overflow: visible;
  background: transparent;
}

.banner-hero-shell {
  position: relative;
  width: 100%;
  padding: clamp(0.4rem, 1.8vw, 1.2rem);
  border-radius: clamp(1.65rem, 3vw, 3rem);
  isolation: isolate;
}

.banner-aurora {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 25px 60px rgba(15, 23, 42, 0.35));
}

.banner-aurora::before {
  content: '';
  position: absolute;
  inset: clamp(0.1rem, 0.5vw, 0.35rem);
  background: linear-gradient(120deg, rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.2));
  border-radius: clamp(1.65rem, 3vw, 3rem);
  clip-path: polygon(0% 22%, 7% 2%, 58% 6%, 100% 0%, 100% 78%, 92% 100%, 38% 94%, 0% 100%);
  opacity: 0.85;
  backdrop-filter: blur(40px);
}

.aurora-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  filter: blur(20px);
  opacity: 0.7;
  animation: aurora-drift 14s ease-in-out infinite;
  mix-blend-mode: screen;
}

.aurora-layer.layer-1 {
  background: radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.8), transparent 55%);
}

.aurora-layer.layer-2 {
  background: radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.7), transparent 45%);
  animation-delay: -4s;
}

.aurora-layer.layer-3 {
  background: radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.75), transparent 60%);
  animation-delay: -8s;
}

.orbit-ring {
  position: absolute;
  width: 220px;
  height: 220px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  mix-blend-mode: screen;
  animation: orbit-spin 18s linear infinite;
}

.orbit-ring.ring-1 {
  top: -60px;
  right: 5%;
}

.orbit-ring.ring-2 {
  bottom: -40px;
  left: 8%;
  width: 280px;
  height: 280px;
}

.floating-orb {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(56, 189, 248, 0.2));
  box-shadow: 0 10px 30px rgba(56, 189, 248, 0.35);
  animation: float 8s ease-in-out infinite;
  mix-blend-mode: screen;
}

.floating-orb.orb-1 {
  top: 6%;
  left: 12%;
}

.floating-orb.orb-2 {
  bottom: 10%;
  right: 12%;
  animation-delay: -3s;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.85), rgba(248, 113, 113, 0.25));
  box-shadow: 0 12px 32px rgba(248, 113, 113, 0.35);
}

.modern-banner-frame {
  position: relative;
  width: 100%;
  margin: 0 auto;
  border-radius: clamp(1.8rem, 3vw, 3.25rem);
  padding: clamp(0.75rem, 2vw, 1.75rem);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.78), rgba(226, 232, 240, 0.55));
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 25px 80px rgba(15, 23, 42, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  overflow: visible;
  z-index: 5;
  backdrop-filter: blur(18px);
}

.dark .modern-banner-container {
  background: transparent;
}

.dark .modern-banner-frame {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.85), rgba(76, 29, 149, 0.65));
  border-color: rgba(99, 102, 241, 0.45);
  box-shadow:
    0 25px 80px rgba(2, 6, 23, 0.8),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.dark .banner-aurora::before {
  background: linear-gradient(130deg, rgba(14, 165, 233, 0.28), rgba(236, 72, 153, 0.28));
}

.dark .orbit-ring {
  border-color: rgba(96, 165, 250, 0.2);
}

.dark .floating-orb {
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.45);
}

/* ===================================
   LOADING STATE - MODERN & PROFESSIONAL
   =================================== */

.modern-banner-loading {
  position: relative;
  width: 100%;
  min-height: clamp(260px, 45vw, 520px);
  height: auto;
  max-height: clamp(360px, 60vh, 720px);
  margin: clamp(0.55rem, 2.6vw, 1rem) auto 0;
  padding: clamp(0.4rem, 1.8vw, 0.85rem) clamp(0.75rem, 2.4vw, 1.5rem) clamp(0.45rem, 2vw, 0.9rem);
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  box-shadow: 
    0 20px 60px rgba(102, 126, 234, 0.3),
    0 8px 24px rgba(118, 75, 162, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* FORCE DARK MODE LOADING - CRITICAL! */
:deep(.dark) .modern-banner-loading,
html.dark .modern-banner-loading,
.dark .modern-banner-loading {
  background: linear-gradient(135deg, #0D0D12 0%, #1A1A24 50%, #22222E 100%) !important;
  border-color: rgba(233, 30, 99, 0.35) !important;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(233, 30, 99, 0.15),
    0 0 40px rgba(233, 30, 99, 0.1) !important;
}

/* Loading Backdrop */
.loading-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.loading-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: blur(4px) brightness(0.4);
  opacity: 0.6;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.7) 0%, 
    rgba(118, 75, 162, 0.8) 50%, 
    rgba(240, 147, 251, 0.7) 100%
  );
  backdrop-filter: blur(8px);
  z-index: 2;
}

/* Loading Content Center */
.loading-content-center {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

/* Premium Spinner */
.premium-spinner {
  position: relative;
  width: 96px;
  height: 96px;
}

.spinner-circle {
  position: absolute;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #ffffff;
  border-right-color: rgba(255, 255, 255, 0.3);
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.spinner-1 {
  width: 96px;
  height: 96px;
  border-width: 4px;
  animation-duration: 1.5s;
}

.spinner-2 {
  width: 72px;
  height: 72px;
  top: 12px;
  left: 12px;
  border-width: 4px;
  border-top-color: #fbbf24;
  animation-duration: 2s;
  animation-direction: reverse;
}

.spinner-3 {
  width: 48px;
  height: 48px;
  top: 24px;
  left: 24px;
  border-width: 3px;
  border-top-color: #ec4899;
  animation-duration: 1.2s;
}

.spinner-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #fff, #fbbf24);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.5);
  animation: pulse-glow 1.5s ease-in-out infinite;
}

/* Modern Progress Wrapper */
.modern-progress-wrapper {
  width: 100%;
  max-width: 320px;
  z-index: 10;
}

.progress-track {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #fbbf24 50%, #ec4899 100%);
  border-radius: 10px;
  position: relative;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.progress-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%
  );
  animation: shimmer 2s ease-in-out infinite;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.progress-percent {
  color: #fbbf24;
  font-size: 1rem;
}

.progress-time {
  color: #ec4899;
  font-size: 0.875rem;
}

.loading-message {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
  margin: 0;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes aurora-drift {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.65; }
  50% { transform: translate3d(2%, -3%, 0) scale(1.05); opacity: 0.9; }
  100% { transform: translate3d(-1%, 2%, 0) scale(1); opacity: 0.65; }
}

@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -15px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* ===================================
   MODERN BANNER SLIDER - MAIN DESIGN
   =================================== */

.modern-banner-slider {
  width: 100%;
  max-width: 100%;
  position: relative;
  overflow: visible;
  background: transparent;
  border-radius: inherit;
  padding: 0;
  box-shadow: none;
}

.banner-stage {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  height: auto;
  min-height: auto;
  max-height: none;
  border-radius: clamp(1.15rem, 2.4vw, 2rem);
  overflow: hidden;
  background: transparent;
  border: none;
  box-shadow: none;
  transition: opacity 0.35s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* FORCE DARK MODE - CRITICAL! */
:deep(.dark) .banner-stage,
html.dark .banner-stage,
.dark .banner-stage {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* Tablet Landscape - Ukuran BESAR seperti jasapembayaran.com */
@media (min-width: 769px) and (max-width: 1024px) {
  .banner-stage {
    max-height: clamp(380px, 55vh, 540px) !important;
    min-height: clamp(320px, 45vh, 480px) !important;
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .modern-banner-loading {
    max-height: clamp(380px, 55vh, 540px) !important;
    min-height: clamp(320px, 45vh, 480px) !important;
    border-radius: 1rem;
  }
  
  .banner-image {
    height: auto !important;
    max-height: clamp(380px, 55vh, 540px) !important;
    width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    border-radius: 1rem;
  }
  
  .nav-button {
    width: 48px;
    height: 48px;
  }
  
  .slide-counter {
    padding: 9px 16px;
    font-size: 13px;
    bottom: 18px;
  }
  
  .dot-indicators {
    bottom: 18px;
    right: 18px;
  }
}

/* Desktop Small (1025px - 1279px) - Ukuran BESAR seperti jasapembayaran.com */
@media (min-width: 1025px) and (max-width: 1279px) {
  .banner-stage {
    max-height: clamp(420px, 58vh, 600px) !important;
    min-height: clamp(340px, 48vh, 520px) !important;
    border-radius: 1.125rem;
    overflow: hidden;
  }
  
  .modern-banner-loading {
    max-height: clamp(420px, 58vh, 600px) !important;
    min-height: clamp(340px, 48vh, 520px) !important;
    border-radius: 1.125rem;
  }
  
  .banner-image {
    height: auto !important;
    max-height: clamp(420px, 58vh, 600px) !important;
    width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    border-radius: 1.125rem;
  }
  
  .nav-button {
    width: 46px;
    height: 46px;
  }
  
  .slide-counter {
    padding: 9px 16px;
    font-size: 13px;
  }
}

/* Desktop Medium (1280px - 1439px) - Ukuran BESAR seperti jasapembayaran.com */
@media (min-width: 1280px) and (max-width: 1439px) {
  .banner-stage {
    max-height: clamp(460px, 60vh, 640px) !important;
    min-height: clamp(360px, 50vh, 540px) !important;
    border-radius: 1.125rem;
    overflow: hidden;
  }
  
  .modern-banner-loading {
    max-height: clamp(460px, 60vh, 640px) !important;
    min-height: clamp(360px, 50vh, 540px) !important;
    border-radius: 1.125rem;
  }
  
  .banner-image {
    height: auto !important;
    max-height: clamp(460px, 60vh, 640px) !important;
    width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    border-radius: 1.125rem;
  }
  
  .slide-counter {
    padding: 10px 18px;
    font-size: 14px;
  }
}

/* Desktop Large (1440px - 1919px) - Ukuran BESAR seperti jasapembayaran.com */
@media (min-width: 1440px) and (max-width: 1919px) {
  .banner-stage {
    max-height: clamp(500px, 62vh, 700px) !important;
    min-height: clamp(380px, 52vh, 560px) !important;
    border-radius: 1.25rem;
    overflow: hidden;
  }
  
  .modern-banner-loading {
    max-height: clamp(500px, 62vh, 700px) !important;
    min-height: clamp(380px, 52vh, 560px) !important;
    border-radius: 1.25rem;
  }
  
  .banner-image {
    height: auto !important;
    max-height: clamp(500px, 62vh, 700px) !important;
    width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    border-radius: 1.25rem;
  }
  
  .slide-counter {
    padding: 10px 18px;
    font-size: 14px;
  }
}

/* Desktop XL (≥1920px) - Ukuran BESAR seperti jasapembayaran.com */
@media (min-width: 1920px) {
  .banner-stage {
    max-height: clamp(540px, 64vh, 760px) !important;
    min-height: clamp(400px, 54vh, 600px) !important;
    border-radius: 1.25rem;
    overflow: hidden;
  }
  
  .modern-banner-loading {
    max-height: clamp(540px, 64vh, 760px) !important;
    min-height: clamp(400px, 54vh, 600px) !important;
    border-radius: 1.25rem;
  }
  
  .banner-image {
    height: auto !important;
    max-height: clamp(540px, 64vh, 760px) !important;
    width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    border-radius: 1.25rem;
  }
  
  .nav-button {
    width: 48px;
    height: 48px;
  }
  
  .slide-counter {
    padding: 11px 20px;
    font-size: 15px;
  }
}

.banner-stage:hover {
  transform: none;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.15);
  border-color: transparent;
}

/* Desktop - Efek modern dan keren - Responsive */
@media (min-width: 1025px) {
  .banner-stage {
    border-radius: 1.125rem;
    backdrop-filter: blur(10px);
  }
  
  .modern-banner-loading {
    border-radius: 1.125rem;
  }
  
  .banner-stage:hover {
    border-radius: 1.25rem;
  }
}

/* Banner Image - Cover agar gambar penuh */
.banner-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: clamp(360px, 60vh, 720px);
  object-fit: contain;
  object-position: center;
  border-radius: inherit;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.banner-image:hover {
  filter: brightness(1.02) contrast(1.08) saturate(1.08);
}

.banner-fallback {
  opacity: 0.85;
  filter: brightness(0.95) contrast(1.03);
}

.image-blur {
  filter: blur(12px) brightness(0.85);
  transform: none;
  transition: filter 0.6s ease;
}

/* ===================================
   MODERN NAVIGATION BUTTONS
   =================================== */

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 30;
  box-shadow: 
    0 10px 25px rgba(59, 130, 246, 0.15),
    0 4px 10px rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(12px);
}

/* FORCE DARK MODE NAV BUTTONS */
:deep(.dark) .nav-button,
html.dark .nav-button,
.dark .nav-button {
  background: linear-gradient(135deg, rgba(26, 26, 36, 0.95) 0%, rgba(34, 34, 46, 0.9) 100%) !important;
  border-color: rgba(233, 30, 99, 0.35) !important;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.6),
    0 4px 10px rgba(233, 30, 99, 0.25),
    0 0 20px rgba(233, 30, 99, 0.1) !important;
}

/* Desktop - Navigation buttons lebih kecil dan smooth */
@media (min-width: 1025px) {
  .nav-button {
    width: 44px;
    height: 44px;
  }
  
  .nav-prev {
    left: 16px;
  }
  
  .nav-next {
    right: 16px;
  }
}

.nav-button:not(.loading-state):hover {
  background: linear-gradient(135deg, #ffffff 0%, #eef2ff 100%);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 
    0 15px 35px rgba(59, 130, 246, 0.25),
    0 6px 15px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
}

/* Tablet - Hover effects lebih subtle */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav-button:not(.loading-state):hover {
    transform: translateY(-50%) scale(1.08);
  }
  
  .banner-stage:hover {
    transform: none;
  }
}

/* Desktop - Smooth hover transitions */
@media (min-width: 1025px) {
  .nav-button:not(.loading-state):hover {
    transform: translateY(-50%) scale(1.12);
  }
  
  .banner-stage:hover {
    transform: none;
  }
}

.nav-button:not(.loading-state):active {
  transform: translateY(-50%) scale(1.05);
}

.nav-button.loading-state {
  background: rgba(255, 255, 255, 0.6);
  cursor: not-allowed;
  opacity: 0.5;
}

.nav-prev {
  left: 20px;
}

.nav-next {
  right: 20px;
}

.nav-icon {
  width: 26px;
  height: 26px;
  color: #4f46e5;
  transition: all 0.3s ease;
}

.nav-button:not(.loading-state):hover .nav-icon {
  color: #6366f1;
  transform: scale(1.1);
}

.nav-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-button:active .nav-ripple {
  opacity: 1;
  transform: scale(1);
  transition: all 0s;
}

/* ===================================
   MODERN SLIDE COUNTER
   =================================== */

.slide-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  backdrop-filter: blur(12px);
  color: #4f46e5;
  padding: 10px 18px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  z-index: 30;
  border: 2px solid rgba(99, 102, 241, 0.2);
  box-shadow: 
    0 8px 20px rgba(59, 130, 246, 0.15),
    0 3px 8px rgba(99, 102, 241, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Desktop - Counter lebih compact */
@media (min-width: 1025px) {
  .slide-counter {
    padding: 8px 14px;
    font-size: 13px;
    bottom: 16px;
  }
}

.slide-counter:hover {
  background: linear-gradient(135deg, #ffffff 0%, #eef2ff 100%);
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 
    0 12px 28px rgba(59, 130, 246, 0.2),
    0 5px 12px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.counter-current {
  color: #6366f1;
  font-size: 16px;
  font-weight: 800;
}

.counter-divider {
  color: #cbd5e1;
  font-weight: 500;
  margin: 0 2px;
}

.counter-total {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
}

/* FORCE DARK MODE SLIDE COUNTER */
:deep(.dark) .slide-counter,
html.dark .slide-counter,
.dark .slide-counter {
  background: linear-gradient(135deg, rgba(26, 26, 36, 0.92) 0%, rgba(34, 34, 46, 0.88) 100%) !important;
  border-color: rgba(233, 30, 99, 0.4) !important;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(233, 30, 99, 0.2) !important;
}

:deep(.dark) .counter-current,
html.dark .counter-current,
.dark .counter-current {
  color: #FDA4AF !important;
}

:deep(.dark) .counter-divider,
html.dark .counter-divider,
.dark .counter-divider {
  color: rgba(233, 30, 99, 0.6) !important;
}

:deep(.dark) .counter-total,
html.dark .counter-total,
.dark .counter-total {
  color: rgba(250, 250, 250, 0.6) !important;
}

/* ===================================
   DOT INDICATORS
   =================================== */

.dot-indicators {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 30;
}

.dot-indicator {
  width: 32px;
  height: 32px;
  padding: 0;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.dot-indicator:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(99, 102, 241, 0.4);
  transform: scale(1.1);
}

.dot-indicator.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: #6366f1;
}

.dot-inner {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.dot-indicator.active .dot-inner {
  background: white;
  width: 12px;
  height: 12px;
}

/* FORCE DARK MODE DOT INDICATORS */
:deep(.dark) .dot-indicator,
html.dark .dot-indicator,
.dark .dot-indicator {
  background: rgba(26, 26, 36, 0.9) !important;
  border-color: rgba(233, 30, 99, 0.3) !important;
}

:deep(.dark) .dot-indicator.active,
html.dark .dot-indicator.active,
.dark .dot-indicator.active {
  background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%) !important;
  border-color: rgba(233, 30, 99, 0.8) !important;
}

:deep(.dark) .dot-indicator.active .dot-inner,
html.dark .dot-indicator.active .dot-inner,
.dark .dot-indicator.active .dot-inner {
  background: #FFF1F2 !important;
}

/* ===================================
   RESPONSIVE DESIGN - MOBILE & TABLET
   =================================== */

/* Tablet besar - gambar optimal tanpa potong */
@media (min-width: 769px) and (max-width: 1024px) {
  .banner-image {
    object-fit: contain !important;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  }
  
  .banner-stage {
    border-radius: 16px;
  }
  
  .modern-banner-loading {
    border-radius: 16px;
  }
}

@media (max-width: 768px) {
  /* Banner TIDAK TERPOTONG - Gambar utuh & jelas - BESAR */
  .banner-image {
    object-fit: contain !important; /* Tampilkan gambar lengkap */
    object-position: center !important;
    height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); /* Background bagus */
    display: block !important;
  }
  
  .banner-stage {
    aspect-ratio: var(--banner-mobile-aspect, 16 / 9);
    height: clamp(260px, calc(88vw / var(--banner-mobile-aspect, 1.7778)), 520px) !important;
    min-height: clamp(260px, calc(88vw / var(--banner-mobile-aspect, 1.7778)), 520px) !important;
    max-height: clamp(260px, calc(88vw / var(--banner-mobile-aspect, 1.7778)), 520px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent;
    box-sizing: border-box;
    padding: 0 !important;
  }
  
  .modern-banner-loading,
  .banner-stage {
    border-radius: 14px;
    height: clamp(260px, calc(88vw / var(--banner-mobile-aspect, 1.7778)), 520px) !important;
    min-height: clamp(260px, calc(88vw / var(--banner-mobile-aspect, 1.7778)), 520px) !important;
    max-height: clamp(260px, calc(88vw / var(--banner-mobile-aspect, 1.7778)), 520px) !important;
  }

  /* Navigation buttons - RAPI & PROFESIONAL */
  .nav-button {
    width: 40px;
    height: 40px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 1.5px;
    box-shadow: 
      0 6px 16px rgba(59, 130, 246, 0.2),
      0 2px 6px rgba(99, 102, 241, 0.15);
  }

  .nav-prev {
    left: 10px;
  }

  .nav-next {
    right: 10px;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }

  /* Slide counter - RAPI & PROFESIONAL */
  .slide-counter {
    display: none !important;
  }

  /* Dot indicators - RAPI & PROFESIONAL */
  .dot-indicators {
    display: flex;
    gap: 0.4rem;
    bottom: 14px;
    right: 50%;
    transform: translateX(50%);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    padding: 6px 10px;
    border-radius: 20px;
    border: 1px solid rgba(99, 102, 241, 0.15);
  }

  .dot-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: none;
    background: rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;
  }

  .dot-indicator.active {
    width: 20px;
    background: #6366f1;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  /* Banner TIDAK TERPOTONG di HP kecil - Gambar utuh & jelas - BESAR */
  .banner-image {
    object-fit: contain !important; /* Tampilkan gambar lengkap */
    object-position: center !important;
    height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  
  .banner-stage {
    aspect-ratio: var(--banner-mobile-aspect, 16 / 9);
    height: clamp(240px, calc(92vw / var(--banner-mobile-aspect, 1.7778)), 500px) !important;
    min-height: clamp(240px, calc(92vw / var(--banner-mobile-aspect, 1.7778)), 500px) !important;
    max-height: clamp(240px, calc(92vw / var(--banner-mobile-aspect, 1.7778)), 500px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent;
    padding: 0 !important;
  }
  
  .modern-banner-loading,
  .banner-stage {
    border-radius: 12px;
    height: clamp(240px, calc(92vw / var(--banner-mobile-aspect, 1.7778)), 500px) !important;
    min-height: clamp(240px, calc(92vw / var(--banner-mobile-aspect, 1.7778)), 500px) !important;
    max-height: clamp(240px, calc(92vw / var(--banner-mobile-aspect, 1.7778)), 500px) !important;
  }

  /* Navigation buttons - LEBIH KECIL di HP kecil */
  .nav-button {
    width: 36px;
    height: 36px;
  }

  .nav-prev {
    left: 8px;
  }

  .nav-next {
    right: 8px;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }

  /* Slide counter - LEBIH KECIL di HP kecil */
  .slide-counter {
    display: none !important;
  }

  /* Dot indicators - LEBIH KECIL di HP kecil */
  .dot-indicators {
    gap: 0.35rem;
    bottom: 12px;
    padding: 5px 8px;
  }

  .dot-indicator {
    width: 5px;
    height: 5px;
  }

  .dot-indicator.active {
    width: 18px;
  }
}

/* HP sangat kecil - banner tetap besar & jelas */
@media (max-width: 375px) {
  .banner-image {
    object-fit: contain !important;
    height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }
  
  .banner-stage {
    aspect-ratio: var(--banner-mobile-aspect, 16 / 9);
    height: clamp(220px, calc(94vw / var(--banner-mobile-aspect, 1.7778)), 460px) !important;
    min-height: clamp(220px, calc(94vw / var(--banner-mobile-aspect, 1.7778)), 460px) !important;
    max-height: clamp(220px, calc(94vw / var(--banner-mobile-aspect, 1.7778)), 460px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    background: transparent;
  }

  .nav-button {
    width: 34px;
    height: 34px;
  }

  .nav-prev {
    left: 6px;
  }

  .nav-next {
    right: 6px;
  }

  .nav-icon {
    width: 16px;
    height: 16px;
  }

  .slide-counter {
    display: none !important;
  }

  .dot-indicators {
    gap: 0.25rem;
    bottom: 10px;
    padding: 4px 7px;
  }

  .modern-banner-loading,
  .banner-stage {
    height: clamp(220px, calc(94vw / var(--banner-mobile-aspect, 1.7778)), 460px) !important;
    min-height: clamp(220px, calc(94vw / var(--banner-mobile-aspect, 1.7778)), 460px) !important;
    max-height: clamp(220px, calc(94vw / var(--banner-mobile-aspect, 1.7778)), 460px) !important;
  }

  .premium-spinner {
    width: 70px;
    height: 70px;
  }
  
  .spinner-1 {
    width: 70px;
    height: 70px;
    border-width: 3px;
  }
  
  .spinner-2 {
    width: 52px;
    height: 52px;
    top: 9px;
    left: 9px;
    border-width: 3px;
  }
  
  .spinner-3 {
    width: 34px;
    height: 34px;
    top: 18px;
    left: 18px;
    border-width: 2px;
  }
  
  .spinner-dot {
    width: 12px;
    height: 12px;
  }
  
  .modern-progress-wrapper {
    max-width: 240px;
  }
}

/* ===================================
   DARK MODE SUPPORT - BURGUNDY THEME
   =================================== */

.dark .modern-banner-loading {
  background: linear-gradient(135deg, #0D0D12 0%, #1A1A24 50%, #22222E 100%) !important;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(233, 30, 99, 0.15),
    0 0 40px rgba(233, 30, 99, 0.1) !important;
  border: 2px solid rgba(233, 30, 99, 0.35) !important;
}

.dark .loading-overlay {
  background: linear-gradient(135deg, 
    rgba(13, 13, 18, 0.85) 0%, 
    rgba(26, 26, 36, 0.9) 50%, 
    rgba(34, 34, 46, 0.85) 100%
  ) !important;
}

.dark .loading-bg-image {
  filter: blur(4px) brightness(0.3) !important;
  opacity: 0.5 !important;
}

.dark .banner-stage {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  backdrop-filter: none !important;
}

.dark .banner-stage:hover {
  box-shadow:
    0 40px 90px rgba(0, 0, 0, 0.7),
    0 0 55px rgba(233, 30, 99, 0.2) !important;
  border-color: rgba(233, 30, 99, 0.5) !important;
  transform: none;
}

.dark .nav-button {
  background: linear-gradient(135deg, rgba(26, 26, 36, 0.95) 0%, rgba(34, 34, 46, 0.9) 100%) !important;
  border: 2px solid rgba(233, 30, 99, 0.35) !important;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.6),
    0 4px 10px rgba(233, 30, 99, 0.25),
    0 0 20px rgba(233, 30, 99, 0.1) !important;
  backdrop-filter: blur(12px) !important;
}

.dark .nav-button:not(.loading-state):hover {
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.3) 0%, rgba(233, 30, 99, 0.2) 100%) !important;
  border-color: rgba(233, 30, 99, 0.7) !important;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.7),
    0 8px 20px rgba(233, 30, 99, 0.4),
    0 0 30px rgba(233, 30, 99, 0.3) !important;
  transform: translateY(-50%) scale(1.08);
}

.dark .nav-icon {
  color: rgba(233, 30, 99, 0.9) !important;
}

.dark .nav-button:hover .nav-icon {
  color: #FFF1F2 !important;
}

.dark .slide-counter {
  background: linear-gradient(135deg, rgba(26, 26, 36, 0.92) 0%, rgba(34, 34, 46, 0.88) 100%) !important;
  border: 2px solid rgba(233, 30, 99, 0.4) !important;
  color: #FAFAFA !important;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(233, 30, 99, 0.2) !important;
  backdrop-filter: blur(12px) !important;
}

.dark .counter-current {
  color: #FDA4AF !important;
  font-weight: 700;
}

.dark .counter-divider {
  color: rgba(233, 30, 99, 0.6) !important;
}

.dark .counter-total {
  color: rgba(250, 250, 250, 0.6) !important;
}

.dark .dot-indicator {
  background: rgba(26, 26, 36, 0.9) !important;
  border: 2px solid rgba(233, 30, 99, 0.3) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
}

.dark .dot-indicator.active {
  background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%) !important;
  border-color: rgba(233, 30, 99, 0.8) !important;
  box-shadow: 
    0 4px 12px rgba(233, 30, 99, 0.5),
    0 0 25px rgba(233, 30, 99, 0.4) !important;
}

.dark .dot-indicator:hover {
  background: rgba(233, 30, 99, 0.35) !important;
  border-color: rgba(233, 30, 99, 0.6) !important;
  transform: scale(1.15);
}

.dark .dot-inner {
  background: rgba(233, 30, 99, 0.8) !important;
}

.dark .dot-indicator.active .dot-inner {
  background: #FFF1F2 !important;
}

.dark .loading-message {
  color: #FDA4AF !important;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7),
               0 0 20px rgba(233, 30, 99, 0.3) !important;
}

.dark .progress-track {
  background: rgba(26, 26, 36, 0.85) !important;
  border: 2px solid rgba(233, 30, 99, 0.3) !important;
  backdrop-filter: blur(10px) !important;
}

.dark .progress-fill {
  background: linear-gradient(90deg, #E91E63 0%, #C2185B 50%, #AD1457 100%) !important;
  box-shadow: 0 0 25px rgba(233, 30, 99, 0.7),
              0 2px 8px rgba(233, 30, 99, 0.5) !important;
}

.dark .progress-percent {
  color: #FDA4AF !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6) !important;
}

.dark .progress-time {
  color: #FF6B9D !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6) !important;
}

.dark .spinner-circle {
  border-top-color: #E91E63 !important;
  border-right-color: rgba(233, 30, 99, 0.3) !important;
}

.dark .spinner-2 {
  border-top-color: #FDA4AF !important;
}

.dark .spinner-3 {
  border-top-color: #FF6B9D !important;
}

.dark .spinner-dot {
  background: linear-gradient(135deg, #E91E63, #FDA4AF) !important;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.6) !important;
}

/* Dark Mode - Mobile Specific Adjustments */
@media (max-width: 640px) {
  .dark .banner-stage {
    border-width: 1.5px !important;
  }
  
  .dark .nav-button {
    background: rgba(26, 26, 36, 0.92) !important;
    border-width: 1.5px !important;
  }
  
  .dark .slide-counter {
    border-width: 1.5px !important;
  }
}
</style>