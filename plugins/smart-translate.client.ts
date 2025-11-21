// plugins/smart-translate.client.ts
// Smart Translate Mode: apply client-side DOM translation for hard-coded texts
// when switching to English locale, using existing i18n message maps.
// - Translates visible text nodes based on locales/id.json -> locales/en.json mapping
// - Restores original text when switching back to Indonesian
// - Observes DOM changes to keep translations in sync

import { watch } from 'vue'
import type { I18n } from 'vue-i18n'

// Element tags to skip translating inside
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE', 'KBD', 'SAMP'])

function flatten(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  try {
    for (const key of Object.keys(obj || {})) {
      const val = obj[key]
      const p = prefix ? `${prefix}.${key}` : key
      if (val && typeof val === 'object') {
        Object.assign(out, flatten(val, p))
      } else if (typeof val === 'string') {
        out[p] = val
      }
    }
  } catch {}
  return out
}

function buildTextMap(idMsgs: any, enMsgs: any) {
  const idFlat = flatten(idMsgs)
  const enFlat = flatten(enMsgs)
  const exact = new Map<string, string>()
  const partial: Array<{ from: string; to: string }> = []

  for (const key of Object.keys(idFlat)) {
    const from = (idFlat[key] || '').trim()
    const to = (enFlat[key] || '').trim()
    if (!from || !to || from === to) continue
    // Build exact map
    exact.set(from, to)
    // Build partial map for phrase-level replacements (keep short phrases out)
    if (from.length >= 6) partial.push({ from, to })
  }
  // Sort partial by length desc to replace longer phrases first
  partial.sort((a, b) => b.from.length - a.from.length)
  return { exact, partial }
}

// WeakMap to remember original text content for nodes
const ORIGINAL_TEXT = new WeakMap<Node, string>()

function shouldSkip(el: Element | null): boolean {
  if (!el) return true
  if (SKIP_TAGS.has(el.tagName)) return true
  // Respect explicit opt-out attributes/classes, but allow site-wide notranslate on <html>
  try {
    if (el.closest('[data-no-smart-translate]')) return true
    const nt = el.closest('.notranslate') as Element | null
    // If .notranslate is applied only on the root <html>, do not skip smart-translate
    const root = typeof document !== 'undefined' ? document.documentElement : null
    if (nt && root && nt !== root) return true
  } catch {}
  return false
}

function translateTextNode(node: Node, maps: { exact: Map<string, string>; partial: Array<{ from: string; to: string }> }) {
  try {
    const parent = node.parentElement
    if (!parent || shouldSkip(parent)) return
    const raw = node.nodeValue || ''
    const text = raw.trim()
    if (!text) return

    // Store original once
    if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, raw)

    // Try exact match first
    const exact = maps.exact.get(text)
    if (exact) {
      const leading = raw.startsWith(text) ? '' : raw.slice(0, raw.indexOf(text))
      const trailingIndex = raw.indexOf(text)
      const trailing = trailingIndex >= 0 ? raw.slice(trailingIndex + text.length) : ''
      node.nodeValue = `${leading}${exact}${trailing}`
      return
    }

    // Partial phrase replacements (lightweight)
    let replaced = raw
    let did = false
    for (const { from, to } of maps.partial) {
      if (replaced.includes(from)) {
        replaced = replaced.split(from).join(to)
        did = true
      }
    }
    if (did && replaced !== raw) node.nodeValue = replaced
  } catch {}
}

function walkAndTranslate(root: Element | DocumentFragment, maps: { exact: Map<string, string>; partial: Array<{ from: string; to: string }> }) {
  try {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        try {
          const p = (node as any).parentElement as Element | null
          if (!p || shouldSkip(p)) return NodeFilter.FILTER_REJECT
          const v = node.nodeValue || ''
          if (!v || !v.trim()) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        } catch {
          return NodeFilter.FILTER_REJECT
        }
      }
    })
    const toProcess: Node[] = []
    let n: Node | null
    while ((n = walker.nextNode())) toProcess.push(n)
    for (const node of toProcess) translateTextNode(node, maps)
  } catch {}
}

function restoreOriginal(root: Element | DocumentFragment) {
  try {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let n: Node | null
    while ((n = walker.nextNode())) {
      const orig = ORIGINAL_TEXT.get(n)
      if (orig !== undefined) {
        try { n.nodeValue = orig } catch {}
      }
    }
  } catch {}
}

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const i18n: I18n | undefined = (nuxtApp as any).$i18n
  if (!i18n || !i18n.global) return

  let maps: { exact: Map<string, string>; partial: Array<{ from: string; to: string }> } | null = null
  let observer: MutationObserver | null = null

  function ensureMaps() {
    try {
      const idMsgs = i18n.global.getLocaleMessage ? i18n.global.getLocaleMessage('id') : (i18n.global as any).messages?.id
      const enMsgs = i18n.global.getLocaleMessage ? i18n.global.getLocaleMessage('en') : (i18n.global as any).messages?.en
      if (idMsgs && enMsgs) maps = buildTextMap(idMsgs, enMsgs)
    } catch {}
  }

  function runTranslate(full = true) {
    if (!document?.body) return
    if (!maps) ensureMaps()
    if (!maps) return
    if (full) walkAndTranslate(document.body, maps)
  }

  function startObserver() {
    if (observer) return
    try {
      observer = new MutationObserver((mutations) => {
        if (!maps) return
        for (const m of mutations) {
          if (m.type === 'childList') {
            m.addedNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                translateTextNode(node, maps!)
              } else if ((node as Element).nodeType === Node.ELEMENT_NODE) {
                const el = node as Element
                if (!shouldSkip(el)) walkAndTranslate(el, maps!)
              }
            })
          } else if (m.type === 'characterData') {
            if (m.target?.nodeType === Node.TEXT_NODE) translateTextNode(m.target as Node, maps!)
          }
        }
      })
      observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    } catch {}
  }

  function stopObserver() {
    try { observer?.disconnect(); observer = null } catch {}
  }

  function applyLocale(locale: string) {
    if (locale === 'en') {
      ensureMaps()
      runTranslate(true)
      startObserver()
      try { document.documentElement.classList.add('smart-translate-active') } catch {}
    } else {
      stopObserver()
      restoreOriginal(document.body)
      try { document.documentElement.classList.remove('smart-translate-active') } catch {}
    }
  }

  // Initial apply
  try { applyLocale(i18n.global.locale?.value || 'id') } catch {}

  // React to locale changes
  try {
    watch(() => i18n.global.locale?.value, (val) => { if (val) applyLocale(val) })
  } catch {}

  // Re-apply after each page navigation finish
  try {
    nuxtApp.hook('page:finish', () => {
      const cur = i18n.global.locale?.value
      if (cur === 'en') runTranslate(true)
    })
  } catch {}

  return {
    provide: {
      smartTranslate: {
        reapply: () => runTranslate(true)
      }
    }
  }
})
