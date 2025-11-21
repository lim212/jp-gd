<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '451 - Tidak Tersedia Karena Alasan Hukum | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Konten tidak tersedia karena alasan hukum. Akses diblokir sesuai dengan peraturan yang berlaku.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showLegalAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showLegalAnimation.value = true
  }, 800)
})

// Legal check animation
const legalChecks = ref([
  'Memeriksa yurisdiksi...',
  'Menganalisis peraturan...',
  'Memvalidasi konten...',
  'Akses diblokir!'
])

const currentCheck = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    if (currentCheck.value < legalChecks.value.length - 1) {
      currentCheck.value++
    } else {
      clearInterval(interval)
    }
  }, 1200)
})

// Legal reasons
const legalReasons = ref([
  'Hak cipta dan kekayaan intelektual',
  'Peraturan pemerintah setempat',
  'Kebijakan platform dan ToS',
  'Pembatasan geografis',
  'Konten yang dilarang atau ilegal'
])

const currentReason = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    currentReason.value = (currentReason.value + 1) % legalReasons.value.length
  }, 3000)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Legal Particles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 451 Number with Legal Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-blue-600 to-indigo-600 animate-pulse">
            451
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            451
          </div>
          <!-- Legal overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-500 opacity-20 animate-ping">
            451
          </div>
        </div>

        <!-- Scale Icon with Animation -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-gray-500 to-blue-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-scale" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-gray-500 to-blue-600 opacity-30 animate-ping"></div>
            
            <!-- Legal Elements -->
            <div v-if="showLegalAnimation" class="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce">
              <UIcon name="i-lucide-shield" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div v-if="showLegalAnimation" class="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce animation-delay-1000">
              <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Tidak Tersedia Karena Alasan Hukum
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Akses diblokir sesuai dengan peraturan yang berlaku! âš–ï¸
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Konten ini tidak tersedia karena alasan hukum. Akses diblokir sesuai dengan 
          peraturan yang berlaku di yurisdiksi Anda atau kebijakan platform.
        </p>

        <!-- Legal Check Animation -->
        <div v-if="showLegalAnimation" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pemeriksaan Hukum
            </h3>
            
            <!-- Legal Check Steps -->
            <div class="space-y-3">
              <div 
                v-for="(check, index) in legalChecks" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
                :class="{
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200': index === currentCheck,
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
                    class="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" 
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

        <!-- Legal Reasons -->
        <div class="max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-800">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Alasan Hukum yang Mungkin
            </h3>
            
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-300 text-lg font-medium">
                {{ legalReasons[currentReason] }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up animation-delay-1000">
          <!-- Home Button -->
          <UButton 
            to="/" 
            size="xl"
            color="primary" 
            icon="i-lucide-home"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600"
          >
            <template #leading>
              <div class="relative">
                <UIcon name="i-lucide-home" class="w-6 h-6" />
                <div class="absolute inset-0 animate-pulse">
                  <UIcon name="i-lucide-home" class="w-6 h-6 opacity-30" />
                </div>
              </div>
            </template>
            ðŸ  Kembali ke Beranda
          </UButton>
          
          <!-- Contact Button -->
          <UButton 
            to="/kontak" 
            size="xl"
            color="gray" 
            variant="outline"
            icon="i-lucide-message-circle"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2"
          >
            <template #leading>
              <UIcon name="i-lucide-message-circle" class="w-6 h-6" />
            </template>
            ðŸ’¬ Hubungi Kami
          </UButton>
        </div>

        <!-- Help Section -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up animation-delay-1200">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mengapa Error 451? âš–ï¸
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Error 451 digunakan ketika konten diblokir karena alasan hukum
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ“œ</div>
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Hukum</h4>
              <p class="text-sm text-blue-700 dark:text-blue-300">Mematuhi peraturan yang berlaku</p>
            </div>
            
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ›¡ï¸</div>
              <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Perlindungan</h4>
              <p class="text-sm text-green-700 dark:text-green-300">Melindungi hak cipta dan IP</p>
            </div>
            
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸŒ</div>
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Global</h4>
              <p class="text-sm text-purple-700 dark:text-purple-300">Mematuhi hukum internasional</p>
            </div>
          </div>
        </div>

        <!-- Legal Notice -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1400">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Status: Akses diblokir sesuai peraturan hukum
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

