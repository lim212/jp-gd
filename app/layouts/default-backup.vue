<template>
  <div class="min-h-screen flex flex-col" :class="colorMode.value === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'">
    <ClientOnly>
      <ProfessionalLoadingScreen
        v-if="showLoader"
        :is-visible="showLoader"
        :approximate-duration-seconds="loaderDuration"
        :message="$t('loading.message')"
        @progress="onLoaderProgress"
        @finished="onLoaderFinished"
      />
      <ProfessionalLoadingScreen
        v-if="navLoading && !showLoader"
        :is-visible="navLoading"
        :approximate-duration-seconds="navLoaderDuration"
        :message="$t('loading.online_mode')"
        @progress="onNavLoaderProgress"
        @finished="onNavLoaderFinished"
      />
      <!-- Cache Update Notification -->
      <CacheUpdateNotification v-if="typeof window !== 'undefined'" />
      <!-- Developer Quick Actions (Only in Dev Mode) -->
      <DevQuickActions />
    </ClientOnly>
    <!-- Running Text (Marquee) - Clean Professional Design -->
    <div class="fixed left-0 w-full text-sm font-black z-80 py-1 px-2 overflow-hidden pointer-events-none shadow-lg running-text-container global-running-text" :style="{ top: '0px', whiteSpace: 'nowrap', position: 'fixed', height: '32px', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease', opacity: 1, visibility: 'visible', transform: 'translateY(0)', marginTop: '0px', paddingTop: '4px', paddingBottom: '4px' }">
      <!-- Subtle professional gradient background -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>
      <!-- Clean accent line -->
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-80"></div>
      <div class="animate-marquee" role="marquee" aria-label="Informasi berjalan">
        <div class="marquee-track inline-flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));"><path d="M3 10a1 1 0 011-1h2.382l6.724-3.362A2 2 0 0116 7.447V16.553a2 2 0 01-2.894 1.809L6.382 15H4a1 1 0 01-1-1v-4z"/><path d="M19 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z"/></svg>
          <span class="font-black tracking-wide marquee-text-glow" style="text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.3);">{{ $t('marquee.text') }}</span>
        </div>
        <div class="marquee-track inline-flex items-center gap-3" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));"><path d="M3 10a1 1 0 011-1h2.382l6.724-3.362A2 2 0 0116 7.447V16.553a2 2 0 01-2.894 1.809L6.382 15H4a1 1 0 01-1-1v-4z"/><path d="M19 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z"/></svg>
          <span class="font-black tracking-wide marquee-text-glow" style="text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.3);">{{ $t('marquee.text') }}</span>
        </div>
      </div>
    </div>

    <!-- Loading Indicator - Positioned below header menu -->
    <div
      v-if="miniLoaderActive"
      class="loading-indicator fixed left-0 w-full flex justify-center z-35 md:z-45"
      :class="{ 'opacity-0 scale-95': miniLoaderExpanding }"
      :style="{ top: showTopBars ? (isHeaderScrolled ? '80px' : '120px') : (isHeaderScrolled ? '40px' : '80px') }"
      role="status"
      aria-live="polite"
      aria-label="Memuat konten di latar belakang"
    >
      <div class="bg-gradient-to-r from-white via-red-50 to-violet-50 dark:from-gray-800 dark:via-red-900 dark:to-violet-900 border border-red-200 dark:border-red-700 rounded-lg px-4 py-2 shadow-lg">
        <div class="flex items-center space-x-2 text-xs">
          <!-- Compact spinner -->
          <div class="relative">
            <div class="w-4 h-4 border-2 border-transparent rounded-full loading-spinner-enhanced"></div>
            <div class="absolute inset-0 w-4 h-4 border-2 border-transparent rounded-full animate-ping" style="border-color: rgba(107, 114, 128, 0.4);"></div>
          </div>
          
          <!-- Compact loading text -->
          <div class="flex items-center space-x-1">
            <span class="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 dark:from-orange-400 dark:via-orange-300 dark:to-orange-500 bg-clip-text text-transparent font-semibold text-sm">
              Memuat
            </span>
            <span class="text-indigo-500 dark:text-indigo-400">...</span>
            <span v-if="miniLoaderPercent !== null" class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent font-bold text-sm">
              {{ Math.round(miniLoaderPercent) }}%
            </span>
          </div>
          
          <!-- Compact animated dots -->
          <div class="flex space-x-1">
            <div class="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
            <div class="w-1.5 h-1.5 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full animate-bounce" style="animation-delay: 200ms;"></div>
            <div class="w-1.5 h-1.5 bg-gradient-to-r from-orange-700 to-orange-800 rounded-full animate-bounce" style="animation-delay: 400ms;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header - Modern Premium Style -->
    <header class="fancy-header fixed left-0 w-full backdrop-blur-sm z-50 md:z-40 transition-all duration-300 global-header" :class="{ 'scrolled': isHeaderScrolled, 'dark-header': colorMode.value === 'dark' }" id="stickyHeader" :style="{ top: '32px', marginTop: 0, paddingTop: 0, borderTop: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }">
      <!-- Clean professional accent line -->
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60"></div>
      <!-- Desktop toggle for top bars -->
      <button
        v-show="isDesktop"
        @click="toggleTopBars"
        class="hidden lg:flex items-center justify-center absolute right-3 top-1.5 size-8 rounded-full border border-yellow-200 bg-white dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        :aria-expanded="showTopBars ? 'true' : 'false'"
        :title="showTopBars ? 'Sembunyikan bar atas' : 'Tampilkan bar atas'"
        aria-label="Toggle bar atas"
      >
        <UIcon :name="showTopBars ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-5 text-yellow-600" />
      </button>
      <!-- Top header with contact info - Premium Style -->
      <div v-show="showTopBars" class="hidden lg:block bg-gradient-to-r from-red-50 via-pink-50 to-emerald-50 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 py-0 relative">
        <!-- Clean professional gradient line -->
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-pink-500 via-emerald-500 to-amber-500 opacity-80 animate-gradient-shift"></div>
        <div class="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 lg:gap-0">
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-900 dark:text-white font-black tracking-wide">
            <a href="https://api.whatsapp.com/send/?phone=628988888250&amp;text=Halo+JasaPembayaran.com%2C+saya+ingin+konsultasi+tentang+jasa+PayPal&amp;type=phone_number&amp;app_absent=0" class="flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-105" target="_blank" rel="noopener noreferrer" aria-label="Hubungi via WhatsApp" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="truncate font-black text-sm tracking-wider">+62 898 8888 250</span>
            </a>
            <a href="mailto:admin@JasaPembayaran.com?subject=Halo%20JasaPembayaran.com" class="flex items-center hover:text-pink-600 dark:hover:text-pink-300 transition-all duration-300 hover:scale-105" aria-label="Kirim email ke admin@JasaPembayaran.com" title="Kirim email" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-pink-600 dark:text-pink-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="truncate font-black text-sm tracking-wider">admin@JasaPembayaran.com</span>
            </a>
          </div>
          <div class="flex items-center space-x-2 lg:space-x-3 whitespace-nowrap flex-nowrap">
            <a href="https://api.whatsapp.com/send/?phone=628988888250&amp;text=Halo+JasaPembayaran.com%2C+saya+ingin+konsultasi+tentang+jasa+PayPal&amp;type=phone_number&amp;app_absent=0" class="text-sm text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-105 font-black tracking-wide" target="_blank" rel="noopener noreferrer" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">BANTUAN</a>
            <span class="text-gray-600 dark:text-gray-400 hidden sm:inline font-black text-lg">|</span>
            <LanguageSwitcherComponent />
            <span class="text-gray-600 dark:text-gray-400 hidden sm:inline font-black text-lg">|</span>
            <DataSaverToggle />
          </div>
        </div>
      </div>

      <!-- Main header with logo and navigation - Premium Style -->
      <div :class="['relative', showTopBars ? 'bg-white dark:bg-gray-900 py-1 sm:py-2 md:py-3' : 'bg-white/95 dark:bg-gray-900/95 py-1 sm:py-1.5 md:py-2']">
        <!-- Clean professional accent line -->
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-50"></div>
        <div :class="['max-w-7xl mx-auto flex items-center justify-between flex-nowrap gap-2 sm:gap-3 md:gap-4', isBlogDetail ? 'px-2 sm:px-3 md:px-4 lg:px-6' : 'px-3 sm:px-4 md:px-6 lg:px-8']">
          <!-- Logo -->
          <div class="flex items-center relative z-10 flex-shrink-0">
            <a href="/" aria-label="JasaPembayaran.com" class="block">
              <LogoPro class="h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 w-auto transition-all duration-300 hover:scale-110 filter drop-shadow-lg dark:drop-shadow-xl hover:drop-shadow-2xl dark:brightness-0 dark:invert" />
            </a>
          </div>

          <!-- Desktop Navigation - Modern Premium Style (Enhanced) -->
          <nav class="hidden lg:flex items-center space-x-6 header-nav shrink-0 relative z-10" style="
            --nav-hover-bg: transparent;
            --nav-hover-text: var(--text);
            --nav-hover-shadow: none;
          ">
            <NuxtLink to="/" class="nav-link-clean" exact-active-class="is-active">{{ $t('navigation.home') }}</NuxtLink>
            <div class="relative group after:absolute after:left-0 after:right-0 after:top-full after:h-3 after:block after:content-['']">
              <button class="nav-link-clean flex items-center" :class="{ 'is-active': isInfoActive }" aria-haspopup="true" aria-expanded="false">
                {{ $t('navigation.information') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div class="dropdown-panel-super absolute left-0 top-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl py-4 px-6 text-sm space-y-3 z-50 ring-2 ring-indigo-200/50 dark:ring-indigo-700/30 invisible opacity-0 translate-y-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:translate-y-2 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-2 group-focus-within:scale-100 transition-all duration-300 mt-1 min-w-[220px] w-auto backdrop-blur-sm responsive-dropdown">
                <NuxtLink to="/tentang-kami" class="block dropdown-link-clean" active-class="is-active" exact-active-class="is-active">Jasa PayPal</NuxtLink>
                <NuxtLink to="/transaksi" class="block dropdown-link-clean" active-class="is-active" exact-active-class="is-active">{{ $t('navigation.online_transaction') }}</NuxtLink>
              </div>
            </div>
            <NuxtLink to="/jasa-paypal" class="nav-link-clean" active-class="is-active" exact-active-class="is-active">Jasa PayPal</NuxtLink>
            <a href="https://bukti.jasapembayaran.id/" class="nav-link-clean" target="_blank" rel="noopener noreferrer">{{ $t('navigation.transaction_proof') }}</a>
            <a href="https://testimonial.jasapembayaran.id/" class="nav-link-clean" target="_blank" rel="noopener noreferrer">{{ $t('navigation.testimonials') }}</a>
          </nav>

          <!-- Super Keren Icon dengan Dropdown Menu - Hanya muncul saat scroll -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-x-4 scale-95"
            enter-to-class="opacity-100 transform translate-x-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-x-0 scale-100"
            leave-to-class="opacity-0 transform translate-x-4 scale-95"
          >
            <div v-show="isHeaderScrolled" class="hidden lg:flex items-center gap-2 sm:gap-3 relative shrink-0 z-10">
            <!-- Super Keren Icon -->
            <div class="relative group">
              <button
                @click="toggleSuperIcon"
                class="super-icon-btn focus:outline-none p-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:scale-110 cursor-pointer"
                aria-label="Super Menu"
                :aria-expanded="showSuperIcon ? 'true' : 'false'"
                title="Super Menu"
                type="button"
                style="z-index: 1000;"
              >
                <span class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                <div class="relative z-10 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white transition-all duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                </div>
              </button>
              
              <!-- Super Keren Dropdown Menu -->
              <div v-if="showSuperIcon" class="super-dropdown absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl py-4 px-6 text-sm space-y-3 z-50 ring-2 ring-purple-200/50 dark:ring-purple-700/30 backdrop-blur-sm animate-dropdown-in">
                <!-- Header dengan gradient -->
                <div class="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-2">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="font-bold text-gray-900 dark:text-white text-lg">Quick Actions</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">Akses cepat ke fitur utama</p>
                </div>
                
                <!-- 3 Icon Utama -->
                <div class="grid grid-cols-3 gap-4 py-4">
                  <!-- Search Icon -->
                  <button
                    @click="toggleCompactSearch(); onCloseSuperIcon()"
                    class="super-icon-action flex flex-col items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 group"
                    title="Search"
                  >
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Search</span>
                  </button>
                  
                  <!-- Dark Mode Toggle -->
                  <button
                    @click="toggleColorMode(); onCloseSuperIcon()"
                    class="super-icon-action flex flex-col items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 group"
                    title="Toggle Dark Mode"
                  >
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Theme</span>
                    </button>
                  
                  <!-- Language Toggle -->
                  <button
                    @click="toggleLanguage(currentLanguage === 'id' ? 'en' : 'id'); onCloseSuperIcon()"
                    class="super-icon-action flex flex-col items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300 group"
                    title="Toggle Language"
                  >
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Language</span>
                  </button>
                    </div>
                
                <!-- Quick Stats -->
                <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ currentTime }}</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">Current Time</div>
                  </div>
                    <div class="text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ currentLanguage.toUpperCase() }}</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">Language</div>
                    </div>
                    </div>
                    </div>
                
                <!-- Footer dengan gradient -->
                <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="text-center">
                    <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-sm font-semibold">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                      Quick Access
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                </div>
              </Transition>

          <!-- Compact icon cluster (visible when top bars hidden) - REMOVED - Now using Super Menu -->

          <!-- Right: Search, Theme Toggle, Time & Register - Modern Premium Style -->
          <div v-show="showTopBars" class="hidden lg:flex items-center space-x-4 flex-nowrap relative z-10">
            <HeaderSearch v-show="!isHeaderScrolled" />
            <!-- Enhanced Theme Toggle Button -->
            <button
              @click="toggleColorMode"
              class="flex items-center justify-center size-10 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-emerald-500 hover:from-gray-600 hover:via-pink-600 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:rotate-12"
              :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
              style="box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4), 0 3px 12px rgba(236, 72, 153, 0.3), 0 1px 4px rgba(16, 185, 129, 0.2);"
            >
              <UIcon
                :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
                class="size-5 text-white filter drop-shadow-lg transition-all duration-300"
                style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"
              />
            </button>
            <!-- Desktop Time Display with Hover/Click Popover -->
            <div class="relative shrink-0" ref="desktopClockRef" @mouseenter="onDesktopClockEnter" @mouseleave="onDesktopClockLeave" @focusin="onDesktopClockEnter" @focusout="onDesktopClockLeave" @touchstart.stop="onDesktopClockEnter" @touchend="onDesktopClockLeave">
              <button
                type="button"
                @click="toggleDesktopClockPopover"
                class="group text-base font-black text-white bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center leading-none whitespace-nowrap focus:outline-none ring-2 ring-emerald-300/60 dark:ring-emerald-700/40 border-2 border-emerald-400/30"
                :class="showDesktopClockInfo ? 'shadow-lg scale-105' : ''"
                :aria-expanded="showDesktopClockInfo ? 'true' : 'false'"
                aria-controls="desktop-clock-popover"
                aria-label="Waktu Jakarta"
              >
                <UIcon name="i-lucide-clock" class="size-5 mr-2 text-purple-100" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));" />
                <span class="transition-colors duration-200 font-black text-base tracking-wider" style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);">{{ currentTime }} WIB</span>
              </button>
              <Transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-1 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-1 scale-95"
              >
                <div
                  v-if="showDesktopClockInfo"
                  id="desktop-clock-popover"
                  role="tooltip"
                  class="absolute right-0 top-full mt-2 z-[60] w-[300px] rounded-xl border border-red-200 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl p-4"
                >
                  <button
                    @click="hideDesktopClockPopover"
                    class="absolute top-1 right-1 p-1.5 sm:p-2 rounded-full bg-white ring-1 ring-red-200/70 shadow-sm hover:bg-red-50 hover:ring-red-300 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                    aria-label="Tutup"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div class="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {{ jakartaDate }}
                    </div>
                  </div>
                      <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                        <UIcon name="i-lucide-bar-chart-3" class="size-4 text-indigo-600 dark:text-indigo-300" />
                        <div class="leading-tight">
                          <div class="text-[10px] text-gray-600 dark:text-gray-200">Kunjungan Keseluruhan</div>
                          <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vTotal) }}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                        <UIcon name="i-lucide-users" class="size-4 text-indigo-600 dark:text-indigo-300" />
                        <div class="leading-tight">
                          <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Online</div>
                          <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vOnline) }}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                        <UIcon name="i-lucide-bot" class="size-4 text-indigo-600 dark:text-indigo-300" />
                        <div class="leading-tight">
                          <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Robot</div>
                          <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vOnlineRobots) }}</div>
                        </div>
                      </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Mobile Right: Time + Menu (Mobile Only) -->
          <div class="lg:hidden flex items-center gap-2 sm:gap-3 relative shrink-0 z-10" ref="mobileClockRef">
            <button
              type="button"
              @click="onClockButtonClick"
              @mouseenter="onMobileClockEnter"
              @mouseleave="onMobileClockLeave"
              @focus="onMobileClockEnter"
              @blur="onMobileClockLeave"
              class="group text-xs sm:text-sm font-bold text-white flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-md sm:rounded-lg md:rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 active:shadow-inner transition-all duration-300 focus:outline-none ring-1 ring-emerald-300/50 dark:ring-emerald-700/40 border border-emerald-400/30 hover:scale-105"
              :class="showMobileClockInfo ? 'shadow-lg scale-105' : ''"
              :aria-expanded="showMobileClockInfo ? 'true' : 'false'"
              aria-controls="mobile-clock-popover"
              aria-label="Waktu Jakarta"
            >
              <UIcon name="i-lucide-clock" class="size-3 sm:size-3.5 md:size-4 mr-1 sm:mr-1.5 text-emerald-100" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));" />
              <span class="whitespace-nowrap font-bold text-xs sm:text-sm tracking-wide" style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);">{{ currentTime }} WIB</span>
            </button>
            <!-- Mobile overlay for easy outside tap to close -->
            <div v-if="showMobileClockInfo" class="fixed inset-0 z-[55] bg-black/30 lg:hidden" role="presentation" aria-hidden="true" @click="hideMobileClockPopover"></div>
            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 translate-y-1 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-1 scale-95"
            >
              <div
                v-if="showMobileClockInfo"
                id="mobile-clock-popover"
                role="dialog"
                aria-modal="true"
                class="absolute right-0 top-full mt-2 z-[60] w-[92vw] max-w-[420px] max-h-[65vh] rounded-2xl border border-red-200 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-2xl p-4 overflow-y-auto"
              >
                <div class="mx-auto mb-2 h-1.5 w-10 rounded-full bg-gray-300/70 dark:bg-gray-700/70"></div>
                <button
                  @click="hideMobileClockPopover"
                  class="absolute top-1 right-1 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur ring-1 ring-red-200/70 shadow-sm hover:bg-red-50 hover:ring-red-300 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                  aria-label="Tutup"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {{ jakartaDate }}
                  </div>
                </div>
                <div class="mt-1 space-y-1.5">
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-server" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">{{ ipAddress }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-globe" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">{{ countryName }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-smartphone" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">{{ deviceOS }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-compass" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">{{ browserName }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon :name="deviceIconName" class="size-4 text-indigo-600 dark:text-indigo-300" :title="deviceIconLabel" aria-label="Perangkat" />
                    <span class="font-medium">{{ deviceIconLabel }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-activity" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">Kualitas Jaringan: <span :class="networkQualityColor">{{ networkQuality }}</span></span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-wifi" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">ISP: {{ ispName }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-monitor" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">Screen Size: {{ screenSize }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-shield" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">Proxy: {{ proxyStatus }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-shield" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">VPN: {{ vpnStatus }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-cookie" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">Cookie: {{ cookiesEnabled ? 'Enable' : 'Disable' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <UIcon name="i-lucide-code-2" class="size-4 text-indigo-600 dark:text-indigo-300" />
                    <span class="font-medium">Javascript: {{ jsEnabled ? 'Enable' : 'Disable' }}</span>
                  </div>
                </div>
                <div class="mt-3 pt-2 border-t border-red-200/70 dark:border-red-800/50">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-eye" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Kunjungan Hari Ini</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vHitsToday) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-users" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Hari Ini</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vToday) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-calendar" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Kunjungan Bulan Ini</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vHitsMonth) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-users" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Bulan Ini</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vMonth) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-calendar" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Tahun Ini</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vYear) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-bar-chart-3" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Kunjungan Keseluruhan</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vTotal) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-users" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Online</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vOnline) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-2 py-1.5">
                      <UIcon name="i-lucide-bot" class="size-4 text-indigo-600 dark:text-indigo-300" />
                      <div class="leading-tight">
                        <div class="text-[10px] text-gray-600 dark:text-gray-200">Visitor Robot</div>
                        <div class="text-xs font-semibold text-gray-900 dark:text-white">{{ nf(vOnlineRobots) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
            <button
              id="mobile-menu-btn"
              @click="onToggleMobileMenu"
              class="focus:outline-none p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-r from-gray-600 via-pink-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-gray-700 hover:via-pink-700 hover:to-emerald-700 transition-all duration-300 relative overflow-hidden group border border-gray-500/20 hover:border-pink-400/30 cursor-pointer"
              aria-label="Menu"
              :aria-expanded="toggleMobile ? 'true' : 'false'"
              aria-controls="mobile-menu-panel"
              title="Menu"
              type="button"
              style="z-index: 1000;"
            >
              <span class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md sm:rounded-lg md:rounded-xl"></span>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:text-white relative z-10 transition-all duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown - Modern Premium Style -->
      <Teleport to="body">
        <div v-if="toggleMobile" class="lg:hidden fixed inset-0 z-[9999] bg-black bg-opacity-60 transition-all duration-300" @mousedown.self.stop="onCloseMobileMenu" @touchstart.self.stop="onCloseMobileMenu" @pointerdown.self.stop="onCloseMobileMenu" @click.self.stop.prevent="onCloseMobileMenu">
        <div class="mobile-nav bg-white dark:bg-gray-900 h-full w-[90%] sm:w-[85%] max-w-sm overflow-y-auto fixed top-0 right-0 shadow-2xl border-l border-indigo-500/30 animate-slide-in mobile-menu-fixed">
          <!-- Mobile menu header with close button -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 mt-6 sm:mt-8 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
            <div class="flex items-center mr-6">
              <a href="/" aria-label="JasaPembayaran.com">
                <img src="/logo-jasapembayaran.png" alt="Logo" class="h-10 sm:h-12 w-auto transition-all duration-300 hover:scale-110 hover:brightness-125 hover:contrast-150 hover:drop-shadow-2xl dark:brightness-0 dark:invert" loading="lazy" decoding="async" fetchpriority="low" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)) brightness(1.1) contrast(1.25);" />
              </a>
            </div>
            <div class="flex items-center">
              <button
                @click="onCloseMobileMenu"
                class="focus:outline-none p-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:scale-105">
                <span class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                <svg class="w-6 h-6 text-white relative z-10 transition-all duration-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search bar - Modern Premium Style -->
          <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="relative">
              <input
                type="text"
                placeholder="Cari..."
                class="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Navigation links - Modern Premium Style -->
          <div class="px-4 py-2">
            <NuxtLink to="/" @click="onCloseMobileMenu" class="mobile-link flex items-center py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg px-3 my-1 transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="font-semibold text-gray-900 dark:text-white text-base tracking-wide group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Beranda</span>
            </NuxtLink>

            <NuxtLink to="/tentang-kami" @click="onCloseMobileMenu" class="mobile-link flex items-center py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg px-3 my-1 transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-green-500 group-hover:text-green-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-semibold text-gray-900 dark:text-white text-base tracking-wide group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Tentang Kami</span>
            </NuxtLink>

            <NuxtLink to="/informasi/transaksi" @click="onCloseMobileMenu" class="mobile-link flex items-center py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg px-3 my-1 transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-purple-500 group-hover:text-purple-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-semibold text-gray-900 dark:text-white text-base tracking-wide group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Info Transaksi</span>
            </NuxtLink>

            <NuxtLink to="/informasi/rekening" @click="onCloseMobileMenu" class="mobile-link flex items-center py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg px-3 my-1 transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span class="font-semibold text-gray-900 dark:text-white text-base tracking-wide group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Info Rekening</span>
            </NuxtLink>

            <!-- Settings Section -->
            <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Pengaturan</h3>
              
              <!-- Language Toggle -->
              <div class="mb-4">
                <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">Bahasa</span>
                  </div>
                  <div class="flex bg-white dark:bg-gray-700 rounded-lg p-1">
                    <button 
                      @click="toggleLanguage('id'); onCloseMobileMenu()" 
                      class="px-3 py-1 text-xs font-semibold rounded-md transition-all duration-300"
                      :class="currentLanguage === 'id' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
                    >
                      ID
                    </button>
                    <button 
                      @click="toggleLanguage('en'); onCloseMobileMenu()" 
                      class="px-3 py-1 text-xs font-semibold rounded-md transition-all duration-300"
                      :class="currentLanguage === 'en' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <!-- Theme Toggle -->
              <div class="mb-4">
                <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center">
                    <UIcon
                      :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
                      class="size-5 mr-2"
                      :class="colorMode.value === 'dark' ? 'text-yellow-500' : 'text-indigo-500'"
                    />
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ colorMode.value === 'dark' ? 'Mode Terang' : 'Mode Gelap' }}
                    </span>
                  </div>
                  <button
                    @click="toggleColorMode(); onCloseMobileMenu()"
                    class="relative w-12 h-6 rounded-full transition-colors duration-300"
                    :class="colorMode.value === 'dark' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gray-300'"
                  >
                    <div
                      class="absolute top-1 w-4 h-4 rounded-full transition-all duration-300 bg-white shadow-sm"
                      :class="colorMode.value === 'dark' ? 'right-1' : 'left-1'"
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Contact Section -->
            <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Kontak</h3>
              <div class="space-y-3">
                <a href="https://wa.me/6281234567890" target="_blank" class="flex items-center py-3 px-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30 rounded-lg transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-green-500 group-hover:text-green-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span class="font-semibold text-gray-900 dark:text-white text-base group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Dukungan WhatsApp</span>
                </a>
                
                <a href="mailto:support@jasapembayaran.com" class="flex items-center py-3 px-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-800/30 rounded-lg transition-all duration-300 group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="font-semibold text-gray-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Dukungan Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Teleport>
    </header>

    <!-- Main Content - Auto responsive spacing -->
    <main class="flex-1 pt-0 sm:pt-1 md:pt-2 lg:pt-3 xl:pt-4 2xl:pt-6 banner-slide-container">
      <div :class="['w-full mx-auto lg:max-w-7xl banner-content-wrapper', isBlogDetail ? 'px-2 sm:px-3 md:px-4 lg:px-6' : 'px-2 sm:px-3 md:px-4 lg:px-6']">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer (immediate load to fix missing footer issue) -->
    <div ref="footerSentinel" aria-hidden="true" class="h-px w-px"></div>
    <ClientOnly>
      <AppFooter />
    </ClientOnly>

    <!-- Global Floating Home button - REMOVED to avoid overlap with WhatsApp icon -->
    
    <!-- Floating Actions (WhatsApp & Scroll Buttons) - DISABLED to prevent double icons -->
    <!-- <ClientOnly>
      <FloatingActionButtons />
    </ClientOnly> -->

    <!-- Professional Image Popup Modal -->
    <ClientOnly>
      <ProfessionalImagePopup
        :is-open="popupState.isOpen"
        :image-src="popupState.imageSrc"
        :image-alt="popupState.imageAlt"
        :title="popupState.title"
        :description="popupState.description"
        @close="closePopup"
      />
    </ClientOnly>
  </div>
</template>

<!-- Navigation hover fix removed -->

<style scoped>
/* Professional Modal Styles */
body.modal-open {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
}

/* Clean Professional Design - No Heavy Animations */

/* Clean Running Text Container - Professional & Fast */
.running-text-container {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  transform: translateY(0) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 80 !important;
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 44px !important;
  margin: 0 !important;
  padding: 8px 16px !important;
  box-sizing: border-box !important;
  border-top: 2px solid #374151 !important;
  border-bottom: 2px solid #374151 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}

/* Clean Professional Banner Slide Styling */
.banner-slide-container {
  position: relative;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.banner-content-wrapper {
  position: relative;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0 0 12px 12px;
  background: rgba(255,255,255,0.03);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.banner-content-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: rgba(255,255,255,0.15);
}

/* Clean Professional Design - No Heavy Animations */

/* Clean Dark Mode Adjustments */
.dark .banner-slide-container {
  background: rgba(0,0,0,0.1);
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.dark .banner-content-wrapper {
  background: rgba(0,0,0,0.05);
  border: 1px solid rgba(255,255,255,0.08);
}

.dark .banner-content-wrapper:hover {
  border-color: rgba(255,255,255,0.12);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import { useColorMode, useRoute, useRouter } from '#imports'
import { useImagePopup } from '~/composables/useImagePopup'
import { useI18n } from 'vue-i18n'
import { useVisitors } from '~~/composables/useVisitors'
import HeaderSearch from '~/components/HeaderSearch.vue'
import ProfessionalLoadingScreen from '~/components/ProfessionalLoadingScreen.vue'
import ProfessionalImagePopup from '~/components/ProfessionalImagePopup.vue'
import LanguageSwitcherComponent from '../../LanguageSwitcherComponent.vue'
import DataSaverToggle from '~/components/DataSaverToggle.vue'
import FloatingActionButtons from '../../components/FloatingActionButtons.vue'
import AppFooter from '~/components/AppFooter.vue'

// Footer sentinel (kept for potential future use)
const footerSentinel = ref(null)

// Floating Home button removed to avoid overlap with WhatsApp icon
const route = useRoute()

// Full-width mobile for blog detail only (e.g., /blog/my-slug)
const isBlogDetail = computed(() => {
  const p = route.path || ''
  const parts = p.split('/').filter(Boolean)
  return parts.length === 2 && parts[0] === 'blog' && parts[1] !== 'search'
})


// Active state for "Informasi" menu when on related pages
const isInfoActive = computed(() => {
  const p = route.path || ''
  return p.startsWith('/tentang-kami') || p.startsWith('/transaksi') || p.startsWith('/informasi')
})

// Desktop header collapse / expand state
const isDesktop = ref(true)
function updateIsDesktop() {
  try {
    isDesktop.value = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  } catch {
    isDesktop.value = true
  }
}

const userExpandedTopBars = ref(false)
const isCompactHeader = ref(false)
const isHeaderScrolled = ref(false)
const headerStyle = computed(() => ({
  top: '32px',
  marginTop: 0,
  paddingTop: 0,
  borderTop: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
}))
const showTopBars = computed(() => {
  return !isDesktop.value ? true : (userExpandedTopBars.value || !isCompactHeader.value)
})

// Keep page content correctly offset below the fixed header (and marquee)
const headerEl = ref(null)
function updateHeaderOffsetVar() {
  try {
    const h = headerEl.value
    let total = 0
    if (h && typeof window !== 'undefined') {
      const rect = h.getBoundingClientRect()
      total = Math.max(0, Math.round(rect.bottom))
    } else if (h) {
      const cs = window.getComputedStyle(h)
      const headerTop = parseFloat((cs && cs.top) ? cs.top : '0') || 0
      const hH = h.offsetHeight || 0
      total = Math.max(0, Math.round(headerTop + hH))
    }
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-header-offset', `${total}px`)
    }
  } catch {}
}

function handleScroll() {
  try {
    const y = typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop || 0) : 0
    const threshold = 20
    
    // Set header scrolled state for all devices
    const wasScrolled = isHeaderScrolled.value
    isHeaderScrolled.value = y > threshold
    
    // Debug log for running text responsiveness
    if (wasScrolled !== isHeaderScrolled.value) {
      console.log(`Header scroll state changed: ${isHeaderScrolled.value ? 'SCROLLED' : 'NORMAL'} (scrollY: ${y})`)
    }
    
    // Set compact header state only for desktop
    if (!isDesktop.value) { 
      isCompactHeader.value = false
      return 
    }
    isCompactHeader.value = y > threshold
  } catch {
    isCompactHeader.value = false
    isHeaderScrolled.value = false
  }
}

// HEADER SCROLL FIX - Mencegah header lari ke kanan saat scroll
const fixHeaderPosition = () => {
  const header = document.querySelector('.fancy-header')
  
  if (header) {
    // Force header positioning yang stabil
    header.style.position = 'fixed'
    header.style.left = '0'
    header.style.right = '0'
    header.style.width = '100%'
    header.style.transform = 'translateX(0)'
    header.style.margin = '0'
    header.style.padding = '0'
    header.style.boxSizing = 'border-box'
  }
}

// RESPONSIVE DROPDOWN POSITIONING - Fix dropdown positioning untuk semua layar
const updateDropdownPosition = () => {
  const dropdown = document.querySelector('.responsive-dropdown')
  const trigger = document.querySelector('.group')
  
  if (dropdown && trigger) {
    const triggerRect = trigger.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const dropdownWidth = 220 // min-width dari dropdown
    
    // Calculate optimal position
    let left = triggerRect.left
    let right = 'auto'
    
    // Check if dropdown would overflow to the right
    if (left + dropdownWidth > viewportWidth - 20) {
      // Position to the right edge
      left = 'auto'
      right = '20px'
    }
    
    // Check if dropdown would overflow to the left
    if (left < 20) {
      left = '20px'
      right = 'auto'
    }
    
    // Apply positioning
    dropdown.style.left = typeof left === 'number' ? `${left}px` : left
    dropdown.style.right = right
    dropdown.style.top = `${triggerRect.bottom + 8}px`
  }
}

onMounted(() => {
  updateIsDesktop()
  handleScroll()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsDesktop)
    window.addEventListener('orientationchange', updateIsDesktop)
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Add dropdown positioning listeners
    window.addEventListener('scroll', updateDropdownPosition, { passive: true })
    window.addEventListener('resize', updateDropdownPosition, { passive: true })
    // Add header positioning listeners
    window.addEventListener('scroll', fixHeaderPosition, { passive: true })
    window.addEventListener('resize', fixHeaderPosition, { passive: true })
    // Initial header positioning fix
    fixHeaderPosition()
  }
  
  // Ensure running text is visible on mount
  nextTick(() => {
    const runningTextEl = document.querySelector('.running-text-container')
    if (runningTextEl) {
      runningTextEl.style.display = 'flex'
      runningTextEl.style.alignItems = 'center'
      runningTextEl.style.opacity = '1'
      runningTextEl.style.visibility = 'visible'
      console.log('Running text initialized and visible')
    }
  })
})

onBeforeUnmount(() => {
  try {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateIsDesktop)
      window.removeEventListener('orientationchange', updateIsDesktop)
      window.removeEventListener('scroll', handleScroll)
      // Remove dropdown positioning listeners
      window.removeEventListener('scroll', updateDropdownPosition)
      window.removeEventListener('resize', updateDropdownPosition)
      // Remove header positioning listeners
      window.removeEventListener('scroll', fixHeaderPosition)
      window.removeEventListener('resize', fixHeaderPosition)
    }
  } catch {}
})

// Reset expanded state on route change
watch(() => route.fullPath, () => { userExpandedTopBars.value = false })

// Watch for scroll state changes to ensure running text always visible and never overlapped
watch(isHeaderScrolled, (newVal, oldVal) => {
  console.log(`Header scroll state: ${newVal ? 'SCROLLED' : 'NORMAL'} - Running text always visible at top`)
  // Force DOM update for running text - Always keep visible and never overlapped
  nextTick(() => {
    const runningTextEl = document.querySelector('.running-text-container')
    const headerEl = document.querySelector('.fancy-header')
    
    if (runningTextEl) {
      // Always keep running text visible and positioned at top
      runningTextEl.style.display = 'flex'
      runningTextEl.style.alignItems = 'center'
      runningTextEl.style.opacity = '1'
      runningTextEl.style.visibility = 'visible'
      runningTextEl.style.transform = 'translateY(0)'
      runningTextEl.style.top = '0px'
      runningTextEl.style.zIndex = '80'
      runningTextEl.style.position = 'fixed'
      runningTextEl.style.width = '100%'
      runningTextEl.style.height = '44px'
      runningTextEl.style.margin = '0'
      runningTextEl.style.padding = '8px 16px'
      runningTextEl.style.boxSizing = 'border-box'
    }
    
    if (headerEl) {
      // Ensure header is always below running text
      headerEl.style.top = '44px'
      headerEl.style.zIndex = '50'
    }
  })
})

function toggleTopBars() {
  userExpandedTopBars.value = !userExpandedTopBars.value
}

// First-visit loading overlay state
const showLoader = ref(false)
const loaderDuration = 2 // Optimized for fast loading experience
const initialPageFullyLoaded = ref(false)

// Smart minimized loader state
const miniLoaderActive = ref(false)
const miniLoaderExpanding = ref(false)
const miniLoaderPercent = ref(null)
// Timer for mini loader percent countdown
let miniLoaderPercentTimer = null
function stopMiniLoaderPercentCountdown() {
  try {
    if (miniLoaderPercentTimer) {
      clearInterval(miniLoaderPercentTimer)
      miniLoaderPercentTimer = null
    }
  } catch { /* ignore */ }
}
function startMiniLoaderPercentCountdown(start = 5, stepMs = 300) {
  try {
    stopMiniLoaderPercentCountdown()
    miniLoaderPercent.value = start
    miniLoaderPercentTimer = setInterval(() => {
      if (!miniLoaderActive.value) {
        stopMiniLoaderPercentCountdown()
        return
      }
      const v = Number(miniLoaderPercent.value ?? start)
      if (v < 95) { // Stop at 95% to avoid reaching 100% automatically
        miniLoaderPercent.value = Math.min(95, v + 1)
      } else {
        // Don't auto-stop, let network completion handle it
        miniLoaderPercent.value = 95
      }
    }, stepMs)
  } catch { /* ignore */ }
}

function triggerMiniLoaderExpand() {
  // Play small-to-large animation, then hide mini loader
  miniLoaderExpanding.value = true
  // ensure countdown timer is stopped
  stopMiniLoaderPercentCountdown()
  setTimeout(() => {
    miniLoaderActive.value = false
    miniLoaderExpanding.value = false
    try { miniLoaderPercent.value = null } catch {}
    // Ensure no network activity is pending
    try { netActiveCount.value = 0 } catch {}
  }, 900)
}

// Smart background loader (sequential: small -> large)
let smartLoaderRunning = false
async function runSmartBackgroundLoading() {
  if (smartLoaderRunning) return
  smartLoaderRunning = true
  try {
    if (typeof document === 'undefined') return
    const imgs = Array.from(document.images || [])
    const withSize = imgs.map(img => {
      const w = img.naturalWidth || parseInt(img.getAttribute('width') || '0') || img.clientWidth || 0
      const h = img.naturalHeight || parseInt(img.getAttribute('height') || '0') || img.clientHeight || 0
      const area = Math.max(1, w * h)
      return { img, area }
    })
    const total = withSize.length
    withSize.sort((a, b) => a.area - b.area)

    // If there is nothing to preload, complete only when network is idle
    if (total === 0) {
      let idle = true
      try { idle = (netActiveCount.value ?? 0) === 0 } catch {}
      if (idle) {
        try { miniLoaderPercent.value = 100 } catch {}
        triggerMiniLoaderExpand()
      }
      return
    }

    let loaded = 0
    for (const { img } of withSize) {
      if (!miniLoaderActive.value) break
      // Preload each image one-by-one
      // Skip if already loaded
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        try {
          if (img.complete && img.naturalWidth > 0) return resolve()
          const tmp = new Image()
          try { tmp.decoding = 'async' } catch {}
          tmp.onload = () => resolve()
          tmp.onerror = () => resolve()
          tmp.src = img.currentSrc || img.src
          if (img.srcset) tmp.srcset = img.srcset
        } catch {
          resolve()
        }
        setTimeout(() => resolve(), 4000)
      })
      loaded += 1
      // Mini loader percent is driven by network activity events; avoid image-based percent to keep it realtime
    }
  } finally {
    // Only complete if network is idle; otherwise net events will finish it
    let idle = true
    try { idle = (netActiveCount.value ?? 0) === 0 } catch {}
    if (idle) {
      try { if (miniLoaderActive.value) miniLoaderPercent.value = 100 } catch {}
      if (miniLoaderActive.value) triggerMiniLoaderExpand()
    }
    smartLoaderRunning = false
  }
}

// Start smart loader whenever mini loader becomes active + 10s auto-close safeguard for "Memuat" text
let miniLoaderWatchdogTimer = null
watch(miniLoaderActive, (active) => {
  try {
    if (active) {
      runSmartBackgroundLoading()
      // Don't initialize percent here, let network handler manage it
      if (miniLoaderWatchdogTimer) clearTimeout(miniLoaderWatchdogTimer)
      miniLoaderWatchdogTimer = setTimeout(() => {
        // If "Memuat..." mini loader still visible after 10s, force reset and hide
        if (miniLoaderActive.value) {
          console.warn('Mini loader stuck for 10s, forcing reset')
          forceResetNetworkCounter()
        }
      }, 10000) // Reduced from 30s to 10s
    } else {
      // stop percent countdown when mini loader deactivates
      stopMiniLoaderPercentCountdown()
      if (miniLoaderWatchdogTimer) {
        clearTimeout(miniLoaderWatchdogTimer)
        miniLoaderWatchdogTimer = null
      }
    }
  } catch { /* ignore */ }
})

// Realtime network-activity driven mini loader updates
const netActiveCount = ref(0)
function handleNetChange(e) {
  try {
    const c = Math.max(0, Number(e?.detail?.count ?? 0))
    netActiveCount.value = c
    if (c > 0) {
      // show mini loader immediately when network activity starts
      if (!miniLoaderActive.value && !showLoader.value) {
        miniLoaderActive.value = true
        // Don't set percent to 0, let countdown handle it
        // start a gentle countdown so users see progress while requests are pending
        startMiniLoaderPercentCountdown(5, 300) // Start from 5% and slower update
      }
    } else {
      // when all requests complete, smoothly finish and hide mini loader
      if (miniLoaderActive.value) {
        // Stop countdown first
        stopMiniLoaderPercentCountdown()
        try { miniLoaderPercent.value = 100 } catch {}
        // Add delay to ensure smooth transition
        setTimeout(() => {
          triggerMiniLoaderExpand()
        }, 200)
      }
    }
  } catch { /* ignore */ }
}

// Force reset network counter if it gets stuck
function forceResetNetworkCounter() {
  try {
    if (typeof window !== 'undefined') {
      const w = window
      w['__JP_NET_ACTIVE__'] = 0
      netActiveCount.value = 0
      if (miniLoaderActive.value) {
        stopMiniLoaderPercentCountdown()
        miniLoaderActive.value = false
        miniLoaderExpanding.value = false
        miniLoaderPercent.value = null
      }
    }
  } catch { /* ignore */ }
}

// Function to check if initial page is fully loaded and ensure minimum display time
const checkAndHideInitialLoader = () => {
  const minDisplayTime = 100; // Optimized for instant loading (100ms)
  const startTime = Date.now();

  const hideLoader = () => {
    showLoader.value = false;
    document.body.style.overflow = '';
  };

  if (initialPageFullyLoaded.value) {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= minDisplayTime) {
      hideLoader();
    } else {
      // If minimum time hasn't passed, wait for the remaining time
      setTimeout(hideLoader, minDisplayTime - elapsedTime);
    }
  } else {
    // If page isn't fully loaded, wait for it with less frequent checks (300ms instead of 100ms)
    const checkInterval = setInterval(() => {
      if (initialPageFullyLoaded.value) {
        clearInterval(checkInterval);
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= minDisplayTime) {
          hideLoader();
        } else {
          // If minimum time hasn't passed, wait for the remaining time
          setTimeout(hideLoader, minDisplayTime - elapsedTime);
        }
      }
    }, 300); // Reduced check frequency from 100ms to 300ms for better performance
  }
}

const onLoaderFinished = () => {
  // Always hide blocking overlay and switch to smart mini loader
  showLoader.value = false
  document.body.style.overflow = ''
  // Only show mini loader if page is not fully loaded yet
  if (!initialPageFullyLoaded.value) {
    miniLoaderActive.value = true
    // Don't initialize percent here, let network handler manage it
  }
  // If page already fully loaded, don't show mini loader
  if (initialPageFullyLoaded.value) {
    miniLoaderActive.value = false
  }
}

// Navigation loading overlay state (for route changes)
const navLoading = ref(false)
const navLoaderDuration = 1 // Optimized for fast navigation (1s)
let navFallbackTimer = null
const onNavLoaderFinished = () => {
  navLoading.value = false
  document.body.style.overflow = ''
  // Show mini loader briefly to give a seamless perception
  miniLoaderActive.value = true
  // Don't initialize percent here, let network handler manage it
  // If content already ready, expand and hide mini loader
  if (typeof document !== 'undefined' && document.readyState === 'complete') {
    triggerMiniLoaderExpand()
  }
}

// Progress tracking + Auto-skip logic (handles 100% stuck cases and timeouts)
const initialLoaderProgress = ref(0)
let loaderWatchdogTimer = null
const onLoaderProgress = (p) => {
  try {
    if (p > initialLoaderProgress.value) {
      initialLoaderProgress.value = p
    }
    // If shows 100% but still blocking, force-skip
    if (p >= 100 && showLoader.value) {
      onLoaderFinished()
    }
  } catch { /* ignore */ }
}

watch(showLoader, (active) => {
  try {
    if (active) {
      if (loaderWatchdogTimer) clearTimeout(loaderWatchdogTimer)
      // Safety timeout to auto-hide even if something stuck (duration + grace)
      const ms = Math.max(loaderDuration * 1000 + 1500, 8000)
      loaderWatchdogTimer = setTimeout(() => {
        if (showLoader.value) onLoaderFinished()
      }, ms)
    } else if (loaderWatchdogTimer) {
      clearTimeout(loaderWatchdogTimer)
      loaderWatchdogTimer = null
    }
  } catch { /* ignore */ }
})

const navLoaderProgress = ref(0)
let navWatchdogTimer = null
const onNavLoaderProgress = (p) => {
  try {
    if (p > navLoaderProgress.value) navLoaderProgress.value = p
    if (p >= 100 && navLoading.value) onNavLoaderFinished()
  } catch { /* ignore */ }
}

watch(navLoading, (active) => {
  try {
    if (active) {
      if (navWatchdogTimer) clearTimeout(navWatchdogTimer)
      const ms = Math.max(navLoaderDuration * 1000 + 1000, 6000)
      navWatchdogTimer = setTimeout(() => {
        if (navLoading.value) onNavLoaderFinished()
      }, ms)
    } else if (navWatchdogTimer) {
      clearTimeout(navWatchdogTimer)
      navWatchdogTimer = null
    }
  } catch { /* ignore */ }
})

// Mobile menu state
const toggleMobile = ref(false)

// Super Icon state
const showSuperIcon = ref(false)

// Short window to ignore clock interactions after menu toggles (prevents ghost taps)
let clockIgnoreUntil = 0
function isEventFromMenuButton(e) {
  try {
    const target = e && e.target
    const btn = typeof document !== 'undefined' ? document.getElementById('mobile-menu-btn') : null
    return !!(btn && target && (target === btn || btn.contains(target)))
  } catch { return false }
}
function shouldIgnoreClock(e) {
  try { return toggleMobile.value || Date.now() < clockIgnoreUntil || isEventFromMenuButton(e) } catch { return toggleMobile.value }
}

function onToggleMobileMenu(e) {
  console.log('Hamburger menu clicked!', { current: toggleMobile.value })
  
  try { 
    e?.preventDefault?.()
    e?.stopPropagation?.() 
  } catch {}
  
  // Simple toggle without clock interference
  toggleMobile.value = !toggleMobile.value
  
  console.log('Mobile menu toggled to:', toggleMobile.value)
  
  // Close any clock popovers to avoid conflicts
  try { hideMobileClockPopover() } catch {}
  try { hideDesktopClockPopover() } catch {}
}

function onCloseMobileMenu() {
  try { toggleMobile.value = false } catch {}
  try { clockIgnoreUntil = Date.now() + 700 } catch {}
  try { hideMobileClockPopover() } catch {}
  try { hideDesktopClockPopover() } catch {}
}

// Super Icon handlers
const toggleSuperIcon = () => {
  showSuperIcon.value = !showSuperIcon.value
}

const onCloseSuperIcon = () => {
  showSuperIcon.value = false
}

// Language state and i18n locale sync
const { locale } = useI18n()
const currentLanguage = ref('id')
try {
  // Force default to Indonesian unless user explicitly picked English recently
  const val = (locale?.value === 'en' ? 'en' : 'id')
  locale.value = val || 'id'
  currentLanguage.value = locale.value
  if (import.meta.client) {
    try { document.documentElement.setAttribute('lang', locale.value) } catch {}
  }
} catch {}

// Image popup composable
const { popupState, openPopup, closePopup } = useImagePopup()
try {
  watch(() => (locale ? locale.value : 'id'), (val) => {
    try { currentLanguage.value = (val === 'en' ? 'en' : 'id') } catch {}
  })
} catch {}

// Smart cache system for translations - avoid unnecessary API calls
const messageCache = new Map()
const CACHE_DURATION_ID = 24 * 60 * 60 * 1000 // ID: 24 hours (stable)
const CACHE_DURATION_EN = 30 * 60 * 1000 // EN: 30 minutes (may update)

// Add missing toggleLanguage handler for mobile menu with smart caching
async function toggleLanguage(target) {
  try {
    if (!locale) return
    const next = (target === 'en' ? 'en' : 'id')
    if (locale.value === next) return

    // Check cache first (SUPER PINTAR!)
    const cached = messageCache.get(next)
    const cacheDuration = next === 'id' ? CACHE_DURATION_ID : CACHE_DURATION_EN
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < cacheDuration) {
      console.log(`[default.vue i18n] Using cached messages for ${next}`)
      
      // Use cached messages - apply to i18n
      try {
        const nuxtApp = useNuxtApp()
        const provided = nuxtApp.$i18n
        if (provided?.global?.setLocaleMessage) {
          provided.global.setLocaleMessage(next, cached.messages)
        } else if (provided?.setLocaleMessage) {
          provided.setLocaleMessage(next, cached.messages)
        }
      } catch (e) {
        console.warn('Failed to set cached locale messages', e)
      }
    } else {
      // Fetch messages from API
      try {
        // Background sync check for EN
        if (next === 'en') {
          $fetch('/api/i18n/sync', { method: 'POST', timeout: 5000 }).catch(() => {})
        }

        const res = await $fetch('/api/i18n/messages', { 
          query: { locale: next },
          headers: { 'Cache-Control': 'public, max-age=1800' }
        })
        const msgs = res?.messages || {}

        // Store in cache
        messageCache.set(next, { messages: msgs, timestamp: now })
        console.log(`[default.vue i18n] Fetched and cached messages for ${next}`)

        // Apply messages
        const nuxtApp = useNuxtApp()
        const provided = nuxtApp.$i18n
        if (provided?.global?.setLocaleMessage) {
          provided.global.setLocaleMessage(next, msgs)
        } else if (provided?.setLocaleMessage) {
          provided.setLocaleMessage(next, msgs)
        }
      } catch (e) {
        console.warn('[default.vue i18n] Failed to load messages:', e)
      }
    }

    // Update locale
    locale.value = next
    try { currentLanguage.value = next } catch {}
    
    if (import.meta.client) {
      try { document.documentElement.setAttribute('lang', next) } catch {}
      try { localStorage.setItem('userLocale', next) } catch {}
      try {
        const isEn = next === 'en'
        const maxAge = isEn ? (60 * 30) : (60 * 60 * 24 * 365)
        document.cookie = `i18n_locale=${encodeURIComponent(next)}; path=/; max-age=${maxAge}; samesite=lax`
        document.cookie = `i18n_selected=true; path=/; max-age=${maxAge}; samesite=lax`
        if (isEn) {
          const now = Date.now()
          document.cookie = `i18n_selected_at=${now}; path=/; max-age=${maxAge}; samesite=lax`
        } else {
          document.cookie = `i18n_selected_at=; path=/; max-age=0; samesite=lax`
        }
      } catch {}
    }
    
    // Auto-close mobile menu after language selection (smart behavior)
    try { onCloseMobileMenu() } catch {}
  } catch { /* ignore */ }
}

// Current time state - Initialize with current time to avoid loading delay
const currentTime = ref('00:00:00')

// Initialize time immediately
const initializeTime = () => {
  try {
    const now = new Date()
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const jakartaTime = new Date(utc + (7 * 3600000))
    const hours = jakartaTime.getHours().toString().padStart(2, '0')
    const minutes = jakartaTime.getMinutes().toString().padStart(2, '0')
    const seconds = jakartaTime.getSeconds().toString().padStart(2, '0')
    currentTime.value = `${hours}:${minutes}:${seconds}`
  } catch {
    currentTime.value = '00:00:00'
  }
}

// Clock popover state and device/browser info
const showMobileClockInfo = ref(false)
const mobileClockRef = ref(null)
const showDesktopClockInfo = ref(false)
const desktopClockRef = ref(null)
const showStickyClockInfo = ref(false)
const stickyClockRef = ref(null)

// Compact search popover state (visible when top bars hidden)
const showCompactSearch = ref(false)
const compactSearchRef = ref(null)
function toggleCompactSearch() {
  showCompactSearch.value = !showCompactSearch.value
}

function onGlobalClickCloseCompactSearch(e) {
  try {
    if (!showCompactSearch.value) return
    const el = compactSearchRef.value || null
    const target = e && e.target
    if (el && target && !el.contains(target)) {
      showCompactSearch.value = false
    }
  } catch { /* ignore */ }
}

onMounted(() => {
  try { window.addEventListener('click', onGlobalClickCloseCompactSearch, true) } catch { /* ignore */ }
})

onBeforeUnmount(() => {
  try { window.removeEventListener('click', onGlobalClickCloseCompactSearch, true) } catch { /* ignore */ }
})

watch(() => route.fullPath, () => { showCompactSearch.value = false })

// Device and browser detection
const deviceType = ref('Desktop')
const browserName = ref('Unknown')
const ipAddress = ref('Memuat...')
const deviceOS = ref('Tidak diketahui')
const countryName = ref('Memuat...')
// New geo/device extras
const geoAddress = ref('Memuat...')
const geoCity = ref('Memuat...')
const geoRegion = ref('Memuat...')
const geoPostal = ref('00000')
const ispName = ref('Memuat...')
const screenSize = ref('')
const cookiesEnabled = ref(false)
const jsEnabled = ref(true)
const proxyStatus = ref('Tidak diketahui')
const vpnStatus = ref('Tidak diketahui')
// Device icon label and network quality
const deviceIconLabel = ref('Tidak diketahui')
const networkQuality = ref('Normal')
const networkQualityColor = computed(() => {
  switch (networkQuality.value) {
    case 'Cepat': return 'text-indigo-600 dark:text-indigo-300'
    case 'Normal': return 'text-green-600 dark:text-green-300'
    default: return 'text-red-600 dark:text-red-300'
  }
})
// Computed icon for device type (icon only display)
const deviceIconName = computed(() => {
  try {
    const t = String(deviceType.value || '').toLowerCase()
    if (t.includes('tablet')) return 'i-lucide-tablet'
    if (t.includes('mobile') || t.includes('phone')) return 'i-lucide-smartphone'
    return 'i-lucide-monitor'
  } catch { return 'i-lucide-monitor' }
})

// Visitor stats
const {
  // Visitor (unique IP) counters
  uniqueToday: vToday,         // Visitor Hari Ini (unique IP today)
  uniqueMonth: vMonth,         // Visitor Bulan Ini (unique IP month)
  uniqueYear: vYear,           // Visitor Tahun Ini (unique IP year)
  // Online counters
  onlineVisitors: vOnline,     // Visitor Online (active visitors)
  onlineRobots: vOnlineRobots, // Robots online
  // Global hits (kunjungan)
  hitsToday: gHitsToday,
  hitsMonth: gHitsMonth,
  hitsYear: vHitsYear,
  // Per-IP counts (current requester)
  ipHitsToday: vIpHitsToday,
  ipHitsMonth: vIpHitsMonth,
} = useVisitors()
// Kunjungan counters should display unique IP counts
const vHitsToday = vToday
const vHitsMonth = vMonth
// Per requirement, "Kunjungan Keseluruhan" uses total unique IPs this year
const vTotal = vYear
function nf(num) {
  try { return new Intl.NumberFormat('id-ID').format((num || 0)) } catch { return String(num ?? 0) }
}

function detectEnv() {
  try {
    if (typeof navigator === 'undefined') return
    const ua = navigator.userAgent || navigator.vendor || (window && window.opera) || ''
    const isIpad = /iPad/.test(ua) || (/(Macintosh)/.test(ua) && 'ontouchend' in window)
    const isTablet = isIpad || (/Android/.test(ua) && !/Mobile/.test(ua)) || /Tablet/.test(ua)
    const isMobile = /Mobi|Android|iPhone|iPod|Windows Phone/.test(ua)
    deviceType.value = isTablet ? 'Tablet' : (isMobile ? 'Mobile' : 'Desktop')
    // Browser detection (order matters, enhanced)
    const navAny = navigator
    const uaData = (navAny && (navAny).userAgentData) ? (navAny).userAgentData : null
    let detected = ''
    try {
      if (uaData && uaData.brands && uaData.brands.length) {
        const brands = uaData.brands.map((b) => String((b && b.brand) || '').toLowerCase())
        if (brands.some((b) => b.includes('edge'))) detected = 'Edge'
        else if (brands.some((b) => b.includes('opera'))) detected = 'Opera'
        else if (brands.some((b) => b.includes('chrome'))) detected = 'Chrome'
      }
    } catch {}
    // Brave exposes navigator.brave
    try { if (!detected && navAny && (navAny).brave) detected = 'Brave' } catch {}
    if (!detected) {
      if (/Vivaldi/i.test(ua)) detected = 'Vivaldi'
      else if (/YaBrowser/i.test(ua)) detected = 'Yandex'
      else if (/UCBrowser/i.test(ua)) detected = 'UC Browser'
      else if (/Whale/i.test(ua)) detected = 'Whale'
      else if (/QQBrowser/i.test(ua)) detected = 'QQ Browser'
      else if (/Edg\//.test(ua)) detected = 'Edge'
      else if (/OPR\//.test(ua) || /Opera/.test(ua)) detected = 'Opera'
      else if (/CriOS\//.test(ua)) detected = 'Chrome (iOS)'
      else if (/Chrome\//.test(ua)) detected = 'Chrome'
      else if (/Firefox\//.test(ua)) detected = 'Firefox'
      else if (/SamsungBrowser\//.test(ua)) detected = 'Samsung Internet'
      else if (/Safari\//.test(ua)) detected = 'Safari'
      else if (/MSIE|Trident\//.test(ua)) detected = 'Internet Explorer'
    }
    browserName.value = detected || 'Unknown'

    // OS detection
    if (/Android/i.test(ua)) deviceOS.value = 'Android'
    else if (/iPhone|iPad|iPod/i.test(ua)) deviceOS.value = 'iOS'
    else if (/Windows NT/i.test(ua)) deviceOS.value = 'Windows'
    else if (/Macintosh|Mac OS X/i.test(ua)) deviceOS.value = 'macOS'
    else if (/CrOS/i.test(ua)) deviceOS.value = 'ChromeOS'
    else if (/Linux/i.test(ua)) deviceOS.value = 'Linux'
    else deviceOS.value = 'Lainnya'
    // Device icon label (best-effort from UA)
    let deviceLabel = 'Desktop'
    if (/iPhone/i.test(ua)) deviceLabel = 'iPhone'
    else if (/iPad/i.test(ua)) deviceLabel = 'iPad'
    else if (/Android/i.test(ua)) {
      const m = ua.match(/Android[^;]*;\s*([^;)]+)/i)
      deviceLabel = (m && m[1]) ? m[1].trim() : 'Android'
    } else if (/Windows|Macintosh|Linux/i.test(ua)) {
      deviceLabel = 'Desktop'
    }
    deviceIconLabel.value = deviceLabel
  } catch {}
}

function updateScreenSize() {
  try {
    if (typeof window === 'undefined') return
    screenSize.value = `${window.innerWidth}px X ${window.innerHeight}px`
  } catch {}
}

function fillGeoFromIpApi(j) {
  try {
    geoCity.value = j?.city || geoCity.value
    geoRegion.value = j?.region || j?.region_code || geoRegion.value
    geoPostal.value = j?.postal || geoPostal.value || '00000'
    ispName.value = j?.org || ispName.value
    const c = geoCity.value && geoCity.value !== 'Memuat...' ? geoCity.value : ''
    const r = geoRegion.value && geoRegion.value !== 'Memuat...' ? geoRegion.value : ''
    geoAddress.value = [c, r].filter(Boolean).join(', ') || geoAddress.value
  } catch {}
}

function fillGeoFromIpWho(j) {
  try {
    geoCity.value = j?.city || geoCity.value
    geoRegion.value = j?.region || geoRegion.value
    geoPostal.value = j?.postal || geoPostal.value || '00000'
    ispName.value = j?.connection?.isp || ispName.value
    const c = geoCity.value && geoCity.value !== 'Memuat...' ? geoCity.value : ''
    const r = geoRegion.value && geoRegion.value !== 'Memuat...' ? geoRegion.value : ''
    geoAddress.value = [c, r].filter(Boolean).join(', ') || geoAddress.value
    if (typeof j?.connection?.proxy === 'boolean') {
      proxyStatus.value = j.connection.proxy ? 'Aktif' : 'Tidak diketahui'
    }
    if (j?.security?.vpn === true || j?.connection?.vpn === true || j?.privacy?.vpn === true || j?.vpn === true) {
      vpnStatus.value = 'Aktif'
    }
  } catch {}
}

function fillGeoFromIpInfo(j) {
  try {
    geoCity.value = j?.city || geoCity.value
    geoRegion.value = j?.region || geoRegion.value
    geoPostal.value = j?.postal || geoPostal.value || '00000'
    ispName.value = j?.org || ispName.value
    const c = geoCity.value && geoCity.value !== 'Memuat...' ? geoCity.value : ''
    const r = geoRegion.value && geoRegion.value !== 'Memuat...' ? geoRegion.value : ''
    geoAddress.value = [c, r].filter(Boolean).join(', ') || geoAddress.value
  } catch {}
}

async function fetchGeoDetails() {
  try {
    try {
      const r1 = await fetch('https://ipapi.co/json/')
      if (r1.ok) {
        const j = await r1.json()
        fillGeoFromIpApi(j)
      }
    } catch {}
    try {
      const r2 = await fetch('https://ipwho.is/')
      if (r2.ok) {
        const j2 = await r2.json()
        fillGeoFromIpWho(j2)
      }
    } catch {}
    try {
      const r3 = await fetch('https://ipinfo.io/json')
      if (r3.ok) {
        const j3 = await r3.json()
        fillGeoFromIpInfo(j3)
      }
    } catch {}
    if (!geoPostal.value) geoPostal.value = '00000'
  } catch {}
}

async function fetchIPAddress(timeoutMs = 4000) {
  try {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const r1 = await fetch('https://api.ipify.org?format=json', { signal: controller.signal })
      if (r1.ok) {
        const d = await r1.json()
        ipAddress.value = d.ip || 'Tidak tersedia'
        clearTimeout(id)
        return
      }
    } catch {}
    try {
      const r2 = await fetch('https://api64.ipify.org?format=json')
      if (r2.ok) {
        const d2 = await r2.json()
        ipAddress.value = d2.ip || 'Tidak tersedia'
        return
      }
    } catch {}
    try {
      const r3 = await fetch('https://ifconfig.me/ip')
      if (r3.ok) {
        const t = await r3.text()
        ipAddress.value = (t || '').trim() || 'Tidak tersedia'
        return
      }
    } catch {}
    ipAddress.value = 'Tidak tersedia'
  } catch {
    ipAddress.value = 'Tidak tersedia'
  }
}

async function fetchCountry(timeoutMs = 5000) {
  try {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const r1 = await fetch('https://ipapi.co/json/', { signal: controller.signal })
      if (r1.ok) {
        const j = await r1.json()
        const name = j.country_name || j.country || ''
        countryName.value = name || 'Tidak tersedia'
        fillGeoFromIpApi(j)
        clearTimeout(id)
        return
      }
    } catch {}
    try {
      const r2 = await fetch('https://ipwho.is/')
      if (r2.ok) {
        const j2 = await r2.json()
        countryName.value = j2.country || 'Tidak tersedia'
        fillGeoFromIpWho(j2)
        return
      }
    } catch {}
    try {
      const r3 = await fetch('https://ipinfo.io/json')
      if (r3.ok) {
        const j3 = await r3.json()
        countryName.value = j3.country || 'Tidak tersedia'
        fillGeoFromIpInfo(j3)
        return
      }
    } catch {}
    countryName.value = 'Tidak tersedia'
  } catch {
    countryName.value = 'Tidak tersedia'
  }
}

function detectNetworkQuality() {
  try {
    if (typeof navigator === 'undefined') return
    const conn = (typeof navigator !== 'undefined' && navigator && navigator.connection)
    if (conn && (conn.effectiveType || conn.downlink || conn.rtt)) {
      const et = String(conn.effectiveType || '').toLowerCase()
      if (et.includes('5g') || et === '4g') networkQuality.value = 'Cepat'
      else if (et === '3g') networkQuality.value = 'Normal'
      else if (et === '2g') networkQuality.value = 'Lambat'
      else if (et.includes('slow-2g')) networkQuality.value = 'Sangat Slow'
      else {
        const dl = Number(conn.downlink || 0)
        const rtt = Number(conn.rtt || 0)
        if (dl >= 10 && rtt <= 100) networkQuality.value = 'Cepat'
        else if (dl >= 2 && rtt <= 300) networkQuality.value = 'Normal'
        else if (dl >= 0.5 && rtt <= 700) networkQuality.value = 'Pelan'
        else if (dl > 0) networkQuality.value = 'Lambat'
        else networkQuality.value = 'Sangat Slow'
      }
      return
    }
  } catch {}
  // Fallback: simple latency probe
  try {
    const start = Date.now()
    fetch('https://www.google.com/generate_204', { method: 'GET', mode: 'no-cors', cache: 'no-store' })
      .then(() => {
        const t = Date.now() - start
        if (t < 200) networkQuality.value = 'Cepat'
        else if (t < 600) networkQuality.value = 'Normal'
        else if (t < 1200) networkQuality.value = 'Pelan'
        else if (t < 2500) networkQuality.value = 'Lambat'
        else networkQuality.value = 'Sangat Slow'
      })
      .catch(() => { networkQuality.value = 'Sangat Slow' })
  } catch { /* ignore */ }
}

function formatJakartaDate() {
  try {
    const now = new Date()
    const jakarta = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const dd = String(jakarta.getDate()).padStart(2, '0')
    const mm = String(jakarta.getMonth() + 1).padStart(2, '0')
    const yyyy = jakarta.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  } catch {
    return ''
  }
}

const jakartaDate = computed(() => formatJakartaDate())

// Enhance interactions for clock popovers
const POPUP_GRACE_MS = 15000
let mobileClockAutoCloseTimer = null
const suppressNextClick = ref(false)
let touchSuppressTimer = null
let lastClockTouchAt = 0
let isUserScrolling = false
let scrollDebounceTimer = null
function onScrollAny() {
  try {
    isUserScrolling = true
    if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer)
    scrollDebounceTimer = setTimeout(() => { isUserScrolling = false }, 180)
  } catch { /* ignore */ }
}
function scheduleMobileClockAutoClose() {
  if (mobileClockAutoCloseTimer) clearTimeout(mobileClockAutoCloseTimer)
  mobileClockAutoCloseTimer = setTimeout(() => { hideMobileClockPopover(true) }, POPUP_GRACE_MS)
}

let desktopClockAutoCloseTimer = null
function scheduleDesktopClockAutoClose() {
  if (desktopClockAutoCloseTimer) clearTimeout(desktopClockAutoCloseTimer)
  desktopClockAutoCloseTimer = setTimeout(() => { hideDesktopClockPopover() }, POPUP_GRACE_MS)
}

function onDesktopClockEnter() {
  showDesktopClockInfo.value = true
  // Keep open while hovered/focused; clear any pending auto-close timer
  if (desktopClockAutoCloseTimer) {
    clearTimeout(desktopClockAutoCloseTimer)
    desktopClockAutoCloseTimer = null
  }
}

function onDesktopClockLeave() {
  // When leaving (no hover/focus), schedule idle auto-close after 5s
  if (showDesktopClockInfo.value) {
    scheduleDesktopClockAutoClose()
  }
}

function onTouchStartMobileClock(e) {
  try {
    if (shouldIgnoreClock(e)) { try { e.stopPropagation() } catch {}; return }
    e.stopPropagation()
    // Mark time of touch to filter out the following synthetic click
    lastClockTouchAt = Date.now()
    // On touch devices, show the popover immediately and keep it open while touching
    showMobileClockInfo.value = true
    // Suppress the following synthetic click so it doesn't immediately toggle closed
    suppressNextClick.value = true
    if (touchSuppressTimer) clearTimeout(touchSuppressTimer)
    // Use a slightly longer window to accommodate delayed synthetic clicks on some devices
    touchSuppressTimer = setTimeout(() => { suppressNextClick.value = false }, 1200)
    if (mobileClockAutoCloseTimer) {
      clearTimeout(mobileClockAutoCloseTimer)
      mobileClockAutoCloseTimer = null
    }
  } catch {}
}

function onMobileClockEnter(e) {
  if (shouldIgnoreClock(e)) { try { e?.stopPropagation?.() } catch {}; return }
  // Any hover/focus/touch inside should keep it open and clear timer
  showMobileClockInfo.value = true
  if (mobileClockAutoCloseTimer) {
    clearTimeout(mobileClockAutoCloseTimer)
    mobileClockAutoCloseTimer = null
  }
}

function onMobileClockLeave() {
  // When leaving interaction, start 5s idle auto-close
  if (showMobileClockInfo.value) {
    scheduleMobileClockAutoClose()
  }
}

function toggleMobileClockPopover(e) {
  if (shouldIgnoreClock(e)) { try { e?.stopPropagation?.() } catch {}; return }
  if (e) {
    try { e.stopPropagation() } catch {}
  }
  const next = !showMobileClockInfo.value
  showMobileClockInfo.value = next
  if (next) {
    // Opening: schedule idle auto-close in 5s unless user interacts (enter clears it)
    scheduleMobileClockAutoClose()
  } else {
    // If toggled off, ensure closed
    if (mobileClockAutoCloseTimer) {
      clearTimeout(mobileClockAutoCloseTimer)
      mobileClockAutoCloseTimer = null
    }
  }
}

function onClockButtonClick(e) {
  // If a recent touch just happened, ignore this follow-up click to avoid double-tap requirement
  try {
    const now = Date.now()
    if (now - lastClockTouchAt < 600) { try { e.stopPropagation() } catch {}; try { if (typeof e.preventDefault === 'function') e.preventDefault() } catch {}; return }
  } catch {}
  if (shouldIgnoreClock(e)) { try { e.stopPropagation() } catch {}; try { if (typeof e.preventDefault === 'function') e.preventDefault() } catch {}; return }
  if (suppressNextClick.value) {
    try { e.stopPropagation() } catch {}
    try { if (typeof e.preventDefault === 'function') e.preventDefault() } catch {}
    suppressNextClick.value = false
    return
  }
  toggleMobileClockPopover(e)
}

function hideMobileClockPopover() {
  showMobileClockInfo.value = false
}

function hideDesktopClockPopover() {
  showDesktopClockInfo.value = false
  if (desktopClockAutoCloseTimer) {
    clearTimeout(desktopClockAutoCloseTimer)
    desktopClockAutoCloseTimer = null
  }
}

function toggleDesktopClockPopover(e) {
  if (e) e.stopPropagation()
  const next = !showDesktopClockInfo.value
  showDesktopClockInfo.value = next
  if (next) scheduleDesktopClockAutoClose()
}

// Sticky clock functions
let stickyClockAutoCloseTimer = null
const STICKY_POPUP_GRACE_MS = 5000

function scheduleStickyClockAutoClose() {
  if (stickyClockAutoCloseTimer) clearTimeout(stickyClockAutoCloseTimer)
  stickyClockAutoCloseTimer = setTimeout(() => { hideStickyClockPopover() }, STICKY_POPUP_GRACE_MS)
}

function onStickyClockEnter() {
  showStickyClockInfo.value = true
  // Keep open while hovered/focused; clear any pending auto-close timer
  if (stickyClockAutoCloseTimer) {
    clearTimeout(stickyClockAutoCloseTimer)
    stickyClockAutoCloseTimer = null
  }
}

function onStickyClockLeave() {
  // When leaving (no hover/focus), schedule idle auto-close after 5s
  if (showStickyClockInfo.value) {
    scheduleStickyClockAutoClose()
  }
}

function hideStickyClockPopover() {
  showStickyClockInfo.value = false
  if (stickyClockAutoCloseTimer) {
    clearTimeout(stickyClockAutoCloseTimer)
    stickyClockAutoCloseTimer = null
  }
}

function toggleStickyClockPopover(e) {
  if (e) e.stopPropagation()
  const next = !showStickyClockInfo.value
  showStickyClockInfo.value = next
  if (next) scheduleStickyClockAutoClose()
}

function handleGlobalClick(e) {
  try {
    // Ignore clicks triggered right after touch (synthetic) or while scrolling
    if (suppressNextClick.value || isUserScrolling) return

    // Handle mobile clock popover
    const mobileEl = mobileClockRef.value
    if (mobileEl && e.target instanceof Node && !mobileEl.contains(e.target)) {
      hideMobileClockPopover()
    }

    // Handle desktop clock popover
    const desktopEl = desktopClockRef.value
    if (desktopEl && e.target instanceof Node && !desktopEl.contains(e.target)) {
      hideDesktopClockPopover()
    }

    // Handle sticky clock popover
    const stickyEl = stickyClockRef.value
    if (stickyEl && e.target instanceof Node && !stickyEl.contains(e.target)) {
      hideStickyClockPopover()
    }
  } catch {}
}

function handleKeydown(e) {
  try {
    if (e.key === 'Escape') {
      hideMobileClockPopover();
      hideDesktopClockPopover();
      hideStickyClockPopover();
      try { onCloseMobileMenu() } catch {}
    }
  } catch {}
}

// Initialize color mode
const colorMode = useColorMode()
const router = useRouter()

// Toggle between light and dark mode
const toggleColorMode = () => {
  const now = Date.now()
  const next = colorMode.value === 'dark' ? 'light' : 'dark'

  // Update preference (Nuxt Color Mode will persist and manage)
  colorMode.preference = next

  // Track dark-mode window start time for 24h expiry logic (handled by plugin)
  try {
    const ls = window.localStorage
    if (next === 'dark') {
      ls.setItem('color-mode-dark-ts', String(now))
    } else {
      ls.removeItem('color-mode-dark-ts')
    }
  } catch {}

  // Immediately reflect on DOM to avoid flicker/race
  try {
    const root = document.documentElement
    root.classList.remove(next === 'dark' ? 'light' : 'dark')
    root.classList.add(next)
    root.setAttribute('data-theme', next)
  } catch {}

  // Auto-close mobile menu after theme toggle (smart behavior)
  try { onCloseMobileMenu() } catch {}
}

// Function to update time (Jakarta/WIB) - Optimized for faster loading
const updateTime = () => {
  try {
    const now = new Date()
    // Use more efficient timezone calculation
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const jakartaTime = new Date(utc + (7 * 3600000)) // UTC+7 for Jakarta
    
    const hours = jakartaTime.getHours().toString().padStart(2, '0')
    const minutes = jakartaTime.getMinutes().toString().padStart(2, '0')
    const seconds = jakartaTime.getSeconds().toString().padStart(2, '0')
    currentTime.value = `${hours}:${minutes}:${seconds}`
  } catch (error) {
    // Fallback to simple time if there's an error
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    currentTime.value = `${hours}:${minutes}:${seconds}`
  }
}


// Close mobile menu when route changes
onMounted(() => {
  try { fetchIPAddress() } catch {}
  try { detectEnv() } catch {}
  try { fetchCountry() } catch {}
  // Client capabilities
  try {
    if (typeof navigator !== 'undefined') {
      cookiesEnabled.value = !!navigator.cookieEnabled
      try {
        document.cookie = 'jp_cookie_test=1; max-age=60'
        cookiesEnabled.value = cookiesEnabled.value || document.cookie.includes('jp_cookie_test=')
      } catch {}
    }
    jsEnabled.value = true
  } catch {}
  // Screen size
  try {
    if (typeof window !== 'undefined') {
      updateScreenSize()
      window.addEventListener('resize', updateScreenSize)
      window.addEventListener('orientationchange', updateScreenSize)
    }
  } catch {}
  // Geo details
  try { fetchGeoDetails() } catch {}
  // Always show loader on every visit, not just the first visit
  try {
    if (import.meta.client) {
      // Show loader on every page load
      showLoader.value = true
      document.body.style.overflow = 'hidden'

      // Force minimum display time for loader
      let loaderMinimumDisplayed = false
      setTimeout(() => {
        loaderMinimumDisplayed = true
      }, loaderDuration * 1000) // Ensure loader shows for full duration

      // Smart fallback: if initial load takes too long, switch to mini loader
      setTimeout(() => {
        if (showLoader.value && !initialPageFullyLoaded.value) {
          showLoader.value = false
          document.body.style.overflow = ''
          miniLoaderActive.value = true
        }
      }, Math.max(loaderDuration * 1000 + 2000, 12000))

      // Set up listeners to detect when the page is fully loaded
      // But don't mark as loaded immediately even if readyState is complete
      const markAsLoaded = () => {
        // Only mark as loaded after minimum display time
        const checkAndMark = () => {
          if (loaderMinimumDisplayed) {
            initialPageFullyLoaded.value = true
          } else {
            setTimeout(checkAndMark, 100)
          }
        }
        checkAndMark()
      }

      if (document.readyState === 'complete') {
        markAsLoaded()
      } else {
        window.addEventListener('load', markAsLoaded)
      }

      // Listen for custom events from pages that might indicate content is loaded
      const markInitialLoaded = () => { 
        // Only mark as loaded after minimum display time
        const checkAndMark = () => {
          if (loaderMinimumDisplayed) {
            initialPageFullyLoaded.value = true
          } else {
            setTimeout(checkAndMark, 100)
          }
        }
        checkAndMark()
      }
      window.addEventListener('blog-search:loaded', markInitialLoaded)
      window.addEventListener('blog-detail:loaded', markInitialLoaded)

      // Additional check for images and other resources
      window.addEventListener('DOMContentLoaded', () => {
        // Wait a bit more for images and other resources
        setTimeout(() => {
          if (!initialPageFullyLoaded.value) {
            // Only mark as loaded after minimum display time
            const checkAndMark = () => {
              if (loaderMinimumDisplayed) {
                console.log('Setting initialPageFullyLoaded via DOMContentLoaded timeout')
                initialPageFullyLoaded.value = true
              } else {
                setTimeout(checkAndMark, 100)
              }
            }
            checkAndMark()
          }
        }, 1000)
      })
    }
  } catch {
    /* ignore */
  }

  const handleRouteChange = () => {
    toggleMobile.value = false
    document.body.style.overflow = ''
  }

  // Detect environment (device and browser) for mobile clock popover
  try { detectEnv() } catch {}

  // Listen for route changes and global events for clock popovers
  window.addEventListener('popstate', handleRouteChange)
  window.addEventListener('click', handleGlobalClick, true)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('orientationchange', () => {
    hideMobileClockPopover();
    hideDesktopClockPopover();
  })
  window.addEventListener('scroll', onScrollAny, true)
  window.addEventListener('touchmove', onScrollAny, true)
  window.addEventListener('wheel', onScrollAny, true)

  // Realtime network activity listener for mini loader
  try {
    if (typeof window !== 'undefined') {
      try {
        const w = window
        netActiveCount.value = Math.max(0, Number(w.__JP_NET_ACTIVE__ || 0))
      } catch {}
      window.addEventListener('jp:net:change', handleNetChange)
      document.addEventListener('jp:net:change', handleNetChange)
      
      // Force reset loading indicator when page is fully loaded
      window.addEventListener('load', () => {
        setTimeout(() => {
          if (miniLoaderActive.value) {
            console.log('Page loaded, forcing mini loader reset')
            forceResetNetworkCounter()
          }
        }, 1000)
      })
      
      // Also reset on DOMContentLoaded as backup
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          if (miniLoaderActive.value && netActiveCount.value === 0) {
            console.log('DOM loaded and no network activity, forcing mini loader reset')
            forceResetNetworkCounter()
          }
        }, 2000)
      })
    }
  } catch { /* ignore */ }

  // Router navigation loading overlay
  try {
    // Track page load state
    const pageFullyLoaded = ref(false)
    const minLoadingTime = 1500 // Minimum time to show loading in ms
    let loadStartTime = 0

    // Function to check if page is fully loaded and minimum time has passed
    const checkAndHideLoader = () => {
      const timeElapsed = Date.now() - loadStartTime
      if (pageFullyLoaded.value && timeElapsed >= minLoadingTime) {
        navLoading.value = false
        document.body.style.overflow = ''
      } else if (timeElapsed < minLoadingTime) {
        // If minimum time hasn't passed, wait for the remaining time
        setTimeout(checkAndHideLoader, minLoadingTime - timeElapsed)
      } else {
        // If page isn't fully loaded but minimum time has passed, wait for page load with less frequent checks
        const checkInterval = setInterval(() => {
          if (pageFullyLoaded.value) {
            clearInterval(checkInterval)
            navLoading.value = false
            document.body.style.overflow = ''
          }
        }, 300) // Reduced check frequency from 100ms to 300ms for better performance
      }
    }

    // Listen for the window load event to know when all resources are loaded
    if (import.meta.client) {
      window.addEventListener('load', () => {
        pageFullyLoaded.value = true
        checkAndHideLoader()
      })
    }

    router.beforeEach((to, from, next) => {
      if (!showLoader.value) {
        pageFullyLoaded.value = false
        loadStartTime = Date.now()
        navLoading.value = true
        document.body.style.overflow = 'hidden'
        // Smart fallback for navigation: if takes too long, switch to mini loader
        if (navFallbackTimer) {
          clearTimeout(navFallbackTimer)
          navFallbackTimer = null
        }
        navFallbackTimer = setTimeout(() => {
          if (navLoading.value) {
            navLoading.value = false
            document.body.style.overflow = ''
            miniLoaderActive.value = true
          }
        }, Math.max(navLoaderDuration * 1000 + 1500, 7000))
      }
      // Close mobile menu on any route navigation for small screens
      try {
        if (import.meta.client) {
          const isSmall = window.matchMedia('(max-width: 1023px)').matches
          if (isSmall) toggleMobile.value = false
        }
      } catch { /* ignore */ }
      next()
    })

    router.afterEach(() => {
      if (!showLoader.value) {
        // Listen for custom events from pages that might indicate content is loaded
        if (import.meta.client) {
          const contentLoadedHandler = () => {
            pageFullyLoaded.value = true
            checkAndHideLoader()
            window.removeEventListener('blog-search:loaded', contentLoadedHandler)
            window.removeEventListener('blog-detail:loaded', contentLoadedHandler)
          }
          window.addEventListener('blog-search:loaded', contentLoadedHandler)
          window.addEventListener('blog-detail:loaded', contentLoadedHandler)

          // Check if document is already complete
          if (document.readyState === 'complete') {
            pageFullyLoaded.value = true
          }

          // Start the check process
          checkAndHideLoader()
        } else {
          // For SSR, use the original timeout approach
          setTimeout(() => {
            navLoading.value = false
            document.body.style.overflow = ''
          }, minLoadingTime)
        }
      }
    })
  } catch { /* ignore */ }

  // Prevent body scrolling when mobile menu is open
  watch(toggleMobile, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })

  // Close super icon when clicking outside
  watch(showSuperIcon, (isOpen) => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.super-icon-btn') && !e.target.closest('.super-dropdown')) {
          showSuperIcon.value = false
        }
      }
      document.addEventListener('click', handleClickOutside)
      
      // Cleanup function
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  })

  // Initialize time immediately and set up timer to update every second
  // Load time faster with immediate execution
  initializeTime()
  updateTime()
  // Use requestAnimationFrame for smoother updates
  const timeInterval = setInterval(() => {
    requestAnimationFrame(updateTime)
  }, 1000)

  // Watch for initial page fully loaded and network idle to finish loaders in realtime
  watch([initialPageFullyLoaded, netActiveCount], ([ready, count]) => {
    try {
      if (showLoader.value && ready && count === 0) {
        onLoaderFinished()
      }
      if (miniLoaderActive.value && ready && count === 0) {
        triggerMiniLoaderExpand()
      }
    } catch { /* ignore */ }
  })

  // Clean up event listeners and timer
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handleRouteChange)
    window.removeEventListener('click', handleGlobalClick, true)
    window.removeEventListener('keydown', handleKeydown)
    // Remove screen size listeners
    try {
      window.removeEventListener('resize', updateScreenSize)
      window.removeEventListener('orientationchange', updateScreenSize)
    } catch {}
    // Note: orientationchange listener was anonymous; cannot be removed here without stored reference
    window.removeEventListener('scroll', onScrollAny, true)
    window.removeEventListener('touchmove', onScrollAny, true)
    window.removeEventListener('wheel', onScrollAny, true)
    // Remove realtime net activity listeners to prevent duplicates (HMR/dev)
    try {
      window.removeEventListener('jp:net:change', handleNetChange)
      document.removeEventListener('jp:net:change', handleNetChange)
    } catch {}
    document.body.style.overflow = ''
    if (miniLoaderWatchdogTimer) { clearTimeout(miniLoaderWatchdogTimer); miniLoaderWatchdogTimer = null }
    if (stickyClockAutoCloseTimer) { clearTimeout(stickyClockAutoCloseTimer); stickyClockAutoCloseTimer = null }
    clearInterval(timeInterval)
  })
})

// Expose for testing and external control
defineExpose({ showLoader, navLoading, miniLoaderActive })
</script>

<style scoped>
/* Seamless marquee animation - visible immediately and loops without gaps */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  align-items: center;
  white-space: nowrap;
  width: max-content;
  animation: marquee 60s linear infinite; /* Standard speed for better readability */
  will-change: transform;
}

.marquee-track {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  min-width: 100%;
}

/* Enhanced loading indicator styles */
@keyframes colorful-spin {
  0% { 
    transform: rotate(0deg);
    border-top-color: #9B1B30;
    border-right-color: #8b5cf6;
    border-bottom-color: #ec4899;
    border-left-color: #f59e0b;
  }
  25% { 
    border-top-color: #8b5cf6;
    border-right-color: #ec4899;
    border-bottom-color: #f59e0b;
    border-left-color: #9B1B30;
  }
  50% { 
    border-top-color: #ec4899;
    border-right-color: #f59e0b;
    border-bottom-color: #9B1B30;
    border-left-color: #8b5cf6;
  }
  75% { 
    border-top-color: #f59e0b;
    border-right-color: #9B1B30;
    border-bottom-color: #8b5cf6;
    border-left-color: #ec4899;
  }
  100% { 
    transform: rotate(360deg);
    border-top-color: #9B1B30;
    border-right-color: #8b5cf6;
    border-bottom-color: #ec4899;
    border-left-color: #f59e0b;
  }
}

@keyframes gradient-shift {
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
}

/* Clean Professional Animations */

/* SUPER ICON STYLES - Icon super keren dengan dropdown menu */
.super-icon-btn {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #ef4444 100%);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3), 0 4px 10px rgba(236, 72, 153, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.super-icon-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4), 0 8px 15px rgba(236, 72, 153, 0.3);
}

.super-icon-btn:active {
  transform: scale(1.05) translateY(-1px);
}

/* Super Dropdown Animation */
.animate-dropdown-in {
  animation: dropdownIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes dropdownIn {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Super Menu Items */
.super-menu-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.super-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.super-menu-item:hover::before {
  left: 100%;
}

.super-menu-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Dark mode support untuk super icon */
.dark .super-dropdown {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 10px 20px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Super Menu Scroll Animation */
.super-menu-scroll-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.super-menu-scroll-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.super-menu-scroll-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.super-menu-scroll-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.super-menu-scroll-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.super-menu-scroll-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

/* Super Icon Action Buttons */
.super-icon-action {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.super-icon-action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.super-icon-action:hover::before {
  left: 100%;
}

.super-icon-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive super icon */
@media (max-width: 1024px) {
  .super-icon-btn {
    padding: 0.5rem;
  }
  
  .super-dropdown {
    width: 320px;
    right: -10px;
  }
}

@media (max-width: 768px) {
  .super-dropdown {
    width: 280px;
    right: -20px;
  }
}

/* HEADER SCROLL FIX - Mencegah header lari ke kanan saat scroll */
.fancy-header {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  transform: translateX(0) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  will-change: auto !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

/* Header positioning yang stabil untuk semua device */
@media (max-width: 1024px) {
  .fancy-header {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    transform: translateX(0) !important;
  }
}

@media (max-width: 768px) {
  .fancy-header {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    transform: translateX(0) !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

@media (max-width: 480px) {
  .fancy-header {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    transform: translateX(0) !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* RESPONSIVE DROPDOWN FIX - Tidak mengecil saat scroll dan responsive ke kanan */
.responsive-dropdown {
  position: fixed !important;
  transform: translateY(0) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  will-change: auto !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

/* Smart positioning untuk dropdown */
.group:hover .responsive-dropdown,
.group:focus-within .responsive-dropdown {
  position: fixed !important;
  transform: translateY(8px) !important;
  scale: 1 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Responsive positioning untuk berbagai ukuran layar */
@media (max-width: 1024px) {
  .responsive-dropdown {
    left: auto !important;
    right: 0 !important;
    transform: translateX(0) !important;
  }
}

@media (max-width: 768px) {
  .responsive-dropdown {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    min-width: 200px !important;
    max-width: 90vw !important;
  }
}

@media (max-width: 480px) {
  .responsive-dropdown {
    left: 10px !important;
    right: 10px !important;
    transform: none !important;
    min-width: calc(100vw - 20px) !important;
    max-width: calc(100vw - 20px) !important;
  }
}

/* Dropdown tidak mengecil saat scroll */
.responsive-dropdown {
  transform-origin: top center !important;
  scale: 1 !important;
  min-height: auto !important;
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}

/* Hover effect yang konsisten */
.group:hover .responsive-dropdown,
.group:focus-within .responsive-dropdown {
  scale: 1 !important;
  transform: translateY(8px) !important;
  opacity: 1 !important;
  visibility: visible !important;
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 5px rgba(107, 114, 128, 0.3), 0 0 10px rgba(14, 165, 233, 0.2);
  }
  50% { 
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(14, 165, 233, 0.3), 0 0 30px rgba(6, 182, 212, 0.2);
  }
}

/* Apply enhanced animations */
.loading-spinner-enhanced {
  animation: colorful-spin 1.5s linear infinite;
}

/* Dark mode loading indicator improvements */
.dark .loading-indicator {
  z-index: 9999 !important;
}

.dark .loading-indicator .bg-gradient-to-r {
  background: rgba(26, 26, 46, 0.95) !important;
  border: 1px solid rgba(107, 114, 128, 0.3) !important;
  backdrop-filter: blur(12px) saturate(120%) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(107, 114, 128, 0.2) !important;
}

.dark .loading-indicator .text-xs {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7) !important;
}

.dark .loading-indicator .bg-gradient-to-r.from-indigo-600,
.dark .loading-indicator .bg-gradient-to-r.via-purple-600,
.dark .loading-indicator .bg-gradient-to-r.to-pink-600 {
  background: linear-gradient(90deg, #9B1B30, #DC143C, #FB7185) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  color: transparent !important;
}

.dark .loading-indicator .text-indigo-500 {
  color: #9B1B30 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7) !important;
}

.dark .loading-indicator .bg-gradient-to-r.from-emerald-500,
.dark .loading-indicator .bg-gradient-to-r.via-teal-500,
.dark .loading-indicator .bg-gradient-to-r.to-cyan-500 {
  background: linear-gradient(90deg, #34d399, #6ee7b7, #a7f3d0) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  color: transparent !important;
}

.dark .loading-spinner-enhanced {
  border-color: rgba(155, 27, 48, 0.3) !important;
  border-top-color: #9B1B30 !important;
  border-right-color: #DC143C !important;
  border-bottom-color: #FB7185 !important;
  border-left-color: #FDA4AF !important;
}

.dark .loading-indicator .animate-ping {
  border-color: rgba(155, 27, 48, 0.6) !important;
}

.loading-text-gradient {
  background: linear-gradient(-45deg, #9B1B30, #DC143C, #FB7185, #F59E0B);
  background-size: 400% 400%;
  animation: gradient-shift 3s ease infinite;
}

.loading-container-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Modern Premium Style transitions */
a, button {
  transition: all 0.2s ease-in-out;
}

/* Modern Premium Style dropdown animations */
.group:hover .group-hover\:block {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile menu slide-in animation */
@keyframes slide-in {
  from {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateX(-10%) scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-bounce-in {
  animation: bounce-in 0.4s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out forwards;
}
/* SUPER KEREN LIGHT MODE - 4 WARNA PROFESIONAL */
.header-nav {
  /* 4 WARNA SUPER KEREN: */
  --primary: #6366f1;      /* Indigo-500 - Modern & Professional */
  --secondary: #ec4899;    /* Pink-500 - Vibrant & Energetic */
  --accent: #10b981;      /* Emerald-500 - Fresh & Trustworthy */
  --highlight: #f59e0b;   /* Amber-500 - Warm & Inviting */
  
  /* Text Colors */
  --text: #1f2937;        /* Gray-800 - Professional Dark */
  --text-light: #6b7280;  /* Gray-500 - Subtle Text */
  --text-white: #ffffff;  /* Pure White */
  
  /* Background Colors */
  --bg-primary: #ffffff;   /* Pure White */
  --bg-secondary: #f8fafc; /* Gray-50 - Subtle Background */
  --bg-accent: #f1f5f9;    /* Gray-100 - Light Background */
}

/* SUPER KEREN NAVIGATION STYLING */
.header-nav .nav-link {
  color: var(--text) !important;
  background-color: transparent !important;
  text-shadow: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

/* CLEAN HOVER EFFECTS */
.header-nav .nav-link:hover {
  color: var(--text) !important;
  background: transparent !important;
  text-shadow: none !important;
  border-radius: 6px !important;
  padding: 8px 16px !important;
}

/* CLEAN ACTIVE STATES */
.header-nav .nav-link.is-active {
  color: #ffffff !important;
  background: #6b7280 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  font-weight: 600 !important;
  border-radius: 6px !important;
  padding: 8px 16px !important;
}

/* CLEAN DROPDOWN STYLING */
.header-nav .dropdown-link {
  color: var(--text) !important;
  background-color: transparent !important;
  transition: all 0.3s ease !important;
  border-radius: 6px !important;
  padding: 6px 12px !important;
}

.header-nav .dropdown-link:hover {
  color: var(--text) !important;
  background: transparent !important;
  text-shadow: none !important;
}

/* CLEAN NAVIGATION BASE STYLES */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background: transparent !important;
  color: var(--text) !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
}

/* FORCE ALL LINKS TO USE NEW COLOR SYSTEM */
.header-nav a:not(:hover):not(:focus):not(.is-active),
.header-nav .nav-link:not(:hover):not(:focus):not(.is-active) {
  color: var(--text) !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a[href*="jasa-paypal"],
.header-nav .nav-link[href*="jasa-paypal"],
.header-nav a[to="/jasa-paypal"],
.header-nav .nav-link[to="/jasa-paypal"],
.header-nav a[href*="jasa-paypal"]:visited,
.header-nav .nav-link[href*="jasa-paypal"]:visited,
.header-nav a[to="/jasa-paypal"]:visited,
.header-nav .nav-link[to="/jasa-paypal"]:visited {
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
}

/* NO HOVER EFFECTS */
.header-nav a[href*="jasa-paypal"]:hover,
.header-nav .nav-link[href*="jasa-paypal"]:hover,
.header-nav a[to="/jasa-paypal"]:hover,
.header-nav .nav-link[to="/jasa-paypal"]:hover {
  color: var(--text) !important;
  background: transparent !important;
  transform: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
  border-radius: 6px !important;
  padding: 8px 16px !important;
}

/* ULTIMATE FORCE - JASA PAYPAL ACTIVE STATE - FIXED CONTRAST */
.header-nav a[href*="jasa-paypal"].is-active,
.header-nav .nav-link[href*="jasa-paypal"].is-active,
.header-nav a[to="/jasa-paypal"].is-active,
.header-nav .nav-link[to="/jasa-paypal"].is-active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

/* NUCLEAR FORCE - JASA PAYPAL ALL STATES */
.header-nav a[href*="jasa-paypal"]:not(:hover):not(:focus):not(.is-active),
.header-nav .nav-link[href*="jasa-paypal"]:not(:hover):not(:focus):not(.is-active),
.header-nav a[to="/jasa-paypal"]:not(:hover):not(:focus):not(.is-active),
.header-nav .nav-link[to="/jasa-paypal"]:not(:hover):not(:focus):not(.is-active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* NUCLEAR OPTION - FORCE ALL NAVIGATION ELEMENTS */
.header-nav a,
.header-nav .nav-link,
.header-nav button {
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM ALL NAVIGATION */
.header-nav * {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* FORCE ALL NAVIGATION LINKS TO USE 4-COLOR SYSTEM - FIXED */
.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a.is-active,
.header-nav .nav-link.is-active,
.header-nav button.is-active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}
.dark .header-nav { --text: #ffffff; }
.dark .header-nav .nav-link { color: #ffffff !important; }
.dark .header-nav .nav-link:hover { color: var(--primary) !important; }
.dark .header-nav .nav-link:focus-visible { color: var(--primary) !important; }
.dark .header-nav .nav-link.is-active { color: var(--primary) !important; }

.header-nav .nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.375rem 0.25rem;
  color: var(--text);
  transition: color 0.2s ease, transform 0.2s ease, text-shadow 0.2s ease;
  border-radius: 0.375rem;
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}


.header-nav .nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, var(--menu-accent) 0%, var(--menu-accent-2) 50%, var(--menu-accent) 100%);
  /* Fallback for browsers without color-mix support */
  box-shadow: 0 0 10px rgba(234, 179, 8, 0.45), 0 0 2px rgba(234, 179, 8, 0.35);
  /* Dynamic using menu accent */
  box-shadow: 0 0 10px color-mix(in srgb, var(--menu-accent), transparent 55%), 0 0 2px color-mix(in srgb, var(--menu-accent), transparent 65%);
  transition: width 0.25s ease;
  border-radius: 9999px;
}

.header-nav .nav-link:hover,
.header-nav .nav-link:focus-visible {
  color: var(--primary) !important;
  background: transparent !important;
  outline: 0 !important;
  text-shadow: none !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15) !important;
}

.header-nav .nav-link:hover::after,
.header-nav .nav-link:focus-visible::after {
  width: 100%;
}

.header-nav .nav-link:active {
  transform: translateY(0);
  filter: brightness(0.98);
}

/* Dropdown panel subtle animation origin */
.header-nav .dropdown-panel {
  transform-origin: top left;
}

/* Dropdown item styles */
.header-nav .dropdown-link {
  padding: 0.375rem 0.5rem;
  border-radius: 0.5rem;
  color: var(--text);
  transition: background-color 0.2s ease, color 0.2s ease, padding-left 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.header-nav .dropdown-link:hover {
  background: linear-gradient(90deg, color-mix(in srgb, var(--menu-accent), transparent 92%), transparent);
  color: var(--menu-accent);
  padding-left: 0.75rem;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--menu-accent), transparent 75%);
}

.header-nav .dropdown-link::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 3px;
  background: linear-gradient(var(--menu-accent), var(--menu-accent-2));
  border-radius: 9999px;
  opacity: 0;
  transition: opacity 0.2s ease, left 0.2s ease;
}

.header-nav .dropdown-link:hover::before {
  opacity: 1;
  left: -6px;
}

/* Keyboard accessibility: open dropdown on focus */
.group:focus-within .dropdown-panel {
  visibility: visible;
  opacity: 1;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .header-nav .nav-link {
    transition: color 0.01s linear;
    transform: none !important;
    text-shadow: none !important;
  }
  .header-nav .nav-link::after {
    transition: none;
  }
}

/* Respect reduced motion: aurora */
@media (prefers-reduced-motion: reduce) {
  .fancy-header::after { animation: none; }
}

/* Aurora gradient bar under header */
.fancy-header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,0.6), rgba(246,226,122,0.95), rgba(212,175,55,0.6), rgba(212,175,55,0));
  background-size: 200% 100%;
  box-shadow: 0 0 14px rgba(212,175,55,0.25);
  opacity: 0.9;
  pointer-events: none;
  animation: aurora-move 10s linear infinite;
}

@keyframes aurora-move {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Smart mini loader - Fixed position at top */
.mini-loader {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  color: #1f2937;
  border: 1px solid rgba(107, 114, 128, 0.25);
  border-radius: 9999px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: saturate(120%) blur(8px);
  transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  /* Ensure it stays at top and doesn't follow scroll */
  will-change: transform, opacity;
  /* Prevent any scroll interference */
  transform: translateX(-50%) translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.dark .mini-loader {
  background: rgba(31, 41, 55, 0.95);
  color: #e5e7eb;
  border-color: rgba(30, 64, 175, 0.35);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.mini-loader-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  animation: mini-pulse 1.5s ease-out infinite;
  position: relative;
}

/* Unique ring spinner around the dot for a more professional/unique look */
.mini-loader-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 9999px;
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-top-color: #f59e0b;
  border-right-color: #fbbf24;
  border-bottom-color: rgba(245, 158, 11, 0.15);
  border-left-color: rgba(245, 158, 11, 0.15);
  animation: mini-rotate 0.9s linear infinite;
}

@keyframes mini-rotate {
  to { transform: rotate(1turn); }
}

@keyframes mini-pulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

.mini-loader-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  opacity: 0.9;
}

.mini-loader.expanding {
  animation: mini-expand 0.9s ease forwards;
}

@keyframes mini-expand {
  0%   { transform: translateX(-50%) translateZ(0) scale(0.9); }
  50%  { transform: translateX(-50%) translateZ(0) scale(1.08); }
  100% { transform: translateX(-50%) translateZ(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .mini-loader { transition: none; }
  .mini-loader-dot { animation: none; }
  .mini-loader.expanding { animation: none; }
}

/* Responsive offsets for mini-loader to appear just below the header across breakpoints */
@media (min-width: 640px) { .mini-loader { top: 100px; } }
@media (min-width: 768px) { .mini-loader { top: 108px; } }
@media (min-width: 1024px) { .mini-loader { top: 20px; } }
@media (min-width: 1280px) { .mini-loader { top: 28px; } }

/* Enhanced nav-link framed hover/glow (simplified for compatibility) */
.header-nav .nav-link { z-index: 0; }

.header-nav .nav-link:hover,
.header-nav .nav-link:focus-visible {
  /* Thin color ring + soft glow using current menu accent */
  box-shadow:
    0 0 0 1.5px color-mix(in srgb, var(--menu-accent), transparent 60%),
    0 6px 14px color-mix(in srgb, var(--menu-accent), transparent 88%);
  outline: none;
}

/* Dropdown panel enhanced frame (no pseudo masks) */
.header-nav .dropdown-panel {
  border: 1px solid rgba(212, 175, 55, 0.15); /* fallback */
  border-color: color-mix(in srgb, var(--menu-accent), transparent 85%);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.group:hover .dropdown-panel,
.group:focus-within .dropdown-panel {
  border-color: color-mix(in srgb, var(--menu-accent), transparent 55%);
  box-shadow: 0 10px 28px rgba(0,0,0,0.12), 0 0 0 1px color-mix(in srgb, var(--menu-accent), transparent 60%);
}

/* Reduced motion considerations are already handled by existing rules */

/* SUPER KEREN ACTIVE STATES - 4 COLOR SYSTEM */
.header-nav .nav-link.is-active {
  color: var(--primary) !important;
  background: transparent !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15) !important;
}
.header-nav .nav-link.is-active:hover,
.header-nav .nav-link.is-active:focus-visible {
  color: var(--primary) !important;
  background: transparent !important;
  box-shadow: 0 6px 16px rgba(107, 114, 128, 0.2) !important;
}
.header-nav .nav-link.is-active::after { width: 100%; }
.header-nav .dropdown-link.is-active {
  color: var(--secondary) !important;
  background: linear-gradient(135deg, 
    rgba(236, 72, 153, 0.15) 0%, 
    rgba(245, 158, 11, 0.15) 100%) !important;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2) !important;
}

/* Apply modern font to header navigation */
.header-nav, .header-nav .nav-link, .header-nav .dropdown-link, .header-nav .dropdown-panel { font-family: 'Poppins','Inter',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }

/* ULTIMATE NUCLEAR OPTION - FORCE ALL NAVIGATION TO USE 4-COLOR SYSTEM */
.header-nav * {
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
}

/* MEGA FORCE - SPECIFICALLY TARGET JASA PAYPAL LINK */
.header-nav a[href="/jasa-paypal"],
.header-nav a[to="/jasa-paypal"],
.header-nav .nav-link[href="/jasa-paypal"],
.header-nav .nav-link[to="/jasa-paypal"],
.header-nav a[href*="jasa-paypal"],
.header-nav .nav-link[href*="jasa-paypal"] {
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  padding: 0.375rem 0.25rem !important;
  border-radius: 0.375rem !important;
}

/* FORCE JASA PAYPAL HOVER STATES */
.header-nav a[href="/jasa-paypal"]:hover,
.header-nav a[to="/jasa-paypal"]:hover,
.header-nav .nav-link[href="/jasa-paypal"]:hover,
.header-nav .nav-link[to="/jasa-paypal"]:hover,
.header-nav a[href*="jasa-paypal"]:hover,
.header-nav .nav-link[href*="jasa-paypal"]:hover {
  color: var(--primary) !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15) !important;
}

/* FORCE JASA PAYPAL ACTIVE/TOUCH STATES */
.header-nav a[href="/jasa-paypal"]:active,
.header-nav a[to="/jasa-paypal"]:active,
.header-nav .nav-link[href="/jasa-paypal"]:active,
.header-nav .nav-link[to="/jasa-paypal"]:active,
.header-nav a[href*="jasa-paypal"]:active,
.header-nav .nav-link[href*="jasa-paypal"]:active,
.header-nav a[href="/jasa-paypal"]:focus,
.header-nav a[to="/jasa-paypal"]:focus,
.header-nav .nav-link[href="/jasa-paypal"]:focus,
.header-nav .nav-link[to="/jasa-paypal"]:focus,
.header-nav a[href*="jasa-paypal"]:focus,
.header-nav .nav-link[href*="jasa-paypal"]:focus {
  color: var(--primary) !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15) !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

/* ULTIMATE FORCE - PREVENT ALL BLUE COLORS IN NAVIGATION */
.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: var(--primary) !important;
  background: transparent !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* MEGA FORCE - TARGET ALL NAVIGATION LINKS SPECIFICALLY */
.header-nav a[href="/"],
.header-nav a[href="/tentang-kami"],
.header-nav a[href="/transaksi"],
.header-nav a[href="https://bukti.jasapembayaran.id/"],
.header-nav a[href="https://testimonial.jasapembayaran.id/"],
.header-nav .nav-link[href="/"],
.header-nav .nav-link[href="/tentang-kami"],
.header-nav .nav-link[href="/transaksi"],
.header-nav .nav-link[href="https://bukti.jasapembayaran.id/"],
.header-nav .nav-link[href="https://testimonial.jasapembayaran.id/"] {
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* FORCE ALL NAVIGATION LINKS HOVER STATES */
.header-nav a[href="/"]:hover,
.header-nav a[href="/tentang-kami"]:hover,
.header-nav a[href="/transaksi"]:hover,
.header-nav a[href="https://bukti.jasapembayaran.id/"]:hover,
.header-nav a[href="https://testimonial.jasapembayaran.id/"]:hover,
.header-nav .nav-link[href="/"]:hover,
.header-nav .nav-link[href="/tentang-kami"]:hover,
.header-nav .nav-link[href="/transaksi"]:hover,
.header-nav .nav-link[href="https://bukti.jasapembayaran.id/"]:hover,
.header-nav .nav-link[href="https://testimonial.jasapembayaran.id/"]:hover {
  color: var(--primary) !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15) !important;
}

/* FORCE ALL NAVIGATION LINKS ACTIVE/TOUCH STATES */
.header-nav a[href="/"]:active,
.header-nav a[href="/tentang-kami"]:active,
.header-nav a[href="/transaksi"]:active,
.header-nav a[href="https://bukti.jasapembayaran.id/"]:active,
.header-nav a[href="https://testimonial.jasapembayaran.id/"]:active,
.header-nav .nav-link[href="/"]:active,
.header-nav .nav-link[href="/tentang-kami"]:active,
.header-nav .nav-link[href="/transaksi"]:active,
.header-nav .nav-link[href="https://bukti.jasapembayaran.id/"]:active,
.header-nav .nav-link[href="https://testimonial.jasapembayaran.id/"]:active,
.header-nav a[href="/"]:focus,
.header-nav a[href="/tentang-kami"]:focus,
.header-nav a[href="/transaksi"]:focus,
.header-nav a[href="https://bukti.jasapembayaran.id/"]:focus,
.header-nav a[href="https://testimonial.jasapembayaran.id/"]:focus,
.header-nav .nav-link[href="/"]:focus,
.header-nav .nav-link[href="/tentang-kami"]:focus,
.header-nav .nav-link[href="/transaksi"]:focus,
.header-nav .nav-link[href="https://bukti.jasapembayaran.id/"]:focus,
.header-nav .nav-link[href="https://testimonial.jasapembayaran.id/"]:focus {
  color: var(--primary) !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15) !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* NUCLEAR OPTION - FORCE ALL NAVIGATION ELEMENTS TO USE 4-COLOR SYSTEM */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE BACKGROUNDS */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav * {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE BACKGROUNDS */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* FORCE ALL NAVIGATION ELEMENTS TO NEVER BE BLUE */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL BLUE COLORS IN NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* MEGA FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:link,
.header-nav .nav-link:link,
.header-nav button:link,
.header-nav .dropdown-link:link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

.header-nav a:any-link,
.header-nav .nav-link:any-link,
.header-nav button:any-link,
.header-nav .dropdown-link:any-link {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* ULTIMATE FORCE - OVERRIDE ALL POSSIBLE BLUE STATES */
.header-nav a:not(:hover):not(:focus):not(:active),
.header-nav .nav-link:not(:hover):not(:focus):not(:active),
.header-nav button:not(:hover):not(:focus):not(:active),
.header-nav .dropdown-link:not(:hover):not(:focus):not(:active) {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

/* ULTIMATE NUCLEAR FORCE - REMOVE ALL BLUE FROM NAVIGATION */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link {
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  -webkit-text-fill-color: var(--text) !important;
  -webkit-text-stroke: none !important;
  -webkit-tap-highlight-color: transparent !important;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  user-select: none !important;
  touch-action: manipulation !important;
}

.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: transparent !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.header-nav a:visited,
.header-nav .nav-link:visited,
.header-nav button:visited,
.header-nav .dropdown-link:visited {
  color: var(--text) !important;
  background-color: transparent !important;
  background-image: none !important;
  background: transparent !important;
  -webkit-text-fill-color: var(--text) !important;
}

/* Mobile nav purple theme and active states */
.mobile-nav { --menu-accent: #8b5cf6; --menu-accent-2: #6366f1; font-family: 'Poppins','Inter',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
.mobile-nav .mobile-link,
.mobile-nav .mobile-sublink { position: relative; transition: background-color 0.2s ease, color 0.2s ease; border-radius: 0.5rem; }
.mobile-nav .mobile-link:hover,
.mobile-nav .mobile-link:focus-visible,
.mobile-nav .mobile-sublink:hover,
.mobile-nav .mobile-sublink:focus-visible { background-color: rgba(14, 165, 233, 0.08); color: #0ea5e9; outline: none; }
.mobile-nav .mobile-link.is-active,
.mobile-nav .mobile-sublink.is-active { background-color: #0ea5e9; color: #ffffff; box-shadow: 0 8px 18px rgba(14, 165, 233, 0.18); }
.mobile-nav .mobile-link.is-active svg,
.mobile-nav .mobile-sublink.is-active svg { color: #ffffff !important; }

/* Fix overflow for info rows like ISP; truncate inside popover width */
#desktop-clock-popover .mt-1.space-y-1\.5 > div > span.font-medium,
#mobile-clock-popover .mt-1.space-y-1\.5 > div > span.font-medium {
  display: inline-block;
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Keep long labels inside statistic tiles (e.g., Kunjungan Keseluruhan) */
#desktop-clock-popover .grid .leading-tight > div:first-child,
#mobile-clock-popover .grid .leading-tight > div:first-child {
  white-space: normal;
  word-break: break-word;
  line-height: 1.1;
}
/* Prevent tile overflow by allowing shrink */
#desktop-clock-popover .grid > div,
#mobile-clock-popover .grid > div { min-width: 0; }

/* Dark mode header fixes */
.dark-header,
.dark .fancy-header,
html.dark .fancy-header,
[data-theme="dark"] .fancy-header {
  background: linear-gradient(to-r, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.90)) !important;
  backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5) !important;
}

/* Simple logo visibility in dark mode */
.dark .fancy-header img,
html.dark .fancy-header img,
[data-theme="dark"] .fancy-header img,
.dark-header img,
.dark .LogoPro img,
html.dark .LogoPro img,
[data-theme="dark"] .LogoPro img,
.dark-mode .LogoPro img,
body.dark .LogoPro img {
  filter: invert(1) !important;
  opacity: 1 !important;
  background: transparent !important;
}

/* Force dark mode for all text elements */
.dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6,
html.dark h1, html.dark h2, html.dark h3, html.dark h4, html.dark h5, html.dark h6,
[data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3, [data-theme="dark"] h4, [data-theme="dark"] h5, [data-theme="dark"] h6 {
  color: #ffffff !important;
}

.dark p, .dark span, .dark div,
html.dark p, html.dark span, html.dark div,
[data-theme="dark"] p, [data-theme="dark"] span, [data-theme="dark"] div {
  color: #e5e7eb !important;
}

/* Force dark mode for all backgrounds */
.dark .bg-white,
html.dark .bg-white,
[data-theme="dark"] .bg-white {
  background-color: #374151 !important;
}

.dark .bg-gray-50,
html.dark .bg-gray-50,
[data-theme="dark"] .bg-gray-50 {
  background-color: #1f2937 !important;
}

.dark-header .mobile-menu-btn,
.dark .fancy-header .mobile-menu-btn,
html.dark .fancy-header .mobile-menu-btn,
[data-theme="dark"] .fancy-header .mobile-menu-btn {
  background: linear-gradient(to-r, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9)) !important;
}

/* MOBILE MENU SCROLL FIX - Mencegah mobile menu lari ke kanan saat scroll */
.mobile-menu-fixed {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  left: auto !important;
  width: 90% !important;
  max-width: 384px !important;
  transform: translateX(0) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  will-change: auto !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

/* Mobile menu positioning yang stabil untuk semua device kecil */
@media (max-width: 768px) {
  .mobile-menu-fixed {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    left: auto !important;
    width: 90% !important;
    max-width: 384px !important;
    transform: translateX(0) !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

@media (max-width: 480px) {
  .mobile-menu-fixed {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    left: auto !important;
    width: 95% !important;
    max-width: 360px !important;
    transform: translateX(0) !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

@media (max-width: 360px) {
  .mobile-menu-fixed {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    left: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    transform: translateX(0) !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* Mobile dark mode fixes */
@media (max-width: 768px) {
  .dark .fancy-header,
  html.dark .fancy-header,
  [data-theme="dark"] .fancy-header {
    background: rgba(17, 24, 39, 0.95) !important;
    backdrop-filter: blur(20px) !important;
  }
}

/* FORCE FIX - ULTIMATE OVERRIDE */
.running-text-container {
  height: 32px !important;
  padding: 4px 8px !important;
}

.fancy-header {
  top: 32px !important;
  padding: 0 !important;
}

/* Remove global forced spacing for banner; keep mobile-tight spacing only */
@media (max-width: 768px) {
  .hero-offset {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
}

/* =====================================================
   DARK MODE NAVIGATION FIXES - ENHANCED CONTRAST
   ===================================================== */

/* Dark Mode Navigation Hover States - FIXED CONTRAST */
.dark .header-nav .nav-link:hover {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(155, 27, 48, 0.9) 0%, 
    rgba(251, 113, 133, 0.9) 50%, 
    rgba(253, 164, 175, 0.9) 100%) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(155, 27, 48, 0.4) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.dark .header-nav .nav-link.is-active {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(155, 27, 48, 0.95) 0%, 
    rgba(251, 113, 133, 0.95) 50%, 
    rgba(253, 164, 175, 0.95) 100%) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.dark .header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(155, 27, 48, 0.9) 0%, 
    rgba(251, 113, 133, 0.9) 100%) !important;
  transform: translateX(4px) !important;
  box-shadow: 0 2px 8px rgba(155, 27, 48, 0.4) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

/* Dark Mode All Navigation States - FIXED CONTRAST */
.dark .header-nav a:hover,
.dark .header-nav .nav-link:hover,
.dark .header-nav button:hover,
.dark .header-nav .dropdown-link:hover {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(155, 27, 48, 0.9) 0%, 
    rgba(251, 113, 133, 0.9) 50%, 
    rgba(253, 164, 175, 0.9) 100%) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(155, 27, 48, 0.4) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.dark .header-nav a:active,
.dark .header-nav .nav-link:active,
.dark .header-nav button:active,
.dark .header-nav .dropdown-link:active {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(155, 27, 48, 0.95) 0%, 
    rgba(251, 113, 133, 0.95) 50%, 
    rgba(253, 164, 175, 0.95) 100%) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(155, 27, 48, 0.4) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.dark .header-nav a:focus,
.dark .header-nav .nav-link:focus,
.dark .header-nav button:focus,
.dark .header-nav .dropdown-link:focus {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(155, 27, 48, 0.95) 0%, 
    rgba(251, 113, 133, 0.95) 50%, 
    rgba(253, 164, 175, 0.95) 100%) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(155, 27, 48, 0.4) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

/* =====================================================
   CLEAN NAVIGATION - NO HOVER EFFECTS
   ===================================================== */

/* DISABLE ALL HOVER EFFECTS */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link,
.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover,
.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus,
.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  transition: none !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  font-weight: normal !important;
  text-shadow: none !important;
}

/* DARK MODE - NO HOVER EFFECTS */
.dark .header-nav a,
.dark .header-nav .nav-link,
.dark .header-nav button,
.dark .header-nav .dropdown-link,
.dark .header-nav a:hover,
.dark .header-nav .nav-link:hover,
.dark .header-nav button:hover,
.dark .header-nav .dropdown-link:hover,
.dark .header-nav a:focus,
.dark .header-nav .nav-link:focus,
.dark .header-nav button:focus,
.dark .header-nav .dropdown-link:focus,
.dark .header-nav a:active,
.dark .header-nav .nav-link:active,
.dark .header-nav button:active,
.dark .header-nav .dropdown-link:active {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
  transition: none !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  font-weight: normal !important;
  text-shadow: none !important;
}

/* ALL HOVER EFFECTS REMOVED - NAVIGATION NOW CLEAN */

/* SUPER KEREN NAVIGATION STYLES */
.nav-link-clean,
.dropdown-link-clean {
  color: var(--text) !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  transform: none !important;
  position: relative !important;
  overflow: hidden !important;
}

.nav-link-clean::before,
.dropdown-link-clean::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(236, 72, 153, 0.1) 50%, 
    rgba(16, 185, 129, 0.1) 100%) !important;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: -1 !important;
}

.nav-link-clean:hover,
.nav-link-clean:focus,
.dropdown-link-clean:hover,
.dropdown-link-clean:focus {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.9) 0%, 
    rgba(236, 72, 153, 0.9) 50%, 
    rgba(16, 185, 129, 0.9) 100%) !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px) scale(1.02) !important;
}

.nav-link-clean:hover::before,
.dropdown-link-clean:hover::before {
  left: 0 !important;
}

.nav-link-clean:active,
.dropdown-link-clean:active {
  transform: translateY(0) scale(0.98) !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
}

.nav-link-clean.is-active,
.dropdown-link-clean.is-active {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.95) 0%, 
    rgba(236, 72, 153, 0.95) 50%, 
    rgba(16, 185, 129, 0.95) 100%) !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-1px) scale(1.01) !important;
}

/* DARK MODE SUPER KEREN STYLES */
.dark .nav-link-clean,
.dark .dropdown-link-clean {
  color: var(--text) !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  transform: none !important;
  position: relative !important;
  overflow: hidden !important;
}

.dark .nav-link-clean::before,
.dark .dropdown-link-clean::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.15) 0%, 
    rgba(236, 72, 153, 0.15) 50%, 
    rgba(16, 185, 129, 0.15) 100%) !important;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: -1 !important;
}

.dark .nav-link-clean:hover,
.dark .nav-link-clean:focus,
.dark .dropdown-link-clean:hover,
.dark .dropdown-link-clean:focus {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.9) 0%, 
    rgba(236, 72, 153, 0.9) 50%, 
    rgba(16, 185, 129, 0.9) 100%) !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px) scale(1.02) !important;
}

.dark .nav-link-clean:hover::before,
.dark .dropdown-link-clean:hover::before {
  left: 0 !important;
}

.dark .nav-link-clean:active,
.dark .dropdown-link-clean:active {
  transform: translateY(0) scale(0.98) !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.5) !important;
}

.dark .nav-link-clean.is-active,
.dark .dropdown-link-clean.is-active {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.95) 0%, 
    rgba(236, 72, 153, 0.95) 50%, 
    rgba(16, 185, 129, 0.95) 100%) !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6) !important;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-1px) scale(1.01) !important;
}

/* SUPER KEREN DROPDOWN PANEL - RESPONSIVE FIX */
.dropdown-panel-super {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.98) 50%,
    rgba(241, 245, 249, 0.98) 100%) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  border: 2px solid rgba(99, 102, 241, 0.2) !important;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(99, 102, 241, 0.1) !important;
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  transform: translateY(0) !important;
  overflow: hidden !important;
  z-index: 9999 !important;
  max-width: 300px !important;
  width: auto !important;
  min-width: 220px !important;
}

.dropdown-panel-super::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 2px !important;
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.8) 0%, 
    rgba(236, 72, 153, 0.8) 50%, 
    rgba(16, 185, 129, 0.8) 100%) !important;
  z-index: 1 !important;
}

.dark .dropdown-panel-super {
  background: linear-gradient(135deg, 
    rgba(17, 24, 39, 0.98) 0%, 
    rgba(31, 41, 55, 0.98) 50%,
    rgba(55, 65, 81, 0.98) 100%) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  border: 2px solid rgba(99, 102, 241, 0.3) !important;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 10px 20px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(99, 102, 241, 0.2) !important;
}

.dark .dropdown-panel-super::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 2px !important;
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.9) 0%, 
    rgba(236, 72, 153, 0.9) 50%, 
    rgba(16, 185, 129, 0.9) 100%) !important;
  z-index: 1 !important;
}

/* SUPER KEREN DROPDOWN LINKS INSIDE PANEL */
.dropdown-panel-super .dropdown-link-clean {
  color: var(--text) !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 12px 16px !important;
  border-radius: 10px !important;
  font-weight: 500 !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: 1px solid transparent !important;
  transform: none !important;
  position: relative !important;
  overflow: hidden !important;
  margin: 2px 0 !important;
}

.dropdown-panel-super .dropdown-link-clean::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.08) 0%, 
    rgba(236, 72, 153, 0.08) 50%, 
    rgba(16, 185, 129, 0.08) 100%) !important;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: -1 !important;
}

.dropdown-panel-super .dropdown-link-clean:hover,
.dropdown-panel-super .dropdown-link-clean:focus {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.8) 0%, 
    rgba(236, 72, 153, 0.8) 50%, 
    rgba(16, 185, 129, 0.8) 100%) !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 12px 16px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transform: translateX(4px) scale(1.01) !important;
}

.dropdown-panel-super .dropdown-link-clean:hover::before {
  left: 0 !important;
}

.dropdown-panel-super .dropdown-link-clean.is-active {
  color: #ffffff !important;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.9) 0%, 
    rgba(236, 72, 153, 0.9) 50%, 
    rgba(16, 185, 129, 0.9) 100%) !important;
  background-color: transparent !important;
  background-image: none !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 12px 16px !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) !important;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  transform: translateX(2px) scale(1.005) !important;
}

/* RESPONSIVE DROPDOWN FIXES */
@media (max-width: 1024px) {
  .dropdown-panel-super {
    position: fixed !important;
    top: auto !important;
    left: 50% !important;
    right: auto !important;
    bottom: 20px !important;
    transform: translateX(-50%) !important;
    width: 90% !important;
    max-width: 400px !important;
    min-width: 280px !important;
    z-index: 10000 !important;
  }
}

@media (max-width: 768px) {
  .dropdown-panel-super {
    width: 95% !important;
    max-width: 350px !important;
    min-width: 250px !important;
    bottom: 10px !important;
  }
}

@media (max-width: 640px) {
  .dropdown-panel-super {
    width: 98% !important;
    max-width: 320px !important;
    min-width: 200px !important;
    padding: 12px 16px !important;
  }
}

/* FORCE DROPDOWN TO STAY BELOW PARENT */
.relative.group .dropdown-panel-super {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: auto !important;
  bottom: auto !important;
  transform: translateY(0) !important;
  z-index: 9999 !important;
}

/* NUCLEAR OPTION - FORCE ALL NAVIGATION TO BE TRANSPARENT */
.header-nav a,
.header-nav .nav-link,
.header-nav button,
.header-nav .dropdown-link,
.header-nav a:hover,
.header-nav .nav-link:hover,
.header-nav button:hover,
.header-nav .dropdown-link:hover,
.header-nav a:focus,
.header-nav .nav-link:focus,
.header-nav button:focus,
.header-nav .dropdown-link:focus,
.header-nav a:active,
.header-nav .nav-link:active,
.header-nav button:active,
.header-nav .dropdown-link:active {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
  transform: none !important;
}

/* DARK MODE - FORCE ALL NAVIGATION TO BE TRANSPARENT */
.dark .header-nav a,
.dark .header-nav .nav-link,
.dark .header-nav button,
.dark .header-nav .dropdown-link,
.dark .header-nav a:hover,
.dark .header-nav .nav-link:hover,
.dark .header-nav button:hover,
.dark .header-nav .dropdown-link:hover,
.dark .header-nav a:focus,
.dark .header-nav .nav-link:focus,
.dark .header-nav button:focus,
.dark .header-nav .dropdown-link:focus,
.dark .header-nav a:active,
.dark .header-nav .nav-link:active,
.dark .header-nav button:active,
.dark .header-nav .dropdown-link:active {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
  transform: none !important;
}

/* ULTIMATE OVERRIDE - FORCE ALL NAVIGATION TO BE TRANSPARENT */
html body .header-nav a,
html body .header-nav .nav-link,
html body .header-nav button,
html body .header-nav .dropdown-link,
html body .header-nav a:hover,
html body .header-nav .nav-link:hover,
html body .header-nav button:hover,
html body .header-nav .dropdown-link:hover,
html body .header-nav a:focus,
html body .header-nav .nav-link:focus,
html body .header-nav button:focus,
html body .header-nav .dropdown-link:focus,
html body .header-nav a:active,
html body .header-nav .nav-link:active,
html body .header-nav button:active,
html body .header-nav .dropdown-link:active {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
  transform: none !important;
}

/* DARK MODE ULTIMATE OVERRIDE */
html body .dark .header-nav a,
html body .dark .header-nav .nav-link,
html body .dark .header-nav button,
html body .dark .header-nav .dropdown-link,
html body .dark .header-nav a:hover,
html body .dark .header-nav .nav-link:hover,
html body .dark .header-nav button:hover,
html body .dark .header-nav .dropdown-link:hover,
html body .dark .header-nav a:focus,
html body .dark .header-nav .nav-link:focus,
html body .dark .header-nav button:focus,
html body .dark .header-nav .dropdown-link:focus,
html body .dark .header-nav a:active,
html body .dark .header-nav .nav-link:active,
html body .dark .header-nav button:active,
html body .dark .header-nav .dropdown-link:active {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  color: var(--text) !important;
  text-shadow: none !important;
  box-shadow: none !important;
  border: none !important;
  transform: none !important;
}

</style>

