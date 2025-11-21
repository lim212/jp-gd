<script setup lang="ts">
defineProps({
  to: {
    type: String,
    default: "",
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <NuxtLink
    :to="to"
    prefetch
    class="ui-link-footer-menu text-[15px] md:text-base flex items-center text-gray-800 hover:text-amber-700 active:text-amber-700 dark:text-gray-200 dark:hover:text-yellow-200 dark:active:text-yellow-200 w-full py-3 px-4 md:px-5 rounded-lg transition-all duration-300 ease-out hover:bg-gray-800/60 active:bg-gray-800/60 dark:hover:bg-gray-800/70 dark:active:bg-gray-800/70 hover:-translate-y-0.5 active:-translate-y-0.5 mb-2.5 border border-transparent hover:border-yellow-600/50 active:border-yellow-600/50 dark:hover:border-yellow-500/60 dark:active:border-yellow-500/60 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:bg-gray-800/50 dark:focus:bg-gray-800/60"
    :class="hidden ? 'hidden md:flex' : 'flex'"
  >
    <!-- Subtle shimmer effect on hover -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100 transition-opacity duration-300 animate-shimmer"></div>

    <UIcon name="i-lucide-chevron-right" class="mr-3 size-4 text-yellow-400 group-hover:text-yellow-300 group-active:text-yellow-300 group-focus:text-yellow-300 transition-transform duration-300 transform group-hover:translate-x-0.5 group-active:translate-x-0.5 group-focus:translate-x-0.5 flex-shrink-0 relative z-10" />
    <span class="text-left flex-grow font-medium group-hover:font-semibold group-active:font-semibold group-focus:font-semibold transition-all duration-300 leading-relaxed tracking-wide break-words relative z-10 footer-link-text">
      <slot />
    </span>
    <UIcon name="i-lucide-arrow-up-right" class="text-yellow-500/0 group-hover:text-yellow-500/80 transition-all duration-300 ml-2 opacity-0 group-hover:opacity-100 relative z-10 size-4" />
  </NuxtLink>
</template>

<style scoped>
/* Shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2.5s infinite;
}

/* Enhanced hover/touch/focus effect */
.ui-link-footer-menu:hover,
.ui-link-footer-menu:active,
.ui-link-footer-menu:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-\[15px\] {
    font-size: 0.9375rem !important;
  }

  .py-3 {
    padding-top: 0.625rem !important;
    padding-bottom: 0.625rem !important;
  }

  .px-4 {
    padding-left: 0.875rem !important;
    padding-right: 0.875rem !important;
  }

  .mb-2\.5 {
    margin-bottom: 0.5rem !important;
  }
}
</style>


