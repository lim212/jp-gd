<template>
  <UPageSection
    id="trusted-partners-section"
    role="region"
    aria-labelledby="trusted-partners-heading"
    variant="subtle"
    class="@container overflow-visible tp-theme"
    :ui="{
      container:
        'pt-0 pb-4 px-4 sm:px-4 lg:px-6 lg:pt-0 lg:pb-4 sm:gap-3 overflow-visible mt-2 w-full',
    }"
    style="content-visibility:auto; contain-intrinsic-size: 1px 560px;"
  >
    <ClientOnly>
      <div class="w-full">
        <div class="trusted-card relative overflow-hidden">
          <!-- Header -->
          <div class="px-6 md:px-8 pt-6 md:pt-8 pb-5 md:pb-6">
            <h2
              id="trusted-partners-heading"
              class="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-blue-600"
            >
              <Icon
                name="lucide:shield-check"
                class="inline-block align-[-0.125em] mr-2 w-6 h-6 text-yellow-500"
              />
              Trusted Partners
            </h2>
            <div
              class="mx-auto mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-blue-500 shadow-sm"
              aria-hidden="true"
            ></div>
            <p class="hidden sm:block mt-3 text-center text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
              Kami bekerja sama dengan brand terpercaya untuk memberikan layanan terbaik.
            </p>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-blue-300/80 dark:via-blue-700/60 to-transparent mx-6 md:mx-8 shadow-sm"></div>

          <!-- Slider -->
          <div class="relative px-4 md:px-6 pb-6 md:pb-8 pt-2">
            <div v-show="swiperReady" class="swiper trusted-partners-swiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    <div class="partner-card">
                      <AppImage src="/logos/paypal-new.png" alt="PayPal" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/skrill-new.png" alt="Skrill" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/visa-new.jpg" alt="VISA" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/mastercard-new.jpg" alt="MasterCard" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/namecheap-new.png" alt="Namecheap" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/Namesilo.svg" alt="NameSilo" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                  </div>
                </div>

                <div class="swiper-slide">
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    <div class="partner-card">
                      <AppImage src="/logos/neteller-new.png" alt="Neteller" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/semrush.jpg" alt="SEMRUSH" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/ebay-new.png" alt="eBay" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <UIcon name="i-lucide-camera" class="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/bitcoin.svg" alt="Bitcoin" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/ahrefs.png" alt="Ahrefs" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                  </div>
                </div>

                <div class="swiper-slide">
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
                    <div class="partner-card">
                      <AppImage src="/logos/patreon.jpg" alt="Patreon" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/godaddy.jpg" alt="GoDaddy" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/livechat.jpg" alt="LiveChat" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/trc20.jpg" alt="Tether" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/seoclerk.jpg" alt="SeoClerks" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                    <div class="partner-card">
                      <AppImage src="/logos/patreon.jpg" alt="Patreon" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!swiperReady" class="tp-fallback-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6 mt-3">
              <div class="partner-card"><AppImage src="/logos/paypal-new.png" alt="PayPal" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" /></div>
              <div class="partner-card"><AppImage src="/logos/skrill-new.png" alt="Skrill" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" /></div>
              <div class="partner-card"><AppImage src="/logos/visa-new.jpg" alt="VISA" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" /></div>
              <div class="partner-card"><AppImage src="/logos/mastercard-new.jpg" alt="MasterCard" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" /></div>
              <div class="partner-card"><AppImage src="/logos/namecheap-new.png" alt="Namecheap" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" /></div>
              <div class="partner-card"><AppImage src="/logos/Namesilo.svg" alt="NameSilo" imgClass="partner-logo object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300" wrapperClass="w-full h-full" /></div>
            </div>
            <div class="trusted-pagination swiper-pagination mt-4"></div>

            <!-- Navigation buttons -->
            <button
              v-show="showNav"
              class="trusted-nav-btn trusted-partners-prev absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 shadow-lg rounded-full p-2 md:p-3 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-xl sm:text-2xl font-extrabold leading-none select-none transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Sebelumnya"
            >
              <span aria-hidden="true" class="pointer-events-none">&lt;</span>
            </button>
            <button
              v-show="showNav"
              class="trusted-nav-btn trusted-partners-next absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 shadow-lg rounded-full p-2 md:p-3 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-xl sm:text-2xl font-extrabold leading-none select-none transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Berikutnya"
            >
              <span aria-hidden="true" class="pointer-events-none">&gt;</span>
            </button>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-blue-300/80 dark:via-blue-700/60 to-transparent mx-6 md:mx-8 shadow-sm"></div>

          <!-- Footer -->
          <div class="px-6 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 7.03a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72 3.97-3.97a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
              </svg>
              <span>Transaksi aman & cepat • Dipercaya 10+ brand internasional</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center rounded-full bg-green-100 text-green-800 dark:bg-gradient-to-r dark:from-emerald-500/30 dark:via-green-500/20 dark:to-emerald-400/30 dark:text-emerald-50 px-3 py-1.5 text-xs font-semibold border-2 border-green-300/60 dark:border-emerald-300/60 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                Verified Partners
              </span>
              <span class="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-gradient-to-r dark:from-sky-500/30 dark:via-blue-500/20 dark:to-indigo-500/30 dark:text-sky-50 px-3 py-1.5 text-xs font-semibold border-2 border-blue-300/60 dark:border-sky-300/60 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_0_15px_rgba(59,130,246,0.35)]">
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </UPageSection>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useHead } from '#imports'
import AppImage from './AppImage.vue'

const isDev = process.env.NODE_ENV === 'development'
const showNav = ref(false)
const swiperReady = ref(false)

const SWIPER_CSS = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
const SWIPER_JS = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
    { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
    { rel: 'stylesheet', href: SWIPER_CSS }
  ],
  script: [
    { src: SWIPER_JS, defer: true }
  ]
})

function initSwiper () {
  if (typeof window === 'undefined' || !window.Swiper) return

  const swiper = new window.Swiper('.trusted-partners-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    watchOverflow: true,
    speed: 600,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    keyboard: { enabled: true },
    pagination: {
      el: '.trusted-pagination',
      clickable: true,
      dynamicBullets: false,
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active'
    },
    navigation: {
      nextEl: '.trusted-partners-next',
      prevEl: '.trusted-partners-prev'
    }
  })

  swiperReady.value = true
  try {
    const total = swiper?.slides?.length ?? 0
    showNav.value = total > 1 && !swiper.isLocked
  } catch (error) {
    showNav.value = false
    if (isDev) console.warn('TrustedPartners swiper error:', error)
  }
}

function setupTouchActive () {
  if (typeof window === 'undefined') return
  const container = document.getElementById('trusted-partners-section')
  if (!container) return

  const addActive = (el) => {
    if (!el) return
    el.classList.add('tp-active')
    if (el._tpTimer) clearTimeout(el._tpTimer)
    el._tpTimer = setTimeout(() => el.classList.remove('tp-active'), 220)
  }

  container.addEventListener('touchstart', (event) => {
    const card = event.target?.closest?.('.partner-card')
    if (card) addActive(card)
  }, { passive: true })

  container.addEventListener('pointerdown', (event) => {
    const card = event.target?.closest?.('.partner-card')
    if (card) card.classList.add('tp-active')
  })

  const remove = (event) => {
    const card = event.target?.closest?.('.partner-card')
    if (card) card.classList.remove('tp-active')
  }

  container.addEventListener('pointerup', remove)
  container.addEventListener('pointercancel', remove)
  container.addEventListener('mouseleave', () => {
    container.querySelectorAll('.partner-card.tp-active').forEach((el) => el.classList.remove('tp-active'))
  })
}

function setLogoImageAttributes () {
  if (typeof window === 'undefined') return
  const root = document.getElementById('trusted-partners-section')
  if (!root) return

  root.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low')
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy')
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async')
  })
}

onMounted(() => {
  setupTouchActive()
  setLogoImageAttributes()

  const start = Date.now()
  const maxWait = 8000
  const interval = setInterval(() => {
    if (window && window.Swiper) {
      clearInterval(interval)
      initSwiper()
    } else if (Date.now() - start > maxWait) {
      clearInterval(interval)
      if (isDev) console.warn('Swiper CDN failed to load within expected time')
      else console.info('Swiper CDN failed to load within expected time')
    }
  }, 50)
})
</script>

<style scoped>
@reference "tailwindcss";

.trusted-card {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  background: linear-gradient(150deg, rgba(255,255,255,0.97), rgba(241,247,255,0.93));
  border: 1.5px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(18px);
}
.trusted-card::before,
.trusted-card::after {
  content: "";
  position: absolute;
  inset: -50% -65%;
  border-radius: 50%;
  pointer-events: none;
  transform: rotate(14deg);
  opacity: 0.7;
  filter: blur(0.6px);
}
.trusted-card::before {
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.26), transparent 68%);
}
.trusted-card::after {
  background: radial-gradient(circle at 80% 85%, rgba(236, 72, 153, 0.2), transparent 62%);
}
.dark .trusted-card {
  background: linear-gradient(150deg, rgba(17,24,39,0.96), rgba(30,41,59,0.93));
  border-color: rgba(59, 130, 246, 0.22);
  box-shadow: 0 26px 64px rgba(8, 11, 24, 0.55), inset 0 1px 0 rgba(148, 163, 184, 0.18);
}
.dark .trusted-card::before {
  background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.28), transparent 65%);
}
.dark .trusted-card::after {
  background: radial-gradient(circle at 75% 88%, rgba(167, 139, 250, 0.22), transparent 60%);
}

.partner-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6.5rem;
  padding: 1rem;
  border-radius: 1.25rem;
  background: linear-gradient(145deg, rgba(255,255,255,0.97), rgba(235,242,255,0.92));
  border: 1.5px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 18px 40px rgba(79, 70, 229, 0.08);
  transition: transform .28s ease, box-shadow .28s ease, border .28s ease, background .28s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}
.partner-card::before {
  content: "";
  position: absolute;
  inset: -120% -40%;
  background: conic-gradient(from 210deg, rgba(59,130,246,0.2), rgba(236,72,153,0.15), rgba(59,130,246,0.2));
  opacity: 0;
  transform: rotate(10deg);
  transition: opacity .35s ease, transform .35s ease;
  pointer-events: none;
}
.partner-card::after {
  content: "";
  position: absolute;
  inset: -38%;
  background: radial-gradient(120px 28px at -20% 50%, rgba(255,255,255,.38), rgba(255,255,255,0));
  transform: rotate(25deg) translateX(-60%);
  transition: transform .45s ease, opacity .3s ease;
  opacity: 0;
  pointer-events: none;
}
.partner-card:hover::after,
.partner-card:active::after {
  transform: rotate(25deg) translateX(28%);
  opacity: .65;
}
.partner-card:hover::before,
.partner-card.tp-active::before {
  opacity: 0.9;
  transform: rotate(6deg) scale(1.05);
}
.dark .partner-card {
  background: linear-gradient(150deg, rgba(29,39,65,0.96), rgba(17,24,39,0.92));
  border-color: rgba(59, 130, 246, 0.24);
  box-shadow: 0 22px 42px rgba(8, 11, 24, 0.5);
}
.dark .partner-card::before {
  background: conic-gradient(from 205deg, rgba(96,165,250,0.25), rgba(236,72,153,0.18), rgba(96,165,250,0.25));
}
.partner-card:hover,
.partner-card.tp-active {
  transform: translateY(-2px) scale(1.015);
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(145deg, rgba(255,255,255,0.99), rgba(226,236,255,0.95));
  box-shadow: 0 24px 48px rgba(79,70,229,0.16), 0 12px 26px rgba(59,130,246,0.16);
}
.dark .partner-card:hover,
.dark .partner-card.tp-active {
  border-color: rgba(147, 197, 253, 0.4);
  background: linear-gradient(145deg, rgba(31, 41, 59, 0.96), rgba(17, 24, 39, 0.92));
  box-shadow: 0 26px 52px rgba(8, 11, 24, 0.6), 0 16px 30px rgba(37, 99, 235, 0.28);
}

.partner-card :deep(.li-wrapper) {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}
.partner-card :deep(img) {
  display: block;
  margin: 0 auto;
  object-position: center;
}

.partner-logo {
  max-height: 48px;
  width: auto;
  transition: transform .35s ease, filter .35s ease;
}
.partner-card:hover :deep(.partner-logo),
.partner-card.tp-active :deep(.partner-logo) {
  transform: scale(1.06);
  filter: saturate(115%);
}

.partner-text {
  color: #374151;
  font-weight: 500;
  text-align: center;
  font-size: 1rem;
}

.trusted-partners :deep(.swiper-button-prev),
.trusted-partners :deep(.swiper-button-next) {
  color: #111827;
  display: none !important;
}

:deep(.trusted-pagination .swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #d1d5db;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  opacity: .8;
  transition: all .3s ease;
}
:deep(.trusted-pagination .swiper-pagination-bullet-active) {
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.2), 0 4px 8px rgba(0,0,0,0.15);
  opacity: 1;
  transform: scale(1.2);
}

.dark :deep(.trusted-pagination .swiper-pagination-bullet) {
  background: #4b5563;
  border-color: #374151;
}
.dark :deep(.trusted-pagination .swiper-pagination-bullet-active) {
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96,165,250,.2), 0 4px 8px rgba(0,0,0,0.25);
}

@media (min-width: 1024px) {
  .trusted-partners-swiper .swiper-slide .grid,
  .tp-fallback-grid {
    gap: 1.5rem;
  }
}
@media (min-width: 1280px) {
  .trusted-partners-swiper .swiper-slide .grid,
  .tp-fallback-grid {
    gap: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .partner-card,
  .partner-card::after,
  .partner-logo {
    transition: none !important;
  }
}

@media (max-width: 640px) {
  .partner-card {
    height: 108px;
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 1.25rem;
  }
  :deep(.partner-logo) {
    max-height: 52px;
    max-width: 88%;
  }
  .grid {
    gap: 1rem;
  }
  :deep(.trusted-pagination .swiper-pagination-bullet) {
    width: 14px;
    height: 14px;
    margin: 0 6px;
  }
}
@media (max-width: 480px) {
  .partner-card {
    height: 100px;
    padding: 0.875rem;
    margin: 0.375rem;
  }
  :deep(.partner-logo) {
    max-height: 48px;
    max-width: 85%;
  }
  .grid {
    gap: 0.875rem;
  }
}
@media (max-width: 380px) {
  .partner-card {
    height: 92px;
    padding: 0.75rem;
    border-radius: 1rem;
    margin: 0.25rem;
  }
  :deep(.partner-logo) {
    max-height: 44px;
    max-width: 82%;
  }
  .grid {
    gap: 0.75rem;
  }
}
</style>