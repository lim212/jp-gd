<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

// i18n for translations
const { t } = useI18n()

interface WhyWe {
  title: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Make items reactive to support translations
const items = computed<WhyWe[]>(() => [
  {
    title: t('why_we.security.title'),
    description: t('why_we.security.description'),
    image: "/images/why-we/finance.png",
    icon: "i-lucide-shield-check",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-teal-50"
  },
  {
    title: t('why_we.response.title'),
    description: t('why_we.response.description'),
    image: "/images/why-we/customer-service.png",
    icon: "i-lucide-zap",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    title: t('why_we.service.title'),
    description: t('why_we.service.description'),
    image: "/images/why-we/salary.png",
    icon: "i-lucide-award",
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50"
  },
  {
    title: t('why_we.trust.title'),
    description: t('why_we.trust.description'),
    image: "/images/why-we/trust.png",
    icon: "i-lucide-handshake",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50"
  },
]);
</script>

<template>
  <div
    id="whywe-section"
    class="@container py-8 lg:py-12 px-4 sm:px-6 lg:px-8 relative"
  >
    <!-- Professional Header Section -->
    <div class="text-center mb-8">
      <!-- Clean Title -->
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        {{ t('why_we.title') }}
      </h2>
      
      <div class="max-w-7xl mx-auto">
        <!-- Professional Description Box - Full Width RAPI -->
        <div class="relative bg-gradient-to-br from-gray-50/90 via-blue-50/40 to-indigo-50/30 dark:from-gray-800/95 dark:via-blue-950/40 dark:to-indigo-950/30 rounded-2xl shadow-xl border border-blue-200/50 dark:border-gray-700/50 p-6 lg:p-8 overflow-hidden">
          <!-- Background Effects -->
          <div class="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 dark:from-blue-400/5 dark:to-indigo-500/5 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/8 to-pink-500/8 dark:from-purple-400/3 dark:to-pink-500/3 rounded-full blur-2xl"></div>
          
          <div class="relative z-10">
            <!-- Main Description -->
            <div class="text-center mb-6">
              <p class="text-lg lg:text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium mb-4">
                Kami berkomitmen menghadirkan
                <span
                  class="text-blue-600 dark:text-blue-400 font-extrabold underline decoration-blue-400/70 dark:decoration-blue-300/80 decoration-2 underline-offset-4"
                >
                  layanan pembayaran digital yang aman, cepat, dan terpercaya
                </span>
                untuk memenuhi kebutuhan transaksi Anda dengan standar internasional.
              </p>
              
              <p class="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Dengan dukungan
                <span
                  class="text-indigo-600 dark:text-indigo-300 font-bold underline decoration-indigo-400/70 dark:decoration-indigo-300/80 decoration-2 underline-offset-4"
                >
                  teknologi terkini
                </span>,
                <span
                  class="text-purple-600 dark:text-purple-300 font-bold underline decoration-purple-400/70 dark:decoration-purple-300/80 decoration-2 underline-offset-4"
                >
                  sistem keamanan berlapis
                </span>,
                dan
                <span
                  class="text-emerald-600 dark:text-emerald-300 font-bold underline decoration-emerald-400/70 dark:decoration-emerald-300/80 decoration-2 underline-offset-4"
                >
                  tim profesional berpengalaman
                </span>,
                kami menjadi
                <span
                  class="text-rose-600 dark:text-rose-300 font-bold underline decoration-rose-400/70 dark:decoration-rose-300/80 decoration-2 underline-offset-4"
                >
                  pilihan utama
                </span>
                bagi individu dan bisnis yang mengutamakan kemudahan, keamanan, dan kepercayaan dalam setiap transaksi digital.
              </p>
            </div>
            
            <!-- Key Benefits Grid - Professional & Rapi -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 mt-6">
              <div class="why-benefit-card bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/30 dark:via-gray-900/40 dark:to-cyan-900/30 rounded-xl p-4 border-2 border-blue-200/70 dark:border-blue-500/50 shadow-md hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-3">
                  <div class="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 rounded-xl shadow-lg">
                    <UIcon name="i-lucide-shield-check" class="size-5 text-white" />
                  </div>
                  <span class="text-sm font-black text-gray-900 dark:text-gray-100">Keamanan Tingkat Bank</span>
                </div>
              </div>
              <div class="why-benefit-card bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/30 dark:via-gray-900/40 dark:to-purple-900/30 rounded-xl p-4 border-2 border-indigo-200/70 dark:border-indigo-500/50 shadow-md hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-3">
                  <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg">
                    <UIcon name="i-lucide-zap" class="size-5 text-white" />
                  </div>
                  <span class="text-sm font-black text-gray-900 dark:text-gray-100">Proses Instan 24/7</span>
                </div>
              </div>
              <div class="why-benefit-card bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900/30 dark:via-gray-900/40 dark:to-gray-800/30 rounded-xl p-4 border-2 border-slate-200/70 dark:border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-3">
                  <div class="p-3 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 rounded-xl shadow-lg">
                    <UIcon name="i-lucide-headphones" class="size-5 text-white" />
                  </div>
                  <span class="text-sm font-black text-gray-900 dark:text-gray-100">Support Profesional</span>
                </div>
              </div>
            </div>
            
            <!-- Bottom Commitment - Professional & Attractive -->
            <div class="text-center pt-5 border-t-2 border-gray-300/50 dark:border-gray-600/50">
              <div class="flex items-center justify-center gap-3 mb-3">
                <div class="p-2.5 bg-gradient-to-br from-yellow-400 to-amber-500 dark:from-yellow-500 dark:to-amber-600 rounded-xl shadow-lg">
                  <UIcon name="i-lucide-star" class="size-5 text-white" />
                </div>
                <p class="text-lg text-gray-800 dark:text-gray-200 font-black">
                  <span class="text-amber-600 dark:text-amber-400">Kepercayaan Anda adalah prioritas utama kami</span>
                </p>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                Berpengalaman melayani ribuan transaksi dengan tingkat kepuasan <span class="text-emerald-600 dark:text-emerald-400 font-black">99.9%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Cards Grid - Full Width Uniform -->
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(item, key) in items"
          :key="key"
          class="why-card group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800/95 dark:via-gray-850/90 dark:to-gray-900/95 rounded-2xl border-2 border-gray-200/70 dark:border-gray-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden h-auto min-h-[360px] flex flex-col"
        >
          <!-- Background Effects -->
          <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" 
               :class="{
                 'bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-transparent dark:from-emerald-900/20 dark:via-teal-800/10': key === 0,
                 'bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-transparent dark:from-blue-900/20 dark:via-cyan-800/10': key === 1,
                 'bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-transparent dark:from-amber-900/20 dark:via-orange-800/10': key === 2,
                 'bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-900/20 dark:via-pink-800/10': key === 3
               }"></div>
          <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-500" :class="`bg-gradient-to-br ${item.color}`"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-500" :class="`bg-gradient-to-br ${item.color}`"></div>
          
          <div class="relative z-10 flex flex-col h-full">
            <!-- Step Number Badge - Professional -->
            <div class="absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border-[3px] border-white dark:border-gray-800 z-20 group-hover:scale-110 transition-transform ring-2 ring-white/50 dark:ring-gray-700/50" :class="`bg-gradient-to-br ${item.color}`">
              <span class="text-white font-black text-lg drop-shadow-lg">{{ key + 1 }}</span>
            </div>
            
            <!-- Icon Section - Professional -->
            <div class="flex justify-center mb-4 mt-2">
              <div class="p-4 rounded-2xl shadow-xl border-2 border-white/50 dark:border-gray-700/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" :class="`bg-gradient-to-br ${item.color}`">
                <UIcon :name="item.icon" class="size-8 text-white drop-shadow-lg" />
              </div>
            </div>

            <!-- Title Section - Professional -->
            <div class="mb-4 text-center">
              <h3 class="text-lg font-black text-gray-900 dark:text-white leading-tight">
                {{ item.title }}
              </h3>
            </div>

            <!-- Description Section - Professional -->
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-4 flex-1">
              {{ item.description }}
            </p>

            <!-- Features List - Professional with Icons -->
            <div class="mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div v-if="key === 0" class="flex items-center gap-2.5 justify-center">
                <div class="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md">
                  <UIcon name="i-lucide-lock" class="size-4 text-white" />
                </div>
                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">Enkripsi SSL 256-bit</span>
              </div>
              <div v-if="key === 1" class="flex items-center gap-2.5 justify-center">
                <div class="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                  <UIcon name="i-lucide-clock" class="size-4 text-white" />
                </div>
                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">Response &lt; 5 menit</span>
              </div>
              <div v-if="key === 2" class="flex items-center gap-2.5 justify-center">
                <div class="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
                  <UIcon name="i-lucide-shield-check" class="size-4 text-white" />
                </div>
                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">Garansi 100%</span>
              </div>
              <div v-if="key === 3" class="flex items-center gap-2.5 justify-center">
                <div class="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
                  <UIcon name="i-lucide-trending-up" class="size-4 text-white" />
                </div>
                <span class="text-xs font-bold text-gray-800 dark:text-gray-200">99.9% Uptime</span>
              </div>
            </div>
            
            <!-- Hover Effect Border - Professional -->
            <div class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 dark:group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Premium Why Card Styles */
.why-card {
  will-change: transform, box-shadow;
}

.why-card:hover {
  transform: translateY(-6px) scale(1.02);
}

.why-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.why-card:hover::before {
  opacity: 1;
}

/* Professional benefit cards - Rapi & Menarik */
.why-benefit-card {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.why-benefit-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.why-benefit-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(129, 140, 248, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.why-benefit-card:hover::before {
  opacity: 1;
}

.dark .why-benefit-card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.dark .why-benefit-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
}

/* Mobile Optimization - Uniform Heights */
@media (max-width: 768px) {
  #whywe-section {
    padding: 1.5rem 1rem !important;
  }
  
  .why-card {
    min-height: 340px !important;
  }
}

/* Tablet Optimization - 2 Columns */
@media (min-width: 769px) and (max-width: 1023px) {
  .why-card {
    min-height: 350px !important;
  }
}

/* Desktop Optimization - 4 Columns Perfect */
@media (min-width: 1024px) {
  .why-card {
    min-height: 360px !important;
  }
}

/* Smooth Animations */
@media (prefers-reduced-motion: no-preference) {
  .why-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .why-card,
  .why-card * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>