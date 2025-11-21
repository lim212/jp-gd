<script setup lang="ts">
import { useImagePopup } from '~/composables/useImagePopup'

// Image popup functionality
const { openPopup } = useImagePopup()

// Handle image click
const handleImageClick = (imageSrc: string, title: string = '') => {
  openPopup(imageSrc, title, 'Blog Post Image', `Image from blog post: ${title}`)
}

interface BlogApiPost {
  id: number
  title: string
  slug: string
  date: string
  image?: string
  views?: number
}

interface BlogPostsResponse {
  posts: Array<BlogApiPost>
  totalPages: number
  currentPage: number
}

const FALLBACK_IMAGE = '/images/fallback-news.svg'

function stripHtml(t: string) {
  return (t || '').replace(/<[^>]*>/g, '').trim()
}

// Deterministic AI image fallback
function buildAiHeroUrl(titleText?: string, slugText?: string) {
  const cleanTitle = stripHtml(titleText || '')
  const basePrompt = cleanTitle
    ? `${cleanTitle}, modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
    : `modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
  const encoded = encodeURIComponent(basePrompt)
  const seed = encodeURIComponent(String(slugText || cleanTitle || 'blog'))
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=400&height=225&nologo=true&enhance=true`
}

function isValidImageUrl(url?: string) {
  if (!url || typeof url !== 'string') return false
  try {
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
    const isHttp = u.protocol === 'http:' || u.protocol === 'https:'
    const isDataImg = url.startsWith('data:image')
    return isHttp || isDataImg
  } catch {
    return false
  }
}

function normalizeImageUrlClient(img?: string): string {
  const s = String(img || '').trim()
  if (!s) return ''
  if (s.startsWith('data:image')) return s
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) {
    if (s.startsWith('/wp-content/')) return `https://blog.jasapembayaran.com${s}`
    return s
  }
  return ''
}

function getSafeImage(candidate?: string, titleText?: string, slugText?: string) {
  const feat = normalizeImageUrlClient(candidate)
  if (isValidImageUrl(feat) && !String(feat || '').includes('fallback-news.svg')) return String(feat)
  try {
    const ai = buildAiHeroUrl(titleText, slugText)
    if (isValidImageUrl(ai)) return ai
  } catch {}
  return FALLBACK_IMAGE
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (!img) return
  if (img.src.endsWith('fallback-news.svg')) return
  img.onerror = null
  img.src = FALLBACK_IMAGE
}

// Format date function
function formatDateSafe(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  } catch {
    return ''
  }
}

// Fetch latest posts
const { data: latestPostsResponse } = useFetch<BlogPostsResponse>('/api/blog', {
  lazy: true,
  key: 'sidebar-latest-posts',
  params: { page: 1 },
  timeout: 5000
})

// Fetch popular posts (simulated with same data for now)
const { data: popularPostsResponse } = useFetch<BlogPostsResponse>('/api/blog', {
  lazy: true,
  key: 'sidebar-popular-posts',
  params: { page: 1 },
  timeout: 5000
})

// SSR-safe date helper
const getSSRSafeDate = (offsetMs = 0) => {
  if (typeof window === 'undefined') {
    return new Date(Date.now() + offsetMs).toISOString();
  }
  return new Date(Date.now() + offsetMs).toISOString();
};

// Fallback data for latest posts
const fallbackLatestPosts: BlogApiPost[] = [
  { id: 1, title: 'Jasa Pembayaran PayPal Terpercaya di Indonesia', slug: 'jasa-pembayaran-paypal-terpercaya', date: getSSRSafeDate() },
  { id: 2, title: 'Cara Aman Bertransaksi Online dengan PayPal', slug: 'cara-aman-bertransaksi-online-dengan-paypal', date: getSSRSafeDate(-86400000) },
  { id: 3, title: 'Keuntungan Menggunakan Jasa Pembayaran untuk Bisnis Online', slug: 'keuntungan-menggunakan-jasa-pembayaran-untuk-bisnis-online', date: getSSRSafeDate(-172800000) },
  { id: 4, title: 'Tips Memilih Jasa Pembayaran Online yang Aman', slug: 'tips-memilih-jasa-pembayaran-online-yang-aman', date: getSSRSafeDate(-259200000) },
  { id: 5, title: 'Panduan Lengkap Menggunakan Jasa Pembayaran untuk Pemula', slug: 'panduan-lengkap-menggunakan-jasa-pembayaran-untuk-pemula', date: getSSRSafeDate(-345600000) }
]

// Fallback data for popular posts
const fallbackPopularPosts: BlogApiPost[] = [
  { id: 6, title: 'Cara Mengatasi Limit PayPal dengan Aman', slug: 'cara-mengatasi-limit-paypal', date: getSSRSafeDate(-432000000), views: 1250 },
  { id: 7, title: 'Panduan Verifikasi Akun PayPal Terbaru', slug: 'panduan-verifikasi-akun-paypal-terbaru', date: getSSRSafeDate(-518400000), views: 980 },
  { id: 8, title: 'Tips Transaksi Digital Aman dan Cepat', slug: 'tips-transaksi-digital-aman-cepat', date: getSSRSafeDate(-604800000), views: 756 },
  { id: 9, title: 'Strategi Bisnis Online dengan Pembayaran Digital', slug: 'strategi-bisnis-online-dengan-pembayaran-digital', date: getSSRSafeDate(-691200000), views: 634 },
  { id: 10, title: 'Keamanan Transaksi Online: Panduan Lengkap', slug: 'keamanan-transaksi-online-panduan-lengkap', date: getSSRSafeDate(-777600000), views: 542 }
]

const computedLatestPosts = computed(() => {
  const wpPosts = (latestPostsResponse?.value?.posts || []).map((p: any) => ({
    id: p.id || 0,
    title: stripHtml(p?.title || ''),
    slug: p?.slug || '',
    date: p?.date || p?.publish_at || getSSRSafeDate(),
    image: getSafeImage(p?.image || p?.featured_image, p?.title, p?.slug)
  }))

  if (wpPosts.length > 0) {
    return wpPosts.slice(0, 5)
  }
  return fallbackLatestPosts.slice(0, 5)
})

const computedPopularPosts = computed(() => {
  const wpPosts = (popularPostsResponse?.value?.posts || []).map((p: any) => ({
    id: p.id || 0,
    title: stripHtml(p?.title || ''),
    slug: p?.slug || '',
    date: p?.date || p?.publish_at || getSSRSafeDate(),
    image: getSafeImage(p?.image || p?.featured_image, p?.title, p?.slug),
    views: Math.floor(Math.random() * 1000) + 100 // Simulate views
  }))

  if (wpPosts.length > 0) {
    return wpPosts.slice(0, 5)
  }
  return fallbackPopularPosts.slice(0, 5)
})

// Track image load state
const loadedMap = ref<Record<string, boolean>>({})
function keyFor(post: any, idx: number, type: string) { 
  return `${type}-${post?.slug || post?.title || idx}` 
}
function onImgLoad(_e: Event, key: string) { 
  loadedMap.value[key] = true 
}
</script>

<template>
  <div class="space-y-4">
    <!-- Post Terbaru Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <div class="flex items-center space-x-2">
          <div class="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-sm font-bold text-white">
            Post Terbaru
          </h3>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-2">
        <NuxtLink
          v-for="(post, idx) in computedLatestPosts"
          :key="`latest-${post.slug || post.id || idx}`"
          :to="`/blog/${post.slug}`"
          prefetch
          class="group block p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
        >
          <div class="flex space-x-3">
            <!-- Image -->
            <div class="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
              <div
                class="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-gray-300/60 via-gray-200/50 to-gray-300/60 dark:from-gray-600/60 dark:via-gray-500/50 dark:to-gray-600/60 pointer-events-none"
                v-show="!loadedMap[keyFor(post, idx, 'latest')]"
                aria-hidden="true"
              />
              <img
                :src="getSafeImage(post.image, post.title, post.slug)"
                :alt="post.title"
                :loading="idx === 0 ? 'eager' : 'lazy'"
                decoding="async"
                width="48"
                height="48"
                @error="onImgError"
                @load="onImgLoad($event, keyFor(post, idx, 'latest'))"
                :class="['relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-200', loadedMap[keyFor(post, idx, 'latest')] ? 'opacity-100' : 'opacity-0']"
              />
              <!-- Number badge -->
              <div class="absolute -top-1 -left-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {{ idx + 1 }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-tight transition-colors duration-200">
                {{ post.title }}
              </h4>
              <div class="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <UIcon name="i-lucide-calendar" class="w-3 h-3 mr-1" />
                <span>{{ formatDateSafe(post.date) }}</span>
              </div>
            </div>

            <!-- Arrow icon -->
            <div class="flex-shrink-0 flex items-center">
              <UIcon name="i-lucide-chevron-right" class="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Footer -->
      <div class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink 
          to="/blog" 
          class="flex items-center justify-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-xs transition-colors duration-200 group"
        >
          <span>Lihat Semua</span>
          <UIcon name="i-lucide-arrow-right" class="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </div>
    </div>

    <!-- Post Populer Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
        <div class="flex items-center space-x-2">
          <div class="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-sm font-bold text-white">
            Post Populer
          </h3>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-2">
        <NuxtLink
          v-for="(post, idx) in computedPopularPosts"
          :key="`popular-${post.slug || post.id || idx}`"
          :to="`/blog/${post.slug}`"
          prefetch
          class="group block p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-900/20 dark:hover:to-purple-800/20 transition-all duration-200 hover:shadow-md"
        >
          <div class="flex space-x-3">
            <!-- Image -->
            <div class="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
              <div
                class="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-gray-300/60 via-gray-200/50 to-gray-300/60 dark:from-gray-600/60 dark:via-gray-500/50 dark:to-gray-600/60 pointer-events-none"
                v-show="!loadedMap[keyFor(post, idx, 'popular')]"
                aria-hidden="true"
              />
              <img
                :src="getSafeImage(post.image, post.title, post.slug)"
                :alt="post.title"
                :loading="idx === 0 ? 'eager' : 'lazy'"
                decoding="async"
                width="48"
                height="48"
                @error="onImgError"
                @load="onImgLoad($event, keyFor(post, idx, 'popular'))"
                @click="handleImageClick(getSafeImage(post.image, post.title, post.slug), post.title)"
                :class="['relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer', loadedMap[keyFor(post, idx, 'popular')] ? 'opacity-100' : 'opacity-0']"
              />
              <!-- Popular badge -->
              <div class="absolute -top-1 -left-1 w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-flame" class="w-2 h-2" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-1 mb-1">
                <div class="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors duration-200"></div>
                <h4 class="text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2 leading-tight transition-colors duration-200">
                  {{ post.title }}
                </h4>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3 mr-1" />
                  <span>{{ formatDateSafe(post.date) }}</span>
                </div>
                <div class="flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <UIcon name="i-lucide-eye" class="w-3 h-3 mr-1" />
                  <span>{{ post.views || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Arrow icon -->
            <div class="flex-shrink-0 flex items-center">
              <UIcon name="i-lucide-chevron-right" class="w-3 h-3 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Footer -->
      <div class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink 
          to="/blog" 
          class="flex items-center justify-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-xs transition-colors duration-200 group"
        >
          <span>Lihat Semua</span>
          <UIcon name="i-lucide-arrow-right" class="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </div>
    </div>

    <!-- Newsletter Subscription Box -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md border border-blue-200 dark:border-blue-800 overflow-hidden">
      <div class="p-4 text-center">
        <div class="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full mb-3 backdrop-blur-sm">
          <UIcon name="i-lucide-mail" class="w-5 h-5 text-white" />
        </div>
        <h3 class="text-sm font-bold text-white mb-1">Newsletter</h3>
        <p class="text-white/90 text-xs mb-3">Dapatkan update terbaru</p>
        <div class="flex space-x-1">
          <input 
            type="email" 
            placeholder="Email Anda" 
            class="flex-1 px-2 py-1.5 text-xs rounded-md bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50 backdrop-blur-sm"
          />
          <button class="px-2 py-1.5 bg-white text-blue-600 rounded-md font-medium hover:bg-white/90 transition-colors duration-200">
            <UIcon name="i-lucide-send" class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Compact hover effects */
.group:hover {
  transform: translateY(-1px);
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Professional spacing */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

/* Compact shadows */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Consistent border radius */
.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

/* Professional typography */
.font-bold {
  font-weight: 700;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .space-y-4 > * + * {
    margin-top: 0.75rem;
  }
  
  .space-y-2 > * + * {
    margin-top: 0.375rem;
  }
}
</style>