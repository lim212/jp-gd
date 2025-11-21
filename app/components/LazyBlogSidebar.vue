<template>
  <div ref="container" class="lazy-sidebar-container">
    <!-- Skeleton placeholder while not visible -->
    <div v-if="!shouldLoad" class="sidebar-skeleton">
      <div class="skeleton-section" v-for="n in 3" :key="n">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-item" v-for="i in 5" :key="i">
          <div class="skeleton-item-thumb"></div>
          <div class="skeleton-item-content">
            <div class="skeleton-item-text"></div>
            <div class="skeleton-item-text short"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual sidebar - only rendered when visible -->
    <BlogSidebar v-if="shouldLoad" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BlogSidebar from './BlogSidebar.vue'

const container = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined' || !container.value) {
    shouldLoad.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !shouldLoad.value) {
          shouldLoad.value = true
          
          if (observer && container.value) {
            observer.unobserve(container.value)
            observer.disconnect()
            observer = null
          }
        }
      })
    },
    {
      rootMargin: '300px',
      threshold: 0.01
    }
  )

  observer.observe(container.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.lazy-sidebar-container {
  min-height: 300px;
}

.sidebar-skeleton {
  padding: 1rem;
}

.skeleton-section {
  margin-bottom: 2rem;
}

.skeleton-section-title {
  width: 60%;
  height: 24px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.skeleton-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.skeleton-item-thumb {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}

.skeleton-item-content {
  flex: 1;
}

.skeleton-item-text {
  height: 14px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.skeleton-item-text.short {
  width: 70%;
}

.dark .skeleton-section-title,
.dark .skeleton-item-thumb,
.dark .skeleton-item-text {
  background: linear-gradient(
    90deg,
    #1f2937 0%,
    #374151 50%,
    #1f2937 100%
  );
  background-size: 200% 100%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-section-title,
  .skeleton-item-thumb,
  .skeleton-item-text {
    animation: none !important;
  }
}
</style>

