import { promises as fs } from 'fs'
import path from 'path'
import { readLocale, type LocaleMessages } from './i18nStore'

async function ensureDir(dir: string) {
  try { await fs.mkdir(dir, { recursive: true }) } catch {}
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function flatten(obj: any, out: string[] = []) {
  try {
    if (!obj || typeof obj !== 'object') return out
    for (const key of Object.keys(obj)) {
      const val = (obj as any)[key]
      if (val && typeof val === 'object') {
        flatten(val, out)
      } else if (typeof val === 'string') {
        out.push(val)
      }
    }
  } catch {}
  return out
}

function renderHtmlFromMessages(locale: 'id' | 'en', messages: LocaleMessages) {
  const values = flatten(messages)
    .map(v => v && v.trim())
    .filter(Boolean) as string[]

  const items = values.map(v => `<p>${escapeHtml(v)}</p>`).join('\n')

  const html = `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Text Snapshot ${locale.toUpperCase()}</title>
</head>
<body>
${items}
</body>
</html>`
  return html
}

export async function writeHtmlSnapshot(locale: 'id' | 'en') {
  const projectRoot = process.cwd()
  const outDir = path.join(projectRoot, 'public', 'generated', 'i18n')
  await ensureDir(outDir)

  const messages = await readLocale(locale)
  const html = renderHtmlFromMessages(locale, messages)
  const file = path.join(outDir, `${locale}.html`)
  await fs.writeFile(file, html, 'utf-8')
  return file
}

export async function writeAllSnapshots() {
  const files: string[] = []
  for (const loc of ['id', 'en'] as const) {
    const f = await writeHtmlSnapshot(loc)
    files.push(f)
  }
  return files
}
