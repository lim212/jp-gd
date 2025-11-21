<script setup lang="ts">
// Import Vue composables
import { ref, computed, onMounted, nextTick, defineAsyncComponent, watch } from 'vue';

// Import Nuxt composables
import { useColorMode, useHead, useSeoMeta, useLoadingIndicator, useRoute, useRuntimeConfig } from '#imports';

// Import Nuxt built-in components
import { ClientOnly, NuxtPage } from '#components';
import { useI18n } from 'vue-i18n';

// Import custom components
import HeroBackground from './components/HeroBackground.vue';
import SuperLoadingScreen from './components/SuperLoadingScreen.vue';
import BackgroundLoadingIndicator from './components/BackgroundLoadingIndicator.vue';
import SkeletonScreen from './components/SkeletonScreen.vue';
// import ProfessionalLoader from './components/ProfessionalLoader.vue'; // Disabled - too complex and confusing

// Import ChatWhatsapp component for scroll buttons only
const ChatWhatsapp = defineAsyncComponent({
  loader: () => import('./components/ChatWhatsapp.vue'),
  loadingComponent: null,
  errorComponent: null,
  delay: 200,
  timeout: 3000
});

// Import UpdateNotificationPopup component (lazy loaded)
const UpdateNotificationPopup = defineAsyncComponent({
  loader: () => import('./components/UpdateNotificationPopup.vue'),
  loadingComponent: null,
  errorComponent: null,
  delay: 0,
  timeout: 5000
});

// ==================== 🚀 VERSION CHECKER SYSTEM ====================
import { useVersionCheck } from './composables/useVersionCheck';

const { hasUpdate, forceReload } = useVersionCheck();
const showUpdatePopup = ref(false);

// Watch for updates
watch(hasUpdate, (newValue) => {
  if (newValue) {
    console.log('🎉 Update detected!');
    
    // Wait for loading screen to complete before showing popup
    if (typeof document !== 'undefined') {
      const checkLoadingDone = () => {
        const hasLoadingScreen = document.querySelector('.loading-screen, .super-loading-screen')
        
        if (hasLoadingScreen && hasLoadingScreen.clientHeight > 0) {
          console.log('⏳ Waiting for loading screen to complete...');
          // Check again in 1 second
          setTimeout(checkLoadingDone, 1000);
        } else {
          console.log('✅ Loading complete! Showing update popup...');
          showUpdatePopup.value = true;
        }
      };
      
      // Start checking
      checkLoadingDone();
    } else {
      // SSR fallback
      showUpdatePopup.value = true;
    }
  }
}, { immediate: true });

// Handle reload from popup
const handlePopupReload = () => {
  console.log('🔄 User triggered reload from popup');
  forceReload();
};

// Handle close from popup (user clicked "Nanti")
const handlePopupClose = () => {
  console.log('⏸️ User closed popup (chose later)');
  showUpdatePopup.value = false;
};

// Expose trigger function for testing
if (process.client) {
  (window as any).showUpdatePopup = () => {
    console.log('🧪 Manual trigger: Showing update popup');
    showUpdatePopup.value = true;
  };
}

const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === "dark" ? "#0b0f14" : "#ffffff"
);

const { isLoading } = useLoadingIndicator();

const appear = ref(false);
const appeared = ref(false);
const showSkeleton = ref(true); // Aktifkan lagi skeleton screen (super ringan)
const showLoader = ref(true);   // Aktifkan SuperLoadingScreen, tapi dengan auto-skip super cepat
const appReady = ref(false);    // Mulai dari false, akan di-set true oleh loader
const showBackgroundLoading = ref(false); // Background loading indicator (progress kecil di atas)

// Skeleton progress
const skeletonProgress = ref(0)
const skeletonProgressText = ref('Initializing...')

// Loading logic baru: super cepat, anti-stuck, dan selalu bisa di-skip
if (process.client) {
  console.log('🚀 Smart loading system ENABLED (super cepat + anti-stuck)');

  // Blok scroll hanya sebentar saat loader utama tampil
  if (showLoader.value) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  // Safety guard: kalau ada apa pun yang gagal, paksa appReady dalam 3 detik
  setTimeout(() => {
    if (!appReady.value) {
      console.warn('⚠️ Loader timeout fallback – memaksa appReady');
      handleLoaderComplete();
    }
  }, 3000);
}

// Handle loader completion with proper transition
const handleLoaderComplete = () => {
  console.log('✅ Main loading completed!');
  console.log('🔄 Starting background progressive loading...');
  
  // Hide main loader
  showLoader.value = false;
  appReady.value = true;
  appear.value = true;
  appeared.value = true;
  
  // Enable scroll
  if (process.client) {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Start background loading after a brief delay
    setTimeout(() => {
      showBackgroundLoading.value = true;
    }, 500);
  }
};

// Handle skip to content
const handleLoaderSkip = () => {
  console.log('⏭️ Loading skipped by user');
  console.log('🔄 Starting background progressive loading...');
  
  // Hide main loader
  showLoader.value = false;
  appReady.value = true;
  appear.value = true;
  appeared.value = true;
  
  // Enable scroll
  if (process.client) {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Start background loading immediately
    setTimeout(() => {
      showBackgroundLoading.value = true;
    }, 300);
  }
};

// Handle background loading complete
const handleBackgroundLoadingComplete = () => {
  console.log('🎉 All resources loaded! Progressive loading complete.');
  showBackgroundLoading.value = false;
};

// Handle background loading close
const handleBackgroundLoadingClose = () => {
  console.log('❌ Background loading indicator closed by user');
  showBackgroundLoading.value = false;
};
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const baseUrl = (runtimeConfig.public?.siteUrl as string) || 'https://jasapembayaran.com';
const seoUrl = computed(() => {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const path = route.path || '/'
  return base + path
});
const seoImage = computed(() => {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return base + '/landing-page.png'
});

// Keep <html lang> in sync with selected locale for proper i18n across all pages
const { locale } = useI18n();
useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  }
}));

useHead({
  script: [
    // CRITICAL: Force light mode on first visit (runs before everything else)
    {
      innerHTML: `
        (function() {
          try {
            const storageKey = 'color-mode';
            const firstVisitFlag = 'first-visit-completed';
            const ls = window.localStorage;
            
            // Cek apakah ini kunjungan pertama
            if (!ls.getItem(firstVisitFlag)) {
              // Paksa set ke light mode SEBELUM colorMode membaca
              // Hapus 'system' jika ada, karena kita tidak ingin mengikuti browser
              const currentValue = ls.getItem(storageKey);
              if (currentValue === 'system' || !currentValue) {
                ls.setItem(storageKey, 'light');
              } else if (currentValue !== 'light') {
                // Jika user sudah pernah set ke dark, tetap paksa ke light pada first visit
                ls.setItem(storageKey, 'light');
              }
              ls.setItem(firstVisitFlag, 'true');
              
              // Apply ke DOM segera
              if (document.documentElement) {
                document.documentElement.classList.remove('dark', 'system');
                document.documentElement.classList.add('light');
                document.documentElement.setAttribute('data-color-mode', 'light');
                document.documentElement.setAttribute('data-theme', 'light');
              }
              
              console.log('🌞 First visit - Light mode forced (inline script)');
            }
          } catch (e) {
            console.warn('⚠️ Error in first-visit light mode script:', e);
          }
        })();
      `,
      tagPosition: 'head'
    },
    // Heavily defer Google Analytics for much faster initial load
    {
      src: `https://www.googletagmanager.com/gtag/js?id=G-DBDMWKSML2`,
      defer: true,
      async: true,
      tagPosition: 'bodyClose'
    },
    {
      innerHTML: `
          // Delay GA initialization for better performance
          setTimeout(() => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DBDMWKSML2', { 'send_page_view': false });
            setTimeout(() => {
              gtag('event', 'page_view');
            }, 1000);
          }, 3000);
        `,
      defer: true,
      tagPosition: 'bodyClose'
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "JasaPembayaran.com",
        "description": "Jasa PayPal Terpercaya #1 Indonesia - Jasa Bayar PayPal, Top Up PayPal, Transfer PayPal, dan Isi Saldo PayPal cepat, aman, dan 24 jam. Melayani BTC, TRC20, dan berbagai layanan digital. Hubungi sekarang!",
        "url": "/",
        "logo": "/logos/jasapembayaran.com.webp",
        "image": "/landing-page.png",
        "telephone": "+628988888250",
        "email": "admin@JasaPembayaran.com",
        "priceRange": "$$",
        "openingHours": "Mo-Su 00:00-24:00",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "ID",
          "addressLocality": "Jakarta",
          "addressRegion": "DKI Jakarta",
          "postalCode": "12345",
          "streetAddress": "Jakarta, Indonesia"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-6.2088",
          "longitude": "106.8456"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Indonesia"
        },
        "sameAs": [
          "https://testimonial.jasapembayaran.id",
          "https://upload.jasapembayaran.com"
        ],
        "knowsAbout": [
          "Jasa PayPal Terpercaya",
          "Jasa Bayar PayPal Indonesia", 
          "Jasa Top Up PayPal",
          "Jasa Transfer PayPal",
          "Jasa Isi Saldo PayPal",
          "Jasa Deposit PayPal",
          "Jasa Perantara PayPal",
          "Layanan PayPal Indonesia",
          "Pembayaran PayPal Terpercaya"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Jasa PayPal Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Jasa Bayar PayPal",
              "description": "Layanan pembayaran melalui PayPal untuk berbagai kebutuhan online"
            },
            {
              "@type": "Offer",
              "name": "Jasa Transfer PayPal",
              "description": "Layanan transfer dana melalui PayPal dengan cepat dan aman"
            },
            {
              "@type": "Offer",
              "name": "Jasa Top Up PayPal",
              "description": "Layanan pengisian saldo PayPal dengan berbagai metode pembayaran"
            },
            {
              "@type": "Offer",
              "name": "Jasa Isi Saldo PayPal",
              "description": "Layanan pengisian saldo PayPal dengan cepat dan aman"
            },
            {
              "@type": "Offer",
              "name": "Jasa Kirim PayPal",
              "description": "Layanan pengiriman dana melalui PayPal ke berbagai negara"
            },
            {
              "@type": "Offer",
              "name": "Jasa Deposit PayPal",
              "description": "Layanan deposit dana ke akun PayPal dengan berbagai metode"
            },
            {
              "@type": "Offer",
              "name": "Jasa Perantara PayPal",
              "description": "Layanan perantara transaksi PayPal untuk kemudahan pembayaran"
            }
          ]
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apa itu Jasa PayPal Terpercaya?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Jasa PayPal terpercaya adalah layanan yang membantu Anda melakukan pembayaran, transfer, dan top up melalui PayPal tanpa harus memiliki akun PayPal sendiri. Kami bertindak sebagai perantara untuk memudahkan transaksi online Anda dengan keamanan terjamin."
            }
          },
          {
            "@type": "Question",
            "name": "Apa itu Jasa Bayar PayPal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Jasa Bayar PayPal adalah layanan yang membantu Anda melakukan pembayaran melalui PayPal tanpa harus memiliki akun PayPal sendiri. Kami bertindak sebagai perantara untuk memudahkan transaksi online Anda."
            }
          },
          {
            "@type": "Question",
            "name": "Mengapa memilih Jasa PayPal terpercaya?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Memilih jasa PayPal terpercaya seperti jasapembayaran.com menjamin keamanan transaksi Anda. Kami memiliki rekam jejak yang baik, proses cepat (24/7), dan dukungan pelanggan yang responsif."
            }
          },
          {
            "@type": "Question",
            "name": "Berapa biaya jasa PayPal terpercaya?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Biaya jasa PayPal terpercaya kami sangat kompetitif dan transparan. Kami tidak mengenakan biaya tersembunyi. Hubungi kami untuk mendapatkan penawaran terbaik sesuai kebutuhan transaksi PayPal Anda."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah jasa PayPal aman digunakan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya, jasa PayPal terpercaya kami sangat aman. Kami menggunakan sistem keamanan berlapis dan telah berpengalaman sejak 2011. Semua transaksi PayPal dilakukan dengan protokol keamanan tinggi dan terdokumentasi dengan baik."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara menggunakan jasa PayPal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cara menggunakan jasa PayPal kami sangat mudah: 1) Hubungi kami via WhatsApp, 2) Berikan detail transaksi PayPal yang diinginkan, 3) Lakukan pembayaran sesuai instruksi, 4) Kami akan memproses transaksi PayPal Anda dengan cepat dan aman."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara top up saldo dengan Jasa PayPal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Untuk top up saldo PayPal, Anda cukup menghubungi kami melalui WhatsApp, memberitahu jumlah yang diinginkan, melakukan pembayaran ke rekening kami, dan kami akan mengisi saldo PayPal Anda segera setelah konfirmasi."
            }
          }
        ]
      })
    },
    {
      innerHTML: `
        // Delay LiveChat initialization for much better performance
        setTimeout(() => {
          window._lc = window._lc || {};
          window.__lc = window.__lc || {};
          window.__lc.license = 5265231;
          window.__lc.integration_name = "manual_channels";
          window.__lc.product_name = "livechat";
          ;(function(n,t,c){function i(n){return e.h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0;n.type="text/javascript";n.src="https://cdn.livechatinc.com/tracking.js";t.head.appendChild(n)}};!n._lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
        }, 4000);
      `,
      type: 'text/javascript',
      defer: true,
      tagPosition: 'bodyClose'
    }
  ],
  noscript: [
    {
      innerHTML: `<a href="https://www.livechat.com/chat-with/5265231/" rel="nofollow">Chat with us</a>, powered by <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a>`
    }
  ],
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "index, follow", key: "robots" },
    { name: "theme-color", content: color, key: "theme-color" },
    {
      name: "google-site-verification",
      content: "94OenJgPfaxtmNb05il19kN1xS2cbR-Fg0nmitgzASw",
    },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "canonical", href: seoUrl, key: "canonical" },
    // Lazy load Swiper CSS
    { rel: "preload", href: "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css", as: "style", onload: "this.onload=null;this.rel='stylesheet'" },
    // Only essential preconnects
    { rel: "dns-prefetch", href: "//cdn.jsdelivr.net" },
  ],
  htmlAttrs: {
    lang: "id-ID",
  },
});

useSeoMeta({
  robots: "index, follow",
  title: "Jasa PayPal Terpercaya – Jasa Bayar PayPal, Top Up & Transfer",
  description:
    "Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.",
  keywords: "jasa paypal, jasa paypal terpercaya, jasa bayar paypal, jasa top up paypal, jasa isi saldo paypal, jasa transfer paypal, jasa kirim paypal, jasa deposit paypal, jasa perantara paypal, jasa pembayaran paypal, jasa bayar via paypal, jasa pembayaran via paypal, jasa topup saldo paypal, jasa paypal indonesia, jasa paypal murah, jasa paypal cepat, jasa paypal aman, jasa paypal 24 jam, jasa transfer trc20, jasa transfer btc, jasa bayar btc, jasa bayar trc20, jasa pembayaran online, jasa bayar skrill, jasa transfer skrill, jasa bitcoin, jasa kirim bitcoin",
  ogTitle: "Jasa PayPal Terpercaya – Jasa Bayar PayPal, Top Up & Transfer",
  ogSiteName: "JasaPembayaran.com",
  ogImage: seoImage,
  ogUrl: seoUrl,
  ogImageType: "image/png",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageSecureUrl: seoImage,
  ogImageAlt: "Jasa PayPal Terpercaya - Jasa Bayar PayPal, Top Up PayPal, dan Transfer PayPal cepat, aman, dan 24 jam",
  twitterTitle: "Jasa PayPal Terpercaya – Jasa Bayar PayPal, Top Up & Transfer",
  twitterDescription: "Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011.",
  twitterImage: seoImage,
  twitterCard: "summary_large_image",
  ogLocale: "id_ID",
});

// Loading with SuperLoadingScreen
onMounted(() => {
  // Prevent scroll during loading
  if (process.client) {
    if (showLoader.value) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }
});
</script>

<style>
@import url('./assets/css/super-loading-screen.css');

/* Loading Screen Styles */
.loading-screen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 99999 !important;
}

/* Prevent body scroll during loading */
body.loading {
  overflow: hidden !important;
  height: 100vh !important;
}

/* Ensure smooth transition */
.loading-screen.fade-out {
  opacity: 0 !important;
  transform: scale(1.05) !important;
  transition: all 0.8s ease !important;
}
</style>

<template>
  <UApp v-show="appReady" :toaster="{ expand: false }">
    <!-- Global loading bar with enhanced style - Optimized -->
    <NuxtLoadingIndicator
      :throttle="50"
      :duration="800"
      :hide-delay="200"
      :reset-delay="100"
      :height="3"
      :color="false"
    />

    <NuxtLayout style="margin-top: 0; padding-top: 0;">
      <ClientOnly>
        <HeroBackground
          class="absolute w-full -top-px transition-all text-ui-primary shrink-0 min-h-[400px] pointer-events-none"
          :class="[
            isLoading ? 'animate-pulse' : appear ? '' : 'opacity-0',
            appeared ? 'duration-[400ms]' : 'duration-1000',
          ]"
          style="margin-top: 0; padding-top: 0; z-index: -1;"
        />
      </ClientOnly>
      <NuxtPage style="margin-top: 0; padding-top: 0;" />
    </NuxtLayout>

    <!-- Skeleton Screen (sangat ringan, hanya saat first load) -->
    <ClientOnly>
      <SkeletonScreen
        v-if="showSkeleton && !appeared"
        :progress="skeletonProgress"
        :progress-text="skeletonProgressText"
      />
    </ClientOnly>

    <!-- Super Loading Screen (auto-skip, max ~3–4 detik) -->
    <ClientOnly>
      <SuperLoadingScreen
        v-if="showLoader"
        :is-visible="showLoader"
        :smart-mode-delay="2000"
        :max-timeout="3500"
        :stuck-detection-delay="2000"
        :use-real-detection="false"
        @complete="handleLoaderComplete"
        @skip="handleLoaderSkip"
      />
    </ClientOnly>

    <!-- Background loading indicator kecil di atas (resource info + persen) -->
    <ClientOnly>
      <BackgroundLoadingIndicator
        :visible="showBackgroundLoading"
        @complete="handleBackgroundLoadingComplete"
        @close="handleBackgroundLoadingClose"
      />
    </ClientOnly>

    <!-- ChatWhatsapp component for scroll buttons -->
    <ClientOnly>
      <ChatWhatsapp />
    </ClientOnly>
    
    <!-- 🚀 Update Notification Popup -->
    <ClientOnly>
      <UpdateNotificationPopup
        :show="showUpdatePopup"
        @reload="handlePopupReload"
        @close="handlePopupClose"
      />
    </ClientOnly>
  </UApp>
</template>

<style>
/* Optimized page transitions for better performance */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* LiveChat Widget styles moved to LiveChatComponent.vue */

/* WhatsApp Button styles removed as requested */

/* Scroll button styles moved to app/assets/css/scroll-buttons.css */

/* Enhanced Nuxt loading indicator "” gradient + glow */
.nuxt-loading-indicator {
  /* Use a vibrant gradient and subtle glow */
  background: linear-gradient(90deg, #00dc82, #34cdfe, #7a5cff, #ff4ecd);
  /* Let Nuxt control width via transform; we only animate the gradient for a premium feel */
  animation: nuxtLoadingShimmer 1.6s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(52, 205, 254, 0.35), 0 1px 0 rgba(0, 0, 0, 0.06) inset;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  height: 4px !important; /* match the prop */
}

/* Dark mode: soften the glow for less glare */
.dark .nuxt-loading-indicator {
  filter: drop-shadow(0 0 6px rgba(0, 220, 130, 0.25));
}

@keyframes nuxtLoadingShimmer {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.15); }
  100% { filter: brightness(1); }
}

/* Floating actions styles removed as requested */

/* LiveChat Widget positioning fix - positioned at the very bottom with transparent background */
#chat-widget-container,
div[data-testid="chat-widget-container"],
iframe#chat-widget {
  position: fixed !important;
  z-index: 2147483001 !important;
  bottom: 0 !important;
  right: 20px !important;
  max-width: 400px !important;
  max-height: calc(100vh - 20px) !important;
  background: transparent !important;
  overflow: hidden !important;
  transform: translateZ(0) !important;
  will-change: transform !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Tablet positioning - positioned at the very bottom with transparent background */
@media (min-width: 640px) and (max-width: 1023px) {
  #chat-widget-container,
  div[data-testid="chat-widget-container"],
  iframe#chat-widget {
    bottom: 0 !important;
    right: 15px !important;
    max-width: 360px !important;
    background: transparent !important;
  }
}

/* Mobile positioning - positioned at the very bottom with transparent background */
@media (max-width: 639px) {
  #chat-widget-container,
  div[data-testid="chat-widget-container"],
  iframe#chat-widget {
    bottom: 0 !important;
    right: 10px !important;
    max-width: 90vw !important;
    max-height: calc(100vh - 50px) !important;
    transform: translateZ(0) !important;
    will-change: transform !important;
    z-index: 2147483001 !important;
    background: transparent !important;
  }
}
</style>