import OpenAI from 'openai'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'node:crypto'

// Centralized OpenAI manager with:
// - Key pooling (supports multiple keys via CHATGPT_API_KEYS or OPENAI_API_KEYS or fallback to OPENAI_API_KEY)
// - Persistent deduplication cache (to avoid repeated/duplicate calls)
// - Failure tracking with 10 consecutive all-keys-failed rounds -> 3 hours hold (configurable)
// - Simple rotation and test connection

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionParams {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  response_format?: { type: 'json_object' | 'text' }
  // Optional dedup ID if caller wants explicit stability key
  dedupId?: string
}

interface CompletionCacheEntry {
  content: string
  ts: number
}

interface ModerationCacheEntry {
  result: any
  ts: number
}

interface OpenAIState {
  lastKeyIndex: number
  consecutiveAllKeysFailures: number
  holdUntil: number | null
  perKeyFailureCounts: Record<string, number>
}

const projectRoot = process.cwd()
const dataDir = path.join(projectRoot, 'data')
const statePath = path.join(dataDir, 'openai-state.json')
const completionCachePath = path.join(dataDir, 'openai-completions-cache.json')
const moderationCachePath = path.join(dataDir, 'openai-moderation-cache.json')

function now() { return Date.now() }

async function ensureDir(dir: string) {
  try { await fs.mkdir(dir, { recursive: true }) } catch {}
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try { const raw = await fs.readFile(file, 'utf-8'); return JSON.parse(raw) as T } catch { return fallback }
}

async function writeJson(file: string, data: any) {
  const tmp = file + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, file)
}

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

function getEnvKeys(): string[] {
  const multi = process.env.CHATGPT_API_KEYS || process.env.OPENAI_API_KEYS
  const single = process.env.OPENAI_API_KEY
  const values = multi ? multi.split(',') : (single ? [single] : [])
  return values.map(k => k.trim()).filter(Boolean)
}

const HOLD_FAILS = Number.parseInt(process.env.CHATGPT_HOLD_FAILS || '10') || 10
const HOLD_MS = Number.parseInt(process.env.CHATGPT_HOLD_MS || String(3 * 60 * 60 * 1000)) || (3 * 60 * 60 * 1000)

class OpenAIManager {
  private state: OpenAIState = { lastKeyIndex: -1, consecutiveAllKeysFailures: 0, holdUntil: null, perKeyFailureCounts: {} }
  private stateLoaded = false
  private keys: string[] = []

  private completionCache: Record<string, CompletionCacheEntry> = {}
  private moderationCache: Record<string, ModerationCacheEntry> = {}
  private cachesLoaded = false

  private async loadStateAndCaches() {
    if (!this.stateLoaded) {
      await ensureDir(dataDir)
      this.state = await readJson<OpenAIState>(statePath, { lastKeyIndex: -1, consecutiveAllKeysFailures: 0, holdUntil: null, perKeyFailureCounts: {} })
      this.stateLoaded = true
    }
    if (!this.cachesLoaded) {
      this.completionCache = await readJson<Record<string, CompletionCacheEntry>>(completionCachePath, {})
      this.moderationCache = await readJson<Record<string, ModerationCacheEntry>>(moderationCachePath, {})
      this.cachesLoaded = true
    }
    if (this.keys.length === 0) {
      this.keys = getEnvKeys()
    }
  }

  private async saveState() {
    await writeJson(statePath, this.state)
  }

  private async saveCompletionCache() {
    await writeJson(completionCachePath, this.completionCache)
  }

  private async saveModerationCache() {
    await writeJson(moderationCachePath, this.moderationCache)
  }

  private isOnHold(): boolean {
    if (!this.state.holdUntil) return false
    return now() < this.state.holdUntil
  }

  getHoldInfo() {
    return {
      onHold: this.isOnHold(),
      holdUntil: this.state.holdUntil || null,
      consecutiveAllKeysFailures: this.state.consecutiveAllKeysFailures,
      lastKeyIndex: this.state.lastKeyIndex,
      perKeyFailureCounts: this.state.perKeyFailureCounts,
      keysConfigured: this.keys.length
    }
  }

  private pickNextKeyIndex(): number {
    if (this.keys.length === 0) return -1
    const next = (this.state.lastKeyIndex + 1) % this.keys.length
    return next
  }

  private makeClient(index: number): OpenAI | null {
    if (index < 0 || index >= this.keys.length) return null
    const apiKey = this.keys[index]
    if (!apiKey) return null
    return new OpenAI({ apiKey, organization: process.env.OPENAI_ORG_ID })
  }

  private completionDedupKey(params: ChatCompletionParams): string {
    if (params.dedupId) return params.dedupId
    const base = {
      t: 'chat',
      model: params.model,
      messages: params.messages,
      temperature: params.temperature ?? null,
      max_tokens: params.max_tokens ?? null,
      response_format: params.response_format?.type || null
    }
    return sha256(JSON.stringify(base))
  }

  async chatCompletionRaw(params: ChatCompletionParams): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    await this.loadStateAndCaches()

    // Dedup before attempting to use any key
    const dedupKey = this.completionDedupKey(params)
    const cached = this.completionCache[dedupKey]
    if (cached) {
      // Return minimal compatible structure
      return {
        id: 'cached_' + dedupKey.slice(0, 8),
        object: 'chat.completion',
        created: Math.floor(cached.ts / 1000),
        model: params.model,
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: cached.content },
            finish_reason: 'stop',
            logprobs: null as any
          }
        ],
        usage: undefined as any,
        system_fingerprint: undefined as any
      } as unknown as OpenAI.Chat.Completions.ChatCompletion
    }

    if (this.isOnHold()) {
      const err: any = new Error('openai_on_hold')
      err.code = 'OPENAI_ON_HOLD'
      throw err
    }

    let success = false
    const startIndex = this.pickNextKeyIndex()

    // Try each key once per round
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.keys.length === 0 ? -1 : ((startIndex + attempt) % this.keys.length)
      const client = this.makeClient(idx)
      if (!client) break

      try {
        const res = await client.chat.completions.create({
          model: params.model,
          messages: params.messages,
          temperature: params.temperature,
          max_tokens: params.max_tokens,
          response_format: params.response_format
        })
        const content = res.choices?.[0]?.message?.content ?? ''
        this.completionCache[dedupKey] = { content, ts: now() }
        await this.saveCompletionCache()

        this.state.lastKeyIndex = idx
        this.state.consecutiveAllKeysFailures = 0
        await this.saveState()
        success = true
        return res
      } catch (e) {
        const key = this.keys[idx]
        this.state.perKeyFailureCounts[key] = (this.state.perKeyFailureCounts[key] || 0) + 1
        await this.saveState()
        // try next key
      }
    }

    // All keys failed in this round
    if (!success) {
      this.state.consecutiveAllKeysFailures += 1
      if (this.state.consecutiveAllKeysFailures >= HOLD_FAILS) {
        this.state.holdUntil = now() + HOLD_MS
        this.state.consecutiveAllKeysFailures = 0 // reset after placing on hold
      }
      await this.saveState()
      const err: any = new Error('openai_all_keys_failed')
      err.code = 'OPENAI_ALL_KEYS_FAILED'
      throw err
    }

    // Should not reach here
    const err: any = new Error('openai_unexpected')
    err.code = 'OPENAI_UNEXPECTED'
    throw err
  }

  async chatCompletionText(params: ChatCompletionParams): Promise<string> {
    const res = await this.chatCompletionRaw(params)
    return res.choices?.[0]?.message?.content?.toString() ?? ''
  }

  private moderationDedupKey(input: string | string[]): string {
    const arr = Array.isArray(input) ? input : [input]
    return sha256(JSON.stringify({ t: 'moderation', input: arr }))
  }

  async moderate(input: string | string[]): Promise<any> {
    await this.loadStateAndCaches()

    const dedupKey = this.moderationDedupKey(input)
    const cached = this.moderationCache[dedupKey]
    if (cached) {
      return cached.result
    }

    if (this.isOnHold()) {
      const err: any = new Error('openai_on_hold')
      err.code = 'OPENAI_ON_HOLD'
      throw err
    }

    let success = false
    const startIndex = this.pickNextKeyIndex()

    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.keys.length === 0 ? -1 : ((startIndex + attempt) % this.keys.length)
      const client = this.makeClient(idx)
      if (!client) break

      try {
        // model omitted to use default moderation model per SDK
        const res = await client.moderations.create({ input }) as any
        this.moderationCache[dedupKey] = { result: res, ts: now() }
        await this.saveModerationCache()

        this.state.lastKeyIndex = idx
        this.state.consecutiveAllKeysFailures = 0
        await this.saveState()
        success = true
        return res
      } catch (e) {
        const key = this.keys[idx]
        this.state.perKeyFailureCounts[key] = (this.state.perKeyFailureCounts[key] || 0) + 1
        await this.saveState()
      }
    }

    if (!success) {
      this.state.consecutiveAllKeysFailures += 1
      if (this.state.consecutiveAllKeysFailures >= HOLD_FAILS) {
        this.state.holdUntil = now() + HOLD_MS
        this.state.consecutiveAllKeysFailures = 0
      }
      await this.saveState()
      const err: any = new Error('openai_all_keys_failed')
      err.code = 'OPENAI_ALL_KEYS_FAILED'
      throw err
    }

    const err: any = new Error('openai_unexpected')
    err.code = 'OPENAI_UNEXPECTED'
    throw err
  }

  async testConnection(): Promise<void> {
    await this.loadStateAndCaches()
    if (this.isOnHold()) {
      const err: any = new Error('openai_on_hold')
      err.code = 'OPENAI_ON_HOLD'
      throw err
    }

    let success = false
    const startIndex = this.pickNextKeyIndex()

    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.keys.length === 0 ? -1 : ((startIndex + attempt) % this.keys.length)
      const client = this.makeClient(idx)
      if (!client) break
      try {
        // Simple, fast call
        await client.models.list()
        this.state.lastKeyIndex = idx
        this.state.consecutiveAllKeysFailures = 0
        await this.saveState()
        success = true
        return
      } catch (e) {
        const key = this.keys[idx]
        this.state.perKeyFailureCounts[key] = (this.state.perKeyFailureCounts[key] || 0) + 1
        await this.saveState()
      }
    }

    if (!success) {
      this.state.consecutiveAllKeysFailures += 1
      if (this.state.consecutiveAllKeysFailures >= HOLD_FAILS) {
        this.state.holdUntil = now() + HOLD_MS
        this.state.consecutiveAllKeysFailures = 0
      }
      await this.saveState()
      const err: any = new Error('openai_all_keys_failed')
      err.code = 'OPENAI_ALL_KEYS_FAILED'
      throw err
    }
  }
}

let singleton: OpenAIManager | null = null
export function getOpenAIManager(): OpenAIManager {
  if (!singleton) singleton = new OpenAIManager()
  return singleton
}

export default getOpenAIManager
