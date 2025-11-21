<script setup lang="ts">
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { testimonialsData } from '~/data/testimonials-data'

interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  date: string;
  content?: string;
  company?: string;
  location?: string;
  avatar?: string;
  role?: string;
  service?: string;
}

// State for API fetching
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const testimonials = ref<Testimonial[]>([]);
const isUsingMockData = ref(false);

// Use imported testimonials data
const dummyTestimonials: Testimonial[] = testimonialsData.slice(0, 12);

// Computed properties for carousel
const testimonialSlides = computed(() => {
  const slides: Testimonial[][] = []
  const items = testimonials.value

  // Create slides with 6 testimonials each
  for (let i = 0; i < items.length; i += 6) {
    slides.push(items.slice(i, i + 6))
  }

  return slides
})

// Overall rating summary (for header)
const ratingSummary = computed(() => {
  const items = testimonials.value.length ? testimonials.value : dummyTestimonials
  if (!items.length) {
    return {
      avg: '5.0',
      total: 0
    }
  }

  const total = items.length
  const sum = items.reduce((acc, t) => acc + (t.rating || 5), 0)
  const avg = (sum / total).toFixed(1)

  return { avg, total }
})

// Fetch testimonials from API
async function fetchTestimonials() {
  isLoading.value = true;
  hasError.value = false;

  try {
    // Use the server-side API endpoint with pagination parameters
    const response = await fetch('/api/testimonials?offset=0&limit=12');

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    // Check if we're using mock data from the server
    if (data.pagination && data.pagination.isMockData) {
      isUsingMockData.value = true;
    } else {
      isUsingMockData.value = false;
    }

    // Set testimonials from the items array in the response
    testimonials.value = data.items || [];

    // If no items were returned, use dummy testimonials
    if (!testimonials.value.length) {
      testimonials.value = dummyTestimonials;
      isUsingMockData.value = true;
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    hasError.value = true;
    errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch testimonials';

    // Use dummy testimonials as fallback
    testimonials.value = dummyTestimonials;
    isUsingMockData.value = true;
  } finally {
    isLoading.value = false;
  }
}

// Fetch testimonials on component mount
onMounted(() => {
  fetchTestimonials();
});

// Autoplay settings
const autoplaySpeed = 5000;
const isAutoplay = ref(autoplaySpeed);
const resumeTimer = ref(null);

// Pause autoplay on user interaction
const pauseAutoplay = () => {
  isAutoplay.value = 0;
  if (resumeTimer.value) clearTimeout(resumeTimer.value);
  resumeTimer.value = setTimeout(() => {
    isAutoplay.value = autoplaySpeed;
  }, 3000);
};

// Clear timer on component unmount
onBeforeUnmount(() => {
  if (resumeTimer.value) clearTimeout(resumeTimer.value);
});

// Function to retry fetching testimonials
function retryFetch() {
  fetchTestimonials();
}

// Generate star rating display (not used in template but kept for potential future use)
function getStarRating(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

// Local profile icon set (SVGs in /public/images/profile-icons)
const PROFILE_ICONS = Array.from({ length: 30 }, (_, idx) => {
  const num = idx + 1
  return `/images/profile-icons/profile-icon-${num}.svg`
})

// Simple hash to map testimonial -> local profile icon (deterministic)
function hashString(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Pick avatar for testimonial (always local SVG so tidak bergantung jaringan luar)
function getAvatarFor(testimonial: Testimonial): string {
  const seed = testimonial.name || testimonial.company || `t-${testimonial.id}`
  const idx = PROFILE_ICONS.length ? hashString(seed) % PROFILE_ICONS.length : 0
  return PROFILE_ICONS[idx] || PROFILE_ICONS[0] || ''
}

// Format rating label, e.g. "5.0 / 5"
function formatRating(rating: number): string {
  const safe = Number.isFinite(rating) ? rating : 5
  return `${safe.toFixed(1)} / 5`
}
</script>

<template>
  <div
    id="testimonial-section"
    class="@container testimonial-override scroll-mt-24 py-6 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900 ring ring-default overflow-hidden rounded-2xl shadow-xl flex flex-col relative"
  >

  <div class="absolute inset-0 bg-gradient-to-br from-purple-50/40 to-transparent dark:from-purple-900/20 dark:to-transparent opacity-60 pointer-events-none"></div>

    <div class="text-center mb-6 relative z-10">
      <!-- Clean Title -->
      <div class="flex flex-col items-center gap-3 justify-center mb-3">
        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/60 shadow-md border border-purple-200/60 dark:border-purple-700/40">
          <div class="p-2.5 bg-purple-600 rounded-lg shadow-md">
            <UIcon name="i-lucide-message-square" class="text-white size-6" />
          </div>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            TESTIMONIALS
          </h2>
          <div class="p-2.5 bg-purple-600 rounded-lg shadow-md">
            <UIcon name="i-lucide-star" class="text-white size-6" />
          </div>
        </div>

        <!-- Global rating summary -->
        <div class="flex items-center gap-2 mt-2">
          <!-- Text-based star row for maximum contrast in dark & light mode -->
          <div class="flex items-center gap-0.5">
            <span
              v-for="n in 5"
              :key="`header-star-${n}`"
              class="text-[15px] leading-none drop-shadow"
              :class="n <= Math.round(Number(ratingSummary.avg)) ? 'text-yellow-400 dark:text-yellow-300' : 'text-gray-300 dark:text-gray-600'"
            >
              ★
            </span>
          </div>
          <span class="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100">
            {{ ratingSummary.avg }} / 5.0 • {{ ratingSummary.total }}+ testimoni asli
          </span>
        </div>
      </div>
      
      <p class="text-gray-700 dark:text-gray-200 text-sm sm:text-base max-w-4xl mx-auto leading-relaxed">
        Testimoni pilihan dari pelanggan <span class="font-semibold text-purple-600 dark:text-purple-400">real</span> yang sudah merasakan sendiri
        proses pembayaran yang <span class="font-semibold text-purple-600 dark:text-purple-400">super cepat, aman, dan dibantu sampai selesai</span>.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="text-purple-500 dark:text-purple-400 size-16 animate-spin mb-4" />
      <p class="text-gray-600 dark:text-gray-400 text-lg">Memuat testimonial...</p>
    </div>

    <!-- Error state with retry button -->
    <div v-else-if="hasError && !isUsingMockData" class="flex flex-col items-center justify-center py-12">
      <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6">
        <UIcon name="i-lucide-alert-circle" class="text-red-500 dark:text-red-400 size-16" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Gagal Memuat Testimoni</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-center">
        {{ errorMessage || 'Terjadi kesalahan saat memuat testimoni pelanggan. Silakan coba lagi nanti.' }}
      </p>
      <UButton
        color="purple"
        variant="solid"
        size="lg"
        @click="retryFetch"
        class="font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <UIcon name="i-lucide-refresh-cw" class="mr-2 text-lg" />
        Coba Lagi
      </UButton>
    </div>

    <!-- Testimonial carousel -->
    <div v-if="!isLoading && testimonials.length > 0" class="relative z-10">
      <Carousel
        :autoplay="isAutoplay"
        :autoplay-timeout="autoplaySpeed"
        :wrap-around="true"
        :mouse-drag="true"
        :touch-drag="true"
        :transition="1000"
        @mouseenter="pauseAutoplay"
        @mouseleave="pauseAutoplay"
        @touchstart="pauseAutoplay"
        @touchend="pauseAutoplay"
        class="testimonial-carousel"
      >
        <Slide
          v-for="(slide, slideIndex) in testimonialSlides"
          :key="slideIndex"
          class="testimonial-slide"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            <div
              v-for="(testimonial, index) in slide"
              :key="`${slideIndex}-${index}`"
              class="testimonial-card group bg-white dark:bg-gray-800/95 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500"
            >
              <!-- Subtle Gradient Overlay on Hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <!-- Card Content -->
              <div class="relative z-10 p-6 flex flex-col h-full">
                
                <!-- Rating & Date -->
                <div class="flex items-center justify-between mb-4">
                  <!-- Stars -->
                <div class="flex items-center gap-2">
                  <!-- Star rating row (text-based for strong contrast) -->
                  <div class="flex items-center gap-0.5">
                    <span
                      v-for="n in 5"
                      :key="`card-star-${testimonial.id}-${n}`"
                      class="text-[13px] leading-none"
                      :class="n <= testimonial.rating ? 'text-yellow-400 dark:text-yellow-300 drop-shadow' : 'text-gray-300 dark:text-gray-600'"
                    >
                      ★
                    </span>
                  </div>
                  <!-- Numeric rating pill -->
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-yellow-400 text-yellow-600 dark:text-yellow-300 bg-transparent dark:bg-transparent"
                  >
                    <UIcon name="i-lucide-star" class="w-3 h-3" />
                    <span>{{ formatRating(testimonial.rating) }}</span>
                  </span>
                </div>
                  <!-- Service Badge -->
                  <span v-if="testimonial.service" class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                    <UIcon name="i-lucide-zap" class="w-3 h-3" />
                    {{ testimonial.service }}
                  </span>
                </div>

                <!-- Testimonial Message -->
                <div class="flex-1 mb-5">
                  <p class="text-gray-500 dark:text-gray-300 text-xs font-semibold uppercase tracking-wide mb-1">
                    Pengalaman pelanggan
                  </p>
                  <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed line-clamp-3">
                    “{{ testimonial.message }}”
                  </p>
                </div>
                
                <!-- Customer Info with Avatar -->
                <div class="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <!-- Avatar with Check Badge -->
                  <div class="relative flex-shrink-0">
                    <div class="w-14 h-14 rounded-full overflow-hidden ring-2 ring-purple-200/80 dark:ring-purple-800/90 group-hover:ring-purple-400 dark:group-hover:ring-purple-500 shadow-md transition-all testimonial-avatar">
                      <img
                        :src="getAvatarFor(testimonial)"
                        :alt="testimonial.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <!-- Verified Badge -->
                    <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow">
                      <UIcon name="i-lucide-badge-check" class="text-white w-3 h-3" />
                    </div>
                  </div>
                  
                  <!-- Name & Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {{ testimonial.name }}
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {{ testimonial.role || testimonial.company }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-0.5" v-if="testimonial.location">
                      <UIcon name="i-lucide-map-pin" class="w-3 h-3" />
                      {{ testimonial.location }}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <!-- View all testimonials button -->
    <div class="flex justify-center mt-0 mb-2 sm:mb-3 pb-0">
      <NuxtLink
        to="/testimonials"
        class="relative z-10 inline-flex items-center justify-center text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-500 dark:hover:to-purple-600 font-bold text-sm sm:text-base leading-none py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
      >
        <span class="leading-none">Lihat Semua Testimoni</span>
        <UIcon name="i-lucide-arrow-right" class="ml-2 sm:ml-3 text-lg sm:text-xl align-middle" />
      </NuxtLink>
    </div>

  </div>
</template>

<style scoped>
/* Clean Testimonial Card Styles */
.testimonial-card {
  will-change: transform, box-shadow;
  min-height: 280px;
  max-height: none;
}

.testimonial-card:hover {
  transform: translateY(-4px);
}

/* Line clamp for testimonial text */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive Heights */
@media (max-width: 768px) {
  .testimonial-card {
    min-height: 260px;
    max-height: 300px;
  }
}

@media (min-width: 769px) and (max-width: 1023px) {
  .testimonial-card {
    min-height: 270px;
    max-height: 310px;
  }
}

/* Smooth Animations */
@media (prefers-reduced-motion: no-preference) {
  .testimonial-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .testimonial-card,
  .testimonial-card * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Carousel styling */
.testimonial-carousel {
  width: 100%;
  overflow: visible;
}

.testimonial-slide {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

/* Avatar hover effect */
.testimonial-card:hover img {
  transform: scale(1.08);
  transition: transform 0.3s ease;
}

/* Avatar visibility tweaks (light & dark) */
.testimonial-avatar {
  display: block;
  background: transparent;
}

.testimonial-avatar img {
  display: block;
  object-fit: contain;
  width: 100%;
  height: 100%;
}

/* Carousel navigation styling - Purple gradient */
:deep(.carousel__prev),
:deep(.carousel__next) {
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%) !important;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  color: white !important;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  transition: all 0.3s ease;
  border: none;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(147, 51, 234, 0.5);
}

/* Pagination dots styling */
:deep(.carousel__pagination) {
  margin-top: 1.5rem;
  gap: 8px;
}

:deep(.carousel__pagination-button) {
  background-color: rgba(147, 51, 234, 0.25) !important;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 4px;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
}

:deep(.carousel__pagination-button--active) {
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%) !important;
  width: 24px;
  border-radius: 4px;
  transform: scale(1.1);
}

:deep(.carousel__pagination-button:hover) {
  background-color: rgba(147, 51, 234, 0.5) !important;
  transform: scale(1.15);
}

/* Ensure icons in carousel buttons are visible */
:deep(.carousel__icon) {
  fill: white !important;
  color: white !important;
}
</style>




