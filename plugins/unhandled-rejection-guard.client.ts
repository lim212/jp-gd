// plugins/unhandled-rejection-guard.client.ts
// Purpose: Suppress benign client-side unhandled promise rejections/errors like
// "connect ECONNREFUSED 127.0.0.1:xxxxx" often originating from HMR/dev sockets.
// This prevents noisy console errors without hiding real issues.

export default defineNuxtPlugin(() => {
  const flag = '__client_unhandled_rejection_guard_installed__'
  if ((window as any)[flag]) return
  ;(window as any)[flag] = true

  const logCache = new Map<string, { count: number; last: number }>()
  const MAX_LOGS = 1
  const RESET_MS = 5 * 60 * 1000

  function limitedWarn(key: string, msg: string, err?: unknown) {
    const now = Date.now()
    const rec = logCache.get(key)
    if (!rec || (now - rec.last) > RESET_MS) {
      logCache.set(key, { count: 1, last: now })
      console.warn(msg, err)
      return
    }
    const next = { count: rec.count + 1, last: now }
    logCache.set(key, next)
    if (next.count <= MAX_LOGS) console.warn(msg, err)
    else if (next.count === MAX_LOGS + 1) console.warn(`${key}: further similar warnings suppressed for 5 minutes`)
  }

  function isLocalConnRefused(e: unknown): boolean {
    const msg = typeof e === 'string' ? e : (e as any)?.message || (e as any)?.toString?.() || ''
    return /ECONNREFUSED/i.test(msg) && /127\.0\.0\.1|localhost/i.test(msg)
  }

  // Handle unhandled promise rejections on the client
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    try {
      const reason: any = event?.reason
      if (isLocalConnRefused(reason)) {
        // prevent the default error logging to the console
        event.preventDefault()
        limitedWarn(
          'client-unhandledRejection-ECONNREFUSED-local',
          '[guard] Suppressed client unhandledRejection from local connection refusal (likely HMR/dev socket). Details:',
          reason
        )
      }
    } catch (e) {
      // Fail-safe
      console.warn('[guard] Error while handling client unhandledrejection:', e)
    }
  })

  // Handle uncaught errors on the client (some WS libs throw directly)
  window.addEventListener('error', (event: ErrorEvent) => {
    try {
      const err: any = event?.error || event?.message
      if (isLocalConnRefused(err)) {
        // prevent the default error logging to the console
        event.preventDefault()
        limitedWarn(
          'client-uncaughtException-ECONNREFUSED-local',
          '[guard] Suppressed client error from local connection refusal (likely HMR/dev socket). Details:',
          err
        )
      }
    } catch (e) {
      console.warn('[guard] Error while handling client error event:', e)
    }
  })
})
