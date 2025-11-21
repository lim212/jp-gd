<script setup lang="ts">
interface Props {
  showTitle?: boolean;
  showDescription?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  showDescription: true,
});

// Handle image popup (simplified)
const openImagePopup = (imageSrc: string, title: string, description: string) => {
  // Simple alert for now - can be enhanced later
  alert(`${title}\n\n${description}`)
}

const transactionProcessSection = [
  {
    icon: "i-lucide-message-circle",
    title: "Konsultasi Profesional",
    description: "Hubungi customer service kami 24/7 untuk konsultasi transaksi. Tim profesional siap memberikan solusi terbaik dengan respons cepat dan akurat.",
    shortDesc: "Konsultasi 24/7",
    features: ["LiveChat", "WhatsApp", "Respons Cepat"],
    color: "from-blue-600 to-blue-700",
    bgColor: "from-blue-50 to-blue-100",
    iconBg: "from-blue-600 to-blue-700"
  },
  {
    icon: "i-lucide-shield-check",
    title: "Verifikasi & Validasi",
    description: "Verifikasi keamanan dan validasi data untuk memastikan transaksi aman. Sistem keamanan berlapis dan protokol anti-fraud terdepan melindungi setiap transaksi.",
    shortDesc: "Keamanan Berlapis",
    features: ["Anti-Fraud", "Verifikasi Data", "Sistem Aman"],
    color: "from-emerald-600 to-emerald-700",
    bgColor: "from-emerald-50 to-emerald-100",
    iconBg: "from-emerald-600 to-emerald-700"
  },
  {
    icon: "i-lucide-banknote",
    title: "Transfer Aman & Terpercaya",
    description: "Transfer dana ke rekening resmi terverifikasi dengan instruksi detail dan aman. Semua rekening terdaftar resmi dan diawasi otoritas keuangan.",
    shortDesc: "Rekening Resmi",
    features: ["Terverifikasi", "Instruksi Detail", "Diawasi Otoritas"],
    color: "from-amber-600 to-amber-700",
    bgColor: "from-amber-50 to-amber-100",
    iconBg: "from-amber-600 to-amber-700"
  },
  {
    icon: "i-lucide-rocket",
    title: "Eksekusi Cepat & Konfirmasi",
    description: "Kirim bukti transfer dan dapatkan konfirmasi real-time. Transaksi diproses cepat dengan notifikasi otomatis dan pemantauan hingga selesai.",
    shortDesc: "Konfirmasi Real-time",
    features: ["Notifikasi Otomatis", "Proses Cepat", "Pemantauan"],
    color: "from-purple-600 to-purple-700",
    bgColor: "from-purple-50 to-purple-100",
    iconBg: "from-purple-600 to-purple-700"
  },
  {
    icon: "i-lucide-check-circle",
    title: "Pemrosesan & Validasi",
    description: "Tim profesional memproses transaksi dengan validasi menyeluruh. Setiap detail diperiksa untuk memastikan akurasi dan keamanan maksimal.",
    shortDesc: "Validasi Menyeluruh",
    features: ["Pemeriksaan Detail", "Akurasi Tinggi", "Keamanan Maksimal"],
    color: "from-teal-600 to-teal-700",
    bgColor: "from-teal-50 to-teal-100",
    iconBg: "from-teal-600 to-teal-700"
  },
  {
    icon: "i-lucide-clock",
    title: "Monitoring & Follow-up",
    description: "Pemantauan berkelanjutan dan follow-up untuk memastikan transaksi berjalan lancar. Tim kami selalu siap memberikan update terbaru.",
    shortDesc: "Monitoring 24/7",
    features: ["Update Berkala", "Follow-up Aktif", "Support Berkelanjutan"],
    color: "from-orange-600 to-orange-700",
    bgColor: "from-orange-50 to-orange-100",
    iconBg: "from-orange-600 to-orange-700"
  },
  {
    icon: "i-lucide-award",
    title: "Selesai & Penyerahan",
    description: "Transaksi selesai dengan penyerahan hasil sesuai kesepakatan. Kami memastikan kepuasan pelanggan dengan kualitas pelayanan terbaik.",
    shortDesc: "Kepuasan Terjamin",
    features: ["Hasil Sesuai Target", "Kualitas Terbaik", "Kepuasan Pelanggan"],
    color: "from-rose-600 to-rose-700",
    bgColor: "from-rose-50 to-rose-100",
    iconBg: "from-rose-600 to-rose-700"
  },
  {
    icon: "i-lucide-headset",
    title: "Dukungan Purna Jual",
    description: "Layanan after-sales support untuk memastikan kepuasan berkelanjutan. Tim kami siap membantu setiap pertanyaan atau kendala pasca transaksi dengan respons cepat.",
    shortDesc: "Support Lifetime",
    features: ["Konsultasi Gratis", "Bantuan Teknis", "Garansi Layanan"],
    color: "from-cyan-600 to-cyan-700",
    bgColor: "from-cyan-50 to-cyan-100",
    iconBg: "from-cyan-600 to-cyan-700"
  },
];
</script>

<template>
  <div
    id="transaction-process-section"
    class="@container py-8 lg:py-10 px-6 sm:px-8 lg:px-12 bg-gray-50/50 dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden mb-4 md:mb-6 lg:mb-8"
  >
    <!-- Clean Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-gray-50/20 to-indigo-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl"></div>
    <div v-if="props.showTitle" class="text-center mb-8 relative z-10">
      <div class="max-w-4xl mx-auto">
        <!-- Professional Header - Compact -->
        <div class="relative bg-gray-50/80 dark:bg-gray-800 rounded-xl px-6 py-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <!-- Header Content -->
          <div class="flex items-center justify-center gap-4">
            <!-- Left Icon -->
            <div class="p-3.5 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg flex items-center justify-center">
              <UIcon name="i-lucide-workflow" class="text-white size-7" />
            </div>
            
            <!-- Title Text -->
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              PROSES TRANSAKSI
            </h2>
            
            <!-- Right Icon -->
            <div class="p-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg flex items-center justify-center">
              <UIcon name="i-lucide-credit-card" class="text-white size-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="props.showDescription" class="relative z-10 mb-6">
      <div class="max-w-4xl mx-auto">
        <!-- Professional Description Container - Compact -->
        <div class="relative bg-gray-50/80 dark:bg-gray-800 rounded-xl px-6 py-5 shadow-lg border border-gray-200 dark:border-gray-700">
          <p class="text-gray-700 dark:text-gray-200 text-base md:text-lg leading-relaxed text-center">
            <span class="font-semibold">8 langkah terstruktur</span> untuk membantu Anda bertransaksi PayPal dan layanan digital dengan nyaman. 
            Setiap tahap dibuat jelas: mulai dari konsultasi, verifikasi rekening, konfirmasi transfer hingga dana diterima, sehingga proses terasa <span class="font-semibold">aman, rapi, dan mudah diikuti</span>.
          </p>
        </div>
      </div>
    </div>

    <!-- Transaction Process Cards Grid - Ultra Professional & Uniform (8 Cards Perfect Layout) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
      <div
        v-for="(transaction, index) in transactionProcessSection"
        :key="transaction.icon"
        class="transaction-card group relative bg-gradient-to-br from-gray-50/90 to-gray-100/80 dark:from-gray-800/95 dark:to-gray-850/90 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden h-[310px] flex flex-col backdrop-blur-sm"
        @click="openImagePopup(`/images/transaction-step-${index + 1}.jpg`, transaction.title, transaction.description)"
      >
        <!-- Animated Background Gradient on Hover -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br" :class="`from-${transaction.color.split('-')[1]}-500/10 to-transparent`"></div>
        
        <!-- Step Number Badge - Premium Design -->
        <div class="absolute top-2 left-2 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-[3px] border-white dark:border-gray-800 z-20 transform group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/60 dark:ring-gray-700/60" :class="`bg-gradient-to-br ${transaction.iconBg}`">
          <span class="text-white font-black text-xl drop-shadow-lg">{{ index + 1 }}</span>
        </div>
        
        <!-- Header Section with Icon - Precise -->
        <div class="pt-5 pb-2.5 px-4 text-center relative z-10">
          <div class="flex justify-center mb-2.5 transform group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300">
            <div class="p-3.5 rounded-xl shadow-lg backdrop-blur-sm border-2 border-white/50 dark:border-gray-700/50" :class="`bg-gradient-to-br ${transaction.iconBg}`">
              <UIcon :name="transaction.icon" class="size-7 text-white" />
            </div>
          </div>
          
          <!-- Title - Fixed Height -->
          <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-2 leading-tight h-8 flex items-center justify-center">
            {{ transaction.title }}
          </h3>
          
          <!-- Short Description Badge - Uniform -->
          <div class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm bg-gradient-to-r" :class="transaction.bgColor">
            <span class="text-gray-900 dark:text-gray-100">{{ transaction.shortDesc }}</span>
          </div>
        </div>
        
        <!-- Content Section - Fixed Height for Uniformity -->
        <div class="flex-1 px-4 pb-4 flex flex-col justify-between relative z-10">
          <!-- Main Description - Fixed Height with Ellipsis -->
          <p class="text-gray-800 dark:text-gray-300 text-xs leading-snug mb-2.5 h-[54px] overflow-hidden">
            {{ transaction.description }}
          </p>
          
          <!-- Features List - Precise Spacing -->
          <div class="space-y-1.5">
            <div v-for="feature in transaction.features" :key="feature" class="flex items-center gap-2 group/item">
              <div class="w-1.5 h-1.5 rounded-full flex-shrink-0 transform group-hover/item:scale-125 transition-transform" :class="`bg-${transaction.color.split('-')[1]}-500`"></div>
              <span class="text-[11px] text-gray-800 dark:text-gray-400 font-semibold leading-tight">{{ feature }}</span>
            </div>
          </div>
        </div>
        
        <!-- Bottom Action Indicator - Enhanced -->
        <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all duration-300">
          <div class="p-2 rounded-lg shadow-lg backdrop-blur-sm" :class="`bg-gradient-to-r ${transaction.iconBg}`">
            <UIcon name="i-lucide-arrow-right" class="text-white size-3.5" />
          </div>
        </div>
        
        <!-- Premium Hover Effect Border with Glow -->
        <div class="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/40 dark:group-hover:border-blue-500/40 transition-all duration-500 pointer-events-none"></div>
        <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" :class="`shadow-${transaction.color.split('-')[1]}-500/20`"></div>
      </div>
    </div>

    <!-- Professional Security Warning Section - Ultra Clean & Rapi (tanpa garis kotak merah) -->
    <div class="relative z-10 mt-6">
      <div class="max-w-5xl mx-auto">
        <div class="relative bg-gradient-to-br from-gray-50/95 to-gray-100/90 dark:from-gray-800/98 dark:to-gray-900/95 rounded-2xl p-5 shadow-xl border border-amber-200/40 dark:border-amber-500/40 backdrop-blur-sm overflow-hidden">
          <!-- Subtle Animated Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-orange-400/4 to-rose-400/5 dark:from-amber-400/12 dark:via-orange-500/10 dark:to-rose-500/10"></div>
          
          <div class="relative z-10 space-y-4">
            <!-- Header Section - Compact & Clean -->
            <div class="flex items-center gap-4 pb-4 border-b-2 border-amber-300/50 dark:border-amber-600/40">
              <div class="p-3.5 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 rounded-xl shadow-lg flex-shrink-0">
                <UIcon name="i-lucide-shield-alert" class="size-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-amber-900 dark:text-amber-100 font-black text-xl md:text-2xl tracking-tight mb-1 leading-tight">
                  PERINGATAN KEAMANAN PENTING
                </h4>
                <p class="text-amber-800 dark:text-amber-200 text-sm font-semibold">
                  Lindungi diri Anda dari penipuan online dengan mengikuti panduan keamanan berikut
                </p>
              </div>
            </div>
            
            <!-- Warning Content Cards - 4 kotak presisi -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- Card 1: Data Pribadi -->
              <div class="warning-card group bg-gradient-to-br from-red-50/95 to-rose-50/90 dark:from-red-900/70 dark:to-rose-950/70 rounded-xl p-5 border-2 border-red-200/60 dark:border-red-800/50 shadow-md hover:shadow-xl transition-all duration-300 h-auto min-h-[140px] flex flex-col">
                <div class="flex items-start gap-3 mb-3">
                  <div class="p-3 bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <UIcon name="i-lucide-user-x" class="size-5 text-white" />
                  </div>
                  <h5 class="font-black text-red-900 dark:text-red-100 text-base leading-tight pt-1">
                    Jangan Berikan Data Pribadi
                  </h5>
                </div>
                <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex-1">
                  Jangan pernah memberikan <strong class="text-red-700 dark:text-red-300 font-bold">PIN, OTP, atau password</strong> kepada siapapun, termasuk yang mengaku sebagai customer service kami. Data sensitif ini hanya untuk Anda.
                </p>
              </div>
              
              <!-- Card 2: Rekening Resmi -->
              <div class="warning-card group bg-gradient-to-br from-orange-50/95 to-orange-100/90 dark:from-orange-900/70 dark:to-orange-950/70 rounded-xl p-5 border-2 border-orange-200/60 dark:border-orange-800/50 shadow-md hover:shadow-xl transition-all duration-300 h-auto min-h-[140px] flex flex-col">
                <div class="flex items-start gap-3 mb-3">
                  <div class="p-3 bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <UIcon name="i-lucide-building-2" class="size-5 text-white" />
                  </div>
                  <h5 class="font-black text-orange-900 dark:text-orange-100 text-base leading-tight pt-1">
                    Gunakan Rekening Resmi
                  </h5>
                </div>
                <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex-1">
                  Selalu verifikasi nama penerima sebelum mengirim dana. Pastikan hanya transfer ke <strong class="text-orange-700 dark:text-orange-300 font-bold">rekening resmi</strong> yang tercantum di halaman informasi rekening website ini.
                </p>
              </div>

              <!-- Card 3: Konfirmasi Lewat CS -->
              <div class="warning-card group bg-gradient-to-br from-blue-50/95 to-blue-100/90 dark:from-blue-900/70 dark:to-blue-950/70 rounded-xl p-5 border-2 border-blue-200/60 dark:border-blue-800/50 shadow-md hover:shadow-xl transition-all duration-300 h-auto min-h-[140px] flex flex-col">
                <div class="flex items-start gap-3 mb-3">
                  <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <UIcon name="i-lucide-message-square-more" class="size-5 text-white" />
                  </div>
                  <h5 class="font-black text-blue-900 dark:text-blue-100 text-base leading-tight pt-1">
                    Konfirmasi via CS Resmi
                  </h5>
                </div>
                <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex-1">
                  Jika ada yang menghubungi di luar kanal resmi (WhatsApp/website), jangan langsung percaya. Selalu verifikasi dan konfirmasi terlebih dahulu ke <strong class="text-blue-700 dark:text-blue-300 font-bold">customer service resmi</strong> melalui website ini.
                </p>
              </div>

              <!-- Card 4: Simpan Bukti & Laporkan -->
              <div class="warning-card group bg-gradient-to-br from-slate-50/95 to-slate-100/90 dark:from-slate-900/70 dark:to-slate-950/70 rounded-xl p-5 border-2 border-slate-200/60 dark:border-slate-700/50 shadow-md hover:shadow-xl transition-all duration-300 h-auto min-h-[140px] flex flex-col">
                <div class="flex items-start gap-3 mb-3">
                  <div class="p-3 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <UIcon name="i-lucide-file-warning" class="size-5 text-white" />
                  </div>
                  <h5 class="font-black text-slate-900 dark:text-slate-100 text-base leading-tight pt-1">
                    Simpan Bukti & Laporkan
                  </h5>
                </div>
                <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex-1">
                  Simpan semua bukti chat dan transfer dengan rapi. Jika terjadi hal mencurigakan atau penipuan, segera laporkan ke customer service kami dan bank terkait agar penanganan dapat dilakukan secepat mungkin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <LazyStarsBg />
  </div>
</template>

<style scoped>
/* Premium Professional Styles with Smooth Animations */

/* Transaction Card Hover Effects */
.transaction-card {
  will-change: transform, box-shadow;
}

.transaction-card:hover {
  transform: translateY(-6px) scale(1.02);
}

.transaction-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s;
}

.transaction-card:hover::before {
  opacity: 1;
}

/* Warning Card Hover Effects */
.warning-card:hover {
  transform: translateY(-4px) scale(1.02);
}

/* Ensure all warning cards have consistent height */
.warning-card {
  min-height: 140px;
}

/* Smooth Line Clamp */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Compact Mobile Optimization - Uniform & Professional */
@media (max-width: 768px) {
  #transaction-process-section {
    padding: 1.5rem 1rem !important;
  }
  
  .transaction-card {
    height: 280px !important;
  }
  
  .warning-card {
    height: auto !important;
    min-height: 110px !important;
  }
}

/* Compact Tablet Optimization - Precise Heights (2 columns) */
@media (min-width: 769px) and (max-width: 1023px) {
  .transaction-card {
    height: 300px !important;
  }
  
  /* Force 2 columns on tablet */
  #transaction-process-section .grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Compact Desktop Optimization - Perfect Uniformity (4 columns for 8 cards = 2 rows) */
@media (min-width: 1024px) {
  .transaction-card {
    height: 310px !important;
  }
  
  /* Perfect 4x2 grid for 8 cards */
  #transaction-process-section .grid {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}

/* Smooth Animations for Better UX */
@media (prefers-reduced-motion: no-preference) {
  .transaction-card,
  .warning-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .transaction-card,
  .warning-card,
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>