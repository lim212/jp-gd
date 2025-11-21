import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const blogDir = path.join(rootDir, 'data', 'blog')

const localAiImages = [
  'jasa-paypal-1760990485278.jpg',
  'jasa-transfer-paypal-1760990622512.jpg',
  'jasa-bayar-paypal-1760990551361.jpg',
  'jasa-bitcoin-1760991019009.jpg',
  'jasa-namecheap-1760990731749.jpg',
  'jasa-domain-namecheap-1760990684690.jpg',
  'jasa-bayar-livechat-1760990974761.jpg',
  'jasa-topup-saldo-namecheap-1760990916270.jpg',
  'jasa-pembayaran-namecheap-1760990771823.jpg',
  'jasa-top-up-saldo-namecheap-1760990851021.jpg',
  'jasa-paypal-1760904102241.jpg',
  'jasa-bitcoin-1760904510817.jpg',
  'jasa-namecheap-1760904305720.jpg',
  'jasa-domain-namecheap-1760904256746.jpg',
  'jasa-bayar-livechat-1760904469087.jpg',
  'jasa-transfer-paypal-1760904209103.jpg',
  'jasa-paypal-1760731352868.jpg',
  'jasa-bitcoin-1760731941244.jpg',
  'jasa-namecheap-1760731626976.jpg',
  'jasa-domain-namecheap-1760731575977.jpg',
  'jasa-bayar-livechat-1760731890506.jpg',
  'jasa-transfer-paypal-1760731526926.jpg',
  'jasa-pembayaran-namecheap-1760731675566.jpg',
  'jasa-top-up-saldo-namecheap-1760731744136.jpg',
  'jasa-topup-saldo-namecheap-1760731801836.jpg',
  'jasa-paypal-1759201174423.jpg',
  'jasa-bitcoin-1759201129426.jpg',
  'jasa-namecheap-1759201159477.jpg',
  'jasa-domain-namecheap-1759201144626.jpg',
  'jasa-bayar-livechat-1759201099480.jpg',
  'jasa-transfer-paypal-1759201234532.jpg',
  'jasa-pembayaran-namecheap-1759201189902.jpg',
  'jasa-top-up-saldo-namecheap-1759201204476.jpg',
  'jasa-topup-saldo-namecheap-1759201219534.jpg'
].map((file) => `/images/blog/${file}`)

const superDummyCount = 60

function hashSlug(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pickHero(slug, existing) {
  const clean = String(existing || '').trim()
  if (clean && !clean.includes('fallback-news.svg') && !clean.includes('dummy-blank')) {
    return clean.startsWith('http') || clean.startsWith('/') ? clean : `/${clean.replace(/^\/+/, '')}`
  }
  const seed = slug || 'default'
  if (localAiImages.length > 0) {
    const idx = hashSlug(seed) % localAiImages.length
    return localAiImages[idx]
  }
  const dummyIdx = hashSlug(seed) % superDummyCount
  return `/images/dummy/super/super-dummy-${String(dummyIdx + 1).padStart(2, '0')}.svg`
}

async function run() {
  const files = await fs.readdir(blogDir)
  const jsonFiles = files.filter((f) => f.endsWith('.json') && !['index.json', 'popular-posts.json', 'latest-posts.json', 'cool-tags.json'].includes(f))
  let updated = 0

  for (const file of jsonFiles) {
    const fullPath = path.join(blogDir, file)
    const raw = await fs.readFile(fullPath, 'utf8')
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      continue
    }
    if (!data.slug) continue
    const hero = pickHero(data.slug, data.image || data.aiImageUrl)
    if (hero && data.image !== hero) {
      data.image = hero
      data.aiImageUrl = hero
      await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8')
      updated++
    }
  }

  const indexPath = path.join(blogDir, 'index.json')
  try {
    const idxRaw = await fs.readFile(indexPath, 'utf8')
    const idxData = JSON.parse(idxRaw)
    let touched = false
    const next = idxData.map((entry) => {
      if (!entry.slug) return entry
      const hero = pickHero(entry.slug, entry.image)
      if (hero && entry.image !== hero) {
        touched = true
        return { ...entry, image: hero }
      }
      return entry
    })
    if (touched) {
      await fs.writeFile(indexPath, JSON.stringify(next, null, 2), 'utf8')
    }
  } catch (err) {
    console.warn('Skipped index.json update:', err.message)
  }

  console.log(`✅ Updated hero images for ${updated} blog files.`)
}

run().catch((err) => {
  console.error('❌ Failed to fix blog images:', err)
  process.exit(1)
})

