<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '504 - Gateway Timeout | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Gateway timeout. Server tidak menerima respons tepat waktu dari server upstream.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showTimeoutAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showTimeoutAnimation.value = true
  }, 700)
})

// Timeout countdown
const timeoutCountdown = ref(30)
const isTimeoutActive = ref(true)

onMounted(() => {
  const interval = setInterval(() => {
    if (timeoutCountdown.value > 0) {
      timeoutCountdown.value--
    } else {
      isTimeoutActive.value = false
      clearInterval(interval)
    }
  }, 1000)
})

// Timeout steps
const timeoutSteps = ref([
  'Mengirim permintaan...',
  'Menunggu respons...',
  'Memeriksa timeout...',
  'Gateway timeout!'
])

const currentStep = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    if (currentStep.value < timeoutSteps.value.length - 1) {
      currentStep.value++
    } else {
      clearInterval(interval)
    }
  }, 2000)
})

// Retry attempt
const retryAttempt = ref(0)
const maxRetries = ref(3)

const handleRetry = () => {
  if (retryAttempt.value < maxRetries.value) {
    retryAttempt.value++
    timeoutCountdown.value = 30
    isTimeoutActive.value = true
    currentStep.value = 0
    
    // Restart timeout countdown
    const interval = setInterval(() => {
      if (timeoutCountdown.value > 0) {
        timeoutCountdown.value--
      } else {
        isTimeoutActive.value = false
        clearInterval(interval)
      }
    }, 1000)
    
    // Restart steps
    const stepInterval = setInterval(() => {
      if (currentStep.value < timeoutSteps.value.length - 1) {
        currentStep.value++
      } else {
        clearInterval(stepInterval)
      }
    }, 2000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Timeout Particles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 504 Number with Timeout Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 animate-pulse">
            504
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            504
          </div>
          <!-- Timeout overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-purple-500 opacity-20 animate-ping">
            504
          </div>
        </div>

        <!-- Timer Icon with Animation -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-timer" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 opacity-30 animate-ping"></div>
            
            <!-- Timeout Elements -->
            <div v-if="showTimeoutAnimation" class="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full animate-bounce">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div v-if="showTimeoutAnimation" class="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce animation-delay-1000">
              <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Gateway Timeout
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Server tidak merespons tepat waktu! â°
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Server tidak menerima respons tepat waktu dari server upstream. Ini bisa terjadi karena 
          server sedang sibuk atau ada masalah koneksi.
        </p>

        <!-- Timeout Progress -->
        <div v-if="showTimeoutAnimation" class="max-w-lg mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Status Timeout
            </h3>
            
            <!-- Timeout Circle -->
            <div class="relative w-32 h-32 mx-auto mb-6">
              <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  class="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="314"
                  :stroke-dashoffset="314 - (314 * (30 - timeoutCountdown) / 30)"
                  class="text-purple-500 transition-all duration-1000 ease-linear"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ timeoutCountdown }}</span>
              </div>
            </div>
            
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {{ timeoutCountdown > 0 ? 'detik tersisa' : 'Timeout!' }}
            </p>
            
            <!-- Retry Counter -->
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Percobaan: {{ retryAttempt }}/{{ maxRetries }}
            </div>
          </div>
        </div>

        <!-- Timeout Steps -->
        <div v-if="showTimeoutAnimation" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-800">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Proses Timeout
            </h3>
            
            <!-- Timeout Steps -->
            <div class="space-y-3">
              <div 
                v-for="(step, index) in timeoutSteps" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
                :class="{
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200': index === currentStep,
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200': index < currentStep,
                  'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400': index > currentStep
                }"
              >
                <div class="flex-shrink-0">
                  <UIcon 
                    v-if="index < currentStep"
                    name="i-lucide-check" 
                    class="w-5 h-5 text-green-600 dark:text-green-400" 
                  />
                  <UIcon 
                    v-else-if="index === currentStep"
                    name="i-lucide-clock" 
                    class="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" 
                  />
                  <UIcon 
                    v-else
                    name="i-lucide-circle" 
                    class="w-5 h-5 text-gray-400" 
                  />
                </div>
                <span class="text-sm font-medium">{{ step }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up animation-delay-1000">
          <!-- Retry Button -->
          <UButton 
            @click="handleRetry"
            :disabled="retryAttempt >= maxRetries"
            size="xl"
            :color="retryAttempt >= maxRetries ? 'gray' : 'primary'"
            icon="i-lucide-refresh-cw"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
            :class="retryAttempt >= maxRetries ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600'"
          >
            <template #leading>
              <div class="relative">
                <UIcon name="i-lucide-refresh-cw" class="w-6 h-6" />
                <div v-if="retryAttempt < maxRetries" class="absolute inset-0 animate-spin">
                  <UIcon name="i-lucide-refresh-cw" class="w-6 h-6 opacity-30" />
                </div>
              </div>
            </template>
            {{ retryAttempt >= maxRetries ? 'âŒ Maksimal Percobaan' : 'ðŸ”„ Coba Lagi' }}
          </UButton>
          
          <!-- Home Button -->
          <UButton 
            to="/" 
            size="xl"
            color="gray" 
            variant="outline"
            icon="i-lucide-home"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2"
          >
            <template #leading>
              <UIcon name="i-lucide-home" class="w-6 h-6" />
            </template>
            ðŸ  Kembali ke Beranda
          </UButton>
        </div>

        <!-- Help Section -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up animation-delay-1200">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Apa itu Gateway Timeout? â°
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Gateway timeout terjadi ketika server tidak menerima respons dalam waktu yang ditentukan
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div class="text-2xl mb-2">â±ï¸</div>
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Timeout</h4>
              <p class="text-sm text-blue-700 dark:text-blue-300">Server tidak merespons dalam 30 detik</p>
            </div>
            
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ”„</div>
              <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Retry</h4>
              <p class="text-sm text-green-700 dark:text-green-300">Coba lagi dalam beberapa menit</p>
            </div>
            
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸŒ</div>
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Network</h4>
              <p class="text-sm text-purple-700 dark:text-purple-300">Bisa jadi masalah koneksi</p>
            </div>
          </div>
        </div>

        <!-- Timeout Notice -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1400">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-purple-800 dark:text-purple-200 font-medium">
              Timeout: 30 detik per permintaan
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Actions (WA & Live Chat) -->
    <ChatWhatsapp />
    <LiveChatComponent />
  </div>
</template>

<style scoped>
/* Custom Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1200 {
  animation-delay: 1.2s;
}

.animation-delay-1400 {
  animation-delay: 1.4s;
}

/* Hover effects */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}
</style>

