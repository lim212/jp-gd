<template>
  <div class="rw-blog-page">
    <BlogReadingProgressBar />

    <section class="rw-hero" v-if="blog?.data">
      <nav class="rw-breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/blog">Blog</NuxtLink>
        <span>/</span>
        <span>{{ heroTitle }}</span>
      </nav>
      <div class="rw-title-frame">
        <h1 class="rw-title">{{ heroTitle }}</h1>
      </div>
    </section>

    <figure v-if="blog?.data" class="rw-featured">
      <img :src="heroImageUrl" :alt="heroTitle" @error="handleHeroError" />
      <figcaption>{{ articleSummary }}</figcaption>
    </figure>

    <div v-if="blog?.data" class="rw-inline-meta">
      <div class="rw-inline-info">
        <div class="rw-meta-item rw-meta-author">
          <Icon name="mdi:account-group" size="18" />
          <span>Penulis: <strong>{{ authorName }}</strong></span>
        </div>
        <span class="rw-dot"></span>
        <div class="rw-meta-item">
          <Icon name="mdi:calendar-clock" size="16" />
          <time>{{ formatDateWithTime(blog?.data?.publish_at) }}</time>
        </div>
        <span class="rw-dot"></span>
        <div class="rw-meta-item">
          <Icon name="mdi:clock-outline" size="16" />
          <span>{{ readingTime }}</span>
        </div>
        <span class="rw-dot"></span>
        <div class="rw-meta-item">
          <Icon name="mdi:tag" size="16" />
          <span>{{ tags[0]?.name || 'Fintech' }}</span>
        </div>
      </div>
      <div class="rw-inline-share">
        <span class="rw-inline-share-label">
          <Icon name="mdi:share-variant" size="16" />
          <span>Bagikan:</span>
        </span>
        <div class="rw-share-buttons">
          <a :href="`https://wa.me/628988888250?text=${encodeURIComponent(heroTitle + ' - ' + currentUrl)}`" target="_blank" rel="noopener" class="rw-share-btn rw-whatsapp" title="Share via WhatsApp">
            <Icon name="mdi:whatsapp" size="20" />
          </a>
          <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`" target="_blank" rel="noopener" class="rw-share-btn rw-facebook" title="Share ke Facebook">
            <Icon name="mdi:facebook" size="20" />
          </a>
          <a :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(heroTitle)}`" target="_blank" rel="noopener" class="rw-share-btn rw-twitter" title="Share ke Twitter/X">
            <Icon name="mdi:twitter" size="20" />
          </a>
          <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(heroTitle)}`" target="_blank" rel="noopener" class="rw-share-btn rw-linkedin" title="Share ke LinkedIn">
            <Icon name="mdi:linkedin" size="20" />
          </a>
          <a :href="`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(heroTitle)}`" target="_blank" rel="noopener" class="rw-share-btn rw-telegram" title="Share ke Telegram">
            <Icon name="mdi:telegram" size="20" />
          </a>
          <button @click="copyArticleLink" :class="['rw-share-btn', 'rw-copy', { 'rw-copied': linkCopied }]" :title="linkCopied ? 'Link disalin!' : 'Copy link'">
            <Icon :name="linkCopied ? 'mdi:check-circle' : 'mdi:link-variant'" size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Kembali ke Blog Button - Di bawah meta info -->
    <div v-if="blog?.data" class="rw-back-button-container">
      <NuxtLink to="/blog" class="rw-back-button-center">
        <Icon name="mdi:arrow-left" size="18" />
        <span>Kembali ke Blog</span>
      </NuxtLink>
    </div>

      <div v-if="blog?.data" class="rw-layout">
        <article class="rw-article">
          <!-- Daftar Isi & Ringkasan Cepat - Di atas konten -->
          <div v-if="blog?.data?.body" class="rw-toc-summary-compact">
            <div class="rw-toc-compact-section">
              <BlogTableOfContents :content="blog.data.body" />
            </div>
            <div class="rw-summary-compact-section" v-if="blog?.data && summaryPoints.length > 0">
              <p class="rw-summary-compact-title">Ringkasan Cepat</p>
              <ul class="rw-summary-compact-list">
                <li v-for="point in summaryPoints" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>

          <div v-if="blog?.data?.body" class="rw-article-content blog-content" v-html="blog.data.body"></div>

        <div class="rw-rating-card">
          <div class="rw-rating-header">
            <div class="rw-rating-icon">
              <Icon name="mdi:star-circle" size="32" />
            </div>
            <div class="rw-rating-title-section">
              <h3 class="rw-rating-title">Bermanfaatkah Artikel Ini?</h3>
              <p class="rw-rating-subtitle">Berikan rating untuk membantu kami meningkatkan kualitas konten</p>
            </div>
          </div>
          
          <div class="rw-rating-display">
            <div class="rw-rating-stars-container">
              <div class="rw-rating-stars">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @mouseover="setHoverRating(star)"
                  @mouseleave="clearHoverRating"
                  @click="setRating(star)"
                  :class="['rw-star', { active: star <= (hoverRating || rating || defaultRating) }]"
                  aria-label="Rate {{ star }} stars"
                >
                  <Icon :name="star <= (hoverRating || rating || defaultRating) ? 'mdi:star' : 'mdi:star-outline'" size="28" />
                </button>
              </div>
              <div class="rw-rating-score">
                <span class="rw-rating-number">{{ displayRating }}</span>
                <span class="rw-rating-total">/ 5.0</span>
              </div>
            </div>
            <div class="rw-rating-stats">
              <Icon name="mdi:account-multiple" size="18" />
              <span>{{ totalRatings }} {{ totalRatings === 1 ? 'orang' : 'orang' }} memberikan rating</span>
            </div>
          </div>
          
          <div class="rw-rating-message" v-if="ratingMessage && rating > 0">
            <Icon name="mdi:check-circle" size="20" />
            <span>{{ ratingMessage }}</span>
          </div>
        </div>

        <div class="rw-share-strip">
          <div class="rw-share-header">
            <Icon name="mdi:share-variant" size="20" />
            <span>Bagikan Artikel</span>
          </div>
          <div class="rw-share-buttons-grid">
            <a
              v-for="share in shareButtons"
              :key="share.label"
              :href="share.url"
              target="_blank"
              rel="noopener"
              :class="['rw-share-button', share.variant]"
            >
              <Icon :name="getShareIcon(share.variant)" size="20" />
              <span>{{ share.label }}</span>
            </a>
          </div>
        </div>

        <div class="rw-cta-card">
          <div class="rw-cta-background"></div>
          <div class="rw-cta-content">
            <div class="rw-cta-icon-wrapper">
              <Icon name="mdi:bitcoin" size="40" />
            </div>
            <h3>Butuh bantuan transaksi Bitcoin?</h3>
            <p>Tim kami siap mendampingi proses jual, beli, dan pembayaran lintas negara 24/7.</p>
            <div class="rw-cta-actions">
              <a href="https://wa.me/628988888250" class="rw-cta-btn-primary" target="_blank">
                <Icon name="mdi:whatsapp" size="20" />
                <span>Chat WhatsApp</span>
                <Icon name="mdi:arrow-right" size="18" />
              </a>
              <a href="/" class="rw-cta-btn-secondary">
                <Icon name="mdi:home" size="18" />
                <span>Kembali ke Home</span>
              </a>
            </div>
          </div>
        </div>

        <div class="rw-tags-section">
          <p>Kategori &amp; Tags</p>
          <div class="rw-tags">
            <span
              v-for="tag in tags"
              :key="tag.slug"
              class="rw-tag"
            >
              #{{ tag.name }}
            </span>
            <span v-if="!tags.length" class="rw-tag muted">Belum ada tag</span>
          </div>
        </div>

        <div class="rw-related-section">
          <h3>Related Post</h3>
          <BlogRelatedArticles
            v-if="blog?.data"
            :current-slug="slug"
            :current-tags="blog.data.tags || []"
            :current-categories="blog.data.categories || []"
            :limit="3"
          />
        </div>
      </article>

      <aside class="rw-sidebar">
        <div class="rw-card rw-contact-card rw-sticky-card">
          <div class="rw-contact-header">
            <div class="rw-contact-icon">
              <Icon name="mdi:message-text-outline" size="32" />
            </div>
            <p class="rw-card-label">Konsultasi</p>
          </div>
          <h4 class="rw-contact-title">Butuh bantuan langsung?</h4>
          <p class="rw-contact-description">Kami siap menjawab pertanyaan seputar transaksi Bitcoin kapan saja.</p>
          <a href="https://wa.me/628988888250" target="_blank" class="rw-btn-contact">
            <Icon name="mdi:whatsapp" size="20" />
            <span>Hubungi WhatsApp</span>
            <Icon name="mdi:arrow-right" size="18" />
          </a>
        </div>


        <div class="rw-card rw-popular-card">
          <div class="rw-card-header">
            <Icon name="mdi:fire" size="20" />
            <p class="rw-card-label">POPULER</p>
          </div>
          
          <!-- Popular Posts List -->
          <div class="rw-popular-posts">
            <ul class="rw-list-numbered">
              <li v-for="(post, index) in displayedPopularPosts" :key="index">
                <span class="rw-list-number">{{ index + 1 }}</span>
                <div class="rw-list-content">
                  <NuxtLink :to="`/blog/${post.slug}`" class="rw-list-title" :title="post.title">{{ truncateText(post.title, 60) }}</NuxtLink>
                  <span class="rw-list-date">{{ formatDatePlain(post.date, post.slug) }}</span>
                </div>
              </li>
              <li v-if="!popularPosts.length" class="rw-list-empty">Memuat data...</li>
            </ul>
          </div>
          
          <button 
            v-if="popularPosts.length > 12" 
            @click="showAllPopular = !showAllPopular"
            class="rw-see-all-btn"
          >
            <span>{{ showAllPopular ? 'Tutup' : 'Lihat Semua' }}</span>
            <Icon :name="showAllPopular ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="18" />
          </button>
        </div>

        <div class="rw-card rw-latest-card">
          <div class="rw-card-header">
            <Icon name="mdi:clock-outline" size="20" />
            <p class="rw-card-label">TERBARU</p>
          </div>
          <ul class="rw-list-numbered">
            <li v-for="(post, index) in displayedLatestPosts" :key="index">
              <span class="rw-list-number">{{ index + 1 }}</span>
              <div class="rw-list-content">
                <NuxtLink :to="`/blog/${post.slug}`" class="rw-list-title" :title="post.title">{{ truncateText(post.title, 60) }}</NuxtLink>
                <span class="rw-list-date">{{ formatDatePlain(post.date, post.slug) }}</span>
              </div>
            </li>
            <li v-if="!latestPosts.length" class="rw-list-empty">Memuat data...</li>
          </ul>
          
          <button 
            v-if="latestPosts.length > 12" 
            @click="showAllLatest = !showAllLatest"
            class="rw-see-all-btn"
          >
            <span>{{ showAllLatest ? 'Tutup' : 'Lihat Semua' }}</span>
            <Icon :name="showAllLatest ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="18" />
          </button>
        </div>

        <div class="rw-card rw-tags-sidebar-card">
          <div class="rw-card-header">
            <Icon name="mdi:tag-multiple" size="20" />
            <p class="rw-card-label">TAG</p>
          </div>
          <div class="rw-tags-numbered">
            <NuxtLink
              v-for="(tag, index) in displayedTags"
              :key="tag.slug"
              :to="`/blog?tag=${tag.slug || tag.name}`"
              class="rw-tag-numbered-item"
            >
              <span class="rw-tag-number">{{ index + 1 }}</span>
              <span class="rw-tag-name">#{{ tag.name }}</span>
            </NuxtLink>
            <span v-if="!tags.length" class="rw-list-empty">Belum ada tag</span>
          </div>
          
          <button 
            v-if="tags.length > 12" 
            @click="showAllTags = !showAllTags"
            class="rw-see-all-btn"
          >
            <span>{{ showAllTags ? 'Tutup' : 'Lihat Semua' }}</span>
            <Icon :name="showAllTags ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="18" />
          </button>
        </div>

        <div class="rw-card rw-related-sidebar-card">
          <div class="rw-card-header">
            <Icon name="mdi:book-open-variant" size="20" />
            <p class="rw-card-label">ARTIKEL TERKAIT</p>
          </div>
          <div class="rw-related-list" ref="relatedListRef">
            <BlogRelatedArticles
              v-if="blog?.data"
              :current-slug="slug"
              :current-tags="blog.data.tags || []"
              :current-categories="blog.data.categories || []"
              :limit="showAllRelated ? 50 : 12"
            />
          </div>
          
          <button 
            v-if="relatedArticlesCount > 12" 
            @click="showAllRelated = !showAllRelated"
            class="rw-see-all-btn"
          >
            <span>{{ showAllRelated ? 'Tutup' : 'Lihat Semua' }}</span>
            <Icon :name="showAllRelated ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="18" />
          </button>
        </div>
      </aside>
    </div>

    <div v-else class="rw-loading">
      <div class="rw-spinner" />
      <p>Memuat artikel...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BlogReadingProgressBar from '~/components/blog/ReadingProgressBar.vue'
import BlogSocialShareButtons from '~/components/blog/SocialShareButtons.vue'
import BlogTableOfContents from '~/components/blog/TableOfContents.vue'
import BlogRelatedArticles from '~/components/blog/RelatedArticles.vue'
import { pickAuthorForSlug, isAdminLike } from '~/utils/author-pool.ts'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// List nama organisasi untuk penulis
const ORGANIZATION_NAMES = [
  'PAYTECH Indonesia', 'Digital Finance Group', 'FinTech Solutions', 'Payment Hub Asia',
  'Transaksi Digital Pro', 'Pembayaran Global', 'E-Wallet Expert', 'Cashflow Solutions',
  'Payment Gateway ID', 'Financial Tech Hub', 'Digital Payment Pro', 'Money Transfer Expert',
  'Fintech Indonesia', 'Payment Solutions', 'Digital Transaction', 'Payment Network',
  'Finance Technology', 'Payment Service Pro', 'Digital Finance', 'Transaction Hub'
]

// Fungsi untuk mengkonversi nama penulis menjadi format "NamaOrg"
function formatAuthorAsOrg(name?: string, slugValue?: string): string {
  if (!name && !slugValue) return 'PAYTECH Indonesia'
  const base = String(slugValue || name || '').trim().toLowerCase() || String(Date.now())
  const hash = base.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const idx = hash % ORGANIZATION_NAMES.length
  return ORGANIZATION_NAMES[idx] || 'PAYTECH Indonesia'
}

// Computed untuk author name dengan format "NamaOrg"
const authorName = computed(() => {
  const rawAuthor = blog.value?.data?.display_name || pickAuthorForSlug(slug.value)
  return formatAuthorAsOrg(rawAuthor, slug.value)
})

const popularPosts = ref<any[]>([])
const latestPosts = ref<any[]>([])
const imageError = ref(false)
const currentUrl = ref('https://jasapembayaran.com')
const linkCopied = ref(false)

// Show all states for each section
const showAllPopular = ref(false)
const showAllLatest = ref(false)
const showAllTags = ref(false)
const showAllRelated = ref(false)
const relatedListRef = ref<HTMLElement | null>(null)
const relatedArticlesCount = ref(0)

// Watch for related articles count changes
watch([relatedListRef, showAllRelated], () => {
  if (process.client && relatedListRef.value) {
    nextTick(() => {
      const articles = relatedListRef.value?.querySelectorAll('.article-card') || []
      relatedArticlesCount.value = articles.length
    })
  }
}, { immediate: true })

const getSSRSafeDate = () => new Date().toISOString()

const { data: blog } = useAsyncData(
  () => `blog-${slug.value}`,
  async () => {
    try {
      const post = await $fetch(`/api/blog/${slug.value}`)
      if (post) {
        return { data: normalizePost(post) }
      }
    } catch (error) {
      console.error('API blog error:', error)
    }

    return {
      data: {
        title: formatSlug(slug.value),
        display_name: pickAuthorForSlug(slug.value),
        publish_at: getSSRSafeDate(),
        body: buildFallbackBody(slug.value),
        seo_decription: `Panduan lengkap tentang ${formatSlug(slug.value)}`,
        featured_image: '/images/fallback-news.svg',
        image: '/images/fallback-news.svg',
        latest_tags: buildDefaultTags(slug.value)
      }
    }
  },
  { watch: [slug] }
)

const rawTitle = computed(() => blog.value?.data?.title || formatSlug(slug.value))
const heroTitle = computed(() => cleanHeadline(rawTitle.value))
const seoTitle = computed(() => truncateTitle(heroTitle.value, 60))
const articleSummary = computed(() => {
  const desc = blog.value?.data?.seo_decription || blog.value?.data?.description
  if (desc) return truncate(desc, 165)
  const text = blog.value?.data?.body?.replace(/<[^>]*>/g, ' ') || ''
  return truncate(text, 165)
})

const heroImageUrl = computed(() => {
  if (imageError.value) return '/images/fallback-news.svg'
  return blog.value?.data?.image || blog.value?.data?.featured_image || '/images/fallback-news.svg'
})

const tags = computed(() => blog.value?.data?.latest_tags || [])

// Displayed items with show all functionality
const displayedPopularPosts = computed(() => {
  const limit = showAllPopular.value ? 50 : 12
  return popularPosts.value.slice(0, limit)
})

const displayedLatestPosts = computed(() => {
  const limit = showAllLatest.value ? 50 : 12
  return latestPosts.value.slice(0, limit)
})

const displayedTags = computed(() => {
  const limit = showAllTags.value ? 50 : 12
  return tags.value.slice(0, limit)
})

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
const wordCount = computed(() => {
  if (!blog.value?.data?.body) return 0
  return blog.value.data.body.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
})
const readingTime = computed(() => {
  if (!wordCount.value) return '3 menit'
  const minutes = Math.max(1, Math.ceil(wordCount.value / 200))
  return `${minutes} menit`
})
const summaryPoints = computed(() => {
  const highlights = [
    'Ringkasan strategi implementasi Bitcoin untuk bisnis lintas negara.',
    'Checklist keamanan: KYC, travel rule, dan bukti hash blockchain.',
    'Tips cashflow agar volatilitas harga tidak mengganggu operasional.'
  ]
  const tagHints = tags.value.slice(0, 2).map((tag) => `Bahas topik ${tag.name} dengan studi kasus praktis.`)
  return [...highlights, ...tagHints].slice(0, 4)
})

// Generate random default rating (4-5 stars) based on slug for consistency
const defaultRating = computed(() => {
  const slugHash = slug.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return 4 + (slugHash % 2) // 4 or 5 stars
})

// Calculate total ratings (simulated - in production, this would come from backend)
const totalRatings = computed(() => {
  const slugHash = slug.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return 12 + (slugHash % 8) // Random between 12-19
})

// Display rating (user rating or default)
const displayRating = computed(() => {
  if (rating.value > 0) {
    // If user rated, show average of user rating and default
    const avg = ((rating.value + defaultRating.value * totalRatings.value) / (totalRatings.value + 1)).toFixed(1)
    return avg
  }
  return defaultRating.value.toFixed(1)
})

const rating = ref(0)
const hoverRating = ref(0)
const ratingMessage = ref('')

const setRating = (value: number) => {
  rating.value = value
  if (value > 0) {
    ratingMessage.value = `Terima kasih! Anda memberikan rating ${value} bintang.`
    // In production, save to backend here
    if (process.client) {
      localStorage.setItem(`rating-${slug.value}`, value.toString())
    }
  }
}

const setHoverRating = (value: number) => {
  hoverRating.value = value
}

const clearHoverRating = () => {
  hoverRating.value = 0
}


const shareButtons = computed(() => {
  const encodedUrl = encodeURIComponent(currentUrl.value)
  const title = encodeURIComponent(heroTitle.value)
  return [
    {
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      variant: 'facebook'
    },
    {
      label: 'Twitter/X',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`,
      variant: 'twitter'
    },
    {
      label: 'WhatsApp',
      url: `https://wa.me/628988888250?text=${title}%20${encodedUrl}`,
      variant: 'whatsapp'
    },
    {
      label: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${title}`,
      variant: 'linkedin'
    }
  ]
})

const getShareIcon = (variant: string) => {
  const icons: Record<string, string> = {
    facebook: 'mdi:facebook',
    twitter: 'mdi:twitter',
    whatsapp: 'mdi:whatsapp',
    linkedin: 'mdi:linkedin'
  }
  return icons[variant] || 'mdi:share-variant'
}

const handleHeroError = () => {
  imageError.value = true
}

const formatDatePlain = (dateString?: string, postSlug?: string) => {
  // Generate consistent random time based on slug or dateString
  const hashSource = postSlug || dateString || String(Date.now())
  const hash = hashSource.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const randomHour = hash % 24
  const randomMinute = (hash * 7) % 60
  
  if (!dateString) {
    // Generate random time if no date
    const hour12 = randomHour % 12 || 12
    const ampm = randomHour >= 12 ? 'PM' : 'AM'
    const timeStr = `${String(hour12).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}${ampm} WIB`
    return `Tanggal diperbarui otomatis ${timeStr}`
  }
  
  const date = new Date(dateString)
  const dateStr = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  
  // Get time from date or generate random
  let timeStr = ''
  try {
    // Check if date has valid time (not just date)
    const timeValue = date.getTime()
    if (timeValue && !isNaN(timeValue)) {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      // Only use actual time if it's not midnight (00:00) which might be default
      if (hours !== 0 || minutes !== 0) {
        const hour12 = hours % 12 || 12
        const ampm = hours >= 12 ? 'PM' : 'AM'
        timeStr = `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${ampm} WIB`
      } else {
        // Use random time if time is 00:00 (likely default)
        const hour12 = randomHour % 12 || 12
        const ampm = randomHour >= 12 ? 'PM' : 'AM'
        timeStr = `${String(hour12).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}${ampm} WIB`
      }
    } else {
      // Invalid date, use random time
      const hour12 = randomHour % 12 || 12
      const ampm = randomHour >= 12 ? 'PM' : 'AM'
      timeStr = `${String(hour12).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}${ampm} WIB`
    }
  } catch {
    // Error parsing date, use random time
    const hour12 = randomHour % 12 || 12
    const ampm = randomHour >= 12 ? 'PM' : 'AM'
    timeStr = `${String(hour12).padStart(2, '0')}:${String(randomMinute).padStart(2, '0')}${ampm} WIB`
  }
  
  return `${dateStr} ${timeStr}`
}

const formatDateWithTime = (dateString?: string) => {
  if (!dateString) return 'Tanggal diperbarui otomatis'
  const date = new Date(dateString)
  const dateStr = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const timeStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  return `${dateStr} ${timeStr} WIB`
}

async function loadSidebarData() {
  try {
    const [popular, latest] = await Promise.all([
      $fetch('/api/blog/popular'),
      $fetch('/api/blog/latest')
    ])

    if ((popular as any)?.success) {
      popularPosts.value = (popular as any).posts || []
    }

    if ((latest as any)?.success) {
      latestPosts.value = (latest as any).posts || []
    }
  } catch (error) {
    console.error('Sidebar fetch error:', error)
  }
}

async function copyArticleLink() {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

onMounted(() => {
  loadSidebarData()
  if (process.client && typeof window !== 'undefined') {
    currentUrl.value = window.location.href
    // Load saved rating
    const saved = localStorage.getItem(`rating-${slug.value}`)
    if (saved) {
      rating.value = parseInt(saved, 10)
    }
  }
})

watch(slug, () => {
  loadSidebarData()
  // Load saved rating when slug changes
  if (process.client && typeof window !== 'undefined') {
    const saved = localStorage.getItem(`rating-${slug.value}`)
    if (saved) {
      rating.value = parseInt(saved, 10)
    } else {
      rating.value = 0
    }
  }
})

useHead({
  title: seoTitle,
  meta: [
    {
      name: 'description',
      content: articleSummary.value
    }
  ]
})

function normalizePost(post: any) {
  // Get author from post, but replace JasaPembayaran.com Team with random author
  let author = post.author || post.display_name || ''
  if (!author || author.includes('JasaPembayaran') || isAdminLike(author)) {
    author = pickAuthorForSlug(post.slug || slug.value)
  }
  
  return {
    title: post.title,
    display_name: author,
    publish_at: post.date || post.publish_at || getSSRSafeDate(),
    body: post.content,
    seo_decription: post.excerpt || post.meta_description,
    featured_image: post.image || post.featured_image,
    image: post.image || post.featured_image,
    latest_tags: Array.isArray(post?.tags)
      ? post.tags.map((name: string) => ({
          name,
          slug: String(name || '').toLowerCase().replace(/\s+/g, '-'),
          link: `https://blog.jasapembayaran.com/tag/${String(name || '').toLowerCase().replace(/\s+/g, '-')}`
        }))
      : []
  }
}

function formatSlug(value?: string) {
  if (!value) return 'Artikel Terbaru'
  return value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildFallbackBody(value: string) {
  const readable = formatSlug(value)
  return `
    <p>Selamat datang di panduan lengkap ${readable}. Artikel ini merangkum definisi, manfaat, dan langkah implementasi agar bisnis Anda bisa memanfaatkan Bitcoin dengan aman.</p>
    <h2>Kenapa Penting?</h2>
    <p>${readable} membantu pelaku usaha melakukan pembayaran lintas negara tanpa menunggu jam kerja bank. Dengan likuiditas 24/7, Anda bisa menjaga arus kas tetap stabil.</p>
    <h2>Langkah Singkat</h2>
    <ol>
      <li>Pilih partner jasa Bitcoin yang legal.</li>
      <li>Lakukan KYC sederhana dan siapkan rekening penampung.</li>
      <li>Tentukan limit transaksi dan kurs yang disetujui.</li>
      <li>Eksekusi order lalu simpan bukti hash blockchain.</li>
    </ol>
  `
}

function buildDefaultTags(value: string) {
  const readable = formatSlug(value)
  return [
    { name: readable, slug: value, link: `#${value}` },
    { name: 'Tips', slug: 'tips', link: '#tips' },
    { name: 'Bitcoin', slug: 'bitcoin', link: '#bitcoin' }
  ]
}

function truncate(text: string, max = 165) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max).trim()}…`
}

function truncateTitle(text: string, max = 60) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}…`
}

function cleanHeadline(input?: string) {
  let text = String(input || '').replace(/\s+/g, ' ').trim()
  if (!text) return 'Artikel Terbaru JasaPembayaran.com'
  
  // Remove leading "s " prefix if present
  text = text.replace(/^s\s+/i, '')
  
  // Remove "Tips " prefix if present
  text = text.replace(/^Tips\s+/i, '')
  
  // Remove repeated "agar Lebih Aman" pattern (case insensitive, multiple repetitions)
  text = text.replace(/\s*(agar\s+lebih\s+aman\s*){2,}/gi, ' ')
  text = text.replace(/\s*agar\s+lebih\s+aman\s*/gi, ' ')
  
  // Remove duplicate sequential words
  const segments = text.split(' ')
  const filtered: string[] = []
  let last = ''
  segments.forEach((word) => {
    const wordLower = word.toLowerCase().replace(/[",:]/g, '')
    const lastLower = last.toLowerCase().replace(/[",:]/g, '')
    if (wordLower === lastLower || wordLower === '') {
      return
    }
    filtered.push(word)
    last = word
  })
  
  // Clean up quotes and extra spaces
  text = filtered.join(' ').replace(/\s+"/g, ' "').replace(/"\s+/g, '" ').replace(/\s{2,}/g, ' ').trim()
  
  // Remove leading/trailing quotes if present
  text = text.replace(/^["']+|["']+$/g, '')
  
  return text || 'Artikel Terbaru JasaPembayaran.com'
}
</script>

<style scoped>
.rw-blog-page {
  background: #f4f6fb;
  min-height: 100vh;
  padding: 3rem 1rem 4rem;
}

.rw-hero {
  max-width: 960px;
  margin: 0 auto 1.5rem;
  text-align: center;
  padding-top: 6rem;
  padding-bottom: 1rem;
  scroll-margin-top: 6rem;
}

.rw-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #6b7280;
  justify-content: center;
}

.rw-breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.rw-title-frame {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 2.5rem auto 1.5rem;
  padding: 1.25rem 2rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.9));
  border: 1px solid rgba(99, 102, 241, 0.25);
  box-shadow:
    0 12px 35px rgba(79, 70, 229, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  overflow: hidden;
  width: fit-content;
  max-width: 90%;
}

.rw-title-frame::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(59, 130, 246, 0.08), rgba(236, 72, 153, 0.08));
  pointer-events: none;
}

.rw-title {
  position: relative;
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  margin: 0;
  color: #0f172a;
  letter-spacing: 0.01em;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.rw-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6b7280;
}

.rw-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0.6;
  flex-shrink: 0;
  align-self: center;
}

.rw-featured {
  max-width: 960px;
  margin: 0 auto 2rem;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
}

.rw-featured img {
  display: block;
  width: 100%;
  height: auto;
}

.rw-featured figcaption {
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: #6b7280;
}

.rw-inline-meta {
  max-width: 960px;
  margin: 0 auto 2.5rem;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(99, 102, 241, 0.1);
  box-shadow: 
    0 20px 40px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(99, 102, 241, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.rw-inline-meta:hover {
  box-shadow: 
    0 25px 50px rgba(15, 23, 42, 0.12),
    0 0 0 1px rgba(99, 102, 241, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

.rw-inline-meta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 20px 20px 0 0;
}

.rw-inline-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #475569;
  flex: 1;
}

.rw-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.06));
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.rw-meta-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.5s ease;
}

.rw-meta-item:hover::before {
  left: 100%;
}

.rw-meta-item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.1));
  border-color: rgba(99, 102, 241, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.rw-meta-item :deep(svg) {
  color: #667eea;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2));
  transition: all 0.3s ease;
}

.rw-meta-item:hover :deep(svg) {
  color: #5b21b6;
  transform: scale(1.1);
  filter: drop-shadow(0 2px 6px rgba(99, 102, 241, 0.3));
}

.rw-meta-item.rw-meta-author {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.08));
  border-color: rgba(59, 130, 246, 0.2);
}

.rw-meta-item.rw-meta-author :deep(svg) {
  color: #3b82f6;
}

.rw-meta-item.rw-meta-author:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.12));
}

.rw-meta-item strong {
  color: #0f172a;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.rw-inline-info span,
.rw-inline-info time {
  display: inline-flex;
  align-items: center;
  color: #475569;
}

.rw-inline-share {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.rw-inline-share-label {
  font-weight: 700;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(139, 92, 246, 0.08));
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.15);
}

.rw-inline-share-label :deep(svg) {
  color: #667eea;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
}

.rw-share-buttons {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.rw-share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: white;
  font-size: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rw-share-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.rw-share-btn:hover::before {
  width: 300px;
  height: 300px;
}

.rw-share-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.rw-share-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.rw-share-btn :deep(svg) {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
}

.rw-share-btn:hover :deep(svg) {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.rw-whatsapp {
  background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.rw-whatsapp:hover {
  background: linear-gradient(135deg, #20ba5a 0%, #1da851 100%);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
}

.rw-facebook {
  background: linear-gradient(135deg, #1877f2 0%, #166fe5 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.rw-facebook:hover {
  background: linear-gradient(135deg, #166fe5 0%, #1460d1 100%);
  box-shadow: 0 8px 20px rgba(24, 119, 242, 0.4);
}

.rw-twitter {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.rw-twitter:hover {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.rw-linkedin {
  background: linear-gradient(135deg, #0077b5 0%, #006399 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.rw-linkedin:hover {
  background: linear-gradient(135deg, #006399 0%, #005580 100%);
  box-shadow: 0 8px 20px rgba(0, 119, 181, 0.4);
}

.rw-telegram {
  background: linear-gradient(135deg, #0088cc 0%, #0077b3 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.rw-telegram:hover {
  background: linear-gradient(135deg, #0077b3 0%, #0066a0 100%);
  box-shadow: 0 8px 20px rgba(0, 136, 204, 0.4);
}

.rw-copy {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

.rw-copy:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  box-shadow: 0 8px 20px rgba(107, 114, 128, 0.4);
}

.rw-copy.rw-copied {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

@media (max-width: 640px) {
  .rw-hero {
    padding-top: 5rem;
  }

  .rw-title-frame {
    padding: 1rem 1.5rem;
    margin-top: 1.5rem;
    max-width: 95%;
  }

  .rw-title {
    font-size: clamp(1.25rem, 5vw, 1.75rem);
    line-height: 1.4;
  }

  .rw-inline-meta {
    border-radius: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .rw-inline-info {
    width: 100%;
  }

  .rw-inline-share {
    margin-left: 0;
    width: 100%;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .rw-inline-share-label {
    width: 100%;
    justify-content: center;
    padding: 0.625rem 1rem;
  }

  .rw-share-buttons {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .rw-share-btn {
    width: 44px;
    height: 44px;
  }
}

.rw-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 2rem;
  align-items: start;
}

.rw-article {
  background: white;
  border-radius: 18px;
  padding: 2.25rem;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);
}


.rw-summary-eyebrow {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #7c3aed;
  margin-bottom: 0.75rem;
}

.rw-summary-list {
  margin: 0;
  padding-left: 1.25rem;
  color: #4338ca;
  line-height: 1.6;
}

.rw-summary-list li {
  margin-bottom: 0.35rem;
}

.rw-toc-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.rw-toc-label {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #6b7280;
}

.rw-toc-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.rw-toc-summary-compact {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 200px;
  align-self: start;
}

.rw-toc-compact-section {
  font-size: 0.85rem;
}

.rw-toc-compact-section :deep(.toc-container-center) {
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
}

.rw-toc-compact-section :deep(.toc-nav-center) {
  padding: 0;
}

.rw-toc-compact-section :deep(.toc-nav-center a) {
  font-size: 0.75rem;
  padding: 0.4rem 0.5rem;
}

.rw-toc-compact-section :deep(.toc-nav-center h3) {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.rw-toc-compact-section :deep(.toc-container-center .border-t) {
  display: none;
}

.rw-summary-compact-section {
  padding: 0.75rem;
  background: linear-gradient(135deg, #fdf2f8, #eef2ff);
  border-radius: 8px;
  font-size: 0.8rem;
}

.rw-summary-compact-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #667eea;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.rw-summary-compact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.rw-summary-compact-list li {
  font-size: 0.75rem;
  line-height: 1.4;
  color: #475569;
  padding-left: 1rem;
  position: relative;
}

.rw-summary-compact-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.rw-article-content {
  line-height: 1.8;
  font-size: 1.05rem;
  color: #1f2937;
}

:deep(.blog-content h2),
:deep(.blog-content h3) {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #0f172a;
}

:deep(.blog-content p) {
  margin-bottom: 1.25rem;
}

:deep(.blog-content ul),
:deep(.blog-content ol) {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
  padding-left: 0.5rem;
}

.rw-tags-section {
  border-top: 1px solid #e5e7eb;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  display: block;
}

.rw-tags-section p {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.rw-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.rw-tag {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.rw-tag:hover {
  background: #eef2ff;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
}

.rw-tag.muted {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #e5e7eb;
  cursor: default;
}

.rw-tag.muted:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #6b7280;
  transform: none;
}

.rw-cta-card {
  margin-top: 3rem;
  padding: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rw-cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.rw-cta-content {
  position: relative;
  z-index: 1;
  padding: 2.5rem;
  text-align: center;
}

.rw-cta-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.rw-cta-card h3 {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.rw-cta-card p {
  font-size: 1.05rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  line-height: 1.6;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.rw-cta-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.rw-cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: white;
  color: #2563eb;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.rw-cta-btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
  transition: left 0.5s ease;
}

.rw-cta-btn-primary:hover::before {
  left: 100%;
}

.rw-cta-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  background: #f8f9ff;
}

.rw-cta-btn-primary :deep(svg) {
  flex-shrink: 0;
}

.rw-cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.rw-cta-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.rw-cta-btn-secondary :deep(svg) {
  flex-shrink: 0;
}

.rw-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  visibility: visible;
  padding-top: 0;
  min-height: 100px;
  overflow: visible;
}

.rw-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  display: block;
  visibility: visible;
  opacity: 1;
  border: 1px solid #e5e7eb;
}

.rw-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.rw-card-header :deep(svg) {
  color: #667eea;
  flex-shrink: 0;
}

.rw-card-label {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #0f172a;
  margin: 0;
  font-weight: 700;
}

.rw-sticky-card {
  position: sticky;
  z-index: 10;
}

.rw-contact-card.rw-sticky-card {
  top: 0;
  align-self: flex-start;
  margin-top: 0;
  margin-bottom: 0;
}

.rw-toc-summary-card.rw-sticky-card {
  top: calc(100px + 200px);
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  margin-bottom: 0;
}

.rw-contact-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
  border: none;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  align-self: flex-start;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.rw-contact-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.rw-contact-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.rw-contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.rw-contact-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.rw-contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.rw-contact-card:hover .rw-contact-icon {
  transform: scale(1.1) rotate(5deg);
  background: rgba(255, 255, 255, 0.3);
}

.rw-contact-card .rw-card-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.rw-contact-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.rw-contact-description {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.rw-btn-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  color: #667eea;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.rw-btn-contact::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.rw-btn-contact:hover::before {
  left: 100%;
}

.rw-btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  background: #f8f9ff;
}

.rw-btn-contact:active {
  transform: translateY(0);
}

.rw-btn-contact span {
  font-weight: 700;
}

.rw-popular-card,
.rw-latest-card,
.rw-tags-sidebar-card,
.rw-related-sidebar-card {
  overflow: hidden;
  display: block !important;
  visibility: visible !important;
  transition: all 0.3s ease;
}

.rw-popular-card:hover,
.rw-latest-card:hover,
.rw-tags-sidebar-card:hover,
.rw-related-sidebar-card:hover {
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}


.rw-toc-summary-card::-webkit-scrollbar {
  width: 4px;
}

.rw-toc-summary-card::-webkit-scrollbar-track {
  background: transparent;
}

.rw-toc-summary-card::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.rw-back-button-container {
  max-width: 960px;
  margin: 0 auto 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rw-back-button-center {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 999px;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.rw-back-button-center::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.rw-back-button-center:hover::before {
  left: 100%;
}

.rw-back-button-center:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.rw-back-button-center:active {
  transform: translateY(0);
}

.rw-toc-section {
  margin-bottom: 1rem;
  padding: 0;
}

.rw-summary-section {
  padding: 1rem;
  background: linear-gradient(135deg, #fdf2f8, #eef2ff);
  border-radius: 8px;
  margin-top: 1rem;
}

.rw-summary-section .rw-summary-eyebrow {
  margin-bottom: 0.75rem;
}

.rw-summary-section .rw-summary-list {
  font-size: 0.85rem;
}

.rw-popular-posts {
  margin-top: 0;
  display: block;
}

.rw-tags-sidebar-card {
  margin-top: 0;
  display: block !important;
  visibility: visible !important;
}

.rw-tags-numbered {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.rw-tag-numbered-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.rw-tag-numbered-item:last-child {
  border-bottom: none;
}

.rw-tag-numbered-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.rw-tag-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.rw-tag-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.85rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rw-see-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.rw-see-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.rw-see-all-btn:active {
  transform: translateY(0);
}

.rw-see-all-btn :deep(svg) {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.rw-see-all-btn:hover :deep(svg) {
  transform: translateY(2px);
}

.rw-related-sidebar-card {
  margin-top: 0;
  display: block !important;
  visibility: visible !important;
}

.rw-related-list :deep(.related-articles-section) {
  margin: 0;
  padding: 0;
  border-top: none;
}

.rw-related-list :deep(.section-header) {
  display: none;
}

.rw-related-list :deep(.articles-grid) {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rw-related-list :deep(.article-card) {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  transition: all 0.2s ease;
  position: relative;
  padding-left: 2.5rem;
}

.rw-related-list {
  counter-reset: related-counter;
  margin-top: 0.75rem;
}

.rw-related-list :deep(.article-card) {
  counter-increment: related-counter;
}

.rw-related-list :deep(.article-card::before) {
  content: counter(related-counter);
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 6px;
  z-index: 1;
}

.rw-related-list :deep(.article-card:hover) {
  background: #f8fafc;
  border-color: #667eea;
  transform: translateX(4px);
}

.rw-related-list :deep(.image-container) {
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 6px;
  overflow: hidden;
}

.rw-related-list :deep(.article-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rw-related-list :deep(.content-container) {
  flex: 1;
  min-width: 0;
}

.rw-related-list :deep(.article-title) {
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
  color: #0f172a;
}

.rw-related-list :deep(.article-excerpt) {
  display: none;
}

.rw-related-list :deep(.read-more-link) {
  display: none;
}

.rw-related-list :deep(.tags-list) {
  display: none;
}

.rw-related-list :deep(.category-badge) {
  display: none;
}

.rw-related-list :deep(.image-overlay) {
  display: none;
}

.rw-related-list :deep(.article-meta) {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.rw-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rw-list-numbered {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rw-list-numbered li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.rw-list-numbered li:last-child {
  border-bottom: none;
}

.rw-list-numbered li:hover {
  background: #f8fafc;
  border-radius: 6px;
}

.rw-list-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.rw-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.rw-list-title {
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  transition: color 0.2s ease;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rw-list-title:hover {
  color: #667eea;
}

.rw-list-date {
  font-size: 0.8rem;
  color: #6b7280;
}

.rw-list span {
  font-size: 0.85rem;
  color: #6b7280;
}

.rw-list-empty {
  color: #94a3b8;
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
}

.rw-info-grid {
  max-width: 960px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.rw-info-card {
  background: white;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.rw-info-label {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.rw-info-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.rw-info-card span {
  font-size: 0.85rem;
  color: #94a3b8;
}

.rw-rating-card {
  border-top: 2px solid #e5e7eb;
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
  position: relative;
  overflow: hidden;
}

.rw-rating-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #facc15 0%, #f59e0b 50%, #eab308 100%);
}

.rw-rating-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.rw-rating-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(250, 204, 21, 0.3);
}

.rw-rating-title-section {
  flex: 1;
}

.rw-rating-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.rw-rating-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.rw-rating-display {
  margin-bottom: 1.5rem;
}

.rw-rating-stars-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.rw-rating-stars {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.rw-star {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.rw-star:hover {
  transform: scale(1.15);
  background: rgba(250, 204, 21, 0.1);
}

.rw-star.active {
  color: #facc15;
}

.rw-star :deep(svg) {
  filter: drop-shadow(0 2px 4px rgba(250, 204, 21, 0.3));
}

.rw-star.active :deep(svg) {
  filter: drop-shadow(0 2px 8px rgba(250, 204, 21, 0.5));
}

.rw-rating-score {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.rw-rating-number {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.rw-rating-total {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
}

.rw-rating-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
  padding: 0.75rem;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 8px;
}

.rw-rating-stats :deep(svg) {
  color: #667eea;
}

.rw-rating-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 8px;
  color: #166534;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 1rem;
}

.rw-rating-message :deep(svg) {
  color: #16a34a;
  flex-shrink: 0;
}

.rw-share-strip {
  margin-top: 3rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
}

.rw-share-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
}

.rw-share-header :deep(svg) {
  color: #667eea;
}

.rw-share-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.rw-share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

.rw-share-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.rw-share-button:hover::before {
  left: 100%;
}

.rw-share-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.rw-share-button :deep(svg) {
  flex-shrink: 0;
}

.rw-share-button.facebook {
  background: linear-gradient(135deg, #1877f2 0%, #166fe5 100%);
}

.rw-share-button.facebook:hover {
  background: linear-gradient(135deg, #166fe5 0%, #1460d1 100%);
}

.rw-share-button.twitter {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
}

.rw-share-button.twitter:hover {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.rw-share-button.whatsapp {
  background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
}

.rw-share-button.whatsapp:hover {
  background: linear-gradient(135deg, #20ba5a 0%, #1da851 100%);
}

.rw-share-button.linkedin {
  background: linear-gradient(135deg, #0077b5 0%, #006399 100%);
}

.rw-share-button.linkedin:hover {
  background: linear-gradient(135deg, #006399 0%, #005580 100%);
}

.rw-related-section {
  margin-top: 2.5rem;
  display: block;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.rw-related-section h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #0f172a;
  font-weight: 700;
}

.rw-btn {
  border-radius: 999px;
  padding: 0.65rem 1.4rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rw-btn.primary {
  background: #2563eb;
  color: white;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
}

.rw-btn.ghost {
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: white;
}

.rw-btn.block {
  width: 100%;
}

.rw-btn:hover {
  transform: translateY(-2px);
}

.rw-loading {
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;
}

.rw-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .rw-content-sidebar-sticky {
    position: relative;
    top: auto;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .rw-blog-page {
    padding: 1.5rem 0.75rem 2rem;
  }

  .rw-hero {
    padding-top: 4.5rem;
    padding-bottom: 0.5rem;
    scroll-margin-top: 4.5rem;
    margin-bottom: 1rem;
  }

  .rw-breadcrumb {
    font-size: 0.8rem;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .rw-title-frame {
    padding: 0.875rem 1.25rem;
    margin: 1.5rem auto 1rem;
    max-width: 98%;
    border-radius: 16px;
  }

  .rw-title {
    font-size: clamp(1.1rem, 4.5vw, 1.5rem);
    line-height: 1.4;
    padding: 0;
  }

  .rw-featured {
    margin: 0 auto 1.5rem;
    border-radius: 12px;
  }

  .rw-featured figcaption {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }

  .rw-inline-meta {
    margin: 0 auto 1.5rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .rw-inline-info {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .rw-meta-item {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
    flex: 1 1 auto;
    min-width: fit-content;
  }

  .rw-meta-item :deep(svg) {
    size: 14px;
  }

  .rw-dot {
    display: none;
  }

  .rw-inline-share {
    margin-left: 0;
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .rw-inline-share-label {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0.875rem;
    font-size: 0.85rem;
  }

  .rw-share-buttons {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .rw-share-btn {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .rw-back-button-container {
    margin: 0 auto 1.5rem;
    padding: 0 0.5rem;
  }

  .rw-back-button-center {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    justify-content: center;
  }

  .rw-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0;
  }

  .rw-article {
    padding: 1.25rem 1rem;
    border-radius: 12px;
    order: 1;
  }

  .rw-toc-summary-compact {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }

  .rw-toc-compact-section {
    order: 1;
  }

  .rw-toc-compact-section :deep(.toc-nav-center a) {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
  }

  .rw-summary-compact-section {
    order: 2;
    padding: 0.875rem;
  }

  .rw-summary-compact-title {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .rw-summary-compact-list li {
    font-size: 0.75rem;
    line-height: 1.5;
    padding-left: 0.875rem;
  }

  .rw-article-content {
    font-size: 1rem;
    line-height: 1.75;
  }

  :deep(.blog-content h2),
  :deep(.blog-content h3) {
    margin-top: 2rem;
    margin-bottom: 0.875rem;
    font-size: 1.5rem;
  }

  :deep(.blog-content h3) {
    font-size: 1.25rem;
  }

  :deep(.blog-content p) {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.75;
  }

  :deep(.blog-content ul),
  :deep(.blog-content ol) {
    margin-left: 1.25rem;
    margin-bottom: 1rem;
    padding-left: 0.5rem;
  }

  :deep(.blog-content li) {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }

  :deep(.blog-content img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 1.5rem auto;
  }

  :deep(.blog-content blockquote) {
    padding: 1rem 1.25rem;
    margin: 1.25rem 0;
    border-left-width: 4px;
    font-size: 0.95rem;
  }

  :deep(.blog-content table) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 1.25rem 0;
    font-size: 0.9rem;
  }

  :deep(.blog-content pre) {
    padding: 1rem;
    font-size: 0.875rem;
    overflow-x: auto;
    border-radius: 8px;
  }

  :deep(.blog-content code) {
    font-size: 0.875rem;
    padding: 0.125rem 0.375rem;
    word-break: break-word;
  }

  .rw-rating-card {
    margin-top: 2rem;
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }

  .rw-rating-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: left;
  }

  .rw-rating-icon {
    width: 48px;
    height: 48px;
  }

  .rw-rating-title {
    font-size: 1.25rem;
  }

  .rw-rating-subtitle {
    font-size: 0.875rem;
  }

  .rw-rating-stars-container {
    flex-direction: column;
    gap: 1rem;
  }

  .rw-rating-stars {
    justify-content: center;
  }

  .rw-star {
    padding: 0.2rem;
  }

  .rw-star :deep(svg) {
    size: 24px;
  }

  .rw-rating-score {
    justify-content: center;
  }

  .rw-rating-number {
    font-size: 1.75rem;
  }

  .rw-rating-total {
    font-size: 1.125rem;
  }

  .rw-rating-stats {
    justify-content: center;
    font-size: 0.85rem;
    padding: 0.625rem;
  }

  .rw-share-strip {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }

  .rw-share-header {
    font-size: 0.95rem;
    margin-bottom: 0.875rem;
  }

  .rw-share-buttons-grid {
    grid-template-columns: 1fr;
    gap: 0.625rem;
  }

  .rw-share-button {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    justify-content: center;
  }

  .rw-cta-card {
    margin-top: 2rem;
    border-radius: 16px;
  }

  .rw-cta-content {
    padding: 1.5rem 1.25rem;
  }

  .rw-cta-icon-wrapper {
    width: 64px;
    height: 64px;
    margin-bottom: 1.25rem;
  }

  .rw-cta-card h3 {
    font-size: 1.375rem;
    margin-bottom: 0.625rem;
  }

  .rw-cta-card p {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .rw-cta-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .rw-cta-btn-primary,
  .rw-cta-btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .rw-tags-section {
    margin-top: 2rem;
    padding-top: 1.25rem;
  }

  .rw-tags-section p {
    font-size: 0.95rem;
    margin-bottom: 0.625rem;
  }

  .rw-tags {
    gap: 0.5rem;
    margin-top: 0.625rem;
  }

  .rw-tag {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .rw-related-section {
    margin-top: 2rem;
    padding-top: 1.25rem;
  }

  .rw-related-section h3 {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  .rw-sidebar {
    order: 2;
    gap: 1.25rem;
    padding-top: 0;
  }

  .rw-card {
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }

  .rw-contact-card {
    min-height: auto;
    padding: 1.5rem 1.25rem;
  }

  .rw-contact-header {
    margin-bottom: 0.875rem;
  }

  .rw-contact-icon {
    width: 40px;
    height: 40px;
  }

  .rw-contact-title {
    font-size: 1.25rem;
    margin-bottom: 0.625rem;
  }

  .rw-contact-description {
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
  }

  .rw-btn-contact {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }

  .rw-card-header {
    margin-bottom: 0.875rem;
    padding-bottom: 0.625rem;
  }

  .rw-card-label {
    font-size: 0.7rem;
  }

  .rw-list-numbered li {
    padding: 0.625rem 0.5rem;
    gap: 0.625rem;
  }

  .rw-list-number {
    min-width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }

  .rw-list-title {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .rw-list-date {
    font-size: 0.75rem;
  }

  .rw-tags-numbered {
    gap: 0.5rem;
    margin-top: 0.625rem;
  }

  .rw-tag-numbered-item {
    padding: 0.625rem 0.5rem;
    gap: 0.625rem;
  }

  .rw-tag-number {
    min-width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }

  .rw-tag-name {
    font-size: 0.8rem;
  }

  .rw-see-all-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.85rem;
    margin-top: 0.875rem;
  }

  .rw-related-list :deep(.article-card) {
    padding: 0.625rem 0.5rem;
    padding-left: 2rem;
    gap: 0.625rem;
  }

  .rw-related-list :deep(.image-container) {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }

  .rw-related-list :deep(.article-title) {
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .rw-related-list :deep(.article-meta) {
    font-size: 0.7rem;
  }

  .rw-share-ribbon {
    flex-direction: column;
    align-items: flex-start;
  }

  .rw-bottom-share {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .rw-blog-page {
    padding: 1.25rem 0.5rem 2rem;
  }

  .rw-hero {
    padding-top: 4rem;
    padding-bottom: 0.5rem;
    scroll-margin-top: 4rem;
    margin-bottom: 0.875rem;
  }

  .rw-breadcrumb {
    font-size: 0.75rem;
    gap: 0.2rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .rw-title-frame {
    padding: 0.75rem 1rem;
    margin: 1.25rem auto 0.875rem;
    max-width: 100%;
    border-radius: 14px;
  }

  .rw-title {
    font-size: clamp(1rem, 5vw, 1.4rem);
    line-height: 1.35;
    padding: 0;
  }

  .rw-featured {
    margin: 0 auto 1.25rem;
    border-radius: 10px;
  }

  .rw-featured figcaption {
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }

  .rw-inline-meta {
    margin: 0 auto 1.25rem;
    padding: 0.875rem 1rem;
    border-radius: 14px;
    gap: 0.875rem;
  }

  .rw-inline-info {
    gap: 0.4rem;
    font-size: 0.8rem;
  }

  .rw-meta-item {
    padding: 0.35rem 0.625rem;
    font-size: 0.8rem;
    flex: 1 1 auto;
  }

  .rw-meta-item :deep(svg) {
    size: 12px;
  }

  .rw-inline-share-label {
    padding: 0.45rem 0.75rem;
    font-size: 0.8rem;
  }

  .rw-share-btn {
    width: 36px;
    height: 36px;
  }

  .rw-back-button-container {
    margin: 0 auto 1.25rem;
    padding: 0 0.5rem;
  }

  .rw-back-button-center {
    padding: 0.625rem 1.25rem;
    font-size: 0.85rem;
  }

  .rw-layout {
    gap: 1.25rem;
    padding: 0;
  }

  .rw-article {
    padding: 1rem 0.875rem;
    border-radius: 10px;
  }

  .rw-toc-summary-compact {
    gap: 0.875rem;
    padding: 0.875rem;
    margin-bottom: 1.25rem;
    border-radius: 10px;
  }

  .rw-toc-compact-section :deep(.toc-nav-center a) {
    font-size: 0.7rem;
    padding: 0.35rem 0.45rem;
  }

  .rw-summary-compact-section {
    padding: 0.75rem;
  }

  .rw-summary-compact-title {
    font-size: 0.75rem;
    margin-bottom: 0.45rem;
  }

  .rw-summary-compact-list li {
    font-size: 0.7rem;
    line-height: 1.45;
    padding-left: 0.75rem;
  }

  .rw-article-content {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  :deep(.blog-content h2),
  :deep(.blog-content h3) {
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-size: 1.375rem;
  }

  :deep(.blog-content h3) {
    font-size: 1.125rem;
  }

  :deep(.blog-content p) {
    margin-bottom: 0.875rem;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  :deep(.blog-content ul),
  :deep(.blog-content ol) {
    margin-left: 1.125rem;
    margin-bottom: 0.875rem;
    padding-left: 0.5rem;
  }

  :deep(.blog-content li) {
    margin-bottom: 0.45rem;
    line-height: 1.65;
  }

  :deep(.blog-content img) {
    border-radius: 10px;
    margin: 1.25rem auto;
  }

  :deep(.blog-content blockquote) {
    padding: 0.875rem 1rem;
    margin: 1.125rem 0;
    font-size: 0.9rem;
  }

  :deep(.blog-content table) {
    margin: 1.125rem 0;
    font-size: 0.85rem;
  }

  :deep(.blog-content pre) {
    padding: 0.875rem;
    font-size: 0.8rem;
    border-radius: 6px;
  }

  :deep(.blog-content code) {
    font-size: 0.8rem;
    padding: 0.1rem 0.3rem;
  }

  .rw-rating-card {
    margin-top: 1.75rem;
    padding: 1.25rem 0.875rem;
    border-radius: 10px;
  }

  .rw-rating-header {
    gap: 0.625rem;
  }

  .rw-rating-icon {
    width: 44px;
    height: 44px;
  }

  .rw-rating-title {
    font-size: 1.125rem;
  }

  .rw-rating-subtitle {
    font-size: 0.8rem;
  }

  .rw-rating-stars-container {
    gap: 0.875rem;
  }

  .rw-star :deep(svg) {
    size: 22px;
  }

  .rw-rating-number {
    font-size: 1.5rem;
  }

  .rw-rating-total {
    font-size: 1rem;
  }

  .rw-rating-stats {
    font-size: 0.8rem;
    padding: 0.5rem;
  }

  .rw-share-strip {
    margin-top: 1.75rem;
    margin-bottom: 1.75rem;
    padding: 1rem 0.875rem;
    border-radius: 10px;
  }

  .rw-share-header {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  .rw-share-buttons-grid {
    gap: 0.5rem;
  }

  .rw-share-button {
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }

  .rw-cta-card {
    margin-top: 1.75rem;
    border-radius: 14px;
  }

  .rw-cta-content {
    padding: 1.25rem 1rem;
  }

  .rw-cta-icon-wrapper {
    width: 56px;
    height: 56px;
    margin-bottom: 1rem;
  }

  .rw-cta-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .rw-cta-card p {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  .rw-cta-actions {
    gap: 0.625rem;
  }

  .rw-cta-btn-primary,
  .rw-cta-btn-secondary {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }

  .rw-tags-section {
    margin-top: 1.75rem;
    padding-top: 1rem;
  }

  .rw-tags-section p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .rw-tags {
    gap: 0.45rem;
    margin-top: 0.5rem;
  }

  .rw-tag {
    padding: 0.3rem 0.625rem;
    font-size: 0.7rem;
  }

  .rw-related-section {
    margin-top: 1.75rem;
    padding-top: 1rem;
  }

  .rw-related-section h3 {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }

  .rw-sidebar {
    gap: 1rem;
  }

  .rw-card {
    padding: 1rem 0.875rem;
    border-radius: 10px;
  }

  .rw-contact-card {
    padding: 1.25rem 1rem;
  }

  .rw-contact-header {
    margin-bottom: 0.75rem;
  }

  .rw-contact-icon {
    width: 36px;
    height: 36px;
  }

  .rw-contact-title {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .rw-contact-description {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .rw-btn-contact {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .rw-card-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
  }

  .rw-card-label {
    font-size: 0.65rem;
  }

  .rw-list-numbered li {
    padding: 0.5rem 0.45rem;
    gap: 0.5rem;
  }

  .rw-list-number {
    min-width: 22px;
    height: 22px;
    font-size: 0.65rem;
  }

  .rw-list-title {
    font-size: 0.8rem;
    line-height: 1.35;
  }

  .rw-list-date {
    font-size: 0.7rem;
  }

  .rw-tags-numbered {
    gap: 0.45rem;
    margin-top: 0.5rem;
  }

  .rw-tag-numbered-item {
    padding: 0.5rem 0.45rem;
    gap: 0.5rem;
  }

  .rw-tag-number {
    min-width: 22px;
    height: 22px;
    font-size: 0.65rem;
  }

  .rw-tag-name {
    font-size: 0.75rem;
  }

  .rw-see-all-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    margin-top: 0.75rem;
  }

  .rw-related-list :deep(.article-card) {
    padding: 0.5rem 0.45rem;
    padding-left: 1.75rem;
    gap: 0.5rem;
  }

  .rw-related-list :deep(.image-container) {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }

  .rw-related-list :deep(.article-title) {
    font-size: 0.75rem;
    line-height: 1.25;
  }

  .rw-related-list :deep(.article-meta) {
    font-size: 0.65rem;
  }

  .rw-btn {
    width: 100%;
  }
}
</style>

