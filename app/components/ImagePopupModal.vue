<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  imageSrc: string
  imageAlt: string
  title?: string
  description?: string
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: ''
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement>()
const imageRef = ref<HTMLImageElement>()
const isImageLoaded = ref(false)

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

// Handle click outside modal
const handleBackdropClick = (event: MouseEvent) => {
  // Only close if clicking on the backdrop (not on modal content)
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

// Handle image load
const handleImageLoad = () => {
  isImageLoaded.value = true
}

// Handle image error
const handleImageError = () => {
  console.error('Failed to load image:', props.imageSrc)
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  // Remove the global click listener that was causing issues
  // The backdrop click is now handled directly in the template
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <!-- Enhanced Modal Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="modal-enter-active"
      enter-from-class="modal-enter-from"
      enter-to-class="modal-enter-to"
      leave-active-class="modal-leave-active"
      leave-from-class="modal-leave-from"
      leave-to-class="modal-leave-to"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Enhanced Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-lg transition-opacity duration-300"></div>
        
        <!-- Enhanced Modal Container -->
        <div
          ref="modalRef"
          class="relative z-10 w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-none border border-gray-200/50 dark:border-gray-700/30 overflow-hidden transform transition-all duration-300"
          @click.stop
        >
          <!-- Enhanced Header -->
          <div class="relative bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-6">
            <!-- Background Pattern -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20"></div>
            
            <!-- Header Content -->
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-white font-black text-xl md:text-2xl mb-2 tracking-wide drop-shadow-lg">
                  {{ title || 'Image Preview' }}
                </h3>
                <p v-if="description" class="text-white/90 text-sm md:text-base font-medium">
                  {{ description }}
                </p>
              </div>
              
              <!-- Enhanced Close Button -->
              <button
                @click="emit('close')"
                class="group relative p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 border border-white/30"
                aria-label="Close modal"
              >
                <UIcon 
                  name="i-lucide-x" 
                  class="text-white size-6 md:size-7 drop-shadow-lg group-hover:scale-110 transition-transform duration-200" 
                />
                <!-- Hover Effect -->
                <div class="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
          
          <!-- Enhanced Image Container -->
          <div class="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6">
            <!-- Loading State -->
            <div v-if="!isImageLoaded" class="flex items-center justify-center min-h-[400px]">
              <div class="flex flex-col items-center">
                <div class="loading-spinner mb-4"></div>
                <p class="text-gray-600 dark:text-gray-300 font-medium">Loading image...</p>
              </div>
            </div>
            
            <!-- Image -->
            <div class="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-none">
              <img
                ref="imageRef"
                :src="imageSrc"
                :alt="imageAlt"
                class="w-full h-auto max-h-[70vh] object-contain transition-all duration-500"
                :class="{ 'opacity-0': !isImageLoaded, 'opacity-100': isImageLoaded }"
                @load="handleImageLoad"
                @error="handleImageError"
                loading="eager"
                decoding="async"
              />
              
              <!-- Image Enhancement Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-500/5 pointer-events-none"></div>
            </div>
            
            <!-- Image Info -->
            <div class="mt-4 p-4 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-400/10">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <UIcon name="i-lucide-image" class="text-white size-5" />
                </div>
                <div>
                  <p class="text-gray-700 dark:text-gray-300 font-semibold">Image Details</p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">{{ imageAlt }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Footer -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 border-t border-gray-200 dark:border-gray-600/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-info" class="text-blue-500 size-4" />
                <span class="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Click outside or press ESC to close
                </span>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center gap-3">
                <button
                  @click="emit('close')"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Animation Classes */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.modal-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* Loading Spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Hover Effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #60a5fa, #a78bfa);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Image Enhancement */
img {
  filter: contrast(1.05) saturate(1.1);
  transition: filter 0.3s ease;
}

img:hover {
  filter: contrast(1.1) saturate(1.2);
}

/* Backdrop Blur Enhancement */
.backdrop-blur-lg {
  backdrop-filter: blur(20px) saturate(180%);
}

/* Enhanced Shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark .shadow-2xl {
  box-shadow: none;
}
</style>

