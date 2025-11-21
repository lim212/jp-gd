<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <UPageSection
    id="about-section"
    variant="subtle"
    class="@container overflow-visible"
    :ui="{
      container:
        'pt-0 pb-4 px-4 sm:px-4 lg:px-6 lg:pt-0 lg:pb-4 sm:gap-3 overflow-visible mt-2 w-full',
    }"
  >
        <div class="w-full mb-3 md:mb-4 lg:mb-5">
      <!-- Main Content Container - 1 Kotak Besar seperti Trusted Partners -->
      <div class="main-content-container group relative bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/30 dark:from-gray-800/90 dark:via-blue-950/30 dark:to-indigo-950/20 p-6 md:p-8 lg:p-10 rounded-3xl border border-blue-200/60 dark:border-gray-700/40 hover:border-blue-400 dark:hover:border-blue-600/50 shadow-xl dark:shadow-none hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <!-- Background Effects -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 dark:from-blue-400/5 dark:to-indigo-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <!-- Title Section Inside Box -->
          <div class="mb-6 md:mb-8 text-center">
            <h1 class="font-bold text-xl md:text-3xl lg:text-4xl uppercase leading-tight">
              <div class="flex items-center gap-2 md:gap-3 justify-center">
                <UIcon name="i-mdi-paypal" class="text-ui-primary size-6 md:size-10" />
                <span class="text-ui-primary font-bold relative">
                  {{ t('about.paypal_service_title') }}
                  <span class="absolute -bottom-2 left-0 w-full h-1 bg-ui-primary rounded-full"></span>
                </span>
                <UIcon name="i-mdi-credit-card" class="text-ui-primary size-6 md:size-10" />
              </div>
            </h1>
          </div>

          <div class="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <!-- Left side with icon -->
            <div class="flex-shrink-0 p-4">
              <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <UIcon name="i-mdi-paypal" class="size-16 md:size-20 text-white dark:text-gray-900" />
              </div>
            </div>

            <!-- Right side with content -->
            <div class="flex-grow">
              <!-- Main Description -->
              <div class="mb-6">
                <h2 class="font-black text-2xl md:text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  {{ t('about.definition_title') }}
                </h2>
                <p class="text-gray-800 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {{ t('about.services_intro') }}
                </p>
              </div>

              <!-- Services Grid - SUPER KEREN & RAPI 4 KOTAK -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10 items-stretch">
                <!-- PayPal Services -->
                <div class="group relative service-item paypal-card rounded-2xl transition-all duration-500 p-6 lg:p-8 overflow-hidden h-full flex flex-col">
                  <!-- Background Effects -->
                  <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/60 to-blue-100/40 dark:from-gray-800 dark:via-blue-950/40 dark:to-blue-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div class="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  
                  <div class="relative z-10 flex flex-col h-full">
                    <!-- Header with Icon -->
                    <div class="service-header">
                      <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 mr-4">
                        <UIcon name="i-mdi-paypal" class="size-6 text-white" />
                      </div>
                      <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {{ t('about.paypal_services.title') }}
                      </h3>
                    </div>
                    
                    <!-- Services List -->
                    <div class="space-y-3">
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0 shadow-sm"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.paypal_services.intermediary.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.paypal_services.intermediary.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0 shadow-sm"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.paypal_services.payment.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.paypal_services.payment.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0 shadow-sm"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.paypal_services.transfer.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.paypal_services.transfer.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0 shadow-sm"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.paypal_services.topup.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.paypal_services.topup.description') }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Bottom Accent Line -->
                    <div class="mt-6 flex justify-center mt-auto pt-4">
                      <div class="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>

                <!-- Bitcoin Services -->
                <div class="group relative service-item bitcoin-card rounded-2xl transition-all duration-500 p-6 lg:p-8 overflow-hidden h-full flex flex-col">
                  <!-- Background Effects -->
                  <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-orange-50/60 to-orange-100/40 dark:from-gray-800 dark:via-orange-950/40 dark:to-orange-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div class="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500 bg-gradient-to-br from-orange-500 to-orange-600"></div>
                  
                  <div class="relative z-10 flex flex-col h-full">
                    <!-- Header with Icon -->
                    <div class="service-header">
                      <div class="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 mr-4">
                        <UIcon name="i-lucide-bitcoin" class="size-6 text-white" />
                      </div>
                      <h3 class="font-bold text-lg text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">
                        {{ t('about.bitcoin_services.title') }}
                      </h3>
                    </div>
                    
                    <!-- Services List -->
                    <div class="space-y-3">
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.bitcoin_services.general.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.bitcoin_services.general.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.bitcoin_services.payment.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.bitcoin_services.payment.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.bitcoin_services.send.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.bitcoin_services.send.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.bitcoin_services.transfer.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.bitcoin_services.transfer.description') }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Bottom Accent Line -->
                    <div class="mt-6 flex justify-center mt-auto pt-4">
                      <div class="w-16 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>

                <!-- TRC20 Services -->
                <div class="group relative service-item trc20-card rounded-2xl transition-all duration-500 p-6 lg:p-8 overflow-hidden h-full flex flex-col">
                  <!-- Background Effects -->
                  <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/60 to-green-100/40 dark:from-gray-800 dark:via-green-950/40 dark:to-green-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div class="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500 bg-gradient-to-br from-green-500 to-green-600"></div>
                  
                  <div class="relative z-10 flex flex-col h-full">
                    <!-- Header with Icon -->
                    <div class="service-header">
                      <div class="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 mr-4">
                        <UIcon name="i-lucide-banknote" class="size-6 text-white" />
                      </div>
                      <h3 class="font-bold text-lg text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                        {{ t('about.trc20_services.title') }}
                      </h3>
                    </div>
                    
                    <!-- Services List -->
                    <div class="space-y-3">
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.trc20_services.general.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.trc20_services.general.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.trc20_services.transfer.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.trc20_services.transfer.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.trc20_services.deposit.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.trc20_services.deposit.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.trc20_services.withdraw.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.trc20_services.withdraw.description') }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Bottom Accent Line -->
                    <div class="mt-6 flex justify-center mt-auto pt-4">
                      <div class="w-16 h-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>

                <!-- Skrill Services -->
                <div class="group relative service-item skrill-card rounded-2xl transition-all duration-500 p-6 lg:p-8 overflow-hidden h-full flex flex-col">
                  <!-- Background Effects -->
                  <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50/60 to-purple-100/40 dark:from-gray-800 dark:via-purple-950/40 dark:to-purple-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div class="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500 bg-gradient-to-br from-purple-500 to-purple-600"></div>
                  
                  <div class="relative z-10 flex flex-col h-full">
                    <!-- Header with Icon -->
                    <div class="service-header">
                      <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300 mr-4">
                        <UIcon name="i-lucide-credit-card" class="size-6 text-white" />
                      </div>
                      <h3 class="font-bold text-lg text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                        {{ t('about.skrill_services.title') }}
                      </h3>
                    </div>
                    
                    <!-- Services List -->
                    <div class="space-y-3">
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.skrill_services.payment.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.skrill_services.payment.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.skrill_services.transfer.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.skrill_services.transfer.description') }}</p>
                        </div>
                      </div>
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <strong class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ t('about.skrill_services.credit_card.title') }}</strong>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ t('about.skrill_services.credit_card.description') }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Bottom Accent Line -->
                    <div class="mt-6 flex justify-center mt-auto pt-4">
                      <div class="w-16 h-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Services Availability -->
              <div class="mb-6">
                <h3 class="font-bold text-lg md:text-xl mb-2 text-amber-600 dark:text-amber-400 flex items-center">
                  <UIcon name="i-mdi-clock-outline" class="mr-2 size-5" />
                  Ketersediaan Layanan
                </h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {{ t('about.services_availability') }}
                </p>
              </div>

              <!-- Procedure -->
              <div class="mb-6">
                <h3 class="font-bold text-lg md:text-xl mb-2 text-cyan-600 dark:text-cyan-400 flex items-center">
                  <UIcon name="i-mdi-information-outline" class="mr-2 size-5" />
                  {{ t('about.procedure.title') }}
                </h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {{ t('about.procedure.description') }}
                </p>
              </div>

              <!-- Licensing -->
              <div class="mb-6">
                <h3 class="font-bold text-lg md:text-xl mb-2 text-emerald-600 dark:text-emerald-400 flex items-center">
                  <UIcon name="i-mdi-certificate-outline" class="mr-2 size-5" />
                  {{ t('about.licensing.title') }}
                </h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                  {{ t('about.licensing.description') }}
                </p>
              </div>

              <!-- Official Documents -->
              <div class="mb-6">
                <h3 class="font-bold text-lg md:text-xl mb-3 text-purple-600 dark:text-purple-400 flex items-center">
                  <UIcon name="i-mdi-file-document-outline" class="mr-2 size-5" />
                  {{ t('about.official_documents.title') }}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-3">
                  <div class="p-4 sm:p-5 transition-all duration-200">
                    <p class="font-medium mb-3 sm:mb-4 text-lg">
                      {{ t('about.official_documents.indonesia.title') }}
                    </p>
                    <div class="relative overflow-hidden rounded-lg">
                      <a 
                        href="/documents/nib-indonesia.pdf"
                        class="relative inline-flex items-center justify-center px-4 sm:px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 w-full text-base sm:text-lg font-semibold shadow-md hover:shadow-lg group ring-1 ring-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        target="_blank"
                      >
                        <span class="relative z-10 i-mdi-paypal size-5 sm:size-6 mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                        <span class="relative z-10 tracking-wide doc-download-label">
                          {{ t('about.official_documents.download_button') }}
                        </span>
                        <span class="relative z-10 i-heroicons-arrow-down-tray size-5 sm:size-6 ml-2" />
                      </a>
                    </div>
                  </div>
                  <div class="p-4 sm:p-5 transition-all duration-200">
                    <p class="font-medium mb-3 sm:mb-4 text-lg">
                      {{ t('about.official_documents.tangerang.title') }}
                    </p>
                    <div class="relative overflow-hidden rounded-lg">
                      <a 
                        href="/documents/nib-tangerang.pdf"
                        class="relative inline-flex items-center justify-center px-4 sm:px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 w-full text-base sm:text-lg font-semibold shadow-md hover:shadow-lg group ring-1 ring-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        target="_blank"
                      >
                        <span class="relative z-10 i-mdi-paypal size-5 sm:size-6 mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                        <span class="relative z-10 tracking-wide doc-download-label">
                          {{ t('about.official_documents.download_button') }}
                        </span>
                        <span class="relative z-10 i-heroicons-arrow-down-tray size-5 sm:size-6 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>


<style scoped>
/* Main Content Container Animations */
.main-content-container {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content-container:hover {
  transform: translateY(-4px) scale(1.01);
}

/* Service Item Styling - SUPER KEREN & RAPI */
.service-item {
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: linear-gradient(140deg, rgba(248, 250, 252, 0.95), rgba(226, 238, 255, 0.9));
  border: 1.5px solid rgba(148, 163, 184, 0.3);
  box-shadow:
    0 25px 60px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.45s ease, box-shadow 0.45s ease, border 0.45s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Colored top header line per service card – membuat persepsi judul lebih presisi */
.paypal-card {
  border-top-width: 4px;
  border-top-color: #2563eb;
}

.bitcoin-card {
  border-top-width: 4px;
  border-top-color: #f97316;
}

.trc20-card {
  border-top-width: 4px;
  border-top-color: #16a34a;
}

.skrill-card {
  border-top-width: 4px;
  border-top-color: #8b5cf6;
}

/* Unified header layout for the 4 service cards */
.service-header {
  display: flex;
  align-items: center; /* simpelnya: icon + 1 baris judul selalu di tengah vertikal */
  gap: 0.75rem;
  margin-top: 0;
  margin-bottom: 1.25rem;
  padding-top: 0;
  min-height: 3rem;
}

.service-item::before,
.service-item::after {
  content: '';
  position: absolute;
  inset: -40% -20%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;
}

.service-item::after {
  inset: -60% 20%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.12), transparent 70%);
}

.service-item:hover {
  transform: translateY(-6px) scale(1.015);
  border-color: rgba(99, 102, 241, 0.35);
  box-shadow:
    0 32px 72px rgba(15, 23, 42, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.service-item:hover::before,
.service-item:hover::after {
  opacity: 1;
  transform: scale(1.1);
}

.service-item strong {
  color: #0f172a;
  font-weight: 700;
}

.service-item p {
  color: #475569;
}

/* Ensure all service card headers (icon + title) align nicely across the grid */
.service-item h3 {
  font-size: 1.05rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
}


.dark .service-item strong {
  color: #f8fafc;
}

.dark .service-item p {
  color: #cbd5f5;
}

/* Ensure all service cards have identical spacing - including PayPal */
.paypal-card,
.bitcoin-card,
.trc20-card,
.skrill-card {
  padding-top: 1.5rem !important; /* Match p-6 */
}

@media (min-width: 1024px) {
  .paypal-card,
  .bitcoin-card,
  .trc20-card,
  .skrill-card {
    padding-top: 2rem !important; /* Match lg:p-8 */
  }
}

/* Ensure all service card containers have identical spacing */
.paypal-card .relative.z-10,
.bitcoin-card .relative.z-10,
.trc20-card .relative.z-10,
.skrill-card .relative.z-10 {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Ensure all service headers have identical spacing */
.paypal-card .service-header,
.bitcoin-card .service-header,
.trc20-card .service-header,
.skrill-card .service-header {
  margin-top: 0 !important;
  padding-top: 0 !important;
  margin-bottom: 1.25rem;
}

.dark .service-item {
  background: linear-gradient(150deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.9)) !important;
  border: 1.5px solid rgba(59, 130, 246, 0.22) !important;
  box-shadow:
    0 26px 58px rgba(8, 11, 24, 0.55),
    inset 0 1px 0 rgba(148, 163, 184, 0.18) !important;
}

.dark .service-item::before {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.25), transparent 70%);
}

.dark .service-item::after {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.2), transparent 70%);
}

.dark .service-item:hover {
  border-color: rgba(125, 211, 252, 0.45) !important;
  box-shadow:
    0 30px 72px rgba(8, 11, 24, 0.65),
    inset 0 1px 0 rgba(209, 233, 255, 0.2) !important;
}

/* Mobile Optimization untuk 4 Kotak Box */
@media (max-width: 768px) {
  .service-item {
    padding: 1rem !important;
    border-radius: 0.75rem !important;
    margin-bottom: 1rem !important;
  }
  
  .service-item:hover {
    transform: translateY(-2px) scale(1.01) !important;
  }
  
  .service-item h3 {
    font-size: 1rem !important;
    margin-bottom: 1rem !important;
  }
  
  .service-item .space-y-3 {
    gap: 0.75rem !important;
  }
  
  .service-item .text-sm {
    font-size: 0.875rem !important;
  }
  
  .service-item .text-xs {
    font-size: 0.75rem !important;
  }
  
  .service-item .p-3 {
    padding: 0.5rem !important;
  }
  
  .service-item .size-6 {
    width: 1.25rem !important;
    height: 1.25rem !important;
  }
  
  .service-item .w-2 {
    width: 0.375rem !important;
  }
  
  .service-item .h-2 {
    height: 0.375rem !important;
  }
  
  .service-item .mt-2 {
    margin-top: 0.375rem !important;
  }
}

/* Shimmer Effect for Main Content Container */
.main-content-container::before {
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

.main-content-container:hover::before {
  left: 100%;
}

/* Enhanced Focus States */
.main-content-container:focus-within,
.service-item:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Performance Optimizations */
.main-content-container,
.service-item {
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .main-content-container,
  .service-item,
  .main-content-container::before {
    transition: none;
    animation: none;
  }
  
  .main-content-container:hover,
  .service-item:hover {
    transform: none;
  }
}

@media (max-width: 768px) {
  .main-content-container h1 {
    font-size: 1.25rem;
    letter-spacing: normal;
  }

  .main-content-container h1 .size-6 {
    width: 1.25rem;
    height: 1.25rem;
  }

  #about-section p {
    font-size: 15px;
    line-height: 1.6;
    text-align: left;
  }

  #about-section ul {
    padding-left: 1.25rem; /* ~20px indent */
  }

  #about-section ul li strong {
    font-weight: 600; /* bold lead text in bullet items */
  }

  /* Lighter shadows across this section on small screens */
  #about-section .shadow-lg,
  #about-section .shadow-md,
  #about-section .shadow-xl {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important; /* approx Tailwind shadow-sm */
  }

  /* Ensure compact title bar height on very small screens */
  .main-content-container h1 > div {
    padding-top: 6px;
    padding-bottom: 6px;
  }

  /* Mobile optimizations for main container */
  .main-content-container {
    padding: 0.75rem !important;
    margin-bottom: 6rem !important;
  }

  .main-content-container h2 {
    font-size: 1.25rem !important;
  }

  .main-content-container h3 {
    font-size: 1rem !important;
  }

  .main-content-container p,
  .main-content-container ul li {
    font-size: 0.875rem !important;
  }

  .service-item {
    padding: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }

  /* Mobile grid fixes */
  .main-content-container .grid {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
  }

  .main-content-container .flex {
    flex-direction: column !important;
    gap: 0.75rem !important;
  }
}

@media (max-width: 640px) {
  /* Further mobile optimizations */
  .main-content-container {
    padding: 0.875rem 1rem;
  }

  .main-content-container h2 {
    font-size: 1.25rem;
  }

  .main-content-container h3 {
    font-size: 1rem;
  }

  .main-content-container p,
  .main-content-container ul li {
    font-size: 0.8125rem;
  }

  .service-item {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  /* Extra small screens */
  .main-content-container {
    padding: 0.75rem 0.875rem;
  }

  .main-content-container h2 {
    font-size: 1.125rem;
  }

  .main-content-container h3 {
    font-size: 0.9375rem;
  }

  .main-content-container p,
  .main-content-container ul li {
    font-size: 0.875rem;
  }

  .service-item {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  /* Enhanced mobile spacing */
  .grid {
    gap: 1.5rem;
  }
  
  /* Better mobile typography */
  .service-item h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  .service-item ul {
    padding-left: 1.5rem;
  }
  
  .service-item li {
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }
}

/* Additional mobile improvements */
@media (max-width: 480px) {
  .service-item {
    padding: 1rem;
  }
  
  .grid {
    gap: 1.5rem;
  }
  
  /* Enhanced mobile spacing for better readability */
  .service-item h3 {
    font-size: 1.125rem;
    margin-bottom: 1.25rem;
  }
  
  .service-item ul {
    padding-left: 1.75rem;
  }
  
  .service-item li {
    line-height: 1.7;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}

/* Extra small screens optimization */
@media (max-width: 360px) {
  .service-item {
    padding: 0.875rem;
  }
  
  .grid {
    gap: 1.25rem;
  }
  
  .service-item h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .service-item ul {
    padding-left: 1.5rem;
  }
  
  .service-item li {
    line-height: 1.6;
    margin-bottom: 0.875rem;
    font-size: 0.8125rem;
  }
}
</style>


<style scoped>
/* Enhance readability and visibility for download buttons under Dokumen Resmi */
#about-section a.group span,
#about-section .doc-download-label {
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.32);
}

/* Force a high-contrast label color so it's not white */
#about-section .doc-download-label {
  color: #A855F7; /* Tailwind purple-500 */
}

/* Slightly brighter on hover for better affordance */
#about-section a.group:hover .doc-download-label,
#about-section .doc-download-btn:hover .doc-download-label {
  color: #C4B5FD; /* Tailwind purple-300 */
}
</style>

