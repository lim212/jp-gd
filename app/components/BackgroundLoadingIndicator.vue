<template>
  <Transition name="slide-down">
    <div 
      v-if="isLoading" 
      class="background-loading-indicator"
      role="status"
      aria-live="polite"
      :aria-label="`Background loading: ${currentProgress}% complete. Loading ${currentResourceName}`"
    >
      <div class="indicator-content">
        <!-- Progress Circle -->
        <div class="progress-circle">
          <svg class="circle-svg" viewBox="0 0 36 36">
            <path
              class="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="2"
            />
            <path
              class="circle-progress"
              :stroke-dasharray="`${currentProgress}, 100`"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="50%" stop-color="#8b5cf6" />
                <stop offset="100%" stop-color="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          <!-- Percentage Text -->
          <div class="percentage-text">{{ currentProgress }}%</div>
        </div>
        
        <!-- Loading Info -->
        <div class="loading-info">
          <div class="loading-label">
            <span class="label-text">{{ loadingPhase }}</span>
            <div class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="resource-name">{{ currentResourceName }}</div>
        </div>
        
        <!-- Close Button (optional) -->
        <button 
          v-if="canClose"
          @click="closeIndicator"
          class="close-btn"
          aria-label="Tutup indikator loading"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  autoHide: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['complete', 'close'])

// State
const isLoading = ref(false)
const currentProgress = ref(0)
const currentResourceName = ref('Initializing...')
const loadingPhase = ref('Loading')
const canClose = ref(false)

// Resources to load (small to large)
const resources = ref([
  // Phase 1: Critical small files (fonts, icons)
  { name: 'Fonts', size: 320, loaded: false, phase: 'Essential' },
  { name: 'Icons', size: 85, loaded: false, phase: 'Essential' },
  
  // Phase 2: CSS files
  { name: 'Main Styles', size: 450, loaded: false, phase: 'Styling' },
  { name: 'Component Styles', size: 380, loaded: false, phase: 'Styling' },
  
  // Phase 3: JavaScript
  { name: 'Core Scripts', size: 890, loaded: false, phase: 'Scripts' },
  { name: 'Vendor Scripts', size: 1200, loaded: false, phase: 'Scripts' },
  { name: 'Components', size: 650, loaded: false, phase: 'Scripts' },
  
  // Phase 4: Images (progressive)
  { name: 'Critical Images', size: 2400, loaded: false, phase: 'Media' },
  { name: 'Hero Images', size: 3800, loaded: false, phase: 'Media' },
  { name: 'Content Images', size: 4200, loaded: false, phase: 'Media' },
  { name: 'Background Images', size: 2900, loaded: false, phase: 'Media' }
])

// Calculate total size
const totalSize = computed(() => 
  resources.value.reduce((sum, r) => sum + r.size, 0)
)

// Progressive loading simulation
let loadingTimer: any = null

const startProgressiveLoading = () => {
  isLoading.value = true
  loadResources()
}

const loadResources = async () => {
  for (let i = 0; i < resources.value.length; i++) {
    const resource = resources.value[i]
    
    // Update current resource info
    currentResourceName.value = resource.name
    loadingPhase.value = resource.phase
    
    // Simulate loading time based on size
    const loadTime = (resource.size / 100) * 50 // Proportional to size
    
    // Animate progress
    await new Promise<void>((resolve) => {
      let progress = 0
      const increment = 100 / (loadTime / 50)
      
      const progressTimer = setInterval(() => {
        progress += increment
        
        if (progress >= 100) {
          clearInterval(progressTimer)
          resource.loaded = true
          
          // Calculate overall progress
          const loadedSize = resources.value
            .filter(r => r.loaded)
            .reduce((sum, r) => sum + r.size, 0)
          currentProgress.value = Math.round((loadedSize / totalSize.value) * 100)
          
          resolve()
        }
      }, 50)
    })
    
    // Small delay between resources
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // All resources loaded
  currentResourceName.value = 'Complete!'
  loadingPhase.value = 'Done'
  canClose.value = true
  
  // Auto hide after 2 seconds if enabled
  if (props.autoHide) {
    setTimeout(() => {
      isLoading.value = false
      emit('complete')
    }, 2000)
  }
}

const closeIndicator = () => {
  isLoading.value = false
  emit('close')
}

// Watch for visibility changes
watch(() => props.visible, (visible) => {
  if (visible && !isLoading.value) {
    startProgressiveLoading()
  } else if (!visible) {
    isLoading.value = false
  }
})

// Auto start if visible on mount
onMounted(() => {
  if (props.visible) {
    startProgressiveLoading()
  }
})

// Cleanup
onUnmounted(() => {
  if (loadingTimer) {
    clearInterval(loadingTimer)
  }
})

// Expose methods
defineExpose({
  startProgressiveLoading,
  closeIndicator
})
</script>

<style scoped>
/* Container - Top Right Position */
.background-loading-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  left: auto;
  transform: none;
  z-index: 9998; /* Below main loading screen but above content */
  
  /* Glassmorphism style */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 12px 20px;
  
  /* Shadow for depth */
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 8px 40px rgba(0, 0, 0, 0.06);
  
  /* Smooth animations */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode support */
.dark .background-loading-indicator {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Content Layout */
.indicator-content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
}

/* Progress Circle */
.progress-circle {
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.circle-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  opacity: 0.2;
}

.circle-progress {
  transition: stroke-dasharray 0.3s ease;
}

.percentage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 700;
  color: #3b82f6;
  pointer-events: none;
}

.dark .percentage-text {
  color: #60a5fa;
}

/* Loading Info */
.loading-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.loading-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-text {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark .label-text {
  color: #94a3b8;
}

/* Loading dots animation */
.loading-dots {
  display: flex;
  gap: 3px;
  align-items: center;
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #3b82f6;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Resource Name */
.resource-name {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .resource-name {
  color: #e2e8f0;
}

/* Close Button */
.close-btn {
  width: 24px;
  height: 24px;
  padding: 4px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #0f172a;
}

.dark .close-btn {
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
}

.dark .close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.close-btn svg {
  width: 100%;
  height: 100%;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .background-loading-indicator {
    top: 10px;
    right: 10px;
    left: 10px;
    transform: none;
    max-width: calc(100vw - 20px);
  }
  
  .indicator-content {
    min-width: 0;
    width: 100%;
  }
  
  .loading-info {
    max-width: calc(100% - 80px);
  }
}

/* Hover effect */
.background-loading-indicator:hover {
  box-shadow: 
    0 6px 25px rgba(0, 0, 0, 0.1),
    0 10px 50px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .background-loading-indicator:hover {
    transform: translateY(-1px);
  }
}

/* Pulse animation when loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.background-loading-indicator {
  animation: pulse 2s ease-in-out infinite;
}
</style>


