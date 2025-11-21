<script setup lang="ts">
// SEO Meta
useHead({
  title: '404 - Halaman Tidak Ditemukan | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Halaman yang Anda cari tidak ditemukan. Mari kita bantu Anda menemukan apa yang Anda butuhkan dengan senyuman! 😊' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Enhanced 404 page configuration with fun elements
const errorConfig = {
  errorCode: '404',
  title: 'Halaman Tidak Ditemukan',
  subtitle: 'Sepertinya halaman yang Anda cari sudah pindah atau tidak ada! 🔍',
  description: 'Jangan khawatir, ini bukan kesalahan Anda. Mari kita bantu Anda menemukan apa yang Anda butuhkan dengan penuh semangat!',
  icon: 'i-lucide-search-x',
  primaryColor: 'blue',
  secondaryColor: 'purple',
  accentColor: 'pink',
  mood: 'confused', // happy, sad, confused, excited, sleepy
  showProgress: false,
  showCountdown: true,
  countdownTime: 30,
  showDetailedStatus: false,
  showDebugInfo: true,
  showRetryOptions: true
}
</script>

<template>
  <InteractiveErrorPage v-bind="errorConfig" />
</template>
