/**
 * Global Middleware: Translation Ready
 * Ensures translations are loaded before rendering any page
 * Works on ALL pages including homepage
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return // Only run on client

  const nuxtApp = useNuxtApp()
  const { $i18n } = nuxtApp

  if (!$i18n) return

  const currentLocale = ($i18n.locale?.value || 'id') as 'id' | 'en'

  try {
    // Check if messages are already loaded
    const messages = $i18n.messages?.value?.[currentLocale]
    
    if (!messages || Object.keys(messages).length === 0) {
      console.log('[TranslationMiddleware] Messages not loaded, fetching...')
      
      // Fetch messages
      const res = await $fetch<{ locale: string; messages: Record<string, any> }>(
        '/api/i18n/messages',
        { 
          query: { locale: currentLocale },
          headers: { 'Cache-Control': 'public, max-age=1800' }
        }
      )

      const msgs = res?.messages || {}

      // Apply messages
      if ($i18n?.global?.setLocaleMessage) {
        $i18n.global.setLocaleMessage(currentLocale, msgs)
      }

      console.log('[TranslationMiddleware] Messages loaded successfully')
    }
  } catch (error) {
    console.warn('[TranslationMiddleware] Failed to load messages:', error)
  }
})

