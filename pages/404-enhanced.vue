<script setup lang="ts">
// SEO Meta
useHead({
  title: '404 - Halaman Tidak Ditemukan | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Halaman yang Anda cari tidak ditemukan. Mari kita bantu Anda menemukan apa yang Anda butuhkan.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Enhanced 404 page configuration
const errorConfig = {
  errorCode: '404',
  title: 'Halaman Tidak Ditemukan',
  subtitle: 'Sepertinya halaman yang Anda cari sudah pindah atau tidak ada! 🔍',
  description: 'Jangan khawatir, ini bukan kesalahan Anda. Mari kita bantu Anda menemukan apa yang Anda butuhkan.',
  icon: 'i-lucide-search-x',
  primaryColor: 'blue',
  secondaryColor: 'purple',
  accentColor: 'pink',
  showProgress: false,
  showCountdown: true,
  countdownTime: 30,
  showDetailedStatus: false,
  showDebugInfo: true,
  showRetryOptions: true
}

// Popular pages suggestions
const popularPages = [
  {
    title: 'Beranda',
    description: 'Kembali ke halaman utama',
    icon: 'i-lucide-home',
    link: '/',
    color: 'blue'
  },
  {
    title: 'Jasa PayPal',
    description: 'Layanan pembayaran PayPal',
    icon: 'i-lucide-credit-card',
    link: '/jasa-paypal',
    color: 'green'
  },
  {
    title: 'Testimoni',
    description: 'Lihat pengalaman pelanggan',
    icon: 'i-lucide-message-circle',
    link: '/testimonials',
    color: 'purple'
  },
  {
    title: 'Tentang Kami',
    description: 'Pelajari lebih lanjut tentang kami',
    icon: 'i-lucide-info',
    link: '/tentang-kami',
    color: 'purple'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Enhanced Animated Background -->
    <ErrorAnimations type="geometric" color="blue" intensity="low" />
    
    <!-- Main Content Container -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Enhanced 404 Number with Glassmorphism Effect -->
        <div class="relative mb-12">
          <div class="relative">
            <div class="text-8xl sm:text-9xl lg:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              404
            </div>
            
            <!-- Multiple shadow layers for depth -->
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
              404
            </div>
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-gray-300 dark:text-gray-600 -z-20 blur-md">
              404
            </div>
            
            <!-- Animated overlay -->
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-blue-500 opacity-20 animate-pulse">
              404
            </div>
          </div>
          
          <!-- Decorative elements -->
          <div class="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm animate-ping"></div>
          <div class="absolute -bottom-4 -right-4 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm animate-ping" style="animation-delay: 1s;"></div>
        </div>

        <!-- Enhanced Search Icon with Modern Design -->
        <div class="flex justify-center mb-12">
          <div class="relative group">
            <!-- Main icon container with glassmorphism -->
            <div class="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl bg-gradient-to-r from-blue-500 to-purple-600">
              <UIcon name="i-lucide-search-x" class="w-20 h-20 text-white drop-shadow-lg" />
            </div>
            
            <!-- Animated ring -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping"></div>
            
            <!-- Floating elements -->
            <div class="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce">
              <UIcon name="i-lucide-compass" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="absolute -bottom-6 -left-6 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce" style="animation-delay: 0.5s;">
              <UIcon name="i-lucide-map-pin" class="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Enhanced Typography -->
        <div class="mb-16 space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Halaman Tidak Ditemukan
          </h1>
          
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Sepertinya halaman yang Anda cari sudah pindah atau tidak ada! 🔍
          </p>
          
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Jangan khawatir, ini bukan kesalahan Anda. Mari kita bantu Anda menemukan apa yang Anda butuhkan.
          </p>
        </div>

        <!-- Popular Pages Suggestions -->
        <div class="max-w-4xl mx-auto mb-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Halaman Populer
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <UButton 
                v-for="page in popularPages"
                :key="page.title"
                :to="page.link"
                :color="page.color"
                variant="outline"
                class="p-6 h-auto flex-col gap-3 rounded-2xl hover:scale-105 transition-all duration-300 border-2"
              >
                <UIcon :name="page.icon" class="w-8 h-8" />
                <div class="text-center">
                  <div class="font-semibold text-sm">{{ page.title }}</div>
                  <div class="text-xs opacity-75">{{ page.description }}</div>
                </div>
              </UButton>
            </div>
          </div>
        </div>

        <!-- Enhanced Interactive Elements -->
        <ErrorInteractiveElements 
          error-code="404"
          :show-debug-info="true"
          :show-retry-options="true"
          @retry="$router.go(0)"
          @contact-support="() => {}"
          @report-issue="() => {}"
        />

        <!-- Enhanced Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <UButton 
            to="/" 
            size="xl"
            color="primary" 
            icon="i-lucide-home"
            class="px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600"
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
          >
            <template #leading>
              <UIcon name="i-lucide-arrow-left" class="w-6 h-6" />
            </template>
            ⬅️ Kembali
          </UButton>
        </div>

        <!-- Enhanced Status Indicator -->
        <div class="mt-12 text-center">
          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 bg-blue-100 dark:bg-blue-900/30">
            <div class="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
              Status: 404 Error - Halaman tidak ditemukan
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
/* Enhanced Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(1deg);
  }
  66% {
    transform: translateY(10px) rotate(-1deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
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
