// plugins/network-mode.client.ts
// Detect client network quality and expose a global state to enable light/full modes.
// - Uses Network Information API and Save-Data when available
// - Exposes useState('net-mode') => { slow: boolean, reason: 'save-data' | '2g/3g' | 'low-downlink' | '' }
// - Toggles document classes (net-slow/net-fast) and window flag (__NET_SLOW__) for other plugins/components

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  type Reason = 'save-data' | 'low-downlink' | '2g/3g' | ''
  const state = useState('net-mode', () => ({ slow: false, reason: '' as Reason }))

  // Helper to apply document/window hints
  const applyModeHints = (slow: boolean) => {
    try {
      ;(window as any).__NET_SLOW__ = slow
      const doc = document.documentElement
      doc.classList.toggle('net-slow', slow)
      doc.classList.toggle('net-fast', !slow)
      doc.setAttribute('data-net-mode', slow ? 'slow' : 'fast')

      // Resource hint hygiene for slow mode: remove prefetch/preload hints (non-critical)
      if (slow) {
        document.querySelectorAll('link[rel="prefetch"], link[rel="preload"]').forEach((el) => el.parentElement?.removeChild(el))
      }
    } catch { /* no-op */ }
  }

  const conn: any = (navigator as any).connection
  const saveData = !!conn?.saveData
  const effectiveType: string | undefined = conn?.effectiveType // 'slow-2g' | '2g' | '3g' | '4g'
  const downlink: number | undefined = typeof conn?.downlink === 'number' ? conn.downlink : undefined // Mbps

  if (saveData) {
    state.value = { slow: true, reason: 'save-data' }
  } else if (effectiveType && ['slow-2g', '2g', '3g'].includes(effectiveType)) {
    state.value = { slow: true, reason: '2g/3g' }
  } else if (typeof downlink === 'number' && downlink < 1.5) {
    state.value = { slow: true, reason: 'low-downlink' }
  }

  applyModeHints(state.value.slow)

  // Listen to connection changes
  conn?.addEventListener?.('change', () => {
    const e = conn.effectiveType as string | undefined
    const d = conn.downlink as number | undefined
    const sd = conn.saveData === true
    const slow = !!(sd || (e && ['slow-2g', '2g', '3g'].includes(e)) || (typeof d === 'number' && d < 1.5))
    state.value = {
      slow,
      reason: sd ? 'save-data' : slow ? (e && ['slow-2g', '2g', '3g'].includes(e) ? '2g/3g' : 'low-downlink') : ''
    }
    applyModeHints(state.value.slow)
  })
})
