<template>
  <!-- Collapsed pill (chip) -->
  <Transition name="consent-pop">
    <div
      v-if="visible && !expanded && !isScrolling"
      class="fixed z-[2147483644] bottom-0 left-1/2 -translate-x-1/2 transform select-none cursor-pointer mb-4"
      role="button"
      tabindex="0"
      :aria-expanded="expanded ? 'true' : 'false'"
      aria-controls="cookie-consent-panel"
      @click="openPanel"
      @keyup.enter="openPanel"
    >
      <div class="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md ring-1 ring-gray-200/70 dark:ring-gray-700/70 shadow-lg flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 w-max max-w-[92vw] transition-all duration-300 hover:shadow-xl hover:ring-blue-200/70 dark:hover:ring-blue-700/30">
        <span class="text-yellow-600 dark:text-yellow-400" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.999 2C6.477 2 2 6.477 2 12s4.477 10 9.999 10C18.523 22 23 17.523 23 12c0-.34-.018-.676-.052-1.008a1 1 0 00-1.52-.758 2.99 2.99 0 01-3.244-.12 1 1 0 00-1.5.867 2.99 2.99 0 01-4.489 2.595 1 1 0 00-1.5.868 2.99 2.99 0 01-4.13 2.76A8.004 8.004 0 0112 4c.246 0 .49.012.733.035a1 1 0 00.88-1.636A9.96 9.96 0 0012 2z"/>
          </svg>
        </span>
        <span class="inline xs:inline sm:inline font-medium">Privasi</span>
        <span class="hidden xs:hidden sm:inline text-gray-500">Cache & Cookies</span>
        <span class="hidden xs:hidden sm:inline ml-2 text-blue-600 dark:text-blue-400 font-semibold">Ketuk untuk atur</span>
      </div>
    </div>
  </Transition>

  <!-- Expanded panel as centered modal overlay -->
  <Transition name="consent-pop">
    <div
      v-if="visible && expanded"
      class="fixed inset-0 z-[2147483645] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-label="Pengaturan Cache dan Cookies"
      aria-modal="true"
      @click.self="closePanel"
      @contextmenu.self.prevent="closePanel"
    >
      <div
        id="cookie-consent-panel"
        class="w-full max-w-[420px] max-h-[80vh] overflow-y-auto rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md ring-1 ring-gray-200/80 dark:ring-gray-700/80 shadow-xl relative transform transition-all duration-300"
      >
        <div v-if="showCountdown" class="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/80 text-white text-xs shadow-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
          </svg>
          <span>Menutup otomatis dalam {{ countdown }} detik</span>
        </div>
        <div class="p-4 md:p-5 flex items-start gap-3">
          <div class="shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.999 2C6.477 2 2 6.477 2 12s4.477 10 9.999 10C18.523 22 23 17.523 23 12c0-.34-.018-.676-.052-1.008a1 1 0 00-1.52-.758 2.99 2.99 0 01-3.244-.12 1 1 0 00-1.5.867 2.99 2.99 0 01-4.489 2.595 1 1 0 00-1.5.868 2.99 2.99 0 01-4.13 2.76A8.004 8.004 0 0112 4c.246 0 .49.012.733.035a1 1 0 00.88-1.636A9.96 9.96 0 0012 2z"/>
            </svg>
          </div>
          <div class="flex-1 text-gray-700 dark:text-gray-200">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Pengaturan Cache dan Cookies</h3>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="rounded-full p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors duration-200"
                  @click="minimize"
                  aria-label="Minimalkan panel"
                  title="Minimize"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="group rounded-full p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors duration-200"
                  @click="closePanel"
                  aria-label="Tutup panel"
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 9L9 15M9 9l6 6"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-sm mt-2">Kami menggunakan Cache dan Cookies untuk memberikan pengalaman terbaik di situs ini.</p>
            <ul class="list-disc list-inside text-xs mt-3 text-gray-600 dark:text-gray-300 space-y-1">
              <li>
                <span class="font-semibold">Kuki Esensial (Wajib)</span>
                ©” Digunakan untuk fungsi dasar situs, seperti keamanan, autentikasi, dan pengingat pengaturan Anda. Tidak dapat dimatikan.
              </li>
            </ul>
            <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Kelola preferensi Anda:</div>
            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <button
                type="button"
                @click="acceptAll"
                class="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-gradient-to-br from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-sm font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/60 transition-all duration-200"
                aria-label="Terima semua cookies"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Terima Semua</span>
              </button>
              <button
                type="button"
                @click="declineAll"
                class="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/60 transition-all duration-200"
                aria-label="Tolak semua cookies"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Tolak Semua</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const STORAGE_KEY = 'cookie_consent'
const visible = ref(true)
const expanded = ref(false)
const showCountdown = ref(false)
const countdown = ref(10)
let countdownTimer: any = null

// Track scroll state to hide banner when scrolling
const isScrolling = ref(false)
let scrollTimer: any = null
const SCROLL_IDLE_MS = 800

// Track decision state to avoid re-showing after accept/decline
const hasDecision = ref(false)
let originalOverflow = ''

// Track user activity during countdown
let hadActivity = false
function markActivity() { hadActivity = true }

// Constants for scroll behavior
const IDLE_MS = 1500

// Safe bottom positioning with respect to device safe areas
const safeBottomStyle = {
  bottom: 'max(20px, env(safe-area-inset-bottom, 16px))'
}

function openPanel() {
  expanded.value = true
  hadActivity = false
  // Manual open: do not start auto-close countdown
  stopCountdown()
}
function minimize() {
  expanded.value = false
  stopCountdown()
}

function closePanel() {
  expanded.value = false
  stopCountdown()
  // Keep chip visible only if no final decision yet
  visible.value = !hasDecision.value
}

// This function is no longer needed as we're using isScrolling state with a timer
// to handle the reappearance of the banner after scrolling stops

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  showCountdown.value = false
}

function startCountdown() {
  stopCountdown()
  showCountdown.value = true
  countdown.value = 10
  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      stopCountdown()
      // Auto-hide
      expanded.value = false
      // If no activity during countdown, re-open without timer so it doesn't auto-close
      if (!hadActivity) {
        setTimeout(() => {
          visible.value = true
          expanded.value = true
          showCountdown.value = false
        }, 500)
      }
    }
  }, 1000)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && expanded.value) {
    closePanel()
  }
}


function onScroll() {
  hadActivity = true
  // Set scrolling state to true
  isScrolling.value = true

  // Hide expanded panel if open
  if (expanded.value) {
    expanded.value = false
    stopCountdown()
  }

  // Clear any existing scroll timer
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  // Set a timer to detect when scrolling stops
  scrollTimer = setTimeout(() => {
    isScrolling.value = false
    // Only show banner if user has not made a decision yet
    if (!hasDecision.value) {
      visible.value = true
    }
  }, SCROLL_IDLE_MS)
}

onMounted(() => {
  try {
    const decision = localStorage.getItem(STORAGE_KEY)
    hasDecision.value = decision === 'accepted' || decision === 'declined'
    if (hasDecision.value) {
      visible.value = false
      expanded.value = false
    } else {
      // First visit: show chip only; no popup
      visible.value = true
      expanded.value = false
      hadActivity = false
      // No auto-open countdown on first visit
    }
  } catch {
    hasDecision.value = false
    visible.value = true
    expanded.value = false
    hadActivity = false
    // No auto-open countdown when storage is unavailable
  }
  if (typeof document !== 'undefined') {
    originalOverflow = document.body.style.overflow || ''
  }
  watch(expanded, (val) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = val ? 'hidden' : originalOverflow
    }
  }, { immediate: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('click', markActivity, { passive: true })
  window.addEventListener('touchstart', markActivity, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('click', markActivity as any)
  window.removeEventListener('touchstart', markActivity as any)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = originalOverflow
  }
  // Clean up scroll timer
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
  stopCountdown()
})

function acceptAll() {
  try {
    localStorage.setItem(STORAGE_KEY, 'accepted')
  } catch {}
  hasDecision.value = true
  visible.value = false
  expanded.value = false
  stopCountdown()
}

function declineAll() {
  try {
    localStorage.setItem(STORAGE_KEY, 'declined')
  } catch {}
  hasDecision.value = true
  visible.value = false
  expanded.value = false
  stopCountdown()
}
</script>

<style scoped>
.consent-pop-enter-active, .consent-pop-leave-active {
  transition: opacity 150ms ease;
}
.consent-pop-enter-from, .consent-pop-leave-to {
  opacity: 0;
}
</style>

