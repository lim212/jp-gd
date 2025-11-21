<script setup lang="ts">
/**
 * 🚀 SUPER KEREN UPDATE NOTIFICATION POPUP
 * 
 * Fitur:
 * - Full screen overlay dengan backdrop blur
 * - Epic animations dengan particles & glows
 * - Countdown 30 detik dengan circular progress
 * - Auto reload jika user tidak klik
 * - Tombol reload manual
 * - Modern gradient design
 * - Responsive untuk semua device
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  reload: []
  close: []
}>()

const countdown = ref(30)
const isReloading = ref(false)
let countdownInterval: NodeJS.Timeout | null = null

// Smart tracking system - max 3x display
const STORAGE_KEY_POPUP_COUNT = 'jp_update_popup_count'
const STORAGE_KEY_POPUP_TIMESTAMP = 'jp_update_popup_timestamp'
const STORAGE_KEY_POPUP_BLOCKED = 'jp_update_popup_blocked'
const MAX_DISPLAY_COUNT = 3
const RESET_WINDOW = 24 * 60 * 60 * 1000 // 24 jam untuk reset counter

// Check if popup can be shown (max 3x)
const canShowPopup = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    // Check if blocked
    const blockedUntil = localStorage.getItem(STORAGE_KEY_POPUP_BLOCKED)
    if (blockedUntil) {
      const blockTime = parseInt(blockedUntil, 10)
      if (Date.now() < blockTime) {
        console.log('🚫 Popup blocked - masih dalam periode block')
        return false
      } else {
        // Unblock jika sudah lewat
        localStorage.removeItem(STORAGE_KEY_POPUP_BLOCKED)
        localStorage.removeItem(STORAGE_KEY_POPUP_COUNT)
        localStorage.removeItem(STORAGE_KEY_POPUP_TIMESTAMP)
      }
    }
    
    // Check display count
    const countStr = localStorage.getItem(STORAGE_KEY_POPUP_COUNT)
    const timestampStr = localStorage.getItem(STORAGE_KEY_POPUP_TIMESTAMP)
    
    if (!countStr || !timestampStr) {
      return true // First time, boleh show
    }
    
    const count = parseInt(countStr, 10)
    const timestamp = parseInt(timestampStr, 10)
    const now = Date.now()
    
    // Reset jika sudah lewat 24 jam
    if (now - timestamp > RESET_WINDOW) {
      localStorage.removeItem(STORAGE_KEY_POPUP_COUNT)
      localStorage.removeItem(STORAGE_KEY_POPUP_TIMESTAMP)
      return true
    }
    
    // Check if sudah max 3x
    if (count >= MAX_DISPLAY_COUNT) {
      console.log('🚫 Popup blocked - sudah mencapai max 3x display')
      // Block untuk 24 jam
      localStorage.setItem(STORAGE_KEY_POPUP_BLOCKED, String(now + RESET_WINDOW))
      return false
    }
    
    return true
  } catch (error) {
    console.warn('Error checking popup permission:', error)
    return true // Fallback: allow if error
  }
}

// Track popup display
const trackPopupDisplay = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    const countStr = localStorage.getItem(STORAGE_KEY_POPUP_COUNT)
    const count = countStr ? parseInt(countStr, 10) : 0
    const newCount = count + 1
    
    localStorage.setItem(STORAGE_KEY_POPUP_COUNT, String(newCount))
    localStorage.setItem(STORAGE_KEY_POPUP_TIMESTAMP, String(Date.now()))
    
    console.log(`📊 Popup display tracked: ${newCount}/${MAX_DISPLAY_COUNT}`)
    
    // Jika sudah 3x, block untuk 24 jam
    if (newCount >= MAX_DISPLAY_COUNT) {
      localStorage.setItem(STORAGE_KEY_POPUP_BLOCKED, String(Date.now() + RESET_WINDOW))
      console.log('🚫 Popup akan di-block selama 24 jam setelah ini')
    }
  } catch (error) {
    console.warn('Error tracking popup display:', error)
  }
}

// Circular progress calculation
const progressCircumference = 565 // 2 * PI * 90
const progressOffset = computed(() => {
  return progressCircumference - (progressCircumference * countdown.value / 30)
})

// Progress percentage
const progressPercent = computed(() => {
  return ((30 - countdown.value) / 30 * 100).toFixed(0)
})

// Start countdown
const startCountdown = () => {
  countdown.value = 30
  
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  
  countdownInterval = setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      // Auto reload setelah countdown selesai
      handleReload()
    }
  }, 1000)
}

// Stop countdown
const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Handle reload
const handleReload = () => {
  if (isReloading.value) return
  
  isReloading.value = true
  stopCountdown()
  
  console.log('🔄 Reloading application...')
  
  // Track popup display sebelum reload
  trackPopupDisplay()
  
  // Emit reload event
  emit('reload')
}

// Handle "Nanti" (Later) - close popup
const handleLater = () => {
  stopCountdown()
  console.log('⏸️ User memilih nanti - popup ditutup')
  
  // Track popup display
  trackPopupDisplay()
  
  // Emit close event
  emit('close')
}

// Watch show prop dengan smart checking
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Check if popup can be shown (max 3x)
    if (!canShowPopup()) {
      console.log('🚫 Popup tidak bisa ditampilkan - sudah mencapai limit 3x')
      // Auto close jika tidak bisa show
      emit('close')
      return
    }
    
    // Track display
    trackPopupDisplay()
    
    startCountdown()
    // Prevent scroll - but check if body is already locked by loading screen
    if (typeof document !== 'undefined') {
      // Save current overflow state
      const currentOverflow = document.body.style.overflow
      if (currentOverflow !== 'hidden') {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
      }
    }
  } else {
    stopCountdown()
    countdown.value = 30
    isReloading.value = false
    // Restore scroll - only if we're the ones who locked it
    if (typeof document !== 'undefined') {
      // Check if loading screen is still active
      const hasLoadingScreen = document.querySelector('.loading-screen, .super-loading-screen, .background-loading-indicator')
      if (!hasLoadingScreen) {
        document.body.style.overflow = 'auto'
        document.documentElement.style.overflow = 'auto'
      }
    }
  }
}, { immediate: true })

// Cleanup
onBeforeUnmount(() => {
  stopCountdown()
  // Restore scroll only if no loading screen active
  if (typeof document !== 'undefined') {
    const hasLoadingScreen = document.querySelector('.loading-screen, .super-loading-screen, .background-loading-indicator')
    if (!hasLoadingScreen) {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }
})

// Generate particles positions
const particles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5
}))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="update-popup-overlay">
        <!-- Particles Background -->
        <div class="particles-container">
          <div
            v-for="particle in particles"
            :key="particle.id"
            class="particle"
            :style="{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`
            }"
          />
        </div>
        
        <!-- Gradient Waves -->
        <div class="gradient-waves">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
          <div class="wave wave-3"></div>
        </div>
        
        <!-- Multiple Glows -->
        <div class="glow-effects">
          <div class="glow glow-cyan"></div>
          <div class="glow glow-blue"></div>
          <div class="glow glow-purple"></div>
        </div>
        
        <!-- Rotating Ring -->
        <div class="rotating-ring"></div>
        
        <!-- Main Card -->
        <div class="update-popup-card">
          <!-- Icon dengan Ring Layers -->
          <div class="icon-container">
            <div class="icon-ring ring-1"></div>
            <div class="icon-ring ring-2"></div>
            <div class="icon-ring ring-3"></div>
            <div class="icon-wrapper">
              <UIcon name="i-lucide-sparkles" class="icon-sparkle" />
              <UIcon name="i-lucide-refresh-cw" class="icon-refresh" />
            </div>
          </div>
          
          <!-- Title -->
          <h2 class="popup-title">
            <span class="title-gradient">Pembaruan Tersedia!</span>
          </h2>
          
          <!-- Subtitle -->
          <p class="popup-subtitle">
            Versi baru telah tersedia dengan fitur lebih keren!
          </p>
          
          <!-- Description -->
          <p class="popup-description">
            Aplikasi akan reload otomatis untuk mengaktifkan pembaruan terbaru. Data Anda aman!
          </p>
          
          <!-- Countdown -->
          <div class="countdown-section">
            <!-- Circular Progress -->
            <div class="countdown-circular">
              <svg class="countdown-svg" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <!-- Background circle -->
                <circle
                  class="countdown-bg"
                  cx="100"
                  cy="100"
                  r="90"
                />
                <!-- Progress circle -->
                <circle
                  class="countdown-progress"
                  cx="100"
                  cy="100"
                  r="90"
                  :style="{ 
                    strokeDashoffset: progressOffset
                  }"
                />
              </svg>
              
              <!-- Countdown Number -->
              <div class="countdown-number-container">
                <div class="countdown-number-wrapper">
                  <span class="countdown-number-main">{{ countdown }}</span>
                  <span class="countdown-number-label">detik</span>
                </div>
                <div class="countdown-pulse-ring"></div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="progress-container">
              <div class="progress-bar-track">
                <div 
                  class="progress-bar-fill"
                  :style="{ width: `${progressPercent}%` }"
                ></div>
              </div>
              <p class="progress-text">
                <UIcon name="i-lucide-clock" class="progress-icon" />
                <span>Auto reload dalam <strong class="text-gradient">{{ countdown }}</strong> detik</span>
              </p>
            </div>
          </div>
          
          <!-- Features List -->
          <div class="features-list">
            <div class="feature-item">
              <UIcon name="i-lucide-zap" class="feature-icon" />
              <span>Performa Lebih Cepat</span>
            </div>
            <div class="feature-item">
              <UIcon name="i-lucide-palette" class="feature-icon" />
              <span>Tampilan Lebih Keren</span>
            </div>
            <div class="feature-item">
              <UIcon name="i-lucide-sparkles" class="feature-icon" />
              <span>Fitur Baru</span>
            </div>
          </div>
          
          <!-- Buttons Container -->
          <div class="buttons-container">
            <!-- Reload Now Button -->
            <button
              class="reload-button"
              :disabled="isReloading"
              @click="handleReload"
            >
              <UIcon name="i-lucide-zap" class="button-icon button-icon-left" />
              <span class="button-text">
                {{ isReloading ? 'Memuat Ulang...' : 'Reload Sekarang!' }}
              </span>
              <UIcon name="i-lucide-arrow-right" class="button-icon button-icon-right" />
              <div class="button-shine"></div>
            </button>
            
            <!-- Later Button -->
            <button
              class="later-button"
              :disabled="isReloading"
              @click="handleLater"
            >
              <UIcon name="i-lucide-clock" class="button-icon" />
              <span class="button-text">Nanti Saja</span>
            </button>
          </div>
          
          <!-- Info Badge -->
          <div class="info-badge">
            <UIcon name="i-lucide-shield-check" class="badge-icon" />
            <span>Aman & Terverifikasi • Update v2.3.0</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ==================== OVERLAY ==================== */
.update-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Z-index hierarchy:
   * Loading screens: 99999
   * Update popup: 1000000 (higher than loading)
   * This ensures popup shows above loading if both active
   */
  z-index: 1000000;
  background: linear-gradient(135deg, 
    rgba(6, 182, 212, 0.1) 0%, 
    rgba(59, 130, 246, 0.15) 35%,
    rgba(139, 92, 246, 0.2) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

/* ==================== PARTICLES ==================== */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -10px;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleRise 8s infinite ease-in;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes particleRise {
  0% {
    bottom: -10px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    bottom: 110%;
    opacity: 0;
  }
}

/* ==================== GRADIENT WAVES ==================== */
.gradient-waves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  animation: waveRotate 20s infinite linear;
}

.wave-1 {
  top: -50%;
  left: -50%;
  animation-duration: 15s;
}

.wave-2 {
  top: -50%;
  left: -50%;
  animation-duration: 20s;
  animation-direction: reverse;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

.wave-3 {
  top: -50%;
  left: -50%;
  animation-duration: 25s;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
}

@keyframes waveRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ==================== GLOW EFFECTS ==================== */
.glow-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: glowPulse 6s infinite ease-in-out;
}

.glow-cyan {
  top: 10%;
  left: 10%;
  background: rgba(6, 182, 212, 0.4);
  animation-delay: 0s;
}

.glow-blue {
  top: 50%;
  right: 10%;
  background: rgba(59, 130, 246, 0.4);
  animation-delay: 2s;
}

.glow-purple {
  bottom: 10%;
  left: 50%;
  background: rgba(139, 92, 246, 0.4);
  animation-delay: 4s;
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

/* ==================== ROTATING RING ==================== */
.rotating-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  margin: -300px 0 0 -300px;
  border: 2px solid rgba(6, 182, 212, 0.1);
  border-radius: 50%;
  animation: ringRotate 20s infinite linear;
  pointer-events: none;
}

@keyframes ringRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ==================== MAIN CARD ==================== */
.update-popup-card {
  position: relative;
  max-width: 700px;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  padding: 3.5rem 3rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 10px 30px rgba(6, 182, 212, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(50px) rotateX(20deg);
  }
  60% {
    transform: scale(1.05) translateY(-10px) rotateX(-5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotateX(0);
  }
}

/* Dark mode */
.dark .update-popup-card {
  background: rgba(30, 41, 59, 0.98);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 10px 30px rgba(6, 182, 212, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* ==================== ICON CONTAINER ==================== */
.icon-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 3px solid transparent;
  border-top-color: rgba(6, 182, 212, 0.6);
  border-right-color: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  animation: ringPulse 2s infinite ease-out;
}

.icon-ring.ring-1 {
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  animation-delay: 0s;
}

.icon-ring.ring-2 {
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  animation-delay: 0.5s;
}

.icon-ring.ring-3 {
  width: 160px;
  height: 160px;
  margin: -80px 0 0 -80px;
  animation-delay: 1s;
}

@keyframes ringPulse {
  0% {
    transform: scale(0.8) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0;
  }
}

.icon-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 60px rgba(6, 182, 212, 0.6);
  animation: iconFloat 3s infinite ease-in-out;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

.icon-sparkle,
.icon-refresh {
  position: absolute;
  width: 40px;
  height: 40px;
  color: white;
}

.icon-sparkle {
  animation: iconSparkle 3s infinite ease-in-out;
}

@keyframes iconSparkle {
  0%, 100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: rotate(180deg) scale(1.2);
  }
}

.icon-refresh {
  animation: iconSpin 2s infinite linear;
}

@keyframes iconSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ==================== TEXT CONTENT ==================== */
.popup-title {
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.title-gradient {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s infinite ease-in-out;
}

@keyframes gradientShift {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(20deg);
  }
}

.popup-subtitle {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.dark .popup-subtitle {
  color: #e2e8f0;
}

.popup-description {
  font-size: 1.125rem;
  text-align: center;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.dark .popup-description {
  color: #cbd5e1;
}

/* ==================== COUNTDOWN ==================== */
.countdown-section {
  margin-bottom: 2.5rem;
}

.countdown-circular {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 2rem;
}

.countdown-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.countdown-bg {
  fill: none;
  stroke: rgba(6, 182, 212, 0.1);
  stroke-width: 12px;
}

.countdown-progress {
  fill: none;
  stroke: url(#progressGradient);
  stroke-width: 12px;
  stroke-linecap: round;
  stroke-dasharray: 565;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.6));
}

.countdown-number-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.countdown-number-wrapper {
  position: relative;
  z-index: 2;
}

.countdown-number-main {
  display: block;
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  animation: numberPulse 1s infinite ease-in-out;
}

@keyframes numberPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.countdown-number-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-top: 0.5rem;
}

.dark .countdown-number-label {
  color: #cbd5e1;
}

.countdown-pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  border: 3px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  animation: pulseRing 1s infinite ease-out;
  z-index: 1;
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* ==================== PROGRESS BAR ==================== */
.progress-container {
  max-width: 400px;
  margin: 0 auto;
}

.progress-bar-track {
  width: 100%;
  height: 12px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  border-radius: 6px;
  transition: width 1s linear;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
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

.progress-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dark .progress-text {
  color: #cbd5e1;
}

.progress-icon {
  width: 18px;
  height: 18px;
  animation: clockTick 1s infinite steps(12);
}

@keyframes clockTick {
  to {
    transform: rotate(360deg);
  }
}

.text-gradient {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* ==================== FEATURES LIST ==================== */
.features-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  animation: featuresPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-fill-mode: both;
}

.feature-item:nth-child(1) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(2) {
  animation-delay: 0.3s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes featuresPop {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dark .feature-item {
  color: #e2e8f0;
}

.feature-icon {
  width: 32px;
  height: 32px;
  color: #06b6d4;
  animation: iconBounce 2s infinite ease-in-out;
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* ==================== BUTTONS CONTAINER ==================== */
.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* ==================== BUTTON ==================== */
.reload-button {
  width: 100%;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  color: white;
  font-size: 1.375rem;
  font-weight: 800;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 10px 30px rgba(6, 182, 212, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* Later Button */
.later-button {
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  font-size: 1.125rem;
  font-weight: 600;
  border: 2px solid rgba(100, 116, 139, 0.3);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.dark .later-button {
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5e1;
  border-color: rgba(148, 163, 184, 0.3);
}

.later-button:hover {
  background: rgba(100, 116, 139, 0.2);
  border-color: rgba(100, 116, 139, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .later-button:hover {
  background: rgba(148, 163, 184, 0.2);
  border-color: rgba(148, 163, 184, 0.5);
}

.later-button:active {
  transform: translateY(0);
}

.later-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.later-button .button-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.later-button:hover .button-icon {
  transform: rotate(15deg);
}

.reload-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reload-button:hover::before {
  opacity: 1;
}

.reload-button:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 20px 60px rgba(6, 182, 212, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.5);
}

.reload-button:active {
  transform: translateY(-2px) scale(0.98);
}

.reload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.button-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.button-icon-left {
  animation: zapPulse 2s infinite ease-in-out;
}

@keyframes zapPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.reload-button:hover .button-icon-right {
  transform: translateX(5px);
}

.button-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.reload-button:hover .button-shine {
  animation: buttonShine 1s ease;
}

@keyframes buttonShine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* ==================== INFO BADGE ==================== */
.info-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.dark .info-badge {
  color: #cbd5e1;
}

.badge-icon {
  width: 18px;
  height: 18px;
  color: #10b981;
  animation: badgePulse 2s infinite ease-in-out;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .update-popup-card {
    padding: 2.5rem 2rem;
  }
  
  .popup-title {
    font-size: 2rem;
  }
  
  .popup-subtitle {
    font-size: 1.25rem;
  }
  
  .popup-description {
    font-size: 1rem;
  }
  
  .countdown-circular {
    width: 180px;
    height: 180px;
  }
  
  .countdown-number-main {
    font-size: 3rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .update-popup-card {
    padding: 2rem 1.5rem;
  }
  
  .particle {
    width: 2px;
    height: 2px;
  }
  
  .icon-container {
    width: 100px;
    height: 100px;
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;
  }
  
  .icon-sparkle,
  .icon-refresh {
    width: 30px;
    height: 30px;
  }
  
  .popup-title {
    font-size: 1.75rem;
  }
  
  .countdown-circular {
    width: 160px;
    height: 160px;
  }
  
  .countdown-number-main {
    font-size: 2.5rem;
  }
  
  .reload-button {
    font-size: 1.125rem;
    padding: 1rem 2rem;
  }
  
  .later-button {
    font-size: 1rem;
    padding: 0.875rem 1.5rem;
  }
}

/* ==================== TRANSITIONS ==================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

