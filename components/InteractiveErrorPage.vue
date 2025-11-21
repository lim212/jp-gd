<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  errorCode: string
  title: string
  subtitle: string
  description: string
  icon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  mood?: 'happy' | 'sad' | 'confused' | 'excited' | 'sleepy'
  showProgress?: boolean
  showCountdown?: boolean
  countdownTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  mood: 'confused',
  showProgress: false,
  showCountdown: false,
  countdownTime: 30
})

// Animation states
const isVisible = ref(false)
const showAnimation = ref(false)
const progress = ref(0)
const countdown = ref(props.countdownTime)
const currentStep = ref(0)
const isPlaying = ref(false)

// Fun messages based on error code and mood
const funMessages = computed(() => {
  const messages = {
    '404': {
      happy: ['Oops! Halaman ini kabur! 😄', 'Sepertinya halaman ini sedang liburan! 🏖️', 'Halaman ini mungkin sedang bermain petak umpet! 🎮'],
      confused: ['Hmm, halaman ini kemana ya? 🤔', 'Aneh, tadi ada di sini... 🤷‍♂️', 'Halaman ini seperti hantu, ada tapi tidak ada! 👻'],
      sad: ['Halaman ini hilang! 😢', 'Kita kehilangan halaman ini! 💔', 'Halaman ini mungkin sedih dan bersembunyi! 😞']
    },
    '500': {
      happy: ['Server sedang pesta! 🎉', 'Server mungkin sedang makan siang! 🍕', 'Server sedang bermain game! 🎮'],
      confused: ['Server bingung apa yang harus dilakukan! 🤯', 'Server sedang berpikir keras! 🧠', 'Server mungkin lupa password! 🔑'],
      sad: ['Server sedang sedih! 😢', 'Server mungkin sakit! 🤒', 'Server butuh pelukan! 🤗']
    },
    '403': {
      happy: ['Akses ditolak dengan senyuman! 😊', 'Halaman ini eksklusif! 🎭', 'Halaman VIP! 👑'],
      confused: ['Halaman ini tidak mengenal Anda! 🤔', 'Halaman ini butuh kartu identitas! 🆔', 'Halaman ini sedang rapat! 🤝'],
      sad: ['Halaman ini tidak mau bertemu! 😞', 'Halaman ini sedang marah! 😠', 'Halaman ini butuh waktu sendiri! 😔']
    }
  }
  
  return messages[props.errorCode]?.[props.mood] || ['Terjadi kesalahan! 😅']
})

const currentMessage = ref(funMessages.value[0])
const messageIndex = ref(0)

// Rotate messages
const rotateMessage = () => {
  if (funMessages.value.length > 1) {
    messageIndex.value = (messageIndex.value + 1) % funMessages.value.length
    currentMessage.value = funMessages.value[messageIndex.value]
  }
}

// Play sound effect (if available)
const playSound = () => {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('Audio not supported')
    }
  }
}

// Interactive click handler
const handleClick = () => {
  if (!isPlaying.value) {
    isPlaying.value = true
    playSound()
    rotateMessage()
    
    setTimeout(() => {
      isPlaying.value = false
    }, 1000)
  }
}

// Computed styles
const gradientBg = computed(() => 
  `bg-gradient-to-br from-${props.primaryColor}-50 via-white to-${props.secondaryColor}-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`
)

const numberGradient = computed(() => 
  `text-transparent bg-clip-text bg-gradient-to-r from-${props.primaryColor}-600 via-${props.accentColor}-600 to-${props.secondaryColor}-600`
)

const iconGradient = computed(() => 
  `bg-gradient-to-r from-${props.primaryColor}-500 to-${props.accentColor}-600`
)

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  setTimeout(() => {
    showAnimation.value = true
  }, 800)

  // Progress animation
  if (props.showProgress) {
    const interval = setInterval(() => {
      if (progress.value < 100) {
        progress.value += Math.random() * 12
        if (progress.value > 100) progress.value = 100
      } else {
        clearInterval(interval)
      }
    }, 600)
  }

  // Countdown animation
  if (props.showCountdown) {
    const countdownInterval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        clearInterval(countdownInterval)
      }
    }, 1000)
  }

  // Auto-rotate messages
  const messageInterval = setInterval(rotateMessage, 5000)
  
  onBeforeUnmount(() => {
    clearInterval(messageInterval)
  })
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden" :class="gradientBg">
    <!-- Funny Animated Background -->
    <FunnyErrorAnimations 
      :error-code="errorCode" 
      :mood="mood" 
      intensity="medium" 
    />

    <!-- Main Content Container -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Enhanced Error Number with Fun Effects -->
        <div class="relative mb-12">
          <div class="relative cursor-pointer" @click="handleClick">
            <div 
              class="text-8xl sm:text-9xl lg:text-[12rem] font-black leading-none transition-all duration-500 hover:scale-110"
              :class="numberGradient"
            >
              {{ errorCode }}
            </div>
            
            <!-- Multiple shadow layers for depth -->
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
              {{ errorCode }}
            </div>
            <div class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black text-gray-300 dark:text-gray-600 -z-20 blur-md">
              {{ errorCode }}
            </div>
            
            <!-- Animated overlay -->
            <div 
              class="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-black opacity-20 animate-pulse"
              :class="`text-${primaryColor}-500`"
            >
              {{ errorCode }}
            </div>
          </div>
          
          <!-- Fun decorative elements -->
          <div class="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm animate-ping text-2xl">
            {{ mood === 'happy' ? '😊' : mood === 'sad' ? '😢' : mood === 'excited' ? '🤩' : mood === 'sleepy' ? '😴' : '🤔' }}
          </div>
          <div class="absolute -bottom-4 -right-4 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm animate-ping text-xl" style="animation-delay: 1s;">
            {{ mood === 'happy' ? '✨' : mood === 'sad' ? '💧' : mood === 'excited' ? '🚀' : mood === 'sleepy' ? '💤' : '❓' }}
          </div>
        </div>

        <!-- Enhanced Icon with Fun Animation -->
        <div class="flex justify-center mb-12">
          <div class="relative group cursor-pointer" @click="handleClick">
            <!-- Main icon container with glassmorphism -->
            <div 
              class="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-3xl"
              :class="iconGradient"
            >
              <UIcon :name="icon" class="w-20 h-20 text-white drop-shadow-lg" />
            </div>
            
            <!-- Animated ring -->
            <div 
              class="absolute inset-0 rounded-3xl opacity-30 animate-ping"
              :class="iconGradient"
            ></div>
            
            <!-- Fun floating elements -->
            <div 
              v-if="showAnimation" 
              class="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce text-2xl"
            >
              {{ mood === 'happy' ? '🎉' : mood === 'sad' ? '😢' : mood === 'excited' ? '⚡' : mood === 'sleepy' ? '🌙' : '🔧' }}
            </div>
            <div 
              v-if="showAnimation" 
              class="absolute -bottom-6 -left-6 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce text-xl"
              style="animation-delay: 0.5s;"
            >
              {{ mood === 'happy' ? '🌟' : mood === 'sad' ? '💔' : mood === 'excited' ? '🔥' : mood === 'sleepy' ? '⭐' : '🛠️' }}
            </div>
          </div>
        </div>

        <!-- Enhanced Typography with Fun Messages -->
        <div class="mb-16 space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            {{ title }}
          </h1>
          
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {{ subtitle }}
          </p>
          
          <!-- Fun rotating message -->
          <div class="max-w-2xl mx-auto">
            <div 
              class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 transition-all duration-500 cursor-pointer hover:scale-105"
              @click="handleClick"
            >
              {{ currentMessage }}
            </div>
          </div>
          
          <p class="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {{ description }}
          </p>
        </div>

        <!-- Fun Progress Section (if enabled) -->
        <div v-if="showProgress" class="max-w-2xl mx-auto mb-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Status Progress 🚀
            </h3>
            
            <!-- Enhanced Progress Bar -->
            <div class="mb-8">
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  class="h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  :class="`bg-gradient-to-r from-${primaryColor}-500 to-${accentColor}-500`"
                  :style="{ width: progress + '%' }"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ Math.round(progress) }}% Complete
                </span>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ progress < 25 ? '😴 Starting...' : progress < 50 ? '🤔 Thinking...' : progress < 75 ? '⚡ Working...' : progress < 100 ? '🎯 Almost done...' : '🎉 Complete!' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fun Countdown Section (if enabled) -->
        <div v-if="showCountdown" class="max-w-md mx-auto mb-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Countdown Timer ⏰
            </h3>
            
            <!-- Circular Progress -->
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
                  :stroke-dashoffset="314 - (314 * (countdownTime - countdown) / countdownTime)"
                  class="transition-all duration-1000 ease-linear"
                  :class="`text-${primaryColor}-500`"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ countdown }}</span>
              </div>
            </div>
            
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ countdown > 0 ? 'seconds remaining' : 'Ready to retry! 🎉' }}
            </p>
          </div>
        </div>

        <!-- Enhanced Action Buttons with Fun Effects -->
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
          <div 
            class="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20"
            :class="`bg-${primaryColor}-100 dark:bg-${primaryColor}-900/30`"
          >
            <div 
              class="w-3 h-3 rounded-full animate-pulse"
              :class="`bg-${primaryColor}-500`"
            ></div>
            <p 
              class="text-sm font-medium"
              :class="`text-${primaryColor}-800 dark:text-${primaryColor}-200`"
            >
              Status: {{ errorCode }} Error - Tim support sedang bekerja {{ mood === 'happy' ? '😊' : mood === 'sad' ? '😢' : mood === 'excited' ? '🤩' : mood === 'sleepy' ? '😴' : '🤔' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <FloatingActionButtons />
    
    <!-- Live Chat Component -->
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
