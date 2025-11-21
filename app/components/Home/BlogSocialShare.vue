<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-violet-400 via-purple-300 to-fuchsia-500 dark:from-violet-600 dark:via-purple-500 dark:to-fuchsia-700 shadow-2xl border border-violet-300 dark:border-violet-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Floating social icons -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-violet-400/10 to-purple-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-purple-400/10 to-fuchsia-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-fuchsia-400/10 to-violet-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-violet-400/10 to-purple-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-violet-100/10 to-fuchsia-100/10 dark:via-violet-900/5 dark:to-fuchsia-900/5"></div>
      
      <!-- Animated social network icons -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-6 h-6 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 0s;">
          <UIcon name="i-lucide-facebook" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute top-1/3 right-1/3 w-5 h-5 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 1s;">
          <UIcon name="i-lucide-twitter" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/4 left-1/3 w-7 h-7 bg-fuchsia-400 rounded-full animate-bounce" style="animation-delay: 2s;">
          <UIcon name="i-lucide-instagram" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div class="absolute bottom-1/3 right-1/4 w-4 h-4 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 0.5s;">
          <UIcon name="i-lucide-linkedin" class="text-white size-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>

    <!-- Social Share Content -->
    <div class="relative z-10 p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center gap-4 justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-share-2" class="text-violet-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
          <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📱 Social</span> 
            <span class="text-violet-200 drop-shadow-2xl dark:text-violet-200 dark:drop-shadow-2xl">Share</span> 
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📱</span>
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500 rounded-full shadow-lg"></span>
          </span>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-heart" class="text-fuchsia-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
        </div>
        
        <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2">
          <div class="text-center">
            <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
              <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
                🚀 <span class="text-violet-200 dark:text-violet-200 font-bold">Bagikan Artikel Favorit Anda!</span> 🚀
              </p>
            </div>
            <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
                📤 Share artikel menarik ke media sosial dan bantu teman-teman mendapatkan informasi terbaru
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Share Buttons -->
      <div class="max-w-4xl mx-auto">
        <div class="social-share-container bg-white dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-violet-200/40 dark:border-violet-600/40 p-6 md:p-8 relative overflow-hidden">
          <!-- Background pattern -->
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0); background-size: 20px 20px;"></div>
          </div>
          
          <!-- Share Options -->
          <div class="relative z-10">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">🎯 Pilih Platform untuk Share</h3>
            
            <!-- Social Media Buttons Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <!-- Facebook -->
              <button
                @click="shareToFacebook"
                class="social-button facebook-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-facebook" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">Facebook</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- Twitter -->
              <button
                @click="shareToTwitter"
                class="social-button twitter-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-twitter" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">Twitter</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- WhatsApp -->
              <button
                @click="shareToWhatsApp"
                class="social-button whatsapp-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-message-circle" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">WhatsApp</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- LinkedIn -->
              <button
                @click="shareToLinkedIn"
                class="social-button linkedin-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-linkedin" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">LinkedIn</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- Instagram -->
              <button
                @click="shareToInstagram"
                class="social-button instagram-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-instagram" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">Instagram</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- Telegram -->
              <button
                @click="shareToTelegram"
                class="social-button telegram-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-send" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">Telegram</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- Copy Link -->
              <button
                @click="copyToClipboard"
                class="social-button copy-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-copy" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">Copy Link</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <!-- Email -->
              <button
                @click="shareViaEmail"
                class="social-button email-button group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon name="i-lucide-mail" class="size-6 group-hover:scale-110 transition-transform duration-200" />
                  <span class="text-sm font-semibold">Email</span>
                </div>
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>

            <!-- Quick Share Section -->
            <div class="quick-share-section bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200/60 dark:border-violet-600/60">
              <h4 class="text-md font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">⚡ Quick Share</h4>
              <div class="flex flex-wrap gap-2 justify-center">
                <button
                  v-for="platform in quickSharePlatforms"
                  :key="platform.name"
                  @click="quickShare(platform)"
                  class="quick-share-btn px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-800 transition-colors duration-200 flex items-center gap-2"
                >
                  <UIcon :name="platform.icon" class="size-4" />
                  {{ platform.name }}
                </button>
              </div>
            </div>

            <!-- Share Stats -->
            <div class="share-stats mt-6 grid grid-cols-3 gap-4">
              <div class="stat-item text-center p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200/60 dark:border-violet-600/60">
                <div class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ shareStats.totalShares }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Total Shares</div>
              </div>
              <div class="stat-item text-center p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200/60 dark:border-violet-600/60">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ shareStats.thisWeek }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">This Week</div>
              </div>
              <div class="stat-item text-center p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200/60 dark:border-violet-600/60">
                <div class="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">{{ shareStats.trending }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Trending</div>
              </div>
            </div>
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

// Share stats
const shareStats = reactive({
  totalShares: 1247,
  thisWeek: 89,
  trending: 12
})

// Quick share platforms
const quickSharePlatforms = ref([
  { name: 'Facebook', icon: 'i-lucide-facebook', action: 'facebook' },
  { name: 'Twitter', icon: 'i-lucide-twitter', action: 'twitter' },
  { name: 'WhatsApp', icon: 'i-lucide-message-circle', action: 'whatsapp' },
  { name: 'Copy', icon: 'i-lucide-copy', action: 'copy' }
])

// Current page URL and title
const currentUrl = ref('')
const currentTitle = ref('')

// Initialize current page info
if (process.client) {
  currentUrl.value = window.location.href
  currentTitle.value = document.title || 'JasaPembayaran.com Blog'
}

// Show toast notification
const showToastNotification = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Share functions
const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  showToastNotification('Shared to Facebook!')
}

const shareToTwitter = () => {
  const text = `Check out this amazing article: ${currentTitle.value}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  showToastNotification('Shared to Twitter!')
}

const shareToWhatsApp = () => {
  const text = `Check out this article: ${currentTitle.value}`
  const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl.value)}`
  window.open(url, '_blank')
  showToastNotification('Shared to WhatsApp!')
}

const shareToLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  showToastNotification('Shared to LinkedIn!')
}

const shareToInstagram = () => {
  showToastNotification('Copy the link and share on Instagram!')
  copyToClipboard()
}

const shareToTelegram = () => {
  const text = `Check out this article: ${currentTitle.value}`
  const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  showToastNotification('Shared to Telegram!')
}

const shareViaEmail = () => {
  const subject = `Check out this article: ${currentTitle.value}`
  const body = `I found this interesting article and thought you might like it:\n\n${currentTitle.value}\n${currentUrl.value}`
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(url)
  showToastNotification('Email opened!')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    showToastNotification('Link copied to clipboard!')
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = currentUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToastNotification('Link copied to clipboard!')
  }
}

const quickShare = (platform: any) => {
  switch (platform.action) {
    case 'facebook':
      shareToFacebook()
      break
    case 'twitter':
      shareToTwitter()
      break
    case 'whatsapp':
      shareToWhatsApp()
      break
    case 'copy':
      copyToClipboard()
      break
  }
}
</script>

<style scoped>
/* Social Share Container */
.social-share-container {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-share-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.25);
}

/* Social Button Hover Effects */
.social-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Platform-specific hover colors */
.facebook-button:hover {
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
}

.twitter-button:hover {
  box-shadow: 0 15px 30px rgba(14, 165, 233, 0.4);
}

.whatsapp-button:hover {
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.4);
}

.linkedin-button:hover {
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
}

.instagram-button:hover {
  box-shadow: 0 15px 30px rgba(236, 72, 153, 0.4);
}

.telegram-button:hover {
  box-shadow: 0 15px 30px rgba(6, 182, 212, 0.4);
}

.copy-button:hover {
  box-shadow: 0 15px 30px rgba(107, 114, 128, 0.4);
}

.email-button:hover {
  box-shadow: 0 15px 30px rgba(239, 68, 68, 0.4);
}

/* Quick Share Buttons */
.quick-share-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

/* Share Stats Animation */
.stat-item {
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
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
.social-share-container {
  animation: fadeInUp 0.6s ease-out;
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
  .social-share-container {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-share-section .flex {
    flex-direction: column;
    align-items: center;
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
.social-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.social-button:active::before {
  width: 300px;
  height: 300px;
}
</style>

