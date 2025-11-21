<script setup>
const props = defineProps({
  to: {
    type: String,
    default: "",
  },
  iconSrc: {
    type: String,
    default: "",
  },
  iconAlt: {
    type: String,
    default: "",
  },
  iconName: {
    type: String,
    default: "",
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <NuxtLink
    :to="to"
    class="ui-link-footer-menu-category inline-flex items-center justify-start gap-3 text-[14px] font-sans font-medium bg-white text-[#333] hover:bg-gray-50 active:bg-gray-50 p-4 rounded-lg shadow-md transition-all duration-300 ease-out hover:shadow-lg active:shadow-lg border border-gray-200 hover:border-yellow-400/60 active:border-yellow-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 group transform hover:-translate-y-1 active:-translate-y-1 min-h-[48px] w-full relative overflow-visible"
  >
    <!-- Subtle shimmer effect on hover -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100 transition-opacity duration-300 animate-shimmer pointer-events-none z-0"></div>

    <!-- Optional icon: rendered only when showIcon is true -->
    <template v-if="showIcon">
      <template v-if="iconSrc">
        <img :src="iconSrc" :alt="iconAlt || 'Kategori'" class="category-icon relative z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain flex-shrink-0" />
      </template>
      <template v-else-if="iconName">
        <UIcon :name="iconName" class="category-icon text-yellow-500 relative z-10 flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
      </template>
      <template v-else>
        <UIcon name="i-lucide-tag" class="category-icon text-yellow-500 relative z-10 flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
      </template>
    </template>

    <span class="group-hover:font-semibold group-active:font-semibold group-focus:font-semibold transition-all duration-300 leading-relaxed tracking-wide break-words text-left whitespace-normal relative z-10 footer-link-text flex-1 min-w-0 two-line-clamp block w-full">
      <slot />
    </span>
    <UIcon v-if="showArrow" name="i-lucide-arrow-up-right" class="text-yellow-600/70 transition-all duration-300 ml-1 opacity-100 group-hover:opacity-100 flex-shrink-0 relative z-10 size-4" />
  </NuxtLink>
</template>

<style scoped>
.inline-flex {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.04);
}

.inline-flex:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18), 0 0 10px rgba(0, 0, 0, 0.06);
}

/* Ensure consistent height for all items */
.inline-flex {
  display: flex;
}

/* Improve text appearance */
.two-line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  max-width: 100%;
}

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

/* Enhanced hover effect */
.inline-flex:hover {
  transform: translateY(-3px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .inline-flex {
    padding: 1rem !important; /* keep ~16px padding on mobile */
    font-size: 0.875rem !important;
  }

  .inline-flex span {
    font-size: 0.875rem !important;
  }
}
</style>

