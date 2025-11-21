// server/utils/keyword-job.ts
// Read keywords from data\keywords\YYYY-MM-DD and generate cached blog posts using AI
// Image is placed on top of content (handled by AI utils). Posts are stored in data\blog via blog-cache.

import { promises as fs } from 'fs'
import path from 'path'
import { listCachedPosts, savePostToCache, type CachedPost } from './blog-cache.js'
import { generatePlaceholderPostBySlug, buildAiHeroUrl } from './ai.js'
import { pickAuthorForSlug } from './authors.js'
// WordPress integration removed - using ChatGPT only
import { appendGeneratedBlogs, listGeneratedBlogs, type GeneratedBlogRecord } from './generated-blogs.js'
import { ensureHeroImage, normalizeTitle } from './blog-normalize.js'
import { AIContentGenerator } from './ai-content-generator'

// Daily generation count (default 20). Can be overridden via env.
const DEFAULT_DAILY_COUNT = Math.min(Math.max(parseInt(process.env.NUXT_KEYWORD_DAILY_COUNT || '20', 10) || 20, 1), 50)

// Enable REAL AI generation using OpenAI GPT-4o-mini
const USE_REAL_AI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 50 && process.env.OPENAI_API_KEY.startsWith('sk-')

// AI Content Generator instance (lazy initialized)
let aiGenerator: AIContentGenerator | null = null

// Initialize AI Generator
function getAIGenerator(): AIContentGenerator {
  if (!aiGenerator) {
    aiGenerator = new AIContentGenerator()
  }
  return aiGenerator
}

function normalizeKw(s: string): string {
  return String(s || '').replace(/\s+/g, ' ').trim()
}

function hashString(input: string): number {
  let h = 2166136261 >>> 0 // FNV-1a
  for (let i = 0; i < input.length; i++) { h ^= input.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function shuffleInPlace<T>(arr: T[], seed: string): T[] {
  const rnd = mulberry32(hashString(seed))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp
  }
  return arr
}

function todayDateStr(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function keywordsDirFor(dateStr: string): string {
  return path.join(process.cwd(), 'data', 'keywords', dateStr)
}

function isTxtFile(file: string): boolean {
  return /\.txt$/i.test(file)
}

function isDoneFile(file: string): boolean {
  return /\.done(\.txt)?$/i.test(file)
}

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\d+/g, '') // hilangkan angka acak dari slug dasar
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function readLines(filePath: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return raw
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

// Ensure tags always 12 items, deduped and relevant
function buildTags(keyword: string, aiTags: string[], categories: string[]): string[] {
  const MIN = 12
  const MAX = 12
  const norm = (s: string) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ')
  const stop = new Set(['dan','atau','untuk','yang','adalah','via','di','ke','dengan','pakai','murah','cara','blog','artikel'])

  const base: string[] = []
  // from AI tags
  for (const t of (aiTags || [])) {
    const v = norm(t)
    if (!v || stop.has(v)) continue
    if (!base.includes(v)) base.push(v)
  }
  // from categories
  for (const c of (categories || [])) {
    const v = norm(c)
    if (!v || stop.has(v) || v === 'blog') continue
    if (!base.includes(v)) base.push(v)
  }
  // from keyword tokens
  const kwTokens = String(keyword || '').toLowerCase().split(/\s+/).map(w => w.trim()).filter(w => w && !stop.has(w))
  for (const w of kwTokens) {
    if (!base.includes(w)) base.push(w)
  }
  // safe fallback pool - expanded for 12 tags
  const pool = ['paypal','jasa pembayaran','top up','transfer','verifikasi','keamanan','belanja online','kartu kredit','e-commerce','digital','bitcoin','crypto','blockchain','trading','investasi','banking','mobile','app','web','api','cloud','ai','PAYTECH','online']
  if (base.length < MIN) {
    for (const p of pool) {
      const v = norm(p)
      if (!base.includes(v)) base.push(v)
      if (base.length >= MIN) break
    }
  }
  return base.slice(0, MAX)
}

// Build SEO-friendly title: keyword at the beginning, ideally 50–60 chars, max 70 chars
function buildSeoFriendlyTitle(mainKeyword: string, existingTitle?: string): string {
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
  const clean = (s: string) => String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const titleCase = (s: string) => clean(s)
    .split(' ')
    .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w)
    .join(' ')

  const MAX_LEN = 70
  const TARGET_MIN = 50
  const TARGET_MAX = 60

  const kwRaw = clean(mainKeyword)
  const kwTC = titleCase(kwRaw)

  let base = clean(existingTitle || '')

  // Strip trailing random numbers/suffixes (e.g., "... 12", "...-3", "Part 2")
  if (base) {
    base = base
      .replace(/(?:[-—–:])*\s*(?:bagian|part|episode|ep|page)?\s*\d{1,4}\s*$/i, '')
      .replace(/[\s:—–-]+$/g, '')
      .trim()
  }

  const startsWithKw = (t: string, kw: string) => t.toLowerCase().startsWith(kw.toLowerCase())
  const containsKw = (t: string, kw: string) => t.toLowerCase().includes(kw.toLowerCase())

  if (!base) {
    base = kwTC
  } else if (!startsWithKw(base, kwRaw) && !startsWithKw(base, kwTC)) {
    // If keyword appears later, avoid duplication in the suffix
    let rest = base
    if (containsKw(base, kwRaw)) {
      const re = new RegExp(kwRaw.replace(/[-/\\^$*+?.()|[\]{}]/g, ''), 'i')
      rest = clean(base.replace(re, '').replace(/\s{2,}/g, ' '))
    } else if (containsKw(base, kwTC)) {
      const re = new RegExp(kwTC.replace(/[-/\\^$*+?.()|[\]{}]/g, ''), 'i')
      rest = clean(base.replace(re, '').replace(/\s{2,}/g, ' '))
    }
    base = rest ? `${kwTC}: ${rest}` : kwTC
  } else {
    // Ensure proper casing at start
    if (!startsWithKw(base, kwTC)) {
      // Replace the starting segment with title-cased keyword
      const parts = base.split(/[:\-—–]|\s{2,}/)
      if (parts.length > 0) {
        const first = clean(parts[0])
        if (first && containsKw(first, kwRaw)) {
          base = kwTC + base.slice(first.length)
        }
      }
    }
  }

  // Helper to safely trim to max without cutting last word
  const safeTrim = (t: string, max: number) => {
    if (t.length <= max) return t
    let cut = t.slice(0, max)
    cut = cut.replace(/\s+[\S]*$/, '')
    return cut.trim()
  }

  // If too long, trim to MAX_LEN
  base = safeTrim(base, MAX_LEN)

  // If too short, append concise Indonesian SEO suffixes until within target range
  const suffixes = [
    'Panduan Lengkap',
    'Tips & Cara',
    'Mudah dan Cepat',
    'Terbaru 2025',
    'Aman dan Terpercaya',
    'Untuk Pemula',
    'Langkah demi Langkah'
  ]

  const wordCount = (t: string) => clean(t).split(' ').filter(Boolean).length

  let i = 0
  while ((base.length < TARGET_MIN || wordCount(base) < 6) && i < suffixes.length) {
    const sep = base.includes(':') ? ' ' : ' — '
    const candidate = `${base}${sep}${suffixes[i]}`
    if (candidate.length <= MAX_LEN) {
      base = candidate
    }
    i++
  }

  // Ensure final length within MAX
  base = safeTrim(base, MAX_LEN)

  return base
}

export type KeywordSource = {
  file: string
  keywords: string[]
}

// --- Content length helpers and generators ---
function stripHtml(input: string): string {
  return String(input || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
function wordCount(input: string): number {
  return stripHtml(input).split(/\s+/).filter(Boolean).length
}
function makeExcerptFromContent(content: string, maxWords = 40): string {
  const text = stripHtml(content)
  const words = text.split(/\s+/).filter(Boolean)
  const slice = words.slice(0, maxWords).join(' ')
  return `<p>${slice}${words.length > maxWords ? '…' : ''}</p>`
}
function randInt(min: number, max: number): number { // inclusive
  const a = Math.ceil(min)
  const b = Math.floor(max)
  return Math.floor(Math.random() * (b - a + 1)) + a
}
function paragraphFor(keyword: string): string {
  const kw = String(keyword || '').toLowerCase()
  const leads = ['Dalam panduan ini', 'Artikel ini membahas', 'Jika Anda mencari informasi tentang', 'Di bawah ini kami ulas', 'Secara ringkas dan jelas']
  const verbs = ['menggunakan', 'memahami', 'mengoptimalkan', 'memanfaatkan', 'menerapkan']
  const benefits = ['aman', 'cepat', 'terpercaya', 'efisien', 'hemat biaya', 'praktis']
  const contexts = ['bisnis online', 'transaksi digital', 'pembayaran internasional', 'belanja lintas negara', 'pengelolaan keuangan digital']
  const closers = ['Langkah-langkahnya tidak sulit jika diikuti dengan benar.', 'Fokus pada keamanan dan kepatuhan agar hasilnya maksimal.', 'Dengan pendekatan yang tepat, hasil dapat meningkat signifikan.', 'Pemahaman dasar akan memudahkan proses praktis.', 'Tips kecil sering memberi dampak besar.']
  const pick = (arr: string[]) => arr[randInt(0, arr.length - 1)]
  const sentences: string[] = []
  sentences.push(`${pick(leads)}, ${kw} menjadi solusi ${pick(benefits)} untuk ${pick(contexts)}.`)
  sentences.push(`Dengan ${kw}, Anda dapat ${pick(verbs)} proses secara lebih ${pick(benefits)} tanpa langkah yang rumit.`)
  sentences.push(`Agar hasil optimal, pahami dulu konsep dasar ${kw} serta praktik terbaiknya dalam keseharian.`)
  sentences.push(`Gunakan panduan terstruktur, ukur hasilnya, lalu perbaiki secara bertahap untuk memastikan ${kw} berjalan konsisten.`)
  sentences.push(pick(closers))
  return `<p>${sentences.join(' ')}</p>`
}
function buildLongFormArticle(keyword: string, targetMin = 500, targetMax = 800): string {
  const kwTitle = (s: string) => String(s || '').split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(' ')
  const kw = String(keyword || '').trim() || 'Layanan Digital'
  const target = randInt(Math.max(500, targetMin), Math.max(targetMin, targetMax))
  const parts: string[] = []

  // Struktur sesuai spesifikasi: Pendahuluan, Tentang Layanan, Keunggulan, Cara Menggunakan, Tips & FAQ, Kesimpulan
  parts.push(`<h2>Pendahuluan</h2>`)
  parts.push(paragraphFor(kw))
  parts.push(paragraphFor(kw))

  parts.push(`<h2>Tentang Layanan</h2>`)
  parts.push(paragraphFor(kw))
  parts.push(paragraphFor(kw))

  parts.push(`<h2>Keunggulan</h2>`)
  parts.push('<ul>' +
    ['Meningkatkan efisiensi proses', 'Memperkuat keamanan transaksi', 'Memperluas jangkauan pasar', 'Menghemat waktu dan biaya', 'Dukungan pelanggan yang responsif']
      .map(it => `<li>${it}</li>`).join('') + '</ul>')
  parts.push(paragraphFor(kw))

  parts.push(`<h2>Cara Menggunakan</h2>`)
  parts.push('<ol>' +
    ['Siapkan akun dan verifikasi data', 'Atur preferensi keamanan', 'Lakukan transaksi uji coba', 'Evaluasi hasil dan perbaiki', 'Terapkan otomatisasi seperlunya']
      .map(it => `<li>${it}</li>`).join('') + '</ol>')
  parts.push(paragraphFor(kw))

  parts.push(`<h2>Tips & FAQ</h2>`)
  parts.push(paragraphFor(kw))
  const faqs = [
    [`Apa itu ${kw}?`, `${kw} adalah layanan/solusi yang membantu proses menjadi lebih aman dan efisien. Prinsipnya menggabungkan kemudahan penggunaan dengan kontrol yang jelas.`],
    [`Apakah ${kw} aman?`, `Selama mengikuti praktik terbaik keamanan dan verifikasi, ${kw} dapat digunakan secara aman untuk kebutuhan pribadi maupun bisnis.`],
    [`Bagaimana cara memulai dengan ${kw}?`, `Mulailah dengan membuat akun, lengkapi profil, aktifkan fitur keamanan, lalu lakukan uji coba transaksi kecil untuk memahami alurnya.`]
  ]
  for (const [q, a] of faqs) {
    parts.push(`<h3>${q}</h3>`)
    parts.push(`<p>${a}</p>`)
  }

  parts.push(`<h2>Kesimpulan</h2>`)
  parts.push(`<p>${kwTitle(kw)} layak dipertimbangkan untuk kebutuhan harian maupun bisnis. Mulai dari perencanaan, implementasi, hingga evaluasi, kedisiplinan dalam mengikuti praktik terbaik akan membantu Anda mendapatkan hasil yang konsisten dan berkelanjutan.</p>`)
  parts.push(`<p><strong>Ayo mulai</strong> mengoptimalkan ${kw} hari ini. Jika Anda butuh bantuan, tim kami siap memberikan pendampingan.</p>`)

  let html = parts.join('\n')
  while (wordCount(html) < target && parts.length < 200) {
    // Tambah paragraf sampai melampaui target kata
    const extra = paragraphFor(kw)
    parts.push(extra)
    html = parts.join('\n')
  }
  return html
}
function ensureContentLength(baseContent: string, keyword: string): string {
  const targetMin = 500 // enforce 500 kata minimum sesuai spesifikasi
  const current = wordCount(baseContent)
  if (current >= targetMin) return baseContent
  // Target 500–800 kata sesuai spesifikasi
  return buildLongFormArticle(keyword, 500, 800)
}

// --- Content sanitizer: illegal phrases + external contacts/links + promo ---
const ILLEGAL_PATTERNS: RegExp[] = [
  /verifikasi\s*paypal/i,
  /pencairan\s*dana\s*paypal/i,
]

function containsIllegal(input?: string): boolean {
  const s = String(input || '')
  return ILLEGAL_PATTERNS.some(r => r.test(s))
}

function replaceIllegalPhrases(text?: string): string {
  let t = String(text || '')
  const replacements: { pattern: RegExp; value: string }[] = [
    { pattern: /verifikasi\s*paypal/gi, value: 'keamanan akun PayPal' },
    { pattern: /pencairan\s*dana\s*paypal/gi, value: 'penarikan saldo PayPal sesuai kebijakan' },
  ]
  for (const { pattern, value } of replacements) {
    t = t.replace(pattern, value)
  }
  return t
}

function buildSafeFallbackTitle(keyword?: string): string {
  const kw = String(keyword || '')
  if (/verifikasi\s*paypal/i.test(kw)) {
    return 'Keamanan Akun PayPal: Tips & Praktik Aman'
  }
  if (/pencairan\s*dana\s*paypal/i.test(kw)) {
    return 'Penarikan Saldo PayPal yang Aman: Panduan & Kebijakan'
  }
  return 'Panduan Pembayaran Online yang Aman & Terpercaya'
}

// Sanitize external phone numbers, emails, and non-domain links; force promo WhatsApp
const OFFICIAL_WHATSAPP_DISPLAY = '0898-8888-250'
const OFFICIAL_WHATSAPP_PLAIN = '0898888250'
const OFFICIAL_WHATSAPP_LINK = 'https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com%2C%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0'
const OFFICIAL_EMAIL = 'info@jasapembayaran.com'
const OFFICIAL_DOMAIN = 'jasapembayaran.com'

function sanitizeContactsAndLinks(text?: string): string {
  let t = String(text || '')
  if (!t.trim()) return t

  // Replace phone numbers (except our own) with official WhatsApp
  t = t.replace(/(\+62|62|0)\s?[\d\- ]{7,}/g, (match) => {
    const digits = match.replace(/[^\d]/g, '')
    if (digits.endsWith(OFFICIAL_WHATSAPP_PLAIN)) {
      return OFFICIAL_WHATSAPP_DISPLAY
    }
    return OFFICIAL_WHATSAPP_DISPLAY
  })

  // Replace email addresses with official email
  t = t.replace(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/g, () => OFFICIAL_EMAIL)

  // Replace external URLs (non jasapembayaran.com) with official domain
  t = t.replace(/https?:\/\/[^\s"'<>]+/g, (url) => {
    if (url.includes(OFFICIAL_DOMAIN)) return url
    return `https://${OFFICIAL_DOMAIN}`
  })
  t = t.replace(/\bwww\.[^\s"'<>]+/gi, (url) => {
    if (url.includes(OFFICIAL_DOMAIN)) return url
    return OFFICIAL_DOMAIN
  })

  return t
}

function appendPromoCta(html: string, keyword: string): string {
  const base = String(html || '')
  const promo = `<p><strong>Promo khusus:</strong> Untuk konsultasi dan bantuan cepat terkait ${keyword}, Anda dapat langsung chat WhatsApp kami di <a href="${OFFICIAL_WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">${OFFICIAL_WHATSAPP_DISPLAY}</a>. Tim JasaPembayaran.com siap membantu Anda setiap hari.</p>`
  if (base.includes(OFFICIAL_WHATSAPP_PLAIN) || base.includes(OFFICIAL_WHATSAPP_DISPLAY)) {
    return sanitizeContactsAndLinks(base)
  }
  return sanitizeContactsAndLinks(base + '\n' + promo)
}

function sanitizeTitleAndContent(title: string, content: string, keyword: string): { title: string, content: string } {
  const illegalInKw = containsIllegal(keyword)
  let safeTitle = String(title || '')
  let safeContent = String(content || '')

  // Replace illegal phrases & external contacts/links in content
  safeContent = replaceIllegalPhrases(safeContent)
  safeContent = appendPromoCta(safeContent, keyword)

  // If title contains illegal phrase or keyword is illegal, override with safe fallback
  if (containsIllegal(safeTitle) || illegalInKw) {
    safeTitle = buildSafeFallbackTitle(keyword)
  }

  return { title: safeTitle, content: safeContent }
}

// Default in-code keywords (8 examples) used when no files are present for the date
export const DEFAULT_KEYWORDS: string[] = [
  'jasa paypal',
  'jasa bayar paypal',
  'jasa transfer paypal',
  'jasa domain namecheap',
  'jasa namecheap',
  'jasa top up paypal',
  'jasa verifikasi paypal',
  'jasa domain namesilo',
  'via paypal',
  'paypal adalah',
  'saldo paypal',
  'beli saldo paypal',
  'topup paypal',
  'jual saldo paypal',
  'jasa top up paypal',
  'jasa kartu kredit',
  'cara top up paypal',
  'jasa pembayaran kartu kredit',
  'jasa paypal terpercaya',
  'jual paypal',
  'cara buat akun paypal',
  'jasa transfer paypal',
  'jasa pembayaran',
  'top up saldo paypal',
  'cara bikin paypal',
  'jasa bayar kartu kredit',
  'cara membuat paypal',
  'temanpay',
  'jasapembayaran',
  'jual beli paypal',
  'jual beli saldo paypal',
  'cara mengisi saldo paypal',
  'jasabayar',
  'cara buat paypal',
  'pembayaran paypal',
  'beli paypal murah',
  'cara menggunakan paypal',
  'jasa bayar',
  'akun paypal',
  'jasa bayar patreon',
  'paypal di indonesia',
  'jasa pembayaran online',
  'jasa pembayaran visa',
  'jasa pembayaran luar negeri',
  'cara bayar paypal',
  'top up paypal murah',
  'jasa bayar pakai kartu kredit',
  'bayar pakai paypal',
  'kartu debit untuk paypal',
  'cara bayar pakai paypal',
  'jasa pembayaran mastercard',
  'jasa paypall',
  'aplikasi paypal',
  'cara pakai paypal',
  'belanja pakai paypal',
  'jasa pembayaran online luar negeri',
  'jual paypal ke rupiah',
  'buat paypal',
  'akun paypal adalah',
  'akun paypal indonesia',
  'akun paypal tanpa kartu kredit',
  'aplikasi paypal adalah',
  'aplikasi paypal indonesia',
  'aplikasi pembayaran paypal',
  'arti akun paypal',
  'arti kata paypal',
  'arti pay pal',
  'arti paypal indonesia',
  'balance paypal adalah',
  'bayar akun netflix',
  'bayar amazon dengan paypal',
  'bayar dengan paypal',
  'bayar ebay',
  'bayar lewat paypal',
  'bayar melalui paypal',
  'bayar menggunakan paypal',
  'bayar netflix dengan paypal',
  'bayar netflix pakai paypal',
  'bayar pakai visa',
  'bayar patreon',
  'bayar paypal',
  'bayar paypal di alfamart',
  'bayar paypal tanpa kartu kredit',
  'bayar via paypal',
  'bayar visa tanpa kartu kredit',
  'bayar zoom dengan paypal',
  'belanja bayar pakai paypal',
  'belanja dengan paypal',
  'belanja dengan paypal di indonesia',
  'belanja lewat paypal',
  'belanja luar negeri tanpa kartu kredit',
  'belanja menggunakan paypal',
  'belanja online bayar pakai paypal',
  'belanja online dengan kartu kredit',
  'belanja online dengan paypal',
  'belanja online dengan paypal di indonesia',
  'belanja online kartu kredit',
  'belanja online luar negeri tanpa kartu kredit',
  'belanja online menggunakan paypal',
  'belanja online pakai paypal',
  'belanja online paypal',
  'belanja online via paypal',
  'belanja pakai paypal di indonesia',
  'belanja pake paypal',
  'belanja paypal',
  'belanja paypal tanpa kartu kredit',
  'belanja via paypal',
  'beli akun paypal',
  'beli akun paypal verified',
  'beli barang dengan paypal',
  'beli barang pakai paypal',
  'beli dengan paypal',
  'beli pakai paypal',
  'beli pake paypal',
  'beli paypal saldo',
  'beli paypal terpercaya',
  'beli paypall',
  'beli saldo paypal tanpa minimum',
  'beli saldo paypal terpercaya',
  'belipaypal',
  'bikin akun paypal tanpa kartu kredit',
  'bikin paypal',
  'bikin paypal tanpa kartu kredit',
  'bikin paypall',
  'buat akun pay pal',
  'buat akun paypal baru',
  'buat akun paypal indonesia',
  'buat akun paypal tanpa kartu kredit',
  'buat akun paypal tanpa rekening',
  'buat paypal dengan kartu debit',
  'buat paypal indonesia',
  'buat paypal tanpa kartu kredit',
  'buat rekening paypal',
  'buat rekening paypal tanpa kartu kredit',
  'cara akun paypal',
  'cara apply paypal',
  'cara bayar dengan mastercard',
  'cara bayar dengan paypal',
  'cara bayar dengan paypal tanpa kartu kredit',
  'cara bayar di paypal',
  'cara bayar ke paypal',
  'cara bayar lewat paypal',
  'cara bayar lewat paypal tanpa kartu kredit',
  'cara bayar lewat visa',
  'cara bayar mastercard',
  'cara bayar melalui paypal',
  'cara bayar menggunakan paypal',
  'cara bayar menggunakan visa',
  'cara bayar netflix dengan paypal',
  'cara bayar netflix pakai paypal',
  'cara bayar online dengan visa',
  'cara bayar pakai mastercard',
  'cara bayar pakai paypal tanpa kartu kredit',
  'cara bayar pakai visa',
  'cara bayar paypal dengan debit card',
  'cara bayar paypal dengan kartu debit',
  'cara bayar paypal di alfamart',
  'cara bayar paypal tanpa kartu kredit',
  'cara bayar via paypal',
  'cara bayar via paypal tanpa kartu kredit',
  'cara bayar visa tanpa kartu kredit',
  'cara bayar zoom dengan paypal',
  'cara belanja dengan paypal',
  'cara belanja di luar negeri tanpa kartu kredit',
  'cara belanja di paypal',
  'cara belanja menggunakan paypal',
  'cara belanja menggunakan paypal tanpa kartu kredit',
  'cara belanja online dengan paypal',
  'cara belanja online luar negeri tanpa kartu kredit',
  'cara belanja pakai paypal',
  'cara belanja paypal',
  'cara beli barang dari luar negeri tanpa kartu kredit',
  'cara beli barang luar negeri tanpa kartu kredit',
  'cara beli dengan paypal',
  'cara beli pakai paypal',
  'cara beli paypal',
  'cara beli paypal tanpa kartu kredit',
  'cara beli saldo paypal',
  'cara bikin account paypal tanpa kartu kredit',
  'cara bikin akun pay pal',
  'cara bikin akun paypal tanpa kartu kredit',
  'cara bikin akun paypal tanpa rekening',
  'cara bikin kartu paypal',
  'cara bikin paypal tanpa kartu kredit',
  'cara buat account paypal',
  'cara buat account paypal tanpa kartu kredit',
  'cara buat akun paypal indonesia',
  'cara buat akun paypal tanpa kartu kredit',
  'cara buat akun paypal tanpa rekening',
  'cara buat email paypal',
  'cara buat kartu paypal',
  'cara buat paypal indonesia',
  'cara buat paypal tanpa kartu kredit',
  'cara buat paypal tanpa rekening',
  'cara buat rekening paypal tanpa kartu kredit',
  'cara daftar akun paypal tanpa kartu kredit',
  'cara gunakan paypal',
  'cara gunakan paypal tanpa kartu kredit',
  'cara jual saldo paypal',
  'cara melakukan pembayaran dengan paypal',
  'cara melakukan pembayaran melalui paypal',
  'cara melakukan pembayaran menggunakan paypal',
  'cara melakukan pembayaran paypal',
  'cara melakukan pembayaran paypal tanpa kartu kredit',
  'cara melakukan pembayaran via paypal',
  'cara memakai paypal',
  'cara memakai paypal di indonesia',
  'cara membayar dengan mastercard',
  'cara membayar dengan paypal',
  'cara membayar dengan paypal tanpa kartu kredit',
  'cara membayar di paypal',
  'cara membayar lewat paypal',
  'cara membayar melalui paypal',
  'cara membayar menggunakan paypal',
  'cara membayar menggunakan paypal tanpa kartu kredit',
  'cara membayar pakai paypal',
  'cara membayar paypal',
  'cara membayar paypal dengan rekening bank',
  'cara membayar paypal tanpa kartu kredit',
  'cara membayar tagihan paypal',
  'cara membayar via paypal',
  'cara membayar visa tanpa kartu kredit',
  'cara membayar zoom dengan paypal',
  'cara membeli barang dengan paypal',
  'cara membeli dengan paypal',
  'cara membeli menggunakan paypal',
  'cara membeli paypal',
  'cara membeli saldo paypal',
  'cara membuat account paypal tanpa credit card',
  'cara membuat account paypal tanpa kartu kredit',
  'cara membuat akun di paypal',
  'cara membuat akun pay pal',
  'cara membuat akun paypal dengan kartu debit',
  'cara membuat akun paypal tanpa kartu kredit',
  'cara membuat akun paypal tanpa rekening',
  'cara membuat aplikasi paypal',
  'cara membuat dan menggunakan paypal',
  'cara membuat kartu debit paypal',
  'cara membuat kartu kredit paypal',
  'cara membuat kartu paypal',
  'cara membuat pay pal',
  'cara membuat paypal di indonesia',
  'cara membuat paypal indonesia',
  'cara membuat paypal tanpa kartu kredit',
  'cara membuat paypal tanpa rekening',
  'cara membuat pembayaran melalui paypal',
  'cara memiliki akun paypal',
  'cara memiliki akun paypal tanpa kartu kredit',
  'cara memiliki paypal',
  'cara memiliki paypal tanpa kartu kredit',
  'cara mempunyai paypal',
  'cara mendaftar akun paypal tanpa kartu kredit',
  'cara menerima pembayaran dari kartu kredit',
  'cara menerima pembayaran dengan kartu kredit',
  'cara menerima pembayaran kartu kredit',
  'cara menggunakan akun paypal',
  'cara menggunakan aplikasi paypal',
  'cara menggunakan mastercard',
  'cara menggunakan pay pal',
  'cara menggunakan paypal di indonesia',
  'cara menggunakan paypal tanpa kartu kredit',
  'cara menggunakan paypal untuk belanja online',
  'cara menggunakan paypal untuk pembayaran',
  'cara menggunakan pembayaran paypal',
  'cara menggunakan saldo paypal',
  'cara menggunakan uang di paypal',
  'cara mengirim uang ke paypal tanpa kartu kredit',
  'cara mengisi saldo di paypal',
  'cara mengisi saldo paypal tanpa kartu kredit',
  'cara menjual saldo paypal',
  'cara pakai aplikasi paypal',
  'cara pakai paypal di indonesia',
  'cara pakai paypal tanpa kartu kredit',
  'cara paypal',
  'cara paypal tanpa kartu kredit',
  'cara pembayaran dengan mastercard',
  'cara pembayaran dengan paypal',
  'cara pembayaran lewat paypal',
  'cara pembayaran lewat visa',
  'cara pembayaran mastercard',
  'cara pembayaran melalui paypal',
  'cara pembayaran melalui visa',
  'cara pembayaran menggunakan paypal',
  'cara pembayaran menggunakan visa',
  'cara pembayaran online dengan kartu kredit',
  'cara pembayaran online ke luar negeri',
  'cara pembayaran online luar negeri',
  'cara pembayaran pakai paypal',
  'cara pembayaran pay pal',
  'cara pembayaran paypal dengan debit',
  'cara pembayaran paypal tanpa kartu kredit',
  'cara pembayaran via paypal',
  'cara pembuatan paypal',
  'cara penggunaan paypal',
  'cara pengisian saldo paypal',
  'cara pinjam saldo paypal',
  'cara punya akun paypal',
  'cara punya akun paypal tanpa kartu kredit',
  'cara punya paypal',
  'cara punya paypal tanpa kartu kredit',
  'cara saldo paypal',
  'cara top up akun paypal',
  'cara top up balance paypal',
  'cara top up dengan paypal',
  'cara top up di paypal',
  'cara top up ke paypal',
  'cara top up pake paypal',
  'cara top up paypal balance',
  'cara top up paypal dengan kartu kredit',
  'cara top up paypal indonesia',
  'cara top up paypal tanpa kartu kredit',
  'cara top up saldo paypal',
  'cara transaksi dengan paypal',
  'cara transaksi di paypal',
  'cara transaksi lewat paypal',
  'cara transaksi menggunakan paypal',
  'cara transaksi pakai paypal',
  'cara transaksi paypal',
  'cara transaksi paypal tanpa kartu kredit',
  'cara transaksi via paypal',
  'cara transfer ke paypal tanpa kartu kredit',
  'cara transfer visa mastercard',
  'cara vcc paypal',
  'cara verif paypal',
  'contoh akun paypal',
  'contoh paypal',
  'contoh saldo paypal',
  'credit card luar negeri',
  'daftar akun paypal tanpa kartu kredit',
  'daftar paypal indonesia tanpa kartu kredit',
  'debit card yang bisa untuk paypal',
  'debit untuk paypal',
  'deposit saldo paypal',
  'harga vcc paypal',
  'id akun paypal',
  'jasa akun paypal',
  'jasa bayar credit card',
  'jasa bayar id',
  'jasa bayar online',
  'jasa bayar paypal murah',
  'jasa bayar skrill',
  'jasa bayar visa',
  'jasa beli paypal',
  'jasa beli saldo paypal',
  'jasa cc',
  'jasa jual beli paypal',
  'jasa jual saldo paypal',
  'jasa limit paypal',
  'jasa mastercard',
  'jasa patreon',
  'jasa paypal indonesia',
  'jasa paypal murah',
  'jasa pembayaran cc',
  'jasa pembayaran credit card',
  'jasa pembayaran dengan kartu kredit',
  'jasa pembayaran online terpercaya',
  'jasa pembayaran online via kartu kredit',
  'jasa pembayaran patreon',
  'jasa pembayaran paypal 24 jam',
  'jasa pembayaran paypal murah',
  'jasa pembayaran paypal terpercaya',
  'jasa pembayaran skrill',
  'jasa pembayaran via kartu kredit',
  'jasa pembayaran via paypal',
  'jasa pembelian kartu kredit',
  'jasa pembelian paypal',
  'jasa pengisian saldo paypal',
  'jasa saldo paypal',
  'jasa sewa kartu kredit',
  'jasa top up saldo paypal',
  'jasa vcc paypal',
  'jasa verif paypal',
  'jasa virtual credit card',
  'jasapaypal',
  'jenis kartu paypal',
  'jenis paypal',
  'jual account paypal verified',
  'jual akun paypal',
  'jual akun paypal verified',
  'jual balance paypal',
  'jual beli balance paypal',
  'jual beli dollar paypal',
  'jual beli paypal indonesia',
  'jual beli paypal terpercaya',
  'jual beli saldo paypal terpercaya',
  'jual credit card',
  'jual dollar paypal',
  'jual kartu kredit virtual',
  'jual paypal terpercaya',
  'jual saldo',
  'jual saldo paypal terpercaya',
  'jual virtual credit card',
  'jualpaypal',
  'jualsaldo',
  'kartu debit tidak bisa paypal',
  'kartu debit yang bisa digunakan untuk paypal',
  'kartu debit yang bisa paypal',
  'kartu debit yang bisa untuk paypal',
  'kartu kredit paypal',
  'kartu kredit untuk belanja online',
  'kartu kredit untuk paypal',
  'kartu paypal',
  'kartu paypal adalah',
  'kartu visa online',
  'kredit paypal adalah',
  'layanan paypal',
  'login paypal tanpa kartu kredit',
  'membayar dengan paypal',
  'membayar menggunakan paypal',
  'membayar paypal',
  'membeli paypal',
  'membeli saldo paypal',
  'membuat akun pay pal',
  'membuat akun paypal baru',
  'membuat akun paypal dengan kartu debit',
  'membuat akun paypal indonesia',
  'membuat akun paypal tanpa kartu kredit',
  'membuat kartu paypal',
  'membuat pay pal',
  'membuat paypal tanpa kartu kredit',
  'membuat rekening paypal tanpa kartu kredit',
  'menerima pembayaran kartu kredit',
  'menggunakan paypal',
  'menggunakan paypal di indonesia',
  'menggunakan paypal tanpa kartu kredit',
  'mengisi saldo paypal',
  'menjual saldo paypal',
  'menu paypal',
  'metode paypal',
  'metode pembayaran paypal',
  'metode pembayaran paypal adalah',
  'metode pembayaran visa',
  'pakai paypal di indonesia',
  'pakai paypal tanpa kartu kredit',
  'paypal adalah aplikasi',
  'paypal adalah pembayaran',
  'paypal akun',
  'paypal akun adalah',
  'paypal alfamart',
  'paypal aman',
  'paypal aman atau tidak',
  'paypal aman tidak',
  'paypal amankah',
  'paypal bandung',
  'paypal bayar',
  'paypal bisa digunakan di indonesia',
  'paypal bisa pakai kartu debit',
  'paypal buat akun',
  'paypal cara',
  'paypal cara buat',
  'paypal cara menggunakan',
  'paypal cara pakai',
  'paypal dengan kartu debit',
  'paypal harus pakai kartu kredit',
  'paypal id adalah',
  'paypal indo',
  'paypal indonesia adalah',
  'paypal jasa',
  'paypal jual beli',
  'paypal luar negeri',
  'paypal menggunakan kartu debit',
  'paypal murah',
  'paypal pakai kartu debit',
  'paypal pembayaran',
  'paypal resmi',
  'paypal rupiah',
  'paypal saldo beli',
  'paypal tanpa credit card',
  'paypal tanpa kartu kredit',
  'paypal tanpa rekening',
  'paypal verifikasi',
  'paypalindonesia',
  'pembayaran aliexpress dengan paypal',
  'pembayaran dengan kartu kredit',
  'pembayaran dengan mastercard',
  'pembayaran dengan paypal',
  'pembayaran dengan paypal adalah',
  'pembayaran dengan paypal tanpa kartu kredit',
  'pembayaran dengan visa',
  'pembayaran ebay selain paypal',
  'pembayaran kartu kredit online',
  'pembayaran lewat paypal',
  'pembayaran lewat visa',
  'pembayaran mastercard',
  'pembayaran melalui mastercard',
  'pembayaran melalui paypal',
  'pembayaran melalui paypal adalah',
  'pembayaran melalui visa',
  'pembayaran melalui visa atau mastercard',
  'pembayaran menggunakan kartu kredit',
  'pembayaran menggunakan paypal',
  'pembayaran menggunakan visa',
  'pembayaran online dengan kartu kredit',
  'pembayaran online internasional',
  'pembayaran online selain paypal',
  'pembayaran pakai paypal',
  'pembayaran pake paypal',
  'pembayaran patreon',
  'pembayaran paypal adalah',
  'pembayaran paypal dengan kartu debit',
  'pembayaran paypal di indonesia',
  'pembayaran paypal tanpa kartu kredit',
  'pembayaran via kartu kredit',
  'pembayaran via paypal',
  'pembayaran via paypal adalah',
  'pembayaran via visa',
  'pembayaran visa',
  'pembayaran visa dan mastercard',
  'pembayaran yang menggunakan paypal',
  'pembelian dengan paypal',
  'pembelian menggunakan paypal',
  'pembelian paypal',
  'pembelian saldo paypal',
  'pembuatan paypal',
  'penggunaan paypal',
  'penggunaan paypal di indonesia',
  'pengisian paypal',
  'pengisian saldo paypal',
  'proses pembayaran paypal',
  'rekening paypal adalah',
  'rekening paypal tanpa kartu kredit',
  'saldo paypal adalah',
  'saldo paypal bisa digunakan untuk',
  'saldo paypal terpercaya',
  'sewa kartu kredit',
  'sistem pembayaran paypal',
  'sistem pembayaran paypal adalah',
  'situs paypal',
  'situs resmi paypal',
  'situs web paypal',
  'syarat akun paypal',
  'syarat buat akun paypal',
  'syarat buat paypal',
  'syarat paypal',
  'tagihan paypal',
  'teman pay',
  'tentang aplikasi paypal',
  'terima pembayaran kartu kredit',
  'tidak bisa top up paypal',
  'tidak punya kartu kredit untuk paypal',
  'toko online pembayaran paypal',
  'top up akun paypal',
  'top up bayar pakai paypal',
  'top up dengan paypal',
  'top up pakai paypal',
  'top up paypal dengan kartu kredit',
  'top up paypal tanpa kartu kredit',
  'top up paypal terpercaya',
  'topup paypal indonesia',
  'transaksi dengan paypal',
  'transaksi di paypal',
  'transaksi kartu kredit online',
  'transaksi menggunakan paypal',
  'transaksi online dengan kartu kredit',
  'transaksi online kartu kredit',
  'transaksi paypal',
  'transaksi paypal adalah',
  'transaksi paypal tanpa kartu kredit',
  'transaksi via paypal',
  'vcc indonesia terpercaya',
  'vcc untuk paypal',
  'visa pembayaran',
  'web resmi paypal',
  'daftar paypal',
  'saldopp',
  'beli paypal',
  'jasa cv paypal',
  'cara daftar paypal',
  'cv paypal',
  'vcc mastercard',
  'cara membuat akun paypal',
  'jasa convert paypal ke dana',
  'top up dana via paypal murah',
  'jasa convert paypal',
  'beli saldo dana via paypal',
  'daftar akun paypal',
  'vcc visa',
  'cara transfer ke paypal',
  'daftar paypal indonesia',
  'jual saldo paypal ke dana',
  'beli saldo paypal murah',
  'convert saldo paypal',
  'jual saldo paypal 24 jam',
  'dana ke paypal',
  'cara mendapatkan saldo paypal',
  'jasa tukar paypal ke dana',
  'tukar saldo paypal',
  'cara top up paypal lewat dana',
  'tukar paypal ke rupiah',
  'cv paypal ke dana',
  'cara top up paypal dengan bca',
  'cara mengisi paypal',
  'membuat akun paypal',
  'beli saldo paypal $5',
  'cara transfer paypal',
  'beli saldo paypal $1',
  'aktivasi paypal',
  'aktivasi paypal tanpa kartu kredit',
  'akun pay',
  'akun paypal terverifikasi',
  'akun paypal tidak bisa menerima pembayaran',
  'akun paypal tidak terverifikasi',
  'akun paypal untuk menerima pembayaran',
  'akun paypal verified',
  'akun paypal yang sudah terverifikasi',
  'akunpaypal',
  'alamat paypal',
  'aplikasi convert paypal',
  'aplikasi dapat saldo paypal',
  'aplikasi mendapatkan saldo paypal',
  'aplikasi pay pal',
  'aplikasi saldo paypal',
  'aplikasi top up paypal',
  'arti paypall',
  'artinya paypal',
  'aturan paypal',
  'bank untuk paypal',
  'bank yang bisa paypal',
  'bayar paypal dengan dana',
  'bayar paypal pakai bca',
  'beli balance paypal',
  'beli dana pakai paypal',
  'beli dollar paypal',
  'beli paypal 24 jam',
  'beli paypal dengan pulsa',
  'beli saldo',
  'beli saldo dana dengan paypal',
  'beli saldo paypal $10',
  'beli saldo paypal 24 jam',
  'beli saldo paypal shopee',
  'beli saldo paypal via dana',
  'beli saldo paypal via gopay',
  'beli saldo paypal via ovo',
  'beli saldo paypal via pulsa',
  'beli vcc',
  'beli vcc murah',
  'beli vcc paypal',
  'beli vcc paypal murah',
  'beli vcc untuk paypal',
  'biaya paypal',
  'bonus saldo paypal',
  'buat paypal bca',
  'buy saldo paypal',
  'buypaypal',
  'cara agar akun paypal terverifikasi',
  'cara aktivasi paypal tanpa kartu kredit',
  'cara akun paypal terverifikasi',
  'cara bayar paypal dengan dana',
  'cara bayar paypal dengan mandiri',
  'cara beli saldo dana pakai paypal',
  'cara beli saldo paypal di tokopedia',
  'cara beli vcc paypal',
  'cara bertransaksi dengan paypal',
  'cara bertransaksi menggunakan paypal',
  'cara buat akun paypal tanpa kartu kredit dan vcc',
  'cara buat akun paypal untuk menerima pembayaran',
  'cara buat pay pal',
  'cara buat rekening paypal',
  'cara buat vcc paypal',
  'cara buat vcc untuk verifikasi paypal',
  'cara cari saldo paypal',
  'cara cek saldo di paypal',
  'cara cek saldo paypal',
  'cara cepat dapat saldo paypal',
  'cara cepat mendapatkan saldo paypal',
  'cara convert paypal',
  'cara convert saldo paypal',
  'cara daftar akun paypal',
  'cara daftar aplikasi paypal',
  'cara daftar di paypal',
  'cara daftar di paypal tanpa kartu kredit',
  'cara daftar ke paypal',
  'cara daftar pay pay',
  'cara daftar paypal 2021',
  'cara daftar paypal dengan email',
  'cara daftar paypal di aplikasi',
  'cara daftar paypal indonesia',
  'cara daftar paypal tanpa kartu kredit',
  'cara daftar paypal tanpa kartu kredit dan vcc',
  'cara daftar paypal tanpa rekening',
  'cara daftar rekening paypal',
  'cara daftar rekening paypal tanpa kartu kredit',
  'cara dapat saldo paypal cepat',
  'cara deposit di paypal',
  'cara deposit ke paypal',
  'cara deposit paypal',
  'cara jual paypal',
  'cara kerja pay pal',
  'cara kirim dana ke paypal',
  'cara kirim ke paypal',
  'cara kirim paypal',
  'cara kirim paypal ke paypal',
  'cara kirim paypal tanpa fee',
  'cara kirim saldo ke paypal',
  'cara kirim saldo paypal',
  'cara kirim saldo paypal ke paypal',
  'cara kirim saldo paypal ke rekening',
  'cara kirim uang dari dana ke paypal',
  'cara kirim uang dari paypal ke paypal',
  'cara kirim uang di paypal',
  'cara kirim uang paypal ke paypal',
  'cara konfirmasi paypal',
  'cara konfirmasi pembayaran paypal',
  'cara masuk akun paypal',
  'cara masuk ke akun paypal',
  'cara masuk ke paypal',
  'cara masuk paypal',
  'cara memasukan saldo paypal',
  'cara membeli vcc untuk paypal',
  'cara membuat account paypal',
  'cara membuat akun paypal di aplikasi',
  'cara membuat akun paypal terverifikasi',
  'cara membuat akun paypal verified',
  'cara membuat paypal account',
  'cara membuat paypal bisnis',
  'cara membuat paypal tanpa kartu kredit dan vcc',
  'cara membuat vcc paypal',
  'cara membuat virtual credit card untuk paypal',
  'cara memverifikasi akun paypal',
  'cara memverifikasi akun paypal tanpa kartu kredit',
  'cara memverifikasi akun paypal tanpa kartu kredit dan vcc',
  'cara memverifikasi paypal tanpa kartu kredit dan vcc',
  'cara menambah balance paypal',
  'cara menambah saldo di paypal',
  'cara menambah saldo paypal',
  'cara menambah saldo paypal dengan rekening bank',
  'cara mendaftar paypal tanpa kartu kredit',
  'cara mendapatkan saldo di paypal',
  'cara mendapatkan saldo paypal dengan cepat',
  'cara mendapatkan saldo paypal dengan mudah',
  'cara menerima dana dari paypal',
  'cara menerima saldo paypal',
  'cara mengecek saldo paypal',
  'cara mengembalikan dana paypal',
  'cara menggunakan paypal mandiri',
  'cara menggunakan paypal untuk menerima pembayaran',
  'cara menggunakan vcc paypal',
  'cara mengirim dana ke paypal',
  'cara mengirim paypal',
  'cara mengirim paypal ke dana',
  'cara mengirim saldo paypal',
  'cara mengirim saldo paypal ke paypal lain',
  'cara mengisi akun paypal',
  'cara mengisi balance paypal',
  'cara mengisi dana di paypal',
  'cara mengisi dana ke paypal',
  'cara mengisi dana paypal',
  'cara mengisi paypal balance',
  'cara mengisi paypal dengan bni',
  'cara mengisi paypal dengan dana',
  'cara mengisi paypal dengan mandiri',
  'cara mengisi paypal tanpa kartu kredit',
  'cara mengisi rekening paypal',
  'cara mengisi saldo akun paypal',
  'cara mengisi saldo paypal dari bca',
  'cara mengisi saldo paypal dari rekening bank',
  'cara mengisi saldo paypal dengan bank bca',
  'cara mengisi saldo paypal dengan bank bni',
  'cara mengisi saldo paypal dengan bank mandiri',
  'cara mengisi saldo paypal dengan bni',
  'cara mengisi saldo paypal dengan dana',
  'cara mengisi saldo paypal lewat bca',
  'cara mengisi uang di paypal',
  'cara mengisi uang ke paypal',
  'cara meningkatkan saldo paypal',
  'cara mudah mendapatkan saldo paypal',
  'cara paypal terverifikasi',
  'cara pengisian paypal',
  'cara refund saldo paypal',
  'cara saldo paypal ke dana',
  'cara sign up paypal',
  'cara sign up paypal indonesia',
  'cara tambah saldo di paypal',
  'cara tambah saldo paypal',
  'cara top up dana dari paypal',
  'cara top up dana dengan paypal',
  'cara top up dana lewat paypal',
  'cara top up dana pakai paypal',
  'cara top up dana via paypal',
  'cara top up lewat paypal',
  'cara top up menggunakan paypal',
  'cara top up pakai paypal',
  'cara top up paypal bni',
  'cara top up paypal dengan bni',
  'cara top up paypal dengan dana',
  'cara top up paypal dengan mandiri',
  'cara top up paypal dengan pulsa',
  'cara top up paypal dengan tokopedia',
  'cara top up paypal di tokopedia',
  'cara top up paypal lewat bca',
  'cara top up paypal mandiri',
  'cara top up paypal tokopedia',
  'cara top up saldo paypal dengan bca',
  'cara transfer bank ke paypal',
  'cara transfer dana ke paypal',
  'cara transfer dana paypal',
  'cara transfer dari bank ke paypal',
  'cara transfer dari dana ke paypal',
  'cara transfer dari paypal',
  'cara transfer dari paypal ke paypal',
  'cara transfer dengan paypal',
  'cara transfer di paypal',
  'cara transfer dollar ke paypal',
  'cara transfer ke akun paypal',
  'cara transfer ke rekening paypal',
  'cara transfer melalui paypal',
  'cara transfer menggunakan paypal',
  'cara transfer pakai paypal',
  'cara transfer paypal ke luar negeri',
  'cara transfer paypal ke paypal',
  'cara transfer paypal ke paypal lain',
  'cara transfer paypal tanpa fee',
  'cara transfer rupiah ke paypal',
  'cara transfer saldo ke paypal',
  'cara transfer saldo paypal',
  'cara transfer saldo paypal ke akun dana',
  'cara transfer saldo paypal ke paypal lain',
  'cara transfer uang dari paypal',
  'cara transfer uang dengan paypal',
  'cara transfer uang di paypal',
  'cara transfer uang ke akun paypal',
  'cara transfer uang ke paypal',
  'cara transfer uang ke rekening paypal',
  'cara transfer uang lewat paypal',
  'cara transfer uang melalui paypal',
  'cara transfer uang paypal',
  'cara transfer uang via paypal',
  'cara transfer via paypal',
  'cara tukar dollar paypal ke rupiah',
  'cara tukar saldo paypal',
  'cara tukar saldo paypal ke pulsa',
  'cara vcc paypal gratis',
  'cara verified akun paypal',
  'cara verified paypal',
  'cara verifikasi paypal',
  'cara verifikasi paypal dengan dana',
  'cara verifikasi paypal dengan vcc',
  'cara verifikasi paypal tanpa kartu kredit',
  'cara verifikasi rekening paypal',
  'cara verifikasi vcc paypal',
  'cari saldo paypal',
  'cek id paypal',
  'convert dana ke paypal',
  'convert paypal ke rupiah',
  'convert paypal terpercaya',
  'convert paypal to idr',
  'cv paypal adalah',
  'cv saldo paypal',
  'daftar akun paypal indonesia',
  'daftar aplikasi paypal',
  'daftar dapat saldo paypal',
  'daftar email paypal',
  'daftar paypal dengan dana',
  'daftar paypal dengan email',
  'daftar paypal mandiri',
  'daftar paypal menggunakan email',
  'daftar paypal online',
  'daftar paypal tanpa kartu kredit',
  'daftar paypal tanpa rekening bank',
  'daftar rekening paypal',
  'dana dan paypal',
  'dana ditahan di paypal',
  'dana ditahan paypal',
  'dana paypal ditahan',
  'dana paypal tertahan',
  'dana tertahan di paypal',
  'dapat paypal',
  'dapat saldo paypal',
  'dapatkan saldo paypal',
  'deposit dengan paypal',
  'deposit ke paypal',
  'deposit pakai paypal',
  'dollar ke rupiah paypal',
  'exchange paypal to idr',
  'exchanger paypal indonesia',
  'exchanger paypal terpercaya',
  'free saldo paypal',
  'fungsi vcc paypal',
  'gambar saldo paypal',
  'harga saldo paypal',
  'informasi paypal',
  'jasa aktivasi paypal',
  'jasa bikin akun paypal',
  'jasa buat akun paypal',
  'jasa cairkan paypal',
  'jasa convert paypal ke bank',
  'jasa convert paypal ke rupiah',
  'jasa convert paypal terpercaya',
  'jasa convert saldo paypal',
  'jasa paypal ke dana',
  'jasa pembayaran paypal tokopedia',
  'jasa pembuatan akun paypal',
  'jasa pembuatan paypal',
  'jasa pembuatan vcc paypal',
  'jasa pencairan paypal',
  'jasa penukaran paypal',
  'jasa penukaran paypal ke rupiah',
  'jasa penukaran saldo paypal',
  'jasa tarik paypal',
  'jasa tukar paypal',
  'jasa tukar paypal ke rupiah',
  'jasa tukar saldo paypal',
  'jasa vcc',
  'jasa vcc murah',
  'jasa vcc paypal terpercaya',
  'jasa vcc terpercaya',
  'jasa verifikasi akun paypal',
  'jasa verifikasi paypal terpercaya',
  'jual beli akun paypal',
  'jual beli paypal 24 jam',
  'jual beli paypal murah',
  'jual beli paypal otomatis',
  'jual beli saldo paypal 24 jam',
  'jual paypal 24 jam',
  'jual paypal ke dana',
  'jual paypal murah',
  'jual saldo dana via paypal',
  'jual saldo paypal murah',
  'jual saldo paypal murah dan terpercaya',
  'jual vcc murah',
  'jual vcc paypal',
  'jual vcc paypal murah',
  'kartu kredit gratis untuk verifikasi paypal',
  'kartu kredit virtual untuk paypal',
  'keamanan paypal',
  'kegunaan vcc paypal',
  'ketentuan paypal',
  'keuntungan menggunakan paypal',
  'keuntungan paypal',
  'kirim dana ke paypal',
  'kirim paypal',
  'kirim paypal ke paypal',
  'kirim saldo paypal',
  'kirim saldo paypal ke paypal',
  'kirim uang dengan paypal',
  'kirim uang ke paypal',
  'kirim uang paypal',
  'konfirmasi paypal',
  'konversi paypal',
  'lama pengiriman paypal',
  'limit paypal adalah',
  'limit paypal yang belum verifikasi',
  'limit saldo paypal',
  'maksimal saldo paypal',
  'mandiri paypal',
  'masalah paypal',
  'masuk ke paypal',
  'masuk paypal',
  'masuk paypal indonesia',
  'membuat account paypal',
  'membuat rekening paypal',
  'membuat vcc paypal',
  'menambah saldo paypal',
  'mendaftar paypal tanpa kartu kredit',
  'mendapatkan saldo paypal',
  'menerima pembayaran dari paypal',
  'menerima pembayaran dengan paypal',
  'menerima pembayaran paypal',
  'menerima uang dari paypal',
  'mengirim uang ke paypal',
  'mengisi akun paypal',
  'mengisi paypal',
  'mengisi paypal dengan mandiri',
  'mengisi saldo paypal dari rekening bank',
  'mengisi saldo paypal dengan bca',
  'mengisi saldo paypal dengan dana',
  'minimal kirim saldo paypal',
  'minimal saldo paypal',
  'minimal transfer paypal ke paypal',
  'minta saldo paypal',
  'nomor id paypal',
  'nomor kartu paypal',
  'nomor paypal',
  'paypal account adalah',
  'paypal balance adalah',
  'paypal beli',
  'paypal cara daftar',
  'paypal cara kerja',
  'paypal changer',
  'paypal daftar indonesia',
  'paypal dana ditahan',
  'paypal digunakan untuk',
  'paypal ditahan',
  'paypal hari ini',
  'paypal idr',
  'paypal itu',
  'paypal ke bank',
  'paypal kirim ke dana',
  'paypal kirim uang',
  'paypal mandiri',
  'paypal pribadi',
  'paypal rekening bank',
  'paypal tanpa kartu kredit dan vcc',
  'paypal tanpa rekening bank',
  'paypal tanpa vcc',
  'paypal tanpa verifikasi',
  'paypal tidak bisa digunakan',
  'paypal tidak bisa menerima pembayaran',
  'paypal tidak bisa mengirim pembayaran',
  'paypal tidak bisa transfer',
  'paypal tidak terverifikasi',
  'paypal to idr',
  'paypal untuk menerima uang',
  'paypall daftar',
  'paypall indonesia',
  'pembayaran ditahan paypal',
  'pembayaran paypal artinya',
  'pembayaran paypal ditahan',
  'pembayaran paypal via bca',
  'pembuatan akun paypal',
  'pengalaman menggunakan paypal',
  'pengalaman paypal',
  'pengembalian dana paypal',
  'penjelasan paypal',
  'penukaran paypal',
  'penukaran paypal ke rupiah',
  'penukaran saldo paypal',
  'peraturan paypal',
  'persyaratan membuat paypal',
  'persyaratan paypal',
  'potongan paypal',
  'potongan transaksi paypal',
  'potongan transfer paypal',
  'rate paypal ke rupiah',
  'rekening paypal',
  'rekening untuk paypal',
  'review aplikasi paypal',
  'saldo dana via paypal',
  'saldo ditahan paypal',
  'saldo id',
  'saldo maksimal paypal',
  'saldo minimal paypal',
  'saldo paypal $5',
  'saldo paypal 1000',
  'saldo paypal ditahan',
  'saldo paypal ditahan 24 jam',
  'saldo paypal ke rupiah',
  'saldo paypal murah',
  'saldo paypal tertahan',
  'saldo paypal tidak masuk',
  'saldopp penipu',
  'saya mau jual saldo paypal',
  'situs convert paypal',
  'situs jual beli paypal terpercaya',
  'syarat dan ketentuan paypal',
  'syarat membuat paypal',
  'syarat menggunakan paypal',
  'syarat pembuatan paypal',
  'tambah saldo paypal',
  'tampung saldo paypal',
  'tempat beli saldo paypal terpercaya',
  'tempat beli vcc terpercaya',
  'tempat jual saldo paypal',
  'tempat penukaran paypal',
  'terima pembayaran paypal',
  'tidak bisa mengirim saldo paypal',
  'top up dana dengan paypal',
  'top up dana lewat paypal',
  'top up dana pakai paypal',
  'top up menggunakan paypal',
  'top up paypal bank mandiri',
  'top up paypal bni',
  'top up paypal dengan bca',
  'top up paypal dengan dana',
  'top up paypal dengan mandiri',
  'top up paypal dengan pulsa',
  'top up paypal lewat dana',
  'top up paypal mandiri',
  'top up paypal mandiri online',
  'top up paypal pakai pulsa',
  'top up paypal via mandiri',
  'top up paypal via pulsa',
  'top up saldo dana via paypal',
  'top up saldo paypal dengan dana',
  'top up saldo paypal tokopedia',
  'topup dana via paypal',
  'topup via paypal',
  'transfer bank ke paypal',
  'transfer dana ke paypal',
  'transfer dari bank ke paypal',
  'transfer dari dana ke paypal',
  'transfer ke paypal dari bni',
  'transfer ke paypal dari mandiri',
  'transfer saldo paypal',
  'transfer uang dari bca ke paypal',
  'transfer uang dari paypal',
  'transfer uang dengan paypal',
  'transfer uang ke paypal',
  'transfer uang lewat paypal',
  'transfer uang paypal',
  'tukar paypal',
  'tukar pulsa ke paypal',
  'tukar saldo paypal ke rupiah',
  'uang dari paypal',
  'uang di paypal',
  'uang ditahan paypal',
  'uang paypal',
  'uang paypal ditahan',
  'vcc murah net',
  'vcc murah paypal',
  'vcc murah terpercaya',
  'vcc paypal adalah',
  'vcc paypal gratis',
  'vcc paypal murah',
  'vcc untuk verifikasi paypal',
  'vcc verifikasi paypal',
  'verifikasi akun paypal',
  'verifikasi akun paypal dengan bank lokal',
  'verifikasi akun paypal tanpa kartu kredit',
  'verifikasi paypal dengan dana',
  'verifikasi paypal dengan vcc',
  'verifikasi paypal indonesia',
  'verifikasi paypal tanpa kartu kredit',
  'verifikasi paypal tanpa kartu kredit dan vcc',
  'verifikasi rekening paypal',
  'verifikasi vcc paypal',
  'viapaypal penipu',
  'viapaypalid',
  'yang dimaksud akun paypal',
  'yang dimaksud dengan paypal',
  'yang dimaksud paypal',
]

// --- Rotation state for DEFAULT_KEYWORDS ---
const ROTATION_STATE_FILE_NEW = path.join(process.cwd(), 'data', 'keyword-state.json')
const ROTATION_STATE_FILE_OLD = path.join(process.cwd(), 'data', 'keyword-rotation.json')

type RotationState = { lastIndex: number } | { index: number }

async function loadRotationIndex(total: number): Promise<number> {
  try {
    if (total <= 0) return 0
    // Prefer new file format { "lastIndex": number } in keyword-state.json; fallback to old { "index": number }
    let raw = ''
    let obj: any = null
    try {
      raw = await fs.readFile(ROTATION_STATE_FILE_NEW, 'utf-8')
      obj = JSON.parse(raw)
    } catch {
      try {
        raw = await fs.readFile(ROTATION_STATE_FILE_OLD, 'utf-8')
        obj = JSON.parse(raw)
      } catch {}
    }
    let lastIndex: number
    if (obj && typeof obj === 'object') {
      if (Number.isFinite((obj as any).lastIndex)) {
        lastIndex = Number((obj as any).lastIndex)
      } else if (Number.isFinite((obj as any).index)) {
        // old format stored next start index; convert to lastIndex semantics
        const oldNext = Number((obj as any).index)
        lastIndex = oldNext - 1
      } else {
        lastIndex = -1
      }
    } else {
      lastIndex = -1
    }
    if (!Number.isFinite(lastIndex)) lastIndex = -1
    if (lastIndex < -1) lastIndex = -1
    if (total > 0) {
      // normalize to [-1, total-1]
      while (lastIndex >= total) lastIndex -= total
      while (lastIndex < -1) lastIndex += total
    }
    // Return the computed start index which is lastIndex + 1 (circular)
    return (lastIndex + 1 + (total > 0 ? 0 : 0)) % total
  } catch {
    return 0
  }
}

async function saveRotationIndex(index: number): Promise<void> {
  try {
    const dir = path.dirname(ROTATION_STATE_FILE_NEW)
    try { await fs.mkdir(dir, { recursive: true }) } catch {}
    // Persist as { lastIndex } where input index is the next start index
    const li = (typeof index === 'number' ? index : Number(index || 0)) - 1
    await fs.writeFile(ROTATION_STATE_FILE_NEW, JSON.stringify({ lastIndex: li }, null, 2), 'utf-8')
  } catch {}
}

export async function collectKeywords(dateStr?: string): Promise<KeywordSource[]> {
  const date = dateStr || todayDateStr()
  const dir = keywordsDirFor(date)
  const out: KeywordSource[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const ent of entries) {
      if (!ent.isFile()) continue
      const fname = ent.name
      if (isDoneFile(fname)) continue
      if (!isTxtFile(fname)) continue
      const full = path.join(dir, fname)
      const lines = await readLines(full)
      const kws: string[] = []
      // Support one keyword per line OR file name as keyword when content is empty
      if (lines.length > 0) kws.push(...lines)
      if (kws.length === 0) {
        const base = fname.replace(/\.txt$/i, '')
        if (base.trim()) kws.push(base.trim())
      }
      if (kws.length > 0) out.push({ file: full, keywords: kws })
    }
  } catch {
    // Directory may not exist — that's fine
  }
  return out
}

async function markDone(filePath: string): Promise<void> {
  try {
    const dest = filePath.replace(/\.txt$/i, '') + '.done.txt'
    await fs.rename(filePath, dest)
  } catch {}
}

export async function runKeywordJobForDate(dateStr?: string, count?: number, publish?: boolean): Promise<{ processed: number, skipped: number, generated: string[] }>{
  const date = dateStr || todayDateStr()
  const limit = Math.min(Math.max(Number(count || DEFAULT_DAILY_COUNT) || DEFAULT_DAILY_COUNT, 1), 50)
  
  // Log AI generation mode
  if (USE_REAL_AI) {
    console.log('🤖 REAL AI Generation Mode: ACTIVE (using OpenAI GPT-4o-mini)')
  } else {
    console.log('📝 Placeholder Generation Mode: ACTIVE (REAL AI disabled - no OpenAI key)')
  }

  // Collect today files; if none, use the full DEFAULT_KEYWORDS list as a virtual source
  const sources = await collectKeywords(date)
  const hasFiles = sources.length > 0
  if (hasFiles) {
    try { sources.sort((a, b) => String(a.file || '').localeCompare(String(b.file || ''), undefined, { sensitivity: 'base' })) } catch {}
  }

  type PoolItem = { kw: string, srcFile: string | '' }
  const pool: PoolItem[] = []
  const seen = new Set<string>()

  // Add file-based keywords first (if any)
  for (const src of sources) {
    for (const kw of src.keywords) {
      const n = normalizeKw(kw)
      if (!n) continue
      const key = n.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      pool.push({ kw: n, srcFile: src.file })
    }
  }
  if (!hasFiles) {
    // Sequential rotation over DEFAULT_KEYWORDS with persistence
    const total = DEFAULT_KEYWORDS.length
    const start = await loadRotationIndex(total)
    const pickCount = Math.max(1, Number(limit) || 1)
    for (let i = 0; i < pickCount; i++) {
      const kw = DEFAULT_KEYWORDS[(start + i) % total]
      const n = normalizeKw(kw)
      if (!n) continue
      const key = n.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      pool.push({ kw: n, srcFile: '' })
    }
    // Persist next index regardless of how many ultimately processed, to keep rotation simple
    const nextIndex = (start + pickCount) % total
    try { await saveRotationIndex(nextIndex) } catch {}
  }

  // Keep order: no shuffle. When files exist, we strictly follow their line order.

  // Build set of existing slugs to avoid duplicates (include generated-blogs.json)
  const index = await listCachedPosts().catch(() => [])
  const existingSlugs = new Set(index.map(it => String(it.slug)))
  try {
    const genList = await listGeneratedBlogs().catch(() => [])
    for (const it of genList || []) {
      if (it && typeof (it as any).slug === 'string') existingSlugs.add(String((it as any).slug))
    }
  } catch {}

  let processed = 0
  let skipped = 0
  const generatedSlugs: string[] = []

  // Track selections per source file to decide markDone
  const selectedByFile = new Map<string, Set<string>>()
  const allByFile = new Map<string, Set<string>>()
  if (hasFiles) {
    for (const src of sources) {
      allByFile.set(src.file, new Set(src.keywords.map(k => normalizeKw(k).toLowerCase()).filter(Boolean)))
    }
  }

  for (const item of pool) {
    if (processed >= limit) break
    const kw = item.kw
    const baseSlug = slugify(kw)
    if (!baseSlug) { skipped++; continue }

    let slug = baseSlug
    let suffix = 1
    while (existingSlugs.has(slug)) {
      suffix++
      slug = `${baseSlug}-${suffix}`
      if (suffix > 50) break
    }
    if (existingSlugs.has(slug)) { skipped++; continue }

    try {
      // Generate content using REAL AI if OpenAI key is available, otherwise use placeholder
      let gen: any
      if (USE_REAL_AI) {
        try {
          const generator = getAIGenerator()
          console.log(`🤖 Generating REAL AI content for: "${kw}"`)
          
          // Generate title using AI
          const aiTitle = await generator.generateTitle(kw)
          console.log(`✅ AI Title: "${aiTitle}"`)
          
          // Generate content using AI
          const aiContent = await generator.generateContent(kw, aiTitle)
          console.log(`✅ AI Content: ${aiContent.content.length} chars, ${aiContent.content.replace(/<[^>]*>/g, ' ').split(' ').filter(w => w.length > 0).length} words`)
          
          // Map AI content to gen format
          gen = {
            title: aiTitle,
            excerpt: aiContent.excerpt,
            content: aiContent.content,
            author: 'AI Writer',
            date: new Date().toISOString(),
            image: '',
            aiImageUrl: aiContent.imagePrompt ? buildAiHeroUrl(aiTitle, slug) : '',
            categories: [aiContent.category],
            tags: aiContent.tags
          }
        } catch (error) {
          console.error('❌ AI generation failed, falling back to placeholder:', error)
          gen = await generatePlaceholderPostBySlug(slug)
        }
      } else {
        console.log(`📝 Generating placeholder content for: "${kw}"`)
        gen = await generatePlaceholderPostBySlug(slug)
      }
      const nowIso = new Date().toISOString()

      // Ensure content length and excerpt for SEO first
      const ensuredContentRaw = ensureContentLength(String(gen.content || ''), kw)
      let ensuredExcerpt = String(gen.excerpt || '')
      if (!ensuredExcerpt || wordCount(ensuredExcerpt) < 15) {
        ensuredExcerpt = makeExcerptFromContent(ensuredContentRaw, 40)
      }

      // Build initial SEO title then sanitize title and content to avoid illegal phrases
      const initialTitle = buildSeoFriendlyTitle(kw, gen.title)
      const sanitized = sanitizeTitleAndContent(initialTitle, ensuredContentRaw, kw)
      const safeTitle = sanitized.title
      const safeContent = sanitized.content

      // Ensure AI hero image URL exists using sanitized title
      const ensuredAiUrl = gen.aiImageUrl || buildAiHeroUrl(safeTitle || kw, slug)

      // Pilih featured image sesuai prioritas:
      // 1) sumber asli/AI yang dinormalisasi (ensureHeroImage)
      // 2) hasil cache lokal melalui /api/blog/image
      // 3) dummy SVG jika semua gagal
      const heroSource = ensureHeroImage(String(gen.image || ''), safeTitle || kw, slug)
      let localImageUrl = ''
      try {
        if (heroSource) {
          localImageUrl = await cacheHeroImage(heroSource, slug)
        }
      } catch {}

      // Generate random dummy image for the post (use SVG instead of corrupt JPG)
      const dummyImageNum = Math.floor(Math.random() * 100) + 1
      const dummyImagePath = `/images/dummy/dummy-${dummyImageNum}.svg`
      const heroImageUrl = localImageUrl || ensuredAiUrl || dummyImagePath

      const post: CachedPost = {
        id: Date.now(),
        slug,
        title: safeTitle,
        excerpt: ensuredExcerpt,
        content: safeContent,
        author: pickAuthorForSlug(slug, gen.author),
        date: nowIso,
        image: heroImageUrl,
        categories: Array.isArray(gen.categories) ? gen.categories : ['Blog'],
        tags: buildTags(kw, Array.isArray(gen.tags) ? gen.tags : [], Array.isArray(gen.categories) ? gen.categories : []),
        aiImageUrl: ensuredAiUrl,
      }

      await savePostToCache(post)

      // Simpan juga dalam content/generated-blogs.json sesuai spesifikasi
      try {
        const mt = String(post.title || '').trim()
        const metaTitle = mt.length > 60 ? mt.slice(0, 60).trim() : mt
        const mdBase = stripHtml(ensuredExcerpt || safeContent || '')
        const metaDesc = mdBase.length > 160 ? mdBase.slice(0, mdBase.lastIndexOf(' ', 160) > 20 ? mdBase.lastIndexOf(' ', 160) : 160).trim() : mdBase
        const record: GeneratedBlogRecord = {
          id: Number(post.id) || Date.now(),
          slug: post.slug,
          title: post.title,
          content: post.content,
          publish_at: nowIso,
          featured_image: heroImageUrl,
          meta_title: metaTitle,
          meta_description: metaDesc,
        }
        await appendGeneratedBlogs([record])
      } catch {}

      existingSlugs.add(slug)
      processed++
      generatedSlugs.push(slug)

      // WordPress publishing removed - using ChatGPT generation only
      // Content is generated and saved locally only

      if (item.srcFile) {
        if (!selectedByFile.has(item.srcFile)) selectedByFile.set(item.srcFile, new Set())
        selectedByFile.get(item.srcFile)!.add(normalizeKw(kw).toLowerCase())
      }
    } catch {
      skipped++
      continue
    }
  }

  // Mark .done only if a file’s keywords were fully consumed by this run
  if (hasFiles) {
    for (const [file, allSet] of allByFile.entries()) {
      const chosen = selectedByFile.get(file)
      if (chosen && allSet.size > 0 && chosen.size >= allSet.size) {
        try { await markDone(file) } catch {}
      }
    }
  }

  return { processed, skipped, generated: generatedSlugs }
}


// --- Local hero image caching helpers ---
async function ensureImagesDir(): Promise<string> {
  const dir = path.join(process.cwd(), 'data', 'blog', 'images')
  try { await fs.mkdir(dir, { recursive: true }) } catch {}
  return dir
}

function pickExtFromContentType(ct?: string): string {
  const s = String(ct || '').toLowerCase()
  if (s.includes('image/webp')) return 'webp'
  if (s.includes('image/png')) return 'png'
  if (s.includes('image/jpeg') || s.includes('image/jpg')) return 'jpg'
  if (s.includes('image/gif')) return 'gif'
  return 'jpg'
}

function safeBaseName(input: string): string {
  return (input || '').toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image'
}

async function cacheHeroImage(sourceUrl: string, slug: string): Promise<string> {
  try {
    const dir = await ensureImagesDir()
    const response = await fetch(sourceUrl, { headers: { 'User-Agent': 'jasapembayaran-bot/1.0' } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const ct = response.headers.get('content-type') || 'image/jpeg'
    const ext = pickExtFromContentType(ct)
    const base = safeBaseName(slug)
    const fileName = `${base}.${ext}`
    const filePath = path.join(dir, fileName)

    // If file already exists, skip re-download
    try { await fs.access(filePath) } catch {
      const arr = new Uint8Array(await response.arrayBuffer())
      await fs.writeFile(filePath, arr)
    }

    // Serve via image API which reads from data/blog/images
    return `/api/blog/image/${fileName}`
  } catch (e) {
    // On any error, fall back to original URL so UI still shows an image
    return sourceUrl
  }
}
