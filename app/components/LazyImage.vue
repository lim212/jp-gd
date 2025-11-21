<template>
  <div class="lazy-image-wrapper" :class="{ 'is-loading': !isLoaded, 'has-error': hasError }">
    <img
      v-if="!hasError"
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :class="['lazy-image', { 'is-loaded': isLoaded }]"
      :loading="nativeLazy ? 'lazy' : 'eager'"
      :width="width"
      :height="height"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- Placeholder while loading -->
    <div v-if="!isLoaded && !hasError" class="lazy-image-placeholder">
      <div class="placeholder-shimmer"></div>
      <div v-if="showLoadingIndicator" class="loading-indicator">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="spinner-circle" cx="25" cy="25" r="20"></circle>
        </svg>
      </div>
    </div>
    
    <!-- Error fallback -->
    <div v-if="hasError" class="lazy-image-error">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
      </svg>
      <p class="error-message">{{ errorMessage }}</p>
      <button v-if="allowRetry" @click="retry" class="retry-button">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  // Image source (required)
  src: {
    type: String,
    required: true
  },
  
  // Alt text
  alt: {
    type: String,
    default: ''
  },
  
  // Image dimensions (for aspect ratio)
  width: {
    type: [Number, String],
    default: undefined
  },
  
  height: {
    type: [Number, String],
    default: undefined
  },
  
  // Placeholder image (base64 or URL)
  placeholder: {
    type: String,
    default: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E'
  },
  
  // Root margin for intersection observer
  rootMargin: {
    type: String,
    default: '50px'
  },
  
  // Threshold for intersection observer
  threshold: {
    type: Number,
    default: 0.1
  },
  
  // Use native lazy loading (for modern browsers)
  nativeLazy: {
    type: Boolean,
    default: true
  },
  
  // Show loading spinner
  showLoadingIndicator: {
    type: Boolean,
    default: true
  },
  
  // Allow retry on error
  allowRetry: {
    type: Boolean,
    default: true
  },
  
  // Max retry attempts
  maxRetries: {
    type: Number,
    default: 3
  },
  
  // Delay between retries (ms)
  retryDelay: {
    type: Number,
    default: 1000
  },
  
  // Error message
  errorMessage: {
    type: String,
    default: 'Failed to load image'
  }
})

const emit = defineEmits(['load', 'error'])

// Refs
const imageRef = ref<HTMLImageElement | null>(null)
const isIntersecting = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)
const retryCount = ref(0)

// Current image source
const currentSrc = computed(() => {
  if (isIntersecting.value || !props.nativeLazy) {
    return props.src
  }
  return props.placeholder
})

// Intersection Observer
let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for browsers without IntersectionObserver
    isIntersecting.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting.value = true
          
          // Disconnect observer after image is visible
          if (observer) {
            observer.disconnect()
          }
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )

  if (imageRef.value) {
    observer.observe(imageRef.value)
  }
}

// Handle image load
const handleLoad = (event: Event) => {
  isLoaded.value = true
  hasError.value = false
  
  console.log('✅ Image loaded:', props.src)
  emit('load', event)
}

// Handle image error
const handleError = (event: Event) => {
  console.error('❌ Image failed to load:', props.src)
  
  // Try retry if available
  if (retryCount.value < props.maxRetries) {
    retryCount.value++
    console.log(`🔄 Retrying image load (${retryCount.value}/${props.maxRetries})...`)
    
    setTimeout(() => {
      // Force reload by changing src
      if (imageRef.value) {
        const cacheBuster = `?retry=${retryCount.value}&t=${Date.now()}`
        imageRef.value.src = props.src + cacheBuster
      }
    }, props.retryDelay * retryCount.value) // Exponential backoff
  } else {
    hasError.value = true
    emit('error', event)
  }
}

// Manual retry
const retry = () => {
  hasError.value = false
  retryCount.value = 0
  isLoaded.value = false
  
  // Reload image
  if (imageRef.value) {
    imageRef.value.src = props.src + `?manual-retry=${Date.now()}`
  }
}

// Watch for src changes
watch(() => props.src, () => {
  isLoaded.value = false
  hasError.value = false
  retryCount.value = 0
})

onMounted(() => {
  if (!props.nativeLazy) {
    setupObserver()
  } else {
    // With native lazy loading, consider it intersecting immediately
    isIntersecting.value = true
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

/* Dark mode */
.dark .lazy-image-wrapper {
  background-color: #1f2937;
}

.lazy-image {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.lazy-image.is-loaded {
  opacity: 1;
}

/* Placeholder */
.lazy-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.dark .lazy-image-placeholder {
  background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
  background-size: 200% 100%;
}

.placeholder-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loading indicator */
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.spinner {
  width: 100%;
  height: 100%;
  animation: rotate 1s linear infinite;
}

.spinner-circle {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Error state */
.lazy-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fef2f2;
  color: #991b1b;
  padding: 1rem;
  text-align: center;
}

.dark .lazy-image-error {
  background-color: #7f1d1d;
  color: #fecaca;
}

.error-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.error-message {
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #dc2626;
}

.dark .retry-button {
  background-color: #dc2626;
}

.dark .retry-button:hover {
  background-color: #b91c1c;
}

/* Responsive */
@media (max-width: 640px) {
  .loading-indicator {
    width: 30px;
    height: 30px;
  }
  
  .error-icon {
    width: 36px;
    height: 36px;
  }
  
  .error-message {
    font-size: 0.75rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .lazy-image,
  .placeholder-shimmer,
  .spinner {
    animation: none !important;
    transition: none !important;
  }
  
  .lazy-image.is-loaded {
    opacity: 1;
  }
}
</style>
