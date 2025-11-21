<script setup lang="ts">
import BlogSidebar from '~/app/components/LazyBlogSidebar.vue'

const route = useRoute()
const slug = route.params.slug as string

// Fetch blog post data
const { data: blogPost, error } = await useFetch(`/api/blog/${slug}`, {
  key: `blog-${slug}`,
  server: true
})

// Redirect if blog post not found
if (error.value || !blogPost.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog post not found'
  })
}

const FALLBACK_IMAGE = '/images/fallback-news.svg'

function stripHtml(t: string) {
  return (t || '').replace(/<[^>]*>/g, '').trim()
}

function buildAiHeroUrl(titleText?: string, slugText?: string) {
  const cleanTitle = stripHtml(titleText || '')
  const basePrompt = cleanTitle
    ? `${cleanTitle}, modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
    : `modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
  const encoded = encodeURIComponent(basePrompt)
  const seed = encodeURIComponent(String(slugText || cleanTitle || 'blog'))
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true`
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

function getSafeImage(candidate?: string, titleText?: string, slugText?: string) {
  if (isValidImageUrl(candidate)) return String(candidate)
  const ai = buildAiHeroUrl(titleText, slugText)
  return isValidImageUrl(ai) ? ai : FALLBACK_IMAGE
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
      month: 'long', 
      year: 'numeric' 
    })
  } catch {
    return ''
  }
}

// Format time function
function formatTimeSafe(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  } catch {
    return ''
  }
}

const blogImage = computed(() => getSafeImage(blogPost.value?.image || blogPost.value?.featured_image, blogPost.value?.title, slug))

// SEO Meta
useSeoMeta({
  title: blogPost.value?.title || 'Blog Post',
  ogTitle: blogPost.value?.title || 'Blog Post',
  twitterTitle: blogPost.value?.title || 'Blog Post',
  description: stripHtml(blogPost.value?.excerpt || blogPost.value?.content || '')?.substring(0, 160) || 'Baca artikel lengkap di JasaPembayaran.com',
  ogDescription: stripHtml(blogPost.value?.excerpt || blogPost.value?.content || '')?.substring(0, 160) || 'Baca artikel lengkap di JasaPembayaran.com',
  twitterDescription: stripHtml(blogPost.value?.excerpt || blogPost.value?.content || '')?.substring(0, 160) || 'Baca artikel lengkap di JasaPembayaran.com',
  ogImage: blogImage.value,
  twitterImage: blogImage.value,
})

useHead({
  meta: [
    { name: 'keywords', content: 'blog, artikel, pembayaran online, PAYTECH, tips keamanan, teknologi pembayaran' },
    { property: 'article:published_time', content: blogPost.value?.date || blogPost.value?.publish_at },
    { property: 'article:author', content: 'JasaPembayaran.com' },
    { property: 'article:section', content: 'Blog' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Breadcrumb -->
            <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</NuxtLink>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              <NuxtLink to="/blog" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</NuxtLink>
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              <span class="text-gray-900 dark:text-gray-100 font-medium">{{ blogPost?.title }}</span>
            </nav>

            <!-- Blog Post Card -->
            <article class="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border-2 border-blue-100 dark:border-blue-900/30 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <!-- Header dengan gradient dan garis -->
              <header class="relative bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-blue-600/90"></div>
                <div class="relative">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <UIcon name="i-lucide-newspaper" class="w-6 h-6 text-white" />
                    </div>
                    <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {{ blogPost?.title }}
                    </h1>
                  </div>
                  
                  <!-- Meta information -->
                  <div class="flex items-center space-x-6 text-white/90 text-sm">
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                      <span>{{ formatDateSafe(blogPost?.date || blogPost?.publish_at) }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-clock" class="w-4 h-4" />
                      <span>{{ formatTimeSafe(blogPost?.date || blogPost?.publish_at) }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-lucide-user" class="w-4 h-4" />
                      <span>JasaPembayaran.com</span>
                    </div>
                  </div>
                </div>
                <!-- Garis dekoratif -->
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </header>

              <!-- Featured Image -->
              <div class="relative">
                <img
                  :src="blogImage"
                  :alt="blogPost?.title"
                  class="w-full h-64 md:h-96 object-cover"
                  loading="eager"
                  decoding="async"
                  @error="onImgError"
                />
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent"></div>
              </div>

              <!-- Content -->
              <div class="p-6 md:p-8">
                <div class="prose prose-lg max-w-none dark:prose-invert">
                  <div v-html="blogPost?.content" />
                </div>
              </div>

              <!-- Footer -->
              <footer class="px-6 md:px-8 py-6 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <UIcon name="i-lucide-tag" class="w-4 h-4" />
                      <span>Blog</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <UIcon name="i-lucide-share-2" class="w-4 h-4" />
                      <span>Bagikan</span>
                    </div>
                  </div>
                  
                  <NuxtLink 
                    to="/blog" 
                    class="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200 group/link"
                  >
                    <UIcon name="i-lucide-arrow-left" class="w-4 h-4 group-hover/link:-translate-x-1 transition-transform duration-200" />
                    <span>Kembali ke Blog</span>
                  </NuxtLink>
                </div>
              </footer>
            </article>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-8">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom prose styles */
.prose {
  @apply text-gray-700 dark:text-gray-300;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply text-gray-900 dark:text-gray-100 font-bold;
}

.prose h2 {
  @apply text-xl border-b border-gray-200 dark:border-gray-700 pb-2 mb-4;
}

.prose h3 {
  @apply text-lg mb-3;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul,
.prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm;
}

.prose pre {
  @apply bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto my-4;
}

.prose img {
  @apply rounded-lg shadow-lg my-4;
}

.prose a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline;
}
</style>
