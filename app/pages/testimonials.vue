<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { testimonialsData } from '~/data/testimonials-data'

// SEO Meta
useHead({
  title: 'Testimoni Pelanggan - JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Baca testimoni dari ribuan pelanggan yang puas dengan layanan pembayaran online kami. Cepat, aman, dan terpercaya.' },
    { property: 'og:title', content: 'Testimoni Pelanggan - JasaPembayaran.com' },
    { property: 'og:description', content: 'Baca testimoni dari ribuan pelanggan yang puas dengan layanan pembayaran online kami.' },
  ]
})

// State
const searchQuery = ref('')
const selectedRating = ref<number | null>(null)
const selectedService = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 12

// All testimonials
const allTestimonials = testimonialsData

// Get unique services
const availableServices = computed(() => {
  const services = new Set(allTestimonials.map(t => t.service).filter(Boolean))
  return Array.from(services)
})

// Filter testimonials
const filteredTestimonials = computed(() => {
  let filtered = allTestimonials

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.content.toLowerCase().includes(query) ||
      t.company.toLowerCase().includes(query) ||
      (t.role && t.role.toLowerCase().includes(query))
    )
  }

  // Rating filter
  if (selectedRating.value) {
    filtered = filtered.filter(t => t.rating === selectedRating.value)
  }

  // Service filter
  if (selectedService.value) {
    filtered = filtered.filter(t => t.service === selectedService.value)
  }

  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredTestimonials.value.length / itemsPerPage))

const paginatedTestimonials = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTestimonials.value.slice(start, end)
})

// Stats
const stats = computed(() => {
  const total = allTestimonials.length
  const fiveStars = allTestimonials.filter(t => t.rating === 5).length
  const avgRating = allTestimonials.reduce((sum, t) => sum + t.rating, 0) / total
  
  return {
    total,
    fiveStars,
    avgRating: avgRating.toFixed(1),
    satisfaction: Math.round((fiveStars / total) * 100)
  }
})

// Reset page when filters change
const resetPage = () => {
  currentPage.value = 1
}

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedRating.value = null
  selectedService.value = null
  currentPage.value = 1
}

// Scroll to top on page change
const changePage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12">
    <div class="container mx-auto px-4 max-w-7xl">
      
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-3 justify-center mb-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
          <UIcon name="i-lucide-sparkles" class="text-purple-600 dark:text-purple-400 size-8" />
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            Testimoni Pelanggan
          </h1>
          <UIcon name="i-lucide-heart" class="text-red-500 size-8" />
        </div>
        
        <p class="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-4">
          Dengarkan langsung dari pelanggan kami tentang pengalaman mereka menggunakan layanan pembayaran online terbaik
        </p>
      </div>

      <!-- Stats Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800 text-center hover:scale-105 transition-transform">
          <div class="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{{ stats.total }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-semibold">Total Testimoni</div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-yellow-200 dark:border-yellow-800 text-center hover:scale-105 transition-transform">
          <div class="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{{ stats.avgRating }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-semibold">Rating Rata-rata</div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-green-800 text-center hover:scale-105 transition-transform">
          <div class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{{ stats.satisfaction }}%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-semibold">Kepuasan</div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800 text-center hover:scale-105 transition-transform">
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{{ stats.fiveStars }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 font-semibold">Bintang 5</div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-100 dark:border-purple-900">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <UIcon name="i-lucide-search" class="inline mr-2" />
              Cari Testimoni
            </label>
            <input
              v-model="searchQuery"
              @input="resetPage"
              type="text"
              placeholder="Nama, perusahaan, atau kata kunci..."
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          <!-- Rating Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <UIcon name="i-lucide-star" class="inline mr-2" />
              Rating
            </label>
            <select
              v-model="selectedRating"
              @change="resetPage"
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            >
              <option :value="null">Semua Rating</option>
              <option :value="5">⭐ 5 Bintang</option>
              <option :value="4">⭐ 4 Bintang</option>
              <option :value="3">⭐ 3 Bintang</option>
            </select>
          </div>

          <!-- Service Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <UIcon name="i-lucide-zap" class="inline mr-2" />
              Layanan
            </label>
            <select
              v-model="selectedService"
              @change="resetPage"
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            >
              <option :value="null">Semua Layanan</option>
              <option v-for="service in availableServices" :key="service" :value="service">
                {{ service }}
              </option>
            </select>
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end" v-if="searchQuery || selectedRating || selectedService">
          <button
            @click="clearFilters"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-semibold"
          >
            <UIcon name="i-lucide-x-circle" />
            Hapus Filter
          </button>
        </div>
      </div>

      <!-- Results Info -->
      <div class="text-center mb-6">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Menampilkan <span class="font-bold text-purple-600 dark:text-purple-400">{{ paginatedTestimonials.length }}</span> 
          dari <span class="font-bold text-purple-600 dark:text-purple-400">{{ filteredTestimonials.length }}</span> testimoni
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div v-if="paginatedTestimonials.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="testimonial in paginatedTestimonials"
          :key="testimonial.id"
          class="testimonial-card group bg-white dark:bg-gray-800/95 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500"
        >
          <!-- Subtle Gradient Overlay on Hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <!-- Card Content -->
          <div class="relative z-10 p-6 flex flex-col h-full">
            
            <!-- Rating & Service Badge -->
            <div class="flex items-center justify-between mb-4">
              <!-- Stars -->
              <div class="flex items-center gap-0.5">
                <UIcon v-for="star in testimonial.rating" :key="`star-${star}`" name="i-lucide-star" class="text-yellow-400 fill-current w-4 h-4" />
                <UIcon v-for="star in (5 - testimonial.rating)" :key="`empty-${star}`" name="i-lucide-star" class="text-gray-300 dark:text-gray-600 w-4 h-4" />
              </div>
              <!-- Service Badge -->
              <span v-if="testimonial.service" class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                <UIcon name="i-lucide-zap" class="w-3 h-3" />
                {{ testimonial.service }}
              </span>
            </div>

            <!-- Testimonial Message -->
            <div class="flex-1 mb-5">
              <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                "{{ testimonial.content }}"
              </p>
            </div>
            
            <!-- Customer Info with Avatar -->
            <div class="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <!-- Avatar with Check Badge -->
              <div class="relative flex-shrink-0">
                <div class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-100 dark:ring-purple-900 group-hover:ring-purple-300 dark:group-hover:ring-purple-700 transition-all">
                  <img
                    v-if="testimonial.avatar"
                    :src="testimonial.avatar"
                    :alt="testimonial.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                  />
                  <div
                    class="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold"
                    :style="testimonial.avatar ? 'display: none' : ''"
                  >
                    {{ testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() }}
                  </div>
                </div>
                <!-- Verified Badge -->
                <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                  <UIcon name="i-lucide-check" class="text-white w-3 h-3" />
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

      <!-- No Results -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
          <UIcon name="i-lucide-search-x" class="text-4xl text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Tidak Ada Testimoni Ditemukan</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Coba ubah filter pencarian Anda</p>
        <button
          @click="clearFilters"
          class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-semibold shadow-lg"
        >
          <UIcon name="i-lucide-refresh-cw" />
          Reset Filter
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          <UIcon name="i-lucide-chevron-left" />
        </button>

        <template v-for="page in totalPages" :key="page">
          <button
            v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
            @click="changePage(page)"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all',
              page === currentPage
                ? 'bg-purple-600 text-white shadow-lg scale-110'
                : 'bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
          <span v-else-if="page === currentPage - 2 || page === currentPage + 2" class="px-2 text-gray-500">...</span>
        </template>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          <UIcon name="i-lucide-chevron-right" />
        </button>
      </div>

      <!-- CTA Section -->
      <div class="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Siap Bergabung?</h2>
        <p class="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan pelanggan yang puas dan rasakan layanan pembayaran online terbaik
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-lg hover:scale-105 transform"
          >
            <UIcon name="i-lucide-home" class="text-xl" />
            Kembali ke Beranda
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-800 text-white rounded-xl hover:bg-purple-900 transition-all font-bold shadow-lg hover:scale-105 transform border-2 border-white"
          >
            <UIcon name="i-lucide-message-circle" class="text-xl" />
            Hubungi Kami
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Clean Testimonial Card Animations */
.testimonial-card {
  will-change: transform;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 280px;
}

.testimonial-card:hover {
  transform: translateY(-4px);
}

/* Avatar image hover effect */
.testimonial-card img {
  transition: transform 0.3s ease;
}

.testimonial-card:hover img {
  transform: scale(1.08);
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .testimonial-card {
    min-height: 260px;
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
</style>

