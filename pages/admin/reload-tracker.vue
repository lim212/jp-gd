<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">🔄 Smart Reload Tracker</h1>
        <p class="mt-2 text-gray-600">Kelola sistem anti-infinite reload dan monitoring IP yang diblokir</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">IP</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total IPs</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalIPs || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">🚫</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">IPs Diblokir</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.blockedIPs || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">✅</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">IPs Aktif</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeIPs || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">📊</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Percobaan</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalAttempts || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Aksi Admin</h2>
        </div>
        <div class="p-6">
          <div class="flex flex-wrap gap-4">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              🔄 Refresh Data
            </button>

            <button
              @click="resetAllData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              🗑️ Reset Semua Data
            </button>

            <button
              @click="showStats = !showStats"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              📊 {{ showStats ? 'Sembunyikan' : 'Tampilkan' }} Statistik Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Detailed Stats -->
      <div v-if="showStats" class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Statistik Detail</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Rata-rata Percobaan per IP</h3>
              <p class="text-2xl font-bold text-gray-900">{{ stats.averageAttempts || 0 }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">IP dengan Percobaan Terbanyak</h3>
              <div v-if="stats.topOffenders && stats.topOffenders.length > 0" class="space-y-2">
                <div v-for="offender in stats.topOffenders.slice(0, 3)" :key="offender.ip" 
                     class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="font-mono text-sm">{{ offender.ip }}</span>
                  <span class="text-sm font-bold" :class="offender.blocked ? 'text-red-600' : 'text-gray-600'">
                    {{ offender.count }}x {{ offender.blocked ? '(Diblokir)' : '' }}
                  </span>
                </div>
              </div>
              <p v-else class="text-gray-500">Tidak ada data</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Blocked IPs -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">IP yang Diblokir</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percobaan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan Blokir</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Blokir</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Waktu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="blocked in blockedIPs" :key="blocked.ip">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span class="text-red-600 text-xs font-bold">🚫</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 font-mono">{{ blocked.ip }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {{ blocked.count }}x
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ blocked.blockReason || 'Terlalu banyak percobaan reload' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(blocked.blockTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="blocked.remainingTime > 0" class="text-sm text-red-600 font-medium">
                    {{ blocked.remainingTime }} menit
                  </span>
                  <span v-else class="text-sm text-green-600 font-medium">
                    Expired
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="unblockIP(blocked.ip)"
                    :disabled="loading"
                    class="text-green-600 hover:text-green-900 disabled:opacity-50"
                  >
                    ✅ Unblock
                  </button>
                </td>
              </tr>
              <tr v-if="blockedIPs.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  Tidak ada IP yang diblokir
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All IPs -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Semua IP yang Terdeteksi</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percobaan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percobaan Pertama</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percobaan Terakhir</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ip in allIPs" :key="ip.ip">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full flex items-center justify-center"
                           :class="ip.blocked ? 'bg-red-100' : 'bg-green-100'">
                        <span :class="ip.blocked ? 'text-red-600' : 'text-green-600'" class="text-xs font-bold">
                          {{ ip.blocked ? '🚫' : '✅' }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 font-mono">{{ ip.ip }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="ip.count >= 3 ? 'bg-red-100 text-red-800' : ip.count >= 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                    {{ ip.count }}x
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="ip.blocked" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Diblokir
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktif
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(ip.firstAttempt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(ip.lastAttempt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="resetIP(ip.ip)"
                    :disabled="loading"
                    class="text-blue-600 hover:text-blue-900 disabled:opacity-50 mr-4"
                  >
                    🔄 Reset
                  </button>
                  <button
                    v-if="ip.blocked"
                    @click="unblockIP(ip.ip)"
                    :disabled="loading"
                    class="text-green-600 hover:text-green-900 disabled:opacity-50"
                  >
                    ✅ Unblock
                  </button>
                </td>
              </tr>
              <tr v-if="allIPs.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  Tidak ada data IP
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Meta
definePageMeta({
  layout: false,
  middleware: 'auth' // You should implement this middleware
})

// Reactive data
const loading = ref(false)
const showStats = ref(false)
const stats = ref({})
const blockedIPs = ref([])
const allIPs = ref([])

// Admin key (you should get this from environment or user session)
const adminKey = ref('your-admin-key-here') // Replace with actual admin key

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    // Fetch stats
    const statsResponse = await $fetch('/api/admin/reload-tracker', {
      query: { action: 'stats', key: adminKey.value }
    })
    if (statsResponse.success) {
      stats.value = statsResponse.stats
    }

    // Fetch blocked IPs
    const blockedResponse = await $fetch('/api/admin/reload-tracker', {
      query: { action: 'blocked', key: adminKey.value }
    })
    if (blockedResponse.success) {
      blockedIPs.value = blockedResponse.blockedIPs
    }

    // Fetch all IPs
    const allResponse = await $fetch('/api/admin/reload-tracker', {
      query: { action: 'view', key: adminKey.value }
    })
    if (allResponse.success) {
      allIPs.value = allResponse.data
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    alert('Gagal memuat data: ' + error.message)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

const resetAllData = async () => {
  if (!confirm('Apakah Anda yakin ingin mereset semua data tracking?')) {
    return
  }

  loading.value = true
  try {
    const response = await $fetch('/api/admin/reload-tracker', {
      query: { action: 'reset', key: adminKey.value }
    })
    if (response.success) {
      alert('Data berhasil direset')
      fetchData()
    } else {
      alert('Gagal mereset data: ' + response.error)
    }
  } catch (error) {
    console.error('Failed to reset data:', error)
    alert('Gagal mereset data: ' + error.message)
  } finally {
    loading.value = false
  }
}

const resetIP = async (ip) => {
  if (!confirm(`Apakah Anda yakin ingin mereset data untuk IP ${ip}?`)) {
    return
  }

  loading.value = true
  try {
    const response = await $fetch('/api/admin/reload-tracker', {
      query: { action: 'reset', ip, key: adminKey.value }
    })
    if (response.success) {
      alert(`Data untuk IP ${ip} berhasil direset`)
      fetchData()
    } else {
      alert('Gagal mereset data: ' + response.error)
    }
  } catch (error) {
    console.error('Failed to reset IP:', error)
    alert('Gagal mereset data: ' + error.message)
  } finally {
    loading.value = false
  }
}

const unblockIP = async (ip) => {
  if (!confirm(`Apakah Anda yakin ingin membuka blokir IP ${ip}?`)) {
    return
  }

  loading.value = true
  try {
    const response = await $fetch('/api/admin/reload-tracker', {
      query: { action: 'unblock', ip, key: adminKey.value }
    })
    if (response.success) {
      alert(`IP ${ip} berhasil dibuka blokir`)
      fetchData()
    } else {
      alert('Gagal membuka blokir: ' + response.error)
    }
  } catch (error) {
    console.error('Failed to unblock IP:', error)
    alert('Gagal membuka blokir: ' + error.message)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID')
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
