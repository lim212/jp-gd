/**
 * Enhanced Translation Composable
 * Provides better translation helpers for all pages
 */

import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

export function useTranslation() {
  const { locale, t, messages } = useI18n()
  
  const isReady = ref(false)
  const currentLocale = computed(() => locale.value as 'id' | 'en')
  const isIndonesian = computed(() => currentLocale.value === 'id')
  const isEnglish = computed(() => currentLocale.value === 'en')

  // Check if translations are loaded
  const checkTranslationsReady = () => {
    try {
      const msgs = messages.value?.[currentLocale.value]
      isReady.value = msgs && Object.keys(msgs).length > 0
      return isReady.value
    } catch {
      return false
    }
  }

  // Initial check
  checkTranslationsReady()

  // Watch for locale changes
  watch(locale, () => {
    checkTranslationsReady()
  })

  // Safe translation function with fallback
  const translate = (key: string, fallback?: string): string => {
    try {
      const translated = t(key)
      
      // If translation returns the key itself, use fallback or key
      if (translated === key) {
        return fallback || key
      }
      
      return translated
    } catch {
      return fallback || key
    }
  }

  // Get translation or return default
  const getTranslation = (key: string, defaultValue: string = ''): string => {
    try {
      const value = t(key)
      return value === key ? defaultValue : value
    } catch {
      return defaultValue
    }
  }

  // Switch locale helper
  const switchLocale = async (newLocale: 'id' | 'en') => {
    if (locale.value === newLocale) return

    try {
      // Fetch messages for new locale
      const res = await $fetch<{ locale: string; messages: Record<string, any> }>(
        '/api/i18n/messages',
        { 
          query: { locale: newLocale },
          headers: { 'Cache-Control': 'public, max-age=1800' }
        }
      )

      const msgs = res?.messages || {}

      // Apply messages
      const nuxtApp = useNuxtApp()
      const i18n = (nuxtApp as any).$i18n

      if (i18n?.global?.setLocaleMessage) {
        i18n.global.setLocaleMessage(newLocale, msgs)
      }

      // Update locale
      locale.value = newLocale

      // Update HTML lang attribute
      if (import.meta.client && typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', newLocale)
      }

      console.log(`[useTranslation] Switched to ${newLocale}`)
    } catch (error) {
      console.error('[useTranslation] Failed to switch locale:', error)
    }
  }

  return {
    locale,
    currentLocale,
    isIndonesian,
    isEnglish,
    isReady,
    t: translate,
    translate,
    getTranslation,
    switchLocale,
    checkTranslationsReady
  }
}

