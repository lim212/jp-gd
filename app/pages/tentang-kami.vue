<script setup lang="ts">
import AboutSection from "~/components/Home/About.vue";
import AnswerComponent from "~/components/QuestionAnswerSection.vue";

const { data: page } = await useAsyncData('index', async () => {
  try {
    return await queryCollection('content').first()
  } catch {
    return null
  }
})

const title = ref('Tentang Kami - Jasa PayPal Terpercaya');
const seoUrl = ref('https://jasapembayaran.com/tentang-kami');

useHead({
  link: [{ rel: 'canonical', href: seoUrl }],
  meta: [
    { name: 'keywords', content: 'jasa paypal, jasa paypal terpercaya, jasa bayar paypal, jasa top up paypal, jasa transfer paypal, jasa isi saldo paypal, jasa kirim paypal, jasa deposit paypal, jasa perantara paypal, jasa pembayaran paypal, tentang kami, jasapembayaran.com' }
  ]
});

useSeoMeta({
  title: `${title.value} | JasaPembayaran.com`,
  ogTitle: `${title.value} | JasaPembayaran.com`,
  twitterTitle: `${title.value} | JasaPembayaran.com`,
  description: 'Tentang JasaPembayaran.com - Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.',
  ogDescription: 'Tentang JasaPembayaran.com - Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.',
  twitterDescription: 'Tentang JasaPembayaran.com - Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.',
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
        Tentang <span class="text-blue-600">Kami</span>
      </h1>
      <div class="text-gray-600 max-w-3xl mx-auto">
        <MDC
          value="JasaPembayaran.com menyediakan jasa PayPal terpercaya dan layanan pembayaran digital untuk kebutuhan pribadi maupun bisnis. Kami mengedepankan keamanan, kecepatan, dan transparansi dalam setiap transaksi jasa PayPal."
        />
      </div>
    </div>

    <!-- Keunggulan singkat -->
    <section class="mt-4 sm:mt-6">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Mengapa Memilih Kami</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-shield-check" class="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Aman & Terpercaya</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Proses sesuai prosedur, data terjaga, dan bukti legalitas usaha tersedia.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-bolt" class="size-6 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Cepat & Efisien</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Respons cepat dan alur transaksi yang sederhana untuk menghemat waktu Anda.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50">
          <UIcon name="i-lucide-headset" class="size-6 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Dukungan Profesional</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Tim berpengalaman siap membantu dari konsultasi hingga penyelesaian.</p>
          </div>
        </div>
      </div>
    </section>

    <AboutSection />


    <AnswerComponent />
  </div>
</template>

