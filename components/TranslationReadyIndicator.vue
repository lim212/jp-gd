<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Translation Ready Indicator
 * Shows a subtle indicator when translations are loading
 * Disappears once ready
 */

const { locale, messages } = useI18n()
const isReady = ref(false)
const isLoading = ref(true)

const checkReady = () => {
  try {
    const currentLocale = locale.value || 'id'
    const msgs = messages.value?.[currentLocale]
    
    if (msgs && Object.keys(msgs).length > 0) {
      isReady.value = true
      isLoading.value = false
      return true
    }
    return false
  } catch {
    return false
  }
}

onMounted(() => {
  // Check immediately
  if (checkReady()) return

  // Check again after a short delay
  setTimeout(() => {
    if (checkReady()) return

    // If still not ready after 1s, hide indicator anyway
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }, 100)
})

// Watch for locale changes
watch(locale, () => {
  isLoading.value = true
  checkReady()
  
  // Auto-hide after 1s even if check fails
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading && !isReady"
      class="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
    >
      <div class="w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse">
        <div class="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>

