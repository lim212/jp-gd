<template>
  <div class="mobile-lazy-image-container" :class="containerClasses" :style="containerStyle">
    <!-- Placeholder/Skeleton -->
    <div v-if="!loaded && !error" class="mobile-lazy-image-placeholder" :class="placeholderClasses">
      <div v-if="showSkeleton" class="mobile-lazy-image-skeleton" :style="skeletonStyle">
        <div class="mobile-lazy-image-skeleton-shimmer"></div>
      </div>
      <div v-else class="mobile-lazy-image-placeholder-content">
        <Icon v-if="placeholderIcon" :name="placeholderIcon" class="mobile-lazy-image-placeholder-icon" />
        <div v-if="placeholderText" class="mobile-lazy-image-placeholder-text">{{ placeholderText }}</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mobile-lazy-image-error" :class="errorClasses">
      <Icon name="lucide:image-x" class="mobile-lazy-image-error-icon" />
      <div v-if="errorText" class="mobile-lazy-image-error-text">{{ errorText }}</div>
      <button v-if="retryable" class="mobile-lazy-image-retry" @click="retryLoad">
        <Icon name="lucide:refresh-cw" class="mobile-lazy-image-retry-icon" />
        {{ retryText }}
      </button>
    </div>

    <!-- Actual Image -->
    <img
      v-if="loaded && !error"
      ref="imageElement"
      :src="src"
      :alt="alt"
      :class="imageClasses"
      :style="imageStyle"
      @load="onImageLoad"
      @error="onImageError"
      @click="onImageClick"
      :loading="lazy ? 'lazy' : 'eager'"
      :decoding="decoding"
      :fetchpriority="priority"
    />

    <!-- Loading Overlay -->
    <div v-if="loading && showLoadingOverlay" class="mobile-lazy-image-loading-overlay">
      <div class="mobile-lazy-image-spinner">
        <div class="mobile-lazy-image-spinner-circle"></div>
      </div>
      <div v-if="loadingText" class="mobile-lazy-image-loading-text">{{ loadingText }}</div>
    </div>

    <!-- Image Actions -->
    <div v-if="showActions && loaded && !error" class="mobile-lazy-image-actions" :class="actionsClasses">
      <button
        v-if="downloadable"
        class="mobile-lazy-image-action mobile-lazy-image-download"
        @click="downloadImage"
        :aria-label="downloadLabel"
      >
        <Icon name="lucide:download" />
      </button>
      
      <button
        v-if="shareable"
        class="mobile-lazy-image-action mobile-lazy-image-share"
        @click="shareImage"
        :aria-label="shareLabel"
      >
        <Icon name="lucide:share" />
      </button>
      
      <button
        v-if="zoomable"
        class="mobile-lazy-image-action mobile-lazy-image-zoom"
        @click="zoomImage"
        :aria-label="zoomLabel"
      >
        <Icon name="lucide:zoom-in" />
      </button>
    </div>

    <!-- Caption -->
    <div v-if="caption && loaded && !error" class="mobile-lazy-image-caption" :class="captionClasses">
      {{ caption }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Props
const props = defineProps({
  // Image source
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  
  // Dimensions
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  aspectRatio: {
    type: String,
    default: 'auto'
  },
  
  // Lazy loading
  lazy: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  rootMargin: {
    type: String,
    default: '50px'
  },
  
  // Placeholder
  showSkeleton: {
    type: Boolean,
    default: true
  },
  placeholderIcon: {
    type: String,
    default: 'lucide:image'
  },
  placeholderText: {
    type: String,
    default: ''
  },
  
  // Error handling
  retryable: {
    type: Boolean,
    default: true
  },
  retryText: {
    type: String,
    default: 'Retry'
  },
  errorText: {
    type: String,
    default: 'Failed to load image'
  },
  
  // Loading states
  showLoadingOverlay: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  
  // Image behavior
  decoding: {
    type: String,
    default: 'async',
    validator: (value: string) => ['sync', 'async', 'auto'].includes(value)
  },
  priority: {
    type: String,
    default: 'auto',
    validator: (value: string) => ['high', 'low', 'auto'].includes(value)
  },
  
  // Actions
  showActions: {
    type: Boolean,
    default: false
  },
  downloadable: {
    type: Boolean,
    default: false
  },
  shareable: {
    type: Boolean,
    default: false
  },
  zoomable: {
    type: Boolean,
    default: false
  },
  downloadLabel: {
    type: String,
    default: 'Download image'
  },
  shareLabel: {
    type: String,
    default: 'Share image'
  },
  zoomLabel: {
    type: String,
    default: 'Zoom image'
  },
  
  // Caption
  caption: {
    type: String,
    default: ''
  },
  
  // Styling
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'rounded', 'circular', 'square'].includes(value)
  },
  fit: {
    type: String,
    default: 'cover',
    validator: (value: string) => ['cover', 'contain', 'fill', 'scale-down', 'none'].includes(value)
  },
  
  // Animation
  fadeIn: {
    type: Boolean,
    default: true
  },
  animationDuration: {
    type: Number,
    default: 300
  }
})

// Emits
const emit = defineEmits<{
  'load': [event: Event]
  'error': [event: Event]
  'click': [event: MouseEvent]
  'download': [src: string]
  'share': [src: string]
  'zoom': [src: string]
}>()

// Refs
const imageElement = ref<HTMLImageElement>()
const containerElement = ref<HTMLElement>()
const loaded = ref(false)
const loading = ref(false)
const error = ref(false)
const observer = ref<IntersectionObserver>()

// Computed
const containerClasses = computed(() => [
  `mobile-lazy-image-${props.variant}`,
  {
    'mobile-lazy-image-loaded': loaded.value,
    'mobile-lazy-image-error': error.value,
    'mobile-lazy-image-loading': loading.value,
    'mobile-lazy-image-fade-in': props.fadeIn
  }
])

const placeholderClasses = computed(() => [
  `mobile-lazy-image-placeholder-${props.variant}`
])

const errorClasses = computed(() => [
  `mobile-lazy-image-error-${props.variant}`
])

const imageClasses = computed(() => [
  `mobile-lazy-image-img-${props.variant}`,
  {
    'mobile-lazy-image-fade-in': props.fadeIn && loaded.value
  }
])

const actionsClasses = computed(() => [
  `mobile-lazy-image-actions-${props.variant}`
])

const captionClasses = computed(() => [
  `mobile-lazy-image-caption-${props.variant}`
])

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.width !== 'auto') {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height !== 'auto') {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  if (props.aspectRatio !== 'auto') {
    style.aspectRatio = props.aspectRatio
  }
  
  return style
})

const skeletonStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.width !== 'auto') {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height !== 'auto') {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return style
})

const imageStyle = computed(() => {
  const style: Record<string, string> = {
    objectFit: props.fit
  }
  
  if (props.fadeIn) {
    style.transitionDuration = `${props.animationDuration}ms`
  }
  
  return style
})

// Methods
const onImageLoad = (event: Event) => {
  loaded.value = true
  loading.value = false
  error.value = false
  emit('load', event)
}

const onImageError = (event: Event) => {
  error.value = true
  loading.value = false
  loaded.value = false
  emit('error', event)
}

const onImageClick = (event: MouseEvent) => {
  emit('click', event)
}

const retryLoad = () => {
  error.value = false
  loading.value = true
  loaded.value = false
  
  if (imageElement.value) {
    imageElement.value.src = props.src
  }
}

const downloadImage = () => {
  if (props.src) {
    const link = document.createElement('a')
    link.href = props.src
    link.download = props.alt || 'image'
    link.click()
    emit('download', props.src)
  }
}

const shareImage = async () => {
  if (navigator.share && props.src) {
    try {
      await navigator.share({
        title: props.alt || 'Image',
        url: props.src
      })
      emit('share', props.src)
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(props.src)
    }
  } else if (props.src) {
    // Fallback to copying URL
    navigator.clipboard.writeText(props.src)
  }
}

const zoomImage = () => {
  if (props.src) {
    emit('zoom', props.src)
  }
}

const setupIntersectionObserver = () => {
  if (!props.lazy || !containerElement.value) return
  
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loading.value = true
          if (imageElement.value) {
            imageElement.value.src = props.src
          }
          observer.value?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )
  
  observer.value.observe(containerElement.value)
}

const cleanupObserver = () => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = undefined
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  containerElement.value = document.querySelector('.mobile-lazy-image-container') as HTMLElement
  
  if (props.lazy) {
    setupIntersectionObserver()
  } else {
    loading.value = true
    if (imageElement.value) {
      imageElement.value.src = props.src
    }
  }
})

onUnmounted(() => {
  cleanupObserver()
})
</script>

<style scoped>
/* Mobile Lazy Image Base Styles */
.mobile-lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: var(--background);
}

.mobile-lazy-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  color: var(--text-secondary);
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.mobile-lazy-image-placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-sm);
  text-align: center;
}

.mobile-lazy-image-placeholder-icon {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.mobile-lazy-image-placeholder-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

/* Skeleton Loading */
.mobile-lazy-image-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(0, 0, 0, 0.06) 25%, 
    rgba(0, 0, 0, 0.15) 50%, 
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  position: relative;
  overflow: hidden;
}

.mobile-lazy-image-skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%
  );
  animation: mobile-lazy-image-shimmer 1.5s infinite;
}

@keyframes mobile-lazy-image-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Error State */
.mobile-lazy-image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background);
  color: var(--text-secondary);
  width: 100%;
  height: 100%;
  min-height: 200px;
  gap: var(--mobile-md);
  text-align: center;
}

.mobile-lazy-image-error-icon {
  width: 48px;
  height: 48px;
  color: var(--mobile-error);
}

.mobile-lazy-image-error-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

.mobile-lazy-image-retry {
  display: flex;
  align-items: center;
  gap: var(--mobile-xs);
  padding: var(--mobile-sm) var(--mobile-md);
  background: var(--mobile-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: var(--mobile-text-sm);
  cursor: pointer;
  transition: var(--mobile-transition);
}

.mobile-lazy-image-retry:hover {
  background: var(--mobile-primary-hover);
  transform: translateY(-1px);
}

.mobile-lazy-image-retry-icon {
  width: 16px;
  height: 16px;
}

/* Image Styles */
.mobile-lazy-image-container img {
  width: 100%;
  height: 100%;
  display: block;
  transition: opacity var(--mobile-transition);
}

.mobile-lazy-image-fade-in {
  opacity: 0;
  animation: mobile-lazy-image-fade-in var(--mobile-transition) ease forwards;
}

@keyframes mobile-lazy-image-fade-in {
  to {
    opacity: 1;
  }
}

/* Loading Overlay */
.mobile-lazy-image-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--mobile-sm);
  z-index: 2;
}

.mobile-lazy-image-spinner {
  width: 32px;
  height: 32px;
  position: relative;
}

.mobile-lazy-image-spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 122, 0, 0.2);
  border-top-color: var(--mobile-primary);
  border-radius: 50%;
  animation: mobile-lazy-image-spin 1s linear infinite;
}

@keyframes mobile-lazy-image-spin {
  to {
    transform: rotate(360deg);
  }
}

.mobile-lazy-image-loading-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

/* Image Actions */
.mobile-lazy-image-actions {
  position: absolute;
  top: var(--mobile-sm);
  right: var(--mobile-sm);
  display: flex;
  gap: var(--mobile-xs);
  opacity: 0;
  transition: var(--mobile-transition);
}

.mobile-lazy-image-container:hover .mobile-lazy-image-actions {
  opacity: 1;
}

.mobile-lazy-image-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--mobile-transition);
  backdrop-filter: blur(4px);
}

.mobile-lazy-image-action:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.mobile-lazy-image-action svg {
  width: 16px;
  height: 16px;
}

/* Caption */
.mobile-lazy-image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: var(--mobile-lg) var(--mobile-md) var(--mobile-md);
  font-size: var(--mobile-text-sm);
  line-height: 1.4;
}

/* Variants */
.mobile-lazy-image-rounded {
  border-radius: 12px;
  overflow: hidden;
}

.mobile-lazy-image-circular {
  border-radius: 50%;
  overflow: hidden;
}

.mobile-lazy-image-square {
  border-radius: 0;
}

.mobile-lazy-image-rounded .mobile-lazy-image-placeholder,
.mobile-lazy-image-rounded .mobile-lazy-image-error,
.mobile-lazy-image-rounded .mobile-lazy-image-skeleton {
  border-radius: 12px;
}

.mobile-lazy-image-circular .mobile-lazy-image-placeholder,
.mobile-lazy-image-circular .mobile-lazy-image-error,
.mobile-lazy-image-circular .mobile-lazy-image-skeleton {
  border-radius: 50%;
}

/* Dark Mode Adjustments */
.dark .mobile-lazy-image-skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.03) 25%, 
    rgba(255, 255, 255, 0.08) 50%, 
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
}

.dark .mobile-lazy-image-skeleton-shimmer {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 100%
  );
}

.dark .mobile-lazy-image-loading-overlay {
  background: rgba(0, 0, 0, 0.8);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-lazy-image-actions {
    top: var(--mobile-xs);
    right: var(--mobile-xs);
  }
  
  .mobile-lazy-image-action {
    width: 28px;
    height: 28px;
  }
  
  .mobile-lazy-image-action svg {
    width: 14px;
    height: 14px;
  }
  
  .mobile-lazy-image-caption {
    padding: var(--mobile-md) var(--mobile-sm) var(--mobile-sm);
    font-size: var(--mobile-text-xs);
  }
}

/* Performance Optimizations */
.mobile-lazy-image-container,
.mobile-lazy-image-skeleton-shimmer,
.mobile-lazy-image-spinner-circle {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-lazy-image-skeleton-shimmer,
  .mobile-lazy-image-spinner-circle,
  .mobile-lazy-image-fade-in {
    animation: none;
  }
  
  .mobile-lazy-image-container img {
    transition: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-lazy-image-placeholder,
  .mobile-lazy-image-error {
    border: 2px solid var(--border);
  }
  
  .mobile-lazy-image-action {
    border: 1px solid white;
  }
}
</style>

