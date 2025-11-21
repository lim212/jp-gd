<template>
  <div ref="container" class="simple-lazy-section">
    <slot v-if="isVisible" />
    <div v-else class="lazy-placeholder" :style="{ minHeight: minHeight }">
      <SimpleLoading :is-loading="true" message="Memuat konten..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  rootMargin?: string
  threshold?: number
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  rootMargin: '50px',
  threshold: 0.1,
  minHeight: '200px'
})

const isVisible = ref(false)
const container = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined' || !container.value) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      }
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
  }
})
</script>

<style scoped>
.simple-lazy-section {
  position: relative;
}

.lazy-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
}

.dark .lazy-placeholder {
  background: #1f2937;
}
</style>


