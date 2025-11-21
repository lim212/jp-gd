// plugins/perf-profile.client.ts
// Detect device memory/CPU and expose lightweight flags to tune UI for low-spec devices.
// - Provides useState('perf-profile') => { lowMemory: boolean, lowCpu: boolean }
// - Adds classes to <html>: low-mem, low-cpu
// - Sets globals: window.__LOW_MEMORY__, window.__LOW_CPU__

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  type PerfProfile = { lowMemory: boolean; lowCpu: boolean }
  const state = useState<PerfProfile>('perf-profile', () => ({ lowMemory: false, lowCpu: false }))

  const dm = (navigator as any).deviceMemory as number | undefined
  const hc = navigator.hardwareConcurrency

  // Heuristics:
  // - deviceMemory <= 2GB considered low-memory
  // - hardwareConcurrency <= 4 threads considered low-CPU (often entry-level/mobile)
  const lowMemory = typeof dm === 'number' ? dm <= 2 : false
  const lowCpu = typeof hc === 'number' ? hc <= 4 : false

  state.value = { lowMemory, lowCpu }

  try {
    ;(window as any).__LOW_MEMORY__ = state.value.lowMemory
    ;(window as any).__LOW_CPU__ = state.value.lowCpu

    const doc = document.documentElement
    doc.classList.toggle('low-mem', state.value.lowMemory)
    doc.classList.toggle('low-cpu', state.value.lowCpu)
    if (typeof dm === 'number') doc.setAttribute('data-device-memory', String(dm))
    if (typeof hc === 'number') doc.setAttribute('data-hw-threads', String(hc))
  } catch { /* no-op */ }
})
