<template>
  <div class="inline-flex items-center gap-2 select-none">
    <label class="text-sm text-gray-900 dark:text-white font-black tracking-wide" :title="hint" aria-label="Mode Hemat Data" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">MODE HEMAT DATA</label>
    <select
      class="text-sm px-3 py-2 rounded-lg border-2 border-gray-500 dark:border-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-blue-500 font-black tracking-wide"
      :value="modelValue"
      @change="onChange"
      aria-label="Pilih level hemat data"
      style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);"
    >
      <option value="off" class="text-gray-900 dark:text-white font-black">OFF</option>
      <option value="lite" class="text-gray-900 dark:text-white font-black">LITE GAMBAR</option>
      <option value="text" class="text-gray-900 dark:text-white font-black">HANYA TEKS</option>
    </select>
    <span v-if="auto" class="text-xs text-gray-700 dark:text-gray-200 italic font-black tracking-wide" aria-live="polite" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">(AUTO{{ reasonLabel ? ': ' + reasonLabel.toUpperCase() : '' }})</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataSaver } from '../../composables/useDataSaver'

const { state, setManual } = useDataSaver()

const modelValue = computed(() => state.value.level)
const auto = computed(() => state.value.mode === 'auto' && state.value.autoTriggered)
const hint = computed(() => state.value.mode === 'manual' ? 'Diatur manual oleh pengguna' : 'Diaktifkan otomatis saat koneksi lambat')
const reasonLabel = computed(() => {
  switch (state.value.reason) {
    case '2g': return '2G'
    case 'lowDownlink': return '<1Mbps'
    case 'saveData': return 'Save-Data'
    default: return ''
  }
})

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value as 'off'|'lite'|'text'
  // Persist manual preference, including 'off' so it doesn't bounce back to auto
  setManual(val)
}
</script>

