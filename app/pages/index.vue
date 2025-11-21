<script setup lang="ts">
import { defineAsyncComponent, computed, onMounted, type Component } from 'vue';
import { useRuntimeConfig } from '#imports';
import AboutSection from "../components/Home/About.vue";
import WhyWeSection from "../components/Home/WhyWe.vue";
import FaqSection from "../components/Home/Faq.vue";
import InformationSection from "../components/Home/Information.vue";
import TestimoniSection from "../components/Home/Testimoni.vue";
import BlogListComponent from "../components/BlogList.vue";
import AdditionalBlogBoxes from "../components/Home/AdditionalBlogBoxes.vue";
import BlogStats from "../components/Home/BlogStats.vue";
import BlogNewsletter from "../components/Home/BlogNewsletter.vue";
import BlogSocialShare from "../components/Home/BlogSocialShare.vue";
import BlogQuickActions from "../components/Home/BlogQuickActions.vue";
import BlogThemeCustomization from "../components/Home/BlogThemeCustomization.vue";
import BlogReadingProgress from "../components/Home/BlogReadingProgress.vue";
import CompanyProfileSection from "../components/Home/CompanyProfile.vue";
import SeoKeywords from "../components/SeoKeywords.vue";
import LazySection from "../../components/LazySection.vue";
import BannerSlider from "../components/BannerSlider.vue";
import { seoKeywords } from '../utils/seoKeywords'
import { getCardImage as getBlogCardImage } from '../../utils/blog-images'

const net = useState<{ slow?: boolean; reason?: string }>('net-mode')

// Check if mobile for inline styles
const isMobile = computed(() => {
  if (import.meta.client) {
    return window.innerWidth <= 768
  }
  return false
})

// Banner slider langsung dimuat - tidak perlu async untuk tampilan modern

const { data: page } = await useAsyncData('index', async () => {
  try {
    const result = await queryCollection('content').first()
    return result || { title: null, description: null }
  } catch {
    return { title: null, description: null }
  }
})

// REMOVED: Blog articles section from homepage - all related functions removed

const defaultTitle = 'Jasa PayPal Terpercaya #1 Indonesia - Jasa Bayar PayPal, Top Up & Transfer 24 Jam'
const defaultDescription = 'Jasa PayPal terpercaya #1 di Indonesia untuk isi saldo, bayar, dan transfer PayPal. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011. Hubungi sekarang!'

// Schema.org markup for homepage
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PT Jasa Gudang Indonesia",
  "alternateName": "JasaPembayaran.com",
  "url": "https://jasapembayaran.com",
  "logo": "https://jasapembayaran.com/logo.png",
  "description": "Layanan jasa pembayaran online terpercaya di Indonesia sejak 2011. Menyediakan jasa PayPal, Bitcoin, Skrill, Neteller, dan berbagai layanan digital lainnya.",
  "foundingDate": "2011",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Green Lake City Boulevard, Rukan Great Wall Blok A No. 38",
    "addressLocality": "Cipondoh",
    "addressRegion": "Tangerang",
    "postalCode": "15146",
    "addressCountry": "ID"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-898-8888-250",
    "contactType": "customer service",
    "availableLanguage": "Indonesian",
    "areaServed": "ID"
  },
  "sameAs": [
    "https://api.whatsapp.com/send/?phone=628988888250",
    "https://jasapembayaran.com"
  ],
  "service": [
    {
      "@type": "Service",
      "name": "Jasa PayPal",
      "description": "Layanan jasa PayPal untuk isi saldo, bayar, dan transfer PayPal"
    },
    {
      "@type": "Service", 
      "name": "Jasa Bitcoin",
      "description": "Layanan trading dan transaksi Bitcoin serta cryptocurrency"
    },
    {
      "@type": "Service",
      "name": "Jasa Skrill",
      "description": "Layanan jasa Skrill untuk transaksi internasional"
    },
    {
      "@type": "Service",
      "name": "Jasa Neteller",
      "description": "Layanan jasa Neteller untuk pembayaran digital"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Layanan Pembayaran Digital",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Jasa PayPal Indonesia"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Jasa Bitcoin & Cryptocurrency"
        }
      }
    ]
  }
}

useSeoMeta({
  title: page.value?.title || defaultTitle,
  ogTitle: page.value?.title || defaultTitle,
  twitterTitle: page.value?.title || defaultTitle,
  description: page.value?.description || defaultDescription,
  ogDescription: page.value?.description || defaultDescription,
  twitterDescription: page.value?.description || defaultDescription,
});

useHead({
  meta: [
    { name: 'keywords', content: seoKeywords.join(', ') }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(homepageSchema)
    }
  ]
});

// WhatsApp CTA runtime link
const config = useRuntimeConfig();
const whatsappPhone = computed(() => config.public?.whatsappPhone || '628988888250');
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || 'Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal'
);
const whatsappHref = computed(() => {
  const params = new URLSearchParams({
    phone: String(whatsappPhone.value),
    text: String(whatsappMessage.value),
    type: 'phone_number',
    app_absent: '0'
  });
  return `https://api.whatsapp.com/send/?${params.toString()}`;
});

// Smart Button Tooltip Handler - Simplified
const showTooltip = (e: Event) => {
  const target = e.target as HTMLElement;
  const smartButton = target.closest('.smart-button') as HTMLElement;
  
  if (smartButton) {
    smartButton.classList.add('tooltip-active');
    
    // Remove tooltip after 3 seconds
    setTimeout(() => {
      smartButton.classList.remove('tooltip-active');
    }, 3000);
  }
};

const hideTooltip = (e: Event) => {
  const target = e.target as HTMLElement;
  const smartButton = target.closest('.smart-button') as HTMLElement;
  
  if (smartButton) {
    // Keep tooltip visible for a moment
    setTimeout(() => {
      smartButton.classList.remove('tooltip-active');
    }, 1000);
  }
};

// Initialize tooltip system
onMounted(() => {
  // Tooltip system is now handled by Vue event handlers
});
</script>

<style scoped>
/* ============================================
   GLOBAL SPACING & WIDTH CONSISTENCY
   ============================================ */

/* Banner Container - Clean spacing */
.banner-container-zero {
  margin: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Hero Offset - Precise spacing untuk semua layar */
.hero-offset {
  margin-top: var(--app-header-gap, calc(var(--app-header-offset, 118px) + 1rem)) !important;
  margin-bottom: 0 !important;
  padding: 0 !important;
  scroll-margin-top: calc(var(--app-header-offset, 118px) + 1rem) !important;
}

/* Mobile - Spacing tepat setelah header sticky - PRESISI */
@media (max-width: 640px) {
  .hero-offset {
    margin-top: var(--app-header-gap-mobile, calc(var(--app-header-offset, 118px) + 0.86rem)) !important;
  }
}

@media (max-width: 480px) {
  .hero-offset {
    margin-top: var(--app-header-gap-mobile, calc(var(--app-header-offset, 118px) + 0.8rem)) !important;
  }
}

/* INI SUDAH DIDEFINISIKAN DI BAWAH - DIHAPUS UNTUK MENGHINDARI KONFLIK */

/* Banner Slider Wrapper - Clean spacing */
.banner-slider-wrapper {
  margin: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  border-radius: clamp(1.5rem, 3vw, 2.75rem);
  background: transparent !important;
  border: none !important;
  position: relative;
}

.banner-slider-wrapper::before {
  display: none !important;
}

.banner-slider-wrapper > * {
  position: relative;
  z-index: 1;
}

.dark .banner-slider-wrapper {
  background: radial-gradient(circle at 20% 20%, rgba(233, 30, 99, 0.12), transparent 55%),
              radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.12), transparent 60%),
              linear-gradient(145deg, rgba(10, 12, 22, 0.9), rgba(4, 6, 16, 0.98));
  border: 1px solid rgba(233, 30, 99, 0.35);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.dark .banner-slider-wrapper::before {
  content: "";
  position: absolute;
  inset: clamp(0.2rem, 0.9vw, 0.45rem);
  border-radius: inherit;
  border: 1px solid rgba(233, 30, 99, 0.4);
  box-shadow: 0 0 35px rgba(233, 30, 99, 0.25);
  pointer-events: none;
}

/* Ensure all sections have consistent spacing */
:deep(.section-spacing) {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

@media (min-width: 640px) {
  :deep(.section-spacing) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (min-width: 768px) {
  :deep(.section-spacing) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  :deep(.section-spacing) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* ============================================
   ULTRA MODERN HELP SECTION - SUPER PREMIUM KEREN
   ============================================ */

.ultra-clean-help-box {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(240, 249, 255, 0.95) 50%,
    rgba(238, 242, 255, 0.98) 100%
  );
  border-radius: 24px;
  border: 3px solid transparent;
  background-clip: padding-box;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  box-shadow: 
    0 30px 90px rgba(59, 130, 246, 0.18),
    0 15px 45px rgba(99, 102, 241, 0.12),
    0 5px 15px rgba(147, 51, 234, 0.08),
    inset 0 2px 0 rgba(255, 255, 255, 0.9),
    inset 0 -2px 8px rgba(59, 130, 246, 0.05);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

/* Desktop Small (1025px - 1279px) - Compact & Full Width */
@media (min-width: 1025px) and (max-width: 1279px) {
  .ultra-clean-help-box {
    padding: 1.5rem 2rem 1.25rem 2rem;
  }
  
  .help-title-main {
    font-size: 1.5rem;
  }
  
  .help-subtitle-clean {
    font-size: 0.9375rem;
  }
  
  .help-header-clean {
    margin-bottom: 1.25rem;
  }
  
  .ultra-help-btn {
    padding: 1.125rem 1.5rem;
  }
  
  .btn-icon-clean {
    width: 36px;
    height: 36px;
  }
  
  .btn-text-main {
    font-size: 1rem;
  }
  
  .btn-text-sub {
    font-size: 0.8125rem;
  }
}

/* Desktop Medium (1280px - 1439px) - Balanced */
@media (min-width: 1280px) and (max-width: 1439px) {
  .ultra-clean-help-box {
    padding: 1.625rem 2.25rem 1.375rem 2.25rem;
  }
  
  .help-title-main {
    font-size: 1.625rem;
  }
  
  .help-subtitle-clean {
    font-size: 1rem;
  }
  
  .help-header-clean {
    margin-bottom: 1.375rem;
  }
  
  .ultra-help-btn {
    padding: 1.25rem 1.625rem;
  }
  
  .btn-icon-clean {
    width: 38px;
    height: 38px;
  }
  
  .btn-text-main {
    font-size: 1.0625rem;
  }
}

/* Desktop Large (1440px - 1919px) - Spacious */
@media (min-width: 1440px) and (max-width: 1919px) {
  .ultra-clean-help-box {
    padding: 1.75rem 2.5rem 1.5rem 2.5rem;
  }
  
  .help-title-main {
    font-size: 1.75rem;
  }
  
  .help-subtitle-clean {
    font-size: 1.0625rem;
  }
  
  .help-header-clean {
    margin-bottom: 1.5rem;
  }
  
  .ultra-help-btn {
    padding: 1.375rem 1.75rem;
  }
  
  .btn-icon-clean {
    width: 40px;
    height: 40px;
  }
  
  .btn-text-main {
    font-size: 1.125rem;
  }
}

/* Desktop XL (=1920px) - Ultra Wide */
@media (min-width: 1920px) {
  .ultra-clean-help-box {
    padding: 2rem 3rem 1.75rem 3rem;
  }
  
  .help-title-main {
    font-size: 1.875rem;
  }
  
  .help-subtitle-clean {
    font-size: 1.125rem;
  }
  
  .help-header-clean {
    margin-bottom: 1.75rem;
  }
  
  .ultra-help-btn {
    padding: 1.5rem 2rem;
  }
  
  .btn-icon-clean {
    width: 42px;
    height: 42px;
  }
  
  .btn-text-main {
    font-size: 1.25rem;
  }
}

/* Tablet Landscape (769px - 1024px) - Optimal */
@media (min-width: 769px) and (max-width: 1024px) {
  .ultra-clean-help-box {
    padding: 1.75rem 2rem 1.5rem 2rem;
  }
  
  .help-title-main {
    font-size: 1.5rem;
  }
  
  .help-subtitle-clean {
    font-size: 0.9375rem;
  }
  
  .ultra-help-btn {
    padding: 1.125rem 1.375rem;
  }
  
  .btn-icon-clean {
    width: 34px;
    height: 34px;
  }
  
  .btn-text-main {
    font-size: 0.9375rem;
  }
}

.ultra-clean-help-box::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.15) 0%, 
    rgba(147, 51, 234, 0.08) 40%,
    transparent 70%
  );
  animation: float-glow 8s ease-in-out infinite;
  pointer-events: none;
}

.ultra-clean-help-box::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, 
    rgba(16, 185, 129, 0.12) 0%, 
    rgba(37, 211, 102, 0.06) 40%,
    transparent 70%
  );
  animation: float-glow 8s ease-in-out infinite;
  animation-delay: -4s;
  pointer-events: none;
}

@keyframes float-glow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(20px, 20px) scale(1.1);
    opacity: 1;
  }
}

.ultra-clean-help-box:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 
    0 40px 110px rgba(59, 130, 246, 0.25),
    0 20px 60px rgba(99, 102, 241, 0.18),
    0 8px 25px rgba(147, 51, 234, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 1),
    inset 0 0 40px rgba(59, 130, 246, 0.08);
  border-color: rgba(99, 102, 241, 0.3);
}

/* Desktop - Efek glassmorphism dan modern FULL WIDTH */
@media (min-width: 1025px) {
  .ultra-clean-help-box {
    backdrop-filter: blur(12px);
    border-radius: 20px;
    width: 100% !important; /* Force full width */
    max-width: none !important; /* Remove any max-width constraint */
  }
  
  .ultra-clean-help-box:hover {
    transform: translateY(-4px) scale(1.008);
  }
  
  .ultra-help-btn {
    border-radius: 16px;
    backdrop-filter: blur(8px);
  }
}

/* Header Section */
.help-header-clean {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

.help-title-clean {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.625rem;
}

.help-title-main {
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, 
    #1e3a8a 0%, 
    #3b82f6 25%,
    #6366f1 50%, 
    #8b5cf6 75%,
    #a855f7 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.04em;
  text-shadow: 0 2px 20px rgba(59, 130, 246, 0.3);
  filter: drop-shadow(0 2px 8px rgba(99, 102, 241, 0.2));
  position: relative;
  animation: title-shine 3s ease-in-out infinite;
}

@keyframes title-shine {
  0%, 100% {
    filter: drop-shadow(0 2px 8px rgba(99, 102, 241, 0.2));
  }
  50% {
    filter: drop-shadow(0 4px 16px rgba(99, 102, 241, 0.4)) brightness(1.1);
  }
}

.help-badge-clean {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  border-radius: 20px;
  box-shadow: 
    0 6px 20px rgba(16, 185, 129, 0.35),
    0 2px 8px rgba(5, 150, 105, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  animation: badge-pulse-mega 2.5s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.help-badge-clean::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 70%
  );
  animation: badge-shine 3s linear infinite;
}

@keyframes badge-pulse-mega {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 6px 20px rgba(16, 185, 129, 0.35),
      0 2px 8px rgba(5, 150, 105, 0.25);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 
      0 10px 30px rgba(16, 185, 129, 0.5),
      0 4px 12px rgba(5, 150, 105, 0.35),
      0 0 30px rgba(16, 185, 129, 0.3);
  }
}

@keyframes badge-shine {
  0% {
    transform: translate(-100%, -100%) rotate(45deg);
  }
  100% {
    transform: translate(100%, 100%) rotate(45deg);
  }
}

.help-subtitle-clean {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
}

/* Action Buttons */
.help-buttons-clean {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  position: relative;
  z-index: 2;
}

/* Desktop - Button spacing responsive */
@media (min-width: 1025px) and (max-width: 1279px) {
  .help-buttons-clean {
    gap: 1rem;
  }
}

@media (min-width: 1280px) and (max-width: 1439px) {
  .help-buttons-clean {
    gap: 1.125rem;
  }
}

@media (min-width: 1440px) and (max-width: 1919px) {
  .help-buttons-clean {
    gap: 1.25rem;
  }
}

@media (min-width: 1920px) {
  .help-buttons-clean {
    gap: 1.5rem;
  }
}

.ultra-help-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.375rem 1.75rem;
  border-radius: 20px;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 12px 35px rgba(0, 0, 0, 0.15),
    0 6px 18px rgba(0, 0, 0, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.ultra-help-btn:hover {
  transform: translateY(-8px) scale(1.05) rotate(-1deg);
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.25),
    0 15px 35px rgba(0, 0, 0, 0.18),
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    0 0 40px rgba(255, 255, 255, 0.3);
}

.ultra-help-btn:active {
  transform: translateY(-4px) scale(1.02);
  transition: all 0.15s ease;
}

.btn-inner-clean {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.btn-icon-clean {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ultra-help-btn:hover .btn-icon-clean {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 6px 20px rgba(255, 255, 255, 0.5));
}

.btn-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.btn-text-main {
  font-size: 1.125rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.25),
    0 1px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.ultra-help-btn:hover .btn-text-main {
  transform: translateX(3px);
  text-shadow: 
    0 3px 12px rgba(0, 0, 0, 0.35),
    0 2px 6px rgba(255, 255, 255, 0.3);
}

.btn-text-sub {
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.ultra-help-btn:hover .btn-text-sub {
  transform: translateX(3px);
  color: rgba(255, 255, 255, 1);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.25) 50%, 
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.7s ease;
}

.ultra-help-btn:hover .btn-glow {
  transform: translateX(100%);
}

/* PayPal Button Style - SUPER PREMIUM */
.paypal-btn-clean {
  background: linear-gradient(135deg, 
    #0070ba 0%, 
    #005a9a 50%,
    #003087 100%
  );
  border-color: rgba(0, 112, 186, 0.4);
  position: relative;
}

.paypal-btn-clean::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    transparent 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  border-radius: 20px;
}

.paypal-btn-clean:hover {
  background: linear-gradient(135deg, 
    #0086e6 0%, 
    #0070ba 50%,
    #004a7c 100%
  );
  border-color: rgba(0, 134, 230, 0.6);
  box-shadow: 
    0 25px 60px rgba(0, 112, 186, 0.4),
    0 15px 35px rgba(0, 48, 135, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.5),
    0 0 50px rgba(0, 134, 230, 0.5);
}

/* WhatsApp Button Style - SUPER PREMIUM */
.whatsapp-btn-clean {
  background: linear-gradient(135deg, 
    #25d366 0%, 
    #1ebe57 50%,
    #128c7e 100%
  );
  border-color: rgba(37, 211, 102, 0.4);
  position: relative;
}

.whatsapp-btn-clean::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    transparent 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  border-radius: 20px;
}

.whatsapp-btn-clean:hover {
  background: linear-gradient(135deg, 
    #34eb7a 0%, 
    #25d366 50%,
    #0f9d58 100%
  );
  border-color: rgba(52, 235, 122, 0.6);
  box-shadow: 
    0 25px 60px rgba(37, 211, 102, 0.4),
    0 15px 35px rgba(18, 140, 126, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.5),
    0 0 50px rgba(37, 211, 102, 0.5);
}

/* ============================================
   RESPONSIVE DESIGN - MOBILE & TABLET
   ============================================ */

@media (max-width: 768px) {
  .ultra-clean-help-box {
    padding: 2rem 1.75rem;
    border-radius: 20px;
    margin-top: 0.5rem;
  }

  .help-title-main {
    font-size: 1.5rem;
  }
  
  .help-badge-clean {
    padding: 0.4375rem 0.875rem;
    font-size: 0.8125rem;
  }

  .help-subtitle-clean {
    font-size: 0.9375rem;
  }

  .help-buttons-clean {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .ultra-help-btn {
    padding: 1.25rem 1.5rem;
  }

  .btn-icon-clean {
    width: 36px;
    height: 36px;
  }

  .btn-text-main {
    font-size: 1.0625rem;
  }

  .btn-text-sub {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .ultra-clean-help-box {
    padding: 1.75rem 1.5rem;
    border-radius: 18px;
    margin-top: 0.5rem;
  }

  .help-header-clean {
    margin-bottom: 1.375rem;
  }

  .help-title-main {
    font-size: 1.375rem;
  }

  .help-badge-clean {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .help-subtitle-clean {
    font-size: 0.875rem;
  }

  .help-buttons-clean {
    gap: 0.875rem;
  }

  .ultra-help-btn {
    padding: 1.125rem 1.375rem;
  }

  .btn-icon-clean {
    width: 32px;
    height: 32px;
  }

  .btn-text-main {
    font-size: 1rem;
  }

  .btn-text-sub {
    font-size: 0.75rem;
  }
}

/* ============================================
   DARK MODE SUPPORT
   ============================================ */

.dark .ultra-clean-help-box {
  background: linear-gradient(150deg, rgba(17, 24, 39, 0.96), rgba(30, 41, 59, 0.93));
  border: 1.5px solid rgba(59, 130, 246, 0.22);
  box-shadow:
    0 26px 64px rgba(8, 11, 24, 0.55),
    inset 0 1px 0 rgba(148, 163, 184, 0.18);
}

.dark .ultra-clean-help-box:hover {
  box-shadow:
    0 32px 72px rgba(8, 11, 24, 0.6),
    inset 0 1px 0 rgba(148, 163, 184, 0.24);
  border-color: rgba(96, 165, 250, 0.4);
}

.dark .ultra-clean-help-box::before {
  background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.25), transparent 70%);
}

.dark .ultra-clean-help-box::after {
  background: radial-gradient(circle at 75% 85%, rgba(167, 139, 250, 0.2), transparent 65%);
}

.dark .help-title-main {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .help-subtitle-clean {
  color: #94a3b8;
}

@media (max-width: 640px) {
  .ultra-clean-help-box {
    padding: 0.75rem 0.75rem 0.65rem 0.75rem;
    border-radius: 14px;
    margin-top: 0.2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .help-header-clean {
    margin-bottom: 0.6rem;
  }

  .help-title-main {
    font-size: 1.18rem;
  }
  
  .help-badge-clean {
    padding: 0.3rem 0.6rem;
    font-size: 0.68rem;
  }

  .help-subtitle-clean {
    font-size: 0.78rem;
  }

  .help-buttons-clean {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  .ultra-help-btn {
    padding: 0.7rem 0.85rem;
    min-height: 58px;
  }

  .btn-icon-clean {
    width: 24px;
    height: 24px;
  }

  .btn-text-main {
    font-size: 0.82rem;
  }

  .btn-text-sub {
    font-size: 0.64rem;
  }
}

@media (max-width: 480px) {
  .ultra-clean-help-box {
    padding: 0.65rem 0.65rem 0.55rem 0.65rem;
    border-radius: 12px;
  }

  .help-header-clean {
    margin-bottom: 0.55rem;
  }

  .help-title-main {
    font-size: 1.1rem;
  }

  .help-subtitle-clean {
    font-size: 0.72rem;
  }

  .ultra-help-btn {
    padding: 0.62rem 0.8rem;
    min-height: 54px;
  }

  .btn-icon-clean {
    width: 22px;
    height: 22px;
  }

  .btn-text-main {
    font-size: 0.78rem;
  }

  .btn-text-sub {
    font-size: 0.6rem;
  }
}

</style>

<template>
  <div class="relative" :data-net-mode="(net && net.slow) ? 'slow' : 'fast'">
    <!-- Banner Slider - SUPER CLEAN & RESPONSIVE - Spacing Presisi -->
    <div class="w-full relative z-0 pb-0 md:pb-0 px-2 sm:px-2 md:px-4 lg:px-6 hero-offset banner-container-zero">
      <div class="w-full max-w-7xl mx-auto relative z-1 banner-slider-wrapper">
        <BannerSlider />
      </div>
    </div>

    <!-- Kotak Bantuan - SUPER PREMIUM MODERN REDESIGN FULL WIDTH - TURUN LEBIH JAUH -->
    <div class="w-full pt-6 pb-4 px-2 sm:px-2 md:px-4 lg:px-6 sm:pt-6 md:pt-6 xl:pt-6 xl:pb-5 relative overflow-visible">
      <div class="w-full max-w-7xl mx-auto">
        <div class="ultra-clean-help-box">
          <!-- Header Section -->
          <div class="help-header-clean">
            <h3 class="help-title-clean">
              <span class="help-title-main">Butuh Bantuan?</span>
              <span class="help-badge-clean">24/7</span>
            </h3>
            <p class="help-subtitle-clean">Tim profesional kami siap membantu Anda kapan saja</p>
          </div>

          <!-- Action Buttons - Large & Clear -->
          <div class="help-buttons-clean">
            <NuxtLink
              to="/jasa-paypal"
              class="ultra-help-btn paypal-btn-clean"
            >
              <div class="btn-inner-clean">
                <UIcon name="i-mdi-paypal" class="btn-icon-clean" />
                <div class="btn-text-wrapper">
                  <span class="btn-text-main">Jasa PayPal</span>
                  <span class="btn-text-sub">Terpercaya & Aman</span>
                </div>
              </div>
              <div class="btn-glow"></div>
            </NuxtLink>
            
            <NuxtLink
              :to="whatsappHref"
              target="_blank"
              class="ultra-help-btn whatsapp-btn-clean"
            >
              <div class="btn-inner-clean">
                <img src="/icons/whatsapp-neo.svg" alt="WhatsApp" class="btn-icon-clean" loading="lazy" decoding="async" />
                <div class="btn-text-wrapper">
                  <span class="btn-text-main">Chat WhatsApp</span>
                  <span class="btn-text-sub">Respon Cepat</span>
                </div>
              </div>
              <div class="btn-glow"></div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Trusted Partners Section -->
    <div class="w-full pt-2 pb-3 px-2 sm:px-2 md:px-4 lg:px-6 sm:pt-4 md:pt-5 xl:pt-5 xl:pb-4">
      <div class="w-full max-w-7xl mx-auto">
        <ClientOnly>
          <LazyTrustedPartners :hydrate-on-visible="{ rootMargin: '0px 0px 600px 0px' }" />
        </ClientOnly>
      </div>
    </div>

    <!-- Sections Lainnya - SUPER CLEAN SPACING -->
    <div class="w-full pt-2 pb-0 px-2 sm:px-2 md:px-4 lg:px-6 sm:pt-4 md:pt-5 flex flex-col relative z-0 overflow-visible">
      <div class="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-7 lg:space-y-8 xl:space-y-9">
      <AboutSection class="mt-0 mb-0" />

      <LazySection rootMargin="0px 0px 600px 0px" minHeight="320px" class="mt-0">
        <CompanyProfileSection class="mt-0" />
      </LazySection>

      <LazySection rootMargin="0px 0px 600px 0px" minHeight="300px" class="mt-0">
        <InformationSection />
      </LazySection>

      <LazySection rootMargin="0px 0px 600px 0px" minHeight="300px" class="mt-0">
        <WhyWeSection class="mt-0" />
      </LazySection>

      <LazySection rootMargin="0px 0px 600px 0px" minHeight="380px" class="mt-0">
        <TestimoniSection />
      </LazySection>

      <LazySection rootMargin="0px 0px 600px 0px" minHeight="320px" class="mt-0">
        <FaqSection class="mt-0 mx-0" />
      </LazySection>

      <!-- REMOVED: Blog Articles Section from homepage -->
      
      <LazySection rootMargin="0px 0px 600px 0px" minHeight="200px" class="mt-0">
        <SeoKeywords class="mt-0" />
      </LazySection>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced spacing between sections - Super Keren & Seimbang */
.w-full.space-y-6 > * + * {
  margin-top: 1.5rem !important;
}

.w-full.space-y-8 > * + * {
  margin-top: 2rem !important;
}

/* Simple, always-visible homepage article images (no animation) */
.home-article-image-wrapper {
  position: relative;
  height: 12rem; /* h-48 */
  overflow: hidden;
  border-radius: 0.75rem 0.75rem 0 0;
  background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
}
.dark .home-article-image-wrapper {
  background: #111827;
}
.home-article-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.w-full.space-y-10 > * + * {
  margin-top: 2.5rem !important;
}

@media (min-width: 768px) {
  .w-full.space-y-6 > * + * {
    margin-top: 2rem !important;
  }

  .w-full.space-y-8 > * + * {
    margin-top: 2.5rem !important;
  }

  .w-full.space-y-10 > * + * {
    margin-top: 3rem !important;
  }
}

@media (min-width: 1024px) {
  .w-full.space-y-6 > * + * {
    margin-top: 2.5rem !important;
  }

  .w-full.space-y-8 > * + * {
    margin-top: 3rem !important;
  }

  .w-full.space-y-10 > * + * {
    margin-top: 3.5rem !important;
  }
}

/* Custom animation for WhatsApp icon */
@keyframes pulse-subtle {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

/* ============================================
   PROFESSIONAL CTA CONTAINER - MAIN STYLING
   This is for "Butuh Bantuan" box ONLY
   ============================================ */

.professional-cta-container {
  position: relative;
  overflow: hidden;
  
  /* Solid white background - no blur/transparency confusion */
  background: #ffffff !important;
  
  /* Subtle border and shadow */
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.05);
  
  /* Responsive width - controlled by inline style */
  /* width and max-width moved to inline style for better control */
}

/* Hover shimmer effect - subtle */
.professional-cta-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.8s ease;
  pointer-events: none;
  z-index: 1;
}

.professional-cta-container:hover::before {
  left: 100%;
}

/* Ensure content is above shimmer effect */
.professional-cta-container > * {
  position: relative;
  z-index: 2;
}

/* Professional Help Icon */
.professional-help-icon {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 
    0 10px 25px rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.professional-help-icon::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.professional-help-icon:hover::after {
  opacity: 1;
}


/* Button Container for Perfect Alignment - ULTIMATE FIX */
.button-container {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  width: 100% !important;
  justify-content: center !important;
  flex-direction: column !important;
}

@media (min-width: 768px) {
  .button-container {
    flex-direction: row !important;
    gap: 16px !important;
    width: auto !important;
    justify-content: flex-end !important;
  }
}

/* Professional Button Base - Ultra Precise with !important */
.professional-button {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.025em !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px) !important;
  
  /* Precise sizing with !important */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  width: 100% !important;
  height: 52px !important;
  padding: 0 16px !important;
  
  /* Text styling */
  color: white !important;
  text-decoration: none !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}

/* Button Icon - Precise Sizing */
.button-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 8px !important;
  flex-shrink: 0 !important;
  display: block !important;
}

/* Button Text - Precise Styling */
.button-text {
  font-weight: 700 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  flex: 1 !important;
  text-align: center !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  color: white !important;
  letter-spacing: 0.025em !important;
}

/* Force Button Equality - ULTIMATE FIX - Override scroll-buttons.css */
.professional-cta-container .paypal-button,
.professional-cta-container .whatsapp-button {
  width: 100% !important;
  height: 52px !important;
  min-width: 0 !important;
  max-width: none !important;
  flex: 1 1 0% !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 16px !important;
  /* Force identical sizing */
  min-height: 52px !important;
  max-height: 52px !important;
  /* Override scroll-buttons.css */
  border-radius: 12px !important;
  background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  z-index: 10 !important;
  transition: all 0.3s ease !important;
}

/* Mobile button optimization */
@media (max-width: 640px) {
  .professional-cta-container .paypal-button,
  .professional-cta-container .whatsapp-button {
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
    padding: 0 12px !important;
    font-size: 14px !important;
  }
  
  .professional-cta-container .button-icon {
    width: 18px !important;
    height: 18px !important;
  }
}

@media (max-width: 480px) {
  .professional-cta-container .paypal-button,
  .professional-cta-container .whatsapp-button {
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
    padding: 0 10px !important;
    font-size: 13px !important;
    border-radius: 10px !important;
  }
  
  .professional-cta-container .button-icon {
    width: 16px !important;
    height: 16px !important;
  }
}

/* ============================================
   DARK MODE SUPPORT FOR CTA CONTAINER - SIMPLIFIED
   ============================================ */

/* Dark mode - solid dark background */
.dark .professional-cta-container,
html.dark .professional-cta-container,
[data-theme="dark"] .professional-cta-container {
  background: #1f2937 !important;
  border-color: rgba(75, 85, 99, 0.5) !important;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.4),
    0 4px 10px rgba(0, 0, 0, 0.3) !important;
  color: #ffffff !important;
}

/* Dark mode - text colors */
.dark .professional-cta-container h3,
.dark .professional-cta-container p,
html.dark .professional-cta-container h3,
html.dark .professional-cta-container p {
  color: #ffffff !important;
}

/* Dark mode - icon gradient */
.dark .professional-cta-container .professional-help-icon,
html.dark .professional-cta-container .professional-help-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
}

@media (min-width: 768px) {
  .professional-cta-container .paypal-button,
  .professional-cta-container .whatsapp-button {
    width: 200px !important;
    height: 56px !important;
    min-width: 200px !important;
    max-width: 200px !important;
    min-height: 56px !important;
    max-height: 56px !important;
    flex: 0 0 200px !important;
    padding: 0 20px !important;
  }
}

/* Alternative Grid Layout for Perfect Alignment */
@media (min-width: 768px) {
  .professional-cta-container .button-container {
    display: grid !important;
    grid-template-columns: 200px 200px !important;
    gap: 16px !important;
    width: auto !important;
    justify-content: flex-end !important;
  }
  
  .professional-cta-container .paypal-button,
  .professional-cta-container .whatsapp-button {
    width: 200px !important;
    height: 56px !important;
    grid-column: auto !important;
  }
}

/* PayPal Button - Override scroll-buttons.css */
.professional-cta-container .paypal-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  width: 100% !important;
  height: 52px !important;
  min-height: 52px !important;
  max-height: 52px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.025em !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px) !important;
  color: white !important;
  padding: 0 16px !important;
  margin: 0 !important;
  flex: 1 1 0% !important;
  box-sizing: border-box !important;
}

.professional-cta-container .paypal-button:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
}

/* WhatsApp Button - Override scroll-buttons.css */
.professional-cta-container .whatsapp-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  width: 100% !important;
  height: 52px !important;
  min-height: 52px !important;
  max-height: 52px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.025em !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px) !important;
  color: white !important;
  padding: 0 16px !important;
  margin: 0 !important;
  flex: 1 1 0% !important;
  box-sizing: border-box !important;
}

.professional-cta-container .whatsapp-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
}

/* Shimmer Effect */
.professional-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.professional-button:hover::before {
  left: 100%;
}

/* Responsive Design - Ultra Precise with !important */
@media (min-width: 768px) {
  .professional-button {
    font-size: 15px !important;
  }
  
  .button-icon {
    width: 22px !important;
    height: 22px !important;
    margin-right: 10px !important;
  }
}

@media (max-width: 767px) {
  .professional-cta-container {
    padding: 1rem 1.25rem;
    gap: 1rem;
  }
  
  .professional-help-icon {
    size: 2.5rem;
  }
  
  .professional-button {
    height: 52px;
    padding: 0 16px;
    font-size: 14px;
  }
  
  .button-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}

@media (max-width: 480px) {
  .professional-cta-container {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }
  
  .professional-help-icon {
    size: 2.25rem;
  }
  
  .professional-button {
    height: 48px;
    padding: 0 14px;
    font-size: 13px;
  }
  
  .button-icon {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
}

/* Optimized banner fallback - Compact Size */
.banner-slider-fallback {
  width: 100%;
  height: 40vh;
  min-height: 300px;
  max-height: 450px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px solid #e2e8f0;
}
/* Removed overlay for cleaner appearance */
.banner-slider-fallback .carousel {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: inherit;
  overflow: hidden;
}

/* Optimized responsive fallback banner */
@media (max-width: 1200px) {
  .banner-slider-fallback {
    height: 35vh;
    min-height: 280px;
    max-height: 380px;
    border-radius: 14px;
  }
}

@media (max-width: 1024px) {
  .banner-slider-fallback {
    height: 32vh;
    min-height: 250px;
    max-height: 350px;
    border-radius: 12px;
  }
}

@media (max-width: 768px) {
  .banner-slider-fallback {
    height: 30vh;
    min-height: 220px;
    max-height: 320px;
    border-radius: 10px;
  }
  .banner-slider-fallback::before {
    background: rgba(0, 0, 0, 0.06);
  }
}

@media (max-width: 640px) {
  .banner-slider-fallback {
    height: 28vh;
    min-height: 200px;
    max-height: 300px;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .banner-slider-fallback {
    height: 25vh;
    min-height: 180px;
    max-height: 280px;
    border-radius: 6px;
  }
}

@media (max-width: 360px) {
  .banner-slider-fallback {
    height: 22vh;
    min-height: 160px;
    max-height: 250px;
    border-radius: 4px;
  }
}

</style>

