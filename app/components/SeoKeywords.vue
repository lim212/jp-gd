<template>
  <section
    class="seo-keywords not-prose mt-6 mb-2 px-0 sm:px-4 lg:px-6"
    aria-label="SEO Keywords"
  >
    <details class="group rounded-2xl border-2 border-emerald-200/60 dark:border-emerald-700/60 bg-gradient-to-br from-white/90 via-emerald-50/80 to-teal-50/60 dark:from-slate-900/95 dark:via-emerald-900/80 dark:to-teal-900/90 backdrop-blur-xl p-4 md:p-6 shadow-xl hover:shadow-emerald-400/30 dark:hover:shadow-emerald-500/20 transition-all duration-500 relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 dark:from-emerald-400/10 dark:to-teal-500/10 rounded-full blur-2xl"></div>
      
      <summary class="flex items-center gap-3 cursor-pointer select-none list-none relative z-10">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-lg">
            <UIcon name="i-lucide-tags" class="w-4 h-4 text-white" />
          </div>
          <span class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-100/90 to-teal-100/90 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300/60 dark:ring-emerald-600/40 px-3 py-2 text-sm font-bold">
            Jasa PayPal & Layanan Terkait
          </span>
        </div>
        <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">(klik untuk lihat lebih banyak)</span>
        <span class="ml-auto text-slate-400 group-open:rotate-180 transition-transform duration-300" aria-hidden="true">
          <UIcon name="i-lucide-chevron-down" class="w-5 h-5" />
        </span>
      </summary>
      
      <div class="mt-6 flex flex-wrap gap-2 md:gap-3 relative z-10">
        <span v-for="(k, i) in keywords" :key="i"
              class="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
              :class="[
                k.toLowerCase().includes('jasa paypal') 
                  ? 'bg-gradient-to-r from-emerald-100/90 via-teal-100/90 to-cyan-100/90 dark:from-emerald-900/50 dark:via-teal-900/50 dark:to-cyan-900/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300/60 dark:ring-emerald-500/60 hover:ring-emerald-400/80 dark:hover:ring-emerald-400/80 hover:shadow-lg hover:shadow-emerald-300/40 dark:hover:shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-slate-100/90 to-gray-100/90 dark:from-slate-800/80 dark:to-gray-800/80 text-slate-700 dark:text-slate-300 ring-2 ring-slate-200/60 dark:ring-slate-700/60 hover:ring-slate-300/80 dark:hover:ring-slate-600/80 hover:shadow-lg hover:shadow-slate-300/30 dark:hover:shadow-slate-600/20 hover:text-emerald-700 dark:hover:text-emerald-300'
              ]">
          <!-- Enhanced Icon -->
          <span :class="[
            'size-2.5 md:size-3 rounded-full flex-shrink-0 transition-all duration-300',
            k.toLowerCase().includes('jasa paypal') 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm group-hover:scale-110' 
              : 'bg-gradient-to-r from-emerald-400/80 to-teal-400/80 group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:scale-110'
          ]"></span>
          <span class="font-bold">{{ k }}</span>
        </span>
      </div>
    </details>
    <p class="sr-only">{{ keywords.join(', ') }}</p>
  </section>
</template>

<script setup lang="ts">
import { seoKeywords as keywords } from '~/utils/seoKeywords'

// Expose for parent if needed
defineExpose({ keywords })
</script>

<style scoped>
/*****
  Accessible visually-hidden helper for the sr-only paragraph
*****/
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

