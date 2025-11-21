// i18n configuration to prevent __INTLIFY_JIT_COMPILATION__ error
export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  fallbackWarn: false,
  missingWarn: false,
  // Disable JIT compilation to prevent runtime errors
  jit: false,
  // Additional configuration
  compilation: {
    strictMessage: false,
    escapeHtml: false
  }
}))
