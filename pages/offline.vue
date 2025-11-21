<template>
  <div class="min-h-[60vh] w-full flex items-center justify-center p-6 text-center">
    <div>
      <h1 class="text-2xl md:text-3xl font-extrabold mb-3">Anda Sedang Offline</h1>
      <p class="text-gray-700 dark:text-gray-200 mb-5 max-w-[38rem]">
        Koneksi internet tidak tersedia. Beberapa halaman mungkin tidak dimuat sepenuhnya.
        Coba muat ulang ketika koneksi sudah kembali.
      </p>
      <div class="flex items-center justify-center gap-3">
        <button class="px-4 py-2 rounded-md bg-purple-500 text-white font-semibold shadow hover:shadow-md active:shadow w-auto" @click="reload">
          Muat Ulang
        </button>
        <NuxtLink to="/" class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function reload() {
  try { 
    if (typeof window !== 'undefined') {
      window.location.reload() 
    }
  } catch {}
}
</script>

