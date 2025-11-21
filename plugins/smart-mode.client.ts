// plugins/smart-mode.client.ts
// Consolidate network and device performance signals into a single "smart mode"
// to render lightweight UI first on slow connections or low-end devices.
// - Exposes useState('smartMode'): boolean
// - Adds <html class="smart-mode"> when enabled
// - Provides window.jpDefer(fn, timeout?) to schedule heavy work when idle

import { watch } from '#imports'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Read existing states (created by other plugins) with safe defaults
  const net = useState('net-mode', () => ({ slow: false, reason: '' as 'save-data' | 'low-downlink' | '2g/3g' | '' }))
  const perf = useState('perf-profile', () => ({ lowMemory: false, lowCpu: false }))
  const smartMode = useState<boolean>('smartMode', () => false)

  // Query param overrides for testing: ?smartMode=force | on | enable | true  and  ?smartMode=off | disable | false
  const params = new URLSearchParams(location.search)
  const override = (params.get('smartMode') || '').toLowerCase()
  const forceOn = ['force', 'on', 'enable', 'enabled', 'true', '1'].includes(override)
  const forceOff = ['off', 'disable', 'disabled', 'false', '0'].includes(override)

  const getCookie = (name: string) => {
    try {
      const parts = (document.cookie || '').split('; ').map(s => s.trim())
      for (const p of parts) {
        if (!p) continue
        const eq = p.indexOf('=')
        const k = eq >= 0 ? p.slice(0, eq) : p
        const v = eq >= 0 ? p.slice(eq + 1) : ''
        if (k === name) return decodeURIComponent(v)
      }
    } catch {}
    return undefined
  }
  const setCookie = (name: string, value: string, days = 30) => {
    try {
      const exp = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax; expires=${exp}`
    } catch { /* no-op */ }
  }
  const delCookie = (name: string) => {
    try { document.cookie = `${name}=; path=/; samesite=lax; expires=Thu, 01 Jan 1970 00:00:00 GMT` } catch { /* no-op */ }
  }

  const compute = () => {
    if (forceOn) return true
    if (forceOff) return false
    // Cookie hint from server/previous sessions
    const ck = getCookie('smartMode') === '1'
    if (ck) return true
    // Heuristics: enable when network is slow OR device is low on memory/CPU or on small/mobile screens
    let small = false
    let mobileUA = false
    try { small = window.matchMedia && window.matchMedia('(max-width: 768px)').matches } catch {}
    try { mobileUA = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent) } catch {}
    return !!(net.value?.slow || perf.value?.lowMemory || perf.value?.lowCpu || small || mobileUA)
  }

  const applyDom = (enabled: boolean) => {
    try {
      const doc = document.documentElement
      doc.classList.toggle('smart-mode', enabled)
      doc.setAttribute('data-smart-mode', enabled ? '1' : '0')
      ;(window as any).__SMART_MODE__ = enabled
      // Persist preference for next navigations and SSR hinting
      if (enabled) setCookie('smartMode', '1')
      else delCookie('smartMode')
    } catch { /* no-op */ }
  }

  // Provide lightweight defer utility
  const rIC = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: { timeout?: number }) => number)
  ;(window as any).jpDefer = (fn: () => void, timeout = 1500) => {
    try {
      if (rIC) return rIC(() => fn())
      return window.setTimeout(() => fn(), timeout)
    } catch {
      return window.setTimeout(() => fn(), timeout)
    }
  }

  // Initial compute and apply
  smartMode.value = compute()
  applyDom(smartMode.value)

  // React to changes from network/perf plugins
  // Note: useState is reactive; re-evaluate when those hints change
  watch([net, perf], () => {
    const next = compute()
    if (next !== smartMode.value) {
      smartMode.value = next
      applyDom(next)
    }
  })
})
