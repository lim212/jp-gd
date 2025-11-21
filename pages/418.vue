<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: '418 - I\'m a teapot | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'I\'m a teapot! Server menolak untuk menyeduh kopi karena itu adalah teko.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Animation states
const isVisible = ref(false)
const showTeapotAnimation = ref(false)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showTeapotAnimation.value = true
  }, 800)
})

// Teapot brewing animation
const brewingSteps = ref([
  'Memeriksa teko...',
  'Mengisi air...',
  'Memanaskan air...',
  'Menyeduh teh...',
  'Teko siap!'
])

const currentStep = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    if (currentStep.value < brewingSteps.value.length - 1) {
      currentStep.value++
    } else {
      clearInterval(interval)
    }
  }, 1500)
})

// Fun facts about 418
const funFacts = ref([
  'Error 418 adalah April Fools\' joke dari RFC 2324',
  'Disebut "I\'m a teapot" karena server menolak menyeduh kopi',
  'Banyak server web tidak mengimplementasikan error ini',
  'Error ini menjadi populer di kalangan developer',
  'Biasanya digunakan untuk testing atau humor'
])

const currentFact = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    currentFact.value = (currentFact.value + 1) % funFacts.value.length
  }, 3000)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Teapot Particles -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- 418 Number with Teapot Effect -->
        <div class="relative mb-8">
          <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-600 to-orange-600 animate-pulse">
            418
          </div>
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
            418
          </div>
          <!-- Teapot overlay -->
          <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-green-500 opacity-20 animate-ping">
            418
          </div>
        </div>

        <!-- Teapot Icon with Animation -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-yellow-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-lucide-coffee" class="w-16 h-16 text-white" />
            </div>
            <div class="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-yellow-600 opacity-30 animate-ping"></div>
            
            <!-- Teapot Elements -->
            <div v-if="showTeapotAnimation" class="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-bounce">
              <UIcon name="i-lucide-leaf" class="w-5 h-5 text-white m-1.5" />
            </div>
            <div v-if="showTeapotAnimation" class="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce animation-delay-1000">
              <UIcon name="i-lucide-smile" class="w-4 h-4 text-white m-1" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          I'm a Teapot! â˜•
        </h1>

        <!-- Subtitle -->
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          Server menolak untuk menyeduh kopi karena itu adalah teko! ðŸ«–
        </p>

        <!-- Description -->
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          Ini adalah error HTTP yang lucu! Error 418 "I'm a teapot" adalah April Fools' joke 
          dari RFC 2324. Server menolak untuk menyeduh kopi karena itu adalah teko.
        </p>

        <!-- Teapot Brewing Animation -->
        <div v-if="showTeapotAnimation" class="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Proses Menyeduh Teh
            </h3>
            
            <!-- Brewing Steps -->
            <div class="space-y-3">
              <div 
                v-for="(step, index) in brewingSteps" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-lg transition-all duration-500"
                :class="{
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200': index === currentStep,
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
                    name="i-lucide-coffee" 
                    class="w-5 h-5 text-green-600 dark:text-green-400 animate-spin" 
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

        <!-- Fun Facts -->
        <div class="max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-800">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Fun Fact tentang Error 418
            </h3>
            
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-300 text-lg font-medium">
                {{ funFacts[currentFact] }}
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
            class="px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-yellow-600 hover:to-orange-600"
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
          
          <!-- Fun Button -->
          <UButton 
            @click="$router.go(-1)"
            size="xl"
            color="green" 
            variant="outline"
            icon="i-lucide-smile"
            class="px-12 py-6 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2"
          >
            <template #leading>
              <UIcon name="i-lucide-smile" class="w-6 h-6" />
            </template>
            ðŸ˜„ Kembali
          </UButton>
        </div>

        <!-- Help Section -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up animation-delay-1200">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tertarik dengan Error 418? â˜•
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Error ini adalah bagian dari sejarah internet yang menarik!
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸŽ­</div>
              <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">April Fools</h4>
              <p class="text-sm text-green-700 dark:text-green-300">Bagian dari RFC 2324 April Fools' joke</p>
            </div>
            
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div class="text-2xl mb-2">â˜•</div>
              <h4 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Teko</h4>
              <p class="text-sm text-yellow-700 dark:text-yellow-300">Server menolak menyeduh kopi</p>
            </div>
            
            <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div class="text-2xl mb-2">ðŸ˜„</div>
              <h4 class="font-semibold text-orange-900 dark:text-orange-100 mb-2">Humor</h4>
              <p class="text-sm text-orange-700 dark:text-orange-300">Digunakan untuk testing atau humor</p>
            </div>
          </div>
        </div>

        <!-- Teapot Notice -->
        <div class="mt-12 text-center animate-fade-in-up animation-delay-1400">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-green-800 dark:text-green-200 font-medium">
              Status: Teko siap menyeduh teh! â˜•
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

