<template>
  <div class="relative flex flex-col trusted-partners">
    <div
      id="trusted-partners-section"
      class="@container trusted-partners-override mb-0 pt-0 pb-0 sm:pb-0 gap-0 overflow-hidden"
    >
      <div class="mt-0 mb-0 pt-0 pb-0" style="margin-top: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important;">
        <UiTitleBase class="mt-0 mb-0 pt-0 pb-0" style="margin-top: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important;">
          <div class="flex items-center gap-4 justify-center mb-0 mt-0 pt-0 relative" style="padding-top: 0 !important; margin-top: 0 !important;">
            <div class="relative group">
              <UIcon name="i-lucide-shield-check" class="text-purple-500 size-5 md:size-6 lg:size-7 drop-shadow-md transition-all duration-700 ease-in-out md:animate-pulse" />
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
              <div class="absolute inset-0 bg-purple-400/20 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            </div>
            <div class="flex flex-col items-center sm:flex-row sm:gap-2">
              <span class="text-purple-500 font-extrabold relative text-base md:text-lg lg:text-xl tracking-wider drop-shadow-sm">TRUSTED</span>
              <span class="text-gray-900 dark:text-white font-extrabold text-base md:text-lg lg:text-xl tracking-wider drop-shadow-sm">PARTNERS</span>
            </div>
            <div class="relative group">
              <UIcon name="i-lucide-award" class="text-purple-500 size-5 md:size-6 lg:size-7 drop-shadow-md transition-all duration-700 ease-in-out md:animate-pulse" />
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
              <div class="absolute inset-0 bg-purple-400/20 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            </div>
          </div>
        </UiTitleBase>
      </div>
      <div class="max-w-[720px] mx-auto px-4 mb-0 sm:mb-0 mt-0 pt-0 relative hidden sm:block" style="margin-top: 0 !important; padding-top: 0 !important;">
        <p class="text-center text-gray-700 dark:text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed font-medium mt-0 pt-0 mb-0" style="margin-top: 0 !important; padding-top: 0 !important;">
          Kami bekerja sama dengan berbagai brand terpercaya untuk memberikan layanan terbaik.
        </p>
      </div>

      <div class="tp-slider relative px-4 sm:px-4 lg:px-6 pb-0 sm:pb-0 mt-1 sm:mt-2 overflow-hidden w-full mobile-p-3 mobile-mb-4" role="region" aria-label="Trusted partners carousel" @mouseenter="pauseAuto" @mouseleave="resumeAuto" @touchstart="onTouchStart" @touchmove.passive="onTouchMove" @touchend="onTouchEnd">
        <div class="tp-track flex transition-all duration-500 ease-out" :style="{ marginLeft: `-${currentSlide * 100}%` }">
          <div
            v-for="(group, gIdx) in slides"
            :key="gIdx"
            class="w-full shrink-0 tp-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-2 gap-y-1 sm:gap-2 md:gap-2 items-stretch justify-items-stretch mobile-grid-2 mobile-gap-2"
          >
            <div
              v-for="(partner, index) in group"
              :key="partner.name + index"
              class="tp-card bg-gradient-to-br from-gray-50 via-gray-100/90 to-blue-100/50 dark:from-gray-800 dark:via-gray-850/90 dark:to-blue-900/20 rounded-lg p-0 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center border border-blue-200/40 dark:border-blue-700/20 group md:hover:-translate-y-1 relative overflow-hidden h-24 md:h-28"
            >
              <!-- Glowing background effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-yellow-400/5 dark:from-blue-500/10 dark:to-yellow-500/10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>

              <!-- Logo container with enhanced styling -->
              <div class="tp-logo flex items-center justify-center h-8 sm:h-10 md:h-12 mb-1 sm:mb-2 transition-all duration-300 md:group-hover:scale-105 relative w-[92%] sm:w-[88%] md:w-[86%] px-2 border border-gray-200/70 dark:border-gray-700/50 rounded-md bg-gray-50/80 dark:bg-gray-800/70 overflow-hidden">
                <!-- Subtle glow behind logo -->
                <div class="absolute inset-0 bg-gray-100/60 dark:bg-gray-700/60 rounded-md blur-md opacity-0 md:group-hover:opacity-70 transition-opacity duration-500 scale-95 pointer-events-none"></div>
                <!-- Logo image with enhanced styling -->
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                  class="h-full w-auto max-w-full object-contain relative z-10 drop-shadow-sm md:group-hover:drop-shadow-md transition-all duration-500 filter dark:brightness-110"
                />
              </div>

              <!-- Partner name with enhanced styling -->
              <span class="block w-full truncate leading-tight text-xs md:text-xs text-gray-700 dark:text-gray-200 font-semibold text-center tracking-wide md:group-hover:text-gray-900 dark:md:group-hover:text-white transition-colors duration-300">
                {{ partner.name }}
              </span>

              <!-- Decorative corner elements (smaller for a cleaner look) -->
              <div class="absolute bottom-0 right-0 w-8 h-8 bg-blue-500/5 rounded-tl-full -z-10 md:group-hover:bg-blue-500/15 md:group-hover:w-10 md:group-hover:h-10 transition-all duration-500"></div>
              <div class="absolute top-0 left-0 w-7 h-7 bg-yellow-500/5 rounded-br-full -z-10 md:group-hover:bg-yellow-500/10 md:group-hover:w-9 md:group-hover:h-9 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        <!-- Nav controls -->
        <button
          type="button"
          class="tp-nav tp-prev absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md rounded-full p-1.5 ring-1 ring-black/5"
          @click="prevSlide"
          aria-label="Sebelumnya"
          :disabled="slides.length <= 1"
        >
          <UIcon name="i-lucide-arrow-left-circle" class="size-5" />
        </button>
        <button
          type="button"
          class="tp-nav tp-next absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md rounded-full p-1.5 ring-1 ring-black/5"
          @click="nextSlide"
          aria-label="Berikutnya"
          :disabled="slides.length <= 1"
        >
          <UIcon name="i-lucide-arrow-right-circle" class="size-5" />
        </button>

        <!-- Dots -->
        <div class="tp-dots flex items-center justify-center gap-2 mt-0.5">
          <button
            v-for="(s, i) in slides"
            :key="i"
            class="size-2.5 rounded-full transition-colors"
            :class="i === currentSlide ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'"
            @click="goToSlide(i)"
            :aria-label="`Ke slide ${i + 1}`"
          />
        </div>
      </div>
    </div>
    <LazyStarsBg />
  </div>
</template>

<script setup lang="ts">
interface Partner {
  name: string
  logo: string
}

const ITEMS_PER_SLIDE = 6 as const

// Define partners
const partners: Partner[] = [
  { name: 'PayPal', logo: '/logos/paypal.svg' },
  { name: 'Skrill', logo: '/logos/skrill.svg' },
  { name: 'VISA', logo: '/logos/visa.svg' },
  { name: 'MasterCard', logo: '/logos/mastercard.svg' },
  { name: 'Namecheap', logo: '/logos/namecheap-new.svg' },
  { name: 'NameSilo', logo: '/logos/Namesilo.svg' },
  { name: 'Neteller', logo: '/logos/neteller-new.svg' },
  { name: 'Semrush', logo: '/logos/semrush.svg' },
  { name: 'eBay', logo: '/logos/ebay-new.svg' },
  { name: 'Zoom', logo: '/logos/zoom-new.svg' },
  { name: 'Bitcoin', logo: '/logos/bitcoin.svg' }
]

// Group partners into slides of 6
const slides = computed(() => {
  const chunks: Partner[][] = []
  for (let i = 0; i < partners.length; i += ITEMS_PER_SLIDE) {
    const group = partners.slice(i, i + ITEMS_PER_SLIDE)
    // Pad the last group so each slide always shows exactly 6 items
    if (group.length < ITEMS_PER_SLIDE && partners.length > 0) {
      const toAdd = ITEMS_PER_SLIDE - group.length
      for (let j = 0; j < toAdd; j++) {
        group.push(partners[j % partners.length])
      }
    }
    chunks.push(group)
  }
  return chunks
})

const currentSlide = ref(0)

function nextSlide() {
  if (slides.value.length <= 1) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

function prevSlide() {
  if (slides.value.length <= 1) return
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

function goToSlide(i: number) {
  if (i < 0 || i >= slides.value.length) return
  currentSlide.value = i
}

// Auto-slide logic with pause/resume on hover and reduced motion respect
const isHovered = ref(false)
const AUTO_INTERVAL = 3000
let timer: ReturnType<typeof setInterval> | null = null
const autoDirection = ref<'forward' | 'backward'>('forward')

function stepAuto() {
  if (slides.value.length <= 1) return
  if (autoDirection.value === 'forward') {
    if (currentSlide.value >= slides.value.length - 1) {
      autoDirection.value = 'backward'
      prevSlide()
    } else {
      nextSlide()
    }
  } else {
    if (currentSlide.value <= 0) {
      autoDirection.value = 'forward'
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

onMounted(() => {
  if (import.meta.client && slides.value.length > 1) {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      timer = setInterval(() => {
        if (!isHovered.value) stepAuto()
      }, AUTO_INTERVAL)
    }
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function pauseAuto() { isHovered.value = true }
function resumeAuto() { isHovered.value = false }

// Touch swipe support (mobile)
const touchStartX = ref<number | null>(null)
const touchStartY = ref<number | null>(null)
const touchDeltaX = ref(0)
const isDragging = ref(false)

function onTouchStart(e: TouchEvent) {
  if (!e.touches || e.touches.length !== 1) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  touchDeltaX.value = 0
  isDragging.value = true
  pauseAuto()
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value || touchStartX.value === null || touchStartY.value === null) return
  const dx = e.touches[0].clientX - touchStartX.value
  const dy = e.touches[0].clientY - touchStartY.value
  // Only treat as swipe if horizontal movement dominates
  if (Math.abs(dx) > Math.abs(dy)) {
    touchDeltaX.value = dx
  } else {
    // vertical scroll - cancel drag
    isDragging.value = false
    touchStartX.value = touchStartY.value = null
    touchDeltaX.value = 0
    resumeAuto()
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  const threshold = 50
  if (touchDeltaX.value <= -threshold) {
    nextSlide()
  } else if (touchDeltaX.value >= threshold) {
    prevSlide()
  }
  touchStartX.value = touchStartY.value = null
  touchDeltaX.value = 0
  isDragging.value = false
  resumeAuto()
}
</script>

<style>
/* Override global UPageSection padding for trusted partners section */
.trusted-partners-override {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Ensure no padding on larger screens */
@media (min-width: 768px) {
  .trusted-partners-override {
    padding-top: 0 !important;
  }
}

/* Extra override for large screens */
@media (min-width: 1024px) {
  .trusted-partners-override {
    padding-top: 0 !important;
  }
}

/* Trusted Partners specific layout and responsive rules */
.trusted-partners #trusted-partners-section,
.trusted-partners #trusted-partners-section.UPageSection {
  /* Add proper spacing between sections */
  margin-top: 8px !important;
  padding-top: 8px !important;
  margin-bottom: 8px !important;
  padding-bottom: 8px !important;
}

@media (min-width: 640px) {
  .trusted-partners #trusted-partners-section,
  .trusted-partners #trusted-partners-section.UPageSection {
    margin-top: 8px !important;
  }
}

@media (min-width: 768px) {
  .trusted-partners #trusted-partners-section,
  .trusted-partners #trusted-partners-section.UPageSection {
    margin-top: 8px !important;
  }
}

@media (min-width: 1024px) {
  .trusted-partners #trusted-partners-section,
  .trusted-partners #trusted-partners-section.UPageSection {
    margin-top: 8px !important;
  }
}

@media (min-width: 1280px) {
  .trusted-partners #trusted-partners-section,
  .trusted-partners #trusted-partners-section.UPageSection {
    margin-top: 8px !important;
  }
}

@media (min-width: 1536px) {
  .trusted-partners #trusted-partners-section,
  .trusted-partners #trusted-partners-section.UPageSection {
    margin-top: 8px !important;
  }
}


/* Optional variant: force 4 columns even on mobile by adding class="tp-mobile-4col" to the component */
.trusted-partners.tp-mobile-4col .tp-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

/* Equal card sizes - make them fill grid cells uniformly */
.trusted-partners .tp-card {
  width: 100%;
  /* Removed overly large square aspect ratio to prevent giant boxes */
  /* aspect-ratio: 1 / 1; */
  padding: 4px;
  box-sizing: border-box;
  min-height: clamp(50px, 6vw, 72px);
}

/* Logo container and image fitting */
.trusted-partners .tp-logo {
  height: clamp(22px, 6vw, 30px);
}

.trusted-partners .tp-logo img {
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
  width: auto;
}

/* Tighter spacing for grid */
.trusted-partners .tp-grid {
  margin-top: 0;
}
</style>

