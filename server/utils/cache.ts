// server/utils/cache.ts
// Minimal, safe in-memory cache with TTL to support API handlers.
// If you later add Redis, you can replace these implementations while keeping the same interface.

interface CacheEntry<T = unknown> {
  value: T
  expiresAt: number // epoch ms
}

const memoryCache = new Map<string, CacheEntry>()

// Default TTL: 5 minutes
const DEFAULT_TTL_SECONDS = Number.parseInt(process.env.CACHE_TTL_SECONDS || '300') || 300

function now(): number {
  return Date.now()
}

function cleanupExpired(): void {
  const t = now()
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt <= t) {
      memoryCache.delete(key)
    }
  }
}

export async function getCached<T = unknown>(key: string): Promise<T | null> {
  try {
    const entry = memoryCache.get(key)
    if (!entry) return null
    if (entry.expiresAt <= now()) {
      memoryCache.delete(key)
      return null
    }
    return entry.value as T
  } catch {
    return null
  } finally {
    // Opportunistic cleanup
    if (Math.random() < 0.05) cleanupExpired()
  }
}

export async function setCache<T = unknown>(key: string, value: T, ttlSeconds: number = DEFAULT_TTL_SECONDS): Promise<void> {
  try {
    const expiresAt = now() + Math.max(1, ttlSeconds) * 1000
    memoryCache.set(key, { value, expiresAt })
  } catch {
    // no-op if memory cache fails
  } finally {
    if (Math.random() < 0.05) cleanupExpired()
  }
}

function patternToRegex(pattern: string): RegExp {
  // Escape regex special chars except '*', then convert '*' to '.*'
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  const regexStr = '^' + escaped.replace(/\*/g, '.*') + '$'
  return new RegExp(regexStr)
}

export async function invalidateCache(pattern?: string): Promise<number> {
  try {
    if (!pattern || pattern === '*') {
      const count = memoryCache.size
      memoryCache.clear()
      return count
    }

    const rx = patternToRegex(pattern)
    let removed = 0
    for (const key of Array.from(memoryCache.keys())) {
      if (rx.test(key)) {
        memoryCache.delete(key)
        removed++
      }
    }
    return removed
  } catch {
    return 0
  }
}

export default {
  getCached,
  setCache,
  invalidateCache,
}
