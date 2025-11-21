// server/plugins/unhandled-rejection-guard.server.ts
// Purpose: Prevent crashes and noisy logs from unhandled promise rejections like ECONNREFUSED 127.0.0.1:xxxxx
// This plugin installs process-level guards with rate-limited logging and safe ignore rules for benign local dev connection errors.

export default defineNitroPlugin(() => {
  const flag = '__unhandled_rejection_guard_installed__'
  // Avoid installing multiple times in HMR or worker reloads
  if ((globalThis as any)[flag]) return
  ;(globalThis as any)[flag] = true

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

  process.on('unhandledRejection', (reason: any, _promise) => {
    try {
      if (isLocalConnRefused(reason)) {
        limitedWarn('unhandledRejection-ECONNREFUSED-local', '[guard] Suppressed unhandledRejection from local connection refusal (likely dev socket/HMR/devtools). Details:', reason)
        return
      }
      // Log other rejections with rate-limiting but avoid crashing the process
      limitedWarn('unhandledRejection', '[guard] Unhandled promise rejection caught (prevented crash):', reason)
    } catch (e) {
      // Last resort logging
      console.warn('[guard] Error while handling unhandledRejection:', e)
    }
  })

  process.on('uncaughtException', (err: any) => {
    try {
      if (isLocalConnRefused(err)) {
        limitedWarn('uncaughtException-ECONNREFUSED-local', '[guard] Suppressed uncaughtException from local connection refusal (likely dev socket/HMR/devtools). Details:', err)
        return
      }
      limitedWarn('uncaughtException', '[guard] Uncaught exception caught (prevented crash):', err)
    } catch (e) {
      console.warn('[guard] Error while handling uncaughtException:', e)
    }
  })
})
