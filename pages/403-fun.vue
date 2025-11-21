<script setup lang="ts">
// SEO Meta
useHead({
  title: '403 - Akses Dilarang | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Akses ke halaman ini dilarang. Mari kita bantu Anda menemukan akses yang tepat! 🔒' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Enhanced 403 page configuration with fun elements
const errorConfig = {
  errorCode: '403',
  title: 'Akses Dilarang',
  subtitle: 'Halaman ini eksklusif dan membutuhkan izin khusus! 🔒',
  description: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Mari kita bantu Anda menemukan akses yang tepat!',
  icon: 'i-lucide-shield-x',
  primaryColor: 'purple',
  secondaryColor: 'red',
  accentColor: 'violet',
  mood: 'sad', // happy, sad, confused, excited, sleepy
  showProgress: false,
  showCountdown: false,
  showDetailedStatus: false,
  showDebugInfo: true,
  showRetryOptions: true
}
</script>

<template>
  <InteractiveErrorPage v-bind="errorConfig" />
</template>
