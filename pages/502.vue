<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '502 - Bad Gateway | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Bad Gateway. Server menerima respons tidak valid dari server upstream.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showGatewayAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showGatewayAnimation.value = true
  }, 800)
})

// Gateway check animation
const gatewayChecks = ref([
  'Memeriksa koneksi...',
  'Menganalisis gateway...',
  'Memvalidasi respons...',
  'Gateway bermasalah!'
])

const currentCheck = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    if (currentCheck.value < gatewayChecks.value.length - 1) {
      currentCheck.value++
    } else {
      clearInterval(interval)
    }
  }, 1200)
})

// Connection status
const connectionStatus = ref('connecting')
const connectionSteps = ref([
  'Mencoba koneksi ulang...',
  'Memeriksa server upstream...',
  'Memvalidasi gateway...',
  'Koneksi berhasil!'
])

const currentStep = ref(0)

onMounted(() => {
  setTimeout(() => {
    connectionStatus.value = 'reconnecting'
    const interval = setInterval(() => {
      if (currentStep.value < connectionSteps.value.length - 1) {
        currentStep.value++
      } else {
        connectionStatus.value = 'connected'
        clearInterval(interval)
      }
    }, 1500)
  }, 3000)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Gateway Particles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 502 Number with Gateway Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-gray-600 to-blue-600 animate-pulse">
            502
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            502
          </div>
          <!-- Gateway overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-red-500 opacity-20 animate-ping">
            502
          </div>
        </div>

        <!-- Network Icon with Animation -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-gray-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-network" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-gray-600 opacity-30 animate-ping"></div>
            
            <!-- Network Elements -->
            <div v-if="showGatewayAnimation" class="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full animate-bounce">
              <UIcon name="i-lucide-wifi-off" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div v-if="showGatewayAnimation" class="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce animation-delay-1000">
              <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Bad Gateway
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Server upstream bermasalah! ðŸŒ
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Server menerima respons tidak valid dari server upstream. Ini biasanya masalah sementara 
          yang akan diperbaiki dalam beberapa menit.
        </p>

        <!-- Gateway Check Animation -->
        <div v-if="showGatewayAnimation" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pemeriksaan Gateway
            </h3>
            
            <!-- Gateway Check Steps -->
            <div class="space-y-3">
              <div 
                v-for="(check, index) in gatewayChecks" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
                :class="{
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200': index === currentCheck,
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200': index < currentCheck,
                  'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400': index > currentCheck
                }"
              >
                <div class="flex-shrink-0">
                  <UIcon 
                    v-if="index < currentCheck"
                    name="i-lucide-check" 
                    class="w-5 h-5 text-green-600 dark:text-green-400" 
                  />
                  <UIcon 
                    v-else-if="index === currentCheck"
                    name="i-lucide-clock" 
                    class="w-5 h-5 text-red-600 dark:text-red-400 animate-spin" 
                  />
                  <UIcon 
                    v-else
                    name="i-lucide-circle" 
                    class="w-5 h-5 text-gray-400" 
                  />
                </div>
                <span class="text-sm font-medium">{{ check }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Connection Status -->
        <div v-if="connectionStatus === 'reconnecting'" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-800">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mencoba Koneksi Ulang
            </h3>
            
            <!-- Connection Steps -->
            <div class="space-y-3">
              <div 
                v-for="(step, index) in connectionSteps" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
                :class="{
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200': index === currentStep,
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
                    class="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" 
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
            @click="$router.go(0)"
            size="xl"
            color="primary" 
            icon="i-lucide-refresh-cw"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600"
          >
            <template #leading>
              <div class="relative">
                <UIcon name="i-lucide-refresh-cw" class="w-6 h-6" />
                <div class="absolute inset-0 animate-spin">
                  <UIcon name="i-lucide-refresh-cw" class="w-6 h-6 opacity-30" />
                </div>
              </div>
            </template>
            ðŸ”„ Coba Lagi
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
            Apa itu Bad Gateway? ðŸŒ
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Bad Gateway terjadi ketika server tidak dapat menerima respons yang valid dari server lain
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ”„</div>
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Sementara</h4>
              <p class="text-sm text-blue-700 dark:text-blue-300">Biasanya masalah sementara</p>
            </div>
            
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div class="text-2xl mb-2">â±ï¸</div>
              <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Cepat</h4>
              <p class="text-sm text-green-700 dark:text-green-300">Akan diperbaiki dalam beberapa menit</p>
            </div>
            
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ”§</div>
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Otomatis</h4>
              <p class="text-sm text-purple-700 dark:text-purple-300">Sistem akan memperbaiki sendiri</p>
            </div>
          </div>
        </div>

        <!-- Gateway Notice -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1400">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-red-800 dark:text-red-200 font-medium">
              Status: Gateway sedang diperbaiki
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

