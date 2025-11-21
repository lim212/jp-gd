<script setup lang="ts">
// SEO Meta
useHead({
  title: '500 - Kesalahan Server | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Terjadi kesalahan internal server. Tim kami sedang memperbaikinya dengan senyuman! 😊' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Enhanced 500 page configuration with fun elements
const errorConfig = {
  errorCode: '500',
  title: 'Server Sedang Bermasalah',
  subtitle: 'Tim teknisi kami sedang bekerja keras memperbaikinya! 🔧',
  description: 'Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. Tim kami telah diberitahu dan sedang memperbaiki masalah ini dengan penuh semangat!',
  icon: 'i-lucide-server-crash',
  primaryColor: 'red',
  secondaryColor: 'purple',
  accentColor: 'violet',
  mood: 'excited', // happy, sad, confused, excited, sleepy
  showProgress: true,
  showCountdown: false,
  showDetailedStatus: true,
  showDebugInfo: true,
  showRetryOptions: true
}
</script>

<template>
  <InteractiveErrorPage v-bind="errorConfig" />
</template>
