<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ref, onMounted, computed } from 'vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Enhanced slides with additional metadata
const slides = [
  {
    image: '/images/slider/1-1723594725.jpg',
    title: 'Jasa PayPal Terpercaya',
    accent: 'purple-400'
  },
  {
    image: '/images/slider/2-1723594715.jpg',
    title: 'Top Up PayPal',
    accent: 'purple-500'
  },
  {
    image: '/images/slider/3-1723594702.jpg',
    title: 'Kirim Dana PayPal',
    accent: 'purple-400'
  },
  {
    image: '/images/slider/4-1723594641.jpg',
    title: 'Jasa Pembayaran Online',
    accent: 'purple-500'
  }
];

// Track current slide for animations
const currentSlideIndex = ref(0);
const swiperInstance = ref(null);

// Performance and network profile
const netMode = useState('net-mode', () => ({ slow: false, reason: '' }))
const perf = useState('perf-profile', () => ({ lowMemory: false, lowCpu: false }))
const isSlowProfile = computed(() => netMode.value.slow || perf.value.lowMemory || perf.value.lowCpu)

// Visibility control to defer mounting
const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return
  
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          isVisible.value = true
          io.disconnect()
        }
      })
    }, { rootMargin: '200px 0px', threshold: 0.1 })
    if (rootEl.value) io.observe(rootEl.value)
  } else {
    setTimeout(() => { isVisible.value = true }, 1000)
  }

  // Only preload images on capable devices
  if (!isSlowProfile.value) {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }
});

// Handle slide change to trigger animations
const handleSlideChange = (swiper) => {
  currentSlideIndex.value = swiper.realIndex;
  swiperInstance.value = swiper;
};

</script>

<template>
  <div ref="rootEl" class="hero-slider-wrapper">
    <div class="hero-slider-ambient">
      <span class="ambient-glow glow-top"></span>
      <span class="ambient-glow glow-bottom"></span>
      <span class="ambient-orb orb-left"></span>
      <span class="ambient-orb orb-right"></span>

      <div class="hero-slider-surface">
        <Swiper
          v-if="isVisible"
          :modules="[Pagination, Navigation, Autoplay]"
          :slides-per-view="1"
          :loop="true"
          :effect="'slide'"
          :speed="isSlowProfile ? 300 : 800"
          :pagination="{
            clickable: true,
            dynamicBullets: true,
          }"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :autoplay="isSlowProfile ? false : { delay: 6000, disableOnInteraction: false }"
          :keyboard="{
            enabled: true,
            onlyInViewport: true,
          }"
          :a11y="{
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
          }"
          :grabCursor="true"
          :observer="true"
          :observeParents="true"
          :resizeObserver="true"
          class="hero-swiper"
          @slideChange="handleSlideChange"
        >
          <SwiperSlide v-for="(slide, index) in slides" :key="index" class="relative">
            <!-- Gambar Banner -->
            <img
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
              :src="slide.image"
              :alt="`${slide.title} - JasaPembayaran.com`"
              class="w-full object-cover"
              style="height: clamp(240px, 40vw, 540px)"
            />
          </SwiperSlide>

          <!-- Tombol panah kiri -->
          <button class="swiper-button-prev nav-pill nav-pill-left">
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          <!-- Tombol panah kanan -->
          <button class="swiper-button-next nav-pill nav-pill-right">
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </Swiper>
      </div>
    </div>
  </div>

</template>

<style scoped>
.hero-slider-wrapper {
  position: relative;
  width: 100%;
  max-width: min(96vw, 1200px);
  margin: 0 auto;
  padding: clamp(0.75rem, 1.5vw, 1.75rem);
}

.hero-slider-ambient {
  position: relative;
  border-radius: clamp(2rem, 4vw, 4.5rem);
  padding: clamp(1rem, 2vw, 2.5rem);
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(255, 0, 153, 0.18), transparent 45%),
    linear-gradient(135deg, #0a0f1f, #1c0c36 50%, #32074d);
  overflow: hidden;
  filter: drop-shadow(0 25px 40px rgba(10, 8, 35, 0.6));
  isolation: isolate;
}

.hero-slider-ambient::before,
.hero-slider-ambient::after {
  content: '';
  position: absolute;
  inset: 10%;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transform: rotate(-4deg);
  z-index: -2;
}

.hero-slider-ambient::after {
  inset: 4%;
  opacity: 0.4;
  transform: rotate(6deg);
}

.hero-slider-surface {
  position: relative;
  border-radius: clamp(1.5rem, 3vw, 3.75rem);
  overflow: hidden;
  background: linear-gradient(145deg, rgba(13, 15, 24, 0.75), rgba(24, 10, 41, 0.85));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -30px 60px rgba(10, 0, 30, 0.45);
}

.hero-swiper {
  width: 100%;
}

.ambient-glow {
  position: absolute;
  width: clamp(160px, 18vw, 220px);
  height: clamp(160px, 18vw, 220px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 60%);
  filter: blur(6px);
  opacity: 0.8;
  animation: pulse-slow 6s ease-in-out infinite;
}

.glow-top {
  top: -30px;
  right: 12%;
}

.glow-bottom {
  bottom: -45px;
  left: 14%;
  animation-delay: 1.2s;
}

.ambient-orb {
  position: absolute;
  width: clamp(80px, 12vw, 140px);
  height: clamp(80px, 12vw, 140px);
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 183, 0, 0.7), rgba(255, 0, 128, 0.65));
  opacity: 0.4;
  mix-blend-mode: screen;
  filter: blur(2px);
}

.orb-left {
  top: 18%;
  left: -40px;
}

.orb-right {
  bottom: 12%;
  right: -35px;
}

.nav-pill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(240, 185, 24, 0.95);
  padding: 0.4rem 0.55rem;
  border-radius: 999px;
  box-shadow: 0 10px 20px rgba(255, 174, 0, 0.35);
  transition: transform 0.25s ease, background 0.25s ease;
}

.nav-pill:hover {
  transform: translateY(-50%) scale(1.05);
  background: rgba(255, 200, 70, 1);
}

.nav-pill-left {
  left: clamp(0.75rem, 2vw, 1.75rem);
}

.nav-pill-right {
  right: clamp(0.75rem, 2vw, 1.75rem);
}

@media (max-width: 768px) {
  .hero-slider-wrapper {
    padding: 0.75rem;
  }

  .hero-slider-ambient {
    border-radius: 2rem;
    padding: 0.9rem;
  }

  .hero-slider-surface {
    border-radius: 1.5rem;
  }

  .ambient-orb {
    opacity: 0.25;
  }
}

@media (max-width: 480px) {
  .nav-pill {
    padding: 0.35rem 0.45rem;
  }

  .nav-pill-left {
    left: 0.5rem;
  }

  .nav-pill-right {
    right: 0.5rem;
  }
}

/* Premium Hero Slider Container */
.premium-hero-slider-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  position: relative;
  z-index: 1;
  box-shadow:
    0 10px 40px -15px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(250, 204, 21, 0.05),
    inset 0 0 5px rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.02));
}

/* Premium Hero Slider */
.premium-hero-slider {
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.2),
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateZ(0); /* Force hardware acceleration */
  height: auto; /* Ensure height is calculated properly */
  will-change: transform; /* Performance optimization */
}

/* Premium Slider Image Container */
.premium-slider-image-container {
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9; /* Standard aspect ratio for consistent display */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-height: 70vh; /* Prevent excessive height on large screens */
}

/* Optimized Zoom Out Effect Animation */
.zoom-out-effect {
  animation: zoomOutEffect 8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: transform, filter; /* Performance optimization */
}

@keyframes zoomOutEffect {
  0% {
    transform: scale(1.03);
    filter: brightness(1) blur(0);
  }
  100% {
    transform: scale(1);
    filter: brightness(1.05) blur(0);
  }
}

/* Optimized Premium Content Animation */
.content-wrapper {
  opacity: 0;
  transform: translateY(20px);
  will-change: opacity, transform; /* Performance optimization */
}

.animate-content {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optimized Premium Title and Subtitle Styling */
.premium-slide-title {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transform: translateY(15px);
  opacity: 0;
  animation: fadeInTitle 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.15s;
  will-change: opacity, transform; /* Performance optimization */
}

.premium-slide-subtitle {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transform: translateY(15px);
  opacity: 0;
  animation: fadeInSubtitle 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.3s;
  will-change: opacity, transform; /* Performance optimization */
}

.premium-slide-button {
  transform: translateY(15px);
  opacity: 0;
  animation: fadeInButton 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.45s;
  will-change: opacity, transform; /* Performance optimization */
}

@keyframes fadeInTitle {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInSubtitle {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInButton {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shadow Glow Effect */
.shadow-glow {
  box-shadow: 0 0 10px 2px rgba(250, 204, 21, 0.3);
}

/* Premium Navigation Buttons */
.premium-nav-button {
  opacity: 0.9 !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.premium-nav-button:hover {
  opacity: 1 !important;
}

/* Premium Pagination Bullets */
.premium-pagination-bullet {
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.premium-pagination-bullet::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Slow Pulse Animation for Decorative Elements */
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

/* Enhanced Text Shadow */
.text-shadow-xl {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4);
}

.text-shadow-lg {
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

/* Override Swiper's default styles */
:deep(.swiper-pagination) {
  bottom: 25px !important;
  z-index: 30;
  opacity: 0; /* Hide default pagination */
  pointer-events: none;
}

/* Hide default navigation arrows */
:deep(.swiper-button-prev:after),
:deep(.swiper-button-next:after) {
  display: none;
}

/* Enhanced Responsive Adjustments */
@media (max-width: 768px) {
  /* Ensure swiper slides display properly */
  :deep(.swiper-wrapper) {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    height: auto !important;
  }

  :deep(.swiper-slide) {
    width: 100% !important;
    flex-shrink: 0 !important;
    height: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Ensure images scale properly */
  :deep(.swiper-slide img) {
    width: 100% !important;
    height: auto !important;
    object-fit: contain !important; /* Use contain to show full image */
    object-position: center !important; /* Center the image */
    max-height: 100% !important; /* Ensure image doesn't exceed container */
    aspect-ratio: 16 / 9; /* Maintain rectangular aspect ratio */
  }
}

@media (max-width: 640px) {
  .premium-pagination-bullet::after {
    animation: none; /* Disable shimmer on mobile for performance */
  }

  .animate-pulse-slow {
    animation: none; /* Disable pulse on mobile for performance */
  }

  /* Optimize corner decorations for small devices */
  .absolute.top-4.left-4.w-24.h-24 {
    width: 16px;
    height: 16px;
  }

  .absolute.bottom-4.right-4.w-24.h-24 {
    width: 16px;
    height: 16px;
  }

  .absolute.top-4.right-4.w-16.h-16,
  .absolute.bottom-4.left-4.w-16.h-16 {
    display: none; /* Hide secondary corners on small screens */
  }

  /* Optimize multilingual indicators for small screens */
  .flex.items-center.gap-2.mb-3 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  /* Ensure swiper slides display properly */
  :deep(.swiper-wrapper) {
    display: flex !important;
    flex-direction: row !important;
  }

  /* Improve text visibility */
  .absolute.bottom-0.left-0.w-full.p-4 {
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%);
    padding-top: 2rem;
  }
}

@media (max-width: 480px) {
  /* Ensure swiper slides display properly */
  :deep(.swiper-wrapper) {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    height: auto !important;
  }

  :deep(.swiper-slide) {
    width: 100% !important;
    flex-shrink: 0 !important;
    height: auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Ensure images scale properly */
  :deep(.swiper-slide img) {
    width: 100% !important;
    height: auto !important;
    object-fit: contain !important; /* Use contain to show full image */
    object-position: center !important; /* Center the image */
    max-height: 100% !important; /* Ensure image doesn't exceed container */
    aspect-ratio: 16 / 9; /* Maintain rectangular aspect ratio */
  }

  /* Adjust navigation buttons for better mobile experience */
  .swiper-button-prev,
  .swiper-button-next {
    transform: scale(0.8); /* Slightly smaller buttons on mobile */
  }
}

/* Special enhancements for high-end displays */
@media (min-width: 1600px) {
  .premium-hero-slider-container {
    max-width: 1600px;
    padding: 2rem;
  }

  .premium-slider-image-container {
    aspect-ratio: 2.75 / 1;
  }

  .premium-hero-slider {
    border-radius: 1.25rem;
  }

  /* Enhanced shadows for large screens */
  .premium-hero-slider {
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.2),
      0 4px 15px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}

/* Border Glow Animation */
@keyframes border-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(250, 204, 21, 0.2);
    border-color: rgba(250, 204, 21, 0.6);
  }
  50% {
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
    border-color: rgba(250, 204, 21, 0.8);
  }
}

.animate-border-glow {
  animation: border-glow 4s ease-in-out infinite;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-700 {
  animation-delay: 0.7s;
}

/* Texture Background */
.bg-texture {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-size: 150px 150px;
}

/* High-end device enhancements */
@media (min-width: 1200px) {
  .premium-hero-slider-container {
    padding: 1.5rem;
  }

  .premium-hero-slider {
    border-radius: 1rem;
  }

  .premium-slide-button:hover {
    box-shadow: 0 10px 25px -5px rgba(250, 204, 21, 0.4);
  }
}
</style>




