// server/utils/blog-cache.ts
import { promises as fs, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export type CachedPost = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  categories: string[]
  tags: string[]
  aiImageUrl?: string
}

export type CachedIndexItem = Pick<CachedPost, 'id' | 'slug' | 'title' | 'date' | 'image'> & {
  excerpt?: string
}

let resolvedCacheDir: string | null = null
function getCacheDir(): string {
  if (resolvedCacheDir) return resolvedCacheDir

  const candidates: string[] = []
  const cwd = process.cwd()
  // Common runtime directories (dev and production)
  candidates.push(join(cwd, 'data', 'blog'))
  candidates.push(join(cwd, '..', 'data', 'blog'))
  candidates.push(join(cwd, '..', '..', 'data', 'blog'))

  // Paths relative to this module file (works in bundled Nitro too)
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    candidates.push(join(here, '..', '..', 'data', 'blog'))
    candidates.push(join(here, '..', '..', '..', 'data', 'blog'))
  } catch {}

  // Pick the first candidate that contains index.json or exists as a directory
  for (const dir of candidates) {
    if (existsSync(join(dir, 'index.json')) || existsSync(dir)) {
      resolvedCacheDir = dir
      break
    }
  }
  resolvedCacheDir = resolvedCacheDir || candidates[0]
  return resolvedCacheDir
}

function getIndexPath(): string {
  return join(getCacheDir(), 'index.json')
}

function getPostPath(slug: string): string {
  return join(getCacheDir(), `${slug}.json`)
}

async function ensureDir(): Promise<void> {
  try {
    await fs.mkdir(getCacheDir(), { recursive: true })
  } catch {}
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const buf = await fs.readFile(file, 'utf-8')
    return JSON.parse(buf) as T
  } catch {
    return null
  }
}

async function writeJson(file: string, data: any): Promise<void> {
  await ensureDir()
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(file, json, 'utf-8')
}

export async function getPostFromCache(slug: string): Promise<CachedPost | null> {
  if (!slug) return null
  return await readJson<CachedPost>(getPostPath(slug))
}

export async function savePostToCache(post: CachedPost): Promise<void> {
  if (!post?.slug) return
  await writeJson(getPostPath(post.slug), post)
  try { await updateIndexItem(post) } catch {}
}

export async function listCachedPosts(): Promise<CachedIndexItem[]> {
  const idx = await readJson<CachedIndexItem[]>(getIndexPath())
  return Array.isArray(idx) ? idx : []
}

export async function saveIndex(items: CachedIndexItem[]): Promise<void> {
  // Normalize and de-duplicate by slug, keep latest date first
  const map = new Map<string, CachedIndexItem>()
  for (const it of items) {
    if (!it?.slug) continue
    map.set(it.slug, {
      id: Number(it.id) || 0,
      slug: String(it.slug),
      title: String(it.title || ''),
      date: String(it.date || ''),
      image: String(it.image || ''),
      excerpt: typeof it.excerpt === 'string' ? it.excerpt : undefined,
    })
  }
  const arr = Array.from(map.values())
  arr.sort((a, b) => (Date.parse(b.date || '') || 0) - (Date.parse(a.date || '') || 0))
  await writeJson(getIndexPath(), arr)
}

async function updateIndexItem(post: CachedPost): Promise<void> {
  const current = await listCachedPosts()
  const filtered = current.filter(it => it.slug !== post.slug)
  const item: CachedIndexItem = {
    id: Number(post.id) || 0,
    slug: String(post.slug),
    title: String(post.title || ''),
    date: String(post.date || ''),
    image: String(post.image || ''),
    excerpt: String(post.excerpt || ''),
  }
  await saveIndex([item, ...filtered])
}

export async function saveManyPosts(posts: CachedPost[]): Promise<void> {
  await ensureDir()
  for (const p of posts) {
    await savePostToCache(p)
  }
}
