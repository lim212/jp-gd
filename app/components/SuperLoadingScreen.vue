<template>
  <Transition name="super-loading-fade">
    <div v-if="isVisible" class="super-loading-screen" role="dialog" aria-modal="true" aria-label="Memuat halaman">
      <!-- Animated Background -->
      <div class="super-loading-bg">
        <!-- Gradient waves -->
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
        
        <!-- Floating particles -->
        <div v-for="i in 30" :key="`particle-${i}`" class="particle" 
          :style="{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }"
        />
      </div>

      <div class="super-loading-content">
        <!-- Logo and Brand -->
        <div class="loading-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="url(#logo-gradient)" />
              <path d="M35 50 L50 65 L75 35" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3b82f6" />
                  <stop offset="100%" stop-color="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="brand-title">JasaPembayaran.com</h1>
          <p class="brand-subtitle">Loading Experience</p>
        </div>

        <!-- Smart Mode Indicator -->
        <Transition name="fade">
          <div v-if="smartMode" class="smart-mode-indicator">
            <div class="smart-badge">
              <svg class="smart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              <span>Mode Pintar Aktif</span>
            </div>
            <p class="smart-message">{{ smartModeMessage }}</p>
          </div>
        </Transition>

        <!-- Main Loading Progress -->
        <div class="loading-progress-main">
          <div class="progress-header">
            <span class="progress-label">{{ currentLoadingMessage }}</span>
            <span class="progress-percentage">{{ totalProgress }}%</span>
          </div>
          
          <!-- Animated Progress Bar -->
          <div class="progress-bar-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: `${totalProgress}%` }">
                <div class="progress-bar-shimmer"></div>
              </div>
              <!-- Progress markers -->
              <div class="progress-markers">
                <div v-for="i in 10" :key="`marker-${i}`" class="progress-marker" :style="{ left: `${i * 10}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Speed and Time Info -->
          <div class="loading-stats">
            <div class="stat-item">
              <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
              <span>{{ loadingSpeed }}</span>
            </div>
            <div class="stat-item">
              <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
              </svg>
              <span>{{ elapsedTime }}s</span>
            </div>
            <div class="stat-item">
              <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
              </svg>
              <span>{{ loadedResources }}/{{ totalResources }}</span>
            </div>
          </div>
        </div>

        <!-- Resource Loading Details -->
        <div class="resource-loading-grid">
          <TransitionGroup name="resource-fade">
            <div
              v-for="resource in resources"
              :key="resource.name"
              class="resource-card"
              :class="{ 
                'loading': resource.status === 'loading', 
                'completed': resource.status === 'completed',
                'pending': resource.status === 'pending'
              }"
            >
              <div class="resource-icon-wrapper">
                <!-- Dynamic icon based on resource type -->
                <component :is="'div'" class="resource-icon" v-html="getResourceIcon(resource.type)"></component>
                
                <!-- Loading spinner overlay -->
                <Transition name="spin-fade">
                  <div v-if="resource.status === 'loading'" class="resource-spinner">
                    <svg class="spinner-svg" viewBox="0 0 50 50">
                      <circle class="spinner-circle" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
                    </svg>
                  </div>
                </Transition>
                
                <!-- Completed checkmark -->
                <Transition name="check-fade">
                  <div v-if="resource.status === 'completed'" class="resource-checkmark">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                  </div>
                </Transition>
              </div>

              <div class="resource-info">
                <div class="resource-name">{{ resource.name }}</div>
                <div class="resource-details">
                  <span class="resource-count">{{ resource.loaded }}/{{ resource.total }} files</span>
                  <span class="resource-size">{{ formatSize(resource.size) }}</span>
                </div>
                
                <!-- Individual progress bar -->
                <div class="resource-progress-bar">
                  <div class="resource-progress-fill" :style="{ width: `${resource.progress}%` }"></div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Loading Tips -->
        <Transition name="slide-up">
          <div v-if="currentTip" class="loading-tips">
            <div class="tip-icon">💡</div>
            <p class="tip-text">{{ currentTip }}</p>
          </div>
        </Transition>

        <!-- Real-time Loading Animation -->
        <div class="loading-animation-section">
          <div class="animation-header">
            <h4 class="animation-title">Loading Animation</h4>
            <div class="animation-stats">
              <span class="animation-stat">{{ currentLoadingMessage }}</span>
            </div>
          </div>
          
          <div class="loading-animation-container">
            <div class="loading-orb-container">
              <div class="loading-orb orb-1"></div>
              <div class="loading-orb orb-2"></div>
              <div class="loading-orb orb-3"></div>
              <div class="loading-orb orb-4"></div>
              <div class="loading-orb orb-5"></div>
              <div class="loading-orb orb-6"></div>
            </div>
            
            <div class="loading-waves">
              <div class="wave-line wave-1"></div>
              <div class="wave-line wave-2"></div>
              <div class="wave-line wave-3"></div>
            </div>
          </div>
        </div>

        <!-- System Status Monitor -->
        <div class="system-status">
          <h4 class="status-title">System Status</h4>
          <div class="status-grid">
            <div class="status-item" :class="{ 'online': true }">
              <div class="status-indicator"></div>
              <div class="status-info">
                <div class="status-label">Server</div>
                <div class="status-value">Online</div>
              </div>
            </div>
            <div class="status-item" :class="{ 'online': totalProgress > 50 }">
              <div class="status-indicator"></div>
              <div class="status-info">
                <div class="status-label">Database</div>
                <div class="status-value">{{ totalProgress > 50 ? 'Connected' : 'Connecting...' }}</div>
              </div>
            </div>
            <div class="status-item" :class="{ 'online': totalProgress > 25 }">
              <div class="status-indicator"></div>
              <div class="status-info">
                <div class="status-label">Cache</div>
                <div class="status-value">{{ totalProgress > 25 ? 'Ready' : 'Loading...' }}</div>
              </div>
            </div>
            <div class="status-item" :class="{ 'online': smartMode }">
              <div class="status-indicator"></div>
              <div class="status-info">
                <div class="status-label">Smart Mode</div>
                <div class="status-value">{{ smartMode ? 'Active' : 'Standby' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Timeline -->
        <div class="loading-timeline">
          <h4 class="timeline-title">Loading Timeline</h4>
          <div class="timeline-container">
            <div class="timeline-item" :class="{ 'active': totalProgress >= 10, 'completed': totalProgress >= 20 }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-label">Initializing</div>
                <div class="timeline-time">0-2s</div>
              </div>
            </div>
            <div class="timeline-item" :class="{ 'active': totalProgress >= 30, 'completed': totalProgress >= 50 }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-label">Loading Assets</div>
                <div class="timeline-time">2-5s</div>
              </div>
            </div>
            <div class="timeline-item" :class="{ 'active': totalProgress >= 70, 'completed': totalProgress >= 85 }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-label">Processing Data</div>
                <div class="timeline-time">5-8s</div>
              </div>
            </div>
            <div class="timeline-item" :class="{ 'active': totalProgress >= 95, 'completed': totalProgress >= 100 }">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-label">Finalizing</div>
                <div class="timeline-time">8-10s</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Loading Progress -->
        <div class="enhanced-progress-section">
          <div class="progress-header-enhanced">
            <h3 class="progress-title">Loading Progress Details</h3>
            <div class="progress-stats">
              <span class="stat-item-enhanced">
                <span class="stat-label">Total Progress:</span>
                <span class="stat-value">{{ totalProgress }}%</span>
              </span>
              <span class="stat-item-enhanced">
                <span class="stat-label">Time Elapsed:</span>
                <span class="stat-value">{{ elapsedTime }}s</span>
              </span>
              <span class="stat-item-enhanced">
                <span class="stat-label">Loading Speed:</span>
                <span class="stat-value">{{ loadingSpeed }}</span>
              </span>
            </div>
          </div>
          
          <div class="enhanced-progress-bar">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: `${totalProgress}%` }">
                <div class="progress-bar-shimmer"></div>
              </div>
              <div class="progress-markers">
                <div v-for="i in 20" :key="`marker-${i}`" class="progress-marker" :style="{ left: `${i * 5}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="performance-metrics">
          <h4 class="metrics-title">Performance Metrics</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">⚡</div>
              <div class="metric-info">
                <div class="metric-label">Load Speed</div>
                <div class="metric-value">{{ loadingSpeed }}</div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📦</div>
              <div class="metric-info">
                <div class="metric-label">Resources</div>
                <div class="metric-value">{{ loadedResources }}/{{ totalResources }}</div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">⏱️</div>
              <div class="metric-info">
                <div class="metric-label">Elapsed Time</div>
                <div class="metric-value">{{ elapsedTime }}s</div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">🎯</div>
              <div class="metric-info">
                <div class="metric-label">Completion</div>
                <div class="metric-value">{{ totalProgress }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skip Button (only show in smart mode after 5 seconds) -->
        <Transition name="fade">
          <div v-if="showSkipButton" class="skip-section">
            <div class="skip-info">
              <p class="skip-text">{{ t('loading.slow_loading_message') }}</p>
            </div>
            <button @click="skipToContent" class="skip-button">
              <svg class="skip-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 7L18 12L13 17M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ t('loading.skip_button') }}</span>
              <div class="skip-pulse"></div>
            </button>
          </div>
        </Transition>
      </div>

      <!-- WhatsApp Button - Fixed Bottom Left -->
      <a
        :href="whatsappHref"
        target="_blank"
        rel="noopener noreferrer"
        class="loading-whatsapp-button"
        :title="'Hubungi via WhatsApp'"
        aria-label="Hubungi kami via WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="loading-whatsapp-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <!-- Online Indicator -->
        <div class="loading-whatsapp-indicator"></div>
      </a>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRuntimeConfig } from '#imports'

// i18n for translations
const { t } = useI18n()

// Runtime config for WhatsApp
const config = useRuntimeConfig()
const whatsappPhone = computed(() => config.public?.whatsappPhone || '628988888250')
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || t('whatsapp.default_message', 'Halo, saya ingin bertanya tentang layanan JasaPembayaran.com')
)
const whatsappHref = computed(() => {
  const params = new URLSearchParams({
    phone: String(whatsappPhone.value),
    text: String(whatsappMessage.value),
    type: 'phone_number',
    app_absent: '0'
  })
  return `https://api.whatsapp.com/send/?${params.toString()}`
})

// Use composables for real detection (auto-imported by Nuxt)
const { connectionQuality, getLoadingStrategy } = useConnectionQuality()
const { resourceStats, getLoadingMessage: realLoadingMessage, getCurrentPhase, getLoadingSpeed: realLoadingSpeed } = useResourceDetection()

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: true
  },
  smartModeDelay: {
    type: Number,
    default: 5000 // 5 seconds
  },
  maxTimeout: {
    type: Number,
    default: 15000 // 15 seconds maximum - auto masuk setelah ini
  },
  stuckDetectionDelay: {
    type: Number,
    default: 3000 // 3 seconds - detect jika tidak ada progress
  },
  useRealDetection: {
    type: Boolean,
    default: true // Use real resource detection
  }
})

// Emits
const emit = defineEmits(['complete', 'skip'])

// Reactive state
const totalProgress = ref(0)
const elapsedTime = ref(0)
const smartMode = ref(false)
const showSkipButton = ref(false)
const currentTipIndex = ref(0)
const lastProgress = ref(0)
const lastProgressTime = ref(Date.now())

// Resource tracking
const resources = ref([
  {
    type: 'css',
    name: 'CSS Styles',
    total: 45,
    loaded: 0,
    size: 1024 * 450, // 450KB
    progress: 0,
    status: 'pending' // pending, loading, completed
  },
  {
    type: 'js',
    name: 'JavaScript',
    total: 78,
    loaded: 0,
    size: 1024 * 1024 * 2.5, // 2.5MB
    progress: 0,
    status: 'pending'
  },
  {
    type: 'images',
    name: 'Images',
    total: 156,
    loaded: 0,
    size: 1024 * 1024 * 4.8, // 4.8MB
    progress: 0,
    status: 'pending'
  },
  {
    type: 'fonts',
    name: 'Fonts',
    total: 12,
    loaded: 0,
    size: 1024 * 320, // 320KB
    progress: 0,
    status: 'pending'
  },
  {
    type: 'html',
    name: 'HTML',
    total: 8,
    loaded: 0,
    size: 1024 * 95, // 95KB
    progress: 0,
    status: 'pending'
  },
  {
    type: 'components',
    name: 'Components',
    total: 42,
    loaded: 0,
    size: 1024 * 1024 * 1.2, // 1.2MB
    progress: 0,
    status: 'pending'
  }
])

// Loading messages
const loadingMessages = [
  'Memulai loading resources...',
  'Memuat CSS styles...',
  'Memproses JavaScript...',
  'Loading images...',
  'Memuat fonts...',
  'Mempersiapkan components...',
  'Finalisasi loading...',
  'Hampir selesai...'
]

// Tips
const loadingTips = [
  'Tahukah Anda? JasaPembayaran.com melayani sejak 2011',
  'Tip: Simpan halaman ini untuk akses cepat',
  'Kami telah melayani 50,000+ transaksi sukses',
  'Keamanan transaksi adalah prioritas utama kami',
  'Customer service 24/7 siap membantu Anda',
  'Proses transaksi hanya 5-15 menit',
  'Rate kompetitif dan transparan',
  'Spesialis PayPal, Bitcoin & Crypto',
  'Lebih dari 10 tahun pengalaman di industri',
  'Sistem keamanan berlapis untuk melindungi data',
  'Proses verifikasi cepat dan akurat',
  'Support berbagai metode pembayaran',
  'Transaksi real-time dengan notifikasi',
  'Tim profesional siap membantu 24/7',
  'Garansi keamanan dan kepuasan 100%',
  'Akses mudah melalui WhatsApp dan Live Chat'
]

// Use real detection if enabled, otherwise use simulated messages
const currentLoadingMessage = computed(() => {
  if (props.useRealDetection && realLoadingMessage.value) {
    return realLoadingMessage.value
  }
  return loadingMessages[Math.min(currentMessageIndex.value, loadingMessages.length - 1)]
})

const currentTip = ref(loadingTips[0])
const smartModeMessage = computed(() => {
  if (connectionQuality.value) {
    return `${connectionQuality.value.message} - Mode pintar aktif`
  }
  return 'Loading agak lama, mengaktifkan mode progresif...'
})
const currentMessageIndex = ref(0)

// Computed
const totalResources = computed(() => 
  resources.value.reduce((sum, r) => sum + r.total, 0)
)

const loadedResources = computed(() => 
  resources.value.reduce((sum, r) => sum + r.loaded, 0)
)

const loadingSpeed = computed(() => {
  // Use real loading speed if available
  if (props.useRealDetection && realLoadingSpeed.value) {
    return realLoadingSpeed.value
  }
  
  // Fallback to simulated speed
  if (elapsedTime.value === 0) return '0 KB/s'
  const totalSize = resources.value.reduce((sum, r) => sum + (r.size * r.progress / 100), 0)
  const speed = totalSize / elapsedTime.value
  
  if (speed > 1024 * 1024) {
    return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
  } else if (speed > 1024) {
    return `${(speed / 1024).toFixed(2)} KB/s`
  }
  return `${speed.toFixed(0)} B/s`
})

// Timers
let elapsedTimer: any = null
let smartModeTimer: any = null
let tipRotateTimer: any = null
let loadingSimulationTimer: any = null
let maxTimeoutTimer: any = null
let stuckDetectionTimer: any = null

// Format file size
const formatSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  return `${bytes} B`
}

// Get resource icon SVG
const getResourceIcon = (type: string): string => {
  const icons: Record<string, string> = {
    css: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3z"/></svg>',
    js: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z"/></svg>',
    images: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
    fonts: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/></svg>',
    html: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.56l-4.5-1.5V10.5l4.5 1.5v5.56M13 10.5l4.5-1.5v5.56l-4.5 1.5V10.5m-6.47-.5L12 8.45l5.53 1.55v7.5L12 19.05 6.53 17.5V10m12.2-4.44L12 3.5 5.27 5.56l6.73 1.89 6.73-1.89M12 1l8.25 2.31v13.38L12 19l-8.25-2.31V3.31L12 1z"/></svg>',
    components: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"/></svg>'
  }
  return icons[type] || icons.html
}

// Force completion - langsung masuk ke halaman
const forceCompletion = (reason: string) => {
  console.log(`🚀 Force completion triggered: ${reason}`)
  
  // Complete all resources instantly
  resources.value.forEach(resource => {
    resource.progress = 100
    resource.loaded = resource.total
    resource.status = 'completed'
  })
  
  totalProgress.value = 100
  currentLoadingMessage.value = 'Loading selesai!'
  
  // Clear all timers
  if (elapsedTimer) clearInterval(elapsedTimer)
  if (smartModeTimer) clearTimeout(smartModeTimer)
  if (tipRotateTimer) clearInterval(tipRotateTimer)
  if (maxTimeoutTimer) clearTimeout(maxTimeoutTimer)
  if (stuckDetectionTimer) clearInterval(stuckDetectionTimer)
  
  // Emit complete event
  setTimeout(() => {
    emit('skip')
    emit('complete')
  }, 300)
}

  // Check if loading is stuck (no progress in X seconds)
const checkIfStuck = () => {
  stuckDetectionTimer = setInterval(() => {
    const now = Date.now()
    const timeSinceLastProgress = now - lastProgressTime.value
    
    // If no progress in stuckDetectionDelay ms and not yet complete
    if (timeSinceLastProgress > Math.min(props.stuckDetectionDelay, 2000) && totalProgress.value < 100) {
      console.warn('⚠️ Loading appears to be stuck, forcing completion...')
      smartModeMessage.value = 'Loading terlalu lama, langsung masuk...'
      forceCompletion('Stuck detection - no progress')
    }
  }, 500) // Check every 0.5 seconds for faster detection
}

// Watch progress changes
watch(totalProgress, (newProgress, oldProgress) => {
  if (newProgress > oldProgress) {
    lastProgress.value = newProgress
    lastProgressTime.value = Date.now()
  }
})

// Simulate loading with progressive pattern
const simulateLoading = () => {
  let currentResourceIndex = 0
  
  const loadResource = (index: number) => {
    if (index >= resources.value.length) {
      // All resources loaded
      setTimeout(() => {
        totalProgress.value = 100
        currentLoadingMessage.value = 'Loading selesai!'
        setTimeout(() => {
          emit('complete')
        }, 500)
      }, 300)
      return
    }

    const resource = resources.value[index]
    resource.status = 'loading'
    currentLoadingMessage.value = loadingMessages[index] || 'Memuat resources...'

    // Simulate progressive loading for this resource
    const loadInterval = setInterval(() => {
      if (resource.progress >= 100) {
        clearInterval(loadInterval)
        resource.status = 'completed'
        resource.loaded = resource.total
        
        // Update total progress
        const completedResources = resources.value.filter(r => r.status === 'completed').length
        totalProgress.value = Math.floor((completedResources / resources.value.length) * 100)
        
        // Load next resource
        setTimeout(() => {
          loadResource(index + 1)
        }, smartMode.value ? 200 : 400) // Faster in smart mode
      } else {
        // Increment progress
        const increment = smartMode.value ? 
          Math.random() * 15 + 10 : // 10-25% per tick in smart mode
          Math.random() * 8 + 4      // 4-12% per tick in normal mode
        
        resource.progress = Math.min(100, resource.progress + increment)
        resource.loaded = Math.floor((resource.progress / 100) * resource.total)
      }
    }, smartMode.value ? 100 : 200) // Faster updates in smart mode
  }

  // Start loading first resource
  loadResource(0)
}

// Activate smart mode
const activateSmartMode = () => {
  console.log('⚡ Smart mode activated')
  smartMode.value = true
  smartModeMessage.value = 'Loading agak lama, mengaktifkan mode progresif...'
  
  // Show skip button immediately in smart mode
  setTimeout(() => {
    showSkipButton.value = true
    smartModeMessage.value = 'Klik tombol di bawah untuk langsung masuk'
  }, 500) // Lebih cepat dari 1000ms
}

// Skip to content
const skipToContent = () => {
  // Complete all resources instantly
  resources.value.forEach(resource => {
    resource.progress = 100
    resource.loaded = resource.total
    resource.status = 'completed'
  })
  
  totalProgress.value = 100
  
  setTimeout(() => {
    emit('skip')
    emit('complete')
  }, 300)
}

// Rotate tips
const rotateTips = () => {
  tipRotateTimer = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % loadingTips.length
    currentTip.value = loadingTips[currentTipIndex.value]
  }, 3000) // Change tip every 3 seconds
}

// Track elapsed time
const startElapsedTimer = () => {
  elapsedTimer = setInterval(() => {
    elapsedTime.value += 0.1
  }, 100)
}

// Initialize loading
onMounted(() => {
  console.log('🎬 SuperLoadingScreen initialized with smart features')
  
  // Use adaptive timeout based on connection quality
  const adaptiveTimeout = connectionQuality.value?.timeout || props.maxTimeout
  console.log(`⏱️ Adaptive timeout: ${adaptiveTimeout}ms (Connection: ${connectionQuality.value?.quality || 'unknown'})`)
  console.log(`🔍 Stuck detection: ${props.stuckDetectionDelay}ms`)
  console.log(`📊 Real detection: ${props.useRealDetection ? 'Enabled' : 'Disabled'}`)
  
  // Start elapsed time tracker
  startElapsedTimer()
  
  // Start tip rotation
  rotateTips()
  
  // Start stuck detection
  checkIfStuck()
  
  // Set smart mode timer (show skip button earlier for slow connections)
  const smartModeDelay = connectionQuality.value?.quality === 'slow' || connectionQuality.value?.quality === 'very-slow' 
    ? Math.max(props.smartModeDelay - 1000, 2000) // Show earlier for slow connections
    : Math.min(props.smartModeDelay, 3000) // Reduce delay to max 3 seconds
    
  smartModeTimer = setTimeout(() => {
    if (totalProgress.value < 100) {
      activateSmartMode()
    }
  }, smartModeDelay)
  
  // Set MAXIMUM timeout - much shorter for better UX
  const shorterTimeout = Math.min(adaptiveTimeout, 4000) // Max 4 seconds - FIX BUG
  maxTimeoutTimer = setTimeout(() => {
    if (totalProgress.value < 100) {
      console.warn(`⏰ Maximum timeout (${shorterTimeout}ms) reached, forcing completion...`)
      forceCompletion('Maximum timeout reached')
    }
  }, shorterTimeout)
  
  // Start loading simulation after a brief delay (unless using real detection)
  if (!props.useRealDetection) {
    setTimeout(() => {
      simulateLoading()
    }, 300) // Start faster
  } else {
    console.log('📊 Using real resource detection - watching Performance API')
    // Just watch real progress, no simulation needed
    watch(() => resourceStats.value?.progress, (newProgress) => {
      if (newProgress >= 100) {
        setTimeout(() => {
          emit('complete')
        }, 300)
      }
    })
    
    // Fallback: if real detection doesn't work, force completion after 4 seconds
    setTimeout(() => {
      if (totalProgress.value < 50) {
        console.warn('📊 Real detection fallback - forcing completion')
        forceCompletion('Real detection fallback')
      }
    }, 4000)
  }
})

// Cleanup
onUnmounted(() => {
  console.log('🧹 Cleaning up SuperLoadingScreen timers')
  if (elapsedTimer) clearInterval(elapsedTimer)
  if (smartModeTimer) clearTimeout(smartModeTimer)
  if (tipRotateTimer) clearInterval(tipRotateTimer)
  if (loadingSimulationTimer) clearInterval(loadingSimulationTimer)
  if (maxTimeoutTimer) clearTimeout(maxTimeoutTimer)
  if (stuckDetectionTimer) clearInterval(stuckDetectionTimer)
})
</script>

<style scoped>
/* Main container */
.super-loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  display: flex;
  align-items: flex-start; /* Changed from center to flex-start */
  justify-content: center;
  overflow-y: auto; /* Changed from auto to overflow-y: auto */
  overflow-x: hidden; /* Prevent horizontal scroll */
  padding: 1rem; /* Reduced padding */
  box-sizing: border-box;
}

/* Animated background */
.super-loading-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.6;
}

/* Waves */
.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  animation: wave-move 15s ease-in-out infinite;
}

.wave-1 {
  top: -50%;
  left: -50%;
  animation-delay: 0s;
}

.wave-2 {
  top: -30%;
  right: -50%;
  animation-delay: 2s;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
}

.wave-3 {
  bottom: -50%;
  left: -30%;
  animation-delay: 4s;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
}

@keyframes wave-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10%, -10%) scale(1.1);
  }
  50% {
    transform: translate(-5%, 5%) scale(0.9);
  }
  75% {
    transform: translate(-10%, -5%) scale(1.05);
  }
}

/* Particles */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: particle-float 6s ease-in-out infinite;
  opacity: 0;
}

@keyframes particle-float {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  10% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translateY(-100px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(0);
  }
}

/* Content */
.super-loading-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  min-height: auto; /* Changed from 100vh to auto */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changed from center to flex-start */
  gap: 1rem; /* Add gap between sections */
  box-sizing: border-box;
}

/* Brand */
.loading-brand {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
}

.brand-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  animation: logo-pulse 2s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.brand-logo svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5));
}

.brand-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.brand-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Smart mode indicator */
.smart-mode-indicator {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.smart-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.smart-icon {
  width: 24px;
  height: 24px;
  color: #fbbf24;
  animation: star-twinkle 1.5s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
}

.smart-badge span {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.smart-message {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

/* Main progress */
.loading-progress-main {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-label {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.progress-percentage {
  color: #3b82f6;
  font-weight: bold;
  font-size: 1.5rem;
}

/* Progress bar */
.progress-bar-container {
  margin-bottom: 1rem;
}

.progress-bar-bg {
  position: relative;
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.progress-marker {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

/* Loading stats */
.loading-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stat-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.stat-item span {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Resource grid */
.resource-loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.resource-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  gap: 1.5rem;
  min-height: 120px; /* Ensure consistent height */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.resource-card.pending {
  border-color: rgba(148, 163, 184, 0.3);
  opacity: 0.6;
}

.resource-card.loading {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  animation: card-pulse 2s ease-in-out infinite;
}

.resource-card.completed {
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

@keyframes card-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.resource-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.resource-icon {
  width: 100%;
  height: 100%;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.resource-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-svg {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  stroke: #3b82f6;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: spinner-dash 1.5s ease-in-out infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner-dash {
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

.resource-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
}

.resource-checkmark svg {
  width: 24px;
  height: 24px;
  color: #22c55e;
}

.resource-info {
  flex: 1;
  min-width: 0;
}

.resource-name {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.resource-details {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.resource-count {
  color: rgba(255, 255, 255, 0.7);
}

.resource-size {
  color: rgba(255, 255, 255, 0.5);
}

.resource-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  overflow: hidden;
}

.resource-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* Loading tips */
.loading-tips {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tip-text {
  color: white;
  font-size: 0.9rem;
  margin: 0;
}

/* Enhanced Progress Section */
.enhanced-progress-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-header-enhanced {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.progress-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.progress-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item-enhanced {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: #3b82f6;
  font-size: 1.1rem;
  font-weight: bold;
}

.enhanced-progress-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.enhanced-progress-bar .progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg,
    #3b82f6 0%,
    #8b5cf6 25%,
    #ec4899 50%,
    #f59e0b 75%,
    #22c55e 100%
  );
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
  border-radius: 999px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  transition: width 0.3s ease;
}

.enhanced-progress-bar .progress-bar-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

.enhanced-progress-bar .progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.enhanced-progress-bar .progress-marker {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

/* Performance Metrics */
.performance-metrics {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Loading Animation Section */
.loading-animation-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.animation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.animation-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.animation-stats {
  display: flex;
  gap: 1rem;
}

.animation-stat {
  color: #3b82f6;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.loading-animation-container {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.loading-orb-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.loading-orb {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: orb-orbit 3s linear infinite;
}

.orb-1 {
  background: #3b82f6;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.orb-2 {
  background: #8b5cf6;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation-delay: 0.5s;
}

.orb-3 {
  background: #ec4899;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.orb-4 {
  background: #f59e0b;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation-delay: 1.5s;
}

.orb-5 {
  background: #22c55e;
  top: 25%;
  right: 25%;
  animation-delay: 2s;
}

.orb-6 {
  background: #ef4444;
  bottom: 25%;
  left: 25%;
  animation-delay: 2.5s;
}

@keyframes orb-orbit {
  0% {
    transform: translateX(-50%) translateY(-50%) rotate(0deg) translateX(40px) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotate(360deg) translateX(40px) rotate(-360deg);
  }
}

.loading-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  overflow: hidden;
}

.wave-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 20px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  animation: wave-flow 2s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
}

.wave-2 {
  animation-delay: 0.7s;
  height: 15px;
}

.wave-3 {
  animation-delay: 1.4s;
  height: 10px;
}

@keyframes wave-flow {
  0%, 100% {
    transform: translateX(-50%);
  }
  50% {
    transform: translateX(0%);
  }
}

/* System Status */
.system-status {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  animation: status-pulse 2s ease-in-out infinite;
}

.status-item.online .status-indicator {
  background: #22c55e;
}

@keyframes status-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.status-info {
  flex: 1;
}

.status-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.status-value {
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

/* Loading Timeline */
.loading-timeline {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timeline-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.timeline-container {
  position: relative;
  padding-left: 2rem;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.2);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 2rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-marker {
  background: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  animation: timeline-pulse 1.5s ease-in-out infinite;
}

.timeline-item.completed .timeline-marker {
  background: #22c55e;
  border-color: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

@keyframes timeline-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.timeline-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timeline-item.active .timeline-content {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.1);
}

.timeline-item.completed .timeline-content {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.1);
}

.timeline-label {
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.timeline-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
}

.metrics-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.metric-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
}

.metric-info {
  flex: 1;
}

.metric-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.metric-value {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}

/* Skip Section */
.skip-section {
  text-align: center;
  margin-top: 2rem;
}

.skip-info {
  margin-bottom: 1rem;
}

.skip-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0;
}

/* Skip button */
.skip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skip-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
}

.skip-button:active {
  transform: translateY(-1px) scale(1.02);
}

.skip-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.skip-button:hover .skip-icon {
  transform: translateX(3px);
}

/* WhatsApp Button on Loading Screen */
.loading-whatsapp-button {
  position: fixed;
  left: 1.5rem;
  bottom: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  z-index: 10000;
  text-decoration: none;
  animation: whatsapp-pulse 2s infinite;
}

.loading-whatsapp-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
}

.loading-whatsapp-icon {
  width: 2rem;
  height: 2rem;
  color: white;
  z-index: 1;
}

.loading-whatsapp-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #4ade80;
  border: 2px solid white;
  border-radius: 50%;
  animation: indicator-pulse 2s infinite;
}

@keyframes whatsapp-pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(37, 211, 102, 0.7);
  }
}

@keyframes indicator-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.skip-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: skip-pulse 2s infinite;
}

@keyframes skip-pulse {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

/* Transitions */
.super-loading-fade-enter-active,
.super-loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.super-loading-fade-enter-from,
.super-loading-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.resource-fade-enter-active,
.resource-fade-leave-active {
  transition: all 0.3s ease;
}

.resource-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.resource-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.spin-fade-enter-active,
.spin-fade-leave-active {
  transition: all 0.3s ease;
}

.spin-fade-enter-from,
.spin-fade-leave-to {
  opacity: 0;
  transform: scale(0);
}

.check-fade-enter-active {
  transition: all 0.3s ease;
}

.check-fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

/* Enhanced Responsive */
@media (max-width: 1200px) {
  .super-loading-screen {
    padding: 0.5rem;
  }
  
  .super-loading-content {
    max-width: 100%;
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .resource-loading-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
  }
  
  .enhanced-progress-section,
  .performance-metrics,
  .loading-animation-section,
  .system-status,
  .loading-timeline {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .super-loading-screen {
    padding: 0.25rem;
    align-items: flex-start;
  }

  .super-loading-content {
    padding: 0.5rem;
    min-height: auto;
    gap: 0.5rem;
  }

  .brand-logo {
    width: 50px;
    height: 50px;
  }

  .brand-title {
    font-size: 1.25rem;
  }

  .brand-subtitle {
    font-size: 0.8rem;
  }

  .resource-loading-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .loading-stats {
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-item {
    min-width: auto;
    justify-content: center;
    padding: 0.25rem;
  }
  
  .resource-card {
    padding: 0.75rem;
    min-height: 80px;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .loading-progress-main {
    padding: 0.75rem;
  }
  
  .enhanced-progress-section,
  .performance-metrics,
  .loading-animation-section,
  .system-status,
  .loading-timeline {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .progress-header-enhanced {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .progress-stats {
    justify-content: center;
    gap: 0.5rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .metric-card {
    padding: 0.75rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .status-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .super-loading-screen {
    padding: 0.125rem;
  }
  
  .super-loading-content {
    padding: 0.25rem;
    gap: 0.25rem;
  }
  
  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .brand-title {
    font-size: 1rem;
  }

  .brand-subtitle {
    font-size: 0.7rem;
  }

  .resource-card {
    padding: 0.5rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    min-height: 70px;
  }
  
  .resource-icon-wrapper {
    width: 30px;
    height: 30px;
    margin: 0 auto;
  }
  
  .enhanced-progress-section,
  .performance-metrics,
  .loading-animation-section,
  .system-status,
  .loading-timeline {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .progress-header-enhanced {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .progress-stats {
    justify-content: center;
    gap: 0.5rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .metric-card {
    padding: 0.5rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .metric-icon {
    font-size: 1.25rem;
    width: 35px;
    height: 35px;
  }
  
  .skip-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .loading-animation-container {
    height: 60px;
  }
  
  .loading-orb-container {
    width: 50px;
    height: 50px;
  }
  
  .loading-orb {
    width: 6px;
    height: 6px;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .status-item {
    padding: 0.5rem;
  }
  
  .timeline-container {
    padding-left: 1rem;
  }
  
  .timeline-item {
    margin-bottom: 1rem;
    padding-left: 1rem;
  }
  
  .timeline-marker {
    left: -1rem;
    width: 8px;
    height: 8px;
  }
  
  .timeline-content {
    padding: 0.5rem;
  }
  
  .loading-progress-main {
    padding: 0.5rem;
  }
  
  .loading-tips {
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .tip-text {
    font-size: 0.8rem;
  }
  
  .loading-whatsapp-button {
    left: 1rem;
    bottom: 1rem;
    width: 3rem;
    height: 3rem;
  }
  
  .loading-whatsapp-icon {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .loading-whatsapp-indicator {
    width: 10px;
    height: 10px;
  }
}
</style>

