<script setup lang="ts">
// Import the new UI components
import UiTitleFooterMenu from './Ui/UiTitleFooterMenu.vue';
import UiLinkFooterMenu from './Ui/UiLinkFooterMenu.vue';
import UiLinkFooterMenuCategory from './Ui/UiLinkFooterMenuCategory.vue';
import LogoPro from './LogoPro.vue';

const _columns = [
  {
    label: "Info Kontak",
    children: [
      {
        label:
          "Greenlake City Boulevard, Rukan GreatWall Blok A No. 38 Cipondoh, Kota Tangerang Banten, 15146 Phone: +6289 8888 8250",
        icon: "i-lucide-map-pin",
        to: "https://maps.app.goo.gl/NWGLye92ttU87vLs8",
      },
      {
        label: "+6289 8888 8250",
        icon: "i-lucide-phone-call",
        to: "https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com,%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0",
      },
    ],
  },
  {
    label: "Navigasi",
    children: [
      {
        label: "Home",
        icon: "i-lucide-minus",
        to: "/",
      },
      {
        label: "Tentang Kami",
        icon: "i-lucide-minus",
        to: "/tentang-kami",
      },
      {
        label: "Transaksi Online",
        icon: "i-lucide-minus",
        to: "/transaksi",
      },
      {
        label: "Bukti Transaksi",
        to: "https://upload.jasapembayaran.com",
        icon: "i-lucide-minus",
        target: "_blank",
      },
      {
        label: "Testimonial",
        to: "https://testimonial.jasapembayaran.id",
        icon: "i-lucide-minus",
        target: "_blank",
      },
    ],
  },
  {
    label: "Label",
    children: [
      {
        label: "Paypal",
        to: "https://blog.jasapembayaran.com/tag/paypal",
        icon: "i-lucide-hash",
        target: "_blank",
      },
      {
        label: "JasaBayarPaypal",
        to: "https://blog.jasapembayaran.com/tag/jasa-bayar-paypal",
        icon: "i-lucide-hash",
        target: "_blank",
      },
      {
        label: "TopUpPaypal",
        to: "https://blog.jasapembayaran.com/tag/top-up-paypal",
        icon: "i-lucide-hash",
        target: "_blank",
      },
      {
        label: "JasaPembayaran",
        to: "https://blog.jasapembayaran.com/tag/jasa-pembayaran",
        icon: "i-lucide-hash",
        target: "_blank",
      },
      {
        label: "ZoomMeeting",
        to: "https://blog.jasapembayaran.com/tag/zoom-meeting",
        icon: "i-lucide-hash",
        target: "_blank",
      },
    ],
  },
];

// Footer realtime clock state (Jakarta time)
const footerNow = ref(typeof window !== 'undefined' ? new Date() : new Date());
let footerClockInterval: ReturnType<typeof setInterval> | null = null;

// Current year for copyright (SSR safe)
const currentYear = computed(() => {
  if (typeof window === 'undefined') {
    return new Date().getFullYear();
  }
  return footerNow.value.getFullYear();
});

const formatDay = () => {
  const now = footerNow.value;
  const jakartaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  return jakartaNow.toLocaleDateString("id-ID", {
    weekday: "long",
    timeZone: 'Asia/Jakarta'
  });
};

const formatDate = () => {
  const now = footerNow.value;
  const jakartaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  return jakartaNow.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: 'Asia/Jakarta'
  });
};

const formatTime = () => {
  const now = footerNow.value;
  // Waktu Jakarta (WIB)
  const jakartaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  // Format jam:menit dan detik terpisah sesuai permintaan, contoh: "00:32 50 detik"
  const hh = jakartaNow.getHours().toString().padStart(2, '0');
  const mm = jakartaNow.getMinutes().toString().padStart(2, '0');
  const ss = jakartaNow.getSeconds().toString().padStart(2, '0');
  const timeOnly = `${hh}:${mm} ${ss} detik`;

  // Tampilkan label zona waktu tetap untuk WIB
  const timezone = 'GMT+7 (WIB)';

  return {
    time: timeOnly,
    timezone
  };
};

// Navigation links (max 6)
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Jasa PayPal Terpercaya', to: '/tentang-kami' },
  { label: 'Transaksi Online', to: '/transaksi' },
  { label: 'Bukti Transaksi', to: 'https://upload.jasapembayaran.com' },
  { label: 'Testimonial', to: 'https://testimonial.jasapembayaran.id' },
  { label: 'Blog', to: '/blog' }
];

// Label tags (max 6)
const labelTags = [
  { label: 'Jasa PayPal', to: 'https://blog.jasapembayaran.com/tag/jasa-paypal' },
  { label: 'Jasa PayPal Terpercaya', to: 'https://blog.jasapembayaran.com/tag/jasa-paypal-terpercaya' },
  { label: 'Jasa Bayar PayPal', to: 'https://blog.jasapembayaran.com/tag/jasa-bayar-paypal' },
  { label: 'Jasa Top Up PayPal', to: 'https://blog.jasapembayaran.com/tag/jasa-top-up-paypal' },
  { label: 'Jasa Transfer PayPal', to: 'https://blog.jasapembayaran.com/tag/jasa-transfer-paypal' },
  { label: 'Bitcoin', to: 'https://blog.jasapembayaran.com/tag/bitcoin' }
];

// Latest Articles
const latestArticles = [
  { 
    title: 'Cara Mudah Top Up PayPal 2024', 
    to: '/blog/cara-mudah-top-up-paypal-2024',
    date: '10 Okt 2024',
    icon: 'i-lucide-newspaper'
  },
  { 
    title: 'Panduan Lengkap Transfer Bitcoin', 
    to: '/blog/panduan-lengkap-transfer-bitcoin',
    date: '8 Okt 2024',
    icon: 'i-lucide-bitcoin'
  },
  { 
    title: 'Keamanan Transaksi PayPal', 
    to: '/blog/keamanan-transaksi-paypal',
    date: '5 Okt 2024',
    icon: 'i-lucide-shield-check'
  },
  { 
    title: 'Tips Menggunakan Crypto Payment', 
    to: '/blog/tips-menggunakan-crypto-payment',
    date: '2 Okt 2024',
    icon: 'i-lucide-coins'
  }
];

// Popular Articles
const popularArticles = [
  { 
    title: 'Jasa PayPal Terpercaya Indonesia', 
    to: '/blog/jasa-paypal-terpercaya-indonesia',
    views: '12.5k',
    icon: 'i-lucide-trending-up'
  },
  { 
    title: 'Cara Withdraw PayPal ke Bank Lokal', 
    to: '/blog/cara-withdraw-paypal-ke-bank-lokal',
    views: '9.8k',
    icon: 'i-lucide-banknote'
  },
  { 
    title: 'Perbedaan PayPal Business vs Personal', 
    to: '/blog/perbedaan-paypal-business-vs-personal',
    views: '8.2k',
    icon: 'i-lucide-git-compare'
  },
  { 
    title: 'Solusi Masalah PayPal Limited', 
    to: '/blog/solusi-masalah-paypal-limited',
    views: '7.6k',
    icon: 'i-lucide-alert-circle'
  }
];

// Helper to detect external links
const isExternal = (url: string) => /^https?:\/\//i.test(url);

onMounted(() => {
  if (typeof window !== 'undefined') {
    // Start footer clock interval (updates every second)
    footerClockInterval = setInterval(() => {
      footerNow.value = new Date();
    }, 1000);
  }
});

onBeforeUnmount(() => {
  if (footerClockInterval !== null) {
    clearInterval(footerClockInterval);
  }
});
</script>

<template>
  <!-- SUPER KEREN FOOTER - OPTIMIZED FOR LIGHT MODE -->
  <footer class="footer-super-keren bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 text-slate-900 dark:text-gray-100 relative overflow-hidden global-footer">
    <!-- Clean Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Subtle floating orbs for light mode -->
      <div class="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 dark:from-blue-400/20 dark:to-cyan-400/20 rounded-full animate-pulse"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 dark:from-indigo-400/20 dark:to-purple-400/20 rounded-full animate-bounce"></div>
      <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-100/30 to-blue-100/30 dark:from-cyan-400/20 dark:to-blue-400/20 rounded-full animate-pulse"></div>
      
      <!-- Clean grid pattern overlay -->
      <div class="absolute inset-0 opacity-10 dark:opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.2) 1px, transparent 0); background-size: 30px 30px;"></div>
      </div>
    </div>

    <!-- Clean Accent Line -->
    <div class="accent-line-wrapper relative">
      <div class="h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 shadow-lg"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
      
      <!-- BAGIAN 1: BLOG INFO - ARTIKEL TERBARU, POPULER, TAG, LABEL -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 rounded-2xl opacity-20"></div>
              <div class="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-white/20">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-newspaper" class="text-white size-6" />
                  </div>
                  <span class="text-white dark:text-white font-black text-2xl md:text-3xl tracking-tight">📚 Blog & Artikel Terkini</span>
                  <div class="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-rss" class="text-white size-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-slate-100/90 dark:bg-white/10 rounded-2xl px-8 py-4 border border-slate-200/50 dark:border-white/20">
            <p class="text-slate-900 dark:text-gray-200 font-bold text-lg">🚀 Update terbaru, artikel populer, dan rekomendasi untuk Anda</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Artikel Terbaru -->
          <div class="relative bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50/40 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/90 rounded-[26px] p-6 border-2 border-emerald-200/70 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-emerald-500 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-sparkles" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-emerald-900 dark:text-emerald-300">
                  Artikel Terbaru
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Update Terbaru</p>
              </div>
            </div>
            
            <div class="space-y-3 flex-1">
              <NuxtLink 
                v-for="(article, index) in latestArticles.slice(0, 6)" 
                :key="index"
                :to="article.to"
                class="group/item flex items-start gap-3 p-3 rounded-xl bg-white/80 dark:bg-gray-700/60 border border-emerald-200/60 dark:border-gray-600/50 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:shadow-lg transition-all duration-200"
              >
                <div class="p-2 bg-gradient-to-br from-emerald-500 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500 rounded-lg">
                  <UIcon :name="article.icon" class="size-4 text-white dark:text-gray-900" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-gray-900 dark:text-gray-200 font-bold text-sm group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors line-clamp-2 mb-1">
                    {{ article.title }}
                  </h4>
                  <div class="flex items-center gap-1.5 text-xs text-gray-900 dark:text-gray-400">
                    <UIcon name="i-lucide-calendar-days" class="size-3 text-gray-700 dark:text-gray-400" />
                    <span class="font-semibold">{{ article.date }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <div class="mt-6 pt-4 border-t border-emerald-200/60 dark:border-gray-700/50">
              <NuxtLink 
                to="/blog"
                class="group/btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gray-900/90 dark:bg-black/90 text-white font-semibold text-sm shadow-[0_12px_24px_rgba(15,23,42,0.35)] hover:translate-y-0.5 transition-all duration-300"
              >
                <span>Lihat Semua</span>
                <UIcon name="i-lucide-arrow-right" class="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>

          <!-- Artikel Populer -->
          <div class="relative bg-gradient-to-br from-rose-50 via-pink-50/60 to-fuchsia-50/40 dark:from-[#10121a] dark:via-[#131621] dark:to-[#151a26] rounded-[26px] p-6 border-2 border-rose-200/70 dark:border-rose-300/30 shadow-xl shadow-rose-200/30 dark:shadow-[0_30px_65px_rgba(0,0,0,0.55)] hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 dark:from-rose-400 dark:via-pink-400 dark:to-fuchsia-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-flame" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-rose-900 dark:text-rose-300">
                  Artikel Populer
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Paling Banyak Dibaca</p>
              </div>
            </div>
            
            <div class="space-y-3 flex-1">
              <NuxtLink 
                v-for="(article, index) in popularArticles.slice(0, 6)" 
                :key="index"
                :to="article.to"
                class="group/item flex items-start gap-3 p-3 rounded-2xl bg-white/85 dark:bg-[#050608]/85 border border-rose-200/60 dark:border-white/10 hover:border-rose-400 dark:hover:border-rose-400/80 hover:shadow-lg dark:hover:shadow-[0_16px_36px_rgba(255,120,140,0.25)] transition-all duration-200"
              >
                <div class="p-2 bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-500 rounded-2xl shadow-inner shadow-rose-500/40">
                  <UIcon :name="article.icon" class="size-4 text-white dark:text-gray-900" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-gray-900 dark:text-gray-200 font-bold text-sm group-hover/item:text-rose-600 dark:group-hover/item:text-rose-200 transition-colors line-clamp-2 mb-1">
                    {{ article.title }}
                  </h4>
                  <div class="flex flex-wrap items-center gap-2 text-xs">
                    <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-900 dark:bg-white/10 dark:text-rose-100 border border-rose-200/70 dark:border-white/15 shadow-sm">
                      <UIcon name="i-lucide-eye" class="size-3 text-rose-700 dark:text-rose-100" />
                      <span class="font-semibold">{{ article.views }}</span>
                    </div>
                    <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100/90 text-orange-900 dark:bg-white/10 dark:text-amber-100 border border-orange-200/70 dark:border-white/15 shadow-sm">
                      <UIcon name="i-lucide-flame" class="size-3 text-orange-700 dark:text-amber-200 animate-pulse" />
                      <span class="font-bold tracking-wide">Trending</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <div class="mt-6 pt-4 border-t border-rose-200/60 dark:border-white/10">
              <NuxtLink 
                to="/blog"
                class="group/btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gray-900/90 dark:bg-black/90 text-white font-semibold text-sm shadow-[0_12px_24px_rgba(15,23,42,0.35)] hover:translate-y-0.5 transition-all duration-300"
              >
                <span>Lihat Populer</span>
                <UIcon name="i-lucide-arrow-right" class="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>

          <!-- Tag & Label -->
          <div class="relative bg-gradient-to-br from-indigo-50 via-purple-50/60 to-pink-50/40 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/90 rounded-[26px] p-6 border-2 border-indigo-200/70 dark:border-indigo-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-tags" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-indigo-900 dark:text-indigo-300">
                  Tag & Label
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Kategori Populer</p>
              </div>
            </div>
            
            <div class="space-y-4 flex-1">
              <!-- Navigation Links -->
              <div>
                  <h4 class="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-navigation" class="size-4" />
                    Navigasi
                  </h4>
                <div class="grid grid-cols-1 gap-2">
                  <component
                    v-for="item in navLinks.slice(0, 6)" :key="item.label"
                    :is="isExternal(item.to) ? 'a' : 'NuxtLink'"
                    :href="isExternal(item.to) ? item.to : undefined"
                    :to="!isExternal(item.to) ? item.to : undefined"
                    :target="isExternal(item.to) ? '_blank' : undefined"
                    :rel="isExternal(item.to) ? 'noopener noreferrer' : undefined"
                    class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-indigo-200/40 dark:border-gray-600/40 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <UIcon name="i-lucide-chevron-right" class="size-3 text-indigo-700 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    <span class="font-semibold text-xs">{{ item.label }}</span>
                  </component>
                </div>
              </div>

              <!-- Label Tags -->
              <div>
                  <h4 class="text-sm font-bold text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-tag" class="size-4" />
                    Label Populer
                  </h4>
                <div class="flex flex-wrap gap-2">
                  <a v-for="tag in labelTags.slice(0, 6)" :key="tag.label" 
                     :href="tag.to" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="group inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200/50 dark:border-gray-600/40 bg-white/80 dark:bg-gray-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:shadow-md text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-xs font-bold">
                    <UIcon name="i-lucide-hash" class="size-3 text-indigo-700 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
                    {{ tag.label }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BAGIAN 1.5: NAVIGATION & QUICK LINKS -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-600 to-rose-700 dark:from-purple-400 dark:via-pink-500 dark:to-rose-600 rounded-2xl opacity-20"></div>
              <div class="relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-600 to-rose-700 dark:from-purple-400 dark:via-pink-500 dark:to-rose-600 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-white/20">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-navigation" class="text-white size-6" />
                  </div>
                  <span class="text-white dark:text-white font-black text-2xl md:text-3xl tracking-tight">🚀 Navigasi & Link Cepat</span>
                  <div class="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-external-link" class="text-white size-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-slate-100/90 dark:bg-white/10 rounded-2xl px-8 py-4 border border-slate-200/50 dark:border-white/20">
            <p class="text-slate-900 dark:text-gray-200 font-bold text-lg">🎯 Akses cepat ke semua layanan dan informasi penting</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Main Services -->
          <div class="relative bg-gradient-to-br from-blue-50 via-indigo-50/60 to-purple-50/40 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/90 rounded-2xl p-6 border-2 border-blue-200/70 dark:border-blue-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-credit-card" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-blue-900 dark:text-blue-300">
                  Layanan Utama
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Jasa Pembayaran</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <a href="/jasa-paypal" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-blue-200/40 dark:border-gray-600/40 hover:border-blue-400 dark:hover:border-blue-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Jasa PayPal</span>
              </a>
              <a href="/jasa-bitcoin" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-blue-200/40 dark:border-gray-600/40 hover:border-blue-400 dark:hover:border-blue-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Jasa Bitcoin</span>
              </a>
              <a href="/jasa-skrill" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-blue-200/40 dark:border-gray-600/40 hover:border-blue-400 dark:hover:border-blue-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Jasa Skrill</span>
              </a>
              <a href="/jasa-neteller" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-blue-200/40 dark:border-gray-600/40 hover:border-blue-400 dark:hover:border-blue-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Jasa Neteller</span>
              </a>
            </div>
          </div>

          <!-- Digital Products -->
          <div class="relative bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50/40 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/90 rounded-2xl p-6 border-2 border-emerald-200/70 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-shopping-bag" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-emerald-900 dark:text-emerald-300">
                  Produk Digital
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Pembelian Online</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <a href="/beli-kartu-kredit" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-emerald-200/40 dark:border-gray-600/40 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Kartu Kredit</span>
              </a>
              <a href="/beli-zoom-pro" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-emerald-200/40 dark:border-gray-600/40 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Zoom Pro</span>
              </a>
              <a href="/beli-namecheap" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-emerald-200/40 dark:border-gray-600/40 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Namecheap</span>
              </a>
              <a href="/beli-hosting" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-emerald-200/40 dark:border-gray-600/40 hover:border-emerald-400 dark:hover:border-emerald-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Hosting & Domain</span>
              </a>
            </div>
          </div>

          <!-- Company Info -->
          <div class="relative bg-gradient-to-br from-orange-50 via-red-50/60 to-pink-50/40 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/90 rounded-2xl p-6 border-2 border-orange-200/70 dark:border-orange-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-building-2" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-orange-900 dark:text-orange-300">
                  Tentang Kami
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Informasi Perusahaan</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <a href="/tentang-kami" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-orange-200/40 dark:border-gray-600/40 hover:border-orange-400 dark:hover:border-orange-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-orange-700 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Profil Perusahaan</span>
              </a>
              <a href="/testimonial" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-orange-200/40 dark:border-gray-600/40 hover:border-orange-400 dark:hover:border-orange-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-orange-700 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Testimonial</span>
              </a>
              <a href="/transaksi" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-orange-200/40 dark:border-gray-600/40 hover:border-orange-400 dark:hover:border-orange-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-orange-700 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Cara Transaksi</span>
              </a>
              <a href="https://upload.jasapembayaran.com" target="_blank" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-orange-200/40 dark:border-gray-600/40 hover:border-orange-400 dark:hover:border-orange-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-orange-700 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Upload Bukti</span>
              </a>
            </div>
          </div>

          <!-- Support & Help -->
          <div class="relative bg-gradient-to-br from-violet-50 via-purple-50/60 to-indigo-50/40 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/90 rounded-2xl p-6 border-2 border-violet-200/70 dark:border-violet-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 rounded-t-2xl"></div>
            
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-400 dark:to-purple-500 rounded-xl shadow-lg">
                <UIcon name="i-lucide-headphones" class="size-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 class="text-xl font-black text-violet-900 dark:text-violet-300">
                  Bantuan & Support
                </h3>
                <p class="text-xs text-gray-800 dark:text-gray-400 font-semibold">Customer Service</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <a href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com,%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0" target="_blank" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-violet-200/40 dark:border-gray-600/40 hover:border-violet-400 dark:hover:border-violet-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Chat WhatsApp</span>
              </a>
              <a href="/faq" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-violet-200/40 dark:border-gray-600/40 hover:border-violet-400 dark:hover:border-violet-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">FAQ</span>
              </a>
              <a href="/blog" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-violet-200/40 dark:border-gray-600/40 hover:border-violet-400 dark:hover:border-violet-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Blog & Artikel</span>
              </a>
              <a href="/privacy-policy" class="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-700/60 border border-violet-200/40 dark:border-gray-600/40 hover:border-violet-400 dark:hover:border-violet-500/70 hover:shadow-md transition-all duration-200 text-gray-900 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400">
                <UIcon name="i-lucide-chevron-right" class="size-3 text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                <span class="font-semibold text-xs">Kebijakan Privasi</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- BAGIAN 2: KONTAK & INFO LAINNYA DENGAN CLOCK REALTIME -->
      <div class="relative bg-gradient-to-br from-slate-100 via-blue-50/80 to-indigo-50/60 dark:from-slate-900 dark:via-blue-900/95 dark:to-indigo-900/90 rounded-3xl p-8 lg:p-10 border-2 border-blue-200/50 dark:border-blue-400/30 shadow-2xl overflow-hidden group">
        <!-- Clean Border Gradient -->
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 opacity-10 dark:opacity-20 group-hover:opacity-15 dark:group-hover:opacity-30 transition-opacity"></div>
        
        <!-- Top Accent Line -->
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 rounded-t-3xl"></div>
        
        <!-- Clean Stars Background -->
        <div class="absolute inset-0 opacity-20 dark:opacity-30">
          <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 dark:bg-white rounded-full animate-pulse"></div>
          <div class="absolute top-3/4 left-3/4 w-2 h-2 bg-indigo-500 dark:bg-blue-300 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
          <div class="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-500 dark:bg-indigo-300 rounded-full animate-pulse" style="animation-delay: 1s"></div>
          <div class="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-slate-500 dark:bg-cyan-300 rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
        </div>
        
        <div class="relative z-10">
          <!-- Company Header with Enhanced Design -->
          <div class="text-center mb-8">
            <div class="flex justify-center mb-6">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 rounded-2xl opacity-20"></div>
                <div class="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-white/20">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center">
                      <UIcon name="i-lucide-building-2" class="text-white size-6" />
                    </div>
                    <span class="text-white dark:text-white font-black text-2xl md:text-3xl tracking-tight">PT JASA GUDANG INDONESIA</span>
                    <div class="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center">
                      <UIcon name="i-lucide-shield-check" class="text-white size-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-slate-100/90 dark:bg-white/10 rounded-2xl px-8 py-4 border border-slate-200/50 dark:border-white/20">
              <p class="text-slate-900 dark:text-gray-200 font-bold text-lg">🏆 Solusi Pembayaran Digital Terpercaya Sejak 2011 🏆</p>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            <!-- Real-time Clock & Date -->
            <div class="bg-slate-50/80 dark:bg-white/10  border border-slate-200/50 dark:border-white/20 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <UIcon name="i-lucide-clock" class="size-5 text-white" />
                </div>
                <h3 class="text-slate-900 dark:text-gray-200 font-black text-lg">Waktu Real-time</h3>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20">
                  <UIcon name="i-lucide-calendar" class="size-4 text-cyan-600 dark:text-cyan-400" />
                  <span class="text-slate-900 dark:text-gray-200 font-bold text-sm">{{ formatDay() }}, {{ formatDate() }}</span>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20">
                  <UIcon name="i-lucide-clock" class="size-4 text-blue-600 dark:text-blue-400" />
                  <span class="text-slate-900 dark:text-gray-200 font-bold text-sm">{{ formatTime().time }}</span>
                </div>
                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20">
                  <UIcon name="i-lucide-globe" class="size-4 text-indigo-600 dark:text-indigo-400" />
                  <span class="text-slate-900 dark:text-gray-200 font-bold text-sm">{{ formatTime().timezone }}</span>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="bg-slate-50/80 dark:bg-white/10  border border-slate-200/50 dark:border-white/20 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <UIcon name="i-lucide-phone" class="size-5 text-white" />
                </div>
                <h3 class="text-slate-900 dark:text-gray-200 font-black text-lg">Kontak Kami</h3>
              </div>
              
              <div class="space-y-3">
                <a href="https://maps.app.goo.gl/NWGLye92ttU87vLs8" target="_blank" 
                   class="group flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all duration-200">
                  <UIcon name="i-lucide-map-pin" class="size-4 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                  <div class="text-slate-900 dark:text-gray-200 text-xs font-semibold leading-relaxed">
                    Green Lake City Boulevard, Rukan Great Wall Blok A No. 38, Cipondoh, Tangerang 15146
                  </div>
                </a>
                
                <a href="tel:+628988888250" 
                   class="group flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all duration-200">
                  <UIcon name="i-lucide-phone" class="size-4 text-blue-600 dark:text-blue-400" />
                  <div class="text-slate-900 dark:text-gray-200 font-bold text-sm">+62 898-8888-250</div>
                </a>

                <a href="mailto:admin@JasaPembayaran.com" 
                   class="group flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20 hover:bg-slate-200/80 dark:hover:bg-white/20 transition-all duration-200">
                  <UIcon name="i-lucide-mail" class="size-4 text-indigo-600 dark:text-indigo-400" />
                  <div class="text-slate-900 dark:text-gray-200 font-semibold text-sm">admin@JasaPembayaran.com</div>
                </a>
              </div>
            </div>

            <!-- Services & WhatsApp -->
            <div class="bg-slate-50/80 dark:bg-white/10  border border-slate-200/50 dark:border-white/20 rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <UIcon name="i-lucide-sparkles" class="size-5 text-white" />
                </div>
                <h3 class="text-slate-900 dark:text-gray-200 font-black text-lg">Layanan</h3>
              </div>
              
              <div class="space-y-4">
                <div class="p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20">
                  <h4 class="text-slate-900 dark:text-gray-100 font-bold text-sm mb-2">Pembayaran Online</h4>
                  <p class="text-slate-800 dark:text-gray-200 text-xs leading-relaxed">
                    Jasa PayPal, Bitcoin, Skrill, Neteller, Crypto, Hosting, Domain
                  </p>
                </div>
                
                <div class="p-3 rounded-xl bg-slate-100/80 dark:bg-white/10 border border-slate-200/50 dark:border-white/20">
                  <h4 class="text-slate-900 dark:text-gray-100 font-bold text-sm mb-2">Pembelian Digital</h4>
                  <p class="text-slate-800 dark:text-gray-200 text-xs leading-relaxed">
                    Kartu Kredit, Zoom Pro, Namecheap, AirDroid, OnlyFans, Patreon
                  </p>
                </div>

                <!-- WhatsApp CTA -->
                <a href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com,%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0" 
                   target="_blank"
                   class="group relative flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 hover:from-green-700 hover:via-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-1 font-bold text-sm overflow-hidden w-full">
                  <div class="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span class="relative z-10">Chat WhatsApp 24/7</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Trust Badges & Copyright -->
          <div class="text-center space-y-6">
            <!-- Trust Badges -->
            <div class="flex flex-wrap justify-center items-center gap-3">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/80 dark:bg-white/10  border border-slate-200/50 dark:border-white/20 rounded-full">
                <div class="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-slate-900 dark:text-gray-200 font-bold text-xs">Terpercaya Sejak 2011</span>
              </div>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/80 dark:bg-white/10  border border-slate-200/50 dark:border-white/20 rounded-full">
                <UIcon name="i-lucide-clock" class="size-3.5 text-blue-600 dark:text-blue-400" />
                <span class="text-slate-900 dark:text-gray-200 font-bold text-xs">24/7 Support</span>
              </div>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:scale-105 transition-transform">
                <UIcon name="i-lucide-sparkles" class="size-3.5 text-white" />
                <span class="text-white font-black text-xs">Version 2.2.0</span>
              </div>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/80 dark:bg-white/10  border border-slate-200/50 dark:border-white/20 rounded-full">
                <UIcon name="i-lucide-shield-check" class="size-3.5 text-blue-600 dark:text-blue-400" />
                <span class="text-slate-900 dark:text-gray-200 font-bold text-xs">Trusted & Verified</span>
              </div>
            </div>
            
            <!-- Copyright Text -->
            <p class="text-slate-800 dark:text-gray-200 font-semibold text-sm md:text-base">
              © Copyright 2011 - {{ currentYear }} · All Rights Reserved
            </p>
            
            <!-- Made with Love -->
            <div class="pt-4 border-t border-slate-200/50 dark:border-white/10">
              <p class="text-slate-700 dark:text-gray-300 text-xs font-medium flex items-center justify-center gap-2">
                Made with 
                <UIcon name="i-lucide-heart" class="size-3.5 text-red-500 dark:text-red-400 animate-pulse" />
                in Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ==================== EPIC UPDATE POPUP STYLES ==================== */

/* Epic Overlay - FULL BLOCKING */
.epic-update-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(59, 130, 246, 0.95) 50%, rgba(14, 165, 233, 0.95) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 1rem;
  overflow: hidden;
}

.dark .epic-update-overlay {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(51, 65, 85, 0.98) 100%);
}

.blocked-overlay {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%);
}

.dark .blocked-overlay {
  background: linear-gradient(135deg, rgba(127, 29, 29, 0.98) 0%, rgba(153, 27, 27, 0.98) 100%);
}

/* Animated Particles */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat linear infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

/* Gradient Waves Background */
.gradient-waves {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  opacity: 0.1;
  border-radius: 40%;
}

.wave-1 {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  animation: waveRotate 20s linear infinite;
  top: -50%;
  left: -50%;
}

.wave-2 {
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
  animation: waveRotate 30s linear infinite reverse;
  bottom: -50%;
  right: -50%;
}

.wave-3 {
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
  animation: waveRotate 25s linear infinite;
  top: -25%;
  left: -25%;
}

@keyframes waveRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Epic Popup Container */
.epic-popup-container {
  max-width: 700px;
  width: 100%;
  animation: epicEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 10;
}

@keyframes epicEntrance {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(100px) rotate(-10deg);
  }
  60% {
    transform: scale(1.05) translateY(-10px) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotate(0deg);
  }
}

/* Epic Card */
.epic-popup-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(40px);
  border-radius: 32px;
  padding: 3.5rem 3rem;
  box-shadow: 
    0 50px 100px -20px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 2px 0 0 rgba(255, 255, 255, 0.8),
    0 0 60px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.dark .epic-popup-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%);
  box-shadow: 
    0 50px 100px -20px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 2px 0 0 rgba(255, 255, 255, 0.1),
    0 0 60px rgba(59, 130, 246, 0.2);
}

.blocked-card {
  box-shadow: 
    0 50px 100px -20px rgba(220, 38, 38, 0.5),
    0 0 0 2px rgba(239, 68, 68, 0.3),
    0 0 60px rgba(239, 68, 68, 0.4);
}

/* Epic Border Top */
.epic-border-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #8b5cf6, #3b82f6, #06b6d4);
  background-size: 300% 100%;
  animation: rainbowFlow 4s linear infinite;
}

.blocked-border {
  background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c, #dc2626, #ef4444);
  background-size: 200% 100%;
}

@keyframes rainbowFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 300% 50%;
  }
}

/* Epic Glows */
.epic-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  pointer-events: none;
  animation: glowPulse 3s ease-in-out infinite;
}

.epic-glow-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.epic-glow-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: 1s;
}

.epic-glow-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 2s;
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

/* Rotating Ring */
.rotating-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  animation: rotateRing 20s linear infinite;
  pointer-events: none;
}

@keyframes rotateRing {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Icon Container */
.epic-icon-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  z-index: 5;
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid;
  opacity: 0.3;
  animation: ringPulse 3s ease-out infinite;
}

.icon-ring-1 {
  width: 140px;
  height: 140px;
  border-color: #06b6d4;
  animation-delay: 0s;
}

.icon-ring-2 {
  width: 170px;
  height: 170px;
  border-color: #3b82f6;
  animation-delay: 0.5s;
}

.icon-ring-3 {
  width: 200px;
  height: 200px;
  border-color: #8b5cf6;
  animation-delay: 1s;
}

@keyframes ringPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

.epic-icon-bg {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 
    0 20px 60px rgba(59, 130, 246, 0.6),
    0 0 0 10px rgba(59, 130, 246, 0.1),
    inset 0 -2px 10px rgba(0, 0, 0, 0.2);
  animation: iconFloat 3s ease-in-out infinite;
}

.blocked-icon-bg {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 
    0 20px 60px rgba(239, 68, 68, 0.6),
    0 0 0 10px rgba(239, 68, 68, 0.1);
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.epic-icon {
  font-size: 3.5rem;
  color: white;
  position: absolute;
  transition: all 0.3s ease;
}

.icon-sparkle {
  animation: sparkleRotate 4s ease-in-out infinite;
}

.icon-refresh {
  animation: refreshSpin 3s linear infinite;
}

.blocked-icon {
  animation: iconShake 0.5s ease-in-out infinite;
}

@keyframes sparkleRotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes refreshSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes iconShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

/* Epic Content */
.epic-content {
  text-align: center;
  position: relative;
  z-index: 5;
}

.epic-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  line-height: 1.2;
}

.title-emoji {
  font-size: 2.5rem;
  animation: emojiFloat 2s ease-in-out infinite;
}

.title-emoji:first-child {
  animation-delay: 0s;
}

.title-emoji:last-child {
  animation-delay: 0.5s;
}

@keyframes emojiFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
  }
}

.title-text {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

.blocked-title .title-text {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.epic-subtitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.dark .epic-subtitle {
  color: #e2e8f0;
}

.epic-description {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.dark .epic-description {
  color: #cbd5e1;
}

/* Epic Countdown Container */
.epic-countdown-container {
  margin-bottom: 2.5rem;
}

.countdown-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 2rem;
}

.countdown-circle-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  filter: drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3));
}

.countdown-track-circle {
  fill: none;
  stroke: rgba(148, 163, 184, 0.2);
  stroke-width: 12;
}

.dark .countdown-track-circle {
  stroke: rgba(148, 163, 184, 0.1);
}

.countdown-progress-circle {
  fill: none;
  stroke: url(#progressGradient);
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: 565;
  transition: stroke-dashoffset 1s linear;
  filter: url(#glow);
}

.countdown-number-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-number-wrapper {
  text-align: center;
  position: relative;
  z-index: 2;
}

.countdown-number-main {
  display: block;
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.25rem;
  text-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
  animation: numberPulse 1s ease-in-out infinite;
}

@keyframes numberPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.countdown-number-label {
  display: block;
  font-size: 1rem;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dark .countdown-number-label {
  color: #94a3b8;
}

.countdown-pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  opacity: 0;
  animation: pulsateRing 2s ease-out infinite;
}

@keyframes pulsateRing {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Progress Bar */
.progress-bar-container {
  max-width: 400px;
  margin: 0 auto;
}

.progress-bar-track {
  width: 100%;
  height: 12px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.dark .progress-bar-track {
  background: rgba(51, 65, 85, 0.4);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  border-radius: 9999px;
  transition: width 1s linear;
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #475569;
  font-weight: 600;
}

.dark .progress-text {
  color: #cbd5e1;
}

.progress-icon {
  font-size: 1.25rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.text-gradient {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

/* Epic Actions */
.epic-actions {
  margin-bottom: 2rem;
}

.epic-btn-reload {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  color: white;
  font-size: 1.375rem;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.epic-btn-reload:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 30px 60px rgba(59, 130, 246, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.epic-btn-reload:active {
  transform: translateY(-2px) scale(0.98);
}

.btn-bg-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.epic-btn-reload:hover .btn-bg-layer {
  opacity: 1;
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-icon-left,
.btn-icon-right {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.epic-btn-reload:hover .btn-icon-left {
  animation: zapPulse 0.5s ease infinite;
}

.epic-btn-reload:hover .btn-icon-right {
  transform: translateX(5px);
}

@keyframes zapPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.epic-btn-reload:hover .btn-shine {
  left: 100%;
}

/* Features List */
.features-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.dark .features-list {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  animation: featurePop 0.5s ease backwards;
}

.dark .feature-item {
  color: #e2e8f0;
}

.feature-item:nth-child(1) {
  animation-delay: 0.1s;
}

.feature-item:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes featurePop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.feature-icon {
  font-size: 1.25rem;
  color: #10b981;
  animation: checkBounce 2s ease-in-out infinite;
}

@keyframes checkBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Epic Info */
.epic-info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(224, 231, 255, 0.8) 100%);
  border: 1px solid rgba(147, 197, 253, 0.5);
  border-radius: 12px;
  font-size: 0.875rem;
  color: #1e40af;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.dark .epic-info {
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(55, 48, 163, 0.3) 100%);
  border-color: rgba(59, 130, 246, 0.4);
  color: #93c5fd;
}

.blocked-info {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.8) 0%, rgba(209, 250, 229, 0.8) 100%);
  border-color: rgba(134, 239, 172, 0.5);
  color: #15803d;
}

.dark .blocked-info {
  background: linear-gradient(135deg, rgba(20, 83, 45, 0.3) 0%, rgba(21, 128, 61, 0.3) 100%);
  border-color: rgba(34, 197, 94, 0.4);
  color: #86efac;
}

.epic-info-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  animation: shieldPulse 2s ease-in-out infinite;
}

@keyframes shieldPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Block Time Container */
.block-time-container {
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.8) 0%, rgba(254, 202, 202, 0.8) 100%);
  border: 2px solid rgba(252, 165, 165, 0.6);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.dark .block-time-container {
  background: linear-gradient(135deg, rgba(63, 29, 29, 0.8) 0%, rgba(45, 21, 21, 0.8) 100%);
  border-color: rgba(127, 29, 29, 0.6);
}

.block-time-icon-wrapper {
  flex-shrink: 0;
}

.block-time-icon-large {
  font-size: 4rem;
  color: #dc2626;
  animation: clockRotate 2s ease-in-out infinite;
}

.dark .block-time-icon-large {
  color: #f87171;
}

@keyframes clockRotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-10deg) scale(1.05);
  }
  75% {
    transform: rotate(10deg) scale(1.05);
  }
}

.block-time-info {
  flex: 1;
  text-align: left;
}

.block-time-label {
  font-size: 0.875rem;
  color: #991b1b;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .block-time-label {
  color: #fca5a5;
}

.block-time-value {
  font-size: 1.75rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
}

.dark .block-time-value {
  color: #f87171;
}

/* Epic Popup Transition */
.epic-popup-enter-active {
  animation: epicPopupEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.epic-popup-leave-active {
  animation: epicPopupLeave 0.5s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes epicPopupEnter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes epicPopupLeave {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .epic-popup-card {
    padding: 2.5rem 2rem;
    border-radius: 24px;
  }
  
  .epic-title {
    font-size: 2rem;
  }
  
  .title-emoji {
    font-size: 2rem;
  }
  
  .epic-subtitle {
    font-size: 1.25rem;
  }
  
  .epic-description {
    font-size: 1rem;
  }
  
  .epic-icon-bg {
    width: 100px;
    height: 100px;
  }
  
  .epic-icon {
    font-size: 3rem;
  }
  
  .countdown-wrapper {
    width: 180px;
    height: 180px;
  }
  
  .countdown-number-main {
    font-size: 3.5rem;
  }
  
  .epic-btn-reload {
    font-size: 1.125rem;
    padding: 1rem 2rem;
  }
  
  .features-list {
    flex-direction: column;
    gap: 1rem;
  }
  
  .block-time-container {
    flex-direction: column;
    text-align: center;
  }
  
  .block-time-info {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .epic-popup-card {
    padding: 2rem 1.5rem;
  }
  
  .epic-title {
    font-size: 1.75rem;
  }
  
  .countdown-wrapper {
    width: 160px;
    height: 160px;
  }
  
  .countdown-number-main {
    font-size: 3rem;
  }
  
  .particle {
    width: 2px;
    height: 2px;
  }
}

/* ==================== SUPER KEREN FOOTER STYLES ==================== */

/* Ensure footer is always visible */
.footer-super-keren,
footer.footer-super-keren,
.global-footer.footer-super-keren {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  width: 100% !important;
  min-height: 200px !important;
}

/* Force text colors to be visible - override any global styles */
.footer-super-keren .text-slate-900,
.footer-super-keren .text-gray-900 {
  color: rgb(15 23 42) !important; /* slate-900 - dark text for light mode */
}

.dark .footer-super-keren .text-gray-200,
.dark .footer-super-keren .text-gray-100 {
  color: rgb(229 231 235) !important; /* gray-200 - light text for dark mode */
}

.dark .footer-super-keren .text-gray-300 {
  color: rgb(209 213 219) !important; /* gray-300 */
}

.dark .footer-super-keren .text-gray-400 {
  color: rgb(156 163 175) !important; /* gray-400 */
}

/* Comprehensive dark mode text color fixes - ensure ALL text is visible */
/* Override any black/dark text colors in dark mode - this is the main fix */
.dark .footer-super-keren [class*="text-black"],
.dark .footer-super-keren [class*="text-gray-900"],
.dark .footer-super-keren [class*="text-slate-900"],
.dark .footer-super-keren .text-slate-900,
.dark .footer-super-keren .text-gray-900 {
  color: rgb(229 231 235) !important; /* gray-200 - light text for dark mode */
}

/* Ensure all paragraph and span text is visible in dark mode */
.dark .footer-super-keren p:not([class*="text-"]),
.dark .footer-super-keren span:not([class*="text-"]),
.dark .footer-super-keren div:not([class*="text-"]) {
  color: rgb(229 231 235) !important; /* gray-200 - default light text for dark mode */
}

/* Ensure headings are visible in dark mode */
.dark .footer-super-keren h1:not([class*="text-"]),
.dark .footer-super-keren h2:not([class*="text-"]),
.dark .footer-super-keren h3:not([class*="text-"]),
.dark .footer-super-keren h4:not([class*="text-"]),
.dark .footer-super-keren h5:not([class*="text-"]),
.dark .footer-super-keren h6:not([class*="text-"]) {
  color: rgb(255 255 255) !important; /* white for headings without specific color classes */
}

/* Ensure links are visible in dark mode - but respect existing color classes */
.dark .footer-super-keren a:not([class*="text-"]) {
  color: rgb(147 197 253) !important; /* blue-300 for links without specific color */
}

.dark .footer-super-keren a:hover:not([class*="text-"]) {
  color: rgb(96 165 250) !important; /* blue-400 on hover */
}

/* Judul dengan warna terang di dark mode - menggunakan putih untuk kontras maksimal */
.dark .footer-super-keren h2,
.dark .footer-super-keren h2.text-slate-900,
.dark .footer-super-keren h2[class*="text-slate-900"],
.dark .footer-super-keren h2[class*="dark:text-white"] {
  color: #ffffff !important; /* putih murni untuk kontras maksimal */
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9), 0 0 12px rgba(59, 130, 246, 0.5) !important;
  font-weight: 900 !important;
  -webkit-text-fill-color: #ffffff !important;
}

.dark .footer-super-keren p.text-slate-900.dark\:text-white,
.dark .footer-super-keren p[class*="dark:text-white"],
.dark .footer-super-keren p.dark\:text-white {
  color: #ffffff !important;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8) !important;
  font-weight: 600 !important;
  -webkit-text-fill-color: #ffffff !important;
}

.dark .footer-super-keren .text-cyan-200 {
  color: rgb(165 243 252) !important;
}

.dark .footer-super-keren .text-purple-200 {
  color: rgb(233 213 255) !important;
}

.dark .footer-super-keren .text-emerald-300 {
  color: rgb(110 231 183) !important;
}

.dark .footer-super-keren .text-rose-300 {
  color: rgb(253 164 175) !important;
}

.dark .footer-super-keren .text-indigo-300 {
  color: rgb(165 180 252) !important;
}

.dark .footer-super-keren .text-blue-300 {
  color: rgb(147 197 253) !important;
}

.dark .footer-super-keren .text-orange-300 {
  color: rgb(253 186 116) !important;
}

.dark .footer-super-keren .text-violet-300 {
  color: rgb(196 181 253) !important;
}

/* Enhanced transitions for interactive elements */
a, button, .cursor-pointer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-4px);
}

/* Footer Super Keren Specific Styles */
.footer-super-keren {
  position: relative;
  overflow: hidden;
}

.footer-super-keren::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

@keyframes backgroundFloat {
  0%, 100% {
    opacity: 1;
    transform: translateY(0px);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-10px);
  }
}

.footer-super-keren > * {
  position: relative;
  z-index: 1;
}

/* Enhanced Card Hover Effects */
.footer-super-keren .group:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dark .footer-super-keren .group:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Real-time Clock Animation */
.footer-super-keren .animate-pulse {
  animation: clockPulse 2s ease-in-out infinite;
}

@keyframes clockPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

/* Clean Gradient Text - No Animation */
.footer-super-keren .text-transparent.bg-clip-text {
  background-size: 200% auto;
}

@keyframes textShimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* Responsive Adjustments for Footer */
@media (max-width: 1024px) {
  .footer-super-keren .grid.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-super-keren .grid.lg\\:grid-cols-3 > div {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .footer-super-keren {
    padding: 2rem 0;
  }
  
  .footer-super-keren .text-3xl {
    font-size: 1.875rem;
  }
  
  .footer-super-keren .text-4xl {
    font-size: 2.25rem;
  }
  
  .footer-super-keren .rounded-2xl {
    border-radius: 1rem;
  }
  
  .footer-super-keren .rounded-3xl {
    border-radius: 1.5rem;
  }
  
  .footer-super-keren .p-6 {
    padding: 1.5rem;
  }
  
  .footer-super-keren .p-8 {
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .footer-super-keren .text-2xl {
    font-size: 1.5rem;
  }
  
  .footer-super-keren .text-3xl {
    font-size: 1.75rem;
  }
  
  .footer-super-keren .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .footer-super-keren .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  
  .footer-super-keren .gap-8 {
    gap: 1rem;
  }
  
  .footer-super-keren .gap-3 {
    gap: 0.75rem;
  }
}

/* Enhanced Shadow Effects */
.footer-super-keren .shadow-xl {
  box-shadow: 
    0 20px 25px -5px rgba(6, 182, 212, 0.1), 
    0 10px 10px -5px rgba(59, 130, 246, 0.08),
    0 0 15px -3px rgba(99, 102, 241, 0.06);
}

.footer-super-keren .shadow-2xl {
  box-shadow: 
    0 25px 50px -12px rgba(6, 182, 212, 0.15),
    0 15px 25px -8px rgba(59, 130, 246, 0.12),
    0 0 20px -5px rgba(99, 102, 241, 0.08);
}

.dark .footer-super-keren .shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.dark .footer-super-keren .shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Enhanced Border Effects */
.footer-super-keren .border-2 {
  border-width: 2px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.footer-super-keren .group:hover .border-2 {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}

/* Enhanced Button Effects */
.footer-super-keren [class*="group/"]:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.dark .footer-super-keren [class*="group/"]:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Enhanced Icon Animations */
.footer-super-keren [class*="group/"]:hover .size-4,
.footer-super-keren [class*="group/"]:hover .size-5 {
  transform: scale(1.1) rotate(5deg);
}

/* Enhanced Text Clamp */
.footer-super-keren .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Clean Glass Effect - No Blur for Better Text Clarity */
.footer-super-keren [class*="bg-white/"] {
  /* Removed blur effects for better text clarity */
  opacity: 1;
}

/* Enhanced Star Animation */
.footer-super-keren .animate-pulse {
  animation: starPulse 3s ease-in-out infinite;
}

@keyframes starPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

/* Enhanced Gradient Border */
.footer-super-keren [class*="border-blue-"] {
  position: relative;
}

/* Logo visibility - Light Mode */
.logo-pro img,
img[src*="jasapembayaran.com.png"] {
  filter: brightness(1) contrast(1.1) saturate(1.1);
  opacity: 1;
  transition: filter 0.3s ease, transform 0.3s ease;
}

/* Logo visibility - Dark Mode - MAXIMUM VISIBILITY */
.dark .logo-pro,
.dark .logo-pro img,
.dark img[src*="jasapembayaran.com.png"],
.dark img[src*="/logos/jasapembayaran"],
.dark img[alt*="Jasa PayPal"] {
  filter: brightness(4.0) contrast(3.0) saturate(2.5) !important;
  opacity: 1 !important;
  -webkit-filter: brightness(4.0) contrast(3.0) saturate(2.5) !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5) !important;
  background: rgba(255, 255, 255, 0.12) !important;
  padding: 14px !important;
  border-radius: 18px !important;
}

/* Logo hover effect in dark mode */
.dark .logo-pro:hover,
.dark .logo-pro:hover img {
  filter: brightness(4.5) contrast(3.2) saturate(2.7) !important;
  -webkit-filter: brightness(4.5) contrast(3.2) saturate(2.7) !important;
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.6) !important;
  transform: scale(1.05) !important;
}

/* Company Title Animation */
.company-title {
  background-size: 200% auto;
  animation: textShimmer 8s linear infinite;
  text-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.dark .company-title {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Clean Text - No Animations */
.text-transparent.bg-clip-text {
  transition: all 0.3s ease;
}

/* Clean DateTime Card - No Animations */
.datetime-card {
  transition: all 0.3s ease;
}

.datetime-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Clean Service Cards - No Heavy Animations */
.service-card {
  position: relative;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Clean WhatsApp CTA - No Animations */
.whatsapp-cta-btn {
  transition: all 0.3s ease;
}


/* Clean Accent Line - No Animations */
.accent-line-wrapper {
  transition: all 0.3s ease;
}

/* Clean box shadows for light mode */
.shadow-xl {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 15px 25px -8px rgba(0, 0, 0, 0.08);
}

.dark .shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.dark .shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

/* Smooth background transitions */
.footer-theme {
  transition: background-color 0.4s ease, color 0.4s ease;
  position: relative;
}

/* Clean Background Pattern for Light Mode */
.footer-theme::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 15% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 85% 70%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

@keyframes backgroundShift {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.dark .footer-theme::before {
  display: none;
}

.footer-theme > * {
  position: relative;
  z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .service-card::before {
    display: none;
  }
}

/* Enhanced Gap Spacing for Footer Sections */
.footer-professional .max-w-7xl > div:not(:last-child) {
  margin-bottom: 4rem !important;
}

@media (min-width: 1024px) {
  .footer-professional .max-w-7xl > div:not(:last-child) {
    margin-bottom: 5rem !important;
  }
}

/* Trusted Partners Section Spacing */
.footer-professional .max-w-7xl > div:nth-child(3) {
  margin-bottom: 6rem !important;
}

/* Articles Section Enhanced Spacing */
.footer-professional .grid.grid-cols-1.lg\\:grid-cols-2 {
  gap: 3rem !important;
  margin-bottom: 5rem !important;
}

@media (min-width: 1024px) {
  .footer-professional .grid.grid-cols-1.lg\\:grid-cols-2 {
    gap: 4rem !important;
  }
}

/* Main Content Grid Enhanced Spacing */
.footer-professional .grid.grid-cols-1.lg\\:grid-cols-12 {
  gap: 3rem !important;
  margin-bottom: 5rem !important;
}

@media (min-width: 1024px) {
  .footer-professional .grid.grid-cols-1.lg\\:grid-cols-12 {
    gap: 4rem !important;
  }
}

/* Services Description Section Enhanced Spacing */
.footer-professional .space-y-12 > div {
  margin-bottom: 3rem !important;
}

@media (min-width: 1024px) {
  .footer-professional .space-y-12 > div {
    margin-bottom: 4rem !important;
  }
}

/* Smooth scroll behavior */
@media (prefers-reduced-motion: no-preference) {
  * {
    scroll-behavior: smooth;
  }
}
</style>
