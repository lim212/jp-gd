<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-slate-400 via-gray-300 to-zinc-500 dark:from-slate-600 dark:via-gray-500 dark:to-zinc-700 shadow-2xl border border-slate-300 dark:border-slate-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Floating theme icons -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-slate-400/10 to-gray-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-gray-400/10 to-zinc-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-zinc-400/10 to-slate-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-slate-400/10 to-gray-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-slate-100/10 to-gray-100/10 dark:via-slate-900/5 dark:to-gray-900/5"></div>
      
      <!-- Animated theme icons -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-6 h-6 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s;">
          <UIcon name="i-lucide-palette" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute top-1/3 right-1/3 w-5 h-5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 1s;">
          <UIcon name="i-lucide-type" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/4 left-1/3 w-7 h-7 bg-zinc-400 rounded-full animate-bounce" style="animation-delay: 2s;">
          <UIcon name="i-lucide-settings" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/3 right-1/4 w-4 h-4 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.5s;">
          <UIcon name="i-lucide-moon" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>

    <!-- Theme Customization Content -->
    <div class="relative z-10 p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center gap-4 justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-palette" class="text-slate-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
          <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">🎨 Theme</span> 
            <span class="text-slate-200 drop-shadow-2xl dark:text-slate-200 dark:drop-shadow-2xl">Customization</span> 
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">🎨</span>
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-slate-400 via-gray-500 to-zinc-500 rounded-full shadow-lg"></span>
          </span>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-500 to-zinc-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-settings" class="text-gray-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
        </div>
        
        <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2">
          <div class="text-center">
            <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
              <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
                🎯 <span class="text-slate-200 dark:text-slate-200 font-bold">Personalize Blog Experience Anda!</span> 🎯
              </p>
            </div>
            <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
                🌙 Sesuaikan tema, ukuran font, dan mode baca untuk pengalaman blog yang optimal
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Customization Grid -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Dark/Light Mode Toggle -->
          <div class="theme-card dark-mode-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-slate-200/40 dark:border-slate-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-slate-50/60 dark:bg-slate-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-gray-50/60 dark:bg-gray-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="theme-header bg-gradient-to-r from-slate-500 to-gray-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon :name="isDarkMode ? 'i-lucide-moon' : 'i-lucide-sun'" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Theme Mode</h3>
                  <p class="text-slate-100 text-sm">Dark / Light Toggle</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="theme-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Mode Toggle -->
                <div class="mode-toggle-container">
                  <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl border border-slate-200/60 dark:border-slate-600/60">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-sun" class="text-yellow-500 size-5" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Light Mode</span>
                    </div>
                    <button
                      @click="toggleTheme"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      :class="isDarkMode ? 'bg-slate-600' : 'bg-gray-200'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <UIcon name="i-lucide-moon" class="text-slate-500 size-5" />
                    </div>
                  </div>
                </div>
                
                <!-- Theme Preview -->
                <div class="theme-preview p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl border border-slate-200/60 dark:border-slate-600/60">
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</div>
                    <div class="w-full h-8 rounded-lg" :class="isDarkMode ? 'bg-gray-800' : 'bg-gray-100'"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-50"></div>
          </div>

          <!-- Font Size Adjuster -->
          <div class="theme-card font-size-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-blue-200/40 dark:border-blue-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="theme-header bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-type" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Font Size</h3>
                  <p class="text-blue-100 text-sm">Adjust Text Size</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="theme-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Font Size Slider -->
                <div class="font-size-slider-container">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</span>
                    <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ fontSize }}px</span>
                  </div>
                  <input
                    v-model="fontSize"
                    type="range"
                    min="12"
                    max="24"
                    step="2"
                    class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <!-- Font Size Presets -->
                <div class="font-presets grid grid-cols-3 gap-2">
                  <button
                    v-for="preset in fontPresets"
                    :key="preset.size"
                    @click="setFontSize(preset.size)"
                    class="preset-btn p-2 text-xs rounded-lg border transition-all duration-200"
                    :class="fontSize === preset.size 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900/20'"
                  >
                    {{ preset.label }}
                  </button>
                </div>
                
                <!-- Font Preview -->
                <div class="font-preview p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/60 dark:border-blue-600/60">
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</div>
                    <div class="text-gray-800 dark:text-gray-200" :style="{ fontSize: fontSize + 'px' }">
                      Sample text with current font size
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
          </div>

          <!-- Reading Mode -->
          <div class="theme-card reading-mode-card relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800/90 border border-green-200/40 dark:border-green-600/40 h-full flex flex-col group hover:scale-105 transition-all duration-300">
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 z-10 shadow-lg"></div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-green-50/60 dark:bg-green-900/20 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-emerald-50/60 dark:bg-emerald-900/20 rounded-tr-2xl"></div>
            
            <!-- Header -->
            <div class="theme-header bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UIcon name="i-lucide-book-open" class="text-white size-6" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">Reading Mode</h3>
                  <p class="text-green-100 text-sm">Focus Reading Experience</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="theme-body bg-white dark:bg-gray-800 px-6 py-5 flex-grow">
              <div class="space-y-4">
                <!-- Reading Mode Toggle -->
                <div class="reading-mode-toggle">
                  <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/60 dark:border-green-600/60">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-lucide-eye" class="text-green-500 size-5" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Focus Mode</span>
                    </div>
                    <button
                      @click="toggleReadingMode"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      :class="isReadingMode ? 'bg-green-600' : 'bg-gray-200'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                        :class="isReadingMode ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Normal</span>
                      <UIcon name="i-lucide-layout" class="text-gray-500 size-5" />
                    </div>
                  </div>
                </div>
                
                <!-- Reading Mode Features -->
                <div class="reading-features space-y-2">
                  <div class="feature-item flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/60 dark:border-green-600/60">
                    <UIcon name="i-lucide-check" class="text-green-500 size-4" />
                    <span class="text-xs text-gray-700 dark:text-gray-300">Distraction-free reading</span>
                  </div>
                  <div class="feature-item flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/60 dark:border-green-600/60">
                    <UIcon name="i-lucide-check" class="text-green-500 size-4" />
                    <span class="text-xs text-gray-700 dark:text-gray-300">Optimized typography</span>
                  </div>
                  <div class="feature-item flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/60 dark:border-green-600/60">
                    <UIcon name="i-lucide-check" class="text-green-500 size-4" />
                    <span class="text-xs text-gray-700 dark:text-gray-300">Enhanced readability</span>
                  </div>
                </div>
                
                <!-- Reading Mode Preview -->
                <div class="reading-preview p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/60 dark:border-green-600/60">
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</div>
                    <div class="w-full h-8 rounded-lg" :class="isReadingMode ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'"></div>
                  </div>
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

// Theme state
const isDarkMode = ref(false)
const fontSize = ref(16)
const isReadingMode = ref(false)

// Font presets
const fontPresets = ref([
  { size: 12, label: 'XS' },
  { size: 14, label: 'S' },
  { size: 16, label: 'M' },
  { size: 18, label: 'L' },
  { size: 20, label: 'XL' },
  { size: 24, label: 'XXL' }
])

// Show toast notification
const showToastNotification = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Theme functions
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  showToastNotification(isDarkMode.value ? 'Dark mode enabled!' : 'Light mode enabled!')
  
  // Apply theme to document
  if (process.client) {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
}

// Font size functions
const setFontSize = (size: number) => {
  fontSize.value = size
  showToastNotification(`Font size set to ${size}px`)
  
  // Apply font size to document
  if (process.client) {
    document.documentElement.style.fontSize = size + 'px'
  }
}

// Reading mode functions
const toggleReadingMode = () => {
  isReadingMode.value = !isReadingMode.value
  showToastNotification(isReadingMode.value ? 'Reading mode enabled!' : 'Reading mode disabled!')
  
  // Apply reading mode styles
  if (process.client) {
    document.body.classList.toggle('reading-mode', isReadingMode.value)
  }
}

// Initialize from localStorage
if (process.client) {
  const savedTheme = localStorage.getItem('blog-theme')
  const savedFontSize = localStorage.getItem('blog-font-size')
  const savedReadingMode = localStorage.getItem('blog-reading-mode')
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
  
  if (savedFontSize) {
    fontSize.value = parseInt(savedFontSize)
    document.documentElement.style.fontSize = fontSize.value + 'px'
  }
  
  if (savedReadingMode) {
    isReadingMode.value = savedReadingMode === 'true'
    document.body.classList.toggle('reading-mode', isReadingMode.value)
  }
}

// Save to localStorage when values change
const saveSettings = () => {
  if (process.client) {
    localStorage.setItem('blog-theme', isDarkMode.value ? 'dark' : 'light')
    localStorage.setItem('blog-font-size', fontSize.value.toString())
    localStorage.setItem('blog-reading-mode', isReadingMode.value.toString())
  }
}

// Watch for changes and save
import { watch } from 'vue'
watch([isDarkMode, fontSize, isReadingMode], saveSettings)
</script>

<style scoped>
/* Theme Cards Styling */
.theme-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Specific card hover effects */
.dark-mode-card:hover {
  box-shadow: 0 25px 50px -12px rgba(71, 85, 105, 0.25);
}

.font-size-card:hover {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

.reading-mode-card:hover {
  box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.25);
}

/* Slider styling */
.slider {
  background: linear-gradient(to right, #3b82f6, #6366f1);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
}

/* Toggle switch styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* Button hover effects */
.preset-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Feature items hover */
.feature-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
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
.theme-card {
  animation: fadeInUp 0.6s ease-out;
}

.theme-card:nth-child(1) {
  animation-delay: 0.1s;
}

.theme-card:nth-child(2) {
  animation-delay: 0.2s;
}

.theme-card:nth-child(3) {
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
  .theme-card {
    margin-bottom: 1rem;
  }
  
  .theme-header {
    padding: 1rem;
  }
  
  .theme-body {
    padding: 1rem;
  }
  
  .font-presets {
    grid-template-columns: repeat(2, 1fr);
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

/* Reading mode styles */
.reading-mode {
  /* These styles will be applied to the body when reading mode is active */
  font-family: 'Georgia', serif;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* Toggle switch animations */
button[class*="inline-flex"]:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}
</style>

