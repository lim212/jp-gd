/**
 * Enhanced Auto-detect and track page translations
 * Registers pages automatically when content changes
 * With smart caching and immediate translation option
 */

import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { watch, onMounted, ref } from 'vue'

interface PageContent {
  title?: string
  description?: string
  content?: string
  meta?: Record<string, any>
}

interface RegistrationResult {
  registered: boolean
  needsTranslation: boolean
  translationTriggered?: boolean
}

export function usePageTranslation() {
  const route = useRoute()
  const { locale, messages } = useI18n()
  const isRegistering = ref(false)

  /**
   * Extract all translatable content from current page
   */
  function extractPageContent(): string {
    if (import.meta.server) return ''
    
    try {
      // Get page HTML
      const html = document.documentElement.outerHTML
      
      // Extract text content from specific elements
      const texts: string[] = []
      
      // Title
      const title = document.title
      if (title) texts.push(title)
      
      // Meta description
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
      if (description) texts.push(description)
      
      // All text content with i18n markers
      const i18nElements = document.querySelectorAll('[data-i18n], [data-translation-key]')
      i18nElements.forEach(el => {
        const text = el.textContent?.trim()
        if (text && text.length > 0) texts.push(text)
      })
      
      // Combine all content for hashing
      return texts.join('\n')
    } catch {
      return ''
    }
  }

  /**
   * Track current page content with enhanced detection
   */
  async function registerPageContent(content?: PageContent, options?: { 
    immediate?: boolean // Trigger immediate translation
    force?: boolean // Force re-registration even if unchanged
  }): Promise<RegistrationResult> {
    if (import.meta.server) {
      return { registered: false, needsTranslation: false }
    }

    if (isRegistering.value) {
      return { registered: false, needsTranslation: false }
    }

    try {
      isRegistering.value = true
      
      const pagePath = route.path || '/'
      const currentLocale = locale.value as 'id' | 'en'

      // Get all translation keys used on this page
      const pageMessages = messages.value[currentLocale] || {}
      
      // Extract full page content for better change detection
      const pageContent = extractPageContent()

      // Register page with enhanced manager
      const result = await $fetch<RegistrationResult>('/api/i18n/register-page', {
        method: 'POST',
        body: {
          path: pagePath,
          locale: currentLocale,
          content: {
            ...content,
            extractedContent: pageContent,
            messages: pageMessages,
            timestamp: Date.now()
          },
          options: {
            immediate: options?.immediate || false,
            force: options?.force || false
          }
        }
      })
      
      if (result.registered) {
        console.log(`[PageTranslation] ✅ Registered: ${pagePath}`, {
          needsTranslation: result.needsTranslation,
          immediate: result.translationTriggered
        })
      }
      
      return result
    } catch (err: any) {
      // Silent fail - not critical
      console.log('[PageTranslation] Registration skipped:', err?.message || err)
      return { registered: false, needsTranslation: false }
    } finally {
      isRegistering.value = false
    }
  }

  /**
   * Force immediate translation for current page
   */
  async function translateNow(): Promise<boolean> {
    try {
      console.log('[PageTranslation] Triggering immediate translation...')
      
      const result = await $fetch('/api/i18n/translate-immediate', {
        method: 'POST',
        timeout: 30000 // 30 seconds for translation
      })
      
      console.log('[PageTranslation] Immediate translation complete:', result)
      
      // Reload messages to get fresh translations
      const { switchLocale } = useTranslation()
      if (locale.value === 'en') {
        await switchLocale('en')
      }
      
      return true
    } catch (err) {
      console.error('[PageTranslation] Failed to trigger immediate translation:', err)
      return false
    }
  }

  /**
   * Check if current page needs translation
   */
  async function checkTranslationStatus(): Promise<{ 
    hasPending: boolean
    canTranslate: boolean
  }> {
    try {
      const result = await $fetch<{ hasPending: boolean; canTranslate: boolean }>(
        '/api/i18n/check-status'
      )
      return result
    } catch {
      return { hasPending: false, canTranslate: false }
    }
  }

  // Auto-track route changes
  onMounted(() => {
    // Register current page on mount
    registerPageContent({
      title: document?.title,
      description: document?.querySelector('meta[name="description"]')?.getAttribute('content') || undefined
    })

    // Watch for route changes
    watch(() => route.path, () => {
      // Small delay to let page render
      setTimeout(() => {
        registerPageContent({
          title: document?.title,
          description: document?.querySelector('meta[name="description"]')?.getAttribute('content') || undefined
        })
      }, 500)
    })

    // Watch for locale changes - re-register to check if translation is needed
    watch(locale, () => {
      setTimeout(() => {
        registerPageContent({
          title: document?.title,
          description: document?.querySelector('meta[name="description"]')?.getAttribute('content') || undefined
        })
      }, 300)
    })
  })

  return {
    registerPageContent,
    translateNow,
    checkTranslationStatus,
    isRegistering
  }
}


