<template>
  <div class="mobile-carousel-container" ref="carouselContainer">
    <!-- Carousel Wrapper -->
    <div
      class="mobile-carousel-wrapper"
      :class="{ 'mobile-carousel-dragging': isDragging }"
      :style="wrapperStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <!-- Carousel Items -->
      <div
        v-for="(item, index) in items"
        :key="index"
        class="mobile-carousel-item"
        :class="{ 'mobile-carousel-item-active': index === currentIndex }"
        :style="getItemStyle(index)"
      >
        <slot :item="item" :index="index" :isActive="index === currentIndex">
          <div class="mobile-carousel-item-content">
            {{ item }}
          </div>
        </slot>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <div v-if="showArrows" class="mobile-carousel-arrows">
      <button
        class="mobile-carousel-arrow mobile-carousel-arrow-prev"
        :disabled="!canGoPrev"
        @click="goToPrev"
        aria-label="Previous slide"
      >
        <UIcon name="i-lucide-chevron-left" class="mobile-carousel-arrow-icon" />
      </button>
      
      <button
        class="mobile-carousel-arrow mobile-carousel-arrow-next"
        :disabled="!canGoNext"
        @click="goToNext"
        aria-label="Next slide"
      >
        <UIcon name="i-lucide-chevron-right" class="mobile-carousel-arrow-icon" />
      </button>
    </div>

    <!-- Pagination Dots -->
    <div v-if="showDots && items.length > 1" class="mobile-carousel-dots">
      <button
        v-for="(item, index) in items"
        :key="index"
        class="mobile-carousel-dot"
        :class="{ 'mobile-carousel-dot-active': index === currentIndex }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>

    <!-- Progress Bar -->
    <div v-if="showProgress" class="mobile-carousel-progress">
      <div class="mobile-carousel-progress-bar">
        <div
          class="mobile-carousel-progress-fill"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Auto-play Indicator -->
    <div v-if="autoplay && showAutoplayIndicator" class="mobile-carousel-autoplay">
      <div class="mobile-carousel-autoplay-indicator">
        <UIcon name="i-lucide-play" class="mobile-carousel-autoplay-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  // Data
  items: {
    type: Array,
    required: true
  },
  
  // Behavior
  autoplay: {
    type: Boolean,
    default: false
  },
  autoplayInterval: {
    type: Number,
    default: 5000
  },
  loop: {
    type: Boolean,
    default: true
  },
  
  // Display
  showArrows: {
    type: Boolean,
    default: true
  },
  showDots: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  showAutoplayIndicator: {
    type: Boolean,
    default: false
  },
  
  // Touch/Swipe
  enableSwipe: {
    type: Boolean,
    default: true
  },
  swipeThreshold: {
    type: Number,
    default: 50
  },
  
  // Animation
  transitionDuration: {
    type: Number,
    default: 300
  },
  easing: {
    type: String,
    default: 'ease-out'
  }
})

// Emits
const emit = defineEmits<{
  slideChange: [index: number]
  slideStart: [index: number]
  slideEnd: [index: number]
}>()

// Refs
const carouselContainer = ref<HTMLDivElement>()
const currentIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const translateX = ref(0)
const autoplayTimer = ref<NodeJS.Timeout | null>(null)

// Computed
const canGoPrev = computed(() => {
  return props.loop || currentIndex.value > 0
})

const canGoNext = computed(() => {
  return props.loop || currentIndex.value < props.items.length - 1
})

const progressPercentage = computed(() => {
  return ((currentIndex.value + 1) / props.items.length) * 100
})

const wrapperStyle = computed(() => {
  return {
    transform: `translateX(${translateX.value}px)`,
    transition: isDragging.value ? 'none' : `transform ${props.transitionDuration}ms ${props.easing}`
  }
})

// Methods
const getItemStyle = (index: number) => {
  return {
    width: '100%',
    flexShrink: 0
  }
}

const goToSlide = (index: number) => {
  if (index === currentIndex.value) return
  
  const prevIndex = currentIndex.value
  currentIndex.value = index
  updateTranslateX()
  
  emit('slideStart', index)
  emit('slideChange', index)
  
  setTimeout(() => {
    emit('slideEnd', index)
  }, props.transitionDuration)
}

const goToNext = () => {
  if (!canGoNext.value) return
  
  const nextIndex = props.loop 
    ? (currentIndex.value + 1) % props.items.length
    : currentIndex.value + 1
  
  goToSlide(nextIndex)
}

const goToPrev = () => {
  if (!canGoPrev.value) return
  
  const prevIndex = props.loop
    ? currentIndex.value === 0 ? props.items.length - 1 : currentIndex.value - 1
    : currentIndex.value - 1
  
  goToSlide(prevIndex)
}

const updateTranslateX = () => {
  if (!carouselContainer.value) return
  
  const containerWidth = carouselContainer.value.offsetWidth
  translateX.value = -currentIndex.value * containerWidth
}

const startAutoplay = () => {
  if (!props.autoplay) return
  
  clearAutoplay()
  autoplayTimer.value = setInterval(() => {
    goToNext()
  }, props.autoplayInterval)
}

const clearAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

// Touch/Mouse handlers
const handleTouchStart = (event: TouchEvent) => {
  if (!props.enableSwipe) return
  
  isDragging.value = true
  startX.value = event.touches[0].clientX
  currentX.value = startX.value
  clearAutoplay()
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || !props.enableSwipe) return
  
  event.preventDefault()
  currentX.value = event.touches[0].clientX
  const deltaX = currentX.value - startX.value
  translateX.value = -currentIndex.value * (carouselContainer.value?.offsetWidth || 0) + deltaX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  const deltaX = currentX.value - startX.value
  
  if (Math.abs(deltaX) > props.swipeThreshold) {
    if (deltaX > 0) {
      goToPrev()
    } else {
      goToNext()
    }
  } else {
    updateTranslateX()
  }
  
  if (props.autoplay) {
    startAutoplay()
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (!props.enableSwipe) return
  
  isDragging.value = true
  startX.value = event.clientX
  currentX.value = startX.value
  clearAutoplay()
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !props.enableSwipe) return
  
  event.preventDefault()
  currentX.value = event.clientX
  const deltaX = currentX.value - startX.value
  translateX.value = -currentIndex.value * (carouselContainer.value?.offsetWidth || 0) + deltaX
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  const deltaX = currentX.value - startX.value
  
  if (Math.abs(deltaX) > props.swipeThreshold) {
    if (deltaX > 0) {
      goToPrev()
    } else {
      goToNext()
    }
  } else {
    updateTranslateX()
  }
  
  if (props.autoplay) {
    startAutoplay()
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goToPrev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    goToNext()
  }
}

// Lifecycle
onMounted(() => {
  updateTranslateX()
  startAutoplay()
  document.addEventListener('keydown', handleKeydown)
  
  // Handle resize
  window.addEventListener('resize', updateTranslateX)
})

onUnmounted(() => {
  clearAutoplay()
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateTranslateX)
})

// Watch for autoplay changes
watch(() => props.autoplay, (newValue) => {
  if (newValue) {
    startAutoplay()
  } else {
    clearAutoplay()
  }
})

// Watch for items changes
watch(() => props.items, () => {
  if (currentIndex.value >= props.items.length) {
    currentIndex.value = Math.max(0, props.items.length - 1)
  }
  updateTranslateX()
})
</script>

<style scoped>
/* Mobile Carousel Base Styles */
.mobile-carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mobile-carousel-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
}

.mobile-carousel-wrapper.mobile-carousel-dragging {
  cursor: grabbing;
}

.mobile-carousel-item {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.mobile-carousel-item-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--mobile-xl);
  text-align: center;
}

/* Navigation Arrows */
.mobile-carousel-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 var(--mobile-md);
  pointer-events: none;
  z-index: 2;
}

.mobile-carousel-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--mobile-transition);
  pointer-events: all;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.mobile-carousel-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.mobile-carousel-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-carousel-arrow-icon {
  width: 20px;
  height: 20px;
}

/* Pagination Dots */
.mobile-carousel-dots {
  position: absolute;
  bottom: var(--mobile-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--mobile-sm);
  z-index: 2;
}

.mobile-carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: var(--mobile-transition);
}

.mobile-carousel-dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.mobile-carousel-dot-active {
  background: var(--mobile-primary);
  transform: scale(1.2);
}

/* Progress Bar */
.mobile-carousel-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.mobile-carousel-progress-bar {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mobile-carousel-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mobile-primary), var(--mobile-secondary));
  transition: width 0.3s ease;
}

/* Auto-play Indicator */
.mobile-carousel-autoplay {
  position: absolute;
  top: var(--mobile-md);
  right: var(--mobile-md);
  z-index: 2;
}

.mobile-carousel-autoplay-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.mobile-carousel-autoplay-icon {
  width: 16px;
  height: 16px;
  color: white;
}

/* Dark Mode Adjustments */
.dark .mobile-carousel-container {
  background: var(--surface);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dark .mobile-carousel-arrow {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.dark .mobile-carousel-arrow:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
}

.dark .mobile-carousel-dot {
  background: rgba(255, 255, 255, 0.3);
}

.dark .mobile-carousel-dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

.dark .mobile-carousel-progress {
  background: rgba(255, 255, 255, 0.1);
}

.dark .mobile-carousel-autoplay-indicator {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-carousel-arrow {
    width: 32px;
    height: 32px;
  }
  
  .mobile-carousel-arrow-icon {
    width: 16px;
    height: 16px;
  }
  
  .mobile-carousel-arrows {
    padding: 0 var(--mobile-sm);
  }
}

@media (min-width: 768px) {
  .mobile-carousel-arrow {
    width: 48px;
    height: 48px;
  }
  
  .mobile-carousel-arrow-icon {
    width: 24px;
    height: 24px;
  }
}

/* Performance Optimizations */
.mobile-carousel-wrapper {
  will-change: transform;
}

.mobile-carousel-item {
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-carousel-wrapper {
    transition: none;
  }
  
  .mobile-carousel-progress-fill {
    transition: none;
  }
}

/* Focus Styles for Accessibility */
.mobile-carousel-arrow:focus-visible,
.mobile-carousel-dot:focus-visible {
  outline: 2px solid var(--mobile-primary);
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-carousel-arrow {
    border: 2px solid currentColor;
  }
  
  .mobile-carousel-dot {
    border: 2px solid currentColor;
  }
}
</style>

