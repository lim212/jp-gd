<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showScrollTop = ref(false)
const showScrollBottom = ref(false)

// Scroll detection
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  showScrollTop.value = scrollTop > 300
  showScrollBottom.value = scrollTop < documentHeight - windowHeight - 100
}

// Scroll functions
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}

// WhatsApp function
const openWhatsApp = () => {
  const message = encodeURIComponent('Halo! Saya mengalami masalah di website dan butuh bantuan.')
  const whatsappUrl = `https://wa.me/6281234567890?text=${message}`
  window.open(whatsappUrl, '_blank')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- Professional Floating Action Buttons - Clean & Responsive -->
  <div class="floating-actions-container">
    <!-- WhatsApp Button - Super Keren Green -->
    <button 
      @click="openWhatsApp"
      class="floating-btn whatsapp-btn"
      title="Chat WhatsApp"
    >
      <svg class="floating-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="currentColor"/>
      </svg>
    </button>

    <!-- Scroll to Top Button -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <button 
        v-if="showScrollTop"
        @click="scrollToTop"
        class="floating-btn scroll-up-btn"
        title="Ke Atas"
      >
        <svg class="floating-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </Transition>

    <!-- Scroll to Bottom Button -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <button 
        v-if="showScrollBottom"
        @click="scrollToBottom"
        class="floating-btn scroll-down-btn"
        title="Ke Bawah"
      >
        <svg class="floating-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
/* =====================================================
   PROFESSIONAL FLOATING ACTION BUTTONS
   Clean, Responsive, No Animations
   ===================================================== */

/* Container */
.floating-actions-container {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

/* Base Button Styles */
.floating-btn {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

/* Icon Styles */
.floating-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  transition: all 0.2s ease;
}

/* WhatsApp Button - Super Keren Green */
.whatsapp-btn {
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.whatsapp-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
  background: linear-gradient(135deg, #128c7e 0%, #25d366 100%);
}

.whatsapp-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Scroll Up Button */
.scroll-up-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.scroll-up-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
}

.scroll-up-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Scroll Down Button */
.scroll-down-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.scroll-down-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
}

.scroll-down-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Responsive Design */
@media (max-width: 480px) {
  .floating-actions-container {
    left: 0.75rem;
    bottom: 0.75rem;
    gap: 0.5rem;
  }
  
  .floating-btn {
    width: 3rem;
    height: 3rem;
  }
  
  .floating-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .floating-actions-container {
    left: 1.25rem;
    bottom: 1.25rem;
    gap: 0.75rem;
  }
  
  .floating-btn {
    width: 3.25rem;
    height: 3.25rem;
  }
  
  .floating-icon {
    width: 1.375rem;
    height: 1.375rem;
  }
}

@media (min-width: 1024px) {
  .floating-actions-container {
    left: 1.5rem;
    bottom: 1.5rem;
    gap: 1rem;
  }
  
  .floating-btn {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .floating-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* Dark Mode Support */
.dark .floating-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .whatsapp-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.dark .whatsapp-btn:hover {
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.dark .scroll-up-btn {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.dark .scroll-up-btn:hover {
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.5);
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
}

.dark .scroll-down-btn {
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.dark .scroll-down-btn:hover {
  box-shadow: 0 6px 20px rgba(67, 56, 202, 0.5);
  background: linear-gradient(135deg, #3730a3 0%, #4338ca 100%);
}

/* Focus States for Accessibility */
.floating-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.whatsapp-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-up-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-down-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .floating-btn {
    border: 3px solid rgba(255, 255, 255, 0.8);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .floating-btn {
    transition: none;
  }
  
  .floating-btn:hover {
    transform: none;
  }
}

/* Print Styles */
@media print {
  .floating-actions-container {
    display: none;
  }
}
</style>
