<template>
  <div 
    ref="container"
    class="lazy-image-container" 
    :style="{ width: width, height: height }"
  >
    <!-- Main image with regular img for SSR compatibility -->
    <img
      v-if="isVisible && src"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imageClass"
      :loading="priority ? 'eager' : 'lazy'"
      @load="onImageLoad"
      @error="onImageError"
    />
    
    <!-- Fallback regular img if NuxtImg fails -->
    <img
      v-else-if="isVisible && src"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :loading="priority ? 'eager' : 'lazy'"
      @load="onImageLoad"
      @error="onImageError"
    />
    
    <!-- Placeholder while loading -->
    <div v-else class="lazy-image-placeholder" :class="placeholderClass">
      <div class="placeholder-content">
        <div class="placeholder-spinner"></div>
        <span v-if="showText" class="placeholder-text">{{ placeholderText }}</span>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-if="hasError" class="lazy-image-error-state">
      <div class="error-icon">⚠️</div>
      <div class="error-text">Gambar tidak dapat dimuat</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

interface Props {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  imageClass?: string
  placeholderClass?: string
  placeholderText?: string
  showText?: boolean
  rootMargin?: string
  threshold?: number
  quality?: number
  format?: string
  sizes?: string
  priority?: boolean
  fadeIn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto',
  imageClass: '',
  placeholderClass: '',
  placeholderText: 'Memuat gambar...',
  showText: false,
  rootMargin: '50px',
  threshold: 0.1,
  quality: 85,
  format: 'webp',
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority: false,
  fadeIn: true
})

const isLoaded = ref(false)
const isVisible = ref(false)
const hasError = ref(false)
const container = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// Computed properties
const shouldLoadImmediately = computed(() => props.priority)

const imageClass = computed(() => [
  'lazy-image',
  {
    'lazy-image-loaded': isLoaded.value,
    'lazy-image-error': hasError.value,
    'lazy-image-fade-in': props.fadeIn && isLoaded.value
  },
  props.imageClass
])

function onImageLoad() {
  isLoaded.value = true
  hasError.value = false
}

function onImageError() {
  console.warn('Failed to load image:', props.src)
  hasError.value = true
  isLoaded.value = false
}

onMounted(() => {
  // Load immediately if priority is set
  if (shouldLoadImmediately.value) {
    isVisible.value = true
    return
  }

  if (typeof window === 'undefined' || !container.value) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer && container.value) {
            observer.unobserve(container.value)
            observer.disconnect()
            observer = null
          }
        }
      }
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )

  observer.observe(container.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lazy-image-loaded {
  opacity: 1;
}

.lazy-image-fade-in {
  animation: fadeInImage 0.5s ease-out;
}

.lazy-image-error {
  opacity: 0;
}

.lazy-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.dark .lazy-image-placeholder {
  background: #374151;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.placeholder-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark .placeholder-spinner {
  border-color: #4b5563;
  border-top-color: #60a5fa;
}

.placeholder-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.dark .placeholder-text {
  color: #9ca3af;
}

.lazy-image-error-state {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
}

.dark .lazy-image-error-state {
  background: #374151;
  color: #9ca3af;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.error-text {
  text-align: center;
  font-size: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeInImage {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .placeholder-spinner {
    animation: none;
  }
  
  .lazy-image {
    transition: none;
  }
  
  .lazy-image-fade-in {
    animation: none;
  }
}
</style>