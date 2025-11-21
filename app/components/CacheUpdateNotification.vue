<template>
  <Transition name="slide-down">
    <div
      v-if="showNotification"
      class="fixed top-20 right-4 z-[9999] max-w-sm"
      role="alert"
      aria-live="polite"
    >
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-4 border-2 border-white/20 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1">
            <h3 class="font-bold text-sm mb-1">Update Tersedia! 🎉</h3>
            <p class="text-xs text-white/90">Versi baru website telah tersedia</p>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col gap-2">
            <button
              @click="handleReload"
              class="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-md"
            >
              Reload
            </button>
            <button
              @click="handleDismiss"
              class="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showNotification = ref(false)

// Safe composable usage - check if available
let forceReloadPage: (() => void) | null = null
let checkForUpdates: (() => Promise<boolean>) | null = null

try {
  const cache = useFreshCache()
  forceReloadPage = cache.forceReloadPage
  checkForUpdates = cache.checkForUpdates
} catch (error) {
  console.warn('CacheUpdateNotification: useFreshCache not available', error)
}

let checkInterval: NodeJS.Timeout | null = null

const handleReload = () => {
  showNotification.value = false
  if (forceReloadPage) {
    forceReloadPage()
  } else {
    // Fallback: simple reload
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
}

const handleDismiss = () => {
  showNotification.value = false
  // Check lagi setelah 10 menit
  setTimeout(checkUpdate, 600000)
}

const checkUpdate = async () => {
  if (!checkForUpdates) return
  
  try {
    const hasUpdate = await checkForUpdates()
    if (hasUpdate) {
      showNotification.value = true
    }
  } catch (error) {
    // Silently fail - don't spam console
    console.debug('CacheUpdateNotification: Check update failed', error)
  }
}

onMounted(() => {
  // Only check if composable is available
  if (!checkForUpdates) return
  
  // Check pertama kali setelah 30 detik
  setTimeout(checkUpdate, 30000)
  
  // Check setiap 5 menit
  checkInterval = setInterval(checkUpdate, 300000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>




