<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#imports'

const { locale } = useI18n()
const loading = ref(false)
const errorMsg = ref('')
const iconFailed = ref(false)
const idFlagFailed = ref(false)
const usFlagFailed = ref(false)
const emit = defineEmits<{ (e: 'switched', locale: 'id' | 'en'): void }>()

// Online/offline detection and status for the indicator dot
const isOnline = ref(true)
function getNavigatorOnline(): boolean {
  try { return typeof navigator !== 'undefined' ? !!navigator.onLine : true } catch { return true }
}
function handleOnline() { isOnline.value = true }
function handleOffline() { isOnline.value = false }

// Compute status priority: offline > fetching > online
const status = computed<'offline' | 'fetching' | 'online'>(() => {
  if (!isOnline.value) return 'offline'
  return loading.value ? 'fetching' : 'online'
})
const statusClass = computed(() => (
  status.value === 'offline' ? 'dot-red' : status.value === 'fetching' ? 'dot-blue' : 'dot-green'
))
const statusLabel = computed(() => (
  status.value === 'offline' ? 'Offline: tidak terhubung' : status.value === 'fetching' ? 'Sedang mengambil data' : 'Online tersambung'
))

// Control label style: 'code' (ID/EN) by default, or 'full' (Indonesia/English)
const props = withDefaults(defineProps<{ labelMode?: 'code' | 'full' }>(), { labelMode: 'code' })

// Smart cache system for translations - avoid unnecessary API calls
const messageCache = new Map<string, { messages: Record<string, any>; timestamp: number }>()
const CACHE_DURATION_ID = 24 * 60 * 60 * 1000 // ID: 24 hours (stable)
const CACHE_DURATION_EN = 30 * 60 * 1000 // EN: 30 minutes (may update)

async function refreshMessages(target: 'id' | 'en') {
  try {
    // Check cache first (SUPER PINTAR - no unnecessary API calls!)
    const cached = messageCache.get(target)
    const cacheDuration = target === 'id' ? CACHE_DURATION_ID : CACHE_DURATION_EN
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < cacheDuration) {
      console.log(`[i18n] Using cached messages for ${target} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`)
      
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

    // For EN: only trigger sync if switching to EN (not on every refresh)
    // Translations are handled by nightly scheduler at 2 AM
    if (target === 'en' && locale.value !== 'en') {
      try {
        // Check if sync is needed (non-blocking background check)
        const syncCheck = $fetch('/api/i18n/sync', { 
          method: 'POST',
          timeout: 5000 // 5s timeout
        }).catch(err => {
          console.log('[i18n] Background sync check failed (expected during first load):', err.message)
        })
        // Don't wait for sync, continue loading messages
      } catch {}
    }

    // Fetch messages from API with caching headers
    const res = await $fetch<{ locale: string; messages: Record<string, any>; cached?: boolean }>(
      '/api/i18n/messages', { 
        query: { locale: target },
        headers: {
          'Cache-Control': 'public, max-age=1800'
        }
      }
    )
    const msgs = res?.messages || {}

    // Store in cache
    messageCache.set(target, {
      messages: msgs,
      timestamp: now
    })
    console.log(`[i18n] Fetched and cached messages for ${target}`)

    // Apply messages to i18n instance
    const nuxtApp = useNuxtApp()
    const provided: any = (nuxtApp as any).$i18n
    try {
      if (provided?.global?.setLocaleMessage) {
        provided.global.setLocaleMessage(target, msgs)
      } else if (provided?.setLocaleMessage) {
        provided.setLocaleMessage(target, msgs)
      }
    } catch (e) {
      console.warn('Failed to set locale messages', e)
    }
  } catch (e: any) {
    errorMsg.value = e?.message || 'Gagal memuat bahasa'
    console.error('[i18n] Error loading messages:', e)
  }
}

async function switchLocale(target: 'id' | 'en') {
  if (loading.value || locale.value === target) return
  loading.value = true
  errorMsg.value = ''
  try {
    await refreshMessages(target)
    locale.value = target
    if (import.meta.client) {
      try { document.documentElement.setAttribute('lang', target) } catch {}
      try { localStorage.setItem('userLocale', target) } catch {}
      try { localStorage.setItem('lang', target) } catch {}
      try {
        const isEn = target === 'en'
        const maxAge = isEn ? (60 * 30) : (60 * 60 * 24 * 365) // EN: 30m, ID: 1y
        document.cookie = `i18n_locale=${encodeURIComponent(target)}; path=/; max-age=${maxAge}; samesite=lax`
        document.cookie = `i18n_selected=true; path=/; max-age=${maxAge}; samesite=lax`
        if (isEn) {
          const now = Date.now()
          document.cookie = `i18n_selected_at=${now}; path=/; max-age=${maxAge}; samesite=lax`
        } else {
          // Clear timestamp if switching back to Indonesian
          document.cookie = `i18n_selected_at=; path=/; max-age=0; samesite=lax`
        }
      } catch {}
    }
    try { emit('switched', target) } catch {}
  } finally {
    loading.value = false
  }
}

function toggleLocale() {
  const target: 'id' | 'en' = (locale.value === 'id' ? 'en' : 'id')
  switchLocale(target)
}

onMounted(() => {
  if (import.meta.client) {
    // Initialize online state and listeners
    try { isOnline.value = getNavigatorOnline() } catch {}
    try {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    } catch {}

    // Restore saved locale if exists
    try {
      const saved = localStorage.getItem('lang') || localStorage.getItem('userLocale')
      if ((saved === 'id' || saved === 'en') && saved !== locale.value) {
        // Load messages and switch locale to saved one
        switchLocale(saved as 'id' | 'en')
      }
    } catch {}
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    try {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    } catch {}
  }
})

</script>

<template>
  <div class="language-switcher" :class="{ 'is-id': locale === 'id', 'is-en': locale === 'en' }">
    <!-- Translate icon next to switch -->
    <div class="translate-icon-wrap">
      <img v-if="!iconFailed" src="/icons/translate.svg" alt="" class="translate-img" @error="iconFailed = true" loading="lazy" decoding="async" fetchpriority="low" />
      <span v-else class="translate-fallback" title="Translate">ðŸŒ</span>
      <span class="status-dot" :class="statusClass" :title="statusLabel" :aria-label="statusLabel"></span>
    </div>

    <!-- Segmented control for ID/EN -->
    <div class="lang-switch" role="group" aria-label="Language switcher">
      <button
        class="lang-btn"
        data-lang="id"
        data-tooltip="Indonesia"
        :class="{ active: locale === 'id' }"
        :aria-pressed="locale === 'id'"
        @click="switchLocale('id')">
        <svg class="flag-icon" viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect width="3" height="1" y="0" fill="#E70011"/>
          <rect width="3" height="1" y="1" fill="#FFFFFF"/>
        </svg>
        <span class="sr-only">Indonesia</span>
        <span v-if="props.labelMode === 'code'" class="label-code">ID</span>
      </button>
      <button
        class="lang-btn"
        data-lang="en"
        data-tooltip="English"
        :class="{ active: locale === 'en' }"
        :aria-pressed="locale === 'en'"
        @click="switchLocale('en')">
        <svg class="flag-icon" viewBox="0 0 19 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="s">
              <rect width="19" height="10" rx="1" ry="1"/>
            </clipPath>
          </defs>
          <g clip-path="url(#s)">
            <rect width="19" height="10" fill="#ffffff"/>
            <g fill="#B22234">
              <rect width="19" height="1" y="0"/>
              <rect width="19" height="1" y="2"/>
              <rect width="19" height="1" y="4"/>
              <rect width="19" height="1" y="6"/>
              <rect width="19" height="1" y="8"/>
            </g>
            <rect width="8" height="5.6" fill="#3C3B6E"/>
            <g fill="#ffffff">
              <circle cx="1" cy="1" r="0.2"/>
              <circle cx="2" cy="1" r="0.2"/>
              <circle cx="3" cy="1" r="0.2"/>
              <circle cx="4" cy="1" r="0.2"/>
              <circle cx="5" cy="1" r="0.2"/>
              <circle cx="6" cy="1" r="0.2"/>
              <circle cx="7" cy="1" r="0.2"/>
              <circle cx="1.5" cy="2" r="0.2"/>
              <circle cx="2.5" cy="2" r="0.2"/>
              <circle cx="3.5" cy="2" r="0.2"/>
              <circle cx="4.5" cy="2" r="0.2"/>
              <circle cx="5.5" cy="2" r="0.2"/>
              <circle cx="6.5" cy="2" r="0.2"/>
              <circle cx="1" cy="3" r="0.2"/>
              <circle cx="2" cy="3" r="0.2"/>
              <circle cx="3" cy="3" r="0.2"/>
              <circle cx="4" cy="3" r="0.2"/>
              <circle cx="5" cy="3" r="0.2"/>
              <circle cx="6" cy="3" r="0.2"/>
              <circle cx="7" cy="3" r="0.2"/>
            </g>
          </g>
        </svg>
        <span class="sr-only">English (United States)</span>
        <span v-if="props.labelMode === 'code'" class="label-code">EN</span>
      </button>
    </div>

    <span v-if="loading" class="spinner" aria-label="loading"></span>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
  position: relative; /* ensure z-index works */
  z-index: 30; /* above typical section backgrounds/gradients */
}
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #999;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: all .2s ease;
  min-height: 40px;
  user-select: none;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.lang-btn:hover,
.lang-btn.active {
  background: #ff6600;
  color: #fff;
  border-color: #ff6600;
  box-shadow: 0 4px 8px rgba(255, 102, 0, 0.4);
  transform: translateY(-1px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
/* Translate icon styling with strong contrast */
.translate-icon {
  font-size: 18px;
  line-height: 1;
  color: #ff6600; /* high-contrast on light bg */
  vertical-align: middle;
}
.lang-btn:hover .translate-icon,
.lang-btn.active .translate-icon { color: #fff; }
html.dark .language-switcher .translate-icon { color: #f59e0b; }
/* Fallback text shown if icon library not loaded */
.fallback-text {
  margin-left: 6px;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
  color: #111827;
}
html.dark .fallback-text { color: #e5e7eb; }
html.icons-ready .fallback-text { display: none; }
.lang-btn:hover .code,
.lang-btn.active .code {
  background: transparent;
  color: #fff;
  border-color: rgba(255,255,255,0.5);
}
.lang-btn:not(.active) .flag-icon { filter: grayscale(100%) saturate(0.6) contrast(0.95); opacity: 0.8; }
.lang-btn.active .flag-icon { filter: none; box-shadow: 0 0 0 1px rgba(0,0,0,0.06) inset, 0 0 0 2px rgba(255,102,0,0.35); }
/* Clean language buttons without frame effects */
html.dark .language-switcher .lang-btn { 
  border: none; 
  background: transparent; 
  color: #ffffff; 
  box-shadow: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 600;
  transition: all 0.2s ease;
}

html.dark .language-switcher .lang-btn:hover,
html.dark .language-switcher .lang-btn.active { 
  background: rgba(59, 130, 246, 0.1); 
  border: none; 
  color: #60a5fa; 
  transform: none;
  box-shadow: none;
}

html.dark .language-switcher .lang-btn:not(.active) {
  background: transparent;
  border: none;
  color: #d1d5db;
}

html.dark .language-switcher .lang-btn:not(.active):hover {
  background: rgba(107, 114, 128, 0.1);
  color: #ffffff;
  transform: none;
  box-shadow: none;
}
html.dark .language-switcher .lang-btn:not(.active) .flag-icon { 
  filter: grayscale(100%) saturate(0.5) brightness(0.95); 
  opacity: 0.75; 
}

html.dark .language-switcher .lang-btn.active .flag-icon { 
  filter: brightness(1.1) contrast(1.1) saturate(1.1); 
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 0 2px rgba(96,165,250,0.45); 
}

/* Additional improvements for better visibility */
html.dark .language-switcher .translate-icon { 
  color: #60a5fa !important; 
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5)); 
}
/* Dark mode chip contrast */
html.dark .language-switcher .code { background: #374151; color: #e5e7eb; border-color: #4b5563; }
html.dark .language-switcher .lang-btn:hover .code,
html.dark .language-switcher .lang-btn.active .code { background: transparent; color: #fff; border-color: rgba(255,255,255,0.4); }
.flag-icon {
  width: 18px;
  height: 12px;
  display: inline-block;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.06) inset;
  mix-blend-mode: normal;
  color: initial;
  background-color: transparent;
  vertical-align: middle;
  transition: filter .2s ease, opacity .2s ease, box-shadow .2s ease;
}
.code {
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 9999px;
  background: #f1f5f9;
  color: #000000;
  line-height: 1.2;
  border: 2px solid #cbd5e1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.spinner {
  width: 16px; height: 16px; border: 2px solid #e5e7eb; border-top-color: #2563eb;
  border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; margin-left: 6px;
}
@keyframes spin { to { transform: rotate(360deg) } }
.error { color: #dc2626; font-size: 12px; margin-left: 8px }
/* Screen reader only text */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
/* Simple tooltip for touch/hover/focus */
.lang-btn { position: relative; }
.lang-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) scale(0.98);
  background: rgba(0,0,0,.8);
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s ease, transform .15s ease;
  z-index: 1000;
}
.lang-btn::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: rgba(0,0,0,.8);
  opacity: 0;
  transition: opacity .15s ease;
}
.lang-btn:hover::after,
.lang-btn:focus-visible::after,
.lang-btn:active::after { opacity: 1; transform: translateX(-50%) translateY(2px) scale(1); }
.lang-btn:hover::before,
.lang-btn:focus-visible::before,
.lang-btn:active::before { opacity: 1; }

/* Focus visibility */
.lang-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.30), 0 1px 6px rgba(0,0,0,.06);
}

/* Mobile enhancements */
@media (max-width: 640px) {
  .language-switcher { gap: 10px; }
  .pill-switch { position: relative; }
  .lang-btn {
    padding: 6px 12px;
    border-radius: 6px;
    z-index: 10; /* ensure above subtle overlays */
  }
  .flag-icon {
    width: 22px;
    height: 14px;
  }
  .code {
    font-size: 13px;
    padding: 3px 8px;
  }
  /* Keep strong readability on touch (hover/active) in small screens */
  .language-switcher .lang-btn:hover,
  .language-switcher .lang-btn:active {
    background: #f9f9f9;
    color: #111827;
    border-color: #ddd;
  }
  .language-switcher .lang-btn:hover .code,
  .language-switcher .lang-btn:active .code {
    background: #f3f4f6;
    color: #111827;
    border-color: #e5e7eb;
  }
  /* Dark mode parity for mobile */
  html.dark .language-switcher .lang-btn:hover,
  html.dark .language-switcher .lang-btn:active {
    background: #1f2937;
    color: #e5e7eb;
    border-color: #374151;
  }
  html.dark .language-switcher .lang-btn:hover .code,
  html.dark .language-switcher .lang-btn:active .code {
    background: #374151;
    color: #e5e7eb;
    border-color: #4b5563;
  }
}
/* New pill switch styles */
.translate-icon-wrap { display: inline-flex; align-items: center; justify-content: center; }
.translate-img { width: 20px; height: 20px; display: inline-block; }
.translate-fallback { font-size: 18px; line-height: 1; }

.pill-switch { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; padding: 2px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 9999px; position: relative; z-index: 31; }
.pill-indicator { position: absolute; top: 2px; left: 2px; bottom: 2px; width: calc(50% - 1px); background: linear-gradient(180deg, #ff7a1a 0%, #ff6600 100%); border-radius: 9999px; box-shadow: 0 4px 12px rgba(255,102,0,0.28), 0 2px 6px rgba(0,0,0,0.06) inset; transition: transform .25s ease; will-change: transform; }
.language-switcher.is-en .pill-indicator { transform: translateX(calc(100% + 2px)); }
.pill { appearance: none; border: 0; background: transparent; padding: 8px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; color: #111827; cursor: pointer; line-height: 1; min-width: 44px; min-height: 36px; position: relative; z-index: 1; }
.pill.active { background: transparent; color: #fff; }
.pill:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.30); }

/* Dark mode */
html.dark .pill-switch { background: #1f2937; border-color: #374151; }
html.dark .pill { color: #e5e7eb; }

/* Mobile refinements */
@media (max-width: 640px) {
  .translate-img { width: 18px; height: 18px; }
  .pill { padding: 6px 10px; font-size: 12px; }
}

/* Visual polish: flags and translate icon badge */
.flag-emoji { margin-right: 0; font-size: 16px; line-height: 1; display: inline-block; transform: translateY(1px); transition: transform .15s ease, opacity .15s ease; will-change: transform; }
.pill:hover .flag-emoji { transform: translateY(1px) scale(1.08); }
.pill.active .flag-emoji { transform: translateY(1px) scale(1.12); }
.pill:not(.active) .flag-emoji { opacity: 0.9; }
/* New image-based flag icon */
.flag-img { width: 18px; height: 12px; display: inline-block; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,0.06) inset; vertical-align: middle; transform: translateY(1px); transition: transform .15s ease, opacity .15s ease, box-shadow .2s ease; }
.pill:hover .flag-img { transform: translateY(1px) scale(1.08); }
.pill.active .flag-img { transform: translateY(1px) scale(1.12); }
.pill:not(.active) .flag-img { opacity: 0.9; }
.pill-label { display: none; }
.translate-icon-wrap { width: 28px; height: 28px; border-radius: 9999px; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); position: relative; }
html.dark .translate-icon-wrap { background: #111827; border-color: #374151; }
/* Position status dot on the globe icon */
.translate-icon-wrap .status-dot { position: absolute; right: -2px; bottom: -2px; margin: 0; width: 10px; height: 10px; }
html.dark .pill-indicator { box-shadow: 0 4px 12px rgba(255,102,0,0.22), 0 2px 6px rgba(0,0,0,0.25) inset; }

/* Touch-friendly sizing */
@media (max-width: 640px) {
  .pill { min-height: 40px; padding: 8px 12px; }
}

/* Status dot styles next to Indonesian flag */
.status-dot { width: 10px; height: 10px; border-radius: 9999px; display: inline-block; margin-left: 6px; position: relative; box-shadow: 0 0 0 2px rgba(255,255,255,0.9); }
html.dark .status-dot { box-shadow: 0 0 0 2px rgba(17,24,39,0.95); }

.dot-blue { background: #3b82f6; animation: pulse-blue 1.4s ease-in-out infinite; }
.dot-green { background: #10b981; animation: pulse-green 1.6s ease-in-out infinite; }
.dot-red { background: #ef4444; animation: pulse-red 1.2s ease-in-out infinite; }

@keyframes pulse-blue {
  0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.60) }
  70% { box-shadow: 0 0 0 8px rgba(59,130,246,0.00) }
  100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.00) }
}
@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.60) }
  70% { box-shadow: 0 0 0 8px rgba(16,185,129,0.00) }
  100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.00) }
}
@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.60) }
  70% { box-shadow: 0 0 0 8px rgba(239,68,68,0.00) }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.00) }
}
/* Compact segmented control styles (sleeker + smaller) */
.lang-switch{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,0.95);backdrop-filter:saturate(1.2) blur(8px);-webkit-backdrop-filter:saturate(1.2) blur(8px);border:2px solid rgba(0,0,0,0.2);box-shadow:0 3px 12px rgba(0,0,0,0.15) inset,0 2px 6px rgba(0,0,0,0.1)}
/* animated indicator */
/* Active pill indicator - unified blue-indigo gradient */
.lang-switch::before{content:"";position:absolute;top:2px;left:2px;bottom:2px;width:calc(50% - 3px);border-radius:999px;background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);box-shadow:0 4px 10px rgba(37,99,235,0.25),0 1px 4px rgba(0,0,0,0.08) inset;transform:translateX(0);transition:transform .22s ease}
.language-switcher.is-en .lang-switch::before{transform:translateX(calc(100% + 2px))}

.lang-switch .lang-btn{position:relative;z-index:1;min-width:48px;height:36px;padding:0 12px;border:0;background:transparent;font:900 14px/1 system-ui;border-radius:999px;cursor:pointer;color:#1f2937;user-select:none;letter-spacing:0.3px;text-shadow:0 1px 2px rgba(0,0,0,0.1)}
/* override earlier orange hover/active; keep it clean */
.lang-switch .lang-btn:hover,
.lang-switch .lang-btn.active{background:transparent !important;color:inherit;border-color:transparent}
.lang-switch .lang-btn[aria-pressed="true"]{background:transparent !important;color:#ffffff;font-weight:900;text-shadow:0 2px 4px rgba(0,0,0,0.3)}
.lang-switch .lang-btn:focus-visible{outline:2px solid #2563eb;outline-offset:2px}

/* flag sizing + micro interaction */
.lang-switch .flag-icon{width:16px;height:11px;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,0.06) inset;transition:transform .15s ease,filter .2s ease,box-shadow .2s ease}
.lang-switch .lang-btn:hover .flag-icon{transform:translateY(0) scale(1.06)}
.lang-switch .lang-btn[aria-pressed="true"] .flag-icon{filter:none;box-shadow:0 0 0 1px rgba(0,0,0,0.08) inset,0 0 0 2px rgba(37,99,235,0.35)}

/* dark mode parity */
html.dark .lang-switch{background:rgba(17,24,39,0.90);border-color:#6b7280;box-shadow:0 3px 12px rgba(0,0,0,0.4) inset,0 2px 6px rgba(0,0,0,0.4)}
html.dark .lang-switch::before{box-shadow:0 4px 12px rgba(37,99,235,0.4),0 2px 6px rgba(0,0,0,0.4) inset}
html.dark .lang-switch .lang-btn{color:#f3f4f6;text-shadow:0 1px 2px rgba(0,0,0,0.3)}
html.dark .lang-switch .lang-btn[aria-pressed="true"]{color:#ffffff;font-weight:900;text-shadow:0 2px 4px rgba(0,0,0,0.5)}

/* make globe a touch smaller to reduce visual weight */
.translate-icon-wrap{width:24px;height:24px}
.translate-img{width:18px;height:18px}

/* ID/EN text visibility improvements inside segmented control */
.lang-switch .label-code { margin-left: 6px; font-weight: 900; font-size: 13px; letter-spacing: 0.5px; line-height: 1; color: currentColor; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
/* Force white text on the active side so it doesn't blend with orange indicator */
.language-switcher.is-id .lang-switch .lang-btn[data-lang="id"][aria-pressed="true"],
.language-switcher.is-en .lang-switch .lang-btn[data-lang="en"][aria-pressed="true"] { color: #ffffff !important; font-weight: 900 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important; }
/* Dark mode keeps same behavior */
html.dark .language-switcher.is-id .lang-switch .lang-btn[data-lang="id"][aria-pressed="true"],
html.dark .language-switcher.is-en .lang-switch .lang-btn[data-lang="en"][aria-pressed="true"] { color: #ffffff !important; font-weight: 900 !important; text-shadow: 0 2px 4px rgba(0,0,0,0.5) !important; }
</style>

