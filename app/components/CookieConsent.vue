<template>
  <div v-if="mounted" class="fixed inset-x-0 bottom-0 pointer-events-none z-[2147483644]">
    <!-- Countdown badge (only during initial 10s phase) -->
    <transition name="fade">
      <div
        v-if="showFull && countdownActive"
        class="w-full flex justify-start pl-3 sm:pl-4 mb-1"
        aria-live="polite"
      >
        <div class="pointer-events-auto inline-flex items-center gap-2 text-[11px] sm:text-xs text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/80 backdrop-blur rounded-full px-2.5 py-1 border border-gray-200 dark:border-gray-700 shadow-sm">
          <UIcon name="i-lucide-clock" class="size-3.5 sm:size-4 text-blue-600" aria-hidden="true" />
          <span>Menutup dalam {{ remaining }} detik</span>
        </div>
      </div>
    </transition>

    <!-- Bottom-left area for chip and banner -->
    <div class="relative w-full flex justify-start pl-2 sm:pl-4 pb-[env(safe-area-inset-bottom,0)]">
      <!-- Compact Privacy chip (always visible until user explicitly closes forever) -->
      <div class="pointer-events-auto">
        <button
          v-if="showChip"
          @click="openFullWithoutTimer()"
          class="flex items-center gap-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 bg-white/95 dark:bg-gray-800/90 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition"
          aria-label="Buka pengaturan privasi"
        >
          <UIcon name="i-lucide-shield" class="size-4 text-emerald-600" />
          <span>Privasi</span>
        </button>
      </div>

      <!-- Consent Banner -->
      <transition name="slide-up">
        <div
          v-if="showFull"
          class="consent-card pointer-events-auto absolute left-2 sm:left-4 bottom-8 sm:bottom-10 max-w-[92vw] sm:max-w-md w-[min(420px,92vw)] bg-white/95 dark:bg-gray-900/90 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-3 sm:p-4"
          role="dialog"
          aria-label="Pengaturan Cookie dan Privasi"
        >
          <div class="flex items-start gap-3">
            <div class="shrink-0">
              <UIcon name="i-lucide-shield" class="size-5 sm:size-6 text-emerald-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-snug">
                Kami menggunakan cookies untuk meningkatkan pengalaman Anda. Anda dapat menerima atau menolak semua cookies kapan saja.
              </p>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button
                  @click="onReject"
                  class="btn-secondary"
                >Tolak Semua</button>
                <button
                  @click="onAccept"
                  class="btn-primary"
                >Terima Semua</button>
              </div>
              <div class="mt-2 flex items-center gap-2 text-[11px] sm:text-xs text-gray-600 dark:text-gray-300">
                <button class="underline hover:no-underline" @click="openFullWithoutTimer()">Pengaturan</button>
                <span aria-hidden="true">•</span>
                <button class="underline hover:no-underline" @click="closeToChip()">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const CONSENT_KEY = 'cookieConsent'
// values: 'accepted' | 'rejected' | null

const mounted = ref(false)
const showFull = ref(false)
const showChip = ref(true)
const countdownActive = ref(false)
const remaining = ref(10)
const timerId = ref<number | null>(null)
let hadActivity = false
let countdownFinishedOnce = false

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

function saveConsent(val: 'accepted' | 'rejected') {
  try {
    localStorage.setItem(CONSENT_KEY, val)
  } catch {}
}

function startCountdown() {
  countdownActive.value = true
  remaining.value = 10
  clearTimer()
  timerId.value = window.setInterval(() => {
    if (remaining.value > 1) {
      remaining.value -= 1
    } else {
      // finish
      clearTimer()
      countdownActive.value = false
      countdownFinishedOnce = true
      // auto-hide
      showFull.value = false
      // if NO activity during countdown -> re-open without timer (no further auto hide)
      if (!hadActivity) {
        // small delay to respect the "hide first" requirement
        setTimeout(() => {
          openFullWithoutTimer()
        }, 600)
      }
    }
  }, 1000)
}

function clearTimer() {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
}

function onAccept() {
  saveConsent('accepted')
  showFull.value = false
  // keep the chip visible for easy access to settings; comment next line if you prefer to hide chip entirely
  showChip.value = true
  removeActivityListeners()
  clearTimer()
}

function onReject() {
  saveConsent('rejected')
  showFull.value = false
  showChip.value = true
  removeActivityListeners()
  clearTimer()
}

function closeToChip() {
  showFull.value = false
  // user manually closed -> stop countdown permanently
  clearTimer()
  countdownActive.value = false
}

function openFullWithoutTimer() {
  showFull.value = true
  countdownActive.value = false
  clearTimer()
}

function activityListener() {
  hadActivity = true
}

function addActivityListeners() {
  window.addEventListener('click', activityListener, { passive: true })
  window.addEventListener('scroll', activityListener, { passive: true })
}

function removeActivityListeners() {
  window.removeEventListener('click', activityListener as any)
  window.removeEventListener('scroll', activityListener as any)
}

onMounted(() => {
  mounted.value = true
  const saved = readConsent()
  showChip.value = true

  if (!saved) {
    showFull.value = true
    hadActivity = false
    addActivityListeners()
    startCountdown()
  } else {
    // Consent was previously decided; keep chip for re-opening settings
    showFull.value = false
  }
})

onBeforeUnmount(() => {
  clearTimer()
  removeActivityListeners()
})
</script>

<style scoped>
@reference "tailwindcss";
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform .25s ease, opacity .2s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(8px); opacity: 0; }

.btn-primary {
  @apply inline-flex items-center justify-center px-3 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm font-semibold w-full;
}
.btn-secondary {
  @apply inline-flex items-center justify-center px-3 py-2 rounded-lg text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-semibold w-full;
}
</style>

