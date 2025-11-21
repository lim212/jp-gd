<template>
  <div v-if="visible" class="mobile-search-results-wrapper">
    <div
      v-if="isSearching"
      class="mobile-search-state"
    >
      <UIcon :name="loadingIcon" class="mobile-search-state-icon spin" />
      <span>{{ loadingMessage }}</span>
    </div>

    <div
      v-else-if="error"
      class="mobile-search-state mobile-search-state--error"
    >
      <UIcon name="i-lucide-alert-triangle" class="mobile-search-state-icon" />
      <span class="mobile-search-state-text">{{ error }}</span>
      <button type="button" class="mobile-search-state-action" @click="$emit('retry')">
        {{ retryLabel }}
      </button>
    </div>

    <div
      v-else-if="!results.length"
      class="mobile-search-state mobile-search-state--empty"
    >
      <UIcon :name="emptyIcon" class="mobile-search-state-icon" />
      <div>
        <p class="mobile-search-state-title">{{ emptyTitle }}</p>
        <p class="mobile-search-state-caption">{{ emptyCaption }}</p>
      </div>
    </div>

    <TransitionGroup
      v-else
      name="mobile-search-result"
      tag="ul"
      class="mobile-search-results-list"
    >
      <li
        v-for="article in results"
        :key="article?.slug || article?.id || article?.title"
        class="mobile-search-result"
      >
        <button
          type="button"
          class="mobile-search-result-button"
          @click="$emit('select', article)"
        >
          <div class="mobile-search-result-content">
            <span
              class="mobile-search-result-title"
              v-html="highlightMatch(article?.title || '')"
            />

            <span
              v-if="getArticleExcerpt(article)"
              class="mobile-search-result-excerpt"
              v-html="highlightMatch(getArticleExcerpt(article))"
            />

            <div class="mobile-search-result-meta">
              <span
                v-if="formatPublishedDate(article?.date)"
                class="mobile-search-chip"
              >
                <UIcon name="i-lucide-calendar" class="mobile-search-chip-icon" />
                {{ formatPublishedDate(article?.date) }}
              </span>
              <span
                v-if="getReadingTime(article)"
                class="mobile-search-chip"
              >
                <UIcon name="i-lucide-clock" class="mobile-search-chip-icon" />
                {{ getReadingTime(article) }}
              </span>
              <span
                v-if="getPrimaryCategory(article)"
                class="mobile-search-chip"
              >
                <UIcon name="i-lucide-rows" class="mobile-search-chip-icon" />
                {{ getPrimaryCategory(article) }}
              </span>
            </div>
          </div>
          <UIcon :name="chevronIcon" class="mobile-search-result-arrow" />
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import {
  highlightMatch as highlightMatchUtil,
  getArticleExcerpt as getArticleExcerptUtil,
  getPrimaryCategory as getPrimaryCategoryUtil,
  getReadingTime as getReadingTimeUtil,
  formatPublishedDate as formatPublishedDateUtil
} from '~/utils/mobileSearchHelpers'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  results: {
    type: Array as () => any[],
    default: () => []
  },
  query: {
    type: String,
    default: ''
  },
  isSearching: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  emptyTitle: {
    type: String,
    default: 'Hasil tidak ditemukan'
  },
  emptyCaption: {
    type: String,
    default: 'Silakan gunakan kata kunci lain.'
  },
  loadingMessage: {
    type: String,
    default: 'Menganalisis artikel terkait...'
  },
  retryLabel: {
    type: String,
    default: 'Coba lagi'
  },
  loadingIcon: {
    type: String,
    default: 'i-lucide-loader-2'
  },
  emptyIcon: {
    type: String,
    default: 'i-lucide-search-x'
  },
  chevronIcon: {
    type: String,
    default: 'i-lucide-arrow-up-right'
  }
})

const emit = defineEmits<{
  (e: 'select', article: any): void
  (e: 'retry'): void
}>()

const highlightMatch = (text: string) => highlightMatchUtil(text, props.query)
const getArticleExcerpt = (article: any) => getArticleExcerptUtil(article)
const formatPublishedDate = (value?: string) => formatPublishedDateUtil(value)
const getReadingTime = (article: any) => getReadingTimeUtil(article)
const getPrimaryCategory = (article: any) => getPrimaryCategoryUtil(article)
</script>

<style scoped>
.mobile-search-results-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-search-results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mobile-search-result {
  position: relative;
}

.mobile-search-result-button {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  color: inherit;
  text-align: left;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
}

:global(.dark) .mobile-search-result-button {
  background: rgba(30, 41, 59, 0.82);
  border-color: rgba(148, 163, 184, 0.25);
}

.mobile-search-result-button:hover {
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 16px 28px rgba(59, 130, 246, 0.18);
}

.mobile-search-result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mobile-search-result-title {
  font-weight: 700;
  font-size: clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem);
  color: var(--menu-text, inherit);
  letter-spacing: 0.01em;
}

.mobile-search-result-excerpt {
  font-size: 0.88rem;
  color: var(--menu-muted, rgba(71, 85, 105, 0.9));
  line-height: 1.55;
}

.mobile-search-result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.mobile-search-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--menu-muted, rgba(71, 85, 105, 0.85));
  background: rgba(59, 130, 246, 0.12);
}

:global(.dark) .mobile-search-chip {
  background: rgba(148, 163, 184, 0.16);
}

.mobile-search-result-arrow {
  width: 20px;
  height: 20px;
  margin-top: 0.3rem;
  color: rgba(59, 130, 246, 0.7);
  flex-shrink: 0;
}

.mobile-search-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px dashed rgba(148, 163, 184, 0.45);
  background: rgba(241, 245, 249, 0.6);
  color: rgba(71, 85, 105, 0.9);
  font-weight: 600;
}

:global(.dark) .mobile-search-state {
  background: rgba(30, 41, 59, 0.75);
  border-color: rgba(148, 163, 184, 0.3);
  color: rgba(226, 232, 240, 0.85);
}

.mobile-search-state--error {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(254, 226, 226, 0.75);
  color: #b91c1c;
}

:global(.dark) .mobile-search-state--error {
  background: rgba(239, 68, 68, 0.16);
  color: #fecaca;
}

.mobile-search-state--empty {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
}

.mobile-search-state-icon {
  width: 22px;
  height: 22px;
}

.mobile-search-state-title {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.mobile-search-state-caption {
  font-weight: 500;
  color: rgba(71, 85, 105, 0.75);
}

.mobile-search-state-action {
  border: none;
  background: rgba(59, 130, 246, 0.1);
  color: rgba(37, 99, 235, 0.95);
  border-radius: 10px;
  padding: 0.4rem 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-search-state-action:hover {
  background: rgba(59, 130, 246, 0.18);
}

.mobile-highlight {
  background: rgba(250, 204, 21, 0.3);
  border-radius: 6px;
  padding: 0 0.2rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.mobile-search-result-enter-from),
:deep(.mobile-search-result-leave-to) {
  opacity: 0;
  transform: translateY(10px);
}

:deep(.mobile-search-result-enter-active),
:deep(.mobile-search-result-leave-active) {
  transition: all 0.25s ease;
}

:deep(.mobile-search-result-leave-active) {
  position: absolute;
}
</style>
</style>

