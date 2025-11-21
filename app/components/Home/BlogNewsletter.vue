<template>
  <div class="w-full mt-8 mb-6 bg-gradient-to-br from-pink-400 via-rose-300 to-red-500 dark:from-pink-600 dark:via-rose-500 dark:to-red-700 shadow-2xl border border-pink-300 dark:border-pink-600 overflow-hidden rounded-3xl relative backdrop-blur-sm">
    <!-- Super Cool Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Floating hearts and stars -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-pink-400/10 to-rose-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-rose-400/10 to-red-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-red-400/10 to-pink-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-pink-400/10 to-rose-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-pink-100/10 to-rose-100/10 dark:via-pink-900/5 dark:to-rose-900/5"></div>
      
      <!-- Animated floating elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
        <div class="absolute top-1/3 right-1/3 w-3 h-3 bg-rose-400 rounded-full animate-bounce" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-1/4 left-1/3 w-5 h-5 bg-red-400 rounded-full animate-bounce" style="animation-delay: 2s;"></div>
        <div class="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.5s;"></div>
      </div>
    </div>

    <!-- Newsletter Content -->
    <div class="relative z-10 p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center gap-4 justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-mail" class="text-pink-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
          <span class="relative text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📧 Blog</span> 
            <span class="text-pink-200 drop-shadow-2xl dark:text-pink-200 dark:drop-shadow-2xl">Newsletter</span> 
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">📧</span>
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 rounded-full shadow-lg"></span>
          </span>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-heart" class="text-rose-200 size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
        </div>
        
        <div class="max-w-4xl mx-auto px-0 sm:px-4 mb-2">
          <div class="text-center">
            <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-3 border border-white/20">
              <p class="text-white dark:text-white text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
                🎯 <span class="text-pink-200 dark:text-pink-200 font-bold">Dapatkan Update Blog Terbaru!</span> 🎯
              </p>
            </div>
            <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <p class="text-white dark:text-white text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
                📬 Subscribe newsletter untuk mendapatkan artikel terbaru, tips eksklusif, dan update blog langsung di inbox Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Form -->
      <div class="max-w-2xl mx-auto">
        <div class="newsletter-form-container bg-white dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-pink-200/40 dark:border-pink-600/40 p-6 md:p-8 relative overflow-hidden">
          <!-- Form background pattern -->
          <div class="absolute inset-0 opacity-5">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.3) 1px, transparent 0); background-size: 20px 20px;"></div>
          </div>
          
          <!-- Success/Error Messages -->
          <div v-if="showSuccess" class="success-message mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-600 rounded-xl">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-check-circle" class="text-green-600 dark:text-green-400 size-6" />
              <div>
                <h4 class="font-bold text-green-800 dark:text-green-200">🎉 Berhasil Subscribe!</h4>
                <p class="text-green-600 dark:text-green-400 text-sm">Terima kasih! Anda akan menerima update blog terbaru.</p>
              </div>
            </div>
          </div>

          <div v-if="showError" class="error-message mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-600 rounded-xl">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-alert-circle" class="text-red-600 dark:text-red-400 size-6" />
              <div>
                <h4 class="font-bold text-red-800 dark:text-red-200">❌ Gagal Subscribe</h4>
                <p class="text-red-600 dark:text-red-400 text-sm">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div v-if="!showSuccess" class="relative z-10">
            <!-- Benefits List -->
            <div class="benefits-list mb-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">✨ Keuntungan Subscribe Newsletter</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="benefit-item flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200/60 dark:border-pink-600/60">
                  <UIcon name="i-lucide-zap" class="text-pink-600 dark:text-pink-400 size-5" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Update Real-time</span>
                </div>
                <div class="benefit-item flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200/60 dark:border-pink-600/60">
                  <UIcon name="i-lucide-star" class="text-pink-600 dark:text-pink-400 size-5" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Konten Eksklusif</span>
                </div>
                <div class="benefit-item flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200/60 dark:border-pink-600/60">
                  <UIcon name="i-lucide-gift" class="text-pink-600 dark:text-pink-400 size-5" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Tips & Trik Gratis</span>
                </div>
                <div class="benefit-item flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200/60 dark:border-pink-600/60">
                  <UIcon name="i-lucide-shield-check" class="text-pink-600 dark:text-pink-400 size-5" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">100% Spam Free</span>
                </div>
              </div>
            </div>

            <!-- Email Form -->
            <form @submit.prevent="handleSubscribe" class="space-y-4">
              <div class="email-input-group">
                <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📧 Email Address
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UIcon name="i-lucide-mail" class="text-gray-400 size-5" />
                  </div>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    placeholder="Masukkan email Anda..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': showError }"
                  />
                </div>
              </div>

              <div class="name-input-group">
                <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👤 Nama Lengkap (Opsional)
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UIcon name="i-lucide-user" class="text-gray-400 size-5" />
                  </div>
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    placeholder="Nama Anda..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  />
                </div>
              </div>

              <!-- Preferences -->
              <div class="preferences-group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  🎯 Pilih Kategori Favorit
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label v-for="category in categories" :key="category.id" class="preference-item flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200/60 dark:border-pink-600/60 cursor-pointer hover:shadow-md transition-all duration-200">
                    <input
                      v-model="selectedCategories"
                      :value="category.id"
                      type="checkbox"
                      class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ category.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="submit-group">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <UIcon v-if="isLoading" name="i-lucide-loader-2" class="size-5 animate-spin" />
                  <UIcon v-else name="i-lucide-send" class="size-5" />
                  <span>{{ isLoading ? 'Subscribing...' : 'Subscribe Newsletter' }}</span>
                </button>
              </div>

              <!-- Privacy Notice -->
              <div class="privacy-notice text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  🔒 Data Anda aman dengan kami. Tidak akan dibagikan ke pihak ketiga.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Form data
const email = ref('')
const name = ref('')
const selectedCategories = ref<string[]>([])
const isLoading = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Categories options
const categories = ref([
  { id: 'paypal', name: 'Jasa PayPal' },
  { id: 'bitcoin', name: 'Bitcoin & Crypto' },
  { id: 'security', name: 'Keamanan Digital' },
  { id: 'tips', name: 'Tips & Tutorial' },
  { id: 'news', name: 'Berita Terkini' },
  { id: 'reviews', name: 'Review Produk' }
])

// Handle form submission
const handleSubscribe = async () => {
  if (!email.value) {
    showError.value = true
    errorMessage.value = 'Email harus diisi!'
    return
  }

  isLoading.value = true
  showError.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate success
    showSuccess.value = true
    
    // Reset form
    email.value = ''
    name.value = ''
    selectedCategories.value = []
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
    
  } catch (error) {
    showError.value = true
    errorMessage.value = 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Newsletter Form Styling */
.newsletter-form-container {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.newsletter-form-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px -12px rgba(236, 72, 153, 0.25);
}

/* Form input focus effects */
input:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.3);
}

/* Benefit items hover */
.benefit-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
}

/* Preference items hover */
.preference-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
}

/* Success/Error message animations */
.success-message,
.error-message {
  animation: slideInDown 0.5s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form entrance animation */
.newsletter-form-container {
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
  .newsletter-form-container {
    padding: 1rem;
  }
  
  .benefits-list .grid {
    grid-template-columns: 1fr;
  }
  
  .preferences-group .grid {
    grid-template-columns: 1fr;
  }
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
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
</style>

