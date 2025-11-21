<template>
  <h3 class="flex items-center justify-between py-3 md:py-4 px-4 md:px-5 text-base md:text-lg lg:text-xl font-bold bg-white/95 dark:bg-gradient-to-r dark:from-gray-900/95 dark:to-gray-800/95 text-gray-900 dark:text-white rounded-t-xl shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-xl border-b border-blue-600/70">
    <!-- Subtle shimmer overlay -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent animate-shimmer"></div>
    </div>

    <!-- Title text with cleaner styling -->
    <span class="relative z-10 flex-grow text-center font-montserrat tracking-wider text-gray-900 dark:text-white transition-all duration-300 group-hover:text-blue-50">
      <slot />
    </span>

    <!-- Elegant bottom accent line -->
    <span class="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700"></span>
  </h3>
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

/* Hover accent */
h3:hover {
  border-color: rgba(59, 130, 246, 0.9);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  h3 {
    padding: 0.625rem 0.875rem !important;
  }

  h3 span {
    font-size: 0.9375rem !important;
  }
}
</style>

