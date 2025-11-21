<template>
  <Transition name="loading-fade" mode="out-in">
    <div v-if="isVisible && !isManuallyHidden" class="professional-loading-container" role="dialog" aria-modal="true" aria-label="Memuat konten">
      <!-- Animated Background -->
      <div class="loading-background" aria-hidden="true">
        <!-- Gradient waves -->
        <div class="gradient-wave wave-1"></div>
        <div class="gradient-wave wave-2"></div>
        <div class="gradient-wave wave-3"></div>
        
        <!-- Floating geometric shapes -->
        <div v-for="i in 15" :key="`shape-${i}`" class="floating-shape" 
          :style="{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 6}s`
          }"
        />
      </div>

      <div class="loading-content">
        <!-- Logo and Brand -->
        <div class="loading-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="url(#logo-gradient)" />
              <path d="M35 50 L50 65 L75 35" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3b82f6" />
                  <stop offset="50%" stop-color="#8b5cf6" />
                  <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="brand-title">JasaPembayaran.com</h1>
          <p class="brand-subtitle">Professional Loading Experience</p>
        </div>

        <!-- Main Loading Animation -->
        <div class="loading-animation">
          <div class="loading-spinner">
            <div class="spinner-ring ring-1"></div>
            <div class="spinner-ring ring-2"></div>
            <div class="spinner-ring ring-3"></div>
            <div class="spinner-center">
              <div class="loading-percentage">{{ Math.round(percent) }}%</div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${percent}%` }"></div>
          </div>
          <div class="progress-text">{{ Math.round(percent) }}% Complete</div>
        </div>

        <!-- Loading Stages -->
        <div class="loading-stages">
          <div v-for="(stage, index) in loadingStages" 
            :key="index" 
            class="loading-stage"
            :class="{ 
              'active': currentStageIndex >= index,
              'current': currentStageIndex === index 
            }"
          >
            <div class="stage-icon">
              <UIcon :name="stage.icon" class="stage-icon-svg" />
            </div>
            <div class="stage-content">
              <div class="stage-title">{{ stage.title }}</div>
              <div class="stage-description">{{ stage.description }}</div>
            </div>
            <div class="stage-status">
              <UIcon v-if="currentStageIndex > index || percent >= 100" name="i-lucide-check" class="status-icon completed" />
              <UIcon v-else-if="currentStageIndex === index && percent < 100" name="i-lucide-loader-2" class="status-icon loading" />
              <UIcon v-else name="i-lucide-clock" class="status-icon pending" />
            </div>
          </div>
        </div>

        <!-- Loading Statistics -->
        <div class="loading-stats">
          <div class="stat-item">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ formatTime(elapsedSeconds) }}</div>
              <div class="stat-label">Loading Time</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🚀</div>
            <div class="stat-content">
              <div class="stat-value">{{ loadingSpeed }} MB/s</div>
              <div class="stat-label">Speed</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{ dataTransferred }} MB</div>
              <div class="stat-label">Data Loaded</div>
            </div>
          </div>
        </div>

        <!-- Loading Tips -->
        <div class="loading-tips">
          <div class="tip-container">
            <UIcon name="i-lucide-lightbulb" class="tip-icon" />
            <div class="tip-text">{{ currentTip }}</div>
          </div>
        </div>

        <!-- Control Panel -->
        <div class="loading-controls">
          <button
            @click="togglePause"
            class="control-button pause-button"
            :class="{ 'paused': isPaused }"
            aria-label="Toggle loading"
          >
            <UIcon :name="isPaused ? 'i-lucide-play' : 'i-lucide-pause'" class="control-icon" />
            <span class="button-text">{{ isPaused ? 'Resume' : 'Pause' }}</span>
          </button>
          
          <button
            @click="closeLoading"
            class="control-button close-button"
            aria-label="Skip loading"
          >
            <UIcon name="i-lucide-x" class="control-icon" />
            <span class="button-text">Skip</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  isVisible: boolean
  approximateDurationSeconds?: number
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  approximateDurationSeconds: 3,
  message: 'Loading...'
})

const emit = defineEmits<{
  progress: [value: number]
  finished: []
}>()

// Loading state
const percent = ref(0)
const elapsedSeconds = ref(0)
const isPaused = ref(false)
const isManuallyHidden = ref(false)
const currentStageIndex = ref(0)
const currentTipIndex = ref(0)
const loadingSpeed = ref(0)
const dataTransferred = ref(0)

// Timer reference
let timer: number | null = null
let pausedElapsed = 0

// Loading stages
const loadingStages = ref([
  {
    icon: 'i-lucide-palette',
    title: 'Loading Styles',
    description: 'Applying visual themes and layouts'
  },
  {
    icon: 'i-lucide-code',
    title: 'Loading Scripts',
    description: 'Initializing application logic'
  },
  {
    icon: 'i-lucide-image',
    title: 'Loading Assets',
    description: 'Downloading images and media'
  },
  {
    icon: 'i-lucide-database',
    title: 'Loading Content',
    description: 'Fetching data and content'
  },
  {
    icon: 'i-lucide-check-circle',
    title: 'Finalizing',
    description: 'Completing setup and optimization'
  }
])

// Loading tips
const loadingTips = ref([
  'Tahukah Anda? Kami melayani 24/7 untuk kemudahan Anda',
  'Tip: Simpan halaman ini untuk akses cepat di kemudian hari',
  'Kami telah melayani ribuan pelanggan sejak 2011',
  'Keamanan transaksi Anda adalah prioritas utama kami',
  'Semua transaksi diproses dengan enkripsi tingkat tinggi',
  'Loading cepat berkat optimasi server terbaru',
  'Gunakan dark mode untuk pengalaman yang lebih nyaman',
  'Semua data Anda dilindungi dengan SSL 256-bit',
  'Support multi-bahasa tersedia 24/7',
  'Download aplikasi mobile untuk akses lebih mudah'
])

// Computed properties
const currentTip = computed(() => loadingTips.value[currentTipIndex.value])

// Format time helper
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Update loading statistics
const updateStats = () => {
  // Simulate realistic loading speed
  const baseSpeed = 2.5 + Math.random() * 1.5
  loadingSpeed.value = Math.round(baseSpeed * 10) / 10
  
  // Calculate data transferred based on progress
  const totalData = 15.2 // MB
  dataTransferred.value = Math.round((percent.value / 100) * totalData * 10) / 10
}

// Update current stage based on progress
const updateCurrentStage = () => {
  // If progress is 100%, all stages should be complete
  if (percent.value >= 100) {
    currentStageIndex.value = loadingStages.value.length // Set to length so all stages show as complete
    return
  }
  
  const stageProgress = percent.value / 100
  const stageIndex = Math.floor(stageProgress * loadingStages.value.length)
  currentStageIndex.value = Math.min(stageIndex, loadingStages.value.length - 1)
}

// Tip rotation
let tipTimer: number | null = null
const startTipRotation = () => {
  tipTimer = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % loadingTips.value.length
  }, 3000) as unknown as number
}

const stopTipRotation = () => {
  if (tipTimer) {
    clearInterval(tipTimer)
    tipTimer = null
  }
}

// Main loading function
function start() {
  if (timer) return
  
  const startTime = Date.now()
  
  timer = setInterval(() => {
    if (isPaused.value) {
      pausedElapsed += 0.1
      return
    }
    
    elapsedSeconds.value = (Date.now() - startTime) / 1000 - pausedElapsed
    
    // Smooth progress calculation
    const progressRate = 100 / props.approximateDurationSeconds
    const newPercent = Math.min(elapsedSeconds.value * progressRate, 100)
    
    percent.value = newPercent
    updateCurrentStage()
    updateStats()
    
    try {
      emit('progress', newPercent)
    } catch {}
    
    // Complete loading
    if (elapsedSeconds.value >= props.approximateDurationSeconds || percent.value >= 100) {
      percent.value = 100
      // Mark all stages as complete (set to length so all stages show checkmark)
      currentStageIndex.value = loadingStages.value.length
      updateCurrentStage() // Ensure stage is updated
      
      try {
        emit('progress', 100)
      } catch {}
      
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      stopTipRotation()
      
      // Force hide immediately
      isManuallyHidden.value = true
      
      // Emit finished immediately - multiple times to ensure it's received
      let finishedEmitted = false
      try {
        emit('finished')
        finishedEmitted = true
        console.log('✅ Finished event emitted (immediate)')
      } catch (e) {
        console.warn('Failed to emit finished:', e)
      }
      
      // Fallback 1: emit after very short delay (100ms)
      setTimeout(() => {
        if (props.isVisible || !finishedEmitted) {
          try {
            emit('finished')
            finishedEmitted = true
            console.log('✅ Finished event emitted (fallback 1)')
          } catch {}
        }
      }, 100)
      
      // Fallback 2: force emit after short delay (300ms)
      setTimeout(() => {
        if (props.isVisible) {
          console.log('⚠️ Force emitting finished event (fallback 2)')
          try {
            emit('finished')
          } catch {}
        }
      }, 300)
      
      // Fallback 3: final attempt (500ms)
      setTimeout(() => {
        if (props.isVisible) {
          console.log('⚠️ Final attempt to emit finished event (fallback 3)')
          try {
            emit('finished')
          } catch {}
        }
      }, 500)
    }
  }, 100) as unknown as number
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  stopTipRotation()
  
  if (!isPaused.value) {
    percent.value = 0
    elapsedSeconds.value = 0
    pausedElapsed = 0
    currentStageIndex.value = 0
    currentTipIndex.value = 0
  }
}

function togglePause() {
  isPaused.value = !isPaused.value
}

function closeLoading() {
  isManuallyHidden.value = true
  stop()
  setTimeout(() => {
    emit('finished')
  }, 100)
}

// Watch for visibility changes
watch(() => props.isVisible, (v: boolean) => {
  if (v && !isManuallyHidden.value) {
    // Reset state when starting
    percent.value = 0
    elapsedSeconds.value = 0
    currentStageIndex.value = 0
    isManuallyHidden.value = false
    start()
    startTipRotation()
    
    // Safety fallback 1: force finish if stuck at 100% for more than 0.5 seconds
    const safetyTimeout1 = setTimeout(() => {
      if (percent.value >= 100 && props.isVisible) {
        console.log('⚠️ Loading stuck at 100%, forcing finish (safety 1)...')
        isManuallyHidden.value = true
        try {
          emit('finished')
        } catch {}
      }
    }, (props.approximateDurationSeconds * 1000) + 500)
    
    // Safety fallback 2: additional check after 1 second
    const safetyTimeout2 = setTimeout(() => {
      if (percent.value >= 100 && props.isVisible) {
        console.log('⚠️ Loading still stuck, forcing finish (safety 2)...')
        isManuallyHidden.value = true
        try {
          emit('finished')
        } catch {}
      }
    }, (props.approximateDurationSeconds * 1000) + 1000)
    
    // Safety fallback 3: maximum timeout - force finish no matter what (max 4 seconds)
    const safetyTimeout3 = setTimeout(() => {
      if (props.isVisible) {
        console.log('⚠️ Maximum timeout reached, forcing finish (safety 3)...')
        isManuallyHidden.value = true
        try {
          emit('finished')
        } catch {}
      }
    }, Math.max((props.approximateDurationSeconds * 1000) + 2000, 4000))
    
    // Cleanup on unmount
    onBeforeUnmount(() => {
      clearTimeout(safetyTimeout1)
      clearTimeout(safetyTimeout2)
      clearTimeout(safetyTimeout3)
    })
  } else {
    stop()
  }
}, { immediate: true })

onMounted(() => {
  if (props.isVisible) {
    start()
    startTipRotation()
  }
})

onBeforeUnmount(() => {
  stop()
})
</script>

<style scoped>
/* =====================================================
   PROFESSIONAL LOADING SCREEN - CLEAN & MODERN
   ===================================================== */

/* Container */
.professional-loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

/* Animated Background */
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(139, 92, 246, 0.1) 25%, 
    rgba(6, 182, 212, 0.1) 50%, 
    rgba(34, 197, 94, 0.1) 75%, 
    rgba(59, 130, 246, 0.1) 100%);
  animation: waveFloat 8s ease-in-out infinite;
}

.wave-1 {
  top: -50%;
  left: -50%;
  animation-delay: 0s;
}

.wave-2 {
  top: -50%;
  left: -50%;
  animation-delay: 2s;
  animation-duration: 10s;
}

.wave-3 {
  top: -50%;
  left: -50%;
  animation-delay: 4s;
  animation-duration: 12s;
}

.floating-shape {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: floatShape 6s ease-in-out infinite;
}

.floating-shape:nth-child(odd) {
  background: rgba(59, 130, 246, 0.2);
  border-radius: 0;
  transform: rotate(45deg);
}

/* Loading Content */
.loading-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 600px;
  width: 90%;
  padding: 2rem;
}

/* Brand Section */
.loading-brand {
  margin-bottom: 3rem;
}

.brand-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  animation: logoFloat 3s ease-in-out infinite;
}

.brand-logo svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Loading Animation */
.loading-animation {
  margin-bottom: 2rem;
}

.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.ring-1 {
  border-top-color: #3b82f6;
  animation-duration: 1.5s;
}

.ring-2 {
  border-right-color: #8b5cf6;
  animation-duration: 2s;
  animation-direction: reverse;
}

.ring-3 {
  border-bottom-color: #06b6d4;
  animation-duration: 2.5s;
}

.spinner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.loading-percentage {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

/* Progress Bar */
.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Loading Stages */
.loading-stages {
  margin-bottom: 2rem;
}

.loading-stage {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.loading-stage.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.loading-stage.current {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.stage-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.stage-icon-svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.6);
}

.loading-stage.active .stage-icon-svg {
  color: #3b82f6;
}

.stage-content {
  flex: 1;
  text-align: left;
}

.stage-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.stage-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.stage-status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  width: 16px;
  height: 16px;
}

.status-icon.completed {
  color: #22c55e;
}

.status-icon.loading {
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

.status-icon.pending {
  color: rgba(255, 255, 255, 0.4);
}

/* Loading Statistics */
.loading-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Loading Tips */
.loading-tips {
  margin-bottom: 2rem;
}

.tip-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tip-icon {
  width: 20px;
  height: 20px;
  color: #fbbf24;
  margin-right: 0.75rem;
}

.tip-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* Control Panel */
.loading-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.control-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.pause-button.paused {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #22c55e;
}

.close-button {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.close-button:hover {
  background: rgba(239, 68, 68, 0.2);
}

.control-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

/* Animations */
@keyframes waveFloat {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -50%) rotate(180deg);
  }
}

@keyframes floatShape {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Loading fade transition */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.loading-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Enhanced Mobile Responsive Design */
@media (max-width: 768px) {
  .professional-loading-container {
    padding: 0.5rem;
    align-items: flex-start;
  }
  
  .loading-content {
    padding: 0.75rem;
    width: 100%;
    max-width: 100%;
    gap: 1rem;
  }
  
  .loading-brand {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .brand-logo {
    width: 60px;
    height: 60px;
    margin: 0 auto 0.75rem;
  }
  
  .brand-title {
    font-size: 1.25rem;
    line-height: 1.2;
  }
  
  .brand-subtitle {
    font-size: 0.8rem;
  }
  
  .loading-spinner {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
  }
  
  .spinner-center {
    width: 40px;
    height: 40px;
  }
  
  .loading-percentage {
    font-size: 0.9rem;
  }
  
  .progress-container {
    margin-bottom: 1rem;
  }
  
  .loading-stages {
    margin-bottom: 1rem;
  }
  
  .loading-stage {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .stage-icon {
    width: 28px;
    height: 28px;
    margin-right: 0.75rem;
  }
  
  .stage-icon-svg {
    width: 14px;
    height: 14px;
  }
  
  .stage-title {
    font-size: 0.9rem;
  }
  
  .stage-description {
    font-size: 0.75rem;
  }
  
  .loading-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .stat-item {
    padding: 0.5rem;
    flex-direction: row;
    justify-content: center;
  }
  
  .stat-icon {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
  }
  
  .stat-value {
    font-size: 0.9rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .loading-controls {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .control-button {
    width: 100%;
    max-width: 180px;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .control-icon {
    width: 14px;
    height: 14px;
    margin-right: 0.25rem;
  }
}

@media (max-width: 480px) {
  .professional-loading-container {
    padding: 0.25rem;
  }
  
  .loading-content {
    padding: 0.5rem;
    gap: 0.75rem;
  }
  
  .loading-brand {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .brand-logo {
    width: 50px;
    height: 50px;
    margin: 0 auto 0.5rem;
  }
  
  .brand-title {
    font-size: 1.1rem;
    line-height: 1.1;
  }
  
  .brand-subtitle {
    font-size: 0.7rem;
  }
  
  .loading-spinner {
    width: 70px;
    height: 70px;
    margin: 0 auto 0.75rem;
  }
  
  .spinner-center {
    width: 35px;
    height: 35px;
  }
  
  .loading-percentage {
    font-size: 0.8rem;
  }
  
  .progress-container {
    margin-bottom: 0.75rem;
  }
  
  .loading-stages {
    margin-bottom: 0.75rem;
  }
  
  .loading-stage {
    padding: 0.5rem;
    margin-bottom: 0.25rem;
    flex-direction: column;
    text-align: center;
  }
  
  .stage-icon {
    width: 24px;
    height: 24px;
    margin: 0 auto 0.5rem;
  }
  
  .stage-icon-svg {
    width: 12px;
    height: 12px;
  }
  
  .stage-title {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
  
  .stage-description {
    font-size: 0.7rem;
  }
  
  .loading-stats {
    grid-template-columns: 1fr;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
  
  .stat-item {
    padding: 0.25rem;
    flex-direction: row;
    justify-content: center;
  }
  
  .stat-icon {
    width: 20px;
    height: 20px;
    margin-right: 0.25rem;
  }
  
  .stat-value {
    font-size: 0.8rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
  
  .loading-controls {
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  
  .control-button {
    width: 100%;
    max-width: 160px;
    justify-content: center;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
  
  .control-icon {
    width: 12px;
    height: 12px;
    margin-right: 0.25rem;
  }
}
</style>

