<template>
  <div>
    <!-- Desktop: Sticky Sidebar -->
    <div 
      v-if="!isMobile"
      class="social-share-sticky fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40 transition-all duration-300"
      :style="{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0) translateY(-50%)' : 'translateX(-100%) translateY(-50%)' }"
    >
      <!-- Share Label -->
      <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center mb-2">
        SHARE
      </div>
      
      <!-- Facebook -->
      <button
        @click="shareToFacebook"
        class="share-button group w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        title="Share ke Facebook"
      >
        <Icon name="mdi:facebook" size="24" />
        <span class="share-tooltip">Facebook</span>
      </button>
      
      <!-- Twitter -->
      <button
        @click="shareToTwitter"
        class="share-button group w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        title="Share ke Twitter"
      >
        <Icon name="mdi:twitter" size="24" />
        <span class="share-tooltip">Twitter</span>
      </button>
      
      <!-- WhatsApp -->
      <button
        @click="shareToWhatsApp"
        class="share-button group w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        title="Share ke WhatsApp"
      >
        <Icon name="mdi:whatsapp" size="24" />
        <span class="share-tooltip">WhatsApp</span>
      </button>
      
      <!-- LinkedIn -->
      <button
        @click="shareToLinkedIn"
        class="share-button group w-12 h-12 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        title="Share ke LinkedIn"
      >
        <Icon name="mdi:linkedin" size="24" />
        <span class="share-tooltip">LinkedIn</span>
      </button>
      
      <!-- Telegram -->
      <button
        @click="shareToTelegram"
        class="share-button group w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        title="Share ke Telegram"
      >
        <Icon name="mdi:telegram" size="24" />
        <span class="share-tooltip">Telegram</span>
      </button>
      
      <!-- Copy Link -->
      <button
        @click="copyLink"
        class="share-button group w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
        title="Copy Link"
      >
        <Icon :name="linkCopied ? 'mdi:check' : 'mdi:link'" size="24" />
        <span class="share-tooltip">{{ linkCopied ? 'Copied!' : 'Copy Link' }}</span>
      </button>
      
      <!-- Share Count (Optional) -->
      <div 
        v-if="totalShares > 0"
        class="mt-2 text-center bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-lg"
      >
        <div class="text-xs text-gray-600 dark:text-gray-400">Shares</div>
        <div class="text-sm font-bold text-gray-900 dark:text-white">{{ totalShares }}</div>
      </div>
    </div>
    
    <!-- Mobile: Bottom Sheet -->
    <div 
      v-if="isMobile"
      class="mobile-share-buttons fixed bottom-20 right-4 z-40"
    >
      <button
        @click="toggleMobileShare"
        class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110"
        :class="{ 'rotate-45': showMobileShare }"
      >
        <Icon name="mdi:share-variant" size="28" />
      </button>
      
      <!-- Mobile Share Menu -->
      <Transition name="share-menu">
        <div 
          v-if="showMobileShare"
          class="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 min-w-[200px]"
        >
          <div class="grid grid-cols-3 gap-3">
            <button @click="shareToFacebook" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Icon name="mdi:facebook" class="text-white" size="20" />
              </div>
              <span class="text-xs">Facebook</span>
            </button>
            
            <button @click="shareToTwitter" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                <Icon name="mdi:twitter" class="text-white" size="20" />
              </div>
              <span class="text-xs">Twitter</span>
            </button>
            
            <button @click="shareToWhatsApp" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Icon name="mdi:whatsapp" class="text-white" size="20" />
              </div>
              <span class="text-xs">WhatsApp</span>
            </button>
            
            <button @click="shareToLinkedIn" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                <Icon name="mdi:linkedin" class="text-white" size="20" />
              </div>
              <span class="text-xs">LinkedIn</span>
            </button>
            
            <button @click="shareToTelegram" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                <Icon name="mdi:telegram" class="text-white" size="20" />
              </div>
              <span class="text-xs">Telegram</span>
            </button>
            
            <button @click="copyLink" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <Icon :name="linkCopied ? 'mdi:check' : 'mdi:link'" class="text-white" size="20" />
              </div>
              <span class="text-xs">{{ linkCopied ? 'Copied!' : 'Copy' }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  url?: string
  description?: string
}>()

const isVisible = ref(false)
const isMobile = ref(false)
const showMobileShare = ref(false)
const linkCopied = ref(false)
const totalShares = ref(0)

const shareUrl = computed(() => props.url || (typeof window !== 'undefined' ? window.location.href : ''))
const shareTitle = computed(() => props.title)
const shareDescription = computed(() => props.description || props.title)

// Check if mobile
function checkMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
  }
}

// Show/hide based on scroll
function handleScroll() {
  if (typeof window !== 'undefined') {
    isVisible.value = window.scrollY > 300
  }
}

// Toggle mobile share menu
function toggleMobileShare() {
  showMobileShare.value = !showMobileShare.value
}

// Share to Facebook
function shareToFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  trackShare('facebook')
  closeMobileShare()
}

// Share to Twitter
function shareToTwitter() {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareTitle.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  trackShare('twitter')
  closeMobileShare()
}

// Share to WhatsApp
function shareToWhatsApp() {
  const text = `${shareTitle.value} - ${shareUrl.value}`
  const url = isMobile.value
    ? `whatsapp://send?text=${encodeURIComponent(text)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  trackShare('whatsapp')
  closeMobileShare()
}

// Share to LinkedIn
function shareToLinkedIn() {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  trackShare('linkedin')
  closeMobileShare()
}

// Share to Telegram
function shareToTelegram() {
  const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareTitle.value)}`
  window.open(url, '_blank', 'width=600,height=400')
  trackShare('telegram')
  closeMobileShare()
}

// Copy link to clipboard
async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    linkCopied.value = true
    trackShare('copy')
    
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
    
    closeMobileShare()
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

// Track share (could send to analytics)
function trackShare(platform: string) {
  totalShares.value++
  console.log(`Shared to ${platform}`)
  // Here you can add analytics tracking
  // Example: $gtag.event('share', { method: platform })
}

// Close mobile share menu
function closeMobileShare() {
  if (isMobile.value) {
    setTimeout(() => {
      showMobileShare.value = false
    }, 300)
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', checkMobile, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Share tooltip */
.share-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.share-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: rgba(0, 0, 0, 0.9);
}

.share-button:hover .share-tooltip {
  opacity: 1;
}

/* Mobile share menu animation */
.share-menu-enter-active,
.share-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.share-menu-enter-from,
.share-menu-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

/* Hide on very small screens (interferes with WhatsApp button) */
@media (max-width: 640px) {
  .social-share-sticky {
    display: none;
  }
}

/* Adjust position on tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .social-share-sticky {
    left: 8px;
  }
  
  .share-button {
    width: 48px;
    height: 48px;
  }
}
</style>


