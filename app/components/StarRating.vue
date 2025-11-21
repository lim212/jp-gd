<template>
  <section class="max-w-[900px] mx-auto mt-8">
    <div class="rating-card relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-elevated/60 backdrop-blur-sm shadow-lg">
      <div class="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.10),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.10),transparent_40%)]"></div>
      <div class="relative p-6">
        <div class="flex flex-col items-center text-center gap-3">
          <h3 class="text-lg font-semibold tracking-wide">Apakah artikel ini bermanfaat?</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Beri kami rating 5 bintang ya ✨</p>
          <div
            class="flex items-center gap-2 select-none"
            role="radiogroup"
            aria-label="Rating artikel"
          >
            <button
              v-for="n in 5"
              :key="n"
              class="group relative grid place-items-center rounded-lg transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              :style="{ width: `${starPx}px`, height: `${starPx}px` }"
              type="button"
              :aria-checked="rating === n"
              role="radio"
              :aria-label="`Beri ${n} bintang`"
              @click="setRating(n)"
              @mouseenter="hover = n"
              @mouseleave="hover = 0"
              @keyup.enter.space.prevent="setRating(n)"
            >
              <svg :width="starPx" :height="starPx" viewBox="0 0 24 24" class="transition-transform group-active:scale-95">
                <defs>
                  <linearGradient :id="`grad-${uid}-${n}`" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :stop-color="active(n) ? '#0ea5e9' : '#e5e7eb'" />
                    <stop offset="100%" :stop-color="active(n) ? '#06b6d4' : '#e5e7eb'" />
                  </linearGradient>
                </defs>
                <path
                  :fill="`url(#grad-${uid}-${n})`"
                  stroke="currentColor"
                  :class="active(n) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-500'"
                  stroke-width="0.5"
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 mt-1" aria-live="polite">
            {{ averageDisplay }} dari {{ count }} rating
          </p>
          <p v-if="hasVoted" class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Terima kasih! Rating tersimpan.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const props = defineProps<{ slug: string; size?: number }>()

const rating = ref<number>(0)
const hover = ref<number>(0)
const hasVoted = ref<boolean>(false)
const uid = Math.random().toString(36).slice(2)

// Aggregated (global) rating stats
const avg = ref<number>(0)
const count = ref<number>(0)
const loading = ref<boolean>(false)

const starPx = computed(() => Math.max(20, Math.min(48, props.size || 32)))
const averageDisplay = computed(() => (avg.value > 0 ? avg.value.toFixed(1) : '0.0'))

function storageKey(slug: string) {
  return `rating:blog:${slug}`
}

function readStoredRating() {
  if (typeof window === 'undefined') return 0
  try {
    const val = window.localStorage.getItem(storageKey(props.slug))
    const num = val ? parseInt(val, 10) : 0
    return Number.isFinite(num) ? Math.max(0, Math.min(5, num)) : 0
  } catch {
    return 0
  }
}

function writeStoredRating(val: number) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey(props.slug), String(val))
  } catch {}
}

function active(n: number) {
  return (hover.value || rating.value) >= n
}

async function loadAggregate() {
  try {
    loading.value = true
    const res: any = await $fetch(`/api/ratings/${encodeURIComponent(props.slug)}`)
    avg.value = Number(res?.avg) || 0
    count.value = Number(res?.count) || 0
  } catch {
    // ignore; keep defaults
  } finally {
    loading.value = false
  }
}

async function submitVote(n: number) {
  try {
    const res: any = await $fetch(`/api/ratings/${encodeURIComponent(props.slug)}`, {
      method: 'POST',
      body: { rating: n },
      timeout: 8000,
    })
    avg.value = Number(res?.avg) || avg.value
    count.value = Number(res?.count) || count.value
  } catch {
    // ignore network error; local vote still stored
  }
}

function setRating(n: number) {
  // Prevent multiple votes from same browser (simple client-side guard)
  if (hasVoted.value) return
  rating.value = n
  writeStoredRating(n)
  hasVoted.value = true
  // Send to server to update global aggregate
  submitVote(n)
}

onMounted(() => {
  const existing = readStoredRating()
  if (existing > 0) {
    rating.value = existing
    hasVoted.value = true
  }
  // Always load global aggregate so everyone can see average rating
  loadAggregate()
})
</script>

<style scoped>
.rating-card::after {
  content: "";
  position: absolute;
  inset: -2px;
  padding: 2px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(59, 130, 246, 0.35));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
</style>

