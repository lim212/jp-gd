<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/kbli" class="text-blue-600 hover:underline">← Kembali ke daftar KBLI</NuxtLink>
    <div class="mt-4">
      <div v-if="pending" class="mb-4">Memuat detail KBLI...</div>
      <div v-if="errorMsg" class="text-red-600 mb-4">{{ errorMsg }}</div>

      <div v-if="item" class="space-y-4">
        <h1 class="text-2xl font-bold">{{ item.title }}</h1>
        <div>
          <div class="text-sm text-gray-500">Kode:</div>
          <div class="font-medium">{{ item.code }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Tingkat Risiko:</div>
          <div class="font-medium">{{ item.risk || '-' }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Uraian:</div>
          <div v-if="item.description" v-html="item.description"></div>
          <div v-else>-</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Perizinan/Persyaratan:</div>
          <div v-if="item.licensing">
            <pre class="mt-2 overflow-auto bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">{{ formatLicensing(item.licensing) }}</pre>
          </div>
          <div v-else>-</div>
        </div>
        <div class="text-sm text-gray-500" v-if="meta">
          <div>Sumber: <span class="font-mono">{{ meta.source || 'N/A' }}</span></div>
          <div>Dimuat: {{ formatDate(meta.fetchedAt) }}</div>
        </div>
      </div>

      <div v-else-if="!pending && !errorMsg" class="text-gray-700">
        Data tidak ditemukan
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const kode = computed(() => String(route.params.kode || ''))

const { data, pending, error } = await useAsyncData(
  () => `kbli-detail-${kode.value}`,
  () => $fetch(`/api/kbli/${encodeURIComponent(kode.value)}`),
)

const item = computed(() => (data.value as any)?.item)
const meta = computed(() => (data.value as any)?.meta)
const errorMsg = computed(() => error.value ? ((error.value as any)?.message || 'Gagal memuat detail KBLI') : '')

function formatDate(d?: string) {
  if (!d) return '-'
  try { return new Date(d).toLocaleString() } catch { return d }
}
function formatLicensing(v: any) {
  try { return typeof v === 'string' ? v : JSON.stringify(v, null, 2) } catch { return String(v) }
}
</script>

<style scoped>
.container { max-width: 900px; }
</style>
