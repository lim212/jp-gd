<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '500 - Kesalahan Server | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Terjadi kesalahan internal server. Tim kami sedang memperbaikinya dengan senyuman! 😊' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Enhanced 500 page configuration with super fun elements
const errorConfig = {
  errorCode: '500',
  title: 'Server Sedang Bermasalah',
  subtitle: 'Tim teknisi kami sedang bekerja keras memperbaikinya! 🔧',
  description: 'Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. Tim kami telah diberitahu dan sedang memperbaiki masalah ini dengan penuh semangat!',
  icon: 'i-lucide-server-crash',
  primaryColor: 'red',
  secondaryColor: 'purple',
  accentColor: 'violet',
  mood: 'excited', // happy, sad, confused, excited, sleepy
  showProgress: true,
  showCountdown: false,
  showDetailedStatus: true,
  showDebugInfo: true,
  showRetryOptions: true
}

// Fun interactive elements
const clickCount = ref(0)
const showCelebration = ref(false)
const soundEffects = ref()
const visualEffects = ref()

// Handle fun interactions
const handleFunClick = () => {
  clickCount.value++
  
  // Play sound effect
  if (soundEffects.value) {
    soundEffects.value.playRandomSound()
  }
  
  // Show celebration after 5 clicks
  if (clickCount.value >= 5 && !showCelebration.value) {
    showCelebration.value = true
    
    // Play celebration sound
    if (soundEffects.value) {
      soundEffects.value.playCelebration()
    }
    
    // Show visual effects
    if (visualEffects.value) {
      visualEffects.value.startEffect()
    }
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      showCelebration.value = false
    }, 3000)
  }
}

onMounted(() => {
  // Auto-play welcome sound
  setTimeout(() => {
    if (soundEffects.value) {
      soundEffects.value.playSound('notification')
    }
  }, 1000)
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Funny Animated Background -->
    <FunnyErrorAnimations 
      :error-code="errorCode" 
      :mood="mood" 
      intensity="high" 
    />

    <!-- Main Content Container -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Super Fun Error Number -->
        <div class="relative mb-12">
          <div class="relative cursor-pointer" @click="handleFunClick">
            <div class="text-8xl sm:text-9xl lg:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-600 to-violet-600 transition-all duration-500 hover:scale-110 hover:rotate-3">
              500
            </div>
            
            <!-- Multiple shadow layers for depth -->
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
              500
            </div>
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-gray-300 dark:text-gray-600 -z-20 blur-md">
              500
            </div>
            
            <!-- Animated overlay -->
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-red-500 opacity-20 animate-pulse">
              500
            </div>
          </div>
          
          <!-- Fun decorative elements -->
          <div class="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm animate-ping text-2xl">
            🤩
          </div>
          <div class="absolute -bottom-4 -right-4 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm animate-ping text-xl" style="animation-delay: 1s;">
            🚀
          </div>
          
          <!-- Click counter -->
          <div v-if="clickCount > 0" class="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div class="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold animate-bounce">
              Clicks: {{ clickCount }} {{ clickCount >= 5 ? '🎉' : '' }}
            </div>
          </div>
        </div>

        <!-- Super Fun Icon -->
        <div class="flex justify-center mb-12">
          <div class="relative group cursor-pointer" @click="handleFunClick">
            <!-- Main icon container -->
            <div class="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-3xl bg-gradient-to-r from-red-500 to-orange-600">
              <UIcon name="i-lucide-server-crash" class="w-20 h-20 text-white drop-shadow-lg" />
            </div>
            
            <!-- Animated ring -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 to-orange-600 opacity-30 animate-ping"></div>
            
            <!-- Fun floating elements -->
            <div class="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce text-2xl">
              ⚡
            </div>
            <div class="absolute -bottom-6 -left-6 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce text-xl" style="animation-delay: 0.5s;">
              🛠️
            </div>
          </div>
        </div>

        <!-- Enhanced Typography -->
        <div class="mb-16 space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Server Sedang Bermasalah
          </h1>
          
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tim teknisi kami sedang bekerja keras memperbaikinya! 🔧
          </p>
          
          <!-- Fun rotating message -->
          <div class="max-w-2xl mx-auto">
            <div class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 transition-all duration-500 cursor-pointer hover:scale-105" @click="handleFunClick">
              {{ clickCount < 3 ? 'Server sedang pesta! 🎉' : clickCount < 5 ? 'Server mungkin sedang makan siang! 🍕' : 'Server sedang bermain game! 🎮' }}
            </div>
          </div>
          
          <p class="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. Tim kami telah diberitahu dan sedang memperbaiki masalah ini dengan penuh semangat!
          </p>
        </div>

        <!-- Fun Progress Section -->
        <div class="max-w-2xl mx-auto mb-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Status Progress 🚀
            </h3>
            
            <!-- Enhanced Progress Bar -->
            <div class="mb-8">
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                <div class="h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" style="width: 75%;">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  75% Complete
                </span>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ⚡ Working hard...
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Super Fun Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <UButton 
            to="/" 
            size="xl"
            color="primary" 
            icon="i-lucide-home"
            class="px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600"
            @click="soundEffects?.playSound('success')"
          >
            <template #leading>
              <UIcon name="i-lucide-home" class="w-6 h-6" />
            </template>
            🏠 Kembali ke Beranda
          </UButton>
          
          <UButton 
            @click="$router.go(-1)"
            size="xl"
            color="gray" 
            variant="outline"
            icon="i-lucide-arrow-left"
            class="px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 dark:border-gray-600"
            @click="soundEffects?.playSound('click')"
          >
            <template #leading>
              <UIcon name="i-lucide-arrow-left" class="w-6 h-6" />
            </template>
            ⬅️ Kembali
          </UButton>
        </div>

        <!-- Fun Help Section -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Butuh Bantuan? 🚀
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Tim support kami siap membantu Anda 24/7 melalui berbagai saluran komunikasi
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UButton 
              to="/testimonials" 
              color="green" 
              variant="outline"
              icon="i-lucide-message-circle"
              class="p-6 rounded-2xl hover:scale-105 transition-all duration-300 border-2"
              @click="soundEffects?.playSound('hover')"
            >
              <div class="text-center">
                <div class="text-3xl mb-3">💬</div>
                <div class="text-sm font-semibold">Testimoni</div>
              </div>
            </UButton>
            
            <UButton 
              to="/informasi/transaksi" 
              color="blue" 
              variant="outline"
              icon="i-lucide-info"
              class="p-6 rounded-2xl hover:scale-105 transition-all duration-300 border-2"
              @click="soundEffects?.playSound('hover')"
            >
              <div class="text-center">
                <div class="text-3xl mb-3">ℹ️</div>
                <div class="text-sm font-semibold">Info Transaksi</div>
              </div>
            </UButton>
            
            <UButton 
              to="/bukti-transaksi" 
              color="orange" 
              variant="outline"
              icon="i-lucide-file-check"
              class="p-6 rounded-2xl hover:scale-105 transition-all duration-300 border-2"
              @click="soundEffects?.playSound('hover')"
            >
              <div class="text-center">
                <div class="text-3xl mb-3">📄</div>
                <div class="text-sm font-semibold">Bukti Transaksi</div>
              </div>
            </UButton>
          </div>
        </div>

        <!-- Fun Status Indicator -->
        <div class="mt-12 text-center">
          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 bg-red-100 dark:bg-red-900/30">
            <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <p class="text-sm font-medium text-red-800 dark:text-red-200">
              Status: 500 Error - Tim support sedang bekerja 🤩
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <FloatingActionButtons />
    
    <!-- Live Chat Component -->
    <LiveChatComponent />
    
    <!-- Sound Effects -->
    <FunnySoundEffects ref="soundEffects" :enabled="true" :volume="0.3" />
    
    <!-- Visual Effects -->
    <FunnyVisualEffects 
      ref="visualEffects" 
      type="confetti" 
      intensity="high" 
      :duration="3000" 
    />
    
    <!-- Celebration Overlay -->
    <div v-if="showCelebration" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div class="text-8xl animate-bounce">
        🎉
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced Animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s linear infinite;
}

/* Glassmorphism effects */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* Enhanced shadows */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .text-8xl {
    font-size: 4rem;
  }
  
  .w-36.h-36 {
    width: 8rem;
    height: 8rem;
  }
  
  .w-20.h-20 {
    width: 4rem;
    height: 4rem;
  }
}
</style>
