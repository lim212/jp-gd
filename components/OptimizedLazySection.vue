<template>
  <component 
    :is="tag" 
    ref="el" 
    class="optimized-lazy-section"
    :class="animationClass"
  >
    <!-- Content when visible -->
    <slot v-if="isVisible" />
    
    <!-- Placeholder when not visible -->
    <div 
      v-else
      class="lazy-placeholder"
      :style="{ 
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : String(minHeight),
        width: '100%' 
      }"
      aria-hidden="true"
    >
      <slot name="placeholder">
        <div class="placeholder-content">
          <div class="placeholder-spinner"></div>
          <span v-if="showText" class="placeholder-text">{{ placeholderText }}</span>
        </div>
      </slot>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

interface Props {
  rootMargin?: string
  once?: boolean
  minHeight?: string | number
  tag?: string
  threshold?: number | number[]
  priority?: 'high' | 'medium' | 'low'
  preload?: boolean
  placeholder?: 'skeleton' | 'spinner' | 'none'
  animation?: 'fade' | 'slide' | 'scale' | 'none'
  delay?: number
  showText?: boolean
  placeholderText?: string
}

const props = withDefaults(defineProps<Props>(), {
  rootMargin: '0px 0px 200px 0px',
  once: true,
  minHeight: '240px',
  tag: 'div',
  threshold: [0, 0.1, 0.25, 0.5],
  priority: 'medium',
  preload: false,
  placeholder: 'skeleton',
  animation: 'fade',
  delay: 0,
  showText: false,
  placeholderText: 'Memuat konten...'
})

const isVisible = ref(false)
const isLoaded = ref(false)
const el = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let loadTimeout: NodeJS.Timeout | null = null

// Computed properties for better performance
const shouldPreload = computed(() => props.preload || props.priority === 'high')
const animationClass = computed(() => {
  if (!isLoaded.value) return ''
  return `lazy-animate-${props.animation}`
})

// Enhanced intersection observer with better performance
const createObserver = () => {
  if (typeof window === 'undefined' || typeof (window as any).IntersectionObserver === 'undefined') {
    isVisible.value = true
    isLoaded.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isIntersecting.value = true
          
          // Add delay if specified
          if (props.delay > 0) {
            loadTimeout = setTimeout(() => {
              isVisible.value = true
              isLoaded.value = true
            }, props.delay)
          } else {
            isVisible.value = true
            isLoaded.value = true
          }
          
          // Disconnect observer if once is true
          if (props.once && observer && el.value) {
            observer.unobserve(el.value)
            observer.disconnect()
            observer = null
          }
        }
      }
    },
    {
      root: null,
      rootMargin: props.rootMargin,
      threshold: props.threshold
    }
  )
}

onMounted(() => {
  createObserver()
  
  // Start observing
  if (el.value && observer) {
    observer.observe(el.value)
  }
  
  // Preload if high priority
  if (shouldPreload.value) {
    isVisible.value = true
    isLoaded.value = true
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
})
</script>

<style scoped>
.optimized-lazy-section {
  position: relative;
}

.lazy-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  min-height: 200px;
}

.dark .lazy-placeholder {
  background: #1f2937;
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

/* Animation classes */
.lazy-animate-fade {
  animation: fadeIn 0.3s ease-in-out;
}

.lazy-animate-slide {
  animation: slideIn 0.3s ease-out;
}

.lazy-animate-scale {
  animation: scaleIn 0.3s ease-out;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
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
  
  .lazy-animate-fade,
  .lazy-animate-slide,
  .lazy-animate-scale {
    animation: none;
  }
}
</style>


