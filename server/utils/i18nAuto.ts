import { getOpenAIManager } from './openaiManager'
import { applyTranslations, diffIdToEn, readLocale, readMeta, writeLocale, writeMeta, buildMetaFromId, type LocaleMessages } from './i18nStore'

export interface TranslateSummary {
  translatedCount: number
  missingCount: number
  changedCount: number
  skipped: boolean
  reason?: string
  updated?: boolean
  details?: { keys: string[] }
}

async function batchTranslate(pairs: Array<{ key: string, text: string }>, source: string, target: string): Promise<Record<string, string>> {
  if (pairs.length === 0) return {}
  const mappingPrompt = pairs.map(p => `- ${p.key}: ${p.text}`).join('\n')
  const system = `You are a translation engine. Translate from ${source} to ${target}. Return ONLY a valid JSON object mapping keys to translated strings. Do not include comments or markdown.`
  const user = `Translate these items. Keep punctuation and numbers. Output JSON with same keys.\n\n${mappingPrompt}`

  const manager = getOpenAIManager()
  const content = await manager.chatCompletionText({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  })

  try {
    const json = JSON.parse(content || '{}')
    return json as Record<string, string>
  } catch {
    // Fallback: return empty so we don't corrupt files
    return {}
  }
}

export async function translateMissingIdToEn(): Promise<TranslateSummary> {
  const hasAnyKey = Boolean(process.env.CHATGPT_API_KEYS || process.env.OPENAI_API_KEYS || process.env.OPENAI_API_KEY)
  if (!hasAnyKey) {
    return { translatedCount: 0, missingCount: 0, changedCount: 0, skipped: true, reason: 'OPENAI_API_KEY/CHATGPT_API_KEYS not configured' }
  }

  const holdInfo = getOpenAIManager().getHoldInfo()
  if (holdInfo.onHold) {
    return { translatedCount: 0, missingCount: 0, changedCount: 0, skipped: true, reason: 'OPENAI_ON_HOLD' }
  }

  const [id, en, meta] = await Promise.all([
    readLocale('id'),
    readLocale('en'),
    readMeta()
  ])

  const { missingKeys, changedKeys, idFlat } = diffIdToEn(id, en, meta)
  const keysToTranslate = Array.from(new Set([...missingKeys, ...changedKeys]))

  if (keysToTranslate.length === 0) {
    // Update meta to ensure it's in sync
    meta.en = buildMetaFromId(idFlat)
    await writeMeta(meta)
    return { translatedCount: 0, missingCount: 0, changedCount: 0, skipped: false, updated: false, details: { keys: [] } }
  }

  // Batch in chunks to respect token limits
  const chunkSize = 50
  const results: Record<string, string> = {}
  for (let i = 0; i < keysToTranslate.length; i += chunkSize) {
    const chunk = keysToTranslate.slice(i, i + chunkSize)
    const pairs = chunk.map(key => ({ key, text: idFlat[key] }))
    const translated = await batchTranslate(pairs, 'Indonesian', 'English')
    Object.assign(results, translated)
  }

  // Merge into existing en messages
  const newEn: LocaleMessages = applyTranslations(en, results)
  await writeLocale('en', newEn)

  // Update meta hashes based on current id
  meta.en = buildMetaFromId(idFlat)
  await writeMeta(meta)

  return {
    translatedCount: Object.keys(results).length,
    missingCount: missingKeys.length,
    changedCount: changedKeys.length,
    skipped: false,
    updated: true,
    details: { keys: keysToTranslate }
  }
}

export async function getMessages(locale: 'id' | 'en') {
  return readLocale(locale)
}
