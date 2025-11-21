<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '500 - Kesalahan Server | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Terjadi kesalahan internal server. Tim kami sedang memperbaikinya. Silakan coba lagi nanti.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Enhanced error page configuration
const errorConfig = {
  errorCode: '500',
  title: 'Server Sedang Bermasalah',
  subtitle: 'Tim teknisi kami sedang bekerja keras memperbaikinya! 🔧',
  description: 'Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. Tim kami telah diberitahu dan sedang memperbaiki masalah ini.',
  icon: 'i-lucide-server-crash',
  primaryColor: 'red',
  secondaryColor: 'orange',
  accentColor: 'yellow',
  showProgress: true,
  progressSteps: [
    'Memeriksa sistem...',
    'Menganalisis error...',
    'Memperbaiki kode...',
    'Menguji solusi...',
    'Hampir selesai...'
  ],
  showCountdown: false,
  showDetailedStatus: true,
  showDebugInfo: true,
  showRetryOptions: true
}

// Animation states
const isVisible = ref(false)
const showRepairAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showRepairAnimation.value = true
  }, 1000)
})

// Repair progress animation
const repairProgress = ref(0)
const repairSteps = ref([
  'Memeriksa sistem...',
  'Menganalisis error...',
  'Memperbaiki kode...',
  'Menguji solusi...',
  'Hampir selesai...'
])

onMounted(() => {
  // Simulate repair progress
  const interval = setInterval(() => {
    if (repairProgress.value < 100) {
      repairProgress.value += Math.random() * 15
      if (repairProgress.value > 100) repairProgress.value = 100
    } else {
      clearInterval(interval)
    }
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Enhanced Animated Background -->
    <ErrorAnimations type="particles" color="red" intensity="medium" />
    
    <!-- Main Content Container -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Enhanced 500 Number with Glassmorphism Effect -->
        <div class="relative mb-12">
          <div class="relative">
            <div class="text-8xl sm:text-9xl lg:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
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
          
          <!-- Decorative elements -->
          <div class="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm animate-ping"></div>
          <div class="absolute -bottom-4 -right-4 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm animate-ping" style="animation-delay: 1s;"></div>
        </div>

        <!-- Enhanced Server Icon with Modern Design -->
        <div class="flex justify-center mb-12">
          <div class="relative group">
            <!-- Main icon container with glassmorphism -->
            <div class="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl bg-gradient-to-r from-red-500 to-orange-600">
              <UIcon name="i-lucide-server-crash" class="w-20 h-20 text-white drop-shadow-lg" />
            </div>
            
            <!-- Animated ring -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 to-orange-600 opacity-30 animate-ping"></div>
            
            <!-- Floating elements -->
            <div v-if="showRepairAnimation" class="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce">
              <UIcon name="i-lucide-wrench" class="w-6 h-6 text-blue-600" />
            </div>
            <div v-if="showRepairAnimation" class="absolute -bottom-6 -left-6 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce" style="animation-delay: 0.5s;">
              <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-green-600" />
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
          
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. Tim kami telah diberitahu dan sedang memperbaiki masalah ini.
          </p>
        </div>

        <!-- Enhanced Status Monitor -->
        <ErrorStatusMonitor 
          error-code="500" 
          :show-detailed-status="true"
          @refresh="$router.go(0)"
          @contact-support="() => {}"
        />

        <!-- Enhanced Interactive Elements -->
        <ErrorInteractiveElements 
          error-code="500"
          :show-debug-info="true"
          :show-retry-options="true"
          @retry="$router.go(0)"
          @contact-support="() => {}"
          @report-issue="() => {}"
        />

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Tim teknisi kami sedang bekerja keras memperbaikinya! ðŸ”§
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. 
          Tim kami telah diberitahu dan sedang memperbaiki masalah ini.
        </p>

        <!-- Repair Progress -->
        <div v-if="showRepairAnimation" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status Perbaikan
            </h3>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div 
                class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                :style="{ width: repairProgress + '%' }"
              ></div>
            </div>
            
            <!-- Progress Text -->
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ Math.round(repairProgress) }}% - {{ repairSteps[Math.floor(repairProgress / 20)] || 'Selesai!' }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up animation-delay-800">
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
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up animation-delay-1000">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Butuh Bantuan Cepat? ðŸš¨
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Jika masalah berlanjut, hubungi tim support kami melalui WhatsApp atau Live Chat
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <UButton 
              to="/testimonials" 
              color="green" 
              variant="outline"
              icon="i-lucide-message-circle"
              class="p-4 rounded-xl hover:scale-105 transition-transform"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">ðŸ’¬</div>
                <div class="text-sm font-medium">Testimoni</div>
              </div>
            </UButton>
            
            <UButton 
              to="/informasi/transaksi" 
              color="blue" 
              variant="outline"
              icon="i-lucide-info"
              class="p-4 rounded-xl hover:scale-105 transition-transform"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">â„¹ï¸</div>
                <div class="text-sm font-medium">Info Transaksi</div>
              </div>
            </UButton>
            
            <UButton 
              to="/bukti-transaksi" 
              color="orange" 
              variant="outline"
              icon="i-lucide-file-check"
              class="p-4 rounded-xl hover:scale-105 transition-transform"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">ðŸ“„</div>
                <div class="text-sm font-medium">Bukti Transaksi</div>
              </div>
            </UButton>
          </div>
        </div>

        <!-- Status Info -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1200">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              Status: Tim teknisi sedang bekerja
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

/* Hover effects */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}
</style>

