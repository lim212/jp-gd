<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

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
  title: 'Informasi Umum',
  description: 'Detail rekening resmi untuk transaksi'
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement>()
const imageRef = ref<HTMLImageElement>()
const isImageLoaded = ref(false)
const isAnimating = ref(false)

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Handle backdrop click - only close if clicking on backdrop
const handleBackdropClick = (event: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(event.target as Node)) {
    closeModal()
  }
}

// Handle image load
const handleImageLoad = () => {
  isImageLoaded.value = true
}

// Handle image error
const handleImageError = () => {
  console.error('Failed to load image:', props.imageSrc)
  isImageLoaded.value = true // Show error state
}

// Close modal with animation
const closeModal = async () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  await nextTick()
  
  // Small delay for smooth animation
  setTimeout(() => {
    emit('close')
    isAnimating.value = false
  }, 150)
}

// Reset states when modal opens
const resetStates = () => {
  isImageLoaded.value = false
  isAnimating.value = false
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.isOpen) {
    resetStates()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// Watch for modal open state
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetStates()
  }
})
</script>

<template>
  <!-- Professional Modal Overlay -->
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
        class="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Professional Backdrop -->
        <div class="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-xl transition-opacity duration-500"></div>
        
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <!-- Floating particles -->
          <div v-for="i in 8" :key="i" 
               class="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
               :style="{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 3}s`,
                 animationDuration: `${3 + Math.random() * 2}s`
               }">
          </div>
          
          <!-- Gradient orbs -->
          <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <!-- Professional Modal Container -->
        <div
          ref="modalRef"
          class="relative z-10 w-full max-w-7xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-none border border-gray-200/50 dark:border-gray-700/30 overflow-hidden transform transition-all duration-500 backdrop-blur-sm"
          @click.stop
        >
          <!-- Professional Header -->
          <div class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8">
            <!-- Animated background pattern -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
            <div class="absolute inset-0 opacity-30" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
            
            <!-- Header Content -->
            <div class="relative z-10 flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-3">
                  <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <UIcon name="i-lucide-info" class="text-white size-6 md:size-8" />
                  </div>
                  <h3 class="text-white font-black text-2xl md:text-3xl tracking-wide drop-shadow-lg">
                    {{ title }}
                  </h3>
                </div>
                <p v-if="description" class="text-white/90 text-sm md:text-base font-medium max-w-2xl">
                  {{ description }}
                </p>
              </div>
              
              <!-- Professional Close Button -->
              <button
                @click="closeModal"
                class="group relative p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 border border-white/30 backdrop-blur-sm"
                aria-label="Tutup popup"
              >
                <UIcon 
                  name="i-lucide-x" 
                  class="text-white size-6 md:size-7 drop-shadow-lg group-hover:scale-110 transition-transform duration-200" 
                />
                <!-- Hover glow effect -->
                <div class="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
          
          <!-- Professional Image Container -->
          <div class="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 md:p-8">
            <!-- Loading State -->
            <div v-if="!isImageLoaded" class="flex items-center justify-center min-h-[500px]">
              <div class="flex flex-col items-center">
                <div class="loading-spinner mb-6"></div>
                <p class="text-gray-600 dark:text-gray-300 font-medium text-lg">Memuat gambar...</p>
              </div>
            </div>
            
            <!-- Professional Image Display -->
            <div class="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700/50 shadow-2xl dark:shadow-none">
              <img
                ref="imageRef"
                :src="imageSrc"
                :alt="imageAlt"
                class="w-full h-auto max-h-[75vh] object-contain transition-all duration-700"
                :class="{ 'opacity-0 scale-95': !isImageLoaded, 'opacity-100 scale-100': isImageLoaded }"
                @load="handleImageLoad"
                @error="handleImageError"
                loading="eager"
                decoding="async"
              />
              
              <!-- Professional Image Enhancement Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-500/5 pointer-events-none"></div>
              
              <!-- Image border glow -->
              <div class="absolute inset-0 rounded-3xl border-2 border-blue-500/20 pointer-events-none"></div>
            </div>
            
            <!-- Professional Image Info -->
            <div class="mt-6 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-2xl border border-blue-200/50 dark:border-blue-400/20 backdrop-blur-sm">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <UIcon name="i-lucide-image" class="text-white size-6" />
                </div>
                <div>
                  <p class="text-gray-700 dark:text-gray-300 font-bold text-lg">Detail Gambar</p>
                  <p class="text-gray-600 dark:text-gray-400 text-base">{{ imageAlt }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Professional Footer -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-t border-gray-200 dark:border-gray-600/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-info" class="text-blue-500 size-5" />
                <span class="text-gray-600 dark:text-gray-300 font-medium">
                  Klik di luar atau tekan ESC untuk menutup
                </span>
              </div>
              
              <!-- Professional Action Buttons -->
              <div class="flex items-center gap-4">
                <button
                  @click="closeModal"
                  class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-none"
                >
                  <UIcon name="i-lucide-x" class="mr-2 size-4" />
                  Tutup
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
/* Professional Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-30px);
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
  transform: scale(0.8) translateY(-30px);
}

/* Professional Loading Spinner */
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Professional Hover Effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Professional Image Enhancement */
img {
  filter: contrast(1.05) saturate(1.1) brightness(1.02);
  transition: filter 0.3s ease;
}

img:hover {
  filter: contrast(1.1) saturate(1.2) brightness(1.05);
}

/* Professional Backdrop Blur */
.backdrop-blur-xl {
  backdrop-filter: blur(24px) saturate(180%);
}

/* Professional Shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark .shadow-2xl {
  box-shadow: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Performance Optimizations */
img {
  will-change: transform, opacity;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .animate-float,
  .animate-pulse {
    animation: none;
    transition: none;
  }
  
  .group:hover .group-hover\:scale-110 {
    transform: none;
  }
}

/* Enhanced Focus States */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
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
</style>

