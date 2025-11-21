// server/utils/moderation.ts
import { getOpenAIManager } from './openaiManager'

export interface ModerationResult {
  approved: boolean
  issues: string[]
  scores?: Record<string, number>
}

export async function moderateContent(
  content: string,
  title: string
): Promise<ModerationResult> {
  const manager = getOpenAIManager()

  // Check with OpenAI moderation API (deduped internally)
  const moderation: any = await manager.moderate(content + "\n" + title)
  const results = (moderation?.results && moderation.results[0]) || { flagged: false, categories: {}, category_scores: {} }

  // Custom content checks
  const customChecks = {
    minLength: content.length >= 500,
    hasHeadings: content.includes('<h2>') || content.includes('<h3>'),
    hasParagraphs: (content.match(/<p>/g) || []).length >= 3
  }

  const issues: string[] = []

  // Check OpenAI flags
  if (results.flagged) {
    Object.entries(results.categories || {}).forEach(([category, flagged]) => {
      if (flagged) {
        issues.push(`Content flagged for ${category}`)
      }
    })
  }

  // Check custom rules
  if (!customChecks.minLength) {
    issues.push('Content is too short (minimum 500 characters)')
  }
  if (!customChecks.hasHeadings) {
    issues.push('Content lacks proper heading structure')
  }
  if (!customChecks.hasParagraphs) {
    issues.push('Content needs more paragraphs')
  }

  return {
    approved: issues.length === 0,
    issues,
    scores: results.category_scores || {}
  }
}
