<template>
  <div 
    ref="container"
    class="progressive-image-wrapper" 
    :class="{ 'is-loaded': isLoaded, 'is-loading': isLoading }"
    :style="containerStyle"
  >
    <!-- Tiny blurred placeholder (loads first - super small) -->
    <img
      v-if="!isTextOnly"
      :src="tinyPlaceholder"
      :alt="alt"
      class="progressive-image-placeholder"
      :class="{ 'fade-out': isLoaded }"
      aria-hidden="true"
    />
    
    <!-- Main image (loads progressively) -->
    <img
      v-if="shouldLoad && !isTextOnly"
      :src="currentSrc"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      class="progressive-image-main"
      :class="{ 'fade-in': isLoaded }"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      @load="onLoad"
      @error="onError"
    />
    
    <!-- Text-only fallback for data saver -->
    <div v-if="isTextOnly" class="progressive-image-text">
      {{ alt || 'Gambar' }}
    </div>
    
    <!-- Loading spinner (shows while main image loads) -->
    <div v-if="isLoading && !isLoaded" class="progressive-loader">
      <div class="progressive-spinner"></div>
    </div>
    
    <!-- Error state -->
    <div v-if="hasError" class="progressive-error">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="error-text">Gagal memuat</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  srcset?: string
  sizes?: string
  priority?: boolean
  aspectRatio?: number
  placeholderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto',
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority: false,
  aspectRatio: undefined,
  placeholderColor: '#f3f4f6'
})

const container = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)
const isLoaded = ref(false)
const isLoading = ref(false)
const hasError = ref(false)
let observer: IntersectionObserver | null = null

// Data saver mode
const isTextOnly = ref(false)
if (import.meta.client) {
  try {
    const dataSaver = localStorage.getItem('data-saver-mode')
    isTextOnly.value = dataSaver === 'text-only'
  } catch {}
}

// Generate tiny placeholder (10x10 px blurred version)
const tinyPlaceholder = computed(() => {
  // Create a tiny 10x10 colored rectangle as data URL
  const canvas = document.createElement('canvas')
  canvas.width = 10
  canvas.height = 10
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = props.placeholderColor
    ctx.fillRect(0, 0, 10, 10)
  }
  return canvas.toDataURL()
})

// Progressive src (start with low quality, upgrade to high)
const currentSrc = computed(() => {
  if (isTextOnly.value) return ''
  return props.src
})

// Container style with aspect ratio
const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.aspectRatio) {
    style.paddingBottom = `${(1 / props.aspectRatio) * 100}%`
  }
  
  if (typeof props.width === 'number') {
    style.width = `${props.width}px`
  } else if (props.width) {
    style.width = props.width
  }
  
  if (typeof props.height === 'number') {
    style.height = `${props.height}px`
  } else if (props.height && props.height !== 'auto') {
    style.height = props.height
  }
  
  return style
})

function onLoad() {
  isLoaded.value = true
  isLoading.value = false
  hasError.value = false
}

function onError() {
  hasError.value = true
  isLoading.value = false
  isLoaded.value = false
  console.warn('Failed to load image:', props.src)
}

onMounted(() => {
  // Priority images load immediately
  if (props.priority || isTextOnly.value) {
    shouldLoad.value = true
    isLoading.value = true
    return
  }

  // Lazy load with IntersectionObserver
  if (!container.value || typeof window === 'undefined') {
    shouldLoad.value = true
    isLoading.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          shouldLoad.value = true
          isLoading.value = true
          if (observer && container.value) {
            observer.unobserve(container.value)
          }
        }
      })
    },
    {
      rootMargin: '100px', // Start loading 100px before entering viewport
      threshold: 0.01
    }
  )

  observer.observe(container.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.progressive-image-wrapper {
  position: relative;
  overflow: hidden;
  background: var(--placeholder-bg, #f3f4f6);
  display: block;
  width: 100%;
}

.dark .progressive-image-wrapper {
  background: var(--placeholder-bg, #374151);
}

/* Placeholder - tiny blurred image that loads instantly */
.progressive-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity 0.4s ease-out;
  opacity: 1;
  border: none;
  outline: none;
}

.progressive-image-placeholder.fade-out {
  opacity: 0;
}

/* Main image - progressive loading */
.progressive-image-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
  border: none;
  outline: none;
  /* Enhanced responsive behavior */
  min-height: 100%;
  max-width: 100%;
  display: block;
}

.progressive-image-main.fade-in {
  opacity: 1;
  transform: scale(1);
}

/* Loading spinner */
.progressive-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.progressive-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.dark .progressive-spinner {
  border-color: rgba(96, 165, 250, 0.2);
  border-top-color: #60a5fa;
}

/* Text-only mode */
.progressive-image-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  text-align: center;
  max-width: 80%;
}

.dark .progressive-image-text {
  background: rgba(31, 41, 55, 0.9);
  color: #e5e7eb;
}

/* Error state */
.progressive-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
}

.error-icon {
  width: 32px;
  height: 32px;
  stroke-width: 2;
}

.error-text {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .progressive-image-placeholder,
  .progressive-image-main,
  .progressive-spinner {
    animation: none !important;
    transition: none !important;
  }
  
  .progressive-image-main {
    transform: scale(1);
  }
}

/* Aspect ratio support */
.progressive-image-wrapper[style*="padding-bottom"] {
  height: 0;
  position: relative;
}

.progressive-image-wrapper.is-loaded {
  background: transparent;
}

/* Enhanced responsive behavior for banner images */
@media (max-width: 768px) {
  .progressive-image-main {
    object-fit: cover;
    object-position: center center;
  }
}

@media (max-width: 480px) {
  .progressive-image-main {
    object-fit: cover;
    object-position: center center;
    /* Ensure proper scaling on mobile */
    min-height: 100%;
    width: 100%;
  }
}

@media (max-width: 360px) {
  .progressive-image-main {
    object-fit: cover;
    object-position: center center;
    /* Force proper scaling on very small screens */
    height: 100%;
    width: 100%;
    min-height: 100%;
    max-height: 100%;
  }
}
</style>

