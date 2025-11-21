<script setup lang="ts">
import HeaderSearch from './HeaderSearch.vue'
import { formatDateSafe } from '~/utils/date'
import { 
  BLOG_IMAGES, 
  SIMPLE_IMAGES, 
  buildAiHeroUrl,
  getCardImage,
  getSafeImage,
  onCardImgError,
  onCardImgLoad,
  hashString,
  isValidImageUrl,
  normalizeImageUrlClient
} from '../../utils/blog-images'
import { useBlogLoading } from '../../composables/useBlogLoading'

// Format time function with AM/PM - ALWAYS SHOWS TIME
function formatTimeSafe(dateStr?: string): string {
  console.log('formatTimeSafe called with:', dateStr)
  
  // Always generate a time if no date provided
  if (!dateStr || dateStr.trim() === '') {
    const hour = Math.floor(Math.random() * 12) + 1 // 1-12 for 12-hour format
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0')
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM'
    const result = `${hour}:${minute} ${ampm}`
    console.log('Generated random time:', result)
    return result
  }
  
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      // If date is invalid, generate random time
      const hour = Math.floor(Math.random() * 12) + 1 // 1-12 for 12-hour format
      const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0')
      const ampm = Math.random() > 0.5 ? 'AM' : 'PM'
      const result = `${hour}:${minute} ${ampm}`
      console.log('Invalid date, generated random time:', result)
      return result
    }
    
    // Format with AM/PM
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    
    // Ensure we always return a time
    const result = timeStr || '12:00 PM'
    console.log('Formatted time:', result)
    return result
  } catch (error) {
    console.log('Time formatting error:', error)
    // Fallback to random time
    const hour = Math.floor(Math.random() * 12) + 1 // 1-12 for 12-hour format
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0')
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM'
    const result = `${hour}:${minute} ${ampm}`
    console.log('Error fallback time:', result)
    return result
  }
}

type BlogApiPost = {
  id: number;
  slug: string;
  title: string;
  date: string;
  image: string;
};

type BlogApiResponse = {
  posts: BlogApiPost[];
  totalPages: number;
  currentPage: number;
};

interface BlogResponse {
  data: [
    {
      id: number;
      slug: string;
      title: string;
      publish_at: string;
      featured_image: string;
    }
  ];
  meta: {
    current_page: number;
    last_page: number;
    total_posts: number;
    links: [
      {
        active: boolean;
        label: string;
        url: string | null;
      }
    ]
  };
}

// Intersection Observer for scroll-triggered animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
}

let cardObserver: IntersectionObserver | null = null

function setupIntersectionObserver() {
  if (!import.meta.client) return
  
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        // Unobserve after animation to improve performance
        cardObserver?.unobserve(entry.target)
      }
    })
  }, observerOptions)
  
  // Observe all blog cards
  nextTick(() => {
    const cards = document.querySelectorAll('.blog-card.will-animate')
    cards.forEach((card) => {
      cardObserver?.observe(card)
    })
  })
}

// Setup observer on mount
onMounted(() => {
  setupIntersectionObserver()
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (cardObserver) {
    cardObserver.disconnect()
    cardObserver = null
  }
})

// Use blog loading composable
const { isLoading, loadingProgress, loadingMessage, loadingStartTime, startLoading, stopLoading } = useBlogLoading()

// Show title popup
function showTitlePopup(title: string) {
  showPopup.value = title
  // Auto close after 5 seconds
  setTimeout(() => {
    showPopup.value = null
  }, 5000)
}

// Close popup when clicking outside
function closePopupOnOutsideClick(event: Event) {
  if (showPopup.value && !(event.target as Element).closest('.title-popup')) {
    showPopup.value = null
  }
}

// Navigate to article page
function navigateToArticle(blog: any) {
  console.log('Navigating to article:', blog)
  
  // Check if blog has slug, if not try to generate one from title
  let slug = blog?.slug
  if (!slug && blog?.title) {
    // Generate slug from title as fallback
    slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }
  
  if (!slug) {
    console.warn('Blog slug not found and cannot generate from title:', blog)
    return
  }
  
  try {
    console.log('Navigating to:', `/blog/${slug}`)
    // Use router.push for navigation
    router.push(`/blog/${slug}`)
  } catch (error) {
    console.error('Navigation error:', error)
    // Fallback to window.location if router fails
    if (typeof window !== 'undefined') {
      window.location.href = `/blog/${slug}`
    }
  }
}


const props = defineProps<{ mode?: 'home' | 'list'; limit?: number }>()
const isHome = computed(() => props.mode === 'home')
const homeLimit = computed(() => Math.min(Math.max(Number(props.limit ?? 8), 1), 24))

// Grid style computed property for responsive grid layout
const gridStyle = computed(() => {
  const screenWidth = process.client ? window.innerWidth : 1024
  
  let columns = '1fr'
  let gap = '16px'
  
  if (screenWidth >= 480) {
    columns = 'repeat(2, 1fr)'
    gap = '14px'
  }
  if (screenWidth >= 640) {
    columns = 'repeat(2, 1fr)'
    gap = '16px'
  }
  if (screenWidth >= 768) {
    columns = 'repeat(3, 1fr)'
    gap = '18px'
  }
  if (screenWidth >= 1024) {
    columns = 'repeat(4, 1fr)'
    gap = '20px'
  }
  if (screenWidth >= 1280) {
    columns = 'repeat(4, 1fr)'
    gap = '24px'
  }
  
  return {
    display: 'grid',
    gridTemplateColumns: columns,
    gap: gap,
    width: '100%',
    alignItems: 'stretch'
  }
})

// Computed property to ensure blogs data is reactive and available
const displayBlogs = computed(() => {
  if (!blogs.value?.data) return []
  return blogs.value.data
})

// Auto slider state
const currentSlide = ref(0)
const slideInterval = ref<NodeJS.Timeout | null>(null)
const isAutoSliding = ref(true)

// Image loading state - per card basis (simplified approach)
const imageLoadedStates = ref<Record<string, boolean>>({})

// Title popup state
const showPopup = ref<string | null>(null)

// Slider computed properties
const totalSlides = computed(() => {
  const slides = Math.ceil((blogs.value?.data?.length || 0) / 8)
  // console.log('📊 Total Slides:', slides, 'Data Length:', blogs.value?.data?.length)
  return slides
})
const currentSlidePosts = computed(() => {
  if (!blogs.value?.data) return []
  const start = currentSlide.value * 8
  const end = start + 8
  return blogs.value.data.slice(start, end)
})

const route = useRoute();
const router = useRouter();
const params = ref<number>(Number((route.query.page as string) || 1) || 1);

// Search state synced with route (?q=)
const searchQuery = ref<string>(typeof route.query.q === 'string' ? (route.query.q as string) : '');
const searchModel = ref<string>(searchQuery.value);
const showSearchDropdown = ref(false);
const searchHistory = ref<string[]>([]);
const searchSuggestions = ref<string[]>([]);

// Category Filter State
const selectedCategory = ref<string>('all');
const availableCategories = ref([
  { id: 'all', name: 'Semua Artikel', icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { id: 'paypal', name: 'PayPal', icon: '💳', color: 'from-indigo-500 to-purple-500' },
  { id: 'panduan', name: 'Panduan', icon: '📖', color: 'from-green-500 to-emerald-500' },
  { id: 'tips', name: 'Tips & Trik', icon: '💡', color: 'from-yellow-500 to-orange-500' },
  { id: 'tutorial', name: 'Tutorial', icon: '🎓', color: 'from-pink-500 to-rose-500' },
  { id: 'berita', name: 'Berita', icon: '📰', color: 'from-red-500 to-pink-500' },
  { id: 'teknologi', name: 'Teknologi', icon: '🚀', color: 'from-cyan-500 to-blue-500' }
]);

const enhancedCategories = ref([
  { id: 'all', name: 'Semua Artikel', icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { id: 'paypal', name: 'PayPal', icon: '💳', color: 'from-indigo-500 to-purple-500' },
  { id: 'bitcoin', name: 'Bitcoin & Crypto', icon: '₿', color: 'from-orange-500 to-red-500' },
  { id: 'skrill', name: 'Skrill', icon: '🏦', color: 'from-blue-500 to-indigo-500' },
  { id: 'neteller', name: 'Neteller', icon: '💎', color: 'from-purple-500 to-pink-500' },
  { id: 'panduan', name: 'Panduan', icon: '📖', color: 'from-green-500 to-emerald-500' },
  { id: 'tips', name: 'Tips & Trik', icon: '💡', color: 'from-yellow-500 to-orange-500' },
  { id: 'tutorial', name: 'Tutorial', icon: '🎓', color: 'from-pink-500 to-rose-500' },
  { id: 'berita', name: 'Berita', icon: '📰', color: 'from-red-500 to-pink-500' },
  { id: 'teknologi', name: 'Teknologi', icon: '🚀', color: 'from-cyan-500 to-blue-500' },
  { id: 'keamanan', name: 'Keamanan', icon: '🔐', color: 'from-green-600 to-teal-600' },
  { id: 'trading', name: 'Trading', icon: '📈', color: 'from-emerald-500 to-green-500' },
  { id: 'hosting', name: 'Hosting & Domain', icon: '🌐', color: 'from-blue-600 to-purple-600' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒', color: 'from-purple-600 to-pink-600' },
  { id: 'fintech', name: 'Fintech', icon: '💼', color: 'from-indigo-600 to-blue-600' },
  { id: 'investasi', name: 'Investasi', icon: '💰', color: 'from-yellow-600 to-orange-600' }
]);
const popularSearches = ref([
  'PayPal', 'Netflix', 'Pembayaran Online', 'Digital Banking', 
  'Keamanan Transaksi', 'Fintech', 'E-commerce', 'Cryptocurrency',
  'Gopay', 'Dana', 'OVO', 'ShopeePay', 'LinkAja', 'BCA', 'Mandiri',
  'Bitcoin', 'Ethereum', 'Crypto', 'Blockchain', 'Trading', 'Investasi',
  'Domain', 'Hosting', 'Website', 'SEO', 'Marketing', 'Bisnis Online'
]);

// Title popup state - removed as cards are now fully clickable

// View options state
const viewLimit = ref<number>(route.query.showAll === 'true' ? 0 : (Number(route.query.limit) || 8));
const viewOptions = [8, 24, 50, 100, 0]; // 0 means all
const viewLabels = {
  8: '8 Artikel',
  24: '24 ke bawah',
  50: '50 Artikel',
  100: '100 Artikel',
  0: 'Semua Artikel'
};

const onSubmitSearch = async () => {
  try {
    const q = (searchModel.value || '').trim();
    const qParams: Record<string, any> = { ...route.query };
    if (q) {
      qParams.q = q;
    } else {
      delete qParams.q;
    }
    // Always reset page when applying search
    delete qParams.page;
    await router.replace({ query: qParams });
    // route watchers will update params and refresh
  } catch {}
};

// Function to change view limit
const changeViewLimit = async (limit: number) => {
  try {
    const loadingInterval = startLoading(`Mengubah tampilan ke ${limit === 0 ? 'semua' : limit} artikel...`);
    
    viewLimit.value = limit;
    const qParams: Record<string, any> = { ...route.query };
    
    if (limit === 8) {
      delete qParams.limit; // Default limit
      delete qParams.showAll; // Remove showAll mode
    } else if (limit === 0) {
      qParams.showAll = 'true'; // Show all mode
      delete qParams.limit;
    } else {
      qParams.limit = limit.toString();
      delete qParams.showAll; // Remove showAll mode
    }
    
    // Reset to page 1 when changing limit
    qParams.page = '1';
    params.value = 1;
    
    await router.replace({ query: qParams });
    await refresh();
    
    clearInterval(loadingInterval);
    stopLoading();
  } catch (error) {
    console.warn('Failed to change view limit:', error);
    stopLoading();
  }
};

watch(searchQuery, (val: string) => { searchModel.value = val; });

// Search functionality
const onSearchInput = () => {
  showSearchDropdown.value = true;
  if (searchModel.value.length >= 1) {
    // Generate suggestions based on input
    searchSuggestions.value = popularSearches.value.filter((term: string) => 
      term.toLowerCase().includes(searchModel.value.toLowerCase())
    );
  } else {
    searchSuggestions.value = [];
  }
};

const performSearch = async () => {
  if (!searchModel.value.trim()) return;
  
  const loadingInterval = startLoading('Mencari artikel...');
  
  try {
    // Add to search history
    if (!searchHistory.value.includes(searchModel.value)) {
      searchHistory.value.unshift(searchModel.value);
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10);
      }
    }
    
    // Update search query and trigger refresh
    searchQuery.value = searchModel.value;
    await router.replace({ 
      query: { ...route.query, q: searchModel.value, page: '1' } 
    });
    params.value = 1;
    await refresh();
    
    showSearchDropdown.value = false;
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    clearInterval(loadingInterval);
    stopLoading();
  }
};

// Category Filter Function
const selectCategory = async (categoryId: string) => {
  const loadingInterval = startLoading('Memfilter artikel...');
  
  try {
    selectedCategory.value = categoryId;
    
    // Update route with category filter
    await router.replace({ 
      query: { ...route.query, category: categoryId === 'all' ? undefined : categoryId, page: '1' } 
    });
    params.value = 1;
    await refresh();
  } catch (error) {
    console.error('Category filter error:', error);
  } finally {
    clearInterval(loadingInterval);
    stopLoading();
  }
};

// Filter blogs by category
const filteredBlogs = computed(() => {
  if (!blogs.value?.data) return { data: [], meta: blogs.value?.meta };
  
  let filtered = blogs.value.data;
  
  // Apply category filter
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter((blog: any) => {
      const categories = blog.categories || [];
      const tags = blog.tags || [];
      const allTerms = [...categories, ...tags].map((t: any) => 
        typeof t === 'string' ? t.toLowerCase() : String(t).toLowerCase()
      );
      
      return allTerms.some((term: string) => 
        term.includes(selectedCategory.value.toLowerCase())
      );
    });
  }
  
  return {
    data: filtered,
    meta: blogs.value.meta
  };
});

// Close search dropdown when clicking outside
const closeSearchDropdown = () => {
  showSearchDropdown.value = false;
};

// Add click outside listener
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('click', (event) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        showSearchDropdown.value = false;
      }
    });
  }
});

// Function to get all available blog posts from database
const getAllBlogPosts = async () => {
  try {
    const response: any = await $fetch('/api/blog', { 
      params: { limit: 1000, page: 1 },
      timeout: 10000 
    });
    return response?.data || response?.posts || [];
  } catch (error) {
    console.warn('Failed to get all blog posts:', error);
    return [];
  }
};

// Function to search in all blog posts
const searchAllBlogs = async (searchTerm: string) => {
  try {
    const response: any = await $fetch('/api/blog/search', { 
      params: { q: searchTerm, limit: 1000, page: 1 },
      timeout: 10000 
    });
    return response?.posts || response?.data || [];
  } catch (error) {
    console.warn('Failed to search all blogs:', error);
    return [];
  }
};

// Title popup functions - removed as cards are now fully clickable

// Computed properties for view management
const isShowAllMode = computed(() => viewLimit.value === 0);
const currentViewLabel = computed(() => viewLabels[viewLimit.value as keyof typeof viewLabels] || '8 Artikel');

const { data: blogs, status: blogStatus, refresh } = useAsyncData<BlogResponse>(
  () => `blogs:${params.value}:${searchQuery.value}:${viewLimit.value}`,
  async () => {
    const loadingInterval = startLoading('Memuat artikel blog...')
    
    try {
      const q = (searchQuery.value || '').trim();
      const limit = viewLimit.value === 0 ? 1000 : viewLimit.value; // 0 means all, use 1000 as max
      
      // Decide endpoint based on context
      let endpoint = '/api/blog'
      let reqParams: any = { page: params.value, limit }
      if (q) {
        endpoint = '/api/blog/search'
        // For search, use larger limit to get more results
        reqParams = { page: params.value, q, limit: Math.max(limit, 50) }
      } else if (isHome.value) {
        // Use paginated endpoint for homepage so pagination is available
        endpoint = '/api/blog'
        reqParams = { page: params.value, limit: 8 }
      } else {
        // For blog page (/blog), use default pagination with 8 posts per page
        // This ensures we get proper pagination (8 x 22 pages = 176 posts)
        endpoint = '/api/blog'
        reqParams = { page: params.value, limit: limit || 8 }
      }
      
      // Add timeout and retry for better performance
      console.log('Fetching from endpoint:', endpoint, 'with params:', reqParams)
      const res: any = await $fetch(endpoint, { 
        params: reqParams,
        timeout: 10000, // Increased timeout for better reliability
        retry: 1 // Allow one retry
      });
      
      console.log('API Response:', res)

      // Map response for both array (latest) and paginated object (index/search)
      const postsArr = Array.isArray(res) ? res : (res?.posts || res?.data || [])
      const pagination = res?.pagination || {}
      
      console.log('Posts array:', postsArr)
      console.log('Pagination:', pagination)
      
      // ✅ SUPER SORT: Sort by date descending (TERBARU DULU!)
      // Priority: date > publish_at > created_at > fallback to NOW
      // Konsisten dengan server side sorting
      postsArr.sort((a: any, b: any) => {
        // Get date with multiple fallbacks (prioritas: date > publish_at > created_at)
        const getDate = (item: any) => {
          const dateStr = item?.date || item?.publish_at || item?.created_at || new Date().toISOString()
          const parsedDate = new Date(dateStr)
          // If invalid date, use current time
          return isNaN(parsedDate.getTime()) ? Date.now() : parsedDate.getTime()
        }
        
        const dateA = getDate(a)
        const dateB = getDate(b)
        
        // Sort DESCENDING (newest first / terbaru dulu)
        return dateB - dateA
      })
      
      // Log untuk debugging (dev only)
      if (process.env.NODE_ENV === 'development' && postsArr.length > 0) {
        console.log('✅ Blog sorted by date (newest first):')
        console.log('  First:', postsArr[0]?.title?.substring(0, 50), '→', postsArr[0]?.publish_at || postsArr[0]?.date)
        console.log('  Last:', postsArr[postsArr.length - 1]?.title?.substring(0, 50), '→', postsArr[postsArr.length - 1]?.publish_at || postsArr[postsArr.length - 1]?.date)
      }
      
      // If no posts found and we're on a high page number, redirect to page 1
      if (postsArr.length === 0 && params.value > 1) {
        console.warn(`No posts found on page ${params.value}, redirecting to page 1`)
        params.value = 1
        return { data: [], meta: { current_page: 1, last_page: 1, total_posts: 0, links: [] } } as any
      }
      
      const mapped: BlogResponse = {
        data: postsArr.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: typeof p.title === 'string' ? p.title.replace(/<[^>]*>/g, '').trim() : (p.slug || 'Blog Post'),
          publish_at: p.date || p.publish_at,
          featured_image: getSafeImage(p?.featured_image || p?.image, p?.title, p?.slug),
        })),
        meta: {
          current_page: pagination.page || params.value,
          last_page: pagination.totalPages || 1,
          total_posts: pagination.total || postsArr.length,
          links: [{ active: false, label: '', url: null }]
        }
      };
      
      console.log('🎯 Mapped Data:', {
        dataLength: mapped.data.length,
        firstPost: mapped.data[0]?.title || 'N/A',
        meta: mapped.meta,
        isHome: isHome.value
      })


      if (!mapped.data.length) {
        if (!q) {
          const nowIso = new Date().toISOString();
          const seeds = [
            { slug: 'jasa-paypal', title: 'Jasa PayPal: Solusi Pembayaran Online Aman' },
            { slug: 'jasa-bayar-paypal', title: 'Jasa Bayar PayPal Cepat & Terpercaya' },
            { slug: 'jasa-transfer-paypal', title: 'Jasa Transfer PayPal untuk Transaksi Global' },
            { slug: 'jasa-domain-namecheap', title: 'Jasa Domain Namecheap: Panduan & Tips' },
            { slug: 'jasa-namecheap', title: 'Jasa Namecheap: Keamanan Transaksi Online' },
            { slug: 'jasa-top-up-paypal', title: 'Jasa Top Up PayPal: Praktis & Aman' },
            { slug: 'jasa-verifikasi-paypal', title: 'Jasa Verifikasi PayPal: Mudah & Tepat' },
            { slug: 'jasa-domain-namesilo', title: 'Jasa Domain NameSilo: Pilihan Tepat' }
          ];
          const fallbackData = seeds.map((s, i) => ({
            id: -3000 - i,
            slug: s.slug,
            title: s.title,
            publish_at: nowIso,
            featured_image: getSafeImage('', s.title, s.slug)
          }));
          return {
            data: fallbackData,
            meta: { current_page: 1, last_page: 1, total_posts: fallbackData.length, links: [] }
          } as any;
        }
        return { data: [], meta: { current_page: params.value, last_page: 1, total_posts: 0, links: [] } } as any;
      }
      return mapped;
    } catch (e) {
      console.warn('Blog fetch failed, using fallback when possible:', e);
      const q = (searchQuery.value || '').trim();
      if (!q) {
        const nowIso = new Date().toISOString();
        const seeds = [
          { slug: 'jasa-paypal', title: 'Jasa PayPal: Solusi Pembayaran Online Aman' },
          { slug: 'jasa-bayar-paypal', title: 'Jasa Bayar PayPal Cepat & Terpercaya' },
          { slug: 'jasa-transfer-paypal', title: 'Jasa Transfer PayPal untuk Transaksi Global' },
          { slug: 'jasa-domain-namecheap', title: 'Jasa Domain Namecheap: Panduan & Tips' },
          { slug: 'jasa-namecheap', title: 'Jasa Namecheap: Keamanan Transaksi Online' },
          { slug: 'jasa-top-up-paypal', title: 'Jasa Top Up PayPal: Praktis & Aman' },
          { slug: 'jasa-verifikasi-paypal', title: 'Jasa Verifikasi PayPal: Mudah & Tepat' },
          { slug: 'jasa-domain-namesilo', title: 'Jasa Domain NameSilo: Pilihan Tepat' }
        ];
        const fallbackData = seeds.map((s, i) => ({
          id: -4000 - i,
          slug: s.slug,
          title: s.title,
          publish_at: nowIso,
          featured_image: getSafeImage('', s.title, s.slug)
        }));
        return {
          data: fallbackData,
          meta: { current_page: 1, last_page: 1, total_posts: fallbackData.length, links: [] }
        } as any;
      }
      return { data: [], meta: { current_page: params.value, last_page: 1, total_posts: 0, links: [] } } as any;
    } finally {
      clearInterval(loadingInterval)
      stopLoading()
    }
  },
  { 
    server: false,  // Disable SSR - client side only for better data loading
    lazy: false,    // Immediate load
    immediate: true, // Fetch immediately
    default: () => ({
      data: [],
      meta: { current_page: 1, last_page: 1, total_posts: 0, links: [] }
    })
  }
);

// Sync params with route query changes (back/forward navigation)
watch(() => route.query.page, (newVal: string | string[]) => {
  const pageNum = Number(newVal as string) || 1;
  if (pageNum !== params.value) {
    params.value = pageNum;
    refresh();
  }
});

// Sync search query (?q=) with local state and refresh when it changes
watch(() => route.query.q, (newQ: string | string[]) => {
  const val = typeof newQ === 'string' ? (newQ as string) : '';
  if (val !== searchQuery.value) {
    searchQuery.value = val;
  }
  // Reset local page state to 1 when search changes
  if (params.value !== 1) params.value = 1;
  refresh();
});

const changePage = async (page: number) => {
  const last = blogs.value?.meta.last_page || 1;
  if (page < 1 || page > last) {
    return;
  }

  const loadingInterval = startLoading(`Memuat halaman ${page}...`)

  try {
  // Update local state
  params.value = page;

  // Sync the URL query (?page=) for deep linking
  try {
    const q: Record<string, any> = { ...route.query, page: String(page) };
    // Avoid adding page=1 to keep clean URL
    if (page === 1) {
      delete q.page;
    }
    await router.replace({ query: q });
  } catch (err) {
    console.debug('Pagination route replace skipped', err);
  }

  // Refresh the data
  await refresh();
  } finally {
    clearInterval(loadingInterval)
    stopLoading()
  }

  // Smooth scroll to the blog section on navigation (client-only)
  if (import.meta.client) {
    // Prefer outer blog page container to avoid conflicts with inner elements
    const outer = document.getElementById('blog-page')
    const inner = document.getElementById('blog-page-inner')
    const target = outer || inner

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
};

const goToPreviousPage = () => {
  if (blogs.value?.meta.current_page && blogs.value.meta.current_page > 1) {
    changePage(blogs.value.meta.current_page - 1);
  }
};

const goToNextPage = () => {
  if (blogs.value?.meta.current_page && blogs.value?.meta.last_page &&
      blogs.value.meta.current_page < blogs.value.meta.last_page) {
    changePage(blogs.value.meta.current_page + 1);
  }
};

// Show all posts functionality
const showAllPosts = async () => {
  await changeViewLimit(0); // 0 means all posts
};

// Back to pagination functionality
const backToPagination = async () => {
  await changeViewLimit(8); // Back to default 8 posts per page
};

const mobilePages = computed(() => {
  const last = blogs.value?.meta.last_page || 1;
  const current = blogs.value?.meta.current_page || 1;

  // Show all pages if count is small
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Case 1: Current page is near the beginning (1-5)
  if (current <= 5) {
    // Show: 1, 2, 3, 4, 5, ..., last-1, last
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    if (last > 6) {
      pages.push('…');
    }
    if (last > 5) {
      pages.push(last - 1, last);
    }
  }
  // Case 2: Current page is near the end (last-4 to last)
  else if (current >= last - 4) {
    // Show: 1, 2, ..., last-4, last-3, last-2, last-1, last
    pages.push(1, 2);
    if (last > 6) {
      pages.push('…');
    }
    for (let i = last - 4; i <= last; i++) {
      pages.push(i);
    }
  }
  // Case 3: Current page is in the middle
  else {
    // Show: 1, 2, ..., current-1, current, current+1, ..., last-1, last
    pages.push(1, 2);
    pages.push('…');
    pages.push(current - 1, current, current + 1);
    pages.push('…');
    pages.push(last - 1, last);
  }

  // Remove adjacent duplicates and ellipsis
  return pages.filter((item, idx, arr) => {
    if (idx === 0) return true;
    // Don't show duplicate numbers or consecutive ellipsis
    if (item === arr[idx - 1]) return false;
    // Don't show ellipsis if next item is consecutive number
    if (item === '…' && idx < arr.length - 1 && typeof arr[idx + 1] === 'number' && typeof arr[idx - 1] === 'number') {
      const prev = arr[idx - 1] as number;
      const next = arr[idx + 1] as number;
      if (next === prev + 1) return false;
    }
    return true;
  });
});

const desktopPages = computed<(number | string)[]>(() => {
  // Use the same logic as mobile for consistent pagination
  return mobilePages.value;
});

// Enhanced SEO meta tags for blog listing
useSeoMeta({
  title: computed(() => {
    const page = blogs.value?.meta?.current_page || 1;
    const total = blogs.value?.meta?.last_page || 1;
    const searchTerm = searchModel.value ? ` - "${searchModel.value}"` : '';
    return page > 1 
      ? `Blog Page ${page} dari ${total}${searchTerm} - JasaPembayaran.com` 
      : `Blog Terbaru${searchTerm} - JasaPembayaran.com`;
  }),
  description: computed(() => {
    const page = blogs.value?.meta?.current_page || 1;
    const total = blogs.value?.meta?.last_page || 1;
    const searchTerm = searchModel.value ? ` tentang "${searchModel.value}"` : '';
    return page > 1 
      ? `Halaman ${page} dari ${total} blog JasaPembayaran.com${searchTerm} - Artikel terbaru tentang pembayaran online, fintech, Bitcoin, PayPal, trading cryptocurrency, dan teknologi finansial`
      : `Blog terbaru dari JasaPembayaran.com${searchTerm} - 500+ artikel eksklusif tentang pembayaran online, fintech, Bitcoin, PayPal, trading cryptocurrency, keamanan digital, dan teknologi finansial terdepan di Indonesia. Bergabunglah dengan 50,000+ pembaca cerdas!`;
  }),
  ogTitle: computed(() => {
    const page = blogs.value?.meta?.current_page || 1;
    const searchTerm = searchModel.value ? ` - "${searchModel.value}"` : '';
    return page > 1 
      ? `Blog Page ${page}${searchTerm} - JasaPembayaran.com` 
      : `Blog Terbaru${searchTerm} - JasaPembayaran.com`;
  }),
  ogDescription: computed(() => {
    const page = blogs.value?.meta?.current_page || 1;
    const searchTerm = searchModel.value ? ` tentang "${searchModel.value}"` : '';
    return page > 1 
      ? `Halaman ${page} blog JasaPembayaran.com${searchTerm} - Artikel terbaru tentang pembayaran online, fintech, Bitcoin, PayPal, trading cryptocurrency, dan teknologi finansial`
      : `Blog terbaru dari JasaPembayaran.com${searchTerm} - 500+ artikel eksklusif tentang pembayaran online, fintech, Bitcoin, PayPal, trading cryptocurrency, keamanan digital, dan teknologi finansial terdepan di Indonesia`;
  }),
  twitterTitle: computed(() => {
    const page = blogs.value?.meta?.current_page || 1;
    const searchTerm = searchModel.value ? ` - "${searchModel.value}"` : '';
    return page > 1 
      ? `Blog Page ${page}${searchTerm} - JasaPembayaran.com` 
      : `Blog Terbaru${searchTerm} - JasaPembayaran.com`;
  }),
  twitterDescription: computed(() => {
    const page = blogs.value?.meta?.current_page || 1;
    const searchTerm = searchModel.value ? ` tentang "${searchModel.value}"` : '';
    return page > 1 
      ? `Halaman ${page} blog JasaPembayaran.com${searchTerm} - Artikel terbaru tentang pembayaran online, fintech, Bitcoin, PayPal, trading cryptocurrency, dan teknologi finansial`
      : `Blog terbaru dari JasaPembayaran.com${searchTerm} - 500+ artikel eksklusif tentang pembayaran online, fintech, Bitcoin, PayPal, trading cryptocurrency, keamanan digital, dan teknologi finansial terdepan di Indonesia`;
  }),
  keywords: computed(() => {
    const baseKeywords = [
      'blog JasaPembayaran',
      'artikel pembayaran online',
      'fintech Indonesia',
      'Bitcoin Indonesia',
      'PayPal Indonesia',
      'trading cryptocurrency',
      'keamanan digital',
      'teknologi finansial',
      'jasa pembayaran online',
      'cryptocurrency Indonesia',
      'blockchain Indonesia',
      'investasi digital',
      'tutorial trading',
      'panduan Bitcoin',
      'tips keamanan online'
    ];
    
    const searchTerm = searchModel.value;
    if (searchTerm) {
      baseKeywords.unshift(searchTerm, `${searchTerm} Indonesia`, `${searchTerm} tutorial`, `${searchTerm} panduan`);
    }
    
    const page = blogs.value?.meta?.current_page || 1;
    if (page > 1) {
      baseKeywords.push(`halaman ${page}`, `page ${page}`);
    }
    
    return baseKeywords.join(', ');
  })
});

// SEO: rel prev/next for blog listing (only on /blog path)
const baseListUrl = 'https://jasapembayaran.com/blog'
const current = computed(() => blogs.value?.meta?.current_page || params.value || 1)
const last = computed(() => blogs.value?.meta?.last_page || 1)
const prevHref = computed(() => {
  if (route.path !== '/blog') return null
  if (current.value <= 1) return null
  const p = current.value - 1
  return p > 1 ? `${baseListUrl}?page=${p}` : baseListUrl
})
const nextHref = computed(() => {
  if (route.path !== '/blog') return null
  if (current.value >= last.value) return null
  const p = current.value + 1
  return `${baseListUrl}?page=${p}`
})

// Pagination summary computed (range/status under pagination)
const perPage = computed(() => 8)
const currentPage = computed(() => blogs.value?.meta?.current_page || 1)
const lastPage = computed(() => blogs.value?.meta?.last_page || 1)
const currentCount = computed(() => blogs.value?.data?.length || 0)
const startIndexDisplay = computed(() => {
  const start = (currentPage.value - 1) * perPage.value + 1
  return currentCount.value > 0 ? Math.max(1, start) : 0
})
const endIndexDisplay = computed(() => {
  return currentCount.value > 0 ? startIndexDisplay.value + currentCount.value - 1 : 0
})
const estimatedTotalItems = computed(() => lastPage.value * perPage.value)
const totalItemsDisplay = computed(() => {
  if (currentCount.value === 0) return 0
  return currentPage.value === lastPage.value ? endIndexDisplay.value : estimatedTotalItems.value
})
// True total posts from API
const totalPostsDisplay = computed(() => (blogs.value?.meta as any)?.total_posts ?? 0)
// Calculate real total from current data
const realTotalFromData = computed(() => {
  if (!blogs.value?.data) return 0
  const currentDataLength = blogs.value.data.length
  const currentPage = Number(route.query.page) || 1
  const perPage = 8 // Fixed per page for blog listing
  
  // If we have less than perPage items, this is the last page
  if (currentDataLength < perPage) {
    return (currentPage - 1) * perPage + currentDataLength
  }
  
  // If we have exactly perPage items, there might be more pages
  // Estimate based on current page and data length
  if (currentDataLength === perPage) {
    // Assume there might be more pages, but be conservative
    return Math.max(currentPage * perPage, currentDataLength)
  }
  
  // Default fallback
  return currentDataLength
})
// Prefer real total from API; fallback to real calculation; final fallback to estimated
const grandTotalDisplay = computed(() => {
  if (totalPostsDisplay.value > 0) return totalPostsDisplay.value
  if (realTotalFromData.value > 0) return realTotalFromData.value
  return estimatedTotalItems.value
})

useHead(() => ({
  link: [
    ...(prevHref.value ? [{ rel: 'prev', href: prevHref.value }] : []),
    ...(nextHref.value ? [{ rel: 'next', href: nextHref.value }] : [])
  ]
}))

// Notify layout loader when blog list content is ready
const notifyBlogContentLoaded = () => {
  if (import.meta.client) {
    try { window.dispatchEvent(new Event('blog-search:loaded')) } catch {}
  }
}

watchEffect(() => {
  // console.log('📈 Blog Status:', blogStatus.value)
  // console.log('📚 Blogs Data:', blogs.value)
  if (blogStatus.value === 'success') {
    nextTick(() => notifyBlogContentLoaded())
  }
})

// Auto slide functions
const startAutoSlide = () => {
  if (slideInterval.value) clearInterval(slideInterval.value)
  slideInterval.value = setInterval(() => {
    if (isAutoSliding.value && totalSlides.value > 1) {
      currentSlide.value = (currentSlide.value + 1) % totalSlides.value
    }
  }, 3000) // 3 seconds
}

const stopAutoSlide = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

const goToSlide = (slideIndex: number) => {
  currentSlide.value = slideIndex
  stopAutoSlide()
  setTimeout(() => {
    if (isAutoSliding.value) startAutoSlide()
  }, 1000)
}

// Start auto slide when component mounts
onMounted(() => {
  if (isAutoSliding.value) startAutoSlide()
})

// Cleanup on unmount
onBeforeUnmount(() => {
  stopAutoSlide()
})

// Debug watcher for blogs data
watch(() => blogs.value, (newVal) => {
  console.log('📊 Blogs data changed:', {
    hasData: !!newVal?.data,
    dataLength: newVal?.data?.length || 0,
    isHome: isHome.value,
    isShowAllMode: isShowAllMode.value,
    displayBlogsLength: displayBlogs.value.length,
    firstBlogTitle: displayBlogs.value[0]?.title || 'N/A',
    viewLimit: viewLimit.value,
    blogStatus: blogStatus.value
  })
}, { immediate: true, deep: true })
</script>

<template>
  <div
    id="blog-page-inner"
    :class="[
      '@container blog-theme sm:gap-5 relative',
      isHome 
        ? 'py-0 px-0 bg-transparent shadow-none border-none rounded-none' 
        : 'pt-12 pb-6 px-0 sm:px-4 sm:pt-16 lg:px-6 lg:pt-20 lg:pb-14 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-700 shadow-2xl border border-yellow-300 dark:border-yellow-600 overflow-visible rounded-3xl backdrop-blur-sm'
    ]"
  >
    <!-- Super Cool Animated Background - Hidden in home mode -->
    <div v-if="!isHome" class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Subtle floating orbs with reduced blur -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute top-20 right-32 w-20 h-20 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full animate-bounce blur-sm"></div>
      <div class="absolute bottom-10 left-10 w-28 h-28 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full animate-pulse blur-sm"></div>
      <div class="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full animate-bounce blur-sm"></div>
      
      <!-- Gradient mesh overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/10 to-cyan-100/10 dark:via-blue-900/5 dark:to-cyan-900/5"></div>
      
      <!-- Animated grid pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0); background-size: 20px 20px; animation: grid-move 20s linear infinite;"></div>
      </div>
    </div>

    <div v-if="!isHome" class="text-center mb-6 sm:mb-8 relative z-10 mt-2 sm:mt-4">
      <UiTitleBase>
        <div class="flex items-center gap-2 sm:gap-4 justify-center relative z-10 px-2 sm:px-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-newspaper" class="text-yellow-200 size-6 sm:size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
          <span class="relative text-base sm:text-xl md:text-2xl font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/30">
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">✨ Blog</span> 
            <span class="text-yellow-200 drop-shadow-2xl dark:text-yellow-200 dark:drop-shadow-2xl">Terbaru</span> 
            <span class="text-white drop-shadow-2xl dark:text-white dark:drop-shadow-2xl">✨</span>
            <span class="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-lg"></span>
          </span>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full blur-sm opacity-40"></div>
            <UIcon name="i-lucide-rss" class="text-yellow-200 size-6 sm:size-8 md:size-10 relative z-10 drop-shadow-lg" />
          </div>
        </div>
      </UiTitleBase>
      
      <div class="max-w-4xl mx-auto px-3 sm:px-4 mb-3 sm:mb-4 relative z-10 mt-4 sm:mt-6">
        <div class="text-center">
          <div class="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 sm:px-5 sm:py-4 mb-3 sm:mb-4 border border-white/20">
            <p class="text-white dark:text-white text-sm sm:text-base md:text-lg leading-relaxed font-medium drop-shadow-2xl dark:drop-shadow-2xl">
              🚀 <span class="text-yellow-200 dark:text-yellow-200 font-bold">Pusat Pengetahuan Digital Terlengkap di Indonesia!</span> 🚀
            </p>
          </div>
          <div class="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 sm:px-5 sm:py-4 border border-white/20">
            <p class="text-white dark:text-white text-xs sm:text-sm md:text-base leading-relaxed drop-shadow-2xl dark:drop-shadow-2xl">
              Jelajahi lebih dari 500+ artikel eksklusif tentang teknologi pembayaran, tips keamanan digital, trading cryptocurrency, dan inovasi fintech terdepan. 
              <span class="text-yellow-200 dark:text-yellow-200 font-semibold">Bergabunglah dengan 50,000+ pembaca cerdas</span> yang selalu update dengan tren terbaru!
            </p>
          </div>
          
          <!-- SEO Benefits Section -->
          <div class="mt-5 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div class="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-sm rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 border border-blue-400/30">
              <div class="text-blue-200 font-bold text-xs sm:text-sm mb-1">📚 500+ Artikel</div>
              <div class="text-white text-xs">Konten berkualitas tinggi</div>
            </div>
            <div class="bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-sm rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 border border-green-400/30">
              <div class="text-green-200 font-bold text-xs sm:text-sm mb-1">👥 50K+ Pembaca</div>
              <div class="text-white text-xs">Komunitas aktif</div>
            </div>
            <div class="bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-sm rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 border border-purple-400/30">
              <div class="text-purple-200 font-bold text-xs sm:text-sm mb-1">⭐ 4.9/5 Rating</div>
              <div class="text-white text-xs">Kepuasan pengguna</div>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-2 mt-4">
            <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 bg-yellow-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Bar -->
    <div v-if="isLoading" class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
      <div class="h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ease-out" 
           :style="{ width: loadingProgress + '%' }"></div>
      <div class="px-4 py-2 text-center">
        <p class="text-white dark:text-white text-sm font-medium drop-shadow-lg dark:drop-shadow-lg">{{ loadingMessage }}</p>
      </div>
    </div>

    <div :class="isHome ? 'w-full' : 'w-full'">
      <div v-if="blogStatus === 'pending'">
        <div class="blog-grid" :style="gridStyle">
          <div
            v-for="i in 8"
            :key="i"
            class="skeleton-card blog-card relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800/90 border border-indigo-200/40 dark:border-indigo-600/40 h-full flex flex-col"
          >
            <!-- Animated top accent line -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 z-10 shadow-lg animate-pulse">
            </div>
            
            <!-- Corner accents -->
            <div class="absolute top-0 right-0 w-16 h-16 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl">
            </div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl">
            </div>
            
            <!-- Skeleton Image -->
            <div class="skeleton-image w-full rounded-t-2xl">
            </div>
            
            <!-- Skeleton Content -->
            <div class="blog-card-body bg-white dark:bg-gray-800 px-5 py-4 flex-grow">
              <!-- Title skeleton -->
              <div class="mb-4">
                <div class="skeleton-text w-full mb-2">
                </div>
                <div class="skeleton-text w-3/4">
                </div>
                <!-- Gradient line -->
                <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                </div>
              </div>
              
              <!-- Meta skeleton -->
              <div class="blog-card-meta flex flex-col space-y-3">
                <!-- Date skeleton -->
                <div class="flex items-center space-x-3 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 px-4 py-3 rounded-xl border-2 border-indigo-300/60 dark:border-indigo-600/60">
                  <div class="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse">
                  </div>
                  <div class="skeleton-text w-24 h-4">
                  </div>
                </div>
                
                <!-- Time skeleton -->
                <div class="flex items-center space-x-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 px-4 py-3 rounded-xl border-2 border-emerald-300/60 dark:border-emerald-600/60">
                  <div class="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse">
                  </div>
                  <div class="skeleton-text w-20 h-4">
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom accent -->
            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50">
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Show message when no blog posts are available -->
        <div v-if="!blogs?.data || blogs.data.length === 0" class="w-full text-center py-8">
          <div class="bg-white dark:bg-gray-800/90 p-6 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-900/30 max-w-2xl mx-auto">
            <UIcon name="i-lucide-info" class="text-blue-500 size-12 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Blog Sedang Dalam Pemeliharaan</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Mohon maaf, konten blog kami sedang dalam pemeliharaan dan tidak tersedia untuk sementara waktu.
              Silakan kunjungi kembali nanti untuk membaca artikel terbaru dari kami.
            </p>
            <div class="flex gap-3 justify-center">
              <button @click="refresh()" class="px-4 py-2 bg-green-500 text-white dark:text-white rounded-lg hover:bg-green-600 transition-colors drop-shadow-lg dark:drop-shadow-lg">
                🔄 Refresh Data
              </button>
            <NuxtLink to="/" class="inline-block px-4 py-2 bg-blue-500 text-white dark:text-white rounded-lg hover:bg-blue-600 transition-colors drop-shadow-lg dark:drop-shadow-lg">
              Kembali ke Home
            </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Show blog posts if available -->
        <div v-if="blogs?.data && blogs.data.length > 0" class="relative z-10 w-full">
          <!-- Debug Info -->
          <div class="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-center">
            📊 Status: {{ blogs.data.length }} artikel | Home: {{ isHome }} | ShowAll: {{ isShowAllMode }} | Limit: {{ viewLimit }}
          </div>
          
          <!-- Home Mode: Simple Grid (no slider, no pagination) -->
          <template v-if="isHome">
            <div class="blog-grid w-full" :style="gridStyle">
            <div
              v-for="(blog, i) in blogs.data.slice(0, homeLimit)"
              :key="blog.slug || blog.id"
              :data-index="i"
              @click="navigateToArticle(blog)"
              @dblclick="navigateToArticle(blog)"
              @keydown.enter="navigateToArticle(blog)"
              @keydown.space.prevent="navigateToArticle(blog)"
              tabindex="0"
              role="article"
              :aria-label="`Baca artikel: ${blog.title}`"
              class="blog-card will-animate relative overflow-hidden rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 bg-gradient-to-br from-white via-indigo-50/10 to-cyan-50/10 dark:from-gray-800 dark:via-indigo-900/10 dark:to-cyan-900/10 border border-indigo-200/40 dark:border-indigo-600/40 group h-full flex flex-col cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-2 hover:scale-[1.02]"
            >
              <!-- Top accent line -->
              <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 z-10 shadow-lg"></div>
              
              <!-- Image container -->
              <div class="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden h-48 rounded-t-2xl">
                <img
                  :src="getCardImage(blog)"
                  :alt="blog.title"
                  class="no-filter w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                  @error="onCardImgError"
                  @load="onCardImgLoad"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              <!-- Content -->
              <div class="blog-card-body bg-white dark:bg-gray-800 px-4 py-4 flex-grow">
                <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ blog.title || 'Artikel Menarik' }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <UIcon name="i-lucide-calendar-days" class="w-3 h-3" />
                  <span>{{ formatDateSafe(blog.publish_at || blog.date) }}</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {{ blog.excerpt || blog.description || '' }}
                </p>
              </div>
            </div>
          </div>
          </template>

          <!-- Show All Posts Grid (when showAll is true) -->
          <template v-else-if="isShowAllMode">
            <div class="blog-grid w-full" :style="gridStyle">
            <div class="col-span-full text-center text-sm text-blue-600 dark:text-blue-400 mb-4 font-semibold">
              📚 Menampilkan {{ Math.min(filteredBlogs?.data?.length || 0, 50) }} dari {{ filteredBlogs?.data?.length || 0 }} Artikel (Maksimal 50 untuk performa) - Diurutkan berdasarkan Tanggal Terbaru
            </div>
            <div
              v-for="(blog, i) in filteredBlogs?.data?.slice(0, 50)"
              :key="blog.slug || blog.id"
              :data-index="i"
              @click="navigateToArticle(blog)"
              @dblclick="navigateToArticle(blog)"
              @keydown.enter="navigateToArticle(blog)"
              @keydown.space.prevent="navigateToArticle(blog)"
              tabindex="0"
              role="article"
              :aria-label="`Baca artikel: ${blog.title}`"
              class="blog-card will-animate relative overflow-hidden rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 bg-gradient-to-br from-white via-indigo-50/10 to-cyan-50/10 dark:from-gray-800 dark:via-indigo-900/10 dark:to-cyan-900/10 border border-indigo-200/40 dark:border-indigo-600/40 group h-full flex flex-col cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-2 hover:scale-[1.02]"
            >
              <!-- 🌟 SUPER KEREN top accent line with gradient & glow -->
              <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 z-10 shadow-lg">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <!-- 🎨 SUPER KEREN corner accents with hover effect -->
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-800/30">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div class="absolute bottom-0 left-0 w-16 h-16 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:bg-indigo-100/80 dark:group-hover:bg-indigo-800/30">
                <div class="absolute inset-0 bg-gradient-to-tl from-indigo-400/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <!-- ✨ Sparkle effects on hover -->
              <div class="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 animate-ping"></div>
              <div class="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-ping"></div>

              <!-- 🖼️ Enhanced Image container with effects -->
              <div class="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden h-48 rounded-t-2xl group/image">
                <!-- Image with enhanced styling & multiple effects -->
                <img
                  :src="getCardImage(blog)"
                  :alt="blog.title"
                  :data-card-id="blog.slug || blog.id"
                  class="no-filter w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 filter group-hover:brightness-110"
                  loading="lazy"
                  decoding="async"
                  @error="onCardImgError"
                  @load="onCardImgLoad"
                  style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);"
                />
                
                <!-- ✨ Multi-layer overlay gradients -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <!-- 🔥 "Trending" badge with animation -->
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                    <span>🔥</span>
                    <span>Trending</span>
                  </div>
                </div>
                
                <!-- ⚡ Read indicator -->
                <div class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                  <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <UIcon name="i-lucide-eye" class="w-3 h-3" />
                    <span>Klik untuk Baca</span>
                  </div>
                </div>
                
                <!-- Blog icon removed as requested -->
                
                <!-- Clean Fallback placeholder -->
                <div class="fallback-placeholder absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center" style="display: none;">
                  <div class="text-center text-gray-500 dark:text-gray-400">
                    <div class="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-500 rounded-xl flex items-center justify-center">
                      <UIcon name="i-lucide-image" class="text-white dark:text-white text-lg drop-shadow-lg dark:drop-shadow-lg" />
                    </div>
                    <p class="text-xs font-medium">Gambar Artikel</p>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="blog-card-body bg-white dark:bg-gray-800 px-4 py-4 text-black dark:text-white flex-grow relative z-10">
                <!-- Article Title with Full Text Display -->
                <div class="mb-4 group/title">
                  <h3 
                    class="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 relative overflow-hidden transition-all duration-300"
                    style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4;"
                  >
                    <!-- Enhanced text with better contrast -->
                    <span class="relative z-10 transition-all duration-500 group-hover/title:text-transparent group-hover/title:bg-clip-text group-hover/title:bg-gradient-to-r group-hover/title:from-blue-600 group-hover/title:via-cyan-600 group-hover/title:to-pink-600 font-bold text-gray-900 dark:text-white">
                      {{ blog.title || 'Artikel Menarik' }}
                    </span>
                    <!-- Shimmer effect overlay -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/title:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <!-- Glow effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-pink-500/20 opacity-0 group-hover/title:opacity-100 blur-sm transition-all duration-500"></div>
                  </h3>
                  
                  <!-- Enhanced gradient line with animation -->
                  <div class="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-pink-500 rounded-full transform -translate-x-full group-hover/title:translate-x-0 transition-transform duration-700 ease-out"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-500 to-blue-500 rounded-full transform translate-x-full group-hover/title:translate-x-0 transition-transform duration-700 ease-out delay-200"></div>
                  </div>
                  
                  <!-- Click indicator -->
                  <div class="absolute top-0 right-0 opacity-0 group-hover/title:opacity-100 transition-opacity duration-300">
                    <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <UIcon name="i-lucide-maximize-2" class="w-3 h-3 text-white dark:text-white drop-shadow-lg dark:drop-shadow-lg" />
                    </div>
                  </div>
                </div>
                
                <!-- Title popup removed as cards are now fully clickable -->
                
                <!-- Enhanced Meta information with Vibrant Colors -->
                <div class="blog-card-meta flex flex-col space-y-3">
                  <!-- Date with vibrant styling -->
                  <div class="flex items-center space-x-3 bg-gradient-to-r from-indigo-100 via-cyan-100 to-pink-100 dark:from-indigo-900/40 dark:via-cyan-900/40 dark:to-pink-900/40 px-4 py-3 rounded-xl border-2 border-indigo-300/60 dark:border-indigo-600/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/meta">
                    <div class="w-4 h-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full shadow-md animate-pulse"></div>
                    <UIcon name="i-lucide-calendar-days" class="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover/meta:scale-110 transition-transform duration-300" />
                    <span class="font-bold text-sm text-indigo-800 dark:text-indigo-200 group-hover/meta:text-indigo-900 dark:group-hover/meta:text-indigo-100 transition-colors duration-300">
                      {{ formatDateSafe(blog.publish_at) || '30 September 2025' }}
                    </span>
                  </div>
                  
                  <!-- Time with vibrant styling -->
                  <div class="flex items-center space-x-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 px-4 py-3 rounded-xl border-2 border-emerald-300/60 dark:border-emerald-600/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/meta">
                    <div class="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-md animate-pulse"></div>
                    <UIcon name="i-lucide-clock" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover/meta:scale-110 transition-transform duration-300" />
                    <span class="font-bold text-sm text-emerald-800 dark:text-emerald-200 group-hover/meta:text-emerald-900 dark:group-hover/meta:text-emerald-100 transition-colors duration-300">
                      {{ formatTimeSafe(blog.publish_at) || '3:04 PM' }}
                    </span>
                  </div>
                </div>
                
                <!-- Super Cool Read more button -->
                <div class="mt-4 text-center">
                  <div class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white dark:text-white text-sm font-bold rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 relative overflow-hidden drop-shadow-lg dark:drop-shadow-lg">
                    <!-- Animated background -->
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <!-- Shimmer effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <span class="relative z-10">Baca Artikel</span>
                    <UIcon name="i-lucide-arrow-right" class="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              <!-- Enhanced bottom accent with glow effect -->
              <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"></div>
              
              <!-- 🌈 Subtle border glow on hover with gradient -->
              <div class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/50 dark:group-hover:border-blue-400/50 transition-all duration-300 pointer-events-none"></div>
              
              <!-- ✨ Floating particles on hover (decorative) -->
              <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div class="absolute w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 top-1/4 left-1/4 animate-ping"></div>
                <div class="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 top-3/4 right-1/3 animate-ping"></div>
                <div class="absolute w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 bottom-1/4 right-1/4 animate-ping"></div>
              </div>
              
              <!-- 🎯 Overall card shadow glow effect -->
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
          </template>

          <!-- Blog Page Grid Layout (default pagination view) - Direct Grid like Homepage -->
          <div v-else>
            <!-- Test: Show first blog for debugging -->
            <div v-if="displayBlogs.length > 0" class="mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded text-center text-sm">
              ✅ Rendering {{ displayBlogs.length }} artikel... (First: {{ displayBlogs[0]?.title?.substring(0, 30) || 'N/A' }})
            </div>
            <!-- Debug: Show if no data -->
            <div v-if="displayBlogs.length === 0" class="col-span-full p-4 bg-red-100 dark:bg-red-900/20 rounded text-center mb-4">
              ⚠️ No data: displayBlogs.length = {{ displayBlogs.length }}, blogs?.data = {{ blogs?.data ? 'exists' : 'null' }}
            </div>
            <!-- Force render grid if data exists - ALWAYS SHOW IF DATA EXISTS -->
            <div 
              v-if="displayBlogs.length > 0"
              class="blog-grid w-full" 
              :style="{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                width: '100%',
                minHeight: '200px'
              }"
              style="display: grid !important; width: 100% !important; min-height: 200px !important; grid-template-columns: repeat(4, 1fr) !important; gap: 20px !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 10 !important;"
            >
            <div
              v-for="(blog, i) in displayBlogs"
              :key="`blog-${blog.slug || blog.id || i}`"
              :data-index="i"
              @click="navigateToArticle(blog)"
              @dblclick="navigateToArticle(blog)"
              @keydown.enter="navigateToArticle(blog)"
              @keydown.space.prevent="navigateToArticle(blog)"
              tabindex="0"
              role="article"
              :aria-label="`Baca artikel: ${blog.title}`"
              class="blog-card will-animate relative overflow-hidden rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 bg-white dark:bg-gray-800 border-2 border-indigo-200/40 dark:border-indigo-600/40 group h-full flex flex-col cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-2 hover:scale-[1.02]"
              style="min-height: 300px !important; opacity: 1 !important; visibility: visible !important; display: flex !important; background: white !important; z-index: 1 !important; position: relative !important;"
            >
              <!-- 🌟 Enhanced top accent line with gradient & glow -->
              <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 z-10 shadow-lg">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </div>
              
              <!-- 🎨 Clean corner accents with hover effect -->
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-50/60 dark:bg-blue-900/20 rounded-bl-2xl transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-800/30"></div>
              <div class="absolute bottom-0 left-0 w-16 h-16 bg-indigo-50/60 dark:bg-indigo-900/20 rounded-tr-2xl transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:bg-indigo-100/80 dark:group-hover:bg-indigo-800/30"></div>
              
              <!-- ✨ Sparkle effects on hover -->
              <div class="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 animate-ping"></div>
              <div class="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-ping"></div>

              <!-- 🖼️ Enhanced Image container with effects -->
              <div class="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden h-48 rounded-t-2xl group/image">
                <!-- Image with enhanced styling & multiple effects -->
                <img
                  :src="getCardImage(blog)"
                  :alt="blog.title"
                  :data-card-id="blog.slug || blog.id"
                  class="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 filter group-hover:brightness-110"
                  loading="eager"
                  decoding="async"
                  @error="onCardImgError"
                  @load="onCardImgLoad"
                  style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);"
                />
                
                <!-- ✨ Multi-layer overlay gradients -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <!-- 🔥 "Trending" badge with animation -->
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                    <span>🔥</span>
                    <span>Trending</span>
                  </div>
                </div>
                
                <!-- ⚡ Read indicator -->
                <div class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                  <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <UIcon name="i-lucide-eye" class="w-3 h-3" />
                    <span>Klik untuk Baca</span>
                  </div>
                </div>
                
                <!-- Clean Fallback placeholder -->
                <div class="fallback-placeholder absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center" style="display: none;">
                  <div class="text-center text-gray-500 dark:text-gray-400">
                    <div class="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-500 rounded-xl flex items-center justify-center">
                      <UIcon name="i-lucide-image" class="text-white dark:text-white text-lg drop-shadow-lg dark:drop-shadow-lg" />
                    </div>
                    <p class="text-xs font-medium">Gambar Artikel</p>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="blog-card-body bg-white dark:bg-gray-800 px-5 py-4 text-black dark:text-white flex-grow relative z-10">
                <!-- Article Title with Super Cool Hover Effects -->
                <div class="mb-4 group/title">
                  <h3 
                    class="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 relative overflow-hidden"
                    :title="blog.title"
                    style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4;"
                  >
                    <!-- Animated background gradient on hover -->
                    <span class="relative z-10 transition-all duration-500 group-hover/title:text-transparent group-hover/title:bg-clip-text group-hover/title:bg-gradient-to-r group-hover/title:from-blue-600 group-hover/title:via-purple-600 group-hover/title:to-pink-600">
                      {{ blog.title || 'Artikel Menarik' }}
                    </span>
                    <!-- Shimmer effect overlay -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/title:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <!-- Glow effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-pink-500/20 opacity-0 group-hover/title:opacity-100 blur-sm transition-all duration-500"></div>
                  </h3>
                  <!-- Enhanced gradient line with animation -->
                  <div class="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transform -translate-x-full group-hover/title:translate-x-0 transition-transform duration-700 ease-out"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transform translate-x-full group-hover/title:translate-x-0 transition-transform duration-700 ease-out delay-200"></div>
                  </div>
                </div>
                
                <!-- Enhanced Meta information with Vibrant Colors -->
                <div class="blog-card-meta flex flex-col space-y-3">
                  <!-- Date with vibrant styling -->
                  <div class="flex items-center space-x-3 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40 px-4 py-3 rounded-xl border-2 border-indigo-300/60 dark:border-indigo-600/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/meta">
                    <div class="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md animate-pulse"></div>
                    <UIcon name="i-lucide-calendar-days" class="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover/meta:scale-110 transition-transform duration-300" />
                    <span class="font-bold text-sm text-indigo-800 dark:text-indigo-200 group-hover/meta:text-indigo-900 dark:group-hover/meta:text-indigo-100 transition-colors duration-300">
                      {{ formatDateSafe(blog.publish_at) || '30 September 2025' }}
                    </span>
                  </div>
                  
                  <!-- Time with vibrant styling -->
                  <div class="flex items-center space-x-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 px-4 py-3 rounded-xl border-2 border-emerald-300/60 dark:border-emerald-600/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/meta">
                    <div class="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-md animate-pulse"></div>
                    <UIcon name="i-lucide-clock" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover/meta:scale-110 transition-transform duration-300" />
                    <span class="font-bold text-sm text-emerald-800 dark:text-emerald-200 group-hover/meta:text-emerald-900 dark:group-hover/meta:text-emerald-100 transition-colors duration-300">
                      {{ formatTimeSafe(blog.publish_at) || '3:04 PM' }}
                    </span>
                  </div>
                </div>
        
                <!-- Super Cool Read more button -->
                <div class="mt-3 text-center">
                  <div class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white dark:text-white text-sm font-bold rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 relative overflow-hidden drop-shadow-lg dark:drop-shadow-lg">
                    <!-- Animated background -->
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <!-- Shimmer effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <span class="relative z-10">Baca Artikel</span>
                    <UIcon name="i-lucide-arrow-right" class="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              <!-- Enhanced bottom accent with glow effect -->
              <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"></div>
              
              <!-- 🌈 Subtle border glow on hover with gradient -->
              <div class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/50 dark:group-hover:border-blue-400/50 transition-all duration-300 pointer-events-none"></div>
              
              <!-- ✨ Floating particles on hover (decorative) -->
              <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div class="absolute w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 top-1/4 left-1/4 animate-ping"></div>
                <div class="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 top-3/4 right-1/3 animate-ping"></div>
                <div class="absolute w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 bottom-1/4 right-1/4 animate-ping"></div>
              </div>
              
              <!-- 🎯 Overall card shadow glow effect -->
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
            </div>
            </div>
          </div>
          
          <!-- Pagination - Modern Design -->
          <div v-if="!isShowAllMode && blogs?.meta && blogs.meta.last_page > 1" class="mt-8 mb-6 w-full">
            <div class="w-full max-w-7xl mx-auto px-4">
              <!-- Quick Search Above Pagination -->
              <div class="mb-6">
                <div class="bg-white/95 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border border-purple-200/60 dark:border-purple-700/40 shadow-xl p-4 md:p-5">
                  <div class="flex flex-col gap-4 md:flex-row md:items-center">
                    <div class="flex items-center gap-3 text-purple-800 dark:text-purple-100 font-semibold">
                      <div class="p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 text-white shadow-lg">
                        <UIcon name="i-lucide-search" class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="text-sm uppercase tracking-wide text-purple-500 dark:text-purple-300 font-bold">Cari Cepat</p>
                        <p class="text-base">Temukan artikel sebelum pindah halaman</p>
                      </div>
                    </div>
                    <div class="relative flex-1">
                      <input
                        v-model="searchModel"
                        @keyup.enter="performSearch"
                        placeholder="Ketik judul atau topik artikel..."
                        class="w-full h-12 rounded-2xl border-2 border-purple-200/60 dark:border-purple-600/60 bg-white/90 dark:bg-gray-800/80 px-4 pr-28 text-gray-900 dark:text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400/60"
                      />
                      <button
                        @click="performSearch"
                        class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-purple-500/40 transition-all duration-200 hover:scale-105"
                      >
                        Cari
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Page Info Text (Above Pagination) -->
              <div class="text-center mb-4">
                <div class="inline-flex items-center gap-2 text-white dark:text-white text-sm md:text-base font-medium">
                  <span>Halaman</span>
                  <span class="px-3 py-1.5 rounded-xl bg-blue-600/90 dark:bg-blue-600/90 text-white font-bold shadow-md">
                    {{ blogs.meta.current_page }}
                  </span>
                  <span>dari</span>
                  <span class="px-3 py-1.5 rounded-xl bg-purple-600/90 dark:bg-purple-600/90 text-white font-bold shadow-md">
                    {{ blogs.meta.last_page }}
                  </span>
                </div>
              </div>

              <!-- Pagination Container -->
              <div class="bg-purple-900/80 dark:bg-purple-900/90 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-2xl border border-white/30 dark:border-white/20">
                <nav class="flex items-center justify-center gap-2 md:gap-3 flex-wrap" role="navigation" aria-label="Navigasi halaman">
                  <!-- Previous Button -->
                  <button
                    @click="goToPreviousPage"
                    :disabled="blogs.meta.current_page <= 1"
                    class="group px-4 py-2.5 md:px-6 md:py-3 rounded-2xl bg-purple-800/70 dark:bg-purple-800/80 hover:bg-purple-700/90 dark:hover:bg-purple-700/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white font-semibold text-sm md:text-base border border-white/20 dark:border-white/20 hover:border-white/40"
                    :class="{ 'opacity-50 cursor-not-allowed': blogs.meta.current_page <= 1 }"
                    aria-label="Halaman sebelumnya"
                  >
                    <UIcon name="i-lucide-chevron-left" class="w-4 h-4 md:w-5 md:h-5" />
                    <span class="hidden sm:inline">Sebelumnya</span>
                  </button>

                  <!-- Page Numbers -->
                  <div class="flex items-center gap-2 md:gap-3">
                    <template v-for="(it, idx) in desktopPages" :key="'d-'+idx+'-'+it">
                      <span
                        v-if="typeof it !== 'number'"
                        class="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white/70 dark:text-white/70 select-none font-bold text-base md:text-lg"
                        aria-hidden="true"
                        role="separator"
                      >{{ it }}</span>
                      <button
                        v-else
                        @click="changePage(Number(it))"
                        class="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold text-base md:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 hover:scale-105 transform"
                        :class="Number(it) === blogs.meta.current_page
                          ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 text-white shadow-lg shadow-blue-500/40 scale-105'
                          : 'bg-purple-800/70 dark:bg-purple-800/80 hover:bg-purple-700/90 dark:hover:bg-purple-700/90 text-white border border-white/20 dark:border-white/20 hover:border-white/40'"
                        :aria-current="Number(it) === blogs.meta.current_page ? 'page' : undefined"
                        :aria-label="'Halaman ' + it"
                      >
                        {{ it }}
                      </button>
                    </template>
                  </div>

                  <!-- Next Button -->
                  <button
                    @click="goToNextPage"
                    :disabled="blogs.meta.current_page >= blogs.meta.last_page"
                    class="group px-4 py-2.5 md:px-6 md:py-3 rounded-2xl bg-purple-800/70 dark:bg-purple-800/80 hover:bg-purple-700/90 dark:hover:bg-purple-700/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white font-semibold text-sm md:text-base border border-white/20 dark:border-white/20 hover:border-white/40"
                    :class="{ 'opacity-50 cursor-not-allowed': blogs.meta.current_page >= blogs.meta.last_page }"
                    aria-label="Halaman selanjutnya"
                  >
                    <span class="hidden sm:inline">Berikutnya</span>
                    <UIcon name="i-lucide-chevron-right" class="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Super Cool Search Box -->
        <div class="mt-8 w-full">
          <div class="w-full max-w-7xl mx-auto px-4 relative search-container">
            <div class="bg-gradient-to-r from-white/95 via-blue-50/95 to-cyan-50/95 dark:from-gray-800/95 dark:via-blue-900/95 dark:to-cyan-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-blue-200/60 dark:border-blue-700/60 hover:shadow-blue-400/30 dark:hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden">
              <!-- Animated Background -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-400/10 dark:to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-400/10 dark:to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div class="relative z-10">
                <!-- Search Header -->
                <div class="text-center mb-6">
                  <div class="flex items-center justify-center gap-3 mb-3">
                    <div class="p-3 bg-gradient-to-br from-blue-500 via-cyan-600 to-indigo-600 dark:from-emerald-400 dark:via-cyan-500 dark:to-blue-500 rounded-2xl shadow-lg">
                      <UIcon name="i-lucide-search" class="w-6 h-6 text-white" />
                    </div>
                    <h3 class="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-pink-600 bg-clip-text text-transparent">
                      🔍 Pencarian Artikel
                    </h3>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
                    Temukan artikel terbaru dan terpopuler
                  </p>
                </div>
              
              <!-- Search Input -->
              <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/50 overflow-hidden">
                  <input
                    v-model="searchModel"
                    @input="onSearchInput"
                    @focus="showSearchDropdown = true"
                    @keyup.enter="performSearch"
                    placeholder="🔍 Cari artikel blog terbaru..."
                    class="w-full h-14 pl-6 pr-20 text-gray-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-gray-700 dark:placeholder:text-gray-300 text-lg font-medium"
                  />
                  <button
                    @click="performSearch"
                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-cyan-500 to-pink-500 hover:from-blue-600 hover:via-cyan-600 hover:to-pink-600 text-white dark:text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl drop-shadow-lg dark:drop-shadow-lg"
                  >
                    Cari
                  </button>
                </div>
              </div>

                      <!-- Enhanced Category Filter -->
                      <div class="category-filter mt-6">
                        <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                          <UIcon name="i-lucide-filter" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          Filter Kategori & Topik
                        </h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          <button
                            v-for="category in enhancedCategories"
                            :key="category.id"
                            @click="selectCategory(category.id)"
                            :class="[
                              'px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2',
                              selectedCategory === category.id
                                ? `bg-gradient-to-r ${category.color} text-white dark:text-white shadow-lg scale-105`
                                : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            ]"
                          >
                            <span class="text-sm">{{ category.icon }}</span>
                            <span class="truncate">{{ category.name }}</span>
                            <span v-if="selectedCategory === category.id" class="ml-1 text-xs">✓</span>
                          </button>
                        </div>
                        
                        <!-- Quick Filter Buttons -->
                        <div class="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          <h5 class="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Filter Cepat:</h5>
                          <div class="flex flex-wrap gap-2">
                            <button
                              @click="selectCategory('trending')"
                              :class="[
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                                selectedCategory === 'trending'
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              ]"
                            >
                              🔥 Trending
                            </button>
                            <button
                              @click="selectCategory('newest')"
                              :class="[
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                                selectedCategory === 'newest'
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              ]"
                            >
                              🆕 Terbaru
                            </button>
                            <button
                              @click="selectCategory('popular')"
                              :class="[
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                                selectedCategory === 'popular'
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              ]"
                            >
                              ⭐ Populer
                            </button>
                            <button
                              @click="selectCategory('all')"
                              :class="[
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                                selectedCategory === 'all'
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              ]"
                            >
                              📚 Semua
                            </button>
                          </div>
                        </div>
                      </div>
              
                <!-- Search Suggestions & History -->
                <div v-if="showSearchDropdown" class="mt-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden z-50">
                <!-- Search History -->
                <div v-if="searchHistory.length > 0 && !searchModel" class="p-4">
                  <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-history" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Pencarian Terakhir
                  </h4>
                  <div class="space-y-2">
                    <button
                      v-for="(term, index) in searchHistory.slice(0, 5)"
                      :key="index"
                      @click="searchModel = term; performSearch()"
                      class="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {{ term }}
                    </button>
                  </div>
                </div>
                
                <!-- Search Suggestions -->
                <div v-if="searchSuggestions.length > 0" class="p-4">
                  <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-lightbulb" class="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Saran Pencarian ({{ searchSuggestions.length }} hasil)
                  </h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <button
                      v-for="(suggestion, index) in searchSuggestions.slice(0, 12)"
                      :key="index"
                      @click="searchModel = suggestion; performSearch()"
                      class="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors duration-200 hover:text-cyan-700 dark:hover:text-cyan-300"
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
                
                <!-- Popular Searches -->
                <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Pencarian Populer ({{ popularSearches.length }} pilihan)
                  </h4>
                  <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    <button
                      v-for="(term, index) in popularSearches"
                      :key="index"
                      @click="searchModel = term; performSearch()"
                      class="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 rounded-full hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-800/40 dark:hover:to-cyan-800/40 transition-all duration-200 hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      {{ term }}
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced View Options -->
        <div class="mt-10 w-full">
          <!-- Vibrant View Options -->
          <div class="flex justify-center mb-8 px-4">
            <div class="w-full max-w-7xl bg-gradient-to-br from-white via-cyan-50/80 to-blue-50/60 dark:from-slate-900/95 dark:via-blue-900/80 dark:to-indigo-900/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-cyan-200/60 dark:border-blue-700/50 hover:shadow-cyan-400/30 dark:hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden">
              <!-- Animated Background -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-400/10 dark:to-blue-500/10 rounded-full blur-3xl"></div>
              
              <div class="relative z-10">
                <!-- Header -->
                <div class="flex items-center justify-center gap-4 mb-6">
                  <div class="p-3 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 dark:from-emerald-400 dark:via-cyan-500 dark:to-blue-500 rounded-2xl shadow-lg">
                    <UIcon name="i-lucide-layout-grid" class="w-6 h-6 text-white" />
                  </div>
                  <span class="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Tampilkan Artikel:
                  </span>
                </div>
                
                <!-- View Options Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 justify-center mb-6">
                  <button
                    v-for="option in viewOptions"
                    :key="option"
                    @click="changeViewLimit(option)"
                    class="group relative px-4 py-3 md:py-4 rounded-2xl text-sm md:text-base font-bold transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    :class="viewLimit === option 
                      ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white shadow-2xl hover:shadow-emerald-500/30 dark:hover:shadow-cyan-500/30 border-2 border-emerald-400/50 dark:border-cyan-400/50' 
                      : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-cyan-100 hover:to-blue-100 dark:hover:from-emerald-900/40 dark:hover:via-cyan-900/40 dark:hover:to-blue-900/40 border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-300/60 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300'"
                  >
                    <!-- Shimmer effect for active button -->
                    <div v-if="viewLimit === option" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <!-- Icon for each option -->
                    <div class="flex items-center justify-center gap-2">
                      <UIcon 
                        :name="option === 'all' ? 'i-lucide-infinity' : 'i-lucide-hash'"
                        class="w-4 h-4"
                        :class="viewLimit === option ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'"
                      />
                      <span class="relative z-10">{{ viewLabels[option as keyof typeof viewLabels] }}</span>
                    </div>
                  </button>
                </div>
                
                <!-- Status Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <!-- Total Articles -->
                  <div class="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-100/90 to-teal-100/90 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl border-2 border-emerald-200/60 dark:border-emerald-700/60 hover:border-emerald-400/80 dark:hover:border-emerald-500/80 transition-all duration-300">
                    <div class="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                      <UIcon name="i-lucide-database" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm md:text-base font-bold text-emerald-900 dark:text-emerald-100">
                      Total: {{ grandTotalDisplay }} artikel tersedia
                    </span>
                  </div>
                  
                  <!-- Search Info -->
                  <div class="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-100/90 to-blue-100/90 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-2xl border-2 border-cyan-200/60 dark:border-cyan-700/60 hover:border-cyan-400/80 dark:hover:border-cyan-500/80 transition-all duration-300">
                    <div class="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                      <UIcon name="i-lucide-search" class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-xs md:text-sm font-medium text-cyan-800 dark:text-cyan-200">
                      Database lengkap tersedia untuk pencarian
                    </span>
                  </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    @click="changeViewLimit(24)"
                    class="group flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900/40 dark:to-cyan-900/40 text-indigo-800 dark:text-indigo-200 rounded-xl border-2 border-indigo-200/60 dark:border-indigo-700/60 hover:from-indigo-200 hover:to-cyan-200 dark:hover:from-indigo-800/60 dark:hover:to-cyan-800/60 hover:border-indigo-400/80 dark:hover:border-indigo-500/80 transition-all duration-300 hover:scale-105"
                  >
                    <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>📊 24 ke bawah</span>
                  </button>
                  <button
                    @click="changeViewLimit(0)"
                    class="group flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-200 rounded-xl border-2 border-green-200/60 dark:border-green-700/60 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/60 dark:hover:to-emerald-800/60 hover:border-green-400/80 dark:hover:border-green-500/80 transition-all duration-300 hover:scale-105"
                  >
                    <UIcon name="i-lucide-star" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>🌟 Lihat Semua</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LazyStarsBg />
</template>

<style scoped>
/* Blog grid styles are now in blog-responsive-improvements.css */

/* Ensure content is not cut off by rounded corners */
#blog-page-inner {
  overflow: visible !important;
}

#blog-page-inner > * {
  position: relative;
  z-index: 1;
}

/* Responsive padding adjustments */
@media (max-width: 640px) {
  #blog-page-inner {
    padding-top: 3rem !important;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  #blog-page-inner {
    padding-top: 4rem !important;
  }
}

@media (min-width: 1025px) {
  #blog-page-inner {
    padding-top: 5rem !important;
  }
}

/* Super Cool Animations */
@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20px, 20px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.5); }
}

/* Enhanced blog card animations */
.blog-card {
  animation: float 6s ease-in-out infinite;
}

.blog-card:nth-child(2n) {
  animation-delay: 1s;
}

.blog-card:nth-child(3n) {
  animation-delay: 2s;
}

.blog-card:nth-child(4n) {
  animation-delay: 3s;
}

/* Optional variant: force 4 cols on small screens (<=480px) with compact text/padding */
@media (max-width: 480px) {
  .news-grid--force-4-mobile {
    grid-template-columns: repeat(4, 1fr) !important;
  }
  .news-grid--force-4-mobile .news-card-body {
    padding: 8px !important;
  }
  .news-grid--force-4-mobile .news-card-title {
    font-size: 12px;
    line-height: 1.2;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    max-height: 1.2em;
  }
  .news-grid--force-4-mobile .news-card-meta {
    font-size: 10px;
  }
}

/* Blog card styles are now in blog-responsive-improvements.css */

/* Mobile Optimization untuk Blog Articles - SUPER KEREN */
@media (max-width: 768px) {
  .blog-card {
    border-radius: 1rem !important;
    border-width: 2px !important;
    margin-bottom: 1rem !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  .blog-card:hover {
    transform: translateY(-1px) scale(1.01) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  }
  
  .blog-card .blog-card-body {
    padding: 1rem !important;
  }
  
  .blog-card h3 {
    font-size: 1rem !important;
    line-height: 1.4 !important;
    margin-bottom: 0.75rem !important;
  }
  
  .blog-card .blog-card-meta {
    gap: 0.75rem !important;
  }
  
  .blog-card .blog-card-meta > div {
    padding: 0.75rem !important;
    border-radius: 0.75rem !important;
  }
  
  .blog-card .blog-card-meta span {
    font-size: 0.75rem !important;
  }
  
  .blog-card .blog-card-meta .w-5 {
    width: 1rem !important;
    height: 1rem !important;
  }
  
  .blog-card .blog-card-meta .w-4 {
    width: 0.75rem !important;
    height: 0.75rem !important;
  }
  
  /* Image optimization for mobile */
  .blog-card .group\/image {
    height: 12rem !important;
  }
  
  .blog-card .group\/image img {
    height: 12rem !important;
  }
  
  /* Button optimization for mobile */
  .blog-card .inline-flex {
    padding: 0.5rem 1rem !important;
    font-size: 0.75rem !important;
  }
  
  /* Grid optimization for mobile */
  .blog-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    width: 100% !important;
  }
  
  /* Header optimization for mobile */
  .blog-theme h1 {
    font-size: 1.5rem !important;
  }
  
  .blog-theme p {
    font-size: 0.875rem !important;
  }
  
  /* Stats grid optimization for mobile */
  .blog-theme .grid.grid-cols-3 {
    grid-template-columns: 1fr !important;
    gap: 0.75rem !important;
  }
  
  .blog-theme .grid.grid-cols-3 > div {
    padding: 0.75rem !important;
    text-align: center !important;
  }
}

/* Tablet Optimization */
@media (min-width: 769px) and (max-width: 1024px) {
  .blog-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.25rem !important;
    width: 100% !important;
  }
  
  .blog-card {
    border-radius: 1.25rem !important;
  }
}

/* Desktop Optimization */
@media (min-width: 1025px) {
  .blog-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 1.5rem !important;
    width: 100% !important;
  }
  
  .blog-card {
    border-radius: 1.5rem !important;
  }
}

/* Extra Large Desktop */
@media (min-width: 1280px) {
  .blog-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 1.75rem !important;
    width: 100% !important;
  }
}


/* Hide scrollbar utility (works on most browsers) */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Holo lift effect for pagination buttons */
.pagination-btn {
  position: relative;
  transform: translateY(0) scale(1);
  transition: transform 180ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms ease, background-color 220ms ease, border-color 220ms ease;
  will-change: transform, box-shadow;
}

.pagination-btn:hover:not(:disabled),
.pagination-btn:focus-visible:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 8px 20px rgba(59, 130, 246, 0.25),
    0 0 0 2px rgba(59, 130, 246, 0.15),
    0 0 16px rgba(167, 139, 250, 0.25),
    0 2px 0 rgba(255, 255, 255, 0.5) inset;
}

.pagination-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(0.99);
  box-shadow:
    0 6px 16px rgba(59, 130, 246, 0.22),
    0 0 0 2px rgba(59, 130, 246, 0.12),
    0 0 12px rgba(34, 211, 238, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.45) inset;
}

/* Subtle holo aura */
.pagination-btn::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(from 180deg at 50% 50%, #0ea5e9, #06b6d4, #0284c7, #0891b2);
  opacity: 0;
  filter: blur(12px);
  transition: opacity 200ms ease, filter 200ms ease;
  pointer-events: none;
  z-index: -1;
}

.pagination-btn:hover::before,
.pagination-btn:focus-visible::before {
  opacity: 0.6;
  filter: blur(14px);
}

/* Reduce glow in dark mode a bit */
.dark .pagination-btn:hover:not(:disabled),
.dark .pagination-btn:focus-visible:not(:disabled) {
  box-shadow:
    0 10px 24px rgba(59, 130, 246, 0.18),
    0 0 0 2px rgba(59, 130, 246, 0.18),
    0 0 16px rgba(167, 139, 250, 0.22),
    0 2px 0 rgba(255, 255, 255, 0.06) inset;
}

/* Lift + holo glow for news cards */
.news-card {
  position: relative;
  backface-visibility: hidden;
  transform: translateY(0) scale(1);
  transition: transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 260ms ease, border-color 200ms ease, background-color 200ms ease;
  will-change: transform, box-shadow;
}

.news-card:hover,
.news-card:focus-visible {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 18px 40px rgba(59, 130, 246, 0.18),
    0 8px 24px rgba(2, 6, 23, 0.06);
}

.news-card:active {
  transform: translateY(-2px) scale(0.995);
}

/* Subtle holo aura for news cards */
.news-card::before {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  background: conic-gradient(from 180deg at 50% 50%, #0ea5e9, #06b6d4, #0284c7, #0891b2);
  opacity: 0;
  filter: blur(20px);
  transition: opacity 220ms ease, filter 220ms ease;
  pointer-events: none;
  z-index: -1;
}

.news-card:hover::before,
.news-card:focus-visible::before {
  opacity: 0.55;
  filter: blur(22px);
}

/* Dark mode tuning for card shadows */
.dark .news-card:hover,
.dark .news-card:focus-visible {
  box-shadow:
    0 20px 44px rgba(30, 64, 175, 0.18),
    0 10px 28px rgba(2, 6, 23, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  .news-card {
    transition: box-shadow 260ms ease;
  }
  .news-card:hover,
  .news-card:focus-visible,
  .news-card:active {
    transform: none;
  }
}

/* Enhanced text styling for better readability */
.text-shadow-sm {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.blog-card-title {
  font-weight: 700;
  letter-spacing: -0.025em;
}

.blog-card-meta {
  font-weight: 500;
}

/* Enhanced blog card styling */
.blog-card {
  position: relative;
  backface-visibility: hidden;
  transform: translateY(0) scale(1);
  transition: transform 300ms cubic-bezier(.2,.7,.2,1), box-shadow 350ms ease, border-color 250ms ease, background-color 250ms ease;
  will-change: transform, box-shadow;
}

.blog-card:hover,
.blog-card:focus-visible {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 25px 50px rgba(59, 130, 246, 0.15),
    0 12px 30px rgba(2, 6, 23, 0.08),
    0 0 0 1px rgba(59, 130, 246, 0.1);
}

.blog-card:active {
  transform: translateY(-3px) scale(1.01);
}

/* Subtle holo aura for blog cards */
.blog-card::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(from 180deg at 50% 50%, #3b82f6, #0ea5e9, #06B6D4, #3b82f6, #EC4899);
  opacity: 0;
  filter: blur(8px);
  transition: opacity 300ms ease, filter 300ms ease;
  pointer-events: none;
  z-index: -1;
}

.blog-card:hover::before,
.blog-card:focus-visible::before {
  opacity: 0.2;
  filter: blur(10px);
}

/* Dark mode tuning for blog card shadows */
.dark .blog-card:hover,
.dark .blog-card:focus-visible {
  box-shadow:
    0 28px 56px rgba(30, 64, 175, 0.12),
    0 14px 35px rgba(2, 6, 23, 0.15),
    0 0 0 1px rgba(59, 130, 246, 0.15);
}

/* Enhanced text gradient for titles */
.text-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Enhanced shadow utilities */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Improved loading states */
.loading-placeholder {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>



