<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter, useRoute } from '#imports'

const props = defineProps<{ origin?: 'header' | 'mobile' | 'desktop'; autoExpand?: boolean }>()

const router = useRouter()
const route = useRoute()
const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const expanded = ref(false)
const term = ref('')
const suggestions = ref<{ title: string; slug: string; date?: string; excerpt?: string }[]>([])
const showDropdown = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const controllerRef = ref<AbortController | null>(null)
const typingTimer = ref<number | null>(null)
// Responsive dropdown max height (updates based on viewport and input position)
const dropdownMaxHeight = ref<string>('24rem')
function updateDropdownMaxHeight() {
  try {
    if (!import.meta.client) return
    const el = inputRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewportH = Math.max(window.innerHeight || 0, 0)
    const gap = 12 // space below input
    const available = Math.max(0, Math.floor(viewportH - rect.bottom - gap))
    // Keep dropdown within viewport; allow up to 80vh, but never exceed available space
    const clamped = Math.max(80, Math.min(available, Math.floor(viewportH * 0.8)))
    dropdownMaxHeight.value = `${clamped}px`
  } catch {}
}

// Loading bar state for search progress
const searching = ref(false)
const progress = ref(0)
const remainMs = ref(0)
const endAt = ref(0)
let progressTimer: number | null = null
const MAX_SEARCH_MS = 10000

function startSearchProgress(duration: number = MAX_SEARCH_MS) {
  try { if (progressTimer) window.clearInterval(progressTimer) } catch {}
  const start = Date.now()
  endAt.value = start + duration
  searching.value = true
  progress.value = 5
  remainMs.value = duration
  progressTimer = window.setInterval(() => {
    const now = Date.now()
    const total = Math.max(duration, 1)
    const elapsed = Math.min(now - start, total)
    const ratio = elapsed / total
    const eased = 1 - Math.pow(1 - ratio, 2) // ease-out
    progress.value = Math.min(99, Math.max(5, Math.round(eased * 100)))
    remainMs.value = Math.max(0, endAt.value - now)
    if (now >= endAt.value) {
      stopSearchProgress(false)
    }
  }, 100)
}

function stopSearchProgress(_success: boolean = true) {
  try {
    if (progressTimer) {
      window.clearInterval(progressTimer)
      progressTimer = null
    }
  } catch {}
  progress.value = 100
  remainMs.value = 0
  // give a brief moment to show 100%
  setTimeout(() => { searching.value = false }, 400)
}

const HISTORY_KEY = 'blog-search-history'
const history = ref<string[]>([])

function sanitize(input: string): string {
  if (!input) return ''
  return input.replace(/\s+/g, ' ').trim().slice(0, 64)
}

function stripHtml(html: string) {
  if (!html) return ''
  if (typeof window === 'undefined') {
    return (html || '').replace(/<[^>]*>/g, '')
  }
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function highlight(text: string, keyword: string) {
  const safe = (text || '').toString()
  const terms = (keyword || '').split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!terms.length) return safe
  const re = new RegExp(`(${terms.join('|')})`, 'gi')
  // prettier, rounded highlight for better readability
  return safe.replace(re, '<mark class="px-0.5 rounded bg-amber-200/70 dark:bg-amber-400/20">$1</mark>')
}

function loadHistory() {
  try {
    if (import.meta.client) {
      const raw = localStorage.getItem(HISTORY_KEY)
      history.value = raw ? JSON.parse(raw) : []
    }
  } catch {}
}

function saveHistory(value: string) {
  try {
    if (!value) return
    const v = sanitize(value)
    if (!v) return
    const arr = [v, ...history.value.filter((x) => x.toLowerCase() !== v.toLowerCase())]
    history.value = arr.slice(0, 5)
    if (import.meta.client) localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  } catch {}
}

function trackSearchSubmit(keyword: string) {
  const payload = { event: 'search_submit', keyword, origin: props.origin || 'header', ts: Date.now() }
  try {
    if (import.meta.client && (window as any).dataLayer) {
      ;(window as any).dataLayer.push(payload)
    }
    if (import.meta.client) {
      window.dispatchEvent(new CustomEvent('analytics', { detail: payload }))
    }
  } catch {}
}

async function fetchSuggestions(q: string) {
  if (controllerRef.value) controllerRef.value.abort()
  controllerRef.value = new AbortController()
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch<any[]>(`/api/blog/suggest`, {
      params: { q, limit: 12, lang: (route.query.lang as string) || undefined },
      signal: controllerRef.value.signal,
      retry: 0,
      timeout: 15000,
      onResponseError({ response }) {
        // Silently handle errors - don't spam console
        if (response.status >= 500) {
          console.debug('Search suggest API error:', response.status)
        }
      }
    }).catch(() => {
      // Return empty array on any error
      return []
    })
    const qLower = (sanitize(q) || '').toLowerCase()
    const items = Array.isArray(res) ? res : []
    const filtered = items.filter((it: any) => {
      const titlePlain = stripHtml(it?.title || '')
      return titlePlain.toLowerCase().includes(qLower)
    })
    suggestions.value = filtered.slice(0, 12)
    console.log('Filtered suggestions:', suggestions.value)
  } catch (e) {
    console.error('Error fetching suggestions:', e)
    suggestions.value = []
    errorMsg.value = 'Gagal memuat saran pencarian'
  } finally {
    loading.value = false
  }
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  term.value = val
  const q = sanitize(val)
  if (!q || q.length < 3) {
    suggestions.value = []
    return
  }
  if (typingTimer.value) clearTimeout(typingTimer.value)
  typingTimer.value = window.setTimeout(() => fetchSuggestions(q), 300)
}

function collapse() {
  if (props.origin !== 'mobile') {
    expanded.value = false
  }
  showDropdown.value = false
  inputRef.value?.blur()
}

function gotoResult() {
  const q = sanitize(term.value)
  if (!q) {
    router.push({ path: '/blog' })
    collapse()
    return
  }
  saveHistory(q)
  trackSearchSubmit(q)
  if (import.meta.client) startSearchProgress()
  router.push({ path: '/blog/search', query: { q, lang: route.query.lang } })
  collapse()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    gotoResult()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    collapse()
  }
}

function focusInput() {
  if (props.origin === 'mobile') {
    inputRef.value?.focus()
    showDropdown.value = true
    nextTick(() => updateDropdownMaxHeight())
  } else {
    expanded.value = true
    nextTick(() => {
      inputRef.value?.focus()
      showDropdown.value = true
      updateDropdownMaxHeight()
    })
  }
}

function toggleExpand() {
  if (props.origin === 'mobile') return
  if (!expanded.value) {
    focusInput()
  } else {
    collapse()
  }
}

function onGlobalKey(e: KeyboardEvent) {
  const tag = (document.activeElement?.tagName || '').toUpperCase()
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault()
    focusInput()
  }
}

function onDocMousedown(e: MouseEvent) {
  const el = rootRef.value
  if (el && !el.contains(e.target as Node)) {
    collapse()
  }
}

const onBlogSearchLoaded = () => stopSearchProgress(true)

onMounted(() => {
  loadHistory()
  window.addEventListener('keydown', onGlobalKey)
  document.addEventListener('mousedown', onDocMousedown)
  window.addEventListener('blog-search:loaded', onBlogSearchLoaded)
  // Keep dropdown height responsive to viewport
  window.addEventListener('resize', updateDropdownMaxHeight)
  window.addEventListener('orientationchange', updateDropdownMaxHeight)
  window.addEventListener('scroll', () => { if (showDropdown.value) updateDropdownMaxHeight() }, { passive: true } as any)
  // Auto expand and focus immediately when requested (e.g., inside header popover)
  if (props.autoExpand) {
    nextTick(() => focusInput())
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey)
  document.removeEventListener('mousedown', onDocMousedown)
  window.removeEventListener('blog-search:loaded', onBlogSearchLoaded)
  window.removeEventListener('resize', updateDropdownMaxHeight)
  window.removeEventListener('orientationchange', updateDropdownMaxHeight)
  // Can't easily remove the anonymous scroll handler; safe since component lifespan is page-level. No-op.
  if (typingTimer.value) clearTimeout(typingTimer.value)
})

watch(
  () => route.fullPath,
  () => collapse()
)
// Recalculate dropdown height whenever it's shown
watch(
  () => showDropdown.value,
  (open) => { if (open) nextTick(() => updateDropdownMaxHeight()) }
)
// Lightweight touch glow directive for hover/touch feedback
const vTouchGlow = {
  mounted(el: HTMLElement) {
    const add = () => {
      el.classList.add('ring-2','ring-blue-400/40','shadow-lg')
    }
    const remove = () => {
      el.classList.remove('ring-2','ring-blue-400/40','shadow-lg')
    }
    const onDown = () => {
      add()
      window.setTimeout(remove, 220)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        add(); window.setTimeout(remove, 220)
      }
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('keydown', onKey)
    ;(el as any)._glowHandlers = { onDown, onKey }
  },
  unmounted(el: HTMLElement) {
    const h = (el as any)._glowHandlers
    if (h) {
      el.removeEventListener('pointerdown', h.onDown)
      el.removeEventListener('keydown', h.onKey)
    }
  }
}
</script>

<template>
  <div class="relative">
    <div
      ref="rootRef"
      class="relative shrink min-w-0 flex items-center transition-all duration-300 ease-out"
      :class="origin === 'mobile' ? 'w-full' : (expanded ? 'w-60 md:w-72 lg:w-64 xl:w-80' : 'w-10')"
      @keydown.stop="onKeydown"
    >
    <!-- Enhanced Collapsed button (desktop/header) -->
    <button
      v-if="origin !== 'mobile' && !expanded"
      v-touch-glow
      type="button"
      class="size-10 flex items-center justify-center rounded-full border-2 border-gradient-to-r from-blue-400 to-purple-500 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 transform hover:scale-110 hover:rotate-6"
      :aria-expanded="expanded ? 'true' : 'false'"
      aria-label="Buka pencarian"
      @click="toggleExpand"
      style="box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(147, 51, 234, 0.3);"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 filter drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Enhanced Search Input with Modern Design -->
    <div v-if="origin === 'mobile' || expanded" class="relative group w-full">
      <!-- Search Input with Glassmorphism Effect -->
      <div class="relative">
        <input
          ref="inputRef"
          :placeholder="origin === 'mobile' ? '🔍 Cari artikel blog terbaru...' : '🔍 Pencarian...'"
          class="w-full h-12 md:h-12 pl-12 pr-20 xl:pr-32 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-purple-200/50 dark:border-purple-700/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 hover:border-purple-400 hover:bg-white/90 dark:hover:bg-gray-800/90 focus:shadow-xl active:scale-[0.98] transition-all duration-300 group-hover:shadow-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
          type="text"
          v-model="term"
          @input="onInput"
          @focus="showDropdown = true"
        />
        
        <!-- Enhanced Search Icon -->
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div class="w-5 h-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Enhanced Search Button -->
        <button
          v-touch-glow
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-semibold px-4 xl:px-6 h-8 py-0 leading-none rounded-xl flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          @click="gotoResult"
          aria-label="Pencarian"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 xl:hidden mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden xl:inline">Cari</span>
        </button>
      </div>

      <!-- Enhanced Dropdown with Modern Design -->
      <div v-if="showDropdown" class="absolute top-full left-0 mt-2 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/50 rounded-2xl shadow-2xl z-[5000] p-3 overflow-y-auto overscroll-contain touch-pan-y scroll-smooth" :style="{ maxHeight: dropdownMaxHeight }">
        <!-- Search History Section -->
        <div v-if="term.length < 3 && history.length" class="mb-3">
          <div class="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pencarian Terakhir
          </div>
          <ul class="space-y-1">
            <li
              v-for="(h, i) in history"
              :key="i"
              v-touch-glow
              class="group flex items-center justify-between rounded-xl px-3 py-2 text-sm bg-gray-50/50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:bg-purple-100 dark:active:bg-purple-900/30 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"
              @click="term = h; gotoResult()"
            >
              <span class="truncate text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {{ h }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-active:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
          </ul>
        </div>
        
        <!-- Search Suggestions Section -->
        <div v-else-if="term.length >= 3">
          <div v-if="loading" class="flex items-center justify-center py-4">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="w-4 h-4 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" opacity="0.2"/>
                <path d="M22 12a10 10 0 0 1-10 10"/>
              </svg>
              Mencari artikel...
            </div>
          </div>
          <div v-else-if="!suggestions.length" class="flex items-center justify-center py-4">
            <div class="text-center">
              <div class="w-12 h-12 mx-auto mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p class="text-sm text-gray-500">Tidak ada artikel ditemukan</p>
              <p class="text-xs text-gray-400 mt-1">Coba kata kunci lain</p>
              <div v-if="errorMsg" class="mt-2">
                <p class="text-xs text-red-500">{{ errorMsg }}</p>
              </div>
              <!-- Fallback suggestions -->
              <div class="mt-3">
                <p class="text-xs text-gray-400 mb-2">Coba pencarian populer:</p>
                <div class="flex flex-wrap gap-1 justify-center">
                  <button
                    v-for="keyword in ['PayPal', 'Netflix', 'Gopay', 'Dana', 'Bitcoin']"
                    :key="keyword"
                    @click="term = keyword; gotoResult()"
                    class="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors"
                  >
                    {{ keyword }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ul v-else class="space-y-2">
            <li
              v-for="s in suggestions"
              :key="s.slug"
              v-touch-glow
              class="group relative rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:bg-purple-100 dark:active:bg-purple-900/30 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
              @click="router.push({ path: `/blog/${s.slug}` })"
            >
              <div class="pr-8">
                <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400" v-html="highlight(stripHtml(s.title || ''), term)"></div>
                <div v-if="s.date" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ new Date(s.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' }) }}
                </div>
                <div v-if="s.excerpt" class="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2" v-html="highlight(stripHtml(s.excerpt).slice(0, 120) + '…', term)"></div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-active:opacity-100 absolute right-3 top-1/2 -translate-y-1/2 translate-x-1 group-hover:translate-x-0 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
          </ul>
        </div>
        
        <!-- Minimum Characters Message -->
        <div v-else class="flex items-center justify-center py-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p class="text-sm text-gray-500">Ketik minimal 3 karakter</p>
            <p class="text-xs text-gray-400 mt-1">untuk melihat saran pencarian</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <!-- Global search progress bar -->
    <div v-if="searching" class="fixed inset-x-0 top-0 z-[9999] select-none">
      <div class="h-1.5 w-full bg-purple-100/50 dark:bg-purple-950/30">
        <div class="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transition-[width] duration-100 ease-out" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="fixed top-2 right-3 text-[11px] px-2 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 border border-purple-100/60 dark:border-purple-900/40 shadow text-purple-700 dark:text-purple-200 flex items-center gap-1">
        <svg class="size-3 animate-spin text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
        <span>{{ progress }}%</span>
        <span class="opacity-60">•</span>
        <span>Sisa {{ Math.max(0, Math.ceil(remainMs/1000)) }} dtk</span>
      </div>
    </div>
  </div>
</template>


