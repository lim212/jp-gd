// server/scripts/scrape-kbli.mjs
// Scraper for KBLI 2020 data from OSS: https://oss.go.id/informasi/kbli-berbasis-risiko
// - Prefer JSON API if discoverable from the page; otherwise scrape HTML tables per page with pagination.
// - Outputs an array of objects with keys: kode, judul, uraian, risiko, perizinan
// - Saves to server/data/kbli.json

/*
Usage:
  node server/scripts/scrape-kbli.mjs
*/

import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function decodeEntities(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function htmlToText(html) {
  let s = String(html || '')
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<br\s*\/?>(?=\s*)/gi, '\n')
  s = s.replace(/<\/(p|div|tr)>/gi, '\n')
  s = s.replace(/<[^>]+>/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()
  return decodeEntities(s)
}

function cellText(cellHtml) { return htmlToText(cellHtml) }

function tidy(s) { return String(s || '').replace(/\s+/g, ' ').trim() }

function normalizeRisk(v) {
  const s = tidy(v).toLowerCase()
  if (!s) return ''
  if (s.includes('menengah') && s.includes('tinggi')) return 'Menengah Tinggi'
  if (s.includes('tinggi')) return 'Tinggi'
  if (s.includes('rendah')) return 'Rendah'
  if (s.includes('menengah')) return 'Menengah'
  return tidy(v)
}

async function tryDiscoverJsonEndpoint(indexUrl) {
  try {
    const res = await fetch(indexUrl, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
    const html = await res.text()
    const candidates = new Set()
    const urlRegex = /(https?:\/\/[^\s'"<>]+?(?:kbli|risiko)[^'"<>]*)/ig
    let m
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
          const arr = Array.isArray(j) ? j : (Array.isArray(j?.data) ? j.data : (Array.isArray(j?.items) ? j.items : null))
          if (Array.isArray(arr) && arr.length > 0) {
            return url
          }
        }
      } catch {}
    }
  } catch {}
  return null
}

function parseTableRowsFromHtml(html) {
  const items = []
  const scope = (html.match(/<tbody[\s\S]*?<\/tbody>/i) || [html])[0]
  const rows = scope.match(/<tr[\s\S]*?<\/tr>/gi) || []
  for (const row of rows) {
    const cells = row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) || []
    if (cells.length < 2) continue
    const t = cells.map(c => cellText(c))
    let kode = tidy(t[0])
    let judul = tidy(t[1])
    let uraian = tidy(t[2] || '')
    let risiko = normalizeRisk(t[3] || '')
    let perizinan = tidy(t[4] || '')

    if (!/^[A-Z]?\d{4,5}$/.test(kode)) {
      let detected = ''
      for (let i = 0; i < Math.min(5, t.length); i++) {
        const m = t[i].match(/\b[A-Z]?\d{4,5}\b/)
        if (m) { detected = m[0]; break }
      }
      if (detected) {
        kode = detected
        const cands = []
        for (let i = 0; i < Math.min(3, t.length); i++) {
          if (!t[i].includes(kode) && t[i].length >= 3) cands.push(t[i])
        }
        if (cands.length) judul = cands.sort((a,b) => b.length - a.length)[0]
      }
    }

    if (!kode || !judul) continue

    items.push({ kode, judul, uraian, risiko, perizinan })
  }
  return items
}

async function fetchJsonAll(jsonUrl) {
  const res = await fetch(jsonUrl, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
  if (!res.ok) throw new Error(`Failed JSON ${jsonUrl}: ${res.status}`)
  const j = await res.json()
  const arr = Array.isArray(j) ? j : (Array.isArray(j?.data) ? j.data : (Array.isArray(j?.items) ? j.items : []))
  const out = []
  for (const it of arr) {
    const kode = tidy(String(it?.kode || it?.code || it?.kbli || ''))
    const judul = tidy(String(it?.judul || it?.title || it?.nama || ''))
    const uraian = tidy(String(it?.uraian || it?.description || it?.deskripsi || it?.keterangan || ''))
    const risiko = normalizeRisk(String(it?.risiko || it?.risk || it?.risk_level || it?.tingkat_risiko || ''))
    const perizinan = tidy(String(it?.perizinan || it?.licensing || it?.persyaratan || ''))
    if (kode && judul) out.push({ kode, judul, uraian, risiko, perizinan })
  }
  return out
}

async function fetchHtmlPage(pageUrl) {
  const res = await fetch(pageUrl, { headers: { 'user-agent': 'Mozilla/5.0 KBLI-Scraper' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${pageUrl}`)
  return await res.text()
}

async function scrapeAll() {
  const base = 'https://oss.go.id/informasi/kbli-berbasis-risiko'

  const discovered = await tryDiscoverJsonEndpoint(base)
  if (discovered) {
    console.log('[KBLI] Discovered JSON endpoint:', discovered)
    const jsonItems = await fetchJsonAll(discovered)
    if (jsonItems.length > 0) return jsonItems
  }

  // Discover category URLs from index (A–U)
  let indexHtml = ''
  try {
    indexHtml = await fetchHtmlPage(base)
  } catch (e) {
    console.warn('[KBLI] Failed to load index page, will try direct pagination fallback:', (e && e.message) || e)
  }
  const anchorTags = indexHtml ? (indexHtml.match(/<a [^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi) || []) : []
  const catUrlsSet = new Set()
  for (const a of anchorTags) {
    const m = a.match(/href=["']([^"']+)["']/i)
    const href = m ? m[1] : ''
    if (!href) continue
    if (href.includes('/informasi/kbli-kategori/')) {
      try {
        const abs = new URL(href, base).toString()
        catUrlsSet.add(abs.split('#')[0])
      } catch {}
    }
  }
  let catUrls = Array.from(catUrlsSet)

  // Hardcoded A–U fallback if no category links found on index (site may render via JS)
  if (catUrls.length === 0) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTU'.split('')
    catUrls = letters.map(l => new URL(`/informasi/kbli-kategori/${l}`, base).toString())
    console.log(`[KBLI] Using hardcoded category URLs A–U (${catUrls.length}).`)
  }

  const items = []
  if (catUrls.length > 0) {
    console.log(`[KBLI] Scraping ${catUrls.length} category URLs with pagination...`)
    const MAX_PAGES_PER_CAT = 200
    for (const catUrl of catUrls) {
      for (let page = 1; page <= MAX_PAGES_PER_CAT; page++) {
        const url = page === 1 ? catUrl : `${catUrl}?page=${page}`
        let html = ''
        try {
          html = await fetchHtmlPage(url)
        } catch (e) {
          console.warn(`[KBLI] Error fetching ${url}:`, (e && e.message) || e)
          await sleep(200)
          break
        }
        const rows = parseTableRowsFromHtml(html)
        if (!rows.length) {
          console.log(`[KBLI] ${catUrl} page ${page} has 0 rows, next category.`)
          break
        }
        console.log(`[KBLI] ${catUrl} page ${page}: +${rows.length}`)
        items.push(...rows)
        await sleep(150)
      }
      await sleep(250)
    }
    return items
  }

  console.log('[KBLI] Falling back to index direct pagination (no category links found)...')
  const MAX_PAGES = 400
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = page === 1 ? base : `${base}?page=${page}`
    let html = ''
    try {
      html = await fetchHtmlPage(url)
    } catch (e) {
      console.warn(`[KBLI] Error fetching page ${page}:`, (e && e.message) || e)
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

    await sleep(250)
  }

  return items
}

function dedupeByKode(items) {
  const map = new Map()
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

  if (clean.length < 1200 || clean.length > 3000) {
    console.warn('[KBLI] Warning: unexpected total count:', clean.length)
  }

  if (clean.length < 1000) {
    console.warn('[KBLI] Not saving file because record count is too low (<1000). Keeping existing local data if any.')
    return
  }

  const outDir = resolve(process.cwd(), 'server', 'data')
  const outFile = resolve(outDir, 'kbli.json')
  await mkdir(outDir, { recursive: true })
  await writeFile(outFile, JSON.stringify(clean, null, 2), 'utf-8')
  console.log(`[KBLI] Saved ${clean.length} KBLI records to server/data/kbli.json`)
}

main().catch(err => {
  console.error('[KBLI] Scrape failed:', err)
  process.exitCode = 1
})
