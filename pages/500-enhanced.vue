<script setup lang="ts">
// SEO Meta
useHead({
  title: '500 - Kesalahan Server | JasaPembayaran.com',
  meta: [
    { name: 'description', content: 'Terjadi kesalahan internal server. Tim kami sedang memperbaikinya. Silakan coba lagi nanti.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Error page configuration
const errorConfig = {
  errorCode: '500',
  title: 'Server Sedang Bermasalah',
  subtitle: 'Tim teknisi kami sedang bekerja keras memperbaikinya! 🔧',
  description: 'Terjadi kesalahan internal server. Jangan khawatir, ini bukan kesalahan Anda. Tim kami telah diberitahu dan sedang memperbaiki masalah ini.',
  icon: 'i-lucide-server-crash',
  primaryColor: 'red',
  secondaryColor: 'purple',
  accentColor: 'violet',
  showProgress: true,
  progressSteps: [
    'Memeriksa sistem...',
    'Menganalisis error...',
    'Memperbaiki kode...',
    'Menguji solusi...',
    'Hampir selesai...'
  ],
  showCountdown: false,
  customActions: [
    {
      label: 'Coba Lagi',
      action: 'refresh',
      icon: 'i-lucide-refresh-cw',
      color: 'primary'
    },
    {
      label: 'Hubungi Support',
      action: 'whatsapp',
      icon: 'i-lucide-message-circle',
      color: 'green'
    }
  ]
}
</script>

<template>
  <ErrorPageLayout v-bind="errorConfig" />
</template>
