import { onMounted, onBeforeUnmount, watch } from 'vue'
import { defineNuxtPlugin } from '#app'
import { useDataSaver } from '../composables/useDataSaver'

function getConnection(): any | null {
  if (typeof navigator === 'undefined') return null
  const nav: any = navigator as any
  return nav.connection || nav.mozConnection || nav.webkitConnection || null
}

export default defineNuxtPlugin(() => {
  const { loadPref, setAuto, state } = useDataSaver()

  let intervalId: number | undefined
  let reloadIntervalId: number | undefined
  let currentConn: any | null = null

  function evaluate() {
    try {
      const conn = getConnection()
      currentConn = conn
      if (!conn) {
        setAuto('off', 'unknown')
        return
      }
      // Prefer browser's Save-Data if available
      const saveData = typeof conn.saveData === 'boolean' ? conn.saveData : false
      const effectiveType = String(conn.effectiveType || '').toLowerCase()
      const downlink = typeof conn.downlink === 'number' ? conn.downlink : undefined

      if (saveData) {
        setAuto('text', 'saveData')
        return
      }

      // Map connection type to levels
      // Very slow: slow-2g / 2g => text-only
      if (effectiveType.includes('2g')) {
        setAuto('text', '2g')
        return
      }
      // 3g is typically constrained => lite images
      if (effectiveType === '3g') {
        setAuto('lite', 'lowDownlink')
        return
      }

      // Downlink-based thresholds (Mbps)
      if (typeof downlink === 'number' && downlink > 0) {
        if (downlink < 0.8) {
          setAuto('text', 'lowDownlink')
          return
        }
        if (downlink < 1.6) {
          setAuto('lite', 'lowDownlink')
          return
        }
      }

      // default normal
      setAuto('off', 'unknown')
    } catch {
      setAuto('off', 'unknown')
    }
  }

  // Reflect state to <html> for CSS-based reductions
  function applyHtmlFlags() {
    try {
      const d = document.documentElement
      const lvl = state.value.level
      if (lvl === 'off') {
        d.classList.remove('data-saver', 'data-saver-text', 'data-saver-lite')
        d.removeAttribute('data-data-saver')
        d.removeAttribute('data-data-saver-level')
        return
      }
      d.classList.add('data-saver')
      d.setAttribute('data-data-saver', '1')
      d.setAttribute('data-data-saver-level', lvl)
      d.classList.toggle('data-saver-text', lvl === 'text')
      d.classList.toggle('data-saver-lite', lvl === 'lite')
    } catch {}
  }

  // Media reload helpers for when data-saver returns to 'off'
  function hasUnloadedMedia(): boolean {
    try {
      const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      const vids = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[]
      const pendingImg = imgs.some(img => {
        if (!img.complete || img.naturalWidth === 0) return true
        return false
      })
      const pendingVid = vids.some(v => v.readyState < 2)
      return pendingImg || pendingVid
    } catch { return false }
  }

  function reloadDeferredMedia(): number {
    let attempts = 0
    try {
      const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      imgs.forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          const srcAttr = img.getAttribute('src')
          const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src')
          if (srcAttr) {
            img.setAttribute('loading', 'eager')
            try { (img as any).decoding = 'sync' } catch {}
            img.src = srcAttr
            attempts++
          } else if (dataSrc) {
            img.setAttribute('src', dataSrc)
            img.removeAttribute('data-src')
            img.removeAttribute('data-lazy-src')
            attempts++
          } else if ((img as any).currentSrc) {
            const cur = (img as any).currentSrc as string
            if (cur) { img.src = cur; attempts++ }
          }
        }
      })
      const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[]
      videos.forEach(v => {
        if (v.readyState < 2) {
          try { v.load() } catch {}
          attempts++
        }
      })
    } catch {}
    return attempts
  }

  function dispatchLevelEvent(prevLevel: string | undefined, level: string) {
    try {
      window.dispatchEvent(new CustomEvent('data-saver:level', {
        detail: { level, prev: prevLevel, mode: state.value.mode, reason: state.value.reason }
      }))
    } catch {}
  }

  function startReloadLoopIfNeeded() {
    if (reloadIntervalId) return
    if (state.value.level !== 'off') return
    if (!hasUnloadedMedia()) return
    reloadDeferredMedia()
    reloadIntervalId = window.setInterval(() => {
      if (state.value.level !== 'off') { stopReloadLoop(); return }
      if (!hasUnloadedMedia()) { stopReloadLoop(); return }
      reloadDeferredMedia()
    }, 30000)
  }

  function stopReloadLoop() {
    if (reloadIntervalId) {
      clearInterval(reloadIntervalId)
      reloadIntervalId = undefined
    }
  }

  onMounted(() => {
    try { loadPref() } catch {}
    evaluate()

    // Watch for state changes to update HTML flags and handle media reload
    try {
      applyHtmlFlags()
      // Initial level event dispatch
      dispatchLevelEvent(undefined, state.value.level)
      // Start reload loop if we are already in 'off' but some media pending
      startReloadLoopIfNeeded()
      watch(() => state.value.level, (newLevel, oldLevel) => {
        applyHtmlFlags()
        dispatchLevelEvent(oldLevel as any, newLevel as any)
        if ((oldLevel === 'lite' || oldLevel === 'text') && newLevel === 'off') {
          // Immediate attempt and then start loop
          reloadDeferredMedia()
          startReloadLoopIfNeeded()
        }
        if (newLevel !== 'off') {
          // Leaving fast mode -> stop the reload loop
          stopReloadLoop()
        }
      })
    } catch {}

    const conn = getConnection()
    currentConn = conn
    if (conn && typeof conn.addEventListener === 'function') {
      conn.addEventListener('change', evaluate, { passive: true })
    }

    // Smart mode periodic check every 30s
    intervalId = window.setInterval(() => {
      evaluate()
    }, 30000)
  })

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
    stopReloadLoop()
    try {
      if (currentConn && typeof currentConn.removeEventListener === 'function') {
        currentConn.removeEventListener('change', evaluate)
      }
    } catch {}
  })
})
