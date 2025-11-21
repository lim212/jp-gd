<template>
  <UPage>
    <UPageSection
      id="transaction-proof"
      variant="subtle"
      class="@container"
      :ui="{
        container:
          'pt-6 sm:pt-8 pb-6 sm:pb-8 px-3 sm:px-6 bg-gradient-to-br from-white to-purple-50 dark:from-elevated/80 dark:to-purple-900/10 shadow-md md:shadow-xl border border-purple-200 md:border-2 dark:border-purple-800/40 overflow-hidden rounded-2xl'
      }"
    >
      <template #title>
        <UiTitleBase>
          <div class="flex items-center gap-2 md:gap-3 justify-center">
            <UIcon name="i-lucide-receipt-text" class="text-purple-600 dark:text-purple-400 size-7 md:size-9" />
            <span class="text-purple-700 dark:text-purple-300 font-extrabold tracking-wide">BUKTI TRANSAKSI</span>
            <UIcon name="i-lucide-shield-check" class="text-purple-600 dark:text-purple-400 size-7 md:size-9" />
          </div>
        </UiTitleBase>
      </template>

      <template #description>
        <div class="max-w-2xl mx-auto text-center px-2">
          <p class="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed">
            Unggah bukti transaksi pembayaran Anda melalui tautan resmi berikut. Pastikan informasi yang Anda kirimkan jelas agar proses verifikasi lebih cepat.
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mt-2 rounded-full opacity-80 hidden md:block"></div>
        </div>
      </template>

      <div class="mt-4 sm:mt-6 flex justify-center">
        <NuxtLink
          to="https://upload.jasapembayaran.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <UIcon name="i-lucide-upload-cloud" class="size-5" />
          <span>Upload Sekarang</span>
        </NuxtLink>
      </div>

      <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white/80 dark:bg-gray-900/60 ring-1 ring-purple-200 dark:ring-purple-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-300 font-semibold">
            <UIcon name="i-lucide-info" class="size-5" />
            <span>Catatan</span>
          </div>
          <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>Format file disarankan: JPG, PNG, atau PDF.</li>
            <li>Pastikan nomor transaksi dan nominal terlihat jelas.</li>
            <li>Gunakan tautan resmi di atas untuk keamanan data.</li>
          </ul>
        </div>
        <div class="bg-white/80 dark:bg-gray-900/60 ring-1 ring-purple-200 dark:ring-purple-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-300 font-semibold">
            <UIcon name="i-lucide-headset" class="size-5" />
            <span>Bantuan</span>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Jika mengalami kendala, hubungi kami melalui WhatsApp atau LiveChat. Tim kami siap membantu Anda.
          </p>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>


