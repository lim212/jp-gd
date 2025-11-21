<script setup lang="ts">
import BlogListComponent from "../../components/BlogList.vue";
import { seoKeywords } from '../../utils/seoKeywords'

// Avoid runtime errors from missing content helpers; keep page meta local
const page = ref<{ title?: string; description?: string } | null>(null)

const title = ref('Blog')
const seoUrl = computed(() => 'https://jasapembayaran.com/blog')

useHead({
  link: [{ rel: 'canonical', href: seoUrl.value, key: 'canonical' }],
  meta: [
    { name: 'keywords', content: seoKeywords.join(', ') }
  ]
})

useSeoMeta({
  title: computed(() => `${title.value} | ${page.value?.title || 'Jasa Pembayaran Online'}`),
  ogTitle: computed(() => `${title.value} | ${page.value?.title || 'Jasa Pembayaran Online'}`),
  twitterTitle: computed(() => `${title.value} | ${page.value?.title || 'Jasa Pembayaran Online'}`),
  description: computed(() => page.value?.description || 'Layanan pembayaran digital terpercaya.'),
  ogDescription: computed(() => page.value?.description || 'Layanan pembayaran digital terpercaya.'),
  twitterDescription: computed(() => page.value?.description || 'Layanan pembayaran digital terpercaya.'),
  ogUrl: computed(() => seoUrl.value),
})
</script>

<template>
  <div
    id="blog-page"
    class="@container pt-6 pb-3 sm:pt-8 sm:pb-4 lg:pt-12 lg:pb-10"
  >
    <BlogListComponent />
    <ClientOnly>
      <LazySeoKeywords class="mt-4" />
    </ClientOnly>
  </div>
</template>

