<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '401 - Tidak Diizinkan | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Anda perlu melakukan autentikasi untuk mengakses halaman ini. Silakan login terlebih dahulu.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showAuthAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showAuthAnimation.value = true
  }, 600)
})

// Authentication check animation
const authSteps = ref([
  'Memeriksa sesi...',
  'Memvalidasi token...',
  'Memeriksa kredensial...',
  'Autentikasi diperlukan!'
])

const currentStep = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    if (currentStep.value < authSteps.value.length - 1) {
      currentStep.value++
    } else {
      clearInterval(interval)
    }
  }, 800)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Auth Particles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 401 Number with Auth Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-pulse">
            401
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            401
          </div>
          <!-- Auth overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-blue-500 opacity-20 animate-ping">
            401
          </div>
        </div>

        <!-- Lock Icon with Animation -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-lock" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 animate-ping"></div>
            
            <!-- Auth Elements -->
            <div v-if="showAuthAnimation" class="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce">
              <UIcon name="i-lucide-key" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div v-if="showAuthAnimation" class="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce animation-delay-1000">
              <UIcon name="i-lucide-user" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Autentikasi Diperlukan
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Anda perlu login untuk mengakses halaman ini! ðŸ”
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Halaman ini memerlukan autentikasi. Silakan hubungi customer service kami untuk bantuan lebih lanjut.
        </p>

        <!-- Auth Check Animation -->
        <div v-if="showAuthAnimation" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pemeriksaan Autentikasi
            </h3>
            
            <!-- Auth Check Steps -->
            <div class="space-y-3">
              <div 
                v-for="(step, index) in authSteps" 
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
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up animation-delay-800">
          <!-- Login Button -->
          <UButton 
            to="/login" 
            size="xl"
            color="primary" 
            icon="i-lucide-log-in"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600"
          >
            <template #leading>
              <div class="relative">
                <UIcon name="i-lucide-log-in" class="w-6 h-6" />
                <div class="absolute inset-0 animate-pulse">
                  <UIcon name="i-lucide-log-in" class="w-6 h-6 opacity-30" />
                </div>
              </div>
            </template>
            ðŸ” Login Sekarang
          </UButton>
          
          <!-- Contact Button -->
          <UButton 
            href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com,%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0"
            target="_blank"
            size="xl"
            color="green" 
            variant="outline"
            icon="i-lucide-message-circle"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-xl border-2"
          >
            <template #leading>
              <UIcon name="i-lucide-message-circle" class="w-6 h-6" />
            </template>
            ðŸ'¤ Hubungi WhatsApp
          </UButton>
        </div>

        <!-- Alternative Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-1000">
          <UButton 
            to="/" 
            color="gray" 
            variant="ghost"
            icon="i-lucide-home"
            class="px-8 py-4 text-lg rounded-full"
          >
            ðŸ  Kembali ke Beranda
          </UButton>
          
          <UButton 
            to="/forgot-password" 
            color="orange" 
            variant="ghost"
            icon="i-lucide-key"
            class="px-8 py-4 text-lg rounded-full"
          >
            ðŸ”‘ Lupa Password?
          </UButton>
        </div>

        <!-- Help Section -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up animation-delay-1200">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Butuh Bantuan Login? ðŸ”‘
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Tim support kami siap membantu Anda dengan proses login dan registrasi
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

        <!-- Auth Notice -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1400">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Autentikasi diperlukan untuk keamanan data Anda
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

