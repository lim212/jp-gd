<template>
  <div ref="container" class="lazy-blog-container">
    <!-- Skeleton placeholder while not visible -->
    <div v-if="!shouldLoad" class="blog-skeleton">
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </div>
      <div class="skeleton-grid">
        <div v-for="n in skeletonCount" :key="n" class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-text skeleton-text-title"></div>
            <div class="skeleton-text skeleton-text-short"></div>
            <div class="skeleton-text skeleton-text-medium"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual blog list - only rendered when visible -->
    <BlogList 
      v-if="shouldLoad"
      v-bind="$attrs"
      :mode="mode"
      :limit="limit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import BlogList from '~/app/components/BlogList.vue'

interface Props {
  mode?: 'home' | 'list' | 'grid'
  limit?: number
  rootMargin?: string
  threshold?: number
  skeletonCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'home',
  limit: 8,
  rootMargin: '200px', // Start loading 200px before entering viewport
  threshold: 0.01,
  skeletonCount: 8
})

const container = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined' || !container.value) {
    // Fallback for SSR or when container is not available
    shouldLoad.value = true
    return
  }

  // Create intersection observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !shouldLoad.value) {
          // Start loading blog data when component is about to be visible
          shouldLoad.value = true
          
          // Disconnect observer after loading starts
          if (observer && container.value) {
            observer.unobserve(container.value)
            observer.disconnect()
            observer = null
          }
          
          // Dispatch custom event for tracking
          if (import.meta.client) {
            window.dispatchEvent(new CustomEvent('blog-load:start', {
              detail: { mode: props.mode, limit: props.limit }
            }))
          }
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold
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
.lazy-blog-container {
  min-height: 400px;
  position: relative;
}

/* Skeleton Loading Styles */
.blog-skeleton {
  width: 100%;
  padding: 2rem 0;
}

.skeleton-header {
  text-align: center;
  margin-bottom: 2rem;
}

.skeleton-title {
  width: 300px;
  height: 32px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
  margin: 0 auto 1rem;
}

.skeleton-subtitle {
  width: 200px;
  height: 20px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
  margin: 0 auto;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.skeleton-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .skeleton-card {
  background: #1f2937;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.dark .skeleton-image,
.dark .skeleton-title,
.dark .skeleton-subtitle,
.dark .skeleton-text {
  background: linear-gradient(
    90deg,
    #1f2937 0%,
    #374151 50%,
    #1f2937 100%
  );
  background-size: 200% 100%;
}

.skeleton-content {
  padding: 1.5rem;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
}

.skeleton-text-title {
  width: 100%;
  height: 20px;
  margin-bottom: 1rem;
}

.skeleton-text-short {
  width: 60%;
}

.skeleton-text-medium {
  width: 80%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
  
  .skeleton-title {
    width: 80%;
    height: 24px;
  }
  
  .skeleton-subtitle {
    width: 60%;
    height: 16px;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .skeleton-title,
  .skeleton-subtitle,
  .skeleton-image,
  .skeleton-text {
    animation: none !important;
  }
}
</style>

