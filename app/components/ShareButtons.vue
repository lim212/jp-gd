<template>
  <div class="share-buttons-container">
    <h4 class="share-title">
      <UIcon name="i-lucide-share-2" class="w-4 h-4" />
      <span>Bagikan Artikel</span>
    </h4>
    
    <div class="share-buttons-grid">
      <!-- WhatsApp -->
      <button
        @click="shareWhatsApp"
        class="share-button whatsapp"
        aria-label="Bagikan ke WhatsApp"
      >
        <UIcon name="i-lucide-message-circle" class="w-5 h-5" />
        <span>WhatsApp</span>
      </button>

      <!-- Twitter/X -->
      <button
        @click="shareTwitter"
        class="share-button twitter"
        aria-label="Bagikan ke Twitter"
      >
        <UIcon name="i-lucide-twitter" class="w-5 h-5" />
        <span>Twitter</span>
      </button>

      <!-- Facebook -->
      <button
        @click="shareFacebook"
        class="share-button facebook"
        aria-label="Bagikan ke Facebook"
      >
        <UIcon name="i-lucide-facebook" class="w-5 h-5" />
        <span>Facebook</span>
      </button>

      <!-- LinkedIn -->
      <button
        @click="shareLinkedIn"
        class="share-button linkedin"
        aria-label="Bagikan ke LinkedIn"
      >
        <UIcon name="i-lucide-linkedin" class="w-5 h-5" />
        <span>LinkedIn</span>
      </button>

      <!-- Copy Link -->
      <button
        @click="copyLink"
        class="share-button copy-link"
        :class="{ 'copied': isCopied }"
        aria-label="Salin Link"
      >
        <UIcon :name="isCopied ? 'i-lucide-check' : 'i-lucide-link'" class="w-5 h-5" />
        <span>{{ isCopied ? 'Tersalin!' : 'Salin Link' }}</span>
      </button>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
        <span>Link berhasil disalin!</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title: string
  url?: string
  description?: string
}>()

const isCopied = ref(false)
const showToast = ref(false)

// Get current URL or use provided URL
const shareUrl = computed(() => {
  if (props.url) return props.url
  if (import.meta.client) {
    return window.location.href
  }
  return ''
})

// Share to WhatsApp
const shareWhatsApp = () => {
  const text = `${props.title}\n\n${shareUrl.value}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

// Share to Twitter
const shareTwitter = () => {
  const text = props.title
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(twitterUrl, '_blank', 'noopener,noreferrer')
}

// Share to Facebook
const shareFacebook = () => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  window.open(facebookUrl, '_blank', 'noopener,noreferrer')
}

// Share to LinkedIn
const shareLinkedIn = () => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
  window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
}

// Copy link to clipboard
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    isCopied.value = true
    showToast.value = true

    // Reset after 2 seconds
    setTimeout(() => {
      isCopied.value = false
    }, 2000)

    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to copy:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = shareUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      isCopied.value = true
      showToast.value = true
      setTimeout(() => {
        isCopied.value = false
        showToast.value = false
      }, 2000)
    } catch (err) {
      console.error('Fallback copy failed:', err)
    }
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.share-buttons-container {
  position: relative;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dark .share-buttons-container {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

.share-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.dark .share-title {
  color: #f3f4f6;
}

.share-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .share-buttons-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.share-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.share-button:active {
  transform: translateY(0);
}

.share-button.whatsapp {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  color: white;
}

.share-button.whatsapp:hover {
  background: linear-gradient(135deg, #128C7E 0%, #075E54 100%);
}

.share-button.twitter {
  background: linear-gradient(135deg, #1DA1F2 0%, #0C85D0 100%);
  color: white;
}

.share-button.twitter:hover {
  background: linear-gradient(135deg, #0C85D0 0%, #0A6EB4 100%);
}

.share-button.facebook {
  background: linear-gradient(135deg, #1877F2 0%, #0C63D4 100%);
  color: white;
}

.share-button.facebook:hover {
  background: linear-gradient(135deg, #0C63D4 0%, #0952B8 100%);
}

.share-button.linkedin {
  background: linear-gradient(135deg, #0A66C2 0%, #004182 100%);
  color: white;
}

.share-button.linkedin:hover {
  background: linear-gradient(135deg, #004182 0%, #003366 100%);
}

.share-button.copy-link {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
}

.share-button.copy-link:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
}

.share-button.copy-link.copied {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(16, 185, 129, 0.95);
  color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 9999;
  font-weight: 600;
}

.dark .toast-notification {
  background: rgba(16, 185, 129, 0.9);
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-1rem);
}
</style>

