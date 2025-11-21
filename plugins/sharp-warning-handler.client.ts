// plugins/sharp-warning-handler.client.ts
// Handle and suppress noisy warnings in the browser console when in online (production) mode
// - Filters specific known noisy warnings
// - Demotes other console.warn messages to console.info in production to avoid yellow warning noise

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (import.meta.server) return

  // Avoid double-patching
  if ((console.warn as any).__patchedByApp) return

  const isDev = process.env.NODE_ENV === 'development'

  // Store the original console.warn function
  const originalWarn = console.warn

  // Override console.warn to filter out specific noisy warnings
  const patchedWarn = function(...args: any[]) {
    const first = args[0]

    // Check if this is a sharp warning about linux-x64 binaries
    const isSharpLinuxWarning = args.length > 0 &&
      typeof first === 'string' &&
      (first.includes('sharp binaries for linux-x64 cannot be found') ||
       (first.includes('@nuxt/image') && first.includes('sharp')))

    // Check if this is the Vue duplicate Icon registration warning
    const isDuplicateIconWarning = args.length > 0 &&
      typeof first === 'string' &&
      (first.includes('Component "Icon" has already been registered') ||
       first.includes("Component 'Icon' has already been registered"))

    if (isSharpLinuxWarning) {
      console.info('[sharp-warning-handler] Suppressed warning about sharp binaries for linux-x64')
      return
    }

    if (isDuplicateIconWarning) {
      console.info('[icon-warning-handler] Suppressed duplicate Icon registration warning')
      return
    }

    // In development, keep original warnings for debugging
    if (isDev) {
      return originalWarn.apply(console, args)
    }

    // In production/online mode, demote warnings to info to avoid yellow warning noise
    try {
      console.info('[warn→info]', ...args)
    } catch {
      // Fallback if spread fails for any reason
      return originalWarn.apply(console, args as any)
    }
  } as typeof console.warn & { __patchedByApp?: boolean }

  ;(patchedWarn as any).__patchedByApp = true
  console.warn = patchedWarn
})
