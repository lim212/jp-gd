// Local wrapper for vue-i18n to bypass the "cannot be marked as external" error
import { createI18n, useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { useRequestHeaders } from '#imports'
import { defineNuxtPlugin } from '#app'

// Import locale files
import en from '../locales/en.json'
import id from '../locales/id.json'

// Re-export the createI18n and useI18n functions
export { createI18n, useI18n }

// Export a function to create a configured i18n instance
export function createConfiguredI18n(options) {
  return createI18n(options)
}

// Helper to get initial locale: default to Indonesian unless user explicitly selected otherwise via cookie
function getInitialLocale() {
  try {
    // Prefer explicit user selection tracked by cookie i18n_selected=true
    const parseCookie = (cookieStr) => {
      const out = {}
      try {
        (cookieStr || '').split(';').forEach(p => {
          const idx = p.indexOf('=')
          if (idx > -1) {
            const k = p.slice(0, idx).trim()
            const v = decodeURIComponent(p.slice(idx + 1).trim())
            out[k] = v
          }
        })
      } catch {}
      return out
    }

    const isExpiredEn = (cookies) => {
      try {
        const loc = cookies['i18n_locale']
        const selected = cookies['i18n_selected'] === 'true'
        if (!selected || loc !== 'en') return false
        const selectedAt = Number(cookies['i18n_selected_at'] || '0')
        const now = Date.now()
        const thirtyMin = 30 * 60 * 1000
        return !selectedAt || (now - selectedAt) >= thirtyMin
      } catch { return false }
    }

    if (import.meta.server) {
      try {
        const headers = useRequestHeaders(['cookie'])
        const cookies = parseCookie((headers && headers.cookie) || '')
        if (cookies['i18n_selected'] === 'true') {
          // If English selection expired, fall back to Indonesian
          if (isExpiredEn(cookies)) return 'id'
          const loc = cookies['i18n_locale'] === 'en' ? 'en' : 'id'
          return loc
        }
      } catch {}
    } else if (import.meta.client) {
      try {
        const cookies = parseCookie(document.cookie || '')
        if (cookies['i18n_selected'] === 'true') {
          if (isExpiredEn(cookies)) return 'id'
          const loc = cookies['i18n_locale'] === 'en' ? 'en' : 'id'
          return loc
        }
      } catch {}
    }
  } catch {}
  // Default: Indonesian
  return 'id'
}

function setLocaleCookie(locale, selected = false) {
  try {
    if (!import.meta.client) return
    const isEn = locale === 'en'
    const maxAge = isEn ? (60 * 30) : (60 * 60 * 24 * 365) // EN: 30m, ID: 1y
    document.cookie = `i18n_locale=${encodeURIComponent(locale)}; path=/; max-age=${maxAge}; samesite=lax`
    if (selected) {
      document.cookie = `i18n_selected=true; path=/; max-age=${maxAge}; samesite=lax`
      if (isEn) {
        const now = Date.now()
        document.cookie = `i18n_selected_at=${now}; path=/; max-age=${maxAge}; samesite=lax`
      } else {
        // Clear any previous selection timestamp
        document.cookie = `i18n_selected_at=; path=/; max-age=0; samesite=lax`
      }
    }
  } catch {}
}

// Export a plugin function for Nuxt
export default defineNuxtPlugin((nuxtApp) => {
  // Create i18n instance
  const initialLocale = getInitialLocale(nuxtApp)
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: initialLocale,
    fallbackLocale: 'id',
    messages: {
      en,
      id
    },
    // Ensure missing keys fallback to default locale
    missing: (locale, key) => {
      if (process.env.NODE_ENV === 'development') console.log(`[i18n] Missing key: ${key} in locale: ${locale}`)
      // Try to get the key from the fallback (id)
      const parts = String(key).split('.')
      let value = id
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part]
        } else {
          return key
        }
      }
      return typeof value === 'string' ? value : key
    }
  })

  // Register i18n instance with Vue app
  nuxtApp.vueApp.use(i18n)

  // Helper: refresh messages from server for a given locale
  async function refreshMessages(target) {
    try {
      const res = await $fetch('/api/i18n/messages', { query: { locale: target } })
      const msgs = res && res.messages ? res.messages : {}
      if (i18n?.global?.setLocaleMessage) i18n.global.setLocaleMessage(target, msgs)
    } catch (err) {
      console.warn('[i18n] Failed to refresh messages for', target, err)
    }
  }

  // On client mount: ensure freshest messages for current locale, and optionally warm the other
  if (import.meta.client) {
    nuxtApp.hook('app:mounted', async () => {
      // Enforce 30m expiry for English selection (apply on first access only)
      try {
        const parseCookie = (cookieStr) => {
          const out = {}
          try {
            (cookieStr || '').split(';').forEach(p => {
              const idx = p.indexOf('=')
              if (idx > -1) {
                const k = p.slice(0, idx).trim()
                const v = decodeURIComponent(p.slice(idx + 1).trim())
                out[k] = v
              }
            })
          } catch {}
          return out
        }
        const cookies = parseCookie(document.cookie || '')
        const isEn = cookies['i18n_locale'] === 'en'
        const selected = cookies['i18n_selected'] === 'true'
        const selectedAt = Number(cookies['i18n_selected_at'] || '0')
        const expired = selected && isEn && (!selectedAt || (Date.now() - selectedAt) >= (30 * 60 * 1000))
        if (expired) {
          // Auto revert to Indonesian on first access after expiry
          i18n.global.locale.value = 'id'
          try { document.documentElement.setAttribute('lang', 'id') } catch {}
          try { localStorage.setItem('userLocale', 'id') } catch {}
          const year = 60 * 60 * 24 * 365
          document.cookie = `i18n_locale=id; path=/; max-age=${year}; samesite=lax`
          document.cookie = `i18n_selected=; path=/; max-age=0; samesite=lax`
          document.cookie = `i18n_selected_at=; path=/; max-age=0; samesite=lax`
        }
      } catch {}

      const cur = i18n.global.locale.value
      await refreshMessages(cur)
      // Warm the opposite locale to smooth first toggle
      const other = cur === 'en' ? 'id' : 'en'
      refreshMessages(other)
    })
  }

  // Persist locale changes, update <html lang>, and refresh messages
  try {
    let initialized = false
    watch(
      () => i18n.global.locale.value,
      async (val) => {
        try {
          if (import.meta.client) {
            // Always reflect current locale in <html lang>
            document.documentElement.setAttribute('lang', val)
            // Persist current locale value, but do not mark as explicitly selected here
            try { localStorage.setItem('userLocale', val) } catch {}
            setLocaleCookie(val, false)
            await refreshMessages(val)
            initialized = true
          }
        } catch (e) { /* ignore */ }
      },
      { immediate: true }
    )
  } catch (e) {
    console.warn('i18n locale persistence failed:', e)
  }

  return {
    provide: {
      i18n
    }
  }
})
