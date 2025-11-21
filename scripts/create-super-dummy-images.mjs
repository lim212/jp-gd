import { promises as fs } from 'fs'
import path from 'path'

const outputDir = path.resolve(process.cwd(), 'public', 'images', 'dummy', 'super')
const totalImages = 60

const palettes = [
  ['#32d5ff', '#8245ff', '#120d2c'],
  ['#ff7eb3', '#ff758c', '#2b1331'],
  ['#46c2ff', '#00ffa3', '#012025'],
  ['#ffd86f', '#fc6262', '#24120f'],
  ['#87f1ff', '#a06bff', '#1d1d33'],
  ['#ffafbd', '#ffc3a0', '#312527'],
  ['#c471ed', '#f64f59', '#211726'],
  ['#5ee7df', '#b490ca', '#15202b'],
  ['#fad961', '#f76b1c', '#2b1d0e'],
  ['#89fffd', '#ef32d9', '#150e25'],
  ['#fddb92', '#d1fdff', '#332616'],
  ['#a18cd1', '#fbc2eb', '#1d1724']
]

const noisePatterns = [
  'M0 10 Q15 0 30 10 T60 10 T120 10',
  'M0 20 Q20 5 40 20 T80 20 T160 20',
  'M0 15 Q25 0 50 15 T100 15 T200 15',
  'M0 12 Q18 2 36 12 T72 12 T144 12',
  'M0 18 Q22 3 44 18 T88 18 T176 18'
]

function createSvgContent(idx, palette) {
  const [start, end, background] = palette
  const wave = noisePatterns[idx % noisePatterns.length]
  const gradientId = `grad-${idx}`
  const noiseId = `noise-${idx}`
  const accentOpacity = (0.12 + (idx % 5) * 0.05).toFixed(2)
  const blur = 20 + (idx % 4) * 5

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="640" height="400" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blog placeholder image ${idx + 1}">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${start}"/>
      <stop offset="100%" stop-color="${end}"/>
    </linearGradient>
    <filter id="glow-${idx}">
      <feGaussianBlur stdDeviation="${blur}" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="${noiseId}" width="120" height="40" patternUnits="userSpaceOnUse">
      <path d="${wave}" stroke="rgba(255,255,255,0.14)" stroke-width="1.5" fill="none"/>
    </pattern>
  </defs>

  <rect width="320" height="200" fill="${background}"/>
  <rect width="320" height="200" fill="url(#${gradientId})" opacity="0.95"/>
  <circle cx="${80 + (idx % 5) * 20}" cy="${70 + (idx % 3) * 15}" r="80" fill="${start}" opacity="${accentOpacity}" filter="url(#glow-${idx})"/>
  <circle cx="${200 + (idx % 4) * 18}" cy="${130 - (idx % 2) * 12}" r="60" fill="${end}" opacity="${accentOpacity}" filter="url(#glow-${idx})"/>
  <rect width="320" height="200" fill="url(#${noiseId})" opacity="0.18"/>
  <rect x="32" y="140" width="256" height="32" rx="16" fill="rgba(0,0,0,0.25)" />
  <rect x="48" y="146" width="${120 + (idx % 6) * 20}" height="8" rx="4" fill="rgba(255,255,255,0.85)" />
  <rect x="48" y="160" width="${80 + (idx % 5) * 16}" height="6" rx="3" fill="rgba(255,255,255,0.55)" />
  <circle cx="48" cy="100" r="36" fill="rgba(0,0,0,0.2)" />
  <path d="M32 108 Q48 ${86 + (idx % 5) * 2} 64 108" stroke="rgba(255,255,255,0.3)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M38 94 Q48 ${80 + (idx % 4) * 3} 58 94" stroke="rgba(255,255,255,0.35)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="32" y="36" fill="rgba(255,255,255,0.4)" font-family="Inter, Arial, sans-serif" font-size="12" letter-spacing="0.2em">JASAPEMBAYARAN</text>
  <text x="32" y="60" fill="rgba(255,255,255,0.85)" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">Blog Highlight</text>
</svg>`
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function generate() {
  await ensureDir(outputDir)
  const tasks = []
  for (let i = 0; i < totalImages; i++) {
    const palette = palettes[i % palettes.length]
    const svg = createSvgContent(i, palette)
    const filename = `super-dummy-${String(i + 1).padStart(2, '0')}.svg`
    const filePath = path.join(outputDir, filename)
    tasks.push(fs.writeFile(filePath, svg, 'utf8'))
  }
  await Promise.all(tasks)
  console.log(`✅ Generated ${totalImages} super dummy images in ${outputDir}`)
}

generate().catch((err) => {
  console.error('Failed to generate dummy images:', err)
  process.exit(1)
})

