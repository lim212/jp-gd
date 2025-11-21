<template>
  <div 
    class="reading-progress-bar fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
    :style="{ opacity: isVisible ? 1 : 0 }"
  >
    <div 
      class="progress-fill h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out shadow-lg"
      :style="{ 
        width: progress + '%',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
      }"
    >
      <!-- Animated shimmer effect -->
      <div class="absolute inset-0 shimmer"></div>
    </div>
    
    <!-- Percentage indicator (optional, shows on hover) -->
    <div 
      v-if="showPercentage && progress > 0"
      class="absolute right-4 top-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300"
      :style="{ 
        transform: progress > 95 ? 'translateY(0)' : 'translateY(-100%)',
        opacity: progress > 95 ? 1 : 0
      }"
    >
      <Icon name="mdi:check-circle" class="inline mr-1" size="14" />
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
const progress = ref(0)
const isVisible = ref(false)
const showPercentage = ref(true)

function updateProgress() {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  
  // Calculate progress
  const scrollProgress = (scrollTop / (documentHeight - windowHeight)) * 100
  progress.value = Math.min(Math.max(scrollProgress, 0), 100)
  
  // Show progress bar after scrolling a bit
  isVisible.value = scrollTop > 100
}

// Setup scroll listener
onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress-bar {
  transition: opacity 0.3s ease;
}

.progress-fill {
  position: relative;
  overflow: hidden;
}

/* Animated shimmer effect */
.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Pulse animation when approaching 100% */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.progress-fill {
  animation: pulse 2s ease-in-out infinite;
}
</style>


