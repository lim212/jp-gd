<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRuntimeConfig, useRoute } from '#imports'
import { useI18n } from 'vue-i18n'

// i18n for translations
const { t } = useI18n()

// Runtime config for WhatsApp
const config = useRuntimeConfig()
const whatsappPhone = computed(() => config.public?.whatsappPhone || '628988888250')
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || t('whatsapp.default_message')
)
const whatsappHref = computed(() => {
  const params = new URLSearchParams({
    phone: String(whatsappPhone.value),
    text: String(whatsappMessage.value),
    type: 'phone_number',
    app_absent: '0'
  })
  return `https://api.whatsapp.com/send/?${params.toString()}`
})

// Enhanced state management for better UX
const atTop = ref(true)
const atBottom = ref(false)
const showButtons = ref(true)
const lastScrollY = ref(0)

// Performance optimized scroll handling
let ticking = false
let scrollTimeout = null

const updateScrollState = () => {
  // Check if we're on client side
  if (typeof window === 'undefined') return
  
  const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  const innerHeight = window.innerHeight || 0
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  
  lastScrollY.value = scrollY
  
  // Update states
  atTop.value = scrollY <= 50
  atBottom.value = innerHeight + scrollY >= scrollHeight - 50
  
  // Always show buttons
    showButtons.value = true
}

const onScroll = () => {
  if (typeof window === 'undefined') return
  
  if (!ticking) {
    ticking = true
    window.requestAnimationFrame(() => {
      updateScrollState()
      ticking = false
    })
  }
}

// Enhanced lifecycle management
onMounted(() => {
  if (typeof window !== 'undefined') {
    updateScrollState()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateScrollState, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', updateScrollState)
  }
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

// Enhanced scroll functions with cool effects
const scrollToTop = () => {
  // Haptic feedback for mobile
  if (navigator.vibrate) {
    navigator.vibrate([10])
  }
  
  window.scrollTo({ 
    top: 0, 
    behavior: 'smooth'
  })
}

const scrollToBottom = () => {
  // Haptic feedback for mobile
  if (navigator.vibrate) {
    navigator.vibrate([10])
  }
  
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight, 
    document.body.scrollHeight
  )
  window.scrollTo({ 
    top: scrollHeight, 
    behavior: 'smooth'
  })
}

// Detect blog routes to hide WA button on /blog and /blog/[slug]
const route = useRoute()
const isBlogRoute = computed(() => route.path === '/blog' || route.path.startsWith('/blog/'))

// LiveChat widget control
const openLiveChat = () => {
  // Haptic feedback for mobile
  if (navigator.vibrate) {
    navigator.vibrate([10])
  }
  
  // Check if LiveChat widget is available and open it
  if (typeof window !== 'undefined' && window.LiveChatWidget) {
    try {
      window.LiveChatWidget.call('maximize')
    } catch (error) {
      console.warn('LiveChat widget not ready yet:', error)
      // Fallback: try to open after a short delay
      setTimeout(() => {
        if (window.LiveChatWidget) {
          window.LiveChatWidget.call('maximize')
        }
      }, 500)
    }
  } else {
    // If widget not loaded yet, wait for it
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.LiveChatWidget) {
        clearInterval(checkInterval)
        window.LiveChatWidget.call('maximize')
      }
    }, 100)
    
    // Clear interval after 5 seconds
    setTimeout(() => clearInterval(checkInterval), 5000)
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- Left Side: WhatsApp & Scroll Buttons -->
    <div
      id="floating-actions"
      class="fixed left-4 bottom-4 z-[9999] flex flex-col items-center gap-3 sm:gap-4"
      :class="{ 
        'opacity-100 translate-y-0': showButtons,
        'opacity-0 translate-y-4': !showButtons 
      }"
    >
      <!-- Scroll to Top Button -->
      <Transition name="slide-up">
        <button
          v-if="!atTop"
          @click="scrollToTop"
          class="scroll-button scroll-button-up"
          :title="'Gulir ke atas'"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="scroll-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </Transition>

      <!-- Scroll to Bottom Button -->
      <Transition name="slide-up">
        <button
          v-if="!atBottom"
          @click="scrollToBottom"
          class="scroll-button scroll-button-down"
          :title="'Gulir ke bawah'"
          aria-label="Scroll to bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="scroll-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </Transition>

      <!-- WhatsApp Button -->
      <Transition name="slide-up">
        <a
          v-if="!isBlogRoute"
          :href="whatsappHref"
          target="_blank"
          rel="noopener noreferrer"
          class="whatsapp-button-container"
          :title="'Hubungi via WhatsApp'"
          aria-label="Hubungi kami via WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="whatsapp-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <!-- Online Indicator -->
          <div class="online-indicator"></div>
        </a>
      </Transition>
    </div>

    <!-- Right Side: Live Chat Button -->
    <div
      id="floating-livechat"
      class="fixed right-4 z-[9998] flex flex-col items-center"
      :class="{ 
        'opacity-100 translate-y-0': showButtons,
        'opacity-0 translate-y-4': !showButtons 
      }"
    >
      <Transition name="slide-up">
        <button
          v-if="!isBlogRoute"
          @click="openLiveChat"
          class="livechat-button-container"
          :title="'Buka Live Chat'"
          aria-label="Buka Live Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="livechat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <!-- Online Indicator -->
          <div class="online-indicator"></div>
        </button>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
/* ========================================
   🎯 FLOATING BUTTONS - MINIMAL STYLES
   All styling is now in super-keren-floating-buttons.css
   ======================================== */

/* Container positioning */
#floating-actions {
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

#floating-actions > * {
  pointer-events: auto;
}

/* Right side Live Chat container */
#floating-livechat {
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  /* Position above LiveChat widget to avoid collision */
  bottom: 5.5rem;
}

#floating-livechat > * {
  pointer-events: auto;
}

/* Live Chat Button */
.livechat-button-container {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #0066ff 0%, #0044cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.livechat-button-container:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 12px rgba(0, 102, 255, 0.4);
}

/* Live Chat Icon */
.livechat-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: white;
}

/* Slide up transition for buttons appearing */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  #floating-actions {
    left: 1rem;
    bottom: 1rem;
  }
  
  #floating-livechat {
    right: 1rem;
    bottom: 5.5rem; /* Position above LiveChat widget on mobile */
  }
  
  .livechat-button-container,
  .whatsapp-button-container {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .livechat-icon,
  .whatsapp-icon {
    width: 2rem;
    height: 2rem;
  }
}
</style>


