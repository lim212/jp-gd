// Vue I18n Configuration
// Import defineI18nConfig from Nuxt auto-imports
import { defineI18nConfig } from '#imports'

// Export a function that returns the configuration object for Nuxt 3 compatibility
export default defineI18nConfig(() => {
  return {
    fallbackLocale: 'id',
    // Ensure messages are properly loaded and cached
    legacy: false,
    // Disable compilation warnings in production
    silentTranslationWarn: process.env.NODE_ENV === 'production',
    // Ensure missing keys fallback to default locale
    missing: (locale, key, vm) => {
      console.log(`[i18n] Missing key: ${key} in locale: ${locale}`)
      // Try to get the key from the fallback locale
      const fallbackLocale = 'id'
      const messages = vm?.$i18n?.messages || {}

      // If we're already in the fallback locale, just return the key
      if (locale === fallbackLocale) {
        return key
      }

      // Check if the key exists in the fallback locale
      if (messages[fallbackLocale] &&
          messages[fallbackLocale][key.split('.')[0]] &&
          messages[fallbackLocale][key.split('.')[0]][key.split('.')[1]]) {
        return messages[fallbackLocale][key.split('.')[0]][key.split('.')[1]]
      }

      // If all else fails, return the key
      return key
    }
  }
})
