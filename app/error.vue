<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed, ref, defineAsyncComponent } from '#imports'

// Dynamically import ChatWhatsapp to avoid conflicts with app.vue
const ChatWhatsapp = defineAsyncComponent({
  loader: () => import('./components/ChatWhatsapp.vue'),
  loadingComponent: null,
  errorComponent: null,
  delay: 200,
  timeout: 3000
})

const props = defineProps<{
  error?: NuxtError | null
}>()

const statusCode = computed(() => {
  const raw: any = props.error?.statusCode
  const n = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw)
  return Number.isFinite(n) ? n : 500
})

const is404 = computed(() => statusCode.value === 404)
const is4xx = computed(() => statusCode.value >= 400 && statusCode.value < 500)
const is5xx = computed(() => statusCode.value >= 500 && statusCode.value < 600)

// Error codes database
const errorCodes = {
  // 4xx Client Errors
  400: { 
    title: 'Bad Request', 
    message: 'Permintaan tidak valid. Server tidak dapat memproses permintaan karena sintaks yang salah.',
    icon: 'i-lucide-alert-triangle',
    color: 'orange'
  },
  401: { 
    title: 'Unauthorized', 
    message: 'Akses ditolak. Anda perlu melakukan autentikasi untuk mengakses halaman ini.',
    icon: 'i-lucide-lock',
    color: 'red'
  },
  403: { 
    title: 'Forbidden', 
    message: 'Akses dilarang. Anda tidak memiliki izin untuk mengakses halaman ini.',
    icon: 'i-lucide-shield-x',
    color: 'red'
  },
  404: { 
    title: 'Not Found', 
    message: 'Halaman tidak ditemukan. URL yang Anda cari mungkin telah dipindahkan atau dihapus.',
    icon: 'i-lucide-search-x',
    color: 'blue'
  },
  405: { 
    title: 'Method Not Allowed', 
    message: 'Metode HTTP tidak diizinkan untuk URL ini.',
    icon: 'i-lucide-ban',
    color: 'orange'
  },
  406: { 
    title: 'Not Acceptable', 
    message: 'Server tidak dapat menghasilkan respons yang sesuai dengan header Accept.',
    icon: 'i-lucide-x-circle',
    color: 'orange'
  },
  407: { 
    title: 'Proxy Authentication Required', 
    message: 'Autentikasi proxy diperlukan.',
    icon: 'i-lucide-shield-check',
    color: 'blue'
  },
  408: { 
    title: 'Request Timeout', 
    message: 'Permintaan timeout. Server tidak menerima permintaan dalam waktu yang ditentukan.',
    icon: 'i-lucide-clock',
    color: 'orange'
  },
  409: { 
    title: 'Conflict', 
    message: 'Konflik dengan status sumber daya saat ini.',
    icon: 'i-lucide-alert-circle',
    color: 'red'
  },
  410: { 
    title: 'Gone', 
    message: 'Sumber daya tidak lagi tersedia dan tidak akan tersedia lagi.',
    icon: 'i-lucide-trash-2',
    color: 'gray'
  },
  411: { 
    title: 'Length Required', 
    message: 'Header Content-Length diperlukan.',
    icon: 'i-lucide-ruler',
    color: 'orange'
  },
  412: { 
    title: 'Precondition Failed', 
    message: 'Prasyarat yang diberikan dalam header salah.',
    icon: 'i-lucide-x',
    color: 'red'
  },
  413: { 
    title: 'Payload Too Large', 
    message: 'Payload terlalu besar untuk diproses.',
    icon: 'i-lucide-package-x',
    color: 'red'
  },
  414: { 
    title: 'URI Too Long', 
    message: 'URI terlalu panjang untuk diproses.',
    icon: 'i-lucide-link-2',
    color: 'red'
  },
  415: { 
    title: 'Unsupported Media Type', 
    message: 'Format media tidak didukung.',
    icon: 'i-lucide-file-x',
    color: 'orange'
  },
  416: { 
    title: 'Range Not Satisfiable', 
    message: 'Rentang yang diminta tidak dapat dipenuhi.',
    icon: 'i-lucide-scissors',
    color: 'red'
  },
  417: { 
    title: 'Expectation Failed', 
    message: 'Ekspektasi yang diberikan dalam header Expect tidak dapat dipenuhi.',
    icon: 'i-lucide-thumbs-down',
    color: 'red'
  },
  418: { 
    title: "I'm a teapot", 
    message: 'Server menolak untuk menyeduh kopi karena itu adalah teko.',
    icon: 'i-lucide-coffee',
    color: 'purple'
  },
  421: { 
    title: 'Misdirected Request', 
    message: 'Permintaan diarahkan ke server yang tidak dapat menghasilkan respons.',
    icon: 'i-lucide-navigation',
    color: 'orange'
  },
  422: { 
    title: 'Unprocessable Entity', 
    message: 'Entitas tidak dapat diproses meskipun sintaksnya benar.',
    icon: 'i-lucide-file-question',
    color: 'orange'
  },
  423: { 
    title: 'Locked', 
    message: 'Sumber daya terkunci.',
    icon: 'i-lucide-lock',
    color: 'orange'
  },
  424: { 
    title: 'Failed Dependency', 
    message: 'Permintaan gagal karena kegagalan permintaan sebelumnya.',
    icon: 'i-lucide-link',
    color: 'red'
  },
  425: { 
    title: 'Too Early', 
    message: 'Server tidak mau memproses permintaan karena mungkin diulang.',
    icon: 'i-lucide-clock-4',
    color: 'orange'
  },
  426: { 
    title: 'Upgrade Required', 
    message: 'Server menolak untuk melakukan permintaan menggunakan protokol saat ini.',
    icon: 'i-lucide-arrow-up',
    color: 'blue'
  },
  428: { 
    title: 'Precondition Required', 
    message: 'Prasyarat diperlukan.',
    icon: 'i-lucide-check-circle',
    color: 'orange'
  },
  429: { 
    title: 'Too Many Requests', 
    message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    icon: 'i-lucide-zap',
    color: 'red'
  },
  431: { 
    title: 'Request Header Fields Too Large', 
    message: 'Header permintaan terlalu besar.',
    icon: 'i-lucide-file-text',
    color: 'red'
  },
  451: { 
    title: 'Unavailable For Legal Reasons', 
    message: 'Tidak tersedia karena alasan hukum.',
    icon: 'i-lucide-scale',
    color: 'red'
  },

  // 5xx Server Errors
  500: { 
    title: 'Internal Server Error', 
    message: 'Kesalahan internal server. Terjadi kesalahan yang tidak terduga.',
    icon: 'i-lucide-server-crash',
    color: 'red'
  },
  501: { 
    title: 'Not Implemented', 
    message: 'Server tidak mendukung fungsionalitas yang diperlukan untuk memenuhi permintaan.',
    icon: 'i-lucide-wrench',
    color: 'orange'
  },
  502: { 
    title: 'Bad Gateway', 
    message: 'Gateway buruk. Server menerima respons tidak valid dari server upstream.',
    icon: 'i-lucide-network',
    color: 'red'
  },
  503: { 
    title: 'Service Unavailable', 
    message: 'Layanan tidak tersedia. Server sedang sibuk atau dalam pemeliharaan.',
    icon: 'i-lucide-maintenance',
    color: 'orange'
  },
  504: { 
    title: 'Gateway Timeout', 
    message: 'Gateway timeout. Server tidak menerima respons tepat waktu dari server upstream.',
    icon: 'i-lucide-timer',
    color: 'red'
  },
  505: { 
    title: 'HTTP Version Not Supported', 
    message: 'Versi HTTP tidak didukung.',
    icon: 'i-lucide-code',
    color: 'red'
  },
  506: { 
    title: 'Variant Also Negotiates', 
    message: 'Varian juga bernegosiasi.',
    icon: 'i-lucide-git-branch',
    color: 'orange'
  },
  507: { 
    title: 'Insufficient Storage', 
    message: 'Penyimpanan tidak mencukupi.',
    icon: 'i-lucide-hard-drive',
    color: 'red'
  },
  508: { 
    title: 'Loop Detected', 
    message: 'Loop terdeteksi.',
    icon: 'i-lucide-repeat',
    color: 'red'
  },
  510: { 
    title: 'Not Extended', 
    message: 'Tidak diperpanjang.',
    icon: 'i-lucide-arrow-right',
    color: 'orange'
  },
  511: { 
    title: 'Network Authentication Required', 
    message: 'Autentikasi jaringan diperlukan.',
    icon: 'i-lucide-wifi',
    color: 'blue'
  }
}

const currentError = computed(() => {
  const code = statusCode.value
  return errorCodes[code] || {
    title: 'Unknown Error',
    message: 'Terjadi kesalahan yang tidak diketahui.',
    icon: 'i-lucide-help-circle',
    color: 'gray'
  }
})

const showAllErrors = ref(false)

const toggleShowAllErrors = () => {
  showAllErrors.value = !showAllErrors.value
}

const all4xxErrors = computed(() => {
  return Object.entries(errorCodes)
    .filter(([code]) => parseInt(code) >= 400 && parseInt(code) < 500)
    .map(([code, data]) => ({ code: parseInt(code), ...data }))
})

const all5xxErrors = computed(() => {
  return Object.entries(errorCodes)
    .filter(([code]) => parseInt(code) >= 500 && parseInt(code) < 600)
    .map(([code, data]) => ({ code: parseInt(code), ...data }))
})
</script>

<template>
  <NuxtLayout name="default">
    <!-- Background Animation -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
    </div>

    <!-- Main Error Section -->
    <section class="relative py-16 sm:py-24 min-h-screen flex items-center">
      <UContainer>
        <div class="max-w-6xl mx-auto">
          <!-- Current Error Display -->
          <div class="text-center mb-16">
            <!-- Error Code with Animation -->
            <div class="relative mb-8">
              <div class="text-9xl sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
                {{ statusCode }}
              </div>
              <div class="absolute inset-0 text-9xl sm:text-[12rem] font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
                {{ statusCode }}
              </div>
            </div>

            <!-- Error Icon -->
            <div class="flex justify-center mb-6">
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl animate-bounce">
                  <UIcon :name="currentError.icon" class="w-12 h-12 text-white" />
                </div>
                <div class="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 animate-ping"></div>
              </div>
            </div>

            <!-- Error Title -->
            <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {{ currentError.title }}
            </h1>

            <!-- Error Message -->
            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              {{ currentError.message }}
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <UButton 
                to="/" 
                size="lg"
                color="primary" 
                icon="i-lucide-home" 
                class="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ðŸ  Kembali ke Beranda
              </UButton>
              
              <UButton 
                @click="toggleShowAllErrors"
                size="lg"
                :color="showAllErrors ? 'red' : 'gray'"
                :icon="showAllErrors ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                variant="outline"
                class="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {{ showAllErrors ? 'Sembunyikan' : 'Lihat Semua' }} Kode Error
              </UButton>
            </div>
          </div>

          <!-- All Error Codes Section -->
          <div v-if="showAllErrors" class="space-y-12">
            <!-- 4xx Client Errors -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <UIcon name="i-lucide-user-x" class="w-6 h-6 text-white" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Kode Error Klien (4xx)</h2>
                <UBadge color="orange" variant="soft" size="lg">{{ all4xxErrors.length }} Error</UBadge>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="error in all4xxErrors" 
                  :key="error.code"
                  class="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <UIcon :name="error.icon" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-bold text-orange-600 dark:text-orange-400">{{ error.code }}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ error.title }}</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{{ error.message }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5xx Server Errors -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <UIcon name="i-lucide-server-crash" class="w-6 h-6 text-white" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Kode Error Server (5xx)</h2>
                <UBadge color="red" variant="soft" size="lg">{{ all5xxErrors.length }} Error</UBadge>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="error in all5xxErrors" 
                  :key="error.code"
                  class="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 transition-all duration-300 hover:shadow-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <UIcon :name="error.icon" class="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-bold text-red-600 dark:text-red-400">{{ error.code }}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ error.title }}</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{{ error.message }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="mt-16 text-center">
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Butuh Bantuan?</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Tim support kami siap membantu Anda 24/7 melalui WhatsApp dan Live Chat
              </p>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <UButton 
                  to="/testimonials" 
                  color="green" 
                  variant="outline"
                  icon="i-lucide-message-circle"
                  class="px-6 py-3 rounded-full"
                >
                  Lihat Testimoni
                </UButton>
                <UButton 
                  to="/informasi/transaksi" 
                  color="blue" 
                  variant="outline"
                  icon="i-lucide-info"
                  class="px-6 py-3 rounded-full"
                >
                  Informasi Transaksi
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Floating Actions (WA & Live Chat) -->
    <ClientOnly>
      <ChatWhatsapp />
    </ClientOnly>
  </NuxtLayout>
</template>

