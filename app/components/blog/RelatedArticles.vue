<template>
  <section v-if="relatedArticles.length > 0" class="related-articles-section">
    <div class="section-header">
      <div class="header-content">
        <Icon name="mdi:book-multiple" class="header-icon" size="32" />
        <h2 class="section-title">📚 Artikel Terkait</h2>
      </div>
      <p class="section-subtitle">
        Baca juga artikel menarik lainnya yang mungkin Anda sukai
      </p>
    </div>

    <div class="articles-grid">
      <NuxtLink
        v-for="article in relatedArticles"
        :key="article.slug"
        :to="`/blog/${article.slug}`"
        class="article-card group"
      >
        <!-- Image Container -->
        <div class="image-container">
          <img
            :src="article.image || article.aiImageUrl || '/images/fallback-news.svg'"
            :alt="article.title"
            class="article-image"
            loading="lazy"
          />
          <!-- Gradient Overlay -->
          <div class="image-overlay"></div>
          
          <!-- Category Badge -->
          <div v-if="article.categories && article.categories.length > 0" class="category-badge">
            {{ article.categories[0] }}
          </div>
        </div>

        <!-- Content Container -->
        <div class="content-container">
          <!-- Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="tags-list">
            <span
              v-for="(tag, idx) in article.tags.slice(0, 2)"
              :key="idx"
              class="tag-item"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="article-title">
            {{ article.title }}
          </h3>

          <!-- Excerpt -->
          <p v-if="article.excerpt" class="article-excerpt">
            {{ stripHtml(article.excerpt).substring(0, 120) }}{{ stripHtml(article.excerpt).length > 120 ? '...' : '' }}
          </p>

          <!-- Meta Info -->
          <div class="article-meta">
            <div class="meta-item">
              <Icon name="mdi:clock-outline" size="16" />
              <span>{{ calculateReadingTime(article.content || article.excerpt) }}</span>
            </div>
            <div class="meta-item">
              <Icon name="mdi:calendar" size="16" />
              <span>{{ formatDate(article.date) }}</span>
            </div>
          </div>

          <!-- Read More -->
          <div class="read-more-link">
            <span>Baca Selengkapnya</span>
            <Icon name="mdi:arrow-right" class="arrow-icon" size="20" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- View All Button -->
    <div v-if="totalArticles > relatedArticles.length" class="view-all-container">
      <NuxtLink to="/blog" class="view-all-button">
        <span>Lihat Semua Artikel ({{ totalArticles }})</span>
        <Icon name="mdi:arrow-right-circle" size="24" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Article {
  slug: string
  title: string
  excerpt?: string
  content?: string
  image?: string
  aiImageUrl?: string
  categories?: string[]
  tags?: string[]
  date?: string
}

const props = defineProps<{
  currentSlug: string
  currentTags?: string[]
  currentCategories?: string[]
  limit?: number
}>()

const relatedArticles = ref<Article[]>([])
const totalArticles = ref(0)

// Strip HTML tags
function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

// Calculate reading time
function calculateReadingTime(content: string): string {
  if (!content) return '5 min'
  const text = stripHtml(content)
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min`
}

// Format date
function formatDate(dateString?: string): string {
  if (!dateString) return 'Recently'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Fetch related articles
async function fetchRelatedArticles() {
  try {
    const limit = props.limit || 3
    
    // Fetch all blog articles
    const { data } = await useFetch('/api/blog/index.get', {
      query: {
        limit: 50 // Get more to filter from
      }
    })

    if (data.value?.posts) {
      const allPosts = data.value.posts as Article[]
      
      // Filter out current article
      const otherPosts = allPosts.filter(post => post.slug !== props.currentSlug)
      
      // Score and sort by relevance
      const scoredPosts = otherPosts.map(post => {
        let score = 0
        
        // Match by category (highest priority)
        if (props.currentCategories && post.categories) {
          const matchingCategories = post.categories.filter(cat => 
            props.currentCategories?.includes(cat)
          )
          score += matchingCategories.length * 10
        }
        
        // Match by tags (medium priority)
        if (props.currentTags && post.tags) {
          const matchingTags = post.tags.filter(tag => 
            props.currentTags?.some(currentTag => 
              currentTag.toLowerCase() === tag.toLowerCase()
            )
          )
          score += matchingTags.length * 5
        }
        
        // Boost recent articles
        if (post.date) {
          const daysOld = Math.floor(
            (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24)
          )
          if (daysOld < 30) score += 3
          if (daysOld < 7) score += 2
        }
        
        return { ...post, score }
      })
      
      // Sort by score (highest first) and take top N
      const sortedPosts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      
      relatedArticles.value = sortedPosts
      totalArticles.value = allPosts.length
    }
  } catch (error) {
    console.error('Error fetching related articles:', error)
    relatedArticles.value = []
  }
}

// Fetch on mount
onMounted(() => {
  fetchRelatedArticles()
})

// Re-fetch when props change
watch(() => props.currentSlug, () => {
  fetchRelatedArticles()
})
</script>

<style scoped>
.related-articles-section {
  margin: 4rem 0 2rem;
  padding: 3rem 0;
  border-top: 2px solid #e5e7eb;
}

.dark .related-articles-section {
  border-top-color: #374151;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.header-icon {
  color: #3b82f6;
}

.dark .header-icon {
  color: #60a5fa;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.dark .section-subtitle {
  color: #9ca3af;
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Article Card */
.article-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.dark .article-card {
  background: #1f2937;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .article-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Image Container */
.image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f3f4f6;
}

.dark .image-container {
  background: #111827;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article-card:hover .image-overlay {
  opacity: 1;
}

/* Category Badge */
.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(59, 130, 246, 0.95);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);
}

/* Content Container */
.content-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

/* Tags */
.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 0.75rem;
  color: #3b82f6;
  background: #eff6ff;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.dark .tag-item {
  color: #60a5fa;
  background: #1e3a8a;
}

/* Title */
.article-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  color: #111827;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.dark .article-title {
  color: #f9fafb;
}

.article-card:hover .article-title {
  color: #3b82f6;
}

.dark .article-card:hover .article-title {
  color: #60a5fa;
}

/* Excerpt */
.article-excerpt {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
  flex: 1;
}

.dark .article-excerpt {
  color: #9ca3af;
}

/* Meta */
.article-meta {
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dark .article-meta {
  border-top-color: #374151;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .meta-item {
  color: #9ca3af;
}

/* Read More Link */
.read-more-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  transition: gap 0.3s ease;
}

.dark .read-more-link {
  color: #60a5fa;
}

.article-card:hover .read-more-link {
  gap: 0.75rem;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.article-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* View All Button */
.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.view-all-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .related-articles-section {
    margin: 2rem 0 1rem;
    padding: 1.5rem 0;
    border-top-width: 1px;
  }

  .section-header {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .header-content {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .header-icon {
    flex-shrink: 0;
  }

  .section-title {
    font-size: 1.375rem;
    text-align: left;
  }

  .section-subtitle {
    font-size: 0.9rem;
    text-align: left;
    margin-top: 0.5rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .article-card {
    border-radius: 12px;
  }

  .image-container {
    height: 180px;
  }

  .content-container {
    padding: 1rem;
    gap: 0.75rem;
  }

  .tags-list {
    gap: 0.4rem;
  }

  .tag-item {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }

  .article-title {
    font-size: 1.05rem;
    line-height: 1.4;
    -webkit-line-clamp: 3;
  }

  .article-excerpt {
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .article-meta {
    gap: 1rem;
    padding-top: 0.75rem;
    font-size: 0.8rem;
  }

  .meta-item {
    font-size: 0.8rem;
    gap: 0.3rem;
  }

  .meta-item :deep(svg) {
    size: 14px;
  }

  .read-more-link {
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .view-all-container {
    margin-top: 2rem;
  }

  .view-all-button {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .related-articles-section {
    margin: 1.5rem 0 0.75rem;
    padding: 1.25rem 0;
  }

  .section-header {
    margin-bottom: 1.25rem;
  }

  .header-content {
    gap: 0.625rem;
  }

  .header-icon {
    size: 24px;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-subtitle {
    font-size: 0.85rem;
  }

  .articles-grid {
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .article-card {
    border-radius: 10px;
  }

  .image-container {
    height: 160px;
  }

  .content-container {
    padding: 0.875rem;
    gap: 0.625rem;
  }

  .tag-item {
    font-size: 0.65rem;
    padding: 0.15rem 0.45rem;
  }

  .article-title {
    font-size: 1rem;
    line-height: 1.35;
  }

  .article-excerpt {
    font-size: 0.75rem;
    line-height: 1.45;
  }

  .article-meta {
    gap: 0.875rem;
    padding-top: 0.625rem;
    font-size: 0.75rem;
  }

  .meta-item {
    font-size: 0.75rem;
  }

  .meta-item :deep(svg) {
    size: 12px;
  }

  .read-more-link {
    font-size: 0.75rem;
  }

  .view-all-container {
    margin-top: 1.5rem;
  }

  .view-all-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }
}

/* Animation on Scroll */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.article-card:nth-child(1) {
  animation-delay: 0.1s;
}

.article-card:nth-child(2) {
  animation-delay: 0.2s;
}

.article-card:nth-child(3) {
  animation-delay: 0.3s;
}
</style>


