<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRoute, useColorMode, useNuxtApp } from '#imports';
import { useVisitors } from '~~/composables/useVisitors';
// Import useI18n from vue-i18n
import { useI18n } from 'vue-i18n';
import AppImage from './AppImage.vue'
import DataSaverToggle from './DataSaverToggle.vue'
import HeaderSearch from './HeaderSearch.vue'

// Check if development mode
const isDev = process.env.NODE_ENV === 'development'

// Define props to receive error information
const props = defineProps({
  isErrorPage: {
    type: Boolean,
    default: false
  },
  errorCode: {
    type: Number,
    default: null
  }
});

// Get the current route
const route = useRoute();

// Initialize i18n with error handling
let i18n: any;
let locale: any;
let t: any;
try {
  i18n = useI18n();
  // Safely destructure i18n properties
  locale = i18n.locale;
  t = i18n.t;
} catch (error) {
  console.error('Error initializing i18n:', error);
  // Provide fallback functions if i18n initialization fails
  locale = { value: 'id' };
  t = (key: string) => key;
}

// Initialize color mode
const colorMode = useColorMode();

// Toggle between light and dark mode (robust on mobile)
let lastThemeToggleAt = 0
const toggleColorMode = (e?: Event) => {
  try { e?.stopPropagation?.(); (e as any)?.preventDefault?.() } catch {}
  const now = Date.now()
  // Ignore a second synthetic click following a touch within 400ms
  if (now - lastThemeToggleAt < 400) return
  lastThemeToggleAt = now

  const next = colorMode.value === 'dark' ? 'light' : 'dark'
  // Update preference (Nuxt Color Mode will persist and manage)
  colorMode.preference = next

  // Track dark-mode window start time
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const ls = window.localStorage
      if (next === 'dark') {
        ls.setItem('color-mode-dark-ts', String(now))
      } else {
        ls.removeItem('color-mode-dark-ts')
      }
    }
  } catch {}

  // Force immediate DOM class update to avoid iOS delay/race
  try {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.classList.remove(next === 'dark' ? 'light' : 'dark')
      root.classList.add(next)
      root.setAttribute('data-theme', next)
    }
  } catch {}

  // Auto-close mobile menu after toggling theme when menu is open
  try { if (isMobileMenuOpen?.value) closeMobileMenu() } catch {}
};

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Quick Help widget state for mobile
const isHelpWidgetOpen = ref(false);
function toggleHelpWidget(e?: Event) {
  try { e?.stopPropagation?.(); (e as any)?.preventDefault?.() } catch {}
  isHelpWidgetOpen.value = !isHelpWidgetOpen.value
}
function closeHelpWidget() {
  isHelpWidgetOpen.value = false
}

// Auto-close the help widget whenever mobile menu opens
watch(isMobileMenuOpen, (v: boolean) => { if (v) isHelpWidgetOpen.value = false })
// Also close on route changes to keep state clean
watch(() => route.path, () => { isHelpWidgetOpen.value = false })

// Short window to ignore clock interactions around menu toggles (prevents ghost taps / synthetic clicks)
let menuInteractionIgnoreUntil = 0
function isEventFromHeaderMenuButton(e?: Event) {
  try {
    const target: any = (e as any)?.target
    const btn = typeof document !== 'undefined' ? document.getElementById('appheader-mobile-menu-btn') : null
    return !!(btn && target && (target === btn || btn.contains(target)))
  } catch { return false }
}
function shouldIgnoreHeaderClock(e?: Event) {
  try { return isMobileMenuOpen.value || Date.now() < menuInteractionIgnoreUntil || isEventFromHeaderMenuButton(e) } catch { return isMobileMenuOpen.value }
}

// Toggle mobile menu
const toggleMobileMenu = (e?: Event) => {
  // Ignore toggle if within ghost-click suppression window
  try { if (Date.now() < menuInteractionIgnoreUntil) { try { e?.stopPropagation?.() } catch {}; return } } catch {}
  const next = !isMobileMenuOpen.value;
  isMobileMenuOpen.value = next;

  // Briefly ignore clock interactions to prevent ghost taps
  try { menuInteractionIgnoreUntil = Date.now() + 700 } catch {}

  // Make sure any clock popover is closed to avoid conflicts
  try { hideMobileClockPopover(true) } catch {}

  // Prevent body scrolling when mobile menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  try { menuInteractionIgnoreUntil = Date.now() + 700 } catch {}
  try { hideMobileClockPopover(true) } catch {}
  document.body.style.overflow = '';
};

// Dynamic header offset (marquee + header) to avoid extra space above content
const marqueeRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

// Dynamically compute marquee height and expose it via CSS var so header can sit exactly below it
function updateMarqueeOffset() {
  try {
    const m = marqueeRef.value
    const h = m ? Math.max(0, Math.round(m.offsetHeight || 0)) : 0
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-marquee-height', `${h}px`)
    }
    // Recompute header offset since it depends on header position which depends on marquee height
    try { nextTick(() => updateHeaderOffset()) } catch {}
  } catch {}
}

onMounted(() => {
  try { updateMarqueeOffset() } catch {}
  // Re-check after async paints/fonts/icons load
  setTimeout(() => { try { updateMarqueeOffset() } catch {} }, 150)
  setTimeout(() => { try { updateMarqueeOffset() } catch {} }, 600)
  if (typeof window !== 'undefined') {
    try {
      window.addEventListener('resize', updateMarqueeOffset)
      window.addEventListener('orientationchange', updateMarqueeOffset)
    } catch {}
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    try {
      window.removeEventListener('resize', updateMarqueeOffset)
      window.removeEventListener('orientationchange', updateMarqueeOffset)
    } catch {}
  }
})

// Show a subtle header line when page is scrolled
const isHeaderScrolled = ref(false)
function updateHeaderScrolled() {
  try {
    const y = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0
    const threshold = 20
    isHeaderScrolled.value = y > threshold
  } catch {}
}
onMounted(() => {
  try { updateHeaderScrolled() } catch {}
  if (typeof window !== 'undefined') {
    try { window.addEventListener('scroll', updateHeaderScrolled, { passive: true } as any) } catch { try { window.addEventListener('scroll', updateHeaderScrolled as any) } catch {} }
  }
})
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    try { window.removeEventListener('scroll', updateHeaderScrolled as any) } catch {}
  }
})

const updateHeaderOffset = () => {
  try {
    const h = headerRef.value
    let total = 0
    if (h && typeof window !== 'undefined') {
      const rect = h.getBoundingClientRect()
      total = Math.max(0, Math.round(rect.bottom))
    } else {
      // Fallback: approximate using computed top + offsetHeight
      const cs = h ? window.getComputedStyle(h) : null
      const headerTop = cs ? (parseFloat(cs.top || '0') || 0) : 0
      const hH = h?.offsetHeight || 0
      total = Math.max(0, Math.round(headerTop + hH))
    }
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-header-offset', `${total}px`)
    }
  } catch (e) {
    // no-op
  }
}

// Recompute on mobile menu toggle (layout may shift)
watch(isMobileMenuOpen, () => nextTick(() => updateHeaderOffset()))

onMounted(() => {
  // Run after layout
  nextTick(() => {
    updateHeaderOffset()
    // re-check after fonts/icons/async paint
    setTimeout(updateHeaderOffset, 100)
    setTimeout(updateHeaderOffset, 500)
  })
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateHeaderOffset)
    window.addEventListener('orientationchange', updateHeaderOffset)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateHeaderOffset)
    window.removeEventListener('orientationchange', updateHeaderOffset)
  }
})

// Function to safely set locale with error handling
const setLocale = (newLocale: string) => {
  try {
    // Use the standard Vue I18n v9 approach to change locale
    if (locale && typeof locale === 'object' && 'value' in locale) {
      locale.value = newLocale;
    } else if (i18n && typeof i18n.setLocale === 'function') {
      i18n.setLocale(newLocale);
    } else {
      if (isDev) console.warn('Unable to set locale: locale.value and i18n.setLocale are not available');
      else console.info('Unable to set locale: locale.value and i18n.setLocale are not available')
    }
  } catch (error) {
    console.error('Error setting locale:', error);
  }
};

// Smart cache system for translations - avoid unnecessary API calls
const messageCache = new Map<string, { messages: Record<string, any>; timestamp: number }>()
const CACHE_DURATION_ID = 24 * 60 * 60 * 1000 // ID: 24 hours (stable)
const CACHE_DURATION_EN = 30 * 60 * 1000 // EN: 30 minutes (may update)

// Function to switch between languages with smart caching
const refreshI18nMessages = async (target: 'id' | 'en') => {
  try {
    // Check cache first (SUPER PINTAR - no unnecessary API calls!)
    const cached = messageCache.get(target)
    const cacheDuration = target === 'id' ? CACHE_DURATION_ID : CACHE_DURATION_EN
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < cacheDuration) {
      console.log(`[AppHeader i18n] Using cached messages for ${target}`)
      
      // Use cached messages
      const nuxtApp = useNuxtApp()
      const provided: any = (nuxtApp as any).$i18n
      try {
        if (provided?.global?.setLocaleMessage) {
          provided.global.setLocaleMessage(target, cached.messages)
        } else if (provided?.setLocaleMessage) {
          provided.setLocaleMessage(target, cached.messages)
        }
      } catch (e) {
        console.warn('Failed to set cached locale messages', e)
      }
      return
    }

    // For EN: background sync check (non-blocking)
    // Translations are handled by nightly scheduler at 2 AM
    if (target === 'en') {
      try {
        $fetch('/api/i18n/sync', { 
          method: 'POST',
          timeout: 5000 
        }).catch(err => {
          console.log('[AppHeader i18n] Background sync check failed:', err.message)
        })
      } catch {}
    }

    // Fetch messages from API
    const res = await $fetch<{ locale: string; messages: Record<string, any> }>(
      '/api/i18n/messages', { 
        query: { locale: target },
        headers: { 'Cache-Control': 'public, max-age=1800' }
      }
    )
    const msgs = res?.messages || {}

    // Store in cache
    messageCache.set(target, { messages: msgs, timestamp: now })
    console.log(`[AppHeader i18n] Fetched and cached messages for ${target}`)

    // Apply messages
    const nuxtApp = useNuxtApp()
    const provided: any = (nuxtApp as any).$i18n
    if (provided?.global?.setLocaleMessage) {
      provided.global.setLocaleMessage(target, msgs)
    } else if (provided?.setLocaleMessage) {
      provided.setLocaleMessage(target, msgs)
    }
  } catch (e) {
    if (isDev) console.warn('Failed to refresh i18n messages', e)
    else console.info('Failed to refresh i18n messages', e)
  }
};

async function selectLanguage(target: 'id' | 'en') {
  try {
    await refreshI18nMessages(target)
    setLocale(target)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('nuxt-i18n-locale', target)
      }
    } catch {}
  } catch (e) {
    console.error('Error selecting language:', e)
  }
}

// Mobile clock functionality
const isMobileClockPopoverOpen = ref(false);
const hideMobileClockPopover = (force = false) => {
  if (force || shouldIgnoreHeaderClock()) {
    isMobileClockPopoverOpen.value = false;
  }
};

// Real-time clock state (Jakarta time)
const now = ref(typeof window !== 'undefined' ? new Date() : new Date());
let clockInterval: ReturnType<typeof setInterval> | null = null;

const formatTime = () => {
  const jakartaNow = new Date(now.value.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const hh = jakartaNow.getHours().toString().padStart(2, '0');
  const mm = jakartaNow.getMinutes().toString().padStart(2, '0');
  const ss = jakartaNow.getSeconds().toString().padStart(2, '0');
  return `${hh}:${mm}:${ss} WIB`;
};

const formatDate = () => {
  const jakartaNow = new Date(now.value.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  return jakartaNow.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: 'Asia/Jakarta'
  });
};

// Start clock
onMounted(() => {
  if (typeof window !== 'undefined') {
    clockInterval = setInterval(() => {
      now.value = new Date();
    }, 1000);
  }
});

onUnmounted(() => {
  if (clockInterval !== null) {
    clearInterval(clockInterval);
  }
});

// Navigation items
const navigationItems = [
  { name: 'Home', href: '/', icon: 'i-lucide-home' },
  { name: 'Informasi', href: '/informasi', icon: 'i-lucide-info', hasDropdown: true },
  { name: 'Jasa PayPal', href: '/jasa-paypal', icon: 'i-lucide-credit-card' },
  { name: 'Bukti Transaksi', href: 'https://upload.jasapembayaran.com', icon: 'i-lucide-file-check', external: true },
  { name: 'Testimoni', href: 'https://testimonial.jasapembayaran.id', icon: 'i-lucide-star', external: true }
];

// Information dropdown items
const informationItems = [
  { name: 'Tentang Kami', href: '/tentang-kami', icon: 'i-lucide-building' },
  { name: 'Transaksi Online', href: '/transaksi', icon: 'i-lucide-shopping-cart' },
  { name: 'Rekening Resmi', href: '/informasi/rekening', icon: 'i-lucide-banknote' },
  { name: 'Cara Transaksi', href: '/informasi/transaksi', icon: 'i-lucide-help-circle' }
];

const marqueeMessages = [
  'PayPal terpercaya dan resmi untuk kebutuhan bisnis & pribadi',
  'Support profesional 24/7 dengan SLA respons kurang dari 5 menit',
  'Transaksi aman: Top Up PayPal, Kartu Kredit Virtual, Bitcoin & layanan digital lainnya'
];

// Visitor count
const { onlineVisitors: visitorCount } = useVisitors();

// Active route detection
const isActiveRoute = (href: string) => {
  if (href === '/' && route.path === '/') return true;
  if (href !== '/' && route.path.startsWith(href)) return true;
  return false;
};
</script>

<template>
  <div class="modern-header-wrapper">
    <div class="header-section-line header-section-line--top" aria-hidden="true"></div>
    <!-- Top Marquee Banner -->
    <div 
      ref="marqueeRef"
      class="modern-marquee-banner text-slate-900 dark:text-slate-100 py-2 px-4 overflow-hidden relative mobile-p-2 mobile-text-xs"
      aria-label="Informasi layanan terbaru Jasa Pembayaran"
    >
      <div class="marquee-content">
        <div
          v-for="repeat in 2"
          :key="`marquee-group-${repeat}`"
          class="marquee-group"
        >
          <div
            v-for="(message, index) in marqueeMessages"
            :key="`marquee-item-${repeat}-${index}`"
            class="marquee-item"
          >
            <UIcon name="i-lucide-badge-check" class="marquee-icon" />
            <span>{{ message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="header-section-line header-section-line--marquee" aria-hidden="true"></div>

    <!-- Main Header -->
    <header 
      ref="headerRef"
      class="modern-header bg-white/95 dark:bg-slate-950/92 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/65 shadow-lg dark:shadow-2xl sticky top-0 z-50 transition-all duration-300"
      :class="{ 'header-scrolled': isHeaderScrolled }"
    >
      <!-- Top Utility Bar -->
      <div class="utility-bar bg-white/65 dark:bg-slate-950/75 border-b border-slate-200/55 dark:border-slate-800/55 mobile-p-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="utility-inner">
            <!-- Contact & Trust Section -->
            <div class="utility-section utility-section--contact">
              <a 
                href="tel:+628988888250" 
                class="utility-chip"
                aria-label="Hubungi hotline JasaPembayaran.com"
              >
                <span class="utility-icon">
                  <UIcon name="i-lucide-phone" class="w-4 h-4" />
                </span>
                <span class="utility-text">
                  <span class="utility-label">Hotline 24/7</span>
                  <span class="utility-value">+62 898 8888 250</span>
                </span>
              </a>
              <a 
                href="mailto:admin@JasaPembayaran.com" 
                class="utility-chip"
                aria-label="Kirim email ke admin JasaPembayaran.com"
              >
                <span class="utility-icon">
                  <UIcon name="i-lucide-mail" class="w-4 h-4" />
                </span>
                <span class="utility-text">
                  <span class="utility-label">Email Support</span>
                  <span class="utility-value">admin@JasaPembayaran.com</span>
                </span>
              </a>
              <div class="utility-chip utility-chip--muted" role="presentation">
                <span class="utility-icon">
                  <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
                </span>
                <span class="utility-text">
                  <span class="utility-label">Verifikasi Resmi</span>
                  <span class="utility-value">Transaksi Aman & Tercatat</span>
                </span>
              </div>
            </div>

            <!-- Live Info Section -->
            <div class="utility-section utility-section--meta" role="presentation">
              <div class="utility-stat">
                <span class="utility-stat-icon">
                  <UIcon name="i-lucide-activity" class="w-4 h-4" />
                </span>
                <span class="utility-text">
                  <span class="utility-label">Pengunjung Aktif</span>
                  <span class="utility-value">{{ visitorCount ?? 0 }}</span>
                </span>
              </div>
              <div class="utility-stat">
                <span class="utility-stat-icon">
                  <UIcon name="i-lucide-shield" class="w-4 h-4" />
                </span>
                <span class="utility-text">
                  <span class="utility-label">SLA Respon</span>
                  <span class="utility-value">&lt; 5 Menit Support</span>
                </span>
              </div>
            </div>

            <!-- Utilities Section -->
            <div class="utility-section utility-section--actions">
              <button 
                @click="toggleHelpWidget"
                class="utility-action-button"
              >
                <UIcon name="i-lucide-life-buoy" class="w-4 h-4" />
                <span>Bantuan</span>
              </button>

              <div class="utility-inline-divider" aria-hidden="true"></div>

              <div class="utility-mode">
                <DataSaverToggle />
              </div>

              <div class="utility-inline-divider" aria-hidden="true"></div>

              <div class="utility-language">
                <button 
                  @click="selectLanguage('id')"
                  :class="[
                    'utility-language-btn',
                    locale?.value === 'id' 
                      ? 'utility-language-btn--active' 
                      : 'utility-language-btn--ghost'
                  ]"
                >
                  ID
                </button>
                <button 
                  @click="selectLanguage('en')"
                  :class="[
                    'utility-language-btn',
                    locale?.value === 'en' 
                      ? 'utility-language-btn--active' 
                      : 'utility-language-btn--ghost'
                  ]"
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-section-line header-section-line--utility" aria-hidden="true"></div>

      <!-- Main Navigation -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-p-2 navigation-row">
        <div class="flex items-center justify-between h-20 mobile-h-auto mobile-py-2 navigation-row-inner">
          <!-- Logo Section -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-3 group">
              <div class="relative">
                <div class="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <UIcon name="i-lucide-handshake" class="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 text-white" />
                </div>
                <div class="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  Jasa Pembayaran<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">.com</span>
                </h1>
                <div class="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">Berita online</span>
                  <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">Terpercaya</span>
                  <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">Fast Response</span>
                  <span class="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium">Profesional</span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="desktop-navigation hidden lg:flex items-center">
            <template v-for="item in navigationItems" :key="item.name">
              <div v-if="item.hasDropdown" class="relative group">
                <button class="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 font-medium">
                  <span>{{ item.name }}</span>
                  <UIcon name="i-lucide-chevron-down" class="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                
                <!-- Dropdown Menu -->
                <div class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div class="p-2">
                    <template v-for="dropdownItem in informationItems" :key="dropdownItem.name">
                      <a 
                        :href="dropdownItem.href" 
                        :target="dropdownItem.external ? '_blank' : '_self'"
                        :rel="dropdownItem.external ? 'noopener noreferrer' : ''"
                        class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
                      >
                        <UIcon :name="dropdownItem.icon" class="w-4 h-4" />
                        <span class="font-medium">{{ dropdownItem.name }}</span>
                      </a>
                    </template>
                  </div>
                </div>
              </div>
              
              <a 
                v-else
                :href="item.href"
                :target="item.external ? '_blank' : '_self'"
                :rel="item.external ? 'noopener noreferrer' : ''"
                :class="[
                  'flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                  isActiveRoute(item.href)
                    ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                ]"
              >
                <UIcon :name="item.icon" class="w-4 h-4" />
                <span>{{ item.name }}</span>
              </a>
            </template>
          </nav>

          <!-- Right side actions -->
          <div class="flex items-center space-x-4">
            <!-- Search Button -->
            <HeaderSearch />

            <!-- Theme Toggle -->
            <button 
              @click="toggleColorMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" class="w-5 h-5" />
            </button>

            <!-- Real-time Clock - Visible on all screens with responsive sizing -->
            <div class="mobile-clock">
              <UIcon name="i-lucide-clock" class="mobile-clock-icon" />
              <span class="mobile-clock-text">{{ formatTime() }}</span>
            </div>

            <!-- Mobile Menu Button - Enhanced size for mobile -->
            <button 
              type="button"
              id="appheader-mobile-menu-btn"
              @click="toggleMobileMenu"
              class="lg:hidden mobile-menu-btn"
              aria-label="Toggle navigation menu"
            >
              <UIcon :name="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="mobile-menu-icon" />
            </button>
          </div>
        </div>
      </div>
      <div class="header-section-line header-section-line--nav" aria-hidden="true"></div>

      <!-- Mobile Menu -->
      <Transition name="mobile-menu">
        <div 
          v-if="isMobileMenuOpen" 
          class="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div class="px-4 py-6 space-y-4">
            <!-- Mobile Navigation Items -->
            <template v-for="item in navigationItems" :key="item.name">
              <div v-if="item.hasDropdown">
                <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {{ item.name }}
                </div>
                <div class="ml-4 space-y-2">
                  <template v-for="dropdownItem in informationItems" :key="dropdownItem.name">
                    <a 
                      :href="dropdownItem.href"
                      :target="dropdownItem.external ? '_blank' : '_self'"
                      :rel="dropdownItem.external ? 'noopener noreferrer' : ''"
                      class="flex items-center space-x-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <UIcon :name="dropdownItem.icon" class="w-4 h-4" />
                      <span>{{ dropdownItem.name }}</span>
                    </a>
                  </template>
                </div>
              </div>
              
              <a 
                v-else
                :href="item.href"
                :target="item.external ? '_blank' : '_self'"
                :rel="item.external ? 'noopener noreferrer' : ''"
                :class="[
                  'flex items-center space-x-3 py-3 px-4 rounded-lg font-medium transition-all duration-200',
                  isActiveRoute(item.href)
                    ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                ]"
                @click="closeMobileMenu"
              >
                <UIcon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
              </a>
            </template>

            <!-- Mobile Clock -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate() }}
                </div>
                <div class="text-lg font-mono font-bold text-gray-900 dark:text-white">
                  {{ formatTime() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Mobile Help Widget -->
    <Transition name="help-widget">
      <div 
        v-if="isHelpWidgetOpen" 
        class="fixed inset-0 bg-black/50 z-50 lg:hidden"
        @click="closeHelpWidget"
      >
        <div 
          class="absolute top-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Bantuan Cepat</h3>
            <button 
              @click="closeHelpWidget"
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div class="space-y-3">
            <a 
              href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com,%20saya%20perlu%20bantuan&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors duration-200"
            >
              <UIcon name="i-lucide-message-circle" class="w-5 h-5 text-green-600 dark:text-green-400" />
              <span class="font-medium text-green-700 dark:text-green-300">Chat WhatsApp</span>
            </a>
            
            <a 
              href="tel:+628988888250"
              class="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-200"
            >
              <UIcon name="i-lucide-phone" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="font-medium text-blue-700 dark:text-blue-300">Telepon Langsung</span>
            </a>
            
            <a 
              href="mailto:admin@JasaPembayaran.com"
              class="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors duration-200"
            >
              <UIcon name="i-lucide-mail" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span class="font-medium text-purple-700 dark:text-purple-300">Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Modern Header Styles */
.modern-header-wrapper {
  position: relative;
  z-index: 50;
}

.header-section-line {
  width: 100%;
  height: 1px;
  display: block;
  margin: 0;
  background: linear-gradient(90deg, rgba(226, 232, 240, 0), rgba(226, 232, 240, 0.8), rgba(226, 232, 240, 0));
  box-shadow: none;
}

.header-section-line--marquee {
  background: linear-gradient(90deg, rgba(250, 204, 21, 0), rgba(250, 204, 21, 0.45), rgba(250, 204, 21, 0));
}

.header-section-line--top {
  margin-top: 0.4rem;
  background: linear-gradient(90deg, rgba(248, 250, 252, 0), rgba(255, 255, 255, 0.7), rgba(248, 250, 252, 0));
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.25);
}

.header-section-line--utility {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0), rgba(56, 189, 248, 0.45), rgba(251, 191, 36, 0));
}

.header-section-line--nav {
  height: 2px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0), rgba(14, 165, 233, 0.7), rgba(236, 72, 153, 0.7), rgba(59, 130, 246, 0));
}

.dark .header-section-line {
  background: linear-gradient(90deg, rgba(15, 23, 42, 0), rgba(148, 163, 184, 0.65), rgba(15, 23, 42, 0));
}

.dark .header-section-line--marquee {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0), rgba(251, 191, 36, 0.55), rgba(251, 191, 36, 0));
}

.dark .header-section-line--top {
  background: linear-gradient(90deg, rgba(15, 23, 42, 0), rgba(148, 163, 184, 0.65), rgba(15, 23, 42, 0));
  box-shadow: 0 8px 16px rgba(2, 6, 23, 0.75);
}

.dark .header-section-line--nav {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0), rgba(14, 165, 233, 0.85), rgba(244, 114, 182, 0.85), rgba(14, 165, 233, 0));
}

/* Marquee Banner */
.modern-marquee-banner {
  position: relative;
  overflow: hidden;
  background: linear-gradient(120deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.12) 45%, rgba(147, 197, 253, 0.08) 100%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-top: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.modern-marquee-banner::before,
.modern-marquee-banner::after {
  content: "";
  position: absolute;
  top: 0;
  width: 80px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.modern-marquee-banner::before {
  left: 0;
  background: linear-gradient(to right, rgba(241, 245, 249, 1), rgba(241, 245, 249, 0));
}

.modern-marquee-banner::after {
  right: 0;
  background: linear-gradient(to left, rgba(241, 245, 249, 1), rgba(241, 245, 249, 0));
}

.dark .modern-marquee-banner {
  background: linear-gradient(120deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.9) 40%, rgba(30, 64, 175, 0.45) 100%);
  border-bottom-color: rgba(71, 85, 105, 0.5);
  box-shadow: inset 0 -1px 0 rgba(15, 23, 42, 0.35);
  border-top-color: rgba(148, 163, 184, 0.35);
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.25), inset 0 -1px 0 rgba(15, 23, 42, 0.45);
}

.dark .modern-marquee-banner::before {
  background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0));
}

.dark .modern-marquee-banner::after {
  background: linear-gradient(to left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0));
}

.desktop-navigation {
  position: relative;
  padding: 0.5rem 0.65rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  border-bottom: 1px solid rgba(203, 213, 225, 0.7);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(241, 245, 249, 0.85));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 10px 30px rgba(15, 23, 42, 0.1);
  gap: 0.35rem;
}

.navigation-row {
  border-top: 1px solid rgba(226, 232, 240, 0.35);
  border-bottom: 1px solid rgba(203, 213, 225, 0.35);
  padding: 0.75rem 0 0.5rem;
}

.navigation-row-inner {
  border-radius: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.65);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(248, 250, 252, 0.15));
  padding: 0.45rem 1.15rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(14px);
}

.dark .navigation-row {
  border-color: rgba(30, 41, 59, 0.85);
}

.dark .navigation-row-inner {
  border-color: rgba(15, 23, 42, 0.85);
  background: linear-gradient(135deg, rgba(2, 6, 23, 0.85), rgba(15, 23, 42, 0.75));
  box-shadow: 0 25px 45px rgba(2, 6, 23, 0.65), inset 0 1px 0 rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(18px);
}

.desktop-navigation > * {
  position: relative;
}

.desktop-navigation > *:not(:first-child) {
  padding-left: 0.75rem;
  margin-left: 0.75rem;
}

.desktop-navigation > *:not(:first-child)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 2px;
  background: linear-gradient(to bottom, rgba(226, 232, 240, 0), rgba(148, 163, 184, 0.8), rgba(226, 232, 240, 0));
}

.dark .desktop-navigation {
  border-color: rgba(51, 65, 85, 0.85);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.95));
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.25), 0 20px 40px rgba(2, 6, 23, 0.65);
}

.dark .desktop-navigation > *:not(:first-child)::before {
  background: linear-gradient(to bottom, rgba(2, 6, 23, 0), rgba(251, 191, 36, 0.6), rgba(2, 6, 23, 0));
}

.marquee-content {
  display: flex;
  width: 200%;
  animation: marquee 32s linear infinite;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.marquee-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 50%;
  padding-right: 1.5rem;
}

.marquee-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: #1f2937;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(4px);
}

.marquee-icon {
  width: 1rem;
  height: 1rem;
  color: #2563eb;
}

.dark .marquee-item {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.92) 0%, rgba(30, 64, 175, 0.75) 100%);
  border-color: rgba(148, 163, 184, 0.35);
  color: #e2e8f0;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.6);
}

.dark .marquee-icon {
  color: #93c5fd;
}

/* Header Scroll Effect */
.modern-header.header-scrolled {
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dark .modern-header.header-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Utility layout */
.utility-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 1.5rem;
  min-height: 2.75rem;
}

.utility-bar {
  border-top: 1px solid rgba(148, 163, 184, 0.35);
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.utility-bar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(248, 250, 252, 0.1), rgba(226, 232, 240, 0.2), rgba(248, 250, 252, 0.1));
  opacity: 0.4;
  pointer-events: none;
}

.dark .utility-bar {
  border-color: rgba(30, 41, 59, 0.8);
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.15);
}

.dark .utility-bar::before {
  background: linear-gradient(90deg, rgba(30, 41, 59, 0.6), rgba(59, 7, 100, 0.4), rgba(30, 41, 59, 0.6));
  opacity: 0.35;
}

.utility-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.utility-section:not(:first-child) {
  padding-left: 1.5rem;
}

.utility-section:not(:first-child)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 18%;
  bottom: 18%;
  width: 2px;
  background: linear-gradient(to bottom, rgba(248, 250, 252, 0), rgba(148, 163, 184, 0.85), rgba(248, 250, 252, 0));
  box-shadow: 0 0 6px rgba(148, 163, 184, 0.45);
}

.dark .utility-section:not(:first-child)::before {
  background: linear-gradient(to bottom, rgba(2, 6, 23, 0), rgba(251, 191, 36, 0.55), rgba(2, 6, 23, 0));
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.35);
}

.utility-section--meta {
  justify-content: center;
}

.utility-section--actions {
  justify-content: flex-end;
}

.utility-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.85rem;
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.utility-stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.utility-inline-divider {
  width: 1px;
  height: 28px;
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0), rgba(148, 163, 184, 0.6), rgba(148, 163, 184, 0));
}

.utility-mode {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.32);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.utility-language {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.32);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.utility-language-btn {
  padding: 0.4rem 0.95rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  background: transparent;
  color: #475569;
  cursor: pointer;
}

.utility-language-btn--ghost:hover {
  color: #1d4ed8;
}

.utility-language-btn--active {
  /* Unified header accent color (blue-indigo) for active language pill */
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.28);
}

.utility-language-btn--ghost {
  color: #475569;
}

.utility-mode :deep(label) {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.utility-mode :deep(select) {
  font-size: 0.78rem;
  padding: 0.35rem 0.85rem;
  border-radius: 0.75rem;
}

.utility-mode :deep(select:focus) {
  outline-offset: 3px;
}

.utility-mode :deep(span[aria-live]) {
  font-size: 0.7rem;
}

.dark .utility-stat {
  background: linear-gradient(140deg, rgba(17, 24, 39, 0.92) 0%, rgba(30, 41, 59, 0.78) 100%);
  border-color: rgba(71, 85, 105, 0.5);
  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.6);
}

.dark .utility-stat-icon {
  background: rgba(37, 99, 235, 0.28);
  color: #bfdbfe;
}

.dark .utility-inline-divider {
  background: linear-gradient(to bottom, rgba(30, 41, 59, 0), rgba(148, 163, 184, 0.5), rgba(30, 41, 59, 0));
}

.dark .utility-mode {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(30, 64, 175, 0.45) 100%);
  border-color: rgba(71, 85, 105, 0.65);
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.65);
}

.dark .utility-mode :deep(label) {
  color: #e2e8f0;
}

.dark .utility-language {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%);
  border-color: rgba(71, 85, 105, 0.65);
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.65);
}

.dark .utility-language-btn--ghost {
  color: #cbd5f5;
}

.dark .utility-language-btn--ghost:hover {
  color: #f8fafc;
}

/* Utility contact chips */
.utility-contact {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.82rem;
}

.utility-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: #1f2937;
  text-decoration: none;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.utility-chip:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(59, 130, 246, 0.45);
  color: #1d4ed8;
}

.utility-chip--muted {
  cursor: default;
  background: rgba(248, 250, 252, 0.7);
  border-style: dashed;
  border-color: rgba(148, 163, 184, 0.55);
  box-shadow: none;
}

.utility-chip--muted .utility-value {
  color: #475569;
}

.utility-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.utility-chip:hover .utility-icon {
  background: rgba(59, 130, 246, 0.18);
}

.utility-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.utility-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
}

.utility-value {
  font-size: 0.85rem;
  font-weight: 600;
}

.utility-action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(241, 245, 249, 0.75) 100%);
  color: #1f2937;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.utility-action-button:hover {
  border-color: rgba(29, 78, 216, 0.5);
  color: #1d4ed8;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.18);
}

.utility-separator {
  width: 1px;
  height: 28px;
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0), rgba(148, 163, 184, 0.6), rgba(148, 163, 184, 0));
}

.dark .utility-chip {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%);
  border-color: rgba(71, 85, 105, 0.6);
  color: #e2e8f0;
  box-shadow: 0 12px 24px rgba(2, 6, 23, 0.55);
}

.dark .utility-chip:hover {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 64, 175, 0.65) 100%);
  border-color: rgba(96, 165, 250, 0.55);
  color: #f8fafc;
}

.dark .utility-chip--muted {
  background: rgba(15, 23, 42, 0.75);
  border-color: rgba(51, 65, 85, 0.7);
  box-shadow: none;
}

.dark .utility-chip--muted .utility-value {
  color: #cbd5f5;
}

.dark .utility-icon {
  background: rgba(37, 99, 235, 0.22);
  color: #bfdbfe;
}

.dark .utility-action-button {
  border-color: rgba(37, 99, 235, 0.45);
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(37, 99, 235, 0.4) 100%);
  color: #e2e8f0;
  box-shadow: 0 12px 24px rgba(2, 6, 23, 0.6);
}

.dark .utility-action-button:hover {
  border-color: rgba(96, 165, 250, 0.55);
  color: #f8fafc;
  box-shadow: 0 14px 28px rgba(14, 23, 42, 0.8);
}

.dark .utility-label {
  color: #94a3b8;
}

.dark .utility-separator {
  background: linear-gradient(to bottom, rgba(30, 41, 59, 0), rgba(148, 163, 184, 0.5), rgba(30, 41, 59, 0));
}

/* Mobile Menu Animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Help Widget Animations */
.help-widget-enter-active,
.help-widget-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.help-widget-enter-from,
.help-widget-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Keyframe Animations */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Enhanced Hover Effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

/* Mobile clock & menu styling */
.mobile-clock {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.92) 0%, rgba(199, 210, 254, 0.88) 100%);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  color: #1f2937;
}

.mobile-clock-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #2563eb;
}

.mobile-clock-text {
  color: inherit;
  white-space: nowrap;
}

.dark .mobile-clock {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.92) 0%, rgba(30, 64, 175, 0.85) 100%);
  border-color: rgba(59, 130, 246, 0.25);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.45);
  color: #e2e8f0;
}

.dark .mobile-clock-icon {
  color: #93c5fd;
}

/* Light Mode - SUPER KEREN Hamburger Menu dengan Gradient Modern */
.mobile-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: #ffffff;
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.3),
    0 2px 6px rgba(118, 75, 162, 0.2),
    0 8px 16px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.mobile-menu-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.mobile-menu-btn:hover::before {
  left: 100%;
}

.mobile-menu-btn:hover,
.mobile-menu-btn:focus-visible {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 50%, #e082ea 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 8px 20px rgba(102, 126, 234, 0.4),
    0 4px 10px rgba(118, 75, 162, 0.3),
    0 12px 24px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.mobile-menu-btn:active {
  transform: translateY(0) scale(1.02);
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.3),
    0 2px 6px rgba(118, 75, 162, 0.2);
}

.dark .mobile-menu-btn {
  background: linear-gradient(135deg, #1d4ed8 0%, #5b21b6 45%, #db2777 100%);
  color: #f8fafc;
  border-color: rgba(148, 163, 184, 0.45);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.45);
}

.mobile-menu-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: inherit;
}

.dark .mobile-menu-icon {
  color: inherit;
}

@media (max-width: 640px) {
  .mobile-clock {
    font-size: 0.82rem;
    padding: 0.4rem 0.8rem;
    gap: 0.4rem;
  }

  .mobile-menu-btn {
    padding: 0.48rem;
    border-radius: 0.9rem;
  }

  .mobile-menu-icon {
    width: 1.6rem;
    height: 1.6rem;
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .modern-marquee-banner::before,
  .modern-marquee-banner::after {
    width: 44px;
  }

  .marquee-item {
    font-size: 0.72rem;
    padding: 0.3rem 0.75rem;
    gap: 0.45rem;
  }

  .utility-chip {
    padding: 0.35rem 0.75rem;
  }

  .modern-header {
    padding: 0;
  }
}

@media (max-width: 1024px) {
  .utility-inner {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .utility-section {
    justify-content: flex-start;
  }

  .utility-section:not(:first-child) {
    padding-left: 0;
  }

  .utility-section:not(:first-child)::before {
    display: none;
  }

  .utility-section--actions {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .utility-bar {
    padding: 0 1rem;
  }

  .utility-inner {
    gap: 0.75rem;
  }

  .utility-section {
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
  }

  .utility-contact {
    width: 100%;
  }

  .utility-chip {
    width: 100%;
    justify-content: flex-start;
  }

  .utility-stat,
  .utility-mode,
  .utility-language,
  .utility-action-button {
    width: 100%;
    justify-content: center;
  }

  .utility-inline-divider {
    display: none;
  }
}

/* Glassmorphism Effect */
.modern-header {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Enhanced Focus States */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth Transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Performance Optimizations */
.modern-header,
.marquee-content,
.floating-shapes {
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .marquee-content,
  .shape,
  .modern-header {
    animation: none;
  }
  
  * {
    transition: none;
  }
}
</style>