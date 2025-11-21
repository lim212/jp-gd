<template>
  <div class="kbli-page container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">KBLI 2020 (A©“U)</h1>
    <p class="text-gray-600 mb-6">Klasifikasi Baku Lapangan Usaha Indonesia berbasis risiko. Gunakan pencarian atau filter huruf untuk menemukan kode KBLI.</p>

    <div class="flex flex-col gap-3 mb-6">
      <div class="flex flex-col md:flex-row md:items-center gap-3">
        <input
          v-model.trim="searchInput"
          @input="onSearchInput"
          @keyup.enter="search"
          type="text"
          :placeholder="'Pencarian Berdasarkan ' + filterLabel"
          class="border rounded px-3 py-2 w-full md:w-2/3"
        />
        <select v-model="filterMode" class="border rounded px-3 py-2 w-full md:w-1/3" @change="search">
          <option value="semua">Semua</option>
          <option value="kode">Kode</option>
          <option value="judul">Judul</option>
          <option value="uraian">Uraian</option>
        </select>
        <button class="px-4 py-2 rounded border" @click="search">Cari</button>
        <button class="px-4 py-2 rounded border" @click="refreshData">Refresh</button>
      </div>
      <div class="flex flex-wrap gap-2 items-center">
        <button
          v-for="ltr in letters"
          :key="ltr"
          :class="['px-3 py-1 rounded border', currentLetter === ltr ? 'bg-black text-white' : 'bg-white dark:bg-gray-800']"
          @click="setLetter(ltr)"
        >
          {{ ltr }}
        </button>
        <button :class="['px-3 py-1 rounded border', !currentLetter ? 'bg-black text-white' : 'bg-white dark:bg-gray-800']" @click="setLetter('')">Semua</button>
      </div>
    </div>

    <div v-if="pending" class="mb-4">Memuat data KBLI...</div>
    <div v-if="errorMsg" class="text-red-600 mb-4">{{ errorMsg }}</div>

    <div v-if="!pending && !errorMsg && sourceItems.length === 0" class="text-gray-700">
      <p>Belum ada data KBLI.</p>
    </div>

    <div v-else-if="items.length === 0 && !pending" class="text-gray-700">
      <p>Data tidak ditemukan</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full border rounded">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="text-left p-3 border">Kode KBLI</th>
            <th class="text-left p-3 border">Judul KBLI</th>
            <th class="text-left p-3 border">Risiko</th>
            <th class="text-left p-3 border">Perizinan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in items" :key="it.code" class="align-top">
            <td class="p-3 border font-semibold whitespace-nowrap">
              <NuxtLink :to="linkTo(it.code)" class="text-blue-600 hover:underline">{{ it.code }}</NuxtLink>
            </td>
            <td class="p-3 border">
              <NuxtLink :to="linkTo(it.code)" class="text-blue-600 hover:underline">{{ it.title }}</NuxtLink>
            </td>
            <td class="p-3 border whitespace-nowrap">{{ it.risk || '-' }}</td>
            <td class="p-3 border">
              <div v-if="it.licensing">
                <details>
                  <summary class="cursor-pointer select-none">Lihat Detail</summary>
                  <pre class="mt-2 overflow-auto bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">{{ formatLicensing(it.licensing) }}</pre>
                </details>
              </div>
              <div v-else>-</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6 text-sm text-gray-500" v-if="meta">
      <div>Sumber: <span class="font-mono">{{ meta.source || 'N/A' }}</span></div>
      <div>Dimuat: {{ formatDate(meta.fetchedAt) }}</div>
      <div>Total: {{ total }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const letters = Array.from('ABCDEFGHIJKLMNOPQRSTU')

// Required states
const searchQuery = ref('')
const searchInput = ref('')
const currentLetter = ref('')
const filterMode = ref<'semua' | 'kode' | 'judul' | 'uraian'>('semua')
const forceRefresh = ref(false)
let debounceTimer: any = null

const filterLabel = computed(() => {
  switch (filterMode.value) {
    case 'kode': return 'Kode KBLI'
    case 'judul': return 'Judul KBLI'
    case 'uraian': return 'Uraian KBLI'
    default: return 'Semua KBLI'
  }
})

// Fetch KBLI from backend with q, filter, letter
const { data, pending, error, refresh } = await useAsyncData(
  () => `kbli-list-${(currentLetter.value||'')}-${filterMode.value}-${(searchQuery.value||'')}-${forceRefresh.value?'1':'0'}`,
  () => {
    const params: any = {
      letter: currentLetter.value || undefined,
      q: searchQuery.value || undefined,
      filter: filterMode.value === 'semua' ? 'all' : filterMode.value,
    }
    if (forceRefresh.value) params.refresh = 'true'
    return $fetch('/api/kbli', { params })
  },
  { watch: [searchQuery, filterMode, currentLetter, forceRefresh] }
)

const meta = computed(() => data.value?.meta as any)
const errorMsg = computed(() => error.value ? (error.value as any)?.message || 'Gagal memuat data' : '')

// Use server-filtered items
const items = computed(() => (data.value?.items as any[]) || [])
const total = computed(() => (data.value as any)?.total ?? (items.value as any[]).length)

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  // Debounce 300ms then apply to searchQuery
  debounceTimer = setTimeout(() => {
    searchQuery.value = searchInput.value
  }, 300)
}
function setLetter(ltr: string) {
  currentLetter.value = ltr
  search()
}
function search() {
  // Immediate apply for Enter/Cari/dropdown change
  searchQuery.value = searchInput.value
}
async function refreshData() {
  try {
    forceRefresh.value = true
    await refresh()
  } finally {
    forceRefresh.value = false
  }
}

function linkTo(code: string) {
  return `/kbli/${encodeURIComponent(String(code))}`
}

function formatDate(d?: string) {
  if (!d) return '-'
  try { return new Date(d).toLocaleString() } catch { return d }
}
function formatLicensing(v: any) {
  try { return typeof v === 'string' ? v : JSON.stringify(v, null, 2) } catch { return String(v) }
}
</script>

<style scoped>
.container { max-width: 1200px; }
button { transition: background-color .15s ease; }
.desc { white-space: pre-line; word-break: break-word; }
</style>

