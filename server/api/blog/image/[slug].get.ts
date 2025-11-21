import { defineEventHandler, getRouterParam } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

const mimeByExtension: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
}

export default defineEventHandler(async (event) => {
  const slugParam = getRouterParam(event, 'slug') || ''

  let baseName = slugParam
  let requestedExt = ''

  const extMatch = slugParam.match(/(\.[a-zA-Z0-9]+)$/)
  if (extMatch) {
    requestedExt = extMatch[1].toLowerCase()
    baseName = slugParam.slice(0, -requestedExt.length)
  }

  const imageDir = path.join(process.cwd(), 'data', 'blog', 'images')
  const tryExtensions = requestedExt
    ? [requestedExt]
    : ['.webp', '.jpg', '.jpeg', '.png']

  for (const ext of tryExtensions) {
    const filePath = path.join(imageDir, `${baseName}${ext}`)
    try {
      const file = await fs.readFile(filePath)
      const mime = mimeByExtension[ext] || 'application/octet-stream'
      event.node.res.setHeader('Content-Type', mime)
      event.node.res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
      return file
    } catch (error) {
      // continue to next extension
    }
  }

  const fallbackPath = path.join(process.cwd(), 'public', 'images', 'fallback-news.svg')
  try {
    const fallback = await fs.readFile(fallbackPath)
    event.node.res.setHeader('Content-Type', 'image/svg+xml')
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    return fallback
  } catch (error) {
    event.node.res.statusCode = 404
    return 'Image not found'
  }
})
















