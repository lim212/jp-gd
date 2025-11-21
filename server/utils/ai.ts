// server/utils/ai.ts
// Minimal placeholder generator used by blog API routes when cache is empty.
// This avoids route import errors and provides safe fallback content.

export type PlaceholderPost = {
  id: number
  slug: string
  title: string
  date: string
  image: string
  excerpt?: string
}

function toSlug(input: string): string {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function generatePlaceholderPosts(count: number, page = 1): Promise<PlaceholderPost[]> {
  const n = Math.max(0, Math.min(Number(count) || 0, 64))
  const list: PlaceholderPost[] = []
  const base = Date.now() - (Math.max(1, page) - 1) * 3600_000

  const seeds = [
    'Jasa PayPal: Solusi Pembayaran Online Aman',
    'Jasa Bayar PayPal Cepat & Terpercaya',
    'Jasa Transfer PayPal untuk Transaksi Global',
    'Jasa Domain Namecheap: Panduan & Tips',
    'Jasa Namecheap: Keamanan Transaksi Online',
    'Jasa Top Up PayPal: Praktis & Aman',
    'Jasa Verifikasi PayPal: Mudah & Tepat',
    'Jasa Domain NameSilo: Pilihan Tepat',
  ]

  for (let i = 0; i < n; i++) {
    const title = seeds[i % seeds.length]
    const slug = `${toSlug(title)}-${page}-${i + 1}`
    const date = new Date(base - i * 60000).toISOString()
    list.push({
      id: -1000 - (page * 100 + i),
      slug,
      title,
      date,
      // Use local fast fallback image; client will normalize if needed
      image: '/images/fallback-news.svg',
      excerpt: undefined,
    })
  }

  return list
}


export type GeneratedPost = {
  title: string
  excerpt: string
  content: string
  author?: string
  date?: string
  image?: string
  aiImageUrl?: string
  categories?: string[]
  tags?: string[]
}

function titleFromSlug(slug: string): string {
  const s = String(slug || '').replace(/\/+|\.+/g, '').trim()
  const words = s.split(/[-_\s]+/).filter(Boolean)
  if (!words.length) return 'Memuat...'
  const titled = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return titled
}

export function buildAiHeroUrl(titleText?: string, slugText?: string) {
  const cleanTitle = String(titleText || '').replace(/<[^>]*>/g, '').trim() || 'Blog Illustration'
  const basePrompt = `${cleanTitle}, modern 3D illustration, gradient lighting, PAYTECH payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`
  const encoded = encodeURIComponent(basePrompt)
  const seed = encodeURIComponent(String(slugText || cleanTitle || 'blog'))
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true`
}

export async function generatePlaceholderPostBySlug(slug: string): Promise<GeneratedPost> {
  const safeSlug = String(slug || '').trim() || 'blog-placeholder'
  const title = titleFromSlug(safeSlug)
  const iso = new Date().toISOString()
  const aiImageUrl = buildAiHeroUrl(title, safeSlug)
  const excerpt = `<p>${title} — Artikel ini dihasilkan otomatis untuk menjaga halaman tetap tersedia ketika blog utama sedang tidak dapat diakses. Konten asli akan ditampilkan secara otomatis ketika sistem kembali normal.</p>`
  const content = [
    `<h1>${title}</h1>`,
    `<p>Artikel placeholder ini dibuat secara otomatis berdasarkan slug: <strong>${safeSlug}</strong>.`,
    'Tujuannya agar halaman tetap menampilkan informasi yang relevan sementara konten asli sedang diproses atau tidak tersedia.</p>',
    '<h2>Tentang Layanan Kami</h2>',
    '<p>Kami menyediakan layanan pembayaran digital yang aman dan terpercaya. Silakan kembali lagi nanti untuk membaca artikel lengkap.</p>'
  ].join('\n')

  return {
    title,
    excerpt,
    content,
    author: 'Redaksi',
    date: iso,
    image: '/images/fallback-news.svg',
    aiImageUrl,
    categories: ['Placeholder'],
    tags: ['placeholder', 'auto-generated']
  }
}
