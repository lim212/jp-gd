<script setup>
import BlogListComponent from "../components/BlogList.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// SSR-safe date helper
const getSSRSafeDate = () => {
  if (typeof window === 'undefined') {
    return new Date().toISOString();
  }
  return new Date().toISOString();
};

const formatDate = (date) => {
  return (
    date &&
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'Asia/Jakarta',
    })
  );
};

const formatTime = (date) => {
  return (
    date &&
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }) + " WIB"
  );
};

// Local author helpers (deterministic per slug) to avoid displaying "Admin"
const AUTHOR_POOL = [
  'Felix', 'Andi Pratama', 'Budi Santoso', 'Citra Maharani', 'Dimas Kurniawan', 'Eka Putri', 'Fajar Nugroho', 'Gita Anindya', 'Hendra Wijaya', 'Intan Safitri', 'Joko Saputra', 'Karin Amelia', 'Luthfi Ramadhan', 'Maya Sari', 'Nanda Prasetyo', 'Oki Firmansyah', 'Putri Ayu', 'Rian Saputra', 'Sinta Dewi', 'Taufik Hidayat', 'Vina Lestari'
]
function isAdminLike(name) {
  const s = String(name || '').trim().toLowerCase()
  if (!s) return true
  return s === 'admin' || s.includes('admin blog') || /^admin\b/.test(s)
}
function hashStringLocal(input) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) { h ^= input.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function pickAuthorForSlugLocal(slug, preferred) {
  if (preferred && !isAdminLike(preferred)) {
    const p = String(preferred).trim()
    if (p) return p
  }
  const base = String(slug || '').trim().toLowerCase() || String(Date.now())
  const idx = AUTHOR_POOL.length > 0 ? (hashStringLocal(base) % AUTHOR_POOL.length) : 0
  return AUTHOR_POOL[idx] || 'Felix'
}

/**
 * Fetches data from a URL with retry logic and exponential backoff
 * @param {string} url - The URL to fetch data from
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<any>} - The fetched data
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      // Add timeout and keep-alive configuration to prevent ECONNRESET errors
      const fetchOptions = {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Connection': 'keep-alive' // Use keep-alive to maintain connection
        },
        ...options,
        retry: retryCount // Pass retry count for logging
      };

      return await $fetch(url, fetchOptions);
    } catch (error) {
      retryCount++;
      console.error(`Fetch attempt ${retryCount}/${maxRetries + 1} failed for ${url}:`, error.message || 'Unknown error');

      // If we've reached max retries, rethrow the error
      if (retryCount > maxRetries) {
        console.error(`All fetch retries failed for ${url}`);
        throw error;
      }

      // Calculate exponential backoff delay: 2^retry * 1000ms (1s, 2s, 4s)
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying fetch in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Data Fetching Strategy:
 * 1. First, we try to fetch a list of blog posts about PayPal
 * 2. From that list, we get the slug of the first post
 * 3. Then we fetch the full content of that specific blog post
 * 4. If any step fails, we use fallback content to ensure the page still renders
 *
 * This approach provides fresh content when the API is working,
 * but gracefully degrades to static content when there are issues.
 */

// Default fallback slug in case the API call fails or returns no results
const fallbackSlug = "aplikasi-pembayaran-paypal";

// Declare blog variable so it's accessible throughout the component
let blog = { value: null };
let firstBlogSlug = fallbackSlug;

try {
  // Step 1: Fetch the latest blog posts about PayPal
  const { data: blogList } = await useAsyncData("blogListPaypal",
    () => fetchWithRetry('/api/blog', { params: { page: 1 } })
      .then((res) => ({ data: res?.posts || [] })),
    {
      onError: (error) => {
        console.error('Error in blog list fetch:', error);
      }
    }
  );

  // Step 2: Get the first blog post from the list, or use fallback if none found
  firstBlogSlug = blogList.value?.data?.[0]?.slug || fallbackSlug;
  console.log(`Using blog slug: ${firstBlogSlug}`);

  // Step 3: Fetch the full blog post using the slug
  const blogResult = await useAsyncData("blogJasaPaypal",
    () => fetchWithRetry(`/api/blog/${firstBlogSlug}`).then((post) => ({
      data: {
        title: post?.title,
        display_name: pickAuthorForSlugLocal(firstBlogSlug, post?.author),
        publish_at: post?.date,
        body: post?.content,
        seo_decription: post?.excerpt,
        featured_image: post?.image
      }
    })),
    {
      onError: (error) => {
        console.error('Error in blog post fetch:', error);
      }
    }
  );

  // Assign the result to our blog variable
  blog = blogResult;
} catch (error) {
  console.error("Error in data fetching process:", error);
  // We'll continue with fallback content instead of throwing an error
}

// Step 4: Check if blog data was successfully fetched, if not use fallback content
if (!blog.value || !blog.value.data) {
  console.warn("Blog post not found, using fallback content");
  // Create fallback blog data with static content
  blog.value = {
    data: {
      title: "Jasa Bayar PayPal Aman & Cepat | JasaPembayaran.com",
      display_name: pickAuthorForSlugLocal(firstBlogSlug),
      publish_at: getSSRSafeDate(),
      body: "<p>JasaPembayaran.com menyediakan layanan jasa bayar PayPal yang profesional, cepat, dan aman. Kami siap membantu Anda melakukan pembayaran melalui PayPal tanpa perlu memiliki akun PayPal sendiri.</p><p>Untuk informasi lebih lanjut, silakan hubungi kami melalui WhatsApp.</p>",
      seo_decription: "JasaPembayaran.com menyediakan Jasa Bayar PayPal profesional, cepat, dan tercatat di Indonesia. Lengkapi transaksi global Anda dengan aman sekarang!"
    }
  };
}

const seoUrl = ref("https://jasapembayaran.com/jasa-paypal");
// Use the blog title from the API if available, otherwise use a fallback title
const title = ref(blog.value?.data?.title || "Jasa Bayar PayPal Aman & Cepat | JasaPembayaran.com");
// Use the blog description from the API if available, otherwise use a fallback description
const description = ref(
  blog.value?.data?.seo_decription ||
  "JasaPembayaran.com menyediakan Jasa Bayar PayPal profesional, cepat, dan tercatat di Indonesia. Lengkapi transaksi global Anda dengan aman sekarang!"
);
const seoImage = ref(blog.value?.data?.featured_image || "/img/logo.png");

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  twitterTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  twitterDescription: description.value,
  ogUrl: seoUrl.value,
  ogImage: seoImage.value,
  ogImageAlt: title.value,
  twitterImage: seoImage.value,
  keywords: "jasa perantara paypal, jasa paypal, jasa bayar kartu kredit, jasa bayar skrill, jasa transfer paypal, jasa transfer trc20, jasa transfer btc, jasa pembayaran paypal, jasa bayar paypal, jasa paypal terpercaya, jasa top up paypal, jasa pembayaran via paypal, Jasa bitcoin, Jasa bayar bitcoin, Jasa kirim bitcoin, Jasa kirim paypal, Jasa trc20, Jasa transfer skrill",
  robots: "index, follow",
});

// Create a canonical link to the original blog post on blog.jasapembayaran.com to avoid duplicate content
// We're using seoUrl.value instead of a separate blogCanonicalUrl to avoid duplicate content issues

useHead({
  link: [
    { rel: "canonical", href: seoUrl.value },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Jasa PayPal Terpercaya",
        "description": "Layanan jasa bayar PayPal, top up PayPal, dan transfer PayPal yang cepat, aman, dan terpercaya 24 jam.",
        "provider": {
          "@type": "Organization",
          "name": "JasaPembayaran.com",
          "url": "https://jasapembayaran.com"
        },
        "serviceType": "Jasa Pembayaran Online",
        "areaServed": "Indonesia",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "availabilityStarts": "2023-01-01T00:00:00+07:00",
          "availabilityEnds": "2030-12-31T23:59:59+07:00",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "IDR",
            "price": "0",
            "valueAddedTaxIncluded": "true"
          }
        },
        "termsOfService": "https://jasapembayaran.com/tentang-kami",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Layanan Jasa PayPal",
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
              "name": "Jasa Perantara PayPal",
              "description": "Layanan perantara untuk transaksi PayPal yang aman dan terpercaya"
            }
          ]
        },
        "keywords": "jasa perantara paypal, jasa paypal, jasa bayar kartu kredit, jasa bayar skrill, jasa transfer paypal, jasa transfer trc20, jasa transfer btc, jasa pembayaran paypal, jasa bayar paypal, jasa paypal terpercaya, jasa top up paypal, jasa pembayaran via paypal"
      })
    }
  ],
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-12 pb-12 lg:pt-16 lg:pb-16">
      <!-- Enhanced Animated Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Floating orbs with different sizes and animations -->
        <div class="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-float-slow"></div>
        <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-bounce"></div>
        
        <!-- Grid pattern overlay -->
        <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0); background-size: 40px 40px;"></div>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- Enhanced Badge with glow effect -->
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100/90 to-indigo-100/90 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full border border-blue-200/60 dark:border-blue-700/60 mb-10 shadow-lg backdrop-blur-sm relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
            <span class="text-sm font-bold text-blue-800 dark:text-blue-200 relative z-10">Layanan Terpercaya Sejak 2020</span>
            <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-blue-600 dark:text-blue-400 relative z-10" />
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>

          <!-- Enhanced Main Title with better typography -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
              Jasa PayPal
            </span>
            <br>
            <span class="text-gray-900 dark:text-white relative">
              Profesional & Terpercaya
              <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </span>
          </h1>

          <!-- Enhanced Subtitle with better spacing -->
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            Solusi lengkap untuk semua kebutuhan pembayaran PayPal Anda. 
            <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Aman, cepat, dan terpercaya</span> 
            dengan dukungan 24/7 dari tim profesional kami.
          </p>

          <!-- Enhanced CTA Buttons with better styling -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo+JasaPembayaran.com%2C+saya+ingin+konsultasi+tentang+jasa+PayPal&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <UIcon name="i-lucide-message-circle" class="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />
              <span class="relative z-10">Konsultasi Gratis</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>
            <a
              href="#services"
              class="group relative inline-flex items-center gap-4 px-10 py-5 bg-gray-50/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm"
            >
              <UIcon name="i-lucide-info" class="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Pelajari Lebih Lanjut</span>
            </a>
          </div>

          <!-- Enhanced Trust Indicators with better animations -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div class="text-center group cursor-pointer">
              <div class="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-green-500/25">
                <UIcon name="i-lucide-users" class="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div class="text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">10K+</div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pelanggan Puas</div>
            </div>
            <div class="text-center group cursor-pointer">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/25">
                <UIcon name="i-lucide-clock" class="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">24/7</div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Layanan</div>
            </div>
            <div class="text-center group cursor-pointer">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
                <UIcon name="i-lucide-shield-check" class="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">100%</div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Aman</div>
            </div>
            <div class="text-center group cursor-pointer">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
                <UIcon name="i-lucide-zap" class="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">5 Min</div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Proses Cepat</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 lg:py-24 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-2xl"></div>
        <div class="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-2xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50 mb-6">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-semibold text-blue-800 dark:text-blue-200">Layanan Unggulan</span>
          </div>
          <h2 class="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Layanan PayPal Lengkap
            </span>
          </h2>
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Kami menyediakan berbagai layanan PayPal untuk memenuhi semua kebutuhan transaksi online Anda dengan 
            <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">standar internasional</span>
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <!-- Service 1 - Enhanced -->
          <div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
            <!-- Animated background gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div class="relative z-10">
              <!-- Enhanced icon with glow effect -->
              <div class="relative mb-8">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/25">
                  <UIcon name="i-lucide-credit-card" class="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Jasa Bayar PayPal
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                Layanan pembayaran melalui PayPal untuk berbagai kebutuhan online seperti subscription, pembelian digital, dan transaksi internasional.
              </p>
              
              <!-- Enhanced feature list -->
              <div class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Proses cepat 5-10 menit</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Tanpa perlu akun PayPal</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Support 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Service 2 - Enhanced -->
          <div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
            <!-- Animated background gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div class="relative z-10">
              <!-- Enhanced icon with glow effect -->
              <div class="relative mb-8">
                <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-green-500/25">
                  <UIcon name="i-lucide-arrow-up-down" class="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Transfer PayPal
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                Layanan transfer dana PayPal antar akun dengan aman dan cepat. Cocok untuk bisnis online dan transaksi personal.
              </p>
              
              <!-- Enhanced feature list -->
              <div class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Transfer instan</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Fee kompetitif</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Rekening terverifikasi</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Service 3 - Enhanced -->
          <div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100/50 dark:border-gray-700/50 overflow-hidden md:col-span-2 lg:col-span-1">
            <!-- Animated background gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div class="relative z-10">
              <!-- Enhanced icon with glow effect -->
              <div class="relative mb-8">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
                  <UIcon name="i-lucide-wallet" class="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Top Up PayPal
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                Pengisian saldo PayPal menggunakan berbagai metode pembayaran lokal seperti bank transfer, e-wallet, dan kartu kredit.
              </p>
              
              <!-- Enhanced feature list -->
              <div class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Berbagai metode bayar</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Kurs terupdate</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Proses otomatis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section - Super Keren & Professional -->
    <section class="py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 dark:from-gray-900 dark:via-blue-900/30 dark:to-indigo-900/40 relative overflow-hidden">
      <!-- Enhanced Background Effects -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Animated floating elements -->
        <div class="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/6 to-blue-400/6 rounded-full blur-3xl animate-float-slow"></div>
        
        <!-- Grid pattern overlay -->
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.4) 1px, transparent 0); background-size: 50px 50px;"></div>
        </div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Enhanced Header Section -->
        <div class="text-center mb-24">
          <!-- Super Cool Badge -->
          <div class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100/90 to-indigo-100/90 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full border border-blue-200/60 dark:border-blue-700/60 mb-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
            <span class="text-base font-bold text-blue-800 dark:text-blue-200 relative z-10">Keunggulan Premium</span>
            <UIcon name="i-lucide-crown" class="w-5 h-5 text-blue-600 dark:text-blue-400 relative z-10" />
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
          
          <!-- Super Cool Title -->
          <h2 class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
              Mengapa Pilih Kami?
            </span>
          </h2>
          
          <!-- Enhanced Description Box -->
          <div class="relative max-w-5xl mx-auto mb-12">
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100/50 dark:border-gray-700/50 relative overflow-hidden">
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <p class="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium relative z-10">
                Kami berkomitmen untuk menghadirkan layanan pembayaran digital yang 
                <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">aman, cepat, dan terpercaya</span>. 
                Dengan dukungan <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">teknologi terkini</span>, 
                proses transaksi yang efisien, serta layanan pelanggan yang responsif, kami menjadi 
                <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">pilihan utama</span> 
                bagi mereka yang mengutamakan kemudahan dan keamanan dalam setiap pembayaran.
              </p>
              
              <div class="mt-6 text-center">
                <span class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border border-green-200/50 dark:border-green-700/50">
                  <UIcon name="i-lucide-heart" class="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span class="text-lg font-bold text-green-800 dark:text-green-200">Kepercayaan Anda adalah prioritas kami</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Super Cool Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <!-- Feature 1 - Keamanan Berstandar Bank -->
          <div class="group relative">
            <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.02] border border-transparent dark:border-transparent relative overflow-hidden h-full">
              <!-- Animated background gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div class="relative z-10">
                <!-- Super Cool Icon -->
                <div class="relative mb-8">
                  <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                    <UIcon name="i-lucide-shield-check" class="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Keamanan Berstandar Bank
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
                  Berpengalaman lebih dari 12 tahun menangani pembayaran dan pembelian online dengan sistem keamanan berlapis. Kami memberikan arahan profesional agar transaksi Anda terhindar dari risiko penipuan, seller nakal, dan ancaman siber lainnya.
                </p>
                
                <!-- Bottom accent line -->
                <div class="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Feature 2 - Respons Super Cepat 24/7 -->
          <div class="group relative">
            <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.02] border border-transparent dark:border-transparent relative overflow-hidden h-full">
              <!-- Animated background gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div class="relative z-10">
                <!-- Super Cool Icon -->
                <div class="relative mb-8">
                  <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-blue-500/25">
                    <UIcon name="i-lucide-zap" class="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Respons Super Cepat 24/7
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
                  Pesanan diproses segera dengan rata-rata waktu respon ±3 menit. Tim customer service profesional kami ramah, sopan, dan siap membantu 24 jam sehari dari awal hingga transaksi selesai dengan standar internasional.
                </p>
                
                <!-- Bottom accent line -->
                <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Feature 3 - Layanan Berstandar Internasional -->
          <div class="group relative">
            <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.02] border border-transparent dark:border-transparent relative overflow-hidden h-full">
              <!-- Animated background gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div class="relative z-10">
                <!-- Super Cool Icon -->
                <div class="relative mb-8">
                  <div class="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-orange-500/25">
                    <UIcon name="i-lucide-award" class="w-12 h-12 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Layanan Berstandar Internasional
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
                  Customer service kami memahami kebutuhan unik setiap pelanggan. Melalui rekrutmen dan pelatihan ketat, kami menghadirkan layanan ramah, responsif, dan profesional berstandar kelas internasional dengan teknologi terdepan.
                </p>
                
                <!-- Bottom accent line -->
                <div class="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Feature 4 - Kepercayaan Terbuktikan 12+ Tahun -->
          <div class="group relative">
            <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-[1.02] border border-transparent dark:border-transparent relative overflow-hidden h-full">
              <!-- Animated background gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div class="relative z-10">
                <!-- Super Cool Icon -->
                <div class="relative mb-8">
                  <div class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl group-hover:shadow-purple-500/25">
                    <UIcon name="i-lucide-users" class="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Kepercayaan Terbuktikan 12+ Tahun
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
                  Telah dipercaya lebih dari 12 tahun untuk pembayaran dan pembelian online, didukung ratusan testimoni asli dari pelanggan kami. Setiap transaksi diproses dengan transparansi penuh dan jaminan keamanan maksimal.
                </p>
                
                <!-- Bottom accent line -->
                <div class="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 lg:py-24 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-purple-400/5 to-violet-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-pink-400/5 to-rose-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100/80 to-violet-100/80 dark:from-purple-900/30 dark:to-violet-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50 mb-6">
            <UIcon name="i-lucide-heart" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span class="text-sm font-semibold text-purple-800 dark:text-purple-200">Testimoni Pelanggan</span>
          </div>
          <h2 class="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
              Kata Mereka Tentang Kami
            </span>
          </h2>
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Pengalaman nyata dari ribuan pelanggan yang telah mempercayai layanan PayPal kami
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <!-- Testimonial 1 -->
          <div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 dark:border-gray-700/50">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-1 mb-4">
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                "Layanan yang sangat memuaskan! Proses pembayaran PayPal cepat dan aman. Customer service responsif 24/7. Highly recommended!"
              </p>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Ahmad Rizki</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">Freelancer</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 dark:border-gray-700/50">
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-1 mb-4">
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                "Sudah 2 tahun menggunakan jasa ini untuk bisnis online. Transfer PayPal selalu lancar dan fee-nya kompetitif. Terima kasih!"
              </p>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Sarah Putri</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">E-commerce Owner</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 dark:border-gray-700/50 md:col-span-2 lg:col-span-1">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-1 mb-4">
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
                <UIcon name="i-lucide-star" class="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                "Top up PayPal yang mudah dan cepat. Kurs selalu update dan proses otomatis. Sangat membantu untuk transaksi internasional."
              </p>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">D</span>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Dedi Kurniawan</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">Digital Marketer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Content Section -->
    <section class="py-20 lg:py-24 bg-gradient-to-br from-white/60 to-blue-50/30 dark:from-gray-800/60 dark:to-blue-900/20 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-20 w-48 h-48 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
          <!-- Enhanced Article Header -->
          <div class="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 px-8 lg:px-10 py-8 border-b border-gray-100/50 dark:border-gray-700/50 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
            <div class="relative z-10">
              <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div class="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-gray-700/60 rounded-full">
                  <UIcon name="i-lucide-user" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span class="font-medium">{{ blog?.data?.display_name || pickAuthorForSlugLocal(firstBlogSlug) }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-gray-700/60 rounded-full">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span class="font-medium">{{ blog?.data?.publish_at ? formatDate(blog.data.publish_at) : "-" }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-gray-700/60 rounded-full">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span class="font-medium">{{ blog?.data?.publish_at ? formatTime(blog.data.publish_at) : "-" }}</span>
                </div>
              </div>
              <h1 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {{ blog?.data?.title || "Jasa PayPal Terpercaya untuk Pembayaran Online Anda" }}
              </h1>
            </div>
          </div>

          <!-- Enhanced Article Content -->
          <div class="px-8 lg:px-10 py-10">
            <!-- Enhanced PayPal Service Highlight -->
            <div class="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 mb-10 border border-blue-100/50 dark:border-blue-800/30 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
              <div class="relative z-10">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center">
                    <img src="/logos/paypal.svg" alt="PayPal" class="w-10 h-10" />
                  </div>
                  <h2 class="text-2xl font-black text-gray-900 dark:text-white">Layanan PayPal Premium</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                    <span class="font-semibold text-gray-700 dark:text-gray-300">{{ t('about.paypal_services.payment.description') }}</span>
                  </div>
                  <div class="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
                    <div class="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
                    <span class="font-semibold text-gray-700 dark:text-gray-300">{{ t('about.paypal_services.features.topup_transfer') }}</span>
                  </div>
                  <div class="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                    <div class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
                    <span class="font-semibold text-gray-700 dark:text-gray-300">{{ t('about.paypal_services.features.fast_secure') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Blog Content -->
            <div class="prose prose-lg max-w-none dark:prose-invert prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="blog?.data?.body || '<p>JasaPembayaran.com menyediakan layanan jasa bayar PayPal yang profesional, cepat, dan aman. Kami siap membantu Anda melakukan pembayaran melalui PayPal tanpa perlu memiliki akun PayPal sendiri.</p><p>Untuk informasi lebih lanjut, silakan hubungi kami melalui WhatsApp.</p>'" />
            </div>

            <!-- Enhanced CTA Section -->
            <div class="mt-12 p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10"></div>
              <div class="relative z-10">
                <h3 class="text-2xl font-black text-white mb-4">Siap Memulai Transaksi PayPal?</h3>
                <p class="text-blue-100 mb-8 text-lg font-medium">Hubungi kami sekarang untuk konsultasi gratis dan layanan terbaik</p>
                <a
                  href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo+JasaPembayaran.com%2C+saya+ingin+konsultasi+tentang+jasa+PayPal&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold text-lg rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-xl"
                >
                  <UIcon name="i-lucide-message-circle" class="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Hubungi WhatsApp
                  <UIcon name="i-lucide-arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog List Section -->
    <section class="py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <BlogListComponent />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Modern Professional Styles */
* {
  box-sizing: border-box;
}

/* Enhanced Prose Styling */
.prose {
  color: #374151;
  max-width: none;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 700;
  line-height: 1.25;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 {
  font-size: 2.25rem;
  line-height: 1.1;
}

.prose h2 {
  font-size: 1.875rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h3 {
  font-size: 1.5rem;
}

.prose p {
  margin-top: 0;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.prose ul,
.prose ol {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.prose ul li {
  list-style-type: disc;
}

.prose ol li {
  list-style-type: decimal;
}

.prose img {
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin: 2rem auto;
  max-width: 100%;
  height: auto;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  border-radius: 0.5rem;
  font-style: italic;
  color: #4b5563;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.prose th,
.prose td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.prose th {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
}

.prose tr:hover {
  background-color: #f9fafb;
}

.prose a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.prose a:hover {
  color: #1d4ed8;
  border-bottom-color: #3b82f6;
}

.prose strong {
  font-weight: 700;
  color: #111827;
}

.prose code {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

.prose pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 2rem 0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.prose pre code {
  background: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

/* Dark mode prose styles */
.dark .prose {
  color: #d1d5db;
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3,
.dark .prose h4,
.dark .prose h5,
.dark .prose h6 {
  color: #f9fafb;
}

.dark .prose h2 {
  border-bottom-color: #374151;
}

.dark .prose blockquote {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #9ca3af;
  border-left-color: #60a5fa;
}

.dark .prose th {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
}

.dark .prose tr:hover {
  background-color: #1f2937;
}

.dark .prose a {
  color: #60a5fa;
}

.dark .prose a:hover {
  color: #93c5fd;
  border-bottom-color: #60a5fa;
}

.dark .prose strong {
  color: #f9fafb;
}

.dark .prose code {
  background: #374151;
  color: #fca5a5;
}

/* Enhanced animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(147, 51, 234, 0.5);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Apply animations to sections */
section {
  animation: fadeInUp 0.8s ease-out;
}

section:nth-child(even) {
  animation: slideInLeft 0.8s ease-out;
}

section:nth-child(odd) {
  animation: slideInRight 0.8s ease-out;
}

/* Animation utility classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
  animation-delay: 4s;
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\:-translate-y-1 {
  transform: translateY(-0.25rem);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

/* Enhanced focus styles for accessibility */
a:focus,
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* Loading states */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .prose h1 {
    font-size: 1.875rem;
  }
  
  .prose h2 {
    font-size: 1.5rem;
  }
  
  .prose h3 {
    font-size: 1.25rem;
  }
  
  .prose blockquote {
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
  }
  
  .prose table {
    font-size: 0.875rem;
  }
  
  .prose th,
  .prose td {
    padding: 0.75rem 0.5rem;
  }
  
  /* Mobile-specific optimizations */
  .hero-title {
    font-size: 2.5rem !important;
    line-height: 1.1 !important;
  }
  
  .hero-subtitle {
    font-size: 1.125rem !important;
    line-height: 1.6 !important;
  }
  
  .service-card {
    padding: 1.5rem !important;
  }
  
  .testimonial-card {
    padding: 1.5rem !important;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem !important;
    font-size: 1rem !important;
  }
  
  .trust-indicator {
    padding: 1rem !important;
  }
  
  .trust-indicator-icon {
    width: 3rem !important;
    height: 3rem !important;
  }
  
  .trust-indicator-number {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .hero-subtitle {
    font-size: 1rem !important;
  }
  
  .section-title {
    font-size: 2rem !important;
  }
  
  .section-subtitle {
    font-size: 1rem !important;
  }
  
  .service-card {
    padding: 1rem !important;
  }
  
  .testimonial-card {
    padding: 1rem !important;
  }
  
  .trust-indicator {
    padding: 0.75rem !important;
  }
  
  .trust-indicator-icon {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }
  
  .trust-indicator-number {
    font-size: 1.25rem !important;
  }
}

/* Tablet optimizations */
@media (min-width: 641px) and (max-width: 1024px) {
  .hero-title {
    font-size: 3.5rem !important;
  }
  
  .hero-subtitle {
    font-size: 1.25rem !important;
  }
  
  .section-title {
    font-size: 3rem !important;
  }
  
  .section-subtitle {
    font-size: 1.125rem !important;
  }
  
  .service-card {
    padding: 2rem !important;
  }
  
  .testimonial-card {
    padding: 2rem !important;
  }
}

/* Large screen optimizations */
@media (min-width: 1025px) {
  .hero-title {
    font-size: 4rem !important;
  }
  
  .hero-subtitle {
    font-size: 1.5rem !important;
  }
  
  .section-title {
    font-size: 3.5rem !important;
  }
  
  .section-subtitle {
    font-size: 1.25rem !important;
  }
  
  .service-card {
    padding: 2.5rem !important;
  }
  
  .testimonial-card {
    padding: 2.5rem !important;
  }
}

/* Print styles */
@media print {
  .prose {
    color: #000;
  }
  
  .prose h1,
  .prose h2,
  .prose h3,
  .prose h4,
  .prose h5,
  .prose h6 {
    color: #000;
  }
  
  .prose a {
    color: #000;
    text-decoration: underline;
  }
  
  .prose blockquote {
    background: #f5f5f5;
    border-left-color: #000;
  }
}
</style>

