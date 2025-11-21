<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '503 - Layanan Tidak Tersedia | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Layanan sedang tidak tersedia. Server sedang dalam pemeliharaan atau sibuk.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showMaintenanceAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showMaintenanceAnimation.value = true
  }, 900)
})

// Maintenance progress
const maintenanceProgress = ref(0)
const maintenanceSteps = ref([
  'Memeriksa sistem...',
  'Memperbarui database...',
  'Mengoptimalkan performa...',
  'Menguji fungsionalitas...',
  'Hampir selesai...'
])

onMounted(() => {
  // Simulate maintenance progress
  const interval = setInterval(() => {
    if (maintenanceProgress.value < 100) {
      maintenanceProgress.value += Math.random() * 12
      if (maintenanceProgress.value > 100) maintenanceProgress.value = 100
    } else {
      clearInterval(interval)
    }
  }, 600)
})

// Estimated time
const estimatedTime = ref(15) // minutes
const timeRemaining = ref(estimatedTime.value * 60) // seconds

onMounted(() => {
  const interval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Maintenance Particles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 503 Number with Maintenance Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 animate-pulse">
            503
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            503
          </div>
          <!-- Maintenance overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-orange-500 opacity-20 animate-ping">
            503
          </div>
        </div>

        <!-- Maintenance Icon with Animation -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-maintenance" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-red-600 opacity-30 animate-ping"></div>
            
            <!-- Maintenance Tools -->
            <div v-if="showMaintenanceAnimation" class="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-spin">
              <UIcon name="i-lucide-wrench" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div v-if="showMaintenanceAnimation" class="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce">
              <UIcon name="i-lucide-check" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Layanan Sedang Diperbaiki
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Tim teknisi kami sedang bekerja keras! ðŸ”§
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Server sedang dalam pemeliharaan rutin untuk memberikan pengalaman terbaik. 
          Kami akan kembali online dalam beberapa menit.
        </p>

        <!-- Maintenance Progress -->
        <div v-if="showMaintenanceAnimation" class="max-w-lg mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Status Pemeliharaan
            </h3>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
              <div 
                class="bg-gradient-to-r from-orange-500 to-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                :style="{ width: maintenanceProgress + '%' }"
              ></div>
            </div>
            
            <!-- Progress Text -->
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ Math.round(maintenanceProgress) }}% - {{ maintenanceSteps[Math.floor(maintenanceProgress / 20)] || 'Selesai!' }}
            </p>
            
            <!-- Time Remaining -->
            <div class="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
              <UIcon name="i-lucide-clock" class="w-5 h-5" />
              <span class="text-lg font-semibold">
                Estimasi: {{ formatTime(timeRemaining) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up animation-delay-800">
          <!-- Refresh Button -->
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
            ðŸ”„ Cek Status
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
            Apa yang Sedang Terjadi? ðŸ”§
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Kami sedang melakukan pemeliharaan rutin untuk meningkatkan performa dan keamanan
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div class="text-2xl mb-2">âš¡</div>
              <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Optimasi</h4>
              <p class="text-sm text-blue-700 dark:text-blue-300">Meningkatkan kecepatan server</p>
            </div>
            
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ”’</div>
              <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Keamanan</h4>
              <p class="text-sm text-green-700 dark:text-green-300">Memperbarui sistem keamanan</p>
            </div>
            
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ†•</div>
              <h4 class="font-semibold text-purple-900 dark:text-purple-100 mb-2">Update</h4>
              <p class="text-sm text-purple-700 dark:text-purple-300">Menambahkan fitur baru</p>
            </div>
          </div>
        </div>

        <!-- Status Notice -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1200">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-orange-800 dark:text-orange-200 font-medium">
              Status: Pemeliharaan rutin sedang berlangsung
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

