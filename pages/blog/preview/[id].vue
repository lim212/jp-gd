// pages/blog/preview/[id].vue
<script setup lang="ts">
const route = useRoute()
const { data: preview, error } = await useFetch(
  `/api/blog/preview/${route.params.id}`
)

// Redirect if preview not found
if (error.value) {
  navigateTo('/blog')
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

const previewImage = computed(() => getSafeImage(preview.value?.image, preview.value?.title, String(route.params.id)))
</script>

<template>
  <div v-if="preview" class="container mx-auto px-4 py-8">
    <UAlert
      type="info"
      title="Preview Mode"
      class="mb-8"
    >
      This is a preview of the blog post. The content is temporary and will expire in 24 hours.
    </UAlert>

    <div class="max-w-4xl mx-auto">
      <img
        :src="previewImage"
        :alt="preview?.title || 'Preview Post'"
        class="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
        loading="lazy"
        decoding="async"
        @error="onImgError"
      />

      <h1 class="text-4xl font-bold mb-4">{{ preview.title }}</h1>

      <div class="prose prose-lg max-w-none">
        <div v-html="preview.content" />
      </div>

      <div class="mt-8 flex gap-4">
        <UButton
          color="primary"
          @click="publishPost"
        >
          Publish Post
        </UButton>

        <UButton
          color="gray"
          variant="soft"
          @click="() => navigateTo('/blog')"
        >
          Cancel
        </UButton>
      </div>
    </div>
  </div>
</template>
