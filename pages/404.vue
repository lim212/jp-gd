<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '404 - Halaman Tidak Ditemukan | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Halaman yang Anda cari tidak ditemukan. Kembali ke beranda untuk melanjutkan browsing di JasaPembayaran.com' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showParticles = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showParticles.value = true
  }, 500)
})

// Floating particles animation
const particles = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 3 + Math.random() * 2
})))
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Floating Particles -->
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse"
        :style="{
          left: particle.x + '%',
          top: particle.y + '%',
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's'
        }"
      ></div>
      
      <!-- Gradient Orbs -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 404 Number with Glitch Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
            404
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            404
          </div>
          <!-- Glitch overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-red-500 opacity-0 animate-glitch">
            404
          </div>
        </div>

        <!-- Astronaut Icon -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-search-x" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping"></div>
            <!-- Floating elements around the icon -->
            <div class="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce animation-delay-1000">
              <UIcon name="i-lucide-star" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div class="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce animation-delay-2000">
              <UIcon name="i-lucide-heart" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Oops! Halaman Hilang
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Sepertinya halaman yang Anda cari sedang berlibur ke galaksi lain! ðŸš€
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Jangan khawatir, tim astronot kami akan membantu Anda kembali ke Bumi (beranda) dengan selamat.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up animation-delay-600">
          <!-- Home Button - Super Keren -->
          <UButton 
            to="/" 
            size="xl"
            color="primary" 
            icon="i-lucide-home"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600"
          >
            <template #leading>
              <div class="relative">
                <UIcon name="i-lucide-home" class="w-6 h-6" />
                <div class="absolute inset-0 animate-ping">
                  <UIcon name="i-lucide-home" class="w-6 h-6 opacity-30" />
                </div>
              </div>
            </template>
            ðŸ  Kembali ke Beranda
          </UButton>
          
          <!-- Back Button -->
          <UButton 
            @click="$router.go(-1)"
            size="xl"
            color="gray" 
            variant="outline"
            icon="i-lucide-arrow-left"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2"
          >
            <template #leading>
              <UIcon name="i-lucide-arrow-left" class="w-6 h-6" />
            </template>
            â¬…ï¸ Kembali
          </UButton>
        </div>

        <!-- Help Section -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up animation-delay-800">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Butuh Bantuan Navigasi? ðŸ§­
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Tim support kami siap membantu Anda menemukan apa yang Anda cari
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              to="/informasi/rekening" 
              color="purple" 
              variant="outline"
              icon="i-lucide-credit-card"
              class="p-4 rounded-xl hover:scale-105 transition-transform"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">ðŸ’³</div>
                <div class="text-sm font-medium">Info Rekening</div>
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

        <!-- Fun Facts -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1000">
          <p class="text-sm text-gray-500 dark:text-gray-400 italic">
            ðŸ’¡ Fun Fact: Error 404 dinamai dari ruangan 404 di CERN, tempat server web pertama kali dibuat!
          </p>
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
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes glitch {
  0%, 100% {
    transform: translate(0);
    opacity: 0;
  }
  20% {
    transform: translate(-2px, 2px);
    opacity: 0.3;
  }
  40% {
    transform: translate(-2px, -2px);
    opacity: 0.3;
  }
  60% {
    transform: translate(2px, 2px);
    opacity: 0.3;
  }
  80% {
    transform: translate(2px, -2px);
    opacity: 0.3;
  }
}

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

.animate-blob {
  animation: blob 7s infinite;
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

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-glitch {
  animation: glitch 0.3s infinite;
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

/* Hover effects */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}
</style>

