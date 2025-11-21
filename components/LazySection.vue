<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  rootMargin: { type: String, default: '0px 0px 300px 0px' },
  once: { type: Boolean, default: true },
  minHeight: { type: [String, Number], default: '240px' },
  tag: { type: String, default: 'div' }
})

const isVisible = ref(false)
const el = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  // If IntersectionObserver is not available, render immediately
  if (typeof window === 'undefined' || typeof (window as any).IntersectionObserver === 'undefined') {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          isVisible.value = true
          if (props.once && observer && el.value) {
            observer.unobserve(el.value)
            observer.disconnect()
            observer = null
          }
        }
      }
    },
    { root: null, rootMargin: props.rootMargin, threshold: [0, 0.01, 0.1, 0.25] }
  )

  if (el.value) observer.observe(el.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <!-- Forward any attributes (like class, id) to the wrapper element -->
  <component :is="tag" ref="el">
    <slot v-if="isVisible" />
    <slot name="placeholder" v-else>
      <div
        class="ls-skeleton"
        :style="{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : String(minHeight), width: '100%' }"
        aria-hidden="true"
      />
    </slot>
  </component>
</template>

<style scoped>
.ls-skeleton{
  position: relative;
  background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.05) 100%);
  overflow: hidden;
}
.ls-skeleton::after{
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.35) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  animation: lsShimmer 1.25s ease-in-out infinite;
}
@keyframes lsShimmer { 0%{ transform: translateX(-100%) } 100%{ transform: translateX(100%) } }

/* Reduce motion for smart-mode and users preferring less motion */
html.smart-mode .ls-skeleton::after{ animation-duration: 1.8s }
@media (prefers-reduced-motion: reduce){ .ls-skeleton::after{ animation: none } }
</style>

