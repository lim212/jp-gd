<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useImagePopup } from '~/composables/useImagePopup'

// Image popup functionality
const { openPopup } = useImagePopup()

// Handle image click
const handleImageClick = (imageSrc: string, title: string = '') => {
  openPopup(imageSrc, title, 'Carousel Image', `Image from carousel: ${title}`)
};

// Enhanced carousel items with titles and descriptions
const items = [
  {
    image: 'https://picsum.photos/640/640?random=1',
    title: 'Premium Service',
    description: 'Experience our top-tier payment solutions'
  },
  {
    image: 'https://picsum.photos/640/640?random=2',
    title: 'Secure Transactions',
    description: 'Your security is our highest priority'
  },
  {
    image: 'https://picsum.photos/640/640?random=3',
    title: 'Global Reach',
    description: 'Connect with partners worldwide'
  },
  {
    image: 'https://picsum.photos/640/640?random=4',
    title: 'Fast Processing',
    description: 'Quick and efficient payment solutions'
  },
  {
    image: 'https://picsum.photos/640/640?random=5',
    title: 'Expert Support',
    description: '24/7 assistance from our dedicated team'
  },
  {
    image: 'https://picsum.photos/640/640?random=6',
    title: 'Trusted Partner',
    description: 'Join thousands of satisfied customers'
  }
];

// Track the current slide for custom animations
const currentIndex = ref(0);
const isLoading = ref(true);

// Preload images for smoother transitions
onMounted(() => {
  const preloadImages = () => {
    items.forEach(item => {
      const img = new Image();
      img.src = item.image;
    });
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  };
  preloadImages();
});

// Handle slide change to trigger animations
const handleSlideChange = (swiper) => {
  currentIndex.value = swiper.realIndex;
};
</script>

<template>
  <div class="carousel-premium-container relative">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl">
      <div class="flex flex-col items-center">
        <div class="loading-spinner mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">Loading premium content...</p>
      </div>
    </div>

    <UCarousel
      v-slot="{ item, index }"
      loop
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :items="items"
      class="premium-carousel w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-15px_rgba(255,255,255,0.1)]"
      @slide:change="handleSlideChange"
    >
      <div class="relative overflow-hidden group">
        <!-- Image with enhanced styling -->
        <div class="image-container relative overflow-hidden">
          <img
            :src="item.image"
            width="640"
            height="640"
            class="w-full transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85] contrast-[1.1] cursor-pointer"
            :class="{ 'animate-image-in': currentIndex === index }"
            loading="eager"
            alt=""
            @click="handleImageClick(item.image, item.title)"
          />

          <!-- Premium gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>

          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400/0 via-yellow-400/80 to-yellow-400/0"></div>
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400/0 via-yellow-400/80 to-yellow-400/0"></div>
        </div>

        <!-- Content overlay with animations -->
        <div class="absolute bottom-0 left-0 w-full p-4 md:p-6 z-10">
          <div class="transform transition-all duration-500 ease-out"
               :class="{ 'translate-y-0 opacity-100': currentIndex === index, 'translate-y-8 opacity-0': currentIndex !== index }">
            <h3 class="text-xl md:text-2xl font-bold text-white mb-2 text-shadow-lg">{{ item.title }}</h3>
            <p class="text-sm md:text-base text-gray-200 text-shadow-md">{{ item.description }}</p>
          </div>
        </div>

        <!-- Hover effect overlay -->
        <div class="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </UCarousel>

    <!-- Custom indicators -->
    <div class="flex justify-center mt-4 gap-2">
      <button
        v-for="(_, i) in items"
        :key="i"
        @click="currentIndex = i"
        class="w-2.5 h-2.5 rounded-full transition-all duration-300 bg-gray-300 dark:bg-gray-700"
        :class="{ 'w-8 bg-blue-500 dark:bg-blue-600': currentIndex === i }"
        aria-label="Go to slide"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.carousel-premium-container {
  position: relative;
  z-index: 1;
}

.premium-carousel {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.image-container {
  aspect-ratio: 1 / 1;
}

/* Text shadow for better readability */
.text-shadow-lg {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.text-shadow-md {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Loading spinner animation */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-left-color: rgba(59, 130, 246, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Image entrance animation */
.animate-image-in {
  animation: image-zoom-in 1.5s ease-out forwards;
}

@keyframes image-zoom-in {
  0% { transform: scale(1.1); filter: brightness(0.7) blur(5px); }
  100% { transform: scale(1); filter: brightness(0.85) blur(0); }
}

/* Custom styling for UCarousel navigation buttons */
:deep(.u-carousel-navigation-prev),
:deep(.u-carousel-navigation-next) {
  background-color: rgba(255, 204, 0, 0.7) !important;
  color: white !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

/* Responsive sizing for navigation buttons on mobile */
@media (max-width: 640px) {
  :deep(.u-carousel-navigation-prev),
  :deep(.u-carousel-navigation-next) {
    width: 30px !important;
    height: 30px !important;
  }
}

:deep(.u-carousel-navigation-prev:hover),
:deep(.u-carousel-navigation-next:hover) {
  background-color: rgba(255, 204, 0, 0.9) !important;
  transform: scale(1.1) !important;
}

/* Pagination bullets styling */
:deep(.u-carousel-pagination) {
  bottom: -5px !important;
}

:deep(.u-carousel-pagination-bullet) {
  background-color: rgba(255, 204, 0, 0.7) !important;
  opacity: 0.5 !important;
  transition: all 0.3s ease !important;
}

:deep(.u-carousel-pagination-bullet-active) {
  background-color: rgba(255, 204, 0, 1) !important;
  opacity: 1 !important;
  width: 20px !important;
  border-radius: 4px !important;
}
</style>



