// server/scripts/scrape-kbli.ts
// Scraper for KBLI 2020 data from OSS: https://oss.go.id/informasi/kbli-berbasis-risiko
// - Prefer JSON API if discoverable from the page; otherwise scrape HTML tables per page with pagination.
// - Outputs an array of objects with keys: kode, judul, uraian, risiko, perizinan
// - Saves to server/data/kbli.json

/*
Usage:
  node --experimental-fetch server/scripts/scrape-kbli.ts
  (Node 18+ has global fetch enabled by default.)
*/

import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

// Small helpers
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function decodeEntities(str: string): string {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function htmlToText(html: string): string {
  let s = String(html || '')
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<br\s*\/?>(?=\s*)/gi, '\n')
  s = s.replace(/<\/(p|div|tr)>/gi, '\n')
  s = s.replace(/<[^>]+>/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()
  return decodeEntities(s)
}

function cellText(cellHtml: string): string { return htmlToText(cellHtml) }

function tidy(s: string): string { return String(s || '').replace(/\s+/g, ' ').trim() }

function normalizeRisk(v: string): string {
  const s = tidy(v).toLowerCase()
  if (!s) return ''
  if (s.includes('menengah') && s.includes('tinggi')) return 'Menengah Tinggi'
  if (s.includes('tinggi')) return 'Tinggi'
  if (s.includes('rendah')) return 'Rendah'
  if (s.includes('menengah')) return 'Menengah'
  return tidy(v)
}

async function tryDiscoverJsonEndpoint(indexUrl: string): Promise<string | null> {
  try {
    const res = await fetch(indexUrl, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
    const html = await res.text()
    // Try to find likely JSON endpoints inside inline scripts or HTML attributes
    const candidates = new Set<string>()
    const urlRegex = /(https?:\/\/[^\s'"<>]+?(?:kbli|risiko)[^'"<>]*)/ig
    let m: RegExpExecArray | null
    while ((m = urlRegex.exec(html)) !== null) {
      const u = m[1]
      if (/\.json($|\?|#)/i.test(u) || /api|ajax|datatable|json/i.test(u)) {
        candidates.add(u)
      }
    }
    for (const url of candidates) {
      try {
        const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
        if (!r.ok) continue
        const ct = (r.headers.get('content-type') || '').toLowerCase()
        if (ct.includes('application/json') || ct.includes('json')) {
          const j = await r.json()
          // Ensure it looks like a list of records
          const arr = Array.isArray(j) ? j : (Array.isArray((j as any)?.data) ? (j as any).data : (Array.isArray((j as any)?.items) ? (j as any).items : null))
          if (Array.isArray(arr) && arr.length > 0) {
            return url
          }
        }
      } catch {}
    }
  } catch {}
  return null
}

function parseTableRowsFromHtml(html: string): Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string; }>{
  const items: Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string; }> = []
  // Extract tbody if present, else scan full HTML
  const scope = (html.match(/<tbody[\s\S]*?<\/tbody>/i) || [html])[0]
  const rows = scope.match(/<tr[\s\S]*?<\/tr>/gi) || []
  for (const row of rows) {
    const cells = row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) || []
    if (cells.length < 2) continue
    const t = cells.map(c => cellText(c))
    // Default mapping assumes 5 columns [kode, judul, uraian, risiko, perizinan]
    let kode = tidy(t[0])
    let judul = tidy(t[1])
    const uraian = tidy(t[2] || '')
    const risiko = normalizeRisk(t[3] || '')
    const perizinan = tidy(t[4] || '')

    // Heuristics: if first cell doesn't look like KBLI code, try to autodetect within first 3 cells
    if (!/^[A-Z]?\d{4,5}$/.test(kode)) {
      let detected = ''
      for (let i = 0; i < Math.min(5, t.length); i++) {
        const m = t[i].match(/\b[A-Z]?\d{4,5}\b/)
        if (m) { detected = m[0]; break }
      }
      if (detected) {
        kode = detected
        // Try set judul to the longest of the remaining first 3 cells
        const cands: string[] = []
        for (let i = 0; i < Math.min(3, t.length); i++) {
          if (!t[i].includes(kode) && t[i].length >= 3) cands.push(t[i])
        }
        if (cands.length) judul = cands.sort((a,b) => b.length - a.length)[0]
      }
    }

    // Skip rows that are obviously header-like
    if (!kode || !judul) continue

    items.push({ kode, judul, uraian, risiko, perizinan })
  }
  return items
}

async function fetchJsonAll(jsonUrl: string): Promise<Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string }>> {
  const res = await fetch(jsonUrl, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
  if (!res.ok) throw new Error(`Failed JSON ${jsonUrl}: ${res.status}`)
  const j = await res.json()
  const arr = Array.isArray(j) ? j : (Array.isArray((j as any)?.data) ? (j as any).data : (Array.isArray((j as any)?.items) ? (j as any).items : []))
  const out: Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string }> = []
  for (const it of arr) {
    const kode = tidy(String((it as any).kode || (it as any).code || (it as any).kbli || ''))
    const judul = tidy(String((it as any).judul || (it as any).title || (it as any).nama || ''))
    const uraian = tidy(String((it as any).uraian || (it as any).description || (it as any).deskripsi || (it as any).keterangan || ''))
    const risiko = normalizeRisk(String((it as any).risiko || (it as any).risk || (it as any).risk_level || (it as any).tingkat_risiko || ''))
    const perizinan = tidy(String((it as any).perizinan || (it as any).licensing || (it as any).persyaratan || ''))
    if (kode && judul) out.push({ kode, judul, uraian, risiko, perizinan })
  }
  return out
}

async function fetchHtmlPage(pageUrl: string): Promise<string> {
  const res = await fetch(pageUrl, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${pageUrl}`)
  return await res.text()
}

async function scrapeAll(): Promise<Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string }>> {
  const base = 'https://oss.go.id/informasi/kbli-berbasis-risiko'

  // Try to discover JSON endpoint first
  const discovered = await tryDiscoverJsonEndpoint(base)
  if (discovered) {
    console.log('[KBLI] Discovered JSON endpoint:', discovered)
    const jsonItems = await fetchJsonAll(discovered)
    if (jsonItems.length > 0) return jsonItems
  }

  console.log('[KBLI] Falling back to HTML table scraping with pagination...')
  const items: Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string }> = []
  // Iterate pages until empty, up to a safety cap
  const MAX_PAGES = 400
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = page === 1 ? base : `${base}?page=${page}`
    let html = ''
    try {
      html = await fetchHtmlPage(url)
    } catch (e) {
      console.warn(`[KBLI] Error fetching page ${page}:`, (e as Error).message)
      // Small backoff and continue next page
      await sleep(500)
      continue
    }

    const rows = parseTableRowsFromHtml(html)
    if (!rows.length) {
      console.log(`[KBLI] Page ${page} has 0 rows, stopping.`)
      break
    }

    console.log(`[KBLI] Page ${page}: parsed ${rows.length} rows`)
    items.push(...rows)

    // Be polite to the server
    await sleep(250)
  }

  return items
}

function dedupeByKode(items: Array<{ kode: string; judul: string; uraian: string; risiko: string; perizinan: string }>) {
  const map = new Map<string, { kode: string; judul: string; uraian: string; risiko: string; perizinan: string }>()
  for (const r of items) {
    const kode = tidy(r.kode)
    if (!kode) continue
    const judul = tidy(r.judul)
    const uraian = tidy(r.uraian)
    const risiko = tidy(r.risiko)
    const perizinan = tidy(r.perizinan)
    map.set(kode, { kode, judul, uraian, risiko: normalizeRisk(risiko), perizinan })
  }
  return Array.from(map.values())
}

async function main() {
  console.log('[KBLI] Starting scrape...')
  const all = await scrapeAll()
  console.log(`[KBLI] Raw collected: ${all.length}`)
  const clean = dedupeByKode(all)
  console.log(`[KBLI] After dedupe: ${clean.length}`)

  // Basic validation: expect around 1700 (+/- some tolerance)
  if (clean.length < 1200 || clean.length > 3000) {
    console.warn('[KBLI] Warning: unexpected total count:', clean.length)
  }

  const outDir = resolve(process.cwd(), 'server', 'data')
  const outFile = resolve(outDir, 'kbli.json')
  await mkdir(outDir, { recursive: true })
  await writeFile(outFile, JSON.stringify(clean, null, 2), 'utf-8')
  console.log(`[KBLI] Saved ${clean.length} KBLI records to server/data/kbli.json`)
}

// Execute when called directly
main().catch(err => {
  console.error('[KBLI] Scrape failed:', err)
  process.exitCode = 1
})
