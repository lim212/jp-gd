<template>
  <div 
    class="mobile-pull-refresh-container" 
    :class="containerClasses"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <!-- Pull Indicator -->
    <div 
      class="mobile-pull-refresh-indicator" 
      :class="indicatorClasses"
      :style="indicatorStyle"
    >
      <div class="mobile-pull-refresh-icon-container">
        <Icon 
          :name="refreshIcon" 
          class="mobile-pull-refresh-icon"
          :class="{ 'mobile-pull-refresh-icon-rotating': isRefreshing }"
        />
      </div>
      
      <div v-if="showText" class="mobile-pull-refresh-text">
        {{ refreshText }}
      </div>
      
      <div v-if="showProgress" class="mobile-pull-refresh-progress">
        <div class="mobile-pull-refresh-progress-bar" :style="progressStyle"></div>
      </div>
    </div>

    <!-- Content -->
    <div 
      class="mobile-pull-refresh-content" 
      :class="contentClasses"
      :style="contentStyle"
    >
      <slot :isRefreshing="isRefreshing" :pullDistance="pullDistance"></slot>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isRefreshing && showLoadingOverlay" class="mobile-pull-refresh-loading-overlay">
      <div class="mobile-pull-refresh-loading-content">
        <div class="mobile-pull-refresh-spinner">
          <div class="mobile-pull-refresh-spinner-circle"></div>
        </div>
        <div v-if="loadingText" class="mobile-pull-refresh-loading-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  // Pull behavior
  threshold: {
    type: Number,
    default: 80
  },
  maxPullDistance: {
    type: Number,
    default: 120
  },
  resistance: {
    type: Number,
    default: 2.5
  },
  
  // Visual feedback
  showText: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  showLoadingOverlay: {
    type: Boolean,
    default: false
  },
  
  // Text content
  pullText: {
    type: String,
    default: 'Pull to refresh'
  },
  releaseText: {
    type: String,
    default: 'Release to refresh'
  },
  refreshingText: {
    type: String,
    default: 'Refreshing...'
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  
  // Icons
  pullIcon: {
    type: String,
    default: 'lucide:arrow-down'
  },
  releaseIcon: {
    type: String,
    default: 'lucide:arrow-up'
  },
  refreshIcon: {
    type: String,
    default: 'lucide:refresh-cw'
  },
  
  // Animation
  animationDuration: {
    type: Number,
    default: 300
  },
  bounceBackDuration: {
    type: Number,
    default: 400
  },
  
  // Behavior
  disabled: {
    type: Boolean,
    default: false
  },
  hapticFeedback: {
    type: Boolean,
    default: true
  },
  
  // Styling
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'minimal', 'modern', 'classic'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  }
})

// Emits
const emit = defineEmits<{
  'refresh': []
  'pull': [distance: number, progress: number]
  'release': [distance: number]
  'cancel': []
}>()

// Refs
const isRefreshing = ref(false)
const isPulling = ref(false)
const pullDistance = ref(0)
const startY = ref(0)
const currentY = ref(0)
const isMouseDown = ref(false)
const hasTriggered = ref(false)

// Computed
const containerClasses = computed(() => [
  `mobile-pull-refresh-${props.variant}`,
  `mobile-pull-refresh-${props.color}`,
  {
    'mobile-pull-refresh-disabled': props.disabled,
    'mobile-pull-refresh-pulling': isPulling.value,
    'mobile-pull-refresh-refreshing': isRefreshing.value
  }
])

const indicatorClasses = computed(() => [
  `mobile-pull-refresh-indicator-${props.variant}`,
  {
    'mobile-pull-refresh-indicator-visible': isPulling.value || isRefreshing.value,
    'mobile-pull-refresh-indicator-refreshing': isRefreshing.value
  }
])

const contentClasses = computed(() => [
  {
    'mobile-pull-refresh-content-pulling': isPulling.value,
    'mobile-pull-refresh-content-refreshing': isRefreshing.value
  }
])

const refreshText = computed(() => {
  if (isRefreshing.value) return props.refreshingText
  if (pullDistance.value >= props.threshold) return props.releaseText
  return props.pullText
})

const refreshIcon = computed(() => {
  if (isRefreshing.value) return props.refreshIcon
  if (pullDistance.value >= props.threshold) return props.releaseIcon
  return props.pullIcon
})

const indicatorStyle = computed(() => {
  const translateY = Math.min(pullDistance.value, props.maxPullDistance)
  const opacity = Math.min(pullDistance.value / props.threshold, 1)
  const scale = Math.min(1 + (pullDistance.value / props.threshold) * 0.1, 1.1)
  
  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity: opacity,
    transition: isRefreshing.value ? `all ${props.animationDuration}ms ease` : 'none'
  }
})

const contentStyle = computed(() => {
  const translateY = Math.min(pullDistance.value, props.maxPullDistance)
  
  return {
    transform: `translateY(${translateY}px)`,
    transition: isRefreshing.value ? `transform ${props.animationDuration}ms ease` : 'none'
  }
})

const progressStyle = computed(() => {
  const progress = Math.min(pullDistance.value / props.threshold, 1)
  
  return {
    width: `${progress * 100}%`,
    transition: isRefreshing.value ? `width ${props.animationDuration}ms ease` : 'none'
  }
})

// Methods
const handleTouchStart = (event: TouchEvent) => {
  if (props.disabled || isRefreshing.value) return
  
  startY.value = event.touches[0].clientY
  currentY.value = startY.value
  isPulling.value = false
  hasTriggered.value = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (props.disabled || isRefreshing.value) return
  
  currentY.value = event.touches[0].clientY
  const deltaY = currentY.value - startY.value
  
  if (deltaY > 0 && window.scrollY === 0) {
    event.preventDefault()
    
    const resistance = Math.min(deltaY / props.resistance, props.maxPullDistance)
    pullDistance.value = resistance
    isPulling.value = true
    
    const progress = Math.min(resistance / props.threshold, 1)
    emit('pull', resistance, progress)
    
    // Haptic feedback when reaching threshold
    if (resistance >= props.threshold && !hasTriggered.value) {
      hasTriggered.value = true
      if (props.hapticFeedback) {
        triggerHapticFeedback('light')
      }
    } else if (resistance < props.threshold && hasTriggered.value) {
      hasTriggered.value = false
    }
  }
}

const handleTouchEnd = () => {
  if (props.disabled || isRefreshing.value) return
  
  if (isPulling.value) {
    if (pullDistance.value >= props.threshold) {
      triggerRefresh()
    } else {
      resetPull()
    }
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (props.disabled || isRefreshing.value) return
  
  startY.value = event.clientY
  currentY.value = startY.value
  isMouseDown.value = true
  isPulling.value = false
  hasTriggered.value = false
}

const handleMouseMove = (event: MouseEvent) => {
  if (props.disabled || isRefreshing.value || !isMouseDown.value) return
  
  currentY.value = event.clientY
  const deltaY = currentY.value - startY.value
  
  if (deltaY > 0 && window.scrollY === 0) {
    event.preventDefault()
    
    const resistance = Math.min(deltaY / props.resistance, props.maxPullDistance)
    pullDistance.value = resistance
    isPulling.value = true
    
    const progress = Math.min(resistance / props.threshold, 1)
    emit('pull', resistance, progress)
    
    // Haptic feedback when reaching threshold
    if (resistance >= props.threshold && !hasTriggered.value) {
      hasTriggered.value = true
      if (props.hapticFeedback) {
        triggerHapticFeedback('light')
      }
    } else if (resistance < props.threshold && hasTriggered.value) {
      hasTriggered.value = false
    }
  }
}

const handleMouseUp = () => {
  if (props.disabled || isRefreshing.value) return
  
  isMouseDown.value = false
  
  if (isPulling.value) {
    if (pullDistance.value >= props.threshold) {
      triggerRefresh()
    } else {
      resetPull()
    }
  }
}

const handleMouseLeave = () => {
  isMouseDown.value = false
  
  if (isPulling.value && !isRefreshing.value) {
    resetPull()
  }
}

const triggerRefresh = () => {
  isRefreshing.value = true
  isPulling.value = false
  
  emit('refresh')
  emit('release', pullDistance.value)
  
  if (props.hapticFeedback) {
    triggerHapticFeedback('medium')
  }
  
  // Auto reset after a delay
  setTimeout(() => {
    resetPull()
  }, 2000)
}

const resetPull = () => {
  isPulling.value = false
  pullDistance.value = 0
  hasTriggered.value = false
  
  setTimeout(() => {
    isRefreshing.value = false
  }, props.bounceBackDuration)
  
  emit('cancel')
}

const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    
    navigator.vibrate(patterns[type])
  }
}

// Public methods
const startRefresh = () => {
  if (!props.disabled && !isRefreshing.value) {
    triggerRefresh()
  }
}

const stopRefresh = () => {
  if (isRefreshing.value) {
    resetPull()
  }
}

// Expose methods
defineExpose({
  startRefresh,
  stopRefresh
})

// Lifecycle
onMounted(() => {
  // Prevent default pull-to-refresh behavior
  document.addEventListener('touchstart', preventDefault, { passive: false })
  document.addEventListener('touchmove', preventDefault, { passive: false })
})

onUnmounted(() => {
  document.removeEventListener('touchstart', preventDefault)
  document.removeEventListener('touchmove', preventDefault)
})

const preventDefault = (event: Event) => {
  if (isPulling.value) {
    event.preventDefault()
  }
}
</script>

<style scoped>
/* Mobile Pull to Refresh Base Styles */
.mobile-pull-refresh-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.mobile-pull-refresh-indicator {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-sm);
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-pull-refresh-indicator-visible {
  opacity: 1;
}

.mobile-pull-refresh-icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: var(--mobile-transition);
}

.mobile-pull-refresh-icon {
  width: 20px;
  height: 20px;
  color: var(--mobile-primary);
  transition: var(--mobile-transition);
}

.mobile-pull-refresh-icon-rotating {
  animation: mobile-pull-refresh-rotate 1s linear infinite;
}

@keyframes mobile-pull-refresh-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.mobile-pull-refresh-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.mobile-pull-refresh-progress {
  width: 60px;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.mobile-pull-refresh-progress-bar {
  height: 100%;
  background: var(--mobile-primary);
  border-radius: 2px;
  transition: width 0.2s ease;
}

.mobile-pull-refresh-content {
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease;
}

.mobile-pull-refresh-content-pulling {
  transition: none;
}

/* Loading Overlay */
.mobile-pull-refresh-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.mobile-pull-refresh-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-md);
}

.mobile-pull-refresh-spinner {
  width: 40px;
  height: 40px;
  position: relative;
}

.mobile-pull-refresh-spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 122, 0, 0.2);
  border-top-color: var(--mobile-primary);
  border-radius: 50%;
  animation: mobile-pull-refresh-spin 1s linear infinite;
}

@keyframes mobile-pull-refresh-spin {
  to {
    transform: rotate(360deg);
  }
}

.mobile-pull-refresh-loading-text {
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Variants */
.mobile-pull-refresh-minimal .mobile-pull-refresh-icon-container {
  background: transparent;
  box-shadow: none;
}

.mobile-pull-refresh-minimal .mobile-pull-refresh-icon {
  color: var(--text-secondary);
}

.mobile-pull-refresh-modern .mobile-pull-refresh-icon-container {
  background: var(--mobile-primary);
  color: white;
}

.mobile-pull-refresh-modern .mobile-pull-refresh-icon {
  color: white;
}

.mobile-pull-refresh-classic .mobile-pull-refresh-icon-container {
  background: var(--background);
  border: 2px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Color Variants */
.mobile-pull-refresh-primary .mobile-pull-refresh-icon,
.mobile-pull-refresh-primary .mobile-pull-refresh-progress-bar,
.mobile-pull-refresh-primary .mobile-pull-refresh-spinner-circle {
  color: var(--mobile-primary);
  border-top-color: var(--mobile-primary);
  background: var(--mobile-primary);
}

.mobile-pull-refresh-secondary .mobile-pull-refresh-icon,
.mobile-pull-refresh-secondary .mobile-pull-refresh-progress-bar,
.mobile-pull-refresh-secondary .mobile-pull-refresh-spinner-circle {
  color: var(--mobile-secondary);
  border-top-color: var(--mobile-secondary);
  background: var(--mobile-secondary);
}

.mobile-pull-refresh-success .mobile-pull-refresh-icon,
.mobile-pull-refresh-success .mobile-pull-refresh-progress-bar,
.mobile-pull-refresh-success .mobile-pull-refresh-spinner-circle {
  color: var(--mobile-success);
  border-top-color: var(--mobile-success);
  background: var(--mobile-success);
}

.mobile-pull-refresh-warning .mobile-pull-refresh-icon,
.mobile-pull-refresh-warning .mobile-pull-refresh-progress-bar,
.mobile-pull-refresh-warning .mobile-pull-refresh-spinner-circle {
  color: var(--mobile-warning);
  border-top-color: var(--mobile-warning);
  background: var(--mobile-warning);
}

.mobile-pull-refresh-error .mobile-pull-refresh-icon,
.mobile-pull-refresh-error .mobile-pull-refresh-progress-bar,
.mobile-pull-refresh-error .mobile-pull-refresh-spinner-circle {
  color: var(--mobile-error);
  border-top-color: var(--mobile-error);
  background: var(--mobile-error);
}

/* States */
.mobile-pull-refresh-disabled {
  pointer-events: none;
  opacity: 0.5;
}

.mobile-pull-refresh-pulling .mobile-pull-refresh-content {
  transition: none;
}

.mobile-pull-refresh-refreshing .mobile-pull-refresh-indicator {
  opacity: 1;
}

/* Dark Mode Adjustments */
.dark .mobile-pull-refresh-icon-container {
  background: var(--surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .mobile-pull-refresh-progress {
  background: rgba(255, 255, 255, 0.1);
}

.dark .mobile-pull-refresh-loading-overlay {
  background: rgba(0, 0, 0, 0.9);
}

.dark .mobile-pull-refresh-classic .mobile-pull-refresh-icon-container {
  background: var(--surface);
  border-color: var(--border);
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .mobile-pull-refresh-icon-container {
    width: 36px;
    height: 36px;
  }
  
  .mobile-pull-refresh-icon {
    width: 18px;
    height: 18px;
  }
  
  .mobile-pull-refresh-text {
    font-size: var(--mobile-text-xs);
  }
  
  .mobile-pull-refresh-progress {
    width: 50px;
    height: 3px;
  }
}

/* Performance Optimizations */
.mobile-pull-refresh-indicator,
.mobile-pull-refresh-content,
.mobile-pull-refresh-icon {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .mobile-pull-refresh-icon-rotating,
  .mobile-pull-refresh-spinner-circle {
    animation: none;
  }
  
  .mobile-pull-refresh-indicator,
  .mobile-pull-refresh-content,
  .mobile-pull-refresh-progress-bar {
    transition: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .mobile-pull-refresh-icon-container {
    border: 2px solid var(--mobile-primary);
  }
  
  .mobile-pull-refresh-progress {
    border: 1px solid var(--border);
  }
}
</style>

