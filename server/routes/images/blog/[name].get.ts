// server/routes/images/blog/[name].get.ts
// Serves locally cached blog hero images from data\\blog\\images as /images/blog/<name>
import { defineEventHandler, getRouterParam, createError, setHeader, sendStream } from 'h3'
import { createReadStream, promises as fsp } from 'fs'
import { join, basename } from 'path'

function imagesDir() {
  return join(process.cwd(), 'data', 'blog', 'images')
}

function detectContentType(fileName: string): string {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  return 'application/octet-stream'
}

export default defineEventHandler(async (event) => {
  const name = String(getRouterParam(event, 'name') || '')
  if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image name' })
  }
  const safeName = basename(name)
  const filePath = join(imagesDir(), safeName)
  try {
    await fsp.access(filePath)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' })
  }
  const type = detectContentType(safeName)
  setHeader(event, 'Content-Type', type)
  return sendStream(event, createReadStream(filePath))
})
