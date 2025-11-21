<script setup lang="ts">
// Company Profile Component
</script>

<template>
  <div class="relative flex flex-col h-full">
    <div
      id="company-profile-section"
      class="@container flex-grow py-4 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 shadow-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden rounded-3xl h-full flex flex-col"
    >
      <header class="text-center mb-6 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-200 text-xs font-semibold tracking-[0.3em] uppercase">
          <UIcon name="i-lucide-shapes" class="size-4" />
          Profile
        </div>
        <div class="flex items-center justify-center gap-4">
          <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/30 dark:shadow-blue-600/40 flex items-center justify-center">
            <UIcon name="i-lucide-building-2" class="text-white size-7" />
          </div>
          <div>
            <p class="text-sm font-semibold text-primary-600 dark:text-primary-300 tracking-[0.35em] uppercase">Company Profile</p>
            <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">PT Jasa Gudang Indonesia</h2>
          </div>
          <div class="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl shadow-xl shadow-indigo-500/30 dark:shadow-indigo-600/40 flex items-center justify-center">
            <UIcon name="i-lucide-file-check-2" class="text-white size-7" />
          </div>
        </div>
        <p class="text-base text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed">
          Menyediakan solusi pembayaran lintas negara, pengurusan legalitas, dan dukungan operasional terintegrasi untuk korporasi, startup, marketplace, dan UMKM dengan pendekatan praktis dan transparan.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div class="rounded-2xl border-2 border-blue-200/80 dark:border-blue-500/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="p-3 rounded-xl bg-blue-500 dark:bg-blue-600">
              <UIcon name="i-lucide-calendar" class="text-white size-6" />
            </div>
            <div>
              <p class="text-3xl font-black text-blue-700 dark:text-blue-300">12<span class="text-xl">+</span></p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">Tahun pengalaman mendampingi ekspansi pembayaran lintas negara</p>
            </div>
          </div>
          <div class="rounded-2xl border-2 border-emerald-200/80 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="p-3 rounded-xl bg-emerald-500 dark:bg-emerald-600">
              <UIcon name="i-lucide-users-2" class="text-white size-6" />
            </div>
            <div>
              <p class="text-lg font-black text-emerald-700 dark:text-emerald-300">Tim Multi-Disiplin</p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">Kolaborasi harian finance, legal, dan teknologi</p>
            </div>
          </div>
          <div class="rounded-2xl border-2 border-amber-200/80 dark:border-amber-500/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="p-3 rounded-xl bg-amber-500 dark:bg-amber-600">
              <UIcon name="i-lucide-handshake" class="text-white size-6" />
            </div>
            <div>
              <p class="text-3xl font-black text-amber-700 dark:text-amber-300">350<span class="text-xl">+</span></p>
              <p class="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">Kemitraan aktif dengan enterprise dan UMKM</p>
            </div>
          </div>
        </div>
      </header>
      <div class="company-profile-content bg-white/80 dark:bg-gray-950/40 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,0.25)] overflow-y-auto max-h-[680px] scrollbar-thin scrollbar-thumb-primary-300 dark:scrollbar-thumb-primary-600 scrollbar-track-transparent backdrop-blur-md">
        <div class="p-5 sm:p-6 lg:p-8 space-y-8">
          <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] items-start">
            <div class="rounded-3xl border border-gray-200/80 dark:border-gray-700/60 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900/60 p-6 shadow-lg">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-200">
                  <UIcon name="i-lucide-info" class="size-5" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-300 font-semibold">Tentang Kami</p>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">Operator pembayaran & outsourcing berbasis Indonesia</h3>
                </div>
              </div>
              <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                Sebagai <span class="font-semibold text-primary-600 dark:text-primary-300">Perseroan Terbatas</span> yang terdaftar resmi, kami menyediakan kombinasi layanan pembayaran, perizinan, dan dukungan operasional untuk mendukung partner fokus pada ekspansi bisnis dengan alur yang jelas dan terstruktur.
              </p>
              <ul class="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex gap-3">
                  <div class="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 mt-0.5">
                    <UIcon name="i-lucide-check-circle-2" class="text-emerald-600 dark:text-emerald-400 size-4" />
                  </div>
                  <span>Portofolio lintas industri: fintech, marketplace, edutech, healthtech, dan institusi pendidikan</span>
                </li>
                <li class="flex gap-3">
                  <div class="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 mt-0.5">
                    <UIcon name="i-lucide-check-circle-2" class="text-emerald-600 dark:text-emerald-400 size-4" />
                  </div>
                  <span>Proses terdokumentasi dengan pengecekan berkala dan pelacakan status yang dapat dipantau</span>
                </li>
                <li class="flex gap-3">
                  <div class="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 mt-0.5">
                    <UIcon name="i-lucide-check-circle-2" class="text-emerald-600 dark:text-emerald-400 size-4" />
                  </div>
                  <span>Tim internal terdiri dari legal advisor, finance specialist, arsitek sistem, dan project manager dengan fokus per klien</span>
                </li>
              </ul>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border-2 border-blue-300/70 dark:border-blue-600/50 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950/50 dark:via-gray-900/40 dark:to-blue-900/30 p-5 shadow-md hover:shadow-lg transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 rounded-xl bg-blue-500 dark:bg-blue-600">
                    <UIcon name="i-lucide-trending-up" class="text-white size-5" />
                  </div>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Track Record</p>
                </div>
                <p class="text-4xl font-black text-blue-700 dark:text-blue-300 leading-none mb-2">12<span class="text-2xl">+</span></p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Pengalaman mendampingi ekspansi pembayaran lintas negara</p>
              </div>
              <div class="rounded-2xl border-2 border-emerald-300/70 dark:border-emerald-600/50 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-emerald-950/50 dark:via-gray-900/40 dark:to-emerald-900/30 p-5 shadow-md hover:shadow-lg transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 rounded-xl bg-emerald-500 dark:bg-emerald-600">
                    <UIcon name="i-lucide-heart-handshake" class="text-white size-5" />
                  </div>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Kepuasan</p>
                </div>
                <p class="text-4xl font-black text-emerald-700 dark:text-emerald-300 leading-none mb-2">Positif</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Feedback konsisten dari klien enterprise dan UMKM</p>
              </div>
              <div class="rounded-2xl border-2 border-purple-300/70 dark:border-purple-600/50 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950/50 dark:via-gray-900/40 dark:to-purple-900/30 p-5 shadow-md hover:shadow-lg transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 rounded-xl bg-purple-500 dark:bg-purple-600">
                    <UIcon name="i-lucide-building-2" class="text-white size-5" />
                  </div>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-purple-700 dark:text-purple-300">Klien Aktif</p>
                </div>
                <p class="text-4xl font-black text-purple-700 dark:text-purple-300 leading-none mb-2">350<span class="text-2xl">+</span></p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Perusahaan terdiversifikasi dari 9 negara operasional</p>
              </div>
              <div class="rounded-2xl border-2 border-amber-300/70 dark:border-amber-600/50 bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-amber-950/50 dark:via-gray-900/40 dark:to-amber-900/30 p-5 shadow-md hover:shadow-lg transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 rounded-xl bg-amber-500 dark:bg-amber-600">
                    <UIcon name="i-lucide-zap" class="text-white size-5" />
                  </div>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Service Level</p>
                </div>
                <p class="text-4xl font-black text-amber-700 dark:text-amber-300 leading-none mb-2">Responsif</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Tim support dengan laporan berkala yang mudah dipahami</p>
              </div>
            </div>
          </section>

          <section class="grid gap-6 xl:grid-cols-3">
            <div class="rounded-3xl border-2 border-indigo-200/70 dark:border-indigo-600/50 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-indigo-950/50 dark:via-gray-900/40 dark:to-indigo-900/30 p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-indigo-500 dark:bg-indigo-600">
                  <UIcon name="i-lucide-shield-check" class="text-white size-5" />
                </div>
                <h3 class="text-lg font-bold text-indigo-900 dark:text-white">Regulasi & Kepastian Dokumen</h3>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-200">Setiap kerja sama dilengkapi MoU, NDA, SLA, serta pelacakan request melalui portal klien untuk memudahkan jejak audit.</p>
              <ul class="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                <li class="flex items-center gap-2">
                  <div class="p-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40">
                    <UIcon name="i-lucide-check" class="text-indigo-600 dark:text-indigo-400 size-3" />
                  </div>
                  <span>Disaster recovery & backup multi-region</span>
                </li>
                <li class="flex items-center gap-2">
                  <div class="p-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40">
                    <UIcon name="i-lucide-check" class="text-indigo-600 dark:text-indigo-400 size-3" />
                  </div>
                  <span>Penilaian risiko berulang setiap kuartal</span>
                </li>
                <li class="flex items-center gap-2">
                  <div class="p-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40">
                    <UIcon name="i-lucide-check" class="text-indigo-600 dark:text-indigo-400 size-3" />
                  </div>
                  <span>Template compliance yang dapat dipersonalisasi</span>
                </li>
              </ul>
            </div>
            <div class="rounded-3xl border-2 border-fuchsia-200/70 dark:border-fuchsia-600/50 bg-gradient-to-br from-white via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-900/50 dark:to-fuchsia-900/30 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-3 rounded-xl bg-fuchsia-500 dark:bg-fuchsia-600">
                  <UIcon name="i-lucide-users-round" class="text-white size-5" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Dedicated Squad</h3>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">Squad kecil lintas fungsi untuk setiap mitra strategis, dengan jalur komunikasi yang jelas dari awal hingga laporan akhir.</p>
              <div class="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                <div class="rounded-xl border border-gray-200/60 dark:border-gray-700/60 px-3 py-2">
                  <p class="font-semibold text-gray-900 dark:text-white">Project Lead</p>
                  <p>Koordinasi end-to-end</p>
                </div>
                <div class="rounded-xl border border-gray-200/60 dark:border-gray-700/60 px-3 py-2">
                  <p class="font-semibold text-gray-900 dark:text-white">Compliance Desk</p>
                  <p>Review dokumen & policy</p>
                </div>
                <div class="rounded-xl border border-gray-200/60 dark:border-gray-700/60 px-3 py-2">
                  <p class="font-semibold text-gray-900 dark:text-white">Tech Integrator</p>
                  <p>API • Webhook • Dashboard</p>
                </div>
                <div class="rounded-xl border border-gray-200/60 dark:border-gray-700/60 px-3 py-2">
                  <p class="font-semibold text-gray-900 dark:text-white">Customer Office</p>
                  <p>Reporting & insight</p>
                </div>
              </div>
            </div>
            <div class="rounded-3xl border-2 border-slate-300/70 dark:border-slate-600/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-900/40 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-3 rounded-xl bg-slate-700 dark:bg-slate-600">
                  <UIcon name="i-lucide-bar-chart-3" class="text-white size-5" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Data & Intelligence</h3>
              </div>
              <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex gap-3">
                  <div class="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5">
                    <UIcon name="i-lucide-activity" class="text-slate-600 dark:text-slate-400 size-4" />
                  </div>
                  <span>Dashboard KPI real-time, heatmap transaksi, dan notifikasi eskalasi berbasis prioritas</span>
                </li>
                <li class="flex gap-3">
                  <div class="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5">
                    <UIcon name="i-lucide-database" class="text-slate-600 dark:text-slate-400 size-4" />
                  </div>
                  <span>Retensi data terenkripsi dengan pemisahan lingkungan produk, staging, dan arsip</span>
                </li>
                <li class="flex gap-3">
                  <div class="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5">
                    <UIcon name="i-lucide-lightbulb" class="text-slate-600 dark:text-slate-400 size-4" />
                  </div>
                  <span>Insight operasional disajikan dalam executive summary mingguan dan quarterly business review</span>
                </li>
              </ul>
            </div>
          </section>

          <section class="bg-white/90 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 rounded-3xl p-6 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-2xl bg-primary-600 text-white shadow-lg">
                  <UIcon name="i-lucide-sparkles" class="size-5" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-300 font-semibold">Layanan Utama</p>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Matriks Solusi Terintegrasi</h3>
                </div>
              </div>
              <span class="text-[11px] font-semibold px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-100">
                Payment · Legal · Ops · Compliance
              </span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="service-card rounded-2xl border border-blue-200/70 dark:border-blue-700/60 bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-blue-900/30 dark:via-gray-900/40 dark:to-indigo-900/30 p-5">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 rounded-xl bg-blue-600 text-white">
                    <UIcon name="i-lucide-credit-card" class="size-5" />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-blue-900 dark:text-white">Payment Orchestration</h4>
                    <p class="text-xs text-blue-900/70 dark:text-blue-100">Kartu kredit · PayPal · Skrill · Crypto</p>
                  </div>
                </div>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-blue-100 dark:bg-blue-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-blue-600 dark:text-blue-400 size-3" />
                    </div>
                    <span>Routing transaksi fleksibel dengan fallback otomatis dan rekonsiliasi harian</span>
                  </li>
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-blue-100 dark:bg-blue-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-blue-600 dark:text-blue-400 size-3" />
                    </div>
                    <span>Enkripsi end-to-end, pencatatan bukti bayar, dan pemantauan risiko real-time</span>
                  </li>
                </ul>
              </div>
              <div class="service-card rounded-2xl border border-purple-200/70 dark:border-purple-700/60 bg-gradient-to-br from-purple-50 via-white to-pink-100 dark:from-purple-900/30 dark:via-gray-900/40 dark:to-pink-900/30 p-5">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 rounded-xl bg-purple-600 text-white">
                    <UIcon name="i-lucide-shopping-bag" class="size-5" />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-purple-900 dark:text-white">Cross-Border Procurement</h4>
                    <p class="text-xs text-purple-900/70 dark:text-purple-100">Sourcing · Settlement · Quality gate</p>
                  </div>
                </div>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-purple-100 dark:bg-purple-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-purple-600 dark:text-purple-400 size-3" />
                    </div>
                    <span>Due diligence vendor, escrow, dan proteksi pengiriman multi-courier</span>
                  </li>
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-purple-100 dark:bg-purple-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-purple-600 dark:text-purple-400 size-3" />
                    </div>
                    <span>Pembayaran multi mata uang dengan kurs institusional realtime</span>
                  </li>
                </ul>
              </div>
              <div class="service-card rounded-2xl border border-emerald-200/70 dark:border-emerald-700/60 bg-gradient-to-br from-emerald-50 via-white to-teal-100 dark:from-emerald-900/30 dark:via-gray-900/40 dark:to-teal-900/30 p-5">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 rounded-xl bg-emerald-600 text-white">
                    <UIcon name="i-lucide-file-check-2" class="size-5" />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-emerald-900 dark:text-white">Legal & Licensing Desk</h4>
                    <p class="text-xs text-emerald-900/70 dark:text-emerald-100">Perizinan · Drafting · Notaris Digital</p>
                  </div>
                </div>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-emerald-600 dark:text-emerald-400 size-3" />
                    </div>
                    <span>Pemetaan kewajiban regulasi per sektor (OJK, BI, Kominfo, DJP)</span>
                  </li>
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-emerald-600 dark:text-emerald-400 size-3" />
                    </div>
                    <span>SOP digital signing, KYC berlapis, dan repository dokumen siap audit</span>
                  </li>
                </ul>
              </div>
              <div class="service-card rounded-2xl border border-rose-200/70 dark:border-rose-700/60 bg-gradient-to-br from-rose-50 via-white to-red-100 dark:from-rose-900/30 dark:via-gray-900/40 dark:to-red-900/30 p-5">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 rounded-xl bg-rose-600 text-white">
                    <UIcon name="i-lucide-life-buoy" class="size-5" />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-rose-900 dark:text-white">Managed Operations</h4>
                    <p class="text-xs text-rose-900/70 dark:text-rose-100">Customer care · Risk monitoring · Reporting</p>
                  </div>
                </div>
                <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-rose-100 dark:bg-rose-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-rose-600 dark:text-rose-400 size-3" />
                    </div>
                    <span>Tim bilingual 24/7 dengan playbook sesuai brand tone</span>
                  </li>
                  <li class="flex gap-2 items-start">
                    <div class="p-0.5 rounded bg-rose-100 dark:bg-rose-900/40 mt-0.5">
                      <UIcon name="i-lucide-check" class="text-rose-600 dark:text-rose-400 size-3" />
                    </div>
                    <span>Pelaporan KPI otomatis (daily pulse, weekly brief, quarterly review)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="rounded-3xl border border-primary-200/60 dark:border-primary-500/40 bg-gradient-to-br from-primary-600/10 via-white to-primary-500/5 dark:from-primary-500/15 dark:via-gray-900/40 dark:to-primary-500/5 p-6 shadow-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 rounded-2xl bg-primary-600 text-white shadow-lg">
                  <UIcon name="i-lucide-route" class="size-5" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-300 font-semibold">Workflow</p>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Perjalanan Klien yang Transparan</h3>
                </div>
              </div>
              <ol class="grid gap-4 md:grid-cols-2">
                <li class="rounded-2xl border-2 border-blue-200/60 dark:border-blue-700/40 bg-white/90 dark:bg-white/10 p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      01
                    </div>
                    <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                      <UIcon name="i-lucide-search" class="text-blue-600 dark:text-blue-400 size-4" />
                    </div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Diagnostic Lab</p>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300">Audit regulasi, analisa gap, dan blueprint channel pembayaran</p>
                </li>
                <li class="rounded-2xl border-2 border-indigo-200/60 dark:border-indigo-700/40 bg-white/90 dark:bg-white/10 p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      02
                    </div>
                    <div class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                      <UIcon name="i-lucide-settings" class="text-indigo-600 dark:text-indigo-400 size-4" />
                    </div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Build & Integrate</p>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300">Setup teknis, legal drafting, onboarding dokumentasi, dan UAT</p>
                </li>
                <li class="rounded-2xl border-2 border-emerald-200/60 dark:border-emerald-700/40 bg-white/90 dark:bg-white/10 p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      03
                    </div>
                    <div class="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                      <UIcon name="i-lucide-activity" class="text-emerald-600 dark:text-emerald-400 size-4" />
                    </div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Run & Monitor</p>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300">Operasional harian, SLA dashboard, eskalasi prioritas, dan alert otomatis</p>
                </li>
                <li class="rounded-2xl border-2 border-purple-200/60 dark:border-purple-700/40 bg-white/90 dark:bg-white/10 p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      04
                    </div>
                    <div class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                      <UIcon name="i-lucide-trending-up" class="text-purple-600 dark:text-purple-400 size-4" />
                    </div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Scale & Innovate</p>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300">Ekspansi negara baru, optimalisasi biaya, dan program partnership</p>
                </li>
              </ol>
            </div>
            <div class="rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-gradient-to-br from-gray-900/5 via-white to-gray-900/5 dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900/40 p-6 shadow-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2.5 rounded-2xl bg-gray-900 text-white shadow-lg">
                  <UIcon name="i-lucide-award" class="size-5" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-gray-700 dark:text-gray-200 font-semibold">Nilai Tambah</p>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Keunggulan Layanan</h3>
                </div>
              </div>
              <div class="space-y-4 text-sm text-gray-700 dark:text-gray-200">
                <div class="flex gap-3">
                  <UIcon name="i-lucide-cpu" class="text-primary-500 size-6" />
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Platform modular</p>
                    <p>Integrasi API, webhook, panel admin, serta approval workflow berbasis role.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <UIcon name="i-lucide-clipboard-check" class="text-primary-500 size-6" />
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Dokumentasi Siap Audit</p>
                    <p>Proses terdokumentasi otomatis untuk memudahkan kebutuhan regulator dan due diligence investor</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <UIcon name="i-lucide-user-cog" class="text-primary-500 size-6" />
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">SLA personal</p>
                    <p>Dedicated success channel dengan jalur respon terukur dan tindak lanjut terjadwal.</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <UIcon name="i-lucide-earth" class="text-primary-500 size-6" />
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Jaringan global</p>
                    <p>Kemitraan resmi payment gateway, bank koresponden, dan penyedia KYC internasional.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div class="rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/50 p-6 shadow-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white shadow-lg flex items-center justify-center">
                  <UIcon name="i-lucide-shield-check" class="size-6" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-300 font-semibold">Legalitas & Kepatuhan</p>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Dokumen Resmi Tersedia On-demand</h3>
                </div>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-200 mb-5">
                Seluruh legalitas perusahaan, termasuk NIB, OSS RBA, perizinan daerah, NPWP, serta pernyataan pemenuhan kewajiban perpajakan tersedia dalam portal dokumen digital yang dapat dibagikan kepada mitra secara aman.
              </p>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border-2 border-blue-200/70 dark:border-blue-500/50 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-500/20 dark:via-gray-900/40 dark:to-blue-700/20 p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2.5 rounded-xl bg-blue-500 dark:bg-blue-600">
                      <UIcon name="i-lucide-folder-open" class="text-white size-5" />
                    </div>
                    <h4 class="text-sm font-bold text-blue-700 dark:text-blue-200">Dokumen Inti</h4>
                  </div>
                  <ul class="space-y-2 text-xs text-gray-700 dark:text-gray-200">
                    <li class="flex items-start gap-2">
                      <UIcon name="i-lucide-file-check" class="text-blue-500 dark:text-blue-400 size-3.5 mt-0.5 flex-shrink-0" />
                      <span>NIB PT Jasa Gudang Indonesia</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <UIcon name="i-lucide-file-check" class="text-blue-500 dark:text-blue-400 size-3.5 mt-0.5 flex-shrink-0" />
                      <span>NIB PT Jasa Gudang Tangerang</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <UIcon name="i-lucide-file-check" class="text-blue-500 dark:text-blue-400 size-3.5 mt-0.5 flex-shrink-0" />
                      <span>SIUP, TDP, NPWP, SK Menkumham</span>
                    </li>
                  </ul>
                </div>
                <div class="rounded-2xl border-2 border-emerald-200/70 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-emerald-500/20 dark:via-gray-900/40 dark:to-emerald-700/20 p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2.5 rounded-xl bg-emerald-500 dark:bg-emerald-600">
                      <UIcon name="i-lucide-shield-check" class="text-white size-5" />
                    </div>
                    <h4 class="text-sm font-bold text-emerald-700 dark:text-emerald-200">Program Kepatuhan</h4>
                  </div>
                  <ul class="space-y-2 text-xs text-gray-700 dark:text-gray-200">
                    <li class="flex items-start gap-2">
                      <UIcon name="i-lucide-check-circle-2" class="text-emerald-500 dark:text-emerald-400 size-3.5 mt-0.5 flex-shrink-0" />
                      <span>Pemantauan transaksi, KYC, dan screening daftar sanksi otomatis</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <UIcon name="i-lucide-check-circle-2" class="text-emerald-500 dark:text-emerald-400 size-3.5 mt-0.5 flex-shrink-0" />
                      <span>Audit internal triwulan & audit eksternal tahunan</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <UIcon name="i-lucide-check-circle-2" class="text-emerald-500 dark:text-emerald-400 size-3.5 mt-0.5 flex-shrink-0" />
                      <span>Pelaporan pajak & SPT tepat waktu</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href="/documents/nib-indonesia.pdf"
                  target="_blank"
                  class="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all group"
                >
                  <span class="flex items-center gap-2">
                    <UIcon name="i-lucide-file-text" class="size-4" />
                    NIB PT JGI
                  </span>
                  <UIcon name="i-lucide-download" class="size-5 group-hover:translate-y-0.5 transition-transform" />
                </a>
                <a
                  href="/documents/nib-tangerang.pdf"
                  target="_blank"
                  class="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all group"
                >
                  <span class="flex items-center gap-2">
                    <UIcon name="i-lucide-file-text" class="size-4" />
                    NIB PT JGT
                  </span>
                  <UIcon name="i-lucide-download" class="size-5 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>
              <div class="mt-5 flex items-start gap-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-500/10 border-2 border-indigo-200/60 dark:border-indigo-500/40 p-4">
                <div class="p-2 rounded-xl bg-indigo-500 dark:bg-indigo-600">
                  <UIcon name="i-lucide-shield-check" class="text-white size-5" />
                </div>
                <p class="text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                  Merujuk pedoman <strong>OJK</strong>, <strong>Bank Indonesia</strong>, dan PSE Kominfo dalam setiap engagement untuk memastikan dokumen siap ditinjau
                </p>
              </div>
            </div>
            <div class="rounded-3xl border border-primary-200/60 dark:border-primary-500/40 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-primary-500/20 dark:via-gray-900/40 dark:to-primary-700/20 p-6 shadow-2xl">
              <div class="flex items-center justify-between gap-4 mb-4">
                <div class="flex items-center gap-3">
                  <div class="p-2.5 rounded-2xl bg-white text-primary-600 shadow-lg">
                    <UIcon name="i-lucide-globe" class="size-5" />
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-200 font-semibold">Ekosistem</p>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Jaringan Kolaborasi</h3>
                  </div>
                </div>
                <div class="flex items-center gap-3 text-[11px] font-semibold text-primary-700 dark:text-primary-200">
                  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-primary-700 border border-primary-100 dark:bg-primary-500/10 dark:border-primary-400/30">
                    <UIcon name="i-lucide-flag-triangle-right" class="size-4" />
                    1 Platform
                  </span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-primary-700 border border-primary-100 dark:bg-primary-500/10 dark:border-primary-400/30">
                    <UIcon name="i-lucide-layers" class="size-4" />
                    3 Unit Bisnis
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-700 dark:text-white/80 mb-4">
                Satu ekosistem yang menghubungkan workspace premium, orkestrasi pembayaran global, dan keamanan transaksi real-time. Semua entitas berbagi panduan kerja yang sama dengan dashboard status terpadu.
              </p>
              <div class="space-y-5">
                <NuxtLink
                  to="https://ruangoffice.com"
                  target="_blank"
                  class="company-link rounded-2xl border border-primary-200/60 dark:border-primary-500/40 bg-white/95 dark:bg-white/5 p-5 flex flex-col gap-5 hover:border-primary-400 dark:hover:border-primary-400/80 hover:shadow-lg transition-all"
                >
                  <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div class="flex items-start gap-3">
                      <div class="p-2.5 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                        <UIcon name="i-lucide-building-2" class="size-5" />
                      </div>
                      <div>
                        <p class="text-base font-semibold text-gray-900 dark:text-white">RuangOffice.com</p>
                        <p class="text-xs text-gray-600 dark:text-gray-300">Virtual office premium, sekretariat profesional, dan meeting suite siap pakai.</p>
                      </div>
                    </div>
                    <UIcon name="i-lucide-arrow-up-right" class="size-5 text-primary-500" />
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-[12px] text-gray-600 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-map-pin" class="size-4 text-primary-500" />
                      <span>7 kota operasional</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-badge-check" class="size-4 text-primary-500" />
                      <span>Workspace profesional</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-users" class="size-4 text-primary-500" />
                      <span>Dedicated concierge</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-clipboard-list" class="size-4 text-primary-500" />
                      <span>NIB & OSS ready</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-primary-700 dark:text-primary-200">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-400/40">
                      <UIcon name="i-lucide-briefcase" class="size-3" />
                      Workspace & compliance hub
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-400/40">
                      <UIcon name="i-lucide-badge-check" class="size-3" />
                      Visit ready
                    </span>
                  </div>
                </NuxtLink>
                <NuxtLink
                  to="/"
                  target="_blank"
                  class="company-link rounded-2xl border border-primary-200/60 dark:border-primary-500/40 bg-white/95 dark:bg-white/5 p-5 flex flex-col gap-5 hover:border-primary-400 dark:hover-border-primary-400/80 hover:shadow-lg transition-all"
                >
                  <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div class="flex items-start gap-3">
                      <div class="p-2.5 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                        <UIcon name="i-lucide-credit-card" class="size-5" />
                      </div>
                      <div>
                        <p class="text-base font-semibold text-gray-900 dark:text-white">JasaPembayaran.com</p>
                        <p class="text-xs text-gray-600 dark:text-gray-300">Payment orchestration, procurement global, compliance desk, dan BPO.</p>
                      </div>
                    </div>
                    <UIcon name="i-lucide-arrow-up-right" class="size-5 text-primary-500" />
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-[12px] text-gray-600 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-users" class="size-4 text-primary-500" />
                      <span>350+ klien aktif</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-alarm-clock" class="size-4 text-primary-500" />
                      <span>Respon prioritas</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-zap" class="size-4 text-primary-500" />
                      <span>Realtime dashboard</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-shield" class="size-4 text-primary-500" />
                      <span>Pengawasan risiko 24/7</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-primary-700 dark:text-primary-200">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-400/40">
                      <UIcon name="i-lucide-cpu" class="size-3" />
                      Core payment engine
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-400/40">
                      <UIcon name="i-lucide-shield" class="size-3" />
                      Ops & Compliance
                    </span>
                  </div>
                </NuxtLink>
                <NuxtLink
                  to="https://jasaguard.com"
                  target="_blank"
                  class="company-link rounded-2xl border border-primary-200/60 dark:border-primary-500/40 bg-white/95 dark:bg-white/5 p-5 flex flex-col gap-5 hover:border-primary-400 dark:hover:border-primary-400/80 hover:shadow-lg transition-all"
                >
                  <div class="flex items-center justify-between gap-4 flex-wrap">
                    <div class="flex items-start gap-3">
                      <div class="p-2.5 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                        <UIcon name="i-lucide-shield-check" class="size-5" />
                      </div>
                      <div>
                        <p class="text-base font-semibold text-gray-900 dark:text-white">JasaGuard.com</p>
                        <p class="text-xs text-gray-600 dark:text-gray-300">Security operation center, pemantauan aktivitas transaksi, dan digital forensics.</p>
                      </div>
                    </div>
                    <UIcon name="i-lucide-arrow-up-right" class="size-5 text-primary-500" />
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-[12px] text-gray-600 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-shield-alert" class="size-4 text-primary-500" />
                      <span>Monitoring insiden</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-activity" class="size-4 text-primary-500" />
                      <span>Live risk scoring</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-database" class="size-4 text-primary-500" />
                      <span>Forensics vault</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-clock" class="size-4 text-primary-500" />
                      <span>Beta 2025</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-primary-700 dark:text-primary-200">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-400/40">
                      <UIcon name="i-lucide-shield" class="size-3" />
                      Security & compliance stack
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-400/40">
                      <UIcon name="i-lucide-clock" class="size-3" />
                      Waitlist open
                    </span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </section>

          <section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/50 p-6 shadow-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 text-white shadow-lg">
                  <UIcon name="i-lucide-compass" class="size-5" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-300 font-semibold">Visi & Misi</p>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Fokus pada Pembayaran Digital Indonesia</h3>
                </div>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border border-primary-200/60 dark:border-primary-500/40 bg-primary-50/80 dark:bg-primary-500/10 p-4">
                  <p class="text-xs font-semibold uppercase text-primary-700 dark:text-primary-200">Visi</p>
                  <p class="text-sm text-gray-700 dark:text-gray-200 mt-2">Membangun ekosistem pembayaran lintas negara yang inklusif, kredibel, dan berkelanjutan.</p>
                </div>
                <div class="rounded-2xl border border-primary-200/60 dark:border-primary-500/40 bg-primary-50/80 dark:bg-primary-500/10 p-4">
                  <p class="text-xs font-semibold uppercase text-primary-700 dark:text-primary-200">Misi</p>
                  <ul class="mt-2 space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
                    <li>• Menjaga integritas regulasi dan tata kelola data</li>
                    <li>• Mendorong inovasi teknologi praktis</li>
                    <li>• Memberikan layanan personal dan measurable</li>
                    <li>• Menghasilkan dampak ekonomi digital nasional</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="rounded-3xl border border-primary-200/60 dark:border-primary-500/40 bg-white/98 dark:bg-gradient-to-br dark:from-primary-500/20 dark:via-gray-900/40 dark:to-primary-400/20 p-6 shadow-2xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white shadow-lg">
                  <UIcon name="i-lucide-phone-call" class="size-5" />
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-200 font-semibold">Hubungi Kami</p>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Terhubung Lebih Cepat</h3>
                </div>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="contact-card rounded-2xl border border-primary-100 dark:border-white/20 bg-primary-50/70 dark:bg-white/5 p-5 text-gray-800 dark:text-white space-y-5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="p-2 rounded-xl bg-white text-primary-600 dark:bg-primary-500/20 dark:text-primary-100 shadow">
                        <UIcon name="i-lucide-map-pin" class="size-4" />
                      </div>
                      <p class="text-xs uppercase tracking-[0.2em] font-semibold">Kantor Operasional</p>
                    </div>
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-white text-primary-600 dark:bg-primary-500/20 dark:text-primary-100 font-semibold">Audit ready</span>
                  </div>
                  <div class="grid gap-2 text-sm">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-building" class="size-4 text-primary-500" />
                      <span>PT Jasa Gudang Indonesia</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-map" class="size-4 text-primary-500" />
                      <span>Rukan GreatWall Blok A No. 38</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-locate-fixed" class="size-4 text-primary-500" />
                      <span>Tangerang, Banten 15146</span>
                    </div>
                  </div>
                  <div class="rounded-xl bg-white/85 dark:bg-white/10 border border-primary-100/60 dark:border-white/10 p-3 text-[11px] text-gray-600 dark:text-white/70 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-file-lock" class="size-4 text-primary-500" />
                      <span>Safe storage dokumen & akses tamu terverifikasi.</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-users" class="size-4 text-primary-500" />
                      <span>Ruang rapat privat untuk audit/regulator.</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-badge-check" class="size-4 text-primary-500" />
                      <span>Visitor log & CCTV terintegrasi.</span>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Greenlake+City+Boulevard,+Rukan+GreatWall+Blok+A+No.+38+Cipondoh,+Kota+Tangerang,+Banten+15146+Indonesia"
                    target="_blank"
                    class="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-100 hover:gap-3 transition-all"
                  >
                    <UIcon name="i-lucide-navigation" class="size-4" />
                    Lihat di Google Maps
                  </a>
                </div>
                <div class="contact-card rounded-2xl border border-primary-100 dark:border-white/20 bg-primary-50/70 dark:bg-white/5 p-5 text-gray-800 dark:text-white space-y-5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="p-2 rounded-xl bg-white text-primary-600 dark:bg-primary-500/20 dark:text-primary-100 shadow">
                        <UIcon name="i-lucide-headphones" class="size-4" />
                      </div>
                      <p class="text-xs uppercase tracking-[0.2em] font-semibold">Kanal Prioritas</p>
                    </div>
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-white text-primary-600 dark:bg-primary-500/20 dark:text-primary-100 font-semibold">Prioritas chat</span>
                  </div>
                  <div class="space-y-2 text-sm font-medium">
                    <a href="https://api.whatsapp.com/send/?phone=628988888250" target="_blank" class="flex items-center gap-2 text-primary-700 dark:text-primary-100 font-semibold">
                      <UIcon name="i-lucide-phone-call" class="size-4" />
                      +62 89 8888 8250 (WhatsApp 24/7)
                    </a>
                    <a href="mailto:admin@JasaPembayaran.com" class="flex items-center gap-2 text-gray-700 dark:text-white">
                      <UIcon name="i-lucide-mail" class="size-4" />
                      admin@JasaPembayaran.com
                    </a>
                    <a href="/" target="_blank" class="flex items-center gap-2 text-gray-700 dark:text-white">
                      <UIcon name="i-lucide-globe" class="size-4" />
                      jasapembayaran.com
                    </a>
                  </div>
                  <div class="rounded-xl bg-white/85 dark:bg-white/10 border border-primary-100/60 dark:border-white/10 p-3 text-[11px] text-gray-600 dark:text-white/70 space-y-1.5">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-clock-3" class="size-4 text-primary-500" />
                      <span>Senin–Jumat 09.00-17.00 • Sabtu 09.00-15.00</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-zap" class="size-4 text-primary-500" />
                      <span>Support online dan alert compliance aktif 24/7.</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-file-check-2" class="size-4 text-primary-500" />
                      <span>Siap NDA & enkripsi sebelum pertukaran dokumen.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href="https://cal.com/ruangoffice/discovery"
                  target="_blank"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary-600 text-white text-sm font-semibold shadow-lg hover:bg-primary-700 transition-all"
                >
                  <UIcon name="i-lucide-calendar" class="size-5" />
                  Booking Discovery Call
                </a>
                <a
                  href="https://wa.me/628988888250?text=Halo%20Jasa%20Pembayaran,%20saya%20ingin%20konsultasi%20mengenai%20layanan."
                  target="_blank"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-primary-200 text-primary-600 dark:border-white/30 dark:text-white text-sm font-semibold hover:bg-primary-50 dark:hover:bg-white/10 transition-all"
                >
                  <UIcon name="i-lucide-message-square" class="size-5" />
                  Chat Prioritas 24/7
                </a>
              </div>
              <div class="mt-4 flex items-center gap-2 text-[11px] text-gray-600 dark:text-white/70">
                <UIcon name="i-lucide-shield-check" class="size-4 text-primary-500" />
                <p>Konsultasi awal bebas biaya. NDA & enkripsi end-to-end siap sebelum pertukaran dokumen.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <LazyStarsBg />
  </div>
</template>

<style scoped>
/* Premium Company Profile Styles */
.company-profile-content {
  will-change: scroll-position;
}

.company-link,
.service-card,
.contact-card {
  will-change: transform, border-color;
}

.company-link:hover,
.service-card:hover,
.contact-card:hover {
  transform: translateY(-2px);
}

/* Smooth scrollbar */
.company-profile-content::-webkit-scrollbar {
  width: 6px;
}

.company-profile-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.dark .company-profile-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.company-profile-content::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

.company-profile-content::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* Smooth Animations */
@media (prefers-reduced-motion: no-preference) {
  .company-link,
  .service-card,
  .contact-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .company-link,
  .service-card,
  .contact-card {
    transition: none !important;
  }
}

/* Mobile Optimization */
@media (max-width: 768px) {
  #company-profile-section {
    padding: 1rem !important;
  }
  
  .company-profile-content {
    max-height: 500px !important;
  }
}
</style>


