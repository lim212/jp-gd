<script setup lang="ts">
import TransactionProcessSection from "~/components/Home/TransactionProcess.vue";
import { useImagePopup } from '~/composables/useImagePopup';
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

// Image popup functionality
const { openPopup } = useImagePopup()

// Carousel ref for pause/resume control
const carouselRef = ref<any>(null)
const isCarouselPaused = ref(false)
const autoplayDelay = ref(5000)
const carouselKey = ref(0)

// Handle image click
const handleImageClick = (imageSrc: string, imageAlt: string = '') => {
  console.log('Image clicked:', imageSrc)
  openPopup(imageSrc, imageAlt, 'Informasi Rekening', 'Detail rekening resmi untuk transaksi')
}

// Computed autoplay config - use very large delay when paused
const autoplayConfig = computed(() => {
  // When paused, use extremely large delay (effectively pauses)
  // When not paused, use normal delay with pause on interaction
  return { 
    delay: isCarouselPaused.value ? 999999999 : autoplayDelay.value, 
    disableOnInteraction: true // Built-in pause on interaction (swipe/click)
  }
})

// Pause carousel on hover/touch
const pauseCarousel = () => {
  if (!isCarouselPaused.value) {
    isCarouselPaused.value = true
    console.log('Carousel paused')
  }
}

// Resume carousel when not hovering/touching  
const resumeCarousel = () => {
  if (isCarouselPaused.value) {
    isCarouselPaused.value = false
    console.log('Carousel resumed')
  }
}

// Watch for pause state changes
watch(isCarouselPaused, (newValue) => {
  console.log('Carousel pause state changed:', newValue)
})

interface Items {
  image: string;
  to: string | null;
}
interface LivechatItems {
  image: string;
  to: string;
}

// Items for the bank information carousel
const items: Items[] = [
  {
    image: "/images/informasi/rek-bca-18032025.jpeg",
    to: null,
  },
  {
    image: "/images/informasi/rek-bni-18032025.jpeg",
    to: null,
  },
  {
    image: "/images/informasi/rek-mandiri-18032025.jpeg",
    to: null,
  },
  {
    image: "/images/informasi/dompet-digital-18032025.jpeg",
    to: null,
  },
  {
    image: "/images/informasi/sosial-media-18032025.jpeg",
    to: null,
  },
  {
    image: "/images/informasi/bukti-transaksi-18032025.jpeg",
    to: "https://upload.jasapembayaran.com",
  },
];

const livechatItems: LivechatItems[] = [
  {
    image: "/images/informasi/livechat-1.jpeg",
    to: "https://www.livechat.com/try-livechat?a=1jvRanGnR&utm_campaign=pp_jasapembayaran-co-id&utm_source=PP&utm_medium=banner&utm_content=lc_banner_leadgen_3&region=dal",
  },
  {
    image: "/images/informasi/livechat-2.jpeg",
    to: "https://www.livechat.com/try-livechat?a=1jvRanGnR&utm_campaign=pp_jasapembayaran-co-id&utm_source=PP&utm_medium=banner&utm_content=lc_banner_basic_4&region=dal",
  },
];

// Interval ID for keeping arrows visible
let arrowVisibilityInterval: NodeJS.Timeout | null = null

// Function to force show arrows
const forceShowArrows = () => {
  const carouselElement = document.querySelector('.carousel-container')
  if (carouselElement) {
    // Try multiple selectors to find navigation buttons
    const selectors = [
      '[class*="prev"]',
      '[class*="next"]',
      '[aria-label*="previous"]',
      '[aria-label*="next"]',
      'button[class*="chevron-left"]',
      'button[class*="chevron-right"]',
      '.modern-carousel-nav'
    ]
    
    selectors.forEach(selector => {
      const buttons = carouselElement.querySelectorAll(selector)
      buttons.forEach((btn: Element) => {
        const el = btn as HTMLElement
        el.style.display = 'flex'
        el.style.opacity = '1'
        el.style.visibility = 'visible'
        el.style.pointerEvents = 'auto'
        el.style.zIndex = '50'
      })
    })
  }
}

// Ensure carousel arrows are visible after mount
onMounted(async () => {
  await nextTick()
  
  // Force show immediately
  forceShowArrows()
  
  // Also force show after delays (in case carousel renders later)
  setTimeout(forceShowArrows, 100)
  setTimeout(forceShowArrows, 500)
  setTimeout(forceShowArrows, 1000)
  
  // Set up interval to keep arrows visible (in case they get hidden)
  arrowVisibilityInterval = setInterval(forceShowArrows, 2000)
})

// Clean up on unmount
onUnmounted(() => {
  if (arrowVisibilityInterval) {
    clearInterval(arrowVisibilityInterval)
    arrowVisibilityInterval = null
  }
})
</script>

<template>
        <div class="relative flex flex-col space-y-3 md:space-y-4 lg:space-y-5">
    <!-- PROSES TRANSAKSI Section - 1 Kotak Besar Super Keren -->
    <section
      id="process-section"
      class="relative"
    >
      <!-- Main Content Container - 1 Kotak Besar seperti Trusted Partners -->
      <div class="main-process-container group relative bg-gradient-to-br from-gray-50/90 via-blue-50/40 to-indigo-50/30 dark:from-gray-800/90 dark:via-blue-950/30 dark:to-indigo-950/20 p-6 md:p-8 lg:p-10 rounded-3xl border border-blue-200/60 dark:border-gray-700/40 hover:border-blue-400 dark:hover:border-blue-600/50 shadow-xl dark:shadow-none hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <!-- Background Effects -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 dark:from-blue-400/5 dark:to-indigo-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <!-- Title Section Inside Box -->
          <div class="mb-8 md:mb-10 text-center">
            <div class="flex items-center gap-4 md:gap-6 justify-center mb-6">
              <!-- Left Icon -->
              <div class="relative">
                <div class="p-4 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-400 dark:to-blue-500 rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <UIcon name="i-lucide-workflow" class="size-8 md:size-10 text-white dark:text-gray-900" />
                </div>
                <!-- Icon Glow -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 -z-10"></div>
          </div>

              <!-- Title -->
              <h2 class="font-black text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-wide">
            PROSES TRANSAKSI
          </h2>

              <!-- Right Icon -->
              <div class="relative">
                <div class="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <UIcon name="i-lucide-credit-card" class="size-8 md:size-10 text-white dark:text-gray-900" />
                </div>
                <!-- Icon Glow -->
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 -z-10"></div>
          </div>
        </div>
        
            <!-- Description -->
            <div class="max-w-4xl mx-auto">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg lg:text-xl">
                <strong>Empat langkah profesional</strong> untuk memproses pembayaran Anda di <strong>JasaPembayaran ©</strong> dengan standar keamanan tertinggi, kecepatan optimal, dan kepercayaan penuh. 
                Semua transaksi dilakukan melalui <strong>komunikasi langsung</strong> dengan tim customer service profesional kami yang siap melayani 24/7.
          </p>
        </div>
      </div>

      <!-- Transaction Process Component -->
          <div class="px-2 md:px-4">
        <TransactionProcessSection :show-title="false" :show-description="false" />
          </div>
        </div>
      </div>
    </section>

    <!-- INFORMASI UMUM Section -->
    <section
      id="information-section"
      class="modern-section-container bg-gradient-to-br from-gray-50/90 via-blue-50/40 to-cyan-50/30 dark:from-gray-800/90 dark:via-blue-950/30 dark:to-cyan-950/20 shadow-xl dark:shadow-none border border-blue-200/60 dark:border-gray-700/50 overflow-hidden rounded-3xl"
    >
      <!-- Section Header -->
      <div class="section-header">
        <div class="flex items-center gap-3 md:gap-4 justify-center mb-4">
          <div class="icon-container bg-gradient-to-br from-blue-500 to-cyan-600">
            <UIcon name="i-lucide-info" class="text-white size-6 md:size-8" />
          </div>
          <h2 class="section-title">
            INFORMASI UMUM
          </h2>
          <div class="icon-container bg-gradient-to-br from-blue-500 to-cyan-600">
            <UIcon name="i-lucide-file-text" class="text-white size-6 md:size-8" />
          </div>
        </div>
        
        <div class="section-description">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            Informasi lengkap mengenai detail rekening resmi kami di bagian ini. 
            Pastikan Anda hanya melakukan transaksi ke nomor rekening yang tertera untuk menjaga keamanan dan kelancaran proses pembayaran.
          </p>
        </div>
      </div>

      <!-- Bank Information Carousel -->
      <div 
        class="px-4 pb-6 relative carousel-wrapper"
        @mouseenter="pauseCarousel"
        @mouseleave="resumeCarousel"
        @touchstart="pauseCarousel"
        @touchend="resumeCarousel"
      >
        <UCarousel
          ref="carouselRef"
          v-slot="{ item }"
          loop
          arrows
          snap="start"
          prev-icon="i-lucide-chevron-left"
          next-icon="i-lucide-chevron-right"
          :prev="{
            color: 'primary',
            size: 'xl',
            class: 'modern-carousel-nav left-2 lg:left-4 carousel-nav-button',
          }"
          :next="{
            color: 'primary',
            size: 'xl',
            class: 'modern-carousel-nav right-2 lg:right-4 carousel-nav-button',
          }"
          :autoplay="autoplayConfig"
          :items="items"
          class="w-full carousel-container"
          class-names
          :ui="{
            item: 'basis-[85%] sm:basis-[45%] md:basis-[35%] lg:basis-[28%] transition-all duration-500 transform px-2 py-2',
            wrapper: 'gap-3 md:gap-4',
            viewport: 'rounded-2xl overflow-hidden py-2 md:py-4 px-2',
            track: 'snap-x snap-mandatory',
            controls: 'mt-4',
            dot: 'w-3 h-3 transition-all duration-500',
            activeDot: 'bg-blue-500 scale-125 shadow-lg',
            inactiveDot: 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500',
          }"
          alt="Informasi Rekening JasaPembayaran.com"
          show-arrows="always"
        >
          <!-- Bank Information Card -->
          <div class="modern-info-card group">
            <!-- Card Background Effects -->
            <div class="card-background-effects"></div>
            
            <!-- Image Container -->
            <div class="image-container">
              <div class="image-overlay"></div>
              
              <!-- Clickable Image -->
              <img
                v-if="typeof item === 'object' && item?.to === null"
                :src="item.image"
                class="card-image cursor-pointer hover:scale-105 transition-transform duration-300"
                alt="Informasi Rekening JasaPembayaran.com"
                loading="eager"
                @click.stop="handleImageClick(item.image, 'Account Information')"
                @mousedown.stop
                title="Klik untuk melihat gambar lebih besar"
              />
              
              <!-- Link Image with Overlay -->
              <NuxtLink
                v-if="typeof item === 'object' && item?.to"
                :to="item.to"
                target="_blank"
                class="block h-full relative"
              >
                <img
                  :src="typeof item === 'object' ? item?.image : ''"
                  class="card-image"
                  alt="Informasi Rekening JasaPembayaran.com"
                  loading="eager"
                />
                
                <!-- Link Overlay -->
                <div class="link-overlay">
                  <div class="link-content">
                    <UIcon name="i-lucide-external-link" class="link-icon" />
                    <span class="link-text">Buka Link</span>
                  </div>
                  <UBadge color="white" variant="solid" class="link-badge">
                    <UIcon name="i-lucide-mouse-pointer-click" class="mr-1" />
                    <span class="font-medium">Klik Disini</span>
                  </UBadge>
                </div>
              </NuxtLink>
            </div>
          </div>
        </UCarousel>
      </div>
    </section>

    <!-- LIVECHAT PARTNER Section -->
    <section
      id="livechat-section"
      class="modern-section-container bg-gradient-to-br from-gray-50/90 via-green-50/40 to-emerald-50/30 dark:from-gray-800/90 dark:via-green-950/30 dark:to-emerald-950/20 shadow-xl dark:shadow-none border border-green-200/60 dark:border-gray-700/50 overflow-hidden rounded-3xl"
    >
      <!-- Section Header -->
      <div class="section-header">
        <div class="flex items-center gap-3 md:gap-4 justify-center mb-4">
          <div class="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
            <UIcon name="i-lucide-message-circle" class="text-white size-6 md:size-8" />
          </div>
          <h2 class="section-title">
            LIVECHAT PARTNER
          </h2>
          <div class="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
            <UIcon name="i-lucide-headphones" class="text-white size-6 md:size-8" />
          </div>
        </div>
        
        <div class="section-description">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            Layanan LiveChat profesional untuk website Anda. 
            Tingkatkan konversi dan kepuasan pelanggan dengan dukungan real-time yang responsif dan efisien.
          </p>
        </div>
      </div>

      <!-- LiveChat Carousel -->
      <div class="px-4 pb-6">
        <UCarousel
          v-slot="{ item }"
          loop
          arrows
          snap="start"
          prev-icon="i-lucide-chevron-left"
          next-icon="i-lucide-chevron-right"
          :prev="{
            color: 'primary',
            size: 'lg',
            class: 'modern-carousel-nav left-2 lg:left-4',
          }"
          :next="{
            color: 'primary',
            size: 'lg',
            class: 'modern-carousel-nav right-2 lg:right-4',
          }"
          :autoplay="{ delay: 6000 }"
          :items="livechatItems"
          class="w-full"
          class-names
          :ui="{
            item: 'basis-[90%] sm:basis-[80%] md:basis-[70%] lg:basis-[50%] px-2 py-2',
            wrapper: 'gap-3',
            viewport: 'rounded-2xl overflow-hidden py-2 px-2',
            track: 'snap-x snap-mandatory',
            controls: 'mt-3',
            dot: 'w-2 h-2',
            activeDot: 'bg-green-500',
            inactiveDot: 'bg-gray-300 dark:bg-gray-600',
          }"
          alt="JasaPembayaran.com LiveChat"
          show-arrows="hover"
        >
          <!-- LiveChat Card -->
          <NuxtLink
            :to="item.to"
            target="_blank"
            class="modern-livechat-card group"
          >
            <img
              :alt="`Jasapembayaran LiveChat`"
              :src="item.image"
              class="livechat-image"
              loading="eager"
            />
            
            <!-- Hover Effect -->
            <div class="livechat-overlay">
              <div class="livechat-content">
                <UIcon name="i-lucide-external-link" class="livechat-icon" />
                <span class="livechat-text">Lihat Demo</span>
              </div>
            </div>
          </NuxtLink>
        </UCarousel>
      </div>
    </section>

    <!-- Background Effects -->
    <LazyStarsBg />
  </div>
</template>

<style scoped>
/* Main Process Container Animations */
.main-process-container {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-process-container:hover {
  transform: translateY(-4px) scale(1.01);
}

/* Shimmer Effect for Main Process Container */
.main-process-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.8s ease;
  z-index: 1;
}

.main-process-container:hover::before {
  left: 100%;
}

/* Modern Section Container */
.modern-section-container {
  position: relative;
  overflow: hidden;
}

.modern-section-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  opacity: 0.7;
}

/* Section Header */
.section-header {
  padding: 2rem 1.5rem 1rem;
  text-align: center;
}

.icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.icon-container:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1f2937;
  letter-spacing: 0.025em;
  position: relative;
}

.dark .section-title {
  color: #f9fafb;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 3rem;
  height: 0.25rem;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  border-radius: 0.125rem;
}

.section-description {
  max-width: 4xl;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Modern Carousel Navigation - Always Visible */
.modern-carousel-nav {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  border: 2px solid rgba(59, 130, 246, 0.4) !important;
  border-radius: 50% !important;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25) !important;
  transition: all 0.3s ease !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 50 !important;
  width: 52px !important;
  height: 52px !important;
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.carousel-nav-button {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
}

/* Force visibility for carousel arrows - Multiple selectors to ensure it works */
:deep(.modern-carousel-nav),
:deep([data-carousel-prev]),
:deep([data-carousel-next]),
:deep(button[aria-label*="previous"]),
:deep(button[aria-label*="next"]),
:deep(.carousel-prev),
:deep(.carousel-next) {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  pointer-events: auto !important;
}

/* Ensure carousel navigation container is visible */
:deep(.carousel-container [class*="prev"]),
:deep(.carousel-container [class*="next"]) {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
}

.modern-carousel-nav:hover {
  background: rgba(255, 255, 255, 1) !important;
  border-color: rgba(59, 130, 246, 0.6) !important;
  transform: scale(1.15) !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3) !important;
}

.dark .modern-carousel-nav {
  background: rgba(31, 41, 55, 0.95) !important;
  border-color: rgba(59, 130, 246, 0.4) !important;
}

.dark .modern-carousel-nav:hover {
  background: rgba(31, 41, 55, 1) !important;
  border-color: rgba(59, 130, 246, 0.6) !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
}

/* Carousel Container - Pause on hover/touch */
.carousel-container {
  position: relative;
}

.carousel-container:hover {
  cursor: grab;
}

.carousel-container:active {
  cursor: grabbing;
}

/* Modern Info Card */
.modern-info-card {
  position: relative;
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.9) 100%);
  border: 2px solid rgba(59, 130, 246, 0.1);
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.dark .modern-info-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%);
  border-color: rgba(59, 130, 246, 0.2);
}

.modern-info-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.dark .modern-info-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Card Background Effects */
.card-background-effects {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.modern-info-card:hover .card-background-effects {
  opacity: 1;
}

.card-background-effects::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: rotate 8s linear infinite;
}

/* Image Container */
.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  margin: 0.5rem;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  pointer-events: none;
}

.modern-info-card:hover .image-overlay {
  opacity: 1;
}

.card-image {
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: contain;
  transition: all 0.4s ease;
  border-radius: 1rem;
}

.modern-info-card:hover .card-image {
  transform: scale(1.05);
}

/* Link Overlay */
.link-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.modern-info-card:hover .link-overlay {
  opacity: 1;
}

.link-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
}

.link-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.link-text {
  font-size: 0.875rem;
}

.link-badge {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(10px) !important;
}

/* Modern LiveChat Card */
.modern-livechat-card {
  position: relative;
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.9) 100%);
  border: 2px solid rgba(34, 197, 94, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  display: block;
  height: 100%;
}

.dark .modern-livechat-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%);
  border-color: rgba(34, 197, 94, 0.2);
}

.modern-livechat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.dark .modern-livechat-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.livechat-image {
  width: 100%;
  height: 5rem;
  object-fit: contain;
  transition: all 0.3s ease;
}

.modern-livechat-card:hover .livechat-image {
  transform: scale(1.02);
}

.livechat-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(21, 128, 61, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.modern-livechat-card:hover .livechat-overlay {
  opacity: 1;
}

.livechat-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
}

.livechat-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.livechat-text {
  font-size: 0.875rem;
}

/* Animations */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-process-container {
    padding: 1rem 1.25rem;
  }

  .main-process-container h2 {
    font-size: 1.5rem;
  }

  .main-process-container p {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .main-process-container {
    padding: 0.875rem 1rem;
  }

  .main-process-container h2 {
    font-size: 1.25rem;
  }

  .main-process-container p {
    font-size: 0.8125rem;
  }

  .section-header {
    padding: 1.5rem 1rem 0.5rem;
  }
  
  .icon-container {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .section-description {
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .modern-info-card {
    margin: 0.25rem;
  }
  
  .image-container {
    margin: 0.25rem;
  }
}

/* Performance Optimizations */
.modern-info-card,
.modern-livechat-card,
.card-image,
.livechat-image {
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .modern-info-card,
  .modern-livechat-card,
  .card-image,
  .livechat-image,
  .icon-container {
    transition: none;
  }
  
  .card-background-effects::before {
    animation: none;
  }
  
  .modern-info-card:hover,
  .modern-livechat-card:hover {
    transform: none;
  }
}

/* Enhanced Focus States */
.modern-info-card:focus-within,
.modern-livechat-card:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>