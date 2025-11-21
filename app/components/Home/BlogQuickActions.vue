<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-amber-400 via-orange-300 to-red-500 dark:from-amber-600 dark:via-orange-500 dark:to-red-700 shadow-2xl border border-amber-300 dark:border-amber-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Floating action icons -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-red-400/10 to-amber-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-amber-100/10 to-orange-100/10 dark:via-amber-900/5 dark:to-orange-900/5"></div>
      
      <!-- Animated action icons -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-6 h-6 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0s;">
          <UIcon name="i-lucide-bookmark" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute top-1/3 right-1/3 w-5 h-5 bg-orange-400 rounded-full animate-bounce" style="animation-delay: 1s;">
          <UIcon name="i-lucide-eye" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/4 left-1/3 w-7 h-7 bg-red-400 rounded-full animate-bounce" style="animation-delay: 2s;">
          <UIcon name="i-lucide-clock" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/3 right-1/4 w-4 h-4 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0.5s;">
          <UIcon name="i-lucide-star" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>

    <!-- Quick Actions Content -->
    <div class="relative z-10 p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center gap-4 justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-zap" class="text-amber-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
          <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">⚡ Quick</span> 
            <span class="text-amber-200 drop-shadow-2xl dark:text-amber-200 dark:drop-shadow-2xl">Actions</span> 
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">⚡</span>
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full shadow-lg"></span>
          </span>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-target" class="text-orange-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
        </div>
        
        <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2">
          <div class="text-center">
            <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
              <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
                🎯 <span class="text-amber-200 dark:text-amber-200 font-bold">Aksi Cepat untuk Pengalaman Blog Terbaik!</span> 🎯
              </p>
            </div>
            <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
                📚 Bookmark artikel favorit, track progress membaca, dan nikmati fitur interaktif lainnya
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Bookmark Section -->
          <div class="action-card bookmark-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-amber-200/40 dark:border-amber-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-amber-50/60 dark:bg-amber-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-orange-50/60 dark:bg-orange-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="action-header bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-bookmark" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Read Later</h3>
                  <p class="text-amber-100 text-sm">Simpan untuk dibaca nanti</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="action-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Bookmark Stats -->
                <div class="bookmark-stats flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/60 dark:border-amber-600/60">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-bookmark" class="text-amber-600 dark:text-amber-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Saved Articles</span>
                  </div>
                  <span class="text-lg font-bold text-amber-600 dark:text-amber-400">{{ bookmarkStats.saved }}</span>
                </div>
                
                <!-- Quick Bookmark Actions -->
                <div class="space-y-2">
                  <button
                    @click="toggleBookmark"
                    class="w-full bookmark-btn flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/60 dark:border-amber-600/60 hover:shadow-lg transition-all duration-200"
                  >
                    <UIcon :name="isBookmarked ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark-plus'" class="text-amber-600 dark:text-amber-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ isBookmarked ? 'Remove from Bookmarks' : 'Add to Bookmarks' }}
                    </span>
                  </button>
                  
                  <button
                    @click="viewBookmarks"
                    class="w-full view-bookmarks-btn flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/60 dark:border-amber-600/60 hover:shadow-lg transition-all duration-200"
                  >
                    <UIcon name="i-lucide-list" class="text-amber-600 dark:text-amber-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">View All Bookmarks</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
          </div>

          <!-- Reading Progress Section -->
          <div class="action-card progress-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-blue-200/40 dark:border-blue-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="action-header bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-trending-up" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Reading Progress</h3>
                  <p class="text-blue-100 text-sm">Track kemajuan membaca</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="action-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Progress Stats -->
                <div class="progress-stats space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-eye" class="text-blue-600 dark:text-blue-400 size-5" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Articles Read</span>
                    </div>
                    <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ readingStats.read }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-clock" class="text-blue-600 dark:text-blue-400 size-5" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Time</span>
                    </div>
                    <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ readingStats.time }}m</span>
                  </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="progress-bar-container">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                    <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ readingStats.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                      :style="{ width: readingStats.progress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
          </div>

          <!-- Quick Preview Section -->
          <div class="action-card preview-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-green-200/40 dark:border-green-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-green-50/60 dark:bg-green-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-emerald-50/60 dark:bg-emerald-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="action-header bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-eye" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Quick Preview</h3>
                  <p class="text-green-100 text-sm">Preview artikel dengan cepat</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="action-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Preview Stats -->
                <div class="preview-stats flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/60 dark:border-green-600/60">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-search" class="text-green-600 dark:text-green-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Previews Today</span>
                  </div>
                  <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ previewStats.today }}</span>
                </div>
                
                <!-- Quick Preview Actions -->
                <div class="space-y-2">
                  <button
                    @click="openPreview"
                    class="w-full preview-btn flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/60 dark:border-green-600/60 hover:shadow-lg transition-all duration-200"
                  >
                    <UIcon name="i-lucide-maximize" class="text-green-600 dark:text-green-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Open Preview</span>
                  </button>
                  
                  <button
                    @click="togglePreviewMode"
                    class="w-full preview-mode-btn flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/60 dark:border-green-600/60 hover:shadow-lg transition-all duration-200"
                  >
                    <UIcon :name="previewMode ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="text-green-600 dark:text-green-400 size-5" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ previewMode ? 'Disable Preview' : 'Enable Preview' }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50"></div>
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

// Bookmark state
const isBookmarked = ref(false)
const bookmarkStats = reactive({
  saved: 12
})

// Reading progress stats
const readingStats = reactive({
  read: 45,
  time: 180,
  progress: 75
})

// Preview stats
const previewStats = reactive({
  today: 8
})

const previewMode = ref(true)

// Show toast notification
const showToastNotification = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Bookmark functions
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  if (isBookmarked.value) {
    bookmarkStats.saved += 1
    showToastNotification('Article bookmarked!')
  } else {
    bookmarkStats.saved -= 1
    showToastNotification('Bookmark removed!')
  }
}

const viewBookmarks = () => {
  showToastNotification('Opening bookmarks...')
  // Navigate to bookmarks page or open modal
}

// Reading progress functions
const updateReadingProgress = () => {
  readingStats.read += 1
  readingStats.time += Math.floor(Math.random() * 10) + 5
  readingStats.progress = Math.min(readingStats.progress + 5, 100)
}

// Preview functions
const openPreview = () => {
  showToastNotification('Opening preview...')
  // Open preview modal or navigate to preview page
}

const togglePreviewMode = () => {
  previewMode.value = !previewMode.value
  showToastNotification(previewMode.value ? 'Preview mode enabled!' : 'Preview mode disabled!')
}

// Simulate real-time updates
const simulateUpdates = () => {
  setInterval(() => {
    if (Math.random() > 0.8) {
      updateReadingProgress()
    }
  }, 10000) // Update every 10 seconds
}

// Start simulation after component mounts
setTimeout(() => {
  simulateUpdates()
}, 2000)
</script>

<style scoped>
/* Action Cards Styling */
.action-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Specific card hover effects */
.bookmark-card:hover {
  box-shadow: 0 25px 50px -12px rgba(251, 191, 36, 0.25);
}

.progress-card:hover {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

.preview-card:hover {
  box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.25);
}

/* Button hover effects */
.bookmark-btn:hover,
.view-bookmarks-btn:hover,
.preview-btn:hover,
.preview-mode-btn:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Progress bar animation */
.progress-bar-container .h-full {
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
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

/* Stats hover effects */
.bookmark-stats:hover,
.progress-stats > div:hover,
.preview-stats:hover {
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
.action-card {
  animation: fadeInUp 0.6s ease-out;
}

.action-card:nth-child(1) {
  animation-delay: 0.1s;
}

.action-card:nth-child(2) {
  animation-delay: 0.2s;
}

.action-card:nth-child(3) {
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
  .action-card {
    margin-bottom: 1rem;
  }
  
  .action-header {
    padding: 1rem;
  }
  
  .action-body {
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
.bookmark-btn:active,
.view-bookmarks-btn:active,
.preview-btn:active,
.preview-mode-btn:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}
</style>

