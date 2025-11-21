<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useImagePopup } from '~/composables/useImagePopup'

// Image popup functionality
const { openPopup } = useImagePopup()

// Handle image click
const handleImageClick = (imageSrc: string, title: string = '') => {
  openPopup(imageSrc, title, 'News Image', `Image from article: ${title}`)
}
interface BlogApiPost {
  title: string
  slug: string
  image?: string
  date?: string
  author?: string
  category?: string
  excerpt?: string
  readTime?: number
  tags?: string[]
  viewCount?: number
  isNew?: boolean
  isFeatured?: boolean
  isTrending?: boolean
}
interface BlogPostsResponse {
  posts: Array<BlogApiPost>
  totalPages: number
  currentPage: number
}

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedTags = ref<string[]>([])
const sortBy = ref<'newest' | 'oldest' | 'az' | 'za' | 'popular' | 'readtime'>('newest')
const viewMode = ref<'grid' | 'list' | 'compact'>('grid')
const itemsPerPage = 8
const currentPage = ref(1)
const showAdvancedSearch = ref(false)

const categories = ['all', 'PayPal', 'Tutorial', 'Tips', 'Panduan']
const allTags = ['#PayPal', '#Aman', '#Tutorial', '#Bisnis', '#Verifikasi', '#Digital', '#Tips', '#Pemula']

// Advanced search filters
const dateRangeFrom = ref('')
const dateRangeTo = ref('')
const selectedAuthor = ref('all')
const readTimeFilter = ref('all')

// PRO Features State
const readingHistory = ref<string[]>([])
const recentlyViewed = ref<string[]>([])
const articleReactions = ref<Record<string, { like: number, love: number, useful: number, userReaction?: string }>>({})
const readingProgress = ref<Record<string, number>>({})
const showQuickPreview = ref<string | null>(null)
const searchSuggestions = ref<string[]>([])
const showSearchSuggestions = ref(false)
const customization = ref({
  fontSize: 'medium' as 'small' | 'medium' | 'large',
  cardDensity: 'comfortable' as 'compact' | 'comfortable' | 'spacious',
  animationSpeed: 'normal' as 'slow' | 'normal' | 'fast' | 'off',
  showReadBadge: true,
  enableKeyboardShortcuts: true
})
const showCustomizationPanel = ref(false)
const showNewsletterSignup = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('success')
const filterPresets = ref({
  myFavorites: false,
  unread: false,
  bookmarked: false
})
const showKeyboardHelp = ref(false)
const focusedCardIndex = ref(-1)
const recommendations = ref<BlogApiPost[]>([])
const ttsEnabled = ref(false)
const ttsCurrentArticle = ref<string | null>(null)
const ttsPlaying = ref(false)
const ttsSpeed = ref(1.0)

// Mobile & WhatsApp Features
const isMobile = ref(false)
const showWhatsAppChat = ref(false)
const whatsappNumber = '+6281234567890' // Ganti dengan nomor WhatsApp bisnis Anda
const whatsappMessage = 'Halo! Saya tertarik dengan layanan Jasa Pembayaran. Bisa dibantu?'
const touchStartX = ref(0)
const touchEndX = ref(0)
const showMobileMenu = ref(false)
const scrollY = ref(0)
const showScrollTop = ref(false)

const FALLBACK_IMAGE = '/images/fallback-news.svg'

function stripHtml(t: string) {
  return (t || '').replace(/<[^>]*>/g, '').trim()
}

// Deterministic AI image fallback (same style used elsewhere)
function buildAiHeroUrl(titleText?: string, slugText?: string) {
  const cleanTitle = stripHtml(titleText || '')
  const basePrompt = cleanTitle
    ? `${cleanTitle}, modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
    : `modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
  const encoded = encodeURIComponent(basePrompt)
  const seed = encodeURIComponent(String(slugText || cleanTitle || 'blog'))
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=800&height=450&nologo=true&enhance=true`
}

function isValidImageUrl(url?: string) {
  if (!url || typeof url !== 'string') return false
  try {
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
    // allow http, https, and data image URLs
    const isHttp = u.protocol === 'http:' || u.protocol === 'https:'
    const isDataImg = url.startsWith('data:image')
    return isHttp || isDataImg
  } catch {
    return false
  }
}

function normalizeImageUrlClient(img?: string): string {
  const s = String(img || '').trim()
  if (!s) return ''
  if (s.startsWith('data:image')) return s
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) {
    if (s.startsWith('/wp-content/')) return `https://blog.jasapembayaran.com${s}`
    return s
  }
  return ''
}

function getSafeImage(candidate?: string, titleText?: string, slugText?: string) {
  const feat = normalizeImageUrlClient(candidate)
  if (isValidImageUrl(feat) && !String(feat || '').includes('fallback-news.svg')) return String(feat)
  try {
    const ai = buildAiHeroUrl(titleText, slugText)
    if (isValidImageUrl(ai)) return ai
  } catch {}
  return FALLBACK_IMAGE
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (!img) return
  if (img.src.endsWith('fallback-news.svg')) return
  img.onerror = null
  img.src = FALLBACK_IMAGE
}

// Fetch latest WordPress posts for 'Berita Kami' (8 per page from API)
const { data: latestNewsResponse, pending: isLoadingNews, error: newsError } = await useFetch<BlogPostsResponse>('/api/blog', {
  lazy: true,
  // Enable SSR for faster first paint; still safe on client
  key: 'berita-kami-latest-news',
  params: { page: 1, limit: 8 },
  timeout: 5000,
  retry: 1,
  retryDelay: 1000,
  // Auto-refresh every 5 minutes
  refreshInterval: 300000,
  // Don't retry on 4xx errors
  retryOn: [500, 502, 503, 504]
})

// Fallback data (8 items) with AI image thumbnails and complete metadata
const fallbackLatestBlogs: BlogApiPost[] = [
  { 
    title: 'Jasa Pembayaran PayPal Terpercaya di Indonesia', 
    slug: 'jasa-pembayaran-paypal-terpercaya',
    date: '2025-10-15',
    author: 'Admin Jasa Pembayaran',
    category: 'PayPal',
    excerpt: 'Temukan jasa pembayaran PayPal terpercaya dengan layanan profesional dan aman. Layanan 24/7 dengan response time cepat dan dukungan pelanggan yang responsif.',
    readTime: 5,
    tags: ['#PayPal', '#Aman', '#Tutorial'],
    viewCount: 2847,
    isNew: true,
    isFeatured: true,
    isTrending: true
  },
  { 
    title: 'Cara Aman Bertransaksi Online dengan PayPal', 
    slug: 'cara-aman-bertransaksi-online-dengan-paypal',
    date: '2025-10-14',
    author: 'Tim Security',
    category: 'Tutorial',
    excerpt: 'Pelajari tips dan trik bertransaksi online dengan PayPal secara aman. Lindungi akun Anda dari penipuan dan fraud dengan panduan lengkap dari ahli keamanan.',
    readTime: 7,
    tags: ['#PayPal', '#Aman', '#Tips'],
    viewCount: 1923,
    isNew: true,
    isFeatured: false,
    isTrending: true
  },
  { 
    title: 'Keuntungan Menggunakan Jasa Pembayaran untuk Bisnis Online', 
    slug: 'keuntungan-menggunakan-jasa-pembayaran-untuk-bisnis-online',
    date: '2025-10-13',
    author: 'Business Team',
    category: 'Tips',
    excerpt: 'Maksimalkan bisnis online Anda dengan jasa pembayaran profesional. Tingkatkan konversi dan kepercayaan pelanggan dengan sistem pembayaran yang aman.',
    readTime: 6,
    tags: ['#Bisnis', '#Tips', '#Digital'],
    viewCount: 1654,
    isNew: false,
    isFeatured: true,
    isTrending: false
  },
  { 
    title: 'Tips Memilih Jasa Pembayaran Online yang Aman', 
    slug: 'tips-memilih-jasa-pembayaran-online-yang-aman',
    date: '2025-10-12',
    author: 'Expert Team',
    category: 'Tips',
    excerpt: 'Panduan memilih jasa pembayaran online terpercaya dan aman. Ketahui kriteria penting yang harus diperhatikan sebelum memilih penyedia jasa pembayaran.',
    readTime: 5,
    tags: ['#Tips', '#Aman', '#Tutorial'],
    viewCount: 1432,
    isNew: false,
    isFeatured: false,
    isTrending: true
  },
  { 
    title: 'Panduan Lengkap Menggunakan Jasa Pembayaran untuk Pemula', 
    slug: 'panduan-lengkap-menggunakan-jasa-pembayaran-untuk-pemula',
    date: '2025-10-11',
    author: 'Support Team',
    category: 'Panduan',
    excerpt: 'Tutorial lengkap untuk pemula dalam menggunakan jasa pembayaran. Mulai dari registrasi hingga transaksi pertama Anda dengan langkah-langkah mudah.',
    readTime: 8,
    tags: ['#Tutorial', '#Pemula', '#PayPal'],
    viewCount: 987,
    isNew: false,
    isFeatured: false,
    isTrending: false
  },
  { 
    title: 'Cara Mengatasi Limit PayPal dengan Aman', 
    slug: 'cara-mengatasi-limit-paypal',
    date: '2025-10-10',
    author: 'PayPal Expert',
    category: 'PayPal',
    excerpt: 'Solusi mengatasi limit PayPal dengan metode yang aman dan terpercaya. Panduan step-by-step untuk mengatasi berbagai jenis limit pada akun PayPal Anda.',
    readTime: 6,
    tags: ['#PayPal', '#Tutorial', '#Tips'],
    viewCount: 2156,
    isNew: false,
    isFeatured: true,
    isTrending: true
  },
  { 
    title: 'Panduan Verifikasi Akun PayPal Terbaru', 
    slug: 'panduan-verifikasi-akun-paypal-terbaru',
    date: '2025-10-09',
    author: 'Verification Team',
    category: 'Panduan',
    excerpt: 'Langkah-langkah terbaru untuk verifikasi akun PayPal Anda. Update metode verifikasi 2025 dengan proses yang lebih mudah dan cepat.',
    readTime: 7,
    tags: ['#PayPal', '#Verifikasi', '#Tutorial'],
    viewCount: 1789,
    isNew: false,
    isFeatured: false,
    isTrending: false
  },
  { 
    title: 'Tips Transaksi Digital Aman dan Cepat', 
    slug: 'tips-transaksi-digital-aman-cepat',
    date: '2025-10-08',
    author: 'Digital Team',
    category: 'Tips',
    excerpt: 'Tips praktis untuk transaksi digital yang aman dan efisien. Optimalkan pengalaman bertransaksi online Anda dengan tips dari para ahli.',
    readTime: 5,
    tags: ['#Digital', '#Aman', '#Tips'],
    viewCount: 1321,
    isNew: false,
    isFeatured: false,
    isTrending: false
  },
].map(p => ({ ...p, image: buildAiHeroUrl(p.title, p.slug) }))

const computedLatestNews = computed(() => {
  // If there's an error or no response, use fallback immediately
  if (newsError.value || !latestNewsResponse.value) {
    return fallbackLatestBlogs
  }

  const wpPosts = (latestNewsResponse.value?.posts || []).map((p: any) => ({
    title: stripHtml(p?.title || ''),
    slug: p?.slug || '',
    image: getSafeImage(p?.image, p?.title, p?.slug),
    date: p?.date || new Date().toISOString().split('T')[0],
    author: p?.author || 'Admin',
    category: p?.category || 'Tips',
    excerpt: stripHtml(p?.excerpt || ''),
    readTime: p?.readTime || 5,
    tags: p?.tags || ['#Tips'],
    viewCount: p?.viewCount || 100,
    isNew: p?.isNew || false,
    isFeatured: p?.isFeatured || false,
    isTrending: p?.isTrending || false
  }))

  if (wpPosts.length > 0) {
    return wpPosts
  }
  return fallbackLatestBlogs
})

// Filtered and sorted news
const filteredAndSortedNews = computed(() => {
  let filtered = [...computedLatestNews.value]

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(post => 
      post.category?.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  // Filter by tags
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(post =>
      selectedTags.value.some((tag: string) => post.tags?.includes(tag))
    )
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.category?.toLowerCase().includes(query) ||
      post.author?.toLowerCase().includes(query) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    )
  }

  // Advanced filters
  if (dateRangeFrom.value) {
    filtered = filtered.filter(post => (post.date || '') >= dateRangeFrom.value)
  }
  if (dateRangeTo.value) {
    filtered = filtered.filter(post => (post.date || '') <= dateRangeTo.value)
  }
  if (selectedAuthor.value !== 'all') {
    filtered = filtered.filter(post => post.author === selectedAuthor.value)
  }
  if (readTimeFilter.value !== 'all') {
    const timeRange = readTimeFilter.value
    if (timeRange === 'quick') {
      filtered = filtered.filter(post => (post.readTime || 0) <= 5)
    } else if (timeRange === 'medium') {
      filtered = filtered.filter(post => (post.readTime || 0) > 5 && (post.readTime || 0) <= 10)
    } else if (timeRange === 'long') {
      filtered = filtered.filter(post => (post.readTime || 0) > 10)
    }
  }

  // Sort
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  } else if (sortBy.value === 'az') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'za') {
    filtered.sort((a, b) => b.title.localeCompare(a.title))
  } else if (sortBy.value === 'popular') {
    filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
  } else if (sortBy.value === 'readtime') {
    filtered.sort((a, b) => (a.readTime || 0) - (b.readTime || 0))
  }

  return filtered
})

// Paginated news
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedNews.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedNews.value.length / itemsPerPage)
})

// Get unique authors for filter
const availableAuthors = computed(() => {
  const authors = new Set(computedLatestNews.value.map((p: BlogApiPost) => p.author).filter(Boolean))
  return ['all', ...Array.from(authors)]
})

// Format date to Indonesian format
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Format view count
function formatViewCount(count: number = 0): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Share functions
function shareToWhatsApp(post: BlogApiPost) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`
  const text = `${post.title} - ${url}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

function shareToTwitter(post: BlogApiPost) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`
  const text = post.title
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
}

function shareToFacebook(post: BlogApiPost) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

function copyLink(post: BlogApiPost) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link berhasil disalin!')
    }).catch(() => {
      alert('Gagal menyalin link')
    })
  }
}

// Bookmark functions
const bookmarkedPosts = ref<string[]>([])
function toggleBookmark(slug: string) {
  const index = bookmarkedPosts.value.indexOf(slug)
  if (index > -1) {
    bookmarkedPosts.value.splice(index, 1)
  } else {
    bookmarkedPosts.value.push(slug)
  }
  // Save to localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('bookmarked-posts', JSON.stringify(bookmarkedPosts.value))
  }
}

function isBookmarked(slug: string): boolean {
  return bookmarkedPosts.value.includes(slug)
}

// Reset filters
function resetAllFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedTags.value = []
  dateRangeFrom.value = ''
  dateRangeTo.value = ''
  selectedAuthor.value = 'all'
  readTimeFilter.value = 'all'
  currentPage.value = 1
}

// Toggle tag filter
function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// Load more
function loadMore() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Watch for filter changes and reset page
watch([searchQuery, selectedCategory, selectedTags, sortBy, dateRangeFrom, dateRangeTo, selectedAuthor, readTimeFilter], () => {
  currentPage.value = 1
})

// ========== PRO FEATURES FUNCTIONS ==========

// Toast Notification System
function showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Reading History Management
function markAsRead(slug: string) {
  if (!readingHistory.value.includes(slug)) {
    readingHistory.value.push(slug)
    if (readingHistory.value.length > 50) {
      readingHistory.value.shift() // Keep only last 50
    }
    saveToLocalStorage('reading-history', readingHistory.value)
  }
}

function isRead(slug: string): boolean {
  return readingHistory.value.includes(slug)
}

// Recently Viewed Management
function addToRecentlyViewed(slug: string) {
  const index = recentlyViewed.value.indexOf(slug)
  if (index > -1) {
    recentlyViewed.value.splice(index, 1)
  }
  recentlyViewed.value.unshift(slug)
  if (recentlyViewed.value.length > 10) {
    recentlyViewed.value.pop()
  }
  saveToLocalStorage('recently-viewed', recentlyViewed.value)
}

// Reaction System
function toggleReaction(slug: string, reaction: 'like' | 'love' | 'useful') {
  if (!articleReactions.value[slug]) {
    articleReactions.value[slug] = { like: 0, love: 0, useful: 0 }
  }
  
  const current = articleReactions.value[slug]
  if (current.userReaction === reaction) {
    // Remove reaction
    current[reaction]--
    current.userReaction = undefined
    showToastNotification('Reaksi dihapus', 'info')
  } else {
    // Remove old reaction if exists
    if (current.userReaction) {
      current[current.userReaction]--
    }
    // Add new reaction
    current[reaction]++
    current.userReaction = reaction
    const emoji = reaction === 'like' ? '👍' : reaction === 'love' ? '❤️' : '⭐'
    showToastNotification(`${emoji} Reaksi ditambahkan!`, 'success')
  }
  
  saveToLocalStorage('article-reactions', articleReactions.value)
}

function getReactionCount(slug: string, reaction: 'like' | 'love' | 'useful'): number {
  return articleReactions.value[slug]?.[reaction] || 0
}

function getUserReaction(slug: string): string | undefined {
  return articleReactions.value[slug]?.userReaction
}

// Reading Progress
function updateReadingProgress(slug: string, progress: number) {
  readingProgress.value[slug] = progress
  saveToLocalStorage('reading-progress', readingProgress.value)
}

function getReadingProgress(slug: string): number {
  return readingProgress.value[slug] || 0
}

// Filter Presets
function applyPreset(preset: 'myFavorites' | 'unread' | 'bookmarked') {
  resetAllFilters()
  filterPresets.value[preset] = true
  
  if (preset === 'bookmarked') {
    // Show only bookmarked
    showToastNotification('📚 Menampilkan artikel tersimpan', 'info')
  } else if (preset === 'unread') {
    // Show only unread
    showToastNotification('📖 Menampilkan artikel belum dibaca', 'info')
  } else if (preset === 'myFavorites') {
    // Show favorites (most reacted)
    sortBy.value = 'popular'
    showToastNotification('⭐ Menampilkan artikel favorit', 'info')
  }
}

// Save/Load Preferences
function saveFilterPreferences() {
  const prefs = {
    sortBy: sortBy.value,
    viewMode: viewMode.value,
    selectedCategory: selectedCategory.value,
    customization: customization.value
  }
  saveToLocalStorage('filter-preferences', prefs)
  showToastNotification('✅ Preferensi tersimpan', 'success')
}

function loadFilterPreferences() {
  const prefs = loadFromLocalStorage('filter-preferences')
  if (prefs) {
    sortBy.value = prefs.sortBy || 'newest'
    viewMode.value = prefs.viewMode || 'grid'
    selectedCategory.value = prefs.selectedCategory || 'all'
    if (prefs.customization) {
      customization.value = prefs.customization
    }
  }
}

// Search Suggestions
function generateSearchSuggestions(query: string) {
  if (!query || query.length < 2) {
    searchSuggestions.value = []
    showSearchSuggestions.value = false
    return
  }
  
  const allTerms = new Set<string>()
  computedLatestNews.value.forEach((post: BlogApiPost) => {
    post.title.toLowerCase().split(' ').forEach(word => {
      if (word.length > 3 && word.toLowerCase().includes(query.toLowerCase())) {
        allTerms.add(post.title)
      }
    })
    post.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        allTerms.add(tag)
      }
    })
  })
  
  searchSuggestions.value = Array.from(allTerms).slice(0, 5)
  showSearchSuggestions.value = searchSuggestions.value.length > 0
}

function applySuggestion(suggestion: string) {
  searchQuery.value = suggestion
  showSearchSuggestions.value = false
}

// Smart Recommendations
function generateRecommendations(currentSlug?: string) {
  if (!currentSlug) {
    // Based on reading history
    const viewedCategories = new Set<string>()
    const viewedTags = new Set<string>()
    
    recentlyViewed.value.forEach((slug: string) => {
      const post = computedLatestNews.value.find((p: BlogApiPost) => p.slug === slug)
      if (post) {
        if (post.category) viewedCategories.add(post.category)
        post.tags?.forEach((tag: string) => viewedTags.add(tag))
      }
    })
    
    recommendations.value = computedLatestNews.value
      .filter((post: BlogApiPost) => 
        !recentlyViewed.value.includes(post.slug) &&
        (viewedCategories.has(post.category || '') || 
         post.tags?.some(tag => viewedTags.has(tag)))
      )
      .slice(0, 4)
  }
}

// Keyboard Shortcuts
function handleKeyboardShortcut(event: KeyboardEvent) {
  if (!customization.value.enableKeyboardShortcuts) return
  
  // Ctrl/Cmd + K: Quick Search
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
    searchInput?.focus()
    showToastNotification('⌨️ Quick Search', 'info')
  }
  
  // ESC: Close modals
  if (event.key === 'Escape') {
    showAdvancedSearch.value = false
    showCustomizationPanel.value = false
    showKeyboardHelp.value = false
    showSearchSuggestions.value = false
  }
  
  // Arrow Keys: Navigate cards
  if (event.key === 'ArrowRight') {
    focusedCardIndex.value = Math.min(focusedCardIndex.value + 1, paginatedNews.value.length - 1)
  }
  if (event.key === 'ArrowLeft') {
    focusedCardIndex.value = Math.max(focusedCardIndex.value - 1, 0)
  }
  
  // Enter: Open focused card
  if (event.key === 'Enter' && focusedCardIndex.value >= 0) {
    const post = paginatedNews.value[focusedCardIndex.value]
    if (post) {
      window.location.href = `/blog/${post.slug}`
    }
  }
  
  // B: Bookmark focused card
  if (event.key === 'b' && focusedCardIndex.value >= 0) {
    const post = paginatedNews.value[focusedCardIndex.value]
    if (post) {
      toggleBookmark(post.slug)
    }
  }
  
  // S: Share focused card
  if (event.key === 's' && focusedCardIndex.value >= 0) {
    const post = paginatedNews.value[focusedCardIndex.value]
    if (post) {
      copyLink(post)
    }
  }
  
  // ?: Show keyboard help
  if (event.key === '?' && event.shiftKey) {
    showKeyboardHelp.value = !showKeyboardHelp.value
  }
}

// Text-to-Speech
function toggleTTS(slug: string, title: string) {
  if (ttsCurrentArticle.value === slug && ttsPlaying.value) {
    // Stop TTS
    speechSynthesis.cancel()
    ttsPlaying.value = false
    showToastNotification('🔇 Audio dihentikan', 'info')
  } else {
    // Start TTS
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(title)
    utterance.rate = ttsSpeed.value
    utterance.lang = 'id-ID'
    utterance.onend = () => {
      ttsPlaying.value = false
    }
    speechSynthesis.speak(utterance)
    ttsCurrentArticle.value = slug
    ttsPlaying.value = true
    showToastNotification('🔊 Audio diputar', 'success')
  }
}

// Export/Import
function exportBookmarks() {
  const data = {
    bookmarks: bookmarkedPosts.value,
    readingHistory: readingHistory.value,
    preferences: customization.value,
    reactions: articleReactions.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `berita-kami-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToastNotification('📥 Data berhasil diexport', 'success')
}

function importBookmarks(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.bookmarks) bookmarkedPosts.value = data.bookmarks
      if (data.readingHistory) readingHistory.value = data.readingHistory
      if (data.preferences) customization.value = data.preferences
      if (data.reactions) articleReactions.value = data.reactions
      
      // Save to localStorage
      saveToLocalStorage('bookmarked-posts', bookmarkedPosts.value)
      saveToLocalStorage('reading-history', readingHistory.value)
      saveToLocalStorage('filter-preferences', { customization: customization.value })
      saveToLocalStorage('article-reactions', articleReactions.value)
      
      showToastNotification('✅ Data berhasil diimport', 'success')
    } catch (error) {
      showToastNotification('❌ Gagal import data', 'error')
    }
  }
  reader.readAsText(file)
}

// LocalStorage helpers
function saveToLocalStorage(key: string, value: any) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

function loadFromLocalStorage(key: string): any {
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
  return null
}

// Filter by preset
const filteredByPreset = computed(() => {
  let filtered = filteredAndSortedNews.value
  
  if (filterPresets.value.bookmarked) {
    filtered = filtered.filter((post: BlogApiPost) => isBookmarked(post.slug))
  }
  
  if (filterPresets.value.unread) {
    filtered = filtered.filter((post: BlogApiPost) => !isRead(post.slug))
  }
  
  if (filterPresets.value.myFavorites) {
    filtered = filtered.filter((post: BlogApiPost) => 
      (articleReactions.value[post.slug]?.like || 0) > 0 ||
      (articleReactions.value[post.slug]?.love || 0) > 0 ||
      (articleReactions.value[post.slug]?.useful || 0) > 0
    )
  }
  
  return filtered
})

// Update paginated news to use preset filtered
const paginatedNewsWithPresets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredByPreset.value.slice(start, end)
})

// Watch search query for suggestions
watch(searchQuery, (newQuery: string) => {
  generateSearchSuggestions(newQuery)
})

// ========== MOBILE & WHATSAPP FEATURES ==========

// WhatsApp Contact
function openWhatsApp() {
  const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
  window.open(url, '_blank')
  showToastNotification('📱 Membuka WhatsApp...', 'success')
}

function toggleWhatsAppChat() {
  showWhatsAppChat.value = !showWhatsAppChat.value
}

// Touch Gestures
function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0].screenX
}

function handleTouchEnd(event: TouchEvent) {
  touchEndX.value = event.changedTouches[0].screenX
  handleSwipe()
}

function handleSwipe() {
  const swipeThreshold = 100
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next page
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        showToastNotification('➡️ Halaman berikutnya', 'info')
      }
    } else {
      // Swipe right - previous page
      if (currentPage.value > 1) {
        currentPage.value--
        showToastNotification('⬅️ Halaman sebelumnya', 'info')
      }
    }
  }
}

// Scroll Tracking
function handleScroll() {
  scrollY.value = window.scrollY
  showScrollTop.value = scrollY.value > 500
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  showToastNotification('⬆️ Kembali ke atas', 'info')
}

// Detect Mobile
function detectMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

// Pull to Refresh (untuk mobile)
let pullStartY = 0
let isPulling = false

function handlePullStart(event: TouchEvent) {
  if (window.scrollY === 0) {
    pullStartY = event.touches[0].clientY
    isPulling = true
  }
}

function handlePullMove(event: TouchEvent) {
  if (isPulling && window.scrollY === 0) {
    const pullDistance = event.touches[0].clientY - pullStartY
    if (pullDistance > 100) {
      // Trigger refresh
      showToastNotification('🔄 Memuat ulang...', 'info')
      setTimeout(() => {
        window.location.reload()
      }, 500)
      isPulling = false
    }
  }
}

function handlePullEnd() {
  isPulling = false
}

// Track image load state to show skeletons until images are ready
const loadedMap = ref<Record<string, boolean>>({})
function keyFor(post: any, idx: number) { return String(post?.slug || post?.title || idx) }
function onImgLoad(_e: Event, key: string) { loadedMap.value[key] = true }

// Force show content after maximum loading time to prevent infinite loading
const forceShowContent = ref(false)
onMounted(() => {
  // Force show content after 10 seconds to prevent infinite loading
  setTimeout(() => {
    forceShowContent.value = true
  }, 10000)
  
  // Load all data from localStorage
  if (typeof localStorage !== 'undefined') {
    // Bookmarks
    const savedBookmarks = localStorage.getItem('bookmarked-posts')
    if (savedBookmarks) {
      try {
        bookmarkedPosts.value = JSON.parse(savedBookmarks)
      } catch (e) {
        console.error('Failed to parse bookmarks', e)
      }
    }
    
    // Reading History
    const savedHistory = loadFromLocalStorage('reading-history')
    if (savedHistory) readingHistory.value = savedHistory
    
    // Recently Viewed
    const savedRecent = loadFromLocalStorage('recently-viewed')
    if (savedRecent) recentlyViewed.value = savedRecent
    
    // Reactions
    const savedReactions = loadFromLocalStorage('article-reactions')
    if (savedReactions) articleReactions.value = savedReactions
    
    // Reading Progress
    const savedProgress = loadFromLocalStorage('reading-progress')
    if (savedProgress) readingProgress.value = savedProgress
    
    // Load filter preferences
    loadFilterPreferences()
  }
  
  // Setup keyboard shortcuts
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyboardShortcut)
    
    // Mobile features
    detectMobile()
    window.addEventListener('resize', detectMobile)
    window.addEventListener('scroll', handleScroll)
    
    // Touch gestures
    const section = document.querySelector('.berita-theme')
    if (section) {
      section.addEventListener('touchstart', handleTouchStart as EventListener)
      section.addEventListener('touchend', handleTouchEnd as EventListener)
      section.addEventListener('touchstart', handlePullStart as EventListener)
      section.addEventListener('touchmove', handlePullMove as EventListener)
      section.addEventListener('touchend', handlePullEnd)
    }
  }
  
  // Generate recommendations
  generateRecommendations()
  
  // Show welcome toast on first visit
  const hasVisited = loadFromLocalStorage('has-visited-berita')
  if (!hasVisited) {
    setTimeout(() => {
      const msg = isMobile.value 
        ? '👋 Selamat datang! Swipe untuk navigasi halaman' 
        : '👋 Selamat datang! Tekan ? untuk melihat keyboard shortcuts'
      showToastNotification(msg, 'info')
      saveToLocalStorage('has-visited-berita', true)
    }, 1000)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyboardShortcut)
    window.removeEventListener('resize', detectMobile)
    window.removeEventListener('scroll', handleScroll)
  }
  // Stop TTS if playing
  if (ttsPlaying.value) {
    speechSynthesis.cancel()
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-2 lg:px-0 berita-theme relative">
    <!-- Toast Notification -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showToast"
        :class="[
          'fixed top-4 right-4 z-[9999] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border-2 flex items-center gap-3 animate-bounce-once',
          toastType === 'success' ? 'bg-green-500/90 border-green-400 text-white' : '',
          toastType === 'error' ? 'bg-red-500/90 border-red-400 text-white' : '',
          toastType === 'info' ? 'bg-blue-500/90 border-blue-400 text-white' : ''
        ]"
      >
        <UIcon
          :name="toastType === 'success' ? 'i-lucide-check-circle' : toastType === 'error' ? 'i-lucide-x-circle' : 'i-lucide-info'"
          class="w-6 h-6"
        />
        <span class="font-bold">{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Floating Action Buttons - Desktop -->
    <div class="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col gap-3">
      <!-- Customization Button -->
      <button
        @click="showCustomizationPanel = !showCustomizationPanel"
        class="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Customization"
      >
        <UIcon name="i-lucide-settings" class="w-6 h-6" />
      </button>
      
      <!-- Keyboard Help Button -->
      <button
        @click="showKeyboardHelp = !showKeyboardHelp"
        class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Keyboard Shortcuts (?)"
      >
        <UIcon name="i-lucide-keyboard" class="w-6 h-6" />
      </button>
      
      <!-- Export Data Button -->
      <button
        @click="exportBookmarks"
        class="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Export Data"
      >
        <UIcon name="i-lucide-download" class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Floating Buttons - DISABLED to prevent double icons -->
    <!-- <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 lg:hidden">
      <button
        @click="openWhatsApp"
        class="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse-slow"
        title="Chat WhatsApp"
      >
        <UIcon name="i-lucide-message-circle" class="w-7 h-7" />
      </button>
      
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-0"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-0"
      >
        <button
          v-if="showScrollTop"
          @click="scrollToTop"
          class="w-14 h-14 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-2xl hover:shadow-gray-700/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Kembali ke Atas"
        >
          <UIcon name="i-lucide-arrow-up" class="w-6 h-6" />
        </button>
      </transition>
      
      <button
        @click="showMobileMenu = !showMobileMenu"
        class="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Menu"
      >
        <UIcon :name="showMobileMenu ? 'i-lucide-x' : 'i-lucide-menu'" class="w-6 h-6" />
      </button>
    </div> -->

    <!-- WhatsApp Floating Button - Desktop - DISABLED to prevent double icons -->
    <!-- <div class="hidden lg:block fixed bottom-6 left-6 z-50">
      <div class="relative">
        <button
          @click="openWhatsApp"
          class="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-pulse-slow"
          title="Chat via WhatsApp"
        >
          <UIcon name="i-lucide-message-circle" class="w-7 h-7" />
        </button>
        
        <div class="absolute left-20 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <p class="text-sm font-bold text-gray-900 dark:text-white">💬 Chat WhatsApp</p>
          <p class="text-xs text-gray-600 dark:text-gray-400">Hubungi kami sekarang!</p>
        </div>
      </div>
    </div> -->

    <!-- Mobile Quick Actions Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <div v-if="showMobileMenu" class="lg:hidden fixed bottom-24 right-4 z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 space-y-3 border-2 border-emerald-300/50 dark:border-emerald-600/50">
        <button
          @click="showCustomizationPanel = true; showMobileMenu = false"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
        >
          <UIcon name="i-lucide-settings" class="w-5 h-5" />
          Customization
        </button>
        <button
          @click="exportBookmarks(); showMobileMenu = false"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
        >
          <UIcon name="i-lucide-download" class="w-5 h-5" />
          Export Data
        </button>
        <label class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer">
          <UIcon name="i-lucide-upload" class="w-5 h-5" />
          Import Data
          <input type="file" accept=".json" @change="importBookmarks($event); showMobileMenu = false" class="hidden" />
        </label>
        <button
          @click="saveFilterPreferences(); showMobileMenu = false"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
        >
          <UIcon name="i-lucide-save" class="w-5 h-5" />
          Save Preferences
        </button>
      </div>
    </transition>

    <section
      aria-label="Berita Kami"
      class="bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 rounded-3xl shadow-2xl overflow-hidden border-3 border-emerald-400/50 dark:border-emerald-300/50 hover:shadow-3xl hover:border-emerald-300/70 dark:hover:border-emerald-200/70 transition-all duration-500 group relative"
    >
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>
      <!-- Header dengan gradient dan garis -->
      <header class="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-6 z-10">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/90 via-teal-500/90 to-cyan-500/90"></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-60 animate-pulse"></div>
              <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm relative z-10">
                <UIcon name="i-lucide-newspaper" class="w-7 h-7 text-white drop-shadow-lg" />
              </div>
            </div>
            <h2 class="text-3xl font-black text-white drop-shadow-2xl tracking-wide">
              <span class="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">🌟 BERITA KAMI 🌟</span>
              <span v-if="isLoadingNews" class="ml-3 text-lg animate-pulse">⏳</span>
            </h2>
          </div>
          <div class="flex items-center space-x-3">
            <!-- View Mode Toggle -->
            <div class="hidden lg:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/30">
              <button
                @click="viewMode = 'grid'"
                :class="['p-2 rounded-full transition-all duration-200', viewMode === 'grid' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white/90']"
                title="Grid View"
              >
                <UIcon name="i-lucide-grid-2x2" class="w-5 h-5" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="['p-2 rounded-full transition-all duration-200', viewMode === 'list' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white/90']"
                title="List View"
              >
                <UIcon name="i-lucide-list" class="w-5 h-5" />
              </button>
              <button
                @click="viewMode = 'compact'"
                :class="['p-2 rounded-full transition-all duration-200', viewMode === 'compact' ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white/90']"
                title="Compact View"
              >
                <UIcon name="i-lucide-layout-grid" class="w-5 h-5" />
              </button>
            </div>
            
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
              <div class="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
            </div>
            <NuxtLink 
              to="/blog" 
              class="text-white hover:text-emerald-100 text-base font-bold transition-all duration-200 flex items-center space-x-2 group/link bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full backdrop-blur-sm border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl"
            >
              <span class="drop-shadow-sm">Lihat Semua</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-200 drop-shadow-sm" />
            </NuxtLink>
          </div>
        </div>
        <!-- Garis dekoratif dengan glow -->
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/60 to-transparent shadow-xl"></div>
        <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md"></div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent"></div>
      </header>

      <!-- Search and Filter Section -->
      <div class="px-6 pt-6 pb-2 relative z-10">
        <!-- Quick Presets Row -->
        <div class="mb-4 flex items-center gap-3 flex-wrap">
          <span class="text-sm font-bold text-emerald-100 dark:text-emerald-200">⚡ Quick Access:</span>
          <button
            @click="applyPreset('bookmarked')"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 flex items-center gap-2',
              filterPresets.bookmarked
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400 shadow-yellow-500/50'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-yellow-200/50 dark:border-yellow-700/50 hover:scale-105'
            ]"
          >
            <UIcon name="i-lucide-bookmark" class="w-4 h-4" />
            📚 Tersimpan ({{ bookmarkedPosts.length }})
          </button>
          
          <button
            @click="applyPreset('unread')"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 flex items-center gap-2',
              filterPresets.unread
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-green-500/50'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-green-200/50 dark:border-green-700/50 hover:scale-105'
            ]"
          >
            <UIcon name="i-lucide-book-open" class="w-4 h-4" />
            📖 Belum Dibaca
          </button>
          
          <button
            @click="applyPreset('myFavorites')"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 flex items-center gap-2',
              filterPresets.myFavorites
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-pink-500/50'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-pink-200/50 dark:border-pink-700/50 hover:scale-105'
            ]"
          >
            <UIcon name="i-lucide-heart" class="w-4 h-4" />
            ❤️ Favorit
          </button>
          
          <button
            @click="saveFilterPreferences"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 hover:scale-105 flex items-center gap-2"
          >
            <UIcon name="i-lucide-save" class="w-4 h-4" />
            💾 Simpan Preferensi
          </button>
          
          <!-- Import Button -->
          <label class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 hover:scale-105 flex items-center gap-2 cursor-pointer">
            <UIcon name="i-lucide-upload" class="w-4 h-4" />
            📤 Import Data
            <input type="file" accept=".json" @change="importBookmarks" class="hidden" />
          </label>
        </div>

        <!-- Main Controls Row -->
        <div class="flex flex-col lg:flex-row gap-4 mb-4">
          <!-- Search Bar -->
          <div class="flex-1 relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-emerald-300/50 dark:border-emerald-600/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 shadow-lg">
              <UIcon name="i-lucide-search" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 ml-4" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari artikel, berita, tips..."
                class="flex-1 px-4 py-4 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="mr-3 p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-full transition-colors duration-200"
              >
                <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <!-- Search Suggestions Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div
                v-if="showSearchSuggestions && searchSuggestions.length > 0"
                class="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-emerald-300/50 dark:border-emerald-600/50 overflow-hidden z-50"
              >
                <div class="p-2">
                  <div class="text-xs font-bold text-gray-500 dark:text-gray-400 px-3 py-2">Saran Pencarian:</div>
                  <button
                    v-for="(suggestion, idx) in searchSuggestions"
                    :key="idx"
                    @click="applySuggestion(suggestion)"
                    class="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <UIcon name="i-lucide-search" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {{ suggestion }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Sort Dropdown -->
          <div class="relative">
            <select
              v-model="sortBy"
              class="appearance-none px-6 py-4 pr-12 rounded-2xl font-bold text-sm transition-all duration-300 border-2 backdrop-blur-sm shadow-lg bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border-emerald-300/50 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer outline-none"
            >
              <option value="newest">🆕 Terbaru</option>
              <option value="oldest">⏰ Terlama</option>
              <option value="az">🔤 A-Z</option>
              <option value="za">🔤 Z-A</option>
              <option value="popular">🔥 Terpopuler</option>
              <option value="readtime">⚡ Tercepat Baca</option>
            </select>
            <UIcon name="i-lucide-chevron-down" class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
          </div>

          <!-- Advanced Search Toggle -->
          <button
            @click="showAdvancedSearch = !showAdvancedSearch"
            :class="[
              'px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 border-2 backdrop-blur-sm shadow-lg flex items-center gap-2',
              showAdvancedSearch
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-400'
            ]"
          >
            <UIcon name="i-lucide-sliders-horizontal" class="w-5 h-5" />
            <span class="hidden sm:inline">Filter</span>
          </button>
        </div>

        <!-- Category Filter -->
        <div class="flex gap-2 flex-wrap mb-4">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-5 py-3 rounded-xl font-bold text-xs transition-all duration-300 border-2 backdrop-blur-sm shadow-md',
              selectedCategory === cat
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-emerald-500/50 scale-105'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-105'
            ]"
          >
            {{ cat === 'all' ? '🌟 Semua' : cat }}
          </button>
        </div>

        <!-- Advanced Search Panel -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div v-if="showAdvancedSearch" class="mb-4 p-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl border-2 border-emerald-300/50 dark:border-emerald-600/50 backdrop-blur-sm shadow-xl">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-filter" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Filter Lanjutan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Date Range From -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dari Tanggal</label>
                <input
                  v-model="dateRangeFrom"
                  type="date"
                  class="w-full px-4 py-3 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors duration-200"
                />
              </div>

              <!-- Date Range To -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sampai Tanggal</label>
                <input
                  v-model="dateRangeTo"
                  type="date"
                  class="w-full px-4 py-3 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors duration-200"
                />
              </div>

              <!-- Author Filter -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Penulis</label>
                <select
                  v-model="selectedAuthor"
                  class="w-full px-4 py-3 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors duration-200 cursor-pointer"
                >
                  <option value="all">Semua Penulis</option>
                  <option v-for="author in availableAuthors.filter(a => a !== 'all')" :key="author" :value="author">
                    {{ author }}
                  </option>
                </select>
              </div>

              <!-- Read Time Filter -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Waktu Baca</label>
                <select
                  v-model="readTimeFilter"
                  class="w-full px-4 py-3 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-700/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors duration-200 cursor-pointer"
                >
                  <option value="all">Semua Durasi</option>
                  <option value="quick">⚡ Cepat (≤5 menit)</option>
                  <option value="medium">📖 Sedang (5-10 menit)</option>
                  <option value="long">📚 Panjang (>10 menit)</option>
                </select>
              </div>
            </div>
          </div>
        </transition>

        <!-- Tags Filter -->
        <div class="mb-4">
          <p class="text-sm font-semibold text-emerald-100 dark:text-emerald-200 mb-2">Filter berdasarkan tag:</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="toggleTag(tag)"
              :class="[
                'px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border-2',
                selectedTags.includes(tag)
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-cyan-500/50'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-cyan-200/50 dark:border-cyan-700/50 hover:border-cyan-400 dark:hover:border-cyan-500'
              ]"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Results count and filters -->
        <div class="mb-4 flex items-center justify-between flex-wrap gap-3">
          <p class="text-emerald-100 dark:text-emerald-200 font-semibold">
            <span class="text-xl font-black text-white">{{ filteredAndSortedNews.length }}</span> 
            artikel ditemukan
          </p>
          
          <button 
            v-if="searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || dateRangeFrom || dateRangeTo || selectedAuthor !== 'all' || readTimeFilter !== 'all'"
            @click="resetAllFilters"
            class="text-sm bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full transition-all duration-200 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <UIcon name="i-lucide-rotate-ccw" class="w-4 h-4" />
            Reset Semua Filter
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 relative z-10">
        <!-- Loading State -->
        <div v-if="isLoadingNews && !forceShowContent" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="`loading-${i}`" class="group/item block overflow-hidden rounded-2xl border-2 border-emerald-400/70 dark:border-emerald-300/70 bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-emerald-900 dark:to-teal-900 shadow-lg">
            <!-- Loading Image -->
            <div class="relative aspect-[16/9] bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-gray-300/60 via-gray-200/50 to-gray-300/60 dark:from-gray-600/60 dark:via-gray-500/50 dark:to-gray-600/60 animate-pulse"></div>
              <!-- Loading Number Badge -->
              <div class="absolute top-3 left-3 w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center animate-pulse">
                <span class="text-gray-500 dark:text-gray-400 font-bold">{{ i }}</span>
              </div>
            </div>
            <!-- Loading Content -->
            <div class="p-6 bg-white dark:bg-gray-800 border-t border-emerald-200/50 dark:border-emerald-700/50">
              <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="paginatedNewsWithPresets.length === 0" class="text-center py-12">
          <div class="inline-block p-6 bg-white/20 dark:bg-gray-800/20 rounded-3xl backdrop-blur-sm mb-4">
            <UIcon name="i-lucide-search-x" class="w-16 h-16 text-emerald-200 dark:text-emerald-400" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Tidak Ada Artikel Ditemukan</h3>
          <p class="text-emerald-200 dark:text-emerald-300 mb-4">
            Coba gunakan kata kunci atau filter yang berbeda
          </p>
          <button
            @click="resetAllFilters"
            class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Reset Filter
          </button>
        </div>

        <!-- Actual Content - Grid View -->
        <div
          v-else
          :class="[
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : '',
            viewMode === 'list' ? 'grid-cols-1' : '',
            viewMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : ''
          ]"
        >
          <article
            v-for="(post, idx) in paginatedNewsWithPresets"
            :key="post.slug || post.title || idx"
            :class="[
              'group/item relative overflow-hidden rounded-2xl border-2 border-emerald-400/70 dark:border-emerald-300/70 hover:border-emerald-500 dark:hover:border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-emerald-900 dark:to-teal-900 hover:bg-gradient-to-br hover:from-emerald-50 hover:via-teal-50 hover:to-cyan-50 dark:hover:from-emerald-800 dark:hover:via-teal-800 dark:hover:to-cyan-800 transition-all duration-500 hover:shadow-2xl backdrop-blur-sm shadow-lg',
              viewMode === 'list' ? 'flex flex-col md:flex-row' : 'block',
              viewMode === 'grid' || viewMode === 'compact' ? 'hover:scale-105' : ''
            ]"
            :style="{ animationDelay: `${idx * 50}ms` }"
            class="animate-fade-in"
          >
            <!-- Image container -->
            <NuxtLink
            :to="`/blog/${post.slug}`"
            prefetch
              :class="[
                'relative bg-gray-200 dark:bg-gray-600 overflow-hidden block',
                viewMode === 'list' ? 'md:w-80 md:h-full' : 'aspect-[16/9]',
                viewMode === 'compact' ? 'aspect-square' : ''
              ]"
            >
              <div
                class="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-gray-300/60 via-gray-200/50 to-gray-300/60 dark:from-gray-600/60 dark:via-gray-500/50 dark:to-gray-600/60 pointer-events-none"
                v-show="!loadedMap[keyFor(post, idx)]"
                aria-hidden="true"
              />
              <img
                :src="getSafeImage(post.image, post.title, post.slug)"
                :alt="post.title"
                :loading="idx === 0 ? 'eager' : 'lazy'"
                :fetchpriority="idx === 0 ? 'high' : 'auto'"
                decoding="async"
                width="800"
                height="450"
                @error="onImgError"
                @load="onImgLoad($event, keyFor(post, idx))"
                @click.prevent="handleImageClick(getSafeImage(post.image, post.title, post.slug), post.title)"
                :class="['relative z-[1] w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500 cursor-pointer', loadedMap[keyFor(post, idx)] ? 'opacity-100' : 'opacity-0']"
              />
              
              <!-- Badges Row -->
              <div class="absolute top-3 left-3 right-3 z-[3] flex items-start justify-between gap-2">
                <!-- Left badges -->
                <div class="flex flex-col gap-2">
                  <!-- Number badge -->
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-sm font-black rounded-full flex items-center justify-center shadow-xl border-2 border-white/40 backdrop-blur-sm">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-md opacity-80"></div>
                    <span class="relative z-10 drop-shadow-lg">{{ ((currentPage - 1) * itemsPerPage) + idx + 1 }}</span>
              </div>
                  
                  <!-- Status badges -->
                  <div class="flex flex-col gap-1">
                    <span v-if="post.isNew" class="px-2 py-1 text-xs font-black bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                      <UIcon name="i-lucide-sparkles" class="w-3 h-3" />
                      NEW
                    </span>
                    <span v-if="post.isTrending" class="px-2 py-1 text-xs font-black bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                      <UIcon name="i-lucide-trending-up" class="w-3 h-3" />
                      HOT
                    </span>
                    <span v-if="post.isFeatured" class="px-2 py-1 text-xs font-black bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                      <UIcon name="i-lucide-star" class="w-3 h-3" />
                      TOP
                    </span>
                  </div>
            </div>

              <!-- Right: Action buttons -->
              <div class="flex flex-col gap-2">
                <!-- Bookmark button -->
                <button
                  @click.prevent="toggleBookmark(post.slug)"
                  class="w-10 h-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-sm border-2 border-white/50"
                  :class="isBookmarked(post.slug) ? 'text-yellow-500' : 'text-gray-400'"
                >
                  <UIcon :name="isBookmarked(post.slug) ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'" class="w-5 h-5" />
                </button>
                
                <!-- TTS button (only in grid view) -->
                <button
                  v-if="viewMode === 'grid'"
                  @click.prevent="toggleTTS(post.slug, post.title)"
                  class="w-10 h-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 backdrop-blur-sm border-2 border-white/50"
                  :class="ttsCurrentArticle === post.slug && ttsPlaying ? 'text-blue-500' : 'text-gray-400'"
                >
                  <UIcon :name="ttsCurrentArticle === post.slug && ttsPlaying ? 'i-lucide-volume-2' : 'i-lucide-volume'" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Read Badge Overlay -->
            <div v-if="isRead(post.slug) && customization.showReadBadge" class="absolute top-3 right-3 z-[3] px-3 py-1.5 bg-green-500/90 text-white rounded-full backdrop-blur-sm flex items-center gap-1 text-xs font-bold shadow-lg">
              <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5" />
              Read
            </div>

            <!-- Reading Progress Bar (if exists) -->
            <div v-if="getReadingProgress(post.slug) > 0" class="absolute bottom-0 left-0 right-0 z-[3] h-1 bg-gray-200 dark:bg-gray-700">
              <div 
                class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                :style="{ width: `${getReadingProgress(post.slug)}%` }"
              ></div>
            </div>

              <!-- View count badge -->
              <div class="absolute bottom-3 right-3 z-[3] px-3 py-1.5 bg-black/70 text-white rounded-full backdrop-blur-sm flex items-center gap-1.5 text-xs font-bold shadow-lg">
                <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" />
                {{ formatViewCount(post.viewCount || 0) }}
              </div>
              
              <!-- Gradient overlay -->
              <div class="absolute inset-0 pointer-events-none z-[2] bg-gradient-to-t from-black/40 via-black/0 to-black/20" />
            </NuxtLink>
            
            <!-- Content -->
            <div :class="['flex-1 p-5 bg-white dark:bg-gray-800 backdrop-blur-sm', viewMode === 'list' ? '' : 'border-t border-emerald-200/50 dark:border-emerald-700/50']">
              <!-- Category Badge and Tags -->
              <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md category-badge">
                  {{ post.category || 'Tips' }}
                </span>
                
                <!-- Tags (visible in grid and list view, hidden in compact) -->
                <div v-if="viewMode !== 'compact'" class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in post.tags?.slice(0, 2)"
                    :key="tag"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Title -->
              <NuxtLink :to="`/blog/${post.slug}`" prefetch>
                <h3 :class="[
                  'font-bold text-gray-900 dark:text-white group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:from-emerald-600 group-hover/item:to-teal-600 dark:group-hover/item:from-emerald-400 dark:group-hover/item:to-teal-400 leading-relaxed transition-all duration-300 mb-3',
                  viewMode === 'compact' ? 'text-sm line-clamp-2' : 'text-base line-clamp-2 min-h-[48px]'
                ]">
                {{ post.title }}
              </h3>
              </NuxtLink>

              <!-- Excerpt (only in grid and list view) -->
              <p v-if="viewMode !== 'compact' && post.excerpt" class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                {{ post.excerpt }}
              </p>

              <!-- Metadata Row -->
              <div :class="['text-xs', viewMode === 'compact' ? 'space-y-1' : 'space-y-2']">
                <!-- Date and Read Time -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold meta">
                    <UIcon name="i-lucide-calendar-days" class="w-3.5 h-3.5 mr-1" />
                    <span>{{ formatDate(post.date || '') }}</span>
              </div>
                  <div class="flex items-center text-teal-600 dark:text-teal-400 font-semibold meta">
                    <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 mr-1" />
                    <span>{{ post.readTime || 5 }} min</span>
            </div>
                </div>

                <!-- Author (not in compact view) -->
                <div v-if="viewMode !== 'compact'" class="flex items-center text-gray-600 dark:text-gray-400 font-medium meta">
                  <UIcon name="i-lucide-user-circle" class="w-3.5 h-3.5 mr-1.5" />
                  <span class="truncate">{{ post.author || 'Admin' }}</span>
                </div>
              </div>

              <!-- Reactions Section (only in grid and list view) -->
              <div v-if="viewMode !== 'compact'" class="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-800">
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Reaksi Anda:</span>
                  <div class="flex items-center gap-1">
                    <!-- Like -->
                    <button
                      @click.prevent="toggleReaction(post.slug, 'like')"
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1',
                        getUserReaction(post.slug) === 'like'
                          ? 'bg-blue-500 text-white shadow-lg scale-110'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-105'
                      ]"
                    >
                      👍 <span>{{ getReactionCount(post.slug, 'like') }}</span>
                    </button>
                    
                    <!-- Love -->
                    <button
                      @click.prevent="toggleReaction(post.slug, 'love')"
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1',
                        getUserReaction(post.slug) === 'love'
                          ? 'bg-red-500 text-white shadow-lg scale-110'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-105'
                      ]"
                    >
                      ❤️ <span>{{ getReactionCount(post.slug, 'love') }}</span>
                    </button>
                    
                    <!-- Useful -->
                    <button
                      @click.prevent="toggleReaction(post.slug, 'useful')"
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1',
                        getUserReaction(post.slug) === 'useful'
                          ? 'bg-yellow-500 text-white shadow-lg scale-110'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-105'
                      ]"
                    >
                      ⭐ <span>{{ getReactionCount(post.slug, 'useful') }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Share Buttons (only in grid and list view) -->
              <div v-if="viewMode !== 'compact'" class="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-800">
                <div class="flex items-center justify-between gap-2">
                  <!-- Read More Link -->
                  <NuxtLink
                    :to="`/blog/${post.slug}`"
                    prefetch
                    @click="markAsRead(post.slug); addToRecentlyViewed(post.slug)"
                    class="flex items-center text-emerald-600 dark:text-emerald-400 font-bold group-hover/item:text-teal-600 dark:group-hover/item:text-teal-400 transition-colors duration-300 read-more"
                  >
                    <span class="text-sm">Baca</span>
                    <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1 group-hover/item:translate-x-1 transition-transform duration-300" />
          </NuxtLink>

                  <!-- Share Buttons -->
                  <div class="flex items-center gap-1">
                    <button
                      @click.prevent="shareToWhatsApp(post)"
                      class="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Share ke WhatsApp"
                    >
                      <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
                    </button>
                    <button
                      @click.prevent="shareToTwitter(post)"
                      class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Share ke Twitter"
                    >
                      <UIcon name="i-lucide-twitter" class="w-4 h-4" />
                    </button>
                    <button
                      @click.prevent="shareToFacebook(post)"
                      class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Share ke Facebook"
                    >
                      <UIcon name="i-lucide-facebook" class="w-4 h-4" />
                    </button>
                    <button
                      @click.prevent="copyLink(post)"
                      class="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Copy Link"
                    >
                      <UIcon name="i-lucide-link" class="w-4 h-4" />
                    </button>
        </div>
                </div>
              </div>
            </div>
          </article>
      </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <!-- Previous Button -->
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 border-2 backdrop-blur-sm shadow-lg flex items-center gap-2',
              currentPage === 1
                ? 'bg-white/30 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600 border-gray-300/50 dark:border-gray-700/50 cursor-not-allowed'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-105'
            ]"
          >
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
            <span class="hidden sm:inline">Sebelumnya</span>
          </button>

          <!-- Page Numbers -->
          <div class="flex gap-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 border-2 backdrop-blur-sm shadow-lg',
                currentPage === page
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-emerald-500/50 scale-110'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-105'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next Button -->
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 border-2 backdrop-blur-sm shadow-lg flex items-center gap-2',
              currentPage === totalPages
                ? 'bg-white/30 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600 border-gray-300/50 dark:border-gray-700/50 cursor-not-allowed'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-105'
            ]"
          >
            <span class="hidden sm:inline">Selanjutnya</span>
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <!-- Scroll to top button (mobile) -->
        <div class="mt-6 flex justify-center lg:hidden">
          <button
            @click="$el.closest('section')?.scrollIntoView({ behavior: 'smooth' })"
            class="px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-bold text-sm border-2 border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <UIcon name="i-lucide-arrow-up" class="w-4 h-4" />
            Kembali ke Atas
          </button>
        </div>
      </div>

      <!-- Footer dengan link ke semua post dan statistik -->
      <div class="px-6 py-6 bg-gradient-to-r from-emerald-800/40 via-teal-800/40 to-cyan-800/40 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 border-t-2 border-emerald-400/40 dark:border-emerald-300/40 relative z-10">
        <!-- Statistics Row -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-emerald-300/30">
            <div class="text-2xl font-black text-white mb-1">{{ computedLatestNews.length }}+</div>
            <div class="text-xs text-emerald-200 font-semibold">Artikel Tersedia</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-teal-300/30">
            <div class="text-2xl font-black text-white mb-1">{{ categories.length - 1 }}</div>
            <div class="text-xs text-teal-200 font-semibold">Kategori</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-cyan-300/30">
            <div class="text-2xl font-black text-white mb-1">24/7</div>
            <div class="text-xs text-cyan-200 font-semibold">Update Rutin</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-emerald-300/30">
            <div class="text-2xl font-black text-white mb-1">100%</div>
            <div class="text-xs text-emerald-200 font-semibold">Gratis Akses</div>
          </div>
        </div>

        <!-- CTA Button -->
        <NuxtLink 
          to="/blog" 
          class="flex items-center justify-center space-x-3 text-emerald-100 dark:text-emerald-200 hover:text-white dark:hover:text-emerald-100 font-black text-base transition-all duration-300 group/link bg-white/20 hover:bg-white/30 px-8 py-4 rounded-full backdrop-blur-sm border-2 border-emerald-300/50 hover:border-emerald-200/70 shadow-lg hover:shadow-xl"
        >
          <UIcon name="i-lucide-newspaper" class="w-5 h-5" />
          <span class="drop-shadow-sm">🌟 Jelajahi Semua Artikel & Berita</span>
          <UIcon name="i-lucide-arrow-right" class="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-300 drop-shadow-sm" />
        </NuxtLink>

        <!-- Additional Info -->
        <div class="mt-4 text-center text-emerald-200/80 text-xs">
          <p class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            <span>Artikel baru ditambahkan setiap minggu</span>
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
          </p>
      </div>
      </div>

      <!-- Keyboard Help Modal -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showKeyboardHelp" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click="showKeyboardHelp = false">
          <div @click.stop class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <UIcon name="i-lucide-keyboard" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
                Keyboard Shortcuts
              </h3>
              <button @click="showKeyboardHelp = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <UIcon name="i-lucide-x" class="w-6 h-6" />
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div v-for="shortcut in [
                { key: 'Ctrl/Cmd + K', desc: 'Quick Search' },
                { key: '→ ←', desc: 'Navigate Cards' },
                { key: 'Enter', desc: 'Open Article' },
                { key: 'B', desc: 'Bookmark Article' },
                { key: 'S', desc: 'Share Article' },
                { key: 'ESC', desc: 'Close Modals' },
                { key: '?', desc: 'Show This Help' }
              ]" :key="shortcut.key" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ shortcut.key }}</span>
                <span class="text-gray-700 dark:text-gray-300">{{ shortcut.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Customization Panel Modal -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCustomizationPanel" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click="showCustomizationPanel = false">
          <div @click.stop class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <UIcon name="i-lucide-settings" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
                Customization
              </h3>
              <button @click="showCustomizationPanel = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <UIcon name="i-lucide-x" class="w-6 h-6" />
              </button>
            </div>
            <div class="p-6 space-y-6">
              <!-- Font Size -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Font Size</label>
                <div class="flex gap-2">
                  <button v-for="size in ['small', 'medium', 'large']" :key="size" @click="customization.fontSize = size" :class="['px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300', customization.fontSize === size ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400']">{{ size }}</button>
                </div>
              </div>
              
              <!-- Card Density -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Card Density</label>
                <div class="flex gap-2">
                  <button v-for="density in ['compact', 'comfortable', 'spacious']" :key="density" @click="customization.cardDensity = density" :class="['px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300', customization.cardDensity === density ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400']">{{ density }}</button>
                </div>
              </div>
              
              <!-- Animation Speed -->
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Animation Speed</label>
                <div class="flex gap-2">
                  <button v-for="speed in ['slow', 'normal', 'fast', 'off']" :key="speed" @click="customization.animationSpeed = speed" :class="['px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300', customization.animationSpeed === speed ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400']">{{ speed }}</button>
                </div>
              </div>
              
              <!-- Toggles -->
              <div class="space-y-3">
                <label class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer">
                  <span class="font-bold text-gray-700 dark:text-gray-300">Show Read Badge</span>
                  <input type="checkbox" v-model="customization.showReadBadge" class="w-5 h-5 rounded" />
                </label>
                <label class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer">
                  <span class="font-bold text-gray-700 dark:text-gray-300">Enable Keyboard Shortcuts</span>
                  <input type="checkbox" v-model="customization.enableKeyboardShortcuts" class="w-5 h-5 rounded" />
                </label>
              </div>
              
              <button @click="saveFilterPreferences(); showCustomizationPanel = false" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300">
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <!-- Recently Viewed Section (if has history) -->
    <section v-if="recentlyViewed.length > 0" class="mt-6 bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 dark:from-gray-950 dark:via-slate-950 dark:to-zinc-950 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700/50 p-6">
      <h3 class="text-xl font-black text-white mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-history" class="w-6 h-6 text-blue-400" />
        Recently Viewed
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="slug in recentlyViewed.slice(0, 4)"
          :key="slug"
          :to="`/blog/${slug}`"
          class="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <div class="text-sm font-bold text-white line-clamp-2">{{ computedLatestNews.find((p: BlogApiPost) => p.slug === slug)?.title || slug }}</div>
        </NuxtLink>
      </div>
    </section>

    <!-- Recommendations Section (if has recommendations) -->
    <section v-if="recommendations.length > 0" class="mt-6 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 dark:from-orange-950 dark:via-red-950 dark:to-pink-950 rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-700/50 p-6">
      <h3 class="text-xl font-black text-white mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-sparkles" class="w-6 h-6 text-yellow-400" />
        Recommended For You
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="post in recommendations"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 flex gap-3"
        >
          <UIcon name="i-lucide-arrow-right" class="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <div class="text-sm font-bold text-white line-clamp-2">{{ post.title }}</div>
            <div class="text-xs text-orange-200 mt-1">{{ post.category }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Stagger fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}

/* View mode transitions */
.grid,
.flex {
  transition: all 0.3s ease;
}

/* Smooth scrolling behavior */
html {
  scroll-behavior: smooth;
}

/* Badge pulse animation */
@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.category-badge {
  animation: badgePulse 2s ease-in-out infinite;
}

/* Share button hover effects */
button:hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth transitions for all interactive elements */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Bounce animation for toast */
@keyframes bounceOnce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-once {
  animation: bounceOnce 0.6s ease-out;
}

/* Reaction buttons animation */
button:active {
  transform: scale(0.95);
}

/* Modal backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Custom scrollbar for modals */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.5);
  border-radius: 10px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.7);
}

/* Floating buttons hover effect */
.fixed button:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Quick preset buttons */
.quick-preset-btn {
  position: relative;
  overflow: hidden;
}

.quick-preset-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.quick-preset-btn:active::before {
  width: 300px;
  height: 300px;
}

/* Reading progress bar animation */
.reading-progress {
  transition: width 0.3s ease-out;
}

/* TTS button pulse when playing */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.tts-playing {
  animation: pulse 2s ease-in-out infinite;
}

/* Customization panel smooth transitions */
.customization-option {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.customization-option:hover {
  transform: translateX(4px);
}

/* WhatsApp pulse animation */
@keyframes pulseSlow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
  }
}

.animate-pulse-slow {
  animation: pulseSlow 3s ease-in-out infinite;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  /* Larger touch targets */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Better spacing for mobile */
  .berita-theme {
    padding: 0.5rem !important;
  }
  
  /* Mobile-friendly cards */
  .group\/item {
    margin-bottom: 1rem;
  }
  
  /* Hide desktop-only elements */
  .lg\:flex {
    display: none !important;
  }
  
  /* Mobile menu positioning */
  .mobile-menu {
    max-width: calc(100vw - 2rem);
  }
  
  /* Touch feedback */
  button:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
  
  /* Swipe indicator */
  .swipe-indicator {
    position: fixed;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .swipe-indicator.active {
    opacity: 1;
  }
}

/* Mobile landscape */
@media (max-width: 768px) and (orientation: landscape) {
  .berita-theme section {
    border-radius: 1rem !important;
  }
  
  .fixed.bottom-4 {
    bottom: 1rem !important;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1024px) {
  .berita-theme {
    padding: 1rem !important;
  }
  
  /* 2 column layout for tablets */
  .grid-cols-1.sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

/* Small mobile (iPhone SE, etc) */
@media (max-width: 375px) {
  .berita-theme section {
    padding: 0.75rem !important;
    border-radius: 1rem !important;
  }
  
  /* Smaller buttons on small screens */
  .fixed button {
    width: 3rem !important;
    height: 3rem !important;
  }
  
  .fixed button .w-7 {
    width: 1.25rem !important;
    height: 1.25rem !important;
  }
  
  /* Compact quick presets */
  .quick-preset-btn {
    font-size: 0.75rem !important;
    padding: 0.5rem !important;
  }
}

/* Large mobile / phablets */
@media (min-width: 414px) and (max-width: 767px) {
  .berita-theme {
    padding: 1rem !important;
  }
}

/* Pull to refresh indicator */
.pull-to-refresh {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  background: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0 0 1rem 1rem;
  font-weight: bold;
  transition: transform 0.3s ease-out;
  z-index: 9999;
}

.pull-to-refresh.active {
  transform: translateX(-50%) translateY(0);
}

/* Mobile toast positioning */
@media (max-width: 768px) {
  .fixed.top-4.right-4 {
    top: 1rem !important;
    right: 1rem !important;
    left: 1rem !important;
    right: 1rem !important;
  }
}

/* Smooth scroll on mobile */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Disable hover effects on touch devices */
@media (hover: none) {
  button:hover {
    transform: none !important;
  }
  
  .group:hover {
    transform: none !important;
  }
}

/* Better focus indicators for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 3px solid #10b981;
  outline-offset: 2px;
}
</style>

