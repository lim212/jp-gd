// server/utils/blog-normalize.ts
export const FALLBACK_IMAGE = '/images/fallback-news.svg'

const LOCAL_AI_IMAGES = [
  '/images/blog/jasa-paypal-1760990485278.jpg',
  '/images/blog/jasa-transfer-paypal-1760990622512.jpg',
  '/images/blog/jasa-bayar-paypal-1760990551361.jpg',
  '/images/blog/jasa-bitcoin-1760991019009.jpg',
  '/images/blog/jasa-namecheap-1760990731749.jpg',
  '/images/blog/jasa-domain-namecheap-1760990684690.jpg',
  '/images/blog/jasa-bayar-livechat-1760990974761.jpg',
  '/images/blog/jasa-topup-saldo-namecheap-1760990916270.jpg',
  '/images/blog/jasa-pembayaran-namecheap-1760990771823.jpg',
  '/images/blog/jasa-top-up-saldo-namecheap-1760990851021.jpg',
  '/images/blog/jasa-paypal-1760904102241.jpg',
  '/images/blog/jasa-bitcoin-1760904510817.jpg',
  '/images/blog/jasa-namecheap-1760904305720.jpg',
  '/images/blog/jasa-domain-namecheap-1760904256746.jpg',
  '/images/blog/jasa-bayar-livechat-1760904469087.jpg',
  '/images/blog/jasa-transfer-paypal-1760904209103.jpg',
  '/images/blog/jasa-paypal-1760731352868.jpg',
  '/images/blog/jasa-bitcoin-1760731941244.jpg',
  '/images/blog/jasa-namecheap-1760731626976.jpg',
  '/images/blog/jasa-domain-namecheap-1760731575977.jpg',
  '/images/blog/jasa-bayar-livechat-1760731890506.jpg',
  '/images/blog/jasa-transfer-paypal-1760731526926.jpg',
  '/images/blog/jasa-pembayaran-namecheap-1760731675566.jpg',
  '/images/blog/jasa-top-up-saldo-namecheap-1760731744136.jpg',
  '/images/blog/jasa-topup-saldo-namecheap-1760731801836.jpg',
  '/images/blog/jasa-paypal-1759201174423.jpg',
  '/images/blog/jasa-bitcoin-1759201129426.jpg',
  '/images/blog/jasa-namecheap-1759201159477.jpg',
  '/images/blog/jasa-domain-namecheap-1759201144626.jpg',
  '/images/blog/jasa-bayar-livechat-1759201099480.jpg',
  '/images/blog/jasa-transfer-paypal-1759201234532.jpg',
  '/images/blog/jasa-pembayaran-namecheap-1759201189902.jpg',
  '/images/blog/jasa-top-up-saldo-namecheap-1759201204476.jpg',
  '/images/blog/jasa-topup-saldo-namecheap-1759201219534.jpg'
]

const SUPER_DUMMY_COUNT = 60

function stripHtml(input?: string): string {
  return String(input || '').replace(/<[^>]*>/g, '').trim()
}

function normalizeImageUrl(img?: string): string {
  const s = String(img || '').trim()
  if (!s) return ''
  if (s.includes('fallback-news.svg') || s.includes('dummy-blank')) return ''
  if (s.startsWith('/wp-content/')) return `https://blog.jasapembayaran.com${s}`
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) return s
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image')) return s
  if (s.startsWith('images/blog/')) return `/${s}`
  if (s.startsWith('images/dummy/')) return `/${s}`
  return ''
}

function hashSlug(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getSuperDummy(seed: string): string {
  if (SUPER_DUMMY_COUNT <= 0) return FALLBACK_IMAGE
  const idx = hashSlug(seed) % SUPER_DUMMY_COUNT
  const num = String(idx + 1).padStart(2, '0')
  return `/images/dummy/super/super-dummy-${num}.svg`
}

export function ensureHeroImage(existingImg: string | undefined, title: string, slug: string): string {
  // 1) keep normalized existing image if present
  const normalized = normalizeImageUrl(existingImg)
  if (normalized) return normalized

  const seed = slug || title || 'default'

  // 2) deterministic local AI art
  if (LOCAL_AI_IMAGES.length > 0) {
    const aiIdx = hashSlug(seed) % LOCAL_AI_IMAGES.length
    const aiImage = LOCAL_AI_IMAGES[aiIdx]
    if (aiImage) return aiImage
  }

  // 3) super dummy gradient fallback
  return getSuperDummy(seed)
}

const SMALL_WORDS = new Set([
  'dan','yang','di','ke','dari','untuk','dengan','atau','pada','oleh','sebagai','karena','agar','dalam','ke','yang','serta','atau','atau'
])

function brandCase(word: string): string {
  const w = word.toLowerCase()
  switch (w) {
    case 'paypal': return 'PayPal'
    case 'namesilo': return 'NameSilo'
    case 'namecheap': return 'Namecheap'
    case 'visa': return 'Visa'
    case 'mastercard': return 'Mastercard'
    case 'google': return 'Google'
    case 'amazon': return 'Amazon'
    case 'netflix': return 'Netflix'
    default:
      return w.charAt(0).toUpperCase() + w.slice(1)
  }
}

function titleCase(raw: string): string {
  const cleaned = stripHtml(raw)
  if (!cleaned) return ''
  const parts = cleaned.split(/\s+/)
  return parts.map((p, idx) => {
    const low = p.toLowerCase()
    if (idx !== 0 && SMALL_WORDS.has(low)) return low
    // keep numbers/abbreviations
    if (/^[0-9]+$/.test(p)) return p
    return brandCase(p)
  }).join(' ')
}

function removeTrailingRandomNumbers(t: string): string {
  let s = t.trim()
  // remove trailing -/_ separators then numbers (e.g., "judul 5" or "judul-12")
  s = s.replace(/[\s_-]+(\d{1,3})$/u, '')
  // remove parentheses numbers at end e.g., "judul (3)"
  s = s.replace(/\s*\(\d{1,3}\)\s*$/u, '')
  return s.trim()
}

export function normalizeTitle(rawTitle?: string, slug?: string): string {
  let t = stripHtml(rawTitle)
  if (!t && slug) t = String(slug).replace(/[-_]+/g, ' ')
  t = removeTrailingRandomNumbers(t)
  t = titleCase(t)
  // second pass to catch numbers introduced by slug mapping
  t = removeTrailingRandomNumbers(t)
  return t
}

function toKeywordsFromSlug(slug?: string): string[] {
  const s = String(slug || '')
  return s.split(/[-_\s]+/).filter(Boolean)
}

function paragraph(text: string): string {
  return `<p>${text}</p>`
}

function words(count: number, seed = 'informasi layanan pembayaran digital aman terpercaya internasional solusi cepat mudah profesional dukungan pelanggan online transaksi global resmi promosi fitur keunggulan panduan tutorial tips trik keamanan verifikasi top up transfer kartu kredit debit rekening e-wallet PAYTECH produk jasa terpercaya indonesia') {
  const arr = seed.split(/\s+/)
  const out: string[] = []
  for (let i = 0; i < count; i++) out.push(arr[i % arr.length])
  return out.join(' ')
}

export function generateRichPlaceholderContent(topic: string, slug: string): string {
  const kw = toKeywordsFromSlug(slug)
  const title = normalizeTitle(topic || slug, slug)
  const intro = paragraph(`${title} — Temukan penjelasan lengkap dan praktis mengenai ${kw.join(', ')}. Artikel ini memberikan gambaran umum, manfaat utama, serta langkah-langkah yang bisa Anda terapkan hari ini.`)

  const h2a = `<h2>Pendahuluan Singkat</h2>`
  const p1 = paragraph(`Di era digital, kebutuhan ${kw[0] || 'layanan pembayaran'} semakin meningkat. Kami menghadirkan solusi yang aman, cepat, dan profesional agar Anda dapat fokus pada hal yang paling penting: mengembangkan bisnis dan produktivitas Anda.`)

  const h2b = `<h2>Topik Utama & Cara Kerja</h2>`
  const h3b1 = `<h3>Ringkasan Fitur</h3>`
  const p2 = paragraph(`Layanan kami dirancang agar mudah digunakan oleh pemula sekalipun. Proses verifikasi sederhana, panduan langkah-demi-langkah, dan dukungan penuh dari tim kami akan membantu Anda menyelesaikan transaksi dengan percaya diri.`)

  const h3b2 = `<h3>Contoh Penggunaan</h3>`
  const p3 = paragraph(`Sebagai contoh, ketika Anda ingin melakukan ${kw[0] || 'pembayaran'} atau ${kw[1] || 'top up'} secara internasional, sistem kami memastikan nilai tukar yang kompetitif, biaya transparan, dan kecepatan pemrosesan yang konsisten.`)

  const h2c = `<h2>Kelebihan & Fitur Unggulan</h2>`
  const list = [
    'Keamanan berlapis dan perlindungan data.',
    'Proses cepat dengan alur yang jelas.',
    'Biaya transparan tanpa biaya tersembunyi.',
    'Dukungan pelanggan responsif dan ramah.',
    'Dokumentasi dan panduan yang mudah dipahami.',
    'Integrasi fleksibel untuk berbagai kebutuhan.',
  ].map(i => `<li>${i}</li>`).join('')
  const ul = `<ul>${list}</ul>`

  const h2d = `<h2>Kesimpulan</h2>`
  const p4 = paragraph(`Jika Anda mencari solusi ${kw.slice(0,3).join(' ')} yang aman dan efisien, ${title} adalah pilihan tepat. Mulailah sekarang dan rasakan pengalaman transaksi yang lebih baik.`)
  const cta = paragraph(`<strong>Butuh bantuan cepat?</strong> Hubungi tim kami melalui live chat atau WhatsApp untuk konsultasi gratis dan rekomendasi terbaik sesuai kebutuhan Anda.`)

  // Tambah body filler agar > 500 kata secara aman
  const filler = paragraph(words(260)) + paragraph(words(260))

  return [h2a, intro, p1, h2b, h3b1, p2, h3b2, p3, h2c, ul, h2d, p4, cta, filler].join('\n')
}

export function isPlaceholderContent(excerptOrHtml?: string): boolean {
  const s = String(excerptOrHtml || '')
  if (!s.trim()) return true
  const lower = s.toLowerCase()
  if (lower.includes('artikel placeholder ini dibuat')) return true
  const text = stripHtml(s)
  const wc = text.split(/\s+/).filter(Boolean).length
  return wc < 120
}

export function ensureExcerpt(excerpt?: string, title?: string, slug?: string): string {
  const raw = stripHtml(excerpt)
  if (raw && raw.length > 20) return raw
  const content = generateRichPlaceholderContent(title || '', slug || '')
  const text = stripHtml(content)
  const wordsArr = text.split(/\s+/).filter(Boolean)
  const short = wordsArr.slice(0, 40).join(' ')
  return `${short}…`
}

export function normalizeIndexItem(it: any): { id: number, slug: string, title: string, date: string, image: string } {
  const id = typeof it?.id === 'number' ? it.id : -1
  const slug = String(it?.slug || '')
  const rawTitle = String(it?.title || '')
  const title = normalizeTitle(rawTitle, slug)
  const image = ensureHeroImage(String(it?.image || ''), title, slug)
  const date = String(it?.date || '')
  return { id, slug, title, date, image }
}

export function normalizeSearchItem(it: any): { id: number, slug: string, title: string, date: string, image: string, excerpt: string } {
  const id = typeof it?.id === 'number' ? it.id : -1
  const slug = String(it?.slug || '')
  const rawTitle = String(it?.title || '')
  const title = normalizeTitle(rawTitle, slug)
  const image = ensureHeroImage(String(it?.image || ''), title, slug)
  const date = String(it?.date || '')
  const excerpt = ensureExcerpt(String(it?.excerpt || ''), title, slug)
  return { id, slug, title, date, image, excerpt }
}

// Generate spun/variant titles for raw/generic inputs
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h >>> 0
}

function replaceSynonyms(base: string): { jasa: string, topup: string, saldo: string, layanan: string, base: string, rest: string } {
  const b = String(base || '').trim()
  const rest = b.replace(/^Jasa\s+/i, '')
  return {
    jasa: /\bJasa\b/i.test(b) ? 'Jasa' : 'Layanan',
    topup: /Top Up/i.test(b) ? 'Top Up' : 'Isi Saldo',
    saldo: 'Isi Saldo',
    layanan: 'Layanan',
    base: b,
    rest,
  }
}

export function spinTitle(baseTitle: string, slug: string): string {
  const norm = normalizeTitle(baseTitle || '', slug || '')
  const syn = replaceSynonyms(norm)
  const variants = [
    // Varian judul dibuat singkat, jelas, dan ramah hasil Google (±45–60 karakter)
    `${syn.base}: Panduan Singkat & Jelas`,
    `${syn.base}: Cara Aman & Praktis`,
    `${syn.base} untuk Transaksi Online Aman`,
    `${syn.base}: Langkah Mudah bagi Pemula`,
    `${syn.layanan} ${syn.rest} yang Aman & Terpercaya`,
    `Tips ${syn.rest || syn.base} Agar Lebih Aman`,
    `${syn.base}: Keunggulan & Cara Menggunakannya`,
  ]
  const idx = hashStr(slug || norm) % variants.length
  return variants[idx]
}

export function isRawTitle(rawTitle?: string, normalizedTitle?: string, slug?: string): boolean {
  const raw = String(rawTitle || '').trim()
  const norm = String(normalizedTitle || '').trim()
  if (!raw) return true
  const rawLower = raw.toLowerCase()
  const normLower = norm.toLowerCase()
  if (rawLower === normLower) return true
  if (rawLower.startsWith(normLower + ' ')) return true // e.g., "judul 5"
  if (/\d{1,3}$/.test(rawLower)) return true
  if ((slug || '').toLowerCase().includes('jasa-top-up-paypal')) return true
  // short generic titles
  if (norm.length <= 18) return true
  return false
}
