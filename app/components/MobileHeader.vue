<template>
  <div class="mobile-header-container">
    <!-- Modern Mobile Navigation -->
    <nav class="mobile-nav" :class="{ 'mobile-nav-scrolled': isScrolled }">
      <div class="mobile-container mobile-flex mobile-flex-between mobile-flex-center">
        <!-- Logo Section - ENHANCED VISIBILITY -->
        <div class="mobile-logo-section">
          <NuxtLink to="/" class="mobile-logo-link" @click="closeMobileMenu">
            <AppImage
              src="/logos/jasapembayaran.com.webp"
              alt="JasaPembayaran.com"
              class="mobile-logo"
              width="160"
              height="50"
              loading="eager"
              @error="handleLogoError"
            />
            <!-- Fallback text logo -->
            <div class="mobile-logo-fallback" v-if="logoError">
              <span class="mobile-logo-text">JasaPembayaran.com</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Action Buttons -->
        <div class="mobile-actions mobile-flex mobile-gap-sm">
          <!-- Enhanced Search Button -->
          <button
            class="mobile-btn mobile-btn-glass mobile-search-toggle"
            @click="toggleSearch"
            aria-label="Search"
            title="Search Articles"
          >
            <div class="mobile-search-icon-wrapper">
              <UIcon name="i-lucide-search" class="mobile-search-icon" />
            </div>
          </button>

          <!-- Enhanced Theme Toggle -->
          <button
            class="mobile-btn mobile-btn-glass mobile-theme-toggle"
            @click="toggleTheme"
            aria-label="Toggle theme"
            :title="colorMode.value === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <div class="mobile-theme-icon-wrapper">
              <UIcon 
                :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" 
                class="mobile-theme-icon" 
              />
            </div>
          </button>

          <!-- Enhanced Language Switcher -->
          <button
            class="mobile-btn mobile-btn-glass mobile-language-toggle"
            @click="toggleLanguage"
            aria-label="Change language"
            title="Change Language"
          >
            <div class="mobile-language-icon-wrapper">
              <UIcon name="i-lucide-languages" class="mobile-language-icon" />
            </div>
          </button>

          <!-- Enhanced Hamburger Menu -->
          <button
            class="mobile-btn mobile-btn-glass mobile-hamburger-btn"
            @click="toggleMobileMenu"
            :class="{ active: isMobileMenuOpen }"
            aria-label="Menu"
            aria-expanded="isMobileMenuOpen"
          >
            <div class="mobile-hamburger" :class="{ active: isMobileMenuOpen }">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Search Overlay -->
    <Transition
      enter-active-class="mobile-fade-in"
      leave-active-class="mobile-fade-out"
    >
      <div v-if="isSearchOpen" class="mobile-search-overlay">
        <div class="mobile-search-container">
          <div class="mobile-search-header mobile-flex mobile-flex-between mobile-flex-center">
            <h3 class="mobile-heading">Pencarian</h3>
            <button
              class="mobile-btn mobile-btn-glass"
              @click="closeSearch"
              aria-label="Close search"
            >
              <UIcon name="i-lucide-x" class="mobile-icon" />
            </button>
          </div>
          
          <div class="mobile-input-group">
            <input
              v-model="searchQuery"
              type="text"
              placeholder=" "
              class="mobile-input"
              @keyup.enter="performSearch"
              ref="searchInput"
            />
            <label>Cari layanan, informasi...</label>
          </div>
          
          <button
            class="mobile-btn mobile-btn-primary mobile-mt-lg"
            @click="performSearch"
          >
            <UIcon name="i-lucide-search" class="mobile-icon" />
            Cari
          </button>
        </div>
      </div>
    </Transition>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="mobile-fade-in"
      leave-active-class="mobile-fade-out"
    >
      <div
        v-if="isMobileMenuOpen"
        class="mobile-menu-overlay"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu Slide-out -->
    <Transition
      enter-active-class="mobile-slide-in-right"
      leave-active-class="mobile-slide-out-right"
    >
      <div
        v-if="isMobileMenuOpen"
        class="mobile-menu"
        @click.stop
      >
        <!-- Menu Header -->
        <div class="mobile-menu-header mobile-flex mobile-flex-between mobile-flex-center">
          <h2 class="mobile-heading">Menu</h2>
          <button
            class="mobile-btn mobile-btn-glass"
            @click="closeMobileMenu"
            aria-label="Close menu"
          >
            <UIcon name="i-lucide-x" class="mobile-icon" />
          </button>
        </div>

        <!-- Enhanced Menu Content -->
        <div class="mobile-menu-content">
          <!-- Settings Section - ADDED -->
          <div class="mobile-menu-section">
            <h3 class="mobile-menu-section-title">
              <UIcon name="i-lucide-settings" class="mobile-section-icon" />
              Pengaturan
            </h3>
            
            <!-- Language Toggle -->
            <div class="mobile-settings-item">
              <div class="mobile-settings-item-content">
                <UIcon name="i-lucide-languages" class="mobile-settings-icon" />
                <span class="mobile-settings-label">Bahasa</span>
              </div>
              <div class="mobile-language-toggle-container">
                <button 
                  @click="switchLanguage('id')" 
                  class="mobile-language-btn"
                  :class="{ active: currentLocale === 'id' }"
                >
                  ID
                </button>
                <button 
                  @click="switchLanguage('en')" 
                  class="mobile-language-btn"
                  :class="{ active: currentLocale === 'en' }"
                >
                  EN
                </button>
              </div>
            </div>
            
            <!-- Dark Mode Toggle -->
            <div class="mobile-settings-item">
              <div class="mobile-settings-item-content">
                <UIcon name="i-lucide-moon" class="mobile-settings-icon" />
                <span class="mobile-settings-label">Mode Gelap</span>
              </div>
              <button 
                @click="toggleTheme" 
                class="mobile-theme-toggle-btn"
                :class="{ active: colorMode.value === 'dark' }"
              >
                <div class="mobile-theme-toggle-slider"></div>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mobile-menu-section">
            <h3 class="mobile-menu-section-title">
              <UIcon name="i-lucide-zap" class="mobile-section-icon" />
              Aksi Cepat
            </h3>
            <div class="mobile-menu-grid">
              <NuxtLink
                to="/transaksi"
                class="mobile-menu-item mobile-card-enhanced"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-item-icon">
                  <UIcon name="i-lucide-hand-coins" class="mobile-menu-icon" />
                </div>
                <div class="mobile-menu-item-content">
                  <span class="mobile-menu-item-title">Transaksi Baru</span>
                  <span class="mobile-menu-item-desc">Mulai pembayaran</span>
                </div>
              </NuxtLink>
              
              <NuxtLink
                to="https://upload.jasapembayaran.com"
                target="_blank"
                class="mobile-menu-item mobile-card-enhanced"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-item-icon">
                  <UIcon name="i-lucide-upload" class="mobile-menu-icon" />
                </div>
                <div class="mobile-menu-item-content">
                  <span class="mobile-menu-item-title">Upload Bukti</span>
                  <span class="mobile-menu-item-desc">Kirim bukti pembayaran</span>
                </div>
              </NuxtLink>
              
              <NuxtLink
                to="https://testimonial.jasapembayaran.id"
                target="_blank"
                class="mobile-menu-item mobile-card-enhanced"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-item-icon">
                  <UIcon name="i-lucide-star" class="mobile-menu-icon" />
                </div>
                <div class="mobile-menu-item-content">
                  <span class="mobile-menu-item-title">Testimoni</span>
                  <span class="mobile-menu-item-desc">Ulasan pelanggan</span>
                </div>
              </NuxtLink>
              
              <NuxtLink
                to="/bukti-transaksi"
                class="mobile-menu-item mobile-card-enhanced"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-item-icon">
                  <UIcon name="i-lucide-file-check" class="mobile-menu-icon" />
                </div>
                <div class="mobile-menu-item-content">
                  <span class="mobile-menu-item-title">Bukti Transaksi</span>
                  <span class="mobile-menu-item-desc">Riwayat pembayaran</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Enhanced Navigation Links -->
          <div class="mobile-menu-section">
            <h3 class="mobile-menu-section-title">
              <UIcon name="i-lucide-navigation" class="mobile-section-icon" />
              Navigasi
            </h3>
            <nav class="mobile-menu-nav">
              <NuxtLink
                to="/"
                class="mobile-menu-link mobile-menu-link-enhanced"
                :class="{ active: route.path === '/' }"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-link-icon-wrapper">
                  <UIcon name="i-lucide-home" class="mobile-menu-link-icon" />
                </div>
                <div class="mobile-menu-link-content">
                  <span class="mobile-menu-link-title">Beranda</span>
                  <span class="mobile-menu-link-desc">Halaman utama</span>
                </div>
                <UIcon name="i-lucide-chevron-right" class="mobile-menu-link-arrow" />
              </NuxtLink>
              
              <NuxtLink
                to="/tentang-kami"
                class="mobile-menu-link mobile-menu-link-enhanced"
                :class="{ active: route.path.startsWith('/tentang-kami') }"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-link-icon-wrapper">
                  <UIcon name="i-lucide-info" class="mobile-menu-link-icon" />
                </div>
                <div class="mobile-menu-link-content">
                  <span class="mobile-menu-link-title">Tentang Kami</span>
                  <span class="mobile-menu-link-desc">Informasi perusahaan</span>
                </div>
                <UIcon name="i-lucide-chevron-right" class="mobile-menu-link-arrow" />
              </NuxtLink>
              
              <NuxtLink
                to="/informasi/transaksi"
                class="mobile-menu-link mobile-menu-link-enhanced"
                :class="{ active: route.path.startsWith('/informasi/transaksi') }"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-link-icon-wrapper">
                  <UIcon name="i-lucide-file-text" class="mobile-menu-link-icon" />
                </div>
                <div class="mobile-menu-link-content">
                  <span class="mobile-menu-link-title">Info Transaksi</span>
                  <span class="mobile-menu-link-desc">Detail pembayaran</span>
                </div>
                <UIcon name="i-lucide-chevron-right" class="mobile-menu-link-arrow" />
              </NuxtLink>
              
              <NuxtLink
                to="/informasi/rekening"
                class="mobile-menu-link mobile-menu-link-enhanced"
                :class="{ active: route.path.startsWith('/informasi/rekening') }"
                @click="closeMobileMenu"
              >
                <div class="mobile-menu-link-icon-wrapper">
                  <UIcon name="i-lucide-credit-card" class="mobile-menu-link-icon" />
                </div>
                <div class="mobile-menu-link-content">
                  <span class="mobile-menu-link-title">Info Rekening</span>
                  <span class="mobile-menu-link-desc">Detail bank</span>
                </div>
                <UIcon name="i-lucide-chevron-right" class="mobile-menu-link-arrow" />
              </NuxtLink>
            </nav>
          </div>

          <!-- Contact Section - ENHANCED -->
          <div class="mobile-menu-section">
            <h3 class="mobile-menu-section-title">
              <UIcon name="i-lucide-headphones" class="mobile-section-icon" />
              Kontak
            </h3>
            <div class="mobile-menu-contact">
              <a
                href="https://wa.me/628988888250"
                target="_blank"
                class="mobile-menu-contact-item mobile-contact-whatsapp"
                @click="closeMobileMenu"
              >
                <UIcon name="i-lucide-message-circle" class="mobile-menu-contact-icon" />
                <div>
                  <span class="mobile-menu-contact-label">Dukungan WhatsApp</span>
                  <span class="mobile-menu-contact-value">+62 898-8888-250</span>
                </div>
              </a>
              
              <a
                href="mailto:info@jasapembayaran.com"
                class="mobile-menu-contact-item mobile-contact-email"
                @click="closeMobileMenu"
              >
                <UIcon name="i-lucide-mail" class="mobile-menu-contact-icon" />
                <div>
                  <span class="mobile-menu-contact-label">Dukungan Email</span>
                  <span class="mobile-menu-contact-value">info@jasapembayaran.com</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Language Switcher Bottom Sheet -->
    <Transition
      enter-active-class="mobile-slide-in-up"
      leave-active-class="mobile-slide-out-down"
    >
      <div
        v-if="isLanguageOpen"
        class="mobile-bottom-sheet"
        @click.stop
      >
        <div class="mobile-bottom-sheet-handle"></div>
        
        <div class="mobile-bottom-sheet-content">
          <div class="mobile-flex mobile-flex-between mobile-flex-center mobile-mb-lg">
            <h3 class="mobile-heading">Pilih Bahasa</h3>
            <button
              class="mobile-btn mobile-btn-glass"
              @click="closeLanguage"
              aria-label="Close language selector"
            >
              <UIcon name="i-lucide-x" class="mobile-icon" />
            </button>
          </div>
          
          <div class="mobile-language-options">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              class="mobile-language-option mobile-language-option-enhanced"
              :class="{ active: locale.code === currentLocale }"
              @click="switchLanguage(locale.code)"
            >
              <div class="mobile-language-flag-wrapper">
                <span class="mobile-language-flag">{{ getFlagEmoji(locale.code) }}</span>
              </div>
              <div class="mobile-language-content">
                <span class="mobile-language-code">{{ locale.code.toUpperCase() }}</span>
                <span class="mobile-language-name">{{ locale.name }}</span>
              </div>
              <div class="mobile-language-status">
                <UIcon 
                  v-if="locale.code === currentLocale"
                  name="i-lucide-check-circle" 
                  class="mobile-language-check-enhanced" 
                />
                <div 
                  v-else
                  class="mobile-language-dot"
                ></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Action Buttons -->
    <div class="mobile-fab-container">
      <!-- WhatsApp FAB -->
      <Transition
        enter-active-class="mobile-scale-in"
        leave-active-class="mobile-scale-out"
      >
        <a
          href="https://wa.me/628988888250"
          target="_blank"
          class="mobile-fab mobile-fab-whatsapp"
          aria-label="WhatsApp Support"
        >
          <UIcon name="i-lucide-message-circle" class="mobile-fab-icon" />
        </a>
      </Transition>
      
      <!-- Scroll to Top FAB -->
      <Transition
        enter-active-class="mobile-scale-in"
        leave-active-class="mobile-scale-out"
      >
        <button
          v-if="showFloatingAction"
          class="mobile-fab mobile-fab-scroll"
          @click="scrollToTop"
          aria-label="Scroll to top"
        >
          <UIcon name="i-lucide-arrow-up" class="mobile-fab-icon" />
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useColorMode, useNuxtApp } from '#imports'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  isErrorPage: {
    type: Boolean,
    default: false
  }
})

// Composables
const route = useRoute()
const colorMode = useColorMode()
const { locale } = useI18n()

// Reactive state
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isLanguageOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()
const logoError = ref(false)

// Computed
const availableLocales = computed(() => [
  { code: 'id', name: 'Indonesia' },
  { code: 'en', name: 'English' }
])
const currentLocale = computed(() => locale.value)

const showFloatingAction = computed(() => {
  return !props.isErrorPage && isScrolled.value && route.path !== '/'
})

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
    // Close other overlays
    isSearchOpen.value = false
    isLanguageOpen.value = false
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSearch = async () => {
  isSearchOpen.value = !isSearchOpen.value
  
  if (isSearchOpen.value) {
    // Close other overlays
    isMobileMenuOpen.value = false
    isLanguageOpen.value = false
    
    await nextTick()
    searchInput.value?.focus()
  }
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // Navigate to search page with query
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    closeSearch()
  }
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  // Auto-close mobile menu when theme changes
  closeMobileMenu()
}

const toggleLanguage = () => {
  isLanguageOpen.value = !isLanguageOpen.value
  
  if (isLanguageOpen.value) {
    // Close other overlays
    isMobileMenuOpen.value = false
    isSearchOpen.value = false
  }
}

const closeLanguage = () => {
  isLanguageOpen.value = false
}

const switchLanguage = (localeCode: string) => {
  locale.value = localeCode
  closeLanguage()
  // Auto-close mobile menu when language changes
  closeMobileMenu()
}

const handleLogoError = () => {
  logoError.value = true
  console.log('Logo failed to load, showing fallback text')
}

const getFlagEmoji = (localeCode: string) => {
  const flags: Record<string, string> = {
    'id': '🇮🇩',
    'en': '🇺🇸'
  }
  return flags[localeCode] || '🌍'
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Keyboard handlers
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (isMobileMenuOpen.value) closeMobileMenu()
    if (isSearchOpen.value) closeSearch()
    if (isLanguageOpen.value) closeLanguage()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// Watch for route changes
watch(() => route.path, () => {
  closeMobileMenu()
  closeSearch()
  closeLanguage()
})
</script>

<style scoped>
/* Mobile Header Specific Styles */
.mobile-header-container {
  position: relative;
  z-index: 1000;
}

.mobile-logo {
  height: 50px;
  width: auto;
  min-width: 150px;
  max-width: 220px;
  transition: var(--mobile-transition);
  object-fit: contain;
  /* Ensure logo is always visible */
  filter: brightness(1) contrast(1);
}

.mobile-logo:hover {
  transform: scale(1.05);
}

/* SUPER PINTAR: Logo - Same Structure */
.mobile-logo {
  filter: var(--mobile-logo-filter);
  background: var(--mobile-logo-bg);
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

.mobile-logo:hover {
  filter: var(--mobile-logo-filter);
  background: var(--bg-tertiary);
  transform: scale(1.05);
}

/* SUPER PINTAR: Logo Section Container */
.mobile-logo-section {
  position: relative;
  z-index: 10;
  background: var(--bg-tertiary);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

.dark .mobile-logo-link {
  display: block;
  position: relative;
}


/* SUPER KEREN Logo Fallback Text */
.mobile-logo-fallback {
  display: none;
}

.dark .mobile-logo-fallback {
  display: block !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}

.mobile-logo-text {
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.3rem !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  white-space: nowrap;
}

/* SUPER KEREN Logo White Color Enhancement */
.dark .mobile-logo img,
.dark .mobile-logo svg,
.dark .mobile-logo {
  filter: brightness(0) invert(1) !important;
  color: #ffffff !important;
}

/* Ensure logo is always white in dark mode */
.dark .mobile-logo * {
  fill: #ffffff !important;
  color: #ffffff !important;
  stroke: #ffffff !important;
}

/* Responsive logo sizing - ORIGINAL */
@media (min-width: 375px) {
  .mobile-logo {
    height: 44px;
    min-width: 130px;
    max-width: 200px;
  }
}

@media (min-width: 414px) {
  .mobile-logo {
    height: 48px;
    min-width: 140px;
    max-width: 220px;
  }
}

@media (min-width: 768px) {
  .mobile-logo {
    height: 52px;
    min-width: 150px;
    max-width: 240px;
  }
}

.mobile-icon {
  width: 20px;
  height: 20px;
}

.mobile-fab-icon {
  width: 24px;
  height: 24px;
}

/* Enhanced Hamburger Menu Styles - SUPER KEREN untuk Light Mode */
.mobile-hamburger-btn {
  position: relative;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.3),
    0 2px 6px rgba(118, 75, 162, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.mobile-hamburger-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.mobile-hamburger-btn:hover::before {
  left: 100%;
}

.mobile-hamburger-btn:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 50%, #e082ea 100%);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.08) translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(102, 126, 234, 0.4),
    0 4px 10px rgba(118, 75, 162, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.mobile-hamburger-btn:active {
  transform: scale(1.05) translateY(0);
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.3),
    0 2px 6px rgba(118, 75, 162, 0.2);
}

.mobile-hamburger-btn.active {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 6px 18px rgba(79, 70, 229, 0.4),
    0 3px 9px rgba(124, 58, 237, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Dark mode override */
.dark .mobile-hamburger-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .mobile-hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
}

.dark .mobile-hamburger-btn.active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.mobile-hamburger {
  position: relative;
  width: 32px;
  height: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
}

.mobile-hamburger span {
  display: block;
  height: 5px;
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.mobile-hamburger.active span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.mobile-hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.mobile-hamburger.active span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* Responsive hamburger sizing */
@media (min-width: 375px) {
  .mobile-hamburger-btn {
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;
  }
  
  .mobile-hamburger {
    width: 34px;
    height: 28px;
  }
  
  .mobile-hamburger span {
    height: 5px;
  }
}

@media (min-width: 414px) {
  .mobile-hamburger-btn {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
  }
  
  .mobile-hamburger {
    width: 36px;
    height: 30px;
  }
  
  .mobile-hamburger span {
    height: 6px;
  }
}

@media (min-width: 768px) {
  .mobile-hamburger-btn {
    width: 60px;
    height: 60px;
    min-width: 60px;
    min-height: 60px;
  }
  
  .mobile-hamburger {
    width: 38px;
    height: 32px;
  }
  
  .mobile-hamburger span {
    height: 6px;
  }
}

/* Search Overlay */
.mobile-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1001;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
}

.mobile-search-container {
  background: var(--surface);
  border-radius: 16px;
  padding: var(--mobile-xl);
  margin: var(--mobile-md);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--glass-shadow);
}

/* Menu Styles */
.mobile-menu-header {
  padding: var(--mobile-lg);
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-menu-content {
  padding: var(--mobile-lg);
  background: linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(251,191,36,0.06) 100%);
}

.mobile-menu-section {
  margin-bottom: var(--mobile-xl);
}

.mobile-menu-section-title {
  font-size: var(--mobile-text-lg);
  font-weight: 600;
  color: var(--heading);
  margin-bottom: var(--mobile-md);
  padding-left: var(--mobile-sm);
  display: flex;
  align-items: center;
  gap: var(--mobile-sm);
}

.mobile-section-icon {
  width: 20px;
  height: 20px;
  color: var(--mobile-primary);
}

.mobile-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--mobile-md);
}

.mobile-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mobile-sm);
  padding: var(--mobile-lg);
  text-decoration: none;
  color: var(--text);
  transition: var(--mobile-transition);
}

.mobile-menu-item:hover {
  transform: translateY(-2px);
  color: var(--mobile-primary);
}

/* Enhanced Menu Items */
.mobile-card-enhanced {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--mobile-md);
  padding: var(--mobile-md);
  text-decoration: none;
  color: var(--text);
  background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.12));
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}
.mobile-card-enhanced:active {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.mobile-card-enhanced:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(16,185,129,0.18));
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.mobile-menu-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.mobile-menu-item-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.mobile-menu-item-desc {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.8;
}

.mobile-menu-icon {
  width: 24px;
  height: 24px;
  color: var(--mobile-primary);
}

.mobile-menu-nav {
  display: flex;
  flex-direction: column;
  gap: var(--mobile-xs);
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  padding: var(--mobile-md) var(--mobile-sm);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  transition: var(--mobile-transition);
}

.mobile-menu-link:hover {
  background: rgba(255, 122, 0, 0.1);
  color: var(--mobile-primary);
}

.mobile-menu-link.active {
  background: rgba(255, 122, 0, 0.15);
  color: var(--mobile-primary);
  font-weight: 600;
}

/* Enhanced Navigation Links */
.mobile-menu-link-enhanced {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  padding: var(--mobile-md);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5));
  border: 1px solid rgba(148, 163, 184, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
}

.mobile-menu-link-enhanced:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(59, 130, 246, 0.35);
  transform: translateX(4px);
  color: var(--mobile-primary);
}
.mobile-menu-link-enhanced:active {
  transform: translateX(6px);
  background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.18));
  border-color: rgba(59,130,246,0.45);
}

.mobile-menu-link-enhanced.active {
  background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(245,158,11,0.18));
  border-color: rgba(59, 130, 246, 0.45);
  color: var(--mobile-primary);
  font-weight: 600;
}

.mobile-menu-link-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.mobile-menu-link-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.mobile-menu-link-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.mobile-menu-link-desc {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.8;
}

.mobile-menu-link-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.mobile-menu-link-arrow {
  width: 16px;
  height: 16px;
  margin-left: auto;
  opacity: 0.5;
}

.mobile-menu-contact {
  display: flex;
  flex-direction: column;
  gap: var(--mobile-md);
}

.mobile-menu-contact-item {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  padding: var(--mobile-md);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  transition: var(--mobile-transition);
}

.mobile-menu-contact-item:hover {
  background: rgba(255, 122, 0, 0.1);
  color: var(--mobile-primary);
}

.mobile-menu-contact-icon {
  width: 20px;
  height: 20px;
  color: var(--mobile-primary);
}

.mobile-menu-contact-label {
  display: block;
  font-size: var(--mobile-text-sm);
  color: var(--text-secondary);
}

.mobile-menu-contact-value {
  display: block;
  font-weight: 600;
  color: var(--text);
}

/* Enhanced Language Options */
.mobile-language-options {
  display: flex;
  flex-direction: column;
  gap: var(--mobile-sm);
}

.mobile-language-option {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  padding: var(--mobile-md);
  border-radius: 12px;
  border: 2px solid transparent;
  background: transparent;
  color: var(--text);
  transition: var(--mobile-transition);
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.mobile-language-option:hover {
  background: rgba(255, 122, 0, 0.1);
  border-color: rgba(255, 122, 0, 0.2);
}

.mobile-language-option.active {
  background: rgba(255, 122, 0, 0.15);
  border-color: var(--mobile-primary);
  color: var(--mobile-primary);
}

/* Enhanced Language Option Styles */
.mobile-language-option-enhanced {
  display: flex;
  align-items: center;
  gap: var(--mobile-md);
  padding: var(--mobile-lg);
  border-radius: 16px;
  border: 2px solid rgba(148, 163, 184, 0.25);
  background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6));
  color: var(--text);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  width: 100%;
  text-align: left;
  backdrop-filter: blur(10px);
}

.mobile-language-option-enhanced:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.mobile-language-option-enhanced:active {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.mobile-language-option-enhanced.active {
  background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.2));
  border-color: rgba(59, 130, 246, 0.5);
  color: var(--mobile-primary);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.mobile-language-flag-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.mobile-language-flag {
  font-size: 28px;
  flex-shrink: 0;
}

.mobile-language-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.mobile-language-code {
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  letter-spacing: 1px;
}

.mobile-language-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-secondary);
  opacity: 0.8;
}

.mobile-language-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.mobile-language-check-enhanced {
  width: 24px;
  height: 24px;
  color: var(--mobile-primary);
}

.mobile-language-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

/* Enhanced Theme Toggle */
.mobile-theme-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-theme-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.mobile-theme-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.mobile-theme-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.mobile-theme-toggle:hover .mobile-theme-icon {
  transform: rotate(180deg);
}

/* Responsive theme toggle sizing */
@media (min-width: 375px) {
  .mobile-theme-toggle {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
  }
  
  .mobile-theme-icon-wrapper {
    width: 26px;
    height: 26px;
  }
  
  .mobile-theme-icon {
    width: 22px;
    height: 22px;
  }
}

@media (min-width: 414px) {
  .mobile-theme-toggle {
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;
  }
  
  .mobile-theme-icon-wrapper {
    width: 28px;
    height: 28px;
  }
  
  .mobile-theme-icon {
    width: 24px;
    height: 24px;
  }
}

@media (min-width: 768px) {
  .mobile-theme-toggle {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
  }
  
  .mobile-theme-icon-wrapper {
    width: 30px;
    height: 30px;
  }
  
  .mobile-theme-icon {
    width: 26px;
    height: 26px;
  }
}

/* Enhanced Search Button */
.mobile-search-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-search-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.mobile-search-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.mobile-search-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.mobile-search-toggle:hover .mobile-search-icon {
  transform: scale(1.1);
}

/* Responsive search button sizing */
@media (min-width: 375px) {
  .mobile-search-toggle {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
  }
  
  .mobile-search-icon-wrapper {
    width: 26px;
    height: 26px;
  }
  
  .mobile-search-icon {
    width: 22px;
    height: 22px;
  }
}

@media (min-width: 414px) {
  .mobile-search-toggle {
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;
  }
  
  .mobile-search-icon-wrapper {
    width: 28px;
    height: 28px;
  }
  
  .mobile-search-icon {
    width: 24px;
    height: 24px;
  }
}

@media (min-width: 768px) {
  .mobile-search-toggle {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
  }
  
  .mobile-search-icon-wrapper {
    width: 30px;
    height: 30px;
  }
  
  .mobile-search-icon {
    width: 26px;
    height: 26px;
  }
}

/* Enhanced Language Switcher Button */
.mobile-language-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-language-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.mobile-language-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.mobile-language-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.mobile-language-toggle:hover .mobile-language-icon {
  transform: rotate(15deg);
}

/* Responsive language switcher button sizing */
@media (min-width: 375px) {
  .mobile-language-toggle {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
  }
  
  .mobile-language-icon-wrapper {
    width: 26px;
    height: 26px;
  }
  
  .mobile-language-icon {
    width: 22px;
    height: 22px;
  }
}

@media (min-width: 414px) {
  .mobile-language-toggle {
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;
  }
  
  .mobile-language-icon-wrapper {
    width: 28px;
    height: 28px;
  }
  
  .mobile-language-icon {
    width: 24px;
    height: 24px;
  }
}

@media (min-width: 768px) {
  .mobile-language-toggle {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
  }
  
  .mobile-language-icon-wrapper {
    width: 30px;
    height: 30px;
  }
  
  .mobile-language-icon {
    width: 26px;
    height: 26px;
  }
}

/* Animation Classes */
.mobile-fade-out {
  animation: mobile-fade-out 0.3s ease-in-out;
}

@keyframes mobile-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.mobile-slide-in-right {
  animation: mobile-slide-in-right 0.3s var(--mobile-smooth);
}

@keyframes mobile-slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-slide-out-right {
  animation: mobile-slide-out-right 0.3s var(--mobile-smooth);
}

@keyframes mobile-slide-out-right {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

.mobile-slide-in-up {
  animation: mobile-slide-in-up 0.3s var(--mobile-smooth);
}

@keyframes mobile-slide-in-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.mobile-slide-out-down {
  animation: mobile-slide-out-down 0.3s var(--mobile-smooth);
}

@keyframes mobile-slide-out-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

.mobile-scale-out {
  animation: mobile-scale-out 0.3s var(--mobile-smooth);
}

@keyframes mobile-scale-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .mobile-menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .mobile-search-container {
    max-width: 500px;
  }
}

/* Dark mode adjustments */
.dark .mobile-search-container,
html.dark .mobile-search-container,
[data-theme="dark"] .mobile-search-container {
  background: #374151 !important;
  border: 1px solid #4b5563 !important;
  color: white !important;
}


.mobile-nav {
  background: var(--mobile-nav-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--mobile-nav-border);
}

.mobile-menu-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.mobile-menu-panel {
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
}

.mobile-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

/* SUPER PINTAR: GLOBAL CSS Variables System */
:root {
  /* Mobile Menu Variables */
  --mobile-menu-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --mobile-menu-content-bg: linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  --mobile-menu-border: transparent;
  --mobile-menu-shadow: none;
  --mobile-nav-bg: rgba(255, 255, 255, 0.95);
  --mobile-nav-border: rgba(229, 231, 235, 0.3);
  --mobile-logo-filter: none;
  --mobile-logo-bg: transparent;
  
  /* Global Color Variables */
  --text-primary: #374151;
  --text-secondary: #6b7280;
  --text-light: #9ca3af;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --border-primary: #e5e7eb;
  --border-secondary: #d1d5db;
  --border-light: #f3f4f6;
  
  /* Component Specific */
  --cta-bg: #ffffff;
  --cta-border: rgba(229, 231, 235, 0.5);
  --cta-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  --banner-bg: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.dark {
  /* Mobile Menu Variables */
  --mobile-menu-bg: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  --mobile-menu-content-bg: linear-gradient(180deg, rgba(31, 41, 55, 0.1) 0%, rgba(17, 24, 39, 0.1) 100%);
  --mobile-menu-border: 1px solid rgba(75, 85, 99, 0.3);
  --mobile-menu-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --mobile-nav-bg: rgba(31, 41, 55, 0.95);
  --mobile-nav-border: rgba(75, 85, 99, 0.3);
  --mobile-logo-filter: brightness(0) invert(1);
  --mobile-logo-bg: rgba(255, 255, 255, 0.1);
  
  /* Global Color Variables */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-light: rgba(255, 255, 255, 0.6);
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --bg-tertiary: rgba(255, 255, 255, 0.1);
  --border-primary: rgba(255, 255, 255, 0.2);
  --border-secondary: rgba(255, 255, 255, 0.3);
  --border-light: rgba(255, 255, 255, 0.1);
  
  /* Component Specific */
  --cta-bg: rgba(31, 41, 55, 0.95);
  --cta-border: rgba(75, 85, 99, 0.3);
  --cta-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  --banner-bg: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

/* SUPER PINTAR: Same CSS Structure, Only Colors Change */
.mobile-menu {
  background: var(--mobile-menu-bg);
  backdrop-filter: blur(20px);
  border: var(--mobile-menu-border);
  box-shadow: var(--mobile-menu-shadow);
}

.mobile-menu-content {
  background: var(--mobile-menu-content-bg);
}

/* SUPER PINTAR: Menu Header - Same Structure */
.mobile-menu-header {
  background: var(--bg-tertiary);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--border-primary);
  padding: 1rem 1.5rem;
  margin: -1rem -1rem 1rem -1rem;
}

.mobile-menu-header h2 {
  color: var(--text-primary);
  font-weight: 700;
}

/* SUPER PINTAR: Settings Section - Same Structure */
.mobile-settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
}

.mobile-settings-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-settings-icon {
  width: 20px;
  height: 20px;
  color: var(--text-primary);
}

.mobile-settings-label {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
}

/* SUPER PINTAR: Section Titles - Same Structure */
.mobile-menu-section-title {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

/* SUPER PINTAR: Menu Items - Same Structure */
.mobile-menu-link-title {
  color: var(--text-primary);
  font-weight: 600;
}

.mobile-menu-link-desc {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.mobile-menu-item-title {
  color: var(--text-primary);
  font-weight: 600;
}

.mobile-menu-item-desc {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.mobile-menu-contact-label {
  color: var(--text-primary);
  font-weight: 600;
}

.mobile-menu-contact-value {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* SUPER PINTAR: Language Toggle - Same Structure */
.mobile-language-toggle-container {
  display: flex;
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.mobile-language-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mobile-language-btn.active {
  background: #3b82f6;
  color: white;
}

/* Dark Mode Toggle - CLEAN STYLING */
.mobile-theme-toggle-btn {
  width: 50px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-theme-toggle-btn.active {
  background: #f59e0b;
}

.mobile-theme-toggle-slider {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mobile-theme-toggle-btn.active .mobile-theme-toggle-slider {
  transform: translateX(22px);
}

/* Contact Section - CLEAN STYLING */
.mobile-contact-whatsapp {
  background: #25d366;
}

.mobile-contact-email {
  background: #3b82f6;
}

/* FAB Container */
.mobile-fab-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  text-decoration: none;
}

.mobile-fab-whatsapp {
  background: #25d366;
}

.mobile-fab-scroll {
  background: #3b82f6;
}

.mobile-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.mobile-fab-icon {
  width: 24px;
  height: 24px;
  color: white;
}

/* Clean Dark Mode Styling */
</style>

