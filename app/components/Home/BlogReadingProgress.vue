<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-cyan-400 via-blue-300 to-indigo-500 dark:from-cyan-600 dark:via-blue-500 dark:to-indigo-700 shadow-2xl border border-cyan-300 dark:border-cyan-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Floating progress icons -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-100/10 to-blue-100/10 dark:via-cyan-900/5 dark:to-blue-900/5"></div>
      
      <!-- Animated progress icons -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-6 h-6 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 0s;">
          <UIcon name="i-lucide-trending-up" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute top-1/3 right-1/3 w-5 h-5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 1s;">
          <UIcon name="i-lucide-book-open" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/4 left-1/3 w-7 h-7 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 2s;">
          <UIcon name="i-lucide-clock" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/3 right-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 0.5s;">
          <UIcon name="i-lucide-target" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>

    <!-- Reading Progress Content -->
    <div class="relative z-10 p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center gap-4 justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-trending-up" class="text-cyan-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
          <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📚 Reading</span> 
            <span class="text-cyan-200 drop-shadow-2xl dark:text-cyan-200 dark:drop-shadow-2xl">Progress</span> 
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📚</span>
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-lg"></span>
          </span>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-target" class="text-blue-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
        </div>
        
        <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2">
          <div class="text-center">
            <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
              <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
                🎯 <span class="text-cyan-200 dark:text-cyan-200 font-bold">Track Progress Membaca Anda!</span> 🎯
              </p>
            </div>
            <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
                📖 Pantau kemajuan membaca, lanjutkan artikel yang belum selesai, dan nikmati pengalaman membaca yang terorganisir
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading Progress Grid -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Current Reading Progress -->
          <div class="progress-card current-progress-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-cyan-200/40 dark:border-cyan-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-cyan-50/60 dark:bg-cyan-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-blue-50/60 dark:bg-blue-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="progress-header bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-book-open" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Current Reading</h3>
                  <p class="text-cyan-100 text-sm">Artikel yang sedang dibaca</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="progress-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Current Article -->
                <div class="current-article p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200/60 dark:border-cyan-600/60">
                  <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm mb-2">Cara Mudah Top Up PayPal 2024</h4>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs text-gray-600 dark:text-gray-400">Reading Progress</span>
                    <span class="text-xs font-bold text-cyan-600 dark:text-cyan-400">{{ currentProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                      :style="{ width: currentProgress + '%' }"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ readingTime }} min read</span>
                    <button
                      @click="continueReading"
                      class="continue-btn px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
                
                <!-- Reading Stats -->
                <div class="reading-stats space-y-2">
                  <div class="stat-item flex items-center justify-between p-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200/60 dark:border-cyan-600/60">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-clock" class="text-cyan-600 dark:text-cyan-400 size-4" />
                      <span class="text-xs text-gray-700 dark:text-gray-300">Time Spent</span>
                    </div>
                    <span class="text-xs font-bold text-cyan-600 dark:text-cyan-400">{{ timeSpent }}m</span>
                  </div>
                  
                  <div class="stat-item flex items-center justify-between p-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200/60 dark:border-cyan-600/60">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-target" class="text-cyan-600 dark:text-cyan-400 size-4" />
                      <span class="text-xs text-gray-700 dark:text-gray-300">Goal Progress</span>
                    </div>
                    <span class="text-xs font-bold text-cyan-600 dark:text-cyan-400">{{ goalProgress }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          </div>

          <!-- Reading History -->
          <div class="progress-card history-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-blue-200/40 dark:border-blue-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="progress-header bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-history" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Reading History</h3>
                  <p class="text-blue-100 text-sm">Artikel yang sudah dibaca</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="progress-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-3">
                <!-- History Stats -->
                <div class="history-stats flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-check-circle" class="text-blue-600 dark:text-blue-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Completed Articles</span>
                  </div>
                  <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ historyStats.completed }}</span>
                </div>
                
                <!-- Recent Articles -->
                <div class="recent-articles space-y-2">
                  <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Recent Reads</h4>
                  <div
                    v-for="article in recentArticles"
                    :key="article.id"
                    class="article-item flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/60 dark:border-blue-600/60 hover:shadow-md transition-all duration-200"
                  >
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <UIcon name="i-lucide-check" class="text-white size-4" />
                    </div>
                    <div class="flex-grow">
                      <h5 class="font-semibold text-gray-800 dark:text-gray-200 text-xs leading-tight">{{ article.title }}</h5>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-blue-600 dark:text-blue-400 text-xs font-medium">✓ Completed</span>
                        <span class="text-gray-500 dark:text-gray-400 text-xs">•</span>
                        <span class="text-gray-500 dark:text-gray-400 text-xs">{{ article.date }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- View All Button -->
                <button
                  @click="viewAllHistory"
                  class="w-full view-all-btn flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                >
                  <UIcon name="i-lucide-list" class="size-4" />
                  View All History
                </button>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
          </div>

          <!-- Reading Goals -->
          <div class="progress-card goals-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-indigo-200/40 dark:border-indigo-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-purple-50/60 dark:bg-purple-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="progress-header bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-target" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Reading Goals</h3>
                  <p class="text-indigo-100 text-sm">Target membaca harian</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="progress-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Daily Goal -->
                <div class="daily-goal p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/60 dark:border-indigo-600/60">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm">Daily Reading Goal</h4>
                    <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ dailyGoal.progress }}/{{ dailyGoal.target }} articles</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                      :style="{ width: (dailyGoal.progress / dailyGoal.target * 100) + '%' }"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ dailyGoal.remaining }} articles remaining</span>
                    <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">{{ Math.round(dailyGoal.progress / dailyGoal.target * 100) }}%</span>
                  </div>
                </div>
                
                <!-- Weekly Goal -->
                <div class="weekly-goal p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/60 dark:border-indigo-600/60">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm">Weekly Goal</h4>
                    <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ weeklyGoal.progress }}/{{ weeklyGoal.target }}</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                      :style="{ width: (weeklyGoal.progress / weeklyGoal.target * 100) + '%' }"
                    ></div>
                  </div>
                </div>
                
                <!-- Achievements -->
                <div class="achievements">
                  <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Recent Achievements</h4>
                  <div class="space-y-2">
                    <div
                      v-for="achievement in achievements"
                      :key="achievement.id"
                      class="achievement-item flex items-center gap-3 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200/60 dark:border-indigo-600/60"
                    >
                      <div class="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <UIcon :name="achievement.icon" class="text-white size-3" />
                      </div>
                      <div class="flex-grow">
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ achievement.title }}</span>
                      </div>
                      <span class="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{{ achievement.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideInRight"
    >
      <UIcon name="i-lucide-check-circle" class="size-5" />
      <span class="font-medium">{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Toast notification
const showToast = ref(false)
const toastMessage = ref('')

// Current reading progress
const currentProgress = ref(65)
const readingTime = ref(8)
const timeSpent = ref(5)
const goalProgress = ref(80)

// Reading history
const historyStats = reactive({
  completed: 23
})

const recentArticles = ref([
  { id: 1, title: 'Jasa PayPal Terpercaya Indonesia', date: '2 days ago' },
  { id: 2, title: 'Tips Keamanan Transaksi Online', date: '3 days ago' },
  { id: 3, title: 'Cara Mudah Top Up PayPal 2024', date: '5 days ago' }
])

// Reading goals
const dailyGoal = reactive({
  progress: 3,
  target: 5,
  get remaining() {
    return this.target - this.progress
  }
})

const weeklyGoal = reactive({
  progress: 18,
  target: 25
})

// Achievements
const achievements = ref([
  { id: 1, title: '7-Day Reading Streak', icon: 'i-lucide-flame', date: 'Today' },
  { id: 2, title: 'Speed Reader', icon: 'i-lucide-zap', date: 'Yesterday' },
  { id: 3, title: 'Knowledge Seeker', icon: 'i-lucide-book', date: '3 days ago' }
])

// Show toast notification
const showToastNotification = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Reading functions
const continueReading = () => {
  showToastNotification('Continuing reading...')
  // Navigate to article or open reading mode
}

const viewAllHistory = () => {
  showToastNotification('Opening reading history...')
  // Navigate to history page or open modal
}

// Simulate progress updates
const simulateProgress = () => {
  setInterval(() => {
    if (currentProgress.value < 100) {
      currentProgress.value += Math.floor(Math.random() * 3) + 1
      timeSpent.value += 1
      
      if (currentProgress.value >= 100) {
        showToastNotification('Article completed! 🎉')
        // Move to completed articles
        currentProgress.value = 0
        historyStats.completed += 1
        dailyGoal.progress += 1
        weeklyGoal.progress += 1
      }
    }
  }, 10000) // Update every 10 seconds
}

// Start simulation after component mounts
setTimeout(() => {
  simulateProgress()
}, 2000)
</script>

<style scoped>
/* Progress Cards Styling */
.progress-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Specific card hover effects */
.current-progress-card:hover {
  box-shadow: 0 25px 50px -12px rgba(6, 182, 212, 0.25);
}

.history-card:hover {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

.goals-card:hover {
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25);
}

/* Progress bar animations */
.progress-bar-container .h-full {
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #6366f1);
  background-size: 200% 100%;
  animation: progressShimmer 2s ease-in-out infinite;
}

@keyframes progressShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Button hover effects */
.continue-btn:hover,
.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Article items hover */
.article-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* Achievement items hover */
.achievement-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

/* Stats hover effects */
.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Toast Animation */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out;
}

/* Container entrance animation */
.progress-card {
  animation: fadeInUp 0.6s ease-out;
}

.progress-card:nth-child(1) {
  animation-delay: 0.1s;
}

.progress-card:nth-child(2) {
  animation-delay: 0.2s;
}

.progress-card:nth-child(3) {
  animation-delay: 0.3s;
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
  .progress-card {
    margin-bottom: 1rem;
  }
  
  .progress-header {
    padding: 1rem;
  }
  
  .progress-body {
    padding: 1rem;
  }
}

/* Floating elements animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: float 3s ease-in-out infinite;
}

/* Button ripple effect */
.continue-btn:active,
.view-all-btn:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* Progress bar pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.progress-bar-container .h-full {
  animation: pulse 2s ease-in-out infinite;
}
</style>

