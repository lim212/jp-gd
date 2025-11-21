<script setup lang="ts">
import CanGetNotes from "~/components/Notes/CanGet.vue";
import HowToPurchaseNotes from "~/components/Notes/HowToPurchase.vue";
import TransactionRulesNotes from "~/components/Notes/TransactionRules.vue";
import AnswerComponent from "~/components/QuestionAnswerSection.vue";

const { data: page } = await useAsyncData('index', async () => {
  try {
    return await queryCollection('content').first()
  } catch {
    return null
  }
})

const title = ref('Jenis Transaksi');
const seoUrl = ref('https://jasapembayaran.com/transaksi');

useHead({
  link: [{ rel: 'canonical', href: seoUrl }],
});

useSeoMeta({
  title: `${title.value} | ${page.value?.title || 'Jasa Pembayaran Online'}`,
  ogTitle: `${title.value} | ${page.value?.title || 'Jasa Pembayaran Online'}`,
  twitterTitle: `${title.value} | ${page.value?.title || 'Jasa Pembayaran Online'}`,
  description: page.value?.description || 'Layanan pembayaran digital terpercaya.',
  ogDescription: page.value?.description || 'Layanan pembayaran digital terpercaya.',
  twitterDescription: page.value?.description || 'Layanan pembayaran digital terpercaya.',
  ogUrl: seoUrl,
});
</script>

<template>
  <div
    id="about-page"
    class="@container py-3 lg:pt-3 lg:pb-10 sm:gap-3 my-5"
  >
    <div class="text-center mb-8">
      <h1 class="font-exo text-3xl font-bold mb-4">
        Jenis <span class="text-blue-600">Transaksi</span>
      </h1>
      <div class="text-gray-600 max-w-3xl mx-auto">
        <MDC
          value="Kelola transaksi online Anda dengan mudah dan aman bersama JasaPembayaran.com. Kami menangani pembayaran internasional, top up dompet digital, hingga transfer lintas platform dengan proses transparan dan respons cepat."
        />
      </div>
    </div>

    <!-- Ringkasan langkah singkat agar mudah dipahami -->
    <section class="mt-4 sm:mt-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Langkah Transaksi Online</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-message-circle" class="size-6 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Konsultasi Cepat</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Hubungi kami via WhatsApp untuk verifikasi kebutuhan transaksi.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-file-text" class="size-6 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Detail & Nominal</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Kirimkan data tujuan/akun dan jumlah pembayaran.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-clock" class="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Konfirmasi & Estimasi</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Kami informasikan biaya, kurs (jika ada), dan estimasi proses.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-receipt" class="size-6 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Pembayaran & Bukti</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Lakukan pembayaran, kami proses dan kirimkan bukti transaksi.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="space-y-6 sm:space-y-8 md:space-y-10">
      <CanGetNotes />

      <HowToPurchaseNotes />

      <TransactionRulesNotes />
    </div>

    <ChatWhatsappComponent />

    <AnswerComponent />
  </div>
</template>

