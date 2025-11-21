<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Items {
  image: string;
  to: string | null;
  title: string;
  description: string;
}

interface LivechatItems {
  image: string;
  to: string;
  title: string;
}

const items: Items[] = [
  {
    image: "/images/informasi/rek-bca-18032025.jpeg",
    to: null,
    title: "Rekening BCA",
    description: "Informasi rekening BCA resmi untuk transaksi pembayaran"
  },
  {
    image: "/images/informasi/rek-bni-18032025.jpeg",
    to: null,
    title: "Rekening BNI",
    description: "Informasi rekening BNI resmi untuk transaksi pembayaran"
  },
  {
    image: "/images/informasi/rek-mandiri-18032025.jpeg",
    to: null,
    title: "Rekening Mandiri",
    description: "Informasi rekening Mandiri resmi untuk transaksi pembayaran"
  },
  {
    image: "/images/informasi/dompet-digital-18032025.jpeg",
    to: null,
    title: "Dompet Digital",
    description: "Informasi dompet digital resmi untuk transaksi pembayaran"
  },
  {
    image: "/images/informasi/sosial-media-18032025.jpeg",
    to: null,
    title: "Media Sosial",
    description: "Informasi media sosial resmi kami"
  },
  {
    image: "/images/informasi/bukti-transaksi-18032025.jpeg",
    to: "https://upload.jasapembayaran.com",
    title: "Bukti Transaksi",
    description: "Upload bukti transaksi pembayaran Anda di sini"
  },
];

const livechatItems: LivechatItems[] = [
  {
    image: "/images/informasi/livechat-1.jpeg",
    to: "https://www.livechat.com/try-livechat?a=1jvRanGnR&utm_campaign=pp_jasapembayaran-co-id&utm_source=PP&utm_medium=banner&utm_content=lc_banner_leadgen_3&region=dal",
    title: "LiveChat Support 24/7"
  },
  {
    image: "/images/informasi/livechat-2.jpeg",
    to: "https://www.livechat.com/try-livechat?a=1jvRanGnR&utm_campaign=pp_jasapembayaran-co-id&utm_source=PP&utm_medium=banner&utm_content=lc_banner_basic_4&region=dal",
    title: "LiveChat Premium Support"
  },
];

// Category filtering functionality could be added here in the future
// const activeCategory = ref('Semua');
// function filterByCategory(category: string) {
//   activeCategory.value = category;
// }
</script>

<template>
  <div class="relative flex flex-col h-full">
    <UPageSection
      id="information-section"
      variant="subtle"
      class="@container flex-grow"
      :ui="{
        container:
          'py-6 lg:pt-6 lg:pb-8 sm:gap-6 bg-white dark:bg-gray-900 ring ring-default overflow-hidden rounded-xl shadow-lg h-full flex flex-col relative',
      }"
    >
      <!-- Enhanced background gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-60 pointer-events-none"></div>

      <template #title>
        <UiTitleBase class="relative z-10">
          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-info" class="text-blue-600 dark:text-blue-400 w-6 h-6" />
            <span class="text-blue-600 dark:text-blue-400 font-bold">Informasi</span>
            <span class="text-gray-900 dark:text-white font-bold">Umum</span>
          </div>
        </UiTitleBase>
      </template>
      <template #description>
        <MDC
          class="text-gray-700 dark:text-gray-300 text-base max-w-3xl mx-auto relative z-10 mb-2"
          value="Informasi lengkap mengenai detail rekening resmi kami di bagian ini. Pastikan Anda hanya melakukan transaksi ke nomor rekening yang tertera untuk menjaga keamanan dan kelancaran proses pembayaran."
        />
      </template>

      <!-- Slider layout for information cards -->
      <div class="relative w-full flex-grow z-10 mt-4">
        <!-- Tabs for category filtering -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <UButton
            v-for="(category, index) in ['Semua', 'Rekening Bank', 'Dompet Digital', 'Media Sosial', 'Lainnya']"
            :key="index"
            color="primary"
            variant="soft"
            size="sm"
            class="font-medium"
            :class="index === 0 ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : ''"
          >
            {{ category }}
          </UButton>
        </div>

        <!-- Swiper slider for information cards -->
        <div class="info-slider-container">
          <Swiper
            :modules="[Pagination, Navigation, Autoplay]"
            :slides-per-view="1"
            :breakpoints="{
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20
              }
            }"
            :pagination="{
              clickable: true,
              dynamicBullets: true
            }"
            :navigation="{
              nextEl: '.info-swiper-button-next',
              prevEl: '.info-swiper-button-prev'
            }"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false
            }"
            class="w-full info-slider"
          >
            <SwiperSlide v-for="(item, index) in items" :key="index" class="h-auto">
              <div class="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-blue-900/50 group h-full mx-2">
                <!-- Card header with icon and title -->
                <div class="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 p-3 flex items-center gap-3">
                  <div class="bg-white dark:bg-gray-800 rounded-full p-2 flex-shrink-0">
                    <UIcon
                      :name="index < 3 ? 'i-lucide-landmark' : index === 3 ? 'i-lucide-wallet' : index === 4 ? 'i-lucide-share-2' : 'i-lucide-upload-cloud'"
                      class="text-blue-600 dark:text-blue-400 w-5 h-5"
                    />
                  </div>
                  <h3 class="font-bold text-white text-lg">{{ item.title }}</h3>
                </div>

                <!-- Card content with image and description -->
                <div class="flex flex-col p-4 flex-grow">
                  <div class="relative overflow-hidden mb-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <img
                      v-if="item.to === null"
                      :src="item.image"
                      loading="lazy"
                      class="w-full h-auto max-h-[200px] object-contain dark:opacity-90 transition-transform duration-500 group-hover:scale-105"
                      :alt="`Jasa PayPal Terpercaya - ${item.title} JasaPembayaran.com`"
                      placeholder
                    />
                    <NuxtLink
                      v-else
                      :to="item.to"
                      target="_blank"
                      class="block overflow-hidden"
                    >
                      <img
                        loading="lazy"
                        :src="item.image"
                        class="w-full h-auto max-h-[200px] object-contain dark:opacity-90 transition-transform duration-500 group-hover:scale-105"
                        :alt="`Jasa Bayar PayPal - ${item.title} JasaPembayaran.com`"
                      />
                      <!-- Overlay for clickable items -->
                      <div class="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          Buka Link
                        </span>
                      </div>
                    </NuxtLink>
                  </div>

                  <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">{{ item.description }}</p>

                  <!-- Action button -->
                  <div class="mt-auto pt-2">
                    <UButton
                      v-if="item.to"
                      :to="item.to"
                      target="_blank"
                      color="primary"
                      variant="soft"
                      class="w-full"
                    >
                      <UIcon name="i-lucide-external-link" class="mr-1" />
                      Buka Link
                    </UButton>
                    <UButton
                      v-else
                      color="gray"
                      variant="ghost"
                      class="w-full"
                    >
                      <UIcon name="i-lucide-info" class="mr-1" />
                      Lihat Detail
                    </UButton>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <!-- Custom navigation buttons -->
          <div class="info-swiper-button-prev !text-white !bg-blue-500/70 !w-10 !h-10 !rounded-full flex items-center justify-center !left-2 hover:!bg-blue-600 transition-all">
            <UIcon name="i-lucide-chevron-left" class="size-6" />
          </div>
          <div class="info-swiper-button-next !text-white !bg-blue-500/70 !w-10 !h-10 !rounded-full flex items-center justify-center !right-2 hover:!bg-blue-600 transition-all">
            <UIcon name="i-lucide-chevron-right" class="size-6" />
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- LiveChat section with improved styling -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="(livechat, key) in livechatItems"
        :key="key"
        :to="livechat.to"
        class="block group"
        target="_blank"
      >
        <UPageCard
          variant="subtle"
          :ui="{
            container:
              'p-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 border border-blue-100 dark:border-blue-900/50',
          }"
        >
          <div class="relative">
            <img
              :alt="`Jasa PayPal Terpercaya - ${livechat.title}`"
              :src="livechat.image"
              class="w-full h-auto max-h-[300px] object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <!-- Enhanced title overlay with icon -->
            <div class="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex items-end p-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-message-circle" class="text-white w-5 h-5" />
                <h3 class="text-white font-bold text-sm sm:text-base">{{ livechat.title }}</h3>
              </div>
            </div>
          </div>
        </UPageCard>
      </NuxtLink>
    </div>

    <LazyStarsBg />
  </div>
</template>

<style scoped>
.info-slider-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 0 10px;
}

.info-slider {
  width: 100%;
  height: auto;
  padding-bottom: 40px; /* Space for pagination */
}

/* Override Swiper's default styles */
:deep(.swiper-pagination) {
  bottom: 0 !important;
}

:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  opacity: 0.5;
  margin: 0 5px;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #3b82f6;
}

.info-swiper-button-prev,
.info-swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
}

.info-swiper-button-prev {
  left: 0;
}

.info-swiper-button-next {
  right: 0;
}

@media (max-width: 640px) {
  .info-swiper-button-prev,
  .info-swiper-button-next {
    width: 30px !important;
    height: 30px !important;
  }

  :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
    margin: 0 3px;
  }
}
</style>


