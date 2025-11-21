<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-500 dark:from-emerald-600 dark:via-teal-500 dark:to-cyan-700 shadow-2xl border border-emerald-300 dark:border-emerald-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Floating particles -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-100/10 to-cyan-100/10 dark:via-emerald-900/5 dark:to-cyan-900/5"></div>
      
      <!-- Animated grid pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.3) 1px, transparent 0); background-size: 20px 20px; animation: grid-move 20s linear infinite;"></div>
      </div>
    </div>

    <!-- Section Title -->
    <div class="text-center mb-8 relative z-10 pt-6">
      <div class="flex items-center gap-4 justify-center">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-sm opacity-40"></div>
          <UIcon name="i-lucide-bar-chart-3" class="text-emerald-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
        </div>
        <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
          <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📊 Blog</span> 
          <span class="text-emerald-200 drop-shadow-2xl dark:text-emerald-200 dark:drop-shadow-2xl">Statistics</span> 
          <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📊</span>
          <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full shadow-lg"></span>
        </span>
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full blur-sm opacity-40"></div>
          <UIcon name="i-lucide-trending-up" class="text-teal-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
        </div>
      </div>
      
      <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2 relative z-10 mt-4">
        <div class="text-center">
          <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
            <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
              🎯 <span class="text-emerald-200 dark:text-emerald-200 font-bold">Statistik Blog Terlengkap & Real-time!</span> 🎯
            </p>
          </div>
          <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
            <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
              📈 Pantau performa blog dengan statistik lengkap, engagement metrics, dan analytics terdepan
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-6 relative z-10 pb-6">
      
      <!-- Stat 1: Total Articles -->
      <div class="stat-card articles-stat relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-emerald-200/40 dark:border-emerald-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-50/60 dark:bg-emerald-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-teal-50/60 dark:bg-teal-900/20 rounded-tr-2xl"></div>
        
        <!-- Content -->
        <div class="p-6 flex-grow flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UIcon name="i-lucide-file-text" class="text-white size-8" />
          </div>
          <div class="counter-display mb-2">
            <span class="text-4xl font-bold text-emerald-600 dark:text-emerald-400 counter-number">{{ animatedStats.totalArticles }}</span>
            <span class="text-2xl text-emerald-500">+</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Total Artikel</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Artikel tersedia</p>
          <div class="mt-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Live Update</span>
          </div>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
      </div>

      <!-- Stat 2: Total Views -->
      <div class="stat-card views-stat relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-blue-200/40 dark:border-blue-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl"></div>
        
        <!-- Content -->
        <div class="p-6 flex-grow flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UIcon name="i-lucide-eye" class="text-white size-8" />
          </div>
          <div class="counter-display mb-2">
            <span class="text-4xl font-bold text-blue-600 dark:text-blue-400 counter-number">{{ formatNumber(animatedStats.totalViews) }}</span>
            <span class="text-2xl text-blue-500">+</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Total Views</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Pembaca aktif</p>
          <div class="mt-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">Real-time</span>
          </div>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
      </div>

      <!-- Stat 3: Categories -->
      <div class="stat-card categories-stat relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-purple-200/40 dark:border-purple-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-purple-50/60 dark:bg-purple-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-pink-50/60 dark:bg-pink-900/20 rounded-tr-2xl"></div>
        
        <!-- Content -->
        <div class="p-6 flex-grow flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UIcon name="i-lucide-tags" class="text-white size-8" />
          </div>
          <div class="counter-display mb-2">
            <span class="text-4xl font-bold text-purple-600 dark:text-purple-400 counter-number">{{ animatedStats.totalCategories }}</span>
            <span class="text-2xl text-purple-500">+</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Kategori</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Topik tersedia</p>
          <div class="mt-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-purple-600 dark:text-purple-400 font-medium">Diversified</span>
          </div>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
      </div>

      <!-- Stat 4: Engagement Rate -->
      <div class="stat-card engagement-stat relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-orange-200/40 dark:border-orange-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
        <!-- Animated top accent line -->
        <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 z-10 shadow-lg"></div>
        
        <!-- Corner accents -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-orange-50/60 dark:bg-orange-900/20 rounded-bl-2xl"></div>
        <div class="absolute bottom-0 left-0 w-20 h-20 bg-amber-50/60 dark:bg-amber-900/20 rounded-tr-2xl"></div>
        
        <!-- Content -->
        <div class="p-6 flex-grow flex flex-col justify-center items-center text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UIcon name="i-lucide-heart" class="text-white size-8" />
          </div>
          <div class="counter-display mb-2">
            <span class="text-4xl font-bold text-orange-600 dark:text-orange-400 counter-number">{{ animatedStats.engagementRate }}</span>
            <span class="text-2xl text-orange-500">%</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Engagement</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Tingkat interaksi</p>
          <div class="mt-3 flex items-center gap-2">
            <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-orange-600 dark:text-orange-400 font-medium">High Quality</span>
          </div>
        </div>
        
        <!-- Bottom accent -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50"></div>
      </div>
    </div>

    <!-- Real-time Update Indicator -->
    <div class="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 z-20">
      <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      <span class="text-white text-xs font-medium">Live Stats</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Base statistics data
const baseStats = ref({
  totalArticles: 127,
  totalViews: 45678,
  totalCategories: 12,
  engagementRate: 89
})

// Animated statistics
const animatedStats = ref({
  totalArticles: 0,
  totalViews: 0,
  totalCategories: 0,
  engagementRate: 0
})

// Animation duration for each stat
const animationDuration = 2000

// Counter animation function
const animateCounter = (start: number, end: number, duration: number, callback: (value: number) => void) => {
  const startTime = performance.now()
  
  const updateCounter = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.floor(start + (end - start) * easeOutQuart)
    
    callback(currentValue)
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }
  
  requestAnimationFrame(updateCounter)
}

// Format number with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('id-ID')
}

// Start animations when component mounts
onMounted(() => {
  // Animate total articles
  animateCounter(0, baseStats.value.totalArticles, animationDuration, (value) => {
    animatedStats.value.totalArticles = value
  })
  
  // Animate total views with slight delay
  setTimeout(() => {
    animateCounter(0, baseStats.value.totalViews, animationDuration, (value) => {
      animatedStats.value.totalViews = value
    })
  }, 200)
  
  // Animate categories with more delay
  setTimeout(() => {
    animateCounter(0, baseStats.value.totalCategories, animationDuration, (value) => {
      animatedStats.value.totalCategories = value
    })
  }, 400)
  
  // Animate engagement rate last
  setTimeout(() => {
    animateCounter(0, baseStats.value.engagementRate, animationDuration, (value) => {
      animatedStats.value.engagementRate = value
    })
  }, 600)
})

// Simulate real-time updates (optional)
const simulateRealTimeUpdates = () => {
  setInterval(() => {
    // Random small increments to simulate real-time updates
    if (Math.random() > 0.7) {
      baseStats.value.totalViews += Math.floor(Math.random() * 3) + 1
      animateCounter(animatedStats.value.totalViews, baseStats.value.totalViews, 500, (value) => {
        animatedStats.value.totalViews = value
      })
    }
  }, 5000) // Update every 5 seconds
}

// Start real-time simulation after initial animation
setTimeout(() => {
  simulateRealTimeUpdates()
}, animationDuration + 1000)
</script>

<style scoped>
/* Statistics Cards Styling */
.stat-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Specific card hover effects */
.articles-stat:hover {
  box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
}

.views-stat:hover {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

.categories-stat:hover {
  box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25);
}

.engagement-stat:hover {
  box-shadow: 0 25px 50px -12px rgba(251, 146, 60, 0.25);
}

/* Counter animation */
.counter-number {
  background: linear-gradient(135deg, currentColor 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Grid animation */
@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

/* Card entrance animation */
.stat-card {
  animation: fadeInUp 0.6s ease-out;
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .counter-display {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .counter-number {
    font-size: 2rem;
  }
}

/* Pulse animation for live indicator */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

.animate-pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>

