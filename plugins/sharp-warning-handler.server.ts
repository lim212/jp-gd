// plugins/sharp-warning-handler.server.ts
// Suppress noisy @nuxt/image sharp linux-x64 binary warnings on the server (VPS)
// We only filter the very specific, known-benign warning and leave all others intact.
// This plugin runs VERY EARLY to catch warnings before they are displayed

export default defineNuxtPlugin({
  name: 'sharp-warning-handler',
  enforce: 'pre', // Run before other plugins
  setup() {
    if (!import.meta.server) return

    const isSharpLinuxWarn = (args: any[]): boolean => {
      try {
        const first = args?.[0]
        const msg = typeof first === 'string' ? first : (first?.message || '')
        if (typeof msg !== 'string') return false
        return (
          msg.includes('sharp binaries') ||
          msg.includes('linux-x64 cannot be found') ||
          (msg.includes('@nuxt/image') && msg.includes('sharp')) ||
          (msg.includes('sharp') && msg.includes('cannot be found'))
        )
      } catch {
        return false
      }
    }

    // Patch console.warn
    const origWarn = console.warn as any
    if (!origWarn.__patchedByAppSharp) {
      const patched = function (...args: any[]) {
        if (isSharpLinuxWarn(args)) {
          return // Suppress silently
        }
        return origWarn.apply(console, args)
      }
      ;(patched as any).__patchedByAppSharp = true
      ;(console as any).warn = patched
    }

    // Also patch consola if available
    try {
      const consola = require('consola')
      if (consola && typeof consola.warn === 'function') {
        const originalWarn = consola.warn.bind(consola)
        if (!(originalWarn as any).__patchedForSharp) {
          consola.warn = ((...args: any[]) => {
            if (isSharpLinuxWarn(args)) {
              return
            }
            return originalWarn(...args)
          }) as typeof consola.warn
          ;(originalWarn as any).__patchedForSharp = true
        }
      }
      // Patch consola.withTag
      if (consola && typeof consola.withTag === 'function') {
        const originalWithTag = consola.withTag.bind(consola)
        if (!(originalWithTag as any).__patchedForSharp) {
          consola.withTag = ((tag: string) => {
            const logger = originalWithTag(tag)
            if (logger && typeof logger.warn === 'function') {
              const originalLoggerWarn = logger.warn.bind(logger)
              if (!(originalLoggerWarn as any).__patchedForSharp) {
                logger.warn = ((...args: any[]) => {
                  if (isSharpLinuxWarn(args)) {
                    return
                  }
                  return originalLoggerWarn(...args)
                }) as typeof logger.warn
                ;(originalLoggerWarn as any).__patchedForSharp = true
              }
            }
            return logger
          }) as typeof consola.withTag
          ;(consola.withTag as any).__patchedForSharp = true
        }
      }
    } catch {
      // consola not available, ignore
    }
  }
})
