<script setup lang="ts">
const route = useRoute()
const slug = ref<string>(String(route.params.slug || ''))
const seoUrl = computed(() => `https://jasapembayaran.com/login/${slug.value}`)

const fetchLogin = async () => {
  if (!slug.value) return null
  try {
    const res = await $fetch<{ slug: string; title: string; excerpt: string; html: string; image?: string; generatedAt?: string }>(
      `/api/login/${encodeURIComponent(slug.value)}`,
      { timeout: 10000 }
    )
    return { data: res }
  } catch (e) {
    console.error('Login slug fetch failed:', e)
    return { data: null }
  }
}

const { data: loginData, refresh } = await useAsyncData(
  () => `login-${slug.value}`,
  fetchLogin,
  { watch: [slug] }
)

if (!loginData.value || !loginData.value.data) {
  loginData.value = {
    data: {
      slug: slug.value,
      title: 'Login Layanan',
      excerpt: 'Masuk untuk mengelola transaksi Anda.',
      html: '<p>Masuk untuk melanjutkan.</p>'
    }
  }
}

const title = computed(() => loginData.value?.data?.title || 'Login')
const description = computed(() => loginData.value?.data?.excerpt || 'Login aman dan mudah')
const image = computed(() => loginData.value?.data?.image)

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogUrl: seoUrl,
  ogImage: image,
  ogImageAlt: title,
  twitterImage: image,
})

useHead({ link: [{ rel: 'canonical', href: seoUrl.value }] })

watch(() => route.params.slug, async (v) => {
  slug.value = String(v || '')
  await refresh()
})
</script>

<template>
  <div class="px-2 pt-2 pb-6 lg:px-0 flex flex-col gap-y-4">
    <section class="@container py-3 lg:pt-3 lg:pb-6 sm:gap-3 bg-white dark:bg-elevated/50 ring ring-default rounded-lg overflow-hidden">
      <div class="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800/50 overflow-hidden">
        <img
          v-if="loginData?.data?.image"
          :src="loginData.data.image"
          :alt="loginData.data.title"
          class="w-full h-full object-cover"
          decoding="async"
          referrerpolicy="no-referrer"
          loading="eager"
        />
      </div>
      <div class="p-4 md:p-6">
        <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ loginData?.data?.title }}</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ loginData?.data?.excerpt }}</p>
        <div class="prose dark:prose-invert max-w-none" v-html="loginData?.data?.html" />
      </div>
    </section>
  </div>
</template>
