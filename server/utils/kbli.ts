// server/utils/kbli.ts
// Lightweight KBLI provider with in-memory cache and optional external JSON source or HTML scraper.
// Env options:
// - KBLI_SCRAPE=true to enable HTML scraping
// - KBLI_SCRAPE_URLS="https://example.com/page1,https://example.com/page2" (comma-separated) for scraper sources
// - KBLI_SOURCE_URL to a JSON containing KBLI 2020 data. Expected item shape (flexible, auto-mapped):
//   { code|kode: string, title|judul: string, risk|risk_level|level_risiko: string, description|uraian: string, licensing|perizinan?: any }
// - KBLI_TTL_SECONDS to override cache TTL (default 600 seconds)

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export type KbliItem = {
  code: string
  title: string
  risk?: string
  description?: string
  licensing?: any
  section?: string
}

export type KbliResult = {
  items: KbliItem[]
  source: string
  fetchedAt: string
}

const KBLI_CACHE: { data: KbliResult | null; ts: number; ttlMs: number } = {
  data: null,
  ts: 0,
  ttlMs: (Number(process.env.KBLI_TTL_SECONDS || '') > 0 ? Number(process.env.KBLI_TTL_SECONDS) * 1000 : 1000 * 60 * 10) // default 10m
}

function now() { return Date.now() }

function codeToSectionLetter(code: string): string | null {
  if (!code) return null
  const c = String(code).trim().toUpperCase()
  const first = c.charAt(0)
  if (/^[A-U]$/.test(first)) return first
  const m = c.match(/^(\d{2})/)
  if (!m) return null
  const num = parseInt(m[1], 10)
  if (isNaN(num)) return null
  // KBLI 2020 section mapping by 2-digit prefixes (plus legacy 48 -> H)
  if (num >= 1 && num <= 3) return 'A'      // 01-03
  if (num >= 5 && num <= 9) return 'B'      // 05-09
  if (num >= 10 && num <= 33) return 'C'    // 10-33
  if (num === 35) return 'D'                // 35
  if (num >= 36 && num <= 39) return 'E'    // 36-39
  if (num >= 41 && num <= 43) return 'F'    // 41-43
  if (num >= 45 && num <= 47) return 'G'    // 45-47
  if (num === 48) return 'H'                // legacy/compat mapping
  if (num >= 49 && num <= 53) return 'H'    // 49-53
  if (num >= 55 && num <= 56) return 'I'    // 55-56
  if (num >= 58 && num <= 63) return 'J'    // 58-63
  if (num >= 64 && num <= 66) return 'K'    // 64-66
  if (num === 68) return 'L'                // 68
  if (num >= 69 && num <= 75) return 'M'    // 69-75
  if (num >= 77 && num <= 82) return 'N'    // 77-82
  if (num === 84) return 'O'                // 84
  if (num === 85) return 'P'                // 85
  if (num >= 86 && num <= 88) return 'Q'    // 86-88
  if (num >= 90 && num <= 93) return 'R'    // 90-93
  if (num >= 94 && num <= 96) return 'S'    // 94-96
  if (num >= 97 && num <= 98) return 'T'    // 97-98
  if (num === 99) return 'U'                // 99
  return null
}

function normalizeItem(raw: any): KbliItem | null {
  if (!raw || typeof raw !== 'object') return null
  const code = String(raw.code || raw.kode || raw.kbli || '').trim()
  const title = String(raw.title || raw.judul || raw.nama || '').trim()
  const risk = String(raw.risk || raw.risk_level || raw.level_risiko || raw.tingkat_risiko || '').trim() || undefined
  const description = String(raw.description || raw.deskripsi || raw.uraian || raw.keterangan || '').trim() || undefined
  const licensing = raw.licensing ?? raw.perizinan ?? raw.persyaratan ?? undefined
  if (!code || !title) return null
  const section = codeToSectionLetter(code) || undefined
  return { code, title, risk, description, licensing, section }
}

async function fetchFromExternalSource(url: string): Promise<KbliItem[]> {
  // Expecting either an array of items or an object with property like "data" or "items"
  const json = await $fetch<any>(url, { timeout: 30000 })
  const arr = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.items) ? json.items : []))
  const items: KbliItem[] = []
  for (const it of arr) {
    const n = normalizeItem(it)
    if (n) items.push(n)
  }
  // Sort by code
  items.sort((a, b) => a.code.localeCompare(b.code))
  return items
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function htmlToText(html: string): string {
  let s = html
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<br\s*\/?>(?=\s*)/gi, '\n')
  s = s.replace(/<\/(p|div|tr)>/gi, '\n')
  s = s.replace(/<[^>]+>/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()
  return decodeEntities(s)
}

function cellText(cellHtml: string): string {
  return htmlToText(cellHtml)
}

function absolutize(baseUrl: string, href: string): string {
  try { return new URL(href, baseUrl).toString() } catch { return href }
}

async function discoverOssKbliCategoryUrls(indexUrl = 'https://oss.go.id/informasi/kbli-berbasis-risiko'): Promise<string[]> {
  const letters = 'ABCDEFGHIJKLMNOPQRSTU'.split('')
  try {
    const html = await $fetch<string>(indexUrl, { responseType: 'text', timeout: 30000 })
    const anchors = html.match(/<a [^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi) || []
    const urls = new Set<string>()
    for (const a of anchors) {
      const hrefMatch = a.match(/href=["']([^"']+)["']/i)
      const href = hrefMatch ? hrefMatch[1] : ''
      if (!href) continue
      if (href.includes('/informasi/kbli-kategori/')) {
        urls.add(absolutize(indexUrl, href.split('#')[0]))
      }
    }
    const out = Array.from(urls)
    if (out.length > 0) return out
    // Fallback when the site renders links via JS
    return letters.map(l => absolutize(indexUrl, `/informasi/kbli-kategori/${l}`))
  } catch {
    // On error, still provide hardcoded A–U fallback
    return letters.map(l => absolutize(indexUrl, `/informasi/kbli-kategori/${l}`))
  }
}

async function scrapeFromUrls(urls: string[]): Promise<{ items: KbliItem[]; source: string }> {
  const map = new Map<string, KbliItem>()
  const MAX_PAGES_PER_URL = 300
  for (const baseUrl of urls) {
    for (let page = 1; page <= MAX_PAGES_PER_URL; page++) {
      const pageUrl = page === 1 ? baseUrl : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`
      let html: string
      try {
        html = await $fetch<string>(pageUrl, { responseType: 'text', timeout: 30000 })
      } catch {
        // On fetch error, stop paginating this URL and go to next
        break
      }
      // Try table-based extraction first (robust parsing)
      const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || []
      let added = 0
      for (const row of rows) {
        const cells = row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) || []
        if (cells.length >= 2) {
          const texts = cells.map(c => cellText(c))
          // Find code in any of the first few cells
          let code = ''
          let codeIdx = -1
          for (let i = 0; i < Math.min(texts.length, 5); i++) {
            const m = texts[i].match(/\b[A-Z]?\d{4,5}\b/)
            if (m) { code = m[0]; codeIdx = i; break }
          }
          // Determine title: prefer other cell among first 3 that isn't code cell, pick longest text
          let title = ''
          const titleCandidates: string[] = []
          for (let i = 0; i < Math.min(texts.length, 3); i++) {
            if (i !== codeIdx && texts[i].length >= 3) titleCandidates.push(texts[i])
          }
          if (titleCandidates.length) {
            title = titleCandidates.sort((a,b) => b.length - a.length)[0]
          }
          // Risk: look for common risk words
          let risk: string | undefined
          for (const t of texts) {
            if (/\b(Tinggi|Menengah|Rendah)\b/i.test(t)) { risk = t; break }
          }
          // Licensing: NIB, Izin, Sertifikat, Perizinan
          let licensing: any
          for (const t of texts) {
            if (/(NIB|Izin|Sertifikat|Perizinan)/i.test(t)) { licensing = t; break }
          }
          if (code && title) {
            const n = normalizeItem({ code, title, risk, licensing })
            if (n) {
              const prev = map.get(n.code)
              if (!prev) { map.set(n.code, n); added++ }
            }
          }
        }
      }

      // Fallback: anchor-based extraction (code in anchor text) if nothing added via rows
      if (added === 0) {
        const anchors = html.match(/<a [^>]*>[\s\S]*?<\/a>/gi) || []
        for (const a of anchors) {
          const text = htmlToText(a)
          const m = text.match(/\b[A-Z]?\d{4,5}\b/) // find code
          if (m) {
            const code = m[0]
            // title is remaining text after code
            const title = text.replace(code, '').replace(/^[\s\-:–]+|[\s\-:–]+$/g, '').slice(0, 200)
            if (title.length >= 3) {
              const n = normalizeItem({ code, title })
              if (n && !map.has(n.code)) { map.set(n.code, n); added++ }
            }
          }
        }
      }

      // Stop paginating this URL when page yielded no new rows
      if (added === 0) break
    }
  }
  const items = Array.from(map.values())
  items.sort((a, b) => a.code.localeCompare(b.code))
  return { items, source: `scrape:${urls.length}|paged` }
}

async function loadFromLocalFile(): Promise<{ items: KbliItem[]; source: string } | null> {
  try {
    // Prefer server/data/kbli.json, fallback to data/kbli.json for backward compatibility
    const primaryPath = resolve(process.cwd(), 'server', 'data', 'kbli.json')
    const fallbackPath = resolve(process.cwd(), 'data', 'kbli.json')

    let filePath = primaryPath
    let raw: string
    try {
      raw = await readFile(filePath, 'utf-8')
    } catch {
      filePath = fallbackPath
      raw = await readFile(filePath, 'utf-8')
    }

    const json = JSON.parse(raw)
    const arr = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.items) ? json.items : []))
    const items: KbliItem[] = []
    for (const it of arr) {
      const n = normalizeItem(it)
      if (n) items.push(n)
    }
    items.sort((a, b) => a.code.localeCompare(b.code))
    const src = filePath.includes('server') ? 'local:server/data/kbli.json' : 'local:data/kbli.json'
    return { items, source: src }
  } catch {
    return null
  }
}

export async function loadKbliAll(forceRefresh = false): Promise<KbliResult> {
  if (!forceRefresh && KBLI_CACHE.data && (now() - KBLI_CACHE.ts < KBLI_CACHE.ttlMs)) {
    return KBLI_CACHE.data
  }

  const doScrape = String(process.env.KBLI_SCRAPE || '').toLowerCase() === 'true'
  const scrapeUrls = String(process.env.KBLI_SCRAPE_URLS || '').split(',').map(s => s.trim()).filter(Boolean)
  if (doScrape || scrapeUrls.length > 0) {
    try {
      let urls = scrapeUrls
      if (urls.length === 0) {
        urls = await discoverOssKbliCategoryUrls()
      }
      if (urls.length === 0) throw new Error('No KBLI scrape URLs found')
      const { items, source } = await scrapeFromUrls(urls)
      const res: KbliResult = { items, source, fetchedAt: new Date().toISOString() }
      KBLI_CACHE.data = res
      KBLI_CACHE.ts = now()
      return res
    } catch (e) {
      // fallthrough to JSON/local
    }
  }

  const srcUrl = process.env.KBLI_SOURCE_URL || ''
  if (!srcUrl) {
    // Default: try scraping OSS KBLI categories (A–U) automatically
    try {
      const urls = await discoverOssKbliCategoryUrls()
      if (urls.length > 0) {
        const { items, source } = await scrapeFromUrls(urls)
        const res: KbliResult = { items, source: source + '|oss:auto', fetchedAt: new Date().toISOString() }
        KBLI_CACHE.data = res
        KBLI_CACHE.ts = now()
        return res
      }
    } catch {}

    // Fallback: local file
    const local = await loadFromLocalFile()
    const res: KbliResult = {
      items: local?.items || [],
      source: local?.source || 'none',
      fetchedAt: new Date().toISOString()
    }
    KBLI_CACHE.data = res
    KBLI_CACHE.ts = now()
    return res
  }

  const items = await fetchFromExternalSource(srcUrl)
  const res: KbliResult = { items, source: srcUrl, fetchedAt: new Date().toISOString() }
  KBLI_CACHE.data = res
  KBLI_CACHE.ts = now()
  return res
}

export function filterKbli(items: KbliItem[], opts?: { letter?: string; search?: string; field?: string }) {
  let out = items
  const letter = (opts?.letter || '').toUpperCase()
  if (letter && /^[A-U]$/.test(letter)) {
    out = out.filter(it => {
      const section = (it.section || codeToSectionLetter(it.code || '') || '').toUpperCase()
      return section === letter
    })
  }
  const search = String(opts?.search || '').trim().toLowerCase()
  const field = String(opts?.field || 'all').toLowerCase()
  if (search) {
    if (field === 'code' || field === 'kode') {
      out = out.filter(it => it.code.toLowerCase().includes(search))
    } else if (field === 'title' || field === 'judul' || field === 'name' || field === 'nama') {
      out = out.filter(it => it.title.toLowerCase().includes(search))
    } else if (field === 'description' || field === 'uraian' || field === 'deskripsi' || field === 'keterangan') {
      out = out.filter(it => (it.description ? it.description.toLowerCase().includes(search) : false))
    } else {
      out = out.filter(it =>
        it.code.toLowerCase().includes(search) ||
        it.title.toLowerCase().includes(search) ||
        (it.description ? it.description.toLowerCase().includes(search) : false)
      )
    }
  }
  return out
}
