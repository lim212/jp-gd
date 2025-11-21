<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

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
  delay: 0
})

const isVisible = ref(false)
const isLoaded = ref(false)
const isIntersecting = ref(false)
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
        isIntersecting.value = entry.isIntersecting
        
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          // Add delay if specified
          if (props.delay > 0) {
            loadTimeout = setTimeout(() => {
              isVisible.value = true
              if (props.once && observer && el.value) {
                observer.unobserve(el.value)
                observer.disconnect()
                observer = null
              }
            }, props.delay)
          } else {
            isVisible.value = true
            if (props.once && observer && el.value) {
              observer.unobserve(el.value)
              observer.disconnect()
              observer = null
            }
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

  if (el.value) observer.observe(el.value)
}

// Watch for visibility changes to trigger loading
watch(isVisible, (newValue) => {
  if (newValue && !isLoaded.value) {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      isLoaded.value = true
    })
  }
})

onMounted(() => {
  // Preload high priority components immediately
  if (shouldPreload.value) {
    isVisible.value = true
    isLoaded.value = true
    return
  }
  
  createObserver()
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

<template>
  <component 
    :is="tag" 
    ref="el"
    :class="[
      'lazy-section-wrapper',
      animationClass,
      { 'lazy-loaded': isLoaded }
    ]"
  >
    <slot v-if="isVisible" />
    <slot name="placeholder" v-else>
      <!-- Enhanced skeleton placeholder -->
      <div
        v-if="placeholder === 'skeleton'"
        class="lazy-skeleton"
        :style="{ 
          minHeight: typeof minHeight === 'number' ? `${minHeight}px` : String(minHeight), 
          width: '100%' 
        }"
        aria-hidden="true"
      >
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text short"></div>
          <div class="skeleton-line skeleton-text"></div>
        </div>
      </div>
      
      <!-- Spinner placeholder -->
      <div
        v-else-if="placeholder === 'spinner'"
        class="lazy-spinner"
        :style="{ 
          minHeight: typeof minHeight === 'number' ? `${minHeight}px` : String(minHeight), 
          width: '100%' 
        }"
        aria-hidden="true"
      >
        <div class="spinner"></div>
      </div>
    </slot>
  </component>
</template>

<style scoped>
.lazy-section-wrapper {
  position: relative;
  overflow: hidden;
}

/* Animation classes */
.lazy-animate-fade {
  animation: fadeIn 0.6s ease-out forwards;
}

.lazy-animate-slide {
  animation: slideInUp 0.8s ease-out forwards;
}

.lazy-animate-scale {
  animation: scaleIn 0.7s ease-out forwards;
}

/* Enhanced skeleton with better visual feedback */
.lazy-skeleton {
  position: relative;
  background: linear-gradient(90deg, 
    rgba(0,0,0,0.04) 0%, 
    rgba(0,0,0,0.08) 50%, 
    rgba(0,0,0,0.04) 100%
  );
  overflow: hidden;
  border-radius: 8px;
}

/* Dark mode skeleton */
.dark .lazy-skeleton {
  background: linear-gradient(90deg, 
    rgba(55, 65, 81, 0.3) 0%, 
    rgba(75, 85, 99, 0.4) 50%, 
    rgba(55, 65, 81, 0.3) 100%
  );
}

.lazy-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.4) 50%, 
    rgba(255,255,255,0) 100%
  );
  transform: translateX(-100%);
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: rgba(0,0,0,0.06);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.dark .skeleton-line {
  background: rgba(75, 85, 99, 0.4);
}

.skeleton-title {
  height: 24px;
  width: 60%;
}

.dark .skeleton-title {
  background: rgba(75, 85, 99, 0.5);
}

.skeleton-text {
  width: 100%;
}

.skeleton-text.short {
  width: 80%;
}

/* Spinner placeholder */
.lazy-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.02);
  border-radius: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0,0,0,0.1);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px);
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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .lazy-skeleton {
    background: linear-gradient(90deg, 
      rgba(255,255,255,0.04) 0%, 
      rgba(255,255,255,0.08) 50%, 
      rgba(255,255,255,0.04) 100%
    );
  }
  
  .lazy-skeleton::after {
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.2) 50%, 
      rgba(255,255,255,0) 100%
    );
  }
  
  .skeleton-line {
    background: rgba(255,255,255,0.06);
  }
  
  .lazy-spinner {
    background: rgba(255,255,255,0.02);
  }
  
  .spinner {
    border-color: rgba(255,255,255,0.1);
    border-top-color: #60a5fa;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .lazy-skeleton::after,
  .spinner,
  .lazy-animate-fade,
  .lazy-animate-slide,
  .lazy-animate-scale {
    animation: none;
  }
  
  .lazy-animate-fade,
  .lazy-animate-slide,
  .lazy-animate-scale {
    opacity: 1;
    transform: none;
  }
}

/* Performance optimizations */
.lazy-section-wrapper {
  contain: layout style paint;
  will-change: transform;
}

.lazy-loaded {
  will-change: auto;
}
</style>
