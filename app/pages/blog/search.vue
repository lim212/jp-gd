<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import { formatDateSafe } from '~/utils/date'

const route = useRoute()
const router = useRouter()

// SSR-safe date helper
const getSSRSafeDate = () => {
  if (typeof window === 'undefined') {
    return new Date().toISOString();
  }
  return new Date().toISOString();
};

const rawQ = computed(() => (route.query.q as string) || (route.query.search as string) || '')
const q = computed(() => (rawQ.value || '').replace(/\s+/g, ' ').trim().slice(0, 64))
const page = computed(() => Math.max(parseInt((route.query.page as string) || '1', 10) || 1, 1))
const lang = computed(() => (route.query.lang as string) || undefined)

// Redirect legacy ?search= to ?q=
if (route.query.search && !route.query.q) {
  const { search, ...rest } = route.query
  router.replace({ path: route.path, query: { ...rest, q: rawQ.value } })
}

// If no query, go back to /blog
if (!q.value) {
  router.replace({ path: '/blog' })
}

const title = computed(() => (q.value ? `Hasil pencarian untuk "${q.value}"` : 'Pencarian Blog'))
const canonicalUrl = computed(() => 'https://jasapembayaran.com/blog/search')

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [
    { name: 'robots', content: 'noindex, follow' },
  ]
})

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: q.value ? `Lihat hasil pencarian artikel blog untuk kata kunci "${q.value}".` : 'Pencarian artikel blog.',
  ogDescription: q.value ? `Lihat hasil pencarian artikel blog untuk kata kunci "${q.value}".` : 'Pencarian artikel blog.',
  ogUrl: canonicalUrl,
})

const { data, status, error } = await useAsyncData(
  'blog-search-page',
  async () => {
    try {
      const res: any = await $fetch('/api/blog/search', { params: { q: q.value, page: page.value, perPage: 8, lang: lang.value }, timeout: 10000, retry: 0 })
      if (res && Array.isArray(res.posts)) return res
      return { posts: [], totalPages: 1, totalPosts: 0, currentPage: 1 }
    } catch (e) {
      // Fallback seeds when API fails; do not throw to SSR
      const nowIso = getSSRSafeDate()
      const seeds = [
        { slug: 'jasa-paypal', title: 'Jasa PayPal: Solusi Pembayaran Online Aman' },
        { slug: 'jasa-bayar-paypal', title: 'Jasa Bayar PayPal Cepat & Terpercaya' },
        { slug: 'jasa-transfer-paypal', title: 'Jasa Transfer PayPal untuk Transaksi Global' },
        { slug: 'jasa-domain-namecheap', title: 'Jasa Domain Namecheap: Panduan & Tips' },
        { slug: 'jasa-namecheap', title: 'Jasa Namecheap: Keamanan Transaksi Online' },
        { slug: 'jasa-top-up-paypal', title: 'Jasa Top Up PayPal: Praktis & Aman' },
        { slug: 'jasa-verifikasi-paypal', title: 'Jasa Verifikasi PayPal: Mudah & Tepat' },
        { slug: 'jasa-domain-namesilo', title: 'Jasa Domain NameSilo: Pilihan Tepat' }
      ]
      const posts = seeds.map((s, i) => ({
        id: -5000 - i,
        slug: s.slug,
        title: s.title,
        date: nowIso,
        image: buildAiHeroUrl(s.title, s.slug),
        excerpt: s.title,
        categories: [],
        tags: []
      }))
      return { posts, totalPages: 1, totalPosts: posts.length, currentPage: 1, fallback: true }
    }
  },
  { watch: [q, page, lang] }
)

// Inform header search progress bar when results are ready
if (import.meta.client) {
  watch(() => status.value, (s) => {
    if (s !== 'pending' && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('blog-search:loaded'))
    }
  })
}

function stripHtml(html: string) {
  if (!html) return ''
  // SSR-safe: use regex fallback when not in client
  if (!import.meta.client || typeof document === 'undefined') {
    return (html || '').replace(/<[^>]*>/g, '')
  }
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function highlight(text: string, keyword: string) {
  const safe = (text || '').toString()
  const terms = (keyword || '').split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!terms.length) return safe
  const re = new RegExp(`(${terms.join('|')})`, 'gi')
  return safe.replace(re, '<mark class="px-0.5 rounded bg-amber-200/70 dark:bg-amber-400/20">$1</mark>')
}


function goToPage(newPage: number) {
  router.push({ path: '/blog/search', query: { q: q.value, page: newPage, lang: lang.value } })
}

const totalPages = computed(() => (data.value?.totalPages as number) || 1)

// Build condensed pagination items with ellipsis for large totals
const pageItems = computed<(number | string)[]>(() => {
  const total = totalPages.value
  const current = page.value
  const delta = 2 // neighbors on each side
  const items: (number | string)[] = []
  let last = 0
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      if (last && i - last > 1) items.push('...')
      items.push(i)
      last = i
    }
  }
  return items
})

function pageTo(p: number) {
  return { path: '/blog/search', query: { q: q.value, page: p, lang: lang.value } }
}

const FALLBACK_IMAGE = '/images/fallback-news.svg'

function buildAiHeroUrl(titleText?: string, slugText?: string) {
  const cleanTitle = stripHtml(titleText || '')
  const basePrompt = cleanTitle
    ? `${cleanTitle}, modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
    : `modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
  const encoded = encodeURIComponent(basePrompt)
  const seed = encodeURIComponent(String(slugText || cleanTitle || 'blog'))
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=800&height=450&nologo=true&enhance=true`
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

function getCardImage(p: any): string {
  try {
    const feat = normalizeImageUrlClient(p?.image)
    if (isValidImageUrl(feat) && !String(feat || '').includes('fallback-news.svg')) return feat
  } catch {}
  try {
    const ai = buildAiHeroUrl(String(p?.title || ''), String(p?.slug || ''))
    if (isValidImageUrl(ai)) return ai
  } catch {}
  return FALLBACK_IMAGE
}

function onCardImgError(e: Event) {
  const img = e.target as HTMLImageElement | null
  if (!img) return
  if (img.src.includes('fallback-news.svg')) return
  try {
    img.onerror = null
    img.src = FALLBACK_IMAGE
  } catch {}
}
// Lightweight touch glow directive (local)
const vTouchGlow = {
  mounted(el: HTMLElement) {
    const add = () => el.classList.add('ring-2','ring-blue-400/40','shadow-lg')
    const remove = () => el.classList.remove('ring-2','ring-blue-400/40','shadow-lg')
    const onDown = () => { add(); if (typeof window !== 'undefined') window.setTimeout(remove, 220) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { add(); if (typeof window !== 'undefined') window.setTimeout(remove, 220) } }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('keydown', onKey)
    ;(el as any)._glowHandlers = { onDown, onKey }
  },
  unmounted(el: HTMLElement) {
    const h = (el as any)._glowHandlers
    if (h) {
      el.removeEventListener('pointerdown', h.onDown)
      el.removeEventListener('keydown', h.onKey)
    }
  }
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
</style>

<template>
  <div
    id="blog-search-page"
    class="@container relative py-6 px-3 sm:px-4 lg:pt-6 lg:pb-14 sm:gap-5 bg-gradient-to-br from-white to-blue-50 dark:from-elevated/80 dark:to-blue-950/20 shadow-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden rounded-2xl"
  >
    <div class="relative">
      <UiTitleBase>
        <NuxtLink
          to="/"
          aria-label="Kembali ke Home"
      title="Kembali ke Home"
          class="group absolute top-2 left-2 sm:top-3 sm:left-3 inline-flex items-center justify-center size-10 rounded-full border border-blue-100/60 dark:border-blue-900/50 bg-white/90 dark:bg-gray-800/80 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/70"
        >
          <UIcon name="i-lucide-home" class="size-5" />
          <span class="sr-only">Home</span>
        </NuxtLink>
        <NuxtLink
          to="/"
          aria-label="Tutup dan kembali ke Home"
          title="Tutup dan kembali ke Home"
          class="group absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center justify-center size-10 rounded-full border border-blue-100/60 dark:border-blue-900/50 bg-white/90 dark:bg-gray-800/80 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/70"
        >
          <UIcon name="i-lucide-x" class="size-5" />
          <span class="sr-only">Tutup</span>
        </NuxtLink>
        <div class="flex items-center gap-3 justify-center">
          <UIcon name="i-lucide-search" class="text-ui-primary size-8 md:size-10" />
          <span class="text-ui-primary font-bold relative text-lg md:text-xl">
            {{ title }}
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-ui-primary rounded-full"></span>
          </span>
        </div>
      </UiTitleBase>
    </div>

    <div class="max-w-3xl mx-auto w-full">
      <div v-if="status === 'pending'" class="space-y-4">
        <USkeleton class="w-full h-24 rounded-xl" />
        <USkeleton class="w-full h-24 rounded-xl" />
        <USkeleton class="w-full h-24 rounded-xl" />
      </div>

      <div v-else-if="error || data?.error" class="text-center bg-white dark:bg-gray-800/90 p-6 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-900/30">
        <UIcon name="i-lucide-info" class="text-blue-500 size-12 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Pencarian tidak tersedia</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Terjadi kendala pada layanan pencarian. Silakan buka halaman blog untuk melihat artikel terbaru.</p>
        <NuxtLink to="/blog" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Buka Blog</NuxtLink>
      </div>

      <div v-else-if="!data || !data.posts || !data.posts.length" class="text-center bg-white dark:bg-gray-800/90 p-6 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-900/30">
        <UIcon name="i-lucide-search" class="text-blue-500 size-12 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Tidak ada hasil</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Coba gunakan kata kunci lain, atau lihat kategori populer di blog kami.</p>
        <NuxtLink to="/blog" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Lihat Blog</NuxtLink>
      </div>

      <div v-else class="blog-search-results">
        <div
          v-for="post in data.posts"
          :key="post.slug"
          class="relative overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800/90 border-2 border-blue-100 dark:border-blue-900/30"
        >
          <NuxtLink v-touch-glow :to="`/blog/${post.slug}`" class="blog-search-card p-3 sm:p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60">
            <img
              :src="getCardImage(post)"
              :alt="post.title"
              class="blog-search-image"
              loading="lazy"
              decoding="async"
              @error="onCardImgError"
            />
            <div class="blog-search-content">
              <h3 class="blog-search-title" v-html="highlight(String(post.title || '').replace(/<[^>]*>/g, ''), q)"></h3>
              <div class="text-xs mt-1 text-gray-600 dark:text-gray-300">{{ formatDateSafe(post.date) }}</div>
              <p class="blog-search-excerpt line-clamp-2" v-html="highlight(stripHtml(post.excerpt).slice(0, 180) + '…', q)"></p>
              <div class="blog-search-tags">
                <span v-for="cat in (post.categories || []).slice(0, 2)" :key="`cat-`+cat" class="blog-search-tag bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200/50 dark:border-blue-800/50" v-html="highlight(cat, q)"></span>
                <span v-for="tag in (post.tags || []).slice(0, 3)" :key="`tag-`+tag" class="blog-search-tag bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 border-amber-200/50 dark:border-amber-800/50" v-html="highlight(tag, q)"></span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="pt-4">
          <nav class="flex items-center justify-center gap-1 sm:gap-2" role="navigation" aria-label="Pagination">
            <button
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-blue-100/60 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              :disabled="page <= 1"
              @click="goToPage(page - 1)"
            >
              <UIcon name="i-lucide-chevron-left" class="size-4" />
              <span class="hidden sm:inline">Sebelumnya</span>
            </button>

            <template v-for="(item, idx) in pageItems" :key="idx">
              <span v-if="item === '...'" class="px-2 select-none text-gray-500 dark:text-gray-400">…</span>
              <NuxtLink
                v-else
                :to="pageTo(item as number)"
                :aria-current="page === (item as number) ? 'page' : undefined"
                class="inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-xl border text-sm transition-colors"
                :class="[
                  page === (item as number)
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : 'bg-white dark:bg-gray-800 border-blue-100/60 dark:border-blue-900/50 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                ]"
              >
                {{ item }}
              </NuxtLink>
            </template>

            <button
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-blue-100/60 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              :disabled="page >= totalPages"
              @click="goToPage(page + 1)"
            >
              <span class="hidden sm:inline">Berikutnya</span>
              <UIcon name="i-lucide-chevron-right" class="size-4" />
            </button>
          </nav>
          <div class="mt-2 text-center text-xs text-gray-600 dark:text-gray-300">Halaman {{ page }} dari {{ totalPages }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

