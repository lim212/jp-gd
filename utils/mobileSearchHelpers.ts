export const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const highlightMatch = (text: string, query: string) => {
  if (!text || !query) return text
  try {
    const regex = new RegExp(escapeRegExp(query.trim()), 'gi')
    return text.replace(regex, (match) => `<mark class="mobile-highlight">${match}</mark>`)
  } catch {
    return text
  }
}

export const getArticleExcerpt = (article: any) => {
  const raw =
    article?.excerpt ||
    article?.description ||
    article?.summary ||
    article?.seoDescription ||
    ''

  if (!raw) return ''

  const plain = String(raw)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= 160) return plain
  return `${plain.slice(0, 157).trim()}…`
}

export const getPrimaryCategory = (article: any) => {
  if (Array.isArray(article?.categories) && article.categories.length) {
    return article.categories[0]
  }
  if (Array.isArray(article?.tags) && article.tags.length) {
    return article.tags[0]
  }
  if (typeof article?.category === 'string') {
    return article.category
  }
  return ''
}

export const getReadingTime = (article: any) => {
  if (typeof article?.readingTime?.text === 'string') {
    return article.readingTime.text
  }
  if (typeof article?.timeToRead === 'number') {
    return `${article.timeToRead} menit`
  }
  if (typeof article?.reading_time === 'string') {
    return article.reading_time
  }
  return ''
}

export const formatPublishedDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}












