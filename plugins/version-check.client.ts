// plugins/version-check.client.ts
// Tampilkan popup keren saat ada versi baru dan paksa reload dengan cache baru.
// Client-only: cek /api/version berkala dan saat tab fokus.

import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Sistem popup & cache-update utama sekarang menggunakan:
  // - `useVersionCheck` + `UpdateNotificationPopup.vue` di `app/app.vue`
  // - `smart-cache-manager.client.ts` untuk clear cache super agresif
  //
  // Plugin lama ini sebelumnya membuat popup HTML sendiri (`#jp-update-modal`)
  // dan juga melakukan version check terpisah, yang bisa menyebabkan:
  // - Dua popup berbeda muncul
  // - Bentrok dengan loading screen
  // - Resiko popup muncul berkali‑kali
  //
  // Untuk mencegah bentrok dan duplikasi, kita nonaktifkan logic lama
  // dan hanya simpan sedikit informasi versi untuk sistem lain jika perlu.

  if ((window as any).__jpUpdateCheckerInitialized) {
    return
  }
  ;(window as any).__jpUpdateCheckerInitialized = true

  const current = String(useRuntimeConfig().public.buildId || '')

  try {
    // Tandai bahwa versi saat ini sudah diproses supaya popup lama
    // tidak pernah muncul lagi setelah reload.
    localStorage.setItem('jp-update-shown', current)
    // Hapus flag blocker lama supaya sistem baru bisa jalan normal.
    localStorage.removeItem('jp-popup-blocked')
  } catch {
    // Abaikan error storage
  }

  console.log('✅ Simplified version-check plugin aktif: gunakan UpdateNotificationPopup + useVersionCheck untuk popup reload 30 detik.')
})

