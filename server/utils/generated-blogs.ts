// server/utils/generated-blogs.ts
import { promises as fs } from 'fs'
import path from 'path'
import { ensureHeroImage, normalizeTitle, spinTitle, isRawTitle } from '../utils/blog-normalize'
import { pickAuthorForSlug } from '../utils/authors'
// WordPress integration removed - using ChatGPT only

export type GeneratedBlogRecord = {
  id: number
  slug: string
  title: string
  content: string
  publish_at: string
  featured_image: string
  meta_title?: string
  meta_description?: string
}

const DEFAULT_FILE_PATH = path.join(process.cwd(), 'content', 'generated-blogs.json')
const ALT_FILE_PATH = path.join(process.cwd(), 'database', 'content', 'generated-blogs.json')

async function resolveFilePath(): Promise<string> {
  try { await fs.stat(ALT_FILE_PATH); return ALT_FILE_PATH } catch {}
  try { await fs.stat(DEFAULT_FILE_PATH); return DEFAULT_FILE_PATH } catch {}
  // Prefer ALT path by default if none exist yet
  return ALT_FILE_PATH
}

async function ensureDir(file?: string): Promise<void> {
  const target = file || DEFAULT_FILE_PATH
  try { await fs.mkdir(path.dirname(target), { recursive: true }) } catch {}
}

function stripHtml(input?: string): string {
  return String(input || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function clampMeta(input: string, max: number): string {
  const s = String(input || '').trim()
  if (s.length <= max) return s
  // Try to cut at last space before max
  const cut = s.slice(0, max)
  const i = cut.lastIndexOf(' ')
  return (i > 20 ? cut.slice(0, i) : cut).trim()
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeJson(file: string, data: any): Promise<void> {
  await ensureDir(file)
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(file, json, 'utf-8')
}

function countWordsFromHtml(html?: string): number {
  const text = stripHtml(html)
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

function hasStandardStructure(html?: string): boolean {
  const s = String(html || '')
  if (!s) return false
  // Check required section headings
  const hasPend = /<h2[^>]*>\s*Pendahuluan\s*<\/h2>/i.test(s)
  const hasTentang = /<h2[^>]*>\s*Tentang\s+Layanan\s*<\/h2>/i.test(s)
  const hasKeunggulan = /<h2[^>]*>\s*Keunggulan\s*<\/h2>/i.test(s) && /<ul[\s\S]*?<\/ul>/i.test(s)
  const hasCara = /<h2[^>]*>\s*Cara\s+Menggunakan\s*<\/h2>/i.test(s) && /<ol[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<\/ol>/i.test(s)
  const hasTips = /<h2[^>]*>\s*Tips\s*&\s*FAQ\s*<\/h2>/i.test(s)
  const hasKesimpulan = /<h2[^>]*>\s*Kesimpulan\s*<\/h2>/i.test(s)
  return hasPend && hasTentang && hasKeunggulan && hasCara && hasTips && hasKesimpulan
}

function ensureStandardStructure(html: string, title: string, slug: string): string {
  let out = String(html || '')
  const wc = countWordsFromHtml(out)
  if (!hasStandardStructure(out) || wc < 500) {
    // Rebuild entirely to guarantee structure and ideal length
    return buildNewStandardBody(title, slug)
  }
  // If the structure is ok but word count slightly below ideal min (520), append filler paragraphs
  if (wc < 520) {
    const fillers = [
      'Layanan kami mengutamakan keamanan, kecepatan, dan kenyamanan pengguna dengan dokumentasi lengkap, standar profesional, serta dukungan berkelanjutan.',
      'Tim kami berpengalaman menangani berbagai skenario transaksi sehingga Anda mendapatkan pendampingan yang jelas, transparan, dan terukur dari awal hingga akhir.',
      'Kami terus meningkatkan kualitas layanan melalui evaluasi rutin, optimasi proses, dan pembaruan kebijakan keamanan untuk menghadirkan pengalaman terbaik.',
      'Panduan yang kami sediakan mudah diikuti, lengkap dengan contoh, tips praktis, serta penjelasan istilah agar pengguna baru cepat memahami alur kerja.'
    ]
    let i = 0
    let current = wc
    while (current < 520 && i < 200) {
      out += `\n<p>${fillers[i % fillers.length]}</p>`
      current = countWordsFromHtml(out)
      i++
    }
  }
  return out
}

function genSection(title: string, body: string): string {
  return `<h2>${title}</h2>\n<p>${body}</p>`
}

function buildNewStandardBody(title: string, slug: string): string {
  const topic = normalizeTitle(title || '', slug || '')
  const intro = genSection(
    'Pendahuluan',
    `${topic} membantu Anda bertransaksi secara aman dan praktis tanpa harus repot mengurus detail teknis sendiri. Di bagian ini, Anda akan melihat gambaran singkat tentang manfaat utama layanan, siapa yang cocok menggunakannya, dan apa yang perlu dipersiapkan sebelum mulai.`
  )

  const tentang = genSection(
    'Tentang Layanan',
    `Layanan ini dirancang agar mudah dipahami, bahkan oleh pengguna yang baru pertama kali bertransaksi online. Alurnya jelas: konsultasi singkat, konfirmasi kebutuhan, verifikasi data, lalu eksekusi transaksi dengan pemantauan yang transparan. Kami menerapkan praktik keamanan yang ketat agar Anda bisa berfokus pada bisnis atau aktivitas utama Anda.`
  )

  const keunggulan = `<h2>Keunggulan</h2>
<ul>
<li>Keamanan berlapis dengan pemantauan transaksi secara berkala.</li>
<li>Proses yang jelas dari awal hingga akhir, tanpa biaya tersembunyi.</li>
<li>Dukungan pelanggan yang responsif melalui live chat dan WhatsApp.</li>
<li>Panduan langkah demi langkah yang memudahkan pengguna baru.</li>
<li>Fleksibel untuk berbagai kebutuhan: belanja, top up, sampai pembayaran layanan digital.</li>
</ul>`

  const cara = `<h2>Cara Menggunakan</h2>
<ol>
<li>Hubungi kami dan jelaskan kebutuhan Anda terkait ${topic.toLowerCase()} secara singkat.</li>
<li>Kami akan memberikan penjelasan alur, estimasi biaya, dan waktu proses.</li>
<li>Lakukan verifikasi data dan konfirmasi detail transaksi.</li>
<li>Tim kami mengeksekusi transaksi sesuai kesepakatan, sementara Anda dapat memantau progresnya.</li>
<li>Setelah selesai, kami kirimkan bukti transaksi dan ringkasan sebagai arsip Anda.</li>
</ol>`

  const tipsFaq = `<h2>Tips & FAQ</h2>
<p>Tips singkat: siapkan informasi yang lengkap sejak awal, gunakan hanya kontak resmi yang tercantum di situs, dan pastikan Anda membaca kembali detail transaksi sebelum menyetujui. FAQ singkat:</p>
<ul>
<li><strong>Apakah layanan ini aman?</strong> Ya, kami menerapkan kebijakan keamanan berlapis dan hanya menggunakan jalur komunikasi resmi.</li>
<li><strong>Berapa lama prosesnya?</strong> Umumnya cepat; durasi bergantung pada jenis layanan dan antrian saat itu.</li>
<li><strong>Apakah ada biaya tambahan?</strong> Biaya dijelaskan di awal secara transparan, sehingga Anda tahu total yang harus dibayar sebelum transaksi berjalan.</li>
</ul>`

  const kesimpulan = genSection(
    'Kesimpulan',
    `Dengan ${topic}, Anda tidak perlu lagi repot mengurus detail teknis dan risiko yang sering muncul saat bertransaksi online. Kami membantu dari tahap perencanaan hingga transaksi selesai, sehingga Anda bisa fokus pada tujuan utama: menjalankan aktivitas dan bisnis dengan lebih tenang.`
  )

  const promoCta = `<p><strong>Promo khusus:</strong> Untuk konsultasi dan bantuan cepat terkait ${topic.toLowerCase()}, Anda dapat langsung chat WhatsApp kami di <a href="https://api.whatsapp.com/send/?phone=628988888250&text=Halo%20JasaPembayaran.com%2C%20saya%20ingin%20konsultasi%20tentang%20jasa%20PayPal&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">0898-8888-250</a>. Tim JasaPembayaran.com siap membantu Anda setiap hari.</p>`

  // Susun body awal dan tambah filler dinamis agar 500–800 kata
  const baseParts = [intro, tentang, keunggulan, cara, tipsFaq, kesimpulan, promoCta]
  let html = baseParts.join('\n')
  let wc = countWordsFromHtml(html)
  const targetMin = 520
  const targetMax = 780
  const fillers = [
    'Layanan kami mengutamakan keamanan, kecepatan, dan kenyamanan pengguna dengan dokumentasi lengkap, standar profesional, serta dukungan berkelanjutan.',
    'Tim kami berpengalaman menangani berbagai skenario transaksi sehingga Anda mendapatkan pendampingan yang jelas, transparan, dan terukur dari awal hingga akhir.',
    'Kami terus meningkatkan kualitas layanan melalui evaluasi rutin, optimasi proses, dan pembaruan kebijakan keamanan untuk menghadirkan pengalaman terbaik.',
    'Panduan yang kami sediakan mudah diikuti, lengkap dengan contoh, tips praktis, serta penjelasan istilah agar pengguna baru cepat memahami alur kerja.'
  ]
  let i = 0
  while (wc < targetMin && i < 200) {
    const sentence = fillers[i % fillers.length]
    html += `\n<p>${sentence}</p>`
    wc = countWordsFromHtml(html)
    i++
  }
  // Hindari melebihi targetMax secara signifikan; loop di atas berhenti di targetMin yang < targetMax
  return html
}

export async function updateGeneratedBlogsToNewStandard(): Promise<void> {
  const file = await resolveFilePath()
  const arr = await readJson<GeneratedBlogRecord[]>(file)
  if (!Array.isArray(arr) || arr.length === 0) return

  let changed = false
  const updated = arr.map((it) => {
    const original = { ...it }
    const slug = String((it as any).slug || '')

    // Title normalization with spin for raw/generic
    const rawTitle = String((it as any).title || '')
    let title = normalizeTitle(rawTitle, slug)
    if (slug === 'jasa-top-up-paypal-5') {
      title = 'Jasa Top Up PayPal'
    }
    if (isRawTitle(rawTitle, title, slug)) {
      title = spinTitle(title, slug)
    }

    // Ensure body follows the required standard structure and ideal length
    const content = ensureStandardStructure(String((it as any).content || ''), title, slug)

    // Featured image validation/generation
    const rawImage = String((it as any).featured_image || '')
    const image = ensureHeroImage(rawImage, title, slug)

    // Meta fields
    const meta_title = clampMeta(String((it as any).meta_title || title), 60)
    const meta_description = clampMeta(String((it as any).meta_description || stripHtml(content)), 160)

    const rec: GeneratedBlogRecord = {
      id: Number((it as any).id) || Date.now(),
      slug,
      title,
      content,
      publish_at: String((it as any).publish_at || new Date().toISOString()),
      featured_image: image,
      meta_title,
      meta_description,
    }

    // Detect change
    if (
      rec.title !== original.title ||
      rec.content !== original.content ||
      rec.featured_image !== original.featured_image ||
      rec.meta_title !== (original as any).meta_title ||
      rec.meta_description !== (original as any).meta_description
    ) {
      changed = true
    }
    return rec
  })

  if (changed) {
    await writeJson(file, updated)
  }
}

// Force-regenerate title, content, and featured_image for ALL records and overwrite the file
export async function forceRegenerateAllGeneratedBlogs(): Promise<{ total: number }> {
  const file = await resolveFilePath()
  const arr = await readJson<GeneratedBlogRecord[]>(file)
  if (!Array.isArray(arr) || arr.length === 0) return { total: 0 }

  const updated = arr.map((it) => {
    const slug = String((it as any).slug || '')

    // Always rebuild title (keep special-case), then spin if raw/generic
    const rawTitle = String((it as any).title || '')
    let title = normalizeTitle(rawTitle, slug)
    if (slug === 'jasa-top-up-paypal-5') {
      title = 'Jasa Top Up PayPal'
    }
    if (isRawTitle(rawTitle, title, slug)) {
      title = spinTitle(title, slug)
    }

    // Always rebuild body to new standard
    const content = buildNewStandardBody(title, slug)

    // Always rebuild hero image (ignore existing)
    const image = ensureHeroImage('', title, slug) || '/images/fallback-news.svg'

    const meta_title = clampMeta(String((it as any).meta_title || title), 60)
    const meta_description = clampMeta(String(stripHtml(content)), 160)

    const rec: GeneratedBlogRecord = {
      id: Number((it as any).id) || Date.now(),
      slug,
      title,
      content,
      publish_at: String((it as any).publish_at || new Date().toISOString()),
      featured_image: image,
      meta_title,
      meta_description,
    }
    return rec
  })

  await writeJson(file, updated)

  // After regenerating all records, also sync to data/blog/*.json
  try {
    await syncGeneratedBlogsToDataFiles(updated)
  } catch (e) {
    // Log but don't fail the whole operation
    console.error('[generated-blogs] Error syncing to data/blog files:', e)
  }

  return { total: updated.length }
}

// Sync regenerated blog records to data/blog/*.json so that old files are refreshed
async function syncGeneratedBlogsToDataFiles(records: GeneratedBlogRecord[]): Promise<void> {
  const blogDir = path.join(process.cwd(), 'data', 'blog')
  try { await fs.mkdir(blogDir, { recursive: true }) } catch {}

  for (const rec of records) {
    if (!rec?.slug) continue
    const slug = String(rec.slug)
    const filePath = path.join(blogDir, `${slug}.json`)

    // Build excerpt from meta_description or content
    const text = stripHtml(rec.meta_description || rec.content || '')
    const wordsArr = text.split(/\s+/).filter(Boolean)
    const excerptShort = wordsArr.slice(0, 50).join(' ')
    const excerpt = `<p>${excerptShort}${wordsArr.length > 50 ? '…' : ''}</p>`

    const blogJson = {
      id: Number(rec.id) || Date.now(),
      slug,
      title: normalizeTitle(rec.title, slug),
      excerpt,
      content: rec.content,
      author: pickAuthorForSlug(slug),
      date: rec.publish_at || new Date().toISOString(),
      image: rec.featured_image || FALLBACK_IMAGE,
      imageUrl: rec.featured_image || FALLBACK_IMAGE,
      featured_image: rec.featured_image || FALLBACK_IMAGE,
      categories: ['Placeholder'],
      tags: [
        'placeholder',
        'auto-generated',
        ...toKeywordsFromSlug(slug)
      ],
      aiImageUrl: rec.featured_image || FALLBACK_IMAGE
    }

    try {
      await fs.writeFile(filePath, JSON.stringify(blogJson, null, 2), 'utf-8')
      console.log('[generated-blogs] Synced blog file:', filePath)
    } catch (e) {
      console.error('[generated-blogs] Failed to write blog file:', filePath, e)
    }
  }
}

export async function listGeneratedBlogs(): Promise<GeneratedBlogRecord[]> {
  const file = await resolveFilePath()
  const arr = await readJson<GeneratedBlogRecord[]>(file)
  if (!Array.isArray(arr)) return []
  // Normalize minimal fields and sort by publish_at desc
  const norm = arr
    .filter(it => it && typeof it.slug === 'string' && typeof it.title === 'string')
    .map(it => {
      const slug = String((it as any).slug || '')
      const title = String((it as any).title || '')
      const content = String((it as any).content || '')
      const metaTitle = clampMeta(String((it as any).meta_title || title), 60)
      const metaDesc = clampMeta(String((it as any).meta_description || stripHtml(content)), 160)
      const image = ensureHeroImage(String((it as any).featured_image || ''), normalizeTitle(title, slug), slug)
      return {
        id: Number((it as any).id) || 0,
        slug,
        title,
        content,
        publish_at: String((it as any).publish_at || ''),
        featured_image: image,
        meta_title: metaTitle,
        meta_description: metaDesc,
      }
    })
  norm.sort((a, b) => (Date.parse(b.publish_at || '') || 0) - (Date.parse(a.publish_at || '') || 0))
  return norm
}

export async function appendGeneratedBlogs(items: GeneratedBlogRecord[]): Promise<void> {
  if (!Array.isArray(items) || items.length === 0) return

  // Load current records and seed a map for quick lookups
  const current = await listGeneratedBlogs().catch(() => [])
  const map = new Map<string, GeneratedBlogRecord>()
  for (const it of current) map.set(it.slug, it)

  // Collect records that are truly new (not updates to existing slugs)
  const newlyAdded: GeneratedBlogRecord[] = []

  for (const it of items) {
    if (!it?.slug) continue
    const slug = String(it.slug || '')

    // Determine if this is a brand-new slug before we overwrite in the map
    const isNew = !map.has(slug)

    // Normalize title and content to our standard, including special-case and spin when raw
    const rawTitle = String(it.title || '')
    let title = normalizeTitle(rawTitle, slug)
    if (slug === 'jasa-top-up-paypal-5') {
      title = 'Jasa Top Up PayPal'
    }
    if (isRawTitle(rawTitle, title, slug)) {
      title = spinTitle(title, slug)
    }

    const content = ensureStandardStructure(String(it.content || ''), title, slug)
    const safeImage = ensureHeroImage(String(it.featured_image || ''), title, slug)

    const rec: GeneratedBlogRecord = {
      id: Number(it.id) || Date.now(),
      slug,
      title,
      content,
      publish_at: String(it.publish_at || new Date().toISOString()),
      featured_image: safeImage,
      meta_title: clampMeta(String((it as any).meta_title || title), 60),
      meta_description: clampMeta(String((it as any).meta_description || stripHtml(content)), 160),
    }

    map.set(rec.slug, rec)
    if (isNew) newlyAdded.push(rec)
  }

  // Persist merged list
  const out = Array.from(map.values())
  out.sort((a, b) => (Date.parse(b.publish_at || '') || 0) - (Date.parse(a.publish_at || '') || 0))
  const file = await resolveFilePath()
  await writeJson(file, out)

  // WordPress publishing removed - using ChatGPT generation only
  // Content is saved locally only
}

export type GeneratedIndexItem = { id: number, slug: string, title: string, date: string, image: string, excerpt?: string }

// Build a lightweight index for APIs
export async function listGeneratedIndex(): Promise<GeneratedIndexItem[]> {
  // Upgrade data to the new standard before listing index
  try { await updateGeneratedBlogsToNewStandard() } catch {}
  const arr = await listGeneratedBlogs()
  return arr.map(it => ({
    id: Number(it.id) || 0,
    slug: it.slug,
    title: it.title,
    date: it.publish_at,
    image: it.featured_image,
  }))
}
