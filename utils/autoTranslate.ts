// utils/autoTranslate.ts
import { useI18n } from 'vue-i18n'

function hashKey(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  return hash.toString(16)
}

export type TranslateFormat = 'text' | 'html'

export async function autoTranslate(text: string, opts?: { source?: string; target?: string; format?: TranslateFormat }) {
  const { locale } = useI18n()
  const source = opts?.source || (locale.value === 'en' ? 'id' : 'en') // assume site source is ID by default
  const target = opts?.target || locale.value
  const format = opts?.format || 'text'

  if (!text || source === target) return text

  const keyBase = `${format}|${source}|${target}|${text.length}|${text.slice(0, 128)}`
  const key = `trans:${hashKey(keyBase)}`

  try {
    if (import.meta.client) {
      const cached = localStorage.getItem(key)
      if (cached) return cached
    }
  } catch {}

  try {
    const res = await $fetch<{ translated: string }>(`/api/translate`, {
      method: 'POST',
      body: { text, source, target, format }
    })
    const translated = res?.translated || text
    try {
      if (import.meta.client) localStorage.setItem(key, translated)
    } catch {}
    return translated
  } catch (e) {
    console.warn('autoTranslate failed, returning original text')
    return text
  }
}
