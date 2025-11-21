<template>
  <Transition name="loading-fade" mode="out-in">
    <div v-if="isVisible" class="book-loading-container" role="dialog" aria-modal="true" aria-label="Memuat konten">
      <!-- Animated background particles -->
      <div class="loading-particles-bg" aria-hidden="true">
        <div v-for="i in 20" :key="i" class="particle-bg" 
          :style="{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }"
        />
      </div>

      <div class="book-loading">
        <!-- Main loading icon -->
        <div class="book-container" aria-hidden="true">
          <svg class="reading-book-svg" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
            <!-- Felix the Cat (cute) -->
            <g class="book">
              <!-- Ears -->
              <path class="cat-ear left" d="M78,63 L92,42 L100,66 Z" fill="#111" stroke="#333" stroke-width="2" />
              <path class="cat-ear right" d="M100,66 L108,42 L122,63 Z" fill="#111" stroke="#333" stroke-width="2" />

              <!-- Head -->
              <circle class="cat-head" cx="100" cy="90" r="32" fill="#111" stroke="#333" stroke-width="2" />

              <!-- Muzzle -->
              <ellipse class="cat-muzzle" cx="100" cy="98" rx="18" ry="14" fill="#fff" stroke="#e5e7eb" stroke-width="1" />

              <!-- Nose -->
              <path class="cat-nose" d="M100,92 l5,6 h-10 z" fill="#0ea5e9" stroke="#111" stroke-width="1" />

              <!-- Whiskers -->
              <g class="cat-whiskers">
                <line class="whisker wl1" x1="78" y1="96" x2="90" y2="94" stroke="#111" stroke-width="2" stroke-linecap="round" />
                <line class="whisker wl2" x1="78" y1="102" x2="90" y2="102" stroke="#111" stroke-width="2" stroke-linecap="round" />
                <line class="whisker wl3" x1="78" y1="108" x2="90" y2="110" stroke="#111" stroke-width="2" stroke-linecap="round" />
                <line class="whisker wr1" x1="122" y1="96" x2="110" y2="94" stroke="#111" stroke-width="2" stroke-linecap="round" />
                <line class="whisker wr2" x1="122" y1="102" x2="110" y2="102" stroke="#111" stroke-width="2" stroke-linecap="round" />
                <line class="whisker wr3" x1="122" y1="108" x2="110" y2="110" stroke="#111" stroke-width="2" stroke-linecap="round" />
              </g>

              <!-- Paws -->
              <g class="cat-paws">
                <ellipse cx="86" cy="122" rx="10" ry="6" fill="#fff" stroke="#e5e7eb" stroke-width="1" />
                <ellipse cx="114" cy="122" rx="10" ry="6" fill="#fff" stroke="#e5e7eb" stroke-width="1" />
              </g>

              <!-- Cute face -->
              <g class="book-face" aria-hidden="true">
                <g class="book-face-eye left">
                  <ellipse cx="92" cy="86" rx="8" ry="10" fill="#fff" />
                  <circle cx="94" cy="88" r="3.2" fill="#111" />
                </g>
                <g class="book-face-eye right">
                  <ellipse cx="108" cy="86" rx="8" ry="10" fill="#fff" />
                  <circle cx="106" cy="88" r="3.2" fill="#111" />
                </g>
                <path class="book-face-mouth" d="M90,104 Q100,112 110,104" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round" />
                <circle class="book-face-blush left" cx="84" cy="104" r="4" fill="#fda4af" opacity="0.85" />
                <circle class="book-face-blush right" cx="116" cy="104" r="4" fill="#fda4af" opacity="0.85" />
              </g>
            </g>

            <!-- Sparkles -->
            <g class="book-sparkles" aria-hidden="true">
              <g class="sparkle s1">
                <path d="M30,30 l4,8 l8,4 l-8,4 l-4,8 l-4,-8 l-8,-4 l8,-4 z" fill="#fde68a" opacity="0.9"/>
              </g>
              <g class="sparkle s2">
                <path d="M200,50 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 z" fill="#bfdbfe" opacity="0.9"/>
              </g>
              <g class="sparkle s3">
                <path d="M180,140 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 z" fill="#fbcfe8" opacity="0.9"/>
              </g>
            </g>

            <!-- Gradient definitions -->
            <defs>
              <linearGradient id="book-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fbbf24" />
                <stop offset="100%" stop-color="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Loading Stage Indicator -->
        <div class="loading-stage-indicator" aria-hidden="true">
          <div class="stage-dots">
            <div v-for="(stage, idx) in loadingStages" 
              :key="idx" 
              class="stage-dot" 
              :class="{ 
                'active': currentStageIndex >= idx,
                'current': currentStageIndex === idx 
              }"
            >
              <span class="stage-icon">{{ stage.icon }}</span>
            </div>
          </div>
          <p class="stage-text">{{ currentStage.text }}</p>
        </div>

        <div class="loading-stats" aria-live="polite">
        <div class="barcode" aria-hidden="true"></div>
        <div
          class="progress-bar"
          :style="{ '--p': displayPercent + '%' }"
          role="progressbar"
          :aria-valuenow="displayPercent"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="progress-fill"></div>
        </div>
        <!-- Super Detailed Resource Loading Tracker -->
        <div class="resource-tracker" v-if="showResourceTracker">
          <div class="tracker-header">
            <h3 class="tracker-title">
              <UIcon name="i-lucide-folder-open" class="tracker-icon" />
              Resource Loading Tracker
            </h3>
            <div class="tracker-stats">
              <span class="files-loaded">{{ loadedFiles }}/{{ totalFiles }} files</span>
              <span class="overall-progress">{{ overallProgress }}%</span>
            </div>
          </div>
          
          <div class="resource-categories">
            <div v-for="resource in resources" 
              :key="resource.name" 
              class="resource-category"
              :class="{ 'loaded': resource.loaded }"
            >
              <div class="category-header">
                <div class="category-info">
                  <span class="category-icon">{{ resource.icon }}</span>
                  <span class="category-name">{{ resource.name }}</span>
                  <span class="category-progress">{{ resource.progress }}%</span>
                </div>
                <div class="category-status">
                  <UIcon v-if="!resource.loaded" name="i-lucide-loader-2" class="spinning" />
                  <UIcon v-else name="i-lucide-check-circle-2" class="status-complete" />
                </div>
              </div>
              
              <div class="category-progress-bar">
                <div class="progress-fill" :style="{ width: resource.progress + '%' }"></div>
              </div>
              
              <div class="files-list">
                <div v-for="file in resource.files" 
                  :key="file.name" 
                  class="file-item"
                  :class="{ 'loaded': file.loaded }"
                >
                  <div class="file-icon">
                    <UIcon v-if="!file.loaded" name="i-lucide-file" class="file-icon-default" />
                    <UIcon v-else name="i-lucide-check" class="file-icon-loaded" />
                  </div>
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ file.size }}</span>
                  </div>
                  <div class="file-progress">
                    <div class="mini-progress-bar">
                      <div class="mini-progress-fill" :style="{ width: file.loaded ? '100%' : '0%' }"></div>
                    </div>
                    <span class="file-progress-text">{{ file.loaded ? '100%' : '0%' }}</span>
                  </div>
                  <div class="file-status">
                    <UIcon v-if="file.loaded" name="i-lucide-check-circle-2" class="file-check" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Tips -->
        <div class="loading-tips">
          <div class="tip-container">
            <UIcon name="i-lucide-lightbulb" class="tip-icon" />
            <p class="tip-text">{{ currentTip }}</p>
          </div>
        </div>

        <!-- Loading Mini-Game -->
        <div class="loading-minigame" v-if="showMiniGame">
          <div class="minigame-header">
            <UIcon name="i-lucide-gamepad-2" class="minigame-icon" />
            <span class="minigame-title">Loading Game</span>
            <button @click="showMiniGame = false" class="minigame-close">
              <UIcon name="i-lucide-x" />
            </button>
          </div>
          <div class="minigame-content">
            <div class="minigame-score">
              <span class="score-label">Score:</span>
              <span class="score-value">{{ miniGameScore }}</span>
            </div>
            <div class="minigame-area" @click="handleMiniGameClick">
              <div class="minigame-target" :style="{ left: miniGameTargetX + '%', top: miniGameTargetY + '%' }"></div>
            </div>
            <div class="minigame-instructions">
              <p>Click the target to score points!</p>
            </div>
          </div>
        </div>

        <div class="loading-message">
          <span>{{ currentMessage }}</span>
        </div>
        <div class="loading-text">
          <span class="percent">{{ displayPercent }}%</span>
          <span class="sep">•</span>
          <div class="countdown-container">
            <div class="countdown-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="countdown-clock">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="countdown-text">
              <span class="countdown-label">{{ $t('loading.countdown.label') }}</span>
              <span class="countdown-value" :key="remainingSeconds">{{ remainingSeconds }}</span>
              <span class="countdown-unit">{{ $t('loading.countdown.unit') }}</span>
            </div>
          </div>
        </div>

        <!-- Network Status & Speed -->
        <div class="network-status" :class="networkStatusClass">
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">{{ networkStatus }}</span>
          </div>
          <div class="speed-indicator">
            <div class="speed-display">
              <UIcon name="i-lucide-zap" class="speed-icon" />
              <span class="speed-value">{{ networkSpeed }}</span>
              <span class="speed-unit">{{ networkSpeedUnit }}</span>
            </div>
            <div class="data-display">
              <UIcon name="i-lucide-download" class="data-icon" />
              <span class="data-value">{{ dataTransferred }}</span>
              <span class="data-unit">{{ dataTransferredUnit }}</span>
            </div>
          </div>
        </div>

        <!-- Loading Statistics -->
        <div class="loading-statistics">
          <div class="stats-header">
            <UIcon name="i-lucide-bar-chart-3" class="stats-icon" />
            <h4 class="stats-title">Loading Statistics</h4>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-info">
                <span class="stat-label">Total Time</span>
                <span class="stat-value">{{ loadingStats.totalTime }}s</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🚀</div>
              <div class="stat-info">
                <span class="stat-label">Avg Speed</span>
                <span class="stat-value">{{ loadingStats.averageSpeed }} {{ networkSpeedUnit }}</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <span class="stat-label">Data</span>
                <span class="stat-value">{{ loadingStats.dataTransferred }} {{ dataTransferredUnit }}</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">⚡</div>
              <div class="stat-info">
                <span class="stat-label">Optimization</span>
                <span class="stat-value">{{ loadingStats.optimizationLevel }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Selector -->
        <div class="theme-selector">
          <div class="theme-header">
            <UIcon name="i-lucide-palette" class="theme-icon" />
            <span class="theme-title">Themes</span>
          </div>
          <div class="theme-options">
            <button
              v-for="theme in themes"
              :key="theme.id"
              @click="currentTheme = theme.id"
              class="theme-button"
              :class="{ 'active': currentTheme === theme.id }"
              :aria-label="`Switch to ${theme.name} theme`"
            >
              <span class="theme-emoji">{{ theme.icon }}</span>
              <span class="theme-name">{{ theme.name }}</span>
            </button>
          </div>
        </div>

        <div class="loading-controls">
          <button
            @click="toggleLoading"
            class="control-button"
            :aria-label="isPaused ? 'Mulai loading' : 'Berhenti loading'"
          >
            <span v-if="isPaused" class="button-content">
              <UIcon name="i-lucide-play" class="control-icon" />
              <span class="button-text">Mulai</span>
            </span>
            <span v-else class="button-content">
              <UIcon name="i-lucide-pause" class="control-icon" />
              <span class="button-text">Berhenti</span>
            </span>
          </button>
          <button
            @click="toggleSound"
            class="control-button sound-button"
            :class="{ 'sound-enabled': soundEnabled }"
            aria-label="Toggle sound effects"
          >
            <span class="button-content">
              <UIcon :name="soundEnabled ? 'i-lucide-volume-2' : 'i-lucide-volume-x'" class="control-icon" />
              <span class="button-text">{{ soundEnabled ? 'Sound On' : 'Sound Off' }}</span>
            </span>
          </button>
          <button
            @click="startMiniGame"
            class="control-button game-button"
            aria-label="Start mini game"
          >
            <span class="button-content">
              <UIcon name="i-lucide-gamepad-2" class="control-icon" />
              <span class="button-text">Game</span>
            </span>
          </button>
          <button
            @click="closeLoading"
            class="control-button close-button"
            aria-label="Tutup loading"
          >
            <span class="button-content">
              <UIcon name="i-lucide-x" class="control-icon" />
              <span class="button-text">Tutup</span>
            </span>
          </button>
        </div>
        </div><!-- End loading-stats -->
      </div><!-- End book-loading -->
    </div><!-- End book-loading-container -->
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted, computed } from 'vue'
import { loadingStages, initialResources } from '@/utils/loading-data'

const emit = defineEmits<{ (e: 'finished'): void; (e: 'progress', percent: number): void }>()
const props = defineProps({
  isVisible: { type: Boolean, default: true },
  approximateDurationSeconds: { type: Number, default: 2 },
  message: { type: String, default: 'Mohon tunggu sebentar...' }
})

const percent = ref(0)
const elapsedSeconds = ref(0)
const isPaused = ref(false)
const isManuallyHidden = ref(false)
const remainingSeconds = computed(() => Math.max(0, props.approximateDurationSeconds - elapsedSeconds.value))
let timer: number | null = null
let startMs = 0
let pausedElapsed = 0

// Ensure progress bar is always visible, even at 0%
const displayPercent = computed(() => Math.max(1, percent.value))

const currentStageIndex = computed(() => {
  const progress = percent.value
  if (progress < 25) return 0
  if (progress < 50) return 1
  if (progress < 75) return 2
  return 3
})

const currentStage = computed(() => loadingStages[currentStageIndex.value])

// Super detailed resources being loaded
const showResourceTracker = ref(true)
const resources = ref(JSON.parse(JSON.stringify(initialResources)))

// Detailed progress tracking
const totalFiles = computed(() => {
  return resources.value.reduce((total: number, resource: any) => total + resource.files.length, 0)
})

const loadedFiles = computed(() => {
  return resources.value.reduce((total: number, resource: any) => {
    return total + resource.files.filter((file: any) => file.loaded).length
  }, 0)
})

const overallProgress = computed(() => {
  return Math.round((loadedFiles.value / totalFiles.value) * 100)
})

// Update resource loading status with detailed progress and sound effects
watch(percent, (newPercent: number) => {
  // Styles (0-25%)
  if (newPercent >= 5 && !resources.value[0].files[0].loaded) {
    resources.value[0].files[0].loaded = true
    resources.value[0].progress = 25
    playSound('fileLoaded')
  }
  if (newPercent >= 10 && !resources.value[0].files[1].loaded) {
    resources.value[0].files[1].loaded = true
    resources.value[0].progress = 50
    playSound('fileLoaded')
  }
  if (newPercent >= 15 && !resources.value[0].files[2].loaded) {
    resources.value[0].files[2].loaded = true
    resources.value[0].progress = 75
    playSound('fileLoaded')
  }
  if (newPercent >= 20 && !resources.value[0].files[3].loaded) {
    resources.value[0].files[3].loaded = true
    resources.value[0].progress = 100
    resources.value[0].loaded = true
    playSound('categoryComplete')
  }

  // Scripts (25-50%)
  if (newPercent >= 30 && !resources.value[1].files[0].loaded) {
    resources.value[1].files[0].loaded = true
    resources.value[1].progress = 25
    playSound('fileLoaded')
  }
  if (newPercent >= 35 && !resources.value[1].files[1].loaded) {
    resources.value[1].files[1].loaded = true
    resources.value[1].progress = 50
    playSound('fileLoaded')
  }
  if (newPercent >= 40 && !resources.value[1].files[2].loaded) {
    resources.value[1].files[2].loaded = true
    resources.value[1].progress = 75
    playSound('fileLoaded')
  }
  if (newPercent >= 45 && !resources.value[1].files[3].loaded) {
    resources.value[1].files[3].loaded = true
    resources.value[1].progress = 100
    resources.value[1].loaded = true
    playSound('categoryComplete')
  }

  // Images (50-75%)
  if (newPercent >= 55 && !resources.value[2].files[0].loaded) {
    resources.value[2].files[0].loaded = true
    resources.value[2].progress = 25
    playSound('fileLoaded')
  }
  if (newPercent >= 60 && !resources.value[2].files[1].loaded) {
    resources.value[2].files[1].loaded = true
    resources.value[2].progress = 50
    playSound('fileLoaded')
  }
  if (newPercent >= 65 && !resources.value[2].files[2].loaded) {
    resources.value[2].files[2].loaded = true
    resources.value[2].progress = 75
    playSound('fileLoaded')
  }
  if (newPercent >= 70 && !resources.value[2].files[3].loaded) {
    resources.value[2].files[3].loaded = true
    resources.value[2].progress = 100
    resources.value[2].loaded = true
    playSound('categoryComplete')
  }

  // Content (75-100%)
  if (newPercent >= 80 && !resources.value[3].files[0].loaded) {
    resources.value[3].files[0].loaded = true
    resources.value[3].progress = 25
    playSound('fileLoaded')
  }
  if (newPercent >= 85 && !resources.value[3].files[1].loaded) {
    resources.value[3].files[1].loaded = true
    resources.value[3].progress = 50
    playSound('fileLoaded')
  }
  if (newPercent >= 90 && !resources.value[3].files[2].loaded) {
    resources.value[3].files[2].loaded = true
    resources.value[3].progress = 75
    playSound('fileLoaded')
  }
  if (newPercent >= 95 && !resources.value[3].files[3].loaded) {
    resources.value[3].files[3].loaded = true
    resources.value[3].progress = 100
    resources.value[3].loaded = true
    playSound('categoryComplete')
  }
})

// Enhanced loading tips with more variety
const loadingTips = [
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
]

// Sound effects with toggle - DISABLED BY DEFAULT
const soundEnabled = ref(false)

// Loading themes
const currentTheme = ref('default')
const themes = [
  { id: 'default', name: 'Default', icon: '🎨' },
  { id: 'neon', name: 'Neon', icon: '⚡' },
  { id: 'cyber', name: 'Cyber', icon: '🤖' },
  { id: 'minimalist', name: 'Minimalist', icon: '✨' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' }
]

// Loading statistics
const loadingStats = ref({
  totalTime: 0,
  averageSpeed: 0,
  dataTransferred: 0,
  timeSaved: 0,
  optimizationLevel: 'High'
})

// Mini-game
const showMiniGame = ref(false)
const miniGameScore = ref(0)
const miniGameTargetX = ref(50)
const miniGameTargetY = ref(50)
const miniGameTimer = ref(null)

const handleMiniGameClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  
  const distance = Math.sqrt(
    Math.pow(x - miniGameTargetX.value, 2) + Math.pow(y - miniGameTargetY.value, 2)
  )
  
  if (distance < 10) {
    miniGameScore.value += 10
    moveTarget()
    playSound('fileLoaded')
  }
}

const moveTarget = () => {
  miniGameTargetX.value = Math.random() * 80 + 10
  miniGameTargetY.value = Math.random() * 80 + 10
}

const startMiniGame = () => {
  showMiniGame.value = true
  miniGameScore.value = 0
  moveTarget()
  
  miniGameTimer.value = setInterval(() => {
    moveTarget()
  }, 2000) as unknown as number
}

const stopMiniGame = () => {
  showMiniGame.value = false
  if (miniGameTimer.value) {
    clearInterval(miniGameTimer.value)
    miniGameTimer.value = null
  }
}

// Update loading statistics
const updateLoadingStats = () => {
  loadingStats.value.totalTime = elapsedSeconds.value
  loadingStats.value.averageSpeed = averageSpeed.value
  loadingStats.value.dataTransferred = dataTransferred.value
  
  // Calculate time saved based on optimization
  const baseTime = props.approximateDurationSeconds * 1.5
  loadingStats.value.timeSaved = Math.max(0, baseTime - elapsedSeconds.value)
  
  // Update optimization level based on speed
  if (averageSpeed.value > 50) {
    loadingStats.value.optimizationLevel = 'Ultra'
  } else if (averageSpeed.value > 25) {
    loadingStats.value.optimizationLevel = 'High'
  } else if (averageSpeed.value > 10) {
    loadingStats.value.optimizationLevel = 'Medium'
  } else {
    loadingStats.value.optimizationLevel = 'Low'
  }
}

const playSound = (type: string) => {
  // SOUND DISABLED - No audio playback for better user experience
  return
}

const toggleSound = () => {
  // Sound toggle disabled - keeping sound off for better UX
  soundEnabled.value = false
}

const tipIndex = ref(0)
const currentTip = computed(() => loadingTips[tipIndex.value])

// Network status and speed tracking
const networkStatus = ref('Online')
const networkSpeed = ref(0)
const networkSpeedUnit = ref('Mbps')
const dataTransferred = ref(0)
const dataTransferredUnit = ref('KB')
const loadingStartTime = ref(0)
const averageSpeed = ref(0)

const networkStatusClass = computed(() => {
  if (networkStatus.value === 'Online') return 'status-online'
  if (networkStatus.value === 'Slow') return 'status-slow'
  return 'status-offline'
})

// Calculate network speed and data transfer
const calculateNetworkSpeed = () => {
  if (loadingStartTime.value === 0) {
    loadingStartTime.value = Date.now()
    return
  }
  
  const elapsed = (Date.now() - loadingStartTime.value) / 1000 // seconds
  const progress = percent.value / 100
  const totalData = 5.5 // MB total estimated
  const transferred = totalData * progress
  
  dataTransferred.value = Math.round(transferred * 1024) // Convert to KB
  if (dataTransferred.value > 1024) {
    dataTransferred.value = Math.round(dataTransferred.value / 1024)
    dataTransferredUnit.value = 'MB'
  }
  
  if (elapsed > 0) {
    const speed = transferred / elapsed // MB/s
    networkSpeed.value = Math.round(speed * 8) // Convert to Mbps
    if (networkSpeed.value < 1) {
      networkSpeed.value = Math.round(speed * 8000) // Convert to Kbps
      networkSpeedUnit.value = 'Kbps'
    } else {
      networkSpeedUnit.value = 'Mbps'
    }
    
    averageSpeed.value = Math.round(networkSpeed.value * 0.7 + averageSpeed.value * 0.3)
  }
}

// Check network status
const checkNetworkStatus = () => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    if (connection) {
      const effectiveType = connection.effectiveType
      if (effectiveType === '4g' || effectiveType === 'wifi') {
        networkStatus.value = 'Online'
      } else if (effectiveType === '3g' || effectiveType === '2g') {
        networkStatus.value = 'Slow'
      } else {
        networkStatus.value = 'Offline'
      }
    }
  }
}

// Attractive loading messages
const messages = [
  'Memuat...',
  'Sebentar lagi selesai...',
  'Hampir selesai...'
]

// Rotate messages every few seconds if loading takes a while
const messageIndex = ref(0)
const currentMessage = computed(() => {
  // Use custom message if provided, otherwise use rotating messages
  if (props.message !== 'Mohon tunggu sebentar...') {
    return props.message
  }
  return messages[messageIndex.value]
})

// Rotate messages less frequently for better performance
let messageRotationTimer: number | null = null
function startMessageRotation() {
  stopMessageRotation()
  // Only start rotation if we have more than one message and we're using the default messages
  if (messages.length > 1 && props.message === 'Mohon tunggu sebentar...') {
    messageRotationTimer = setInterval(() => {
      messageIndex.value = (messageIndex.value + 1) % messages.length
    }, 3000) as unknown as number
  }
}

function stopMessageRotation() {
  if (messageRotationTimer) {
    clearInterval(messageRotationTimer)
    messageRotationTimer = null
  }
}

// Rotate tips
let tipRotationTimer: number | null = null
function startTipRotation() {
  stopTipRotation()
  if (loadingTips.length > 1) {
    tipRotationTimer = setInterval(() => {
      tipIndex.value = (tipIndex.value + 1) % loadingTips.length
    }, 4000) as unknown as number
  }
}

function stopTipRotation() {
  if (tipRotationTimer) {
    clearInterval(tipRotationTimer)
    tipRotationTimer = null
  }
}

// Network status check interval
let networkCheckTimer: number | null = null
function startNetworkCheck() {
  stopNetworkCheck()
  checkNetworkStatus()
  networkCheckTimer = setInterval(() => {
    checkNetworkStatus()
  }, 5000) as unknown as number
}

function stopNetworkCheck() {
  if (networkCheckTimer) {
    clearInterval(networkCheckTimer)
    networkCheckTimer = null
  }
}

function start() {
  if (isPaused.value) {
    // Resume from paused state
    startMs = Date.now() - pausedElapsed
  } else {
    // Fresh start
    startMs = Date.now()
    stop()
    // Reset resources
    resources.value.forEach((r: any) => r.loaded = false)
  }

  isPaused.value = false
  startMessageRotation()
  startTipRotation()
  startNetworkCheck()

        timer = setInterval(() => {
          const elapsed = Date.now() - startMs
          elapsedSeconds.value = Math.floor(elapsed / 1000)
          pausedElapsed = elapsed

          // Linear progress calculation to match countdown timer
          // Calculate percentage based on elapsed time relative to total duration
          const p = (elapsed / (props.approximateDurationSeconds * 1000)) * 100
          percent.value = Math.min(99, Math.max(0, Math.round(p)))

          // Update network speed and statistics
          calculateNetworkSpeed()
          updateLoadingStats()

          // Emit progress updates for external watchers
          try { emit('progress', percent.value) } catch {}

    // When countdown hits 0, complete and notify parent to hide
    if (elapsedSeconds.value >= props.approximateDurationSeconds) {
      percent.value = 100
      try { emit('progress', 100) } catch {}
      // Play completion sound
      playSound('loadingComplete')
      // Clear timer immediately to prevent infinite loop
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      stopMessageRotation()
      stopTipRotation()
      stopNetworkCheck()
      // Add small delay before emitting finished to ensure smooth transition
      setTimeout(() => {
        emit('finished')
      }, 100)
    }
  }, 100) as unknown as number // Increased update frequency to 100ms for more real-time progress
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  stopMessageRotation()
  stopTipRotation()
  stopNetworkCheck()

  // Don't reset values when pausing
  if (!isPaused.value) {
    percent.value = 0
    elapsedSeconds.value = 0
    pausedElapsed = 0
    messageIndex.value = 0
    tipIndex.value = 0
    resources.value.forEach((r: any) => r.loaded = false)
  }
}

function toggleLoading() {
  if (isPaused.value) {
    // Resume loading
    start()
  } else {
    // Pause loading
    isPaused.value = true
    stop()
  }
}

function closeLoading() {
  isManuallyHidden.value = true
  stop()
  // Add small delay to ensure smooth transition
  setTimeout(() => {
    emit('finished')
  }, 50)
}

watch(() => props.isVisible, (v: boolean) => {
  if (v && !isManuallyHidden.value) {
    start()
  } else {
    stop()
  }
}, { immediate: true })

onMounted(() => {
  checkNetworkStatus()
})

onBeforeUnmount(() => {
  stop()
  stopMessageRotation()
  stopTipRotation()
  stopNetworkCheck()
})
</script>

<style scoped>
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

/* Animated particles background */
.loading-particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle-bg {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent);
  border-radius: 50%;
  animation: particle-float 15s ease-in-out infinite;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: translate(var(--tx, 50px), var(--ty, -100px)) scale(1.5);
    opacity: 0.4;
  }
  90% {
    opacity: 0.2;
  }
}

.book-loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0;
  background: radial-gradient(1200px 800px at 10% -10%, rgba(99,102,241,0.08), transparent 60%),
              radial-gradient(900px 700px at 110% 10%, rgba(59,130,246,0.08), transparent 55%),
              linear-gradient(135deg, rgba(255,255,255,0.95), rgba(243,244,246,0.95));
  z-index: 9999;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  backdrop-filter: blur(8px) saturate(1.2);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
  will-change: opacity, transform;
}

.book-loading-container::before {
  content: '';
  position: absolute;
  inset: -30%;
  background: conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.12), rgba(245,158,11,0.10), rgba(99,102,241,0.12), rgba(59,130,246,0.12));
  filter: blur(32px) saturate(1.1);
  animation: overlay-aurora 16s linear infinite;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.85;
}

@keyframes overlay-aurora {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes overlay-in {
  0% { opacity: 0; transform: scale(0.985); }
  100% { opacity: 1; transform: scale(1); }
}

.dark .book-loading-container {
  background:
    radial-gradient(1000px 700px at 0% 0%, rgba(17,24,39,0.65), transparent 55%),
    radial-gradient(800px 600px at 100% 0%, rgba(2,6,23,0.55), transparent 50%),
    linear-gradient(135deg, rgba(2,6,23,0.94), rgba(15,23,42,0.94));
  backdrop-filter: blur(8px) saturate(1.05);
  -webkit-backdrop-filter: blur(8px) saturate(1.05);
}

.dark .book-loading-container::before {
  background: conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.18), rgba(245,158,11,0.12), rgba(168,85,247,0.18), rgba(59,130,246,0.18));
  opacity: 0.6;
  mix-blend-mode: screen;
}

.book-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Loading Stage Indicator */
.loading-stage-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin: 0.5rem 0;
}

.stage-dots {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.stage-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(156, 163, 175, 0.2);
  border: 2px solid rgba(156, 163, 175, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.stage-dot.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
  border-color: rgba(59, 130, 246, 0.6);
}

.stage-dot.current {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
  border-color: rgba(59, 130, 246, 1);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(99, 102, 241, 0.3);
  animation: stage-pulse 2s ease-in-out infinite;
}

@keyframes stage-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(99, 102, 241, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.7), 0 0 50px rgba(99, 102, 241, 0.5);
  }
}

.stage-icon {
  font-size: 1.25rem;
  filter: grayscale(1);
  transition: filter 0.3s ease;
}

.stage-dot.active .stage-icon,
.stage-dot.current .stage-icon {
  filter: grayscale(0);
}

.stage-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  transition: all 0.3s ease;
  animation: stage-text-fade 0.5s ease;
}

@keyframes stage-text-fade {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dark .stage-text {
  color: #e5e7eb;
}

/* Super Detailed Resource Tracker */
.resource-tracker {
  width: 100%;
  max-width: 480px;
  margin: 0.75rem auto;
  padding: 1.25rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(248, 250, 252, 0.6) 100%);
  border-radius: 1.25rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.resource-tracker::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    #3b82f6 0%, 
    #8b5cf6 25%, 
    #ec4899 50%, 
    #f59e0b 75%, 
    #10b981 100%);
  animation: shimmer-border 3s ease-in-out infinite;
}

@keyframes shimmer-border {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.dark .resource-tracker {
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.8) 0%, 
    rgba(30, 41, 59, 0.6) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Tracker Header */
.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(156, 163, 175, 0.2);
}

.tracker-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark .tracker-title {
  color: #f9fafb;
}

.tracker-icon {
  color: #3b82f6;
  font-size: 1.125rem;
}

.tracker-stats {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.files-loaded {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: rgba(156, 163, 175, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.dark .files-loaded {
  color: #9ca3af;
  background: rgba(156, 163, 175, 0.2);
}

.overall-progress {
  font-size: 0.75rem;
  font-weight: 700;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.dark .overall-progress {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Resource Categories */
.resource-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-category {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.75rem;
  border: 1px solid rgba(156, 163, 175, 0.2);
  padding: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dark .resource-category {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(156, 163, 175, 0.1);
}

.resource-category.loaded {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.1) 0%, 
    rgba(22, 163, 74, 0.05) 100%);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
}

.dark .resource-category.loaded {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.15) 0%, 
    rgba(22, 163, 74, 0.1) 100%);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

/* Category Header */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.25rem;
  filter: grayscale(1);
  transition: filter 0.3s ease;
}

.resource-category.loaded .category-icon {
  filter: grayscale(0);
}

.category-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.dark .category-name {
  color: #e5e7eb;
}

.category-progress {
  font-size: 0.75rem;
  font-weight: 700;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.dark .category-progress {
  background: rgba(59, 130, 246, 0.2);
}

.category-status {
  display: flex;
  align-items: center;
  color: #9ca3af;
  font-size: 1rem;
}

.resource-category.loaded .category-status {
  color: #22c55e;
}

.category-status .spinning {
  animation: spin-icon 1s linear infinite;
}

.status-complete {
  animation: check-bounce 0.5s ease;
}

@keyframes check-bounce {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Category Progress Bar */
.category-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(156, 163, 175, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.dark .category-progress-bar {
  background: rgba(156, 163, 175, 0.3);
}

.category-progress-bar .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #3b82f6 0%, 
    #8b5cf6 50%, 
    #ec4899 100%);
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.category-progress-bar .progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%);
  animation: shimmer-progress 2s ease-in-out infinite;
}

@keyframes shimmer-progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Enhanced Visual Effects */
.resource-category.loaded::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(34, 197, 94, 0.1) 50%, 
    transparent 70%);
  animation: shimmer-complete 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer-complete {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}

.file-item.loaded::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(34, 197, 94, 0.2) 50%, 
    transparent 100%);
  animation: file-shimmer 1.5s ease-in-out;
  pointer-events: none;
}

@keyframes file-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Glow effects for completed items */
.resource-category.loaded {
  box-shadow: 
    0 4px 12px rgba(34, 197, 94, 0.1),
    0 0 20px rgba(34, 197, 94, 0.05),
    inset 0 1px 0 rgba(34, 197, 94, 0.1);
}

.dark .resource-category.loaded {
  box-shadow: 
    0 4px 12px rgba(34, 197, 94, 0.2),
    0 0 20px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(34, 197, 94, 0.1);
}

.file-item.loaded {
  box-shadow: 
    0 2px 8px rgba(34, 197, 94, 0.1),
    0 0 12px rgba(34, 197, 94, 0.05);
}

.dark .file-item.loaded {
  box-shadow: 
    0 2px 8px rgba(34, 197, 94, 0.2),
    0 0 12px rgba(34, 197, 94, 0.1);
}

/* Pulse effect for loading items */
.resource-category:not(.loaded) {
  animation: category-pulse 3s ease-in-out infinite;
}

@keyframes category-pulse {
  0%, 100% { 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  50% { 
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  }
}

.dark .resource-category:not(.loaded) {
  animation: category-pulse-dark 3s ease-in-out infinite;
}

@keyframes category-pulse-dark {
  0%, 100% { 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% { 
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }
}

/* Files List */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  border: 1px solid rgba(156, 163, 175, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.dark .file-item {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(156, 163, 175, 0.05);
}

.file-item.loaded {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.1) 0%, 
    rgba(22, 163, 74, 0.05) 100%);
  border-color: rgba(34, 197, 94, 0.2);
  transform: translateX(2px);
}

.dark .file-item.loaded {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.15) 0%, 
    rgba(22, 163, 74, 0.1) 100%);
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.file-item.loaded .file-icon {
  color: #22c55e;
}

.file-icon-default {
  animation: file-pulse 2s ease-in-out infinite;
}

@keyframes file-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.file-icon-loaded {
  animation: check-bounce 0.5s ease;
}

.file-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  font-family: 'Courier New', monospace;
}

.dark .file-name {
  color: #e5e7eb;
}

.file-item.loaded .file-name {
  color: #22c55e;
}

.file-size {
  font-size: 0.625rem;
  font-weight: 600;
  color: #6b7280;
  background: rgba(156, 163, 175, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.dark .file-size {
  color: #9ca3af;
  background: rgba(156, 163, 175, 0.2);
}

.file-item.loaded .file-size {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.file-status {
  display: flex;
  align-items: center;
}

.file-check {
  color: #22c55e;
  font-size: 0.875rem;
  animation: check-bounce 0.5s ease;
}

/* Loading Tips */
.loading-tips {
  width: 100%;
  max-width: 380px;
  margin: 0.75rem auto;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.08));
  border-radius: 0.75rem;
  border: 1px solid rgba(245, 158, 11, 0.25);
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.1);
}

.dark .loading-tips {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.1));
  border-color: rgba(245, 158, 11, 0.3);
}

.tip-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.tip-icon {
  flex-shrink: 0;
  color: #f59e0b;
  font-size: 1.25rem;
  animation: tip-glow 2s ease-in-out infinite;
}

@keyframes tip-glow {
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.8));
  }
}

.tip-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #78350f;
  animation: tip-slide-in 0.5s ease;
}

@keyframes tip-slide-in {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.dark .tip-text {
  color: #fbbf24;
}

/* Network Status */
.network-status {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 9999px;
  border: 1px solid rgba(156, 163, 175, 0.2);
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark .status-indicator {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(156, 163, 175, 0.1);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #9ca3af;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-online .status-dot {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
}

.status-slow .status-dot {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
}

.status-offline .status-dot {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

.status-text {
  color: #6b7280;
}

.dark .status-text {
  color: #9ca3af;
}

.status-online .status-text {
  color: #22c55e;
}

.status-slow .status-text {
  color: #f59e0b;
}

.status-offline .status-text {
  color: #ef4444;
}

.book-container {
  position: relative;
  width: clamp(120px, 30vw, 180px);
  height: clamp(90px, 22.5vw, 135px);
  perspective: 1200px;
  filter: drop-shadow(0 15px 25px rgba(0,0,0,.25));
  transform-style: preserve-3d;
  transform: rotateX(5deg);
  animation: container-float 4s ease-in-out infinite;
}

.reading-book-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2));
}

@keyframes container-float {
  0%, 100% { transform: rotateX(5deg) translateY(0); }
  50% { transform: rotateX(8deg) translateY(-8px); }
}

/* Hand animations */
.hand {
  animation: hand-move 3s ease-in-out infinite;
  transform-origin: bottom center;
  stroke-dasharray: 0;
  stroke-dashoffset: 0;
}

@keyframes hand-move {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(-2deg); }
}

.palm {
  animation: palm-pulse 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes palm-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Book animations */
.book {
  animation: book-glow 4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes book-glow {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.3)); }
  50% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6)); }
}

.book-cover {
  animation: cover-shine 6s ease-in-out infinite;
}

@keyframes cover-shine {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.book-pages {
  animation: pages-flutter 8s ease-in-out infinite;
  transform-origin: left center;
}

@keyframes pages-flutter {
  0%, 100% { transform: rotateY(0deg); }
  25% { transform: rotateY(2deg); }
  75% { transform: rotateY(-1deg); }
}

/* Cute enhancements: face and sparkles */
.book-face {
  pointer-events: none;
  transform-origin: center;
}
.book-face-eye {
  animation: eye-blink 5.2s ease-in-out infinite;
  transform-origin: center;
}
.book-face-eye.right { animation-delay: 2.6s; }
.book-face-blush {
  animation: blush-pulse 3.6s ease-in-out infinite;
}
.book-face-blush.right { animation-delay: 1.2s; }
.book-face-mouth {
  animation: mouth-smile 4.4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes eye-blink {
  0%, 2%, 60%, 62%, 100% { transform: scaleY(1); }
  1%, 61% { transform: scaleY(0.15); }
}
@keyframes blush-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.6; }
}
@keyframes mouth-smile {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.05); }
}

.book-sparkles .sparkle {
  animation: sparkle-float 6s ease-in-out infinite, sparkle-twinkle 1.8s ease-in-out infinite;
  transform-origin: center;
}
.book-sparkles .sparkle.s1 { animation-delay: 0s, 0s; }
.book-sparkles .sparkle.s2 { animation-delay: 1.2s, 0.4s; }
.book-sparkles .sparkle.s3 { animation-delay: 2.4s, 0.8s; }

@keyframes sparkle-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(8deg); }
}
@keyframes sparkle-twinkle {
  0%, 100% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 1; }
}

/* Cat animations */
.cat-head {
  animation: cat-breathe 4.6s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}
@keyframes cat-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
.cat-ear {
  animation: cat-ear-wiggle 3.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: bottom center;
}
.cat-ear.left { --ear-angle: -5deg; animation-delay: .2s; }
.cat-ear.right { --ear-angle: 5deg; animation-delay: .4s; }
@keyframes cat-ear-wiggle {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(var(--ear-angle, 4deg)); }
}
.cat-whiskers .whisker {
  animation: whisker-twitch 2.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}
.cat-whiskers .wr1, .cat-whiskers .wr2, .cat-whiskers .wr3 { animation-delay: .15s; }
.cat-whiskers .wl1, .cat-whiskers .wl2, .cat-whiskers .wl3 { animation-delay: .35s; }
.cat-whiskers .wr1 { --tx: -1.0px; }
.cat-whiskers .wr2 { --tx: -0.6px; }
.cat-whiskers .wr3 { --tx: -1.2px; }
.cat-whiskers .wl1 { --tx: 1.0px; }
.cat-whiskers .wl2 { --tx: 0.6px; }
.cat-whiskers .wl3 { --tx: 1.2px; }
@keyframes whisker-twitch {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(var(--tx, 1px)); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .book-loading-container,
  .book-loading-container::before,
  .book-container,
  .hand,
  .palm,
  .book,
  .book-cover,
  .book-pages,
  .book-face-eye,
  .book-face-blush,
  .book-face-mouth,
  .book-sparkles .sparkle,
  .cat-head,
  .cat-ear,
  .cat-whiskers .whisker,
  .progress-fill {
    animation: none !important;
    transition: none !important;
  }
}

/* Dark mode adjustments */
.dark .hand {
  stroke: #A0522D;
}

.dark .palm {
  fill: #DEB887;
  stroke: #A0522D;
}

.dark .book-cover {
  filter: brightness(0.9);
}

.dark .book-pages {
  fill: #F8F8F8;
}

.dark .book-spine {
  fill: #B8860B;
}

/* Improve SVG readability in dark mode */
.dark .reading-book-svg text {
  /* Keep title readable on the warm cover in dark mode */
  fill: #1f2937;
  stroke: rgba(0, 0, 0, 0.25);
  stroke-width: 0.4;
}
.dark .reading-book-svg .book line {
  /* Page text lines higher contrast on white-ish pages */
  stroke: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .book-container {
    width: clamp(100px, 28vw, 160px);
    height: clamp(75px, 21vw, 120px);
  }

  .stage-dots {
    gap: 0.75rem;
  }

  .stage-dot {
    width: 2rem;
    height: 2rem;
  }

  .stage-icon {
    font-size: 1rem;
  }

  .stage-text {
    font-size: 0.8rem;
  }

  .resource-tracker {
    padding: 1rem;
    max-width: 420px;
  }

  .tracker-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .tracker-stats {
    align-self: flex-end;
  }

  .resource-categories {
    gap: 0.75rem;
  }

  .resource-category {
    padding: 0.6rem;
  }

  .files-list {
    gap: 0.3rem;
  }

  .file-item {
    padding: 0.3rem 0.4rem;
  }

  .loading-tips {
    padding: 0.6rem 0.75rem;
  }

  .tip-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .book-container {
    width: clamp(80px, 25vw, 140px);
    height: clamp(60px, 18.75vw, 105px);
  }

  .book-loading {
    max-width: 340px;
  }

  .stage-dots {
    gap: 0.5rem;
  }

  .stage-dot {
    width: 1.75rem;
    height: 1.75rem;
  }

  .stage-icon {
    font-size: 0.9rem;
  }

  .stage-text {
    font-size: 0.75rem;
  }

  .resource-tracker {
    padding: 0.75rem;
    max-width: 360px;
  }

  .tracker-title {
    font-size: 0.875rem;
  }

  .tracker-stats {
    gap: 0.5rem;
  }

  .files-loaded,
  .overall-progress {
    font-size: 0.625rem;
    padding: 0.2rem 0.4rem;
  }

  .resource-categories {
    gap: 0.6rem;
  }

  .resource-category {
    padding: 0.5rem;
  }

  .category-name {
    font-size: 0.8rem;
  }

  .category-progress {
    font-size: 0.625rem;
  }

  .files-list {
    gap: 0.25rem;
  }

  .file-item {
    padding: 0.25rem 0.35rem;
  }

  .file-name {
    font-size: 0.7rem;
  }

  .file-size {
    font-size: 0.5rem;
  }

  .loading-tips {
    padding: 0.5rem 0.6rem;
    max-width: 320px;
  }

  .tip-icon {
    font-size: 1rem;
  }

  .tip-text {
    font-size: 0.75rem;
  }

  .status-indicator {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }

  .status-dot {
    width: 0.4rem;
    height: 0.4rem;
  }
}

.loading-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .75rem;
  position: relative; /* Ensure it layers above any overflow from the book */
  z-index: 1;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 0.5rem;
  box-sizing: border-box;
}

.progress-bar {
  --p: 0%;
  width: 100%;
  max-width: 320px;
  height: clamp(8px, 1.4vw, 12px);
  border-radius: 9999px;
  background: rgba(0,0,0,0.06);
  overflow: hidden;
  position: relative;
  box-shadow:
    inset 0 1px 4px rgba(0,0,0,0.15),
    0 1px 0 rgba(255,255,255,0.3);
  border: 1px solid rgba(0,0,0,0.03);
}
.dark .progress-bar {
  background: rgba(255,255,255,0.12);
  box-shadow:
    inset 0 1px 4px rgba(0,0,0,0.3),
    0 1px 0 rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.05);
}

.progress-fill {
  position: absolute;
  inset: 0;
  width: var(--p);
  background: linear-gradient(90deg, #60a5fa 0%, #a855f7 30%, #f59e0b 60%, #22d3ee 85%, #60a5fa 100%);
  background-size: 300% 100%;
  animation: shimmer 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  transition: width .3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 0 10px rgba(96,165,250,0.55),
    0 0 18px rgba(168,85,247,0.35),
    inset 0 0 6px rgba(255,255,255,0.45);
  border-radius: 9999px;
}

.dark .progress-fill {
  box-shadow:
    0 0 12px rgba(96,165,250,0.7),
    inset 0 0 8px rgba(255,255,255,0.2);
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.loading-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  width: 100%;
  max-width: 320px;
  margin: 0.5rem auto;
  flex-wrap: wrap;
}
.loading-text .percent {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  min-width: 3rem;
  text-align: center;
}
.loading-text .sep {
  opacity: .4;
}

/* Enhanced professional countdown styling */
.countdown-container {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.15));
  border-radius: 9999px;
  padding: 0.4rem 0.85rem;
  gap: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.25);
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 100%;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
}

.countdown-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.countdown-container:hover::after {
  opacity: 1;
  animation: sweep 2s ease infinite;
}

@keyframes sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.dark .countdown-container {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25));
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.countdown-container:hover {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25));
  transform: translateY(-2px);
  box-shadow:
    0 5px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 3px rgba(255, 255, 255, 0.5);
}

.dark .countdown-container:hover {
  box-shadow:
    0 5px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 3px rgba(255, 255, 255, 0.1);
}

.countdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  animation: spin 15s linear infinite;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(59, 130, 246, 0.3));
}

.countdown-clock {
  width: 1.3rem;
  height: 1.3rem;
  stroke-width: 2.2;
}

.countdown-text {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-variant-numeric: tabular-nums;
  flex-wrap: wrap;
  justify-content: center;
}

.countdown-label {
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 500;
}

.countdown-value {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.2rem;
  position: relative;
  min-width: 1.5rem;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.countdown-value::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(59, 130, 246, 0.2);
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.countdown-value:hover {
  transform: scale(1.05);
  color: #2563eb;
}

.countdown-unit {
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 500;
}

.dark .countdown-label,
.dark .countdown-unit {
  color: #9ca3af;
}

.dark .countdown-value {
  color: #60a5fa;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.dark .countdown-icon {
  color: #60a5fa;
  filter: drop-shadow(0 1px 3px rgba(96, 165, 250, 0.4));
}

/* Loading controls styling */
.loading-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 320px;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1f2937;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 90px;
  text-align: center;
  flex: 1;
  white-space: nowrap;
}

.dark .control-button {
  background-color: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.4);
  color: #e5e7eb;
}

.control-button:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.dark .control-button:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

.control-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.button-text {
  margin-left: 0.6rem; /* Increased spacing between icon and text */
}

.control-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.close-button {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #b91c1c;
}

.dark .close-button {
  background-color: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.close-button:hover {
  background-color: rgba(239, 68, 68, 0.15);
}

.dark .close-button:hover {
  background-color: rgba(239, 68, 68, 0.25);
}

.sound-button {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #16a34a;
}

.dark .sound-button {
  background-color: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
  color: #22c55e;
}

.sound-button.sound-enabled {
  background-color: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.dark .sound-button.sound-enabled {
  background-color: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

.sound-button:hover {
  background-color: rgba(34, 197, 94, 0.2);
  transform: translateY(-1px);
}

.dark .sound-button:hover {
  background-color: rgba(34, 197, 94, 0.3);
}

.sound-button.sound-enabled:hover {
  background-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
}

.dark .sound-button.sound-enabled:hover {
  background-color: rgba(34, 197, 94, 0.35);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}

@media (max-width: 480px) {
  .loading-controls {
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }

  .control-button {
    width: 100%;
    justify-content: center;
    padding: 0.35rem 0.6rem;
    font-size: 0.75rem;
    min-width: 0;
  }

  .control-icon {
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.2rem;
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes highlight {
  0%, 100% {
    color: #3b82f6;
  }
  50% {
    color: #2563eb;
  }
}

.dark .loading-text { color: #e5e7eb; }
.dark .loading-text .percent {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.05);
}
.dark .loading-text .sep {
  color: #9ca3af;
  opacity: 0.6;
}

.loading-message {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  max-width: 320px;
  line-height: 1.4;
  margin: 0.5rem auto;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.dark .loading-message {
  color: #f9fafb;
  background-color: rgba(30, 41, 59, 0.5);
}

/* Inline percent next to the loading message for better visibility */
.loading-message .inline-percent {
  margin-left: 0.5rem;
  font-weight: 700;
  background: rgba(59,130,246,0.12);
  color: #1f2937;
  padding: 0.1rem 0.4rem;
  border-radius: 0.375rem; /* rounded-md */
  font-variant-numeric: tabular-nums;
}
.dark .loading-message .inline-percent {
  background: rgba(59,130,246,0.25);
  color: #e5e7eb;
  border: 1px solid rgba(59,130,246,0.35);
}

/* Small-screen barcode loading visual - Enhanced */
.barcode {
  display: none;
  width: clamp(160px, 60vw, 320px);
  height: clamp(18px, 4.2vw, 28px);
  border-radius: 8px;
  background: repeating-linear-gradient(90deg, rgba(0,0,0,0.7) 0 2px, transparent 2px 6px),
              linear-gradient(90deg, rgba(96,165,250,0.4), rgba(245,158,11,0.4));
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}
.dark .barcode {
  background: repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0 2px, transparent 2px 6px),
              linear-gradient(90deg, rgba(96,165,250,0.3), rgba(245,158,11,0.3));
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
}
.barcode::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  animation: bar-scan 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  filter: blur(2px);
}
@keyframes bar-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .barcode { display: block; }
  .loading-text {
    font-size: clamp(0.85rem, 2.8vw, 0.95rem);
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    max-width: 300px;
  }
  .countdown-container {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 1rem;
    max-width: 300px;
    margin: 0.5rem auto;
  }
  .countdown-text {
    flex-wrap: wrap;
    justify-content: center;
  }
  .countdown-value {
    font-size: 1.25rem;
  }
  .loading-message {
    font-size: 0.95rem;
    max-width: 300px;
  }
  .loading-controls {
    flex-direction: row;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .loading-text .sep {
    display: none;
  }
  .countdown-container {
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
  }
  .countdown-icon {
    transform: scale(1);
    margin-right: 0.25rem;
  }
  .loading-message {
    font-size: 0.9rem;
    max-width: 280px;
    padding: 0.5rem 0.75rem;
  }
  .loading-controls {
    gap: 0.5rem;
    max-width: 260px;
    flex-direction: row;
  }
  .control-button {
    min-width: 0;
    padding: 0.35rem 0.6rem;
    font-size: 0.75rem;
  }
  .control-icon {
    width: 0.8rem;
    height: 0.8rem;
  }
}

@media (max-width: 420px) {
  .book { width: clamp(60px, 30vw, 84px); height: clamp(45px, 21vw, 64px); }
  .book-loading { gap: 0.75rem; }
  .countdown-container {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.5rem;
    max-width: 260px;
  }
  .countdown-text {
    text-align: center;
  }
  .countdown-value {
    font-size: 1rem;
  }
  .countdown-label, .countdown-unit {
    font-size: 0.8rem;
  }
  .loading-controls {
    flex-direction: row;
    max-width: 240px;
    gap: 0.4rem;
  }
  .control-button {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .control-icon {
    width: 0.75rem;
    height: 0.75rem;
    margin-right: 0.2rem;
    flex-shrink: 0;
  }
}

@media (max-width: 360px) {
  .book { width: clamp(50px, 25vw, 70px); height: clamp(38px, 19vw, 53px); }
  .loading-stats {
    gap: 0.5rem;
    width: 100%;
    max-width: 240px;
    padding: 0.25rem;
  }
  .countdown-label, .countdown-unit {
    font-size: 0.75rem;
  }
  .countdown-value {
    font-size: 0.9rem;
  }
  .countdown-container {
    max-width: 220px;
    padding: 0.4rem;
  }
  .loading-message {
    font-size: 0.85rem;
    max-width: 220px;
    padding: 0.4rem;
  }
  .loading-controls {
    max-width: 220px;
    gap: 0.3rem;
    justify-content: space-between;
  }
  .control-button {
    padding: 0.25rem 0.4rem;
    font-size: 0.65rem;
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .control-icon {
    width: 0.7rem;
    height: 0.7rem;
    margin-right: 0.2rem;
    flex-shrink: 0;
  }
}

/* Mini Progress Bars for Files */
.file-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.mini-progress-bar {
  width: 40px;
  height: 3px;
  background: rgba(156, 163, 175, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.dark .mini-progress-bar {
  background: rgba(156, 163, 175, 0.3);
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-progress-text {
  font-size: 0.625rem;
  font-weight: 600;
  color: #6b7280;
  min-width: 30px;
}

.dark .file-progress-text {
  color: #9ca3af;
}

/* Loading Statistics */
.loading-statistics {
  width: 100%;
  max-width: 480px;
  margin: 0.75rem auto;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6));
  border-radius: 1.25rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
}

.dark .loading-statistics {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border-color: rgba(59, 130, 246, 0.3);
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(156, 163, 175, 0.2);
}

.stats-icon {
  color: #3b82f6;
  font-size: 1.125rem;
}

.stats-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark .stats-title {
  color: #f9fafb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.75rem;
  border: 1px solid rgba(156, 163, 175, 0.2);
  transition: all 0.3s ease;
}

.dark .stat-item {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(156, 163, 175, 0.1);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .stat-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  font-size: 1.25rem;
  filter: grayscale(0.3);
  transition: filter 0.3s ease;
}

.stat-item:hover .stat-icon {
  filter: grayscale(0);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.dark .stat-label {
  color: #9ca3af;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .stat-value {
  color: #f9fafb;
}

/* Theme Selector */
.theme-selector {
  width: 100%;
  max-width: 480px;
  margin: 0.75rem auto;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6));
  border-radius: 1.25rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
}

.dark .theme-selector {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border-color: rgba(59, 130, 246, 0.3);
}

.theme-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(156, 163, 175, 0.2);
}

.theme-icon {
  color: #3b82f6;
  font-size: 1.125rem;
}

.theme-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .theme-title {
  color: #f9fafb;
}

.theme-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(156, 163, 175, 0.2);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.dark .theme-button {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(156, 163, 175, 0.1);
  color: #e5e7eb;
}

.theme-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .theme-button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.theme-button.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1));
  border-color: rgba(59, 130, 246, 0.4);
  color: #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}

.dark .theme-button.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.2));
  border-color: rgba(59, 130, 246, 0.5);
  color: #60a5fa;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
}

.theme-emoji {
  font-size: 1rem;
}

.theme-name {
  font-size: 0.75rem;
  font-weight: 600;
}

/* Mini-Game */
.loading-minigame {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  border-radius: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  z-index: 1000;
  overflow: hidden;
}

.dark .loading-minigame {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
  border-color: rgba(59, 130, 246, 0.4);
}

.minigame-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(156, 163, 175, 0.2);
}

.minigame-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.minigame-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .minigame-title {
  color: #f9fafb;
}

.minigame-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
}

.minigame-close:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.minigame-content {
  padding: 1.5rem;
}

.minigame-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.score-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.dark .score-label {
  color: #e5e7eb;
}

.score-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

.minigame-area {
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1));
  border-radius: 1rem;
  border: 2px dashed rgba(59, 130, 246, 0.3);
  cursor: crosshair;
  overflow: hidden;
  margin-bottom: 1rem;
}

.minigame-target {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
  animation: target-pulse 1s ease-in-out infinite;
  transition: all 0.3s ease;
}

@keyframes target-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.minigame-instructions {
  text-align: center;
}

.minigame-instructions p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .minigame-instructions p {
  color: #9ca3af;
}

/* Game Button */
.game-button {
  background-color: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  color: #a855f7;
}

.dark .game-button {
  background-color: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}

.game-button:hover {
  background-color: rgba(168, 85, 247, 0.2);
  transform: translateY(-1px);
}

.dark .game-button:hover {
  background-color: rgba(168, 85, 247, 0.25);
}

/* Network Speed Indicator */
.speed-indicator {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.75rem;
}

.speed-display,
.data-display {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.75rem;
  border: 1px solid rgba(156, 163, 175, 0.2);
  flex: 1;
}

.dark .speed-display,
.dark .data-display {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(156, 163, 175, 0.1);
}

.speed-icon,
.data-icon {
  color: #3b82f6;
  font-size: 1rem;
}

.speed-value,
.data-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .speed-value,
.dark .data-value {
  color: #f9fafb;
}

.speed-unit,
.data-unit {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.dark .speed-unit,
.dark .data-unit {
  color: #9ca3af;
}

/* Responsive adjustments for new features */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .theme-options {
    justify-content: center;
  }
  
  .theme-button {
    flex: 1;
    min-width: 0;
  }
  
  .loading-minigame {
    width: 95%;
    max-width: 350px;
  }
  
  .minigame-area {
    height: 150px;
  }
  
  .speed-indicator {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 0.5rem;
  }
  
  .theme-options {
    flex-direction: column;
  }
  
  .theme-button {
    justify-content: center;
  }
  
  .loading-minigame {
    width: 98%;
    max-width: 320px;
  }
  
  .minigame-area {
    height: 120px;
  }
  
  .minigame-target {
    width: 16px;
    height: 16px;
  }
  
  .speed-indicator {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Extra small screens */
@media (max-width: 320px) {
  .loading-controls {
    max-width: 200px;
    gap: 0.25rem;
    justify-content: space-between;
  }
  .control-button {
    padding: 0.2rem 0.35rem;
    font-size: 0.6rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .control-icon {
    width: 0.65rem;
    height: 0.65rem;
    margin-right: 0.2rem;
    flex-shrink: 0;
  }
}
/* Desktop visual refinements for a cleaner look on large screens */
@media (min-width: 1024px) {
  .book-loading { max-width: 420px; gap: 1.25rem; }
  .book-container { width: clamp(140px, 22vw, 200px); height: clamp(105px, 16.5vw, 150px); }
  .loading-message { font-size: 1rem; }
}
@media (min-width: 1280px) {
  .book-loading { max-width: 480px; }
  .book-container { width: clamp(160px, 18vw, 220px); height: clamp(120px, 13.5vw, 165px); }
  .loading-stats { gap: 1rem; }
}
</style>




