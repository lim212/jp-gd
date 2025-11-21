<template>
  <div class="relative">
    <!-- Smart Menu Button -->
    <button
      @click="toggleSmartMenu"
      class="flex items-center justify-center size-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 relative overflow-hidden group"
      :class="{ 'scale-105 shadow-2xl': isOpen }"
      aria-label="Smart Menu"
      title="Menu Pintar"
    >
      <!-- Animated Hamburger Icon -->
      <div class="relative w-6 h-6 flex flex-col justify-center items-center">
        <span 
          class="block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out"
          :class="{ 'rotate-45 translate-y-1.5': isOpen }"
        ></span>
        <span 
          class="block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out mt-1"
          :class="{ 'opacity-0': isOpen }"
        ></span>
        <span 
          class="block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out mt-1"
          :class="{ '-rotate-45 -translate-y-1.5': isOpen }"
        ></span>
      </div>
      
      <!-- Glow Effect -->
      <div 
        class="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 transition-opacity duration-300"
        :class="{ 'opacity-30': isOpen }"
      ></div>
    </button>

    <!-- Smart Slide Menu Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-12 w-80 bg-slate-900/95 dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden z-50 backdrop-blur-xl"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700/70">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <h3 class="text-white font-bold text-lg leading-tight">Menu Pintar</h3>
              <span class="text-xs text-slate-300/80">Akses cepat tema, bahasa & aksi penting</span>
            </div>
            <button
              @click="closeMenu"
              class="flex items-center justify-center p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Tutup Menu"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Menu Content -->
        <div class="p-5 space-y-5 bg-slate-900/95">
          <!-- Search Section -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2 text-slate-100">
              <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="font-semibold text-sm">Pencarian Pintar</span>
            </div>
            <p class="text-xs text-slate-400">Cari artikel populer, layanan favorit, atau topik terbaru. Ketik & pilih dari dropdown super interaktif ✨</p>
            <div class="relative">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari artikel PayPal, Netflix, Skrill, dll..."
                  class="w-full px-4 py-3 pl-10 pr-12 rounded-2xl border border-slate-700 bg-slate-800 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  @focus="openSearchDropdown"
                  @input="handleSearchInput"
                  @keydown.enter.prevent="handleSearch"
                  @keydown.down.prevent="moveHighlightedResult(1)"
                  @keydown.up.prevent="moveHighlightedResult(-1)"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div v-if="isSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
                  <span class="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full inline-block animate-spin"></span>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <button
                  v-for="keyword in trendingSearches"
                  :key="keyword"
                  class="text-[11px] px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 hover:border-indigo-400 hover:text-white transition"
                  @click="applySuggestion(keyword)"
                >
                  {{ keyword }}
                </button>
              </div>

              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div
                  v-if="showSearchDropdown"
                  class="absolute left-0 right-0 mt-3 bg-slate-900/98 border border-slate-700/70 rounded-2xl shadow-2xl z-50 p-4 space-y-4 backdrop-blur-lg"
                >
                  <div v-if="trimmedSearch.length < MIN_SEARCH_LENGTH" class="text-xs text-slate-400 space-y-3">
                    <p>Masukkan minimal {{ MIN_SEARCH_LENGTH }} huruf untuk mulai mencari. Coba pilih kata kunci populer di bawah ini:</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="keyword in trendingSearches"
                        :key="`suggestion-${keyword}`"
                        class="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/40 text-indigo-200 text-[11px] hover:bg-indigo-500/20 transition"
                        @click="applySuggestion(keyword)"
                      >
                        {{ keyword }}
                      </button>
                    </div>
                  </div>

                  <div v-else-if="isSearching" class="flex flex-col items-center justify-center py-6 text-sm text-slate-300">
                    <span class="w-6 h-6 border-2 border-indigo-300 border-t-transparent rounded-full inline-block animate-spin mb-3"></span>
                    Mencari artikel terbaik untukmu...
                  </div>

                  <div v-else-if="searchError" class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-200">
                    {{ searchError }}
                  </div>

                  <div v-else-if="searchResults.length" class="space-y-3">
                    <div
                      v-if="featuredResult"
                      class="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-400/30 transition"
                      :class="{ 'ring-2 ring-indigo-400/50 bg-indigo-600/20 border-indigo-400/40': highlightedResult === 0 }"
                      @mouseenter="highlightedResult = 0"
                    >
                      <p class="text-[11px] uppercase tracking-wide text-indigo-200 mb-1">Rekomendasi utama</p>
                      <p class="text-sm font-semibold text-slate-50 leading-snug mb-2">
                        {{ featuredResult.title }}
                      </p>
                      <div class="flex items-center justify-between text-[11px] text-slate-300 mb-3">
                        <span>{{ formatResultDate(featuredResult.date) }}</span>
                        <span class="flex items-center gap-1 text-indigo-200">
                          <UIcon name="i-lucide-bolt" class="w-3 h-3" />
                          Match tinggi
                        </span>
                      </div>
                      <button
                        class="w-full px-4 py-2 text-sm font-medium rounded-xl bg-indigo-500/80 hover:bg-indigo-500 text-white transition"
                        @click="selectSearchResult(featuredResult)"
                      >
                        Baca Artikel
                      </button>
                    </div>

                    <div class="space-y-2">
                      <button
                        v-for="(result, index) in secondaryResults"
                        :key="result.slug || result.id || `${index}-result`"
                        class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800/70 hover:border-indigo-400/60 hover:bg-slate-800 transition text-left"
                        :class="{ 'border-indigo-400 bg-slate-800/90 shadow-lg shadow-indigo-500/20': highlightedResult === index + 1 }"
                        @mouseenter="highlightedResult = index + 1"
                        @focus="highlightedResult = index + 1"
                        @click="selectSearchResult(result)"
                      >
                        <p class="text-sm font-semibold text-slate-50 leading-snug">
                          <template
                            v-for="(piece, pieceIndex) in getHighlightedParts(result.title)"
                            :key="`${result.slug}-${pieceIndex}`"
                          >
                            <span :class="piece.highlight ? 'text-indigo-300' : ''">
                              {{ piece.text }}
                            </span>
                          </template>
                        </p>
                        <p class="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span class="inline-flex items-center gap-1">
                            <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                            {{ formatResultDate(result.date) }}
                          </span>
                          <span class="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span>{{ result.slug }}</span>
                        </p>
                      </button>
                    </div>

                    <button
                      class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold transition"
                      @click="viewAllResults"
                    >
                      Lihat semua hasil untuk “{{ searchQuery }}”
                    </button>
                  </div>

                  <div v-else class="space-y-3 text-sm text-slate-300">
                    <p>Tidak ada artikel yang cocok. Coba kata kunci lain atau pilih kategori populer:</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="keyword in trendingSearches"
                        :key="`empty-${keyword}`"
                        class="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs hover:border-indigo-400 hover:text-white transition"
                        @click="applySuggestion(keyword)"
                      >
                        {{ keyword }}
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Theme Toggle Section -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2 text-slate-100">
              <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span class="font-semibold text-sm">Tema</span>
            </div>
            <p class="text-xs text-slate-400">Ganti tampilan terang / gelap agar mata lebih nyaman.</p>
            <button
              @click="toggleTheme"
              class="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span class="text-slate-50 font-medium text-sm">
                    {{ isDarkMode ? 'Mode Gelap (Dark Mode)' : 'Mode Terang (Light Mode)' }}
                  </span>
                </div>
              </div>
              <div
                class="relative w-12 h-6 rounded-full border border-slate-500 transition-colors duration-300"
                :class="isDarkMode ? 'bg-black' : 'bg-white'"
              >
                <div
                  class="absolute top-1 w-4 h-4 rounded-full shadow-sm transition-transform duration-300"
                  :class="isDarkMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-black'"
                ></div>
              </div>
            </button>
          </div>

          <!-- Language Selector Section -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2 text-slate-100">
              <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-semibold text-sm">Bahasa</span>
            </div>
            <p class="text-xs text-slate-400">Pilih bahasa utama yang ingin digunakan di situs.</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="selectLanguage('id')"
                class="flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all duration-200"
                :class="currentLanguage === 'id' 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'"
              >
                <span class="inline-flex items-center justify-center text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">ID</span>
                <span class="font-medium">Indonesia</span>
              </button>
              <button
                @click="selectLanguage('en')"
                class="flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all duration-200"
                :class="currentLanguage === 'en' 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'"
              >
                <span class="inline-flex items-center justify-center text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30">US</span>
                <span class="font-medium">Amerika</span>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2 text-slate-100">
              <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="font-semibold text-sm">Aksi Cepat</span>
            </div>
            <p class="text-xs text-slate-400">Beberapa tombol praktis untuk mempercepat aktivitas Anda.</p>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="refreshPage"
                class="flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="text-sm font-medium">Refresh</span>
              </button>
              <button
                @click="scrollToTop"
                class="flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span class="text-sm font-medium">Ke Atas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        @click="closeMenu"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

// Simple state management
const isOpen = ref(false)
const searchQuery = ref('')
const currentLanguage = ref('id')
const isDarkMode = ref(false)
const showSearchDropdown = ref(false)
const isSearching = ref(false)
const searchError = ref('')
const searchResults = ref<any[]>([])
const highlightedResult = ref(-1)
const trendingSearches = ref<string[]>([
  'Jasa PayPal',
  'Top Up Netflix',
  'Bayar Namecheap',
  'Crypto & Bitcoin',
  'Skrill & Neteller'
])

const MIN_SEARCH_LENGTH = 2
const SEARCH_RESULT_LIMIT = 5
let searchDelayTimeout: ReturnType<typeof setTimeout> | null = null
let searchAbortController: AbortController | null = null

const trimmedSearch = computed(() => searchQuery.value.trim())
const featuredResult = computed(() => searchResults.value[0] || null)
const secondaryResults = computed(() => searchResults.value.slice(1))

const router = useRouter()

// Methods
const toggleSmartMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
  resetSearchExperience()
}

const resetSearchExperience = () => {
  showSearchDropdown.value = false
  searchResults.value = []
  highlightedResult.value = -1
  searchError.value = ''
  isSearching.value = false
  if (searchDelayTimeout) {
    clearTimeout(searchDelayTimeout)
    searchDelayTimeout = null
  }
  if (searchAbortController) {
    searchAbortController.abort()
    searchAbortController = null
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // You can add actual theme switching logic here
  console.log('Theme toggled to:', isDarkMode.value ? 'dark' : 'light')
}

const selectLanguage = async (lang) => {
  if (currentLanguage.value === lang) return
  
  try {
    currentLanguage.value = lang
    // You can add actual language switching logic here
    console.log('Language switched to:', lang)
    
    // Close menu after selection
    setTimeout(() => {
      closeMenu()
    }, 300)
  } catch (error) {
    console.error('Error switching language:', error)
  }
}

const openSearchDropdown = () => {
  showSearchDropdown.value = true
}

const handleSearchInput = () => {
  if (!showSearchDropdown.value) {
    showSearchDropdown.value = true
  }
}

const performSmartSearch = async (query: string) => {
  if (!query || query.length < MIN_SEARCH_LENGTH) return

  if (searchAbortController) {
    searchAbortController.abort()
  }

  searchAbortController = new AbortController()
  isSearching.value = true
  searchError.value = ''

  try {
    const response = await $fetch<{ posts?: any[] }>('/api/blog/search', {
      params: { q: query, page: 1 },
      signal: searchAbortController.signal
    })
    searchResults.value = (response?.posts || []).slice(0, SEARCH_RESULT_LIMIT)
    showSearchDropdown.value = true
  } catch (error: any) {
    if (error?.name === 'AbortError') return
    console.error('Smart menu search error:', error)
    searchError.value = 'Pencarian sedang sibuk. Coba lagi sebentar lagi.'
  } finally {
    isSearching.value = false
  }
}

watch(trimmedSearch, (value) => {
  highlightedResult.value = -1
  searchError.value = ''

  if (searchDelayTimeout) {
    clearTimeout(searchDelayTimeout)
    searchDelayTimeout = null
  }

  if (!value || value.length < MIN_SEARCH_LENGTH) {
    if (searchAbortController) {
      searchAbortController.abort()
      searchAbortController = null
    }
    searchResults.value = []
    isSearching.value = false
    return
  }

  searchDelayTimeout = setTimeout(() => {
    performSmartSearch(value)
  }, 250)
})

const moveHighlightedResult = (direction: number) => {
  if (!searchResults.value.length) return
  showSearchDropdown.value = true

  if (highlightedResult.value === -1) {
    highlightedResult.value = direction > 0 ? 0 : searchResults.value.length - 1
    return
  }

  highlightedResult.value =
    (highlightedResult.value + direction + searchResults.value.length) %
    searchResults.value.length
}

const formatSlug = (result: any) => {
  if (result?.slug) return result.slug
  if (result?.title) {
    return result.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  return ''
}

const selectSearchResult = (result: any) => {
  const slug = formatSlug(result)
  if (!slug) return
  router.push(`/blog/${slug}`)
  closeMenu()
}

const viewAllResults = () => {
  if (!trimmedSearch.value) return
  router.push({ path: '/blog', query: { q: trimmedSearch.value } })
  closeMenu()
}

const applySuggestion = (keyword: string) => {
  searchQuery.value = keyword
  showSearchDropdown.value = true
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getHighlightedParts = (text = '') => {
  const query = trimmedSearch.value
  if (!query) return [{ text, highlight: false }]

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig')
  return text
    .split(regex)
    .filter(Boolean)
    .map((segment) => ({
      text: segment,
      highlight: segment.toLowerCase() === query.toLowerCase()
    }))
}

const formatResultDate = (value?: string) => {
  if (!value) return 'Baru diposting'
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(value))
  } catch {
    return 'Baru diposting'
  }
}

const handleSearch = () => {
  if (!trimmedSearch.value) return

  if (highlightedResult.value >= 0 && searchResults.value[highlightedResult.value]) {
    selectSearchResult(searchResults.value[highlightedResult.value])
    return
  }

  if (featuredResult.value) {
    selectSearchResult(featuredResult.value)
    return
  }

  viewAllResults()
}

const refreshPage = () => {
  window.location.reload()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  closeMenu()
}

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeMenu()
  }
}

watch(isOpen, (value) => {
  if (!value) {
    resetSearchExperience()
  }
})

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  resetSearchExperience()
})
</script>

<style scoped>
/* Custom animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>