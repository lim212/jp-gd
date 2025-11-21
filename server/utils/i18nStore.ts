import { promises as fs } from 'fs'
import path from 'path'

export type LocaleMessages = Record<string, any>

const projectRoot = process.cwd()
const localesDir = path.join(projectRoot, 'locales')
const dataDir = path.join(projectRoot, 'data')
const metaPath = path.join(dataDir, 'i18n-meta.json')

async function ensureDir(dir: string) {
  try { await fs.mkdir(dir, { recursive: true }) } catch {}
}

async function writeFileAtomic(file: string, json: string) {
  const tmp = `${file}.tmp`
  await fs.writeFile(tmp, json, 'utf-8')
  await fs.rename(tmp, file)
}

export async function readLocale(locale: 'id' | 'en'): Promise<LocaleMessages> {
  const file = path.join(localesDir, `${locale}.json`)
  try {
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export async function writeLocale(locale: 'id' | 'en', messages: LocaleMessages) {
  await ensureDir(localesDir)
  const file = path.join(localesDir, `${locale}.json`)
  const json = JSON.stringify(messages, null, 2)
  await writeFileAtomic(file, json)
}

export interface MetaMap { en?: Record<string, string> }

export async function readMeta(): Promise<MetaMap> {
  await ensureDir(dataDir)
  try {
    const raw = await fs.readFile(metaPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { en: {} }
  }
}

export async function writeMeta(meta: MetaMap) {
  await ensureDir(dataDir)
  const json = JSON.stringify(meta, null, 2)
  await writeFileAtomic(metaPath, json)
}

function flatten(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of Object.keys(obj || {})) {
    const val = obj[key]
    const p = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object') {
      Object.assign(out, flatten(val, p))
    } else if (typeof val === 'string') {
      out[p] = val
    }
  }
  return out
}

function setByPath(target: any, pathKey: string, value: string) {
  const parts = pathKey.split('.')
  let cur = target
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]
    if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {}
    cur = cur[k]
  }
  cur[parts[parts.length - 1]] = value
}

function hash(str: string) {
  // simple non-crypto hash
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i)
    h |= 0
  }
  return String(h)
}

export interface DiffResult {
  missingKeys: string[]
  changedKeys: string[]
  idFlat: Record<string, string>
  enFlat: Record<string, string>
}

export function diffIdToEn(idMessages: LocaleMessages, enMessages: LocaleMessages, meta: MetaMap): DiffResult {
  const idFlat = flatten(idMessages)
  const enFlat = flatten(enMessages)
  const metaEn = meta.en || {}
  const missingKeys: string[] = []
  const changedKeys: string[] = []

  for (const key of Object.keys(idFlat)) {
    const idVal = idFlat[key]
    const enVal = enFlat[key]
    const h = hash(idVal)
    const stored = metaEn[key]

    if (enVal === undefined) {
      missingKeys.push(key)
    } else if (!stored) {
      // No meta: if en seems exact same as id (not translated), treat as changed to force translation
      if (enVal.trim() === idVal.trim()) changedKeys.push(key)
    } else if (stored !== h) {
      changedKeys.push(key)
    }
  }

  return { missingKeys, changedKeys, idFlat, enFlat }
}

export function applyTranslations(base: LocaleMessages, updates: Record<string, string>): LocaleMessages {
  const clone = JSON.parse(JSON.stringify(base || {}))
  if (updates && typeof updates === 'object') {
    for (const [k, v] of Object.entries(updates)) {
      setByPath(clone, k, v)
    }
  }
  return clone
}

export function buildMetaFromId(idFlat: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  if (idFlat && typeof idFlat === 'object') {
    for (const [k, v] of Object.entries(idFlat)) out[k] = hash(v)
  }
  return out
}
